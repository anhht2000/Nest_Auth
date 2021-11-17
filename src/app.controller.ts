import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { diskStorage } from 'multer';
import { AuthService } from './auth/auth.service';
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/Guard/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Role } from './auth/types/role.enum';
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from './casl/casl-ability.factory';
import { CheckPolicies } from './casl/decorators/casl';
import { PoliciesGuard } from './casl/guards/casl.guards';
import { Photo } from './photos/Photo.entity';
import { PhotosService } from './photos/photos.service';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';

@Roles(Role.User)
@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private photoService: PhotosService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    // chạy vào local stategy > validate user ở authservice (return gì thi lgoin nhan cai day) > login ở authservice > đây

    return this.authService.login(req.user);
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // chạy vào validadte ở jwt strategy (return gi thi tra ve USER ở request guard) > roles guard > đây

    return req.user;
  }

  @Get('/cals')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @CheckPolicies(
    (ability: AppAbility) => ability.can(Action.Read, User),
    // (ability: AppAbility) => ability.can(Action.Read, Article),
  )
  findAll() {
    //chạy vào guard > gọi đến createuser ở factory và xử lý > guard ( xử lý quyền ở factory và decorator ở trên)
    // const ability = this.caslAbilityFactory.createForUser(User);
    // console.log('', this.ability);

    return this.userService.findAll();
    // return this.articlesService.findAll();
  }

  @Get('/cals-v1')
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  async findAllO(@Request() req) {
    //chạy vào guard jwt lấy token > vào factory check quyền > về đây
    // console.log('tét', await getConnection('test'));

    const users = new User();
    Object.assign(users, req.user);
    const ability = this.caslAbilityFactory.createForUser(users);

    if (ability.can(Action.Read, users)) {
      return await this.userService.findAll();
    } else {
      return 'no quyen';
    }
  }

  @Get('/photo')
  @UseGuards(JwtAuthGuard)
  async findPhoto(@Request() req) {
    const users = new User();
    Object.assign(users, req.user);
    const ability = this.caslAbilityFactory.createForUser(users);

    const photo = new Photo();
    photo.name = 'tuan';
    photo.pathL = 'rulld';
    if (ability.can(Action.Create, photo)) {
      const userN = await this.userService.findOne(users.username);
      photo.user = userN;

      await this.photoService.create(photo);
    }
    if (ability.can(Action.Read, users)) {
      return await this.photoService.findAll();
    } else {
      return 'no quyen';
    }
  }

  @Post('file')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, './public');
        },
        filename: function (req, file, cb) {
          const { originalname } = file;
          const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
          cb(null, `${file.fieldname}${Date.now()}${fileExtension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype == 'image/png' ||
          file.mimetype == 'image/jpg' ||
          file.mimetype == 'image/jpeg'
        ) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new BadRequestException('Provide a valid image'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log('file', files);

    return 'xu lý file thành công';
  }
}
