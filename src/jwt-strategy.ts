import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private static jwks: Record<string, string> = {};
  private static jwksUrl: string;

  constructor(private userPoolId: string, private region: string) {
    const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    JwtStrategy.jwksUrl = jwksUrl;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: JwtStrategy.getSecretOrKey,
    });
  }

  private static async getSecretOrKey(_request: any, rawJwtToken: any, done: any) {
    try {
      const decoded = jwt.decode(rawJwtToken, { complete: true }) as any;
      const kid = decoded?.header?.kid;

      if (!kid) return done(new Error('Key ID not found in token.'), null);

      if (JwtStrategy.jwks[kid]) return done(null, JwtStrategy.jwks[kid]);

      const { data } = await axios.get(JwtStrategy.jwksUrl);
      const key = data.keys.find((k:any) => k.kid === kid);
      if (!key) return done(new Error('Key not found in JWKS.'), null);

      const pem = jwkToPem(key);
      JwtStrategy.jwks[kid] = pem;

      done(null, pem);
    } catch (err) {
      done(err, null);
    }
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
