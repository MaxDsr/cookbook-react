import {Entity} from "@/contracts/entity";
import {Model} from "mongoose";

export interface IUser extends Entity {
  email: string
  name: string
  nickname: string
  picture: string
}

export type UserModel = Model<IUser>;
