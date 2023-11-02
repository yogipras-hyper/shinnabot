export default {
    cmd: ['enable', 'disable'],
    help: ['enable', 'disable'].map(v => v + ' options'),
    tags: ['owner'],
    exec: async function(m, conn, { usedPrefix, command, args }) {
        let isEnable = /true|enable|(turn)?on|1/i.test(command)
        let data = global.db.settings
        let type = (args[0] || '').toLowerCase()
        switch (type) {
            case 'autoread': {
                if (!m.isOwner) return m.reply('khusus owner!!')
                data.autoread = isEnable
                m.reply(isEnable? 'Auto Read Aktif' : 'Auto Read Dinonaktifkan')
            } break        }
    }
  
}