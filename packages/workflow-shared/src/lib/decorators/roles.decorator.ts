import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ROLES_METADATA } from '@workflow/common';
import { UserRole } from '@everbyte/contracts';

export const Roles = (...roles: UserRole[]): CustomDecorator =>
  SetMetadata(ROLES_METADATA, roles);
