export default {
    cmd: ['join'],
    help: ['join + help'],
    tags: ['group'],
    owner: true,
    exec: async function(m, conn, { args }) {
        let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i
        let text = args.join(' ')
        if(!text) return m.reply('mana textnya?')
        let [_, code, expired] = text.match(linkRegex) || []
        if (!code) return m.reply('Link invalid')
        let res = await conn.groupAcceptInvite(code)
        m.reply(`Berhasil join grup ${res}`)
    }
}