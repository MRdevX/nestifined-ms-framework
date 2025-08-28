import type { IBaseEntity } from './interfaces/base.interface';

export abstract class BaseModel implements IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
