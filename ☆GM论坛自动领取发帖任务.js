// ==UserScript==
// @name         GM论坛自动领取发帖任务
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动领取发帖任务
// @match        https://www.gamemale.com/forum.php
// @match        https://www.gamemale.com/?fromuid=662711
// @match        https://www.gamemale.com/thread-*
// @grant        none
// @icon         https://www.gamemale.com/template/mwt2/extend/img/favicon.ico
// @license      GPL
// ==/UserScript==
// 每周发帖任务的刷新时间实际为每周日00：00，并不是每周一

// 下载地址
// https://greasyfork.org/zh-CN/scripts/519502-gm%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E5%8F%91%E5%B8%96%E4%BB%BB%E5%8A%A1

(function () {
  // 获取当前日期
  const currentDateString = getDate()
  // 检查localStorage中存储的最后执行日期
  const lastExecutionDate = localStorage.getItem('每周发帖任务标记');

  if (lastExecutionDate === currentDateString) {
    console.log('今天已经自动领取发帖任务');
  } else {
    applyTask()
    claimReward()

    localStorage.setItem('每周发帖任务标记', currentDateString);
  }


  // 获取当前时间的年、月和日
  function getDate() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 月份从0开始，需要加1
    const day = currentDate.getDate();

    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    return formattedDate
  }

  // 申请任务
  // https://www.gamemale.com/home.php?mod=task&do=apply&id=25

  // 放弃任务
  // https://www.gamemale.com/home.php?mod=task&do=delete&id=25

  // 任务页面
  // https://www.gamemale.com/home.php?mod=task&do=view&id=25

  // 领取奖励
  // https://www.gamemale.com/home.php?mod=task&do=draw&id=25


  // 如果您的浏览器没有自动跳转，请点击此链接
  const messageInfo = {
    success: '任务申请成功',
    done: '抱歉，本期您已申请过此任务，请下期再来',
    cancel: '您已放弃该任务，您还可以继续完成其他任务或者申请新任务'
  }

  // 自动领取发帖任务
  // TODO 领任务可以改成进入发帖页面的时候再去领，可以加个标识方便判断
  function applyTask() {
    return fetch('https://www.gamemale.com/home.php?mod=task&do=apply&id=25', {
      method: 'GET'
    })
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html')
        const messagetext = doc.querySelector('#messagetext p').textContent
        console.log(messagetext);
      })
      .catch(error => {
        console.error('发生错误：', error);
      })
  }

  // 自动领取任务奖励 仅防忘记
  function claimReward(params) {
    const messageInfo = {
      todo: '不是进行中的任务', //尚未领取
      doing: '您还没有开始执行任务，赶快哦！', // 领取了没执行
      done: '恭喜您，任务已成功完成，您将收到奖励通知，请注意查收' //领取成功
    }
    return fetch('https://www.gamemale.com/home.php?mod=task&do=draw&id=25', {
      method: 'GET'
    }).then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html')
        const messagetext = doc.querySelector('#messagetext p').textContent
        console.log(messagetext);

        if (messagetext.includes(messageInfo.done)) {
          // 清除系统消息
          Mjq.get('home.php?mod=space&do=notice&view=system&inajax=1')
        }
      })
      .catch(error => {
        console.error('发生错误：', error);
      })
  }

  // 月任务奖励
  // 主题奖励 https://www.gamemale.com/plugin.php?id=reply_reward&code=4&type_7ree=1
  // 回帖奖励 https://www.gamemale.com/plugin.php?id=reply_reward&code=4&type_7ree=2

  // 发帖
  // https://www.gamemale.com/forum.php?mod=post&action=newthread&fid=206
  // https://www.gamemale.com/forum.php?mod=post&action=newthread&fid=154
  // https://www.gamemale.com/forum.php?mod=viewthread&tid=150221
  // 定义目标页面的正则匹配规则，忽略额外的查询参数

  // 检查 referrer 是否匹配
  if (/^https:\/\/www\.gamemale\.com\/forum\.php\?mod=post&action=newthread(&.*)?/.test(document.referrer)) {
    claimReward(); // 调用你的函数
    console.log('已经领取每周发帖奖励');
  }

  // 可以监听标签，但是算了，有点麻烦，重复造轮子，我想弄点简单的
  // 我选择正则+document.referrer
  function startObserve() {
    const targetNode = document.getElementById('append_parent');

    // 观察器配置
    const config = { attributes: false, childList: true, subtree: false };

    // 当检测到变化时调用的回调函数
    const callback = function () {

      // 如果检测到奖励内容再执行函数
      if (document.getElementById("creditpromptdiv")) {

        var creditElement = document.getElementById("creditpromptdiv");
        if (creditElement) {
          const creditTypeNode = creditElement.querySelector('i');
          console.log(creditTypeNode);
          const parts = creditTypeNode.textContent.trim().split(' ');
          const creditType = parts[0]

          if (creditType === '发表主题') {
            claimReward()
          }
        }

      }

    };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 开始观察目标节点
    observer.observe(targetNode, config);
  }
})()
