import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UtilitiesService } from './utilities.service';
import { Public } from '../auth/guards/public.decorator';
import { FirebaseShortenLink } from '../types/firebase-shorten-link';

class CreateFirebaseShortenLinkDto {
  url: string;
  title: string;
  description: string;
  image: string;
}

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @Public()
  @Post('firebase-shorten-link')
  @ApiOperation({ summary: 'Create a Firebase shorten link' })
  @ApiBody({
    type: CreateFirebaseShortenLinkDto,
    examples: {
      example1: {
        summary: 'Example 1',
        description:
          'A sample request body for creating a Firebase shorten link',
        value: {
          url: 'https://example.com/long-url',
          title: 'Example Title',
          description: 'This is an example description',
          image: 'https://example.com/image.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the Firebase shorten link',
    type: FirebaseShortenLink,
  })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  async createFirebaseShortenLink(
    @Body() body: CreateFirebaseShortenLinkDto,
  ): Promise<FirebaseShortenLink | null> {
    const { url, title, description, image } = body;

    if (!url || !title || !description || !image) {
      throw new BadRequestException(
        'url, title, description and image are required',
      );
    }

    try {
      return await this.utilitiesService.getFirebaseShortLink(
        url,
        title,
        description,
        image,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
