import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  characterForm!: FormGroup;
  characterInCreation: any;

  sexOptions: Set<string> = new Set<string>();
  rankIOptions: Set<string> = new Set<string>();
  rankIIOptions: Set<string> = new Set<string>();
  clanOptions: Set<string> = new Set<string>();
  occupationOptions: Set<string> = new Set<string>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      occupation: ['', Validators.required],
      rankI: ['', Validators.required],
      rankII: ['', Validators.required],
      sex: ['', Validators.required],
      status: ['', Validators.required],
      clan: ['', Validators.required],
      jutsu: [''],
      images: [''],
    });

    this.loadData();

    this.characterForm.valueChanges.subscribe((value) => {
      this.characterInCreation = value;
    });
  }

  loadData(): void {
    this.http.get<any[]>('http://localhost:5000/char/app')
      .subscribe(data => {
        data.forEach(character => {
          this.rankIOptions.add(character.rankI);
          this.rankIIOptions.add(character.rankII);
          this.sexOptions.add(character.sex);
          this.clanOptions.add(character.clan);
          this.occupationOptions.add(character.occupation);
        });
      });
  }

  private resetForm(): void {
    this.characterForm.reset();
    this.characterInCreation = null;
  }

  submitForm(): void {
    if (this.characterForm.invalid) {
      return;
    }

    const formData = this.characterForm.value;
    this.saveDataToBackend(formData);
  }

  private saveDataToBackend(data: any): void {
    const backendUrl = 'http://localhost:5000/char/create';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post(backendUrl, data, httpOptions).subscribe(
      (response) => {
        console.log('Data sent successfully:', response);
        alert("Character created successfully");
        this.resetForm();
      },
      (error) => {
        console.error('Error sending data:', error);
      }
    );
  }
}
