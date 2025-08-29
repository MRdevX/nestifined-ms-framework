import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../core/database/base/base.entity";

export enum TokenType {
  REFRESH = "refresh",
  PASSWORD_RESET = "password_reset",
}

@Entity("tokens")
export class Token extends BaseEntity {
  @Column()
  token: string;

  @Column()
  userId: string;

  @Column({
    type: "enum",
    enum: TokenType,
  })
  type: TokenType;

  @Column({ nullable: true })
  expiresAt?: Date;

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }
}
