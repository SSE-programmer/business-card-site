import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { AngularResizeEventModule } from 'angular-resize-event'
import { ClickOutsideModule } from 'ng-click-outside';

import { AppHeaderComponent} from './modules/app-header/app.header.component';
import { AppFooterComponent } from './modules/app-footer/app.footer.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { HomeModule } from "./modules/home/home.module";
import { ProjectsModule } from './modules/projects/projects.module';
import { BlogModule } from "./modules/blog/blog.module";
import { ContactsModule } from "./modules/contacts/contacts.module";
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AngularResizeEventModule,
    ClickOutsideModule,
    HomeModule,
    ProjectsModule,
    BlogModule,
    ContactsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
