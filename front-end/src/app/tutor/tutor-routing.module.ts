import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentQueueComponent } from './student-queue/student-queue.component';
import { TutorContainerComponent } from './tutor-container/tutor-container.component';
import { TutorDashboardComponent } from './tutor-dashboard/tutor-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: TutorContainerComponent,
    children: [
      {
        path: 'dashboard',
        component: TutorDashboardComponent,
        data: {
          title: 'Dashboard',
          showTitle: false,
        },
      },
      {
        path: 'queue',
        component: StudentQueueComponent,
        data: {
          title: 'Queue',
          showTitle: false,
        },
      },
      { path: '', redirectTo: '/tutor/dashboard', pathMatch: 'full' },
    ],
  },
];

/**
 * Overall routing for the /tutor/ pages.
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
