import { MessageModel } from "../models/message";

export async function createMessage(
  message: string,
): Promise<MessageModel> {
  const messageObject = await MessageModel.create({
    message: message,
  });

  return messageObject;
}

export async function deleteMessage(id: string) {
  const message = await MessageModel.findOne({ where: { id: id } });
  if (message) {
    await message.destroy();
  }
}

export async function getNMessages(
  limit: number,
): Promise<MessageModel[]> {
  const messages = await MessageModel.findAll({
    limit: limit,
  });

  return messages;
}

export async function getAllMessages(): Promise<MessageModel[]> {
  const messages = await MessageModel.findAll();

  return messages;
}
