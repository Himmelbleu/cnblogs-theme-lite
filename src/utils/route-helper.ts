/**
 * Vue Router 工具，解析 url，跳转对应的 router
 *
 * @author Himmelbleu
 * @since 1.0
 * @date 2022 年 12 月 1 日
 * @url https://www.cnblogs.com/Himmelbleu/#/
 */

import { Router } from "vue-router";
import { belongs } from "@/lite.config";
import { useCommentsAnchorStore } from "@/store";

export enum RouteName {
  ESSAY = "Essay",
  HOME = "Home",
  CATEGORY = "Category",
  TAG_PAGE = "TagPage",
  TAGS = "MyTags",
  GALLERY = "Gallery"
}

const Regs = {
  ESSAY: /\/p\/\d+.html/g,
  CATEGORY: /\/category\/\d+/g,
  TAG_PAGE: /\/tag\/[\w\s\u4e00-\u9fa5\n.\-|_]+/g,
  MyTags: /\d/g,
  GALLERY: /\/gallery\/image/g
};

export function parseUrlData(url: string): any {
  if (Regs.ESSAY.test(url)) {
    try {
      const commentAnchor = url.match(/#\/\d+/g)[0].split("#/")[1];
      if (commentAnchor) {
        const { setAnchor } = useCommentsAnchorStore();
        setAnchor(parseInt(commentAnchor));
      }
    } catch (e) {}
    return {
      type: RouteName.ESSAY,
      id: url.match(Regs.ESSAY)[0].split("/")[2].split(".")[0]
    };
  } else if (Regs.CATEGORY.test(url)) {
    let page = String(url.match(/page=\d/g)).split("=")[1];
    return {
      type: RouteName.CATEGORY,
      page: page ? page : "1",
      id: String(url.match(Regs.CATEGORY)).split("/")[2].split(",")[0]
    };
  } else if (Regs.TAG_PAGE.test(url)) {
    return {
      type: RouteName.TAG_PAGE,
      tag: decodeURI(url).match(Regs.TAG_PAGE)![0].split("/")[2]
    };
  } else if (Regs.GALLERY.test(url)) {
    return { type: RouteName.GALLERY };
  }
}

function joinUrl(redirect: string): string {
  return `${window.location.protocol}//${window.location.host}${belongs}/#/${redirect}`;
}

// @ts-ignore
export function compareUrl(url?: any, route: string): boolean {
  return url?.type && url.type === route;
}

export function reviseUrl(url: string): void {
  window.history.pushState("", "", joinUrl(url));
}

export function nav(path: string, router?: Router) {
  if (path === "back") {
    router.go(-1);
  } else {
    if (router) router.push(path);
    else window.open(path, "_blank");
  }
}
