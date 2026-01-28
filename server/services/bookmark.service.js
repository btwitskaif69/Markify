import prisma from "../db/prismaClient";
import parseTags from "../utils/parseTags";

export const getAll = () => prisma.bookmark.findMany();

export const create = (data) => {
  const parsedTags = parseTags(data.tags);
  return prisma.bookmark.create({
    data: {
      ...data,
      tags: parsedTags.join(","),
      favicon: `https://www.google.com/s2/favicons?sz=64&domain_url=${data.url}`,
    },
  });
};
