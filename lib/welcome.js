import { createCanvas, loadImage } from 'canvas';
import fs from "fs";
//Canvas.registerFont(`../font/edo.ttf`, { family: "edo" });
const __dirname = new URL('.', import.meta.url).pathname;

export async function goodbye(name, member, profile) {
const canvas = createCanvas(1920, 1080)
const ctx = canvas.getContext('2d')
let background = await loadImage("https://telegra.ph/file/92de3c47330ad6bcd16fe.jpg");
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
const image = await loadImage(`${__dirname}/aset/goodbye.png`)
ctx.drawImage(image, 0, 0, canvas.width, canvas.height )
// Draw cat with lime helme

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.strokeStyle = "#ffff";
        ctx.arc(245, 465, 200, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        const avatar = await loadImage(profile);
        ctx.rotate(-13 * Math.PI / 180);
        ctx.drawImage(avatar, -90, 274, 450, 450);
        ctx.restore();

/*const image = await Canvas.loadImage('bg.png')
ctx.drawImage(image, 0, 0, canvas.width, canvas.height )*/

       let usrname = name;
        let names = usrname.length > 15? usrname.substring(0, 15) + "..." : usrname;
        ctx.globalAlpha = 1;
        ctx.font = "70px 'edo'";
        ctx.textAlign = 'left';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(names, 700, 925);
    
        ctx.font = "700 40px Courier New";
        ctx.textAlign = 'left';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${member}th member`, 700, 1035);
        return canvas
}

export async function welcome(name, profile, groupname, member) {
const canvas = createCanvas(1920, 1080)
const ctx = canvas.getContext('2d')
let background = await loadImage('https://telegra.ph/file/92de3c47330ad6bcd16fe.jpg');
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
const image = await loadImage(`${__dirname}/aset/bg.png`)
ctx.drawImage(image, 0, 0, canvas.width, canvas.height )
// Draw cat with lime helme

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.strokeStyle = "#ffff";
        ctx.arc(245, 465, 200, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        const avatar = await loadImage(profile);
        ctx.rotate(-13 * Math.PI / 180);
        ctx.drawImage(avatar, -90, 274, 450, 450);
        ctx.restore();

/*const image = await Canvas.loadImage('bg.png')
ctx.drawImage(image, 0, 0, canvas.width, canvas.height )*/

       let usrname = name;
        let names = usrname.length > 15 ? usrname.substring(0, 15) + "..." : usrname;
        ctx.globalAlpha = 1;
        ctx.font = "70px 'edo'";
        ctx.textAlign = 'left';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(names, 700, 925);
      
ctx.save();
        let usrname2 = groupname;
        let name2 = usrname2.length > 10 ? usrname2.substring(0, 10) + "..." : usrname2;
        ctx.font = "700 150px Courier New";
        ctx.globalAlpha = 1;
        ctx.textAlign = 'center';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(name2, 1210, 700);

        ctx.font = "700 40px Courier New";
        ctx.textAlign = 'left';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${member}th member`, 700, 1035);
ctx.restore();

return canvas
}
