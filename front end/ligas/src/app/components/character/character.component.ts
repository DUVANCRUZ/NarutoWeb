import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent {
  @Input() character: any;
  @Output() favoriteChanged = new EventEmitter<number>();

  constructor(private router: Router, private http: HttpClient) {}

  redirectToDetails(id: number) {
    this.router.navigate(['/char', id]);
  }

  toggleFavorite() {
    this.character.favorite = !this.character.favorite;
    this.updateLocalStorage();
    this.favoriteChanged.emit(this.character.id);
  }

  updateLocalStorage() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const characterIndex = favorites.findIndex((fav: any) => fav.id === this.character.id);

    if (this.character.favorite) {
      if (characterIndex === -1) {
        favorites.push(this.character);
      }
    } else {
      if (characterIndex !== -1) {
        favorites.splice(characterIndex, 1);
      }
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}
