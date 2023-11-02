import NodeCache from 'node-cache'
import readline from 'readline'
import open from 'open'
import pino from 'pino'
const { 
	default: makeWASocket,
	fetchLatestBaileysVersion, 
	makeCacheableSignalKeyStore, 
	makeInMemoryStore, 
	useMultiFileAuthState, 
} = (await import('@whiskeysockets/baileys')).default
import { connectionUpdate, participantsUpdate } from '../event/index.js'
import { connect } from '../main.js'
import { Client } from './allfunction.js'
import { msgUpsrt } from '../event/messages.js'
const usePairingCode = process.argv.includes('--use-pairing-code')
const useMobile = process.argv.includes('--mobile')

const logger = pino({ level: 'debug' })
// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
const msgRetryCounterCache = new NodeCache()

// Read line interface
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise ((resolve) => rl.question(text, resolve))

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
global.store = makeInMemoryStore({ logger })
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store?.writeToFile('./baileys_store_multi.json')
}, 10_000)

const connection = async () => {
	const { state, saveCreds } = await useMultiFileAuthState('session')
	// fetch latest version of WA Web
	const { version, isLatest } = await fetchLatestBaileysVersion()
	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

	global.conn = makeWASocket({
		version,
		logger,
		printQRInTerminal: !usePairingCode,
		mobile: useMobile,
		auth: {
			creds: state.creds,
			/** caching makes the store faster to send/recv messages */
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
		msgRetryCounterCache,
		generateHighQualityLinkPreview: true,
		// ignore all broadcast messages -- to receive the same
		// comment the line below out
		// shouldIgnoreJid: jid => isJidBroadcast(jid),
		// implement to handle retries & poll updates
        browser: ['Chrome (Shinna)', '', ''], // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
        markOnlineOnConnect: true, // set false for offline
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)

            return msg?.message || ""
        },
        defaultQueryTimeoutMs: undefined,
	})

	store?.bind(conn.ev)
    conn.connUpdate = connectionUpdate.bind(global.conn)
	conn.handler = msgUpsrt.bind(global.conn)
	conn.participantsUpdate = participantsUpdate.bind(global.conn)

	conn.ev.on("group-participants.update", conn.participantsUpdate)
    conn.ev.on("connection.update", conn.connUpdate)
    conn.ev.on("creds.update", saveCreds)
	conn.ev.on('messages.upsert', conn.handler)

	new Client({ conn, store })

	const database = (new (await import("./database.js")).default())
         const content = await database.read()
         if (content && Object.keys(content).length === 0) {
            global.db = {
               users: {},
               groups: {},
			   settings: {},
               ...(content || {}),
            }
            await database.write(global.db)
         } else {
            global.db = content
		}

		setInterval(async () => {
      		if (global.db) await database.write(global.db)
   		}, 30000) // write database every 30 seconds

	return global.conn
}

export default connection