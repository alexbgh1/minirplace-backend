# MiniReplace Backend

Se encarga de la persistencia y lógica detrás de la aplicación, por ejemplo almacenando los usuarios, pixeles pintados y el cuadrante al que pertenecen.

También considera el uso de WebSockets para la comunicación en tiempo real con el frontend y la sincronización de los pixeles pintados.

La idea de redis era usarlo como cache para almacenar los pixeles pintados y evitar hacer consultas a la base de datos, pero no se llegó a implementar al ser inpersistente (postgre - redis), pero se dejó para consultas como los colores o datos que no cambian con frecuencia.

## Stack tecnológico
![NestJS](./readme-utils/nestjs-logo.png) ![TypeScript](./readme-utils/typescript-logo.png) ![TypeORM](./readme-utils/typeorm-logo.png)  ![PostgreSQL](./readme-utils/postgresql-logo.png) ![Redis](./readme-utils/redis-logo.png) ![Docker](./readme-utils/docker-logo.png)

## Installation

```bash
$ npm install
```

## Configuración

Rellenar el archivo `.env` con las variables de entorno necesarias. Se puede usar el archivo `.env.example` como referencia.

`TOKEN_RUN_SEED` corresponde a un token que se debe enviar en el header de la petición para ejecutar el seed de la base de datos (inicializar tablero).
 
### Inicializando la aplicación

En caso de no tener una base de datos postgresql y redis, se puede usar docker-compose para levantar los servicios necesarios.
```bash	
$ docker-compose up
```

Con la base de datos postgresql y redis corriendo, iniciar el programa.


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

