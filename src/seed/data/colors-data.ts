export interface Color {
  hex: `#${string}`;
  name: string;
}

// MUST include white ('blanco') or it need to be edited
// colors.find( (c) => c.name === 'blanco') // seed.service
export const colors: Color[] = [
  {
    hex: '#ff595e',
    name: 'rojo',
  },
  {
    hex: '#fefefe',
    name: 'blanco',
  },
  {
    hex: '#6a4c93',
    name: 'morado',
  },
  {
    hex: '#ffca3a',
    name: 'amarillo',
  },
  {
    hex: '#242424',
    name: 'negro',
  },
  {
    hex: '#ff924c',
    name: 'naranja',
  },
  {
    hex: '#b5a6c9',
    name: 'violeta',
  },
  {
    hex: '#52a675',
    name: 'verde',
  },
  {
    hex: '#1982c4',
    name: 'azul',
  },
];
