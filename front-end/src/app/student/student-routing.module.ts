import { NgModule } from '@angular/core';
import { RequestFormComponent } from './request-form/request-form.component';
import { RouterModule, Routes } from '@angular/router';
import { StudentContainerComponent } from './student-container/student-container.component';
import { StudentQueueComponent } from '../student/student-queue/student-queue.component';
import { QueuePlaceComponent } from './queue-place/queue-place.component';

const routes: Routes = [
  {
    path: '',
    component: StudentContainerComponent,
    children: [
      {
        path: 'queue',
        component: StudentQueueComponent,
        data: {
          title: 'Queue',
          subtitle: 'This queue shows all students currently waiting to be met with.',
        },
      },
      {
        path: 'place',
        component: QueuePlaceComponent,
        data: {
          title: 'Your Place in the Queue',
        },
      },
      {
        path: 'request',
        component: RequestFormComponent,
        data: {
          title: 'Request Help',
          subtitle: 'Please enter your information and then take a seat, someone will help you momentarily.',
        },
      },
      { path: '', redirectTo: 'request', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
