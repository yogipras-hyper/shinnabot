export default async function Case(m, conn, command, quoted, msg) {
    switch (command) {
        case 'test': {
            m.reply('ok')
        } break
    }
}