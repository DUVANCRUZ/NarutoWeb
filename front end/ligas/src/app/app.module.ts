import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CharacterComponent } from './components/character/character.component';
import { CharactersComponent } from './components/characters/characters.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { HttpClientModule } from '@angular/common/http'; 
import { FiltersComponent } from './components/filters/filters.component';
import { DetailsComponent } from './components/details/details.component';
import { CreateComponent } from './components/create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CloudinaryModule } from '@cloudinary/ng';
import { MyCreationsComponent } from './components/my-creations/my-creations.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { LandingComponent } from './components/landing/landing.component';
import { NotFoundComponent } from './components/not-found/not-found.component'; // Asegúrate de importar la versión correcta


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CharacterComponent,
    CharactersComponent,
    NavbarComponent,
    SearchBarComponent,
    FiltersComponent,
    DetailsComponent,
    CreateComponent,
    MyCreationsComponent,
    FavoritesComponent,
    LandingComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CloudinaryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
