import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteCharacters: any[] = [];
  currentPage: number = 1;
  charactersPerPage: number = 9;
  totalPages: number = 0;
  visiblePageCount: number = 7;

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.favoriteCharacters = favorites;
    this.totalPages = Math.ceil(this.favoriteCharacters.length / this.charactersPerPage);
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
  }

  removeCharacterFromFavorites(characterId: number) {
    const index = this.favoriteCharacters.findIndex(character => character.id === characterId);
    if (index !== -1) {
      this.favoriteCharacters.splice(index, 1);
      this.totalPages = Math.ceil(this.favoriteCharacters.length / this.charactersPerPage);
    }
  }
}
