import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { QuestionnaireDto } from './questionnaire.dto';
import { QuestionsService } from './questions/questions.service';
import { RefreshAuthGuard } from './auth/refresh-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private questionsService: QuestionsService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async signUp(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.signUp(username, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/score')
  async score(@Body() questionnaire: QuestionnaireDto): Promise<any> {
    return this.questionsService.grade(questionnaire);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('/refresh_token')
  async refreshToken(@Request() req: any) {
    return this.authService.loginWithRefreshToken(req.user);
  }
}
