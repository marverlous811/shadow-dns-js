class DomainStore {
  constructor() {
    this.store = {}
  }

  setDomain(domain, ip) {
    this.store[domain] = ip
  }

  getDomain(domain) {
    return this.store[domain]
  }
}

module.exports = new DomainStore()
