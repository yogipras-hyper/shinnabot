import connection from "./lib/connection.js";
import express from 'express'
import qrcode from 'qrcode'
import path from 'path'
const __filename = new URL('', import.meta.url).pathname;
// Will contain trailing slash
const __dirname = new URL('.', import.meta.url).pathname;
const scanUsingWeb = process.argv.includes('--webscan')
import fs from 'fs'
import syntaxerror from 'syntax-error'
import { format } from 'util';
import { platform } from 'process'
import './config.js'
import cp from 'child_process'
import helper from './lib/helper.js'
import clearTmp from './lib/cleanCache.js'

global.opts = helper.opts
//connection ./lib/connection.js
connection().then((cons) => scanUsingWeb? connect(cons, 8080) : undefined)

clearTmp()

export function connect (conn, PORT) {
    let app = global.app = express()

    app.use(express.static(path.join(__dirname, 'views')))
    let _qr = 'invalid'
    app.use(async (req, res) => {
        res.setHeader('content-type', 'image/png')
        res.end(await qrcode.toBuffer(_qr))
    })
    conn.ev.on('connection.update', qr => {
        _qr = qr.qr
        if (qr.connection === "open") {
            undefined
        } else {
        }
    })
    
    let server = app.listen(PORT, () => console.log('App listened on port', PORT))
}
//load plugins

const pluginFolder = path.join(__dirname, './plugins/')
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
  for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let file = path.join(pluginFolder, filename)
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      console.log(e)
      delete global.plugins[filename]
    }
  }
}
filesInit().then(_ => console.log(Object.keys(global.plugins))).catch(console.error)

global.nameFile = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }
global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    let dir = path.join(pluginFolder, filename)
    if (filename in global.plugins) {
      if (fs.existsSync(dir)) console.log(`re - require plugin '${filename}'`)
      else {
        console.log(`deleted plugin '${filename}'`)
        return delete global.plugins[filename]
      }
    } else console.log(`requiring new plugin '${filename}'`)
    let err = syntaxerror(fs.readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })
    if (err) console.log(`syntax error while loading '${filename}'\n${format(err)}`)
    else try {
      const module = (await import(`${nameFile(dir)}?update=${Date.now()}`))
      global.plugins[filename] = module.default || module
    } catch (e) {
      console.log(`error require plugin '${filename}\n${format(e)}'`)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
fs.watch(pluginFolder, global.reload)

async function _quickTest() {
  let test = await Promise.all([
    cp.spawn('ffmpeg'),
    cp.spawn('ffprobe'),
    cp.spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    cp.spawn('convert'),
    cp.spawn('magick'),
    cp.spawn('gm'),
    cp.spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
  console.log(test)
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  }
  // require('./lib/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) console.log('Please install ffmpeg for sending videos (apt install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) console.log('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
  if (!s.convert && !s.magick && !s.gm) console.log('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}

_quickTest()
  .then(() => console.log('Quick Test Done'))
  .catch(console.error)