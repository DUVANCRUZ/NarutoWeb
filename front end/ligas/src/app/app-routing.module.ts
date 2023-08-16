import { NgModule,  } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { CreateComponent  } from './components/create/create.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirección desde "/" a "/home"
  { path: 'home', component: HomeComponent },
  { path: 'char/:id', component: DetailsComponent},
  { path: "create", component: CreateComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }