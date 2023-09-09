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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = isNaN(Number(idParam)) ? idParam : Number(idParam);
      const url = `https://naruto-back.onrender.com/char/${id}`;
      this.http.get<Character>(url).subscribe((character: Character) => {
        this.character = character;
      });
    });
  }

  toggleJutsus(): void {
    this.showJutsus = !this.showJutsus;
  }
}
