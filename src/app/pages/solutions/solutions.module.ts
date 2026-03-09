import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolutionsRoutingModule } from './solutions-routing.module';
import { SolutionsComponent } from './solutions.component';

@NgModule({
  declarations: [SolutionsComponent],
  imports: [CommonModule, SolutionsRoutingModule]
})
export class SolutionsModule {}
