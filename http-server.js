const express = require('express')
const domainStore = require('./domain.store')
const { isIp } = require('./util')

class HttpServer {
  constructor(port = 8080) {
    this.port = port
    this.app = express()
    this.init = this.init.bind(this)
    this.router = this.router.bind(this)
    this.start = this.start.bind(this)
    this.init()
  }

  init() {
    this.app.use(require('cors')())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.router()
  }

  router() {
    this.app.post('/domain', (req, res) => {
      const data = req.body
      console.log('update ip for domain', data)
      const { domain, ip } = data
      const isIpMatched = isIp(ip)
      if (isIpMatched) {
        domainStore.setDomain(domain, ip)
      }
      res.send({ status: true })
    })
  }

  start() {
    this.app.listen(this.port, () => {
      console.log('server is running in port ', this.port)
    })
  }
}

module.exports = HttpServer
