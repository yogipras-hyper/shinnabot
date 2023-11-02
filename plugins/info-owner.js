export default {
    cmd: ['owner', 'creator'],
    tags: ['info'],
    help: ['owner', 'creator'],
    exec: async (m, conn ) => {
        conn.sendContact(m.chat, global.option.owner, m)
    }
}