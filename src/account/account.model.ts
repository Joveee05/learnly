import * as mongoose from 'mongoose';

export const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    balance: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountNumber: {
      type: Number,
      default: Math.floor(Math.random() * 100000000 + 2),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export interface Account {
  id: string;
  name: string;
  balance: number;
  userId: string;
  accountNumber: number;
}
