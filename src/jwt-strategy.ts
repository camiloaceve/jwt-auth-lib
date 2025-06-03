import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { CognitoJwtStrategy } from './cognito.strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private base: CognitoJwtStrategy;

  constructor() {
    const userPoolId = process.env.COGNITO_USER_POOL_ID!;
    const region = process.env.AWS_REGION!;
    const base = new CognitoJwtStrategy(userPoolId, region);
    super({
      jwtFromRequest: base.jwtFromRequest,
      ignoreExpiration: base.ignoreExpiration,
      secretOrKeyProvider: base.getSecretOrKey,
    });
    this.base = base;
  }

  async validate(payload: any) {
    return this.base.validate(payload);
  }
}
