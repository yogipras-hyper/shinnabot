
export default { 
    cmd: ['afk'],
    help: ['afk reason'],
    tags: ['group'],
    exec: async function(m, conn, { args }) {
        let text = args.join(' ')
        let user = global.db.users[m.sender]
            user.afk = true
            user.afkTime = + new Date
            user.afkReason = text? text : ''
            conn.sendMessage(m.chat, { text: `${m.pushName} Telah Afk${text ? ': ' + text : ''}` })
    }
}