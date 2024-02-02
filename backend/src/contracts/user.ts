import {Entity} from "@/contracts/entity";
import {Model} from "mongoose";

export interface IUser extends Entity {
  username: string
  password: string
  tokens: string[]
}

export type UserModel = Model<IUser>;
