import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';


@Component({
    selector: 'ec-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
    standalone: true,
    imports: [
        RouterOutlet,
        MainFooterComponent,
        MainHeaderComponent
    ]
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
    public ngOnInit() {
    }

    public ngAfterViewInit(): void {
    }
}
