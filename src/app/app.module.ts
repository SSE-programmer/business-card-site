import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';


import { AngularResizeEventModule } from 'angular-resize-event'
import { ClickOutsideModule } from 'ng-click-outside';

import { AppHeaderComponent} from './components/app-header/app.header.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProjectsPageComponent } from './components/projects-page/projects-page.component';
import { BlogPageComponent } from './components/blog-page/blog-page.component';
import { ContactsPageComponent } from './components/contacts-page/contacts-page.component';
import { AppFooterComponent } from './components/app-footer/app.footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'blog', component: BlogPageComponent },
  { path: 'contacts', component: ContactsPageComponent },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    HomePageComponent,
    ProjectsPageComponent,
    BlogPageComponent,
    ContactsPageComponent,
    AppFooterComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularResizeEventModule,
    ClickOutsideModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
