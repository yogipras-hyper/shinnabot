import axios from 'axios'
import { JSDOM } from 'jsdom'

async function tiktokdl(url) {
	try {
		const data = await axios('https://lovetik.com/api/ajax/search', {
			method: 'post',
			data: 'query=' + encodeURIComponent(url)
		})
		return {
			cover: data.data.cover,
			name: data.data.author,
			links: data.data.links[0].a
		}
	} catch (e) {
		console.log(e)
	}
}

async function fbdl(link) {
	try {
		const data = await axios('https://www.getfvid.com/downloader', {
				method: 'post',
				data: 'url=' + encodeURIComponent(link)
			})
			const dwn = []
			const dom = new JSDOM(data.data).window.document
			const result = dom.querySelector('.btns-download p a')
            return result.href
		} catch (e) {
			return e
		}
}

export {
    fbdl,
    tiktokdl
}