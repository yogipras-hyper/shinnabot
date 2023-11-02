import { exec } from 'child_process'
import util from 'util'

export default {
    tags: ['owner'],
    customPrefix: ['$'],
    args: ['args'],
    help: ['$'],
    owner: true,
    exec: async (m, client, { body, msg, args }) => {
        try {
            await client.presenceSubscribe(m.chat)
            await client.sendPresenceUpdate('composing', m.chat)
            exec(m.body.slice(2), (err, stdout) => {
                if (err) return m.reply(`${err}`)
                if (stdout) m.reply(`${stdout}`)
            })
        } catch (error) {
            m.reply(util.format(error))
            console.log(error);
        }
    }
}