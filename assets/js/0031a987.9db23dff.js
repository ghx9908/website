"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[4451],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),s=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),m=s(r),d=a,f=m["".concat(l,".").concat(d)]||m[d]||p[d]||i;return r?n.createElement(f,o(o({ref:t},c),{},{components:r})):n.createElement(f,o({ref:t},c))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=m;var u={};for(var l in t)hasOwnProperty.call(t,l)&&(u[l]=t[l]);u.originalType=e,u.mdxType="string"==typeof e?e:a,o[1]=u;for(var s=2;s<i;s++)o[s]=r[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},3873:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>u,toc:()=>s});var n=r(7462),a=(r(7294),r(3905));const i={title:"5. 209. \u957f\u5ea6\u6700\u5c0f\u7684\u5b50\u6570\u7ec4 -209",description:"\u53cc\u6307\u9488 \u6ed1\u52a8\u7a97\u53e3",last_update:{date:"02/08/2023",author:"\u9ad8\u7ea2\u7fd4"}},o=void 0,u={unversionedId:"\u6570\u7ec4/minSubArrayLen",id:"\u6570\u7ec4/minSubArrayLen",title:"5. 209. \u957f\u5ea6\u6700\u5c0f\u7684\u5b50\u6570\u7ec4 -209",description:"\u53cc\u6307\u9488 \u6ed1\u52a8\u7a97\u53e3",source:"@site/leetcode/01-\u6570\u7ec4/05-minSubArrayLen.md",sourceDirName:"01-\u6570\u7ec4",slug:"/\u6570\u7ec4/minSubArrayLen",permalink:"/website/leetcode/\u6570\u7ec4/minSubArrayLen",draft:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{title:"5. 209. \u957f\u5ea6\u6700\u5c0f\u7684\u5b50\u6570\u7ec4 -209",description:"\u53cc\u6307\u9488 \u6ed1\u52a8\u7a97\u53e3",last_update:{date:"02/08/2023",author:"\u9ad8\u7ea2\u7fd4"}},sidebar:"tutorialSidebar",previous:{title:"4. \u6709\u5e8f\u6570\u7ec4\u7684\u5e73\u65b9 - 977",permalink:"/website/leetcode/\u6570\u7ec4/sortedSquares"},next:{title:"6. \u87ba\u65cb\u77e9\u9635 II - 59",permalink:"/website/leetcode/\u6570\u7ec4/generateMatrix"}},l={},s=[{value:"\ud83e\udde0 \u89e3\u9898\u601d\u8def",id:"-\u89e3\u9898\u601d\u8def",level:2},{value:"\u9996\u5c3e\u6307\u9488",id:"\u9996\u5c3e\u6307\u9488",level:3}],c={toc:s};function p(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u7ed9\u5b9a\u4e00\u4e2a\u542b\u6709 n \u4e2a\u6b63\u6574\u6570\u7684\u6570\u7ec4\u548c\u4e00\u4e2a\u6b63\u6574\u6570 target \u3002"),(0,a.kt)("p",null,"\u627e\u51fa\u8be5\u6570\u7ec4\u4e2d\u6ee1\u8db3\u5176\u548c \u2265 target \u7684\u957f\u5ea6\u6700\u5c0f\u7684 \u8fde\u7eed\u5b50\u6570\u7ec4 ","[numsl, numsl+1, ..., numsr-1, numsr]"," \uff0c\u5e76\u8fd4\u56de\u5176\u957f\u5ea6\u3002\u5982\u679c\u4e0d\u5b58\u5728\u7b26\u5408\u6761\u4ef6\u7684\u5b50\u6570\u7ec4\uff0c\u8fd4\u56de 0 \u3002\u7ed9\u4f60\u4e00\u4e2a\u6309 \u975e\u9012\u51cf\u987a\u5e8f \u6392\u5e8f\u7684\u6574\u6570\u6570\u7ec4 nums\uff0c\u8fd4\u56de \u6bcf\u4e2a\u6570\u5b57\u7684\u5e73\u65b9 \u7ec4\u6210\u7684\u65b0\u6570\u7ec4\uff0c\u8981\u6c42\u4e5f\u6309 \u975e\u9012\u51cf\u987a\u5e8f \u6392\u5e8f\u3002"),(0,a.kt)("p",null,"\u6765\u6e90\uff1a\u529b\u6263\uff08LeetCode\uff09\n\u94fe\u63a5\uff1a",(0,a.kt)("a",{parentName:"p",href:"https://leetcode.cn/problems/minimum-size-subarray-sum/description/"},"https://leetcode.cn/problems/minimum-size-subarray-sum/description/")),(0,a.kt)("h2",{id:"-\u89e3\u9898\u601d\u8def"},"\ud83e\udde0 \u89e3\u9898\u601d\u8def"),(0,a.kt)("h3",{id:"\u9996\u5c3e\u6307\u9488"},"\u9996\u5c3e\u6307\u9488"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @param {number} target\n * @param {number[]} nums\n * @return {number}\n */\nvar minSubArrayLen = function (target, nums) {\n  let res = Infinity,\n    sum = 0,\n    l = 0\n  for (let r = 0; r < nums.length; r++) {\n    sum += nums[r]\n    while (sum >= target) {\n      res = Math.min(r - l + 1, res)\n      sum -= nums[l++]\n    }\n  }\n  return res === Infinity ? 0 : res\n}\n")))}p.isMDXComponent=!0}}]);