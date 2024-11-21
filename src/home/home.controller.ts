import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeDto,
} from './dto/home.dto';
import { User, UserType } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType as UserT } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: string,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { gte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filter = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { property_type: propertyType }),
    };
    return this.homeService.getHomes(filter);
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHome(id);
  }

  @Roles(UserT.ADMIN, UserT.REALTOR)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserType) {
    return this.homeService.createHome(body, user?.id);
  }

  @Roles(UserT.ADMIN, UserT.REALTOR)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserType,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(user?.id);

    if (realtor.realtor.id !== user?.id) throw new UnauthorizedException();
    return this.homeService.updateHome(body, id);
  }

  @Roles(UserT.ADMIN, UserT.REALTOR)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserType,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(user?.id);

    if (realtor.realtor.id !== user?.id) throw new UnauthorizedException();
    return this.homeService.deleteHome(id);
  }

  @Roles(UserT.ADMIN, UserT.REALTOR, UserT.BUYER)
  @Post('/inquire/:id')
  inquire(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserType,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(user, id, message);
  }

  @Roles(UserT.ADMIN, UserT.REALTOR, UserT.BUYER)
  @Get('/:id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserType,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(user?.id);

    if (realtor.realtor.id !== user?.id) throw new UnauthorizedException();
    return this.homeService.getHomeMessages(id);
  }
}
