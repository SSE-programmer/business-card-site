import { Component } from '@angular/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { INavigationRoute } from '../../../../models/INavigationRoute';
import { LogoComponent } from '../../../../components/logo/logo.component';
import { IconSettingsComponent } from '../../../../components/icons/icon-settings/icon-settings.component';

@Component({
    selector: 'bc-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        ClickOutsideModule,
        RouterLink,
        RouterLinkActive,
        LogoComponent,
        IconSettingsComponent,
    ],
})
export class HeaderComponent {
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
