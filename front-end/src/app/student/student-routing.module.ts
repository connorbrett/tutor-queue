import { NgModule } from '@angular/core';
import { RequestFormComponent } from './request-form/request-form.component';
import { RouterModule, Routes } from '@angular/router';
import { StudentContainerComponent } from './student-container/student-container.component';
import { StudentQueueComponent } from '../student/student-queue/student-queue.component';
import { QueuePlaceComponent } from './queue-place/queue-place.component';

const routes: Routes = [
  {
    path: 'student',
    component: StudentContainerComponent,
    children: [
      { path: 'queue', component: StudentQueueComponent },
      { path: 'place', component: QueuePlaceComponent },
      { path: 'request', component: RequestFormComponent },
      { path: '', redirectTo: 'request', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
