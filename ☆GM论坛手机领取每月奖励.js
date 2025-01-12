// ==UserScript==
// @name         GM论坛手机领取每月奖励
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修复手机无法领取每月奖励的布局问题
// @author       咸鱼鱼
// @match        https://www.gamemale.com/reply_reward-reply_reward.html
// @icon         https://www.gamemale.com/template/mwt2/extend/img/favicon.ico
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict'

  GM_addStyle(`
    .msgbox_7ree {
        display: flex !important;
    }
`)
})()