const express = require('express')
const validUrl = require('valid-url')
const shortid = require('shortid')
const config = require('config')
const Url = require('../models/Url')

const router = express.Router()

// @route  POST /api/url/shorten
// @desc   Create short URL
router.post('/shorten', async (req, res) => {
  console.log(req.body);
  const { longUrl } = req.body
  const baseUrl = config.get('baseUrl')

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url')
  }

  // Create url code
  const urlCode = shortid.generate()

  // Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl })

      if (!url) {
        const shortUrl = baseUrl + '/' + urlCode
        url = new Url({
          longUrl,
          shortUrl,
          urlCode
        })
        await url.save()
      }

      res.json(url)
    } catch (err) {
      console.error(err)
      res.status(500).json('Server error')
    }
  } else {
    return res.status(401).json('Invalid long url')
  }
})

module.exports = router
