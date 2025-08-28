import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import { OWNERSHIP_KEY } from "../decorators/require-permission.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresOwnership = this.reflector.get(OWNERSHIP_KEY, context.getHandler());

    if (!requiresOwnership) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const entityId = request.params.id;

    if (!user?.userId || !entityId) {
      throw new ForbiddenException("Access denied");
    }

    if (entityId !== user.userId) {
      throw new ForbiddenException("Access denied");
    }

    return true;
  }
}
