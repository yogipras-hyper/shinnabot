import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

export default {
    cmd: ['s', 'sticker'],
    tags: ['sticker'],
    help: [ 's', 'sticker'],
    exec: async function (m, conn, {args}) {
       let stiker = false
        try {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || q.mediaType || ''
            if (/webp|image|video/g.test(mime)) {
            if (/video/g.test(mime)) if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
            let img = await q.download?.()
            if (!img) return m.reply(`balas gambar/video/stiker dengan perintah ${usedPrefix + command}`)
            let out
            try {
                stiker = await sticker(img, false, global.exif.packname, global.exif.author)
            } catch (e) {
                console.error(e)
            } finally {
                if (!stiker) {
                if (/webp/g.test(mime)) out = await webp2png(img)
                else if (/video/g.test(mime)) out = await uploadFile(img)
                if (!out || typeof out !== 'string') out = await uploadImage(img)
                stiker = await sticker(false, out, global.exif.packname, global.exif.author)
                }
            }
            } else if (args[0]) {
            if (isUrl(args[0])) stiker = await sticker(false, args[0], global.exif.packname, global.exif.author)
            else return m.reply('URL tidak valid!')
            }
        } catch (e) {
            console.error(e)
            if (!stiker) stiker = e
        } finally {
            if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            else m.reply('Conversion failed')
        }
    }
}