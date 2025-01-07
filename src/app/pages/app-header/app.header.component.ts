import {Component, HostListener} from '@angular/core';
import { NgClass } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app.header.component.html',
  styleUrls: ['./app.header.component.scss'],
  imports: [
    NgClass,
    ClickOutsideModule,
    RouterLink,
    RouterLinkActive
  ],
  standalone: true
})
export class AppHeaderComponent {
  drop: boolean = false;

  closeMenu(): void {
    this.drop = false;
  }

  switchNavbar(): void {
    this.drop = !this.drop;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: any }) {
    if (window.matchMedia("(min-width: 800px)").matches) {
      this.drop = false;
    }
  }
}
