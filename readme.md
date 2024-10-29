# ProjectTitle

## Description

# Installation

1: Install dependencies
```
npm install
```
2: Start mongo and postgresql in Docker
```
docker compose up
```
3: Add the keys for the project's authentication `ACCESS_TOKEN_SECRET` y `REFRESH_TOKEN_SECRET`

4: Run migrations
```
npm run knex:migrate:latest
```

