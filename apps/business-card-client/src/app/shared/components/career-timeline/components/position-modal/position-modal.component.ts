import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IPosition } from '../../models/IJobExperience';
import { TooltipConfig } from '../../../tooltip/tooltip.config';
import { DatePipe } from '@angular/common';
import { TagComponent } from '../../../tag/tag.component';
import { DynamicModalConfig } from '../../../dynamic-modal/dynamic-modal.config';

export interface IPositionModalData {
    company: string;
    position: IPosition;
}

@Component({
    selector: 'bc-position-modal',
    templateUrl: './position-modal.component.html',
    styleUrl: './position-modal.component.scss',
    imports: [
        DatePipe,
        TagComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionModalComponent {
    private readonly dynamicModalConfig = inject(DynamicModalConfig<IPositionModalData>);

    public company = signal<string>(this.dynamicModalConfig.data.company);
    public position = signal<IPosition>(this.dynamicModalConfig.data.position);
}
