import { AppRoutingModule } from './student-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestFormComponent } from './request-form/request-form.component';
import { StudentContainerComponent } from './student-container/student-container.component';
import { StudentNavBarComponent } from './student-nav-bar/student-nav-bar.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import { QueuePlaceComponent } from './queue-place/queue-place.component';
import { StudentQueueComponent } from './student-queue/student-queue.component';

@NgModule({
  declarations: [RequestFormComponent, StudentContainerComponent, StudentNavBarComponent, QueuePlaceComponent, StudentQueueComponent],
  imports: [UtilitiesModule, CommonModule, AppRoutingModule, ReactiveFormsModule],
  exports: [RequestFormComponent, StudentContainerComponent, StudentNavBarComponent],
})
export class StudentModule {}
