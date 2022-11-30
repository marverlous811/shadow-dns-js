const fs = require('graceful-fs')
const mkdirp = require('mkdirp')

function makeFile(name) {
  return new Promise((resolve, reject) => {
    mkdirp(name)
      .then((made) => {
        resolve(made)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

function writeFile(fname, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fname, content, (err) => {
      if (err) {
        return reject(err)
      }
      resolve(fname)
    })
  })
}

function readFile(fname) {
  return new Promise((resolve, reject) => {
    fs.readFile(fname, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

function isFileExist(fname) {
  if (fs.existsSync(fname)) {
    return true
  }

  return false
}

async function readObjectFromFile(fname) {
  try {
    const fileContent = await readFile(fname)
    const data = JSON.parse(fileContent)
    return data
  } catch (e) {
    return undefined
  }
}

module.exports = {
  makeFile,
  writeFile,
  readFile,
  isFileExist,
  readObjectFromFile,
}
