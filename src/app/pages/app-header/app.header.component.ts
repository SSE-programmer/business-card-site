import { Component } from '@angular/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { INavigationRoute } from '../../shared/models/INavigationRoute';

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
    protected navigationRoutes: INavigationRoute[] = [
        {
            title: 'Home',
            link: '/home'
        },
        {
            title: 'Projects',
            link: '/projects'
        },
        {
            title: 'Blog',
            link: '/blog'
        },
        {
            title: 'Contacts',
            link: '/contacts'
        }
    ];
}
