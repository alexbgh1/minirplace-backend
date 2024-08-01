import { canvasConfigData, SeedCanvasConfig } from './canvas-config-data';
import { colors, Color } from './colors-data';

interface SeedData {
  canvasConfigs: SeedCanvasConfig[];
  colors: Color[];
  pixelQuadrantSize: number; // 1 => grid: (0,0), (0,1), (1,1) ...
}

export const initialData: SeedData = {
  canvasConfigs: canvasConfigData,
  colors: colors,
  // 17x17 Must be common factor canvasConfig devices
  // ex: 340x340 (pixel size: 20) => 17x17; 510x510 (pixel size: 30) => 17x17
  pixelQuadrantSize: 17,
};
