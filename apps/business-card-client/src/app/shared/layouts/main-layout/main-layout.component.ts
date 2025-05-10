import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { fromEvent, tap, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AosService } from '../../services/aos.service';


@Component({
    selector: 'bc-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
    imports: [
        RouterOutlet,
        FooterComponent,
        HeaderComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly aosService = inject(AosService);
;
    private readonly pageContainer = viewChild.required<ElementRef<HTMLElement>>('pageContainer');

    public ngOnInit(): void {
        this.aosService.init();

        fromEvent(this.pageContainer().nativeElement, 'scroll').pipe(
            takeUntilDestroyed(this.destroyRef),
            throttleTime(50),
            tap(() => {
                this.aosService.refresh();
            }),
        )
            .subscribe();
    }
}
