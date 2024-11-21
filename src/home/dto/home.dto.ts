import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HomeResponseDto {
  id: number;
  address: string;
  image: string;

  @Exclude()
  bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberofBedrooms() {
    return this.numberofBedrooms;
  }

  @Exclude()
  bathrooms: number;

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.bathrooms;
  }

  city: string;

  @Exclude()
  listed_date: Date;

  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  price: number;

  @Exclude()
  land_size: number;

  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  @Exclude()
  property_type: PropertyType;

  @Expose({ name: 'propertyType' })
  propertyType() {
    return this.property_type;
  }

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  realtor_id: number;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}
export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  bathrooms: number;

  @IsNumber()
  @IsPositive()
  bedrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  listedDate: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  bedrooms?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  listedDate?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  landSize?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}

export class InquireDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
