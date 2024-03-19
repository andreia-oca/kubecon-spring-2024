import { Model } from "sequelize";

export class MessageModel extends Model {
  id!: number;
  message?: string;
}
