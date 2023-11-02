import uploadImage from '../lib/uploadImage.js'
import uploadFile from '../lib/uploadFile.js'

export default {
    cmd: ['upload'],
    help: ['upload'],
    tags: ['tools'],
    exec: async function (m, conn){
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw 'No media found'
        let media = await q.download()
        let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
        let link = await (isTele ? uploadImage : uploadFile)(media)
        m.reply('nih linknya: ' + link)
        m.reply(media)
    }
}