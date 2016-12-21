##任意门项目背景##

----------

VR(即虚拟现实科技)打造的360度全景视效，是一种全新的视觉体验。“VR，可以完美且生动地复现‘现场’和‘全貌’，为观者带来全新生动的第一视角沉浸式感官体验。

民宿有别于旅馆或饭店，是结合了当地人文、自然景观、生态、环境资源的新兴型态，由于民宿具有强烈的个性化特征，较好的体验感，备受游客关注。

真正去过民宿的游客，都会有个感觉，这里通过照片甚至普通的视频没法全面展示，去过才知道，只有身临其境才能体验出民宿的精髓。

通过VR技术，消费者自由自主地选择观看视角，可轻松、全面地了解民宿的特色优势、硬件配套，所见即所得，从这点上来说，VR和民宿是天作之合。



##任意门的目标##

----------

任意门将民宿预定平台与VR技术结合，旨在让旅客在订房前，通过沉浸式体验，可身临其境，轻松、全面地了解民宿的特色。 

##项目技术框架及实现##

----------

###技术选型###

        
- angular2

    使用angular2作为该前端框架缘由,社区早有讨论：
    
    [https://www.zhihu.com/question/38989845](https://www.zhihu.com/question/38989845 "vue、react和angular 2.x谁是2016年的主流？")
    
    [http://sanwen8.cn/p/2226GkX.html](http://sanwen8.cn/p/2226GkX.html "作为前端，我为什么选择 Angular 2？")
    
    但是，有句古话：“任凭弱水三千 我只取一瓢饮”。

- bootstrap3

    前端样式库

- webpack

    项目打包工具

- Cardborad

    3D眼镜(Goolgle)

- Matterport

    模型扫描平台

###项目结构划分###

![项目结构](http://upload-images.jianshu.io/upload_images/2433010-dfa20ed0ffbf49cf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 注：文件定义规则基本按照官方风格进行命名；

###项目中主要难点及解决方案###

- #### 懒加载（lazy load） ####

    懒加载按照官方配置基本可以满足要求：
    
    [https://www.angular.cn/docs/ts/latest/guide/ngmodule.html](https://www.angular.cn/docs/ts/latest/guide/ngmodule.html "惰性加载模块")

- #### 预编译（aot） ####
    
    开发时在`JIT`环境上便于开发，打包发布时建议采用`AOT`编译，当然个人觉得更好的还是`server render`。
    
    [https://www.angular.cn/docs/ts/latest/cookbook/aot-compiler.html](https://www.angular.cn/docs/ts/latest/cookbook/aot-compiler.html "预 (AOT) 编译器")

- #### i18n国际化（ng2-translate） ####
    
    因为个人有相关的国际化json文件，所以该项目倒是没采用官方给出的国际化方案，
    
    这是github社区提供的一个不错i18n方案。
    
    [https://github.com/ocombe/ng2-translate](https://github.com/ocombe/ng2-translate)

- #### 测试（protractor） ####

    Protractor 是 Angular 团队构建的一个端对端的测试运行工具,模拟用户交互,帮助你验证你的Angular应用的运行状况。
    
    [http://www.protractortest.org/](http://www.protractortest.org/)

- #### 项目打包工具（webpack） ####

    官方推荐webpack，当然社区里面也看到有人使用webpack+gulp组合打包。
    
    @AngularClass [https://github.com/AngularClass/angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter)

当然，在项目实际开发中会有许多问题，大部分都有做整理，可以看看我个人的文章及我们团队的博客：

个人技术文档：

[http://www.jianshu.com/users/d0244c5326c5/latest_articles](http://www.jianshu.com/users/d0244c5326c5/latest_articles "个人技术文档")

唯幻科技技术博客：

[http://blog.arvix.cn/blog/category/arvix-tech/](http://blog.arvix.cn/blog/category/arvix-tech/)

## 项目运行地址 ##

----------

[http://www.ostay.cn](http://www.ostay.cn "任意门")

![唯幻科技官方微信](http://upload-images.jianshu.io/upload_images/2433010-b01bde508595a06c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
