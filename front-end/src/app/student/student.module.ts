import { NgModule } from '@angular/core';
import { RequestFormComponent } from './request-form/request-form.component';
import { StudentContainerComponent } from './student-container/student-container.component';
import { StudentNavBarComponent } from './student-nav-bar/student-nav-bar.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import { AppRoutingModule } from './student-routing.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RequestFormComponent,
    StudentContainerComponent,
    StudentNavBarComponent,
  ],
  imports: [
    UtilitiesModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [
    RequestFormComponent,
    StudentContainerComponent,
    StudentNavBarComponent,
  ],
})
export class StudentModule {}
