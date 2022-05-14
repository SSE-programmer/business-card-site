import { NgModule } from '@angular/core';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsPageComponent } from "./projects-page/projects-page.component";
import { ProjectDetailComponent } from "./project-detail/project-detail.component";


@NgModule({
  declarations: [
    ProjectsPageComponent,
    ProjectDetailComponent
  ],
  imports: [
    ProjectsRoutingModule
  ]
})
export class ProjectsModule {}
