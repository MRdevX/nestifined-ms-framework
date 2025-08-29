import { BeforeUpdate, Column, Entity, Index } from "typeorm";
import { BaseEntity } from "../../core/database/base/base.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}
