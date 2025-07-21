import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { errorMessages } from 'src/common/constants/error';
import {
  IJwtPayload,
  ITokens,
} from 'src/common/constants/interface/auth.interface';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import { PaymentService } from 'src/payment/payment.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserService } from '../../user/services/user.service';
import { ROLE } from '../constants/role.constant';
import { AuthMiniAdminRegistrationDto } from '../dtos/auth-mini-admin-registration.dto';
import { AuthRegistrationDto } from '../dtos/auth-registration.dto';
import { AuthTokenOutput } from '../dtos/auth-token-output.dto';
import { Tokens } from '../entities/tokens.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    @Inject(forwardRef(() => FileManagerService))
    private readonly fileManagerService: FileManagerService,
    private readonly logger: AppLogger,
    @InjectRepository(Tokens)
    private tokenRepository: Repository<Tokens>,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(
    ctx: RequestContext,
    email: string,
    password: string,
  ): Promise<User> {
    const currentUser = await this.usersService.findOneByEmail(
      ctx,
      email.toLowerCase(),
    );
    console.log('currentUser', currentUser);
    console.log('currentUser.isActive', currentUser?.isActive);

    if (!currentUser) {
      throw new UnauthorizedException({
        message: errorMessages.USER_NOT_FOUND,
        details: 'User with this email does not exist',
        error: 'UserNotFound',
      });
    }

    if (currentUser.isAccountDisabled) {
      throw new UnauthorizedException({
        message: errorMessages.USER_ACCOUNT_DISABLED,
        details: 'User account has been disabled by administrator',
        error: 'AccountDisabled',
      });
    }

    if (!currentUser.isActive) {
      console.log('User is not active, throwing error');
      throw new UnauthorizedException({
        message: errorMessages.USER_ACCOUNT_INACTIVE,
        details:
          'User account is not activated. Please contact administrator or check your email for activation link',
        error: 'AccountInactive',
      });
    }

    const isPasswordCorrect = await compare(password, currentUser.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException({
        message: errorMessages.INVALID_PASSWORD,
        details: 'Incorrect password provided',
        error: 'InvalidPassword',
      });
    }

    delete currentUser.password;

    return currentUser;
  }

  async login(user: User): Promise<any> {
    const payload: IJwtPayload = {
      userId: user.id,
      sub: {
        email: user.email,
        role: user.role,
      },
    };

    const tokens: ITokens = {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_JWT_SECRET'),
        expiresIn: '1d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };

    const oldTokens = await this.tokenRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (oldTokens) {
      await this.tokenRepository.remove(oldTokens);
    }

    const newTokens = plainToClass(Tokens, {
      ...tokens,
      user,
    });

    await this.tokenRepository.save(newTokens);

    const { password, ...rest } = user;

    return {
      user: { ...rest },
      tokens: tokens,
    };
  }

  async register(
    ctx: RequestContext,
    signUpInput: AuthRegistrationDto,
  ): Promise<any> {
    const { username, email } = signUpInput;

    // Перевіряємо існування за username
    const currentUserByUsername: User | null =
      await this.usersService.findOneByUsername(ctx, username);

    if (currentUserByUsername) {
      throw new UnauthorizedException({
        message: errorMessages.USER_ALREADY_EXISTS,
        details: 'User with this username already exists',
        error: 'UsernameExists',
      });
    }

    // Перевіряємо існування за email
    const currentUserByEmail: User | null =
      await this.usersService.findOneByEmail(ctx, email.toLowerCase());

    if (currentUserByEmail) {
      throw new UnauthorizedException(errorMessages.USER_ALREADY_EXISTS);
    }

    let referredBy: User | null = null;

    if (signUpInput.code) {
      const user = await this.usersService.findByCode(signUpInput.code);
      console.log('user', user);
      if (user) {
        referredBy = user;
      }
    }

    const newUser = plainToClass(User, {
      isActive: false,
      password: signUpInput.password,
      role: signUpInput.role || ROLE.USER,
      referredBy: referredBy,
      ...signUpInput,
      email: signUpInput.email.toLowerCase(), // Зберігаємо логіку нижнього регістру
    });

    const createdUser = await this.usersService.create(ctx, newUser);

    const payload: IJwtPayload = {
      userId: createdUser.id,
      sub: {
        email: createdUser.email.toLowerCase(),
        role: createdUser.role,
      },
    };

    const tokens: ITokens = {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_JWT_SECRET'),
        expiresIn: '1d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
    await this.tokenRepository.save(
      plainToClass(Tokens, {
        ...tokens,
        user: createdUser,
      }),
    );

    return {
      user: createdUser,
      tokens,
    };
  }

  async registerMiniAdmin(
    ctx: RequestContext,
    signUpInput: AuthMiniAdminRegistrationDto,
    file: Express.Multer.File,
  ): Promise<any> {
    const { username, email } = signUpInput;

    const currentUser: User | null = await this.usersService.findOneByUsername(
      ctx,
      username,
    );

    // Перевіряємо існування за email
    const currentUserByEmail: User | null =
      await this.usersService.findOneByEmail(ctx, email.toLowerCase());

    const userByCode = await this.usersService.findByCode(signUpInput.code);

    if (currentUser || currentUserByEmail || userByCode) {
      throw new UnauthorizedException(errorMessages.USER_ALREADY_EXISTS);
    }

    let fileUrl = null;
    if (file) {
      fileUrl = await this.fileManagerService.upload(file, ctx);
    }

    const newUser = plainToClass(User, {
      ...signUpInput,
      promotionImage: fileUrl,
      password: signUpInput.password, // Don't hash here, let UserService handle it
      role: signUpInput.role || ROLE.USER,
      email: signUpInput.email.toLowerCase(), // Зберігаємо логіку нижнього регістру
    });

    console.log('signUpInput.isActive', signUpInput.isActive);
    console.log('newUser.isActive', newUser.isActive);

    const createdUser = await this.usersService.create(ctx, newUser);

    const payload: IJwtPayload = {
      userId: createdUser.id,
      sub: {
        email: createdUser.email,
        role: createdUser.role,
      },
    };

    const tokens: ITokens = {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_JWT_SECRET'),
        expiresIn: '1d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
    await this.tokenRepository.save(
      plainToClass(Tokens, {
        ...tokens,
        user: createdUser,
      }),
    );

    return {
      user: createdUser,
      tokens,
    };
  }

  async activateUser(ctx: RequestContext, userId: string): Promise<any> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    await this.usersService.activateUser(ctx, user.id);

    return {
      isSuccess: true,
    };
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
    await this.usersService.sendActivationEmail(ctx, user, url);
  }

  async sendResetPasswordCode(ctx, email, url) {
    await this.usersService.sendResetPasswordCode(ctx, email, url);
  }

  async resetPassword(ctx, token, password) {
    await this.usersService.resetPassword(ctx, token, password);
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const { userId } = this.jwtService.verify(refreshToken);

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid user id');
    }

    const tokens = this.getAuthToken(user);

    const tokensList = await this.tokenRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    console.log(tokensList);

    if (tokensList.length) {
      await this.tokenRepository.remove(tokensList);

      return await this.tokenRepository.save({
        user: user,
        ...tokens,
      });
    }

    return await this.tokenRepository.save({
      user: user,
      ...tokens,
    });
  }

  getAuthToken(user: User): AuthTokenOutput {
    const payload: IJwtPayload = {
      userId: user.id,
      sub: {
        email: user.email,
        role: user.role,
      },
    };

    return {
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('jwt.accessTokenExpiresInSec'),
      }),
    };
  }

  async logout(ctx: RequestContext, id: string) {
    const token = await this.tokenRepository.findOne({
      where: {
        user: {
          id: id,
        },
      },
    });

    if (!token) {
      throw new NotFoundException(errorMessages.TOKEN_NOT_EXIST);
    }

    await this.tokenRepository.remove(token);

    return {
      isSuccess: true,
    };
  }
}
