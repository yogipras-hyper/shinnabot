import { webp2png, webp2mp4 } from '../lib/webp2mp4.js'

export default {
    cmd: ['toimg'],
    tags: ['sticker'],
    help: ['toimg'],
    exec: async function(m, conn, { prefix, command }) {
         const quoted = m.isQuoted ? m.quoted : m
        if (!/webp/i.test(quoted.mime)) return m.reply(`Reply Sticker with command ${prefix + command}`)
                if (quoted.isAnimated) {
                    let media = await webp2mp4((await quoted.download()))
                    await m.reply(media)
                }
                const media = await conn.downloadMediaMessage(m.quoted)
                await conn.sendMessage(m.chat, { image: media, jpegThumbnail: media }, { quoted: m })
        }
}