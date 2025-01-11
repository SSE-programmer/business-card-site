import { Component } from '@angular/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { INavigationRoute } from '../../../../models/INavigationRoute';

@Component({
    selector: 'main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss'],
    imports: [
        ClickOutsideModule,
        RouterLink,
        RouterLinkActive
    ],
    standalone: true
})
export class MainHeaderComponent {
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
