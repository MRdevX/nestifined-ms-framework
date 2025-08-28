import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';

export interface OwnershipCheck {
  entityType: 'wish' | 'wishlist';
  paramName?: string;
}

export const RequireOwnership = (check: OwnershipCheck) => SetMetadata(OWNERSHIP_KEY, check);
