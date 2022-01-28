import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordComponent } from './coord.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TutorListComponent } from './tutor-list/tutor-list.component';

const routes: Routes = [
  {
    path: '',
    component: CoordComponent,
    children: [
      { path: 'schedule', component: ScheduleComponent },
      { path: 'tutors', component: TutorListComponent },
    ],
  },
  { path: '**', component: CoordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordRoutingModule {}
