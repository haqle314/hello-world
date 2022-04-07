import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model {
  @PrimaryKey
  @Column
  username: string;

  @Column(DataType.STRING(60))
  hash: string;

  // list of jti in issued refresh_tokens
  @Column(DataType.ARRAY(DataType.STRING))
  refresh_tokens: string[];
}
