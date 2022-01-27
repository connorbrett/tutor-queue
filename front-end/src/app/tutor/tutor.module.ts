import { AppRoutingModule } from './tutor-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CurrentRequestComponent } from './current-request/current-request.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RecentRequestsComponent } from './recent-requests/recent-requests.component';
import { StudentQueueComponent } from './student-queue/student-queue.component';
import { TutorContainerComponent } from './tutor-container/tutor-container.component';
import { TutorDashboardComponent } from './tutor-dashboard/tutor-dashboard.component';
import { TutorNavBarComponent } from './tutor-nav-bar/tutor-nav-bar.component';
import { UtilitiesModule } from '../utilities/utilities.module';

@NgModule({
  declarations: [
    StudentQueueComponent,
    TutorDashboardComponent,
    TutorNavBarComponent,
    TutorContainerComponent,
    RecentRequestsComponent,
    CurrentRequestComponent,
  ],
  imports: [UtilitiesModule, CommonModule, AppRoutingModule, BrowserModule, ReactiveFormsModule],
  exports: [StudentQueueComponent, TutorDashboardComponent, TutorNavBarComponent, TutorContainerComponent],
})
export class TutorModule {}
