import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface HomeFilterQuery {
  city: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

interface CreateHomeparams {
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(filter: HomeFilterQuery): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        price: true,
        property_type: true,
        bathrooms: true,
        bedrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: {
        ...filter,
      },
    });

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      delete fetchHome.images;
      return new HomeResponseDto(fetchHome);
    });
  }

  async getHome(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome({
    city,
    address,
    price,
    propertyType,
    bathrooms,
    bedrooms,
    landSize,
    images,
  }: CreateHomeparams) {
    const home = await this.prismaService.home.create({
      data: {
        city,
        address,
        bathrooms,
        bedrooms,
        land_size: landSize,
        property_type: propertyType,
        price,
        realtor_id: 2,
      },
    });

    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prismaService.image.createMany({ data: homeImages });

    return new HomeResponseDto(home);
  }

  async updateHome(
    data: Omit<Partial<CreateHomeparams>, 'images'>,
    id: number,
  ) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });

    if (!home) throw new NotFoundException();

    const updatedHome = await this.prismaService.home.update({
      where: {
        id,
      },
      data,
    });

    return new HomeResponseDto(updatedHome);
  }

  async deleteHome(id: number) {
    const deleted = await this.prismaService.home.delete({
      where: {
        id,
      },
    });

    return new HomeResponseDto(deleted);
  }
}
