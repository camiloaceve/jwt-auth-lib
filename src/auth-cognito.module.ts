import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';

@Module({})
export class AuthCognitoModule {
  static register(config: { userPoolId: string; region: string }): DynamicModule {
    return {
      module: AuthCognitoModule,
      imports: [PassportModule],
      providers: [
        {
          provide: JwtStrategy,
          useFactory: () => {
            return new JwtStrategy(config.userPoolId, config.region);
          },
        },
      ],
      exports: [PassportModule],
    };
  }
}
