import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@bt/db";
import { Courses, CreateInstitutionSchema, Institutions } from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const institutionsRouter = {
  getColleges: protectedProcedure
    .input(CreateInstitutionSchema.pick({ type: true }))
    .query(({ ctx, input }) =>
      ctx.db.query.Institutions.findMany({
        where: eq(Institutions.type, input.type),
      }),
    ),

  getCourses: protectedProcedure
    .input(z.object({ institutionId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Courses.findMany({
        where: eq(Courses.instituionId, input.institutionId),
      }),
    ),
} satisfies TRPCRouterRecord;
