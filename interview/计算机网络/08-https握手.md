---
title: 8. https 的详细握手过程
last_update:
  date: 12/26/2022
  author: 高红翔
---

https 在七层协议里面属于应用层，他基于 tcp 协议，所以，https 握手的过程，一定先经过 tcp 的三次握手，tcp 链接建立好之后，才进入 https 的对称密钥协商过程，对称密钥协商好之后，就开始正常的收发数据流程。

接下来拿实际网络数据包来解释 https 的整个详细的握手过程

打开 wireshark 抓包工具，并随手打开命令行，输入了如下一行命令

```js
curl https://www.baidu.com
```

上面其实涉及到两个问题：

1. 为什么是 wireshark，而不是 fiddler 或者 charles

> fiddler 和 charles 主要是用于抓取应用层协议 https/http 等上层的应用数据，都是建立链接成功后的数据，而 wireshark 是可以抓取所有协议的数据包（直接读取网卡数据）,我们的目的是抓取 https 建立链接成功前的过程，所以我们选择 wireshark

1. 为什么是用 curl， 而不是在浏览器打开[https://www.baidu.com](https://www.baidu.com/)

> curl 是只发送一个请求，如果是用浏览器打开百度，那百度页面里面的各种资源也会发送请求，容易造成很多不必要的数据包

好，重点来了，开始上图：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d35f23a759~tplv-t2oaga2asx-image.image)

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d35d13a4a3~tplv-t2oaga2asx-image.image)

遇到凡事不要慌，接下来待我给你慢慢道来（ack 消息属于 tcp 协议里面的确认报文，不做解释）

#### 第一步

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d37944412d~tplv-t2oaga2asx-image.image)

> 解释说明：tcp 三次握手，这个不做解释，如果这块不清楚，比如 ack，seq,mss,win 都代表什么意思，这个可以在互动区留言，我视情况专门写几篇 tcp 的文章（这块太大了，没几篇是介绍不完的）

#### 第二步：客户端发送 client_hello

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d382590b63~tplv-t2oaga2asx-image.image)

> 解释说明：客户端发送 client_hello，包含以下内容（请自行对照上图） 1. 包含 TLS 版本信息 2. 随机数（用于后续的密钥协商）random_C 3. 加密套件候选列表 4. 压缩算法候选列表 5. 扩展字段 6. 其他

#### 第三步：服务端发送 server_hello

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d382b41cba~tplv-t2oaga2asx-image.image)

> 解释说明：服务端收到客户端的 client_hello 之后，发送 server_hello，并返回协商的信息结果 1. 选择使用的 TLS 协议版本 version 2. 选择的加密套件 cipher suite 3. 选择的压缩算法 compression method 4. 随机数 random_S 5. 其他

#### 第四步：服务端发送证书

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d38fb8cb0a~tplv-t2oaga2asx-image.image)

> 解释说明：服务端发送完 server_hello 后，紧接着开始发送自己的证书（不清楚证书是什么的，可以移步到[上一篇文章](https://juejin.cn/post/6845166890675863559)），从图可知：因包含证书的报文长度是 3761，所以此报文在 tcp 这块做了分段，分了 3 个报文把证书发送完了

> 问自己： 1. 分段的标准是什么？ 2. 什么时候叫分段，什么时候叫分片？ 3. 什么是 MTU，什么是 MSS

#### 第五步：服务端发送 Server Key Exchange

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d39c421f6c~tplv-t2oaga2asx-image.image)

> 解释说明:对于使用 DHE/ECDHE 非对称密钥协商算法的 SSL 握手，将发送该类型握手。RSA 算法不会进行该握手流程（DH、ECDH 也不会发送 server key exchange）,也就是说此报文不一定要发送，视加密算法而定。SSL 中的 RSA、DHE、ECDHE、ECDH 流程与区别可以参考[此篇文章](https://blog.csdn.net/mrpre/article/details/78025940)

#### 第六步：服务端发送 Server Hello Done

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d39da43999~tplv-t2oaga2asx-image.image)

> 解释说明:通知客户端 server_hello 信息发送结束

#### 第七步：客户端发送.client_key_exchange+change_cipher_spec+encrypted_handshake_message

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d3a40a1250~tplv-t2oaga2asx-image.image)

> 解释说明: 1. client_key_exchange，合法性验证通过之后，向服务器发送自己的公钥参数，这里客户端实际上已经计算出了密钥 2. change_cipher_spec，客户端通知服务器后续的通信都采用协商的通信密钥和加密算法进行加密通信 3. encrypted_handshake_message，主要是用来测试密钥的有效性和一致性

#### 第八步：服务端发送 New Session Ticket

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d3abf1b828~tplv-t2oaga2asx-image.image)

> 解释说明:服务器给客户端一个会话，用处就是在一段时间之内（超时时间到来之前），双方都以协商的密钥进行通信。

#### 第九步：服务端发送 change_cipher_spec

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d3c1450526~tplv-t2oaga2asx-image.image)

> 解释说明:服务端解密客户端发送的参数，然后按照同样的算法计算出协商密钥，并通过客户端发送的 encrypted_handshake_message 验证有效性，验证通过，发送该报文，告知客户端，以后可以拿协商的密钥来通信了

#### 第十步：服务端发送 encrypted_handshake_message

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d3c16ebfc4~tplv-t2oaga2asx-image.image)

> 解释说明:目的同样是测试密钥的有效性，客户端发送该报文是为了验证服务端能正常解密，客户端能正常加密，相反：服务端发送该报文是为了验证客户端能正常解密，服务端能正常加密

#### 第十一步：完成密钥协商，开始发送数据

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d3c1a4c0bc~tplv-t2oaga2asx-image.image)

> 解释说明：数据同样是分段发送的

#### 第十二步：完成数据发送，4 次 tcp 挥手

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d3c683075f~tplv-t2oaga2asx-image.image)

> 解释说明：红框的意思是：客户端或服务器发送的，意味着加密通信因为某些原因需要中断，警告对方不要再发送敏感的数据,服务端数据发送完成也会有此数据包，可不关注

## 结语

最后用一张图来说明以下过程

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/7/173272d3c783474a~tplv-t2oaga2asx-image.image)
