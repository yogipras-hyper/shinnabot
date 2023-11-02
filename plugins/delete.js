 export default {
    tags: [''],
    cmd: ['del', 'delete'],
    help: ['delete'],
    owner: true,
    exec: (m, conn,) => {
        if (!m.quoted && !m.quoted.fromMe) return m.reply('reply pesan dari bot')
        conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } })
    }
}
