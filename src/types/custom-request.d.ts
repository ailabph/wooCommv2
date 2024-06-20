import { Request } from 'express';
import { Role } from '../common/constants/role.enum';

interface JwtPayload {
  sub: string;
  'cognito:groups': Role[];
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}

export interface CustomRequest extends Request {
  user: JwtPayload;
}
