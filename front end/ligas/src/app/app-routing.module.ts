import { NgModule,  } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { CreateComponent  } from './components/create/create.component';
import { MyCreationsComponent } from './components/my-creations/my-creations.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { LandingComponent } from './components/landing/landing.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: "landing", pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'char/:id', component: DetailsComponent},
  { path: "create", component: CreateComponent },
  { path: "creations", component: MyCreationsComponent},
  { path: "favorites", component: FavoritesComponent},
  { path: "landing", component: LandingComponent},
  { path: "**", component: NotFoundComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }