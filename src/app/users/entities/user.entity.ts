import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../core/database/base/base.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
