# Chat API

### Steps 

##### 1. Firstly, need to install NestJS globally

``` $ npm install -g @nestjs/cli ```

##### 2. Install other packages

``` $ npm install```

#### 3. Setup a local Postgres DB and replace the db url in envfile

##### 4. Run Prisma migrate

``` $ npx prisma migrate dev ```

##### 5. Generate Prisma Client in order to access the prisma

``` $ npx prisma migrate generate ```

##### 6. Start the application in Port 3000

``` $ npm run start ```

### Process of Creating Chat Room

1. When User 1 connets to User 2 via client, a chat room is created
2. Then User 1 and 2 listen to the created group chat
3. User 1 and 2 can send messages, and these message will be saved in DB
4. User 1 and 2 can see messages realtime, and also history messages from DB