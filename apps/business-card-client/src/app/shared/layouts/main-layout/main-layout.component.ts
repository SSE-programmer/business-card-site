import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';


@Component({
    selector: 'bc-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
    imports: [
        RouterOutlet,
        FooterComponent,
        HeaderComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
}
