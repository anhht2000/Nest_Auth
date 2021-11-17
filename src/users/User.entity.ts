import { Photo } from 'src/photos/Photo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column()
  roles: string;

  @Column()
  isAdmin: boolean;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
