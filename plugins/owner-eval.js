import syntaxerror from 'syntax-error'
import util from 'util'
import axios from 'axios'
import fs from 'fs'

export default {
    customPrefix: ['>'],
    tags: ['owner'],
    help: ['>'],
    owner: true,
    exec: async function(m, conn, { msg, args }) {
        await conn.presenceSubscribe(m.chat)
        await conn.sendPresenceUpdate('composing', m.chat)
            let _return;
            let _syntax = '';
            let _text = m.body.slice(2);
            try {
                let i = 15
                let exec = new (async () => { }).constructor('print', 'msg', 'conn', 'm', 'axios', 'fs', 'exec', _text);
                _return = await exec.call(conn, (...args) => {
                    if (--i < 1) return
                    console.log(...args)
                    return m.reply(util.format(...args))
                }, msg, conn, m, axios, fs, exec);
            } catch (e) {
                _return = e
            } finally {
                m.reply(_syntax + util.format(_return))
            }
    }
}