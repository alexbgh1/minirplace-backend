import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Pixel } from 'src/pixel/entities/pixel.entity';
import { UserColorStats } from './userColorStats.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 16, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  country_code: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  country_name: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  last_login: Date;

  @OneToMany(() => Pixel, (pixel) => pixel.user)
  pixel: Pixel[];

  @OneToMany(() => UserColorStats, (userColorStats) => userColorStats.user)
  colorStats: UserColorStats[];
}
