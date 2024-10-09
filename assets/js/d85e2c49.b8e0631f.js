"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7491],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>d});var n=r(7294);function l(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,l=function(e,t){if(null==e)return{};var r,n,l={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(l[r]=e[r]);return l}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(l[r]=e[r])}return l}var i=n.createContext({}),u=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},s=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,l=e.mdxType,a=e.originalType,i=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),m=u(r),d=l,k=m["".concat(i,".").concat(d)]||m[d]||c[d]||a;return r?n.createElement(k,o(o({ref:t},s),{},{components:r})):n.createElement(k,o({ref:t},s))}));function d(e,t){var r=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=r.length,o=new Array(a);o[0]=m;var p={};for(var i in t)hasOwnProperty.call(t,i)&&(p[i]=t[i]);p.originalType=e,p.mdxType="string"==typeof e?e:l,o[1]=p;for(var u=2;u<a;u++)o[u]=r[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5026:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>c,frontMatter:()=>a,metadata:()=>p,toc:()=>u});var n=r(7462),l=(r(7294),r(3905));const a={title:"2. \u4e8c\u53c9\u6811\u7684\u9012\u5f52\u904d\u5386",description:"\u8003\u5bdf\u6df1\u5ea6\u4f18\u5148\u904d\u5386 \u9012\u5f52\u6cd5",last_update:{date:"12/25/2022",author:"\u949f\u7537"}},o=void 0,p={unversionedId:"\u4e8c\u53c9\u6811/traversal\u9012\u5f52",id:"\u4e8c\u53c9\u6811/traversal\u9012\u5f52",title:"2. \u4e8c\u53c9\u6811\u7684\u9012\u5f52\u904d\u5386",description:"\u8003\u5bdf\u6df1\u5ea6\u4f18\u5148\u904d\u5386 \u9012\u5f52\u6cd5",source:"@site/leetcode/04-\u4e8c\u53c9\u6811/02-traversal\u9012\u5f52.md",sourceDirName:"04-\u4e8c\u53c9\u6811",slug:"/\u4e8c\u53c9\u6811/traversal\u9012\u5f52",permalink:"/website/leetcode/\u4e8c\u53c9\u6811/traversal\u9012\u5f52",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"2. \u4e8c\u53c9\u6811\u7684\u9012\u5f52\u904d\u5386",description:"\u8003\u5bdf\u6df1\u5ea6\u4f18\u5148\u904d\u5386 \u9012\u5f52\u6cd5",last_update:{date:"12/25/2022",author:"\u949f\u7537"}},sidebar:"tutorialSidebar",previous:{title:"1. \u4e8c\u53c9\u6811",permalink:"/website/leetcode/\u4e8c\u53c9\u6811/intro"},next:{title:"3. \u4e8c\u53c9\u6811\u7684\u8fed\u4ee3\u904d\u5386",permalink:"/website/leetcode/\u4e8c\u53c9\u6811/traversal\u8fed\u4ee3"}},i={},u=[{value:"\u9898\u76ee",id:"\u9898\u76ee",level:2},{value:"\u601d\u8def",id:"\u601d\u8def",level:2},{value:"<strong>\u9012\u5f52\u6cd5</strong>",id:"\u9012\u5f52\u6cd5",level:3},{value:"\u89e3\u9898 \u9012\u5f52",id:"\u89e3\u9898-\u9012\u5f52",level:2},{value:"\u524d\u5e8f\u904d\u5386",id:"\u524d\u5e8f\u904d\u5386",level:3}],s={toc:u};function c(e){let{components:t,...r}=e;return(0,l.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"\u9898\u76ee"},"\u9898\u76ee"),(0,l.kt)("p",null,"\u7ed9\u4f60\u4e8c\u53c9\u6811\u7684\u6839\u8282\u70b9 ",(0,l.kt)("inlineCode",{parentName:"p"},"root")," \uff0c\u8fd4\u56de\u5b83\u8282\u70b9\u503c\u7684 ",(0,l.kt)("strong",{parentName:"p"},"\u524d\u5e8f")," \u904d\u5386\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u793a\u4f8b 1\uff1a")),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg",alt:"img"})),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"\u8f93\u5165\uff1aroot = [1,null,2,3]\n\u8f93\u51fa\uff1a[1,2,3]\n")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u793a\u4f8b 2\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"\u8f93\u5165\uff1aroot = []\n\u8f93\u51fa\uff1a[]\n")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u793a\u4f8b 3\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"\u8f93\u5165\uff1aroot = [1]\n\u8f93\u51fa\uff1a[1]\n")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u793a\u4f8b 4\uff1a")),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://assets.leetcode.com/uploads/2020/09/15/inorder_5.jpg",alt:"img"})),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"\u8f93\u5165\uff1aroot = [1,2]\n\u8f93\u51fa\uff1a[1,2]\n")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u793a\u4f8b 5\uff1a")),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://assets.leetcode.com/uploads/2020/09/15/inorder_4.jpg",alt:"img"})),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"\u8f93\u5165\uff1aroot = [1,null,2]\n\u8f93\u51fa\uff1a[1,2]\n")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u63d0\u793a\uff1a")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u6811\u4e2d\u8282\u70b9\u6570\u76ee\u5728\u8303\u56f4 ",(0,l.kt)("inlineCode",{parentName:"li"},"[0, 100]")," \u5185"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"-100 <= Node.val <= 100"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u8fdb\u9636\uff1a"),"\u9012\u5f52\u7b97\u6cd5\u5f88\u7b80\u5355\uff0c\u4f60\u53ef\u4ee5\u901a\u8fc7\u8fed\u4ee3\u7b97\u6cd5\u5b8c\u6210\u5417\uff1f"),(0,l.kt)("p",null,"\u6765\u6e90\uff1a\u529b\u6263\uff08LeetCode\uff09"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://leetcode.cn/problems/binary-tree-preorder-traversal/"},"144.\u4e8c\u53c9\u6811\u7684\u524d\u5e8f\u904d\u5386")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://leetcode.cn/problems/binary-tree-inorder-traversal/"},"94.\u4e8c\u53c9\u6811\u7684\u4e2d\u5e8f\u904d\u5386")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://leetcode.cn/problems/binary-tree-postorder-traversal/"},"145.\u4e8c\u53c9\u6811\u7684\u540e\u5e8f\u904d\u5386"))),(0,l.kt)("h2",{id:"\u601d\u8def"},"\u601d\u8def"),(0,l.kt)("h3",{id:"\u9012\u5f52\u6cd5"},(0,l.kt)("strong",{parentName:"h3"},"\u9012\u5f52\u6cd5")),(0,l.kt)("p",null,"\u8fd9\u6b21\u6211\u4eec\u8981\u597d\u597d\u8c08\u4e00\u8c08\u9012\u5f52\uff0c\u4e3a\u4ec0\u4e48\u5f88\u591a\u540c\u5b66\u770b\u9012\u5f52\u7b97\u6cd5\u90fd",(0,l.kt)("inlineCode",{parentName:"p"},"\u4e00\u770b\u5c31\u4f1a\uff0c\u4e00\u5199\u5c31\u5e9f"),"\u3002"),(0,l.kt)("p",null,"\u672c\u7bc7\u5c06\u4ecb\u7ecd\u524d\u540e\u4e2d\u5e8f\u7684\u9012\u5f52\u5199\u6cd5\uff0c\u4e00\u4e9b\u540c\u5b66\u53ef\u80fd\u4f1a\u611f\u89c9\u5f88\u7b80\u5355\uff0c\u5176\u5b9e\u4e0d\u7136\uff0c",(0,l.kt)("strong",{parentName:"p"},"\u6211\u4eec\u8981\u901a\u8fc7\u7b80\u5355\u9898\u76ee\u628a\u65b9\u6cd5\u8bba\u786e\u5b9a\u4e0b\u6765\uff0c\u6709\u4e86\u65b9\u6cd5\u8bba\uff0c\u540e\u9762\u624d\u80fd\u5e94\u4ed8\u590d\u6742\u7684\u9012\u5f52"),"\u3002"),(0,l.kt)("p",null,"\u8fd9\u91cc\u5e2e\u52a9\u5927\u5bb6\u786e\u5b9a\u4e0b\u6765\u9012\u5f52\u7b97\u6cd5\u7684",(0,l.kt)("strong",{parentName:"p"},"\u4e09\u4e2a\u8981\u7d20"),"\u3002\u6bcf\u6b21\u5199\u9012\u5f52\uff0c\u90fd\u6309\u7167\u8fd9\u4e09\u8981\u7d20\u6765\u5199\uff0c\u53ef\u4ee5\u4fdd\u8bc1\u5927\u5bb6\u5199\u51fa\u6b63\u786e\u7684\u9012\u5f52\u7b97\u6cd5\uff01"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"\u786e\u5b9a\u9012\u5f52\u51fd\u6570\u7684\u53c2\u6570\u548c\u8fd4\u56de\u503c\uff1a \u786e\u5b9a\u54ea\u4e9b\u53c2\u6570\u662f\u9012\u5f52\u7684\u8fc7\u7a0b\u4e2d\u9700\u8981\u5904\u7406\u7684\uff0c\u90a3\u4e48\u5c31\u5728\u9012\u5f52\u51fd\u6570\u91cc\u52a0\u4e0a\u8fd9\u4e2a\u53c2\u6570\uff0c \u5e76\u4e14\u8fd8\u8981\u660e\u786e\u6bcf\u6b21\u9012\u5f52\u7684\u8fd4\u56de\u503c\u662f\u4ec0\u4e48\u8fdb\u800c\u786e\u5b9a\u9012\u5f52\u51fd\u6570\u7684\u8fd4\u56de\u7c7b\u578b\u3002")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"\u786e\u5b9a\u7ec8\u6b62\u6761\u4ef6\uff1a \u5199\u5b8c\u4e86\u9012\u5f52\u7b97\u6cd5, \u8fd0\u884c\u7684\u65f6\u5019\uff0c\u7ecf\u5e38\u4f1a\u9047\u5230\u6808\u6ea2\u51fa\u7684\u9519\u8bef\uff0c\u5c31\u662f\u6ca1\u5199\u7ec8\u6b62\u6761\u4ef6\u6216\u8005\u7ec8\u6b62\u6761\u4ef6\u5199\u7684\u4e0d\u5bf9\uff0c\u64cd\u4f5c\u7cfb\u7edf\u4e5f\u662f\u7528\u4e00\u4e2a\u6808\u7684\u7ed3\u6784\u6765\u4fdd\u5b58\u6bcf\u4e00\u5c42\u9012\u5f52\u7684\u4fe1\u606f\uff0c\u5982\u679c\u9012\u5f52\u6ca1\u6709\u7ec8\u6b62\uff0c\u64cd\u4f5c\u7cfb\u7edf\u7684\u5185\u5b58\u6808\u5fc5\u7136\u5c31\u4f1a\u6ea2\u51fa\u3002")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"\u786e\u5b9a\u5355\u5c42\u9012\u5f52\u7684\u903b\u8f91\uff1a \u786e\u5b9a\u6bcf\u4e00\u5c42\u9012\u5f52\u9700\u8981\u5904\u7406\u7684\u4fe1\u606f\u3002\u5728\u8fd9\u91cc\u4e5f\u5c31\u4f1a\u91cd\u590d\u8c03\u7528\u81ea\u5df1\u6765\u5b9e\u73b0\u9012\u5f52\u7684\u8fc7\u7a0b\u3002"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u4ee5\u4e0b\u4ee5\u524d\u5e8f\u904d\u5386\u4e3a\u4f8b\uff1a")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u786e\u5b9a\u9012\u5f52\u51fd\u6570\u7684\u53c2\u6570\u548c\u8fd4\u56de\u503c\uff1a\u56e0\u4e3a\u8981\u6253\u5370\u51fa\u524d\u5e8f\u904d\u5386\u8282\u70b9\u7684\u6570\u503c\uff0c\u6240\u4ee5\u53c2\u6570\u91cc\u9700\u8981\u4f20\u5165 node \u5728\u653e\u8282\u70b9\u7684\u6570\u503c\uff0c\u9664\u4e86\u8fd9\u4e00\u70b9\u5c31\u4e0d\u9700\u8981\u5728\u5904\u7406\u4ec0\u4e48\u6570\u636e\u4e86\u4e5f\u4e0d\u9700\u8981\u6709\u8fd4\u56de\u503c\uff0c\u6240\u4ee5\u9012\u5f52\u51fd\u6570\u8fd4\u56de\u7c7b\u578b\u5c31\u662f void\uff0c\u4ee3\u7801\u5982\u4e0b\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},"function preorder(node, result) {}\n")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u786e\u5b9a\u7ec8\u6b62\u6761\u4ef6\uff1a\u5728\u9012\u5f52\u7684\u8fc7\u7a0b\u4e2d\uff0c\u5982\u4f55\u7b97\u662f\u9012\u5f52\u7ed3\u675f\u4e86\u5462\uff0c\u5f53\u7136\u662f\u5f53\u524d\u904d\u5386\u7684\u8282\u70b9\u662f\u7a7a\u4e86\uff0c\u90a3\u4e48\u672c\u5c42\u9012\u5f52\u5c31\u8981\u8981\u7ed3\u675f\u4e86\uff0c\u6240\u4ee5\u5982\u679c\u5f53\u524d\u904d\u5386\u7684\u8fd9\u4e2a\u8282\u70b9\u662f\u7a7a\uff0c\u5c31\u76f4\u63a5 return\uff0c\u4ee3\u7801\u5982\u4e0b\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},"if (cur == null) return\n")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u786e\u5b9a\u5355\u5c42\u9012\u5f52\u7684\u903b\u8f91\uff1a\u524d\u5e8f\u904d\u5386\u662f\u4e2d\u5de6\u53f3\u7684\u5faa\u5e8f\uff0c\u6240\u4ee5\u5728\u5355\u5c42\u9012\u5f52\u7684\u903b\u8f91\uff0c\u662f\u8981\u5148\u53d6\u4e2d\u8282\u70b9\u7684\u6570\u503c\uff0c\u4ee3\u7801\u5982\u4e0b\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},"result.push(node.val) //\u6dfb\u52a0\u5230\u7ed3\u679c\n// \u7136\u540e\u9012\u5f52\u904d\u5386\u5de6\u5b69\u5b50\npreorder(node.left)\n// \u6700\u540e\u9012\u5f52\u904d\u5386\u53f3\u5b69\u5b50\npreorder(node.right)\n")),(0,l.kt)("h2",{id:"\u89e3\u9898-\u9012\u5f52"},"\u89e3\u9898 \u9012\u5f52"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u53c2\u6570\u7684\u8fd4\u56de\u503c"),(0,l.kt)("li",{parentName:"ul"},"\u7ec8\u6b62\u6761\u4ef6"),(0,l.kt)("li",{parentName:"ul"},"\u5355\u5c42\u5faa\u73af\u903b\u8f91")),(0,l.kt)("h3",{id:"\u524d\u5e8f\u904d\u5386"},"\u524d\u5e8f\u904d\u5386"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},"var preorderTraversal = function (root) {\n  const result = []\n  function preorder(node) {\n    // \u9012\u5f52\u7684\u7ec8\u6b62\u6761\u4ef6 \u5982\u679c\u8282\u70b9\u4e3a\u7a7a\u76f4\u63a5\u8fd4\u56de\n    if (!node) return //\n    // \u5148\u5e8f\u904d\u5386\u5c31\u662f\u628a\u5f53\u524d\u8282\u70b9\u8f93\u51fa \u653e\u5728\u5de6\u53f3\u9012\u5f52\u8c03\u7528\u4e4b\u524d \u5c06\u5176\u6570\u503c\u653e\u5165\u7ed3\u679c\u6570\u7ec4\n    result.push(node.val) //\u4e2d \u5904\u7406\u5f53\u524d\u8282\u70b9\n    // \u7136\u540e\u9012\u5f52\u904d\u5386\u5de6\u5b69\u5b50\n    preorder(node.left)\n    // \u6700\u540e\u9012\u5f52\u904d\u5386\u53f3\u5b69\u5b50\n    preorder(node.right)\n  }\n  preorder(root)\n  // \u8fd4\u56de\u7ed3\u679c\n  return result\n}\n")))}c.isMDXComponent=!0}}]);