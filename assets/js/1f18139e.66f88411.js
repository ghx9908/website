"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[1019],{3905:(e,n,t)=>{t.d(n,{Zo:()=>s,kt:()=>d});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function u(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var o=r.createContext({}),p=function(e){var n=r.useContext(o),t=n;return e&&(t="function"==typeof e?e(n):u(u({},n),e)),t},s=function(e){var n=p(e.components);return r.createElement(o.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},c=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,l=e.originalType,o=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),c=p(t),d=a,k=c["".concat(o,".").concat(d)]||c[d]||m[d]||l;return t?r.createElement(k,u(u({ref:n},s),{},{components:t})):r.createElement(k,u({ref:n},s))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var l=t.length,u=new Array(l);u[0]=c;var i={};for(var o in n)hasOwnProperty.call(n,o)&&(i[o]=n[o]);i.originalType=e,i.mdxType="string"==typeof e?e:a,u[1]=i;for(var p=2;p<l;p++)u[p]=t[p];return r.createElement.apply(null,u)}return r.createElement.apply(null,t)}c.displayName="MDXCreateElement"},3504:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>u,default:()=>m,frontMatter:()=>l,metadata:()=>i,toc:()=>p});var r=t(7462),a=(t(7294),t(3905));const l={title:"2. \u4e09\u6570\u4e4b\u548c-15",description:"\u8003\u5bdf\u53cc\u6307\u9488",last_update:{date:"11/15/2022",author:"\u9ad8\u7ea2\u7fd4"}},u=void 0,i={unversionedId:"\u53cc\u6307\u9488/threeSum",id:"\u53cc\u6307\u9488/threeSum",title:"2. \u4e09\u6570\u4e4b\u548c-15",description:"\u8003\u5bdf\u53cc\u6307\u9488",source:"@site/leetcode/06-\u53cc\u6307\u9488/02-threeSum.md",sourceDirName:"06-\u53cc\u6307\u9488",slug:"/\u53cc\u6307\u9488/threeSum",permalink:"/website/leetcode/\u53cc\u6307\u9488/threeSum",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"2. \u4e09\u6570\u4e4b\u548c-15",description:"\u8003\u5bdf\u53cc\u6307\u9488",last_update:{date:"11/15/2022",author:"\u9ad8\u7ea2\u7fd4"}},sidebar:"tutorialSidebar",previous:{title:"1. \u6700\u63a5\u8fd1\u7684\u4e09\u6570\u4e4b\u548c-16",permalink:"/website/leetcode/\u53cc\u6307\u9488/threeSumClosest"},next:{title:"3. \u5220\u9664\u6709\u5e8f\u6570\u7ec4\u4e2d\u7684\u91cd\u590d\u9879--26",permalink:"/website/leetcode/\u53cc\u6307\u9488/deleteArray"}},o={},p=[{value:"\ud83e\udde0 \u89e3\u9898\u601d\u8def",id:"-\u89e3\u9898\u601d\u8def",level:2}],s={toc:p};function m(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,r.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u7ed9\u4f60\u4e00\u4e2a\u6574\u6570\u6570\u7ec4 ",(0,a.kt)("inlineCode",{parentName:"p"},"nums")," \uff0c\u5224\u65ad\u662f\u5426\u5b58\u5728\u4e09\u5143\u7ec4 ",(0,a.kt)("inlineCode",{parentName:"p"},"[nums[i], nums[j], nums[k]]")," \u6ee1\u8db3 ",(0,a.kt)("inlineCode",{parentName:"p"},"i != j"),"\u3001",(0,a.kt)("inlineCode",{parentName:"p"},"i != k")," \u4e14 ",(0,a.kt)("inlineCode",{parentName:"p"},"j != k")," \uff0c\u540c\u65f6\u8fd8\u6ee1\u8db3 ",(0,a.kt)("inlineCode",{parentName:"p"},"nums[i] + nums[j] + nums[k] == 0")," \u3002\u8bf7"),(0,a.kt)("p",null,"\u4f60\u8fd4\u56de\u6240\u6709\u548c\u4e3a ",(0,a.kt)("inlineCode",{parentName:"p"},"0")," \u4e14\u4e0d\u91cd\u590d\u7684\u4e09\u5143\u7ec4\u3002"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u6ce8\u610f\uff1a"),"\u7b54\u6848\u4e2d\u4e0d\u53ef\u4ee5\u5305\u542b\u91cd\u590d\u7684\u4e09\u5143\u7ec4\u3002"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u793a\u4f8b 1\uff1a")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"\u8f93\u5165\uff1anums = [-1,0,1,2,-1,-4]\n\u8f93\u51fa\uff1a[[-1,-1,2],[-1,0,1]]\n\u89e3\u91ca\uff1a\nnums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 \u3002\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 \u3002\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 \u3002\n\u4e0d\u540c\u7684\u4e09\u5143\u7ec4\u662f [-1,0,1] \u548c [-1,-1,2] \u3002\n\u6ce8\u610f\uff0c\u8f93\u51fa\u7684\u987a\u5e8f\u548c\u4e09\u5143\u7ec4\u7684\u987a\u5e8f\u5e76\u4e0d\u91cd\u8981\u3002\n")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u793a\u4f8b 2\uff1a")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"\u8f93\u5165\uff1anums = [0,1,1]\n\u8f93\u51fa\uff1a[]\n\u89e3\u91ca\uff1a\u552f\u4e00\u53ef\u80fd\u7684\u4e09\u5143\u7ec4\u548c\u4e0d\u4e3a 0 \u3002\n")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u793a\u4f8b 3\uff1a")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"\u8f93\u5165\uff1anums = [0,0,0]\n\u8f93\u51fa\uff1a[[0,0,0]]\n\u89e3\u91ca\uff1a\u552f\u4e00\u53ef\u80fd\u7684\u4e09\u5143\u7ec4\u548c\u4e3a 0 \u3002\n")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u63d0\u793a\uff1a")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"3 <= nums.length <= 3000")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"-105 <= nums[i] <= 105"))),(0,a.kt)("p",null,"\u6765\u6e90\uff1a\u529b\u6263\uff08LeetCode\uff09\n\u94fe\u63a5\uff1a",(0,a.kt)("a",{parentName:"p",href:"https://leetcode.cn/problems/3sum/"},"https://leetcode.cn/problems/3sum/")),(0,a.kt)("h2",{id:"-\u89e3\u9898\u601d\u8def"},"\ud83e\udde0 \u89e3\u9898\u601d\u8def"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u6392\u5e8f"),"\uff1a\u9996\u5148\u5c06\u6570\u7ec4\u8fdb\u884c\u6392\u5e8f\uff0c\u8fd9\u6837\u53ef\u4ee5\u65b9\u4fbf\u5730\u907f\u514d\u91cd\u590d\u7684\u4e09\u5143\u7ec4\uff0c\u540c\u65f6\u4e5f\u6709\u52a9\u4e8e\u4f7f\u7528\u53cc\u6307\u9488\u6765\u67e5\u627e\u4e09\u5143\u7ec4\u3002"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u904d\u5386\u6570\u7ec4"),"\uff1a\u4f7f\u7528\u4e00\u4e2a\u5faa\u73af\u904d\u5386\u6570\u7ec4\u4e2d\u7684\u6bcf\u4e00\u4e2a\u5143\u7d20\uff0c\u5c06\u5f53\u524d\u5143\u7d20\u89c6\u4e3a\u4e09\u5143\u7ec4\u4e2d\u7684\u7b2c\u4e00\u4e2a\u5143\u7d20\u3002"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u53cc\u6307\u9488\u67e5\u627e"),"\uff1a\u5bf9\u4e8e\u5f53\u524d\u5143\u7d20\uff0c\u5c06\u95ee\u9898\u7b80\u5316\u4e3a\u5728\u5269\u4e0b\u7684\u5143\u7d20\u4e2d\u5bfb\u627e\u4e24\u4e2a\u6570\uff0c\u4e00\u4e2a\u6307\u5411\u5934\uff0c\u4e00\u4e2a\u6307\u5411\u5c3e\u5df4"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u907f\u514d\u91cd\u590d"),"\uff1a\u5728\u904d\u5386\u548c\u53cc\u6307\u9488\u67e5\u627e\u8fc7\u7a0b\u4e2d\uff0c\u6ce8\u610f\u8df3\u8fc7\u91cd\u590d\u7684\u5143\u7d20\uff0c\u4ee5\u907f\u514d\u5f97\u5230\u91cd\u590d\u7684\u4e09\u5143\u7ec4\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nvar threeSum = function (nums) {\n  let ans = []\n  const len = nums.length\n  if (nums == null || len < 3) return ans\n  nums.sort((a, b) => a - b) // \u6392\u5e8f\n  for (let i = 0; i < len; i++) {\n    if (nums[i] > 0) break // \u5982\u679c\u5f53\u524d\u6570\u5b57\u5927\u4e8e0\uff0c\u5219\u4e09\u6570\u4e4b\u548c\u4e00\u5b9a\u5927\u4e8e0\uff0c\u6240\u4ee5\u7ed3\u675f\u5faa\u73af\n    if (i > 0 && nums[i] == nums[i - 1]) continue // \u53bb\u91cd\n    let L = i + 1\n    let R = len - 1\n    while (L < R) {\n      const sum = nums[i] + nums[L] + nums[R]\n      if (sum == 0) {\n        ans.push([nums[i], nums[L], nums[R]])\n        while (L < R && nums[L] == nums[L + 1]) L++ // \u53bb\u91cd\n        while (L < R && nums[R] == nums[R - 1]) R-- // \u53bb\u91cd\n        L++\n        R--\n      } else if (sum < 0) L++\n      else if (sum > 0) R--\n    }\n  }\n  return ans\n}\n")))}m.isMDXComponent=!0}}]);