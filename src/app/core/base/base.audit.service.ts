import { Injectable } from '@nestjs/common';
import type { BaseModel } from './base.entity';
import type { BaseRepository } from './base.repository';
import { BaseService } from './base.service';
import type { IPaginatedResult, IPaginationOptions } from './interfaces/base.interface';

export interface AuditLog extends BaseModel {
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
  userId?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

@Injectable()
export abstract class BaseAuditService<T extends BaseModel> extends BaseService<T> {
  constructor(
    protected readonly repository: BaseRepository<T>,
    protected readonly auditRepository: BaseRepository<AuditLog>,
  ) {
    super(repository);
  }

  protected async logAudit(
    entityId: string,
    action: AuditLog['action'],
    userId?: string,
    changes?: Record<string, unknown>,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const auditLog: Partial<AuditLog> = {
      entityType: this.getEntityType(),
      entityId,
      action,
      userId,
      changes,
      metadata,
    };

    await this.auditRepository.create(auditLog);
  }

  protected abstract getEntityType(): string;

  async createWithAudit(data: Partial<T>, userId?: string): Promise<T> {
    const entity = await super.create(data);
    await this.logAudit(entity.id, 'CREATE', userId, data);
    return entity;
  }

  async updateWithAudit(id: string, data: Partial<T>, userId?: string): Promise<T> {
    const oldEntity = await this.findById(id);
    const entity = await super.update(id, data);
    await this.logAudit(id, 'UPDATE', userId, data, { previousData: oldEntity });
    return entity;
  }

  async deleteWithAudit(id: string, userId?: string): Promise<void> {
    const entity = await this.findById(id);
    await super.delete(id);
    await this.logAudit(id, 'DELETE', userId, undefined, { deletedData: entity });
  }

  async restoreWithAudit(id: string, userId?: string): Promise<T> {
    const restored = await this.repository.restore(id);
    if (!restored) {
      throw new Error(`Failed to restore entity with ID ${id}`);
    }
    const entity = await this.findById(id);
    await this.logAudit(id, 'RESTORE', userId);
    return entity;
  }

  async getAuditHistory(entityId: string, options: IPaginationOptions = {}): Promise<IPaginatedResult<AuditLog>> {
    return this.auditRepository.findWithPagination({ entityType: this.getEntityType(), entityId }, options);
  }
}
