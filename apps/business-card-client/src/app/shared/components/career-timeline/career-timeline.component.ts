import { AfterViewInit, ChangeDetectionStrategy, Component, inject, Injector, Input, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

export interface IWorkExperience {
    company: string;
    positions: IPosition[];
}

export interface IPosition {
    title: string;
    startDate: Date;
    endDate?: Date;
    isFullTime: boolean;
    projects: string[];
    techStack: string[];
    achievements: string[];
    description: string;
}

interface IColors {
    GRID: string;
    COMPANY: string;
    FULL_TIME_POSITION: string;
    PARTIAL_TIME_POSITION: string;
}

@Component({
    selector: 'bc-career-timeline',
    templateUrl: './career-timeline.component.html',
    styleUrl: './career-timeline.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class CareerTimelineComponent implements AfterViewInit, OnDestroy {
    @Input() workData: IWorkExperience[] = [];

    public ngAfterViewInit() {
    }

    public ngOnDestroy() {
    }
}
