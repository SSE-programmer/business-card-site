import { NgModule } from '@angular/core';

import { ContactsRoutingModule } from "./contacts-routing.module";
import { ContactsPageComponent } from "./contacts-page/contacts-page.component";


@NgModule({
  declarations: [
    ContactsPageComponent
  ],
  imports: [
    ContactsRoutingModule
  ]
})
export class ContactsModule {}
