import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
    selector: 'bc-tag',
    templateUrl: './tag.component.html',
    styleUrl: './tag.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
    @HostBinding('style.background')
    get getBackground(): string | null {
        return this.background();
    }

    public background = input<string | null>(null);
}
