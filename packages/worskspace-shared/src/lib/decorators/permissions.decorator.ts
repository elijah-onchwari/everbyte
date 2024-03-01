import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_METADATA } from '@everbyte/common';
import { UserPermission } from '@everbyte/contracts';

export const Permissions = (...permissions: UserPermission[]) => SetMetadata(PERMISSIONS_METADATA, permissions);