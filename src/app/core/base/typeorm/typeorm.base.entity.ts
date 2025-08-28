import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseModel } from '../base.entity';

export abstract class TypeOrmBaseModel extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @CreateDateColumn({ type: 'timestamp' })
  declare createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  declare updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  declare deletedAt?: Date;
}
