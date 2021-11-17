import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CaslModule } from './casl/casl.module';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { PhotosModule } from './photos/photos.module';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';

console.log('', __dirname);

const defaultOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: null,
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migration/**/*{.ts,.js}'],
  migrationsRun: true, // cho tu chay sau khi
  cli: {
    migrationsDir: 'src/migration',
  },
} as TypeOrmModuleAsyncOptions;
@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60 * 1000,
      limit: 2,
    }),
    // TypeOrmModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   name: 'test',
    // }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      database: 'new',
    }),
    // TypeOrmModule.forRoot({
    //   ...defaultOptions,
    //   name: 'test',
    //   database: 'test',
    // }),
    AuthModule,
    UsersModule,
    CaslModule,
    PhotosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
