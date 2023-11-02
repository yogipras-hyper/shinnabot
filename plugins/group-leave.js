export default {
    cmd: ['leave', 'lv'],
    help: ['leave'].map(v => v + ' (bot harus ada di group)'),
    tags: ['group'],
    admin: true,
    group: true,
    exec: async (m, conn) => await conn.groupLeave(m.chat)
}