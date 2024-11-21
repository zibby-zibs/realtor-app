import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';

const mockGetHomes = [
  {
    id: 1,
    address: '2234 sjiwnc',
    city: 'Ib',
    price: 45566,
    property_type: PropertyType.RESIDENTIAL,
    image: 'img1',
    bathrooms: 4,
    bedrooms: 5,
    images: [
      {
        url: 'src1',
      },
    ],
  },
];
describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Ib',
      price: {
        gte: 100,
        lte: 6000000,
      },
      propertyType: PropertyType.CONDO,
    };
    it('should call prisma home.findMany with correct params', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);

      expect(mockPrismaFindManyHomes).toHaveBeenCalledWith({
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
        where: filters,
      });
    });
  });
});
