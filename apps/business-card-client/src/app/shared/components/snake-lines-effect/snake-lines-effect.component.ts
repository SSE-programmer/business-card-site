import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    Injector,
    OnDestroy,
    runInInjectionContext,
    signal,
    ViewChild,
} from '@angular/core';

interface ISnake {
    path: {
        x: number;
        y: number;
    }[];
    direction: {
        x: number;
        y: number;
    };
    speed: number;
    offset: number;
}

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
    private _snakes = signal<ISnake[]>([]);
    private _animationFrameId: number | null = null;

    private _isRunning = signal(true);

    public ngAfterViewInit() {
        this._setupCanvas();
        window.addEventListener('resize', this._handleResize);

        runInInjectionContext(this.injector, () => {
            effect(() => {
                // Добавляем новую змейку, если текущих меньше 5
                if (this._snakes().length < 5) {
                    const newSnake = this._createSnake();

                    if (newSnake) {
                        this._snakes.update(snakes => [...snakes, newSnake]);
                    }
                }
            });

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

        window.removeEventListener('resize', this._handleResize);
    }

    private _setupCanvas() {
        const canvas = this._canvasRef.nativeElement;
        this._ctx = canvas.getContext('2d');

        if (!this._ctx) {
            throw new Error('Failed to get Canvas 2D context');
        }

        this._handleResize();
    }

    private _handleResize = () => {
        const canvas = this._canvasRef.nativeElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    private _animate() {
        if (!this._ctx) {
            return;
        }

        const { width, height } = this._ctx.canvas;
        this._ctx.clearRect(0, 0, width, height);

        this._snakes.update(snakes => {
            const updatedSnakes = snakes.map(snake => {
                const last = snake.path[snake.path.length - 1];
                const newX = last.x + snake.direction.x * snake.speed;
                const newY = last.y + snake.direction.y * snake.speed;
                snake.path.push({ x: newX, y: newY });

                if (snake.path.length > 100) {
                    snake.path.shift();
                }

                return snake;
            }).filter(snake => {
                // Удаляем змейки, ушедшие за границы
                const last = snake.path[snake.path.length - 1];
                return !this._isOutOfBounds(last.x, last.y);
            });

            if (updatedSnakes.length < snakes.length) {
                const newSnake = this._createSnake();

                if (newSnake) {
                    updatedSnakes.push(newSnake);
                }
            }

            return updatedSnakes;
        });

        this._snakes().forEach(snake => this._drawSnake(snake));

        if (this._isRunning()) {
            this._animationFrameId = requestAnimationFrame(() => this._animate());
        }
    }

    private _createSnake(): ISnake | null {
        if (!this._ctx) {
            return null;
        }

        const edge = Math.floor(Math.random() * 4);
        let x, y, dx, dy;

        switch (edge) {
            case 0: // Top
                x = Math.random() * this._ctx.canvas.width;
                y = 0;
                dx = (Math.random() - 0.5) * 0.5;
                dy = Math.random() * 0.5 + 0.5;
                break;
            case 1: // Right
                x = this._ctx.canvas.width;
                y = Math.random() * this._ctx.canvas.height;
                dx = -Math.random() * 0.5 - 0.5;
                dy = (Math.random() - 0.5) * 0.5;
                break;
            case 2: // Bottom
                x = Math.random() * this._ctx.canvas.width;
                y = this._ctx.canvas.height;
                dx = (Math.random() - 0.5) * 0.5;
                dy = -Math.random() * 0.5 - 0.5;
                break;
            case 3: // Left
                x = 0;
                y = Math.random() * this._ctx.canvas.height;
                dx = Math.random() * 0.5 + 0.5;
                dy = (Math.random() - 0.5) * 0.5;
                break;
            default:
                x = y = dx = dy = 0;
        }

        return {
            path: [{ x, y }],
            direction: { x: dx, y: dy },
            speed: Math.random() * 0.5 + 0.5,
            offset: Math.random() * 100,
        };
    }

    private _isOutOfBounds(x: number, y: number): boolean {
        if (!this._ctx) {
            return false;
        }

        return x < -100 || x > this._ctx.canvas.width + 100 ||
            y < -100 || y > this._ctx.canvas.height + 100;
    }

    private _drawSnake(snake: ISnake) {
        if (this._ctx === null) {
            return;
        }

        this._ctx.setLineDash([10, 5]);
        this._ctx.lineDashOffset = snake.offset;
        this._ctx.strokeStyle = 'rgba(200, 200, 200, 0.7)';
        this._ctx.lineWidth = 2;
        this._ctx.beginPath();

        snake.path.forEach((point, i) => {
            if (i === 0) {
                // tslint:disable-next-line:no-non-null-assertion
                this._ctx!.moveTo(point.x, point.y);
            } else {
                const noiseX = (Math.random() - 0.5) * 2;
                const noiseY = (Math.random() - 0.5) * 2;
                // tslint:disable-next-line:no-non-null-assertion
                this._ctx!.lineTo(point.x + noiseX, point.y + noiseY);
            }
        });

        this._ctx.stroke();
        snake.offset -= 0.5;
    }
}
