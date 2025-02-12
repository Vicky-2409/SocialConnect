import { Channel } from "amqplib";
import { IUser } from "../models/userCollection";
import { MQActions } from "./config";
import { userService, postsServices } from "../routes/injection";

interface IMessageHandler {
  handle: (
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string,
    channel: Channel
  ) => Promise<void>;
}

export const MessageHandler: IMessageHandler = {
  handle: async function (operation, data, correlationId, replyTo, channel) {
    try {
      let response;

      switch (operation) {
        case `${MQActions.addUser}`: {
          response = await createUser(data);
          break;
        }
        case `${MQActions.editUser}`: {
          response = await updateUser(data);
          break;
        }
        case `${MQActions.addWeNetAd}`: {
          response = await createWeNetAd(data);
          break;
        }
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      // Send response back to the replyTo queue
      // const responseBuffer = Buffer.from(JSON.stringify(response));
      // channel.sendToQueue(replyTo, responseBuffer, { correlationId });
    } catch (error: any) {
      console.error("Error handling message:", error);

      // Send error response back to the replyTo queue
      // const errorBuffer = Buffer.from(JSON.stringify({ error: error.message }));
      // channel.sendToQueue(replyTo, errorBuffer, { correlationId });
    }
  },
};

// Operations
async function createUser(data: IUser) {
  try {
    return await userService.addUser(data);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function updateUser(data: IUser) {
  try {
    return await userService.updateUser(data);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function createWeNetAd(data: any) {
  try {
    const { postId, WeNetAds } = data;

    const message = await postsServices.createWeNetAd(postId, WeNetAds);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
