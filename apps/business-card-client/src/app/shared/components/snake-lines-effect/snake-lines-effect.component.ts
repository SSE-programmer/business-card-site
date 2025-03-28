import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef, inject, Injector,
    OnDestroy, runInInjectionContext,
    signal,
    untracked,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'bc-snake-lines-effect',
    templateUrl: './snake-lines-effect.component.html',
    styleUrl: './snake-lines-effect.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnakeLinesEffectComponent implements AfterViewInit, OnDestroy {
    private injector = inject(Injector);

    @ViewChild('canvas', { static: true })
    private _canvasRef!: ElementRef<HTMLCanvasElement>;

    private _ctx: CanvasRenderingContext2D | null = null;
    private _animationFrameId: number | null = null;

    private _isRunning = signal(true);
    private _dashOffset = signal(0);

    public ngAfterViewInit() {
        this._setupCanvas();
        window.addEventListener('resize', this._handleResize.bind(this));

        runInInjectionContext(this.injector, () => {
            effect((onCleanup) => {
                const isRunning = this._isRunning();
                const ctx = this._ctx;

                if (isRunning && ctx) {
                    this._animationFrameId = requestAnimationFrame(() => this._animate());

                    onCleanup(() => {
                        if (this._animationFrameId) {
                            cancelAnimationFrame(this._animationFrameId);
                        }
                    });
                }
            });
        });
    }

    public ngOnDestroy() {
        this._isRunning.set(false);

        if (this._animationFrameId) {
            cancelAnimationFrame(this._animationFrameId);  // Двойная защита
        }

        window.removeEventListener('resize', this._handleResize.bind(this));
    }

    private _setupCanvas() {
        const canvas = this._canvasRef.nativeElement;
        this._ctx = canvas.getContext('2d');

        if (!this._ctx) {
            throw new Error('Failed to get Canvas 2D context');
        }

        this._handleResize();
    }

    private _handleResize() {
        const canvas = this._canvasRef.nativeElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    private _animate() {
        if (!this._ctx) {
            return;
        }

        const { width, height } = this._ctx.canvas;
        this._ctx.clearRect(0, 0, width, height);

        this._ctx.setLineDash([10, 5]);
        this._ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
        this._ctx.lineWidth = 2;
        this._ctx.lineDashOffset = this._dashOffset();

        this._ctx.beginPath();
        for (let x = 0; x < width; x += 20) {
            const y = Math.sin(x * 0.01 + this._dashOffset() * 0.05) * 50 + height / 2;
            x === 0 ? this._ctx.moveTo(x, y) : this._ctx.lineTo(x, y);
        }
        this._ctx.stroke();

        untracked(() => {
            this._dashOffset.update(offset => offset - 1);
        });

        if (this._isRunning()) {
            this._animationFrameId = requestAnimationFrame(this._animate.bind(this));
        }
    }
}
