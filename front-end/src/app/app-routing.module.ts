import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tutor', loadChildren: () => import('./tutor/tutor-routing.module').then((m) => m.AppRoutingModule) },
  { path: 'student', loadChildren: () => import('./student/student-routing.module').then((m) => m.AppRoutingModule) },
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
