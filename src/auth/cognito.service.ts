import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';

@Injectable()
export class CognitoService {
  private cognitoIdentity;

  //   constructor() {
  //       AWS.config.update({region: process.env.REGION});
  //       this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider({
  //           // apiVersion: '2016-04-18',
  //           region: process.env.REGION
  //       });
  //   }

  //   async signIn(username: string, password: string): Promise<any> {
  //     const secretHash = this.calculateSecretHash(username);
  //     const params = {
  //         AuthFlow: 'USER_PASSWORD_AUTH',
  //         ClientId: process.env.COGNITO_CLIENT_ID,
  //         AuthParameters: {
  //             USERNAME: username,
  //             PASSWORD: password,
  //             SECRET_HASH: secretHash
  //         },
  //     };

  //     return this.cognitoIdentity.initiateAuth(params).promise();
  // }

  // async register(username: string, password: string, email: string): Promise<any> {
  //   const secretHash = this.calculateSecretHash(username);
  //   const params = {
  //       ClientId: process.env.COGNITO_CLIENT_ID,
  //       SecretHash: secretHash,
  //       Username: username,
  //       Password: password,
  //       UserAttributes: [
  //           {
  //               Name: 'email',
  //               Value: email
  //           },
  //       ],
  //   };

  //   return this.cognitoIdentity.signUp(params).promise();
  // }

  // async refreshToken(refreshToken: string, username: string): Promise<any> {
  //   const secretHash = this.calculateSecretHash(username);
  //   const params = {
  //       ClientId: process.env.COGNITO_CLIENT_ID,
  //       SecretHash: secretHash,
  //       AuthFlow: 'REFRESH_TOKEN_AUTH',
  //       AuthParameters: {
  //           REFRESH_TOKEN: refreshToken,
  //           SECRET_HASH: secretHash,
  //       },
  //   };

  //   try {
  //     const response = await this.cognitoIdentity.initiateAuth(params).promise();
  //     return response;
  //   } catch (error) {
  //     throw new Error('Failed to refresh token: ' + error.message);
  //   }
  // }

  // private calculateSecretHash(username: string): string {
  //   const hash = crypto.createHmac('sha256', process.env.COGNITO_CLIENT_SECRET)
  //                      .update(username + process.env.COGNITO_CLIENT_ID)
  //                      .digest('base64');
  //   return hash;
  // }
}
