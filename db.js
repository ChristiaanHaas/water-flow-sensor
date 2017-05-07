var mongo = require('mongodb').MongoClient

var state = {
  db: null,
}

exports.connect = (url, cb) => {
  if (state.db) return cb()

  mongo.connect(url, (err, db) => {
    if (err) return cb(err)
    state.db = db
    cb()
  })
}

exports.get = () => {
  return state.db
}

exports.close = (cb) => {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      cb(err)
    })
  }
}
