import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/user.entity';
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from '../casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/casl';
import { PolicyHandler } from '../types/casl';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const users = new User();

    const { user } = context.switchToHttp().getRequest();

    Object.assign(users, user);
    const ability = this.caslAbilityFactory.createForUser(users);

    console.log('isAdmin', users.isAdmin);

    console.log('trang thai', ability.can(Action.Read, users));

    //policyHandlers là 1 mảng được gán ở decorator
    return policyHandlers.every((handler) => {
      // console.log('', this.execPolicyHandler(handler, ability));

      return this.execPolicyHandler(handler, ability);
    });
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      console.log('cotr', handler(ability));

      return handler(ability);
    }

    return handler.handle(ability);
  }
}
