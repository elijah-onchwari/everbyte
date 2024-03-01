import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty, ROLES_METADATA } from '@workflow/common';
import { UserRole } from '@everbyte/contracts';
import { RequestContext } from '@workflow/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /*
     * Retrieve metadata for a specified key for a specified set of roles
     */
    const roles =
      this._reflector.getAllAndOverride<UserRole[]>(ROLES_METADATA, [
        context.getHandler(), // Method Roles
        context.getClass(), // Controller Roles
      ]) || [];
    let isAuthorized = false;
    if (isEmpty(roles)) {
      isAuthorized = true;
    } else {
      isAuthorized = RequestContext.hasRoles(roles);
    }
    return isAuthorized;
  }
}
