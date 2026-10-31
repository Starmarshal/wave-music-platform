import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

// Журнал действий над каталогом и пользователями для админки
@Injectable()
export class AuditService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async log(
    user: User | undefined,
    action: string,
    entityType: string,
    entityId: string | null,
    details: Record<string, unknown> = {},
  ) {
    await this.dataSource.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [user?.id ?? null, action, entityType, entityId, JSON.stringify(details)],
    );
  }

  async list(limit = 100, offset = 0) {
    const rows = await this.dataSource.query(
      `SELECT l.id, l.action, l.entity_type, l.entity_id, l.details, l.created_at,
              u.id AS user_id, u.display_name, u.email
       FROM audit_log l LEFT JOIN users u ON u.id = l.user_id
       ORDER BY l.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return rows.map((row) => ({
      _id: String(row.id),
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      details: row.details,
      createdAt: row.created_at,
      user: row.user_id
        ? { _id: row.user_id, displayName: row.display_name, email: row.email }
        : null,
    }));
  }
}
