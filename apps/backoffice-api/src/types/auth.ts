import { z } from 'zod';

import { UserSchema } from './user';

export const AuthInput = UserSchema.pick({
  usercode: true,
  password: true,
});
export type AuthInput = z.infer<typeof AuthInput>;

export const TokenInput = UserSchema.pick({ id: true, usercode: true });
export type TokenInput = z.infer<typeof TokenInput>;
