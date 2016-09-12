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
];

@Injectable()
export class ArticleApi {
  query(params = {}): Observable<Article> {
    return Observable.from(items).filter((item)=>!item.hidden);
  }
}
