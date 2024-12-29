## Description

A NestJS app that demonstrates CRUD actions for schedules and tasks. There's a one-to-many relationship between Schedule and Tasks, where a Schedule can have multiple Tasks associated.

## Project setup

Install docker or point at your own local DB by creating an .env file with 

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

Install Dependencies

```bash
$ npm install
```

## Run the project

```bash
# Postgres DB (docker)
$ docker-compose up

# watch mode
$ npm run start:dev

```

## Run tests

```bash
# unit tests
$ jest
```

