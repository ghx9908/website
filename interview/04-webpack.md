---
sidebar_position: 5
title: webpack 面试题题
---

## Webpack 和 rollup 区别

- Webpack 的功能丰富，生态比 rollup 更加完善，基本所有可配置环节都做成了可配置，极度灵活，但也造成了学习成本高，配置复杂的缺点。而 rollup 使用起来简单，只需要针对处理加入不同的 plugins 即可。
- webpack 打包产物会加入处理代码，导致代码体积变大，rollup 基本只对代码进行转换和整合，打包之后产物更小巧。
- Rollup 是基于 es module 实现的，es module 的静态解析使得 rollup 原生支持 tree-shaking；webpack2 开始支持且消除效果不好，webpack5 支持更好的 tree-shaking。
- Rollup 不支持 hmr。

通过对比可以发现：

在开发应用时，我们要面对各种文件类型打包和代码优化需求，webpack 强大的可配置性和生态更具优势。

如果我们只是构建第三方库，对打包没有那么高的要求，rollup 小巧且配置简单，并且良好的 tree-shaking 支持更加适合
