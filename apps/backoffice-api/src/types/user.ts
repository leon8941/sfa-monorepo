import { z } from 'zod';

export const UserSchema = z.object({
  id: z
    .bigint()
    .nonnegative()
    .transform((val) => val.toString()),
  name: z.string().nullish(),
  email: z.string(),
  usercode: z.string(),
  password: z.string(),
});

export type UserSchema = z.infer<typeof UserSchema>;
