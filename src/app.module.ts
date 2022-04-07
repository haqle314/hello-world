import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Question } from './questions/question.model';
import { QuestionsModule } from './questions/questions.module';
import { SequelizeModule } from '@nestjs/sequelize';
import 'dotenv/config';
import { User } from './users/user.model';

@Module({
  imports: [
    AuthModule,
    QuestionsModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [Question, User],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
