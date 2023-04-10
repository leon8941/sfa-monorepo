import * as jwt from 'jsonwebtoken';
import { TokenInput } from '../types';

const secretKey = 'very-secret-key';

async function generateToken(
  payload: object,
  secret: string,
  opt: jwt.SignOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, opt, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token!);
    });
  });
}

async function verifyToken(
  token: string,
  secret: string,
  opt: jwt.VerifyOptions
): Promise<jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, opt, (err, decoded: jwt.JwtPayload) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

export function generateAuthToken(user: TokenInput): Promise<string> {
  const accessToken = generateToken(
    { id: user.id, usercode: user.usercode },
    secretKey,
    {
      audience: 'sfa-api',
    }
  );

  return accessToken;
}

export function verifyAuthToken(token: string): Promise<jwt.JwtPayload> {
  return verifyToken(token, secretKey, {
    audience: 'sfa-api',
    ignoreExpiration: true,
  });
}
