/**
 * 提供对接博客园各种可用的基础 API
 *
 * @author Himmelbleu
 * @since 1.0
 * @date 2022 年 12 月 1 日
 * @url https://www.cnblogs.com/Himmelbleu/#/
 */

import $ from "jquery";
import axios from "axios";
import * as Parser from "./html-parser";
import { BlogType } from "@/types/data-type";
import { baseAPI, blogId } from "@/lite.config";

/**
 * 以 async/await 风格写异步请求，代码更加简洁，逻辑更加清晰
 *
 * @param url 请求地址
 * @returns 返回一个 Promise 对象
 */
async function sendAwaitGet(url: string): Promise<any> {
  let awt;
  try {
    awt = await axios.get(url, { timeout: 5000 });
  } catch (e) {
    console.error(e);
  }
  return awt;
}

/**
 * 以 async/await 风格写异步请求，代码更加简洁，逻辑更加清晰
 *
 * @param url 请求地址
 * @param data 请求体
 * @returns 返回一个 Promise 对象
 */
async function sendAwaitPost(url: string, data: any): Promise<any> {
  let awt;
  try {
    awt = await axios.post(url, data, {
      timeout: 5000,
      headers: { RequestVerificationToken: $("#antiforgery_token").attr("value") }
    });
  } catch (e) {
    console.error(e);
  }
  return awt;
}

/**
 * 获取随笔列表
 *
 * @param page 页数，可以是 0，也可以是 1，都代表第一页。
 * @param isCalc 是否计算页数，由于第一页没有显示页数，只有第二页才有，所以为了不多次重复计算页数，该变量用于控制。
 */
export async function getEssayList(page: number, isCalc: boolean) {
  const { data } = await sendAwaitGet(`${baseAPI}/default.html?page=${page}`);
  return Parser.parseEssayList(data, isCalc);
}

/**
 * 获取随笔
 *
 * @param id 随笔 ID。从首页跳转到随笔页面之后，通过 vue-outer 获取 postId
 */
export async function getEssay(id: number) {
  const { data } = await sendAwaitGet(`${baseAPI}/p/${id}.html`);
  return Parser.parseEssay(id, data);
}

/**
 * 发送随笔的评论
 *
 * @param comment 评论实体
 * @return 获取响应的消息，返回一个 axios 中 data 部分消息
 */
export async function setComment(comment: BlogType.BlogComment): Promise<BlogType.AjaxType> {
  const { data } = await sendAwaitPost(`${baseAPI}/ajax/PostComment/Add.aspx`, comment);
  return data;
}

/**
 * 删除其中一条评论
 *
 * @param comment 评论实体
 */
export async function deleteComment(comment: BlogType.BlogComment) {
  const { data } = await sendAwaitPost(`${baseAPI}/ajax/comment/DeleteComment.aspx`, comment);
  return data;
}

/**
 *  通过 ID 获取单个评论
 *
 * @param comment 评论实体，对应博客园默认的评论字段，需要传递一个包含评论 ID 的实体
 */
export async function getComment(comment: BlogType.BlogComment) {
  const { data } = await sendAwaitPost(`${baseAPI}/ajax/comment/GetCommentBody.aspx`, comment);
  return data;
}

/**
 * 修改评论
 *
 * @param comment 评论实体，对应博客园默认的评论字段，需要传递一个包含评论 ID、评论内容的实体
 */
export async function updateComment(comment: BlogType.BlogComment): Promise<BlogType.AjaxType> {
  const { data } = await sendAwaitPost(`${baseAPI}/ajax/PostComment/Update.aspx`, comment);
  return data;
}

/**
 * 获取评论计数
 *
 * @param id 随笔 ID
 */
export async function getCommentCount(id: number | string) {
  const { data } = await sendAwaitGet(`${baseAPI}/ajax/GetCommentCount.aspx?postId=${id}`);
  return Parser.parseCommentPages(data);
}

/**
 * 点赞或反对评论
 *
 * @param comment 被操作的评论的实体，需要 isAbandoned、postId、voteType 三个字段，其中 voteType 请见 DataType.VoteType，只有两种类型。
 */
export async function voteComment(comment: BlogType.BlogComment): Promise<BlogType.AjaxType> {
  const { data } = await sendAwaitPost(`${baseAPI}/ajax/vote/comment`, comment);
  return data;
}

/**
 * 回复一条评论
 *
 * @param comment 博客园原有的评论实体，需要 body、parentCommentId、postId。parentCommentId 就是回复的那一条的 ID。
 */
export async function replayComment(comment: BlogType.BlogComment): Promise<BlogType.AjaxType> {
  const { data } = await sendAwaitPost(`${baseAPI}/ajax/PostComment/Add.aspx`, comment);
  return data;
}

/**
 * 获取随笔的评论列表
 *
 * @param id 随笔 ID。从首页跳转到随笔页面之后，通过 vue-outer 获取 postId
 * @param page 1 页最多有 50 条评论
 * @param anchorId 当进入的是一个回复评论时，需要传递该参数，默认可以不传递
 */
export async function getCommentList(id: number | string, page: number, anchorId?: number) {
  let url = `${baseAPI}/ajax/GetComments.aspx?postId=${id}&pageIndex=${page}`;
  if (anchorId) url += `&anchorCommentId=${anchorId}&isDesc=false`;
  const { data } = await sendAwaitGet(url);
  return Parser.parseCommentList(data);
}

/**
 * 获取随笔的标签和分类
 *
 * @param id 进入随笔页面之后，从 vue-router 参数中获取
 */
export async function getEssayCatesAndTags(id: number | string) {
  const { data } = await sendAwaitGet(
    `${baseAPI}/ajax/CategoriesTags.aspx?blogId=${blogId}&postId=${id}`
  );
  return Parser.parseEssayCatesAndTags(data);
}

/**
 * 获取随笔的上下篇
 *
 * @param id 进入随笔页面之后，从 vue-router 参数中获取
 */
export async function getPrevNext(id: number | string) {
  const { data } = await sendAwaitGet(`${baseAPI}/ajax/post/prevnext?postId=${id}`);
  return Parser.parsePrevNext(data);
}

/**
 * 点赞或反对该随笔
 *
 * @param entity 随笔实体。必须包含：isAbandoned、postId、voteType 三个字段。
 */
export async function voteEssay(entity: BlogType.BlogEssay): Promise<BlogType.AjaxType> {
  const { data } = await sendAwaitPost(`${baseAPI}/ajax/vote/blogpost`, entity);
  return data;
}

/**
 * 获取随笔点赞和反对的数据
 *
 * @param postId 传递一个数组，数组第一个就是 postId 的值
 */
export async function getEssayVote(postId: number | string): Promise<BlogType.BlogEssayVote> {
  const { data } = await sendAwaitPost(`${baseAPI}/ajax/GetPostStat`, [postId]);
  return data[0];
}

/**
 * 获取分类列表
 *
 * @param id 分类列表 id
 * @param calcPage 是否计算页数？参考 getEssayList 函数对其详细的售卖
 * @param page 页数
 */
export async function getCateList(id: any, calcPage: boolean, page: any) {
  const { data } = await sendAwaitGet(`${baseAPI}/category/${id}.html?page=${page}`);
  return Parser.parseCateList(data, calcPage);
}

/**
 * 获取标签下所有随笔列表
 *
 * @param tag 标签名称
 */
export async function getTagPageList(tag: string) {
  const { data } = await sendAwaitGet(`${baseAPI}/tag/${tag}`);
  return Parser.parseTagPageList(data);
}

/**
 * 获取侧边栏的部分随笔分类列表
 */
export async function getSideCateList() {
  const { data } = await sendAwaitGet(`${baseAPI}/ajax/sidecolumn.aspx`);
  return Parser.parseSideCateList(data);
}

/**
 * 获取侧边栏的博主信息
 *
 */
export async function getSideBloggerInfo() {
  const { data } = await sendAwaitGet(`${baseAPI}/ajax/news.aspx`);
  return Parser.parseSideBloggerInfo(data);
}

/**
 * 获取侧边栏博客的数据
 */
export async function getSideBlogInfo() {
  const { data } = await sendAwaitGet(`${baseAPI}/ajax/blogStats`);
  return Parser.parseSideBlogInfo(data);
}

/**
 * 获取侧边栏阅读排行榜列表
 */
export async function getSideTopList() {
  const { data } = await sendAwaitGet(`${baseAPI}/ajax/TopLists.aspx`);
  return Parser.parseSideBlogTopList(data);
}

/**
 * 获取所有标签列表
 */
export async function getTag() {
  const { data } = await sendAwaitGet(`${baseAPI}/tag`);
  return Parser.parseTags(data);
}