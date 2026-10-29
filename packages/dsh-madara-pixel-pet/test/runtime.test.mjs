import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {normalize,prepareRuntime,createController} from '../index.js';

test('runtime uses its own assets and leaves upstream files intact',()=>{
  const dependency=resolve('node_modules/dsh-dafeiyu');
  const source=join(dependency,'assets/pet-manifest.json');
  const before=createHash('sha256').update(readFileSync(source)).digest('hex');
  const runtime=prepareRuntime({dependencyRoot:dependency,runtimeRoot:resolve('.runtime/tests')});
  assert.ok(existsSync(runtime.command));assert.equal(runtime.args.length,0);
  const own=JSON.parse(readFileSync(join(runtime.command,'../assets/pet-manifest.json'),'utf8'));
  assert.equal(own.characterId,'uchiha-madara-pixel');assert.equal(Object.keys(own.clips).length,16);
  assert.equal(createHash('sha256').update(readFileSync(source)).digest('hex'),before);
  assert.ok(runtime.env.DSH_DAFEIYU_LAYOUT_PATH.endsWith('madara-pixel-pet/layout.json')||runtime.env.DSH_DAFEIYU_LAYOUT_PATH.endsWith('tests\\layout.json'));
});

test('task events, settings and disposal are isolated from Harness',()=>{
  let changed,unwatched=false;const messages=[],stops=[];
  class FakeBridge{constructor(options){this.options=options;}start(){}send(value){messages.push(value);}stop(value){stops.push(value);}}
  let current={enabled:true};
  const settings={get:()=>current,watch(fn){changed=fn;return()=>{unwatched=true;}},update:async()=>{}};
  const controller=createController({logger:{warn(){}}},settings,{command:'unused',env:{}},{HelperProcess:FakeBridge,CompanionReducer:RealReducer});
  const session={id:'test-madara',project:{name:'local-test'}};
  controller.event(session,{type:'turn/start',seq:1});assert.ok(messages.some(m=>m.kind==='state'&&m.state==='THINKING'));
  controller.event(session,{type:'tool/call',seq:2,data:{name:'web_search',callId:'c1',message:{name:'web_search',source:{callId:'c1'}}}});assert.ok(messages.some(m=>m.state==='WORKING'));
  current={...current,scale:1.2};changed(current);assert.ok(messages.some(m=>m.kind==='config'&&m.scale===1.2));assert.equal(stops.length,0);
  controller.sessionDisposed(session);changed({enabled:false});assert.equal(stops.length,1);
  controller.dispose();assert.equal(unwatched,true);
});

test('configuration values stay within supported ranges',()=>{
  assert.equal(normalize({scale:5}).scale,1.4);assert.equal(normalize({bubbleScale:0.01}).bubbleScale,0.8);assert.equal(normalize({activityLevel:'invalid'}).activityLevel,'normal');
});

import {CompanionReducer as RealReducer} from 'dsh-dafeiyu';

test('packaged native helper loads the Madara frames and closes on disposal',{timeout:30000},async()=>{
  const {HelperProcess}=await import('dsh-dafeiyu');
  const runtime=prepareRuntime({runtimeRoot:resolve('.runtime/native-test')});
  const bridge=new HelperProcess({...runtime,env:{...runtime.env,QT_QPA_PLATFORM:'offscreen',DSH_DAFEIYU_SOUND_ENABLED:'0'},logFile:null},{});
  const child=bridge.start();let output='';child.stdout.on('data',b=>output+=b);
  const waitFor=async value=>{const deadline=Date.now()+20000;while(!output.includes(value)){assert.equal(child.exitCode,null,'helper exited early');if(Date.now()>deadline)throw Error('Native handshake timed out');await new Promise(r=>setTimeout(r,35));}};
  try{await waitFor('"ready"');bridge.send({protocolVersion:1,kind:'state',timestamp:Date.now(),state:'WORKING',message:'Madara local verification'});bridge.send({protocolVersion:1,kind:'ping',timestamp:Date.now()});await waitFor('"pong"');}finally{bridge.stop('test-disposed');}
  await new Promise((resolveExit,reject)=>{if(child.exitCode!==null){resolveExit();return;}const timeout=setTimeout(()=>reject(Error('Native helper failed to stop')),5000);child.once('exit',()=>{clearTimeout(timeout);resolveExit();});});
  assert.equal(child.exitCode,0);
});
