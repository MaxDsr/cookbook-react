import {Request, Response} from "express";
import {User} from "@/models/user";
import {StatusCodes} from "http-status-codes";


export const recordUserController = {
  recordUser: async (req: Request, res: Response) => {
    const {email, name, nickname, picture, auth0Id} = req.body;
    let user;

    try {
      const findResult = await User.findOne({auth0Id});

      if (!!findResult) {
        return res.status(StatusCodes.OK).json({
          message: "Ok",
          status: StatusCodes.OK
        });
      }

      user = new User({email, name, nickname, picture, auth0Id});
      await user.save();

      return res.status(StatusCodes.OK).json({
        message: "Ok",
        status: StatusCodes.OK
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error,
        status: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  }
};
