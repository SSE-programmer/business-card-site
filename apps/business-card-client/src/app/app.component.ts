import { Component, inject, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TooltipService } from './shared/components/tooltip/tooltip.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
    ],
})
export class AppComponent {
    private readonly tooltipService = inject(TooltipService);
    private readonly viewContainerRef = inject(ViewContainerRef);

    constructor() {
        this._setViewContainerRefs();
    }

    private _setViewContainerRefs(): void {
        this.tooltipService.setViewContainerRef(this.viewContainerRef);
    }
}
