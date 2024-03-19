import { GenezioDeploy } from "@genezio/types";
import { DataTypes, Sequelize } from "sequelize";
import pg from "pg";
import fetch from "node-fetch";
import { createMessage, deleteMessage, getAllMessages, getNMessages } from "./repository/message_repository";
import { MessageModel } from "./models/message";

type SuccessResponse = {
  status: "success";
  country: string;
  lat: number;
  lon: number;
  city: string;
};

type ErrorResponse = {
  status: "fail";
};

export type Message = {
  id?: number;
  message?: string;
}

@GenezioDeploy()
export class BackendService {
  constructor() {
    this.#initDatabase();
  }

  async hello(name: string): Promise<string> {
    const ipLocation: SuccessResponse | ErrorResponse = await fetch(
      "http://ip-api.com/json/"
    )
      .then((res) => res.json() as Promise<SuccessResponse>)
      .catch(() => ({ status: "fail" }));

    if (ipLocation.status === "fail") {
      return `Hello ${name}! Failed to get the server location :(`;
    }

    const formattedTime = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `Hello ${name}! This response was served from ${ipLocation.city}, ${ipLocation.country} (${ipLocation.lat}, ${ipLocation.lon}) at ${formattedTime}`;
  }

  async addMessage(message: string): Promise<Message> {
    const addedMessage = await createMessage(message);
    return addedMessage
  }

  async removeMessage(messageId: string) {
    await deleteMessage(messageId)
  }

  async getMessages(limit: number, all: boolean): Promise<Message[]>{
    if (!all) {
      const messages = await getNMessages(limit)
      return messages
    }

    const messages = await getAllMessages()
    return messages
  }

  #initDatabase() {
    const sequelize = new Sequelize(process.env.MY_POSTGRES_DATABASE_URL || "", {
      dialect: "postgres",
      dialectModule: pg,
      define: {
        timestamps: false,
      },
      dialectOptions: {
        ssl: {
          require: true,
        },
      },
    });

    MessageModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        message: DataTypes.STRING(512),
      },
      {
        sequelize,
        modelName: "Message",
        tableName: "messages",
      }
    );

    sequelize.sync();
  }
}
