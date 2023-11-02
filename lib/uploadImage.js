import fetch from 'node-fetch';
import data from 'form-data';
const FormData = data;
import pkg from 'file-type';
const { fromBuffer } = pkg;

/**
 * Upload image to telegra.ph
 * Supported mimetype:
 * - `image/jpeg`
 * - `image/jpg`
 * - `image/png`s
 * @param {Buffer} buffer Image Buffer
 * @return {Promise<string>}
 */
export default async buffer => {
 const { ext } = await fromBuffer(buffer)
  let form = new FormData
  form.append('file', buffer, 'tmp.' + ext)
  let res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form
  })
  let img = await res.json()
  if (img.error) throw img.error
  return 'https://telegra.ph' + img[0].src
}