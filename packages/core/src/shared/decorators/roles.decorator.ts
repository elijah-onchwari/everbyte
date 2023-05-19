import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ROLES_METADATA } from '@everbyte/common';
import { RolesEnum } from '@everbyte/contracts';

export const Roles = (...roles: RolesEnum[]): CustomDecorator => SetMetadata(ROLES_METADATA, roles);