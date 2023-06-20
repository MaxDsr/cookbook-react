import {IBodyRequest, ICombinedRequest, IContextRequest, IUserRequest} from "@/contracts/request";
import {NewPasswordPayload, ResetPasswordPayload, SignInPayload, SignUpPayload} from "@/contracts/auth";
import {Response} from "express";
import {resetPasswordService, userService, verificationService} from "@/services";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {jwtSign} from "@/utils/jwt";
import winston from "winston";
import mongoose, {startSession} from "mongoose";
import {createHash} from "@/utils/hash";
import {createCryptoString} from "@/utils/cryptoString";
import {createDateAddDaysFromNow} from "@/utils/dates";
import {ExpiresInDays} from "@/constants";
import {UserMail} from "@/mailer";

export const testController = {
  test: async (
    test: any,
    res: Response
  ) => {
    try {
      console.log('12313')
      return res.status(StatusCodes.OK).json({
        data: { jora: "uiiiii" },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      });
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },
}
