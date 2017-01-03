import {Injectable} from '@angular/core';
import {Article} from '../../models/article';
import {Observable} from 'rxjs/Observable';

const items: Article[] = [
    {
    id: '如何工程化开发大型angular2项目（上篇续）',
    title: '如何工程化开发大型angular2项目（上篇续）',
    summary: 'angular2刚出不久，很多技术主管在观望是否要把angular2投入生存环境，作为一名作死者，从今年3月就投入生存环境，8个月来挖坑经验告诉你，绝对没问题。已经百家大型客户投入使用！',
    content: require('./231.如何工程化开发大型angular2项目（上篇续）/_index.md'),
    first: true,
    tags: ['现在'],
    authors: ['大炮'],
  },
  {
    id: 'compiler angular2 aot',
    title: 'Angular 2 中的编译器与预编译（AoT）优化',
    summary: '介绍编译器和预编译优化在Angular中具体的工作和原理',
    content: require('./320.Angular 2 中的编译器与预编译（AoT）优化/_index.md'),
    first: true,
    tags: ['aot,compiler,angular'],
    authors: ['VTHINKXIE'],
  },
  {
    id: 'ng-container introduction',
    title: 'ng-container 简介',
    summary: 'Angular 2 的模版中，有一系列特殊的存在，ng-container 就是其中之一，在本文中将会进行简要介绍',
    content: require('./310.ng-container introduction/_index.md'),
    first: true,
    column: 'trotyl',
    tags: ['ng2'],
    authors: ['trotyl'],
  },
  {
    id: 'simple-prototype-chain',
    title: '白话 JS 的原型链',
    summary: '本文记录笔者学习 JS 原型链的过程中的一些心得。',
    content: require('./timliu/simple-prototype-chain/_index.md'),
    first: true,
    tags: ['JavaScript', 'prototype', 'prototype chain'],
    authors: ['timliu']
  },
  {
    id: 'GDD大会Angular2优秀项目案例-任意门',
    title: 'GDD大会Angular2优秀项目案例-任意门',
    summary: '本文主要介绍了GDD大会上angular2优秀案例-任意门，其中包含了任意门开发中遇到的一些重难点。',
    content: require('./310.GDD大会Angular2优秀项目案例-任意门/_index.md'),
    first: true,
    tags: ['Angular2','项目实例'],
    authors: ['易sense'],
  },
  {
    id: '使用 Angular 2 制作简单的 Accordionr 组件 - Model Driven',
    title: '使用 Angular 2 制作简单的 Accordionr 组件 - Model Driven',
    summary: 'Accordion 后面加一个 r 是几个意思？',
    content: require('./timliu/simple-accordion-reactive/_index.md'),
    first: true,
    tags: ['Angular'],
    authors: ['timliu'],
  },
  {
    id: 'Angular2中的StructuralDirective',
    title: 'Angular 2 中的 Sturctural Directive',
    summary: 'Angular 2 中，*NgFor 这种神奇的写法及其功能是如何实现的呢？本文将深入探寻 Structural Directive 的本质',
    content: require('./290.Angular 2 中的 Structural Directive/_index.md'),
    first: false,
    column: 'trotyl',
    tags: ['ng2', 'Structural Directive'],
    authors: ['trotyl'],
  },
  {
    id: 'Angular 的版本号与发布周期',
    title: 'Angular 的版本号与发布周期',
    summary: '本文摘译了 Angular 官方博客中关于版本号与发布周期的内容。',
    content: require('./timliu/angular-versioning/_index.md'),
    first: true,
    translation: true,
    tags: ['Angular', 'semver'],
    authors: ['timliu'],
  },
  {
    id: '单例模式与Angular',
    title: '单例模式与Angular',
    summary: '简单介绍单例模式的概念和作用，并结合Angular的依赖注入了解Angular中的单例模式用法。',
    content: require('./300.单例模式与Angular/_index.md'),
    first: true,
    tags: ['单例模式', 'Angular', '设计模式'],
    authors: ['王開寧'],
  },
  {
    id: '一个简单的RxJS Test Spec',
    title: '一个简单的RxJS Test Spec',
    summary: '简要介绍如何编写并运行RxJS Unit Test Spec',
    content: require('./timliu/a-simple-rxjs-test-spec/_index.md'),
    first: true,
    tags: ['RxJS'],
    authors: ['timliu'],
  },
  {
    id: 'Angular2中的通信方式',
    title: 'Angular2中的通信方式',
    summary: 'Angular 2 中，我们难免需要进行组件间的相互通信，但是这些通信方式你真的都知道吗？',
    content: require('./280.Angular2中的通信方式/_index.md'),
    first: true,
    tags: ['ng2'],
    authors: ['trotyl'],
  },
  {
    id: '如何优雅升级ng2小版本',
    title: '如何优雅升级ng2小版本',
    summary: '使用npm命令，搞定ng2小版本升级',
    content: require('./280.如何优雅升级ng2小版本/_index.md'),
    first: true,
    tags: ['ng2升级', 'npm 常用命令'],
    authors: ['木丁糖'],
  },
  {
    id: '从ng1到ng2的平滑升级[2]',
    title: '从ng1到ng2的平滑升级[2]',
    summary: '系列文章：手把手教你将ng1项目平滑升级至ng2',
    content: require('./270.从ng1到ng2的平滑升级[2]/_index.md'),
    first: true,
    tags: ['ng1', 'ng2', '平滑升级', 'es6', 'typescript'],
    authors: ['王開寧'],
  },
  {
    id: '如何工程化开发大型angular2项目',
    title: '如何工程化开发大型angular2项目',
    summary: 'angular2刚出不久，很多技术主管在观望是否要把angular2投入生存环境，作为一名作死者，从今年3月就投入生存环境，8个月来挖坑经验告诉你，绝对没问题。已经百家大型客户投入使用！',
    content: require('./230.如何工程化开发大型angular2项目/_index.md'),
    first: true,
    tags: ['现在'],
    authors: ['大炮'],
  },
  {
    id: '应用RxJS模拟redux-第二集-Todo-App',
    title: '应用RxJS模拟redux - 第二集 - Todo App',
    summary: '以Redux的思维，借助RxJS，制作一个Todo App。',
    content: require('./timliu/mock-redux-with-rxjs-episode-2-todo-app/_index.md'),
    first: true,
    tags: ['RxJS'],
    authors: ['timliu']
  },
  {
    id: 'simple-rxjs',
    title: '白话RxJS',
    summary: '本文将尝试用白话来解读RxJS。',
    content: require('./timliu/simple-rxjs/_index.md'),
    first: true,
    tags: ['rxjs'],
    authors: ['timliu'],
  },
  {
    id: '构建流式应用—RxJS详解',
    title: '构建流式应用—RxJS详解',
    summary: '通过 RxJS 的实现原理、基础实现及实例来一步步分析，提供 RxJS 较为全面的指引，感受使用 RxJS 优雅编码体验。',
    content: require('./270.构建流式应用—RxJS详解/_index.md'),
    tags: ['RxJS'],
    authors: ['joeyguo'],
  },
  {
    id: 'simple-javascript-event-loop-and-async',
    title: '白话Javascript的Event Loop和Async',
    summary: '以编程初学者的视角描述Javascript, Event Loop和Async的模样',
    content: require('./timliu/simple-javascript-event-loop-and-async/_index.md'),
    first: true,
    tags: ['event loop', 'async'],
    authors: ['timliu'],
  },
  {
    id: '一个依赖注入小框架的实现',
    title: '一个依赖注入小框架的实现',
    summary: '《依赖注入简介》介绍了下依赖注入的原理，本文尝试使用ES5代码来做一个依赖注入框架的实现。',
    content: require('./250.一个依赖注入小框架的实现/_index.md'),
    first: true,
    tags: ['DI'],
    authors: ['钉子哥']
  },
  {
    id: '从ng1到ng2的平滑升级[1]',
    title: '从ng1到ng2的平滑升级[1]',
    summary: '系列文章：手把手教你将ng1项目平滑升级至ng2',
    content: require('./260.从ng1到ng2的平滑升级[1]/_index.md'),
    first: true,
    tags: ['ng1', 'ng2', '平滑升级', 'es6', 'typescript'],
    authors: ['王開寧'],
  },
  {
    id: '依赖注入简介',
    title: '依赖注入简介',
    summary: '什么是依赖注入？又为什么需要依赖注入？本文尝试给出一个简短的回答。',
    content: require('./250.依赖注入简介/_index.md'),
    first: true,
    tags: ['DI'],
    authors: ['钉子哥'],
  },
  {
    id: '应用RxJS模拟redux',
    title: '应用RxJS模拟redux',
    summary: '参照RxJS Doc中的state store示例，加入Subject，模拟redux。',
    content: require('./timliu/mock-redux-with-rxjs/_index.md'),
    first: true,
    tags: ['RxJS'],
    authors: ['timliu'],
  },
  {
    id: 'Angular 2官方文档导读',
    title: 'Angular 2官方文档导读',
    summary: '上两周的文章仍然偏深，这周我们写一些入门级的。我们就先从官方文档导读开始。本文将告诉你如何通过阅读官方文档来快速入门。',
    content: require('./220.Angular 2官方文档导读/_index.md'),
    first: true,
    tags: ['现在'],
    authors: ['雪狼'],
  },
  {
    id: 'RxJS Overview阅读笔记',
    title: 'RxJS Overview阅读笔记',
    summary: 'RxJS将异步数据抽象为可被订阅的数据流，并提供了对数据流进行各种转换操作的接口。本文是我阅读官网RxJS概述的笔记，主要介绍RxJS涉及到的主要概念。',
    content: require('./250.RxJS Overview阅读笔记/_index.md'),
    first: true,
    tags: ['RxJS'],
    authors: ['钉子哥'],
  },
  {
    id: '如何选择合适的框架',
    title: '如何选择合适的框架',
    summary: '无论是在社区还是在公司，我都不愿意公开比较两个框架，因为我无法容忍自己公开发表不够专业的意见。那么我在公开发表意见方面恪守着哪些原则呢？请看本文。',
    content: require('./200.如何选择合适的框架/_readme.md'),
    first: true,
    tags: ['现在', '未来'],
    authors: ['雪狼'],
  },
  {
    id: '杂谈：何不食肉糜？',
    title: '杂谈：何不食肉糜？',
    summary: '今天，我们不谈技术。来聊点八卦吧，雪狼的第一重身份其实是儒生，他为什么选择翻译官方文档？因为这源于儒者的信仰。请听我细说从头。',
    content: require('./190.杂谈：何不食肉糜？/_readme.md'),
    first: true,
    tags: ['过去'],
    authors: ['雪狼'],
  },
  {
    id: 'TypeScript的新特性',
    title: 'TypeScript的新特性',
    summary: 'Angular 2把TypeScript作为首选语言，很多新人可能还不太熟悉，就我来把一些个人的理解分享给大家。小鲜肉的处女作，多谢捧场',
    content: require('./161.TypeScript的新特性/_index.md'),
    first: true,
    tags: ['ts'],
    authors: ['wike'],
  },
  {
    id: '注解与装饰器',
    title: '注解与装饰器的点点滴滴',
    summary: '注解（Annotation）和装饰器（Decorator）是两个截然不同的概念，但在 Angular 中往往容易造成混淆，本文将简要阐述两个的区别与联系',
    content: require('./180.注解与装饰器的点点滴滴/_index.md'),
    first: false,
    column: 'trotyl',
    tags: [],
    authors: ['trotyl'],
  },
  {
    id: '如何理解RxJS',
    title: '如何理解 RxJS？',
    summary: 'RxJS 可能对很多人而言是一个从没听说过的新名词，那么 RxJS 到底是什么呢？本文中将予以简要介绍',
    content: require('./110.如何理解RxJS/_index.md'),
    first: true,
    column: 'trotyl',
    tags: [],
    authors: ['trotyl'],
  },
  {
    id: 'AngularConnect 2016视频',
    title: 'AngularConnect 2016视频',
    summary: '朋友，听说过AC 2016吗？串辞了……回来。Angular的顶级大神们刚刚在伦敦开完了正式发布后的首次大会，其中干货满满。然而他们把视频都上传到了YouTube，然后，你懂的…… 不过谷歌开发技术推广部把它们都上传到了国内，而且我们已经为其中之一配上了中文字幕。这是我们的分享。',
    content: require('./160.AngularConnect 2016视频/_index.md'),
    first: true,
    tags: [],
    authors: ['汪志成', '叶志敏', '程路', '大漠穷秋'],
  },
  {
    id: 'Angular依赖注入机制与服务的作用范围',
    title: 'Angular依赖注入机制与服务的作用范围',
    summary: '要想深入理解Angular 2，依赖注入系统是必须迈过的一道坎，而Angular 2中的依赖注入系统在更加强大的同时，也多出来很多需要注意的地方。今天就有请叶志敏为你深入讲解服务与依赖注入系统',
    content: require('./170.Angular依赖注入机制与服务的作用范围/_index.md'),
    first: true,
    tags: [],
    authors: ['叶志敏'],
  },
  {
    id: '流言终结者！Angular的版本与发布',
    title: '流言终结者！Angular的版本与发布',
    summary: '前些天，网上有传言说Angular将在半年后推出3.0版，弄得人心惶惶。其实那只是断章取义的说法！今天，就让我来终结这些流言，还大家一个真相！',
    content: require('./150.流言终结者！Angular的版本与发布/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: [],
    authors: ['雪狼'],
  },
  {
    id: '调查结果与后续计划',
    title: '调查结果与后续计划',
    summary: '在国庆前发起的“Angular中文社区公众号未来的方向”调查中，我们共收到了135份反馈。老实说，这个结果远超我的预期，非常感谢大家的热情参与。这里，我将和大家分享一下统计结果，并据此制定后续发布计划。当然，本计划仍然会不断收集你们的反馈，今后无论是在工作计划上还是在内容安排上有什么意见或建议，都欢迎随时给我们留言。',
    content: require('./140.调查结果与后续计划/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: [],
    authors: ['雪狼'],
  },
  {
    id: 'Angular 2中的路由',
    title: 'Angular 2中的路由',
    summary: 'Angular 2推出了一个强大的路由系统，这里我们先做一个简介，后面再逐渐展开',
    content: require('./130.Angular 2中的路由/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: [],
    authors: ['雪狼'],
  },
  {
    id: 'Angular 2 中的 Free Style Selector',
    title: 'Angular 2 中的 Free Style Selector',
    summary: '几乎所有 Component 中我们都会用到 selector 这个属性，但是这个 selector 真的有那么简单吗？',
    content: require('./120.Angular 2 中的 Free Style Selector/_index.md'),
    first: true,
    column: 'trotyl',
    tags: [],
    authors: ['trotyl']
  },
  {
    id: 'Angular 2的大小与性能',
    title: 'Angular 2的大小与性能',
    summary: '这些天听到一些关于Angular 2的大小与性能的疑问，比如：它的大小已经到60k了，能不能进一步缩小到20k啊？本文将给你答案',
    content: require('./100.Angular 2的大小与性能/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在', '未来'],
    authors: ['雪狼']
  },
  {
    id: 'Angular 和 TypeScript 是否为最佳实践？',
    title: 'Angular 和 TypeScript 是否为最佳实践？',
    summary: '对于一些新接触 TypeScript 的童鞋们来说，往往会觉得 TypeScript 非常复杂难以理解。',
    content: require('./80.Angular 和 TypeScript 是否为最佳实践？/_index.md'),
    first: true,
    column: 'trotyl',
    tags: [],
    authors: ['trotyl']
  },
  {
    id: '浅谈微信小程序与PWA',
    title: '浅谈微信小程序与PWA',
    summary: '被微信小程序刷屏了？来看看PWA吧，这是它的思想源头',
    content: require('./90.浅谈微信小程序与PWA/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在', '未来'],
    authors: ['雪狼']
  },
  {
    id: 'Angular 2的入门路径',
    title: 'Angular 2的入门路径',
    summary: '想学Angular 2却无从下手？这里是一个简明的指南，为各种不同背景的程序员建议了一些学习路径',
    content: require('./80.Angular 2的入门路径/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在', '未来'],
    authors: ['雪狼']
  },
  {
    id: 'Angular 2技术选型指南',
    title: 'Angular 2技术选型指南',
    summary: '如果你正在为技术选型而烦恼，特别是在纠结是否要开始使用Angular 2，本文将为你提供一些信息来辅助决策',
    content: require('./70.Angular 2技术选型指南/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在', '未来'],
    authors: ['雪狼']
  },
  {
    id: '表单的救赎',
    title: '表单的救赎',
    summary: '表单处理工作有多复杂，每个前端以及每个后端都心知肚明，而Angular 2的到来，将让表单处理代码呈现出一种新的风貌',
    content: require('./60.表单的救赎/_index.md'),
    first: true,
    hidden: true,
    column: '雪狼湖',
    tags: ['现在', '烧脑'],
    authors: ['雪狼']
  },
  {
    id: '弯道超车！后端程序员的Angular快速指南',
    title: '弯道超车！后端程序员的Angular快速指南',
    summary: '与其临渊羡鱼，不如退而结网。看到前端如火如荼的发展，作为后端程序员的你，是否在跃跃欲试的同时又觉得无从下手？本文将给你信心！',
    content: require('./50.弯道超车！后端程序员的Angular快速指南/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在', '烧脑'],
    authors: ['雪狼']
  },
  {
    id: '组件与指令概述',
    title: '组件与指令概述',
    summary: 'Angular 2中的指令变得更加简单和强大，本文将为您讲解Angular 2中的三种指令及其应用',
    content: require('./40.组件与指令概述/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在'],
    authors: ['雪狼']
  },
  {
    id: '一“括”抵千言……Angular 2中的绑定',
    title: '一“括”抵千言……Angular 2中的绑定',
    summary: 'Angular 2提供了空前强大的数据绑定语法。它直接代替了Angular 1中的五十多个内置指令，以及无数的自定义指令，本文为您讲解强大的绑定',
    content: require('./30.一括抵千言……Angular 2中的绑定/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在'],
    authors: ['雪狼']
  },
  {
    id: '漫漫升级路……竟然这么简单',
    title: '漫漫升级路……竟然这么简单？',
    summary: 'Angular 2和Angular 1之间的变化是如此之大，以至于很多人担心能否在两个版本之间迁移的问题，本文将给您答案',
    content: require('./20.漫漫升级路……竟然这么简单/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在'],
    authors: ['雪狼']
  },
  {
    id: '我为什么选择Angular 2',
    title: '我为什么选择Angular 2？',
    summary: '晚期选择恐惧症患者可怎么活啊……本文告诉你答案！',
    content: require('./10.我为什么选择Angular 2/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在'],
    authors: ['雪狼']
  },
  {
    id: '开篇寄语：Angular —— 王者归来',
    title: '开篇寄语：Angular —— 王者归来',
    summary: 'Angular 2即将正式发布，昔日王者强势归来！',
    content: require('./00.开篇寄语：Angular —— 王者归来/_index.md'),
    first: true,
    column: '雪狼湖',
    tags: ['现在'],
    authors: ['雪狼']
  }

];

@Injectable()
export class ArticleApi {
  private items: Article[] = items;

  query(params = {}): Observable<Article> {
    return Observable.from(this.items).filter((item)=>!item.hidden);
  }
}
