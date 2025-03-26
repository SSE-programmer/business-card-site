import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'bcc-logo',
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {
}
