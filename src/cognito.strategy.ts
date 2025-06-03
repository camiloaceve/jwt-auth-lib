import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';

export class CognitoJwtStrategy {
  private jwksUrl: string;
  private cache: Record<string, string> = {};

  constructor(private userPoolId: string, private region: string) {
    this.jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  }

  jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  ignoreExpiration = false;

  getSecretOrKey = async (_req: any, rawJwtToken: string, done: Function) => {
    try {
      const decoded = jwt.decode(rawJwtToken, { complete: true }) as any;
      const kid = decoded?.header?.kid;
      if (!kid) return done(new Error('No KID in token'), null);

      if (this.cache[kid]) return done(null, this.cache[kid]);

      const { data } = await axios.get(this.jwksUrl);
      const key = data.keys.find(( k:any ) => k.kid === kid);
      if (!key) return done(new Error('Key not found'), null);

      const pem = jwkToPem(key);
      this.cache[kid] = pem;

      return done(null, pem);
    } catch (err) {
      return done(err, null);
    }
  };

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
