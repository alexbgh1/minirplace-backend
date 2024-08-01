import { PixelStat } from './stat.entity';
import { Color } from 'src/color/entities/color.entity';
import {
  Column,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Pixel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => PixelStat, (pixelStat) => pixelStat.id)
  @JoinColumn()
  stats: PixelStat;

  @ManyToOne(() => Color, (color) => color.id, {
    // When loading 'Pixel', load the 'Color' as well
    eager: true,
  })
  color: Color;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column('int')
  @Index()
  xQuadrant: number;

  @Column('int')
  @Index()
  yQuadrant: number;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
