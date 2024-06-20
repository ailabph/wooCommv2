import {
  Controller,
  Get,
  Param,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { IreferUsersService } from './irefer-users.service';
import { User } from '../schemas/irefer/users.schema';
import { Public } from '../auth/guards/public.decorator';

@Controller('irefer-users')
export class IreferUsersController {
  constructor(private readonly ireferUsersService: IreferUsersService) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user using their ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'The ID of the user to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid ID provided' })
  @ApiResponse({
    status: 404,
    description: 'No user found with the provided ID',
  })
  async getUserByIdStrict(@Param('id') id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    try {
      return await this.ireferUsersService.getUserByIdStrict(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('email/:email')
  @ApiOperation({ summary: 'Retrieve a user using their email' })
  @ApiParam({
    name: 'email',
    required: true,
    type: String,
    description: 'The email of the user to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid email provided' })
  @ApiResponse({
    status: 404,
    description: 'No user found with the provided email',
  })
  async getUserByEmailStrict(@Param('email') email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('email is required');
    }

    try {
      return await this.ireferUsersService.getUserByEmailStrict(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('cogid/:cogId')
  @ApiOperation({ summary: 'Retrieve a user using their Cognito ID' })
  @ApiParam({
    name: 'cogId',
    required: true,
    type: String,
    description: 'The Cognito ID of the user to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid Cognito ID provided' })
  @ApiResponse({
    status: 404,
    description: 'No user found with the provided Cognito ID',
  })
  async getUserByCogIdStrict(@Param('cogId') cogId: string): Promise<User> {
    if (!cogId) {
      throw new BadRequestException('cogId is required');
    }

    try {
      return await this.ireferUsersService.getUserByCogIdStrict(cogId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
