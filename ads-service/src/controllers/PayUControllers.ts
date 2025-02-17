import { Request, Response } from "express";
import axios from "axios";
import PayUOrderCollection from "../models/PayUOrderCollection";
import { MESSAGES } from "../utils/constants";
import { StatusCode } from "../utils/enums";
import logger from "../utils/logger";
const crypto = require("crypto");

export interface IPaymentController {
  payment(req: Request, res: Response): Promise<void>;
  response(req: Request, res: Response): Promise<void>;
  saveData(req: Request, res: Response): Promise<void>;
}

export default class PaymentController implements IPaymentController {
  async payment(req: Request, res: Response) {
    try {
      const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || "O5ouUQ";
      const PAYU_SALT =
        process.env.PAYU_SALT || "36I1YEpHRRaMRcsRI4iglOgoUUHB6KfB";

      // Helper function to generate hash
      const generateHash = (
        key: string,
        txnid: string,
        amount: string,
        productinfo: string,
        firstname: string,
        email: string,
        salt: string
      ): string => {
        const input = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
        return crypto.createHash("sha512").update(input).digest("hex");
      };

      // Extract request body
      const { txnid, amount, productinfo, firstname, email } = req.body;

      // Validate input
      if (!txnid || !amount || !productinfo || !firstname || !email) {
        logger.warn("Mandatory fields missing in payment request");

        res
          .status(StatusCode.BAD_REQUEST)
          .send(MESSAGES.MANDATORY_FIELDS_MISSING);
      }

      // Generate hash
      const hash = generateHash(
        PAYU_MERCHANT_KEY,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        PAYU_SALT
      );
      logger.info(`Payment hash generated for txnid: ${txnid}`);

      // Respond with the generated hash
      res
        .status(StatusCode.OK)
        .json({ message: MESSAGES.HASH_GENERATED, hash });
    } catch (error) {
      console.error("Error in payment:", error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send(MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async response(req: Request, res: Response) {
    var pd = req.body;
    const formData = new URLSearchParams();
    formData.append("key", pd.key);
    formData.append("txnid", pd.txnid);
    formData.append("amount", parseFloat(pd.amount).toFixed(2));
    formData.append("productinfo", pd.productinfo);
    formData.append("firstname", pd.firstname);
    formData.append("email", pd.email);
    formData.append("phone", pd.phone);
    formData.append("surl", pd.surl);
    formData.append("furl", pd.furl);
    formData.append("hash", pd.hash);
    formData.append("service_provider", pd.service_provider);

    logger.info(`Data being sent to PayU: ${formData.toString()}`);



    try {
      const result = await axios.post(
        "https://test.payu.in/_payment",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      logger.info(`PayU response received: ${result.request.res.responseUrl}`);

      res.send(result.request.res.responseUrl);
    } catch (err: any) {
      logger.error(`Error during PayU response handling: ${err.message}`);

      console.log("error", err);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send(MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }
  async saveData(req: Request, res: Response) {
    const {
      country,
      mode,
      error_Message,
      state,
      bankcode,
      txnid,
      net_amount_debit,
      lastname,
      zipcode,
      phone,
      productinfo,
      hash,
      status,
      firstname,
      city,
      isConsentPayment,
      error,
      addedon,
      encryptedPaymentId,
      bank_ref_num,
      key,
      email,
      amount,
      unmappedstatus,
      address2,
      payuMoneyId,
      address1,
      mihpayid,
      giftCardIssued,
      field1,
      cardnum,
      field7,
      field6,
      field9,
      field8,
      amount_split,
      field3,
      field2,
      field5,
      PG_TYPE,
      field4,
      name_on_card,
      userId,
    } = req.body;

    try {
      const newOrder = new PayUOrderCollection({
        country: country,
        mode: mode,
        error_Message: error_Message,
        state: state,
        bankcode: bankcode,
        txnid: txnid,
        net_amount_debit: net_amount_debit,
        lastname: lastname,
        zipcode: zipcode,
        phone: phone,
        productinfo: productinfo,
        hash: hash,
        status: status,
        firstname: firstname,
        city: city,
        isConsentPayment: isConsentPayment,
        error: error,
        addedon: addedon,
        encryptedPaymentId: encryptedPaymentId,
        bank_ref_num: bank_ref_num,
        key: key,
        email: email,
        amount: amount,
        unmappedstatus: unmappedstatus,
        address2: address2,
        payuMoneyId: payuMoneyId,
        address1: address1,
        mihpayid: mihpayid,
        giftCardIssued: giftCardIssued,
        field1: field1,
        cardnum: cardnum,
        field7: field7,
        field6: field6,
        field9: field9,
        field8: field8,
        amount_split: amount_split,
        field3: field3,
        field2: field2,
        field5: field5,
        PG_TYPE: PG_TYPE,
        field4: field4,
        name_on_card: name_on_card,
        userId: userId,
      });

      const PayUOrder = await newOrder.save();
      logger.info(`Payment order saved successfully with ID: ${PayUOrder._id}`);

      res.status(StatusCode.OK).send(PayUOrder._id);
    } catch (err: any) {
      logger.error(`Error saving payment data: ${err.message}`);

      res.status(500).send("MongoDB could not save the data");
    }
  }
}
