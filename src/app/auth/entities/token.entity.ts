import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TypeOrmBaseModel } from "../../core/base/typeorm/typeorm.base.entity";
import { User } from "../../users/entities/user.entity";

export enum TokenType {
  REFRESH = "refresh",
  PASSWORD_RESET = "password_reset",
}

@Entity()
@Index(["userId", "type"])
export class Token extends TypeOrmBaseModel {
  @Column({ length: 255 })
  token: string;

  @Column({
    type: "enum",
    enum: TokenType,
  })
  type: TokenType;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }
}
