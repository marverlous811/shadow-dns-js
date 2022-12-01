const { spawn } = require('child_process')
const axios = require('axios')
const { isIp } = require('./util')
const DOMAIN = process.env.DOMAIN
const DNS_API_URL = process.env.DNS_API_URL
let currentIp = null

function cmdExec(command) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const result = []
    const proc = spawn(cmd, args)
    proc.stdout.on('data', (data) => {
      const line = Buffer.from(data)
        .toString()
        .replace(/[^ -~]+/g, '')
      result.push(line)
    })

    proc.on('error', (err) => {
      reject(err)
    })
    proc.on('close', (code) => {
      // console.log(`process is existed with code `, code)
      resolve(result)
    })
  })
}

async function getPublicIp() {
  try {
    const res = await cmdExec(
      'dig +short myip.opendns.com @resolver1.opendns.com'
    )
    return res[0]
  } catch (e) {
    console.log(e)
    return undefined
  }
}

async function syncAgentIp() {
  const publicIp = await getPublicIp()
  console.log('public ip found: ', publicIp)
  if (publicIp) {
    if (isIp(publicIp)) {
      if (publicIp !== currentIp) {
        await onChanged(publicIp)
      }
    }
  }
}

async function onChanged(ip) {
  try {
    currentIp = ip
    const res = await axios.default.post(`${DNS_API_URL}/domain`, {
      ip,
      domain: DOMAIN,
    })
    console.log('update ip with response', res.data)
  } catch (e) {
    console.log(`error when call domain api`, e)
  }
}

;(() => {
  setInterval(syncAgentIp, 10000)
})()
