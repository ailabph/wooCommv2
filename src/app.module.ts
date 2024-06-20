import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CognitoService } from './auth/cognito.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { SharedModule } from './common/shared.module';
import { CognitoAuthGuard } from './auth/guards/cognito-auth.guard';
import { CogAuthModule } from './cognito-auth/cognito-auth.module';
import { KeyModule } from './key/key.module';
import { ProductModule } from './product/product.module';
import { HealthModule } from './health/health.module';
import { VendorModule } from './vendor/vendor.module';
import { ReferralsModule } from './referrals/referrals.module';
import { IreferVendorsModule } from './irefer-vendors/irefer-vendors.module';
import { IreferProductsModule } from './irefer-products/irefer-products.module';
import { IreferUsersModule } from './irefer-users/irefer-users.module';
import { IreferReferralModule } from './irefer-referral/irefer-referral.module';
import { UtilitiesModule } from './utilities/utilities.module';
import { IreferUserSubscriptionModule } from './irefer-user-subscription/irefer-user-subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './src/.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL_INTEG_DB, {
      connectionName: 'irefer-shopify-integration',
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      connectionName: 'irefer',
    }),

    AuthModule,
    SharedModule,
    CogAuthModule,
    KeyModule,
    ProductModule,
    HealthModule,
    VendorModule,
    ReferralsModule,
    IreferVendorsModule,
    IreferProductsModule,
    IreferUsersModule,
    IreferReferralModule,
    UtilitiesModule,
    IreferUserSubscriptionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CognitoService,
    {
      provide: APP_GUARD,
      useClass: CognitoAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ]
})
export class AppModule {}
