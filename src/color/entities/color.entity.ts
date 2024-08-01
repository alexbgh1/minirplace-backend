import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Pixel } from 'src/pixel/entities/pixel.entity';
import { UserColorStats } from 'src/users/entities/userColorStats.entity';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  hex: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string;

  @OneToMany(() => Pixel, (pixel) => pixel.color)
  pixel: Pixel[];

  @OneToMany(() => UserColorStats, (userColorStats) => userColorStats.color)
  userColorStats: UserColorStats[];
}
