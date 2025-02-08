import { ErrorRequestHandler } from "express";
import { GeneralErrorMsg, ResponseMsg } from "../utils/constants";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const errorMsg = error.message || GeneralErrorMsg.UNEXPECTED_ERROR;

  if (
    errorMsg.includes(GeneralErrorMsg.DUPLICATE_KEY_INDEX) ||
    errorMsg.includes(GeneralErrorMsg.DUPLICATE_KEY)
  ) {
    console.error(error);
    res.status(409).send(ResponseMsg.CREDENTIAL_EXIST);
    return; // Explicitly return to satisfy TypeScript
  }

  console.error("Error:", errorMsg);
  res.status(400).send(errorMsg);
  return; // Explicitly return to satisfy TypeScript
};
