import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private verifier;

  constructor(private configService: ConfigService, private reflector: Reflector) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: this.configService.get('COGNITO_USER_POOL_ID'),
      tokenUse: 'id',
      clientId: this.configService.get('COGNITO_CLIENT_ID'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = await this.verifier.verify(token);
      request.user = {
        ...decodedToken,
        roles: decodedToken['cognito:groups'] || [],
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
