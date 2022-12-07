import $ from "jquery";
import * as DataType from "./types/data-type";

const DEV_EN: "dev" | "pro" = "dev";

function devEnv(env: "dev" | "pro") {
  return env === "dev";
}

let __LITE_CONFIG__: DataType.LiteConfigType;

if (!devEnv(DEV_EN)) {
  // @ts-ignore
  __LITE_CONFIG__ = window["__LITE_CONFIG__"];
} else {
  __LITE_CONFIG__ = {
    currentBlogId: 666252,
    currentBlogApp: "Enziandom",
    github: "https://github.com/Enziandom",
    links: [
      { tip: "一个 typescript 教程", href: "", text: "TypeScript 教程" },
      { href: "", text: "TypeScriptTypeScriptTypeScriptTypeScript 教程" }
    ]
  };
}

const Config = {
  __LITE_CONFIG__,
  api: {
    base: devEnv(DEV_EN) ? "/api" : `https://www.cnblogs.com/${__LITE_CONFIG__.currentBlogApp}`
  },
  router: {
    space: devEnv(DEV_EN) ? "" : `/${__LITE_CONFIG__.currentBlogApp}`
  },
  init: () => {
    $("body").append(`<div id="app"></div>`);
    $("html").attr("class", "dark");
  }
};

export default Config;
