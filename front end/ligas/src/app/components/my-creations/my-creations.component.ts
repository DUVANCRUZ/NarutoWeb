import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-creations',
  templateUrl: './my-creations.component.html',
  styleUrls: ['./my-creations.component.css']
})
export class MyCreationsComponent implements OnInit {
  characters: any[] = [];
  currentPage: number = 1;
  charactersPerPage: number = 9;
  totalPages: number = 0;
  visiblePageCount: number = 7;

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.fetchCharacters();
  }

  fetchCharacters() {
    const startIndex = (this.currentPage - 1) * this.charactersPerPage;
    const endIndex = startIndex + this.charactersPerPage;

    let url = 'https://naruto-back.onrender.com/char/';
    
   

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

  changePage(pageNumber: number) {
    this.currentPage = Math.min(this.totalPages, Math.max(1, pageNumber));
    this.fetchCharacters(); // Llama a fetchCharacters para cargar los personajes con la página y filtros actuales
  }
  
 
}
