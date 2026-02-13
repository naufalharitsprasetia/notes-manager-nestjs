import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './common/jwt.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'notes_manager',
      autoLoadEntities: true,
      synchronize: true, // DEV-only
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*'); // semua route akan punya req.user
  }
}
