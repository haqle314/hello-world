import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'questions', timestamps: false })
export class Question extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  question: string;

  @Column(DataType.TEXT)
  answers: string[];

  @Column(DataType.SMALLINT)
  solution: number[];

  @Column
  score: number;
}
