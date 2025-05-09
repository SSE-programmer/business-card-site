import { ChangeDetectionStrategy, Component, effect, input, signal, untracked } from '@angular/core';
import { IJobExperience } from '../../../pages/home-page/models/IJobExperience';

@Component({
    selector: 'bc-career-timeline',
    templateUrl: './career-timeline.component.html',
    styleUrl: './career-timeline.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerTimelineComponent {
    public jobExperience = input<IJobExperience[]>([]);
    public minYear = signal<number>(new Date().getFullYear());
    public maxYear = signal<number>(new Date().getFullYear());
    public yearsList = signal<number[]>([]);

    protected YEAR_CELL_MIN_WIDTH = '100px';
    protected YEAR_CELL_VERTICAL_PADDING = '8px';
    protected FIRST_YEAR_LEFT_MARGIN_PADDING = '40px';

    private _jobExperienceEffect = effect(() => {
        this.jobExperience().forEach(job => {
            job.positions.forEach(position => {
                const currentMinYear = untracked(() => this.minYear());
                const currentMaxYear = untracked(() => this.maxYear());
                const minPositionYear = position.startDate.getFullYear();
                const maxPositionYear = position.endDate?.getFullYear();

                if (minPositionYear < currentMinYear) {
                    untracked(() => this.minYear.set(position.startDate.getFullYear()));
                }

                if (maxPositionYear && maxPositionYear > currentMaxYear) {
                    untracked(() => this.maxYear.set(maxPositionYear));
                }
            });
        });

        const yearsList = Array.from(
            { length: this.maxYear() - this.minYear() + 1 },
            (_, i) => this.minYear() + i,
        );

        untracked(() => {
            yearsList.unshift(this.minYear() - 1);
            this.yearsList.set(yearsList);
        });
    });
}
