import { Course } from '@/interfaces/course.interface';

export interface User {
  _id: string;
  email: string;
  password: string;
  isCoord: boolean;
  name: string;
  courses: Course[];
}
