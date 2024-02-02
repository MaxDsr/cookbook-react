import {model, Schema} from "mongoose";
import {IUser, UserModel} from "@/contracts/user";


const schema = new Schema<IUser, UserModel>(
  {
    username: String,
    password: String,
    tokens: [{type: String}],
  }
);

export const User = model<IUser, UserModel>('users', schema);
