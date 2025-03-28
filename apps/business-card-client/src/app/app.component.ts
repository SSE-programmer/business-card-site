import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
    ],
})
export class AppComponent {
    private readonly themeService = inject(ThemeService);

    public colorTheme = this.themeService.colorTheme;
}
