// ==UserScript==
// @name         二手市场大宝剑布丁 特效版
// @namespace    https://www.gamemale.com/space-uid-687897.html
// @supportURL   https://www.gamemale.com/thread-136247-1-1.html
// @version      0.28
// @description  删除所有非寄售交易类的记录，并且直接显示页面内勋章的寄售价格和寄售用户！脚本可能会造成卡顿，如需抢购请关闭此脚本！
// @author       瓦尼
// @match        https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=showjishou
// @icon         https://img.gamemale.com/album/201405/01/175008icuedsbvi0btdc7c.gif
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    /////////////////////////快速设置////////////////////////////////

    // 是否逆序显示，值为0时关闭，显示顺序为正序，越新的寄售越靠后，值为1时开启，倒序，越新的寄售越靠前，默认开启。
    const reverseOn = 1;

    // 折扣显示动画，值为0时关闭，值为1时开启，默认开启
    const animationOn = 1;

    // 最低价格提示，值为0时关闭，值为1时开启，默认开启
    const lowPriceReminder = 1;

    // 动画调整设置

    // 动画时长设置（所有折扣力度）,默认为'2s',s为秒即默认时长为2秒
    const animationTime = '2s';

    // 低于最高寄售价的物品动画设置
    // 动画开关，值为0时关闭，值为1时开启，默认开启
    const primaryAnimationOn = 1;
    // 动画颜色，请填写对应颜色的hex代码，默认 '#66ddf7'
    const primaryColor = '#66ddf7';
    // 动画拖尾长度占比，默认'25%'
    const primaryPercentage = '25%';

    // 小于等于原价的物品动画设置
    // 动画开关，值为0时关闭，值为1时开启，默认开启
    const greenAnimationOn = 1;
    // 动画颜色，请填写对应颜色的hex代码，默认'#00ff88'
    const greenColor = '#00ff88';
    // 动画拖尾长度占比，默认'75%'
    const greenPercentage = '75%';


    // 小于等于原价50%的物品动画设置
    // 动画开关，值为0时关闭，值为1时开启，默认开启
    const redAnimationOn = 1;
    // 动画颜色，请填写对应颜色的hex代码，默认 '#fc466b'
    const redColor = '#fc466b';
    // 动画拖尾长度占比，默认'75%'
    const redPercentage = '75%';

    /////////////////////////快速设置部分结束///////////////////////

    // 快速设置赋值
    document.documentElement.style.setProperty('--animation-time', animationTime);

    if( primaryAnimationOn ){
        document.documentElement.style.setProperty('--color', primaryColor);
        document.documentElement.style.setProperty('--shiny-percentage', primaryPercentage);
    }else{
        document.documentElement.style.setProperty('--color', '#fff');
    }

    if( greenAnimationOn ){
        document.documentElement.style.setProperty('--green-color', greenColor);
        document.documentElement.style.setProperty('--green-percentage', greenPercentage);
    }else{
        document.documentElement.style.setProperty('--green-color', '#fff');
    }

    if( redAnimationOn ){
        document.documentElement.style.setProperty('--red-color', redColor);
        document.documentElement.style.setProperty('--red-percentage', redPercentage);
    }else{
        document.documentElement.style.setProperty('--red-color', '#fff');
    }


    // u老师提供的勋章价格数据，特此鸣谢！
    // u老师的空间: https://www.gamemale.com/space-uid-714849.html
    // 已将数据转换为JSON格式
    /* 插入位置 */


    // 添加模板：
    // "勋章名":{"currency":"金币","amount":0},

    // 最大寄售价格为115%
    const maxPriceRate = 1.15;

    // 回收价格为65%
    const huiShouPriceRate = 0.65;

    // 删除非寄售相关的交易记录
    function removeNotJishou(){
        // 选中与ID为'medalid_f'的<form>元素同级的，类名为 'el pbw mbw' 的<ul>元素
        let targetUl = document.querySelector('form#medalid_f ~ ul.el.pbw.mbw');

        if (targetUl) {
            // 获取该<ul>下的所有<li>
            let lisInTargetUl = targetUl.getElementsByTagName('li');

            // 遍历这些<li>，并根据条件决定是否删除
            for (let i = lisInTargetUl.length - 1; i >= 0; i--) {
                // 如果<li>文本不包含'寄售'则 删除该<li>
                if (!lisInTargetUl[i].textContent.includes('寄售')) {
                    targetUl.removeChild(lisInTargetUl[i]);
                }
            }
        } else {
            console.error("未找到与<form id='medalid_f'>同级的类名为 'el pbw mbw' 的<ul>元素");
        }
    }

    function showUserAndPrice(){

        // 如果开启逆序，则越新的寄售显示越靠前
        if( reverseOn ){
            let container = document.querySelector('.myfldiv');
            let myblokArray = Array.from(document.getElementsByClassName("myblok"));

            myblokArray = myblokArray.reverse();

            container.innerHTML = '';
            myblokArray.forEach(item => container.appendChild(item));
        }

        let myblok = document.getElementsByClassName("myblok")

        // 用于记录每种勋章对应的最低价格和对应的 blok
        const minPriceMap = {};

        for (var blok of myblok) {
            blok.style.height = "auto";

            // 获取勋章名称
            // ？可以在空值是防止错误
            let badgeName = blok.querySelector('.myimg p b')?.textContent;
            if(!badgeName){
                console.log("未找到页面信息：勋章名")
                continue;
            }

            // 获取jiage类的p元素
            let jiageP = blok.querySelectorAll('.mytip .jiage');
            if(!jiageP){
                console.log("未找到页面信息：价格");
                continue;
            }

            // 寄售用户
            let userContent = jiageP[0].querySelector('b')?.textContent;

            // 寄售价格
            let priceContent = jiageP[1].querySelector('b')?.textContent;

            if((!userContent) || (!priceContent)){
                console.log("未找到页面信息：用户或寄售价格");
                continue;
            }

            // 获取价格金币数字
            const regex = /\d+/;
            let priceMatch = priceContent.match(regex);
            if(!priceMatch){
                console.log("价格信息提取错误");
                continue;
            }
            let priceNumber = parseInt(priceMatch[0], 10);


            // 记录每个 badgeName 最低价及对应的 blok
            if (!minPriceMap[badgeName] || priceNumber < minPriceMap[badgeName].minPrice) {
                minPriceMap[badgeName] = {
                    minPrice: priceNumber,
                    blok: blok
                };
            }

            // 0.24修复： 勋章数据库没有数据时
            // 如果数据库中没有数据则将Flag置0
            let hasDataFlag = 1;
            // 根据寄售的原价对对应勋章进行变色
            let oriBadgePrice;
            if(!(badgePriceJson[badgeName])){
                console.log("未在勋章数据库中找到对应勋章：" + badgeName);
                hasDataFlag = 0;
                oriBadgePrice = "未收录"
            }else{
                oriBadgePrice = badgePriceJson[badgeName].amount;
            }

            //如果有价格则改变样式
            if(hasDataFlag){
                let maxJishouPrice = Math.floor(oriBadgePrice * maxPriceRate);
                let huiShouPrice = Math.floor(oriBadgePrice * huiShouPriceRate);

                // 如果小于最大寄售价，变成蓝色
                if( priceNumber < maxJishouPrice){
                    blok.classList.add("shinyBlok");
                }

                // 如果小于等于勋章回收价格，变成红色
                // 如果小于等于原价，变成绿色
                if( priceNumber <= huiShouPrice ){
                    blok.classList.add("redBlok");
                }else if( priceNumber <= oriBadgePrice){
                    blok.classList.add("greenBlok");
                }

            }

            // 添加元素
            if (userContent && priceContent) {
                var newP = document.createElement("p");
                newP.classList.add("pudding");
                var newContent = document.createTextNode( priceNumber + "/" + oriBadgePrice + " " + userContent );
                newP.appendChild(newContent);

                // 设置样式，使其紧贴标题
                newP.style.marginTop = "-10px";
                newP.style.whiteSpace = "nowrap";

                var badgeTitleP = blok.querySelector('.myimg p');
                blok.querySelector('.myimg').insertBefore(newP, badgeTitleP.nextElementSibling);
            }
        }

        // 为每种勋章的最低价 改变名称样式
        for (var badgeName in minPriceMap) {
            let targetBlok = minPriceMap[badgeName].blok;

            //修改对应勋章名称样式
            targetBlok.querySelector('.myimg p')?.classList.add("colorfulText");
        }

    }

    removeNotJishou();
    showUserAndPrice();

    // 如果设置中开启动画则修改样式
    if( animationOn ){

        // 流水灯边框样式
        // 来源：ckjdygc - 创客界的一根葱
        // gitee仓库：https://gitee.com/laoheiwan/ckjdygc/tree/main
        // 此处需要用:not(button.pn)排除对button元素的样式影响 （否则可能会和其他脚本冲突，如勋章辅助二手防滑的fadeTo动画）
        GM_addStyle(`
       .shinyBlok:not(button.pn){
            overflow: hidden;
            z-index: 0;
        }
        .shinyBlok:not(button.pn)::before {
            content: "";
            width: 200%;
            height: 200%;
            background-image: conic-gradient(transparent, var(--color, #66ddf7), transparent var(--shiny-percentage, 25%));
            position: absolute;
            left: -50%;
            top: -50%;
            z-index: -2;
            animation: rotate var(--animation-time, 2s) linear infinite;
        }
        .greenBlok:not(button.pn)::before {
            background-image: conic-gradient(transparent, var(--green-color, #00ff88), transparent var(--green-percentage, 75%));
        }
        .redBlok:not(button.pn)::before {
            background-image: conic-gradient(transparent, var(--red-color, #fc466b), transparent var(--red-percentage, 75%));
        }
       @keyframes rotate {
           100% {
               transform: rotate(360deg);
           }
       }
       .shinyBlok:not(button.pn)::after {
           content: "";
           inset: 0.7vmin;
           background: #fff;
           position: absolute;
           z-index: -1;
       }
    `);
    }

    // 如果开启最低售价功能，则载入动画
    // https://www.bilibili.com/video/BV1xr4y1n7hx/
    if(lowPriceReminder){
        GM_addStyle(`
            :root {
            --color-1: #186cb8;
            --color-2: #2a9a9f;
            --color-3: #f1b211;
            --color-4: #e83611;
            --color-5: #f9002f;
            }

    .colorfulText {
        color: #fff;
        background: linear-gradient(225deg,
            var(--color-1) 0%, var(--color-1) 9%,
            transparent 9%, transparent 10%,
            var(--color-2) 10%, var(--color-2) 19%,
            transparent 19%, transparent 20%,
            var(--color-3) 20%, var(--color-3) 29%,
            transparent 29%, transparent 30%,
            var(--color-4) 30%,var(--color-4) 39%,
            transparent 39%, transparent 40%,
            var(--color-5) 40%,var(--color-5) 49%,
            transparent 49%, transparent 50%,
            var(--color-1) 50%, var(--color-1) 59%,
            transparent 59%, transparent 60%,
            var(--color-2) 60%, var(--color-2) 69%,
            transparent 69%, transparent 70%,
            var(--color-3) 70%, var(--color-3) 79%,
            transparent 79%, transparent 80%,
            var(--color-4) 80%,var(--color-4) 89%,
            transparent 89%, transparent 90%,
             var(--color-5) 90%,var(--color-5) 99%,
            transparent 99%
        );
        background-size: 200% 200%;
        color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        animation: move 4s linear infinite;
    }

    @keyframes move{
        0%{
            background-position:0px 100%;
        }
        100%{
            background-position: 100% 0px;
        }
    }

         `);
    };

})();