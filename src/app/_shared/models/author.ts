export interface Author {
  id: string;
  /** 姓名 */
  name: string;
  /** 头像 */
  avatar: string;
  /** 一句话简介 */
  bio: string;
  /** 详细描述 */
  description: string;
  /** 是否专栏作家 */
  columnist?: boolean;
  homepage?: string;
}
