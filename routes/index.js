const express = require('express')
const Url = require('../models/Url')

const router = express.Router()

// @route  GET /:code
// @desc   Redirect to long/original URL
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params
    const url = await Url.findOne({ urlCode: code })

    if (url) {
      return res.redirect(url.longUrl)
    } else {
      return res.status(404).json('No URL found')
    }
  } catch (err) {
    console.error(err)
    res.status(500).json('Server error')
  }
})

module.exports = router
