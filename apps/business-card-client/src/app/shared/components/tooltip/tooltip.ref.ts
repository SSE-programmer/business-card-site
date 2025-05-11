import { ComponentRef } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

export class TooltipRef {
    private _reference: ComponentRef<TooltipComponent>;

    get reference(): ComponentRef<TooltipComponent> {
        return this._reference;
    }

    set reference(ref: ComponentRef<TooltipComponent>) {
        if (!this._reference) {
            this._reference = ref;
        }
    }

    public getInstance(): TooltipComponent {
        return this._reference.instance;
    }
}
