export default {
    cmd: ['ssweb', 'screenshotweb'],
    help: ['ssweb', 'screenshotweb'].map(v => v + ' <url>'),
    tags: ['internet'],
    exec: async (m, conn, {args}) => {
        try {
            conn.react(m.chat, global.emoji.loading, m)
            const teks = args.join(' ')
            if (!teks) return m.reply('mana linknya?')
            if (!teks.match(/(htt?p|http?s)/i)) return m.reply('bukan url!! kalau itu url awali dengan http/https')
            await conn.sendFile(m.chat, `https://www.screenia.best/api/screenshot?url=${teks}&type=png`, 'ssweb.jpg', 'done', m)
            conn.react(m.chat, global.emoji.done, m)
        } catch (e) {
            m.reply(e.error)
            conn.react(m.chat, global.emoji.gagal, m)
        }
    }
}