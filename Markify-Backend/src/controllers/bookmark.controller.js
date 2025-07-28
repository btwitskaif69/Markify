const bookmarkService = require("../services/bookmark.service")

exports.getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await bookmarkService.getAll()
    res.json(bookmarks)
  } catch (error) {
    next(error)
  }
}

exports.createBookmark = async (req, res, next) => {
  try {
    const bookmark = await bookmarkService.create(req.body)
    res.status(201).json(bookmark)
  } catch (error) {
    next(error)
  }
}
