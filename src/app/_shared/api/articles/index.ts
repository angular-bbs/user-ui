import {Injectable} from '@angular/core';
import {Article} from '../../models/article';
import {Observable} from 'rxjs/Observable';

const items: Article[] = [
  {
    id: '开篇寄语：Angular —— 王者归来',
    title: '开篇寄语：Angular —— 王者归来',
    summary: 'Angular 2即将正式发布，昔日王者强势归来！',
    content: require('./00.开篇寄语：Angular —— 王者归来/_index.md'),
    first: true,
    tags: ['现在'],
    authors: ['雪狼']
  },
  {
    id: '我为什么选择Angular 2',
    title: '我为什么选择Angular 2？',
    summary: '晚期选择恐惧症患者可怎么活啊……本文告诉你答案！',
    content: require('./10.我为什么选择Angular 2/_index.md'),
    forward: false,
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
    id: 'Angular依赖注入机制与服务的作用范围',
    title: 'Angular依赖注入机制与服务的作用范围',
    summary: '要想深入理解Angular 2，依赖注入系统是必须迈过的一道坎，而Angular 2中的依赖注入系统在更加强大的同时，也多出来很多需要注意的地方。今天就有请叶志敏为你深入讲解服务与依赖注入系统',
    content: require('./170.Angular依赖注入机制与服务的作用范围/_index.md'),
    first: true,
    tags: [],
    authors: ['叶志敏'],
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
    id: 'TypeScript的新特性',
    title: 'TypeScript的新特性',
    summary: 'Angular 2把TypeScript作为首选语言，很多新人可能还不太熟悉，就我来把一些个人的理解分享给大家。小鲜肉的处女作，多谢捧场',
    content: require('./161.TypeScript的新特性/_index.md'),
    first: true,
    tags: ['ts'],
    authors: ['袁志'],
  },
];

@Injectable()
export class ArticleApi {
  query(params = {}): Observable<Article> {
    return Observable.from(items).filter((item)=>!item.hidden);
  }
}
