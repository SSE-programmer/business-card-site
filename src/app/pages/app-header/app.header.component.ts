import { Component, HostListener } from '@angular/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './app.header.component.html',
    styleUrls: ['./app.header.component.scss'],
    imports: [
        ClickOutsideModule,
        RouterLink,
        RouterLinkActive
    ],
    standalone: true
})
export class AppHeaderComponent {
    expanded: boolean = false;

    closeMenu(): void {
        this.expanded = false;
    }

    switchNavbar(): void {
        this.expanded = !this.expanded;
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        if (window.matchMedia('(min-width: 800px)').matches) {
            this.expanded = false;
        }
    }
}
