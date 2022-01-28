import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { AuthGuard } from './utilities/guards/auth/auth.guard';
import { AdminAuthGuard } from './utilities/guards/admin-auth/admin-auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'tutor',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./tutor/tutor.module').then((m) => m.TutorModule),
  },
  { path: 'student', loadChildren: () => import('./student/student.module').then((m) => m.StudentModule) },
  {
    path: 'coord',
    canActivate: [AuthGuard, AdminAuthGuard],
    canActivateChild: [AuthGuard, AdminAuthGuard],
    loadChildren: () => import('./coord/coord.module').then((m) => m.CoordModule),
  },
  { path: '', redirectTo: '/student/request', pathMatch: 'full' },
  { path: '**', redirectTo: '/student/request' },
];

@NgModule({
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
