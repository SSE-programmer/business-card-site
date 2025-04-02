import { Component } from '@angular/core';
import { NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { IconGithubComponent } from '../../shared/components/icons/icon-github/icon-github.component';
import { IconTelegramComponent } from '../../shared/components/icons/icon-telegram/icon-telegram.component';
import { IconInstagramComponent } from '../../shared/components/icons/icon-instagram/icon-instagram.component';
import { IIconsLinks } from './models/IIconsLinks';
import { IconMailComponent } from '../../shared/components/icons/icon-mail/icon-mail.component';
import { CareerTimelineComponent, WorkExperience } from '../../shared/components/career-timeline/career-timeline.component';

@Component({
    selector: 'app-body',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    imports: [
        NgOptimizedImage,
        CardComponent,
        NgComponentOutlet,
        CareerTimelineComponent,
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

    workExperience: WorkExperience[] = [
        {
            company: 'Google',
            positions: [
                {
                    title: 'Senior Frontend Developer',
                    startDate: new Date('2020-01-01'),
                    endDate: new Date('2023-05-15'),
                    isFullTime: true,
                    projects: ['Google Search', 'Google Maps'],
                    techStack: ['Angular', 'TypeScript', 'RxJS'],
                    achievements: ['Улучшил производительность на 30%', 'Внедрил новые фичи'],
                    description: 'Работал над основными продуктами компании...'
                },
                {
                    title: 'Frontend Developer',
                    startDate: new Date('2018-06-01'),
                    endDate: new Date('2019-12-31'),
                    isFullTime: true,
                    projects: ['Google Ads'],
                    techStack: ['Angular', 'JavaScript'],
                    achievements: ['Реализовал новый интерфейс'],
                    description: 'Разработка интерфейсов для рекламной платформы...'
                }
            ]
        },
        {
            company: 'Freelance',
            positions: [
                {
                    title: 'Web Developer',
                    startDate: new Date('2016-03-01'),
                    endDate: new Date('2018-05-31'),
                    isFullTime: false,
                    projects: ['Разные проекты'],
                    techStack: ['JavaScript', 'jQuery', 'PHP'],
                    achievements: ['Завершил 15 проектов'],
                    description: 'Работа с различными клиентами...'
                }
            ]
        },
        {
            company: 'Microsoft',
            positions: [
                {
                    title: 'Software Engineer',
                    startDate: new Date('2023-06-01'),
                    isFullTime: true,
                    projects: ['Office 365'],
                    techStack: ['React', 'TypeScript'],
                    achievements: ['Участвовал в разработке новых функций'],
                    description: 'Работа над облачной версией Office...'
                }
            ]
        }
    ];
}
