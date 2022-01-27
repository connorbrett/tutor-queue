import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { StudentQueueComponent } from './student-queue/student-queue.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'tutor',
    component: StudentQueueComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'queue', component: StudentQueueComponent }],
  },
  { path: 'student', component: RequestFormComponent },
  { path: '', redirectTo: '/student', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
