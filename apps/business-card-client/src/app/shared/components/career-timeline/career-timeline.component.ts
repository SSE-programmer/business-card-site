import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    OnInit,
    signal,
    untracked,
    viewChildren,
} from '@angular/core';
import { IJobExperience } from './models/IJobExperience';
import { PositionItemComponent } from './components/position-item/position-item.component';
import { ViewportService } from '../../services/viewport.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, tap } from 'rxjs';

@Component({
    selector: 'bc-career-timeline',
    templateUrl: './career-timeline.component.html',
    styleUrl: './career-timeline.component.scss',
    imports: [
        PositionItemComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerTimelineComponent implements OnInit {
    private viewportService = inject(ViewportService);
    private destroyRef = inject(DestroyRef);

    public jobExperience = input<IJobExperience[]>([]);
    public minYear = signal<number>(new Date().getFullYear());
    public maxYear = signal<number>(new Date().getFullYear());
    public yearsList = signal<number[]>([]);
    public yearCellWidth = signal<number>(0);
    public yearCellAnchorList = viewChildren<ElementRef<HTMLDivElement>>('.year-cell-anchor');

    protected YEAR_CELL_MIN_WIDTH = '100px';
    protected YEAR_CELL_VERTICAL_PADDING = '8px';
    protected FIRST_YEAR_LEFT_MARGIN_PADDING = '40px';

    public ngOnInit(): void {
        this.viewportService.dimensions$.pipe(
            takeUntilDestroyed(this.destroyRef),
            debounceTime(200),
            tap(() => {
                if (!this.yearCellAnchorList().length) {
                    this.yearCellWidth.set(0);

                    return;
                }

                const yearCellAnchor = this.yearCellAnchorList()[0].nativeElement;
                this.yearCellWidth.set(yearCellAnchor.offsetWidth);
            }),
        )
            .subscribe();
    }

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
