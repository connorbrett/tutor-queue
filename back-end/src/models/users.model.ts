import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isCoord: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const userModel = model<User & Document>('Tutor', userSchema);

export default userModel;
