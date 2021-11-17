import { Controller, Get } from '@nestjs/common';

@Controller('photo')
export class PhotosController {
  @Get('get')
  test() {
    return 'ok';
  }
}
