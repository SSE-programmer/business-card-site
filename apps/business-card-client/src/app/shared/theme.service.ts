import { effect, Injectable, signal } from '@angular/core';

export enum EThemeType {
    Blue = 'blue',
    Red = 'red',
    Yellow = 'yellow',
    Green = 'green',
}

export const DEFAULT_THEME = EThemeType.Blue;

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly _colorTheme = signal<EThemeType>(this.loadInitialThemeState());
    public readonly colorTheme = this._colorTheme.asReadonly();

    constructor() {
        effect(() => {
            localStorage.setItem('theme:color', JSON.stringify(this._colorTheme()));
        });
    }

    public toggleColorTheme(theme: EThemeType): void {
        this._colorTheme.update(() => theme);
    }

    private loadInitialThemeState() {
        const saved = localStorage.getItem('theme:color');

        if (saved !== null) {
            return JSON.parse(saved);
        }

        return DEFAULT_THEME;
    }
}
