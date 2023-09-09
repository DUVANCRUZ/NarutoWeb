import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  characters: any[] = [];
  currentPage: number = 1;
  charactersPerPage: number = 9;
  totalPages: number = 0;
  visiblePageCount: number = 7;
  searchQuery: string = '';

  constructor(private http: HttpClient) { }

  currentFilters: any = {}; // Agrega esta propiedad para almacenar los filtros actuales

  ngOnInit(): void {
    this.fetchCharacters();
  }

  fetchCharacters() {
    const startIndex = (this.currentPage - 1) * this.charactersPerPage;
    const endIndex = startIndex + this.charactersPerPage;

    let url = 'https://naruto-back.onrender.com/char/app';
    
    // Considera los filtros almacenados en la propiedad currentFilters
    if (this.searchQuery) {
      url = `https://naruto-back.onrender.com/char/name/${encodeURIComponent(this.searchQuery)}`;
    } else if (Object.keys(this.currentFilters).length > 0) {
      url = 'https://naruto-back.onrender.com/char/filter?';
      for (const key in this.currentFilters) {
        if (this.currentFilters[key] !== null) {
          url += `${key}=${encodeURIComponent(this.currentFilters[key])}&`;
        }
      }
    }

    this.http.get<any[]>(url)
      .subscribe(data => {
        this.characters = data.slice(startIndex, endIndex);
        this.totalPages = Math.ceil(data.length / this.charactersPerPage);
      });
  }



  getVisiblePages(): number[] {
    const halfVisiblePages = Math.floor(this.visiblePageCount / 2);
    let startPage = Math.max(1, this.currentPage - halfVisiblePages);
    const endPage = Math.min(this.totalPages, startPage + this.visiblePageCount - 1);

    if (endPage - startPage + 1 < this.visiblePageCount) {
      startPage = Math.max(1, endPage - this.visiblePageCount + 1);
    }

    const visiblePages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.fetchCharacters();
  }

  changePage(pageNumber: number) {
    this.currentPage = Math.min(this.totalPages, Math.max(1, pageNumber));
    this.fetchCharacters(); // Llama a fetchCharacters para cargar los personajes con la página y filtros actuales
  }
  
  applyFilters(filters: any) {
    this.currentFilters = filters;
    this.currentPage = 1; // También reinicia la página al aplicar nuevos filtros
    this.fetchCharacters();
  }
}
