import {model, Schema} from "mongoose";
import {IUser, UserModel} from "@/contracts/user";

const schema = new Schema<IUser, UserModel, unknown>(
  {
    email: String,
    name: String,
    nickname: String,
    picture: String,
    auth0Id: String
  }, {strict: "throw"}
)

export const User = model<IUser, UserModel>('users', schema);
