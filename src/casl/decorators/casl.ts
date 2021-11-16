import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../types/casl';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) => {
  return SetMetadata(CHECK_POLICIES_KEY, handlers);
};
