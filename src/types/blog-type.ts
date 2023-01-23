export type VoteType = "Bury" | "Digg";

/**
 * 博客园评论和随笔的基础字段，一般是调用接口之后返回过来的字段
 */
interface Blog {
  // 随笔 ID
  postId?: number;
  // 投票类型，反对或赞成
  voteType?: VoteType;
  isAbandoned?: boolean;
}

/**
 * 博客园评论实体，区别于上面定义的评论实体，这个实体是根据博客园的数据库字段而来
 */
export interface BlogComment extends Blog {
  // 评论 ID
  commentId?: number;
  // 评论内容
  body?: string;
  // 回复的评论 ID
  parentId?: number;
  // 当前页面的 index
  pageIndex?: number;
  // 回复评论的 ID
  parentCommentId?: number;
}

/**
 * 获取随笔，返回的博客园接口的字段
 */
export interface BlogEssay extends Blog {}

/**
 * 随笔投票，博客园接口需要的正确字段
 */
export interface BlogEssayVote {
  // 反对数量
  buryCount: number;
  // 点赞数量
  diggCount: number;
  feedbackCount: number;
  // 随笔 ID
  postId: number;
  // 阅读数量
  viewCount: number;
}

/**
 * 有些接口返回的数据类型是博客园的字段，需要该类型进行约束
 */
export interface AjaxType {
  id?: number;
  isSuccess?: boolean;
  message?: string;
  data?: any;
}
