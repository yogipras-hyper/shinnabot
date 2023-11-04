import { DisconnectReason } from "@whiskeysockets/baileys"
import connect from "../lib/connection.js"
import { Boom } from "@hapi/boom"
import '../config.js'
//import { welcome, goodbye } from '../lib/welcome.js'

export async function connectionUpdate(update) {
    //refrensi dari hisoka-clone di hisoka.js
   const { lastDisconnect, connection, qr } = update

      if (connection) {
         console.info(`Connection Status : ${connection}`)
      }

      const qrs = { 'qr': qr}
      console.log(qrs)
      if (connection === "close") {
         let reason = new Boom(lastDisconnect?.error)?.output.statusCode
         if (reason === DisconnectReason.badSession) {
            console.log(`Bad Session File, Please Delete Session and Scan Again`)
            process.send('reset')
         } else if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed, reconnecting....")
            await connect()
         } else if (reason === DisconnectReason.connectionLost) {
            console.log("Connection Lost from Server, reconnecting...")
            await connect()
         } else if (reason === DisconnectReason.connectionReplaced) {
            console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First")
            process.exit(1)
         } else if (reason === DisconnectReason.loggedOut) {
            console.log(`Device Logged Out, Please Scan Again And Run.`)
            process.exit(1)
         } else if (reason === DisconnectReason.restartRequired) {
            console.log("Restart Required, Restarting...")
            await connect()
         } else if (reason === DisconnectReason.timedOut) {
            console.log("Connection TimedOut, Reconnecting...")
            process.send('reset')
         } else if (reason === DisconnectReason.multideviceMismatch) {
            console.log("Multi device mismatch, please scan again")
            process.exit(0)
         } else {
            console.log(reason)
            process.send('reset')
         }
      }
}

export async function participantsUpdate({ id, participants, action }) {
   try {
      const metadata = await this.groupMetadata(id)

      // participants
      for (const jid of participants) {
         // get profile picture user
         let profile
         try {
            profile = await this.profilePictureUrl(jid, "image")
         } catch {
            profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu"
         }

         // action
         if (action == "add") {
            try {
            /*welcome(this.getName(jid), profile, metadata.subject, metadata.participants.length).then((v) => {
               this.sendFile(id, v.toBuffer(), 'pp.jpg', `Welcome @${jid.split("@")[0]} to "${metadata.subject}"`, null, false, {
                              contextInfo: {
                                    mentionedJid: [jid]
                              }
                           })
            })*/
         } catch (e) {
            throw e
         }
         } else if (action == "remove") {
            /*goodbye(this.getName(jid), metadata.participants.length, profile).then((v) => {
               this.sendFile(id, v.toBuffer(), 'pp.jpg', `Goodbye @${jid.split("@")[0]} from "${metadata.subject}"`, null, false, {
                              contextInfo: {
                                 mentionedJid: [jid]
                              }
                            })
            })
         }*/
      }
   } catch (e) {
      throw e
   }
}
