// src/jwt-strategy.ts
import { Strategy as PassportStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
    sub: string;
    email: string;
}

export class JwtStrategy extends PassportStrategy {
    private static jwks: Record<string, string> = {};
    private static jwksUrl: string;

    constructor(userPoolId: string, region: string) {
        JwtStrategy.jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKeyProvider: JwtStrategy.getSecretOrKey,
            },
            async (payload, done) => {
                try {
                    done(null, payload);
                } catch (err) {
                    done(err, false);
                }
            },
        );
    }


    private static async getSecretOrKey(_request: any, rawJwtToken: any, done: any) {
        try {
            const decoded = jwt.decode(rawJwtToken, { complete: true }) as any;
            const kid = decoded?.header?.kid;

            if (!kid) return done(new Error('Key ID not found in token.'), null);

            if (JwtStrategy.jwks[kid]) return done(null, JwtStrategy.jwks[kid]);

            const { data } = await axios.get(JwtStrategy.jwksUrl);
            const key = data.keys.find((k: any) => k.kid === kid);
            if (!key) return done(new Error('Key not found in JWKS.'), null);

            const pem = jwkToPem(key);
            JwtStrategy.jwks[kid] = pem;
            done(null, pem);
        } catch (error) {
            done(error, null);
        }
    }

    async validate(payload: JwtPayload) {
        return { userId: payload.sub, email: payload.email };
    }
}
