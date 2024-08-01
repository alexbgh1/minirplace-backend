import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CanvasConfig } from './canvas-config.entity';

/*
All devices should have an equivalent in terms of Quadrants
For ex: 
- If the device is mobile: w: 340px, h: 340px
- And other device, desktop: w: 510px, h: 510px

It must have the same pixelSize 
- 340px / 20 pixelSize = 17 Quadrants
- 510px / 30 pixelSize = 17 Quadrants

The reason to this, is beacuse we are going to store the Quadrant [0,1,2,3,4,...] for X and Y
And if we want to scale from 340px to a 510px resolution, it will be easier
*/

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @Column('int')
  pixelSize: number;

  @ManyToOne(() => CanvasConfig, (canvasConfig) => canvasConfig.devices, {
    onDelete: 'CASCADE',
  })
  canvasConfig: CanvasConfig;
}
