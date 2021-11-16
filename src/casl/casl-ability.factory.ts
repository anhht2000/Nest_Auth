import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { User } from 'src/users/user.entity';
import { Photo } from 'src/photos/Photo.entity';

// export class User {
//   userId: number;
//   username: string;
//   roles: string;
//   isAdmin: boolean;
// }

// export class Article {
//   id: number;
//   isPublished: boolean;
//   authorId: number;
// }

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof Photo | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      // can(Action.Manage, 'all'); // read-write access to everything
      can(Action.Create, Photo);
    } else {
      // can(Action.Read, User); // read-write access to everything
      // can(Action.Read, 'all'); // read-only access to everything
    }
    // console.log('user', can(Action.Read, User, { isAdmin: false }));

    can(Action.Read, User, { isAdmin: true });
    can(Action.Read, Photo);

    // can(Action.Update, Article, { authorId: user.userId });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
