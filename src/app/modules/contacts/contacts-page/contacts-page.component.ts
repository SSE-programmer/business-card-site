import { Component } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})
export class ContactsPageComponent {
  redirect(link: string) {
    window.open(link);
  }
}
