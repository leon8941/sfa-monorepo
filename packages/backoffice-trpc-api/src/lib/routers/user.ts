import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@sfa/backoffice-db';
import { t } from '../trpc';

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
});

export const userRouter = t.router({
  findMany: t.procedure.query(() => {
    return prisma.user.findMany({
      select: defaultUserSelect,
    });
  }),
  findById: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input }) => {
      const { id } = input;

      return prisma.user.findFirstOrThrow({
        select: defaultUserSelect,
        where: { id: id },
      });
    }),
});
