import $ from "jquery";
import { CustType } from "@/types/data-type";
import { preLog, reloadObjProps, getSetting, getSettingTemp } from "@/utils/common";

export let __LITE_CONFIG__: CustType.ILite;
export let blogId = 0;
export let baseAPI = "";
export let blogApp = "";
export let isLogin = true;
export let isOwner = true;
export let userGuid = "";
export let isFollow = false;
export const pcDevice = !/iPhone|iPad|iPod|Android|IEMobile/.test(navigator.userAgent);

/**
 * 初始化博客重要变量，这些变量不能通过 head script 获取，在一些元素属性上。
 */
function getUserGuid() {
  return $("#p_b_follow > a")?.attr("onclick")?.split("(")[1]?.split(")")[0]?.replaceAll("'", "") ?? "";
}

/**
 * 初始化博客重要变量，这些变量不能通过 head script 获取，在一些元素属性上。
 */
function getIsFollow() {
  return $("#p_b_follow > a")?.text() === "-取消关注" ?? false;
}

/**
 * 初始化自定义博客设置
 */
function initSetting() {
  const setting = getSetting().value;
  localStorage.setItem(`l-${blogApp}-setting`, JSON.stringify(reloadObjProps(setting, getSettingTemp())));

  $("html").attr("class", setting.theme.mode);
  $("html").css({
    "--l-theme-color": setting.theme.color,
    "--cabinet-width": `${setting.cabinet.width}rem`,
    "--content-width": `${setting.content.width}vw`,
    "--l-bg-filter": `${setting.background.filter}px`
  });
}

/**
 * 初始化 lite，所有工作准备完成之后，走回调函数，挂载 app。
 * @param dev 开发模式下直接挂载 app
 * @param pro 生产模式下，打包部署之后，给 window 注册一个函数，等待博客园资源加载完成之后再挂载 app。
 */
export function useLite(dev: Function, pro: Function) {
  $("body").append(`<div id="app"></div>`);
  $("body").append(`<div id="l-menu-container"></div>`);
  $("head").append(`<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack-subset.css" />`);

  window.oncontextmenu = () => {
    return false;
  };

  if (import.meta.env.PROD) {
    // @ts-ignore
    blogId = currentBlogId;
    // @ts-ignore
    blogApp = currentBlogApp;
    // @ts-ignore
    isLogin = isLogined;
    // @ts-ignore
    isOwner = isBlogOwner;
    baseAPI = `https://www.cnblogs.com/${blogApp}`;
    userGuid = getUserGuid();
    isFollow = getIsFollow();
    // @ts-ignore
    __LITE_CONFIG__ = window["__LITE_CONFIG__"];
    initSetting();
    pro();
  } else if (import.meta.env.DEV) {
    blogId = import.meta.env.VITE_BLOG_ID;
    blogApp = import.meta.env.VITE_BLOG_APP;
    baseAPI = "/api";
    __LITE_CONFIG__ = {
      cabinet: {
        signature: "Time tick away, dream faded away!"
      },
      nameplate: {
        tags: ["Web 前端", "二次元", "简约", "拖延症", "吸猫"],
        connection: [
          {
            name: "Email",
            text: "zhengrenfu@outllok.com",
            img: "https://images.cnblogs.com/cnblogs_com/blogs/666252/galleries/2281365/o_230306161009_wechat.png"
          },
          {
            name: "WeChat",
            text: "Himmelbleu",
            img: "https://images.cnblogs.com/cnblogs_com/blogs/666252/galleries/2281365/o_230306161002_outlook.png"
          }
        ],
        intro: "平时喜欢逛 B站，刷短视频、看 Vtuber（DD），如果有喜欢的电视剧就会狂刷。",
        warehouse: [{ text: "cnblogs-theme-lite", url: "http://www.gitee.com/cnblogs-theme-lite" }],
        experience: [{ text: "基于 Vue3 的回收平台", date: "22.03.10" }],
        gossip: "抽到水神！",
        photo: {
          disabled: true,
          src: [
            "https://img2.baidu.com/it/u=803568479,1965819057&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281",
            "https://img2.baidu.com/it/u=4148750470,234532345&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=834"
          ]
        }
      }
    };
    initSetting();
    dev();
  }

  $("head").append(`<link rel="shortcut icon" href="${__LITE_CONFIG__.icon}">`);
  preLog("GitHub", "https://github.com/Himmelbleu/cnblogs-theme-lite");
  preLog("v1.5.1", "Powered By Himmelbleu using Vue3 & Vite.");
}
