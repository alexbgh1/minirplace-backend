import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pixel } from 'src/pixel/entities/pixel.entity';

@Entity()
export class PixelStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', default: 0 })
  count: bigint;

  @OneToOne(() => Pixel, (pixel) => pixel.stats)
  stats: Pixel;
}
