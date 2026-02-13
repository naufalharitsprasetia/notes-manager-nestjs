import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'SECRET_KEY_JANGAN_DI_HARDCODE_NANTI',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
