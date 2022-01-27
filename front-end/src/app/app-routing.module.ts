import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RequestFormComponent } from './student/request-form/request-form.component';
import { StudentContainerComponent } from './student/student-container/student-container.component';
import { StudentQueueComponent } from './tutor/student-queue/student-queue.component';
import { TutorContainerComponent } from './tutor/tutor-container/tutor-container.component';
import { TutorDashboardComponent } from './tutor/tutor-dashboard/tutor-dashboard.component';
import { AuthGuard } from './utilities/guards/auth/auth.guard';
import { AppRoutingModule as StudentAppRouting } from './student/student-routing.module';
import { AppRoutingModule as TutorAppRouting } from './tutor/tutor-routing.module';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/student', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
