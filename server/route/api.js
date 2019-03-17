const express = require('express')
const shortid = require('shortid')

const ChatService = require('../services/chat-service')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('api root')
})

// POST /token
router.post('/token', (req, res) => {
  const deviceFingerprint = req.body.deviceFingerprint
    ? req.body.deviceFingerprint
    : shortid.generate()
  const identity = req.body.identity ? req.body.identity : shortid.generate()

  const token = ChatService.generateToken({ identity, deviceFingerprint })

  res.json({
    identity: identity,
    deviceFingerprint: deviceFingerprint,
    token: token.toJwt()
  })
})

module.exports = router
