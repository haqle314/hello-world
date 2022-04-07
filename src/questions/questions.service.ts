import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './question.model';
import { QuestionnaireDto } from '../questionnaire.dto';

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(Question) private questionModel: typeof Question) {}

  async getAllQuestions(): Promise<Question[]> {
    return this.questionModel.findAll({ raw: true });
  }

  async countQuestions(): Promise<number> {
    return this.questionModel.count();
  }

  async getQuestion(id: number) {
    return this.questionModel.findOne({
      raw: true,
      where: { id },
    });
  }

  async grade(questionnaire: QuestionnaireDto): Promise<any> {
    const gradedAnswers = [];
    for (const [questionID, answers] of questionnaire.answers) {
      const solution = (await this.getQuestion(questionID))?.solution;
      if (!solution) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Question ${questionID} does not exist`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const selectedAnswers = answers
        .filter(([, selected]) => selected)
        .map(([answerID]) => answerID);
      const correctAnswersSelected = selectedAnswers.reduce(
        (correctCount, answerID) =>
          correctCount + (solution.includes(answerID) ? 1 : 0),
        0,
      );
      const score =
        selectedAnswers.length === 0
          ? 0
          : correctAnswersSelected / solution.length;
      gradedAnswers.push({
        question: questionID,
        selectedAnswers,
        correctAnswers: solution,
        score,
      });
    }
    const totalScore = gradedAnswers.reduce(
      (total, { score }) => total + score,
      0,
    );
    return {
      totalScore,
      gradedAnswers,
    };
  }
}
