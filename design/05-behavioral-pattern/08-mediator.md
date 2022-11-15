---
title: 中介者模式
description: 各对象不用显式地相互引用，将对象与对象之间紧密的耦合关系变得松散，从而可以独立地改变他们
last_update:
  date: 11/09/2022
  author: your name
---

# 中介者模式：找媒人介绍对象

- 中介者模式 （Mediator Pattern）又称调停模式，使得各对象不用显式地相互引用，将对象与对象之间紧密的耦合关系变得松散，从而可以独立地改变他们。核心是多个对象之间复杂交互的封装。
- 根据最少知识原则，一个对象应该尽量少地了解其他对象。如果对象之间耦合性太高，改动一个对象则会影响到很多其他对象，可维护性差。复杂的系统，对象之间的耦合关系会得更加复杂，中介者模式就是为了解决这个问题而诞生的。