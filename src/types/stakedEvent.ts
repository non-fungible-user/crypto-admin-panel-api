import { Document } from 'mongoose';

export interface StakedEvent extends Document {
  address: string;
  amount: string;
  duration: string;
  index: string;
  price: string;
  token: string;
  blockNumber: number;
}
