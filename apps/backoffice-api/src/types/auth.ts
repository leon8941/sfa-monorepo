import { z } from 'zod';

import { UserSchema } from './user';

export const AuthInput = UserSchema.pick({
  usercode: true,
  password: true,
});
export type AuthInput = z.infer<typeof AuthInput>;

export const TokenInput = z.object({
  id: z.string(),
});
export type TokenInput = z.infer<typeof TokenInput>;

export const RefreshTokenInput = z.object({
  id: z.string(),
  refreshToken: z.string()
})

export type RefreshTokenInput = z.infer<typeof RefreshTokenInput>;

export const RefreshTokenOutput = z.object({
  accessToken: z.string()
})

export type RefreshTokenOutput = z.infer<typeof RefreshTokenOutput>;
