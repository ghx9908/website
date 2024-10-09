"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2320],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var a=n(7294);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,c=function(e,t){if(null==e)return{};var n,a,c={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(c[n]=e[n]);return c}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(c[n]=e[n])}return c}var o=a.createContext({}),p=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(o.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var n=e.components,c=e.mdxType,l=e.originalType,o=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),f=p(n),d=c,h=f["".concat(o,".").concat(d)]||f[d]||s[d]||l;return n?a.createElement(h,r(r({ref:t},u),{},{components:n})):a.createElement(h,r({ref:t},u))}));function d(e,t){var n=arguments,c=t&&t.mdxType;if("string"==typeof e||c){var l=n.length,r=new Array(l);r[0]=f;var i={};for(var o in t)hasOwnProperty.call(t,o)&&(i[o]=t[o]);i.originalType=e,i.mdxType="string"==typeof e?e:c,r[1]=i;for(var p=2;p<l;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}f.displayName="MDXCreateElement"},8077:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>r,default:()=>s,frontMatter:()=>l,metadata:()=>i,toc:()=>p});var a=n(7462),c=(n(7294),n(3905));const l={title:"5\u3001watch & WatchEffect\u6e90\u7801\u89e3\u8bfb",tags:["Vue.js"]},r=void 0,i={unversionedId:"05watch-2",id:"05watch-2",title:"5\u3001watch & WatchEffect\u6e90\u7801\u89e3\u8bfb",description:"\u6211\u4eec\u4e4b\u524d\u4f7f\u7528\u7684 watch \u51fd\u6570\u662f\u548c Vue \u7ec4\u4ef6\u4ee5\u53ca\u751f\u547d\u5468\u671f\u4e00\u8d77\u5b9e\u73b0\u7684\uff0c\u4ed6\u4eec\u662f\u6df1\u5ea6\u7ed1\u5b9a\u7684\uff0c\u6240\u4ee5 watch \u51fd\u6570\u4ee3\u7801\u7684\u4f4d\u7f6e\u5728 vue \u6e90\u7801\u4e2d\u7684 runtime-core \u6a21\u5757\u4e2d\u3002",source:"@site/vue/05watch-2.md",sourceDirName:".",slug:"/05watch-2",permalink:"/website/vue/05watch-2",draft:!1,tags:[{label:"Vue.js",permalink:"/website/vue/tags/vue-js"}],version:"current",frontMatter:{title:"5\u3001watch & WatchEffect\u6e90\u7801\u89e3\u8bfb",tags:["Vue.js"]},sidebar:"tutorialSidebar",previous:{title:"5\u3001watch & WatchEffect",permalink:"/website/vue/05watch-1"},next:{title:"6\u3001Vue3\u6e32\u67d3\u539f\u7406",permalink:"/website/vue/06Vue3\u6e32\u67d3\u539f\u7406"}},o={},p=[{value:"\u4e00\u3001<code>watch</code> \u4e0e <code>watchEffect</code>",id:"\u4e00watch-\u4e0e-watcheffect",level:2},{value:"1.1 <code>watch</code> \u548c <code>watchEffect</code> \u7684\u533a\u522b",id:"11-watch-\u548c-watcheffect-\u7684\u533a\u522b",level:3},{value:"1.2 watchEffect",id:"12-watcheffect",level:3},{value:"1.3 watch",id:"13-watch",level:3},{value:"1.4 doWatch",id:"14-dowatch",level:3},{value:"\u4e8c\u3001<code>watch</code> \u7684\u6838\u5fc3\u903b\u8f91",id:"\u4e8cwatch-\u7684\u6838\u5fc3\u903b\u8f91",level:2},{value:"2.1 <code>watch</code> \u6838\u5fc3\u903b\u8f91",id:"21-watch-\u6838\u5fc3\u903b\u8f91",level:3},{value:"2.2 <code>getter</code> \u51fd\u6570",id:"22-getter-\u51fd\u6570",level:3},{value:"2.3\u3001<code>scheduler</code> \u8c03\u5ea6\u5668",id:"23scheduler-\u8c03\u5ea6\u5668",level:3},{value:"2.4 \u6df1\u5ea6\u76d1\u542c\u5904\u7406",id:"24-\u6df1\u5ea6\u76d1\u542c\u5904\u7406",level:3},{value:"2.5 \u521d\u59cb\u8fd0\u884c",id:"25-\u521d\u59cb\u8fd0\u884c",level:3},{value:"2.6 \u6267\u884c\u4e00\u6b21",id:"26-\u6267\u884c\u4e00\u6b21",level:3},{value:"2.7 \u6e05\u7406\u51fd\u6570 <code>cleanup</code>",id:"27-\u6e05\u7406\u51fd\u6570-cleanup",level:3},{value:"\u4e09\u3001<code>onWatcherCleanup</code> \u6e05\u7406\u673a\u5236",id:"\u4e09onwatchercleanup-\u6e05\u7406\u673a\u5236",level:2},{value:"3.1 <code>onWatcherCleanup</code> \u6e90\u7801\u89e3\u6790",id:"31-onwatchercleanup-\u6e90\u7801\u89e3\u6790",level:3},{value:"3.2 \u6e05\u7406\u673a\u5236\u7684\u5de5\u4f5c\u539f\u7406",id:"32-\u6e05\u7406\u673a\u5236\u7684\u5de5\u4f5c\u539f\u7406",level:3}],u={toc:p};function s(e){let{components:t,...n}=e;return(0,c.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("blockquote",null,(0,c.kt)("p",{parentName:"blockquote"},"\u6211\u4eec\u4e4b\u524d\u4f7f\u7528\u7684 watch \u51fd\u6570\u662f\u548c Vue \u7ec4\u4ef6\u4ee5\u53ca\u751f\u547d\u5468\u671f\u4e00\u8d77\u5b9e\u73b0\u7684\uff0c\u4ed6\u4eec\u662f\u6df1\u5ea6\u7ed1\u5b9a\u7684\uff0c\u6240\u4ee5 watch \u51fd\u6570\u4ee3\u7801\u7684\u4f4d\u7f6e\u5728 vue \u6e90\u7801\u4e2d\u7684 runtime-core \u6a21\u5757\u4e2d\u3002\n\u5728 3.5 \u7248\u672c\u4e2d\u91cd\u6784\u4e86\u4e00\u4e2a base watch \u51fd\u6570\uff0c\u8fd9\u4e2a\u51fd\u6570\u7684\u5b9e\u73b0\u548c vue \u7ec4\u4ef6\u6ca1\u6709\u4e00\u6bdb\u94b1\u5173\u7cfb\uff0c\u6240\u4ee5\u4ed6\u662f\u5728 reactivity \u6a21\u5757\u4e2d\u3002")),(0,c.kt)("h2",{id:"\u4e00watch-\u4e0e-watcheffect"},"\u4e00\u3001",(0,c.kt)("inlineCode",{parentName:"h2"},"watch")," \u4e0e ",(0,c.kt)("inlineCode",{parentName:"h2"},"watchEffect")),(0,c.kt)("p",null,(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u548c ",(0,c.kt)("inlineCode",{parentName:"p"},"watchEffect")," \u662f Vue 3 \u7684\u4e24\u4e2a\u6838\u5fc3 API\uff0c\u5e2e\u52a9\u6211\u4eec\u76d1\u542c\u548c\u8ffd\u8e2a\u54cd\u5e94\u5f0f\u6570\u636e\u7684\u53d8\u5316\u3002\u5b83\u4eec\u7684\u5b9e\u73b0\u57fa\u4e8e Vue \u5185\u90e8\u7684\u54cd\u5e94\u5f0f\u7cfb\u7edf\uff0c\u901a\u8fc7\u4f9d\u8d56\u6536\u96c6\u673a\u5236\u8ffd\u8e2a\u6570\u636e\u7684\u53d8\u5316\u3002\u5176\u80cc\u540e\u7684\u5b9e\u73b0\u4f9d\u8d56 Vue \u5185\u90e8\u7684 ",(0,c.kt)("inlineCode",{parentName:"p"},"ReactiveEffect")," \u7c7b\uff0c\u901a\u8fc7\u5b83\u521b\u5efa\u526f\u4f5c\u7528\u51fd\u6570\u3002"),(0,c.kt)("h3",{id:"11-watch-\u548c-watcheffect-\u7684\u533a\u522b"},"1.1 ",(0,c.kt)("inlineCode",{parentName:"h3"},"watch")," \u548c ",(0,c.kt)("inlineCode",{parentName:"h3"},"watchEffect")," \u7684\u533a\u522b"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("strong",{parentName:"li"},(0,c.kt)("inlineCode",{parentName:"strong"},"watch"))," \u9700\u8981\u663e\u5f0f\u58f0\u660e\u76d1\u542c\u7684\u76ee\u6807\uff0c\u4ee5\u53ca\u53d8\u5316\u540e\u7684\u56de\u8c03\u51fd\u6570",(0,c.kt)("ul",{parentName:"li"},(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("strong",{parentName:"li"},"\u573a\u666f"),"\uff1a\u9700\u8981\u5bf9\u67d0\u4e2a\u5177\u4f53\u7684\u53d8\u91cf\u6216\u4e00\u7ec4\u53d8\u91cf\u8fdb\u884c\u54cd\u5e94\u5f0f\u76d1\u542c\uff0c\u7279\u522b\u662f\u5728\u9700\u8981\u6267\u884c\u4e00\u4e9b\u526f\u4f5c\u7528\u7684\u573a\u666f\u4e0b\uff0c\u6bd4\u5982\u8c03\u7528\u63a5\u53e3\u3001\u66f4\u65b0\u5176\u4ed6\u72b6\u6001\u7b49\u3002"))),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("strong",{parentName:"li"},(0,c.kt)("inlineCode",{parentName:"strong"},"watchEffect"))," \u5219\u81ea\u52a8\u6536\u96c6\u4f9d\u8d56\uff0c\u89e6\u53d1\u53d8\u5316\u65f6\u81ea\u52a8\u8fd0\u884c\u51fd\u6570\uff0c\u4e0d\u9700\u8981\u624b\u52a8\u6307\u5b9a\u56de\u8c03\u3002",(0,c.kt)("ul",{parentName:"li"},(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("strong",{parentName:"li"},"\u573a\u666f"),"\uff1a\u9002\u5408\u7b80\u5355\u7684\u526f\u4f5c\u7528\u5904\u7406\uff0c\u5f53\u4e0d\u786e\u5b9a\u5177\u4f53\u4f9d\u8d56\u65f6\u53ef\u4ee5\u4f7f\u7528 ",(0,c.kt)("inlineCode",{parentName:"li"},"watchEffect"),"\uff0c\u81ea\u52a8\u8ffd\u8e2a\u54cd\u5e94\u5f0f\u6570\u636e\u4f9d\u8d56\u5e76\u54cd\u5e94\u53d8\u5316\u3002")))),(0,c.kt)("h3",{id:"12-watcheffect"},"1.2 watchEffect"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"export function watchEffect(effect: WatchEffect, options?: WatchEffectOptions): WatchHandle {\n  return doWatch(effect, null, options)\n}\n")),(0,c.kt)("h3",{id:"13-watch"},"1.3 watch"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"export function watch<T = any, Immediate extends Readonly<boolean> = false>(\n  source: T | WatchSource<T>,\n  cb: any,\n  options?: WatchOptions<Immediate>,\n): WatchHandle {\n  return doWatch(source as any, cb, options)\n}\n")),(0,c.kt)("h3",{id:"14-dowatch"},"1.4 doWatch"),(0,c.kt)("blockquote",null,(0,c.kt)("p",{parentName:"blockquote"},(0,c.kt)("strong",{parentName:"p"},"\u751f\u6210 watchHandle"),"\uff1a\u8c03\u7528 ",(0,c.kt)("inlineCode",{parentName:"p"},"baseWatch")," \u521b\u5efa\u76d1\u542c\u5668\uff0c\u5e76\u8fd4\u56de ",(0,c.kt)("inlineCode",{parentName:"p"},"watchHandle"),"\uff0c\u5176\u4e2d\u5305\u542b\u505c\u6b62\u3001\u6062\u590d\u548c\u6682\u505c\u529f\u80fd\u3002")),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"function doWatch(\n  source: WatchSource | WatchSource[] | WatchEffect | object,\n  cb: WatchCallback | null,\n  options: WatchOptions = EMPTY_OBJ\n): WatchHandle {\n  const { immediate, deep, flush, once } = options\n  const baseWatchOptions: BaseWatchOptions = extend({}, options)\n\n  // \u8c03\u5ea6\u5668\u8bbe\u7f6e\n  baseWatchOptions.scheduler = (job, isFirstRun) => {\n    if (isFirstRun) {\n      job()\n    } else {\n      queueJob(job)\n    }\n  }\n\n  // \u6267\u884c watch \u884c\u4e3a\n  const watchHandle = baseWatch(source, cb, baseWatchOptions)\n  return watchHandle\n}\n")),(0,c.kt)("h2",{id:"\u4e8cwatch-\u7684\u6838\u5fc3\u903b\u8f91"},"\u4e8c\u3001",(0,c.kt)("inlineCode",{parentName:"h2"},"watch")," \u7684\u6838\u5fc3\u903b\u8f91"),(0,c.kt)("p",null,(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u7684\u5b9e\u73b0\u4f9d\u8d56\u4e8e ",(0,c.kt)("inlineCode",{parentName:"p"},"ReactiveEffect"),"\uff0c\u5176\u6838\u5fc3\u662f\u521b\u5efa ",(0,c.kt)("inlineCode",{parentName:"p"},"effect"),"\uff0c\u5e76\u6839\u636e\u662f\u5426\u4f20\u5165\u56de\u8c03\u51fd\u6570\u6765\u51b3\u5b9a\u6267\u884c\u65b9\u5f0f\u3002"),(0,c.kt)("h3",{id:"21-watch-\u6838\u5fc3\u903b\u8f91"},"2.1 ",(0,c.kt)("inlineCode",{parentName:"h3"},"watch")," \u6838\u5fc3\u903b\u8f91"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"export function watch(\n  source: WatchSource | WatchSource[] | WatchEffect | object,\n  cb?: WatchCallback | null,\n  options: WatchOptions = EMPTY_OBJ\n): WatchHandle {\n  const { immediate, deep, once, scheduler } = options\n  let effect: ReactiveEffect\n\n  const scope = getCurrentScope()\n  const watchHandle: WatchHandle = () => {\n    effect.stop()\n    if (scope) {\n      remove(scope.effects, effect)\n    }\n  }\n\n  // \u6838\u5fc3\uff1a\u521b\u5efa ReactiveEffect \u5b9e\u4f8b\n  effect = new ReactiveEffect(getter)\n  effect.scheduler = scheduler ? () => scheduler(job, false) : (job as EffectScheduler)\n\n  watchHandle.pause = effect.pause.bind(effect)\n  watchHandle.resume = effect.resume.bind(effect)\n  watchHandle.stop = watchHandle\n\n  return watchHandle\n}\n")),(0,c.kt)("h3",{id:"22-getter-\u51fd\u6570"},"2.2 ",(0,c.kt)("inlineCode",{parentName:"h3"},"getter")," \u51fd\u6570"),(0,c.kt)("p",null,(0,c.kt)("inlineCode",{parentName:"p"},"getter")," \u662f ",(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u7684\u6838\u5fc3\u90e8\u5206\uff0c\u8d1f\u8d23\u6839\u636e\u76d1\u542c\u7684 ",(0,c.kt)("inlineCode",{parentName:"p"},"source")," \u6765\u83b7\u53d6\u503c\u3002\u5728 ",(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u7684\u4e0d\u540c\u573a\u666f\u4e2d\uff08",(0,c.kt)("inlineCode",{parentName:"p"},"Ref"),"\u3001",(0,c.kt)("inlineCode",{parentName:"p"},"Reactive")," \u5bf9\u8c61\u3001",(0,c.kt)("inlineCode",{parentName:"p"},"\u6570\u7ec4"),"\u7b49\uff09\uff0c",(0,c.kt)("inlineCode",{parentName:"p"},"getter")," \u7684\u5904\u7406\u903b\u8f91\u4f1a\u6709\u6240\u4e0d\u540c\uff1a"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"let getter: () => any\n\nif (isRef(source)) {\n  getter = () => source.value // \u5982\u679c\u662fRef\uff0c\u5219\u83b7\u53d6\u5176value\n  forceTrigger = isShallow(source)\n} else if (isReactive(source)) {\n  getter = () => reactiveGetter(source) // \u5982\u679c\u662fReactive\u5bf9\u8c61\uff0c\u4f7f\u7528 reactiveGetter\n  forceTrigger = true\n} else if (isArray(source)) {\n  isMultiSource = true\n  forceTrigger = source.some((s) => isReactive(s) || isShallow(s))\n  getter = () =>\n    source.map((s) => {\n      // \u5982\u679c\u662f\u6570\u7ec4\uff0c\u904d\u5386\u5904\u7406\u6bcf\u4e2asource\n      if (isRef(s)) {\n        return s.value\n      } else if (isReactive(s)) {\n        return reactiveGetter(s)\n      } else if (isFunction(s)) {\n        return s()\n      }\n    })\n} else if (isFunction(source)) {\n  if (cb) {\n    getter = source as () => any // \u5982\u679c\u662f\u56de\u8c03\u51fd\u6570\uff0c\u76f4\u63a5\u6267\u884c\n  } else {\n    getter = () => {\n      // watchEffect \u65e0\u56de\u8c03\u65f6\u7684\u5904\u7406\u903b\u8f91\n      if (cleanup) {\n        pauseTracking()\n        try {\n          cleanup()\n        } finally {\n          resetTracking()\n        }\n      }\n      const currentEffect = activeWatcher\n      activeWatcher = effect\n      try {\n        source(boundCleanup) // \u8fd0\u884c source \u51fd\u6570\n      } finally {\n        activeWatcher = currentEffect\n      }\n    }\n  }\n} else {\n  getter = () => {}\n}\nif (cb && deep) {\n  const baseGetter = getter\n  const depth = deep === true ? Infinity : deep\n  getter = () => traverse(baseGetter(), depth)\n}\n")),(0,c.kt)("blockquote",null,(0,c.kt)("p",{parentName:"blockquote"},(0,c.kt)("inlineCode",{parentName:"p"},"traverse")," \u662f Vue \u5185\u90e8\u7528\u4e8e\u5bf9\u5bf9\u8c61\u8fdb\u884c\u6df1\u5ea6\u904d\u5386\u7684\u5de5\u5177\u51fd\u6570\uff0c\u5b83\u7528\u4e8e\u5904\u7406\u6df1\u5ea6\u76d1\u542c\u7684\u60c5\u51b5\u3002\u5728\u5904\u7406\u590d\u6742\u5d4c\u5957\u5bf9\u8c61\u65f6\uff0c\u901a\u8fc7\u6df1\u5ea6\u904d\u5386\u6765\u6536\u96c6\u4f9d\u8d56\u3002")),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"\u5bf9\u4e8e ",(0,c.kt)("inlineCode",{parentName:"li"},"Ref"),"\uff0c\u4f1a\u9012\u5f52\u904d\u5386\u5176 ",(0,c.kt)("inlineCode",{parentName:"li"},".value"),"\u3002"),(0,c.kt)("li",{parentName:"ul"},"\u5bf9\u4e8e ",(0,c.kt)("inlineCode",{parentName:"li"},"Array"),"\uff0c\u4f1a\u9012\u5f52\u904d\u5386\u6570\u7ec4\u7684\u6bcf\u4e2a\u5143\u7d20\u3002"),(0,c.kt)("li",{parentName:"ul"},"\u5bf9\u4e8e ",(0,c.kt)("inlineCode",{parentName:"li"},"Set")," \u6216 ",(0,c.kt)("inlineCode",{parentName:"li"},"Map"),"\uff0c\u5219\u4f1a\u904d\u5386\u6bcf\u4e2a\u5143\u7d20\u3002"),(0,c.kt)("li",{parentName:"ul"},"\u5bf9\u4e8e ",(0,c.kt)("inlineCode",{parentName:"li"},"PlainObject"),"\uff0c\u904d\u5386\u6240\u6709\u81ea\u6709\u5c5e\u6027\u53ca ",(0,c.kt)("inlineCode",{parentName:"li"},"Symbol")," \u5c5e\u6027\u3002"),(0,c.kt)("li",{parentName:"ul"},"\u901a\u8fc7 ",(0,c.kt)("inlineCode",{parentName:"li"},"seen")," \u8bb0\u5f55\u5df2\u904d\u5386\u7684\u5bf9\u8c61\uff0c\u907f\u514d\u5faa\u73af\u5f15\u7528\u5bfc\u81f4\u7684\u6b7b\u5faa\u73af\u3002")),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"export function traverse(value: unknown, depth: number = Infinity, seen?: Set<unknown>): unknown {\n  if (depth <= 0 || !isObject(value) || (value as any)[ReactiveFlags.SKIP]) {\n    return value\n  }\n  seen = seen || new Set()\n  if (seen.has(value)) {\n    return value\n  }\n  seen.add(value)\n  depth--\n\n  if (isRef(value)) {\n    traverse(value.value, depth, seen)\n  } else if (isArray(value)) {\n    for (let i = 0; i < value.length; i++) {\n      traverse(value[i], depth, seen)\n    }\n  } else if (isSet(value) || isMap(value)) {\n    value.forEach((v: any) => {\n      traverse(v, depth, seen)\n    })\n  } else if (isPlainObject(value)) {\n    for (const key in value) {\n      traverse(value[key], depth, seen)\n    }\n    for (const key of Object.getOwnPropertySymbols(value)) {\n      if (Object.prototype.propertyIsEnumerable.call(value, key)) {\n        traverse(value[key as any], depth, seen)\n      }\n    }\n  }\n  return value\n}\n")),(0,c.kt)("h3",{id:"23scheduler-\u8c03\u5ea6\u5668"},"2.3\u3001",(0,c.kt)("inlineCode",{parentName:"h3"},"scheduler")," \u8c03\u5ea6\u5668"),(0,c.kt)("p",null,(0,c.kt)("inlineCode",{parentName:"p"},"scheduler")," \u662f Vue \u5185\u90e8\u7528\u4e8e\u63a7\u5236\u526f\u4f5c\u7528\u51fd\u6570\u6267\u884c\u65f6\u673a\u7684\u673a\u5236\uff0c\u5b83\u5141\u8bb8\u5f00\u53d1\u8005\u81ea\u5b9a\u4e49 ",(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u51fd\u6570\u7684\u89e6\u53d1\u65b9\u5f0f\u3002",(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u5728\u521b\u5efa ",(0,c.kt)("inlineCode",{parentName:"p"},"ReactiveEffect")," \u65f6\uff0c\u4f1a\u901a\u8fc7 ",(0,c.kt)("inlineCode",{parentName:"p"},"scheduler")," \u6765\u8c03\u5ea6 ",(0,c.kt)("inlineCode",{parentName:"p"},"job")," \u6267\u884c\uff1a"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"const job = () => {\n  if (cb) {\n    const newValue = effect.run() // \u8fd0\u884c\u526f\u4f5c\u7528\u51fd\u6570\u83b7\u53d6\u65b0\u503c\n    if (cleanup) {\n      cleanup() // \u6267\u884c\u6e05\u7406\u51fd\u6570\n    }\n    const currentWatcher = activeWatcher\n    activeWatcher = effect\n    try {\n      const args = [newValue, oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue, boundCleanup]\n      cb!(...args) // \u6267\u884c\u56de\u8c03\u51fd\u6570\n      oldValue = newValue\n    } finally {\n      activeWatcher = currentWatcher\n    }\n  } else {\n    effect.run() // watchEffect \u76f4\u63a5\u8fd0\u884c\u526f\u4f5c\u7528\n  }\n}\n\neffect = new ReactiveEffect(getter) // \u521b\u5efa ReactiveEffect \u5b9e\u4f8b\neffect.scheduler = scheduler ? () => scheduler(job, false) : (job as EffectScheduler)\n")),(0,c.kt)("h3",{id:"24-\u6df1\u5ea6\u76d1\u542c\u5904\u7406"},"2.4 \u6df1\u5ea6\u76d1\u542c\u5904\u7406"),(0,c.kt)("p",null,"\u5982\u679c ",(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u914d\u7f6e\u4e86 ",(0,c.kt)("inlineCode",{parentName:"p"},"deep: true"),"\uff0c\u5219\u9700\u8981\u5bf9\u76d1\u542c\u7684\u5bf9\u8c61\u8fdb\u884c\u6df1\u5ea6\u904d\u5386\u3002",(0,c.kt)("inlineCode",{parentName:"p"},"getter")," \u4f1a\u8c03\u7528 ",(0,c.kt)("inlineCode",{parentName:"p"},"traverse")," \u65b9\u6cd5\u6765\u904d\u5386\u5bf9\u8c61\u5c5e\u6027\uff0c\u4ee5\u4fbf\u6536\u96c6\u4f9d\u8d56\uff1a"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"if (cb && deep) {\n  const baseGetter = getter\n  const depth = deep === true ? Infinity : deep\n  getter = () => traverse(baseGetter(), depth) // \u5bf9 getter \u83b7\u53d6\u7684\u5bf9\u8c61\u8fdb\u884c\u6df1\u5ea6\u904d\u5386\n}\n")),(0,c.kt)("h3",{id:"25-\u521d\u59cb\u8fd0\u884c"},"2.5 \u521d\u59cb\u8fd0\u884c"),(0,c.kt)("p",null,"\u5728 ",(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u4e2d\uff0c\u5982\u679c\u8bbe\u7f6e\u4e86 ",(0,c.kt)("inlineCode",{parentName:"p"},"immediate")," \u9009\u9879\uff0c\u5219\u4f1a\u7acb\u5373\u6267\u884c\u56de\u8c03\u51fd\u6570\uff0c\u5426\u5219\u4f1a\u5148\u83b7\u53d6\u65e7\u503c\uff0c\u7136\u540e\u5728\u76d1\u542c\u5bf9\u8c61\u53d1\u751f\u53d8\u5316\u65f6\u89e6\u53d1\uff1a"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"// \u521d\u59cb\u8fd0\u884c\nif (cb) {\n  if (immediate) {\n    job() // \u7acb\u5373\u6267\u884c job\n  } else {\n    oldValue = effect.run() // \u83b7\u53d6\u521d\u59cb\u503c\n  }\n} else {\n  effect.run() // \u65e0\u56de\u8c03\u65f6\u4ec5\u8fd0\u884c effect\n}\n")),(0,c.kt)("h3",{id:"26-\u6267\u884c\u4e00\u6b21"},"2.6 \u6267\u884c\u4e00\u6b21"),(0,c.kt)("p",null,(0,c.kt)("strong",{parentName:"p"},(0,c.kt)("inlineCode",{parentName:"strong"},"immediate")," \u9009\u9879"),"\uff1a\u5f53\u8bbe\u7f6e\u4e3a ",(0,c.kt)("inlineCode",{parentName:"p"},"true")," \u65f6\uff0c",(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u4f1a\u7acb\u5373\u6267\u884c\u4e00\u6b21\u56de\u8c03\u51fd\u6570\uff0c\u800c\u65e0\u9700\u7b49\u5f85\u54cd\u5e94\u5f0f\u6570\u636e\u7684\u53d8\u5316\u3002"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"if (once) {\n  if (cb) {\n    const _cb = cb\n    cb = (...args) => {\n      _cb(...args)\n      watchHandle() // \u6267\u884c\u5b8c\u4e00\u6b21\u540e\u505c\u6b62\n    }\n  } else {\n    const _getter = getter\n    getter = () => {\n      _getter()\n      watchHandle() // \u6267\u884c\u5b8c\u4e00\u6b21\u540e\u505c\u6b62\n    }\n  }\n}\n")),(0,c.kt)("h3",{id:"27-\u6e05\u7406\u51fd\u6570-cleanup"},"2.7 \u6e05\u7406\u51fd\u6570 ",(0,c.kt)("inlineCode",{parentName:"h3"},"cleanup")),(0,c.kt)("p",null,"\u5728\u6bcf\u6b21\u526f\u4f5c\u7528\u6267\u884c\u4e4b\u524d\uff0cVue \u4f1a\u5148\u6267\u884c ",(0,c.kt)("inlineCode",{parentName:"p"},"cleanup")," \u51fd\u6570\uff0c\u7528\u4e8e\u6e05\u7406\u4e0a\u4e00\u6b21\u526f\u4f5c\u7528\u6267\u884c\u65f6\u7684\u526f\u4f5c\u7528\uff0c\u4f8b\u5982\u4e8b\u4ef6\u76d1\u542c\u3001\u5b9a\u65f6\u5668\u7b49\u3002",(0,c.kt)("inlineCode",{parentName:"p"},"cleanup")," \u7684\u6ce8\u518c\u901a\u8fc7 ",(0,c.kt)("inlineCode",{parentName:"p"},"onWatcherCleanup")," \u5b9e\u73b0\u3002"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"const job = () => {\n  if (cleanup) {\n    cleanup() // \u6267\u884c\u4e0a\u4e00\u6b21\u7684\u6e05\u7406\u51fd\u6570\n  }\n  const newValue = effect.run()\n  const args = [newValue, oldValue, boundCleanup]\n  cb!(...args)\n  oldValue = newValue\n}\n\nboundCleanup = (fn) => onWatcherCleanup(fn, false, effect) // \u6ce8\u518c\u6e05\u7406\u51fd\u6570\n\ncleanup = effect.onStop = () => {\n  // \u5728 effect \u505c\u6b62\u65f6\u6267\u884c\u6e05\u7406\n  const cleanups = cleanupMap.get(effect)\n  if (cleanups) {\n    for (const cleanup of cleanups) cleanup()\n    cleanupMap.delete(effect)\n  }\n}\n")),(0,c.kt)("p",null,(0,c.kt)("strong",{parentName:"p"},"\u6e05\u7406\u51fd\u6570\u7684\u6d41\u7a0b")),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("strong",{parentName:"li"},"\u7ed1\u5b9a\u6e05\u7406\u51fd\u6570"),"\uff1a\u5728\u6bcf\u6b21 ",(0,c.kt)("inlineCode",{parentName:"li"},"job")," \u6267\u884c\u4e4b\u524d\uff0c\u90fd\u4f1a\u901a\u8fc7 ",(0,c.kt)("inlineCode",{parentName:"li"},"boundCleanup")," \u5c06\u6e05\u7406\u51fd\u6570\u6ce8\u518c\u5230\u5f53\u524d ",(0,c.kt)("inlineCode",{parentName:"li"},"ReactiveEffect")," \u4e0a\u3002"),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("strong",{parentName:"li"},"\u505c\u6b62\u65f6\u6e05\u7406"),"\uff1a\u5f53 ",(0,c.kt)("inlineCode",{parentName:"li"},"effect")," \u505c\u6b62\u65f6\uff0c",(0,c.kt)("inlineCode",{parentName:"li"},"onStop")," \u4f1a\u89e6\u53d1\uff0c\u6e05\u9664\u6240\u6709\u5df2\u6ce8\u518c\u7684\u6e05\u7406\u51fd\u6570\u3002")),(0,c.kt)("h2",{id:"\u4e09onwatchercleanup-\u6e05\u7406\u673a\u5236"},"\u4e09\u3001",(0,c.kt)("inlineCode",{parentName:"h2"},"onWatcherCleanup")," \u6e05\u7406\u673a\u5236"),(0,c.kt)("p",null,"\u5f53\u4e00\u4e2a ",(0,c.kt)("inlineCode",{parentName:"p"},"watch")," \u88ab\u505c\u6b62\u6216\u91cd\u65b0\u8fd0\u884c\u65f6\uff0c\u6e05\u7406\u51fd\u6570\u9700\u8981\u88ab\u6267\u884c\u3002Vue \u4f7f\u7528 ",(0,c.kt)("inlineCode",{parentName:"p"},"onWatcherCleanup")," \u6765\u7ba1\u7406\u8fd9\u4e9b\u6e05\u7406\u5de5\u4f5c\u3002\u5176\u6838\u5fc3\u662f ",(0,c.kt)("inlineCode",{parentName:"p"},"WeakMap")," \u548c ",(0,c.kt)("inlineCode",{parentName:"p"},"ReactiveEffect")," \u7684\u7ed1\u5b9a\u3002"),(0,c.kt)("h3",{id:"31-onwatchercleanup-\u6e90\u7801\u89e3\u6790"},"3.1 ",(0,c.kt)("inlineCode",{parentName:"h3"},"onWatcherCleanup")," \u6e90\u7801\u89e3\u6790"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"const cleanupMap: WeakMap<ReactiveEffect, (() => void)[]> = new WeakMap()\nlet activeWatcher: ReactiveEffect | undefined = undefined\n\nexport function onWatcherCleanup(\n  cleanupFn: () => void,\n  failSilently = false,\n  owner: ReactiveEffect | undefined = activeWatcher\n): void {\n  if (owner) {\n    let cleanups = cleanupMap.get(owner)\n    if (!cleanups) cleanupMap.set(owner, (cleanups = []))\n    cleanups.push(cleanupFn)\n  }\n}\n")),(0,c.kt)("h3",{id:"32-\u6e05\u7406\u673a\u5236\u7684\u5de5\u4f5c\u539f\u7406"},"3.2 \u6e05\u7406\u673a\u5236\u7684\u5de5\u4f5c\u539f\u7406"),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("strong",{parentName:"li"},"\u4fdd\u5b58\u6e05\u7406\u51fd\u6570"),"\uff1a\u6bcf\u5f53\u6709\u65b0\u7684\u6e05\u7406\u51fd\u6570\u9700\u8981\u88ab\u6ce8\u518c\u65f6\uff0c\u4f1a\u5c06\u5176\u4e0e\u5f53\u524d\u6d3b\u8dc3\u7684 ",(0,c.kt)("inlineCode",{parentName:"li"},"ReactiveEffect")," \u7ed1\u5b9a\uff08\u901a\u8fc7 ",(0,c.kt)("inlineCode",{parentName:"li"},"activeWatcher")," \u6765\u5224\u65ad\u5f53\u524d\u6fc0\u6d3b\u7684 ",(0,c.kt)("inlineCode",{parentName:"li"},"effect"),"\uff09\u3002"),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("strong",{parentName:"li"},"\u6267\u884c\u6e05\u7406\u51fd\u6570"),"\uff1a\u5f53 ",(0,c.kt)("inlineCode",{parentName:"li"},"effect")," \u505c\u6b62\u65f6\uff0c\u7cfb\u7edf\u4f1a\u81ea\u52a8\u8c03\u7528\u6240\u6709\u7ed1\u5b9a\u7684\u6e05\u7406\u51fd\u6570\u3002")))}s.isMDXComponent=!0}}]);