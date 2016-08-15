import {Component, OnInit} from '@angular/core';
import {MenuItem} from '../_shared';

@Component({
  selector: 'library-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class LibraryHomeComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

  items: MenuItem[] = [
    {
      title: '精品文章',
      description: '技巧、实践、剖析、案例',
      icon: require('./_images/articles.svg'),
      url: './article'
    },
    {
      title: '技术专栏',
      description: '由一线技术专家撰写的专栏',
      icon: require('./_images/professional.svg'),
      url: './column'
    },
    {
      title: '前沿观察',
      description: '来自国内外的重要新闻',
      icon: require('./_images/news.svg'),
      url: './news'
    },
    {
      title: '资源雷达',
      description: '第三方资源的推荐与评测',
      icon: require('./_images/radar.svg'),
      url: './resource'
    },
    {
      title: '友情链接',
      description: '与我们并肩作战的友军站点',
      icon: require('./_images/external.svg'),
      url: './partner'
    }
  ];
}
