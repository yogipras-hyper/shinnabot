import { jidDecode } from "@whiskeysockets/baileys"
import util from 'util'

export default {
    cmd: ['tagall'],
    help: ['tagall'],
    tags: ['group'],
    admin: true,
    group: true,
    exec: async (m, conn, { args, cmd }) => {
        try {
            const groupMembers = (await conn.groupMetadata(m.chat)).participants
            let type = m.quoted ? m.quoted.mtype : m.mtype
            if (cmd == 'hidetag') {
                let text = args.join(' ')
                if (/image|video|audio|sticker/i.test(type)) {
                    let ms = m.quoted ? m.getQuotedObj() : m
                    await conn.copyNForward(m.chat, conn.cMod(m.chat, ms, text, client.user.id), true, { mentions: groupMembers.map(x => x.id) })
                } else {
                    conn.sendMessage(m.chat, { text, mentions: groupMembers.map(x => x.id) })
                }
            } else {
                let text = args.length >= 1 ? `@${jidDecode(m.sender).user} : ${args.join(' ')}\n` : '*Tag All Members*\n'
                let n = 1
                for (let i of groupMembers) {
                    text += `\n*_${n}_.* @${jidDecode(i.id).user}`
                    n++
                }

                if (/image|video/i.test(type)) {
                    let ms = m.quoted ? m.getQuotedObj() : m
                    await conn.copyNForward(m.chat, conn.cMod(m.chat, ms, text, conn.user.id), true, { mentions: groupMembers.map(x => x.id) })
                } else {
                    conn.sendMessage(m.chat, { text, mentions: groupMembers.map(x => x.id) })
                }

            }
        } catch (error) {
            m.reply(util.format(error))
            console.log(error);
        }
    }
}