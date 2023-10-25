import * as mongoose from 'mongoose';

export const StakedEventSchema = new mongoose.Schema({
  address: { type: String, required: true },
  amount: { type: String, required: true },
  duration: { type: String, required: true },
  index: { type: String, required: true },
  price: { type: String, required: true },
  token: { type: String, required: true },
  blockNumber: { type: Number, required: true },
});
