var y=[{model:"xs",dtype:"f16",resolution:{w:384,h:216},skipFrames:2},{model:"small",dtype:"f16",resolution:{w:384,h:216},skipFrames:1},{model:"medium",dtype:"f16",resolution:{w:512,h:288},skipFrames:1},{model:"large",dtype:"f32",resolution:{w:640,h:360},skipFrames:0},{model:"xl",dtype:"f32",resolution:{w:1280,h:720},skipFrames:0}];var _e=false;function Te(a){_e=a;}function x(a){let t=`[longpipe/${a}]`,e=((...r)=>{_e&&console.log(t,...r);});return e.warn=(...r)=>{_e&&console.warn(t,...r);},e}var T=x("adaptive"),sr=2e3,ur=1e4,pr=30,lr=20,cr=5e3,dr=.3,fr=15e3,G=class{constructor(t){this.opts=t;this.currentPresetIdx=y.findIndex(e=>e.model===t.initialModel),this.lastSwapAt=performance.now();}opts;timer=null;currentPresetIdx;lastSwapAt=0;overshootStart=0;headroomStart=0;start(){T(`started; backend=${this.opts.backendKind} initial=${this.opts.initialModel} idx=${this.currentPresetIdx}`),this.timer=setInterval(()=>{this.tick().catch(t=>T("tick failed:",t));},sr);}stop(){this.timer&&clearInterval(this.timer),this.timer=null;}async tick(){if(typeof document<"u"&&document.hidden)return;let t=performance.now();if(t-this.lastSwapAt<ur)return;let e=await this.opts.getStats();if(e.fps<lr?(this.overshootStart===0&&(this.overshootStart=t),t-this.overshootStart>=cr&&this.tryDowngrade(e.fps)):this.overshootStart=0,this.opts.backendKind==="webgpu"&&e.modelMs>0){let r=1e3/pr*dr;e.modelMs<r?(this.headroomStart===0&&(this.headroomStart=t),t-this.headroomStart>=fr&&this.tryUpgrade(e.modelMs,r)):this.headroomStart=0;}}tryDowngrade(t){if(this.currentPresetIdx<=0)return;let e=this.currentPresetIdx-1;T(`downgrade ${y[this.currentPresetIdx].model} \u2192 ${y[e].model} (fps=${t})`),this.swap(e);}tryUpgrade(t,e){if(this.currentPresetIdx>=y.length-1)return;let r=this.currentPresetIdx+1;T(`upgrade ${y[this.currentPresetIdx].model} \u2192 ${y[r].model} (modelMs=${t.toFixed(1)} < ${e.toFixed(1)})`),this.swap(r);}async swap(t){let e=y[t];this.lastSwapAt=performance.now(),this.overshootStart=0,this.headroomStart=0;try{let r=await this.opts.fetchWeights(e.model);await this.opts.swapPreset(e.model,r),this.currentPresetIdx=t,T(`swap to ${e.model} done`);}catch(r){T("swap failed:",r),this.opts.onError?.({message:`adaptive preset swap failed: ${r.message??String(r)}`,source:"adaptive",recoverable:true,cause:r});}}};async function Ue(a){let t,e=false;if(a instanceof HTMLVideoElement){if(t=a.currentSrc||a.src,!t)throw new Error("background video: HTMLVideoElement has no src")}else if(a instanceof Blob)t=URL.createObjectURL(a),e=true;else if(typeof a=="string")t=a;else throw new Error("background video: unsupported input shape");let r=document.createElement("video");r.crossOrigin="anonymous",r.muted=true,r.loop=true,r.playsInline=true,r.src=t,await new Promise((c,f)=>{r.addEventListener("loadeddata",()=>c(),{once:true}),r.addEventListener("error",()=>f(new Error(`background video: failed to load ${t}`)),{once:true});});try{await r.play();}catch(c){throw new Error(`background video: play() rejected \u2014 ${c.message}`)}let n=new MessageChannel,i=n.port1,o=n.port2,s=false,u=r.requestVideoFrameCallback?.bind(r);if(u){let c=(f,h)=>{if(!s){try{let m=new VideoFrame(r,{timestamp:h.mediaTime*1e6});i.postMessage({frame:m},[m]);}catch{}u(c);}};u(c);}else {let c=()=>{if(!s){try{let f=new VideoFrame(r,{timestamp:performance.now()*1e3});i.postMessage({frame:f},[f]);}catch{}requestAnimationFrame(c);}};requestAnimationFrame(c);}return {port:o,transferList:[o],cleanup:()=>{s=true,i.close(),r.pause(),r.removeAttribute("src"),r.load(),e&&URL.revokeObjectURL(t);}}}var hr=4,be=8,We=16;async function F(a){if(typeof a=="string")return a==="none"?{background:{kind:"none"}}:a==="blur"?{background:{kind:"blur",sigma:be}}:{background:{kind:"image",bitmap:await Be(a)}};if(a instanceof ImageBitmap)return {background:{kind:"image",bitmap:a}};if(typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement)return {background:{kind:"image",bitmap:await createImageBitmap(a)}};if(typeof HTMLVideoElement<"u"&&a instanceof HTMLVideoElement)return await Ie(a);let t=a;if(t.color!==void 0)return {background:{kind:"color",rgb:gr(t.color)}};if(t.blur!==void 0)return {background:{kind:"blur",sigma:mr(t.blur)}};if(t.image!==void 0)return {background:{kind:"image",bitmap:await _r(t.image)}};if(t.video!==void 0)return await Ie(t.video);throw new Error(`background: unrecognized input shape \u2014 ${P(a)}`)}async function Ie(a){let t;if(typeof a=="string")t=a;else if(typeof HTMLVideoElement<"u"&&a instanceof HTMLVideoElement)t=a;else if(a&&typeof a=="object"&&"data"in a&&"type"in a)t=a.data instanceof Blob?a.data:new Blob([a.data],{type:a.type});else throw new Error(`background.video: unrecognized shape \u2014 ${P(a)}`);let e=await Ue(t);return {background:{kind:"video",port:e.port},transferList:e.transferList,cleanup:e.cleanup}}function gr(a){if(typeof a=="string"){let t=a.trim().replace(/^#/,"");if(/^[0-9a-fA-F]{6}$/.test(t))return [parseInt(t.slice(0,2),16)/255,parseInt(t.slice(2,4),16)/255,parseInt(t.slice(4,6),16)/255];if(/^[0-9a-fA-F]{3}$/.test(t))return [parseInt(t[0]+t[0],16)/255,parseInt(t[1]+t[1],16)/255,parseInt(t[2]+t[2],16)/255];throw new Error(`background.color: hex must be #rgb or #rrggbb, got ${P(a)}`)}if(!Array.isArray(a)||a.length!==3||!a.every(t=>typeof t=="number"&&Number.isFinite(t)&&t>=0&&t<=1))throw new Error(`background.color: expected hex string or [r, g, b] floats in [0, 1], got ${P(a)}`);return [a[0],a[1],a[2]]}function mr(a){if(a===true)return be;if("sigma"in a){if(typeof a.sigma!="number"||!Number.isFinite(a.sigma)||a.sigma<0)throw new Error(`background.blur.sigma must be a non-negative number, got ${a.sigma}`);return a.sigma}if("strength"in a){let t=a.strength;if(typeof t=="number"){let e=Math.max(0,Math.min(1,t));return We*e}if(t==="low")return hr;if(t==="medium")return be;if(t==="high")return We;throw new Error(`background.blur.strength must be 'low' | 'medium' | 'high' | number, got ${P(t)}`)}throw new Error(`background.blur: must be true, { strength }, or { sigma } \u2014 got ${P(a)}`)}async function _r(a){if(a instanceof ImageBitmap)return a;if(typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement)return createImageBitmap(a);if(typeof a=="string")return Be(a);if(a&&typeof a=="object"&&"data"in a&&"type"in a){let t=a.data instanceof Blob?a.data:new Blob([a.data],{type:a.type});return createImageBitmap(t)}throw new Error(`background.image: unrecognized shape \u2014 ${P(a)}`)}async function Be(a){let t=await fetch(a);if(!t.ok)throw new Error(`background: failed to load image from ${a} (HTTP ${t.status})`);let e=await t.blob();return createImageBitmap(e)}function P(a){return a===null?"null":typeof a!="object"?typeof a+"("+String(a)+")":`${a.constructor?.name??"Object"} ${JSON.stringify(a).slice(0,80)}`}function Se(){return {input:"MediaStreamTrackProcessor"in self?"mstp":"rvfc-postmessage",output:"MediaStreamTrackGenerator"in self?"mstg":br()?"transfer-capture":"bitmap-shuttle"}}var A=null;function br(){return A!==null||(A=!/Firefox/.test(navigator.userAgent)),A}function Ee(a){return a==="denoise"?{mode:"denoise",denoise:{}}:typeof a=="object"?{mode:"denoise",denoise:a.denoise}:{mode:a}}function Ge(a,t,e,r){let n=[a];return e.mode==="passthrough"?n.push(...t.getAudioTracks()):e.mode==="denoise"&&r&&n.push(r),new MediaStream(n)}var U={rnnoise:{wasm:"rnnoise.wasm",weights:null,scaleIn:32768,scaleOut:30517578125e-15,needsSimd:false,exports:{malloc:"malloc",create:"rn_create",process:"rn_process"}},dfn:{wasm:"dfn.wasm",weights:"dfn_weights.pack",scaleIn:1,scaleOut:1,needsSimd:true,exports:{malloc:"df_lite_malloc",create:"df_lite_create",process:"df_lite_process",setBeta:"df_lite_set_beta",setGruLeak:"df_lite_set_gru_leak"}},dfnint8:{wasm:"dfn.wasm",weights:"dfn_weights_int8.pack",scaleIn:1,scaleOut:1,needsSimd:true,exports:{malloc:"df_lite_malloc",create:"df_lite_create_i8",process:"df_lite_process",setBeta:"df_lite_set_beta",setGruLeak:"df_lite_set_gru_leak"}}},vr={high:"dfn",mid:"dfnint8",low:"rnnoise"},xr=["high","mid","low"];function wr(a){return xr.includes(a)}function Fe(a){return wr(a)?vr[a]:a}function Ae(a,t){return `${a.replace(/\/$/,"")}/${t}`}async function Me(a){let t=await fetch(a);if(!t.ok)throw new Error(`audio asset fetch failed: ${t.status} ${a}`);return t.arrayBuffer()}async function Oe(a,t){let e=U[a],[r,n]=await Promise.all([Me(Ae(t,e.wasm)),e.weights?Me(Ae(t,e.weights)):Promise.resolve(null)]);return {wasmBytes:r,weights:n}}function M(){try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,22,1,20,0,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11]))}catch{return  false}}var yr=1.3,kr=64,Pr=3,Cr=`
self.onmessage = async (e) => {
  const { wasmUrl, iters, rounds, budget } = e.data
  try {
    const res = await fetch(wasmUrl)
    if (!res.ok) throw new Error(res.status + ' ' + wasmUrl)
    const module = await WebAssembly.compile(await res.arrayBuffer())
    const imports = {}
    for (const im of WebAssembly.Module.imports(module)) {
      ;(imports[im.module] = imports[im.module] || {})
      if (im.kind === 'function') imports[im.module][im.name] = () => 0
    }
    const ex = new WebAssembly.Instance(module, imports).exports
    const best = (fn) => {
      fn(iters)                                   // warm up
      let b = Infinity
      for (let r = 0; r < rounds; r++) {
        const t = performance.now()
        fn(iters)
        b = Math.min(b, (performance.now() - t) / iters)
      }
      return b
    }
    const dfnMs = best(ex.calibrate_f32)
    const int8Ms = ex.calibrate_i8 ? best(ex.calibrate_i8) : Infinity
    const model = dfnMs <= budget ? 'dfn' : int8Ms <= budget ? 'dfnint8' : 'rnnoise'
    self.postMessage({ model, dfnMs, int8Ms })
  } catch (err) {
    self.postMessage({ error: (err && err.message) || String(err) })
  }
}
`;async function De(a,t){if(!M())return "rnnoise";let e=`${a.replace(/\/$/,"")}/${U.dfn.wasm}`,r=null,n=null;try{r=URL.createObjectURL(new Blob([Cr],{type:"application/javascript"})),n=new Worker(r);let i=await new Promise((o,s)=>{n.onmessage=u=>o(u.data),n.onerror=u=>s(new Error(u.message||"probe worker error")),n.postMessage({wasmUrl:e,iters:kr,rounds:Pr,budget:yr});});if(i.error)throw new Error(i.error);return i.model??"rnnoise"}catch(i){return t?.(`audio tier probe failed (${i.message??String(i)}); using rnnoise`),"rnnoise"}finally{n?.terminate(),r&&URL.revokeObjectURL(r);}}var ve='var b=Object.defineProperty;var y=(u,a,i)=>a in u?b(u,a,{enumerable:!0,configurable:!0,writable:!0,value:i}):u[a]=i;var r=(u,a,i)=>y(u,typeof a!="symbol"?a+"":a,i);var f={rnnoise:{wasm:"rnnoise.wasm",weights:null,scaleIn:32768,scaleOut:30517578125e-15,needsSimd:!1,exports:{malloc:"malloc",create:"rn_create",process:"rn_process"}},dfn:{wasm:"dfn.wasm",weights:"dfn_weights.pack",scaleIn:1,scaleOut:1,needsSimd:!0,exports:{malloc:"df_lite_malloc",create:"df_lite_create",process:"df_lite_process",setBeta:"df_lite_set_beta",setGruLeak:"df_lite_set_gru_leak"}},dfnint8:{wasm:"dfn.wasm",weights:"dfn_weights_int8.pack",scaleIn:1,scaleOut:1,needsSimd:!0,exports:{malloc:"df_lite_malloc",create:"df_lite_create_i8",process:"df_lite_process",setBeta:"df_lite_set_beta",setGruLeak:"df_lite_set_gru_leak"}}};var c=4096,m=class extends AudioWorkletProcessor{constructor(i){super();r(this,"cfg");r(this,"mem");r(this,"run");r(this,"state",0);r(this,"inPtr",0);r(this,"outPtr",0);r(this,"setBeta",null);r(this,"setGruLeak",null);r(this,"resample",!1);r(this,"rsPush",null);r(this,"inRs",0);r(this,"outRs",0);r(this,"rsDevInPtr",0);r(this,"rsOutPtr",0);r(this,"enabled");r(this,"model");r(this,"inAcc",new Float32Array(480));r(this,"inFill",0);r(this,"outRing",new Float32Array(4096));r(this,"outRead",0);r(this,"outWrite",0);r(this,"outCount",0);r(this,"primed",!1);r(this,"now");r(this,"times",new Float32Array(256));r(this,"tIdx",0);r(this,"hops",0);r(this,"_f32",null);let o=i.processorOptions;this.model=o.model,this.enabled=o.enabled,this.cfg=f[o.model];try{let t=this.instantiate(o.wasmBytes),e=n=>n?t[n]:void 0;this.mem=t.memory;let s=t[this.cfg.exports.malloc];if(this.run=t[this.cfg.exports.process],this.inPtr=s(480*4),this.outPtr=s(480*4),o.weights?this.state=t[this.cfg.exports.create](this.upload(s,o.weights),o.weights.byteLength):this.state=t[this.cfg.exports.create](),this.setBeta=e(this.cfg.exports.setBeta)??null,this.setGruLeak=e(this.cfg.exports.setGruLeak)??null,this.setBeta&&(o.postFilterBeta??0)>0&&this.setBeta(this.state,o.postFilterBeta),this.setGruLeak&&(o.gruLeak??1)<1&&this.setGruLeak(this.state,o.gruLeak),sampleRate!==48e3){let n=t.df_resampler_create;this.rsPush=t.df_resampler_push??null,n&&this.rsPush?(this.resample=!0,this.inRs=n(sampleRate,48e3),this.outRs=n(48e3,sampleRate),this.rsDevInPtr=s(256*4),this.rsOutPtr=s(c*4)):this.post({type:"error",message:`${o.model} can\'t resample ${sampleRate}\\u219248000 Hz; needs a 48 kHz AudioContext`})}}catch(t){let e=t;this.post({type:"error",message:`denoise init failed: ${e.message??String(t)}${e.stack?`\n`+e.stack:""}`})}this.now=typeof performance<"u"&&performance.now?()=>performance.now():null,this.port.onmessage=t=>{let e=t.data;e.type==="enabled"?this.enabled=e.value:e.type==="config"&&(this.setBeta&&e.postFilterBeta!=null&&this.setBeta(this.state,e.postFilterBeta),this.setGruLeak&&e.gruLeak!=null&&this.setGruLeak(this.state,e.gruLeak))},this.post({type:"ready"})}instantiate(i){var e;let o=new WebAssembly.Module(i),t={};for(let s of WebAssembly.Module.imports(o))t[e=s.module]??(t[e]={}),s.kind==="function"?t[s.module][s.name]=()=>0:s.kind==="memory"?t[s.module][s.name]=new WebAssembly.Memory({initial:256}):s.kind==="table"?t[s.module][s.name]=new WebAssembly.Table({initial:0,element:"anyfunc"}):s.kind==="global"&&(t[s.module][s.name]=new WebAssembly.Global({value:"i32",mutable:!1},0));return new WebAssembly.Instance(o,t).exports}upload(i,o){let t=new Uint8Array(o),e=i(t.length);return new Uint8Array(this.mem.buffer).set(t,e),e}heap(){return(!this._f32||this._f32.buffer!==this.mem.buffer)&&(this._f32=new Float32Array(this.mem.buffer)),this._f32}post(i){this.port.postMessage(i)}pushOut(i){this.outRing[this.outWrite]=i,this.outWrite=(this.outWrite+1)%this.outRing.length,this.outCount++}feed48k(i,o){for(let t=0;t<o;t++)this.inAcc[this.inFill++]=i[t],this.inFill===480&&(this.runHop(),this.inFill=0)}runHop(){let i=this.heap(),o=this.inPtr>>2;for(let e=0;e<480;e++)i[o+e]=this.inAcc[e]*this.cfg.scaleIn;let t=this.now?this.now():0;if(this.run(this.state,this.inPtr,this.outPtr),this.now&&(this.times[this.tIdx=this.tIdx+1&255]=this.now()-t),this.resample&&this.rsPush){let e=this.rsPush(this.outRs,this.outPtr,480,this.rsOutPtr,c);i=this.heap();let s=this.rsOutPtr>>2;for(let n=0;n<e;n++)this.pushOut(i[s+n])}else{let e=this.outPtr>>2;for(let s=0;s<480;s++)this.pushOut(i[e+s]*this.cfg.scaleOut)}++this.hops>=50&&(this.reportStats(),this.hops=0)}reportStats(){let i=Array.from(this.times).filter(e=>e>0).sort((e,s)=>e-s),o=e=>i.length?i[Math.min(i.length-1,Math.floor(e*i.length))]:null,t={model:this.model,p50Ms:this.now?o(.5):null,p95Ms:this.now?o(.95):null,latencyMs:this.outCount/sampleRate*1e3,active:this.enabled&&this.state!==0,sampleRate};this.post({type:"stats",stats:t})}process(i,o){let t=i[0]?.[0],e=o[0]?.[0];if(!e)return!0;let s=e.length;if(!t||!this.enabled||this.state===0)return t&&!this.enabled?e.set(t):e.fill(0),!0;if(this.resample&&this.rsPush){let n=this.heap(),g=this.rsDevInPtr>>2;for(let h=0;h<s;h++)n[g+h]=t[h];let d=this.rsPush(this.inRs,this.rsDevInPtr,s,this.rsOutPtr,c);n=this.heap(),this.feed48k(n.subarray(this.rsOutPtr>>2,(this.rsOutPtr>>2)+d),d)}else this.feed48k(t,s);if(!this.primed)if(this.outCount>=480)this.primed=!0;else return e.fill(0),!0;if(this.outCount>=s)for(let n=0;n<s;n++)e[n]=this.outRing[this.outRead],this.outRead=(this.outRead+1)%this.outRing.length,this.outCount--;else e.fill(0);return!0}};registerProcessor("denoise",m);\n';var Ur=.03,Wr=.995,O=class{constructor(t,e){this.opts=e;this.ctx=new AudioContext({sampleRate:48e3}),this.source=this.ctx.createMediaStreamSource(new MediaStream([t])),this.dest=this.ctx.createMediaStreamDestination(),this.outputTrack=this.dest.stream.getAudioTracks()[0],this.source.connect(this.dest),this.ready=this.init().catch(r=>{this.opts.onError?.(`audio denoise init failed: ${r.message??String(r)}`);});}opts;outputTrack;ready;ctx;source;dest;node=null;model=null;latestStats=null;destroyed=false;resolveExplicit(){let t=Fe(this.opts.model);return U[t].needsSimd&&!M()?(this.opts.onError?.(`${t} needs wasm SIMD; falling back to rnnoise`),"rnnoise"):t}async init(){let t=this.opts.model==="auto"?await De(this.opts.weightsBaseUrl,this.opts.onError):this.resolveExplicit();this.model=t;let e=await Oe(t,this.opts.weightsBaseUrl);if(await this.ctx.audioWorklet.addModule(Ir()),this.destroyed)return;let r={model:t,wasmBytes:e.wasmBytes,weights:e.weights,enabled:this.opts.enabled??true,postFilterBeta:this.opts.postFilterBeta??Ur,gruLeak:this.opts.gruLeak??Wr},n=new AudioWorkletNode(this.ctx,"denoise",{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1],processorOptions:r});n.port.onmessage=i=>{let o=i.data;o.type==="stats"?this.latestStats=o.stats:o.type==="error"?this.opts.onError?.(o.message):o.type==="ready"&&this.opts.onReady?.();},this.node=n,this.source.disconnect(this.dest),this.source.connect(n).connect(this.dest);}setEnabled(t){this.node?.port.postMessage({type:"enabled",value:t});}setConfig(t){this.node?.port.postMessage({type:"config",...t});}getStats(){return this.latestStats}destroy(){this.destroyed=true;try{this.node?.disconnect();}catch{}try{this.source.disconnect();}catch{}this.ctx.close();}};function Ir(){return URL.createObjectURL(new Blob([ve],{type:"application/javascript"}))}var D=x("worker_controller"),z=class{worker;listeners=new Map;persistentEvents=new Set;constructor(t){this.worker=t,this.worker.addEventListener("message",this.handleMessage.bind(this)),D("constructed; message listener attached");}handleMessage(t){let{request_id:e,res:r}=t.data,n=this.listeners.get(e);D("msg received: request_id=",e,"handler?",!!n,"persistent?",this.persistentEvents.has(e)),n&&(n(r),this.persistentEvents.has(e)||this.listeners.delete(e));}addPersistentListener(t,e){this.persistentEvents.add(t),this.listeners.set(t,e),D("addPersistentListener:",t);}removePersistentListener(t){this.persistentEvents.delete(t),this.listeners.delete(t);}sendMessage(t,e,r=[]){let n=crypto.randomUUID();return D("sendMessage:",t,"request_id=",n,"transferables=",r.length),new Promise(i=>{this.listeners.set(n,s=>i(s));let o={cmd:t,data:e,request_id:n};this.worker.postMessage(o,r);})}terminate(){this.worker.terminate(),this.listeners.clear(),this.persistentEvents.clear();}};var ze=x("input-postmessage/main");function Re(a){let t=document.createElement("video");t.srcObject=a,t.muted=true,t.autoplay=true,t.playsInline=true,t.play().catch(l=>{ze.warn("video.play() rejected:",l);});let e=t.requestVideoFrameCallback?.bind(t);if(!e)throw new Error("setupPostMessageInput: requestVideoFrameCallback not supported on this browser");let r=new MessageChannel,n=r.port1,i=r.port2,o=false,s=(l,c)=>{if(!o){try{let f=new VideoFrame(t,{timestamp:c.mediaTime*1e6});n.postMessage({frame:f},[f]);}catch(f){ze.warn("VideoFrame() failed; skipping frame:",f);}e(s);}};return e(s),{port:i,transferList:[i],cleanup:()=>{o=true,n.close(),t.srcObject=null,t.pause();}}}function He(a){let t=a.getVideoTracks();if(t.length===0)throw new Error("setupMstpInput: input MediaStream has no video tracks");let e=t[0],r=self.MediaStreamTrackProcessor;if(!r)throw new Error("setupMstpInput: MediaStreamTrackProcessor not supported on this browser");let i=new r({track:e}).readable;return {readable:i,transferList:[i],cleanup:()=>{i.cancel().catch(()=>{});}}}function Le(a,t){switch(a){case "mstp":{let e=He(t);return {initFields:{inputReadable:e.readable},transferList:e.transferList,cleanup:e.cleanup}}case "rvfc-postmessage":{let e=Re(t);return {initFields:{inputPort:e.port},transferList:e.transferList,cleanup:e.cleanup}}}}var Br=x("bitmap-shuttle/main"),Sr=30;function Ve(a,t=Sr){let e=document.createElement("canvas");e.width=a.w,e.height=a.h;let r=e.getContext("bitmaprenderer");if(!r)throw new Error("setupBitmapShuttleOutput: bitmaprenderer context not available");let i=e.captureStream(t).getVideoTracks();if(i.length===0)throw new Error("setupBitmapShuttleOutput: captureStream produced no video tracks");let o=i[0],s=new MessageChannel,u=s.port1,l=s.port2,c=false,f=null,h=()=>{},m=3,w=0;return u.onmessage=B=>{if(c){if(w++,w<m){B.data.bmp.close();return}h();}try{r.transferFromImageBitmap(B.data.bmp);}catch(v){Br.warn("transferFromImageBitmap failed:",v);}},u.start(),{videoTrack:o,port:l,transferList:[l],startPassthrough:B=>{if(c)return;c=true;let v=document.createElement("video");v.srcObject=B,v.muted=true,v.playsInline=true,v.play().catch(()=>{}),f=v;let S="requestVideoFrameCallback"in v?C=>{v.requestVideoFrameCallback(C);}:C=>{requestAnimationFrame(C);},E=()=>{if(c){if(v.videoWidth===0){S(E);return}createImageBitmap(v,{resizeWidth:e.width,resizeHeight:e.height,resizeQuality:"medium"}).then(C=>{if(!c){C.close();return}try{r.transferFromImageBitmap(C);}catch{}S(E);}).catch(()=>{S(E);});}};S(E),h=()=>{c=false,f&&(f.srcObject=null,f.pause(),f=null);};},cleanup:()=>{h(),u.onmessage=null,u.close(),o.stop();}}}function Ne(){let a=self.MediaStreamTrackGenerator;if(!a)throw new Error("setupMstgOutput: MediaStreamTrackGenerator not supported on this browser");let t=new a({kind:"video"}),e=t.writable;return {videoTrack:t,writable:e,transferList:[e],cleanup:()=>{e.abort().catch(()=>{}),t.stop();}}}function $e(a,t=30){let e=document.createElement("canvas");e.width=a.w,e.height=a.h;let n=e.captureStream(t).getVideoTracks();if(n.length===0)throw new Error("setupTransferCaptureOutput: captureStream produced no video tracks");let i=n[0],o=e.transferControlToOffscreen();return {videoTrack:i,canvas:o,transferList:[o],cleanup:()=>{i.stop();}}}function je(a,t){switch(a){case "mstg":{let e=Ne();return {videoTrack:e.videoTrack,initFields:{outputWritable:e.writable},transferList:e.transferList,cleanup:e.cleanup}}case "transfer-capture":{let e=$e(t);return {videoTrack:e.videoTrack,initFields:{outputCanvas:e.canvas},transferList:e.transferList,cleanup:e.cleanup}}case "bitmap-shuttle":{let e=Ve(t);return {videoTrack:e.videoTrack,initFields:{outputPort:e.port},transferList:e.transferList,startPassthrough:e.startPassthrough,cleanup:e.cleanup}}}}var xe=`var Fo=Object.defineProperty;var Eo=(u,t,r)=>t in u?Fo(u,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):u[t]=r;var a=(u,t,r)=>Eo(u,typeof t!="symbol"?t+"":t,r);var xt=!1;function Ct(u){xt=u}function S(u){let t=\`[longpipe/\${u}]\`,r=((...e)=>{xt&&console.log(t,...e)});return r.warn=(...e)=>{xt&&console.warn(t,...e)},r}var yt=[{model:"xs",dtype:"f16",resolution:{w:384,h:216},skipFrames:2},{model:"small",dtype:"f16",resolution:{w:384,h:216},skipFrames:1},{model:"medium",dtype:"f16",resolution:{w:512,h:288},skipFrames:1},{model:"large",dtype:"f32",resolution:{w:640,h:360},skipFrames:0},{model:"xl",dtype:"f32",resolution:{w:1280,h:720},skipFrames:0}],Do={fast:0,balanced:2,quality:4};function q(u){return u==="auto"?null:yt[Do[u]]}var K=class{constructor(t,r,e,i){a(this,"op");this.op=t.ops.BilinearUpsample(r,{outH:e,outW:i})}get output(){return this.op.output}run(){this.op.run()}};var Y=class{constructor(t,r,e,i){a(this,"op");this.op=t.ops.BicubicUpsample(r,{outH:e,outW:i})}get output(){return this.op.output}run(){this.op.run()}};var Q=class{constructor(t,r,e,i,o="main"){a(this,"presenter");this.presenter=t.presenters.CompositeSolid(r,e,i,o)}run(){this.presenter.run()}};var J=class{constructor(t,r,e,i,o="main"){a(this,"presenter");this.presenter=t.presenters.CompositeImage(r,e,i,o)}run(){this.presenter.run()}};var Z=class{constructor(t,r,e){a(this,"downs",[]);a(this,"ups",[]);let i=Oo(e),o=r;for(let n=0;n<i;n++){let s=t.ops.BilinearUpsample(o,{outH:Math.max(1,Math.floor(o.h/2)),outW:Math.max(1,Math.floor(o.w/2))});this.downs.push(s),o=s.output}for(let n=i-1;n>=1;n--){let s=this.downs[n-1].output,p=t.ops.BilinearUpsample(o,{outH:s.h,outW:s.w});this.ups.push(p),o=p.output}}get output(){return this.ups.length>0?this.ups[this.ups.length-1].output:this.downs[0].output}run(){for(let t of this.downs)t.run();for(let t of this.ups)t.run()}};function Oo(u){let t=Math.max(1,3*u);return Math.max(2,Math.min(6,Math.round(Math.log2(t))))}var Io=.05,ee=class{constructor(t,r,e,i,o="main"){a(this,"blur");a(this,"presenter");i<=Io?(this.blur=null,this.presenter=t.presenters.CompositeImage(r,e,r,o)):(this.blur=new Z(t,r,i),this.presenter=t.presenters.CompositeImageBilinear(r,e,this.blur.output,o))}run(){this.blur?.run(),this.presenter.run()}};var te=class{constructor(t){a(this,"backend",t);a(this,"displayInput");a(this,"image");a(this,"network",null);a(this,"networkInput",null);a(this,"upscaler",null);a(this,"upscalerMode","bilinear");a(this,"bgConfig",{mode:"solid",color:[0,0,0]});a(this,"compositors",new Map);let r=t.canvas;this.displayInput=t.ops.Input(r.height,r.width),this.image=this.displayInput.output}attachNetwork(t,r,e){this.network=t,this.networkInput=r,this.upscalerMode=e.upscaler,this.bgConfig=e.background,this.upscaler=this.makeUpscaler(),this.compositors.clear()}hasNetwork(){return this.network!==null}setSource(t){this.networkInput?.setSource(t),this.displayInput.setSource(t)}setUpscaler(t){t!==this.upscalerMode&&(this.upscalerMode=t,this.network&&(this.upscaler=this.makeUpscaler(),this.compositors.clear()))}setBackground(t){this.bgConfig=t}run(){this.runModel(),this.runDisplay()}runDisplay(){this.refreshDisplayInput(),this.compositeMain(!1)}runPassthrough(){this.refreshDisplayInput(),this.compositeMain(!0)}compositeMain(t){this.compositeTo("main",t?{mode:"passthrough"}:this.bgConfig)}refreshDisplayInput(){this.displayInput.run()}compositeTo(t,r){let e=this.compositors.get(t);if(e&&Ao(e.spec,r)){e.handle.run();return}let i=this.buildCompositor(t,r);this.compositors.set(t,{spec:r,handle:i}),i.run()}applyAlpha(t){if(!this.network||!this.upscaler)throw new Error("RenderOp.applyAlpha called before attachNetwork");this.backend.copyTensor(t,this.network.output),this.upscaler.run()}runModel(){if(!this.network||!this.networkInput||!this.upscaler)throw new Error("RenderOp.runModel called before attachNetwork");this.networkInput.run(),this.network.run(),this.upscaler.run()}makeUpscaler(){if(!this.network)throw new Error("makeUpscaler called with no network");let{backend:t,network:r,image:e}=this;return this.upscalerMode==="bicubic"?new Y(t,r.output,e.h,e.w):new K(t,r.output,e.h,e.w)}buildCompositor(t,r){let{backend:e,image:i}=this;if(r.mode==="passthrough")return e.presenters.CompositePassthrough(i,t);if(!this.upscaler)throw new Error("RenderOp.compositeTo (effect spec) called before attachNetwork");let o=this.upscaler.output;switch(r.mode){case"solid":return new Q(e,i,o,r.color,t);case"image":return new J(e,i,o,r.image,t);case"blur":return new ee(e,i,o,r.sigma,t)}}};function Ao(u,t){if(u.mode!==t.mode)return!1;switch(t.mode){case"passthrough":return!0;case"solid":{let r=u.color;return r[0]===t.color[0]&&r[1]===t.color[1]&&r[2]===t.color[2]}case"blur":return u.sigma===t.sigma;case"image":return u.image===t.image}}var Mo=u=>typeof u=="object"&&u!==null&&typeof u.offset=="number"&&typeof u.length=="number";function Wt(u){if(u.byteLength<4)throw new Error("weights buffer too small");let t=new DataView(u,0,4).getUint32(0,!0),r=4+t;if(u.byteLength<r)throw new Error("weights buffer truncated (header)");let e=new Uint8Array(u,4,t),i=JSON.parse(new TextDecoder().decode(e)),o=i.__dtype__??"f32",n=o==="f16"?2:4;if(r%n!==0)throw new Error(\`payload not \${n}-byte aligned (header=\${t})\`);let s=(u.byteLength-r)/n,p=l=>{if(Mo(l)){let{offset:c,length:d}=l;if(c+d>s)throw new Error(\`array ref out of range: offset=\${c} length=\${d}\`);let _=r+c*n;return o==="f16"?new Uint16Array(u,_,d):new Float32Array(u,_,d)}if(Array.isArray(l))return l.map(p);if(typeof l=="object"&&l!==null){let c={};for(let d of Object.keys(l))d!=="__dtype__"&&(c[d]=p(l[d]));return c}return l};return p(i)}function Pt(u,t,r,e){let i=e.variant,o=i==="E"||i==="D",n=i==="D",s=t.h,p=t.w,l=[],c=null,d=null,_=0,b=0,g;if(o)if(n){if(!r.down2)throw new Error("variant D requires w.down2");_=Math.round(s/1.25),b=Math.round(p/1.25);let v=u.ops.Conv2d(t,r.down1,{outChannels:e.cHigh,kernel:3,stride:1,padding:1,activation:"relu"});l.push(v),d=v.output;let x=u.ops.BilinearUpsample(d,{outH:_,outW:b});l.push(x),c=x.output;let k=u.ops.DownAdapter(c,r.down2,r.adapter,{stride:2});l.push(k),g=k.output}else{if(!r.down2)throw new Error("variant E requires w.down2");let v=u.ops.Conv2d(t,r.down1,{outChannels:e.cHigh,kernel:3,stride:2,padding:1,activation:"relu"});l.push(v),c=v.output,_=c.h,b=c.w;let x=u.ops.DownAdapter(c,r.down2,r.adapter,{stride:2});l.push(x),g=x.output}else{let v=i==="A"?2:3,x=u.ops.DownAdapter(t,r.down1,r.adapter,{stride:v});l.push(x),g=x.output}return{steps:l,adapted:g,d1:c,dFull:d,midH:_,midW:b}}function Gt(u,t,r,e,i,o,n,s,p){let l=p.variant,c=l==="E"||l==="D",d=l==="D",_=[],b=u.ops.ConvExpand(r,s.expandFeat);_.push(b);let g=b.output,v;if(c){if(!s.up1Combine)throw new Error("two-stage variant requires w.up1Combine");let k=u.ops.BilinearUpsample(g,{outH:o,outW:n});_.push(k);let B=u.ops.CatConv6to2(k.output,e,s.up1Combine);_.push(B);let U=u.ops.BilinearUpsample(B.output,{outH:t.h,outW:t.w});_.push(U),v=U.output}else{let k=u.ops.BilinearUpsample(g,{outH:t.h,outW:t.w});_.push(k),v=k.output}let x=d?u.ops.UpFinalSkip(v,i,t,s.upCombine):u.ops.UpFinal(v,t,s.upCombine);return _.push(x),{steps:_,alpha:x.output}}var re=class{constructor(t,r,e,i,o,n){a(this,"inputs");a(this,"output");a(this,"encoderTaps");a(this,"halfTap");a(this,"steps");this.inputs=[r];let s=Pt(t,r,i,o),p=new n(t,s.adapted,e),l=t.ops.BilinearUpsample(p.featLowRes,{outH:s.adapted.h,outW:s.adapted.w}),c=Gt(t,r,l.output,s.d1,s.dFull,s.midH,s.midW,i,o);this.steps=[...s.steps,p,l,...c.steps],this.output=c.alpha,this.encoderTaps=p.encoderTaps,this.halfTap=p.halfTap}run(){for(let t of this.steps)t.run()}};var Ro=[5,5,3,3],Ho=[2,2,1,1];function oe(u,t,r,e){if(t.h===r.h&&t.w===r.w)return t;let i=u.ops.Crop(t,{outH:r.h,outW:r.w});return e.push(i),i.output}var ie=class{constructor(t,r,e,i,o,n=16,s={}){a(this,"inputs");a(this,"output");a(this,"steps");this.inputs=[r,e,...i,...s.halfTap?[s.halfTap]:[]];let p=[],l=t.ops.ChannelConcat(r,e);p.push(l);let c=t.ops.Conv2d(l.output,o.stem,{outChannels:n,kernel:7,stride:2,padding:3,activation:"relu6"});p.push(c);let d=[],_=c.output;if(s.fuseStem&&s.halfTap){let x=oe(t,s.halfTap,c.output,p),k=t.ops.ChannelConcat(c.output,x);p.push(k),d.push(k.output),_=k.output}for(let x=0;x<i.length;x++){let k=t.ops.Conv2d(_,o.stages[x],{outChannels:n,kernel:Ro[x],stride:2,padding:Ho[x],activation:"relu6"});p.push(k);let B=oe(t,i[x],k.output,p),U=t.ops.ChannelConcat(k.output,B);p.push(U),d.push(U.output),_=U.output}let b=t.ops.Conv2d(d[d.length-1],o.predictBot,{outChannels:4,kernel:3,stride:1,padding:1,activation:"none"});p.push(b);let g=b.output,v=d[d.length-1];for(let x=0;x<d.length-1;x++){let k=d.length-2-x,B=t.ops.BilinearUpsample(v,{outH:v.h*2,outW:v.w*2}),U=t.ops.Conv2d(B.output,o.deconv[x],{outChannels:n,kernel:3,stride:1,padding:1,activation:"relu6"}),X=t.ops.BilinearUpsample(g,{outH:g.h*2,outW:g.w*2});p.push(B,U,X);let vt=oe(t,U.output,d[k],p),z=oe(t,X.output,d[k],p),j=t.ops.ChannelConcat(d[k],vt),D=t.ops.ChannelConcat(j.output,z);p.push(j,D);let V=t.ops.Conv2d(D.output,o.predict[x],{outChannels:4,kernel:3,stride:1,padding:1,activation:"none"});p.push(V),g=V.output,v=D.output}this.output=g,this.steps=p}run(){for(let t of this.steps)t.run()}};var L=class{constructor(t,r,e,i){a(this,"inputs");a(this,"output");a(this,"dwOp");a(this,"pwOp");this.inputs=[r],this.dwOp=t.ops.DepthwiseConv2d(r,e.dw,{kernel:i.kernel,stride:i.stride,padding:i.padding,activation:"relu6"}),this.pwOp=t.ops.Conv2d(this.dwOp.output,e.pw,{outChannels:i.outChannels,kernel:1,stride:1,padding:0,activation:"none"}),this.output=this.pwOp.output}run(){this.dwOp.run(),this.pwOp.run()}};var w=class{constructor(t,r,e,i){a(this,"inputs");a(this,"output");a(this,"expandOp");a(this,"dwOp");a(this,"projOp");this.inputs=[r];let o=i.midChannels!==i.inChannels,n=i.stride===1&&i.inChannels===i.outChannels;this.expandOp=o?t.ops.Conv2d(r,e.expand,{outChannels:i.midChannels,kernel:1,stride:1,padding:0,activation:"relu6"}):null;let s=this.expandOp?this.expandOp.output:r;this.dwOp=t.ops.DepthwiseConv2d(s,e.dw,{kernel:i.kernel,stride:i.stride,padding:i.padding,activation:"relu6"}),this.projOp=n?t.ops.ProjResidual(this.dwOp.output,r,e.proj,{outChannels:i.outChannels}):t.ops.Conv2d(this.dwOp.output,e.proj,{outChannels:i.outChannels,kernel:1,stride:1,padding:0,activation:"none"}),this.output=this.projOp.output}run(){this.expandOp?.run(),this.dwOp.run(),this.projOp.run()}};var G=class{constructor(t,r,e,i,o){a(this,"inputs");a(this,"output");a(this,"upOp");a(this,"concatConvOp");a(this,"conv2Op");this.inputs=[r,e],this.upOp=t.ops.BilinearUpsample(r,{outH:e.h,outW:e.w}),this.concatConvOp=t.ops.ConcatConv2d(this.upOp.output,e,i.conv1,{outChannels:o.outChannels}),this.conv2Op=t.ops.Conv2d(this.concatConvOp.output,i.conv2,{outChannels:o.outChannels,kernel:3,stride:1,padding:1,activation:"relu6"}),this.output=this.conv2Op.output}run(){this.upOp.run(),this.concatConvOp.run(),this.conv2Op.run()}};var ae=class{constructor(t,r,e){a(this,"output");a(this,"featLowRes");a(this,"encoderTaps");a(this,"halfTap");a(this,"stem");a(this,"s0");a(this,"s1b0");a(this,"s1b1");a(this,"s2b0");a(this,"s2b1");a(this,"s3b0");a(this,"s3b1");a(this,"s3b2");a(this,"s4b0");a(this,"s4b1");a(this,"s4b2");a(this,"bottleneck");a(this,"dec0");a(this,"dec1");a(this,"finalUp");a(this,"outConv");a(this,"alpha");this.stem=t.ops.Conv2d(r,e.encoder.stem,{outChannels:32,kernel:3,stride:2,padding:"same",activation:"relu6"}),this.s0=new L(t,this.stem.output,e.encoder.s0,{outChannels:16,kernel:3,stride:1,padding:1}),this.s1b0=new w(t,this.s0.output,e.encoder.s1[0],{inChannels:16,midChannels:96,outChannels:24,kernel:3,stride:2,padding:"same"}),this.s1b1=new w(t,this.s1b0.output,e.encoder.s1[1],{inChannels:24,midChannels:144,outChannels:24,kernel:3,stride:1,padding:1}),this.s2b0=new w(t,this.s1b1.output,e.encoder.s2[0],{inChannels:24,midChannels:144,outChannels:40,kernel:5,stride:2,padding:"same"}),this.s2b1=new w(t,this.s2b0.output,e.encoder.s2[1],{inChannels:40,midChannels:240,outChannels:40,kernel:5,stride:1,padding:2}),this.s3b0=new w(t,this.s2b1.output,e.encoder.s3[0],{inChannels:40,midChannels:240,outChannels:80,kernel:3,stride:2,padding:"same"}),this.s3b1=new w(t,this.s3b0.output,e.encoder.s3[1],{inChannels:80,midChannels:480,outChannels:80,kernel:3,stride:1,padding:1}),this.s3b2=new w(t,this.s3b1.output,e.encoder.s3[2],{inChannels:80,midChannels:480,outChannels:80,kernel:3,stride:1,padding:1}),this.s4b0=new w(t,this.s3b2.output,e.encoder.s4[0],{inChannels:80,midChannels:480,outChannels:112,kernel:5,stride:1,padding:2}),this.s4b1=new w(t,this.s4b0.output,e.encoder.s4[1],{inChannels:112,midChannels:672,outChannels:112,kernel:5,stride:1,padding:2}),this.s4b2=new w(t,this.s4b1.output,e.encoder.s4[2],{inChannels:112,midChannels:672,outChannels:112,kernel:5,stride:1,padding:2}),this.bottleneck=t.ops.Conv2d(this.s4b2.output,e.bottleneck,{outChannels:128,kernel:1,stride:1,padding:0,activation:"relu6"}),this.dec0=new G(t,this.bottleneck.output,this.s2b1.output,e.decoder.blocks[0],{outChannels:64}),this.dec1=new G(t,this.dec0.output,this.s1b1.output,e.decoder.blocks[1],{outChannels:32}),this.finalUp=t.ops.UpsampleConv1x1(this.dec1.output,e.decoder.finalUpsample,{outH:this.dec1.output.h*2,outW:this.dec1.output.w*2,outChannels:32,activation:"relu6"}),this.featLowRes=this.finalUp.output,this.encoderTaps=[this.s1b1.output,this.s2b1.output,this.s4b2.output],this.halfTap=this.s0.output,this.outConv=t.ops.Conv2d(this.finalUp.output,e.decoder.outputConv,{outChannels:4,kernel:1,stride:1,padding:0,activation:"none"}),this.alpha=t.ops.UpsampleSigmoid(this.outConv.output,{outH:this.outConv.output.h*2,outW:this.outConv.output.w*2}),this.output=this.alpha.output}run(){this.stem.run(),this.s0.run(),this.s1b0.run(),this.s1b1.run(),this.s2b0.run(),this.s2b1.run(),this.s3b0.run(),this.s3b1.run(),this.s3b2.run(),this.s4b0.run(),this.s4b1.run(),this.s4b2.run(),this.bottleneck.run(),this.dec0.run(),this.dec1.run(),this.finalUp.run(),this.outConv.run(),this.alpha.run()}};var ne=class{constructor(t,r,e){a(this,"output");a(this,"featLowRes");a(this,"encoderTaps");a(this,"stem");a(this,"s0");a(this,"s1b0");a(this,"s1b1");a(this,"s2b0");a(this,"s2b1");a(this,"s3b0");a(this,"s3b1");a(this,"s3b2");a(this,"s4b0");a(this,"s4b1");a(this,"s4b2");a(this,"s5b0");a(this,"s5b1");a(this,"s5b2");a(this,"s5b3");a(this,"s6b0");a(this,"bottleneck");a(this,"dec0");a(this,"dec1");a(this,"dec2");a(this,"finalUp");a(this,"outConv");a(this,"alpha");this.stem=t.ops.Conv2d(r,e.encoder.stem,{outChannels:32,kernel:3,stride:2,padding:"same",activation:"relu6"}),this.s0=new L(t,this.stem.output,e.encoder.s0,{outChannels:16,kernel:3,stride:1,padding:1}),this.s1b0=new w(t,this.s0.output,e.encoder.s1[0],{inChannels:16,midChannels:96,outChannels:24,kernel:3,stride:2,padding:"same"}),this.s1b1=new w(t,this.s1b0.output,e.encoder.s1[1],{inChannels:24,midChannels:144,outChannels:24,kernel:3,stride:1,padding:1}),this.s2b0=new w(t,this.s1b1.output,e.encoder.s2[0],{inChannels:24,midChannels:144,outChannels:40,kernel:5,stride:2,padding:"same"}),this.s2b1=new w(t,this.s2b0.output,e.encoder.s2[1],{inChannels:40,midChannels:240,outChannels:40,kernel:5,stride:1,padding:2}),this.s3b0=new w(t,this.s2b1.output,e.encoder.s3[0],{inChannels:40,midChannels:240,outChannels:80,kernel:3,stride:2,padding:"same"}),this.s3b1=new w(t,this.s3b0.output,e.encoder.s3[1],{inChannels:80,midChannels:480,outChannels:80,kernel:3,stride:1,padding:1}),this.s3b2=new w(t,this.s3b1.output,e.encoder.s3[2],{inChannels:80,midChannels:480,outChannels:80,kernel:3,stride:1,padding:1}),this.s4b0=new w(t,this.s3b2.output,e.encoder.s4[0],{inChannels:80,midChannels:480,outChannels:112,kernel:5,stride:1,padding:2}),this.s4b1=new w(t,this.s4b0.output,e.encoder.s4[1],{inChannels:112,midChannels:672,outChannels:112,kernel:5,stride:1,padding:2}),this.s4b2=new w(t,this.s4b1.output,e.encoder.s4[2],{inChannels:112,midChannels:672,outChannels:112,kernel:5,stride:1,padding:2}),this.s5b0=new w(t,this.s4b2.output,e.encoder.s5[0],{inChannels:112,midChannels:672,outChannels:192,kernel:5,stride:2,padding:"same"}),this.s5b1=new w(t,this.s5b0.output,e.encoder.s5[1],{inChannels:192,midChannels:1152,outChannels:192,kernel:5,stride:1,padding:2}),this.s5b2=new w(t,this.s5b1.output,e.encoder.s5[2],{inChannels:192,midChannels:1152,outChannels:192,kernel:5,stride:1,padding:2}),this.s5b3=new w(t,this.s5b2.output,e.encoder.s5[3],{inChannels:192,midChannels:1152,outChannels:192,kernel:5,stride:1,padding:2}),this.s6b0=new w(t,this.s5b3.output,e.encoder.s6[0],{inChannels:192,midChannels:1152,outChannels:320,kernel:3,stride:1,padding:1}),this.bottleneck=t.ops.Conv2d(this.s6b0.output,e.bottleneck,{outChannels:128,kernel:1,stride:1,padding:0,activation:"relu6"}),this.dec0=new G(t,this.bottleneck.output,this.s4b2.output,e.decoder.blocks[0],{outChannels:64}),this.dec1=new G(t,this.dec0.output,this.s2b1.output,e.decoder.blocks[1],{outChannels:32}),this.dec2=new G(t,this.dec1.output,this.s1b1.output,e.decoder.blocks[2],{outChannels:16}),this.finalUp=t.ops.UpsampleConv1x1(this.dec2.output,e.decoder.finalUpsample,{outH:this.dec2.output.h*2,outW:this.dec2.output.w*2,outChannels:16,activation:"relu6"}),this.featLowRes=this.finalUp.output,this.encoderTaps=[this.s1b1.output,this.s2b1.output,this.s4b2.output,this.s6b0.output],this.outConv=t.ops.Conv2d(this.finalUp.output,e.decoder.outputConv,{outChannels:4,kernel:1,stride:1,padding:0,activation:"none"}),this.alpha=t.ops.UpsampleSigmoid(this.outConv.output,{outH:this.outConv.output.h*2,outW:this.outConv.output.w*2}),this.output=this.alpha.output}run(){this.stem.run(),this.s0.run(),this.s1b0.run(),this.s1b1.run(),this.s2b0.run(),this.s2b1.run(),this.s3b0.run(),this.s3b1.run(),this.s3b2.run(),this.s4b0.run(),this.s4b1.run(),this.s4b2.run(),this.s5b0.run(),this.s5b1.run(),this.s5b2.run(),this.s5b3.run(),this.s6b0.run(),this.bottleneck.run(),this.dec0.run(),this.dec1.run(),this.dec2.run(),this.finalUp.run(),this.outConv.run(),this.alpha.run()}};var wt=[[{in:24,mid:144,out:32,k:3,s:2},{in:32,mid:192,out:32,k:3,s:1},{in:32,mid:192,out:32,k:3,s:1},{in:32,mid:192,out:32,k:3,s:1}],[{in:32,mid:192,out:56,k:5,s:2},{in:56,mid:336,out:56,k:5,s:1},{in:56,mid:336,out:56,k:5,s:1},{in:56,mid:336,out:56,k:5,s:1}],[{in:56,mid:336,out:112,k:3,s:2},{in:112,mid:672,out:112,k:3,s:1},{in:112,mid:672,out:112,k:3,s:1},{in:112,mid:672,out:112,k:3,s:1},{in:112,mid:672,out:112,k:3,s:1},{in:112,mid:672,out:112,k:3,s:1}],[{in:112,mid:672,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1}],[{in:160,mid:960,out:272,k:5,s:2},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1}],[{in:272,mid:1632,out:448,k:3,s:1}]],se=class{constructor(t,r,e){a(this,"output");a(this,"featLowRes");a(this,"encoderTaps");a(this,"stem");a(this,"s0");a(this,"stages");a(this,"bottleneck");a(this,"dec0");a(this,"dec1");a(this,"dec2");a(this,"finalUp");a(this,"outConv");a(this,"alpha");this.stem=t.ops.Conv2d(r,e.encoder.stem,{outChannels:32,kernel:3,stride:2,padding:"same",activation:"relu6"}),this.s0=new L(t,this.stem.output,e.encoder.s0,{outChannels:24,kernel:3,stride:1,padding:1});let i=[e.encoder.s1,e.encoder.s2,e.encoder.s3,e.encoder.s4,e.encoder.s5,e.encoder.s6];this.stages=[];let o=this.s0.output;for(let d=0;d<wt.length;d++){let _=[];for(let b=0;b<wt[d].length;b++){let g=wt[d][b],v=new w(t,o,i[d][b],{inChannels:g.in,midChannels:g.mid,outChannels:g.out,kernel:g.k,stride:g.s,padding:g.s===2?"same":(g.k-1)/2});_.push(v),o=v.output}this.stages.push(_)}let n=d=>this.stages[d][this.stages[d].length-1].output,s=n(0),p=n(1),l=n(3),c=n(5);this.bottleneck=t.ops.Conv2d(c,e.bottleneck,{outChannels:256,kernel:1,stride:1,padding:0,activation:"relu6"}),this.dec0=new G(t,this.bottleneck.output,l,e.decoder.blocks[0],{outChannels:128}),this.dec1=new G(t,this.dec0.output,p,e.decoder.blocks[1],{outChannels:64}),this.dec2=new G(t,this.dec1.output,s,e.decoder.blocks[2],{outChannels:32}),this.finalUp=t.ops.UpsampleConv1x1(this.dec2.output,e.decoder.finalUpsample,{outH:this.dec2.output.h*2,outW:this.dec2.output.w*2,outChannels:32,activation:"relu6"}),this.featLowRes=this.finalUp.output,this.encoderTaps=[s,p,l,c],this.outConv=t.ops.Conv2d(this.finalUp.output,e.decoder.outputConv,{outChannels:4,kernel:1,stride:1,padding:0,activation:"none"}),this.alpha=t.ops.UpsampleSigmoid(this.outConv.output,{outH:this.outConv.output.h*2,outW:this.outConv.output.w*2}),this.output=this.alpha.output}run(){this.stem.run(),this.s0.run();for(let t of this.stages)for(let r of t)r.run();this.bottleneck.run(),this.dec0.run(),this.dec1.run(),this.dec2.run(),this.finalUp.run(),this.outConv.run(),this.alpha.run()}};var Bt=ae,Ut=ne,zo=se,O={xs:{base:Bt,wrapper:{variant:"B",cHigh:4,cLow:4,cUp:2},canvasRes:{w:384,h:216},baseRes:{w:128,h:72},flowFuseStem:!0},small:{base:Bt,wrapper:{variant:"A",cHigh:4,cLow:4,cUp:2},canvasRes:{w:384,h:216},baseRes:{w:192,h:108}},medium:{base:Ut,wrapper:{variant:"A",cHigh:4,cLow:4,cUp:2},canvasRes:{w:512,h:288},baseRes:{w:256,h:144}},large:{base:Ut,wrapper:{variant:"D",cHigh:4,cLow:4,cUp:2},canvasRes:{w:640,h:360},baseRes:{w:256,h:144}},xl:{base:zo,wrapper:{variant:"E",cHigh:4,cLow:4,cUp:2},canvasRes:{w:1280,h:720},baseRes:{w:320,h:180}}};var Vo=16,No={tLo:.15,tHi:2.5,leak:.15,release:.9,tDiv:1,divScale:2},$o=15,Xo=5,St=1e3,ue=class{constructor(t){a(this,"canvas");a(this,"backend");a(this,"backendKind");a(this,"topology");a(this,"preset",null);a(this,"enabled");a(this,"currentBackground");a(this,"modelTimingCounter",0);a(this,"renderOp");a(this,"flow",null);a(this,"bgImageInputs",new Map);a(this,"bgVideoInputs",new Map);a(this,"bgVideoPorts",new Map);a(this,"previewCanvas",null);a(this,"previewCtx",null);a(this,"previewBg",null);a(this,"previewEffectSpec",null);a(this,"previewIntervalMs",1e3/$o);a(this,"lastPreviewAt",0);a(this,"skipCounter",0);a(this,"framesRenderedAt",[]);a(this,"modelRunSamples",[]);a(this,"displayRunSamples",[]);a(this,"skippedCount",0);this.backend=t.backend,this.backendKind=t.backendKind,this.canvas=t.canvas,this.enabled=t.enabled,this.currentBackground=t.background,this.topology=t.topology,this.renderOp=new te(this.backend)}process(t){this.renderOp.setSource(t);let r=performance.now(),e=this.renderOp.hasNetwork(),i=this.enabled&&e&&this.currentBackground.kind!=="none",o=this.isPreviewTick(r),n=o&&e&&this.previewBg!==null&&this.previewBg.kind!=="none",s=!1;i&&this.flow?s=this.stepFlow():i&&(this.shouldRunModel()?(this.runModelOnce(),s=!0):this.skippedCount++),!s&&n&&(this.runModelOnce(),s=!0);let p=performance.now();o&&this.previewCanvas?(this.backendKind==="webgl"?this.compositePreviewWebGL(i,n):(this.compositeMain(i),this.renderOp.compositeTo("preview",this.previewSpec(n))),this.lastPreviewAt=r):this.compositeMain(i),this.displayRunSamples.push({ts:performance.now(),ms:performance.now()-p}),this.trimSamples(this.displayRunSamples),this.framesRenderedAt.push(performance.now()),this.trim(this.framesRenderedAt)}compositeMain(t){t?this.renderOp.runDisplay():this.renderOp.runPassthrough()}compositePreviewWebGL(t,r){this.renderOp.refreshDisplayInput(),this.renderOp.compositeTo("preview",this.previewSpec(r));let e=this.canvas.transferToImageBitmap();this.previewCtx.transferFromImageBitmap(e),this.renderOp.compositeMain(!t)}previewSpec(t){return t&&this.previewEffectSpec?this.previewEffectSpec:{mode:"passthrough"}}runModelOnce(){let t=performance.now();this.renderOp.runModel(),this.backendKind==="webgpu"&&this.modelTimingCounter%Xo===0&&this.backend.sync().then(()=>{this.modelRunSamples.push({ts:performance.now(),ms:performance.now()-t}),this.trimSamples(this.modelRunSamples)}).catch(()=>{}),this.modelTimingCounter++}stepFlow(){let t=this.flow,r=!1;return t.networkInput.run(),t.curBaseDown.run(),t.everyFrame?(t.net.run(),t.up.run(),this.runModelOnce(),r=!0,this.backend.copyTensor(t.curBaseDown.output,t.frameAHeld),this.backend.copyTensor(t.tier.output,t.predBuf)):this.shouldRunModel()?(this.runModelOnce(),r=!0,this.backend.copyTensor(t.curBaseDown.output,t.frameAHeld),this.backend.copyTensor(t.tier.output,t.alphaHeld),this.backend.copyTensor(t.tier.output,t.predBuf)):(this.skippedCount++,t.net.run(),t.up.run(),t.predWarp.run(),this.backend.copyTensor(t.predWarp.output,t.predBuf)),t.warm?(t.refWarp.run(),t.stab.run(),this.backend.copyTensor(t.stab.output,t.stabPrev),this.renderOp.applyAlpha(t.stab.output),r):(this.backend.copyTensor(t.tier.output,t.stabPrev),t.warm=r,r)}isPreviewTick(t){return!this.previewCanvas||this.previewBg===null||!this.enabled?!1:t-this.lastPreviewAt>=this.previewIntervalMs}shouldRunModel(){return this.skipCounter===0?(this.skipCounter=this.preset?.skipFrames??0,!0):(this.skipCounter--,!1)}setBackground(t){this.currentBackground=t,this.renderOp.setBackground(this.translateBackgroundFor("main",t))}setEnabled(t){this.enabled=t}attachPreview(t){if(t.width=this.canvas.width,t.height=this.canvas.height,this.previewCanvas=t,this.backendKind==="webgpu")this.backend.attachCanvas("preview",t);else{let r=t.getContext("bitmaprenderer");if(!r)throw new Error("renderer: failed to get bitmaprenderer context for preview canvas");this.previewCtx=r}}setPreview(t,r){this.previewBg=t,this.previewEffectSpec=t.kind==="none"?null:this.translateBackgroundFor("preview",t),r?.fps&&r.fps>0&&(this.previewIntervalMs=1e3/r.fps),this.lastPreviewAt=0}clearPreview(){this.previewBg=null,this.previewEffectSpec=null;let t=this.bgVideoPorts.get("preview");t&&(t.close(),this.bgVideoPorts.delete("preview"))}setPreset(t,r){let e=O[t.model];if(!e)throw new Error(\`renderer: no TIER_CONFIG entry for model '\${t.model}'\`);let i=Wt(r),o=this.backend.ops.Input(e.canvasRes.h,e.canvasRes.w),n=new re(this.backend,o.output,i.base,i.wrapper,e.wrapper,e.base);if(this.renderOp.attachNetwork(n,o,{upscaler:"bilinear",background:this.translateBackgroundFor("main",this.currentBackground)}),this.flow=null,i.flow){let s=e.baseRes,p=e.canvasRes,l=t.skipFrames===0,c=(D,V)=>this.backend.tensor(D,V,4,new Float32Array(D*V*4)),d=this.backend.ops.BilinearUpsample(o.output,{outH:s.h,outW:s.w}),_=c(s.h,s.w),b=new ie(this.backend,_,d.output,n.encoderTaps,i.flow,Vo,e.flowFuseStem?{fuseStem:!0,halfTap:n.halfTap}:{}),g=this.backend.ops.BilinearUpsample(b.output,{outH:p.h,outW:p.w}),v=p.w/s.w,x=c(p.h,p.w),k=c(p.h,p.w),B=this.backend.ops.Warp(k,g.output,{flowScale:v}),U=Math.max(1,Math.round(p.w/b.output.w)),X=Math.max(1,Math.round(p.h/b.output.h)),vt=this.backend.ops.Stabilize(g.output,x,B.output,k,{...No,stepX:U,stepY:X}),z=l?null:c(p.h,p.w),j=z?this.backend.ops.Warp(z,g.output,{flowScale:v}):null;this.flow={tier:n,everyFrame:l,warm:!1,networkInput:o,curBaseDown:d,frameAHeld:_,net:b,up:g,predBuf:x,stabPrev:k,refWarp:B,stab:vt,alphaHeld:z,predWarp:j}}this.preset=t,this.skipCounter=0}destroy(){for(let t of this.bgVideoPorts.values())t.close();this.bgVideoPorts.clear(),this.backend.destroy()}getStats(){let t=performance.now();return this.trimRecent(this.framesRenderedAt,t),this.trimSamplesAt(this.modelRunSamples,t),this.trimSamplesAt(this.displayRunSamples,t),{fps:this.framesRenderedAt.length,modelFps:this.modelRunSamples.length,modelMs:Lt(this.modelRunSamples.map(r=>r.ms)),displayMs:Lt(this.displayRunSamples.map(r=>r.ms)),skipped:this.skippedCount,preset:this.preset?.model??"boot",skipFrames:this.preset?.skipFrames??0,enabled:this.enabled,inputPath:this.topology.input,outputPath:this.topology.output}}translateBackgroundFor(t,r){let e=this.bgVideoPorts.get(t);switch(r.kind!=="video"&&e&&(e.close(),this.bgVideoPorts.delete(t)),r.kind){case"none":return{mode:"solid",color:[0,0,0]};case"color":return{mode:"solid",color:r.rgb};case"blur":return{mode:"blur",sigma:r.sigma};case"image":{let i=this.bgInputFor(this.bgImageInputs,t);return i.setSource(r.bitmap),i.run(),{mode:"image",image:i.output}}case"video":{let i=this.bgInputFor(this.bgVideoInputs,t);return e&&e.close(),this.bgVideoPorts.set(t,r.port),r.port.onmessage=o=>{let n=o.data.frame;try{i.setSource(n),i.run()}finally{n.close()}},r.port.start?.(),{mode:"image",image:i.output}}}}bgInputFor(t,r){let e=t.get(r);return e||(e=this.backend.ops.Input(this.canvas.height,this.canvas.width),t.set(r,e)),e}trim(t){t.length>240&&t.splice(0,t.length-240)}trimSamples(t){t.length>240&&t.splice(0,t.length-240)}trimRecent(t,r){let e=r-St,i=0;for(;i<t.length&&t[i]<e;)i++;i>0&&t.splice(0,i)}trimSamplesAt(t,r){let e=r-St,i=0;for(;i<t.length&&t[i].ts<e;)i++;i>0&&t.splice(0,i)}};function Lt(u){if(u.length===0)return 0;let t=u.slice().sort((e,i)=>e-i),r=t.length>>1;return t.length%2?t[r]:(t[r-1]+t[r])/2}var I=new Float32Array(1),N=new Uint32Array(I.buffer);function jo(u){I[0]=u;let t=N[0],r=t>>>16&32768,e=t&2147483647,i=(e>>>23)-127+15;if((t&2139095040)===2139095040)return(t&8388607)!==0?r|32256:r|31744;if(i>=31)return r|31744;if(i<=0){if(i<-10)return r;let l=e&8388607|8388608,c=14-i,d=l>>>c,_=l>>>c-1&1,b=(l&(1<<c-1)-1)!==0?1:0;return _&&(b||d&1)&&(d+=1),r|d}let o=e>>>13&1023,n=e>>>12&1,s=(e&4095)!==0?1:0,p=i<<10|o;return n&&(s||o&1)&&(p+=1,(p>>>10&31)===31)?r|31744:r|p}function kt(u){let t=(u&32768)<<16,r=(u&31744)>>>10,e=u&1023;if(r===0){if(e===0)return N[0]=t,I[0];let i=e,o=1;for(;(i&1024)===0;)i<<=1,o-=1;return i&=1023,N[0]=t|o+127-15<<23|i<<13,I[0]}return r===31?(N[0]=t|2139095040|e<<13,I[0]):(N[0]=t|r+127-15<<23|e<<13,I[0])}function pe(u){let t=new Uint16Array(u.length);for(let r=0;r<u.length;r++)t[r]=jo(u[r]);return t}function A(u){let t=new Float32Array(u.length);for(let r=0;r<u.length;r++)t[r]=kt(u[r]);return t}var f=class{constructor(t){a(this,"backend",t);a(this,"shader","");a(this,"pipeline");a(this,"bindGroup");a(this,"uniformDefs",[]);a(this,"uniformBuffers",{})}createUniform(t,r){this.uniformDefs.push({name:t,type:r})}setUniform(t,r){let e=this.backend.device.createBuffer({size:r.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});r instanceof Uint32Array?new Uint32Array(e.getMappedRange()).set(r):new Float32Array(e.getMappedRange()).set(r),e.unmap(),this.uniformBuffers[t]=e}defaultBindGroup(){let t=[],r=0;for(let e of this.inputs)t.push({binding:r++,resource:{buffer:e.buffer}});for(let e of this.weights)t.push({binding:r++,resource:{buffer:e.buffer}});for(let e of this.uniformDefs)t.push({binding:r++,resource:{buffer:this.uniformBuffers[e.name]}});return t.push({binding:r,resource:{buffer:this.output.buffer}}),this.backend.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:t})}defaultSetup(){let t=this.backend.device.createShaderModule({code:this.shader});this.pipeline=this.backend.device.createComputePipeline({layout:"auto",compute:{module:t,entryPoint:"main"}}),this.bindGroup=this.defaultBindGroup()}run(){let t=this.backend.device.createCommandEncoder(),r=t.beginComputePass();r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.dispatchWorkgroups(...this.dispatch),r.end(),this.backend.device.queue.submit([t.finish()])}};var Ft=\`// Conv2d, output-channel-blocked (K=2) \\u2014 drop-in replacement for conv2d.wgsl.
//
// Identical math, layout, and output to conv2d.wgsl, but each thread computes 2
// output channel-groups (8 channels) for one pixel, loading each input vec4 ONCE
// and reusing it across both groups' mat4x4 weight blocks in registers. Half the
// register pressure of the K=4 variant (2 accumulators vs 4). Output is bit-
// identical to conv2d.wgsl (\\u22641 ULP from FMA contraction). Dispatch
// ceil(out_groups / 2) in z (see conv2d.ts).
//
// Tensor layout: NHWC, channels in vec4 groups (same as conv2d.wgsl).
// Weight layout: [K*K][out_groups][in_groups] array of mat4x4 (same as conv2d.wgsl).

struct Params {
    in_h        : u32,
    in_w        : u32,
    out_h       : u32,
    out_w       : u32,
    in_groups   : u32,   // in_channels / 4
    out_groups  : u32,   // out_channels / 4
    kernel_h    : u32,
    kernel_w    : u32,
    stride      : u32,
    pad_top     : u32,
    pad_left    : u32,
    activation  : u32,   // 0 = none, 1 = relu6, 2 = relu, 3 = leaky
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

const KB = 2u;

fn act(v: vec4<f32>, a: u32) -> vec4<f32> {
    if (a == 1u) { return clamp(v, vec4<f32>(0.0), vec4<f32>(6.0)); }
    if (a == 2u) { return max(v, vec4<f32>(0.0)); }
    if (a == 3u) { return max(v, 0.1 * v); }   // leaky relu (slope 0.1)
    return v;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x  = gid.x;       // output column
    let y  = gid.y;       // output row
    let o0 = gid.z * KB;  // first output channel group

    if (x >= params.out_w || y >= params.out_h || o0 >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    // Tail handling when out_groups is odd: clamp the spare lane to o0 (valid
    // index, no OOB) and just don't write it.
    let has1 = (o0 + 1u) < O;
    let o1 = select(o0, o0 + 1u, has1);

    var acc0 = bias_buf[o0];
    var acc1 = bias_buf[o1];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let z   = ky * params.kernel_w + kx;
            let inB = u32(in_y_s) * params.in_w * I + u32(in_x_s) * I;
            let wb0 = z * O * I + o0 * I;
            let wb1 = z * O * I + o1 * I;
            for (var i = 0u; i < I; i++) {
                let iv = input_buf[inB + i];   // loaded ONCE, reused across 2 groups
                acc0 += weight_buf[wb0 + i] * iv;
                acc1 += weight_buf[wb1 + i] * iv;
            }
        }
    }

    let baseO = y * params.out_w * O + x * O;
    output_buf[baseO + o0] = act(acc0, params.activation);
    if (has1) { output_buf[baseO + o1] = act(acc1, params.activation); }
}
\`;var Et=\`enable f16;

// Conv2d, output-channel-blocked (K=2) \\u2014 full f16. Drop-in replacement for
// conv2d_f16.wgsl. Each thread computes 2 output channel-groups for one pixel,
// loading each input vec4 ONCE and reusing it across both weight blocks. Half the
// register pressure of the K=4 variant (2 accumulators vs 4). Output is bit-
// identical to conv2d_f16.wgsl. Dispatch ceil(out_groups / 2) in z.

struct Params {
    in_h        : u32,
    in_w        : u32,
    out_h       : u32,
    out_w       : u32,
    in_groups   : u32,
    out_groups  : u32,
    kernel_h    : u32,
    kernel_w    : u32,
    stride      : u32,
    pad_top     : u32,
    pad_left    : u32,
    activation  : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

const KB = 2u;

fn act(v: vec4<f16>, a: u32) -> vec4<f16> {
    if (a == 1u) { return clamp(v, vec4<f16>(0.0h), vec4<f16>(6.0h)); }
    if (a == 2u) { return max(v, vec4<f16>(0.0h)); }
    if (a == 3u) { return max(v, 0.1h * v); }   // leaky relu (slope 0.1)
    return v;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x  = gid.x;
    let y  = gid.y;
    let o0 = gid.z * KB;

    if (x >= params.out_w || y >= params.out_h || o0 >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let has1 = (o0 + 1u) < O;
    let o1 = select(o0, o0 + 1u, has1);

    var acc0 = bias_buf[o0];
    var acc1 = bias_buf[o1];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let z   = ky * params.kernel_w + kx;
            let inB = u32(in_y_s) * params.in_w * I + u32(in_x_s) * I;
            let wb0 = z * O * I + o0 * I;
            let wb1 = z * O * I + o1 * I;
            for (var i = 0u; i < I; i++) {
                let iv = input_buf[inB + i];   // loaded ONCE, reused across 2 groups
                acc0 += weight_buf[wb0 + i] * iv;
                acc1 += weight_buf[wb1 + i] * iv;
            }
        }
    }

    let baseO = y * params.out_w * O + x * O;
    output_buf[baseO + o0] = act(acc0, params.activation);
    if (has1) { output_buf[baseO + o1] = act(acc1, params.activation); }
}
\`;function T(u,t,r,e){return typeof e=="number"?Math.floor((u+2*e-t)/r)+1:e==="same"?Math.ceil(u/r):Math.floor((u-t)/r)+1}function M(u,t,r,e){return(u-1)*r-2*e+t}function Yo(u,t,r,e){return Math.floor(Math.max((t-1)*e+r-u,0)/2)}function C(u,t,r,e,i){return typeof u=="number"?u:u==="same"?Yo(t,r,e,i):0}function m(u){return u instanceof Float32Array||u instanceof Uint16Array?u:new Float32Array(u)}function y(u){let t=Math.max(4,Math.ceil(u.length/4)*4),r=new Float32Array(t),e=u instanceof Uint16Array;for(let i=0;i<u.length;i++)r[i]=e?kt(u[i]):u[i];return r}var le=class extends f{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Et:Ft;let n=T(e.h,o.kernel,o.stride,o.padding),s=T(e.w,o.kernel,o.stride,o.padding),p=e.c/4,l=o.outChannels/4,c=C(o.padding,e.h,n,o.kernel,o.stride),d=C(o.padding,e.w,s,o.kernel,o.stride);this.output=r.tensor(n,s,o.outChannels),this.inputs=[e],this.weights=[r.upload(m(i.weights)),r.upload(m(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n,s,p,l,o.kernel,o.kernel,o.stride,c,d,o.activation==="relu6"?1:o.activation==="relu"?2:o.activation==="leaky"?3:0])),this.defaultSetup(),this.dispatch=[Math.ceil(s/8),Math.ceil(n/8),Math.ceil(l/2)]}};var Dt=\`// ConvTranspose2d \\u2014 gather form, f32 variant. See conv_transpose2d_f16.wgsl for
// the math; this is the f32 storage build (mat4x4<f32>).

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    in_groups  : u32,
    out_groups : u32,
    kernel_h   : u32,
    kernel_w   : u32,
    stride     : u32,
    pad_top    : u32,
    pad_left   : u32,
    activation : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

fn act(v: vec4<f32>, a: u32) -> vec4<f32> {
    if (a == 1u) { return clamp(v, vec4<f32>(0.0), vec4<f32>(6.0)); }
    if (a == 2u) { return max(v, vec4<f32>(0.0)); }
    if (a == 3u) { return max(v, 0.1 * v); }
    return v;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let o  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let s = i32(params.stride);

    var result = bias_buf[o];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let iy_num = i32(oy) + i32(params.pad_top)  - i32(ky);
            let ix_num = i32(ox) + i32(params.pad_left) - i32(kx);
            if (iy_num < 0 || ix_num < 0 || (iy_num % s) != 0 || (ix_num % s) != 0) {
                continue;
            }
            let iy = iy_num / s;
            let ix = ix_num / s;
            if (iy >= i32(params.in_h) || ix >= i32(params.in_w)) {
                continue;
            }

            let z = ky * params.kernel_w + kx;
            for (var i = 0u; i < I; i++) {
                let in_idx = u32(iy) * params.in_w * I + u32(ix) * I + i;
                let w_idx  = z * O * I + o * I + i;
                result += weight_buf[w_idx] * input_buf[in_idx];
            }
        }
    }

    output_buf[oy * params.out_w * O + ox * O + o] = act(result, params.activation);
}
\`;var Ot=\`enable f16;

// ConvTranspose2d \\u2014 gather form, full f16 variant.
// Each output (oy,ox) sums every input pixel + kernel tap that maps onto it:
//   iy = (oy + pad - ky) / stride   (must divide evenly and be in bounds)
// No explicit kernel flip \\u2014 the (oy + pad - ky) indexing carries it.
// Weight layout is IDENTICAL to conv2d (mat4x4[z][o][i], M[in_sub][out_sub] =
// W(in, out, ky, kx)), so the op uploads the flat buffer unchanged.

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    in_groups  : u32,
    out_groups : u32,
    kernel_h   : u32,
    kernel_w   : u32,
    stride     : u32,
    pad_top    : u32,
    pad_left   : u32,
    activation : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

fn act(v: vec4<f16>, a: u32) -> vec4<f16> {
    if (a == 1u) { return clamp(v, vec4<f16>(0.0h), vec4<f16>(6.0h)); }
    if (a == 2u) { return max(v, vec4<f16>(0.0h)); }
    if (a == 3u) { return max(v, 0.1h * v); }
    return v;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let o  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let s = i32(params.stride);

    var result = bias_buf[o];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let iy_num = i32(oy) + i32(params.pad_top)  - i32(ky);
            let ix_num = i32(ox) + i32(params.pad_left) - i32(kx);
            if (iy_num < 0 || ix_num < 0 || (iy_num % s) != 0 || (ix_num % s) != 0) {
                continue;
            }
            let iy = iy_num / s;
            let ix = ix_num / s;
            if (iy >= i32(params.in_h) || ix >= i32(params.in_w)) {
                continue;
            }

            let z = ky * params.kernel_w + kx;
            for (var i = 0u; i < I; i++) {
                let in_idx = u32(iy) * params.in_w * I + u32(ix) * I + i;
                let w_idx  = z * O * I + o * I + i;
                result += weight_buf[w_idx] * input_buf[in_idx];
            }
        }
    }

    output_buf[oy * params.out_w * O + ox * O + o] = act(result, params.activation);
}
\`;var ce=class extends f{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Ot:Dt;let n=M(e.h,o.kernel,o.stride,o.padding),s=M(e.w,o.kernel,o.stride,o.padding),p=e.c/4,l=o.outChannels/4;this.output=r.tensor(n,s,o.outChannels),this.inputs=[e],this.weights=[r.upload(m(i.weights)),r.upload(m(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n,s,p,l,o.kernel,o.kernel,o.stride,o.padding,o.padding,o.activation==="relu6"?1:o.activation==="relu"?2:o.activation==="leaky"?3:0])),this.defaultSetup(),this.dispatch=[Math.ceil(s/8),Math.ceil(n/8),l]}};var It=\`// Depthwise Conv2d \\u2014 groups = in_channels (each channel convolved independently).
//
// Weight layout: [K*K][channel_groups] array of vec4
//   weight index = (ky*kernel_w + kx) * channel_groups + c
//   Each vec4 holds the kernel weight for 4 consecutive channels at one spatial position.
//   Operation: element-wise multiply (each input channel multiplied by its own weight).
//
// Contrast with conv2d.wgsl which uses mat4x4 (dense cross-channel mixing).
// 4\\xD7 smaller weight buffer than a diagonal mat4x4 representation (4 floats vs 16 per group).
//
// Padding model: only \\\`pad_top\\\` and \\\`pad_left\\\` are applied to the input offset.
// Asymmetric SAME padding is handled implicitly via the in_h/in_w bounds check.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,   // channels / 4
    kernel_h       : u32,
    kernel_w       : u32,
    stride         : u32,
    pad_top        : u32,
    pad_left       : u32,
    apply_relu6    : u32,
    _pad0          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;  // output column
    let y = gid.y;  // output row
    let c = gid.z;  // channel group

    if (x >= params.out_w || y >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let C = params.channel_groups;

    var result = bias_buf[c];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let in_y = u32(in_y_s);
            let in_x = u32(in_x_s);
            let z    = ky * params.kernel_w + kx;

            let in_idx = in_y * params.in_w * C + in_x * C + c;
            let w_idx  = z * C + c;
            result += weight_buf[w_idx] * input_buf[in_idx];
        }
    }

    if (params.apply_relu6 == 1u) {
        result = clamp(result, vec4<f32>(0.0), vec4<f32>(6.0));
    }

    let out_idx = y * params.out_w * C + x * C + c;
    output_buf[out_idx] = result;
}
\`;var At=\`enable f16;

// Depthwise conv2d \\u2014 full f16 variant. All buffers f16.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    kernel_h       : u32,
    kernel_w       : u32,
    stride         : u32,
    pad_top        : u32,
    pad_left       : u32,
    apply_relu6    : u32,
    _pad0          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let c = gid.z;

    if (x >= params.out_w || y >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let C = params.channel_groups;

    var result = bias_buf[c];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let in_y = u32(in_y_s);
            let in_x = u32(in_x_s);
            let z    = ky * params.kernel_w + kx;

            let in_idx = in_y * params.in_w * C + in_x * C + c;
            let w_idx  = z * C + c;
            result += weight_buf[w_idx] * input_buf[in_idx];
        }
    }

    if (params.apply_relu6 == 1u) {
        result = clamp(result, vec4<f16>(0.0h), vec4<f16>(6.0h));
    }

    output_buf[y * params.out_w * C + x * C + c] = result;
}
\`;var de=class extends f{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?At:It;let n=T(e.h,o.kernel,o.stride,o.padding),s=T(e.w,o.kernel,o.stride,o.padding),p=e.c/4,l=C(o.padding,e.h,n,o.kernel,o.stride),c=C(o.padding,e.w,s,o.kernel,o.stride);this.output=r.tensor(n,s,e.c),this.inputs=[e],this.weights=[r.upload(m(i.weights)),r.upload(m(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n,s,p,o.kernel,o.kernel,o.stride,l,c,o.activation==="relu6"?1:0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(s/8),Math.ceil(n/8),p]}};var Mt=\`// Element-wise add of two tensors \\u2014 used for residual connections in MBConv blocks.
// Operates on the flat float buffer directly; layout is irrelevant for a pure element-wise op.

struct Params {
    size  : u32,   // total number of f32 elements
    _pad0 : u32,
    _pad1 : u32,
    _pad2 : u32,
}

@group(0) @binding(0) var<storage, read>       input_a : array<f32>;
@group(0) @binding(1) var<storage, read>       input_b : array<f32>;
@group(0) @binding(2) var<uniform>             params  : Params;
@group(0) @binding(3) var<storage, read_write> output  : array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.size) { return; }
    output[idx] = input_a[idx] + input_b[idx];
}
\`;var Rt=\`enable f16;

// Element-wise add \\u2014 full f16 variant.
// array<f16> is binary-compatible with array<vec4<f16>> written by the f16 conv shaders.

struct Params {
    size  : u32,
    _pad0 : u32,
    _pad1 : u32,
    _pad2 : u32,
}

@group(0) @binding(0) var<storage, read>       input_a : array<f16>;
@group(0) @binding(1) var<storage, read>       input_b : array<f16>;
@group(0) @binding(2) var<uniform>             params  : Params;
@group(0) @binding(3) var<storage, read_write> output  : array<f16>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.size) { return; }
    output[idx] = input_a[idx] + input_b[idx];
}
\`;var me=class extends f{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Rt:Mt;let o=e.h*e.w*e.c;this.output=r.tensor(e.h,e.w,e.c),this.inputs=[e,i],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/256),1,1]}};var Ht=\`// Element-wise sigmoid: output = 1 / (1 + exp(-x)).
// Operates on packed vec4 buffers (NHWC layout). exp() and arithmetic are element-wise on vec4.

struct Params {
    n_groups : u32,   // total vec4 elements (H * W * channel_groups)
    _pad0    : u32,
    _pad1    : u32,
    _pad2    : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.n_groups) { return; }
    output_buf[idx] = 1.0 / (1.0 + exp(-input_buf[idx]));
}
\`;var zt=\`enable f16;

// Sigmoid \\u2014 full f16 variant.

struct Params {
    n_groups : u32,
    _pad0    : u32,
    _pad1    : u32,
    _pad2    : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.n_groups) { return; }
    let x = vec4<f32>(input_buf[idx]);
    output_buf[idx] = vec4<f16>(1.0 / (1.0 + exp(-x)));
}
\`;var fe=class extends f{constructor(r,e){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?zt:Ht;let i=e.h*e.w*(e.c/4);this.output=r.tensor(e.h,e.w,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([i,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i/256),1,1]}};var Vt=\`// Element-wise tanh \\u2014 used by ConvGRU candidate activation.
// Operates on packed vec4 buffers (NHWC layout). tanh() is element-wise on vec4.

struct Params {
    n_groups : u32,
    _pad0    : u32,
    _pad1    : u32,
    _pad2    : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.n_groups) { return; }
    output_buf[idx] = tanh(input_buf[idx]);
}
\`;var Nt=\`enable f16;

// Tanh \\u2014 full f16 variant.

struct Params {
    n_groups : u32,
    _pad0    : u32,
    _pad1    : u32,
    _pad2    : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.n_groups) { return; }
    let x = vec4<f32>(input_buf[idx]);
    output_buf[idx] = vec4<f16>(tanh(x));
}
\`;var he=class extends f{constructor(r,e){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Nt:Vt;let i=e.h*e.w*(e.c/4);this.output=r.tensor(e.h,e.w,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([i,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i/256),1,1]}};var $t=\`// Element-wise multiply \\u2014 used in ConvGRU for r \\u2299 h_prev.
// Same flat-float layout as add.wgsl.

struct Params {
    size  : u32,
    _pad0 : u32,
    _pad1 : u32,
    _pad2 : u32,
}

@group(0) @binding(0) var<storage, read>       input_a : array<f32>;
@group(0) @binding(1) var<storage, read>       input_b : array<f32>;
@group(0) @binding(2) var<uniform>             params  : Params;
@group(0) @binding(3) var<storage, read_write> output  : array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.size) { return; }
    output[idx] = input_a[idx] * input_b[idx];
}
\`;var Xt=\`enable f16;

// Element-wise multiply \\u2014 full f16 variant.
// array<f16> is binary-compatible with array<vec4<f16>> written by the f16 conv shaders.

struct Params {
    size  : u32,
    _pad0 : u32,
    _pad1 : u32,
    _pad2 : u32,
}

@group(0) @binding(0) var<storage, read>       input_a : array<f16>;
@group(0) @binding(1) var<storage, read>       input_b : array<f16>;
@group(0) @binding(2) var<uniform>             params  : Params;
@group(0) @binding(3) var<storage, read_write> output  : array<f16>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.size) { return; }
    output[idx] = input_a[idx] * input_b[idx];
}
\`;var _e=class extends f{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Xt:$t;let o=e.h*e.w*e.c;this.output=r.tensor(e.h,e.w,e.c),this.inputs=[e,i],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/256),1,1]}};var jt=\`// Bilinear gather-warp (f32). See warp_f16.wgsl for the math.

struct Params {
    h          : u32,
    w          : u32,
    flow_scale : f32,
}

@group(0) @binding(0) var<storage, read>       source_buf : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       flow_buf   : array<vec4<f32>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f32>>;

fn samp(x: i32, y: i32, W: i32, H: i32) -> vec4<f32> {
    let cx = clamp(x, 0, W - 1);
    let cy = clamp(y, 0, H - 1);
    return source_buf[u32(cy) * u32(W) + u32(cx)];
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    let W = i32(params.w);
    let H = i32(params.h);
    let idx = y * params.w + x;

    let f  = flow_buf[idx].xy;
    let sx = clamp(f32(x) + params.flow_scale * f.x, 0.0, f32(W - 1));
    let sy = clamp(f32(y) + params.flow_scale * f.y, 0.0, f32(H - 1));

    let x0 = i32(floor(sx));
    let y0 = i32(floor(sy));
    let tx = sx - f32(x0);
    let ty = sy - f32(y0);

    let top = mix(samp(x0, y0, W, H), samp(x0 + 1, y0, W, H), tx);
    let bot = mix(samp(x0, y0 + 1, W, H), samp(x0 + 1, y0 + 1, W, H), tx);
    output_buf[idx] = mix(top, bot, ty);
}
\`;var qt=\`enable f16;

// Bilinear gather-warp (f16 storage, f32 coordinate math). For each output pixel
// p, sample the source at p + flow_scale\\xB7flow[p].xy and bilinearly interpolate,
// clamping the sample to the edge (border-replicate). Source + flow are 4-ch
// (1 group), same resolution; flow vector is in .xy.

struct Params {
    h          : u32,
    w          : u32,
    flow_scale : f32,
}

@group(0) @binding(0) var<storage, read>       source_buf : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       flow_buf   : array<vec4<f16>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f16>>;

fn samp(x: i32, y: i32, W: i32, H: i32) -> vec4<f32> {
    let cx = clamp(x, 0, W - 1);
    let cy = clamp(y, 0, H - 1);
    return vec4<f32>(source_buf[u32(cy) * u32(W) + u32(cx)]);
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    let W = i32(params.w);
    let H = i32(params.h);
    let idx = y * params.w + x;

    let f  = vec2<f32>(flow_buf[idx].xy);
    let sx = clamp(f32(x) + params.flow_scale * f.x, 0.0, f32(W - 1));
    let sy = clamp(f32(y) + params.flow_scale * f.y, 0.0, f32(H - 1));

    let x0 = i32(floor(sx));
    let y0 = i32(floor(sy));
    let tx = sx - f32(x0);
    let ty = sy - f32(y0);

    let top = mix(samp(x0, y0, W, H), samp(x0 + 1, y0, W, H), tx);
    let bot = mix(samp(x0, y0 + 1, W, H), samp(x0 + 1, y0 + 1, W, H), tx);
    output_buf[idx] = vec4<f16>(mix(top, bot, ty));
}
\`;var ge=class extends f{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?qt:jt,this.output=r.tensor(e.h,e.w,e.c),this.inputs=[e,i],this.createUniform("params","Params");let n=new Uint32Array(3);n[0]=e.h,n[1]=e.w,new Float32Array(n.buffer)[2]=o.flowScale,this.setUniform("params",n),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1]}};var Kt=\`// Flow-gated temporal stabilizer (f32). See stabilize_f16.wgsl for the math.

struct Params {
    h        : u32,
    w        : u32,
    t_lo     : f32,
    t_hi     : f32,
    leak     : f32,
    release  : f32,
    t_div    : f32,
    div_scale: f32,
    step_x   : u32,
    step_y   : u32,
}

@group(0) @binding(0) var<storage, read>       flow_buf     : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       pred_buf     : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       ref_buf      : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read>       env_prev_buf : array<vec4<f32>>;
@group(0) @binding(4) var<uniform>             params       : Params;
@group(0) @binding(5) var<storage, read_write> output_buf   : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }
    let idx = y * params.w + x;

    let mag      = length(flow_buf[idx].xy);
    let env_prev = env_prev_buf[idx].y;
    let env      = max(mag, params.release * env_prev);

    let xr = min(x + params.step_x, params.w - 1u);
    let xl = select(x - params.step_x, 0u, x < params.step_x);
    let yd = min(y + params.step_y, params.h - 1u);
    let yu = select(y - params.step_y, 0u, y < params.step_y);
    let dfx = flow_buf[y * params.w + xr].x - flow_buf[y * params.w + xl].x;
    let dfy = flow_buf[yd * params.w + x].y - flow_buf[yu * params.w + x].y;
    let divg = abs(dfx + dfy);

    let g_mag = clamp((env - params.t_lo) / max(params.t_hi - params.t_lo, 1e-3), 0.0, 1.0);
    let g_div = clamp((divg - params.t_div) / max(params.div_scale, 1e-3), 0.0, 1.0);
    let g = max(max(g_mag, g_div), params.leak);

    let pred = pred_buf[idx].x;
    let refv = ref_buf[idx].x;
    let stab = g * pred + (1.0 - g) * refv;

    output_buf[idx] = vec4<f32>(stab, env, 0.0, 0.0);
}
\`;var Yt=\`enable f16;

// Flow-gated temporal stabilizer (f16 storage, f32 gate math). Per pixel:
//   env = max(|flow.xy|, release\\xB7envPrev.y)      peak-hold (fast attack, slow release)
//   div = |\\u2202fx/\\u2202x + \\u2202fy/\\u2202y|                       flow divergence (occlusion seam)
//   g   = max(clamp((env-tLo)/(tHi-tLo),0,1), clamp((div-tDiv)/divScale,0,1), leak)
//   out = vec4((g\\xB7pred + (1-g)\\xB7ref).x, env, 0, 0)
// The divergence term opens the gate at occlusion/disocclusion boundaries (where
// the flow tears but the revealed-background magnitude is ~0). Finite-difference
// step spans ~1 base/4 pixel. alpha is in .x of pred/ref; env threads via .y.

struct Params {
    h        : u32,
    w        : u32,
    t_lo     : f32,
    t_hi     : f32,
    leak     : f32,
    release  : f32,
    t_div    : f32,
    div_scale: f32,
    step_x   : u32,
    step_y   : u32,
}

@group(0) @binding(0) var<storage, read>       flow_buf     : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       pred_buf     : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       ref_buf      : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       env_prev_buf : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params       : Params;
@group(0) @binding(5) var<storage, read_write> output_buf   : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }
    let idx = y * params.w + x;

    let mag      = length(vec2<f32>(flow_buf[idx].xy));
    let env_prev = f32(env_prev_buf[idx].y);
    let env      = max(mag, params.release * env_prev);

    // Flow divergence over a \\xB1step finite-difference (clamped to the edges).
    let xr = min(x + params.step_x, params.w - 1u);
    let xl = select(x - params.step_x, 0u, x < params.step_x);
    let yd = min(y + params.step_y, params.h - 1u);
    let yu = select(y - params.step_y, 0u, y < params.step_y);
    let dfx = f32(flow_buf[y * params.w + xr].x) - f32(flow_buf[y * params.w + xl].x);
    let dfy = f32(flow_buf[yd * params.w + x].y) - f32(flow_buf[yu * params.w + x].y);
    let divg = abs(dfx + dfy);

    let g_mag = clamp((env - params.t_lo) / max(params.t_hi - params.t_lo, 1e-3), 0.0, 1.0);
    let g_div = clamp((divg - params.t_div) / max(params.div_scale, 1e-3), 0.0, 1.0);
    let g = max(max(g_mag, g_div), params.leak);

    let pred = f32(pred_buf[idx].x);
    let refv = f32(ref_buf[idx].x);
    let stab = g * pred + (1.0 - g) * refv;

    output_buf[idx] = vec4<f16>(f16(stab), f16(env), 0.0h, 0.0h);
}
\`;var be=class extends f{constructor(r,e,i,o,n,s){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Yt:Kt,this.output=r.tensor(e.h,e.w,4),this.inputs=[e,i,o,n],this.createUniform("params","Params");let p=new Uint32Array(10);p[0]=e.h,p[1]=e.w;let l=new Float32Array(p.buffer);l[2]=s.tLo,l[3]=s.tHi,l[4]=s.leak,l[5]=s.release,l[6]=s.tDiv,l[7]=s.divScale,p[8]=s.stepX,p[9]=s.stepY,this.setUniform("params",p),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1]}};var Qt=\`// Bilinear upsample (arbitrary ratio), align_corners=False (matches PyTorch default).
// Input/output in NHWC vec4 format: index = y*W*(C/4) + x*(C/4) + c_group.
// Each thread computes one output pixel for one channel group (vec4 = 4 channels).

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    // align_corners=False: src = (out + 0.5) * (in / out) - 0.5
    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    // Clamp to [0, in-1] for border replication. Use i32 intermediates so that
    // floor() returning -1.0 doesn't produce an invalid u32 conversion.
    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = input_buf[y0 * IW * C + x0 * C + c];
    let tr = input_buf[y0 * IW * C + x1 * C + c];
    let bl = input_buf[y1 * IW * C + x0 * C + c];
    let br = input_buf[y1 * IW * C + x1 * C + c];

    // Bilinear blend \\u2014 vec4 ops are element-wise, so all 4 channels blend identically.
    let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
               +        wy  * ((1.0 - wx) * bl + wx * br);

    output_buf[oy * params.out_w * C + ox * C + c] = result;
}
\`;var Jt=\`enable f16;

// Bilinear upsample 2\\xD7 \\u2014 full f16 variant.
// Interpolation weights (wx, wy) and intermediate blends computed in f32 for
// accuracy; result cast to f16 on write.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = vec4<f32>(input_buf[y0 * IW * C + x0 * C + c]);
    let tr = vec4<f32>(input_buf[y0 * IW * C + x1 * C + c]);
    let bl = vec4<f32>(input_buf[y1 * IW * C + x0 * C + c]);
    let br = vec4<f32>(input_buf[y1 * IW * C + x1 * C + c]);

    let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
               +        wy  * ((1.0 - wx) * bl + wx * br);

    output_buf[oy * params.out_w * C + ox * C + c] = vec4<f16>(result);
}
\`;var ve=class extends f{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Jt:Qt;let o=e.c/4;this.output=r.tensor(i.outH,i.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,i.outH,i.outW,o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i.outW/8),Math.ceil(i.outH/8),o]}};var Zt=\`// Top-left crop (f32). See crop_f16.wgsl.

struct Params {
    in_w   : u32,
    out_h  : u32,
    out_w  : u32,
    groups : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let g = gid.z;
    if (x >= params.out_w || y >= params.out_h || g >= params.groups) { return; }
    let G = params.groups;
    output_buf[y * params.out_w * G + x * G + g] = input_buf[y * params.in_w * G + x * G + g];
}
\`;var er=\`enable f16;

// Top-left crop: output[y,x,g] = input[y,x,g] for y<outH, x<outW (training crop_like).

struct Params {
    in_w   : u32,
    out_h  : u32,
    out_w  : u32,
    groups : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let g = gid.z;
    if (x >= params.out_w || y >= params.out_h || g >= params.groups) { return; }
    let G = params.groups;
    output_buf[y * params.out_w * G + x * G + g] = input_buf[y * params.in_w * G + x * G + g];
}
\`;var xe=class extends f{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?er:Zt;let o=e.c/4;this.output=r.tensor(i.outH,i.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.w,i.outH,i.outW,o])),this.defaultSetup(),this.dispatch=[Math.ceil(i.outW/8),Math.ceil(i.outH/8),o]}};var tr=\`// Bicubic upsample (arbitrary scale) \\u2014 Keys cubic, a=-0.75 (PyTorch default
// for mode='bicubic', align_corners=False). Direct 2D, 4\\xD74 = 16 taps per
// output pixel. NHWC vec4 layout: index = y*W*(C/4) + x*(C/4) + c_group.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

const A: f32 = -0.75;

fn wcubic(d: f32) -> f32 {
    let ad = abs(d);
    if (ad <= 1.0) { return ((A + 2.0) * ad - (A + 3.0)) * ad * ad + 1.0; }
    if (ad <  2.0) { return ((A * ad - 5.0 * A) * ad + 8.0 * A) * ad - 4.0 * A; }
    return 0.0;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = i32(floor(src_x));
    let y0 = i32(floor(src_y));
    let fx = src_x - f32(x0);
    let fy = src_y - f32(y0);

    var wx: array<f32, 4>;
    var wy: array<f32, 4>;
    wx[0] = wcubic(1.0 + fx); wx[1] = wcubic(fx); wx[2] = wcubic(1.0 - fx); wx[3] = wcubic(2.0 - fx);
    wy[0] = wcubic(1.0 + fy); wy[1] = wcubic(fy); wy[2] = wcubic(1.0 - fy); wy[3] = wcubic(2.0 - fy);

    var acc: vec4<f32> = vec4<f32>(0.0);
    for (var j: i32 = 0; j < 4; j = j + 1) {
        let sy = u32(clamp(y0 + j - 1, 0, i32(IH) - 1));
        for (var i: i32 = 0; i < 4; i = i + 1) {
            let sx = u32(clamp(x0 + i - 1, 0, i32(IW) - 1));
            let v  = input_buf[sy * IW * C + sx * C + c];
            acc = acc + (wx[i] * wy[j]) * v;
        }
    }

    output_buf[oy * params.out_w * C + ox * C + c] = acc;
}
\`;var rr=\`enable f16;

// Bicubic upsample \\u2014 full f16 storage variant. Bicubic weights and the per-
// pixel accumulator are computed in f32 (cheap to keep precision around the
// kernel arithmetic), then demoted to f16 when written to the output buffer.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

const A: f32 = -0.75;

fn wcubic(d: f32) -> f32 {
    let ad = abs(d);
    if (ad <= 1.0) { return ((A + 2.0) * ad - (A + 3.0)) * ad * ad + 1.0; }
    if (ad <  2.0) { return ((A * ad - 5.0 * A) * ad + 8.0 * A) * ad - 4.0 * A; }
    return 0.0;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = i32(floor(src_x));
    let y0 = i32(floor(src_y));
    let fx = src_x - f32(x0);
    let fy = src_y - f32(y0);

    var wx: array<f32, 4>;
    var wy: array<f32, 4>;
    wx[0] = wcubic(1.0 + fx); wx[1] = wcubic(fx); wx[2] = wcubic(1.0 - fx); wx[3] = wcubic(2.0 - fx);
    wy[0] = wcubic(1.0 + fy); wy[1] = wcubic(fy); wy[2] = wcubic(1.0 - fy); wy[3] = wcubic(2.0 - fy);

    var acc: vec4<f32> = vec4<f32>(0.0);
    for (var j: i32 = 0; j < 4; j = j + 1) {
        let sy = u32(clamp(y0 + j - 1, 0, i32(IH) - 1));
        for (var i: i32 = 0; i < 4; i = i + 1) {
            let sx = u32(clamp(x0 + i - 1, 0, i32(IW) - 1));
            let v  = vec4<f32>(input_buf[sy * IW * C + sx * C + c]);
            acc = acc + (wx[i] * wy[j]) * v;
        }
    }

    output_buf[oy * params.out_w * C + ox * C + c] = vec4<f16>(acc);
}
\`;var ye=class extends f{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?rr:tr;let o=e.c/4;this.output=r.tensor(i.outH,i.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,i.outH,i.outW,o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i.outW/8),Math.ceil(i.outH/8),o]}};var or=\`// Channel concatenation: output = cat(A, B, dim=channel).
// Both A and B must share the same H\\xD7W and be in NHWC vec4 format.
// Output layout: for each (y, x), the first a_groups vec4s come from A,
// followed by b_groups vec4s from B.

struct Params {
    height    : u32,
    width     : u32,
    a_groups  : u32,  // Ca / 4
    b_groups  : u32,  // Cb / 4
    out_groups: u32,  // a_groups + b_groups
    _pad0     : u32,
    _pad1     : u32,
    _pad2     : u32,
}

@group(0) @binding(0) var<storage, read>       input_a    : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       input_b    : array<vec4<f32>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let c = gid.z;  // output channel group

    let W   = params.width;
    let Ag  = params.a_groups;
    let Bg  = params.b_groups;
    let Cg  = params.out_groups;

    if (x >= W || y >= params.height || c >= Cg) {
        return;
    }

    let out_idx = y * W * Cg + x * Cg + c;

    if (c < Ag) {
        output_buf[out_idx] = input_a[y * W * Ag + x * Ag + c];
    } else {
        let c_b = c - Ag;
        output_buf[out_idx] = input_b[y * W * Bg + x * Bg + c_b];
    }
}
\`;var ir=\`enable f16;

// Channel concatenation \\u2014 full f16 variant.

struct Params {
    height    : u32,
    width     : u32,
    a_groups  : u32,
    b_groups  : u32,
    out_groups: u32,
    _pad0     : u32,
    _pad1     : u32,
    _pad2     : u32,
}

@group(0) @binding(0) var<storage, read>       input_a    : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       input_b    : array<vec4<f16>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let c = gid.z;

    let W  = params.width;
    let Ag = params.a_groups;
    let Bg = params.b_groups;
    let Cg = params.out_groups;

    if (x >= W || y >= params.height || c >= Cg) { return; }

    let out_idx = y * W * Cg + x * Cg + c;
    if (c < Ag) {
        output_buf[out_idx] = input_a[y * W * Ag + x * Ag + c];
    } else {
        let c_b = c - Ag;
        output_buf[out_idx] = input_b[y * W * Bg + x * Bg + c_b];
    }
}
\`;var we=class extends f{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?ir:or;let o=e.c/4,n=i.c/4,s=o+n;this.output=r.tensor(e.h,e.w,e.c+i.c),this.inputs=[e,i],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,n,s,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),s]}};var ar=\`// Conv2d + skip add fused.
// Identical to conv2d.wgsl except skip is an activation input (binding 1),
// added element-wise to the conv result at write time.
// Eliminates the separate add dispatch and its intermediate buffer round-trip.
// Binding order: input(0), skip(1), weights(2), bias(3), params(4), output(5)

struct Params {
    in_h        : u32,
    in_w        : u32,
    out_h       : u32,
    out_w       : u32,
    in_groups   : u32,
    out_groups  : u32,
    kernel_h    : u32,
    kernel_w    : u32,
    stride      : u32,
    pad_top     : u32,
    pad_left    : u32,
    activation  : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       skip_buf   : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let o = gid.z;

    if (x >= params.out_w || y >= params.out_h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;

    var result = bias_buf[o];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let in_y = u32(in_y_s);
            let in_x = u32(in_x_s);
            let z    = ky * params.kernel_w + kx;

            for (var i = 0u; i < I; i++) {
                let in_idx = in_y * params.in_w * I + in_x * I + i;
                let w_idx  = z * O * I + o * I + i;
                result += weight_buf[w_idx] * input_buf[in_idx];
            }
        }
    }

    if (params.activation == 1u) {
        result = clamp(result, vec4<f32>(0.0), vec4<f32>(6.0));
    } else if (params.activation == 2u) {
        result = max(result, vec4<f32>(0.0));
    }

    let out_idx = y * params.out_w * O + x * O + o;
    output_buf[out_idx] = result + skip_buf[out_idx];
}
\`;var nr=\`enable f16;

// Conv2d + skip add fused \\u2014 full f16 variant.

struct Params {
    in_h        : u32,
    in_w        : u32,
    out_h       : u32,
    out_w       : u32,
    in_groups   : u32,
    out_groups  : u32,
    kernel_h    : u32,
    kernel_w    : u32,
    stride      : u32,
    pad_top     : u32,
    pad_left    : u32,
    activation  : u32,
}

// Binding order matches conv2d_add.wgsl: input(0), skip(1), weight(2), bias(3),
// params(4), output(5).
@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       skip_buf   : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let o = gid.z;

    if (x >= params.out_w || y >= params.out_h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;

    var result = bias_buf[o];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let in_y = u32(in_y_s);
            let in_x = u32(in_x_s);
            let z    = ky * params.kernel_w + kx;

            for (var i = 0u; i < I; i++) {
                let in_idx = in_y * params.in_w * I + in_x * I + i;
                let w_idx  = z * O * I + o * I + i;
                result += weight_buf[w_idx] * input_buf[in_idx];
            }
        }
    }

    if (params.activation == 1u) {
        result = clamp(result, vec4<f16>(0.0h), vec4<f16>(6.0h));
    } else if (params.activation == 2u) {
        result = max(result, vec4<f16>(0.0h));
    }

    let out_idx = y * params.out_w * O + x * O + o;
    output_buf[out_idx] = result + skip_buf[out_idx];
}
\`;var ke=class extends f{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?nr:ar;let s=T(e.h,n.kernel,n.stride,n.padding),p=T(e.w,n.kernel,n.stride,n.padding),l=e.c/4,c=n.outChannels/4,d=C(n.padding,e.h,s,n.kernel,n.stride),_=C(n.padding,e.w,p,n.kernel,n.stride);this.output=r.tensor(s,p,n.outChannels),this.inputs=[e,i],this.weights=[r.upload(m(o.weights)),r.upload(m(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,s,p,l,c,n.kernel,n.kernel,n.stride,d,_,n.activation==="relu6"?1:0])),this.defaultSetup(),this.dispatch=[Math.ceil(p/8),Math.ceil(s/8),c]}};var sr=\`// proj_residual: bespoke 1\\xD71 conv (no activation) + residual add, fused.
// Specializes conv2d_add to kernel=1 / stride=1 / pad=0 / no activation: drops
// the kernel loop, the padding checks, and the activation branch. Used by the
// MBConv project+residual tail. Both inputs share the same spatial resolution.
//
// Weight layout: [out_groups][in_groups] mat4x4 (no K*K dim since K=1).
// Bias: [out_groups] vec4.
// Binding order: input(0), skip(1), weights(2), bias(3), params(4), output(5)

struct Params {
    h          : u32,
    w          : u32,
    in_groups  : u32,
    out_groups : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       skip_buf   : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let o = gid.z;

    if (x >= params.w || y >= params.h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let pix = y * params.w + x;

    var result = bias_buf[o];
    for (var i = 0u; i < I; i++) {
        result += weight_buf[o * I + i] * input_buf[pix * I + i];
    }
    result += skip_buf[pix * O + o];

    output_buf[pix * O + o] = result;
}
\`;var ur=\`enable f16;

// proj_residual \\u2014 full f16 variant. See proj_residual.wgsl for layout details.
// Bespoke 1\\xD71 conv (no activation) + residual add, fused.
// Binding order: input(0), skip(1), weights(2), bias(3), params(4), output(5)

struct Params {
    h          : u32,
    w          : u32,
    in_groups  : u32,
    out_groups : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       skip_buf   : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let o = gid.z;

    if (x >= params.w || y >= params.h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let pix = y * params.w + x;

    var result = bias_buf[o];
    for (var i = 0u; i < I; i++) {
        result += weight_buf[o * I + i] * input_buf[pix * I + i];
    }
    result += skip_buf[pix * O + o];

    output_buf[pix * O + o] = result;
}
\`;var Te=class extends f{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?ur:sr;let s=e.c/4,p=n.outChannels/4;this.output=r.tensor(e.h,e.w,n.outChannels),this.inputs=[e,i],this.weights=[r.upload(m(o.weights)),r.upload(m(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,s,p])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),p]}};var pr=\`// concat_conv2d: fuses [concat(a, b) \\u2192 conv 3\\xD73 (pad 1) \\u2192 relu6] into one
// dispatch. Both inputs are already at the output resolution (the upstream
// upsample stays a separate dispatch writing a clean intermediate, so the conv
// reads are plain-indexed). Identical math to conv2d; the only difference is
// that input channels are split across two buffers: weight cols [0, a_groups)
// read a, [a_groups, I) read b.
//
// Weight layout matches conv2d: [kpos][out_groups][in_groups] mat4x4, where
// in_groups = a_groups + b_groups and the input channel order is [a, b].
// Binding order: a(0), b(1), weights(2), bias(3), params(4), output(5)

struct Params {
    h          : u32,   // a, b and output all share this shape
    w          : u32,
    a_groups   : u32,
    b_groups   : u32,
    out_groups : u32,
    _pad0      : u32,
    _pad1      : u32,
    _pad2      : u32,
}

@group(0) @binding(0) var<storage, read>       buf_a      : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       buf_b      : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(4) var<uniform>             p          : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y; let o = gid.z;
    if (x >= p.w || y >= p.h || o >= p.out_groups) { return; }

    let A = p.a_groups;
    let B = p.b_groups;
    let I = A + B;
    let O = p.out_groups;

    var result = bias_buf[o];

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let nx = i32(x + kx) - 1;
            let ny = i32(y + ky) - 1;
            if (nx < 0 || ny < 0 || u32(nx) >= p.w || u32(ny) >= p.h) { continue; }
            let z   = ky * 3u + kx;
            let pix = u32(ny) * p.w + u32(nx);
            for (var i = 0u; i < A; i++) {
                result += weight_buf[z * O * I + o * I + i] * buf_a[pix * A + i];
            }
            for (var i = 0u; i < B; i++) {
                result += weight_buf[z * O * I + o * I + (A + i)] * buf_b[pix * B + i];
            }
        }
    }

    result = clamp(result, vec4<f32>(0.0), vec4<f32>(6.0));
    output_buf[(y * p.w + x) * O + o] = result;
}
\`;var lr=\`enable f16;

// concat_conv2d \\u2014 full f16 variant. See concat_conv2d.wgsl for layout details.
// Fuses [concat(a, b) \\u2192 conv 3\\xD73 (pad 1) \\u2192 relu6] into one dispatch.
// Binding order: a(0), b(1), weights(2), bias(3), params(4), output(5)

struct Params {
    h          : u32,
    w          : u32,
    a_groups   : u32,
    b_groups   : u32,
    out_groups : u32,
    _pad0      : u32,
    _pad1      : u32,
    _pad2      : u32,
}

@group(0) @binding(0) var<storage, read>       buf_a      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       buf_b      : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             p          : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y; let o = gid.z;
    if (x >= p.w || y >= p.h || o >= p.out_groups) { return; }

    let A = p.a_groups;
    let B = p.b_groups;
    let I = A + B;
    let O = p.out_groups;

    var result = bias_buf[o];

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let nx = i32(x + kx) - 1;
            let ny = i32(y + ky) - 1;
            if (nx < 0 || ny < 0 || u32(nx) >= p.w || u32(ny) >= p.h) { continue; }
            let z   = ky * 3u + kx;
            let pix = u32(ny) * p.w + u32(nx);
            for (var i = 0u; i < A; i++) {
                result += weight_buf[z * O * I + o * I + i] * buf_a[pix * A + i];
            }
            for (var i = 0u; i < B; i++) {
                result += weight_buf[z * O * I + o * I + (A + i)] * buf_b[pix * B + i];
            }
        }
    }

    result = clamp(result, vec4<f16>(0.0h), vec4<f16>(6.0h));
    output_buf[(y * p.w + x) * O + o] = result;
}
\`;var Ce=class extends f{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?lr:pr;let s=e.c/4,p=i.c/4,l=n.outChannels/4;this.output=r.tensor(e.h,e.w,n.outChannels),this.inputs=[e,i],this.weights=[r.upload(m(o.weights)),r.upload(m(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,s,p,l,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),l]}};var cr=\`// gates_fused: ConvGRU z + r gates, fused into one dispatch.
// Production config (c_up=2, split_ratio=0.5 \\u2192 passthrough=1, recurrent=1):
//   u_in   : c_up=2 packed in a vec4 (.x = passthrough a, .y = recurrent b)
//   h_prev : hidden carrier \\u2014 recurrent state in .z (see cand_update_fused: the
//            GRU output tensor doubles as next frame's h_prev, hidden in .z)
// Weight: 9 vec4 per kpos = (z_w_b, z_w_h, r_w_b, r_w_h). Bias .xy = (z, r).
// Output: vec4(z, r, 0, 0) \\u2014 consumed by cand_update_fused.
// Binding order: u_in(0), h_prev(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_in_buf   : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       h_prev_buf : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<vec4<f32>>;   // 9 vec4
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .xy = (z, r)
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    let bias = bias_buf[0].xy;
    var z_pre = bias.x;
    var r_pre = bias.y;

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let idx  = u32(iy) * params.w + u32(ix);
            let b_n  = u_in_buf[idx].y;
            let h_n  = h_prev_buf[idx].z;
            let w    = weight_buf[kpos];
            z_pre += w.x * b_n + w.y * h_n;
            r_pre += w.z * b_n + w.w * h_n;
        }
    }

    let z = 1.0 / (1.0 + exp(-z_pre));
    let r = 1.0 / (1.0 + exp(-r_pre));
    output_buf[y * params.w + x] = vec4<f32>(z, r, 0.0, 0.0);
}
\`;var dr=\`enable f16;

// gates_fused \\u2014 full f16 variant. See gates_fused.wgsl for layout details.
// ConvGRU z + r gates (production config c_up=2, recurrent=1).
// Binding order: u_in(0), h_prev(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_in_buf   : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       h_prev_buf : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    let bias = bias_buf[0].xy;
    var z_pre = bias.x;
    var r_pre = bias.y;

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let idx  = u32(iy) * params.w + u32(ix);
            let b_n  = u_in_buf[idx].y;
            let h_n  = h_prev_buf[idx].z;
            let w    = weight_buf[kpos];
            z_pre += w.x * b_n + w.y * h_n;
            r_pre += w.z * b_n + w.w * h_n;
        }
    }

    let z = 1.0h / (1.0h + exp(-z_pre));
    let r = 1.0h / (1.0h + exp(-r_pre));
    output_buf[y * params.w + x] = vec4<f16>(z, r, 0.0h, 0.0h);
}
\`;var We=class extends f{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?dr:cr,this.output=r.tensor(e.h,e.w,4),this.inputs=[e,i],this.weights=[r.upload(m(o.weights)),r.upload(y(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1]}};var mr=\`// cand_update_fused: ConvGRU candidate path + state update + output, fused.
// Production config (c_up=2, recurrent=1):
//   u_in      : c_up=2 (.x = a passthrough, .y = b recurrent)
//   h_prev    : hidden carrier \\u2014 recurrent state in .z (the previous frame's
//               output of THIS op; on frame 0 it is a zero tensor)
//   gates_out : (.x = z, .y = r) from gates_fused
// cand_pre = bias + \\u03A3_kpos (b_w*b_n + rh_w*(r_n*h_n));  h_til = tanh(cand_pre);
//   h_new = (1-z)*h_prev + z*h_til;  b_out = b + gamma*h_new.
// Output: vec4(a, b_out, h_new, 0) \\u2014 .xy is the c_up=2 feature consumed
// downstream; .z carries h_new so the same tensor is fed back as next h_prev
// (no separate hidden-state buffer). Cand weight: 9 vec4 per kpos, .xy = (b_w, rh_w).
// Binding order: u_in(0), h_prev(1), gates_out(2), weight(3), bias(4), gamma(5), params(6), output(7)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_in_buf      : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       h_prev_buf    : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       gates_out_buf : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read>       weight_buf    : array<vec4<f32>>;   // 9 vec4
@group(0) @binding(4) var<storage, read>       bias_buf      : array<vec4<f32>>;   // .x = cand_bias
@group(0) @binding(5) var<storage, read>       gamma_buf     : array<vec4<f32>>;   // .x = gamma
@group(0) @binding(6) var<uniform>             params        : Params;
@group(0) @binding(7) var<storage, read_write> output_buf    : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var cand_pre = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let idx  = u32(iy) * params.w + u32(ix);
            let b_n  = u_in_buf[idx].y;
            let h_n  = h_prev_buf[idx].z;
            let r_n  = gates_out_buf[idx].y;
            let w    = weight_buf[kpos].xy;
            cand_pre += w.x * b_n + w.y * (r_n * h_n);
        }
    }

    let h_til      = tanh(cand_pre);
    let cur        = y * params.w + x;
    let u_cur      = u_in_buf[cur];
    let z_cur      = gates_out_buf[cur].x;
    let h_prev_cur = h_prev_buf[cur].z;
    let h_new      = (1.0 - z_cur) * h_prev_cur + z_cur * h_til;
    let b_out      = u_cur.y + gamma_buf[0].x * h_new;
    output_buf[cur] = vec4<f32>(u_cur.x, b_out, h_new, 0.0);
}
\`;var fr=\`enable f16;

// cand_update_fused \\u2014 full f16 variant. See cand_update_fused.wgsl for details.
// ConvGRU candidate + state update + output (production config c_up=2, recurrent=1).
// Binding order: u_in(0), h_prev(1), gates_out(2), weight(3), bias(4), gamma(5), params(6), output(7)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_in_buf      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       h_prev_buf    : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       gates_out_buf : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       weight_buf    : array<vec4<f16>>;
@group(0) @binding(4) var<storage, read>       bias_buf      : array<vec4<f16>>;
@group(0) @binding(5) var<storage, read>       gamma_buf     : array<vec4<f16>>;
@group(0) @binding(6) var<uniform>             params        : Params;
@group(0) @binding(7) var<storage, read_write> output_buf    : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var cand_pre = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let idx  = u32(iy) * params.w + u32(ix);
            let b_n  = u_in_buf[idx].y;
            let h_n  = h_prev_buf[idx].z;
            let r_n  = gates_out_buf[idx].y;
            let w    = weight_buf[kpos].xy;
            cand_pre += w.x * b_n + w.y * (r_n * h_n);
        }
    }

    let h_til      = tanh(cand_pre);
    let cur        = y * params.w + x;
    let u_cur      = u_in_buf[cur];
    let z_cur      = gates_out_buf[cur].x;
    let h_prev_cur = h_prev_buf[cur].z;
    let h_new      = (1.0h - z_cur) * h_prev_cur + z_cur * h_til;
    let b_out      = u_cur.y + gamma_buf[0].x * h_new;
    output_buf[cur] = vec4<f16>(u_cur.x, b_out, h_new, 0.0h);
}
\`;var Pe=class extends f{constructor(r,e,i,o,n,s){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?fr:mr,this.output=r.tensor(e.h,e.w,4),this.inputs=[e,i,o],this.weights=[r.upload(m(n.weights)),r.upload(y(n.bias)),r.upload(y(s))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1]}};var hr=\`// conv_expand: bespoke N\\u21922 conv 3\\xD73 (pad 1) + relu (wrapper expand_feat).
// Expands feat_lr (in_c, mult of 4) to the c_up=2 carrier \\u2014 output .xy = the 2
// native channels, .zw = 0. mat4x2 per (kpos, in_group) with a vec2 accumulator.
// Weight: 9 * in_groups mat4x2 (8 floats each, col-major). Bias .xy.
// Binding order: input(0), weights(1), bias(2), params(3), output(4)

struct Params { h: u32, w: u32, in_groups: u32, _pad: u32 }

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x2<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .xy used
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var result = bias_buf[0].xy;
    let I = params.in_groups;

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            for (var i = 0u; i < I; i++) {
                let in_idx = (u32(iy) * params.w + u32(ix)) * I + i;
                result += weight_buf[kpos * I + i] * input_buf[in_idx];
            }
        }
    }

    result = max(result, vec2<f32>(0.0));   // expand_feat is F.relu
    output_buf[y * params.w + x] = vec4<f32>(result, 0.0, 0.0);
}
\`;var _r=\`enable f16;

// conv_expand \\u2014 full f16 variant. See conv_expand.wgsl for layout details.
// Bespoke N\\u21922 conv 3\\xD73 (pad 1) + relu (wrapper expand_feat).
// Binding order: input(0), weights(1), bias(2), params(3), output(4)

struct Params { h: u32, w: u32, in_groups: u32, _pad: u32 }

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x2<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var result = bias_buf[0].xy;
    let I = params.in_groups;

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            for (var i = 0u; i < I; i++) {
                let in_idx = (u32(iy) * params.w + u32(ix)) * I + i;
                result += weight_buf[kpos * I + i] * input_buf[in_idx];
            }
        }
    }

    result = max(result, vec2<f16>(0.0h));
    output_buf[y * params.w + x] = vec4<f16>(result, 0.0h, 0.0h);
}
\`;var Ge=class extends f{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?_r:hr;let o=e.c/4;this.output=r.tensor(e.h,e.w,4),this.inputs=[e],this.weights=[r.upload(m(i.weights)),r.upload(y(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1]}};var gr=\`// cat_conv_6to2: fused concat(u, d) + 6\\u21922 conv 3\\xD73 (pad 1) + relu (E up1_combine).
// u = c_up=2 carrier (.xy); d = c_high=4 (full vec4). Both same resolution.
// Channel order concat([u, d]) = (u.x, u.y, d.x, d.y, d.z, d.w), split into
//   v3a = (u.x, u.y, d.x)   v3b = d.yzw
// Weight: 9 * 2 mat3x2 (6 floats each, col-major). Bias .xy. Output c_up=2 carrier.
// Binding order: u(0), d(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_buf      : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       d_buf      : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat3x2<f32>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .xy used
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var result = bias_buf[0].xy;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let pix = u32(iy) * params.w + u32(ix);
            let u = u_buf[pix];
            let d = d_buf[pix];
            let v3a = vec3<f32>(u.xy, d.x);
            let v3b = d.yzw;
            result += weight_buf[kpos * 2u + 0u] * v3a;
            result += weight_buf[kpos * 2u + 1u] * v3b;
        }
    }

    result = max(result, vec2<f32>(0.0));   // up1_combine is F.relu
    output_buf[y * params.w + x] = vec4<f32>(result, 0.0, 0.0);
}
\`;var br=\`enable f16;

// cat_conv_6to2 \\u2014 full f16 variant. See cat_conv_6to2.wgsl for layout details.
// Fused concat(u, d) + 6\\u21922 conv 3\\xD73 (pad 1) + relu (E up1_combine).
// Binding order: u(0), d(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_buf      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       d_buf      : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat3x2<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var result = bias_buf[0].xy;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let pix = u32(iy) * params.w + u32(ix);
            let u = u_buf[pix];
            let d = d_buf[pix];
            let v3a = vec3<f16>(u.xy, d.x);
            let v3b = d.yzw;
            result += weight_buf[kpos * 2u + 0u] * v3a;
            result += weight_buf[kpos * 2u + 1u] * v3b;
        }
    }

    result = max(result, vec2<f16>(0.0h));
    output_buf[y * params.w + x] = vec4<f16>(result, 0.0h, 0.0h);
}
\`;var Be=class extends f{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?br:gr,this.output=r.tensor(e.h,e.w,4),this.inputs=[e,i],this.weights=[r.upload(m(o.weights)),r.upload(y(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1]}};var vr=\`// down_adapter: fused stride-N 3\\xD73 conv (4\\u21924) + relu + 1\\xD71 adapter (4\\u21923, no
// act) into one dispatch. E variant: down2 (c_high=4 \\u2192 c_low=4, stride 2) +
// adapter. A/B variant: down1 (RGB .xyz \\u2192 4, stride 2/3) + adapter (the down
// weight's 4th input column is zeroed at export for RGB input). Symmetric pad.
//
// down_w: 9 mat4x4 (3\\xD73, 4\\u21924). adapt_w: 1 mat4x4 (1\\xD71, 4\\u21924 padded from 4\\u21923,
// last row 0). adapt_b: .xyz used. Output: vec4(adapter.xyz, 0).
// Binding order: input(0), down_w(1), down_b(2), adapt_w(3), adapt_b(4), params(5), output(6)

struct Params {
    in_h     : u32,
    in_w     : u32,
    out_h    : u32,
    out_w    : u32,
    stride   : u32,
    pad_top  : u32,
    pad_left : u32,
    _pad     : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       down_w     : array<mat4x4<f32>>;   // 9 mat4x4
@group(0) @binding(2) var<storage, read>       down_b     : array<vec4<f32>>;     // 1 vec4
@group(0) @binding(3) var<storage, read>       adapt_w    : array<mat4x4<f32>>;   // 1 mat4x4
@group(0) @binding(4) var<storage, read>       adapt_b    : array<vec4<f32>>;     // .xyz used
@group(0) @binding(5) var<uniform>             p          : Params;
@group(0) @binding(6) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= p.out_w || y >= p.out_h) { return; }

    var down_out = down_b[0];
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y * p.stride + ky) - i32(p.pad_top);
            let ix = i32(x * p.stride + kx) - i32(p.pad_left);
            if (iy < 0 || ix < 0 || u32(iy) >= p.in_h || u32(ix) >= p.in_w) { continue; }
            let kpos = ky * 3u + kx;
            down_out += down_w[kpos] * input_buf[u32(iy) * p.in_w + u32(ix)];
        }
    }
    down_out = max(down_out, vec4<f32>(0.0));   // F.relu

    let adapt_out = adapt_w[0] * down_out + adapt_b[0];
    output_buf[y * p.out_w + x] = vec4<f32>(adapt_out.xyz, 0.0);
}
\`;var xr=\`enable f16;

// down_adapter \\u2014 full f16 variant. See down_adapter.wgsl for layout details.
// Fused stride-N 3\\xD73 conv (4\\u21924) + relu + 1\\xD71 adapter (4\\u21923, no act).
// Binding order: input(0), down_w(1), down_b(2), adapt_w(3), adapt_b(4), params(5), output(6)

struct Params {
    in_h     : u32,
    in_w     : u32,
    out_h    : u32,
    out_w    : u32,
    stride   : u32,
    pad_top  : u32,
    pad_left : u32,
    _pad     : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       down_w     : array<mat4x4<f16>>;
@group(0) @binding(2) var<storage, read>       down_b     : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       adapt_w    : array<mat4x4<f16>>;
@group(0) @binding(4) var<storage, read>       adapt_b    : array<vec4<f16>>;
@group(0) @binding(5) var<uniform>             p          : Params;
@group(0) @binding(6) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= p.out_w || y >= p.out_h) { return; }

    var down_out = down_b[0];
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y * p.stride + ky) - i32(p.pad_top);
            let ix = i32(x * p.stride + kx) - i32(p.pad_left);
            if (iy < 0 || ix < 0 || u32(iy) >= p.in_h || u32(ix) >= p.in_w) { continue; }
            let kpos = ky * 3u + kx;
            down_out += down_w[kpos] * input_buf[u32(iy) * p.in_w + u32(ix)];
        }
    }
    down_out = max(down_out, vec4<f16>(0.0h));

    let adapt_out = adapt_w[0] * down_out + adapt_b[0];
    output_buf[y * p.out_w + x] = vec4<f16>(adapt_out.xyz, 0.0h);
}
\`;var Ue=class extends f{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?xr:vr;let s=T(e.h,3,n.stride,1),p=T(e.w,3,n.stride,1),l=C(1,e.h,s,3,n.stride),c=C(1,e.w,p,3,n.stride);this.output=r.tensor(s,p,4),this.inputs=[e],this.weights=[r.upload(m(i.weights)),r.upload(y(i.bias)),r.upload(m(o.weights)),r.upload(y(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,s,p,n.stride,l,c,0])),this.defaultSetup(),this.dispatch=[Math.ceil(p/8),Math.ceil(s/8),1]}};var yr=\`// up_final: fused concat(u, rgb) \\u2192 conv 3\\xD73 5\\u21921 \\u2192 sigmoid (A/B alpha head).
// u = c_up=2 carrier (.xy); rgb = x_hr (.xyz). 5 inputs \\u2192 1 alpha (output .x).
// Weight: 18 vec4 \\u2014 [0..8] = (w0, w1, 0, 0) for u per kpos; [9..17] =
// (w2, w3, w4, 0) for rgb per kpos. Bias .x.
// Binding order: u(0), rgb(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_gru      : array<vec4<f32>>;   // .xy
@group(0) @binding(1) var<storage, read>       rgb        : array<vec4<f32>>;   // .xyz
@group(0) @binding(2) var<storage, read>       weight_buf : array<vec4<f32>>;   // 18 vec4
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .x
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;   // .x = alpha

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var acc = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let p = u32(iy) * params.w + u32(ix);
            acc += dot(weight_buf[kpos].xy,       u_gru[p].xy);
            acc += dot(weight_buf[9u + kpos].xyz, rgb[p].xyz);
        }
    }

    output_buf[y * params.w + x] = vec4<f32>(1.0 / (1.0 + exp(-acc)), 0.0, 0.0, 0.0);
}
\`;var wr=\`enable f16;

// up_final \\u2014 full f16 variant. See up_final.wgsl for layout details.
// Fused concat(u, rgb) \\u2192 conv 3\\xD73 5\\u21921 \\u2192 sigmoid (A/B alpha head).
// Binding order: u(0), rgb(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_gru      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       rgb        : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var acc = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let p = u32(iy) * params.w + u32(ix);
            acc += dot(weight_buf[kpos].xy,       u_gru[p].xy);
            acc += dot(weight_buf[9u + kpos].xyz, rgb[p].xyz);
        }
    }

    output_buf[y * params.w + x] = vec4<f16>(1.0h / (1.0h + exp(-acc)), 0.0h, 0.0h, 0.0h);
}
\`;var Se=class extends f{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?wr:yr,this.output=r.tensor(e.h,e.w,4),this.inputs=[e,i],this.weights=[r.upload(m(o.weights)),r.upload(y(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1]}};var kr=\`// up_final_skip: C/D alpha head. Fused concat(u, d_full, rgb) \\u2192 conv 3\\xD73 9\\u21921
// \\u2192 sigmoid. u = c_up=2 (.xy); d_full = c_high=4 full-res skip (full vec4);
// rgb = x_hr (.xyz). Channel order concat = 2 + 4 + 3 = 9. Output .x = alpha.
// Weight: 27 vec4 (3 per kpos): [kpos*3+0]=(w0,w1,0,0) u; [kpos*3+1]=(w2..w5)
// d_full; [kpos*3+2]=(w6,w7,w8,0) rgb. Bias .x.
// Binding order: u(0), d_full(1), rgb(2), weights(3), bias(4), params(5), output(6)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_gru      : array<vec4<f32>>;   // .xy
@group(0) @binding(1) var<storage, read>       d_full     : array<vec4<f32>>;   // full vec4
@group(0) @binding(2) var<storage, read>       rgb        : array<vec4<f32>>;   // .xyz
@group(0) @binding(3) var<storage, read>       weight_buf : array<vec4<f32>>;   // 27 vec4
@group(0) @binding(4) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .x
@group(0) @binding(5) var<uniform>             params     : Params;
@group(0) @binding(6) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var acc = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let p = u32(iy) * params.w + u32(ix);
            acc += dot(weight_buf[kpos * 3u + 0u].xy,  u_gru[p].xy);
            acc += dot(weight_buf[kpos * 3u + 1u],     d_full[p]);
            acc += dot(weight_buf[kpos * 3u + 2u].xyz, rgb[p].xyz);
        }
    }

    output_buf[y * params.w + x] = vec4<f32>(1.0 / (1.0 + exp(-acc)), 0.0, 0.0, 0.0);
}
\`;var Tr=\`enable f16;

// up_final_skip \\u2014 full f16 variant. See up_final_skip.wgsl for layout details.
// C/D alpha head: fused concat(u, d_full, rgb) \\u2192 conv 3\\xD73 9\\u21921 \\u2192 sigmoid.
// Binding order: u(0), d_full(1), rgb(2), weights(3), bias(4), params(5), output(6)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_gru      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       d_full     : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       rgb        : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       weight_buf : array<vec4<f16>>;
@group(0) @binding(4) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(5) var<uniform>             params     : Params;
@group(0) @binding(6) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var acc = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let p = u32(iy) * params.w + u32(ix);
            acc += dot(weight_buf[kpos * 3u + 0u].xy,  u_gru[p].xy);
            acc += dot(weight_buf[kpos * 3u + 1u],     d_full[p]);
            acc += dot(weight_buf[kpos * 3u + 2u].xyz, rgb[p].xyz);
        }
    }

    output_buf[y * params.w + x] = vec4<f16>(1.0h / (1.0h + exp(-acc)), 0.0h, 0.0h, 0.0h);
}
\`;var Le=class extends f{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Tr:kr,this.output=r.tensor(e.h,e.w,4),this.inputs=[e,i,o],this.weights=[r.upload(m(n.weights)),r.upload(y(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1]}};var Cr=\`// Bilinear upsample + channel concat fused.
// input_a is the decoder tensor at small spatial resolution (in_h \\xD7 in_w).
// input_b is the encoder skip feature already at output resolution (out_h \\xD7 out_w).
// For output channels 0..a_groups-1: bilinearly interpolate from input_a.
// For output channels a_groups..out_groups-1: copy directly from input_b.
// Eliminates the intermediate upsample buffer and the separate concat dispatch.

struct Params {
    in_h       : u32,   // input_a spatial height
    in_w       : u32,   // input_a spatial width
    out_h      : u32,
    out_w      : u32,
    a_groups   : u32,   // input_a channel groups (upsampled)
    b_groups   : u32,   // input_b channel groups (encoder feature)
    out_groups : u32,   // a_groups + b_groups
    _pad0      : u32,
}

@group(0) @binding(0) var<storage, read>       input_a    : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       input_b    : array<vec4<f32>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.out_groups) { return; }

    let out_idx = oy * params.out_w * params.out_groups + ox * params.out_groups + c;

    if (c < params.a_groups) {
        let IH = params.in_h;
        let IW = params.in_w;
        let AG = params.a_groups;

        let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
        let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

        let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
        let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
        let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
        let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

        let wx = src_x - floor(src_x);
        let wy = src_y - floor(src_y);

        let tl = input_a[y0 * IW * AG + x0 * AG + c];
        let tr = input_a[y0 * IW * AG + x1 * AG + c];
        let bl = input_a[y1 * IW * AG + x0 * AG + c];
        let br = input_a[y1 * IW * AG + x1 * AG + c];

        output_buf[out_idx] = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
                            +        wy  * ((1.0 - wx) * bl + wx * br);
    } else {
        let c_b = c - params.a_groups;
        output_buf[out_idx] = input_b[oy * params.out_w * params.b_groups + ox * params.b_groups + c_b];
    }
}
\`;var Wr=\`enable f16;

// Bilinear upsample + channel concat fused \\u2014 full f16 variant.
// Bilinear weights (wx, wy) and intermediate blends computed in f32; result cast to f16.

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    a_groups   : u32,
    b_groups   : u32,
    out_groups : u32,
    _pad0      : u32,
}

@group(0) @binding(0) var<storage, read>       input_a    : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       input_b    : array<vec4<f16>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.out_groups) { return; }

    let out_idx = oy * params.out_w * params.out_groups + ox * params.out_groups + c;

    if (c < params.a_groups) {
        let IH = params.in_h;
        let IW = params.in_w;
        let AG = params.a_groups;

        let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
        let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

        let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
        let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
        let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
        let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

        let wx = src_x - floor(src_x);
        let wy = src_y - floor(src_y);

        let tl = vec4<f32>(input_a[y0 * IW * AG + x0 * AG + c]);
        let tr = vec4<f32>(input_a[y0 * IW * AG + x1 * AG + c]);
        let bl = vec4<f32>(input_a[y1 * IW * AG + x0 * AG + c]);
        let br = vec4<f32>(input_a[y1 * IW * AG + x1 * AG + c]);

        let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
                   +        wy  * ((1.0 - wx) * bl + wx * br);
        output_buf[out_idx] = vec4<f16>(result);
    } else {
        let c_b = c - params.a_groups;
        output_buf[out_idx] = input_b[oy * params.out_w * params.b_groups + ox * params.b_groups + c_b];
    }
}
\`;var Fe=class extends f{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Wr:Cr;let n=e.c/4,s=i.c/4,p=n+s;this.output=r.tensor(o.outH,o.outW,e.c+i.c),this.inputs=[e,i],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o.outH,o.outW,n,s,p,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o.outW/8),Math.ceil(o.outH/8),p]}};var Pr=\`// Bilinear upsample + 1\\xD71 pointwise conv fused.
// For each output pixel, bilinearly samples the small input for each in_group,
// immediately applies the 1\\xD71 conv weights, and writes the activated result.
// Eliminates the intermediate full-resolution upsample buffer.

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    in_groups  : u32,
    out_groups : u32,
    activation : u32,
    _pad0      : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let og = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || og >= params.out_groups) { return; }

    let IH = params.in_h;
    let IW = params.in_w;
    let IG = params.in_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    var result = bias_buf[og];

    for (var ig = 0u; ig < IG; ig++) {
        let tl = input_buf[y0 * IW * IG + x0 * IG + ig];
        let tr = input_buf[y0 * IW * IG + x1 * IG + ig];
        let bl = input_buf[y1 * IW * IG + x0 * IG + ig];
        let br = input_buf[y1 * IW * IG + x1 * IG + ig];

        let sampled = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
                    +        wy  * ((1.0 - wx) * bl + wx * br);

        result += weight_buf[og * IG + ig] * sampled;
    }

    if (params.activation == 1u) {
        result = clamp(result, vec4<f32>(0.0), vec4<f32>(6.0));
    } else if (params.activation == 2u) {
        result = result * clamp(result + 3.0, vec4<f32>(0.0), vec4<f32>(6.0)) / 6.0;
    }

    output_buf[oy * params.out_w * params.out_groups + ox * params.out_groups + og] = result;
}
\`;var Gr=\`enable f16;

// Bilinear upsample + 1\\xD71 pointwise conv fused \\u2014 full f16 variant.
// Bilinear weights and intermediate blends computed in f32; conv accumulation in f16.

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    in_groups  : u32,
    out_groups : u32,
    activation : u32,
    _pad0      : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let og = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || og >= params.out_groups) { return; }

    let IH = params.in_h;
    let IW = params.in_w;
    let IG = params.in_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    var result = bias_buf[og];

    for (var ig = 0u; ig < IG; ig++) {
        let tl = vec4<f32>(input_buf[y0 * IW * IG + x0 * IG + ig]);
        let tr = vec4<f32>(input_buf[y0 * IW * IG + x1 * IG + ig]);
        let bl = vec4<f32>(input_buf[y1 * IW * IG + x0 * IG + ig]);
        let br = vec4<f32>(input_buf[y1 * IW * IG + x1 * IG + ig]);

        let sampled = vec4<f16>((1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
                              +        wy  * ((1.0 - wx) * bl + wx * br));

        result += weight_buf[og * IG + ig] * sampled;
    }

    if (params.activation == 1u) {
        result = clamp(result, vec4<f16>(0.0h), vec4<f16>(6.0h));
    } else if (params.activation == 2u) {
        result = result * clamp(result + 3.0h, vec4<f16>(0.0h), vec4<f16>(6.0h)) / 6.0h;
    }

    output_buf[oy * params.out_w * params.out_groups + ox * params.out_groups + og] = result;
}
\`;var Ee=class extends f{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Gr:Pr;let n=e.c/4,s=o.outChannels/4;this.output=r.tensor(o.outH,o.outW,o.outChannels),this.inputs=[e],this.weights=[r.upload(m(i.weights)),r.upload(m(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o.outH,o.outW,n,s,o.activation==="relu6"?1:0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o.outW/8),Math.ceil(o.outH/8),s]}};var Br=\`// Bilinear upsample + sigmoid fused.
// Identical to bilinear_upsample.wgsl except sigmoid is applied at write time.
// Eliminates the intermediate full-resolution buffer and the separate sigmoid dispatch.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = input_buf[y0 * IW * C + x0 * C + c];
    let tr = input_buf[y0 * IW * C + x1 * C + c];
    let bl = input_buf[y1 * IW * C + x0 * C + c];
    let br = input_buf[y1 * IW * C + x1 * C + c];

    let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
               +        wy  * ((1.0 - wx) * bl + wx * br);

    output_buf[oy * params.out_w * C + ox * C + c] = 1.0 / (1.0 + exp(-result));
}
\`;var Ur=\`enable f16;

// Bilinear upsample + sigmoid fused \\u2014 full f16 variant.
// Interpolation computed in f32 for accuracy; sigmoid and result cast to f16.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = vec4<f32>(input_buf[y0 * IW * C + x0 * C + c]);
    let tr = vec4<f32>(input_buf[y0 * IW * C + x1 * C + c]);
    let bl = vec4<f32>(input_buf[y1 * IW * C + x0 * C + c]);
    let br = vec4<f32>(input_buf[y1 * IW * C + x1 * C + c]);

    let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
               +        wy  * ((1.0 - wx) * bl + wx * br);

    output_buf[oy * params.out_w * C + ox * C + c] = vec4<f16>(1.0 / (1.0 + exp(-result)));
}
\`;var De=class extends f{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Ur:Br;let o=e.c/4;this.output=r.tensor(i.outH,i.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,i.outH,i.outW,o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i.outW/8),Math.ceil(i.outH/8),o]}};var Sr=\`// Composite an RGBA image over a solid background, gated by a 1-ch alpha.
// Fragment writes the canvas's swapchain texture (premultiplied output).
//
// Caller invariants (matched in CompositeSolidWebGPU):
//   - image and alpha are NHWC vec4 storage buffers, same h \\xD7 w
//   - canvas.width === image.w, canvas.height === image.h (no resampling)

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width:    u32,           // image width in pixels (= canvas width)
    _pad0:    u32,
    _pad1:    u32,
    _pad2:    u32,
    bgColor:  vec4<f32>,     // .rgb used; .a ignored
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f32>>;
@group(0) @binding(2) var<uniform>       params: Params;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;

    let fg = image[i].rgb;
    let a  = alpha[i].r;
    let rgb = fg * a + params.bgColor.rgb * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
\`;var Lr=\`enable f16;

// Composite an RGBA image over a solid background, gated by a 1-ch alpha.
// f16 variant: image and alpha are stored as f16; values promote to f32 on
// read and the fragment writes f32 to the canvas swapchain (color attachment
// format is the swapchain's preferred format, always f32-equivalent).
//
// Caller invariants (matched in CompositeSolidWebGPU):
//   - image and alpha are NHWC vec4 storage buffers, same h \\xD7 w
//   - canvas.width === image.w, canvas.height === image.h (no resampling)

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width:    u32,
    _pad0:    u32,
    _pad1:    u32,
    _pad2:    u32,
    bgColor:  vec4<f32>,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f16>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f16>>;
@group(0) @binding(2) var<uniform>       params: Params;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;

    let fg = vec3<f32>(image[i].rgb);
    let a  = f32(alpha[i].r);
    let rgb = fg * a + params.bgColor.rgb * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
\`;var Oe=class{constructor(t,r,e,i){a(this,"backend",t);a(this,"pipeline");a(this,"bindGroup");a(this,"uniformBuffer");a(this,"outputView",null);if(r.h!==e.h||r.w!==e.w)throw new Error(\`CompositeSolid: image (\${r.h}\\xD7\${r.w}) and alpha (\${e.h}\\xD7\${e.w}) must match. Run the upscaler first.\`);let o=t.device;this.uniformBuffer=o.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(32);new Uint32Array(n,0,1)[0]=r.w,new Float32Array(n,16,4).set([i[0],i[1],i[2],0]),o.queue.writeBuffer(this.uniformBuffer,0,n);let s=t.dtype==="f16"?Lr:Sr,p=o.createShaderModule({code:s});this.pipeline=o.createRenderPipeline({layout:"auto",vertex:{module:p,entryPoint:"vs"},fragment:{module:p,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=o.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.buffer}},{binding:1,resource:{buffer:e.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}}]})}setOutput(t){this.outputView=t.createView()}run(){if(!this.outputView)throw new Error("CompositeSolidWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),r=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.draw(6),r.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null}};var Fr=\`// Like composite_solid but bg is an NHWC vec4 storage buffer (e.g. virtual
// background image, or a blurred copy of the input).

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width: u32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f32>>;
@group(0) @binding(2) var<uniform>       params: Params;
@group(0) @binding(3) var<storage, read> bg:     array<vec4<f32>>;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;

    let fg  = image[i].rgb;
    let a   = alpha[i].r;
    let bgc = bg[i].rgb;
    let rgb = fg * a + bgc * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
\`;var Er=\`enable f16;

// Like composite_solid_f16 but bg is an NHWC vec4<f16> storage buffer (e.g. a
// virtual background image, or a blurred copy of the input).

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width: u32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f16>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f16>>;
@group(0) @binding(2) var<uniform>       params: Params;
@group(0) @binding(3) var<storage, read> bg:     array<vec4<f16>>;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;

    let fg  = vec3<f32>(image[i].rgb);
    let a   = f32(alpha[i].r);
    let bgc = vec3<f32>(bg[i].rgb);
    let rgb = fg * a + bgc * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
\`;var Ie=class{constructor(t,r,e,i){a(this,"backend",t);a(this,"pipeline");a(this,"bindGroup");a(this,"uniformBuffer");a(this,"outputView",null);if(r.h!==e.h||r.w!==e.w||r.h!==i.h||r.w!==i.w)throw new Error(\`CompositeImage: image (\${r.h}\\xD7\${r.w}), alpha (\${e.h}\\xD7\${e.w}), and bg (\${i.h}\\xD7\${i.w}) must all match. Run upscaler / resizer first.\`);let o=t.device;this.uniformBuffer=o.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(16);new Uint32Array(n,0,1)[0]=r.w,o.queue.writeBuffer(this.uniformBuffer,0,n);let s=t.dtype==="f16"?Er:Fr,p=o.createShaderModule({code:s});this.pipeline=o.createRenderPipeline({layout:"auto",vertex:{module:p,entryPoint:"vs"},fragment:{module:p,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=o.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.buffer}},{binding:1,resource:{buffer:e.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:i.buffer}}]})}setOutput(t){this.outputView=t.createView()}run(){if(!this.outputView)throw new Error("CompositeImageWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),r=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.draw(6),r.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null}};var Dr=\`// Like composite_image but bg is sampled bilinearly \\u2014 bg may be smaller than
// (image, alpha). Used by CompositorBlur to skip the final full-res upsample
// in the blur pyramid and let this shader's own per-pixel scan do the
// expansion (the work is already happening here for the composite anyway).
//
// Layout invariant: image, alpha share output dims (canvas h \\xD7 w); bg is
// at a smaller resolution (bg_h \\xD7 bg_w). All NHWC vec4 storage buffers,
// channelGroups = 1 (RGB padded to vec4).

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    out_w: u32,
    out_h: u32,
    bg_w:  u32,
    bg_h:  u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f32>>;
@group(0) @binding(2) var<uniform>       params: Params;
@group(0) @binding(3) var<storage, read> bg:     array<vec4<f32>>;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.out_w + x;

    let fg = image[i].rgb;
    let a  = alpha[i].r;

    // Bilinear sample bg at the corresponding location. align_corners=False.
    let src_x = (f32(x) + 0.5) * (f32(params.bg_w) / f32(params.out_w)) - 0.5;
    let src_y = (f32(y) + 0.5) * (f32(params.bg_h) / f32(params.out_h)) - 0.5;
    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(params.bg_w) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(params.bg_w) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(params.bg_h) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(params.bg_h) - 1));
    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = bg[y0 * params.bg_w + x0].rgb;
    let tr = bg[y0 * params.bg_w + x1].rgb;
    let bl = bg[y1 * params.bg_w + x0].rgb;
    let br = bg[y1 * params.bg_w + x1].rgb;
    let bgc = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
            +        wy  * ((1.0 - wx) * bl + wx * br);

    let rgb = fg * a + bgc * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
\`;var Or=\`enable f16;

// f16 storage variant of composite_image_bilinear. bg is at a smaller
// resolution and is bilinearly sampled to match (image, alpha) at full res.
// Computation in f32; storage in f16.

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    out_w: u32,
    out_h: u32,
    bg_w:  u32,
    bg_h:  u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f16>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f16>>;
@group(0) @binding(2) var<uniform>       params: Params;
@group(0) @binding(3) var<storage, read> bg:     array<vec4<f16>>;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.out_w + x;

    let fg = vec3<f32>(image[i].rgb);
    let a  = f32(alpha[i].r);

    let src_x = (f32(x) + 0.5) * (f32(params.bg_w) / f32(params.out_w)) - 0.5;
    let src_y = (f32(y) + 0.5) * (f32(params.bg_h) / f32(params.out_h)) - 0.5;
    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(params.bg_w) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(params.bg_w) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(params.bg_h) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(params.bg_h) - 1));
    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = vec3<f32>(bg[y0 * params.bg_w + x0].rgb);
    let tr = vec3<f32>(bg[y0 * params.bg_w + x1].rgb);
    let bl = vec3<f32>(bg[y1 * params.bg_w + x0].rgb);
    let br = vec3<f32>(bg[y1 * params.bg_w + x1].rgb);
    let bgc = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
            +        wy  * ((1.0 - wx) * bl + wx * br);

    let rgb = fg * a + bgc * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
\`;var Ae=class{constructor(t,r,e,i){a(this,"backend",t);a(this,"pipeline");a(this,"bindGroup");a(this,"uniformBuffer");a(this,"outputView",null);if(r.h!==e.h||r.w!==e.w)throw new Error(\`CompositeImageBilinear: image (\${r.h}\\xD7\${r.w}) and alpha (\${e.h}\\xD7\${e.w}) must match.\`);let o=t.device;this.uniformBuffer=o.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(16),s=new Uint32Array(n);s[0]=r.w,s[1]=r.h,s[2]=i.w,s[3]=i.h,o.queue.writeBuffer(this.uniformBuffer,0,n);let p=t.dtype==="f16"?Or:Dr,l=o.createShaderModule({code:p});this.pipeline=o.createRenderPipeline({layout:"auto",vertex:{module:l,entryPoint:"vs"},fragment:{module:l,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=o.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.buffer}},{binding:1,resource:{buffer:e.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:i.buffer}}]})}setOutput(t){this.outputView=t.createView()}run(){if(!this.outputView)throw new Error("CompositeImageBilinearWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),r=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.draw(6),r.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null}};var Ir=\`// Passthrough "compositor" \\u2014 writes the image directly to the canvas
// swapchain texture with no alpha math and no background. Used by RenderOp
// when the renderer is in disabled state, so the output canvas reflects
// the unmodified input frame instead of a stale matted result.
//
// Caller invariants (matched in CompositePassthroughWebGPU):
//   - image is an NHWC vec4 storage buffer
//   - canvas.width === image.w, canvas.height === image.h (no resampling)

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width: u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f32>>;
@group(0) @binding(1) var<uniform>       params: Params;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;
    return vec4<f32>(image[i].rgb, 1.0);
}
\`;var Ar=\`enable f16;

// Passthrough "compositor" \\u2014 f16 variant. Image is stored as f16; values
// promote to f32 on read and the fragment writes f32 to the canvas
// swapchain (color attachment is the swapchain's preferred f32-equivalent
// format). See composite_passthrough.wgsl for the f32 version.

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width: u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f16>>;
@group(0) @binding(1) var<uniform>       params: Params;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;
    return vec4<f32>(vec3<f32>(image[i].rgb), 1.0);
}
\`;var Me=class{constructor(t,r){a(this,"backend",t);a(this,"pipeline");a(this,"bindGroup");a(this,"uniformBuffer");a(this,"outputView",null);let e=t.device;this.uniformBuffer=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let i=new ArrayBuffer(16);new Uint32Array(i,0,1)[0]=r.w,e.queue.writeBuffer(this.uniformBuffer,0,i);let o=t.dtype==="f16"?Ar:Ir,n=e.createShaderModule({code:o});this.pipeline=e.createRenderPipeline({layout:"auto",vertex:{module:n,entryPoint:"vs"},fragment:{module:n,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=e.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.buffer}},{binding:1,resource:{buffer:this.uniformBuffer}}]})}setOutput(t){this.outputView=t.createView()}run(){if(!this.outputView)throw new Error("CompositePassthroughWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),r=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.draw(6),r.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null}};var Mr=\`// Input op \\u2014 sample a regular 2D source texture (RGBA8 unorm) into the NHWC
// vec4<f32> output buffer at the target resolution. Used for ImageBitmap
// sources, which are uploaded into a persistent staging texture via
// copyExternalImageToTexture before each dispatch.

struct Params {
    out_w : u32,
    out_h : u32,
    _pad0 : u32,
    _pad1 : u32,
}

@group(0) @binding(0) var                       src_tex     : texture_2d<f32>;
@group(0) @binding(1) var                       src_sampler : sampler;
@group(0) @binding(2) var<uniform>              params      : Params;
@group(0) @binding(3) var<storage, read_write>  output_buf  : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.out_w || y >= params.out_h) { return; }

    let uv = vec2<f32>(
        (f32(x) + 0.5) / f32(params.out_w),
        (f32(y) + 0.5) / f32(params.out_h),
    );
    let rgba = textureSampleLevel(src_tex, src_sampler, uv, 0.0);
    output_buf[y * params.out_w + x] = rgba;
}
\`;var Rr=\`enable f16;

// Input op \\u2014 f16 storage variant. Source is sampled as vec4<f32>; only the
// store is demoted to vec4<f16>.

struct Params {
    out_w : u32,
    out_h : u32,
    _pad0 : u32,
    _pad1 : u32,
}

@group(0) @binding(0) var                       src_tex     : texture_2d<f32>;
@group(0) @binding(1) var                       src_sampler : sampler;
@group(0) @binding(2) var<uniform>              params      : Params;
@group(0) @binding(3) var<storage, read_write>  output_buf  : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.out_w || y >= params.out_h) { return; }

    let uv = vec2<f32>(
        (f32(x) + 0.5) / f32(params.out_w),
        (f32(y) + 0.5) / f32(params.out_h),
    );
    let rgba = textureSampleLevel(src_tex, src_sampler, uv, 0.0);
    output_buf[y * params.out_w + x] = vec4<f16>(rgba);
}
\`;var Hr=\`// Input op \\u2014 sample a GPUExternalTexture (zero-copy VideoFrame import) into
// the NHWC vec4<f32> output buffer at the target resolution. Used when the
// caller passes a VideoFrame to setSource(); requires importExternalTexture
// to be called in the same task as the dispatch (the texture is invalidated
// after the current task completes).

struct Params {
    out_w : u32,
    out_h : u32,
    _pad0 : u32,
    _pad1 : u32,
}

@group(0) @binding(0) var                       src_tex     : texture_external;
@group(0) @binding(1) var                       src_sampler : sampler;
@group(0) @binding(2) var<uniform>              params      : Params;
@group(0) @binding(3) var<storage, read_write>  output_buf  : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.out_w || y >= params.out_h) { return; }

    let uv = vec2<f32>(
        (f32(x) + 0.5) / f32(params.out_w),
        (f32(y) + 0.5) / f32(params.out_h),
    );
    let rgba = textureSampleBaseClampToEdge(src_tex, src_sampler, uv);
    output_buf[y * params.out_w + x] = rgba;
}
\`;var zr=\`enable f16;

// Input op \\u2014 texture_external + f16 storage. Sample in f32, store as f16.

struct Params {
    out_w : u32,
    out_h : u32,
    _pad0 : u32,
    _pad1 : u32,
}

@group(0) @binding(0) var                       src_tex     : texture_external;
@group(0) @binding(1) var                       src_sampler : sampler;
@group(0) @binding(2) var<uniform>              params      : Params;
@group(0) @binding(3) var<storage, read_write>  output_buf  : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.out_w || y >= params.out_h) { return; }

    let uv = vec2<f32>(
        (f32(x) + 0.5) / f32(params.out_w),
        (f32(y) + 0.5) / f32(params.out_h),
    );
    let rgba = textureSampleBaseClampToEdge(src_tex, src_sampler, uv);
    output_buf[y * params.out_w + x] = vec4<f16>(rgba);
}
\`;var aa=u=>typeof VideoFrame<"u"&&u instanceof VideoFrame,Re=class{constructor(t,r,e){a(this,"output");a(this,"device");a(this,"dtype");a(this,"sampler");a(this,"uniformBuffer");a(this,"dispatch");a(this,"pipeline2d",null);a(this,"pipelineExternal",null);a(this,"stagingTex",null);a(this,"stagingW",0);a(this,"stagingH",0);a(this,"source",null);this.device=t.device,this.dtype=t.dtype,this.output=t.tensor(r,e,4),this.sampler=this.device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.uniformBuffer=this.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let i=new ArrayBuffer(16);new Uint32Array(i,0,2).set([e,r]),this.device.queue.writeBuffer(this.uniformBuffer,0,i),this.dispatch=[Math.ceil(e/8),Math.ceil(r/8),1],this.pipeline2d=this.buildPipeline(this.dtype==="f16"?Rr:Mr)}setSource(t){this.source=t}run(){if(!this.source)throw new Error("InputWebGPU.run() called before setSource()");aa(this.source)?this.runExternal(this.source):this.run2d(this.source)}run2d(t){this.ensureStagingTexture(t.width,t.height),this.device.queue.copyExternalImageToTexture({source:t,flipY:!1},{texture:this.stagingTex},[t.width,t.height]);let r=this.device.createBindGroup({layout:this.pipeline2d.getBindGroupLayout(0),entries:[{binding:0,resource:this.stagingTex.createView()},{binding:1,resource:this.sampler},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.output.buffer}}]});this.dispatchOnce(this.pipeline2d,r)}runExternal(t){this.pipelineExternal||(this.pipelineExternal=this.buildPipeline(this.dtype==="f16"?zr:Hr));let r=this.device.importExternalTexture({source:t}),e=this.device.createBindGroup({layout:this.pipelineExternal.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:this.sampler},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.output.buffer}}]});this.dispatchOnce(this.pipelineExternal,e)}ensureStagingTexture(t,r){this.stagingTex&&this.stagingW===t&&this.stagingH===r||(this.stagingTex?.destroy(),this.stagingTex=this.device.createTexture({size:[t,r,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),this.stagingW=t,this.stagingH=r)}buildPipeline(t){let r=this.device.createShaderModule({code:t});return this.device.createComputePipeline({layout:"auto",compute:{module:r,entryPoint:"main"}})}dispatchOnce(t,r){let e=this.device.createCommandEncoder(),i=e.beginComputePass();i.setPipeline(t),i.setBindGroup(0,r),i.dispatchWorkgroups(...this.dispatch),i.end(),this.device.queue.submit([e.finish()])}};var na=navigator.gpu?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST:0,R=class u{constructor(t,r,e){a(this,"device",t);a(this,"canvas",r);a(this,"dtype",e);a(this,"ops");a(this,"presenters");a(this,"canvasContext");a(this,"canvasFormat");a(this,"bytesPerElement");a(this,"contexts",new Map);this.bytesPerElement=e==="f16"?2:4;let i=r.getContext("webgpu");if(!i)throw new Error("Failed to get WebGPU context from canvas");this.canvasFormat=navigator.gpu.getPreferredCanvasFormat(),this.configureContext(i),this.canvasContext=i,this.contexts.set("main",i),this.ops={Conv2d:(o,n,s)=>new le(this,o,n,s),ConvTranspose2d:(o,n,s)=>new ce(this,o,n,s),DepthwiseConv2d:(o,n,s)=>new de(this,o,n,s),Add:(o,n)=>new me(this,o,n),Sigmoid:o=>new fe(this,o),Tanh:o=>new he(this,o),ElementwiseMul:(o,n)=>new _e(this,o,n),Warp:(o,n,s)=>new ge(this,o,n,s),Stabilize:(o,n,s,p,l)=>new be(this,o,n,s,p,l),BilinearUpsample:(o,n)=>new ve(this,o,n),Crop:(o,n)=>new xe(this,o,n),BicubicUpsample:(o,n)=>new ye(this,o,n),ChannelConcat:(o,n)=>new we(this,o,n),Conv2dAdd:(o,n,s,p)=>new ke(this,o,n,s,p),ProjResidual:(o,n,s,p)=>new Te(this,o,n,s,p),ConcatConv2d:(o,n,s,p)=>new Ce(this,o,n,s,p),GatesFused:(o,n,s)=>new We(this,o,n,s),CandUpdateFused:(o,n,s,p,l)=>new Pe(this,o,n,s,p,l),ConvExpand:(o,n)=>new Ge(this,o,n),CatConv6to2:(o,n,s)=>new Be(this,o,n,s),DownAdapter:(o,n,s,p)=>new Ue(this,o,n,s,p),UpFinal:(o,n,s)=>new Se(this,o,n,s),UpFinalSkip:(o,n,s,p)=>new Le(this,o,n,s,p),UpsampleConcat:(o,n,s)=>new Fe(this,o,n,s),UpsampleConv1x1:(o,n,s)=>new Ee(this,o,n,s),UpsampleSigmoid:(o,n)=>new De(this,o,n),Input:(o,n)=>new Re(this,o,n)},this.presenters={CompositeSolid:(o,n,s,p="main")=>{let l=new Oe(this,o,n,s);return{run:()=>{l.setOutput(this.getCurrentDisplayTexture(p)),l.run()}}},CompositeImage:(o,n,s,p="main")=>{let l=new Ie(this,o,n,s);return{run:()=>{l.setOutput(this.getCurrentDisplayTexture(p)),l.run()}}},CompositeImageBilinear:(o,n,s,p="main")=>{let l=new Ae(this,o,n,s);return{run:()=>{l.setOutput(this.getCurrentDisplayTexture(p)),l.run()}}},CompositePassthrough:(o,n="main")=>{let s=new Me(this,o);return{run:()=>{s.setOutput(this.getCurrentDisplayTexture(n)),s.run()}}}}}configureContext(t){t.configure({device:this.device,format:this.canvasFormat,alphaMode:"premultiplied"})}attachCanvas(t,r){if(t==="main")throw new Error("attachCanvas: 'main' is reserved for the create() canvas");let e=r.getContext("webgpu");if(!e)throw new Error(\`attachCanvas: failed to get WebGPU context for target '\${t}'\`);this.configureContext(e),this.contexts.set(t,e)}static async isAvailable(){return navigator.gpu?await navigator.gpu.requestAdapter()!==null:!1}static async hasF16Support(){if(!navigator.gpu)return!1;let t=await navigator.gpu.requestAdapter();return t?t.features.has("shader-f16"):!1}static async create(t){let r=t.dtype??"f32",e=t.device;if(e){if(r==="f16"&&!e.features.has("shader-f16"))throw new Error("WebGPU dtype='f16' requested but supplied device lacks \`shader-f16\`")}else{let i=await navigator.gpu.requestAdapter();if(!i)throw new Error("WebGPU adapter not available");if(r==="f16"&&!i.features.has("shader-f16"))throw new Error("WebGPU dtype='f16' requested but adapter lacks \`shader-f16\` feature");e=await i.requestDevice({requiredFeatures:r==="f16"?["shader-f16"]:[]})}return new u(e,t.canvas,r)}getCurrentDisplayTexture(t="main"){let r=this.contexts.get(t);if(!r)throw new Error(\`getCurrentDisplayTexture: no canvas attached for target '\${t}'\`);return r.getCurrentTexture()}tensor(t,r,e,i){let n=t*r*e*this.bytesPerElement,s=this.device.createBuffer({size:n,usage:na,mappedAtCreation:i!==void 0});if(i!==void 0){let p=s.getMappedRange();this.writeView(p,i),s.unmap()}return{h:t,w:r,c:e,buffer:s}}upload(t){let e=t.length*this.bytesPerElement,i=this.device.createBuffer({size:e,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});return this.writeView(i.getMappedRange(),t),i.unmap(),{buffer:i}}writeView(t,r){let e=this.dtype==="f16",i=r instanceof Uint16Array;if(e===i){e?new Uint16Array(t).set(r):new Float32Array(t).set(r);return}e?new Uint16Array(t).set(pe(r)):new Float32Array(t).set(A(r))}async readback(t){let r=this.device.createBuffer({size:t.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),e=this.device.createCommandEncoder();e.copyBufferToBuffer(t.buffer,0,r,0,t.buffer.size),this.device.queue.submit([e.finish()]),await r.mapAsync(GPUMapMode.READ);let i=r.getMappedRange(),o=this.dtype==="f16"?A(new Uint16Array(i.slice(0))):new Float32Array(i.slice(0));return r.unmap(),r.destroy(),o}copyTensor(t,r){if(t.buffer.size!==r.buffer.size)throw new Error(\`copyTensor: size mismatch (src \${t.buffer.size} vs dst \${r.buffer.size})\`);let e=this.device.createCommandEncoder();e.copyBufferToBuffer(t.buffer,0,r.buffer,0,t.buffer.size),this.device.queue.submit([e.finish()])}async sync(){await this.device.queue.onSubmittedWorkDone()}destroy(){this.device.destroy()}};var sa=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,h=class{constructor(t){a(this,"backend",t);a(this,"shader","");a(this,"program");a(this,"samplers",[]);a(this,"uniformInts",{});a(this,"uniformFloats",{})}makeTexture(t,r,e){let i=this.backend.gl,o=this.backend.textureFormat,n=this.backend.toTextureView(t),s=i.createTexture();return i.bindTexture(i.TEXTURE_2D,s),i.texImage2D(i.TEXTURE_2D,0,o.internalFormat,r,e,0,o.format,o.type,n),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),s}defaultSetup(){let t=this.backend.gl,r=t.createShader(t.VERTEX_SHADER);t.shaderSource(r,sa),t.compileShader(r);let e=t.createShader(t.FRAGMENT_SHADER);if(t.shaderSource(e,this.shader),t.compileShader(e),!t.getShaderParameter(e,t.COMPILE_STATUS))throw new Error(\`GLSL compile error: \${t.getShaderInfoLog(e)}\`);if(this.program=t.createProgram(),t.attachShader(this.program,r),t.attachShader(this.program,e),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))throw new Error(\`GLSL link error: \${t.getProgramInfoLog(this.program)}\`)}run(){let t=this.backend.gl;t.useProgram(this.program),this.samplers.forEach(({name:r,texture:e},i)=>{t.activeTexture(t.TEXTURE0+i),t.bindTexture(t.TEXTURE_2D,e),t.uniform1i(t.getUniformLocation(this.program,r),i)});for(let[r,e]of Object.entries(this.uniformInts))t.uniform1i(t.getUniformLocation(this.program,r),e);for(let[r,e]of Object.entries(this.uniformFloats))t.uniform1f(t.getUniformLocation(this.program,r),e);t.bindFramebuffer(t.FRAMEBUFFER,this.backend.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.output.texture,0),t.viewport(0,0,this.dispatch[0],this.dispatch[1]),t.bindVertexArray(null),t.drawArrays(t.TRIANGLES,0,6)}};var Vr=\`#version 300 es
// Conv2d \\u2014 handles all variants: 1\\xD71 (pointwise), 3\\xD73, 5\\xD75, strided, BN-fused.
//
// Tensor layout: NHWC vec4 \\u2014 texture dimensions (W * C/4, H).
//   texel (x * C_groups + c_group, y) = channels [c_group*4 .. c_group*4+3] at pixel (x,y).
//
// Weight layout: (I_groups * 4, K\\xB2 * O_groups) RGBA32F texture.
//   Row  = z * u_out_c_groups + o_group   (kernel_pos outer, out_group inner)
//   Col  = i_group * 4 + mat_col          (4 texels per mat4)
//   mat4[col][row] = weight(in_channel=col, out_channel=row)
//   Operation: (mat4 * in_val)[r] = \\u03A3_c weight(in=c, out=r) * in_val[c]  \\u2014 same as WGSL.
//
// Bias layout: (O_groups, 1).
//
// Padding model: pad_top / pad_left applied to input offset; right/bottom asymmetry
// is handled implicitly by the bounds check, same as the WGSL implementation.

precision highp float;
precision highp int;

uniform sampler2D u_input;    // (in_W * in_C_groups, in_H)
uniform sampler2D u_weights;  // (in_C_groups * 4, K\\xB2 * out_C_groups)
uniform sampler2D u_bias;     // (out_C_groups, 1)

uniform int u_in_w;
uniform int u_in_h;
uniform int u_in_c_groups;
uniform int u_out_c_groups;
uniform int u_kernel_h;
uniform int u_kernel_w;
uniform int u_stride;
uniform int u_pad_top;
uniform int u_pad_left;
uniform int u_activation;   // 0 = none, 1 = relu6, 2 = relu, 3 = leaky(0.1)

out vec4 fragColor;

void main() {
    int fx      = int(gl_FragCoord.x);
    int fy      = int(gl_FragCoord.y);
    int x_out   = fx / u_out_c_groups;
    int y_out   = fy;
    int o_group = fx - x_out * u_out_c_groups;

    vec4 result = texelFetch(u_bias, ivec2(o_group, 0), 0);

    for (int ky = 0; ky < u_kernel_h; ky++) {
        for (int kx = 0; kx < u_kernel_w; kx++) {
            int in_y = y_out * u_stride + ky - u_pad_top;
            int in_x = x_out * u_stride + kx - u_pad_left;

            if (in_y < 0 || in_y >= u_in_h || in_x < 0 || in_x >= u_in_w) continue;

            int z     = ky * u_kernel_w + kx;
            int w_row = z * u_out_c_groups + o_group;

            for (int i = 0; i < u_in_c_groups; i++) {
                vec4 in_val = texelFetch(u_input, ivec2(in_x * u_in_c_groups + i, in_y), 0);

                int base = i * 4;
                mat4 w = mat4(
                    texelFetch(u_weights, ivec2(base,     w_row), 0),
                    texelFetch(u_weights, ivec2(base + 1, w_row), 0),
                    texelFetch(u_weights, ivec2(base + 2, w_row), 0),
                    texelFetch(u_weights, ivec2(base + 3, w_row), 0)
                );
                result += w * in_val;
            }
        }
    }

    if      (u_activation == 1) result = clamp(result, 0.0, 6.0);
    else if (u_activation == 2) result = max(result, vec4(0.0));
    else if (u_activation == 3) result = max(result, 0.1 * result);

    fragColor = result;
}
\`;var He=class extends h{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",Vr);let n=T(e.h,o.kernel,o.stride,o.padding),s=T(e.w,o.kernel,o.stride,o.padding),p=e.c/4,l=o.outChannels/4,c=C(o.padding,e.h,n,o.kernel,o.stride),d=C(o.padding,e.w,s,o.kernel,o.stride),_=m(i.weights),b=m(i.bias),g=this.makeTexture(_,p*4,o.kernel*o.kernel*l),v=this.makeTexture(b,l,1),x=s*l,k=this.makeTexture(null,x,n);this.output={h:n,w:s,c:o.outChannels,texture:k,texW:x,texH:n},this.inputs=[e],this.weights=[],this.samplers=[{name:"u_input",texture:e.texture},{name:"u_weights",texture:g},{name:"u_bias",texture:v}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_in_c_groups:p,u_out_c_groups:l,u_kernel_h:o.kernel,u_kernel_w:o.kernel,u_stride:o.stride,u_pad_top:c,u_pad_left:d,u_activation:o.activation==="relu6"?1:o.activation==="relu"?2:o.activation==="leaky"?3:0},this.defaultSetup(),this.dispatch=[x,n]}};var Nr=\`#version 300 es
// ConvTranspose2d \\u2014 gather form. Identical texture layouts + mat4 weight
// semantics as conv2d.glsl; only the spatial mapping differs:
//   in_y = (y_out + pad - ky) / stride   (must divide evenly + be in bounds)
// No explicit kernel flip \\u2014 the (y_out + pad - ky) indexing carries it.

precision highp float;
precision highp int;

uniform sampler2D u_input;    // (in_W * in_C_groups, in_H)
uniform sampler2D u_weights;  // (in_C_groups * 4, K\\xB2 * out_C_groups)
uniform sampler2D u_bias;     // (out_C_groups, 1)

uniform int u_in_w;
uniform int u_in_h;
uniform int u_in_c_groups;
uniform int u_out_c_groups;
uniform int u_kernel_h;
uniform int u_kernel_w;
uniform int u_stride;
uniform int u_pad_top;
uniform int u_pad_left;
uniform int u_activation;   // 0 = none, 1 = relu6, 2 = relu, 3 = leaky(0.1)

out vec4 fragColor;

void main() {
    int fx      = int(gl_FragCoord.x);
    int fy      = int(gl_FragCoord.y);
    int x_out   = fx / u_out_c_groups;
    int y_out   = fy;
    int o_group = fx - x_out * u_out_c_groups;

    vec4 result = texelFetch(u_bias, ivec2(o_group, 0), 0);

    for (int ky = 0; ky < u_kernel_h; ky++) {
        for (int kx = 0; kx < u_kernel_w; kx++) {
            int iy_num = y_out + u_pad_top  - ky;
            int ix_num = x_out + u_pad_left - kx;
            if (iy_num < 0 || ix_num < 0) continue;
            if ((iy_num % u_stride) != 0 || (ix_num % u_stride) != 0) continue;
            int in_y = iy_num / u_stride;
            int in_x = ix_num / u_stride;
            if (in_y >= u_in_h || in_x >= u_in_w) continue;

            int z     = ky * u_kernel_w + kx;
            int w_row = z * u_out_c_groups + o_group;

            for (int i = 0; i < u_in_c_groups; i++) {
                vec4 in_val = texelFetch(u_input, ivec2(in_x * u_in_c_groups + i, in_y), 0);

                int base = i * 4;
                mat4 w = mat4(
                    texelFetch(u_weights, ivec2(base,     w_row), 0),
                    texelFetch(u_weights, ivec2(base + 1, w_row), 0),
                    texelFetch(u_weights, ivec2(base + 2, w_row), 0),
                    texelFetch(u_weights, ivec2(base + 3, w_row), 0)
                );
                result += w * in_val;
            }
        }
    }

    if      (u_activation == 1) result = clamp(result, 0.0, 6.0);
    else if (u_activation == 2) result = max(result, vec4(0.0));
    else if (u_activation == 3) result = max(result, 0.1 * result);

    fragColor = result;
}
\`;var ze=class extends h{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",Nr);let n=M(e.h,o.kernel,o.stride,o.padding),s=M(e.w,o.kernel,o.stride,o.padding),p=e.c/4,l=o.outChannels/4,c=m(i.weights),d=m(i.bias),_=this.makeTexture(c,p*4,o.kernel*o.kernel*l),b=this.makeTexture(d,l,1),g=s*l,v=this.makeTexture(null,g,n);this.output={h:n,w:s,c:o.outChannels,texture:v,texW:g,texH:n},this.inputs=[e],this.weights=[],this.samplers=[{name:"u_input",texture:e.texture},{name:"u_weights",texture:_},{name:"u_bias",texture:b}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_in_c_groups:p,u_out_c_groups:l,u_kernel_h:o.kernel,u_kernel_w:o.kernel,u_stride:o.stride,u_pad_top:o.padding,u_pad_left:o.padding,u_activation:o.activation==="relu6"?1:o.activation==="relu"?2:o.activation==="leaky"?3:0},this.defaultSetup(),this.dispatch=[g,n]}};var $r=\`#version 300 es
// Depthwise Conv2d \\u2014 groups = in_channels (each channel convolved independently).
//
// Weight layout: (C_groups, K\\xB2) RGBA32F texture \\u2014 contrast with conv2d which uses mat4.
//   texel (c_group, z) = vec4 kernel weights for 4 channels at kernel position z.
//   Operation: element-wise multiply (not matmul). 4\\xD7 smaller than a mat4 approach.
//
// Padding model: same asymmetric SAME-pad handling as conv2d.glsl.

precision highp float;
precision highp int;

uniform sampler2D u_input;    // (in_W * C_groups, in_H)
uniform sampler2D u_weights;  // (C_groups, K\\xB2)
uniform sampler2D u_bias;     // (C_groups, 1)

uniform int u_in_w;
uniform int u_in_h;
uniform int u_c_groups;
uniform int u_kernel_h;
uniform int u_kernel_w;
uniform int u_stride;
uniform int u_pad_top;
uniform int u_pad_left;
uniform int u_apply_relu6;   // 0 = none, 1 = relu6

out vec4 fragColor;

void main() {
    int fx      = int(gl_FragCoord.x);
    int fy      = int(gl_FragCoord.y);
    int x_out   = fx / u_c_groups;
    int y_out   = fy;
    int c_group = fx - x_out * u_c_groups;

    vec4 result = texelFetch(u_bias, ivec2(c_group, 0), 0);

    for (int ky = 0; ky < u_kernel_h; ky++) {
        for (int kx = 0; kx < u_kernel_w; kx++) {
            int in_y = y_out * u_stride + ky - u_pad_top;
            int in_x = x_out * u_stride + kx - u_pad_left;

            if (in_y < 0 || in_y >= u_in_h || in_x < 0 || in_x >= u_in_w) continue;

            int z = ky * u_kernel_w + kx;

            vec4 in_val = texelFetch(u_input,   ivec2(in_x * u_c_groups + c_group, in_y), 0);
            vec4 w      = texelFetch(u_weights, ivec2(c_group, z), 0);

            result += w * in_val;  // element-wise multiply, not matmul
        }
    }

    if (u_apply_relu6 == 1) result = clamp(result, 0.0, 6.0);

    fragColor = result;
}
\`;var Ve=class extends h{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",$r);let n=T(e.h,o.kernel,o.stride,o.padding),s=T(e.w,o.kernel,o.stride,o.padding),p=e.c/4,l=C(o.padding,e.h,n,o.kernel,o.stride),c=C(o.padding,e.w,s,o.kernel,o.stride),d=m(i.weights),_=m(i.bias),b=this.makeTexture(d,p,o.kernel*o.kernel),g=this.makeTexture(_,p,1),v=s*p,x=this.makeTexture(null,v,n);this.output={h:n,w:s,c:e.c,texture:x,texW:v,texH:n},this.inputs=[e],this.weights=[],this.samplers=[{name:"u_input",texture:e.texture},{name:"u_weights",texture:b},{name:"u_bias",texture:g}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_c_groups:p,u_kernel_h:o.kernel,u_kernel_w:o.kernel,u_stride:o.stride,u_pad_top:l,u_pad_left:c,u_apply_relu6:o.activation==="relu6"?1:0},this.defaultSetup(),this.dispatch=[v,n]}};var Xr=\`#version 300 es
// Element-wise add \\u2014 both inputs and output share the same texture dimensions.
// Works for any 2D layout; used here with a flat (nVec4, 1) texture.

precision highp float;

uniform sampler2D u_input_a;
uniform sampler2D u_input_b;

out vec4 fragColor;

void main() {
    ivec2 fc = ivec2(gl_FragCoord.xy);
    fragColor = texelFetch(u_input_a, fc, 0) + texelFetch(u_input_b, fc, 0);
}
\`;var Ne=class extends h{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Xr);let o=e,n=this.makeTexture(null,o.texW,o.texH);this.output={h:e.h,w:e.w,c:e.c,texture:n,texW:o.texW,texH:o.texH},this.inputs=[e,i],this.samplers=[{name:"u_input_a",texture:e.texture},{name:"u_input_b",texture:i.texture}],this.defaultSetup(),this.dispatch=[o.texW,o.texH]}};var jr=\`#version 300 es
// Element-wise sigmoid \\u2014 works on any texture layout (flat or spatial).

precision highp float;

uniform sampler2D u_input;

out vec4 fragColor;

void main() {
    vec4 x = texelFetch(u_input, ivec2(gl_FragCoord.xy), 0);
    fragColor = 1.0 / (1.0 + exp(-x));
}
\`;var $e=class extends h{constructor(r,e){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",jr);let i=e,o=this.makeTexture(null,i.texW,i.texH);this.output={h:e.h,w:e.w,c:e.c,texture:o,texW:i.texW,texH:i.texH},this.inputs=[e],this.samplers=[{name:"u_input",texture:i.texture}],this.defaultSetup(),this.dispatch=[i.texW,i.texH]}};var qr=\`#version 300 es
// Element-wise tanh \\u2014 used by ConvGRU candidate activation.
// Layout-agnostic (flat or spatial); GLSL tanh is element-wise on vec4.

precision highp float;

uniform sampler2D u_input;

out vec4 fragColor;

void main() {
    fragColor = tanh(texelFetch(u_input, ivec2(gl_FragCoord.xy), 0));
}
\`;var Xe=class extends h{constructor(r,e){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",qr);let i=e,o=this.makeTexture(null,i.texW,i.texH);this.output={h:e.h,w:e.w,c:e.c,texture:o,texW:i.texW,texH:i.texH},this.inputs=[e],this.samplers=[{name:"u_input",texture:i.texture}],this.defaultSetup(),this.dispatch=[i.texW,i.texH]}};var Kr=\`#version 300 es
// Element-wise multiply \\u2014 used in ConvGRU for r \\u2299 h_prev.
// Same shape constraint as add.glsl.

precision highp float;

uniform sampler2D u_input_a;
uniform sampler2D u_input_b;

out vec4 fragColor;

void main() {
    ivec2 fc = ivec2(gl_FragCoord.xy);
    fragColor = texelFetch(u_input_a, fc, 0) * texelFetch(u_input_b, fc, 0);
}
\`;var je=class extends h{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Kr);let o=e,n=this.makeTexture(null,o.texW,o.texH);this.output={h:e.h,w:e.w,c:e.c,texture:n,texW:o.texW,texH:o.texH},this.inputs=[e,i],this.samplers=[{name:"u_input_a",texture:e.texture},{name:"u_input_b",texture:i.texture}],this.defaultSetup(),this.dispatch=[o.texW,o.texH]}};var Yr=\`#version 300 es
// Bilinear gather-warp. out[p] = sample(source, p + flow_scale\\xB7flow[p].xy),
// edge-clamped. Source + flow are 4-ch (1 group), same resolution; flow in .xy.

precision highp float;
precision highp int;

uniform sampler2D u_source;   // (W, H)
uniform sampler2D u_flow;     // (W, H), flow in .xy
uniform int   u_w;
uniform int   u_h;
uniform float u_flow_scale;

out vec4 fragColor;

vec4 samp(int x, int y) {
    int cx = clamp(x, 0, u_w - 1);
    int cy = clamp(y, 0, u_h - 1);
    return texelFetch(u_source, ivec2(cx, cy), 0);
}

void main() {
    int x = int(gl_FragCoord.x);
    int y = int(gl_FragCoord.y);

    vec2 f  = texelFetch(u_flow, ivec2(x, y), 0).xy;
    float sx = clamp(float(x) + u_flow_scale * f.x, 0.0, float(u_w - 1));
    float sy = clamp(float(y) + u_flow_scale * f.y, 0.0, float(u_h - 1));

    int x0 = int(floor(sx));
    int y0 = int(floor(sy));
    float tx = sx - float(x0);
    float ty = sy - float(y0);

    vec4 top = mix(samp(x0, y0), samp(x0 + 1, y0), tx);
    vec4 bot = mix(samp(x0, y0 + 1), samp(x0 + 1, y0 + 1), tx);
    fragColor = mix(top, bot, ty);
}
\`;var qe=class extends h{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Yr);let n=e.w,s=e.h,p=this.makeTexture(null,n,s);this.output={h:s,w:n,c:e.c,texture:p,texW:n,texH:s},this.inputs=[e,i],this.samplers=[{name:"u_source",texture:e.texture},{name:"u_flow",texture:i.texture}],this.uniformInts={u_w:n,u_h:s},this.uniformFloats={u_flow_scale:o.flowScale},this.defaultSetup(),this.dispatch=[n,s]}};var Qr=\`#version 300 es
// Flow-gated temporal stabilizer. Per pixel:
//   env = max(|flow.xy|, release\\xB7envPrev.y)   peak-hold
//   g   = max(clamp((env - tLo)/(tHi - tLo), 0, 1), leak)
//   out = vec4((g\\xB7pred + (1-g)\\xB7ref).x, env, 0, 0)

precision highp float;
precision highp int;

uniform sampler2D u_flow;
uniform sampler2D u_pred;
uniform sampler2D u_ref;
uniform sampler2D u_env_prev;
uniform int   u_w;
uniform int   u_h;
uniform float u_t_lo;
uniform float u_t_hi;
uniform float u_leak;
uniform float u_release;
uniform float u_t_div;
uniform float u_div_scale;
uniform int   u_step_x;
uniform int   u_step_y;

out vec4 fragColor;

void main() {
    int x = int(gl_FragCoord.x);
    int y = int(gl_FragCoord.y);

    float mag     = length(texelFetch(u_flow, ivec2(x, y), 0).xy);
    float envPrev = texelFetch(u_env_prev, ivec2(x, y), 0).y;
    float env     = max(mag, u_release * envPrev);

    // Flow divergence over a \\xB1step finite-difference (clamped to the edges).
    int xr = min(x + u_step_x, u_w - 1);
    int xl = max(x - u_step_x, 0);
    int yd = min(y + u_step_y, u_h - 1);
    int yu = max(y - u_step_y, 0);
    float dfx = texelFetch(u_flow, ivec2(xr, y), 0).x - texelFetch(u_flow, ivec2(xl, y), 0).x;
    float dfy = texelFetch(u_flow, ivec2(x, yd), 0).y - texelFetch(u_flow, ivec2(x, yu), 0).y;
    float divg = abs(dfx + dfy);

    float gMag = clamp((env - u_t_lo) / max(u_t_hi - u_t_lo, 1e-3), 0.0, 1.0);
    float gDiv = clamp((divg - u_t_div) / max(u_div_scale, 1e-3), 0.0, 1.0);
    float g = max(max(gMag, gDiv), u_leak);

    float pred = texelFetch(u_pred, ivec2(x, y), 0).x;
    float refv = texelFetch(u_ref,  ivec2(x, y), 0).x;
    float stab = g * pred + (1.0 - g) * refv;

    fragColor = vec4(stab, env, 0.0, 0.0);
}
\`;var Ke=class extends h{constructor(r,e,i,o,n,s){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Qr);let p=e.w,l=e.h,c=this.makeTexture(null,p,l);this.output={h:l,w:p,c:4,texture:c,texW:p,texH:l},this.inputs=[e,i,o,n],this.samplers=[{name:"u_flow",texture:e.texture},{name:"u_pred",texture:i.texture},{name:"u_ref",texture:o.texture},{name:"u_env_prev",texture:n.texture}],this.uniformInts={u_w:p,u_h:l,u_step_x:s.stepX,u_step_y:s.stepY},this.uniformFloats={u_t_lo:s.tLo,u_t_hi:s.tHi,u_leak:s.leak,u_release:s.release,u_t_div:s.tDiv,u_div_scale:s.divScale},this.defaultSetup(),this.dispatch=[p,l]}};var Jr=\`#version 300 es
// Bilinear upsample (arbitrary scale) \\u2014 align_corners=False.
//
// Hardware texture filtering can't be used: adjacent texels in x belong to
// different channel groups, not spatial neighbours. Manual 4-tap blend.
//
// Input:  (in_W  * c_groups, in_H)
// Output: (out_W * c_groups, out_H)

precision highp float;
precision highp int;

uniform sampler2D u_input;
uniform int u_in_w;
uniform int u_in_h;
uniform int u_out_w;
uniform int u_out_h;
uniform int u_c_groups;

out vec4 fragColor;

void main() {
    ivec2 fc    = ivec2(gl_FragCoord.xy);
    int x_out   = fc.x / u_c_groups;
    int y_out   = fc.y;
    int c_group = fc.x - x_out * u_c_groups;

    float scale_x = float(u_in_w) / float(u_out_w);
    float scale_y = float(u_in_h) / float(u_out_h);
    float src_x = (float(x_out) + 0.5) * scale_x - 0.5;
    float src_y = (float(y_out) + 0.5) * scale_y - 0.5;

    int x0 = int(floor(src_x));
    int y0 = int(floor(src_y));
    int x1 = x0 + 1;
    int y1 = y0 + 1;
    float fx = src_x - float(x0);
    float fy = src_y - float(y0);

    x0 = clamp(x0, 0, u_in_w - 1);
    y0 = clamp(y0, 0, u_in_h - 1);
    x1 = clamp(x1, 0, u_in_w - 1);
    y1 = clamp(y1, 0, u_in_h - 1);

    vec4 v00 = texelFetch(u_input, ivec2(x0 * u_c_groups + c_group, y0), 0);
    vec4 v10 = texelFetch(u_input, ivec2(x1 * u_c_groups + c_group, y0), 0);
    vec4 v01 = texelFetch(u_input, ivec2(x0 * u_c_groups + c_group, y1), 0);
    vec4 v11 = texelFetch(u_input, ivec2(x1 * u_c_groups + c_group, y1), 0);

    fragColor = mix(mix(v00, v10, fx), mix(v01, v11, fx), fy);
}
\`;var Ye=class extends h{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Jr);let o=e.c/4,n=i.outW*o,s=this.makeTexture(null,n,i.outH);this.output={h:i.outH,w:i.outW,c:e.c,texture:s,texW:n,texH:i.outH},this.inputs=[e],this.samplers=[{name:"u_input",texture:e.texture}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_out_w:i.outW,u_out_h:i.outH,u_c_groups:o},this.defaultSetup(),this.dispatch=[n,i.outH]}};var Zr=\`#version 300 es
// Top-left crop: the output viewport is smaller than the input texture, so reading
// the same fragment coord yields the top-left subregion (channel groups packed in
// the x axis line up because group count is unchanged).

precision highp float;
precision highp int;

uniform sampler2D u_input;
out vec4 fragColor;

void main() {
    fragColor = texelFetch(u_input, ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y)), 0);
}
\`;var Qe=class extends h{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Zr);let o=e.c/4,n=i.outW*o,s=this.makeTexture(null,n,i.outH);this.output={h:i.outH,w:i.outW,c:e.c,texture:s,texW:n,texH:i.outH},this.inputs=[e],this.samplers=[{name:"u_input",texture:e.texture}],this.defaultSetup(),this.dispatch=[n,i.outH]}};var eo=\`#version 300 es
// Bicubic upsample (arbitrary scale) \\u2014 Keys cubic, a=-0.75 (PyTorch default
// for mode='bicubic', align_corners=False).
//
// Direct 2D, 4\\xD74 = 16 taps per output pixel. Hardware texture filtering
// can't be used (NHWC vec4 layout means adjacent texels in x belong to
// different channel groups, not spatial neighbours).

precision highp float;
precision highp int;

uniform sampler2D u_input;
uniform int u_in_w;
uniform int u_in_h;
uniform int u_out_w;
uniform int u_out_h;
uniform int u_c_groups;

const float A = -0.75;

float wcubic(float d) {
    float ad = abs(d);
    if (ad <= 1.0) return ((A + 2.0) * ad - (A + 3.0)) * ad * ad + 1.0;
    if (ad <  2.0) return ((A * ad - 5.0 * A) * ad + 8.0 * A) * ad - 4.0 * A;
    return 0.0;
}

out vec4 fragColor;

void main() {
    ivec2 fc    = ivec2(gl_FragCoord.xy);
    int x_out   = fc.x / u_c_groups;
    int y_out   = fc.y;
    int c_group = fc.x - x_out * u_c_groups;

    float src_x = (float(x_out) + 0.5) * float(u_in_w) / float(u_out_w) - 0.5;
    float src_y = (float(y_out) + 0.5) * float(u_in_h) / float(u_out_h) - 0.5;

    int   x0 = int(floor(src_x));
    int   y0 = int(floor(src_y));
    float fx = src_x - float(x0);
    float fy = src_y - float(y0);

    // Weights for offsets {-1, 0, 1, 2} from x0/y0.
    float wx[4];
    float wy[4];
    wx[0] = wcubic(1.0 + fx); wx[1] = wcubic(fx);       wx[2] = wcubic(1.0 - fx); wx[3] = wcubic(2.0 - fx);
    wy[0] = wcubic(1.0 + fy); wy[1] = wcubic(fy);       wy[2] = wcubic(1.0 - fy); wy[3] = wcubic(2.0 - fy);

    vec4 acc = vec4(0.0);
    for (int j = 0; j < 4; j++) {
        int sy = clamp(y0 + j - 1, 0, u_in_h - 1);
        for (int i = 0; i < 4; i++) {
            int sx = clamp(x0 + i - 1, 0, u_in_w - 1);
            vec4 v = texelFetch(u_input, ivec2(sx * u_c_groups + c_group, sy), 0);
            acc += (wx[i] * wy[j]) * v;
        }
    }
    fragColor = acc;
}
\`;var Je=class extends h{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",eo);let o=e.c/4,n=i.outW*o,s=this.makeTexture(null,n,i.outH);this.output={h:i.outH,w:i.outW,c:e.c,texture:s,texW:n,texH:i.outH},this.inputs=[e],this.samplers=[{name:"u_input",texture:e.texture}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_out_w:i.outW,u_out_h:i.outH,u_c_groups:o},this.defaultSetup(),this.dispatch=[n,i.outH]}};var to=\`#version 300 es
// Channel concat \\u2014 concatenates two NHWC textures along the channel dimension.
// Both inputs must share the same spatial dimensions (W, H). Channel counts are
// multiples of 4 so each "group" is one vec4 texel.
//
// Input  A: (W * a_c_groups, H)
// Input  B: (W * b_c_groups, H)
// Output:   (W * (a_c_groups + b_c_groups), H)

precision highp float;
precision highp int;

uniform sampler2D u_input_a;
uniform sampler2D u_input_b;
uniform int u_a_c_groups;
uniform int u_b_c_groups;

out vec4 fragColor;

void main() {
    ivec2 fc       = ivec2(gl_FragCoord.xy);
    int out_groups = u_a_c_groups + u_b_c_groups;
    int x_spatial  = fc.x / out_groups;
    int c_out      = fc.x - x_spatial * out_groups;
    int y          = fc.y;

    if (c_out < u_a_c_groups) {
        fragColor = texelFetch(u_input_a, ivec2(x_spatial * u_a_c_groups + c_out, y), 0);
    } else {
        int c_b = c_out - u_a_c_groups;
        fragColor = texelFetch(u_input_b, ivec2(x_spatial * u_b_c_groups + c_b, y), 0);
    }
}
\`;var Ze=class extends h{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",to);let o=e.c/4,n=i.c/4,s=o+n,p=e.c+i.c,l=e.w*s,c=this.makeTexture(null,l,e.h);this.output={h:e.h,w:e.w,c:p,texture:c,texW:l,texH:e.h},this.inputs=[e,i],this.samplers=[{name:"u_input_a",texture:e.texture},{name:"u_input_b",texture:i.texture}],this.uniformInts={u_a_c_groups:o,u_b_c_groups:n},this.defaultSetup(),this.dispatch=[l,e.h]}};var ro=\`#version 300 es
// Bilinear upsample + sigmoid fused \\u2014 sigmoid applied at write time, no intermediate buffer.
// See bilinear_upsample.glsl for the manual 4-tap blend rationale.
//
// Input:  (in_W  * c_groups, in_H)
// Output: (out_W * c_groups, out_H)

precision highp float;
precision highp int;

uniform sampler2D u_input;
uniform int u_in_w;
uniform int u_in_h;
uniform int u_out_w;
uniform int u_out_h;
uniform int u_c_groups;

out vec4 fragColor;

void main() {
    ivec2 fc    = ivec2(gl_FragCoord.xy);
    int x_out   = fc.x / u_c_groups;
    int y_out   = fc.y;
    int c_group = fc.x - x_out * u_c_groups;

    float scale_x = float(u_in_w) / float(u_out_w);
    float scale_y = float(u_in_h) / float(u_out_h);
    float src_x = (float(x_out) + 0.5) * scale_x - 0.5;
    float src_y = (float(y_out) + 0.5) * scale_y - 0.5;

    int x0 = int(floor(src_x));
    int y0 = int(floor(src_y));
    int x1 = x0 + 1;
    int y1 = y0 + 1;
    float fx = src_x - float(x0);
    float fy = src_y - float(y0);

    x0 = clamp(x0, 0, u_in_w - 1);
    y0 = clamp(y0, 0, u_in_h - 1);
    x1 = clamp(x1, 0, u_in_w - 1);
    y1 = clamp(y1, 0, u_in_h - 1);

    vec4 v00 = texelFetch(u_input, ivec2(x0 * u_c_groups + c_group, y0), 0);
    vec4 v10 = texelFetch(u_input, ivec2(x1 * u_c_groups + c_group, y0), 0);
    vec4 v01 = texelFetch(u_input, ivec2(x0 * u_c_groups + c_group, y1), 0);
    vec4 v11 = texelFetch(u_input, ivec2(x1 * u_c_groups + c_group, y1), 0);

    vec4 result = mix(mix(v00, v10, fx), mix(v01, v11, fx), fy);
    fragColor = 1.0 / (1.0 + exp(-result));
}
\`;var et=class extends h{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",ro);let o=e.c/4,n=i.outW*o,s=this.makeTexture(null,n,i.outH);this.output={h:i.outH,w:i.outW,c:e.c,texture:s,texW:n,texH:i.outH},this.inputs=[e],this.samplers=[{name:"u_input",texture:e.texture}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_out_w:i.outW,u_out_h:i.outH,u_c_groups:o},this.defaultSetup(),this.dispatch=[n,i.outH]}};var oo=\`#version 300 es
// Bilinear upsample (input_a) + channel concat (with input_b) fused.
// input_a is the decoder tensor at small spatial res (in_h \\xD7 in_w), bilinearly resized to (out_h \\xD7 out_w).
// input_b is the encoder skip feature already at output resolution.
// Output channels [0..a_groups-1] come from upsampled input_a.
// Output channels [a_groups..out_groups-1] come from input_b (passthrough).

precision highp float;
precision highp int;

uniform sampler2D u_input_a;
uniform sampler2D u_input_b;
uniform int u_in_w;
uniform int u_in_h;
uniform int u_out_w;
uniform int u_out_h;
uniform int u_a_c_groups;
uniform int u_b_c_groups;

out vec4 fragColor;

void main() {
    ivec2 fc       = ivec2(gl_FragCoord.xy);
    int out_groups = u_a_c_groups + u_b_c_groups;
    int x_out      = fc.x / out_groups;
    int c_out      = fc.x - x_out * out_groups;
    int y_out      = fc.y;

    if (c_out < u_a_c_groups) {
        // Bilinear sample from input_a at (x_out, y_out) for channel group c_out.
        float scale_x = float(u_in_w) / float(u_out_w);
        float scale_y = float(u_in_h) / float(u_out_h);
        float src_x = (float(x_out) + 0.5) * scale_x - 0.5;
        float src_y = (float(y_out) + 0.5) * scale_y - 0.5;

        int x0 = int(floor(src_x));
        int y0 = int(floor(src_y));
        int x1 = x0 + 1;
        int y1 = y0 + 1;
        float fx = src_x - float(x0);
        float fy = src_y - float(y0);

        x0 = clamp(x0, 0, u_in_w - 1);
        y0 = clamp(y0, 0, u_in_h - 1);
        x1 = clamp(x1, 0, u_in_w - 1);
        y1 = clamp(y1, 0, u_in_h - 1);

        vec4 v00 = texelFetch(u_input_a, ivec2(x0 * u_a_c_groups + c_out, y0), 0);
        vec4 v10 = texelFetch(u_input_a, ivec2(x1 * u_a_c_groups + c_out, y0), 0);
        vec4 v01 = texelFetch(u_input_a, ivec2(x0 * u_a_c_groups + c_out, y1), 0);
        vec4 v11 = texelFetch(u_input_a, ivec2(x1 * u_a_c_groups + c_out, y1), 0);

        fragColor = mix(mix(v00, v10, fx), mix(v01, v11, fx), fy);
    } else {
        int c_b = c_out - u_a_c_groups;
        fragColor = texelFetch(u_input_b, ivec2(x_out * u_b_c_groups + c_b, y_out), 0);
    }
}
\`;var tt=class extends h{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",oo);let n=e.c/4,s=i.c/4,p=n+s,l=e.c+i.c,c=o.outW*p,d=this.makeTexture(null,c,o.outH);this.output={h:o.outH,w:o.outW,c:l,texture:d,texW:c,texH:o.outH},this.inputs=[e,i],this.samplers=[{name:"u_input_a",texture:e.texture},{name:"u_input_b",texture:i.texture}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_out_w:o.outW,u_out_h:o.outH,u_a_c_groups:n,u_b_c_groups:s},this.defaultSetup(),this.dispatch=[c,o.outH]}};var io=\`#version 300 es
// Bilinear upsample + 1\\xD71 pointwise conv fused.
// For each output pixel + out group, bilinearly samples each in_group from input,
// applies the 1\\xD71 conv weight, and writes the activated result.
//
// Input:   (in_W  * in_groups,  in_H)
// Output:  (out_W * out_groups, out_H)
// Weights: (in_groups * 4, out_groups)  (K=1, so kernel-row dimension collapses)
//          mat4[col][row] = weight(in_channel=col, out_channel=row)
// Bias:    (out_groups, 1)

precision highp float;
precision highp int;

uniform sampler2D u_input;
uniform sampler2D u_weights;
uniform sampler2D u_bias;

uniform int u_in_w;
uniform int u_in_h;
uniform int u_out_w;
uniform int u_out_h;
uniform int u_in_c_groups;
uniform int u_out_c_groups;
uniform int u_activation;   // 0 = none, 1 = relu6, 2 = relu

out vec4 fragColor;

void main() {
    int fx      = int(gl_FragCoord.x);
    int fy      = int(gl_FragCoord.y);
    int x_out   = fx / u_out_c_groups;
    int y_out   = fy;
    int o_group = fx - x_out * u_out_c_groups;

    float scale_x = float(u_in_w) / float(u_out_w);
    float scale_y = float(u_in_h) / float(u_out_h);
    float src_x = (float(x_out) + 0.5) * scale_x - 0.5;
    float src_y = (float(y_out) + 0.5) * scale_y - 0.5;

    int x0 = int(floor(src_x));
    int y0 = int(floor(src_y));
    int x1 = x0 + 1;
    int y1 = y0 + 1;
    float fx_w = src_x - float(x0);
    float fy_w = src_y - float(y0);

    x0 = clamp(x0, 0, u_in_w - 1);
    y0 = clamp(y0, 0, u_in_h - 1);
    x1 = clamp(x1, 0, u_in_w - 1);
    y1 = clamp(y1, 0, u_in_h - 1);

    vec4 result = texelFetch(u_bias, ivec2(o_group, 0), 0);

    for (int i = 0; i < u_in_c_groups; i++) {
        vec4 v00 = texelFetch(u_input, ivec2(x0 * u_in_c_groups + i, y0), 0);
        vec4 v10 = texelFetch(u_input, ivec2(x1 * u_in_c_groups + i, y0), 0);
        vec4 v01 = texelFetch(u_input, ivec2(x0 * u_in_c_groups + i, y1), 0);
        vec4 v11 = texelFetch(u_input, ivec2(x1 * u_in_c_groups + i, y1), 0);

        vec4 sampled = mix(mix(v00, v10, fx_w), mix(v01, v11, fx_w), fy_w);

        int base = i * 4;
        mat4 w = mat4(
            texelFetch(u_weights, ivec2(base,     o_group), 0),
            texelFetch(u_weights, ivec2(base + 1, o_group), 0),
            texelFetch(u_weights, ivec2(base + 2, o_group), 0),
            texelFetch(u_weights, ivec2(base + 3, o_group), 0)
        );
        result += w * sampled;
    }

    if      (u_activation == 1) result = clamp(result, 0.0, 6.0);
    else if (u_activation == 2) result = max(result, vec4(0.0));

    fragColor = result;
}
\`;var rt=class extends h{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",io);let n=e.c/4,s=o.outChannels/4,p=m(i.weights),l=m(i.bias),c=this.makeTexture(p,n*4,s),d=this.makeTexture(l,s,1),_=o.outW*s,b=this.makeTexture(null,_,o.outH);this.output={h:o.outH,w:o.outW,c:o.outChannels,texture:b,texW:_,texH:o.outH},this.inputs=[e],this.weights=[],this.samplers=[{name:"u_input",texture:e.texture},{name:"u_weights",texture:c},{name:"u_bias",texture:d}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_out_w:o.outW,u_out_h:o.outH,u_in_c_groups:n,u_out_c_groups:s,u_activation:o.activation==="relu6"?1:0},this.defaultSetup(),this.dispatch=[_,o.outH]}};var ao=\`#version 300 es
// Conv2d + skip add fused \\u2014 identical to conv2d.glsl with a skip texture added at write time.
// See conv2d.glsl for tensor/weight layout details.

precision highp float;
precision highp int;

uniform sampler2D u_input;
uniform sampler2D u_skip;
uniform sampler2D u_weights;
uniform sampler2D u_bias;

uniform int u_in_w;
uniform int u_in_h;
uniform int u_in_c_groups;
uniform int u_out_c_groups;
uniform int u_kernel_h;
uniform int u_kernel_w;
uniform int u_stride;
uniform int u_pad_top;
uniform int u_pad_left;
uniform int u_activation;   // 0 = none, 1 = relu6, 2 = relu

out vec4 fragColor;

void main() {
    int fx      = int(gl_FragCoord.x);
    int fy      = int(gl_FragCoord.y);
    int x_out   = fx / u_out_c_groups;
    int y_out   = fy;
    int o_group = fx - x_out * u_out_c_groups;

    vec4 result = texelFetch(u_bias, ivec2(o_group, 0), 0);

    for (int ky = 0; ky < u_kernel_h; ky++) {
        for (int kx = 0; kx < u_kernel_w; kx++) {
            int in_y = y_out * u_stride + ky - u_pad_top;
            int in_x = x_out * u_stride + kx - u_pad_left;

            if (in_y < 0 || in_y >= u_in_h || in_x < 0 || in_x >= u_in_w) continue;

            int z     = ky * u_kernel_w + kx;
            int w_row = z * u_out_c_groups + o_group;

            for (int i = 0; i < u_in_c_groups; i++) {
                vec4 in_val = texelFetch(u_input, ivec2(in_x * u_in_c_groups + i, in_y), 0);

                int base = i * 4;
                mat4 w = mat4(
                    texelFetch(u_weights, ivec2(base,     w_row), 0),
                    texelFetch(u_weights, ivec2(base + 1, w_row), 0),
                    texelFetch(u_weights, ivec2(base + 2, w_row), 0),
                    texelFetch(u_weights, ivec2(base + 3, w_row), 0)
                );
                result += w * in_val;
            }
        }
    }

    if      (u_activation == 1) result = clamp(result, 0.0, 6.0);
    else if (u_activation == 2) result = max(result, vec4(0.0));

    fragColor = result + texelFetch(u_skip, ivec2(fx, fy), 0);
}
\`;var ot=class extends h{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",ao);let s=T(e.h,n.kernel,n.stride,n.padding),p=T(e.w,n.kernel,n.stride,n.padding),l=e.c/4,c=n.outChannels/4,d=C(n.padding,e.h,s,n.kernel,n.stride),_=C(n.padding,e.w,p,n.kernel,n.stride),b=m(o.weights),g=m(o.bias),v=this.makeTexture(b,l*4,n.kernel*n.kernel*c),x=this.makeTexture(g,c,1),k=p*c,B=this.makeTexture(null,k,s);this.output={h:s,w:p,c:n.outChannels,texture:B,texW:k,texH:s},this.inputs=[e,i],this.weights=[],this.samplers=[{name:"u_input",texture:e.texture},{name:"u_skip",texture:i.texture},{name:"u_weights",texture:v},{name:"u_bias",texture:x}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_in_c_groups:l,u_out_c_groups:c,u_kernel_h:n.kernel,u_kernel_w:n.kernel,u_stride:n.stride,u_pad_top:d,u_pad_left:_,u_activation:n.activation==="relu6"?1:0},this.defaultSetup(),this.dispatch=[k,s]}};var no=\`#version 300 es
// proj_residual: bespoke 1\\xD71 conv (no activation) + residual add, fused.
// Specializes conv2d_add to kernel=1 / stride=1 / pad=0 / no activation. Both
// inputs share the same spatial resolution. See conv2d.glsl for the weight
// texture layout (here K=1, so the weight texture is (inGroups*4, outGroups)).

precision highp float;
precision highp int;

uniform sampler2D u_input;
uniform sampler2D u_skip;
uniform sampler2D u_weights;
uniform sampler2D u_bias;

uniform int u_in_c_groups;
uniform int u_out_c_groups;

out vec4 fragColor;

void main() {
    int fx      = int(gl_FragCoord.x);
    int fy      = int(gl_FragCoord.y);
    int x_out   = fx / u_out_c_groups;
    int o_group = fx - x_out * u_out_c_groups;

    vec4 result = texelFetch(u_bias, ivec2(o_group, 0), 0);

    for (int i = 0; i < u_in_c_groups; i++) {
        vec4 in_val = texelFetch(u_input, ivec2(x_out * u_in_c_groups + i, fy), 0);

        int base = i * 4;
        mat4 w = mat4(
            texelFetch(u_weights, ivec2(base,     o_group), 0),
            texelFetch(u_weights, ivec2(base + 1, o_group), 0),
            texelFetch(u_weights, ivec2(base + 2, o_group), 0),
            texelFetch(u_weights, ivec2(base + 3, o_group), 0)
        );
        result += w * in_val;
    }

    fragColor = result + texelFetch(u_skip, ivec2(fx, fy), 0);
}
\`;var it=class extends h{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",no);let s=e.c/4,p=n.outChannels/4,l=m(o.weights),c=m(o.bias),d=this.makeTexture(l,s*4,p),_=this.makeTexture(c,p,1),b=e.w*p,g=this.makeTexture(null,b,e.h);this.output={h:e.h,w:e.w,c:n.outChannels,texture:g,texW:b,texH:e.h},this.inputs=[e,i],this.weights=[],this.samplers=[{name:"u_input",texture:e.texture},{name:"u_skip",texture:i.texture},{name:"u_weights",texture:d},{name:"u_bias",texture:_}],this.uniformInts={u_in_c_groups:s,u_out_c_groups:p},this.defaultSetup(),this.dispatch=[b,e.h]}};var so=\`#version 300 es
// concat_conv2d: fuses [concat(a, b) \\u2192 conv 3\\xD73 (pad 1) \\u2192 relu6] into one pass.
// Both inputs already at output resolution. Weight cols [0, a_groups) read a,
// [a_groups, I) read b. Weight texture layout matches conv2d.glsl
// ((in_groups*4, 9*out_groups), in_groups = a_groups + b_groups).

precision highp float;
precision highp int;

uniform sampler2D u_a;
uniform sampler2D u_b;
uniform sampler2D u_weights;
uniform sampler2D u_bias;

uniform int u_w;
uniform int u_h;
uniform int u_a_groups;
uniform int u_b_groups;
uniform int u_out_c_groups;

out vec4 fragColor;

void main() {
    int fx      = int(gl_FragCoord.x);
    int fy      = int(gl_FragCoord.y);
    int x_out   = fx / u_out_c_groups;
    int o_group = fx - x_out * u_out_c_groups;
    int A = u_a_groups;
    int B = u_b_groups;
    int I = A + B;

    vec4 result = texelFetch(u_bias, ivec2(o_group, 0), 0);

    for (int ky = 0; ky < 3; ky++) {
        for (int kx = 0; kx < 3; kx++) {
            int in_y = fy    + ky - 1;
            int in_x = x_out + kx - 1;
            if (in_x < 0 || in_y < 0 || in_x >= u_w || in_y >= u_h) continue;

            int z     = ky * 3 + kx;
            int w_row = z * u_out_c_groups + o_group;

            for (int i = 0; i < I; i++) {
                vec4 in_val = (i < A)
                    ? texelFetch(u_a, ivec2(in_x * A + i,       in_y), 0)
                    : texelFetch(u_b, ivec2(in_x * B + (i - A), in_y), 0);

                int base = i * 4;
                mat4 w = mat4(
                    texelFetch(u_weights, ivec2(base,     w_row), 0),
                    texelFetch(u_weights, ivec2(base + 1, w_row), 0),
                    texelFetch(u_weights, ivec2(base + 2, w_row), 0),
                    texelFetch(u_weights, ivec2(base + 3, w_row), 0)
                );
                result += w * in_val;
            }
        }
    }

    fragColor = clamp(result, 0.0, 6.0);
}
\`;var at=class extends h{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",so);let s=e.c/4,p=i.c/4,l=s+p,c=n.outChannels/4,d=m(o.weights),_=m(o.bias),b=this.makeTexture(d,l*4,9*c),g=this.makeTexture(_,c,1),v=e.w*c,x=this.makeTexture(null,v,e.h);this.output={h:e.h,w:e.w,c:n.outChannels,texture:x,texW:v,texH:e.h},this.inputs=[e,i],this.weights=[],this.samplers=[{name:"u_a",texture:e.texture},{name:"u_b",texture:i.texture},{name:"u_weights",texture:b},{name:"u_bias",texture:g}],this.uniformInts={u_w:e.w,u_h:e.h,u_a_groups:s,u_b_groups:p,u_out_c_groups:c},this.defaultSetup(),this.dispatch=[v,e.h]}};var uo=\`#version 300 es
// gates_fused: ConvGRU z + r gates, fused. Production config (c_up=2,
// recurrent=1). u_in (.x=a, .y=b), h_prev (.x). weights 9 vec4 =
// (z_w_b, z_w_h, r_w_b, r_w_h) in a (9,1) texture. bias .xy. output (z, r, 0, 0).

precision highp float;
precision highp int;

uniform sampler2D u_u_in;     // (W, H)
uniform sampler2D u_h_prev;   // (W, H)
uniform sampler2D u_weights;  // (9, 1)
uniform sampler2D u_bias;     // (1, 1)
uniform int u_w;
uniform int u_h;

out vec4 fragColor;

void main() {
    int x = int(gl_FragCoord.x);
    int y = int(gl_FragCoord.y);

    vec2 b = texelFetch(u_bias, ivec2(0, 0), 0).xy;
    float z_pre = b.x;
    float r_pre = b.y;

    for (int ky = 0; ky < 3; ky++) {
        for (int kx = 0; kx < 3; kx++) {
            int iy = y + ky - 1;
            int ix = x + kx - 1;
            if (iy < 0 || ix < 0 || iy >= u_h || ix >= u_w) continue;
            int kpos  = ky * 3 + kx;
            float b_n = texelFetch(u_u_in,   ivec2(ix, iy), 0).y;
            float h_n = texelFetch(u_h_prev, ivec2(ix, iy), 0).z;
            vec4 w    = texelFetch(u_weights, ivec2(kpos, 0), 0);
            z_pre += w.x * b_n + w.y * h_n;
            r_pre += w.z * b_n + w.w * h_n;
        }
    }

    float z = 1.0 / (1.0 + exp(-z_pre));
    float r = 1.0 / (1.0 + exp(-r_pre));
    fragColor = vec4(z, r, 0.0, 0.0);
}
\`;var nt=class extends h{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",uo);let n=this.makeTexture(m(o.weights),9,1),s=this.makeTexture(y(o.bias),1,1),p=e.w,l=this.makeTexture(null,p,e.h);this.output={h:e.h,w:e.w,c:4,texture:l,texW:p,texH:e.h},this.inputs=[e,i],this.weights=[],this.samplers=[{name:"u_u_in",texture:e.texture},{name:"u_h_prev",texture:i.texture},{name:"u_weights",texture:n},{name:"u_bias",texture:s}],this.uniformInts={u_w:e.w,u_h:e.h},this.defaultSetup(),this.dispatch=[p,e.h]}};var po=\`#version 300 es
// cand_update_fused: ConvGRU candidate + state update + output, fused.
// Production config (c_up=2, recurrent=1). u_in (.x=a, .y=b), h_prev (.x),
// gates_out (.x=z, .y=r). weights 9 vec4 (.xy = b_w, rh_w) in a (9,1) texture.
// bias .x, gamma .x. output (a, b_out, 0, 0).

precision highp float;
precision highp int;

uniform sampler2D u_u_in;       // (W, H)
uniform sampler2D u_h_prev;     // (W, H)
uniform sampler2D u_gates_out;  // (W, H)
uniform sampler2D u_weights;    // (9, 1)
uniform sampler2D u_bias;       // (1, 1)
uniform sampler2D u_gamma;      // (1, 1)
uniform int u_w;
uniform int u_h;

out vec4 fragColor;

void main() {
    int x = int(gl_FragCoord.x);
    int y = int(gl_FragCoord.y);

    float cand_pre = texelFetch(u_bias, ivec2(0, 0), 0).x;
    for (int ky = 0; ky < 3; ky++) {
        for (int kx = 0; kx < 3; kx++) {
            int iy = y + ky - 1;
            int ix = x + kx - 1;
            if (iy < 0 || ix < 0 || iy >= u_h || ix >= u_w) continue;
            int kpos  = ky * 3 + kx;
            float b_n = texelFetch(u_u_in,      ivec2(ix, iy), 0).y;
            float h_n = texelFetch(u_h_prev,    ivec2(ix, iy), 0).z;
            float r_n = texelFetch(u_gates_out, ivec2(ix, iy), 0).y;
            vec4 w    = texelFetch(u_weights,   ivec2(kpos, 0), 0);
            cand_pre += w.x * b_n + w.y * (r_n * h_n);
        }
    }

    float h_til      = tanh(cand_pre);
    vec4  u_cur      = texelFetch(u_u_in,      ivec2(x, y), 0);
    float z_cur      = texelFetch(u_gates_out, ivec2(x, y), 0).x;
    float h_prev_cur = texelFetch(u_h_prev,    ivec2(x, y), 0).z;
    float h_new      = (1.0 - z_cur) * h_prev_cur + z_cur * h_til;
    float gamma      = texelFetch(u_gamma,     ivec2(0, 0), 0).x;
    float b_out      = u_cur.y + gamma * h_new;
    fragColor = vec4(u_cur.x, b_out, h_new, 0.0);
}
\`;var st=class extends h{constructor(r,e,i,o,n,s){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",po);let p=this.makeTexture(m(n.weights),9,1),l=this.makeTexture(y(n.bias),1,1),c=this.makeTexture(y(s),1,1),d=e.w,_=this.makeTexture(null,d,e.h);this.output={h:e.h,w:e.w,c:4,texture:_,texW:d,texH:e.h},this.inputs=[e,i,o],this.weights=[],this.samplers=[{name:"u_u_in",texture:e.texture},{name:"u_h_prev",texture:i.texture},{name:"u_gates_out",texture:o.texture},{name:"u_weights",texture:p},{name:"u_bias",texture:l},{name:"u_gamma",texture:c}],this.uniformInts={u_w:e.w,u_h:e.h},this.defaultSetup(),this.dispatch=[d,e.h]}};var lo=\`#version 300 es
// conv_expand: bespoke N\\u21922 conv 3\\xD73 (pad 1) + relu (wrapper expand_feat).
// Input N ch (in_groups vec4); output 2ch in .xy (.zw = 0). Weights: 9 *
// in_groups mat4x2 (8 floats each, col-major c0r0,c0r1,...,c3r0,c3r1) in a
// 1-row texture \\u2014 bounded small (feat_ch \\u2264 32).

precision highp float;
precision highp int;

uniform sampler2D u_input;    // (W*in_groups, H)
uniform sampler2D u_weights;  // (ceil(9*in_groups*8/4), 1)
uniform sampler2D u_bias;     // (1, 1) \\u2014 .xy
uniform int u_w;
uniform int u_h;
uniform int u_in_groups;

out vec4 fragColor;

float wf(int i) { return texelFetch(u_weights, ivec2(i / 4, 0), 0)[i & 3]; }

void main() {
    int x = int(gl_FragCoord.x);
    int y = int(gl_FragCoord.y);

    vec2 result = texelFetch(u_bias, ivec2(0, 0), 0).xy;

    for (int ky = 0; ky < 3; ky++) {
        for (int kx = 0; kx < 3; kx++) {
            int iy = y + ky - 1;
            int ix = x + kx - 1;
            if (iy < 0 || ix < 0 || iy >= u_h || ix >= u_w) continue;
            int kpos = ky * 3 + kx;
            for (int ig = 0; ig < u_in_groups; ig++) {
                vec4 v = texelFetch(u_input, ivec2(ix * u_in_groups + ig, iy), 0);
                int base = (kpos * u_in_groups + ig) * 8;  // mat4x2 = 8 floats
                result.x += wf(base + 0) * v.x + wf(base + 2) * v.y + wf(base + 4) * v.z + wf(base + 6) * v.w;
                result.y += wf(base + 1) * v.x + wf(base + 3) * v.y + wf(base + 5) * v.z + wf(base + 7) * v.w;
            }
        }
    }

    fragColor = vec4(max(result, vec2(0.0)), 0.0, 0.0);   // expand_feat is F.relu
}
\`;var ut=class extends h{constructor(r,e,i){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",lo);let o=e.c/4,n=this.makeTexture(m(i.weights),18*o,1),s=this.makeTexture(y(i.bias),1,1),p=e.w,l=this.makeTexture(null,p,e.h);this.output={h:e.h,w:e.w,c:4,texture:l,texW:p,texH:e.h},this.inputs=[e],this.weights=[],this.samplers=[{name:"u_input",texture:e.texture},{name:"u_weights",texture:n},{name:"u_bias",texture:s}],this.uniformInts={u_w:e.w,u_h:e.h,u_in_groups:o},this.defaultSetup(),this.dispatch=[p,e.h]}};var co=\`#version 300 es
// cat_conv_6to2: fused concat(u[2], d[4]) \\u2192 6\\u21922 conv 3\\xD73 (pad 1) + relu
// (E up1_combine). Channel order v3a=(u.x,u.y,d.x), v3b=d.yzw. weights = 9*2
// mat3x2 (6 floats each, col-major) in a 1-row (27-texel) texture.

precision highp float;
precision highp int;

uniform sampler2D u_u_in;     // (W, H) \\u2014 .xy
uniform sampler2D u_d_in;     // (W, H) \\u2014 full vec4
uniform sampler2D u_weights;  // (27, 1)
uniform sampler2D u_bias;     // (1, 1) \\u2014 .xy
uniform int u_w;
uniform int u_h;

out vec4 fragColor;

float wf(int i) { return texelFetch(u_weights, ivec2(i / 4, 0), 0)[i & 3]; }

void main() {
    int x = int(gl_FragCoord.x);
    int y = int(gl_FragCoord.y);

    vec2 result = texelFetch(u_bias, ivec2(0, 0), 0).xy;
    for (int ky = 0; ky < 3; ky++) {
        for (int kx = 0; kx < 3; kx++) {
            int iy = y + ky - 1;
            int ix = x + kx - 1;
            if (iy < 0 || ix < 0 || iy >= u_h || ix >= u_w) continue;
            int kpos = ky * 3 + kx;
            vec4 u = texelFetch(u_u_in, ivec2(ix, iy), 0);
            vec4 d = texelFetch(u_d_in, ivec2(ix, iy), 0);
            vec3 v3a = vec3(u.x, u.y, d.x);
            vec3 v3b = d.yzw;
            for (int ig = 0; ig < 2; ig++) {
                int base = (kpos * 2 + ig) * 6;
                vec3 v3 = (ig == 0) ? v3a : v3b;
                for (int col = 0; col < 3; col++) {
                    result.x += wf(base + col * 2 + 0) * v3[col];
                    result.y += wf(base + col * 2 + 1) * v3[col];
                }
            }
        }
    }

    fragColor = vec4(max(result, vec2(0.0)), 0.0, 0.0);   // up1_combine is F.relu
}
\`;var pt=class extends h{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",co);let n=this.makeTexture(m(o.weights),27,1),s=this.makeTexture(y(o.bias),1,1),p=e.w,l=this.makeTexture(null,p,e.h);this.output={h:e.h,w:e.w,c:4,texture:l,texW:p,texH:e.h},this.inputs=[e,i],this.weights=[],this.samplers=[{name:"u_u_in",texture:e.texture},{name:"u_d_in",texture:i.texture},{name:"u_weights",texture:n},{name:"u_bias",texture:s}],this.uniformInts={u_w:e.w,u_h:e.h},this.defaultSetup(),this.dispatch=[p,e.h]}};var mo=\`#version 300 es
// down_adapter: stride-N 3\\xD73 conv (mat4x4, 4\\u21924) + relu, then 1\\xD71 adapter
// (4\\u21923, last row 0). down_w = 9 mat4x4 (1-row, 36 texels); adapt_w = 1 mat4x4
// (4 texels). Output 3ch in .xyz (.w=0). Symmetric pad. Weight packing matches
// conv2d (col-major mat4x4 via the flat accessor).

precision highp float;
precision highp int;

uniform sampler2D u_input;     // (in_W, in_H) \\u2014 in_c padded to 1 vec4
uniform sampler2D u_down_w;    // (36, 1)
uniform sampler2D u_down_b;    // (1, 1)
uniform sampler2D u_adapt_w;   // (4, 1)
uniform sampler2D u_adapt_b;   // (1, 1) \\u2014 .xyz
uniform int u_in_w;
uniform int u_in_h;
uniform int u_stride;
uniform int u_pad;

out vec4 fragColor;

float dwf(int i) { return texelFetch(u_down_w,  ivec2(i / 4, 0), 0)[i & 3]; }
float awf(int i) { return texelFetch(u_adapt_w, ivec2(i / 4, 0), 0)[i & 3]; }

void main() {
    int x = int(gl_FragCoord.x);
    int y = int(gl_FragCoord.y);

    vec4 d = texelFetch(u_down_b, ivec2(0, 0), 0);
    for (int ky = 0; ky < 3; ky++) {
        for (int kx = 0; kx < 3; kx++) {
            int iy = y * u_stride + ky - u_pad;
            int ix = x * u_stride + kx - u_pad;
            if (iy < 0 || ix < 0 || iy >= u_in_h || ix >= u_in_w) continue;
            int kpos = ky * 3 + kx;
            vec4 v = texelFetch(u_input, ivec2(ix, iy), 0);
            int m = kpos * 16;
            d.x += dwf(m + 0) * v.x + dwf(m + 4) * v.y + dwf(m + 8)  * v.z + dwf(m + 12) * v.w;
            d.y += dwf(m + 1) * v.x + dwf(m + 5) * v.y + dwf(m + 9)  * v.z + dwf(m + 13) * v.w;
            d.z += dwf(m + 2) * v.x + dwf(m + 6) * v.y + dwf(m + 10) * v.z + dwf(m + 14) * v.w;
            d.w += dwf(m + 3) * v.x + dwf(m + 7) * v.y + dwf(m + 11) * v.z + dwf(m + 15) * v.w;
        }
    }
    d = max(d, vec4(0.0));   // relu

    vec4 ab = texelFetch(u_adapt_b, ivec2(0, 0), 0);
    vec4 a;
    a.x = awf(0) * d.x + awf(4) * d.y + awf(8)  * d.z + awf(12) * d.w + ab.x;
    a.y = awf(1) * d.x + awf(5) * d.y + awf(9)  * d.z + awf(13) * d.w + ab.y;
    a.z = awf(2) * d.x + awf(6) * d.y + awf(10) * d.z + awf(14) * d.w + ab.z;
    fragColor = vec4(a.xyz, 0.0);
}
\`;var lt=class extends h{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",mo);let s=T(e.h,3,n.stride,1),p=T(e.w,3,n.stride,1),l=C(1,e.h,s,3,n.stride),c=this.makeTexture(m(i.weights),36,1),d=this.makeTexture(y(i.bias),1,1),_=this.makeTexture(m(o.weights),4,1),b=this.makeTexture(y(o.bias),1,1),g=p,v=this.makeTexture(null,g,s);this.output={h:s,w:p,c:4,texture:v,texW:g,texH:s},this.inputs=[e],this.weights=[],this.samplers=[{name:"u_input",texture:e.texture},{name:"u_down_w",texture:c},{name:"u_down_b",texture:d},{name:"u_adapt_w",texture:_},{name:"u_adapt_b",texture:b}],this.uniformInts={u_in_w:e.w,u_in_h:e.h,u_stride:n.stride,u_pad:l},this.defaultSetup(),this.dispatch=[g,s]}};var fo=\`#version 300 es
// up_final: cat(u[2], rgb[3]) \\u2192 conv 3\\xD73 5\\u21921 \\u2192 sigmoid (A/B alpha head).
// weights 18 vec4 (1-row): [kpos]=(w0,w1,0,0) for u, [9+kpos]=(w2,w3,w4,0) rgb.

precision highp float;
precision highp int;

uniform sampler2D u_u_gru;    // (W, H) \\u2014 .xy
uniform sampler2D u_rgb;      // (W, H) \\u2014 .xyz
uniform sampler2D u_weights;  // (18, 1)
uniform sampler2D u_bias;     // (1, 1) \\u2014 .x
uniform int u_w;
uniform int u_h;

out vec4 fragColor;

void main() {
    int x = int(gl_FragCoord.x);
    int y = int(gl_FragCoord.y);

    float acc = texelFetch(u_bias, ivec2(0, 0), 0).x;
    for (int ky = 0; ky < 3; ky++) {
        for (int kx = 0; kx < 3; kx++) {
            int iy = y + ky - 1;
            int ix = x + kx - 1;
            if (iy < 0 || ix < 0 || iy >= u_h || ix >= u_w) continue;
            int kpos = ky * 3 + kx;
            vec4 u  = texelFetch(u_u_gru,   ivec2(ix, iy), 0);
            vec4 r  = texelFetch(u_rgb,     ivec2(ix, iy), 0);
            vec4 wu = texelFetch(u_weights, ivec2(kpos, 0), 0);
            vec4 wr = texelFetch(u_weights, ivec2(9 + kpos, 0), 0);
            acc += dot(wu.xy, u.xy);
            acc += dot(wr.xyz, r.xyz);
        }
    }

    fragColor = vec4(1.0 / (1.0 + exp(-acc)), 0.0, 0.0, 0.0);
}
\`;var ct=class extends h{constructor(r,e,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",fo);let n=this.makeTexture(m(o.weights),18,1),s=this.makeTexture(y(o.bias),1,1),p=e.w,l=this.makeTexture(null,p,e.h);this.output={h:e.h,w:e.w,c:4,texture:l,texW:p,texH:e.h},this.inputs=[e,i],this.weights=[],this.samplers=[{name:"u_u_gru",texture:e.texture},{name:"u_rgb",texture:i.texture},{name:"u_weights",texture:n},{name:"u_bias",texture:s}],this.uniformInts={u_w:e.w,u_h:e.h},this.defaultSetup(),this.dispatch=[p,e.h]}};var ho=\`#version 300 es
// up_final_skip (C/D alpha head): cat(u[2], d_full[4], rgb[3]) \\u2192 conv 9\\u21921 \\u2192
// sigmoid. Weights = 27 vec4 (3 per kpos): [kpos*3+0]=(w0,w1,0,0) u;
// [kpos*3+1]=(w2..w5) d_full; [kpos*3+2]=(w6,w7,w8,0) rgb.

precision highp float;
precision highp int;

uniform sampler2D u_u_gru;    // (W, H) \\u2014 .xy
uniform sampler2D u_d_full;   // (W, H) \\u2014 full vec4
uniform sampler2D u_rgb;      // (W, H) \\u2014 .xyz
uniform sampler2D u_weights;  // (27, 1)
uniform sampler2D u_bias;     // (1, 1) \\u2014 .x
uniform int u_w;
uniform int u_h;

out vec4 fragColor;

float wf(int i) { return texelFetch(u_weights, ivec2(i / 4, 0), 0)[i & 3]; }

void main() {
    int x = int(gl_FragCoord.x);
    int y = int(gl_FragCoord.y);

    float acc = texelFetch(u_bias, ivec2(0, 0), 0).x;
    for (int ky = 0; ky < 3; ky++) {
        for (int kx = 0; kx < 3; kx++) {
            int iy = y + ky - 1;
            int ix = x + kx - 1;
            if (iy < 0 || ix < 0 || iy >= u_h || ix >= u_w) continue;
            int kpos = ky * 3 + kx;
            vec4 u = texelFetch(u_u_gru,  ivec2(ix, iy), 0);
            vec4 d = texelFetch(u_d_full, ivec2(ix, iy), 0);
            vec4 r = texelFetch(u_rgb,    ivec2(ix, iy), 0);
            int b0 = (kpos * 3 + 0) * 4, b1 = (kpos * 3 + 1) * 4, b2 = (kpos * 3 + 2) * 4;
            acc += wf(b0 + 0) * u.x + wf(b0 + 1) * u.y;
            acc += wf(b1 + 0) * d.x + wf(b1 + 1) * d.y + wf(b1 + 2) * d.z + wf(b1 + 3) * d.w;
            acc += wf(b2 + 0) * r.x + wf(b2 + 1) * r.y + wf(b2 + 2) * r.z;
        }
    }

    fragColor = vec4(1.0 / (1.0 + exp(-acc)), 0.0, 0.0, 0.0);
}
\`;var dt=class extends h{constructor(r,e,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",ho);let s=this.makeTexture(m(n.weights),27,1),p=this.makeTexture(y(n.bias),1,1),l=e.w,c=this.makeTexture(null,l,e.h);this.output={h:e.h,w:e.w,c:4,texture:c,texW:l,texH:e.h},this.inputs=[e,i,o],this.weights=[],this.samplers=[{name:"u_u_gru",texture:e.texture},{name:"u_d_full",texture:i.texture},{name:"u_rgb",texture:o.texture},{name:"u_weights",texture:s},{name:"u_bias",texture:p}],this.uniformInts={u_w:e.w,u_h:e.h},this.defaultSetup(),this.dispatch=[l,e.h]}};var _o=\`#version 300 es
// Composite an RGBA image over a solid background color, gated by a
// 1-channel alpha mask. Output: premultiplied RGBA.
//
// Assumes image and alpha textures are the same h\\xD7w and that the canvas
// (viewport) matches that resolution \\u2014 no resampling here. The upscaler op
// (separate) handles aligning alpha to the image resolution upstream.

precision highp float;

uniform sampler2D u_image;   // image as NHWC vec4 (RGBA in vec4)
uniform sampler2D u_alpha;   // alpha as NHWC vec4 (value in .r)
uniform vec3      u_bgColor; // straight-alpha background color, [0,1]

out vec4 fragColor;

void main() {
    // WebGL gl_FragCoord origin is bottom-left, but tensor textures are
    // stored top-down (matches NHWC + getImageData). Flip y when sampling so
    // the displayed image is upright. (WebGPU's @builtin(position) is already
    // top-down, so its compositor doesn't need this.)
    int H = textureSize(u_image, 0).y;
    ivec2 px = ivec2(int(gl_FragCoord.x), H - 1 - int(gl_FragCoord.y));
    vec3  fg = texelFetch(u_image, px, 0).rgb;
    float a  = texelFetch(u_alpha, px, 0).r;

    // Straight-alpha composite, then premultiply for the canvas's
    // premultiplied surface format.
    vec3 rgb = fg * a + u_bgColor * (1.0 - a);
    fragColor = vec4(rgb, 1.0);
}
\`;var Da=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,mt=class{constructor(t,r,e,i){a(this,"backend",t);a(this,"program");a(this,"imageTex");a(this,"alphaTex");a(this,"bgColor");if(r.h!==e.h||r.w!==e.w)throw new Error(\`CompositeSolid: image (\${r.h}\\xD7\${r.w}) and alpha (\${e.h}\\xD7\${e.w}) must match. Run the upscaler first.\`);let o=r,n=e;this.imageTex=o.texture,this.alphaTex=n.texture,this.bgColor=i;let s=t.gl,p=s.createShader(s.VERTEX_SHADER);s.shaderSource(p,Da),s.compileShader(p);let l=s.createShader(s.FRAGMENT_SHADER);if(s.shaderSource(l,_o),s.compileShader(l),!s.getShaderParameter(l,s.COMPILE_STATUS))throw new Error(\`composite_solid GLSL compile error: \${s.getShaderInfoLog(l)}\`);if(this.program=s.createProgram(),s.attachShader(this.program,p),s.attachShader(this.program,l),s.linkProgram(this.program),!s.getProgramParameter(this.program,s.LINK_STATUS))throw new Error(\`composite_solid GLSL link error: \${s.getProgramInfoLog(this.program)}\`)}run(){let t=this.backend.gl;t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.imageTex),t.uniform1i(t.getUniformLocation(this.program,"u_image"),0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.alphaTex),t.uniform1i(t.getUniformLocation(this.program,"u_alpha"),1),t.uniform3f(t.getUniformLocation(this.program,"u_bgColor"),this.bgColor[0],this.bgColor[1],this.bgColor[2]),this.backend.bindDisplayFramebuffer(),t.bindVertexArray(null),t.drawArrays(t.TRIANGLES,0,6)}};var go=\`#version 300 es
// Same as composite_solid but bg is a texture (NHWC vec4 tensor) instead of
// a uniform color. Caller invariants: image, alpha, bg all share h \\xD7 w, and
// canvas dimensions match.

precision highp float;
precision highp int;

uniform sampler2D u_image;
uniform sampler2D u_alpha;
uniform sampler2D u_bg;

out vec4 fragColor;

void main() {
    // WebGL gl_FragCoord origin is bottom-left; tensor textures are top-down.
    int H = textureSize(u_image, 0).y;
    ivec2 px = ivec2(int(gl_FragCoord.x), H - 1 - int(gl_FragCoord.y));

    vec3  fg = texelFetch(u_image, px, 0).rgb;
    float a  = texelFetch(u_alpha, px, 0).r;
    vec3  bg = texelFetch(u_bg,    px, 0).rgb;

    vec3 rgb = fg * a + bg * (1.0 - a);
    fragColor = vec4(rgb, 1.0);
}
\`;var Ia=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,ft=class{constructor(t,r,e,i){a(this,"backend",t);a(this,"program");a(this,"imageTex");a(this,"alphaTex");a(this,"bgTex");if(r.h!==e.h||r.w!==e.w||r.h!==i.h||r.w!==i.w)throw new Error(\`CompositeImage: image (\${r.h}\\xD7\${r.w}), alpha (\${e.h}\\xD7\${e.w}), and bg (\${i.h}\\xD7\${i.w}) must all match. Run upscaler / resizer first.\`);this.imageTex=r.texture,this.alphaTex=e.texture,this.bgTex=i.texture;let o=t.gl,n=o.createShader(o.VERTEX_SHADER);o.shaderSource(n,Ia),o.compileShader(n);let s=o.createShader(o.FRAGMENT_SHADER);if(o.shaderSource(s,go),o.compileShader(s),!o.getShaderParameter(s,o.COMPILE_STATUS))throw new Error(\`composite_image GLSL compile error: \${o.getShaderInfoLog(s)}\`);if(this.program=o.createProgram(),o.attachShader(this.program,n),o.attachShader(this.program,s),o.linkProgram(this.program),!o.getProgramParameter(this.program,o.LINK_STATUS))throw new Error(\`composite_image GLSL link error: \${o.getProgramInfoLog(this.program)}\`)}run(){let t=this.backend.gl;t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.imageTex),t.uniform1i(t.getUniformLocation(this.program,"u_image"),0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.alphaTex),t.uniform1i(t.getUniformLocation(this.program,"u_alpha"),1),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.bgTex),t.uniform1i(t.getUniformLocation(this.program,"u_bg"),2),this.backend.bindDisplayFramebuffer(),t.bindVertexArray(null),t.drawArrays(t.TRIANGLES,0,6)}};var bo=\`#version 300 es
// Like composite_image but bg is bilinearly sampled \\u2014 bg is at a smaller
// resolution than (image, alpha) at canvas h \\xD7 w. Used by CompositorBlur to
// skip the final full-res upsample in the blur pyramid.
//
// Tensor textures are top-down (origin at top-left of the source image),
// while gl_FragCoord origin is bottom-left \\u2014 flip y when computing px.

precision highp float;
precision highp int;

uniform sampler2D u_image;
uniform sampler2D u_alpha;
uniform sampler2D u_bg;

uniform int u_out_w;
uniform int u_out_h;
uniform int u_bg_w;
uniform int u_bg_h;

out vec4 fragColor;

void main() {
    int x = int(gl_FragCoord.x);
    int y = u_out_h - 1 - int(gl_FragCoord.y);

    vec3  fg = texelFetch(u_image, ivec2(x, y), 0).rgb;
    float a  = texelFetch(u_alpha, ivec2(x, y), 0).r;

    // Bilinear sample bg at the corresponding location. align_corners=False.
    float src_x = (float(x) + 0.5) * (float(u_bg_w) / float(u_out_w)) - 0.5;
    float src_y = (float(y) + 0.5) * (float(u_bg_h) / float(u_out_h)) - 0.5;
    int x0 = clamp(int(floor(src_x)),     0, u_bg_w - 1);
    int x1 = clamp(int(floor(src_x)) + 1, 0, u_bg_w - 1);
    int y0 = clamp(int(floor(src_y)),     0, u_bg_h - 1);
    int y1 = clamp(int(floor(src_y)) + 1, 0, u_bg_h - 1);
    float wx = src_x - floor(src_x);
    float wy = src_y - floor(src_y);

    vec3 tl = texelFetch(u_bg, ivec2(x0, y0), 0).rgb;
    vec3 tr = texelFetch(u_bg, ivec2(x1, y0), 0).rgb;
    vec3 bl = texelFetch(u_bg, ivec2(x0, y1), 0).rgb;
    vec3 br = texelFetch(u_bg, ivec2(x1, y1), 0).rgb;
    vec3 bg = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
            +        wy  * ((1.0 - wx) * bl + wx * br);

    vec3 rgb = fg * a + bg * (1.0 - a);
    fragColor = vec4(rgb, 1.0);
}
\`;var Ma=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,ht=class{constructor(t,r,e,i){a(this,"backend",t);a(this,"program");a(this,"imageTex");a(this,"alphaTex");a(this,"bgTex");a(this,"outW");a(this,"outH");a(this,"bgW");a(this,"bgH");if(r.h!==e.h||r.w!==e.w)throw new Error(\`CompositeImageBilinear: image (\${r.h}\\xD7\${r.w}) and alpha (\${e.h}\\xD7\${e.w}) must match.\`);this.imageTex=r.texture,this.alphaTex=e.texture,this.bgTex=i.texture,this.outW=r.w,this.outH=r.h,this.bgW=i.w,this.bgH=i.h;let o=t.gl,n=o.createShader(o.VERTEX_SHADER);o.shaderSource(n,Ma),o.compileShader(n);let s=o.createShader(o.FRAGMENT_SHADER);if(o.shaderSource(s,bo),o.compileShader(s),!o.getShaderParameter(s,o.COMPILE_STATUS))throw new Error(\`composite_image_bilinear GLSL compile error: \${o.getShaderInfoLog(s)}\`);if(this.program=o.createProgram(),o.attachShader(this.program,n),o.attachShader(this.program,s),o.linkProgram(this.program),!o.getProgramParameter(this.program,o.LINK_STATUS))throw new Error(\`composite_image_bilinear GLSL link error: \${o.getProgramInfoLog(this.program)}\`)}run(){let t=this.backend.gl;t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.imageTex),t.uniform1i(t.getUniformLocation(this.program,"u_image"),0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.alphaTex),t.uniform1i(t.getUniformLocation(this.program,"u_alpha"),1),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.bgTex),t.uniform1i(t.getUniformLocation(this.program,"u_bg"),2),t.uniform1i(t.getUniformLocation(this.program,"u_out_w"),this.outW),t.uniform1i(t.getUniformLocation(this.program,"u_out_h"),this.outH),t.uniform1i(t.getUniformLocation(this.program,"u_bg_w"),this.bgW),t.uniform1i(t.getUniformLocation(this.program,"u_bg_h"),this.bgH),this.backend.bindDisplayFramebuffer(),t.bindVertexArray(null),t.drawArrays(t.TRIANGLES,0,6)}};var vo=\`#version 300 es
// Passthrough "compositor": writes the image directly to the canvas
// (default framebuffer). No alpha math, no background. Used by RenderOp
// when the renderer is in disabled state.
//
// Caller invariants:
//   - canvas (viewport) === image h \\xD7 w (no resampling here)

precision highp float;

uniform sampler2D u_image;   // image as NHWC vec4 (RGBA)

out vec4 fragColor;

void main() {
    // WebGL gl_FragCoord origin is bottom-left; tensor textures are stored
    // top-down. Flip y so the displayed image is upright. (Matches what the
    // existing composite_solid.glsl does.)
    int H = textureSize(u_image, 0).y;
    ivec2 px = ivec2(int(gl_FragCoord.x), H - 1 - int(gl_FragCoord.y));
    vec3  rgb = texelFetch(u_image, px, 0).rgb;
    fragColor = vec4(rgb, 1.0);
}
\`;var Ha=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,_t=class{constructor(t,r){a(this,"backend",t);a(this,"program");a(this,"imageTex");this.imageTex=r.texture;let e=t.gl,i=e.createShader(e.VERTEX_SHADER);e.shaderSource(i,Ha),e.compileShader(i);let o=e.createShader(e.FRAGMENT_SHADER);if(e.shaderSource(o,vo),e.compileShader(o),!e.getShaderParameter(o,e.COMPILE_STATUS))throw new Error(\`composite_passthrough GLSL compile error: \${e.getShaderInfoLog(o)}\`);if(this.program=e.createProgram(),e.attachShader(this.program,i),e.attachShader(this.program,o),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw new Error(\`composite_passthrough GLSL link error: \${e.getProgramInfoLog(this.program)}\`)}run(){let t=this.backend.gl;t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.imageTex),t.uniform1i(t.getUniformLocation(this.program,"u_image"),0),this.backend.bindDisplayFramebuffer(),t.bindVertexArray(null),t.drawArrays(t.TRIANGLES,0,6)}};var xo=\`#version 300 es
precision highp float;

// Input op \\u2014 bilinear-sample a source texture (RGBA8 unorm uploaded from an
// ImageBitmap or VideoFrame) at the target resolution. Output texture format
// is RGBA32F or RGBA16F depending on backend.dtype; the framebuffer write
// stores fragColor into whatever format is bound.

uniform sampler2D u_src;
uniform int       u_out_w;
uniform int       u_out_h;

out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy + vec2(0.5)) / vec2(float(u_out_w), float(u_out_h));
    fragColor = texture(u_src, uv);
}
\`;var Va=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,gt=class{constructor(t,r,e){a(this,"backend",t);a(this,"output");a(this,"gl");a(this,"program");a(this,"srcTex");a(this,"uOutW");a(this,"uOutH");a(this,"uSrc");a(this,"source",null);let i=t.gl;this.gl=i,this.output=t.tensor(r,e,4),this.srcTex=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.srcTex),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);let o=i.createShader(i.VERTEX_SHADER);i.shaderSource(o,Va),i.compileShader(o);let n=i.createShader(i.FRAGMENT_SHADER);if(i.shaderSource(n,xo),i.compileShader(n),!i.getShaderParameter(n,i.COMPILE_STATUS))throw new Error(\`Input GLSL compile error: \${i.getShaderInfoLog(n)}\`);if(this.program=i.createProgram(),i.attachShader(this.program,o),i.attachShader(this.program,n),i.linkProgram(this.program),!i.getProgramParameter(this.program,i.LINK_STATUS))throw new Error(\`Input GLSL link error: \${i.getProgramInfoLog(this.program)}\`);this.uSrc=i.getUniformLocation(this.program,"u_src"),this.uOutW=i.getUniformLocation(this.program,"u_out_w"),this.uOutH=i.getUniformLocation(this.program,"u_out_h")}setSource(t){this.source=t}run(){if(!this.source)throw new Error("InputWebGL.run() called before setSource()");let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.srcTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,this.source),t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.srcTex),t.uniform1i(this.uSrc,0),t.uniform1i(this.uOutW,this.output.w),t.uniform1i(this.uOutH,this.output.h),t.bindFramebuffer(t.FRAMEBUFFER,this.backend.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.output.texture,0),t.viewport(0,0,this.output.texW,this.output.texH),t.bindVertexArray(null),t.drawArrays(t.TRIANGLES,0,6)}};var F=class u{constructor(t,r,e){a(this,"gl",t);a(this,"canvas",r);a(this,"dtype",e);a(this,"ops");a(this,"presenters");a(this,"fbo");a(this,"textureFormat");this.fbo=t.createFramebuffer(),this.textureFormat=e==="f16"?{internalFormat:t.RGBA16F,format:t.RGBA,type:t.HALF_FLOAT,bytesPerElement:2}:{internalFormat:t.RGBA32F,format:t.RGBA,type:t.FLOAT,bytesPerElement:4},this.ops={Conv2d:(i,o,n)=>new He(this,i,o,n),ConvTranspose2d:(i,o,n)=>new ze(this,i,o,n),DepthwiseConv2d:(i,o,n)=>new Ve(this,i,o,n),Add:(i,o)=>new Ne(this,i,o),Sigmoid:i=>new $e(this,i),Tanh:i=>new Xe(this,i),ElementwiseMul:(i,o)=>new je(this,i,o),Warp:(i,o,n)=>new qe(this,i,o,n),Stabilize:(i,o,n,s,p)=>new Ke(this,i,o,n,s,p),BilinearUpsample:(i,o)=>new Ye(this,i,o),Crop:(i,o)=>new Qe(this,i,o),BicubicUpsample:(i,o)=>new Je(this,i,o),ChannelConcat:(i,o)=>new Ze(this,i,o),Conv2dAdd:(i,o,n,s)=>new ot(this,i,o,n,s),ProjResidual:(i,o,n,s)=>new it(this,i,o,n,s),ConcatConv2d:(i,o,n,s)=>new at(this,i,o,n,s),GatesFused:(i,o,n)=>new nt(this,i,o,n),CandUpdateFused:(i,o,n,s,p)=>new st(this,i,o,n,s,p),ConvExpand:(i,o)=>new ut(this,i,o),CatConv6to2:(i,o,n)=>new pt(this,i,o,n),DownAdapter:(i,o,n,s)=>new lt(this,i,o,n,s),UpFinal:(i,o,n)=>new ct(this,i,o,n),UpFinalSkip:(i,o,n,s)=>new dt(this,i,o,n,s),UpsampleConcat:(i,o,n)=>new tt(this,i,o,n),UpsampleConv1x1:(i,o,n)=>new rt(this,i,o,n),UpsampleSigmoid:(i,o)=>new et(this,i,o),Input:(i,o)=>new gt(this,i,o)},this.presenters={CompositeSolid:(i,o,n)=>new mt(this,i,o,n),CompositeImage:(i,o,n)=>new ft(this,i,o,n),CompositeImageBilinear:(i,o,n)=>new ht(this,i,o,n),CompositePassthrough:i=>new _t(this,i)}}static isAvailable(){let t=null;try{return t=new OffscreenCanvas(1,1).getContext("webgl2"),!(!t||!t.getExtension("EXT_color_buffer_float"))}catch{return!1}finally{t?.getExtension("WEBGL_lose_context")?.loseContext()}}static create(t){let r=t.canvas.getContext("webgl2");if(!r)throw new Error("WebGL2 not available");if(!r.getExtension("EXT_color_buffer_float"))throw new Error("EXT_color_buffer_float not available");return new u(r,t.canvas,t.dtype??"f32")}attachCanvas(t){throw new Error(\`WebGLBackend.attachCanvas('\${t}'): WebGL cannot render to a second canvas; use the renderer's snapshot-and-present path for preview output\`)}bindDisplayFramebuffer(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}toTextureView(t){if(t===null)return null;let r=this.dtype==="f16",e=t instanceof Uint16Array;return r===e?t:r?pe(t):A(t)}tensor(t,r,e,i){let o=r*(e/4),n=t,s=this.gl,p=s.createTexture(),l=this.textureFormat,c=this.toTextureView(i??null);return s.bindTexture(s.TEXTURE_2D,p),s.texImage2D(s.TEXTURE_2D,0,l.internalFormat,o,n,0,l.format,l.type,c),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),{h:t,w:r,c:e,texture:p,texW:o,texH:n}}upload(t){return{data:t}}async readback(t){let r=this.gl,e=this.textureFormat;if(r.bindFramebuffer(r.FRAMEBUFFER,this.fbo),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,t.texture,0),this.dtype==="f16"){let o=new Uint16Array(t.texW*t.texH*4);return r.readPixels(0,0,t.texW,t.texH,e.format,r.HALF_FLOAT,o),r.bindFramebuffer(r.FRAMEBUFFER,null),A(o)}let i=new Float32Array(t.texW*t.texH*4);return r.readPixels(0,0,t.texW,t.texH,e.format,r.FLOAT,i),r.bindFramebuffer(r.FRAMEBUFFER,null),i}copyTensor(t,r){if(t.texW!==r.texW||t.texH!==r.texH)throw new Error(\`copyTensor: size mismatch (src \${t.texW}\\xD7\${t.texH} vs dst \${r.texW}\\xD7\${r.texH})\`);let e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,this.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t.texture,0),e.bindTexture(e.TEXTURE_2D,r.texture),e.copyTexSubImage2D(e.TEXTURE_2D,0,0,0,0,0,t.texW,t.texH),e.bindFramebuffer(e.FRAMEBUFFER,null)}async sync(){let t=this.gl,r=t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE,0);if(!r){t.finish();return}for(t.flush();;){let e=t.clientWaitSync(r,0,0);if(e===t.ALREADY_SIGNALED||e===t.CONDITION_SATISFIED){t.deleteSync(r);return}if(e===t.WAIT_FAILED)throw t.deleteSync(r),new Error("WebGLBackend.sync: clientWaitSync returned WAIT_FAILED");await new Promise(i=>setTimeout(i,1))}}destroy(){this.gl.deleteFramebuffer(this.fbo),this.gl.getExtension("WEBGL_lose_context")?.loseContext()}};var Tt=S("setup_backend");async function yo(u,t,r={}){let e=u.backend==="webgpu"||u.backend==="auto",i=!!u.outputCanvas,o=()=>u.outputCanvas??new OffscreenCanvas(t.w,t.h),n=null;if(e&&await R.isAvailable()){let p=u.dtype==="f16"&&!await R.hasF16Support()?"f32":u.dtype,l=o();try{let c=await R.create({canvas:l,dtype:p});return c.device.lost.then(d=>{d.reason!=="destroyed"&&r.onContextLost?.({message:\`WebGPU device lost: \${d.reason}\${d.message?" \\u2014 "+d.message:""}\`,source:"backend-lost",recoverable:!1,cause:d})}).catch(()=>{}),{backend:c,resolvedBackend:"webgpu",resolvedDtype:p,canvas:l}}catch(c){Tt.warn("WebGPU isAvailable but create() threw; trying WebGL fallback:",c),n=c,i&&Tt.warn("transfer-capture topology: WebGL fallback may also fail on the same canvas")}}if(F.isAvailable()){let p=o();try{let l=F.create({canvas:p,dtype:u.dtype});return p.addEventListener("webglcontextlost",c=>{r.onContextLost?.({message:"WebGL context lost",source:"backend-lost",recoverable:!1,cause:c})}),{backend:l,resolvedBackend:"webgl",resolvedDtype:u.dtype,canvas:p}}catch(l){Tt.warn("WebGL create() threw:",l),n=l}}let s=n?\` (last error: \${n.message??n})\`:"";throw new Error(\`setup_backend: no usable GPU backend\${s}\`)}var wo=.5,Na=3,ko=10,$a=30,E=S("autotune");async function To(u,t=$a){let r=u instanceof F?wo*.5:wo,e=1e3/t*r;E(\`start; budget per source frame: \${e.toFixed(1)}ms (source \${t}fps \\xD7 \${r} safety)\`),E("backend dtype:",u.dtype);let i=null;for(let o of yt){if(!O[o.model]){E("skip",o.model,"(no TIER_CONFIG entry)");continue}try{let n=O[o.model].baseRes;E(\`bench \${o.model} base @ \${n.w}\\xD7\${n.h} skipFrames=\${o.skipFrames} \\u2026\`);let s=await qa(u,o),p=s<=e;if(E(\`  \${o.model}: \${s.toFixed(1)}ms / source frame \${p?"\\u2713 within budget":"\\u2717 over budget"}\`),(p||i===null)&&(i=o),!p)break}catch(n){E("  bench failed for",o.model,":",n);break}}if(!i)throw new Error("autotune: no implementable preset available");return E("picked",i.model),i}function Xa(u){let t=Object.create(u);return t.ops={...u.ops,Conv2d:(r,e,i)=>{let o={weights:new Float32Array(i.kernel*i.kernel*r.c*i.outChannels),bias:new Float32Array(i.outChannels)};return u.ops.Conv2d(r,o,i)},DepthwiseConv2d:(r,e,i)=>{let o={weights:new Float32Array(i.kernel*i.kernel*r.c),bias:new Float32Array(r.c)};return u.ops.DepthwiseConv2d(r,o,i)},Conv2dAdd:(r,e,i,o)=>{let n={weights:new Float32Array(o.kernel*o.kernel*r.c*o.outChannels),bias:new Float32Array(o.outChannels)};return u.ops.Conv2dAdd(r,e,n,o)},UpsampleConv1x1:(r,e,i)=>{let o={weights:new Float32Array(r.c*i.outChannels),bias:new Float32Array(i.outChannels)};return u.ops.UpsampleConv1x1(r,o,i)},ProjResidual:(r,e,i,o)=>{let n={weights:new Float32Array(r.c*o.outChannels),bias:new Float32Array(o.outChannels)};return u.ops.ProjResidual(r,e,n,o)},ConcatConv2d:(r,e,i,o)=>{let n={weights:new Float32Array(9*(r.c+e.c)*o.outChannels),bias:new Float32Array(o.outChannels)};return u.ops.ConcatConv2d(r,e,n,o)}},t}function ja(){let u=new Proxy({},{get:()=>u});return u}async function qa(u,t){let r=O[t.model];if(!r)throw new Error(\`microbench: no TIER_CONFIG entry for '\${t.model}'\`);let e=r.base,i=Xa(u),o=i.tensor(r.baseRes.h,r.baseRes.w,4),n=new e(i,o,ja());for(let c=0;c<Na;c++)n.run(),await u.sync();let s=t.skipFrames+1,p=performance.now();for(let c=0;c<ko;c++)c%s===0&&n.run();return await u.sync(),(performance.now()-p)/ko}async function Co(u,t,r){let e;if(u==="auto")e=await To(r);else if(typeof u=="string"){let i=q(u);if(!i)throw new Error(\`resolve_preset: unknown preset name '\${u}'\`);e=i}else e=u;return e.dtype!==t?{...e,dtype:t}:e}function Wo(u){let t=null,r=null;return u.onmessage=e=>{let{frame:i}=e.data;if(r){let o=r;r=null,o(i)}else t&&t.close(),t=i},u.start?.(),new ReadableStream({pull(e){if(t){e.enqueue(t),t=null;return}return new Promise(i=>{r=o=>{e.enqueue(o),i()}})},cancel(){t&&(t.close(),t=null),u.close()}},{highWaterMark:0})}function Po(u){switch(u.topology.input){case"mstp":if(!u.inputReadable)throw new Error("create_input: topology.input='mstp' but InitData.inputReadable missing");return u.inputReadable;case"rvfc-postmessage":if(!u.inputPort)throw new Error("create_input: topology.input='rvfc-postmessage' but InitData.inputPort missing");return Wo(u.inputPort)}}function Go(u){return new TransformStream({transform(t,r){u.process(t);let e=new VideoFrame(u.canvas,{timestamp:t.timestamp});t.close(),r.enqueue(e)}})}function Bo(u){return new WritableStream({write(t){u.process(t),t.close()}})}function Uo(u,t){return new WritableStream({write(r){u.process(r),r.close();let e=u.canvas.transferToImageBitmap();t.postMessage({bmp:e},[e])},close(){t.close()}})}var Ka=S("create_output");function So(u,t,r){switch(u.topology.output){case"mstg":{if(!u.outputWritable)throw new Error("create_output: topology.output='mstg' but InitData.outputWritable missing");let e=Go(t);return e.readable.pipeTo(u.outputWritable,{signal:r}).catch(i=>{r.aborted||Ka.warn("mstg downstream pipe failed:",i)}),e.writable}case"transfer-capture":return Bo(t);case"bitmap-shuttle":{if(!u.outputPort)throw new Error("create_output: topology.output='bitmap-shuttle' but InitData.outputPort missing");return Uo(t,u.outputPort)}}}function Lo(u){if(!u.onFirstFrame)return u.input.pipeTo(u.output,{signal:u.signal});let t=!1,r=u.onFirstFrame,e=new TransformStream({transform(i,o){o.enqueue(i),t||(t=!0,queueMicrotask(r))}});return u.input.pipeThrough(e,{signal:u.signal}).pipeTo(u.output,{signal:u.signal})}var W=S("worker");W("script loaded");var P=null,H=null,bt=null;self.onmessage=async function(u){let{cmd:t,data:r,request_id:e}=u.data;W("cmd received:",t,"request_id:",e);try{let i=await Ya(t,r);W("cmd ok:",t),un(e,i)}catch(i){W("cmd FAILED:",t,i),$("error",{message:\`\${t} failed: \${i.message??String(i)}\`,source:"worker",recoverable:!1,cause:i})}};async function Ya(u,t){switch(u){case"init":return Qa(t);case"startRender":return Ja(t.weights);case"setBackground":return Za(t);case"setEnabled":return en(t.enabled);case"setPreset":return an(t);case"getStats":return P?.getStats()??null;case"destroy":return nn();case"attachPreview":return tn(t);case"setPreview":return rn(t);case"clearPreview":return on();default:throw new Error(\`unknown cmd: \${u}\`)}}async function Qa(u){if(Ct(!!u.debug),W("handleInit: start; topology=",u.topology,"preset=",u.preset,"backend=",u.backend,"dtype=",u.dtype),P)throw new Error("handleInit: already initialized");W("handleInit: setupBackend\\u2026");let t=await yo(u,u.canvasSize,{onContextLost:o=>{W("GPU context lost:",o.message),$("error",o)}});W("handleInit: backend ready:",t.resolvedBackend,t.resolvedDtype,"canvas:",t.canvas.width,"x",t.canvas.height),W("handleInit: constructing Renderer (boot mode)\\u2026"),P=new ue({backend:t.backend,backendKind:t.resolvedBackend,canvas:t.canvas,background:u.background,enabled:u.enabled,topology:u.topology}),H=new AbortController,W("handleInit: createInputStream\\u2026");let r=Po(u);W("handleInit: createOutputSink\\u2026");let e=So(u,P,H.signal);W("handleInit: starting pipe (passthrough)\\u2026"),Lo({input:r,output:e,signal:H.signal}).then(()=>{W("pipe completed (input ended)")}).catch(o=>{if(H?.signal.aborted){W("pipe aborted (expected on destroy)");return}W("pipe FAILED:",o),$("error",{message:\`pipe failed: \${o.message}\`,source:"worker",recoverable:!1,cause:o})}),W("handleInit: resolvePreset\\u2026");let i=await Co(u.preset,t.resolvedDtype,t.backend);return W("handleInit: preset resolved:",i),bt=i,W("handleInit: done; returning InitResponse, awaiting startRender"),{resolvedPreset:i,resolvedBackend:t.resolvedBackend,resolvedDtype:t.resolvedDtype}}async function Ja(u){if(W("handleStartRender: start; weights bytes:",u.byteLength),!P||!bt)throw new Error("handleStartRender: handleInit not completed");W("handleStartRender: attaching network via setPreset\\u2026"),P.setPreset(bt,u),W("handleStartRender: ready (effect mode active)"),$("ready",void 0)}async function Za(u){P?.setBackground(u)}async function en(u){P?.setEnabled(u)}async function tn(u){if(!P)throw new Error("handleAttachPreview: not initialized");P.attachPreview(u.canvas)}async function rn(u){if(!P)throw new Error("handleSetPreview: not initialized");P.setPreview(u.background,u.fps!==void 0?{fps:u.fps}:void 0)}async function on(){P?.clearPreview()}async function an(u){if(!P)throw new Error("handleSetPreset: not initialized");if(!u.weights)throw new Error("handleSetPreset: weights required for runtime preset swap");if(u.preset==="auto")throw new Error("handleSetPreset: 'auto' not supported on runtime swap (use at init for autotune)");let t=typeof u.preset=="string"?q(u.preset)??sn(u.preset):u.preset;return P.setPreset(t,u.weights),{resolvedPreset:t}}async function nn(){H?.abort(),H=null,P?.destroy(),P=null,bt=null}function sn(u){throw new Error(\`handleSetPreset: unknown preset '\${u}'\`)}function un(u,t){let r={request_id:u,res:t};self.postMessage(r)}function $(u,t){let r={request_id:u,res:t};self.postMessage(r)}function Vg(u){$("stats",u)}export{Vg as emitStats};
`;var k=x("pipeline");function Er(){{let a=new Blob([xe],{type:"application/javascript"}),t=URL.createObjectURL(a),e=new Worker(t,{type:"module"});return URL.revokeObjectURL(t),e}}var Gr="./thirdparty/longpipe/models/v/0.0.4/",Fr={background:"blur",preset:"auto",weightsBaseUrl:Gr,audio:"passthrough",enabled:true,adaptive:true,debug:false},qe={w:1280,h:720};function Ar(a,t){if(t)return t;let r=a.getVideoTracks()[0]?.getSettings()??{};return {w:r.width||qe.w,h:r.height||qe.h}}function Xe(a,t,e){let r=e==="f16"?".f16.bin":".bin";return `${a.replace(/\/$/,"")}/model_${t}${r}`}async function Ke(a,t,e){if(e==="f16"){let i=await fetch(Xe(a,t,"f16"));if(i.ok)return i.arrayBuffer()}let r=Xe(a,t,"f32"),n=await fetch(r);if(!n.ok)throw new Error(`weights fetch failed: ${n.status} ${r}`);return n.arrayBuffer()}var we=class{stream;ready;controller;worker;inputCleanup;outputCleanup;adaptive=null;denoiser=null;bgCleanup=null;previewBgCleanup=null;constructor(t,e){let r={...Fr,...e};Te(r.debug);let n=Se(),i=Le(n.input,t),o=Ar(t,r.outputResolution),s=je(n.output,o);this.inputCleanup=i.cleanup,this.outputCleanup=s.cleanup;let u=Ee(r.audio),l;if(u.mode==="denoise"){let h=t.getAudioTracks()[0];h?(this.denoiser=new O(h,{model:u.denoise?.model??"auto",weightsBaseUrl:r.weightsBaseUrl,postFilterBeta:u.denoise?.postFilterBeta,gruLeak:u.denoise?.gruLeak,enabled:u.denoise?.enabled,onError:m=>r.onError?.({message:m,source:"audio",recoverable:true})}),l=this.denoiser.outputTrack):r.onError?.({message:'audio: "denoise" requested but the input stream has no audio track',source:"audio",recoverable:true});}this.stream=Ge(s.videoTrack,t,u,l),s.startPassthrough?.(t),this.worker=Er(),this.controller=new z(this.worker),this.ready=new Promise((h,m)=>{this.controller.addPersistentListener("ready",()=>{k("ready handler invoked; resolving .ready"),r.onReady?.(),h();}),this.controller.addPersistentListener("error",w=>{console.error(`[longpipe/pipeline] error (${w.source}):`,w.message),w.recoverable||m(new Error(w.message)),r.onError?.(w);});});let c={topology:n,preset:r.preset,enabled:r.enabled,backend:"auto",dtype:"f16",canvasSize:o,debug:r.debug,...i.initFields,...s.initFields},f=[...i.transferList,...s.transferList];this.bootstrap(c,r.background,f,r.weightsBaseUrl,r.adaptive,r.onError);}async bootstrap(t,e,r,n,i,o){try{k("normalizing background\u2026");let s=await F(e);this.bgCleanup=s.cleanup??null;let u={...t,background:s.background},l=[...r,...s.transferList??[]];k("sending init\u2026");let c=await this.controller.sendMessage("init",u,l);k("init resolved:",c),k("fetching weights:",c.resolvedPreset.model,c.resolvedDtype);let f=await Ke(n,c.resolvedPreset.model,c.resolvedDtype);k("weights bytes:",f.byteLength),k("sending startRender\u2026"),await this.controller.sendMessage("startRender",{weights:f},[f]),k("startRender resolved; awaiting first frame"),u.preset==="auto"&&i&&(this.adaptive=new G({backendKind:c.resolvedBackend,initialModel:c.resolvedPreset.model,fetchWeights:h=>Ke(n,h,c.resolvedDtype),getStats:()=>this.getStats(),swapPreset:async(h,m)=>{await this.controller.sendMessage("setPreset",{preset:h,weights:m},[m]);},onError:o}),this.adaptive.start());}catch(s){console.error("[longpipe/pipeline] bootstrap failed:",s),this.controller.handleMessage.call(this.controller,{data:{request_id:"error",res:{message:s.message??String(s),source:"worker",recoverable:false,cause:s}}});}}then(t,e){return this.ready.then(()=>t?t(this):this,e)}async setBackground(t){let e=await F(t),r=this.bgCleanup;this.bgCleanup=e.cleanup??null,await this.controller.sendMessage("setBackground",e.background,e.transferList),r?.();}setPreset(t,e){this.controller.sendMessage("setPreset",{preset:t,weights:e});}attachPreview(t){let e=t.transferControlToOffscreen();this.controller.sendMessage("attachPreview",{canvas:e},[e]);}async setPreview(t){let e=await F(t.background),r=this.previewBgCleanup;this.previewBgCleanup=e.cleanup??null,await this.controller.sendMessage("setPreview",{background:e.background,fps:t.fps},e.transferList),r?.();}clearPreview(){this.controller.sendMessage("clearPreview",{}),this.previewBgCleanup?.(),this.previewBgCleanup=null;}setEnabled(t){this.controller.sendMessage("setEnabled",{enabled:t});}async getStats(){return this.controller.sendMessage("getStats",{})}setDenoise(t){if(this.denoiser){if(typeof t=="boolean"){this.denoiser.setEnabled(t);return}(t.postFilterBeta!=null||t.gruLeak!=null)&&this.denoiser.setConfig({postFilterBeta:t.postFilterBeta,gruLeak:t.gruLeak}),t.enabled!=null&&this.denoiser.setEnabled(t.enabled);}}getAudioStats(){return this.denoiser?.getStats()??null}destroy(){this.adaptive?.stop(),this.adaptive=null,this.denoiser?.destroy(),this.denoiser=null,this.bgCleanup?.(),this.bgCleanup=null,this.previewBgCleanup?.(),this.previewBgCleanup=null,this.controller.sendMessage("destroy",{}),this.controller.terminate(),this.inputCleanup(),this.outputCleanup();}};var W=new Float32Array(1),I=new Uint32Array(W.buffer);function Mr(a){W[0]=a;let t=I[0],e=t>>>16&32768,r=t&2147483647,n=(r>>>23)-127+15;if((t&2139095040)===2139095040)return (t&8388607)!==0?e|32256:e|31744;if(n>=31)return e|31744;if(n<=0){if(n<-10)return e;let l=r&8388607|8388608,c=14-n,f=l>>>c,h=l>>>c-1&1,m=(l&(1<<c-1)-1)!==0?1:0;return h&&(m||f&1)&&(f+=1),e|f}let i=r>>>13&1023,o=r>>>12&1,s=(r&4095)!==0?1:0,u=n<<10|i;return o&&(s||i&1)&&(u+=1,(u>>>10&31)===31)?e|31744:e|u}function ye(a){let t=(a&32768)<<16,e=(a&31744)>>>10,r=a&1023;if(e===0){if(r===0)return I[0]=t,W[0];let n=r,i=1;for(;(n&1024)===0;)n<<=1,i-=1;return n&=1023,I[0]=t|i+127-15<<23|n<<13,W[0]}return e===31?(I[0]=t|2139095040|r<<13,W[0]):(I[0]=t|e+127-15<<23|r<<13,W[0])}function Ye(a){let t=new Uint16Array(a.length);for(let e=0;e<a.length;e++)t[e]=Mr(a[e]);return t}function ke(a){let t=new Float32Array(a.length);for(let e=0;e<a.length;e++)t[e]=ye(a[e]);return t}var p=class{constructor(t){this.backend=t;}backend;shader="";pipeline;bindGroup;uniformDefs=[];uniformBuffers={};createUniform(t,e){this.uniformDefs.push({name:t,type:e});}setUniform(t,e){let r=this.backend.device.createBuffer({size:e.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:true});e instanceof Uint32Array?new Uint32Array(r.getMappedRange()).set(e):new Float32Array(r.getMappedRange()).set(e),r.unmap(),this.uniformBuffers[t]=r;}defaultBindGroup(){let t=[],e=0;for(let r of this.inputs)t.push({binding:e++,resource:{buffer:r.buffer}});for(let r of this.weights)t.push({binding:e++,resource:{buffer:r.buffer}});for(let r of this.uniformDefs)t.push({binding:e++,resource:{buffer:this.uniformBuffers[r.name]}});return t.push({binding:e,resource:{buffer:this.output.buffer}}),this.backend.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:t})}defaultSetup(){let t=this.backend.device.createShaderModule({code:this.shader});this.pipeline=this.backend.device.createComputePipeline({layout:"auto",compute:{module:t,entryPoint:"main"}}),this.bindGroup=this.defaultBindGroup();}run(){let t=this.backend.device.createCommandEncoder(),e=t.beginComputePass();e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.dispatchWorkgroups(...this.dispatch),e.end(),this.backend.device.queue.submit([t.finish()]);}};var Je=`// Conv2d, output-channel-blocked (K=2) \u2014 drop-in replacement for conv2d.wgsl.
//
// Identical math, layout, and output to conv2d.wgsl, but each thread computes 2
// output channel-groups (8 channels) for one pixel, loading each input vec4 ONCE
// and reusing it across both groups' mat4x4 weight blocks in registers. Half the
// register pressure of the K=4 variant (2 accumulators vs 4). Output is bit-
// identical to conv2d.wgsl (\u22641 ULP from FMA contraction). Dispatch
// ceil(out_groups / 2) in z (see conv2d.ts).
//
// Tensor layout: NHWC, channels in vec4 groups (same as conv2d.wgsl).
// Weight layout: [K*K][out_groups][in_groups] array of mat4x4 (same as conv2d.wgsl).

struct Params {
    in_h        : u32,
    in_w        : u32,
    out_h       : u32,
    out_w       : u32,
    in_groups   : u32,   // in_channels / 4
    out_groups  : u32,   // out_channels / 4
    kernel_h    : u32,
    kernel_w    : u32,
    stride      : u32,
    pad_top     : u32,
    pad_left    : u32,
    activation  : u32,   // 0 = none, 1 = relu6, 2 = relu, 3 = leaky
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

const KB = 2u;

fn act(v: vec4<f32>, a: u32) -> vec4<f32> {
    if (a == 1u) { return clamp(v, vec4<f32>(0.0), vec4<f32>(6.0)); }
    if (a == 2u) { return max(v, vec4<f32>(0.0)); }
    if (a == 3u) { return max(v, 0.1 * v); }   // leaky relu (slope 0.1)
    return v;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x  = gid.x;       // output column
    let y  = gid.y;       // output row
    let o0 = gid.z * KB;  // first output channel group

    if (x >= params.out_w || y >= params.out_h || o0 >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    // Tail handling when out_groups is odd: clamp the spare lane to o0 (valid
    // index, no OOB) and just don't write it.
    let has1 = (o0 + 1u) < O;
    let o1 = select(o0, o0 + 1u, has1);

    var acc0 = bias_buf[o0];
    var acc1 = bias_buf[o1];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let z   = ky * params.kernel_w + kx;
            let inB = u32(in_y_s) * params.in_w * I + u32(in_x_s) * I;
            let wb0 = z * O * I + o0 * I;
            let wb1 = z * O * I + o1 * I;
            for (var i = 0u; i < I; i++) {
                let iv = input_buf[inB + i];   // loaded ONCE, reused across 2 groups
                acc0 += weight_buf[wb0 + i] * iv;
                acc1 += weight_buf[wb1 + i] * iv;
            }
        }
    }

    let baseO = y * params.out_w * O + x * O;
    output_buf[baseO + o0] = act(acc0, params.activation);
    if (has1) { output_buf[baseO + o1] = act(acc1, params.activation); }
}
`;var Qe=`enable f16;

// Conv2d, output-channel-blocked (K=2) \u2014 full f16. Drop-in replacement for
// conv2d_f16.wgsl. Each thread computes 2 output channel-groups for one pixel,
// loading each input vec4 ONCE and reusing it across both weight blocks. Half the
// register pressure of the K=4 variant (2 accumulators vs 4). Output is bit-
// identical to conv2d_f16.wgsl. Dispatch ceil(out_groups / 2) in z.

struct Params {
    in_h        : u32,
    in_w        : u32,
    out_h       : u32,
    out_w       : u32,
    in_groups   : u32,
    out_groups  : u32,
    kernel_h    : u32,
    kernel_w    : u32,
    stride      : u32,
    pad_top     : u32,
    pad_left    : u32,
    activation  : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

const KB = 2u;

fn act(v: vec4<f16>, a: u32) -> vec4<f16> {
    if (a == 1u) { return clamp(v, vec4<f16>(0.0h), vec4<f16>(6.0h)); }
    if (a == 2u) { return max(v, vec4<f16>(0.0h)); }
    if (a == 3u) { return max(v, 0.1h * v); }   // leaky relu (slope 0.1)
    return v;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x  = gid.x;
    let y  = gid.y;
    let o0 = gid.z * KB;

    if (x >= params.out_w || y >= params.out_h || o0 >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let has1 = (o0 + 1u) < O;
    let o1 = select(o0, o0 + 1u, has1);

    var acc0 = bias_buf[o0];
    var acc1 = bias_buf[o1];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let z   = ky * params.kernel_w + kx;
            let inB = u32(in_y_s) * params.in_w * I + u32(in_x_s) * I;
            let wb0 = z * O * I + o0 * I;
            let wb1 = z * O * I + o1 * I;
            for (var i = 0u; i < I; i++) {
                let iv = input_buf[inB + i];   // loaded ONCE, reused across 2 groups
                acc0 += weight_buf[wb0 + i] * iv;
                acc1 += weight_buf[wb1 + i] * iv;
            }
        }
    }

    let baseO = y * params.out_w * O + x * O;
    output_buf[baseO + o0] = act(acc0, params.activation);
    if (has1) { output_buf[baseO + o1] = act(acc1, params.activation); }
}
`;function _(a,t,e,r){return typeof r=="number"?Math.floor((a+2*r-t)/e)+1:r==="same"?Math.ceil(a/e):Math.floor((a-t)/e)+1}function Pe(a,t,e,r){return (a-1)*e-2*r+t}function zr(a,t,e,r){return Math.floor(Math.max((t-1)*r+e-a,0)/2)}function b(a,t,e,r,n){return typeof a=="number"?a:a==="same"?zr(t,e,r,n):0}function d(a){return a instanceof Float32Array||a instanceof Uint16Array?a:new Float32Array(a)}function g(a){let t=Math.max(4,Math.ceil(a.length/4)*4),e=new Float32Array(t),r=a instanceof Uint16Array;for(let n=0;n<a.length;n++)e[n]=r?ye(a[n]):a[n];return e}var R=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?Qe:Je;let i=_(e.h,n.kernel,n.stride,n.padding),o=_(e.w,n.kernel,n.stride,n.padding),s=e.c/4,u=n.outChannels/4,l=b(n.padding,e.h,i,n.kernel,n.stride),c=b(n.padding,e.w,o,n.kernel,n.stride);this.output=t.tensor(i,o,n.outChannels),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(d(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,i,o,s,u,n.kernel,n.kernel,n.stride,l,c,n.activation==="relu6"?1:n.activation==="relu"?2:n.activation==="leaky"?3:0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/8),Math.ceil(i/8),Math.ceil(u/2)];}};var Ze=`// ConvTranspose2d \u2014 gather form, f32 variant. See conv_transpose2d_f16.wgsl for
// the math; this is the f32 storage build (mat4x4<f32>).

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    in_groups  : u32,
    out_groups : u32,
    kernel_h   : u32,
    kernel_w   : u32,
    stride     : u32,
    pad_top    : u32,
    pad_left   : u32,
    activation : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

fn act(v: vec4<f32>, a: u32) -> vec4<f32> {
    if (a == 1u) { return clamp(v, vec4<f32>(0.0), vec4<f32>(6.0)); }
    if (a == 2u) { return max(v, vec4<f32>(0.0)); }
    if (a == 3u) { return max(v, 0.1 * v); }
    return v;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let o  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let s = i32(params.stride);

    var result = bias_buf[o];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let iy_num = i32(oy) + i32(params.pad_top)  - i32(ky);
            let ix_num = i32(ox) + i32(params.pad_left) - i32(kx);
            if (iy_num < 0 || ix_num < 0 || (iy_num % s) != 0 || (ix_num % s) != 0) {
                continue;
            }
            let iy = iy_num / s;
            let ix = ix_num / s;
            if (iy >= i32(params.in_h) || ix >= i32(params.in_w)) {
                continue;
            }

            let z = ky * params.kernel_w + kx;
            for (var i = 0u; i < I; i++) {
                let in_idx = u32(iy) * params.in_w * I + u32(ix) * I + i;
                let w_idx  = z * O * I + o * I + i;
                result += weight_buf[w_idx] * input_buf[in_idx];
            }
        }
    }

    output_buf[oy * params.out_w * O + ox * O + o] = act(result, params.activation);
}
`;var et=`enable f16;

// ConvTranspose2d \u2014 gather form, full f16 variant.
// Each output (oy,ox) sums every input pixel + kernel tap that maps onto it:
//   iy = (oy + pad - ky) / stride   (must divide evenly and be in bounds)
// No explicit kernel flip \u2014 the (oy + pad - ky) indexing carries it.
// Weight layout is IDENTICAL to conv2d (mat4x4[z][o][i], M[in_sub][out_sub] =
// W(in, out, ky, kx)), so the op uploads the flat buffer unchanged.

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    in_groups  : u32,
    out_groups : u32,
    kernel_h   : u32,
    kernel_w   : u32,
    stride     : u32,
    pad_top    : u32,
    pad_left   : u32,
    activation : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

fn act(v: vec4<f16>, a: u32) -> vec4<f16> {
    if (a == 1u) { return clamp(v, vec4<f16>(0.0h), vec4<f16>(6.0h)); }
    if (a == 2u) { return max(v, vec4<f16>(0.0h)); }
    if (a == 3u) { return max(v, 0.1h * v); }
    return v;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let o  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let s = i32(params.stride);

    var result = bias_buf[o];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let iy_num = i32(oy) + i32(params.pad_top)  - i32(ky);
            let ix_num = i32(ox) + i32(params.pad_left) - i32(kx);
            if (iy_num < 0 || ix_num < 0 || (iy_num % s) != 0 || (ix_num % s) != 0) {
                continue;
            }
            let iy = iy_num / s;
            let ix = ix_num / s;
            if (iy >= i32(params.in_h) || ix >= i32(params.in_w)) {
                continue;
            }

            let z = ky * params.kernel_w + kx;
            for (var i = 0u; i < I; i++) {
                let in_idx = u32(iy) * params.in_w * I + u32(ix) * I + i;
                let w_idx  = z * O * I + o * I + i;
                result += weight_buf[w_idx] * input_buf[in_idx];
            }
        }
    }

    output_buf[oy * params.out_w * O + ox * O + o] = act(result, params.activation);
}
`;var H=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?et:Ze;let i=Pe(e.h,n.kernel,n.stride,n.padding),o=Pe(e.w,n.kernel,n.stride,n.padding),s=e.c/4,u=n.outChannels/4;this.output=t.tensor(i,o,n.outChannels),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(d(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,i,o,s,u,n.kernel,n.kernel,n.stride,n.padding,n.padding,n.activation==="relu6"?1:n.activation==="relu"?2:n.activation==="leaky"?3:0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/8),Math.ceil(i/8),u];}};var tt=`// Depthwise Conv2d \u2014 groups = in_channels (each channel convolved independently).
//
// Weight layout: [K*K][channel_groups] array of vec4
//   weight index = (ky*kernel_w + kx) * channel_groups + c
//   Each vec4 holds the kernel weight for 4 consecutive channels at one spatial position.
//   Operation: element-wise multiply (each input channel multiplied by its own weight).
//
// Contrast with conv2d.wgsl which uses mat4x4 (dense cross-channel mixing).
// 4\xD7 smaller weight buffer than a diagonal mat4x4 representation (4 floats vs 16 per group).
//
// Padding model: only \`pad_top\` and \`pad_left\` are applied to the input offset.
// Asymmetric SAME padding is handled implicitly via the in_h/in_w bounds check.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,   // channels / 4
    kernel_h       : u32,
    kernel_w       : u32,
    stride         : u32,
    pad_top        : u32,
    pad_left       : u32,
    apply_relu6    : u32,
    _pad0          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;  // output column
    let y = gid.y;  // output row
    let c = gid.z;  // channel group

    if (x >= params.out_w || y >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let C = params.channel_groups;

    var result = bias_buf[c];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let in_y = u32(in_y_s);
            let in_x = u32(in_x_s);
            let z    = ky * params.kernel_w + kx;

            let in_idx = in_y * params.in_w * C + in_x * C + c;
            let w_idx  = z * C + c;
            result += weight_buf[w_idx] * input_buf[in_idx];
        }
    }

    if (params.apply_relu6 == 1u) {
        result = clamp(result, vec4<f32>(0.0), vec4<f32>(6.0));
    }

    let out_idx = y * params.out_w * C + x * C + c;
    output_buf[out_idx] = result;
}
`;var rt=`enable f16;

// Depthwise conv2d \u2014 full f16 variant. All buffers f16.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    kernel_h       : u32,
    kernel_w       : u32,
    stride         : u32,
    pad_top        : u32,
    pad_left       : u32,
    apply_relu6    : u32,
    _pad0          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let c = gid.z;

    if (x >= params.out_w || y >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let C = params.channel_groups;

    var result = bias_buf[c];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let in_y = u32(in_y_s);
            let in_x = u32(in_x_s);
            let z    = ky * params.kernel_w + kx;

            let in_idx = in_y * params.in_w * C + in_x * C + c;
            let w_idx  = z * C + c;
            result += weight_buf[w_idx] * input_buf[in_idx];
        }
    }

    if (params.apply_relu6 == 1u) {
        result = clamp(result, vec4<f16>(0.0h), vec4<f16>(6.0h));
    }

    output_buf[y * params.out_w * C + x * C + c] = result;
}
`;var L=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?rt:tt;let i=_(e.h,n.kernel,n.stride,n.padding),o=_(e.w,n.kernel,n.stride,n.padding),s=e.c/4,u=b(n.padding,e.h,i,n.kernel,n.stride),l=b(n.padding,e.w,o,n.kernel,n.stride);this.output=t.tensor(i,o,e.c),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(d(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,i,o,s,n.kernel,n.kernel,n.stride,u,l,n.activation==="relu6"?1:0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/8),Math.ceil(i/8),s];}};var nt=`// Element-wise add of two tensors \u2014 used for residual connections in MBConv blocks.
// Operates on the flat float buffer directly; layout is irrelevant for a pure element-wise op.

struct Params {
    size  : u32,   // total number of f32 elements
    _pad0 : u32,
    _pad1 : u32,
    _pad2 : u32,
}

@group(0) @binding(0) var<storage, read>       input_a : array<f32>;
@group(0) @binding(1) var<storage, read>       input_b : array<f32>;
@group(0) @binding(2) var<uniform>             params  : Params;
@group(0) @binding(3) var<storage, read_write> output  : array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.size) { return; }
    output[idx] = input_a[idx] + input_b[idx];
}
`;var at=`enable f16;

// Element-wise add \u2014 full f16 variant.
// array<f16> is binary-compatible with array<vec4<f16>> written by the f16 conv shaders.

struct Params {
    size  : u32,
    _pad0 : u32,
    _pad1 : u32,
    _pad2 : u32,
}

@group(0) @binding(0) var<storage, read>       input_a : array<f16>;
@group(0) @binding(1) var<storage, read>       input_b : array<f16>;
@group(0) @binding(2) var<uniform>             params  : Params;
@group(0) @binding(3) var<storage, read_write> output  : array<f16>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.size) { return; }
    output[idx] = input_a[idx] + input_b[idx];
}
`;var V=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?at:nt;let n=e.h*e.w*e.c;this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e,r],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(n/256),1,1];}};var it=`// Element-wise sigmoid: output = 1 / (1 + exp(-x)).
// Operates on packed vec4 buffers (NHWC layout). exp() and arithmetic are element-wise on vec4.

struct Params {
    n_groups : u32,   // total vec4 elements (H * W * channel_groups)
    _pad0    : u32,
    _pad1    : u32,
    _pad2    : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.n_groups) { return; }
    output_buf[idx] = 1.0 / (1.0 + exp(-input_buf[idx]));
}
`;var ot=`enable f16;

// Sigmoid \u2014 full f16 variant.

struct Params {
    n_groups : u32,
    _pad0    : u32,
    _pad1    : u32,
    _pad2    : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.n_groups) { return; }
    let x = vec4<f32>(input_buf[idx]);
    output_buf[idx] = vec4<f16>(1.0 / (1.0 + exp(-x)));
}
`;var N=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e){super(t),this.shader=t.dtype==="f16"?ot:it;let r=e.h*e.w*(e.c/4);this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([r,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r/256),1,1];}};var st=`// Element-wise tanh \u2014 used by ConvGRU candidate activation.
// Operates on packed vec4 buffers (NHWC layout). tanh() is element-wise on vec4.

struct Params {
    n_groups : u32,
    _pad0    : u32,
    _pad1    : u32,
    _pad2    : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.n_groups) { return; }
    output_buf[idx] = tanh(input_buf[idx]);
}
`;var ut=`enable f16;

// Tanh \u2014 full f16 variant.

struct Params {
    n_groups : u32,
    _pad0    : u32,
    _pad1    : u32,
    _pad2    : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.n_groups) { return; }
    let x = vec4<f32>(input_buf[idx]);
    output_buf[idx] = vec4<f16>(tanh(x));
}
`;var $=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e){super(t),this.shader=t.dtype==="f16"?ut:st;let r=e.h*e.w*(e.c/4);this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([r,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r/256),1,1];}};var pt=`// Element-wise multiply \u2014 used in ConvGRU for r \u2299 h_prev.
// Same flat-float layout as add.wgsl.

struct Params {
    size  : u32,
    _pad0 : u32,
    _pad1 : u32,
    _pad2 : u32,
}

@group(0) @binding(0) var<storage, read>       input_a : array<f32>;
@group(0) @binding(1) var<storage, read>       input_b : array<f32>;
@group(0) @binding(2) var<uniform>             params  : Params;
@group(0) @binding(3) var<storage, read_write> output  : array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.size) { return; }
    output[idx] = input_a[idx] * input_b[idx];
}
`;var lt=`enable f16;

// Element-wise multiply \u2014 full f16 variant.
// array<f16> is binary-compatible with array<vec4<f16>> written by the f16 conv shaders.

struct Params {
    size  : u32,
    _pad0 : u32,
    _pad1 : u32,
    _pad2 : u32,
}

@group(0) @binding(0) var<storage, read>       input_a : array<f16>;
@group(0) @binding(1) var<storage, read>       input_b : array<f16>;
@group(0) @binding(2) var<uniform>             params  : Params;
@group(0) @binding(3) var<storage, read_write> output  : array<f16>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= params.size) { return; }
    output[idx] = input_a[idx] * input_b[idx];
}
`;var j=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?lt:pt;let n=e.h*e.w*e.c;this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e,r],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(n/256),1,1];}};var ct=`// Bilinear gather-warp (f32). See warp_f16.wgsl for the math.

struct Params {
    h          : u32,
    w          : u32,
    flow_scale : f32,
}

@group(0) @binding(0) var<storage, read>       source_buf : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       flow_buf   : array<vec4<f32>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f32>>;

fn samp(x: i32, y: i32, W: i32, H: i32) -> vec4<f32> {
    let cx = clamp(x, 0, W - 1);
    let cy = clamp(y, 0, H - 1);
    return source_buf[u32(cy) * u32(W) + u32(cx)];
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    let W = i32(params.w);
    let H = i32(params.h);
    let idx = y * params.w + x;

    let f  = flow_buf[idx].xy;
    let sx = clamp(f32(x) + params.flow_scale * f.x, 0.0, f32(W - 1));
    let sy = clamp(f32(y) + params.flow_scale * f.y, 0.0, f32(H - 1));

    let x0 = i32(floor(sx));
    let y0 = i32(floor(sy));
    let tx = sx - f32(x0);
    let ty = sy - f32(y0);

    let top = mix(samp(x0, y0, W, H), samp(x0 + 1, y0, W, H), tx);
    let bot = mix(samp(x0, y0 + 1, W, H), samp(x0 + 1, y0 + 1, W, H), tx);
    output_buf[idx] = mix(top, bot, ty);
}
`;var dt=`enable f16;

// Bilinear gather-warp (f16 storage, f32 coordinate math). For each output pixel
// p, sample the source at p + flow_scale\xB7flow[p].xy and bilinearly interpolate,
// clamping the sample to the edge (border-replicate). Source + flow are 4-ch
// (1 group), same resolution; flow vector is in .xy.

struct Params {
    h          : u32,
    w          : u32,
    flow_scale : f32,
}

@group(0) @binding(0) var<storage, read>       source_buf : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       flow_buf   : array<vec4<f16>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f16>>;

fn samp(x: i32, y: i32, W: i32, H: i32) -> vec4<f32> {
    let cx = clamp(x, 0, W - 1);
    let cy = clamp(y, 0, H - 1);
    return vec4<f32>(source_buf[u32(cy) * u32(W) + u32(cx)]);
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    let W = i32(params.w);
    let H = i32(params.h);
    let idx = y * params.w + x;

    let f  = vec2<f32>(flow_buf[idx].xy);
    let sx = clamp(f32(x) + params.flow_scale * f.x, 0.0, f32(W - 1));
    let sy = clamp(f32(y) + params.flow_scale * f.y, 0.0, f32(H - 1));

    let x0 = i32(floor(sx));
    let y0 = i32(floor(sy));
    let tx = sx - f32(x0);
    let ty = sy - f32(y0);

    let top = mix(samp(x0, y0, W, H), samp(x0 + 1, y0, W, H), tx);
    let bot = mix(samp(x0, y0 + 1, W, H), samp(x0 + 1, y0 + 1, W, H), tx);
    output_buf[idx] = vec4<f16>(mix(top, bot, ty));
}
`;var q=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?dt:ct,this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e,r],this.createUniform("params","Params");let i=new Uint32Array(3);i[0]=e.h,i[1]=e.w,new Float32Array(i.buffer)[2]=n.flowScale,this.setUniform("params",i),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var ft=`// Flow-gated temporal stabilizer (f32). See stabilize_f16.wgsl for the math.

struct Params {
    h        : u32,
    w        : u32,
    t_lo     : f32,
    t_hi     : f32,
    leak     : f32,
    release  : f32,
    t_div    : f32,
    div_scale: f32,
    step_x   : u32,
    step_y   : u32,
}

@group(0) @binding(0) var<storage, read>       flow_buf     : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       pred_buf     : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       ref_buf      : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read>       env_prev_buf : array<vec4<f32>>;
@group(0) @binding(4) var<uniform>             params       : Params;
@group(0) @binding(5) var<storage, read_write> output_buf   : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }
    let idx = y * params.w + x;

    let mag      = length(flow_buf[idx].xy);
    let env_prev = env_prev_buf[idx].y;
    let env      = max(mag, params.release * env_prev);

    let xr = min(x + params.step_x, params.w - 1u);
    let xl = select(x - params.step_x, 0u, x < params.step_x);
    let yd = min(y + params.step_y, params.h - 1u);
    let yu = select(y - params.step_y, 0u, y < params.step_y);
    let dfx = flow_buf[y * params.w + xr].x - flow_buf[y * params.w + xl].x;
    let dfy = flow_buf[yd * params.w + x].y - flow_buf[yu * params.w + x].y;
    let divg = abs(dfx + dfy);

    let g_mag = clamp((env - params.t_lo) / max(params.t_hi - params.t_lo, 1e-3), 0.0, 1.0);
    let g_div = clamp((divg - params.t_div) / max(params.div_scale, 1e-3), 0.0, 1.0);
    let g = max(max(g_mag, g_div), params.leak);

    let pred = pred_buf[idx].x;
    let refv = ref_buf[idx].x;
    let stab = g * pred + (1.0 - g) * refv;

    output_buf[idx] = vec4<f32>(stab, env, 0.0, 0.0);
}
`;var ht=`enable f16;

// Flow-gated temporal stabilizer (f16 storage, f32 gate math). Per pixel:
//   env = max(|flow.xy|, release\xB7envPrev.y)      peak-hold (fast attack, slow release)
//   div = |\u2202fx/\u2202x + \u2202fy/\u2202y|                       flow divergence (occlusion seam)
//   g   = max(clamp((env-tLo)/(tHi-tLo),0,1), clamp((div-tDiv)/divScale,0,1), leak)
//   out = vec4((g\xB7pred + (1-g)\xB7ref).x, env, 0, 0)
// The divergence term opens the gate at occlusion/disocclusion boundaries (where
// the flow tears but the revealed-background magnitude is ~0). Finite-difference
// step spans ~1 base/4 pixel. alpha is in .x of pred/ref; env threads via .y.

struct Params {
    h        : u32,
    w        : u32,
    t_lo     : f32,
    t_hi     : f32,
    leak     : f32,
    release  : f32,
    t_div    : f32,
    div_scale: f32,
    step_x   : u32,
    step_y   : u32,
}

@group(0) @binding(0) var<storage, read>       flow_buf     : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       pred_buf     : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       ref_buf      : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       env_prev_buf : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params       : Params;
@group(0) @binding(5) var<storage, read_write> output_buf   : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }
    let idx = y * params.w + x;

    let mag      = length(vec2<f32>(flow_buf[idx].xy));
    let env_prev = f32(env_prev_buf[idx].y);
    let env      = max(mag, params.release * env_prev);

    // Flow divergence over a \xB1step finite-difference (clamped to the edges).
    let xr = min(x + params.step_x, params.w - 1u);
    let xl = select(x - params.step_x, 0u, x < params.step_x);
    let yd = min(y + params.step_y, params.h - 1u);
    let yu = select(y - params.step_y, 0u, y < params.step_y);
    let dfx = f32(flow_buf[y * params.w + xr].x) - f32(flow_buf[y * params.w + xl].x);
    let dfy = f32(flow_buf[yd * params.w + x].y) - f32(flow_buf[yu * params.w + x].y);
    let divg = abs(dfx + dfy);

    let g_mag = clamp((env - params.t_lo) / max(params.t_hi - params.t_lo, 1e-3), 0.0, 1.0);
    let g_div = clamp((divg - params.t_div) / max(params.div_scale, 1e-3), 0.0, 1.0);
    let g = max(max(g_mag, g_div), params.leak);

    let pred = f32(pred_buf[idx].x);
    let refv = f32(ref_buf[idx].x);
    let stab = g * pred + (1.0 - g) * refv;

    output_buf[idx] = vec4<f16>(f16(stab), f16(env), 0.0h, 0.0h);
}
`;var X=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r,n,i,o){super(t),this.shader=t.dtype==="f16"?ht:ft,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r,n,i],this.createUniform("params","Params");let s=new Uint32Array(10);s[0]=e.h,s[1]=e.w;let u=new Float32Array(s.buffer);u[2]=o.tLo,u[3]=o.tHi,u[4]=o.leak,u[5]=o.release,u[6]=o.tDiv,u[7]=o.divScale,s[8]=o.stepX,s[9]=o.stepY,this.setUniform("params",s),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var gt=`// Bilinear upsample (arbitrary ratio), align_corners=False (matches PyTorch default).
// Input/output in NHWC vec4 format: index = y*W*(C/4) + x*(C/4) + c_group.
// Each thread computes one output pixel for one channel group (vec4 = 4 channels).

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    // align_corners=False: src = (out + 0.5) * (in / out) - 0.5
    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    // Clamp to [0, in-1] for border replication. Use i32 intermediates so that
    // floor() returning -1.0 doesn't produce an invalid u32 conversion.
    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = input_buf[y0 * IW * C + x0 * C + c];
    let tr = input_buf[y0 * IW * C + x1 * C + c];
    let bl = input_buf[y1 * IW * C + x0 * C + c];
    let br = input_buf[y1 * IW * C + x1 * C + c];

    // Bilinear blend \u2014 vec4 ops are element-wise, so all 4 channels blend identically.
    let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
               +        wy  * ((1.0 - wx) * bl + wx * br);

    output_buf[oy * params.out_w * C + ox * C + c] = result;
}
`;var mt=`enable f16;

// Bilinear upsample 2\xD7 \u2014 full f16 variant.
// Interpolation weights (wx, wy) and intermediate blends computed in f32 for
// accuracy; result cast to f16 on write.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = vec4<f32>(input_buf[y0 * IW * C + x0 * C + c]);
    let tr = vec4<f32>(input_buf[y0 * IW * C + x1 * C + c]);
    let bl = vec4<f32>(input_buf[y1 * IW * C + x0 * C + c]);
    let br = vec4<f32>(input_buf[y1 * IW * C + x1 * C + c]);

    let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
               +        wy  * ((1.0 - wx) * bl + wx * br);

    output_buf[oy * params.out_w * C + ox * C + c] = vec4<f16>(result);
}
`;var K=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?mt:gt;let n=e.c/4;this.output=t.tensor(r.outH,r.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,r.outH,r.outW,n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r.outW/8),Math.ceil(r.outH/8),n];}};var _t=`// Top-left crop (f32). See crop_f16.wgsl.

struct Params {
    in_w   : u32,
    out_h  : u32,
    out_w  : u32,
    groups : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let g = gid.z;
    if (x >= params.out_w || y >= params.out_h || g >= params.groups) { return; }
    let G = params.groups;
    output_buf[y * params.out_w * G + x * G + g] = input_buf[y * params.in_w * G + x * G + g];
}
`;var bt=`enable f16;

// Top-left crop: output[y,x,g] = input[y,x,g] for y<outH, x<outW (training crop_like).

struct Params {
    in_w   : u32,
    out_h  : u32,
    out_w  : u32,
    groups : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let g = gid.z;
    if (x >= params.out_w || y >= params.out_h || g >= params.groups) { return; }
    let G = params.groups;
    output_buf[y * params.out_w * G + x * G + g] = input_buf[y * params.in_w * G + x * G + g];
}
`;var Y=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?bt:_t;let n=e.c/4;this.output=t.tensor(r.outH,r.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.w,r.outH,r.outW,n])),this.defaultSetup(),this.dispatch=[Math.ceil(r.outW/8),Math.ceil(r.outH/8),n];}};var vt=`// Bicubic upsample (arbitrary scale) \u2014 Keys cubic, a=-0.75 (PyTorch default
// for mode='bicubic', align_corners=False). Direct 2D, 4\xD74 = 16 taps per
// output pixel. NHWC vec4 layout: index = y*W*(C/4) + x*(C/4) + c_group.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

const A: f32 = -0.75;

fn wcubic(d: f32) -> f32 {
    let ad = abs(d);
    if (ad <= 1.0) { return ((A + 2.0) * ad - (A + 3.0)) * ad * ad + 1.0; }
    if (ad <  2.0) { return ((A * ad - 5.0 * A) * ad + 8.0 * A) * ad - 4.0 * A; }
    return 0.0;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = i32(floor(src_x));
    let y0 = i32(floor(src_y));
    let fx = src_x - f32(x0);
    let fy = src_y - f32(y0);

    var wx: array<f32, 4>;
    var wy: array<f32, 4>;
    wx[0] = wcubic(1.0 + fx); wx[1] = wcubic(fx); wx[2] = wcubic(1.0 - fx); wx[3] = wcubic(2.0 - fx);
    wy[0] = wcubic(1.0 + fy); wy[1] = wcubic(fy); wy[2] = wcubic(1.0 - fy); wy[3] = wcubic(2.0 - fy);

    var acc: vec4<f32> = vec4<f32>(0.0);
    for (var j: i32 = 0; j < 4; j = j + 1) {
        let sy = u32(clamp(y0 + j - 1, 0, i32(IH) - 1));
        for (var i: i32 = 0; i < 4; i = i + 1) {
            let sx = u32(clamp(x0 + i - 1, 0, i32(IW) - 1));
            let v  = input_buf[sy * IW * C + sx * C + c];
            acc = acc + (wx[i] * wy[j]) * v;
        }
    }

    output_buf[oy * params.out_w * C + ox * C + c] = acc;
}
`;var xt=`enable f16;

// Bicubic upsample \u2014 full f16 storage variant. Bicubic weights and the per-
// pixel accumulator are computed in f32 (cheap to keep precision around the
// kernel arithmetic), then demoted to f16 when written to the output buffer.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

const A: f32 = -0.75;

fn wcubic(d: f32) -> f32 {
    let ad = abs(d);
    if (ad <= 1.0) { return ((A + 2.0) * ad - (A + 3.0)) * ad * ad + 1.0; }
    if (ad <  2.0) { return ((A * ad - 5.0 * A) * ad + 8.0 * A) * ad - 4.0 * A; }
    return 0.0;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = i32(floor(src_x));
    let y0 = i32(floor(src_y));
    let fx = src_x - f32(x0);
    let fy = src_y - f32(y0);

    var wx: array<f32, 4>;
    var wy: array<f32, 4>;
    wx[0] = wcubic(1.0 + fx); wx[1] = wcubic(fx); wx[2] = wcubic(1.0 - fx); wx[3] = wcubic(2.0 - fx);
    wy[0] = wcubic(1.0 + fy); wy[1] = wcubic(fy); wy[2] = wcubic(1.0 - fy); wy[3] = wcubic(2.0 - fy);

    var acc: vec4<f32> = vec4<f32>(0.0);
    for (var j: i32 = 0; j < 4; j = j + 1) {
        let sy = u32(clamp(y0 + j - 1, 0, i32(IH) - 1));
        for (var i: i32 = 0; i < 4; i = i + 1) {
            let sx = u32(clamp(x0 + i - 1, 0, i32(IW) - 1));
            let v  = vec4<f32>(input_buf[sy * IW * C + sx * C + c]);
            acc = acc + (wx[i] * wy[j]) * v;
        }
    }

    output_buf[oy * params.out_w * C + ox * C + c] = vec4<f16>(acc);
}
`;var J=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?xt:vt;let n=e.c/4;this.output=t.tensor(r.outH,r.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,r.outH,r.outW,n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r.outW/8),Math.ceil(r.outH/8),n];}};var wt=`// Channel concatenation: output = cat(A, B, dim=channel).
// Both A and B must share the same H\xD7W and be in NHWC vec4 format.
// Output layout: for each (y, x), the first a_groups vec4s come from A,
// followed by b_groups vec4s from B.

struct Params {
    height    : u32,
    width     : u32,
    a_groups  : u32,  // Ca / 4
    b_groups  : u32,  // Cb / 4
    out_groups: u32,  // a_groups + b_groups
    _pad0     : u32,
    _pad1     : u32,
    _pad2     : u32,
}

@group(0) @binding(0) var<storage, read>       input_a    : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       input_b    : array<vec4<f32>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let c = gid.z;  // output channel group

    let W   = params.width;
    let Ag  = params.a_groups;
    let Bg  = params.b_groups;
    let Cg  = params.out_groups;

    if (x >= W || y >= params.height || c >= Cg) {
        return;
    }

    let out_idx = y * W * Cg + x * Cg + c;

    if (c < Ag) {
        output_buf[out_idx] = input_a[y * W * Ag + x * Ag + c];
    } else {
        let c_b = c - Ag;
        output_buf[out_idx] = input_b[y * W * Bg + x * Bg + c_b];
    }
}
`;var yt=`enable f16;

// Channel concatenation \u2014 full f16 variant.

struct Params {
    height    : u32,
    width     : u32,
    a_groups  : u32,
    b_groups  : u32,
    out_groups: u32,
    _pad0     : u32,
    _pad1     : u32,
    _pad2     : u32,
}

@group(0) @binding(0) var<storage, read>       input_a    : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       input_b    : array<vec4<f16>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let c = gid.z;

    let W  = params.width;
    let Ag = params.a_groups;
    let Bg = params.b_groups;
    let Cg = params.out_groups;

    if (x >= W || y >= params.height || c >= Cg) { return; }

    let out_idx = y * W * Cg + x * Cg + c;
    if (c < Ag) {
        output_buf[out_idx] = input_a[y * W * Ag + x * Ag + c];
    } else {
        let c_b = c - Ag;
        output_buf[out_idx] = input_b[y * W * Bg + x * Bg + c_b];
    }
}
`;var Q=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?yt:wt;let n=e.c/4,i=r.c/4,o=n+i;this.output=t.tensor(e.h,e.w,e.c+r.c),this.inputs=[e,r],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n,i,o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),o];}};var kt=`// Conv2d + skip add fused.
// Identical to conv2d.wgsl except skip is an activation input (binding 1),
// added element-wise to the conv result at write time.
// Eliminates the separate add dispatch and its intermediate buffer round-trip.
// Binding order: input(0), skip(1), weights(2), bias(3), params(4), output(5)

struct Params {
    in_h        : u32,
    in_w        : u32,
    out_h       : u32,
    out_w       : u32,
    in_groups   : u32,
    out_groups  : u32,
    kernel_h    : u32,
    kernel_w    : u32,
    stride      : u32,
    pad_top     : u32,
    pad_left    : u32,
    activation  : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       skip_buf   : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let o = gid.z;

    if (x >= params.out_w || y >= params.out_h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;

    var result = bias_buf[o];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let in_y = u32(in_y_s);
            let in_x = u32(in_x_s);
            let z    = ky * params.kernel_w + kx;

            for (var i = 0u; i < I; i++) {
                let in_idx = in_y * params.in_w * I + in_x * I + i;
                let w_idx  = z * O * I + o * I + i;
                result += weight_buf[w_idx] * input_buf[in_idx];
            }
        }
    }

    if (params.activation == 1u) {
        result = clamp(result, vec4<f32>(0.0), vec4<f32>(6.0));
    } else if (params.activation == 2u) {
        result = max(result, vec4<f32>(0.0));
    }

    let out_idx = y * params.out_w * O + x * O + o;
    output_buf[out_idx] = result + skip_buf[out_idx];
}
`;var Pt=`enable f16;

// Conv2d + skip add fused \u2014 full f16 variant.

struct Params {
    in_h        : u32,
    in_w        : u32,
    out_h       : u32,
    out_w       : u32,
    in_groups   : u32,
    out_groups  : u32,
    kernel_h    : u32,
    kernel_w    : u32,
    stride      : u32,
    pad_top     : u32,
    pad_left    : u32,
    activation  : u32,
}

// Binding order matches conv2d_add.wgsl: input(0), skip(1), weight(2), bias(3),
// params(4), output(5).
@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       skip_buf   : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let o = gid.z;

    if (x >= params.out_w || y >= params.out_h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;

    var result = bias_buf[o];

    for (var ky = 0u; ky < params.kernel_h; ky++) {
        for (var kx = 0u; kx < params.kernel_w; kx++) {
            let in_y_s = i32(y * params.stride + ky) - i32(params.pad_top);
            let in_x_s = i32(x * params.stride + kx) - i32(params.pad_left);

            if (in_y_s < 0 || in_x_s < 0 ||
                u32(in_y_s) >= params.in_h || u32(in_x_s) >= params.in_w) {
                continue;
            }

            let in_y = u32(in_y_s);
            let in_x = u32(in_x_s);
            let z    = ky * params.kernel_w + kx;

            for (var i = 0u; i < I; i++) {
                let in_idx = in_y * params.in_w * I + in_x * I + i;
                let w_idx  = z * O * I + o * I + i;
                result += weight_buf[w_idx] * input_buf[in_idx];
            }
        }
    }

    if (params.activation == 1u) {
        result = clamp(result, vec4<f16>(0.0h), vec4<f16>(6.0h));
    } else if (params.activation == 2u) {
        result = max(result, vec4<f16>(0.0h));
    }

    let out_idx = y * params.out_w * O + x * O + o;
    output_buf[out_idx] = result + skip_buf[out_idx];
}
`;var Z=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Pt:kt;let o=_(e.h,i.kernel,i.stride,i.padding),s=_(e.w,i.kernel,i.stride,i.padding),u=e.c/4,l=i.outChannels/4,c=b(i.padding,e.h,o,i.kernel,i.stride),f=b(i.padding,e.w,s,i.kernel,i.stride);this.output=t.tensor(o,s,i.outChannels),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(d(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,s,u,l,i.kernel,i.kernel,i.stride,c,f,i.activation==="relu6"?1:0])),this.defaultSetup(),this.dispatch=[Math.ceil(s/8),Math.ceil(o/8),l];}};var Ct=`// proj_residual: bespoke 1\xD71 conv (no activation) + residual add, fused.
// Specializes conv2d_add to kernel=1 / stride=1 / pad=0 / no activation: drops
// the kernel loop, the padding checks, and the activation branch. Used by the
// MBConv project+residual tail. Both inputs share the same spatial resolution.
//
// Weight layout: [out_groups][in_groups] mat4x4 (no K*K dim since K=1).
// Bias: [out_groups] vec4.
// Binding order: input(0), skip(1), weights(2), bias(3), params(4), output(5)

struct Params {
    h          : u32,
    w          : u32,
    in_groups  : u32,
    out_groups : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       skip_buf   : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let o = gid.z;

    if (x >= params.w || y >= params.h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let pix = y * params.w + x;

    var result = bias_buf[o];
    for (var i = 0u; i < I; i++) {
        result += weight_buf[o * I + i] * input_buf[pix * I + i];
    }
    result += skip_buf[pix * O + o];

    output_buf[pix * O + o] = result;
}
`;var Tt=`enable f16;

// proj_residual \u2014 full f16 variant. See proj_residual.wgsl for layout details.
// Bespoke 1\xD71 conv (no activation) + residual add, fused.
// Binding order: input(0), skip(1), weights(2), bias(3), params(4), output(5)

struct Params {
    h          : u32,
    w          : u32,
    in_groups  : u32,
    out_groups : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       skip_buf   : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let o = gid.z;

    if (x >= params.w || y >= params.h || o >= params.out_groups) {
        return;
    }

    let I = params.in_groups;
    let O = params.out_groups;
    let pix = y * params.w + x;

    var result = bias_buf[o];
    for (var i = 0u; i < I; i++) {
        result += weight_buf[o * I + i] * input_buf[pix * I + i];
    }
    result += skip_buf[pix * O + o];

    output_buf[pix * O + o] = result;
}
`;var ee=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Tt:Ct;let o=e.c/4,s=i.outChannels/4;this.output=t.tensor(e.h,e.w,i.outChannels),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(d(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,s])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),s];}};var Ut=`// concat_conv2d: fuses [concat(a, b) \u2192 conv 3\xD73 (pad 1) \u2192 relu6] into one
// dispatch. Both inputs are already at the output resolution (the upstream
// upsample stays a separate dispatch writing a clean intermediate, so the conv
// reads are plain-indexed). Identical math to conv2d; the only difference is
// that input channels are split across two buffers: weight cols [0, a_groups)
// read a, [a_groups, I) read b.
//
// Weight layout matches conv2d: [kpos][out_groups][in_groups] mat4x4, where
// in_groups = a_groups + b_groups and the input channel order is [a, b].
// Binding order: a(0), b(1), weights(2), bias(3), params(4), output(5)

struct Params {
    h          : u32,   // a, b and output all share this shape
    w          : u32,
    a_groups   : u32,
    b_groups   : u32,
    out_groups : u32,
    _pad0      : u32,
    _pad1      : u32,
    _pad2      : u32,
}

@group(0) @binding(0) var<storage, read>       buf_a      : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       buf_b      : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(4) var<uniform>             p          : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y; let o = gid.z;
    if (x >= p.w || y >= p.h || o >= p.out_groups) { return; }

    let A = p.a_groups;
    let B = p.b_groups;
    let I = A + B;
    let O = p.out_groups;

    var result = bias_buf[o];

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let nx = i32(x + kx) - 1;
            let ny = i32(y + ky) - 1;
            if (nx < 0 || ny < 0 || u32(nx) >= p.w || u32(ny) >= p.h) { continue; }
            let z   = ky * 3u + kx;
            let pix = u32(ny) * p.w + u32(nx);
            for (var i = 0u; i < A; i++) {
                result += weight_buf[z * O * I + o * I + i] * buf_a[pix * A + i];
            }
            for (var i = 0u; i < B; i++) {
                result += weight_buf[z * O * I + o * I + (A + i)] * buf_b[pix * B + i];
            }
        }
    }

    result = clamp(result, vec4<f32>(0.0), vec4<f32>(6.0));
    output_buf[(y * p.w + x) * O + o] = result;
}
`;var Wt=`enable f16;

// concat_conv2d \u2014 full f16 variant. See concat_conv2d.wgsl for layout details.
// Fuses [concat(a, b) \u2192 conv 3\xD73 (pad 1) \u2192 relu6] into one dispatch.
// Binding order: a(0), b(1), weights(2), bias(3), params(4), output(5)

struct Params {
    h          : u32,
    w          : u32,
    a_groups   : u32,
    b_groups   : u32,
    out_groups : u32,
    _pad0      : u32,
    _pad1      : u32,
    _pad2      : u32,
}

@group(0) @binding(0) var<storage, read>       buf_a      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       buf_b      : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             p          : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y; let o = gid.z;
    if (x >= p.w || y >= p.h || o >= p.out_groups) { return; }

    let A = p.a_groups;
    let B = p.b_groups;
    let I = A + B;
    let O = p.out_groups;

    var result = bias_buf[o];

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let nx = i32(x + kx) - 1;
            let ny = i32(y + ky) - 1;
            if (nx < 0 || ny < 0 || u32(nx) >= p.w || u32(ny) >= p.h) { continue; }
            let z   = ky * 3u + kx;
            let pix = u32(ny) * p.w + u32(nx);
            for (var i = 0u; i < A; i++) {
                result += weight_buf[z * O * I + o * I + i] * buf_a[pix * A + i];
            }
            for (var i = 0u; i < B; i++) {
                result += weight_buf[z * O * I + o * I + (A + i)] * buf_b[pix * B + i];
            }
        }
    }

    result = clamp(result, vec4<f16>(0.0h), vec4<f16>(6.0h));
    output_buf[(y * p.w + x) * O + o] = result;
}
`;var te=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Wt:Ut;let o=e.c/4,s=r.c/4,u=i.outChannels/4;this.output=t.tensor(e.h,e.w,i.outChannels),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(d(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,s,u,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),u];}};var It=`// gates_fused: ConvGRU z + r gates, fused into one dispatch.
// Production config (c_up=2, split_ratio=0.5 \u2192 passthrough=1, recurrent=1):
//   u_in   : c_up=2 packed in a vec4 (.x = passthrough a, .y = recurrent b)
//   h_prev : hidden carrier \u2014 recurrent state in .z (see cand_update_fused: the
//            GRU output tensor doubles as next frame's h_prev, hidden in .z)
// Weight: 9 vec4 per kpos = (z_w_b, z_w_h, r_w_b, r_w_h). Bias .xy = (z, r).
// Output: vec4(z, r, 0, 0) \u2014 consumed by cand_update_fused.
// Binding order: u_in(0), h_prev(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_in_buf   : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       h_prev_buf : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<vec4<f32>>;   // 9 vec4
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .xy = (z, r)
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    let bias = bias_buf[0].xy;
    var z_pre = bias.x;
    var r_pre = bias.y;

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let idx  = u32(iy) * params.w + u32(ix);
            let b_n  = u_in_buf[idx].y;
            let h_n  = h_prev_buf[idx].z;
            let w    = weight_buf[kpos];
            z_pre += w.x * b_n + w.y * h_n;
            r_pre += w.z * b_n + w.w * h_n;
        }
    }

    let z = 1.0 / (1.0 + exp(-z_pre));
    let r = 1.0 / (1.0 + exp(-r_pre));
    output_buf[y * params.w + x] = vec4<f32>(z, r, 0.0, 0.0);
}
`;var Bt=`enable f16;

// gates_fused \u2014 full f16 variant. See gates_fused.wgsl for layout details.
// ConvGRU z + r gates (production config c_up=2, recurrent=1).
// Binding order: u_in(0), h_prev(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_in_buf   : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       h_prev_buf : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    let bias = bias_buf[0].xy;
    var z_pre = bias.x;
    var r_pre = bias.y;

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let idx  = u32(iy) * params.w + u32(ix);
            let b_n  = u_in_buf[idx].y;
            let h_n  = h_prev_buf[idx].z;
            let w    = weight_buf[kpos];
            z_pre += w.x * b_n + w.y * h_n;
            r_pre += w.z * b_n + w.w * h_n;
        }
    }

    let z = 1.0h / (1.0h + exp(-z_pre));
    let r = 1.0h / (1.0h + exp(-r_pre));
    output_buf[y * params.w + x] = vec4<f16>(z, r, 0.0h, 0.0h);
}
`;var re=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?Bt:It,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(g(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var St=`// cand_update_fused: ConvGRU candidate path + state update + output, fused.
// Production config (c_up=2, recurrent=1):
//   u_in      : c_up=2 (.x = a passthrough, .y = b recurrent)
//   h_prev    : hidden carrier \u2014 recurrent state in .z (the previous frame's
//               output of THIS op; on frame 0 it is a zero tensor)
//   gates_out : (.x = z, .y = r) from gates_fused
// cand_pre = bias + \u03A3_kpos (b_w*b_n + rh_w*(r_n*h_n));  h_til = tanh(cand_pre);
//   h_new = (1-z)*h_prev + z*h_til;  b_out = b + gamma*h_new.
// Output: vec4(a, b_out, h_new, 0) \u2014 .xy is the c_up=2 feature consumed
// downstream; .z carries h_new so the same tensor is fed back as next h_prev
// (no separate hidden-state buffer). Cand weight: 9 vec4 per kpos, .xy = (b_w, rh_w).
// Binding order: u_in(0), h_prev(1), gates_out(2), weight(3), bias(4), gamma(5), params(6), output(7)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_in_buf      : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       h_prev_buf    : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       gates_out_buf : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read>       weight_buf    : array<vec4<f32>>;   // 9 vec4
@group(0) @binding(4) var<storage, read>       bias_buf      : array<vec4<f32>>;   // .x = cand_bias
@group(0) @binding(5) var<storage, read>       gamma_buf     : array<vec4<f32>>;   // .x = gamma
@group(0) @binding(6) var<uniform>             params        : Params;
@group(0) @binding(7) var<storage, read_write> output_buf    : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var cand_pre = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let idx  = u32(iy) * params.w + u32(ix);
            let b_n  = u_in_buf[idx].y;
            let h_n  = h_prev_buf[idx].z;
            let r_n  = gates_out_buf[idx].y;
            let w    = weight_buf[kpos].xy;
            cand_pre += w.x * b_n + w.y * (r_n * h_n);
        }
    }

    let h_til      = tanh(cand_pre);
    let cur        = y * params.w + x;
    let u_cur      = u_in_buf[cur];
    let z_cur      = gates_out_buf[cur].x;
    let h_prev_cur = h_prev_buf[cur].z;
    let h_new      = (1.0 - z_cur) * h_prev_cur + z_cur * h_til;
    let b_out      = u_cur.y + gamma_buf[0].x * h_new;
    output_buf[cur] = vec4<f32>(u_cur.x, b_out, h_new, 0.0);
}
`;var Et=`enable f16;

// cand_update_fused \u2014 full f16 variant. See cand_update_fused.wgsl for details.
// ConvGRU candidate + state update + output (production config c_up=2, recurrent=1).
// Binding order: u_in(0), h_prev(1), gates_out(2), weight(3), bias(4), gamma(5), params(6), output(7)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_in_buf      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       h_prev_buf    : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       gates_out_buf : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       weight_buf    : array<vec4<f16>>;
@group(0) @binding(4) var<storage, read>       bias_buf      : array<vec4<f16>>;
@group(0) @binding(5) var<storage, read>       gamma_buf     : array<vec4<f16>>;
@group(0) @binding(6) var<uniform>             params        : Params;
@group(0) @binding(7) var<storage, read_write> output_buf    : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var cand_pre = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let idx  = u32(iy) * params.w + u32(ix);
            let b_n  = u_in_buf[idx].y;
            let h_n  = h_prev_buf[idx].z;
            let r_n  = gates_out_buf[idx].y;
            let w    = weight_buf[kpos].xy;
            cand_pre += w.x * b_n + w.y * (r_n * h_n);
        }
    }

    let h_til      = tanh(cand_pre);
    let cur        = y * params.w + x;
    let u_cur      = u_in_buf[cur];
    let z_cur      = gates_out_buf[cur].x;
    let h_prev_cur = h_prev_buf[cur].z;
    let h_new      = (1.0h - z_cur) * h_prev_cur + z_cur * h_til;
    let b_out      = u_cur.y + gamma_buf[0].x * h_new;
    output_buf[cur] = vec4<f16>(u_cur.x, b_out, h_new, 0.0h);
}
`;var ne=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i,o){super(t),this.shader=t.dtype==="f16"?Et:St,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r,n],this.weights=[t.upload(d(i.weights)),t.upload(g(i.bias)),t.upload(g(o))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var Gt=`// conv_expand: bespoke N\u21922 conv 3\xD73 (pad 1) + relu (wrapper expand_feat).
// Expands feat_lr (in_c, mult of 4) to the c_up=2 carrier \u2014 output .xy = the 2
// native channels, .zw = 0. mat4x2 per (kpos, in_group) with a vec2 accumulator.
// Weight: 9 * in_groups mat4x2 (8 floats each, col-major). Bias .xy.
// Binding order: input(0), weights(1), bias(2), params(3), output(4)

struct Params { h: u32, w: u32, in_groups: u32, _pad: u32 }

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x2<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .xy used
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var result = bias_buf[0].xy;
    let I = params.in_groups;

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            for (var i = 0u; i < I; i++) {
                let in_idx = (u32(iy) * params.w + u32(ix)) * I + i;
                result += weight_buf[kpos * I + i] * input_buf[in_idx];
            }
        }
    }

    result = max(result, vec2<f32>(0.0));   // expand_feat is F.relu
    output_buf[y * params.w + x] = vec4<f32>(result, 0.0, 0.0);
}
`;var Ft=`enable f16;

// conv_expand \u2014 full f16 variant. See conv_expand.wgsl for layout details.
// Bespoke N\u21922 conv 3\xD73 (pad 1) + relu (wrapper expand_feat).
// Binding order: input(0), weights(1), bias(2), params(3), output(4)

struct Params { h: u32, w: u32, in_groups: u32, _pad: u32 }

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x2<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var result = bias_buf[0].xy;
    let I = params.in_groups;

    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            for (var i = 0u; i < I; i++) {
                let in_idx = (u32(iy) * params.w + u32(ix)) * I + i;
                result += weight_buf[kpos * I + i] * input_buf[in_idx];
            }
        }
    }

    result = max(result, vec2<f16>(0.0h));
    output_buf[y * params.w + x] = vec4<f16>(result, 0.0h, 0.0h);
}
`;var ae=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?Ft:Gt;let n=e.c/4;this.output=t.tensor(e.h,e.w,4),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(g(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var At=`// cat_conv_6to2: fused concat(u, d) + 6\u21922 conv 3\xD73 (pad 1) + relu (E up1_combine).
// u = c_up=2 carrier (.xy); d = c_high=4 (full vec4). Both same resolution.
// Channel order concat([u, d]) = (u.x, u.y, d.x, d.y, d.z, d.w), split into
//   v3a = (u.x, u.y, d.x)   v3b = d.yzw
// Weight: 9 * 2 mat3x2 (6 floats each, col-major). Bias .xy. Output c_up=2 carrier.
// Binding order: u(0), d(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_buf      : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       d_buf      : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat3x2<f32>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .xy used
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var result = bias_buf[0].xy;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let pix = u32(iy) * params.w + u32(ix);
            let u = u_buf[pix];
            let d = d_buf[pix];
            let v3a = vec3<f32>(u.xy, d.x);
            let v3b = d.yzw;
            result += weight_buf[kpos * 2u + 0u] * v3a;
            result += weight_buf[kpos * 2u + 1u] * v3b;
        }
    }

    result = max(result, vec2<f32>(0.0));   // up1_combine is F.relu
    output_buf[y * params.w + x] = vec4<f32>(result, 0.0, 0.0);
}
`;var Mt=`enable f16;

// cat_conv_6to2 \u2014 full f16 variant. See cat_conv_6to2.wgsl for layout details.
// Fused concat(u, d) + 6\u21922 conv 3\xD73 (pad 1) + relu (E up1_combine).
// Binding order: u(0), d(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_buf      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       d_buf      : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<mat3x2<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var result = bias_buf[0].xy;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let pix = u32(iy) * params.w + u32(ix);
            let u = u_buf[pix];
            let d = d_buf[pix];
            let v3a = vec3<f16>(u.xy, d.x);
            let v3b = d.yzw;
            result += weight_buf[kpos * 2u + 0u] * v3a;
            result += weight_buf[kpos * 2u + 1u] * v3b;
        }
    }

    result = max(result, vec2<f16>(0.0h));
    output_buf[y * params.w + x] = vec4<f16>(result, 0.0h, 0.0h);
}
`;var ie=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?Mt:At,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(g(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var Ot=`// down_adapter: fused stride-N 3\xD73 conv (4\u21924) + relu + 1\xD71 adapter (4\u21923, no
// act) into one dispatch. E variant: down2 (c_high=4 \u2192 c_low=4, stride 2) +
// adapter. A/B variant: down1 (RGB .xyz \u2192 4, stride 2/3) + adapter (the down
// weight's 4th input column is zeroed at export for RGB input). Symmetric pad.
//
// down_w: 9 mat4x4 (3\xD73, 4\u21924). adapt_w: 1 mat4x4 (1\xD71, 4\u21924 padded from 4\u21923,
// last row 0). adapt_b: .xyz used. Output: vec4(adapter.xyz, 0).
// Binding order: input(0), down_w(1), down_b(2), adapt_w(3), adapt_b(4), params(5), output(6)

struct Params {
    in_h     : u32,
    in_w     : u32,
    out_h    : u32,
    out_w    : u32,
    stride   : u32,
    pad_top  : u32,
    pad_left : u32,
    _pad     : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       down_w     : array<mat4x4<f32>>;   // 9 mat4x4
@group(0) @binding(2) var<storage, read>       down_b     : array<vec4<f32>>;     // 1 vec4
@group(0) @binding(3) var<storage, read>       adapt_w    : array<mat4x4<f32>>;   // 1 mat4x4
@group(0) @binding(4) var<storage, read>       adapt_b    : array<vec4<f32>>;     // .xyz used
@group(0) @binding(5) var<uniform>             p          : Params;
@group(0) @binding(6) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= p.out_w || y >= p.out_h) { return; }

    var down_out = down_b[0];
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y * p.stride + ky) - i32(p.pad_top);
            let ix = i32(x * p.stride + kx) - i32(p.pad_left);
            if (iy < 0 || ix < 0 || u32(iy) >= p.in_h || u32(ix) >= p.in_w) { continue; }
            let kpos = ky * 3u + kx;
            down_out += down_w[kpos] * input_buf[u32(iy) * p.in_w + u32(ix)];
        }
    }
    down_out = max(down_out, vec4<f32>(0.0));   // F.relu

    let adapt_out = adapt_w[0] * down_out + adapt_b[0];
    output_buf[y * p.out_w + x] = vec4<f32>(adapt_out.xyz, 0.0);
}
`;var Dt=`enable f16;

// down_adapter \u2014 full f16 variant. See down_adapter.wgsl for layout details.
// Fused stride-N 3\xD73 conv (4\u21924) + relu + 1\xD71 adapter (4\u21923, no act).
// Binding order: input(0), down_w(1), down_b(2), adapt_w(3), adapt_b(4), params(5), output(6)

struct Params {
    in_h     : u32,
    in_w     : u32,
    out_h    : u32,
    out_w    : u32,
    stride   : u32,
    pad_top  : u32,
    pad_left : u32,
    _pad     : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       down_w     : array<mat4x4<f16>>;
@group(0) @binding(2) var<storage, read>       down_b     : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       adapt_w    : array<mat4x4<f16>>;
@group(0) @binding(4) var<storage, read>       adapt_b    : array<vec4<f16>>;
@group(0) @binding(5) var<uniform>             p          : Params;
@group(0) @binding(6) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= p.out_w || y >= p.out_h) { return; }

    var down_out = down_b[0];
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y * p.stride + ky) - i32(p.pad_top);
            let ix = i32(x * p.stride + kx) - i32(p.pad_left);
            if (iy < 0 || ix < 0 || u32(iy) >= p.in_h || u32(ix) >= p.in_w) { continue; }
            let kpos = ky * 3u + kx;
            down_out += down_w[kpos] * input_buf[u32(iy) * p.in_w + u32(ix)];
        }
    }
    down_out = max(down_out, vec4<f16>(0.0h));

    let adapt_out = adapt_w[0] * down_out + adapt_b[0];
    output_buf[y * p.out_w + x] = vec4<f16>(adapt_out.xyz, 0.0h);
}
`;var oe=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Dt:Ot;let o=_(e.h,3,i.stride,1),s=_(e.w,3,i.stride,1),u=b(1,e.h,o,3,i.stride),l=b(1,e.w,s,3,i.stride);this.output=t.tensor(o,s,4),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(g(r.bias)),t.upload(d(n.weights)),t.upload(g(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,s,i.stride,u,l,0])),this.defaultSetup(),this.dispatch=[Math.ceil(s/8),Math.ceil(o/8),1];}};var zt=`// up_final: fused concat(u, rgb) \u2192 conv 3\xD73 5\u21921 \u2192 sigmoid (A/B alpha head).
// u = c_up=2 carrier (.xy); rgb = x_hr (.xyz). 5 inputs \u2192 1 alpha (output .x).
// Weight: 18 vec4 \u2014 [0..8] = (w0, w1, 0, 0) for u per kpos; [9..17] =
// (w2, w3, w4, 0) for rgb per kpos. Bias .x.
// Binding order: u(0), rgb(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_gru      : array<vec4<f32>>;   // .xy
@group(0) @binding(1) var<storage, read>       rgb        : array<vec4<f32>>;   // .xyz
@group(0) @binding(2) var<storage, read>       weight_buf : array<vec4<f32>>;   // 18 vec4
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .x
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f32>>;   // .x = alpha

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var acc = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let p = u32(iy) * params.w + u32(ix);
            acc += dot(weight_buf[kpos].xy,       u_gru[p].xy);
            acc += dot(weight_buf[9u + kpos].xyz, rgb[p].xyz);
        }
    }

    output_buf[y * params.w + x] = vec4<f32>(1.0 / (1.0 + exp(-acc)), 0.0, 0.0, 0.0);
}
`;var Rt=`enable f16;

// up_final \u2014 full f16 variant. See up_final.wgsl for layout details.
// Fused concat(u, rgb) \u2192 conv 3\xD73 5\u21921 \u2192 sigmoid (A/B alpha head).
// Binding order: u(0), rgb(1), weights(2), bias(3), params(4), output(5)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_gru      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       rgb        : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       weight_buf : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(4) var<uniform>             params     : Params;
@group(0) @binding(5) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var acc = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let p = u32(iy) * params.w + u32(ix);
            acc += dot(weight_buf[kpos].xy,       u_gru[p].xy);
            acc += dot(weight_buf[9u + kpos].xyz, rgb[p].xyz);
        }
    }

    output_buf[y * params.w + x] = vec4<f16>(1.0h / (1.0h + exp(-acc)), 0.0h, 0.0h, 0.0h);
}
`;var se=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?Rt:zt,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(g(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var Ht=`// up_final_skip: C/D alpha head. Fused concat(u, d_full, rgb) \u2192 conv 3\xD73 9\u21921
// \u2192 sigmoid. u = c_up=2 (.xy); d_full = c_high=4 full-res skip (full vec4);
// rgb = x_hr (.xyz). Channel order concat = 2 + 4 + 3 = 9. Output .x = alpha.
// Weight: 27 vec4 (3 per kpos): [kpos*3+0]=(w0,w1,0,0) u; [kpos*3+1]=(w2..w5)
// d_full; [kpos*3+2]=(w6,w7,w8,0) rgb. Bias .x.
// Binding order: u(0), d_full(1), rgb(2), weights(3), bias(4), params(5), output(6)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_gru      : array<vec4<f32>>;   // .xy
@group(0) @binding(1) var<storage, read>       d_full     : array<vec4<f32>>;   // full vec4
@group(0) @binding(2) var<storage, read>       rgb        : array<vec4<f32>>;   // .xyz
@group(0) @binding(3) var<storage, read>       weight_buf : array<vec4<f32>>;   // 27 vec4
@group(0) @binding(4) var<storage, read>       bias_buf   : array<vec4<f32>>;   // .x
@group(0) @binding(5) var<uniform>             params     : Params;
@group(0) @binding(6) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var acc = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let p = u32(iy) * params.w + u32(ix);
            acc += dot(weight_buf[kpos * 3u + 0u].xy,  u_gru[p].xy);
            acc += dot(weight_buf[kpos * 3u + 1u],     d_full[p]);
            acc += dot(weight_buf[kpos * 3u + 2u].xyz, rgb[p].xyz);
        }
    }

    output_buf[y * params.w + x] = vec4<f32>(1.0 / (1.0 + exp(-acc)), 0.0, 0.0, 0.0);
}
`;var Lt=`enable f16;

// up_final_skip \u2014 full f16 variant. See up_final_skip.wgsl for layout details.
// C/D alpha head: fused concat(u, d_full, rgb) \u2192 conv 3\xD73 9\u21921 \u2192 sigmoid.
// Binding order: u(0), d_full(1), rgb(2), weights(3), bias(4), params(5), output(6)

struct Params { h: u32, w: u32, _pad0: u32, _pad1: u32 }

@group(0) @binding(0) var<storage, read>       u_gru      : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       d_full     : array<vec4<f16>>;
@group(0) @binding(2) var<storage, read>       rgb        : array<vec4<f16>>;
@group(0) @binding(3) var<storage, read>       weight_buf : array<vec4<f16>>;
@group(0) @binding(4) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(5) var<uniform>             params     : Params;
@group(0) @binding(6) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x; let y = gid.y;
    if (x >= params.w || y >= params.h) { return; }

    var acc = bias_buf[0].x;
    for (var ky = 0u; ky < 3u; ky++) {
        for (var kx = 0u; kx < 3u; kx++) {
            let iy = i32(y + ky) - 1; let ix = i32(x + kx) - 1;
            if (iy < 0 || ix < 0 || u32(iy) >= params.h || u32(ix) >= params.w) { continue; }
            let kpos = ky * 3u + kx;
            let p = u32(iy) * params.w + u32(ix);
            acc += dot(weight_buf[kpos * 3u + 0u].xy,  u_gru[p].xy);
            acc += dot(weight_buf[kpos * 3u + 1u],     d_full[p]);
            acc += dot(weight_buf[kpos * 3u + 2u].xyz, rgb[p].xyz);
        }
    }

    output_buf[y * params.w + x] = vec4<f16>(1.0h / (1.0h + exp(-acc)), 0.0h, 0.0h, 0.0h);
}
`;var ue=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Lt:Ht,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r,n],this.weights=[t.upload(d(i.weights)),t.upload(g(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var Vt=`// Bilinear upsample + channel concat fused.
// input_a is the decoder tensor at small spatial resolution (in_h \xD7 in_w).
// input_b is the encoder skip feature already at output resolution (out_h \xD7 out_w).
// For output channels 0..a_groups-1: bilinearly interpolate from input_a.
// For output channels a_groups..out_groups-1: copy directly from input_b.
// Eliminates the intermediate upsample buffer and the separate concat dispatch.

struct Params {
    in_h       : u32,   // input_a spatial height
    in_w       : u32,   // input_a spatial width
    out_h      : u32,
    out_w      : u32,
    a_groups   : u32,   // input_a channel groups (upsampled)
    b_groups   : u32,   // input_b channel groups (encoder feature)
    out_groups : u32,   // a_groups + b_groups
    _pad0      : u32,
}

@group(0) @binding(0) var<storage, read>       input_a    : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       input_b    : array<vec4<f32>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.out_groups) { return; }

    let out_idx = oy * params.out_w * params.out_groups + ox * params.out_groups + c;

    if (c < params.a_groups) {
        let IH = params.in_h;
        let IW = params.in_w;
        let AG = params.a_groups;

        let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
        let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

        let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
        let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
        let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
        let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

        let wx = src_x - floor(src_x);
        let wy = src_y - floor(src_y);

        let tl = input_a[y0 * IW * AG + x0 * AG + c];
        let tr = input_a[y0 * IW * AG + x1 * AG + c];
        let bl = input_a[y1 * IW * AG + x0 * AG + c];
        let br = input_a[y1 * IW * AG + x1 * AG + c];

        output_buf[out_idx] = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
                            +        wy  * ((1.0 - wx) * bl + wx * br);
    } else {
        let c_b = c - params.a_groups;
        output_buf[out_idx] = input_b[oy * params.out_w * params.b_groups + ox * params.b_groups + c_b];
    }
}
`;var Nt=`enable f16;

// Bilinear upsample + channel concat fused \u2014 full f16 variant.
// Bilinear weights (wx, wy) and intermediate blends computed in f32; result cast to f16.

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    a_groups   : u32,
    b_groups   : u32,
    out_groups : u32,
    _pad0      : u32,
}

@group(0) @binding(0) var<storage, read>       input_a    : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       input_b    : array<vec4<f16>>;
@group(0) @binding(2) var<uniform>             params     : Params;
@group(0) @binding(3) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.out_groups) { return; }

    let out_idx = oy * params.out_w * params.out_groups + ox * params.out_groups + c;

    if (c < params.a_groups) {
        let IH = params.in_h;
        let IW = params.in_w;
        let AG = params.a_groups;

        let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
        let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

        let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
        let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
        let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
        let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

        let wx = src_x - floor(src_x);
        let wy = src_y - floor(src_y);

        let tl = vec4<f32>(input_a[y0 * IW * AG + x0 * AG + c]);
        let tr = vec4<f32>(input_a[y0 * IW * AG + x1 * AG + c]);
        let bl = vec4<f32>(input_a[y1 * IW * AG + x0 * AG + c]);
        let br = vec4<f32>(input_a[y1 * IW * AG + x1 * AG + c]);

        let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
                   +        wy  * ((1.0 - wx) * bl + wx * br);
        output_buf[out_idx] = vec4<f16>(result);
    } else {
        let c_b = c - params.a_groups;
        output_buf[out_idx] = input_b[oy * params.out_w * params.b_groups + ox * params.b_groups + c_b];
    }
}
`;var pe=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?Nt:Vt;let i=e.c/4,o=r.c/4,s=i+o;this.output=t.tensor(n.outH,n.outW,e.c+r.c),this.inputs=[e,r],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n.outH,n.outW,i,o,s,0])),this.defaultSetup(),this.dispatch=[Math.ceil(n.outW/8),Math.ceil(n.outH/8),s];}};var $t=`// Bilinear upsample + 1\xD71 pointwise conv fused.
// For each output pixel, bilinearly samples the small input for each in_group,
// immediately applies the 1\xD71 conv weights, and writes the activated result.
// Eliminates the intermediate full-resolution upsample buffer.

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    in_groups  : u32,
    out_groups : u32,
    activation : u32,
    _pad0      : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f32>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f32>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let og = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || og >= params.out_groups) { return; }

    let IH = params.in_h;
    let IW = params.in_w;
    let IG = params.in_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    var result = bias_buf[og];

    for (var ig = 0u; ig < IG; ig++) {
        let tl = input_buf[y0 * IW * IG + x0 * IG + ig];
        let tr = input_buf[y0 * IW * IG + x1 * IG + ig];
        let bl = input_buf[y1 * IW * IG + x0 * IG + ig];
        let br = input_buf[y1 * IW * IG + x1 * IG + ig];

        let sampled = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
                    +        wy  * ((1.0 - wx) * bl + wx * br);

        result += weight_buf[og * IG + ig] * sampled;
    }

    if (params.activation == 1u) {
        result = clamp(result, vec4<f32>(0.0), vec4<f32>(6.0));
    } else if (params.activation == 2u) {
        result = result * clamp(result + 3.0, vec4<f32>(0.0), vec4<f32>(6.0)) / 6.0;
    }

    output_buf[oy * params.out_w * params.out_groups + ox * params.out_groups + og] = result;
}
`;var jt=`enable f16;

// Bilinear upsample + 1\xD71 pointwise conv fused \u2014 full f16 variant.
// Bilinear weights and intermediate blends computed in f32; conv accumulation in f16.

struct Params {
    in_h       : u32,
    in_w       : u32,
    out_h      : u32,
    out_w      : u32,
    in_groups  : u32,
    out_groups : u32,
    activation : u32,
    _pad0      : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<storage, read>       weight_buf : array<mat4x4<f16>>;
@group(0) @binding(2) var<storage, read>       bias_buf   : array<vec4<f16>>;
@group(0) @binding(3) var<uniform>             params     : Params;
@group(0) @binding(4) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let og = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || og >= params.out_groups) { return; }

    let IH = params.in_h;
    let IW = params.in_w;
    let IG = params.in_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    var result = bias_buf[og];

    for (var ig = 0u; ig < IG; ig++) {
        let tl = vec4<f32>(input_buf[y0 * IW * IG + x0 * IG + ig]);
        let tr = vec4<f32>(input_buf[y0 * IW * IG + x1 * IG + ig]);
        let bl = vec4<f32>(input_buf[y1 * IW * IG + x0 * IG + ig]);
        let br = vec4<f32>(input_buf[y1 * IW * IG + x1 * IG + ig]);

        let sampled = vec4<f16>((1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
                              +        wy  * ((1.0 - wx) * bl + wx * br));

        result += weight_buf[og * IG + ig] * sampled;
    }

    if (params.activation == 1u) {
        result = clamp(result, vec4<f16>(0.0h), vec4<f16>(6.0h));
    } else if (params.activation == 2u) {
        result = result * clamp(result + 3.0h, vec4<f16>(0.0h), vec4<f16>(6.0h)) / 6.0h;
    }

    output_buf[oy * params.out_w * params.out_groups + ox * params.out_groups + og] = result;
}
`;var le=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?jt:$t;let i=e.c/4,o=n.outChannels/4;this.output=t.tensor(n.outH,n.outW,n.outChannels),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(d(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n.outH,n.outW,i,o,n.activation==="relu6"?1:0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(n.outW/8),Math.ceil(n.outH/8),o];}};var qt=`// Bilinear upsample + sigmoid fused.
// Identical to bilinear_upsample.wgsl except sigmoid is applied at write time.
// Eliminates the intermediate full-resolution buffer and the separate sigmoid dispatch.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f32>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = input_buf[y0 * IW * C + x0 * C + c];
    let tr = input_buf[y0 * IW * C + x1 * C + c];
    let bl = input_buf[y1 * IW * C + x0 * C + c];
    let br = input_buf[y1 * IW * C + x1 * C + c];

    let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
               +        wy  * ((1.0 - wx) * bl + wx * br);

    output_buf[oy * params.out_w * C + ox * C + c] = 1.0 / (1.0 + exp(-result));
}
`;var Xt=`enable f16;

// Bilinear upsample + sigmoid fused \u2014 full f16 variant.
// Interpolation computed in f32 for accuracy; sigmoid and result cast to f16.

struct Params {
    in_h           : u32,
    in_w           : u32,
    out_h          : u32,
    out_w          : u32,
    channel_groups : u32,
    _pad0          : u32,
    _pad1          : u32,
    _pad2          : u32,
}

@group(0) @binding(0) var<storage, read>       input_buf  : array<vec4<f16>>;
@group(0) @binding(1) var<uniform>             params     : Params;
@group(0) @binding(2) var<storage, read_write> output_buf : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let ox = gid.x;
    let oy = gid.y;
    let c  = gid.z;

    if (ox >= params.out_w || oy >= params.out_h || c >= params.channel_groups) {
        return;
    }

    let IH = params.in_h;
    let IW = params.in_w;
    let C  = params.channel_groups;

    let src_x = (f32(ox) + 0.5) * (f32(IW) / f32(params.out_w)) - 0.5;
    let src_y = (f32(oy) + 0.5) * (f32(IH) / f32(params.out_h)) - 0.5;

    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(IW) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(IW) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(IH) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(IH) - 1));

    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = vec4<f32>(input_buf[y0 * IW * C + x0 * C + c]);
    let tr = vec4<f32>(input_buf[y0 * IW * C + x1 * C + c]);
    let bl = vec4<f32>(input_buf[y1 * IW * C + x0 * C + c]);
    let br = vec4<f32>(input_buf[y1 * IW * C + x1 * C + c]);

    let result = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
               +        wy  * ((1.0 - wx) * bl + wx * br);

    output_buf[oy * params.out_w * C + ox * C + c] = vec4<f16>(1.0 / (1.0 + exp(-result)));
}
`;var ce=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?Xt:qt;let n=e.c/4;this.output=t.tensor(r.outH,r.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,r.outH,r.outW,n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r.outW/8),Math.ceil(r.outH/8),n];}};var Kt=`// Composite an RGBA image over a solid background, gated by a 1-ch alpha.
// Fragment writes the canvas's swapchain texture (premultiplied output).
//
// Caller invariants (matched in CompositeSolidWebGPU):
//   - image and alpha are NHWC vec4 storage buffers, same h \xD7 w
//   - canvas.width === image.w, canvas.height === image.h (no resampling)

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width:    u32,           // image width in pixels (= canvas width)
    _pad0:    u32,
    _pad1:    u32,
    _pad2:    u32,
    bgColor:  vec4<f32>,     // .rgb used; .a ignored
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f32>>;
@group(0) @binding(2) var<uniform>       params: Params;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;

    let fg = image[i].rgb;
    let a  = alpha[i].r;
    let rgb = fg * a + params.bgColor.rgb * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
`;var Yt=`enable f16;

// Composite an RGBA image over a solid background, gated by a 1-ch alpha.
// f16 variant: image and alpha are stored as f16; values promote to f32 on
// read and the fragment writes f32 to the canvas swapchain (color attachment
// format is the swapchain's preferred format, always f32-equivalent).
//
// Caller invariants (matched in CompositeSolidWebGPU):
//   - image and alpha are NHWC vec4 storage buffers, same h \xD7 w
//   - canvas.width === image.w, canvas.height === image.h (no resampling)

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width:    u32,
    _pad0:    u32,
    _pad1:    u32,
    _pad2:    u32,
    bgColor:  vec4<f32>,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f16>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f16>>;
@group(0) @binding(2) var<uniform>       params: Params;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;

    let fg = vec3<f32>(image[i].rgb);
    let a  = f32(alpha[i].r);
    let rgb = fg * a + params.bgColor.rgb * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
`;var de=class{constructor(t,e,r,n){this.backend=t;if(e.h!==r.h||e.w!==r.w)throw new Error(`CompositeSolid: image (${e.h}\xD7${e.w}) and alpha (${r.h}\xD7${r.w}) must match. Run the upscaler first.`);let i=t.device;this.uniformBuffer=i.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let o=new ArrayBuffer(32);new Uint32Array(o,0,1)[0]=e.w,new Float32Array(o,16,4).set([n[0],n[1],n[2],0]),i.queue.writeBuffer(this.uniformBuffer,0,o);let s=t.dtype==="f16"?Yt:Kt,u=i.createShaderModule({code:s});this.pipeline=i.createRenderPipeline({layout:"auto",vertex:{module:u,entryPoint:"vs"},fragment:{module:u,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=i.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.buffer}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}}]});}backend;pipeline;bindGroup;uniformBuffer;outputView=null;setOutput(t){this.outputView=t.createView();}run(){if(!this.outputView)throw new Error("CompositeSolidWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),e=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.draw(6),e.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null;}};var Jt=`// Like composite_solid but bg is an NHWC vec4 storage buffer (e.g. virtual
// background image, or a blurred copy of the input).

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width: u32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f32>>;
@group(0) @binding(2) var<uniform>       params: Params;
@group(0) @binding(3) var<storage, read> bg:     array<vec4<f32>>;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;

    let fg  = image[i].rgb;
    let a   = alpha[i].r;
    let bgc = bg[i].rgb;
    let rgb = fg * a + bgc * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
`;var Qt=`enable f16;

// Like composite_solid_f16 but bg is an NHWC vec4<f16> storage buffer (e.g. a
// virtual background image, or a blurred copy of the input).

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width: u32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f16>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f16>>;
@group(0) @binding(2) var<uniform>       params: Params;
@group(0) @binding(3) var<storage, read> bg:     array<vec4<f16>>;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;

    let fg  = vec3<f32>(image[i].rgb);
    let a   = f32(alpha[i].r);
    let bgc = vec3<f32>(bg[i].rgb);
    let rgb = fg * a + bgc * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
`;var fe=class{constructor(t,e,r,n){this.backend=t;if(e.h!==r.h||e.w!==r.w||e.h!==n.h||e.w!==n.w)throw new Error(`CompositeImage: image (${e.h}\xD7${e.w}), alpha (${r.h}\xD7${r.w}), and bg (${n.h}\xD7${n.w}) must all match. Run upscaler / resizer first.`);let i=t.device;this.uniformBuffer=i.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let o=new ArrayBuffer(16);new Uint32Array(o,0,1)[0]=e.w,i.queue.writeBuffer(this.uniformBuffer,0,o);let s=t.dtype==="f16"?Qt:Jt,u=i.createShaderModule({code:s});this.pipeline=i.createRenderPipeline({layout:"auto",vertex:{module:u,entryPoint:"vs"},fragment:{module:u,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=i.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.buffer}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:n.buffer}}]});}backend;pipeline;bindGroup;uniformBuffer;outputView=null;setOutput(t){this.outputView=t.createView();}run(){if(!this.outputView)throw new Error("CompositeImageWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),e=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.draw(6),e.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null;}};var Zt=`// Like composite_image but bg is sampled bilinearly \u2014 bg may be smaller than
// (image, alpha). Used by CompositorBlur to skip the final full-res upsample
// in the blur pyramid and let this shader's own per-pixel scan do the
// expansion (the work is already happening here for the composite anyway).
//
// Layout invariant: image, alpha share output dims (canvas h \xD7 w); bg is
// at a smaller resolution (bg_h \xD7 bg_w). All NHWC vec4 storage buffers,
// channelGroups = 1 (RGB padded to vec4).

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    out_w: u32,
    out_h: u32,
    bg_w:  u32,
    bg_h:  u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f32>>;
@group(0) @binding(2) var<uniform>       params: Params;
@group(0) @binding(3) var<storage, read> bg:     array<vec4<f32>>;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.out_w + x;

    let fg = image[i].rgb;
    let a  = alpha[i].r;

    // Bilinear sample bg at the corresponding location. align_corners=False.
    let src_x = (f32(x) + 0.5) * (f32(params.bg_w) / f32(params.out_w)) - 0.5;
    let src_y = (f32(y) + 0.5) * (f32(params.bg_h) / f32(params.out_h)) - 0.5;
    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(params.bg_w) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(params.bg_w) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(params.bg_h) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(params.bg_h) - 1));
    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = bg[y0 * params.bg_w + x0].rgb;
    let tr = bg[y0 * params.bg_w + x1].rgb;
    let bl = bg[y1 * params.bg_w + x0].rgb;
    let br = bg[y1 * params.bg_w + x1].rgb;
    let bgc = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
            +        wy  * ((1.0 - wx) * bl + wx * br);

    let rgb = fg * a + bgc * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
`;var er=`enable f16;

// f16 storage variant of composite_image_bilinear. bg is at a smaller
// resolution and is bilinearly sampled to match (image, alpha) at full res.
// Computation in f32; storage in f16.

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    out_w: u32,
    out_h: u32,
    bg_w:  u32,
    bg_h:  u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f16>>;
@group(0) @binding(1) var<storage, read> alpha:  array<vec4<f16>>;
@group(0) @binding(2) var<uniform>       params: Params;
@group(0) @binding(3) var<storage, read> bg:     array<vec4<f16>>;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.out_w + x;

    let fg = vec3<f32>(image[i].rgb);
    let a  = f32(alpha[i].r);

    let src_x = (f32(x) + 0.5) * (f32(params.bg_w) / f32(params.out_w)) - 0.5;
    let src_y = (f32(y) + 0.5) * (f32(params.bg_h) / f32(params.out_h)) - 0.5;
    let x0 = u32(clamp(i32(floor(src_x)),     0, i32(params.bg_w) - 1));
    let x1 = u32(clamp(i32(floor(src_x)) + 1, 0, i32(params.bg_w) - 1));
    let y0 = u32(clamp(i32(floor(src_y)),     0, i32(params.bg_h) - 1));
    let y1 = u32(clamp(i32(floor(src_y)) + 1, 0, i32(params.bg_h) - 1));
    let wx = src_x - floor(src_x);
    let wy = src_y - floor(src_y);

    let tl = vec3<f32>(bg[y0 * params.bg_w + x0].rgb);
    let tr = vec3<f32>(bg[y0 * params.bg_w + x1].rgb);
    let bl = vec3<f32>(bg[y1 * params.bg_w + x0].rgb);
    let br = vec3<f32>(bg[y1 * params.bg_w + x1].rgb);
    let bgc = (1.0 - wy) * ((1.0 - wx) * tl + wx * tr)
            +        wy  * ((1.0 - wx) * bl + wx * br);

    let rgb = fg * a + bgc * (1.0 - a);
    return vec4<f32>(rgb, 1.0);
}
`;var he=class{constructor(t,e,r,n){this.backend=t;if(e.h!==r.h||e.w!==r.w)throw new Error(`CompositeImageBilinear: image (${e.h}\xD7${e.w}) and alpha (${r.h}\xD7${r.w}) must match.`);let i=t.device;this.uniformBuffer=i.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let o=new ArrayBuffer(16),s=new Uint32Array(o);s[0]=e.w,s[1]=e.h,s[2]=n.w,s[3]=n.h,i.queue.writeBuffer(this.uniformBuffer,0,o);let u=t.dtype==="f16"?er:Zt,l=i.createShaderModule({code:u});this.pipeline=i.createRenderPipeline({layout:"auto",vertex:{module:l,entryPoint:"vs"},fragment:{module:l,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=i.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.buffer}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:n.buffer}}]});}backend;pipeline;bindGroup;uniformBuffer;outputView=null;setOutput(t){this.outputView=t.createView();}run(){if(!this.outputView)throw new Error("CompositeImageBilinearWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),e=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.draw(6),e.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null;}};var tr=`// Passthrough "compositor" \u2014 writes the image directly to the canvas
// swapchain texture with no alpha math and no background. Used by RenderOp
// when the renderer is in disabled state, so the output canvas reflects
// the unmodified input frame instead of a stale matted result.
//
// Caller invariants (matched in CompositePassthroughWebGPU):
//   - image is an NHWC vec4 storage buffer
//   - canvas.width === image.w, canvas.height === image.h (no resampling)

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width: u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f32>>;
@group(0) @binding(1) var<uniform>       params: Params;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;
    return vec4<f32>(image[i].rgb, 1.0);
}
`;var rr=`enable f16;

// Passthrough "compositor" \u2014 f16 variant. Image is stored as f16; values
// promote to f32 on read and the fragment writes f32 to the canvas
// swapchain (color attachment is the swapchain's preferred f32-equivalent
// format). See composite_passthrough.wgsl for the f32 version.

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOut {
    let verts = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
        vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0),
    );
    var out: VertexOut;
    out.pos = vec4<f32>(verts[vi], 0.0, 1.0);
    return out;
}

struct Params {
    width: u32,
};

@group(0) @binding(0) var<storage, read> image:  array<vec4<f16>>;
@group(0) @binding(1) var<uniform>       params: Params;

@fragment
fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    let x = u32(in.pos.x);
    let y = u32(in.pos.y);
    let i = y * params.width + x;
    return vec4<f32>(vec3<f32>(image[i].rgb), 1.0);
}
`;var ge=class{constructor(t,e){this.backend=t;let r=t.device;this.uniformBuffer=r.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(16);new Uint32Array(n,0,1)[0]=e.w,r.queue.writeBuffer(this.uniformBuffer,0,n);let i=t.dtype==="f16"?rr:tr,o=r.createShaderModule({code:i});this.pipeline=r.createRenderPipeline({layout:"auto",vertex:{module:o,entryPoint:"vs"},fragment:{module:o,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=r.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.buffer}},{binding:1,resource:{buffer:this.uniformBuffer}}]});}backend;pipeline;bindGroup;uniformBuffer;outputView=null;setOutput(t){this.outputView=t.createView();}run(){if(!this.outputView)throw new Error("CompositePassthroughWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),e=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.draw(6),e.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null;}};var nr=`// Input op \u2014 sample a regular 2D source texture (RGBA8 unorm) into the NHWC
// vec4<f32> output buffer at the target resolution. Used for ImageBitmap
// sources, which are uploaded into a persistent staging texture via
// copyExternalImageToTexture before each dispatch.

struct Params {
    out_w : u32,
    out_h : u32,
    _pad0 : u32,
    _pad1 : u32,
}

@group(0) @binding(0) var                       src_tex     : texture_2d<f32>;
@group(0) @binding(1) var                       src_sampler : sampler;
@group(0) @binding(2) var<uniform>              params      : Params;
@group(0) @binding(3) var<storage, read_write>  output_buf  : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.out_w || y >= params.out_h) { return; }

    let uv = vec2<f32>(
        (f32(x) + 0.5) / f32(params.out_w),
        (f32(y) + 0.5) / f32(params.out_h),
    );
    let rgba = textureSampleLevel(src_tex, src_sampler, uv, 0.0);
    output_buf[y * params.out_w + x] = rgba;
}
`;var ar=`enable f16;

// Input op \u2014 f16 storage variant. Source is sampled as vec4<f32>; only the
// store is demoted to vec4<f16>.

struct Params {
    out_w : u32,
    out_h : u32,
    _pad0 : u32,
    _pad1 : u32,
}

@group(0) @binding(0) var                       src_tex     : texture_2d<f32>;
@group(0) @binding(1) var                       src_sampler : sampler;
@group(0) @binding(2) var<uniform>              params      : Params;
@group(0) @binding(3) var<storage, read_write>  output_buf  : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.out_w || y >= params.out_h) { return; }

    let uv = vec2<f32>(
        (f32(x) + 0.5) / f32(params.out_w),
        (f32(y) + 0.5) / f32(params.out_h),
    );
    let rgba = textureSampleLevel(src_tex, src_sampler, uv, 0.0);
    output_buf[y * params.out_w + x] = vec4<f16>(rgba);
}
`;var ir=`// Input op \u2014 sample a GPUExternalTexture (zero-copy VideoFrame import) into
// the NHWC vec4<f32> output buffer at the target resolution. Used when the
// caller passes a VideoFrame to setSource(); requires importExternalTexture
// to be called in the same task as the dispatch (the texture is invalidated
// after the current task completes).

struct Params {
    out_w : u32,
    out_h : u32,
    _pad0 : u32,
    _pad1 : u32,
}

@group(0) @binding(0) var                       src_tex     : texture_external;
@group(0) @binding(1) var                       src_sampler : sampler;
@group(0) @binding(2) var<uniform>              params      : Params;
@group(0) @binding(3) var<storage, read_write>  output_buf  : array<vec4<f32>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.out_w || y >= params.out_h) { return; }

    let uv = vec2<f32>(
        (f32(x) + 0.5) / f32(params.out_w),
        (f32(y) + 0.5) / f32(params.out_h),
    );
    let rgba = textureSampleBaseClampToEdge(src_tex, src_sampler, uv);
    output_buf[y * params.out_w + x] = rgba;
}
`;var or=`enable f16;

// Input op \u2014 texture_external + f16 storage. Sample in f32, store as f16.

struct Params {
    out_w : u32,
    out_h : u32,
    _pad0 : u32,
    _pad1 : u32,
}

@group(0) @binding(0) var                       src_tex     : texture_external;
@group(0) @binding(1) var                       src_sampler : sampler;
@group(0) @binding(2) var<uniform>              params      : Params;
@group(0) @binding(3) var<storage, read_write>  output_buf  : array<vec4<f16>>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    if (x >= params.out_w || y >= params.out_h) { return; }

    let uv = vec2<f32>(
        (f32(x) + 0.5) / f32(params.out_w),
        (f32(y) + 0.5) / f32(params.out_h),
    );
    let rgba = textureSampleBaseClampToEdge(src_tex, src_sampler, uv);
    output_buf[y * params.out_w + x] = vec4<f16>(rgba);
}
`;var Kn=a=>typeof VideoFrame<"u"&&a instanceof VideoFrame,me=class{output;device;dtype;sampler;uniformBuffer;dispatch;pipeline2d=null;pipelineExternal=null;stagingTex=null;stagingW=0;stagingH=0;source=null;constructor(t,e,r){this.device=t.device,this.dtype=t.dtype,this.output=t.tensor(e,r,4),this.sampler=this.device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.uniformBuffer=this.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(16);new Uint32Array(n,0,2).set([r,e]),this.device.queue.writeBuffer(this.uniformBuffer,0,n),this.dispatch=[Math.ceil(r/8),Math.ceil(e/8),1],this.pipeline2d=this.buildPipeline(this.dtype==="f16"?ar:nr);}setSource(t){this.source=t;}run(){if(!this.source)throw new Error("InputWebGPU.run() called before setSource()");Kn(this.source)?this.runExternal(this.source):this.run2d(this.source);}run2d(t){this.ensureStagingTexture(t.width,t.height),this.device.queue.copyExternalImageToTexture({source:t,flipY:false},{texture:this.stagingTex},[t.width,t.height]);let e=this.device.createBindGroup({layout:this.pipeline2d.getBindGroupLayout(0),entries:[{binding:0,resource:this.stagingTex.createView()},{binding:1,resource:this.sampler},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.output.buffer}}]});this.dispatchOnce(this.pipeline2d,e);}runExternal(t){this.pipelineExternal||(this.pipelineExternal=this.buildPipeline(this.dtype==="f16"?or:ir));let e=this.device.importExternalTexture({source:t}),r=this.device.createBindGroup({layout:this.pipelineExternal.getBindGroupLayout(0),entries:[{binding:0,resource:e},{binding:1,resource:this.sampler},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.output.buffer}}]});this.dispatchOnce(this.pipelineExternal,r);}ensureStagingTexture(t,e){this.stagingTex&&this.stagingW===t&&this.stagingH===e||(this.stagingTex?.destroy(),this.stagingTex=this.device.createTexture({size:[t,e,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),this.stagingW=t,this.stagingH=e);}buildPipeline(t){let e=this.device.createShaderModule({code:t});return this.device.createComputePipeline({layout:"auto",compute:{module:e,entryPoint:"main"}})}dispatchOnce(t,e){let r=this.device.createCommandEncoder(),n=r.beginComputePass();n.setPipeline(t),n.setBindGroup(0,e),n.dispatchWorkgroups(...this.dispatch),n.end(),this.device.queue.submit([r.finish()]);}};var Yn=navigator.gpu?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST:0,Ce=class a{constructor(t,e,r){this.device=t;this.canvas=e;this.dtype=r;this.bytesPerElement=r==="f16"?2:4;let n=e.getContext("webgpu");if(!n)throw new Error("Failed to get WebGPU context from canvas");this.canvasFormat=navigator.gpu.getPreferredCanvasFormat(),this.configureContext(n),this.canvasContext=n,this.contexts.set("main",n),this.ops={Conv2d:(i,o,s)=>new R(this,i,o,s),ConvTranspose2d:(i,o,s)=>new H(this,i,o,s),DepthwiseConv2d:(i,o,s)=>new L(this,i,o,s),Add:(i,o)=>new V(this,i,o),Sigmoid:i=>new N(this,i),Tanh:i=>new $(this,i),ElementwiseMul:(i,o)=>new j(this,i,o),Warp:(i,o,s)=>new q(this,i,o,s),Stabilize:(i,o,s,u,l)=>new X(this,i,o,s,u,l),BilinearUpsample:(i,o)=>new K(this,i,o),Crop:(i,o)=>new Y(this,i,o),BicubicUpsample:(i,o)=>new J(this,i,o),ChannelConcat:(i,o)=>new Q(this,i,o),Conv2dAdd:(i,o,s,u)=>new Z(this,i,o,s,u),ProjResidual:(i,o,s,u)=>new ee(this,i,o,s,u),ConcatConv2d:(i,o,s,u)=>new te(this,i,o,s,u),GatesFused:(i,o,s)=>new re(this,i,o,s),CandUpdateFused:(i,o,s,u,l)=>new ne(this,i,o,s,u,l),ConvExpand:(i,o)=>new ae(this,i,o),CatConv6to2:(i,o,s)=>new ie(this,i,o,s),DownAdapter:(i,o,s,u)=>new oe(this,i,o,s,u),UpFinal:(i,o,s)=>new se(this,i,o,s),UpFinalSkip:(i,o,s,u)=>new ue(this,i,o,s,u),UpsampleConcat:(i,o,s)=>new pe(this,i,o,s),UpsampleConv1x1:(i,o,s)=>new le(this,i,o,s),UpsampleSigmoid:(i,o)=>new ce(this,i,o),Input:(i,o)=>new me(this,i,o)},this.presenters={CompositeSolid:(i,o,s,u="main")=>{let l=new de(this,i,o,s);return {run:()=>{l.setOutput(this.getCurrentDisplayTexture(u)),l.run();}}},CompositeImage:(i,o,s,u="main")=>{let l=new fe(this,i,o,s);return {run:()=>{l.setOutput(this.getCurrentDisplayTexture(u)),l.run();}}},CompositeImageBilinear:(i,o,s,u="main")=>{let l=new he(this,i,o,s);return {run:()=>{l.setOutput(this.getCurrentDisplayTexture(u)),l.run();}}},CompositePassthrough:(i,o="main")=>{let s=new ge(this,i);return {run:()=>{s.setOutput(this.getCurrentDisplayTexture(o)),s.run();}}}};}device;canvas;dtype;ops;presenters;canvasContext;canvasFormat;bytesPerElement;contexts=new Map;configureContext(t){t.configure({device:this.device,format:this.canvasFormat,alphaMode:"premultiplied"});}attachCanvas(t,e){if(t==="main")throw new Error("attachCanvas: 'main' is reserved for the create() canvas");let r=e.getContext("webgpu");if(!r)throw new Error(`attachCanvas: failed to get WebGPU context for target '${t}'`);this.configureContext(r),this.contexts.set(t,r);}static async isAvailable(){return navigator.gpu?await navigator.gpu.requestAdapter()!==null:false}static async hasF16Support(){if(!navigator.gpu)return  false;let t=await navigator.gpu.requestAdapter();return t?t.features.has("shader-f16"):false}static async create(t){let e=t.dtype??"f32",r=t.device;if(r){if(e==="f16"&&!r.features.has("shader-f16"))throw new Error("WebGPU dtype='f16' requested but supplied device lacks `shader-f16`")}else {let n=await navigator.gpu.requestAdapter();if(!n)throw new Error("WebGPU adapter not available");if(e==="f16"&&!n.features.has("shader-f16"))throw new Error("WebGPU dtype='f16' requested but adapter lacks `shader-f16` feature");r=await n.requestDevice({requiredFeatures:e==="f16"?["shader-f16"]:[]});}return new a(r,t.canvas,e)}getCurrentDisplayTexture(t="main"){let e=this.contexts.get(t);if(!e)throw new Error(`getCurrentDisplayTexture: no canvas attached for target '${t}'`);return e.getCurrentTexture()}tensor(t,e,r,n){let o=t*e*r*this.bytesPerElement,s=this.device.createBuffer({size:o,usage:Yn,mappedAtCreation:n!==void 0});if(n!==void 0){let u=s.getMappedRange();this.writeView(u,n),s.unmap();}return {h:t,w:e,c:r,buffer:s}}upload(t){let r=t.length*this.bytesPerElement,n=this.device.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,mappedAtCreation:true});return this.writeView(n.getMappedRange(),t),n.unmap(),{buffer:n}}writeView(t,e){let r=this.dtype==="f16",n=e instanceof Uint16Array;if(r===n){r?new Uint16Array(t).set(e):new Float32Array(t).set(e);return}r?new Uint16Array(t).set(Ye(e)):new Float32Array(t).set(ke(e));}async readback(t){let e=this.device.createBuffer({size:t.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(t.buffer,0,e,0,t.buffer.size),this.device.queue.submit([r.finish()]),await e.mapAsync(GPUMapMode.READ);let n=e.getMappedRange(),i=this.dtype==="f16"?ke(new Uint16Array(n.slice(0))):new Float32Array(n.slice(0));return e.unmap(),e.destroy(),i}copyTensor(t,e){if(t.buffer.size!==e.buffer.size)throw new Error(`copyTensor: size mismatch (src ${t.buffer.size} vs dst ${e.buffer.size})`);let r=this.device.createCommandEncoder();r.copyBufferToBuffer(t.buffer,0,e.buffer,0,t.buffer.size),this.device.queue.submit([r.finish()]);}async sync(){await this.device.queue.onSubmittedWorkDone();}destroy(){this.device.destroy();}};export{we as EffectsPipeline,Ce as WebGPUBackend};