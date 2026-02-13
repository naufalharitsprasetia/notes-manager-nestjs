import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/users.dto';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useBodyParser('urlencoded', { extended: true });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(cookieParser());
  // panggil seeder admin
  const usersService = app.get(UsersService);
  await createAdmin(usersService);

  await app.listen(process.env.PORT ?? 3000);
}

async function createAdmin(usersService: UsersService) {
  const adminEmail = 'admin@gmail.com';
  const existingAdmin = await usersService.findByEmail(adminEmail);

  if (!existingAdmin) {
    const userAdmin: CreateUserDto = {
      name: 'Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
    };
    await usersService.create(userAdmin);
    console.log('✅ Admin user created automatically!');
  } else {
    console.log('ℹ️ Admin already exists');
  }
}

bootstrap()
  .then(() => {
    console.log('Application started successfully');
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
