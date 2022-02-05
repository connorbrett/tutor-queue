import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkCreateTutorComponent } from './bulk-create-tutor/bulk-create-tutor.component';
import { CoordComponent } from './coord.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CreateTutorComponent } from './create-tutor/create-tutor.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TutorListComponent } from './tutor-list/tutor-list.component';

const routes: Routes = [
  {
    path: '',
    component: CoordComponent,
    children: [
      { path: 'schedule', component: ScheduleComponent },
      {
        path: 'tutors',
        children: [
          { path: '', component: TutorListComponent },
          { path: 'create', component: CreateTutorComponent },
          { path: 'bulk', component: BulkCreateTutorComponent },
        ],
      },
      {
        path: 'courses',
        children: [
          { path: '', component: CourseListComponent },
          { path: 'create', component: CourseFormComponent },
        ],
      }
    ],
  },
  { path: '**', component: CoordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordRoutingModule {}
