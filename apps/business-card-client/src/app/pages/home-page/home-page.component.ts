import { Component } from '@angular/core';
import { NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { IconGithubComponent } from '../../shared/components/icons/icon-github/icon-github.component';
import { IconTelegramComponent } from '../../shared/components/icons/icon-telegram/icon-telegram.component';
import { IconInstagramComponent } from '../../shared/components/icons/icon-instagram/icon-instagram.component';
import { IIconsLinks } from './models/IIconsLinks';
import { IconMailComponent } from '../../shared/components/icons/icon-mail/icon-mail.component';

@Component({
    selector: 'app-body',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    imports: [
        NgOptimizedImage,
        CardComponent,
        NgComponentOutlet,
    ],
})
export class HomePageComponent {
    protected contactsList: IIconsLinks[] = [
        {
            alt: 'Email',
            link: 'mailto:sstolbennikov@gmail.com',
            icon: IconMailComponent,
        },
        {
            alt: 'Telegram',
            link: 'https://t.me/sse_programmer',
            icon: IconTelegramComponent,
        },
        {
            alt: 'Github',
            link: 'https://github.com/SSE-programmer',
            icon: IconGithubComponent,
        },
        {
            alt: 'Instagram',
            link: 'https://www.instagram.com/sse.public/',
            icon: IconInstagramComponent,
        },
    ];
}
