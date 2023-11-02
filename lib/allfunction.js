import baileys, { prepareWAMessageMedia } from "@whiskeysockets/baileys"
const { jidNormalizedUser, proto, areJidsSameUser, extractMessageContent, toReadable, generateWAMessageFromContent, downloadContentFromMessage, toBuffer, getDevice } = baileys
import { parsePhoneNumber } from "libphonenumber-js"
import Helper from './helper.js'
import { Readable } from 'stream'
import FileType from 'file-type'
import path from 'path'
const __filename = new URL('', import.meta.url).pathname;
// Will contain trailing slash
const __dirname = new URL('.', import.meta.url).pathname;
import fs from 'fs'
import { buffer } from "stream/consumers"
//refrensi dari conn baileys
//https://github.com/Hisoka-Morrou/hisoka-baileys/blob/master/lib/serialize.js
import fetch from "node-fetch"

export function Client({ conn, store }) {
   delete store.groupMetadata

   // Combining Store to Client
   for (let v in store) {
      conn[v] = store[v]
   }

   const client = Object.defineProperties(conn, {
      getContentType: {
         value(content) {
            if (content) {
               const keys = Object.keys(content);
               const key = keys.find(k => (k === 'conversation' || k.endsWith('Message') || k.endsWith('V2') || k.endsWith('V3')) && k !== 'senderKeyDistributionMessage');
               return key
            }
         },
         enumerable: true
      },

      decodeJid: {
         value(jid) {
            if (/:\d+@/gi.test(jid)) {
               const decode = jidNormalizedUser(jid);
               return decode
            } else return jid;
         }
      },
      generateMessageID: {
         value(id = "3EB0", length = 18) {
            return id + Crypto.randomBytes(length).toString('hex').toUpperCase()
         }
      },
      getName: {
         value(jid) {
            let id = conn.decodeJid(jid)
            let v
            if (id?.endsWith("@g.us")) return new Promise(async (resolve) => {
               v = conn.contacts[id] || conn.messages["status@broadcast"]?.array?.find(a => a?.key?.participant === id)
               if (!(v.name || v.subject)) v = conn.groupMetadata[id] || {}
               resolve(v?.name || v?.subject || v?.pushName || (parsePhoneNumber('+' + id.replace("@g.us", "")).format("INTERNATIONAL")))
            })
            else v = id === "0@s.whatsapp.net" ? {
               id,
               name: "WhatsApp"
            } : id === conn.decodeJid(conn?.user?.id) ?
               conn.user : (conn.contacts[id] || {})
            return (v?.name || v?.subject || v?.pushName || v?.verifiedName || (parsePhoneNumber('+' + id.replace("@s.whatsapp.net", "")).format("INTERNATIONAL")))
         }
      },
      escapeRegExp: {
         value(string){
            return string.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, '\\$&')
         }
      },
      parseMention: {
         value(text) {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') || []
         }
      },
      sendContact: {
         async value(jid, number, quoted, options = {}) {
            let list = []
            for (let v of number) {
               list.push({
                  displayName: await conn.getName(v),
                  vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(v + "@s.whatsapp.net")}\nFN:${await conn.getName(v + "@s.whatsapp.net")}\nitem1.TEL;waid=${v}:${v}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:${global.exif.email}\nitem2.X-ABLabel:Email\nitem3.URL:${global.exif.web}\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
               })
            }
            return conn.sendMessage(jid, {
               contacts: {
                  displayName: `${list.length} Contact`,
                  contacts: list
               },
               mentions: quoted?.participant ? [conn.decodeJid(quoted?.participant)] : [conn.decodeJid(conn?.user?.id)],
               ...options
            }, { quoted, ...options })
         },
         enumerable: true
      },

      parseMention: {
         value(text) {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') || []
         }
      },
   getFile: { 
      async value(PATH, saveToFile = false) {
               let res, filename
                const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
                if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
                const type = await FileType.fromBuffer(data) || {
                    mime: 'application/octet-stream',
                    ext: '.bin'
                }
                if (data && saveToFile && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
                return {
                    res,
                    filename,
                    ...type,
                    data,
                    deleteFile() {
                        return filename && fs.promises.unlink(filename)
                    }
                }
            },
            enumerable: true
   },
   copyNForward: {
            /**
             * Exact Copy Forward
             * @param {String} jid
             * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} message
             * @param {Boolean|Number} forwardingScore
             * @param {Object} options
             */
            async value(jid, message, forwardingScore = true, options = {}) {
                let vtype
                if (options.readViewOnce && message.message.viewOnceMessage?.message) {
                    vtype = Object.keys(message.message.viewOnceMessage.message)[0]
                    delete message.message.viewOnceMessage.message[vtype].viewOnce
                    message.message = proto.Message.fromObject(
                        JSON.parse(JSON.stringify(message.message.viewOnceMessage.message))
                    )
                    message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo
                }
                let mtype = getContentType(message.message)
                let m = generateWAMessageFromContent(message, !!forwardingScore)
                let ctype = getContentType(m)
                if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore
                m[ctype].contextInfo = {
                    ...(message.message[mtype].contextInfo || {}),
                    ...(m[ctype].contextInfo || {})
                }
                m = generateWAMessageFromContent(jid, m, {
                    ...options,
                    userJid: conn.user.jid
                })
                await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
                return m
            },
            enumerable: true,
            writable: true,
        },
   cMod: {
         value(jid, copy, text = '', sender = conn.user.id, options = {}) {
            let mtype = conn.getContentType(copy.message)
            let content = copy.message[mtype]
            if (typeof content === "string") copy.message[mtype] = text || content
            else if (content.caption) content.caption = text || content.text
            else if (content.text) content.text = text || content.text
            if (typeof content !== "string") {
               copy.message[mtype] = { ...content, ...options }
               copy.message[mtype].contextInfo = {
                  ...(content.contextInfo || {}),
                  mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
               }
            }
            if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
            if (copy.key.remoteJid.includes("@s.whatsapp.net")) sender = sender || copy.key.remoteJid
            else if (copy.key.remoteJid.includes("@broadcast")) sender = sender || copy.key.remoteJid
            copy.key.remoteJid = jid
            copy.key.fromMe = areJidsSameUser(sender, conn.user.id)
            return proto.WebMessageInfo.fromObject(copy)
         }
      },
      sendFile: {  
         async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
        let type = await conn.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try { throw { json: JSON.parse(file.toString()) } }
            catch (e) { if (e.json) throw e.json }
        }
        let opt = { filename }
        if (quoted) opt.quoted = quoted
        if (!type) if (options.asDocument) options.asDocument = true
        let mtype = '', mimetype = type.mime
        if (/webp/.test(type.mime)) mtype = 'sticker'
        else if (/image/.test(type.mime)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) (
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        return await conn.sendMessage(jid, {
            ...options,
            caption,
            ptt,
            [mtype]: { url: pathFile },
            mimetype
        }, {
            ephemeralExpiration: 86400,
            ...opt,
            ...options
        })
    }
   },
        downloadMediaMessage: {
         async value(message, filename) {
            let mime = {
               imageMessage: "image",
               videoMessage: "video",
               stickerMessage: "sticker",
               documentMessage: "document",
               audioMessage: "audio",
               ptvMessage: "video"
            }[message.type]

            if ('thumbnailDirectPath' in message.msg && !('url' in message.msg)) {
               message = {
                  directPath: message.msg.thumbnailDirectPath,
                  mediaKey: message.msg.mediaKey
               };
               mime = 'thumbnail-link'
            } else {
               message = message.msg
            }

            return await toBuffer(await downloadContentFromMessage(message, mime))
         },
         enumerable: true
      },
      react:{
         async value(id, emoji, m) {
            const reactionMessage = {
               react: {
                  text: emoji, // use an empty string to remove the reaction
                  key: m.key,
               },
            };

            await conn.sendMessage(id, reactionMessage);
         }
      }

   })

   return conn
}

function escapeRegExp(string) {
   return string.toString().replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, '\\$&')
}

export async function smsg(conn, msg) {
   const m = {}
   const botNumber = conn.decodeJid(conn.user?.id)
   m.botNumber = botNumber
   if (!msg.message) return // ignore those that don't contain messages
   if (msg.key && msg.key.remoteJid == "status@broadcast") return // Ignore messages from status

   m.message = extractMessageContent(msg.message)

   if (msg.key) {
      m.key = msg.key
      m.chat = conn.decodeJid(m.key.remoteJid)
      m.fromMe = m.key.fromMe
      m.id = m.key.id
      m.isBot = (m.id.startsWith('BAE5') && m.id.length === 16);
      m.device = getDevice(m.id)
      m.isBaileys = m.id.startsWith("BAE5")
      m.isGroup = m.chat.endsWith("@g.us")
      m.participant = !m.isGroup ? false : m.key.participant
      m.sender = conn.decodeJid(m.fromMe ? conn.user.id : m.isGroup ? m.participant : m.chat)
   }

   m.pushName = msg.pushName
   m.isOwner = m.sender && [...global.option.owner, botNumber.split`@`[0]].includes(m.sender.replace(/\D+/g, ""))
   if (m.isGroup) {
      m.metadata = await conn.groupMetadata(m.chat)
      m.admins = (m.metadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, []))
      m.isAdmin = !!m.admins.find((member) => member.id === m.sender)
      m.isBotAdmin = !!m.admins.find((member) => member.id === botNumber)
   }

   if (m.message) {
      m.type = conn.getContentType(m.message) || Object.keys(m.message)[0]
      m.msg = extractMessageContent(m.message[m.type]) || m.message[m.type]
      m.mentions = m.msg?.contextInfo?.mentionedJid || []
      m.body = m.msg?.text || m.msg?.conversation || m.msg?.caption || m.message?.conversation || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || m.msg?.selectedId || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || m.msg?.name || ""
      m.prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi) : "/";
      m.command = m.body && m.body.replace(m.prefix, '').trim().split(/ +/).shift()
      m.arg = m.body.trim().split(/ +/).filter(a => a) || []
      m.args = m.body.trim().replace(new RegExp("^" + escapeRegExp(m.prefix), 'i'), '').replace(m.command, '').split(/ +/).filter(a => a) || []
      m.text = m.args.join(" ")
      m.expiration = m.msg?.contextInfo?.expiration || 0
      m.timestamp = (typeof msg.messageTimestamp === "number" ? msg.messageTimestamp : msg.messageTimestamp.low ? msg.messageTimestamp.low : msg.messageTimestamp.high) || m.msg.timestampMs * 1000
      m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath
      if (m.isMedia) {
         m.mime = m.msg?.mimetype
         m.size = m.msg?.fileLength
         m.height = m.msg?.height || ""
         m.width = m.msg?.width || ""
         if (/webp/i.test(m.mime)) {
            m.isAnimated = m.msg?.isAnimated
         }
      }

      m.reply = async (text, options = {}) => {
         return conn.sendMessage(m.chat, { text, mentions: [m.sender, ...conn.parseMention(text)], ...options, }, { quoted: m, ephemeralExpiration: m.expiration, ...options });
      }
      
      m.download = (filepath) => {
         if (filepath) return conn.downloadMediaMessage(m, filepath)
            else return conn.downloadMediaMessage(m)
         }
      }

   // quoted line
   m.isQuoted = false
   if (m.msg?.contextInfo?.quotedMessage) {
      m.isQuoted = true
      m.quoted = {}
      m.quoted.message = extractMessageContent(m.msg?.contextInfo?.quotedMessage)

      if (m.quoted.message) {
         m.quoted.type = conn.getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0]
         m.quoted.msg = extractMessageContent(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type]
         m.quoted.key = {
            remoteJid: m.msg?.contextInfo?.remoteJid || m.chat,
            participant: m.msg?.contextInfo?.remoteJid?.endsWith("g.us") ? conn.decodeJid(m.msg?.contextInfo?.participant) : false,
            fromMe: areJidsSameUser(conn.decodeJid(m.msg?.contextInfo?.participant), conn.decodeJid(conn?.user?.id)),
            id: m.msg?.contextInfo?.stanzaId
         }
         m.quoted.from = m.quoted.key.remoteJid
         m.quoted.fromMe = m.quoted.key.fromMe
         m.quoted.id = m.msg?.contextInfo?.stanzaId
         m.quoted.device = getDevice(m.quoted.id)
         m.quoted.isBaileys = m.quoted.id.startsWith("BAE5")
         m.quoted.isGroup = m.quoted.from.endsWith("@g.us")
         m.quoted.participant = m.quoted.key.participant
         m.quoted.sender = conn.decodeJid(m.msg?.contextInfo?.participant)

         m.quoted.isOwner = m.quoted.sender && [...global.option.owner, botNumber.split`@`[0]].includes(m.quoted.sender.replace(/\D+/g, ""))
         if (m.quoted.isGroup) {
            m.quoted.metadata = await conn.groupMetadata(m.quoted.from)
            m.quoted.admins = (m.quoted.metadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, []))
            m.quoted.isAdmin = !!m.quoted.admins.find((member) => member.id === m.quoted.sender)
            m.quoted.isBotAdmin = !!m.quoted.admins.find((member) => member.id === botNumber)
         }

         m.quoted.mentions = m.quoted.msg?.contextInfo?.mentionedJid || []
         m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || ""
         m.quoted.prefix = /^[\\/!#.]/gi.test(m.quoted.body) ? m.quoted.body.match(/^[\\/!#.]/gi) : "/";
         m.quoted.command = m.quoted.body && m.quoted.body.replace(m.quoted.prefix, '').trim().split(/ +/).shift()
         m.quoted.arg = m.quoted.body.trim().split(/ +/).filter(a => a) || []
         m.quoted.args = m.quoted.body.trim().replace(new RegExp("^" + escapeRegExp(m.quoted.prefix), 'i'), '').replace(m.quoted.command, '').split(/ +/).filter(a => a) || []
         m.quoted.text = m.quoted.args.join(" ")
         m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath
         if (m.quoted.isMedia) {
            m.quoted.mime = m.quoted.msg?.mimetype
            m.quoted.size = m.quoted.msg?.fileLength
            m.quoted.height = m.quoted.msg?.height || ''
            m.quoted.width = m.quoted.msg?.width || ''
            if (/webp/i.test(m.quoted.mime)) {
               m.quoted.isAnimated = m?.quoted?.msg?.isAnimated || false
            }
         }
         m.quoted.reply = (text, options = {}) => {
            return m.reply(text, { quoted: m.quoted, ...options })
         }
         m.quoted.download = (filepath) => {
            if (filepath) return conn.downloadMediaMessage(m.quoted, filepath)
            else return conn.downloadMediaMessage(m.quoted)
         }
      }
   }
   return m
}