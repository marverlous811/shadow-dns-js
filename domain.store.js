const path = require('path')
const { writeFile, isFileExist, readObjectFromFile } = require('./util')
const backupFilePath = path.join(process.cwd(), 'tmp/data.json')
class DomainStore {
  constructor() {
    this.store = {}
    this.restore = this.restore.bind(this)
    this.restore()
  }

  setDomain(domain, ip) {
    this.store[domain] = ip
  }

  getDomain(domain) {
    return this.store[domain]
  }

  async backUp() {
    await writeFile(backupFilePath, JSON.stringify(this.store, null, 2))
  }

  async restore() {
    const isBackupFileExist = isFileExist(backupFilePath)
    if (isBackupFileExist) {
      const data = await readObjectFromFile(backupFilePath)
      this.store = { ...data }
    }
  }
}

module.exports = new DomainStore()
