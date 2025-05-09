import { Component } from '@angular/core';
import { NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { CareerTimelineComponent } from '../../shared/components/career-timeline/career-timeline.component';
import { CONTACTS_LIST } from './constants/contacts-list.constant';
import { JOB_EXPERIENCE } from './constants/job-experience.constant';

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
    public contactsList = CONTACTS_LIST;
    public jobExperience = JOB_EXPERIENCE;
}
