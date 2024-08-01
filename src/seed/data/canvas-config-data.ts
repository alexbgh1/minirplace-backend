interface SeedDevice {
  name: string;
  width: number;
  height: number;
  pixelSize: number;
}

export interface SeedCanvasConfig {
  name: string;
  devices: SeedDevice[];
}

export const canvasConfigData: SeedCanvasConfig[] = [
  {
    name: 'main-canvas',
    devices: [
      {
        name: 'desktop',
        width: 510,
        height: 510,
        pixelSize: 30,
      },
      {
        name: 'mobile',
        width: 340,
        height: 340,
        pixelSize: 20,
      },
    ],
  },
];
