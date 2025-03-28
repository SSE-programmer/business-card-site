import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export enum EThemeType {
    Blue = 'blue',
    Red = 'red',
    Yellow = 'yellow',
    Green = 'green',
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private _darkTheme = new BehaviorSubject<boolean>(false);
    public isDarkTheme$ = this._darkTheme.asObservable();

    private _colorTheme = new BehaviorSubject<EThemeType>(EThemeType.Blue);
    public colorTheme$ = this._colorTheme.asObservable();

    public toggleDarkTheme(): void {
        this._darkTheme.next(!this._darkTheme.value);
    }

    public toggleColorTheme(theme: EThemeType): void {
        this._colorTheme.next(theme);
    }
}
