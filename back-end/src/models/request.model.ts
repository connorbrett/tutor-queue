import { model, Schema, Document } from 'mongoose';
import { Request } from '@/interfaces/request.interface';

const requestSchema: Schema = new Schema({
  name: Schema.Types.String,
  email: Schema.Types.String,
  course: Schema.Types.String,
  description: Schema.Types.String,
  tutor: { type: Schema.Types.ObjectId, ref: 'Tutor' },
  status: Schema.Types.String,
  submitted: Schema.Types.Date,
});

const requestModel = model<Request & Document>('TutorRequests', requestSchema);

export default requestModel;
