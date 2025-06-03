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
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'jwt-auth-lib-cognito';

@Module({
  imports: [PassportModule],
  providers: [
    {
      provide: JwtStrategy,
      useFactory: () => {
        const userPoolId = process.env.COGNITO_USER_POOL_ID;
        const region = process.env.AWS_REGION;
        return new JwtStrategy(userPoolId, region);
      },
    },
  ],
  exports: [PassportModule],
})
export class AuthModule {}

```

### 2. En un proyecto TypeScript puro

```bash
import { JwtStrategy } from 'jwt-auth-lib-cognito';
import * as jwt from 'jsonwebtoken';

async function main() {
  const token = 'eyJraWQiOi...'; // JWT válido
  const userPoolId = 'us-east-1_XXXX';
  const region = 'us-east-1';

  const strategy = new JwtStrategy(userPoolId, region);

  const done = (err: any, key: string | null) => {
    if (err) {
      console.error('Error al verificar token:', err);
      return;
    }
    const payload = jwt.verify(token, key);
    console.log('Token decodificado:', payload);
  };

  // Llama al método estático getSecretOrKey para obtener la clave pública
  await (JwtStrategy as any).getSecretOrKey(null, token, done);
}

main();
```

### 3. En un proyecto JavaScript puro (Node.js)

```bash
const { JwtStrategy } = require('jwt-auth-lib-cognito');
const jwt = require('jsonwebtoken');

async function main() {
  const token = 'eyJraWQiOi...'; // JWT válido
  const userPoolId = 'us-east-1_XXXX';
  const region = 'us-east-1';

  const strategy = new JwtStrategy(userPoolId, region);

  const done = (err, key) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    const payload = jwt.verify(token, key);
    console.log('Payload decodificado:', payload);
  };

  await JwtStrategy.getSecretOrKey(null, token, done);
}

main();
```

## 🌐 Variables de Entorno Requeridas

### Ejemplo:

COGNITO_USER_POOL_ID=us-east-1_XXXX
AWS_REGION=us-east-1




