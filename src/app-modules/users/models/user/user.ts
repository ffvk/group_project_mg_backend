import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import { Token } from 'src/app-modules/tokens/models/token/token';
import { UserRoleEnum } from 'src/constants/enum';
// import { Image } from 'src/shared/models/image/image';
import { Email } from '../email/email';
import { Password } from '../password/password';

export class User extends Document {
  userId: string;

  name?: string;

  //   profilePic?: Image;

  email: Email;

  role: keyof typeof UserRoleEnum;

  lastLogin?: number;

  password: Password;

  disabled: boolean = false;

  dateOfBirth?: number;

  wasNew: boolean = true;

  tokens?: Token[];

  timestamp: { createdAt: number; updatedAt: number };

  static async hashPassword(plainPassword: string) {
    return await bcrypt.hash(plainPassword, 10);
  }

  static async comparePassword(toCompare: string, hashed: string) {
    return await bcrypt.compare(toCompare, hashed);
  }
}
