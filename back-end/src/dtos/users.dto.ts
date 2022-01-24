import { Course } from '@/interfaces/course.interface';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsArray({ each: true })
  @ValidateNested()
  @IsOptional()
  public courses: Course[];

  @IsBoolean()
  @IsOptional()
  public isCoord: boolean;
}
