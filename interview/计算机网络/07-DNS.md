---
title: 7. 说说你对 DNS 协议的理解
last_update:
  date: 12/26/2022
  author: 高红翔
---

DNS 是 Domain Name System 的缩写， DNS 服务器进⾏**域名和**与之对应的 **IP 地址转换**的服务器

- 顶级域名 .com 、

- ⼆级域名 .com.cn 、 三级域名 ww.baidu.com.cn , 有多少个点就是⼏级域名

访问过程：我们访问 ww.baidu.com.cn

- 操作系统⾥会对 DNS 解析结果做缓存，如果缓存中有直接返回 IP 地址查找 `C:\WINDOWS\system32\drivers\etc\hosts` 如果有直接返回 IP 地址

- 通过 **DNS** **服务器**查找离⾃⼰最近的根服务器，通过根服务器找到 .cn 服务器，将 ip 返回给 DNS 服务器

- DNS 服务器会继续像此 ip 发送请求，去查找对应 .cn 下 .com 对应的 ip ...

- 获取最终的 ip 地址。缓存到 DNS 服务器上

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20221226190219.png)

> DNS 服务器会对 ip 及 域名 进⾏缓存
