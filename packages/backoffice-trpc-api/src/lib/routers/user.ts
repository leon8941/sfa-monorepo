import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prisma } from '../prisma';
import { t } from '../trpc';

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
});

t.router({
  findMany: t.procedure.query(() => {
    return prisma.user.findMany();
  }),
  findById: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input }) => {
      const { id } = input;

      return prisma.user.findFirstOrThrow({ where: { id: id } });
    }),
});
