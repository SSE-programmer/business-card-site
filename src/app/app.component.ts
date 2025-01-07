import { Component } from '@angular/core';
import { AppHeaderComponent } from './pages/app-header/app.header.component';
import { RouterOutlet } from '@angular/router';
import { AppFooterComponent } from './pages/app-footer/app.footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    AppHeaderComponent,
    RouterOutlet,
    AppFooterComponent
  ],
  standalone: true
})
export class AppComponent {
  title = 'SSE-programmer';
}
