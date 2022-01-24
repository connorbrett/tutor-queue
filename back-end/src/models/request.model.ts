import { model, Schema, Document } from 'mongoose';
import { Request } from '@/interfaces/request.interface';

const requestSchema: Schema = new Schema({
  name: String,
  email: String,
  course: String,
  description: String,
  tutor: { type: Schema.Types.ObjectId, ref: 'Tutor' },
  status: String,
  submitted: Date,
});

const requestModel = model<Request & Document>('TutorRequests', requestSchema);

export default requestModel;
