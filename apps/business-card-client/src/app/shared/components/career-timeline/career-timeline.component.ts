import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

export interface IWorkExperience {
    company: string;
    positions: IPosition[];
}

export interface IPosition {
    title: string;
    startDate: Date;
    endDate?: Date;
    isFullTime: boolean;
    projects: string[];
    techStack: string[];
    achievements: string[];
    description: string;
}

@Component({
    selector: 'bc-career-timeline',
    templateUrl: './career-timeline.component.html',
    styleUrl: './career-timeline.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerTimelineComponent implements AfterViewInit, OnDestroy {
    @ViewChild('timelineCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
    @Input() workData: IWorkExperience[] = [];

    private _ctx!: CanvasRenderingContext2D;
    private _resizeObserver!: ResizeObserver;
    private _positionsData: { position: IPosition, x: number, y: number, company: string }[] = [];
    private _currentHovered: number | null = null;

    private _animationFrameId: number | null = null;
    private _hoverProgress = 0; // 0..1
    private _lastHoveredIndex: number | null = null;

    public ngAfterViewInit() {
        this._initCanvas();
        this._setupResizeObserver();
        this._drawTimeline();
        this._setupInteractivity();
    }

    public ngOnDestroy() {
        this._resizeObserver?.disconnect();
    }

    private _initCanvas() {
        const canvas = this.canvasRef.nativeElement;

        this._ctx = canvas.getContext('2d')!;
        this._resizeCanvas();
    }

    private _resizeCanvas() {
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
        this._ctx.scale(devicePixelRatio, devicePixelRatio);
        this._drawTimeline();
    }

    private _setupResizeObserver() {
        this._resizeObserver = new ResizeObserver(() => this._resizeCanvas());
        this._resizeObserver.observe(this.canvasRef.nativeElement);
    }

    private _clearCanvas() {
        const canvas = this.canvasRef.nativeElement;
        this._ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    private _dateToX(date: Date, range: { min: Date; max: Date }, config: any): number {
        const totalMonths = (range.max.getFullYear() - range.min.getFullYear()) * 12
            + (range.max.getMonth() - range.min.getMonth());
        const elapsedMonths = (date.getFullYear() - range.min.getFullYear()) * 12
            + (date.getMonth() - range.min.getMonth());

        return config.margin.left + (elapsedMonths / totalMonths) *
            (this.canvasRef.nativeElement.width / devicePixelRatio - config.margin.left - config.margin.right);
    }

    private _drawTimeScale(range: { min: Date; max: Date }, config: any) {
        this._ctx.fillStyle = '#333';
        this._ctx.font = '12px Arial';
        this._ctx.textAlign = 'center';

        const startYear = range.min.getFullYear();
        const endYear = range.max.getFullYear();
        const y = this.canvasRef.nativeElement.height / devicePixelRatio - config.margin.bottom / 2;

        for (let year = startYear; year <= endYear; year++) {
            const date = new Date(year, 0, 1);
            const x = this._dateToX(date, range, config);

            this._ctx.beginPath();
            this._ctx.moveTo(x, config.margin.top);
            this._ctx.lineTo(x, this.canvasRef.nativeElement.height / devicePixelRatio - config.margin.bottom);
            this._ctx.strokeStyle = '#ddd';
            this._ctx.stroke();

            this._ctx.fillText(year.toString(), x, y);
        }
    }

    private _drawTimeline() {
        this._clearCanvas();
        this._positionsData = [];

        const config = {
            margin: { top: 40, right: 40, bottom: 60, left: 160 },
            lineHeight: 50,
            dotRadius: 8,
            yearStep: 100,
            monthStep: 100 / 12,
        };

        const dateRange = this._calculateDateRange();

        // Настройка стилей
        this._ctx.font = '20px "Patua One"';
        this._ctx.textAlign = 'left';
        this._ctx.textBaseline = 'middle';
        this._ctx.strokeStyle = '#3498db';
        this._ctx.lineWidth = 2;

        // Отрисовка компаний и позиций
        this.workData.forEach((company, i) => {
            const y = config.margin.top + i * config.lineHeight;

            // Название компании
            this._ctx.fillStyle = '#2c3e50';
            this._ctx.fillText(company.company, 10, y);

            // Линия компании
            company.positions.forEach(position => {
                const isCurrent = !position.endDate;
                const endDate = position.endDate || new Date();

                const x1 = this._dateToX(position.startDate, dateRange, config);
                const x2 = this._dateToX(endDate, dateRange, config);

                // Сохраняем данные позиции для интерактивности
                this._positionsData.push({
                    position,
                    x: x1,
                    y,
                    company: company.company,
                });

                // Линия
                this._ctx.setLineDash(position.isFullTime ? [] : [5, 3]);
                this._ctx.beginPath();
                this._ctx.moveTo(x1, y);
                this._ctx.lineTo(x2, y);
                this._ctx.stroke();

                // Точка позиции
                this._ctx.beginPath();
                this._ctx.arc(x1, y, config.dotRadius, 0, Math.PI * 2);
                this._ctx.fillStyle = position.isFullTime ? '#3498db' : '#e74c3c';
                this._ctx.fill();

                // Если текущая позиция - добавляем стрелку
                if (isCurrent) {
                    this._ctx.beginPath();
                    this._ctx.moveTo(x2, y);
                    this._ctx.lineTo(x2 - 8, y - 4);
                    this._ctx.lineTo(x2 - 8, y + 4);
                    this._ctx.closePath();
                    this._ctx.fillStyle = '#3498db';
                    this._ctx.fill();
                }
            });
        });

        // Отрисовка временной шкалы
        this._drawTimeScale(dateRange, config);

        // Если есть активное подсвечивание, рисуем эффект
        if (this._currentHovered !== null) {
            this._drawHoverEffect();
        }
    }

    private _calculateDateRange(): { min: Date; max: Date } {
        let minDate = new Date();
        let maxDate = new Date(0);

        this.workData.forEach(company => {
            company.positions.forEach(position => {
                if (position.startDate < minDate) {
                    minDate = position.startDate;
                }
                const endDate = position.endDate || new Date();
                if (endDate > maxDate) {
                    maxDate = endDate;
                }
            });
        });

        minDate = new Date(minDate.getFullYear(), minDate.getMonth() - 6, 1);
        maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 6, 1);

        return { min: minDate, max: maxDate };
    }

    private _setupInteractivity() {
        const canvas = this.canvasRef.nativeElement;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const hoveredIndex = this._findPositionAt(x, y);

            if (hoveredIndex !== null) {
                canvas.style.cursor = 'pointer';
                this._showTooltip(hoveredIndex, x, y);
                this._highlightPosition(hoveredIndex);
            } else {
                canvas.style.cursor = 'default';
                this._hideTooltip();
                this._resetHighlight();
            }
        });

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const clickedIndex = this._findPositionAt(x, y);
            if (clickedIndex !== null) {
                this._openDetailsModal(this._positionsData[clickedIndex].position);
            }
        });
    }

    private _findPositionAt(x: number, y: number): number | null {
        const hitRadius = 10;

        for (let i = 0; i < this._positionsData.length; i++) {
            const pos = this._positionsData[i];
            const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));

            if (distance <= hitRadius) {
                return i;
            }
        }

        return null;
    }

    private _highlightPosition(index: number) {
        if (this._currentHovered === index) {
            return;
        }

        this._lastHoveredIndex = index;
        this._currentHovered = index;

        // Запускаем анимацию
        this._startHoverAnimation();
    }

    private _startHoverAnimation() {
        if (this._animationFrameId) {
            cancelAnimationFrame(this._animationFrameId);
        }

        this._hoverProgress = 0;

        const animate = () => {
            this._hoverProgress = Math.min(this._hoverProgress + 0.05, 1);
            this._drawHoverEffect();

            if (this._hoverProgress < 1) {
                this._animationFrameId = requestAnimationFrame(animate);
            }
        };

        this._animationFrameId = requestAnimationFrame(animate);
    }

    private _drawHoverEffect() {
        if (this._currentHovered === null) {
            return;
        }

        const pos = this._positionsData[this._currentHovered];
        const radius = 8 * this._hoverProgress; // Радиус увеличивается плавно
        const opacity = 0.3 * this._hoverProgress; // Прозрачность увеличивается плавно

        // Сохраняем текущее состояние canvas
        this._ctx.save();

        // Подсвечиваем точку
        this._ctx.beginPath();
        this._ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        this._ctx.fillStyle = `rgba(52, 152, 219, ${opacity})`;
        this._ctx.fill();
        this._ctx.strokeStyle = '#3498db';
        this._ctx.lineWidth = 2 * this._hoverProgress;
        this._ctx.stroke();

        // Подсвечиваем линию после точки
        const companyPositions = this._positionsData.filter(p => p.company === pos.company);
        const currentIndex = companyPositions.findIndex(p => p.x === pos.x && p.y === pos.y);

        if (currentIndex !== -1) {
            const nextPosition = companyPositions[currentIndex + 1];
            const endX = nextPosition ? nextPosition.x : this.canvasRef.nativeElement.width / devicePixelRatio - 40;

            this._ctx.beginPath();
            this._ctx.moveTo(pos.x, pos.y);
            this._ctx.lineTo(endX, pos.y);
            this._ctx.strokeStyle = `rgba(52, 152, 219, ${this._hoverProgress})`;
            this._ctx.lineWidth = 4 * this._hoverProgress;
            this._ctx.setLineDash([]);
            this._ctx.stroke();
        }

        this._ctx.restore();
    }

    private _resetHighlight() {
        if (this._currentHovered !== null) {
            this._startHideAnimation();
            this._currentHovered = null;
        }
    }

    private _startHideAnimation() {
        if (this._animationFrameId) {
            cancelAnimationFrame(this._animationFrameId);
        }

        const animate = () => {
            this._hoverProgress = Math.max(this._hoverProgress - 0.05, 0);
            this._drawHoverEffect();

            if (this._hoverProgress > 0) {
                this._animationFrameId = requestAnimationFrame(animate);
            } else {
                // Полная перерисовка когда анимация завершена
                this._drawTimeline();
            }
        };

        this._animationFrameId = requestAnimationFrame(animate);
    }

    private _showTooltip(index: number, mouseX: number, mouseY: number) {
        const tooltip = document.getElementById('timeline-tooltip');

        if (!tooltip) {
            return;
        }

        const pos = this._positionsData[index].position;

        tooltip.innerHTML = `
      <h3>${pos.title}</h3>
      <p><strong>${this._positionsData[index].company}</strong></p>
      <p>${this._formatDate(pos.startDate)} - ${pos.endDate ? this._formatDate(pos.endDate) : 'Present'}</p>
      <p>${pos.projects.slice(0, 2).join(', ')}${pos.projects.length > 2 ? '...' : ''}</p>
      <button class="more-btn">Подробнее</button>
    `;

        tooltip.style.display = 'block';
        tooltip.style.left = `${mouseX + 15}px`;
        tooltip.style.top = `${mouseY + 15}px`;

        // Обработчик кнопки (нужно для правильной работы pointer-events)
        tooltip.querySelector('.more-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this._openDetailsModal(pos);
        });
    }

    private _hideTooltip() {
        const tooltip = document.getElementById('timeline-tooltip')!;

        if (!tooltip) {
            return;
        }

        tooltip.style.display = 'none';
    }

    private _formatDate(date: Date): string {
        return date.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
    }

    private _openDetailsModal(position: IPosition) {
        // const modalRef = this.modalService.open(ExperienceDetailsComponent, {
        //     size: 'lg',
        //     centered: true,
        // });
        //
        // modalRef.componentInstance.position = position;
    }
}

// // Компонент модального окна
// @Component({
//     standalone: true,
//     template: `
//         <div class="modal-header">
//             <h2>{{ position.title }}</h2>
//             <button
//                 class="close-btn"
//                 (click)="close()"
//             >×
//             </button>
//         </div>
//         <div class="modal-body">
//             <p><strong>Период:</strong> {{ getPeriodString() }}</p>
//
//             <h3>Проекты:</h3>
//             <ul>
//                 <li *ngFor="let project of position.projects">{{ project }}</li>
//             </ul>
//
//             <h3>Технологии:</h3>
//             <div class="tech-stack">
//                 <span
//                     *ngFor="let tech of position.techStack"
//                     class="tech-badge"
//                 >{{ tech }}</span>
//             </div>
//
//             <h3>Достижения:</h3>
//             <ul>
//                 <li *ngFor="let achievement of position.achievements">{{ achievement }}</li>
//             </ul>
//
//             <h3>Описание:</h3>
//             <p>{{ position.description }}</p>
//         </div>
//     `,
//     styles: [
//         `
//             .modal-header {
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
//                 padding: 15px 20px;
//                 border-bottom: 1px solid #eee;
//             }
//
//             .modal-header h2 {
//                 margin: 0;
//                 color: #2c3e50;
//             }
//
//             .close-btn {
//                 background: none;
//                 border: none;
//                 font-size: 24px;
//                 cursor: pointer;
//             }
//
//             .modal-body {
//                 padding: 20px;
//             }
//
//             .tech-stack {
//                 display: flex;
//                 flex-wrap: wrap;
//                 gap: 5px;
//                 margin-bottom: 15px;
//             }
//
//             .tech-badge {
//                 background: #3498db;
//                 color: white;
//                 padding: 3px 8px;
//                 border-radius: 3px;
//                 font-size: 12px;
//             }
//
//             ul {
//                 padding-left: 20px;
//             }
//         `,
//     ],
// })
// export class ExperienceDetailsComponent {
//     @Input() position!: Position;
//
//     constructor(public activeModal: NgbActiveModal) {
//     }
//
//     getPeriodString(): string {
//         const start = this.position.startDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
//         const end = this.position.endDate
//             ? this.position.endDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
//             : 'по настоящее время';
//         return `${start} - ${end}`;
//     }
//
//     close() {
//         this.activeModal.close();
//     }
// }
