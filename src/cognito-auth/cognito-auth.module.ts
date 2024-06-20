import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CognitoAuthModule } from '@nestjs-cognito/auth';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get("COGNITO_USER_POOL_ID") ,
          clientId: configService.get("COGNITO_CLIENT_ID"),
          tokenUse: "id",
        },
        identityProvider: {
          region: configService.get("COGNITO_REGION"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CogAuthModule {}
