import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentQueueComponent } from '../tutor/student-queue/student-queue.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { StudentContainerComponent } from './student-container/student-container.component';

const routes: Routes = [
  {
    path: 'student',
    component: StudentContainerComponent,
    children: [
      { path: '', component: RequestFormComponent },
      { path: 'queue', component: StudentQueueComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
