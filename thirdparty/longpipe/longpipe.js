var k=[{model:"xs",dtype:"f16",resolution:{w:384,h:216},skipFrames:2},{model:"small",dtype:"f16",resolution:{w:384,h:216},skipFrames:1},{model:"medium",dtype:"f16",resolution:{w:512,h:288},skipFrames:1},{model:"large",dtype:"f32",resolution:{w:640,h:360},skipFrames:0},{model:"xl",dtype:"f32",resolution:{w:1280,h:720},skipFrames:0}];var ve=false;function We(a){ve=a;}function w(a){let t=`[longpipe/${a}]`,e=((...r)=>{ve&&console.log(t,...r);});return e.warn=(...r)=>{ve&&console.warn(t,...r);},e}var W=w("adaptive"),lr=2e3,cr=1e4,dr=30,fr=20,hr=5e3,mr=.3,gr=15e3,G=class{constructor(t){this.opts=t;this.currentPresetIdx=k.findIndex(e=>e.model===t.initialModel),this.lastSwapAt=performance.now();}opts;timer=null;currentPresetIdx;lastSwapAt=0;overshootStart=0;headroomStart=0;start(){W(`started; backend=${this.opts.backendKind} initial=${this.opts.initialModel} idx=${this.currentPresetIdx}`),this.timer=setInterval(()=>{this.tick().catch(t=>W("tick failed:",t));},lr);}stop(){this.timer&&clearInterval(this.timer),this.timer=null;}async tick(){if(typeof document<"u"&&document.hidden)return;let t=performance.now();if(t-this.lastSwapAt<cr)return;let e=await this.opts.getStats();if(e.fps<fr?(this.overshootStart===0&&(this.overshootStart=t),t-this.overshootStart>=hr&&this.tryDowngrade(e.fps)):this.overshootStart=0,this.opts.backendKind==="webgpu"&&e.modelMs>0){let r=1e3/dr*mr;e.modelMs<r?(this.headroomStart===0&&(this.headroomStart=t),t-this.headroomStart>=gr&&this.tryUpgrade(e.modelMs,r)):this.headroomStart=0;}}tryDowngrade(t){if(this.currentPresetIdx<=0)return;let e=this.currentPresetIdx-1;W(`downgrade ${k[this.currentPresetIdx].model} \u2192 ${k[e].model} (fps=${t})`),this.swap(e);}tryUpgrade(t,e){if(this.currentPresetIdx>=k.length-1)return;let r=this.currentPresetIdx+1;W(`upgrade ${k[this.currentPresetIdx].model} \u2192 ${k[r].model} (modelMs=${t.toFixed(1)} < ${e.toFixed(1)})`),this.swap(r);}async swap(t){let e=k[t];this.lastSwapAt=performance.now(),this.overshootStart=0,this.headroomStart=0;try{let r=await this.opts.fetchWeights(e.model);await this.opts.swapPreset(e.model,r),this.currentPresetIdx=t,W(`swap to ${e.model} done`);}catch(r){W("swap failed:",r),this.opts.onError?.({message:`adaptive preset swap failed: ${r.message??String(r)}`,source:"adaptive",recoverable:true,cause:r});}}};async function Ie(a){let t,e=false;if(a instanceof HTMLVideoElement){if(t=a.currentSrc||a.src,!t)throw new Error("background video: HTMLVideoElement has no src")}else if(a instanceof Blob)t=URL.createObjectURL(a),e=true;else if(typeof a=="string")t=a;else throw new Error("background video: unsupported input shape");let r=document.createElement("video");r.crossOrigin="anonymous",r.muted=true,r.loop=true,r.playsInline=true,r.src=t,await new Promise((f,h)=>{r.addEventListener("loadeddata",()=>f(),{once:true}),r.addEventListener("error",()=>h(new Error(`background video: failed to load ${t}`)),{once:true});});try{await r.play();}catch(f){throw new Error(`background video: play() rejected \u2014 ${f.message}`)}let n=new MessageChannel,i=n.port1,o=n.port2,s=false,u=false;i.onmessage=()=>{u=false;},i.start?.();let l=r.requestVideoFrameCallback?.bind(r);if(l){let f=(h,g)=>{if(s)return;if(u){l(f);return}let x=null;try{x=new VideoFrame(r,{timestamp:g.mediaTime*1e6}),u=!0,i.postMessage({frame:x},[x]);}catch{u=false,x?.close();}l(f);};l(f);}else {let f=()=>{if(s)return;if(u){requestAnimationFrame(f);return}let h=null;try{h=new VideoFrame(r,{timestamp:performance.now()*1e3}),u=!0,i.postMessage({frame:h},[h]);}catch{u=false,h?.close();}requestAnimationFrame(f);};requestAnimationFrame(f);}return {port:o,transferList:[o],cleanup:()=>{s=true,i.onmessage=null,i.close(),r.pause(),r.removeAttribute("src"),r.load(),e&&URL.revokeObjectURL(t);}}}var _r=4,xe=8,Be=16;async function A(a){if(typeof a=="string")return a==="none"?{background:{kind:"none"}}:a==="blur"?{background:{kind:"blur",sigma:xe}}:{background:{kind:"image",bitmap:await Ee(a)}};if(a instanceof ImageBitmap)return {background:{kind:"image",bitmap:a}};if(typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement)return {background:{kind:"image",bitmap:await createImageBitmap(a)}};if(typeof HTMLVideoElement<"u"&&a instanceof HTMLVideoElement)return await Se(a);let t=a;if(t.color!==void 0)return {background:{kind:"color",rgb:br(t.color)}};if(t.blur!==void 0)return {background:{kind:"blur",sigma:vr(t.blur)}};if(t.image!==void 0)return {background:{kind:"image",bitmap:await xr(t.image)}};if(t.video!==void 0)return await Se(t.video);throw new Error(`background: unrecognized input shape \u2014 ${U(a)}`)}async function Se(a){let t;if(typeof a=="string")t=a;else if(typeof HTMLVideoElement<"u"&&a instanceof HTMLVideoElement)t=a;else if(a&&typeof a=="object"&&"data"in a&&"type"in a)t=a.data instanceof Blob?a.data:new Blob([a.data],{type:a.type});else throw new Error(`background.video: unrecognized shape \u2014 ${U(a)}`);let e=await Ie(t);return {background:{kind:"video",port:e.port},transferList:e.transferList,cleanup:e.cleanup}}function br(a){if(typeof a=="string"){let t=a.trim().replace(/^#/,"");if(/^[0-9a-fA-F]{6}$/.test(t))return [parseInt(t.slice(0,2),16)/255,parseInt(t.slice(2,4),16)/255,parseInt(t.slice(4,6),16)/255];if(/^[0-9a-fA-F]{3}$/.test(t))return [parseInt(t[0]+t[0],16)/255,parseInt(t[1]+t[1],16)/255,parseInt(t[2]+t[2],16)/255];throw new Error(`background.color: hex must be #rgb or #rrggbb, got ${U(a)}`)}if(!Array.isArray(a)||a.length!==3||!a.every(t=>typeof t=="number"&&Number.isFinite(t)&&t>=0&&t<=1))throw new Error(`background.color: expected hex string or [r, g, b] floats in [0, 1], got ${U(a)}`);return [a[0],a[1],a[2]]}function vr(a){if(a===true)return xe;if("sigma"in a){if(typeof a.sigma!="number"||!Number.isFinite(a.sigma)||a.sigma<0)throw new Error(`background.blur.sigma must be a non-negative number, got ${a.sigma}`);return a.sigma}if("strength"in a){let t=a.strength;if(typeof t=="number"){let e=Math.max(0,Math.min(1,t));return Be*e}if(t==="low")return _r;if(t==="medium")return xe;if(t==="high")return Be;throw new Error(`background.blur.strength must be 'low' | 'medium' | 'high' | number, got ${U(t)}`)}throw new Error(`background.blur: must be true, { strength }, or { sigma } \u2014 got ${U(a)}`)}async function xr(a){if(a instanceof ImageBitmap)return a;if(typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement)return createImageBitmap(a);if(typeof a=="string")return Ee(a);if(a&&typeof a=="object"&&"data"in a&&"type"in a){let t=a.data instanceof Blob?a.data:new Blob([a.data],{type:a.type});return createImageBitmap(t)}throw new Error(`background.image: unrecognized shape \u2014 ${U(a)}`)}async function Ee(a){let t=await fetch(a);if(!t.ok)throw new Error(`background: failed to load image from ${a} (HTTP ${t.status})`);let e=await t.blob();return createImageBitmap(e)}function U(a){return a===null?"null":typeof a!="object"?typeof a+"("+String(a)+")":`${a.constructor?.name??"Object"} ${JSON.stringify(a).slice(0,80)}`}function Fe(){return {input:"MediaStreamTrackProcessor"in self?"mstp":"rvfc-postmessage",output:"MediaStreamTrackGenerator"in self?"mstg":wr()?"transfer-capture":"bitmap-shuttle"}}var M=null;function wr(){return M!==null||(M=!/Firefox/.test(navigator.userAgent)),M}function Ge(a){return a==="denoise"?{mode:"denoise",denoise:{}}:typeof a=="object"?{mode:"denoise",denoise:a.denoise}:{mode:a}}function Ae(a,t,e,r){let n=[a];return e.mode==="passthrough"?n.push(...t.getAudioTracks()):e.mode==="denoise"&&r&&n.push(r),new MediaStream(n)}var I={rnnoise:{wasm:"rnnoise.wasm",weights:null,scaleIn:32768,scaleOut:30517578125e-15,needsSimd:false,exports:{malloc:"malloc",create:"rn_create",process:"rn_process"}},dfn:{wasm:"dfn.wasm",weights:"dfn_weights.pack",scaleIn:1,scaleOut:1,needsSimd:true,exports:{malloc:"df_lite_malloc",create:"df_lite_create",process:"df_lite_process",setBeta:"df_lite_set_beta",setGruLeak:"df_lite_set_gru_leak"}},dfnint8:{wasm:"dfn.wasm",weights:"dfn_weights_int8.pack",scaleIn:1,scaleOut:1,needsSimd:true,exports:{malloc:"df_lite_malloc",create:"df_lite_create_i8",process:"df_lite_process",setBeta:"df_lite_set_beta",setGruLeak:"df_lite_set_gru_leak"}}},yr={high:"dfn",mid:"dfnint8",low:"rnnoise"},kr=["high","mid","low"];function Pr(a){return kr.includes(a)}function Me(a){return Pr(a)?yr[a]:a}function Oe(a,t){return `${a.replace(/\/$/,"")}/${t}`}async function De(a){let t=await fetch(a);if(!t.ok)throw new Error(`audio asset fetch failed: ${t.status} ${a}`);return t.arrayBuffer()}async function ze(a,t){let e=I[a],[r,n]=await Promise.all([De(Oe(t,e.wasm)),e.weights?De(Oe(t,e.weights)):Promise.resolve(null)]);return {wasmBytes:r,weights:n}}function O(){try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,22,1,20,0,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11]))}catch{return  false}}var Cr=1.3,Tr=64,Ur=3,Wr=`
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
`;async function Re(a,t){if(!O())return "rnnoise";let e=`${a.replace(/\/$/,"")}/${I.dfn.wasm}`,r=null,n=null;try{r=URL.createObjectURL(new Blob([Wr],{type:"application/javascript"})),n=new Worker(r);let i=await new Promise((o,s)=>{n.onmessage=u=>o(u.data),n.onerror=u=>s(new Error(u.message||"probe worker error")),n.postMessage({wasmUrl:e,iters:Tr,rounds:Ur,budget:Cr});});if(i.error)throw new Error(i.error);return i.model??"rnnoise"}catch(i){return t?.(`audio tier probe failed (${i.message??String(i)}); using rnnoise`),"rnnoise"}finally{n?.terminate(),r&&URL.revokeObjectURL(r);}}var we='var b=Object.defineProperty;var y=(u,a,i)=>a in u?b(u,a,{enumerable:!0,configurable:!0,writable:!0,value:i}):u[a]=i;var r=(u,a,i)=>y(u,typeof a!="symbol"?a+"":a,i);var f={rnnoise:{wasm:"rnnoise.wasm",weights:null,scaleIn:32768,scaleOut:30517578125e-15,needsSimd:!1,exports:{malloc:"malloc",create:"rn_create",process:"rn_process"}},dfn:{wasm:"dfn.wasm",weights:"dfn_weights.pack",scaleIn:1,scaleOut:1,needsSimd:!0,exports:{malloc:"df_lite_malloc",create:"df_lite_create",process:"df_lite_process",setBeta:"df_lite_set_beta",setGruLeak:"df_lite_set_gru_leak"}},dfnint8:{wasm:"dfn.wasm",weights:"dfn_weights_int8.pack",scaleIn:1,scaleOut:1,needsSimd:!0,exports:{malloc:"df_lite_malloc",create:"df_lite_create_i8",process:"df_lite_process",setBeta:"df_lite_set_beta",setGruLeak:"df_lite_set_gru_leak"}}};var c=4096,m=class extends AudioWorkletProcessor{constructor(i){super();r(this,"cfg");r(this,"mem");r(this,"run");r(this,"state",0);r(this,"inPtr",0);r(this,"outPtr",0);r(this,"setBeta",null);r(this,"setGruLeak",null);r(this,"resample",!1);r(this,"rsPush",null);r(this,"inRs",0);r(this,"outRs",0);r(this,"rsDevInPtr",0);r(this,"rsOutPtr",0);r(this,"enabled");r(this,"model");r(this,"inAcc",new Float32Array(480));r(this,"inFill",0);r(this,"outRing",new Float32Array(4096));r(this,"outRead",0);r(this,"outWrite",0);r(this,"outCount",0);r(this,"primed",!1);r(this,"now");r(this,"times",new Float32Array(256));r(this,"tIdx",0);r(this,"hops",0);r(this,"_f32",null);let o=i.processorOptions;this.model=o.model,this.enabled=o.enabled,this.cfg=f[o.model];try{let t=this.instantiate(o.wasmBytes),e=n=>n?t[n]:void 0;this.mem=t.memory;let s=t[this.cfg.exports.malloc];if(this.run=t[this.cfg.exports.process],this.inPtr=s(480*4),this.outPtr=s(480*4),o.weights?this.state=t[this.cfg.exports.create](this.upload(s,o.weights),o.weights.byteLength):this.state=t[this.cfg.exports.create](),this.setBeta=e(this.cfg.exports.setBeta)??null,this.setGruLeak=e(this.cfg.exports.setGruLeak)??null,this.setBeta&&(o.postFilterBeta??0)>0&&this.setBeta(this.state,o.postFilterBeta),this.setGruLeak&&(o.gruLeak??1)<1&&this.setGruLeak(this.state,o.gruLeak),sampleRate!==48e3){let n=t.df_resampler_create;this.rsPush=t.df_resampler_push??null,n&&this.rsPush?(this.resample=!0,this.inRs=n(sampleRate,48e3),this.outRs=n(48e3,sampleRate),this.rsDevInPtr=s(256*4),this.rsOutPtr=s(c*4)):this.post({type:"error",message:`${o.model} can\'t resample ${sampleRate}\\u219248000 Hz; needs a 48 kHz AudioContext`})}}catch(t){let e=t;this.post({type:"error",message:`denoise init failed: ${e.message??String(t)}${e.stack?`\n`+e.stack:""}`})}this.now=typeof performance<"u"&&performance.now?()=>performance.now():null,this.port.onmessage=t=>{let e=t.data;e.type==="enabled"?this.enabled=e.value:e.type==="config"&&(this.setBeta&&e.postFilterBeta!=null&&this.setBeta(this.state,e.postFilterBeta),this.setGruLeak&&e.gruLeak!=null&&this.setGruLeak(this.state,e.gruLeak))},this.post({type:"ready"})}instantiate(i){var e;let o=new WebAssembly.Module(i),t={};for(let s of WebAssembly.Module.imports(o))t[e=s.module]??(t[e]={}),s.kind==="function"?t[s.module][s.name]=()=>0:s.kind==="memory"?t[s.module][s.name]=new WebAssembly.Memory({initial:256}):s.kind==="table"?t[s.module][s.name]=new WebAssembly.Table({initial:0,element:"anyfunc"}):s.kind==="global"&&(t[s.module][s.name]=new WebAssembly.Global({value:"i32",mutable:!1},0));return new WebAssembly.Instance(o,t).exports}upload(i,o){let t=new Uint8Array(o),e=i(t.length);return new Uint8Array(this.mem.buffer).set(t,e),e}heap(){return(!this._f32||this._f32.buffer!==this.mem.buffer)&&(this._f32=new Float32Array(this.mem.buffer)),this._f32}post(i){this.port.postMessage(i)}pushOut(i){this.outRing[this.outWrite]=i,this.outWrite=(this.outWrite+1)%this.outRing.length,this.outCount++}feed48k(i,o){for(let t=0;t<o;t++)this.inAcc[this.inFill++]=i[t],this.inFill===480&&(this.runHop(),this.inFill=0)}runHop(){let i=this.heap(),o=this.inPtr>>2;for(let e=0;e<480;e++)i[o+e]=this.inAcc[e]*this.cfg.scaleIn;let t=this.now?this.now():0;if(this.run(this.state,this.inPtr,this.outPtr),this.now&&(this.times[this.tIdx=this.tIdx+1&255]=this.now()-t),this.resample&&this.rsPush){let e=this.rsPush(this.outRs,this.outPtr,480,this.rsOutPtr,c);i=this.heap();let s=this.rsOutPtr>>2;for(let n=0;n<e;n++)this.pushOut(i[s+n])}else{let e=this.outPtr>>2;for(let s=0;s<480;s++)this.pushOut(i[e+s]*this.cfg.scaleOut)}++this.hops>=50&&(this.reportStats(),this.hops=0)}reportStats(){let i=Array.from(this.times).filter(e=>e>0).sort((e,s)=>e-s),o=e=>i.length?i[Math.min(i.length-1,Math.floor(e*i.length))]:null,t={model:this.model,p50Ms:this.now?o(.5):null,p95Ms:this.now?o(.95):null,latencyMs:this.outCount/sampleRate*1e3,active:this.enabled&&this.state!==0,sampleRate};this.post({type:"stats",stats:t})}process(i,o){let t=i[0]?.[0],e=o[0]?.[0];if(!e)return!0;let s=e.length;if(!t||!this.enabled||this.state===0)return t&&!this.enabled?e.set(t):e.fill(0),!0;if(this.resample&&this.rsPush){let n=this.heap(),g=this.rsDevInPtr>>2;for(let h=0;h<s;h++)n[g+h]=t[h];let d=this.rsPush(this.inRs,this.rsDevInPtr,s,this.rsOutPtr,c);n=this.heap(),this.feed48k(n.subarray(this.rsOutPtr>>2,(this.rsOutPtr>>2)+d),d)}else this.feed48k(t,s);if(!this.primed)if(this.outCount>=480)this.primed=!0;else return e.fill(0),!0;if(this.outCount>=s)for(let n=0;n<s;n++)e[n]=this.outRing[this.outRead],this.outRead=(this.outRead+1)%this.outRing.length,this.outCount--;else e.fill(0);return!0}};registerProcessor("denoise",m);\n';var Br=.03,Sr=.995,D=class{constructor(t,e){this.opts=e;this.ctx=new AudioContext({sampleRate:48e3}),this.source=this.ctx.createMediaStreamSource(new MediaStream([t])),this.dest=this.ctx.createMediaStreamDestination(),this.outputTrack=this.dest.stream.getAudioTracks()[0],this.source.connect(this.dest),this.ready=this.init().catch(r=>{this.opts.onError?.(`audio denoise init failed: ${r.message??String(r)}`);});}opts;outputTrack;ready;ctx;source;dest;node=null;model=null;latestStats=null;destroyed=false;resolveExplicit(){let t=Me(this.opts.model);return I[t].needsSimd&&!O()?(this.opts.onError?.(`${t} needs wasm SIMD; falling back to rnnoise`),"rnnoise"):t}async init(){let t=this.opts.model==="auto"?await Re(this.opts.weightsBaseUrl,this.opts.onError):this.resolveExplicit();this.model=t;let e=await ze(t,this.opts.weightsBaseUrl);if(await this.ctx.audioWorklet.addModule(Er()),this.destroyed)return;let r={model:t,wasmBytes:e.wasmBytes,weights:e.weights,enabled:this.opts.enabled??true,postFilterBeta:this.opts.postFilterBeta??Br,gruLeak:this.opts.gruLeak??Sr},n=new AudioWorkletNode(this.ctx,"denoise",{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1],processorOptions:r});n.port.onmessage=i=>{let o=i.data;o.type==="stats"?this.latestStats=o.stats:o.type==="error"?this.opts.onError?.(o.message):o.type==="ready"&&this.opts.onReady?.();},this.node=n,this.source.disconnect(this.dest),this.source.connect(n).connect(this.dest);}setEnabled(t){this.node?.port.postMessage({type:"enabled",value:t});}setConfig(t){this.node?.port.postMessage({type:"config",...t});}getStats(){return this.latestStats}destroy(){this.destroyed=true;try{this.node?.disconnect();}catch{}try{this.source.disconnect();}catch{}this.ctx.close();}};function Er(){return URL.createObjectURL(new Blob([we],{type:"application/javascript"}))}var Fr={init:6e4,startRender:6e4,setBackground:15e3,setEnabled:1e4,setTemporalMode:1e4,setPreset:3e4,getStats:1e4,destroy:5e3,attachPreview:15e3,setPreview:15e3,clearPreview:1e4},z=w("worker_controller");function R(a){let t=new Error(a.message);return t.pipelineError=a,t.pipelineReported=true,t}var H=class{worker;persistentListeners=new Map;pending=new Map;terminalError=null;terminated=false;constructor(t){this.worker=t,this.worker.addEventListener("message",this.handleMessage.bind(this)),this.worker.addEventListener("error",this.handleWorkerError.bind(this)),this.worker.addEventListener("messageerror",this.handleMessageError.bind(this)),z("constructed; worker listeners attached");}handleMessage(t){let e=t.data;if(!e||typeof e.request_id!="string"){this.handleFatal({message:"LongPipe worker returned a malformed message",source:"worker",code:"worker-message-error",recoverable:false});return}let r=e.request_id,n=this.persistentListeners.get(r);if(n){let o=e.res;if(r==="error"&&o&&!o.recoverable){this.handleFatal(o);return}n(o);return}let i=this.pending.get(r);if(z("msg received: request_id=",r,"pending?",!!i),!!i){if(clearTimeout(i.timer),this.pending.delete(r),"error"in e){i.reject(R(e.error)),this.emitError(e.error);return}i.resolve(e.res);}}handleWorkerError(t){this.handleFatal({message:t.message||"LongPipe worker crashed",source:"worker",code:"worker-crashed",recoverable:false});}handleMessageError(){this.handleFatal({message:"LongPipe worker message could not be deserialized",source:"worker",code:"worker-message-error",recoverable:false});}handleFatal(t){if(this.terminalError||this.terminated)return;this.terminalError=t;let e=R(t);for(let r of this.pending.values())clearTimeout(r.timer),r.reject(e);this.pending.clear(),this.emitError(t);}emitError(t){let e=this.persistentListeners.get("error");e&&e(t);}addPersistentListener(t,e){this.persistentListeners.set(t,e),z("addPersistentListener:",t),t==="error"&&this.terminalError&&e(this.terminalError);}removePersistentListener(t){this.persistentListeners.delete(t);}sendMessage(t,e,r=[],n=Fr[t]){if(this.terminalError)return Promise.reject(R(this.terminalError));if(this.terminated)return Promise.reject(new Error("LongPipe worker is terminated"));let i=crypto.randomUUID();return z("sendMessage:",t,"request_id=",i,"transferables=",r.length),new Promise((o,s)=>{let u=setTimeout(()=>{let c={message:`LongPipe worker command timed out: ${t}`,source:"worker",code:"command-timeout",recoverable:false};this.handleFatal(c);},n);this.pending.set(i,{cmd:t,resolve:c=>o(c),reject:s,timer:u});let l={cmd:t,data:e,request_id:i};try{this.worker.postMessage(l,r);}catch(c){clearTimeout(u),this.pending.delete(i);let f={message:`${t} could not be sent to the LongPipe worker: ${c.message??String(c)}`,source:"worker",code:"command-failed",recoverable:false};s(R(f)),this.emitError(f);}})}terminate(){if(this.terminated)return;this.terminated=true;let t=new Error("LongPipe worker terminated");for(let e of this.pending.values())clearTimeout(e.timer),e.reject(t);this.pending.clear(),this.worker.terminate(),this.persistentListeners.clear();}};var He=w("input-postmessage/main");function Le(a){let t=document.createElement("video");t.srcObject=a,t.muted=true,t.autoplay=true,t.playsInline=true,t.play().catch(c=>{He.warn("video.play() rejected:",c);});let e=t.requestVideoFrameCallback?.bind(t);if(!e)throw new Error("setupPostMessageInput: requestVideoFrameCallback not supported on this browser");let r=new MessageChannel,n=r.port1,i=r.port2,o=false,s=false;n.onmessage=()=>{s=false;},n.start?.();let u=(c,f)=>{if(o)return;if(s){e(u);return}let h=null;try{h=new VideoFrame(t,{timestamp:f.mediaTime*1e6}),s=!0,n.postMessage({frame:h},[h]);}catch(g){s=false,h?.close(),He.warn("VideoFrame() failed; skipping frame:",g);}e(u);};return e(u),{port:i,transferList:[i],cleanup:()=>{o=true,n.onmessage=null,n.close(),t.srcObject=null,t.pause();}}}function Ve(a){let t=a.getVideoTracks();if(t.length===0)throw new Error("setupMstpInput: input MediaStream has no video tracks");let e=t[0],r=self.MediaStreamTrackProcessor;if(!r)throw new Error("setupMstpInput: MediaStreamTrackProcessor not supported on this browser");let i=new r({track:e}).readable;return {readable:i,transferList:[i],cleanup:()=>{i.cancel().catch(()=>{});}}}function Ne(a,t){switch(a){case "mstp":{let e=Ve(t);return {initFields:{inputReadable:e.readable},transferList:e.transferList,cleanup:e.cleanup}}case "rvfc-postmessage":{let e=Le(t);return {initFields:{inputPort:e.port},transferList:e.transferList,cleanup:e.cleanup}}}}var Gr=w("bitmap-shuttle/main"),Ar=30;function $e(a,t=Ar){let e=document.createElement("canvas");e.width=a.w,e.height=a.h;let r=e.getContext("bitmaprenderer");if(!r)throw new Error("setupBitmapShuttleOutput: bitmaprenderer context not available");let i=e.captureStream(t).getVideoTracks();if(i.length===0)throw new Error("setupBitmapShuttleOutput: captureStream produced no video tracks");let o=i[0],s=new MessageChannel,u=s.port1,l=s.port2,c=false,f=null,h=()=>{},g=3,x=0,y=null,pr=new Promise(C=>{y=C;});return u.onmessage=C=>{if(c){if(x++,x<g){C.data.bmp.close();return}h();}try{r.transferFromImageBitmap(C.data.bmp),y?.(),y=null;}catch(v){C.data.bmp.close(),Gr.warn("transferFromImageBitmap failed:",v);}},u.start(),{videoTrack:o,port:l,transferList:[l],startPassthrough:C=>{if(c)return;c=true;let v=document.createElement("video");v.srcObject=C,v.muted=true,v.playsInline=true,v.play().catch(()=>{}),f=v;let E="requestVideoFrameCallback"in v?T=>{v.requestVideoFrameCallback(T);}:T=>{requestAnimationFrame(T);},F=()=>{if(c){if(v.videoWidth===0){E(F);return}createImageBitmap(v,{resizeWidth:e.width,resizeHeight:e.height,resizeQuality:"medium"}).then(T=>{if(!c){T.close();return}try{r.transferFromImageBitmap(T);}catch{T.close();}E(F);}).catch(()=>{E(F);});}};E(F),h=()=>{c=false,f&&(f.srcObject=null,f.pause(),f=null);};},firstFrame:pr,cleanup:()=>{h(),u.onmessage=null,u.close(),o.stop();}}}function je(){let a=self.MediaStreamTrackGenerator;if(!a)throw new Error("setupMstgOutput: MediaStreamTrackGenerator not supported on this browser");let t=new a({kind:"video"}),e=t.writable;return {videoTrack:t,writable:e,transferList:[e],cleanup:()=>{e.abort().catch(()=>{}),t.stop();}}}function qe(a,t=30){let e=document.createElement("canvas");e.width=a.w,e.height=a.h;let n=e.captureStream(t).getVideoTracks();if(n.length===0)throw new Error("setupTransferCaptureOutput: captureStream produced no video tracks");let i=n[0],o=e.transferControlToOffscreen();return {videoTrack:i,canvas:o,transferList:[o],cleanup:()=>{i.stop();}}}function Xe(a,t){switch(a){case "mstg":{let e=je();return {videoTrack:e.videoTrack,initFields:{outputWritable:e.writable},transferList:e.transferList,cleanup:e.cleanup}}case "transfer-capture":{let e=qe(t);return {videoTrack:e.videoTrack,initFields:{outputCanvas:e.canvas},transferList:e.transferList,cleanup:e.cleanup}}case "bitmap-shuttle":{let e=$e(t);return {videoTrack:e.videoTrack,initFields:{outputPort:e.port},transferList:e.transferList,startPassthrough:e.startPassthrough,firstFrame:e.firstFrame,cleanup:e.cleanup}}}}var ye=`var Eo=Object.defineProperty;var Do=(s,e,r)=>e in s?Eo(s,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):s[e]=r;var a=(s,e,r)=>Do(s,typeof e!="symbol"?e+"":e,r);var yt=!1;function Ct(s){yt=s}function S(s){let e=\`[longpipe/\${s}]\`,r=((...t)=>{yt&&console.log(e,...t)});return r.warn=(...t)=>{yt&&console.warn(e,...t)},r}var wt=[{model:"xs",dtype:"f16",resolution:{w:384,h:216},skipFrames:2},{model:"small",dtype:"f16",resolution:{w:384,h:216},skipFrames:1},{model:"medium",dtype:"f16",resolution:{w:512,h:288},skipFrames:1},{model:"large",dtype:"f32",resolution:{w:640,h:360},skipFrames:0},{model:"xl",dtype:"f32",resolution:{w:1280,h:720},skipFrames:0}],Oo={fast:0,balanced:2,quality:4};function K(s){return s==="auto"?null:wt[Oo[s]]}var Y=class{constructor(e,r,t,i){a(this,"op");this.op=e.ops.BilinearUpsample(r,{outH:t,outW:i})}get output(){return this.op.output}run(){this.op.run()}};var Q=class{constructor(e,r,t,i){a(this,"op");this.op=e.ops.BicubicUpsample(r,{outH:t,outW:i})}get output(){return this.op.output}run(){this.op.run()}};var J=class{constructor(e,r,t,i,o="main"){a(this,"presenter");this.presenter=e.presenters.CompositeSolid(r,t,i,o)}run(){this.presenter.run()}};var Z=class{constructor(e,r,t,i,o="main"){a(this,"presenter");this.presenter=e.presenters.CompositeImage(r,t,i,o)}run(){this.presenter.run()}};var ee=class{constructor(e,r,t){a(this,"downs",[]);a(this,"ups",[]);let i=Io(t),o=r;for(let n=0;n<i;n++){let u=e.ops.BilinearUpsample(o,{outH:Math.max(1,Math.floor(o.h/2)),outW:Math.max(1,Math.floor(o.w/2))});this.downs.push(u),o=u.output}for(let n=i-1;n>=1;n--){let u=this.downs[n-1].output,p=e.ops.BilinearUpsample(o,{outH:u.h,outW:u.w});this.ups.push(p),o=p.output}}get output(){return this.ups.length>0?this.ups[this.ups.length-1].output:this.downs[0].output}run(){for(let e of this.downs)e.run();for(let e of this.ups)e.run()}};function Io(s){let e=Math.max(1,3*s);return Math.max(2,Math.min(6,Math.round(Math.log2(e))))}var Mo=.05,te=class{constructor(e,r,t,i,o="main"){a(this,"blur");a(this,"presenter");i<=Mo?(this.blur=null,this.presenter=e.presenters.CompositeImage(r,t,r,o)):(this.blur=new ee(e,r,i),this.presenter=e.presenters.CompositeImageBilinear(r,t,this.blur.output,o))}run(){this.blur?.run(),this.presenter.run()}};var re=class{constructor(e){a(this,"backend",e);a(this,"displayInput");a(this,"image");a(this,"network",null);a(this,"networkInput",null);a(this,"upscaler",null);a(this,"upscalerMode","bilinear");a(this,"bgConfig",{mode:"solid",color:[0,0,0]});a(this,"compositors",new Map);let r=e.canvas;this.displayInput=e.ops.Input(r.height,r.width),this.image=this.displayInput.output}attachNetwork(e,r,t){this.network=e,this.networkInput=r,this.upscalerMode=t.upscaler,this.bgConfig=t.background,this.upscaler=this.makeUpscaler(),this.compositors.clear()}hasNetwork(){return this.network!==null}setSource(e){this.networkInput?.setSource(e),this.displayInput.setSource(e)}setUpscaler(e){e!==this.upscalerMode&&(this.upscalerMode=e,this.network&&(this.upscaler=this.makeUpscaler(),this.compositors.clear()))}setBackground(e){this.bgConfig=e}run(){this.runModel(),this.runDisplay()}runDisplay(){this.refreshDisplayInput(),this.compositeMain(!1)}runPassthrough(){this.refreshDisplayInput(),this.compositeMain(!0)}compositeMain(e){this.compositeTo("main",e?{mode:"passthrough"}:this.bgConfig)}refreshDisplayInput(){this.displayInput.run()}compositeTo(e,r){let t=this.compositors.get(e);if(t&&Ao(t.spec,r)){t.handle.run();return}let i=this.buildCompositor(e,r);this.compositors.set(e,{spec:r,handle:i}),i.run()}applyAlpha(e){if(!this.network||!this.upscaler)throw new Error("RenderOp.applyAlpha called before attachNetwork");this.backend.copyTensor(e,this.network.output),this.upscaler.run()}runModel(){if(!this.network||!this.networkInput||!this.upscaler)throw new Error("RenderOp.runModel called before attachNetwork");this.networkInput.run(),this.network.run(),this.upscaler.run()}makeUpscaler(){if(!this.network)throw new Error("makeUpscaler called with no network");let{backend:e,network:r,image:t}=this;return this.upscalerMode==="bicubic"?new Q(e,r.output,t.h,t.w):new Y(e,r.output,t.h,t.w)}buildCompositor(e,r){let{backend:t,image:i}=this;if(r.mode==="passthrough")return t.presenters.CompositePassthrough(i,e);if(!this.upscaler)throw new Error("RenderOp.compositeTo (effect spec) called before attachNetwork");let o=this.upscaler.output;switch(r.mode){case"solid":return new J(t,i,o,r.color,e);case"image":return new Z(t,i,o,r.image,e);case"blur":return new te(t,i,o,r.sigma,e)}}};function Ao(s,e){if(s.mode!==e.mode)return!1;switch(e.mode){case"passthrough":return!0;case"solid":{let r=s.color;return r[0]===e.color[0]&&r[1]===e.color[1]&&r[2]===e.color[2]}case"blur":return s.sigma===e.sigma;case"image":return s.image===e.image}}var Ro=s=>typeof s=="object"&&s!==null&&typeof s.offset=="number"&&typeof s.length=="number";function Pt(s){if(s.byteLength<4)throw new Error("weights buffer too small");let e=new DataView(s,0,4).getUint32(0,!0),r=4+e;if(s.byteLength<r)throw new Error("weights buffer truncated (header)");let t=new Uint8Array(s,4,e),i=JSON.parse(new TextDecoder().decode(t)),o=i.__dtype__??"f32",n=o==="f16"?2:4;if(r%n!==0)throw new Error(\`payload not \${n}-byte aligned (header=\${e})\`);let u=(s.byteLength-r)/n,p=l=>{if(Ro(l)){let{offset:c,length:d}=l;if(c+d>u)throw new Error(\`array ref out of range: offset=\${c} length=\${d}\`);let _=r+c*n;return o==="f16"?new Uint16Array(s,_,d):new Float32Array(s,_,d)}if(Array.isArray(l))return l.map(p);if(typeof l=="object"&&l!==null){let c={};for(let d of Object.keys(l))d!=="__dtype__"&&(c[d]=p(l[d]));return c}return l};return p(i)}function Gt(s,e,r,t){let i=t.variant,o=i==="E"||i==="D",n=i==="D",u=e.h,p=e.w,l=[],c=null,d=null,_=0,b=0,g;if(o)if(n){if(!r.down2)throw new Error("variant D requires w.down2");_=Math.round(u/1.25),b=Math.round(p/1.25);let v=s.ops.Conv2d(e,r.down1,{outChannels:t.cHigh,kernel:3,stride:1,padding:1,activation:"relu"});l.push(v),d=v.output;let x=s.ops.BilinearUpsample(d,{outH:_,outW:b});l.push(x),c=x.output;let k=s.ops.DownAdapter(c,r.down2,r.adapter,{stride:2});l.push(k),g=k.output}else{if(!r.down2)throw new Error("variant E requires w.down2");let v=s.ops.Conv2d(e,r.down1,{outChannels:t.cHigh,kernel:3,stride:2,padding:1,activation:"relu"});l.push(v),c=v.output,_=c.h,b=c.w;let x=s.ops.DownAdapter(c,r.down2,r.adapter,{stride:2});l.push(x),g=x.output}else{let v=i==="A"?2:3,x=s.ops.DownAdapter(e,r.down1,r.adapter,{stride:v});l.push(x),g=x.output}return{steps:l,adapted:g,d1:c,dFull:d,midH:_,midW:b}}function Bt(s,e,r,t,i,o,n,u,p){let l=p.variant,c=l==="E"||l==="D",d=l==="D",_=[],b=s.ops.ConvExpand(r,u.expandFeat);_.push(b);let g=b.output,v;if(c){if(!u.up1Combine)throw new Error("two-stage variant requires w.up1Combine");let k=s.ops.BilinearUpsample(g,{outH:o,outW:n});_.push(k);let B=s.ops.CatConv6to2(k.output,t,u.up1Combine);_.push(B);let U=s.ops.BilinearUpsample(B.output,{outH:e.h,outW:e.w});_.push(U),v=U.output}else{let k=s.ops.BilinearUpsample(g,{outH:e.h,outW:e.w});_.push(k),v=k.output}let x=d?s.ops.UpFinalSkip(v,i,e,u.upCombine):s.ops.UpFinal(v,e,u.upCombine);return _.push(x),{steps:_,alpha:x.output}}var oe=class{constructor(e,r,t,i,o,n){a(this,"inputs");a(this,"output");a(this,"encoderTaps");a(this,"halfTap");a(this,"steps");this.inputs=[r];let u=Gt(e,r,i,o),p=new n(e,u.adapted,t),l=e.ops.BilinearUpsample(p.featLowRes,{outH:u.adapted.h,outW:u.adapted.w}),c=Bt(e,r,l.output,u.d1,u.dFull,u.midH,u.midW,i,o);this.steps=[...u.steps,p,l,...c.steps],this.output=c.alpha,this.encoderTaps=p.encoderTaps,this.halfTap=p.halfTap}run(){for(let e of this.steps)e.run()}};var Ho=[5,5,3,3],zo=[2,2,1,1];function ie(s,e,r,t){if(e.h===r.h&&e.w===r.w)return e;let i=s.ops.Crop(e,{outH:r.h,outW:r.w});return t.push(i),i.output}var ae=class{constructor(e,r,t,i,o,n=16,u={}){a(this,"inputs");a(this,"output");a(this,"steps");this.inputs=[r,t,...i,...u.halfTap?[u.halfTap]:[]];let p=[],l=e.ops.ChannelConcat(r,t);p.push(l);let c=e.ops.Conv2d(l.output,o.stem,{outChannels:n,kernel:7,stride:2,padding:3,activation:"relu6"});p.push(c);let d=[],_=c.output;if(u.fuseStem&&u.halfTap){let x=ie(e,u.halfTap,c.output,p),k=e.ops.ChannelConcat(c.output,x);p.push(k),d.push(k.output),_=k.output}for(let x=0;x<i.length;x++){let k=e.ops.Conv2d(_,o.stages[x],{outChannels:n,kernel:Ho[x],stride:2,padding:zo[x],activation:"relu6"});p.push(k);let B=ie(e,i[x],k.output,p),U=e.ops.ChannelConcat(k.output,B);p.push(U),d.push(U.output),_=U.output}let b=e.ops.Conv2d(d[d.length-1],o.predictBot,{outChannels:4,kernel:3,stride:1,padding:1,activation:"none"});p.push(b);let g=b.output,v=d[d.length-1];for(let x=0;x<d.length-1;x++){let k=d.length-2-x,B=e.ops.BilinearUpsample(v,{outH:v.h*2,outW:v.w*2}),U=e.ops.Conv2d(B.output,o.deconv[x],{outChannels:n,kernel:3,stride:1,padding:1,activation:"relu6"}),j=e.ops.BilinearUpsample(g,{outH:g.h*2,outW:g.w*2});p.push(B,U,j);let xt=ie(e,U.output,d[k],p),V=ie(e,j.output,d[k],p),q=e.ops.ChannelConcat(d[k],xt),O=e.ops.ChannelConcat(q.output,V);p.push(q,O);let N=e.ops.Conv2d(O.output,o.predict[x],{outChannels:4,kernel:3,stride:1,padding:1,activation:"none"});p.push(N),g=N.output,v=O.output}this.output=g,this.steps=p}run(){for(let e of this.steps)e.run()}};var L=class{constructor(e,r,t,i){a(this,"inputs");a(this,"output");a(this,"dwOp");a(this,"pwOp");this.inputs=[r],this.dwOp=e.ops.DepthwiseConv2d(r,t.dw,{kernel:i.kernel,stride:i.stride,padding:i.padding,activation:"relu6"}),this.pwOp=e.ops.Conv2d(this.dwOp.output,t.pw,{outChannels:i.outChannels,kernel:1,stride:1,padding:0,activation:"none"}),this.output=this.pwOp.output}run(){this.dwOp.run(),this.pwOp.run()}};var w=class{constructor(e,r,t,i){a(this,"inputs");a(this,"output");a(this,"expandOp");a(this,"dwOp");a(this,"projOp");this.inputs=[r];let o=i.midChannels!==i.inChannels,n=i.stride===1&&i.inChannels===i.outChannels;this.expandOp=o?e.ops.Conv2d(r,t.expand,{outChannels:i.midChannels,kernel:1,stride:1,padding:0,activation:"relu6"}):null;let u=this.expandOp?this.expandOp.output:r;this.dwOp=e.ops.DepthwiseConv2d(u,t.dw,{kernel:i.kernel,stride:i.stride,padding:i.padding,activation:"relu6"}),this.projOp=n?e.ops.ProjResidual(this.dwOp.output,r,t.proj,{outChannels:i.outChannels}):e.ops.Conv2d(this.dwOp.output,t.proj,{outChannels:i.outChannels,kernel:1,stride:1,padding:0,activation:"none"}),this.output=this.projOp.output}run(){this.expandOp?.run(),this.dwOp.run(),this.projOp.run()}};var G=class{constructor(e,r,t,i,o){a(this,"inputs");a(this,"output");a(this,"upOp");a(this,"concatConvOp");a(this,"conv2Op");this.inputs=[r,t],this.upOp=e.ops.BilinearUpsample(r,{outH:t.h,outW:t.w}),this.concatConvOp=e.ops.ConcatConv2d(this.upOp.output,t,i.conv1,{outChannels:o.outChannels}),this.conv2Op=e.ops.Conv2d(this.concatConvOp.output,i.conv2,{outChannels:o.outChannels,kernel:3,stride:1,padding:1,activation:"relu6"}),this.output=this.conv2Op.output}run(){this.upOp.run(),this.concatConvOp.run(),this.conv2Op.run()}};var ne=class{constructor(e,r,t){a(this,"output");a(this,"featLowRes");a(this,"encoderTaps");a(this,"halfTap");a(this,"stem");a(this,"s0");a(this,"s1b0");a(this,"s1b1");a(this,"s2b0");a(this,"s2b1");a(this,"s3b0");a(this,"s3b1");a(this,"s3b2");a(this,"s4b0");a(this,"s4b1");a(this,"s4b2");a(this,"bottleneck");a(this,"dec0");a(this,"dec1");a(this,"finalUp");a(this,"outConv");a(this,"alpha");this.stem=e.ops.Conv2d(r,t.encoder.stem,{outChannels:32,kernel:3,stride:2,padding:"same",activation:"relu6"}),this.s0=new L(e,this.stem.output,t.encoder.s0,{outChannels:16,kernel:3,stride:1,padding:1}),this.s1b0=new w(e,this.s0.output,t.encoder.s1[0],{inChannels:16,midChannels:96,outChannels:24,kernel:3,stride:2,padding:"same"}),this.s1b1=new w(e,this.s1b0.output,t.encoder.s1[1],{inChannels:24,midChannels:144,outChannels:24,kernel:3,stride:1,padding:1}),this.s2b0=new w(e,this.s1b1.output,t.encoder.s2[0],{inChannels:24,midChannels:144,outChannels:40,kernel:5,stride:2,padding:"same"}),this.s2b1=new w(e,this.s2b0.output,t.encoder.s2[1],{inChannels:40,midChannels:240,outChannels:40,kernel:5,stride:1,padding:2}),this.s3b0=new w(e,this.s2b1.output,t.encoder.s3[0],{inChannels:40,midChannels:240,outChannels:80,kernel:3,stride:2,padding:"same"}),this.s3b1=new w(e,this.s3b0.output,t.encoder.s3[1],{inChannels:80,midChannels:480,outChannels:80,kernel:3,stride:1,padding:1}),this.s3b2=new w(e,this.s3b1.output,t.encoder.s3[2],{inChannels:80,midChannels:480,outChannels:80,kernel:3,stride:1,padding:1}),this.s4b0=new w(e,this.s3b2.output,t.encoder.s4[0],{inChannels:80,midChannels:480,outChannels:112,kernel:5,stride:1,padding:2}),this.s4b1=new w(e,this.s4b0.output,t.encoder.s4[1],{inChannels:112,midChannels:672,outChannels:112,kernel:5,stride:1,padding:2}),this.s4b2=new w(e,this.s4b1.output,t.encoder.s4[2],{inChannels:112,midChannels:672,outChannels:112,kernel:5,stride:1,padding:2}),this.bottleneck=e.ops.Conv2d(this.s4b2.output,t.bottleneck,{outChannels:128,kernel:1,stride:1,padding:0,activation:"relu6"}),this.dec0=new G(e,this.bottleneck.output,this.s2b1.output,t.decoder.blocks[0],{outChannels:64}),this.dec1=new G(e,this.dec0.output,this.s1b1.output,t.decoder.blocks[1],{outChannels:32}),this.finalUp=e.ops.UpsampleConv1x1(this.dec1.output,t.decoder.finalUpsample,{outH:this.dec1.output.h*2,outW:this.dec1.output.w*2,outChannels:32,activation:"relu6"}),this.featLowRes=this.finalUp.output,this.encoderTaps=[this.s1b1.output,this.s2b1.output,this.s4b2.output],this.halfTap=this.s0.output,this.outConv=e.ops.Conv2d(this.finalUp.output,t.decoder.outputConv,{outChannels:4,kernel:1,stride:1,padding:0,activation:"none"}),this.alpha=e.ops.UpsampleSigmoid(this.outConv.output,{outH:this.outConv.output.h*2,outW:this.outConv.output.w*2}),this.output=this.alpha.output}run(){this.stem.run(),this.s0.run(),this.s1b0.run(),this.s1b1.run(),this.s2b0.run(),this.s2b1.run(),this.s3b0.run(),this.s3b1.run(),this.s3b2.run(),this.s4b0.run(),this.s4b1.run(),this.s4b2.run(),this.bottleneck.run(),this.dec0.run(),this.dec1.run(),this.finalUp.run(),this.outConv.run(),this.alpha.run()}};var se=class{constructor(e,r,t){a(this,"output");a(this,"featLowRes");a(this,"encoderTaps");a(this,"stem");a(this,"s0");a(this,"s1b0");a(this,"s1b1");a(this,"s2b0");a(this,"s2b1");a(this,"s3b0");a(this,"s3b1");a(this,"s3b2");a(this,"s4b0");a(this,"s4b1");a(this,"s4b2");a(this,"s5b0");a(this,"s5b1");a(this,"s5b2");a(this,"s5b3");a(this,"s6b0");a(this,"bottleneck");a(this,"dec0");a(this,"dec1");a(this,"dec2");a(this,"finalUp");a(this,"outConv");a(this,"alpha");this.stem=e.ops.Conv2d(r,t.encoder.stem,{outChannels:32,kernel:3,stride:2,padding:"same",activation:"relu6"}),this.s0=new L(e,this.stem.output,t.encoder.s0,{outChannels:16,kernel:3,stride:1,padding:1}),this.s1b0=new w(e,this.s0.output,t.encoder.s1[0],{inChannels:16,midChannels:96,outChannels:24,kernel:3,stride:2,padding:"same"}),this.s1b1=new w(e,this.s1b0.output,t.encoder.s1[1],{inChannels:24,midChannels:144,outChannels:24,kernel:3,stride:1,padding:1}),this.s2b0=new w(e,this.s1b1.output,t.encoder.s2[0],{inChannels:24,midChannels:144,outChannels:40,kernel:5,stride:2,padding:"same"}),this.s2b1=new w(e,this.s2b0.output,t.encoder.s2[1],{inChannels:40,midChannels:240,outChannels:40,kernel:5,stride:1,padding:2}),this.s3b0=new w(e,this.s2b1.output,t.encoder.s3[0],{inChannels:40,midChannels:240,outChannels:80,kernel:3,stride:2,padding:"same"}),this.s3b1=new w(e,this.s3b0.output,t.encoder.s3[1],{inChannels:80,midChannels:480,outChannels:80,kernel:3,stride:1,padding:1}),this.s3b2=new w(e,this.s3b1.output,t.encoder.s3[2],{inChannels:80,midChannels:480,outChannels:80,kernel:3,stride:1,padding:1}),this.s4b0=new w(e,this.s3b2.output,t.encoder.s4[0],{inChannels:80,midChannels:480,outChannels:112,kernel:5,stride:1,padding:2}),this.s4b1=new w(e,this.s4b0.output,t.encoder.s4[1],{inChannels:112,midChannels:672,outChannels:112,kernel:5,stride:1,padding:2}),this.s4b2=new w(e,this.s4b1.output,t.encoder.s4[2],{inChannels:112,midChannels:672,outChannels:112,kernel:5,stride:1,padding:2}),this.s5b0=new w(e,this.s4b2.output,t.encoder.s5[0],{inChannels:112,midChannels:672,outChannels:192,kernel:5,stride:2,padding:"same"}),this.s5b1=new w(e,this.s5b0.output,t.encoder.s5[1],{inChannels:192,midChannels:1152,outChannels:192,kernel:5,stride:1,padding:2}),this.s5b2=new w(e,this.s5b1.output,t.encoder.s5[2],{inChannels:192,midChannels:1152,outChannels:192,kernel:5,stride:1,padding:2}),this.s5b3=new w(e,this.s5b2.output,t.encoder.s5[3],{inChannels:192,midChannels:1152,outChannels:192,kernel:5,stride:1,padding:2}),this.s6b0=new w(e,this.s5b3.output,t.encoder.s6[0],{inChannels:192,midChannels:1152,outChannels:320,kernel:3,stride:1,padding:1}),this.bottleneck=e.ops.Conv2d(this.s6b0.output,t.bottleneck,{outChannels:128,kernel:1,stride:1,padding:0,activation:"relu6"}),this.dec0=new G(e,this.bottleneck.output,this.s4b2.output,t.decoder.blocks[0],{outChannels:64}),this.dec1=new G(e,this.dec0.output,this.s2b1.output,t.decoder.blocks[1],{outChannels:32}),this.dec2=new G(e,this.dec1.output,this.s1b1.output,t.decoder.blocks[2],{outChannels:16}),this.finalUp=e.ops.UpsampleConv1x1(this.dec2.output,t.decoder.finalUpsample,{outH:this.dec2.output.h*2,outW:this.dec2.output.w*2,outChannels:16,activation:"relu6"}),this.featLowRes=this.finalUp.output,this.encoderTaps=[this.s1b1.output,this.s2b1.output,this.s4b2.output,this.s6b0.output],this.outConv=e.ops.Conv2d(this.finalUp.output,t.decoder.outputConv,{outChannels:4,kernel:1,stride:1,padding:0,activation:"none"}),this.alpha=e.ops.UpsampleSigmoid(this.outConv.output,{outH:this.outConv.output.h*2,outW:this.outConv.output.w*2}),this.output=this.alpha.output}run(){this.stem.run(),this.s0.run(),this.s1b0.run(),this.s1b1.run(),this.s2b0.run(),this.s2b1.run(),this.s3b0.run(),this.s3b1.run(),this.s3b2.run(),this.s4b0.run(),this.s4b1.run(),this.s4b2.run(),this.s5b0.run(),this.s5b1.run(),this.s5b2.run(),this.s5b3.run(),this.s6b0.run(),this.bottleneck.run(),this.dec0.run(),this.dec1.run(),this.dec2.run(),this.finalUp.run(),this.outConv.run(),this.alpha.run()}};var kt=[[{in:24,mid:144,out:32,k:3,s:2},{in:32,mid:192,out:32,k:3,s:1},{in:32,mid:192,out:32,k:3,s:1},{in:32,mid:192,out:32,k:3,s:1}],[{in:32,mid:192,out:56,k:5,s:2},{in:56,mid:336,out:56,k:5,s:1},{in:56,mid:336,out:56,k:5,s:1},{in:56,mid:336,out:56,k:5,s:1}],[{in:56,mid:336,out:112,k:3,s:2},{in:112,mid:672,out:112,k:3,s:1},{in:112,mid:672,out:112,k:3,s:1},{in:112,mid:672,out:112,k:3,s:1},{in:112,mid:672,out:112,k:3,s:1},{in:112,mid:672,out:112,k:3,s:1}],[{in:112,mid:672,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1},{in:160,mid:960,out:160,k:5,s:1}],[{in:160,mid:960,out:272,k:5,s:2},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1},{in:272,mid:1632,out:272,k:5,s:1}],[{in:272,mid:1632,out:448,k:3,s:1}]],ue=class{constructor(e,r,t){a(this,"output");a(this,"featLowRes");a(this,"encoderTaps");a(this,"stem");a(this,"s0");a(this,"stages");a(this,"bottleneck");a(this,"dec0");a(this,"dec1");a(this,"dec2");a(this,"finalUp");a(this,"outConv");a(this,"alpha");this.stem=e.ops.Conv2d(r,t.encoder.stem,{outChannels:32,kernel:3,stride:2,padding:"same",activation:"relu6"}),this.s0=new L(e,this.stem.output,t.encoder.s0,{outChannels:24,kernel:3,stride:1,padding:1});let i=[t.encoder.s1,t.encoder.s2,t.encoder.s3,t.encoder.s4,t.encoder.s5,t.encoder.s6];this.stages=[];let o=this.s0.output;for(let d=0;d<kt.length;d++){let _=[];for(let b=0;b<kt[d].length;b++){let g=kt[d][b],v=new w(e,o,i[d][b],{inChannels:g.in,midChannels:g.mid,outChannels:g.out,kernel:g.k,stride:g.s,padding:g.s===2?"same":(g.k-1)/2});_.push(v),o=v.output}this.stages.push(_)}let n=d=>this.stages[d][this.stages[d].length-1].output,u=n(0),p=n(1),l=n(3),c=n(5);this.bottleneck=e.ops.Conv2d(c,t.bottleneck,{outChannels:256,kernel:1,stride:1,padding:0,activation:"relu6"}),this.dec0=new G(e,this.bottleneck.output,l,t.decoder.blocks[0],{outChannels:128}),this.dec1=new G(e,this.dec0.output,p,t.decoder.blocks[1],{outChannels:64}),this.dec2=new G(e,this.dec1.output,u,t.decoder.blocks[2],{outChannels:32}),this.finalUp=e.ops.UpsampleConv1x1(this.dec2.output,t.decoder.finalUpsample,{outH:this.dec2.output.h*2,outW:this.dec2.output.w*2,outChannels:32,activation:"relu6"}),this.featLowRes=this.finalUp.output,this.encoderTaps=[u,p,l,c],this.outConv=e.ops.Conv2d(this.finalUp.output,t.decoder.outputConv,{outChannels:4,kernel:1,stride:1,padding:0,activation:"none"}),this.alpha=e.ops.UpsampleSigmoid(this.outConv.output,{outH:this.outConv.output.h*2,outW:this.outConv.output.w*2}),this.output=this.alpha.output}run(){this.stem.run(),this.s0.run();for(let e of this.stages)for(let r of e)r.run();this.bottleneck.run(),this.dec0.run(),this.dec1.run(),this.dec2.run(),this.finalUp.run(),this.outConv.run(),this.alpha.run()}};var Ut=ne,St=se,Vo=ue,I={xs:{base:Ut,wrapper:{variant:"B",cHigh:4,cLow:4,cUp:2},canvasRes:{w:384,h:216},baseRes:{w:128,h:72},flowFuseStem:!0},small:{base:Ut,wrapper:{variant:"A",cHigh:4,cLow:4,cUp:2},canvasRes:{w:384,h:216},baseRes:{w:192,h:108}},medium:{base:St,wrapper:{variant:"A",cHigh:4,cLow:4,cUp:2},canvasRes:{w:512,h:288},baseRes:{w:256,h:144}},large:{base:St,wrapper:{variant:"D",cHigh:4,cLow:4,cUp:2},canvasRes:{w:640,h:360},baseRes:{w:256,h:144}},xl:{base:Vo,wrapper:{variant:"E",cHigh:4,cLow:4,cUp:2},canvasRes:{w:1280,h:720},baseRes:{w:320,h:180}}};var No=16,$o={tLo:.15,tHi:2.5,leak:.15,release:.9,tDiv:1,divScale:2},Xo=15,jo=5,Lt=1e3,pe=class{constructor(e){a(this,"canvas");a(this,"backend");a(this,"backendKind");a(this,"topology");a(this,"preset",null);a(this,"enabled");a(this,"temporalMode");a(this,"currentBackground");a(this,"modelTimingCounter",0);a(this,"modelTimingPending",!1);a(this,"renderOp");a(this,"flow",null);a(this,"bgImageInputs",new Map);a(this,"bgVideoInputs",new Map);a(this,"bgVideoPorts",new Map);a(this,"previewCanvas",null);a(this,"previewCtx",null);a(this,"previewBg",null);a(this,"previewEffectSpec",null);a(this,"previewIntervalMs",1e3/Xo);a(this,"lastPreviewAt",0);a(this,"skipCounter",0);a(this,"framesRenderedAt",[]);a(this,"modelRunSamples",[]);a(this,"displayRunSamples",[]);a(this,"skippedCount",0);this.backend=e.backend,this.backendKind=e.backendKind,this.canvas=e.canvas,this.enabled=e.enabled,this.temporalMode=e.temporalMode,this.currentBackground=e.background,this.topology=e.topology,this.renderOp=new re(this.backend)}process(e){this.renderOp.setSource(e);let r=performance.now(),t=this.renderOp.hasNetwork(),i=this.enabled&&t&&this.currentBackground.kind!=="none",o=this.isPreviewTick(r),n=o&&t&&this.previewBg!==null&&this.previewBg.kind!=="none",u=!1;i&&(this.temporalMode==="off"||this.temporalMode==="warp-only"&&this.flow?.everyFrame)?(this.runModelOnce(),u=!0):i&&this.flow?u=this.temporalMode==="warp-only"?this.stepWarpOnly():this.stepFlow():i&&(this.shouldRunModel()?(this.runModelOnce(),u=!0):this.skippedCount++),!u&&n&&(this.runModelOnce(),u=!0);let p=performance.now();o&&this.previewCanvas?(this.backendKind==="webgl"?this.compositePreviewWebGL(i,n):(this.compositeMain(i),this.renderOp.compositeTo("preview",this.previewSpec(n))),this.lastPreviewAt=r):this.compositeMain(i);let l=performance.now();this.displayRunSamples.push({ts:l,ms:l-p}),this.trimSamples(this.displayRunSamples),this.framesRenderedAt.push(l),this.trim(this.framesRenderedAt)}compositeMain(e){e?this.renderOp.runDisplay():this.renderOp.runPassthrough()}compositePreviewWebGL(e,r){this.renderOp.refreshDisplayInput(),this.renderOp.compositeTo("preview",this.previewSpec(r));let t=this.canvas.transferToImageBitmap();this.previewCtx.transferFromImageBitmap(t),this.renderOp.compositeMain(!e)}previewSpec(e){return e&&this.previewEffectSpec?this.previewEffectSpec:{mode:"passthrough"}}runModelOnce(){let e=this.backendKind==="webgpu"&&this.modelTimingCounter%jo===0&&!this.modelTimingPending,r=e?performance.now():0;this.renderOp.runModel(),e&&(this.modelTimingPending=!0,this.backend.sync().then(()=>{let t=performance.now();this.modelRunSamples.push({ts:t,ms:t-r}),this.trimSamples(this.modelRunSamples)}).catch(()=>{}).finally(()=>{this.modelTimingPending=!1})),this.modelTimingCounter++}stepFlow(){let e=this.flow,r=!1;return e.networkInput.run(),e.curBaseDown.run(),e.everyFrame?(e.net.run(),e.up.run(),this.runModelOnce(),r=!0,this.backend.copyTensor(e.curBaseDown.output,e.frameAHeld),this.backend.copyTensor(e.tier.output,e.predBuf)):this.shouldRunModel()?(this.runModelOnce(),r=!0,this.backend.copyTensor(e.curBaseDown.output,e.frameAHeld),this.backend.copyTensor(e.tier.output,e.alphaHeld),this.backend.copyTensor(e.tier.output,e.predBuf)):(this.skippedCount++,e.net.run(),e.up.run(),e.predWarp.run(),this.backend.copyTensor(e.predWarp.output,e.predBuf)),e.warm?(e.refWarp.run(),e.stab.run(),this.backend.copyTensor(e.stab.output,e.stabPrev),this.renderOp.applyAlpha(e.stab.output),r):(this.backend.copyTensor(e.tier.output,e.stabPrev),e.warm=r,r)}stepWarpOnly(){let e=this.flow;return e.networkInput.run(),e.curBaseDown.run(),this.shouldRunModel()?(this.runModelOnce(),this.backend.copyTensor(e.curBaseDown.output,e.frameAHeld),e.alphaHeld&&this.backend.copyTensor(e.tier.output,e.alphaHeld),!0):(this.skippedCount++,e.net.run(),e.up.run(),e.predWarp.run(),this.renderOp.applyAlpha(e.predWarp.output),!1)}isPreviewTick(e){return!this.previewCanvas||this.previewBg===null||!this.enabled?!1:e-this.lastPreviewAt>=this.previewIntervalMs}shouldRunModel(){return this.skipCounter===0?(this.skipCounter=this.preset?.skipFrames??0,!0):(this.skipCounter--,!1)}setBackground(e){this.currentBackground=e,this.renderOp.setBackground(this.translateBackgroundFor("main",e))}setEnabled(e){this.enabled=e}setTemporalMode(e){this.temporalMode!==e&&(this.temporalMode=e,this.skipCounter=0,this.flow&&(this.flow.warm=!1))}attachPreview(e){if(e.width=this.canvas.width,e.height=this.canvas.height,this.previewCanvas=e,this.backendKind==="webgpu")this.backend.attachCanvas("preview",e);else{let r=e.getContext("bitmaprenderer");if(!r)throw new Error("renderer: failed to get bitmaprenderer context for preview canvas");this.previewCtx=r}}setPreview(e,r){this.previewBg=e,this.previewEffectSpec=e.kind==="none"?null:this.translateBackgroundFor("preview",e),r?.fps&&r.fps>0&&(this.previewIntervalMs=1e3/r.fps),this.lastPreviewAt=0}clearPreview(){this.previewBg=null,this.previewEffectSpec=null;let e=this.bgVideoPorts.get("preview");e&&(e.close(),this.bgVideoPorts.delete("preview"))}setPreset(e,r){let t=I[e.model];if(!t)throw new Error(\`renderer: no TIER_CONFIG entry for model '\${e.model}'\`);let i=Pt(r),o=this.backend.ops.Input(t.canvasRes.h,t.canvasRes.w),n=new oe(this.backend,o.output,i.base,i.wrapper,t.wrapper,t.base);if(this.renderOp.attachNetwork(n,o,{upscaler:"bilinear",background:this.translateBackgroundFor("main",this.currentBackground)}),this.flow=null,i.flow){let u=t.baseRes,p=t.canvasRes,l=e.skipFrames===0,c=(O,N)=>this.backend.tensor(O,N,4,new Float32Array(O*N*4)),d=this.backend.ops.BilinearUpsample(o.output,{outH:u.h,outW:u.w}),_=c(u.h,u.w),b=new ae(this.backend,_,d.output,n.encoderTaps,i.flow,No,t.flowFuseStem?{fuseStem:!0,halfTap:n.halfTap}:{}),g=this.backend.ops.BilinearUpsample(b.output,{outH:p.h,outW:p.w}),v=p.w/u.w,x=c(p.h,p.w),k=c(p.h,p.w),B=this.backend.ops.Warp(k,g.output,{flowScale:v}),U=Math.max(1,Math.round(p.w/b.output.w)),j=Math.max(1,Math.round(p.h/b.output.h)),xt=this.backend.ops.Stabilize(g.output,x,B.output,k,{...$o,stepX:U,stepY:j}),V=l?null:c(p.h,p.w),q=V?this.backend.ops.Warp(V,g.output,{flowScale:v}):null;this.flow={tier:n,everyFrame:l,warm:!1,networkInput:o,curBaseDown:d,frameAHeld:_,net:b,up:g,predBuf:x,stabPrev:k,refWarp:B,stab:xt,alphaHeld:V,predWarp:q}}this.preset=e,this.skipCounter=0}destroy(){for(let e of this.bgVideoPorts.values())e.close();this.bgVideoPorts.clear(),this.backend.destroy()}getStats(){let e=performance.now();return this.trimRecent(this.framesRenderedAt,e),this.trimSamplesAt(this.modelRunSamples,e),this.trimSamplesAt(this.displayRunSamples,e),{fps:this.framesRenderedAt.length,modelFps:this.modelRunSamples.length,modelMs:Ft(this.modelRunSamples.map(r=>r.ms)),displayMs:Ft(this.displayRunSamples.map(r=>r.ms)),skipped:this.skippedCount,preset:this.preset?.model??"boot",skipFrames:this.preset?.skipFrames??0,enabled:this.enabled,temporalMode:this.temporalMode,backend:this.backendKind,dtype:this.backend.dtype,outputWidth:this.canvas.width,outputHeight:this.canvas.height,inputPath:this.topology.input,outputPath:this.topology.output}}translateBackgroundFor(e,r){let t=this.bgVideoPorts.get(e);switch(r.kind!=="video"&&t&&(t.close(),this.bgVideoPorts.delete(e)),r.kind){case"none":return{mode:"solid",color:[0,0,0]};case"color":return{mode:"solid",color:r.rgb};case"blur":return{mode:"blur",sigma:r.sigma};case"image":{let i=this.bgInputFor(this.bgImageInputs,e);return i.setSource(r.bitmap),i.run(),{mode:"image",image:i.output}}case"video":{let i=this.bgInputFor(this.bgVideoInputs,e);return t&&t.close(),this.bgVideoPorts.set(e,r.port),r.port.onmessage=o=>{let n=o.data.frame;try{r.port.postMessage({type:"ack"})}catch{}try{i.setSource(n),i.run()}finally{n.close()}},r.port.start?.(),{mode:"image",image:i.output}}}}bgInputFor(e,r){let t=e.get(r);return t||(t=this.backend.ops.Input(this.canvas.height,this.canvas.width),e.set(r,t)),t}trim(e){e.length>240&&e.splice(0,e.length-240)}trimSamples(e){e.length>240&&e.splice(0,e.length-240)}trimRecent(e,r){let t=r-Lt,i=0;for(;i<e.length&&e[i]<t;)i++;i>0&&e.splice(0,i)}trimSamplesAt(e,r){let t=r-Lt,i=0;for(;i<e.length&&e[i].ts<t;)i++;i>0&&e.splice(0,i)}};function Ft(s){if(s.length===0)return 0;let e=s.slice().sort((t,i)=>t-i),r=e.length>>1;return e.length%2?e[r]:(e[r-1]+e[r])/2}var M=new Float32Array(1),$=new Uint32Array(M.buffer);function qo(s){M[0]=s;let e=$[0],r=e>>>16&32768,t=e&2147483647,i=(t>>>23)-127+15;if((e&2139095040)===2139095040)return(e&8388607)!==0?r|32256:r|31744;if(i>=31)return r|31744;if(i<=0){if(i<-10)return r;let l=t&8388607|8388608,c=14-i,d=l>>>c,_=l>>>c-1&1,b=(l&(1<<c-1)-1)!==0?1:0;return _&&(b||d&1)&&(d+=1),r|d}let o=t>>>13&1023,n=t>>>12&1,u=(t&4095)!==0?1:0,p=i<<10|o;return n&&(u||o&1)&&(p+=1,(p>>>10&31)===31)?r|31744:r|p}function Tt(s){let e=(s&32768)<<16,r=(s&31744)>>>10,t=s&1023;if(r===0){if(t===0)return $[0]=e,M[0];let i=t,o=1;for(;(i&1024)===0;)i<<=1,o-=1;return i&=1023,$[0]=e|o+127-15<<23|i<<13,M[0]}return r===31?($[0]=e|2139095040|t<<13,M[0]):($[0]=e|r+127-15<<23|t<<13,M[0])}function le(s){let e=new Uint16Array(s.length);for(let r=0;r<s.length;r++)e[r]=qo(s[r]);return e}function A(s){let e=new Float32Array(s.length);for(let r=0;r<s.length;r++)e[r]=Tt(s[r]);return e}var f=class{constructor(e){a(this,"backend",e);a(this,"shader","");a(this,"pipeline");a(this,"bindGroup");a(this,"uniformDefs",[]);a(this,"uniformBuffers",{})}createUniform(e,r){this.uniformDefs.push({name:e,type:r})}setUniform(e,r){let t=this.backend.device.createBuffer({size:r.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});r instanceof Uint32Array?new Uint32Array(t.getMappedRange()).set(r):new Float32Array(t.getMappedRange()).set(r),t.unmap(),this.uniformBuffers[e]=t}defaultBindGroup(){let e=[],r=0;for(let t of this.inputs)e.push({binding:r++,resource:{buffer:t.buffer}});for(let t of this.weights)e.push({binding:r++,resource:{buffer:t.buffer}});for(let t of this.uniformDefs)e.push({binding:r++,resource:{buffer:this.uniformBuffers[t.name]}});return e.push({binding:r,resource:{buffer:this.output.buffer}}),this.backend.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:e})}defaultSetup(){let e=this.backend.device.createShaderModule({code:this.shader});this.pipeline=this.backend.device.createComputePipeline({layout:"auto",compute:{module:e,entryPoint:"main"}}),this.bindGroup=this.defaultBindGroup()}run(){let e=this.backend.device.createCommandEncoder(),r=e.beginComputePass();r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.dispatchWorkgroups(...this.dispatch),r.end(),this.backend.device.queue.submit([e.finish()])}};var Et=\`// Conv2d, output-channel-blocked (K=2) \\u2014 drop-in replacement for conv2d.wgsl.
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
\`;var Dt=\`enable f16;

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
\`;function T(s,e,r,t){return typeof t=="number"?Math.floor((s+2*t-e)/r)+1:t==="same"?Math.ceil(s/r):Math.floor((s-e)/r)+1}function R(s,e,r,t){return(s-1)*r-2*t+e}function Qo(s,e,r,t){return Math.floor(Math.max((e-1)*t+r-s,0)/2)}function W(s,e,r,t,i){return typeof s=="number"?s:s==="same"?Qo(e,r,t,i):0}function m(s){return s instanceof Float32Array||s instanceof Uint16Array?s:new Float32Array(s)}function y(s){let e=Math.max(4,Math.ceil(s.length/4)*4),r=new Float32Array(e),t=s instanceof Uint16Array;for(let i=0;i<s.length;i++)r[i]=t?Tt(s[i]):s[i];return r}var ce=class extends f{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Dt:Et;let n=T(t.h,o.kernel,o.stride,o.padding),u=T(t.w,o.kernel,o.stride,o.padding),p=t.c/4,l=o.outChannels/4,c=W(o.padding,t.h,n,o.kernel,o.stride),d=W(o.padding,t.w,u,o.kernel,o.stride);this.output=r.tensor(n,u,o.outChannels),this.inputs=[t],this.weights=[r.upload(m(i.weights)),r.upload(m(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,n,u,p,l,o.kernel,o.kernel,o.stride,c,d,o.activation==="relu6"?1:o.activation==="relu"?2:o.activation==="leaky"?3:0])),this.defaultSetup(),this.dispatch=[Math.ceil(u/8),Math.ceil(n/8),Math.ceil(l/2)]}};var Ot=\`// ConvTranspose2d \\u2014 gather form, f32 variant. See conv_transpose2d_f16.wgsl for
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
\`;var It=\`enable f16;

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
\`;var de=class extends f{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?It:Ot;let n=R(t.h,o.kernel,o.stride,o.padding),u=R(t.w,o.kernel,o.stride,o.padding),p=t.c/4,l=o.outChannels/4;this.output=r.tensor(n,u,o.outChannels),this.inputs=[t],this.weights=[r.upload(m(i.weights)),r.upload(m(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,n,u,p,l,o.kernel,o.kernel,o.stride,o.padding,o.padding,o.activation==="relu6"?1:o.activation==="relu"?2:o.activation==="leaky"?3:0])),this.defaultSetup(),this.dispatch=[Math.ceil(u/8),Math.ceil(n/8),l]}};var Mt=\`// Depthwise Conv2d \\u2014 groups = in_channels (each channel convolved independently).
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
\`;var me=class extends f{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?At:Mt;let n=T(t.h,o.kernel,o.stride,o.padding),u=T(t.w,o.kernel,o.stride,o.padding),p=t.c/4,l=W(o.padding,t.h,n,o.kernel,o.stride),c=W(o.padding,t.w,u,o.kernel,o.stride);this.output=r.tensor(n,u,t.c),this.inputs=[t],this.weights=[r.upload(m(i.weights)),r.upload(m(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,n,u,p,o.kernel,o.kernel,o.stride,l,c,o.activation==="relu6"?1:0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(u/8),Math.ceil(n/8),p]}};var Rt=\`// Element-wise add of two tensors \\u2014 used for residual connections in MBConv blocks.
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
\`;var Ht=\`enable f16;

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
\`;var fe=class extends f{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Ht:Rt;let o=t.h*t.w*t.c;this.output=r.tensor(t.h,t.w,t.c),this.inputs=[t,i],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/256),1,1]}};var zt=\`// Element-wise sigmoid: output = 1 / (1 + exp(-x)).
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
\`;var Vt=\`enable f16;

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
\`;var he=class extends f{constructor(r,t){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Vt:zt;let i=t.h*t.w*(t.c/4);this.output=r.tensor(t.h,t.w,t.c),this.inputs=[t],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([i,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i/256),1,1]}};var Nt=\`// Element-wise tanh \\u2014 used by ConvGRU candidate activation.
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
\`;var $t=\`enable f16;

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
\`;var _e=class extends f{constructor(r,t){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?$t:Nt;let i=t.h*t.w*(t.c/4);this.output=r.tensor(t.h,t.w,t.c),this.inputs=[t],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([i,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i/256),1,1]}};var Xt=\`// Element-wise multiply \\u2014 used in ConvGRU for r \\u2299 h_prev.
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
\`;var jt=\`enable f16;

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
\`;var ge=class extends f{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?jt:Xt;let o=t.h*t.w*t.c;this.output=r.tensor(t.h,t.w,t.c),this.inputs=[t,i],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/256),1,1]}};var qt=\`// Bilinear gather-warp (f32). See warp_f16.wgsl for the math.

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
\`;var Kt=\`enable f16;

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
\`;var be=class extends f{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Kt:qt,this.output=r.tensor(t.h,t.w,t.c),this.inputs=[t,i],this.createUniform("params","Params");let n=new Uint32Array(3);n[0]=t.h,n[1]=t.w,new Float32Array(n.buffer)[2]=o.flowScale,this.setUniform("params",n),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),1]}};var Yt=\`// Flow-gated temporal stabilizer (f32). See stabilize_f16.wgsl for the math.

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
\`;var Qt=\`enable f16;

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
\`;var ve=class extends f{constructor(r,t,i,o,n,u){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Qt:Yt,this.output=r.tensor(t.h,t.w,4),this.inputs=[t,i,o,n],this.createUniform("params","Params");let p=new Uint32Array(10);p[0]=t.h,p[1]=t.w;let l=new Float32Array(p.buffer);l[2]=u.tLo,l[3]=u.tHi,l[4]=u.leak,l[5]=u.release,l[6]=u.tDiv,l[7]=u.divScale,p[8]=u.stepX,p[9]=u.stepY,this.setUniform("params",p),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),1]}};var Jt=\`// Bilinear upsample (arbitrary ratio), align_corners=False (matches PyTorch default).
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
\`;var Zt=\`enable f16;

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
\`;var xe=class extends f{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Zt:Jt;let o=t.c/4;this.output=r.tensor(i.outH,i.outW,t.c),this.inputs=[t],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,i.outH,i.outW,o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i.outW/8),Math.ceil(i.outH/8),o]}};var er=\`// Top-left crop (f32). See crop_f16.wgsl.

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
\`;var tr=\`enable f16;

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
\`;var ye=class extends f{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?tr:er;let o=t.c/4;this.output=r.tensor(i.outH,i.outW,t.c),this.inputs=[t],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.w,i.outH,i.outW,o])),this.defaultSetup(),this.dispatch=[Math.ceil(i.outW/8),Math.ceil(i.outH/8),o]}};var rr=\`// Bicubic upsample (arbitrary scale) \\u2014 Keys cubic, a=-0.75 (PyTorch default
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
\`;var or=\`enable f16;

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
\`;var we=class extends f{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?or:rr;let o=t.c/4;this.output=r.tensor(i.outH,i.outW,t.c),this.inputs=[t],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,i.outH,i.outW,o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i.outW/8),Math.ceil(i.outH/8),o]}};var ir=\`// Channel concatenation: output = cat(A, B, dim=channel).
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
\`;var ar=\`enable f16;

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
\`;var ke=class extends f{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?ar:ir;let o=t.c/4,n=i.c/4,u=o+n;this.output=r.tensor(t.h,t.w,t.c+i.c),this.inputs=[t,i],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,o,n,u,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),u]}};var nr=\`// Conv2d + skip add fused.
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
\`;var sr=\`enable f16;

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
\`;var Te=class extends f{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?sr:nr;let u=T(t.h,n.kernel,n.stride,n.padding),p=T(t.w,n.kernel,n.stride,n.padding),l=t.c/4,c=n.outChannels/4,d=W(n.padding,t.h,u,n.kernel,n.stride),_=W(n.padding,t.w,p,n.kernel,n.stride);this.output=r.tensor(u,p,n.outChannels),this.inputs=[t,i],this.weights=[r.upload(m(o.weights)),r.upload(m(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,u,p,l,c,n.kernel,n.kernel,n.stride,d,_,n.activation==="relu6"?1:0])),this.defaultSetup(),this.dispatch=[Math.ceil(p/8),Math.ceil(u/8),c]}};var ur=\`// proj_residual: bespoke 1\\xD71 conv (no activation) + residual add, fused.
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
\`;var pr=\`enable f16;

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
\`;var We=class extends f{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?pr:ur;let u=t.c/4,p=n.outChannels/4;this.output=r.tensor(t.h,t.w,n.outChannels),this.inputs=[t,i],this.weights=[r.upload(m(o.weights)),r.upload(m(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,u,p])),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),p]}};var lr=\`// concat_conv2d: fuses [concat(a, b) \\u2192 conv 3\\xD73 (pad 1) \\u2192 relu6] into one
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
\`;var cr=\`enable f16;

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
\`;var Ce=class extends f{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?cr:lr;let u=t.c/4,p=i.c/4,l=n.outChannels/4;this.output=r.tensor(t.h,t.w,n.outChannels),this.inputs=[t,i],this.weights=[r.upload(m(o.weights)),r.upload(m(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,u,p,l,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),l]}};var dr=\`// gates_fused: ConvGRU z + r gates, fused into one dispatch.
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
\`;var mr=\`enable f16;

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
\`;var Pe=class extends f{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?mr:dr,this.output=r.tensor(t.h,t.w,4),this.inputs=[t,i],this.weights=[r.upload(m(o.weights)),r.upload(y(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),1]}};var fr=\`// cand_update_fused: ConvGRU candidate path + state update + output, fused.
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
\`;var hr=\`enable f16;

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
\`;var Ge=class extends f{constructor(r,t,i,o,n,u){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?hr:fr,this.output=r.tensor(t.h,t.w,4),this.inputs=[t,i,o],this.weights=[r.upload(m(n.weights)),r.upload(y(n.bias)),r.upload(y(u))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),1]}};var _r=\`// conv_expand: bespoke N\\u21922 conv 3\\xD73 (pad 1) + relu (wrapper expand_feat).
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
\`;var gr=\`enable f16;

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
\`;var Be=class extends f{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?gr:_r;let o=t.c/4;this.output=r.tensor(t.h,t.w,4),this.inputs=[t],this.weights=[r.upload(m(i.weights)),r.upload(y(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,o,0])),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),1]}};var br=\`// cat_conv_6to2: fused concat(u, d) + 6\\u21922 conv 3\\xD73 (pad 1) + relu (E up1_combine).
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
\`;var vr=\`enable f16;

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
\`;var Ue=class extends f{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?vr:br,this.output=r.tensor(t.h,t.w,4),this.inputs=[t,i],this.weights=[r.upload(m(o.weights)),r.upload(y(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),1]}};var xr=\`// down_adapter: fused stride-N 3\\xD73 conv (4\\u21924) + relu + 1\\xD71 adapter (4\\u21923, no
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
\`;var yr=\`enable f16;

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
\`;var Se=class extends f{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?yr:xr;let u=T(t.h,3,n.stride,1),p=T(t.w,3,n.stride,1),l=W(1,t.h,u,3,n.stride),c=W(1,t.w,p,3,n.stride);this.output=r.tensor(u,p,4),this.inputs=[t],this.weights=[r.upload(m(i.weights)),r.upload(y(i.bias)),r.upload(m(o.weights)),r.upload(y(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,u,p,n.stride,l,c,0])),this.defaultSetup(),this.dispatch=[Math.ceil(p/8),Math.ceil(u/8),1]}};var wr=\`// up_final: fused concat(u, rgb) \\u2192 conv 3\\xD73 5\\u21921 \\u2192 sigmoid (A/B alpha head).
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
\`;var kr=\`enable f16;

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
\`;var Le=class extends f{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?kr:wr,this.output=r.tensor(t.h,t.w,4),this.inputs=[t,i],this.weights=[r.upload(m(o.weights)),r.upload(y(o.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),1]}};var Tr=\`// up_final_skip: C/D alpha head. Fused concat(u, d_full, rgb) \\u2192 conv 3\\xD73 9\\u21921
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
\`;var Wr=\`enable f16;

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
\`;var Fe=class extends f{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Wr:Tr,this.output=r.tensor(t.h,t.w,4),this.inputs=[t,i,o],this.weights=[r.upload(m(n.weights)),r.upload(y(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(t.w/8),Math.ceil(t.h/8),1]}};var Cr=\`// Bilinear upsample + channel concat fused.
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
\`;var Pr=\`enable f16;

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
\`;var Ee=class extends f{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Pr:Cr;let n=t.c/4,u=i.c/4,p=n+u;this.output=r.tensor(o.outH,o.outW,t.c+i.c),this.inputs=[t,i],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,o.outH,o.outW,n,u,p,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o.outW/8),Math.ceil(o.outH/8),p]}};var Gr=\`// Bilinear upsample + 1\\xD71 pointwise conv fused.
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
\`;var Br=\`enable f16;

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
\`;var De=class extends f{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Br:Gr;let n=t.c/4,u=o.outChannels/4;this.output=r.tensor(o.outH,o.outW,o.outChannels),this.inputs=[t],this.weights=[r.upload(m(i.weights)),r.upload(m(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,o.outH,o.outW,n,u,o.activation==="relu6"?1:0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o.outW/8),Math.ceil(o.outH/8),u]}};var Ur=\`// Bilinear upsample + sigmoid fused.
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
\`;var Sr=\`enable f16;

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
\`;var Oe=class extends f{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader");this.shader=r.dtype==="f16"?Sr:Ur;let o=t.c/4;this.output=r.tensor(i.outH,i.outW,t.c),this.inputs=[t],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([t.h,t.w,i.outH,i.outW,o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(i.outW/8),Math.ceil(i.outH/8),o]}};var Lr=\`// Composite an RGBA image over a solid background, gated by a 1-ch alpha.
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
\`;var Fr=\`enable f16;

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
\`;var Ie=class{constructor(e,r,t,i){a(this,"backend",e);a(this,"pipeline");a(this,"bindGroup");a(this,"uniformBuffer");a(this,"outputView",null);if(r.h!==t.h||r.w!==t.w)throw new Error(\`CompositeSolid: image (\${r.h}\\xD7\${r.w}) and alpha (\${t.h}\\xD7\${t.w}) must match. Run the upscaler first.\`);let o=e.device;this.uniformBuffer=o.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(32);new Uint32Array(n,0,1)[0]=r.w,new Float32Array(n,16,4).set([i[0],i[1],i[2],0]),o.queue.writeBuffer(this.uniformBuffer,0,n);let u=e.dtype==="f16"?Fr:Lr,p=o.createShaderModule({code:u});this.pipeline=o.createRenderPipeline({layout:"auto",vertex:{module:p,entryPoint:"vs"},fragment:{module:p,entryPoint:"fs",targets:[{format:e.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=o.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.buffer}},{binding:1,resource:{buffer:t.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}}]})}setOutput(e){this.outputView=e.createView()}run(){if(!this.outputView)throw new Error("CompositeSolidWebGPU.run() called before setOutput()");let e=this.backend.device.createCommandEncoder(),r=e.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.draw(6),r.end(),this.backend.device.queue.submit([e.finish()]),this.outputView=null}};var Er=\`// Like composite_solid but bg is an NHWC vec4 storage buffer (e.g. virtual
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
\`;var Dr=\`enable f16;

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
\`;var Me=class{constructor(e,r,t,i){a(this,"backend",e);a(this,"pipeline");a(this,"bindGroup");a(this,"uniformBuffer");a(this,"outputView",null);if(r.h!==t.h||r.w!==t.w||r.h!==i.h||r.w!==i.w)throw new Error(\`CompositeImage: image (\${r.h}\\xD7\${r.w}), alpha (\${t.h}\\xD7\${t.w}), and bg (\${i.h}\\xD7\${i.w}) must all match. Run upscaler / resizer first.\`);let o=e.device;this.uniformBuffer=o.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(16);new Uint32Array(n,0,1)[0]=r.w,o.queue.writeBuffer(this.uniformBuffer,0,n);let u=e.dtype==="f16"?Dr:Er,p=o.createShaderModule({code:u});this.pipeline=o.createRenderPipeline({layout:"auto",vertex:{module:p,entryPoint:"vs"},fragment:{module:p,entryPoint:"fs",targets:[{format:e.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=o.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.buffer}},{binding:1,resource:{buffer:t.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:i.buffer}}]})}setOutput(e){this.outputView=e.createView()}run(){if(!this.outputView)throw new Error("CompositeImageWebGPU.run() called before setOutput()");let e=this.backend.device.createCommandEncoder(),r=e.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.draw(6),r.end(),this.backend.device.queue.submit([e.finish()]),this.outputView=null}};var Or=\`// Like composite_image but bg is sampled bilinearly \\u2014 bg may be smaller than
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
\`;var Ir=\`enable f16;

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
\`;var Ae=class{constructor(e,r,t,i){a(this,"backend",e);a(this,"pipeline");a(this,"bindGroup");a(this,"uniformBuffer");a(this,"outputView",null);if(r.h!==t.h||r.w!==t.w)throw new Error(\`CompositeImageBilinear: image (\${r.h}\\xD7\${r.w}) and alpha (\${t.h}\\xD7\${t.w}) must match.\`);let o=e.device;this.uniformBuffer=o.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(16),u=new Uint32Array(n);u[0]=r.w,u[1]=r.h,u[2]=i.w,u[3]=i.h,o.queue.writeBuffer(this.uniformBuffer,0,n);let p=e.dtype==="f16"?Ir:Or,l=o.createShaderModule({code:p});this.pipeline=o.createRenderPipeline({layout:"auto",vertex:{module:l,entryPoint:"vs"},fragment:{module:l,entryPoint:"fs",targets:[{format:e.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=o.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.buffer}},{binding:1,resource:{buffer:t.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:i.buffer}}]})}setOutput(e){this.outputView=e.createView()}run(){if(!this.outputView)throw new Error("CompositeImageBilinearWebGPU.run() called before setOutput()");let e=this.backend.device.createCommandEncoder(),r=e.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.draw(6),r.end(),this.backend.device.queue.submit([e.finish()]),this.outputView=null}};var Mr=\`// Passthrough "compositor" \\u2014 writes the image directly to the canvas
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
\`;var Re=class{constructor(e,r){a(this,"backend",e);a(this,"pipeline");a(this,"bindGroup");a(this,"uniformBuffer");a(this,"outputView",null);let t=e.device;this.uniformBuffer=t.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let i=new ArrayBuffer(16);new Uint32Array(i,0,1)[0]=r.w,t.queue.writeBuffer(this.uniformBuffer,0,i);let o=e.dtype==="f16"?Ar:Mr,n=t.createShaderModule({code:o});this.pipeline=t.createRenderPipeline({layout:"auto",vertex:{module:n,entryPoint:"vs"},fragment:{module:n,entryPoint:"fs",targets:[{format:e.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=t.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.buffer}},{binding:1,resource:{buffer:this.uniformBuffer}}]})}setOutput(e){this.outputView=e.createView()}run(){if(!this.outputView)throw new Error("CompositePassthroughWebGPU.run() called before setOutput()");let e=this.backend.device.createCommandEncoder(),r=e.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pipeline),r.setBindGroup(0,this.bindGroup),r.draw(6),r.end(),this.backend.device.queue.submit([e.finish()]),this.outputView=null}};var Rr=\`// Input op \\u2014 sample a regular 2D source texture (RGBA8 unorm) into the NHWC
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
\`;var Hr=\`enable f16;

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
\`;var zr=\`// Input op \\u2014 sample a GPUExternalTexture (zero-copy VideoFrame import) into
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
\`;var Vr=\`enable f16;

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
\`;var na=s=>typeof VideoFrame<"u"&&s instanceof VideoFrame,He=class{constructor(e,r,t){a(this,"output");a(this,"device");a(this,"dtype");a(this,"sampler");a(this,"uniformBuffer");a(this,"dispatch");a(this,"pipeline2d",null);a(this,"pipelineExternal",null);a(this,"stagingTex",null);a(this,"stagingW",0);a(this,"stagingH",0);a(this,"source",null);this.device=e.device,this.dtype=e.dtype,this.output=e.tensor(r,t,4),this.sampler=this.device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.uniformBuffer=this.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let i=new ArrayBuffer(16);new Uint32Array(i,0,2).set([t,r]),this.device.queue.writeBuffer(this.uniformBuffer,0,i),this.dispatch=[Math.ceil(t/8),Math.ceil(r/8),1],this.pipeline2d=this.buildPipeline(this.dtype==="f16"?Hr:Rr)}setSource(e){this.source=e}run(){if(!this.source)throw new Error("InputWebGPU.run() called before setSource()");na(this.source)?this.runExternal(this.source):this.run2d(this.source)}run2d(e){this.ensureStagingTexture(e.width,e.height),this.device.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:this.stagingTex},[e.width,e.height]);let r=this.device.createBindGroup({layout:this.pipeline2d.getBindGroupLayout(0),entries:[{binding:0,resource:this.stagingTex.createView()},{binding:1,resource:this.sampler},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.output.buffer}}]});this.dispatchOnce(this.pipeline2d,r)}runExternal(e){this.pipelineExternal||(this.pipelineExternal=this.buildPipeline(this.dtype==="f16"?Vr:zr));let r=this.device.importExternalTexture({source:e}),t=this.device.createBindGroup({layout:this.pipelineExternal.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:this.sampler},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.output.buffer}}]});this.dispatchOnce(this.pipelineExternal,t)}ensureStagingTexture(e,r){this.stagingTex&&this.stagingW===e&&this.stagingH===r||(this.stagingTex?.destroy(),this.stagingTex=this.device.createTexture({size:[e,r,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),this.stagingW=e,this.stagingH=r)}buildPipeline(e){let r=this.device.createShaderModule({code:e});return this.device.createComputePipeline({layout:"auto",compute:{module:r,entryPoint:"main"}})}dispatchOnce(e,r){let t=this.device.createCommandEncoder(),i=t.beginComputePass();i.setPipeline(e),i.setBindGroup(0,r),i.dispatchWorkgroups(...this.dispatch),i.end(),this.device.queue.submit([t.finish()])}};var sa=navigator.gpu?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST:0,H=class s{constructor(e,r,t){a(this,"device",e);a(this,"canvas",r);a(this,"dtype",t);a(this,"ops");a(this,"presenters");a(this,"canvasContext");a(this,"canvasFormat");a(this,"bytesPerElement");a(this,"contexts",new Map);this.bytesPerElement=t==="f16"?2:4;let i=r.getContext("webgpu");if(!i)throw new Error("Failed to get WebGPU context from canvas");this.canvasFormat=navigator.gpu.getPreferredCanvasFormat(),this.configureContext(i),this.canvasContext=i,this.contexts.set("main",i),this.ops={Conv2d:(o,n,u)=>new ce(this,o,n,u),ConvTranspose2d:(o,n,u)=>new de(this,o,n,u),DepthwiseConv2d:(o,n,u)=>new me(this,o,n,u),Add:(o,n)=>new fe(this,o,n),Sigmoid:o=>new he(this,o),Tanh:o=>new _e(this,o),ElementwiseMul:(o,n)=>new ge(this,o,n),Warp:(o,n,u)=>new be(this,o,n,u),Stabilize:(o,n,u,p,l)=>new ve(this,o,n,u,p,l),BilinearUpsample:(o,n)=>new xe(this,o,n),Crop:(o,n)=>new ye(this,o,n),BicubicUpsample:(o,n)=>new we(this,o,n),ChannelConcat:(o,n)=>new ke(this,o,n),Conv2dAdd:(o,n,u,p)=>new Te(this,o,n,u,p),ProjResidual:(o,n,u,p)=>new We(this,o,n,u,p),ConcatConv2d:(o,n,u,p)=>new Ce(this,o,n,u,p),GatesFused:(o,n,u)=>new Pe(this,o,n,u),CandUpdateFused:(o,n,u,p,l)=>new Ge(this,o,n,u,p,l),ConvExpand:(o,n)=>new Be(this,o,n),CatConv6to2:(o,n,u)=>new Ue(this,o,n,u),DownAdapter:(o,n,u,p)=>new Se(this,o,n,u,p),UpFinal:(o,n,u)=>new Le(this,o,n,u),UpFinalSkip:(o,n,u,p)=>new Fe(this,o,n,u,p),UpsampleConcat:(o,n,u)=>new Ee(this,o,n,u),UpsampleConv1x1:(o,n,u)=>new De(this,o,n,u),UpsampleSigmoid:(o,n)=>new Oe(this,o,n),Input:(o,n)=>new He(this,o,n)},this.presenters={CompositeSolid:(o,n,u,p="main")=>{let l=new Ie(this,o,n,u);return{run:()=>{l.setOutput(this.getCurrentDisplayTexture(p)),l.run()}}},CompositeImage:(o,n,u,p="main")=>{let l=new Me(this,o,n,u);return{run:()=>{l.setOutput(this.getCurrentDisplayTexture(p)),l.run()}}},CompositeImageBilinear:(o,n,u,p="main")=>{let l=new Ae(this,o,n,u);return{run:()=>{l.setOutput(this.getCurrentDisplayTexture(p)),l.run()}}},CompositePassthrough:(o,n="main")=>{let u=new Re(this,o);return{run:()=>{u.setOutput(this.getCurrentDisplayTexture(n)),u.run()}}}}}configureContext(e){e.configure({device:this.device,format:this.canvasFormat,alphaMode:"premultiplied"})}attachCanvas(e,r){if(e==="main")throw new Error("attachCanvas: 'main' is reserved for the create() canvas");let t=r.getContext("webgpu");if(!t)throw new Error(\`attachCanvas: failed to get WebGPU context for target '\${e}'\`);this.configureContext(t),this.contexts.set(e,t)}static async isAvailable(){return navigator.gpu?await navigator.gpu.requestAdapter()!==null:!1}static async hasF16Support(){if(!navigator.gpu)return!1;let e=await navigator.gpu.requestAdapter();return e?e.features.has("shader-f16"):!1}static async create(e){let r=e.dtype??"f32",t=e.device;if(t){if(r==="f16"&&!t.features.has("shader-f16"))throw new Error("WebGPU dtype='f16' requested but supplied device lacks \`shader-f16\`")}else{let i=await navigator.gpu.requestAdapter();if(!i)throw new Error("WebGPU adapter not available");if(r==="f16"&&!i.features.has("shader-f16"))throw new Error("WebGPU dtype='f16' requested but adapter lacks \`shader-f16\` feature");t=await i.requestDevice({requiredFeatures:r==="f16"?["shader-f16"]:[]})}return new s(t,e.canvas,r)}getCurrentDisplayTexture(e="main"){let r=this.contexts.get(e);if(!r)throw new Error(\`getCurrentDisplayTexture: no canvas attached for target '\${e}'\`);return r.getCurrentTexture()}tensor(e,r,t,i){let n=e*r*t*this.bytesPerElement,u=this.device.createBuffer({size:n,usage:sa,mappedAtCreation:i!==void 0});if(i!==void 0){let p=u.getMappedRange();this.writeView(p,i),u.unmap()}return{h:e,w:r,c:t,buffer:u}}upload(e){let t=e.length*this.bytesPerElement,i=this.device.createBuffer({size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});return this.writeView(i.getMappedRange(),e),i.unmap(),{buffer:i}}writeView(e,r){let t=this.dtype==="f16",i=r instanceof Uint16Array;if(t===i){t?new Uint16Array(e).set(r):new Float32Array(e).set(r);return}t?new Uint16Array(e).set(le(r)):new Float32Array(e).set(A(r))}async readback(e){let r=this.device.createBuffer({size:e.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t=this.device.createCommandEncoder();t.copyBufferToBuffer(e.buffer,0,r,0,e.buffer.size),this.device.queue.submit([t.finish()]),await r.mapAsync(GPUMapMode.READ);let i=r.getMappedRange(),o=this.dtype==="f16"?A(new Uint16Array(i.slice(0))):new Float32Array(i.slice(0));return r.unmap(),r.destroy(),o}copyTensor(e,r){if(e.buffer.size!==r.buffer.size)throw new Error(\`copyTensor: size mismatch (src \${e.buffer.size} vs dst \${r.buffer.size})\`);let t=this.device.createCommandEncoder();t.copyBufferToBuffer(e.buffer,0,r.buffer,0,e.buffer.size),this.device.queue.submit([t.finish()])}async sync(){await this.device.queue.onSubmittedWorkDone()}destroy(){this.device.destroy()}};var ua=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,h=class{constructor(e){a(this,"backend",e);a(this,"shader","");a(this,"program");a(this,"samplers",[]);a(this,"uniformInts",{});a(this,"uniformFloats",{})}makeTexture(e,r,t){let i=this.backend.gl,o=this.backend.textureFormat,n=this.backend.toTextureView(e),u=i.createTexture();return i.bindTexture(i.TEXTURE_2D,u),i.texImage2D(i.TEXTURE_2D,0,o.internalFormat,r,t,0,o.format,o.type,n),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),u}defaultSetup(){let e=this.backend.gl,r=e.createShader(e.VERTEX_SHADER);e.shaderSource(r,ua),e.compileShader(r);let t=e.createShader(e.FRAGMENT_SHADER);if(e.shaderSource(t,this.shader),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))throw new Error(\`GLSL compile error: \${e.getShaderInfoLog(t)}\`);if(this.program=e.createProgram(),e.attachShader(this.program,r),e.attachShader(this.program,t),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw new Error(\`GLSL link error: \${e.getProgramInfoLog(this.program)}\`)}run(){let e=this.backend.gl;e.useProgram(this.program),this.samplers.forEach(({name:r,texture:t},i)=>{e.activeTexture(e.TEXTURE0+i),e.bindTexture(e.TEXTURE_2D,t),e.uniform1i(e.getUniformLocation(this.program,r),i)});for(let[r,t]of Object.entries(this.uniformInts))e.uniform1i(e.getUniformLocation(this.program,r),t);for(let[r,t]of Object.entries(this.uniformFloats))e.uniform1f(e.getUniformLocation(this.program,r),t);e.bindFramebuffer(e.FRAMEBUFFER,this.backend.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.output.texture,0),e.viewport(0,0,this.dispatch[0],this.dispatch[1]),e.bindVertexArray(null),e.drawArrays(e.TRIANGLES,0,6)}};var Nr=\`#version 300 es
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
\`;var ze=class extends h{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",Nr);let n=T(t.h,o.kernel,o.stride,o.padding),u=T(t.w,o.kernel,o.stride,o.padding),p=t.c/4,l=o.outChannels/4,c=W(o.padding,t.h,n,o.kernel,o.stride),d=W(o.padding,t.w,u,o.kernel,o.stride),_=m(i.weights),b=m(i.bias),g=this.makeTexture(_,p*4,o.kernel*o.kernel*l),v=this.makeTexture(b,l,1),x=u*l,k=this.makeTexture(null,x,n);this.output={h:n,w:u,c:o.outChannels,texture:k,texW:x,texH:n},this.inputs=[t],this.weights=[],this.samplers=[{name:"u_input",texture:t.texture},{name:"u_weights",texture:g},{name:"u_bias",texture:v}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_in_c_groups:p,u_out_c_groups:l,u_kernel_h:o.kernel,u_kernel_w:o.kernel,u_stride:o.stride,u_pad_top:c,u_pad_left:d,u_activation:o.activation==="relu6"?1:o.activation==="relu"?2:o.activation==="leaky"?3:0},this.defaultSetup(),this.dispatch=[x,n]}};var $r=\`#version 300 es
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
\`;var Ve=class extends h{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",$r);let n=R(t.h,o.kernel,o.stride,o.padding),u=R(t.w,o.kernel,o.stride,o.padding),p=t.c/4,l=o.outChannels/4,c=m(i.weights),d=m(i.bias),_=this.makeTexture(c,p*4,o.kernel*o.kernel*l),b=this.makeTexture(d,l,1),g=u*l,v=this.makeTexture(null,g,n);this.output={h:n,w:u,c:o.outChannels,texture:v,texW:g,texH:n},this.inputs=[t],this.weights=[],this.samplers=[{name:"u_input",texture:t.texture},{name:"u_weights",texture:_},{name:"u_bias",texture:b}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_in_c_groups:p,u_out_c_groups:l,u_kernel_h:o.kernel,u_kernel_w:o.kernel,u_stride:o.stride,u_pad_top:o.padding,u_pad_left:o.padding,u_activation:o.activation==="relu6"?1:o.activation==="relu"?2:o.activation==="leaky"?3:0},this.defaultSetup(),this.dispatch=[g,n]}};var Xr=\`#version 300 es
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
\`;var Ne=class extends h{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",Xr);let n=T(t.h,o.kernel,o.stride,o.padding),u=T(t.w,o.kernel,o.stride,o.padding),p=t.c/4,l=W(o.padding,t.h,n,o.kernel,o.stride),c=W(o.padding,t.w,u,o.kernel,o.stride),d=m(i.weights),_=m(i.bias),b=this.makeTexture(d,p,o.kernel*o.kernel),g=this.makeTexture(_,p,1),v=u*p,x=this.makeTexture(null,v,n);this.output={h:n,w:u,c:t.c,texture:x,texW:v,texH:n},this.inputs=[t],this.weights=[],this.samplers=[{name:"u_input",texture:t.texture},{name:"u_weights",texture:b},{name:"u_bias",texture:g}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_c_groups:p,u_kernel_h:o.kernel,u_kernel_w:o.kernel,u_stride:o.stride,u_pad_top:l,u_pad_left:c,u_apply_relu6:o.activation==="relu6"?1:0},this.defaultSetup(),this.dispatch=[v,n]}};var jr=\`#version 300 es
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
\`;var $e=class extends h{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",jr);let o=t,n=this.makeTexture(null,o.texW,o.texH);this.output={h:t.h,w:t.w,c:t.c,texture:n,texW:o.texW,texH:o.texH},this.inputs=[t,i],this.samplers=[{name:"u_input_a",texture:t.texture},{name:"u_input_b",texture:i.texture}],this.defaultSetup(),this.dispatch=[o.texW,o.texH]}};var qr=\`#version 300 es
// Element-wise sigmoid \\u2014 works on any texture layout (flat or spatial).

precision highp float;

uniform sampler2D u_input;

out vec4 fragColor;

void main() {
    vec4 x = texelFetch(u_input, ivec2(gl_FragCoord.xy), 0);
    fragColor = 1.0 / (1.0 + exp(-x));
}
\`;var Xe=class extends h{constructor(r,t){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",qr);let i=t,o=this.makeTexture(null,i.texW,i.texH);this.output={h:t.h,w:t.w,c:t.c,texture:o,texW:i.texW,texH:i.texH},this.inputs=[t],this.samplers=[{name:"u_input",texture:i.texture}],this.defaultSetup(),this.dispatch=[i.texW,i.texH]}};var Kr=\`#version 300 es
// Element-wise tanh \\u2014 used by ConvGRU candidate activation.
// Layout-agnostic (flat or spatial); GLSL tanh is element-wise on vec4.

precision highp float;

uniform sampler2D u_input;

out vec4 fragColor;

void main() {
    fragColor = tanh(texelFetch(u_input, ivec2(gl_FragCoord.xy), 0));
}
\`;var je=class extends h{constructor(r,t){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Kr);let i=t,o=this.makeTexture(null,i.texW,i.texH);this.output={h:t.h,w:t.w,c:t.c,texture:o,texW:i.texW,texH:i.texH},this.inputs=[t],this.samplers=[{name:"u_input",texture:i.texture}],this.defaultSetup(),this.dispatch=[i.texW,i.texH]}};var Yr=\`#version 300 es
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
\`;var qe=class extends h{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Yr);let o=t,n=this.makeTexture(null,o.texW,o.texH);this.output={h:t.h,w:t.w,c:t.c,texture:n,texW:o.texW,texH:o.texH},this.inputs=[t,i],this.samplers=[{name:"u_input_a",texture:t.texture},{name:"u_input_b",texture:i.texture}],this.defaultSetup(),this.dispatch=[o.texW,o.texH]}};var Qr=\`#version 300 es
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
\`;var Ke=class extends h{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Qr);let n=t.w,u=t.h,p=this.makeTexture(null,n,u);this.output={h:u,w:n,c:t.c,texture:p,texW:n,texH:u},this.inputs=[t,i],this.samplers=[{name:"u_source",texture:t.texture},{name:"u_flow",texture:i.texture}],this.uniformInts={u_w:n,u_h:u},this.uniformFloats={u_flow_scale:o.flowScale},this.defaultSetup(),this.dispatch=[n,u]}};var Jr=\`#version 300 es
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
\`;var Ye=class extends h{constructor(r,t,i,o,n,u){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Jr);let p=t.w,l=t.h,c=this.makeTexture(null,p,l);this.output={h:l,w:p,c:4,texture:c,texW:p,texH:l},this.inputs=[t,i,o,n],this.samplers=[{name:"u_flow",texture:t.texture},{name:"u_pred",texture:i.texture},{name:"u_ref",texture:o.texture},{name:"u_env_prev",texture:n.texture}],this.uniformInts={u_w:p,u_h:l,u_step_x:u.stepX,u_step_y:u.stepY},this.uniformFloats={u_t_lo:u.tLo,u_t_hi:u.tHi,u_leak:u.leak,u_release:u.release,u_t_div:u.tDiv,u_div_scale:u.divScale},this.defaultSetup(),this.dispatch=[p,l]}};var Zr=\`#version 300 es
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
\`;var Qe=class extends h{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",Zr);let o=t.c/4,n=i.outW*o,u=this.makeTexture(null,n,i.outH);this.output={h:i.outH,w:i.outW,c:t.c,texture:u,texW:n,texH:i.outH},this.inputs=[t],this.samplers=[{name:"u_input",texture:t.texture}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_out_w:i.outW,u_out_h:i.outH,u_c_groups:o},this.defaultSetup(),this.dispatch=[n,i.outH]}};var eo=\`#version 300 es
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
\`;var Je=class extends h{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",eo);let o=t.c/4,n=i.outW*o,u=this.makeTexture(null,n,i.outH);this.output={h:i.outH,w:i.outW,c:t.c,texture:u,texW:n,texH:i.outH},this.inputs=[t],this.samplers=[{name:"u_input",texture:t.texture}],this.defaultSetup(),this.dispatch=[n,i.outH]}};var to=\`#version 300 es
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
\`;var Ze=class extends h{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",to);let o=t.c/4,n=i.outW*o,u=this.makeTexture(null,n,i.outH);this.output={h:i.outH,w:i.outW,c:t.c,texture:u,texW:n,texH:i.outH},this.inputs=[t],this.samplers=[{name:"u_input",texture:t.texture}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_out_w:i.outW,u_out_h:i.outH,u_c_groups:o},this.defaultSetup(),this.dispatch=[n,i.outH]}};var ro=\`#version 300 es
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
\`;var et=class extends h{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",ro);let o=t.c/4,n=i.c/4,u=o+n,p=t.c+i.c,l=t.w*u,c=this.makeTexture(null,l,t.h);this.output={h:t.h,w:t.w,c:p,texture:c,texW:l,texH:t.h},this.inputs=[t,i],this.samplers=[{name:"u_input_a",texture:t.texture},{name:"u_input_b",texture:i.texture}],this.uniformInts={u_a_c_groups:o,u_b_c_groups:n},this.defaultSetup(),this.dispatch=[l,t.h]}};var oo=\`#version 300 es
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
\`;var tt=class extends h{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",oo);let o=t.c/4,n=i.outW*o,u=this.makeTexture(null,n,i.outH);this.output={h:i.outH,w:i.outW,c:t.c,texture:u,texW:n,texH:i.outH},this.inputs=[t],this.samplers=[{name:"u_input",texture:t.texture}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_out_w:i.outW,u_out_h:i.outH,u_c_groups:o},this.defaultSetup(),this.dispatch=[n,i.outH]}};var io=\`#version 300 es
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
\`;var rt=class extends h{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights",[]);a(this,"output");a(this,"dispatch");a(this,"shader",io);let n=t.c/4,u=i.c/4,p=n+u,l=t.c+i.c,c=o.outW*p,d=this.makeTexture(null,c,o.outH);this.output={h:o.outH,w:o.outW,c:l,texture:d,texW:c,texH:o.outH},this.inputs=[t,i],this.samplers=[{name:"u_input_a",texture:t.texture},{name:"u_input_b",texture:i.texture}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_out_w:o.outW,u_out_h:o.outH,u_a_c_groups:n,u_b_c_groups:u},this.defaultSetup(),this.dispatch=[c,o.outH]}};var ao=\`#version 300 es
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
\`;var ot=class extends h{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",ao);let n=t.c/4,u=o.outChannels/4,p=m(i.weights),l=m(i.bias),c=this.makeTexture(p,n*4,u),d=this.makeTexture(l,u,1),_=o.outW*u,b=this.makeTexture(null,_,o.outH);this.output={h:o.outH,w:o.outW,c:o.outChannels,texture:b,texW:_,texH:o.outH},this.inputs=[t],this.weights=[],this.samplers=[{name:"u_input",texture:t.texture},{name:"u_weights",texture:c},{name:"u_bias",texture:d}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_out_w:o.outW,u_out_h:o.outH,u_in_c_groups:n,u_out_c_groups:u,u_activation:o.activation==="relu6"?1:0},this.defaultSetup(),this.dispatch=[_,o.outH]}};var no=\`#version 300 es
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
\`;var it=class extends h{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",no);let u=T(t.h,n.kernel,n.stride,n.padding),p=T(t.w,n.kernel,n.stride,n.padding),l=t.c/4,c=n.outChannels/4,d=W(n.padding,t.h,u,n.kernel,n.stride),_=W(n.padding,t.w,p,n.kernel,n.stride),b=m(o.weights),g=m(o.bias),v=this.makeTexture(b,l*4,n.kernel*n.kernel*c),x=this.makeTexture(g,c,1),k=p*c,B=this.makeTexture(null,k,u);this.output={h:u,w:p,c:n.outChannels,texture:B,texW:k,texH:u},this.inputs=[t,i],this.weights=[],this.samplers=[{name:"u_input",texture:t.texture},{name:"u_skip",texture:i.texture},{name:"u_weights",texture:v},{name:"u_bias",texture:x}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_in_c_groups:l,u_out_c_groups:c,u_kernel_h:n.kernel,u_kernel_w:n.kernel,u_stride:n.stride,u_pad_top:d,u_pad_left:_,u_activation:n.activation==="relu6"?1:0},this.defaultSetup(),this.dispatch=[k,u]}};var so=\`#version 300 es
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
\`;var at=class extends h{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",so);let u=t.c/4,p=n.outChannels/4,l=m(o.weights),c=m(o.bias),d=this.makeTexture(l,u*4,p),_=this.makeTexture(c,p,1),b=t.w*p,g=this.makeTexture(null,b,t.h);this.output={h:t.h,w:t.w,c:n.outChannels,texture:g,texW:b,texH:t.h},this.inputs=[t,i],this.weights=[],this.samplers=[{name:"u_input",texture:t.texture},{name:"u_skip",texture:i.texture},{name:"u_weights",texture:d},{name:"u_bias",texture:_}],this.uniformInts={u_in_c_groups:u,u_out_c_groups:p},this.defaultSetup(),this.dispatch=[b,t.h]}};var uo=\`#version 300 es
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
\`;var nt=class extends h{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",uo);let u=t.c/4,p=i.c/4,l=u+p,c=n.outChannels/4,d=m(o.weights),_=m(o.bias),b=this.makeTexture(d,l*4,9*c),g=this.makeTexture(_,c,1),v=t.w*c,x=this.makeTexture(null,v,t.h);this.output={h:t.h,w:t.w,c:n.outChannels,texture:x,texW:v,texH:t.h},this.inputs=[t,i],this.weights=[],this.samplers=[{name:"u_a",texture:t.texture},{name:"u_b",texture:i.texture},{name:"u_weights",texture:b},{name:"u_bias",texture:g}],this.uniformInts={u_w:t.w,u_h:t.h,u_a_groups:u,u_b_groups:p,u_out_c_groups:c},this.defaultSetup(),this.dispatch=[v,t.h]}};var po=\`#version 300 es
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
\`;var st=class extends h{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",po);let n=this.makeTexture(m(o.weights),9,1),u=this.makeTexture(y(o.bias),1,1),p=t.w,l=this.makeTexture(null,p,t.h);this.output={h:t.h,w:t.w,c:4,texture:l,texW:p,texH:t.h},this.inputs=[t,i],this.weights=[],this.samplers=[{name:"u_u_in",texture:t.texture},{name:"u_h_prev",texture:i.texture},{name:"u_weights",texture:n},{name:"u_bias",texture:u}],this.uniformInts={u_w:t.w,u_h:t.h},this.defaultSetup(),this.dispatch=[p,t.h]}};var lo=\`#version 300 es
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
\`;var ut=class extends h{constructor(r,t,i,o,n,u){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",lo);let p=this.makeTexture(m(n.weights),9,1),l=this.makeTexture(y(n.bias),1,1),c=this.makeTexture(y(u),1,1),d=t.w,_=this.makeTexture(null,d,t.h);this.output={h:t.h,w:t.w,c:4,texture:_,texW:d,texH:t.h},this.inputs=[t,i,o],this.weights=[],this.samplers=[{name:"u_u_in",texture:t.texture},{name:"u_h_prev",texture:i.texture},{name:"u_gates_out",texture:o.texture},{name:"u_weights",texture:p},{name:"u_bias",texture:l},{name:"u_gamma",texture:c}],this.uniformInts={u_w:t.w,u_h:t.h},this.defaultSetup(),this.dispatch=[d,t.h]}};var co=\`#version 300 es
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
\`;var pt=class extends h{constructor(r,t,i){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",co);let o=t.c/4,n=this.makeTexture(m(i.weights),18*o,1),u=this.makeTexture(y(i.bias),1,1),p=t.w,l=this.makeTexture(null,p,t.h);this.output={h:t.h,w:t.w,c:4,texture:l,texW:p,texH:t.h},this.inputs=[t],this.weights=[],this.samplers=[{name:"u_input",texture:t.texture},{name:"u_weights",texture:n},{name:"u_bias",texture:u}],this.uniformInts={u_w:t.w,u_h:t.h,u_in_groups:o},this.defaultSetup(),this.dispatch=[p,t.h]}};var mo=\`#version 300 es
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
\`;var lt=class extends h{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",mo);let n=this.makeTexture(m(o.weights),27,1),u=this.makeTexture(y(o.bias),1,1),p=t.w,l=this.makeTexture(null,p,t.h);this.output={h:t.h,w:t.w,c:4,texture:l,texW:p,texH:t.h},this.inputs=[t,i],this.weights=[],this.samplers=[{name:"u_u_in",texture:t.texture},{name:"u_d_in",texture:i.texture},{name:"u_weights",texture:n},{name:"u_bias",texture:u}],this.uniformInts={u_w:t.w,u_h:t.h},this.defaultSetup(),this.dispatch=[p,t.h]}};var fo=\`#version 300 es
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
\`;var ct=class extends h{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",fo);let u=T(t.h,3,n.stride,1),p=T(t.w,3,n.stride,1),l=W(1,t.h,u,3,n.stride),c=this.makeTexture(m(i.weights),36,1),d=this.makeTexture(y(i.bias),1,1),_=this.makeTexture(m(o.weights),4,1),b=this.makeTexture(y(o.bias),1,1),g=p,v=this.makeTexture(null,g,u);this.output={h:u,w:p,c:4,texture:v,texW:g,texH:u},this.inputs=[t],this.weights=[],this.samplers=[{name:"u_input",texture:t.texture},{name:"u_down_w",texture:c},{name:"u_down_b",texture:d},{name:"u_adapt_w",texture:_},{name:"u_adapt_b",texture:b}],this.uniformInts={u_in_w:t.w,u_in_h:t.h,u_stride:n.stride,u_pad:l},this.defaultSetup(),this.dispatch=[g,u]}};var ho=\`#version 300 es
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
\`;var dt=class extends h{constructor(r,t,i,o){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",ho);let n=this.makeTexture(m(o.weights),18,1),u=this.makeTexture(y(o.bias),1,1),p=t.w,l=this.makeTexture(null,p,t.h);this.output={h:t.h,w:t.w,c:4,texture:l,texW:p,texH:t.h},this.inputs=[t,i],this.weights=[],this.samplers=[{name:"u_u_gru",texture:t.texture},{name:"u_rgb",texture:i.texture},{name:"u_weights",texture:n},{name:"u_bias",texture:u}],this.uniformInts={u_w:t.w,u_h:t.h},this.defaultSetup(),this.dispatch=[p,t.h]}};var _o=\`#version 300 es
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
\`;var mt=class extends h{constructor(r,t,i,o,n){super(r);a(this,"inputs");a(this,"weights");a(this,"output");a(this,"dispatch");a(this,"shader",_o);let u=this.makeTexture(m(n.weights),27,1),p=this.makeTexture(y(n.bias),1,1),l=t.w,c=this.makeTexture(null,l,t.h);this.output={h:t.h,w:t.w,c:4,texture:c,texW:l,texH:t.h},this.inputs=[t,i,o],this.weights=[],this.samplers=[{name:"u_u_gru",texture:t.texture},{name:"u_d_full",texture:i.texture},{name:"u_rgb",texture:o.texture},{name:"u_weights",texture:u},{name:"u_bias",texture:p}],this.uniformInts={u_w:t.w,u_h:t.h},this.defaultSetup(),this.dispatch=[l,t.h]}};var go=\`#version 300 es
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
\`;var Oa=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,ft=class{constructor(e,r,t,i){a(this,"backend",e);a(this,"program");a(this,"imageTex");a(this,"alphaTex");a(this,"bgColor");if(r.h!==t.h||r.w!==t.w)throw new Error(\`CompositeSolid: image (\${r.h}\\xD7\${r.w}) and alpha (\${t.h}\\xD7\${t.w}) must match. Run the upscaler first.\`);let o=r,n=t;this.imageTex=o.texture,this.alphaTex=n.texture,this.bgColor=i;let u=e.gl,p=u.createShader(u.VERTEX_SHADER);u.shaderSource(p,Oa),u.compileShader(p);let l=u.createShader(u.FRAGMENT_SHADER);if(u.shaderSource(l,go),u.compileShader(l),!u.getShaderParameter(l,u.COMPILE_STATUS))throw new Error(\`composite_solid GLSL compile error: \${u.getShaderInfoLog(l)}\`);if(this.program=u.createProgram(),u.attachShader(this.program,p),u.attachShader(this.program,l),u.linkProgram(this.program),!u.getProgramParameter(this.program,u.LINK_STATUS))throw new Error(\`composite_solid GLSL link error: \${u.getProgramInfoLog(this.program)}\`)}run(){let e=this.backend.gl;e.useProgram(this.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.imageTex),e.uniform1i(e.getUniformLocation(this.program,"u_image"),0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.alphaTex),e.uniform1i(e.getUniformLocation(this.program,"u_alpha"),1),e.uniform3f(e.getUniformLocation(this.program,"u_bgColor"),this.bgColor[0],this.bgColor[1],this.bgColor[2]),this.backend.bindDisplayFramebuffer(),e.bindVertexArray(null),e.drawArrays(e.TRIANGLES,0,6)}};var bo=\`#version 300 es
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
\`;var Ma=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,ht=class{constructor(e,r,t,i){a(this,"backend",e);a(this,"program");a(this,"imageTex");a(this,"alphaTex");a(this,"bgTex");if(r.h!==t.h||r.w!==t.w||r.h!==i.h||r.w!==i.w)throw new Error(\`CompositeImage: image (\${r.h}\\xD7\${r.w}), alpha (\${t.h}\\xD7\${t.w}), and bg (\${i.h}\\xD7\${i.w}) must all match. Run upscaler / resizer first.\`);this.imageTex=r.texture,this.alphaTex=t.texture,this.bgTex=i.texture;let o=e.gl,n=o.createShader(o.VERTEX_SHADER);o.shaderSource(n,Ma),o.compileShader(n);let u=o.createShader(o.FRAGMENT_SHADER);if(o.shaderSource(u,bo),o.compileShader(u),!o.getShaderParameter(u,o.COMPILE_STATUS))throw new Error(\`composite_image GLSL compile error: \${o.getShaderInfoLog(u)}\`);if(this.program=o.createProgram(),o.attachShader(this.program,n),o.attachShader(this.program,u),o.linkProgram(this.program),!o.getProgramParameter(this.program,o.LINK_STATUS))throw new Error(\`composite_image GLSL link error: \${o.getProgramInfoLog(this.program)}\`)}run(){let e=this.backend.gl;e.useProgram(this.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.imageTex),e.uniform1i(e.getUniformLocation(this.program,"u_image"),0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.alphaTex),e.uniform1i(e.getUniformLocation(this.program,"u_alpha"),1),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,this.bgTex),e.uniform1i(e.getUniformLocation(this.program,"u_bg"),2),this.backend.bindDisplayFramebuffer(),e.bindVertexArray(null),e.drawArrays(e.TRIANGLES,0,6)}};var vo=\`#version 300 es
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
\`;var Ra=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,_t=class{constructor(e,r,t,i){a(this,"backend",e);a(this,"program");a(this,"imageTex");a(this,"alphaTex");a(this,"bgTex");a(this,"outW");a(this,"outH");a(this,"bgW");a(this,"bgH");if(r.h!==t.h||r.w!==t.w)throw new Error(\`CompositeImageBilinear: image (\${r.h}\\xD7\${r.w}) and alpha (\${t.h}\\xD7\${t.w}) must match.\`);this.imageTex=r.texture,this.alphaTex=t.texture,this.bgTex=i.texture,this.outW=r.w,this.outH=r.h,this.bgW=i.w,this.bgH=i.h;let o=e.gl,n=o.createShader(o.VERTEX_SHADER);o.shaderSource(n,Ra),o.compileShader(n);let u=o.createShader(o.FRAGMENT_SHADER);if(o.shaderSource(u,vo),o.compileShader(u),!o.getShaderParameter(u,o.COMPILE_STATUS))throw new Error(\`composite_image_bilinear GLSL compile error: \${o.getShaderInfoLog(u)}\`);if(this.program=o.createProgram(),o.attachShader(this.program,n),o.attachShader(this.program,u),o.linkProgram(this.program),!o.getProgramParameter(this.program,o.LINK_STATUS))throw new Error(\`composite_image_bilinear GLSL link error: \${o.getProgramInfoLog(this.program)}\`)}run(){let e=this.backend.gl;e.useProgram(this.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.imageTex),e.uniform1i(e.getUniformLocation(this.program,"u_image"),0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.alphaTex),e.uniform1i(e.getUniformLocation(this.program,"u_alpha"),1),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,this.bgTex),e.uniform1i(e.getUniformLocation(this.program,"u_bg"),2),e.uniform1i(e.getUniformLocation(this.program,"u_out_w"),this.outW),e.uniform1i(e.getUniformLocation(this.program,"u_out_h"),this.outH),e.uniform1i(e.getUniformLocation(this.program,"u_bg_w"),this.bgW),e.uniform1i(e.getUniformLocation(this.program,"u_bg_h"),this.bgH),this.backend.bindDisplayFramebuffer(),e.bindVertexArray(null),e.drawArrays(e.TRIANGLES,0,6)}};var xo=\`#version 300 es
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
\`;var za=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,gt=class{constructor(e,r){a(this,"backend",e);a(this,"program");a(this,"imageTex");this.imageTex=r.texture;let t=e.gl,i=t.createShader(t.VERTEX_SHADER);t.shaderSource(i,za),t.compileShader(i);let o=t.createShader(t.FRAGMENT_SHADER);if(t.shaderSource(o,xo),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS))throw new Error(\`composite_passthrough GLSL compile error: \${t.getShaderInfoLog(o)}\`);if(this.program=t.createProgram(),t.attachShader(this.program,i),t.attachShader(this.program,o),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))throw new Error(\`composite_passthrough GLSL link error: \${t.getProgramInfoLog(this.program)}\`)}run(){let e=this.backend.gl;e.useProgram(this.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.imageTex),e.uniform1i(e.getUniformLocation(this.program,"u_image"),0),this.backend.bindDisplayFramebuffer(),e.bindVertexArray(null),e.drawArrays(e.TRIANGLES,0,6)}};var yo=\`#version 300 es
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
\`;var Na=\`#version 300 es
const vec2 VERTS[6] = vec2[6](
    vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0),
    vec2(-1.0,1.0),  vec2(1.0,-1.0), vec2(1.0,1.0)
);
void main() { gl_Position = vec4(VERTS[gl_VertexID], 0.0, 1.0); }\`,bt=class{constructor(e,r,t){a(this,"backend",e);a(this,"output");a(this,"gl");a(this,"program");a(this,"srcTex");a(this,"uOutW");a(this,"uOutH");a(this,"uSrc");a(this,"source",null);let i=e.gl;this.gl=i,this.output=e.tensor(r,t,4),this.srcTex=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.srcTex),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);let o=i.createShader(i.VERTEX_SHADER);i.shaderSource(o,Na),i.compileShader(o);let n=i.createShader(i.FRAGMENT_SHADER);if(i.shaderSource(n,yo),i.compileShader(n),!i.getShaderParameter(n,i.COMPILE_STATUS))throw new Error(\`Input GLSL compile error: \${i.getShaderInfoLog(n)}\`);if(this.program=i.createProgram(),i.attachShader(this.program,o),i.attachShader(this.program,n),i.linkProgram(this.program),!i.getProgramParameter(this.program,i.LINK_STATUS))throw new Error(\`Input GLSL link error: \${i.getProgramInfoLog(this.program)}\`);this.uSrc=i.getUniformLocation(this.program,"u_src"),this.uOutW=i.getUniformLocation(this.program,"u_out_w"),this.uOutH=i.getUniformLocation(this.program,"u_out_h")}setSource(e){this.source=e}run(){if(!this.source)throw new Error("InputWebGL.run() called before setSource()");let e=this.gl;e.bindTexture(e.TEXTURE_2D,this.srcTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.source),e.useProgram(this.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.srcTex),e.uniform1i(this.uSrc,0),e.uniform1i(this.uOutW,this.output.w),e.uniform1i(this.uOutH,this.output.h),e.bindFramebuffer(e.FRAMEBUFFER,this.backend.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.output.texture,0),e.viewport(0,0,this.output.texW,this.output.texH),e.bindVertexArray(null),e.drawArrays(e.TRIANGLES,0,6)}};var F=class s{constructor(e,r,t){a(this,"gl",e);a(this,"canvas",r);a(this,"dtype",t);a(this,"ops");a(this,"presenters");a(this,"fbo");a(this,"textureFormat");this.fbo=e.createFramebuffer(),this.textureFormat=t==="f16"?{internalFormat:e.RGBA16F,format:e.RGBA,type:e.HALF_FLOAT,bytesPerElement:2}:{internalFormat:e.RGBA32F,format:e.RGBA,type:e.FLOAT,bytesPerElement:4},this.ops={Conv2d:(i,o,n)=>new ze(this,i,o,n),ConvTranspose2d:(i,o,n)=>new Ve(this,i,o,n),DepthwiseConv2d:(i,o,n)=>new Ne(this,i,o,n),Add:(i,o)=>new $e(this,i,o),Sigmoid:i=>new Xe(this,i),Tanh:i=>new je(this,i),ElementwiseMul:(i,o)=>new qe(this,i,o),Warp:(i,o,n)=>new Ke(this,i,o,n),Stabilize:(i,o,n,u,p)=>new Ye(this,i,o,n,u,p),BilinearUpsample:(i,o)=>new Qe(this,i,o),Crop:(i,o)=>new Je(this,i,o),BicubicUpsample:(i,o)=>new Ze(this,i,o),ChannelConcat:(i,o)=>new et(this,i,o),Conv2dAdd:(i,o,n,u)=>new it(this,i,o,n,u),ProjResidual:(i,o,n,u)=>new at(this,i,o,n,u),ConcatConv2d:(i,o,n,u)=>new nt(this,i,o,n,u),GatesFused:(i,o,n)=>new st(this,i,o,n),CandUpdateFused:(i,o,n,u,p)=>new ut(this,i,o,n,u,p),ConvExpand:(i,o)=>new pt(this,i,o),CatConv6to2:(i,o,n)=>new lt(this,i,o,n),DownAdapter:(i,o,n,u)=>new ct(this,i,o,n,u),UpFinal:(i,o,n)=>new dt(this,i,o,n),UpFinalSkip:(i,o,n,u)=>new mt(this,i,o,n,u),UpsampleConcat:(i,o,n)=>new rt(this,i,o,n),UpsampleConv1x1:(i,o,n)=>new ot(this,i,o,n),UpsampleSigmoid:(i,o)=>new tt(this,i,o),Input:(i,o)=>new bt(this,i,o)},this.presenters={CompositeSolid:(i,o,n)=>new ft(this,i,o,n),CompositeImage:(i,o,n)=>new ht(this,i,o,n),CompositeImageBilinear:(i,o,n)=>new _t(this,i,o,n),CompositePassthrough:i=>new gt(this,i)}}static isAvailable(){let e=null;try{return e=new OffscreenCanvas(1,1).getContext("webgl2"),!(!e||!e.getExtension("EXT_color_buffer_float"))}catch{return!1}finally{e?.getExtension("WEBGL_lose_context")?.loseContext()}}static create(e){let r=e.canvas.getContext("webgl2");if(!r)throw new Error("WebGL2 not available");if(!r.getExtension("EXT_color_buffer_float"))throw new Error("EXT_color_buffer_float not available");return new s(r,e.canvas,e.dtype??"f32")}attachCanvas(e){throw new Error(\`WebGLBackend.attachCanvas('\${e}'): WebGL cannot render to a second canvas; use the renderer's snapshot-and-present path for preview output\`)}bindDisplayFramebuffer(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}toTextureView(e){if(e===null)return null;let r=this.dtype==="f16",t=e instanceof Uint16Array;return r===t?e:r?le(e):A(e)}tensor(e,r,t,i){let o=r*(t/4),n=e,u=this.gl,p=u.createTexture(),l=this.textureFormat,c=this.toTextureView(i??null);return u.bindTexture(u.TEXTURE_2D,p),u.texImage2D(u.TEXTURE_2D,0,l.internalFormat,o,n,0,l.format,l.type,c),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MIN_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MAG_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_S,u.CLAMP_TO_EDGE),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_T,u.CLAMP_TO_EDGE),{h:e,w:r,c:t,texture:p,texW:o,texH:n}}upload(e){return{data:e}}async readback(e){let r=this.gl,t=this.textureFormat;if(r.bindFramebuffer(r.FRAMEBUFFER,this.fbo),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,e.texture,0),this.dtype==="f16"){let o=new Uint16Array(e.texW*e.texH*4);return r.readPixels(0,0,e.texW,e.texH,t.format,r.HALF_FLOAT,o),r.bindFramebuffer(r.FRAMEBUFFER,null),A(o)}let i=new Float32Array(e.texW*e.texH*4);return r.readPixels(0,0,e.texW,e.texH,t.format,r.FLOAT,i),r.bindFramebuffer(r.FRAMEBUFFER,null),i}copyTensor(e,r){if(e.texW!==r.texW||e.texH!==r.texH)throw new Error(\`copyTensor: size mismatch (src \${e.texW}\\xD7\${e.texH} vs dst \${r.texW}\\xD7\${r.texH})\`);let t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e.texture,0),t.bindTexture(t.TEXTURE_2D,r.texture),t.copyTexSubImage2D(t.TEXTURE_2D,0,0,0,0,0,e.texW,e.texH),t.bindFramebuffer(t.FRAMEBUFFER,null)}async sync(){let e=this.gl,r=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0);if(!r){e.finish();return}for(e.flush();;){let t=e.clientWaitSync(r,0,0);if(t===e.ALREADY_SIGNALED||t===e.CONDITION_SATISFIED){e.deleteSync(r);return}if(t===e.WAIT_FAILED)throw e.deleteSync(r),new Error("WebGLBackend.sync: clientWaitSync returned WAIT_FAILED");await new Promise(i=>setTimeout(i,1))}}destroy(){this.gl.deleteFramebuffer(this.fbo),this.gl.getExtension("WEBGL_lose_context")?.loseContext()}};var Wt=S("setup_backend");async function wo(s,e,r={}){let t=s.backend==="webgpu"||s.backend==="auto",i=!!s.outputCanvas,o=()=>s.outputCanvas??new OffscreenCanvas(e.w,e.h),n=null;if(t&&await H.isAvailable()){let p=s.dtype==="f16"&&!await H.hasF16Support()?"f32":s.dtype,l=o();try{let c=await H.create({canvas:l,dtype:p});return c.device.lost.then(d=>{d.reason!=="destroyed"&&r.onContextLost?.({message:\`WebGPU device lost: \${d.reason}\${d.message?" \\u2014 "+d.message:""}\`,source:"backend-lost",recoverable:!1,cause:d})}).catch(()=>{}),{backend:c,resolvedBackend:"webgpu",resolvedDtype:p,canvas:l}}catch(c){Wt.warn("WebGPU isAvailable but create() threw; trying WebGL fallback:",c),n=c,i&&Wt.warn("transfer-capture topology: WebGL fallback may also fail on the same canvas")}}if(F.isAvailable()){let p=o();try{let l=F.create({canvas:p,dtype:s.dtype});return p.addEventListener("webglcontextlost",c=>{r.onContextLost?.({message:"WebGL context lost",source:"backend-lost",recoverable:!1,cause:c})}),{backend:l,resolvedBackend:"webgl",resolvedDtype:s.dtype,canvas:p}}catch(l){Wt.warn("WebGL create() threw:",l),n=l}}let u=n?\` (last error: \${n.message??n})\`:"";throw new Error(\`setup_backend: no usable GPU backend\${u}\`)}var ko=.5,$a=3,To=10,Xa=30,E=S("autotune");async function Wo(s,e=Xa){let r=s instanceof F?ko*.5:ko,t=1e3/e*r;E(\`start; budget per source frame: \${t.toFixed(1)}ms (source \${e}fps \\xD7 \${r} safety)\`),E("backend dtype:",s.dtype);let i=null;for(let o of wt){if(!I[o.model]){E("skip",o.model,"(no TIER_CONFIG entry)");continue}try{let n=I[o.model].baseRes;E(\`bench \${o.model} base @ \${n.w}\\xD7\${n.h} skipFrames=\${o.skipFrames} \\u2026\`);let u=await Ka(s,o),p=u<=t;if(E(\`  \${o.model}: \${u.toFixed(1)}ms / source frame \${p?"\\u2713 within budget":"\\u2717 over budget"}\`),(p||i===null)&&(i=o),!p)break}catch(n){E("  bench failed for",o.model,":",n);break}}if(!i)throw new Error("autotune: no implementable preset available");return E("picked",i.model),i}function ja(s){let e=Object.create(s);return e.ops={...s.ops,Conv2d:(r,t,i)=>{let o={weights:new Float32Array(i.kernel*i.kernel*r.c*i.outChannels),bias:new Float32Array(i.outChannels)};return s.ops.Conv2d(r,o,i)},DepthwiseConv2d:(r,t,i)=>{let o={weights:new Float32Array(i.kernel*i.kernel*r.c),bias:new Float32Array(r.c)};return s.ops.DepthwiseConv2d(r,o,i)},Conv2dAdd:(r,t,i,o)=>{let n={weights:new Float32Array(o.kernel*o.kernel*r.c*o.outChannels),bias:new Float32Array(o.outChannels)};return s.ops.Conv2dAdd(r,t,n,o)},UpsampleConv1x1:(r,t,i)=>{let o={weights:new Float32Array(r.c*i.outChannels),bias:new Float32Array(i.outChannels)};return s.ops.UpsampleConv1x1(r,o,i)},ProjResidual:(r,t,i,o)=>{let n={weights:new Float32Array(r.c*o.outChannels),bias:new Float32Array(o.outChannels)};return s.ops.ProjResidual(r,t,n,o)},ConcatConv2d:(r,t,i,o)=>{let n={weights:new Float32Array(9*(r.c+t.c)*o.outChannels),bias:new Float32Array(o.outChannels)};return s.ops.ConcatConv2d(r,t,n,o)}},e}function qa(){let s=new Proxy({},{get:()=>s});return s}async function Ka(s,e){let r=I[e.model];if(!r)throw new Error(\`microbench: no TIER_CONFIG entry for '\${e.model}'\`);let t=r.base,i=ja(s),o=i.tensor(r.baseRes.h,r.baseRes.w,4),n=new t(i,o,qa());for(let c=0;c<$a;c++)n.run(),await s.sync();let u=e.skipFrames+1,p=performance.now();for(let c=0;c<To;c++)c%u===0&&n.run();return await s.sync(),(performance.now()-p)/To}async function Co(s,e,r){let t;if(s==="auto")t=await Wo(r);else if(typeof s=="string"){let i=K(s);if(!i)throw new Error(\`resolve_preset: unknown preset name '\${s}'\`);t=i}else t=s;return t.dtype!==e?{...t,dtype:e}:t}function Po(s){let e=null,r=null;return s.onmessage=t=>{let{frame:i}=t.data;try{s.postMessage({type:"ack"})}catch{}if(r){let o=r;r=null,o(i)}else e&&e.close(),e=i},s.start?.(),new ReadableStream({pull(t){if(e){t.enqueue(e),e=null;return}return new Promise(i=>{r=o=>{t.enqueue(o),i()}})},cancel(){e&&(e.close(),e=null),s.close()}},{highWaterMark:0})}function Go(s){switch(s.topology.input){case"mstp":if(!s.inputReadable)throw new Error("create_input: topology.input='mstp' but InitData.inputReadable missing");return s.inputReadable;case"rvfc-postmessage":if(!s.inputPort)throw new Error("create_input: topology.input='rvfc-postmessage' but InitData.inputPort missing");return Po(s.inputPort)}}function Bo(s,e){return new TransformStream({transform(r,t){let i=null;try{s.process(r),i=new VideoFrame(s.canvas,{timestamp:r.timestamp})}finally{r.close()}try{t.enqueue(i)}catch(o){throw i.close(),o}e?.()}})}function Uo(s,e){return new WritableStream({write(r){try{s.process(r)}finally{r.close()}e?.()}})}function So(s,e,r){return new WritableStream({write(t){let i;try{s.process(t),i=s.canvas.transferToImageBitmap()}finally{t.close()}try{e.postMessage({bmp:i},[i])}catch(o){throw i.close(),o}r?.()},close(){e.close()}})}var Ya=S("create_output");function Lo(s,e,r,t){let i=t?()=>{let o=t;t=void 0,o?.()}:void 0;switch(s.topology.output){case"mstg":{if(!s.outputWritable)throw new Error("create_output: topology.output='mstg' but InitData.outputWritable missing");let o=Bo(e,i);return o.readable.pipeTo(s.outputWritable,{signal:r}).catch(n=>{r.aborted||Ya.warn("mstg downstream pipe failed:",n)}),o.writable}case"transfer-capture":return Uo(e,i);case"bitmap-shuttle":{if(!s.outputPort)throw new Error("create_output: topology.output='bitmap-shuttle' but InitData.outputPort missing");return So(e,s.outputPort,i)}}}function Fo(s){if(!s.onFirstFrame)return s.input.pipeTo(s.output,{signal:s.signal});let e=!1,r=s.onFirstFrame,t=new TransformStream({transform(i,o){o.enqueue(i),e||(e=!0,queueMicrotask(r))}});return s.input.pipeThrough(t,{signal:s.signal}).pipeTo(s.output,{signal:s.signal})}var C=S("worker");C("script loaded");var P=null,D=null,z=null,vt=null;self.onmessage=async function(s){let{cmd:e,data:r,request_id:t}=s.data;C("cmd received:",e,"request_id:",t);try{let i=await Qa(e,r);C("cmd ok:",e),ln(t,i)}catch(i){C("cmd FAILED:",e,i),cn(t,{message:\`\${e} failed: \${i.message??String(i)}\`,source:"worker",code:e==="init"||e==="startRender"?"bootstrap-failed":"command-failed",recoverable:!1})}};async function Qa(s,e){switch(s){case"init":return Ja(e);case"startRender":return Za(e.weights);case"setBackground":return en(e);case"setEnabled":return tn(e.enabled);case"setTemporalMode":return rn(e.mode);case"setPreset":return sn(e);case"getStats":return P?.getStats()??null;case"destroy":return un();case"attachPreview":return on(e);case"setPreview":return an(e);case"clearPreview":return nn();default:throw new Error(\`unknown cmd: \${s}\`)}}async function Ja(s){if(Ct(!!s.debug),C("handleInit: start; topology=",s.topology,"preset=",s.preset,"backend=",s.backend,"dtype=",s.dtype),P)throw new Error("handleInit: already initialized");C("handleInit: setupBackend\\u2026");let e=await wo(s,s.canvasSize,{onContextLost:n=>{C("GPU context lost:",n.message),X("error",{message:n.message,source:"backend-lost",code:"backend-lost",recoverable:!1})}});C("handleInit: backend ready:",e.resolvedBackend,e.resolvedDtype,"canvas:",e.canvas.width,"x",e.canvas.height),C("handleInit: constructing Renderer (boot mode)\\u2026"),P=new pe({backend:e.backend,backendKind:e.resolvedBackend,canvas:e.canvas,background:s.background,enabled:s.enabled,temporalMode:s.temporalMode,topology:s.topology}),D=new AbortController,C("handleInit: createInputStream\\u2026");let r=Go(s);C("handleInit: createOutputSink\\u2026");let t=Lo(s,P,D.signal,s.waitForFirstFrame?()=>X("ready",void 0):void 0),i=()=>{Fo({input:r,output:t,signal:D.signal}).then(()=>{C("pipe completed (input ended)")}).catch(n=>{if(D?.signal.aborted){C("pipe aborted (expected on destroy)");return}C("pipe FAILED:",n),X("error",{message:\`pipe failed: \${n.message}\`,source:"worker",code:"pipe-failed",recoverable:!1})})};s.waitForFirstFrame?(z=i,D.signal.addEventListener("abort",()=>{z&&(z=null,r.cancel().catch(()=>{}),t.abort().catch(()=>{}))},{once:!0})):i(),C("handleInit: resolvePreset\\u2026");let o=await Co(s.preset,e.resolvedDtype,e.backend);return C("handleInit: preset resolved:",o),vt=o,C("handleInit: done; returning InitResponse, awaiting startRender"),{resolvedPreset:o,resolvedBackend:e.resolvedBackend,resolvedDtype:e.resolvedDtype}}async function Za(s){if(C("handleStartRender: start; weights bytes:",s.byteLength),!P||!vt)throw new Error("handleStartRender: handleInit not completed");if(C("handleStartRender: attaching network via setPreset\\u2026"),P.setPreset(vt,s),C("handleStartRender: ready (effect mode active)"),z){let e=z;z=null,e()}else X("ready",void 0)}async function en(s){P?.setBackground(s)}async function tn(s){P?.setEnabled(s)}async function rn(s){if(s!=="stabilized"&&s!=="warp-only"&&s!=="off")throw new Error(\`handleSetTemporalMode: invalid mode '\${String(s)}'\`);if(!P)throw new Error("handleSetTemporalMode: not initialized");P.setTemporalMode(s)}async function on(s){if(!P)throw new Error("handleAttachPreview: not initialized");P.attachPreview(s.canvas)}async function an(s){if(!P)throw new Error("handleSetPreview: not initialized");P.setPreview(s.background,s.fps!==void 0?{fps:s.fps}:void 0)}async function nn(){P?.clearPreview()}async function sn(s){if(!P)throw new Error("handleSetPreset: not initialized");if(!s.weights)throw new Error("handleSetPreset: weights required for runtime preset swap");if(s.preset==="auto")throw new Error("handleSetPreset: 'auto' not supported on runtime swap (use at init for autotune)");let e=typeof s.preset=="string"?K(s.preset)??pn(s.preset):s.preset;return P.setPreset(e,s.weights),{resolvedPreset:e}}async function un(){D?.abort(),D=null,P?.destroy(),P=null,vt=null}function pn(s){throw new Error(\`handleSetPreset: unknown preset '\${s}'\`)}function ln(s,e){let r={request_id:s,res:e};self.postMessage(r)}function cn(s,e){let r={request_id:s,error:e};self.postMessage(r)}function X(s,e){let r={request_id:s,res:e};self.postMessage(r)}function Xg(s){X("stats",s)}export{Xg as emitStats};
`;var P=w("pipeline");function Mr(){{let a=new Blob([ye],{type:"application/javascript"}),t=URL.createObjectURL(a),e=new Worker(t,{type:"module"});return URL.revokeObjectURL(t),e}}var Or="./thirdparty/longpipe/models/v/0.0.4/",Dr={background:"blur",preset:"auto",weightsBaseUrl:Or,audio:"passthrough",enabled:true,temporalMode:"stabilized",adaptive:true,debug:false},Ke={w:1280,h:720};function zr(a,t){if(t)return t;let r=a.getVideoTracks()[0]?.getSettings()??{};return {w:r.width||Ke.w,h:r.height||Ke.h}}function Ye(a,t,e){let r=e==="f16"?".f16.bin":".bin";return `${a.replace(/\/$/,"")}/model_${t}${r}`}async function Qe(a,t,e){if(e==="f16"){let i=await fetch(Ye(a,t,"f16"));if(i.ok)return i.arrayBuffer()}let r=Ye(a,t,"f32"),n=await fetch(r);if(!n.ok)throw new Error(`weights fetch failed: ${n.status} ${r}`);return n.arrayBuffer()}var ke=class{stream;ready;controller;worker;inputCleanup;outputCleanup;adaptive=null;denoiser=null;bgCleanup=null;previewBgCleanup=null;destroyed=false;readySettled=false;rejectReady=null;constructor(t,e){let r={...Dr,...e};We(r.debug);let n=Fe(),i=Ne(n.input,t),o=zr(t,r.outputResolution),s=Xe(n.output,o);this.inputCleanup=i.cleanup,this.outputCleanup=s.cleanup;let u=Ge(r.audio),l;if(u.mode==="denoise"){let h=t.getAudioTracks()[0];h?(this.denoiser=new D(h,{model:u.denoise?.model??"auto",weightsBaseUrl:r.weightsBaseUrl,postFilterBeta:u.denoise?.postFilterBeta,gruLeak:u.denoise?.gruLeak,enabled:u.denoise?.enabled,onError:g=>r.onError?.({message:g,source:"audio",recoverable:true})}),l=this.denoiser.outputTrack):r.onError?.({message:'audio: "denoise" requested but the input stream has no audio track',source:"audio",recoverable:true});}this.stream=Ae(s.videoTrack,t,u,l),r.waitForFirstFrame||s.startPassthrough?.(t),this.worker=Mr(),this.controller=new H(this.worker),this.ready=new Promise((h,g)=>{this.rejectReady=g;let x=()=>{this.readySettled||(this.readySettled=true,this.rejectReady=null,P("ready handler invoked; resolving .ready"),r.onReady?.(),h());};this.controller.addPersistentListener("ready",()=>{r.waitForFirstFrame&&s.firstFrame?s.firstFrame.then(x):x();}),this.controller.addPersistentListener("error",y=>{console.error(`[longpipe/pipeline] error (${y.source}):`,y.message),!y.recoverable&&!this.readySettled&&(this.readySettled=true,this.rejectReady=null,g(new Error(y.message))),r.onError?.(y);});});let c={topology:n,preset:r.preset,enabled:r.enabled,waitForFirstFrame:!!r.waitForFirstFrame,temporalMode:r.temporalMode,backend:"auto",dtype:"f16",canvasSize:o,debug:r.debug,...i.initFields,...s.initFields},f=[...i.transferList,...s.transferList];this.bootstrap(c,r.background,f,r.weightsBaseUrl,r.adaptive,r.onError);}async bootstrap(t,e,r,n,i,o){try{P("normalizing background\u2026");let s=await A(e);if(this.destroyed){s.cleanup?.();return}this.bgCleanup=s.cleanup??null;let u={...t,background:s.background},l=[...r,...s.transferList??[]];P("sending init\u2026");let c=await this.controller.sendMessage("init",u,l);if(this.destroyed)return;P("init resolved:",c),P("fetching weights:",c.resolvedPreset.model,c.resolvedDtype);let f=await Qe(n,c.resolvedPreset.model,c.resolvedDtype);if(this.destroyed)return;P("weights bytes:",f.byteLength),P("sending startRender\u2026"),await this.controller.sendMessage("startRender",{weights:f},[f]),P("startRender resolved; awaiting first frame"),u.preset==="auto"&&i&&(this.adaptive=new G({backendKind:c.resolvedBackend,initialModel:c.resolvedPreset.model,fetchWeights:h=>Qe(n,h,c.resolvedDtype),getStats:()=>this.getStats(),swapPreset:async(h,g)=>{await this.controller.sendMessage("setPreset",{preset:h,weights:g},[g]);},onError:o}),this.adaptive.start());}catch(s){if(this.destroyed||s.pipelineReported)return;console.error("[longpipe/pipeline] bootstrap failed:",s),this.controller.handleMessage.call(this.controller,{data:{request_id:"error",res:{message:s.message??String(s),source:"worker",code:"bootstrap-failed",recoverable:false,cause:s}}});}}then(t,e){return this.ready.then(()=>t?t(this):this,e)}async setBackground(t){let e=await A(t);if(this.destroyed)throw e.cleanup?.(),new DOMException("LongPipe pipeline destroyed","AbortError");let r=this.bgCleanup,n=e.cleanup??null;this.bgCleanup=n;try{await this.controller.sendMessage("setBackground",e.background,e.transferList);}catch(i){throw e.cleanup?.(),this.bgCleanup===n&&(this.bgCleanup=r),i}r?.();}async setTemporalMode(t){await this.controller.sendMessage("setTemporalMode",{mode:t});}setPreset(t,e){this.controller.sendMessage("setPreset",{preset:t,weights:e}).catch(()=>{});}attachPreview(t){let e=t.transferControlToOffscreen();this.controller.sendMessage("attachPreview",{canvas:e},[e]).catch(()=>{});}async setPreview(t){let e=await A(t.background);if(this.destroyed)throw e.cleanup?.(),new DOMException("LongPipe pipeline destroyed","AbortError");let r=this.previewBgCleanup,n=e.cleanup??null;this.previewBgCleanup=n;try{await this.controller.sendMessage("setPreview",{background:e.background,fps:t.fps},e.transferList);}catch(i){throw e.cleanup?.(),this.previewBgCleanup===n&&(this.previewBgCleanup=r),i}r?.();}clearPreview(){this.controller.sendMessage("clearPreview",{}).catch(()=>{}),this.previewBgCleanup?.(),this.previewBgCleanup=null;}setEnabled(t){this.controller.sendMessage("setEnabled",{enabled:t}).catch(()=>{});}async getStats(){return this.controller.sendMessage("getStats",{})}setDenoise(t){if(this.denoiser){if(typeof t=="boolean"){this.denoiser.setEnabled(t);return}(t.postFilterBeta!=null||t.gruLeak!=null)&&this.denoiser.setConfig({postFilterBeta:t.postFilterBeta,gruLeak:t.gruLeak}),t.enabled!=null&&this.denoiser.setEnabled(t.enabled);}}getAudioStats(){return this.denoiser?.getStats()??null}destroy(){if(this.destroyed)return;this.destroyed=true,this.adaptive?.stop(),this.adaptive=null,this.denoiser?.destroy(),this.denoiser=null,this.bgCleanup?.(),this.bgCleanup=null,this.previewBgCleanup?.(),this.previewBgCleanup=null,this.readySettled||(this.readySettled=true,this.rejectReady?.(new DOMException("LongPipe pipeline destroyed","AbortError")),this.rejectReady=null);let t=this.controller;t.removePersistentListener("error"),t.sendMessage("destroy",{},[],1e3).catch(()=>{}).finally(()=>t.terminate()),this.inputCleanup(),this.outputCleanup();}};var B=new Float32Array(1),S=new Uint32Array(B.buffer);function Rr(a){B[0]=a;let t=S[0],e=t>>>16&32768,r=t&2147483647,n=(r>>>23)-127+15;if((t&2139095040)===2139095040)return (t&8388607)!==0?e|32256:e|31744;if(n>=31)return e|31744;if(n<=0){if(n<-10)return e;let l=r&8388607|8388608,c=14-n,f=l>>>c,h=l>>>c-1&1,g=(l&(1<<c-1)-1)!==0?1:0;return h&&(g||f&1)&&(f+=1),e|f}let i=r>>>13&1023,o=r>>>12&1,s=(r&4095)!==0?1:0,u=n<<10|i;return o&&(s||i&1)&&(u+=1,(u>>>10&31)===31)?e|31744:e|u}function Pe(a){let t=(a&32768)<<16,e=(a&31744)>>>10,r=a&1023;if(e===0){if(r===0)return S[0]=t,B[0];let n=r,i=1;for(;(n&1024)===0;)n<<=1,i-=1;return n&=1023,S[0]=t|i+127-15<<23|n<<13,B[0]}return e===31?(S[0]=t|2139095040|r<<13,B[0]):(S[0]=t|e+127-15<<23|r<<13,B[0])}function Je(a){let t=new Uint16Array(a.length);for(let e=0;e<a.length;e++)t[e]=Rr(a[e]);return t}function Ce(a){let t=new Float32Array(a.length);for(let e=0;e<a.length;e++)t[e]=Pe(a[e]);return t}var p=class{constructor(t){this.backend=t;}backend;shader="";pipeline;bindGroup;uniformDefs=[];uniformBuffers={};createUniform(t,e){this.uniformDefs.push({name:t,type:e});}setUniform(t,e){let r=this.backend.device.createBuffer({size:e.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:true});e instanceof Uint32Array?new Uint32Array(r.getMappedRange()).set(e):new Float32Array(r.getMappedRange()).set(e),r.unmap(),this.uniformBuffers[t]=r;}defaultBindGroup(){let t=[],e=0;for(let r of this.inputs)t.push({binding:e++,resource:{buffer:r.buffer}});for(let r of this.weights)t.push({binding:e++,resource:{buffer:r.buffer}});for(let r of this.uniformDefs)t.push({binding:e++,resource:{buffer:this.uniformBuffers[r.name]}});return t.push({binding:e,resource:{buffer:this.output.buffer}}),this.backend.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:t})}defaultSetup(){let t=this.backend.device.createShaderModule({code:this.shader});this.pipeline=this.backend.device.createComputePipeline({layout:"auto",compute:{module:t,entryPoint:"main"}}),this.bindGroup=this.defaultBindGroup();}run(){let t=this.backend.device.createCommandEncoder(),e=t.beginComputePass();e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.dispatchWorkgroups(...this.dispatch),e.end(),this.backend.device.queue.submit([t.finish()]);}};var Ze=`// Conv2d, output-channel-blocked (K=2) \u2014 drop-in replacement for conv2d.wgsl.
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
`;var et=`enable f16;

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
`;function _(a,t,e,r){return typeof r=="number"?Math.floor((a+2*r-t)/e)+1:r==="same"?Math.ceil(a/e):Math.floor((a-t)/e)+1}function Te(a,t,e,r){return (a-1)*e-2*r+t}function Vr(a,t,e,r){return Math.floor(Math.max((t-1)*r+e-a,0)/2)}function b(a,t,e,r,n){return typeof a=="number"?a:a==="same"?Vr(t,e,r,n):0}function d(a){return a instanceof Float32Array||a instanceof Uint16Array?a:new Float32Array(a)}function m(a){let t=Math.max(4,Math.ceil(a.length/4)*4),e=new Float32Array(t),r=a instanceof Uint16Array;for(let n=0;n<a.length;n++)e[n]=r?Pe(a[n]):a[n];return e}var L=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?et:Ze;let i=_(e.h,n.kernel,n.stride,n.padding),o=_(e.w,n.kernel,n.stride,n.padding),s=e.c/4,u=n.outChannels/4,l=b(n.padding,e.h,i,n.kernel,n.stride),c=b(n.padding,e.w,o,n.kernel,n.stride);this.output=t.tensor(i,o,n.outChannels),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(d(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,i,o,s,u,n.kernel,n.kernel,n.stride,l,c,n.activation==="relu6"?1:n.activation==="relu"?2:n.activation==="leaky"?3:0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/8),Math.ceil(i/8),Math.ceil(u/2)];}};var tt=`// ConvTranspose2d \u2014 gather form, f32 variant. See conv_transpose2d_f16.wgsl for
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
`;var rt=`enable f16;

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
`;var V=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?rt:tt;let i=Te(e.h,n.kernel,n.stride,n.padding),o=Te(e.w,n.kernel,n.stride,n.padding),s=e.c/4,u=n.outChannels/4;this.output=t.tensor(i,o,n.outChannels),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(d(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,i,o,s,u,n.kernel,n.kernel,n.stride,n.padding,n.padding,n.activation==="relu6"?1:n.activation==="relu"?2:n.activation==="leaky"?3:0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/8),Math.ceil(i/8),u];}};var nt=`// Depthwise Conv2d \u2014 groups = in_channels (each channel convolved independently).
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
`;var at=`enable f16;

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
`;var N=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?at:nt;let i=_(e.h,n.kernel,n.stride,n.padding),o=_(e.w,n.kernel,n.stride,n.padding),s=e.c/4,u=b(n.padding,e.h,i,n.kernel,n.stride),l=b(n.padding,e.w,o,n.kernel,n.stride);this.output=t.tensor(i,o,e.c),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(d(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,i,o,s,n.kernel,n.kernel,n.stride,u,l,n.activation==="relu6"?1:0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(o/8),Math.ceil(i/8),s];}};var it=`// Element-wise add of two tensors \u2014 used for residual connections in MBConv blocks.
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
`;var ot=`enable f16;

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
`;var $=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?ot:it;let n=e.h*e.w*e.c;this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e,r],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(n/256),1,1];}};var st=`// Element-wise sigmoid: output = 1 / (1 + exp(-x)).
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
`;var ut=`enable f16;

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
`;var j=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e){super(t),this.shader=t.dtype==="f16"?ut:st;let r=e.h*e.w*(e.c/4);this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([r,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r/256),1,1];}};var pt=`// Element-wise tanh \u2014 used by ConvGRU candidate activation.
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
`;var lt=`enable f16;

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
`;var q=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e){super(t),this.shader=t.dtype==="f16"?lt:pt;let r=e.h*e.w*(e.c/4);this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([r,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r/256),1,1];}};var ct=`// Element-wise multiply \u2014 used in ConvGRU for r \u2299 h_prev.
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
`;var dt=`enable f16;

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
`;var X=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?dt:ct;let n=e.h*e.w*e.c;this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e,r],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(n/256),1,1];}};var ft=`// Bilinear gather-warp (f32). See warp_f16.wgsl for the math.

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
`;var ht=`enable f16;

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
`;var K=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?ht:ft,this.output=t.tensor(e.h,e.w,e.c),this.inputs=[e,r],this.createUniform("params","Params");let i=new Uint32Array(3);i[0]=e.h,i[1]=e.w,new Float32Array(i.buffer)[2]=n.flowScale,this.setUniform("params",i),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var mt=`// Flow-gated temporal stabilizer (f32). See stabilize_f16.wgsl for the math.

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
`;var gt=`enable f16;

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
`;var Y=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r,n,i,o){super(t),this.shader=t.dtype==="f16"?gt:mt,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r,n,i],this.createUniform("params","Params");let s=new Uint32Array(10);s[0]=e.h,s[1]=e.w;let u=new Float32Array(s.buffer);u[2]=o.tLo,u[3]=o.tHi,u[4]=o.leak,u[5]=o.release,u[6]=o.tDiv,u[7]=o.divScale,s[8]=o.stepX,s[9]=o.stepY,this.setUniform("params",s),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var _t=`// Bilinear upsample (arbitrary ratio), align_corners=False (matches PyTorch default).
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
`;var bt=`enable f16;

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
`;var Q=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?bt:_t;let n=e.c/4;this.output=t.tensor(r.outH,r.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,r.outH,r.outW,n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r.outW/8),Math.ceil(r.outH/8),n];}};var vt=`// Top-left crop (f32). See crop_f16.wgsl.

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
`;var xt=`enable f16;

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
`;var J=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?xt:vt;let n=e.c/4;this.output=t.tensor(r.outH,r.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.w,r.outH,r.outW,n])),this.defaultSetup(),this.dispatch=[Math.ceil(r.outW/8),Math.ceil(r.outH/8),n];}};var wt=`// Bicubic upsample (arbitrary scale) \u2014 Keys cubic, a=-0.75 (PyTorch default
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
`;var yt=`enable f16;

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
`;var Z=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?yt:wt;let n=e.c/4;this.output=t.tensor(r.outH,r.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,r.outH,r.outW,n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r.outW/8),Math.ceil(r.outH/8),n];}};var kt=`// Channel concatenation: output = cat(A, B, dim=channel).
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
`;var Pt=`enable f16;

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
`;var ee=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?Pt:kt;let n=e.c/4,i=r.c/4,o=n+i;this.output=t.tensor(e.h,e.w,e.c+r.c),this.inputs=[e,r],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n,i,o,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),o];}};var Ct=`// Conv2d + skip add fused.
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
`;var Tt=`enable f16;

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
`;var te=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Tt:Ct;let o=_(e.h,i.kernel,i.stride,i.padding),s=_(e.w,i.kernel,i.stride,i.padding),u=e.c/4,l=i.outChannels/4,c=b(i.padding,e.h,o,i.kernel,i.stride),f=b(i.padding,e.w,s,i.kernel,i.stride);this.output=t.tensor(o,s,i.outChannels),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(d(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,s,u,l,i.kernel,i.kernel,i.stride,c,f,i.activation==="relu6"?1:0])),this.defaultSetup(),this.dispatch=[Math.ceil(s/8),Math.ceil(o/8),l];}};var Ut=`// proj_residual: bespoke 1\xD71 conv (no activation) + residual add, fused.
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
`;var Wt=`enable f16;

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
`;var re=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Wt:Ut;let o=e.c/4,s=i.outChannels/4;this.output=t.tensor(e.h,e.w,i.outChannels),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(d(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,s])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),s];}};var It=`// concat_conv2d: fuses [concat(a, b) \u2192 conv 3\xD73 (pad 1) \u2192 relu6] into one
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
`;var Bt=`enable f16;

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
`;var ne=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Bt:It;let o=e.c/4,s=r.c/4,u=i.outChannels/4;this.output=t.tensor(e.h,e.w,i.outChannels),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(d(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,s,u,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),u];}};var St=`// gates_fused: ConvGRU z + r gates, fused into one dispatch.
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
`;var Et=`enable f16;

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
`;var ae=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?Et:St,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(m(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var Ft=`// cand_update_fused: ConvGRU candidate path + state update + output, fused.
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
`;var Gt=`enable f16;

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
`;var ie=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i,o){super(t),this.shader=t.dtype==="f16"?Gt:Ft,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r,n],this.weights=[t.upload(d(i.weights)),t.upload(m(i.bias)),t.upload(m(o))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var At=`// conv_expand: bespoke N\u21922 conv 3\xD73 (pad 1) + relu (wrapper expand_feat).
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
`;var Mt=`enable f16;

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
`;var oe=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?Mt:At;let n=e.c/4;this.output=t.tensor(e.h,e.w,4),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(m(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var Ot=`// cat_conv_6to2: fused concat(u, d) + 6\u21922 conv 3\xD73 (pad 1) + relu (E up1_combine).
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
`;var Dt=`enable f16;

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
`;var se=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?Dt:Ot,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(m(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var zt=`// down_adapter: fused stride-N 3\xD73 conv (4\u21924) + relu + 1\xD71 adapter (4\u21923, no
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
`;var Rt=`enable f16;

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
`;var ue=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Rt:zt;let o=_(e.h,3,i.stride,1),s=_(e.w,3,i.stride,1),u=b(1,e.h,o,3,i.stride),l=b(1,e.w,s,3,i.stride);this.output=t.tensor(o,s,4),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(m(r.bias)),t.upload(d(n.weights)),t.upload(m(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,o,s,i.stride,u,l,0])),this.defaultSetup(),this.dispatch=[Math.ceil(s/8),Math.ceil(o/8),1];}};var Ht=`// up_final: fused concat(u, rgb) \u2192 conv 3\xD73 5\u21921 \u2192 sigmoid (A/B alpha head).
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
`;var Lt=`enable f16;

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
`;var pe=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?Lt:Ht,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r],this.weights=[t.upload(d(n.weights)),t.upload(m(n.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var Vt=`// up_final_skip: C/D alpha head. Fused concat(u, d_full, rgb) \u2192 conv 3\xD73 9\u21921
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
`;var Nt=`enable f16;

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
`;var le=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n,i){super(t),this.shader=t.dtype==="f16"?Nt:Vt,this.output=t.tensor(e.h,e.w,4),this.inputs=[e,r,n],this.weights=[t.upload(d(i.weights)),t.upload(m(i.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(e.w/8),Math.ceil(e.h/8),1];}};var $t=`// Bilinear upsample + channel concat fused.
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
`;var jt=`enable f16;

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
`;var ce=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?jt:$t;let i=e.c/4,o=r.c/4,s=i+o;this.output=t.tensor(n.outH,n.outW,e.c+r.c),this.inputs=[e,r],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n.outH,n.outW,i,o,s,0])),this.defaultSetup(),this.dispatch=[Math.ceil(n.outW/8),Math.ceil(n.outH/8),s];}};var qt=`// Bilinear upsample + 1\xD71 pointwise conv fused.
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
`;var Xt=`enable f16;

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
`;var de=class extends p{inputs;weights;output;dispatch;shader;constructor(t,e,r,n){super(t),this.shader=t.dtype==="f16"?Xt:qt;let i=e.c/4,o=n.outChannels/4;this.output=t.tensor(n.outH,n.outW,n.outChannels),this.inputs=[e],this.weights=[t.upload(d(r.weights)),t.upload(d(r.bias))],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,n.outH,n.outW,i,o,n.activation==="relu6"?1:0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(n.outW/8),Math.ceil(n.outH/8),o];}};var Kt=`// Bilinear upsample + sigmoid fused.
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
`;var Yt=`enable f16;

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
`;var fe=class extends p{inputs;weights=[];output;dispatch;shader;constructor(t,e,r){super(t),this.shader=t.dtype==="f16"?Yt:Kt;let n=e.c/4;this.output=t.tensor(r.outH,r.outW,e.c),this.inputs=[e],this.createUniform("params","Params"),this.setUniform("params",new Uint32Array([e.h,e.w,r.outH,r.outW,n,0,0,0])),this.defaultSetup(),this.dispatch=[Math.ceil(r.outW/8),Math.ceil(r.outH/8),n];}};var Qt=`// Composite an RGBA image over a solid background, gated by a 1-ch alpha.
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
`;var Jt=`enable f16;

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
`;var he=class{constructor(t,e,r,n){this.backend=t;if(e.h!==r.h||e.w!==r.w)throw new Error(`CompositeSolid: image (${e.h}\xD7${e.w}) and alpha (${r.h}\xD7${r.w}) must match. Run the upscaler first.`);let i=t.device;this.uniformBuffer=i.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let o=new ArrayBuffer(32);new Uint32Array(o,0,1)[0]=e.w,new Float32Array(o,16,4).set([n[0],n[1],n[2],0]),i.queue.writeBuffer(this.uniformBuffer,0,o);let s=t.dtype==="f16"?Jt:Qt,u=i.createShaderModule({code:s});this.pipeline=i.createRenderPipeline({layout:"auto",vertex:{module:u,entryPoint:"vs"},fragment:{module:u,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=i.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.buffer}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}}]});}backend;pipeline;bindGroup;uniformBuffer;outputView=null;setOutput(t){this.outputView=t.createView();}run(){if(!this.outputView)throw new Error("CompositeSolidWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),e=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.draw(6),e.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null;}};var Zt=`// Like composite_solid but bg is an NHWC vec4 storage buffer (e.g. virtual
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
`;var er=`enable f16;

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
`;var me=class{constructor(t,e,r,n){this.backend=t;if(e.h!==r.h||e.w!==r.w||e.h!==n.h||e.w!==n.w)throw new Error(`CompositeImage: image (${e.h}\xD7${e.w}), alpha (${r.h}\xD7${r.w}), and bg (${n.h}\xD7${n.w}) must all match. Run upscaler / resizer first.`);let i=t.device;this.uniformBuffer=i.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let o=new ArrayBuffer(16);new Uint32Array(o,0,1)[0]=e.w,i.queue.writeBuffer(this.uniformBuffer,0,o);let s=t.dtype==="f16"?er:Zt,u=i.createShaderModule({code:s});this.pipeline=i.createRenderPipeline({layout:"auto",vertex:{module:u,entryPoint:"vs"},fragment:{module:u,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=i.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.buffer}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:n.buffer}}]});}backend;pipeline;bindGroup;uniformBuffer;outputView=null;setOutput(t){this.outputView=t.createView();}run(){if(!this.outputView)throw new Error("CompositeImageWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),e=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.draw(6),e.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null;}};var tr=`// Like composite_image but bg is sampled bilinearly \u2014 bg may be smaller than
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
`;var rr=`enable f16;

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
`;var ge=class{constructor(t,e,r,n){this.backend=t;if(e.h!==r.h||e.w!==r.w)throw new Error(`CompositeImageBilinear: image (${e.h}\xD7${e.w}) and alpha (${r.h}\xD7${r.w}) must match.`);let i=t.device;this.uniformBuffer=i.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let o=new ArrayBuffer(16),s=new Uint32Array(o);s[0]=e.w,s[1]=e.h,s[2]=n.w,s[3]=n.h,i.queue.writeBuffer(this.uniformBuffer,0,o);let u=t.dtype==="f16"?rr:tr,l=i.createShaderModule({code:u});this.pipeline=i.createRenderPipeline({layout:"auto",vertex:{module:l,entryPoint:"vs"},fragment:{module:l,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=i.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.buffer}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:n.buffer}}]});}backend;pipeline;bindGroup;uniformBuffer;outputView=null;setOutput(t){this.outputView=t.createView();}run(){if(!this.outputView)throw new Error("CompositeImageBilinearWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),e=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.draw(6),e.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null;}};var nr=`// Passthrough "compositor" \u2014 writes the image directly to the canvas
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
`;var ar=`enable f16;

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
`;var _e=class{constructor(t,e){this.backend=t;let r=t.device;this.uniformBuffer=r.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(16);new Uint32Array(n,0,1)[0]=e.w,r.queue.writeBuffer(this.uniformBuffer,0,n);let i=t.dtype==="f16"?ar:nr,o=r.createShaderModule({code:i});this.pipeline=r.createRenderPipeline({layout:"auto",vertex:{module:o,entryPoint:"vs"},fragment:{module:o,entryPoint:"fs",targets:[{format:t.canvasFormat}]},primitive:{topology:"triangle-list"}}),this.bindGroup=r.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.buffer}},{binding:1,resource:{buffer:this.uniformBuffer}}]});}backend;pipeline;bindGroup;uniformBuffer;outputView=null;setOutput(t){this.outputView=t.createView();}run(){if(!this.outputView)throw new Error("CompositePassthroughWebGPU.run() called before setOutput()");let t=this.backend.device.createCommandEncoder(),e=t.beginRenderPass({colorAttachments:[{view:this.outputView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.draw(6),e.end(),this.backend.device.queue.submit([t.finish()]),this.outputView=null;}};var ir=`// Input op \u2014 sample a regular 2D source texture (RGBA8 unorm) into the NHWC
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
`;var or=`enable f16;

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
`;var sr=`// Input op \u2014 sample a GPUExternalTexture (zero-copy VideoFrame import) into
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
`;var ur=`enable f16;

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
`;var Zn=a=>typeof VideoFrame<"u"&&a instanceof VideoFrame,be=class{output;device;dtype;sampler;uniformBuffer;dispatch;pipeline2d=null;pipelineExternal=null;stagingTex=null;stagingW=0;stagingH=0;source=null;constructor(t,e,r){this.device=t.device,this.dtype=t.dtype,this.output=t.tensor(e,r,4),this.sampler=this.device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.uniformBuffer=this.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=new ArrayBuffer(16);new Uint32Array(n,0,2).set([r,e]),this.device.queue.writeBuffer(this.uniformBuffer,0,n),this.dispatch=[Math.ceil(r/8),Math.ceil(e/8),1],this.pipeline2d=this.buildPipeline(this.dtype==="f16"?or:ir);}setSource(t){this.source=t;}run(){if(!this.source)throw new Error("InputWebGPU.run() called before setSource()");Zn(this.source)?this.runExternal(this.source):this.run2d(this.source);}run2d(t){this.ensureStagingTexture(t.width,t.height),this.device.queue.copyExternalImageToTexture({source:t,flipY:false},{texture:this.stagingTex},[t.width,t.height]);let e=this.device.createBindGroup({layout:this.pipeline2d.getBindGroupLayout(0),entries:[{binding:0,resource:this.stagingTex.createView()},{binding:1,resource:this.sampler},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.output.buffer}}]});this.dispatchOnce(this.pipeline2d,e);}runExternal(t){this.pipelineExternal||(this.pipelineExternal=this.buildPipeline(this.dtype==="f16"?ur:sr));let e=this.device.importExternalTexture({source:t}),r=this.device.createBindGroup({layout:this.pipelineExternal.getBindGroupLayout(0),entries:[{binding:0,resource:e},{binding:1,resource:this.sampler},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.output.buffer}}]});this.dispatchOnce(this.pipelineExternal,r);}ensureStagingTexture(t,e){this.stagingTex&&this.stagingW===t&&this.stagingH===e||(this.stagingTex?.destroy(),this.stagingTex=this.device.createTexture({size:[t,e,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),this.stagingW=t,this.stagingH=e);}buildPipeline(t){let e=this.device.createShaderModule({code:t});return this.device.createComputePipeline({layout:"auto",compute:{module:e,entryPoint:"main"}})}dispatchOnce(t,e){let r=this.device.createCommandEncoder(),n=r.beginComputePass();n.setPipeline(t),n.setBindGroup(0,e),n.dispatchWorkgroups(...this.dispatch),n.end(),this.device.queue.submit([r.finish()]);}};var ea=navigator.gpu?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST:0,Ue=class a{constructor(t,e,r){this.device=t;this.canvas=e;this.dtype=r;this.bytesPerElement=r==="f16"?2:4;let n=e.getContext("webgpu");if(!n)throw new Error("Failed to get WebGPU context from canvas");this.canvasFormat=navigator.gpu.getPreferredCanvasFormat(),this.configureContext(n),this.canvasContext=n,this.contexts.set("main",n),this.ops={Conv2d:(i,o,s)=>new L(this,i,o,s),ConvTranspose2d:(i,o,s)=>new V(this,i,o,s),DepthwiseConv2d:(i,o,s)=>new N(this,i,o,s),Add:(i,o)=>new $(this,i,o),Sigmoid:i=>new j(this,i),Tanh:i=>new q(this,i),ElementwiseMul:(i,o)=>new X(this,i,o),Warp:(i,o,s)=>new K(this,i,o,s),Stabilize:(i,o,s,u,l)=>new Y(this,i,o,s,u,l),BilinearUpsample:(i,o)=>new Q(this,i,o),Crop:(i,o)=>new J(this,i,o),BicubicUpsample:(i,o)=>new Z(this,i,o),ChannelConcat:(i,o)=>new ee(this,i,o),Conv2dAdd:(i,o,s,u)=>new te(this,i,o,s,u),ProjResidual:(i,o,s,u)=>new re(this,i,o,s,u),ConcatConv2d:(i,o,s,u)=>new ne(this,i,o,s,u),GatesFused:(i,o,s)=>new ae(this,i,o,s),CandUpdateFused:(i,o,s,u,l)=>new ie(this,i,o,s,u,l),ConvExpand:(i,o)=>new oe(this,i,o),CatConv6to2:(i,o,s)=>new se(this,i,o,s),DownAdapter:(i,o,s,u)=>new ue(this,i,o,s,u),UpFinal:(i,o,s)=>new pe(this,i,o,s),UpFinalSkip:(i,o,s,u)=>new le(this,i,o,s,u),UpsampleConcat:(i,o,s)=>new ce(this,i,o,s),UpsampleConv1x1:(i,o,s)=>new de(this,i,o,s),UpsampleSigmoid:(i,o)=>new fe(this,i,o),Input:(i,o)=>new be(this,i,o)},this.presenters={CompositeSolid:(i,o,s,u="main")=>{let l=new he(this,i,o,s);return {run:()=>{l.setOutput(this.getCurrentDisplayTexture(u)),l.run();}}},CompositeImage:(i,o,s,u="main")=>{let l=new me(this,i,o,s);return {run:()=>{l.setOutput(this.getCurrentDisplayTexture(u)),l.run();}}},CompositeImageBilinear:(i,o,s,u="main")=>{let l=new ge(this,i,o,s);return {run:()=>{l.setOutput(this.getCurrentDisplayTexture(u)),l.run();}}},CompositePassthrough:(i,o="main")=>{let s=new _e(this,i);return {run:()=>{s.setOutput(this.getCurrentDisplayTexture(o)),s.run();}}}};}device;canvas;dtype;ops;presenters;canvasContext;canvasFormat;bytesPerElement;contexts=new Map;configureContext(t){t.configure({device:this.device,format:this.canvasFormat,alphaMode:"premultiplied"});}attachCanvas(t,e){if(t==="main")throw new Error("attachCanvas: 'main' is reserved for the create() canvas");let r=e.getContext("webgpu");if(!r)throw new Error(`attachCanvas: failed to get WebGPU context for target '${t}'`);this.configureContext(r),this.contexts.set(t,r);}static async isAvailable(){return navigator.gpu?await navigator.gpu.requestAdapter()!==null:false}static async hasF16Support(){if(!navigator.gpu)return  false;let t=await navigator.gpu.requestAdapter();return t?t.features.has("shader-f16"):false}static async create(t){let e=t.dtype??"f32",r=t.device;if(r){if(e==="f16"&&!r.features.has("shader-f16"))throw new Error("WebGPU dtype='f16' requested but supplied device lacks `shader-f16`")}else {let n=await navigator.gpu.requestAdapter();if(!n)throw new Error("WebGPU adapter not available");if(e==="f16"&&!n.features.has("shader-f16"))throw new Error("WebGPU dtype='f16' requested but adapter lacks `shader-f16` feature");r=await n.requestDevice({requiredFeatures:e==="f16"?["shader-f16"]:[]});}return new a(r,t.canvas,e)}getCurrentDisplayTexture(t="main"){let e=this.contexts.get(t);if(!e)throw new Error(`getCurrentDisplayTexture: no canvas attached for target '${t}'`);return e.getCurrentTexture()}tensor(t,e,r,n){let o=t*e*r*this.bytesPerElement,s=this.device.createBuffer({size:o,usage:ea,mappedAtCreation:n!==void 0});if(n!==void 0){let u=s.getMappedRange();this.writeView(u,n),s.unmap();}return {h:t,w:e,c:r,buffer:s}}upload(t){let r=t.length*this.bytesPerElement,n=this.device.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,mappedAtCreation:true});return this.writeView(n.getMappedRange(),t),n.unmap(),{buffer:n}}writeView(t,e){let r=this.dtype==="f16",n=e instanceof Uint16Array;if(r===n){r?new Uint16Array(t).set(e):new Float32Array(t).set(e);return}r?new Uint16Array(t).set(Je(e)):new Float32Array(t).set(Ce(e));}async readback(t){let e=this.device.createBuffer({size:t.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(t.buffer,0,e,0,t.buffer.size),this.device.queue.submit([r.finish()]),await e.mapAsync(GPUMapMode.READ);let n=e.getMappedRange(),i=this.dtype==="f16"?Ce(new Uint16Array(n.slice(0))):new Float32Array(n.slice(0));return e.unmap(),e.destroy(),i}copyTensor(t,e){if(t.buffer.size!==e.buffer.size)throw new Error(`copyTensor: size mismatch (src ${t.buffer.size} vs dst ${e.buffer.size})`);let r=this.device.createCommandEncoder();r.copyBufferToBuffer(t.buffer,0,e.buffer,0,t.buffer.size),this.device.queue.submit([r.finish()]);}async sync(){await this.device.queue.onSubmittedWorkDone();}destroy(){this.device.destroy();}};export{ke as EffectsPipeline,Ue as WebGPUBackend};