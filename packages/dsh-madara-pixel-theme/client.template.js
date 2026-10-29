window.__ModuleLoader__.load({
  id: 'dsh-madara-pixel-theme',
  factory: (require) => {
    const React=require('react');
    const CSS=/* CSS_VALUE */;
    const TOKENS=/* TOKENS_VALUE */;
    /* BOOT_VALUE */
    const KEY='dsh.madara-pixel-theme.preferences.v1';
    function apply(ctx){
      const defaults={enabled:true,texture:true,pixelFont:true,bootAnimation:true};
      let prefs={...defaults};
      try {const saved=JSON.parse(localStorage.getItem(KEY)||'{}');for(const key of Object.keys(defaults))if(typeof saved[key]==='boolean')prefs[key]=saved[key];}catch{}
      const subscribers=new Set();
      let removeTokens=null,removeBoot=null,disposed=false,previousTheme=null,autoTimer=null;
      const style=document.createElement('style');style.dataset.plugin='dsh-madara-pixel-theme';
      style.textContent=CSS+'\nbody[data-dsh-madara-theme="on"][data-dsh-madara-texture="on"] .Dc7zOa_root[data-phase="hero"]::before{background-image:url("'+PIXEL_MADARA_ART+'")}';
      function save(){try{localStorage.setItem(KEY,JSON.stringify(prefs));}catch{}}
      function clearBody(){delete document.body.dataset.dshMadaraTheme;delete document.body.dataset.dshMadaraTexture;delete document.body.dataset.dshMadaraFont;}
      function playBoot(){if(disposed||!prefs.enabled)return;removeBoot?.();removeBoot=mountPixelBoot({onClose:()=>{removeBoot=null;}});}
      function update(patch={}){
        Object.assign(prefs,patch);
        if(!prefs.enabled||!prefs.bootAnimation)removeBoot?.();
        if(prefs.enabled){
          if(!removeTokens){previousTheme=ctx.theme.getTheme().preference;removeTokens=ctx.theme.overrideTokens('dsh-madara-pixel-theme',TOKENS);}
          document.body.dataset.dshMadaraTheme='on';document.body.dataset.dshMadaraTexture=prefs.texture?'on':'off';document.body.dataset.dshMadaraFont=prefs.pixelFont?'on':'off';
          if(ctx.theme.getTheme().preference!=='dark')ctx.theme.setTheme('dark');
        }else{
          removeTokens?.();removeTokens=null;clearBody();if(previousTheme){ctx.theme.setTheme(previousTheme);previousTheme=null;}
        }
        save();for(const listener of subscribers)listener({...prefs});
      }
      function autoBoot(){if(disposed||document.hidden||window.__dshMadaraPixelBootPlayed)return;window.__dshMadaraPixelBootPlayed=true;if(prefs.enabled&&prefs.bootAnimation)playBoot();}
      function Settings(){
        const [value,setValue]=React.useState({...prefs});React.useEffect(()=>{subscribers.add(setValue);return()=>subscribers.delete(setValue);},[]);const e=React.createElement;
        const toggle=(key,label)=>e('button',{type:'button',className:'madara-theme-control','aria-pressed':value[key],onClick:()=>update({[key]:!prefs[key]})},label+(value[key]?'：开':'：关'));
        return e('section',{className:'madara-theme-settings','aria-label':'宇智波斑像素主题'},
          e('div',{className:'madara-theme-settings-title'},e('span',null,'宇智波斑 · 像素主题'),e('span',{className:'madara-theme-settings-caption'},'MADARA / 01')),
          e('p',{className:'madara-theme-settings-note'},'深蓝背景、暗红盔甲与金色高亮。首页人物背景、像素字体和约三秒启动动画可独立关闭。'),
          e('div',{className:'madara-theme-settings-actions'},toggle('enabled','界面主题'),toggle('texture','首页人物与点阵'),toggle('pixelFont','像素字体'),toggle('bootAnimation','启动动画'),e('button',{type:'button',className:'madara-theme-control',disabled:!value.enabled,onClick:playBoot},'重播动画')));
      }
      ctx.effect(()=>{document.head.appendChild(style);update();autoTimer=setTimeout(autoBoot,80);document.addEventListener('visibilitychange',autoBoot);return()=>{disposed=true;clearTimeout(autoTimer);document.removeEventListener('visibilitychange',autoBoot);removeBoot?.();removeTokens?.();style.remove();clearBody();if(previousTheme)ctx.theme.setTheme(previousTheme);subscribers.clear();};},'madara-pixel-theme: scoped theme');
      ctx.slots.inject('settings.general.item',()=>ctx.slots.register({name:'settings.general.item',id:'madara-pixel-theme',order:9},Settings));
    }
    return {name:'madara-pixel-theme',inject:['theme','slots'],apply};
  }
});
