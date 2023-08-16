import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


interface Character {
  clan: string | null;
  id: number;
  images: string[];
  jutsu: string[];
  name: string;
  occupation: string | null;
  rankI: string | null;
  rankII: string | null;
  sex: string | null;
  status: string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  character: Character | undefined;
  showJutsus: boolean = false;
  showCarousel: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      const url = `http://localhost:5000/char/${id}`;
      this.http.get<Character>(url).subscribe((character: Character) => {
        this.character = character;
        this.showCarousel = character.images.length > 1; // Mostrar carrusel solo si hay más de una imagen
      });
    });
  }

  toggleJutsus(): void {
    this.showJutsus = !this.showJutsus;
  }
 
}