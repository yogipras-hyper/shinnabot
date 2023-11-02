import { fbdl, tiktokdl } from "../lib/scraping.js"

const command = [
    'fbdl', 
    'fb', 
    'fbdownload',
    'tt',
    'ttdl',
    'ttdownload'
]

export default {
    cmd: command,
    help: command.map(v=> v + ' <url>'),
    tags: ['downloader'],
    exec: async function(m, conn, { args, cmd, msg}) {
        const teks = args.join(' ')
        switch(cmd) {
            case 'fbdl':
            case 'fbdownload':
            case 'fb': {
                conn.react(m.chat, global.emoji.loading, m)
                m.reply('otw')

                if (!teks) return m.reply('mana linknya?')
                let api = await fbdl(teks)
                conn.sendFile(m.chat, api, 'file.mp4', 'nih', m, false)
                conn.react(m.chat, global.emoji.done, m)
            }
            break

            case 'tt':
            case 'ttdl':
            case 'ttdownload': {
                conn.react(m.chat, global.emoji.loading, m)
                m.reply('otw')
                if (!teks) return m.reply('mana linknya?')
                let api2 = await tiktokdl(teks)
                conn.sendFile(m.chat, api2.links, 'file.mp4', 'nih', m, false)
                conn.react(m.chat, global.emoji.done, m)
            }
            break
            default:
        } 
        
    }
}

