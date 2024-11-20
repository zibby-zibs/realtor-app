import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(): Promise<HomeResponseDto[]> {
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
            city: 
        }
    });

    console.log({ home: homes[0].images });

    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      delete fetchHome.images;
      return new HomeResponseDto(fetchHome);
    });
  }

  async getHome(id: string) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: Number(id),
      },
    });

    return home;
  }
}
