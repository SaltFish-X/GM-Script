// ==UserScript==
// @name         GM论坛自动领取发帖任务
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动领取发帖任务
// @match        https://www.gamemale.com/forum.php?mod=viewthread&tid=*
// @match        https://www.gamemale.com/forum.php?mod=post&action=newthread&fid=*
// @grant        none
// @icon         https://www.gamemale.com/template/mwt2/extend/img/favicon.ico
// @license      GPL
// ==/UserScript==
// 每周发帖任务的刷新时间实际为每周日00：00，并不是每周一

// 下载地址 https://greasyfork.org/zh-CN/scripts/519502

(function () {
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

  // 发新帖 https://www.gamemale.com/forum.php?mod=post&action=newthread&fid=53
  // 编辑原有帖子 https://www.gamemale.com/forum.php?mod=post&action=edit&fid=150&tid=112806&pid=4755585&page=7
  // 回复帖子 https://www.gamemale.com/forum.php?mod=post&action=reply&fid=54&tid=152292

  // 自动领取发帖任务
  // TODO 领任务可以改成进入发帖页面的时候再去领，可以加个标识方便判断
  // 获取当前页面的 URL
  const currentUrl = window.location.href
  const currentReferrer = document.referrer
  const newThreadUrl = 'https://www.gamemale.com/forum.php?mod=post&action=newthread&fid='

  // 检查当前 URL 是否匹配正则表达式
  if (currentUrl.includes(newThreadUrl)) {
    // 如果匹配，执行 applyTask 函数
    applyTask()
    console.log('已经领取每周发帖任务')
  }

  // 检查 referrer 是否匹配
  if (currentReferrer.includes(newThreadUrl)) {
    claimReward() // 调用你的函数
    console.log('已经领取每周发帖奖励')
  }

  function applyTask() {
    return fetch('https://www.gamemale.com/home.php?mod=task&do=apply&id=25', {
      method: 'GET'
    })
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const messagetext = doc.querySelector('#messagetext p').textContent
        console.log(messagetext)
      })
      .catch(error => {
        console.error('发生错误：', error)
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
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const messagetext = doc.querySelector('#messagetext p').textContent
        console.log(messagetext)

        if (messagetext.includes(messageInfo.done)) {
          // 清除系统消息
          Mjq.get('home.php?mod=space&do=notice&view=system&inajax=1')
        }
      })
      .catch(error => {
        console.error('发生错误：', error)
      })
  }

  // 月任务奖励
  // 主题奖励 https://www.gamemale.com/plugin.php?id=reply_reward&code=4&type_7ree=1
  // 回帖奖励 https://www.gamemale.com/plugin.php?id=reply_reward&code=4&type_7ree=2

  // 发帖
  // https://www.gamemale.com/forum.php?mod=post&action=newthread&fid=206

  // 定义目标页面的正则匹配规则，忽略额外的查询参数
  // https://www.gamemale.com/forum.php?mod=viewthread&tid=150221

  // 不知道为什么发帖成功后会有两个界面，非常奇怪
  // https://www.gamemale.com/thread-*
  // https://www.gamemale.com/forum.php?mod=viewthread&tid=*

  // 可以监听标签，但是算了，有点麻烦，重复造轮子，我想弄点简单的
  // 我选择正则+document.referrer
})()
