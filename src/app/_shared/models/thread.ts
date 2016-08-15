import {Article} from './article';
export interface Thread {
  id: string;
  /** 题图 */
  picture?: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 作者id */
  authors: string[];
  /** 内容标签，tag */
  tags?: string[];
  /** 分类标签，类似于Github的分类 */
  labels?: string[];
  /** 帖子的回复 */
  comments?: Article[];
}
