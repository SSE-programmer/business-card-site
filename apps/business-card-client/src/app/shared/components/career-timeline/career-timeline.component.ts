import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

export interface WorkExperience {
    company: string;
    positions: Position[];
}

export interface Position {
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
    @Input() workData: WorkExperience[] = [];

    private ctx!: CanvasRenderingContext2D;
    private resizeObserver!: ResizeObserver;
    private positionsData: { position: Position, x: number, y: number, company: string }[] = [];
    private currentHovered: number | null = null;

    // constructor(private modalService: NgbModal) {
    // }

    ngAfterViewInit() {
        this.initCanvas();
        this.setupResizeObserver();
        this.drawTimeline();
        this.setupInteractivity();
    }

    ngOnDestroy() {
        this.resizeObserver?.disconnect();
    }

    private initCanvas() {
        const canvas = this.canvasRef.nativeElement;

        this.ctx = canvas.getContext('2d')!;
        this.resizeCanvas();
    }

    private resizeCanvas() {
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.drawTimeline();
    }

    private setupResizeObserver() {
        this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
        this.resizeObserver.observe(this.canvasRef.nativeElement);
    }

    private clearCanvas() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    private calculateDateRange(): { min: Date; max: Date } {
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

        // Добавляем буфер по 6 месяцев
        minDate = new Date(minDate.getFullYear(), minDate.getMonth() - 6, 1);
        maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 6, 1);

        return { min: minDate, max: maxDate };
    }

    private dateToX(date: Date, range: { min: Date; max: Date }, config: any): number {
        const totalMonths = (range.max.getFullYear() - range.min.getFullYear()) * 12
            + (range.max.getMonth() - range.min.getMonth());
        const elapsedMonths = (date.getFullYear() - range.min.getFullYear()) * 12
            + (date.getMonth() - range.min.getMonth());

        return config.margin.left + (elapsedMonths / totalMonths) *
            (this.canvasRef.nativeElement.width / devicePixelRatio - config.margin.left - config.margin.right);
    }

    private drawTimeScale(range: { min: Date; max: Date }, config: any) {
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';

        const startYear = range.min.getFullYear();
        const endYear = range.max.getFullYear();
        const y = this.canvasRef.nativeElement.height / devicePixelRatio - config.margin.bottom / 2;

        for (let year = startYear; year <= endYear; year++) {
            const date = new Date(year, 0, 1);
            const x = this.dateToX(date, range, config);

            this.ctx.beginPath();
            this.ctx.moveTo(x, config.margin.top);
            this.ctx.lineTo(x, this.canvasRef.nativeElement.height / devicePixelRatio - config.margin.bottom);
            this.ctx.strokeStyle = '#ddd';
            this.ctx.stroke();

            this.ctx.fillText(year.toString(), x, y);
        }
    }

    private drawTimeline() {
        this.clearCanvas();
        this.positionsData = [];

        const config = {
            margin: { top: 40, right: 40, bottom: 60, left: 120 },
            lineHeight: 40,
            dotRadius: 5,
            yearStep: 80,
            monthStep: 80 / 12,
        };

        const dateRange = this.calculateDateRange();

        // Настройка стилей
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 2;

        // Отрисовка компаний и позиций
        this.workData.forEach((company, i) => {
            const y = config.margin.top + i * config.lineHeight;

            // Название компании
            this.ctx.fillStyle = '#2c3e50';
            this.ctx.fillText(company.company, 10, y);

            // Линия компании
            company.positions.forEach(position => {
                const isCurrent = !position.endDate;
                const endDate = position.endDate || new Date();

                const x1 = this.dateToX(position.startDate, dateRange, config);
                const x2 = this.dateToX(endDate, dateRange, config);

                // Сохраняем данные позиции для интерактивности
                this.positionsData.push({
                    position,
                    x: x1,
                    y,
                    company: company.company,
                });

                // Линия
                this.ctx.setLineDash(position.isFullTime ? [] : [5, 3]);
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y);
                this.ctx.lineTo(x2, y);
                this.ctx.stroke();

                // Точка позиции
                this.ctx.beginPath();
                this.ctx.arc(x1, y, config.dotRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = position.isFullTime ? '#3498db' : '#e74c3c';
                this.ctx.fill();

                // Если текущая позиция - добавляем стрелку
                if (isCurrent) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x2, y);
                    this.ctx.lineTo(x2 - 8, y - 4);
                    this.ctx.lineTo(x2 - 8, y + 4);
                    this.ctx.closePath();
                    this.ctx.fillStyle = '#3498db';
                    this.ctx.fill();
                }
            });
        });

        // Отрисовка временной шкалы
        this.drawTimeScale(dateRange, config);
    }

    private setupInteractivity() {
        const canvas = this.canvasRef.nativeElement;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const hoveredIndex = this.findPositionAt(x, y);

            if (hoveredIndex !== null) {
                canvas.style.cursor = 'pointer';
                this.showTooltip(hoveredIndex, x, y);
                this.highlightPosition(hoveredIndex);
            } else {
                canvas.style.cursor = 'default';
                this.hideTooltip();
                this.resetHighlight();
            }
        });

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const clickedIndex = this.findPositionAt(x, y);
            if (clickedIndex !== null) {
                this.openDetailsModal(this.positionsData[clickedIndex].position);
            }
        });
    }

    private findPositionAt(x: number, y: number): number | null {
        const hitRadius = 10;

        for (let i = 0; i < this.positionsData.length; i++) {
            const pos = this.positionsData[i];
            const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));

            if (distance <= hitRadius) {
                return i;
            }
        }

        return null;
    }

    private highlightPosition(index: number) {
        if (this.currentHovered === index) {
            return;
        }

        this.resetHighlight();
        this.currentHovered = index;

        const pos = this.positionsData[index];
        const radius = 8;

        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        this.ctx.fill();
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    private resetHighlight() {
        if (this.currentHovered !== null) {
            this.drawTimeline(); // Перерисовываем весь canvas
            this.currentHovered = null;
        }
    }

    private showTooltip(index: number, mouseX: number, mouseY: number) {
        const tooltip = document.getElementById('timeline-tooltip');

        if (!tooltip) {
            return;
        }

        const pos = this.positionsData[index].position;

        tooltip.innerHTML = `
      <h3>${pos.title}</h3>
      <p><strong>${this.positionsData[index].company}</strong></p>
      <p>${this.formatDate(pos.startDate)} - ${pos.endDate ? this.formatDate(pos.endDate) : 'Present'}</p>
      <p>${pos.projects.slice(0, 2).join(', ')}${pos.projects.length > 2 ? '...' : ''}</p>
      <button class="more-btn">Подробнее</button>
    `;

        tooltip.style.display = 'block';
        tooltip.style.left = `${mouseX + 15}px`;
        tooltip.style.top = `${mouseY + 15}px`;

        // Обработчик кнопки (нужно для правильной работы pointer-events)
        tooltip.querySelector('.more-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openDetailsModal(pos);
        });
    }

    private hideTooltip() {
        const tooltip = document.getElementById('timeline-tooltip')!;

        if (!tooltip) {
            return;
        }

        tooltip.style.display = 'none';
    }

    private formatDate(date: Date): string {
        return date.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
    }

    private openDetailsModal(position: Position) {
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
