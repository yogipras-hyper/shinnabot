import { toDataURL } from 'qrcode'

export default {
    cmd: ['qrcode', 'qr'],
    help: ['qrcode', 'qr'],
    tags: ['tools'], 
    exec: async function (m, conn, { args }) { 
        let text = args.join(' ')
        if (!text) return m.reply('mana teks nya cok?')
        conn.sendFile(m.chat, await toDataURL(`${text}`, { scale: 8 }), 'qrcode.png', '¯\\_(ツ)_/¯', m)
    }
}