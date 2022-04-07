import { ApiProperty } from '@nestjs/swagger';

type Answer = [number, boolean][];

export class QuestionnaireDto {
  @ApiProperty({
    description: `An array of answers. Each answer is [answerID, [option, selected][]]`,
    example: [
      [
        1,
        [
          [0, true],
          [1, false],
          [2, false],
          [3, true],
        ],
      ],
      [
        2,
        [
          [0, true],
          [1, false],
          [2, false],
          [3, true],
        ],
      ],
    ],
  })
  answers: [number, Answer][];
}
