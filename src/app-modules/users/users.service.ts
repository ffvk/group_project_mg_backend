import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user/user';
import { HelperService } from 'src/shared/helpers/helper/helper.service';
import { ErrorConstant } from 'src/constants/error';
import { Email } from './models/email/email';
import { Password } from './models/password/password';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users')
    private readonly userModel: Model<User>,
    private readonly helperService: HelperService,
  ) {}

  async get(query?: { [key: string]: any }) {
    let readQuery: { [key: string]: any } = {};

    if (query.userId) {
      readQuery._id = query.userId;
    }

    if (query.userIds) {
      readQuery._id = { $in: query.userIds.split(',') };
    }

    if (query.name) {
      readQuery.name = { $regex: new RegExp(query.name, 'i') };
    }

    if (query.profilePicUrl) {
      readQuery['profilePic.url'] = {
        $regex: new RegExp(query.profilePicUrl, 'i'),
      };
    }

    if (!isNaN((query.minProfilePicSize = parseInt(query.minProfilePicSize)))) {
      if (!readQuery['$and']) {
        readQuery['$and'] = [];
      }

      readQuery['$and'].push({
        'profilePic.size': { $gte: query.minProfilePicSize },
      });
    }

    if (!isNaN((query.maxProfilePicSize = parseInt(query.maxProfilePicSize)))) {
      if (!readQuery['$and']) {
        readQuery['$and'] = [];
      }

      readQuery['$and'].push({
        'profilePic.size': { $lte: query.maxProfilePicSize },
      });
    }

    if (query.profilePicType) {
      readQuery['profilePic.type'] = query.profilePicType;
    }

    if (query.emailValue) {
      readQuery['email.value'] = query.emailValue;
    }

    if (
      String(query.emailVerified) === 'true' ||
      String(query.emailVerified) === 'false'
    ) {
      readQuery['email.verified'] = String(query.emailVerified) === 'true';
    }

    if (query.phoneCountryCode) {
      readQuery['phone.countryCode'] = query.phoneCountryCode;
    }

    if (query.phoneNumber) {
      readQuery['phone.number'] = {
        $regex: new RegExp(query.phoneNumber, 'i'),
      };
    }

    if (
      String(query.phoneVerified) === 'true' ||
      String(query.phoneVerified) === 'false'
    ) {
      readQuery['phone.verified'] = String(query.phoneVerified) === 'true';
    }

    if (query.role) {
      readQuery.role = query.role;
    }

    if (!isNaN((query.minLastLogin = parseInt(query.minLastLogin)))) {
      if (!readQuery['$and']) {
        readQuery['$and'] = [];
      }

      readQuery['$and'].push({
        lastLogin: { $gte: query.minLastLogin },
      });
    }

    if (!isNaN((query.maxLastLogin = parseInt(query.maxLastLogin)))) {
      if (!readQuery['$and']) {
        readQuery['$and'] = [];
      }

      readQuery['$and'].push({
        lastLogin: { $lte: query.maxLastLogin },
      });
    }

    if (
      String(query.disabled) === 'true' ||
      String(query.disabled) === 'false'
    ) {
      readQuery.disabled = String(query.disabled) === 'true';
    }

    if (!isNaN((query.minDateOfBirth = parseInt(query.minDateOfBirth)))) {
      if (!readQuery['$and']) {
        readQuery['$and'] = [];
      }

      readQuery['$and'].push({
        dateOfBirth: { $gte: query.minDateOfBirth },
      });
    }

    if (!isNaN((query.maxDateOfBirth = parseInt(query.maxDateOfBirth)))) {
      if (!readQuery['$and']) {
        readQuery['$and'] = [];
      }

      readQuery['$and'].push({
        dateOfBirth: { $lte: query.maxDateOfBirth },
      });
    }

    // this is to query multiple fields for a string (mongodb full-text
    // search)

    if (query.search) {
      readQuery['$text'] = { $search: query.search };
    }

    readQuery.sort = { 'timestamp.createdAt': -1 };
    if (query.sort) {
      switch (query.sort) {
        case 'mrc': {
          readQuery.sort = { 'timestamp.createdAt': -1 };
          break;
        }

        case 'mru': {
          readQuery.sort = { 'timestamp.updatedAt': -1 };
          break;
        }

        case 'namea': {
          readQuery.sort = { name: 1 };
          break;
        }

        case 'named': {
          readQuery.sort = { name: -1 };
          break;
        }
      }
    }

    query.sort = readQuery.sort;
    delete readQuery.sort;

    let limit: number = !isNaN(query.limit)
      ? query.limit === -1
        ? 0
        : query.limit
      : 20;

    let page: number = !isNaN(query.page) ? query.page : 1;
    let skip = (page - 1) * limit;

    query.fields = query.fields
      ? query.fields
          .split(',')
          .reduce((a: any, b: any) => ((a[b] = true), a), {})
      : {};

    let users = await this.userModel
      .find(readQuery)
      .populate('tokens')
      .select(query.fields)
      .limit(limit)
      .sort(query.sort)
      .skip(skip)
      .exec();

    let totalCount = await this.userModel.countDocuments(readQuery);

    return {
      totalCount,
      currentCount: users.length,
      users: (users.length && users) || null,
    };
  }

  async create(user: { [key: string]: any }) {
    if (!user?.email?.value) {
      throw new BadRequestException({
        error: ErrorConstant.MISSING_FIELD,
        msgVars: { field: 'Email' },
      });
    }

    let foundUser = await this.userModel
      .findOne({
        'email.value': user.email.value,
      })
      .exec();

    if (foundUser) {
      throw new BadRequestException({
        error: ErrorConstant.DUPLICATE_ENTITY,
        msgVars: { entity: 'User' },
      });
    }

    let newUser = new this.userModel(user);

    newUser.email = new Email();
    newUser.email.value = user.email.value;
    newUser.email.otp = this.helperService.generateCode(4, 1, '', true);
    newUser.email.verified = user.email.verified;

    newUser.password = new Password();
    newUser.password.hash = await User.hashPassword(user.password);
    newUser.password.reset = false;
    newUser.password.otp = null;

    newUser.wasNew = true;

    let validationErrors = newUser.validateSync();

    if (validationErrors) {
      let error =
        validationErrors.errors[Object.keys(validationErrors.errors)[0]]
          .message;

      throw new BadRequestException(this.helperService.getDbErr(error));
    }

    try {
      return await newUser.save();
    } catch (e) {
      throw new BadRequestException({
        error: ErrorConstant.UNKNOWN_ERROR,
        msgVars: {
          message: e,
        },
      });
    }
  }

  async update(user: { [key: string]: any }) {
    let foundUser = await this.userModel
      .findOne({
        _id: user.userId,
      })
      .exec();

    if (!foundUser) {
      throw new BadRequestException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'userId',
        },
      });
    }

    if (user.name) {
      foundUser.name = user.name;
    }

    // if (typeof user.profilePic !== 'undefined') {
    //   foundUser.profilePic = user.profilePic;
    // }

    if (user.email) {
      if (user.email.verified) {
        foundUser.email.verified = true;
        foundUser.email.otp = null;
      }

      if (
        !foundUser.email?.value ||
        foundUser.email.value !== user.email.value
      ) {
        foundUser.email = new Email();
        foundUser.email.value = user.email.value;
        foundUser.email.otp = this.helperService.generateCode(
          6,
          null,
          null,
          true,
        );
        foundUser.email.verified = false;
      }
    }

    if (user.password) {
      foundUser.password = user.password;
    }

    if (user.role) {
      foundUser.role = user.role;
    }

    if (user.lastLogin) {
      foundUser.lastLogin = new Date(user.lastLogin).getTime();
    }

    if (String(user.disabled) === 'true' || String(user.disabled) === 'false') {
      foundUser.disabled = String(user.disabled) === 'true';
    }

    if (user.dateOfBirth) {
      foundUser.dateOfBirth = new Date(user.dateOfBirth).getTime();
    }

    foundUser.timestamp.updatedAt = new Date().getTime();

    foundUser.wasNew = false;

    let validationErrors = foundUser.validateSync();

    if (validationErrors) {
      let error =
        validationErrors.errors[Object.keys(validationErrors.errors)[0]]
          .message;

      throw new BadRequestException(this.helperService.getDbErr(error));
    }

    return await foundUser.save();
  }

  async delete(userId: string) {
    return await this.userModel.findOneAndDelete({ _id: userId });
  }
}
