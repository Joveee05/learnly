import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone_number: { type: Number, required: true, unique: true },
    role: { type: String, required: true, default: 'user' },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
    versionKey: false,
    timestamps: true,
  },
);

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone_number: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
