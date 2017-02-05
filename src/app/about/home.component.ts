import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../_shared';
import { Router } from '@angular/router';

@Component({
  selector: 'about-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class AboutHomeComponent implements OnInit {
  constructor(private router: Router) {
  }

  items: MenuItem[] = [
    {
      title: '中文社区',
      description: '历史、现状、成员、活动',
      icon: require('./_images/about.svg'),
      url: './us'
    },
    {
      title: '中文官网',
      description: '中文版的教程、指南等',
      icon: require('./_images/angular.svg'),
      url: './site'
    },
    {
      title: '图书推荐',
      description: '中英文技术书籍推荐',
      icon: require('./_images/books.svg'),
      url: './book'
    },
    {
      title: '成功案例',
      description: '国内外企业中的成功案例',
      icon: require('./_images/showcase.svg'),
      url: './showcase'
    },
    {
      title: '合作共赢',
      description: '来！一起推动的繁荣',
      icon: require('./_images/handshake.svg'),
      url: './join'
    },
  ];

  ngOnInit() {
  }

}
