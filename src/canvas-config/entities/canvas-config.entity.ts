import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Device } from './device.entity';

@Entity()
export class CanvasConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  name: string;

  @OneToMany(() => Device, (device) => device.canvasConfig, {
    cascade: true,
    eager: true,
  })
  devices: Device[];
}
