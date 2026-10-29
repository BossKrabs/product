import {createRequire} from 'node:module';
import {readFileSync,existsSync,mkdirSync,copyFileSync,cpSync,renameSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname,join,resolve} from 'node:path';
import {homedir} from 'node:os';
import {fileURLToPath} from 'node:url';
import Schema from '@deepseek-ai/schemastery';
import {CompanionReducer,HelperProcess} from 'dsh-dafeiyu';
import {createSettingsScope} from './settings-scope.js';

const require=createRequire(import.meta.url),root=dirname(fileURLToPath(import.meta.url));
const pkg=JSON.parse(readFileSync(join(root,'package.json'),'utf8'));
export const name='madara-pixel-pet';
export const inject=['sessions','settings'];
const defaults={enabled:true,scale:1,bubbleScale:1,activityLevel:'normal',reducedMotion:false,soundEnabled:true,bubbleMode:'always',includeSubagents:false};
export const Config=Schema.object({
  enabled:Schema.boolean().default(true).description('启用宇智波斑桌宠'),
  scale:Schema.number().min(0.55).max(1.4).step(0.05).default(1).role('slider').description('角色大小'),
  bubbleScale:Schema.number().min(0.8).max(1.2).step(0.05).default(1).role('slider').description('气泡大小'),
  activityLevel:Schema.union(['quiet','normal','lively']).default('normal').description('空闲动作频率'),
  reducedMotion:Schema.boolean().default(false).description('减少动态'),
  soundEnabled:Schema.boolean().default(true).description('任务完成或出错提示音'),
  bubbleMode:Schema.union(['always','hidden','custom']).default('always').description('气泡显示'),
  includeSubagents:Schema.boolean().default(false).description('显示子任务状态'),
}).description('像素风宇智波斑桌面伴侣');
for(const [key,field] of Object.entries(Config.dict))Config.dict[key]=field.volatile();
export function normalize(value={}){
  const c={...defaults,...value};
  c.scale=Math.min(1.4,Math.max(0.55,Number(c.scale)||1));c.bubbleScale=Math.min(1.2,Math.max(0.8,Number(c.bubbleScale)||1));
  if(!['quiet','normal','lively'].includes(c.activityLevel))c.activityLevel='normal';if(!['always','hidden','custom'].includes(c.bubbleMode))c.bubbleMode='always';
  for(const key of ['enabled','reducedMotion','soundEnabled','includeSubagents'])c[key]=typeof c[key]==='boolean'?c[key]:defaults[key];
  return c;
}
export function runtimeHome(env=process.env){return join(env.DSH_HOME||join(homedir(),'.dsh'),'plugins','madara-pixel-pet');}
export function prepareRuntime(options={}){
  const dependencyRoot=options.dependencyRoot||dirname(require.resolve('dsh-dafeiyu/package.json'));
  const base=options.runtimeRoot||runtimeHome();
  const directory=join(base,pkg.version),manifest=join(root,'assets','pet-manifest.json');
  const digest=createHash('sha256').update(readFileSync(manifest)).digest('hex');
  const executable=join(directory,'madara-pixel-pet-helper.exe');
  const original=join(dependencyRoot,'runtime','bin','win32-x64','dsh-dafeiyu-helper.exe');
  mkdirSync(directory,{recursive:true});
  if(!existsSync(executable)||statSync(executable).size!==statSync(original).size){const temporary=executable+'.new';copyFileSync(original,temporary);renameSync(temporary,executable);}
  const marker=join(directory,'skin.sha256');
  if(!existsSync(marker)||readFileSync(marker,'utf8')!==digest){
    const assets=join(directory,'assets');mkdirSync(assets,{recursive:true});
    cpSync(join(root,'assets','pet'),join(assets,'pet'),{recursive:true});
    for(const file of ['sounds','cursors','cursor_grab.cur','cursor_grabbing.cur']){const source=join(dependencyRoot,'assets',file);if(existsSync(source))cpSync(source,join(assets,file),{recursive:true});}
    copyFileSync(manifest,join(assets,'pet-manifest.json.new'));renameSync(join(assets,'pet-manifest.json.new'),join(assets,'pet-manifest.json'));
    // Write the marker only after all runtime assets are present.
    const bytes=Buffer.from(digest);const fs=require('node:fs');fs.writeFileSync(marker,bytes);
  }
  return {command:executable,args:[],tempDirectory:join(base,'tmp'),logFile:join(base,'helper.log'),env:{DSH_DAFEIYU_LAYOUT_PATH:join(base,'layout.json')}};
}
export function createController(ctx,settings,runtime,engine={HelperProcess,CompanionReducer}){
  let bridge=null,reducer=null,disposed=false;
  const logger=ctx.logger||console;
  const message=(kind,data={})=>({protocolVersion:1,kind,timestamp:Date.now(),...data});
  const launch=(config)=>{
    if(disposed||bridge||!config.enabled)return;
    reducer=new engine.CompanionReducer({includeSubagents:config.includeSubagents});
    bridge=new engine.HelperProcess({...runtime,env:{...runtime.env,DSH_DAFEIYU_SCALE:String(config.scale),DSH_DAFEIYU_BUBBLE_SCALE:String(config.bubbleScale),DSH_DAFEIYU_REDUCED_MOTION:config.reducedMotion?'1':'0',DSH_DAFEIYU_SOUND_ENABLED:config.soundEnabled?'1':'0'},onSettingsChange:patch=>{void Promise.resolve(settings.update?.(patch)).catch(error=>logger.warn?.('像素斑设置未能保存',error));}},logger);
    bridge.start();bridge.send(message('hello',{host:'deepseek-harness',pluginVersion:pkg.version}));bridge.send(message('state',{state:'IDLE',message:'等待新的任务',detail:'HARNESS · 像素宇智波斑'}));
  };
  const stop=()=>{bridge?.stop('madara-pet-disabled');bridge=null;reducer=null;};
  const configure=(value)=>{
    const next=normalize(value);if(!next.enabled){stop();return;}launch(next);if(!bridge)return;
    Object.assign(bridge.options.env,{DSH_DAFEIYU_SCALE:String(next.scale),DSH_DAFEIYU_BUBBLE_SCALE:String(next.bubbleScale),DSH_DAFEIYU_ACTIVITY_LEVEL:next.activityLevel,DSH_DAFEIYU_REDUCED_MOTION:next.reducedMotion?'1':'0',DSH_DAFEIYU_SOUND_ENABLED:next.soundEnabled?'1':'0',DSH_DAFEIYU_BUBBLE_MODE:next.bubbleMode});
    for(const m of reducer.setIncludeSubagents(next.includeSubagents))bridge.send(m);
    bridge.send(message('config',{...next,soundStates:['SUCCESS','ERROR'],bubbleStates:['SUCCESS','ERROR','WAITING'],openUrl:'dsh://open',openLabel:'打开 Harness'}));
  };
  const event=(session,event)=>{if(!bridge||!reducer)return;try{for(const m of reducer.handle(session,event))bridge.send(m);}catch(error){logger.warn?.('像素斑未能处理任务事件',error);}};
  const sessionDisposed=session=>{if(!bridge||!reducer)return;try{for(const m of reducer.disposeSession(session))bridge.send(m);}catch(error){logger.warn?.('像素斑未能移除任务状态',error);}};
  const unwatch=settings.watch(configure);configure(settings.get());
  return {event,sessionDisposed,configure,dispose(){disposed=true;unwatch?.();stop();}};
}
export function apply(ctx,config={}){
  if(process.platform!=='win32'||process.arch!=='x64'){ctx.logger?.warn?.('当前版本仅支持 Windows x64 原生桌宠。');return;}
  ctx.effect(()=>{
    let controller,settings,offEvent,offDisposed;
    try{
      settings=createSettingsScope(ctx,Config,config,normalize);
      controller=createController(ctx,settings,prepareRuntime());
      offEvent=ctx.on('session/event',controller.event,{global:true});offDisposed=ctx.on('session/disposed',controller.sessionDisposed,{global:true});
    }catch(error){controller?.dispose();settings?.dispose?.();ctx.logger?.error?.('宇智波斑桌宠本次未能启动',error);return;}
    return()=>{offEvent?.();offDisposed?.();controller.dispose();settings.dispose?.();};
  },'madara-pixel-pet: native companion');
}
