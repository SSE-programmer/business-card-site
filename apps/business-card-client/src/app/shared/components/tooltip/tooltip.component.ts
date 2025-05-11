import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    DestroyRef,
    HostListener,
    inject,
    OnDestroy,
    OnInit,
    Type,
    ViewChild
} from '@angular/core';
import { TooltipService } from './tooltip.service';
import { TooltipConfig } from './tooltip.config';
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InsertionDirective } from '../../directives/insertion/insertion.directive';
import { ClickOutsideDirective } from '../../directives/click-outside/click-outside.directive';

@Component({
    selector: 'bc-tooltip',
    standalone: true,
    imports: [
        ClickOutsideDirective,
        InsertionDirective,
    ],
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss'
})
export class TooltipComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly tooltipConfig = inject(TooltipConfig);
    private readonly tooltipService = inject(TooltipService);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly destroyRef = inject(DestroyRef);

    public componentRef: ComponentRef<TooltipComponent>;
    public childComponentRef: ComponentRef<any>;
    public childComponentType: Type<any>;
    public width: string | undefined;

    @ViewChild(InsertionDirective)
    insertionPoint: InsertionDirective;

    @HostListener('document:keydown.escape')
    public onKeydownHandler() {
        this.close();
    }

    public ngOnInit() {
        fromEvent(window, 'resize')
            .pipe(
                debounceTime(500),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this._calculateWidth();
                this.cd.detectChanges();
            });
    }

    public ngAfterViewInit() {
        this._loadChildComponent(this.childComponentType);
        this.cd.detectChanges();
    }

    public ngOnDestroy() {
        if (this.childComponentRef) {
            this.childComponentRef.destroy();
        }
    }

    public close() {
        this.tooltipService.close(this.componentRef);
    }

    private _loadChildComponent(componentType: Type<any>) {
        const viewContainerRef = this.insertionPoint.viewContainerRef;

        viewContainerRef.clear();
        this.childComponentRef = viewContainerRef.createComponent(componentType);
    }

    private _calculateWidth() {
        let width = this.tooltipConfig.width;

        if (this.tooltipConfig.mediaQueries?.length) {
            const mediaQueries = this.tooltipConfig.mediaQueries;

            mediaQueries.forEach(mediaQuery => {
                const isMatch = window.matchMedia(mediaQuery.query).matches;

                if (isMatch) {
                    width = mediaQuery.width;
                }
            });
        }

        this.width = width;
    }
}
