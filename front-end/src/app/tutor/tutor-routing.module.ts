import { AuthGuard } from '../utilities/guards/auth/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentQueueComponent } from './student-queue/student-queue.component';
import { TutorContainerComponent } from './tutor-container/tutor-container.component';
import { TutorDashboardComponent } from './tutor-dashboard/tutor-dashboard.component';

const routes: Routes = [
  {
    path: 'tutor',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: TutorContainerComponent,
    children: [
      { path: '', component: TutorDashboardComponent },
      { path: 'queue', component: StudentQueueComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
