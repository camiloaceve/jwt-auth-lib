# jwt-auth-lib-cognito

`jwt-auth-lib-cognito` es una librería para verificar tokens JWT firmados por Amazon Cognito. Soporta validación de claves públicas descargadas dinámicamente desde el endpoint JWKS. Funciona tanto en aplicaciones NestJS como en proyectos JavaScript/TypeScript puros.

---

## 🚀 Características

- Descarga automática de claves públicas (JWKS) desde AWS Cognito.
- Cacheo de claves para alto rendimiento.
- Compatible con aplicaciones NestJS y Node.js puro.
- Soporte para algoritmos RS256 firmados por Cognito.
- Validación segura y desacoplada.

---

## 📦 Instalación

### Usando NPM:

```bash
npm i jwt-auth-lib-cognito
```

### Usando YARN:

```bash
yarn add jwt-auth-lib-cognito
```

## ⚙️ Cómo usar la librería

### 1. En una aplicación NestJS

```bash
// auth.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthCognitoModule } from 'jwt-auth-lib-cognito';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthCognitoModule.register({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      region: process.env.AWS_REGION!,
    }),
  ],
})
export class AppModule {}

// controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('example')
export class ExampleController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProtectedData() {
    return { message: 'Ruta protegida por JWT' };
  }
}

```

### 2. 🧪 Uso en JavaScript o TypeScript puro (sin Nest)

```bash
import express from 'express';
import passport from 'passport';
import { JwtStrategy } from 'jwt-auth-lib-cognito';

const app = express();

const strategy = new JwtStrategy(
  process.env.COGNITO_USER_POOL_ID,
  process.env.AWS_REGION
);

passport.use('jwt', strategy);

app.use(passport.initialize());

app.get(
  '/secure',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ message: 'Ruta protegida' });
  }
);

app.listen(3000);

```
## 🌐 Variables de Entorno Requeridas

### Ejemplo:

COGNITO_USER_POOL_ID=us-east-1_XXXX
AWS_REGION=us-east-1




