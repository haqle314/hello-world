import {
  Controller,
  Get,
  Param,
  Render,
  Session,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestionsService } from './questions.service';

@Controller('question')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async question(@Param('id') id: number): Promise<any> {
    return this.questionsService.getQuestion(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async allQuestions(): Promise<any> {
    return this.questionsService.getAllQuestions();
  }
}
