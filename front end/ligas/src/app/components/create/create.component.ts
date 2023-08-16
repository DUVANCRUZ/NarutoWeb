import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

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

  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private storage: AngularFireStorage) { }

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
      image: [''],
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

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.characterForm.patchValue({
          image: file,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm(): void {
    if (this.characterForm.invalid) {
      return;
    }

    const formData = this.characterForm.value;

    if (formData.image) {
      const filePath = `images/${formData.name}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, formData.image);

      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              formData.image = url;
              this.saveDataToBackend(formData);
            });
          })
        )
        .subscribe();
        console.log('Data to be sent:', formData)
    } else {
      this.saveDataToBackend(formData);
    }
  }

  private saveDataToBackend(data: any): void {
    const backendUrl = 'http://localhost:5000/char/create';

    this.http.post(backendUrl, data).subscribe(
      (response) => {
        console.log('Data sent successfully:', response);
      },
      (error) => {
        console.error('Error sending data:', error);
      }
    );
  }
}
