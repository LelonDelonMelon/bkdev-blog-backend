import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.mongoURI, {
      connectionFactory: (connection) => {
        connection.on('connected', async () => {
          console.log('Connected to the db');

          const db = connection.db;
          const collections = await db.listCollections().toArray();
          if (!collections.some((coll) => coll.name === 'counters')) {
            await db.createCollection('counters');
            console.log('Created "counters" collection');
          }
        });

        connection._events.connected();
        return connection;
      },
    }),
    PostsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AuthModule],
})
export class AppModule {}
