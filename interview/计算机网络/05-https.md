---
title: 5. HTTPS（保证密⽂ 防⽌篡改）
position: 1
last_update:
  date: 12/26/2022
  author: 高红翔
---

HTTP 采⽤明⽂传输，中间⼈可以获取到明⽂数据 （从⽽实现对数据的篡改）。这时候 HTTPS 就登场了！ HTTPS 是什么呢？ **HTTPS = HTTP + SSL/TLS** ， SSL 安全套接层（Secure Sockets Layer） 发展到 v3 时改名为 TLS 传输层安全(Transport Layer Security)，主要的⽬的是提供数据的完整性和保密性

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20221226120753.png)

## **⼀、数据完整性**

### **1. ** **摘要算法**

- 把任意⻓度的数据**压缩成固定的⻓度**

- 输⼊不同输出的结果发⽣剧烈的变化“**雪崩效应**”，相同的内容摘要后结果相同

- 不能从结果**反推输⼊**

  > 我们可以在内容后⾯增加 hash 值进⾏传输，服务端收到后通过 hash 值来校验内容是否完整。数据是明⽂的显然**不安全**

## **⼆、数据加密**

### 1. 对称加密

> 加密和解密时使⽤的密钥都是同⼀个， 通信过程使⽤秘钥加密后的密⽂传输。只有⾃⼰和⽹站才能解密。

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20221226122706.png)

> ⽬前 AES （Advanced Encryption Standard） ChaCha20 为最常⻅的对称加密算法 。

### **2. **⾮对称加密

⾮对称加密可以解决“密钥交换”的问题。⾮对称加密有两个秘钥，**公钥**、**私钥**，所以称之为⾮对称。**公钥加密私钥**

**解密。**

> 并不能完全采⽤⾮对称加密算法，由于算法本身耗时远⾼于对称加密。

使⽤ RSA 、 ECDHE 算法解决秘钥交换的问题

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20221226122909.png)

> 最常听到的⾮对称加密算法是 RSA 、 ECC (⼦算法 ECDHE ⽤于密钥交换， ECDSA ⽤于数字签名)(性能和安全略胜⼀筹) HTTPS 中⽬前⼴泛使⽤ ECC 。

### 3. 混合加密

通信刚开始的时候使⽤⾮对称算法，交换秘钥。在客户端⽣成**会话秘钥**后传送给服务端，后续通信采⽤对称加密的⽅式

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20221226122909.png)

> 这⾥还并不安全，还涉及到中间⼈攻击。（ 指攻击者与通讯的两端分别创建独⽴的联系,并交换其所收到的数据 ）

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20221226123339.png)

### 4. 数字证书和 CA

> 因为谁都可以发布公钥，所以我们需要验证对⽅身份。防⽌中间⼈攻击

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20221226123540.png)

> 客户端会判断有效期、颁发者、证书是否被修改及证书是否被吊销。 每份签发证书都可以根据验证链查找到对应的根证书，操作系统、浏览器会在本地存储权威机构的根证书，利⽤本地根证书可以对对应机构签发证书完成来源验证。

- **加密：**对传输的数据进⾏加密。

- **数据⼀致性**：保证传输过程中数据不会被篡改。

- **身份认证**：确定对⽅的真实身份。

## 三、 HTTPS 过程

### 1. 第⼀阶段

- 客户端会发送` handshake Protocol：client hello`

  - Cipher Suites 密钥交换算法 + 签名算法 + 对称加密算法 + 摘要算法 套件列表

  - Random 客户端随机数

  - Version: TLS 1.2

- 服务端会发送 `handleshake Protocol：Server Hello`

  - Version: TLS 1.2

  - Random 服务端随机数

  - Cipher Suites：选择的套件

> 双⽅选择 TLS 版本，确定加密算法，⽣成两个随机数

### 2. 第⼆阶段

- 服务端发送证书 certificate

- 服务端发送 ECDHE 参数，服务端 Hello 完成

  - Server Key Exchange

  - Server Hello Done

- 客户端发送 ECDHE 参数，以后使⽤秘钥进⾏通信吧，加密握⼿消息发送给对⽅

  - Client Key Exchange

  - Change Cipher Spec

  - Encrypted HandleShake Message

- 服务端发送会话凭证，以后使⽤秘钥进⾏通信吧，加密握⼿消息发送给对⽅

  - new Session Ticket

  - Change Cipher Spec

  - Encrypted HandleShake Message

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20221226124922.png)

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20221226125026.png)

## SSL 协议组成

> SSL 握⼿协议、 SSL 秘钥变化协议、 SSL 警告协议、 SSL 记录协议等
