import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { AuthGuard } from './utilities/guards/auth/auth.guard';
import { AdminAuthGuard } from './utilities/guards/admin-auth/admin-auth.guard';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordCallbackComponent } from './reset-password-callback/reset-password-callback.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ThrottleComponent } from './error/error-pages/throttle/throttle.component';
import { GenericComponent } from './error/error-pages/generic/generic.component';
import { UnauthorizedComponent } from './error/error-pages/unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login',
    },
  },
  {
    path: 'tutor',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./tutor/tutor.module').then((m) => m.TutorModule),
  },
  { path: 'student', loadChildren: () => import('./student/student.module').then((m) => m.StudentModule) },
  {
    path: 'coord',
    canLoad: [AuthGuard, AdminAuthGuard],
    canActivate: [AuthGuard, AdminAuthGuard],
    canActivateChild: [AuthGuard, AdminAuthGuard],
    loadChildren: () => import('./coord/coord.module').then((m) => m.CoordModule),
  },
  {
    /**
     * This 'module' is a series of redirects accessible for the kiosk.
     */
    path: 'kiosk',
    children: [{ path: 'request', redirectTo: '/student/request?reload=true' }],
  },
  {
    path: 'activate/:uid/:token',
    component: ActivateUserComponent,
    data: {
      title: 'Account Activation',
    },
  },
  {
    path: 'reset-password',
    children: [
      {
        path: '',
        component: ResetPasswordComponent,
        data: {
          title: 'Reset Password',
        },
      },
      {
        path: ':uid/:token',
        component: ResetPasswordCallbackComponent,
        data: {
          title: 'Reset Password',
        },
      },
    ],
  },
  {
    path: 'me',
    component: UserProfileComponent,
    data: {
      title: 'My Profile',
    },
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: {
      title: 'Unauthorized',
    },
  },
  {
    path: 'throttled',
    component: ThrottleComponent,
    data: {
      title: 'Throttled',
    },
  },
  { path: '', redirectTo: '/student/request', pathMatch: 'full' },
  {
    path: '**',
    component: GenericComponent,
    data: {
      title: 'Error',
    },
  },
];

/**
 *
 */
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
