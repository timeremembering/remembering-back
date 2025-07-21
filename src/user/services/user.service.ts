import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { errorMessages } from 'src/common/constants/error';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import { MailerCustomService } from 'src/mailer/mailer.service';
import { TreeService } from 'src/tree/tree.service';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { ROLE } from '../../auth/constants/role.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput } from '../dto/user-output.dto';
import { UpdateUserInput } from '../dto/user-update-input.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    protected readonly logger: AppLogger,
    protected readonly configService: ConfigService,
    protected readonly mailerService: MailerCustomService,
    protected readonly treeService: TreeService,
    protected readonly fileManagerService: FileManagerService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async create(
    ctx: RequestContext,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    console.log('createUserDto', createUserDto);
    this.logger.debug(ctx, `${this.create.name} was called`);

    // Hash password if it's not already hashed (bcrypt hashes start with $2b$)
    if (createUserDto.password && !createUserDto.password.startsWith('$2b$')) {
      createUserDto.password = await hash(createUserDto.password, 10);
    }

    const newUser: User = plainToClass(User, createUserDto);

    this.logger.verbose(ctx, `calling ${this.repository.save.name}`);
    await this.repository.save(newUser);

    return newUser;
  }

  async findOneByUsername(
    ctx: RequestContext,
    username: string,
  ): Promise<User> {
    this.logger.debug(ctx, `${this.findOneByUsername.name} was called`);

    this.logger.verbose(ctx, `calling ${this.repository.findOneBy.name}`);
    const currentUser = await this.repository.findOneBy({ username });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  }

  async validateEmailPassword(
    ctx: RequestContext,
    email: string,
    pass: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.validateEmailPassword.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);
    const user = await this.repository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) throw new UnauthorizedException();

    const match = await compare(pass, user.password);
    if (!match) throw new UnauthorizedException();

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async getUsers(
    ctx: RequestContext,
    limit: number,
    offset: number,
    code?: string,
    filter?: string,
  ): Promise<{ users: any; count: number }> {
    this.logger.log(ctx, `${this.getUsers.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.findAndCount`);
    const whereClause: any = {
      isActive: filter === 'unactive' ? false : true,
      ...(code ? { code } : {}),
      ...(filter === 'mini-admins' ? { role: ROLE.MINI_ADMIN } : {}),
      ...(filter === 'all' ? { role: ROLE.USER } : {}),
    };

    const [users, count] = await this.repository.findAndCount({
      where: whereClause,
      relations: { trees: { type: true }, referredBy: true },
      take: limit,
      skip: offset,
    });

    const usersOutput = users.map((user) => {
      const trees_count: number = user.trees.length;
      const tree_type: null | string =
        user.trees.length > 0 ? user.trees[0].type.name : null;

      delete user.trees;

      return {
        ...user,
        trees_count,
        tree_type,
      };
    });
    return { users: usersOutput, count };
  }

  async findById(id: string): Promise<User> {
    return await this.repository.findOne({
      where: { id },
      relations: { trees: true, referredBy: true },
    });
  }

  async findByCode(code: string): Promise<User> {
    return await this.repository.findOne({
      where: { code, role: ROLE.MINI_ADMIN },
    });
  }

  async getUserById(id: string): Promise<User> {
    const user: User = await this.repository.findOneBy({ id });

    delete user.password;

    return user;
  }

  async getUserWithTrees(id: string): Promise<User> {
    return await this.repository.findOne({
      where: { id },
      relations: ['trees'],
    });
  }

  async findByUsername(
    ctx: RequestContext,
    username: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.findByUsername.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);
    const user = await this.repository.findOne({ where: { username } });

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(
    ctx: RequestContext,
    userId: string,
    input: UpdateUserInput,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.updateUser.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.getById`);
    const user = await this.repository.findOneBy({ id: userId });

    // Hash the password if it exists in the input payload.
    if (input.password) {
      input.password = await hash(input.password, 10);
    }

    let referredBy: User | null = null;
    if (input.code) {
      referredBy = await this.repository.findOneBy({
        code: input.code,
        role: ROLE.MINI_ADMIN,
      });
    }

    // merges the input (2nd line) to the found user (1st line)
    const updatedUser: User = {
      ...user,
      ...plainToClass(User, { ...input, referredBy }),
    };

    this.logger.log(ctx, `calling ${UserRepository.name}.save`);
    await this.repository.save(updatedUser);

    return plainToClass(UserOutput, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findOneByEmail(ctx: RequestContext, email: string): Promise<User> {
    this.logger.debug(ctx, `${this.findOneByUsername.name} was called`);

    this.logger.verbose(ctx, `calling ${this.repository.findOneBy.name}`);
    const currentUser = await this.repository.findOneBy({
      email: email.toLowerCase(),
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  }

  async remove(ctx: RequestContext, id: string) {
    const currentUser = await this.repository.findOneBy({ id });

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    return await this.repository.remove(currentUser);
  }

  async sendActivationEmail(
    ctx: RequestContext,
    user: {
      email: string;
      phone: string;
      code: string;
      username: string;
      plateName: string;
      password: string;
    },
    url: string,
  ) {
    const currentUser = await this.repository.findOneBy({
      code: user.code,
      plateName: user.plateName,
    });

    if (user.password) {
      user.password = await hash(user.password, 10);
    }

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const trees = await this.treeService.getAllUserTree(currentUser.id);

    if (trees.length > 0) {
      const firstName = user.username.split(' ')[0];
      const lastName = user.username.split(' ')[1] || '';
      await this.treeService.updateTree(
        ctx,
        currentUser.id,
        trees[0].id,
        {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
        } as any,
        null,
      );
    }

    await this.repository.save({
      ...currentUser,
      email: user.email,
      username: user.phone,
      phone: user.phone,
      password: user.password,
      isActive: false,
    });

    await this.mailerService.sendRegistrationEmail({
      id: currentUser.id,
      email: user.email,
      name: currentUser.username,
      url,
    });
  }

  async activateUser(ctx: RequestContext, userId: string) {
    const currentUser = await this.repository.findOneBy({
      id: userId,
      isActive: false,
    });

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    return await this.repository.save({
      ...currentUser,
      isActive: true,
    });
  }

  async activateUserAfterRegistration(ctx: RequestContext, token: string) {
    const [userId, email] = token.split('|');
    const user = await this.activateUser(ctx, userId);

    const tree = await this.treeService.createAdditionalTree(userId);

    await this.treeService.updateTree(
      ctx,
      userId,
      tree.id,
      {
        isActive: true,
        first_name: user.username.split(' ')[0],
        last_name: user.username.split(' ')[1] || '',
        full_name: user.username,
      } as any,
      null,
    );

    const updatedUser = await this.repository.save({
      ...user,
      username: user.phone,
    });
    return updatedUser;
  }

  async updatePromotionImage(
    ctx: RequestContext,
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    this.logger.debug(ctx, `${this.updatePromotionImage.name} was called`);
    const user = await this.repository.findOneBy({ id: userId });

    const oldFileUrl = user.promotionImage;

    if (!user) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const newFileUrl = await this.fileManagerService.upload(file, ctx);
    if (!newFileUrl) {
      throw new Error('File upload failed');
    }

    if (oldFileUrl) {
      await this.fileManagerService.remove(oldFileUrl, ctx);
    }

    return await this.repository.save({
      ...user,
      promotionImage: newFileUrl,
    });
  }

  async sendResetPasswordCode(ctx: RequestContext, email: string, url: string) {
    const user = await this.findOneByEmail(ctx, email);
    try {
      if (!user) {
        throw new NotFoundException(errorMessages.USER_NOT_FOUND);
      }

      const resetPasswordToken = v4();

      await this.repository.save({ ...user, resetPasswordToken });

      await this.mailerService.sendForgotPasswordEmail({
        email: user.email,
        name: user.username,
        token: resetPasswordToken,
        url,
      });

      return;
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(ctx: RequestContext, token: string, password: string) {
    const user = await this.repository.findOneBy({ resetPasswordToken: token });

    if (!user) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const hashedPassword = await hash(password, 10);

    await this.repository.save({
      ...user,
      password: hashedPassword,
      resetPasswordToken: '',
    });

    return;
  }

  async getAllCodes(ctx: RequestContext): Promise<string[]> {
    this.logger.debug(ctx, `${this.getAllCodes.name} was called`);

    this.logger.verbose(ctx, `calling ${this.repository.find.name}`);
    const users = await this.repository.find({
      where: {
        role: ROLE.MINI_ADMIN,
      },
    });

    const uniqueCodes = [...new Set(users.map((user) => user.code))];

    return uniqueCodes;
  }

  public async changeIsDisabledStatus(
    userId: string,
    isAccountDisabled: boolean,
  ): Promise<User> {
    const currentUser: User = await this.repository.findOneBy({
      id: userId,
    });

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    return await this.repository.save({ ...currentUser, isAccountDisabled });
  }

  public async initAdmin() {
    const currentAdmin: User = await this.repository.findOne({
      where: {
        email: this.configService.get('APP_ADMIN_LOGIN'),
        role: ROLE.ADMIN,
      },
    });

    if (currentAdmin) {
      const password = this.configService.get('APP_ADMIN_PASS');

      const isPasswordCorrect = await compare(password, currentAdmin.password);

      if (!isPasswordCorrect) {
        await this.repository.remove(currentAdmin);
        return await this.create(
          {
            url: 'SYSTEM',
            requestID: v4(),
            ip: '0::0:1:80',
            user: null,
          },
          {
            email: this.configService.get('APP_ADMIN_LOGIN'),
            role: ROLE.ADMIN,
            username: this.configService.get('APP_ADMIN_USERNAME'),
            password: await hash(this.configService.get('APP_ADMIN_PASS'), 10),
            langue: this.configService.get('APP_ADMIN_LANGUE'),
          },
        );
      }
      return;
    }

    return await this.create(
      {
        url: 'SYSTEM',
        requestID: v4(),
        ip: '0::0:1:80',
        user: null,
      },
      {
        email: this.configService.get('APP_ADMIN_LOGIN'),
        role: ROLE.ADMIN,
        username: this.configService.get('APP_ADMIN_USERNAME'),
        password: await hash(this.configService.get('APP_ADMIN_PASS'), 10),
        langue: this.configService.get('APP_ADMIN_LANGUE'),
      },
    );
  }
}
