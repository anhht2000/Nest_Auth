import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Photo } from './Photo.entity';
import { Repository, getManager } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  findAll(): Promise<Photo[]> {
    return this.photosRepository.find({
      relations: ['user', 'user.photos'],
    });
  }

  create(photo: Photo): Promise<any> {
    return this.photosRepository.insert(photo);
  }
}
