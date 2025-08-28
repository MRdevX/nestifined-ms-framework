import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';
import { TypeOrmBaseModel } from '../../core/base/typeorm/typeorm.base.entity';

@Entity()
export class User extends TypeOrmBaseModel {
  @Index({ unique: true })
  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 120, nullable: true })
  name?: string;

  @Column({ length: 255, nullable: true, select: false })
  password?: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.trim().toLowerCase();
    }
  }
}
