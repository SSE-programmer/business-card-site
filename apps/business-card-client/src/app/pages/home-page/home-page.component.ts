import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { INavigationRoute } from '../../shared/models/INavigationRoute';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
    selector: 'app-body',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    imports: [
        NgOptimizedImage,
        CardComponent,
    ],
})
export class HomePageComponent {
    protected contactsList: INavigationRoute[] = [
        {
            title: 'Email',
            link: 'mailto:sstolbennikov@gmail.com',
            icon: 'assets/icons/mail-icon.svg',
        },
        {
            title: 'Telegram',
            link: 'https://t.me/sse_programmer',
            icon: 'assets/icons/telegram-icon.svg',
        },
        {
            title: 'Github',
            link: 'https://github.com/SSE-programmer',
            icon: 'assets/icons/github-icon.svg',
        },
        {
            title: 'Instagram',
            link: 'https://www.instagram.com/sse.public/',
            icon: 'assets/icons/instagram-icon.svg',
        }
    ];
}
