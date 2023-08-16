import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent {
  @Input() character: any; // Asegúrate de que el tipo sea el adecuado para tus datos de personaje

  constructor(private router: Router) {}

  redirectToDetails(id: number) {
    this.router.navigate(['/char', id]);
  }
}

 

 

