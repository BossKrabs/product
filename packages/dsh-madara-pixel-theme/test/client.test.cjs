const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
test('theme enables, skips intro, saves settings and disposes cleanly',{timeout:30000},async()=>{
 const root=path.resolve(__dirname,'..');let browser,ws,session,seq=0;const pending=new Map();
 const fixture=`<!doctype html><meta charset="utf-8"><button id="underlying">underlying</button><script>
 const cleanups=[];window.fixture={ready:false,theme:'light',overrides:0};
 const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useState:v=>[v,()=>{}],useEffect:()=>{}};
 window.__ModuleLoader__={load:({factory})=>{const p=factory(()=>React);fixture.plugin=p;const ctx={theme:{getTheme:()=>({preference:fixture.theme}),setTheme:v=>fixture.theme=v,overrideTokens:()=>{fixture.overrides++;return()=>fixture.overrides--;}},effect:fn=>cleanups.push(fn()),slots:{inject:(_,fn)=>fn(),register:(_,component)=>fixture.component=component}};p.apply(ctx);fixture.dispose=()=>cleanups.forEach(fn=>fn());fixture.buttons=()=>fixture.component().children.flatMap(c=>c?.children||[]).filter(c=>c?.type==='button');fixture.press=s=>fixture.buttons().find(b=>String(b.children[0]).startsWith(s)).props.onClick();fixture.ready=true;}};
 </script><script src="/client.js"></script>`;
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type',req.url==='/client.js'?'text/javascript':'text/html;charset=utf-8');res.end(req.url==='/client.js'?fs.readFileSync(path.join(root,'client.js')):fixture);});
 const command=(method,params={},sid=session)=>new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error(method+' timed out'));},8000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));});
 const evaluate=async expression=>{const r=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
 const waitFor=async expression=>{const deadline=Date.now()+8000;while(!(await evaluate(expression))){if(Date.now()>deadline)throw Error(expression);await new Promise(r=>setTimeout(r,35));}};
 try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+path.join(root,'.runtime/browser'),'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
  const endpoint=await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(Error('Browser endpoint unavailable')),10000);browser.stderr.on('data',b=>{output+=b;const m=output.match(/DevTools listening on (ws:\/\/\S+)/);if(m){clearTimeout(timer);resolve(m[1]);}});});
  ws=new WebSocket(endpoint);await new Promise(r=>ws.addEventListener('open',r,{once:true}));ws.addEventListener('message',e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);});
  const {targetId}=await command('Target.createTarget',{url:'about:blank'},null);({sessionId:session}=await command('Target.attachToTarget',{targetId,flatten:true},null));await command('Page.enable');
  await command('Page.navigate',{url:'http://127.0.0.1:'+server.address().port});await waitFor('fixture.ready');await waitFor('!!document.querySelector(".madara-pixel-boot[open]")');
  assert.equal(await evaluate('document.body.dataset.dshMadaraTheme'),'on');assert.equal(await evaluate('fixture.theme'),'dark');assert.equal(await evaluate('fixture.overrides'),1);
  assert.equal(await evaluate('getComputedStyle(document.body).getPropertyValue("--madara-night").trim()'),'#111827');
  assert.equal(await evaluate('document.querySelectorAll("[data-plugin=dsh-madara-pixel-theme]").length'),1);
  await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await command('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await waitFor('!document.querySelector(".madara-pixel-boot")');
  await evaluate('fixture.press("启动动画")');assert.equal(await evaluate('JSON.parse(localStorage.getItem("dsh.madara-pixel-theme.preferences.v1")).bootAnimation'),false);
  await evaluate('fixture.press("像素字体")');assert.equal(await evaluate('document.body.dataset.dshMadaraFont'),'off');
  await evaluate('fixture.press("界面主题")');assert.equal(await evaluate('document.body.hasAttribute("data-dsh-madara-theme")'),false);assert.equal(await evaluate('fixture.theme'),'light');assert.equal(await evaluate('fixture.overrides'),0);
  await evaluate('fixture.press("界面主题");fixture.press("重播动画")');assert.equal(await evaluate('!!document.querySelector(".madara-pixel-boot[open]")'),true);
  await evaluate('fixture.dispose()');assert.equal(await evaluate('document.querySelectorAll(".madara-pixel-boot,[data-plugin=dsh-madara-pixel-theme]").length'),0);assert.equal(await evaluate('fixture.theme'),'light');assert.equal(await evaluate('fixture.overrides'),0);
 }finally{
  if(ws?.readyState===WebSocket.OPEN){try{await command('Browser.close',{},null);}catch{}ws.close();}
  for(const p of pending.values())clearTimeout(p.timer);server.close();if(browser?.exitCode===null)browser.kill();
 }
});
