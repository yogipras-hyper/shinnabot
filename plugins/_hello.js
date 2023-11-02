export default {
    before: true,
    exec: async function(m, conn, {cmd}) {
        if ((m.mtype === 'groupInviteMessage' || m.text.startsWith('https://chat') || m.text.startsWith('Buka tautan ini')) && !m.isBaileys && !m.isGroup) {
            m.reply(`emoh izin sek`.trim())
            conn.sendContact(m.chat, global.option.owner, m)
        }

        let reg = /(ass?alam|اَلسَّلاَمُ عَلَيْكُمْ|السلام عليکم)/i
        if (reg.test(m.body)) {
            m.reply(`وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ\n_wa\'alaikumussalam wr.wb._`)
        }

    }
}