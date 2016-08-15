export interface Article {
  id: string;
  /** 标题 */
  title: string;
  /** 题图 */
  image?: string;
  /** 简介 */
  summary?: string;
  /** 内容 */
  content: string;
  /** 作者id */
  authors: string[];
  /** 译者id */
  translators?: string[];
  /** 是否转载 */
  forward?: boolean;
  /** 是否翻译 */
  translation?: boolean;
  /** 是否首发 */
  first?: boolean;
  /** 是否独家 */
  exclusive?: boolean;
  /** 所属专栏id */
  column?: string;
  /** 标签 */
  tags?: string[];
  /** 原地址 */
  originalUrl?: string;
  /** 是否隐藏 */
  hidden?: boolean;
}
