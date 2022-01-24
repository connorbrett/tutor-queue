import { Course } from '@/interfaces/course.interface';
import { IsEmail, IsString, ValidateNested } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @ValidateNested()
  public course: Course;

  @IsString()
  public description: string;
}
