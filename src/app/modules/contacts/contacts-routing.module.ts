import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsPageComponent } from "./contacts-page/contacts-page.component";

const routes: Routes = [
  { path: 'contacts', component: ContactsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
