import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IreferUsersController } from './irefer-users.controller';
import { IreferUsersService } from './irefer-users.service';
import { User, UserSchema } from '../schemas/irefer/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }], 
      'irefer',
    ),
  ],
  controllers: [IreferUsersController],
  providers: [IreferUsersService],
  exports: [IreferUsersService],
})
export class IreferUsersModule {}
