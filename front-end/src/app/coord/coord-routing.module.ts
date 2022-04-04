import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkCreateTutorComponent } from './bulk-create-tutor/bulk-create-tutor.component';
import { CoordComponent } from './coord.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CreateTutorComponent } from './create-tutor/create-tutor.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { EditTutorComponent } from './edit-tutor/edit-tutor.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TutorListComponent } from './tutor-list/tutor-list.component';

const routes: Routes = [
  {
    path: '',
    component: CoordComponent,
    children: [
      {
        path: 'schedule',
        component: ScheduleComponent,
        data: {
          title: 'Schedule',
          showTitle: false,
        },
      },
      {
        path: 'tutors',
        children: [
          { path: '', component: TutorListComponent },
          { path: 'create', component: CreateTutorComponent },
          { path: 'bulk', component: BulkCreateTutorComponent },
          { path: ':id', children: [{ path: 'edit', component: EditTutorComponent }] },
        ],
        data: {
          title: 'Tutors',
          showTitle: false,
        },
      },
      {
        path: 'courses',
        children: [
          { path: '', component: CourseListComponent },
          { path: 'create', component: CourseFormComponent },
          { path: ':id', children: [{ path: 'edit', component: EditCourseComponent }] },
        ],
        data: {
          title: 'Courses',
          showTitle: false,
        },
      },
      { path: '', redirectTo: '/coord/tutors', pathMatch: 'full' },
    ],
  },
];

/**
 * Routing mechanism for coordinators.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordRoutingModule {}
