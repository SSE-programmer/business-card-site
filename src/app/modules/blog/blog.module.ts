import { NgModule } from '@angular/core';

import { BlogPageComponent } from "./blog-page/blog-page.component";
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { BlogRoutingModule } from "./blog-routing.module";


@NgModule({
  declarations: [
    BlogPageComponent,
    ArticleDetailComponent
  ],
  imports: [
    BlogRoutingModule
  ]
})
export class BlogModule {}
