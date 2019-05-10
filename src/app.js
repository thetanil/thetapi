const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const serveStatic = require('serve-static')

const winston = require('winston')
const expressWinston = require('express-winston')

const PORT = 8080
const app = express()
const routes = require('./routes/index')

app.use(expressWinston.logger({
  transports: [ new winston.transports.Console() ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute: (req, res) => { return false }
}))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'AMLaijdasdAma',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(serveStatic(path.join(__dirname, '..', 'public')))

app.use('/', routes)

app.use((req, res, next) => {
  const err = new Error('404')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  })
})

app.listen(PORT, () => console.log(`ThetaPi Listening on port: ${PORT}`))

const livereload = require('livereload')
const lr = livereload.createServer({ delay: 2000 })
lr.watch(path.join(__dirname, '..', 'public'))

module.exports = app

/// ////////////////////////////////////////////////
//
//

// https://github.com/benweet/stackedit.js
// rather: https://codemirror.net/
// https://github.com/MithrilJS/mithril-node-render
// https://github.com/nodejitsu/node-http-proxy

// #!/usr/bin/env node
// const argv = require('minimist')(process.argv.slice(2), {
// boolean: ['v', 'd', 'q', 'n']
// })

// const logger = require('./src/log')
// if (argv.q) logger.level = 'error'
// if (argv.v) logger.level = 'verbose'
// if (argv.d) logger.level = 'debug'
// if (global.it) logger.level = 'warn'

// logger.log('verbose', 'ThetaPi Init')

// const config = require('./src/config')
// config.dryrun = argv.n || false
/// / logger.log('debug', 'ThetaPi %s', inspect(config, { colors: true }))

/// / const { inspect } = require('util')
/// / console.log('ThetaPi %s', inspect(config, { colors: true }))

// const runner = require('./src/runner')
// logger.log('verbose', 'ThetaPi Run...')
// runner.run(config)
// logger.log('verbose', 'ThetaPi Run Complete')
