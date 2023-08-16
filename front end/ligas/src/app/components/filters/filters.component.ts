import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Output() filtersChanged = new EventEmitter<any>();

  ranks: string | null = null;
  sex: string | null = null;
  clan: string | null = null;
  order: string | null = null;

  // Opciones únicas para los filtros
  rankOptions = new Set<string>();
  sexOptions = new Set<string>();
  clanOptions = new Set<string>();

  constructor(private http: HttpClient) {
    this.fetchOptions();
  }

  fetchOptions() {
    this.http.get<any[]>('http://localhost:5000/char/app')
      .subscribe(data => {
        data.forEach(character => {
          this.rankOptions.add(character.rankI);
          this.rankOptions.add(character.rankII);
          this.sexOptions.add(character.sex);
          this.clanOptions.add(character.clan);
        });
      });
  }

  updateFilters() {
    const filters = {
      ranks: this.ranks,
      sex: this.sex,
      clan: this.clan,
      order: this.order
    };
    this.filtersChanged.emit(filters);
  }

  resetFilters() {
    this.ranks = null;
    this.sex = null;
    this.clan = null;
    this.order = null;
    this.updateFilters();
  }
}
