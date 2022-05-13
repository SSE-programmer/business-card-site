import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app.header.component.html',
  styleUrls: ['./app.header.component.scss'],
})
export class AppHeaderComponent {
  links: HTMLElement | null = null;

  ngAfterViewInit() {
    this.links = document.getElementById('nav-links');
  }

  closeMenu(): void {
    if (!this.links) return;

    this.links.classList.remove('drop');
  }

  responsiveNavbar(): void {
    if (!this.links) return;

    if (this.links.classList.contains('drop')) {
      this.links.classList.remove('drop');
    } else {
      this.links.classList.add('drop');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: any }) {
    if (!this.links) return;

    if (window.matchMedia("(min-width: 800px)").matches) {
      this.links.classList.remove('drop');
    }
  }
}
