import { Injectable } from '@nestjs/common';
import { CognitoService } from './cognito.service';

@Injectable()
export class AuthService {
  constructor(private cognitoService: CognitoService) {}

  // async register(username: string, password: string, email: string) {
  //   return this.cognitoService.register(username, password, email);
  // }

  // async signIn(username: string, password: string) {
  //   return this.cognitoService.signIn(username, password);
  // }

  // async refreshToken(refreshToken: string, username: string) {
  //   try {
  //     return await this.cognitoService.refreshToken(refreshToken, username);
  //   } catch (error) {
  //     throw new Error('Error refreshing token: ' + error.message);
  //   }
  // }
}
