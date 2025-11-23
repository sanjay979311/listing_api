// import mongoose from "mongoose";
import { Schema, model } from 'mongoose';
  const WebInfoSchema = new Schema({
  address: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  email: {
    type: String,
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  linkedIn: {
    type: String,
  },
});

export default model('Webinfo', WebInfoSchema);
