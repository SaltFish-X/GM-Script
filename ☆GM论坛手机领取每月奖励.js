// ==UserScript==
// @name         GM论坛手机领取每月奖励
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修复手机无法领取每月奖励的布局问题
// @author       咸鱼鱼
// @match        https://www.gamemale.com/*
// @icon         https://www.gamemale.com/template/mwt2/extend/img/favicon.ico
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 判断当前页面是否是目标页面
   * @param {string} targetPath - 目标页面的路径（例如 "/reply_reward-reply_reward.html"）
   * @returns {boolean} - 如果是目标页面返回 true，否则返回 false
   */
  function isTargetPage(targetPath) {
    return window.location.pathname === targetPath;
  }

  /**
   * 添加样式到目标页面
   */
  function addStylesToTargetPage() {
    const targetPath = '/reply_reward-reply_reward.html';

    // 如果当前页面是目标页面，则添加样式
    if (isTargetPage(targetPath)) {
      GM_addStyle(`
        .msgbox_7ree {
            display: flex !important;
        }
      `);
    }
  }

  // 执行函数
  addStylesToTargetPage();
})();