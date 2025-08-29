import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../core/database/base/base.entity";
import { User } from "../../users/entities/user.entity";

export enum TokenType {
  REFRESH = "refresh",
  PASSWORD_RESET = "password_reset",
}

@Entity("tokens")
@Index(["userId", "type"])
export class Token extends BaseEntity {
  @Column()
  token: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

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
