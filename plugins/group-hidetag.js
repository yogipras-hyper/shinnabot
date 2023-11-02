import { generateWAMessageFromContent } from "@whiskeysockets/baileys"

export default {
    cmd: ['hidetag'],
    help: ['hidetag'],
    tags: ['group'],
    admin: true,
    group: true,
    exec: async function (m, conn, {command, usedPrefix}) {
            const quoted = m.isQuoted ? m.quoted : m
            let mentions = m.metadata.participants.map(a => a.id)
            let mod = await conn.cMod(m.chat, quoted, /hidetag|tag|ht|h|totag/i.test(quoted.body.toLowerCase().replace('.hidetag', ' ')) ? quoted.body.toLowerCase().replace('.hidetag', ' ') : quoted.body.replace('.hidetag', ' '))
            conn.sendMessage(m.chat, { forward: mod, mentions })
        }
}