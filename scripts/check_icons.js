const fs = require('fs')
const path = require('path')

const files = [
  'public/icons/icon-192.png',
  'public/icons/icon-512.png',
  'public/icons/maskable-icon-192.png',
  'public/icons/maskable-icon-512.png',
]

function checkPng(p) {
  const abs = path.resolve(p)
  try {
    const buf = fs.readFileSync(abs)
    const sig = Buffer.from([137,80,78,71,13,10,26,10])
    const isPng = buf.slice(0,8).equals(sig)
    let width = null
    let height = null
    if (isPng && buf.length >= 24) {
      // width: bytes 16-19, height: 20-23 (big-endian)
      width = buf.readUInt32BE(16)
      height = buf.readUInt32BE(20)
    }
    return { path: p, exists: true, isPng, width, height, size: buf.length }
  } catch (err) {
    return { path: p, exists: false, error: err.message }
  }
}

const results = files.map(checkPng)
console.log(JSON.stringify(results, null, 2))
