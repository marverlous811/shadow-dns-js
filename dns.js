const dns2 = require('dns2')
const store = require('./domain.store')
const { Packet } = dns2

class DnsServer {
  constructor(port = 53) {
    this.port = port
    this.server = dns2.createServer({
      udp: true,
      handle: this.handleRequest.bind(this),
    })
    this.onListening = this.onListening.bind(this)
    this.onClose = this.onClose.bind(this)
    this.answerDnsQuestion = this.answerDnsQuestion.bind(this)
    this.onDnsRequest = this.onDnsRequest.bind(this)
    this.start = this.start.bind(this)
  }

  start() {
    this.server.on('listening', this.onListening)
    this.server.on('close', this.onClose)
    this.server.on('request', this.onDnsRequest)
    this.server.listen({
      udp: {
        port: this.port,
        address: '0.0.0.0',
        type: 'udp4',
      },
    })
  }

  async handleRequest(request, send, rinfo) {
    const response = Packet.createResponseFromRequest(request)
    for (let q of request.questions) {
      const answer = await this.answerDnsQuestion(q)
      if (answer) {
        // eslint-disable-next-line no-prototype-builtins
        if (answer.hasOwnProperty('answers')) {
          response.answers.push(...answer.answers)
        } else {
          response.answers.push(answer)
        }
      }
    }
    send(response)
  }

  onDnsRequest(request, response, rinfo) {
    console.log(request.header.id, request.questions[0])
  }

  onListening() {
    console.log(this.server.addresses())
  }

  onClose() {
    console.log('dns server closed')
  }

  answerDnsQuestion(question) {
    const { name, type } = question
    const resolver = new dns2({
      dns: '8.8.8.8',
      recursive: true,
    })
    switch (type) {
      case Packet.TYPE.A: {
        const address = store.getDomain(name)
        if (address) {
          return {
            name,
            type,
            class: Packet.CLASS.IN,
            ttl: 300,
            address,
          }
        }
        return resolver.resolveA(name)
      }
      case Packet.TYPE.AAAA:
        return resolver.resolveAAAA(name)
      case Packet.TYPE.MX:
        return resolver.resolveMX(name)
      case Packet.TYPE.CNAME:
        return resolver.resolveCNAME(name)
      default:
        return undefined
    }
  }
}

module.exports = DnsServer
