import fs from 'fs'
import { getDevice } from '@whiskeysockets/baileys'
let tags = {
  'main': 'Main',
  'rpg': 'Epic RPG',
  'game': 'Game',
  'xp': 'Exp & Limit',
  'sticker': 'Sticker',
  'kerang': 'Kerang Ajaib',
  'quotes': 'Quotes',
  'admin': 'Admin',
  'group': 'Group',
  'premium': 'Premium',
  'internet': 'Internet',
  'anonymous': 'Anonymous Chat',
  'nulis': 'MagerNulis & Logo',
  'downloader': 'Downloader',
  'tools': 'Tools',
  'fun': 'Fun',
  'database': 'Database',
  'vote': 'Voting',
  'absen': 'Absen',
  'quran': 'Al Qur\'an',
  'jadibot': 'Jadi Bot',
  'owner': 'Owner',
  'host': 'Host',
  'advanced': 'Advanced',
  'info': 'Info',
  '': 'No Category',
}
const defaultMenu = {
  before: `*%me*

Halo *%pushname* saya Shinna Bot melayani hingga 24jam nonstop jadi mohon gunakan dengan bijak ya

╭─「 Hai kak %pushname  」
│ • Botname: %me
│ • Your Device: %device
│ • Uptime: %uptime (%muptime)
│ • Total fitur: %ttlfitur
╰──── 

Jika ada masalah bisa hubungi owner dengan mengetik .owner

%readmore
`.trimStart(),
  header: '╭─「  %category 」',
  body: '│ •  %cmd',
  footer: '╰────\n',
  after: ``,
}

let _uptime = process.uptime() * 1000
let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function ucapan() {
  const time = (new Date().getUTCHours() + 7) % 24
  res = "Woi. Pagi"
  if (time >= 4) {
    res = "Selamat Pagi"
  }
  if (time >= 12) {
    res = "Selamat Siang"
  }
  if (time >= 15) {
    res = "Selamat Sore"
  }
  if (time >= 19) {
    res = "Selamat Malam"
  }
  return res
}

let muptime = clockString(_muptime)
let uptime = clockString(_uptime)

export default {
    cmd: ['menu', 'help'],
    tags: ['main'],
    help: ['menu', 'help'],
    exec: async (m, conn, ) => {
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                customPrefix: plugin.customPrefix ? plugin.customPrefix : '',
            }
        })

        let before = defaultMenu.before
        let after = defaultMenu.after
        let header = defaultMenu.header
        let footer = defaultMenu.footer
        let body = defaultMenu.body
        let links = help.filter(x => x.links != undefined).map(x => x.links)
        const ttlfitur = Object.values(plugins).filter(v => v.help).map(v => v.help).flat(1)
         let _text = [
            before.replace(/%device/g, getDevice(m.key.id))
                .replace(/%ttlfitur/g, ttlfitur.length)
                .replace(/%pushname/g, m.pushName)
                .replace(/%me/g, global.option.nameBot)
                .replace(/%uptime/g, uptime)
                .replace(/%muptime/g, muptime)
                .replace(/%readmore/g, readMore),
            ...Object.keys(tags).map(tag => {
                return header.replace(/%category/g, tags[tag]) + '\n' + [
                ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                    return menu.help.map(help => {
                    return body.replace(/%cmd/g, menu.customPrefix ? menu.customPrefix : `${global.prefix}` + help).trim()
                    }).join('\n')
                }),
                footer
                ].join('\n')
            }),
            after
            ].join('\n')

        
        await conn.sendMessage(m.chat, {
                text: _text,
                contextInfo: {
                        externalAdReply: {
                        showAdAttribution: true,
                        title: global.option.nameBot,
                        body: `Bot Created By Yogi Prasetya`,
                        thumbnailUrl: 'https://telegra.ph/file/f1663061fb6550cba126c.jpg',
                        sourceUrl: 'https://chat.whatsapp.com/LNA6JKhHWFF1A93CaV5nhP',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, {
                quoted: m
        })
    }
}