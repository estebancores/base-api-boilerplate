# MaesHealthly

## Descripción
El proyecto más chimbero de Colombia y Latam para contratar servicios esteticos y de salud.

# Instalación

1: Instalar dependencias
```
npm install
```
2: Instalar base de datos de mongo y postgresql
```
docker compose up
```
3: Crear claves para variables de entorno y ponerlas en los valores `ACCESS_TOKEN_SECRET` y `REFRESH_TOKEN_SECRET`

4: correr las migraciones
```
npm run knex:migrate:latest
```

