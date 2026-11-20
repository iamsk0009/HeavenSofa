import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{i as t}from"./three-vendor-Ba399cob.js";import{i as n}from"./three-vendor-9nEGx4lf.js";import{U as r,Yt as i,_t as a,ar as o,do as s,ea as c,jr as l,nt as u,ro as d,sr as f,ta as p}from"./three-vendor-BF58tRDi.js";import{r as m,t as h}from"./three-vendor-DLLf8Rfe.js";import{a as g,c as _,i as v,l as y,n as b,o as x,r as S,s as C,t as w}from"./three-vendor-Cg1G0-fE.js";import{a as T,i as E,n as D,o as O,r as k,s as A}from"./three-vendor-Ba-HMM-y.js";import{n as j,r as M,t as N}from"./three-vendor-BOiWr5ZR.js";var P=e(t()),F=0,I=n(e=>(a.onStart=(t,n,r)=>{e({active:!0,item:t,loaded:n,total:r,progress:(n-F)/(r-F)*100})},a.onLoad=()=>{e({active:!1})},a.onError=t=>e(e=>({errors:[...e.errors,t]})),a.onProgress=(t,n,r)=>{n===r&&(F=r),e({active:!0,item:t,loaded:n,total:r,progress:(n-F)/(r-F)*100||100})},{errors:[],active:!1,progress:0,item:``,loaded:0,total:0})),L=null,R=`https://www.gstatic.com/draco/versioned/decoders/1.5.5/`;function z(e=!0,t=!0,n){return r=>{n&&n(r),e&&(L||=new b,L.setDecoderPath(typeof e==`string`?e:R),r.setDRACOLoader(L)),t&&r.setMeshoptDecoder(typeof w==`function`?w():w)}}var B=(e,t,n,r)=>O(C,e,z(t,n,r));B.preload=(e,t,n,r)=>O.preload(C,e,z(t,n,r)),B.clear=e=>O.clear(C,e),B.setDecoderPath=e=>{R=e};var V=P.forwardRef(({makeDefault:e,camera:t,regress:n,domElement:r,enableDamping:i=!0,keyEvents:a=!1,onChange:o,onStart:s,onEnd:c,...l},u)=>{let d=A(e=>e.invalidate),f=A(e=>e.camera),p=A(e=>e.gl),m=A(e=>e.events),h=A(e=>e.setEvents),g=A(e=>e.set),v=A(e=>e.get),y=A(e=>e.performance),b=t||f,x=r||m.connected||p.domElement,S=P.useMemo(()=>new _(b),[b]);return T(()=>{S.enabled&&S.update()},-1),P.useEffect(()=>(a&&S.connect(a===!0?x:a),S.connect(x),()=>void S.dispose()),[a,x,n,S,d]),P.useEffect(()=>{let e=e=>{d(),n&&y.regress(),o&&o(e)},t=e=>{s&&s(e)},r=e=>{c&&c(e)};return S.addEventListener(`change`,e),S.addEventListener(`start`,t),S.addEventListener(`end`,r),()=>{S.removeEventListener(`start`,t),S.removeEventListener(`end`,r),S.removeEventListener(`change`,e)}},[o,s,c,S,d,h]),P.useEffect(()=>{if(e){let e=v().controls;return g({controls:S}),()=>g({controls:e})}},[e,S]),P.createElement(`primitive`,M({ref:u,object:S,enableDamping:i},l))}),ee=({focus:e=0,size:t=25,samples:n=10},r)=>{let i=r?`unpackRGBAToDepth( texture2D( shadowMap, uv + offset ) )`:`texture2D( shadowMap, uv + offset ).r`;return`
#define PENUMBRA_FILTER_SIZE float(${t})
#define RGB_NOISE_FUNCTION(uv) (randRGB(uv))
vec3 randRGB(vec2 uv) {
  return vec3(
    fract(sin(dot(uv, vec2(12.75613, 38.12123))) * 13234.76575),
    fract(sin(dot(uv, vec2(19.45531, 58.46547))) * 43678.23431),
    fract(sin(dot(uv, vec2(23.67817, 78.23121))) * 93567.23423)
  );
}

vec3 lowPassRandRGB(vec2 uv) {
  // 3x3 convolution (average)
  // can be implemented as separable with an extra buffer for a total of 6 samples instead of 9
  vec3 result = vec3(0);
  result += RGB_NOISE_FUNCTION(uv + vec2(-1.0, -1.0));
  result += RGB_NOISE_FUNCTION(uv + vec2(-1.0,  0.0));
  result += RGB_NOISE_FUNCTION(uv + vec2(-1.0, +1.0));
  result += RGB_NOISE_FUNCTION(uv + vec2( 0.0, -1.0));
  result += RGB_NOISE_FUNCTION(uv + vec2( 0.0,  0.0));
  result += RGB_NOISE_FUNCTION(uv + vec2( 0.0, +1.0));
  result += RGB_NOISE_FUNCTION(uv + vec2(+1.0, -1.0));
  result += RGB_NOISE_FUNCTION(uv + vec2(+1.0,  0.0));
  result += RGB_NOISE_FUNCTION(uv + vec2(+1.0, +1.0));
  result *= 0.111111111; // 1.0 / 9.0
  return result;
}
vec3 highPassRandRGB(vec2 uv) {
  // by subtracting the low-pass signal from the original signal, we're being left with the high-pass signal
  // hp(x) = x - lp(x)
  return RGB_NOISE_FUNCTION(uv) - lowPassRandRGB(uv) + 0.5;
}


vec2 pcssVogelDiskSample(int sampleIndex, int sampleCount, float angle) {
  const float goldenAngle = 2.399963f; // radians
  float r = sqrt(float(sampleIndex) + 0.5f) / sqrt(float(sampleCount));
  float theta = float(sampleIndex) * goldenAngle + angle;
  float sine = sin(theta);
  float cosine = cos(theta);
  return vec2(cosine, sine) * r;
}
float penumbraSize( const in float zReceiver, const in float zBlocker ) { // Parallel plane estimation
  return (zReceiver - zBlocker) / zBlocker;
}
float findBlocker(sampler2D shadowMap, vec2 uv, float compare, float angle) {
  float texelSize = 1.0 / float(textureSize(shadowMap, 0).x);
  float blockerDepthSum = float(${e});
  float blockers = 0.0;

  int j = 0;
  vec2 offset = vec2(0.);
  float depth = 0.;

  #pragma unroll_loop_start
  for(int i = 0; i < ${n}; i ++) {
    offset = (pcssVogelDiskSample(j, ${n}, angle) * texelSize) * 2.0 * PENUMBRA_FILTER_SIZE;
    depth = ${i};
    if (depth < compare) {
      blockerDepthSum += depth;
      blockers++;
    }
    j++;
  }
  #pragma unroll_loop_end

  if (blockers > 0.0) {
    return blockerDepthSum / blockers;
  }
  return -1.0;
}

        
float vogelFilter(sampler2D shadowMap, vec2 uv, float zReceiver, float filterRadius, float angle) {
  float texelSize = 1.0 / float(textureSize(shadowMap, 0).x);
  float shadow = 0.0f;
  int j = 0;
  vec2 vogelSample = vec2(0.0);
  vec2 offset = vec2(0.0);
  #pragma unroll_loop_start
  for (int i = 0; i < ${n}; i++) {
    vogelSample = pcssVogelDiskSample(j, ${n}, angle) * texelSize;
    offset = vogelSample * (1.0 + filterRadius * float(${t}));
    shadow += step( zReceiver, ${i} );
    j++;
  }
  #pragma unroll_loop_end
  return shadow * 1.0 / ${n}.0;
}

float PCSS (sampler2D shadowMap, vec4 coords) {
  vec2 uv = coords.xy;
  float zReceiver = coords.z; // Assumed to be eye-space z in this code
  float angle = highPassRandRGB(gl_FragCoord.xy).r * PI2;
  float avgBlockerDepth = findBlocker(shadowMap, uv, zReceiver, angle);
  if (avgBlockerDepth == -1.0) {
    return 1.0;
  }
  float penumbraRatio = penumbraSize(zReceiver, avgBlockerDepth);
  return vogelFilter(shadowMap, uv, zReceiver, 1.25 * penumbraRatio, angle);
}`};function H(e,t,n){t.traverse(t=>{t.material&&(Array.isArray(t.material)?t.material:[t.material]).forEach(t=>{e.properties.remove(t),t.dispose==null||t.dispose(),t.needsUpdate=!0})}),e.info.programs.length=0,e.compile(t,n)}function te({focus:e=0,samples:t=10,size:n=25}){let r=A(e=>e.gl),i=A(e=>e.scene),a=A(e=>e.camera);return P.useEffect(()=>{let o=h.shadowmap_pars_fragment,s=!o.includes(`sampler2DShadow`),c=o.lastIndexOf(`float getShadow( sampler2D shadowMap`),l=o.indexOf(`if ( frustumTest ) {`,c)+20;if(c<0||l<20){console.warn(`[SoftShadows] Could not find injection point in shadow shader`);return}let u=r.shadowMap.type;s||(r.shadowMap.type=0);let d=o.slice(c,l).includes(`shadowIntensity`)?`return mix( 1.0, PCSS( shadowMap, shadowCoord ), shadowIntensity );`:`return PCSS( shadowMap, shadowCoord );`,f=(o.slice(0,l)+`
`+d+o.slice(l)).replace(`#ifdef USE_SHADOWMAP`,`#ifdef USE_SHADOWMAP
`+ee({size:n,samples:t,focus:e},s));return h.shadowmap_pars_fragment=f,H(r,i,a),()=>{h.shadowmap_pars_fragment=o,r.shadowMap.type=u,H(r,i,a)}},[e,n,t]),null}var U={apartment:`lebombo_1k.hdr`,city:`potsdamer_platz_1k.hdr`,dawn:`kiara_1_dawn_1k.hdr`,forest:`forest_slope_1k.hdr`,lobby:`st_fagans_interior_1k.hdr`,night:`dikhololo_night_1k.hdr`,park:`rooitou_park_1k.hdr`,studio:`studio_small_03_1k.hdr`,sunset:`venice_sunset_1k.hdr`,warehouse:`empty_warehouse_01_1k.hdr`},W=`https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/`,G=e=>Array.isArray(e),K=[`/px.png`,`/nx.png`,`/py.png`,`/ny.png`,`/pz.png`,`/nz.png`];function q({files:e=K,path:t=``,preset:n=void 0,colorSpace:r=void 0,extensions:i}={}){n&&(J(n),e=U[n],t=W);let a=G(e),{extension:o,isCubemap:s}=Y(e),c=X(o);if(!c)throw Error(`useEnvironment: Unrecognized file extension: `+e);let l=A(e=>e.gl);(0,P.useLayoutEffect)(()=>{if(o!==`webp`&&o!==`jpg`&&o!==`jpeg`)return;function t(){O.clear(c,a?[e]:e)}l.domElement.addEventListener(`webglcontextlost`,t,{once:!0})},[e,l.domElement]);let u=O(c,a?[e]:e,e=>{(o===`webp`||o===`jpg`||o===`jpeg`)&&e.setRenderer(l),e.setPath==null||e.setPath(t),i&&i(e)}),d=a?u[0]:u;return(o===`jpg`||o===`jpeg`||o===`webp`)&&(d=d.renderTarget?.texture),d.mapping=s?301:303,d.colorSpace=r??(s?`srgb`:`srgb-linear`),d}var ne={files:K,path:``,preset:void 0,extensions:void 0};q.preload=e=>{let t={...ne,...e},{files:n,path:r=``}=t,{preset:i,extensions:a}=t;i&&(J(i),n=U[i],r=W);let{extension:o}=Y(n);if(o===`webp`||o===`jpg`||o===`jpeg`)throw Error(`useEnvironment: Preloading gainmaps is not supported`);let s=X(o);if(!s)throw Error(`useEnvironment: Unrecognized file extension: `+n);O.preload(s,G(n)?[n]:n,e=>{e.setPath==null||e.setPath(r),a&&a(e)})};var re={files:K,preset:void 0};q.clear=e=>{let t={...re,...e},{files:n}=t,{preset:r}=t;r&&(J(r),n=U[r]);let{extension:i}=Y(n),a=X(i);if(!a)throw Error(`useEnvironment: Unrecognized file extension: `+n);O.clear(a,G(n)?[n]:n)};function J(e){if(!(e in U))throw Error(`Preset must be one of: `+Object.keys(U).join(`, `))}function Y(e){var t;let n=G(e)&&e.length===6,r=G(e)&&e.length===3&&e.some(e=>e.endsWith(`json`)),i=G(e)?e[0]:e;return{extension:n?`cube`:r?`webp`:i.startsWith(`data:application/exr`)?`exr`:i.startsWith(`data:application/hdr`)?`hdr`:i.startsWith(`data:image/jpeg`)?`jpg`:(t=i.split(`.`).pop())==null||(t=t.split(`?`))==null||(t=t.shift())==null?void 0:t.toLowerCase(),isCubemap:n,isGainmap:r}}function X(e){return e===`cube`?u:e===`hdr`?v:e===`exr`?S:e===`jpg`||e===`jpeg`?j:e===`webp`?N:null}var ie=e=>e.current&&e.current.isScene,ae=e=>ie(e)?e.current:e;function Z(e,t,n,r,i={}){var a,o;i={backgroundBlurriness:0,backgroundIntensity:1,backgroundRotation:[0,0,0],environmentIntensity:1,environmentRotation:[0,0,0],...i};let s=ae(t||n),c=s.background,l=s.environment,u={backgroundBlurriness:s.backgroundBlurriness,backgroundIntensity:s.backgroundIntensity,backgroundRotation:((a=s.backgroundRotation)==null||a.clone==null?void 0:a.clone())??[0,0,0],environmentIntensity:s.environmentIntensity,environmentRotation:((o=s.environmentRotation)==null||o.clone==null?void 0:o.clone())??[0,0,0]};return e!==`only`&&(s.environment=r),e&&(s.background=r),D(s,i),()=>{e!==`only`&&(s.environment=l),e&&(s.background=c),D(s,u)}}function Q({scene:e,background:t=!1,map:n,...r}){let i=A(e=>e.scene);return P.useLayoutEffect(()=>{if(n)return Z(t,e,i,n,r)}),null}function $({background:e=!1,scene:t,blur:n,backgroundBlurriness:r,backgroundIntensity:i,backgroundRotation:a,environmentIntensity:o,environmentRotation:s,...c}){let l=q(c),u=A(e=>e.scene);return P.useLayoutEffect(()=>Z(e,t,u,l,{backgroundBlurriness:n??r,backgroundIntensity:i,backgroundRotation:a,environmentIntensity:o,environmentRotation:s})),P.useEffect(()=>()=>{l.dispose()},[l]),null}function oe({children:e,near:t=.1,far:n=1e3,resolution:r=256,frames:a=1,map:o,background:s=!1,blur:l,backgroundBlurriness:u,backgroundIntensity:d,backgroundRotation:f,environmentIntensity:p,environmentRotation:h,scene:g,files:_,path:v,preset:y=void 0,extensions:b}){let x=A(e=>e.gl),S=A(e=>e.scene),C=P.useRef(null),[w]=P.useState(()=>new c),E=P.useMemo(()=>{let e=new m(r);return e.texture.type=i,e},[r]);P.useEffect(()=>()=>{E.dispose()},[E]),P.useLayoutEffect(()=>{if(a===1){let e=x.autoClear;x.autoClear=!0,C.current.update(x,w),x.autoClear=e}return Z(s,g,S,E.texture,{backgroundBlurriness:l??u,backgroundIntensity:d,backgroundRotation:f,environmentIntensity:p,environmentRotation:h})},[e,w,E.texture,g,S,s,a,x]);let D=1;return T(()=>{if(a===1/0||D<a){let e=x.autoClear;x.autoClear=!0,C.current.update(x,w),x.autoClear=e,D++}}),P.createElement(P.Fragment,null,k(P.createElement(P.Fragment,null,e,P.createElement(`cubeCamera`,{ref:C,args:[t,n,E]}),_||y?P.createElement($,{background:!0,files:_,preset:y,path:v,extensions:b}):o?P.createElement(Q,{background:!0,map:o,extensions:b}):null),w))}function se(e){let t=q(e),n=e.map||t;P.useMemo(()=>E({GroundProjectedEnvImpl:y}),[]),P.useEffect(()=>()=>{t.dispose()},[t]);let r=P.useMemo(()=>[n],[n]),i=e.ground?.height,a=e.ground?.radius,o=e.ground?.scale??1e3;return P.createElement(P.Fragment,null,P.createElement(Q,M({},e,{map:n})),P.createElement(`groundProjectedEnvImpl`,{args:r,scale:o,height:i,radius:a}))}function ce(e){return e.ground?P.createElement(se,e):e.map?P.createElement(Q,e):e.children?P.createElement(oe,e):P.createElement($,e)}var le=P.forwardRef(({scale:e=10,frames:t=1/0,opacity:n=1,width:i=1,height:a=1,blur:c=1,near:u=0,far:d=10,resolution:m=512,smooth:h=!0,color:_=`#000000`,depthWrite:v=!1,renderOrder:y,...b},S)=>{let C=P.useRef(null),w=A(e=>e.scene),E=A(e=>e.gl),D=P.useRef(null);i*=Array.isArray(e)?e[0]:e||1,a*=Array.isArray(e)?e[1]:e||1;let[O,k,j,N,F,I,L]=P.useMemo(()=>{let e=new s(m,m),t=new s(m,m);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let n=new l(i,a).rotateX(Math.PI/2),c=new o(n),u=new f;u.depthTest=u.depthWrite=!1,u.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new r(_)}},e.fragmentShader=e.fragmentShader.replace(`void main() {`,`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace(`vec4( vec3( 1.0 - fragCoordZ ), opacity );`,`vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );`)};let d=new p(x),h=new p(g);return h.depthTest=d.depthTest=!1,[e,n,u,c,d,h,t]},[m,i,a,e,_]),R=e=>{N.visible=!0,N.material=F,F.uniforms.tDiffuse.value=O.texture,F.uniforms.h.value=e*1/256,E.setRenderTarget(L),E.render(N,D.current),N.material=I,I.uniforms.tDiffuse.value=L.texture,I.uniforms.v.value=e*1/256,E.setRenderTarget(O),E.render(N,D.current),N.visible=!1},z=0,B,V;return T(()=>{D.current&&(t===1/0||z<t)&&(z++,B=w.background,V=w.overrideMaterial,C.current.visible=!1,w.background=null,w.overrideMaterial=j,E.setRenderTarget(O),E.render(w,D.current),R(c),h&&R(c*.4),E.setRenderTarget(null),C.current.visible=!0,w.overrideMaterial=V,w.background=B)}),P.useImperativeHandle(S,()=>C.current,[]),P.createElement(`group`,M({"rotation-x":Math.PI/2},b,{ref:C}),P.createElement(`mesh`,{renderOrder:y,geometry:k,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},P.createElement(`meshBasicMaterial`,{transparent:!0,map:O.texture,opacity:n,depthWrite:v})),P.createElement(`orthographicCamera`,{ref:D,args:[-i/2,i/2,a/2,-a/2,u,d]}))}),ue=P.forwardRef(({light:e,args:t,map:n,toneMapped:r=!1,color:i=`white`,form:a=`rect`,intensity:o=1,scale:s=1,target:c=[0,0,0],children:l,...u},f)=>{let p=P.useRef(null);return P.useImperativeHandle(f,()=>p.current,[]),P.useLayoutEffect(()=>{!l&&!u.material&&(D(p.current.material,{color:i}),p.current.material.color.multiplyScalar(o))},[i,o,l,u.material]),P.useLayoutEffect(()=>{u.rotation||p.current.quaternion.identity(),c&&!u.rotation&&(typeof c==`boolean`?p.current.lookAt(0,0,0):p.current.lookAt(Array.isArray(c)?new d(...c):c))},[c,u.rotation]),s=Array.isArray(s)&&s.length===2?[s[0],s[1],1]:s,P.createElement(`mesh`,M({ref:p,scale:s},u),a===`circle`?P.createElement(`ringGeometry`,{args:t||[0,.5,64]}):a===`ring`?P.createElement(`ringGeometry`,{args:t||[.25,.5,64]}):a===`rect`||a===`plane`?P.createElement(`planeGeometry`,{args:t||[1,1]}):a===`box`?P.createElement(`boxGeometry`,{args:t||[1,1,1]}):P.createElement(a,{args:t}),l||P.createElement(`meshBasicMaterial`,{toneMapped:r,map:n,side:2}),e&&P.createElement(`pointLight`,M({castShadow:!0},e)))});export{V as a,te as i,le as n,B as o,ce as r,I as s,ue as t};