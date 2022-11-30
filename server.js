const DnsServer = require('./dns')
const HttpServer = require('./http-server')
const DNS_PORT = parseInt(process.env.DNS_PORT || '53')
const HTTP_PORT = parseInt(process.env.HTTP_PORT || '8080')

;(() => {
  const dnsServer = new DnsServer(DNS_PORT)
  dnsServer.start()

  const httpServer = new HttpServer(HTTP_PORT)
  httpServer.start()
})()
