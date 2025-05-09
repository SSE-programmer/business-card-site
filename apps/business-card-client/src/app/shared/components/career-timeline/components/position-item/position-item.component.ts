import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IPosition } from '../../models/IJobExperience';

@Component({
    selector: 'bc-position-item',
    templateUrl: './position-item.component.html',
    styleUrl: './position-item.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionItemComponent {
    public position = input.required<IPosition>();
    public leftMargin = input<string>('0px');
    public yearCellWidth = input.required<number>();
    public firstYear = input.required<number>();
    public lastYear = input.required<number>();
    public yearsList = computed(() => {
        return Array.from(
            { length: this.lastYear() - this.firstYear() + 1 },
            (_, i) => this.firstYear() + i,
        );
    });
    public styles = computed(() => {
    });
}
