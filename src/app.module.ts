import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';
@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURI, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('Connected to the db');
        });
        connection._events.connected();
        return connection;
      },
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
