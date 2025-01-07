import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppFooterComponent } from '../../../pages/app-footer/app.footer.component';
import { AppHeaderComponent } from '../../../pages/app-header/app.header.component';


@Component({
    selector: 'ec-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
    standalone: true,
    imports: [
        RouterOutlet,
        AppFooterComponent,
        AppHeaderComponent
    ]
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
    public ngOnInit() {
    }

    public ngAfterViewInit(): void {
    }
}
