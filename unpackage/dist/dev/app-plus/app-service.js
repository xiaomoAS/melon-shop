if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject$1(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
    if (messages2 && Object.keys(messages2).length > 0) {
      locales = Object.keys(messages2);
    }
    const lang = startsWith(locale, locales);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater: formater2 }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater2 || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      const options = [
        messages2,
        locale
      ];
      locale = options[0];
      messages2 = options[1];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const en$1 = {
    "uni-load-more.contentdown": "Pull up to show more",
    "uni-load-more.contentrefresh": "loading...",
    "uni-load-more.contentnomore": "No more data"
  };
  const zhHans$1 = {
    "uni-load-more.contentdown": "上拉显示更多",
    "uni-load-more.contentrefresh": "正在加载...",
    "uni-load-more.contentnomore": "没有更多数据了"
  };
  const zhHant$1 = {
    "uni-load-more.contentdown": "上拉顯示更多",
    "uni-load-more.contentrefresh": "正在加載...",
    "uni-load-more.contentnomore": "沒有更多數據了"
  };
  const messages = {
    en: en$1,
    "zh-Hans": zhHans$1,
    "zh-Hant": zhHant$1
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  let platform;
  setTimeout(() => {
    platform = uni.getSystemInfoSync().platform;
  }, 16);
  const {
    t: t$2
  } = initVueI18n(messages);
  const _sfc_main$m = {
    name: "UniLoadMore",
    emits: ["clickLoadMore"],
    props: {
      status: {
        // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
        type: String,
        default: "more"
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      iconType: {
        type: String,
        default: "auto"
      },
      iconSize: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: "#777777"
      },
      contentText: {
        type: Object,
        default() {
          return {
            contentdown: "",
            contentrefresh: "",
            contentnomore: ""
          };
        }
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        webviewHide: false,
        platform,
        imgBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlBMzU3OTlEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlBMzU3OUFEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOUEzNTc5N0Q5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOUEzNTc5OEQ5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt+ALSwAAA6CSURBVHja1FsLkFZVHb98LM+F5bHL8khA1iSeiyQBCRM+YGqKUnnJTDLGI0BGZlKDIU2MMglUiDApEZvSsZnQtBRJtKwQNKQMFYeRDR10WOLd8ljYXdh+v8v5fR3Od+797t1dnOnO/Ofce77z+J//+b/P+ZqtXbs2sJ9MJhNUV1cHJ06cCJo3bx7EPc2aNcvpy7pWrVoF+/fvDyoqKoI2bdoE9fX1F7TjN8a+EXBn/fkfvw942Tf+wYMHg9mzZwfjxo0LDhw4EPa1x2MbFw/fOGfPng1qa2tzcCkILsLDydq2bRsunpOTMM7TD/W/tZDZhPdeKD+yGxHhdu3aBV27dg3OnDlzMVANMheLAO3btw8KCwuDmpoaX5OxbgUIMEq7K8IcPnw4KCsrC/r37x8cP378/4cAXAB3vqSkJMuiDhTkw+XcuXNhOWbMmKBly5YhUT8xArhyFvP0BfwRsAuwxJZJsm/nzp2DTp06he/OU+cZ64K6o0ePBkOHDg2GDx8e6gEbJ5Q/NHNuAJQ1hgBeHUDlR7nVTkY8rQAvAi4z34vR/mPs1FoRsaCgIJThI0eOBC1atEiFGGV+5MiRoS45efJkqFjJFXV1dQuA012m2WcwTw98fy6CqBdsaiIO4CScrGPHjvk4odhavPquRtFWXEC25VgkREKOCh/qDSq+vn37htzD/mZTOmOc5U7zKzBPEedygWshcDyWvs30igAbU+6oyMgJBCFhwQE0fccxN60Ay9iebbjoDh06hMowjQxT4fXq1SskArmHZpkArvixp/kWzHdMeArExSJEaiXIjjRjRJ4DaAGWpibLzXN3Fm1vA5teBgh3j1Rv3bp1YgKwPdmf2p9zcyNYYgPKMfY0T5f5nNYdw158nJ8QawW4CLKwiOBSEgO/hok2eBydR+3dYH+PLxA5J8Vv0KBBwenTp0P2JWAx6+yFEBfs8lMY+y0SWMBNI9E4ThKi58VKTg3FQZS1RQF1cz27eC0QHMu+3E0SkUowjhVt5VdaWhp07949ZHv2Qd1EjDXM2cla1M0nl3GxAs3J9yREzyTdFVKVFOaE9qRA8GM0WebRuo9JGZKA7Mv2SeS/Z8+eoQ9BArMfFrLGo6jvxbhHbJZnKX2Rzz1O7QhJJ9Cs2ZMaWIyq/zhdeqPNfIoHd58clIQD+JSXl4dKlyIAuBdVXZwFVWKspSSoxE++h8x4k3uCnEhE4I5KwRiFWGOU0QWKiCYLbdoRMRKAu2kQ9vkfLU6dOhX06NEjlH+yMRZSinnuyWnYosVcji8CEA/6Cg2JF+IIUBqnGKUTCNwtwBN4f89RiK1R96DEgO2o0NDmtEdvVFdVVYV+P3UAPUEs6GFwV3PHmXkD4vh74iDFJysVI/MlaQhwKeBNTLYX5VuA8T4/gZxA4MRGFxDB6R7OmYPfyykGRJbyie+XnGYnQIC/coH9+vULiYrxrkL9ZA9+0ykaHIfEpM7ge8TiJ2CsHYwyMfafAF1yCGBHYIbCVDjDjKt7BeB51D+LgQa6OkG7IDYEEtvQ7lnXLKLtLdLuJBpE4gPUXcW2+PkZwOex+4cGDhwYDBkyRL7/HFcEwUGPo/8uWRUpYnfxGHco8HkewLHLyYmAawAPuIFZxhOpDfJQ8gbUv41yORAptMWBNr6oqMhWird5+u+iHmBb2nhjDV7HWBNQTgK8y11l5NetWzc5ULscAtSj7nbNI0skhWeUZCc0W4nyH/jO4Vz0u1IeYhbk4AiwM6tjxIWByHsoZ9qcIBPJd/y+DwPfBESOmCa/QF3WiZHucLlEDpNxcNhmheEOPgdQNx6/VZFQzFZ5TN08AHXQt2Ii3EdyFuUsPtTcGPhW5iMiCNELvz+Gdn9huG4HUJaW/w3g0wxV0XaG7arG2WeKiUWYM4Y7GO5ezshTARbbWGw/DvXkpp/ivVvE0JVoMxN4rpGzJMhE5Pl+xlATsDIqikP9F9D2z3h9nOksEUFhK+qO4rcPkoalMQ/HqJLIyb3F3JdjrCcw1yZ8joyJLR5gCo54etlag7qIoeNh1N1BRYj3DTFJ0elotxPlVzkGuYAmL0VSJVGAJA41c4Z6A3BzTLfn0HYwYKEI6CUAMzZEWvLsIcQOo1AmmyyM72nHJCfYsogflGV6jEk9vyQZXSuq6w4c16NsGcGZbwOPr+H1RkOk2LEzjNepxQkihHSCQ4ynAYNRx2zMKV92CQMWqj8J0BRE8EShxRFN6YrfCRhC0x3r/Zm4IbQCcmJoV0kMamllccR6FjHqUC5F2R/wS2dcymOlfAKOS4KmzQb5cpNC2MC7JhVn5wjXoJ44rYhLh8n0eXOCorJxa7POjbSlCGVczr34/RsAmrcvo9s+wGp3tzVhntxiXiJ4nvEYb4FJkf0O8HocAePmLvCxnL0AORraVekJk6TYjDabRVXfRE2lCN1h6ZQRN1+InUbsCpKwoBZHh0dODN9JBCUffItXxEavTQkUtnfTVAplCWL3JISz29h4NjotnuSsQKJCk8dF+kJR6RARjrqFVmfPnj3ZbK8cIJ0msd6jgHPGtfVTQ8VLmlvh4mct9sobRmPic0DyDQQnx/NlfYUgyz59+oScsH379pAwXABD32nTpoUHIToESeI5mnbE/UqDdyLcafEBf2MCqgC7NwxIbMREJQ0g4D4sfJwnD+AmRrII05cfMWJE+L1169bQr+fip06dGp4oJ83lmYd5wj/EmMa4TaHivo4EeCguYZBnkB5g2aWA69OIEnUHOaGysjIYMGBAMGnSpODYsWPZwCpFmm4lNq+4gSLQA7jcX8DwtjEyRC8wjabnXEx9kfWnTJkSJkAo90xpJVV+FmcVNeYAF5zWngS4C4O91MBxmAv8blLEpbjI5sz9MTdAhcgkCT1RO8mZkAjfiYpTEvStAS53Uw1vAiUGgZ3GpuQEYvoiBqlIan7kSDHnTwJQFNiPu0+5VxCVYhcZIjNrdXUDdp+Eq5AZ3Gkg8QAyVZRZIk4Tl4QAbF9cXJxNYZMAtAokgs4BrNxEpCtteXg7DDTMDKYNSuQdKsnJBek7HxewvxaosWxLYXtw+cJp18217wql4aKCfBNoEu0O5VU+PhctJ0YeXD4C6JQpyrlpSLTojpGGGN5YwNziChdIZLk4lvLcFJ9jMX3QdiImY9bmGQU+TRUL5CHITTRlgF8D9ouD1MfmLoEPl5xokIumZ2cfgMpHt47IW9N64Hsh7wQYYjyIugWuF5fCqYncXRd5vPMWyizzvhi/32+nvG0dZc9vR6fZOu0md5e+uC408FvKSIOZwXlGvxPv95izA2Vtvg1xKFWARI+vMX66HUhpQQb643uW1bSjuTWyw2SBvDrBvjFic1eGGlz5esq3ko9uSIlBRqPuFcCv8F4WIcN12nVaBd0SaYwI6PDDImR11JkqgHcPmQssjxIn6bUshygDFJUTxPMpHk+jfjPgupgdnYV2R/g7xSjtpah8RJBewhwf0gGK6XI92u4wXFEU40afJ4DN4h5LcAd+40HI3JgJecuT0c062W0i2hQJUTcxan3/CMW1PF2K6bbA+Daz4xRs1D3Br1Cm0OihKCqizW78/nXAF/G5TXrEcVzaNMH6CyMswqsAHqDyDLEyou8lwOXnKF8DjI6KjV3KzMBiXkDH8ij/H214J5A596ekrZ3F0zXlWeL7+P5eUrNo3/QwC15uxthuzidy7DzKRwEDaAViiDgKbTbz7CJnzo0bN7pIfIiid8SuPwn25o3QCmpnyjlZkyxPP8EomCJzrGb7GJMx7tNsq4MT2xMUYaiErZOluTzKsnz3gwCeCZyVRZJfYplNEokEjwrPtxlxjeYAk+F1F74VAzPxQRNYYdtpOUvWs8J1sGhBJMNsb7igN8plJs1eSmLIhLKE4rvaCX27gOhLpLOsIzJ7qn/i+wZzcvSOZ23/du8TZjwV8zHIXoP4R3ifBxiFz1dcVpa3aPntPE+c6TmIWE9EtcMmAcPdWAhYhAXxcLOQi9L1WhD1Sc8p1d2oL7XGiRKp8F4A2i8K/nfI+y/gsTDJ/YC/8+AD5Uh04KHiGl+cIFPnBDDrPMjwRGkLXyxO4VGbfQWnDH2v0bVWE3C9QOXlepbgjEfIJQI6XDG3z5ahD9cw2pS78ipB85wyScNTvsVzlzzhL8/jRrnmVjfFJK/m3m4nj9vbgQTguT8XZTjsm672R5uJKEaQmBI/c58gyus8ZDagLpEVSJBIyHp4jn++xqPV71OgQgJYEWOtZ/haxRtKmWOBu8xdBLftWltsY84zE6WIEy/eIOWL+BaayMx+KHtL7EAkqdNDLiEXmEMUHniedtJqg9HmZtfvt26vNi0BdG3Ft3g8ZOf7PAu59TxtzivLNIekyi+wD1i8CuUiD9FXAa8C+/xS3JPmZnomyc7H+fb4/Se0bk41Fel621r4cgVxbq91V4jVqwB7HTe2M7jgB+QWHavZkDRPmZcASoZEmBx6i75bGjPcMdL4/VKGFAGWZkGzPG0XAbdL9A81G5LOmUnC9hHKJeO7dcUMjblSl12867ElFTtaGl20xvvLGPdVz/8TVuU7y0x1PG7vtNg24oz9Uo/Z412++VFWI7Fcog9tu9Lm6gvRmIPv9x1xmQAu6RDkXtbOtlGEmpgD5Nvnyc0dcv0EE6cfdi1HmhMf9wDF3k3gtRvEedhxjpgfqPb9PU9iEJHnyOUA7bQUXh6kq/D7l2iTjWv7XOD530BDr8jIrus+srXjt4MzumJMHuTsBa63YKE1+RR5lBjEikCCnWKWiHdzOgKO+nRIBAF88za/IFmJ3eMZov4CYxGBabcpGL8EYx+SeMXJeRwHNsV/h+vdxeuhEpN3ZyNY78Gm2fknJxVGhyjixPiQvVkNzT1elD9Py/aTAL64Hb9vcYmC9zfdXdT/C1LeGbg4rnBaAihDFJH12W5ulfNCNe/xTsP3bp8ikzJs5BF+5PNfAQYAPaseTdsEcaYAAAAASUVORK5CYII="
      };
    },
    computed: {
      iconSnowWidth() {
        return (Math.floor(this.iconSize / 24) || 1) * 2;
      },
      contentdownText() {
        return this.contentText.contentdown || t$2("uni-load-more.contentdown");
      },
      contentrefreshText() {
        return this.contentText.contentrefresh || t$2("uni-load-more.contentrefresh");
      },
      contentnomoreText() {
        return this.contentText.contentnomore || t$2("uni-load-more.contentnomore");
      }
    },
    mounted() {
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      var currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    },
    methods: {
      onClick() {
        this.$emit("clickLoadMore", {
          detail: {
            status: this.status
          }
        });
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "uni-load-more",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      !$data.webviewHide && ($props.iconType === "circle" || $props.iconType === "auto" && $data.platform === "android") && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--android-MP"
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      )) : !$data.webviewHide && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--ios-H5"
        },
        [
          vue.createElementVNode("image", {
            src: $data.imgBase64,
            mode: "widthFix"
          }, null, 8, ["src"])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true),
      $props.showText ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 2,
          class: "uni-load-more__text",
          style: vue.normalizeStyle({ color: $props.color })
        },
        vue.toDisplayString($props.status === "more" ? $options.contentdownText : $props.status === "loading" ? $options.contentrefreshText : $options.contentnomoreText),
        5
        /* TEXT, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-9245e42c"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const openApp = function(urls_android = "", urls_ios = "") {
    var u = navigator.userAgent;
    var isWeixin = u.toLowerCase().indexOf("micromessenger") !== -1;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isWeixin) {
      uni.showToast({
        title: "请在浏览器上打开",
        icon: "none"
      });
      return;
    } else {
      if (isAndroid) {
        window.location.href = "hlb://";
        setTimeout(function() {
          let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden;
          if (typeof hidden == "undefined" || hidden == false) {
            window.location.href = urls_android;
          }
        }, 3e3);
      }
      if (isIOS) {
        window.location.href = "hlb://";
        setTimeout(function() {
          let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden;
          if (typeof hidden == "undefined" || hidden == false) {
            window.location.href = urls_ios;
          }
        }, 3e3);
      }
    }
  };
  const open_app = {
    openApp
  };
  getApp();
  const _sfc_main$l = {
    data() {
      return {
        baseUrl: this.$baseURL,
        userInfo: {
          "openid": "@",
          "tel": "@"
        },
        lbt: [],
        usersList: [],
        qidai_img: "",
        isShow: 0,
        tzUrl: "",
        ewm: "",
        static_img: [],
        page: 1,
        //当前页数
        limit: 5,
        //每页多少条数据，不填默认20条
        maxPage: 1,
        //最大页数（page不能超过的数据，超过 就不能上拉加载了）
        uni_status: "more",
        //more:加载前   loading:加载中  noMore:没有更多数据
        product_list: []
      };
    },
    onLoad(option) {
      this.getStaticImg();
      this.getAll();
      this.getProduct_list();
    },
    computed: {},
    onShow() {
      this.xinxi();
      this.system();
    },
    methods: {
      jump_app() {
        let tzUrl = this.tzUrl;
        open_app.openApp(tzUrl);
      },
      getAll() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/index/index", param, {
          custom: {
            show: false
          }
        }).then((res) => {
          that.lbt = res.lbt;
          that.usersList = res.usersList;
          that.qidai_img = res.qidai_img;
        });
      },
      //获取静态图片
      getStaticImg() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/StaticImg/index", param, { custom: { show: false } }).then((res) => {
          that.static_img = res.static_img;
        });
      },
      system() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/index/system", param, { custom: { show: false } }).then((res) => {
          that.tzUrl = res.system.app_url;
          that.ewm = res.system.ewm;
        });
      },
      is_show(val) {
        this.isShow = val;
      },
      show_none() {
        this.isShow = 0;
      },
      xinxi() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/My/xinxi", param, { custom: { show: false } }).then((res) => {
          if (res.userInfo) {
            that.userInfo = res.userInfo;
          } else {
            that.userInfo = "";
          }
        });
      },
      login() {
        uni.navigateTo({
          url: "/pages/user_login/login/login"
        });
      },
      getWeChatCode() {
        let param = {};
        this.$http.post("/api/v1/Weixin/accept", param, {
          custom: {
            show: false
          }
        }).then((res) => {
          const appid = res.appid;
          const url = "http://zq.dongxisport.net/h5/#/pages/my/index/index";
          const redirect_uri = encodeURIComponent(url);
          const state = res.state;
          const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}&connect_redirect=1#wechat_redirect`;
          window.location.href = authUrl;
        });
      },
      getProduct_list() {
        this.uni_status = "loading";
        var that = this;
        let page = this.page;
        let limit = this.limit ? this.limit : "";
        let dataListALL = this.product_list;
        let osName = "APP";
        let param = {
          page,
          limit,
          osName
        };
        this.$http.post("/api/v1/index/product_lists", param, { custom: { show: false } }).then((res) => {
          dataListALL.push(...res.product_list);
          that.product_list = dataListALL;
          that.maxPage = res.maxPage;
          that.plCount = res.count;
          if (that.page == 1 && res.count < 5) {
            that.uni_status = "noMore";
          } else {
            that.uni_status = "more";
          }
        });
      },
      //设置默认值
      moren() {
        this.page = 1;
        this.limit = 5;
        this.dataList = [];
        this.uni_status = "more";
      }
    },
    //监听用户下拉动作，和onLoad等生命周期同级（需要在pages.json中配置）
    onPullDownRefresh() {
      var that = this;
      uni.startPullDownRefresh({
        success() {
          setTimeout(function() {
            that.moren();
            that.product_list = [];
            that.getProduct_list();
            that.getAll();
            uni.stopPullDownRefresh();
          }, 500);
        },
        fail() {
        }
      });
    },
    onReachBottom() {
      let page = this.page;
      let maxPage = this.maxPage;
      if (page < maxPage) {
        this.page++;
        this.getProduct_list();
      } else {
        this.uni_status = "noMore";
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 轮播 "),
      vue.createElementVNode("view", { class: "uni-margin-wrap" }, [
        vue.createElementVNode("swiper", {
          class: "swiper",
          circular: "true",
          "indicator-dots": true,
          autoplay: true,
          interval: 1e3,
          duration: 500
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.lbt, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
                vue.createElementVNode("image", {
                  src: item.pic,
                  mode: "widthFix",
                  class: "lunbo"
                }, null, 8, ["src"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode("view", { class: "index_pulic_head" }, [
        vue.createElementVNode("view", { class: "txt" }, "红单达人")
      ]),
      vue.createElementVNode("view", { class: "index_user_last" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.usersList, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("navigator", {
              url: "/pages/product/lists?zsid=" + item.zsid,
              class: "list",
              key: index
            }, [
              vue.createElementVNode("view", { class: "ava" }, [
                vue.createElementVNode("image", {
                  src: item.avatar,
                  mode: "widthFix"
                }, null, 8, ["src"])
              ]),
              vue.createElementVNode(
                "view",
                { class: "name" },
                vue.toDisplayString(item.username),
                1
                /* TEXT */
              ),
              vue.createCommentVNode(' <view class="txt">10中7</view> '),
              item.is_tuijian == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "tips"
              }, "推荐")) : vue.createCommentVNode("v-if", true)
            ], 8, ["url"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "index_pulic_head" }, [
        vue.createElementVNode("view", { class: "txt" }, "推荐")
      ]),
      vue.createElementVNode("view", { class: "user_product_cont" }, [
        vue.createElementVNode("view", { class: "cont" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.product_list, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("navigator", {
                url: "/pages/product/info?zsid=" + item.zsid + "&id=" + item.id,
                class: "list",
                key: index
              }, [
                vue.createElementVNode("view", { class: "tis_cont" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "tle" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "txt" },
                    vue.toDisplayString(item.desc),
                    1
                    /* TEXT */
                  )
                ]),
                item.dianping ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "tips_txt"
                  },
                  vue.toDisplayString(item.dianping),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("view", { class: "bit_dl" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "dt" },
                    "发布于：" + vue.toDisplayString(item.createtime),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "dd" },
                    "￥" + vue.toDisplayString(item.price),
                    1
                    /* TEXT */
                  )
                ]),
                item.is_yanse == 1 ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 1,
                  class: "hot",
                  src: $data.static_img.tip_i_1,
                  mode: "widthFix"
                }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
              ], 8, ["url"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createVNode(_component_uni_load_more, {
          iconType: "auto",
          status: $data.uni_status
        }, null, 8, ["status"])
      ]),
      vue.createCommentVNode(` <view class="sy_box">\r
			<uni-link :href="tzUrl" :text="tzUrl" v-if="tzUrl != ''">\r
				<image :src="qidai_img" mode="widthFix"></image>\r
			</uni-link>\r
			<image :src="qidai_img" mode="widthFix" v-else></image>\r
		</view> `),
      vue.createElementVNode("view", {
        class: "jsts_floor",
        onClick: _cache[0] || (_cache[0] = ($event) => $options.is_show(4))
      }, [
        vue.createElementVNode("view", null, [
          vue.createElementVNode("text", null, "接收"),
          vue.createTextVNode(),
          vue.createElementVNode("text", null, "推送")
        ])
      ]),
      $data.isShow == 4 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "lxt_dc_cont pulic_dc_cont"
      }, [
        vue.createElementVNode("view", { class: "main_cont" }, [
          vue.createElementVNode("view", { class: "shut_btn" }, [
            vue.createElementVNode("image", {
              src: $data.static_img.shut,
              mode: "widthFix",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.show_none())
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "deta_cont" }, [
            vue.createElementVNode("view", { class: "cont" }, [
              vue.createElementVNode("view", { class: "code_img" }, [
                vue.createElementVNode("image", {
                  src: $data.ewm,
                  mode: "widthFix"
                }, null, 8, ["src"])
              ])
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      !$data.userInfo.openid || !$data.userInfo.tel ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "bottom_resige"
      }, [
        !$data.userInfo.tel ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, "您还未登录，请先登录")) : vue.createCommentVNode("v-if", true),
        !$data.userInfo.tel ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "btn",
          onClick: _cache[2] || (_cache[2] = ($event) => $options.login())
        }, "立即登录")) : vue.createCommentVNode("v-if", true)
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/HbuilderProjects/策略足球/pages/index/index.vue"]]);
  getApp();
  const _sfc_main$k = {
    data() {
      return {
        baseUrl: this.$baseURL,
        userInfo: {},
        static_img: [],
        zhuanjia: {},
        page: 1,
        //当前页数
        limit: 30,
        //每页多少条数据，不填默认20条
        maxPage: 1,
        //最大页数（page不能超过的数据，超过 就不能上拉加载了）
        uni_status: "more",
        //more:加载前   loading:加载中  noMore:没有更多数据
        product_list: [],
        plCount: "",
        searchVal: "",
        isShow: 0,
        tzUrl: "",
        ewm: ""
      };
    },
    onLoad(option) {
      this.getStaticImg();
      let zsid = option.zsid;
      this.zsid = zsid;
      this.getProduct_list(zsid);
    },
    computed: {},
    onShow() {
      this.xinxi();
      this.system();
    },
    methods: {
      jump_app() {
        let tzUrl = this.tzUrl;
        open_app.openApp(tzUrl);
      },
      xinxi() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/My/xinxi", param, { custom: { show: false } }).then((res) => {
          if (res.userInfo) {
            that.userInfo = res.userInfo;
          } else {
            that.userInfo = "";
          }
        });
      },
      system() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/index/system", param, { custom: { show: false } }).then((res) => {
          that.tzUrl = res.system.app_url;
          that.ewm = res.system.ewm;
        });
      },
      getProduct_list(zsid, searchVal = "") {
        this.uni_status = "loading";
        var that = this;
        let page = this.page;
        let limit = this.limit ? this.limit : "";
        let dataListALL = this.product_list;
        let osName = "APP";
        let param = {
          page,
          limit,
          zsid,
          searchVal,
          osName
        };
        this.$http.post("/api/v1/product/lists", param, { custom: { show: false } }).then((res) => {
          if (res.code == 0) {
            uni.showToast({
              title: res.msg,
              icon: "none",
              success() {
                setTimeout(function() {
                  uni.navigateBack({
                    delta: 1
                  });
                }, 300);
              }
            });
            return;
          }
          that.zhuanjia = res.zhuanjia;
          dataListALL.push(...res.product_list);
          that.product_list = dataListALL;
          that.maxPage = res.maxPage;
          that.plCount = res.count;
          if (that.page == 1 && res.count < 5) {
            that.uni_status = "noMore";
          } else {
            that.uni_status = "more";
          }
        });
      },
      //设置默认值
      moren() {
        this.page = 1;
        this.limit = 30;
        this.dataList = [];
        this.uni_status = "more";
      },
      //获取静态图片
      getStaticImg() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/StaticImg/index", param, { custom: { show: false } }).then((res) => {
          that.static_img = res.static_img;
        });
      },
      sousuo() {
        let zsid = this.zsid;
        let searchVal = this.searchVal;
        formatAppLog("log", "at pages/product/lists.vue:265", searchVal);
        this.moren();
        this.product_list = [];
        this.getProduct_list(zsid, searchVal);
      },
      is_show(val) {
        this.isShow = val;
      },
      show_none() {
        this.isShow = 0;
      }
    },
    //监听用户下拉动作，和onLoad等生命周期同级（需要在pages.json中配置）
    onPullDownRefresh() {
      var that = this;
      let zsid = this.zsid;
      uni.startPullDownRefresh({
        success() {
          setTimeout(function() {
            that.moren();
            that.product_list = [];
            that.getProduct_list(zsid);
            uni.stopPullDownRefresh();
          }, 500);
        },
        fail() {
        }
      });
    },
    onReachBottom() {
      let zsid = this.zsid;
      let page = this.page;
      let maxPage = this.maxPage;
      if (page < maxPage) {
        this.page++;
        this.getProduct_list(zsid);
      } else {
        this.uni_status = "noMore";
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", { class: "user_index_head" }, [
        vue.createCommentVNode('    <view class="tips">已关注</view>'),
        vue.createElementVNode("view", { class: "user_inf" }, [
          vue.createElementVNode("view", { class: "ava" }, [
            vue.createElementVNode("image", {
              src: $data.zhuanjia.avatar,
              mode: "widthFix"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode(
            "view",
            { class: "name" },
            vue.toDisplayString($data.zhuanjia.username),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode(
          "view",
          { class: "user_txt" },
          vue.toDisplayString($data.zhuanjia.desc),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "user_nav_cont" }, [
          vue.createElementVNode("view", {
            class: "li zym",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.is_show(1))
          }, [
            vue.createElementVNode("view", { class: "i" }, [
              vue.createElementVNode("image", {
                src: $data.static_img.nav_1,
                mode: "widthFix"
              }, null, 8, ["src"])
            ]),
            vue.createTextVNode(" 主页码 ")
          ]),
          vue.createElementVNode("view", {
            class: "li gzh",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.is_show(2))
          }, [
            vue.createElementVNode("view", { class: "i" }, [
              vue.createElementVNode("image", {
                src: $data.static_img.nav_2,
                mode: "widthFix"
              }, null, 8, ["src"])
            ]),
            vue.createTextVNode(" 公众号 ")
          ]),
          vue.createElementVNode("view", {
            class: "li lxt",
            onClick: _cache[2] || (_cache[2] = ($event) => $options.is_show(3))
          }, [
            vue.createElementVNode("view", { class: "i" }, [
              vue.createElementVNode("image", {
                src: $data.static_img.nav_3,
                mode: "widthFix"
              }, null, 8, ["src"])
            ]),
            vue.createTextVNode(" 联系TA ")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "user_head_nav" }, [
        vue.createElementVNode("view", { class: "head_nav" }, [
          vue.createElementVNode("view", { class: "li hover" }, [
            vue.createTextVNode("所有("),
            vue.createElementVNode(
              "span",
              null,
              vue.toDisplayString($data.plCount),
              1
              /* TEXT */
            ),
            vue.createTextVNode(")")
          ])
        ]),
        vue.createElementVNode("view", { class: "search_int" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.searchVal = $event),
              placeholder: "请输入关键词"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchVal]
          ]),
          vue.createElementVNode("view", {
            class: "btn",
            onClick: _cache[4] || (_cache[4] = ($event) => $options.sousuo())
          }, [
            vue.createElementVNode("image", {
              src: $data.static_img.search,
              mode: "widthFix"
            }, null, 8, ["src"])
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "user_product_cont" }, [
        vue.createElementVNode("view", { class: "cont" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.product_list, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("navigator", {
                url: "/pages/product/info?zsid=" + _ctx.zsid + "&id=" + item.id,
                class: "list",
                key: index
              }, [
                vue.createElementVNode("view", { class: "tis_cont" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "tle" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "txt" },
                    vue.toDisplayString(item.desc),
                    1
                    /* TEXT */
                  )
                ]),
                item.dianping ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "tips_txt"
                  },
                  vue.toDisplayString(item.dianping),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("view", { class: "bit_dl" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "dt" },
                    "发布于：" + vue.toDisplayString(item.createtime),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "dd" },
                    "￥" + vue.toDisplayString(item.price),
                    1
                    /* TEXT */
                  )
                ]),
                item.is_yanse == 1 ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 1,
                  class: "hot",
                  src: $data.static_img.tip_i_1,
                  mode: "widthFix"
                }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
              ], 8, ["url"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createVNode(_component_uni_load_more, {
          iconType: "auto",
          status: $data.uni_status
        }, null, 8, ["status"])
      ]),
      $data.isShow == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "zym_dc_cont pulic_dc_cont"
      }, [
        vue.createElementVNode("view", { class: "main_cont" }, [
          vue.createElementVNode("view", { class: "shut_btn" }, [
            vue.createElementVNode("image", {
              src: $data.static_img.shut,
              mode: "widthFix",
              onClick: _cache[5] || (_cache[5] = ($event) => $options.show_none())
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "deta_cont" }, [
            vue.createElementVNode("view", { class: "cont" }, [
              vue.createElementVNode("view", { class: "user_tle" }, [
                vue.createElementVNode("view", { class: "ava" }, [
                  vue.createElementVNode("image", {
                    src: $data.zhuanjia.avatar,
                    mode: "widthFix"
                  }, null, 8, ["src"])
                ]),
                vue.createElementVNode(
                  "view",
                  { class: "name" },
                  vue.toDisplayString($data.zhuanjia.username),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "txt" }, "快来关注我吧,我会有很多内容~")
              ]),
              vue.createElementVNode("image", {
                src: $data.static_img.dc_i_1,
                class: "tips_i",
                mode: "widthFix"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "code_box" }, [
                vue.createElementVNode("image", {
                  src: $data.zhuanjia.ewm,
                  mode: "widthFix"
                }, null, 8, ["src"])
              ])
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.isShow == 2 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "gzh_dc_cont pulic_dc_cont"
      }, [
        vue.createElementVNode("view", { class: "main_cont" }, [
          vue.createElementVNode("view", { class: "shut_btn" }, [
            vue.createElementVNode("image", {
              src: $data.static_img.shut,
              mode: "widthFix",
              onClick: _cache[6] || (_cache[6] = ($event) => $options.show_none())
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "deta_cont" }, [
            vue.createElementVNode("view", { class: "cont" }, [
              vue.createElementVNode("view", { class: "code_img" }, [
                vue.createElementVNode("image", {
                  src: $data.zhuanjia.ewm2,
                  mode: "widthFix"
                }, null, 8, ["src"])
              ])
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.isShow == 3 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "lxt_dc_cont pulic_dc_cont"
      }, [
        vue.createElementVNode("view", { class: "main_cont" }, [
          vue.createElementVNode("view", { class: "shut_btn" }, [
            vue.createElementVNode("image", {
              src: $data.static_img.shut,
              mode: "widthFix",
              onClick: _cache[7] || (_cache[7] = ($event) => $options.show_none())
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "deta_cont" }, [
            vue.createElementVNode("view", { class: "cont" }, [
              vue.createElementVNode("view", { class: "code_img" }, [
                vue.createElementVNode("image", {
                  src: $data.zhuanjia.ewm3,
                  mode: "widthFix"
                }, null, 8, ["src"])
              ])
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", {
        class: "jsts_floor",
        onClick: _cache[8] || (_cache[8] = ($event) => $options.is_show(4))
      }, [
        vue.createElementVNode("view", null, [
          vue.createElementVNode("text", null, "接收"),
          vue.createTextVNode(),
          vue.createElementVNode("text", null, "推送")
        ])
      ]),
      $data.isShow == 4 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "lxt_dc_cont pulic_dc_cont"
      }, [
        vue.createElementVNode("view", { class: "main_cont" }, [
          vue.createElementVNode("view", { class: "shut_btn" }, [
            vue.createElementVNode("image", {
              src: $data.static_img.shut,
              mode: "widthFix",
              onClick: _cache[9] || (_cache[9] = ($event) => $options.show_none())
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "deta_cont" }, [
            vue.createElementVNode("view", { class: "cont" }, [
              vue.createElementVNode("view", { class: "code_img" }, [
                vue.createElementVNode("image", {
                  src: $data.ewm,
                  mode: "widthFix"
                }, null, 8, ["src"])
              ])
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("navigator", {
        class: "home_btn",
        "open-type": "switchTab",
        url: "/pages/index/index"
      }, "首页")
    ]);
  }
  const PagesProductLists = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-3c4bd70d"], ["__file", "D:/HbuilderProjects/策略足球/pages/product/lists.vue"]]);
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var weixinJsSdk = { exports: {} };
  !function(e, n) {
    weixinJsSdk.exports = n(e);
  }(typeof window === "object" && window, function(r, e) {
    if (!r) {
      formatAppLog("warn", "at node_modules/weixin-js-sdk/index.js:5", "can't use weixin-js-sdk in server side");
      return;
    }
    var a, c, n, i, t2, o, s, d, l, u, p, f, m, g, h, S, y, I, v, _, w, T;
    if (!r.jWeixin)
      return a = {
        config: "preVerifyJSAPI",
        onMenuShareTimeline: "menu:share:timeline",
        onMenuShareAppMessage: "menu:share:appmessage",
        onMenuShareQQ: "menu:share:qq",
        onMenuShareWeibo: "menu:share:weiboApp",
        onMenuShareQZone: "menu:share:QZone",
        previewImage: "imagePreview",
        getLocation: "geoLocation",
        openProductSpecificView: "openProductViewWithPid",
        addCard: "batchAddCard",
        openCard: "batchViewCard",
        chooseWXPay: "getBrandWCPayRequest",
        openEnterpriseRedPacket: "getRecevieBizHongBaoRequest",
        startSearchBeacons: "startMonitoringBeacons",
        stopSearchBeacons: "stopMonitoringBeacons",
        onSearchBeacons: "onBeaconsInRange",
        consumeAndShareCard: "consumedShareCard",
        openAddress: "editAddress"
      }, c = function() {
        var e2, n2 = {};
        for (e2 in a)
          n2[a[e2]] = e2;
        return n2;
      }(), n = r.document, i = n.title, t2 = navigator.userAgent.toLowerCase(), f = navigator.platform.toLowerCase(), o = !(!f.match("mac") && !f.match("win")), s = -1 != t2.indexOf("wxdebugger"), d = -1 != t2.indexOf("micromessenger"), l = -1 != t2.indexOf("android"), u = -1 != t2.indexOf("iphone") || -1 != t2.indexOf("ipad"), p = (f = t2.match(/micromessenger\/(\d+\.\d+\.\d+)/) || t2.match(/micromessenger\/(\d+\.\d+)/)) ? f[1] : "", m = {
        initStartTime: L(),
        initEndTime: 0,
        preVerifyStartTime: 0,
        preVerifyEndTime: 0
      }, g = {
        version: 1,
        appId: "",
        initTime: 0,
        preVerifyTime: 0,
        networkType: "",
        isPreVerifyOk: 1,
        systemType: u ? 1 : l ? 2 : -1,
        clientVersion: p,
        url: encodeURIComponent(location.href)
      }, h = {}, S = { _completes: [] }, y = { state: 0, data: {} }, O(function() {
        m.initEndTime = L();
      }), I = false, v = [], _ = {
        config: function(e2) {
          C("config", h = e2);
          var o2 = false !== h.check;
          O(function() {
            if (o2)
              k(
                a.config,
                {
                  verifyJsApiList: A(h.jsApiList),
                  verifyOpenTagList: A(h.openTagList)
                },
                (S._complete = function(e4) {
                  m.preVerifyEndTime = L(), y.state = 1, y.data = e4;
                }, S.success = function(e4) {
                  g.isPreVerifyOk = 0;
                }, S.fail = function(e4) {
                  S._fail ? S._fail(e4) : y.state = -1;
                }, (t3 = S._completes).push(function() {
                  B();
                }), S.complete = function(e4) {
                  for (var n3 = 0, i3 = t3.length; n3 < i3; ++n3)
                    t3[n3]();
                  S._completes = [];
                }, S)
              ), m.preVerifyStartTime = L();
            else {
              y.state = 1;
              for (var e3 = S._completes, n2 = 0, i2 = e3.length; n2 < i2; ++n2)
                e3[n2]();
              S._completes = [];
            }
            var t3;
          }), _.invoke || (_.invoke = function(e3, n2, i2) {
            r.WeixinJSBridge && WeixinJSBridge.invoke(e3, P(n2), i2);
          }, _.on = function(e3, n2) {
            r.WeixinJSBridge && WeixinJSBridge.on(e3, n2);
          });
        },
        ready: function(e2) {
          (0 != y.state || (S._completes.push(e2), !d && h.debug)) && e2();
        },
        error: function(e2) {
          p < "6.0.2" || (-1 == y.state ? e2(y.data) : S._fail = e2);
        },
        checkJsApi: function(e2) {
          k(
            "checkJsApi",
            { jsApiList: A(e2.jsApiList) },
            (e2._complete = function(e3) {
              l && (i2 = e3.checkResult) && (e3.checkResult = JSON.parse(i2));
              var n2, i2 = e3, t3 = i2.checkResult;
              for (n2 in t3) {
                var o2 = c[n2];
                o2 && (t3[o2] = t3[n2], delete t3[n2]);
              }
            }, e2)
          );
        },
        onMenuShareTimeline: function(e2) {
          M(
            a.onMenuShareTimeline,
            {
              complete: function() {
                k(
                  "shareTimeline",
                  {
                    title: e2.title || i,
                    desc: e2.title || i,
                    img_url: e2.imgUrl || "",
                    link: e2.link || location.href,
                    type: e2.type || "link",
                    data_url: e2.dataUrl || ""
                  },
                  e2
                );
              }
            },
            e2
          );
        },
        onMenuShareAppMessage: function(n2) {
          M(
            a.onMenuShareAppMessage,
            {
              complete: function(e2) {
                "favorite" === e2.scene ? k("sendAppMessage", {
                  title: n2.title || i,
                  desc: n2.desc || "",
                  link: n2.link || location.href,
                  img_url: n2.imgUrl || "",
                  type: n2.type || "link",
                  data_url: n2.dataUrl || ""
                }) : k(
                  "sendAppMessage",
                  {
                    title: n2.title || i,
                    desc: n2.desc || "",
                    link: n2.link || location.href,
                    img_url: n2.imgUrl || "",
                    type: n2.type || "link",
                    data_url: n2.dataUrl || ""
                  },
                  n2
                );
              }
            },
            n2
          );
        },
        onMenuShareQQ: function(e2) {
          M(
            a.onMenuShareQQ,
            {
              complete: function() {
                k(
                  "shareQQ",
                  {
                    title: e2.title || i,
                    desc: e2.desc || "",
                    img_url: e2.imgUrl || "",
                    link: e2.link || location.href
                  },
                  e2
                );
              }
            },
            e2
          );
        },
        onMenuShareWeibo: function(e2) {
          M(
            a.onMenuShareWeibo,
            {
              complete: function() {
                k(
                  "shareWeiboApp",
                  {
                    title: e2.title || i,
                    desc: e2.desc || "",
                    img_url: e2.imgUrl || "",
                    link: e2.link || location.href
                  },
                  e2
                );
              }
            },
            e2
          );
        },
        onMenuShareQZone: function(e2) {
          M(
            a.onMenuShareQZone,
            {
              complete: function() {
                k(
                  "shareQZone",
                  {
                    title: e2.title || i,
                    desc: e2.desc || "",
                    img_url: e2.imgUrl || "",
                    link: e2.link || location.href
                  },
                  e2
                );
              }
            },
            e2
          );
        },
        updateTimelineShareData: function(e2) {
          k(
            "updateTimelineShareData",
            { title: e2.title, link: e2.link, imgUrl: e2.imgUrl },
            e2
          );
        },
        updateAppMessageShareData: function(e2) {
          k(
            "updateAppMessageShareData",
            { title: e2.title, desc: e2.desc, link: e2.link, imgUrl: e2.imgUrl },
            e2
          );
        },
        startRecord: function(e2) {
          k("startRecord", {}, e2);
        },
        stopRecord: function(e2) {
          k("stopRecord", {}, e2);
        },
        onVoiceRecordEnd: function(e2) {
          M("onVoiceRecordEnd", e2);
        },
        playVoice: function(e2) {
          k("playVoice", { localId: e2.localId }, e2);
        },
        pauseVoice: function(e2) {
          k("pauseVoice", { localId: e2.localId }, e2);
        },
        stopVoice: function(e2) {
          k("stopVoice", { localId: e2.localId }, e2);
        },
        onVoicePlayEnd: function(e2) {
          M("onVoicePlayEnd", e2);
        },
        uploadVoice: function(e2) {
          k(
            "uploadVoice",
            {
              localId: e2.localId,
              isShowProgressTips: 0 == e2.isShowProgressTips ? 0 : 1
            },
            e2
          );
        },
        downloadVoice: function(e2) {
          k(
            "downloadVoice",
            {
              serverId: e2.serverId,
              isShowProgressTips: 0 == e2.isShowProgressTips ? 0 : 1
            },
            e2
          );
        },
        translateVoice: function(e2) {
          k(
            "translateVoice",
            {
              localId: e2.localId,
              isShowProgressTips: 0 == e2.isShowProgressTips ? 0 : 1
            },
            e2
          );
        },
        chooseImage: function(e2) {
          k(
            "chooseImage",
            {
              scene: "1|2",
              count: e2.count || 9,
              sizeType: e2.sizeType || ["original", "compressed"],
              sourceType: e2.sourceType || ["album", "camera"]
            },
            (e2._complete = function(e3) {
              if (l) {
                var n2 = e3.localIds;
                try {
                  n2 && (e3.localIds = JSON.parse(n2));
                } catch (e4) {
                }
              }
            }, e2)
          );
        },
        getLocation: function(e2) {
          e2 = e2 || {}, k(
            a.getLocation,
            { type: e2.type || "wgs84" },
            (e2._complete = function(e3) {
              delete e3.type;
            }, e2)
          );
        },
        previewImage: function(e2) {
          k(a.previewImage, { current: e2.current, urls: e2.urls }, e2);
        },
        uploadImage: function(e2) {
          k(
            "uploadImage",
            {
              localId: e2.localId,
              isShowProgressTips: 0 == e2.isShowProgressTips ? 0 : 1
            },
            e2
          );
        },
        downloadImage: function(e2) {
          k(
            "downloadImage",
            {
              serverId: e2.serverId,
              isShowProgressTips: 0 == e2.isShowProgressTips ? 0 : 1
            },
            e2
          );
        },
        getLocalImgData: function(e2) {
          false === I ? (I = true, k(
            "getLocalImgData",
            { localId: e2.localId },
            (e2._complete = function(e3) {
              var n2;
              I = false, 0 < v.length && (n2 = v.shift(), wx.getLocalImgData(n2));
            }, e2)
          )) : v.push(e2);
        },
        getNetworkType: function(e2) {
          k(
            "getNetworkType",
            {},
            (e2._complete = function(e3) {
              var n2 = e3, e3 = n2.errMsg, i2 = (n2.errMsg = "getNetworkType:ok", n2.subtype);
              if (delete n2.subtype, i2)
                n2.networkType = i2;
              else {
                var i2 = e3.indexOf(":"), t3 = e3.substring(i2 + 1);
                switch (t3) {
                  case "wifi":
                  case "edge":
                  case "wwan":
                    n2.networkType = t3;
                    break;
                  default:
                    n2.errMsg = "getNetworkType:fail";
                }
              }
            }, e2)
          );
        },
        openLocation: function(e2) {
          k(
            "openLocation",
            {
              latitude: e2.latitude,
              longitude: e2.longitude,
              name: e2.name || "",
              address: e2.address || "",
              scale: e2.scale || 28,
              infoUrl: e2.infoUrl || ""
            },
            e2
          );
        },
        hideOptionMenu: function(e2) {
          k("hideOptionMenu", {}, e2);
        },
        showOptionMenu: function(e2) {
          k("showOptionMenu", {}, e2);
        },
        closeWindow: function(e2) {
          k("closeWindow", {}, e2 = e2 || {});
        },
        hideMenuItems: function(e2) {
          k("hideMenuItems", { menuList: e2.menuList }, e2);
        },
        showMenuItems: function(e2) {
          k("showMenuItems", { menuList: e2.menuList }, e2);
        },
        hideAllNonBaseMenuItem: function(e2) {
          k("hideAllNonBaseMenuItem", {}, e2);
        },
        showAllNonBaseMenuItem: function(e2) {
          k("showAllNonBaseMenuItem", {}, e2);
        },
        scanQRCode: function(e2) {
          k(
            "scanQRCode",
            {
              needResult: (e2 = e2 || {}).needResult || 0,
              scanType: e2.scanType || ["qrCode", "barCode"]
            },
            (e2._complete = function(e3) {
              var n2;
              u && (n2 = e3.resultStr) && (n2 = JSON.parse(n2), e3.resultStr = n2 && n2.scan_code && n2.scan_code.scan_result);
            }, e2)
          );
        },
        openAddress: function(e2) {
          k(
            a.openAddress,
            {},
            (e2._complete = function(e3) {
              (e3 = e3).postalCode = e3.addressPostalCode, delete e3.addressPostalCode, e3.provinceName = e3.proviceFirstStageName, delete e3.proviceFirstStageName, e3.cityName = e3.addressCitySecondStageName, delete e3.addressCitySecondStageName, e3.countryName = e3.addressCountiesThirdStageName, delete e3.addressCountiesThirdStageName, e3.detailInfo = e3.addressDetailInfo, delete e3.addressDetailInfo;
            }, e2)
          );
        },
        openProductSpecificView: function(e2) {
          k(
            a.openProductSpecificView,
            {
              pid: e2.productId,
              view_type: e2.viewType || 0,
              ext_info: e2.extInfo
            },
            e2
          );
        },
        addCard: function(e2) {
          for (var n2 = e2.cardList, i2 = [], t3 = 0, o2 = n2.length; t3 < o2; ++t3) {
            var r2 = n2[t3], r2 = { card_id: r2.cardId, card_ext: r2.cardExt };
            i2.push(r2);
          }
          k(
            a.addCard,
            { card_list: i2 },
            (e2._complete = function(e3) {
              if (n3 = e3.card_list) {
                for (var n3, i3 = 0, t4 = (n3 = JSON.parse(n3)).length; i3 < t4; ++i3) {
                  var o3 = n3[i3];
                  o3.cardId = o3.card_id, o3.cardExt = o3.card_ext, o3.isSuccess = !!o3.is_succ, delete o3.card_id, delete o3.card_ext, delete o3.is_succ;
                }
                e3.cardList = n3, delete e3.card_list;
              }
            }, e2)
          );
        },
        chooseCard: function(e2) {
          k(
            "chooseCard",
            {
              app_id: h.appId,
              location_id: e2.shopId || "",
              sign_type: e2.signType || "SHA1",
              card_id: e2.cardId || "",
              card_type: e2.cardType || "",
              card_sign: e2.cardSign,
              time_stamp: e2.timestamp + "",
              nonce_str: e2.nonceStr
            },
            (e2._complete = function(e3) {
              e3.cardList = e3.choose_card_info, delete e3.choose_card_info;
            }, e2)
          );
        },
        openCard: function(e2) {
          for (var n2 = e2.cardList, i2 = [], t3 = 0, o2 = n2.length; t3 < o2; ++t3) {
            var r2 = n2[t3], r2 = { card_id: r2.cardId, code: r2.code };
            i2.push(r2);
          }
          k(a.openCard, { card_list: i2 }, e2);
        },
        consumeAndShareCard: function(e2) {
          k(
            a.consumeAndShareCard,
            { consumedCardId: e2.cardId, consumedCode: e2.code },
            e2
          );
        },
        chooseWXPay: function(e2) {
          k(a.chooseWXPay, x(e2), e2), B({ jsApiName: "chooseWXPay" });
        },
        openEnterpriseRedPacket: function(e2) {
          k(a.openEnterpriseRedPacket, x(e2), e2);
        },
        startSearchBeacons: function(e2) {
          k(a.startSearchBeacons, { ticket: e2.ticket }, e2);
        },
        stopSearchBeacons: function(e2) {
          k(a.stopSearchBeacons, {}, e2);
        },
        onSearchBeacons: function(e2) {
          M(a.onSearchBeacons, e2);
        },
        openEnterpriseChat: function(e2) {
          k(
            "openEnterpriseChat",
            { useridlist: e2.userIds, chatname: e2.groupName },
            e2
          );
        },
        launchMiniProgram: function(e2) {
          k(
            "launchMiniProgram",
            {
              targetAppId: e2.targetAppId,
              path: function(e3) {
                var n2;
                if ("string" == typeof e3 && 0 < e3.length)
                  return n2 = e3.split("?")[0], n2 += ".html", void 0 !== (e3 = e3.split("?")[1]) ? n2 + "?" + e3 : n2;
              }(e2.path),
              envVersion: e2.envVersion
            },
            e2
          );
        },
        openBusinessView: function(e2) {
          k(
            "openBusinessView",
            {
              businessType: e2.businessType,
              queryString: e2.queryString || "",
              envVersion: e2.envVersion
            },
            (e2._complete = function(n2) {
              if (l) {
                var e3 = n2.extraData;
                if (e3)
                  try {
                    n2.extraData = JSON.parse(e3);
                  } catch (e4) {
                    n2.extraData = {};
                  }
              }
            }, e2)
          );
        },
        miniProgram: {
          navigateBack: function(e2) {
            e2 = e2 || {}, O(function() {
              k(
                "invokeMiniProgramAPI",
                { name: "navigateBack", arg: { delta: e2.delta || 1 } },
                e2
              );
            });
          },
          navigateTo: function(e2) {
            O(function() {
              k(
                "invokeMiniProgramAPI",
                { name: "navigateTo", arg: { url: e2.url } },
                e2
              );
            });
          },
          redirectTo: function(e2) {
            O(function() {
              k(
                "invokeMiniProgramAPI",
                { name: "redirectTo", arg: { url: e2.url } },
                e2
              );
            });
          },
          switchTab: function(e2) {
            O(function() {
              k(
                "invokeMiniProgramAPI",
                { name: "switchTab", arg: { url: e2.url } },
                e2
              );
            });
          },
          reLaunch: function(e2) {
            O(function() {
              k(
                "invokeMiniProgramAPI",
                { name: "reLaunch", arg: { url: e2.url } },
                e2
              );
            });
          },
          postMessage: function(e2) {
            O(function() {
              k(
                "invokeMiniProgramAPI",
                { name: "postMessage", arg: e2.data || {} },
                e2
              );
            });
          },
          getEnv: function(e2) {
            O(function() {
              e2({ miniprogram: "miniprogram" === r.__wxjs_environment });
            });
          }
        }
      }, w = 1, T = {}, n.addEventListener(
        "error",
        function(e2) {
          var n2, i2, t3;
          l || (t3 = (n2 = e2.target).tagName, i2 = n2.src, "IMG" != t3 && "VIDEO" != t3 && "AUDIO" != t3 && "SOURCE" != t3) || -1 != i2.indexOf("wxlocalresource://") && (e2.preventDefault(), e2.stopPropagation(), (t3 = n2["wx-id"]) || (t3 = w++, n2["wx-id"] = t3), T[t3] || (T[t3] = true, wx.ready(function() {
            wx.getLocalImgData({
              localId: i2,
              success: function(e3) {
                n2.src = e3.localData;
              }
            });
          })));
        },
        true
      ), n.addEventListener(
        "load",
        function(e2) {
          var n2;
          l || (n2 = (e2 = e2.target).tagName, e2.src, "IMG" != n2 && "VIDEO" != n2 && "AUDIO" != n2 && "SOURCE" != n2) || (n2 = e2["wx-id"]) && (T[n2] = false);
        },
        true
      ), e && (r.wx = r.jWeixin = _), _;
    else
      return r.jWeixin;
    function k(n2, e2, i2) {
      r.WeixinJSBridge ? WeixinJSBridge.invoke(n2, P(e2), function(e3) {
        V(n2, e3, i2);
      }) : C(n2, i2);
    }
    function M(n2, i2, t3) {
      r.WeixinJSBridge ? WeixinJSBridge.on(n2, function(e2) {
        t3 && t3.trigger && t3.trigger(e2), V(n2, e2, i2);
      }) : C(n2, t3 || i2);
    }
    function P(e2) {
      return (e2 = e2 || {}).appId = h.appId, e2.verifyAppId = h.appId, e2.verifySignType = "sha1", e2.verifyTimestamp = h.timestamp + "", e2.verifyNonceStr = h.nonceStr, e2.verifySignature = h.signature, e2;
    }
    function x(e2) {
      return {
        timeStamp: e2.timestamp + "",
        nonceStr: e2.nonceStr,
        package: e2.package,
        paySign: e2.paySign,
        signType: e2.signType || "SHA1"
      };
    }
    function V(e2, n2, i2) {
      "openEnterpriseChat" != e2 && "openBusinessView" !== e2 || (n2.errCode = n2.err_code), delete n2.err_code, delete n2.err_desc, delete n2.err_detail;
      var t3 = n2.errMsg, e2 = (t3 || (t3 = n2.err_msg, delete n2.err_msg, t3 = function(e3, n3) {
        var i3 = c[e3];
        i3 && (e3 = i3);
        i3 = "ok";
        {
          var t4;
          n3 && (t4 = n3.indexOf(":"), "access denied" != (i3 = (i3 = (i3 = -1 != (i3 = -1 != (i3 = "failed" == (i3 = "confirm" == (i3 = n3.substring(t4 + 1)) ? "ok" : i3) ? "fail" : i3).indexOf("failed_") ? i3.substring(7) : i3).indexOf("fail_") ? i3.substring(5) : i3).replace(/_/g, " ")).toLowerCase()) && "no permission to execute" != i3 || (i3 = "permission denied"), "" == (i3 = "config" == e3 && "function not exist" == i3 ? "ok" : i3)) && (i3 = "fail");
        }
        return n3 = e3 + ":" + i3;
      }(e2, t3), n2.errMsg = t3), (i2 = i2 || {})._complete && (i2._complete(n2), delete i2._complete), t3 = n2.errMsg || "", h.debug && !i2.isInnerInvoke && alert(JSON.stringify(n2)), t3.indexOf(":"));
      switch (t3.substring(e2 + 1)) {
        case "ok":
          i2.success && i2.success(n2);
          break;
        case "cancel":
          i2.cancel && i2.cancel(n2);
          break;
        default:
          i2.fail && i2.fail(n2);
      }
      i2.complete && i2.complete(n2);
    }
    function A(e2) {
      if (e2) {
        for (var n2 = 0, i2 = e2.length; n2 < i2; ++n2) {
          var t3 = e2[n2], t3 = a[t3];
          t3 && (e2[n2] = t3);
        }
        return e2;
      }
    }
    function C(e2, n2) {
      var i2;
      !h.debug || n2 && n2.isInnerInvoke || ((i2 = c[e2]) && (e2 = i2), n2 && n2._complete && delete n2._complete, formatAppLog("log", "at node_modules/weixin-js-sdk/index.js:839", '"' + e2 + '",', n2 || ""));
    }
    function B(n2) {
      var i2;
      o || s || h.debug || p < "6.0.2" || g.systemType < 0 || (i2 = new Image(), g.appId = h.appId, g.initTime = m.initEndTime - m.initStartTime, g.preVerifyTime = m.preVerifyEndTime - m.preVerifyStartTime, _.getNetworkType({
        isInnerInvoke: true,
        success: function(e2) {
          g.networkType = e2.networkType;
          e2 = "https://open.weixin.qq.com/sdk/report?v=" + g.version + "&o=" + g.isPreVerifyOk + "&s=" + g.systemType + "&c=" + g.clientVersion + "&a=" + g.appId + "&n=" + g.networkType + "&i=" + g.initTime + "&p=" + g.preVerifyTime + "&u=" + g.url + "&jsapi_name=" + (n2 ? n2.jsApiName : "");
          i2.src = e2;
        }
      }));
    }
    function L() {
      return (/* @__PURE__ */ new Date()).getTime();
    }
    function O(e2) {
      d && (r.WeixinJSBridge ? e2() : n.addEventListener && n.addEventListener("WeixinJSBridgeReady", e2, false));
    }
  });
  var weixinJsSdkExports = weixinJsSdk.exports;
  const jweixin = /* @__PURE__ */ getDefaultExportFromCjs(weixinJsSdkExports);
  const _imports_0 = "/static/h5_img/shut.png";
  getApp();
  const _sfc_main$j = {
    data() {
      return {
        baseUrl: this.$baseURL,
        userInfo: { "openid": "@", "tel": "@" },
        static_img: [],
        zhuanjia: {},
        info: {},
        oInfo: {},
        is_jieshu: 0,
        tzUrl: "",
        is_show: 0,
        fangshi: [
          {
            value: "3",
            name: "支付宝",
            checked: "true"
          },
          {
            value: "2",
            name: "微信"
          }
        ],
        current: 0
      };
    },
    onLoad(option) {
      this.getStaticImg();
      let id = option.id;
      this.id = id;
      let zsid = option.zsid;
      this.zsid = zsid;
      this.getProductInfo(id, zsid);
    },
    computed: {},
    onShow() {
      this.xinxi();
      this.system();
    },
    methods: {
      jump_app() {
        let tzUrl = this.tzUrl;
        open_app.openApp(tzUrl);
      },
      xinxi() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/My/xinxi", param, { custom: { show: false } }).then((res) => {
          if (res.userInfo) {
            that.userInfo = res.userInfo;
          } else {
            that.userInfo = "";
          }
        });
      },
      system() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/index/system", param, { custom: { show: false } }).then((res) => {
          that.tzUrl = res.system.app_url;
        });
      },
      login() {
        uni.navigateTo({
          url: "/pages/user_login/login/login"
        });
      },
      getWeChatCode() {
        let param = {};
        this.$http.post("/api/v1/Weixin/accept", param, { custom: { show: false } }).then((res) => {
          const appid = res.appid;
          const url = "http://zq.dongxisport.net/h5/#/pages/my/index/index";
          const redirect_uri = encodeURIComponent(url);
          const state = res.state;
          const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}&connect_redirect=1#wechat_redirect`;
          window.location.href = authUrl;
        });
      },
      radioChange: function(evt) {
        for (let i = 0; i < this.fangshi.length; i++) {
          if (this.fangshi[i].value === evt.detail.value) {
            this.current = i;
            break;
          }
        }
      },
      dianji(index) {
        this.status = index;
        this.chongzhi_jine[index];
      },
      none_zf() {
        this.is_show = 0;
      },
      show_zf() {
        let userInfo = this.userInfo;
        let info = this.info;
        if (userInfo && Number(userInfo["yue"]) >= Number(info["price"])) {
          this.pay_base(1);
        } else {
          this.is_show = 1;
        }
      },
      getProductInfo(id, zsid) {
        var that = this;
        let param = {
          id,
          zsid
        };
        this.$http.post("/api/v1/product/info", param, { custom: { show: false } }).then((res) => {
          if (res.code == -1) {
            uni.showToast({
              title: res.msg,
              icon: "none",
              success() {
                setTimeout(function() {
                  uni.reLaunch({
                    url: "/pages/index/index"
                  });
                }, 500);
              }
            });
            return;
          }
          that.zhuanjia = res.zhuanjia;
          that.info = res.info;
          that.oInfo = res.oInfo;
          that.is_jieshu = res.is_jieshu;
          if (res.info && res.info.title) {
            uni.setNavigationBarTitle({
              title: res.info.title
            });
          }
        });
      },
      //获取静态图片
      getStaticImg() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/StaticImg/index", param, { custom: { show: false } }).then((res) => {
          that.static_img = res.static_img;
        });
      },
      pay() {
        let fangshi = this.fangshi;
        let current = this.current;
        let type = fangshi[current];
        this.pay_base(type.value);
      },
      pay_base(type = "2") {
        let osName = "APP";
        let id = this.info["id"];
        var that = this;
        let param = { id, type, osName };
        this.$http.post("/api/v1/Orders/addOrders", param, { custom: { show: true } }).then((res) => {
          var ddh = res.ddh;
          var price = res.price;
          if (res.code == 1) {
            if (type == 1) {
              uni.showToast({
                title: res.msg,
                duration: 1e3,
                success() {
                  uni.redirectTo({
                    url: "/pages/my/orders/orders"
                  });
                }
              });
              return;
            } else if (type == 2) {
              that.pay_wx(ddh, price);
            } else if (type == 3) {
              that.pay_zfb(ddh, price);
            }
          } else if (res.code == 0) {
            uni.showToast({
              title: res.msg,
              icon: "none"
            });
            return;
          }
        });
      },
      //支付宝支付
      pay_zfb(ddh, price) {
        var that = this;
        let param = {
          ddh,
          price
        };
        uni.getSystemInfo({
          success: function(res) {
            if (res.osName == "android") {
              that.$http.post("/api/v1/Payzfb/app", param, { custom: { show: true } }).then((res2) => {
                formatAppLog("log", "at pages/product/info.vue:411", res2);
                if (res2.code == 0) {
                  uni.showToast({
                    title: res2.msg,
                    icon: "none"
                  });
                  return;
                }
                uni.requestPayment({
                  provider: "alipay",
                  orderInfo: res2,
                  //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
                  success: function(res1) {
                    uni.showToast({
                      title: "付款成功！",
                      duration: 1e3,
                      success() {
                        uni.redirectTo({
                          url: "/pages/my/orders/orders"
                        });
                      }
                    });
                  },
                  fail: function(err) {
                    uni.showToast({
                      title: "取消支付",
                      icon: "none",
                      duration: 1e3
                    });
                  }
                });
              });
            }
          }
        });
      },
      //微信支付
      pay_wx(ddh, price) {
        var that = this;
        let param = {
          ddh,
          price
        };
        uni.getSystemInfo({
          success: function(res) {
            if (res.osName == "android") {
              that.$http.post("/api/v1/Paywx/app", param, { custom: { show: true } }).then((data) => {
                formatAppLog("log", "at pages/product/info.vue:489", data);
                if (data.code == 0) {
                  uni.showToast({
                    title: data.msg,
                    icon: "none"
                  });
                  return;
                }
                uni.requestPayment({
                  "provider": "wxpay",
                  "orderInfo": {
                    "appid": data.appid,
                    // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
                    "noncestr": data.noncestr,
                    // 随机字符串
                    "package": data.package,
                    // 固定值
                    "partnerid": data.partnerid,
                    // 微信支付商户号
                    "prepayid": data.prepayid,
                    // 统一下单订单号
                    "timestamp": data.timestamp,
                    // 时间戳（单位：秒）
                    "sign": data.sign
                    // 签名，这里用的 MD5/RSA 签名
                  },
                  success: function(res1) {
                    formatAppLog("log", "at pages/product/info.vue:509", "success:" + JSON.stringify(res1));
                    uni.showToast({
                      title: "付款成功！",
                      duration: 1e3,
                      success() {
                        uni.redirectTo({
                          url: "/pages/my/orders/orders"
                        });
                      }
                    });
                  },
                  fail: function(err) {
                    formatAppLog("log", "at pages/product/info.vue:521", "fail:" + JSON.stringify(err));
                    uni.showToast({
                      title: "取消支付",
                      icon: "none",
                      duration: 1e3
                    });
                  }
                });
              });
            }
          }
        });
      },
      wx_jssdk(data, ddh) {
        var that = this;
        jweixin.config({
          debug: false,
          // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId,
          // 必填，公众号的唯一标识
          timestamp: data.timeStamp,
          // 必填，生成签名的时间戳
          nonceStr: data.nonceStr,
          // 必填，生成签名的随机串
          signature: data.paySign,
          // 必填，签名
          jsApiList: ["chooseWXPay"]
        });
        jweixin.chooseWXPay({
          appId: data.appId,
          timestamp: data.timeStamp,
          // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonceStr,
          // 支付签名随机串，不长于 32
          package: data.package,
          // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: data.signType,
          // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySign,
          // 支付签名
          success: function(res) {
            formatAppLog("log", "at pages/product/info.vue:556", "付款成功！", res);
            let param = {
              ddh
            };
            that.$http.post("/api/v1/Orders/isZhifu", param, { custom: { show: false } }).then((res2) => {
              uni.showToast({
                title: "付款成功！",
                duration: 1e3,
                success() {
                  uni.redirectTo({
                    url: "/pages/my/orders/orders"
                  });
                }
              });
            });
          },
          cancel: function(res) {
            uni.showToast({
              title: "付款取消！",
              icon: "none",
              duration: 1e3
            });
          },
          fail: function(res) {
            formatAppLog("log", "at pages/product/info.vue:581", "付款失败！", res);
            let param = {
              ddh
            };
            that.$http.post("/api/v1/Orders/iddel", param, { custom: { show: false } }).then((res2) => {
              uni.showToast({
                title: "付款失败！",
                icon: "error",
                duration: 1e3
              });
            });
          }
        });
      },
      onBridgeReady(data) {
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            // 传入第一步后端接口返回的核心参数
            "appId": data.appId,
            //公众号
            "timeStamp": data.timeStamp,
            //时间戳
            "nonceStr": data.nonceStr,
            //随机串
            "package": data.package,
            //prepay_id
            "signType": data.signType,
            //微信签名方式RSA
            "paySign": data.paySign
            //微信签名
          },
          function(res) {
            formatAppLog("log", "at pages/product/info.vue:608", res);
            if (res.err_msg == "get_brand_wcpay_request:ok")
              ;
            else {
              uni.showToast({
                title: "支付失败",
                icon: "error"
              });
              return;
            }
          }
        );
      },
      // 检测支付环境中的 WeixinJSBridge
      callpay(data) {
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", this.onBridgeReady(data), false);
          } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady(data));
            document.attachEvent("onWeixinJSBridgeReady", this.onBridgeReady(data));
          }
        } else {
          this.onBridgeReady(data);
        }
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", { class: "article_head" }, [
        vue.createElementVNode("view", { class: "l_user" }, [
          vue.createElementVNode("view", { class: "ava" }, [
            vue.createElementVNode("image", {
              src: $data.zhuanjia.avatar,
              mode: "widthFix"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode(
            "view",
            { class: "txt" },
            vue.toDisplayString($data.zhuanjia.username),
            1
            /* TEXT */
          )
        ]),
        vue.createCommentVNode('<view class="btn_dl">\r\n		        <view class="btn btn_1">主页</view>\r\n		        <view class="btn">已关注</view>\r\n		    </view> ')
      ]),
      vue.createElementVNode("view", { class: "article_deta_cont" }, [
        vue.createElementVNode("view", { class: "title_head" }, [
          vue.createElementVNode(
            "view",
            { class: "tle" },
            vue.toDisplayString($data.info.title),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            { class: "txt" },
            vue.toDisplayString($data.info.desc),
            1
            /* TEXT */
          ),
          $data.info.is_yanse == 1 ? (vue.openBlock(), vue.createElementBlock("image", {
            key: 0,
            class: "hot",
            mode: "widthFix",
            src: $data.static_img.tip_i_1
          }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "title_tips" }, [
          vue.createElementVNode("view", { class: "tips" }, "正文内容"),
          vue.createElementVNode(
            "view",
            { class: "plaint" },
            "浏览量：" + vue.toDisplayString($data.info.hits),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "title_time" }, [
          vue.createElementVNode(
            "view",
            { class: "dt" },
            "发布于：" + vue.toDisplayString($data.info.createtime),
            1
            /* TEXT */
          ),
          vue.createCommentVNode('        <view class="dd">18小时前</view>')
        ]),
        vue.createElementVNode("view", { class: "deta_txt" }, [
          vue.createCommentVNode(" 解锁内容"),
          $data.info.price == 0 || $data.is_jieshu == 1 || $data.oInfo != null ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
            vue.createElementVNode("view", {
              class: "text_wrap",
              innerHTML: $data.info.content
            }, null, 8, ["innerHTML"])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "unlock_tips"
          }, [
            vue.createElementVNode("image", {
              mode: "widthFix",
              src: $data.static_img.ico_5
            }, null, 8, ["src"]),
            vue.createTextVNode("支付金额解锁内容 ")
          ]))
        ]),
        $data.info.dianping ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "tips_txt"
          },
          vue.toDisplayString($data.info.dianping),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "bits_txt" }, "免责声明：本文内容仅代表发布者个人观点，平台对内容图片文字的真实性、完整性、及时性不作任何保证，请读者仅作参考。")
      ]),
      $data.info.price != 0 && $data.is_jieshu != 1 && $data.oInfo == null ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "unlock_foot_cont"
      }, [
        vue.createCommentVNode(' <view class="cont">\r\n				<view class="tips">价格<span>{{info.price}}</span>元</view>\r\n\r\n				<view class="deta_cont">\r\n					<view class="btn_dl">\r\n						<view class="btn wx" @click="pay_base(2)">微信支付</view>\r\n						<view class="btn zfb" @click="pay_base(3)">支付宝支付</view>\r\n					</view>\r\n				</view>				\r\n				\r\n			</view> '),
        $data.is_show == 0 && $data.userInfo.tel ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "foot_buy_cont"
        }, [
          vue.createElementVNode("view", { class: "cont" }, [
            vue.createElementVNode(
              "view",
              {
                class: "btn",
                onClick: _cache[0] || (_cache[0] = ($event) => $options.show_zf())
              },
              "立即解锁 ( ￥" + vue.toDisplayString($data.info.price) + " )",
              1
              /* TEXT */
            )
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.is_show == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "buy_sele_dc active"
        }, [
          vue.createElementVNode("view", { class: "cont" }, [
            vue.createElementVNode("view", { class: "shut_btn" }, [
              vue.createElementVNode("image", {
                src: _imports_0,
                mode: "widthFix",
                onClick: _cache[1] || (_cache[1] = ($event) => $options.none_zf())
              })
            ]),
            vue.createElementVNode("view", { class: "title_head" }, "支付选择"),
            vue.createElementVNode(
              "radio-group",
              {
                onChange: _cache[2] || (_cache[2] = (...args) => $options.radioChange && $options.radioChange(...args))
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.fangshi, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("label", {
                      class: "dl_last",
                      key: item.value
                    }, [
                      vue.createElementVNode(
                        "view",
                        null,
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", null, [
                        vue.createElementVNode("radio", {
                          value: item.value,
                          checked: index === $data.current
                        }, null, 8, ["value", "checked"])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              32
              /* NEED_HYDRATION */
            ),
            vue.createElementVNode("view", {
              class: "buy_btn",
              onClick: _cache[3] || (_cache[3] = ($event) => $options.pay())
            }, "确认支付")
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ])) : vue.createCommentVNode("v-if", true),
      !$data.userInfo.openid || !$data.userInfo.tel ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "bottom_resige"
      }, [
        !$data.userInfo.tel ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, "您还未登录，请先登录")) : vue.createCommentVNode("v-if", true),
        !$data.userInfo.tel ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "btn",
          onClick: _cache[4] || (_cache[4] = ($event) => $options.login())
        }, "立即登录")) : vue.createCommentVNode("v-if", true)
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesProductInfo = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-2dfff419"], ["__file", "D:/HbuilderProjects/策略足球/pages/product/info.vue"]]);
  getApp();
  const _sfc_main$i = {
    data() {
      return {
        baseUrl: this.$baseURL,
        userInfo: {},
        static_img: []
      };
    },
    onLoad(option) {
      this.getStaticImg();
      const code = this.getUrlParam("code");
      if (code) {
        this.getOpenidAndUserinfo(code);
      }
    },
    computed: {},
    onShow() {
      if (!uni.getStorageSync("token")) {
        uni.navigateTo({
          url: "/pages/user_login/login/login"
        });
        return false;
      }
      this.getMy();
    },
    methods: {
      getMy() {
        var that = this;
        let param = {
          // rememberMe: true
        };
        this.$http.post("/api/v1/My/xinxi", param, { custom: { show: false } }).then((res) => {
          if (!res.userInfo || !res.userInfo["tel"]) {
            uni.removeStorageSync("token");
            uni.removeStorageSync("refresh_token");
            uni.navigateTo({
              url: "/pages/user_login/login/login"
            });
            return;
          }
          that.userInfo = res.userInfo;
        });
      },
      //获取静态图片
      getStaticImg() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/StaticImg/index", param, { custom: { show: false } }).then((res) => {
          that.static_img = res.static_img;
        });
      },
      getUrlParam(name) {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
        const match = window.location.search.substr(1).match(reg);
        return match ? decodeURIComponent(match[2]) : null;
      },
      //【第1步】请求微信接口，用来获取code
      getWeChatCode() {
        let param = {};
        this.$http.post("/api/v1/Weixin/accept", param, { custom: { show: false } }).then((res) => {
          const appid = res.appid;
          const url = "http://zq.dongxisport.net/h5/#/pages/my/index/index";
          const redirect_uri = encodeURIComponent(url);
          const state = res.state;
          const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}&connect_redirect=1#wechat_redirect`;
          window.location.href = authUrl;
        });
      },
      //把code传递给后台接口，静默登录
      getOpenidAndUserinfo(code) {
        let param = {
          code
        };
        this.$http.post("/api/v1/Weixin/getCode", param, { custom: { show: false } }).then((res) => {
          if (res.code == 1) {
            uni.setStorageSync("openid", res.userInfo["openid"]);
            if (!res.userInfo["tel"]) {
              window.location.href = "http://zq.dongxisport.net/h5/#/pages/user_login/login/login";
              return;
            } else {
              window.location.href = "http://zq.dongxisport.net/h5/#/pages/my/index/index";
              return;
            }
          } else {
            uni.showToast({
              title: res["msg"],
              duration: 3e3,
              icon: "none"
            });
            return;
          }
        });
      },
      loginout() {
        uni.showToast({
          title: "退出成功！",
          icon: "success",
          success() {
            setTimeout(function() {
              uni.removeStorageSync("token");
              uni.removeStorageSync("refresh_token");
              uni.navigateTo({
                url: "/pages/user_login/login/login"
              });
            }, 300);
          }
        });
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "user_center_head" }, [
        vue.createElementVNode("view", { class: "user_inf" }, [
          vue.createElementVNode("view", { class: "ava" }, [
            vue.createElementVNode("image", {
              src: $data.userInfo.avatar ? $data.userInfo.avatar : "/static/h5_img/ava.png",
              mode: "widthFix"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "det_cont" }, [
            vue.createElementVNode(
              "view",
              { class: "name" },
              vue.toDisplayString($data.userInfo.tel ? $data.userInfo.tel : "暂无信息"),
              1
              /* TEXT */
            ),
            $data.userInfo != null ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "exit_btn",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.loginout())
            }, "退出")) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "user_nav_last" }, [
        $data.userInfo.is_status == 2 ? (vue.openBlock(), vue.createElementBlock("navigator", {
          key: 0,
          url: "/pages/my/article/article",
          class: "list"
        }, [
          vue.createElementVNode("view", { class: "tis" }, [
            vue.createElementVNode("image", {
              src: $data.static_img.user_cent_5,
              mode: "widthFix"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "txt" }, "发布文章")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("navigator", {
          url: "/pages/my/orders/orders",
          class: "list"
        }, [
          vue.createElementVNode("view", { class: "tis" }, [
            vue.createElementVNode("image", {
              src: $data.static_img.user_cent_4,
              mode: "widthFix"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "txt" }, "已购文章")
        ]),
        vue.createElementVNode("navigator", {
          url: "/pages/my/xiugai/xiugai",
          class: "list"
        }, [
          vue.createElementVNode("view", { class: "tis" }, [
            vue.createElementVNode("image", {
              src: $data.static_img.user_cent_7,
              mode: "widthFix"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "txt" }, "修改信息")
        ]),
        vue.createElementVNode("navigator", {
          url: "/pages/my/chongzhi/chongzhi",
          class: "list"
        }, [
          vue.createElementVNode("view", { class: "tis" }, [
            vue.createElementVNode("image", {
              src: $data.static_img.user_cent_9,
              mode: "widthFix"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "txt" }, "充值")
        ])
      ]),
      vue.createElementVNode("view", { class: "footer_box" }, [
        vue.createElementVNode("navigator", {
          url: "/pages/xinxi/xieyi?type=2",
          class: "yinsi"
        }, "隐私协议")
      ])
    ]);
  }
  const PagesMyIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-b1dad14e"], ["__file", "D:/HbuilderProjects/策略足球/pages/my/index/index.vue"]]);
  getApp();
  const _sfc_main$h = {
    data() {
      return {
        baseUrl: this.$baseURL,
        userInfo: {},
        page: 1,
        //当前页数
        limit: 10,
        //每页多少条数据，不填默认20条
        maxPage: 1,
        //最大页数（page不能超过的数据，超过 就不能上拉加载了）
        uni_status: "more",
        //more:加载前   loading:加载中  noMore:没有更多数据
        product_list: []
      };
    },
    onLoad() {
      this.getProduct_list();
    },
    onUnload() {
    },
    onShow() {
    },
    methods: {
      getProduct_list() {
        this.uni_status = "loading";
        let dataListALL = this.product_list;
        let page = this.page;
        let limit = this.limit ? this.limit : "";
        var that = this;
        let param = {
          page,
          limit
        };
        this.$http.post("/api/v1/My/article", param, { custom: { show: true } }).then((res) => {
          dataListALL.push(...res.product_list);
          that.product_list = dataListALL;
          that.maxPage = res.maxPage;
          if (that.page == 1 && res.count < 5) {
            that.uni_status = "noMore";
          } else {
            that.uni_status = "more";
          }
        });
      },
      //设置默认值
      moren() {
        this.page = 1;
        this.limit = 10;
        this.dataList = [];
        this.uni_status = "more";
      }
    },
    //监听用户下拉动作，和onLoad等生命周期同级（需要在pages.json中配置）
    onPullDownRefresh() {
      var that = this;
      uni.startPullDownRefresh({
        success() {
          setTimeout(function() {
            that.moren();
            that.product_list = [];
            that.getProduct_list();
            uni.stopPullDownRefresh();
          }, 500);
        },
        fail() {
        }
      });
    },
    onReachBottom() {
      let page = this.page;
      let maxPage = this.maxPage;
      if (page < maxPage) {
        this.page++;
        this.getProduct_list();
      } else {
        this.uni_status = "noMore";
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "user_product_cont" }, [
      vue.createElementVNode("view", { class: "cont" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.product_list, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("navigator", {
              url: "/pages/my/article/add?id=" + item.id,
              class: "list",
              key: index
            }, [
              vue.createElementVNode("view", { class: "tis_cont" }, [
                vue.createElementVNode(
                  "view",
                  { class: "tle" },
                  vue.toDisplayString(item.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "txt" },
                  vue.toDisplayString(item.desc),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "txt" },
                  vue.toDisplayString(item.content),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "bit_dl" }, [
                vue.createElementVNode(
                  "view",
                  { class: "dt" },
                  "结束时间：" + vue.toDisplayString(item.end_time),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "dd" },
                  "￥" + vue.toDisplayString(item.price),
                  1
                  /* TEXT */
                )
              ])
            ], 8, ["url"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createVNode(_component_uni_load_more, {
        iconType: "auto",
        status: $data.uni_status
      }, null, 8, ["status"]),
      vue.createElementVNode("view", { class: "add_wz_box" }, [
        vue.createElementVNode("navigator", {
          url: "/pages/my/article/add",
          class: "add_wz"
        }, "添加文章")
      ])
    ]);
  }
  const PagesMyArticleArticle = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "D:/HbuilderProjects/策略足球/pages/my/article/article.vue"]]);
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$g = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-d31e1c47"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  function obj2strClass(obj) {
    let classess = "";
    for (let key in obj) {
      const val = obj[key];
      if (val) {
        classess += `${key} `;
      }
    }
    return classess;
  }
  function obj2strStyle(obj) {
    let style = "";
    for (let key in obj) {
      const val = obj[key];
      style += `${key}:${val};`;
    }
    return style;
  }
  const _sfc_main$f = {
    name: "uni-easyinput",
    emits: [
      "click",
      "iconClick",
      "update:modelValue",
      "input",
      "focus",
      "blur",
      "confirm",
      "clear",
      "eyes",
      "change",
      "keyboardheightchange"
    ],
    model: {
      prop: "modelValue",
      event: "update:modelValue"
    },
    options: {
      virtualHost: true
    },
    inject: {
      form: {
        from: "uniForm",
        default: null
      },
      formItem: {
        from: "uniFormItem",
        default: null
      }
    },
    props: {
      name: String,
      value: [Number, String],
      modelValue: [Number, String],
      type: {
        type: String,
        default: "text"
      },
      clearable: {
        type: Boolean,
        default: true
      },
      autoHeight: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: " "
      },
      placeholderStyle: String,
      focus: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      maxlength: {
        type: [Number, String],
        default: 140
      },
      confirmType: {
        type: String,
        default: "done"
      },
      clearSize: {
        type: [Number, String],
        default: 24
      },
      inputBorder: {
        type: Boolean,
        default: true
      },
      prefixIcon: {
        type: String,
        default: ""
      },
      suffixIcon: {
        type: String,
        default: ""
      },
      trim: {
        type: [Boolean, String],
        default: false
      },
      cursorSpacing: {
        type: Number,
        default: 0
      },
      passwordIcon: {
        type: Boolean,
        default: true
      },
      adjustPosition: {
        type: Boolean,
        default: true
      },
      primaryColor: {
        type: String,
        default: "#2979ff"
      },
      styles: {
        type: Object,
        default() {
          return {
            color: "#333",
            backgroundColor: "#fff",
            disableColor: "#F7F6F6",
            borderColor: "#e5e5e5"
          };
        }
      },
      errorMessage: {
        type: [String, Boolean],
        default: ""
      }
    },
    data() {
      return {
        focused: false,
        val: "",
        showMsg: "",
        border: false,
        isFirstBorder: false,
        showClearIcon: false,
        showPassword: false,
        focusShow: false,
        localMsg: "",
        isEnter: false
        // 用于判断当前是否是使用回车操作
      };
    },
    computed: {
      // 输入框内是否有值
      isVal() {
        const val = this.val;
        if (val || val === 0) {
          return true;
        }
        return false;
      },
      msg() {
        return this.localMsg || this.errorMessage;
      },
      // 因为uniapp的input组件的maxlength组件必须要数值，这里转为数值，用户可以传入字符串数值
      inputMaxlength() {
        return Number(this.maxlength);
      },
      // 处理外层样式的style
      boxStyle() {
        return `color:${this.inputBorder && this.msg ? "#e43d33" : this.styles.color};`;
      },
      // input 内容的类和样式处理
      inputContentClass() {
        return obj2strClass({
          "is-input-border": this.inputBorder,
          "is-input-error-border": this.inputBorder && this.msg,
          "is-textarea": this.type === "textarea",
          "is-disabled": this.disabled,
          "is-focused": this.focusShow
        });
      },
      inputContentStyle() {
        const focusColor = this.focusShow ? this.primaryColor : this.styles.borderColor;
        const borderColor = this.inputBorder && this.msg ? "#dd524d" : focusColor;
        return obj2strStyle({
          "border-color": borderColor || "#e5e5e5",
          "background-color": this.disabled ? this.styles.disableColor : this.styles.backgroundColor
        });
      },
      // input右侧样式
      inputStyle() {
        const paddingRight = this.type === "password" || this.clearable || this.prefixIcon ? "" : "10px";
        return obj2strStyle({
          "padding-right": paddingRight,
          "padding-left": this.prefixIcon ? "" : "10px"
        });
      }
    },
    watch: {
      value(newVal) {
        this.val = newVal;
      },
      modelValue(newVal) {
        this.val = newVal;
      },
      focus(newVal) {
        this.$nextTick(() => {
          this.focused = this.focus;
          this.focusShow = this.focus;
        });
      }
    },
    created() {
      this.init();
      if (this.form && this.formItem) {
        this.$watch("formItem.errMsg", (newVal) => {
          this.localMsg = newVal;
        });
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.focused = this.focus;
        this.focusShow = this.focus;
      });
    },
    methods: {
      /**
       * 初始化变量值
       */
      init() {
        if (this.value || this.value === 0) {
          this.val = this.value;
        } else if (this.modelValue || this.modelValue === 0 || this.modelValue === "") {
          this.val = this.modelValue;
        } else {
          this.val = null;
        }
      },
      /**
       * 点击图标时触发
       * @param {Object} type
       */
      onClickIcon(type) {
        this.$emit("iconClick", type);
      },
      /**
       * 显示隐藏内容，密码框时生效
       */
      onEyes() {
        this.showPassword = !this.showPassword;
        this.$emit("eyes", this.showPassword);
      },
      /**
       * 输入时触发
       * @param {Object} event
       */
      onInput(event) {
        let value = event.detail.value;
        if (this.trim) {
          if (typeof this.trim === "boolean" && this.trim) {
            value = this.trimStr(value);
          }
          if (typeof this.trim === "string") {
            value = this.trimStr(value, this.trim);
          }
        }
        if (this.errMsg)
          this.errMsg = "";
        this.val = value;
        this.$emit("input", value);
        this.$emit("update:modelValue", value);
      },
      /**
       * 外部调用方法
       * 获取焦点时触发
       * @param {Object} event
       */
      onFocus() {
        this.$nextTick(() => {
          this.focused = true;
        });
        this.$emit("focus", null);
      },
      _Focus(event) {
        this.focusShow = true;
        this.$emit("focus", event);
      },
      /**
       * 外部调用方法
       * 失去焦点时触发
       * @param {Object} event
       */
      onBlur() {
        this.focused = false;
        this.$emit("blur", null);
      },
      _Blur(event) {
        event.detail.value;
        this.focusShow = false;
        this.$emit("blur", event);
        if (this.isEnter === false) {
          this.$emit("change", this.val);
        }
        if (this.form && this.formItem) {
          const { validateTrigger } = this.form;
          if (validateTrigger === "blur") {
            this.formItem.onFieldChange();
          }
        }
      },
      /**
       * 按下键盘的发送键
       * @param {Object} e
       */
      onConfirm(e) {
        this.$emit("confirm", this.val);
        this.isEnter = true;
        this.$emit("change", this.val);
        this.$nextTick(() => {
          this.isEnter = false;
        });
      },
      /**
       * 清理内容
       * @param {Object} event
       */
      onClear(event) {
        this.val = "";
        this.$emit("input", "");
        this.$emit("update:modelValue", "");
        this.$emit("clear");
      },
      /**
       * 键盘高度发生变化的时候触发此事件
       * 兼容性：微信小程序2.7.0+、App 3.1.0+
       * @param {Object} event
       */
      onkeyboardheightchange(event) {
        this.$emit("keyboardheightchange", event);
      },
      /**
       * 去除空格
       */
      trimStr(str, pos = "both") {
        if (pos === "both") {
          return str.trim();
        } else if (pos === "left") {
          return str.trimLeft();
        } else if (pos === "right") {
          return str.trimRight();
        } else if (pos === "start") {
          return str.trimStart();
        } else if (pos === "end") {
          return str.trimEnd();
        } else if (pos === "all") {
          return str.replace(/\s+/g, "");
        } else if (pos === "none") {
          return str;
        }
        return str;
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-easyinput", { "uni-easyinput-error": $options.msg }]),
        style: vue.normalizeStyle($options.boxStyle)
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-easyinput__content", $options.inputContentClass]),
            style: vue.normalizeStyle($options.inputContentStyle)
          },
          [
            $props.prefixIcon ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
              key: 0,
              class: "content-clear-icon",
              type: $props.prefixIcon,
              color: "#c0c4cc",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.onClickIcon("prefix")),
              size: "22"
            }, null, 8, ["type"])) : vue.createCommentVNode("v-if", true),
            vue.renderSlot(_ctx.$slots, "left", {}, void 0, true),
            $props.type === "textarea" ? (vue.openBlock(), vue.createElementBlock("textarea", {
              key: 1,
              class: vue.normalizeClass(["uni-easyinput__content-textarea", { "input-padding": $props.inputBorder }]),
              name: $props.name,
              value: $data.val,
              placeholder: $props.placeholder,
              placeholderStyle: $props.placeholderStyle,
              disabled: $props.disabled,
              "placeholder-class": "uni-easyinput__placeholder-class",
              maxlength: $options.inputMaxlength,
              focus: $data.focused,
              autoHeight: $props.autoHeight,
              "cursor-spacing": $props.cursorSpacing,
              "adjust-position": $props.adjustPosition,
              onInput: _cache[1] || (_cache[1] = (...args) => $options.onInput && $options.onInput(...args)),
              onBlur: _cache[2] || (_cache[2] = (...args) => $options._Blur && $options._Blur(...args)),
              onFocus: _cache[3] || (_cache[3] = (...args) => $options._Focus && $options._Focus(...args)),
              onConfirm: _cache[4] || (_cache[4] = (...args) => $options.onConfirm && $options.onConfirm(...args)),
              onKeyboardheightchange: _cache[5] || (_cache[5] = (...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args))
            }, null, 42, ["name", "value", "placeholder", "placeholderStyle", "disabled", "maxlength", "focus", "autoHeight", "cursor-spacing", "adjust-position"])) : (vue.openBlock(), vue.createElementBlock("input", {
              key: 2,
              type: $props.type === "password" ? "text" : $props.type,
              class: "uni-easyinput__content-input",
              style: vue.normalizeStyle($options.inputStyle),
              name: $props.name,
              value: $data.val,
              password: !$data.showPassword && $props.type === "password",
              placeholder: $props.placeholder,
              placeholderStyle: $props.placeholderStyle,
              "placeholder-class": "uni-easyinput__placeholder-class",
              disabled: $props.disabled,
              maxlength: $options.inputMaxlength,
              focus: $data.focused,
              confirmType: $props.confirmType,
              "cursor-spacing": $props.cursorSpacing,
              "adjust-position": $props.adjustPosition,
              onFocus: _cache[6] || (_cache[6] = (...args) => $options._Focus && $options._Focus(...args)),
              onBlur: _cache[7] || (_cache[7] = (...args) => $options._Blur && $options._Blur(...args)),
              onInput: _cache[8] || (_cache[8] = (...args) => $options.onInput && $options.onInput(...args)),
              onConfirm: _cache[9] || (_cache[9] = (...args) => $options.onConfirm && $options.onConfirm(...args)),
              onKeyboardheightchange: _cache[10] || (_cache[10] = (...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args))
            }, null, 44, ["type", "name", "value", "password", "placeholder", "placeholderStyle", "disabled", "maxlength", "focus", "confirmType", "cursor-spacing", "adjust-position"])),
            $props.type === "password" && $props.passwordIcon ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 3 },
              [
                vue.createCommentVNode(" 开启密码时显示小眼睛 "),
                $options.isVal ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: vue.normalizeClass(["content-clear-icon", { "is-textarea-icon": $props.type === "textarea" }]),
                  type: $data.showPassword ? "eye-slash-filled" : "eye-filled",
                  size: 22,
                  color: $data.focusShow ? $props.primaryColor : "#c0c4cc",
                  onClick: $options.onEyes
                }, null, 8, ["class", "type", "color", "onClick"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true),
            $props.suffixIcon ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 4 },
              [
                $props.suffixIcon ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: "content-clear-icon",
                  type: $props.suffixIcon,
                  color: "#c0c4cc",
                  onClick: _cache[11] || (_cache[11] = ($event) => $options.onClickIcon("suffix")),
                  size: "22"
                }, null, 8, ["type"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 5 },
              [
                $props.clearable && $options.isVal && !$props.disabled && $props.type !== "textarea" ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: vue.normalizeClass(["content-clear-icon", { "is-textarea-icon": $props.type === "textarea" }]),
                  type: "clear",
                  size: $props.clearSize,
                  color: $options.msg ? "#dd524d" : $data.focusShow ? $props.primaryColor : "#c0c4cc",
                  onClick: $options.onClear
                }, null, 8, ["class", "size", "color", "onClick"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )),
            vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-09fd5285"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue"]]);
  const _sfc_main$e = {
    name: "uniFormsItem",
    options: {
      virtualHost: true
    },
    provide() {
      return {
        uniFormItem: this
      };
    },
    inject: {
      form: {
        from: "uniForm",
        default: null
      }
    },
    props: {
      // 表单校验规则
      rules: {
        type: Array,
        default() {
          return null;
        }
      },
      // 表单域的属性名，在使用校验规则时必填
      name: {
        type: [String, Array],
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ""
      },
      // label的宽度
      labelWidth: {
        type: [String, Number],
        default: ""
      },
      // label 居中方式，默认 left 取值 left/center/right
      labelAlign: {
        type: String,
        default: ""
      },
      // 强制显示错误信息
      errorMessage: {
        type: [String, Boolean],
        default: ""
      },
      // 1.4.0 弃用，统一使用 form 的校验时机
      // validateTrigger: {
      // 	type: String,
      // 	default: ''
      // },
      // 1.4.0 弃用，统一使用 form 的label 位置
      // labelPosition: {
      // 	type: String,
      // 	default: ''
      // },
      // 1.4.0 以下属性已经废弃，请使用  #label 插槽代替
      leftIcon: String,
      iconColor: {
        type: String,
        default: "#606266"
      }
    },
    data() {
      return {
        errMsg: "",
        userRules: null,
        localLabelAlign: "left",
        localLabelWidth: "70px",
        localLabelPos: "left",
        border: false,
        isFirstBorder: false
      };
    },
    computed: {
      // 处理错误信息
      msg() {
        return this.errorMessage || this.errMsg;
      }
    },
    watch: {
      // 规则发生变化通知子组件更新
      "form.formRules"(val) {
        this.init();
      },
      "form.labelWidth"(val) {
        this.localLabelWidth = this._labelWidthUnit(val);
      },
      "form.labelPosition"(val) {
        this.localLabelPos = this._labelPosition();
      },
      "form.labelAlign"(val) {
      }
    },
    created() {
      this.init(true);
      if (this.name && this.form) {
        this.$watch(
          () => {
            const val = this.form._getDataValue(this.name, this.form.localData);
            return val;
          },
          (value, oldVal) => {
            const isEqual2 = this.form._isEqual(value, oldVal);
            if (!isEqual2) {
              const val = this.itemSetValue(value);
              this.onFieldChange(val, false);
            }
          },
          {
            immediate: false
          }
        );
      }
    },
    unmounted() {
      this.__isUnmounted = true;
      this.unInit();
    },
    methods: {
      /**
       * 外部调用方法
       * 设置规则 ，主要用于小程序自定义检验规则
       * @param {Array} rules 规则源数据
       */
      setRules(rules = null) {
        this.userRules = rules;
        this.init(false);
      },
      // 兼容老版本表单组件
      setValue() {
      },
      /**
       * 外部调用方法
       * 校验数据
       * @param {any} value 需要校验的数据
       * @param {boolean} 是否立即校验
       * @return {Array|null} 校验内容
       */
      async onFieldChange(value, formtrigger = true) {
        const {
          formData,
          localData,
          errShowType,
          validateCheck,
          validateTrigger,
          _isRequiredField,
          _realName
        } = this.form;
        const name = _realName(this.name);
        if (!value) {
          value = this.form.formData[name];
        }
        const ruleLen = this.itemRules.rules && this.itemRules.rules.length;
        if (!this.validator || !ruleLen || ruleLen === 0)
          return;
        const isRequiredField2 = _isRequiredField(this.itemRules.rules || []);
        let result = null;
        if (validateTrigger === "bind" || formtrigger) {
          result = await this.validator.validateUpdate(
            {
              [name]: value
            },
            formData
          );
          if (!isRequiredField2 && (value === void 0 || value === "")) {
            result = null;
          }
          if (result && result.errorMessage) {
            if (errShowType === "undertext") {
              this.errMsg = !result ? "" : result.errorMessage;
            }
            if (errShowType === "toast") {
              uni.showToast({
                title: result.errorMessage || "校验错误",
                icon: "none"
              });
            }
            if (errShowType === "modal") {
              uni.showModal({
                title: "提示",
                content: result.errorMessage || "校验错误"
              });
            }
          } else {
            this.errMsg = "";
          }
          validateCheck(result ? result : null);
        } else {
          this.errMsg = "";
        }
        return result ? result : null;
      },
      /**
       * 初始组件数据
       */
      init(type = false) {
        const {
          validator,
          formRules,
          childrens,
          formData,
          localData,
          _realName,
          labelWidth,
          _getDataValue,
          _setDataValue
        } = this.form || {};
        this.localLabelAlign = this._justifyContent();
        this.localLabelWidth = this._labelWidthUnit(labelWidth);
        this.localLabelPos = this._labelPosition();
        this.form && type && childrens.push(this);
        if (!validator || !formRules)
          return;
        if (!this.form.isFirstBorder) {
          this.form.isFirstBorder = true;
          this.isFirstBorder = true;
        }
        if (this.group) {
          if (!this.group.isFirstBorder) {
            this.group.isFirstBorder = true;
            this.isFirstBorder = true;
          }
        }
        this.border = this.form.border;
        const name = _realName(this.name);
        const itemRule = this.userRules || this.rules;
        if (typeof formRules === "object" && itemRule) {
          formRules[name] = {
            rules: itemRule
          };
          validator.updateSchema(formRules);
        }
        const itemRules = formRules[name] || {};
        this.itemRules = itemRules;
        this.validator = validator;
        this.itemSetValue(_getDataValue(this.name, localData));
      },
      unInit() {
        if (this.form) {
          const {
            childrens,
            formData,
            _realName
          } = this.form;
          childrens.forEach((item, index) => {
            if (item === this) {
              this.form.childrens.splice(index, 1);
              delete formData[_realName(item.name)];
            }
          });
        }
      },
      // 设置item 的值
      itemSetValue(value) {
        const name = this.form._realName(this.name);
        const rules = this.itemRules.rules || [];
        const val = this.form._getValue(name, value, rules);
        this.form._setDataValue(name, this.form.formData, val);
        return val;
      },
      /**
       * 移除该表单项的校验结果
       */
      clearValidate() {
        this.errMsg = "";
      },
      // 是否显示星号
      _isRequired() {
        return this.required;
      },
      // 处理对齐方式
      _justifyContent() {
        if (this.form) {
          const {
            labelAlign
          } = this.form;
          let labelAli = this.labelAlign ? this.labelAlign : labelAlign;
          if (labelAli === "left")
            return "flex-start";
          if (labelAli === "center")
            return "center";
          if (labelAli === "right")
            return "flex-end";
        }
        return "flex-start";
      },
      // 处理 label宽度单位 ,继承父元素的值
      _labelWidthUnit(labelWidth) {
        return this.num2px(this.labelWidth ? this.labelWidth : labelWidth || (this.label ? 70 : "auto"));
      },
      // 处理 label 位置
      _labelPosition() {
        if (this.form)
          return this.form.labelPosition || "left";
        return "left";
      },
      /**
       * 触发时机
       * @param {Object} rule 当前规则内时机
       * @param {Object} itemRlue 当前组件时机
       * @param {Object} parentRule 父组件时机
       */
      isTrigger(rule, itemRlue, parentRule) {
        if (rule === "submit" || !rule) {
          if (rule === void 0) {
            if (itemRlue !== "bind") {
              if (!itemRlue) {
                return parentRule === "" ? "bind" : "submit";
              }
              return "submit";
            }
            return "bind";
          }
          return "submit";
        }
        return "bind";
      },
      num2px(num) {
        if (typeof num === "number") {
          return `${num}px`;
        }
        return num;
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-forms-item", ["is-direction-" + $data.localLabelPos, $data.border ? "uni-forms-item--border" : "", $data.border && $data.isFirstBorder ? "is-first-border" : ""]])
      },
      [
        vue.renderSlot(_ctx.$slots, "label", {}, () => [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["uni-forms-item__label", { "no-label": !$props.label && !$props.required }]),
              style: vue.normalizeStyle({ width: $data.localLabelWidth, justifyContent: $data.localLabelAlign })
            },
            [
              $props.required ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "is-required"
              }, "*")) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($props.label),
                1
                /* TEXT */
              )
            ],
            6
            /* CLASS, STYLE */
          )
        ], true),
        vue.createElementVNode("view", { class: "uni-forms-item__content" }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["uni-forms-item__error", { "msg--active": $options.msg }])
            },
            [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($options.msg),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          )
        ])
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-462874dd"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.vue"]]);
  let Calendar$1 = class Calendar {
    constructor({
      selected,
      startDate,
      endDate,
      range
    } = {}) {
      this.date = this.getDateObj(/* @__PURE__ */ new Date());
      this.selected = selected || [];
      this.startDate = startDate;
      this.endDate = endDate;
      this.range = range;
      this.cleanMultipleStatus();
      this.weeks = {};
      this.lastHover = false;
    }
    /**
     * 设置日期
     * @param {Object} date
     */
    setDate(date) {
      const selectDate = this.getDateObj(date);
      this.getWeeks(selectDate.fullDate);
    }
    /**
     * 清理多选状态
     */
    cleanMultipleStatus() {
      this.multipleStatus = {
        before: "",
        after: "",
        data: []
      };
    }
    setStartDate(startDate) {
      this.startDate = startDate;
    }
    setEndDate(endDate) {
      this.endDate = endDate;
    }
    getPreMonthObj(date) {
      date = fixIosDateFormat(date);
      date = new Date(date);
      const oldMonth = date.getMonth();
      date.setMonth(oldMonth - 1);
      const newMonth = date.getMonth();
      if (oldMonth !== 0 && newMonth - oldMonth === 0) {
        date.setMonth(newMonth - 1);
      }
      return this.getDateObj(date);
    }
    getNextMonthObj(date) {
      date = fixIosDateFormat(date);
      date = new Date(date);
      const oldMonth = date.getMonth();
      date.setMonth(oldMonth + 1);
      const newMonth = date.getMonth();
      if (newMonth - oldMonth > 1) {
        date.setMonth(newMonth - 1);
      }
      return this.getDateObj(date);
    }
    /**
     * 获取指定格式Date对象
     */
    getDateObj(date) {
      date = fixIosDateFormat(date);
      date = new Date(date);
      return {
        fullDate: getDate(date),
        year: date.getFullYear(),
        month: addZero(date.getMonth() + 1),
        date: addZero(date.getDate()),
        day: date.getDay()
      };
    }
    /**
     * 获取上一个月日期集合
     */
    getPreMonthDays(amount, dateObj) {
      const result = [];
      for (let i = amount - 1; i >= 0; i--) {
        const month = dateObj.month - 1;
        result.push({
          date: new Date(dateObj.year, month, -i).getDate(),
          month,
          disable: true
        });
      }
      return result;
    }
    /**
     * 获取本月日期集合
     */
    getCurrentMonthDays(amount, dateObj) {
      const result = [];
      const fullDate = this.date.fullDate;
      for (let i = 1; i <= amount; i++) {
        const currentDate = `${dateObj.year}-${dateObj.month}-${addZero(i)}`;
        const isToday = fullDate === currentDate;
        const info = this.selected && this.selected.find((item) => {
          if (this.dateEqual(currentDate, item.date)) {
            return item;
          }
        });
        if (this.startDate) {
          dateCompare(this.startDate, currentDate);
        }
        if (this.endDate) {
          dateCompare(currentDate, this.endDate);
        }
        let multiples = this.multipleStatus.data;
        let multiplesStatus = -1;
        if (this.range && multiples) {
          multiplesStatus = multiples.findIndex((item) => {
            return this.dateEqual(item, currentDate);
          });
        }
        const checked = multiplesStatus !== -1;
        result.push({
          fullDate: currentDate,
          year: dateObj.year,
          date: i,
          multiple: this.range ? checked : false,
          beforeMultiple: this.isLogicBefore(currentDate, this.multipleStatus.before, this.multipleStatus.after),
          afterMultiple: this.isLogicAfter(currentDate, this.multipleStatus.before, this.multipleStatus.after),
          month: dateObj.month,
          disable: this.startDate && !dateCompare(this.startDate, currentDate) || this.endDate && !dateCompare(
            currentDate,
            this.endDate
          ),
          isToday,
          userChecked: false,
          extraInfo: info
        });
      }
      return result;
    }
    /**
     * 获取下一个月日期集合
     */
    _getNextMonthDays(amount, dateObj) {
      const result = [];
      const month = dateObj.month + 1;
      for (let i = 1; i <= amount; i++) {
        result.push({
          date: i,
          month,
          disable: true
        });
      }
      return result;
    }
    /**
     * 获取当前日期详情
     * @param {Object} date
     */
    getInfo(date) {
      if (!date) {
        date = /* @__PURE__ */ new Date();
      }
      return this.calendar.find((item) => item.fullDate === this.getDateObj(date).fullDate);
    }
    /**
     * 比较时间是否相等
     */
    dateEqual(before, after) {
      before = new Date(fixIosDateFormat(before));
      after = new Date(fixIosDateFormat(after));
      return before.valueOf() === after.valueOf();
    }
    /**
     *  比较真实起始日期
     */
    isLogicBefore(currentDate, before, after) {
      let logicBefore = before;
      if (before && after) {
        logicBefore = dateCompare(before, after) ? before : after;
      }
      return this.dateEqual(logicBefore, currentDate);
    }
    isLogicAfter(currentDate, before, after) {
      let logicAfter = after;
      if (before && after) {
        logicAfter = dateCompare(before, after) ? after : before;
      }
      return this.dateEqual(logicAfter, currentDate);
    }
    /**
     * 获取日期范围内所有日期
     * @param {Object} begin
     * @param {Object} end
     */
    geDateAll(begin, end) {
      var arr = [];
      var ab = begin.split("-");
      var ae = end.split("-");
      var db = /* @__PURE__ */ new Date();
      db.setFullYear(ab[0], ab[1] - 1, ab[2]);
      var de = /* @__PURE__ */ new Date();
      de.setFullYear(ae[0], ae[1] - 1, ae[2]);
      var unixDb = db.getTime() - 24 * 60 * 60 * 1e3;
      var unixDe = de.getTime() - 24 * 60 * 60 * 1e3;
      for (var k = unixDb; k <= unixDe; ) {
        k = k + 24 * 60 * 60 * 1e3;
        arr.push(this.getDateObj(new Date(parseInt(k))).fullDate);
      }
      return arr;
    }
    /**
     *  获取多选状态
     */
    setMultiple(fullDate) {
      if (!this.range)
        return;
      let {
        before,
        after
      } = this.multipleStatus;
      if (before && after) {
        if (!this.lastHover) {
          this.lastHover = true;
          return;
        }
        this.multipleStatus.before = fullDate;
        this.multipleStatus.after = "";
        this.multipleStatus.data = [];
        this.multipleStatus.fulldate = "";
        this.lastHover = false;
      } else {
        if (!before) {
          this.multipleStatus.before = fullDate;
          this.multipleStatus.after = void 0;
          this.lastHover = false;
        } else {
          this.multipleStatus.after = fullDate;
          if (dateCompare(this.multipleStatus.before, this.multipleStatus.after)) {
            this.multipleStatus.data = this.geDateAll(this.multipleStatus.before, this.multipleStatus.after);
          } else {
            this.multipleStatus.data = this.geDateAll(this.multipleStatus.after, this.multipleStatus.before);
          }
          this.lastHover = true;
        }
      }
      this.getWeeks(fullDate);
    }
    /**
     *  鼠标 hover 更新多选状态
     */
    setHoverMultiple(fullDate) {
      if (!this.range || this.lastHover)
        return;
      const {
        before
      } = this.multipleStatus;
      if (!before) {
        this.multipleStatus.before = fullDate;
      } else {
        this.multipleStatus.after = fullDate;
        if (dateCompare(this.multipleStatus.before, this.multipleStatus.after)) {
          this.multipleStatus.data = this.geDateAll(this.multipleStatus.before, this.multipleStatus.after);
        } else {
          this.multipleStatus.data = this.geDateAll(this.multipleStatus.after, this.multipleStatus.before);
        }
      }
      this.getWeeks(fullDate);
    }
    /**
     * 更新默认值多选状态
     */
    setDefaultMultiple(before, after) {
      this.multipleStatus.before = before;
      this.multipleStatus.after = after;
      if (before && after) {
        if (dateCompare(before, after)) {
          this.multipleStatus.data = this.geDateAll(before, after);
          this.getWeeks(after);
        } else {
          this.multipleStatus.data = this.geDateAll(after, before);
          this.getWeeks(before);
        }
      }
    }
    /**
     * 获取每周数据
     * @param {Object} dateData
     */
    getWeeks(dateData) {
      const {
        year,
        month
      } = this.getDateObj(dateData);
      const preMonthDayAmount = new Date(year, month - 1, 1).getDay();
      const preMonthDays = this.getPreMonthDays(preMonthDayAmount, this.getDateObj(dateData));
      const currentMonthDayAmount = new Date(year, month, 0).getDate();
      const currentMonthDays = this.getCurrentMonthDays(currentMonthDayAmount, this.getDateObj(dateData));
      const nextMonthDayAmount = 42 - preMonthDayAmount - currentMonthDayAmount;
      const nextMonthDays = this._getNextMonthDays(nextMonthDayAmount, this.getDateObj(dateData));
      const calendarDays = [...preMonthDays, ...currentMonthDays, ...nextMonthDays];
      const weeks = new Array(6);
      for (let i = 0; i < calendarDays.length; i++) {
        const index = Math.floor(i / 7);
        if (!weeks[index]) {
          weeks[index] = new Array(7);
        }
        weeks[index][i % 7] = calendarDays[i];
      }
      this.calendar = calendarDays;
      this.weeks = weeks;
    }
  };
  function getDateTime(date, hideSecond) {
    return `${getDate(date)} ${getTime(date, hideSecond)}`;
  }
  function getDate(date) {
    date = fixIosDateFormat(date);
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${addZero(month)}-${addZero(day)}`;
  }
  function getTime(date, hideSecond) {
    date = fixIosDateFormat(date);
    date = new Date(date);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return hideSecond ? `${addZero(hour)}:${addZero(minute)}` : `${addZero(hour)}:${addZero(minute)}:${addZero(second)}`;
  }
  function addZero(num) {
    if (num < 10) {
      num = `0${num}`;
    }
    return num;
  }
  function getDefaultSecond(hideSecond) {
    return hideSecond ? "00:00" : "00:00:00";
  }
  function dateCompare(startDate, endDate) {
    startDate = new Date(fixIosDateFormat(startDate));
    endDate = new Date(fixIosDateFormat(endDate));
    return startDate <= endDate;
  }
  function checkDate(date) {
    const dateReg = /((19|20)\d{2})(-|\/)\d{1,2}(-|\/)\d{1,2}/g;
    return date.match(dateReg);
  }
  const dateTimeReg = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])( [0-5]?[0-9]:[0-5]?[0-9](:[0-5]?[0-9])?)?$/;
  function fixIosDateFormat(value) {
    if (typeof value === "string" && dateTimeReg.test(value)) {
      value = value.replace(/-/g, "/");
    }
    return value;
  }
  const _sfc_main$d = {
    props: {
      weeks: {
        type: Object,
        default() {
          return {};
        }
      },
      calendar: {
        type: Object,
        default: () => {
          return {};
        }
      },
      selected: {
        type: Array,
        default: () => {
          return [];
        }
      },
      checkHover: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      choiceDate(weeks) {
        this.$emit("change", weeks);
      },
      handleMousemove(weeks) {
        this.$emit("handleMouse", weeks);
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-calendar-item__weeks-box", {
          "uni-calendar-item--disable": $props.weeks.disable,
          "uni-calendar-item--before-checked-x": $props.weeks.beforeMultiple,
          "uni-calendar-item--multiple": $props.weeks.multiple,
          "uni-calendar-item--after-checked-x": $props.weeks.afterMultiple
        }]),
        onClick: _cache[0] || (_cache[0] = ($event) => $options.choiceDate($props.weeks)),
        onMouseenter: _cache[1] || (_cache[1] = ($event) => $options.handleMousemove($props.weeks))
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-calendar-item__weeks-box-item", {
              "uni-calendar-item--checked": $props.calendar.fullDate === $props.weeks.fullDate && ($props.calendar.userChecked || !$props.checkHover),
              "uni-calendar-item--checked-range-text": $props.checkHover,
              "uni-calendar-item--before-checked": $props.weeks.beforeMultiple,
              "uni-calendar-item--multiple": $props.weeks.multiple,
              "uni-calendar-item--after-checked": $props.weeks.afterMultiple,
              "uni-calendar-item--disable": $props.weeks.disable
            }])
          },
          [
            $props.selected && $props.weeks.extraInfo ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 0,
              class: "uni-calendar-item__weeks-box-circle"
            })) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "text",
              { class: "uni-calendar-item__weeks-box-text uni-calendar-item__weeks-box-text-disable uni-calendar-item--checked-text" },
              vue.toDisplayString($props.weeks.date),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass({ "uni-calendar-item--today": $props.weeks.isToday })
          },
          null,
          2
          /* CLASS */
        )
      ],
      34
      /* CLASS, NEED_HYDRATION */
    );
  }
  const calendarItem = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-3c762a01"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-datetime-picker/components/uni-datetime-picker/calendar-item.vue"]]);
  const en = {
    "uni-datetime-picker.selectDate": "select date",
    "uni-datetime-picker.selectTime": "select time",
    "uni-datetime-picker.selectDateTime": "select date and time",
    "uni-datetime-picker.startDate": "start date",
    "uni-datetime-picker.endDate": "end date",
    "uni-datetime-picker.startTime": "start time",
    "uni-datetime-picker.endTime": "end time",
    "uni-datetime-picker.ok": "ok",
    "uni-datetime-picker.clear": "clear",
    "uni-datetime-picker.cancel": "cancel",
    "uni-datetime-picker.year": "-",
    "uni-datetime-picker.month": "",
    "uni-calender.MON": "MON",
    "uni-calender.TUE": "TUE",
    "uni-calender.WED": "WED",
    "uni-calender.THU": "THU",
    "uni-calender.FRI": "FRI",
    "uni-calender.SAT": "SAT",
    "uni-calender.SUN": "SUN",
    "uni-calender.confirm": "confirm"
  };
  const zhHans = {
    "uni-datetime-picker.selectDate": "选择日期",
    "uni-datetime-picker.selectTime": "选择时间",
    "uni-datetime-picker.selectDateTime": "选择日期时间",
    "uni-datetime-picker.startDate": "开始日期",
    "uni-datetime-picker.endDate": "结束日期",
    "uni-datetime-picker.startTime": "开始时间",
    "uni-datetime-picker.endTime": "结束时间",
    "uni-datetime-picker.ok": "确定",
    "uni-datetime-picker.clear": "清除",
    "uni-datetime-picker.cancel": "取消",
    "uni-datetime-picker.year": "年",
    "uni-datetime-picker.month": "月",
    "uni-calender.SUN": "日",
    "uni-calender.MON": "一",
    "uni-calender.TUE": "二",
    "uni-calender.WED": "三",
    "uni-calender.THU": "四",
    "uni-calender.FRI": "五",
    "uni-calender.SAT": "六",
    "uni-calender.confirm": "确认"
  };
  const zhHant = {
    "uni-datetime-picker.selectDate": "選擇日期",
    "uni-datetime-picker.selectTime": "選擇時間",
    "uni-datetime-picker.selectDateTime": "選擇日期時間",
    "uni-datetime-picker.startDate": "開始日期",
    "uni-datetime-picker.endDate": "結束日期",
    "uni-datetime-picker.startTime": "開始时间",
    "uni-datetime-picker.endTime": "結束时间",
    "uni-datetime-picker.ok": "確定",
    "uni-datetime-picker.clear": "清除",
    "uni-datetime-picker.cancel": "取消",
    "uni-datetime-picker.year": "年",
    "uni-datetime-picker.month": "月",
    "uni-calender.SUN": "日",
    "uni-calender.MON": "一",
    "uni-calender.TUE": "二",
    "uni-calender.WED": "三",
    "uni-calender.THU": "四",
    "uni-calender.FRI": "五",
    "uni-calender.SAT": "六",
    "uni-calender.confirm": "確認"
  };
  const i18nMessages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  const {
    t: t$1
  } = initVueI18n(i18nMessages);
  const _sfc_main$c = {
    name: "UniDatetimePicker",
    data() {
      return {
        indicatorStyle: `height: 50px;`,
        visible: false,
        fixNvueBug: {},
        dateShow: true,
        timeShow: true,
        title: "日期和时间",
        // 输入框当前时间
        time: "",
        // 当前的年月日时分秒
        year: 1920,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        // 起始时间
        startYear: 1920,
        startMonth: 1,
        startDay: 1,
        startHour: 0,
        startMinute: 0,
        startSecond: 0,
        // 结束时间
        endYear: 2120,
        endMonth: 12,
        endDay: 31,
        endHour: 23,
        endMinute: 59,
        endSecond: 59
      };
    },
    options: {
      virtualHost: true
    },
    props: {
      type: {
        type: String,
        default: "datetime"
      },
      value: {
        type: [String, Number],
        default: ""
      },
      modelValue: {
        type: [String, Number],
        default: ""
      },
      start: {
        type: [Number, String],
        default: ""
      },
      end: {
        type: [Number, String],
        default: ""
      },
      returnType: {
        type: String,
        default: "string"
      },
      disabled: {
        type: [Boolean, String],
        default: false
      },
      border: {
        type: [Boolean, String],
        default: true
      },
      hideSecond: {
        type: [Boolean, String],
        default: false
      }
    },
    watch: {
      modelValue: {
        handler(newVal) {
          if (newVal) {
            this.parseValue(fixIosDateFormat(newVal));
            this.initTime(false);
          } else {
            this.time = "";
            this.parseValue(Date.now());
          }
        },
        immediate: true
      },
      type: {
        handler(newValue) {
          if (newValue === "date") {
            this.dateShow = true;
            this.timeShow = false;
            this.title = "日期";
          } else if (newValue === "time") {
            this.dateShow = false;
            this.timeShow = true;
            this.title = "时间";
          } else {
            this.dateShow = true;
            this.timeShow = true;
            this.title = "日期和时间";
          }
        },
        immediate: true
      },
      start: {
        handler(newVal) {
          this.parseDatetimeRange(fixIosDateFormat(newVal), "start");
        },
        immediate: true
      },
      end: {
        handler(newVal) {
          this.parseDatetimeRange(fixIosDateFormat(newVal), "end");
        },
        immediate: true
      },
      // 月、日、时、分、秒可选范围变化后，检查当前值是否在范围内，不在则当前值重置为可选范围第一项
      months(newVal) {
        this.checkValue("month", this.month, newVal);
      },
      days(newVal) {
        this.checkValue("day", this.day, newVal);
      },
      hours(newVal) {
        this.checkValue("hour", this.hour, newVal);
      },
      minutes(newVal) {
        this.checkValue("minute", this.minute, newVal);
      },
      seconds(newVal) {
        this.checkValue("second", this.second, newVal);
      }
    },
    computed: {
      // 当前年、月、日、时、分、秒选择范围
      years() {
        return this.getCurrentRange("year");
      },
      months() {
        return this.getCurrentRange("month");
      },
      days() {
        return this.getCurrentRange("day");
      },
      hours() {
        return this.getCurrentRange("hour");
      },
      minutes() {
        return this.getCurrentRange("minute");
      },
      seconds() {
        return this.getCurrentRange("second");
      },
      // picker 当前值数组
      ymd() {
        return [this.year - this.minYear, this.month - this.minMonth, this.day - this.minDay];
      },
      hms() {
        return [this.hour - this.minHour, this.minute - this.minMinute, this.second - this.minSecond];
      },
      // 当前 date 是 start
      currentDateIsStart() {
        return this.year === this.startYear && this.month === this.startMonth && this.day === this.startDay;
      },
      // 当前 date 是 end
      currentDateIsEnd() {
        return this.year === this.endYear && this.month === this.endMonth && this.day === this.endDay;
      },
      // 当前年、月、日、时、分、秒的最小值和最大值
      minYear() {
        return this.startYear;
      },
      maxYear() {
        return this.endYear;
      },
      minMonth() {
        if (this.year === this.startYear) {
          return this.startMonth;
        } else {
          return 1;
        }
      },
      maxMonth() {
        if (this.year === this.endYear) {
          return this.endMonth;
        } else {
          return 12;
        }
      },
      minDay() {
        if (this.year === this.startYear && this.month === this.startMonth) {
          return this.startDay;
        } else {
          return 1;
        }
      },
      maxDay() {
        if (this.year === this.endYear && this.month === this.endMonth) {
          return this.endDay;
        } else {
          return this.daysInMonth(this.year, this.month);
        }
      },
      minHour() {
        if (this.type === "datetime") {
          if (this.currentDateIsStart) {
            return this.startHour;
          } else {
            return 0;
          }
        }
        if (this.type === "time") {
          return this.startHour;
        }
      },
      maxHour() {
        if (this.type === "datetime") {
          if (this.currentDateIsEnd) {
            return this.endHour;
          } else {
            return 23;
          }
        }
        if (this.type === "time") {
          return this.endHour;
        }
      },
      minMinute() {
        if (this.type === "datetime") {
          if (this.currentDateIsStart && this.hour === this.startHour) {
            return this.startMinute;
          } else {
            return 0;
          }
        }
        if (this.type === "time") {
          if (this.hour === this.startHour) {
            return this.startMinute;
          } else {
            return 0;
          }
        }
      },
      maxMinute() {
        if (this.type === "datetime") {
          if (this.currentDateIsEnd && this.hour === this.endHour) {
            return this.endMinute;
          } else {
            return 59;
          }
        }
        if (this.type === "time") {
          if (this.hour === this.endHour) {
            return this.endMinute;
          } else {
            return 59;
          }
        }
      },
      minSecond() {
        if (this.type === "datetime") {
          if (this.currentDateIsStart && this.hour === this.startHour && this.minute === this.startMinute) {
            return this.startSecond;
          } else {
            return 0;
          }
        }
        if (this.type === "time") {
          if (this.hour === this.startHour && this.minute === this.startMinute) {
            return this.startSecond;
          } else {
            return 0;
          }
        }
      },
      maxSecond() {
        if (this.type === "datetime") {
          if (this.currentDateIsEnd && this.hour === this.endHour && this.minute === this.endMinute) {
            return this.endSecond;
          } else {
            return 59;
          }
        }
        if (this.type === "time") {
          if (this.hour === this.endHour && this.minute === this.endMinute) {
            return this.endSecond;
          } else {
            return 59;
          }
        }
      },
      /**
       * for i18n
       */
      selectTimeText() {
        return t$1("uni-datetime-picker.selectTime");
      },
      okText() {
        return t$1("uni-datetime-picker.ok");
      },
      clearText() {
        return t$1("uni-datetime-picker.clear");
      },
      cancelText() {
        return t$1("uni-datetime-picker.cancel");
      }
    },
    mounted() {
    },
    methods: {
      /**
       * @param {Object} item
       * 小于 10 在前面加个 0
       */
      lessThanTen(item) {
        return item < 10 ? "0" + item : item;
      },
      /**
       * 解析时分秒字符串，例如：00:00:00
       * @param {String} timeString
       */
      parseTimeType(timeString) {
        if (timeString) {
          let timeArr = timeString.split(":");
          this.hour = Number(timeArr[0]);
          this.minute = Number(timeArr[1]);
          this.second = Number(timeArr[2]);
        }
      },
      /**
       * 解析选择器初始值，类型可以是字符串、时间戳，例如：2000-10-02、'08:30:00'、 1610695109000
       * @param {String | Number} datetime
       */
      initPickerValue(datetime) {
        let defaultValue = null;
        if (datetime) {
          defaultValue = this.compareValueWithStartAndEnd(datetime, this.start, this.end);
        } else {
          defaultValue = Date.now();
          defaultValue = this.compareValueWithStartAndEnd(defaultValue, this.start, this.end);
        }
        this.parseValue(defaultValue);
      },
      /**
       * 初始值规则：
       * - 用户设置初始值 value
       * 	- 设置了起始时间 start、终止时间 end，并 start < value < end，初始值为 value， 否则初始值为 start
       * 	- 只设置了起始时间 start，并 start < value，初始值为 value，否则初始值为 start
       * 	- 只设置了终止时间 end，并 value < end，初始值为 value，否则初始值为 end
       * 	- 无起始终止时间，则初始值为 value
       * - 无初始值 value，则初始值为当前本地时间 Date.now()
       * @param {Object} value
       * @param {Object} dateBase
       */
      compareValueWithStartAndEnd(value, start, end) {
        let winner = null;
        value = this.superTimeStamp(value);
        start = this.superTimeStamp(start);
        end = this.superTimeStamp(end);
        if (start && end) {
          if (value < start) {
            winner = new Date(start);
          } else if (value > end) {
            winner = new Date(end);
          } else {
            winner = new Date(value);
          }
        } else if (start && !end) {
          winner = start <= value ? new Date(value) : new Date(start);
        } else if (!start && end) {
          winner = value <= end ? new Date(value) : new Date(end);
        } else {
          winner = new Date(value);
        }
        return winner;
      },
      /**
       * 转换为可比较的时间戳，接受日期、时分秒、时间戳
       * @param {Object} value
       */
      superTimeStamp(value) {
        let dateBase = "";
        if (this.type === "time" && value && typeof value === "string") {
          const now = /* @__PURE__ */ new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;
          const day = now.getDate();
          dateBase = year + "/" + month + "/" + day + " ";
        }
        if (Number(value)) {
          value = parseInt(value);
          dateBase = 0;
        }
        return this.createTimeStamp(dateBase + value);
      },
      /**
       * 解析默认值 value，字符串、时间戳
       * @param {Object} defaultTime
       */
      parseValue(value) {
        if (!value) {
          return;
        }
        if (this.type === "time" && typeof value === "string") {
          this.parseTimeType(value);
        } else {
          let defaultDate = null;
          defaultDate = new Date(value);
          if (this.type !== "time") {
            this.year = defaultDate.getFullYear();
            this.month = defaultDate.getMonth() + 1;
            this.day = defaultDate.getDate();
          }
          if (this.type !== "date") {
            this.hour = defaultDate.getHours();
            this.minute = defaultDate.getMinutes();
            this.second = defaultDate.getSeconds();
          }
        }
        if (this.hideSecond) {
          this.second = 0;
        }
      },
      /**
       * 解析可选择时间范围 start、end，年月日字符串、时间戳
       * @param {Object} defaultTime
       */
      parseDatetimeRange(point, pointType) {
        if (!point) {
          if (pointType === "start") {
            this.startYear = 1920;
            this.startMonth = 1;
            this.startDay = 1;
            this.startHour = 0;
            this.startMinute = 0;
            this.startSecond = 0;
          }
          if (pointType === "end") {
            this.endYear = 2120;
            this.endMonth = 12;
            this.endDay = 31;
            this.endHour = 23;
            this.endMinute = 59;
            this.endSecond = 59;
          }
          return;
        }
        if (this.type === "time") {
          const pointArr = point.split(":");
          this[pointType + "Hour"] = Number(pointArr[0]);
          this[pointType + "Minute"] = Number(pointArr[1]);
          this[pointType + "Second"] = Number(pointArr[2]);
        } else {
          if (!point) {
            pointType === "start" ? this.startYear = this.year - 60 : this.endYear = this.year + 60;
            return;
          }
          if (Number(point)) {
            point = parseInt(point);
          }
          const hasTime = /[0-9]:[0-9]/;
          if (this.type === "datetime" && pointType === "end" && typeof point === "string" && !hasTime.test(
            point
          )) {
            point = point + " 23:59:59";
          }
          const pointDate = new Date(point);
          this[pointType + "Year"] = pointDate.getFullYear();
          this[pointType + "Month"] = pointDate.getMonth() + 1;
          this[pointType + "Day"] = pointDate.getDate();
          if (this.type === "datetime") {
            this[pointType + "Hour"] = pointDate.getHours();
            this[pointType + "Minute"] = pointDate.getMinutes();
            this[pointType + "Second"] = pointDate.getSeconds();
          }
        }
      },
      // 获取 年、月、日、时、分、秒 当前可选范围
      getCurrentRange(value) {
        const range = [];
        for (let i = this["min" + this.capitalize(value)]; i <= this["max" + this.capitalize(value)]; i++) {
          range.push(i);
        }
        return range;
      },
      // 字符串首字母大写
      capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      // 检查当前值是否在范围内，不在则当前值重置为可选范围第一项
      checkValue(name, value, values) {
        if (values.indexOf(value) === -1) {
          this[name] = values[0];
        }
      },
      // 每个月的实际天数
      daysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
      },
      /**
       * 生成时间戳
       * @param {Object} time
       */
      createTimeStamp(time) {
        if (!time)
          return;
        if (typeof time === "number") {
          return time;
        } else {
          time = time.replace(/-/g, "/");
          if (this.type === "date") {
            time = time + " 00:00:00";
          }
          return Date.parse(time);
        }
      },
      /**
       * 生成日期或时间的字符串
       */
      createDomSting() {
        const yymmdd = this.year + "-" + this.lessThanTen(this.month) + "-" + this.lessThanTen(this.day);
        let hhmmss = this.lessThanTen(this.hour) + ":" + this.lessThanTen(this.minute);
        if (!this.hideSecond) {
          hhmmss = hhmmss + ":" + this.lessThanTen(this.second);
        }
        if (this.type === "date") {
          return yymmdd;
        } else if (this.type === "time") {
          return hhmmss;
        } else {
          return yymmdd + " " + hhmmss;
        }
      },
      /**
       * 初始化返回值，并抛出 change 事件
       */
      initTime(emit = true) {
        this.time = this.createDomSting();
        if (!emit)
          return;
        if (this.returnType === "timestamp" && this.type !== "time") {
          this.$emit("change", this.createTimeStamp(this.time));
          this.$emit("input", this.createTimeStamp(this.time));
          this.$emit("update:modelValue", this.createTimeStamp(this.time));
        } else {
          this.$emit("change", this.time);
          this.$emit("input", this.time);
          this.$emit("update:modelValue", this.time);
        }
      },
      /**
       * 用户选择日期或时间更新 data
       * @param {Object} e
       */
      bindDateChange(e) {
        const val = e.detail.value;
        this.year = this.years[val[0]];
        this.month = this.months[val[1]];
        this.day = this.days[val[2]];
      },
      bindTimeChange(e) {
        const val = e.detail.value;
        this.hour = this.hours[val[0]];
        this.minute = this.minutes[val[1]];
        this.second = this.seconds[val[2]];
      },
      /**
       * 初始化弹出层
       */
      initTimePicker() {
        if (this.disabled)
          return;
        const value = fixIosDateFormat(this.time);
        this.initPickerValue(value);
        this.visible = !this.visible;
      },
      /**
       * 触发或关闭弹框
       */
      tiggerTimePicker(e) {
        this.visible = !this.visible;
      },
      /**
       * 用户点击“清空”按钮，清空当前值
       */
      clearTime() {
        this.time = "";
        this.$emit("change", this.time);
        this.$emit("input", this.time);
        this.$emit("update:modelValue", this.time);
        this.tiggerTimePicker();
      },
      /**
       * 用户点击“确定”按钮
       */
      setTime() {
        this.initTime();
        this.tiggerTimePicker();
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-datetime-picker" }, [
      vue.createElementVNode("view", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.initTimePicker && $options.initTimePicker(...args))
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["uni-datetime-picker-timebox-pointer", { "uni-datetime-picker-disabled": $props.disabled, "uni-datetime-picker-timebox": $props.border }])
            },
            [
              vue.createElementVNode(
                "text",
                { class: "uni-datetime-picker-text" },
                vue.toDisplayString($data.time),
                1
                /* TEXT */
              ),
              !$data.time ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "uni-datetime-picker-time"
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "uni-datetime-picker-text" },
                  vue.toDisplayString($options.selectTimeText),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          )
        ], true)
      ]),
      $data.visible ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        id: "mask",
        class: "uni-datetime-picker-mask",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.tiggerTimePicker && $options.tiggerTimePicker(...args))
      })) : vue.createCommentVNode("v-if", true),
      $data.visible ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          class: vue.normalizeClass(["uni-datetime-picker-popup", [$data.dateShow && $data.timeShow ? "" : "fix-nvue-height"]]),
          style: vue.normalizeStyle($data.fixNvueBug)
        },
        [
          vue.createElementVNode("view", { class: "uni-title" }, [
            vue.createElementVNode(
              "text",
              { class: "uni-datetime-picker-text" },
              vue.toDisplayString($options.selectTimeText),
              1
              /* TEXT */
            )
          ]),
          $data.dateShow ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "uni-datetime-picker__container-box"
          }, [
            vue.createElementVNode("picker-view", {
              class: "uni-datetime-picker-view",
              "indicator-style": $data.indicatorStyle,
              value: $options.ymd,
              onChange: _cache[2] || (_cache[2] = (...args) => $options.bindDateChange && $options.bindDateChange(...args))
            }, [
              vue.createElementVNode("picker-view-column", null, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.years, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "uni-datetime-picker-item",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "uni-datetime-picker-item" },
                        vue.toDisplayString($options.lessThanTen(item)),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("picker-view-column", null, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.months, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "uni-datetime-picker-item",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "uni-datetime-picker-item" },
                        vue.toDisplayString($options.lessThanTen(item)),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("picker-view-column", null, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.days, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "uni-datetime-picker-item",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "uni-datetime-picker-item" },
                        vue.toDisplayString($options.lessThanTen(item)),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ], 40, ["indicator-style", "value"]),
            vue.createCommentVNode(" 兼容 nvue 不支持伪类 "),
            vue.createElementVNode("text", { class: "uni-datetime-picker-sign sign-left" }, "-"),
            vue.createElementVNode("text", { class: "uni-datetime-picker-sign sign-right" }, "-")
          ])) : vue.createCommentVNode("v-if", true),
          $data.timeShow ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "uni-datetime-picker__container-box"
          }, [
            vue.createElementVNode("picker-view", {
              class: vue.normalizeClass(["uni-datetime-picker-view", [$props.hideSecond ? "time-hide-second" : ""]]),
              "indicator-style": $data.indicatorStyle,
              value: $options.hms,
              onChange: _cache[3] || (_cache[3] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
            }, [
              vue.createElementVNode("picker-view-column", null, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.hours, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "uni-datetime-picker-item",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "uni-datetime-picker-item" },
                        vue.toDisplayString($options.lessThanTen(item)),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("picker-view-column", null, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.minutes, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "uni-datetime-picker-item",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "uni-datetime-picker-item" },
                        vue.toDisplayString($options.lessThanTen(item)),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              !$props.hideSecond ? (vue.openBlock(), vue.createElementBlock("picker-view-column", { key: 0 }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.seconds, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "uni-datetime-picker-item",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "uni-datetime-picker-item" },
                        vue.toDisplayString($options.lessThanTen(item)),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true)
            ], 42, ["indicator-style", "value"]),
            vue.createCommentVNode(" 兼容 nvue 不支持伪类 "),
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["uni-datetime-picker-sign", [$props.hideSecond ? "sign-center" : "sign-left"]])
              },
              ":",
              2
              /* CLASS */
            ),
            !$props.hideSecond ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 0,
              class: "uni-datetime-picker-sign sign-right"
            }, ":")) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "uni-datetime-picker-btn" }, [
            vue.createElementVNode("view", {
              onClick: _cache[4] || (_cache[4] = (...args) => $options.clearTime && $options.clearTime(...args))
            }, [
              vue.createElementVNode(
                "text",
                { class: "uni-datetime-picker-btn-text" },
                vue.toDisplayString($options.clearText),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "uni-datetime-picker-btn-group" }, [
              vue.createElementVNode("view", {
                class: "uni-datetime-picker-cancel",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.tiggerTimePicker && $options.tiggerTimePicker(...args))
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "uni-datetime-picker-btn-text" },
                  vue.toDisplayString($options.cancelText),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", {
                onClick: _cache[6] || (_cache[6] = (...args) => $options.setTime && $options.setTime(...args))
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "uni-datetime-picker-btn-text" },
                  vue.toDisplayString($options.okText),
                  1
                  /* TEXT */
                )
              ])
            ])
          ])
        ],
        6
        /* CLASS, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const TimePicker = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-1d532b70"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-datetime-picker/components/uni-datetime-picker/time-picker.vue"]]);
  const {
    t
  } = initVueI18n(i18nMessages);
  const _sfc_main$b = {
    components: {
      calendarItem,
      timePicker: TimePicker
    },
    options: {
      virtualHost: true
    },
    props: {
      date: {
        type: String,
        default: ""
      },
      defTime: {
        type: [String, Object],
        default: ""
      },
      selectableTimes: {
        type: [Object],
        default() {
          return {};
        }
      },
      selected: {
        type: Array,
        default() {
          return [];
        }
      },
      startDate: {
        type: String,
        default: ""
      },
      endDate: {
        type: String,
        default: ""
      },
      startPlaceholder: {
        type: String,
        default: ""
      },
      endPlaceholder: {
        type: String,
        default: ""
      },
      range: {
        type: Boolean,
        default: false
      },
      hasTime: {
        type: Boolean,
        default: false
      },
      insert: {
        type: Boolean,
        default: true
      },
      showMonth: {
        type: Boolean,
        default: true
      },
      clearDate: {
        type: Boolean,
        default: true
      },
      checkHover: {
        type: Boolean,
        default: true
      },
      hideSecond: {
        type: [Boolean],
        default: false
      },
      pleStatus: {
        type: Object,
        default() {
          return {
            before: "",
            after: "",
            data: [],
            fulldate: ""
          };
        }
      },
      defaultValue: {
        type: [String, Object, Array],
        default: ""
      }
    },
    data() {
      return {
        show: false,
        weeks: [],
        calendar: {},
        nowDate: {},
        aniMaskShow: false,
        firstEnter: true,
        time: "",
        timeRange: {
          startTime: "",
          endTime: ""
        },
        tempSingleDate: "",
        tempRange: {
          before: "",
          after: ""
        }
      };
    },
    watch: {
      date: {
        immediate: true,
        handler(newVal) {
          if (!this.range) {
            this.tempSingleDate = newVal;
            setTimeout(() => {
              this.init(newVal);
            }, 100);
          }
        }
      },
      defTime: {
        immediate: true,
        handler(newVal) {
          if (!this.range) {
            this.time = newVal;
          } else {
            this.timeRange.startTime = newVal.start;
            this.timeRange.endTime = newVal.end;
          }
        }
      },
      startDate(val) {
        if (!this.cale) {
          return;
        }
        this.cale.setStartDate(val);
        this.cale.setDate(this.nowDate.fullDate);
        this.weeks = this.cale.weeks;
      },
      endDate(val) {
        if (!this.cale) {
          return;
        }
        this.cale.setEndDate(val);
        this.cale.setDate(this.nowDate.fullDate);
        this.weeks = this.cale.weeks;
      },
      selected(newVal) {
        if (!this.cale) {
          return;
        }
        this.cale.setSelectInfo(this.nowDate.fullDate, newVal);
        this.weeks = this.cale.weeks;
      },
      pleStatus: {
        immediate: true,
        handler(newVal) {
          const {
            before,
            after,
            fulldate,
            which
          } = newVal;
          this.tempRange.before = before;
          this.tempRange.after = after;
          setTimeout(() => {
            if (fulldate) {
              this.cale.setHoverMultiple(fulldate);
              if (before && after) {
                this.cale.lastHover = true;
                if (this.rangeWithinMonth(after, before))
                  return;
                this.setDate(before);
              } else {
                this.cale.setMultiple(fulldate);
                this.setDate(this.nowDate.fullDate);
                this.calendar.fullDate = "";
                this.cale.lastHover = false;
              }
            } else {
              if (!this.cale) {
                return;
              }
              this.cale.setDefaultMultiple(before, after);
              if (which === "left" && before) {
                this.setDate(before);
                this.weeks = this.cale.weeks;
              } else if (after) {
                this.setDate(after);
                this.weeks = this.cale.weeks;
              }
              this.cale.lastHover = true;
            }
          }, 16);
        }
      }
    },
    computed: {
      timepickerStartTime() {
        const activeDate = this.range ? this.tempRange.before : this.calendar.fullDate;
        return activeDate === this.startDate ? this.selectableTimes.start : "";
      },
      timepickerEndTime() {
        const activeDate = this.range ? this.tempRange.after : this.calendar.fullDate;
        return activeDate === this.endDate ? this.selectableTimes.end : "";
      },
      /**
       * for i18n
       */
      selectDateText() {
        return t("uni-datetime-picker.selectDate");
      },
      startDateText() {
        return this.startPlaceholder || t("uni-datetime-picker.startDate");
      },
      endDateText() {
        return this.endPlaceholder || t("uni-datetime-picker.endDate");
      },
      okText() {
        return t("uni-datetime-picker.ok");
      },
      yearText() {
        return t("uni-datetime-picker.year");
      },
      monthText() {
        return t("uni-datetime-picker.month");
      },
      MONText() {
        return t("uni-calender.MON");
      },
      TUEText() {
        return t("uni-calender.TUE");
      },
      WEDText() {
        return t("uni-calender.WED");
      },
      THUText() {
        return t("uni-calender.THU");
      },
      FRIText() {
        return t("uni-calender.FRI");
      },
      SATText() {
        return t("uni-calender.SAT");
      },
      SUNText() {
        return t("uni-calender.SUN");
      },
      confirmText() {
        return t("uni-calender.confirm");
      }
    },
    created() {
      this.cale = new Calendar$1({
        selected: this.selected,
        startDate: this.startDate,
        endDate: this.endDate,
        range: this.range
      });
      this.init(this.date);
    },
    methods: {
      leaveCale() {
        this.firstEnter = true;
      },
      handleMouse(weeks) {
        if (weeks.disable)
          return;
        if (this.cale.lastHover)
          return;
        let {
          before,
          after
        } = this.cale.multipleStatus;
        if (!before)
          return;
        this.calendar = weeks;
        this.cale.setHoverMultiple(this.calendar.fullDate);
        this.weeks = this.cale.weeks;
        if (this.firstEnter) {
          this.$emit("firstEnterCale", this.cale.multipleStatus);
          this.firstEnter = false;
        }
      },
      rangeWithinMonth(A, B) {
        const [yearA, monthA] = A.split("-");
        const [yearB, monthB] = B.split("-");
        return yearA === yearB && monthA === monthB;
      },
      // 蒙版点击事件
      maskClick() {
        this.close();
        this.$emit("maskClose");
      },
      clearCalender() {
        if (this.range) {
          this.timeRange.startTime = "";
          this.timeRange.endTime = "";
          this.tempRange.before = "";
          this.tempRange.after = "";
          this.cale.multipleStatus.before = "";
          this.cale.multipleStatus.after = "";
          this.cale.multipleStatus.data = [];
          this.cale.lastHover = false;
        } else {
          this.time = "";
          this.tempSingleDate = "";
        }
        this.calendar.fullDate = "";
        this.setDate(/* @__PURE__ */ new Date());
      },
      bindDateChange(e) {
        const value = e.detail.value + "-1";
        this.setDate(value);
      },
      /**
       * 初始化日期显示
       * @param {Object} date
       */
      init(date) {
        if (!this.cale) {
          return;
        }
        this.cale.setDate(date || /* @__PURE__ */ new Date());
        this.weeks = this.cale.weeks;
        this.nowDate = this.cale.getInfo(date);
        this.calendar = {
          ...this.nowDate
        };
        if (!date) {
          this.calendar.fullDate = "";
          if (this.defaultValue && !this.range) {
            const defaultDate = new Date(this.defaultValue);
            const fullDate = getDate(defaultDate);
            const year = defaultDate.getFullYear();
            const month = defaultDate.getMonth() + 1;
            const date2 = defaultDate.getDate();
            const day = defaultDate.getDay();
            this.calendar = {
              fullDate,
              year,
              month,
              date: date2,
              day
            }, this.tempSingleDate = fullDate;
            this.time = getTime(defaultDate, this.hideSecond);
          }
        }
      },
      /**
       * 打开日历弹窗
       */
      open() {
        if (this.clearDate && !this.insert) {
          this.cale.cleanMultipleStatus();
          this.init(this.date);
        }
        this.show = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.aniMaskShow = true;
          }, 50);
        });
      },
      /**
       * 关闭日历弹窗
       */
      close() {
        this.aniMaskShow = false;
        this.$nextTick(() => {
          setTimeout(() => {
            this.show = false;
            this.$emit("close");
          }, 300);
        });
      },
      /**
       * 确认按钮
       */
      confirm() {
        this.setEmit("confirm");
        this.close();
      },
      /**
       * 变化触发
       */
      change(isSingleChange) {
        if (!this.insert && !isSingleChange)
          return;
        this.setEmit("change");
      },
      /**
       * 选择月份触发
       */
      monthSwitch() {
        let {
          year,
          month
        } = this.nowDate;
        this.$emit("monthSwitch", {
          year,
          month: Number(month)
        });
      },
      /**
       * 派发事件
       * @param {Object} name
       */
      setEmit(name) {
        if (!this.range) {
          if (!this.calendar.fullDate) {
            this.calendar = this.cale.getInfo(/* @__PURE__ */ new Date());
            this.tempSingleDate = this.calendar.fullDate;
          }
          if (this.hasTime && !this.time) {
            this.time = getTime(/* @__PURE__ */ new Date(), this.hideSecond);
          }
        }
        let {
          year,
          month,
          date,
          fullDate,
          extraInfo
        } = this.calendar;
        this.$emit(name, {
          range: this.cale.multipleStatus,
          year,
          month,
          date,
          time: this.time,
          timeRange: this.timeRange,
          fulldate: fullDate,
          extraInfo: extraInfo || {}
        });
      },
      /**
       * 选择天触发
       * @param {Object} weeks
       */
      choiceDate(weeks) {
        if (weeks.disable)
          return;
        this.calendar = weeks;
        this.calendar.userChecked = true;
        this.cale.setMultiple(this.calendar.fullDate, true);
        this.weeks = this.cale.weeks;
        this.tempSingleDate = this.calendar.fullDate;
        const beforeDate = new Date(this.cale.multipleStatus.before).getTime();
        const afterDate = new Date(this.cale.multipleStatus.after).getTime();
        if (beforeDate > afterDate && afterDate) {
          this.tempRange.before = this.cale.multipleStatus.after;
          this.tempRange.after = this.cale.multipleStatus.before;
        } else {
          this.tempRange.before = this.cale.multipleStatus.before;
          this.tempRange.after = this.cale.multipleStatus.after;
        }
        this.change(true);
      },
      changeMonth(type) {
        let newDate;
        if (type === "pre") {
          newDate = this.cale.getPreMonthObj(this.nowDate.fullDate).fullDate;
        } else if (type === "next") {
          newDate = this.cale.getNextMonthObj(this.nowDate.fullDate).fullDate;
        }
        this.setDate(newDate);
        this.monthSwitch();
      },
      /**
       * 设置日期
       * @param {Object} date
       */
      setDate(date) {
        this.cale.setDate(date);
        this.weeks = this.cale.weeks;
        this.nowDate = this.cale.getInfo(date);
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_calendar_item = vue.resolveComponent("calendar-item");
    const _component_time_picker = vue.resolveComponent("time-picker");
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "uni-calendar",
        onMouseleave: _cache[9] || (_cache[9] = (...args) => $options.leaveCale && $options.leaveCale(...args))
      },
      [
        !$props.insert && $data.show ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["uni-calendar__mask", { "uni-calendar--mask-show": $data.aniMaskShow }]),
            onClick: _cache[0] || (_cache[0] = (...args) => $options.maskClick && $options.maskClick(...args))
          },
          null,
          2
          /* CLASS */
        )) : vue.createCommentVNode("v-if", true),
        $props.insert || $data.show ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 1,
            class: vue.normalizeClass(["uni-calendar__content", { "uni-calendar--fixed": !$props.insert, "uni-calendar--ani-show": $data.aniMaskShow, "uni-calendar__content-mobile": $data.aniMaskShow }])
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["uni-calendar__header", { "uni-calendar__header-mobile": !$props.insert }])
              },
              [
                vue.createElementVNode("view", {
                  class: "uni-calendar__header-btn-box",
                  onClick: _cache[1] || (_cache[1] = vue.withModifiers(($event) => $options.changeMonth("pre"), ["stop"]))
                }, [
                  vue.createElementVNode("view", { class: "uni-calendar__header-btn uni-calendar--left" })
                ]),
                vue.createElementVNode("picker", {
                  mode: "date",
                  value: $props.date,
                  fields: "month",
                  onChange: _cache[2] || (_cache[2] = (...args) => $options.bindDateChange && $options.bindDateChange(...args))
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "uni-calendar__header-text" },
                    vue.toDisplayString(($data.nowDate.year || "") + $options.yearText + ($data.nowDate.month || "") + $options.monthText),
                    1
                    /* TEXT */
                  )
                ], 40, ["value"]),
                vue.createElementVNode("view", {
                  class: "uni-calendar__header-btn-box",
                  onClick: _cache[3] || (_cache[3] = vue.withModifiers(($event) => $options.changeMonth("next"), ["stop"]))
                }, [
                  vue.createElementVNode("view", { class: "uni-calendar__header-btn uni-calendar--right" })
                ]),
                !$props.insert ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "dialog-close",
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.maskClick && $options.maskClick(...args))
                }, [
                  vue.createElementVNode("view", {
                    class: "dialog-close-plus",
                    "data-id": "close"
                  }),
                  vue.createElementVNode("view", {
                    class: "dialog-close-plus dialog-close-rotate",
                    "data-id": "close"
                  })
                ])) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode("view", { class: "uni-calendar__box" }, [
              $props.showMonth ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "uni-calendar__box-bg"
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "uni-calendar__box-bg-text" },
                  vue.toDisplayString($data.nowDate.month),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", {
                class: "uni-calendar__weeks",
                style: { "padding-bottom": "7px" }
              }, [
                vue.createElementVNode("view", { class: "uni-calendar__weeks-day" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "uni-calendar__weeks-day-text" },
                    vue.toDisplayString($options.SUNText),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "uni-calendar__weeks-day" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "uni-calendar__weeks-day-text" },
                    vue.toDisplayString($options.MONText),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "uni-calendar__weeks-day" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "uni-calendar__weeks-day-text" },
                    vue.toDisplayString($options.TUEText),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "uni-calendar__weeks-day" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "uni-calendar__weeks-day-text" },
                    vue.toDisplayString($options.WEDText),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "uni-calendar__weeks-day" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "uni-calendar__weeks-day-text" },
                    vue.toDisplayString($options.THUText),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "uni-calendar__weeks-day" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "uni-calendar__weeks-day-text" },
                    vue.toDisplayString($options.FRIText),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "uni-calendar__weeks-day" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "uni-calendar__weeks-day-text" },
                    vue.toDisplayString($options.SATText),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.weeks, (item, weekIndex) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "uni-calendar__weeks",
                    key: weekIndex
                  }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(item, (weeks, weeksIndex) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          class: "uni-calendar__weeks-item",
                          key: weeksIndex
                        }, [
                          vue.createVNode(_component_calendar_item, {
                            class: "uni-calendar-item--hook",
                            weeks,
                            calendar: $data.calendar,
                            selected: $props.selected,
                            checkHover: $props.range,
                            onChange: $options.choiceDate,
                            onHandleMouse: $options.handleMouse
                          }, null, 8, ["weeks", "calendar", "selected", "checkHover", "onChange", "onHandleMouse"])
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            !$props.insert && !$props.range && $props.hasTime ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "uni-date-changed uni-calendar--fixed-top",
              style: { "padding": "0 80px" }
            }, [
              vue.createElementVNode(
                "view",
                { class: "uni-date-changed--time-date" },
                vue.toDisplayString($data.tempSingleDate ? $data.tempSingleDate : $options.selectDateText),
                1
                /* TEXT */
              ),
              vue.createVNode(_component_time_picker, {
                type: "time",
                start: $options.timepickerStartTime,
                end: $options.timepickerEndTime,
                modelValue: $data.time,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.time = $event),
                disabled: !$data.tempSingleDate,
                border: false,
                "hide-second": $props.hideSecond,
                class: "time-picker-style"
              }, null, 8, ["start", "end", "modelValue", "disabled", "hide-second"])
            ])) : vue.createCommentVNode("v-if", true),
            !$props.insert && $props.range && $props.hasTime ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "uni-date-changed uni-calendar--fixed-top"
            }, [
              vue.createElementVNode("view", { class: "uni-date-changed--time-start" }, [
                vue.createElementVNode(
                  "view",
                  { class: "uni-date-changed--time-date" },
                  vue.toDisplayString($data.tempRange.before ? $data.tempRange.before : $options.startDateText),
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_time_picker, {
                  type: "time",
                  start: $options.timepickerStartTime,
                  modelValue: $data.timeRange.startTime,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.timeRange.startTime = $event),
                  border: false,
                  "hide-second": $props.hideSecond,
                  disabled: !$data.tempRange.before,
                  class: "time-picker-style"
                }, null, 8, ["start", "modelValue", "hide-second", "disabled"])
              ]),
              vue.createElementVNode("view", { style: { "line-height": "50px" } }, [
                vue.createVNode(_component_uni_icons, {
                  type: "arrowthinright",
                  color: "#999"
                })
              ]),
              vue.createElementVNode("view", { class: "uni-date-changed--time-end" }, [
                vue.createElementVNode(
                  "view",
                  { class: "uni-date-changed--time-date" },
                  vue.toDisplayString($data.tempRange.after ? $data.tempRange.after : $options.endDateText),
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_time_picker, {
                  type: "time",
                  end: $options.timepickerEndTime,
                  modelValue: $data.timeRange.endTime,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.timeRange.endTime = $event),
                  border: false,
                  "hide-second": $props.hideSecond,
                  disabled: !$data.tempRange.after,
                  class: "time-picker-style"
                }, null, 8, ["end", "modelValue", "hide-second", "disabled"])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            !$props.insert ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "uni-date-changed uni-date-btn--ok"
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: "uni-datetime-picker--btn",
                  onClick: _cache[8] || (_cache[8] = (...args) => $options.confirm && $options.confirm(...args))
                },
                vue.toDisplayString($options.confirmText),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ],
          2
          /* CLASS */
        )) : vue.createCommentVNode("v-if", true)
      ],
      32
      /* NEED_HYDRATION */
    );
  }
  const Calendar = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-1d379219"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-datetime-picker/components/uni-datetime-picker/calendar.vue"]]);
  const _sfc_main$a = {
    name: "UniDatetimePicker",
    options: {
      virtualHost: true
    },
    components: {
      Calendar,
      TimePicker
    },
    data() {
      return {
        isRange: false,
        hasTime: false,
        displayValue: "",
        inputDate: "",
        calendarDate: "",
        pickerTime: "",
        calendarRange: {
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: ""
        },
        displayRangeValue: {
          startDate: "",
          endDate: ""
        },
        tempRange: {
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: ""
        },
        // 左右日历同步数据
        startMultipleStatus: {
          before: "",
          after: "",
          data: [],
          fulldate: ""
        },
        endMultipleStatus: {
          before: "",
          after: "",
          data: [],
          fulldate: ""
        },
        pickerVisible: false,
        pickerPositionStyle: null,
        isEmitValue: false,
        isPhone: false,
        isFirstShow: true,
        i18nT: () => {
        }
      };
    },
    props: {
      type: {
        type: String,
        default: "datetime"
      },
      value: {
        type: [String, Number, Array, Date],
        default: ""
      },
      modelValue: {
        type: [String, Number, Array, Date],
        default: ""
      },
      start: {
        type: [Number, String],
        default: ""
      },
      end: {
        type: [Number, String],
        default: ""
      },
      returnType: {
        type: String,
        default: "string"
      },
      placeholder: {
        type: String,
        default: ""
      },
      startPlaceholder: {
        type: String,
        default: ""
      },
      endPlaceholder: {
        type: String,
        default: ""
      },
      rangeSeparator: {
        type: String,
        default: "-"
      },
      border: {
        type: [Boolean],
        default: true
      },
      disabled: {
        type: [Boolean],
        default: false
      },
      clearIcon: {
        type: [Boolean],
        default: true
      },
      hideSecond: {
        type: [Boolean],
        default: false
      },
      defaultValue: {
        type: [String, Object, Array],
        default: ""
      }
    },
    watch: {
      type: {
        immediate: true,
        handler(newVal) {
          this.hasTime = newVal.indexOf("time") !== -1;
          this.isRange = newVal.indexOf("range") !== -1;
        }
      },
      modelValue: {
        immediate: true,
        handler(newVal) {
          if (this.isEmitValue) {
            this.isEmitValue = false;
            return;
          }
          this.initPicker(newVal);
        }
      },
      start: {
        immediate: true,
        handler(newVal) {
          if (!newVal)
            return;
          this.calendarRange.startDate = getDate(newVal);
          if (this.hasTime) {
            this.calendarRange.startTime = getTime(newVal);
          }
        }
      },
      end: {
        immediate: true,
        handler(newVal) {
          if (!newVal)
            return;
          this.calendarRange.endDate = getDate(newVal);
          if (this.hasTime) {
            this.calendarRange.endTime = getTime(newVal, this.hideSecond);
          }
        }
      }
    },
    computed: {
      timepickerStartTime() {
        const activeDate = this.isRange ? this.tempRange.startDate : this.inputDate;
        return activeDate === this.calendarRange.startDate ? this.calendarRange.startTime : "";
      },
      timepickerEndTime() {
        const activeDate = this.isRange ? this.tempRange.endDate : this.inputDate;
        return activeDate === this.calendarRange.endDate ? this.calendarRange.endTime : "";
      },
      mobileCalendarTime() {
        const timeRange = {
          start: this.tempRange.startTime,
          end: this.tempRange.endTime
        };
        return this.isRange ? timeRange : this.pickerTime;
      },
      mobSelectableTime() {
        return {
          start: this.calendarRange.startTime,
          end: this.calendarRange.endTime
        };
      },
      datePopupWidth() {
        return this.isRange ? 653 : 301;
      },
      /**
       * for i18n
       */
      singlePlaceholderText() {
        return this.placeholder || (this.type === "date" ? this.selectDateText : this.selectDateTimeText);
      },
      startPlaceholderText() {
        return this.startPlaceholder || this.startDateText;
      },
      endPlaceholderText() {
        return this.endPlaceholder || this.endDateText;
      },
      selectDateText() {
        return this.i18nT("uni-datetime-picker.selectDate");
      },
      selectDateTimeText() {
        return this.i18nT("uni-datetime-picker.selectDateTime");
      },
      selectTimeText() {
        return this.i18nT("uni-datetime-picker.selectTime");
      },
      startDateText() {
        return this.startPlaceholder || this.i18nT("uni-datetime-picker.startDate");
      },
      startTimeText() {
        return this.i18nT("uni-datetime-picker.startTime");
      },
      endDateText() {
        return this.endPlaceholder || this.i18nT("uni-datetime-picker.endDate");
      },
      endTimeText() {
        return this.i18nT("uni-datetime-picker.endTime");
      },
      okText() {
        return this.i18nT("uni-datetime-picker.ok");
      },
      clearText() {
        return this.i18nT("uni-datetime-picker.clear");
      },
      showClearIcon() {
        return this.clearIcon && !this.disabled && (this.displayValue || this.displayRangeValue.startDate && this.displayRangeValue.endDate);
      }
    },
    created() {
      this.initI18nT();
      this.platform();
    },
    methods: {
      initI18nT() {
        const vueI18n = initVueI18n(i18nMessages);
        this.i18nT = vueI18n.t;
      },
      initPicker(newVal) {
        if (!newVal && !this.defaultValue || Array.isArray(newVal) && !newVal.length) {
          this.$nextTick(() => {
            this.clear(false);
          });
          return;
        }
        if (!Array.isArray(newVal) && !this.isRange) {
          if (newVal) {
            this.displayValue = this.inputDate = this.calendarDate = getDate(newVal);
            if (this.hasTime) {
              this.pickerTime = getTime(newVal, this.hideSecond);
              this.displayValue = `${this.displayValue} ${this.pickerTime}`;
            }
          } else if (this.defaultValue) {
            this.inputDate = this.calendarDate = getDate(this.defaultValue);
            if (this.hasTime) {
              this.pickerTime = getTime(this.defaultValue, this.hideSecond);
            }
          }
        } else {
          const [before, after] = newVal;
          if (!before && !after)
            return;
          const beforeDate = getDate(before);
          const beforeTime = getTime(before, this.hideSecond);
          const afterDate = getDate(after);
          const afterTime = getTime(after, this.hideSecond);
          const startDate = beforeDate;
          const endDate = afterDate;
          this.displayRangeValue.startDate = this.tempRange.startDate = startDate;
          this.displayRangeValue.endDate = this.tempRange.endDate = endDate;
          if (this.hasTime) {
            this.displayRangeValue.startDate = `${beforeDate} ${beforeTime}`;
            this.displayRangeValue.endDate = `${afterDate} ${afterTime}`;
            this.tempRange.startTime = beforeTime;
            this.tempRange.endTime = afterTime;
          }
          const defaultRange = {
            before: beforeDate,
            after: afterDate
          };
          this.startMultipleStatus = Object.assign({}, this.startMultipleStatus, defaultRange, {
            which: "right"
          });
          this.endMultipleStatus = Object.assign({}, this.endMultipleStatus, defaultRange, {
            which: "left"
          });
        }
      },
      updateLeftCale(e) {
        const left = this.$refs.left;
        left.cale.setHoverMultiple(e.after);
        left.setDate(this.$refs.left.nowDate.fullDate);
      },
      updateRightCale(e) {
        const right = this.$refs.right;
        right.cale.setHoverMultiple(e.after);
        right.setDate(this.$refs.right.nowDate.fullDate);
      },
      platform() {
        if (typeof navigator !== "undefined") {
          this.isPhone = navigator.userAgent.toLowerCase().indexOf("mobile") !== -1;
          return;
        }
        const {
          windowWidth
        } = uni.getSystemInfoSync();
        this.isPhone = windowWidth <= 500;
        this.windowWidth = windowWidth;
      },
      show() {
        this.$emit("show");
        if (this.disabled) {
          return;
        }
        this.platform();
        if (this.isPhone) {
          setTimeout(() => {
            this.$refs.mobile.open();
          }, 0);
          return;
        }
        this.pickerPositionStyle = {
          top: "10px"
        };
        const dateEditor = uni.createSelectorQuery().in(this).select(".uni-date-editor");
        dateEditor.boundingClientRect((rect) => {
          if (this.windowWidth - rect.left < this.datePopupWidth) {
            this.pickerPositionStyle.right = 0;
          }
        }).exec();
        setTimeout(() => {
          this.pickerVisible = !this.pickerVisible;
          if (!this.isPhone && this.isRange && this.isFirstShow) {
            this.isFirstShow = false;
            const {
              startDate,
              endDate
            } = this.calendarRange;
            if (startDate && endDate) {
              if (this.diffDate(startDate, endDate) < 30) {
                this.$refs.right.changeMonth("pre");
              }
            } else {
              if (this.isPhone) {
                this.$refs.right.cale.lastHover = false;
              }
            }
          }
        }, 50);
      },
      close() {
        setTimeout(() => {
          this.pickerVisible = false;
          this.$emit("maskClick", this.value);
          this.$refs.mobile && this.$refs.mobile.close();
        }, 20);
      },
      setEmit(value) {
        if (this.returnType === "timestamp" || this.returnType === "date") {
          if (!Array.isArray(value)) {
            if (!this.hasTime) {
              value = value + " 00:00:00";
            }
            value = this.createTimestamp(value);
            if (this.returnType === "date") {
              value = new Date(value);
            }
          } else {
            if (!this.hasTime) {
              value[0] = value[0] + " 00:00:00";
              value[1] = value[1] + " 00:00:00";
            }
            value[0] = this.createTimestamp(value[0]);
            value[1] = this.createTimestamp(value[1]);
            if (this.returnType === "date") {
              value[0] = new Date(value[0]);
              value[1] = new Date(value[1]);
            }
          }
        }
        this.$emit("update:modelValue", value);
        this.$emit("input", value);
        this.$emit("change", value);
        this.isEmitValue = true;
      },
      createTimestamp(date) {
        date = fixIosDateFormat(date);
        return Date.parse(new Date(date));
      },
      singleChange(e) {
        this.calendarDate = this.inputDate = e.fulldate;
        if (this.hasTime)
          return;
        this.confirmSingleChange();
      },
      confirmSingleChange() {
        if (!checkDate(this.inputDate)) {
          const now = /* @__PURE__ */ new Date();
          this.calendarDate = this.inputDate = getDate(now);
          this.pickerTime = getTime(now, this.hideSecond);
        }
        let startLaterInputDate = false;
        let startDate, startTime;
        if (this.start) {
          let startString = this.start;
          if (typeof this.start === "number") {
            startString = getDateTime(this.start, this.hideSecond);
          }
          [startDate, startTime] = startString.split(" ");
          if (this.start && !dateCompare(startDate, this.inputDate)) {
            startLaterInputDate = true;
            this.inputDate = startDate;
          }
        }
        let endEarlierInputDate = false;
        let endDate, endTime;
        if (this.end) {
          let endString = this.end;
          if (typeof this.end === "number") {
            endString = getDateTime(this.end, this.hideSecond);
          }
          [endDate, endTime] = endString.split(" ");
          if (this.end && !dateCompare(this.inputDate, endDate)) {
            endEarlierInputDate = true;
            this.inputDate = endDate;
          }
        }
        if (this.hasTime) {
          if (startLaterInputDate) {
            this.pickerTime = startTime || getDefaultSecond(this.hideSecond);
          }
          if (endEarlierInputDate) {
            this.pickerTime = endTime || getDefaultSecond(this.hideSecond);
          }
          if (!this.pickerTime) {
            this.pickerTime = getTime(Date.now(), this.hideSecond);
          }
          this.displayValue = `${this.inputDate} ${this.pickerTime}`;
        } else {
          this.displayValue = this.inputDate;
        }
        this.setEmit(this.displayValue);
        this.pickerVisible = false;
      },
      leftChange(e) {
        const {
          before,
          after
        } = e.range;
        this.rangeChange(before, after);
        const obj = {
          before: e.range.before,
          after: e.range.after,
          data: e.range.data,
          fulldate: e.fulldate
        };
        this.startMultipleStatus = Object.assign({}, this.startMultipleStatus, obj);
        this.$emit("calendarClick", e);
      },
      rightChange(e) {
        const {
          before,
          after
        } = e.range;
        this.rangeChange(before, after);
        const obj = {
          before: e.range.before,
          after: e.range.after,
          data: e.range.data,
          fulldate: e.fulldate
        };
        this.endMultipleStatus = Object.assign({}, this.endMultipleStatus, obj);
        this.$emit("calendarClick", e);
      },
      mobileChange(e) {
        if (this.isRange) {
          const {
            before,
            after
          } = e.range;
          if (!before) {
            return;
          }
          this.handleStartAndEnd(before, after, true);
          if (this.hasTime) {
            const {
              startTime,
              endTime
            } = e.timeRange;
            this.tempRange.startTime = startTime;
            this.tempRange.endTime = endTime;
          }
          this.confirmRangeChange();
        } else {
          if (this.hasTime) {
            this.displayValue = e.fulldate + " " + e.time;
          } else {
            this.displayValue = e.fulldate;
          }
          this.setEmit(this.displayValue);
        }
        this.$refs.mobile.close();
      },
      rangeChange(before, after) {
        if (!(before && after))
          return;
        this.handleStartAndEnd(before, after, true);
        if (this.hasTime)
          return;
        this.confirmRangeChange();
      },
      confirmRangeChange() {
        if (!this.tempRange.startDate || !this.tempRange.endDate) {
          this.pickerVisible = false;
          return;
        }
        if (!checkDate(this.tempRange.startDate)) {
          this.tempRange.startDate = getDate(Date.now());
        }
        if (!checkDate(this.tempRange.endDate)) {
          this.tempRange.endDate = getDate(Date.now());
        }
        let start, end;
        let startDateLaterRangeStartDate = false;
        let startDateLaterRangeEndDate = false;
        let startDate, startTime;
        if (this.start) {
          let startString = this.start;
          if (typeof this.start === "number") {
            startString = getDateTime(this.start, this.hideSecond);
          }
          [startDate, startTime] = startString.split(" ");
          if (this.start && !dateCompare(this.start, this.tempRange.startDate)) {
            startDateLaterRangeStartDate = true;
            this.tempRange.startDate = startDate;
          }
          if (this.start && !dateCompare(this.start, this.tempRange.endDate)) {
            startDateLaterRangeEndDate = true;
            this.tempRange.endDate = startDate;
          }
        }
        let endDateEarlierRangeStartDate = false;
        let endDateEarlierRangeEndDate = false;
        let endDate, endTime;
        if (this.end) {
          let endString = this.end;
          if (typeof this.end === "number") {
            endString = getDateTime(this.end, this.hideSecond);
          }
          [endDate, endTime] = endString.split(" ");
          if (this.end && !dateCompare(this.tempRange.startDate, this.end)) {
            endDateEarlierRangeStartDate = true;
            this.tempRange.startDate = endDate;
          }
          if (this.end && !dateCompare(this.tempRange.endDate, this.end)) {
            endDateEarlierRangeEndDate = true;
            this.tempRange.endDate = endDate;
          }
        }
        if (!this.hasTime) {
          start = this.displayRangeValue.startDate = this.tempRange.startDate;
          end = this.displayRangeValue.endDate = this.tempRange.endDate;
        } else {
          if (startDateLaterRangeStartDate) {
            this.tempRange.startTime = startTime || getDefaultSecond(this.hideSecond);
          } else if (endDateEarlierRangeStartDate) {
            this.tempRange.startTime = endTime || getDefaultSecond(this.hideSecond);
          }
          if (!this.tempRange.startTime) {
            this.tempRange.startTime = getTime(Date.now(), this.hideSecond);
          }
          if (startDateLaterRangeEndDate) {
            this.tempRange.endTime = startTime || getDefaultSecond(this.hideSecond);
          } else if (endDateEarlierRangeEndDate) {
            this.tempRange.endTime = endTime || getDefaultSecond(this.hideSecond);
          }
          if (!this.tempRange.endTime) {
            this.tempRange.endTime = getTime(Date.now(), this.hideSecond);
          }
          start = this.displayRangeValue.startDate = `${this.tempRange.startDate} ${this.tempRange.startTime}`;
          end = this.displayRangeValue.endDate = `${this.tempRange.endDate} ${this.tempRange.endTime}`;
        }
        if (!dateCompare(start, end)) {
          [start, end] = [end, start];
        }
        this.displayRangeValue.startDate = start;
        this.displayRangeValue.endDate = end;
        const displayRange = [start, end];
        this.setEmit(displayRange);
        this.pickerVisible = false;
      },
      handleStartAndEnd(before, after, temp = false) {
        if (!before)
          return;
        if (!after)
          after = before;
        const type = temp ? "tempRange" : "range";
        const isStartEarlierEnd = dateCompare(before, after);
        this[type].startDate = isStartEarlierEnd ? before : after;
        this[type].endDate = isStartEarlierEnd ? after : before;
      },
      /**
       * 比较时间大小
       */
      dateCompare(startDate, endDate) {
        startDate = new Date(startDate.replace("-", "/").replace("-", "/"));
        endDate = new Date(endDate.replace("-", "/").replace("-", "/"));
        return startDate <= endDate;
      },
      /**
       * 比较时间差
       */
      diffDate(startDate, endDate) {
        startDate = new Date(startDate.replace("-", "/").replace("-", "/"));
        endDate = new Date(endDate.replace("-", "/").replace("-", "/"));
        const diff = (endDate - startDate) / (24 * 60 * 60 * 1e3);
        return Math.abs(diff);
      },
      clear(needEmit = true) {
        if (!this.isRange) {
          this.displayValue = "";
          this.inputDate = "";
          this.pickerTime = "";
          if (this.isPhone) {
            this.$refs.mobile && this.$refs.mobile.clearCalender();
          } else {
            this.$refs.pcSingle && this.$refs.pcSingle.clearCalender();
          }
          if (needEmit) {
            this.$emit("change", "");
            this.$emit("input", "");
            this.$emit("update:modelValue", "");
          }
        } else {
          this.displayRangeValue.startDate = "";
          this.displayRangeValue.endDate = "";
          this.tempRange.startDate = "";
          this.tempRange.startTime = "";
          this.tempRange.endDate = "";
          this.tempRange.endTime = "";
          if (this.isPhone) {
            this.$refs.mobile && this.$refs.mobile.clearCalender();
          } else {
            this.$refs.left && this.$refs.left.clearCalender();
            this.$refs.right && this.$refs.right.clearCalender();
            this.$refs.right && this.$refs.right.changeMonth("next");
          }
          if (needEmit) {
            this.$emit("change", []);
            this.$emit("input", []);
            this.$emit("update:modelValue", []);
          }
        }
      },
      calendarClick(e) {
        this.$emit("calendarClick", e);
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    const _component_time_picker = vue.resolveComponent("time-picker");
    const _component_Calendar = vue.resolveComponent("Calendar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-date" }, [
      vue.createElementVNode("view", {
        class: "uni-date-editor",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.show && $options.show(...args))
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["uni-date-editor--x", { "uni-date-editor--x__disabled": $props.disabled, "uni-date-x--border": $props.border }])
            },
            [
              !$data.isRange ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "uni-date-x uni-date-single"
              }, [
                vue.createVNode(_component_uni_icons, {
                  class: "icon-calendar",
                  type: "calendar",
                  color: "#c0c4cc",
                  size: "22"
                }),
                vue.createElementVNode(
                  "view",
                  { class: "uni-date__x-input" },
                  vue.toDisplayString($data.displayValue || $options.singlePlaceholderText),
                  1
                  /* TEXT */
                )
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "uni-date-x uni-date-range"
              }, [
                vue.createVNode(_component_uni_icons, {
                  class: "icon-calendar",
                  type: "calendar",
                  color: "#c0c4cc",
                  size: "22"
                }),
                vue.createElementVNode(
                  "view",
                  { class: "uni-date__x-input text-center" },
                  vue.toDisplayString($data.displayRangeValue.startDate || $options.startPlaceholderText),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "range-separator" },
                  vue.toDisplayString($props.rangeSeparator),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "uni-date__x-input text-center" },
                  vue.toDisplayString($data.displayRangeValue.endDate || $options.endPlaceholderText),
                  1
                  /* TEXT */
                )
              ])),
              $options.showClearIcon ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "uni-date__icon-clear",
                onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.clear && $options.clear(...args), ["stop"]))
              }, [
                vue.createVNode(_component_uni_icons, {
                  type: "clear",
                  color: "#c0c4cc",
                  size: "22"
                })
              ])) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          )
        ], true)
      ]),
      vue.withDirectives(vue.createElementVNode(
        "view",
        {
          class: "uni-date-mask--pc",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.close && $options.close(...args))
        },
        null,
        512
        /* NEED_PATCH */
      ), [
        [vue.vShow, $data.pickerVisible]
      ]),
      !$data.isPhone ? vue.withDirectives((vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          ref: "datePicker",
          class: "uni-date-picker__container"
        },
        [
          !$data.isRange ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "uni-date-single--x",
              style: vue.normalizeStyle($data.pickerPositionStyle)
            },
            [
              vue.createElementVNode("view", { class: "uni-popper__arrow" }),
              $data.hasTime ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "uni-date-changed popup-x-header"
              }, [
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "uni-date__input text-center",
                  type: "text",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.inputDate = $event),
                  placeholder: $options.selectDateText
                }, null, 8, ["placeholder"]), [
                  [vue.vModelText, $data.inputDate]
                ]),
                vue.createVNode(_component_time_picker, {
                  type: "time",
                  modelValue: $data.pickerTime,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.pickerTime = $event),
                  border: false,
                  disabled: !$data.inputDate,
                  start: $options.timepickerStartTime,
                  end: $options.timepickerEndTime,
                  hideSecond: $props.hideSecond,
                  style: { "width": "100%" }
                }, {
                  default: vue.withCtx(() => [
                    vue.withDirectives(vue.createElementVNode("input", {
                      class: "uni-date__input text-center",
                      type: "text",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.pickerTime = $event),
                      placeholder: $options.selectTimeText,
                      disabled: !$data.inputDate
                    }, null, 8, ["placeholder", "disabled"]), [
                      [vue.vModelText, $data.pickerTime]
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["modelValue", "disabled", "start", "end", "hideSecond"])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createVNode(_component_Calendar, {
                ref: "pcSingle",
                showMonth: false,
                "start-date": $data.calendarRange.startDate,
                "end-date": $data.calendarRange.endDate,
                date: $data.calendarDate,
                onChange: $options.singleChange,
                "default-value": $props.defaultValue,
                style: { "padding": "0 8px" }
              }, null, 8, ["start-date", "end-date", "date", "onChange", "default-value"]),
              $data.hasTime ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "popup-x-footer"
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: "confirm-text",
                    onClick: _cache[6] || (_cache[6] = (...args) => $options.confirmSingleChange && $options.confirmSingleChange(...args))
                  },
                  vue.toDisplayString($options.okText),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ],
            4
            /* STYLE */
          )) : (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 1,
              class: "uni-date-range--x",
              style: vue.normalizeStyle($data.pickerPositionStyle)
            },
            [
              vue.createElementVNode("view", { class: "uni-popper__arrow" }),
              $data.hasTime ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "popup-x-header uni-date-changed"
              }, [
                vue.createElementVNode("view", { class: "popup-x-header--datetime" }, [
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "uni-date__input uni-date-range__input",
                    type: "text",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.tempRange.startDate = $event),
                    placeholder: $options.startDateText
                  }, null, 8, ["placeholder"]), [
                    [vue.vModelText, $data.tempRange.startDate]
                  ]),
                  vue.createVNode(_component_time_picker, {
                    type: "time",
                    modelValue: $data.tempRange.startTime,
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.tempRange.startTime = $event),
                    start: $options.timepickerStartTime,
                    border: false,
                    disabled: !$data.tempRange.startDate,
                    hideSecond: $props.hideSecond
                  }, {
                    default: vue.withCtx(() => [
                      vue.withDirectives(vue.createElementVNode("input", {
                        class: "uni-date__input uni-date-range__input",
                        type: "text",
                        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.tempRange.startTime = $event),
                        placeholder: $options.startTimeText,
                        disabled: !$data.tempRange.startDate
                      }, null, 8, ["placeholder", "disabled"]), [
                        [vue.vModelText, $data.tempRange.startTime]
                      ])
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue", "start", "disabled", "hideSecond"])
                ]),
                vue.createVNode(_component_uni_icons, {
                  type: "arrowthinright",
                  color: "#999",
                  style: { "line-height": "40px" }
                }),
                vue.createElementVNode("view", { class: "popup-x-header--datetime" }, [
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "uni-date__input uni-date-range__input",
                    type: "text",
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.tempRange.endDate = $event),
                    placeholder: $options.endDateText
                  }, null, 8, ["placeholder"]), [
                    [vue.vModelText, $data.tempRange.endDate]
                  ]),
                  vue.createVNode(_component_time_picker, {
                    type: "time",
                    modelValue: $data.tempRange.endTime,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.tempRange.endTime = $event),
                    end: $options.timepickerEndTime,
                    border: false,
                    disabled: !$data.tempRange.endDate,
                    hideSecond: $props.hideSecond
                  }, {
                    default: vue.withCtx(() => [
                      vue.withDirectives(vue.createElementVNode("input", {
                        class: "uni-date__input uni-date-range__input",
                        type: "text",
                        "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.tempRange.endTime = $event),
                        placeholder: $options.endTimeText,
                        disabled: !$data.tempRange.endDate
                      }, null, 8, ["placeholder", "disabled"]), [
                        [vue.vModelText, $data.tempRange.endTime]
                      ])
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue", "end", "disabled", "hideSecond"])
                ])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "popup-x-body" }, [
                vue.createVNode(_component_Calendar, {
                  ref: "left",
                  showMonth: false,
                  "start-date": $data.calendarRange.startDate,
                  "end-date": $data.calendarRange.endDate,
                  range: true,
                  pleStatus: $data.endMultipleStatus,
                  onChange: $options.leftChange,
                  onFirstEnterCale: $options.updateRightCale,
                  style: { "padding": "0 8px" }
                }, null, 8, ["start-date", "end-date", "pleStatus", "onChange", "onFirstEnterCale"]),
                vue.createVNode(_component_Calendar, {
                  ref: "right",
                  showMonth: false,
                  "start-date": $data.calendarRange.startDate,
                  "end-date": $data.calendarRange.endDate,
                  range: true,
                  onChange: $options.rightChange,
                  pleStatus: $data.startMultipleStatus,
                  onFirstEnterCale: $options.updateLeftCale,
                  style: { "padding": "0 8px", "border-left": "1px solid #F1F1F1" }
                }, null, 8, ["start-date", "end-date", "onChange", "pleStatus", "onFirstEnterCale"])
              ]),
              $data.hasTime ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "popup-x-footer"
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    onClick: _cache[13] || (_cache[13] = (...args) => $options.clear && $options.clear(...args))
                  },
                  vue.toDisplayString($options.clearText),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: "confirm-text",
                    onClick: _cache[14] || (_cache[14] = (...args) => $options.confirmRangeChange && $options.confirmRangeChange(...args))
                  },
                  vue.toDisplayString($options.okText),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ],
            4
            /* STYLE */
          ))
        ],
        512
        /* NEED_PATCH */
      )), [
        [vue.vShow, $data.pickerVisible]
      ]) : vue.createCommentVNode("v-if", true),
      $data.isPhone ? (vue.openBlock(), vue.createBlock(_component_Calendar, {
        key: 1,
        ref: "mobile",
        clearDate: false,
        date: $data.calendarDate,
        defTime: $options.mobileCalendarTime,
        "start-date": $data.calendarRange.startDate,
        "end-date": $data.calendarRange.endDate,
        selectableTimes: $options.mobSelectableTime,
        startPlaceholder: $props.startPlaceholder,
        endPlaceholder: $props.endPlaceholder,
        "default-value": $props.defaultValue,
        pleStatus: $data.endMultipleStatus,
        showMonth: false,
        range: $data.isRange,
        hasTime: $data.hasTime,
        insert: false,
        hideSecond: $props.hideSecond,
        onConfirm: $options.mobileChange,
        onMaskClose: $options.close,
        onChange: $options.calendarClick
      }, null, 8, ["date", "defTime", "start-date", "end-date", "selectableTimes", "startPlaceholder", "endPlaceholder", "default-value", "pleStatus", "range", "hasTime", "hideSecond", "onConfirm", "onMaskClose", "onChange"])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-9802168a"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue"]]);
  var pattern = {
    email: /^\S+?@\S+?\.\S+?$/,
    idcard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    url: new RegExp(
      "^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
      "i"
    )
  };
  const FORMAT_MAPPING = {
    "int": "integer",
    "bool": "boolean",
    "double": "number",
    "long": "number",
    "password": "string"
    // "fileurls": 'array'
  };
  function formatMessage(args, resources = "") {
    var defaultMessage = ["label"];
    defaultMessage.forEach((item) => {
      if (args[item] === void 0) {
        args[item] = "";
      }
    });
    let str = resources;
    for (let key in args) {
      let reg = new RegExp("{" + key + "}");
      str = str.replace(reg, args[key]);
    }
    return str;
  }
  function isEmptyValue(value, type) {
    if (value === void 0 || value === null) {
      return true;
    }
    if (typeof value === "string" && !value) {
      return true;
    }
    if (Array.isArray(value) && !value.length) {
      return true;
    }
    if (type === "object" && !Object.keys(value).length) {
      return true;
    }
    return false;
  }
  const types = {
    integer(value) {
      return types.number(value) && parseInt(value, 10) === value;
    },
    string(value) {
      return typeof value === "string";
    },
    number(value) {
      if (isNaN(value)) {
        return false;
      }
      return typeof value === "number";
    },
    "boolean": function(value) {
      return typeof value === "boolean";
    },
    "float": function(value) {
      return types.number(value) && !types.integer(value);
    },
    array(value) {
      return Array.isArray(value);
    },
    object(value) {
      return typeof value === "object" && !types.array(value);
    },
    date(value) {
      return value instanceof Date;
    },
    timestamp(value) {
      if (!this.integer(value) || Math.abs(value).toString().length > 16) {
        return false;
      }
      return true;
    },
    file(value) {
      return typeof value.url === "string";
    },
    email(value) {
      return typeof value === "string" && !!value.match(pattern.email) && value.length < 255;
    },
    url(value) {
      return typeof value === "string" && !!value.match(pattern.url);
    },
    pattern(reg, value) {
      try {
        return new RegExp(reg).test(value);
      } catch (e) {
        return false;
      }
    },
    method(value) {
      return typeof value === "function";
    },
    idcard(value) {
      return typeof value === "string" && !!value.match(pattern.idcard);
    },
    "url-https"(value) {
      return this.url(value) && value.startsWith("https://");
    },
    "url-scheme"(value) {
      return value.startsWith("://");
    },
    "url-web"(value) {
      return false;
    }
  };
  class RuleValidator {
    constructor(message) {
      this._message = message;
    }
    async validateRule(fieldKey, fieldValue, value, data, allData) {
      var result = null;
      let rules = fieldValue.rules;
      let hasRequired = rules.findIndex((item) => {
        return item.required;
      });
      if (hasRequired < 0) {
        if (value === null || value === void 0) {
          return result;
        }
        if (typeof value === "string" && !value.length) {
          return result;
        }
      }
      var message = this._message;
      if (rules === void 0) {
        return message["default"];
      }
      for (var i = 0; i < rules.length; i++) {
        let rule = rules[i];
        let vt = this._getValidateType(rule);
        Object.assign(rule, {
          label: fieldValue.label || `["${fieldKey}"]`
        });
        if (RuleValidatorHelper[vt]) {
          result = RuleValidatorHelper[vt](rule, value, message);
          if (result != null) {
            break;
          }
        }
        if (rule.validateExpr) {
          let now = Date.now();
          let resultExpr = rule.validateExpr(value, allData, now);
          if (resultExpr === false) {
            result = this._getMessage(rule, rule.errorMessage || this._message["default"]);
            break;
          }
        }
        if (rule.validateFunction) {
          result = await this.validateFunction(rule, value, data, allData, vt);
          if (result !== null) {
            break;
          }
        }
      }
      if (result !== null) {
        result = message.TAG + result;
      }
      return result;
    }
    async validateFunction(rule, value, data, allData, vt) {
      let result = null;
      try {
        let callbackMessage = null;
        const res = await rule.validateFunction(rule, value, allData || data, (message) => {
          callbackMessage = message;
        });
        if (callbackMessage || typeof res === "string" && res || res === false) {
          result = this._getMessage(rule, callbackMessage || res, vt);
        }
      } catch (e) {
        result = this._getMessage(rule, e.message, vt);
      }
      return result;
    }
    _getMessage(rule, message, vt) {
      return formatMessage(rule, message || rule.errorMessage || this._message[vt] || message["default"]);
    }
    _getValidateType(rule) {
      var result = "";
      if (rule.required) {
        result = "required";
      } else if (rule.format) {
        result = "format";
      } else if (rule.arrayType) {
        result = "arrayTypeFormat";
      } else if (rule.range) {
        result = "range";
      } else if (rule.maximum !== void 0 || rule.minimum !== void 0) {
        result = "rangeNumber";
      } else if (rule.maxLength !== void 0 || rule.minLength !== void 0) {
        result = "rangeLength";
      } else if (rule.pattern) {
        result = "pattern";
      } else if (rule.validateFunction) {
        result = "validateFunction";
      }
      return result;
    }
  }
  const RuleValidatorHelper = {
    required(rule, value, message) {
      if (rule.required && isEmptyValue(value, rule.format || typeof value)) {
        return formatMessage(rule, rule.errorMessage || message.required);
      }
      return null;
    },
    range(rule, value, message) {
      const {
        range,
        errorMessage
      } = rule;
      let list = new Array(range.length);
      for (let i = 0; i < range.length; i++) {
        const item = range[i];
        if (types.object(item) && item.value !== void 0) {
          list[i] = item.value;
        } else {
          list[i] = item;
        }
      }
      let result = false;
      if (Array.isArray(value)) {
        result = new Set(value.concat(list)).size === list.length;
      } else {
        if (list.indexOf(value) > -1) {
          result = true;
        }
      }
      if (!result) {
        return formatMessage(rule, errorMessage || message["enum"]);
      }
      return null;
    },
    rangeNumber(rule, value, message) {
      if (!types.number(value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      let {
        minimum,
        maximum,
        exclusiveMinimum,
        exclusiveMaximum
      } = rule;
      let min = exclusiveMinimum ? value <= minimum : value < minimum;
      let max = exclusiveMaximum ? value >= maximum : value > maximum;
      if (minimum !== void 0 && min) {
        return formatMessage(rule, rule.errorMessage || message["number"][exclusiveMinimum ? "exclusiveMinimum" : "minimum"]);
      } else if (maximum !== void 0 && max) {
        return formatMessage(rule, rule.errorMessage || message["number"][exclusiveMaximum ? "exclusiveMaximum" : "maximum"]);
      } else if (minimum !== void 0 && maximum !== void 0 && (min || max)) {
        return formatMessage(rule, rule.errorMessage || message["number"].range);
      }
      return null;
    },
    rangeLength(rule, value, message) {
      if (!types.string(value) && !types.array(value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      let min = rule.minLength;
      let max = rule.maxLength;
      let val = value.length;
      if (min !== void 0 && val < min) {
        return formatMessage(rule, rule.errorMessage || message["length"].minLength);
      } else if (max !== void 0 && val > max) {
        return formatMessage(rule, rule.errorMessage || message["length"].maxLength);
      } else if (min !== void 0 && max !== void 0 && (val < min || val > max)) {
        return formatMessage(rule, rule.errorMessage || message["length"].range);
      }
      return null;
    },
    pattern(rule, value, message) {
      if (!types["pattern"](rule.pattern, value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      return null;
    },
    format(rule, value, message) {
      var customTypes = Object.keys(types);
      var format = FORMAT_MAPPING[rule.format] ? FORMAT_MAPPING[rule.format] : rule.format || rule.arrayType;
      if (customTypes.indexOf(format) > -1) {
        if (!types[format](value)) {
          return formatMessage(rule, rule.errorMessage || message.typeError);
        }
      }
      return null;
    },
    arrayTypeFormat(rule, value, message) {
      if (!Array.isArray(value)) {
        return formatMessage(rule, rule.errorMessage || message.typeError);
      }
      for (let i = 0; i < value.length; i++) {
        const element = value[i];
        let formatResult = this.format(rule, element, message);
        if (formatResult !== null) {
          return formatResult;
        }
      }
      return null;
    }
  };
  class SchemaValidator extends RuleValidator {
    constructor(schema, options) {
      super(SchemaValidator.message);
      this._schema = schema;
      this._options = options || null;
    }
    updateSchema(schema) {
      this._schema = schema;
    }
    async validate(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidate(data, false, allData);
      }
      return result.length ? result[0] : null;
    }
    async validateAll(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidate(data, true, allData);
      }
      return result;
    }
    async validateUpdate(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidateUpdate(data, false, allData);
      }
      return result.length ? result[0] : null;
    }
    async invokeValidate(data, all, allData) {
      let result = [];
      let schema = this._schema;
      for (let key in schema) {
        let value = schema[key];
        let errorMessage = await this.validateRule(key, value, data[key], data, allData);
        if (errorMessage != null) {
          result.push({
            key,
            errorMessage
          });
          if (!all)
            break;
        }
      }
      return result;
    }
    async invokeValidateUpdate(data, all, allData) {
      let result = [];
      for (let key in data) {
        let errorMessage = await this.validateRule(key, this._schema[key], data[key], data, allData);
        if (errorMessage != null) {
          result.push({
            key,
            errorMessage
          });
          if (!all)
            break;
        }
      }
      return result;
    }
    _checkFieldInSchema(data) {
      var keys = Object.keys(data);
      var keys2 = Object.keys(this._schema);
      if (new Set(keys.concat(keys2)).size === keys2.length) {
        return "";
      }
      var noExistFields = keys.filter((key) => {
        return keys2.indexOf(key) < 0;
      });
      var errorMessage = formatMessage({
        field: JSON.stringify(noExistFields)
      }, SchemaValidator.message.TAG + SchemaValidator.message["defaultInvalid"]);
      return [{
        key: "invalid",
        errorMessage
      }];
    }
  }
  function Message() {
    return {
      TAG: "",
      default: "验证错误",
      defaultInvalid: "提交的字段{field}在数据库中并不存在",
      validateFunction: "验证无效",
      required: "{label}必填",
      "enum": "{label}超出范围",
      timestamp: "{label}格式无效",
      whitespace: "{label}不能为空",
      typeError: "{label}类型无效",
      date: {
        format: "{label}日期{value}格式无效",
        parse: "{label}日期无法解析,{value}无效",
        invalid: "{label}日期{value}无效"
      },
      length: {
        minLength: "{label}长度不能少于{minLength}",
        maxLength: "{label}长度不能超过{maxLength}",
        range: "{label}必须介于{minLength}和{maxLength}之间"
      },
      number: {
        minimum: "{label}不能小于{minimum}",
        maximum: "{label}不能大于{maximum}",
        exclusiveMinimum: "{label}不能小于等于{minimum}",
        exclusiveMaximum: "{label}不能大于等于{maximum}",
        range: "{label}必须介于{minimum}and{maximum}之间"
      },
      pattern: {
        mismatch: "{label}格式不匹配"
      }
    };
  }
  SchemaValidator.message = new Message();
  const deepCopy = (val) => {
    return JSON.parse(JSON.stringify(val));
  };
  const typeFilter = (format) => {
    return format === "int" || format === "double" || format === "number" || format === "timestamp";
  };
  const getValue = (key, value, rules) => {
    const isRuleNumType = rules.find((val) => val.format && typeFilter(val.format));
    const isRuleBoolType = rules.find((val) => val.format && val.format === "boolean" || val.format === "bool");
    if (!!isRuleNumType) {
      if (!value && value !== 0) {
        value = null;
      } else {
        value = isNumber(Number(value)) ? Number(value) : value;
      }
    }
    if (!!isRuleBoolType) {
      value = isBoolean(value) ? value : false;
    }
    return value;
  };
  const setDataValue = (field, formdata, value) => {
    formdata[field] = value;
    return value || "";
  };
  const getDataValue = (field, data) => {
    return objGet(data, field);
  };
  const realName = (name, data = {}) => {
    const base_name = _basePath(name);
    if (typeof base_name === "object" && Array.isArray(base_name) && base_name.length > 1) {
      const realname = base_name.reduce((a, b) => a += `#${b}`, "_formdata_");
      return realname;
    }
    return base_name[0] || name;
  };
  const isRealName = (name) => {
    const reg = /^_formdata_#*/;
    return reg.test(name);
  };
  const rawData = (object = {}, name) => {
    let newData = JSON.parse(JSON.stringify(object));
    let formData = {};
    for (let i in newData) {
      let path = name2arr(i);
      objSet(formData, path, newData[i]);
    }
    return formData;
  };
  const name2arr = (name) => {
    let field = name.replace("_formdata_#", "");
    field = field.split("#").map((v) => isNumber(v) ? Number(v) : v);
    return field;
  };
  const objSet = (object, path, value) => {
    if (typeof object !== "object")
      return object;
    _basePath(path).reduce((o, k, i, _) => {
      if (i === _.length - 1) {
        o[k] = value;
        return null;
      } else if (k in o) {
        return o[k];
      } else {
        o[k] = /^[0-9]{1,}$/.test(_[i + 1]) ? [] : {};
        return o[k];
      }
    }, object);
    return object;
  };
  function _basePath(path) {
    if (Array.isArray(path))
      return path;
    return path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  }
  const objGet = (object, path, defaultVal = "undefined") => {
    let newPath = _basePath(path);
    let val = newPath.reduce((o, k) => {
      return (o || {})[k];
    }, object);
    return !val || val !== void 0 ? val : defaultVal;
  };
  const isNumber = (num) => {
    return !isNaN(Number(num));
  };
  const isBoolean = (bool) => {
    return typeof bool === "boolean";
  };
  const isRequiredField = (rules) => {
    let isNoField = false;
    for (let i = 0; i < rules.length; i++) {
      const ruleData = rules[i];
      if (ruleData.required) {
        isNoField = true;
        break;
      }
    }
    return isNoField;
  };
  const isEqual = (a, b) => {
    if (a === b) {
      return a !== 0 || 1 / a === 1 / b;
    }
    if (a == null || b == null) {
      return a === b;
    }
    var classNameA = toString.call(a), classNameB = toString.call(b);
    if (classNameA !== classNameB) {
      return false;
    }
    switch (classNameA) {
      case "[object RegExp]":
      case "[object String]":
        return "" + a === "" + b;
      case "[object Number]":
        if (+a !== +a) {
          return +b !== +b;
        }
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case "[object Date]":
      case "[object Boolean]":
        return +a === +b;
    }
    if (classNameA == "[object Object]") {
      var propsA = Object.getOwnPropertyNames(a), propsB = Object.getOwnPropertyNames(b);
      if (propsA.length != propsB.length) {
        return false;
      }
      for (var i = 0; i < propsA.length; i++) {
        var propName = propsA[i];
        if (a[propName] !== b[propName]) {
          return false;
        }
      }
      return true;
    }
    if (classNameA == "[object Array]") {
      if (a.toString() == b.toString()) {
        return true;
      }
      return false;
    }
  };
  const _sfc_main$9 = {
    name: "uniForms",
    emits: ["validate", "submit"],
    options: {
      virtualHost: true
    },
    props: {
      // 即将弃用
      value: {
        type: Object,
        default() {
          return null;
        }
      },
      // vue3 替换 value 属性
      modelValue: {
        type: Object,
        default() {
          return null;
        }
      },
      // 1.4.0 开始将不支持 v-model ，且废弃 value 和 modelValue
      model: {
        type: Object,
        default() {
          return null;
        }
      },
      // 表单校验规则
      rules: {
        type: Object,
        default() {
          return {};
        }
      },
      //校验错误信息提示方式 默认 undertext 取值 [undertext|toast|modal]
      errShowType: {
        type: String,
        default: "undertext"
      },
      // 校验触发器方式 默认 bind 取值 [bind|submit]
      validateTrigger: {
        type: String,
        default: "submit"
      },
      // label 位置，默认 left 取值  top/left
      labelPosition: {
        type: String,
        default: "left"
      },
      // label 宽度
      labelWidth: {
        type: [String, Number],
        default: ""
      },
      // label 居中方式，默认 left 取值 left/center/right
      labelAlign: {
        type: String,
        default: "left"
      },
      border: {
        type: Boolean,
        default: false
      }
    },
    provide() {
      return {
        uniForm: this
      };
    },
    data() {
      return {
        // 表单本地值的记录，不应该与传如的值进行关联
        formData: {},
        formRules: {}
      };
    },
    computed: {
      // 计算数据源变化的
      localData() {
        const localVal = this.model || this.modelValue || this.value;
        if (localVal) {
          return deepCopy(localVal);
        }
        return {};
      }
    },
    watch: {
      // 监听数据变化 ,暂时不使用，需要单独赋值
      // localData: {},
      // 监听规则变化
      rules: {
        handler: function(val, oldVal) {
          this.setRules(val);
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      let getbinddata = getApp().$vm.$.appContext.config.globalProperties.binddata;
      if (!getbinddata) {
        getApp().$vm.$.appContext.config.globalProperties.binddata = function(name, value, formName) {
          if (formName) {
            this.$refs[formName].setValue(name, value);
          } else {
            let formVm;
            for (let i in this.$refs) {
              const vm = this.$refs[i];
              if (vm && vm.$options && vm.$options.name === "uniForms") {
                formVm = vm;
                break;
              }
            }
            if (!formVm)
              return formatAppLog("error", "at uni_modules/uni-forms/components/uni-forms/uni-forms.vue:182", "当前 uni-froms 组件缺少 ref 属性");
            formVm.setValue(name, value);
          }
        };
      }
      this.childrens = [];
      this.inputChildrens = [];
      this.setRules(this.rules);
    },
    methods: {
      /**
       * 外部调用方法
       * 设置规则 ，主要用于小程序自定义检验规则
       * @param {Array} rules 规则源数据
       */
      setRules(rules) {
        this.formRules = Object.assign({}, this.formRules, rules);
        this.validator = new SchemaValidator(rules);
      },
      /**
       * 外部调用方法
       * 设置数据，用于设置表单数据，公开给用户使用 ， 不支持在动态表单中使用
       * @param {Object} key
       * @param {Object} value
       */
      setValue(key, value) {
        let example = this.childrens.find((child) => child.name === key);
        if (!example)
          return null;
        this.formData[key] = getValue(key, value, this.formRules[key] && this.formRules[key].rules || []);
        return example.onFieldChange(this.formData[key]);
      },
      /**
       * 外部调用方法
       * 手动提交校验表单
       * 对整个表单进行校验的方法，参数为一个回调函数。
       * @param {Array} keepitem 保留不参与校验的字段
       * @param {type} callback 方法回调
       */
      validate(keepitem, callback) {
        return this.checkAll(this.formData, keepitem, callback);
      },
      /**
       * 外部调用方法
       * 部分表单校验
       * @param {Array|String} props 需要校验的字段
       * @param {Function} 回调函数
       */
      validateField(props = [], callback) {
        props = [].concat(props);
        let invalidFields = {};
        this.childrens.forEach((item) => {
          const name = realName(item.name);
          if (props.indexOf(name) !== -1) {
            invalidFields = Object.assign({}, invalidFields, {
              [name]: this.formData[name]
            });
          }
        });
        return this.checkAll(invalidFields, [], callback);
      },
      /**
       * 外部调用方法
       * 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
       * @param {Array|String} props 需要移除校验的字段 ，不填为所有
       */
      clearValidate(props = []) {
        props = [].concat(props);
        this.childrens.forEach((item) => {
          if (props.length === 0) {
            item.errMsg = "";
          } else {
            const name = realName(item.name);
            if (props.indexOf(name) !== -1) {
              item.errMsg = "";
            }
          }
        });
      },
      /**
       * 外部调用方法 ，即将废弃
       * 手动提交校验表单
       * 对整个表单进行校验的方法，参数为一个回调函数。
       * @param {Array} keepitem 保留不参与校验的字段
       * @param {type} callback 方法回调
       */
      submit(keepitem, callback, type) {
        for (let i in this.dataValue) {
          const itemData = this.childrens.find((v) => v.name === i);
          if (itemData) {
            if (this.formData[i] === void 0) {
              this.formData[i] = this._getValue(i, this.dataValue[i]);
            }
          }
        }
        if (!type) {
          formatAppLog("warn", "at uni_modules/uni-forms/components/uni-forms/uni-forms.vue:289", "submit 方法即将废弃，请使用validate方法代替！");
        }
        return this.checkAll(this.formData, keepitem, callback, "submit");
      },
      // 校验所有
      async checkAll(invalidFields, keepitem, callback, type) {
        if (!this.validator)
          return;
        let childrens = [];
        for (let i in invalidFields) {
          const item = this.childrens.find((v) => realName(v.name) === i);
          if (item) {
            childrens.push(item);
          }
        }
        if (!callback && typeof keepitem === "function") {
          callback = keepitem;
        }
        let promise;
        if (!callback && typeof callback !== "function" && Promise) {
          promise = new Promise((resolve, reject) => {
            callback = function(valid, invalidFields2) {
              !valid ? resolve(invalidFields2) : reject(valid);
            };
          });
        }
        let results = [];
        let tempFormData = JSON.parse(JSON.stringify(invalidFields));
        for (let i in childrens) {
          const child = childrens[i];
          let name = realName(child.name);
          const result = await child.onFieldChange(tempFormData[name]);
          if (result) {
            results.push(result);
            if (this.errShowType === "toast" || this.errShowType === "modal")
              break;
          }
        }
        if (Array.isArray(results)) {
          if (results.length === 0)
            results = null;
        }
        if (Array.isArray(keepitem)) {
          keepitem.forEach((v) => {
            let vName = realName(v);
            let value = getDataValue(v, this.localData);
            if (value !== void 0) {
              tempFormData[vName] = value;
            }
          });
        }
        if (type === "submit") {
          this.$emit("submit", {
            detail: {
              value: tempFormData,
              errors: results
            }
          });
        } else {
          this.$emit("validate", results);
        }
        let resetFormData = {};
        resetFormData = rawData(tempFormData, this.name);
        callback && typeof callback === "function" && callback(results, resetFormData);
        if (promise && callback) {
          return promise;
        } else {
          return null;
        }
      },
      /**
       * 返回validate事件
       * @param {Object} result
       */
      validateCheck(result) {
        this.$emit("validate", result);
      },
      _getValue: getValue,
      _isRequiredField: isRequiredField,
      _setDataValue: setDataValue,
      _getDataValue: getDataValue,
      _realName: realName,
      _isRealName: isRealName,
      _isEqual: isEqual
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-forms" }, [
      vue.createElementVNode("form", null, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ])
    ]);
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-9a1e3c32"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-forms/components/uni-forms/uni-forms.vue"]]);
  getApp();
  const _sfc_main$8 = {
    data() {
      return {
        baseUrl: this.$baseURL,
        disableBtn: false,
        //是否禁用按钮
        product_list_id: "",
        info: {},
        // 校验表单数据
        formData: {
          title: "",
          price: "",
          desc: "",
          content: "",
          end_time: ""
        },
        // 校验规则
        rules: {
          title: {
            rules: [{
              required: true,
              errorMessage: "标题不能为空"
            }]
          },
          price: {
            rules: [{
              required: true,
              errorMessage: "价格不能为空"
            }, {
              format: "number",
              errorMessage: "价格只能输入数字"
            }]
          },
          desc: {
            rules: [{
              required: true,
              errorMessage: "简介不能为空"
            }]
          },
          content: {
            rules: [{
              required: true,
              errorMessage: "内容不能为空"
            }]
          },
          end_time: {
            rules: [{
              required: true,
              errorMessage: "结束时间不能为空"
            }]
          }
        }
      };
    },
    onLoad(option) {
      let product_list_id = option.id;
      if (product_list_id) {
        this.product_list_id = product_list_id;
        this.getProduct_list_info(product_list_id);
      }
    },
    onUnload() {
    },
    onShow() {
    },
    methods: {
      getProduct_list_info(id) {
        var that = this;
        let param = {
          id
        };
        this.$http.post("/api/v1/My/article_info", param, { custom: { show: false } }).then((res) => {
          that.info = res.info;
          that.formData.title = res.info.title;
          that.formData.price = res.info.price;
          that.formData.desc = res.info.desc;
          that.formData.content = res.info.content;
          that.formData.end_time = res.info.end_time;
        });
      },
      submit(ref) {
        let that = this;
        if (that.disableBtn) {
          formatAppLog("log", "at pages/my/article/add.vue:118", "按钮被禁用，不应执行操作");
        } else {
          formatAppLog("log", "at pages/my/article/add.vue:121", "按钮被启用，执行操作");
          this.$refs[ref].validate().then((res) => {
            formatAppLog("log", "at pages/my/article/add.vue:124", "success", res);
            that.disableBtn = true;
            res.product_list_id = that.product_list_id;
            let param = res;
            this.$http.post("/api/v1/My/add_article", param).then((res2) => {
              formatAppLog("log", "at pages/my/article/add.vue:132", res2);
              if (res2.code == 1) {
                uni.showToast({
                  title: res2.msg,
                  duration: 1e3,
                  success() {
                    setTimeout(() => {
                      uni.navigateBack({
                        delta: 2
                      });
                    }, 1e3);
                  }
                });
              } else {
                uni.showToast({
                  title: res2.msg,
                  icon: "none"
                });
                that.disableBtn = false;
              }
            }).catch((err) => {
              formatAppLog("log", "at pages/my/article/add.vue:155", err);
              uni.showToast({
                title: err.data.msg,
                icon: "none"
              });
              that.disableBtn = false;
            });
          }).catch((err) => {
            formatAppLog("log", "at pages/my/article/add.vue:166", "err", err);
          });
        }
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_easyinput = resolveEasycom(vue.resolveDynamicComponent("uni-easyinput"), __easycom_0);
    const _component_uni_forms_item = resolveEasycom(vue.resolveDynamicComponent("uni-forms-item"), __easycom_1);
    const _component_uni_datetime_picker = resolveEasycom(vue.resolveDynamicComponent("uni-datetime-picker"), __easycom_2$1);
    const _component_uni_forms = resolveEasycom(vue.resolveDynamicComponent("uni-forms"), __easycom_2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "example" }, [
      vue.createCommentVNode(" 基础表单校验 "),
      vue.createVNode(_component_uni_forms, {
        ref: "valiForm",
        rules: $data.rules,
        modelValue: $data.formData
      }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_uni_forms_item, {
            label: "标题",
            required: "",
            name: "title",
            "label-width": 80
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_easyinput, {
                modelValue: $data.formData.title,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.formData.title = $event),
                placeholder: "请输入标题"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_uni_forms_item, {
            label: "价格",
            required: "",
            name: "price",
            "label-width": 80
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_easyinput, {
                type: "digit",
                modelValue: $data.formData.price,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.formData.price = $event),
                placeholder: "请输入价格"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_uni_forms_item, {
            label: "简介",
            required: "",
            name: "desc",
            "label-width": 80
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_easyinput, {
                modelValue: $data.formData.desc,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.formData.desc = $event),
                placeholder: "请输入简介"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_uni_forms_item, {
            label: "内容",
            required: "",
            name: "content",
            "label-width": 80
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_easyinput, {
                type: "textarea",
                modelValue: $data.formData.content,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.formData.content = $event),
                placeholder: "请输入内容"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_uni_forms_item, {
            label: "结束时间",
            required: "",
            name: "end_time",
            "label-width": 80
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_datetime_picker, {
                type: "datetime",
                "return-type": "string",
                modelValue: $data.formData.end_time,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.formData.end_time = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }, 8, ["rules", "modelValue"]),
      vue.createElementVNode("button", {
        type: "primary",
        onClick: _cache[5] || (_cache[5] = ($event) => $options.submit("valiForm")),
        disabled: $data.disableBtn
      }, "提交", 8, ["disabled"])
    ]);
  }
  const PagesMyArticleAdd = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "D:/HbuilderProjects/策略足球/pages/my/article/add.vue"]]);
  getApp();
  const _sfc_main$7 = {
    data() {
      return {
        baseUrl: this.$baseURL,
        userInfo: {},
        orders: []
      };
    },
    onLoad() {
      this.getOrders();
    },
    onUnload() {
    },
    onShow() {
    },
    methods: {
      getOrders() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/My/orders", param, { custom: { show: false } }).then((res) => {
          that.orders = res.orders;
        });
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "user_product_cont" }, [
      $data.orders.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "cont"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.orders, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("navigator", {
              url: "/pages/product/info?zsid=" + item.u_zsid + "&id=" + item.pid,
              class: "list",
              key: index
            }, [
              vue.createElementVNode("view", { class: "tis_cont" }, [
                vue.createElementVNode(
                  "view",
                  { class: "tle" },
                  vue.toDisplayString(item.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "txt" },
                  vue.toDisplayString(item.desc),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "bit_dl" }, [
                vue.createElementVNode(
                  "view",
                  { class: "dt" },
                  vue.toDisplayString(item.createtime),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "dd" },
                  "￥" + vue.toDisplayString(item.price),
                  1
                  /* TEXT */
                )
              ])
            ], 8, ["url"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "pulic_over_bits"
      }, "~暂无数据~"))
    ]);
  }
  const PagesMyOrdersOrders = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "D:/HbuilderProjects/策略足球/pages/my/orders/orders.vue"]]);
  getApp();
  const _sfc_main$6 = {
    data() {
      return {
        baseUrl: this.$baseURL,
        userInfo: {},
        static_img: [],
        chongzhi_jine: [],
        is_show: 0,
        status: 0,
        fangshi: [
          {
            value: "3",
            name: "支付宝",
            checked: "true"
          },
          {
            value: "2",
            name: "微信"
          }
        ],
        current: 0
      };
    },
    onLoad(option) {
      if (!uni.getStorageSync("token")) {
        uni.navigateTo({
          url: "/pages/user_login/login/login"
        });
        return false;
      }
      this.getStaticImg();
      this.getMoneyList();
      this.getUserInfo();
    },
    computed: {},
    onShow() {
    },
    methods: {
      radioChange: function(evt) {
        for (let i = 0; i < this.fangshi.length; i++) {
          if (this.fangshi[i].value === evt.detail.value) {
            this.current = i;
            break;
          }
        }
      },
      dianji(index) {
        this.status = index;
        this.chongzhi_jine[index];
      },
      none_zf() {
        this.is_show = 0;
      },
      show_zf() {
        this.is_show = 1;
      },
      getMoneyList() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/my/getMoneyList", param, {
          custom: {
            show: false
          }
        }).then((res) => {
          that.chongzhi_jine = res.chongzhi_jine;
        });
      },
      getUserInfo() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/my/xinxi", param, {
          custom: {
            show: false
          }
        }).then((res) => {
          that.userInfo = res.userInfo;
        });
      },
      //获取静态图片
      getStaticImg() {
        var that = this;
        let param = {};
        this.$http.post("/api/v1/StaticImg/index", param, {
          custom: {
            show: false
          }
        }).then((res) => {
          that.static_img = res.static_img;
        });
      },
      pay() {
        let fangshi = this.fangshi;
        let current = this.current;
        let type = fangshi[current];
        let chongzhi_jine = this.chongzhi_jine;
        let status = this.status;
        let xzMoney = chongzhi_jine[status];
        formatAppLog("log", "at pages/my/chongzhi/chongzhi.vue:180", type);
        formatAppLog("log", "at pages/my/chongzhi/chongzhi.vue:181", xzMoney);
        this.pay_base(type.value, xzMoney.id);
      },
      pay_base(type = "3", id) {
        let osName = "APP";
        var that = this;
        let param = { id, type, osName };
        this.$http.post("/api/v1/Chongzhi/addChongzhi", param, { custom: { show: true } }).then((res) => {
          var ddh = res.ddh;
          var price = res.price;
          if (res.code == 1) {
            if (type == 2) {
              that.pay_wx(ddh, price);
            } else if (type == 3) {
              that.pay_zfb(ddh, price);
            }
          } else if (res.code == 0) {
            uni.showToast({
              title: res.msg,
              icon: "none"
            });
            return;
          }
        });
      },
      //支付宝支付
      pay_zfb(ddh, price) {
        var that = this;
        let param = {
          ddh,
          price
        };
        uni.getSystemInfo({
          success: function(res) {
            if (res.osName == "android") {
              that.$http.post("/api/v1/PayzfbCz/app", param, {
                custom: {
                  show: true
                }
              }).then((res2) => {
                formatAppLog("log", "at pages/my/chongzhi/chongzhi.vue:291", res2);
                if (res2.code == 0) {
                  uni.showToast({
                    title: res2.msg,
                    icon: "none"
                  });
                  return;
                }
                uni.requestPayment({
                  provider: "alipay",
                  orderInfo: res2,
                  //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
                  success: function(res1) {
                    uni.showToast({
                      title: "付款成功！",
                      duration: 1e3,
                      success() {
                        uni.switchTab({
                          url: "/pages/my/index/index"
                        });
                      }
                    });
                  },
                  fail: function(err) {
                    uni.showToast({
                      title: "取消支付",
                      icon: "none",
                      duration: 1e3
                    });
                  }
                });
              });
            }
          }
        });
      },
      //微信支付
      pay_wx(ddh, price) {
        var that = this;
        let param = {
          ddh,
          price
        };
        uni.getSystemInfo({
          success: function(res) {
            if (res.osName == "android") {
              that.$http.post("/api/v1/PaywxCz/app", param, {
                custom: {
                  show: true
                }
              }).then((res2) => {
                formatAppLog("log", "at pages/my/chongzhi/chongzhi.vue:377", res2);
                if (res2.code == 0) {
                  uni.showToast({
                    title: res2.msg,
                    icon: "none"
                  });
                  return;
                }
                uni.requestPayment({
                  "provider": "wxpay",
                  "orderInfo": {
                    "appid": "wx499********7c70e",
                    // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
                    "noncestr": "c5sEwbaNPiXAF3iv",
                    // 随机字符串
                    "package": "Sign=WXPay",
                    // 固定值
                    "partnerid": "148*****52",
                    // 微信支付商户号
                    "prepayid": "wx202254********************fbe90000",
                    // 统一下单订单号
                    "timestamp": 1597935292,
                    // 时间戳（单位：秒）
                    "sign": "A842B45937F6EFF60DEC7A2EAA52D5A0"
                    // 签名，这里用的 MD5/RSA 签名
                  },
                  success: function(res1) {
                    formatAppLog("log", "at pages/my/chongzhi/chongzhi.vue:397", "success:" + JSON.stringify(res1));
                    uni.showToast({
                      title: "付款成功！",
                      duration: 1e3,
                      success() {
                        uni.switchTab({
                          url: "/pages/my/index/index"
                        });
                      }
                    });
                  },
                  fail: function(err) {
                    formatAppLog("log", "at pages/my/chongzhi/chongzhi.vue:409", "fail:" + JSON.stringify(err));
                    uni.showToast({
                      title: "取消支付",
                      icon: "none",
                      duration: 1e3
                    });
                  }
                });
              });
            }
          }
        });
      },
      wx_jssdk(data, ddh) {
        var that = this;
        jweixin.config({
          debug: false,
          // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId,
          // 必填，公众号的唯一标识
          timestamp: data.timeStamp,
          // 必填，生成签名的时间戳
          nonceStr: data.nonceStr,
          // 必填，生成签名的随机串
          signature: data.paySign,
          // 必填，签名
          jsApiList: ["chooseWXPay"]
        });
        jweixin.chooseWXPay({
          appId: data.appId,
          timestamp: data.timeStamp,
          // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonceStr,
          // 支付签名随机串，不长于 32
          package: data.package,
          // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: data.signType,
          // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySign,
          // 支付签名
          success: function(res) {
            formatAppLog("log", "at pages/my/chongzhi/chongzhi.vue:445", "付款成功！", res);
            let param = {
              ddh
            };
            that.$http.post("/api/v1/Chongzhi/isZhifu", param, {
              custom: {
                show: false
              }
            }).then((res2) => {
              uni.showToast({
                title: "付款成功！",
                duration: 1e3,
                success() {
                  uni.switchTab({
                    url: "/pages/my/index/index"
                  });
                }
              });
            });
          },
          cancel: function(res) {
            uni.showToast({
              title: "付款取消！",
              icon: "none",
              duration: 1e3
            });
          },
          fail: function(res) {
            formatAppLog("log", "at pages/my/chongzhi/chongzhi.vue:474", "付款失败！", res);
            let param = {
              ddh
            };
            that.$http.post("/api/v1/Chongzhi/iddel", param, {
              custom: {
                show: false
              }
            }).then((res2) => {
              uni.showToast({
                title: "付款失败！",
                icon: "error",
                duration: 1e3
              });
            });
          }
        });
      },
      onBridgeReady(data) {
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            // 传入第一步后端接口返回的核心参数
            "appId": data.appId,
            //公众号
            "timeStamp": data.timeStamp,
            //时间戳
            "nonceStr": data.nonceStr,
            //随机串
            "package": data.package,
            //prepay_id
            "signType": data.signType,
            //微信签名方式RSA
            "paySign": data.paySign
            //微信签名
          },
          function(res) {
            formatAppLog("log", "at pages/my/chongzhi/chongzhi.vue:505", res);
            if (res.err_msg == "get_brand_wcpay_request:ok")
              ;
            else {
              uni.showToast({
                title: "支付失败",
                icon: "error"
              });
              return;
            }
          }
        );
      },
      // 检测支付环境中的 WeixinJSBridge
      callpay(data) {
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", this.onBridgeReady(data), false);
          } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady(data));
            document.attachEvent("onWeixinJSBridgeReady", this.onBridgeReady(data));
          }
        } else {
          this.onBridgeReady(data);
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "contain" }, [
      vue.createElementVNode("view", { class: "recharge_head_bg" }),
      vue.createElementVNode("view", { class: "recharge_head_cont" }, [
        vue.createElementVNode("view", { class: "title" }, "余额"),
        vue.createElementVNode("view", { class: "bit_cont" }, [
          vue.createElementVNode(
            "view",
            { class: "price" },
            vue.toDisplayString($data.userInfo.yue),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("image", {
          src: $data.static_img.chongzhi_bg,
          class: "head_i",
          mode: "widthFix"
        }, null, 8, ["src"])
      ]),
      vue.createElementVNode("view", { class: "recharge_data_content" }, [
        vue.createElementVNode("view", { class: "title_head" }, [
          vue.createElementVNode("view", { class: "line" }),
          vue.createTextVNode(" 充值金额 ")
        ]),
        vue.createElementVNode("view", { class: "pri_last" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.chongzhi_jine, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["list", index == $data.status ? "active" : ""]),
                key: index,
                onClick: ($event) => $options.dianji(index)
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "tle" },
                  vue.toDisplayString(item.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "txt" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.money),
                    1
                    /* TEXT */
                  ),
                  vue.createTextVNode("元")
                ]),
                item.money_fan > 0 ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "tips"
                  },
                  "送" + vue.toDisplayString(item.money_fan),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(' <view class="recharge_bits">\r\n			<view class="tle">温馨提示:</view>\r\n			<view class="txt">1、鲸猜足球非购彩平台，红币一经充值成功，只可用于购买专家方案，不支持提现、购彩等操作</view>\r\n			<view class="txt">2、红币充值和消费过程上遇到问题，请及时联系客服。</view>\r\n			<view class="txt">3、严禁未满18周岁的未成年人参与购买方案。</view>\r\n		</view>\r\n		<view class="recharge_xy">\r\n			<checkbox value="" />\r\n			支付即表示同意 <navigator url="">《鲸猜足球用户购买协议》</navigator>  \r\n		</view> '),
      $data.is_show == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "foot_buy_cont"
      }, [
        vue.createElementVNode("view", { class: "cont" }, [
          vue.createElementVNode("view", {
            class: "btn",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.show_zf())
          }, "立即充值")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.is_show == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "buy_sele_dc active"
      }, [
        vue.createElementVNode("view", { class: "cont" }, [
          vue.createElementVNode("view", { class: "shut_btn" }, [
            vue.createElementVNode("image", {
              src: _imports_0,
              mode: "widthFix",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.none_zf())
            })
          ]),
          vue.createElementVNode("view", { class: "title_head" }, "支付选择"),
          vue.createElementVNode(
            "radio-group",
            {
              onChange: _cache[2] || (_cache[2] = (...args) => $options.radioChange && $options.radioChange(...args))
            },
            [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.fangshi, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("label", {
                    class: "dl_last",
                    key: item.value
                  }, [
                    vue.createElementVNode(
                      "view",
                      null,
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", null, [
                      vue.createElementVNode("radio", {
                        value: item.value,
                        checked: index === $data.current
                      }, null, 8, ["value", "checked"])
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ],
            32
            /* NEED_HYDRATION */
          ),
          vue.createElementVNode("view", {
            class: "buy_btn",
            onClick: _cache[3] || (_cache[3] = ($event) => $options.pay())
          }, "确认支付")
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesMyChongzhiChongzhi = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-9889ee8a"], ["__file", "D:/HbuilderProjects/策略足球/pages/my/chongzhi/chongzhi.vue"]]);
  getApp();
  const _sfc_main$5 = {
    data() {
      return {
        baseUrl: this.$baseURL,
        disableBtn: false,
        //是否禁用按钮
        // 校验表单数据
        userInfo: {},
        // 校验规则
        rules: {
          password: {
            rules: [{
              required: true,
              errorMessage: "密码不能为空"
            }]
          }
        }
      };
    },
    onLoad() {
      this.getMy();
    },
    onUnload() {
    },
    onShow() {
    },
    methods: {
      getMy() {
        var that = this;
        let param = {
          // rememberMe: true
        };
        this.$http.post("/api/v1/My/xinxi", param, { custom: { show: false } }).then((res) => {
          that.userInfo = res.userInfo;
          that.userInfo.password = "";
        });
      },
      submit(ref) {
        let that = this;
        if (that.disableBtn) {
          formatAppLog("log", "at pages/my/xiugai/xiugai.vue:69", "按钮被禁用，不应执行操作");
        } else {
          formatAppLog("log", "at pages/my/xiugai/xiugai.vue:72", "按钮被启用，执行操作");
          this.$refs[ref].validate().then((res) => {
            formatAppLog("log", "at pages/my/xiugai/xiugai.vue:75", "success", res);
            that.disableBtn = true;
            let param = res;
            this.$http.post("/api/v1/My/xiugai", param).then((res2) => {
              formatAppLog("log", "at pages/my/xiugai/xiugai.vue:80", res2);
              if (res2.code == 1) {
                uni.showToast({
                  title: res2.msg,
                  duration: 1e3,
                  success() {
                    setTimeout(() => {
                      uni.navigateBack({
                        delta: 1
                      });
                    }, 1e3);
                  }
                });
              } else {
                uni.showToast({
                  title: res2.msg,
                  icon: "none"
                });
                that.disableBtn = false;
              }
            }).catch((err) => {
              formatAppLog("log", "at pages/my/xiugai/xiugai.vue:102", err);
              uni.showToast({
                title: err.data.msg,
                icon: "none"
              });
              that.disableBtn = false;
            });
          }).catch((err) => {
            formatAppLog("log", "at pages/my/xiugai/xiugai.vue:111", "err", err);
          });
        }
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_easyinput = resolveEasycom(vue.resolveDynamicComponent("uni-easyinput"), __easycom_0);
    const _component_uni_forms_item = resolveEasycom(vue.resolveDynamicComponent("uni-forms-item"), __easycom_1);
    const _component_uni_forms = resolveEasycom(vue.resolveDynamicComponent("uni-forms"), __easycom_2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "example" }, [
      vue.createCommentVNode(" 基础表单校验 "),
      vue.createVNode(_component_uni_forms, {
        ref: "valiForm",
        rules: $data.rules,
        modelValue: $data.userInfo
      }, {
        default: vue.withCtx(() => [
          vue.createCommentVNode(' <uni-forms-item label="姓名" required name="username" :label-width="80">\r\n				<uni-easyinput type="text" v-model="userInfo.username" placeholder="请输入姓名" disabled=""/>\r\n			</uni-forms-item> '),
          vue.createVNode(_component_uni_forms_item, {
            label: "手机号",
            required: "",
            name: "tel",
            "label-width": 80
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_easyinput, {
                type: "text",
                modelValue: $data.userInfo.tel,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.userInfo.tel = $event),
                placeholder: "请输入手机号",
                disabled: ""
              }, null, 8, ["modelValue"])
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_uni_forms_item, {
            label: "密码",
            required: "",
            name: "password",
            "label-width": 80
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_easyinput, {
                type: "password",
                modelValue: $data.userInfo.password,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.userInfo.password = $event),
                placeholder: "请输入密码"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }, 8, ["rules", "modelValue"]),
      vue.createElementVNode("button", {
        type: "primary",
        onClick: _cache[2] || (_cache[2] = ($event) => $options.submit("valiForm")),
        disabled: $data.disableBtn
      }, "修改", 8, ["disabled"])
    ]);
  }
  const PagesMyXiugaiXiugai = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "D:/HbuilderProjects/策略足球/pages/my/xiugai/xiugai.vue"]]);
  getApp();
  const _sfc_main$4 = {
    data() {
      return {
        baseUrl: this.$baseURL,
        info: {}
      };
    },
    onLoad(option) {
      let type = option.type;
      this.getXieyi(type);
    },
    computed: {},
    onShow() {
    },
    methods: {
      getXieyi(type) {
        var that = this;
        let param = { type };
        this.$http.post("/api/v1/Xinxi/xieyi", param, { custom: { show: false } }).then((res) => {
          that.info = res.info;
          let title = res.title;
          uni.setNavigationBarTitle({
            title
          });
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "contain" }, [
      vue.createElementVNode("view", { class: "detail_head" }, [
        vue.createElementVNode(
          "view",
          { class: "tle" },
          vue.toDisplayString($data.info.title),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "strat_detail" }, [
        vue.createElementVNode("rich-text", {
          class: "det_inf",
          nodes: $data.info.content
        }, null, 8, ["nodes"])
      ])
    ]);
  }
  const PagesXinxiXieyi = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/HbuilderProjects/策略足球/pages/xinxi/xieyi.vue"]]);
  const _sfc_main$3 = {
    name: "UniSection",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        required: true,
        default: ""
      },
      titleFontSize: {
        type: String,
        default: "14px"
      },
      titleColor: {
        type: String,
        default: "#333"
      },
      subTitle: {
        type: String,
        default: ""
      },
      subTitleFontSize: {
        type: String,
        default: "12px"
      },
      subTitleColor: {
        type: String,
        default: "#999"
      },
      padding: {
        type: [Boolean, String],
        default: false
      }
    },
    computed: {
      _padding() {
        if (typeof this.padding === "string") {
          return this.padding;
        }
        return this.padding ? "10px" : "";
      }
    },
    watch: {
      title(newVal) {
        if (uni.report && newVal !== "") {
          uni.report("title", newVal);
        }
      }
    },
    methods: {
      onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-section" }, [
      vue.createElementVNode("view", {
        class: "uni-section-header",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
      }, [
        $props.type ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["uni-section-header__decoration", $props.type])
          },
          null,
          2
          /* CLASS */
        )) : vue.renderSlot(_ctx.$slots, "decoration", { key: 1 }, void 0, true),
        vue.createElementVNode("view", { class: "uni-section-header__content" }, [
          vue.createElementVNode(
            "text",
            {
              style: vue.normalizeStyle({ "font-size": $props.titleFontSize, "color": $props.titleColor }),
              class: vue.normalizeClass(["uni-section__content-title", { "distraction": !$props.subTitle }])
            },
            vue.toDisplayString($props.title),
            7
            /* TEXT, CLASS, STYLE */
          ),
          $props.subTitle ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              style: vue.normalizeStyle({ "font-size": $props.subTitleFontSize, "color": $props.subTitleColor }),
              class: "uni-section-header__content-sub"
            },
            vue.toDisplayString($props.subTitle),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "uni-section-header__slot-right" }, [
          vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
        ])
      ]),
      vue.createElementVNode(
        "view",
        {
          class: "uni-section-content",
          style: vue.normalizeStyle({ padding: $options._padding })
        },
        [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-637fd36b"], ["__file", "D:/HbuilderProjects/策略足球/uni_modules/uni-section/components/uni-section/uni-section.vue"]]);
  getApp();
  const _sfc_main$2 = {
    data() {
      return {
        baseUrl: this.$baseURL,
        is_fasing: 0,
        shijian: 60,
        show_mm: false,
        //默认登录界面 false 验证码，true 密码
        disableBtn: false,
        //是否禁用按钮
        tongyi: "",
        // 校验表单数据
        formData: {
          tel: "",
          pwd: "",
          yzm: ""
        },
        // 校验规则
        rules: {
          tel: {
            rules: [{
              required: true,
              errorMessage: "手机号不能为空"
            }]
          },
          pwd: {
            rules: [{
              required: true,
              errorMessage: "密码不能为空"
            }]
          },
          yzm: {
            rules: [{
              required: true,
              errorMessage: "验证码不能为空"
            }]
          }
        }
      };
    },
    onLoad() {
    },
    onUnload() {
    },
    onShow() {
      if (uni.getStorageSync("token")) {
        uni.switchTab({
          url: "/pages/index/index"
        });
      }
    },
    methods: {
      qiehuan(val) {
        this.show_mm = val;
        if (val == true) {
          this.formData.pwd = "";
        } else if (val == false) {
          this.formData.yzm = "";
        }
      },
      checkboxChange(e) {
        this.tongyi = e.detail.value;
      },
      submit(ref) {
        let that = this;
        if (that.disableBtn) {
          formatAppLog("log", "at pages/user_login/login/login.vue:124", "按钮被禁用，不应执行操作");
        } else {
          formatAppLog("log", "at pages/user_login/login/login.vue:127", "按钮被启用，执行操作");
          this.$refs[ref].validate().then((res) => {
            if (that.tongyi != 1) {
              uni.showToast({
                title: "请先勾选协议",
                icon: "none"
              });
              return;
            }
            formatAppLog("log", "at pages/user_login/login/login.vue:139", "success", res);
            that.disableBtn = true;
            res.openid = uni.getStorageSync("openid");
            let param = res;
            this.$http.post("/api/v1/login/login", param).then((res2) => {
              formatAppLog("log", "at pages/user_login/login/login.vue:147", res2);
              if (res2.code == 1) {
                uni.setStorageSync("token", res2.token);
                uni.setStorageSync("refresh_token", res2.refresh_token);
                uni.showToast({
                  title: res2.msg,
                  duration: 1e3,
                  success() {
                    setTimeout(() => {
                      uni.switchTab({
                        url: "/pages/my/index/index"
                      });
                    }, 1e3);
                  }
                });
              } else {
                formatAppLog("log", "at pages/user_login/login/login.vue:165", 1111);
                uni.showToast({
                  title: res2.msg,
                  icon: "none"
                });
                that.disableBtn = false;
              }
            }).catch((err) => {
              formatAppLog("log", "at pages/user_login/login/login.vue:174", err);
              uni.showToast({
                title: err.data.msg,
                icon: "none"
              });
              that.disableBtn = false;
            });
          }).catch((err) => {
            formatAppLog("log", "at pages/user_login/login/login.vue:183", "err", err);
          });
        }
      },
      //倒计时
      djs() {
        this.is_fasing = 1;
        const timer = setInterval(() => {
          if (this.shijian <= 0) {
            clearInterval(timer);
            this.is_fasing = 0;
            this.shijian = 60;
          } else {
            this.shijian--;
          }
        }, 1e3);
      },
      sendYzm() {
        let tel = this.formData.tel;
        if (tel.length != 11) {
          uni.showToast({
            title: "手机号错误！",
            icon: "error",
            duration: 1e3
          });
          return;
        }
        let param = {
          tel
        };
        this.$http.post("/api/v1/Duanxin/set_info", param, { custom: { show: false } }).then((res) => {
          if (res.code == 1) {
            this.djs();
            uni.showToast({
              title: res.msg,
              icon: "success",
              duration: 1e3
            });
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 1e3
            });
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_easyinput = resolveEasycom(vue.resolveDynamicComponent("uni-easyinput"), __easycom_0);
    const _component_uni_forms_item = resolveEasycom(vue.resolveDynamicComponent("uni-forms-item"), __easycom_1);
    const _component_uni_forms = resolveEasycom(vue.resolveDynamicComponent("uni-forms"), __easycom_2);
    const _component_uni_section = resolveEasycom(vue.resolveDynamicComponent("uni-section"), __easycom_3);
    return vue.openBlock(), vue.createBlock(_component_uni_section, {
      title: "验证码登录",
      type: "line"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "example" }, [
          vue.createCommentVNode(" 基础表单校验 "),
          vue.createVNode(_component_uni_forms, {
            ref: "valiForm",
            rules: $data.rules,
            modelValue: $data.formData
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_forms_item, {
                label: "手机号",
                required: "",
                name: "tel",
                "label-width": 80
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_uni_easyinput, {
                    type: "number",
                    modelValue: $data.formData.tel,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.formData.tel = $event),
                    placeholder: "请输入手机号"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createCommentVNode(' <uni-notice-bar text="密码或验证码二选一填写登录" /> '),
              $data.show_mm == true ? (vue.openBlock(), vue.createBlock(_component_uni_forms_item, {
                key: 0,
                label: "密码",
                name: "pwd",
                "label-width": 80
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_uni_easyinput, {
                    type: "password",
                    modelValue: $data.formData.pwd,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.formData.pwd = $event),
                    placeholder: "请输入密码"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
                /* STABLE */
              })) : vue.createCommentVNode("v-if", true),
              $data.show_mm == false ? (vue.openBlock(), vue.createBlock(_component_uni_forms_item, {
                key: 1,
                label: "验证码",
                name: "yzm",
                "label-width": 80,
                class: "yzmBox"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_uni_easyinput, {
                    maxlength: "6",
                    type: "number",
                    modelValue: $data.formData.yzm,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.formData.yzm = $event),
                    placeholder: "请输入验证码",
                    style: { "width": "300rpx" }
                  }, null, 8, ["modelValue"]),
                  $data.is_fasing == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "sendYzm",
                    onClick: _cache[3] || (_cache[3] = ($event) => $options.sendYzm())
                  }, "发送验证码")) : (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 1,
                      class: "sendYzm djsBtn"
                    },
                    vue.toDisplayString($data.shijian),
                    1
                    /* TEXT */
                  ))
                ]),
                _: 1
                /* STABLE */
              })) : vue.createCommentVNode("v-if", true),
              vue.createVNode(_component_uni_forms_item, { name: "tongyi" }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "yhxy_cont" }, [
                    vue.createElementVNode(
                      "checkbox-group",
                      {
                        onChange: _cache[4] || (_cache[4] = (...args) => $options.checkboxChange && $options.checkboxChange(...args))
                      },
                      [
                        vue.createElementVNode("checkbox", {
                          class: "yhxy_check",
                          value: "1"
                        })
                      ],
                      32
                      /* NEED_HYDRATION */
                    ),
                    vue.createTextVNode(" 我已阅读并同意 "),
                    vue.createElementVNode("navigator", {
                      class: "cor_1",
                      url: "/pages/xinxi/xieyi?type=1"
                    }, "《用户服务条款》"),
                    vue.createTextVNode(" 和 "),
                    vue.createElementVNode("navigator", {
                      class: "cor_1",
                      url: "/pages/xinxi/xieyi?type=2"
                    }, "《隐私协议》")
                  ])
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }, 8, ["rules", "modelValue"]),
          vue.createElementVNode("view"),
          vue.createElementVNode("button", {
            type: "primary",
            onClick: _cache[5] || (_cache[5] = ($event) => $options.submit("valiForm")),
            disabled: $data.disableBtn
          }, "提交", 8, ["disabled"]),
          $data.show_mm == false ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "qh_login_btn",
            onClick: _cache[6] || (_cache[6] = ($event) => $options.qiehuan(true))
          }, "切换为密码登录")) : vue.createCommentVNode("v-if", true),
          $data.show_mm == true ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "qh_login_btn",
            onClick: _cache[7] || (_cache[7] = ($event) => $options.qiehuan(false))
          }, "切换为验证码登录")) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createCommentVNode(' <view class="regBox">\r\n			<navigator url="/pages/user_login/register/register" class="registerBtn">还没有账号？去注册</navigator>\r\n		</view> ')
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesUserLoginLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/HbuilderProjects/策略足球/pages/user_login/login/login.vue"]]);
  getApp();
  const _sfc_main$1 = {
    data() {
      return {
        baseUrl: this.$baseURL,
        is_fasing: 0,
        shijian: 60,
        disableBtn: false,
        //是否禁用按钮
        // 校验表单数据
        formData: {
          tel: "",
          pwd: "",
          yzm: ""
        },
        // 校验规则
        rules: {
          tel: {
            rules: [{
              required: true,
              errorMessage: "手机号不能为空"
            }]
          },
          pwd: {
            rules: [{
              required: true,
              errorMessage: "密码不能为空"
            }]
          },
          yzm: {
            rules: [{
              required: true,
              errorMessage: "验证码不能为空"
            }]
          }
        }
      };
    },
    onLoad() {
    },
    onUnload() {
    },
    onShow() {
      if (uni.getStorageSync("token")) {
        uni.switchTab({
          url: "/pages/index/index"
        });
      }
    },
    methods: {
      submit(ref) {
        let that = this;
        if (that.disableBtn) {
          formatAppLog("log", "at pages/user_login/register/register.vue:86", "按钮被禁用，不应执行操作");
        } else {
          formatAppLog("log", "at pages/user_login/register/register.vue:89", "按钮被启用，执行操作");
          this.$refs[ref].validate().then((res) => {
            formatAppLog("log", "at pages/user_login/register/register.vue:92", "success", res);
            that.disableBtn = true;
            let param = res;
            this.$http.post("/api/v1/login/register", param).then((res2) => {
              formatAppLog("log", "at pages/user_login/register/register.vue:97", res2);
              if (res2.code == 1) {
                uni.showToast({
                  title: res2.msg,
                  duration: 1e3,
                  success() {
                    setTimeout(() => {
                      uni.navigateBack({
                        delta: 1
                      });
                    }, 1e3);
                  }
                });
              } else {
                uni.showToast({
                  title: res2.msg,
                  icon: "none"
                });
                that.disableBtn = false;
              }
            }).catch((err) => {
              formatAppLog("log", "at pages/user_login/register/register.vue:120", err);
              uni.showToast({
                title: err.data.msg,
                icon: "none"
              });
              that.disableBtn = false;
            });
          }).catch((err) => {
            formatAppLog("log", "at pages/user_login/register/register.vue:129", "err", err);
          });
        }
      },
      //倒计时
      djs() {
        this.is_fasing = 1;
        const timer = setInterval(() => {
          if (this.shijian <= 0) {
            clearInterval(timer);
            this.is_fasing = 0;
            this.shijian = 60;
          } else {
            this.shijian--;
          }
        }, 1e3);
      },
      sendYzm() {
        let tel = this.formData.tel;
        if (tel.length != 11) {
          uni.showToast({
            title: "手机号错误！",
            icon: "error",
            duration: 1e3
          });
          return;
        }
        let param = {
          tel
        };
        this.$http.post("/api/v1/Duanxin/set_info", param, { custom: { show: false } }).then((res) => {
          if (res.code == 1) {
            this.djs();
            uni.showToast({
              title: res.msg,
              icon: "success",
              duration: 1e3
            });
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 1e3
            });
          }
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_easyinput = resolveEasycom(vue.resolveDynamicComponent("uni-easyinput"), __easycom_0);
    const _component_uni_forms_item = resolveEasycom(vue.resolveDynamicComponent("uni-forms-item"), __easycom_1);
    const _component_uni_forms = resolveEasycom(vue.resolveDynamicComponent("uni-forms"), __easycom_2);
    const _component_uni_section = resolveEasycom(vue.resolveDynamicComponent("uni-section"), __easycom_3);
    return vue.openBlock(), vue.createBlock(_component_uni_section, {
      title: "用户注册",
      type: "line"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "example" }, [
          vue.createCommentVNode(" 基础表单校验 "),
          vue.createVNode(_component_uni_forms, {
            ref: "valiForm",
            rules: $data.rules,
            modelValue: $data.formData
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_forms_item, {
                label: "手机号",
                required: "",
                name: "tel",
                "label-width": 80
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_uni_easyinput, {
                    type: "number",
                    modelValue: $data.formData.tel,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.formData.tel = $event),
                    placeholder: "请输入手机号"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_uni_forms_item, {
                label: "密码",
                required: "",
                name: "pwd",
                "label-width": 80
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_uni_easyinput, {
                    type: "password",
                    modelValue: $data.formData.pwd,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.formData.pwd = $event),
                    placeholder: "请输入密码"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_uni_forms_item, {
                label: "验证码",
                required: "",
                name: "yzm",
                "label-width": 80,
                class: "yzmBox"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_uni_easyinput, {
                    maxlength: "6",
                    type: "number",
                    modelValue: $data.formData.yzm,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.formData.yzm = $event),
                    placeholder: "请输入验证码",
                    style: { "width": "300rpx" }
                  }, null, 8, ["modelValue"]),
                  $data.is_fasing == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "sendYzm",
                    onClick: _cache[3] || (_cache[3] = ($event) => $options.sendYzm())
                  }, "发送验证码")) : (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 1,
                      class: "sendYzm djsBtn"
                    },
                    vue.toDisplayString($data.shijian),
                    1
                    /* TEXT */
                  ))
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }, 8, ["rules", "modelValue"]),
          vue.createElementVNode("button", {
            type: "primary",
            onClick: _cache[4] || (_cache[4] = ($event) => $options.submit("valiForm")),
            disabled: $data.disableBtn
          }, "注册", 8, ["disabled"])
        ])
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesUserLoginRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/HbuilderProjects/策略足球/pages/user_login/register/register.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/product/lists", PagesProductLists);
  __definePage("pages/product/info", PagesProductInfo);
  __definePage("pages/my/index/index", PagesMyIndexIndex);
  __definePage("pages/my/article/article", PagesMyArticleArticle);
  __definePage("pages/my/article/add", PagesMyArticleAdd);
  __definePage("pages/my/orders/orders", PagesMyOrdersOrders);
  __definePage("pages/my/chongzhi/chongzhi", PagesMyChongzhiChongzhi);
  __definePage("pages/my/xiugai/xiugai", PagesMyXiugaiXiugai);
  __definePage("pages/xinxi/xieyi", PagesXinxiXieyi);
  __definePage("pages/user_login/login/login", PagesUserLoginLoginLogin);
  __definePage("pages/user_login/register/register", PagesUserLoginRegisterRegister);
  var toString$1 = Object.prototype.toString;
  function isArray(val) {
    return toString$1.call(val) === "[object Array]";
  }
  function isObject(val) {
    return val !== null && typeof val === "object";
  }
  function isDate(val) {
    return toString$1.call(val) === "[object Date]";
  }
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
  }
  function forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  }
  function deepMerge() {
    let result = {};
    function assignValue(val, key) {
      if (typeof result[key] === "object" && typeof val === "object") {
        result[key] = deepMerge(result[key], val);
      } else if (typeof val === "object") {
        result[key] = deepMerge({}, val);
      } else {
        result[key] = val;
      }
    }
    for (let i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }
  function isUndefined(val) {
    return typeof val === "undefined";
  }
  function encode(val) {
    return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url, params, paramsSerializer) {
    if (!params) {
      return url;
    }
    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }
        forEach(val, function parseValue(v) {
          if (isDate(v)) {
            v = v.toISOString();
          } else if (isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + "=" + encode(v));
        });
      });
      serializedParams = parts.join("&");
    }
    if (serializedParams) {
      var hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  function combineURLs(baseURL2, relativeURL) {
    return relativeURL ? baseURL2.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL2;
  }
  function buildFullPath(baseURL2, requestedURL) {
    if (baseURL2 && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL2, requestedURL);
    }
    return requestedURL;
  }
  function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    const status = response.statusCode;
    if (status && (!validateStatus || validateStatus(status))) {
      resolve(response);
    } else {
      reject(response);
    }
  }
  const mergeKeys$1 = (keys, config2) => {
    let config = {};
    keys.forEach((prop) => {
      if (!isUndefined(config2[prop])) {
        config[prop] = config2[prop];
      }
    });
    return config;
  };
  const adapter = (config) => {
    return new Promise((resolve, reject) => {
      let fullPath = buildURL(buildFullPath(config.baseURL, config.url), config.params, config.paramsSerializer);
      const _config = {
        url: fullPath,
        header: config.header,
        complete: (response) => {
          config.fullPath = fullPath;
          response.config = config;
          response.rawData = response.data;
          try {
            let jsonParseHandle = false;
            const forcedJSONParsingType = typeof config.forcedJSONParsing;
            if (forcedJSONParsingType === "boolean") {
              jsonParseHandle = config.forcedJSONParsing;
            } else if (forcedJSONParsingType === "object") {
              const includesMethod = config.forcedJSONParsing.include || [];
              jsonParseHandle = includesMethod.includes(config.method);
            }
            if (jsonParseHandle && typeof response.data === "string") {
              response.data = JSON.parse(response.data);
            }
          } catch (e) {
          }
          settle(resolve, reject, response);
        }
      };
      let requestTask;
      if (config.method === "UPLOAD") {
        delete _config.header["content-type"];
        delete _config.header["Content-Type"];
        let otherConfig = {
          filePath: config.filePath,
          name: config.name
        };
        const optionalKeys = [
          "files",
          "timeout",
          "formData"
        ];
        requestTask = uni.uploadFile({ ..._config, ...otherConfig, ...mergeKeys$1(optionalKeys, config) });
      } else if (config.method === "DOWNLOAD") {
        const optionalKeys = [
          "timeout"
        ];
        requestTask = uni.downloadFile({ ..._config, ...mergeKeys$1(optionalKeys, config) });
      } else {
        const optionalKeys = [
          "data",
          "method",
          "timeout",
          "dataType",
          "responseType",
          "sslVerify",
          "firstIpv4"
        ];
        requestTask = uni.request({ ..._config, ...mergeKeys$1(optionalKeys, config) });
      }
      if (config.getTask) {
        config.getTask(requestTask, config);
      }
    });
  };
  const dispatchRequest = (config) => {
    return adapter(config);
  };
  function InterceptorManager() {
    this.handlers = [];
  }
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    });
    return this.handlers.length - 1;
  };
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
  InterceptorManager.prototype.forEach = function forEach2(fn) {
    this.handlers.forEach((h) => {
      if (h !== null) {
        fn(h);
      }
    });
  };
  const mergeKeys = (keys, globalsConfig, config2) => {
    let config = {};
    keys.forEach((prop) => {
      if (!isUndefined(config2[prop])) {
        config[prop] = config2[prop];
      } else if (!isUndefined(globalsConfig[prop])) {
        config[prop] = globalsConfig[prop];
      }
    });
    return config;
  };
  const mergeConfig = (globalsConfig, config2 = {}) => {
    const method = config2.method || globalsConfig.method || "GET";
    let config = {
      baseURL: config2.baseURL || globalsConfig.baseURL || "",
      method,
      url: config2.url || "",
      params: config2.params || {},
      custom: { ...globalsConfig.custom || {}, ...config2.custom || {} },
      header: deepMerge(globalsConfig.header || {}, config2.header || {})
    };
    const defaultToConfig2Keys = ["getTask", "validateStatus", "paramsSerializer", "forcedJSONParsing"];
    config = { ...config, ...mergeKeys(defaultToConfig2Keys, globalsConfig, config2) };
    if (method === "DOWNLOAD") {
      const downloadKeys = [
        "timeout"
      ];
      config = { ...config, ...mergeKeys(downloadKeys, globalsConfig, config2) };
    } else if (method === "UPLOAD") {
      delete config.header["content-type"];
      delete config.header["Content-Type"];
      const uploadKeys = [
        "files",
        "filePath",
        "name",
        "timeout",
        "formData"
      ];
      uploadKeys.forEach((prop) => {
        if (!isUndefined(config2[prop])) {
          config[prop] = config2[prop];
        }
      });
      if (isUndefined(config.timeout) && !isUndefined(globalsConfig.timeout)) {
        config["timeout"] = globalsConfig["timeout"];
      }
    } else {
      const defaultsKeys = [
        "data",
        "timeout",
        "dataType",
        "responseType",
        "sslVerify",
        "firstIpv4"
      ];
      config = { ...config, ...mergeKeys(defaultsKeys, globalsConfig, config2) };
    }
    return config;
  };
  const defaults = {
    baseURL: "",
    header: {},
    method: "GET",
    dataType: "json",
    paramsSerializer: null,
    responseType: "text",
    custom: {},
    timeout: 6e4,
    sslVerify: true,
    firstIpv4: false,
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    // 是否尝试将响应数据json化
    forcedJSONParsing: true
  };
  var clone = function() {
    function _instanceof(obj, type) {
      return type != null && obj instanceof type;
    }
    var nativeMap;
    try {
      nativeMap = Map;
    } catch (_) {
      nativeMap = function() {
      };
    }
    var nativeSet;
    try {
      nativeSet = Set;
    } catch (_) {
      nativeSet = function() {
      };
    }
    var nativePromise;
    try {
      nativePromise = Promise;
    } catch (_) {
      nativePromise = function() {
      };
    }
    function clone2(parent, circular, depth, prototype, includeNonEnumerable) {
      if (typeof circular === "object") {
        depth = circular.depth;
        prototype = circular.prototype;
        includeNonEnumerable = circular.includeNonEnumerable;
        circular = circular.circular;
      }
      var allParents = [];
      var allChildren = [];
      var useBuffer = typeof Buffer != "undefined";
      if (typeof circular == "undefined")
        circular = true;
      if (typeof depth == "undefined")
        depth = Infinity;
      function _clone(parent2, depth2) {
        if (parent2 === null)
          return null;
        if (depth2 === 0)
          return parent2;
        var child;
        var proto;
        if (typeof parent2 != "object") {
          return parent2;
        }
        if (_instanceof(parent2, nativeMap)) {
          child = new nativeMap();
        } else if (_instanceof(parent2, nativeSet)) {
          child = new nativeSet();
        } else if (_instanceof(parent2, nativePromise)) {
          child = new nativePromise(function(resolve, reject) {
            parent2.then(function(value) {
              resolve(_clone(value, depth2 - 1));
            }, function(err) {
              reject(_clone(err, depth2 - 1));
            });
          });
        } else if (clone2.__isArray(parent2)) {
          child = [];
        } else if (clone2.__isRegExp(parent2)) {
          child = new RegExp(parent2.source, __getRegExpFlags(parent2));
          if (parent2.lastIndex)
            child.lastIndex = parent2.lastIndex;
        } else if (clone2.__isDate(parent2)) {
          child = new Date(parent2.getTime());
        } else if (useBuffer && Buffer.isBuffer(parent2)) {
          if (Buffer.from) {
            child = Buffer.from(parent2);
          } else {
            child = new Buffer(parent2.length);
            parent2.copy(child);
          }
          return child;
        } else if (_instanceof(parent2, Error)) {
          child = Object.create(parent2);
        } else {
          if (typeof prototype == "undefined") {
            proto = Object.getPrototypeOf(parent2);
            child = Object.create(proto);
          } else {
            child = Object.create(prototype);
            proto = prototype;
          }
        }
        if (circular) {
          var index = allParents.indexOf(parent2);
          if (index != -1) {
            return allChildren[index];
          }
          allParents.push(parent2);
          allChildren.push(child);
        }
        if (_instanceof(parent2, nativeMap)) {
          parent2.forEach(function(value, key) {
            var keyChild = _clone(key, depth2 - 1);
            var valueChild = _clone(value, depth2 - 1);
            child.set(keyChild, valueChild);
          });
        }
        if (_instanceof(parent2, nativeSet)) {
          parent2.forEach(function(value) {
            var entryChild = _clone(value, depth2 - 1);
            child.add(entryChild);
          });
        }
        for (var i in parent2) {
          var attrs = Object.getOwnPropertyDescriptor(parent2, i);
          if (attrs) {
            child[i] = _clone(parent2[i], depth2 - 1);
          }
          try {
            var objProperty = Object.getOwnPropertyDescriptor(parent2, i);
            if (objProperty.set === "undefined") {
              continue;
            }
            child[i] = _clone(parent2[i], depth2 - 1);
          } catch (e) {
            if (e instanceof TypeError) {
              continue;
            } else if (e instanceof ReferenceError) {
              continue;
            }
          }
        }
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(parent2);
          for (var i = 0; i < symbols.length; i++) {
            var symbol = symbols[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
            if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
              continue;
            }
            child[symbol] = _clone(parent2[symbol], depth2 - 1);
            Object.defineProperty(child, symbol, descriptor);
          }
        }
        if (includeNonEnumerable) {
          var allPropertyNames = Object.getOwnPropertyNames(parent2);
          for (var i = 0; i < allPropertyNames.length; i++) {
            var propertyName = allPropertyNames[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
            if (descriptor && descriptor.enumerable) {
              continue;
            }
            child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
            Object.defineProperty(child, propertyName, descriptor);
          }
        }
        return child;
      }
      return _clone(parent, depth);
    }
    clone2.clonePrototype = function clonePrototype(parent) {
      if (parent === null)
        return null;
      var c = function() {
      };
      c.prototype = parent;
      return new c();
    };
    function __objToStr(o) {
      return Object.prototype.toString.call(o);
    }
    clone2.__objToStr = __objToStr;
    function __isDate(o) {
      return typeof o === "object" && __objToStr(o) === "[object Date]";
    }
    clone2.__isDate = __isDate;
    function __isArray(o) {
      return typeof o === "object" && __objToStr(o) === "[object Array]";
    }
    clone2.__isArray = __isArray;
    function __isRegExp(o) {
      return typeof o === "object" && __objToStr(o) === "[object RegExp]";
    }
    clone2.__isRegExp = __isRegExp;
    function __getRegExpFlags(re) {
      var flags = "";
      if (re.global)
        flags += "g";
      if (re.ignoreCase)
        flags += "i";
      if (re.multiline)
        flags += "m";
      return flags;
    }
    clone2.__getRegExpFlags = __getRegExpFlags;
    return clone2;
  }();
  class Request {
    /**
     * @param {Object} arg - 全局配置
     * @param {String} arg.baseURL - 全局根路径
     * @param {Object} arg.header - 全局header
     * @param {String} arg.method = [GET|POST|PUT|DELETE|CONNECT|HEAD|OPTIONS|TRACE] - 全局默认请求方式
     * @param {String} arg.dataType = [json] - 全局默认的dataType
     * @param {String} arg.responseType = [text|arraybuffer] - 全局默认的responseType。支付宝小程序不支持
     * @param {Object} arg.custom - 全局默认的自定义参数
     * @param {Number} arg.timeout - 全局默认的超时时间，单位 ms。默认60000。H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)、微信小程序（2.10.0）、支付宝小程序
     * @param {Boolean} arg.sslVerify - 全局默认的是否验证 ssl 证书。默认true.仅App安卓端支持（HBuilderX 2.3.3+）
     * @param {Boolean} arg.withCredentials - 全局默认的跨域请求时是否携带凭证（cookies）。默认false。仅H5支持（HBuilderX 2.6.15+）
     * @param {Boolean} arg.firstIpv4 - 全DNS解析时优先使用ipv4。默认false。仅 App-Android 支持 (HBuilderX 2.8.0+)
     * @param {Function(statusCode):Boolean} arg.validateStatus - 全局默认的自定义验证器。默认statusCode >= 200 && statusCode < 300
     */
    constructor(arg = {}) {
      if (!isPlainObject(arg)) {
        arg = {};
        formatAppLog("warn", "at utils/luch-request/core/Request.js:37", "设置全局参数必须接收一个Object");
      }
      this.config = clone({ ...defaults, ...arg });
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
     * @Function
     * @param {Request~setConfigCallback} f - 设置全局默认配置
     */
    setConfig(f) {
      this.config = f(this.config);
    }
    middleware(config) {
      config = mergeConfig(this.config, config);
      let chain = [dispatchRequest, void 0];
      let promise = Promise.resolve(config);
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }
      return promise;
    }
    /**
     * @Function
     * @param {Object} config - 请求配置项
     * @prop {String} options.url - 请求路径
     * @prop {Object} options.data - 请求参数
     * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
     * @prop {Object} [options.dataType = config.dataType] - 如果设为 json，会尝试对返回的数据做一次 JSON.parse
     * @prop {Object} [options.header = config.header] - 请求header
     * @prop {Object} [options.method = config.method] - 请求方法
     * @returns {Promise<unknown>}
     */
    request(config = {}) {
      return this.middleware(config);
    }
    get(url, options = {}) {
      return this.middleware({
        url,
        method: "GET",
        ...options
      });
    }
    post(url, data, options = {}) {
      return this.middleware({
        url,
        data,
        method: "POST",
        ...options
      });
    }
    put(url, data, options = {}) {
      return this.middleware({
        url,
        data,
        method: "PUT",
        ...options
      });
    }
    delete(url, data, options = {}) {
      return this.middleware({
        url,
        data,
        method: "DELETE",
        ...options
      });
    }
    options(url, data, options = {}) {
      return this.middleware({
        url,
        data,
        method: "OPTIONS",
        ...options
      });
    }
    upload(url, config = {}) {
      config.url = url;
      config.method = "UPLOAD";
      return this.middleware(config);
    }
    download(url, config = {}) {
      config.url = url;
      config.method = "DOWNLOAD";
      return this.middleware(config);
    }
    get version() {
      return "3.1.0";
    }
  }
  var baseURL;
  {
    var baseURL = "http://localhost:5173";
  }
  const http = new Request();
  http.setConfig((config) => {
    config.baseURL = baseURL;
    config.header = {
      ...config.header
    };
    return config;
  });
  http.interceptors.request.use((config) => {
    let show = config.custom.show ? config.custom.show : false;
    if (show) {
      let title_name = show != true ? show : "";
      uni.showLoading({
        title: title_name,
        mask: true
        //是否显示透明蒙层，防止触摸穿透，默认：false
      });
    }
    config.header = {
      ...config.header,
      "Token": uni.getStorageSync("token")
    };
    return config;
  }, (err) => {
    return Promise.reject(err);
  });
  let isRefreshing = false;
  http.interceptors.response.use((response) => {
    const token = uni.getStorageSync("token");
    const refresh_token = uni.getStorageSync("refresh_token");
    if (response) {
      formatAppLog("log", "at utils/service.js:57", "封装后 结果（1）：", response);
      let show = response.config.custom.show ? response.config.custom.show : false;
      if (show) {
        uni.hideLoading();
      }
      switch (response.data.error_code) {
        case 200:
          break;
        case 401:
          const config = response.config;
          if (!isRefreshing) {
            isRefreshing = true;
            return uni.request({
              url: baseURL + "/api/v1/Jwtapi/refreshToken",
              method: "POST",
              header: {
                "token": token,
                "refresh-token": refresh_token
              }
            }).then((res) => {
              formatAppLog("log", "at utils/service.js:81", "重新获取token");
              if (res.data && res.data.code == 41e3) {
                uni.setStorageSync("token", res.data.token);
                uni.setStorageSync("refresh_token", res.data.refresh_token);
                formatAppLog("log", "at utils/service.js:88", "token重新生成，成功");
              } else {
                formatAppLog("log", "at utils/service.js:90", "token过期，重新登录");
                uni.showToast({
                  title: "令牌过期，请重新登录！",
                  icon: "error",
                  success() {
                    setTimeout(function() {
                      uni.removeStorageSync("token");
                      uni.removeStorageSync("refresh_token");
                      uni.navigateTo({
                        url: "/pages/user_login/login/login"
                      });
                    }, 2e3);
                  }
                });
              }
              return http.request(config);
            }).finally(() => {
              isRefreshing = false;
            });
          } else {
            return new Promise((resolve) => {
            });
          }
        case 431:
          uni.showModal({
            title: "提示",
            content: response.data.msg ? response.data.msg : "账号已在其他地方登录！",
            showCancel: false,
            //是否显示取消按钮，默认为 true
            success: function(res) {
              formatAppLog("log", "at utils/service.js:133", res);
              if (res.confirm) {
                uni.removeStorageSync("token");
                uni.removeStorageSync("refresh_token");
                uni.navigateTo({
                  url: "/pages/user_login/login/login"
                });
              } else if (res.cancel)
                ;
            }
          });
          return Promise.reject(response);
      }
    }
    return response["data"];
  }, (err) => {
    return Promise.reject(err);
  });
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("warn", "at App.vue:4", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/HbuilderProjects/策略足球/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    app.config.globalProperties.$http = http;
    app.config.globalProperties.$baseURL = baseURL;
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
