import { BaseModel } from "../base.entity";

export abstract class DrizzleBaseModel extends BaseModel {
  declare id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;
}

export const baseFields = {
  id: "id",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
} as const;
