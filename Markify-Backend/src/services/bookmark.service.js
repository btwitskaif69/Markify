const prisma = require("../db/prismaClient")
const parseTags = require("../utils/parseTags")

exports.getAll = () => {
  return prisma.bookmark.findMany()
}

exports.create = (data) => {
  const parsedTags = parseTags(data.tags)
  return prisma.bookmark.create({
    data: {
      ...data,
      tags: parsedTags.join(","),
      favicon: `https://www.google.com/s2/favicons?sz=64&domain_url=${data.url}`,
    },
  })
}
