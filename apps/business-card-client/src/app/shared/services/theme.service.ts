import { effect, Injectable, signal } from '@angular/core';

export enum EThemeType {
    Blue = 'blue',
    Red = 'red',
    Yellow = 'yellow',
    Green = 'green',
    Black = 'black',
}

export const DEFAULT_THEME = EThemeType.Blue;
export const STORAGE_FIELD_NAME = 'theme:color';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly themePrefix = 'bc-theme-';
    private readonly _colorTheme = signal<EThemeType>(this._loadInitialThemeState());

    constructor() {
        this._applyThemeToBody(this._colorTheme());

        effect(() => {
            const theme = this._colorTheme();

            localStorage.setItem(STORAGE_FIELD_NAME, theme);
            this._applyThemeToBody(theme);
        });
    }

    public toggleColorTheme(theme: EThemeType): void {
        this._colorTheme.update(() => theme);
    }

    private _loadInitialThemeState() {
        const saved = localStorage.getItem(STORAGE_FIELD_NAME);

        return Object
            .values(EThemeType)
            .find((theme: EThemeType) => theme === saved) || DEFAULT_THEME;
    }

    private _applyThemeToBody(theme: EThemeType): void {
        const classList = document.body.classList;
        Array.from(classList)
            .filter(className => className.startsWith(this.themePrefix))
            .forEach(className => classList.remove(className));

        classList.add(`${this.themePrefix}${theme}`);
        localStorage.setItem(STORAGE_FIELD_NAME, theme.toString());
    }
}
