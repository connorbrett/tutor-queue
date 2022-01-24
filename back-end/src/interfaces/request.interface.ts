export interface Request {
  _id: string;
  name: String;
  email: String;
  course: String;
  description: String;
  tutor: string;
  status: String;
  submitted: Date;
}

export enum Status {
  Waiting = 'Waiting',
  Complete = 'Complete',
  InProgress = 'In Progress',
}
