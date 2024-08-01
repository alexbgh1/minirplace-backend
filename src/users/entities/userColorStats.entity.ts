import { Column, PrimaryGeneratedColumn, ManyToOne, Entity } from 'typeorm';
import { User } from './user.entity';
import { Color } from 'src/color/entities/color.entity';

@Entity()
export class UserColorStats {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.colorStats)
  user: User;

  @ManyToOne(() => Color, (color) => color.userColorStats)
  color: Color;

  @Column({
    type: 'bigint',
    default: 0,
  })
  count: number;
}
