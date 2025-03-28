import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EThemeType, ThemeService } from './shared/theme.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
        AsyncPipe,
    ],
})
export class AppComponent {
    private readonly themeService = inject(ThemeService);

    get colorTheme(): Observable<EThemeType> {
        return this.themeService.colorTheme$;
    }
}
