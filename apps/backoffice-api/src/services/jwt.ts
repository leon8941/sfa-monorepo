import * as jwt from 'jsonwebtoken';
import { TokenInput, RefreshTokenInput } from '../types';

const accessTokenSecretKey = 'very-access-secret-key';
const refreshTokenSecretKey = 'very-refresh-secret-key';

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

export function generateAccessToken(user: TokenInput): Promise<string> {
  const _validated = TokenInput.parse(user);
  const accessToken = generateToken(
    { id: _validated.id },
    accessTokenSecretKey,
    {
      audience: 'sfa-api',
      expiresIn: '1 days',
    }
  );

  return accessToken;
}

export function generateRefreshToken(user: RefreshTokenInput): Promise<string> {
  const refreshToken = generateToken(
    { id: user.id },
    refreshTokenSecretKey,
    {
      audience: 'sfa-api',
      expiresIn: '2 days',
    }
  );

  return refreshToken;
}

export function verifyAccessToken(token: string): Promise<jwt.JwtPayload> {
  return verifyToken(token, accessTokenSecretKey, {
    audience: 'sfa-api'
  });
}

export function verifyRefreshToken(token: string): Promise<jwt.JwtPayload> {
  return verifyToken(token, refreshTokenSecretKey, {
    audience: 'sfa-api'
  });
}
