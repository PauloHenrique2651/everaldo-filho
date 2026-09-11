import sharp from 'sharp';
import { readdir, mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const source = 'assets/source-frames';
const guitarSource = 'assets/guitar-source-frames';
const audioSource = process.argv[2];
if (!audioSource) throw new Error('Informe o caminho do MP3 como primeiro argumento.');
const frames = (await readdir(source)).filter(f=>f.endsWith('.jpg')).sort();
const guitarFrames = (await readdir(guitarSource)).filter(f=>f.endsWith('.jpg')).sort();
await mkdir('public/media/frames', {recursive:true});
await mkdir('public/media/frames-mobile', {recursive:true});
await mkdir('public/media/guitar-frames', {recursive:true});
await mkdir('public/media/guitar-frames-mobile', {recursive:true});
for (let i=0; i<frames.length; i+=5) {
  await Promise.all(frames.slice(i,i+5).map(async f=> {
    await sharp(path.join(source,f)).resize({width:1440}).webp({quality:77}).toFile(path.join('public/media/frames',f.replace('.jpg','.webp')));
    await sharp(path.join(source,f)).resize({width:800}).webp({quality:73}).toFile(path.join('public/media/frames-mobile',f.replace('.jpg','.webp')));
  }));
}
for (let i=0; i<guitarFrames.length; i+=5) {
  await Promise.all(guitarFrames.slice(i,i+5).map(async f=> {
    await sharp(path.join(guitarSource,f)).resize({width:1440}).webp({quality:77}).toFile(path.join('public/media/guitar-frames',f.replace('.jpg','.webp')));
    await sharp(path.join(guitarSource,f)).resize({width:800}).webp({quality:73}).toFile(path.join('public/media/guitar-frames-mobile',f.replace('.jpg','.webp')));
  }));
}
await sharp(path.join(source,frames[0])).resize({width:1600}).webp({quality:85}).toFile('public/media/hero.webp');
await sharp(path.join(source,frames[74])).resize({width:1300}).webp({quality:84}).toFile('public/media/method.webp');
await sharp(path.join(guitarSource,guitarFrames[49])).resize({width:1600}).webp({quality:85}).toFile('public/media/guitar-focus.webp');
await copyFile(audioSource,'public/media/guitar-solo.mp3');
await writeFile('public/media/frames.json',JSON.stringify({performance:{count:frames.length,desktop:'frames',mobile:'frames-mobile'},guitar:{count:guitarFrames.length,desktop:'guitar-frames',mobile:'guitar-frames-mobile'}}));
console.log('Prepared audio, posters, '+frames.length+' performer frames and '+guitarFrames.length+' guitar frames in two resolutions.');
