// ==UserScript==
// @name         勋章放大镜
// @namespace    http://tampermonkey.net/
// @version      2.8.1
// @description  泥潭勋章属性展示！
// @author       轶致
// @match        https://www.gamemale.com/wodexunzhang-showxunzhang.html*
// @match        https://www.gamemale.com/plugin.php?id=wodexunzhang%3Ashowxunzhang&fid=*
// @match        https://www.gamemale.com/plugin.php?id=wodexunzhang%3Ashowxunzhang&action=*
// @match        https://www.gamemale.com/plugin.php?id=wodexunzhang:showxunzhang&action=my
// @match        https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=showjishou
// @match        https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=combo
// @namespace    https://www.gamemale.com/forum.php?mod=viewthread&tid=129944
// @homepage     https://www.gamemale.com/thread-129944-1-1.html
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GPL
// @icon         https://www.gamemale.com/template/mwt2/extend/img/favicon.ico
// ==/UserScript==

// 推荐链接：博物馆传送门 https://www.gamemale.com/thread-144398-1-1.html
// 神秘的许愿池 https://www.gamemale.com/plugin.php?id=wodexunzhang%3Ashowxunzhang&fid=24
// 蛇年抽奖 https://www.gamemale.com/plugin.php?id=wodexunzhang%3Ashowxunzhang&fid=30
// 0.54血毕业男从比较 https://www.gamemale.com/thread-149145-1-2.html
// 勋章改动一览 https://www.gamemale.com/forum.php?mod=viewthread&tid=8878&extra=&authorid=63991&page=2

// 勋章放大镜下载更新地址
// https://greasyfork.org/zh-CN/scripts/516559
// 镜像地址
// https://gf.qytechs.cn/zh-CN/scripts/516559

// TODO 上次补货时间
(function () {
    'use strict'

    // Object.hasOwn 兼容性处理
    if (!Object.hasOwn) {
        Object.defineProperty(Object, "hasOwn", {
            value: function (object, property) {
                if (object == null) {
                    throw new TypeError("Cannot convert undefined or null to object");
                }
                return Object.prototype.hasOwnProperty.call(Object(object), property);
            },
            configurable: true,
            enumerable: false,
            writable: true,
        });
    }

    // 0为原版【上下显示】 1为新版【左右显示】
    // 似乎手机上下显示没问题，那保留一下
    // 判断是否为移动设备（包括 iPhone）
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)

    // 是否显示图片true or false，默认true显示
    // 2.7.18版本之后不需要修改此处，直接点击菜单即可修改
    let showImg = true;

    if (GM_getValue("toggleSetting") === undefined) {
        // toggleSetting 代表放大镜是否位于标签左右 true为左右，false为上下
        GM_setValue("toggleSetting", !isMobile) // 如果是移动设备，默认为 false；否则为 true
    }

    if (GM_getValue("showImgSetting") === undefined) {
        console.log("get showImgSetting undefined, set default " + showImg);
        GM_setValue("showImgSetting", showImg);
    }
    else {
        showImg = GM_getValue("showImgSetting");
        console.log("get showImgSetting " + showImg);
    }

    // 创建菜单命令用于切换设置
    GM_registerMenuCommand("切换放大镜显示位置", toggleSettingFun)
    function toggleSettingFun() {
        const currentValue = GM_getValue("toggleSetting")
        const newValue = !currentValue
        GM_setValue("toggleSetting", newValue)
    }

    // 创建菜单命令显示图片设置
    GM_registerMenuCommand("切换放大镜图片显示", showImgSettingFun)
    function showImgSettingFun() {
        showImg = !showImg;
        console.log("set showImgSetting " + showImg);
        GM_setValue("showImgSetting", showImg);
        初始化放大镜();
    }

    // 此外右下角有一个放大器可以显示/隐藏放大镜，解决遮挡原信息问题
    // 估计很多人没法发现过这个东西
    let 放大镜显示 = localStorage.getItem('放大镜显示') !== 'false'

    // @deprecated 已弃用
    // 删掉右下角的勋章显示切换，避免误触。已经有好几个人来问我了
    function 创建控制面板() {
        const 控制面板 = document.createElement('div')
        控制面板.id = '控制面板'
        控制面板.style.position = 'fixed'
        控制面板.style.bottom = '20px'
        控制面板.style.right = '20px'
        控制面板.style.zIndex = '1000'
        控制面板.innerHTML = `<button id="切换放大镜按钮" style="font-size: 18px; background: none; border: none; padding: 0; box-shadow: none; line-height: 1;">${放大镜显示 ? "🔎✅" : "🔎🚫"}</button>`
        document.body.appendChild(控制面板)
        document.getElementById("切换放大镜按钮").addEventListener("click", 切换放大镜显示)
    }

    function 切换放大镜显示() {
        放大镜显示 = !放大镜显示
        this.innerHTML = 放大镜显示 ? "🔎✅" : "🔎🚫"
        localStorage.setItem('放大镜显示', 放大镜显示)
        if (!放大镜显示) {
            隐藏所有放大镜()
        }
    }

    function 创建放大镜() {
        const 放大镜 = document.createElement('div')
        放大镜.id = '泥潭勋章放大镜'
        放大镜.style.position = 'fixed'
        放大镜.style.padding = '10px'
        放大镜.style.background = 'white'
        放大镜.style.border = '1px solid black'
        放大镜.style.borderRadius = '5px'
        放大镜.style.display = 'none'
        放大镜.style.zIndex = '10000'
        放大镜.style.fontWeight = 'bold'
        放大镜.style.color = '#000516'
        放大镜.style.maxHeight = '550px' // 设置最大高度 禽兽扒手无滚动条的高度
        放大镜.style.overflowY = 'auto'  // 添加垂直滚动条
        document.body.appendChild(放大镜)
        return 放大镜
    }

    const 放大镜 = 创建放大镜()

    const 收益权重映射 = {
        '金币': 1,
        '血液': 1,
        '旅程': 30,
        '咒术': 5,
        '知识': 50,
        '灵魂': 1000,
        '堕落': 0 // 堕落不计入总消耗
    }

    const 属性映射 = {
        '金币': { 颜色: '#FFBF00', emoji: '💰' },
        '血液': { 颜色: '#ff0000', emoji: '🩸' },
        '旅程': { 颜色: '#008000', emoji: '✈️' },
        '咒术': { 颜色: '#a52a2a', emoji: '🔮' },
        '知识': { 颜色: '#0000ff', emoji: '📖' },
        '灵魂': { 颜色: '#add8e6', emoji: '✡️' },
        '堕落': { 颜色: '#800080', emoji: '😈' },
        '总计': { 颜色: '#ffa500', emoji: '🈴' }
    }

    const 属性颜色映射 = {
        '回帖': '#0189ff',
        '发帖': 'purple'
    }

    function 计算收益(文本) {
        const 行列表 = 文本.split('\n')
        let 收益详情列表 = []
        let 最大收益 = { 收益: 0, 等级: 0 }

        for (let i = 0; i < 行列表.length; i++) {
            const 行 = 行列表[i]
            let 总收益 = 0
            let 非自动升级收益 = 0
            let 行收益详情 = ''

            // 匹配触发几率
            const 触发几率匹配 = 行.match(/】(\d+)%/)
            if (触发几率匹配) {
                const 触发几率 = parseFloat(触发几率匹配[1]) / 100

                // 匹配回帖属性
                const 回帖属性匹配 = 行.match(/回帖(.*?)(,|$|发帖|升级|▕)/)
                if (回帖属性匹配) {
                    const 属性匹配 = [...回帖属性匹配[1].matchAll(/(金币|血液|旅程|咒术|知识|灵魂|堕落)(\+|-)(\d+)/g)]
                    let 非堕落属性计数 = 0

                    for (const 匹配 of 属性匹配) {
                        const 属性 = 匹配[1]
                        const 符号 = 匹配[2] // '+' 或 '-'
                        const 值 = parseInt(匹配[3], 10) * (符号 === '+' ? 1 : -1)

                        if (属性 !== '堕落') {
                            非堕落属性计数++
                            const 权重 = 收益权重映射[属性] || 0
                            const 收益 = 触发几率 * 值 * 权重
                            总收益 += 收益

                            if (收益 !== 0) {
                                行收益详情 += `<span style="color:${属性映射[属性].颜色};"><span style="font-family:Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji">${属性映射[属性].emoji}</span>${收益.toFixed(2)}</span> `
                            }

                            if (!行.includes('≥')) {
                                非自动升级收益 = 总收益
                            }
                        }
                    }

                    // 如果有多个非堕落属性，显示总收益
                    if (非堕落属性计数 > 1) {
                        行收益详情 += `<span style="color:${属性映射['总计'].颜色};"><span style="font-family:Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji">${属性映射['总计'].emoji}</span>${总收益.toFixed(2)}</span>`
                    }

                    // 更新最大收益
                    if (非自动升级收益 > 最大收益.收益) {
                        最大收益 = { 收益: 总收益, 等级: 行.match(/【等级(\d+)】/)?.[1] || 'Max' }
                    }
                }
            }

            // 将当前行的收益详情加入列表
            收益详情列表.push(行收益详情.trim())
        }

        return {
            收益详情列表,
            // 距离最大等级的非0, 非自动升级收益（因为自动升级收益无法控制且多为彩蛋性质）
            最大收益: { 等级: 最大收益.等级, 收益: 最大收益.收益.toFixed(2) }
        }
    }

    function 计算回本周期(内容, 升级消耗, 最大收益) {
        const 匹配结果 = 内容.match(/商店售价】(\d+)(金币|血液|旅程|咒术|知识|灵魂|堕落)?/)
        let 价格 = parseInt(匹配结果?.[1]) || 0
        const 单位 = 匹配结果?.[2]
        价格 = 价格 * (收益权重映射[单位] || 0)
        const 总价 = 升级消耗 + 价格

        if (最大收益.收益 > 0 && 总价 > 0) {
            const 回本周期1 = 升级消耗 / 最大收益.收益
            const 回本周期2 = 总价 / 最大收益.收益
            const 回本周期文本 = `【回本周期】以等级${最大收益.等级}计算，升级消耗回本${Math.ceil(回本周期1)}贴, 考虑勋章价格回本${Math.ceil(回本周期2)}贴`
            return 回本周期文本
        } else {
            return ''
        }
    }

    /**
     * 修改属性颜色
     *
     * 根据内容计算收益详情列表、最大收益、升级消耗和回本周期，并修改内容中的属性颜色。
     *
     * @param {string} 内容 - 要处理的内容字符串
     * @returns {string} - 修改后的新内容字符串
     */
    function 修改属性颜色(内容) {
        const 收益详情列表 = 计算收益(内容).收益详情列表
        const 最大收益 = 计算收益(内容).最大收益
        const 升级消耗 = 统计升级消耗(内容)
        const 升级消耗文本 = 升级消耗.文本
        const 回本周期 = 计算回本周期(内容, 升级消耗.数字, 最大收益)

        const 行列表 = 内容.split('\n')
        let 新内容 = ''
        for (let i = 0; i < 行列表.length; i++) {
            const 行 = 行列表[i]
            const 收益详情 = 收益详情列表[i]
            if (收益详情) {
                新内容 += 行.replace(/(】)(\d+)%(\s*)/, `$1${收益详情} $2%$3`)
            } else {
                新内容 += 行
            }
            if (i < 行列表.length - 1) {
                新内容 += '\n'
            }
        }

        // 修改属性颜色
        新内容 = 新内容.replace(/(回帖)(.*?)(?=、|\n|$|发帖|升级|▕)/g, function (match, p1, p2) {
            return `<span style="color:${属性颜色映射['回帖']}">${p1}${p2}</span>`
        })
        新内容 = 新内容.replace(/(发帖)(.*?)(?=、|$|升级|▕)/g, function (match, p1, p2) {
            return `<span style="color:${属性颜色映射['发帖']}">${p1}${p2}</span>`
        })

        新内容 += 升级消耗文本
        新内容 += '\n' + 回本周期

        return 新内容
    }

    function 显示放大镜(内容, 目标, type) {
        if (!放大镜显示) return
        const 新内容 = 修改属性颜色(内容)
        放大镜.innerHTML = 新内容.replace(/\n/g, '<br>')
        放大镜.style.display = 'block'
        放大镜.style.visibility = 'hidden'

        if (GM_getValue("toggleSetting") && type ==='default') {
            定位放大镜New(目标)
        } else if(type ==='default') {
            定位放大镜不需要提示_上下(目标)
        }else{
            定位放大镜不需要提示_左右(目标)
        }

        放大镜.style.visibility = 'visible'
    }

    function 定位放大镜不需要提示_上下(target) {
        const rect = target.getBoundingClientRect(); // 获取目标相对于窗口的坐标
        const elWidth = 放大镜.offsetWidth;
        const elHeight = 放大镜.offsetHeight;
        const vWidth = window.innerWidth; // 视口宽度
        const vHeight = window.innerHeight; // 视口高度
        let left = rect.left + rect.width / 2 - elWidth / 2;
        let top = rect.top - elHeight - 10;
        // 垂直边界判断
        if (top < 10) {
            top = rect.bottom + 10;
        }
        // 显示在下方还超出了窗口底部，强制贴合在底部（保留10px间距）
        if (top + elHeight > vHeight - 10) {
            top = vHeight - elHeight - 10;
        }
        // 水平边界判断 (限制在窗口 10px 边距内)
        const minLeft = 10;
        const maxLeft = vWidth - elWidth - 10;
        left = Math.max(minLeft, Math.min(left, maxLeft));
        放大镜.style.left = left + "px";
        放大镜.style.top = top + "px";
    }

    function 定位放大镜New(img) {
        const labels = document.querySelectorAll(".MyshowTip2");

        labels.forEach((label) => {
            if (label.style.display !== "none") {
                放大镜.style.width = "";
                // 获取放大镜的高度、宽度
                let h = 放大镜.offsetHeight;
                const w = 放大镜.offsetWidth;
                const labelRect = label.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth; // 视口宽度
                let left = labelRect.left - w - 1;
                let rightAvailableWidth =
                    viewportWidth - labelRect.left - labelRect.width - w - 1;
                if (left < 0) {
                    if (rightAvailableWidth > 0)
                        left = labelRect.left + labelRect.width;
                    // else {
                    //     left = 2;
                    //     this.el.style.width = labelRect.left - 4 + "px";
                    //     // 重新获取放大镜的高度(包含滚动条)
                    //     h = this.el.offsetHeight;
                    // }
                }
                // 对齐 .MyshowTip2 顶部
                let top = labelRect.top;
                const imgTop = img.getBoundingClientRect().top;
                // 对齐 .MyshowTip2 底部
                if (labelRect.top < imgTop) {
                    top = labelRect.top + labelRect.height - h;
                }
                top = Math.max(2, top);
                // 对齐屏幕底部
                if (top + h > viewportHeight) {
                    top = viewportHeight - h - 6;
                }
                放大镜.style.top = top + "px";
                放大镜.style.left = left + "px";
            }
        });
    }
    function 定位放大镜不需要提示_左右(target){
        放大镜.style.width = "";
        // 获取放大镜的高度、宽度
        let h = 放大镜.offsetHeight;
        const w = 放大镜.offsetWidth;
        // 定位目标元素
        const targetRect = target.getBoundingClientRect();
        const targetWidth = targetRect.width;
        const targetHeight = targetRect.height;
        const targetLeft = targetRect.left;
        const targetTop = targetRect.top;
        // 视口高度、宽度
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        let left = targetLeft - w - 1;
        let rightAvailableWidth =
            viewportWidth - targetLeft - targetWidth - w - 1;
        if (left < 0) {
            if (rightAvailableWidth > 0) left = targetLeft + targetWidth;
            // else {
            //     left = 2;
            //     放大镜.style.width = targetLeft - 4 + "px";
            //     // 重新获取放大镜的高度(包含滚动条)
            //     h = 放大镜.offsetHeight;
            // }
        }
        // 对齐 目标元素 顶部
        let top = targetTop + targetHeight - h;
        top = Math.max(4, top);
        // 对齐屏幕底部
        if (top + h > viewportHeight) {
            top = viewportHeight - h - 6;
        }
        放大镜.style.top = top + "px";
        放大镜.style.left = left + "px";
    }
    function 隐藏放大镜() {
        放大镜.style.display = 'none'
    }

    function 隐藏所有放大镜() {
        隐藏放大镜()
    }

    let timeoutId
    function 添加悬停监听器(目标, 放大镜内容) {
        目标.addEventListener('mouseover', function () {
            if (放大镜内容) {
                clearTimeout(timeoutId); // 清除之前的隐藏任务
                显示放大镜(放大镜内容, 目标)
            }
        })
        目标.addEventListener('mouseout', () => {
            // 延迟隐藏 B
            timeoutId = setTimeout(() => {
                if (!放大镜.matches(':hover')) {
                    隐藏放大镜()
                }
            }, 100) // 延迟时间
        })
    }

    放大镜.addEventListener('mouseleave', () => {
        隐藏放大镜()
    });

    function 初始化放大镜() {
        if (初始化放大镜.已绑定事件代理) return
        初始化放大镜.已绑定事件代理 = true
        const bindConfigs = [
            {
                type: "default",
                container: "#ct.wodexunzhang",
                target: ".myimg img",
                delay: 50,
                touchDelay: 350,
                getId: (el) => el.getAttribute("alt"),
            },
            // 交易角-发布、交易单、勋章组合
            {
                type: "saltfish",
                container: "#ct.wodexunzhang",
                target: ".trade_medal_choice, .trade_medal, .combo_medal_img",
                delay: 50,
                touchDelay: 350,
                getId: (el) => el.querySelector("img")?.getAttribute("alt"),
            }
        ];

        const allTargetsSelector = bindConfigs.map(conf => conf.target).join(', ')
        if (!初始化放大镜.已绑定全局关闭事件) {
            初始化放大镜.已绑定全局关闭事件 = true
            document.addEventListener('pointerdown', function (event) {
                if (event.pointerType !== 'touch' || !(event.target instanceof Element)) return
                if (event.target.closest(allTargetsSelector) || 放大镜.contains(event.target)) return

                clearTimeout(timeoutId)
                隐藏放大镜()
            })
        }

        bindConfigs.forEach((conf) => {
            const tryBind = () => {
                const container = document.querySelector(conf.container)
                if (!container) return false

                let hoverTimer
                container.addEventListener('pointerover', function (event) {
                    if (!(event.target instanceof Element)) return

                    const targetEl = event.target.closest(conf.target)
                    if (!targetEl || (event.relatedTarget && targetEl.contains(event.relatedTarget))) return

                    clearTimeout(hoverTimer)
                    clearTimeout(timeoutId)

                    const delay = event.pointerType === 'touch' ? conf.touchDelay : conf.delay
                    hoverTimer = setTimeout(() => {
                        const baseAlt = conf.getId(targetEl)?.replace(/【不可购买】/g, '')
                        if (!baseAlt) return

                        const variants = new Set([
                            baseAlt,
                            baseAlt.replace(/·/g, '‧'),
                            baseAlt.replace(/‧/g, '·'),
                            baseAlt.replace(/:/g, '：'),
                            baseAlt.replace(/：/g, ':'),
                            baseAlt.slice(0, -1),
                            baseAlt.replace(/【.*?限定】/g, ''),
                        ])
                        let altKey
                        for (const v of variants) {
                            if (Object.hasOwn(放大镜内容映射表, v)) {
                                altKey = v
                                break
                            }
                        }
                        let showText = 放大镜内容映射表[altKey]
                        if (showImg && showText) showText = addImgUrl(showText)
                        if (!showText) return

                        const img = targetEl.matches('img') ? targetEl : targetEl.querySelector('img')
                        显示放大镜(showText, targetEl, conf.type)
                    }, delay)
                })

                container.addEventListener('pointerout', function (event) {
                    if (event.pointerType === 'touch' || !(event.target instanceof Element)) return

                    const targetEl = event.target.closest(conf.target)
                    if (!targetEl || (event.relatedTarget && targetEl.contains(event.relatedTarget))) return

                    clearTimeout(hoverTimer)
                    timeoutId = setTimeout(() => {
                        if (!放大镜.matches(':hover') && !targetEl.matches(':hover')) {
                            隐藏放大镜()
                        }
                    }, 100)
                })
                return true
            }

            if (tryBind()) return

            const observer = new MutationObserver((mutations, obs) => {
                if (tryBind()) obs.disconnect()
            })
            observer.observe(document.body, { childList: true, subtree: true })
        })
    }

    function 统计升级消耗(内容) {
        // 初始化消耗统计对象
        var 消耗统计 = {
            金币: 0,
            血液: 0,
            旅程: 0,
            咒术: 0,
            知识: 0,
            灵魂: 0,
            堕落: 0
        }
        const 升级消耗 = {
            文本: '',
            数字: 0
        }

        // 提取升级条件
        var 升级条件 = 内容.match(/消耗([-\d]+)\s*(金币|血液|旅程|咒术|知识|灵魂|堕落)/g)

        if (升级条件) {
            升级条件.forEach(function (条件) {
                var 消耗数值 = parseInt(条件.match(/[-\d]+/)[0])
                var 资源类型 = 条件.match(/金币|血液|旅程|咒术|知识|灵魂|堕落/)[0]
                消耗统计[资源类型] += 消耗数值
            })
        }

        // 生成消耗描述
        var 消耗描述 = Object.entries(消耗统计)
            .filter(([资源类型, 消耗数值]) => 消耗数值 !== 0)
            .map(([资源类型, 消耗数值]) => {
                var 颜色 = 属性映射[资源类型].颜色
                var emoji = 属性映射[资源类型].emoji
                return `消耗<span style="color: ${颜色}">${消耗数值}${资源类型}</span>`
            })
            .join('、')

        // 计算总消耗
        var 总消耗 = Object.entries(消耗统计)
            .reduce((总计, [资源类型, 消耗数值]) => {
                var 权重 = 收益权重映射[资源类型] || 0
                return 总计 + 消耗数值 * 权重
            }, 0)

        // 返回结果
        if (消耗描述) {
            升级消耗.文本 = `\n  【满级消耗】${消耗描述} 总计消耗${总消耗} `
            升级消耗.数字 = 总消耗
        }
        return 升级消耗
    }

    function addImgUrl(text) {
        // debugger;
        let textLines = text.split('\n');
        let name = textLines[0];
        if (!(name in imgs))
        {
            console.log(name + ' img not fonud or same');
            return text;
        }

        let max_width = 0;
        for (let key in imgs[name])
        {
            max_width = (imgs[name][key][1] > max_width) ? imgs[name][key][1] : max_width;
            if (124 == max_width)
            {
                break;
            }
        }

        // console.log(name + ' max width '+max_width);

        for(let i = 1; i < textLines.length; i++)
        {
            let lv = textLines[i].match(/【等级(\d+)】/)?.[1];
            if (lv)
            {
                lv = lv.toString();
            }
            else if (textLines[i].includes('【 Max 】'))
            {
                lv = 'Max';
            }
            else if (textLines[i].includes('【等级 初级】'))
            {
                lv = '初级';
            }
            else
            {
                continue;
            }
            if (lv in imgs[name])
            {
                let addStr = `<img src="${imgs[name][lv][0]}" width="${imgs[name][lv][1]}px" align="middle">`;
                if (imgs[name][lv][1] < max_width)
                {
                    addStr = addStr + `<img width="${max_width - imgs[name][lv][1]}px" align="middle">`;
                }
                textLines[i] = addStr + textLines[i];
            }
            else // 无图片补齐
            {
                textLines[i] = `<img width="${max_width}px" align="middle">` + textLines[i];
            }
        }

        return textLines.join("\n");
    }

    /* 插入位置 */

    // 创建控制面板()
    初始化放大镜()

})()

// 录入模板 ≥
var 录入模板 = {
    '时间变异管理局': `时间变异管理局
【勋章类型】
【入手条件】
【商店售价】
【等级1】▕▏升级条件：
【等级2】▕▏升级条件：
【等级3】▕▏升级条件：
【 Max 】`,
}
