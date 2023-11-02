export default {
    before: true,
    exec: async function(m) {
         if (m.chat.endsWith('broadcast') || m.fromMe || m.isGroup ) return
        let user = global.db.users[m.sender]
        if (new Date - user.pc < 86400000) return // setiap 24 jam sekali
        await m.reply(`
    Hai ${conn.getName(m.sender)},
    
${user.banned ? 'kamu dibanned' : `Ada yang bisa saya bantu?`}
    `.trim())
        user.pc = new Date * 1
    }
}
