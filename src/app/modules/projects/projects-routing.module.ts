import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailComponent } from "./project-detail/project-detail.component";
import {ProjectsPageComponent} from "./projects-page/projects-page.component";

const routes: Routes = [
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'projects/:id', component: ProjectDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
