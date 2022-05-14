import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PageNotFoundComponent} from "./modules/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: false }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
