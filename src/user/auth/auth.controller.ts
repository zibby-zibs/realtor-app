import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dtos';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { User, UserType as UserInfo } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup/:userType')
  async signUp(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

      const isValidProdcutKey = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );

      if (!isValidProdcutKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signUp(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signIn(body);
  }

  @Post('/key')
  generateProductKey(@Body() { userType, email }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @Get('/me')
  me(@User() user: UserInfo) {
    return user;
  }
}
