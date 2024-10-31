"use server";

import { api } from "~/trpc/server";

export async function getChapterById(chapterId: string) {
  return api.chapters.byId({ id: chapterId });
}
