const {User} = require("../models");

export const users = [
  new User({
    username: "josh.baker",
    password: "123456789",
    tokens: []
  }),
  new User({
    username: "mark.torrent",
    password: "123456789",
    tokens: []
  }),
  new User({
    username: "floyd.parker",
    password: "123456789",
    tokens: []
  })
]
