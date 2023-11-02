import '../lib/connection.js'
import { randomBytes } from 'crypto'

export default {
    tags: ['owner'],
    cmd: ['bcgc', 'broadcastgroup'],
    help: ['bcgc', 'broadcastgroup'].map(v => v + ' <your text>'),
    owner: true,
    exec: async function (m, conn, { args }) {
        const text = args.join(' ')
        const delay = time => new Promise(res => setTimeout(res, time))
        let getGroups = await conn.groupFetchAllParticipating()
        let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
        let anu = groups.map(v => v.id)
        let pesan = m.quoted && m.quoted.text ? m.quoted.text : text
        if(!pesan) throw 'teksnya?'
        m.reply(`Mengirim Broadcast Ke ${anu.length} Chat, Waktu Selesai ${anu.length * 0.5} detik`)
        for (let i of anu) {
            await delay(500)
            await conn.sendMessage(i, { text: pesan }).catch(_ => _)
        }
    m.reply(`Sukses Mengirim Broadcast Ke ${anu.length} Group`)

    }
}

