import { smsg } from "../lib/allfunction.js"
import chalk from 'chalk'

export async function msgUpsrt(msg) {
      if (!msg)
        return
      try {
         const mek = msg.messages[0]
         const m = await smsg(this, mek)
         global.prefix = m.prefix
         const usedPrefix = `${prefix}`
         const isCmd = this.isCmd = m.body.startsWith(prefix)
         const command = isCmd ? m.command.toLowerCase() : ""
         const quoted = m.isQuoted ? m.quoted : m
         const cmd = this.cmd = isCmd ? m.body.slice(1).trim().split(/ +/).shift().toLowerCase() : null
         const arg = m.body.substring(m.body.indexOf(' ') + 1)
         const args = m.body.trim().split(/ +/).slice(1)
         let groupMetadata = (m.isGroup ? (conn.chats[m.chat] || {}).metadata : {}) || {}
         let participants = (m.isGroup ? groupMetadata.participants : []) || []
         let usrr = global.db.users[m.sender]

          if (m.message && !m.isBaileys) {
            console.log(chalk.black(chalk.bgWhite("- FROM:")),
               chalk.black(chalk.bgGreen(m.pushName)),
               chalk.black(chalk.yellow(m.sender)) + ' ' + chalk.black(chalk.bgWhite("- IN:")),
               chalk.black(chalk.bgGreen(m.isGroup ? 'Group: ' + m.metadata.subject : "Private Chat", m.from)) + ' ' + chalk.black(chalk.bgWhite("- MESSAGE")),
               chalk.black(chalk.bgGreen(m.body || m.type)))
         }

         //gunanya? ntah kurang tau
//wkwkw bercanda
//gunanya agar bisa menulis database dan 
//tidak muncul eror pada saat menulis database

   const isNumber = x => typeof x === "number" && !isNaN(x)
   const isBoolean = x => typeof x === "boolean" && Boolean(x)
   let user = global.db.users[m.sender]
   if (typeof user !== "object") global.db.users[m.sender] = {}
   if (user) {
        if (!isBoolean(user.premium)) user.premium = m.isOwner ? true : false
        if (!isBoolean(user.VIP)) user.VIP = m.isOwner ? true : false
        if (!("lastChat" in user)) user.lastChat = new Date * 1
        if (!("name" in user)) user.name = m.pushName
        if (!isBoolean(user.banned)) user.banned = false
   } else {
        global.db.users[m.sender] = {
            lastChat: new Date * 1,
            premium: m.isOwner ? true : false,
            VIP: m.isOwner ? true : false,
            name: m.pushName,
            banned: false,
            afk: false,
            afkTime: -1,
            afkReason: ''
        }
    }

    if (m.isGroup) {
        let group = global.db.groups[m.from]
        if (typeof group !== "object") global.db.groups[m.from] = {}
        if (group) {
            if (!isBoolean(group.mute)) group.mute = false
            if (!isNumber(group.lastChat)) group.lastChat = new Date * 1
            if (!isBoolean(group.welcome)) group.welcome = true
            if (!isBoolean(group.leave)) group.leave = true
        } else {
            global.db.groups[m.chat] = {
                lastChat: new Date * 1,
                mute: false,
                welcome: true,
                leave: true
            }
        }
    }

         await (await import(`../case/index.js?v=${Date.now()}`)).default(m, this, cmd, quoted, msg)

         for (let name in global.plugins) {
            let plugin = global.plugins[name]
            //for plugin
            if (plugin.cmd && plugin.cmd.includes(cmd)) {
               //selagi bisa jalan kenapa engga 😂😂
               if (!usrr.banned === false) return 
               let turn = plugin.cmd instanceof Array
                  ? plugin.cmd.includes(cmd)
                  : plugin.cmd instanceof String
                     ? plugin.cmd == cmd
                     : false
               if (!turn) continue
               if (typeof plugin.admin != 'undefined' && plugin.admin && !m.isAdmin && m.isGroup) {
                  m.reply('Perintah Ini Khusus Admin!!')
                  continue
               } else if (typeof plugin.botAdmin != 'undefined' && plugin.botAdmin && !m.isBotAdmin && m.isGroup) {
                  m.reply('Bot bukan admin :(')
                  continue
               } else if (typeof plugin.group != 'undefined' && plugin.group && !m.isGroup) {
                  m.reply('Perintah Ini Khusus Di Group!!')
                  continue
               } else if (typeof plugin.owner != 'undefined' && plugin.owner && !m.isOwner) {
                  m.reply('Perintah Ini Khusus Owner')
                  continue
               }
               await plugin.exec(m, this, { command, plugin, prefix, usedPrefix, args, arg, cmd, msg, participants })
               break
            } else if (plugin.customPrefix && m.body.startsWith(plugin.customPrefix)) {
               if (typeof plugin.owner != 'undefined' && plugin.owner && !m.isOwner) return
               if (typeof plugin.admin != 'undefined' && plugin.admin && !m.isAdmin) return
               if (typeof plugin.botAdmin != 'undefined' && plugin.botAdmin && !m.isBotAdmin) return
               if (typeof plugin.group != 'undefined' && plugin.group && !m.isGroup) return
               //if (typeof plugin.groupMuteAllowed == 'undefined' && isGroupMsg && groupData.mute) return
               await plugin.exec(m, this, { command, plugin, prefix, usedPrefix, args, arg, cmd, msg, participants })
            } else if (plugin.before) {
               await plugin.exec(m, this, { command, plugin, prefix, usedPrefix, args, arg, cmd, msg, participants })
            }
         }
         if (Object.keys(global.db.settings).length === 0) {
            global.db.settings = {
               autoread: false,
            }
         }

         //for autoread
         let setting = global.db.settings
         if (setting.autoread === true) {
            await this.readMessages([m.key])
         }
         if (m.isBaileys) return
         m.exp += Math.ceil(Math.random() * 10)


      } catch (err) {
         console.log(err)
      }
}

