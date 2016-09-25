# Angular BBS简介

## 这是什么？

Angular BBS，也就是“Angular中文社区”公众号的后台支持程序，当你从微信公众号中点击“阅读原文”时，就会进入Angular BBS的“资料中心”页面。

这是一个用Angular 2写的开源BBS，特别针对移动端的体验进行优化。

它的主要设计目标是为“Angular中文社区”公众号提供支持，比如：

- 让公众号图文消息的排版更灵活。
- 弥补公众号图文消息一旦发出就无法修改的问题。
- 弥补公众号图文消息中不能嵌入链接的问题。
- 提供更强大的问答功能，能够让提问者很方便的使用Markdown描述问题，并提交代码。
- 为程序员提供一个可以在上下班路上看的Angular 2文档库 - 只要你在Wifi环境下访问它，那么在路上时就不会消耗流量。

本论坛仍在开发中，目前是一个基于Angular 2的纯前端实现，并且做了一个后端API的原型。稍后我们会开始把前后端对接起来。

## 技术架构

Angular BBS的全部源码（含文章）存放在Github上的[angular-bbs](https://github.com/angular-bbs)组下。

前端使用的是Angular 2的RC5版本，稍后会升级到Final。后端使用的是.NET Core，不过它目前的规划中不打算自带数据库，而是使用Github通行证登录，并通过Github的Issues API来把它提交到[q-and-a](https://github.com/angular-bbs/q-and-a)项目中。

## 我们需要你！

Angular BBS是完全开源的项目，并且正在召集参与者，欢迎各位一同参与。你可以通过提Issue来告诉我们你的需求和使用场景；可以通过Pull Request来为我们贡献代码或稿件；如果你能够承诺投入很多时间和精力，还可以成为核心贡献者，请给我留言加入核心组。
