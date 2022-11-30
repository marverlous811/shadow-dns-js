const DnsServer = require('./dns')
const store = require('./domain.store')
const HttpServer = require('./http-server')
const { makeFile } = require('./util')
const DNS_PORT = parseInt(process.env.DNS_PORT || '53')
const HTTP_PORT = parseInt(process.env.HTTP_PORT || '8080')

let interval = undefined

function existHandler(opts, exitCode) {
  if (opts.cleanup) {
    console.log('clean up...')
    if (interval) {
      clearInterval(interval)
    }
  }
  if (exitCode || exitCode === 0) {
    console.log(exitCode)
  }
  if (opts.exit) {
    console.log('process exit')
    process.exit()
  }
}

process.on('SIGTERM', existHandler.bind(null, { cleanup: true }))
process.on('SIGINT', existHandler.bind(null, { exit: true, cleanup: true }))
process.on(
  'uncaughtException',
  existHandler.bind(null, { exit: true, cleanup: true })
)
;(async () => {
  await makeFile('tmp')
  const dnsServer = new DnsServer(DNS_PORT)
  dnsServer.start()

  const httpServer = new HttpServer(HTTP_PORT)
  httpServer.start()

  interval = setInterval(async () => {
    await store.backUp()
  }, 10000)
})()
