import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_METADATA } from '@everbyte/common';
import { PermissionsEnum } from '@everbyte/contracts';

export const Permissions = (...permissions: PermissionsEnum[]) => SetMetadata(PERMISSIONS_METADATA, permissions);