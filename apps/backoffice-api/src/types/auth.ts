import { z } from 'zod';

import { UserSchema } from './user';

export const AuthInput = UserSchema.pick({
  usercode: true,
  password: true,
});
export type AuthInput = z.infer<typeof AuthInput>;

export const TokenInput = z.object({
  id: z.string(),
  sessionId: z.string(),
});
export type TokenInput = z.infer<typeof TokenInput>;

export const RefreshTokenInput = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenInput>;
