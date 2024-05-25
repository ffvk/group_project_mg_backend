import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { PermissionsService } from '../permissions/permissions.service';
import { MailerService } from '@nestjs-modules/mailer';
import { HelperService } from 'src/shared/helpers/helper/helper.service';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/shared/helpers/s3/s3.service';
import { GetUsersDTO } from './dtos/get-users.dto/get-users.dto';
import { RestrictUsersGuard } from 'src/shared/guards/restrictors/restrict-users/restrict-users.guard';
import { RegisterUserDTO } from './dtos/register-user.dto/register-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto/update-user.dto';
import { UserIdGuard } from 'src/shared/guards/validators/user-id/user-id.guard';
import { ParseMongoIdPipe } from 'src/shared/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { ErrorConstant } from 'src/constants/error';
import { LoginUserDTO } from './dtos/login-user.dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
    private readonly mailerService: MailerService,
    private readonly helperService: HelperService,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @UseGuards(RestrictUsersGuard)
  async getUsers(@Query() getUsersDTO: GetUsersDTO) {
    return await this.usersService.get(getUsersDTO);
  }

  @Post('subscribers')
  @UseGuards()
  async registerUser(@Body() registerUserDTO: RegisterUserDTO) {
    registerUserDTO.email.verified = false;
    return await this.usersService.create(registerUserDTO);
  }

  @Put()
  @UseGuards(UserIdGuard)
  async updateUser(@Body() updateUserDTO: UpdateUserDTO) {
    return await this.usersService.update(updateUserDTO);
  }

  @Delete()
  @UseGuards(UserIdGuard)
  async deleteUser(@Body('userId', ParseMongoIdPipe) userId: string) {
    return await this.usersService.delete(userId);
  }

  @Post('session/email')
  @UseGuards()
  async loginUser(@Body() loginUserDTO: LoginUserDTO) {
    const foundUser = await this.usersService.get({
      emailValue: loginUserDTO.emailValue,
      fields: 'password',
    });

    if (!foundUser?.totalCount) {
      throw new BadRequestException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'Email',
        },
      });
    }

    if (
      !(await User.comparePassword(
        loginUserDTO.password,
        foundUser.users[0].password.hash,
      ))
    ) {
      throw new BadRequestException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'Password',
        },
      });
    }

    return (
      await this.usersService.get({
        emailValue: loginUserDTO.emailValue,
        populate: 'tokens',
      })
    ).users[0];
  }
}
