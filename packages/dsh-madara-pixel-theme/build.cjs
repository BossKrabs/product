const fs=require('fs'),path=require('path');const dir=__dirname;
const font=(family,file,format,mime)=>'@font-face{font-family:"'+family+'";src:url(data:'+mime+';base64,'+fs.readFileSync(path.join(dir,'assets',file)).toString('base64')+') format("'+format+'");font-weight:400;font-style:normal;font-display:swap;}';
const css=font('Madara Silkscreen','Silkscreen-Regular.ttf','truetype','font/ttf')+font('Madara Fusion Pixel','fusion-pixel-12px-proportional-zh-Hans.woff2','woff2','font/woff2')+font('Madara Fusion Pixel Mono','fusion-pixel-12px-monospaced-zh-Hans.woff2','woff2','font/woff2')+fs.readFileSync(path.join(dir,'theme.css'),'utf8')+fs.readFileSync(path.join(dir,'boot.css'),'utf8');
const art='data:image/png;base64,'+fs.readFileSync(path.join(dir,'assets/madara-foreground.png')).toString('base64');
const boot=fs.readFileSync(path.join(dir,'boot.js'),'utf8').replace('/* MADARA_FOREGROUND_VALUE */',()=>JSON.stringify(art));
const client=fs.readFileSync(path.join(dir,'client.template.js'),'utf8').replace('/* CSS_VALUE */',()=>JSON.stringify(css)).replace('/* TOKENS_VALUE */',()=>JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir,'tokens.json'),'utf8')))).replace('/* BOOT_VALUE */',()=>boot);
fs.writeFileSync(path.join(dir,'client.js'),client);console.log('Standalone Madara theme built.');
