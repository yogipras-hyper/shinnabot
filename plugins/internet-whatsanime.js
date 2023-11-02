import axios from 'axios'
import uploadImage from '../lib/uploadImage.js'

export default {
    cmd: ['whanime', 'whatanime', 'whatsanime'],
    help: ['whanime', 'whatanime', 'whatsanime'].map(v => v + ' <reply your image>'),
    tags: ['internet'],
    exec: async function (m, conn){
        conn.react(m.chat, global.emoji.loading, m)
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw 'No media found'
        let isTele = /image\/(png|jpe?g|gif)|\/mp4/.test(mime)
        if (!isTele) return m.reply('image or gif only')
        let media = await q.download()
        let link = await uploadImage(media)
        let api = await axios.get('https://api.trace.moe/search?url=' + link)
        let _api = api.data.result[0]
        let text = `title: ${_api.filename}
episode: ${_api.episode}

        `.trim()
        conn.sendFile(m.chat, _api.image,  'img.jpg', text, m)
        conn.sendFile(m.chat, _api.video, 'result.gif', 'video', m)
        conn.react(m.chat, global.emoji.done, m)
    }
}