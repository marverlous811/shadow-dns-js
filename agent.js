const { spawn } = require('child_process')
const axios = require('axios')
const DOMAIN = process.env.DOMAIN
const DNS_API_URL = process.env.DNS_API_URL

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
      console.log(`process is existed with code `, code)
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
  if (publicIp) {
    try {
      await axios.default.post(`${DNS_API_URL}/domain`, {
        ip: publicIp,
        domain: DOMAIN,
      })
    } catch (e) {
      console.log(`error when call domain api`, e)
    }
  }
}

;(() => {
  setInterval(syncAgentIp, 10000)
})()
