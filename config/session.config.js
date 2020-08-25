
const MongoStore = connectMongo(expressSession)

const session = expressSession({
  secret: process.env.SESSION_SECRET || 'ultra secret',
  saveUninitialized: false,
  cookie: {
    secure: process.env.SESSION_SECURE || false,
    httpOnly: true,
    maxAge: process.env.SESSION_MAX_AGE || 3600000,
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: process.env.SESSION_MAX_AGE || 3600,
  }),
})

module.exports = session