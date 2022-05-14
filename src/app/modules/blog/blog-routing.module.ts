import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailComponent } from "./article-detail/article-detail.component";
import { BlogPageComponent } from "./blog-page/blog-page.component";

const routes: Routes = [
  { path: 'blog', component: BlogPageComponent },
  { path: 'blog/:id', component: ArticleDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
