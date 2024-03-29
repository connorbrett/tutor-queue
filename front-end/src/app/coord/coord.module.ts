import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordRoutingModule } from './coord-routing.module';
import { CoordComponent } from './coord.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TutorListComponent } from './tutor-list/tutor-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { UtilitiesModule } from '@utilities/utilities.module';
import { CreateTutorComponent } from './create-tutor/create-tutor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BulkCreateTutorComponent } from './bulk-create-tutor/bulk-create-tutor.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { CourseListComponent } from './course-list/course-list.component';
import { EditTutorComponent } from './edit-tutor/edit-tutor.component';
import { EditCourseComponent } from './edit-course/edit-course.component';

/**
 *
 */
@NgModule({
  declarations: [
    CoordComponent,
    ScheduleComponent,
    TutorListComponent,
    NavBarComponent,
    CreateTutorComponent,
    BulkCreateTutorComponent,
    CourseFormComponent,
    CourseListComponent,
    EditTutorComponent,
    EditCourseComponent,
  ],
  imports: [CommonModule, UtilitiesModule, ReactiveFormsModule, CoordRoutingModule],
})
export class CoordModule {}
