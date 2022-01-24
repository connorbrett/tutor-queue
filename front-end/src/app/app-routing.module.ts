import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestFormComponent } from './request-form/request-form.component';
import { StudentQueueComponent } from './student-queue/student-queue.component';

const routes: Routes = [
  { path: 'tutor', component: StudentQueueComponent },
  { path: 'student', component: RequestFormComponent },
  { path: '', redirectTo: '/student', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
