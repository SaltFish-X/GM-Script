// ==UserScript==
// @name         GM-勋章放大镜
// @namespace    https://docs.scriptcat.org/
// @version      2.2.4
// @description  暗黑模式的勋章放大镜
// @author       1:轶致2:咸鱼鱼3:哈哈哈哈_
// @match        *://*.gamemale.com/*
// @match        *://badge.saltfish.cc.cd/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamemale.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// ==/UserScript==

function pLimit(concurrency) {
    const queue = [];
    let activeCount = 0;

    const next = () => {
        activeCount--;

        if (queue.length > 0) {
            queue.shift()();
        }
    };

    const run = async (fn, resolve, args) => {
        activeCount++;

        const result = Promise.resolve(fn(...args));

        resolve(result);

        try {
            await result;
        } finally {
            next();
        }
    };

    const enqueue = (fn, resolve, args) => {
        queue.push(run.bind(null, fn, resolve, args));

        queueMicrotask(() => {
            if (activeCount < concurrency && queue.length > 0) {
                queue.shift()();
            }
        });
    };

    return (fn, ...args) =>
        new Promise(resolve => {
            enqueue(fn, resolve, args);
        });
}

(function () {
    'use strict';

    /**
     * 勋章博物馆数据（非博物馆数据记录到后面的 medalDataNoTid 中）
     * ---
     * **MedalItem字段详细说明：**
     * - `@property {string} type` ── 类型
     * - `@property {string} no` ── 编号
     * - `@property {string} url_tid` ── 勋章博物馆帖子tid
     * - `@property {string} name` ── 勋章类型
     * - `@property {string} date` ── 勋章博物馆发帖日期
     * - `@property {string} buy_limit` ── 购买勋章的限制。无限制的时候填写 无；比较符号统一使用 ≥ ≤ > < = 单个符号。
     * - `@property {string} price` ── 商店售价
     * - `@property {string} [backstory]` ── 背景故事（可选，该字段可不存在）
     * - `@property {string} [duration]` ── 持续时长（可选，该字段可不存在）
     * - `@property {string} levels` ── 各等级的收益信息。等级间\n分隔；比较符号统一使用 ≥ ≤ > < = 单个符号。
     * - `@property {Object} levels_img` ── 各等级对应的图片信息
     *   - `["初级"]` ── 【等级 初级】的图片配置 `[url, size]`（可选）
     *   - `["1"]` ── 【等级 1】的图片配置 `[url, size]`
     *   - `[Max]` ── 【Max】最高等级的图片配置 `[url, size]`
     * ---
     * @type  {any[]}
     */

    /* 插入位置 */
const medalDataNoTid = [

    {
        "type": "剧情",
        "name": "香蕉特饮",
        "date": "2023-5-16",
        "buy_limit": "购买头衔参加【派对沙滩】活动",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗-1堕落\n【 Max 】无属性",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202305/18/130005ef6flfg3d39le6ff.gif", 40],
            "Max": ["https://img.gamemale.com/album/202305/18/130005ef6flfg3d39le6ff.gif", 40]
        }
    },
    {
        "type": "装饰/特殊",
        "name": "纯真护剑㊕",
        "date": "2023-5-31",
        "buy_limit": "灵魂≥1（儿童节限时获取）",
        "price": "100金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗0积分\n【等级2】无属性▕▏升级条件：消耗1旅程\n【等级3】无属性▕▏升级条件：消耗1旅程\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202305/30/225653vhbtcxpzhmpcephh.gif", 40],
            "2": ["https://img.gamemale.com/album/202305/30/230430rcfe70wfhcc227ch.gif", 40],
            "3": ["https://img.gamemale.com/album/202405/31/215051dao7q8kxb8ckyb76.gif", 40],
            "Max": ["https://img.gamemale.com/album/202505/25/142732mx57txt4huugxt78.gif", 40],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "爬行植物Ⓛ",
        "date": "2023-5-31",
        "buy_limit": "堕落≥100",
        "price": "10金币",
        "duration": "30天",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202410/29/135200lihoisatrrl4vl5r.png", 40],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "爬行植物Ⓡ",
        "date": "2023-5-31",
        "buy_limit": "堕落≥100",
        "price": "10金币",
        "duration": "30天",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202410/29/135200gactv9otv1ng6mcz.png", 40],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "特殊-家园卫士Ⓛ",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "5金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202304/17/012135e0wpkp26rhhkxggk.gif", 40],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "特殊-家园卫士Ⓡ",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "5金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202304/17/012143crvaj78ccv9phjrz.gif", 40],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "勋章空位插槽",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202209/08/220329y6zyw6fxr0wxwvvx.png", 40,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "16x43 隐形➀",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/225034n60h900c9g0dx0ch.png", 16,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "16x43 隐形➁",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/225034n60h900c9g0dx0ch.png", 16,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "20x43 隐形➀",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/224706c59azb9bukuuzwao.png", 20,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "20x43 隐形➁",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/224706c59azb9bukuuzwao.png", 20,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "40x43 隐形➀",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/155725wh2yij4f2azhh5f7.png", 40,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "40x43 隐形➁",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/155725wh2yij4f2azhh5f7.png", 40,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "82x43 隐形➀",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/155726pwkdxmoplgbfgeim.png", 82,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "82x43 隐形➁",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/155726pwkdxmoplgbfgeim.png", 82,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "124x43 隐形➀",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/155727j5wdbd2zkzrw0lwk.png", 124,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "124x43 隐形➁",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/155727j5wdbd2zkzrw0lwk.png", 124,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "装饰触手Ⓛ",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/170611b3mm2cgccos58uaw.gif", 40,],
        },
    },
    {
        "type": "装饰/特殊",
        "name": "装饰触手Ⓡ",
        "date": "2023-5-31",
        "buy_limit": "无",
        "price": "10金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202206/06/212912c44ty6fxiutjw6xe.gif", 40,],
        },
    },
    {
        "type": "剧情",
        "name": "『活动代币』",
        "date": "2023-9-27",
        "buy_limit": "参与2023年【秋园庆丰】中秋国庆限时活动",
        "price": "1金币",
        "duration": "7天",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗0金币\n【等级1】无属性▕▏升级条件：消耗0金币\n【等级2】无属性▕▏升级条件：消耗0金币\n【 Max 】无属性",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202310/07/000733qml4gvgpclnv4up4.gif", 40,],
            "1": ["https://img.gamemale.com/album/202310/07/000733qml4gvgpclnv4up4.gif", 40,],
            "2": ["https://img.gamemale.com/album/202305/20/185602szvpqoukkt131qm1.gif", 40,],
            "Max": ["https://img.gamemale.com/album/202310/07/000733qml4gvgpclnv4up4.gif", 40,],
        },
    },
    {
        "type": "赠礼",
        "name": "(人)血球蛋白",
        "date": "2023-10-24",
        "buy_limit": "血液≤100｜注册天数≤10｜在线时间≤100（2023年万圣夜注册新人礼，不可赠送）",
        "price": "？金币",
        "duration": "？天（可续期）",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗-1血液\n【等级1】无属性▕▏升级条件：消耗-1堕落\n【 Max 】无属性",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202310/24/122251xlzyyog4x61r8gpl.gif", 40,],
            "1": ["https://img.gamemale.com/album/202310/24/122251xlzyyog4x61r8gpl.gif", 40,],
            "Max": ["https://img.gamemale.com/album/202310/24/122251xlzyyog4x61r8gpl.gif", 40,],
        },
    },
    {
        "type": "储蓄",
        "name": "小型流动血瓶",
        "date": "2023-10-24",
        "buy_limit": "无",
        "price": "100血液",
        "duration": "14天",
        "levels": "【等级1】33% 回帖血液+1、发帖血液+1▕▏升级条件：消耗-101血液\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202310/30/220700u53vzu21r6sam72a.gif", 40,],
            "Max": ["https://img.gamemale.com/album/202310/30/220701wu9zw23rc8yya8wy.gif", 40,],
        },
    },
    {
        "type": "储蓄",
        "name": "中型储蓄血瓶",
        "date": "2023-10-24",
        "buy_limit": "无",
        "price": "1000血液",
        "duration": "14天",
        "levels": "【等级1】33% 回帖血液+1、发帖血液+1▕▏升级条件：消耗-1020血液\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202310/30/220701n7fxubrpog2sykuf.gif", 40,],
            "Max": ["https://img.gamemale.com/album/202310/30/220702s00pwipa3b0hp0ab.gif", 40,],
        },
    },
    {
        "type": "储蓄",
        "name": "大型贮藏血瓶",
        "date": "2023-10-24",
        "buy_limit": "无",
        "price": "10000血液",
        "duration": "14天",
        "levels": "【等级1】33% 回帖血液+1、发帖血液+1▕▏升级条件：消耗-10050血液\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202310/30/220702bbclgqglglclvlll.gif", 40,],
            "Max": ["https://img.gamemale.com/album/202310/30/220703mvhqqqv9iqrfvf7c.gif", 40,],
        },
    },
    {
        "type": "剧情",
        "name": "『酒馆蛋煲』",
        "date": "2023-11-2",
        "buy_limit": "灵魂≥1｜发帖数≥10（2023年【垭道酒馆】活动期间）",
        "price": "10金币",
        "duration": "1天（可续期）",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202311/03/120708iaw8la01kii0ivl5.gif", 40,],
        },
    },
    {
        "type": "赠礼",
        "name": "格雷的扑克牌",
        "date": "2024-3-5",
        "buy_limit": "2024年【格雷的危险魔术】活动期间，只能赠送",
        "price": "13金币",
        "duration": "13天",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗-1血液\n【 Max 】13% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202403/07/192920c7qq2dfq4d44riaq.gif", 40,],
            "Max": ["https://img.gamemale.com/album/202403/07/192921zu552xd115ku4gbe.gif", 40,],
        },
    },
    {
        "type": "赠礼",
        "name": "？？？粽子",
        "date": "2023-6-22",
        "buy_limit": "2023年端午节期间，只能赠送",
        "price": "？金币",
        "duration": "？天",
        "levels": "【 Max 】1% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202006/25/115630lwggmn7py3wnnpes.gif", 40,],
        },
    },
    {
        "type": "剧情",
        "name": "『转生经筒』",
        "date": "2023-1-4",
        "buy_limit": "签到天数≥1460，灵魂≥1（限时活动）",
        "price": "1旅程",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202307/01/075509auuke2lwximkxlwm.gif", 40,],
        },
    },
    {
        "type": "剧情",
        "name": "『绿茵甘露』",
        "date": "2023-6-22",
        "buy_limit": "主题数≥1（【派遣远征s1】活动）",
        "price": "1金币",
        "duration": "14天",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202504/22/150929asgg6iuggqunggq6.gif", 40,],
        },
    },
    {
        "type": "赠礼",
        "name": "GM马年红包",
        "date": "2026-2-16",
        "buy_limit": "2026春节期间，只可赠送",
        "price": "1金币",
        "duration": "15天",
        "levels": "【等级1】无属性▕▏升级条件：消耗-1金币\n【 Max 】1% 回帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/020713buuwu66q660wfr60.gif", 40,],
            "Max": ["https://img.gamemale.com/album/202602/15/020714sz61kt1xv7x14l1l.gif", 40,],
        },
    },
]
const medalData = [
    {
        "type": "奖品",
        "no": "0683",
        "url_tid": "188278",
        "name": "霉运小精灵[红]",
        "date": "2026-6-10",
        "buy_limit": "限定活动安慰奖（听说收集三只能够兑换不得了的奖励）",
        "price": "0金币",
        "levels": "【 Max 】1% 回帖血液-1、发帖灵魂+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202606/09/023747o34vdyv28myyoxmo.gif", 40]
        }
    },
    {
        "type": "职业",
        "no": "0682",
        "url_tid": "187542",
        "name": "游侠职业证书",
        "date": "2026-6-9",
        "buy_limit": "等级=Lv10，灵魂≥3，金币≥5000，旅程≥500",
        "price": "999金币",
        "levels": "【等级1】10% 发帖金币+1▕▏升级条件：知识≥500\n【等级2】15% 发帖金币+1▕▏升级条件：总积分≥1500\n【等级3】20% 发帖金币+1▕▏升级条件：知识≥1500\n【 Max 】25% 发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/08/152640sj0jj7bxiax7iaks.png", 40],
            "2": ["https://img.gamemale.com/album/202606/08/152640sj0jj7bxiax7iaks.png", 40],
            "3": ["https://img.gamemale.com/album/202606/08/143153gnllhhrn33yntqhn.gif", 40],
            "Max": ["https://img.gamemale.com/album/202606/08/155532i2clxhqxs5kf22uh.gif", 40]
        }
    },
    {
        "type": "职业",
        "no": "0681",
        "url_tid": "187541",
        "name": "法师职业证书",
        "date": "2026-6-9",
        "buy_limit": "等级=Lv10，灵魂≥3，咒术≥1000，旅程≥500",
        "price": "999金币",
        "levels": "【等级1】10% 发帖咒术+1▕▏升级条件：知识≥500\n【等级2】15% 发帖咒术+1▕▏升级条件：总积分≥1500\n【等级3】20% 发帖咒术+1▕▏升级条件：知识≥1500\n【 Max 】25% 发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/08/152640pk3gnjsz980oqjoc.png", 40],
            "2": ["https://img.gamemale.com/album/202606/08/152640pk3gnjsz980oqjoc.png", 40],
            "3": ["https://img.gamemale.com/album/202606/08/143153x4igbr0s34o3z3wz.gif", 40],
            "Max": ["https://img.gamemale.com/album/202606/08/155533bztp60vs2kh56e8p.gif", 40]
        }
    },
    {
        "type": "职业",
        "no": "0680",
        "url_tid": "187538",
        "name": "战士职业证书",
        "date": "2026-6-9",
        "buy_limit": "等级=Lv10，灵魂≥3，血液≥5000，旅程≥500",
        "price": "999金币",
        "levels": "【等级1】10% 发帖血液+1▕▏升级条件：知识≥500\n【等级2】15% 发帖血液+1▕▏升级条件：总积分≥1500\n【等级3】20% 发帖血液+1▕▏升级条件：知识≥1500\n【 Max 】25% 发帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/08/152640t0dzq0l55005sw0n.png", 40],
            "2": ["https://img.gamemale.com/album/202606/08/152640t0dzq0l55005sw0n.png", 40],
            "3": ["https://img.gamemale.com/album/202606/08/143153f9ltezetph66ohoz.gif", 40],
            "Max": ["https://img.gamemale.com/album/202606/08/155533e28l99t182x92t99.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0679",
        "url_tid": "187538",
        "name": "GM夏日霜淇淋",
        "date": "2026-6-9",
        "buy_limit": "只可赠送，金币≥30",
        "price": "25金币",
        "duration": "10天",
        "levels": "【等级1】2% 回帖血液+2▕▏升级条件：消耗15金币\n【等级2】6% 回帖血液+2▕▏升级条件：消耗20金币\n【 Max 】12% 回帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152121obtg7t7r7t0r1p2k.gif", 40],
            "2": ["https://img.gamemale.com/album/202606/07/152122jx2l8ntxdn58xt7d.gif", 40],
            "Max": ["https://img.gamemale.com/album/202606/07/152123np5p6eauefeszi7j.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0678",
        "url_tid": "187537",
        "name": "炉石传说",
        "date": "2026-6-9",
        "buy_limit": "知识≥50",
        "price": "100金币",
        "levels": "【等级1】1% 回帖咒术+1▕▏升级条件：消耗1咒术\n【等级2】1% 回帖咒术+1▕▏升级条件：消耗1咒术\n【等级3】2% 回帖咒术+1▕▏升级条件：消耗1咒术\n【等级4】2% 回帖咒术+1▕▏升级条件：消耗1咒术\n【等级5】1% 回帖旅程+1▕▏升级条件：消耗100金币\n【等级6】1% 回帖知识+1▕▏升级条件：消耗-1知识\n【等级7】2% 回帖旅程+1▕▏升级条件：在线时间≥1000\n【 Max 】3% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152447wqzmov03mpl30mol.gif", 124],
            "2": ["https://img.gamemale.com/album/202606/07/152448ljgd3ogmjj75ggj7.gif", 124],
            "3": ["https://img.gamemale.com/album/202606/07/152449tkmkpsm0wl3swzk4.gif", 124],
            "4": ["https://img.gamemale.com/album/202606/07/152451xdfp3a7pf5nf7wvz.gif", 124],
            "5": ["https://img.gamemale.com/album/202606/07/152452mm8vmgxm2pbq9xml.gif", 124],
            "6": ["https://img.gamemale.com/album/202606/07/152453n81tty1p3t1pdsoz.gif", 124],
            "7": ["https://img.gamemale.com/album/202606/07/152454r6x71gh8h3cgz764.gif", 124],
            "Max": ["https://img.gamemale.com/album/202606/07/152455zxo3xu1q2mq3uwk2.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0677",
        "url_tid": "187535",
        "name": "童年的蛋",
        "date": "2026-6-9",
        "buy_limit": "血液≥200",
        "price": "520金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗500金币\n【等级2】10% 回帖血液+2▕▏升级条件：在线时间≥1314\n【 Max 】15% 回帖血液+3 金币-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152410bx005qpjx5zkzp0p.gif", 40],
            "2": ["https://img.gamemale.com/album/202606/07/152411a5w1yylzblw84bdm.gif", 82],
            "Max": ["https://img.gamemale.com/album/202606/07/152411t8x8kkxkkhkultuw.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0676",
        "url_tid": "187534",
        "name": "星莹水晶",
        "date": "2026-6-9",
        "buy_limit": "咒术≥30",
        "price": "500金币",
        "levels": "【等级1】3% 回帖咒术+1▕▏升级条件：消耗500金币\n【等级2】5% 回帖咒术+1 血液+1▕▏升级条件：消耗180咒术\n【 Max 】12% 回帖金币+1 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152419ddvp1jz2d2jdpz3p.gif", 40],
            "2": ["https://img.gamemale.com/album/202606/07/152421hhgqggqh0zhj26jg.gif", 40],
            "Max": ["https://img.gamemale.com/album/202606/07/152422a1vdzzi61e5q22iz.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0675",
        "url_tid": "187532",
        "name": "辉光心相元石",
        "date": "2026-6-9",
        "buy_limit": "血液≥1150",
        "price": "500金币",
        "levels": "【等级1】1% 回帖旅程+1▕▏升级条件：消耗1150血液\n【等级2】2% 回帖旅程+1▕▏升级条件：灵魂≥1\n【 Max 】2% 回帖旅程+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152338jq1auxi5xq3395ad.gif", 40],
            "2": ["https://img.gamemale.com/forum/202606/09/211013zdjsqty0pf4ynpan.gif", 40],
            "Max": ["https://img.gamemale.com/album/202606/07/152340n3i03u0zuu2uo0hc.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0674",
        "url_tid": "187531",
        "name": "捕梦笼",
        "date": "2026-6-9",
        "buy_limit": "无",
        "price": "345金币",
        "levels": "【等级1】10% 回帖金币+1▕▏升级条件：消耗321血液\n【等级2】3% 回帖咒术+2 血液+1▕▏升级条件：堕落≥777\n【 Max 】9% 回帖咒术+1 血液-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152153vkwlvnq00ztkl2l5.gif", 40],
            "2": ["https://img.gamemale.com/album/202606/07/152154jjo5e5jjznfmjpoz.gif", 40],
            "Max": ["https://img.gamemale.com/album/202606/07/152156kw122xkndg0g6xnu.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0673",
        "url_tid": "187530",
        "name": "暗蚀魔典",
        "date": "2026-6-9",
        "buy_limit": "堕落≥14",
        "price": "666血液",
        "backstory": "<a href='/thread-187886-1-1.html' target='_blank'>暗蚀魔典：蚀黯圣辉（点击跳转）</a>",
        "levels": "【等级1】4% 回帖血液-1 堕落+1▕▏升级条件：堕落≥44\n【等级2】14% 回帖血液-1 堕落+1▕▏升级条件：堕落≥444\n【等级3】24% 回帖血液-1 堕落+1▕▏升级条件：堕落≥4444\n【等级4】34% 回帖血液-1 堕落+1▕▏升级条件：消耗1灵魂\n【等级5】54% 回帖血液-1 金币+1▕▏升级条件：堕落>4444\n【 Max 】54% 回帖金币-1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152137ju1vqkgr8q88szs0.gif", 40],
            "2": ["https://img.gamemale.com/album/202606/07/152138zsez4metggsmtkem.gif", 40],
            "3": ["https://img.gamemale.com/album/202606/07/152139sj9ugge1w65gggt7.gif", 40],
            "4": ["https://img.gamemale.com/album/202606/07/152140dgkl6xl1gb4j2fjx.gif", 40],
            "5": ["https://img.gamemale.com/album/202606/09/220715m00a0sq2yj0tttji.gif", 40],
            "Max": ["https://img.gamemale.com/album/202606/07/152143i0d84s44f88401ts.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0672",
        "url_tid": "187529",
        "name": "玄甲金盾",
        "date": "2026-6-9",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】1% 回帖咒术+2▕▏升级条件：消耗200血液\n【等级2】勋章博物馆资料暂缺\n【 Max 】3% 回帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152430g74xv0etd74ddvda.gif", 40],
            "2": ["", 40],
            "Max": ["https://img.gamemale.com/album/202606/07/152432wmb2xaxk55saz2n2.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0671",
        "url_tid": "187527",
        "name": "腐坏之剑",
        "date": "2026-6-9",
        "buy_limit": "堕落≥200",
        "price": "1000金币",
        "levels": "【等级1】10% 回帖金币+1▕▏升级条件：消耗1000血液\n【等级2】10% 回帖金币+2▕▏升级条件：血液≥3000\n【 Max 】14% 回帖金币+1 血液+2、发帖金币+1 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/08/142133b4o3d4ct5cef3ort.gif", 40],
            "2": ["https://img.gamemale.com/album/202606/07/152329xck5icesss95xcl8.gif", 82],
            "Max": ["https://img.gamemale.com/album/202606/08/142135oo4qq9oy94y84yly.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0670",
        "url_tid": "187525",
        "name": "斯科特·温德尔",
        "date": "2026-6-9",
        "buy_limit": "主题数≥5",
        "price": "400金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：消耗299血液\n【等级2】8% 回帖血液+1 堕落+1▕▏升级条件：在线时间≥365\n【等级3】10% 回帖血液+1 金币+1▕▏升级条件：灵魂≥1\n【 Max 】3% 回帖金币+2 旅程+1 堕落-1、发帖金币+2 旅程+1 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152358ikevjb4vlq3vvvkr.gif", 40],
            "2": ["https://img.gamemale.com/forum/202603/08/213133z4ypqz39lqyek8cq.gif", 40],
            "3": ["https://img.gamemale.com/album/202606/07/152400bz137v2lbd9dcie3.gif", 82],
            "Max": ["https://img.gamemale.com/forum/202603/09/210232d7hogpdl0d1zgvt6.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0669",
        "url_tid": "187522",
        "name": "凯文·沃克",
        "date": "2026-6-9",
        "buy_limit": "主题数≥5",
        "price": "400金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗299金币\n【等级2】8% 回帖金币+1 血液+1▕▏升级条件：在线时间≥365\n【等级3】8% 回帖血液-1 堕落+1▕▏升级条件：旅程≥81\n【 Max 】9% 回帖金币+1 血液+2 堕落-1、发帖金币+1 血液+2 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152346kjn7cc060r22rvc7.gif", 40],
            "2": ["https://img.gamemale.com/forum/202603/08/213132pgcq9s9yzkyyvzkk.gif", 82],
            "3": ["https://img.gamemale.com/album/202606/07/152348lyy5s5py5y2tsu5t.gif", 40],
            "Max": ["https://img.gamemale.com/forum/202603/08/213132j2rh3rhijh9lflhw.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0668",
        "url_tid": "187521",
        "name": "荒漠屠夫",
        "date": "2026-6-9",
        "buy_limit": "无",
        "price": "520金币",
        "levels": "【等级1】4% 回帖金币+2▕▏升级条件：消耗333血液\n【等级2】8% 回帖金币+2▕▏升级条件：消耗444血液\n【等级3】10% 回帖金币+2▕▏升级条件：堕落≥888\n【等级4】12% 回帖金币+3▕▏升级条件：消耗888血液\n【 Max 】14% 回帖金币+3、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202606/07/152333g22qb47xb7w9zr00.gif", 40],
            "2": ["https://img.gamemale.com/album/202606/07/152334o4i4772i5pj06i8d.gif", 82],
            "3": ["https://img.gamemale.com/album/202606/07/152335qjx4fugq0heff42p.gif", 82],
            "4": ["https://img.gamemale.com/album/202606/07/152336llu24x7a2xta2lu3.gif", 82],
            "Max": ["https://img.gamemale.com/album/202606/07/152337pwzj25n5vffw5o2f.gif", 82]
        }
    },
    {
        "type": "剧情",
        "no": "0667",
        "url_tid": "186610",
        "name": "『领甜甜圈』",
        "date": "2026-5-22",
        "buy_limit": "填写2026【调查问卷】村民们喜欢的活动类型",
        "price": "0旅程",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗1金币\n【等级1】无属性▕▏升级条件：消耗1金币\n【等级2】无属性▕▏升级条件：消耗1金币\n【 Max 】无属性",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202301/28/151124vrgn60rdx93kkr30.gif", 40],
            "1": ["https://img.gamemale.com/album/202605/22/200614wvwvoq3d8qfo1cfn.gif", 40],
            "2": ["https://img.gamemale.com/album/202605/22/200613eaa3lr8u89ud6ww9.gif", 40],
            "Max": ["https://img.gamemale.com/album/202605/22/200807f2mk3m62enig56g6.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0666",
        "url_tid": "185968",
        "name": "紫粹露饮",
        "date": "2026-5-9",
        "buy_limit": "2026劳动节活动【春露华浓】获得5积分",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202605/09/165730z50cd6o2op0052dm.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0665",
        "url_tid": "185967",
        "name": "瑰香蜜露",
        "date": "2026-5-9",
        "buy_limit": "2026劳动节活动【春露华浓】获得10积分",
        "price": "无",
        "levels": "【 Max 】1% 回帖金币+1 血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202605/09/165728dgoyige5gg05cg06.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0664",
        "url_tid": "184962",
        "name": "全息投影蛋",
        "date": "2026-5-1",
        "buy_limit": "金币≥1000",
        "price": "500金币",
        "levels": "【等级1】10% 回帖金币+1 堕落-1▕▏升级条件：消耗350金币\n【等级2】15% 回帖金币+1 堕落-1▕▏升级条件：消耗650金币\n【 Max 】15% 回帖金币+2 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202604/29/111602mseeng2serygvry2.gif", 40],
            "2": ["https://img.gamemale.com/album/202604/29/111603i4pqzw0pie00sz4z.gif", 40],
            "Max": ["https://img.gamemale.com/album/202604/29/111603uliheseipfappb5p.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0663",
        "url_tid": "184961",
        "name": "酸涩葡萄",
        "date": "2026-5-1",
        "buy_limit": "在线时间≥50",
        "price": "450金币",
        "levels": "【等级1】1% 回帖金币+1▕▏升级条件：消耗180金币\n【等级2】5% 回帖金币+1▕▏升级条件：在线时间≥500\n【等级3】10% 回帖金币+2 血液-1▕▏升级条件：在线时间≥1000\n【等级4】10% 回帖金币+2▕▏升级条件：消耗888血液\n【 Max 】10% 回帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202604/29/111556hny7lnfnnmn6nnly.gif", 40],
            "2": ["https://img.gamemale.com/forum/202605/01/083646xwngugfmm5elem1m.gif", 40],
            "3": ["https://img.gamemale.com/album/202604/29/111558a98t7p8s9raakq9g.gif", 40],
            "4": ["https://img.gamemale.com/album/202604/29/111559zq6juul5z96w6l6l.gif", 40],
            "Max": ["https://img.gamemale.com/album/202604/29/111600o99zdu9d5gck15dc.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0662",
        "url_tid": "184960",
        "name": "破碎方舟",
        "date": "2026-5-1",
        "buy_limit": "旅程≥20",
        "price": "500金币",
        "levels": "【等级1】5% 回帖血液-1 金币+2▕▏升级条件：消耗200血液\n【等级2】15% 回帖血液+1▕▏升级条件：消耗200金币\n【等级3】15% 回帖金币+1▕▏升级条件：灵魂≥1\n【 Max 】10% 回帖金币+3 血液-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202604/29/111551d2p6nwgrvhjzpnhv.gif", 40],
            "2": ["https://img.gamemale.com/album/202604/29/111551zu2l9ozuuyhy1qum.gif", 40],
            "3": ["https://img.gamemale.com/album/202604/29/111553ym112ol1eua3oqoo.gif", 40],
            "Max": ["https://img.gamemale.com/album/202604/29/111555tyk1no0v11vjkkjn.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0661",
        "url_tid": "184959",
        "name": "一袋粉末",
        "date": "2026-5-1",
        "buy_limit": "主题数≥10",
        "price": "1000金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗288金币\n【等级2】10% 回帖金币+1▕▏升级条件：消耗488金币\n【等级3】10% 回帖金币+2▕▏升级条件：消耗688金币\n【 Max 】10% 回帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202604/29/111605yp6nncclr4copoe6.gif", 40],
            "2": ["https://img.gamemale.com/album/202604/29/111606r0mpepheg7zmz1k7.gif", 40],
            "3": ["https://img.gamemale.com/album/202604/29/111606bwznznk3f43mkk7c.gif", 40],
            "Max": ["https://img.gamemale.com/album/202604/29/111609pr757diyrcu7rr6l.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0660",
        "url_tid": "184956",
        "name": "龙衔金戒",
        "date": "2026-5-1",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】1% 回帖知识+1▕▏升级条件：消耗200血液\n【等级2】3% 回帖知识+1 堕落+2▕▏升级条件：堕落≥20\n【 Max 】2% 回帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202604/29/111546boe2deev9pvdlwem.gif", 40],
            "2": ["https://img.gamemale.com/album/202604/29/113127duy0em39v9mcfuyu.gif", 40],
            "Max": ["https://img.gamemale.com/album/202604/29/111550wuo2pnpl2ucel866.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0659",
        "url_tid": "184955",
        "name": "凤环金佩",
        "date": "2026-5-1",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】10% 回帖血液+1▕▏升级条件：消耗200血液\n【等级2】11% 回帖血液+3 堕落+1▕▏升级条件：堕落≥20\n【 Max 】10% 回帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202604/29/113122m1fotr3krki3q7bk.gif", 40],
            "2": ["https://img.gamemale.com/album/202604/29/113123prror7eee4eze40r.gif", 40],
            "Max": ["https://img.gamemale.com/album/202604/29/111541s8kqoofqz5k58e8e.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0658",
        "url_tid": "184953",
        "name": "调香师",
        "date": "2026-5-1",
        "buy_limit": "追随≥15",
        "price": "588金币",
        "levels": "【等级1】2% 回帖血液+1▕▏升级条件：消耗777血液\n【等级2】2% 回帖旅程+1▕▏升级条件：消耗77咒术\n【等级3】4% 回帖咒术+1 堕落+1▕▏升级条件：堕落≥377\n【 Max 】6% 回帖咒术+2 血液-3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202604/29/111512juud1bj4wn092260.gif", 40],
            "2": ["https://img.gamemale.com/album/202604/29/111515sx3zu0t3u5r31uat.gif", 82],
            "3": ["", 82],
            "Max": ["https://img.gamemale.com/album/202604/29/111520sybrb4jhnsbn9rei.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0657",
        "url_tid": "184952",
        "name": "哈尔辛",
        "date": "2026-5-1",
        "buy_limit": "追随≥66",
        "price": "888金币",
        "levels": "【等级1】5% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗365咒术\n【等级2】6% 回帖咒术+1、发帖旅程+1▕▏升级条件：消耗1350金币\n【等级3】9% 回帖金币+3 堕落+1、发帖旅程+1 堕落+1▕▏升级条件：追随≥999\n【等级4】5% 回帖旅程+1 知识+1、发帖旅程+1 知识+1▕▏升级条件：堕落≥19\n【 Max 】3% 回帖旅程+1 知识+1、发帖旅程+1 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202604/29/111523wqxllbjlq3l3jt13.gif", 40],
            "2": ["https://img.gamemale.com/album/202604/29/111524se148tdebeecct0e.gif", 82],
            "3": ["https://img.gamemale.com/album/202604/29/111526rjr96i8y97b64z09.gif", 82],
            "4": ["https://img.gamemale.com/album/202604/29/111527hdm9fzupyaibau9u.gif", 82],
            "Max": ["https://img.gamemale.com/album/202604/29/111529o7v1kk401b2k0217.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0656",
        "url_tid": "184114",
        "name": "揄人者冠冕",
        "date": "2026-4-11",
        "buy_limit": "参与2026【揄人假面】活动",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+2",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202604/10/121320kx7wf7v7fwi4txv2.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0655",
        "url_tid": "184113",
        "name": "不拘一格",
        "date": "2026-4-11",
        "buy_limit": "参与2026【揄人假面】活动",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1 金币+1 堕落+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202604/10/121321ufm1ax5bqte1oh21.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0654",
        "url_tid": "182036",
        "name": "『宝莲灯』",
        "date": "2026-3-3",
        "buy_limit": "主题数≥1，发帖数≥1，在线时间≥1，注册天数≥1，旅程≥1，追随≥1，堕落≥1",
        "price": "1堕落",
        "levels": "【等级 初级】无属性▕▏升级条件：主题数≥2\n【等级1】无属性▕▏升级条件：主题数≥5\n【等级2】无属性▕▏升级条件：主题数≥10\n【 Max 】无属性",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202301/28/151124vrgn60rdx93kkr30.gif", 40],
            "1": ["https://img.gamemale.com/album/202603/03/084241eb3dmoo1j14otdgv.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/21/195015njza99m3ddaj3rl7.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/21/200008pszcuaumfrbk66cr.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0653",
        "url_tid": "181956",
        "name": "火玛瑙",
        "date": "2026-3-2",
        "buy_limit": "参与2026【花马金裘】马年新春活动",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202602/16/181902wz6266vb8vxjvzb8.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0652",
        "url_tid": "180145",
        "name": "飘飘",
        "date": "2026-2-17",
        "buy_limit": "只可赠送",
        "price": "15金币",
        "duration": "5天",
        "levels": "【等级1】3% 回帖金币-1▕▏升级条件：堕落≥100\n【等级2】5% 回帖金币-1▕▏升级条件：消耗1血液\n【 Max 】15% 回帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/020038i2okostvqteztkkl.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/020039kplt8ld8n85udvpf.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/020040aajpnwe1ipkjzbub.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0651",
        "url_tid": "180143",
        "name": "青苹果",
        "date": "2026-2-17",
        "buy_limit": "只可赠送",
        "price": "25金币",
        "duration": "7天",
        "levels": "【等级1】1% 回帖血液-1▕▏升级条件：消耗7血液\n【等级2】3% 回帖金币+1▕▏升级条件：消耗7金币\n【等级3】5% 回帖金币+1 血液+1▕▏升级条件：消耗7咒术\n【 Max 】7% 回帖咒术+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/020045hvnqkvskydgzshvv.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/020046b5s7c1sj5dydd91u.gif", 40],
            "3": ["https://img.gamemale.com/album/202602/15/020047fs3wc3hrlllasmfs.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/020048u73vzeee7rev53kh.gif", 40]
        }
    },
    {
        "type": "天赋",
        "no": "0650",
        "url_tid": "180142",
        "name": "生命赞歌",
        "date": "2026-2-17",
        "buy_limit": "精华帖数≥1，主题数≥5",
        "price": "无",
        "levels": "【等级1】3% 回帖知识+1、发帖知识+1▕▏升级条件：精华数≥2\n【等级2】4% 回帖旅程+1、发帖旅程+1▕▏升级条件：精华数≥3\n【等级3】6% 回帖金币+3 血液+3、发帖金币+5 血液+5▕▏升级条件：精华数≥5\n【 Max 】9% 回帖金币+3 血液+3、发帖金币+5 血液+5 旅程+1 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/014226riiipif5i1dpilc3.gif", 82],
            "2": ["https://img.gamemale.com/album/202602/15/014228p7096lummul6budd.gif", 82],
            "3": ["https://img.gamemale.com/album/202602/15/014229x71hg4ksrk114net.gif", 82],
            "Max": ["https://img.gamemale.com/album/202602/15/014230hg87puobuu2u255g.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0649",
        "url_tid": "180139",
        "name": "呓语魔典",
        "date": "2026-2-17",
        "buy_limit": "无",
        "price": "233金币",
        "levels": "【等级1】1% 回帖堕落+1▕▏升级条件：消耗233咒术\n【等级2】5% 回帖咒术+1▕▏升级条件：消耗1旅程\n【等级3】3% 回帖旅程+1▕▏升级条件：消耗1旅程\n【等级4】3% 回帖旅程+1▕▏升级条件：消耗1旅程\n【等级5】3% 回帖旅程+1▕▏升级条件：消耗1旅程\n【等级6】3% 回帖旅程+1▕▏升级条件：消耗-4旅程\n【等级7】10% 回帖堕落+1 咒术 +1▕▏升级条件：堕落>233\n【等级8】1% 回帖堕落-2 金币+3 血液+3▕▏升级条件：堕落>2333\n【 Max 】100% 回帖金币+0 血液+0 咒术+0 知识+0 旅程+0",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/024149v0fm05f22d4l9303.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/024149kk658t7iix06zrx8.gif", 40],
            "3": ["https://img.gamemale.com/album/202602/15/024150czl8r84g964cmr39.gif", 40],
            "4": ["https://img.gamemale.com/album/202602/15/024150oughvuhgaudzhuu1.gif", 40],
            "5": ["https://img.gamemale.com/album/202602/15/024151ujdpzoo0aom79ydz.gif", 40],
            "6": ["https://img.gamemale.com/album/202602/15/024154c8sh3pmezyff1p2t.gif", 82],
            "7": ["https://img.gamemale.com/album/202602/15/024154zh0h9hpev4492pme.gif", 40],
            "8": ["https://img.gamemale.com/album/202602/15/024155dcohwu9uop5iom5c.gif", 40],
            "Max": ["https://img.gamemale.com/forum/202602/12/233030y11fgdnfk8k8amzm.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0648",
        "url_tid": "180138",
        "name": "骷髅项链",
        "date": "2026-2-17",
        "buy_limit": "堕落≥30",
        "price": "250金币",
        "levels": "【等级1】2% 回帖堕落+1、发帖堕落+1▕▏升级条件：消耗150血液\n【等级2】4% 回帖堕落+1、发帖咒术+1 堕落+1▕▏升级条件：消耗150金币\n【等级3】6% 回帖堕落+1、发帖咒术+1 堕落+1▕▏升级条件：消耗200血液\n【 Max 】8% 回帖咒术+1 堕落+2 金币-1、发帖咒术+1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/023715hywwqiw3q20em7is.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/023716n5d7055dw8atqxwz.gif", 40],
            "3": ["https://img.gamemale.com/album/202602/15/023716t71xn0xllcjqfrfr.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/023719auw2jt42l4juxjps.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0647",
        "url_tid": "180137",
        "name": "光辉女郎",
        "date": "2026-2-17",
        "buy_limit": "知识≥13",
        "price": "1350血液",
        "levels": "【等级1】6% 回帖血液+1▕▏升级条件：主题数>60\n【等级2】6% 回帖血液+2▕▏升级条件：追随≥600\n【等级3】6% 回帖血液+3▕▏升级条件：消耗1灵魂\n【等级4】10% 回帖血液+3▕▏升级条件：咒术≥1600\n【等级5】14% 回帖咒术-1 金币+3 血液+3▕▏升级条件：堕落≥130\n【 Max 】16% 回帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/012802tiggifsqaiiqnz5h.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/012804jodzhdmdvotmp8bt.gif", 82],
            "3": ["https://img.gamemale.com/album/202602/15/012809lckkpapj90jzc7yc.gif", 82],
            "4": ["https://img.gamemale.com/album/202602/15/012811c6cdqd7szweid3q4.gif", 82],
            "5": ["https://img.gamemale.com/album/202602/15/012814b777j2hdjkdk2l0b.gif", 124],
            "Max": ["https://img.gamemale.com/album/202602/15/012816gd7ugbqty8hpq7s2.gif", 82]
        }
    },
    {
        "type": "女从",
        "no": "0646",
        "url_tid": "180136",
        "name": "琴瑟仙女",
        "date": "2026-2-17",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】3% 回帖旅程+1▕▏升级条件：旅程≥130\n【等级2】50% 回帖旅程+1▕▏升级条件：旅程≥131\n【等级3】2% 回帖旅程+1▕▏升级条件：旅程≥300\n【等级4】1% 回帖旅程+1▕▏升级条件：消耗80咒术\n【等级5】3% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗-30血液\n【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/012504t52bh0pzip23kvkv.gif", 40],
            "2": ["https://img.gamemale.com/forum/202601/14/172728i6crkqn6b2k9xc22.gif", 82],
            "3": ["https://img.gamemale.com/album/202602/15/012513ckjwpcppzcmc1vjw.gif", 82],
            "4": ["https://img.gamemale.com/album/202602/15/012518fvqvfzdn6vfo531d.gif", 82],
            "5": ["https://img.gamemale.com/album/202602/15/012532v65r8krurmr1t586.gif", 124],
            "Max": ["https://img.gamemale.com/forum/202601/14/175143qocasmfm44cjomfz.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0645",
        "url_tid": "180135",
        "name": "威尔·格雷厄姆",
        "date": "2026-2-17",
        "buy_limit": "无",
        "price": "664金币",
        "levels": "【等级1】3% 回帖金币+1▕▏升级条件：消耗500血液\n【等级2】6% 回帖金币+1▕▏升级条件：主题数≥50\n【等级3】9% 回帖金币+3 血液-1▕▏升级条件：消耗800血液\n【等级4】12% 回帖金币+3 血液-1▕▏升级条件：消耗123咒术\n【 Max 】16% 回帖金币+3 血液-1、发帖金币+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/010505gx44vmuj4os10d0x.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/010522r3bu0utabysiayvy.gif", 82],
            "3": ["https://img.gamemale.com/album/202602/15/010527zlz5p85pz4fh4288.gif", 82],
            "4": ["https://img.gamemale.com/album/202602/15/010532mg6wiugd3vbbbgcu.gif", 82],
            "Max": ["https://img.gamemale.com/album/202602/15/010542z7ukxkqp48kjk7kw.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0644",
        "url_tid": "180134",
        "name": "果体蝙蝠侠",
        "date": "2026-2-17",
        "buy_limit": "在线时间≥365",
        "price": "365血液",
        "levels": "【等级1】11% 回帖金币+1▕▏升级条件：消耗1888金币\n【等级2】33% 回帖金币+1▕▏升级条件：在线时间≥8760\n【 Max 】66% 回帖金币+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/010245k13kplflzi2djzjd.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/002618a6yfmyigkgk7y6ga.gif", 82],
            "Max": ["https://img.gamemale.com/album/202602/15/002627sjzjjpq2hnnp2j6p.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0643",
        "url_tid": "180133",
        "name": "塞拉斯",
        "date": "2026-2-17",
        "buy_limit": "堕落≥36",
        "price": "500金币",
        "levels": "【等级1】3% 回帖堕落+1 金币+1 咒术+1▕▏升级条件：消耗500金币\n【等级2】5% 回帖堕落+1 金币+1 咒术+1▕▏升级条件：消耗500血液\n【 Max 】8% 回帖堕落+1 金币+1 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/002641izs0mdkrta7advfv.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/002644p78wc212ws82q1v8.gif", 82],
            "Max": ["https://img.gamemale.com/album/202602/15/002646fywom7xw0vwzev5v.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0642",
        "url_tid": "180132",
        "name": "鲁纳尔",
        "date": "2026-2-17",
        "buy_limit": "无",
        "price": "600金币",
        "levels": "【等级1】2% 回帖血液+3▕▏升级条件：消耗74金币\n【等级2】5% 回帖血液+3▕▏升级条件：知识≥74\n【等级3】7% 回帖血液+3▕▏升级条件：追随≥80\n【 Max 】9% 回帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/002605o544vi548gkrpczs.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/002606pk5jttjedi4i9d9e.gif", 82],
            "3": ["https://img.gamemale.com/album/202602/15/002608rws1pwdnd4hyns5p.gif", 82],
            "Max": ["https://img.gamemale.com/album/202602/15/002610d6epw65swlzppddw.gif", 82]
        }
    },
    {
        "type": "宠物",
        "no": "0641",
        "url_tid": "180131",
        "name": "爱心的蛋",
        "date": "2026-2-17",
        "buy_limit": "旅程≥14",
        "price": "401金币",
        "levels": "【等级1】1% 回帖金币+1▕▏升级条件：消耗14咒术\n【等级2】9% 回帖金币+1▕▏升级条件：消耗140血液\n【 Max 】9% 回帖咒术+1 金币-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/015009tnwygjwqnujsw6uq.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/015011kl0a67x838qplwqq.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/015013tlysrctvqndtrdkg.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0640",
        "url_tid": "180130",
        "name": "行走的蛋",
        "date": "2026-2-17",
        "buy_limit": "无",
        "price": "250金币",
        "levels": "【等级1】1% 回帖旅程+1、发帖旅程+1▕▏升级条件：好友数>50\n【等级2】2% 回帖旅程+1、发帖旅程+1▕▏升级条件：好友数>100\n【 Max 】3% 回帖旅程+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/015002breyz5xaqtqnh1a3.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/015002a6ss3e70077xbsff.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/015004aa1s3q1031ml1eeo.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0639",
        "url_tid": "180129",
        "name": "远行藤蔓",
        "date": "2026-2-17",
        "buy_limit": "旅程≥15",
        "price": "300金币",
        "levels": "【等级1】1% 回帖旅程+1 血液+1▕▏升级条件：消耗100血液\n【等级2】2% 回帖旅程+1 血液+1▕▏升级条件：消耗200金币\n【 Max 】3% 回帖旅程+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/024145yscmc9iep5w9ypw6.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/024146ib761dsvgazgyb0c.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/024148p5eegeebghzeyyen.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0638",
        "url_tid": "180128",
        "name": "学徒手册",
        "date": "2026-2-17",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】1% 回帖金币+1▕▏升级条件：消耗200血液\n【等级2】2% 回帖咒术+1 金币+2▕▏升级条件：消耗200金币\n【等级3】30% 回帖堕落+1▕▏升级条件：知识≥5\n【等级4】4% 回帖咒术+1 金币+2▕▏升级条件：知识≥88\n【 Max 】6% 回帖咒术+1 金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/024141n9l622ete6holpmp.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/024143t7ltvkwtt16k62vg.gif", 40],
            "3": ["https://img.gamemale.com/album/202602/15/024143t5v4jaenun9d6izu.gif", 40],
            "4": ["https://img.gamemale.com/album/202602/15/024144nagxfksf4bwz5v6c.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/024144nda44uxud0n99zel.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0637",
        "url_tid": "180126",
        "name": "位面引航器",
        "date": "2026-2-17",
        "buy_limit": "旅程≥10",
        "price": "300金币",
        "levels": "【等级1】1% 发帖旅程+1▕▏升级条件：消耗42咒术\n【等级2】1% 回帖旅程+1 金币+1▕▏升级条件：消耗42金币\n【等级3】2% 回帖旅程+1 金币+1▕▏升级条件：消耗42血液\n【 Max 】3% 回帖旅程+1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/024138ml7qmq20rto2mz3h.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/024139r0g30d21vcgd2vvv.gif", 40],
            "3": ["https://img.gamemale.com/album/202602/15/024139zub7dx44xh74rpuu.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/024140wti555pqlrty5pdl.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0636",
        "url_tid": "180124",
        "name": "跨越边际的旅途",
        "date": "2026-2-17",
        "buy_limit": "主题数≥10（该勋章不可寄售，仅可回收）",
        "price": "1888金币",
        "backstory": "<a href=\"/thread-180673-1-1.html\" target=\"_blank\">《跨越边际的旅途》丨历尽遗憾，守望期盼，终得归宿（点击跳转）</a>",
        "levels": "【等级1】5% 回帖金币+1、发帖血液+1▕▏升级条件：消耗1灵魂\n【等级2】10% 回帖金币+1、发帖血液+1▕▏升级条件：消耗365血液\n【等级3】20% 回帖金币+1、发帖血液+1▕▏升级条件：好友数≥88\n【等级4】25% 回帖金币+1、发帖血液+1▕▏升级条件：旅程≥365\n【等级5】30% 回帖金币+1、发帖血液+1▕▏升级条件：知识≥365\n【等级6】35% 回帖金币+1、发帖血液+1▕▏升级条件：追随≥365\n【等级7】40% 回帖金币+1、发帖血液+1▕▏升级条件：主题数≥88\n【 Max 】50% 回帖金币+1、发帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/024112u44smijss3yroi4y.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/024114jse7tdge771ztriz.gif", 82],
            "3": ["https://img.gamemale.com/album/202602/15/024117w88kbkk8klbkl5ra.gif", 82],
            "4": ["https://img.gamemale.com/album/202602/15/024120b068yz9c7e488674.gif", 82],
            "5": ["https://img.gamemale.com/album/202602/15/024125ioos0z008yyu0iej.gif", 82],
            "6": ["https://img.gamemale.com/album/202602/15/024128psu37tvrbss7htbh.gif", 82],
            "7": ["https://img.gamemale.com/album/202602/15/024134ty0xzq5dx40qaaz4.gif", 82],
            "Max": ["https://img.gamemale.com/album/202602/15/024136uc56cw3e5g6l9e96.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0635",
        "url_tid": "180122",
        "name": "被冰封的靴子",
        "date": "2026-2-17",
        "buy_limit": "旅程≥30",
        "price": "500金币",
        "levels": "【等级1】5% 回帖堕落-1 血液+1 金币+1▕▏升级条件：消耗50咒术\n【等级2】无属性▕▏升级条件：消耗200金币\n【等级3】10% 回帖堕落-1 血液+1 金币+1▕▏升级条件：消耗250血液\n【 Max 】15% 回帖堕落-1 血液+1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/023710zoai383mr071refa.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/023711vzfyfalo062lz1y6.gif", 40],
            "3": ["https://img.gamemale.com/album/202602/15/023712s100k9zy0e71n9sn.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/023714wwjbnzf9eepuurz0.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0634",
        "url_tid": "180121",
        "name": "被冰封的板甲",
        "date": "2026-2-17",
        "buy_limit": "旅程≥30",
        "price": "500金币",
        "levels": "【等级1】9% 回帖血液+1 堕落-1▕▏升级条件：消耗300血液\n【等级2】9% 回帖血液+2 堕落-1▕▏升级条件：消耗500血液\n【 Max 】9% 回帖血液+3 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/023705mfd1giaz1kdl8svw.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/023706yabylrrwvrvzmloj.gif", 40],
            "Max": ["https://img.gamemale.com/album/202602/15/023708dccytyrfq4o82fr7.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0633",
        "url_tid": "180120",
        "name": "狮冠龙眸 林烈",
        "date": "2026-2-17",
        "buy_limit": "无",
        "price": "600金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗66金币\n【等级2】10% 回帖金币+1▕▏升级条件：金币≥500\n【等级3】10% 回帖血液+1▕▏升级条件：血液≥500\n【 Max 】10% 回帖金币+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202602/15/001256nvfe8fphfe9rceui.gif", 40],
            "2": ["https://img.gamemale.com/album/202602/15/001301ckq067hfqi23rsfh.gif", 82],
            "3": ["https://img.gamemale.com/album/202602/17/173148ro9pbiyl1ggi975o.gif", 82],
            "Max": ["https://img.gamemale.com/album/202602/15/001308swzwhxnnsnfnfnwn.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0632",
        "url_tid": "178784",
        "name": "光明奇幻木偶",
        "date": "2026-1-26",
        "buy_limit": "参与活动【奇幻工坊】",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1 堕落-1、发帖金币+2",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202601/26/111219mjjz3a4cklkjjcx2.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0631",
        "url_tid": "178783",
        "name": "『天圆地方』",
        "date": "2026-1-26",
        "buy_limit": "参与活动【万象棋盘】并获得彩蛋奖励",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：消耗1金币\n【等级2】无属性▕▏升级条件：消耗10金币\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202601/27/165630q87gyyf7lo7gqa2g.gif", 40],
            "2": ["https://img.gamemale.com/album/202601/27/165626z4fwg1tpza4h1nth.gif", 40],
            "Max": ["https://img.gamemale.com/album/202601/27/165642vqig7hak31gq3ksb.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0630",
        "url_tid": "178782",
        "name": "未知纸盒",
        "date": "2026-1-26",
        "buy_limit": "参与活动【万象棋盘】",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：消耗10血液\n【 Max 】2% 回帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202601/26/111022xz91lk5b212kckcm.gif", 40],
            "Max": ["https://img.gamemale.com/album/202601/26/111023ke8i9rd2n2n2rr8f.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0629",
        "url_tid": "177759",
        "name": "『炫目的铁塔』",
        "date": "2026-1-10",
        "buy_limit": "参与活动【东城福音】",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202601/06/210120dzac6j8cnj4zzjzj.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0628",
        "url_tid": "177758",
        "name": "适当显灵",
        "date": "2026-1-10",
        "buy_limit": "参与活动【东城福音】",
        "price": "无",
        "levels": "【 Max 】1% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202601/06/210124pzh2k2w8pfzk5mhf.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0627",
        "url_tid": "177757",
        "name": "救命饮料",
        "date": "2026-1-10",
        "buy_limit": "参与活动【东城福音】",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202601/06/210130yw888zqhbiqsi9bx.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0626",
        "url_tid": "176549",
        "name": "艾尔登法环",
        "date": "2025-12-28",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202512/24/180334koivirot5tba8goi.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0625",
        "url_tid": "176548",
        "name": "图书馆金蛋",
        "date": "2025-12-28",
        "buy_limit": "追随≥10",
        "price": "666金币",
        "levels": "【等级1】3% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗100金币\n【等级2】5% 回帖金币+1 咒术+1、发帖金币+1 咒术+1▕▏升级条件：消耗20咒术\n【 Max 】7% 回帖金币+2 咒术+1、发帖金币+2 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202512/24/183023qk0xv6es3wsgsb6v.gif", 40],
            "2": ["https://img.gamemale.com/album/202512/24/180813f85z93koo23oocn1.gif", 40],
            "Max": ["https://img.gamemale.com/album/202512/24/180814xpumddm4icnezpnw.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0624",
        "url_tid": "176547",
        "name": "无限魔典",
        "date": "2025-12-28",
        "buy_limit": "旅程≥15",
        "price": "500金币",
        "levels": "【等级1】1% 回帖咒术+1 旅程+1▕▏升级条件：咒术≥75\n【等级2】无属性▕▏升级条件：咒术≥175\n【等级3】3% 回帖血液-1▕▏升级条件：咒术≥350\n【等级4】2% 回帖咒术+1▕▏升级条件：咒术≥450\n【等级5】2% 回帖旅程+1▕▏升级条件：咒术≥525\n【等级6】5% 回帖血液+1▕▏升级条件：咒术≥600\n【等级7】2% 回帖知识+1▕▏升级条件：咒术≥675\n【等级8】5% 回帖金币+1▕▏升级条件：咒术≥725\n【等级9】8% 回帖咒术+1▕▏升级条件：咒术≥775\n【等级10】3% 回帖知识+1▕▏升级条件：咒术≥825\n【等级11】55% 回帖血液+1 咒术+1、发帖血液+2▕▏升级条件：咒术≥828\n【等级12】2% 回帖旅程+1▕▏升级条件：咒术≥910\n【等级13】20% 回帖金币+1▕▏升级条件：咒术≥960\n【等级14】10% 回帖金币+3▕▏升级条件：咒术≥1010\n【等级15】55% 回帖金币+1 咒术+1、发帖金币+2▕▏升级条件：咒术≥1013\n【等级16】3% 回帖金币+1 知识+1▕▏升级条件：咒术≥1070\n【等级17】8% 回帖金币+1 咒术+1▕▏升级条件：咒术≥1120\n【等级18】15% 回帖金币+1 血液+1▕▏升级条件：咒术≥1200\n【等级19】100% 回帖金币+2 咒术+1、发帖金币+5 咒术+3▕▏升级条件：咒术≥1202\n【等级20】2% 回帖旅程+1▕▏升级条件：咒术≥1300\n【等级21】无属性▕▏升级条件：咒术≥1375\n【等级22】7% 回帖堕落+2▕▏升级条件：咒术≥1450\n【等级23】7% 回帖金币+2▕▏升级条件：咒术≥1500\n【等级24】8% 回帖血液+3▕▏升级条件：咒术≥1550\n【等级25】12% 回帖金币+2▕▏升级条件：咒术≥1600\n【等级26】55% 回帖咒术+1、发帖血液+2▕▏升级条件：咒术≥1603\n【等级27】5% 回帖咒术+1▕▏升级条件：咒术≥1650\n【等级28】2% 回帖咒术+3▕▏升级条件：咒术≥1700\n【等级29】1% 回帖咒术+5、发帖灵魂+1 咒术+5▕▏升级条件：咒术≥1703\n【等级30】2% 回帖血液-1 旅程+1▕▏升级条件：咒术≥1870\n【等级31】1% 回帖血液-3、发帖血液-5▕▏升级条件：咒术≥1945\n【等级32】8% 回帖血液-1 堕落+1▕▏升级条件：咒术≥2020\n【等级33】8% 回帖血液-1 金币+1▕▏升级条件：咒术≥2070\n【等级34】5% 回帖血液-3 旅程+1▕▏升级条件：咒术≥2125\n【等级35】20% 回帖金币+1 血液+1▕▏升级条件：咒术≥2130\n【等级36】100% 回帖血液+2 咒术+1、发帖血液+5 咒术+3▕▏升级条件：咒术≥2132\n【等级37】3% 回帖金币-1 堕落+1▕▏升级条件：咒术≥2200\n【等级38】6% 回帖金币-1 堕落+1▕▏升级条件：咒术≥2300\n【等级39】9% 回帖金币-1 堕落+1▕▏升级条件：咒术≥2400\n【等级40】10% 回帖金币-2 堕落+2▕▏升级条件：咒术≥2500\n【等级41】10% 回帖血液-1 堕落+2▕▏升级条件：咒术≥2550\n【等级42】50% 回帖堕落+1 咒术+1、发帖堕落+5▕▏升级条件：咒术≥2553\n【等级43】50% 回帖堕落-1 咒术+1、发帖堕落-3▕▏升级条件：咒术≥2556\n【等级44】2% 回帖咒术+1、发帖灵魂+1 咒术+5▕▏升级条件：咒术≥2559\n【等级45】55% 回帖咒术+1、发帖咒术+5 知识+1▕▏升级条件：咒术≥2561\n【等级46】5% 回帖咒术+1、发帖咒术+1▕▏升级条件：咒术≥2700\n【 Max 】1% 回帖咒术+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202512/24/180829oxqsxxxxnfprfxxd.gif", 40],
            "2": ["https://img.gamemale.com/album/202512/24/180830fe4wdvcwwhx7vwdo.gif", 40],
            "3": ["https://img.gamemale.com/album/202512/24/180831k2j94y19gyzs8mjg.gif", 40],
            "4": ["https://img.gamemale.com/album/202512/24/180832c4damg4mpukbpblp.gif", 40],
            "5": ["https://img.gamemale.com/album/202512/24/180833h0sk183knceeskek.gif", 40],
            "6": ["https://img.gamemale.com/album/202512/24/180833irjvkj40zxgmzjla.gif", 40],
            "7": ["https://img.gamemale.com/album/202512/24/180834ucz28cpz4dtuzssj.gif", 40],
            "8": ["https://img.gamemale.com/album/202512/24/180835vx5ozy9xpqx5dny9.gif", 40],
            "9": ["https://img.gamemale.com/album/202512/24/180836c344jdzf4putu3jz.gif", 40],
            "10": ["https://img.gamemale.com/album/202512/24/180837wd8oyr2z28nhri4h.gif", 40],
            "11": ["https://img.gamemale.com/album/202512/24/180838gy0h9hz37higlgi3.gif", 40],
            "12": ["https://img.gamemale.com/album/202512/24/180839cg88pcqhc584cqo8.gif", 40],
            "13": ["https://img.gamemale.com/album/202512/24/180840texdqrzl5exg4x6c.gif", 40],
            "14": ["https://img.gamemale.com/album/202512/24/180841ipaqihiyloz1hmh7.gif", 40],
            "15": ["https://img.gamemale.com/album/202512/24/180842kk6o6os0oyyc0sc4.gif", 40],
            "16": ["https://img.gamemale.com/album/202512/24/180843v2ktcyzwk9k9l9z4.gif", 40],
            "17": ["https://img.gamemale.com/album/202512/24/180844omtsdcjdcgldssdv.gif", 40],
            "18": ["https://img.gamemale.com/album/202512/24/180844owyd2dvfvyfw26yv.gif", 40],
            "19": ["https://img.gamemale.com/album/202512/24/180845waguzp46wxglsb6o.gif", 40],
            "20": ["https://img.gamemale.com/album/202512/24/180846xstt7drrz6yc6tty.gif", 40],
            "21": ["https://img.gamemale.com/album/202512/24/180847pf169fsw77f59ffr.gif", 40],
            "22": ["https://img.gamemale.com/album/202512/24/180848m4ssrwwwr1rse4so.gif", 40],
            "23": ["https://img.gamemale.com/album/202512/24/180849ecffs4zyd9yp2qwt.gif", 40],
            "24": ["https://img.gamemale.com/album/202512/24/180849emzd05mdkxj45ki2.gif", 40],
            "25": ["https://img.gamemale.com/album/202512/24/180850sb326z9m396xzez3.gif", 40],
            "26": ["https://img.gamemale.com/album/202512/24/180851bp4kkfb6bfvkvban.gif", 40],
            "27": ["https://img.gamemale.com/album/202512/24/180852rhy0hfr43qd44km4.gif", 40],
            "28": ["https://img.gamemale.com/album/202512/24/180853notxcl55o9t3zxe5.gif", 40],
            "29": ["https://img.gamemale.com/album/202512/24/180854ecqixdnd5cbndhzs.gif", 40],
            "30": ["https://img.gamemale.com/album/202512/25/113958dys4ae8chmezxe8m.gif", 40],
            "31": ["https://img.gamemale.com/album/202512/24/180957luq188eooy8hqepl.gif", 40],
            "32": ["https://img.gamemale.com/album/202512/24/180959kffgydfvg4f1gdgt.gif", 40],
            "33": ["https://img.gamemale.com/album/202512/24/181000sc779mynn979nuc6.gif", 40],
            "34": ["https://img.gamemale.com/album/202512/24/181002n4dmxsyzzv9musz9.gif", 40],
            "35": ["https://img.gamemale.com/album/202512/24/181005vc7si7aii8xaswra.gif", 40],
            "36": ["https://img.gamemale.com/album/202512/24/181006f88j8pslctjpiojr.gif", 40],
            "37": ["https://img.gamemale.com/album/202512/24/181009f1rfx1v0o2xqlpmz.gif", 40],
            "38": ["https://img.gamemale.com/album/202512/24/181012jryywrk9xdw4o1pf.gif", 40],
            "39": ["https://img.gamemale.com/album/202512/24/181014ye3dd0m83q8xzxvs.gif", 40],
            "40": ["https://img.gamemale.com/album/202512/24/181017zz1ei1uj88i1e9bi.gif", 40],
            "41": ["https://img.gamemale.com/album/202512/24/181019e1ff78fs8il99f9l.gif", 40],
            "42": ["https://img.gamemale.com/album/202512/24/181021u8vgi5y79v9ggpi7.gif", 40],
            "43": ["https://img.gamemale.com/album/202512/24/181022zdpipjfj9vvu9jzi.gif", 40],
            "44": ["https://img.gamemale.com/album/202512/24/181024i6s1wf1xkawk1ne4.gif", 40],
            "45": ["https://img.gamemale.com/album/202512/24/181027tjjjkogoxfivsfil.gif", 40],
            "46": ["https://img.gamemale.com/album/202512/24/181029cq7bq8x08tjyy81q.gif", 40],
            "Max": ["https://img.gamemale.com/album/202512/24/181038ellc7tbthqcq7kks.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0623",
        "url_tid": "176546",
        "name": "基础维修工具",
        "date": "2025-12-28",
        "buy_limit": "无",
        "price": "120金币",
        "levels": "【等级1】2% 回帖咒术+1 金币+1、发帖咒术+1 金币+1▕▏升级条件：发帖数≥499\n【等级2】3% 回帖咒术+1 金币+1、发帖咒术+1 金币+1▕▏升级条件：发帖数≥2999\n【等级3】6% 回帖咒术+1 金币+1、发帖咒术+1 金币+1▕▏升级条件：消耗1灵魂\n【等级4】9% 回帖咒术+1 金币+2、发帖咒术+1 金币+2▕▏升级条件：消耗-120金币\n【 Max 】1% 回帖咒术+1 金币+1、发帖咒术+1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202512/24/180654vlchrcrcs3rlo3ce.gif", 40],
            "2": ["https://img.gamemale.com/album/202512/24/180655yeepsz2o1oe23oyl.gif", 40],
            "3": ["https://img.gamemale.com/album/202512/24/180655achjepc1h2bzoj9c.gif", 40],
            "4": ["https://img.gamemale.com/album/202512/24/180656oz44fqssstqpzbjy.gif", 40],
            "Max": ["https://img.gamemale.com/album/202512/24/180657ef8q7ybqz4tbqeub.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0622",
        "url_tid": "176545",
        "name": "被冰封的头盔",
        "date": "2025-12-28",
        "buy_limit": "旅程≥30",
        "price": "400金币",
        "levels": "【等级1】5% 回帖金币+2 血液-1▕▏升级条件：血液≥350\n【等级2】10% 回帖金币+2 血液-1▕▏升级条件：消耗500金币\n【 Max 】10% 回帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202512/24/180349k99w65m4i5weywey.gif", 40],
            "2": ["https://img.gamemale.com/album/202512/24/180350ryrvypeaze2jn9y9.gif", 40],
            "Max": ["https://img.gamemale.com/album/202512/24/180351a63ehmcgcamhgm2z.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0621",
        "url_tid": "176544",
        "name": "大侦探皮卡丘",
        "date": "2025-12-28",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】2% 回帖金币+1▕▏升级条件：消耗99金币\n【等级2】4% 回帖知识+1▕▏升级条件：知识≥30\n【等级3】3% 回帖知识+1▕▏升级条件：知识≥100\n【等级4】2% 回帖知识+1▕▏升级条件：知识≥150\n【 Max 】50% 发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202512/24/180711dizv1nfz0bh0hkds.gif", 40],
            "2": ["https://img.gamemale.com/album/202512/24/180712t2hic1c6ptcn57ct.gif", 82],
            "3": ["https://img.gamemale.com/album/202512/24/180713e00fzjfin8gz1xwf.gif", 82],
            "4": ["https://img.gamemale.com/album/202512/24/180713rpsj0bs88sa583u7.gif", 82],
            "Max": ["https://img.gamemale.com/album/202512/24/180714bjpus00mr5hi0dop.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0620",
        "url_tid": "176543",
        "name": "高桥剑痴",
        "date": "2025-12-28",
        "buy_limit": "无",
        "price": "700金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗300金币\n【等级2】10% 回帖金币+2▕▏升级条件：消耗1灵魂\n【等级3】13% 回帖金币+3▕▏升级条件：堕落≥700\n【 Max 】15% 回帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202512/24/180702xqiqqag87ar52pj3.gif", 40],
            "2": ["https://img.gamemale.com/album/202512/24/180703c5q54tn55h22255q.gif", 40],
            "3": ["https://img.gamemale.com/album/202512/24/180704leraidpaewdwk08d.gif", 82],
            "Max": ["https://img.gamemale.com/album/202512/24/180705daa2ggcbtgs4bhk5.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0619",
        "url_tid": "176542",
        "name": "本・比格",
        "date": "2025-12-28",
        "buy_limit": "追随≥10",
        "price": "666金币",
        "levels": "【等级1】4% 回帖金币+1 血液-1、发帖金币+1 血液-1▕▏升级条件：消耗150金币\n【等级2】8% 回帖金币+1 血液-1、发帖金币+1 血液-1▕▏升级条件：消耗150血液\n【等级3】10% 回帖金币+2、发帖金币+2▕▏升级条件：消耗88咒术\n【 Max 】12% 回帖金币+3、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202512/24/180400o3qdxbgd3xf3mxmg.gif", 40],
            "2": ["https://img.gamemale.com/album/202512/24/180401xcsesc15dsr5szvf.gif", 82],
            "3": ["https://img.gamemale.com/album/202512/24/180402qo4um80ioma1d314.gif", 82],
            "Max": ["https://img.gamemale.com/album/202512/24/180403c7jgq7ux7vua7x2x.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0618",
        "url_tid": "176541",
        "name": "傲之追猎者·雷恩加尔",
        "date": "2025-12-28",
        "buy_limit": "无",
        "price": "680金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗80金币\n【等级2】10% 回帖金币+1▕▏升级条件：追随≥78\n【等级3】10% 回帖金币+2▕▏升级条件：消耗300血液\n【 Max 】11% 回帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202512/24/180341dz2n7z558tm9t84c.gif", 40],
            "2": ["https://img.gamemale.com/album/202512/24/180341xt4yx243wgukywcj.gif", 82],
            "3": ["https://img.gamemale.com/album/202512/24/180342mvvkdp2rvz0ddvhd.gif", 82],
            "Max": ["https://img.gamemale.com/album/202512/24/180347fuu0x47g3gef30gg.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0617",
        "url_tid": "175317",
        "name": "河豚寿司",
        "date": "2025-12-8",
        "buy_limit": "参与2025年活动【捕鱼达人】并投注成功三次",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202512/08/093449kg9xq894p57ozc8x.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0616",
        "url_tid": "175316",
        "name": "荧光水母",
        "date": "2025-12-8",
        "buy_limit": "参与2025年活动【捕鱼达人】",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202512/08/093450e0b10o957x9zb9z1.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0615",
        "url_tid": "174174",
        "name": "发条八音盒",
        "date": "2025-11-12",
        "buy_limit": "参与2025年活动【五夜惊魂】",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202511/12/093230fxg9xuret3x6ie92.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0614",
        "url_tid": "174173",
        "name": "弗雷迪玩偶",
        "date": "2025-11-12",
        "buy_limit": "参与并见证2025年活动【五夜惊魂】的结局",
        "price": "无",
        "levels": "【 Max 】1% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202511/12/093230v75vp7puos8vik3p.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0613",
        "url_tid": "172871",
        "name": "桂花米糕",
        "date": "2025-10-22",
        "buy_limit": "参与2025年活动【秋月折桂】",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202510/20/163614ohpxaixinez4ynnh.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0612",
        "url_tid": "171614",
        "name": "双生蛋",
        "date": "2025-10-4",
        "buy_limit": "堕落≥177",
        "price": "377金币",
        "levels": "【等级1】3% 回帖堕落+1▕▏升级条件：消耗377血液\n【等级2】15% 回帖堕落+1 金币+3▕▏升级条件：堕落≥17\n【 Max 】10% 回帖堕落-1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/144224dklyukkhl51k0f5o.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/01/144230u7f7fqo1zmvoob3h.gif", 40],
            "Max": ["https://img.gamemale.com/album/202510/01/144239ui7kzhd0ywt7voja.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0611",
        "url_tid": "171611",
        "name": "末影珍珠",
        "date": "2025-10-4",
        "buy_limit": "知识≥16",
        "price": "256金币",
        "levels": "【等级1】1% 回帖咒术+1▕▏升级条件：消耗64血液\n【等级2】3% 回帖咒术+1▕▏升级条件：消耗128血液\n【等级3】2% 回帖旅程+1▕▏升级条件：在线时间≥999\n【 Max 】3% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/144157peeo6e22se6rgse2.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/01/144157jbzf3lp6hhf3bbxv.gif", 40],
            "3": ["https://img.gamemale.com/album/202510/01/144158oouv6y2xpblvbm2f.gif", 40],
            "Max": ["https://img.gamemale.com/album/202510/01/144159aypgkmkx0c6kt60d.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0610",
        "url_tid": "171610",
        "name": "辉夜姬的五难题",
        "date": "2025-10-4",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：消耗125金币\n【等级2】5% 回帖金币+1▕▏升级条件：消耗125血液\n【等级3】5% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗125金币\n【等级4】5% 回帖金币+3、发帖旅程+1▕▏升级条件：消耗125血液\n【等级5】5% 回帖血液+4、发帖旅程+1▕▏升级条件：消耗500金币\n【 Max 】5% 回帖金币+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/144105t7lj61znze9z97kr.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/01/144106ooyxoyv9aete84o4.gif", 40],
            "3": ["https://img.gamemale.com/album/202510/01/144107gpeqkdd654fb5flk.gif", 40],
            "4": ["https://img.gamemale.com/album/202510/01/144108giqp1h6xxxpgxmp6.gif", 40],
            "5": ["https://img.gamemale.com/album/202510/01/144109w56hhzdfk1khg84d.gif", 40],
            "Max": ["https://img.gamemale.com/album/202510/01/144111sav05zjjb0ffb884.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0609",
        "url_tid": "171609",
        "name": "千年积木",
        "date": "2025-10-4",
        "buy_limit": "无",
        "price": "200金币",
        "levels": "【等级1】3% 回帖咒术+1▕▏升级条件：消耗30咒术\n【 Max 】4% 回帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/144202w2mxg6rg33gr8532.gif", 40],
            "Max": ["https://img.gamemale.com/album/202510/01/144203wbgg2cuv4u24c6uu.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0608",
        "url_tid": "171608",
        "name": "枯木法杖",
        "date": "2025-10-4",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗1000血液\n【等级2】10% 回帖金币+1▕▏升级条件：堕落≥100\n【等级3】10% 回帖金币+3 堕落-1▕▏升级条件：堕落≥300\n【等级4】10% 回帖金币+2▕▏升级条件：堕落≥500\n【 Max 】10% 回帖金币+2 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/144150n2r1bremrhxxbbn0.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/01/144151j6j96fj8yc6fkkg8.gif", 40],
            "3": ["https://img.gamemale.com/album/202510/01/144153ovv3q6vvjs01qees.gif", 40],
            "4": ["https://img.gamemale.com/album/202510/01/144154nbbzblbnblbxbbm4.gif", 40],
            "Max": ["https://img.gamemale.com/album/202510/01/144155z99b87958zv1ex7m.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0607",
        "url_tid": "171607",
        "name": "黑暗封印",
        "date": "2025-10-4",
        "buy_limit": "堕落≥130",
        "price": "350金币",
        "levels": "【等级1】3% 回帖咒术+1 血液-3▕▏升级条件：消耗1250金币\n【等级2】10% 回帖咒术+1 血液-3▕▏升级条件：好友数≥13\n【等级3】8% 回帖血液-3 咒术+1▕▏升级条件：好友数≥130\n【等级4】6% 回帖血液-3 咒术+1▕▏升级条件：知识≥130\n【等级5】5% 回帖咒术+2、发帖咒术+2▕▏升级条件：灵魂≥25\n【 Max 】8% 回帖咒术+2 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/144057mdtrhy7kki44kuqe.gif", 40],
            "2": ["https://img.gamemale.com/forum/202505/25/160908ffjjmmbvjb4fc4vf.gif", 40],
            "3": ["https://img.gamemale.com/album/202510/01/144059rsgw5kh6ssgvst34.gif", 40],
            "4": ["https://img.gamemale.com/forum/202505/25/160920qc2gp2dcp7decpg2.gif", 40],
            "5": ["https://img.gamemale.com/album/202510/01/144101m2assar0yfaluah0.gif", 40],
            "Max": ["https://img.gamemale.com/album/202510/01/144102ovfggmf3cf44vfhv.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0606",
        "url_tid": "171606",
        "name": "Honey B Lovely",
        "date": "2025-10-4",
        "buy_limit": "无",
        "price": "520金币",
        "levels": "【等级1】10% 回帖金币 0、发帖金币 0▕▏升级条件：金币≥52\n【等级2】10% 回帖金币+1、发帖金币+1▕▏升级条件：消耗710金币\n【等级3】11% 回帖金币+2、发帖金币+2▕▏升级条件：消耗198金币\n【 Max 】12% 回帖金币+3、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/144028dennf8xfknohmo8m.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/01/144029vesqhohaidfs9nki.gif", 82],
            "3": ["https://img.gamemale.com/album/202510/01/144030vxcjyx1yjcz202ww.gif", 82],
            "Max": ["https://img.gamemale.com/album/202510/01/144031vzugutuwvu92lc8f.gif", 82]
        }
    },
    {
        "type": "女从",
        "no": "0605",
        "url_tid": "171605",
        "name": "琴.葛蕾",
        "date": "2025-10-4",
        "buy_limit": "咒术≥30",
        "price": "500金币",
        "levels": "【等级1】10% 回帖堕落+1▕▏升级条件：堕落≥600\n【等级2】10% 回帖堕落+2▕▏升级条件：消耗66咒术\n【等级3】10% 回帖血液+3 堕落-1▕▏升级条件：堕落≥100\n【等级4】3% 回帖旅程+1▕▏升级条件：堕落≥600\n【 Max 】10% 回帖堕落-2",
        "levels_img": {
            "1": ["http://img.gamemale.com/album/202510/01/144208tqlprrgplberbbpt.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/01/144212cc5fncef1cedlzlc.gif", 82],
            "3": ["https://img.gamemale.com/album/202510/01/144215ygrofqqx121h9bzb.gif", 82],
            "4": ["https://img.gamemale.com/album/202510/01/144218hmzf2rk5i6c22f5g.gif", 82],
            "Max": ["https://img.gamemale.com/album/202510/01/144221wp5886c8kk84fh6h.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0604",
        "url_tid": "171603",
        "name": "基努·里维斯",
        "date": "2025-10-4",
        "buy_limit": "堕落≤999",
        "price": "666金币",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：消耗99金币\n【等级2】5% 回帖血液+1▕▏升级条件：消耗99金币\n【等级3】15% 回帖血液+1 金币-1▕▏升级条件：血液≥1964\n【等级4】10% 回帖血液+2▕▏升级条件：消耗99血液\n【等级5】20% 回帖血液+1 金币-1▕▏升级条件：消耗99咒术\n【 Max 】2% 回帖堕落-1、发帖灵魂+1 堕落-3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/144130eaksgett6d4amets.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/01/144131fyz7nii59iaa5vyq.gif", 82],
            "3": ["https://img.gamemale.com/album/202510/01/144133v3yd2gafjbb8u7yu.gif", 82],
            "4": ["https://img.gamemale.com/album/202510/01/144140xwej9dq0juqmjju8.gif", 82],
            "5": ["https://img.gamemale.com/album/202510/01/144136v56jse1c1zpps5ds.gif", 82],
            "Max": ["https://img.gamemale.com/album/202510/01/144138r589ursw1z4p3ng6.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0603",
        "url_tid": "171602",
        "name": "炽焰咆哮虎",
        "date": "2025-10-4",
        "buy_limit": "旅程≥30",
        "price": "500金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗100金币\n【等级2】7% 回帖血液+1、发帖血液+1▕▏升级条件：消耗50咒术\n【等级3】8% 回帖血液+2、发帖血液+2▕▏升级条件：消耗300金币\n【 Max 】10% 回帖血液+3、发帖血液+3 堕落+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/144038zo411cc2ewyywsss.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/01/144039fyyfsjtxa6ffgd08.gif", 82],
            "3": ["https://img.gamemale.com/album/202510/01/144040fmhmgm60qjk3q7km.gif", 124],
            "Max": ["https://img.gamemale.com/album/202510/01/144041s9zstskkn86eeoo9.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0602",
        "url_tid": "171601",
        "name": "“半狼”布莱泽",
        "date": "2025-10-4",
        "buy_limit": "旅程≥5",
        "price": "496金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+1▕▏升级条件：消耗99金币\n【等级2】9% 回帖金币+1、发帖金币+1▕▏升级条件：咒术≥399\n【等级3】9% 回帖金币+2、发帖金币+2▕▏升级条件：消耗1199金币\n【等级4】12% 回帖金币+2、发帖金币+2▕▏升级条件：血液≥521\n【 Max 】13% 回帖金币+3、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202510/01/143947yi5qlynxnnx9x5nx.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/01/143949v23dy8s28r6zuyta.gif", 82],
            "3": ["https://img.gamemale.com/album/202510/01/143950e9i0d9fjpyqf00jd.gif", 82],
            "4": ["https://img.gamemale.com/album/202510/01/143951egsqxxgshzxqxqph.gif", 82],
            "Max": ["https://img.gamemale.com/album/202510/01/143952jnjnd5xmknkj99aa.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0601",
        "url_tid": "169887",
        "name": "灯载情绵",
        "date": "2025-9-2",
        "buy_limit": "参与2025七夕活动【千灯映巧】",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202508/28/002438hzvu4543b6f688z0.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0600",
        "url_tid": "168858",
        "name": "命运的轮廓",
        "date": "2025-8-18",
        "buy_limit": "参与2025活动【幸运数字】，触发特定条件",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202508/17/124440y8ee4cd47d4z0nf4.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0599",
        "url_tid": "168856",
        "name": "检定场",
        "date": "2025-8-18",
        "buy_limit": "参与2025活动【幸运数字】",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202508/17/122150r3qdi3qi3au3q3lm.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0598",
        "url_tid": "167220",
        "name": "传说中的黑龙",
        "date": "2025-7-22",
        "buy_limit": "2025活动【黑龙伝说】，全程无缺席且击败黑龙",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202507/22/093545wg3h2944eidn8piy.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0597",
        "url_tid": "167219",
        "name": "呆猫",
        "date": "2025-7-22",
        "buy_limit": "2025年活动【黑龙伝说】，成功组队并登记的猎人的奖励",
        "price": "无",
        "levels": "【 Max 】1% 发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202507/22/093545q0s4o8wbww48rfct.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0596",
        "url_tid": "164432",
        "name": "鎏彩万幢",
        "date": "2025-6-16",
        "buy_limit": "【十二周年】活动发表主题帖奖励",
        "price": "不可购买",
        "levels": "【 Max 】12% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202506/07/145344be2hicycyemevr7f.gif", 124]
        }
    },
    {
        "type": "剧情",
        "no": "0595",
        "url_tid": "163415",
        "name": "『狄文卡德的残羽』",
        "date": "2025-6-11",
        "buy_limit": "【十二周年】系列活动限定纪念勋章",
        "price": "1堕落",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202506/07/204727k4ecjcm9lg4i5ndb.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0594",
        "url_tid": "162894",
        "name": "女巫之路",
        "date": "2025-6-9",
        "buy_limit": "咒术≥77",
        "price": "100金币",
        "levels": "【等级1】1% 回帖咒术+1▕▏升级条件：消耗7旅程\n【等级2】1% 回帖旅程+1▕▏升级条件：消耗7咒术\n【等级3】2% 回帖咒术+1▕▏升级条件：消耗-7旅程\n【等级4】2% 回帖旅程+1▕▏升级条件：在线时间≥777\n【等级5】3% 回帖咒术+1▕▏升级条件：消耗7咒术\n【 Max 】3% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202506/08/195022o5gmfjlwzg2jw6ju.gif", 124],
            "2": ["https://img.gamemale.com/album/202506/08/195024eo3v86w16uoh1n3w.gif", 124],
            "3": ["https://img.gamemale.com/album/202506/08/213529uozqagbc9nolwnfq.gif", 124],
            "4": ["https://img.gamemale.com/album/202506/08/195027n86ob7jw64fnr0p7.gif", 124],
            "5": ["https://img.gamemale.com/album/202506/08/195028tpaaacmbll000rbp.gif", 124],
            "Max": ["https://img.gamemale.com/album/202506/08/195030vjltsxkyytx0osvt.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0593",
        "url_tid": "162893",
        "name": "黑暗之魂系列",
        "date": "2025-6-9",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖血液+1 堕落+1、发帖血液+1 堕落-1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202506/08/194934j35lhl1yu5uauuyl.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0592",
        "url_tid": "162891",
        "name": "尼特公仔",
        "date": "2025-6-9",
        "buy_limit": "无",
        "price": "188金币",
        "levels": "【等级1】6% 回帖血液-1 金币+1、发帖血液-1 金币+1▕▏升级条件：消耗288金币\n【等级2】8% 回帖血液+2 金币-1、发帖血液-1 金币+2▕▏升级条件：消耗288血液\n【 Max 】10% 回帖金币+3 血液-1 堕落+1、发帖血液+3 金币-1 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202506/08/173307lrimmij9h9krghpx.gif", 40],
            "2": ["https://img.gamemale.com/album/202506/08/173308odt7gwlwgc2zgw6t.gif", 40],
            "Max": ["https://img.gamemale.com/album/202506/08/173309f36ks66jkp6nxr8r.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0591",
        "url_tid": "162889",
        "name": "莉莉娅·考尔德（Lilia Calderu）",
        "date": "2025-6-9",
        "buy_limit": "咒术≥77",
        "price": "777金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗177咒术\n【等级2】1% 回帖咒术+1▕▏升级条件：消耗1旅程\n【等级3】2% 回帖旅程+1▕▏升级条件：消耗177金币\n【等级4】3% 回帖金币+1▕▏升级条件：消耗1旅程\n【等级5】4% 回帖金币+1▕▏升级条件：消耗177血液\n【等级6】5% 回帖金币+1▕▏升级条件：消耗-2旅程\n【等级7】6% 回帖金币+2 血液-1▕▏升级条件：在线时长≥777\n【等级8】7% 回帖金币+2▕▏升级条件：灵魂≥1\n【等级9】10% 回帖金币+2▕▏升级条件：灵魂≥3\n【 Max 】17% 回帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202506/08/194859o5978ztrzfy7877q.gif", 40],
            "2": ["https://img.gamemale.com/album/202506/08/194900ix8z8t3cucudz843.gif", 82],
            "3": ["https://img.gamemale.com/album/202506/08/194901agw28ogwy60zyglj.gif", 82],
            "4": ["https://img.gamemale.com/album/202506/08/194902pnsg1kxx66te6stv.gif", 82],
            "5": ["https://img.gamemale.com/album/202506/08/194904h95iyqri99iiraf0.gif", 82],
            "6": ["https://img.gamemale.com/album/202506/08/194905a8fhlhjjl3m7xfjl.gif", 82],
            "7": ["https://img.gamemale.com/album/202506/08/194906cmy715p7e628s3ve.gif", 82],
            "8": ["https://img.gamemale.com/forum/202506/09/102518t2ql1gy2e9qssz2i.gif", 82],
            "9": ["https://img.gamemale.com/album/202506/08/194909qwf84m7wwzl877on.gif", 124],
            "Max": ["https://img.gamemale.com/album/202506/08/194910hmt4t3s009lmsb0z.gif", 124]
        }
    },
    {
        "type": "女从",
        "no": "0590",
        "url_tid": "162888",
        "name": "红夫人",
        "date": "2025-6-9",
        "buy_limit": "追随≥15",
        "price": "688金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗99咒术\n【等级2】9% 回帖金币+2▕▏升级条件：消耗399血液\n【等级3】13% 回帖金币+2▕▏升级条件：堕落≥399\n【 Max 】13% 回帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202506/08/195002czeqbafiwb93waaa.gif", 40],
            "2": ["https://img.gamemale.com/album/202506/08/195003ssuijyy0ui4vi0bj.gif", 82],
            "3": ["https://img.gamemale.com/album/202506/08/195004pueou0pr01zende3.gif", 82],
            "Max": ["https://img.gamemale.com/album/202506/08/195006mlirnsx7yxzoasxf.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0589",
        "url_tid": "162886",
        "name": "亨利.卡维尔",
        "date": "2025-6-9",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】1% 回帖金币+5▕▏升级条件：消耗400血液\n【等级2】10% 回帖金币+3▕▏升级条件：消耗1金币\n【等级3】10% 回帖金币+3▕▏升级条件：消耗1金币\n【等级4】10% 回帖金币+3▕▏升级条件：消耗1金币\n【等级5】10% 回帖金币+3▕▏升级条件：消耗1金币\n【等级6】10% 回帖金币+3▕▏升级条件：消耗1金币\n【等级7】10% 回帖金币+3▕▏升级条件：消耗1金币\n【等级8】10% 回帖金币+3▕▏升级条件：消耗1金币\n【等级9】10% 回帖金币+3▕▏升级条件：消耗1金币\n【 Max 】10% 回帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202506/08/203801rbrb85pyx75tkl5y.gif", 40],
            "2": ["https://img.gamemale.com/album/202506/08/194946fmmhaozsa3pw5mgl.gif", 124],
            "3": ["https://img.gamemale.com/album/202506/08/194947h7fkz0wf11ge3hfz.gif", 124],
            "4": ["https://img.gamemale.com/album/202506/08/194948ks0gt7zgujgggmos.gif", 124],
            "5": ["https://img.gamemale.com/album/202506/08/194950lf0wsdzcbcswb1st.gif", 124],
            "6": ["https://img.gamemale.com/album/202506/08/194951x2yg1dm1lyn2h11h.gif", 124],
            "7": ["https://img.gamemale.com/album/202506/08/194952lg6mp2g3p12c6pfm.gif", 124],
            "8": ["https://img.gamemale.com/album/202506/08/194954prn3kt7rq55wr3pw.gif", 124],
            "9": ["https://img.gamemale.com/album/202506/08/194956rfkfafaofakoaxno.gif", 124],
            "Max": ["https://img.gamemale.com/album/202506/08/194957e1vq1tseqvea3i33.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0588",
        "url_tid": "162885",
        "name": "牛局长博戈",
        "date": "2025-6-9",
        "buy_limit": "咒术≥20",
        "price": "200金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+1▕▏升级条件：消耗350血液\n【等级2】8% 回帖咒术+1、发帖咒术+1▕▏升级条件：咒术≥40\n【 Max 】40% 发帖堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202506/08/195014is28hp78w8wf7zrc.gif", 40],
            "2": ["https://img.gamemale.com/album/202506/08/195015kgjhh2lxfgz2jlhk.gif", 82],
            "Max": ["https://img.gamemale.com/album/202506/08/195017cyyly3grl7lwapig.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0587",
        "url_tid": "162882",
        "name": "约翰·康斯坦丁",
        "date": "2025-6-9",
        "buy_limit": "堕落≥25",
        "price": "450金币",
        "levels": "【等级1】3% 回帖血液+1▕▏升级条件：堕落≥50\n【等级2】10% 回帖血液+2、发帖堕落+1▕▏升级条件：消耗1血液\n【等级3】5% 回帖血液+1▕▏升级条件：堕落≥100\n【等级4】9% 回帖血液+1、发帖堕落+1▕▏升级条件：堕落≥150\n【等级5】13% 回帖血液+1、发帖堕落+1▕▏升级条件：堕落≥200\n【等级6】15% 回帖血液+1、发帖堕落+1▕▏升级条件：堕落≥350\n【 Max 】20% 回帖血液+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202506/08/195324p9s5ftjlt0vdtfml.gif", 40],
            "2": ["https://img.gamemale.com/album/202506/08/195327bw8blev6c846llzx.gif", 82],
            "3": ["https://img.gamemale.com/album/202506/08/195328pj1dlf1def5uh7me.gif", 82],
            "4": ["https://img.gamemale.com/album/202506/08/195330rnltblybyb7jpnnr.gif", 82],
            "5": ["https://img.gamemale.com/album/202506/08/195332ajgmqogjgz2bo2a2.gif", 82],
            "6": ["https://img.gamemale.com/album/202506/08/195333bdhhqgpj3fgyl3x6.gif", 82],
            "Max": ["https://img.gamemale.com/album/202506/08/195334r90ussyyy3gyes6y.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0586",
        "url_tid": "162881",
        "name": "巴哈姆特",
        "date": "2025-6-9",
        "buy_limit": "知识≥20",
        "price": "700金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+1▕▏升级条件：好友数≥24\n【等级2】8% 回帖血液+1、发帖血液+1▕▏升级条件：消耗500血液\n【等级3】8% 回帖血液+2、发帖血液+2▕▏升级条件：知识≥100\n【等级4】12% 回帖血液+2、发帖血液+2▕▏升级条件：消耗100咒术\n【等级5】13% 回帖血液+3、发帖血液+3▕▏升级条件：消耗1堕落\n【等级6】13% 回帖血液+3、发帖血液+3▕▏升级条件：消耗1灵魂\n【 Max 】16% 回帖血液+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202506/09/013056yuk6ktfkk5idx6f3.gif", 40],
            "2": ["https://img.gamemale.com/album/202506/09/013057n1mlblmlm52my2kg.gif", 82],
            "3": ["https://img.gamemale.com/album/202506/09/013059comd45ch7eemm44u.gif", 124],
            "4": ["https://img.gamemale.com/album/202506/09/013101r909mlb0fjkb5lkm.gif", 124],
            "5": ["https://img.gamemale.com/album/202506/09/013102upwttdt7t2h3t95m.gif", 124],
            "6": ["https://img.gamemale.com/album/202506/09/013103i4ewz5hel0lesb1b.gif", 124],
            "Max": ["https://img.gamemale.com/album/202506/09/013104n3xgk21x3vveg5gg.gif", 124]
        }
    },
    {
        "type": "剧情",
        "no": "0585",
        "url_tid": "161935",
        "name": "『厢庭望远』",
        "date": "2025-5-27",
        "buy_limit": "【渣阖洋行】拍卖所总价达成15万金币纪念勋章",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：总积分≥1000\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202505/27/164710yzg8pkk1jqzxg28m.gif", 40],
            "Max": ["https://img.gamemale.com/album/202505/27/164130pfwowm6ufc1f0ycj.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0584",
        "url_tid": "160798",
        "name": "『林中过夜』",
        "date": "2025-5-10",
        "buy_limit": "灵魂≥1，主题数≥2，旅程≥16（【派遣远征s1】剧情奖励）",
        "price": "1旅程",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202505/10/121633so0o9ow80oxjt3xm.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0583",
        "url_tid": "160797",
        "name": "『凯旋诺书』",
        "date": "2025-5-10",
        "buy_limit": "【派遣远征s1】派遣先锋的天选仪式",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202505/10/152410e8mv881bg8b0bixw.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0582",
        "url_tid": "160795",
        "name": "猫头鹰守卫",
        "date": "2025-5-10",
        "buy_limit": "【派遣远征s1】奖励",
        "price": "无",
        "levels": "【等级 初级】无属性▕▏升级条件：旅程≥100\n【等级1】1% 回帖金币+1、发帖旅程+1▕▏升级条件：旅程≥200\n【等级2】1% 回帖金币+1、发帖旅程+1▕▏升级条件：旅程≥500\n【 Max 】1% 回帖金币+1、发帖旅程+1",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202505/10/133846al6u091ncwh19yz0.gif", 40],
            "1": ["https://img.gamemale.com/album/202505/10/133846al6u091ncwh19yz0.gif", 40],
            "2": ["https://img.gamemale.com/album/202505/10/133846qyi9pmiggk82jpa9.gif", 40],
            "Max": ["https://img.gamemale.com/album/202505/10/133847dtbme3cyp9e8twep.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0581",
        "url_tid": "160199",
        "name": "黑神话:悟空",
        "date": "2025-5-2",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】5% 发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202505/01/004354nkr5scvkyzrkkcmk.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0580",
        "url_tid": "160198",
        "name": "弯钩与连枷",
        "date": "2025-5-2",
        "buy_limit": "旅程≥20",
        "price": "330金币",
        "levels": "【等级1】3% 回帖堕落+1、发帖堕落+1▕▏升级条件：消耗60血液\n【等级2】6% 回帖堕落+1、发帖血液+1 堕落+1▕▏升级条件：消耗90金币\n【等级3】9% 回帖血液+1 堕落+1、发帖血液+1 堕落+1▕▏升级条件：消耗80咒术\n【等级4】12% 回帖血液+1 堕落+1、发帖血液+1 堕落+1▕▏升级条件：消耗180血液\n【 Max 】18% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202505/01/004428sgh1zz1cjrdgdqhj.gif", 40],
            "2": ["https://img.gamemale.com/album/202505/01/004429ze1dgefej66eq66v.gif", 40],
            "3": ["https://img.gamemale.com/album/202505/01/004429ekyzdamczdzaoyeo.gif", 40],
            "4": ["https://img.gamemale.com/album/202505/01/004430ozb5jt1wwccekdc1.gif", 40],
            "Max": ["https://img.gamemale.com/album/202505/01/004430f3wtkwjdd5rwetzq.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0579",
        "url_tid": "160197",
        "name": "圣水瓶",
        "date": "2025-5-2",
        "buy_limit": "无",
        "price": "999金币",
        "levels": "【等级1】2% 回帖金币+1、发帖金币+1▕▏升级条件：消耗1血液\n【等级2】4% 回帖金币+1、发帖金币+1▕▏升级条件：消耗10血液\n【等级3】8% 回帖金币+1、发帖金币+1▕▏升级条件：主题数≥100\n【等级4】25% 回帖金币+1、发帖金币+1▕▏升级条件：消耗1000血液\n【 Max 】50% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202505/01/004402n7ysdyodzaa5spd3.gif", 40],
            "2": ["https://img.gamemale.com/album/202505/01/004404cdhchnzsbdys2zns.gif", 40],
            "3": ["https://img.gamemale.com/album/202505/01/004405zvmqsddzcbaaxpqq.gif", 40],
            "4": ["https://img.gamemale.com/album/202505/01/004406jen4f4f5p4a7fxnp.gif", 40],
            "Max": ["https://img.gamemale.com/album/202505/01/004408c9999akrclzao9cz.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0578",
        "url_tid": "160196",
        "name": "阿加莎·哈克尼斯",
        "date": "2025-5-2",
        "buy_limit": "堕落≥94",
        "price": "400金币",
        "levels": "【等级1】1% 回帖咒术+1、发帖知识+1▕▏升级条件：消耗500血液\n【等级2】4% 回帖咒术+1 血液+1、发帖知识+1▕▏升级条件：消耗88咒术\n【等级3】8% 回帖咒术+1 血液+1、发帖知识+1▕▏升级条件：知识≥69\n【 Max 】8% 回帖金币+1 血液+2 堕落+1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202505/01/004308olixxxlgxikxehr4.gif", 40],
            "2": ["https://img.gamemale.com/album/202505/01/004313oqmzi3zt6zshgiir.gif", 82],
            "3": ["https://img.gamemale.com/forum/202505/02/010838z4l0szgqsll2qges.gif", 82],
            "Max": ["https://img.gamemale.com/album/202505/01/004319qqak34jahahmi294.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0577",
        "url_tid": "160195",
        "name": "狗狗",
        "date": "2025-5-2",
        "buy_limit": "主题数≥1",
        "price": "300金币",
        "levels": "【等级1】5% 回帖血液+1、发帖旅程+1▕▏升级条件：消耗300金币\n【等级2】8% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗550血液\n【等级3】10% 回帖血液+2、发帖旅程+1▕▏升级条件：金币≥1314\n【 Max 】12% 回帖血液+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202505/02/002033bfzr5qpq2prtzhq5.gif", 40],
            "2": ["https://img.gamemale.com/album/202505/02/002035gfod11fdspdb3osd.gif", 82],
            "3": ["https://img.gamemale.com/album/202505/02/002038pzhc80okc8cn0io5.gif", 82],
            "Max": ["https://img.gamemale.com/album/202505/01/004344ayzuz2yqy6396t26.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0576",
        "url_tid": "160194",
        "name": "穿靴子的猫",
        "date": "2025-5-2",
        "buy_limit": "旅程≥9",
        "price": "666金币",
        "levels": "【等级1】6% 回帖金币+1、发帖金币+1▕▏升级条件：消耗444血液\n【等级2】9% 回帖金币+1、发帖金币+1▕▏升级条件：消耗444金币\n【等级3】13% 回帖金币+3 血液-2、发帖金币+3 血液-2▕▏升级条件：在线时间≥365\n【等级4】12% 回帖血液+2、发帖血液+2▕▏升级条件：消耗666血液\n【等级5】12% 回帖血液+2 金币+1、发帖血液+2 金币+1▕▏升级条件：消耗88咒术\n【 Max 】12% 回帖血液+2 金币+2、发帖血液+2 金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202505/01/004325yyifpuf9tptlnhk9.gif", 40],
            "2": ["https://img.gamemale.com/album/202505/01/004327i13uxooqn2eounht.gif", 124],
            "3": ["https://img.gamemale.com/album/202505/01/004330efs63sbsff7zjisc.gif", 82],
            "4": ["https://img.gamemale.com/album/202505/01/004332j1wgew8nvnywna1n.gif", 124],
            "5": ["https://img.gamemale.com/album/202505/01/004334kkp4yqpwf5qqwppr.gif", 124],
            "Max": ["https://img.gamemale.com/album/202505/01/004337umagz9s1z9cgg8zf.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0575",
        "url_tid": "160193",
        "name": "John Reese",
        "date": "2025-5-2",
        "buy_limit": "金币≥1500",
        "price": "1000金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+1▕▏升级条件：金币≥2000\n【等级2】10% 回帖血液+1、发帖血液+1▕▏升级条件：消耗600血液\n【等级3】10% 回帖血液+2、发帖血液+1▕▏升级条件：金币≥2500\n【等级4】12% 回帖血液+1、发帖血液+1▕▏升级条件：消耗700金币\n【等级5】12% 回帖血液+2、发帖血液+1▕▏升级条件：金币≥3000\n【 Max 】15% 回帖血液+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202505/01/004248quy2mf2qpae7hpq7.gif", 40],
            "2": ["https://img.gamemale.com/album/202505/01/004250et2ws5t1ht00w1ws.gif", 82],
            "3": ["https://img.gamemale.com/album/202505/07/182955pp8844puzrto56ir.gif", 82],
            "4": ["https://img.gamemale.com/album/202505/01/004257c6htuohdtc6uucla.gif", 124],
            "5": ["https://img.gamemale.com/album/202505/07/183000nyzny30rl35ho5ru.gif", 124],
            "Max": ["https://img.gamemale.com/album/202505/01/004300onmynzz53nx06q4r.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0574",
        "url_tid": "159167",
        "name": "灵魂残絮聚合法",
        "date": "2025-4-14",
        "buy_limit": "参与【幽冥讨伐队】存活至大结局，达成职业专属任务",
        "price": "不可购买",
        "duration": "30天",
        "levels": "【等级1】2% 发帖金币+1▕▏升级条件：消耗1旅程\n【等级2】4% 发帖金币+1▕▏升级条件：消耗1血液\n【等级3】6% 发帖金币+1▕▏升级条件：消耗1咒术\n【 Max 】8% 发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202504/14/122515kmo6v6ocbr6htlro.gif", 40],
            "2": ["https://img.gamemale.com/album/202504/14/122515kwjjuxrjuucj8w0j.gif", 40],
            "3": ["https://img.gamemale.com/album/202504/14/122516s5v2v2yvpwyeqsgx.gif", 82],
            "Max": ["https://img.gamemale.com/album/202504/14/122516hb314v4wuuhblm4u.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0573",
        "url_tid": "159166",
        "name": "肉乖乖",
        "date": "2025-4-14",
        "buy_limit": "参与【幽冥讨伐队】存活至大结局奖励勋章",
        "price": "无",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：消耗1血液\n【等级2】1% 回帖血液+1▕▏升级条件：消耗1血液\n【等级3】2% 回帖血液+1▕▏升级条件：堕落≥3000\n【 Max 】3% 回帖 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202504/14/123355qhf6hfsxssmht6is.gif", 124],
            "2": ["https://img.gamemale.com/album/202504/14/122514dspc9tcslycss0cs.gif", 82],
            "3": ["https://img.gamemale.com/album/202504/14/122514hi0iitgiq0444o40.gif", 40],
            "Max": ["https://img.gamemale.com/album/202504/14/122514aggaia532fgaljyf.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0572",
        "url_tid": "157787",
        "name": "猫咪点唱机㊊",
        "date": "2025-3-23",
        "buy_limit": "<a href=\"/thread-157767-1-1.html\" target=\"_blank\">音乐交流区激励活动（点击跳转）</a>",
        "price": "不可购买",
        "duration": "30天",
        "levels": "【 Max 】10% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202503/22/184147dis00iszn2ip0hri.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0571",
        "url_tid": "157750",
        "name": "『道具超市』",
        "date": "2025-3-22",
        "buy_limit": "灵魂≥1，在线时间≥100，主题数≥1，发帖数≥1",
        "price": "1旅程",
        "levels": "【等级1】无属性▕▏升级条件：消耗75金币\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202503/22/124617gdhxfz88mgyfm47f.gif", 40],
            "Max": ["https://img.gamemale.com/album/202503/22/124623xqwr8aww4q4wwa41.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0570",
        "url_tid": "157542",
        "name": "神奇宝贝图鉴",
        "date": "2025-3-18",
        "buy_limit": "参与活动【决战开拓区】，完整参与7天正式活动",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202503/04/144757ilzmlasxmxui8sdl.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0569",
        "url_tid": "157540",
        "name": "神奇宝贝大师球",
        "date": "2025-3-18",
        "buy_limit": "参与活动【决战开拓区】",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202503/04/144847zhb5lj2kcilqkk5b.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0568",
        "url_tid": "155195",
        "name": "永亘环",
        "date": "2025-2-13",
        "buy_limit": "2025年新春发帖活动【蛇运长虹】纪念勋章",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202501/28/162331rf9q9qxvvh9cdcdh.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0567",
        "url_tid": "155117",
        "name": "『搓粉团珠』",
        "date": "2025-2-12",
        "buy_limit": "灵魂≥1或者主题数≥15（2025年元宵节限时购买）",
        "price": "15金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202502/12/142803aq6uewseoouu6ei9.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0566",
        "url_tid": "155113",
        "name": "小狮欢舞",
        "date": "2025-2-12",
        "buy_limit": "参加【舞狮献瑞】蛇年新春赛歌会，发布歌曲翻唱",
        "price": "15金币",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202502/09/152835gsc5cs35leu3el7s.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0565",
        "url_tid": "153419",
        "name": "脏兮兮的蛋",
        "date": "2025-1-29",
        "buy_limit": "发帖数≥200",
        "price": "404金币",
        "levels": "【等级1】10% 回帖血液+1▕▏升级条件：消耗404金币\n【等级2】10% 回帖血液-1 堕落+1▕▏升级条件：发帖数≥404\n【等级3】10% 回帖血液+4 咒术-1▕▏升级条件：血液≥404\n【等级4】10% 回帖血液-3 金币+3▕▏升级条件：金币≥404\n【等级5】无属性▕▏升级条件：主题数≥4\n【等级6】10% 回帖血液-4 咒术+1▕▏升级条件：发帖数≥1000\n【 Max 】10% 回帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202501/27/150400injmnyggygo7y8mx.gif", 40],
            "2": ["https://img.gamemale.com/album/202501/27/150401lkk57h7pkghk35h5.gif", 40],
            "3": ["https://img.gamemale.com/album/202501/27/151231q9ipy325gsow6hzj.gif", 40],
            "4": ["https://img.gamemale.com/album/202501/27/151412g7qzd77z3fsxabd7.gif", 40],
            "5": ["https://img.gamemale.com/album/202501/27/151412b34d6r4ped3z860m.gif", 40],
            "6": ["", 40],
            "Max": ["https://img.gamemale.com/album/202501/27/150402l52szqvsqlgpytsl.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0564",
        "url_tid": "153416",
        "name": "健忘礼物盒",
        "date": "2025-1-29",
        "buy_limit": "无",
        "price": "123金币",
        "levels": "【等级1】10% 回帖血液+1▕▏升级条件：消耗1知识\n【等级2】8% 回帖血液+1▕▏升级条件：消耗1知识\n【等级3】6% 回帖血液+1▕▏升级条件：知识≥50\n【等级4】4% 回帖血液+1▕▏升级条件：消耗-2知识\n【 Max 】3% 回帖血液+2 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202501/27/150043v68l4oo4tzovf8va.gif", 40],
            "2": ["https://img.gamemale.com/album/202501/27/150043ient9wehont94knh.gif", 40],
            "3": ["https://img.gamemale.com/album/202501/27/150043le6srpd0vmr90sz6.gif", 40],
            "4": ["https://img.gamemale.com/album/202501/27/150044d41s5sh7qahshqsq.gif", 40],
            "Max": ["https://img.gamemale.com/album/202501/27/150044dkzbbyz3d9gg2gad.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0563",
        "url_tid": "153415",
        "name": "婚姻登记册",
        "date": "2025-1-29",
        "buy_limit": "血液≥52",
        "price": "52金币",
        "levels": "【等级1】2% 回帖血液+1▕▏升级条件：消耗9血液\n【等级2】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗11血液\n【等级3】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗11血液\n【等级4】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗21血液\n【等级5】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗21血液\n【等级6】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗52血液\n【等级7】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗52血液\n【 Max 】5% 回帖血液+2、发帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202501/27/150249heu2zbzlb5rkhhzh.gif", 40],
            "2": ["https://img.gamemale.com/album/202501/27/150250odm1kbhrqftc5d51.gif", 40],
            "3": ["https://img.gamemale.com/album/202501/27/150250rzoq8xd5ao89c95o.gif", 40],
            "4": ["https://img.gamemale.com/album/202501/27/150251xggsydawwgzyywls.gif", 40],
            "5": ["https://img.gamemale.com/album/202501/27/150251mvz7q81e8rz8sp88.gif", 40],
            "6": ["https://img.gamemale.com/album/202501/27/150252wkfnfug2cgu2fue1.gif", 40],
            "7": ["https://img.gamemale.com/album/202501/27/150253b5syidtzdb7i857m.gif", 40],
            "Max": ["https://img.gamemale.com/album/202501/27/150253de4nywy1qnyz233e.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0562",
        "url_tid": "153413",
        "name": "神秘天球",
        "date": "2025-1-29",
        "buy_limit": "知识≥10",
        "price": "650金币",
        "levels": "【等级1】5%  回帖血液+1、发帖血液+1▕▏升级条件：消耗66咒术\n【等级2】10% 回帖血液+1、发帖血液+2▕▏升级条件：消耗66咒术\n【等级3】15% 回帖血液+1、发帖血液+2▕▏升级条件：消耗66咒术\n【等级4】20% 回帖血液+1、发帖血液+2▕▏升级条件：消耗-1知识\n【等级5】1%  回帖知识+1、发帖知识+1▕▏升级条件：知识≥100\n【等级6】20% 回帖堕落+1、发帖堕落+1▕▏升级条件：消耗1旅程\n【等级7】20% 回帖堕落-1、发帖堕落-1▕▏升级条件：消耗-1旅程\n【等级8】20% 回帖血液+1、发帖血液+2▕▏升级条件：消耗1灵魂\n【等级9】30% 回帖血液+1、发帖血液+2▕▏升级条件：血液≥666\n【 Max 】2% 发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202501/27/150316yk83gh2vkwvh2h33.gif", 40],
            "2": ["https://img.gamemale.com/album/202501/27/150316p6p5x6zb51iuktog.gif", 82],
            "3": ["https://img.gamemale.com/album/202501/27/150317uzsl63blllziueso.gif", 82],
            "4": ["https://img.gamemale.com/album/202501/27/150318hbbbjry1yxafpxcx.gif", 82],
            "5": ["https://img.gamemale.com/album/202501/27/150318okp8zfevfzpubs1j.gif", 82],
            "6": ["https://img.gamemale.com/album/202501/27/150325xdl061ykky6lyv0r.gif", 82],
            "7": ["https://img.gamemale.com/album/202501/27/150326u7f9qwxxel7h7wld.gif", 82],
            "8": ["https://img.gamemale.com/album/202501/27/150327mqhh7q45h0erabyq.gif", 82],
            "9": ["https://img.gamemale.com/album/202501/27/150328mj3zee1j32888ban.gif", 82],
            "Max": ["https://img.gamemale.com/album/202501/27/150329v30p5vva8485p113.gif", 124]
        }
    },
    {
        "type": "装备",
        "no": "0561",
        "url_tid": "153411",
        "name": "普通羊毛球",
        "date": "2025-1-29",
        "buy_limit": "无",
        "price": "200金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗120血液\n【等级2】7% 回帖金币+1▕▏升级条件：消耗180血液\n【等级3】9% 回帖金币+1▕▏升级条件：在线时间≥1200\n【 Max 】11% 回帖金币+1 血液+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202501/27/131014lijfad666oxd26a3.gif", 40],
            "2": ["https://img.gamemale.com/album/202510/02/001333hb9m1xsbyyjtmvjx.gif", 40],
            "3": ["https://img.gamemale.com/album/202501/27/131955nzc7v6vjw744k26c.gif", 40],
            "Max": ["https://img.gamemale.com/album/202501/27/132947foobk4oar9opbrci.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0560",
        "url_tid": "153409",
        "name": "贝儿(Belle)",
        "date": "2025-1-29",
        "buy_limit": "旅程≥20",
        "price": "666金币",
        "levels": "【等级1】5%  回帖金币+2、发帖血液+2▕▏升级条件：消耗99咒术\n【等级2】10% 回帖金币+2、发帖血液+2▕▏升级条件：消耗1314血液\n【等级3】15% 回帖金币+2、发帖血液+2▕▏升级条件：消耗1灵魂\n【 Max 】16% 回帖金币+2 血液+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202501/27/195024f3w3439syy9mhbzy.gif", 40],
            "2": ["https://img.gamemale.com/album/202501/27/195025s23swd1cqg5wsngw.gif", 82],
            "3": ["https://img.gamemale.com/album/202501/27/195026f29w92jbdall99ke.gif", 82],
            "Max": ["https://img.gamemale.com/album/202501/27/195027tyxex9dymf7qz9f8.gif", 82]
        }
    },
    {
        "type": "女从",
        "no": "0559",
        "url_tid": "153407",
        "name": "梅琳娜Melina",
        "date": "2025-1-29",
        "buy_limit": "无",
        "price": "999血液",
        "levels": "【等级1】8%  回帖金币+1 血液+1▕▏升级条件：消耗1灵魂\n【等级2】10% 回帖金币+1 血液+1▕▏升级条件：消耗-888血液\n【等级3】2%  回帖旅程+1、发帖灵魂+1▕▏升级条件：消耗1金币\n【等级4】25% 回帖金币+1▕▏升级条件：消耗1金币\n【等级5】20% 回帖金币+2 血液-1▕▏升级条件：消耗1金币\n【 Max 】25% 回帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202501/27/150301apgg7lfldzdfgy7z.gif", 40],
            "2": ["https://img.gamemale.com/album/202501/27/150302elj2ngkceo6z8e6r.gif", 124],
            "3": ["https://img.gamemale.com/album/202501/27/150303qvpcr0rr0ze44ivd.gif", 124],
            "4": ["https://img.gamemale.com/album/202501/27/150303fjmfx733a6pm1j6j.gif", 124],
            "5": ["https://img.gamemale.com/album/202501/27/150304mmbcfxt5tbmw8ata.gif", 124],
            "Max": ["https://img.gamemale.com/album/202501/27/150305sd1zi3l1gi431ls3.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0558",
        "url_tid": "153404",
        "name": "汉尼拔",
        "date": "2025-1-29",
        "buy_limit": "追随≥10",
        "price": "650金币",
        "levels": "【等级1】3%  回帖血液+1▕▏升级条件：消耗400金币\n【等级2】5%  回帖血液+1、发帖堕落+1▕▏升级条件：知识≥101\n【等级3】10% 回帖血液+1、发帖堕落+1▕▏升级条件：追随≥202\n【等级4】13% 回帖血液+2、发帖知识+1▕▏升级条件：消耗600血液\n【等级5】16% 回帖血液+2、发帖知识+1▕▏升级条件：消耗1灵魂\n【 Max 】18% 回帖血液+3、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202501/27/150200nnlkqxrdtrw9i7tr.gif", 40],
            "2": ["https://img.gamemale.com/album/202501/27/150202u6i3yn4b1ybo81c8.gif", 82],
            "3": ["https://img.gamemale.com/album/202501/27/150203cep1xf5gxxf2pogo.gif", 82],
            "4": ["https://img.gamemale.com/album/202501/27/150203p7ybm2vjn2t7ul5f.gif", 82],
            "5": ["https://img.gamemale.com/album/202501/27/150204hwysuurum3a2wa3s.gif", 124],
            "Max": ["https://img.gamemale.com/album/202501/27/150205fmppqvndidmqxy4q.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0557",
        "url_tid": "153403",
        "name": "【新春限定】果体 隆",
        "date": "2025-1-29",
        "buy_limit": "无",
        "price": "555金币",
        "levels": "【等级1】5%  回帖金币+1、发帖金币+1▕▏升级条件：消耗100血液\n【等级2】15% 回帖金币+1、发帖金币+1▕▏升级条件：消耗555血液\n【 Max 】50% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202412/23/095408ykewseqs3kvs3ofs.gif", 40],
            "2": ["https://img.gamemale.com/album/202412/23/095409m131uul13j6rjrrs.gif", 82],
            "Max": ["https://img.gamemale.com/album/202412/23/192101lgkmzaurp2vljkn4.gif", 82]
        }
    },
    {
        "type": "剧情",
        "no": "0556",
        "url_tid": "152369",
        "name": "『冰雕马拉橇』",
        "date": "2025-1-12",
        "buy_limit": "参与2024圣诞/2025元旦【冰河雪都】系列跨年活动",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202501/05/123612ufb4m31zzm9kppmd.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0555",
        "url_tid": "152367",
        "name": "银色溜冰鞋",
        "date": "2025-1-12",
        "buy_limit": "【冬宫学府】活动在技术交流大区发帖",
        "price": "无",
        "levels": "【 Max 】1% 回帖金币+1、发帖旅程+1 血液+1 ",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202501/05/123623g2gn1n0gzgn7ske1.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0554",
        "url_tid": "150921",
        "name": "都市：天际线2",
        "date": "2024-12-25",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202409/16/143417gfwljb6i61lqhool.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0553",
        "url_tid": "150919",
        "name": "羽毛胸针",
        "date": "2024-12-25",
        "buy_limit": "无",
        "price": "149金币",
        "levels": "【等级1】1% 回帖血液+1 旅程+1、发帖血液+1▕▏升级条件：好友数≥30\n【等级2】2% 回帖血液+1 旅程+1、发帖血液+1 旅程+1▕▏升级条件：好友数≥100\n【 Max 】3% 回帖血液+1 旅程+1、发帖血液+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202412/23/095434xzlgkosq7glpdppl.gif", 40],
            "2": ["https://img.gamemale.com/album/202412/23/095435bzpwtp68ps44t2pv.gif", 40],
            "Max": ["https://img.gamemale.com/album/202412/23/095436g9jeewz4hahg42pp.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0552",
        "url_tid": "150917",
        "name": "圣诞有铃",
        "date": "2024-12-25",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【等级1】2% 回帖血液+1 堕落+1、发帖堕落+1▕▏升级条件：堕落≥99\n【 Max 】6% 回帖血液+1 堕落-1、发帖堕落-1 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202412/23/095426suun7z8kv8g6qprt.gif", 40],
            "Max": ["https://img.gamemale.com/album/202412/23/095427djnuus0gjnp4kpn1.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0551",
        "url_tid": "150915",
        "name": "阿丽塔",
        "date": "2024-12-25",
        "buy_limit": "知识≥20",
        "price": "700金币",
        "levels": "【等级1】6% 回帖血液+1、发帖血液+1▕▏升级条件：消耗450金币\n【等级2】12% 回帖血液+1、发帖金币+2▕▏升级条件：消耗450血液\n【等级3】12% 回帖血液+2、发帖金币+2▕▏升级条件：消耗1灵魂\n【 Max 】16% 回帖血液+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202412/23/095404ugtagdho9anott2s.gif", 40],
            "2": ["https://img.gamemale.com/album/202412/23/095405gy2o58m8mryrm0z2.gif", 82],
            "3": ["https://img.gamemale.com/album/202412/23/095406a9574coxlyxcxy08.gif", 124],
            "Max": ["https://img.gamemale.com/album/202412/23/095407yg789q3nr9jyru8h.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0550",
        "url_tid": "150914",
        "name": "托比·马奎尔",
        "date": "2024-12-25",
        "buy_limit": "无",
        "price": "800金币",
        "levels": "【等级1】10% 回帖金币+2、发帖金币+2▕▏升级条件：消耗10咒术\n【等级2】10% 回帖堕落+2、发帖堕落+2▕▏升级条件：消耗10咒术\n【等级3】10% 回帖堕落-2、发帖堕落-2▕▏升级条件：消耗10咒术\n【 Max 】12% 回帖金币+2、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202412/23/163425ofaqmggiupaamq9j.gif", 40],
            "2": ["https://img.gamemale.com/album/202412/23/163426h6e144o5i4vwvaea.gif", 82],
            "3": ["https://img.gamemale.com/album/202412/23/163427opzekrrplre2es06.gif", 82],
            "Max": ["https://img.gamemale.com/album/202412/23/163428y7ov4bzb11qho1v7.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0549",
        "url_tid": "150913",
        "name": "奇异博士",
        "date": "2024-12-25",
        "buy_limit": "旅程≥14",
        "price": "700金币",
        "levels": "【等级1】2% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗777血液\n【等级2】6% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗777血液\n【等级3】8% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗1400血液\n【 Max 】14% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202412/23/095416x8a312vrzh112rvt.gif", 40],
            "2": ["https://img.gamemale.com/album/202308/06/210941v12xuljt1hu8hhux.gif", 82],
            "3": ["https://img.gamemale.com/album/202412/23/095418pb4ybbq8sspnbpef.gif", 82],
            "Max": ["https://img.gamemale.com/album/202412/23/095418my80lg8zyz8vm00t.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0548",
        "url_tid": "150911",
        "name": "古烈",
        "date": "2024-12-25",
        "buy_limit": "旅程≥20",
        "price": "560金币",
        "levels": "【等级1】2% 回帖咒术+1▕▏升级条件：追随≥33\n【等级2】4% 回帖血液+1 咒术+1▕▏升级条件：消耗88咒术\n【等级3】5% 回帖血液+1 咒术+1▕▏升级条件：消耗360血液\n【 Max 】8% 回帖血液+2 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202412/23/163416jie6vbi4h2ldaldd.gif", 40],
            "2": ["https://img.gamemale.com/album/202412/23/163417gljxiexrpxjijmnh.gif", 82],
            "3": ["https://img.gamemale.com/album/202412/23/163418aqqz9zeaqfdfjsj4.gif", 82],
            "Max": ["https://img.gamemale.com/album/202412/23/163419g6z8chx8ht46shje.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0547",
        "url_tid": "150223",
        "name": "水银日报社特约调查员",
        "date": "2024-12-15",
        "buy_limit": "【锯下七行】征服者奖励",
        "price": "无",
        "levels": "【 Max 】5% 发帖血液-1 金币-1 知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202412/11/194732dnnqnzwhwwaao2ww.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0546",
        "url_tid": "150222",
        "name": "奎兰",
        "date": "2024-12-15",
        "buy_limit": "【锯下七行】中成功存活7天",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202412/11/194737ai21zbcmal5g5355.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0545",
        "url_tid": "147987",
        "name": "梅克军徽",
        "date": "2024-11-11",
        "buy_limit": "【梅克军团】活动中发帖，参与攻击四个区域的军队",
        "price": "无",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗1血液\n【等级1】1% 发帖金币+1▕▏升级条件：消耗1血液\n【等级2】1% 发帖血液+1 金币+1▕▏升级条件：消耗1血液\n【等级3】1% 回帖血液+1、发帖血液+1 金币+1▕▏升级条件：消耗1血液\n【 Max 】1% 回帖血液+1 金币+1、发帖血液+1 金币+1",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202411/11/093835xwg7i7nj997jwsnj.gif", 40],
            "1": ["https://img.gamemale.com/album/202411/11/093837sus2p9tp22p882pp.gif", 82],
            "2": ["https://img.gamemale.com/album/202411/11/093838ap3uky32uwpdk637.gif", 40],
            "3": ["https://img.gamemale.com/album/202411/11/093839tid2hmy5hl9hl939.gif", 82],
            "Max": ["https://img.gamemale.com/album/202411/11/093840vr20s0o2ay2jd1dh.gif", 82]
        }
    },
    {
        "type": "剧情",
        "no": "0544",
        "url_tid": "146962",
        "name": "『南瓜拿铁』",
        "date": "2024-10-31",
        "buy_limit": "主题数≥1，发帖数≥1，注册天数≥1，在线时间≥1，旅程≥1（2024年10月31日~11月10日限时获取）",
        "price": "5金币",
        "duration": "5天（可续期）",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202410/29/123843sl3l5l6f35tp6gf9.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0543",
        "url_tid": "146145",
        "name": "『逆境中的幸运女神』",
        "date": "2024-10-15",
        "buy_limit": "【英雄再聚】活动中战功卓著的小队获得",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202410/15/105948d0yik711643klqsp.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0542",
        "url_tid": "146144",
        "name": "幸运女神的微笑",
        "date": "2024-10-15",
        "buy_limit": "【英雄再聚】活动中所有参与保卫GM村的勇士们获得",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202410/15/105948l54zh75sssju52m6.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0541",
        "url_tid": "144945",
        "name": "劫掠核芯",
        "date": "2024-9-30",
        "buy_limit": "【鏖战群蟲】活动奖励B",
        "price": "无",
        "levels": "【 Max 】1% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202409/24/114808ebrjv8vnjoz3ekyb.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0540",
        "url_tid": "144944",
        "name": "脉律辐石",
        "date": "2024-9-30",
        "buy_limit": "【鏖战群蟲】活动奖励A",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202409/24/115022icutmlnnzufc5p04.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0539",
        "url_tid": "144664",
        "name": "御医神兔",
        "date": "2024-9-24",
        "buy_limit": "参与2024年【界外来客】中秋发帖活动",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202409/16/114426zcvcdha50vcd9c5p.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0538",
        "url_tid": "144106",
        "name": "Zootopia",
        "date": "2024-9-17",
        "buy_limit": "旅程≥15",
        "price": "100金币",
        "levels": "【等级1】3% 回帖咒术+1▕▏升级条件：消耗1旅程\n【等级2】3% 回帖咒术+1▕▏升级条件：消耗1旅程\n【等级3】3% 回帖咒术+1▕▏升级条件：消耗1旅程\n【等级4】3% 回帖咒术+1▕▏升级条件：消耗1旅程\n【等级5】3% 回帖咒术+1▕▏升级条件：消耗-4旅程\n【 Max 】3% 回帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202409/16/140353vctzzx24yibo72yz.gif", 124],
            "2": ["https://img.gamemale.com/album/202409/16/140354qn1fclyasgr1zaal.gif", 124],
            "3": ["https://img.gamemale.com/album/202409/16/140355mpqbw29bqiqpqzz7.gif", 124],
            "4": ["https://img.gamemale.com/album/202409/16/140355q606wmwm655hu61c.gif", 124],
            "5": ["https://img.gamemale.com/album/202409/16/140356hzqhdxmo6oo9cnbu.gif", 124],
            "Max": ["https://img.gamemale.com/album/202409/16/140357q3y3cyhqdz747y43.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0537",
        "url_tid": "144104",
        "name": "半生黄金种",
        "date": "2024-9-17",
        "buy_limit": "无",
        "price": "120金币",
        "levels": "【等级1】2% 回帖金币+1、发帖金币+1▕▏升级条件：消耗1知识\n【等级2】2% 回帖咒术+1、发帖咒术+1▕▏升级条件：堕落≥22\n【等级3】20% 回帖金币+2 堕落+1、发帖金币+3▕▏升级条件：堕落≥23\n【等级4】3% 回帖咒术+1、发帖咒术+1▕▏升级条件：堕落≥123\n【 Max 】12% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202409/16/140404o83gefe3h359zy5p.gif", 40],
            "2": ["https://img.gamemale.com/album/202409/16/140404zary8xxas7y8yk88.gif", 40],
            "3": ["https://img.gamemale.com/album/202409/16/140405dgucuc8v8wmiv8u8.gif", 40],
            "4": ["https://img.gamemale.com/album/202409/16/140405mxddk0zeeex4cc4e.gif", 40],
            "Max": ["https://img.gamemale.com/album/202409/16/140406l5r28tp9u9t5ctcu.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0536",
        "url_tid": "144103",
        "name": "肃弓",
        "date": "2024-9-17",
        "buy_limit": "无",
        "price": "299金币",
        "levels": "【等级1】3% 回帖金币+1 堕落-1▕▏升级条件：消耗188血液\n【等级2】5% 回帖金币+1 堕落-1▕▏升级条件：消耗66咒术\n【 Max 】10% 回帖金币+1 血液-1 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202409/15/173905mvtfxplpppk17eem.gif", 40],
            "2": ["https://img.gamemale.com/album/202409/15/173905azn6osbxk6keerwr.gif", 40],
            "Max": ["https://img.gamemale.com/album/202409/15/173906t84iogk8g3cym4ip.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0535",
        "url_tid": "144101",
        "name": "叶卡捷琳娜",
        "date": "2024-9-17",
        "buy_limit": "主题数≥3",
        "price": "480金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗200金币\n【等级2】8% 回帖金币+1▕▏升级条件：消耗350血液\n【等级3】12% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：消耗66咒术\n【 Max 】12% 回帖金币+2 血液+1、发帖金币+2 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202409/16/140425lccavwcaa5y0w9we.gif", 40],
            "2": ["https://img.gamemale.com/album/202409/16/140425fcpc86m2jj2cicmp.gif", 82],
            "3": ["https://img.gamemale.com/album/202409/16/140426lvgzooqmxnyqomrk.gif", 82],
            "Max": ["https://img.gamemale.com/album/202409/16/140428jxnzncsu2ncaypka.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0534",
        "url_tid": "144099",
        "name": "莱昂纳多·迪卡普里奥",
        "date": "2024-9-17",
        "buy_limit": "知识≥10",
        "price": "666金币",
        "levels": "【等级1】8% 回帖金币+1、发帖金币+2▕▏升级条件：金币≥666\n【等级2】18% 回帖金币+3、发帖金币+3  升级条件：金币≥688\n【等级3】12% 回帖金币+2、发帖金币+2▕▏升级条件：消耗1灵魂\n【 Max 】15% 回帖金币+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202409/16/140418fwkwz38bqmtbj3i9.gif", 40],
            "2": ["https://img.gamemale.com/album/202409/16/140418dxnldwo8xpnf0a0d.gif", 82],
            "3": ["https://img.gamemale.com/album/202409/16/140419g00xxtd64ceewh6v.gif", 82],
            "Max": ["https://img.gamemale.com/album/202409/16/140420jclmmp0ofl2ipstn.gif", 124]
        }
    },
    {
        "type": "剧情",
        "no": "0533",
        "url_tid": "143409",
        "name": "『泥潭颂唱者』",
        "date": "2024-9-6",
        "buy_limit": "灵魂≥1，咒术≥10，在线时间≥100",
        "price": "1咒术",
        "duration": "7天（可续期）",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202409/06/000441qf1vfnj4qbq05zbf.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0532",
        "url_tid": "142919",
        "name": "金牌矿工",
        "date": "2024-8-23",
        "buy_limit": "全程参与【矿野歧途】活动且顺利折返，携带矿物数量前20%的小队成员",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1、发帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202408/20/162414t5in8hihu5ft72fp.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0531",
        "url_tid": "142917",
        "name": "小小安全帽",
        "date": "2024-8-23",
        "buy_limit": "全程参与【矿野歧途】活动，且小队顺利折返",
        "price": "无",
        "levels": "【 Max 】2% 发帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202408/20/162420kqar91j479qafqk6.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0530",
        "url_tid": "141820",
        "name": "『钟楼日暮』",
        "date": "2024-8-4",
        "buy_limit": "灵魂≥1，在线时间≥300，发帖数≥30，主题数≥3（2024年8月4日~9月30日限时获取）",
        "price": "1旅程",
        "duration": "30天（可续期）",
        "levels": "【等级0】无属性▕▏升级条件：好友数≥3\n【等级1】无属性▕▏升级条件：消耗1金币\n【 Max 】无属性",
        "levels_img": {
            "0": ["https://img.gamemale.com/album/202407/29/161455conqqbfcbvonpizc.gif", 40],
            "1": ["https://img.gamemale.com/album/202407/29/161455conqqbfcbvonpizc.gif", 40],
            "Max": ["https://img.gamemale.com/album/202407/29/163739p9ya9ky612dbpfyg.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0529",
        "url_tid": "141062",
        "name": "不洁圣子",
        "date": "2024-7-23",
        "buy_limit": "【疯狂之旅】2阶段全程参与",
        "price": "无",
        "levels": "【 Max 】1% 回帖咒术+1、发帖堕落+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202407/23/182956e101ky6klyvdlun6.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0528",
        "url_tid": "141060",
        "name": "古老金币",
        "date": "2024-7-23",
        "buy_limit": "【疯狂之旅】1阶段发帖并获得10追随",
        "price": "无",
        "levels": "【等级1】2% 回帖血液+1、发帖金币+1▕▏升级条件：消耗1血液\n【 Max 】2% 回帖金币+1、发帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202407/23/183210i2j5ziovbuioluia.gif", 40],
            "Max": ["https://img.gamemale.com/album/202407/23/183209g10abg374ga0wn7s.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0527",
        "url_tid": "139406",
        "name": "巨力橡果㊊",
        "date": "2024-7-1",
        "buy_limit": "<a href=\"/thread-167764-1-1.html\" target=\"_blank\">动漫区激励活动（点击跳转）</a>",
        "price": "不可购买",
        "duration": "30天",
        "levels": "【 Max 】20% 回帖金币+1 血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202406/28/212137jv2myy4yqb6qcub4.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0526",
        "url_tid": "139404",
        "name": "『分析天平』",
        "date": "2024-7-1",
        "buy_limit": "激励帖的审核人员",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202406/28/212140easasxspwrb6fawm.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0525",
        "url_tid": "138136",
        "name": "近地夜航",
        "date": "2024-6-16",
        "buy_limit": "【十一周年】活动期间发表主题帖奖励",
        "price": "无",
        "levels": "【 Max 】11% 发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202406/08/170716n2j5j52q7x9or5ee.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0524",
        "url_tid": "137697",
        "name": "变身器",
        "date": "2024-6-12",
        "buy_limit": "【细语欢歌】活动，根据抽取到的主题在音乐区发布翻唱歌曲",
        "price": "无",
        "levels": "【等级1】2% 回帖咒术+1、发帖咒术+1▕▏升级条件：咒术≥1000\n【 Max 】2% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/12/191431hrdjr2wwrjs2aals.gif", 40],
            "Max": ["https://img.gamemale.com/album/202406/12/191250bphrvoy0vc65v8i9.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0523",
        "url_tid": "137137",
        "name": "装了衣物的纸盒",
        "date": "2024-6-10",
        "buy_limit": "无",
        "price": "99金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗69血液\n【等级2】6% 回帖堕落+1、发帖堕落+1▕▏升级条件：旅程≥69\n【 Max 】10% 回帖血液-1 堕落+1、发帖血液-1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/07/175444b09ca8u138uz301a.gif", 40],
            "2": ["https://img.gamemale.com/album/202406/07/175444ibbsmzvyy1b77v5r.gif", 40],
            "Max": ["https://img.gamemale.com/album/202406/07/175445iflefeaj4enafknz.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0522",
        "url_tid": "137135",
        "name": "吸血猫蛋",
        "date": "2024-6-10",
        "buy_limit": "无",
        "price": "333金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：消耗66血液\n【等级2】6% 回帖血液+2、发帖血液+1▕▏升级条件：消耗666血液\n【等级3】7% 回帖血液+2、发帖血液+2▕▏升级条件：咒术≥123\n【 Max 】8% 回帖血液+2 咒术+1、发帖咒术+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/07/175359ynnx4omm45xmm8u5.gif", 40],
            "2": ["https://img.gamemale.com/album/202406/07/175400kclgtlj6c2fej37v.gif", 40],
            "3": ["https://img.gamemale.com/album/202406/07/175400rkyhf0zvkyh81xkm.gif", 40],
            "Max": ["https://img.gamemale.com/album/202406/07/175401ejl62lwaub8n2nr8.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0521",
        "url_tid": "137134",
        "name": "坏掉的月亮提灯",
        "date": "2024-6-10",
        "buy_limit": "无",
        "price": "380金币",
        "levels": "【等级1】4% 回帖咒术+1 血液+1、发帖咒术+1▕▏升级条件：咒术≥100\n【 Max 】6% 回帖咒术+1 血液+1、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/07/175315htzt1kzrx7xwnthe.gif", 40],
            "Max": ["https://img.gamemale.com/album/202406/07/175315ktt311toutu3z53u.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0519",
        "url_tid": "137117",
        "name": "神秘挑战书",
        "date": "2024-6-10",
        "buy_limit": "旅程≥28",
        "price": "348金币",
        "levels": "【等级1】8% 回帖血液+1▕▏升级条件：消耗2旅程\n【等级2】8% 回帖血液+1▕▏升级条件：消耗2旅程\n【等级3】8% 回帖血液+1▕▏升级条件：消耗2旅程\n【等级4】8% 回帖血液+1▕▏升级条件：消耗2旅程\n【等级5】8% 回帖血液+1▕▏升级条件：消耗-2旅程\n【等级6】8% 回帖血液+1▕▏升级条件：消耗-2旅程\n【等级7】8% 回帖血液+1▕▏升级条件：消耗-2旅程\n【等级8】8% 回帖血液+1▕▏升级条件：消耗-2旅程\n【等级9】8% 回帖血液+1▕▏升级条件：在线时间≥2888\n【 Max 】1% 回帖血液+8、发帖血液+8",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/07/175339ugwzt9y65i7tz3jy.gif", 40],
            "2": ["https://img.gamemale.com/album/202406/07/175340qp9yib26wmzw6r2m.gif", 124],
            "3": ["https://img.gamemale.com/album/202406/07/175341ckazei4t4kjkatoo.gif", 124],
            "4": ["https://img.gamemale.com/album/202406/07/175342yz0a8kjpn9ii43jp.gif", 124],
            "5": ["https://img.gamemale.com/album/202406/07/175343vlu7llurj10lrgqj.gif", 124],
            "6": ["https://img.gamemale.com/album/202406/07/175344qnuwx7ee7zj5ln7x.gif", 124],
            "7": ["https://img.gamemale.com/album/202406/07/175345v5ubrggvnb1ggsbg.gif", 124],
            "8": ["https://img.gamemale.com/album/202406/07/175346h3ffjjfo3ofgv2fj.gif", 124],
            "9": ["https://img.gamemale.com/album/202406/07/175347npnp3ph2zfppqxoz.gif", 124],
            "Max": ["https://img.gamemale.com/album/202406/07/175347fg7acj3rajgcmlqm.gif", 40]
        }
    },
    {
        "type": "咒术",
        "no": "0520",
        "url_tid": "137113",
        "name": "太空列车票",
        "date": "2024-6-10",
        "buy_limit": "知识≥10",
        "price": "5咒术",
        "duration": "5天",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：旅程≥30\n【等级2】5% 回帖血液+1▕▏升级条件：旅程≥50\n【等级3】7% 回帖血液+1 金币+1▕▏升级条件：知识≥40\n【等级4】12% 回帖血液+1 金币+1▕▏升级条件：消耗30金币\n【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/07/175254x3pg346a3r0aph7h.gif", 40],
            "2": ["https://img.gamemale.com/album/202406/07/175255z1948s303e3o4t41.gif", 40],
            "3": ["https://img.gamemale.com/album/202406/07/175255jcxvaozv3vm5ycyz.gif", 82],
            "4": ["https://img.gamemale.com/album/202406/07/175258pdrcqdu07lvy0uvc.gif", 82],
            "Max": ["https://img.gamemale.com/album/202406/07/175259sg0tnb6xmjtvcjxv.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0518",
        "url_tid": "137110",
        "name": "狄翁・勒萨若",
        "date": "2024-6-10",
        "buy_limit": "在线时间≥160",
        "price": "480金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗160金币\n【等级2】2% 回帖血液+1 发帖血液+1▕▏升级条件：消耗160金币\n【等级3】4% 回帖血液+1 发帖咒术+1▕▏升级条件：消耗320血液\n【等级4】6% 回帖血液+2 发帖咒术+1▕▏升级条件：消耗48咒术\n【等级5】8% 回帖血液+2 金币+1、发帖咒术+2 金币+3▕▏升级条件：消耗64咒术\n【 Max 】10% 回帖血液+2 金币+2、发帖知识+1 金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/07/175304re1d73zno19n37pn.gif", 40],
            "2": ["https://img.gamemale.com/album/202406/07/175305lf3uwwfvqwat2wqk.gif", 82],
            "3": ["https://img.gamemale.com/album/202406/07/175306r8tert08y8ws9dwk.gif", 82],
            "4": ["https://img.gamemale.com/album/202406/07/175308jki23rz8z38s2r83.gif", 124],
            "5": ["https://img.gamemale.com/album/202406/07/175309hyal99plxwanxpna.gif", 124],
            "Max": ["https://img.gamemale.com/album/202406/07/175311zmnhmmn9m9ymeu9m.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0517",
        "url_tid": "137108",
        "name": "希德法斯·特拉蒙",
        "date": "2024-6-10",
        "buy_limit": "旅程≥16",
        "price": "720金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗48咒术\n【等级2】3% 回帖咒术+1 血液+1、发帖咒术+1▕▏升级条件：消耗160血液\n【等级3】5% 回帖咒术+1 血液+1、发帖咒术+1▕▏升级条件：消耗320血液\n【 Max 】8% 回帖咒术+1 血液+2、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/07/175409ab60kf4o3o4jbdut.gif", 40],
            "2": ["https://img.gamemale.com/album/202406/07/175411qwtcw2w19r2u4hfs.gif", 82],
            "3": ["https://img.gamemale.com/album/202406/07/175412huxhwu3g435u3f00.gif", 124],
            "Max": ["https://img.gamemale.com/album/202406/07/175415w552ty5e2oosqtt8.gif", 124]
        }
    },
    {
        "type": "女从",
        "no": "0516",
        "url_tid": "137107",
        "name": "吉尔·沃瑞克",
        "date": "2024-6-10",
        "buy_limit": "知识≥16",
        "price": "460金币",
        "levels": "【等级1】无属性▕▏升级条件： 消耗80金币\n【等级2】6% 回帖金币+2、发帖血液+1▕▏升级条件：消耗80血液\n【等级3】5% 回帖金币+3、发帖血液+2▕▏升级条件：消耗160血液\n【等级4】4% 回帖金币+4、发帖血液+3▕▏升级条件：消耗320血液\n【 Max 】8% 回帖金币+3、发帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/07/175326ewom7pmvg8n8878j.gif", 40],
            "2": ["https://img.gamemale.com/album/202406/07/175327cgzp88cjljepaoqe.gif", 82],
            "3": ["https://img.gamemale.com/album/202406/07/175328gak384jr0qku4610.gif", 124],
            "4": ["https://img.gamemale.com/album/202406/07/175329pkumhmuxqwzmwuwu.gif", 124],
            "Max": ["https://img.gamemale.com/album/202406/07/175331rsra1a4wqak8puzr.gif", 124]
        }
    },
    {
        "type": "天赋",
        "no": "0515",
        "url_tid": "137106",
        "name": "五谷丰年",
        "date": "2024-6-10",
        "buy_limit": "在线时间≥120，注册天数≥24，旅程≥24",
        "price": "无",
        "levels": "【等级1】4% 回帖血液+2 金币-1、发帖血液+4▕▏升级条件：血液≥365\n【等级2】5% 回帖血液+2 金币-1、发帖血液+4▕▏升级条件：知识≥365\n【等级3】12% 回帖血液+2 金币-1、发帖血液+4▕▏升级条件：旅程≥365\n【 Max 】24% 回帖金币+1、发帖金币+4",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202406/09/002607r5tnl5kmhlz959ky.gif", 82],
            "2": ["https://img.gamemale.com/album/202406/07/204132kz1rjrx7a0b09x1l.gif", 124],
            "3": ["https://img.gamemale.com/album/202406/07/204132roou661udo1borrj.gif", 82],
            "Max": ["https://img.gamemale.com/album/202406/07/205420sdk9871c4qeedu4e.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0514",
        "url_tid": "136035",
        "name": "金翼使㊊",
        "date": "2024-6-1",
        "buy_limit": "<a href=\"/thread-167739-1-1.html\" target=\"_blank\">单机游戏区，当月获得2次[优秀]或1次[精华]（点击跳转）</a>",
        "price": "不可购买",
        "duration": "30天",
        "levels": "【 Max 】20% 回帖金币+1 血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202405/30/104609wjzazru8lsaa4bza.gif", 40]
        }
    },
    {
        "type": "故事",
        "no": "0513",
        "url_tid": "135738",
        "name": "巴比伦辞典",
        "date": "2024-5-26",
        "buy_limit": "<a href=\"/thread-162802-1-1.html\" target=\"_blank\">单机游戏区激励活动（点击跳转）</a>",
        "price": "不可购买",
        "levels": "【 Max 】100% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202308/29/153312pp913zqj36m3zpli.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0512",
        "url_tid": "135530",
        "name": "照相机",
        "date": "2024-5-22",
        "buy_limit": "【瞬时映景】活动奖励",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202405/21/111620tshz4cnc6kfsk36x.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0511",
        "url_tid": "134663",
        "name": "阿怪",
        "date": "2024-5-7",
        "buy_limit": "【夜影迷踪】活动参与奖",
        "price": "无",
        "levels": "【 Max 】2% 发帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202405/07/171521eg84b2ogvbqgaaqg.gif", 82]
        }
    },
    {
        "type": "剧情",
        "no": "0510",
        "url_tid": "134127",
        "name": "『流星赶月』",
        "date": "2024-5-1",
        "buy_limit": "灵魂≥1，发帖数≥5，主题数≥1（2024年5月1日~5月31日限时获取）",
        "price": "1旅程（2024年5月1日~5月11日）/ 5旅程（2024年5月12日~5月31日）",
        "duration": "30天（可续期）",
        "levels": "【等级1】无属性▕▏升级条件：主题数≥10\n【等级2】无属性▕▏升级条件：主题数≥50\n【等级3】无属性▕▏升级条件：主题数≥100\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202405/01/104737h8u40k09yb1buvhs.gif", 40],
            "2": ["https://img.gamemale.com/album/202405/01/104737hf66ydgq417yp1pq.gif", 40],
            "3": ["https://img.gamemale.com/album/202405/01/104738zbemlbquqcbhbew1.gif", 40],
            "Max": ["https://img.gamemale.com/album/202405/01/104738xr7w9rc9c9wkooo5.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0509",
        "url_tid": "133899",
        "name": "一只陶瓮",
        "date": "2024-4-28",
        "buy_limit": "【万物货郎】活动胜出奖励",
        "price": "无",
        "levels": "【 Max 】1% 回帖金币+1 咒术+1、发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202404/25/223157xajb8judoqjqbjjy.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0508",
        "url_tid": "133898",
        "name": "幽浮起司堡",
        "date": "2024-4-28",
        "buy_limit": "【梦游列国】一阶段活动发帖奖励",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1、发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202404/25/223156amvffvttm6w5chtv.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0507",
        "url_tid": "132585",
        "name": "『先知灵药』",
        "date": "2024-4-4",
        "buy_limit": "灵魂≥1，知识≥10（2024年4月2日~4月30日限时获取）",
        "price": "10金币",
        "levels": "【等级1】无属性▕▏升级条件：旅程≥100\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202403/21/130027nqhli96ll11h9u2g.gif", 40],
            "Max": ["https://img.gamemale.com/album/202403/21/130053cgz5zto94bg5gbq9.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0506",
        "url_tid": "129790",
        "name": "龙鳞石",
        "date": "2024-2-17",
        "buy_limit": "参与2024年论坛龙年新春发帖活动",
        "price": "无",
        "levels": "【 Max 】1% 发帖金币+6",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202402/15/181357h1gqohusg3ot5n2n.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0505",
        "url_tid": "129610",
        "name": "『不败之花』",
        "date": "2024-2-15",
        "buy_limit": "灵魂≥1，堕落≥1",
        "price": "1血液",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202402/13/185914blucl6txxplhgp6q.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0504",
        "url_tid": "129162",
        "name": "约书亚・罗兹菲尔德",
        "date": "2024-2-10",
        "buy_limit": "堕落≥160",
        "price": "500金币",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：消耗1600金币\n【等级2】2% 回帖血液+1 堕落+2、发帖灵魂+1 堕落+3▕▏升级条件：堕落≥16\n【等级3】10% 回帖血液+3 堕落+1、发帖血液+3▕▏升级条件：堕落≥32\n【等级4】10% 回帖血液+2、发帖血液+2▕▏升级条件：堕落≥80\n【等级5】6% 回帖堕落-1、发帖堕落-1▕▏升级条件：堕落≥160\n【等级6】8% 回帖堕落-1、发帖堕落-1▕▏升级条件：堕落≥250\n【 Max 】10% 回帖堕落-2、发帖堕落-2",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202402/12/113425k93x7s939xjvs1y3.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010523nud6mc32f8vqqgtp.gif", 124],
            "3": ["https://img.gamemale.com/forum/202402/15/124123w0dw5b1xoznb1bwd.gif", 124],
            "4": ["https://img.gamemale.com/forum/202402/12/194407v96eq9gyqtb6qx61.gif", 124],
            "5": ["https://img.gamemale.com/forum/202402/12/113841i189z7p6mz1p4947.gif", 124],
            "6": ["https://img.gamemale.com/forum/202402/12/113427f082z542u4enjc22.gif", 124],
            "Max": ["https://img.gamemale.com/album/202402/09/010523nud6mc32f8vqqgtp.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0503",
        "url_tid": "129161",
        "name": "克莱夫・罗兹菲尔德",
        "date": "2024-2-10",
        "buy_limit": "主题数≥16",
        "price": "622金币",
        "levels": "【等级1】3% 回帖金币+1▕▏升级条件：消耗320金币\n【等级2】5% 回帖金币+1▕▏升级条件：消耗480血液\n【等级3】7% 回帖金币+2、发帖咒术+1▕▏升级条件：消耗640血液\n【等级4】9% 回帖金币+2、发帖咒术+1▕▏升级条件：消耗640血液\n【等级5】13% 回帖金币+2、发帖咒术+1▕▏升级条件：消耗1灵魂\n【 Max 】16% 回帖金币+2 血液+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010326gggncgrozz9c4zun.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010326owtattfffat40swv.gif", 82],
            "3": ["https://img.gamemale.com/album/202402/10/011317j2xji14dff2z6x11.gif", 124],
            "4": ["https://img.gamemale.com/album/202402/09/010329p8xczcg8vhhvxpx8.gif", 124],
            "5": ["https://img.gamemale.com/album/202402/09/010330cige681moemjxmm1.gif", 124],
            "Max": ["https://img.gamemale.com/album/202402/09/010331n5ddk93t4ss7ckt8.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0502",
        "url_tid": "129159",
        "name": "苇名弦一郎",
        "date": "2024-2-10",
        "buy_limit": "追随≥15",
        "price": "666金币",
        "levels": "【等级1】3% 回帖咒术+1、发帖旅程+1▕▏升级条件：消耗666血液\n【等级2】5% 回帖咒术+1、发帖旅程+1▕▏升级条件：消耗999血液\n【等级3】8% 回帖咒术+1、发帖旅程+1▕▏升级条件：消耗169咒术\n【 Max 】5% 回帖旅程+1、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010511rjampzaa0ddllddo.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010512johogsl2l22qutsv.gif", 82],
            "3": ["https://img.gamemale.com/album/202402/09/010513cwb8eyi3n5r5wnkl.gif", 82],
            "Max": ["https://img.gamemale.com/album/202402/09/010515p0w7gar1wauth3ym.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0501",
        "url_tid": "129158",
        "name": "里昂（RE4）",
        "date": "2024-2-10",
        "buy_limit": "主题数≥5",
        "price": "600金币",
        "levels": "【等级1】3% 回帖金币+1▕▏升级条件：消耗300血液\n【等级2】5% 回帖金币+1 发帖咒术+1▕▏升级条件：消耗600血液\n【等级3】10% 回帖金币+2 发帖咒术+1▕▏升级条件：消耗600金币\n【等级4】18% 回帖金币+3▕▏升级条件：金币≥444\n【 Max 】12% 回帖金币+3 发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010352s95pn3c4ug4u49lz.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010353tu8qeqjqquc1qv33.gif", 82],
            "3": ["https://img.gamemale.com/album/202402/09/010354isskvigw00dd6p0v.gif", 82],
            "4": ["https://img.gamemale.com/album/202402/09/010355liauwkivvbijwbkw.gif", 82],
            "Max": ["https://img.gamemale.com/album/202402/09/010356thhv8uecu9e5vvmr.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0500",
        "url_tid": "129127",
        "name": "极客的晚宴",
        "date": "2024-2-10",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202312/31/234346gb3zebabvtvc1a11.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0499",
        "url_tid": "129126",
        "name": "雄躯的昇格",
        "date": "2024-2-10",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202312/31/235519khsd6s7kihzd7psx.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0498",
        "url_tid": "129123",
        "name": "波纹蓝蛋",
        "date": "2024-2-10",
        "buy_limit": "旅程≥25",
        "price": "500金币",
        "levels": "【等级1】1% 回帖知识+1▕▏升级条件：消耗400血液\n【等级2】2% 回帖知识+1、发帖知识+1▕▏升级条件：消耗800血液\n【 Max 】4% 回帖知识+1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010315fwzwwj3z6wpj66jj.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010315z88al8c628f6m2l7.gif", 40],
            "Max": ["https://img.gamemale.com/album/202402/09/010316bdicvfvf1zp7354z.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0497",
        "url_tid": "129122",
        "name": "崩朽龙卵",
        "date": "2024-2-10",
        "buy_limit": "主题数≥10",
        "price": "500金币",
        "levels": "【等级1】3% 回帖咒术+1▕▏升级条件：消耗400血液\n【等级2】5% 回帖咒术+1▕▏升级条件：消耗800血液\n【 Max 】2% 回帖咒术+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010244u08b5q0q8nbgigqb.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010245wycidw9ggeg62vd2.gif", 82],
            "Max": ["https://img.gamemale.com/album/202402/09/010245hmuurzvzuyhjzwmm.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0496",
        "url_tid": "129120",
        "name": "冰海钓竿",
        "date": "2024-2-10",
        "buy_limit": "追随≥30",
        "price": "500金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗300金币\n【等级2】8% 回帖金币+2▕▏升级条件：消耗600金币\n【等级3】10% 回帖金币+3▕▏升级条件：消耗900金币\n【 Max 】15% 回帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010305w0d00iggdqh1agik.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010305csjwucys2cayqgjc.gif", 40],
            "3": ["https://img.gamemale.com/album/202402/09/010306txcdhook4wfbqwwh.gif", 82],
            "Max": ["https://img.gamemale.com/album/202402/09/010306sh44zaiajlic40nb.gif", 124]
        }
    },
    {
        "type": "装备",
        "no": "0495",
        "url_tid": "129119",
        "name": "射手的火枪",
        "date": "2024-2-10",
        "buy_limit": "咒术≥30",
        "price": "550金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗100金币\n【等级2】7% 回帖金币+1▕▏升级条件：消耗200金币\n【等级3】5% 回帖金币+2▕▏升级条件：消耗300金币\n【等级4】10% 回帖金币+2▕▏升级条件：消耗650金币\n【 Max 】12% 回帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010501f11dxtmk8pttm6zz.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010501lnh22s6q6jd6vahf.gif", 40],
            "3": ["https://img.gamemale.com/album/202402/09/010502gl1k0ib1eqqiqyb8.gif", 82],
            "4": ["https://img.gamemale.com/album/202402/09/010502ln4j3gpiz4383nip.gif", 82],
            "Max": ["https://img.gamemale.com/album/202402/09/010502kh0q0x7wwpw1x07o.gif", 82]
        }
    },
    {
        "type": "女从",
        "no": "0494",
        "url_tid": "129118",
        "name": "“米凯拉的锋刃”玛莲妮亚",
        "date": "2024-2-10",
        "buy_limit": "血液≥200",
        "price": "480金币",
        "levels": "【等级1】5% 回帖堕落+1、发帖堕落+1▕▏升级条件：堕落≥50\n【等级2】6% 回帖血液+1 堕落+1、发帖堕落+1▕▏升级条件：堕落≥100\n【等级3】6% 回帖血液+2 堕落+1、发帖堕落+1▕▏升级条件：消耗222血液\n【等级4】8% 回帖血液+3、发帖堕落+1▕▏升级条件：消耗444血液\n【等级5】10% 回帖堕落-1▕▏升级条件：消耗111咒术\n【 Max 】10% 回帖血液+3 堕落+1、发帖血液+3 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010225kp909y4kjjpzylly.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010226g58rar3tlr8wwnjw.gif", 82],
            "3": ["https://img.gamemale.com/album/202402/09/010227sw5sm5m5frjozumm.gif", 82],
            "4": ["https://img.gamemale.com/album/202402/09/010227kk2xn98nhdki8hbg.gif", 82],
            "5": ["https://img.gamemale.com/album/202402/09/010230o5vss5ibvps9es0t.gif", 82],
            "Max": ["https://img.gamemale.com/album/202402/09/010231l15c89y44096y5ne.gif", 124]
        }
    },
    {
        "type": "女从",
        "no": "0493",
        "url_tid": "129115",
        "name": "朱迪·霍普斯",
        "date": "2024-2-10",
        "buy_limit": "知识≥15",
        "price": "500金币",
        "levels": "【等级1】5% 回帖金币+1、发帖血液+1▕▏升级条件：知识≥50\n【等级2】7% 回帖金币+1、发帖血液+1▕▏升级条件：消耗550金币\n【等级3】10% 回帖金币+2、发帖血液+2▕▏升级条件：消耗600血液\n【 Max 】13% 回帖金币+2 血液+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010535f41h4y44pis47c5s.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010536guz959pcw70hs7u7.gif", 82],
            "3": ["https://img.gamemale.com/album/202402/09/010537w91j10j7b1z5jby0.gif", 82],
            "Max": ["https://img.gamemale.com/album/202402/09/010538rny4g1yy8ks8bzb1.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0492",
        "url_tid": "129113",
        "name": "尼克·王尔德",
        "date": "2024-2-10",
        "buy_limit": "堕落≥30",
        "price": "500金币",
        "levels": "【等级1】5% 回帖血液+1、发帖金币+1▕▏升级条件：知识≥50\n【等级2】7% 回帖血液+1、发帖金币+1▕▏升级条件：消耗550血液\n【等级3】10% 回帖血液+2、发帖金币+2▕▏升级条件：消耗600金币\n【 Max 】13% 回帖血液+2 金币+1、发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010403ywyppzmwm8s73zxw.gif", 40],
            "2": ["https://img.gamemale.com/album/202402/09/010404lnfiz3xftnw42vny.gif", 82],
            "3": ["https://img.gamemale.com/album/202402/09/010405m55m1wr63d1ougm1.gif", 82],
            "Max": ["https://img.gamemale.com/album/202402/09/010406m0bl2az02o0d2ja2.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0491",
        "url_tid": "128474",
        "name": "征服之王",
        "date": "2024-1-31",
        "buy_limit": "2024年活动【七日之屿】资源数排名前列",
        "price": "无",
        "levels": "【 Max 】10% 回帖金币+1 血液-1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202401/30/175514mydikjz03evy43d3.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0490",
        "url_tid": "128473",
        "name": "岛屿探险家",
        "date": "2024-1-31",
        "buy_limit": "2024年活动【七日之屿】全程参与",
        "price": "无",
        "levels": "【 Max 】1% 回帖金币+1、发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202401/30/175512mx2353ree5353p9r.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0489",
        "url_tid": "127026",
        "name": "『列车长』",
        "date": "2024-1-5",
        "buy_limit": "【极地特快】活动中，拼车成功的列车长奖励",
        "price": "无",
        "levels": "【等级 初级】无属性▕▏升级条件：好友数≥6\n【等级1】1% 回帖旅程+1 血液+1、发帖旅程+1 血液+1▕▏升级条件：消耗12旅程\n【等级2】1% 回帖旅程+1 血液+1、发帖旅程+1 血液+1▕▏升级条件：消耗-12旅程\n【等级3】1% 回帖旅程+1 血液+1、发帖旅程+1 血液+1▕▏升级条件：灵魂≥1\n【 Max 】1% 回帖旅程+1 血液+1、发帖旅程+1 血液+1",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202312/21/194233wvjmxvvqiglnxvwl.png", 40],
            "1": ["https://img.gamemale.com/album/202312/21/194233wvjmxvvqiglnxvwl.png", 40],
            "2": ["https://img.gamemale.com/album/202312/21/194233wvjmxvvqiglnxvwl.png", 40],
            "3": ["https://img.gamemale.com/album/202312/21/194233wvjmxvvqiglnxvwl.png", 40],
            "Max": ["https://img.gamemale.com/album/202312/26/153217fdhxe2dx8fxx59fx.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0488",
        "url_tid": "126969",
        "name": "特供热巧",
        "date": "2024-1-4",
        "buy_limit": "【极地特快】活动中，拼车成功的车厢乘务员奖励",
        "price": "无",
        "levels": "【等级1】1% 回帖血液+1、发帖血液+1▕▏升级条件：消耗1金币\n【 Max 】1% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/25/112145mmd9i9come9o4edm.gif", 40],
            "Max": ["https://img.gamemale.com/album/202312/26/152945wolwikymmhh3tdod.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0487",
        "url_tid": "126968",
        "name": "六出冰花",
        "date": "2024-1-4",
        "buy_limit": "1:【雪中飞舞】发帖奖励；2:【极地特快】未拼车成功的列车长和车厢乘务员留念",
        "price": "无",
        "levels": "【 Max 】1% 发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202312/23/121754ooycayf0f6a0ozc6.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0486",
        "url_tid": "126634",
        "name": "『金色车票』",
        "date": "2023-12-31",
        "buy_limit": "2023年【极地特快】活动，成功触发隐藏：平安夜前发出“相信”的声音",
        "price": "无",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗1旅程\n【等级1】无属性▕▏升级条件：消耗-1旅程\n【等级2】无属性▕▏升级条件：灵魂≥1\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/26/153359c315l2kvzqclz5z1.gif", 40],
            "2": ["https://img.gamemale.com/album/202312/26/153359c315l2kvzqclz5z1.gif", 40],
            "初级": ["https://img.gamemale.com/album/202312/26/153359c315l2kvzqclz5z1.gif", 40],
            "Max": ["https://img.gamemale.com/album/202312/26/153431efmcz94cfhf0e4z6.gif", 82]
        }
    },
    {
        "type": "场景&版块",
        "no": "0485",
        "url_tid": "126122",
        "name": "最终幻想XVI",
        "date": "2023-12-25",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202312/20/210430shnvla9vum4vh49n.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0484",
        "url_tid": "126121",
        "name": "可疑的肉蛋",
        "date": "2023-12-25",
        "buy_limit": "堕落≥50",
        "price": "500金币",
        "levels": "【等级1】 3% 回帖堕落+1▕▏升级条件：消耗49咒术\n【等级2】 5% 回帖堕落+1▕▏升级条件：消耗-1知识\n【等级3】 7% 回帖堕落+1▕▏升级条件：知识≥49\n【等级4】10% 回帖堕落+1▕▏升级条件：消耗1灵魂\n【 Max 】2% 回帖知识+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/20/205711pf8g8k4r7p4a67l4.gif", 40],
            "2": ["https://img.gamemale.com/album/202312/20/205712lxc6eefehyzenezy.gif", 40],
            "3": ["https://img.gamemale.com/album/202312/20/205712punr95d523pn9lpn.gif", 40],
            "4": ["https://img.gamemale.com/album/202312/20/205845an3czunah2c0b3a5.gif", 40],
            "Max": ["https://img.gamemale.com/album/202312/20/205845u0v55mxhsnvhyyk0.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0483",
        "url_tid": "126120",
        "name": "无垠",
        "date": "2023-12-25",
        "buy_limit": "无（该勋章不可寄售，仅可回收）",
        "price": "2000金币",
        "levels": "【等级1】1% 回帖血液+1、发帖血液+1▕▏升级条件：血液≥1\n【等级2】1% 回帖旅程+1、发帖旅程+1▕▏升级条件：堕落≥800\n【等级3】无属性▕▏升级条件：消耗1血液\n【等级4】6% 回帖旅程+1、发帖旅程+1▕▏升级条件：堕落≥100\n【等级5】5% 回帖旅程+1 血液+1、发帖旅程+1 血液+1▕▏升级条件：堕落≥200\n【等级6】4% 回帖旅程+1 血液+1、发帖旅程+1 血液+1▕▏升级条件：堕落≥300\n【等级7】3% 回帖旅程+1、发帖旅程+1▕▏升级条件：堕落≥400\n【等级8】3% 回帖旅程+1 血液+1、发帖旅程+1 血液+1▕▏升级条件：堕落≥500\n【等级9】3% 回帖旅程+1、发帖旅程+1▕▏升级条件：堕落≥600\n【等级10】2% 回帖旅程+1、发帖旅程+1▕▏升级条件：堕落≥700\n【 Max 】1% 回帖血液+1 旅程+1、发帖血液+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/21/181357fxtci2iuplv9vt2l.gif", 40],
            "2": ["https://img.gamemale.com/album/202312/21/181358cbyhylp1l05phh7a.gif", 40],
            "3": ["https://img.gamemale.com/album/202312/21/181359tpxd016f90vh68tf.gif", 40],
            "4": ["https://img.gamemale.com/album/202312/21/181359k00x6u9hyt8706ul.gif", 40],
            "5": ["https://img.gamemale.com/album/202312/21/181401fiiiwi8wdqaaawax.gif", 124],
            "6": ["https://img.gamemale.com/album/202312/21/181403n9m5uuttl5q9s0x8.gif", 124],
            "7": ["https://img.gamemale.com/album/202312/21/181405d5n4ftmgk6n44nfj.gif", 124],
            "8": ["https://img.gamemale.com/album/202312/21/181406q5dnipcw0i1o1eoc.gif", 124],
            "9": ["https://img.gamemale.com/album/202312/21/181408jhiyiib955rfi9pi.gif", 124],
            "10": ["https://img.gamemale.com/album/202312/21/181409qpxmkiikzhlwcc3r.gif", 124],
            "Max": ["https://img.gamemale.com/album/202312/21/181411o8bz954c94sc4t4c.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0482",
        "url_tid": "126119",
        "name": "黑暗水晶",
        "date": "2023-12-25",
        "buy_limit": "堕落≥36",
        "price": "300金币",
        "levels": "【等级1】6% 回帖堕落+1、发帖堕落+1▕▏升级条件：消耗200金币\n【等级2】6% 回帖堕落+1 金币+1、发帖堕落+1 金币+1▕▏升级条件：消耗200血液\n【等级3】12% 回帖堕落+1 金币+1、发帖堕落+1 金币+1▕▏升级条件：消耗66咒术\n【等级4】12% 回帖堕落+2 金币+1、发帖堕落+2 金币+1▕▏升级条件：灵魂≥1\n【 Max 】18% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/20/205455h8zu284mu2iuaqqz.gif", 40],
            "2": ["https://img.gamemale.com/album/202312/20/205456oxxxev1x1xxixdmx.gif", 40],
            "3": ["https://img.gamemale.com/album/202312/20/205456u3hy27326mk7fdly.gif", 40],
            "4": ["https://img.gamemale.com/album/202312/20/205456jof1ff01ri2z21oa.gif", 40],
            "Max": ["https://img.gamemale.com/album/202312/20/205457zjeejmy9fef8v218.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0481",
        "url_tid": "126116",
        "name": "棱镜",
        "date": "2023-12-25",
        "buy_limit": "咒术≥20",
        "price": "666金币",
        "levels": "【等级1】10% 回帖金币+2▕▏升级条件：堕落≥100\n【 Max 】12% 回帖堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/20/210413o2e71vgo7c3jepd3.gif", 40],
            "Max": ["https://img.gamemale.com/album/202312/20/210414y2hdq7w23luqhqyq.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0480",
        "url_tid": "126115",
        "name": "天使之赐",
        "date": "2023-12-25",
        "buy_limit": "堕落≥30",
        "price": "288金币",
        "levels": "【等级1】4% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗48咒术\n【等级2】10% 回帖金币+2▕▏升级条件：消耗300金币\n【 Max 】8% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/20/210427ajoj93i34oz73bo3.gif", 40],
            "2": ["https://img.gamemale.com/album/202312/20/210428rffohoy571nx575g.gif", 40],
            "Max": ["https://img.gamemale.com/album/202312/20/210429ve46wv42p4wezljp.gif", 82]
        }
    },
    {
        "type": "咒术",
        "no": "0479",
        "url_tid": "126113",
        "name": "杀意人偶",
        "date": "2023-12-25",
        "buy_limit": "在线时间≥72",
        "price": "8咒术",
        "duration": "7天",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：消耗2咒术\n【等级2】10% 回帖血液+2▕▏升级条件：旅程≥59\n【等级3】11% 回帖血液+3▕▏升级条件：旅程≥219\n【 Max 】8% 回帖堕落+1 金币-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/20/210418m3ba2etec3tmh3nv.gif", 40],
            "2": ["https://img.gamemale.com/album/202312/20/210420zbct69htehxe63v1.gif", 40],
            "3": ["https://img.gamemale.com/album/202312/20/210422drmbh856mnhbmrxn.gif", 40],
            "Max": ["https://img.gamemale.com/album/202312/20/210425ssyt7nl9nhj7j1kz.gif", 82]
        }
    },
    {
        "type": "女从",
        "no": "0478",
        "url_tid": "126111",
        "name": "爱丽丝·盖恩斯巴勒",
        "date": "2023-12-25",
        "buy_limit": "知识≥30",
        "price": "400金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+1▕▏升级条件：消耗30咒术\n【等级2】5% 发帖金币+2▕▏升级条件：消耗400血液\n【等级3】8% 回帖金币+2、发帖金币+2▕▏升级条件：消耗66咒术\n【等级4】14% 回帖血液+3▕▏升级条件：血液≥199\n【等级5】9% 回帖金币+3、发帖金币+3▕▏升级条件：消耗1金币\n【 Max 】9% 回帖金币+3、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/20/205532k2dyuc12f2d2252f.gif", 40],
            "2": ["https://img.gamemale.com/album/202312/20/205602tp1hsble99lwtqew.gif", 82],
            "3": ["https://img.gamemale.com/album/202312/20/205604tn7sqsx5oj5qqtqy.gif", 82],
            "4": ["https://img.gamemale.com/album/202312/20/205605orbblv5s5mlcv5zs.gif", 124],
            "5": ["https://img.gamemale.com/album/202312/20/205607znj9lvnn21sr140n.gif", 124],
            "Max": ["https://img.gamemale.com/album/202312/20/205609o0ewcd5fdazfeao8.gif", 124]
        }
    },
    {
        "type": "女从",
        "no": "0477",
        "url_tid": "126109",
        "name": "凯特尼斯·伊夫狄恩",
        "date": "2023-12-25",
        "buy_limit": "堕落≥10",
        "price": "450金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗150血液\n【等级2】勋章博物馆资料暂缺\n【等级3】28% 回帖血液-1 堕落+1▕▏升级条件：堕落≥444\n【 Max 】18% 回帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/20/205446gjmq0j1i1j71xl1k.gif", 40],
            "2": ["", 82],
            "3": ["https://img.gamemale.com/album/202312/20/205450yycyhece5xnxxxxc.gif", 82],
            "Max": ["https://img.gamemale.com/album/202401/30/120450e41turn8gj6zul7e.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0476",
        "url_tid": "126107",
        "name": "克劳斯·迈克尔森",
        "date": "2023-12-25",
        "buy_limit": "堕落≥5",
        "price": "516金币",
        "levels": "【等级1】10% 回帖堕落+1▕▏升级条件：消耗111血液\n【等级2】5% 回帖血液+1▕▏升级条件：消耗222血液\n【等级3】8% 回帖血液+1▕▏升级条件：消耗333血液\n【等级4】10% 回帖血液+2、发帖金币+1▕▏升级条件：金币≥920\n【等级5】11% 回帖血液+2、发帖金币+2▕▏升级条件：血液≥920\n【等级6】12% 回帖血液+2、发帖金币+3▕▏升级条件：消耗1灵魂\n【 Max 】15% 回帖血液+3、发帖金币+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/20/205846tq2zg1zvv2rt3a3q.gif", 40],
            "2": ["https://img.gamemale.com/album/202312/20/205848o7p1p1xnpepxqx6q.gif", 82],
            "3": ["https://img.gamemale.com/album/202312/21/174418c8xhhh9kllkn4glw.gif", 124],
            "4": ["https://img.gamemale.com/album/202312/20/210050vm8z5megww7coe2r.gif", 124],
            "5": ["https://img.gamemale.com/forum/202405/14/005835r35yx3b6gsg5qrhu.gif", 124],
            "6": ["https://img.gamemale.com/album/202312/21/174304xtwq2vzgbgtqbvbf.gif", 124],
            "Max": ["https://img.gamemale.com/album/202312/20/210410v67n5lzada06w6wa.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0475",
        "url_tid": "126105",
        "name": "虎头怪",
        "date": "2023-12-25",
        "buy_limit": "旅程≥20",
        "price": "500金币",
        "levels": "【等级1】8% 回帖血液+1、发帖旅程+1▕▏升级条件：追随≥50\n【等级2】1% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗600血液\n【等级3】2% 回帖旅程+1、发帖旅程+1▕▏升级条件：知识≥60\n【等级4】3% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗1灵魂\n【等级5】4% 回帖旅程+1、发帖旅程+1▕▏升级条件：在线时间≥2400\n【 Max 】2% 回帖旅程+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202312/20/205610gj9fix52zdacdczz.gif", 40],
            "2": ["https://img.gamemale.com/album/202312/20/205611sru4r33znqz4nwp2.gif", 82],
            "3": ["https://img.gamemale.com/album/202312/25/162350ja7irqbni2lj93bi.gif", 124],
            "4": ["https://img.gamemale.com/album/202312/25/162351gcokj6r8sasosk6j.gif", 124],
            "5": ["https://img.gamemale.com/album/202312/25/162352khzhwtlwpoewjmle.gif", 124],
            "Max": ["https://img.gamemale.com/album/202312/20/205710wmuqu05q9ckvc5i1.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0474",
        "url_tid": "123614",
        "name": "重建熊屋",
        "date": "2023-11-18",
        "buy_limit": "【丰饶山麓】重建村镇大厅的兑换奖品",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202311/15/222714llaea4m1uelmx4nn.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0473",
        "url_tid": "123613",
        "name": "图腾饼干",
        "date": "2023-11-18",
        "buy_limit": "参与【丰饶山麓】救援重建熊人村的谢礼",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+2",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202311/15/222807vvbwcokyttcwcvgk.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0472",
        "url_tid": "121125",
        "name": "龙之秘宝",
        "date": "2023-10-10",
        "buy_limit": "在【秋园庆丰】活动第一阶段的发帖中消耗-10追随",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：消耗1血液\n【等级2】2% 发帖堕落+1、回帖堕落+1▕▏升级条件：消耗1血液\n【等级3】2% 发帖血液+1、回帖血液+1▕▏升级条件：消耗1血液\n【等级4】2% 发帖金币+1、回帖金币+1▕▏升级条件：消耗1血液\n【 Max 】2% 发帖咒术+1、回帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202310/09/105229qxknooolcrg2hx4p.gif", 40],
            "2": ["https://img.gamemale.com/album/202310/09/105229mzu4c0aa24uqnlcl.gif", 40],
            "3": ["https://img.gamemale.com/album/202310/09/105231quppkbdedpf1ekxf.gif", 40],
            "4": ["https://img.gamemale.com/album/202310/09/105233phoiwhdcbcccnmm6.gif", 40],
            "Max": ["https://img.gamemale.com/album/202310/09/105234y1m8pmjmiqmr8ggm.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0471",
        "url_tid": "120401",
        "name": "长花的蛋",
        "date": "2023-10-1",
        "buy_limit": "知识≥10",
        "price": "366金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗72咒术\n【等级2】10% 回帖金币+1▕▏升级条件：咒术≥36\n【 Max 】15% 回帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/171413azzzv9pvbalbz9yp.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/171414b5bg8vmsco9tu4fo.gif", 40],
            "Max": ["https://img.gamemale.com/album/202309/27/171415qzggp9oggimip7ai.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0470",
        "url_tid": "120400",
        "name": "棕色条纹蛋",
        "date": "2023-10-1",
        "buy_limit": "追随≥35",
        "price": "520金币",
        "levels": "【等级1】1% 回帖咒术+1▕▏升级条件：消耗80血液\n【等级2】3% 回帖咒术+1▕▏升级条件：消耗150血液\n【等级3】5% 回帖咒术+1▕▏升级条件：消耗-1旅程\n【等级4】8% 回帖咒术+1▕▏升级条件：消耗150金币\n【等级5】3% 回帖知识+1▕▏升级条件：在线时间≥1999\n【 Max 】1% 回帖知识+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/171353w9sh9i8momll7l8l.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/171353zfpjls57l55aql75.gif", 40],
            "3": ["https://img.gamemale.com/album/202309/27/171354zx9zqdx88bnemnzn.gif", 40],
            "4": ["https://img.gamemale.com/album/202309/28/155631jui5o83g1xojs89j.gif", 40],
            "5": ["https://img.gamemale.com/album/202309/27/171355s6ffysnn30pcfqna.gif", 40],
            "Max": ["https://img.gamemale.com/album/202309/27/171359ur703jj03qqerior.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0469",
        "url_tid": "120398",
        "name": "被尘封之书",
        "date": "2023-10-1",
        "buy_limit": "堕落≥99",
        "price": "999金币",
        "levels": "【等级1】3% 回帖血液+2▕▏升级条件：消耗1000血液\n【等级2】6% 回帖血液+2▕▏升级条件：消耗1000血液\n【等级3】勋章博物馆资料暂缺\n【等级4】12% 回帖血液+2▕▏升级条件：堕落≥200\n【等级5】15% 回帖血液+2▕▏升级条件：堕落≥300\n【等级6】18% 回帖血液+2▕▏升级条件：堕落≥400\n【等级7】21% 回帖血液+2▕▏升级条件：堕落≥500\n【等级8】24% 回帖血液+2▕▏升级条件：堕落≥600\n【等级9】27% 回帖血液+2▕▏升级条件：堕落≥700\n【等级10】30% 回帖血液+2▕▏升级条件：堕落≥800\n【等级11】35% 回帖血液+2▕▏升级条件：消耗1灵魂\n【 Max 】50% 回帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/171452rhhf00whhi6f2724.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/171453m55vcpv4qvdtvdqo.gif", 40],
            "3": ["", 82],
            "4": ["https://img.gamemale.com/album/202309/27/171507wv9dsdvdjsnj87j9.gif", 82],
            "5": ["https://img.gamemale.com/album/202309/27/171515td82z87sx8zsr2qe.gif", 82],
            "6": ["https://img.gamemale.com/album/202309/27/171519iqdzqnzld0d2jjfn.gif", 82],
            "7": ["https://img.gamemale.com/album/202309/27/171535lnfhaaow6nstnooc.gif", 82],
            "8": ["https://img.gamemale.com/album/202309/27/171543antn803f3mgfgsmn.gif", 82],
            "9": ["https://img.gamemale.com/album/202309/27/171551vcgceuqnpwwqwn5e.gif", 82],
            "10": ["https://img.gamemale.com/album/202309/27/171605ljmzt3qqqf3z6c6g.gif", 82],
            "11": ["https://img.gamemale.com/album/202309/27/171658k6wn5qinkw4w541j.gif", 82],
            "Max": ["https://img.gamemale.com/album/202309/27/171659n5pq80jxx608qjdx.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0468",
        "url_tid": "120397",
        "name": "和谐圣杯",
        "date": "2023-10-1",
        "buy_limit": "知识≥15",
        "price": "300金币",
        "levels": "【等级1】5% 回帖堕落-1、发帖堕落-2▕▏升级条件：消耗88咒术\n【等级2】10% 回帖堕落-2、发帖堕落-3▕▏升级条件：消耗400血液\n【 Max 】10% 回帖血液+2 堕落+1、发帖血液+3 堕落+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/171418gnzqnwrh3lsknsbl.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/171421sh3j3yjyjyufhfjb.gif", 40],
            "Max": ["https://img.gamemale.com/album/202309/27/171427px141o11vc31z6ck.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0467",
        "url_tid": "120396",
        "name": "露娜弗蕾亚·诺克斯·芙尔雷",
        "date": "2023-10-1",
        "buy_limit": "知识≥20",
        "price": "500金币",
        "levels": "【等级1】4% 回帖咒术+1、发帖血液+1▕▏升级条件：消耗150金币\n【等级2】6% 回帖血液+1、发帖血液+2▕▏升级条件：消耗200金币\n【等级3】8% 回帖血液+1、发帖血液+2▕▏升级条件：消耗300金币\n【等级4】10% 回帖血液+2、发帖血液+3▕▏升级条件：消耗120咒术\n【 Max 】13% 回帖血液+3、发帖血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/28/155639obu4tuggngzzbtnz.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/28/155640pvv6g46bs37t49h5.gif", 82],
            "3": ["https://img.gamemale.com/album/202309/28/155641wvfv34vmccm3pdvg.gif", 82],
            "4": ["https://img.gamemale.com/album/202309/28/155641pagzkwu23sof86yz.gif", 82],
            "Max": ["https://img.gamemale.com/album/202309/28/155642wmcbk015n17rbnwo.gif", 124]
        }
    },
    {
        "type": "女从",
        "no": "0466",
        "url_tid": "120395",
        "name": "凯尔",
        "date": "2023-10-1",
        "buy_limit": "主题数≥10",
        "price": "300金币",
        "levels": "【等级1】8% 回帖血液+1、发帖旅程+1▕▏升级条件：灵魂≥1\n【等级2】15% 回帖血液+1、发帖旅程+2▕▏升级条件：消耗300金币\n【等级3】15% 回帖血液+2、发帖旅程+1▕▏升级条件：堕落≥10\n【 Max 】12% 回帖血液+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/171120kxsyx8zuqese68u3.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/171123wvveijv3um23if5i.gif", 82],
            "3": ["https://img.gamemale.com/album/202309/27/171151u8kklutm89muxqrr.gif", 124],
            "Max": ["https://img.gamemale.com/album/202309/28/143403rtxrvkl5x71zeklk.gif", 82]
        }
    },
    {
        "type": "女从",
        "no": "0465",
        "url_tid": "120393",
        "name": "莫甘娜",
        "date": "2023-10-1",
        "buy_limit": "主题数≥10",
        "price": "300金币",
        "levels": "【等级1】8% 回帖金币+1、发帖旅程+1▕▏升级条件：灵魂≥1\n【等级2】10% 回帖金币+1、发帖旅程+1▕▏升级条件：消耗300血液\n【等级3】15% 回帖金币+2、发帖旅程+1▕▏升级条件：堕落≥10\n【 Max 】12% 回帖金币+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/171051pgnanjgkfnnkjype.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/171052uk4szyx4f982okux.gif", 82],
            "3": ["https://img.gamemale.com/album/202309/27/171054keztg7755pzezgve.gif", 124],
            "Max": ["https://img.gamemale.com/album/202309/28/143356q1dvdavay7g2m275.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0464",
        "url_tid": "120391",
        "name": "阿尔瓦罗·索莱尔",
        "date": "2023-10-1",
        "buy_limit": "追随≥10",
        "price": "500金币",
        "levels": "【等级1】6% 回帖金币+1▕▏升级条件：消耗50金币\n【等级2】6% 回帖金币+2▕▏升级条件：追随≥50\n【等级3】6% 回帖金币+3▕▏升级条件：追随≥150\n【等级4】8% 回帖金币+3▕▏升级条件：消耗150金币\n【 Max 】12% 回帖金币+2、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/171257xrz2r72ab558wbb2.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/171259gy0guguk0bybb50n.gif", 40],
            "3": ["https://img.gamemale.com/album/202309/27/171303ms4yv6ovjfffc6bf.gif", 82],
            "4": ["https://img.gamemale.com/album/202309/27/171307rrlt2lykktpn2r5p.gif", 82],
            "Max": ["https://img.gamemale.com/album/202309/27/171315bv98lhv0oh0k9xmh.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0463",
        "url_tid": "120390",
        "name": "纣王·子受",
        "date": "2023-10-1",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+2▕▏升级条件：消耗400金币\n【等级2】10% 回帖金币+1、发帖金币+2▕▏升级条件：消耗400血液\n【等级3】10% 回帖金币+1 堕落+1、发帖金币+3▕▏升级条件：消耗100咒术\n【等级4】15% 回帖金币+1 堕落-1、发帖旅程+1▕▏升级条件：消耗1灵魂\n【等级5】20% 回帖金币+2、发帖旅程+1▕▏升级条件：堕落≥100\n【 Max 】3% 回帖旅程+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/171212jq39t0jq22j9t7tx.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/171215dkaj7re0ohwneoho.gif", 82],
            "3": ["https://img.gamemale.com/album/202309/27/171218mjh122k3yiqqqaxr.gif", 82],
            "4": ["https://img.gamemale.com/album/202309/27/171223pbyyjbybiv5bbhbv.gif", 124],
            "5": ["https://img.gamemale.com/album/202309/27/171245uzbsx1trn666ssxq.gif", 124],
            "Max": ["https://img.gamemale.com/album/202309/27/171251me1q5s0ca5ul2sjn.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0462",
        "url_tid": "120388",
        "name": "阿齐斯",
        "date": "2023-10-1",
        "buy_limit": "堕落≥60",
        "price": "480金币",
        "levels": "【等级1】8% 回帖血液+1、发帖血液+2▕▏升级条件：消耗300金币\n【等级2】10% 回帖血液+2 金币-1、发帖堕落+1▕▏升级条件：消耗600金币\n【等级3】12% 回帖血液+3 金币-1▕▏升级条件：消耗900金币\n【 Max 】18% 回帖血液+3、发帖堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/171154boz3e3oab2s65oos.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/171155wnjvybtjh5ozthxi.gif", 40],
            "3": ["https://img.gamemale.com/album/202309/27/171157mmjj5afy5jgtamff.gif", 82],
            "Max": ["https://img.gamemale.com/album/202309/27/171203ojdxjmftqxxw4fhx.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0461",
        "url_tid": "120387",
        "name": "百相千面",
        "date": "2023-10-1",
        "buy_limit": "发帖数≥100",
        "price": "1000金币",
        "levels": "【等级1】5% 回帖金币+1 血液+1、发帖旅程+1▕▏升级条件：消耗100金币\n【等级2】5% 回帖金币+1 血液+1、发帖旅程+1▕▏升级条件：消耗1000血液\n【等级3】5% 回帖金币+2 血液+2、发帖金币+3 血液+3▕▏升级条件：消耗1000金币\n【 Max 】5% 回帖旅程+1、发帖金币+3 血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202309/27/174058owss14ie1x44ak1y.gif", 40],
            "2": ["https://img.gamemale.com/album/202309/27/174121xns2rqbbl0yzql1n.gif", 82],
            "3": ["https://img.gamemale.com/album/202309/27/174149vax9ea01z0aj82a2.gif", 124],
            "Max": ["https://img.gamemale.com/album/202309/27/174241t4pk4gb9pk4jggpb.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0460",
        "url_tid": "119473",
        "name": "肉垫手套",
        "date": "2023-9-13",
        "buy_limit": "参与【河谷寻奇】活动，用70枚游戏金币兑换",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202309/11/210916x6w9s9dm86s8slpc.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0459",
        "url_tid": "119472",
        "name": "绿茵宝钻",
        "date": "2023-9-13",
        "buy_limit": "参与【河谷寻奇】活动，获得的游戏金币数量排名前10%",
        "price": "无",
        "levels": "【 Max 】1% 回帖金币+6、发帖金币+6",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202309/11/210916w34eci74h7jikzdi.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0458",
        "url_tid": "118478",
        "name": "猛虎贴贴",
        "date": "2023-8-27",
        "buy_limit": "参与【巧夕之月】，发布的帖子在各板块中追随数排名前五，或者在活动贴留言抽奖中奖",
        "price": "无",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：消耗1血液\n【等级2】3% 回帖血液+1▕▏升级条件：消耗1血液\n【 Max 】5% 回帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202308/27/160606llqdux7jqoxm7itj.gif", 40],
            "2": ["https://img.gamemale.com/album/202308/23/225040zkkhhk51abk4kmaz.gif", 82],
            "Max": ["https://img.gamemale.com/album/202308/23/225041pqeqqzzfbpfpbgfh.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0457",
        "url_tid": "118475",
        "name": "白巧克力蛋",
        "date": "2023-8-27",
        "buy_limit": "参与【巧夕之月】，发布符合活动主题条件的帖子LV1",
        "price": "无",
        "levels": "【等级1】1% 回帖金币+1▕▏升级条件：消耗1金币\n【 Max 】3% 回帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202308/27/160217p7tp706nvn7eyeni.gif", 40],
            "Max": ["https://img.gamemale.com/album/202308/23/225006lfeiz94efe94fe4y.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0456",
        "url_tid": "118380",
        "name": "灵藤蛋",
        "date": "2023-8-26",
        "buy_limit": "知识≥5",
        "price": "350金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：知识≥30\n【 Max 】3% 回帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202402/09/010216v9r22kq9qqeeoqvk.gif", 40],
            "Max": ["https://img.gamemale.com/album/202402/09/010216h0rfrngv7fdzazzn.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0455",
        "url_tid": "118378",
        "name": "令人不安的契约书",
        "date": "2023-8-26",
        "buy_limit": "咒术≥5",
        "price": "200金币",
        "levels": "【等级1】1% 回帖咒术+1▕▏升级条件：消耗15咒术\n【等级2】2% 回帖咒术+1▕▏升级条件：消耗-20金币\n【 Max 】3% 回帖咒术+1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202308/23/225031ghmrdmrhborbi4ir.gif", 40],
            "2": ["https://img.gamemale.com/album/202308/23/225031amakkrn6u88vxo6b.gif", 40],
            "Max": ["https://img.gamemale.com/album/202409/16/142957ygjff54olmpp8u57.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0454",
        "url_tid": "118376",
        "name": "星籁歌姬",
        "date": "2023-8-26",
        "buy_limit": "追随≥10",
        "price": "500金币",
        "levels": "【等级1】3% 回帖血液+1▕▏升级条件：消耗30咒术\n【等级2】6% 回帖血液+1、发帖血液+1▕▏升级条件：消耗270金币\n【等级3】9% 回帖血液+1、发帖血液+2▕▏升级条件：追随≥100\n【等级4】12% 回帖血液+2、发帖血液+3▕▏升级条件：追随≥200\n【 Max 】15% 回帖血液+2、发帖知识+1 血液-3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202308/23/225950v1tnkkz4ucfzku4k.gif", 40],
            "2": ["https://img.gamemale.com/album/202308/23/225125atclopop44watwbc.gif", 82],
            "3": ["https://img.gamemale.com/album/202308/23/225125tox7qydlqlrvlxur.gif", 82],
            "4": ["https://img.gamemale.com/album/202308/23/225126r1r4ujsuq6y7m44q.gif", 82],
            "Max": ["https://img.gamemale.com/album/202308/23/225129ur03szcrwzxopjj0.gif", 124]
        }
    },
    {
        "type": "女从",
        "no": "0453",
        "url_tid": "118375",
        "name": "维涅斯",
        "date": "2023-8-26",
        "buy_limit": "旅程≥14",
        "price": "700金币",
        "levels": "【等级1】4% 回帖咒术+1、发帖知识+1▕▏升级条件：主题数≥14\n【等级2】6% 回帖咒术+1、发帖知识+1▕▏升级条件：消耗140金币\n【等级3】8% 回帖咒术+1、发帖知识+1▕▏升级条件：知识≥140\n【等级4】3% 回帖旅程+1、发帖知识+1▕▏升级条件：消耗1144血液\n【 Max 】2% 回帖知识+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202308/23/225107iznk8qhhv45nhh4e.gif", 40],
            "2": ["https://img.gamemale.com/album/202308/23/225108rk2ux2nsmuakx2xs.gif", 82],
            "3": ["https://img.gamemale.com/album/202308/23/225954hv50rn58v7js58j0.gif", 82],
            "4": ["https://img.gamemale.com/album/202308/23/225111zdl8b4aa2fif46bl.gif", 82],
            "Max": ["https://img.gamemale.com/album/202308/23/225112c7t3reez7t3rg0kt.gif", 82]
        }
    },
    {
        "type": "女从",
        "no": "0452",
        "url_tid": "118374",
        "name": "刀锋女王",
        "date": "2023-8-26",
        "buy_limit": "咒术≥50",
        "price": "600金币",
        "levels": "【等级1】3% 回帖咒术+1、发帖咒术+1▕▏升级条件：咒术≥120\n【等级2】6% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗60咒术\n【等级3】9% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗200金币\n【等级4】12% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗200血液\n【等级5】15% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗350血液\n【 Max 】15% 回帖血液+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202308/23/225014s5i6ikgiz4gkkmk0.gif", 40],
            "2": ["https://img.gamemale.com/album/202308/23/225016zqhuvbaeuv75umvv.gif", 82],
            "3": ["https://img.gamemale.com/album/202308/23/225017z0z651k4k1xu06lx.gif", 82],
            "4": ["https://img.gamemale.com/album/202308/23/225019t53i3bxxihchhb3u.gif", 124],
            "5": ["https://img.gamemale.com/album/202308/23/225021egttqdzd01d1s1v3.gif", 124],
            "Max": ["https://img.gamemale.com/album/202308/23/225022ffm0k7tuvuttd7mo.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0451",
        "url_tid": "118372",
        "name": "天照大神",
        "date": "2023-8-26",
        "buy_limit": "追随≥13",
        "price": "500金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗130血液\n【等级2】7% 回帖金币+1、发帖知识+1▕▏升级条件：血液≥1300\n【等级3】9% 回帖金币+1、发帖知识+1▕▏升级条件：消耗130血液\n【等级4】12% 回帖金币+2、发帖知识+1▕▏升级条件：消耗1300血液\n【 Max 】12% 回帖咒术+1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202308/23/225100kcrbpeodpfq3rayr.gif", 40],
            "2": ["https://img.gamemale.com/album/202308/23/225101k0r0s0tls00ursss.gif", 82],
            "3": ["https://img.gamemale.com/album/202308/23/225103tmedmppbtezutr7w.gif", 124],
            "4": ["https://img.gamemale.com/album/202308/23/225959pgdxha00nuzifean.gif", 124],
            "Max": ["https://img.gamemale.com/album/202308/23/230001or552oyq57wz4o2o.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0450",
        "url_tid": "118371",
        "name": "桑克瑞德·沃特斯",
        "date": "2023-8-26",
        "buy_limit": "旅程≥21",
        "price": "520金币",
        "levels": "【等级1】1% 回帖血液+7▕▏升级条件：消耗52血液\n【等级2】1% 回帖血液+8▕▏升级条件：堕落≥52\n【等级3】2% 回帖血液+8▕▏升级条件：消耗52咒术\n【等级4】2% 回帖血液+9▕▏升级条件：咒术≥180\n【 Max 】3% 回帖血液+9",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202308/23/225046fztqwr4yrtqpsysp.gif", 40],
            "2": ["https://img.gamemale.com/album/202308/23/225047zulkkwdxewwcek0f.gif", 82],
            "3": ["https://img.gamemale.com/album/202308/23/225048c8fkfr0lwh2nl88r.gif", 82],
            "4": ["https://img.gamemale.com/album/202308/23/225050dguvtddpdxp8ldqu.gif", 82],
            "Max": ["https://img.gamemale.com/album/202308/23/225051e3hcl8ecycwl3u8h.gif", 82]
        }
    },
    {
        "type": "剧情",
        "no": "0449",
        "url_tid": "118047",
        "name": "『星河碎片』",
        "date": "2023-8-21",
        "buy_limit": "灵魂≥1，主题数≥1，知识≥7，旅程≥7",
        "price": "1知识",
        "levels": "【等级1】无属性▕▏升级条件：消耗-1知识\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202308/21/112642ks1p19sz2f73y3p3.gif", 40],
            "Max": ["https://img.gamemale.com/album/202308/21/112642ks1p19sz2f73y3p3.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0448",
        "url_tid": "117680",
        "name": "探险三杰士",
        "date": "2023-8-13",
        "buy_limit": "扮演战士、游侠、法师三大职业，参与【迷翳森林】探险活动",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+2",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202308/08/202657ul09w0lz8dwdll0e.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0447",
        "url_tid": "117679",
        "name": "『迷翳森林回忆录』",
        "date": "2023-8-13",
        "buy_limit": "在『迷翳森林』探险活动中，收集15枚迷翳结晶兑换获得",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+2、发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202308/08/230549joklkzk9ub3ofigg.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0446",
        "url_tid": "117000",
        "name": "『迷翳之中』",
        "date": "2023-8-1",
        "buy_limit": "灵魂≥1，旅程≥10，主题数≥1",
        "price": "10旅程",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗-2旅程\n【等级1】无属性▕▏升级条件：消耗-3旅程\n【等级2】无属性▕▏升级条件：消耗-5旅程\n【等级3】无属性▕▏升级条件：旅程≥50\n【等级4】无属性▕▏升级条件：消耗1知识\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202307/29/174031micetmtirimibi1d.gif", 40],
            "2": ["https://img.gamemale.com/album/202307/29/174035px6mn7xssl5gm5mx.gif", 40],
            "3": ["https://img.gamemale.com/album/202308/08/155653p419ac9jj91y1z9c.gif", 40],
            "4": ["https://img.gamemale.com/album/202308/13/064645eiw9g11gwkgoiz6m.gif", 40],
            "初级": ["https://img.gamemale.com/album/202301/28/151124vrgn60rdx93kkr30.gif", 40],
            "Max": ["https://img.gamemale.com/album/202308/08/155705bx4h1r3t4577175v.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0445",
        "url_tid": "116029",
        "name": "『灰域来音』",
        "date": "2023-7-16",
        "buy_limit": "灵魂≥1",
        "price": "10旅程",
        "levels": "【等级1】无属性▕▏升级条件：消耗-10旅程\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202307/14/225151e4hbl6r2el6hl6bh.gif", 40],
            "Max": ["https://img.gamemale.com/album/202307/14/225151e4hbl6r2el6hl6bh.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0444",
        "url_tid": "115919",
        "name": "小小舞台",
        "date": "2023-7-14",
        "buy_limit": "【欢歌满村】欢唱活动期间在音乐区发布翻唱歌曲",
        "price": "无",
        "levels": "【 Max 】5% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202306/05/201117wpszpkpb0ug90f9s.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0443",
        "url_tid": "113518",
        "name": "风物长宜",
        "date": "2023-6-16",
        "buy_limit": "【十周年庆】活动奖励",
        "price": "无",
        "levels": "【 Max 】10% 发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202506/03/234758ruu442wuaju41juf.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0442",
        "url_tid": "112666",
        "name": "狱炎蛋",
        "date": "2023-6-9",
        "buy_limit": "堕落≥66",
        "price": "266血液",
        "levels": "【等级1】4% 回帖血液+1 堕落+1、发帖血液+1 堕落+1▕▏升级条件：堕落≥100\n【 Max 】7% 回帖血液+1 堕落+1、发帖血液+1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202409/16/143228usv5ci9i5lj4csn4.gif", 40],
            "Max": ["https://img.gamemale.com/album/202409/16/143007gaei9vnnp5ae9gga.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0441",
        "url_tid": "112663",
        "name": "散佚的文集",
        "date": "2023-6-9",
        "buy_limit": "知识≥10",
        "price": "250金币",
        "levels": "【等级1】2% 回帖知识+1、发帖知识+1▕▏升级条件：知识≥25\n【等级2】5% 回帖血液+2 堕落-1、发帖血液+2 堕落-1▕▏升级条件：消耗200血液\n【等级3】6% 回帖血液+3 堕落-1、发帖血液+3 堕落-1▕▏升级条件：消耗300血液\n【 Max 】7% 回帖咒术+1 堕落-1、发帖咒术+1 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202306/05/200907iiuk6kq7ii6m1kou.gif", 40],
            "2": ["https://img.gamemale.com/album/202306/05/200907kjky2bwxdbhylgch.gif", 82],
            "3": ["https://img.gamemale.com/album/202306/05/200908l8utbdzqc8okuz7m.gif", 82],
            "Max": ["https://img.gamemale.com/album/202306/05/200908vdekoukd1xuifkxx.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0440",
        "url_tid": "112646",
        "name": "女神之泪",
        "date": "2023-6-9",
        "buy_limit": "咒术≥36",
        "price": "500金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+3▕▏升级条件：消耗360血液\n【等级2】10% 回帖血液+2、发帖血液+3▕▏升级条件：咒术≥360\n【 Max 】10% 回帖血液+3、发帖血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202306/05/200900c758hbr54p55g5gb.gif", 40],
            "2": ["https://img.gamemale.com/album/202306/17/212524pb9auww3t6yz59w9.gif", 40],
            "Max": ["https://img.gamemale.com/album/202306/17/212525ollay9nl7b02bq7n.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0439",
        "url_tid": "112645",
        "name": "希尔瓦娜斯·风行者",
        "date": "2023-6-9",
        "buy_limit": "知识≥30",
        "price": "500金币",
        "levels": "【等级1】3% 回帖血液+2、发帖金币+3▕▏升级条件：追随≥50\n【等级2】6% 回帖血液+2、发帖金币+3▕▏升级条件：在线时间≥666\n【等级3】9% 回帖血液+2、发帖金币+3▕▏升级条件：消耗500金币\n【等级4】12% 回帖血液+2、发帖金币+3▕▏升级条件：消耗666血液\n【 Max 】15% 回帖血液+3、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202303/02/072938r8mamoh4agyyjxn1.gif", 40],
            "2": ["https://img.gamemale.com/album/202306/05/200932rhhp1726fgae74lf.gif", 124],
            "3": ["https://img.gamemale.com/album/202306/05/200935ryni4xtaz433zxtx.gif", 124],
            "4": ["https://img.gamemale.com/album/202306/05/200937zqhh7hqt71n05z72.gif", 124],
            "Max": ["https://img.gamemale.com/album/202306/05/200940fz4141p0b33abbm0.gif", 124]
        }
    },
    {
        "type": "女从",
        "no": "0438",
        "url_tid": "112642",
        "name": "丹妮莉丝·坦格利安",
        "date": "2023-6-9",
        "buy_limit": "旅程≥30",
        "price": "400金币",
        "levels": "【等级1】6% 回帖金币+1、发帖血液+1▕▏升级条件：消耗150血液\n【等级2】8% 回帖金币+1、发帖血液+1▕▏升级条件：消耗300血液\n【等级3】10% 回帖金币+2、发帖血液+2▕▏升级条件：消耗400血液\n【 Max 】12% 回帖金币+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202306/05/200836mysbnlb3s3soul0s.gif", 40],
            "2": ["https://img.gamemale.com/album/202306/05/200838rnk3k6t5b662kj3m.gif", 82],
            "3": ["https://img.gamemale.com/album/202306/05/200841ds1jsxzxjs4ernpj.gif", 82],
            "Max": ["https://img.gamemale.com/album/202306/05/200845r40hhaw3yya43fad.gif", 124]
        }
    },
    {
        "type": "女从",
        "no": "0437",
        "url_tid": "112640",
        "name": "九尾妖狐·阿狸",
        "date": "2023-6-9",
        "buy_limit": "血液≥350",
        "price": "350金币",
        "levels": "【等级1】4% 回帖血液+1、发帖咒术+1▕▏升级条件：旅程≥89\n【等级2】8% 回帖血液+2、发帖咒术+1▕▏升级条件：消耗89咒术\n【 Max 】13% 回帖血液+2、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202306/05/200857sjjbu55f6ydsujfc.gif", 40],
            "2": ["https://img.gamemale.com/album/202306/05/200857n1y3fksqeeqza3yy.gif", 82],
            "Max": ["https://img.gamemale.com/album/202306/15/220517dc8nkquysppqum8h.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0436",
        "url_tid": "112639",
        "name": "死亡",
        "date": "2023-6-9",
        "buy_limit": "追随≥10",
        "price": "444金币",
        "levels": "【等级1】13% 回帖金币-1▕▏升级条件：消耗130血液\n【等级2】13% 回帖血液+1 金币-1▕▏升级条件：知识≥80\n【等级3】13% 回帖血液+1 金币+1、发帖旅程+1▕▏升级条件：消耗1300血液\n【等级4】2% 回帖旅程+1、发帖灵魂+1▕▏升级条件：灵魂≥2\n【 Max 】15% 回帖金币+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202306/05/200916hr7qsou1rgvqovvr.gif", 40],
            "2": ["https://img.gamemale.com/album/202306/05/200917ev4nkccjzp5jp5qv.gif", 82],
            "3": ["https://img.gamemale.com/album/202306/05/200919fs9rwenni65o959a.gif", 124],
            "4": ["https://img.gamemale.com/album/202306/05/200920x6xq1ei40upu16pb.gif", 124],
            "Max": ["https://img.gamemale.com/album/202306/05/200921bakmikksmz8v3ko6.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0435",
        "url_tid": "112555",
        "name": "弗图博士",
        "date": "2023-6-9",
        "buy_limit": "无",
        "price": "1024金币",
        "levels": "【等级1】10% 回帖金币+1 血液+1▕▏升级条件：旅程≥40\n【等级2】10% 回帖金币+1 血液+1、发帖知识+1▕▏升级条件：堕落≥40\n【等级3】10% 回帖金币+2 血液+1、发帖知识+1▕▏升级条件：咒术≥40\n【 Max 】2% 回帖知识+1 血液+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202306/05/200849ilvrrv8yrlvr8nqh.gif", 40],
            "2": ["https://img.gamemale.com/album/202306/05/200851vvwk8p5m885majm6.gif", 82],
            "3": ["https://img.gamemale.com/album/202306/05/200853c1vymmm2jx7j7iox.gif", 82],
            "Max": ["https://img.gamemale.com/album/202306/05/200855jyf25vvy62rvyv5c.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0434",
        "url_tid": "112547",
        "name": "不屈之枪·阿特瑞斯",
        "date": "2023-6-9",
        "buy_limit": "堕落≤450",
        "price": "450金币",
        "levels": "【等级1】3% 回帖旅程+1▕▏升级条件：旅程≥88\n【等级2】1% 发帖灵魂+1▕▏升级条件：灵魂≥1\n【 Max 】8% 回帖血液+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202306/15/221212d7lakywkxowo0jaz.gif", 40],
            "2": ["https://img.gamemale.com/album/202306/05/200827lwmwvfw3nvzbibdx.gif", 82],
            "Max": ["https://img.gamemale.com/album/202306/15/221221ji2tt4u7h4tpp27t.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0433",
        "url_tid": "112540",
        "name": "【周年限定】克里斯(8)",
        "date": "2023-6-9",
        "buy_limit": "主题数≥5",
        "price": "600金币",
        "levels": "【等级1】10% 回帖金币+1▕▏升级条件：消耗200金币\n【等级2】20% 回帖金币+1▕▏升级条件：消耗200血液\n【等级3】30% 回帖金币+1▕▏升级条件：消耗1灵魂\n【 Max 】66% 回帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202304/30/170318hive1hsql2dzxjtc.gif", 40],
            "2": ["https://img.gamemale.com/album/202304/30/170319olg9tb846okddv18.gif", 82],
            "3": ["https://img.gamemale.com/album/202304/30/170320tkzj1jkkweashgj8.gif", 124],
            "Max": ["https://img.gamemale.com/album/202306/15/220534osku6fxfv95cxvak.gif", 124]
        }
    },
    {
        "type": "剧情",
        "no": "0432",
        "url_tid": "112510",
        "name": "『伊黎丝的祝福』",
        "date": "2023-6-8",
        "buy_limit": "灵魂≥1（限时获取）",
        "price": "1咒术",
        "duration": "30天（可续期）",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗-1咒术\n【 Max 】无属性",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202301/28/151124vrgn60rdx93kkr30.gif", 40],
            "Max": ["https://img.gamemale.com/album/202306/08/011901dp5lhljtdtkkjhoh.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0431",
        "url_tid": "112426",
        "name": "『 弗霖的琴』",
        "date": "2023-6-5",
        "buy_limit": "【旷世奇珍】地下拍卖会，猜中第七场成交价",
        "price": "1旅程",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202306/03/100026pr0bbg9g9g9dpnd8.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0430",
        "url_tid": "111775",
        "name": "『瓶中信』",
        "date": "2023-5-17",
        "buy_limit": "发帖数≥1，主题数≥1（限时获取）",
        "price": "1金币",
        "duration": "21天",
        "levels": "【等级1】无属性▕▏升级条件：消耗1旅程\n【等级2】无属性▕▏升级条件：消消耗-1旅程\n【等级3】无属性▕▏升级条件：消耗-20金币\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202305/15/213548uz03kdqqyd6iyrqh.gif", 40],
            "2": ["https://img.gamemale.com/album/202305/20/112800hmp2pj8msp6wz2rj.gif", 40],
            "3": ["https://img.gamemale.com/album/202305/20/185602szvpqoukkt131qm1.gif", 40],
            "Max": ["https://img.gamemale.com/album/202305/15/213548uz03kdqqyd6iyrqh.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0429",
        "url_tid": "111680",
        "name": "传送镜",
        "date": "2023-5-14",
        "buy_limit": "【时岁旅程】活动中完成三个地区之一的发帖任务",
        "price": "无",
        "levels": "【等级1】2% 回帖血液-1▕▏升级条件：消耗-1血液\n【 Max 】2% 回帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202305/13/233327twuu6wwuaufw3y6b.gif", 40],
            "Max": ["https://img.gamemale.com/album/202305/13/233327rdqdzde0elen4sst.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0428",
        "url_tid": "111295",
        "name": "双项圣杯",
        "date": "2023-5-3",
        "buy_limit": "咒术≥20",
        "price": "100金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗1金币\n【等级2】1% 回帖血液+1、发帖血液+1▕▏升级条件：消耗1金币\n【等级3】1% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗10金币\n【等级4】2% 回帖血液+2、发帖血液+2▕▏升级条件：消耗10金币\n【等级5】2% 回帖咒术+2、发帖咒术+2▕▏升级条件：金币≥1000\n【等级6】8% 回帖血液+1、发帖血液+1▕▏升级条件：消耗1000金币\n【 Max 】8% 回帖血液+2 咒术+2、发帖血液+2 咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202304/30/170353mqqq6lsjdu18n1d9.gif", 40],
            "2": ["https://img.gamemale.com/album/202304/30/170353ebrnkg36n9zpkrdk.gif", 40],
            "3": ["https://img.gamemale.com/album/202304/30/170354qkcc9294kpt92l92.gif", 40],
            "4": ["https://img.gamemale.com/album/202304/30/170354p6gyo9gkr3oykkrk.gif", 40],
            "5": ["https://img.gamemale.com/album/202304/30/170355ksdz7hxku987k8jd.gif", 40],
            "6": ["https://img.gamemale.com/album/202304/30/170355sxlyjzsxclvecxs3.gif", 40],
            "Max": ["https://img.gamemale.com/album/202304/30/170356yatphtptwnhquahq.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0427",
        "url_tid": "111294",
        "name": "破旧打火机",
        "date": "2023-5-3",
        "buy_limit": "无",
        "price": "25金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗1金币\n【等级2】无属性▕▏升级条件：消耗1血液\n【等级3】无属性▕▏升级条件：消耗1咒术\n【等级4】无属性▕▏升级条件：消耗1知识\n【等级5】无属性▕▏升级条件：消耗1旅程\n【等级6】5% 回帖金币+1▕▏升级条件：灵魂≥1\n【 Max 】15% 回帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202304/30/170357h572s7bc9jbd3zon.gif", 40],
            "2": ["https://img.gamemale.com/album/202304/30/170358vgc9sp6cfiz6zy9z.gif", 40],
            "3": ["https://img.gamemale.com/album/202304/30/170359di11bbbisws1i13z.gif", 40],
            "4": ["https://img.gamemale.com/album/202304/30/170359sd1y39rqay3h26y0.gif", 40],
            "5": ["https://img.gamemale.com/album/202304/30/170400r9ssrslg9g2skw12.gif", 40],
            "6": ["https://img.gamemale.com/album/202304/30/170400jz8i1fxnhd71uhmn.gif", 40],
            "Max": ["https://img.gamemale.com/album/202304/30/170401kxxgajfqnkk8q7kn.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0426",
        "url_tid": "111293",
        "name": "山村贞子",
        "date": "2023-5-3",
        "buy_limit": "咒术≥44",
        "price": "300金币",
        "levels": "【等级1】10% 回帖血液+1、发帖咒术+1▕▏升级条件：消耗250血液\n【等级2】15% 回帖血液+1、发帖咒术+1▕▏升级条件：消耗500血液\n【 Max 】15% 回帖血液+2、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202304/30/170345t51dvc4zdw7xwddn.gif", 40],
            "2": ["https://img.gamemale.com/album/202304/30/170346mmw4d774dhzh4h7w.gif", 82],
            "Max": ["https://img.gamemale.com/album/202304/30/170347lq9z9pv3vtehvwpp.gif", 82]
        }
    },
    {
        "type": "女从",
        "no": "0425",
        "url_tid": "111292",
        "name": "蒂法·洛克哈特",
        "date": "2023-5-3",
        "buy_limit": "堕落≥30",
        "price": "400金币",
        "levels": "【等级1】1% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗100血液\n【等级2】2% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗200血液\n【等级3】3% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗300血液\n【 Max 】4% 回帖旅程+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202304/30/170305w66a6geyihgl1m31.gif", 40],
            "2": ["https://img.gamemale.com/album/202304/30/170306rgcc8bgl9osofssf.gif", 82],
            "3": ["https://img.gamemale.com/album/202304/30/170307fyxez3s6l97vze03.gif", 82],
            "Max": ["https://img.gamemale.com/album/202304/30/170309nm779bzmnd937dz9.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0424",
        "url_tid": "111283",
        "name": "丹·雷诺斯",
        "date": "2023-5-3",
        "buy_limit": "主题数≥5",
        "price": "400金币",
        "levels": "【等级1】4% 回帖堕落-1▕▏升级条件：消耗100金币\n【等级2】6% 回帖堕落-1▕▏升级条件：消耗200金币\n【等级3】8% 回帖堕落-1▕▏升级条件：消耗40咒术\n【等级4】11% 回帖堕落-1 血液+2▕▏升级条件：消耗80咒术\n【等级5】13% 回帖堕落-1 血液+2、发帖血液+2▕▏升级条件：追随≥250\n【等级6】15% 回帖堕落-1 血液+2、发帖堕落-1 血液+2▕▏升级条件：消耗1金币\n【 Max 】15% 回帖堕落-1 血液+2、发帖堕落-1 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202304/30/170250g8n1829k07r36vqw.gif", 40],
            "2": ["https://img.gamemale.com/album/202304/30/170252ia3aji55jlwwiiww.gif", 82],
            "3": ["https://img.gamemale.com/album/202304/30/170253innxg3ocvxlx99n7.gif", 82],
            "4": ["https://img.gamemale.com/album/202304/30/170255kd7y4i7mnccfidh4.gif", 124],
            "5": ["https://img.gamemale.com/album/202304/30/170257glxiao449tiqzahi.gif", 124],
            "6": ["https://img.gamemale.com/album/202304/30/170258b960vvn0kkrgcjbm.gif", 124],
            "Max": ["https://img.gamemale.com/album/202304/30/170259sx8ocrcnzwocsygk.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0423",
        "url_tid": "111282",
        "name": "勒维恩·戴维斯",
        "date": "2023-5-3",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】10% 无属性▕▏升级条件：消耗1金币\n【等级2】10% 回帖金币+2、发帖金币+2▕▏升级条件：消耗1金币\n【等级3】10% 回帖金币+2、发帖金币+2▕▏升级条件：消耗1金币\n【等级4】10% 回帖金币+2、发帖金币+2▕▏升级条件：消耗1金币\n【等级5】10% 回帖金币+2、发帖金币+2▕▏升级条件：消耗1金币\n【等级6】10% 回帖金币+2、发帖金币+2▕▏升级条件：金币<85\n【等级7】10% 回帖金币+2、发帖金币+2▕▏升级条件：金币≥85\n【等级8】10% 回帖金币+2、发帖金币+2▕▏升级条件：金币≥233\n【 Max 】10% 回帖金币+2、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202304/30/170325qsx06znn672bfzts.gif", 40],
            "2": ["https://img.gamemale.com/album/202304/30/170327h5dihajilfih2f42.gif", 82],
            "3": ["https://img.gamemale.com/album/202304/30/170329zv4f0yqg64yufv4u.gif", 124],
            "4": ["https://img.gamemale.com/album/202304/30/170330oihi8hihn8fxuisl.gif", 124],
            "5": ["https://img.gamemale.com/album/202304/30/170332jj33yo39iqw6pwzr.gif", 124],
            "6": ["https://img.gamemale.com/album/202304/30/170334zid5t5dktrxxxrg7.gif", 124],
            "7": ["https://img.gamemale.com/album/202304/30/170336r5kavq96ekkssze0.gif", 124],
            "8": ["https://img.gamemale.com/album/202304/30/170338ol5knba5o1ajp6jk.gif", 124],
            "Max": ["https://img.gamemale.com/album/202304/30/170339idhwogaflzsstked.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0422",
        "url_tid": "111280",
        "name": "艾利克斯",
        "date": "2023-5-3",
        "buy_limit": "堕落≥50",
        "price": "600金币",
        "levels": "【等级1】4% 回帖血液+1 堕落+1▕▏升级条件：消耗150金币\n【等级2】6% 回帖血液+2 堕落+1▕▏升级条件：堕落≥120\n【等级3】8% 回帖血液+2 堕落+1▕▏升级条件：消耗150金币\n【等级4】10% 回帖血液+2 堕落+1▕▏升级条件：消耗-1旅程\n【等级5】11% 回帖血液+2 堕落+1▕▏升级条件：血液≥666\n【 Max 】12% 回帖血液+3 金币-1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202304/30/170233kyygo7849z4goy73.gif", 82],
            "2": ["https://img.gamemale.com/album/202304/30/170234q338jm2ow9k2v24t.gif", 82],
            "3": ["", 82],
            "4": ["https://img.gamemale.com/album/202305/01/151527c2qaqzqlm4x2l802.gif", 82],
            "5": ["", 82],
            "Max": ["https://img.gamemale.com/album/202304/30/170240l5e5ee2aaqz5zp52.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0421",
        "url_tid": "111099",
        "name": "追击者",
        "date": "2023-4-29",
        "buy_limit": "【惊悚图书馆】活动真·通关奖励",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1、发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202304/27/214522jypvtcr5vv191cp1.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0420",
        "url_tid": "111098",
        "name": "黑夜之星",
        "date": "2023-4-29",
        "buy_limit": "【惊悚图书馆】活动通关奖励",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202304/27/214521fe3jm33uzrzux9yz.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0419",
        "url_tid": "109760",
        "name": "牌中小丑",
        "date": "2023-4-5",
        "buy_limit": "【愚人之旅】活动中完成发帖任务",
        "price": "无",
        "levels": "【 Max 】4% 发帖旅程+1 知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202304/03/142620gc0lansv2boo2nep.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0418",
        "url_tid": "108920",
        "name": "『户口本: Lv7+』",
        "date": "2023-3-25",
        "buy_limit": "等级≥Lv7，灵魂≥1",
        "price": "无",
        "duration": "30天",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗-100金币\n【 Max 】1% 回帖金币+1 血液+1 咒术+1 知识+1 堕落+1、发帖旅程+1 灵魂+1",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202303/06/182234azyaaunb1n1javk7.gif", 82],
            "Max": ["https://img.gamemale.com/album/202303/06/182234azyaaunb1n1javk7.gif", 82]
        }
    },
    {
        "type": "剧情",
        "no": "0417",
        "url_tid": "108918",
        "name": "『居住证: Lv2~6』",
        "date": "2023-3-25",
        "buy_limit": "等级Lv2~Lv6，旅程≥10，发帖数≥2",
        "price": "无",
        "duration": "7天",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗-10金币\n【 Max 】1% 回帖旅程+1、发帖旅程+1",
        "levels_img": {
            "初级": ["https://img.gamemale.com/forum/202303/25/204435zrrccjg33ren8pa6.gif", 40],
            "Max": ["https://img.gamemale.com/album/202303/06/182225u4qdd4lqczmriqbk.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0416",
        "url_tid": "108911",
        "name": "『新居手册Ⓖ』",
        "date": "2023-3-25",
        "buy_limit": "在线时间≥1000，灵魂≥1，金币≥10000（GM村购置新居缴费凭证）",
        "price": "10000金币",
        "levels": "【等级0】无属性▕▏升级条件：旅程≥0（手动升级）\n【等级1】无属性▕▏升级条件：消耗10旅程\n【 Max 】无属性",
        "levels_img": {
            "0": ["https://img.gamemale.com/album/202303/19/112055aq5olqpzidobk5wz.gif", 40],
            "1": ["https://img.gamemale.com/album/202303/19/112055aq5olqpzidobk5wz.gif", 40],
            "Max": ["https://img.gamemale.com/album/202303/19/112100nwh8sxw44u1bj1lf.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0415",
        "url_tid": "108908",
        "name": "『矩阵谜钥Ⓖ』",
        "date": "2023-3-25",
        "buy_limit": "旅程≥100，灵魂≥1，金币≥25000（GM村捐赠据点缴费凭证）",
        "price": "10000金币",
        "levels": "【等级0】无属性▕▏升级条件：消耗10旅程\n【 Max 】无属性",
        "levels_img": {
            "0": ["https://img.gamemale.com/album/202303/17/152809q5iibbab5ecbfl55.png", 40],
            "Max": ["https://img.gamemale.com/album/202303/18/014403asgqnn1rnqrzmqpg.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0414",
        "url_tid": "108905",
        "name": "『圣洁化身』",
        "date": "2023-3-25",
        "buy_limit": "Level 10 Max，堕落≤1，灵魂≥1",
        "price": "1堕落",
        "duration": "1天",
        "levels": "【 Max 】1% 回帖堕落-1、发帖堕落-1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202303/15/121506tdmj9q32dbbrbd7d.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0413",
        "url_tid": "108903",
        "name": "『召唤好运的角笛』",
        "date": "2023-3-25",
        "buy_limit": "2023年起主办过活动的热心村民的专属奖励",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202303/17/145526zcvx2ervxcgf3y22.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0412",
        "url_tid": "108901",
        "name": "『钜鲸』",
        "date": "2023-3-25",
        "buy_limit": "金币≥100000（为金币数爆表的数值怪订制的成就勋章）",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202303/17/130706qdg6adahb5qfpbsb.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0411",
        "url_tid": "108899",
        "name": "『私有海域』",
        "date": "2023-3-25",
        "buy_limit": "住在GM村入海居以拥有少量领海",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202303/14/145216xz3qiiouv32cqwz0.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0407",
        "url_tid": "108197",
        "name": "『还乡歌』",
        "date": "2023-3-14",
        "buy_limit": "注册天数≥1825，发帖数≥1，灵魂≥1",
        "price": "无",
        "levels": "【等级 初级】无属性▕▏升级条件：灵魂≥1\n【等级1】无属性▕▏升级条件：总积分≥300\n【等级2】无属性▕▏升级条件：在线时间≥1000\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202302/06/111902plsfztidxxxthnho.gif", 40],
            "2": ["https://img.gamemale.com/album/202302/02/215205divfid6iiqivtf79.gif", 40],
            "初级": ["https://img.gamemale.com/album/202301/28/151124vrgn60rdx93kkr30.gif", 40],
            "Max": ["https://img.gamemale.com/album/202302/02/215208i9rbobbzolct7rkb.gif", 40]
        }
    },
    {
        "type": "剧情",
        "no": "0410",
        "url_tid": "108202",
        "name": "『任天堂Switch』灰黑√",
        "date": "2023-3-14",
        "buy_limit": "咒术≥20",
        "price": "100金币",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗0灵魂\n【等级1】2% 回帖旅程+1▕▏升级条件：灵魂≥1\n【 Max 】2% 回帖旅程+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202303/02/125534hntc1o7nioiv0ekz.gif", 82],
            "初级": ["https://img.gamemale.com/album/202303/02/123318m1vu898ponxx9jp3.gif", 82],
            "Max": ["https://img.gamemale.com/album/202303/02/124057tl9kz0ahcwczcnid.gif", 82]
        }
    },
    {
        "type": "剧情",
        "no": "0409",
        "url_tid": "108201",
        "name": "『任天堂Switch』红蓝√",
        "date": "2023-3-14",
        "buy_limit": "咒术≥20",
        "price": "100金币",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗0灵魂\n【等级1】2% 回帖知识+1▕▏升级条件：灵魂≥1\n【 Max 】2% 回帖知识+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202303/02/125534e3zc5ch9suoifucs.gif", 82],
            "初级": ["https://img.gamemale.com/album/202303/02/123315m5czjrpjp5pcjwek.gif", 82],
            "Max": ["https://img.gamemale.com/album/202303/02/124057qvnd5ct6hldcl6si.gif", 82]
        }
    },
    {
        "type": "剧情",
        "no": "0408",
        "url_tid": "108200",
        "name": "『日心说』",
        "date": "2023-3-14",
        "buy_limit": "【星楼钟塔】成功报名参加占星仪式",
        "price": "无",
        "levels": "【等级 初级】无属性▕▏升级条件：消耗-1知识\n【 Max 】1% 回帖知识+1、发帖知识+1",
        "levels_img": {
            "初级": ["https://img.gamemale.com/album/202301/28/151124vrgn60rdx93kkr30.gif", 40],
            "Max": ["https://img.gamemale.com/album/202302/28/145327jebo3te43x6vegzx.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0406",
        "url_tid": "104061",
        "name": "红心玉",
        "date": "2023-1-25",
        "buy_limit": "【瑞兔呈祥】兔年新春发帖活动奖励",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202301/20/235533sh6c3wa2wts4fhe2.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0405",
        "url_tid": "103961",
        "name": "小阿尔的蛋",
        "date": "2023-1-24",
        "buy_limit": "在线时间≥200",
        "price": "388金币",
        "levels": "【等级1】5% 回帖血液+1、发帖金币+2▕▏升级条件：消耗150金币\n【等级2】8% 回帖血液+1、发帖金币+2▕▏升级条件：消耗200血液\n【等级3】10% 回帖血液+2、发帖金币+2▕▏升级条件：在线时间≥1000\n【 Max 】15% 回帖血液+2、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202301/20/210106yuor25o3sq73oxl2.gif", 40],
            "2": ["https://img.gamemale.com/album/202301/20/210107stmsdtkj3buntn5n.gif", 40],
            "3": ["https://img.gamemale.com/album/202301/20/210107sktki9pov99z2wtk.gif", 40],
            "Max": ["https://img.gamemale.com/album/202301/20/210107p5215jn25r1zuj55.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0404",
        "url_tid": "103960",
        "name": "乔治·迈克尔",
        "date": "2023-1-24",
        "buy_limit": "旅程≥30",
        "price": "600金币",
        "levels": "【等级1】6% 回帖血液+2、发帖血液+5▕▏升级条件：追随≥99\n【等级2】9% 回帖血液+2、发帖血液+5▕▏升级条件：在线时间≥666\n【等级3】12% 回帖血液+2、发帖血液+5▕▏升级条件：消耗666金币\n【等级4】15% 回帖血液+2、发帖血液+5▕▏升级条件：消耗888血液\n【 Max 】18% 回帖血液+3、发帖血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202301/20/210057z394b16ff4079o79.gif", 40],
            "2": ["https://img.gamemale.com/album/202301/20/210057my58hmyhrwy881wx.gif", 40],
            "3": ["https://img.gamemale.com/album/202301/20/210058b03pz77y0pyjhxg0.gif", 124],
            "4": ["https://img.gamemale.com/album/202301/20/210058vton58og1l8zjtn1.gif", 82],
            "Max": ["https://img.gamemale.com/album/202301/20/210058s1h45s2ob2b4uovo.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0403",
        "url_tid": "103959",
        "name": "Drover",
        "date": "2023-1-24",
        "buy_limit": "无",
        "price": "380金币",
        "levels": "【等级1】4% 回帖血液+1、发帖血液+1▕▏升级条件：消耗80血液\n【等级2】4% 回帖血液+2、发帖血液+2▕▏升级条件：消耗180血液\n【等级3】6% 回帖血液+2、发帖血液+2▕▏升级条件：消耗280血液\n【 Max 】8% 回帖血液+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202301/20/210041rwf9wrr6om9q0zue.gif", 40],
            "2": ["https://img.gamemale.com/album/202301/20/210041vlhoarrlro57akml.gif", 82],
            "3": ["https://img.gamemale.com/album/202301/20/210042zuktth44bvk9h960.gif", 82],
            "Max": ["https://img.gamemale.com/album/202301/20/210042h4jjguwp5yej67uw.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0402",
        "url_tid": "103958",
        "name": "光之战士",
        "date": "2023-1-24",
        "buy_limit": "旅程≥15",
        "price": "600金币",
        "levels": "【等级1】5% 回帖金币+1 发帖血液+2▕▏升级条件：消耗200金币\n【等级2】8% 回帖金币+2 发帖血液+3▕▏升级条件：消耗300金币\n【等级3】10% 回帖金币+2 发帖血液+3▕▏升级条件：消耗300血液\n【等级4】12% 回帖血液+2 发帖金币+3▕▏升级条件：消耗400金币\n【等级5】4% 回帖旅程+1 发帖金币+3▕▏升级条件：消耗500金币\n【 Max 】5% 回帖旅程+1 发帖金币+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202301/20/210048n0ias5x5dkaa93d1.gif", 40],
            "2": ["https://img.gamemale.com/album/202301/20/210049s2g5ddv52zlvavy5.gif", 82],
            "3": ["https://img.gamemale.com/album/202301/20/210049meciva5ohoz2jeoi.gif", 82],
            "4": ["https://img.gamemale.com/album/202301/20/210049pa4hthfvhhir1htu.gif", 82],
            "5": ["https://img.gamemale.com/album/202301/20/210050ygrxuxy2artokuth.gif", 82],
            "Max": ["https://img.gamemale.com/album/202301/20/210050tijxj1x4nxnxdfff.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0401",
        "url_tid": "103957",
        "name": "竹村五郎",
        "date": "2023-1-24",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】5% 回帖咒术+1▕▏升级条件：消耗50咒术\n【等级2】8% 回帖咒术+1▕▏升级条件：消耗100咒术\n【 Max 】10% 回帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202301/20/210115shqo42ohz1ff4vq1.gif", 40],
            "2": ["https://img.gamemale.com/album/202301/20/210115vzo5ibdrvmzdpedm.gif", 82],
            "Max": ["https://img.gamemale.com/album/202301/20/210116co07yazyiqoo0yr3.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0400",
        "url_tid": "101775",
        "name": "果体76",
        "date": "2023-1-1",
        "buy_limit": "活动中抽奖获得购买资格购入",
        "price": "766金币",
        "levels": "【 Max 】76% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202301/01/225947k48ocor1872hzt5t.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0399",
        "url_tid": "101345",
        "name": "史蒂文·格兰特",
        "date": "2022-12-26",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】4% 回帖金币+1、发帖血液+1▕▏升级条件：消耗100血液\n【等级2】6% 回帖金币+1、发帖血液+1▕▏升级条件：消耗150金币\n【等级3】8% 回帖金币+1、发帖血液+1▕▏升级条件：消耗200血液\n【等级4】10% 回帖金币+2、发帖血液+2▕▏升级条件：消耗251金币\n【等级5】12% 回帖金币+2、发帖血液+2▕▏升级条件：消耗400血液\n【 Max 】14% 回帖金币+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202212/23/203749czvoecat8j88ugxa.gif", 40],
            "2": ["https://img.gamemale.com/album/202212/23/203750jqenw76662z6uuss.gif", 82],
            "3": ["https://img.gamemale.com/album/202212/23/203750nu0uf0xfemamas05.gif", 82],
            "4": ["https://img.gamemale.com/album/202212/23/203751bn18tooo4t4it8vh.gif", 124],
            "5": ["https://img.gamemale.com/album/202212/23/203751i9535lqpmu3qi9ju.gif", 124],
            "Max": ["https://img.gamemale.com/album/202212/23/203752i5g3yplznttgagup.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0398",
        "url_tid": "101343",
        "name": "马克·史贝特",
        "date": "2022-12-26",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】4% 回帖血液+1、发帖金币+1▕▏升级条件：消耗100金币\n【等级2】6% 回帖血液+1、发帖金币+1▕▏升级条件：消耗150血液\n【等级3】8% 回帖血液+1、发帖金币+1▕▏升级条件：消耗200金币\n【等级4】10% 回帖血液+2、发帖金币+2▕▏升级条件：消耗251血液\n【等级5】12% 回帖血液+2、发帖金币+2▕▏升级条件：消耗400金币\n【 Max 】14% 回帖血液+3、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202212/23/203739xqa28mvhd32ytm95.gif", 40],
            "2": ["https://img.gamemale.com/album/202212/23/203739ae7ej646ecmtjz1p.gif", 82],
            "3": ["https://img.gamemale.com/album/202212/23/203740hddep8ffqec4ezoc.gif", 82],
            "4": ["https://img.gamemale.com/album/202212/23/210109t1sg7cntdmcs1zam.gif", 124],
            "5": ["https://img.gamemale.com/album/202212/23/203742hq5zq55kvv511zqq.gif", 124],
            "Max": ["https://img.gamemale.com/album/202212/23/203743i7vp44fx4p2bxxxu.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0397",
        "url_tid": "99612",
        "name": "旅行骰子！",
        "date": "2022-12-3",
        "buy_limit": "【GM旅行季】中参加活动并坚持到最后的玩家奖励",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1、发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202212/01/232004ht2zs3tc7f7t61z7.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0396",
        "url_tid": "97633",
        "name": "奇思妙想",
        "date": "2022-11-5",
        "buy_limit": "【奇思妙想】故事接龙活动中达成全勤奖励",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1、发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202211/05/215125oqzkwe24epee6ldv.gif", 82]
        }
    },
    {
        "type": "场景&版块",
        "no": "0395",
        "url_tid": "95020",
        "name": "街头霸王",
        "date": "2022-9-11",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202209/11/214315r2wcggkcizwilp2s.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0394",
        "url_tid": "95019",
        "name": "【限定】深渊遗物",
        "date": "2022-9-11",
        "buy_limit": "【星尘月陨】活动奖励，升级为宠物类型",
        "price": "无",
        "levels": "【等级1】1% 回帖血液+3▕▏升级条件：消耗-1旅程\n【 Max 】10% 回帖血液+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220424rm25fsobj1zyf3y5.gif", 40],
            "Max": ["https://img.gamemale.com/album/202209/08/220424iwn7hkdmhdmn6vnv.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0394",
        "url_tid": "95019",
        "name": "深渊遗物",
        "date": "2022-9-11",
        "buy_limit": "【星尘月陨】活动奖励，保留为奖品类型",
        "price": "无",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：消耗50血液\n【等级2】1% 回帖血液+2▕▏升级条件：消耗10咒术\n【 Max 】1% 回帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220425nw6klwk5kl86li6l.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/08/220425kmbqxbfboo6m6xms.gif", 40],
            "Max": ["https://img.gamemale.com/album/202209/08/220426ouunnj2rujd2rdro.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0393",
        "url_tid": "95018",
        "name": "新手蛋",
        "date": "2022-9-11",
        "buy_limit": "发帖数≥50，主题数≥2",
        "price": "120金币",
        "levels": "【等级1】10% 回帖金币+1▕▏升级条件：发帖数≥150\n【等级2】20% 回帖金币+1▕▏升级条件：发帖数≥300\n【等级3】30% 回帖金币+1▕▏升级条件：发帖数≥500\n【 Max 】5% 回帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220411r4ykckemz4e1kirc.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/08/220412gxl96sx00bs9l90p.gif", 40],
            "3": ["https://img.gamemale.com/album/202209/08/220412tod17jolwuj4d4lo.gif", 40],
            "Max": ["https://img.gamemale.com/album/202209/08/220412ix799xdawmmz7ycm.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0392",
        "url_tid": "95016",
        "name": "超级幸运无敌辉石",
        "date": "2022-9-11",
        "buy_limit": "无",
        "price": "1088金币",
        "levels": "【等级1】1% 回帖血液+5、发帖血液+5▕▏升级条件：消耗1188血液\n【 Max 】1% 回帖金币+20、发帖金币+20",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220307s4ebll4uyehlusbr.gif", 40],
            "Max": ["https://img.gamemale.com/album/202209/08/220320x2qvaza0g81nha00.gif", 124]
        }
    },
    {
        "type": "咒术",
        "no": "0391",
        "url_tid": "94957",
        "name": "思绪骤聚",
        "date": "2022-9-11",
        "buy_limit": "咒术≥20，知识≥10",
        "price": "15咒术",
        "duration": "5天",
        "levels": "【等级1】3% 回帖知识+1、发帖知识+1▕▏升级条件：消耗-1知识\n【等级2】无属性▕▏升级条件：知识≥500\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/233429fjwuucg8081nsujw.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/10/112912rflnu3koumyn52sm.gif", 82],
            "Max": ["https://img.gamemale.com/album/202209/08/233429hfrm5f4fjf47rm4j.gif", 124]
        }
    },
    {
        "type": "咒术",
        "no": "0390",
        "url_tid": "94956",
        "name": "雷霆晶球",
        "date": "2022-9-11",
        "buy_limit": "咒术≥14",
        "price": "7咒术",
        "duration": "7天",
        "levels": "【等级1】无属性▕▏升级条件：消耗7咒术\n【等级2】7% 回帖血液+1 咒术+1、发帖血液+1 咒术+1▕▏升级条件：消耗-7咒术\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/233422tkiq6aa6ypy6ilnx.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/08/233422h99ccgcddz4cczpd.gif", 40],
            "Max": ["https://img.gamemale.com/album/202209/08/233423fshlbbdyh5ayfuek.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0389",
        "url_tid": "94953",
        "name": "茉香啤酒",
        "date": "2022-9-11",
        "buy_limit": "只可赠送",
        "price": "25金币",
        "duration": "3天",
        "levels": "【等级1】无属性▕▏升级条件：消耗-1血液\n【 Max 】15% 回帖血液+1 堕落-1、发帖血液-1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220344nxn1i33r930xnlii.gif", 40],
            "Max": ["https://img.gamemale.com/album/202209/08/220345t07gtdb7zdlpsmls.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0388",
        "url_tid": "94952",
        "name": "闪光糖果盒",
        "date": "2022-9-11",
        "buy_limit": "只可赠送",
        "price": "70金币",
        "duration": "7天",
        "levels": "【 Max 】17% 发帖咒术+1 血液+3",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202209/08/220404nxj7eqjzr66ul7uj.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0387",
        "url_tid": "94950",
        "name": "博伊卡",
        "date": "2022-9-11",
        "buy_limit": "追随≥20",
        "price": "550金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+2▕▏升级条件：消耗200血液\n【等级2】10% 回帖金币+1、发帖金币+2▕▏升级条件：消耗400血液\n【等级3】10% 回帖金币+2 血液-1、发帖金币+3 血液-1▕▏升级条件：消耗-100金币\n【等级4】13% 回帖金币+3 血液-1、发帖金币+5 血液-1▕▏升级条件：消耗600血液\n【 Max 】15% 回帖金币+3、发帖金币+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220112eikaik5ic7sete5w.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/08/220112hz6solemsmeux1mo.gif", 40],
            "3": ["https://img.gamemale.com/album/202209/08/220113g82vs1kq8srs9sy9.gif", 82],
            "4": ["https://img.gamemale.com/album/202209/08/220114ldccrgmjttc5r7gc.gif", 124],
            "Max": ["https://img.gamemale.com/album/202209/08/220116dlurf4fh4i5iiw54.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0386",
        "url_tid": "94949",
        "name": "擎天柱（Peterbilt389）",
        "date": "2022-9-11",
        "buy_limit": "追随≥20",
        "price": "400金币",
        "levels": "【等级1】4% 回帖血液+1、发帖咒术+1▕▏升级条件：消耗233血液\n【等级2】5% 回帖咒术+1 血液+1、发帖咒术+1▕▏升级条件：消耗233金币\n【等级3】6% 回帖咒术+1 血液+1、发帖咒术+1▕▏升级条件：消耗66咒术\n【等级4】7% 回帖咒术+1 血液+2、发帖旅程+1▕▏升级条件：旅程≥80\n【 Max 】8% 回帖咒术+1 血液+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220208d63m8xp7fcmms0s6.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/08/220214ia71cc6k6j6ck1cz.gif", 82],
            "3": ["https://img.gamemale.com/album/202209/08/220219jyj18g3sc5c2szyg.gif", 82],
            "4": ["https://img.gamemale.com/album/202209/08/220227mqqgqopehuyf7g7m.gif", 82],
            "Max": ["https://img.gamemale.com/album/202209/08/220237iu2eys9heee4cuer.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0385",
        "url_tid": "94948",
        "name": "大黄蜂（ChevroletCamaro）",
        "date": "2022-9-11",
        "buy_limit": "旅程≥10",
        "price": "300金币",
        "levels": "【等级1】4% 回帖金币+1 血液+1、发帖咒术+1▕▏升级条件：消耗100金币\n【等级2】6% 回帖金币+1 血液+1、发帖咒术+1▕▏升级条件：消耗100血液\n【等级3】8% 回帖金币+1 血液+1、发帖咒术+1▕▏升级条件：消耗30咒术\n【 Max 】10% 回帖血液+1 金币+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220142qo17q7pej5qjlb88.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/08/220150l6yh6r5ynn8rh9yy.gif", 82],
            "3": ["https://img.gamemale.com/album/202209/08/220200xyw8folffw9rldon.gif", 82],
            "Max": ["https://img.gamemale.com/album/202209/08/220205mlvvspiizbqzmmws.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0384",
        "url_tid": "94947",
        "name": "桐生一马",
        "date": "2022-9-11",
        "buy_limit": "追随≥20",
        "price": "500金币",
        "levels": "【等级1】8% 回帖金币+1▕▏升级条件：消耗200血液\n【等级2】8% 回帖金币+1 血液+1▕▏升级条件：追随≥88\n【 Max 】15% 回帖金币+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220241negi31y53g3n53t5.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/08/220244lozfrlrrorn9fouz.gif", 82],
            "Max": ["https://img.gamemale.com/album/202209/08/220245b72iyatiyii2kqb9.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0383",
        "url_tid": "94946",
        "name": "不灭狂雷-沃利贝尔",
        "date": "2022-9-11",
        "buy_limit": "堕落≥20",
        "price": "500金币",
        "levels": "【等级1】2% 回帖血液+1、发帖血液+2 堕落+1▕▏升级条件：消耗200血液\n【等级2】5% 回帖血液+1 堕落+1、发帖血液+3 堕落+1▕▏升级条件：咒术≥100\n【 Max 】10% 回帖血液+2 堕落+1、发帖血液+3 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220126m92xhg1wndwhljxl.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/08/220130pvn0n333jnmvv90q.gif", 82],
            "Max": ["https://img.gamemale.com/album/202209/08/220134e01aoeaw8p5ewznm.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0382",
        "url_tid": "94945",
        "name": "豹王",
        "date": "2022-9-11",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】2% 回帖金币+2▕▏升级条件：追随≥50\n【等级2】5% 回帖金币+2▕▏升级条件：消耗100金币\n【等级3】8% 回帖金币+2、发帖旅程+1▕▏升级条件：消耗100血液\n【 Max 】11% 回帖金币+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202209/08/220052tash88iz4rydihtz.gif", 40],
            "2": ["https://img.gamemale.com/album/202209/08/220053ume4s2sgqglg2of4.gif", 82],
            "3": ["https://img.gamemale.com/album/202209/08/220053ymnon6ouuz69nmxj.gif", 82],
            "Max": ["https://img.gamemale.com/album/202209/08/220054qnrp315ykr3gskdk.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0381",
        "url_tid": "92248",
        "name": "海与天之蛋",
        "date": "2022-7-1",
        "buy_limit": "海洋生物奇缘【Magic Sweet】活动优胜奖",
        "price": "无",
        "levels": "【等级1】2% 回帖血液-1 咒术+1▕▏升级条件：金币≥100\n【 Max 】2% 回帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202206/28/122830g7be6mvk77ryy7bd.gif", 40],
            "Max": ["https://img.gamemale.com/album/202206/28/122831fdnjgltqafko1fug.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0380",
        "url_tid": "92246",
        "name": "海的记忆",
        "date": "2022-7-1",
        "buy_limit": "海洋生物奇缘【Magic Sweet】活动中生存奖励",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202206/28/122830mwtdy1twktepwtey.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0379",
        "url_tid": "91431",
        "name": "莱托·厄崔迪",
        "date": "2022-6-11",
        "buy_limit": "无",
        "price": "350金币",
        "levels": "【等级1】6% 回帖血液+2▕▏升级条件：消耗50金币\n【等级2】8% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗50血液\n【等级3】10% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗150金币\n【 Max 】12% 回帖血液+2、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/153010hllprzpfrlx6offp.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/153010y7es4e079sgiz4iq.gif", 40],
            "3": ["https://img.gamemale.com/album/202205/30/153011elqem2szl60lwpz0.gif", 40],
            "Max": ["https://img.gamemale.com/album/202205/30/153011cyrff4y559yj4wfy.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0378",
        "url_tid": "91429",
        "name": "玄生万物",
        "date": "2022-6-11",
        "buy_limit": "【九周年】活动奖励",
        "price": "无",
        "levels": "【 Max 】9% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202205/30/153845uc8vttoe7vswy7vs.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0376",
        "url_tid": "91428",
        "name": "美恐：启程",
        "date": "2022-6-11",
        "buy_limit": "旅程≥15，知识≥15，血液≥200",
        "price": "100金币",
        "levels": "【等级1】1% 回帖旅程+1▕▏升级条件：消耗1旅程\n【等级2】2% 回帖血液+1▕▏升级条件：消耗50血液\n【等级3】1% 回帖知识+1▕▏升级条件：消耗1旅程\n【等级4】1% 回帖血液+2▕▏升级条件：消耗50金币\n【等级5】1% 回帖旅程+1▕▏升级条件：消耗1旅程\n【等级6】1% 回帖血液+2▕▏升级条件：消耗50血液\n【等级7】2% 回帖血液+1▕▏升级条件：消耗50金币\n【等级8】1% 回帖知识+1▕▏升级条件：消耗-1知识\n【等级9】2% 回帖血液+2▕▏升级条件：消耗-3旅程\n【 Max 】3% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/153935wjcjqt3lrt50tfm0.gif", 124],
            "2": ["https://img.gamemale.com/album/202205/30/153937mpya4jdy43a963bc.gif", 124],
            "3": ["https://img.gamemale.com/album/202205/30/153938o5rr11t11fjtd1ud.gif", 124],
            "4": ["https://img.gamemale.com/album/202205/30/153940e1bhjae1half1xd1.gif", 124],
            "5": ["https://img.gamemale.com/album/202205/30/153941lzlmxhv92odlzd9g.gif", 124],
            "6": ["https://img.gamemale.com/album/202205/30/153943uf10ui7nwi4kdzir.gif", 124],
            "7": ["https://img.gamemale.com/album/202205/30/153945gdfc57lpcfb5m3y7.gif", 124],
            "8": ["https://img.gamemale.com/album/202205/30/153946geza35dxru62r5aa.gif", 124],
            "9": ["https://img.gamemale.com/album/202205/30/153948bscjjx7xe7zag5a3.gif", 124],
            "Max": ["https://img.gamemale.com/album/202205/30/153949dp9i5999vd2d7ysv.gif", 124]
        }
    },
    {
        "type": "天赋",
        "no": "0375",
        "url_tid": "91427",
        "name": "海边的邻居",
        "date": "2022-6-11",
        "buy_limit": "金币≥1500，追随≥150",
        "price": "无",
        "levels": "【等级1】5% 发帖咒术+1▕▏升级条件：在线时间≥888\n【等级2】15% 发帖咒术+1▕▏升级条件：知识≥60\n【 Max 】30% 发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/154028qq6j9ssj6a43zqz6.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/154030xhh88h4hn84gghf0.gif", 40],
            "Max": ["https://img.gamemale.com/album/202205/30/154032yau40u4hz3huwsud.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0374",
        "url_tid": "91425",
        "name": "海边的蛋",
        "date": "2022-6-11",
        "buy_limit": "在线时间≥300",
        "price": "288金币",
        "levels": "【等级1】10% 回帖金币+1▕▏升级条件：消耗100金币\n【 Max 】20% 回帖金币+1、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/153834dox77eo4y847xez4.gif", 40],
            "Max": ["https://img.gamemale.com/album/202205/30/153834oox4apxcrxxriprf.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0373",
        "url_tid": "91424",
        "name": "梦中的列车",
        "date": "2022-6-11",
        "buy_limit": "旅程≥25",
        "price": "350金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗1旅程\n【等级2】无属性▕▏升级条件：消耗1旅程\n【等级3】无属性▕▏升级条件：消耗1旅程\n【等级4】无属性▕▏升级条件：消耗1旅程\n【等级5】无属性▕▏升级条件：消耗1旅程\n【等级6】无属性▕▏升级条件：消耗1旅程\n【等级7】无属性▕▏升级条件：消耗1旅程\n【等级8】无属性▕▏升级条件：消耗1旅程\n【等级9】无属性▕▏升级条件：消耗1旅程\n【等级10】无属性▕▏升级条件：消耗1旅程\n【等级11】无属性▕▏升级条件：消耗-10旅程\n【 Max 】3% 回帖知识+1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/153950wp84cj31jfq8nr9e.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/153951wnzuu0k30q21k221.gif", 124],
            "3": ["https://img.gamemale.com/album/202205/30/153954zaknwoqlhoiiwilc.gif", 124],
            "4": ["https://img.gamemale.com/album/202205/30/153957iapykb3fq55b5tjp.gif", 124],
            "5": ["https://img.gamemale.com/forum/202206/11/012441ktg13gxg34tggtgi.gif", 124],
            "6": ["https://img.gamemale.com/album/202205/30/154002gguxp9yjzxgnnjjz.gif", 124],
            "7": ["https://img.gamemale.com/forum/202206/11/012448zdxaahx3xdyy3va4.gif", 124],
            "8": ["https://img.gamemale.com/album/202205/30/154011rwzs30aslssscere.gif", 124],
            "9": ["https://img.gamemale.com/album/202205/30/154016hh16ods26t9p2tp2.gif", 124],
            "10": ["https://img.gamemale.com/forum/202206/11/012457thwqzq44hvhhm8hh.gif", 124],
            "11": ["https://img.gamemale.com/forum/202206/11/012501xlwxj3282e6q2kq6.gif", 124],
            "Max": ["https://img.gamemale.com/album/202205/30/154024iwff9hfi5b30i05u.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0372",
        "url_tid": "91420",
        "name": "秘密空瓶",
        "date": "2022-6-11",
        "buy_limit": "追随≥42",
        "price": "666金币",
        "levels": "【等级1】15% 回帖血液+1▕▏升级条件：消耗1灵魂\n【等级2】100% 发帖血液+2▕▏升级条件：灵魂≥1\n【 Max 】100% 发帖金币+2 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/153853iqmkalb0ij184z2o.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/153853acmf2noesd8k9fzf.gif", 40],
            "Max": ["https://img.gamemale.com/album/202205/30/153854mpo39w3zaxouiktp.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0371",
        "url_tid": "91419",
        "name": "恩惠护符",
        "date": "2022-6-11",
        "buy_limit": "旅程≥10",
        "price": "350金币",
        "levels": "【等级1】3% 回帖金币+1、发帖金币+1▕▏升级条件：消耗350金币\n【等级2】6% 回帖金币+2、发帖金币+3▕▏升级条件：旅程≥69\n【 Max 】9% 回帖金币+3、发帖金币+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/153903g1s39nitd8rq8szn.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/153904pdk3nkt7f6fhjxls.gif", 40],
            "Max": ["https://img.gamemale.com/album/202205/30/153904di2vg1g33z43fj31.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0370",
        "url_tid": "91418",
        "name": "贤者头盔",
        "date": "2022-6-11",
        "buy_limit": "知识≥1",
        "price": "200金币",
        "levels": "【等级1】8% 回帖金币-1 咒术+1、发帖金币+1▕▏升级条件：消耗100血液\n【等级2】10% 回帖血液-1 咒术+1、发帖咒术+1▕▏升级条件：消耗100金币\n【 Max 】8% 回帖咒术+1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/153916ilgnbqq3llo0v07q.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/153916rvyyicmvf9q9yi2k.gif", 40],
            "Max": ["https://img.gamemale.com/album/202205/30/153917jclcft842c8jucfc.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0369",
        "url_tid": "91416",
        "name": "西弗勒斯·斯内普",
        "date": "2022-6-10",
        "buy_limit": "旅程≥38",
        "price": "666金币",
        "levels": "【等级1】12% 回帖血液+1、发帖旅程+1▕▏升级条件：消耗99血液\n【等级2】10% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗99金币\n【等级3】8% 回帖血液+3、发帖旅程+1▕▏升级条件：消耗1314血液\n【等级4】6% 回帖旅程+1▕▏升级条件：金币≥999\n【 Max 】2% 回帖旅程+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/152920jp2g696p9t72t2p9.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/152920aprfmp08rnqdnr5i.gif", 82],
            "3": ["https://img.gamemale.com/album/202205/30/152920feaj4bx8zhx4hje5.gif", 82],
            "4": ["https://img.gamemale.com/album/202205/30/152921b5jqv665xxmst6v8.gif", 82],
            "Max": ["https://img.gamemale.com/album/202205/30/152921rpu6qr0jugqj4ue5.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0368",
        "url_tid": "91415",
        "name": "阿不思·邓布利多",
        "date": "2022-6-10",
        "buy_limit": "旅程≥10",
        "price": "250金币",
        "levels": "【等级1】6% 回帖血液+1、发帖血液+3▕▏升级条件：消耗333金币\n【等级2】8% 回帖血液+1、发帖血液+3▕▏升级条件：消耗444血液\n【等级3】10% 回帖血液+2、发帖血液+3▕▏升级条件：消耗77咒术\n【等级4】15% 回帖血液+2、发帖知识+1▕▏升级条件：旅程≥115\n【 Max 】16% 回帖血液+3、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/152901xndc1ll91zn1cv11.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/152902chitnyijds3d3tjj.gif", 82],
            "3": ["https://img.gamemale.com/album/202205/30/152902bluus3t6zz77zsjx.gif", 82],
            "4": ["https://img.gamemale.com/album/202205/30/152902eiisdiidjrmremt2.gif", 82],
            "Max": ["https://img.gamemale.com/album/202205/30/152903ltu34trptivuww7w.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0367",
        "url_tid": "91414",
        "name": "诺克提斯·路西斯·伽拉姆",
        "date": "2022-6-10",
        "buy_limit": "旅程≥15",
        "price": "666金币",
        "levels": "【等级1】4% 回帖血液+1、发帖旅程+1▕▏升级条件：旅程≥30\n【等级2】8% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗200血液\n【等级3】12% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗350血液\n【等级4】15% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗1灵魂\n【 Max 】18% 回帖血液+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/152940kebhzws55thyy5s5.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/152940jni00g5z4spf5fu6.gif", 82],
            "3": ["https://img.gamemale.com/album/202205/30/152941wbzi7mupqps3gl7q.gif", 82],
            "4": ["https://img.gamemale.com/album/202205/30/152941ok2hf26nkbn2piaz.gif", 82],
            "Max": ["https://img.gamemale.com/album/202205/30/152941uwpa98c2cf98ocjg.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0366",
        "url_tid": "91413",
        "name": "普隆普特·阿金塔姆",
        "date": "2022-6-10",
        "buy_limit": "知识≥10",
        "price": "500金币",
        "levels": "【等级1】3% 回帖金币+1、发帖旅程+1▕▏升级条件：知识≥30\n【等级2】6% 回帖金币+2、发帖旅程+1▕▏升级条件：消耗100金币\n【等级3】9% 回帖金币+2、发帖旅程+1▕▏升级条件：消耗200金币\n【等级4】12% 回帖金币+2、发帖旅程+1▕▏升级条件：咒术≥188\n【 Max 】15% 回帖金币+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202205/30/152955zzclmn646306ni6n.gif", 40],
            "2": ["https://img.gamemale.com/album/202205/30/152956gz47dh4ex57617h7.gif", 82],
            "3": ["https://img.gamemale.com/album/202205/30/152956dy1159k1s4y1ld9c.gif", 82],
            "4": ["https://img.gamemale.com/album/202205/30/152956ly2t2cbzwbyxn2qb.gif", 82],
            "Max": ["https://img.gamemale.com/album/202205/30/152957do9uwh95k8azkukz.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0365",
        "url_tid": "88880",
        "name": "时间变异管理局",
        "date": "2022-5-1",
        "buy_limit": "在线时间≥199，知识≥19，旅程≥19",
        "price": "100金币",
        "levels": "【等级1】2% 回帖血液+1、发帖金币+1▕▏升级条件：在线时间≥999\n【等级2】2% 回帖金币+2、发帖血液+2▕▏升级条件：在线时间≥1999\n【等级3】3% 回帖咒术+1、发帖咒术+1▕▏升级条件：在线时间≥2999\n【 Max 】3% 回帖旅程+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202204/29/211647njii9gpu9qjzjwye.gif", 124],
            "2": ["https://img.gamemale.com/album/202204/29/211647dvnmpvvm7vr114vq.gif", 124],
            "3": ["https://img.gamemale.com/album/202204/29/211648w24t6pm1ie41wlmh.gif", 124],
            "Max": ["https://img.gamemale.com/album/202204/29/211648ooll00l3lef6qj7z.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0364",
        "url_tid": "88879",
        "name": "黑豹",
        "date": "2022-5-1",
        "buy_limit": "知识≥5",
        "price": "320金币",
        "levels": "【等级1】6% 回帖血液+1 堕落-1、发帖咒术+1▕▏升级条件：消耗100血液\n【等级2】8% 回帖血液+1 堕落-1、发帖咒术+1▕▏升级条件：消耗200金币\n【等级3】10% 回帖血液+1 堕落-1、发帖咒术+1▕▏升级条件：消耗50咒术\n【 Max 】12% 回帖血液+2 堕落-1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202204/29/211558iniaibiduyiudzwu.gif", 40],
            "2": ["https://img.gamemale.com/album/202204/29/211559kf83ssoli9f3ivr8.gif", 82],
            "3": ["https://img.gamemale.com/album/202204/29/211559mqkz8bnclzmdbmfc.gif", 82],
            "Max": ["https://img.gamemale.com/album/202204/29/211559zr5grxr8ew8bezdg.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0363",
        "url_tid": "88878",
        "name": "神灯",
        "date": "2022-5-1",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗100金币\n【等级2】8% 回帖血液+1、发帖血液+1▕▏升级条件：消耗150金币\n【等级3】10% 回帖血液+1、发帖血液+1▕▏升级条件：消耗200金币\n【等级4】12% 回帖血液+2、发帖血液+2▕▏升级条件：消耗300金币\n【 Max 】8% 回帖血液+2 咒术+1、发帖血液+2 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202204/29/211630uf6wd7ljn7f9n4wj.gif", 40],
            "2": ["https://img.gamemale.com/album/202204/29/211630hq4sqwg4810n8haq.gif", 82],
            "3": ["https://img.gamemale.com/album/202204/29/211630g661zqd168vl3dcc.gif", 82],
            "4": ["https://img.gamemale.com/album/202204/29/211630hv88dh8er22hxe9v.gif", 82],
            "Max": ["https://img.gamemale.com/album/202204/29/211631bads43zu2ze4esa4.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0362",
        "url_tid": "88877",
        "name": "莱戈拉斯",
        "date": "2022-5-1",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】5% 回帖金币+1、发帖血液+1▕▏升级条件：消耗50金币\n【等级2】6% 回帖金币+1、发帖血液+2▕▏升级条件：消耗50血液\n【等级3】7% 回帖金币+2、发帖血液+2▕▏升级条件：消耗100金币\n【 Max 】8% 回帖金币+2、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202204/29/211616q5zakqkk5hyy5slq.gif", 40],
            "2": ["https://img.gamemale.com/album/202204/29/211617jikv11464f6m364e.gif", 82],
            "3": ["https://img.gamemale.com/album/202204/29/211617egjeh6h0eyye2y2a.gif", 82],
            "Max": ["https://img.gamemale.com/album/202204/29/211617cnrq9ozblzuuosfp.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0361",
        "url_tid": "88876",
        "name": "甘道夫",
        "date": "2022-5-1",
        "buy_limit": "知识≥18",
        "price": "700金币",
        "levels": "【等级1】8% 回帖血液+1 、发帖知识+1▕▏升级条件：旅程≥60\n【等级2】10% 发帖血液+2 知识+1▕▏升级条件：灵魂≥2\n【等级3】1% 发帖灵魂+1▕▏升级条件：消耗1点堕落\n【等级4】12% 回帖血液+2、发帖咒术+1▕▏升级条件：消耗111咒术\n【 Max 】15% 回帖血液+3、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202204/29/211549weth15b90b1b159e.gif", 40],
            "2": ["https://img.gamemale.com/album/202204/29/211549zg4txfldvx45vmxu.gif", 82],
            "3": ["https://img.gamemale.com/album/202204/29/211550s3x55wwh5thxh0w3.gif", 82],
            "4": ["https://img.gamemale.com/forum/202406/20/010806pwinqi7x7qw2vwnt.gif", 82],
            "Max": ["https://img.gamemale.com/album/202204/29/211550m7h33ikh9w0zk0id.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0360",
        "url_tid": "88875",
        "name": "小天狼星·布莱克",
        "date": "2022-5-1",
        "buy_limit": "堕落≤30",
        "price": "520金币",
        "levels": "【等级1】10% 回帖血液+1、发帖血液+3▕▏升级条件：消耗123咒术\n【等级2】8% 回帖血液-1 咒术+1、发帖血液-3 咒术+3▕▏升级条件：血液≥520\n【 Max 】10% 回帖咒术+1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202204/29/211640l3t4gtg44733vqtb.gif", 40],
            "2": ["https://img.gamemale.com/album/202204/29/211640ca8fijs28yfsxy89.gif", 82],
            "Max": ["https://img.gamemale.com/album/202204/29/211640bvqj6fjlfv1v6f19.gif", 40]
        }
    },
    {
        "type": "储蓄",
        "no": "0359",
        "url_tid": "88874",
        "name": "不起眼的空瓶",
        "date": "2022-5-1",
        "buy_limit": "无",
        "price": "10咒术",
        "duration": "7天",
        "levels": "【等级1】8% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗-13咒术\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202205/01/015605ng53ejh3hstgjqgz.gif", 40],
            "Max": ["", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0358",
        "url_tid": "88872",
        "name": "生命树叶",
        "date": "2022-5-1",
        "buy_limit": "【Collect Barter】活动奖励",
        "price": "无",
        "levels": "【等级1】3% 回帖血液+1▕▏升级条件：消耗100金币\n【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202204/18/221347uaf6t0nytgdnvndl.gif", 40],
            "Max": ["https://img.gamemale.com/album/202204/18/221347na20w6700n7dd7ky.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0357",
        "url_tid": "87022",
        "name": "孔明灯",
        "date": "2022-3-16",
        "buy_limit": "【月光永夜】活动奖励",
        "price": "无",
        "levels": "【等级1】2% 回帖堕落-1 血液+1▕▏升级条件：消耗1旅程\n【 Max 】4% 回帖堕落-1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202202/16/120458ho6j2zih9fini9hf.gif", 40],
            "Max": ["https://img.gamemale.com/album/202202/16/120458ikggeh3gwl7xdnoe.gif", 40]
        }
    },
    {
        "type": "天赋",
        "no": "0356",
        "url_tid": "85525",
        "name": "男色诱惑",
        "date": "2022-2-2",
        "buy_limit": "堕落≥100，知识≥50",
        "price": "无",
        "levels": "【等级1】11% 发帖血液+3▕▏升级条件：堕落≥200\n【等级2】22% 发帖血液+4▕▏升级条件：堕落≥300\n【 Max 】33% 发帖血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202201/27/150358qq49stoxstitr6fq.gif", 82],
            "2": ["https://img.gamemale.com/album/202201/27/150400xpyj3f2o0u2yjgjr.gif", 82],
            "Max": ["https://img.gamemale.com/album/202201/27/150402jh27jrhqshljlvre.gif", 82]
        }
    },
    {
        "type": "宠物",
        "no": "0355",
        "url_tid": "85524",
        "name": "血红色的蛋",
        "date": "2022-2-2",
        "buy_limit": "堕落≥60",
        "price": "290金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗75血液\n【等级2】10% 回帖金币+1 堕落+1▕▏升级条件：消耗100血液\n【 Max 】15% 回帖金币+1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202504/22/171504ltsuhpbh1qzh4b9q.gif", 40],
            "2": ["https://img.gamemale.com/album/202201/26/151635e053o6qyxkq0oo3k.gif", 40],
            "Max": ["https://img.gamemale.com/album/202201/26/151636d8ri6g5orkx6hyzu.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0354",
        "url_tid": "85523",
        "name": "五彩斑斓的蛋",
        "date": "2022-2-2",
        "buy_limit": "堕落≤100，旅程≥50",
        "price": "220金币",
        "levels": "【等级1】2% 回帖血液+1▕▏升级条件：消耗100血液\n【等级2】5% 回帖咒术+1 血液-1▕▏升级条件：消耗50咒术\n【 Max 】8% 回帖咒术+2 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202201/26/151626cu9rb9llfglib0df.gif", 40],
            "2": ["https://img.gamemale.com/album/202201/26/151627cxot0t0xvccuxeoi.gif", 40],
            "Max": ["https://img.gamemale.com/album/202201/26/151627g1yz9ms5kysrdad8.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0353",
        "url_tid": "85522",
        "name": "One Ring",
        "date": "2022-2-2",
        "buy_limit": "旅程≥25",
        "price": "500金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗200金币\n【等级2】无属性▕▏升级条件：消耗-1堕落\n【等级3】无属性▕▏升级条件：消耗-1堕落\n【等级4】无属性▕▏升级条件：消耗-1堕落\n【等级5】无属性▕▏升级条件：消耗-1堕落\n【等级6】无属性▕▏升级条件：消耗-1堕落\n【等级7】无属性▕▏升级条件：消耗-1堕落\n【等级8】无属性▕▏升级条件：消耗-1堕落\n【等级9】无属性▕▏升级条件：消耗-1堕落\n【等级10】无属性▕▏升级条件：消耗-1堕落\n【等级11】无属性▕▏升级条件：消耗10堕落\n【 Max 】50% 发帖血液+1 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202201/26/150826buuemmvgsrsb9xms.gif", 40],
            "2": ["https://img.gamemale.com/album/202201/26/150827vufzeeauuuc4s5uz.gif", 124],
            "3": ["https://img.gamemale.com/album/202201/26/150828z2261fak9t28gfkb.gif", 124],
            "4": ["https://img.gamemale.com/album/202201/26/151514jnn2hro3r3op3vrg.gif", 124],
            "5": ["https://thumbsnap.com/i/PMiQHtNk.gif?0527", 124],
            "6": ["https://thumbsnap.com/i/WkpmxzrZ.gif?0527", 124],
            "7": ["https://thumbsnap.com/i/1YooFb2Z.gif?0527", 124],
            "8": ["https://img.gamemale.com/album/202201/26/150830ra2abgt2ctqzbazj.gif", 124],
            "9": ["https://thumbsnap.com/i/LiDVpRtA.gif?0527", 124],
            "10": ["https://thumbsnap.com/i/KGvThK9R.gif?0527", 124],
            "11": ["https://img.gamemale.com/album/202201/26/150831tgtddztx3akitxxa.gif", 124],
            "Max": ["https://img.gamemale.com/album/202201/26/150831fkmzx8zbbkb5k68e.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0352",
        "url_tid": "85521",
        "name": "男用贞操带",
        "date": "2022-2-2",
        "buy_limit": "无",
        "price": "180金币",
        "levels": "【 Max 】3% 回帖旅程+1 堕落-1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202201/26/151612viybo7yi7ooyj8lf.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0351",
        "url_tid": "85520",
        "name": "赫敏·格兰杰",
        "date": "2022-2-2",
        "buy_limit": "发帖数≥30",
        "price": "300金币",
        "levels": "【等级1】6% 回帖血液+1、发帖 血液+1 咒术+1▕▏升级条件：消耗100血液\n【等级2】8% 回帖血液+1、发帖血液+1 咒术+1▕▏升级条件：消耗150血液\n【等级3】10% 回帖血液+1、发帖血液+1 咒术+1▕▏升级条件：消耗30咒术\n【 Max 】10% 回帖血液+2、发帖血液+2 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202303/01/142839y5z2i5i1pztr9k9i.gif", 40],
            "2": ["https://img.gamemale.com/album/202303/01/142837fuhuqee9zefqib9z.gif", 82],
            "3": ["https://img.gamemale.com/album/202303/01/142838pnuf7fposn75sfsp.gif", 82],
            "Max": ["https://img.gamemale.com/album/202303/01/142838xprp7pwr7w18v19w.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0350",
        "url_tid": "85519",
        "name": "威克多尔·克鲁姆",
        "date": "2022-2-2",
        "buy_limit": "血液≥100",
        "price": "300金币",
        "levels": "【等级1】6% 回帖金币+1、发帖金币+1 咒术+1▕▏升级条件：消耗100金币\n【等级2】8% 回帖金币+1、发帖金币+1 咒术+1▕▏升级条件：消耗150金币\n【等级3】10% 回帖金币+1、发帖金币+1 咒术+1▕▏升级条件：消耗30咒术\n【 Max 】10% 回帖金币+2、发帖金币+2 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202201/26/145555tlcoyoejsyqoxxud.gif", 40],
            "2": ["https://img.gamemale.com/album/202201/26/145555foee4n2ddeazq9o5.gif", 82],
            "3": ["https://img.gamemale.com/album/202201/26/145555vl9eldja2c721lal.gif", 82],
            "Max": ["https://img.gamemale.com/album/202201/26/145556p37yydcyay6m3rc6.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0349",
        "url_tid": "85517",
        "name": "异形",
        "date": "2022-2-2",
        "buy_limit": "堕落≥20",
        "price": "580金币",
        "levels": "【等级1】6% 回帖血液+1▕▏升级条件：堕落≥44\n【等级2】8% 回帖血液+1▕▏升级条件：消耗188血液\n【等级3】10% 回帖血液+2▕▏升级条件：追随≥108\n【等级4】12% 回帖血液+2 金币-1▕▏升级条件：金币>999\n【 Max 】15% 回帖血液+3 金币-1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202201/26/145612cvhualf6lhhfvg4g.gif", 40],
            "2": ["https://img.gamemale.com/album/202201/26/145612d8opc5zqlaiy5qpl.gif", 82],
            "3": ["https://img.gamemale.com/album/202201/26/145613dndd7newhhdhch9n.gif", 82],
            "4": ["https://img.gamemale.com/album/202201/26/145613e5ilod8s8ot55odc.gif", 82],
            "Max": ["https://img.gamemale.com/album/202201/26/145613rctymovht7j9zqcc.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0348",
        "url_tid": "85516",
        "name": "瑟兰迪尔",
        "date": "2022-2-2",
        "buy_limit": "在线时间≥99",
        "price": "400金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+3▕▏升级条件：消耗130金币\n【等级2】8% 回帖金币+1、发帖金币+3▕▏升级条件：消耗130血液\n【等级3】10% 回帖金币+1、发帖金币+3▕▏升级条件：知识≥40\n【 Max 】10% 回帖金币+2、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202201/26/145605yccizcccznclcgwc.gif", 40],
            "2": ["https://img.gamemale.com/album/202201/26/145605jzvf7hckfwsdv1k1.gif", 82],
            "3": ["https://img.gamemale.com/album/202201/26/145606uayygzqvxxnqxtav.gif", 82],
            "Max": ["https://img.gamemale.com/album/202201/26/145606qq34ojeoeejbh6bd.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0347",
        "url_tid": "85514",
        "name": "阿拉贡",
        "date": "2022-2-1",
        "buy_limit": "主题数≥15",
        "price": "680金币",
        "levels": "【等级1】10% 回帖血液+1、发帖血液+3▕▏升级条件：消耗365血液\n【等级2】12% 回帖血液+1、发帖血液+3▕▏升级条件：旅程≥88\n【等级3】12% 回帖血液+2、发帖旅程+1▕▏升级条件：追随≥365\n【等级4】16% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗1413金币\n【 Max 】18% 回帖血液+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202201/26/145528f000sv8lc9ngl1i8.gif", 40],
            "2": ["https://s2.loli.net/2023/07/05/imM8XEuPte7ySbV.gif", 82],
            "3": ["https://img.gamemale.com/album/202201/26/145529vrq6y4g869b988zz.gif", 82],
            "4": ["https://img.gamemale.com/album/202201/26/145529ksz77q9gor3lrq3x.gif", 82],
            "Max": ["https://img.gamemale.com/album/202201/26/145529fjwr6gs7jxsnvwir.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0346",
        "url_tid": "85513",
        "name": "岛田源氏",
        "date": "2022-2-1",
        "buy_limit": "旅程≥20",
        "price": "600金币",
        "levels": "【等级1】6% 回帖血液+1、发帖血液+1▕▏升级条件：消耗300血液\n【等级2】8% 回帖血液+1、发帖血液+1▕▏升级条件：消耗300金币\n【等级3】10% 回帖血液+1、发帖血液+2▕▏升级条件：旅程≥60\n【等级4】11% 回帖血液+1、发帖血液+3▕▏升级条件：消耗300血液\n【等级5】13% 回帖血液+2、发帖血液+4▕▏升级条件：知识≥130\n【 Max 】15% 回帖血液+3、发帖血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202201/26/145519evmbk8tmxdgjdrc6.gif", 40],
            "2": ["https://img.gamemale.com/album/202201/26/145519iqy2gg8gekk8a28k.gif", 82],
            "3": ["https://img.gamemale.com/album/202201/26/145519z73drufbl6yy3w73.gif", 82],
            "4": ["https://img.gamemale.com/album/202201/26/145520cp4v6ittkpplbf33.gif", 82],
            "5": ["https://img.gamemale.com/album/202201/26/145520lm6bzbmdzyl5pf8b.gif", 124],
            "Max": ["https://img.gamemale.com/album/202201/26/145520ofl9n1wjsbbf9wjw.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0345",
        "url_tid": "84534",
        "name": "压箱底的泡面",
        "date": "2022-1-1",
        "buy_limit": "【来年之约】活动奖励",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202201/01/205420hukz4o8gs24ajky4.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0344",
        "url_tid": "84015",
        "name": "闪耀圣诞球",
        "date": "2021-12-13",
        "buy_limit": "【雪夜归人】系列活动奖励",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202112/13/193640g3rjdjd9k9kzord5.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0343",
        "url_tid": "83988",
        "name": "男巫之歌",
        "date": "2021-12-13",
        "buy_limit": "金币≥888，追随≥100，知识≥20",
        "price": "100金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗150金币\n【等级2】无属性▕▏升级条件：消耗150金币\n【等级3】无属性▕▏升级条件：消耗150金币\n【等级4】无属性▕▏升级条件：消耗150金币\n【等级5】无属性▕▏升级条件：消耗150金币\n【等级6】无属性▕▏升级条件：消耗150金币\n【等级7】无属性▕▏升级条件：消耗-1旅程\n【等级8】15% 回帖血液+1、发帖血液+1▕▏升级条件：消耗1灵魂\n【 Max 】50% 回帖血液+1、发帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202111/30/152021yn4gg2eyu8u8lb8y.gif", 124],
            "2": ["https://img.gamemale.com/album/202111/30/152021lqz8vgqfqss77qt1.gif", 124],
            "3": ["https://img.gamemale.com/album/202111/30/152021djx7b94b92zo9wwh.gif", 124],
            "4": ["https://img.gamemale.com/forum/202201/30/100903l97yaqan99gmgima.gif", 124],
            "5": ["https://img.gamemale.com/forum/202201/30/100905kz1ztzt8i0u18qaz.gif", 124],
            "6": ["https://img.gamemale.com/forum/202201/30/100909xrx7s5ssakj573sj.gif", 124],
            "7": ["https://img.gamemale.com/forum/202201/30/100910wnf3nzdede5j955f.gif", 124],
            "8": ["https://img.gamemale.com/album/202111/30/152022vd2dws6rrsre9z2d.gif", 124],
            "Max": ["https://img.gamemale.com/album/202111/30/152022nddshwwhdiistihc.gif", 124]
        }
    },
    {
        "type": "装备",
        "no": "0342",
        "url_tid": "83987",
        "name": "物理学圣剑",
        "date": "2021-12-13",
        "buy_limit": "无",
        "price": "188金币",
        "levels": "【 Max 】6% 回帖血液+1、发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202112/13/011356ysnjf0t8o7ezdet2.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0341",
        "url_tid": "83986",
        "name": "力量腕带",
        "date": "2021-12-13",
        "buy_limit": "无",
        "price": "125金币",
        "levels": "【 Max 】8% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202112/13/011007dmr3m7lav3ihmiz8.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0340",
        "url_tid": "83985",
        "name": "Vergil",
        "date": "2021-12-13",
        "buy_limit": "咒术≥15",
        "price": "500金币",
        "levels": "【等级1】4% 回帖血液+1、发帖血液+2▕▏升级条件：消耗150金币\n【等级2】4% 回帖血液+1、发帖咒术+2▕▏升级条件：追随≥50\n【等级3】5% 回帖咒术+1、发帖咒术+2▕▏升级条件：消耗150血液\n【等级4】6% 回帖咒术+1、发帖咒术+2▕▏升级条件：消耗88咒术\n【等级5】8% 回帖咒术+1、发帖咒术+2▕▏升级条件：咒术≥130\n【 Max 】15% 回帖血液+2、发帖咒术+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202111/30/151928k7yqq4tcctvxechh.gif", 40],
            "2": ["https://img.gamemale.com/album/202111/30/151929l3zim66nw5m5ig6i.gif", 82],
            "3": ["https://img.gamemale.com/album/202111/30/151930hra9qkvh3mqzzlrb.gif", 82],
            "4": ["https://img.gamemale.com/album/202111/30/151931jp5b56parah05jab.gif", 82],
            "5": ["https://img.gamemale.com/album/202111/30/151932wq3rttmxytmqxoqc.gif", 124],
            "Max": ["https://img.gamemale.com/album/202111/30/151933wkbara8esaaru8nf.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0339",
        "url_tid": "83984",
        "name": "Dante",
        "date": "2021-12-13",
        "buy_limit": "主题数≥5",
        "price": "666金币",
        "levels": "【等级1】4% 回帖血液+1、发帖血液+1▕▏升级条件：消耗150金币\n【等级2】6% 回帖血液+1、发帖血液+1▕▏升级条件：消耗150血液\n【等级3】8% 回帖血液+1、发帖血液+1▕▏升级条件：旅程≥50\n【等级4】10% 回帖血液+1、发帖血液+1▕▏升级条件：消耗88咒术\n【等级5】12% 回帖血液+2、发帖血液+2▕▏升级条件：血液≥666\n【等级6】15% 回帖血液+2 堕落-1、发帖血液+2▕▏升级条件：血液≥999\n【 Max 】13% 回帖金币+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202111/30/151900kvzfun3z38x3l333.gif", 40],
            "2": ["https://img.gamemale.com/album/202111/30/151901tmf6k6m6v7v7pnaj.gif", 82],
            "3": ["https://img.gamemale.com/album/202111/30/151902qhrer72cg7wvhe3c.gif", 82],
            "4": ["https://img.gamemale.com/album/202111/30/151903psl1lb33s3z14lis.gif", 82],
            "5": ["https://img.gamemale.com/album/202111/30/151905jaiftgfimt4xr95a.gif", 124],
            "6": ["https://img.gamemale.com/album/202201/08/192225hljqfk4pig4gz4or.gif", 124],
            "Max": ["https://img.gamemale.com/album/202111/30/151908h95rntntha8hnnuh.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0338",
        "url_tid": "83983",
        "name": "V (DMC5)",
        "date": "2021-12-13",
        "buy_limit": "堕落≤42",
        "price": "500金币",
        "levels": "【等级1】4% 回帖堕落-1、发帖血液+2▕▏升级条件：金币≥200\n【等级2】6% 回帖堕落-1、发帖血液+2▕▏升级条件：知识≥30\n【等级3】8% 回帖血液+1 堕落-1、发帖血液+2▕▏升级条件：消耗150金币\n【等级4】10% 回帖血液+1 堕落-1、发帖血液+2▕▏升级条件：消耗150血液\n【等级5】13% 回帖血液+1 堕落-1、发帖血液+2▕▏升级条件：消耗66咒术\n【 Max 】13% 回帖血液+2 堕落-1、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202111/30/151917opanbpgg92cpc9bc.gif", 40],
            "2": ["https://img.gamemale.com/album/202111/30/151918olbud4uj81zb6ju1.gif", 82],
            "3": ["https://img.gamemale.com/album/202111/30/151919j1lrltclo6t1vovl.gif", 82],
            "4": ["https://img.gamemale.com/forum/202307/12/132752fn32vp8om5hzoumz.gif", 82],
            "5": ["https://img.gamemale.com/album/202111/30/151920t778hpkdgho8padr.gif", 82],
            "Max": ["https://img.gamemale.com/album/202111/30/151921kfcode2q9f9qu9qc.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0337",
        "url_tid": "83981",
        "name": "Joker",
        "date": "2021-12-13",
        "buy_limit": "追随≥1",
        "price": "400金币",
        "levels": "【等级1】6% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：追随≥30\n【等级2】8% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：追随≥60\n【等级3】10% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：追随≥90\n【等级4】2% 回帖旅程+1 知识+1、发帖旅程+1 知识+1▕▏升级条件：追随≥180\n【 Max 】3% 回帖旅程+1 知识+1、发帖旅程+1 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202111/30/162244ax1axloxxsb5d5ww.gif", 40],
            "2": ["https://img.gamemale.com/album/202111/30/162245nnxx8hjxxrxxme00.gif", 82],
            "3": ["https://img.gamemale.com/album/202111/30/162245o6bqb7vxzydwyy1d.gif", 82],
            "4": ["https://img.gamemale.com/album/202111/30/162245zbnnitjmvjbbbpww.gif", 82],
            "Max": ["https://img.gamemale.com/album/202111/30/162246wirzo82vyr68392h.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0336",
        "url_tid": "82413",
        "name": "英雄联盟",
        "date": "2021-10-5",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202110/05/012258gbeee3nz6bmeedbn.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0335",
        "url_tid": "82412",
        "name": "巴基 (猎鹰与冬兵)",
        "date": "2021-10-5",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】4% 回帖血液+1、发帖血液+1▕▏升级条件：消耗100血液\n【等级2】6% 回帖血液+1、发帖血液+1▕▏升级条件：消耗200血液\n【等级3】8% 回帖血液+2、发帖血液+2▕▏升级条件：消耗400血液\n【 Max 】12% 回帖血液+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202110/03/194238q1641b46ur4d1x6s.gif", 40],
            "2": ["https://img.gamemale.com/album/202110/03/194239v9tu364l3t1ayayl.gif", 82],
            "3": ["https://img.gamemale.com/album/202110/03/194241of5p45znfa3atwpv.gif", 124],
            "Max": ["https://img.gamemale.com/album/202110/03/194242avrvgbcvcygc6rhh.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0334",
        "url_tid": "82411",
        "name": "卡洛斯·奥利维拉",
        "date": "2021-10-5",
        "buy_limit": "追随≥10",
        "price": "600金币",
        "levels": "【等级1】4% 回帖金币+1▕▏升级条件：消耗200血液\n【等级2】4% 回帖咒术+1▕▏升级条件：知识≥20\n【等级3】6% 回帖金币+1 咒术+1▕▏升级条件：消耗500金币\n【等级4】8% 回帖金币+1 咒术+1、发帖旅程+1▕▏升级条件：知识≥100\n【 Max 】10% 回帖金币+2 咒术+1 血液-1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/11/192845gwwk03k0gcc9haew.gif", 40],
            "2": ["https://img.gamemale.com/album/202106/11/192845kpeqeybi8n64unqp.gif", 82],
            "3": ["https://img.gamemale.com/album/202106/11/192846rrbqblrmojhrrbhe.gif", 82],
            "4": ["https://img.gamemale.com/album/202106/11/192846w8amf4t8o1a1nt0o.gif", 124],
            "Max": ["https://img.gamemale.com/album/202106/11/192847gwbfnegfyewvsyiu.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0333",
        "url_tid": "82410",
        "name": "格拉迪欧拉斯",
        "date": "2021-10-5",
        "buy_limit": "血液≥100",
        "price": "450金币",
        "levels": "【等级1】2% 回帖血液+1▕▏升级条件：消耗80金币\n【等级2】4% 回帖血液+1▕▏升级条件：追随≥50\n【等级3】8% 回帖血液+1、发帖血液+1▕▏升级条件：消耗120金币\n【等级4】11% 回帖血液+2、发帖血液+2▕▏升级条件：消耗330金币\n【 Max 】14% 回帖血液+2、发帖知识+1 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/11/192835q1e7b6bccoce7m5c.gif", 40],
            "2": ["https://img.gamemale.com/album/202106/11/192835cwflsbslooebwrv7.gif", 82],
            "3": ["https://img.gamemale.com/album/202106/11/192836alehglnvuuyg1i16.gif", 82],
            "4": ["https://img.gamemale.com/album/202106/11/192835ibe0n404nvn4ngqu.gif", 82],
            "Max": ["https://img.gamemale.com/album/202106/11/192836piqppwj2qz8jw5xq.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0332",
        "url_tid": "82409",
        "name": "炙热的格拉迪欧拉斯",
        "date": "2021-10-5",
        "buy_limit": "主题数≥15",
        "price": "666金币",
        "levels": "【等级1】25% 回帖血液+2▕▏升级条件：咒术≥66\n【 Max 】50% 回帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/11/192858c3gf3rz3f13ypwys.gif", 82],
            "Max": ["https://img.gamemale.com/album/202106/11/192859lfaag0a7eokkpkse.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0331",
        "url_tid": "82408",
        "name": "小小行星",
        "date": "2021-10-5",
        "buy_limit": "月面的时空之旅【Magic Sweet】活动中存活至最后",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202110/05/005147qt373447q88747d6.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0330",
        "url_tid": "81124",
        "name": "缘定仙桥",
        "date": "2021-8-14",
        "buy_limit": "【情深所见】七夕系列活动奖励",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202108/15/231013e3fdddei4didk78e.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0329",
        "url_tid": "81123",
        "name": "GM村蛋糕",
        "date": "2021-8-14",
        "buy_limit": "<a href=\"/thread-80460-1-1.html\" target=\"_blank\">符合发放条件的用户（点击跳转）</a>",
        "price": "无",
        "duration": "1天",
        "levels": "【 Max 】30% 回帖金币+1 血液+1",
        "special_note": ["兔兔只按大家站内资料填写的出生日期的月日来给大家制作蛋糕哦", "所以记得把站内资料填写完整并且公开"],
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202107/19/221939iuudd2nzuzrum3nu.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0328",
        "url_tid": "81121",
        "name": "大古",
        "date": "2021-8-14",
        "buy_limit": "主题数≥20",
        "price": "300金币",
        "levels": "【等级1】2% 回帖金币+1 血液+1▕▏升级条件：血液≥100\n【等级2】4% 回帖金币+1 血液+1▕▏升级条件：消耗100血液\n【等级3】6% 回帖金币+1 血液+1▕▏升级条件：堕落≥50\n【等级4】8% 回帖血液+1 堕落+1▕▏升级条件：消耗200血液\n【等级5】10% 回帖金币+1 血液+1▕▏升级条件：血液≥666\n【 Max 】12% 回帖金币+1 血液+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/11/192808ens3apntt5gsy3qq.gif", 40],
            "2": ["https://img.gamemale.com/album/202106/11/192807tqxuw0djvclwwelw.gif", 82],
            "3": ["https://img.gamemale.com/album/202106/11/192809el2m5l3rln9m3ri5.gif", 82],
            "4": ["https://img.gamemale.com/album/202106/11/192808kydxuk0wwwoo0od4.gif", 82],
            "5": ["https://img.gamemale.com/album/202106/11/192809rr5duzb5u6q5uqu5.gif", 82],
            "Max": ["https://img.gamemale.com/album/202106/11/192809xlpd52bf3eilile1.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0327",
        "url_tid": "81120",
        "name": "泰比里厄斯",
        "date": "2021-8-14",
        "buy_limit": "咒术≥35",
        "price": "555金币",
        "levels": "【等级1】5% 回帖血液+1、发帖咒术+1▕▏升级条件：消耗355金币\n【等级2】10% 回帖金币+1、发帖咒术+1▕▏升级条件：消耗255血液\n【等级3】12% 回帖血液+1、发帖咒术+1▕▏升级条件：咒术≥155\n【 Max 】15% 回帖血液+2、发帖旅程+1 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/11/192919ttc8xt7y5jjtxmim.gif", 40],
            "2": ["https://img.gamemale.com/album/202106/11/192919necmklebcd9dw9qq.gif", 82],
            "3": ["https://img.gamemale.com/album/202106/11/192919ma98v49w82u848j8.gif", 82],
            "Max": ["https://img.gamemale.com/album/202106/11/192919a3foswsvhbwe6j5e.gif", 124]
        }
    },
    {
        "type": "女从",
        "no": "0326",
        "url_tid": "81119",
        "name": "绯红女巫",
        "date": "2021-8-14",
        "buy_limit": "堕落≥10",
        "price": "400金币",
        "levels": "【等级1】2% 回帖堕落+1、发帖咒术+1▕▏升级条件：消耗100血液\n【等级2】4% 回帖堕落+1、发帖咒术+1▕▏升级条件：堕落≥33\n【等级3】4% 回帖堕落+1 金币+1、发帖咒术+2▕▏升级条件：消耗66咒术\n【等级4】6% 回帖堕落+1 金币+1、发帖咒术+2▕▏升级条件：堕落≥88\n【等级5】8% 回帖堕落+1 金币+2、发帖咒术+2▕▏升级条件：知识≥88\n【 Max 】10% 回帖堕落+1 金币+2、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202303/01/144153dffbgfbwang0fgww.gif", 40],
            "2": ["https://img.gamemale.com/album/202303/01/144154l6g7hn2a7znvfn5r.gif", 82],
            "3": ["https://img.gamemale.com/album/202303/01/144155mm16iymicfszauay.gif", 82],
            "4": ["https://img.gamemale.com/album/202303/01/144155of2nddzxe5dfmxhd.gif", 82],
            "5": ["https://img.gamemale.com/album/202303/01/144156jpjj9oh3shop2v4g.gif", 82],
            "Max": ["https://img.gamemale.com/album/202303/01/144153vsz59ggssug9295k.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0325",
        "url_tid": "81117",
        "name": "索尔·奥丁森",
        "date": "2021-8-14",
        "buy_limit": "知识≥5",
        "price": "500金币",
        "levels": "【等级1】2% 回帖咒术+1、发帖旅程+1▕▏升级条件：消耗88金币\n【等级2】3% 回帖咒术+1 金币+1、发帖旅程+1▕▏升级条件：消耗88血液\n【等级3】4% 回帖咒术+1 金币+1、发帖旅程+1▕▏升级条件：消耗120金币\n【等级4】5% 回帖咒术+1 金币+2、发帖旅程+1▕▏升级条件：消耗66咒术\n【等级5】6% 回帖咒术+1 金币+2、发帖旅程+1▕▏升级条件：消耗188金币\n【等级6】7% 回帖咒术+1 金币+3、发帖旅程+1▕▏升级条件：旅程≥88\n【 Max 】8% 回帖咒术+1 金币+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/11/192910fz1ps1wsdb3x1dpk.gif", 40],
            "2": ["https://img.gamemale.com/album/202106/11/192911pucsks7fa7ist7tk.gif", 82],
            "3": ["https://img.gamemale.com/album/202106/11/192910n8g3y7m4d4g3czj5.gif", 82],
            "4": ["https://img.gamemale.com/album/202106/11/192910gbvpzs50zs8tuwpz.gif", 82],
            "5": ["https://img.gamemale.com/album/202106/11/192911bs4h48dvph3z4vuu.gif", 82],
            "6": ["https://img.gamemale.com/album/202106/11/192911fllt3ndiiiyl9lg4.gif", 82],
            "Max": ["https://img.gamemale.com/album/202106/11/192911r5645j5ztf45jxxz.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0324",
        "url_tid": "80304",
        "name": "波板糖",
        "date": "2021-7-13",
        "buy_limit": "妖精的迷城篇【Magic Sweet】活动冠军奖励",
        "price": "无",
        "levels": "【等级1】1% 发帖咒术+1【等级2】1% 回帖血液-1 咒术+1、发帖咒术+1【 Max 】1% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202107/11/001807opwxh7u5n5222s79.gif", 40],
            "2": ["https://img.gamemale.com/album/202107/11/001807p4nm7gt6ygga57ma.gif", 40],
            "Max": ["https://img.gamemale.com/album/202107/11/001807l6y6fspz02a6dkfy.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0323",
        "url_tid": "80303",
        "name": "魔法灵药",
        "date": "2021-7-13",
        "buy_limit": "妖精的迷城篇【Magic Sweet】活动中生存到最后",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202107/13/213642j86vz626d2av51o1.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0322",
        "url_tid": "79525",
        "name": "云上之光",
        "date": "2021-6-14",
        "buy_limit": "【八周年】活动期间完成指定任务奖励",
        "price": "无",
        "levels": "【 Max 】4% 回帖血液+1 金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202106/14/220020z2n8ih8qi9hkkes9.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0321",
        "url_tid": "79459",
        "name": "林中之蛋",
        "date": "2021-6-14",
        "buy_limit": "旅程≥35",
        "price": "275金币",
        "levels": "【等级1】6% 回帖金币+1 血液+1▕▏升级条件：消耗213血液\n【 Max 】12% 回帖金币+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/12/193544i2z7dicpd9luaia4.gif", 40],
            "Max": ["https://img.gamemale.com/album/202106/12/193544i424grt2dx4ty1c7.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0320",
        "url_tid": "79458",
        "name": "超级无敌名贵金卡",
        "date": "2021-6-14",
        "buy_limit": "无",
        "price": "688金币",
        "levels": "【 Max 】100% 回帖金币+0",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202106/14/011355w7cchpyh9chy0xxe.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0319",
        "url_tid": "79457",
        "name": "武士之魂",
        "date": "2021-6-14",
        "buy_limit": "知识≥30",
        "price": "999金币",
        "levels": "【等级1】10% 回帖血液+1、发帖血液+2▕▏升级条件：知识≥50\n【等级2】12% 回帖血液+2、发帖血液+3▕▏升级条件：消耗130血液\n【等级3】15% 回帖血液+2 金币+1、发帖旅程+1▕▏升级条件：消耗1灵魂\n【 Max 】2% 回帖金币+1 血液+3 旅程+1 知识+1 、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/11/192931sd0d8szcy26ok0sm.gif", 82],
            "2": ["https://img.gamemale.com/album/202106/11/192931nzv3xxthk6kucnpt.gif", 82],
            "3": ["https://img.gamemale.com/album/202106/11/192931mnv296weukv6bv6v.gif", 82],
            "Max": ["https://img.gamemale.com/album/202106/11/192931k1juobk53jz1pt88.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0318",
        "url_tid": "79456",
        "name": "Chris Mazdzer",
        "date": "2021-6-14",
        "buy_limit": "主题数≥5",
        "price": "300金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：消耗150金币\n【等级2】7% 回帖血液+2▕▏升级条件：消耗200金币\n【 Max 】10% 回帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/11/192755poo3o3lktbet3vu3.gif", 40],
            "2": ["https://img.gamemale.com/album/202106/11/192756at7tvvn7ex1d12ql.gif", 40],
            "Max": ["https://img.gamemale.com/album/202106/11/192756vhe5n0ppeu0ahf09.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0317",
        "url_tid": "79454",
        "name": "艾吉奥",
        "date": "2021-6-14",
        "buy_limit": "旅程≥15",
        "price": "500金币",
        "levels": "【等级1】4% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：消耗200金币\n【等级2】6% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：消耗200血液\n【等级3】8% 回帖金币+2 血液+1、发帖金币+2 血液+1▕▏升级条件：消耗50咒术\n【等级4】3% 回帖金币+1 旅程+1 血液+1、发帖金币+1 旅程+1 血液+1▕▏升级条件：知识≥50\n【等级5】4% 回帖金币+2 旅程+1 血液+1、发帖金币+2 旅程+1 血液+1▕▏升级条件：知识≥120\n【 Max 】4% 回帖金币+3 旅程+1 血液+1、发帖金币+3 旅程+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202104/29/205131brjl9gdmf9r9og28.gif", 40],
            "2": ["https://img.gamemale.com/album/202104/29/195037qgzjgvz5czhs1vn1.gif", 82],
            "3": ["https://img.gamemale.com/album/202104/29/195038b78azy9fnnhkunnr.gif", 82],
            "4": ["https://img.gamemale.com/album/202104/29/195038yaaao17y1lz6ubqt.gif", 82],
            "5": ["https://img.gamemale.com/album/202104/29/195038iqpgleezwve1lvz1.gif", 82],
            "Max": ["https://img.gamemale.com/album/202104/29/195039f372n11766697abh.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0316",
        "url_tid": "79453",
        "name": "加勒特·霍克",
        "date": "2021-6-14",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】4% 回帖金币+1、发帖金币+2▕▏升级条件：消耗150金币\n【等级2】6% 回帖金币+1、发帖金币+3▕▏升级条件：消耗200血液\n【等级3】8% 回帖金币+1 血液+1、发帖金币+3▕▏升级条件：追随≥100\n【 Max 】10% 回帖金币+1 血液+1、发帖旅程+1 金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202106/14/230458pm917hqp7z70qeqh.gif", 40],
            "2": ["https://img.gamemale.com/album/202104/29/203510d889pdfdvf7t7r8f.gif", 40],
            "3": ["https://img.gamemale.com/album/202106/14/230458eqfsbsmbbniqoz2b.gif", 82],
            "Max": ["https://img.gamemale.com/album/202106/14/230623vdqbqici9sr8r7fs.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0315",
        "url_tid": "79451",
        "name": "托尼·史塔克",
        "date": "2021-6-14",
        "buy_limit": "旅程≥20",
        "price": "650金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗50血液\n【等级2】6% 回帖血液+2、发帖血液+2▕▏升级条件：消耗100金币\n【等级3】7% 回帖血液+2、发帖血液+3▕▏升级条件：旅程≥40\n【等级4】8% 回帖血液+2、发帖知识+1▕▏升级条件：消耗150金币\n【等级5】9% 回帖血液+2、发帖知识+1▕▏升级条件：知识≥20\n【等级6】10% 回帖血液+2、发帖知识+1 血液+1▕▏升级条件：消耗200金币\n【等级7】11% 回帖血液+3 金币-1、发帖知识+1 血液+2▕▏升级条件：消耗200血液\n【等级8】12% 回帖血液+3 金币-1、发帖知识+1 血液+3▕▏升级条件：知识≥50\n【等级9】15% 发帖知识+1 血液+5▕▏升级条件：消耗999血液\n【 Max 】6% 回帖知识+1 血液+3、发帖知识+1 血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202103/13/150447bfaajyw5f3j3j2f2.gif", 40],
            "2": ["https://img.gamemale.com/album/202103/13/150443zcisi45n4bziu0ll.gif", 40],
            "3": ["https://img.gamemale.com/forum/202102/11/174545wumvuhxj4ixmpvhu.gif", 82],
            "4": ["https://img.gamemale.com/album/202103/16/113938ebl2g8f2v6qwbr8l.gif", 82],
            "5": ["https://img.gamemale.com/album/202103/16/113937yewee9gls94bsz40.gif", 82],
            "6": ["https://img.gamemale.com/album/202103/13/150636jd9lhf2ff9vvbevb.gif", 82],
            "7": ["https://img.gamemale.com/album/202103/13/150633szdzaao15t1xofno.gif", 82],
            "8": ["https://img.gamemale.com/forum/202102/11/174546u1166fpp3630w1g6.gif", 82],
            "9": ["https://img.gamemale.com/album/202103/13/150646vy1e4n0o0e7tl3bc.gif", 82],
            "Max": ["https://img.gamemale.com/album/202103/13/150644oy6ukbjtu8kbohuy.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0314",
        "url_tid": "78711",
        "name": "枯黄的种苗",
        "date": "2021-5-8",
        "buy_limit": "【劳农时月】活动期间完成指定任务",
        "price": "无",
        "levels": "【等级1】2% 回帖金币+1、发帖血液+1 ▕▏升级条件：消耗10堕落\n【 Max 】2% 回帖血液+1 堕落-1、发帖血液+1 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202104/29/203515cl88yqq0egg55xqp.gif", 40],
            "Max": ["https://img.gamemale.com/album/202104/29/203515vc6makaagrha6rga.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0313",
        "url_tid": "78154",
        "name": "士官长",
        "date": "2021-4-7",
        "buy_limit": "旅程≥10",
        "price": "450金币",
        "levels": "【等级1】6% 回帖金币+1、发帖旅程+1▕▏升级条件：消耗200血液\n【等级2】8% 回帖金币+2 血液-1、发帖旅程+1▕▏升级条件：旅程≥50\n【 Max 】11% 回帖血液+3 金币-1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202103/13/150429xqfi6ew0fz4aaef6.gif", 40],
            "2": ["https://img.gamemale.com/album/202103/13/150436oncbsaxl2bssab43.gif", 82],
            "Max": ["https://img.gamemale.com/album/202103/13/150441ouvh4quqqgq0r4h7.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0312",
        "url_tid": "78153",
        "name": "克苏鲁",
        "date": "2021-4-7",
        "buy_limit": "堕落≥15",
        "price": "666金币",
        "levels": "【等级1】4% 回帖堕落+1、发帖堕落+1▕▏升级条件：堕落≥33\n【等级2】6% 回帖堕落+1、发帖知识+1▕▏升级条件：消耗666血液\n【等级3】8% 回帖堕落+2、发帖知识+1 堕落+1 ▕▏升级条件：知识≥33\n【等级4】10% 回帖堕落+1 血液+1、发帖知识+1 堕落+2▕▏升级条件：消耗1灵魂\n【 Max 】33% 回帖堕落+1 血液+1、发帖堕落+2 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202102/15/181437myoz5hv7qhm1c3v1.gif", 82],
            "2": ["https://img.gamemale.com/forum/202102/15/181437zm32llokfx73ppqr.gif", 82],
            "3": ["https://img.gamemale.com/forum/202102/15/181437na6xdxsh06rtzfaq.gif", 82],
            "4": ["https://img.gamemale.com/album/202103/13/145555fe6uav6eyvs92kvh.gif", 82],
            "Max": ["https://img.gamemale.com/album/202103/13/145548karafmsnrlfnfjnn.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0311",
        "url_tid": "78152",
        "name": "金刚狼",
        "date": "2021-4-7",
        "buy_limit": "在线时间≥240",
        "price": "400金币",
        "levels": "【等级1】5% 回帖堕落+1▕▏升级条件：堕落≥10\n【等级2】5% 回帖金币+1 血液+1▕▏升级条件：金币≥500\n【等级3】8% 回帖金币+1 血液+1▕▏升级条件：血液≥500\n【 Max 】10% 回帖金币+1 血液+1 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202103/16/113005qo07ox6nsvz17vin.gif", 40],
            "2": ["https://img.gamemale.com/album/202103/13/145217whpbaspuoszmqa89.gif", 82],
            "3": ["https://img.gamemale.com/album/202103/13/145458c96oezoomzomk2m1.gif", 124],
            "Max": ["https://img.gamemale.com/album/202103/13/145459ebg982wg7fyv0av2.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0310",
        "url_tid": "78151",
        "name": "老旧的书籍",
        "date": "2021-4-7",
        "buy_limit": "【疑光重梦】活动期间拥有并展示勋章【大脑收容筒】同时完成指定任务",
        "price": "无",
        "levels": "【等级1】2% 回帖血液+1▕▏升级条件：消耗5咒术\n【 Max 】5% 发帖血液+1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202104/07/213028f141age1c1zlzchz.gif", 40],
            "Max": ["https://img.gamemale.com/forum/202104/07/213029ye3avhq3eheephe3.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0309",
        "url_tid": "77166",
        "name": "恶魔城",
        "date": "2021-2-11",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202102/11/155126z4x4cgji4c5pc4zv.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0308",
        "url_tid": "77165",
        "name": "沙漠羽蛋",
        "date": "2021-2-11",
        "buy_limit": "旅程≥25",
        "price": "250金币",
        "levels": "【等级1】5% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗173金币\n【 Max 】10% 回帖血液+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/17/201039nkzrsg6qm1u6icqp.gif", 40],
            "Max": ["https://img.gamemale.com/album/202012/17/201039iuxf76n57n9iz7sn.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0307",
        "url_tid": "77164",
        "name": "幽光彩蛋",
        "date": "2021-2-11",
        "buy_limit": "知识≥22",
        "price": "300金币",
        "levels": "【等级1】5% 回帖血液+1、发帖咒术+1▕▏升级条件：消耗25咒术\n【等级2】8% 回帖血液+2、发帖咒术+1▕▏升级条件：旅程≥77\n【 Max 】14% 回帖血液+2、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/17/201101rmmmmbyygsc8rcmm.gif", 40],
            "2": ["https://img.gamemale.com/album/202012/17/201101lcnvskqkqiilnide.gif", 40],
            "Max": ["https://img.gamemale.com/album/202012/17/201102ftzmlu4jmkcsy49z.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0306",
        "url_tid": "77163",
        "name": "羽毛笔",
        "date": "2021-2-11",
        "buy_limit": "知识≥5",
        "price": "280金币",
        "levels": "【等级1】1% 回帖旅程+1 血液+1▕▏升级条件：消耗33血液\n【等级2】2% 回帖旅程+1 血液+1▕▏升级条件：消耗66血液\n【等级3】3% 回帖旅程+1 血液+1▕▏升级条件：消耗99血液\n【 Max 】4% 回帖旅程+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202102/09/093558b88k3sp23402q2k8.gif", 40],
            "2": ["https://img.gamemale.com/album/202102/09/093558rt272wu7wmvkmt5c.gif", 40],
            "3": ["https://img.gamemale.com/album/202102/09/093558nk9cba0kkcc8cqpp.gif", 40],
            "Max": ["https://img.gamemale.com/album/202102/09/093559dyxaqhv73np7nqph.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0305",
        "url_tid": "77162",
        "name": "冒险用宝箱",
        "date": "2021-2-11",
        "buy_limit": "无",
        "price": "200金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：旅程≥25\n【等级2】5% 回帖血液+1、发帖旅程+1▕▏升级条件：消耗15咒术\n【 Max 】10% 回帖血液+1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202102/09/095347taa34iwsrsacnfj8.gif", 40],
            "2": ["https://img.gamemale.com/album/202102/09/093538tj29vsi3ajat7sz7.gif", 40],
            "Max": ["https://img.gamemale.com/album/202102/09/093539wiw4o8fta4m98hzy.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0304",
        "url_tid": "77161",
        "name": "琉璃玉坠",
        "date": "2021-2-11",
        "buy_limit": "无",
        "price": "180金币",
        "levels": "【等级1】7% 回帖金币+1▕▏升级条件：消耗88血液\n【 Max 】7% 回帖血液+1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202102/09/093529pn4nhh36hjeccq3o.gif", 40],
            "Max": ["https://img.gamemale.com/album/202102/09/093530k7fjko007qmnsfwh.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0303",
        "url_tid": "77160",
        "name": "幻象",
        "date": "2021-2-11",
        "buy_limit": "无",
        "price": "350金币",
        "levels": "【等级1】3% 回帖金币+1、发帖金币+1▕▏升级条件：追随≥40\n【等级2】6% 回帖金币+1、发帖金币+2▕▏升级条件：知识≥40\n【等级3】8% 回帖金币+2、发帖金币+2▕▏升级条件：消耗200金币\n【 Max 】10% 回帖金币+2、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202102/09/091736ghwajftgtbovt73g.gif", 40],
            "2": ["https://img.gamemale.com/album/202102/09/091736yhngp3nl29pppmzq.gif", 40],
            "3": ["https://img.gamemale.com/album/202102/09/091738qhk4chh5g96gkuds.gif", 82],
            "Max": ["https://img.gamemale.com/album/202102/09/091739youoo0j6lvlt22ai.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0302",
        "url_tid": "77159",
        "name": "三角头",
        "date": "2021-2-11",
        "buy_limit": "追随≥20",
        "price": "450金币",
        "levels": "【等级1】6% 回帖血液+1、发帖堕落+1▕▏升级条件：主题数≥20\n【等级2】8% 回帖血液+2、发帖堕落+1▕▏升级条件：堕落≥50\n【 Max 】11% 回帖血液+2、发帖堕落+1 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202102/09/091726ecy2ym6vacri2gur.gif", 40],
            "2": ["https://img.gamemale.com/album/202102/09/091727g4ka33kd4t3j3ll3.gif", 82],
            "Max": ["https://img.gamemale.com/album/202102/09/091727m3qg862qxwgqwwcq.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0301",
        "url_tid": "77158",
        "name": "汉克/Hank",
        "date": "2021-2-11",
        "buy_limit": "主题数≥5",
        "price": "500金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：知识≥20\n【等级2】7% 回帖血液+1、发帖血液+1▕▏升级条件：追随≥40\n【等级3】9% 回帖血液+1、发帖血液+2▕▏升级条件：旅程≥60\n【等级4】11% 回帖血液+1、发帖血液+3▕▏升级条件：消耗500血液\n【等级5】13% 回帖血液+1、发帖旅程+1▕▏升级条件：消耗500金币\n【 Max 】25% 回帖血液+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/17/200959l080lp10gdeyvvgw.gif", 40],
            "2": ["https://img.gamemale.com/forum/202103/08/004348f2smvbmmbc6oubrb.gif", 82],
            "3": ["https://img.gamemale.com/forum/202103/08/004351aczawf7n7enafe5w.gif", 82],
            "4": ["https://img.gamemale.com/album/202012/17/201007wtnahz27t79t27a7.gif", 82],
            "5": ["https://img.gamemale.com/album/202012/17/201008j4537od8l03hmswr.gif", 82],
            "Max": ["https://img.gamemale.com/album/202012/17/201010d7pqktgqxqqrzett.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0300",
        "url_tid": "76565",
        "name": "神秘的礼物",
        "date": "2020-12-24",
        "buy_limit": "【影惑阴霾】活动期间完成指定任务",
        "price": "无",
        "levels": "【等级1】1% 回帖金币+1、发帖金币+1▕▏升级条件：消耗12血液\n【等级2】2% 回帖金币+1、发帖金币+1▕▏升级条件：消耗12金币\n【 Max 】3% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/19/150815azr0mm03ypi3zxyg.gif", 40],
            "2": ["https://img.gamemale.com/album/202012/19/150815srao3th2zndq2nu2.gif", 40],
            "Max": ["https://img.gamemale.com/album/202012/19/150815cd30dlm9a3d6jmp2.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0299",
        "url_tid": "76564",
        "name": "赛博朋克2077",
        "date": "2020-12-24",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202012/24/195047fhxo848u27vzxqru.gif", 124]
        }
    },
    {
        "type": "天赋",
        "no": "0298",
        "url_tid": "76563",
        "name": "风雪之家",
        "date": "2020-12-24",
        "buy_limit": "注册天数≥365，追随≥50",
        "price": "无",
        "levels": "【 Max 】1% 回帖血液+5 金币+5、发帖灵魂+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202012/24/195611r1zeue2ee8wcz68u.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0297",
        "url_tid": "76562",
        "name": "万圣彩蛋",
        "date": "2020-12-24",
        "buy_limit": "追随≥35",
        "price": "310金币",
        "levels": "【等级1】6% 回帖金币+2、发帖金币+2▕▏升级条件：消耗33咒术\n【 Max 】12% 回帖金币+2、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/06/161531trqiireccyazvejn.gif", 40],
            "Max": ["https://img.gamemale.com/album/202012/06/161536ti15txzxg80ko59y.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0296",
        "url_tid": "76561",
        "name": "螺旋纹卵",
        "date": "2020-12-24",
        "buy_limit": "旅程≥33",
        "price": "270金币",
        "levels": "【等级1】5% 回帖堕落+1 金币+1▕▏升级条件：消耗188血液\n【 Max 】11% 回帖堕落+1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/17/201031hi4bx04vngl4b22x.gif", 40],
            "Max": ["https://img.gamemale.com/album/202012/17/201031xsvslzy1ib414zk4.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0295",
        "url_tid": "76560",
        "name": "社畜专用闹钟",
        "date": "2020-12-24",
        "buy_limit": "无",
        "price": "150金币",
        "levels": "【等级1】20% 回帖金币+1 血液-1▕▏升级条件：金币>996\n【 Max 】20% 回帖金币-1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/17/200945ow3wdwmm25zvr022.gif", 40],
            "Max": ["https://img.gamemale.com/album/202012/17/200945wywvyivu00qlsugl.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0294",
        "url_tid": "76559",
        "name": "GM論壇初心者勛章",
        "date": "2020-12-24",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【等级1】15% 回帖金币+1 血液+1、发帖金币+3 血液+3▕▏升级条件：在线时间≥72\n【等级2】12% 回帖金币+1 血液+1、发帖金币+3 血液+3▕▏升级条件：在线时间≥150\n【等级3】8% 回帖金币+1 血液+1、发帖金币+3 血液+3▕▏升级条件：在线时间≥280\n【等级4】5% 回帖金币+1 血液+1、发帖金币+3 血液+3▕▏升级条件：在线时间≥560\n【 Max 】2% 回帖金币+1 血液+1、发帖金币+5 血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202009/19/001839hluuahzsf8g32aau.gif", 40],
            "2": ["https://img.gamemale.com/album/202009/19/001841iyii41izo7o112a2.gif", 40],
            "3": ["https://img.gamemale.com/album/202009/19/001846k88tvpth9jus9yzu.gif", 40],
            "4": ["https://img.gamemale.com/album/202009/19/001848q8qhul8qumemf48n.gif", 40],
            "Max": ["https://img.gamemale.com/album/202009/19/001905w2mh2725z4sj3226.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0293",
        "url_tid": "76558",
        "name": "Scott Ryder",
        "date": "2020-12-24",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】4% 回帖金币+2▕▏升级条件：消耗80血液\n【等级2】4% 回帖金币+2、发帖旅程+1▕▏升级条件：追随≥40\n【等级3】6% 回帖金币+2、发帖旅程+1▕▏升级条件：消耗120金币\n【 Max 】8% 回帖金币+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/17/200506p2yujjeygn9sem8c.gif", 40],
            "2": ["https://img.gamemale.com/album/202012/17/200508pbmmlg91gg0ybq9y.gif", 82],
            "3": ["https://img.gamemale.com/album/202012/17/200509pdruudbgrdd8f5ru.gif", 82],
            "Max": ["https://img.gamemale.com/album/202012/24/010127t64uwtv4bbt696ej.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0292",
        "url_tid": "76557",
        "name": "鬼王酒吞童子",
        "date": "2020-12-24",
        "buy_limit": "在线时间≥100",
        "price": "300金币",
        "levels": "【等级1】4% 回帖血液+1▕▏升级条件：消耗50金币\n【等级2】勋章博物馆资料暂缺\n【等级3】8% 回帖血液+1、发帖堕落+1▕▏升级条件：堕落≥50\n【 Max 】10% 回帖血液+1、发帖堕落+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/06/123041sgugi00i0ab3f1ii.gif", 40],
            "2": ["", 40],
            "3": ["https://img.gamemale.com/album/202012/06/123044spkppqn25n55inzl.gif", 82],
            "Max": ["https://img.gamemale.com/album/202012/04/130019jwbo3zwl04izetdb.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0291",
        "url_tid": "76556",
        "name": "阿尔伯特·威斯克",
        "date": "2020-12-24",
        "buy_limit": "知识≥10",
        "price": "400金币",
        "levels": "【等级1】3% 回帖血液+1、发帖血液+1▕▏升级条件：消耗100金币\n【等级2】5% 回帖血液+1、发帖血液+1▕▏升级条件：堕落≥30\n【等级3】8% 回帖血液+1、发帖血液+2▕▏升级条件：知识≥50\n【等级4】10% 回帖血液+1、发帖知识+1▕▏升级条件：知识≥100\n【 Max 】13% 回帖血液+2、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202012/04/130038w45fff6yc556sxcz.gif", 40],
            "2": ["https://img.gamemale.com/album/202012/04/130038p5j88h565zyyzjn0.gif", 40],
            "3": ["https://img.gamemale.com/album/202012/04/130039qho53u656qxf5qwf.gif", 82],
            "4": ["https://img.gamemale.com/album/202012/04/130045t9g7ng8unl6mml1s.gif", 82],
            "Max": ["https://img.gamemale.com/album/202012/04/130059iadfthdarahhz2dy.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0294",
        "url_tid": "76097",
        "name": "超人",
        "date": "2020-11-11",
        "buy_limit": "堕落<500",
        "price": "450金币",
        "levels": "【等级1】4% 回帖金币+1、堕落-1、发帖血液+1▕▏升级条件：血液≥200\n【等级2】6% 回帖金币+1、堕落-1、发帖血液+1▕▏升级条件：血液≥400\n【等级3】8% 回帖金币+2、发帖血液+2▕▏升级条件：血液≥600\n【 Max 】10% 回帖金币+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202011/10/234117x67cbtst7cwft7b3.gif", 40],
            "2": ["https://img.gamemale.com/album/202011/10/234118cwuicwwlvcuhh0ph.gif", 40],
            "3": ["https://img.gamemale.com/album/202011/10/235613prw6ojwzlsmrjlrj.gif", 82],
            "Max": ["https://img.gamemale.com/album/202011/10/235617fsoio1ljlolsihwo.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0293",
        "url_tid": "76096",
        "name": "汤姆·赫兰德",
        "date": "2020-11-11",
        "buy_limit": "知识≥5",
        "price": "450金币",
        "levels": "【等级1】4% 回帖血液+1▕▏升级条件：消耗50金币\n【等级2】8% 回帖血液+1、发帖知识+1▕▏升级条件：知识≥20\n【等级3】10% 回帖血液+1、发帖知识+1▕▏升级条件：旅程≥50\n【 Max 】12% 回帖血液+1、发帖知识+1",
        "levels_img": {
            "1": ["", 40],
            "2": ["https://img.gamemale.com/album/202011/10/183320imbqtp5qqprq82rg.gif", 40],
            "3": ["https://img.gamemale.com/forum/202307/11/193123gjs63rwjpr3s4zs1.gif", 82],
            "Max": ["https://img.gamemale.com/album/202011/10/183326pzlfkfxkfxtrrkp0.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0292",
        "url_tid": "76095",
        "name": "丹·安博尔",
        "date": "2020-11-11",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】3% 回帖血液+1、发帖血液+2▕▏升级条件：追随≥10\n【等级2】4% 回帖金币+1 血液+1、发帖金币+1 血液+2▕▏升级条件：追随≥50\n【等级3】5% 回帖金币+1 血液+1、发帖金币+2 血液+2▕▏升级条件：消耗260血液\n【 Max 】6% 回帖金币+1 血液+2、发帖金币+2 血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202009/19/001918g1icicc716ljcbiu.gif", 40],
            "2": ["https://img.gamemale.com/album/202009/19/001943y5jk5v49j5lilimm.gif", 82],
            "3": ["https://img.gamemale.com/album/202009/19/001959kjfnsdlno9fdod6g.gif", 82],
            "Max": ["https://img.gamemale.com/album/202009/19/002321w0hvrmrgkgeqhqee.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0291",
        "url_tid": "76083",
        "name": "万圣南瓜",
        "date": "2020-11-10",
        "buy_limit": "BR活动特别篇Hide and seek优胜奖",
        "price": "无",
        "levels": "【等级1】2% 回帖血液+2▕▏升级条件：消耗1旅程\n【 Max 】2% 回帖血液+2 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202011/10/150719v2on9l1j0ssd9omd.gif", 40],
            "Max": ["https://img.gamemale.com/forum/202011/10/162602ee8gfxv9ddxcveo9.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0290",
        "url_tid": "76082",
        "name": "猫猫幽灵",
        "date": "2020-11-10",
        "buy_limit": "BR活动特别篇Hide and seek参与奖",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202011/05/201016z43pk59hrrgy09nd.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0289",
        "url_tid": "75757",
        "name": "掌中雪球瓶",
        "date": "2020-10-16",
        "buy_limit": "【霜降物语】活动期间完成指定任务",
        "price": "无",
        "levels": "【 Max 】3% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202010/24/152831wj68oorq888rgw06.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0288",
        "url_tid": "75756",
        "name": "最终幻想XIV",
        "date": "2020-10-16",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/202008/03/121236yhdfd7t4tffvucva.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0287",
        "url_tid": "75755",
        "name": "GHOST",
        "date": "2020-10-16",
        "buy_limit": "堕落≥10",
        "price": "200金币",
        "levels": "【等级1】1% 回帖血液-1 金币+1、发帖血液-1 金币+1▕▏升级条件：消耗10血液\n【等级2】2% 回帖血液-1 金币+1、发帖血液-1 金币+1▕▏升级条件：消耗10血液\n【等级3】3% 回帖血液-1 金币+1、发帖血液-1 金币+1▕▏升级条件：消耗10血液\n【等级4】4% 回帖血液-1 金币+2、发帖血液-1 金币+2▕▏升级条件：消耗10血液\n【等级5】5% 回帖血液-1 金币+2、发帖血液-1 金币+2▕▏升级条件：消耗10血液\n【等级6】6% 回帖血液-1 金币+2、发帖血液-1 金币+2▕▏升级条件：消耗10血液\n【 Max 】7% 回帖血液-1 金币+3、发帖血液-1 金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202008/03/120817g9965sausau596r4.gif", 40],
            "2": ["https://img.gamemale.com/album/202008/03/120817hbhv9b1db5hxrdk1.gif", 40],
            "3": ["", 40],
            "4": ["", 40],
            "5": ["", 40],
            "6": ["", 40],
            "Max": ["https://img.gamemale.com/album/202008/03/120819f85b558m8ess56zv.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0286",
        "url_tid": "75754",
        "name": "SCP-s-1889",
        "date": "2020-10-16",
        "buy_limit": "旅程≥20",
        "price": "450金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗1旅程\n【等级2】无属性▕▏升级条件：消耗1旅程\n【等级3】无属性▕▏升级条件：消耗1旅程\n【等级4】无属性▕▏升级条件：消耗1旅程\n【等级5】无属性▕▏升级条件：消耗1旅程\n【等级6】无属性▕▏升级条件：消耗-5旅程\n【 Max 】3% 回帖知识+1 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202008/03/120829e2syrwzli153i3a1.gif", 40],
            "2": ["https://img.gamemale.com/album/202008/03/120831ggoz7u857e5lo56g.gif", 124],
            "3": ["https://img.gamemale.com/album/202008/03/120835hw00k1qi3kw68ioz.gif", 124],
            "4": ["https://img.gamemale.com/album/202008/03/120840lfsxynxlyfx3ofqa.gif", 124],
            "5": ["https://img.gamemale.com/album/202008/03/120842udt1t3id3l29xvu2.gif", 124],
            "6": ["https://img.gamemale.com/album/202008/03/120846y2ocn2752ccvnccy.gif", 124],
            "Max": ["https://img.gamemale.com/album/202008/03/120847xyrwyxxhehxumwhp.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0285",
        "url_tid": "75753",
        "name": "萨菲罗斯",
        "date": "2020-10-16",
        "buy_limit": "在线时间>150",
        "price": "440金币",
        "levels": "【等级1】4% 回帖血液+1、发帖血液+1▕▏升级条件：消耗130金币\n【等级2】7% 回帖堕落+1、发帖血液+2▕▏升级条件：消耗40咒术\n【等级3】8% 回帖血液+1 堕落+1、发帖血液+2 堕落+1▕▏升级条件：堕落≥100\n【等级4】10% 回帖血液+1 堕落+1、发帖血液+3▕▏升级条件：堕落≥150\n【等级5】12% 回帖血液+3 金币-1、发帖堕落+3▕▏升级条件：旅程≥100\n【等级6】14% 回帖血液+2 堕落+1、发帖血液+3▕▏升级条件：知识≥150\n【 Max 】16% 回帖血液+3 堕落+1、发帖血液+4",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202009/19/002515ofbv7sqfqssvq9cz.gif", 40],
            "2": ["https://img.gamemale.com/album/202009/19/002519vh3hh53f7hrwkkb1.gif", 82],
            "3": ["https://img.gamemale.com/album/202009/19/002522w2qy7dugdezqql22.gif", 82],
            "4": ["https://img.gamemale.com/album/202009/19/002531i99l3a71k81jujnu.gif", 82],
            "5": ["https://img.gamemale.com/album/202009/19/002541veio53d5bheho5e5.gif", 82],
            "6": ["https://img.gamemale.com/album/202009/19/002546gzbe8e0t378bun5n.gif", 82],
            "Max": ["https://img.gamemale.com/album/202009/19/002559mdz650pz57ng7xxf.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0284",
        "url_tid": "75752",
        "name": "【新手友好】昆進",
        "date": "2020-10-16",
        "buy_limit": "无",
        "price": "250金币",
        "levels": "【等级1】20% 回帖金币+1 血液+1、发帖金币+3 血液+3▕▏升级条件：总积分≥20\n【等级2】15% 回帖金币+1 血液+1、发帖金币+3 血液+3▕▏升级条件：总积分≥35\n【等级3】10% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：总积分≥50\n【 Max 】5% 回帖金币+1 血液+1、发帖金币+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202009/19/002308g7dw7biybnt9iwdb.gif", 40],
            "2": ["https://img.gamemale.com/album/202009/19/002156y6g6ryp9im3so9ym.gif", 40],
            "3": ["https://img.gamemale.com/album/202009/19/002402kydjpdd0gf0v0tap.gif", 82],
            "Max": ["https://img.gamemale.com/album/202009/19/002436vvdq10m5gmuugp0t.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0283",
        "url_tid": "75751",
        "name": "疾风剑豪",
        "date": "2020-10-16",
        "buy_limit": "无",
        "price": "450金币",
        "levels": "【等级1】3% 回帖血液+1▕▏升级条件：旅程≥20\n【等级2】6% 回帖血液+1▕▏升级条件：堕落≥50\n【等级3】8% 回帖血液+1、发帖旅程+1▕▏升级条件：追随≥100\n【等级4】10% 回帖血液+1 金币+1、发帖旅程+1▕▏升级条件：消耗300金币\n【等级5】13% 回帖血液+1 金币+1、发帖旅程+1▕▏升级条件：灵魂≥1\n【 Max 】5% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202008/03/121025lmm1zxrrkk7x2t39.gif", 40],
            "2": ["https://img.gamemale.com/album/202008/03/121025pc2pm4zjuk2ypjmw.gif", 40],
            "3": ["https://img.gamemale.com/album/202008/03/121026nrm32o4qr4zq4ggo.gif", 82],
            "4": ["https://img.gamemale.com/album/202008/03/121027g3udgnx4gwlzuwgl.gif", 82],
            "5": ["https://img.gamemale.com/album/202008/03/121029zh3shps7piqzhv1h.gif", 124],
            "Max": ["https://img.gamemale.com/album/202008/03/121031gzv4qiqk4czvq1qq.gif", 82]
        }
    },
    {
        "type": "女从",
        "no": "0282",
        "url_tid": "75750",
        "name": "莎伦",
        "date": "2020-10-16",
        "buy_limit": "知识≥10",
        "price": "350金币",
        "levels": "【等级1】4% 回帖血液+1▕▏升级条件：堕落≥50\n【等级2】4% 回帖血液+1 咒术+1▕▏升级条件：消耗50咒术\n【等级3】8% 回帖金币+2 咒术+1▕▏升级条件：咒术≥15\n【 Max 】10% 回帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202303/01/153619kqzrxwzrzht2tith.gif", 40],
            "2": ["https://img.gamemale.com/album/202303/01/153619ekknv0700hihoa2g.gif", 40],
            "3": ["https://img.gamemale.com/album/202303/01/153620iocqmismipo9i99f.gif", 124],
            "Max": ["https://img.gamemale.com/album/202303/01/153621m7ktzc11ji7icrjc.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0281",
        "url_tid": "75131",
        "name": "血石",
        "date": "2020-8-15",
        "buy_limit": "在线时间≥10（【深渊地牢】RAID活动隐藏奖励）",
        "price": "1金币",
        "levels": "【 Max 】2% 回帖血液+1▕▏升级条件：消耗-10血液\n【 Max 】2% 回帖血液+1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202008/15/130144c8jgoezdp0egg0gu.gif", 40],
            "Max": ["https://img.gamemale.com/forum/202008/15/130153hshwdtskgtq8u8s8.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0280",
        "url_tid": "75057",
        "name": "寶可夢 Pokémon",
        "date": "2020-8-11",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202008/11/135656f56ff8756aka7a8r.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0279",
        "url_tid": "75049",
        "name": "软泥怪蛋",
        "date": "2020-8-10",
        "buy_limit": "主题数≥30",
        "price": "150金币",
        "levels": "【等级1】4% 回帖血液+2▕▏升级条件：消耗220金币\n【 Max 】4% 回帖血液+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202008/03/121119fs0bbom2jbct10mn.gif", 40],
            "Max": ["https://img.gamemale.com/album/202008/03/121120b1mi5ixqkqzc4nji.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0278",
        "url_tid": "75048",
        "name": "宝箱内的球",
        "date": "2020-8-10",
        "buy_limit": "旅程≥15",
        "price": "350金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗100金币\n【等级2】6% 回帖金币+1、发帖金币+1▕▏升级条件：消耗150血液\n【等级3】2% 回帖旅程+1 金币-1、发帖金币+2▕▏升级条件：知识≥60\n【等级4】10% 回帖金币+2 血液-1、发帖金币+3▕▏升级条件：旅程≥77\n【 Max 】12% 回帖金币+3 血液-1、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202008/03/120938hilzyauj1h1xyelx.gif", 40],
            "2": ["https://img.gamemale.com/album/202008/03/120938axx77jfdjt0m7dtf.gif", 40],
            "3": ["https://img.gamemale.com/album/202008/03/120939sysss74uzszssu8q.gif", 40],
            "4": ["https://img.gamemale.com/album/202008/03/120939rnodx43xgrz4arfe.gif", 40],
            "Max": ["https://img.gamemale.com/album/202008/03/120940xo5bswtt0dtvzt09.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0277",
        "url_tid": "75047",
        "name": "冒险用绷带",
        "date": "2020-8-10",
        "buy_limit": "无",
        "price": "211金币",
        "levels": "【等级1】10% 回帖血液+1▕▏升级条件：消耗-10血液\n【等级2】8% 回帖血液+1▕▏升级条件：消耗-15血液\n【等级3】6% 回帖血液+1▕▏升级条件：消耗-20血液\n【 Max 】4% 回帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202008/03/121107sv0blbsvhmmxvt5m.gif", 40],
            "2": ["https://img.gamemale.com/album/202008/03/121107kekxz2hbxld2dalh.gif", 40],
            "3": ["https://img.gamemale.com/album/202008/03/121108wfozx6gnnqfg3aad.gif", 40],
            "Max": ["https://img.gamemale.com/album/202008/03/121108t10ojih1ihhjztc4.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0276",
        "url_tid": "75046",
        "name": "星芒戒指",
        "date": "2020-8-10",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】4% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗18咒术\n【 Max 】8% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/12/142023s57s3bgiiz7z7ir8.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/12/142023peeeabemvj2jb1jt.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0275",
        "url_tid": "75045",
        "name": "魯杰羅·弗雷迪",
        "date": "2020-8-10",
        "buy_limit": "堕落≥30",
        "price": "300金币",
        "levels": "【等级1】1% 回帖血液+3 堕落-1、发帖血液+3 堕落-1▕▏升级条件：消耗100血液\n【等级2】2% 回帖血液+3 堕落-1、发帖知识+1 堕落-1▕▏升级条件：主题数≥30\n【等级3】2% 回帖知识+1 血液+1 堕落-1、发帖知识+1 血液+3▕▏升级条件：主题数≥60\n【 Max 】3% 回帖知识+1 血液+1 堕落-1、发帖知识+1 血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202008/03/121045lzw4bvrnnrhlrbvo.gif", 40],
            "2": ["https://img.gamemale.com/album/202008/03/121047uv7wzjnvnjv8u46e.gif", 82],
            "3": ["https://img.gamemale.com/album/202105/11/200012lr1wpddgp7hewdfh.gif", 82],
            "Max": ["https://img.gamemale.com/album/202008/03/121049rzpdm9k7i99w3wmp.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0274",
        "url_tid": "75044",
        "name": "塞巴斯蒂安·斯坦",
        "date": "2020-8-10",
        "buy_limit": "无",
        "price": "450金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：追随≥50\n【 Max 】8% 回帖金币+2、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202008/03/121130z2i9iz8meydjdvzc.gif", 40],
            "Max": ["https://img.gamemale.com/album/202008/10/115124u95b9igfgbdvf9zn.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0273",
        "url_tid": "75043",
        "name": "沃特·沙利文",
        "date": "2020-8-10",
        "buy_limit": "堕落≥24",
        "price": "302金币",
        "levels": "【等级1】2% 回帖血液+2▕▏升级条件：消耗173金币\n【等级2】4% 回帖血液+2、发帖咒术+1▕▏升级条件：追随≥40\n【等级3】6% 回帖咒术+1、发帖咒术+1▕▏升级条件：旅程≥60\n【等级4】8% 回帖咒术+1、发帖咒术+1▕▏升级条件：知识≥60\n【等级5】8% 回帖咒术+1、发帖咒术+1 血液+1▕▏升级条件：堕落≥91\n【 Max 】8% 回帖咒术+1 血液+1、发帖咒术+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202008/08/123422gv2t44ssx90xgs2s.gif", 40],
            "2": ["https://img.gamemale.com/album/202008/03/121213nv71ssberh7vtssk.gif", 40],
            "3": ["https://img.gamemale.com/forum/202403/08/190216h1wlqqdt5dtsz9az.gif", 82],
            "4": ["https://img.gamemale.com/album/202008/03/121217fi8r7cj813xjjeqi.gif", 82],
            "5": ["https://img.gamemale.com/forum/202306/09/040011o6vrz5kfkrk6wj1h.gif", 124],
            "Max": ["https://img.gamemale.com/album/202008/03/121219vtetgcvtu6us60gg.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0272",
        "url_tid": "75042",
        "name": "吉姆·霍普",
        "date": "2020-8-10",
        "buy_limit": "在线时间≥100",
        "price": "300金币",
        "levels": "【等级1】25% 回帖血液+1▕▏升级条件：血液≥35\n【等级2】6% 回帖血液+1 堕落+1▕▏升级条件：消耗100血液\n【等级3】8% 回帖血液+1 堕落+1▕▏升级条件：追随≥50\n【等级4】10% 回帖血液+1 堕落+1▕▏升级条件：消耗250金币\n【 Max 】12% 回帖血液+2 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202006/04/184828uzhdghhp6u2lxcth.gif", 40],
            "2": ["https://img.gamemale.com/album/202006/04/184832pzgccucy7cfd1fc8.gif", 124],
            "3": ["https://img.gamemale.com/album/202006/04/184834n22z2ava3kzwkwca.gif", 124],
            "4": ["https://img.gamemale.com/album/202006/04/184838wg3hhg933ck33h4h.gif", 124],
            "Max": ["https://img.gamemale.com/album/202006/04/184842utju1hjhcu1sbnzs.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0271",
        "url_tid": "74206",
        "name": "月上柳梢",
        "date": "2020-6-9",
        "buy_limit": "【七周年庆】活动期间完成指定任务",
        "price": "无",
        "levels": "【 Max 】7% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202006/09/125444i9tll6vvvvnsyooc.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0270",
        "url_tid": "74204",
        "name": "血鹫蛋",
        "date": "2020-6-9",
        "buy_limit": "堕落≥25",
        "price": "310金币",
        "levels": "【等级1】3% 回帖金币+1、发帖旅程+1▕▏升级条件：咒术≥50\n【等级2】6% 回帖金币+1、发帖旅程+1▕▏升级条件：消耗210血液\n【等级3】10% 回帖金币+2 堕落+1、发帖旅程+1▕▏升级条件：咒术≥150\n【 Max 】15% 回帖金币+2 堕落+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202006/04/184720i8moca3cfk1x39yo.gif", 40],
            "2": ["https://img.gamemale.com/album/202006/04/184721x2p54ia5fvqd5i5q.gif", 40],
            "3": ["https://img.gamemale.com/album/202006/04/184721sqs6g2e0ge0hyhqd.gif", 40],
            "Max": ["https://img.gamemale.com/album/202006/04/184722anwvqcqc9qp7qdqv.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0269",
        "url_tid": "74203",
        "name": "灵鹫蛋",
        "date": "2020-6-9",
        "buy_limit": "堕落≤19",
        "price": "310金币",
        "levels": "【等级1】3% 回帖血液+1、发帖知识+1▕▏升级条件：主题数≥10\n【等级2】6% 回帖血液+1、发帖知识+1▕▏升级条件：消耗210金币\n【等级3】10% 回帖血液+2 堕落-1、发帖知识+1▕▏升级条件：主题数≥50\n【 Max 】15% 回帖血液+2 堕落-1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202006/04/184708vzi1quais050ksm0.gif", 40],
            "2": ["https://img.gamemale.com/album/202006/04/184708wpk4667r6j7k99kg.gif", 40],
            "3": ["https://img.gamemale.com/album/202006/04/184709rivf16faiok6wvzv.gif", 40],
            "Max": ["https://img.gamemale.com/album/202006/04/184710hs3ktk7tgkr6fby6.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0268",
        "url_tid": "74202",
        "name": "月陨戒指",
        "date": "2020-6-9",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗88血液\n【 Max 】10% 回帖血液+1、发帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/12/142024syr4x15d525yoo5d.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/12/142025gervz2pc0x60efrz.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0267",
        "url_tid": "74201",
        "name": "日荒戒指",
        "date": "2020-6-9",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+1▕▏升级条件：消耗88金币\n【 Max 】10% 回帖金币+1、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/12/142022fhwmpww2mh5nv8xv.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/12/142022heuozgz7a1214am6.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0266",
        "url_tid": "74199",
        "name": "陷阱杀手",
        "date": "2020-6-9",
        "buy_limit": "堕落≥10",
        "price": "280金币",
        "levels": "【等级1】3% 回帖血液+1、发帖血液+1▕▏升级条件：消耗134金币\n【等级2】5% 回帖堕落+1、发帖堕落+1▕▏升级条件：堕落≥30\n【 Max 】8% 回帖血液+2、发帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202006/04/184750m7arxhpxxek7m77o.gif", 40],
            "2": ["https://img.gamemale.com/album/202006/04/184751le7phhbh37tbp3ka.gif", 40],
            "Max": ["https://img.gamemale.com/album/202006/04/184753io2w2dx6gbdf26om.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0255",
        "url_tid": "74198",
        "name": "索林·橡木盾",
        "date": "2020-6-9",
        "buy_limit": "追随≥14",
        "price": "520金币",
        "levels": "【等级1】5% 回帖血液+1、发帖旅程+1▕▏升级条件：旅程≥15\n【等级2】7% 回帖血液+1、发帖旅程+1▕▏升级条件：消耗333血液\n【等级3】10% 回帖血液+2、发帖旅程+1▕▏升级条件：消耗-1旅程\n【等级4】12% 回帖血液+2、发帖旅程+1▕▏升级条件：金币≥1314\n【等级5】15% 回帖金币+1 血液-1、发帖金币+3 血液-3▕▏升级条件：消耗1314金币\n【 Max 】18% 回帖血液+3、发帖血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202006/04/184808bdomk3o8okzb0tbl.gif", 40],
            "2": ["https://img.gamemale.com/album/202006/04/184809fq74a6u660gaf68l.gif", 40],
            "3": ["https://img.gamemale.com/album/202006/04/184812cd0igigj4bn1nn0q.gif", 82],
            "4": ["https://img.gamemale.com/album/202006/04/184815tvvlvjv1mv2zmbmv.gif", 82],
            "5": ["https://img.gamemale.com/album/202006/04/184817uf3o0pa3aaccpgmm.gif", 82],
            "Max": ["https://img.gamemale.com/album/202006/04/184820o26xv4j2z4bs4zdi.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0254",
        "url_tid": "74196",
        "name": "杰克·莫里森/士兵 76",
        "date": "2020-6-9",
        "buy_limit": "无",
        "price": "476金币",
        "levels": "【等级1】3% 回帖血液+1▕▏升级条件：堕落≥30\n【等级2】6% 回帖血液+1、发帖旅程+1▕▏升级条件：堕落≥76\n【等级3】76% 回帖血液+3 堕落+2、发帖血液+7 金币+6 堕落+2▕▏升级条件：堕落≥77\n【等级4】12% 回帖血液+2 金币-1、发帖旅程+1▕▏升级条件：消耗376血液\n【 Max 】15% 回帖血液+3 金币-1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201906/15/163053p8rq2ttx6f6z204g.gif", 40],
            "2": ["https://img.gamemale.com/album/201906/15/154716mzenzbh0be1ie6z1.gif", 82],
            "3": ["https://img.gamemale.com/album/201906/15/154718v3k1buetufekn2op.gif", 82],
            "4": ["https://img.gamemale.com/album/201906/15/154720ycy999gh11375c7i.gif", 82],
            "Max": ["https://img.gamemale.com/album/201906/15/154723a3zzrww4kgzya6k5.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0253",
        "url_tid": "73631",
        "name": "熔岩蛋",
        "date": "2020-5-1",
        "buy_limit": "旅程≥35",
        "price": "350金币",
        "levels": "【等级1】5% 回帖金币+2▕▏升级条件：消耗369血液\n【 Max 】15% 回帖金币+2、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/12/140920xybvdi99sqibpa1b.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/12/140921uai9l80aaaxifluc.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0252",
        "url_tid": "73630",
        "name": "郁苍卵",
        "date": "2020-5-1",
        "buy_limit": "旅程≥35",
        "price": "350金币",
        "levels": "【等级1】5% 回帖血液+2▕▏升级条件：消耗369金币\n【 Max 】15% 回帖血液+2、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201910/06/152248t7hxs70s76tsiwsz.gif", 40],
            "Max": ["https://img.gamemale.com/album/201910/06/152248jk2zlg924uk6kxj2.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0251",
        "url_tid": "73629",
        "name": "神秘的漂流瓶",
        "date": "2020-5-1",
        "buy_limit": "旅程≥66",
        "price": "500金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗1旅程\n【等级2】无属性▕▏升级条件：消耗1旅程\n【等级3】无属性▕▏升级条件：消耗1旅程\n【等级4】无属性▕▏升级条件：消耗1旅程\n【等级5】无属性▕▏升级条件：消耗1旅程\n【等级6】无属性▕▏升级条件：消耗1旅程\n【等级7】无属性▕▏升级条件：消耗1旅程\n【等级8】无属性▕▏升级条件：消耗1旅程\n【等级9】无属性▕▏升级条件：消耗1旅程\n【等级10】无属性▕▏升级条件：消耗-9旅程\n【 Max 】12% 发帖旅程+1 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/12/141958nmoqz5nno4o2ctmm.gif", 40],
            "2": ["https://img.gamemale.com/album/201912/12/142000q4sesx9ky4xdhdye.gif", 40],
            "3": ["https://img.gamemale.com/album/201912/12/143936kkkngg5i6gvne3ze.gif", 40],
            "4": ["https://img.gamemale.com/album/201912/12/142004i1bc8gok2kp1aa1b.gif", 40],
            "5": ["https://img.gamemale.com/album/201912/12/142008zjxmcjmea8pakzyr.gif", 40],
            "6": ["https://img.gamemale.com/album/201912/12/142009dzwm525ar5fnhzam.gif", 40],
            "7": ["https://img.gamemale.com/album/201912/12/142010pr0zuodsrod7j9jk.gif", 40],
            "8": ["https://img.gamemale.com/album/201912/12/142011htgjejmc2s11676p.gif", 40],
            "9": ["https://img.gamemale.com/album/201912/12/142012f18b0rnebboj0m0z.gif", 40],
            "10": ["https://img.gamemale.com/album/201912/12/143625zscxxvrx5mskcrdo.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/22/132618l128k5vr4x865o88.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0250",
        "url_tid": "73628",
        "name": "暖心小火柴",
        "date": "2020-5-1",
        "buy_limit": "旅程≥15",
        "price": "333金币",
        "levels": "【等级1】无属性▕▏升级条件：血液≥33\n【等级2】11% 回帖金币+1 血液-1、发帖金币+2▕▏升级条件：消耗33血液\n【等级3】11% 回帖金币-1 血液+1、发帖血液+2▕▏升级条件：消耗33血液\n【 Max 】11% 回帖金币+1 血液+1、发帖血液+1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/12/141648yjjhqcxv3bybqzv3.gif", 40],
            "2": ["https://img.gamemale.com/album/201912/12/141649v0g1t7w314it7gga.gif", 40],
            "3": ["https://img.gamemale.com/album/201912/12/141650czkwlrccg5vi5d5o.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/13/024024jpf7zm43n6ytyat2.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0249",
        "url_tid": "73627",
        "name": "Doc",
        "date": "2020-5-1",
        "buy_limit": "旅程≥10",
        "price": "500金币",
        "levels": "【等级1】3% 回帖金币+1、发帖金币+1▕▏升级条件：旅程≥20\n【等级2】5% 回帖金币+2 血液-1、发帖金币+2 血液-1▕▏升级条件：知识≥10\n【等级3】8% 回帖金币+2、发帖金币+2▕▏升级条件：消耗250金币\n【 Max 】10% 回帖金币+2 血液+1、发帖金币+2 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202003/07/202911ow3ldyqo8ly3yr1y.gif", 40],
            "2": ["https://img.gamemale.com/album/202003/07/202911l8vk3vjka6u9bvk6.gif", 40],
            "3": ["https://img.gamemale.com/album/202003/07/202912pana2k9zah9r97v2.gif", 82],
            "Max": ["https://img.gamemale.com/album/202003/07/202913kdd0zd7bodt0golb.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0248",
        "url_tid": "73626",
        "name": "迈克尔迈尔斯",
        "date": "2020-5-1",
        "buy_limit": "旅程≥10",
        "price": "450金币",
        "levels": "【等级1】3% 回帖血液+1、发帖堕落+1▕▏升级条件：消耗200血液\n【等级2】5% 回帖血液+2、发帖堕落+1 血液+1▕▏升级条件：主题数≥20\n【等级3】7% 回帖血液+1 堕落+1、发帖堕落+1 血液+2▕▏升级条件：堕落≥40\n【 Max 】10% 回帖血液+2 堕落+1、发帖堕落+1 血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202003/07/202903bpu1zq6i11gn9ogm.gif", 40],
            "2": ["https://img.gamemale.com/album/202003/07/202904xoml17pjp888rmpd.gif", 40],
            "3": ["https://img.gamemale.com/album/202003/07/202905wfcxfusrav6ojwbx.gif", 82],
            "Max": ["https://img.gamemale.com/album/202003/07/202907o1sqelf1uzefrzp0.gif", 82]
        }
    },
    {
        "type": "宠物",
        "no": "0247",
        "url_tid": "72925",
        "name": "马戏团灰蛋",
        "date": "2020-3-8",
        "buy_limit": "旅程≥25",
        "price": "270金币",
        "levels": "【等级1】5% 回帖金币+1、发帖堕落+1▕▏升级条件：消耗180血液\n【等级2】10% 回帖金币+2、发帖堕落+1▕▏升级条件：消耗150金币\n【 Max 】12% 回帖血液+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/16/151813vt3p30t3pgzq3wt3.gif", 40],
            "2": ["https://img.gamemale.com/album/201912/16/151814hxha9qez6067ja7z.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/16/155350owigb0u0ggjdkwkk.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0246",
        "url_tid": "72924",
        "name": "生锈的海盗刀枪",
        "date": "2020-3-8",
        "buy_limit": "堕落≥15",
        "price": "310金币",
        "levels": "【等级1】5% 回帖堕落+1、发帖金币+3▕▏升级条件：旅程≥60\n【等级2】10% 回帖堕落+1、发帖金币+3▕▏升级条件：消耗180金币\n【 Max 】15% 回帖堕落+1、发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/21/010703hqgwwlwkkqjrgkj2.gif", 82],
            "2": ["https://img.gamemale.com/album/201912/21/010303vvu4ggpk6x39nkdm.gif", 82],
            "Max": ["https://img.gamemale.com/album/201912/21/010306i7t1w7xvc749ccyt.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0245",
        "url_tid": "72923",
        "name": "海盗弯钩",
        "date": "2020-3-8",
        "buy_limit": "无",
        "price": "130金币",
        "levels": "【 Max 】4% 回帖血液+1 堕落+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202003/08/152506qm8u4844zvpvzyjw.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0244",
        "url_tid": "72922",
        "name": "钢铁勇士弯刀",
        "date": "2020-3-8",
        "buy_limit": "无",
        "price": "140金币",
        "levels": "【 Max 】4% 回帖金币+1 堕落-1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202003/08/152417e1z4nvee1mxymizv.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0243",
        "url_tid": "72921",
        "name": "莫瑞甘",
        "date": "2020-3-8",
        "buy_limit": "咒术≥40",
        "price": "360金币",
        "levels": "【等级1】3% 回帖堕落+1▕▏升级条件：消耗150血液\n【等级2】5% 回帖咒术+1▕▏升级条件：消耗220金币\n【等级3】7% 回帖咒术+1 堕落+1 血液-1▕▏升级条件：旅程≥60\n【等级4】10% 回帖咒术+1 血液-2、发帖血液-2 咒术+2▕▏升级条件：消耗200血液\n【 Max 】10% 回帖咒术+1 血液-1、发帖血液-3 咒术+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202303/01/140812byqmt7q2uuqqm2me.gif", 40],
            "2": ["https://img.gamemale.com/album/202303/01/140812nz3itra9q5aww93q.gif", 82],
            "3": ["https://img.gamemale.com/album/202303/01/140813wtokc7ya90j0cfjt.gif", 82],
            "4": ["https://img.gamemale.com/album/202303/01/140814rf94rtgft5r8z1gm.gif", 82],
            "Max": ["https://img.gamemale.com/album/202303/01/140814zd55rrd08so3udfo.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0242",
        "url_tid": "72920",
        "name": "藤田優馬",
        "date": "2020-3-8",
        "buy_limit": "主题数≥3",
        "price": "298金币",
        "levels": "【等级1】3% 回帖金币+1、发帖金币+2▕▏升级条件：消耗129金币\n【等级2】9% 回帖堕落+1 金币-1、发帖堕落+2▕▏升级条件：消耗129血液\n【 Max 】9% 回帖血液+1 堕落-1、发帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202003/07/202919w69k3pj8nvn68nz6.gif", 40],
            "2": ["https://img.gamemale.com/album/202003/07/202919vijeebbz06n8l6q0.gif", 40],
            "Max": ["https://img.gamemale.com/album/202003/07/202921y44gpq14chga2pnc.gif", 82]
        }
    },
    {
        "type": "宠物",
        "no": "0241",
        "url_tid": "72228",
        "name": "月影蛋",
        "date": "2020-1-24",
        "buy_limit": "血液≥303",
        "price": "310金币",
        "levels": "【等级1】5% 回帖血液+2、发帖咒术+1▕▏升级条件：消耗30咒术\n【等级2】10% 回帖血液+2、发帖咒术+1▕▏升级条件：血液≥388\n【 Max 】15% 回帖血液+2、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/12/141004j1gf13h1nscccsp3.gif", 40],
            "2": ["https://img.gamemale.com/album/201912/12/141004pk1e1dk2kyq1j995.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/12/141005yetz9z2xnmlketlb.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0240",
        "url_tid": "72227",
        "name": "珊瑚色礁石蛋",
        "date": "2020-1-24",
        "buy_limit": "发帖数≥150",
        "price": "260金币",
        "levels": "【等级1】4% 回帖咒术+1 血液+1、发帖咒术+2▕▏升级条件：消耗188金币\n【 Max 】8% 回帖咒术+1 血液+2、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/14/153936wrv7qcockbpbvbvb.gif", 40],
            "Max": ["https://img.gamemale.com/album/202001/26/122212itz6u146rt1c4144.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0239",
        "url_tid": "72226",
        "name": "冒险用指南针",
        "date": "2020-1-24",
        "buy_limit": "无",
        "price": "150金币",
        "levels": "【 Max 】3% 回帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202001/24/224852ot1lhlabflehbipo.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0238",
        "url_tid": "72225",
        "name": "老旧的怀表",
        "date": "2020-1-24",
        "buy_limit": "在线时间≥280",
        "price": "280金币",
        "levels": "【等级1】5% 回帖血液+1、发帖知识+1▕▏升级条件：消耗120金币\n【等级2】10% 回帖血液+1、发帖知识+1▕▏升级条件：消耗200血液\n【 Max 】2% 回帖知识+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/18/134204wcx44hqqa4xr4xcd.gif", 40],
            "2": ["https://img.gamemale.com/album/201912/18/133654lk3vpwjvkthi2ui3.gif", 40],
            "Max": ["https://img.gamemale.com/album/202001/26/135105odnqnnzi99iixncz.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0237",
        "url_tid": "72204",
        "name": "沙漠神灯",
        "date": "2020-1-24",
        "buy_limit": "知识≥20",
        "price": "250金币",
        "levels": "【等级1】2% 回帖咒术+1▕▏升级条件：消耗25咒术\n【等级2】3% 回帖咒术+1、发帖知识+1▕▏升级条件：金币≥433\n【 Max 】3% 回帖咒术+1 知识+1、发帖咒术+1 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/12/141637yxk7xoyt86ux5g8g.gif", 40],
            "2": ["https://img.gamemale.com/album/201912/12/141637cnvo4v3ssf36uqtn.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/12/141638ya87yxvakkvvraxr.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0236",
        "url_tid": "72203",
        "name": "狩猎用小刀",
        "date": "2020-1-24",
        "buy_limit": "知识≥10",
        "price": "230金币",
        "levels": "【等级1】4% 回帖堕落+1▕▏升级条件：消耗100血液\n【等级2】8% 回帖血液+2▕▏升级条件：消耗-5堕落\n【等级3】8% 回帖金币+2▕▏升级条件：消耗-5堕落\n【 Max 】4% 回帖堕落+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/22/233522ndao49lr7ogroboj.gif", 40],
            "2": ["https://img.gamemale.com/album/201912/22/233523kqy5x66w115oaooy.gif", 40],
            "3": ["https://img.gamemale.com/album/201912/22/233524nzccirm32qm9rcol.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/22/233525ln04agzzn7hn771p.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0235",
        "url_tid": "72202",
        "name": "蔷薇骑士之刃",
        "date": "2020-1-24",
        "buy_limit": "追随≥10",
        "price": "320金币",
        "levels": "【等级1】4% 回帖金币+1 血液+1、发帖知识+1▕▏升级条件：追随≥87\n【 Max 】8% 回帖金币+1 血液+1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/16/151737ohl7t7ph7at7lsaa.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/16/151737siyiq7wbr49y9bgf.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0234",
        "url_tid": "72201",
        "name": "乔纳森·里德",
        "date": "2020-1-24",
        "buy_limit": "血液≥50",
        "price": "360金币",
        "levels": "【等级1】3% 回帖血液+1▕▏升级条件：消耗200血液\n【等级2】6% 回帖血液+1▕▏升级条件：发帖数≥300\n【等级3】9% 回帖血液+2▕▏升级条件：知识≥40\n【等级4】12% 回帖血液+2 金币-1、发帖知识+1▕▏升级条件：消耗365血液\n【 Max 】15% 回帖血液+3 金币-1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201911/10/134641fy6sijz6yf5sfwsi.gif", 40],
            "2": ["https://img.gamemale.com/album/201911/10/134641ehnttpn77tolcui4.gif", 40],
            "3": ["https://img.gamemale.com/album/201911/10/134642bt851ueqz9qw9wx1.gif", 82],
            "4": ["https://img.gamemale.com/album/201911/10/134642yc95og94fc89yth8.gif", 82],
            "Max": ["https://img.gamemale.com/album/201911/10/134643bc375a3ppb7d73tw.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0233",
        "url_tid": "72200",
        "name": "尼克斯·乌尔里克",
        "date": "2020-1-24",
        "buy_limit": "堕落≤39",
        "price": "520金币",
        "levels": "【等级1】6% 回帖血液+1、发帖咒术+1▕▏升级条件：咒术≥15\n【等级2】6% 回帖血液+2、发帖咒术+1▕▏升级条件：消耗333金币\n【等级3】10% 回帖血液+2、发帖咒术+2▕▏升级条件：消耗333血液\n【等级4】14% 回帖血液+1 堕落-1、发帖血液+1 堕落-2▕▏升级条件：血液≥1000\n【等级5】18% 回帖咒术+1 血液-2、发帖咒术+3 血液-3▕▏升级条件：堕落≥13\n【 Max 】10% 发帖堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201911/10/134615hjkihjlqipqkcqiq.gif", 40],
            "2": ["https://img.gamemale.com/album/201911/10/134615vc6tx3bzbmqts2e2.gif", 40],
            "3": ["https://img.gamemale.com/album/201911/10/134616s9w368emw68666hm.gif", 40],
            "4": ["https://img.gamemale.com/album/201911/10/134616aq09qqqaa4226zrq.gif", 40],
            "5": ["https://img.gamemale.com/album/201911/10/134617go9iy9tsbyhhco7b.gif", 82],
            "Max": ["https://img.gamemale.com/album/201911/10/134617tyc9r2jrjtybygha.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0232",
        "url_tid": "72140",
        "name": "迷之天鹅",
        "date": "2020-1-16",
        "buy_limit": "Speculative Move勋章交换季活动奖励",
        "price": "无",
        "levels": "【等级1】4% 发帖血液+1 咒术+1▕▏升级条件：消耗1灵魂\n【 Max 】10% 回帖咒术+1 血液+3、发帖知识+1 咒术+2 血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202002/05/114716nmg2pthbwhtpn575.gif", 40],
            "Max": ["https://img.gamemale.com/forum/202002/05/114737cyxkxr2yr7jx2x11.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0231",
        "url_tid": "72139",
        "name": "海螺号角",
        "date": "2020-1-16",
        "buy_limit": "旅程≥15",
        "price": "277金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗177血液\n【等级2】10% 回帖金币+1▕▏升级条件：旅程≥77\n【 Max 】10% 回帖金币+1、发帖旅程+1 金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/23/151131pb6w8dw6eebewwe1.gif", 40],
            "2": ["https://img.gamemale.com/album/201912/23/151132gttw79m7boxb5ttt.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/14/153848f5x6robaqp2k46l2.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0230",
        "url_tid": "72138",
        "name": "冒险用面包",
        "date": "2020-1-16",
        "buy_limit": "无",
        "price": "150金币",
        "levels": "【等级1】6% 回帖血液+1▕▏升级条件：旅程≥18\n【等级2】6% 回帖血液+2▕▏升级条件：消耗-25血液\n【 Max 】2% 回帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/12/141704mtogt8bgox8od081.gif", 40],
            "2": ["https://img.gamemale.com/album/201912/12/141705lzy8em9ueeedasmq.gif", 40],
            "Max": ["https://img.gamemale.com/album/201912/12/141705qkbza5b6b8ds6mm1.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0229",
        "url_tid": "72137",
        "name": "莱因哈特·威尔海姆",
        "date": "2020-1-16",
        "buy_limit": "无",
        "price": "449金币",
        "levels": "【等级1】勋章博物馆资料暂缺▕▏升级条件：旅程≥31\n【等级2】7% 回帖血液+1、发帖旅程+1 血液+2▕▏升级条件：旅程≥61\n【 Max 】10% 回帖血液+2、发帖旅程+1 血液+3",
        "levels_img": {
            "1": ["", 40],
            "2": ["https://img.gamemale.com/album/201910/07/021148pezyimysjsx9rgp9.gif", 82],
            "Max": ["https://img.gamemale.com/album/201910/07/022936lrreqxmmbribkmgr.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0228",
        "url_tid": "72054",
        "name": "远古石碑",
        "date": "2020-1-9",
        "buy_limit": "无",
        "price": "140金币",
        "levels": "【 Max 】7% 回帖金币+1、发帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202001/09/134442dfu9yuzzm4c9y04t.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0227",
        "url_tid": "72053",
        "name": "魔法石碑",
        "date": "2020-1-9",
        "buy_limit": "无",
        "price": "130金币",
        "levels": "【 Max 】7% 回帖血液+1、发帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202001/09/134513owtgglz9wcfs3cs7.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0226",
        "url_tid": "72052",
        "name": "龙血之斧",
        "date": "2020-1-9",
        "buy_limit": "无",
        "price": "210金币",
        "levels": "【 Max 】15% 发帖血液+3",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202001/09/133910hnqkpip7ugia64au.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0225",
        "url_tid": "72051",
        "name": "十字军护盾",
        "date": "2020-1-9",
        "buy_limit": "无",
        "price": "190金币",
        "levels": "【 Max 】8% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/202001/09/133626btbnf3cavmmffvbw.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0224",
        "url_tid": "71890",
        "name": "【圣诞限定】心心念念小雪人",
        "date": "2019-12-24",
        "buy_limit": "圣诞节开放购买",
        "price": "666金币",
        "levels": "【 Max 】1% 发帖旅程+1 金币+5 血液+5 咒术+3 知识+1 灵魂+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201912/24/005708xfgmp5vm0hyjhv06.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0223",
        "url_tid": "71889",
        "name": "箭术卷轴",
        "date": "2019-12-24",
        "buy_limit": "无",
        "price": "70金币",
        "levels": "【 Max 】4% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201912/24/090653lpdjddwdo37jj0jj.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0222",
        "url_tid": "71887",
        "name": "用过的粪桶",
        "date": "2019-12-24",
        "buy_limit": "旅程≥10",
        "price": "111金币",
        "levels": "【等级1】3% 回帖血液-2 金币+2▕▏升级条件：消耗30血液\n【 Max 】6% 回帖血液-1 金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201911/21/175026ujxgk8ck463qcqrr.gif", 40],
            "Max": ["https://img.gamemale.com/album/201911/21/175026o6fuf0g96fxuit97.gif", 40]
        }
    },
    {
        "type": "天赋",
        "no": "0221",
        "url_tid": "71886",
        "name": "四季之歌",
        "date": "2019-12-24",
        "buy_limit": "旅程≥40，知识≥40，追随≥40，咒术≥40",
        "price": "无",
        "levels": "【等级1】10% 回帖血液+1、发帖咒术+2▕▏升级条件：消耗1咒术\n【等级2】10% 回帖金币+1、发帖旅程+1▕▏升级条件：消耗1咒术\n【等级3】10% 回帖血液+1、发帖知识+1▕▏升级条件：消耗1咒术\n【 Max 】10% 回帖金币+1、发帖知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201912/19/200741x6tieg9ziopxpziz.gif", 124],
            "2": ["https://img.gamemale.com/album/201912/19/194025bnglbu8j4uljgl8g.gif", 124],
            "3": ["https://img.gamemale.com/album/201912/19/194015uco030s1ps4300on.gif", 124],
            "Max": ["https://img.gamemale.com/album/201912/19/193959uwlhbtghdojz00hb.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0220",
        "url_tid": "71885",
        "name": "雾都血医",
        "date": "2019-12-24",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201912/24/003911ivnfn8nqosoqqtdt.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0219",
        "url_tid": "71579",
        "name": "不败之花",
        "date": "2019-11-18",
        "buy_limit": "Battle Royale大逃杀活动冠军奖励",
        "price": "无",
        "levels": "【 Max 】勋章博物馆资料暂缺",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201911/18/003701q069p6pqoi06ds66.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0218",
        "url_tid": "71578",
        "name": "德拉克的遗物",
        "date": "2019-11-18",
        "buy_limit": "2019大逃杀活动特别篇结算分数达到总参与者的前60%",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：消耗1旅程\n【等级2】1% 回帖金币+1▕▏升级条件：消耗1旅程\n【等级3】1% 回帖血液+1▕▏升级条件：消耗1旅程\n【等级4】1% 回帖旅程+1▕▏升级条件：消耗1旅程\n【等级5】1% 回帖知识+1▕▏升级条件：消耗400金币\n【 Max 】1% 回帖金币+1 血液+1 旅程+1 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/201911/18/003121hl1yn18m3ms5xsxe.gif", 40],
            "2": ["", 40],
            "3": ["", 40],
            "4": ["", 40],
            "5": ["https://img.gamemale.com/album/201907/27/200715hivv0qbl4byf76f6.gif", 40],
            "Max": ["https://img.gamemale.com/forum/202309/05/161730aud74dhx87dswyu4.gif", 40]
        }
    },
    {
        "type": "储蓄",
        "no": "0217",
        "url_tid": "71516",
        "name": "金猪猪储蓄罐",
        "date": "2019-11-11",
        "buy_limit": "特别时期供应",
        "price": "10000金币",
        "duration": "14天",
        "levels": "【等级1】50% 回帖金币+1、发帖金币+1▕▏升级条件：消耗-10100金币\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/201911/11/165658y2ssspe297cptwk9.gif", 40],
            "Max": ["https://img.gamemale.com/forum/201911/24/191657xgogg0alz9zoazle.gif", 40]
        }
    },
    {
        "type": "储蓄",
        "no": "0216",
        "url_tid": "71515",
        "name": "粉猪猪储蓄罐",
        "date": "2019-11-11",
        "buy_limit": "特别时期供应",
        "price": "1000金币",
        "duration": "14天",
        "levels": "【等级1】50% 回帖金币+1、发帖金币+1▕▏升级条件：消耗-1025金币\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/201911/11/165647dgkfk5qvkzfgwk0l.gif", 40],
            "Max": ["https://img.gamemale.com/forum/201911/22/133725tppgcu4v2mpxuw4c.gif", 40]
        }
    },
    {
        "type": "储蓄",
        "no": "0215",
        "url_tid": "71514",
        "name": "白猪猪储蓄罐",
        "date": "2019-11-11",
        "buy_limit": "特别时期供应",
        "price": "100金币",
        "duration": "14天",
        "levels": "【等级1】50% 回帖金币+1、发帖金币+1▕▏升级条件：消耗-101金币\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/201911/11/165635wd5bcebtdjaebepa.gif", 40],
            "Max": ["https://img.gamemale.com/album/201911/09/214507q8opzuoppdzi7mpp.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0214",
        "url_tid": "71008",
        "name": "巴啦啦小魔仙棒",
        "date": "2019-10-15",
        "buy_limit": "无",
        "price": "130金币",
        "levels": "【等级1】3% 回帖知识+1▕▏升级条件：知识≥13\n【等级2】6% 回帖咒术+1▕▏升级条件：消耗39咒术\n【 Max 】9% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201910/06/142623cftvcecoed9lj8jl.gif", 40],
            "2": ["https://img.gamemale.com/album/201910/06/142404ih2t7ovgozpwxxoa.gif", 40],
            "Max": ["https://img.gamemale.com/album/201910/06/142404a9tg6jeo94ju4oig.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0213",
        "url_tid": "71007",
        "name": "种植土豆",
        "date": "2019-10-15",
        "buy_limit": "无",
        "price": "140金币",
        "levels": "【等级1】2% 回帖血液+1▕▏升级条件：消耗25血液\n【等级2】4% 回帖血液+1▕▏升级条件：知识≥5\n【等级3】6% 回帖血液+1▕▏升级条件：消耗35血液\n【等级4】8% 回帖血液+1▕▏升级条件：知识≥15\n【等级5】10% 回帖血液+1、发帖血液+2▕▏升级条件：消耗-88金币\n【 Max 】3% 回帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201910/06/135615qfbjr0g0r115fswo.gif", 40],
            "2": ["https://img.gamemale.com/album/201910/06/141001rrlyrj1xodzz1yjp.gif", 40],
            "3": ["https://img.gamemale.com/album/201910/06/141001a55nx8h8dign55dd.gif", 40],
            "4": ["https://img.gamemale.com/album/201910/06/135342p3xz63odr8cu33s3.gif", 40],
            "5": ["https://img.gamemale.com/album/201910/06/135342ku1h6mrycnyw1wdo.gif", 40],
            "Max": ["https://img.gamemale.com/album/201910/06/135343szu77bbubn7awaca.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0212",
        "url_tid": "71006",
        "name": "神秘的红茶",
        "date": "2019-10-15",
        "buy_limit": "无",
        "price": "77金币",
        "levels": "【等级1】3% 回帖血液+1、发帖血液+1▕▏升级条件：消耗30血液\n【等级2】7% 回帖血液+1▕▏升级条件：堕落≥33\n【 Max 】7% 回帖血液+1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201910/06/134346tesirrn14it4e3z1.gif", 40],
            "2": ["https://img.gamemale.com/album/201910/06/134347mnvsnq9be8pespe2.gif", 40],
            "Max": ["https://img.gamemale.com/album/201910/06/134023ibsp0pthowg4bojo.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0211",
        "url_tid": "71005",
        "name": "幽灵竹筒",
        "date": "2019-10-15",
        "buy_limit": "在线时间≥20",
        "price": "280金币",
        "levels": "【等级1】4% 回帖血液+1、发帖血液+1▕▏升级条件：在线时间≥100\n【等级2】8% 回帖血液+2、发帖血液+1▕▏升级条件：在线时间≥300\n【 Max 】4% 回帖旅程+1 血液+1、发帖旅程+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201910/06/143356aerlyal44ygoaztd.gif", 40],
            "2": ["https://img.gamemale.com/album/201910/06/143356p3beubn981613g6u.gif", 40],
            "Max": ["https://img.gamemale.com/album/201910/06/143356ibiyky6in6dizsns.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0210",
        "url_tid": "71004",
        "name": "荒野大镖客：救赎 II",
        "date": "2019-10-15",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201910/15/135946xsoubcqva6rr6axr.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0209",
        "url_tid": "71002",
        "name": "电磁卵",
        "date": "2019-10-15",
        "buy_limit": "咒术≥30",
        "price": "240金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗11咒术\n【等级2】7% 回帖金币+2▕▏升级条件：消耗22咒术\n【等级3】10% 回帖金币+2▕▏升级条件：消耗33咒术\n【 Max 】15% 回帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201910/06/150702zttt5q0ctv6f6zzl.gif", 40],
            "2": ["https://img.gamemale.com/album/201910/06/150702bv698oii21e07sn8.gif", 40],
            "3": ["https://img.gamemale.com/album/201910/06/150702wi3lszvsbthlhdxs.gif", 40],
            "Max": ["https://img.gamemale.com/album/201910/06/150702cb18pzdqcqkccudc.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0208",
        "url_tid": "71001",
        "name": "青鸾蛋",
        "date": "2019-10-15",
        "buy_limit": "旅程≥29",
        "price": "220金币",
        "levels": "【等级1】6% 回帖金币+1▕▏升级条件：主题数≥20\n【 Max 】12% 回帖血液+1 金币+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201910/14/153359x6d9nffaspwpvzn7.gif", 40],
            "Max": ["https://img.gamemale.com/album/201910/14/153359ej8aajzjr0f9r0ov.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0207",
        "url_tid": "70998",
        "name": "蓝礼·拜拉席恩",
        "date": "2019-10-15",
        "buy_limit": "堕落≤35",
        "price": "520金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+2▕▏升级条件：主题数≥5\n【等级2】10% 回帖金币+1 血液+1、发帖金币+2▕▏升级条件：追随≥22\n【等级3】10% 回帖金币+1 血液+1、发帖旅程+1 金币+2▕▏升级条件：金币≥520\n【等级4】5% 回帖血液-1、发帖血液-1▕▏升级条件：消耗520金币\n【 Max 】13% 回帖金币+1 血液+1、发帖金币+2 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201910/06/131805o11aeeva16c17xve.gif", 40],
            "2": ["https://img.gamemale.com/album/201910/06/131806npbubmcd3m43n3bp.gif", 40],
            "3": ["https://img.gamemale.com/album/201910/06/131806xpjjnjr3bxoxtzjo.gif", 40],
            "4": ["https://img.gamemale.com/album/201910/06/131807ccu066uwyyj6hdr6.gif", 40],
            "Max": ["https://img.gamemale.com/album/201910/06/131807xie1rg3g9itzlll1.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0206",
        "url_tid": "70997",
        "name": "阿列克西欧斯（Alexios）",
        "date": "2019-10-15",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】3% 发帖知识+1▕▏升级条件：主题数≥10\n【等级2】3% 回帖堕落-1 血液+1、发帖知识+1▕▏升级条件：消耗200金币\n【等级3】5% 回帖堕落-1 血液+1、发帖知识+1▕▏升级条件：消耗220血液\n【等级4】7% 回帖堕落-1 血液+2、发帖知识+1▕▏升级条件：消耗-3知识\n【等级5】7% 发帖知识+1▕▏升级条件：知识≥50\n【 Max 】10% 回帖堕落-1 血液+2、发帖堕落-1 血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201908/07/000439c4ys4khmukll4rgr.gif", 40],
            "2": ["https://img.gamemale.com/album/201908/07/000440nlllwslrlwmllxis.gif", 40],
            "3": ["https://img.gamemale.com/album/201908/07/000440q6ak4doawyfobou3.gif", 40],
            "4": ["https://img.gamemale.com/forum/202001/31/134831p0zfhhgtvj1tb12a.gif", 40],
            "5": ["https://img.gamemale.com/album/201908/07/000441q33c0232mgg1jp2u.gif", 40],
            "Max": ["https://img.gamemale.com/album/201908/07/000441fod52mmdddmklwo1.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0205",
        "url_tid": "70996",
        "name": "赫尔墨斯·看守者之杖",
        "date": "2019-10-15",
        "buy_limit": "知识≥8",
        "price": "288金币",
        "levels": "【等级1】3% 回帖血液+1▕▏升级条件：消耗200血液\n【等级2】1% 回帖知识+1、发帖知识+1▕▏升级条件：知识≥20\n【等级3】8% 回帖知识+1 堕落+2、发帖知识+1 堕落+2▕▏升级条件：堕落≥30\n【等级4】6% 回帖知识+1 堕落+1、发帖知识+1 堕落+1▕▏升级条件：堕落≥60\n【等级5】4% 回帖知识+1 堕落+1、发帖知识+1 堕落+1▕▏升级条件：堕落≥90\n【 Max 】2% 回帖知识+1 血液-1、发帖知识+1 血液-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201908/07/000452mvzwvbnkw7l6vgcj.gif", 40],
            "2": ["https://img.gamemale.com/forum/201910/15/155122f6ois6l66o97l66t.gif", 40],
            "3": ["https://img.gamemale.com/album/201908/07/000452bjfvd127665pxm2x.gif", 40],
            "4": ["https://img.gamemale.com/album/201908/07/000452ztxxhahio8tdvdx1.gif", 40],
            "5": ["https://img.gamemale.com/album/201908/07/000453r24zutgt9z9zqt9g.gif", 40],
            "Max": ["https://img.gamemale.com/album/201908/07/000453r45ll444400c8r4z.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0204",
        "url_tid": "70715",
        "name": "莱托文本残页",
        "date": "2019-9-13",
        "buy_limit": "【怪人莱托】RAID活动隐藏奖励",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：消耗-5堕落\n【 Max 】1% 回帖知识+1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/201909/13/214154imm1oe5wa505cfl7.gif", 40],
            "Max": ["https://img.gamemale.com/forum/201909/13/214211gg6kbbrh666fl6qt.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0203",
        "url_tid": "70375",
        "name": "暮色卵",
        "date": "2019-8-9",
        "buy_limit": "旅程≥15",
        "price": "260金币",
        "levels": "【等级1】4% 回帖堕落+1▕▏升级条件：堕落≥80\n【等级2】7% 回帖堕落+1、发帖血液+2▕▏升级条件：堕落≥150\n【 Max 】15% 回帖堕落+1 血液+1、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201908/07/000518cdhiz6zidwgf80a4.gif", 40],
            "2": ["https://img.gamemale.com/album/201908/07/000519zdrihlu7z87uh7dr.gif", 40],
            "Max": ["https://img.gamemale.com/album/201908/07/000520jogqhe954y1h4lel.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0202",
        "url_tid": "70373",
        "name": "结晶卵",
        "date": "2019-8-9",
        "buy_limit": "知识≥15",
        "price": "280金币",
        "levels": "【等级1】2% 发帖知识+1▕▏升级条件：咒术≥40\n【等级2】4% 回帖咒术+1、发帖知识+1▕▏升级条件：咒术≥80\n【 Max 】8% 回帖咒术+2、发帖知识+1 咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201908/07/000510brxu5527532dtj5n.gif", 40],
            "2": ["https://img.gamemale.com/album/201908/07/000511ft7zaarazsfsmtfb.gif", 40],
            "Max": ["https://img.gamemale.com/album/201908/07/000511zzaxrerhlllxexac.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0201",
        "url_tid": "70372",
        "name": "红石",
        "date": "2019-8-9",
        "buy_limit": "血液≥30",
        "price": "177金币",
        "levels": "【等级1】4% 回帖血液+1、发帖血液+1▕▏升级条件：血液≥233\n【 Max 】8% 回帖血液+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201908/07/000502nx9hzsvsvvctrsva.gif", 40],
            "Max": ["https://img.gamemale.com/album/201908/07/000502v9s77su755oflf5s.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0200",
        "url_tid": "70370",
        "name": "冒险专用绳索",
        "date": "2019-8-9",
        "buy_limit": "堕落>10",
        "price": "220金币",
        "levels": "【等级1】4% 回帖堕落+1▕▏升级条件：堕落≥66\n【 Max 】8% 回帖堕落+1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201907/27/193222pr6tpstpjd9sru29.gif", 40],
            "Max": ["https://img.gamemale.com/album/201907/27/193338gdzwwauweaziwzed.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0199",
        "url_tid": "70368",
        "name": "羅素·托維",
        "date": "2019-8-9",
        "buy_limit": "无",
        "price": "240金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗50血液\n【等级2】5% 回帖金币+1、发帖金币+1▕▏升级条件：金币≥100\n【等级3】15% 回帖金币+3、发帖金币+3▕▏升级条件：金币≥200\n【等级4】10% 回帖金币+2、发帖金币+2▕▏升级条件：金币≥300\n【 Max 】5% 回帖金币+1 血液+1、发帖金币+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201907/27/193208yoddaakdpadndkhe.gif", 40],
            "2": ["https://img.gamemale.com/album/201907/27/193209f9zhr9z9ljbauksa.gif", 40],
            "3": ["https://img.gamemale.com/album/201907/27/193210wom7s3ojwoo4mojm.gif", 82],
            "4": ["https://img.gamemale.com/album/201907/27/193212yxd7g4i69bh6xgfg.gif", 82],
            "Max": ["https://img.gamemale.com/album/201907/27/193213hg4q5b32bpbe342p.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0198",
        "url_tid": "70367",
        "name": "安杜因·乌瑞恩",
        "date": "2019-8-9",
        "buy_limit": "旅程≥10",
        "price": "480金币",
        "levels": "【等级1】10% 发帖堕落-1▕▏升级条件：血液≥200\n【等级2】10% 回帖堕落-1、发帖堕落-1▕▏升级条件：咒术≥40\n【等级3】10% 回帖堕落-1 血液+1、发帖堕落-1 血液+1▕▏升级条件：消耗280血液\n【 Max 】13% 回帖堕落-1 血液+2、发帖堕落-1 血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201907/27/193142bqqek1ueo7kko27e.gif", 40],
            "2": ["https://img.gamemale.com/album/201907/27/193143ee6icntqvecxfvuq.gif", 82],
            "3": ["https://img.gamemale.com/album/201907/27/193145n9kv5nk0jk9xz9zi.gif", 124],
            "Max": ["https://img.gamemale.com/album/201907/27/193147he7pmn03vsezf3h1.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0197",
        "url_tid": "69805",
        "name": "圣甲虫秘典",
        "date": "2019-7-8",
        "buy_limit": "知识≥10",
        "price": "350金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+1▕▏升级条件：消耗50咒术\n【等级2】10% 回帖金币+1、发帖金币+2▕▏升级条件：知识≥100\n【等级3】15% 回帖金币+2、发帖金币+3▕▏升级条件：知识≥200\n【 Max 】20% 回帖金币+3、发帖金币+4",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201906/15/135814k2bz24ts5s26ob2i.gif", 40],
            "2": ["https://img.gamemale.com/album/201906/15/135815pfogpnp5sfdyqqaw.gif", 40],
            "3": ["https://img.gamemale.com/album/201906/15/135815ff9202zxw9lgzr3f.gif", 40],
            "Max": ["https://img.gamemale.com/album/201906/15/135817nbizvr1i51ia55sh.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0196",
        "url_tid": "69804",
        "name": "德拉克魂匣",
        "date": "2019-7-8",
        "buy_limit": "知识≥10",
        "price": "350血液",
        "levels": "【等级1】4% 回帖血液+1、发帖血液+1▕▏升级条件：知识≥60\n【等级2】8% 回帖血液+1、发帖血液+2▕▏升级条件：知识≥120\n【等级3】14% 回帖血液+1、发帖血液+2 咒术+1  ▕▏升级条件：知识≥180\n【 Max 】20% 回帖血液+2、发帖血液+3 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201906/15/135826cb99h5vvf7elhz97.gif", 40],
            "2": ["https://img.gamemale.com/album/201906/15/135827j1q81hlxgmx2vmut.gif", 40],
            "3": ["https://img.gamemale.com/album/201906/15/135828a39ugg996e5qu898.gif", 40],
            "Max": ["https://img.gamemale.com/album/201906/15/135829wj5j7qf7kq3qmmdz.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0195",
        "url_tid": "69803",
        "name": "达拉然",
        "date": "2019-7-8",
        "buy_limit": "旅程≥25，知识≥25",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201907/10/144049s9053mhdfv19aohf.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0194",
        "url_tid": "69802",
        "name": "麦迪文（Medivh）",
        "date": "2019-7-8",
        "buy_limit": "无",
        "price": "350金币",
        "levels": "【等级1】4% 发帖咒术+1▕▏升级条件：消耗66咒术\n【等级2】6% 回帖咒术+1、发帖咒术+1▕▏升级条件：堕落≥50\n【等级3】8% 回帖咒术+1、发帖咒术+1 堕落+1▕▏升级条件：堕落≥99\n【 Max 】12% 回帖咒术+1、发帖咒术+2 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201906/15/164740vi5aqudsrab3kak7.gif", 40],
            "2": ["https://img.gamemale.com/forum/202307/04/164256qff2s3glzfmsbag3.gif", 82],
            "3": ["https://img.gamemale.com/album/201906/15/164748jqcbfc5ddtqiuyy5.gif", 82],
            "Max": ["https://img.gamemale.com/album/201906/15/164751asnjhhgbnm3tzrzg.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0193",
        "url_tid": "69801",
        "name": "卡德加（Khadgar）",
        "date": "2019-7-8",
        "buy_limit": "无",
        "price": "350金币",
        "levels": "【等级1】3% 发帖堕落-1▕▏升级条件：咒术≥40\n【等级2】6% 回帖堕落-1、发帖知识+1 堕落-1▕▏升级条件：消耗80咒术\n【等级3】9% 回帖血液+1 堕落-1、发帖知识+1 堕落-1▕▏升级条件：消耗15堕落\n【 Max 】12% 回帖血液+2 堕落-1、发帖知识+1 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201906/15/165004x52a222uu29a9g22.gif", 40],
            "2": ["https://img.gamemale.com/album/201906/15/164639ina7rnpkjejrnl81.gif", 82],
            "3": ["https://img.gamemale.com/album/201906/15/164644dopsytovbbbdcdby.gif", 82],
            "Max": ["https://img.gamemale.com/album/201906/15/164652eslmh9x9m1gdm9d3.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0192",
        "url_tid": "69800",
        "name": "杰西·麦克雷",
        "date": "2019-7-8",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】5% 回帖金币+1、发帖堕落+1▕▏升级条件：发帖数≥100\n【等级2】8% 回帖金币+1、发帖堕落+1▕▏升级条件：主题数≥10\n【等级3】10% 回帖金币+1 堕落+1、发帖堕落+1▕▏升级条件：堕落≥40\n【等级4】15% 回帖金币+1 堕落+1、发帖旅程+1▕▏升级条件：消耗400血液\n【 Max 】15% 回帖金币+2 堕落+1、发帖旅程+1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201906/15/161024p33tfxtaxacfydvw.gif", 40],
            "2": ["https://img.gamemale.com/album/201906/15/161029ghu340b94o99yy3b.gif", 40],
            "3": ["https://img.gamemale.com/album/201906/15/161051bxw9gc9wc0d7qq1e.gif", 82],
            "4": ["https://img.gamemale.com/album/201906/15/161126nfgwga5j5xevggew.gif", 82],
            "Max": ["https://img.gamemale.com/album/201906/15/161013kdb5i5t55t099502.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0191",
        "url_tid": "69799",
        "name": "英普瑞斯",
        "date": "2019-7-8",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】3% 回帖堕落-1▕▏升级条件：追随≥70\n【等级2】7% 回帖堕落-1 血液+1、发帖血液+1▕▏升级条件：消耗300金币\n【等级3】10% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：血液≥700\n【 Max 】17% 回帖金币+1 血液+1、发帖金币+2 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201906/15/173436igg9unnun4fa3kkf.gif", 40],
            "2": ["https://img.gamemale.com/forum/202312/28/165816frtmueegxoexozno.gif", 40],
            "3": ["https://img.gamemale.com/album/201906/15/173440ew6lnuwken6wn6ve.gif", 82],
            "Max": ["https://img.gamemale.com/album/201906/15/173444wno2c6oe1o1zxe1k.gif", 82]
        }
    },
    {
        "type": "故事",
        "no": "0190",
        "url_tid": "69660",
        "name": "晃晃悠悠小矿车",
        "date": "2019-6-27",
        "buy_limit": "2019【Battle Royale】大逃杀活动第二期幸存至最后阶段",
        "price": "无",
        "levels": "【 Max 】勋章博物馆资料暂缺",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201906/27/215411gq10o10t0g07htyg.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0189",
        "url_tid": "69505",
        "name": "模擬人生4",
        "date": "2019-6-18",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201906/18/235456w4fidfi49q0qe9ic.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0188",
        "url_tid": "69504",
        "name": "GM村金蛋",
        "date": "2019-6-18",
        "buy_limit": "知识≥20",
        "price": "618金币",
        "levels": "【等级1】1% 发帖金币+1▕▏升级条件：知识≥35\n【等级2】12% 回帖金币+1、发帖金币+2▕▏升级条件：知识≥35\n【 Max 】25% 回帖金币+2、发帖金币+4",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201906/15/135724lqku3qsckaxsakak.gif", 40],
            "2": ["https://img.gamemale.com/album/201906/15/135723aez6hejh6s8655ej.gif", 40],
            "Max": ["https://img.gamemale.com/album/201906/15/135722mej8lc8ehc85hzty.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0187",
        "url_tid": "69503",
        "name": "贝优妮塔",
        "date": "2019-6-18",
        "buy_limit": "咒术≥10",
        "price": "280金币",
        "levels": "【等级1】5% 回帖堕落+1▕▏升级条件：消耗-10堕落\n【等级2】5% 回帖堕落+1 血液+1▕▏升级条件：追随≥70\n【 Max 】5% 回帖堕落+1 血液+1 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202303/01/152747k8u5ujhh14z4b41h.gif", 40],
            "2": ["https://img.gamemale.com/album/202303/01/152748ol96hyxzlddix9ql.gif", 40],
            "Max": ["https://img.gamemale.com/album/202303/01/152749zozo7ybk8n2bk4n7.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0186",
        "url_tid": "69302",
        "name": "秋水长天",
        "date": "2019-6-10",
        "buy_limit": "【六周年庆】活动期间完成指定任务",
        "price": "无",
        "levels": "【 Max 】6% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201903/22/170452tp6nwzyds0q4hqgp.gif", 124]
        }
    },
    {
        "type": "装备",
        "no": "0185",
        "url_tid": "69257",
        "name": "石鬼面",
        "date": "2019-6-9",
        "buy_limit": "血液≥30",
        "price": "233金币",
        "levels": "【等级1】9% 回帖咒术+1 血液-1▕▏升级条件：血液≥400\n【 Max 】18% 回帖咒术+1 血液-3 堕落+1、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/13/143512w4rjuijnorrrrpnz.gif", 40],
            "Max": ["https://img.gamemale.com/album/201905/13/143512y3drvvdv6r74hvdy.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0184",
        "url_tid": "69256",
        "name": "丹尼爾·紐曼",
        "date": "2019-6-9",
        "buy_limit": "主题数≥3",
        "price": "350金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：金币≥400\n【等级2】5% 回帖血液+1、发帖金币+1▕▏升级条件：血液≥400\n【等级3】8% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：追随≥100\n【 Max 】10% 回帖金币+1 血液+1、发帖金币+2 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/27/163959k72aczsn6xnpv7xd.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/27/164000f4sjz1ltjt04sq0z.gif", 40],
            "3": ["https://img.gamemale.com/album/201905/27/164000xjpzxqpvyvqbtg0b.gif", 40],
            "Max": ["https://img.gamemale.com/album/201905/27/164001f2ecryel2olmtgeo.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0183",
        "url_tid": "69255",
        "name": "内森·德雷克",
        "date": "2019-6-9",
        "buy_limit": "旅程≥10",
        "price": "600金币",
        "levels": "【等级1】4% 回帖血液+1▕▏升级条件：消耗333血液\n【等级2】6% 回帖血液+1▕▏升级条件：消耗10堕落\n【等级3】8% 回帖血液+1▕▏升级条件：消耗333血液\n【等级4】10% 回帖血液+2▕▏升级条件：消耗333血液\n【等级5】20% 回帖血液+3、发帖旅程+1▕▏升级条件：消耗-299金币\n【 Max 】15% 回帖血液+3、发帖血液+2 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/14/151624ennn7ni4o0gb0b4o.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/15/003906xcepjsobv9cveegj.gif", 82],
            "3": ["https://img.gamemale.com/album/201905/15/003908ntvs5s9sn9nswsws.gif", 82],
            "4": ["https://img.gamemale.com/album/201905/14/151630dr5qq16505ap1qqb.gif", 82],
            "5": ["https://img.gamemale.com/album/201909/12/222140mfizhhp14ghfyf04.gif", 82],
            "Max": ["https://img.gamemale.com/album/201906/09/152457mpoz7oayd7t0cpmz.gif", 124]
        }
    },
    {
        "type": "赠礼",
        "no": "0182",
        "url_tid": "69254",
        "name": "没有梦想的咸鱼",
        "date": "2019-6-9",
        "buy_limit": "只可赠送",
        "price": "1金币",
        "duration": "1天",
        "levels": "【 Max 】1% 回帖金币+1 血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201905/13/141900afyeyyf5yd1777q7.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0181",
        "url_tid": "69252",
        "name": "守望者徽章",
        "date": "2019-6-9",
        "buy_limit": "血液≥200",
        "price": "100金币",
        "levels": "【等级1】2% 回帖血液+1▕▏升级条件：消耗50血液\n【等级2】4% 回帖血液+1▕▏升级条件：消耗50血液\n【等级3】6% 回帖血液+2▕▏升级条件：堕落≥30\n【 Max 】8% 回帖血液+2 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/13/143550p26bib0lg688030z.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/13/143550pppz76pzmaa65ar5.gif", 40],
            "3": ["https://img.gamemale.com/album/201905/13/143551whb3qnhp4gqe8led.gif", 40],
            "Max": ["https://img.gamemale.com/album/201905/13/143645pumizv3ivt5043xf.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0180",
        "url_tid": "69251",
        "name": "黑墙",
        "date": "2019-6-9",
        "buy_limit": "旅程≥15",
        "price": "400金币",
        "levels": "【等级1】3% 回帖金币+1▕▏升级条件：追随≥20\n【等级2】6% 回帖金币+1 血液+1▕▏升级条件：消耗200金币\n【等级3】9% 回帖金币+1 血液+1▕▏升级条件：消耗200血液\n【等级4】13% 回帖血液+2、发帖金币+1 血液+3▕▏升级条件：堕落≥50\n【等级5】13% 回帖金币+1 血液+1、发帖金币+2 血液+2▕▏升级条件：堕落≥100\n【 Max 】13% 回帖金币+2、发帖金币+3 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/13/161743os11sof45ybrme1v.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/13/161742a7zbvtqzioditot0.gif", 40],
            "3": ["https://img.gamemale.com/album/201905/13/161742sdt0ku33u4dvwwnb.gif", 82],
            "4": ["https://img.gamemale.com/album/201905/13/161741mbzwshwbf1mssq81.gif", 82],
            "5": ["https://img.gamemale.com/album/201905/13/161741zykk71kvoxfxnv5r.gif", 82],
            "Max": ["https://img.gamemale.com/album/201905/13/162332i7g2znagk1mupqpg.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0179",
        "url_tid": "69219",
        "name": "眼镜蛇图腾",
        "date": "2019-6-8",
        "buy_limit": "无",
        "price": "88金币",
        "levels": "【 Max 】1% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201905/27/163944v16xxxcjvzlwf1x1.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0178",
        "url_tid": "69218",
        "name": "猎鹰图腾",
        "date": "2019-6-8",
        "buy_limit": "无",
        "price": "88金币",
        "levels": "【 Max 】2% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201905/27/163917k92k7ls57kyu9lll.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0177",
        "url_tid": "69217",
        "name": "山猫图腾",
        "date": "2019-6-8",
        "buy_limit": "无",
        "price": "88金币",
        "levels": "【 Max 】2% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201905/27/163930k6o7szvyahz5tyov.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0176",
        "url_tid": "69216",
        "name": "蛮族战士",
        "date": "2019-6-8",
        "buy_limit": "无",
        "price": "50金币",
        "levels": "【等级1】勋章博物馆资料暂缺\n【 Max 】5% 回帖血液+1",
        "levels_img": {
            "1": ["", 40],
            "Max": ["https://img.gamemale.com/forum/201912/23/124906rogngtdnng8qggqg.gif", 82]
        }
    },
    {
        "type": "宠物",
        "no": "0175",
        "url_tid": "69215",
        "name": "漆黑的蝎卵",
        "date": "2019-6-8",
        "buy_limit": "血液≥300",
        "price": "200金币",
        "levels": "【等级1】4% 回帖咒术+1、发帖咒术+1▕▏升级条件：灵魂≥1\n【 Max 】2% 回帖咒术+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/29/221614gsz87t06hg24xs44.gif", 40],
            "Max": ["https://img.gamemale.com/album/201905/29/221614vo15i74rqzr5jgme.gif", 40]
        }
    },
    {
        "type": "故事",
        "no": "0174",
        "url_tid": "69034",
        "name": "恋恋小烹锅",
        "date": "2019-5-28",
        "buy_limit": "2019【Battle Royale】大逃杀活动第一期幸存至最后阶段",
        "price": "无",
        "levels": "【等级1】勋章博物馆资料暂缺\n【等级2】2% 回帖血液+1▕▏升级条件：血液≥66【等级3】5% 回帖血液+1▕▏升级条件：血液≥175【等级10】10% 回帖血液+2▕▏升级条件：血液≥470【等级21】2% 回帖血液+1▕▏升级条件：血液≥1250\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/201905/28/142443ftc0rtzuxgfe8zke.gif", 40],
            "2": ["", 40],
            "3": ["", 40],
            "10": ["", 40],
            "21": ["", 40],
            "Max": ["", 40]
        }
    },
    {
        "type": "故事",
        "no": "0173",
        "url_tid": "68733",
        "name": "魔术师（The Magician，I）",
        "date": "2019-5-9",
        "buy_limit": "1、2019年商人弗霖的首秀活动隐藏成就奖励；2、TBC",
        "price": "无",
        "levels": "【等级1】勋章博物馆资料暂缺",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/201905/09/115630gfsosrrr2bllfbz8.gif", 40]
        }
    },
    {
        "type": "故事",
        "no": "0172",
        "url_tid": "68594",
        "name": "恋人(The Lovers，VI)",
        "date": "2019-5-4",
        "buy_limit": "1、2019年商人弗霖的首秀活动隐藏成就奖励；2、TBC",
        "price": "无",
        "levels": "【等级1】勋章博物馆资料暂缺",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/201905/04/183531p4qobi3cqnzknwom.gif", 40]
        }
    },
    {
        "type": "咒术",
        "no": "0171",
        "url_tid": "68502",
        "name": "石肤术",
        "date": "2019-5-1",
        "buy_limit": "血液≥15",
        "price": "4咒术",
        "duration": "3天",
        "levels": "【等级1】10% 回帖血液+1、发帖血液+1▕▏升级条件：血液≥200\n【等级2】20% 回帖血液+1、发帖血液+1▕▏升级条件：血液≥400\n【 Max 】40% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201904/25/215911w0mosld7ioygoetl.gif", 40],
            "2": ["https://img.gamemale.com/album/201904/25/215911s9p2292z0n2p1k1k.gif", 40],
            "Max": ["https://img.gamemale.com/album/201904/25/215911f1ezqwuqrpqau6if.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0170",
        "url_tid": "68501",
        "name": "迷之瓶",
        "date": "2019-5-1",
        "buy_limit": "注册天数≥1700，堕落≥20，旅程≥38，知识≥4",
        "price": "120金币",
        "levels": "【 Max 】5% 回帖堕落+1、发帖金币+1 堕落+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201904/25/220040n3u53zuebuaa10a3.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0169",
        "url_tid": "68500",
        "name": "康纳/Connor",
        "date": "2019-5-1",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】2% 回帖金币+1▕▏升级条件：消耗75金币\n【等级2】4% 回帖金币+1▕▏升级条件：消耗75血液\n【等级3】6% 回帖金币+1、发帖金币+1▕▏升级条件：消耗250金币\n【等级4】8% 回帖金币+1、发帖金币+1 血液+1▕▏升级条件：消耗250血液\n【等级5】8% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：追随≥50\n【 Max 】12% 回帖金币+2 血液+1、发帖金币+3 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201904/25/220108t5htttd3ttkkxsd5.gif", 40],
            "2": ["https://img.gamemale.com/album/201904/25/220108aind1aia4quizki1.gif", 82],
            "3": ["https://img.gamemale.com/album/201904/25/220108e4kjmoj4o4xk4hdj.gif", 82],
            "4": ["https://img.gamemale.com/album/201904/25/220107yf1mnxaz5311m0cc.gif", 82],
            "5": ["https://img.gamemale.com/album/201904/25/220107vxtl6jijx96qir6a.gif", 82],
            "Max": ["https://img.gamemale.com/album/201904/25/220108i9re7b6pbrsh5b67.gif", 82]
        }
    },
    {
        "type": "天赋",
        "no": "0168",
        "url_tid": "68499",
        "name": "野兽之子",
        "date": "2019-5-1",
        "buy_limit": "在线时间≥200，旅程≥20，知识≥20，追随≥20",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：金币≥200\n【等级2】3% 回帖知识+1 血液-1▕▏升级条件：金币≥400\n【等级3】5% 回帖知识+1 血液-1▕▏升级条件：金币≥600\n【等级4】7% 回帖知识+1 血液-1▕▏升级条件：金币≥800\n【 Max 】9% 回帖知识+1 血液-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201904/25/215934nntg7rcecucmnstr.gif", 40],
            "2": ["https://img.gamemale.com/album/201904/25/215933tfonxf5xigig6f11.gif", 40],
            "3": ["https://img.gamemale.com/album/201904/25/215933v44se4lk8vqattzx.gif", 40],
            "4": ["https://img.gamemale.com/album/201904/25/215932hj3prjjmzoxpzx6b.gif", 40],
            "Max": ["https://img.gamemale.com/album/201904/25/215932j062t60xte4s76rm.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0167",
        "url_tid": "68498",
        "name": "夏日的泰凯斯",
        "date": "2019-5-1",
        "buy_limit": "堕落≥30",
        "price": "666金币",
        "levels": "【等级1】5% 回帖堕落+1▕▏升级条件：堕落≥50\n【等级2】10% 回帖堕落+1 血液+1▕▏升级条件：消耗200血液\n【等级3】15% 回帖堕落+1 血液+2、发帖血液+3 堕落+1▕▏升级条件：消耗200金币\n【 Max 】25% 回帖金币-1 血液+3 堕落+1、发帖血液+5 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201904/25/220138bdd8slgridi8nzm4.gif", 40],
            "2": ["https://img.gamemale.com/album/201904/25/220139t8rrr68868roc288.gif", 82],
            "3": ["https://img.gamemale.com/album/201904/25/220139v20f8ccfv02hv78h.gif", 82],
            "Max": ["https://img.gamemale.com/album/201904/25/220139xhmwzhscmm2qppwc.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0166",
        "url_tid": "68497",
        "name": "泰凯斯·芬得利",
        "date": "2019-5-1",
        "buy_limit": "追随≥10",
        "price": "320金币",
        "levels": "【等级1】4% 回帖血液+1▕▏升级条件：血液≥100\n【等级2】6% 回帖血液+1、发帖金币+1▕▏升级条件：消耗150血液\n【等级3】8% 回帖血液+1、发帖金币+2▕▏升级条件：消耗200金币\n【 Max 】8% 回帖血液+2、发帖金币+2 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201904/25/220125weugylhuu0devlgh.gif", 40],
            "2": ["https://img.gamemale.com/album/201904/25/220124ji0zacxs4v77njby.gif", 82],
            "3": ["https://img.gamemale.com/album/201904/25/220124znuounld3adujqe0.gif", 82],
            "Max": ["https://img.gamemale.com/album/201904/25/220123zsvo8j4vc3vv4lb2.gif", 82]
        }
    },
    {
        "type": "故事",
        "no": "0165",
        "url_tid": "68453",
        "name": "战车(The Chariot , VII)",
        "date": "2019-4-27",
        "buy_limit": "1、2019年龙之祭典活动，获得战果与敏感教官相同；2、TBC",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201904/27/224907qj06ilujce7ger1j.gif", 40]
        }
    },
    {
        "type": "故事",
        "no": "0164",
        "url_tid": "68452",
        "name": "倒吊人(The Hanged Man , XII)",
        "date": "2019-4-27",
        "buy_limit": "1、2019年龙之祭典活动，获得战果为负数；2、TBC",
        "price": "无",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201904/27/224359w2fj8yzlzobsokok.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0163",
        "url_tid": "68451",
        "name": "红龙秘宝",
        "date": "2019-4-27",
        "buy_limit": "参与2019年龙之祭典活动",
        "price": "无",
        "levels": "【等级1】1% 回帖咒术+1▕▏升级条件：在线时间≥50\n【等级2】2% 回帖咒术+1▕▏升级条件：知识≥30\n【等级3】勋章博物馆资料暂缺\n【 Max 】5% 回帖血液-1 咒术+1、发帖旅程+1 血液-2 咒术+2\n",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201904/05/133431soml9tz97hj886ms.gif", 40],
            "2": ["https://img.gamemale.com/album/201904/05/133431xdqel3foxfrlrzs3.gif", 40],
            "3": ["", 40],
            "Max": ["https://img.gamemale.com/album/201905/02/162617o0eeugch32h4gcee.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0162",
        "url_tid": "68449",
        "name": "红龙精华",
        "date": "2019-4-27",
        "buy_limit": "2019年龙之祭典活动，参与奖励",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：消耗-20血液\n【等级2】2% 回帖血液+1▕▏升级条件：发帖数≥100\n【等级3】3% 回帖血液+1▕▏升级条件：主题数≥15\n【 Max 】5% 回帖血液+2、发帖血液+2 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201904/05/133448idcp0w9xn9d03955.gif", 40],
            "2": ["https://img.gamemale.com/album/201904/05/133449mf9rjxd4z9oh4eop.gif", 40],
            "3": ["https://img.gamemale.com/album/201904/05/133449ozlsqxtzedtl4te4.gif", 40],
            "Max": ["https://img.gamemale.com/album/201904/05/133449cw8gu1u449zbis5g.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0161",
        "url_tid": "68448",
        "name": "龙之魂火",
        "date": "2019-4-27",
        "buy_limit": "2019年龙之祭典活动，获得战果第一",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：消耗-1灵魂\n【 Max 】30% 发帖金币+8 血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202402/17/010453s7b2bg07zm7i4pbk.gif", 40],
            "Max": ["https://img.gamemale.com/forum/202402/17/010453ux5zc1j71109j4in.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0160",
        "url_tid": "68274",
        "name": "腐化龙蛋",
        "date": "2019-4-14",
        "buy_limit": "金币≥200",
        "price": "150金币",
        "levels": "【等级1】无属性▕▏升级条件：堕落≥10\n【等级2】5% 回帖金币+1 血液-1▕▏升级条件：堕落≥40\n【 Max 】10% 回帖金币+2 血液-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/29/221508dnthzuhb4vjtjhrk.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/29/221509oxk3x1xrv3ekbexb.gif", 40],
            "Max": ["https://img.gamemale.com/album/201905/29/221510cud528wqukfiuhui.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0159",
        "url_tid": "68273",
        "name": "黑龙蛋",
        "date": "2019-4-14",
        "buy_limit": "咒术≥20",
        "price": "150金币",
        "levels": "【等级1】无属性▕▏升级条件：咒术≥10\n【等级2】5% 回帖咒术+1 金币-1▕▏升级条件：咒术≥40\n【 Max 】10% 回帖咒术+1 金币-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/29/221510np6i8yhy9ij97dae.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/29/221510lacb4yydd5sar98a.gif", 40],
            "Max": ["https://img.gamemale.com/album/201905/29/221511xr8zyyk40ykz0rrk.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0158",
        "url_tid": "68272",
        "name": "红龙蛋",
        "date": "2019-4-14",
        "buy_limit": "血液≥200",
        "price": "150金币",
        "levels": "【等级1】无属性▕▏升级条件：血液≥20\n【等级2】5% 回帖血液+1 金币-1▕▏升级条件：血液≥250\n【 Max 】10% 回帖血液+2 金币-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/29/221511ipvssp898p8hc3c8.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/29/221511qq76xzqs69ecww6x.gif", 40],
            "Max": ["https://img.gamemale.com/album/201905/29/232224ebv13yqbonyaji33.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0157",
        "url_tid": "68061",
        "name": "网中的皮卡丘",
        "date": "2019-4-1",
        "buy_limit": "2019年愚人节期间，勋章商城限时免费获取",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖血液+1 ",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201904/01/004302lptqdp41p5g0f7bz.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0156",
        "url_tid": "68060",
        "name": "变骚喷雾",
        "date": "2019-4-1",
        "buy_limit": "只可赠送",
        "price": "13金币",
        "duration": "5天",
        "levels": "【 Max 】5% 回帖堕落+1 金币+1、发帖堕落+1 金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201905/13/141915cv3595x475qhqg2v.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0155",
        "url_tid": "68059",
        "name": "亚瑟·库瑞（海王）",
        "date": "2019-4-1",
        "buy_limit": "咒术≤30",
        "price": "450金币",
        "levels": "【等级1】2% 回帖血液+1▕▏升级条件：旅程≥30\n【等级2】3% 回帖血液+1、发帖血液+1▕▏升级条件：追随≥100\n【等级3】5% 回帖血液+1、发帖血液+2▕▏升级条件：消耗200血液\n【等级4】8% 回帖血液+2、发帖血液+2▕▏升级条件：消耗50咒术\n【 Max 】12% 回帖血液+3、发帖血液+3 咒术+1",
        "levels_img": {
            "1": ["", 40],
            "2": ["https://img.gamemale.com/album/201903/30/221924mzczyqqwbwb6ydd3.gif", 40],
            "3": ["https://img.gamemale.com/album/201903/30/225516atxf4bxba0ng7bs4.gif", 82],
            "4": ["https://img.gamemale.com/album/201903/30/225516l56llaodn6alxlwa.gif", 82],
            "Max": ["https://img.gamemale.com/album/201903/30/221924z0pcz7i0imphziep.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0154",
        "url_tid": "68058",
        "name": "亚瑟‧摩根",
        "date": "2019-4-1",
        "buy_limit": "堕落≥10",
        "price": "500金币",
        "levels": "【等级1】4% 发帖金币+1▕▏升级条件：消耗200血液\n【等级2】4% 回帖金币+1、发帖金币+1▕▏升级条件：消耗300金币\n【等级3】6% 回帖金币+1、发帖金币+1▕▏升级条件：追随≥100\n【等级4】8% 回帖金币+1、发帖金币+2 血液+1▕▏升级条件：消耗-2旅程\n【等级5】12% 回帖金币+2、发帖金币+2 旅程+1▕▏升级条件：消耗-15堕落\n【 Max 】16% 回帖金币+3、发帖金币+3 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202410/28/144101dzbf6jb1fbhk1vq1.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/01/212353bvkfigugvnal66ay.gif", 40],
            "3": ["https://img.gamemale.com/album/201910/03/155946zhuz8xqvudj84zro.gif", 40],
            "4": ["https://img.gamemale.com/forum/202303/14/052233lpa2spsmt4pqk1jj.gif", 40],
            "5": ["https://img.gamemale.com/album/201905/01/211213qzdjyc62uaajpvdw.gif", 82],
            "Max": ["https://img.gamemale.com/album/201903/30/134405f7rx7vpphocupvr9.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0153",
        "url_tid": "68057",
        "name": "生化危机：复仇",
        "date": "2019-4-1",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖金币+1 血液+1 ",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201905/02/162545e5u7u55q50cqeu49.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0152",
        "url_tid": "68056",
        "name": "浪潮之歌",
        "date": "2019-4-1",
        "buy_limit": "旅程≥70",
        "price": "300金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗1旅程\n【等级2】无属性▕▏升级条件：消耗1旅程\n【等级3】无属性▕▏升级条件：消耗1旅程\n【等级4】无属性▕▏升级条件：消耗1旅程\n【等级5】无属性▕▏升级条件：消耗1旅程\n【等级6】无属性▕▏升级条件：消耗1旅程\n【等级7】无属性▕▏升级条件：消耗1旅程\n【等级8】无属性▕▏升级条件：消耗1旅程\n【等级9】无属性▕▏升级条件：消耗1旅程\n【等级10】无属性▕▏升级条件：消耗-9旅程\n【 Max 】3% 回帖金币+1 旅程+1、发帖金币+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201903/25/125728xneaguzlbhdbgfnz.gif", 40],
            "2": ["https://img.gamemale.com/forum/202201/30/185253p7p1puhphkluzj5p.gif", 40],
            "3": ["https://img.gamemale.com/album/201903/23/152214aa2z2bsjfb31onjn.gif", 82],
            "4": ["https://img.gamemale.com/album/201903/23/152213iz2opzd1ddridu8a.gif", 82],
            "5": ["https://img.gamemale.com/album/201903/23/152213ra44h7coenacuvzf.gif", 124],
            "6": ["https://img.gamemale.com/forum/202201/30/185239jbbhsxs8hnrb3dxv.gif", 124],
            "7": ["https://img.gamemale.com/forum/202201/30/185236ugggahhjuhaffexo.gif", 124],
            "8": ["https://img.gamemale.com/forum/202201/30/185235fy8krl3ipryyr3ry.gif", 124],
            "9": ["https://img.gamemale.com/forum/202201/30/185235o1vv0g4m6g4wz7hv.gif", 124],
            "10": ["https://img.gamemale.com/album/201909/12/223433t8xo5cke7v2222lz.gif", 124],
            "Max": ["https://img.gamemale.com/album/201906/24/230649r0a8qd8jv3xx4rx3.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0151",
        "url_tid": "17946",
        "name": "岛田半藏",
        "date": "2019-3-22",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】2% 回帖血液+1▕▏升级条件：知识≥10\n【等级2】5% 回帖血液+1▕▏升级条件：旅程≥25\n【等级3】5% 回帖金币+1 血液+1▕▏升级条件：消耗100咒术\n【 Max 】10% 回帖金币+1 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201903/25/124807ilv7ukppsly5xzvs.gif", 40],
            "2": ["", 124],
            "3": ["https://img.gamemale.com/album/201903/25/124830atf2tt6r7rk6p222.gif", 82],
            "Max": ["https://img.gamemale.com/album/201903/25/124839q9icp8ngo8b9oopd.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0150",
        "url_tid": "15660",
        "name": "华灯初上",
        "date": "2016-6-11",
        "buy_limit": "【三周年庆】活动期间完成指定任务",
        "price": "无",
        "levels": "【 Max 】3% 回帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201903/28/132731cqp99zzhfrqknhon.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0149",
        "url_tid": "15581",
        "name": "章鱼小丸子",
        "date": "2016-5-2",
        "buy_limit": "无（该勋章不可寄售，仅可回收）",
        "price": "150金币",
        "levels": "【等级1】10% 回帖血液+1▕▏升级条件：消耗-10血液\n【等级2】7% 回帖血液+1▕▏升级条件：消耗-20血液\n【等级3】5% 回帖血液+1▕▏升级条件：消耗-20血液\n【等级4】3% 回帖血液+2▕▏升级条件：消耗-30血液\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201605/02/190017xrggpmz5mm540fbf.gif", 40],
            "2": ["https://img.gamemale.com/album/201605/02/190018sse467j756l6ku6k.gif", 40],
            "3": ["https://img.gamemale.com/album/201605/02/190018yprf2grlre5k5ll7.gif", 40],
            "4": ["https://img.gamemale.com/album/201605/02/190018oj1a1az9nnag8alb.gif", 40],
            "Max": ["https://img.gamemale.com/album/201605/02/190019q51b50e7rb33crj5.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0148",
        "url_tid": "15580",
        "name": "罗宾·西克",
        "date": "2016-5-2",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】5% 回帖堕落+1▕▏升级条件：堕落≥20\n【等级2】5% 回帖堕落+2▕▏升级条件：堕落≥50\n【等级3】10% 回帖堕落+2 血液-1▕▏升级条件：消耗200血液\n【 Max 】15% 回帖堕落-1 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201605/02/192230msgyjyk28ygyfsz2.gif", 40],
            "2": ["https://img.gamemale.com/album/201605/02/192231x0062ad60a2nzxaa.gif", 82],
            "3": ["https://img.gamemale.com/album/201605/02/192233idmhdmetnznuznig.gif", 82],
            "Max": ["https://img.gamemale.com/album/201605/02/192236gla0r2kxk582ikaa.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0147",
        "url_tid": "15286",
        "name": "安德鲁·库珀",
        "date": "2016-2-23",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】2% 回帖金币+1 血液-1▕▏升级条件：消耗200血液\n【等级2】5% 回帖金币+2 血液-1▕▏升级条件：消耗300血液\n【 Max 】10% 回帖金币+3 血液-1、发帖金币+3 血液-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201602/20/154456o7n5yw25svraaray.gif", 40],
            "2": ["https://img.gamemale.com/album/201602/20/154520mnndxpplv03vygiz.gif", 40],
            "Max": ["https://img.gamemale.com/album/201602/20/154600zvbkq6ap88u8cb82.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0146",
        "url_tid": "15285",
        "name": "克里斯·埃文斯",
        "date": "2016-2-23",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】2% 回帖血液+1、发帖血液+1▕▏升级条件：追随≥50\n【等级2】3% 回帖血液+2、发帖血液+2▕▏升级条件：消耗300金币\n【 Max 】5% 回帖血液+2 旅程+1、发帖血液+2 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201602/20/134918obx15k16jr1z9289.gif", 40],
            "2": ["https://img.gamemale.com/album/201602/20/134920l1v1zmcb5hcphbh8.gif", 40],
            "Max": ["https://img.gamemale.com/album/201602/20/134923vzoej3ktzjfdfjoy.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0145",
        "url_tid": "15284",
        "name": "变形软泥",
        "date": "2016-2-23",
        "buy_limit": "无",
        "price": "66金币",
        "levels": "【等级1】无属性▕▏升级条件：堕落≥13\n【等级2】3% 回帖堕落+2▕▏升级条件：消耗166金币\n【 Max 】6% 回帖堕落+2、发帖咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201602/17/173704elkqqcgulk7zk7l0.gif", 40],
            "2": ["https://img.gamemale.com/album/201602/17/173706j9bxb16kp9rrbnp8.gif", 40],
            "Max": ["https://img.gamemale.com/album/201602/17/173708agqrxjycxttbrtqx.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0144",
        "url_tid": "15171",
        "name": "新年小猴",
        "date": "2016-2-12",
        "buy_limit": "参与2016年新年送祝福活动",
        "price": "无",
        "levels": "【 Max 】2% 回帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201903/28/133155terps1p1vdswv1vj.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0143",
        "url_tid": "14029",
        "name": "传承之证",
        "date": "2015-11-6",
        "buy_limit": "参加2015文学区活动",
        "price": "无",
        "levels": "【等级1】2% 回帖血液+1 堕落-1▕▏升级条件：消耗-66金币\n【 Max 】2% 回帖血液+1 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201511/06/205320bjh882rpfrx9s9n8.gif", 40],
            "Max": ["https://img.gamemale.com/album/201511/06/205320yiuyyzq4uhwxyrnd.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0142",
        "url_tid": "13572",
        "name": "骑士遗盔",
        "date": "2015-9-27",
        "buy_limit": "无",
        "price": "275金币",
        "levels": "【等级1】1% 回帖咒术+1▕▏升级条件：消耗25金币\n【等级2】2% 回帖咒术+1、发帖知识+1▕▏升级条件：消耗50金币\n【等级3】3% 回帖咒术+1、发帖知识+1▕▏升级条件：消耗100金币\n【 Max 】5% 回帖咒术+1 血液+1、发帖知识+1 ",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201509/26/024157gndzyd7479b9bnb3.jpg", 40],
            "2": ["https://img.gamemale.com/album/201509/26/024157pwzikwik96gwo9wg.gif", 40],
            "3": ["https://img.gamemale.com/album/201509/26/024157hkroo2cmhi25rhko.gif", 40],
            "Max": ["https://img.gamemale.com/album/201509/26/024158edglovvmomaj3a5v.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0141",
        "url_tid": "13563",
        "name": "月亮的蛋",
        "date": "2015-9-26",
        "buy_limit": "2015年中秋节限时购买徽章",
        "price": "200金币",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：发帖数≥30（手动升级）\n【等级2】5% 回帖血液+1、发帖咒术+2▕▏升级条件：主题数≥10（手动升级）\n【等级3】8% 回帖血液+1、发帖咒术+2▕▏升级条件：堕落≥60\n【 Max 】1% 回帖咒术+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201509/25/235212i4j3qhjjkrb1ht3k.gif", 40],
            "2": ["https://img.gamemale.com/album/201509/25/235213vggo1nm9eqf9n9zf.gif", 40],
            "3": ["https://img.gamemale.com/album/201509/25/235213tig7qspx77h7sffi.gif", 82],
            "Max": ["https://img.gamemale.com/album/201509/25/235214pcacmveccm9hcqzc.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0140",
        "url_tid": "13562",
        "name": "天涯.此时",
        "date": "2015-9-26",
        "buy_limit": "2015年中秋节纪念徽章，限时免费领取",
        "price": "无",
        "levels": "【 Max 】1% 发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/forum/201903/28/135700yria5z8lr8ar7fir.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0139",
        "url_tid": "13287",
        "name": "维克多‧天火",
        "date": "2015-8-29",
        "buy_limit": "堕落≤50",
        "price": "460金币",
        "levels": "【等级1】3% 回帖金币-1 血液+2 ▕▏升级条件：血液≥150\n【等级2】3% 回帖金币+1、发帖血液+2▕▏升级条件：消耗55堕落\n【等级3】10% 回帖金币+1 血液+1、发帖血液+2▕▏升级条件：知识≥30\n【等级4】25% 发帖金币+10▕▏升级条件：旅程≥99\n【 Max 】1% 回帖血液+5、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201508/29/061434xqhzkxed59mzzuon.gif", 40],
            "2": ["https://img.gamemale.com/album/201508/29/061434x2lngcl8lz62v2d6.gif", 40],
            "3": ["https://img.gamemale.com/forum/202209/15/222129x2cj2f906000905s.gif", 40],
            "4": ["https://img.gamemale.com/album/201508/29/061435lcfkyy1ywbg5fpww.gif", 40],
            "Max": ["https://img.gamemale.com/album/201508/29/061435ebbaab1jczbn64nn.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0138",
        "url_tid": "13286",
        "name": "阿尔萨斯‧米奈希尔",
        "date": "2015-8-29",
        "buy_limit": "无",
        "price": "350金币",
        "levels": "【等级1】7% 回帖堕落+1、发帖咒术+2▕▏升级条件：堕落≥50\n【 Max 】15% 回帖血液+1、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201508/29/062410iizv9pimopiffe5d.gif", 40],
            "Max": ["https://img.gamemale.com/album/201508/29/062410wqfw2l25dzl32d3a.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0137",
        "url_tid": "13183",
        "name": "心之水晶",
        "date": "2015-8-20",
        "buy_limit": "参加2015年七夕截图活动",
        "price": "无",
        "levels": "【 Max 】3% 回帖血液+1、发帖血液+2",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201508/13/214918tqf9xiacvf9eufi8.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0136",
        "url_tid": "12931",
        "name": "史莱姆蛋",
        "date": "2015-7-30",
        "buy_limit": "发帖数≥30",
        "price": "220血液",
        "levels": "【等级1】3% 回帖咒术+1▕▏升级条件：消耗50金币\n【等级2】6% 回帖咒术+1▕▏升级条件：消耗75金币\n【等级3】9% 回帖咒术+1▕▏升级条件：消耗100金币\n【 Max 】12% 回帖咒术+1、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/29/221541e62b7qx0m6lyho7x.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/29/221542tzogir48pzlfl88f.gif", 40],
            "3": ["https://img.gamemale.com/album/201905/29/221542qr11qay13qbbqkut.gif", 40],
            "Max": ["https://img.gamemale.com/album/201905/29/221542d3pgoo0zozcg3g0o.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0135",
        "url_tid": "12701",
        "name": "神秘商店贵宾卡",
        "date": "2015-7-1",
        "buy_limit": "只可赠送，知识≥10",
        "price": "50金币",
        "duration": "7天",
        "levels": "【等级1】10% 回帖金币+2▕▏升级条件：咒术≥20\n【等级2】20% 回帖金币+2、发帖旅程+1▕▏升级条件：咒术≥60\n【 Max 】30% 回帖金币+3、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/113510j9kkzz91hb091zy0.gif", 40],
            "2": ["https://img.gamemale.com/album/201507/02/113511txf3f8fihqst2q1f.gif", 40],
            "Max": ["https://img.gamemale.com/album/201507/02/113511lc67q9rjxjr3u6oj.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0134",
        "url_tid": "12700",
        "name": "库伦 (审判)",
        "date": "2015-7-1",
        "buy_limit": "无",
        "price": "450金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：知识≥16\n【等级2】7% 回帖血液+1、发帖血液+1▕▏升级条件：消耗350血液\n【等级3】15% 回帖血液+2、发帖血液+2▕▏升级条件：血液≥200\n【 Max 】10% 回帖血液+1、发帖血液+1 金币+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201506/30/100229gqdnldqo1pdyouyp.gif", 40],
            "2": ["https://img.gamemale.com/album/201506/30/100231lnikkp2yah8rk8ns.gif", 40],
            "3": ["https://img.gamemale.com/album/201506/30/100233xkttdtsss9e94bdb.gif", 40],
            "Max": ["https://img.gamemale.com/album/201506/30/100236nlx10m5j5nq6hqnx.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0133",
        "url_tid": "12670",
        "name": "詹米·多南",
        "date": "2015-6-26",
        "buy_limit": "无",
        "price": "320金币",
        "levels": "【等级1】5% 回帖血液+1 堕落+1、发帖血液+2 堕落+1▕▏升级条件：消耗60咒术\n【 Max 】10% 回帖血液+1 堕落+1、发帖血液+2 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201506/30/092042fmhmkpquik3kifu2.gif", 40],
            "Max": ["https://img.gamemale.com/album/201506/30/092043t1qsm2t42m2sshfx.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0132",
        "url_tid": "12659",
        "name": "BIG BOSS",
        "date": "2015-6-25",
        "buy_limit": "堕落>20",
        "price": "600金币",
        "levels": "【等级1】3% 回帖堕落+1、发帖堕落+1▕▏升级条件：消耗500血液\n【等级2】5% 回帖金币+1 堕落+1、发帖堕落+1▕▏升级条件：消耗1灵魂\n【等级3】10% 回帖金币+1 堕落+1、发帖堕落+1▕▏升级条件：金币≥1000\n【 Max 】20% 回帖金币+1 血液+1、发帖金币+3 血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201506/30/084906nh183f8ffmz2008m.gif", 40],
            "2": ["https://img.gamemale.com/album/201506/30/084907o6jcmbo2jlcpnvrr.gif", 40],
            "3": ["https://img.gamemale.com/album/201506/30/084908mj6fhkzkx0p184fg.gif", 40],
            "Max": ["https://img.gamemale.com/album/201506/30/084909kzw2ato99959o5nt.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0131",
        "url_tid": "12658",
        "name": "Frank (LBF)",
        "date": "2015-6-25",
        "buy_limit": "无",
        "price": "270金币",
        "levels": "【等级1】3% 回帖血液+1▕▏升级条件：主题数≥10\n【等级2】6% 回帖血液+1▕▏升级条件：追随≥30\n【等级3】10% 回帖血液+1▕▏升级条件：旅程≥90\n【 Max 】10% 回帖血液+1 堕落-1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201506/30/071640migik8q248qyii22.gif", 40],
            "2": ["https://img.gamemale.com/album/201506/30/071641dbzqnkn7in8zt8pn.gif", 40],
            "3": ["https://img.gamemale.com/album/201506/30/071641t302dm1mfnwff1mi.gif", 40],
            "Max": ["https://img.gamemale.com/album/201506/30/071642wq9fqxqc2xss9fs4.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0130",
        "url_tid": "12655",
        "name": "勇者与龙之书",
        "date": "2015-6-24",
        "buy_limit": "旅程≥12",
        "price": "300金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗1旅程\n【等级2】无属性▕▏升级条件：消耗1旅程\n【等级3】无属性▕▏升级条件：消耗1旅程\n【等级4】无属性▕▏升级条件：消耗1旅程\n【等级5】无属性▕▏升级条件：消耗1旅程\n【等级6】无属性▕▏升级条件：消耗1旅程\n【等级7】无属性▕▏升级条件：消耗1旅程\n【等级8】无属性▕▏升级条件：消耗1旅程\n【等级9】无属性▕▏升级条件：消耗1旅程\n【等级10】无属性▕▏升级条件：消耗-9旅程\n【 Max 】3% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201506/30/052451g28wj4d8xkahdl6z.gif", 40],
            "2": ["https://img.gamemale.com/album/201506/30/052453w9md0sd32kd53mm3.gif", 124],
            "3": ["https://img.gamemale.com/album/201506/30/052454e4path6a4pt5akp6.gif", 124],
            "4": ["https://img.gamemale.com/album/201506/30/052456q3skbmybryymrssa.gif", 124],
            "5": ["https://img.gamemale.com/album/201506/30/052457g8k9dwuoekouo279.gif", 124],
            "6": ["https://img.gamemale.com/album/201506/30/052458cresf1dzq8l8d88a.gif", 124],
            "7": ["https://img.gamemale.com/album/201506/30/052459pnqhuhxqhxu9nv90.gif", 124],
            "8": ["https://img.gamemale.com/album/201506/30/052500wnuom40997tn0pbt.gif", 124],
            "9": ["https://img.gamemale.com/album/201506/30/052500s10gjrr8j158m8a1.gif", 124],
            "10": ["https://img.gamemale.com/album/201506/30/052501f9rprb4hj9uhvb9u.gif", 124],
            "Max": ["https://img.gamemale.com/album/201506/30/052502dvq83ddrq08xc33d.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0129",
        "url_tid": "12653",
        "name": "萨赫的蛋糕",
        "date": "2015-6-24",
        "buy_limit": "只可赠送，知识≥5",
        "price": "40金币",
        "duration": "14天",
        "levels": "【 Max 】10% 回帖血液+2、发帖血液+2",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201507/02/113515vyfn72h7yw5ad3t7.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0128",
        "url_tid": "12647",
        "name": "雪王的心脏",
        "date": "2015-6-23",
        "buy_limit": "旅程≥12",
        "price": "180金币",
        "levels": "【等级1】2% 回帖旅程+1▕▏升级条件：消耗30咒术\n【等级2】2% 回帖知识+1 旅程+1、发帖知识+1 旅程+1▕▏升级条件：消耗50咒术\n【 Max 】3% 回帖知识+1 旅程+1、发帖知识+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201506/30/022607ascozyvzegz08y8x.gif", 40],
            "2": ["https://img.gamemale.com/album/201506/30/022607g6k7i7aeazva9jce.gif", 40],
            "Max": ["https://img.gamemale.com/album/201506/30/022608hqvtsv2qs3t77sm0.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0127",
        "url_tid": "12646",
        "name": "婴儿泪之瓶",
        "date": "2015-6-23",
        "buy_limit": "无",
        "price": "200金币",
        "levels": "【等级1】2% 回帖堕落-1、发帖堕落-1▕▏升级条件：消耗50金币\n【等级2】2% 回帖堕落-1 知识+1、发帖堕落-1 知识+1▕▏升级条件：消耗100金币\n【 Max 】3% 回帖堕落-1 知识+1、发帖堕落-1 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201506/30/022601prkzkzyv3xzdgx89.gif", 40],
            "2": ["https://img.gamemale.com/album/201506/30/022601h9r55h1cshi2h9ml.gif", 40],
            "Max": ["https://img.gamemale.com/album/201506/30/022602qk3u3zx5b6vx66bw.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0126",
        "url_tid": "12645",
        "name": "戴尔‧芭芭拉",
        "date": "2015-6-23",
        "buy_limit": "无",
        "price": "280金币",
        "levels": "【等级1】无属性▕▏升级条件：血液≥250\n【等级2】3% 发帖堕落+1▕▏升级条件：堕落≥10\n【 Max 】3% 回帖堕落-1 血液+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201506/29/235058iuzdrrmrwnn25m7g.gif", 40],
            "2": ["https://img.gamemale.com/album/201506/29/235059pjth6nn75txh3t5n.gif", 40],
            "Max": ["https://img.gamemale.com/album/201506/29/235100c0sbkrsmldu80wmh.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0125",
        "url_tid": "12547",
        "name": "秘密森林",
        "date": "2015-6-7",
        "buy_limit": "【两周年庆】活动期间免费领取",
        "price": "无",
        "levels": "【 Max 】2% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201505/23/100508nbneax4fqx0if336.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0124",
        "url_tid": "12380",
        "name": "种植菊花",
        "date": "2015-5-23",
        "buy_limit": "无",
        "price": "110金币",
        "levels": "【等级1】1% 回帖堕落+1▕▏升级条件：消耗20血液\n【等级2】3% 回帖堕落+1▕▏升级条件：消耗50血液\n【等级3】5% 回帖血液+1 堕落+1▕▏升级条件：消耗-30金币\n【 Max 】3% 回帖金币+1 堕落+1、发帖血液-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/23/212248whtdbdmaandajnzq.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/23/212248kckqovkeqcvvfixt.gif", 40],
            "3": ["https://img.gamemale.com/album/201505/23/212247sby8m8z8v78lnvh1.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/23/212247l4bir5tr8cb884le.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0123",
        "url_tid": "12379",
        "name": "这是一片丛林",
        "date": "2015-5-23",
        "buy_limit": "无",
        "price": "120金币",
        "levels": "【等级1】无属性▕▏升级条件：堕落≥35\n【等级2】3% 回帖咒术+1▕▏升级条件：堕落≥70\n【 Max 】3% 回帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/23/212240v28sdqczjd8sdqfg.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/23/212241gh8t1lyeew8ylt9y.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/23/212241brrmb3idbjzlkbqj.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0122",
        "url_tid": "12378",
        "name": "史莱姆养殖证书",
        "date": "2015-5-23",
        "buy_limit": "无",
        "price": "60金币",
        "levels": "【等级1】1% 回帖金币+1▕▏升级条件：消耗100金币\n【等级2】2% 回帖金币+1▕▏升级条件：消耗100金币\n【等级3】3% 回帖金币+1▕▏升级条件：消耗100金币\n【等级4】4% 回帖金币+1▕▏升级条件：消耗100金币\n【等级5】5% 回帖金币+1▕▏升级条件：消耗100金币\n【等级6】8% 回帖金币+1▕▏升级条件：知识≥8\n【等级7】8% 回帖金币+1▕▏升级条件：消耗100金币\n【等级8】12% 回帖金币+1▕▏升级条件：知识≥12\n【等级9】12% 回帖金币+1▕▏升级条件：消耗100金币\n【等级10】15% 回帖金币+1▕▏升级条件：知识≥15\n【等级11】15% 回帖金币+1▕▏升级条件：消耗100金币\n【等级12】18% 回帖金币+1▕▏升级条件：知识≥20\n【等级13】18% 回帖金币+1▕▏升级条件：消耗100金币\n【等级14】21% 回帖金币+1▕▏升级条件：知识≥25\n【等级15】21% 回帖金币+1▕▏升级条件：消耗100金币\n【等级16】25% 回帖金币+1▕▏升级条件：知识≥30\n【等级17】25% 回帖金币+1▕▏升级条件：消耗100金币\n【等级18】28% 回帖金币+1▕▏升级条件：知识≥35\n【等级19】28% 回帖金币+1▕▏升级条件：消耗100金币\n【等级20】31% 回帖金币+1▕▏升级条件：知识≥40\n【等级21】31% 回帖金币+1▕▏升级条件：消耗100金币\n【等级22】35% 回帖金币+1▕▏升级条件：知识≥45\n【等级23】35% 回帖金币+1▕▏升级条件：消耗100金币\n【等级24】38% 回帖金币+1▕▏升级条件：知识≥50\n【等级25】38% 回帖金币+1▕▏升级条件：消耗100金币\n【等级26】42% 回帖金币+1▕▏升级条件：知识≥55\n【等级27】42% 回帖金币+1▕▏升级条件：消耗100金币\n【等级28】45% 回帖金币+1▕▏升级条件：知识≥60\n【等级29】45% 回帖金币+1▕▏升级条件：消耗100金币\n【等级30】48% 回帖金币+1▕▏升级条件：消耗20知识\n【等级31】无属性▕▏升级条件：血液≥6\n【等级32】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥160\n【等级33】25% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥170\n【等级34】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥320\n【等级35】70% 回帖金币+1 咒术+1、发帖金币+1▕▏升级条件：血液≥322\n【等级36】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥460\n【等级37】25% 回帖血液-1▕▏升级条件：血液≥470\n【等级38】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥580\n【等级39】100% 回帖金币+1 血液+1、发帖金币+1▕▏升级条件：血液≥620\n【等级40】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥700\n【等级41】15% 回帖咒术+1 金币+1、发帖金币+1▕▏升级条件：血液≥720\n【等级42】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥820\n【等级43】100% 回帖金币+1 血液+1、发帖金币+1▕▏升级条件：血液≥850\n【等级44】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥990\n【等级45】25% 回帖血液-1、咒术+1▕▏升级条件：血液≥1000\n【等级46】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1130\n【等级47】35% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1150\n【等级48】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1280\n【等级49】100% 回帖金币+1 血液+1、发帖金币+1▕▏升级条件：血液≥1340\n【等级50】70% 回帖金币+1 咒术+1、发帖金币+1▕▏升级条件：血液≥1342\n【等级51】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1470\n【等级52】10% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1500\n【等级53】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1610\n【等级54】100% 回帖金币+1 血液+1、发帖金币+1▕▏升级条件：血液≥1650\n【等级55】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1780\n【等级56】25% 回帖血液-1▕▏升级条件：血液≥1790\n【等级57】70% 回帖金币+1 咒术+1、发帖金币+1▕▏升级条件：血液≥1792\n【等级58】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1880\n【等级59】45% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1900\n【等级60】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥1920\n【等级61】100% 回帖金币+1 血液+1、发帖金币+1▕▏升级条件：血液≥1950\n【等级62】70% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥2000\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/23/063533w0mhz847r606mb8g.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/23/063534e6xllv3felz4jf8j.gif", 124],
            "3": ["https://img.gamemale.com/album/201505/23/063534vopw46zku4ewy9oe.gif", 124],
            "4": ["https://img.gamemale.com/album/201505/23/063535nf11la4azia64ipi.gif", 124],
            "5": ["https://img.gamemale.com/album/201505/23/063535n0ca9c1w6pwdj161.gif", 124],
            "6": ["https://img.gamemale.com/album/201505/23/063536bs4737nnnn7uhhuq.gif", 124],
            "7": ["https://img.gamemale.com/album/201505/23/063536i13ukuxd73o1nfb1.gif", 124],
            "8": ["https://img.gamemale.com/album/201505/23/063537mnurnupldx7rlzol.gif", 124],
            "9": ["https://img.gamemale.com/album/201505/23/063537hnhhmlm13fmbzni9.gif", 124],
            "10": ["https://img.gamemale.com/album/201505/23/063538plh0b3akeizglogb.gif", 124],
            "11": ["https://img.gamemale.com/album/201505/23/063551s1duk5vmuwzronnt.gif", 124],
            "12": ["https://img.gamemale.com/album/201505/23/063552b1l1rlt62ag4tsg4.gif", 124],
            "13": ["https://img.gamemale.com/album/201505/23/063552kqwcczzy3bqpyg3g.gif", 124],
            "14": ["https://img.gamemale.com/album/201505/23/063553b74ydwo6y3addvad.gif", 124],
            "15": ["https://img.gamemale.com/album/201505/23/063553k5el0ffgxfvf0v9f.gif", 124],
            "16": ["https://img.gamemale.com/album/201505/23/063554xdn955b755ekxlq0.gif", 124],
            "17": ["https://img.gamemale.com/album/201505/23/063554a4vnwaxaxq84xezt.gif", 124],
            "18": ["https://img.gamemale.com/album/201505/23/063555tii4xn9r9s4wrr8n.gif", 124],
            "19": ["https://img.gamemale.com/album/201505/23/063555t4edb44njdb9nfd4.gif", 124],
            "20": ["https://img.gamemale.com/album/201505/23/063555uv2nhu2vzo2o66mz.gif", 124],
            "21": ["https://img.gamemale.com/album/201505/23/063619y4eyxz843h4l4efv.gif", 124],
            "22": ["https://img.gamemale.com/album/201505/23/063620cts5zw8e1ud8o4ee.gif", 124],
            "23": ["https://img.gamemale.com/album/201505/23/063620srr7wwnnfevk7r7v.gif", 124],
            "24": ["https://img.gamemale.com/album/201505/23/063621ao45vefejd4qdaoo.gif", 124],
            "25": ["https://img.gamemale.com/album/201505/23/063622qlcizj314zes3jhz.gif", 124],
            "26": ["https://img.gamemale.com/album/201505/23/063622rrarwnhtwtt2wnat.gif", 124],
            "27": ["https://img.gamemale.com/album/201505/23/063623w5oh5gysysvhayxs.gif", 124],
            "28": ["https://img.gamemale.com/album/201505/23/063623rlkuzupxdd5lbvkd.gif", 124],
            "29": ["https://img.gamemale.com/album/201505/23/063624caziipu7utht7n7m.gif", 124],
            "30": ["https://img.gamemale.com/album/201505/23/063624rcucoalg5daktjnl.gif", 124],
            "31": ["https://img.gamemale.com/album/201505/23/063701bk9o5wwbmztovtom.gif", 124],
            "32": ["https://img.gamemale.com/album/201505/23/063702g86u5m8sduhj8s6d.gif", 124],
            "33": ["https://img.gamemale.com/album/201505/23/063703evrsagajsqpvaunr.gif", 124],
            "34": ["https://img.gamemale.com/album/201505/23/063703rftedd4r7mgdfjj8.gif", 124],
            "35": ["https://img.gamemale.com/album/201505/23/063704pft0x0o1zoocxndn.gif", 124],
            "36": ["https://img.gamemale.com/album/201505/23/063704w6d6326abab5i12r.gif", 124],
            "37": ["https://img.gamemale.com/album/201505/23/063705uuqk1liisup6u061.gif", 124],
            "38": ["https://img.gamemale.com/album/201505/23/063705mnypennn3pppvdr3.gif", 124],
            "39": ["https://img.gamemale.com/album/201505/23/063705wazf16pzfcara1r7.gif", 124],
            "40": ["https://img.gamemale.com/album/201505/23/063706n2ak0i6hui2ytiz5.gif", 124],
            "41": ["https://img.gamemale.com/album/201505/23/063730pw6r84rij6el9lza.gif", 124],
            "42": ["https://img.gamemale.com/album/201505/23/063730i8ovhzm3oh7ibmzw.gif", 124],
            "43": ["https://img.gamemale.com/album/201505/23/063731wmoqv42jvof2mk94.gif", 124],
            "44": ["https://img.gamemale.com/album/201505/23/063731kui0ttgz08d0595u.gif", 124],
            "45": ["https://img.gamemale.com/album/201505/23/063732nffi4p84l1y8p1ym.gif", 124],
            "46": ["https://img.gamemale.com/album/201505/23/063732tl3tgnxz0gwt4ty7.gif", 124],
            "47": ["https://img.gamemale.com/album/201505/23/063733uqdk0idnoxgbcbia.gif", 124],
            "48": ["https://img.gamemale.com/album/201505/23/063733lgzrfbe57utp4pp4.gif", 124],
            "49": ["https://img.gamemale.com/album/201505/23/063734lnb48m6bna566a46.gif", 124],
            "50": ["https://img.gamemale.com/album/201505/23/063734ne9oae4apo4gcang.gif", 124],
            "51": ["https://img.gamemale.com/album/201505/23/063748vnnaafyfzd80d0b0.gif", 124],
            "52": ["https://img.gamemale.com/album/201505/23/063749pwkjwgqqicewhhr9.gif", 124],
            "53": ["https://img.gamemale.com/album/201505/23/063749vgagnxyvqrsg3ssd.gif", 124],
            "54": ["https://img.gamemale.com/album/201505/23/063750ixithzbhr6nb6iid.gif", 124],
            "55": ["https://img.gamemale.com/album/201505/23/063750vqrqzghg187h0rbp.gif", 124],
            "56": ["https://img.gamemale.com/album/201505/23/063751kgjtjmeipsqm6xsi.gif", 124],
            "57": ["https://img.gamemale.com/album/201505/23/063751lq74qx9722cc9zyd.gif", 124],
            "58": ["https://img.gamemale.com/album/201505/23/063752aggqbhcpg8k7q9pe.gif", 124],
            "59": ["https://img.gamemale.com/album/201505/23/063752k05081n3zmn5xtl9.gif", 124],
            "60": ["https://img.gamemale.com/album/201505/23/063753ocrzkgrtkrsbckrk.gif", 124],
            "61": ["https://img.gamemale.com/album/201505/23/063753hoya6uccff1o3duy.gif", 124],
            "62": ["https://img.gamemale.com/album/201505/23/063754r9n79l2zzeq9pqfe.gif", 124],
            "Max": ["https://img.gamemale.com/album/201505/23/063754nbgeezibyi48bkog.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0121",
        "url_tid": "12377",
        "name": "盖拉斯‧瓦卡瑞安",
        "date": "2015-5-23",
        "buy_limit": "无",
        "price": "450金币",
        "levels": "【等级1】5% 回帖金币+1、发帖金币+1▕▏升级条件：灵魂≥2\n【等级2】5% 回帖知识+1、发帖知识+1▕▏升级条件：血液≥50\n【等级3】8% 回帖血液+1、发帖血液+1▕▏升级条件：血液≥600\n【 Max 】12% 回帖金币+1、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/23/211219cyfcl27mmgn9929z.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/23/211222dg1tva0hlbccjce0.gif", 40],
            "3": ["https://img.gamemale.com/album/201505/23/211223r9l1ex18p1pszaxi.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/23/211224kws3ysvpinesp59y.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0120",
        "url_tid": "12376",
        "name": "艾德尔",
        "date": "2015-5-23",
        "buy_limit": "无",
        "price": "280金币",
        "levels": "【 Max 】8% 发帖血液+3 旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201505/23/211212rtw2d9d7pu7v7tn8.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0119",
        "url_tid": "12353",
        "name": "发芽的种子",
        "date": "2015-5-23",
        "buy_limit": "在线时间>10",
        "price": "77金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗50血液\n【等级2】无属性▕▏升级条件：消耗50血液\n【等级3】无属性▕▏升级条件：消耗50血液\n【 Max 】7% 回帖金币+1、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/23/132101kkhbt7ngbhgbghh8.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/23/132101oie1jw22mcwgxtdm.gif", 40],
            "3": ["https://img.gamemale.com/album/201505/23/132102flcu1250sezkvs08.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/23/132102t7vkjukf3vzcj3mj.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0118",
        "url_tid": "12352",
        "name": "新月护符",
        "date": "2015-5-23",
        "buy_limit": "血液≥50",
        "price": "200金币",
        "levels": "【等级1】5% 回帖堕落-1、发帖堕落-1▕▏升级条件：旅程≥90\n【 Max 】10% 回帖堕落-2、发帖堕落-2 旅程+1 ",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/23/122642ltvvradt566wartw.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/23/122644dslwzmsvvebl5uju.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0117",
        "url_tid": "12351",
        "name": "哈尔‧乔丹",
        "date": "2015-5-22",
        "buy_limit": "无",
        "price": "550金币",
        "levels": "【等级1】无属性▕▏升级条件：知识≥15\n【等级2】2% 回帖咒术+1▕▏升级条件：追随≥75\n【等级3】5% 回帖咒术+1、发帖咒术+1▕▏升级条件：总积分≥100（手动升级）\n【 Max 】7% 回帖咒术+1、发帖咒术+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/23/111325tfe6dfehe9mxhmef.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/23/111325gdz7lldkdwnbtnax.gif", 40],
            "3": ["https://img.gamemale.com/album/201505/23/111325b6ymw5peznygp618.gif", 82],
            "Max": ["https://img.gamemale.com/album/201505/23/111326xqwszoupjf3fww63.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0116",
        "url_tid": "12350",
        "name": "神圣十字章",
        "date": "2015-5-22",
        "buy_limit": "旅程≥12",
        "price": "300金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗8咒术\n【等级2】10% 回帖血液+1、发帖血液+1▕▏升级条件：消耗-20血液\n【 Max 】5% 回帖血液+2、发帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/24/235452kjo7oxo7bu2me2ud.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/24/235453eg944j41q4t8q9uq.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/24/235453geqduzdpkohvlohd.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0116",
        "url_tid": "12350",
        "name": "重新充能的神圣十字章",
        "date": "2015-5-22",
        "buy_limit": "未知购买限制",
        "price": "300金币",
        "levels": "【 Max 】10% 回帖血液+2、发帖血液+1 堕落-1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201507/02/110009ffsowqsuok3s7yhi.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0115",
        "url_tid": "12349",
        "name": "杰森·斯坦森",
        "date": "2015-5-21",
        "buy_limit": "无",
        "price": "490金币",
        "levels": "【等级1】无属性▕▏升级条件：金币≥50\n【等级2】1% 回帖血液+1▕▏升级条件：金币≥300\n【等级3】5% 回帖血液+1、发帖血液+1▕▏升级条件：金币≥750\n【等级4】10% 回帖堕落-1 血液+1、发帖堕落-1 血液+1▕▏升级条件：血液≥1000\n【等级5】15% 回帖堕落-1 血液+2、发帖堕落-1 血液+2▕▏升级条件：消耗1灵魂\n【 Max 】25% 回帖堕落-1 血液+2、发帖堕落-1 血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202311/10/171152edqemllma1b34bgb.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/23/082854nobxpm2gfoxqdkis.gif", 40],
            "3": ["https://img.gamemale.com/album/201505/23/082854r5ronno1o5o61010.gif", 40],
            "4": ["https://img.gamemale.com/album/201505/23/082855f5fccek6p5yjf5j6.gif", 82],
            "5": ["https://img.gamemale.com/album/201505/23/082856hgookqbcc0k8vvjc.gif", 82],
            "Max": ["https://img.gamemale.com/album/201505/23/082856it4zstqdddanaxtt.gif", 124]
        }
    },
    {
        "type": "装备",
        "no": "0114",
        "url_tid": "12348",
        "name": "艾尔尤因",
        "date": "2015-5-21",
        "buy_limit": "无",
        "price": "290金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+1▕▏升级条件：血液≥300\n【等级2】5% 回帖咒术+1、发帖咒术+1▕▏升级条件：血液≥500\n【 Max 】10% 回帖血液+1 堕落-1、发帖血液+1 堕落-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/23/074332lrsjpeiz6epkzrjo.gif", 82],
            "2": ["https://img.gamemale.com/album/201505/23/074333fnvb37ob03t0ccuk.gif", 82],
            "Max": ["https://img.gamemale.com/album/201505/23/074333lif901j98xgcf11n.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0113",
        "url_tid": "12248",
        "name": "预知水晶球",
        "date": "2015-5-10",
        "buy_limit": "咒术≥10",
        "price": "150金币",
        "levels": "【等级1】4% 回帖金币+1、发帖知识+1▕▏升级条件：消耗40咒术\n【 Max 】8% 回帖金币+1、发帖知识+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/10/220233ogisshvwioolglve.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/10/220234q7plyphspk63hgk8.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0112",
        "url_tid": "12246",
        "name": "奇怪的紫水晶",
        "date": "2015-5-10",
        "buy_limit": "无",
        "price": "299金币",
        "levels": "【等级1】5% 回帖血液-1 咒术+2 堕落+1▕▏升级条件：消耗35咒术\n【 Max 】1% 回帖知识+1 咒术+1、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/10/155736ve7lbebzve65vell.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/10/155736l65w95cbkk7c5w5d.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0111",
        "url_tid": "12245",
        "name": "巴特‧贝克",
        "date": "2015-5-10",
        "buy_limit": "堕落<20",
        "price": "180金币",
        "levels": "【等级1】2% 回帖堕落+1▕▏升级条件：堕落≥20\n【等级2】4% 回帖堕落+1▕▏升级条件：堕落≥50\n【 Max 】6% 回帖堕落+1 金币+1、发帖堕落+1 金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/10/154847opjqhpb8kjycikjc.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/10/154847q9f7fb9izezyp7ze.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/10/154848f6jo2zyp732r173x.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0110",
        "url_tid": "12163",
        "name": "锻造卷轴",
        "date": "2015-4-28",
        "buy_limit": "无",
        "price": "99金币",
        "levels": "【 Max 】1% 回帖金币+1 知识+1、发帖金币+1 知识+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201407/15/170730qtjiwj1kpstwktuk.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0109",
        "url_tid": "12157",
        "name": "布衣",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "45金币",
        "levels": "【等级1】1% 回帖血液-1▕▏升级条件：消耗2金币\n【等级2】无属性▕▏升级条件：消耗4金币\n【等级3】1% 回帖血液+1▕▏升级条件：消耗16金币\n【等级4】1% 回帖血液+1▕▏升级条件：消耗18金币\n【等级5】1% 回帖血液+1▕▏升级条件：消耗20金币\n【等级6】1% 回帖血液+1▕▏升级条件：消耗22金币\n【等级7】2% 回帖血液+1▕▏升级条件：消耗34金币\n【等级8】2% 回帖血液+1、发帖血液+1▕▏升级条件：消耗36金币\n【等级9】2% 回帖血液+2、发帖血液+2▕▏升级条件：消耗38金币\n【等级10】2% 回帖血液+2、发帖血液+3▕▏升级条件：消耗50金币\n【等级11】2% 回帖血液+2 咒术+1、发帖血液+2 咒术+2▕▏升级条件：消耗52金币\n【等级12】2% 回帖血液+2 咒术+1、发帖血液+2 咒术+3▕▏升级条件：消耗64金币\n【等级13】2% 回帖血液+3 知识+1、发帖血液+3 知识+1▕▏升级条件：消耗250血液\n【 Max 】3% 回帖血液+5 咒术-1、发帖血液+5 咒术-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201505/23/071003ayvccyri4td65td6.gif", 40],
            "2": ["https://img.gamemale.com/album/201505/23/071004p1ml9cymrl83kc6l.gif", 40],
            "3": ["https://img.gamemale.com/album/201505/23/071004f80d20maued6n90h.gif", 40],
            "4": ["https://img.gamemale.com/album/201505/23/071005l3274cjxb8t1oj97.gif", 40],
            "5": ["https://img.gamemale.com/album/201505/23/071006p8o75kz4xyxvv7d8.gif", 40],
            "6": ["https://img.gamemale.com/album/201505/23/071006ibzazt7r0nn0gnbg.gif", 40],
            "7": ["https://img.gamemale.com/album/201505/23/071006gthpf50r0mvv5m5h.gif", 40],
            "8": ["https://img.gamemale.com/album/201505/23/071007wchlhtx6ce1ht5sc.gif", 40],
            "9": ["https://img.gamemale.com/album/201505/23/071007c8ib2ukuo56z8xic.gif", 40],
            "10": ["https://img.gamemale.com/album/201505/23/071007q19qdizoavidsqs1.gif", 40],
            "11": ["https://img.gamemale.com/album/201505/23/071008pbb5yaibkiivkv9i.gif", 40],
            "12": ["https://img.gamemale.com/album/201505/23/071008r9a354l1eel9aigg.gif", 40],
            "13": ["https://img.gamemale.com/album/201505/23/071009ssqlcmm5xm5gopsl.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/23/071009omhorl7bo2pyrhmp.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0108",
        "url_tid": "12156",
        "name": "尤利西斯",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "250金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗200血液\n【等级2】2% 回帖血液+1▕▏升级条件：消耗-10堕落\n【等级3】7% 回帖金币+1▕▏升级条件：金币≥600\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/04/201826l92ld6egd3egqkii.gif", 40],
            "2": ["https://img.gamemale.com/album/201507/04/201826z56c36z6q5jefy60.gif", 40],
            "3": ["https://img.gamemale.com/album/201504/03/153558ue0f4fisvk02i2fg.gif", 40],
            "Max": ["https://img.gamemale.com/album/201504/03/153558b05r1od2opovhhhr.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0107",
        "url_tid": "12155",
        "name": "尼克·贝特曼",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】无属性▕▏升级条件：血液≥600\n【等级2】3% 发帖血液+3▕▏升级条件：金币≥600\n【等级3】5% 发帖血液+3 咒术+2▕▏升级条件：血液≥900\n【等级4】7% 发帖血液+3 旅程+1▕▏升级条件：金币≥900\n【等级5】15% 发帖血液+3 金币+2▕▏升级条件：灵魂≥1\n【 Max 】20% 发帖血液+4 金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201503/16/144604vnabcbnc56f1cnzb.gif", 40],
            "2": ["https://img.gamemale.com/album/201503/16/144605wq0f0t09wllp9x4k.gif", 40],
            "3": ["https://img.gamemale.com/album/201503/16/144612ktv96hwszcz91ch8.gif", 82],
            "4": ["https://img.gamemale.com/album/201503/16/144649r9gl1r6gfc99zqm6.gif", 82],
            "5": ["https://img.gamemale.com/album/201503/16/144654bn2rgzkxkrxb9tjl.gif", 82],
            "Max": ["https://img.gamemale.com/album/201503/16/144659tzrqrl4g9gs9uuwi.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0106",
        "url_tid": "12154",
        "name": "康纳‧沃什",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】5% 回帖血液+1▕▏升级条件：消耗50血液\n【等级2】6% 回帖血液+1、发帖血液+1▕▏升级条件：堕落≥50\n【等级3】7% 发帖知识+1 血液+1▕▏升级条件：知识≥50\n【 Max 】8% 回帖堕落+1 血液+1、发帖知识+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201503/09/012316nn7lnzbryrf2lcot.gif", 40],
            "2": ["https://img.gamemale.com/album/201503/09/012322qsppxypx8vxjosnk.gif", 40],
            "3": ["https://img.gamemale.com/album/201503/09/012328nb2sp7d1pp4wzmlm.gif", 40],
            "Max": ["https://img.gamemale.com/album/201503/09/012333t0bqlrwcrc30erq3.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0105",
        "url_tid": "12153",
        "name": "铁牛",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】5% 回帖血液-1 金币+2▕▏升级条件：血液≥350\n【等级2】7% 回帖血液-1 金币+2▕▏升级条件：消耗200血液\n【 Max 】13% 回帖血液-1 金币+3 堕落+1、发帖血液-1 金币+3 堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201503/02/215947gyk5wjk7ah7h3aaw.gif", 40],
            "2": ["https://img.gamemale.com/album/201503/02/215950g9xu9f9f9nsxi6xs.gif", 40],
            "Max": ["https://img.gamemale.com/album/201503/02/215954du988aao6w8xf4o6.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0104",
        "url_tid": "12152",
        "name": "泡沫浮髅(Squirt)",
        "date": "2015-4-27",
        "buy_limit": "2015年猜游戏活动，排名前十",
        "price": "无",
        "levels": "【 Max 】4% 回帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201502/24/001004cmj306jawj0w0yi6.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0103",
        "url_tid": "12151",
        "name": "铁杆影迷",
        "date": "2015-4-27",
        "buy_limit": "2015年看图猜电影活动，答对25题以上",
        "price": "无",
        "levels": "【 Max 】2% 回帖知识+1、发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201502/21/225002lt3orcr25tctc6d4.gif", 124]
        }
    },
    {
        "type": "咒术",
        "no": "0102",
        "url_tid": "12150",
        "name": "霍格沃茨五日游",
        "date": "2015-4-27",
        "buy_limit": "只可赠送，旅程≥10",
        "price": "8咒术",
        "duration": "5天",
        "levels": "【等级1】5% 回帖咒术+2▕▏升级条件：旅程≥10\n【等级2】20% 发帖知识+1▕▏升级条件：知识≥20\n【等级3】20% 回帖血液+3、发帖知识+1 血液+3▕▏升级条件：追随≥100\n【等级4】20% 回帖血液+5、发帖旅程+1 血液+5▕▏升级条件：堕落≥50\n【 Max 】20% 回帖血液+3、发帖堕落+1 血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/114541trdrr3dle4jkkzbj.gif", 124],
            "2": ["https://img.gamemale.com/album/201507/02/114542ehzt9tnwh72n2txc.gif", 124],
            "3": ["https://img.gamemale.com/album/201507/02/114542n5491t4dtfbph4tx.gif", 124],
            "4": ["https://img.gamemale.com/album/201507/02/114541msk0olpz48t8utun.gif", 124],
            "Max": ["https://img.gamemale.com/album/201507/02/114540oy7474tc07zof0fz.gif", 124]
        }
    },
    {
        "type": "奖品",
        "no": "0101",
        "url_tid": "12149",
        "name": "海上明月",
        "date": "2015-4-27",
        "buy_limit": "2014年中秋节活动奖励",
        "price": "无",
        "levels": "【 Max 】5% 回帖血液+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201502/26/013845sc3u3wpsbz4c04xz.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0100",
        "url_tid": "12148",
        "name": "奥兹大陆",
        "date": "2015-4-27",
        "buy_limit": "旅程>25，在线时间>255",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201407/15/162635kmxe70ce5zq0uqv0.gif", 124]
        }
    },
    {
        "type": "天赋",
        "no": "0099",
        "url_tid": "12147",
        "name": "禽兽扒手",
        "date": "2015-4-27",
        "buy_limit": "追随≥35，旅程≥45，知识≥15",
        "price": "无",
        "levels": "【等级1】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥101\n【等级2】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥110\n【等级3】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥201\n【等级4】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥210\n【等级5】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥301\n【等级6】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥310\n【等级7】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥401\n【等级8】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥410\n【等级9】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥501\n【等级10】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥510\n【等级11】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥601\n【等级12】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥610\n【等级13】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥701\n【等级14】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥710\n【等级15】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥801\n【等级16】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥810\n【等级17】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥901\n【等级18】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥910\n【等级19】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥1001\n【等级20】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥1100\n【等级21】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥2001\n【等级22】30% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥2100\n【等级23】10% 回帖血液-1 咒术+1▕▏升级条件：在线时间≥3001\n【 Max 】35% 回帖血液-1 咒术+1",
        "levels_img": {
            "1": ["", 40],
            "2": ["", 124],
            "3": ["", 40],
            "4": ["https://img.gamemale.com/album/201505/23/070312d2g4ijd442izjjjh.gif", 124],
            "5": ["https://img.gamemale.com/album/201505/23/070312s65z653wzc3lvq63.gif", 40],
            "6": ["https://img.gamemale.com/album/201505/23/070313rmf8mxgtli7qltll.gif", 124],
            "7": ["https://img.gamemale.com/album/201505/23/070314ru4zanqch73ua7vz.gif", 40],
            "8": ["https://img.gamemale.com/album/201505/23/070315ax0qqjmmsnx0nct7.gif", 124],
            "9": ["https://img.gamemale.com/album/201505/23/070316o9jcfoz4eg98842m.gif", 40],
            "10": ["https://img.gamemale.com/album/201505/23/070317qtrutra15rujjdu5.gif", 124],
            "11": ["https://img.gamemale.com/album/201505/23/070317afka3a331r3gao2f.gif", 40],
            "12": ["https://img.gamemale.com/album/201505/23/070318kjxxfvkiviayodvx.gif", 124],
            "13": ["https://img.gamemale.com/album/201505/23/070319zhydy6lm5ndcmbml.gif", 40],
            "14": ["https://img.gamemale.com/album/201505/23/070320lbenfgxc7sxz2e2b.gif", 124],
            "15": ["https://img.gamemale.com/album/201505/23/070320lifezxjfqpw4hx0h.gif", 40],
            "16": ["https://img.gamemale.com/album/201505/23/070321uqsw1rs5kv8xkrys.gif", 124],
            "17": ["https://img.gamemale.com/album/201505/23/070322j2x5nxvn27vxbimb.gif", 40],
            "18": ["", 124],
            "19": ["https://img.gamemale.com/album/201505/23/070323dnnynyocyyhc7yz5.gif", 40],
            "20": ["https://img.gamemale.com/album/201505/23/070324c8sazsfzjaigj77i.gif", 124],
            "21": ["https://img.gamemale.com/album/201505/23/070324fhqhqjvubkkb1mqz.gif", 40],
            "22": ["https://img.gamemale.com/album/201505/23/070325snuznu8ubur8n3tu.gif", 124],
            "23": ["https://img.gamemale.com/album/201505/23/070325xyqdtu0psewyzka8.gif", 40],
            "Max": ["https://img.gamemale.com/album/201505/23/070327ye9mgewqi9ieqm9g.gif", 124]
        }
    },
    {
        "type": "装备",
        "no": "0098",
        "url_tid": "12146",
        "name": "圣英灵秘银甲",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "1350金币",
        "levels": "【等级1】11% 回帖血液+2 堕落-1、发帖血液+2 堕落-1▕▏升级条件：消耗1灵魂\n【等级2】31% 回帖血液+2 堕落-1、发帖血液+2 堕落-1▕▏升级条件：咒术≥111\n【 Max 】41% 回帖血液+2 堕落-1、发帖血液+2 堕落-1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202310/03/211510s75nraq5m8tymmru.gif", 40],
            "2": ["https://img.gamemale.com/forum/202310/03/211518sp196gghh5d6ccjc.gif", 40],
            "Max": ["https://img.gamemale.com/album/201407/15/161138szkk9gk4fkux4jlg.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0097",
        "url_tid": "12145",
        "name": "安德森‧戴维斯",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】2% 回帖血液+1、发帖咒术+1▕▏升级条件：堕落≥5\n【等级2】4% 回帖血液+1、发帖咒术+1▕▏升级条件：堕落≥10\n【等级3】6% 回帖血液+1、发帖咒术+1▕▏升级条件：堕落≥25\n【等级4】8% 回帖血液+1、发帖咒术+1▕▏升级条件：堕落≥50\n【等级5】10% 回帖金币-1 血液+1、发帖咒术+1▕▏升级条件：堕落≥100\n【 Max 】15% 回帖金币-1 血液+1 咒术+1、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201407/15/085920xxy109ofq90fyc0n.gif", 40],
            "2": ["https://img.gamemale.com/album/201407/15/085922luac88f03c6c3ci0.gif", 82],
            "3": ["https://img.gamemale.com/album/201407/15/085923ox4r8laxbk98fqjq.gif", 82],
            "4": ["https://img.gamemale.com/album/201407/15/085925cxwy9wxywy5ujdjx.gif", 82],
            "5": ["https://img.gamemale.com/album/201407/15/085926tfq5ohmwp09ep019.gif", 82],
            "Max": ["https://img.gamemale.com/album/201407/15/085929njwr63y4hnb43y32.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0096",
        "url_tid": "12144",
        "name": "库伦 (起源)",
        "date": "2015-4-27",
        "buy_limit": "咒术≤25",
        "price": "480金币",
        "levels": "【等级1】18% 回帖血液+2、发帖血液+6▕▏升级条件：咒术≥11\n【 Max 】7% 发帖血液+6 咒术-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201407/16/104751vvazr322erx6gh5w.gif", 124],
            "Max": ["https://img.gamemale.com/album/201407/16/104753wu8ss9spsc9sww8w.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0095",
        "url_tid": "12143",
        "name": "戴蒙‧萨尔瓦托",
        "date": "2015-4-27",
        "buy_limit": "堕落≥10",
        "price": "450金币",
        "levels": "【等级1】5% 回帖血液+5 堕落+1、发帖血液+5 堕落+1▕▏升级条件：血液≥5\n【等级2】无属性▕▏升级条件：血液≥20\n【等级3】5% 回帖血液+1▕▏升级条件：血液≥50\n【等级4】20% 回帖血液+1、发帖血液+3▕▏升级条件：血液≥55\n【等级5】5% 回帖血液+1、发帖血液+3▕▏升级条件：血液≥100\n【等级6】10% 回帖血液-1、发帖堕落+2 血液+2▕▏升级条件：血液≥108\n【等级7】100% 回帖血液+2 堕落+1、发帖血液+2 堕落+1▕▏升级条件：血液≥110\n【等级8】无属性▕▏升级条件：血液≥150\n【等级9】2% 回帖血液-5 堕落+5、发帖灵魂+1▕▏升级条件：血液≥160\n【等级10】20% 回帖血液-1 堕落+1▕▏升级条件：血液≥300\n【 Max 】无属性",
        "levels_img": {
            "1": ["", 82],
            "2": ["", 82],
            "3": ["https://img.gamemale.com/album/201407/15/031655o0krqgsqats9mfma.gif", 82],
            "4": ["", 82],
            "5": ["https://img.gamemale.com/album/201407/15/031659lwvsvwswzvumwohv.gif", 82],
            "6": ["https://img.gamemale.com/album/201407/15/031701fprrrr64zwtt6rcw.gif", 82],
            "7": ["https://img.gamemale.com/album/201407/15/162329n0nd3jeecoqq766e.gif", 82],
            "8": ["https://img.gamemale.com/album/201407/15/031706rb545qassh5xhx0r.gif", 82],
            "9": ["https://img.gamemale.com/album/201407/15/031709z2wslg22q2e3g8qs.gif", 82],
            "10": ["https://img.gamemale.com/album/201407/15/031711v3xv9lg3i3w39tjj.gif", 82],
            "Max": ["https://img.gamemale.com/album/201407/15/031712md6ydg1la83z5dy9.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0094",
        "url_tid": "12141",
        "name": "迷之瓶",
        "date": "2015-4-27",
        "buy_limit": "同时拥有[充满魔力的种子]、[木柴堆]、[暗红矿土]之后向作者（敏感先生）换取",
        "price": "无",
        "levels": "【等级1】7% 回帖金币+3 血液+1 咒术 +1▕▏升级条件：消耗1灵魂\n【 Max 】10% 回帖金币+3 血液+1 咒术+1、发帖金币+5 血液+2 咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/04/063026bs6eoj6j3e7ufxso.gif", 40],
            "Max": ["https://img.gamemale.com/album/201406/04/062929waoad3e2ase3hrwr.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0093",
        "url_tid": "12140",
        "name": "TRPG纪念章",
        "date": "2015-4-27",
        "buy_limit": "完成TRPG版块内的跑团任务",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：消耗-100金币\n【 Max 】2% 回帖金币+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/30/223240bzgsnjn1y5s1r5jj.gif", 40],
            "Max": ["https://img.gamemale.com/album/201406/30/223241getk4f7x7ftelv6e.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0092",
        "url_tid": "12139",
        "name": "堕落飨宴",
        "date": "2015-4-27",
        "buy_limit": "旅程≥20，在线时间≥100，发帖数≥100，主题数≥10",
        "price": "9999金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗-10堕落\n【等级2】无属性▕▏升级条件：消耗-500血液\n【等级3】无属性▕▏升级条件：消耗-20堕落\n【等级4】无属性▕▏升级条件：消耗-200咒术\n【等级5】无属性▕▏升级条件：消耗-30堕落\n【等级6】无属性▕▏升级条件：消耗-30旅程\n【等级7】无属性▕▏升级条件：消耗-40堕落\n【等级8】无属性▕▏升级条件：消耗-20知识\n【等级9】无属性▕▏升级条件：消耗-50堕落\n【等级10】无属性▕▏升级条件：消耗-500金币\n【等级11】无属性▕▏升级条件：消耗-60堕落\n【等级12】无属性▕▏升级条件：消耗-1500血液\n【等级13】无属性▕▏升级条件：消耗-70堕落\n【等级14】无属性▕▏升级条件：消耗-300咒术\n【等级15】无属性▕▏升级条件：消耗-80堕落\n【等级16】无属性▕▏升级条件：消耗-50旅程\n【等级17】无属性▕▏升级条件：消耗-90堕落\n【等级18】无属性▕▏升级条件：消耗-30知识\n【等级19】无属性▕▏升级条件：消耗-100堕落\n【等级20】无属性▕▏升级条件：消耗-2500金币\n【等级21】1% 回帖金币+5 血液+5 堕落+5、发帖灵魂+1 咒术+10▕▏升级条件：消耗-200堕落\n【等级22】1% 回帖金币+5 血液+5 堕落+5、发帖灵魂+1 咒术+10▕▏升级条件：消耗-2灵魂\n【 Max 】1% 回帖金币+5 血液+5 堕落+5、发帖灵魂+1 咒术+10",
        "levels_img": {
            "1": ["", 124],
            "2": ["", 124],
            "3": ["", 124],
            "4": ["", 124],
            "5": ["", 124],
            "6": ["", 124],
            "7": ["", 124],
            "8": ["", 124],
            "9": ["", 124],
            "10": ["", 124],
            "11": ["", 124],
            "12": ["", 124],
            "13": ["", 124],
            "14": ["", 124],
            "15": ["", 124],
            "16": ["", 124],
            "17": ["", 124],
            "18": ["", 124],
            "19": ["", 124],
            "20": ["", 124],
            "21": ["", 124],
            "22": ["", 124],
            "Max": ["https://img.gamemale.com/album/201406/30/212947ownnplliaopkoon1.gif", 62]
        }
    },
    {
        "type": "场景&版块",
        "no": "0091",
        "url_tid": "12137",
        "name": "龙腾世纪：审判",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】1% 回帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201406/22/195732l4s9zq3qzjq9fj3b.gif", 124]
        }
    },
    {
        "type": "宠物",
        "no": "0090",
        "url_tid": "12135",
        "name": "迷のDoge",
        "date": "2015-4-27",
        "buy_limit": "主题数≥6",
        "price": "100金币",
        "levels": "【等级1】2% 回帖血液+1 金币+1▕▏升级条件：消耗50金币\n【等级2】4% 回帖血液+1 金币+1▕▏升级条件：消耗50金币\n【 Max 】6% 回帖血液+1 金币+2 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/29/221555kk44ch4rcbxtyk04.gif", 82],
            "2": ["https://img.gamemale.com/album/201905/29/221555kv9dcrcj6kyob44z.gif", 82],
            "Max": ["https://img.gamemale.com/album/201905/29/221555f727is9hhtehdl92.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0089",
        "url_tid": "12134",
        "name": "神秘的邀请函",
        "date": "2015-4-27",
        "buy_limit": "主题数≥3，在线时间>12",
        "price": "100金币",
        "levels": "【等级1】1% 回帖金币+1、发帖金币+1▕▏升级条件：消耗80血液\n【等级2】1% 回帖血液+1、发帖血液+1▕▏升级条件：消耗80金币\n【等级3】5% 回帖血液-1▕▏升级条件：追随≥30\n【等级4】5% 回帖金币+3 血液-1、发帖金币+3 血液-1▕▏升级条件：知识≥10\n【等级5】10% 回帖血液+1 金币+1、发帖血液+2 金币+3▕▏升级条件：消耗-100金币\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/04/062955tkrrg9r2oy29ddl2.gif", 40],
            "2": ["https://img.gamemale.com/album/201406/04/062958d80pgig70igdyy0g.gif", 40],
            "3": ["https://img.gamemale.com/album/201406/04/062957lvvffoqufhkz1h5d.gif", 40],
            "4": ["https://img.gamemale.com/album/201406/04/063001n3d2e3oro82d2i37.gif", 40],
            "5": ["https://img.gamemale.com/album/201406/04/062951c99sgjwk7hwhp49g.gif", 40],
            "Max": ["https://img.gamemale.com/album/201406/04/062953at6pb6z6zgfz6gfu.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0088",
        "url_tid": "12133",
        "name": "暗红矿土",
        "date": "2015-4-27",
        "buy_limit": "堕落≥20",
        "price": "40金币",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：消耗30金币\n【等级2】4% 回帖堕落+1▕▏升级条件：消耗70金币\n【等级3】1% 回帖血液+2▕▏升级条件：消耗200金币\n【 Max 】12% 回帖血液+1 堕落+1、发帖血液+2 咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/04/062921v240xqigc6mxqzgk.gif", 40],
            "2": ["https://img.gamemale.com/album/201406/04/062917uyfp6qfrrfxctxnx.gif", 40],
            "3": ["https://img.gamemale.com/album/201406/04/062915c1617j261rb122bj.gif", 40],
            "Max": ["https://img.gamemale.com/album/201406/04/062916lhphzyhue8w8qcjr.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0087",
        "url_tid": "12132",
        "name": "木柴堆",
        "date": "2015-4-27",
        "buy_limit": "旅程≥18",
        "price": "90金币",
        "levels": "【等级1】1% 回帖金币+1▕▏升级条件：消耗5血液\n【等级2】5% 回帖金币+1▕▏升级条件：消耗150金币\n【等级3】1% 无属性▕▏升级条件：消耗30血液\n【 Max 】10% 回帖金币+1、发帖金币+3 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/04/062908a274wdv8h4phhn55.jpg", 40],
            "2": ["https://img.gamemale.com/album/201406/04/062913f6lc9r9z1qv9vqpc.gif", 40],
            "3": ["https://img.gamemale.com/album/201406/04/062911x57nm5tnurffbeun.gif", 40],
            "Max": ["https://img.gamemale.com/album/201406/04/062910ru601j1miimzumbm.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0086",
        "url_tid": "12131",
        "name": "充满魔力的种子",
        "date": "2015-4-27",
        "buy_limit": "旅程≥20，知识≥4",
        "price": "250金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗20咒术\n【等级2】5% 回帖知识+1▕▏升级条件：在线时间≥240\n【等级3】5% 回帖知识+1、发帖知识+2▕▏升级条件：消耗20咒术\n【等级4】无属性▕▏升级条件：消耗10咒术\n【 Max 】8% 回帖金币+2 咒术+1、发帖知识+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/04/062928sm3l7875n3aambka.gif", 40],
            "2": ["https://img.gamemale.com/album/201406/04/062929waoad3e2ase3hrwr.gif", 40],
            "3": ["https://img.gamemale.com/album/201406/04/062925s8d8rlrfxxms7be9.gif", 40],
            "4": ["https://img.gamemale.com/album/201406/04/062924zm5staumrs2le7us.gif", 40],
            "Max": ["https://img.gamemale.com/album/201406/04/062922l09qfc010czbf64s.gif", 40]
        }
    },
    {
        "type": "咒术",
        "no": "0085",
        "url_tid": "12130",
        "name": "咆哮诅咒",
        "date": "2015-4-27",
        "buy_limit": "只可赠送，知识≥28",
        "price": "8咒术",
        "duration": "3天",
        "levels": "【等级1】30% 回帖堕落+3 血液-1▕▏升级条件：总积分≥35（手动升级）\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/114500rdiddgbttibdbiaa.gif", 40],
            "Max": ["https://img.gamemale.com/album/201507/02/114501dlkkbbncsk52zzkh.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0084",
        "url_tid": "12129",
        "name": "遗忘之水",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "180金币",
        "duration": "30天",
        "levels": "【等级1】无属性▕▏升级条件：消耗10堕落\n【等级2】无属性▕▏升级条件：消耗10堕落\n【等级3】无属性▕▏升级条件：消耗10堕落\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/113359nsaaatonossri6h6.gif", 40],
            "2": ["https://img.gamemale.com/album/201507/02/113359pbxnjjnxsjzljtxj.gif", 40],
            "3": ["https://img.gamemale.com/album/201507/02/113400ad64l1mx4d48ldnf.gif", 40],
            "Max": ["https://img.gamemale.com/album/201507/02/113400kqv0z0i0didl60a8.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0083",
        "url_tid": "12128",
        "name": "史蒂夫‧金克斯",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "230金币",
        "levels": "【等级1】3% 回帖咒术+1、发帖咒术+1▕▏升级条件：咒术≥120\n【 Max 】5% 回帖堕落+2、发帖堕落+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/22/042417b936kgugjuzud266.gif", 40],
            "Max": ["https://img.gamemale.com/album/201406/22/042418qn1514k5ydb8z1k4.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0082",
        "url_tid": "12127",
        "name": "卢西亚诺‧科斯塔",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "380金币",
        "levels": "【等级1】5% 回帖血液+1、发帖血液+1▕▏升级条件：知识≥100\n【 Max 】30% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/30/220855w7cyd7rztkfjfc8e.gif", 40],
            "Max": ["https://img.gamemale.com/album/201406/30/220858qv2nanaczbfc0mmm.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0081",
        "url_tid": "12126",
        "name": "虎克船长",
        "date": "2015-4-27",
        "buy_limit": "旅程≥15",
        "price": "320金币",
        "levels": "【等级1】1% 发帖旅程+1▕▏升级条件：消耗150金币\n【等级2】1% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗200血液\n【等级3】2% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗-5堕落\n【等级4】2% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗-10咒术\n【等级5】3% 回帖旅程+1、发帖旅程+1▕▏升级条件：消耗-1知识\n【 Max 】3% 回帖旅程+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/04/201345hjeja2qedk2lqzlx.gif", 40],
            "2": ["https://img.gamemale.com/album/201406/30/220919pa1bb2chg8g1v2rc.gif", 40],
            "3": ["https://img.gamemale.com/album/201406/30/220925kdwcj4wwnw0fnopj.gif", 40],
            "4": ["", 40],
            "5": ["", 40],
            "Max": ["https://img.gamemale.com/album/201406/30/220937t1ghq6hn6jsjush6.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0080",
        "url_tid": "12125",
        "name": "卡斯迪奥",
        "date": "2015-4-27",
        "buy_limit": "堕落≤10",
        "price": "520金币",
        "levels": "【等级1】2% 回帖堕落-1、发帖堕落-1▕▏升级条件：消耗50血液\n【等级2】3% 回帖堕落-1、发帖堕落-1▕▏升级条件：消耗80血液\n【等级3】4% 回帖堕落-1、发帖堕落-1 血液+1▕▏升级条件：消耗100血液\n【等级4】5% 回帖堕落-1、发帖堕落-1 血液+1▕▏升级条件：消耗1灵魂\n【等级5】无属性▕▏升级条件：堕落≥1\n【等级6】2% 回帖血液+5 堕落-3、发帖灵魂+1 堕落-5▕▏升级条件：堕落≥16\n【等级7】15% 回帖血液+2 堕落-1、发帖血液+3 堕落-3▕▏升级条件：堕落≥66\n【等级8】15% 回帖金币+2 堕落+1、发帖金币+3 堕落+3▕▏升级条件：堕落≥116\n【等级9】2% 回帖金币+5 堕落+3、发帖灵魂+1 堕落+5▕▏升级条件：堕落≥131\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/22/042226pcx22u43l84pdslx.gif", 40],
            "2": ["https://img.gamemale.com/album/201406/22/042228add94qdrh4hm88m7.gif", 40],
            "3": ["https://img.gamemale.com/album/201406/22/042232yedvd9be1nfz1eam.gif", 82],
            "4": ["https://img.gamemale.com/album/201406/22/042236oa44wwaudaee9kek.gif", 82],
            "5": ["https://img.gamemale.com/album/201406/22/042240gh0ihxpi2pxdii0i.gif", 124],
            "6": ["https://img.gamemale.com/album/201406/22/042245gi30m4j0jn53wj54.gif", 124],
            "7": ["", 124],
            "8": ["https://img.gamemale.com/album/201406/22/042253bxcdjddyyguyymy1.gif", 124],
            "9": ["https://img.gamemale.com/album/201406/22/042257c50o7z2ez9kikk0j.gif", 124],
            "Max": ["https://img.gamemale.com/album/201406/22/042302n6dszl6ialg4het4.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0079",
        "url_tid": "12124",
        "name": "魔术师奥斯卡",
        "date": "2015-4-27",
        "buy_limit": "旅程≥10",
        "price": "490金币",
        "levels": "【等级1】5% 回帖堕落+1▕▏升级条件：消耗30咒术\n【等级2】6% 回帖堕落-1▕▏升级条件：消耗75咒术\n【等级3】7% 回帖堕落+1▕▏升级条件：堕落≥20\n【等级4】8% 回帖堕落-1、发帖知识+1▕▏升级条件：消耗120咒术\n【等级5】9% 回帖堕落+1 咒术+1 发帖咒术+3 知识+1▕▏升级条件：咒术≥100\n【 Max 】10% 回帖堕落-1 咒术+1、发帖知识+1 咒术+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/30/220946kqztt1qp5xq4q5x7.gif", 40],
            "2": ["https://img.gamemale.com/album/201406/30/220955rbefrbyymjymvjmt.gif", 40],
            "3": ["https://img.gamemale.com/album/201406/30/221002we5ai18815izy1xo.gif", 82],
            "4": ["", 82],
            "5": ["https://img.gamemale.com/forum/202104/25/112905gvvc8ucovcleozmu.gif", 124],
            "Max": ["https://img.gamemale.com/album/201406/30/221016kjxkgmjkai3s0xza.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0078",
        "url_tid": "12123",
        "name": "山姆·温彻斯特",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】2% 回帖金币+2、发帖金币+2▕▏升级条件：咒术≥10\n【等级2】4% 回帖金币+2、发帖金币+2▕▏升级条件：咒术≥50\n【等级3】6% 回帖金币+2、发帖金币+2▕▏升级条件：咒术≥100\n【等级4】8% 回帖金币+2、发帖金币+2▕▏升级条件：消耗350金币\n【 Max 】10% 回帖金币+2、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/22/042331zbo7uoul9j9909u4.gif", 40],
            "2": ["https://img.gamemale.com/album/201406/22/042331dh9zin91n7ahznhe.gif", 40],
            "3": ["https://img.gamemale.com/album/201406/22/042333v4ohb8w9ort7axaa.gif", 82],
            "4": ["https://img.gamemale.com/album/201406/22/042335l31xcfw1g7bbg7gg.gif", 82],
            "Max": ["https://img.gamemale.com/album/201406/22/042336dvpcv0di1gcycbll.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0077",
        "url_tid": "12122",
        "name": "迪恩·温彻斯特",
        "date": "2015-4-27",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】2% 回帖血液+2、发帖血液+2▕▏升级条件：血液≥100\n【等级2】4% 回帖血液+2、发帖血液+2▕▏升级条件：血液≥250\n【等级3】6% 回帖血液+2、发帖血液+2▕▏升级条件：血液≥450\n【等级4】8% 回帖血液+2、发帖血液+2▕▏升级条件：消耗350金币\n【 Max 】10% 回帖血液+2、发帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/22/042344dkrz0eha01vfr98f.gif", 40],
            "2": ["https://img.gamemale.com/album/201406/22/042345xe3vljnc8jsdpeew.gif", 40],
            "3": ["https://img.gamemale.com/album/201406/22/042346m0m72d7e5lun2w2l.gif", 82],
            "4": ["https://img.gamemale.com/album/201406/22/042348n4oekow0w8tmuj0w.gif", 82],
            "Max": ["https://img.gamemale.com/album/201406/22/042349gichiorsh5huj77w.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0076",
        "url_tid": "12121",
        "name": "布莱恩‧欧康纳",
        "date": "2015-4-27",
        "buy_limit": "追随≥20",
        "price": "400金币",
        "levels": "【等级1】4% 回帖金币+1▕▏升级条件：消耗100金币\n【等级2】6% 回帖金币+1▕▏升级条件：消耗100血液\n【等级3】8% 回帖金币+1▕▏升级条件：追随≥101\n【 Max 】10% 回帖金币+2、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201406/22/044720ul88z5dldl1odwxr.gif", 40],
            "2": ["", 82],
            "3": ["https://img.gamemale.com/album/201406/22/044722kicxs72q2aczqzu2.gif", 40],
            "Max": ["https://img.gamemale.com/album/201406/22/044725arsuzrs4vgweluwv.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0075",
        "url_tid": "12113",
        "name": "謎の男",
        "date": "2015-4-26",
        "buy_limit": "募捐活动奖励，募捐一次即可获得",
        "price": "无",
        "levels": "【 Max 】100% 回帖血液+1、发帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201405/27/053852jwsj9l9ztt9rwhsj.gif", 40]
        }
    },
    {
        "type": "奖品",
        "no": "0074",
        "url_tid": "12112",
        "name": "猫眼",
        "date": "2015-4-26",
        "buy_limit": "参加生活爆照版块【第一届自拍活动】，取得前三名",
        "price": "无",
        "levels": "【 Max 】1% 发帖金币+300 灵魂+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201405/01/175335t62paomgyypj4mgo.gif", 82]
        }
    },
    {
        "type": "奖品",
        "no": "0073",
        "url_tid": "12111",
        "name": "一只可爱的小猫",
        "date": "2015-4-26",
        "buy_limit": "参加生活爆照版块【第一届自拍活动】",
        "price": "无",
        "levels": "【等级1】无属性▕▏升级条件：血液≥30\n【等级2】5% 回帖血液+1▕▏升级条件：血液≥60\n【等级3】勋章博物馆资料暂缺\n【等级4】勋章博物馆资料暂缺\n【等级5】勋章博物馆资料暂缺\n【等级6】9% 回帖咒术+1 ▕▏升级条件：血液≥200\n【 Max 】50% 回帖血液+1、发帖血液+3 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/175341mtqucgpumgm9ke9g.gif", 40],
            "2": ["https://img.gamemale.com/album/201405/01/175343r5b5b8z6gdl8ncu9.gif", 40],
            "3": ["", 40],
            "4": ["", 40],
            "5": ["", 40],
            "6": ["https://img.gamemale.com/album/201405/01/175348sjj8a8jj4exei9f7.gif", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/175349pqv5qqpscos00qv9.gif", 40]
        }
    },
    {
        "type": "场景&版块",
        "no": "0072",
        "url_tid": "12109",
        "name": "上古卷轴V：天际",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖金币+2",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201405/01/174258j1pqpz5j1tj31jce.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0071",
        "url_tid": "12108",
        "name": "TRPG版塊",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201405/09/060720njwty9kstktd9j0a.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0070",
        "url_tid": "12107",
        "name": "辐射：新维加斯",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖堕落+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201405/01/174314fjxmojar2mj3zjmj.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0069",
        "url_tid": "12106",
        "name": "五花八门版块",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201405/01/174322ul9luxwgjwtbxlxe.gif", 124]
        }
    },
    {
        "type": "场景&版块",
        "no": "0068",
        "url_tid": "12105",
        "name": "质量效应三部曲",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】2% 回帖血液+2",
        "levels_img": {
            "Max": ["https://www.gamemale.com/album/201405/01/174305dmpmksft301qms0m.gif", 124]
        }
    },
    {
        "type": "天赋",
        "no": "0067",
        "url_tid": "12104",
        "name": "骑兽之子",
        "date": "2015-4-26",
        "buy_limit": "旅程≥120，灵魂≥1",
        "price": "无",
        "levels": "【等级1】20% 回帖血液+1、发帖血液+3 咒术+1▕▏升级条件：灵魂 ≥3\n【 Max 】50% 回帖血液+1、发帖血液+3 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/171924l2fl22hk9lojbod7.gif", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/181923pyw1tojy1d66dffw.gif", 124]
        }
    },
    {
        "type": "天赋",
        "no": "0066",
        "url_tid": "12103",
        "name": "黄色就是俏皮",
        "date": "2015-4-26",
        "buy_limit": "堕落>20，血液>60，主题数≥6",
        "price": "无",
        "levels": "【等级1】3% 回帖血液+1、发帖血液+1▕▏升级条件：主题数≥50\n【 Max 】10% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/171901esspa6ssj9pzo7j9.gif", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/171908qgoakyepa3d55eoy.gif", 82]
        }
    },
    {
        "type": "天赋",
        "no": "0065",
        "url_tid": "12102",
        "name": "堕落之舞",
        "date": "2015-4-26",
        "buy_limit": "堕落>40",
        "price": "无",
        "levels": "【 Max 】35% 发帖金币+3",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201405/01/171912gzkc7k02p70qukpl.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0064",
        "url_tid": "12101",
        "name": "诺曼底号",
        "date": "2015-4-26",
        "buy_limit": "无（该勋章不可寄售，仅可回收）",
        "price": "8700金币",
        "levels": "【等级1】无属性▕▏升级条件：金币≥100\n【等级2】50% 发帖血液+7 金币+7▕▏升级条件：金币≥1000\n【等级3】50% 发帖血液+7 旅程+1 金币+7▕▏升级条件：金币≥5000\n【等级4】50% 发帖血液+7 旅程+1 咒术+3 金币+7▕▏升级条件：金币≥10000\n【等级5】50% 发帖血液+7 旅程+1 咒术+3 知识+1 金币+7▕▏升级条件：金币≥20000\n【 Max 】50% 发帖金币+7",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/171603c3w7yxde7ygs2ww2.gif", 124],
            "2": ["https://img.gamemale.com/album/201405/01/181512scdxbdc3uf0ucf0c.gif", 124],
            "3": ["https://img.gamemale.com/album/201405/01/181516bmbckkmpbj3tmjw5.gif", 124],
            "4": ["https://img.gamemale.com/album/201405/01/181521thx5ivpgufmffuev.gif", 124],
            "5": ["https://img.gamemale.com/album/201405/01/181526k0fv0eup7fe5pecq.gif", 124],
            "Max": ["https://img.gamemale.com/album/201405/01/171624ef8ab4bwzrrrrbqf.gif", 124]
        }
    },
    {
        "type": "资产",
        "no": "0063",
        "url_tid": "12100",
        "name": "夜灯",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "40金币",
        "levels": "【等级1】1% 回帖血液+1▕▏升级条件：消耗15金币\n【等级2】2% 回帖血液+1▕▏升级条件：消耗30金币\n【等级3】3% 回帖血液+1▕▏升级条件：消耗45金币\n【等级4】4% 回帖血液+1▕▏升级条件：消耗60金币\n【等级5】5% 回帖血液+1▕▏升级条件：消耗75金币\n【等级6】6% 回帖血液+1▕▏升级条件：消耗90金币\n【等级7】7% 回帖血液+1▕▏升级条件：消耗-6旅程\n【 Max 】7% 回帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/171125n1t9yotlyziz8dio.gif", 40],
            "2": ["https://img.gamemale.com/album/201405/01/171128gyeeleedylau7elo.gif", 40],
            "3": ["https://img.gamemale.com/album/201405/01/171132uvidi5auyda6iyv1.gif", 40],
            "4": ["https://img.gamemale.com/album/201405/01/171136kqjtn7095qome00q.gif", 40],
            "5": ["https://img.gamemale.com/album/201405/01/171139f5m5ab49llyllktb.gif", 40],
            "6": ["https://img.gamemale.com/album/201405/01/171142gcxbqooz0xjyo9pj.gif", 40],
            "7": ["https://img.gamemale.com/album/201405/01/171144q8mghewnhcoo8rwn.gif", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/171148g6hn26jgilljulgz.gif", 40]
        }
    },
    {
        "type": "宠物",
        "no": "0062",
        "url_tid": "12099",
        "name": "洞窟魔蛋",
        "date": "2015-4-26",
        "buy_limit": "咒术≥40",
        "price": "1金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗30血液\n【等级2】5% 回帖咒术+1▕▏升级条件：消耗70血液\n【 Max 】14% 回帖咒术+2 血液-2、发帖咒术+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201905/29/221527hmxxffh1kqt21x1q.gif", 40],
            "2": ["https://img.gamemale.com/album/201905/29/221526psususo2scunfnul.gif", 40],
            "Max": ["https://img.gamemale.com/album/201905/29/221526p9fcrklr9r1rccf3.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0061",
        "url_tid": "12098",
        "name": "种植菠菜",
        "date": "2015-4-26",
        "buy_limit": "主题数≥5",
        "price": "30金币",
        "levels": "【等级1】无属性▕▏升级条件：知识≥1\n【等级2】无属性▕▏升级条件：消耗10金币\n【等级3】无属性▕▏升级条件：知识≥2\n【等级4】无属性▕▏升级条件：消耗10金币\n【等级5】无属性▕▏升级条件：知识≥3\n【等级6】无属性▕▏升级条件：消耗15金币\n【等级7】5% 回帖血液+1、发帖血液+1▕▏升级条件：消耗-35血液\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/171301kqvy6dvkkcdgdgi3.gif", 40],
            "2": ["https://img.gamemale.com/album/201405/01/171302sxzsi3kd3xhobonn.gif", 40],
            "3": ["https://img.gamemale.com/album/201405/01/171303crqorqqd6zq9bzb6.gif", 40],
            "4": ["https://img.gamemale.com/album/201405/01/171306n9lk1ko5yq1ggd5k.gif", 40],
            "5": ["https://img.gamemale.com/album/201405/01/171311mjj9mc9lsbc7kj9z.gif", 40],
            "6": ["https://img.gamemale.com/album/201405/01/171257iz5qaphahad4prdp.gif", 40],
            "7": ["https://img.gamemale.com/album/201405/01/171255jxvggkywixsh7qez.gif", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/171258fmvd0qdqqh5d3wcd.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0060",
        "url_tid": "12097",
        "name": "漂洋小船",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "75金币",
        "levels": "【 Max 】2% 回帖旅程+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201405/01/171723rvuz4f4b4fsbeb4e.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0059",
        "url_tid": "12096",
        "name": "流失之椅",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "320金币",
        "levels": "【等级1】40% 回帖血液+1、发帖旅程+1▕▏升级条件：在线时间≥80\n【等级2】32% 回帖血液+1、发帖旅程+1▕▏升级条件：在线时间≥150\n【等级3】24% 回帖血液+1、发帖旅程+1▕▏升级条件：在线时间≥300\n【等级4】17% 回帖血液+1、发帖旅程+1▕▏升级条件：在线时间≥500\n【等级5】9% 回帖血液+1、发帖旅程+1▕▏升级条件：在线时间≥800\n【等级6】3% 回帖血液+1、发帖旅程+1▕▏升级条件：在线时间≥1000\n【等级7】无属性▕▏升级条件：消耗1灵魂\n【 Max 】50% 回帖血液+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/171208sb6cvvb4c4gxlcrv.gif", 40],
            "2": ["https://img.gamemale.com/album/201405/01/171210mzycvmree4rc2xh2.gif", 40],
            "3": ["https://img.gamemale.com/album/201405/01/171211ykqzb3vjvtz3grjj.gif", 40],
            "4": ["https://img.gamemale.com/album/201405/01/171217n5hjsj68p37xj5sw.gif", 40],
            "5": ["https://img.gamemale.com/album/201405/01/171222mng6y1m6gymf1qhg.gif", 40],
            "6": ["https://img.gamemale.com/album/201405/01/171223xjo99zq55nprqxwq.gif", 40],
            "7": ["https://img.gamemale.com/album/201405/01/171224d21s8w8vmw717avs.gif", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/171226g8b8dzdnhgfqh7gf.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0058",
        "url_tid": "12095",
        "name": "念念往日士官盔",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "125金币",
        "levels": "【 Max 】30% 回帖金币-1 血液+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201405/01/174958c2f55oo3o5oa7oz4.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0057",
        "url_tid": "12094",
        "name": "超级名贵无用宝剑",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "1299金币",
        "levels": "【 Max 】无属性",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201405/01/175015mnobpnnpp88apyzu.gif", 124]
        }
    },
    {
        "type": "咒术",
        "no": "0056",
        "url_tid": "12093",
        "name": "吞食魂魄",
        "date": "2015-4-26",
        "buy_limit": "知识≥35",
        "price": "1灵魂",
        "duration": "7天",
        "levels": "【等级1】无属性▕▏升级条件：消耗-1001血液\n【等级2】无属性▕▏升级条件：堕落≥10\n【 Max 】10% 回帖血液-1、发帖血液-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/114453pdfdd3pnfut2uqxd.gif", 40],
            "2": ["https://img.gamemale.com/album/201507/02/114452vbww9wpt9cr8n999.gif", 40],
            "Max": ["https://img.gamemale.com/album/201507/02/114453rn7kkne7371e0ok7.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0055",
        "url_tid": "12092",
        "name": "猫化弩哥",
        "date": "2015-4-26",
        "buy_limit": "堕落>5",
        "price": "200金币",
        "levels": "【 Max 】6% 发帖知识+1 咒术+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201405/01/173353hye43yixgzz2jvxs.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0054",
        "url_tid": "12091",
        "name": "亚当‧简森",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "350金币",
        "levels": "【等级1】5% 回帖金币+1、发帖血液+1▕▏升级条件：消耗20咒术\n【等级2】6% 回帖金币+1、发帖血液+2▕▏升级条件：知识≥15\n【等级3】7% 回帖金币+2、发帖血液+3▕▏升级条件：消耗50咒术\n【等级4】8% 回帖金币+2、发帖血液+4▕▏升级条件：知识≥45\n【 Max 】9% 回帖金币+3、发帖血液+5",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/29/181315fwq0uf7s99bqh2b3.gif", 40],
            "2": ["https://img.gamemale.com/album/201405/29/181317el4efflbuaju4zlw.gif", 40],
            "3": ["https://img.gamemale.com/album/201405/29/181319lld99jd9zww9mx9a.gif", 40],
            "4": ["https://img.gamemale.com/album/201405/29/181325tlnvry79zv56vipi.gif", 82],
            "Max": ["https://img.gamemale.com/album/201405/29/181340nt55mrrxthxxmml0.gif", 124]
        }
    },
    {
        "type": "真人男从",
        "no": "0053",
        "url_tid": "12090",
        "name": "罗伯‧史塔克",
        "date": "2015-4-26",
        "buy_limit": "堕落<30",
        "price": "500金币",
        "levels": "【等级1】1% 回帖金币+1 知识+1▕▏升级条件：堕落≥10\n【等级2】2% 回帖金币+1 知识+1▕▏升级条件：消耗200金币\n【等级3】5% 回帖金币+1、发帖旅程+1▕▏升级条件：主题数≥35\n【等级4】8% 回帖金币+1、发帖旅程+1▕▏升级条件：消耗300血液\n【等级5】10% 回帖金币+1、发帖旅程+1▕▏升级条件：总积分≥300\n【等级6】11% 回帖金币+1、发帖旅程+1 金币+3▕▏升级条件：消耗500金币\n【等级7】13% 回帖金币+2、发帖旅程+1 金币+3▕▏升级条件：消耗700血液\n【 Max 】50% 发帖金币+7 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/173405o3cw5ffxy72e6s4v.gif", 40],
            "2": ["", 40],
            "3": ["https://img.gamemale.com/album/201405/01/173419sb9vv2vs22x9ecjd.gif", 40],
            "4": ["", 82],
            "5": ["", 82],
            "6": ["", 82],
            "7": ["https://img.gamemale.com/album/201405/01/173530zr7urj4zyao4oxjy.gif", 82],
            "Max": ["https://img.gamemale.com/album/201405/01/182625yxx81zzbkk8bcb4b.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0052",
        "url_tid": "12088",
        "name": "亚力斯塔尔",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "450金币",
        "levels": "【等级1】5% 发帖血液+2▕▏升级条件：发帖数≥200\n【等级2】10% 发帖血液+2▕▏升级条件：发帖数≥500\n【等级3】15% 发帖血液+2▕▏升级条件：消耗1灵魂\n【 Max 】40% 发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/173025wsibxvs0ywtbqpeq.gif", 40],
            "2": ["https://img.gamemale.com/album/201405/01/173032x0ywemw6kt0wnr9c.gif", 40],
            "3": ["https://img.gamemale.com/album/201405/01/173038jf8x3tvxtjz87jf3.gif", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/173102zpf3rstrzs1u7zum.gif", 82]
        }
    },
    {
        "type": "装备",
        "no": "0051",
        "url_tid": "12087",
        "name": "重磅手环",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "250金币",
        "levels": "【 Max 】20% 发帖血液-5 旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201403/20/105402f88clufxfhelcl8l.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0050",
        "url_tid": "12086",
        "name": "里昂‧S‧甘乃迪",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "450金币",
        "levels": "【等级1】8% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥100\n【等级2】10% 回帖金币+1、发帖金币+1▕▏升级条件：血液≥180\n【等级3】10% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：消耗300金币\n【等级4】12% 回帖金币+2 血液+1、发帖金币+2 血液+1▕▏升级条件：血液≥300\n【 Max 】16% 回帖血液+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202305/01/151513emxqggcf0qbbt9b2.gif", 40],
            "2": ["https://img.gamemale.com/album/202305/01/151514vssr59s95brgllci.gif", 40],
            "3": ["https://img.gamemale.com/album/202305/01/151515zkp1k65h8pbjuv60.gif", 40],
            "4": ["https://img.gamemale.com/album/202305/01/151802hyiww7ter7dwtwgd.gif", 40],
            "Max": ["https://img.gamemale.com/album/202305/01/151516ke4gxwhh45rx77k9.gif", 40]
        }
    },
    {
        "type": "女从",
        "no": "0049",
        "url_tid": "12085",
        "name": "梅格",
        "date": "2015-4-26",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】5% 回帖堕落+1▕▏升级条件：追随≥22\n【等级2】8% 回帖堕落+1▕▏升级条件：追随≥44\n【 Max 】12% 回帖堕落+1 血液+1、发帖堕落+1 血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/202303/01/145426xq55pqpgwm5iy7yi.gif", 40],
            "2": ["https://img.gamemale.com/album/202303/01/145426tj3jtms47xk9djmj.gif", 40],
            "Max": ["https://img.gamemale.com/album/202303/01/145427xrhhccqqccawckzr.gif", 40]
        }
    },
    {
        "type": "薪俸与其他",
        "no": "0048",
        "url_tid": "12077",
        "name": "版主: 一国之主",
        "date": "2015-4-25",
        "buy_limit": "仅“版主”可领取",
        "price": "无",
        "duration": "30天",
        "levels": "【等级1】无属性▕▏升级条件：消耗-200金币\n【 Max 】100% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "1": ["", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/180003ndvk1od2edda4bi1.gif", 40]
        }
    },
    {
        "type": "薪俸与其他",
        "no": "0047",
        "url_tid": "12076",
        "name": "见习版主: 神的重量",
        "date": "2015-4-25",
        "buy_limit": "仅“见习版主”可领取",
        "price": "无",
        "duration": "30天",
        "levels": "【等级1】无属性▕▏升级条件：消耗-130金币\n【 Max 】100% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "1": ["", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/180032jpqlthqtqwlqhq3l.gif", 40]
        }
    },
    {
        "type": "薪俸与其他",
        "no": "0046",
        "url_tid": "12075",
        "name": "站员: 保卫领土",
        "date": "2015-4-25",
        "buy_limit": "仅“站员”可领取",
        "price": "无",
        "duration": "30天",
        "levels": "【等级1】无属性▕▏升级条件：消耗-100金币\n【 Max 】100% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201405/01/180014pp8k6tdb37abc67z.gif", 40],
            "Max": ["https://img.gamemale.com/album/201405/01/180018mo7huror8mzm7t7c.gif", 40]
        }
    },
    {
        "type": "薪俸与其他",
        "no": "0045",
        "url_tid": "12074",
        "name": "Chris Redfield in Uroboros",
        "date": "2015-4-25",
        "buy_limit": "“重口味学习小组”群组勋章，由群主颁发",
        "price": "无",
        "levels": "【 Max 】1% 回帖知识+1、发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201505/23/100504y3jplburl1zk5l2u.gif", 40]
        }
    },
    {
        "type": "故事",
        "no": "0044",
        "url_tid": "12073",
        "name": "神之匠工",
        "date": "2015-4-25",
        "buy_limit": "论坛空间布置大赛冠军勋章",
        "price": "无",
        "levels": "【 Max 】15% 回帖金币+2、发帖金币+2 知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201401/01/235436xs6fn5lkpnihlv06.gif", 40]
        }
    },
    {
        "type": "故事",
        "no": "0043",
        "url_tid": "12072",
        "name": "另一个身份",
        "date": "2015-4-25",
        "buy_limit": "拥有马甲账号的管理人员可以获得(授予非管理的马甲账号，卸下管理组后立即回收)",
        "price": "无",
        "levels": "【 Max 】20% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201401/01/115527bgztx4ty4otxuoyu.gif", 40]
        }
    },
    {
        "type": "故事",
        "no": "0042",
        "url_tid": "12071",
        "name": "被祝福的新旅程",
        "date": "2015-4-25",
        "buy_limit": "因论坛错误导致用户权益受损的补赏勋章",
        "price": "无",
        "levels": "【 Max 】5% 回帖旅程+1、发帖旅程+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201903/30/161303x917gzpwzz3co882.gif", 40]
        }
    },
    {
        "type": "天赋",
        "no": "0041",
        "url_tid": "12070",
        "name": "森林羊男",
        "date": "2015-4-25",
        "buy_limit": "注册天数>45，在线时间>200，血液>150，旅程>50",
        "price": "无",
        "levels": "【 Max 】5% 回帖知识+1、发帖知识+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201401/01/192107axq7ixrlrc67rxc2.gif", 82]
        }
    },
    {
        "type": "天赋",
        "no": "0040",
        "url_tid": "12069",
        "name": "牧羊人",
        "date": "2015-4-25",
        "buy_limit": "发帖数≥100",
        "price": "无",
        "levels": "【等级1】5% 发帖旅程+1▕▏升级条件：发帖数>250\n【等级2】8% 发帖旅程+1▕▏升级条件：发帖数>500\n【 Max 】10% 发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/192055w11popewpdedxoxp.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/192058zt7pjdbdwkadrcbz.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/192101yex7ui47hvb4jaln.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0039",
        "url_tid": "12068",
        "name": "金钱马车",
        "date": "2015-4-25",
        "buy_limit": "旅程≥10",
        "price": "200金币",
        "levels": "【等级1】无属性▕▏升级条件：金币≥1\n【等级2】23% 回帖金币+1▕▏升级条件：金币≥50\n【等级3】15% 回帖金币+2▕▏升级条件：金币≥100\n【等级4】26% 回帖金币+2▕▏升级条件：金币≥187\n【等级5】55% 回帖咒术+1▕▏升级条件：金币≥189\n【等级6】40% 回帖金币+3▕▏升级条件：金币≥250\n【等级7】7% 回帖金币+1▕▏升级条件：金币≥345\n【等级8】60% 回帖金币+10▕▏升级条件：金币≥346\n【等级9】10% 回帖血液-1▕▏升级条件：金币≥360\n【等级10】15% 回帖金币+2▕▏升级条件：金币≥501\n【等级11】18% 回帖知识+1▕▏升级条件：金币≥502\n【等级12】7% 回帖金币+1▕▏升级条件：金币≥617\n【等级13】26% 回帖金币+2▕▏升级条件：金币≥749\n【等级14】2% 发帖灵魂+1▕▏升级条件：金币≥750\n【等级15】30% 回帖金币+3 血液+1▕▏升级条件：金币≥823\n【等级16】23% 回帖金币+1▕▏升级条件：金币≥978\n【等级17】无属性▕▏升级条件：金币≥1000\n【等级18】15% 回帖金币+2▕▏升级条件：金币≥1092\n【等级19】26% 回帖金币+2▕▏升级条件：金币≥1202\n【等级20】55% 回帖咒术+1▕▏升级条件：金币≥1204\n【等级21】40% 回帖金币+3▕▏升级条件：金币≥1250\n【等级22】7% 回帖金币+1▕▏升级条件：金币≥1334\n【等级23】60% 回帖金币+10▕▏升级条件：金币≥1335\n【等级24】23% 回帖金币+1▕▏升级条件：金币≥1500\n【等级25】15% 回帖金币+2▕▏升级条件：金币≥1666\n【等级26】2% 发帖灵魂+1▕▏升级条件：金币≥1667\n【等级27】无属性▕▏升级条件：金币≥1699\n【等级28】23% 回帖金币+1▕▏升级条件：金币≥1750\n【等级29】10% 回帖血液-1▕▏升级条件：金币≥1763\n【等级30】30% 回帖金币+3 血液+1▕▏升级条件：金币≥1811\n【等级31】7% 回帖金币+1▕▏升级条件：金币≥1888\n【等级32】18% 回帖知识+1▕▏升级条件：金币≥1889\n【等级33】26% 回帖金币+2▕▏升级条件：金币≥2000\n【等级34】23% 回帖金币+1▕▏升级条件：金币≥2073\n【等级35】无属性▕▏升级条件：金币≥2101\n【等级36】27% 回帖金币+3▕▏升级条件：金币≥2250\n【等级37】15% 回帖金币+2▕▏升级条件：金币≥2348\n【等级38】60% 回帖金币+10▕▏升级条件：金币≥2349\n【等级39】40% 回帖金币+3▕▏升级条件：金币≥2401\n【等级40】7% 回帖金币+1▕▏升级条件：金币≥2500\n【等级41】18% 回帖知识+1▕▏升级条件：金币≥2501\n【等级42】26% 回帖金币+2▕▏升级条件：金币≥2615\n【等级43】23% 回帖金币+1▕▏升级条件：金币≥2748\n【等级44】55% 回帖咒术+1▕▏升级条件：金币≥2750\n【等级45】10% 回帖血液-1▕▏升级条件：金币≥2866\n【等级46】7% 回帖金币+1▕▏升级条件：金币≥2903\n【等级47】2% 发帖灵魂+1▕▏升级条件：金币≥2904\n【等级48】15% 回帖金币+2▕▏升级条件：金币≥2962\n【等级49】30% 回帖金币+3 血液+1▕▏升级条件：金币≥3000\n【 Max 】无属性",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/03/051322sfammplfp8j0xflf.gif", 82],
            "2": ["https://img.gamemale.com/album/201401/03/051333jgkmzk8i8g4m74vv.gif", 82],
            "3": ["https://img.gamemale.com/album/201401/03/051359a12uq20iiss0i9x6.gif", 82],
            "4": ["https://img.gamemale.com/album/201401/03/051443df7gfcr4r1jc1tgv.gif", 82],
            "5": ["https://img.gamemale.com/album/201401/03/051451ebn2b7l5b9nlp8x5.gif", 82],
            "6": ["https://img.gamemale.com/album/201401/03/051521k7nna23nzm4zp0dd.gif", 82],
            "7": ["https://img.gamemale.com/album/201401/03/051547cyzgohq5jzm2kqlo.gif", 82],
            "8": ["https://img.gamemale.com/album/201401/03/051556pht63z236nnnjpvs.gif", 82],
            "9": ["https://img.gamemale.com/album/201401/03/051559eyrcq8q0209sssc5.gif", 82],
            "10": ["https://img.gamemale.com/album/201401/03/051620b08ia7p58tr3nt3n.gif", 82],
            "11": ["https://img.gamemale.com/album/201406/12/004129f3vfmmvgy8zvffyk.gif", 82],
            "12": ["https://img.gamemale.com/album/201401/03/051642ullldgw8ugmxbgcu.gif", 82],
            "13": ["https://img.gamemale.com/album/201401/03/051707ukaqc1ikc20fiigf.gif", 82],
            "14": ["https://img.gamemale.com/album/201401/03/051713rxf98quv4b4tn9no.gif", 82],
            "15": ["https://img.gamemale.com/album/201401/03/051738i23x7gqg06lnxs0q.gif", 82],
            "16": ["https://img.gamemale.com/album/201401/03/051749umhhqhqhhb1um4c4.gif", 82],
            "17": ["https://img.gamemale.com/album/201401/03/051812j0w9xux0q3lclb0u.gif", 82],
            "18": ["https://img.gamemale.com/album/201401/03/051843athyoxqh8xys550e.gif", 82],
            "19": ["https://img.gamemale.com/album/201401/03/051914ewsjmgw2arz2zwdh.gif", 82],
            "20": ["https://img.gamemale.com/album/201401/03/051920fa3no2p9n8p2hn3z.gif", 82],
            "21": ["https://img.gamemale.com/album/201401/03/051947w7thlgigc076701l.gif", 82],
            "22": ["https://img.gamemale.com/album/201401/03/052011zy88fabfucby8s21.gif", 82],
            "23": ["https://img.gamemale.com/album/201401/03/052019a1vr3tde11t109t1.gif", 82],
            "24": ["https://img.gamemale.com/album/201401/03/052029c25bybpx3xh455y3.gif", 82],
            "25": ["https://img.gamemale.com/album/201401/03/052049yhhqr5zgqg1c6j2o.gif", 82],
            "26": ["https://img.gamemale.com/album/201401/03/052054plla35mllm66i0jl.gif", 82],
            "27": ["https://img.gamemale.com/album/201401/03/052401lubbjblm3l8jlblj.gif", 82],
            "28": ["https://img.gamemale.com/album/201401/03/052407j41nzi94uh4c15qf.gif", 82],
            "29": ["https://img.gamemale.com/album/201401/03/052411oym2hc942242cz2o.gif", 82],
            "30": ["https://img.gamemale.com/album/201401/03/052437mmu45rmpca4ncme4.gif", 82],
            "31": ["https://img.gamemale.com/album/201401/03/052538kvzpk5ubyxpxyzxt.gif", 82],
            "32": ["https://img.gamemale.com/album/201406/12/004130egg0hghh6hh4495g.gif", 82],
            "33": ["https://img.gamemale.com/album/201401/03/052605skx8825jl8khp4ul.gif", 82],
            "34": ["https://img.gamemale.com/album/201401/03/052613py0fhdtt7cphtovt.gif", 82],
            "35": ["https://img.gamemale.com/album/201401/03/052633wu11q1k1omsuu3qb.gif", 82],
            "36": ["https://img.gamemale.com/album/201401/03/052701e5dbdbn045zrs00u.gif", 82],
            "37": ["https://img.gamemale.com/album/201401/03/052730mgy5yogtorr3ytzu.gif", 82],
            "38": ["https://img.gamemale.com/album/201401/03/052739wqvcsuwe4chl4v1v.gif", 82],
            "39": ["https://img.gamemale.com/album/201401/03/052800musl2iqk93ls9gxq.gif", 82],
            "40": ["https://img.gamemale.com/album/201401/03/052819zyhncyhxhcohvnxn.gif", 82],
            "41": ["https://img.gamemale.com/album/201406/12/004131azu88b2unhb8bh3s.gif", 82],
            "42": ["https://img.gamemale.com/album/201401/03/052917retef7xfeyf7feff.gif", 82],
            "43": ["https://img.gamemale.com/album/201401/03/052923mtiqiqomafmncdli.gif", 82],
            "44": ["https://img.gamemale.com/album/201401/03/052927tsq4lbqsjvs9lpqj.gif", 82],
            "45": ["https://img.gamemale.com/album/201401/03/052930xkj9yqykd7k77nly.gif", 82],
            "46": ["https://img.gamemale.com/album/201401/03/052950ijb7i0iymiw0jb2x.gif", 82],
            "47": ["https://img.gamemale.com/album/201401/03/052955zgrlj5pnigmm0wmj.gif", 82],
            "48": ["https://img.gamemale.com/album/201401/03/053015h9o90i890wz0nwio.gif", 82],
            "49": ["https://img.gamemale.com/album/201401/03/053042cak7kbxz6aaaxxbz.gif", 82],
            "Max": ["https://img.gamemale.com/album/201401/03/053047fxx0k3j7y88728mx.gif", 82]
        }
    },
    {
        "type": "资产",
        "no": "0038",
        "url_tid": "12067",
        "name": "聚魔花盆",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "500金币",
        "levels": "【等级1】10% 发帖咒术+3▕▏升级条件：知识≥5\n【等级2】20% 发帖咒术+3▕▏升级条件：知识≥10\n【等级3】30% 发帖咒术+3▕▏升级条件：知识≥15\n【等级4】40% 发帖咒术+3▕▏升级条件：知识≥30\n【等级5】50% 发帖咒术+3▕▏升级条件：知识≥50\n【等级6】60% 发帖咒术+3▕▏升级条件：堕落≥30\n【 Max 】30% 发帖咒术+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/135939kvn26zlvee6w0xvq.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/135948mvv4vt11rakirty9.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/135955kkzx01gjgi8bjg0o.gif", 40],
            "4": ["https://img.gamemale.com/album/201401/01/140003tq130jt00f5f0tv1.gif", 40],
            "5": ["https://img.gamemale.com/album/201401/01/140012np4zzv4pn4vm4jch.gif", 40],
            "6": ["https://img.gamemale.com/album/201401/01/140020jpjnqc2nykzll38j.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/140037ny9sih0ik9qiabei.gif", 40]
        }
    },
    {
        "type": "资产",
        "no": "0037",
        "url_tid": "12066",
        "name": "种植小草",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "15金币",
        "levels": "【等级1】无属性▕▏升级条件：追随≥5\n【等级2】无属性▕▏升级条件：追随≥10\n【等级3】无属性▕▏升级条件：追随≥15\n【等级4】无属性▕▏升级条件：消耗-1血液\n【 Max 】1% 回帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/04/053001k5nhfhrhh24h05lr.png", 40],
            "2": ["https://img.gamemale.com/album/201401/01/191259gm9fs7u5wb5oltfk.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/191137xup7up18fuopgelj.gif", 40],
            "4": ["https://img.gamemale.com/album/201401/01/191141q8lfb25s1u89nu48.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/191252tta07z10ed7tf0d3.png", 40]
        }
    },
    {
        "type": "资产",
        "no": "0036",
        "url_tid": "12065",
        "name": "微笑的面具",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【等级1】无属性▕▏升级条件：主题数≥10\n【等级2】无属性▕▏升级条件：主题数≥20\n【等级3】无属性▕▏升级条件：主题数≥30\n【等级4】无属性▕▏升级条件：主题数≥40\n【等级5】无属性▕▏升级条件：主题数≥50\n【 Max 】20% 回帖堕落+1、发帖堕落+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/191034vvnpn72cimmfvci7.png", 40],
            "2": ["https://img.gamemale.com/album/201401/01/191023istdd3vsvkfsitt3.png", 40],
            "3": ["", 40],
            "4": ["https://img.gamemale.com/album/201401/01/191037ixz77stdxx4ihzsm.png", 40],
            "5": ["https://img.gamemale.com/album/201401/01/191026pzq1qlsmkqmy15mm.png", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/191021ve51bjb3ub2u1413.png", 40]
        }
    },
    {
        "type": "资产",
        "no": "0035",
        "url_tid": "12064",
        "name": "知识大典",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "50金币",
        "levels": "【 Max 】1% 回帖知识+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201401/01/191007euxdoxrss8vvkhku.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0034",
        "url_tid": "12063",
        "name": "药剂背袋",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "180金币",
        "levels": "【 Max 】8% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201401/01/115659t6qz4z0b4v9kbv0d.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0033",
        "url_tid": "12062",
        "name": "刺杀者匕首",
        "date": "2015-4-25",
        "buy_limit": "堕落>10",
        "price": "80金币",
        "levels": "【 Max 】5% 回帖金币+3",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201401/01/115610sh667p0s6hoh0h6l.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0032",
        "url_tid": "12061",
        "name": "十字叶章",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "277金币",
        "levels": "【等级1】5% 回帖堕落-1▕▏升级条件：追随≥45\n【等级2】5% 回帖堕落-1 咒术+1、发帖咒术+1▕▏升级条件：消耗80血液\n【 Max 】1% 回帖堕落-5 咒术+5、发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/115605pg9ckg8u5goaz4u8.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/115607ukyssasdxhz48n2l.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/115609nau1lkwad7czd4dd.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0031",
        "url_tid": "12060",
        "name": "净化手杖",
        "date": "2015-4-25",
        "buy_limit": "堕落<50",
        "price": "400金币",
        "levels": "【等级1】10% 发帖堕落-1▕▏升级条件：在线时间≥800\n【 Max 】20% 回帖堕落-1、发帖堕落-1 咒术+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/115615g3ywm3l3113mzdvi.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/115617pb57iai0o0as0itp.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0030",
        "url_tid": "12059",
        "name": "符文披风",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "280金币",
        "levels": "【 Max 】8% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201401/01/115649ube4qud0b87brby4.gif", 40]
        }
    },
    {
        "type": "装备",
        "no": "0029",
        "url_tid": "12058",
        "name": "嗜血斩首斧",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "100金币",
        "levels": "【 Max 】5% 回帖堕落+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201401/01/115656oy8nrt00r8hmtz8n.gif", 40]
        }
    },
    {
        "type": "咒术",
        "no": "0028",
        "url_tid": "12057",
        "name": "祈祷术",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "8咒术",
        "duration": "3天",
        "levels": "【等级1】15% 回帖堕落-1、发帖堕落-1▕▏升级条件：知识≥5\n【等级2】15% 回帖堕落-1、发帖堕落-1▕▏升级条件：消耗1堕落\n【等级3】12% 回帖堕落-1、发帖堕落-1▕▏升级条件：消耗1堕落\n【等级4】10% 回帖堕落-1、发帖堕落-1▕▏升级条件：消耗1堕落\n【等级5】8% 回帖堕落-1、发帖堕落-1▕▏升级条件：消耗1堕落\n【等级6】6% 回帖堕落-1、发帖堕落-1▕▏升级条件：消耗1堕落\n【 Max 】4% 回帖堕落-1、发帖堕落-1",
        "levels_img": {
            "1": ["", 40],
            "2": ["https://img.gamemale.com/album/201507/02/114508t313555p7xjj5bof.gif", 40],
            "3": ["https://img.gamemale.com/album/201507/02/114509kwizwwi6wwig466b.gif", 40],
            "4": ["https://img.gamemale.com/album/201507/02/114509ple4ccsdaxk4afwd.gif", 40],
            "5": ["https://img.gamemale.com/album/201507/02/114510za368j0fjj0dzbdj.gif", 40],
            "6": ["", 40],
            "Max": ["https://img.gamemale.com/album/201507/02/114510xiw6tseiytig6sii.gif", 40]
        }
    },
    {
        "type": "咒术",
        "no": "0027",
        "url_tid": "12056",
        "name": "召唤古代战士",
        "date": "2015-4-25",
        "buy_limit": "知识≥6",
        "price": "8咒术",
        "duration": "4天",
        "levels": "【等级1】10% 回帖血液+3、发帖血液+3▕▏升级条件：知识≥25\n【 Max 】30% 回帖血液+3、发帖血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/114441t4f5yx5yxuuybu65.gif", 40],
            "Max": ["https://img.gamemale.com/album/201507/02/114441c23iwtt088tq3pb7.gif", 82]
        }
    },
    {
        "type": "咒术",
        "no": "0026",
        "url_tid": "12055",
        "name": "水泡术",
        "date": "2015-4-25",
        "buy_limit": "知识≥3",
        "price": "3咒术",
        "duration": "5天",
        "levels": "【等级1】无属性▕▏升级条件：知识≥6\n【等级2】无属性▕▏升级条件：消耗-10血液\n【 Max 】1% 回帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/114428v66p06kdhy0zbcad.gif", 124],
            "2": ["https://img.gamemale.com/album/201507/02/114428kgmamyizamwjjl1g.gif", 124],
            "Max": ["https://img.gamemale.com/album/201507/02/114429w2htftmmmzz4l696.gif", 40]
        }
    },
    {
        "type": "咒术",
        "no": "0025",
        "url_tid": "12054",
        "name": "黑暗交易",
        "date": "2015-4-25",
        "buy_limit": "堕落>10，知识≥10",
        "price": "8咒术",
        "duration": "3天",
        "levels": "【等级1】无属性▕▏升级条件：血液≥1\n【等级2】25% 回帖金币+2 血液-1、发帖金币+2 血液-1▕▏升级条件：堕落≥25\n【等级3】无属性▕▏升级条件：血液≥2\n【等级4】25% 回帖金币+4 血液-2、发帖金币+4 血液-2▕▏升级条件：堕落≥50\n【等级5】无属性▕▏升级条件：血液≥3\n【 Max 】25% 回帖金币+6 血液-3、发帖金币+6 血液-3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/114519m87886yz0h0qut01.gif", 82],
            "2": ["https://img.gamemale.com/album/201507/02/114520o7x23c7c3cgbcy4y.gif", 82],
            "3": ["https://img.gamemale.com/album/201507/02/114520p01o6144f0xttno4.gif", 82],
            "4": ["https://img.gamemale.com/album/201507/02/114521mpss1ns8zoffs7fp.gif", 82],
            "5": ["https://img.gamemale.com/album/201507/02/114521i6ooexrb6bvjbseu.gif", 82],
            "Max": ["https://img.gamemale.com/album/201507/02/114522rdpozgrb218crrkd.gif", 82]
        }
    },
    {
        "type": "咒术",
        "no": "0024",
        "url_tid": "12053",
        "name": "炼金之心",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "4咒术",
        "duration": "3天",
        "levels": "【等级1】10% 回帖金币+2▕▏升级条件：知识≥3\n【等级2】15% 回帖金币+2▕▏升级条件：知识≥15\n【等级3】20% 回帖金币+2▕▏升级条件：知识≥30\n【 Max 】30% 回帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/114531ntxydovsnsxdqdov.gif", 40],
            "2": ["https://img.gamemale.com/album/201507/02/114531d2bkaq1zq1atk9va.gif", 40],
            "3": ["https://img.gamemale.com/album/201507/02/114531jwy1hteehzmvra8g.gif", 40],
            "Max": ["https://img.gamemale.com/album/201507/02/114532co4iziicnc04ck8m.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0023",
        "url_tid": "12052",
        "name": "贞洁内裤",
        "date": "2015-4-25",
        "buy_limit": "只可赠送（已下架）",
        "price": "110金币",
        "duration": "30天",
        "levels": "【 Max 】13% 回帖堕落-1 血液+3",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201401/01/191959nyfyv2b6v1hppbp6.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0022",
        "url_tid": "12051",
        "name": "灵光补脑剂",
        "date": "2015-4-25",
        "buy_limit": "只可赠送",
        "price": "22金币",
        "duration": "3天",
        "levels": "【等级1】升级条件：消耗-1知识\n【 Max 】2% 回帖血液-1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/02/113409l7tzet09qgx7uzpt.gif", 40],
            "Max": ["https://img.gamemale.com/album/201507/02/113408hctqvcqz0wjooqco.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0021",
        "url_tid": "12050",
        "name": "千杯不醉",
        "date": "2015-4-25",
        "buy_limit": "只可赠送",
        "price": "12金币",
        "duration": "5天",
        "levels": "【 Max 】5% 回帖血液+1 堕落+1、发帖血液+1 堕落+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201507/02/113342to7t7zj24jot5s7t.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0020",
        "url_tid": "12049",
        "name": "丢肥皂",
        "date": "2015-4-25",
        "buy_limit": "只可赠送",
        "price": "10金币",
        "duration": "5天",
        "levels": "【 Max 】10% 回帖堕落+1、发帖堕落+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201507/02/113346zfvtihpznujw1nii.gif", 40]
        }
    },
    {
        "type": "赠礼",
        "no": "0019",
        "url_tid": "12048",
        "name": "送情书",
        "date": "2015-4-25",
        "buy_limit": "只可赠送",
        "price": "18金币",
        "duration": "5天",
        "levels": "【 Max 】10% 回帖咒术+1、发帖咒术+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201507/02/113350j47rr1f17qq4nafs.gif", 40]
        }
    },
    {
        "type": "真人男从",
        "no": "0018",
        "url_tid": "12047",
        "name": "奥利弗‧奎恩",
        "date": "2015-4-25",
        "buy_limit": "堕落<50",
        "price": "680金币",
        "levels": "【等级1】5% 发帖血液+2▕▏升级条件：消耗40血液\n【等级2】7% 发帖血液+2▕▏升级条件：消耗65血液\n【等级3】9% 发帖血液+2▕▏升级条件：主题数≥15\n【等级4】11% 回帖血液+1、发帖血液+2▕▏升级条件：追随≥45\n【等级5】13% 回帖血液+1、发帖血液+2▕▏升级条件：消耗30堕落\n【等级6】13% 回帖血液+1、发帖血液+2▕▏升级条件：消耗500血液\n【 Max 】15% 回帖血液+1 堕落-1、发帖血液+2 堕落-3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/04/121410iocnbobhqdrdraoq.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/04/121414piiwnawiaknaitgm.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/04/121418fswmv8vg2v6ov2w6.gif", 40],
            "4": ["https://img.gamemale.com/album/201401/04/121426l39rbb8i9gm8iz38.gif", 82],
            "5": ["https://img.gamemale.com/album/201401/04/121434tud538ov9d99d009.gif", 82],
            "6": ["https://img.gamemale.com/album/201401/04/121449uku50dup6odxkho5.gif", 82],
            "Max": ["https://img.gamemale.com/album/201401/04/123010brrtjrtntmzp5j3z.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0017",
        "url_tid": "12046",
        "name": "肥皂",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗60金币\n【等级2】3% 回帖金币+1、发帖金币+5▕▏升级条件：消耗150金币\n【等级3】7% 回帖金币+1、发帖金币+5▕▏升级条件：追随≥50\n【等级4】10% 回帖金币+1、发帖金币+5▕▏升级条件：追随≥80\n【等级5】12% 回帖金币+1、发帖金币+5▕▏升级条件：消耗-200金币\n【 Max 】12% 回帖金币+2、发帖金币+5 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/111041k86xnhzoeevvs8mh.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/111048aaqakl5ctsg8drtk.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/111053odf49up8du744s9u.gif", 40],
            "4": ["https://img.gamemale.com/album/201401/01/111057p89vmdmt9dd4hv19.gif", 40],
            "5": ["https://img.gamemale.com/forum/202405/01/003840b989579tiybc0b90.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/111106dc2x6f1uk2dcu0ig.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0016",
        "url_tid": "12045",
        "name": "凯登‧阿兰科",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "550金币",
        "levels": "【等级1】5% 回帖金币+1▕▏升级条件：消耗20血液\n【等级2】5% 回帖金币+1 血液+1▕▏升级条件：血液≥60\n【等级3】7% 回帖金币+1 血液+1▕▏升级条件：消耗150金币\n【等级4】10% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：灵魂≥1\n【等级5】20% 回帖金币+1 血液+1、发帖金币+1 血液+1▕▏升级条件：消耗800金币\n【 Max 】50% 回帖金币+1 血液+1、发帖金币+3 血液+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/114439r1ppqs7ssh0etw5w.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/114444vlzkj3k94rhr9m5k.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/114448waxs6u72ntccuxul.gif", 40],
            "4": ["https://img.gamemale.com/album/201401/01/114453v68m922av4a5mtaa.gif", 82],
            "5": ["https://img.gamemale.com/album/201401/01/114459jaerdccmdrbeplcm.gif", 82],
            "Max": ["https://img.gamemale.com/album/201401/01/114516anrkkka88jfkfh0i.gif", 124]
        }
    },
    {
        "type": "游戏男从",
        "no": "0015",
        "url_tid": "12044",
        "name": "裸体克里斯",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "888金币",
        "levels": "【 Max 】100% 回帖金币+1、发帖金币+1",
        "levels_img": {
            "Max": ["https://img.gamemale.com/album/201401/01/110459avhufexivpuhkfue.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0014",
        "url_tid": "12043",
        "name": "克里斯‧雷德菲尔德",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "550金币",
        "levels": "【等级1】3% 回帖血液+1、发帖血液+1▕▏升级条件：消耗30血液\n【等级2】3% 回帖血液+2、发帖血液+2▕▏升级条件：追随≥50\n【等级3】4% 回帖血液+2、发帖血液+2 旅程+1▕▏升级条件：追随≥100\n【等级4】5% 回帖血液+2 旅程+1、发帖血液+2 旅程+1▕▏升级条件：消耗100血液\n【 Max 】7% 回帖血液+2 旅程+1 金币+1、发帖血液+2 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/110854wecejl2082gbhg3c.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/110859kr82uubuy4q25cr5.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/110904gxcccooo51hz733h.gif", 40],
            "4": ["", 82],
            "Max": ["https://img.gamemale.com/album/201401/01/110916nrxt3tztmta1axzr.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0013",
        "url_tid": "12042",
        "name": "威尔卡斯",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗10血液\n【等级2】无属性▕▏升级条件：消耗30血液\n【等级3】无属性▕▏升级条件：消耗60血液\n【 Max 】2% 发帖灵魂+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/114250lsaw2aynywna6gae.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/114256u30cprks0bxpbf7c.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/114304nbligxzily8ag1y2.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/114310kilorynyn51o1p44.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0012",
        "url_tid": "12041",
        "name": "杰夫‧莫罗",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗20血液\n【等级2】3% 发帖知识+1▕▏升级条件：血液≥100\n【等级3】3% 回帖知识+1、发帖知识+1▕▏升级条件：血液≥200\n【等级4】5% 回帖知识+1、发帖知识+1▕▏升级条件：消耗600金币\n【 Max 】7% 回帖知识+1、发帖知识+1 旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/forum/202008/15/102849spm9cjzf61bkmca8.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/114350l0smwjesszperj2y.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/114353ayzqlwphkha7p74a.gif", 40],
            "4": ["https://img.gamemale.com/album/201401/01/114357ilefiqmozi3fbhco.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/114404jwzw19yg9wg929ws.gif", 82]
        }
    },
    {
        "type": "真人男从",
        "no": "0011",
        "url_tid": "12040",
        "name": "盖里",
        "date": "2015-4-25",
        "buy_limit": "无",
        "price": "420金币",
        "levels": "【等级1】2% 发帖旅程+1▕▏升级条件：好友数≥10\n【等级2】5% 回帖血液+1、发帖旅程+1▕▏升级条件：好友数≥30\n【 Max 】7% 回帖血液+1 金币+1、发帖旅程+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/115306fd5tw9db50g0dk9g.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/115309du9mmexq1m2zmx2g.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/115312t6qoofzxm6s6fu1s.gif", 82]
        }
    },
    {
        "type": "游戏男从",
        "no": "0010",
        "url_tid": "12037",
        "name": "但丁",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "450金币",
        "levels": "【等级1】5% 发帖咒术+1▕▏升级条件：消耗10血液\n【等级2】8% 发帖咒术+1▕▏升级条件：消耗10咒术\n【等级3】10% 发帖咒术+2▕▏升级条件：消耗1灵魂\n【等级4】15% 发帖咒术+2▕▏升级条件：消耗30咒术\n【 Max 】20% 发帖咒术+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/110804vggzi3ccwigd44wb.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/110807ahwc1p5zz7idx64h.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/110811m2jtc2ikc8mv83c6.gif", 40],
            "4": ["https://img.gamemale.com/album/201401/01/110816m336766736ek6wg5.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/110823j9ky9ib99cnxm7mc.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0009",
        "url_tid": "12036",
        "name": "巴尔弗雷亚",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "350金币",
        "levels": "【等级1】4% 回帖金币+2、发帖金币+2▕▏升级条件：知识≥10\n【等级2】8% 回帖金币+2、发帖金币+2▕▏升级条件：知识≥30\n【 Max 】12% 回帖金币+2、发帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/110513dz9mkjrqvq6j7h9g.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/110516mjvrhbu2nbnkt7ux.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/110519b99d0xdud0zmt0e4.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0008",
        "url_tid": "12035",
        "name": "文森特‧瓦伦丁",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "350金币",
        "levels": "【 Max 】10% 回帖咒术+1、发帖堕落+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201401/01/110602f3xyqdqdkjmgipe1.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0007",
        "url_tid": "12034",
        "name": "皮尔斯‧尼凡斯",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗50金币\n【等级2】无属性▕▏升级条件：消耗50血液\n【等级3】无属性▕▏升级条件：消耗50咒术\n【等级4】无属性▕▏升级条件：血液≥150\n【 Max 】15% 回帖血液+2、发帖血液+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/110613xyiyof70titsui7z.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/110619ezopcradfkkoitvi.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/110624i11ketiun46tjz3p.gif", 40],
            "4": ["https://img.gamemale.com/album/201401/01/110628yz8lg9vgd4q7zgrq.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/110633hpv4p6wrlbwcfbvf.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0006",
        "url_tid": "12033",
        "name": "维吉尔",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "400金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗20血液\n【等级2】无属性▕▏升级条件：消耗80血液\n【等级3】4% 回帖咒术+1、发帖咒术+1▕▏升级条件：消耗-10堕落\n【 Max 】6% 回帖咒术+1、发帖咒术+1 知识+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201507/04/202526he2n0d56fd8zd87a.gif", 40],
            "2": ["https://img.gamemale.com/album/201507/04/202527epacq0c0zca0drcp.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/04/062215sqk4z5m5gc54q8gz.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/110724dnsnn9vohsdnsvwo.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0005",
        "url_tid": "12032",
        "name": "法卡斯",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【 Max 】10% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201401/01/111005dgylr33o666ghkor.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0004",
        "url_tid": "12030",
        "name": "吉姆‧雷诺",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "350金币",
        "levels": "【 Max 】12% 发帖旅程+1",
        "levels_img": {
            "Max": ["https://www.gamemale.com/data/attachment/album/201401/01/110702wx3x1duzruxic5j6.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0003",
        "url_tid": "12028",
        "name": "希德‧海温特",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "450金币",
        "levels": "【等级1】无属性▕▏升级条件：消耗50金币\n【等级2】4% 回帖金币+1▕▏升级条件：消耗100金币\n【等级3】8% 回帖金币+1▕▏升级条件：消耗150金币\n【 Max 】12% 回帖金币+2",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/110948xqvczqf8vqfczj9t.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/110951gw7pzyrnzj4g63v7.gif", 40],
            "3": ["https://img.gamemale.com/album/201401/01/110954wzwqpcwc1pvtgntk.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/110957t9yeke4eooy8t6oo.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0002",
        "url_tid": "12027",
        "name": "奧倫",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "300金币",
        "levels": "【等级1】无属性▕▏升级条件：旅程≥50\n【等级2】10% 发帖金币+1▕▏升级条件：旅程≥120\n【 Max 】20% 发帖金币+3",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/114811j0odt762t862bt8c.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/115218n44q65c4mn4fs5f5.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/115223te3i7wb454wkkwz5.gif", 40]
        }
    },
    {
        "type": "游戏男从",
        "no": "0001",
        "url_tid": "12025",
        "name": "詹姆斯‧维加",
        "date": "2015-4-24",
        "buy_limit": "无",
        "price": "450金币",
        "levels": "【等级1】5% 发帖血液+1▕▏升级条件：追随≥20\n【等级2】10% 回帖血液+1、发帖血液+1▕▏升级条件：追随≥55\n【 Max 】15% 回帖血液+1、发帖血液+1",
        "levels_img": {
            "1": ["https://img.gamemale.com/album/201401/01/115249eysm4cpyhmahsnty.gif", 40],
            "2": ["https://img.gamemale.com/album/201401/01/115253turw1vwznzrwwr4r.gif", 40],
            "Max": ["https://img.gamemale.com/album/201401/01/115258pn61f6nvz2n2fvbw.gif", 82]
        }
    }
]


    // Object.hasOwn 兼容性处理
    if (!Object.hasOwn) {
        Object.defineProperty(Object, 'hasOwn', {
            value: function (object, property) {
                if (object == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                return Object.prototype.hasOwnProperty.call(Object(object), property);
            },
            configurable: true,
            enumerable: false,
            writable: true,
        });
    }
    // CSP 策略
    (() => {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            if (!window.trustedTypes.defaultPolicy) {
                window.trustedTypes.createPolicy('default', {
                    createHTML: (html) => html
                });
            }
        }
    })();

    /* ------------------------------------------------------ */

    /**
     * Idb数据库工具
     */
    class IdbStorageManager {
        constructor(config = {}) {
            this.dbName = config.dbName;
            this.version = config.version || 1;
            // 允许传入多个表的配置
            this.storesConfig = config.stores || [];
            this.db = null;
        }

        /**
         * 内部工具：打开数据库并处理多表创建
         */
        #open = async (targetVersion) => {
            if (this.db) return this.db; // 单例模式，避免重复打开

            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, targetVersion);

                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    // 遍历配置，创建多个表
                    this.storesConfig.forEach(cfg => {
                        if (!db.objectStoreNames.contains(cfg.name)) {
                            const store = db.createObjectStore(cfg.name, cfg.options || { keyPath: 'id', autoIncrement: true });

                            // 如果有索引配置则创建索引
                            if (cfg.indexes) {
                                cfg.indexes.forEach(idx => {
                                    store.createIndex(idx.name, idx.keyPath, idx.options || { unique: false });
                                });
                            }
                        }
                    });
                };

                request.onsuccess = () => {
                    this.db = request.result;
                    this.db.onversionchange = () => {
                        this.db.close();
                        this.db = null;
                        console.log("[Idb] 发现新版本，已关闭旧连接");
                    };
                    resolve(this.db);
                };
                request.onblocked = () => {
                    console.error("[Idb] 升级被阻塞，请检查是否有其他脚本未关闭连接");
                };
                request.onerror = () => reject(request.error);
            });
        };
        /**
         * 内部异步执行器：处理数据库打开、表检查、事务创建及逻辑注入
         * @param {string} storeName 表名
         * @param {string} mode 事务模式 'readonly' | 'readwrite'
         * @param {function} callback 具体的业务逻辑，接收 (store, transaction)
         */
        async #execute(storeName, mode, callback) {
            let db = await this.#open(); // 确保数据库已打开

            // 1. 硬检查：物理表是否存在
            if (!db.objectStoreNames.contains(storeName)) {
                const currentVersion = db.version;
                const err = `[IdbError] 表 "${storeName}" 在物理数据库中不存在。可能原因：1.拼写错误 2.新增表后未升级版本号(当前版本:${currentVersion})\n尝试升级版本`;
                console.error(err);

                db.close();
                this.db = null;
                this.version = currentVersion + 1;
                db = await this.#open(this.version);
                if (!db.objectStoreNames.contains(storeName)) {
                    throw new Error("异常，表配置缺失");
                }
            }

            return new Promise((resolve, reject) => {
                try {
                    const tx = db.transaction(storeName, mode);
                    const store = tx.objectStore(storeName);

                    // 执行注入的逻辑
                    // callback 可以是 async，也可以返回一个 IDBRequest
                    const result = callback(store, tx);

                    // 如果返回的是 IDBRequest (如 store.add())
                    if (result instanceof IDBRequest) {
                        result.onsuccess = () => resolve(result.result);
                        result.onerror = () => reject(result.error);
                    } else if (result instanceof Promise) {
                        // 如果返回的是 Promise (自定义复杂逻辑)
                        result.then(resolve).catch(reject);
                    } else {
                        // 如果是同步返回结果
                        resolve(result);
                    }

                    tx.onerror = () => reject(tx.error);
                    store.onerror = () => reject(store.error);
                } catch (err) {
                    reject(err);
                }
            });
        }
        /**
         * 核心方法：指定操作的表
         * @param {string} storeName 表名
         */
        model(storeName) {
            // 返回一个包含操作方法的代理对象
            return {
                /**
                 * 添加数据
                 */
                add: (record) => this.#execute(storeName, 'readwrite', s => s.add(record)),
                /**
                 * 批量添加数据
                 */
                addBatch: (records) => {
                    return this.#execute(storeName, 'readwrite', (store, tx) => {

                        return new Promise((resolve, reject) => {

                            const total = records.length;

                            if (total === 0) return resolve();

                            for (const record of records) {
                                const request = store.add(record);

                                request.onerror = (e) => {
                                    console.error("[IdbError] 批量写入中途失败:", e);
                                };
                            }

                            // 关键：当整个事务完成时，才代表批量操作成功
                            tx.oncomplete = () => resolve({ count: total, status: 'success' });
                            tx.onabort = () => reject(new Error("事务被中止 (Transaction Aborted)"));
                            tx.onerror = () => reject(tx.error);
                        });
                    });
                },
                /**
                 * 更新数据
                 */
                update: (record) => this.#execute(storeName, 'readwrite', s => s.put(record)),
                /**
                 * 删除数据
                 */
                del: (id) => this.#execute(storeName, 'readwrite', s => s.delete(id)),
                /**
                 * 清空表
                 */
                clear: () => this.#execute(storeName, 'readwrite', s => s.clear()),
                /**
                 * 获取全部
                 */
                getAll: () => this.#execute(storeName, 'readonly', s => s.getAll()),
                /**
                 * 条件查询 (支持索引、范围查询)
                 * @param {string} index 索引名
                 * @param {any} value 查询单字段
                 * @param {object} range 查询范围字段
                 */
                query: ({ index, value, range }) => {
                    return this.#execute(storeName, 'readonly', (store) => {
                        const target = index ? store.index(index) : store;
                        return target.getAll(range || value); // getAll 返回 IDBRequest，#execute 会自动处理
                    });
                },
                /**
                * 根据指定字段 field 的 fieldValue查询，然后更新数据
                * @param {string} fieldIdx 字段名对应的索引名
                * @param {any} fieldValue 该字段对应的值
                * @param {object} newRecord 新的数据内容
                */
                updateByField: (fieldIdx, fieldValue, newRecord) => {
                    // 使用 #execute 统一管理事务和异常
                    return this.#execute(storeName, 'readwrite', (store) => {
                        return new Promise((resolve, reject) => {

                            const index = store.index(fieldIdx);
                            // 先通过索引获取主键 ID
                            const getReq = index.getKey(fieldValue);

                            getReq.onsuccess = () => {
                                const id = getReq.result;

                                // 注入 ID 并更新
                                const recordWithId = id ? { ...newRecord, id } : newRecord;
                                const putReq = store.put(recordWithId);

                                putReq.onsuccess = () => resolve(true);
                                putReq.onerror = () => reject(putReq.error);
                            };

                            getReq.onerror = () => reject(getReq.error);
                        });
                    });
                },
                /**
                 * 根据指定字段删除
                 * @param {string} fieldName 索引字段名
                 * @param {any} fieldValue 该字段对应的值
                 */
                delByField: (fieldName, fieldValue) => {
                    return this.#execute(storeName, 'readwrite', (store) => {
                        return new Promise((resolve, reject) => {
                            const index = store.index(fieldName);
                            const getReq = index.getKey(fieldValue);

                            getReq.onsuccess = () => {
                                const id = getReq.result;
                                if (id === undefined) return resolve(false); // 没找到不代表程序错，返回 false

                                const delReq = store.delete(id);
                                delReq.onsuccess = () => resolve(true);
                                delReq.onerror = () => reject(delReq.error);
                            };
                            getReq.onerror = () => reject(getReq.error);
                        });
                    });
                },
                /**
                * 获取当前表的总条数
                */
                count: () => this.#execute(storeName, 'readonly', s => s.count()),
                /**
                 * 估算当前表的总占用空间 (字节为单位)
                 * 注意：这是通过遍历计算的，表非常大时会有性能开销
                 * @returns {Object} {Bytes KB MB}
                 */
                getSize: () => {
                    return this.#execute(storeName, 'readonly', (store) => {
                        // getAll 返回 IDBRequest，#execute 会自动 handle 它的 onsuccess
                        const req = store.getAll();
                        // 我们需要对结果进行二次加工，所以返回一个 Promise
                        return new Promise((resolve, reject) => {
                            req.onsuccess = () => {
                                const size = new Blob([JSON.stringify(req.result)]).size;
                                resolve({
                                    Bytes: size,
                                    KB: (size / 1024).toFixed(1),
                                    MB: (size / (1024 * 1024)).toFixed(1)
                                });
                            };
                            req.onerror = () => reject(req.error);
                        });
                    });
                },

            };
        }
    }
    // const storage = new LocalStorageManager(storeKey);
    const idbConf = {
        dbName: "GmAwardDB",
        stores: [
            {
                name: 'award_info',
                options: { keyPath: 'id', autoIncrement: true },
                indexes: [{ name: 'idx_name_cleansing', keyPath: 'name_cleansing' }, { name: 'idx_type', keyPath: 'type' }, { name: 'idx_date', keyPath: 'date' }]
            },
            {
                name: 'sys',
                options: { keyPath: 'id', autoIncrement: true },
                indexes: [{ name: 'idx_name', keyPath: 'name' }]
            }
        ]
    }
    const idbstorage = new IdbStorageManager(idbConf);


    const SVG = {
        "金币": `<svg width="100%" height="100%" viewBox="0 0 690 776" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g><path d="M643.857,515.508c-12.878,-142.519 -83.944,-214.016 -83.944,-214.016l-129.211,-172.281l-172.281,0l-129.211,172.281c0,0 -30.558,30.86 -55.281,92.063c-42.833,14.213 -73.93,54.139 -73.93,101.753c0.037,29.913 12.614,58.482 34.65,78.711c-8.493,15.484 -13,32.84 -13.115,50.5c0,42.166 24.464,78.302 59.76,95.961c27.63,41.391 64.541,54.785 90.986,54.785l344.562,0c29.697,0 72.638,-16.776 100.741,-71.281c41.584,-14.881 71.54,-54.269 71.54,-101c-0.044,-34.737 -16.935,-67.378 -45.267,-87.476Zm-299.295,-386.297c11.844,0 22.784,-3.403 32.303,-8.959c9.54,5.556 20.48,8.959 32.303,8.959c35.684,0 86.141,-50.478 86.141,-86.141c0,-0 0,-43.07 -43.07,-43.07c-16.97,0 -21.535,21.535 -43.07,21.535c-21.535,0 -21.535,-21.535 -64.605,-21.535c-43.07,0 -43.07,21.535 -64.605,21.535c-21.535,0 -26.079,-21.535 -43.07,-21.535c-43.07,0 -43.07,43.07 -43.07,43.07c0,35.662 50.478,86.141 86.141,86.141c11.823,0 22.763,-3.403 32.303,-8.959c9.54,5.556 20.48,8.959 32.303,8.959Z" style="fill: #ecca62;fill-rule:nonzero;"/><path d="M473.773,129.211c0,11.814 -9.721,21.535 -21.535,21.535l-215.351,0c-11.814,0 -21.535,-9.721 -21.535,-21.535c0,-11.814 9.721,-21.535 21.535,-21.535l215.351,0c11.814,0 21.535,9.721 21.535,21.535Z" style="fill: #bf6952;fill-rule:nonzero;"/><path d="M491.27,541.443c0,-107.802 -211.545,-100.771 -211.545,-165.808c0,-31.495 32.073,-46.882 69.299,-46.882c62.569,0 73.712,37.78 102.038,37.78c20.043,0 29.707,-11.871 29.707,-25.187c0,-30.917 -49.897,-54.322 -97.748,-62.413l0,-29.858c0,-18.613 -16.024,-33.711 -35.845,-33.711c-19.845,0 -35.894,15.098 -35.894,33.711l0,30.893c-52.165,11.149 -97.058,45.148 -97.058,100.554c0,103.516 211.496,99.326 211.496,172.045c0,25.211 -29.041,50.397 -76.695,50.397c-71.518,0 -95.332,-45.485 -124.373,-45.485c-14.151,0 -26.798,11.173 -26.798,28.028c0,26.8 47.777,59.018 113.477,67.999l-0.025,0.241l0,33.662c0,18.589 16.074,33.711 35.894,33.711c19.821,0 35.87,-15.122 35.87,-33.711l0,-33.662c0,-0.409 -0.197,-0.722 -0.222,-1.084c59.117,-10.354 108.423,-46.521 108.423,-111.221Z" style="fill: #67757f;fill-rule:nonzero;"/></g></svg>`,
        '血液': `<svg viewBox="0 0 100 120" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"><g id="SVGRepo_iconCarrier"><path d="M53.911,1.647c-2.027,-2.197 -5.83,-2.195 -7.853,0c-13.774,14.936 -46.058,53.581 -46.058,73.442c0,24.336 22.423,44.135 49.985,44.135c27.561,0 49.985,-19.799 49.985,-44.135c0,-19.867 -32.434,-58.669 -46.058,-73.442Z" style="fill: #f05151;fill-rule:nonzero;"/><g><path d="M74.359,74.03c0,-0.028 -0.039,-2.893 -3.067,-10.06c-1.192,-2.822 0.128,-6.076 2.95,-7.267c2.822,-1.192 6.076,0.128 7.267,2.95c3.43,8.117 3.942,12.492 3.942,14.378c0,3.062 -2.481,5.541 -5.543,5.543l-0.004,0c-3.06,0 -5.542,-2.483 -5.546,-5.543l0.001,-0.001Z" style="fill: #fff;fill-rule:nonzero;"/><path d="M48.182,100.207c8.517,0 16.536,-4.184 21.45,-11.191c1.759,-2.507 5.217,-3.115 7.725,-1.356c2.508,1.759 3.116,5.217 1.356,7.726c-6.988,9.965 -18.402,15.914 -30.532,15.914c-3.063,0 -5.546,-2.483 -5.546,-5.546c0,-3.063 2.483,-5.546 5.546,-5.546l0.001,-0.001Z" style="fill: #fff;fill-rule:nonzero;"/></g></g></svg>`,
        '旅程': `<svg viewBox="0 0 571 459" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;"><g id="SVGRepo_iconCarrier"><path d="M565.033,320.811l-58.649,-117.3c-75.226,7.65 -100.726,22.95 -109.65,34.425c-1.275,2.55 -6.375,8.925 -1.275,24.225c11.476,39.525 0,66.3 -11.475,81.601c-28.05,38.25 -91.8,54.824 -204,54.824c-34.425,0 -58.65,7.65 -66.3,19.125c-7.65,11.476 -2.55,31.875 0,38.25l302.175,0c11.475,0 21.675,-6.375 26.775,-15.3c6.375,-8.925 6.375,-21.675 1.274,-30.6l-20.399,-42.075l110.925,0c11.475,0 21.675,-6.375 26.774,-15.3c8.925,-10.2 8.925,-21.675 3.825,-31.875Z" style="fill: #7dda30;fill-rule:nonzero;stroke:#70b03a;stroke-width:1px;"/><path d="M335.533,306.786c1.275,-2.55 6.375,-8.925 1.275,-26.774c-10.2,-35.7 0,-61.2 10.2,-76.5c20.399,-30.6 61.199,-48.45 131.324,-58.65l-29.324,-59.925c-5.101,-11.475 -16.575,-17.85 -29.325,-17.85c-12.75,0 -22.95,6.375 -29.325,17.85l-52.275,105.825l-82.875,-170.85c-5.1,-11.475 -16.575,-17.85 -29.325,-17.85c-12.75,0 -22.95,6.375 -29.325,17.85l-191.25,388.874c-5.1,10.2 -3.825,21.675 1.275,31.875c6.375,8.925 16.575,15.3 26.775,15.3l17.85,0c-3.825,-19.125 -5.1,-45.899 11.475,-71.399c20.4,-31.875 59.925,-48.45 118.575,-48.45c114.75,-0.001 146.625,-17.851 154.275,-29.326Z" style="fill: #7dda30;fill-rule:nonzero;stroke:#70b03a;stroke-width:1px;"/></g></svg>`,
        '咒术': `<svg viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g><path d="M100,0c-55.232,0.006 -99.994,44.763 -100,100c0.006,55.231 44.768,99.994 100,100c55.232,-0.006 99.994,-44.769 100,-100c-0.006,-55.237 -44.768,-99.994 -100,-100Zm60.586,39.416c4.734,4.737 8.904,10.023 12.431,15.748l-47.13,0l-15.726,-27.236l-7.823,-13.55c22.748,0.614 43.235,10.035 58.248,25.038Zm-89.937,93.688l-27.985,0l13.993,-24.237l13.992,24.237Zm-27.985,-66.207l27.985,0l-13.991,24.237l-13.994,-24.237Zm19.113,33.104l19.113,-33.104l38.226,0l19.111,33.104l-19.11,33.104l-38.226,0l-19.113,-33.104Zm81.572,8.866l13.99,24.237l-27.985,0l13.995,-24.237Zm-13.995,-41.97l27.985,0l-13.99,24.237l-13.995,-24.237Zm-15.362,-8.869l-27.984,0l13.992,-24.237l13.992,24.237Zm-74.578,-18.612c15.013,-15.003 35.499,-24.424 58.248,-25.038l-7.823,13.55l-15.72,27.236l-47.136,0c3.527,-5.725 7.697,-11.011 12.431,-15.748Zm-25.095,60.584c0.003,-14.804 3.742,-28.7 10.334,-40.836l7.849,13.595l15.727,27.241l-15.726,27.236l-7.849,13.594c-6.593,-12.133 -10.332,-26.029 -10.335,-40.83Zm25.095,60.584c-4.734,-4.737 -8.907,-10.026 -12.431,-15.754l47.136,0l15.72,27.241l7.823,13.55c-22.746,-0.614 -43.235,-10.035 -58.248,-25.038Zm46.594,-18.618l27.984,0l-13.992,24.238l-13.992,-24.238Zm74.577,18.618c-15.013,15.003 -35.502,24.424 -58.248,25.038l7.823,-13.55l15.726,-27.241l47.13,0c-3.524,5.728 -7.697,11.017 -12.431,15.754Zm6.913,-33.349l-15.725,-27.236l15.725,-27.241l7.848,-13.591c6.593,12.133 10.332,26.032 10.335,40.833c-0.003,14.798 -3.742,28.694 -10.335,40.827l-7.848,-13.591Z" style="fill: #c779fe;fill-rule:nonzero;"/></g></svg>`,
        '知识': `<svg width="100%" height="100%" viewBox="0 0 598 673" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g><path d="M44.589,43.473c10.683,-10.356 25.681,-17.109 54.006,-20.801c29.157,-3.8 67.799,-3.859 123.205,-3.859l154.4,0c55.407,0 94.05,0.059 123.206,3.859c28.324,3.691 43.321,10.444 54.004,20.801c10.683,10.357 17.648,24.897 21.458,52.355c3.918,28.266 3.981,65.728 3.981,119.442l0,358.64c0,0 -559.697,30.053 -559.697,34.478l0,-393.119c0,-53.714 0.062,-91.177 3.982,-119.442c3.808,-27.458 10.773,-41.999 21.456,-52.355Z" style="fill:#0093ff;fill-rule:nonzero;"/><path d="M138.995,573.912l439.853,0c-0.123,18.656 -0.755,32.567 -3.967,43.561c-3.823,13.088 -10.816,20.021 -21.538,24.958c-10.725,4.937 -25.782,8.156 -54.214,9.915c-29.269,1.812 -68.063,1.84 -123.683,1.84l-154.994,0c-55.62,0 -94.412,-0.028 -123.681,-1.84c-28.432,-1.76 -43.489,-4.979 -54.214,-9.915c-10.724,-4.937 -17.716,-11.868 -21.539,-24.958c-0.288,-0.983 -0.553,-1.991 -0.8,-3.023c-1.402,-5.843 -2.103,-8.768 2.323,-15.66c4.427,-6.89 6.346,-7.971 10.184,-10.135c11.383,-6.414 26.995,-11.162 44.954,-13.377c10.155,-1.252 23.407,-1.366 61.314,-1.366l-0.002,0Z" style="fill:#aeaeae;fill-rule:nonzero;"/><path d="M357.736,49.944l-205.12,307.609l103.907,-24.324l-22.95,202.33l211.812,-309.193l-103.924,24.328l16.276,-200.751l-0.001,0.001Z" style="fill:#ddfdff;fill-rule:nonzero;"/></g></svg>`,
        '灵魂': `<svg fill="#9df3ff" viewBox="0 0 28 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g id="SVGRepo_iconCarrier"><path d="M25.606,3.606c0.066,-0.15 0.207,-0.308 0.19,-0.446c-0.058,-0.229 -0.092,-0.494 -0.092,-0.765c0,-0.171 0.014,-0.34 0.038,-0.505l-0.003,0.018l1.044,1.13l-0.046,-0.034c0.659,1.15 0.653,2.412 0.632,3.685c-0.014,1.055 -0.435,2.008 -1.114,2.712l0.001,-0.001c-0.452,0.494 -0.951,0.946 -1.406,1.437c-1.029,1.101 -0.888,1.998 0.425,2.777c0.245,0.144 0.509,0.256 0.839,0.42c0.541,1.932 0.417,3.896 0.04,5.821c-0.799,0.742 -1.719,0.624 -2.639,0.653c-0.028,0.004 -0.06,0.006 -0.093,0.006c-0.369,0 -0.673,-0.28 -0.712,-0.638l0,-0.003c-0.074,-0.388 0.222,-0.595 0.555,-0.727c0.246,-0.067 0.461,-0.159 0.659,-0.277l-0.012,0.007c0.5,-0.385 0.946,-0.814 0.862,-1.547c-0.084,-0.733 -0.632,-1.023 -1.15,-1.346c-0.085,-0.036 -0.183,-0.058 -0.286,-0.063l-0.002,0c-1.229,-0.223 -2.315,-0.72 -3.231,-1.427l0.017,0.013c-0.42,0.382 -0.319,0.739 -0.152,1.086c0.399,0.831 0.336,1.567 -0.405,2.182c-0.039,0.027 -0.072,0.063 -0.094,0.104l-0.001,0.002c-0.845,1.952 -2.403,1.4 -3.991,1.185c0.391,-0.52 0.934,-0.908 1.562,-1.098l0.021,-0.006c0.256,-0.074 0.475,-0.163 0.683,-0.269l-0.021,0.01c0.649,-0.359 0.831,-0.862 0.497,-1.538c-0.236,-0.463 -0.547,-0.885 -0.894,-1.437c-0.725,0.127 -1.469,0.218 -2.185,0.414c-0.237,0.136 -0.397,0.383 -0.408,0.668l0,0.002c0.305,1.639 -0.506,2.84 -1.472,3.999c-0.116,0.139 -0.221,0.296 -0.307,0.463l-0.007,0.015c-0.529,1.015 -1.15,1.808 -2.489,1.777c-0.477,0 -0.966,0.351 -1.437,0.532l-1.541,-1.11c0.121,-0.247 0.239,-0.547 0.402,-0.822c0.322,-0.541 0.779,-0.731 1.437,-0.69c1.498,0.086 2.369,-0.771 2.487,-2.263c0.063,-0.799 -0.443,-1.207 -1.006,-1.688c-0.376,1.058 -1.377,1.041 -2.187,1.337c-0.21,0.032 -0.457,0.053 -0.707,0.057l-0.005,0c-0.661,0.135 -0.822,0.42 -0.828,1.198c-0.043,0.411 -0.116,0.784 -0.221,1.144l0.011,-0.045c-0.951,-0.526 -0.991,-0.693 -0.748,-2.78c0.713,-0.684 1.84,-0.972 2.28,-1.99c-0.287,-0.862 -0.96,-0.848 -1.547,-0.644c-0.94,0.328 -1.832,0.79 -2.737,1.21c-0.506,0.233 -1.001,0.497 -1.489,0.739c-0.713,-1.046 -0.713,-1.046 -0.04,-1.725c0.578,-0.222 1.009,-0.71 1.147,-1.31l0.003,-0.013c-1.437,0.342 -1.437,0.368 -1.116,1.357l-1.023,0l-0.543,1.075c-1.173,-1.11 -1.27,-1.437 -0.756,-2.763c0.725,-1.857 1.725,-3.51 3.573,-4.465c0.176,-0.123 0.33,-0.259 0.466,-0.411l0.003,-0.003c-0.015,-0.112 -0.024,-0.241 -0.024,-0.373c0,-0.707 0.25,-1.356 0.666,-1.863l-0.004,0.005c0.195,-0.303 0.327,-0.665 0.367,-1.053l0.001,-0.01c0.245,-1.702 1.198,-2.975 2.418,-4.108c0.239,-0.249 0.525,-0.449 0.846,-0.586l0.017,-0.006c-0.364,0.589 -0.737,1.294 -1.07,2.022l-0.051,0.126c-0.233,0.658 -0.473,1.509 -0.668,2.377l-0.031,0.163c0.908,0 1.36,-0.44 1.802,-0.932c1.394,-1.544 3.289,-2.299 5.132,-3.182l-2.588,2.763c1.676,0.75 2.012,0.713 3.194,-0.48c0.861,-0.826 1.926,-1.447 3.11,-1.779l0.052,-0.012c-0.834,1.162 -2.257,1.779 -2.737,3.292l0.575,0.627c0.268,-0.149 0.595,-0.304 0.931,-0.438l0.061,-0.021c0.092,-0.032 0.256,0.155 0.388,0.239l-0.302,0.287l-0.23,0.089l0.129,0.101l0.063,-0.224l0.287,-0.287c0.826,-0.63 1.661,-1.234 2.958,-1.369c-0.862,0.94 -1.921,1.532 -2.377,2.723l0.601,0.124l-0.032,-0.043l0.353,0.601c0.71,-0.515 1.173,-1.403 2.263,-1.409l-1.021,1.257l1.926,0.713c0.198,-0.121 0.435,-0.248 0.68,-0.361l0.044,-0.018c0.226,-0.079 0.522,-0.163 0.823,-0.23l0.06,-0.011l-0.701,0.978c0.092,0.089 0.146,0.184 0.21,0.19c0.27,0.032 0.583,0.05 0.901,0.05c0.033,0 0.066,0 0.099,-0.001l-0.005,0c1.958,-0.063 3.738,-2.075 2.17,-4.329l-0.021,0.011Z" style="fill-rule:nonzero;"/><path d="M26.784,3.039l0.092,-0.224l-0.127,0.19l0.034,0.034Z" style="fill-rule:nonzero;"/><path d="M25.629,3.583l-0.207,-0.095l0.121,-0.089l0.063,0.207l0.023,-0.023Z" style="fill-rule:nonzero;"/><path d="M17.869,6.199l0.112,-0.21l-0.146,0.175l0.034,0.034Z" style="fill-rule:nonzero;"/></g></svg>`,
        '堕落': `<svg viewBox="0 0 31 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g id="SVGRepo_iconCarrier"><path d="M28.971,3.593c-2.31,-3.055 -6.424,-4.349 -10.013,-3.149c-1.534,0.514 -2.769,1.452 -3.676,2.681c-0.888,-1.119 -2.063,-1.979 -3.504,-2.461c-3.588,-1.202 -7.702,0.092 -10.012,3.148c-2.24,2.967 -1.943,5.766 -1.3,7.594c0.706,2.006 2.304,3.954 3.49,4.251c0.94,0.231 1.901,-0.334 2.139,-1.28c0.207,-0.82 -0.199,-1.655 -0.932,-2.012c-0.299,-0.26 -1.349,-1.403 -1.586,-2.981c-0.179,-1.192 0.15,-2.318 1.002,-3.447c1.387,-1.833 3.942,-2.643 6.076,-1.931c1.902,0.638 2.948,2.356 2.948,4.835l0,14.475c0,0.976 0.789,1.762 1.764,1.762c0.976,0 1.764,-0.787 1.764,-1.762l0,-14.69c0,-2.48 1.047,-4.196 2.948,-4.835c2.138,-0.712 4.69,0.097 6.076,1.931c0.854,1.13 1.18,2.258 1.002,3.445c-0.238,1.582 -1.287,2.724 -1.583,2.981c-0.732,0.358 -1.14,1.192 -0.933,2.014c0.238,0.946 1.195,1.518 2.141,1.28c1.186,-0.299 2.782,-2.246 3.49,-4.251c0.641,-1.829 0.939,-4.63 -1.3,-7.592l0,-0.004Z" style="fill: #ea37ea;fill-rule:nonzero;"/></g></svg>`,
        '总计': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="#00b8f0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.207 19.793a.707.707 0 0 1-1.207-.5V16a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1V4.707a.707.707 0 0 1 1.207-.5l6.94 6.94a1.207 1.207 0 0 1 0 1.707z"/></svg>`,
        '缺图': `<svg width="41px" height="41px" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g><g><path d="M177.766,181.5l-155.533,0c-2.045,0 -3.703,-2.281 -3.703,-5.094l0,-152.812c0,-2.813 1.658,-5.094 3.703,-5.094l155.534,0c2.045,0 3.703,2.281 3.703,5.094l0,152.812c-0,2.813 -1.658,5.094 -3.704,5.094Z" style="fill:#00c3ff;fill-rule:nonzero;"/><ellipse cx="49.884" cy="51.213" rx="19.37" ry="20.211" style="fill:#8be4ff;"/><ellipse cx="49.884" cy="51.213" rx="10.931" ry="11.405" style="fill:#fff;"/><path d="M181.47,176.416l0,-37.851l-33.958,-74.404c-1.795,-6.048 -9.284,-6.113 -13.436,-0.025l-98.483,117.364l142.173,0c2.045,0 3.703,-2.277 3.703,-5.084Z" style="fill:#96ff69;fill-rule:nonzero;"/></g><path d="M74.431,80.681l10.827,-62.181l33.045,0l-18.303,59.591l35.097,56.767l-20.507,46.642l-20.803,0l18.441,-44.521l-37.798,-56.298Z" style="fill:#494949;"/></g></svg>`,
        '设置': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></g></svg>`,

    }
    const SVGControlPanel = {
        'light': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M19 9.199h-.98c-.553 0-1 .359-1 .801c0 .441.447.799 1 .799H19c.552 0 1-.357 1-.799c0-.441-.449-.801-1-.801M10 4.5A5.483 5.483 0 0 0 4.5 10c0 3.051 2.449 5.5 5.5 5.5c3.05 0 5.5-2.449 5.5-5.5S13.049 4.5 10 4.5m0 9.5c-2.211 0-4-1.791-4-4c0-2.211 1.789-4 4-4a4 4 0 0 1 0 8m-7-4c0-.441-.449-.801-1-.801H1c-.553 0-1 .359-1 .801c0 .441.447.799 1 .799h1c.551 0 1-.358 1-.799m7-7c.441 0 .799-.447.799-1V1c0-.553-.358-1-.799-1s-.801.447-.801 1v1c0 .553.359 1 .801 1m0 14c-.442 0-.801.447-.801 1v1c0 .553.359 1 .801 1c.441 0 .799-.447.799-1v-1c0-.553-.358-1-.799-1m7.365-13.234c.391-.391.454-.961.142-1.273s-.883-.248-1.272.143l-.7.699c-.391.391-.454.961-.142 1.273s.883.248 1.273-.143zM3.334 15.533l-.7.701c-.391.391-.454.959-.142 1.271s.883.25 1.272-.141l.7-.699c.391-.391.454-.961.142-1.274s-.883-.247-1.272.142m.431-12.898c-.39-.391-.961-.455-1.273-.143s-.248.883.141 1.274l.7.699c.391.391.96.455 1.272.143s.249-.883-.141-1.273zm11.769 14.031l.7.699c.391.391.96.453 1.272.143c.312-.312.249-.883-.142-1.273l-.699-.699c-.391-.391-.961-.455-1.274-.143s-.248.882.143 1.273"/></svg>`,
        'dark': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M20.539 14.852A8 8 0 0 1 11 7c0-1.457.32-2.823 1-4a9 9 0 1 0 8.539 11.852"/><path stroke="currentColor" stroke-width="2" d="M20.539 14.852A8 8 0 0 1 11 7c0-1.457.32-2.823 1-4a9 9 0 1 0 8.539 11.852ZM16.625 4l.044.08l.081.045l-.08.044l-.045.081l-.044-.08l-.081-.045l.08-.044zM20.5 8.5l.177.323L21 9l-.323.177l-.177.323l-.177-.323L20 9l.323-.177z"/></g></svg>`,
        '权重': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M256 336h-.02c0-16.18 1.34-8.73-85.05-181.51c-17.65-35.29-68.19-35.36-85.87 0C-2.06 328.75.02 320.33.02 336H0c0 44.18 57.31 80 128 80s128-35.82 128-80M128 176l72 144H56zm511.98 160c0-16.18 1.34-8.73-85.05-181.51c-17.65-35.29-68.19-35.36-85.87 0c-87.12 174.26-85.04 165.84-85.04 181.51H384c0 44.18 57.31 80 128 80s128-35.82 128-80zM440 320l72-144l72 144zm88 128H352V153.25c23.51-10.29 41.16-31.48 46.39-57.25H528c8.84 0 16-7.16 16-16V48c0-8.84-7.16-16-16-16H383.64C369.04 12.68 346.09 0 320 0s-49.04 12.68-63.64 32H112c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h129.61c5.23 25.76 22.87 46.96 46.39 57.25V448H112c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16"/></svg>`,
        '设置': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></g></svg>`,
        '放大镜': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m21 21l-4.34-4.34"/><circle cx="11" cy="11" r="8"/></g></svg>`,
        '定位': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 15l6 6M15 9l6-6m0 13v5h-5m5-13V3h-5M3 16v5h5m-5 0l6-6M3 8V3h5m1 6L3 3"/></svg>`,
        '图片': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></g></svg>`,
        '本地': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="m9 13l2 2l4-4"/></g></svg>`,
        '文件夹': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M13 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.36M19 12v6m0-4h2"/><circle cx="19" cy="20" r="2"/></g></svg>`,
        '数据库': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 12a9 3 0 0 0 5 2.69M21 9.3V5"/><path d="M3 5v14a9 3 0 0 0 6.47 2.88M12 12v4h4"/><path d="M13 20a5 5 0 0 0 9-3a4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16"/></g></svg>`,
        '快捷键': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"><path d="M20.05.75H3.95c-1.8 0-3.2 1.4-3.2 3.2v16.1c0 1.8 1.4 3.2 3.2 3.2h16.1c1.8 0 3.2-1.4 3.2-3.2V3.95c0-1.7-1.4-3.2-3.2-3.2"/><path d="M16.55 14.25c1.2 0 2.2 1 2.2 2.2s-1 2.2-2.2 2.2s-2.2-1-2.2-2.2v-9c0-1.2 1-2.2 2.2-2.2s2.2 1 2.2 2.2s-1 2.2-2.2 2.2h-9c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2s2.2 1 2.2 2.2v9c0 1.2-1 2.2-2.2 2.2s-2.2-1-2.2-2.2s1-2.2 2.2-2.2z"/></g></svg>`,
        '下箭头': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9l6 6l6-6"/></svg>`,
        '关于': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" fill="none"/><path fill="currentColor" fill-rule="evenodd" d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334c94.107 0 170.667 76.56 170.667 170.666S350.107 426.667 256 426.667m26.714-256c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z"/></svg>`,
        '网站': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><g fill="none" stroke="currentColor" stroke-width="3"><path stroke-linejoin="round" d="M3 24a21 21 0 1 0 42 0a21 21 0 1 0-42 0"/><path stroke-linejoin="round" d="M15 24a9 21 0 1 1 18 0a9 21 0 1 1-18 0"/><path stroke-linecap="round" d="M4.5 31h39m-39-14h39"/></g></svg>`,
        '链接': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M20.5 3.5L3.5 9l6.5 3l7-5l-5 7l3 6.5z"/></svg>`
    }

    const ATTR_MAP = {
        '金币': { color: '#ecca62', emoji: SVG['金币'] },
        '血液': { color: '#f05151', emoji: SVG['血液'] },
        '旅程': { color: '#70b03a', emoji: SVG['旅程'] },
        '咒术': { color: '#c779fe', emoji: SVG['咒术'] },
        '知识': { color: '#8c8cff', emoji: SVG['知识'] },
        '灵魂': { color: '#8ad6e0', emoji: SVG['灵魂'] },
        '堕落': { color: '#ea37ea', emoji: SVG['堕落'] },
        '总计': { color: '#f29740', emoji: SVG['总计'] }
    };

    /** 并发请求限制 */
    const limit = pLimit(6);

    /**
     * 控制面板默认配置的结构
     * @type {{ weights: Record<'金币'|'血液'|'旅程'|'咒术'|'知识'|'灵魂'|'堕落', { value: number, enabled: boolean }>,basic: { medalMagnifier: boolean, positionMode: 'left'|'right', showImage: boolean, localImageMode: boolean, handleName: string|null, shortcut: string },theme: { magnifierTheme: string },activeTab: string}}
     */
    const DEFAULT_CONFIG = {
        weights: {
            '金币': { value: 1, enabled: true },
            '血液': { value: 1, enabled: true },
            '旅程': { value: 30, enabled: true },
            '咒术': { value: 5, enabled: true },
            '知识': { value: 50, enabled: true },
            '灵魂': { value: 1000, enabled: true },
            '堕落': { value: 0, enabled: false }
        },
        basic: { medalMagnifier: true, positionMode: 'left', showImage: true, localImageMode: false, handleName: null, shortcut: 'Alt + S' },
        theme: { magnifierTheme: 'light' },
        activeTab: "weight",
    };

    /**
     * ToastManager Toast提示组件
     */
    class ToastManager {
        /**
         * @param {string} id - Toast 容器 id
         */
        constructor(id = "toast-host") {
            this.id = id
            this.container = null;
            this.shadow = null;
            this.template = null; // 预留模板引用
            this._setup();
        }

        _setup() {
            const host = document.createElement('div');
            host.id = this.id;
            if (!document.body) return;
            document.body.appendChild(host);

            this.shadow = host.attachShadow({ mode: 'open' });

            // 注入样式
            const style = document.createElement('style');
            style.textContent = `
                :host, .toast-scope {
                    --t-success: #10b981;
                    --t-info: #3b82f6;
                    --t-warning: #f59e0b;
                    --t-error: #ef4444;
                    --t-progress-bar: #9d9d9d;
                    --t-radius: 4px;
                }
                #toast-container {
                    position: fixed; top: 20px; right: 20px; z-index: 999999;
                    display: flex; flex-direction: column; gap: 12px; pointer-events: none;
                }
                .toast-card {
                    width: 320px; background: #ffffff; border-radius: var(--t-radius);
                    box-shadow: 0 5px 15px 5px rgba(0,0,0,0.15); overflow: hidden;
                    pointer-events: auto; position: relative; display: flex;
                    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    font-family: system-ui, sans-serif;
                }
                .toast-sidebar { width: 6px; flex-shrink: 0; }
                .toast-content { flex: 1; padding: 14px; display: flex; align-items: center; gap: 12px; }
                .toast-icon { font-size: 24px; line-height: 1; }
                .toast-text { flex: 1; }
                .toast-title { font-weight: 800; font-size: 14px; color: #1e293b; line-height: 1.2; }
                .toast-msg { font-size: 13px; color: #4f5661; margin-top: 6px; }
                /* 垂直水平居中的关闭按钮 */
                .toast-close {
                    width: 38px; align-self: stretch; display: flex;
                    align-items: center; justify-content: center;
                    cursor: pointer; color: #94a3b8; font-size: 16px; transition: 0.2s;
                }
                .toast-close:hover { color: var(--t-error); background: #fff1f2; }
                .toast-progress-wrap { position: absolute; bottom: 0; left: 5px; right: 0; height: 3px; background: #f1f5f9; }
                .toast-progress-line { height: 100%; width: 100%; background: var(--t-progress-bar); transition: linear; }
            `;
            this.shadow.appendChild(style);

            this.template = document.createElement('template');
            this.template.innerHTML = `
                <div class="toast-card">
                    <div class="toast-sidebar"></div>
                    <div class="toast-content">
                        <div class="toast-icon"></div>
                        <div class="toast-text">
                            <div class="toast-title"></div>
                            <div class="toast-msg"></div>
                        </div>
                    </div>
                    <div class="toast-close">✕</div>
                    <div class="toast-progress-wrap"><div class="toast-progress-line"></div></div>
                </div>
            `.trim();

            // 创建容器
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-scope';
            this.shadow.appendChild(this.container);
        }
        /**
         * 显示弹窗
         * @param {Object} options - 弹窗配置参数对象
         * @param {'info'|'success'|'warning'|'error'} [options.type='info'] - 弹窗类型
         * @param {string} options.title - 弹窗标题
         * @param {string} options.msg - 弹窗消息内容
         * @param {number} [options.duration=2000] - 持续显示时间（毫秒）
         */
        show({ type = 'info', title, msg, duration = 2000 }) {
            const configs = {
                success: { color: 'var(--t-success)', icon: '✓', label: '成功' },
                info: { color: 'var(--t-info)', icon: 'ｉ', label: '信息' },
                warning: { color: 'var(--t-warning)', icon: '⚠', label: '警告' },
                error: { color: 'var(--t-error)', icon: '✖', label: '错误' }
            };
            const cfg = configs[type] || configs.info;

            const cloneFragment = this.template.content.cloneNode(true);
            const toast = cloneFragment.querySelector('.toast-card');
            toast.querySelector('.toast-sidebar').style.backgroundColor = cfg.color;

            const iconEl = toast.querySelector('.toast-icon');
            iconEl.style.color = cfg.color;
            iconEl.textContent = cfg.icon;

            toast.querySelector('.toast-title').textContent = title || cfg.label;
            toast.querySelector('.toast-msg').textContent = msg;

            const bar = toast.querySelector('.toast-progress-line');

            bar.style.width = '100%';
            bar.style.transition = 'none';

            setTimeout(() => {
                // 让 CSS 自动在 duration 毫秒内，平滑地（linear保证匀速）将宽度变为 0
                bar.style.transition = `width ${duration}ms linear`;
                bar.style.width = '0%';
            }, 50);

            let timerId = setTimeout(() => {
                this.hide(toast);
            }, duration);

            // 悬停暂停/恢复
            let startTime = Date.now();
            let timeLeft = duration;

            toast.onmouseenter = () => {
                clearTimeout(timerId);
                const elapsed = Date.now() - startTime;
                timeLeft -= elapsed;

                const computedWidth = getComputedStyle(bar).width;
                bar.style.transition = 'none';
                bar.style.width = computedWidth;
            };

            toast.onmouseleave = () => {
                startTime = Date.now();

                setTimeout(() => {
                    bar.style.transition = `width ${timeLeft}ms linear`;
                    bar.style.width = '0%';
                }, 10);

                timerId = setTimeout(() => {
                    this.hide(toast);
                }, timeLeft);
            };

            toast.querySelector('.toast-close').onclick = () => {
                clearTimeout(timerId);
                this.hide(toast);
            };

            this.container.prepend(toast);
        }
        /**
         * 隐藏弹窗
         * @param {*} toast
         */
        hide(toast) {
            toast.style.transform = 'translateX(110%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 200);
        }
    }
    /**
     * ControlPanel 控制面板组件：外观配置与权重控制
     */
    class ControlPanel {
        /**
         * @param {Object} [config={}] - 配置对象
         * @param {ToastManager} [config.toastInstance] - 注入 Toast 实例
         * @param {string} [config.storageKey="ULTRA_CONFIG_V3"] - localstorage 的存储 ID
         * @param {string} [config.id="medal-setting-panel"] - ControlPanel 的 DOM 元素 ID
         * @param {LocalFileSystem} [config.localFile] 注入 本地图片文件class 实例
         */
        constructor(config = {}) {
            this.toast = config.toastInstance || new ToastManager();
            this.storageKey = config.storageKey || "ULTRA_CONFIG_V3";
            this.id = config.id || "medal-setting-panel";
            this.localFile = config.localFile;

            /** @type {typeof DEFAULT_CONFIG} */
            this.data = null;

            this.tabRegistry = {
                basic: {
                    label: '基础',
                    icon: SVGControlPanel['设置'],
                    render: () => this._getBasicHTML(),
                    bind: () => this._bindBasicEvents(),
                },
                weight: {
                    label: '权重',
                    icon: SVGControlPanel['权重'],
                    render: () => this._getWeightHTML(),
                    bind: () => this._bindWeightEvents()
                },
                about: {
                    label: '关于',
                    icon: SVGControlPanel['关于'],
                    render: () => this._getAboutHTML(),
                },
            };
            this.isHide = true;
            this._init();

        }
        async _init() {
            let host = document.getElementById(this.id);

            if (!host) {
                host = document.createElement('div');
                host.id = this.id;

                if (!document.body) { console.warn('Document body not found.'); return; }
                document.body.appendChild(host);
            } else {
                host.innerHTML = '';
            }
            if (!host.shadowRoot) {
                this.shadow = host.attachShadow({ mode: 'open' });
            } else {
                this.shadow = host.shadowRoot;
            }

            this._CommonStyles();
            this._CommonRender();
            await this._loadData();
            this._BindCommonEvents();

            if (!this.content || !this.tabRegistry) return;

            this.content.innerHTML = '';

            Object.entries(this.tabRegistry).forEach(([tabKey, tab]) => {

                const tabWrapper = document.createElement('div');
                tabWrapper.className = 'tab-panel-wrapper';
                tabWrapper.dataset.tab = tabKey;

                if (tabKey !== this.data.activeTab) {
                    tabWrapper.style.display = 'none';
                    tabWrapper.style.opacity = '0';
                }

                tabWrapper.innerHTML = tab?.render?.() || '';
                this.content.appendChild(tabWrapper);

                tab?.bind?.(tabWrapper);
            });

        }
        async _loadData() {
            const saved = localStorage.getItem(this.storageKey);
            let userConfig = {};

            try {
                userConfig = saved ? JSON.parse(saved) : {};
            } catch (e) {
                console.error("配置解析失败，重置为默认值", e);
            }

            this.data = {
                ...DEFAULT_CONFIG,
                weights: { ...DEFAULT_CONFIG.weights, ...(userConfig?.weights || {}) },
                basic: { ...DEFAULT_CONFIG.basic, ...(userConfig?.basic || {}) },
                theme: { ...DEFAULT_CONFIG.theme, ...(userConfig?.theme || {}) },

                activeTab: userConfig?.activeTab || DEFAULT_CONFIG.activeTab
            };
            this.handleName = await this.localFile.getHandleName();
        }

        _saveData() {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        }

        _CommonStyles() {
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    --up-accent: #1d7db9;
                    --up-orange: #e06713;
                    --up-bg-gray: #f0f0f0;
                    --up-border: #d0d8e1;
                    --up-radius: 6px;
                    --up-error: #ef4444;
                    --win-bg: #f3f3f3;
                    --win-bg-hover: #e9e9e9;
                    --win-card: #f5faff;
                    --win-accent: #0078d4;
                    --win-border: #e5e5e5;
                    --win-radius: 6px;
                    --text-title: #1b1b1b;
                    --text-main: #222222;
                    --text-secondary: #94a3b8;
                }
                #overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.4);
                    display: none; justify-content: center; align-items: center;
                    z-index: 999990; backdrop-filter: blur(4px); opacity: 0; transition: 0.3s;
                }
                #modal {
                    background: var(--up-bg-gray); width: 570px; height: 580px;
                    border-radius: var(--up-radius); display: flex; flex-direction: column;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                    transition: 0.4s; padding: 15px;
                }
                #modal , .win-btn {
                    font-family: 'DengXian', '等线', system-ui, sans-serif;
                }
                /* 导航栏样式 */
                .nav { display: flex; align-items: center; margin-bottom: 8px; }
                .nav-item {
                    padding: 5px 15px; cursor: pointer; font-size: 16px; font-weight: 600;
                    color: var(--text-secondary); transition: 0.2s; position: relative;display: flex;gap: 6px;
                }
                .nav-item:not(.active):hover { background: var(--win-bg-hover) ; color: var(--text-title); border-radius: var(--up-radius); }
                .nav-item.active { color: var(--up-accent); }
                .nav-item.active::after {
                    content: ''; position: absolute; bottom: -11px; left: 15px; right: 15px;
                    height: 3px; background: var(--up-accent); border-radius: 10px;
                }
                .nav-close , .nav-theme { border-radius: 4px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); }
                .nav-close { margin-left: auto; color: var(--text-main); }
                .nav-theme { margin-left: 20px; };
                .nav-theme:hover { background: var(--win-bg-hover); }
                .nav-close:hover { background: #fee2e2; color: var(--up-error); }
                .nav svg { width:20px; height:20px; display:inline-flex; }

                .line { height:1px; border-bottom: 2px solid var(--up-border); margin-bottom: 18px }

                /* 内容区 */
                .main { overflow-y: auto;}
                .main .tab-panel-wrapper { display: flex; flex-direction: column; gap: 6px; padding: 0 6px;}
                .main::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .main::-webkit-scrollbar-thumb {
                    border-radius: 5px;
                    background: rgba(157, 157, 157, 0.87);
                }
                .main::-webkit-scrollbar-track {
                    border-radius: 5px;
                    background: rgba(21, 21, 21, 0);
                }
                .main::-webkit-scrollbar-corner {
                    background: rgba(21, 21, 21, 0);
                }
                .main::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(92, 92, 92, 0.95);
                }
                @supports (scrollbar-width: thin) and (not selector(::-webkit-scrollbar-thumb)) {
                    .main {
                        scrollbar-color: rgba(157, 157, 157, 0.87) rgba(21, 21, 21, 0) ;
                    }
                }

                .disabled { opacity: 0.8; filter: grayscale(1); }

                .row { display: flex; align-items: center; padding: 13px; background: var(--win-card); border: 1px solid var(--up-border); border-radius: var(--up-radius);margin-bottom: 4px; }
                .row:hover { border-color: var(--up-accent) }
                .row svg { width:22px; height:22px; display:inline-flex; margin-right: 6px; }
                .row .row-label{ flex:1; font-weight:600; font-size:14px; }
                .row-controls { display: flex; align-items: center; gap: 8px; }
                /* 输入框去掉箭头 */
                .input-num {
                    width: 50px; text-align: center; border: 1px solid var(--up-border);
                    border-radius: 4px; padding: 5px; font-weight: bold;
                    appearance: textfield; -moz-appearance: textfield;
                }
                .input-num::-webkit-outer-spin-button, .input-num::-webkit-inner-spin-button { -webkit-appearance: none; }

                /* 按钮 */
                .ste-btn {
                    width:26px; height:26px; background:#fff; cursor:pointer;
                    border:1px solid var(--up-border); border-radius: 4px;
                }
                .ste-btn:hover { background: rgba(0, 0 , 0, 0.04) }
                .btn {
                    border: none; padding: 10px 22px; border-radius: var(--up-radius); cursor: pointer;
                    font-weight: 700; transition: 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
                .btn:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); }
                .btn:active { transform: translateY(0); }
                .btn-save { background: var(--up-accent); color: #fff; }
                .btn-reset { background: var(--up-orange); color: #fff; }

                /* Switch */
                .switch { position: relative; width: 40px; height: 20px; cursor: pointer; margin-left: 10px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; inset: 0; background: #cbd5e1; border-radius: 20px; transition: 0.3s; }
                .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background: #fff; transition: 0.3s; border-radius: 50%; }
                input:checked + .slider { background: var(--up-accent); }
                input:checked + .slider:before { transform: translateX(20px); }
                .tab-footer { display:flex; justify-content:flex-end; gap:12px; margin-top: 10px; }

                /* 卡片 */
                .card {
                    background: var(--win-card); border: 1px solid var(--win-border);
                    border-radius: 6px; padding: 11px 16px;
                    display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: background-color 0.2s, color 0.2s;
                    user-select: none; -webkit-user-select: none;
                }
                .card:hover { border-color: var(--up-accent) }
                .card-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; position: relative; }
                .card-info { flex: 1; }
                .card-title { font-size: 14px; color: var(--text-title); font-weight: 700;}
                .card-desc { font-size: 13px; color: var(--text-main); margin-top: 3px; line-height: 1.3;}
                .card-title, .card-desc { user-select: text; -webkit-user-select: text; }
                .card svg {display: inline-flex; width: 20px; height: 20px;}

                /* 聚合卡片 */
                .card-group { flex-direction: column; padding: 0 !important; gap: 0 !important; overflow: hidden; }
                .card-item { display: flex; align-items: center; width: 100%; padding: 12px 16px; box-sizing: border-box; gap: 12px; }
                .card-group .card-item.indent { border-top: 1.5px solid var(--win-border); padding: 8px 16px 8px 54px; }
                .card-group.is-open .card-item:hover { background: rgba(0, 0, 0, 0.03); }

                /* 下拉组件 */
                .drop-selected { display: flex; gap: 6px; justify-content: space-between; align-items: center; }
                .drop-list { position: fixed; background: #fff; border: 1px solid var(--win-border); border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: none; flex-direction: column; z-index: 10; }
                .drop-item { padding: 8px 15px; font-size: 13px; cursor: pointer; }
                .drop-item:hover { background: var(--win-accent); color: #fff; }
                .drop-selected svg {width: 12px; height: 12px;}

                .expandable { display: flex; width: 100%; max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0; pointer-events: none; }
                .expandable.open { max-height: 100px; opacity: 1; pointer-events: auto; }

                .win-btn { line-height: 1; background: #fff; border: 1px solid var(--win-border); padding: 6px 16px; border-radius: 4px; font-size: 13px; cursor: pointer;border-bottom: 2px solid var(--up-accent); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; user-select: none; }
                .win-btn:hover { background: #f3f3f3; }
                .win-btn-primary { background: var(--win-accent); color: #fff; border: none; }
                .win-btn-primary:hover { background: #006abc; }

                /* 快捷键组件：kbd */
                .kbd { color: var(--win-accent); white-space: nowrap; transition: background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease, opacity 0.1s ease; }
                .kbd:hover { border-color: var(--up-accent); }
                .kbd:hover:not(.recording)::after { content: " (点击修改)"; font-size: 10px; opacity: 0.7; }
                .kbd.recording { color: white; background: var(--up-accent); border-color: var(--up-accent); animation: pulse 1.5s infinite; }
                .kbd.recording:hover { background: var(--up-accent); cursor: default; }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }

                .top-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 6px;
                }
                .top-row svg {height:16px; width: 16px;}
                .top-row .title {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text-title);
                    letter-spacing: -0.01em;
                }
                .dev-tag {
                    font-size: 11px;
                    background: #e7edf3;
                    color: var(--text-main);
                    padding: 2px 8px;
                    border-radius: 10px;
                    text-decoration: none;
                    transition: background-color 0.2s, color 0.2s;
                }

                .dev-tag:hover {
                    background: var(--up-accent);
                    color: white;
                }

                .desc {
                    font-size: 13px;
                    color: var(--text-main);
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    padding-right: 10px;
                }
                .card-body .title , .card-body .desc {
                    user-select: text;
                    -webkit-user-select: text;
                }
                .web-link a{
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--up-accent);
                    background: transparent;
                    transition: background-color 0.2s, color 0.2s;
                }
                .web-link a:hover {
                    background: var(--up-accent);
                    color: white;
                }
            `;
            this.shadow.appendChild(style);
        }

        _CommonRender() {
            // 面板结构
            const overlay = document.createElement('div');
            overlay.id = 'overlay';
            overlay.innerHTML = `
                <div id="modal">
                    <div class="nav" id="nav-bar"></div>
                    <div class="line"></div>
                    <div class="main" id="content"></div>
                    <div class="footer" id="footer"></div>
                </div>
            `;
            this.shadow.appendChild(overlay);
            this.overlay = overlay;
            this.navBar = this.shadow.getElementById('nav-bar');
            this.content = this.shadow.getElementById('content');
            this.footer = this.shadow.getElementById('footer');

            // 添加导航栏数据
            Object.keys(this.tabRegistry).forEach(key => {
                const btn = document.createElement('div');
                btn.className = `nav-item`;
                btn.dataset.tab = key;
                btn.innerHTML = this.tabRegistry[key].icon + this.tabRegistry[key].label;
                btn.onclick = () => this._switchTab(key);
                this.navBar.appendChild(btn);
            });
            // 主题切换按钮
            const theme_btn = document.createElement('div');
            theme_btn.className = "nav-theme";
            this.navBar.appendChild(theme_btn);

            // 导航栏关闭按钮
            const close_btn = document.createElement('div');
            close_btn.className = "nav-close";
            close_btn.innerText = "✕"
            this.navBar.appendChild(close_btn);

        }

        _switchTab(targetTab) {
            if (!this.navBar) return;

            let curTab = targetTab || this.data.activeTab || DEFAULT_CONFIG.activeTab;

            if (!this.tabRegistry[curTab]) {
                curTab = DEFAULT_CONFIG.activeTab;

                if (!this.tabRegistry[curTab]) {
                    console.error("[ControlPanel] 注册表中无任何可用标签页。");
                    return;
                }
            }

            if (typeof this._stopShortcutRecording === 'function') {
                this._stopShortcutRecording();
            }

            this.data.activeTab = curTab;

            this.navBar.querySelector('.nav-item.active')?.classList.remove('active');

            const targetSelector = `.nav-item[data-tab="${this.data.activeTab}"]`;
            this.navBar.querySelector(targetSelector)?.classList.add('active');

            const panels = this.content.querySelectorAll('.tab-panel-wrapper');
            panels.forEach(panel => {
                if (panel.dataset.tab === this.data.activeTab) {
                    panel.style.display = 'flex';
                    panel.style.opacity = '1';
                } else {
                    panel.style.display = 'none';
                    panel.style.opacity = '0';
                }
            });
        }
        _getBasicHTML() {
            if (!this.data.basic) this.data.basic = {};
            let b = this.data.basic;
            return `
                <!-- 勋章放大镜 -->
                <div class="card magnifier ${b?.medalMagnifier ? '' : 'disabled'}">
                    <div class="card-icon">${SVGControlPanel?.放大镜}</div>
                    <div class="card-info"><div class="card-title">勋章放大镜</div><div class="card-desc">鼠标移动到勋章时候，显示勋章的详细信息</div></div>
                    <label class="switch"><input type="checkbox" id="sw-medal" ${b?.medalMagnifier ? 'checked' : ''}><span class="slider"></span></label>
                </div>

                <!-- 定位模式 -->
                <div class="card positionMode ${b?.medalMagnifier ? '' : 'disabled'}">
                    <div class="card-icon">${SVGControlPanel?.定位}</div>
                    <div class="card-info"><div class="card-title">定位模式</div><div class="card-desc">勋章放大镜显示在勋章图片的 左侧/上下侧</div></div>
                    <div class="drop-selected win-btn" id="drop-pos"><span>${b?.positionMode === 'left' ? '左侧模式' : '上下模式'}</span>${SVGControlPanel?.下箭头}</div>
                </div>
                <div class="drop-list expandable ${b?.medalMagnifier ? '' : 'disabled'}">
                    <div class="drop-item" data-val="left">左侧模式</div>
                    <div class="drop-item" data-val="top-bottom">上下模式</div>
                </div>

                <!-- 显示图片 -->
                <div class="card showImage ${(b?.medalMagnifier && b?.showImage) ? '' : 'disabled'}">
                    <div class="card-icon">${SVGControlPanel?.图片}</div>
                    <div class="card-info">
                        <div class="card-title">显示图片</div>
                        <div class="card-desc">等级文字前显示对应的勋章图片</div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="sw-img" ${b?.showImage ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- 聚合卡片容器 -->
                <div class="card card-group localImageMode ${b?.localImageMode ? 'is-open' : ''} ${(b?.medalMagnifier && b?.showImage && b?.localImageMode) ? '' : 'disabled'}">
                    <!-- 第一行：父元素 (本地图片模式) -->
                    <div class="card-item">
                        <div class="card-icon">${SVGControlPanel?.本地}</div>
                        <div class="card-info">
                            <div class="card-title">本地图片模式</div>
                            <div class="card-desc">自动保存图片到本地文件夹并从本地磁盘读取。此功能需要浏览器支持（Chrome、Edge ≥ 86，Firefox不支持）</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="sw-img-local" ${b?.localImageMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <!-- 子元素 (选择文件夹) -->
                    <div id="local-expand" class="select-dir expandable ${b?.localImageMode ? 'open' : ''} ${(b?.medalMagnifier && b?.showImage && b?.localImageMode) ? '' : 'disabled'} ">
                        <div class="card-item indent">
                            <div class="card-icon">${SVGControlPanel?.文件夹}</div>
                            <div class="card-info">
                                <div class="card-desc" style="margin-top:0">${this.handleName ? "已授权文件夹：" + this.handleName : "请选择一个本地文件夹"}</div>
                            </div>
                            <button class="win-btn" id="btn-select-dir">选择文件夹</button>
                        </div>
                    </div>
                </div>

                <!-- 数据库更新 -->
                <div class="card updateDb">
                    <div class="card-icon">${SVGControlPanel?.数据库}</div>
                    <div class="card-info">
                        <div class="card-title">手动更新数据库</div>
                        <div class="card-desc">自动更新的勋章数据异常时，手动同步脚本内置的数据到 IndexedDB，以便第三方脚本读取到最新的勋章数据</div>
                    </div>
                    <button class="win-btn" id="btn-db">更新</button>
                </div>

                <!-- 快捷键 -->
                <div class="card">
                    <div class="card-icon">${SVGControlPanel?.快捷键}</div>
                    <div class="card-info"><div class="card-title">快捷键</div><div class="card-desc">使用当前组合键可以快速开启放大镜的设置面板</div></div>
                    <div class="kbd win-btn">${b?.shortcut || "Alt + S"}</div>
                </div>
            `;
        }

        _bindBasicEvents() {
            const isLocalImgEnabled = typeof window.showDirectoryPicker === 'function';
            const magnifierCard = this.shadow.querySelector('.magnifier');
            const magnifierSwitch = magnifierCard.querySelector('input[type="checkbox"]');

            const dropCard = this.shadow.querySelector('.positionMode');
            const dropBtn = this.shadow.querySelector('#drop-pos');
            const dropList = this.shadow.querySelector('.drop-list');
            const dropListItems = dropList.querySelectorAll('.drop-item');

            const imageCard = this.shadow.querySelector('.showImage');
            const imageSwitch = imageCard.querySelector('input[type="checkbox"]');

            const imageLocalCard = this.shadow.querySelector('.localImageMode');
            const imageLocalSwitch = imageLocalCard.querySelector('input[type="checkbox"]');

            const selectDirCard = this.shadow.querySelector('.select-dir')
            const selectDirBtn = selectDirCard.querySelector('button');

            const dbUpdateBtn = this.shadow.getElementById('btn-db')

            const kbdBtn = this.shadow.querySelector('.kbd');

            // 放大镜点击事件
            magnifierSwitch.onchange = (e) => {
                const checked = e.target.checked
                this.data.basic.medalMagnifier = checked

                magnifierCard.classList.toggle('disabled', !checked);
                dropCard.classList.toggle('disabled', !checked);
                dropListItems.forEach(item => { item.classList.toggle('disabled', !checked); })

                const isimageSwitchChecked = imageSwitch.checked
                imageCard.classList.toggle('disabled', !(checked && isimageSwitchChecked));

                if (isLocalImgEnabled) {
                    const isimageLocalSwitchChecked = imageLocalSwitch.checked
                    imageLocalCard.classList.toggle('disabled', !(checked && isimageLocalSwitchChecked));
                    selectDirCard.classList.toggle('disabled', !(checked && isimageLocalSwitchChecked));
                }

                this._saveData();
                this.toast.show({ type: (checked ? "success" : "warning"), msg: '勋章放大镜镜' + (checked ? '开启' : '关闭') });
            };

            // 定位模式：下拉逻辑
            dropBtn.onclick = (e) => {

                const rect = dropBtn.getBoundingClientRect();
                const containerRect = this.shadow.getElementById('modal').getBoundingClientRect();

                dropList.style.top = `${rect.bottom - containerRect.top + 5}px`;
                dropList.style.left = `${rect.left - containerRect.left}px`;
                dropList.style.width = `${rect.width}px`;

                const isOpen = dropList.classList.contains('open');
                dropList.classList.toggle('open', !isOpen);
                e.stopPropagation();
            };
            dropListItems.forEach(item => {
                item.onclick = () => {
                    const isMagnifierOpen = magnifierSwitch.checked

                    const val = item.dataset.val;
                    const oldSelect = dropBtn.querySelector('span').innerText
                    if (oldSelect !== item.innerText) {
                        dropBtn.querySelector('span').innerText = item.innerText;
                        this.data.basic.positionMode = val;
                        this._saveData();
                        this.toast.show({ type: "success", msg: "定位模式已成功切换到：" + item.innerText });
                    } else {
                        this.toast.show({ type: "info", msg: "当前定位模式已经是：" + item.innerText });
                    }
                    if (!isMagnifierOpen) this.toast.show({ type: "error", msg: "定位模式未生效，请先开启勋章放大镜镜！" })

                };
            });
            document.addEventListener('scroll', () => dropList.classList.remove('open'));
            document.addEventListener('click', () => dropList.classList.remove('open'));

            // 显示图片点击事件
            imageSwitch.onchange = (e) => {
                const isMagnifierOpen = magnifierSwitch.checked
                const isImageLocalChecked = imageLocalSwitch.checked

                const checked = e.target.checked
                this.data.basic.showImage = checked

                imageCard.classList.toggle('disabled', !(isMagnifierOpen && checked));
                isLocalImgEnabled && imageLocalCard.classList.toggle('disabled', !(isMagnifierOpen && isImageLocalChecked && checked));
                isLocalImgEnabled && selectDirCard.classList.toggle('disabled', !(isMagnifierOpen && isImageLocalChecked && checked));

                this._saveData();
                this.toast.show({ type: (checked ? "success" : "info"), msg: '显示图片已' + (checked ? '开启' : '关闭') });
                if (!isMagnifierOpen && checked) this.toast.show({ type: "error", msg: "无法显示图片，请先开启勋章放大镜镜！" })
            }
            if (!isLocalImgEnabled) {
                imageLocalCard.style.display = 'none'
            }
            // 本地图片模式点击事件
            imageLocalSwitch.onchange = (e) => {
                const isMagnifierOpen = magnifierSwitch.checked
                const isimageSwitchChecked = imageSwitch.checked

                const errors = [];
                if (!isMagnifierOpen) errors.push("勋章放大镜");
                if (!isimageSwitchChecked) errors.push("显示图片");

                const checked = e.target.checked

                selectDirCard.classList.toggle('open', checked);
                imageLocalCard.classList.toggle('is-open', checked);

                imageLocalCard.classList.toggle('disabled', !(isMagnifierOpen && isimageSwitchChecked && checked));
                selectDirCard.classList.toggle('disabled', !(isMagnifierOpen && isimageSwitchChecked && checked));

                this.data.basic.localImageMode = checked
                this._saveData();
                this.toast.show({ type: (checked ? "success" : "info"), msg: '本地图片模式已' + (checked ? '开启' : '关闭') });
                if (errors.length > 0 && checked) {
                    const errorMsg = errors.join(" 和 ");
                    this.toast.show({ type: "error", msg: `无法显示本地图片，请先开启：${errorMsg}！` })
                }
            }
            // 本地文件夹授权
            selectDirBtn.onclick = async () => {
                const isMagnifierOpen = magnifierSwitch.checked
                const isimageSwitchChecked = imageSwitch.checked
                const errors = [];
                if (!isMagnifierOpen) errors.push("勋章放大镜");
                if (!isimageSwitchChecked) errors.push("显示图片");


                try {
                    if (await this.localFile.authorize()) {
                        const name = await this.localFile.getHandleName()
                        selectDirCard.querySelector('.card-desc').textContent = '已授权文件夹：' + name;
                        this.toast.show({ type: 'success', msg: `已授权文件夹：${name}` });
                    }
                    else this.toast.show({ type: 'error', msg: "授权被取消或失败！" });

                } catch (err) {
                    console.log(err)
                    this.toast.show({ type: 'error', msg: "无法授权，授权异常！" });
                }

                if (errors.length > 0) {
                    const errorMsg = errors.join(" 和 ");
                    this.toast.show({ type: "error", msg: `无法显示本地图片，请先开启：${errorMsg}！` })
                }
            };

            // 数据库更新
            dbUpdateBtn.onclick = async () => {
                this.toast.show({ type: "info", msg: 'IndexedDB数据库开始更新……' });
                await this.updateFn?.();
                this.toast.show({ type: "success", msg: 'IndexedDB数据库更新成功！' });

            };

            // 快捷键
            this.isRecording = false;
            const capture = (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (e.key === 'Escape') {
                    kbdBtn.textContent = this.data.basic.shortcut || "Alt + S";
                    kbdBtn.classList.remove('recording');
                    this.isRecording = false;
                    window.removeEventListener('keydown', capture, true);
                    return;
                }

                // 过滤掉单纯的修饰键
                if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;

                // 构造组合键字符串
                const keys = [];
                if (e.ctrlKey) keys.push('Ctrl');
                if (e.altKey) keys.push('Alt');
                if (e.shiftKey) keys.push('Shift');

                // 首字母大写处理
                const mainKey = e.key.length === 1 ? e.key.toUpperCase() : e.key;
                keys.push(mainKey);

                const newShortcut = keys.join(' + ');

                // 保存数据
                this.data.basic.shortcut = newShortcut;
                this._saveData();

                // 更新界面
                kbdBtn.textContent = newShortcut;
                kbdBtn.classList.remove('recording');
                this.isRecording = false;

                // 移除监听
                window.removeEventListener('keydown', capture, true);
                this.toast.show({ type: 'success', msg: `快捷键已修改为: ${newShortcut}` });
            };
            const stopRecording = () => {
                if (!this.isRecording) return;
                this.isRecording = false;
                kbdBtn.classList.remove('recording');
                // 恢复原始文字显示
                kbdBtn.textContent = this.data.basic.shortcut || "Alt + S";
                window.removeEventListener('keydown', capture, true);
                this.toast.show({ type: 'info', msg: `快捷键修改已退出，当前为: ${this.data.basic.shortcut || "Alt + S"}` });
                this._stopShortcutRecording = null
            };
            kbdBtn.onclick = () => {
                if (this.isRecording) return;
                this.isRecording = true;
                kbdBtn.classList.add('recording');
                kbdBtn.textContent = "请按下按键...";

                this._stopShortcutRecording = stopRecording;

                window.addEventListener('keydown', capture, true);
            };

        }
        _getWeightHTML() {
            const weightEntries = Object.entries(this.data.weights).map(([k, v]) => {
                return `
                    <div class="row ${v.enabled ? '' : 'disabled'}" data-key="${k}">
                        ${(typeof SVG !== 'undefined' && SVG[k]) ? SVG[k] : ''}
                        <div class="row-label">${k}</div>
                        <div class="row-controls">
                            <button class="ste-btn" data-op="-1">-</button>
                            <input type="number" name="input-num" class="input-num" value="${v.value}">
                            <button class="ste-btn" data-op="1">+</button>
                            <label class="switch">
                                <input type="checkbox" name="weight-switch" class="weight-switch" ${v.enabled ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    `;
            }).join('');

            return `
                    ${weightEntries}
                    <div class="tab-footer">
                        <button class="btn btn-reset" id="act-reset">重置权重</button>
                    </div>

            `;
        }

        // 绑定交互逻辑
        _bindWeightEvents() {

            const rows = this.shadow.querySelectorAll('.row');

            rows.forEach(row => {
                const k = row.dataset.key;
                const input = row.querySelector('.input-num');
                const checkbox = row.querySelector('.weight-switch');

                // 加减按钮逻辑
                row.querySelectorAll('.ste-btn').forEach(btn => {
                    btn.onclick = () => {
                        const op = parseInt(btn.dataset.op);
                        const currentVal = parseInt(input.value) || 0;
                        input.value = currentVal + op;
                        this.data.weights[k] = { value: input.value, enabled: checkbox.checked };
                    };
                });
                input.onchange = () => {
                    const currentVal = parseInt(input.value) || 0;
                    this.data.weights[k] = { value: currentVal, enabled: checkbox.checked };
                };
                // 开关切换样式同步
                checkbox.onchange = (e) => {
                    this.data.weights[k] = { value: input.value, enabled: checkbox.checked };
                    row.classList.toggle('disabled', !e.target.checked);
                };
            });

            // 重置按钮
            this.shadow.getElementById('act-reset').onclick = () => {

                const resetWeights = JSON.parse(JSON.stringify(DEFAULT_CONFIG.weights));

                Object.keys(resetWeights).forEach(k => {

                    const row = this.shadow.querySelector(`.row[data-key="${k}"]`);
                    if (row) {
                        const checkbox = row.querySelector('.weight-switch');
                        const input = row.querySelector('.input-num');
                        const isEnabled = resetWeights[k].enabled;

                        checkbox.checked = isEnabled;
                        input.value = resetWeights[k].value;

                        if (isEnabled) {
                            row.classList.remove('disabled');
                        } else {
                            row.classList.add('disabled');
                        }
                    }
                });
                this.toast.show({
                    type: 'warning',
                    msg: '权重数值已重置，请点击保存生效！'
                });


            };
        }
        static forumSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M0 0h16v16H0z" fill="none"/><path fill="currentColor" d="M5.5 5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm-1-8A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z"/></svg>`;
        static forumData = [
            {
                title: "勋章放大镜",
                developer: "轶致",
                desc: "勋章放大镜的原始版本，已不在更新。",
                developerlink: "https://www.gamemale.com/space-uid-730592.html",
                weblink: "https://www.gamemale.com/thread-129944-1-1.html",
            },
            {
                title: "勋章放大镜",
                developer: "咸鱼鱼",
                desc: "基于轶致勋章放大镜，由咸鱼鱼维护更新勋章数据。",
                developerlink: "https://www.gamemale.com/space-uid-723150.html",
                weblink: "https://www.gamemale.com/thread-147865-1-1.html",
            },
            {
                title: "勋章放大镜-暗黑版",
                developer: "哈哈哈哈_",
                desc: "基于咸鱼鱼的勋章数据，勋章放大镜重构版本。优化样式、本地存储图片、idb公共数据、控制面板……",
                developerlink: "https://www.gamemale.com/space-uid-712448.html",
                weblink: "https://www.gamemale.com/thread-188040-1-1.html",
            },
        ];
        static linkData = [
            {
                title: "勋章补货记录-表格版",
                developer: "咸鱼鱼",
                desc: "从2024年中秋节开始，记录了每次补货的勋章数据，还可以进行补货预测。同时开放了api接口可供调用。",
                developerlink: "https://www.gamemale.com/space-uid-723150.html",
                weblink: "https://badge.saltfish.cc.cd/",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="currentColor" d="M11 16H3v3q0 .825.588 1.413T5 21h6zm2 0v5h6q.825 0 1.413-.587T21 19v-3zm-2-2V9H3v5zm2 0h8V9h-8zM3 7h18V5q0-.825-.587-1.412T19 3H5q-.825 0-1.412.588T3 5z"/></svg>`,
            },
            {
                title: "勋章补货日志-美化版",
                developer: "hezhushizaishi",
                desc: "基于咸鱼鱼的勋章补货数据，Claude实现的勋章补货日志前端，兼顾美观性，可读性和未来数据兼容性。",
                developerlink: "https://www.gamemale.com/space-uid-736317.html",
                weblink: "https://restock-log.pages.dev/",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="#fdb66d" d="M14.4 3.419a.639.639 0 0 1 1.2 0l.61 1.668a9.59 9.59 0 0 0 5.703 5.703l1.668.61a.639.639 0 0 1 0 1.2l-1.668.61a9.59 9.59 0 0 0-5.703 5.703l-.61 1.668a.639.639 0 0 1-1.2 0l-.61-1.668a9.59 9.59 0 0 0-5.703-5.703l-1.668-.61a.639.639 0 0 1 0-1.2l1.668-.61a9.59 9.59 0 0 0 5.703-5.703zM8 16.675a.266.266 0 0 1 .5 0l.254.694a4 4 0 0 0 2.376 2.377l.695.254a.266.266 0 0 1 0 .5l-.695.254a4 4 0 0 0-2.376 2.377l-.254.694a.266.266 0 0 1-.5 0l-.254-.694a4 4 0 0 0-2.376-2.377l-.695-.254a.266.266 0 0 1 0-.5l.695-.254a4 4 0 0 0 2.376-2.377zM4.2.21a.32.32 0 0 1 .6 0l.305.833a4.8 4.8 0 0 0 2.852 2.852l.833.305a.32.32 0 0 1 0 .6l-.833.305a4.8 4.8 0 0 0-2.852 2.852L4.8 8.79a.32.32 0 0 1-.6 0l-.305-.833a4.8 4.8 0 0 0-2.852-2.852L.21 4.8a.32.32 0 0 1 0-.6l.833-.305a4.8 4.8 0 0 0 2.852-2.852z"/></svg>`,
            },
            {
                title: "勋章博物馆",
                developer: "hezhushizaishi",
                desc: "勋章收益可视化，包含各个榜单，说明面板，勋章鉴定室……",
                developerlink: "https://www.gamemale.com/space-uid-736317.html",
                weblink: "https://medal-museum.pages.dev/",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path d="M0 0h14v14H0z" fill="none"/><g fill="none" fill-rule="evenodd" clip-rule="evenodd"><path fill="#2859c5" d="M10.284 5.934v5.054h2.664V5.933l-.038.001zm-4.616 0v5.054h2.664V5.934zm-4.616-.001v5.055h2.664V5.934H1.052Z"/><path fill="#8fbffa" d="M6.386.233a1.21 1.21 0 0 1 1.248.013l5.911 3.87c.42.277.547.754.385 1.161c-.156.392-.55.657-1.02.657H1.09c-.47 0-.864-.265-1.02-.657c-.162-.407-.034-.884.385-1.16l.001-.001l5.91-3.87zM0 11.877c0-.6.572-.889 1-.889h12c.428 0 1 .289 1 .89v1.167c0 .6-.572.889-1 .889H1c-.428 0-1-.289-1-.89z"/></g></svg>`,
            }
        ];
        _getAboutHTML() {
            return ControlPanel.forumData.map(item => `
                <div class="card">
                    <div class="card-body">
                        <div class="top-row">
                            ${ControlPanel.forumSvg}
                            <span class="title">${item.title}</span>
                            <a href="${item.developerlink}" target="_blank"  class="dev-tag">@${item.developer}</a>
                        </div>
                        <div class="desc">${item.desc}</div>
                    </div>
                    <div class="web-link">
                        <a href="${item.weblink}" target="_blank" class="visit-btn">${SVGControlPanel?.链接}</a>
                    </div>
                </div>
            `).join('') + `<div style="padding-left: 16px; line-height: 1;">第三方网站</div>` + ControlPanel.linkData.map(item => `
                <div class="card">
                    <div class="card-body">
                        <div class="top-row">
                            ${item?.icon || SVGControlPanel?.网站}
                            <span class="title">${item.title}</span>
                            <a href="${item.developerlink}" target="_blank"  class="dev-tag">@${item.developer}</a>
                        </div>
                        <div class="desc">${item.desc}</div>
                    </div>
                    <div class="web-link">
                        <a href="${item.weblink}" target="_blank" class="visit-btn">${SVGControlPanel?.链接}</a>
                    </div>
                </div>
            `).join('');
        }

        _BindCommonEvents() {
            const navThemeEl = this.shadow.querySelector('.nav-theme');
            navThemeEl.innerHTML = `${SVGControlPanel[this.data.theme.magnifierTheme]}`;
            navThemeEl.onclick = () => {
                const nextTheme = this.data.theme.magnifierTheme === 'light' ? 'dark' : 'light';
                this.data.theme.magnifierTheme = nextTheme;
                navThemeEl.innerHTML = `${SVGControlPanel[this.data.theme.magnifierTheme]}`;
                this.toast.show({
                    type: 'success',
                    msg: `放大镜主题已成功切换到：${nextTheme}！`
                });
            }

            this.shadow.querySelector('.nav-close').onclick = () => this.hide();

            this.overlay.onclick = (e) => { if (e.target === this.overlay) this.hide(); };

            window.addEventListener('keydown', (e) => {
                const activeEl = document.activeElement;
                const isInput = activeEl.tagName === 'INPUT' ||
                    activeEl.tagName === 'TEXTAREA' ||
                    activeEl.isContentEditable;
                if (isInput) return;

                if (e.key === 'Escape') {
                    this.hide();
                    return;
                }

                // 解析当前保存的快捷键
                const currentShortcut = this.data.basic.shortcut || "Alt + S";
                const parts = currentShortcut.toLowerCase().split(' + ');

                const needsCtrl = parts.includes('ctrl');
                const needsAlt = parts.includes('alt');
                const needsShift = parts.includes('shift');
                const mainKey = parts[parts.length - 1];

                const match =
                    e.ctrlKey === needsCtrl &&
                    e.altKey === needsAlt &&
                    e.shiftKey === needsShift &&
                    e.key.toLowerCase() === mainKey;

                if (match) {
                    e.preventDefault();
                    this.isHide ? this.show() : this.hide();
                }
            });
        }

        /** 显示控制面板 */
        show() {
            this.isHide = false
            this._switchTab();
            this.overlay.style.display = 'flex';
            setTimeout(() => {
                this.overlay.style.opacity = '1';
                this.shadow.getElementById('modal').style.transform = 'translateY(0)';
            }, 10);
        }

        /** 隐藏控制面板 */
        hide() {
            if (typeof this._stopShortcutRecording === 'function') {
                this._stopShortcutRecording();
            }

            this.isHide = true

            if (JSON.stringify(this.data) !== JSON.stringify(JSON.parse(localStorage.getItem(this.storageKey)))) this._saveData();
            this.overlay.style.opacity = '0';
            this.shadow.getElementById('modal').style.transform = 'translateY(20px)';
            setTimeout(() => this.overlay.style.display = 'none', 300);
        }
        /**
         * 获取整个基础参数
         * @returns {keyof (typeof DEFAULT_CONFIG)['basic']} 返回基础参数
         */
        getBasicObj() {
            return this.data.basic
        }
        /**
         * 获取主题
         * @returns {keyof (typeof DEFAULT_CONFIG)['theme']} 返回主题
         */
        getTheme() {
            return this.data.theme.magnifierTheme || 'light';
        }
        /**
         * 获取基础参数的值
         * @param {keyof (typeof DEFAULT_CONFIG)['basic']} key 基础参数名
         * @returns {boolean|string} 基础参数的值
         */
        getBasicByKey(key) {
            return this.data.basic?.[key]
        }
        /**
         * 权重参数是否启用，获取权重参数的enabled值
         * @param {keyof (typeof DEFAULT_CONFIG)['weights']} key 权重属性名
         * @returns {boolean} 是否启用，不存在的参数返回false
         */
        getWeightEnable(key) {
            return this.data.weights?.[key]?.enabled ?? false;
        }
        /**
         * 获取权重参数的值
         * @param {keyof (typeof DEFAULT_CONFIG)['weights']} key 权重属性名
         * @returns {number} 权重值，若未启用或不存在则返回 0
         */
        getWeight(key) {
            const item = this.data.weights?.[key];
            if (!item?.enabled) return 0;
            return item?.value ?? 0;

        }
        /**
         * 更新按钮的传入方法
         * @param {function} fn 传入的方法
         */
        addUpdateFunc(fn) {
            this.updateFn = fn;
        }
    }

    /**
    * 工具函数
    * @param {} managerInstance - 权重管理面板实例
    */
    const util = (managerRef) => {
        /**
         * 安全地将其他类型转换为有效的数字，转换失败时候默认为0
         * @param {*} v - 需要转换的原始值
         * @param {number} [def=0] - 转换失败时的默认备用值，默认为0
         * @returns {number} 转换后的有效数字
         */
        const toNumber = (v, def = 0) => {
            const n = Number(v);
            return Number.isFinite(n) ? n : def;
        }
        /**
         * 获取WEIGHT_MAP的权重值
         * @param {keyof (typeof DEFAULT_CONFIG)['weights']} k 权重
         * @returns {number} 权重值
         */
        const getWeight = (k) => {
            const instance = managerRef.instance;
            if (!instance) throw new Error("Manager 尚未实例化！");
            return instance.getWeight(k);
        }
        /**
         * 获取WEIGHT_MAP的Enable值
         * @param {keyof (typeof DEFAULT_CONFIG)['weights']} k 权重
         * @returns {boolean} 权重是否启用
         */
        const getWeightEnable = (k) => {
            const instance = managerRef.instance;
            if (!instance) throw new Error("Manager 尚未实例化！");
            return instance.getWeightEnable(k);
        }
        /**
         * 正数前面显示 +
         */
        const formatAward = (k, v) => `${k}${v >= 0 ? '+' : ''}${v}`
        /**
        * 升级消耗计算后 加上ATTR_MAP颜色、格式化（血液<100 50<血液<200）
        */
        const formatUpgradeRange = ({ lower, upper }, key) => {
            const color = ATTR_MAP?.[key]?.color || '';
            if (upper) {
                const leftOp = /[=≥]/.test(lower.op) ? '≤' : '<';
                const rightOp = /[=≥]/.test(upper.op) ? '<' : '≤';
                return `<span style="color:${color}">${lower.val}${leftOp}${key}${rightOp}${upper.val}</span>`;
            }

            return `<span style="color:${color}">${key}${lower.op}${lower.val}</span>`;
        }
        /**
        * 名称只保留数字、中文、英文、『』
        */
        const name_cleansing = (str) => str.replace(/[^a-zA-Z0-9『』\p{Unified_Ideograph}]/gu, '')
        /**
         * 名称模糊查询变体（去重）
         */
        const name_variants = (str) => {
            return new Set([
                str,
                name_cleansing(str),
                str.replace(/【.*?限定】/g, ''),
            ])
        }
        /**
         * 判读对象的类型
         * @param {*} obj
         * @returns String || Array || Other
         */
        const objType = (obj) => {
            const type = Object.prototype.toString.call(obj);

            if (type === '[object String]') {
                return "String"
            } else if (type === '[object Array]') {
                return "Array"
            }
            return "Other"
        }
        /**
         * 从URL中获取文件名
         * @param {string} url
         * @returns {string} 文件名
         */
        const getFileNameFromUrl = (url) => {
            try {
                // 使用 URL 类解析，自动过滤 QueryString (?v=1) 和 Hash (#anchor)
                const urlObj = new URL(url);
                const pathName = urlObj.pathname;

                // 提取最后一段作为文件名
                let fileName = pathName.substring(pathName.lastIndexOf('/') + 1);

                // 如果 URL 以 / 结尾或没有文件名，给定默认名称
                if (!fileName) {
                    fileName = "downloaded_file_" + Date.now();
                }

                // 清洗 Windows/Linux 不允许的非法字符
                // 字符范围: \ / : * ? " < > |
                const cleanName = fileName.replace(/[\\/:*?"<>|]/g, '_');

                // 解码 URL 编码字符 (例如 %20 转为空格)
                return decodeURIComponent(cleanName).substring(0, 255);
            } catch (e) {
                return "fallback_" + Date.now();
            }
        }
        return {
            toNumber,
            getWeight,
            getWeightEnable,
            formatAward,
            formatUpgradeRange,
            name_cleansing,
            name_variants,
            objType,
            getFileNameFromUrl,
        }
    }

    /**
    * 勋章等级数据解析计算工具：用于解析论坛勋章的等级、属性、升级条件，并计算回本周期和收益
    * @param {ReturnType<typeof util>} utilInstance 工具函数实例 util
    */
    const createConvertLEVELS = (utilInstance) => {
        // ---  正则缓存 (避免重复编译正则) ---
        const RE_PRICE = /^(\d+)(金币|血液|旅程|堕落|灵魂|咒术|知识)$/;
        const RE_RATE = /(\d+)%/;
        const RE_REPLY = /回帖([\s\S]*?)(?=发帖|▕▏|$)/;
        const RE_POST = /发帖([\s\S]*?)(?=▕▏|$)/;
        const RE_BLOCK_ATTR = /([^\s+\-、]+)([+\-]\d+)/g;
        const RE_LINE_HEAD = /【\s*(?:等级\s*)?(\d+|Max|初级)\s*】(.+)/i;
        const RE_UPGRADE_HEAD = /升级条件[:：]\s*(.+)$/;
        const RE_COST_1 = /消耗\s*([-－]?\d+)\s*([^\d\s-－]+)/;
        const RE_COST_2 = /消耗\s*([^\d\s-－]+)\s*([-－]?\d+)/;
        const RE_COND_1 = /^([≥>≤<＜=]{1,2})\s*(\d+)\s*([^\d\s≥>≤<=]+)/;
        const RE_COND_2 = /^([^\d\s≥>≤<=]+)\s*([≥>≤<＜=]{1,2})\s*(\d+)/;


        /* ---------------- 基础解析工具 (parse) ---------------- */
        const parse = {
            /**
             * 解析购买价格字符串为数值
             */
            BuyPrice: (buy_price) => {
                if (!buy_price) return 0;
                const str = buy_price.toString();
                const m = str.match(RE_PRICE);
                return m ? utilInstance.toNumber(m[1]) * utilInstance.getWeight(m[2]) : (parseInt(buy_price, 10) || 0);
            },

            /**
             * 解析概率百分比
             */
            Rate: (s = '') => {
                const m = s.match(RE_RATE);
                return m ? utilInstance.toNumber(m[1]) / 100 : 0;
            },

            /**
             * 解析回帖/发帖的属性加成
             */
            Effects: (text = '') => {
                const result = { replay: {}, post: {}, other: '' };
                if (!text) return result;

                const effectPart = text.split('升级条件')[0];
                const replayMatch = effectPart.match(RE_REPLY);
                const postMatch = effectPart.match(RE_POST);

                if (!replayMatch && !postMatch) {
                    result.other = effectPart.split('▕▏')[0];
                }

                const parseBlock = (block, target) => {
                    if (!block) return;
                    let m;
                    while ((m = RE_BLOCK_ATTR.exec(block))) {
                        target[m[1]] = utilInstance.toNumber(m[2]);
                    }
                };

                parseBlock(replayMatch?.[1], result.replay);
                parseBlock(postMatch?.[1], result.post);
                return result;
            },

            /**
             * 解析单行升级条件字符串
             */
            Upgrade: (line = '') => {
                const mHead = line.match(RE_UPGRADE_HEAD);
                if (!mHead) return null;

                const expr = mHead[1];
                let m;

                // 匹配：消耗 10 金币 或 消耗 金币 10
                if (
                    (m = expr.match(RE_COST_1)) ||
                    (m = expr.match(RE_COST_2))
                ) {
                    const cost = m[1].match(/[-－]?\d+/) ? m[1] : m[2];
                    const item = m[1].match(/[-－]?\d+/) ? m[2] : m[1];
                    return {
                        type: '消耗',
                        cost: utilInstance.toNumber(cost.replace('－', '-')),
                        item
                    };
                }

                // 匹配：属性 >= 100
                if (
                    (m = expr.match(RE_COND_1)) ||
                    (m = expr.match(RE_COND_2))
                ) {
                    const isStatFirst = isNaN(parseFloat(m[1]));
                    return {
                        type: '条件',
                        stat: isStatFirst ? m[1] : m[3],
                        operator: isStatFirst ? m[2] : m[1],
                        value: utilInstance.toNumber(isStatFirst ? m[3] : m[2])
                    };
                }
                return expr;
            },

            /**
             * 将原始等级文本块解析为结构化对象
             */
            Levels: (levelsStr = '') => {
                const str = String(levelsStr || '');
                return Object.fromEntries(
                    str.split('\n')
                        .map(s => s.trim())
                        .filter(Boolean)
                        .map(line => {
                            const m = line.match(RE_LINE_HEAD);
                            if (!m) return null;

                            const k = m[1];
                            const v = m[2].trim();
                            const effects = parse.Effects(v);

                            return [k, {
                                rate: parse.Rate(v),
                                post: effects.post,
                                replay: effects.replay,
                                other: effects.other,
                                upgrade: k === 'Max' ? null : parse.Upgrade(v)
                            }];
                        })
                        .filter(Boolean)
                );
            }
        };

        /* ---------------- 核心计算逻辑 (compute) ---------------- */
        const compute = {
            /**
             * 计算每个等级的消耗、累积消耗和维持条件
             */
            UpgradeCost: (levelsObj) => {
                let consumedItems = {};
                let consumedTotal = 0;
                let requirementStats = {};
                const result = {};
                const maxOps = ['>', '>=', '≥'];

                for (const lvl of Object.keys(levelsObj)) {
                    const { upgrade } = levelsObj[lvl];
                    const range = {};

                    // 复制当前的维持条件
                    for (const [k, v] of Object.entries(requirementStats)) {
                        range[k] = { lower: v, upper: null };
                    }

                    // 处理当前等级的属性阈值
                    if (upgrade?.stat && maxOps.includes(upgrade.operator)) {
                        range[upgrade.stat] ??= { lower: { op: '≥', val: 0 }, upper: null };
                        range[upgrade.stat].upper = { op: upgrade.operator, val: upgrade.value };
                    }

                    result[lvl] = {
                        消耗: { ...consumedItems },
                        总消耗: consumedTotal,
                        条件: range
                    };

                    if (!upgrade) continue;

                    if (upgrade.type === '消耗') {
                        consumedItems[upgrade.item] = (consumedItems[upgrade.item] ?? 0) + upgrade.cost;
                        consumedTotal += upgrade.cost * utilInstance.getWeight(upgrade.item);
                        requirementStats = {}; // 消耗型升级通常重置之前的属性维持条件
                    } else if (upgrade.stat && maxOps.includes(upgrade.operator)) {
                        const cur = requirementStats[upgrade.stat];
                        if (!cur || upgrade.value > cur.val) {
                            requirementStats[upgrade.stat] = { op: upgrade.operator, val: upgrade.value };
                        }
                    }
                }
                return result;
            },
        };

        /* ---------------- HTML 转换逻辑 (toHtml) ---------------- */
        const toHtml = {
            /**
             * 转换为收益浮点数 HTML 标签，并找出最大收益等级
             */
            LevelsFloat: (levelsObj, type = "replay") => {
                let BeatLv = { value: -Infinity, level: "1" };
                let MaxLv = 0;

                const map = {};

                for (const k in levelsObj) {
                    if (!Object.hasOwn(levelsObj, k)) continue;

                    const v = levelsObj[k];
                    const stats = type === "replay" ? v.replay : v.post;
                    const rate = v.rate ?? 0;

                    let total = 0;
                    let itemsHtml = '';

                    if (stats) {
                        for (const key in stats) {
                            if (!Object.hasOwn(stats, key)) continue;

                            if (!utilInstance.getWeightEnable(key)) continue;

                            const val = stats[key];
                            const value = val * rate * utilInstance.getWeight(key);
                            total += value;

                            const emoji = ATTR_MAP?.[key]?.emoji || '';
                            itemsHtml += `${emoji}${value.toFixed(2)}`;
                        }
                    }

                    const totalFixed = total.toFixed(2);

                    if (total >= parseFloat(BeatLv.value)) {
                        BeatLv = { value: totalFixed, level: k };
                    }
                    if (k.toLowerCase() == 'max') MaxLv = totalFixed;

                    const totalEmoji = ATTR_MAP?.['总计']?.emoji || '';
                    map[k] = `<span class="medal-floats item">${itemsHtml}</span><span class="medal-floats total">${totalEmoji}${totalFixed}</span>`;
                }
                if (BeatLv.value === -Infinity) {
                    BeatLv.value = "0.00";
                }

                return { map, BeatLv, MaxLv };
            },

            /**
             * 转换等级Object{level, 原始文本} 为 {level, HTML}
             */
            LevelsRaw: (levelsObj) => {
                return Object.fromEntries(
                    Object.entries(levelsObj).map(([k, v]) => {
                        const { rate, post, replay, upgrade, other } = v;
                        const rateHTML = rate ? `<span class="medal-rate">${parseInt(rate * 100)}%</span>` : '<span class="medal-rate">0%</span>';
                        const replayHTML = replay && Object.keys(replay).length ? `<span class="medal-replay">回帖${Object.entries(replay).map(([rk, rv]) => utilInstance.formatAward(rk, rv)).join(' ')}</span>` : '';
                        const postHTML = post && Object.keys(post).length ? `<span class="medal-post">发帖${Object.entries(post).map(([pk, pv]) => utilInstance.formatAward(pk, pv)).join(' ')}</span>` : '';

                        const upStr = upgrade
                            ? typeof upgrade === 'string'
                                ? upgrade
                                : upgrade.type === '消耗'
                                    ? `消耗${upgrade.cost}${upgrade.item}`
                                    : `${upgrade.stat}${upgrade.operator}${upgrade.value}`
                            : '';

                        return [k,
                            `${rateHTML}<div class="medal-raw">${other ? `<span class="medal-other">${other}</span>` : ''}${replayHTML}${postHTML}${upStr ? `<span class="medal-upgrade">升级条件：${upStr}</span>` : ''}</div>`
                        ];
                    })
                );
            },

            /**
             * 渲染等级图标
             */
            Imgs: (imgsObj) => {
                if (!imgsObj) return {};
                const result = {};
                for (const key in imgsObj) {
                    if (Object.hasOwn(imgsObj, key)) {
                        const [src, width] = imgsObj[key];

                        result[key] = src
                            ? `<div class="level-img"><img src="${src}" width="${width}" loading="lazy"></div>`
                            : `<div class="level-img none">${SVG?.["缺图"] || ''}</div>`;
                    }
                }
                return result;
            },

            /**
             * 渲染升级成本及回本周期 HTML
             */
            CostInfo: (levelsObj, buy_price, BeatLv, MaxLv) => {
                const costData = compute.UpgradeCost(levelsObj);
                const buyPriceValue = parse.BuyPrice(buy_price);

                const renderLvl = (lvl, award, isMaxHeader = false) => {
                    const data = costData[lvl] || {};
                    const consumes = data.消耗 || {};
                    const conds = data.条件 || {};

                    const costHtml = Object.entries(consumes)
                        .map(([k, v]) => `<span style="color:${ATTR_MAP?.[k]?.color || ''}">${v}${k}</span>`)
                        .join('、');

                    const condHtml = Object.entries(conds)
                        .map(([k, v]) => utilInstance.formatUpgradeRange(v, k))
                        .join('、');

                    const awardNum = utilInstance.toNumber(award);

                    const getPeriod = (base) => awardNum > 0 ? `${Math.floor(base / awardNum)}贴` : '无法计算';

                    const title = isMaxHeader
                        ? `【 Max 】回帖收益（<span style="color:#ff4b4b;">${award}</span>）${BeatLv.level === lvl ? '最大' : ''}`
                        : `【等级${lvl}】回帖收益（<span style="color:#ff4b4b;">${award}</span>）${BeatLv.level === lvl ? '最大' : ''}`;

                    return `<div style="margin-bottom:4px;">
                    <div>${title}${costHtml ? `，升级消耗（${costHtml}）` : ''}${condHtml ? `，维持 ${condHtml}` : ''}</div>
                    <div>【回本周期】升级消耗回本${getPeriod(data.总消耗)}, 考虑勋章价格回本${getPeriod(data.总消耗 + buyPriceValue)}</div></div>`;
                };

                let html = '';
                if (BeatLv.level !== 'Max') {
                    html += renderLvl(BeatLv.level, BeatLv.value, false);
                }
                html += renderLvl('Max', MaxLv, true);
                return html;
            }
        };

        /**
         * 整合所有数据生成最终 HTML
         * @param {string|Array} levelsStr 等级：原始等级字符串或者已解析的obj
         * @param {object} imgsObj 图像数组
         * @param {string} buy_price 购买价格
         * @returns
         */
        const AllToHTML = (levelsStr, imgsObj, buy_price) => {
            let levelsObj

            if (utilInstance.objType(levelsStr) === "Array") levelsObj = levelsStr;
            levelsObj = parse.Levels(levelsStr);

            //  数据转换
            const { map: floatMap, BeatLv, MaxLv } = toHtml.LevelsFloat(levelsObj, "replay");
            const rawMap = toHtml.LevelsRaw(levelsObj);
            const imgMap = toHtml.Imgs(imgsObj);
            const costHTML = toHtml.CostInfo(levelsObj, buy_price, BeatLv, MaxLv);

            // 排序与拼接
            const toNum = v => (v === '初级' ? -Infinity : v === 'Max' ? Infinity : Number(v));

            const levelsHTML = Object.keys(levelsObj)
                .sort((a, b) => toNum(a) - toNum(b))
                .map(key => {
                    const title = (key === "Max" || key === "初级") ? `${key}` : `等级${key}`;
                    return `${imgMap[key] || '<span style="height:30px;"></span>'}
                        <div class="medal-level-name"><span>【</span><span style="flex-grow: 1;text-align: center;padding:0 2px;">${title}</span><span>】</span></div>
                        ${floatMap[key] || ''}
                        ${rawMap[key] || '<span></span>'}`;
                })
                .join('');

            return `<div class="medal-list-container"><div class="medal-list">${levelsHTML}</div></div><div class="medal-cost-count">${costHTML}</div>`;
        };

        return {
            AllToHTML,
            parse: parse.Levels,
            computeCost: compute.UpgradeCost
        };
    };


    /**
     * 缓存管理器：读取的IMG Blob 集合到内存中缓存，超过限制时候清除最早的图片
     */
    class ImageCacheManager {
        constructor(limit = 150) {
            this.limit = limit;
            this.cache = new Map(); // Map<fileName, blobUrl>
        }
        /**
         * 向Map中添加 fileName：blob url
         * @param {string} fileName 文件名
         * @param {string} url 文件blob url
         */
        add(fileName, url) {
            // 同名时候，移除后重新插入到末尾
            if (this.cache.has(fileName)) {
                URL.revokeObjectURL(this.cache.get(fileName));
                this.cache.delete(fileName);
            }
            this.cache.set(fileName, url);

            // 超过上限，释放最早的资源
            if (this.cache.size > this.limit) {
                const oldFileName = this.cache.keys().next().value;
                const oldUrl = this.cache.get(oldFileName);
                if (oldUrl) {
                    URL.revokeObjectURL(oldUrl);
                    this.cache.delete(oldFileName);
                    console.log(`[Cache] 自动释放冗余内存: ${oldFileName}`);
                }
            }
        }
        /**
         * 获取 Map[ fileName：blob url ] 中的 Blob URL
         * @param {string} fileName 文件名
         * @returns {string} 返回 Blob URL
         */
        get(fileName) {
            return this.cache.get(fileName);
        }
    }

    /**
     * 本地文件系统，1、将图片存储到本地磁盘，2、读取本地图片
     */
    class LocalFileSystem {
        /**
         * @param {ReturnType<typeof util>} utilInstance
         */
        constructor(utilInstance) {
            this.utilFunc = utilInstance;

            this.dirHandle = null;
            this.dbName = idbConf.dbName;
            this.storeName = "sys";
            this.recordName = 'dir_handle'
            this.cache = new ImageCacheManager(150);
            this.isProcessing = false;
            this.idb = idbstorage;
            this.curPermission = null;
        }
        async #saveHandle(handle) {
            try {
                this.idb.model(this.storeName).updateByField("idx_name", this.recordName, {
                    name: this.recordName,
                    handle: handle,
                    updatedAt: Date.now()
                })
                return true;
            } catch { return false; }
        }

        async #getHandle() {
            try {
                const results = await this.idb.model(this.storeName).query({ index: "idx_name", value: this.recordName })
                return results.length > 0 ? results[0].handle : null;
            } catch { return null; }
        }
        async getHandleName() {
            const s = await this.#getHandle()
            return s?.name
        }
        /**
         * 选择本地文件夹进行授权
         * @returns boolean
         */
        async authorize() {
            try {
                this.dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
                console.log("this.dirHandle", this.dirHandle)
                await this.#saveHandle(this.dirHandle);
                return true;
            } catch { return false; }
        }
        /**
         * 站点的文件修改权限申请UI
         */
        async #showPermissionDialog(opts) {
            return new Promise((resolve) => {
                // 防止重复创建
                const old = document.querySelector('#fs-permission-mask');
                if (old) old.remove();

                // 遮罩
                const mask = document.createElement('div');

                mask.id = 'fs-permission-mask';

                Object.assign(mask.style, {
                    position: 'fixed',
                    inset: '0',
                    background: 'rgba(0,0,0,.45)',
                    zIndex: '999999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)',
                });

                const panel = document.createElement('div');

                Object.assign(panel.style, {
                    width: '320px',
                    background: '#fff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(0,0,0,.2)',
                    fontFamily: 'sans-serif',
                });

                panel.innerHTML = `
                    <div style="font-size:18px; font-weight:700; margin-bottom:12px;">需要文件夹权限</div>
                    <div style="font-size:14px; color:#666; line-height:1.6; margin-bottom:20px;">请点击下面按钮授权目录读写权限</div>
                `;

                // 按钮
                const btn = document.createElement('button');

                btn.textContent = '授权访问';

                Object.assign(btn.style, {
                    border: 'none',
                    background: '#1677ff',
                    color: '#fff',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                });

                panel.appendChild(btn);
                mask.appendChild(panel);
                document.body.appendChild(mask);
                btn.addEventListener('click', async () => {

                    try {
                        const newPerm = await this.dirHandle.requestPermission(opts);
                        resolve(newPerm);
                    } catch (err) {
                        console.error("授权失败:", err);
                        resolve(false);
                    } finally {
                        mask.remove();
                    }
                });
            });
        }
        /**
         * 验证浏览器的文件修改权限
         * @returns boolean
         */
        async verify() {

            if (!this.dirHandle) this.dirHandle = await this.#getHandle();
            if (!this.dirHandle) return false;
            const opts = { mode: 'readwrite' };

            const permission = await this.dirHandle.queryPermission(opts);

            if (permission === 'granted') {

                return true;
            }

            if (permission === 'denied') {
                console.error("权限被浏览器拒绝，请在地址栏设置中手动恢复！");
                return false;
            }
            // 询问权限
            if (this.curPermission === null) {
                this.curPermission = await this.#showPermissionDialog(opts);
                return this.curPermission === 'granted';
            } else if (this.curPermission !== "granted") {
                return false;
            }

        }

        /**
         * 保存文件到本地磁盘
         * @param {*} url 文件原始url
         * @returns 保存的数据 { fileName, blobData }
         */
        async saveFile(url) {

            const fileName = this.utilFunc.getFileNameFromUrl(url);
            const fileHandle = await this.dirHandle.getFileHandle(fileName, { create: true });

            return new Promise((resolve, reject) => {

                console.log("[下载图片任务] 开始下载：", fileName)
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: async (res) => {
                        let writable = null;
                        try {
                            const blobData = res.response;
                            writable = await fileHandle.createWritable();
                            await writable.write(blobData);
                            await writable.close();
                            console.log(`[下载图片任务] 保存本地成功: ${fileName}`);
                            resolve({
                                fileName,
                                blobData
                            });
                        } catch (err) {
                            if (writable) await writable.abort();
                            reject(err);
                        }
                    },
                    onerror: reject
                });
            });
        }

        /**
         * 从本地磁盘或者缓存中读取文件
         * @param {*} url 文件原始url
         * @returns string blob文件url
         */
        async getFile(url) {

            const fileName = this.utilFunc.getFileNameFromUrl(url);
            const existingUrl = this.cache.get(fileName);
            if (existingUrl) return existingUrl;

            const fileHandle = await this.dirHandle.getFileHandle(fileName);
            const file = await fileHandle.getFile();
            const newUrl = URL.createObjectURL(file);

            this.cache.add(fileName, newUrl);

            return newUrl;

        }
    }
    const GLOBAL_THEME = `
        :host {
            --text-primary: #fcfdff;
            --text-secondary: #e3e3e3;
            --text-update: #dad1d1;
            --text-post: #90d5fd;
            --text-replay: #ef99ef;
            --text-rate: #ff4b4b;
            --color-a: #88bfff;
            --color-a-hover: #aed9fa;
            --bg-primary: rgba(21, 21, 21, 0.75);
            --bg-secondary: #969696;
            --bg-type: #0071ff;
            --shadow: #777777;
            --bg-scrollbar-thumb: rgba(157, 157, 157, 0.87);
            --bg-scrollbar-thumb-hover: rgba(219, 217, 217, 0.95) ;
            --bg-scrollbar-track: rgba(21, 21, 21, 0);
            --color-border: #a3a0a0;
        }
        :host[data-theme="light"] {
            --text-primary: #000000;
            --text-secondary: #000000;
            --text-update: #201e1e;
            --text-post: #00a1ff;
            --text-replay: #d43fd4;
            --text-rate: #db0000;
            --color-a: #0075fd;
            --color-a-hover: #16a2f8;
            --bg-primary: rgb(255 255 255 / 90%);
            --bg-secondary: #969696;
            --bg-type: #a0cfff;
            --shadow: #a7a7a7;
            --bg-scrollbar-thumb: rgb(193 193 193 / 95%);
            --bg-scrollbar-thumb-hover: rgba(157, 157, 157, 0.87);
            --bg-scrollbar-track: rgba(21, 21, 21, 0);
            --color-border: #a3a0a0;
        }
    `;
    /**
     * 勋章放大镜
    */
    class MedalMagnifier {
        /**
         * @param {any[]} medalData - 勋章数据
         * @param {any[]} medalDataNoTid - 未记录到博物馆的勋章数据
         * @param {ReturnType<typeof util>} utilInstance - 工具函数
         * @param {ReturnType<typeof createConvertLEVELS>} convertLEVELS - 解析等级函数
         * @param {LocalFileSystem} localFileObj - 本地图片系统
         * @param {ControlPanel} controlPanel - 控制面板
         */
        constructor(medalData, medalDataNoTid, utilInstance, convertLEVELS, localFileObj, controlPanel) {
            this.medalData = medalData;
            this.medalDataNoTid = medalDataNoTid;
            this.utilFunc = utilInstance;
            this.convertFunc = convertLEVELS;
            this.controlPanelObj = controlPanel;
            this.localFile = localFileObj;

            this.el = null;
            this._hideTimer = null;
            this._hideTimerLock = false; // 全局状态锁 防止事件代理先触发而this.el的mouseleave后触发

            // 缓存已经查询过的节点
            this.nodeCache = new WeakMap();
            // 转换 this.medalData 为 以name为键的Map
            this.medalMap = null;


            // 初始化
            this.initDB();
            this.createElement();
            this.initAllBindListen();
            this.GM_registerMenu();
        }
        getMagnifierTheme() {
            return this.controlPanelObj.getTheme();
        }
        getMagnifierStatus() {
            return this.controlPanelObj.getBasicByKey("medalMagnifier");
        }
        getPositionMode() {
            return this.controlPanelObj.getBasicByKey("positionMode");
        }
        getShowImgStatus() {
            return this.controlPanelObj.getBasicByKey("showImage");
        }
        getLocalImgStatus() {
            return this.controlPanelObj.getBasicByKey("localImageMode");
        }
        initDB() {

            this.controlPanelObj.addUpdateFunc(this.updateForced);

            //idb数据更新
            (async () => {
                const s = await idbstorage.model('sys').count();
                const c = await idbstorage.model('award_info').count();
                console.log(`award_info数据库表，总条数：${c}\nsys数据库表，总条数：${s}`)
                const m_count = this.medalData.length
                const mNo_count = this.medalDataNoTid.length
                const num = m_count + mNo_count;
                if (num !== c) {
                    console.log(`award_info数据库表条数和脚本内部不匹配，清空数据库表`)
                    await idbstorage.model('award_info').clear();

                    const sortedData = [...this.medalData]
                        .sort((a, b) => a.no - b.no)
                        .map(a => ({
                            ...a,
                            name_cleansing: this.utilFunc.name_cleansing(a.name),
                            levels: this.convertFunc.parse(a.levels)
                        }));
                    const sortedDataNoTid = [...this.medalDataNoTid]
                        .map(a => ({
                            ...a,
                            name_cleansing: this.utilFunc.name_cleansing(a.name),
                            levels: this.convertFunc.parse(a.levels)
                        }));
                    await idbstorage.model('award_info').addBatch(sortedData);
                    await idbstorage.model('award_info').addBatch(sortedDataNoTid);
                    const c = await idbstorage.model('award_info').count();
                    console.log(`award_info数据库表，插入条数：${c}（博物馆：${m_count}；非博物馆${mNo_count}）`)
                }
            })();

        }
        /** 强制更新本地idb */
        updateForced = () => {
            (async () => {
                await idbstorage.model('award_info').clear();

                const sortedData = [...this.medalData]
                    .sort((a, b) => a.no - b.no)
                    .map(a => ({
                        ...a,
                        name_cleansing: this.utilFunc.name_cleansing(a.name),
                        levels: this.convertFunc.parse(a.levels)
                    }));
                const sortedDataNoTid = [...this.medalDataNoTid]
                    .map(a => ({
                        ...a,
                        name_cleansing: this.utilFunc.name_cleansing(a.name),
                        levels: this.convertFunc.parse(a.levels)
                    }));
                await idbstorage.model('award_info').addBatch(sortedData);
                await idbstorage.model('award_info').addBatch(sortedDataNoTid);
                const c = await idbstorage.model('award_info').count();
                const s = await idbstorage.model('sys').count();
                const m_count = this.medalData.length
                const mNo_count = this.medalDataNoTid.length
                console.log(`award_info数据库表，插入条数：${c}（博物馆：${m_count}；非博物馆${mNo_count}）`)
                console.log(`sys数据库表，总条数：${s}`)
            })();
        }

        createElement() {
            const medalID = 'medal-container-detail'
            this.el = document.getElementById(medalID);
            if (this.el) return;

            this.el = document.createElement('div');
            this.el.id = medalID;
            this.el.className = medalID;
            let themedCss = GLOBAL_THEME.replaceAll(':host', `.${medalID}`);
            this.el.setAttribute('data-theme', 'light')
            const css = /* css */`
                ${themedCss}
                .${medalID} {
                    position: fixed;
                    padding: 4px;
                    font-size: 13px;
                    border-radius: 5px;
                    z-index: 10000;
                    font-weight: 500;
                    color: var(--text-primary);
                    box-shadow: 0 6px 24px 6px var(--shadow);
                    background: none;
                    overflow: hidden;
                    display: none;
                    opacity: 0;
                    font-family: '等线' , "Microsoft YaHei Light" , system-ui, sans-serif;;
                }
                .${medalID}[data-theme="light"] {
                    font-family: "Microsoft YaHei" , system-ui, sans-serif;;
                }
                /* 磨砂层：负责模糊图片 */
                .${medalID}::before {
                    content: "";
                    position: absolute;
                    top: -20px; left: -20px; right: -20px; bottom: -20px;
                    z-index: -1;
                    background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCAFUAcIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDRpaMUldhzoWl60lKKho1ixcUlOpMVJbEop1JVGbClFJTk60McdRQKUCpkkVIyNuSR+VRg1le50KNhNtKFozUsbZ4OPrSbLSGBasGN3QnGQABnHSpoIY5CQXwAc9M1duCTAcBSSMEgdqwlPUtRMdoHVQzKQp70gAOd2Tx+VWricvFHEowqdeepqOCEyNwQMdST0q7u12JLUrkYpKszpgngAg8kVXIqk7iegynCkxSiqAeMg1JvJ61EKcKhlIkzViFqqirVsm41nLYpF+NwMbu9TyKsi4/Wq6REkHqBU+a5hsqFJIuFPHrVGcyLKc9/1rWk5FUp1DAZ6Ct6ctdTOcborBFUg4GaiI+agscnB4FSQx5YMWAx09612J3LNraKw3SHn0q09tGrGQZAxwo9aamcZFTKcjmuaUnc05RFZnbB6jqPSplwBgUzjkjgnvUe8+tR6DtdD8EHis29JDEk/Meoq+ZccHrUUqtKDiESIB3rWm7SuzKorqxitTaszbCPljVfcZqviu+L0OFxsNpaXHFGKu5AlJS0UAJS0lLTEFFFLikMSilxRigLCUUUtMBKWiigApaSlFIAooooAr4pMU6koNLCYpQKKWkUtAo7UlLSHuJRS0oFFw5biYpQMUU6k2Wo2ClzSGkzU2NUOzRmm5oosO5PFcNE2etXI7zKEsPbFZtOT3qJQTHdlhmUtxSFx2GPpSRhiDg/WmhSz7QMk9BU2Qy7HIsiqZFXABBx1NQXMKxsWjO6POA1Btp1wPLY5x93nrT7smGCOE9cbiCOhqFvoUyoaBTc5pwrUkcBS4pRS1FzSwCrFtN5RPOM1BS7SSAOTUtJgaa3LMMZ6d6USsOSapxZTr3q4g9awaSKRJLIpUEHOaoyvnNSv8rEdu1QMQMk1cVYlohCVYgjG3NIqZGamjGOKqUgUSdB8opw60xWwMU4Gudl2HBgMg00kZ9qDg1Fgs2BQkD0RIiAuWHK+lWoxlTj04qFE28Vaj4WhvUylsYd9B5AXcR8xIAFUcVsauhdbcKASd3OfpVJLaPyXMrbX/hFd9OXups45Ru9CnSd6eRTa2TMmhKSnUlMkSilooAKKKXFACUVYW1ZoTKGXA7VBSTT2G01uJS0YopiDFGKKWmKwmKKWilcdhMUU7B9KKV0VysqUtFFUAUUUUDCiiikykOFLTRS5qGjVMKXNNozTsK4tFGaKRoFLRRQMWlBxSClqWMkWQrnFPRskeuc1DT0OCPaoaLN2CUIir2A/Os7WFAvcjHzKCakWcbQRg+1Vb6TzpA5+lYwj71xtaFcCniowaepya2YkOFOFJinqKhloUVNG3XNRCnA1DKLC4yM9KkEoV89qqM5A4oVyaXKK+panYMSwqq/zc/pUofjB5FIyLsJJwe3vRHQGNjkKgqfwqwpzVMfKcnn0xU8EoZmzwO1EkCZNnBqRDmoHYb/AJakjb5qyaLJHz5Z29aZCxU5PFTbQRg9Kr3DhCMD5acddCJFzeqjcxAHuaQXW4MBx6VjvMzcckdqv2wKxjJz/SqcFFEL3iRrfzLhH3ZRFx81SXNqlwmFAVx3xTlY7ab5hGcDJqVJ3QnBWMWaB4ZTG4+YelRFSCQRzVm5unuG+c9Og9Ki3k9cmu9XtqcTS6EIBJwBTvLbjAz7CrBjCpkghz0FRbyh44Pb2o5r7C5UtxjROoBZSAeeaZTmO45JyfWkrQh26BS0lKKARfeMR2QBOAcZIFUKmNzIYjGcEEY5FQ1nBNbmlRp2sFFFFaGYUUUUgsFA68jNGDS0rlJMdn/OKKbRSsiuZlbFFKRSVSG1YKKKKoTQlLikpwpMEhKM0/YcdRTGUhsEc1Ny2rCUU9oWCg+pxTTGy9RRdFWaEzS5puDQKBodmlzSUtItCinimAU+pZSFFFApakocrlaJDuFNopW1G3oNxSrwc0UVRncfuJqVPu1BUysoXk8+gqJI0ixxOKTfTC4z0P50zdzSUAcicPUm33H4VXQgnrirKOoJ3sPwNS9ATuOGMbmPSmSyqzZUfpSsFPQ1GVFSl1KuPXDCmn5TxT4wNtIRzTTBoIzzzU+SDkdqhA44FQMWDdTS5eZg5WL8s7BMrUDOHhJY/MOmT1qOOTawLEmnhPPcn7oPtRZIL3IVBLcVqwRlIRk5J60kFtGi8Lk+pqbAVcCs5zuEVYcqEjiobqJ5IdikZJ71YQ4FOOGzUJ2dxS10MY6dIM/MpOMgDrTltPKhZ2IL+noK1l4qG/iMloxC5ZSMY61uqrbszGVNLVGXOwYLIzA5H1qqTTgrSMEUZJ6Cmkc4Ix9a6oqxyy1GUCnYoxV3IsJS0UUBYKKKKBhRRS0AFO4xTaeoGeamRcQAGOaVsbeAAaULxntSMRjis+prshlFFFaGVyvmkPWkoqi73CkpaKYrAAScCnFSODQvHNGSaTGrDg3yinlsios0ZqbFpk4kOzb75ppPNR5oyc5qbF8w/Yufr2qT7OCOOtQDJOTVuFjgZ5qZXRUbMr+S2QMcmmFcHB6itAoS4xxUL2xJYg//AF6SmNxKw5qwYMD3pY7Ukg5zV+OJflAxnuTUynYaiV4bHzkXAKk96rXELW8zRv1Xv61tRnayheMHBFUNWw12CP7oBqYSblYbWhn0UHim5rUkXNLTaUGrIsOozSUVI0BNJmigUDFpQaSikxkyucU7rUQNSx4PWoZSFycYqZYWABPNJtG04FOSRlU8ZXpz2rNlLTcmCIFyW/CqTKS/uTVny2wGbgGhE/fgkEjrmhOwNXFW1+UAYLd6lRRH8p6ip0UBie5p5UHnFZuV9x2sM5VcjgU3dUhqM4zUFocJuOnH1qVZBiq4AAAHAFKT70rCsiyGpry4GB+lMQ8c0mVLGgmyIo40hXag75zVG7gZXaQD5SegHStByM1FJIFiZiOCOh4zW8JNMipCLiZVJRS12o88KKKKACiiloEJRS0lABS0UUDCiijFABRRiigCrS0UVRqJRRRQSLRS0YpF2EpQKKBSKQUoopRSKHgVNFweaiVh3p3mDNZS1LVkXYsM3rUjBd4wKqRShT1qQPk5BrFxdzXmui3Hg/KBU6RKvIqvbk7uauCsZOzLWwbcjjrWbqVu0ZWTJIbg1pk4qG5YSQFT+NVCTTJkrmNHD5pIziopYmifa4/H1rUiiXBI4qK5h3x7ueK2U/eJ5VYzaUVIY6btxWtyBtLRikpisFAoooAWlpKWkykKKlQ1EBS4btUPUexcXk4HNO2qGqC3k2k5qwvrWUtDSOqJHfcMUIcEUzNKKguxdXtUh4FQRNkVOp3HmoJkQzuI1HBzVQT5yCMelS37qjj0zzVNZA0hLH6VvGCtc55T1sOkldBUltKXzupjjf3qFXEbnHNXypxsTzOMrmg7Mo4HFRSSMEznFPSdSuDzn0peGyOMHtWaVt0aSfMtGRi5jPU4qK5ljkXbn7p7VUbqeMe3pTa3VNXuc7qtqzEopaK2MAooooAKWiigYUUUUCCiiikMKWkpaYBRRRQBXI5ppqx5RkcjpimNA4bGMnGeKSaNrMiAzS4qaGEk/MCPrSSJtNHNrYOWyuRUUUUwCgUUUFC0tJRmkMM0ZopQKAHr0qQMR3qMU7NZtFo0LebOParnnccGsZW21ZWbA61zzhrobxfcvedUUmXOcjmqpnPrTllOaShYd0yZFI4FWGtw6jHfqDVUOeoNWIpyAM1LuFijdwmKVsDjrULxnHSticLcR4Kgk+tQfZwUHrjvWiqaIz5TIIwabWi9oHyBjdVKSFo2wwraMkzOSaIqSnGm+tXYhSDNKDTaUZzSaKTJRTwaVEDEAU+SEqM461m9y7uxCSe1WLeQEYY4xUBHrSAY6UmrqwRlZl4MC+Og7VLtwcZ4qgJDx6ipvP4ByM/Ss3B9DVTXUto22ladlPyjp1qqs5JzxTHmKsSO9KMHcmc1a5FPO0rZY5qIEig0V2JWRwNtseJGHem5yc0lLRZCbbFDEd6f5rDvUeKKLBdiuxZix6nrTaXFGKYhKKXFFACUtFFABRS0UDEopcUuKLiG0UuKMUXGJS0YpcUrgFFFFMViRQR0qS5RhGjjqvXFRLOFHTmnC9xWDUrnZeKVmQNcsTkgGpFKSIC2Dz0pk0kUwyAFYegqJPlPWtOW6I5ncJIyh9R6io6mMp5HrwaaVGOKpPuS0uhHRSkU2rQthaKSgUWFcdS5puaM0rFJjwacDTBRmpaLTJM4FP3YFRgg1IUOKyZqgRwxxmpFbpVccGnZ9KGgUi6jZIpXcqTVNJCp5qzvD9KzasaJ3JBdbFGR2qeG4DRZPXPSqjRblxikiOOPSk0mhK9y/uG7jvUF/HmMOACB1qaBA+Q2RxmkuLiKBGjZcnbwPX2qYu0tBSWmpiMeab1oJ5oBrsOdIXFW7eNSOR1qqOtWreQKeaym3Y1glfU0YLZAMj8qsBAO1QQy4bg1YWTLc9DXI276m1rbDWSNwQ6K2azrm0EIBUnB6+1a+zcc9qiuY1kgYKRkcniqhNpmU0mjCPFNzT2B9KYRXajkbYqtg06Rtx4puKKLa3C7tYKKKKZNgooopisLRRRSuFgopcUYouFhKKKWkOwmKKWjFFwsFFLRii4WEp6Yz8xIGOoGabS0DsJijFLS0rgJikxT8UFeM5ouFhlFOxRTuFiBxg1EetTbgRg0xlHammaNEdKKMUoFUxJCnqPenMvAxTSOlSAELxUMtEDHBxSZpZOuabWiMpBRRRVCClFJS0mA6lpopallpjlOGFWdw21Vp6HsaylE2hO2gYOaUCl70tIoAM1LENrc1GDipFYVDKRZ81FHPWoEOXNRM3NLGfnFLlsi09S4tw8TeoxjFVLhzIWY9amdgTwc4qCUZU4oilcU0VKKUqaUCt7mICrMCguNx4781ABg1OjLxj8jWci47loHy3+RuMVYjlJqoSRjHYcVJE2a55LQ2T1NSJ/l5pkjhJAahV9ijPei4bO0g5rJXC2oz7Ohdsfdbn6UgtF2gEZwSalDAqCKli681fPJEygio+nxCMnke4NZ7wupPykj1ArbnztPpVdfStYVGtzCVNPYycUAZq7e2xX51A298VUT74+tbxldXRjKNnZimFgMkcUzFa0Gxx8wFK6RlGXaoB9BWftOjLdLsZOKu2Nn55LyfcHT3NRzRKjDaMZq3bSbECCicny6ChDXUmFhbgn5cjPrRLpsEiHywY37EEkUGQlwq1Idy4BOQe9Yc0lrc25EzBIIJBGCDg0tT3Fu0U5XafmOR71MdOk8sMrAuf4a6eddTn5GUqKcQQSCMEdRSVVxWDFFGKXFAWEpcU4IT2oKlDgjBpXCw3FLRTo13OB607hYd5bCIPt49aZkdD+dXGUiLbkkHnFUz1qYu5UlYOOx/SikopklTdml603FKOK1aGmLiijOaKQxamjwRUFPTrUyRcXqJJHl6jMJ2kjnFWlTqaeqY696lVLFOnczsUVYeIhyAKiK4NbKVzBxaG0UuKMVVybCUtJS0DHClBpopwqGik7D80uaZThUWNEx2aKQUtSUgIpMEU7FLSKTFTJFOCUkZwcGrKKCMGobsactyAxhhyKQxKo571bMWBkVTmPzAgEcUKVyXHlGyR88KQKYAQasxHfgYqbyFalz20ZXs76orIzBs5qWI/MaGiEZwehpUwDSbTQWsyxhmGC1RyFlHzHrUgYKuc1FMDIoIPFTHzKl5ElvMD8uato2KoRRqjZBq1vXA4qZJX0BXtqNknyMH1pocHGKWSMHBojQVWltDOzuPlbdEQOp4qoLGRvmQZxV8AelSq2KSm47ClC+5mLIVGOhpxl4qzc23mvvjwCeorPPyths474rRWlqQ7x0Y9pd3XnFSxZxmqjYySp4zxUtvKRlc05LQqK1L0YYnINTqDtKmqZn2YJNPWZtwIUnPtWDTLLpRWA3DJHelAweKri5GOanRhIMio1EZmpKv2osvcDd9ap4rSvIwZOmCarCJR1Oa6Yy91GLjqVsUoqdolxkUghyMlgv1quYnlaEVuKJHEg5zuH5U1gATg5FNxk0WV7g27WClU7WBowQSCMEUVRNiRp2Zdp6VHRShSQTxx70thu7G0UuKKdxWZWaFl6ioypXrV1znrULY6VSky3FdCvS09l4yKZWl7kWsLTgcGmUUmhplpHGKeHBqorDvTww3daycTeMywCDyKjkQNyOtN37E+fjHc8VVm1C2RvnuEDegOf5VK0ZcmmtSRlxTCKjGp2RXBuFH4H/AAppv7If8vSfkf8ACtVI53HsTUYqIXduwBWZSD3wQKgvNShtIVkBWXc4TCuOM5OfyBquYnlaLlKKTHpyPWlFO4hwpwpgp2aQ0x1LTM04VDRdxwp1NFOFS0NMMVKj4HJPFRUtS0axZObhihXjmmygLbISPmJ/SosEc04/PHljyKVrbFPUZHJtP0q7FJvPWs48c1at5FOOxFKpHqOEug+8+4pqqsmDVm6bdHgVRqqa90io/eJvOO7NOabLDbkCoM0VXKiOZlyOQeuanEmBkVmg4NW0wV61nKJrGVy6j+Z1ozg4qCNzGcg0x5sNnPWs+XsDfUteZigTc9aq+eCMU0Sc0+QXMaSuT05qFoIrlCyja/8AWoY5iOnfipFYxkgdD70kmhPUoyLt79+lMDFTkVLPG2SRkimRPsJyAwNbX0JRLb/vJBk8da1YyBg1jeZtfcgxx2rQjnXyxlgTisaie5pHaxNdRhlEi9RwfenW7ALjNJuBjIxw1KkIAzms76aisF0okiJHVeRWYWq+7kI3txWceta09iJDw5pysDHIOMkcf1qKgEjpV2IuNpQKXFA4ORVXFYKSlJyc8fhSYouKwYpcUUtJsaQmKKdRU3LsUt5NIWJ602lrpsY3AnNNpaSmhNiUtJRTEVL6+W0XAG+VhlV7fU+1Uj5j+Hxq02rBJc4a3X5cc8KAD3GD06c57mlqt1GmpSiQsGyAMIT2A44qgZLUvuMcmR28t8D8MYrKSbsaJpGgl3IQGIjJ9TGD/MVUvZpJp1yV3sAudo6fMelJ9ri7+YB6mNh/SqtxcLJIyRoHwOSxG3+RzycU7WG5Nq1yz9nkx/rP/HBTWjeJGclTtGceXjNUCXBINqgPvH/9hT1dkIZrVVUHltuAP/HattdjFJ9zbsb2a3tUSNsKM4BHTk1K13JezwWtzd/ZoJnxJMONo4/z+HpWalxFHCu5iOSMEZOe4wKU3MTDDLIR/wBcm/wrJxT2N+bpc0xPFYXzW8TxX0SMVMmBnjjIbuOD6+gPFbFurX0W+zYQyKw3K5LKR378VyiXNvEp2hkHU/u2/wAK6PwxdRySyBWOCvBKkAnOOp96zmnGN0aU7SdmW3cxyGN9jMOvltuI99vX9DiljkWRN0bKy5xlTnmtKa0guARJGDznI4IPr9aoy6TIJC8UockYbzSQ2P8AfXB/PIqYYj+YqeH/AJRAacKyrrSryAFo7u6UdcSOzAf8CX+opsEuowMPM8u4h6FtwJX3JHIH1FbqpFmDpyT1RtA06q5m8tA0isqkZ3D5l/Mdvc4qVXVlDKwZT0IOQaV09h2a3H0E4pu6kJp2GmO8zHBphkOeKQmmmmog5MC2aFcqcikpKqyJuycTFjg0m3J4qIVPHOBjcob371FrbFb7jdnNKYmGMjANPLAsSOlTsQyr7UmxpFMgg4NSRNtcZ6UMqgkUwjaaNx7F7y/7pwO9V5RjORg/nTlucKARxUguEbhlBrLVM10aKeSDTgxqWWJAuU7npUOwjqDWl7mbTRbtpRsKsRntmnmUHOKoipFbAqeULk5lyfSnqqOOQKrZqSOTaealrsMR7aQMdoyPUU3DRNscEEVeVxgEGm3MXmqGA+YfqKlT1sx8vVD4bkBAJBgdjSyXvy4j4Pqaqu+Y41/uios0KK3E2TtMzjBIx7UwDNMB5qRBk1QtxwC9CMimMuDU2wMDtYAj170w46UrjcSKinEUmKdybCUUtFFxWEFLRShTQ2NISinbfaipuVyszqKlji3tjIH1qx9gYj5Pm4rqc0tzmUGynRipTGVYgjBHUGk4p819g5e5ERSYqXApdopcwKJxetf8heMf9NP/AGYU4xstu0pRtjTsobscBeKj11lTWl3MBiXuf9pTU4vYJNFRVmjLC6kYruGccY4rSLM2Vm5B4PQ9qzrfIglYHBCpg/8AbSrRuEeRyJBtVG79Tx/+qqsXFtNjuif+hmpkOJbjhjW3UKq52+ntUd1CiRZAG7DAn6qeKtJCosvM53EdO2Kguvmib15/9BaqexK3EJAvcHuW6+vy1bAqjJj7YcnH3sH8Vq3HKHQ5Khh1pRehUtxL04tJAP7mK1tHUb7Yetwv/o0ViTt5ltI3Yodorc0cEm0YAkfaByB/01qamxUNzT0a5n/tJLdpWeN4Gdg3J3B8A569Dj6AelN066Euuz2ypJHiNmYLKxVvmADAdj97OPao9GYDXFLEAC0ySTgDO0/41X0rI8UzgggFUQgjqC65/Q1wyirs7oyaSNwaukU80dwpjESb93qu7b2/CnKlnfIs0LKrE/LLEw6+xGQayIgReRDr/oafo61WkXytFuZ4iY5o7qZkdDgjJQfj9OlN0ezEq210bbWM8JJiYPzkFTtbPv1B/HmqyMbdnDxlN7bmBXbg/wAse+RSHUrmK+mtSU2eV5iSbSdnz7MFc89c8Yqay1Rp5pbe9SAiNVcTRHdG4JIBA/A/TFSnODKajNaD1YP0zkdQRg06pH0+KZQ9tIAO2DuU/j/+vFQNHd2/UCQdtwyPpnt9TW8a0XuYyoyWw7FGKjguhgLeYik5O7+A/jnj8cZq55ORkcg859a1U0Z8rK2KTFWzbNtyBxUZiIp8yYcrRBilFSGPFN20XABUoY460wJTwtSykIaQipAuaVkI6ilcqxFinKdtG00EY6igQ/zCaUOexqMCnCkUtR+Qww3P9KaUIGQc0Cng0h2I+9LipSA31pu0g4ouKwgLDgHipFnYDB5pPKY9BTWUqeQR9aWjDVDvN4IIHNNwOoNJijtRYNwp6tim0oFJjSJN1BJJzTaKkuw7FNxT1bB56UzNCIaDFAGTUsZGMHrTGGGNF+gW6gVHapI+tRZoyQaTRSaLe0UVW8xvWio5S7oprIobpip45yhDbiBnmqigE4JxT2XAwGHFdjSe5yJuxelZbmM7cAg9TVCSMrJtY4pu5l4BIFOMxZcMAaUYuOwnJS3GlSpBzmpFIYYqJunBpASOhqmriTsc/rEYGqXIIHVf/QRWcbdGBGW/DH+FaGsShdSm3HLEKf8Ax0VkQ3oaVUZgzMuSFXHlnuDSuVa+pOLdFxgnA6DC4/lVUKDczAjglOP+BGrhkXGeePaqajzJpeWG4pyOCPmNMlotiIeWIwz7QMYyP8KjnhUQOckkDjJ/D+tWAMADrimT/wCof6U7hZEYhWRW3D+NuwPf3ppsomIyOnsP8KdG4RpNzE5c4GOlOedVRiMkgZAxU3K5Rgsoh/Cv/fI/wrqPDdrAIZJBDHvDABtoyK5eG5V9wLA7Tjco4P8AP/OK6nw1PH9mmBbneO3tWNZ+7c3pQtOxS8val45HXTIyPpscfzFLpaf8VVekD7p3cezg/wBK0tTiih0mXYE8z7K8bOoxkCM4/Djp71FZ2ptvEl2xYN50LSDA6ZYcfrXPzppstwaaKkTyC+mIIJS1iC5Hq/fH0qBpd/hx2Kn99dyDjoP3gFXYoJhNdO8Mka+TAmWXHIck/kCOapoo/wCEas1JGWvjx3wZRzXRzJ7HPZr+vMtzLjX7mP8AiSADoR/y3X1qrpsarcasVAGVBOPd3q5MP+Klu+Mfuh/6VCqtgCZNWwcHykwff56hvcuK0RPZL5MloYyUL3F0jbSRlQXIB/EA1dg1SSK3uDO5bZdrAjFckBgmMgYzyxrPsXd3sN2CfNuyccZOW/xpkvOnXBxjOox9f+AUpJMqDaNOCaOW8E8g8rzbKGRtpIwWZvTnvU8lgZFzbXM6RkZAhl2jnnPpVBD++T0GnW//AKMqlDLMJsRzOm1LfbtPQFsMPxwPyqUn0Zo2tmX2fWLE4jn+0rn7s/XHtn/EVsWFwl/E7iJk2NtIYEHoD0P1x3HHWsq21K5byIblY5xIMFtu0583Z246H0pyXFlNKWWbyMbQGZtpyd3Gf+AnvTcn1EkuhttEmMFciqkkaqRimi6u7VQ0qi5gHO5R8231H979PqauTQbjlPypwlbcJRuUcHIAFPjwTyKlMbRkEjFIAvOF6/pW17mdrEoiHBFPkQMmPTvTEY46/hUv3xwaxd0zVWaIGAVTjrUe4EYYZqSSNvQn6VXzWq1M3oywsMbr8uQarkYJBp6SsnQ01m3NnGCaEmnqNtMTpThxSYpcUyRc0oc4xTcZpwjY9qWgakqSc81NNh4MjkjnioPs74yBTBuU8Egiosm7oq7tZjaWiirJsFLSUUgHUULjvS4xUlXYlJTsUYpiYCnE560AUu09hU3CwgAzzSEUtOUA5B796G7AMxRUvkn+8KKXMh2Zkhh3FOyD2plGa7WjjUh9JxTc0UWC4/IoGPWmiilYdzA1lFOpSHAPyr1+grP2oH4VQT7Vo6uMX591U/0/pVDyl8wPk8du2fWkO4bV/uj8qqJxdS/7y/8AoTVcY4UkkADuTVAsVnmZRk5XGf8AeNAM0Kjn/wBS/wBKrhpDzvJ9SpH+FI0jFHRsHjOe/wCNAXJ4wrZyMnJ7e5p2xP7opsbYjyf7zfzNVxqAKgiF8Hocj/Ggd7FpY4+iqvHYV0vhuGM28x2D7wrlraQSO2FZWXqrY/z2rrvDg/0SX3f+lYYi3Ib0G+YTxEix2Py5GVlzz1HlPUqJnxAVzgi07fVKi8RBzaSZUYWGVgQeT8u3n8WqeJ0k8T3BidXVbbGVOR1WuO3unTf3i8Y5B0cH6imSRebt8+CKXadylgDg+ozVigVka77mdNbQqzTJCY5pJI1aQLyQZVJ9uvNZun2vl3V/F5m95IIzucAc5f07cVv3IzDj/bj/APQ1rN07/kLXfvBF/wChSVrFvlZlJLmRXtNNubaS2LbJBF57MUbu+SAM49arz2sx051aFw0l8rhTjO0bTn9DXSFFPVQfwrP1hNtqjIzIQ/Y/7LevvTVSTeonTiloZ0UZlIUBif7MhPy9eHz/AEqiocT3Cg7WRbdeR0/eMOla+mAm6jx/0D4B+rU23tkuNU1BZU3cRPwcEHfKRVqdieS+pUt5G+2WgYLyyHK+89QxBR5+4gZnTr/uP/jWz/ZUYmhkV5B5RXhgDnEm/wDnxWfBayTecYgCVlRiCccbe1WqiZLhJFa0lltLS1SFyI5PODIOQcRpj8sV1RmKsfTNctNazRQWSyIY2jllY59Ni/4Gt3JDH0zWkUpakOTjoy+tyrcP0xUAkGeagIB6ZFNIPrVqCQue5dJQAZNSLMgXgjNZwBx0owfQ0nBMakaImBDAHn2qiWAbFIM+9IVPpTjFIJO5IGQg8kGpCgxuVwfbvVXafQ09MryRTaBF5PmUZ/KoWALHaMCmiU0GUms0mmW7WAHaenNSxyMTzUO45p8cgB5XNNoS0L8QzUMqL5jcUn2lR2oa5VscZrG0ky9CBhg0lTAIzHnNNkUfwj61pzEcvUYRnkcUbaTcBVhCjLzjNDdgSIcUCnTqUOV+7UHmMKaVxPQnFOABquJiKeJxnOKTiwTRKRipYmFV/tHHSmGbnilyNjukXJY1J3DjNRbSpqBpmbq1PSdu5zRytBdE2/60VH5poqeVlXKGwUmyn8UZrs1OSyGbKXbTs0tK7CyGbaNop9Jmi7HZGB4ghYyxmM7WeIgN6EH/AOvWaqlVAYliBgkjrWt4nQNYwE9RMACDg8q2f5D8q4+G2vLq5WG2M7SMBhVk6jAJPXp3J7UXIbszYliWWMo65U9aoXKiLe0m9FdsArg98iqJEg84fbXLRnA/ekh+f4T371GclwJXZl4b5mJFBNyZpICu3z5VBOeEqRJImcYllbP8OzrxUcpiS2zHsyx7DOeaqsSCpTKkL/DwQeaAN5Y2aDDDBySM9jnIqk1lc7FRfLG3+IO2SPy4rPM8+CRcS8Ef8tD/AI1Mj3BJAnmOMf8ALRqB3Rs28RSSVyqJvIwiEkKAMV12hq/9nEoQpLnkjNedRTz+aV8+Ugdt59DXS3UtzpkCRxahPDiIn5ZCAWB5ODmsaseZWN6MlF3OrmtXnK+d5bhegwR/noPyrM0Ri+pavcxqGEk+3P0JH9BWTYeKGsGjW8uJb8Two+VZcxMSwII/Kr83ie0trXNraOktwhdDtVQGI6tg89a5vZSWh0+1g9X0Oh82TvF+tL5zDrEwrgR4i1hWUC/YgjvGh/mtWIvEWrskzG8U+WoIHkR8ksB/d9zQ6EkCxMX0O0lmBVRtYEyR9R/tis3TZR/ad6SCCkUKHg8HDN/7MKybHxa4iYahE0ziTKtEFX5fQj1zUz63HbG9ltLO5F1MyuwnUFFwAOxzjFL2c1dB7WDakdL50f8Ae/MGs/WpCbIGMFwpZm29gI3xn8SKwh4tvgMm3tc/Rxn/AMeq9B4qtJ4kW5tJjKRlgiqyevBLA9KPYzTvYftoSVi9p8Zh1GWJvvQ2lvGcevz/AP1qTTDu1TUWXkBYkyPUbyR+orMh8SWK315NJFc4mMZX5FzgIBz83qT61PFr2nwySNGt07TyBiFUAg4C9z/s/rTcJa6CjOOmp0XeqGlgf6RxxvX/ANBFVl8Q2fmBZFuYRu2l5FXaOM84Y1Us9bsrNZA9xI7O5c+WhYAcAdfpUqErPQtzjfcv60q+UmBhisgGP901ddRvbjvWW13Z6w8PkzyO8bqdhQrxkE549Aa1OT1rekmlqZys3cbtFG0U6itibIbiiloxSCwlFLilxTCw2jGadikoCw3bRt96fiikFhm2l2+9O4pcUXHYZtpcU8CjbSuOw3FODMO9GKXFILCFcmlCUtOpXCyFBOOtIQDS0VJQ3YPSjYvoKWimFkN2L6UhjX0p+KMUXDlRH5S+lHlr6VJijFO4uVDNgop+KKLhyoolvcflSZz2H5Um0+ppMY7mus8+6H8/5FOw3+RUQPv+tGfelYLolwf8ikPHcflUe73pwNKxSaMrxHj7DFzn98O3+y1YmnBYrmG4S7WzubbcA5QMsqngdTwQDg+wFdPfWkd9AIptygMGBQgHPPt71nnw/aH/AJa3P4Mv/wATRYl6s5bVbZY7ki3k+0Ky7iyAcHJ444A9h61TuI2EpGxsbQMgH0rrbvQY0t2e3mnMi87SVOR3A464zXNvJKjMpcHBxnAoFYoeU2OIj/3waTPQBTn2FWWu5d5UMp/CmrI8fIK/988mkIrlWKAbTncMDH1qRZGjPyEgnsRVhbh1O4uu4juOlPF6/aRP8/jQA2ztHJaWTIByQMcnr/jW/wCIELSwMq7gkbk9OBlf8KxPtUpHGCewC9f1qxLe3N3g3EgQBdoO3aHXPBxz+dS1do0i0k0VCMuCcZz0HTtUxdvl3uSqjCg9qjZRkt5qdQQoDH0/2RVwzKBFHIqAxpghyTyT7A9gPzpklU/MwKgnAqWKTy0mRlOXVQMEdjmm7kU/6wfgKAVPO/Of9k0NDTtsB+63HXJremP7/Uj/ANMv6D/GsMoCpwJS3YCPj86tyXUrs8jMIvPBEi4wB7c/Spauy4OyB9pWy3EhSrAkDOPmNR2oUTnByqo+Ce42mkdd4AUu4QELhuO/+NIsTkL+7Zmx83B65/wphZsdMciPg7TGMEgjsB/SlhbbKjHorA/kadFaTlSTbsygADc/SrK2N1s3izXb67W/wo0tYdnuLdXUclu6rnc8gc8egAqG1BZJgpAJUDlsD7w7mrVtpVzeyAIsCYb+JiAT6d6tS+Hb2JEjl+zDaSQQASfrxyPrUaLQr3m7sseGEkjSd2jdUdU2kqQGHzdPzH51v7s1jw2ery4UX0QUcdF4H02U7+zNRY/Nqr/RYyv8iKd0Wk0jWzSjJ6Cs6LRLlz8+oXLjvh2/xqYaNEh+eSd/ZmpXHqXtjY6fpSY+lQpp9rFhhbgnrlmLfzNWC2ewoAaFPtRgnuKXNL+lO4CBWHoaUBvb9KMt6rRvI6lfzpDF2v6j86Xa397/AMephk+lAbNLUQ/JHVh+dOBHqKZShv8Ad/SgVx+R6Z/Gkz6fzpysfQfpSM6dutFh8wgye4/OnbD/ALP5imZz3H50oLAcMPwNIfMKBjsh+pp3b7kf5/8A16Z8x/8A10uDjt+YpDuO3HsF/CgFj1puSKXeP7i/rSGP2g9WIpNq54YfiKA6/wB0D8D/AI0u5R6fkaLCuGFA7H6YpuPQD8qXeOwU/hRv2nlF+mKAuPAXH+qJ/KgvjpCB9QP8KQSREfMqZ/3aXzYR/Ap+kY/xoEJ5h/55p/3yKKXzof8Anl/44tFAXXY45tctP+epP4Coz4gs16SAn8P8axGeBf4Ih9WT+hNILhexA/3dx/ktdPN5nJy+RsN4jh/hDt9AKYfEbH7sMh+i1m+epB4b6+U+f1YUwRRSdftD+xEY/oaOZ9A5TTPiG47Qt+IA/rTW1+6I4VF+sgP6VXNjFCqMUT5hkAtn+SijaM44HtiQ/wDswqee5XISNrd4ejgfRQf/AGWozqupN91m/GLH9KckUYkUSFlQkbiIQSB6jJNXm0eWCQLLK2CAyiKIYYH0IxRzPsHKu5mHUNT/AIrtV9htz+War4uWkZyWZmOSwgHP44rqf+EZedElRnCMo4JZv5tTG8NoOMMvv5Of60ue4+RHMTLLIhWRiQf72wf0FJa6bcTZFt5jAdTE+R+O3NdHJ4d2t+6uQ3tsxW1p+j28MceN8cmPmAbhqUpWQ4xVzh1spydplmPsGkP9Kf8A2RcsMgSgeu0n+bCu3l0RN2FUE/7Tk/1qnLo6If3pjQegwP1JpKTfUfJHscva6HPc8ozkKP4oiMfqall0A24BeCRsjIIyFP8A46P512mnzR2cHlxqmT/EZVP8qrXDv5rOWjBPcTHP6Ckm7hZWOTi0hpHC/ZcKf4tjN+m6rEejxqcdD/s2+P55rbdixBLD8Xc/zFNBLf8ALaID3kqrgiGw8O+bEz3DIEI+Vyu5gfx/+tUUuhWpbAvc+zBlX+dXCzIMiVQfVHb/AAqu5LHLOG/3mNJLUTY610XTVb986ONvTJHPrwKnk0zSYwfLUO3Yh3AqsrKvTaT9c1IJCQcKD+H/ANenyj5hv2G1UgqmCDn5Xb+pqxNc7mz5NuTjGTEOKqs7DooH6f1pMsecLj/eH+NPlXYXMyyl/LDzHHboe+xcZ/Knf2tcn73ln6//AK6qllxyB+JpgkTP+rz9Go07BzM0E1qVDzHGfzpJdakc58qL8QT/AFqkJIy+0QuTnGFf/wCtSO8MR2zQTIT03MP6ii0ewXZpWuoSzbgQvH90Yqz5znqKo2Ma7GkCERnjJYZP0Here1T0BoumPUlE7r0OKDIzdT+lNWAEZwxpWVVxgZ+ho0DUXI96XPuKhMZPIGKPKP8Ak0x6k25hyOc+lLvk6YbioQrdv50ZYdz+dIdyxic5xnj3pm2Q8/1qEg9s1JGGP8NGwLUf5UhGccfWjY46qPzp4U04A1HMVykYDf3f1pRuH8FPPHegOfU0XCweZ6xilBz/AAY/CpYwW5oc4OOKnmHyiBV6sopGlReBGP1/xphNJmgAM4P8IH0p6Op7Nn2P/wBam5p6t70NjSFZkA5Lfn/9aozJH2JpzYbqM03YvdaFYHcTzU9aaZV9acUQ+34Unlr6A07oWonmp60vmKe5o8pPQUeSD0xRdBqJvX1pdwNL9nI6fzpwjI/iP50XQ9Rm4UVLt/26KV0PU5yTSIoGwtkr+5AH8zSx2OOlpCn1K/0q75shJPlA57lKmiaQDO18egXAq9UYporJp4IxIuAeNqjIP4mmHTLctse0RQe+SCPyq7KYgPnUq1VPkDZAP5043YpNF9LGzhUYt1JAA3EEmmeShYtHEgHqRUQvNq4yTjs3NRM/mtlRt+goUGKU0OuWSIhgsLNnvxiozqE7qB5SMoPHzD/CoruGZ4vkBbB6EVUCXSuMwOQvQKDT5Rc5qPcvIql2kBxjCtn+WKjYNJgFrjGcZBaqRu5Y/vRlMdcnH9ail1AuSHcsMdDJijlsHMax01AC8gnVe5d9tQoiNlIy+PUSM2PyNYX2pZM7XaMA/wAWTn6cUM0zqAt24HoIzS5X1DmNl5JY/lKu6joXBP8AWqzzI5+dRn0OAf5VnbnQ5d2P1yKcL0BNhiR/ds07E8xpLcqBtSA49d5P8sCiR3BG1jH7msvz5OCEC59iP61bm8yTa0bEAA8GnyhzDzNKXwZg49//AK9KbmRO0R+oWqckk8Zw5I79am3BolIjkbavzMgOPxoYJlkXbEcwwH320C43jD20WPXO2qDuSPkSQD3qaG1uZo32QzbuNp2kA+vNJ2Q1d7ErJFyTH+UtRN5f8Kn/AL7BrSstHRIQ19uaRmwFD8KPw+nrUkUNhcefCbYKI5QBgYY/KDnPXvWTqpGqoyZkKxzgRk/TOamitLuVQ627Mp75A/nW7bW0FuD9ntgue7Hn9aLqV4kxjBZWwQehAzj+f5VLrX2NFQt8TMeLT5rl5IwoieJgG3vnGRkdBU40UOoZLrLA4OV9OtW7TDanfc7gyQuOwwVYf0qSwkJmvo8YEc/y/Qop/mTUOpIqNOJDBo8EUnmSF5X7cYUVZs1Eys7qu9WKhtozjgj+dWScDJ4qjprHyZMZPz9fwFTzNptmnKloie4xG6HGSR3PuKfsz2qpPIHuoUDBg4IyO3PNWml28Ln61rC9jKTVyRQV6/qaYV5qMSM54yfwqVElccRsT64rSzRN0IAKeAtPEUq8bW+mKQuw7mpuNWGOEA6cmoeKnNw+McfUjNM81vRP++RVoh7jQwHrTjMT6/nTSc9h+VRnNO1xXJwxxSlyDwc1XBI70Zo5R8xZEnrTgwNVM0oJHrScQ5jQRuOCKhduTUIdsYBNGCeTUctiuYdupdw96ZSZq0iOYk3j3/Kl3DsT+VQ04UWC7Jd596cr/UVEKdmpKuybf7tRvPqfxqHdRupWC5MJKcHFV80uT60uUdyYuO1AIPc/lUIJpwbAPrSsO5LtX1/Siodx/vGijlDmMqK8kUYaUHPZgatDUCkfEq57BUNUBGf4gAKcUVehrqcIs5FNoka7kc5Yg/VR/hTfPTHzRIT6jIphLAe30phYnjj8qrlQudilkJ6Y/GnDyyOc/nTBuB+U/kaU+YepP/fQptCTIbqJJFVEuEVuvzcYrNeGRWwJ4j7gkj9BVi8V2uNvmKMADDOB/WoNkiDJZceoYH+tQyxnlS/8/CfgT/hTRGR/y3j/AAzUjCMjlsk+g/8ArVVfyj90PycYJFFmS7FgLjrOo/OpkNoB8zF/on/16o7Y8YMJP4ikZYQeFYHI4J/+tSsFyZmIY+UyhfQhqaXnY/fUfTI/pSEQmDod3oF96jVExyzj/gP/ANenYROkbk/Owz681r22ly3Uau11sTGNoUk/nkVlQIDnEoAzwGBrp9LhLWS4lBAJ5WsqjcUb0oqT1GWumQWhLnM0m0LvkwcY9PT/AOtUlle/aklwgOx9uEOQOAefzpbueO0ljjkimkEgJymMAZAOcn3H51W0SI20+oW23aElBXp935gOnsornbbV2dKSTsi9HEIv9VBHF9AB/KpNrH7zflUmKMVmbXtsRSKMJ7P/AENUdKCi5vwoC/PGcD3iWr1ywVFyQPm/9lNUtNbbc3wAJO+Mf+Q1quhDu5GliqWpnEcfuX/9AarLSYJGcEDdtUZOPpWbfTCW3hl8uXDbwAVOVOMAnniktxy2sSWWRfT8HP2a3/k9OtiI7m8ZmChpV9+Sg4/SkjkEOpXhxnEcC/8AodUVl33N6dmd0kWM9sxD/GrUOZmblyo0TdAzxqiZDlfmc84PtVKOTCSA5wZZOBnsV7U6OZfPgynOUxjgDrTIdrGcHd8sso4B/wBmtFFIzcmwjcme27bVdv8Ax7FXi3vVZLXyollc7WClAp44LZ/OnrycZH4mtYa6mcrrRkoYg5BI+lSRviotpXuD9DmlDVbRKZbWXPeldwpAxVMMc8U47+pBqOUvn0LHnD/IpplQjnr7VX+akOaaiJyJzKvRQabnPaogTninfN3zRYVyQLn0pMYNIu7PU08e5oGAFSKg9vzpocD+L9KcLjAx8v8A3zSdwJVjWh1AGAD+VQmf0I/KmmQnuanlZTkOIHqaTFMzTqogeIyRnj86UJ7im72wBngUFiTknmlZjVh+33FAU0gkIo3+ppWZd0KVxTcmlVznrTiQTx07ZoJYwE/5FOJx9KcHUCo+WNIY7eAPem7s0hTFOSNmOBT0CzE3UVL9mf0/Wip5kVysyWRgeVJpA208j9KcEZ2wuaR0ZOprqOQbLMWGAcj3qHNWFBf+FPx4pjqF4IAP1pprYTV9SKilJHakFUSZd3/x9SH6fyFV85apbuRVuZcg8H+lQLIhblSD71Ohootq5MFz1/SokhhPHmHr3z/hUiup4yB+dRo0RYgHJz6H3pE2HeRCDyu73BIoZYUGUiIOR1cmnqVHYH602V1VclR1FADUIKDgd/508fQflUUZQZILcnOD2p/moOpPXFFxpNjxxXT6Gf8AQP8AgRrlxOgPGfyrpdFk3WOc4+Y1hXa5TegveF1npGf9h/8A0KOn2mBql8c9Qh/V6NS3SQBRk5ZRn6ugqKGRIr++eQ4SONGYgZwMvXLduJ1cqUtTSMgHAyT7Up3kdAo96zH1lFikaOFxsfYd2M/dzmqz38s1xp7B2VZSrFcjuDTjTk9yXVitEak6742GMsmT8w/2Tg1mRSsovyCyf6QM7BzgQgge3IqvphympZ5xGf8A0CSnWzBodQPJH2hehwf9VWihZmbqcyLFsZdkeWzi0DEsepz15qpczSppVnumO4s2SHJ3ABu4qZpMeYFUKBYHvk9cdaoyozaXYqFOf3xxjnp/9ersSnqadwf+Jhfewh/k9VYWAmnBIAMsA5/65irhiM2qXyg4z5fOPZv8akMdtYF3yd7gZA6nAwKlO2iLcb6shjtZSY2OF2heD1yM09HitzIY1DMzFiR3b/HpVWW8lmYqnyL2A5J/z+VTRIVT5hgk9OuB2FaKDfxGbml8IjbpHDyHJHQDt/n/ADnrUqcmnJCXIAqcQpF1cE+g5rXRaIy1erEES4z5gHtg/wCFL5ZxweKRdu6p2cDgYqXcaK5FBNOLY5xTB8zYoGhMmpEAPXNSeSq+9LhV5OBU81zRQY0xrn72B9KRlVRw6mmPJk8dKj61SRm2SEgUmT605I2dSVGQOtBQjrQIbS4oA5qzEgHJHNJuw0rkaQ5A3HGalkgWJclsk+lThc4FV7p90gUdFqE22VshvyKvQ5qMkmpZCowB6c8VFVoTYqkg09RmkUDvUiAA/eGfakxJgEJpNpI4Bp5bIwM49KYxOf8A69LUdxSjKMkED3phakJyc96SmkJsM0qvtNNNFPcSdh7SbjzU8bqBzVWlDEd6lxuXGdi1559aKq7qKnkRfONVB1pJQobG0UUVfUz6DCccAAfhVdzuPPPNFFaRIZHgelOAA6UUVRBkXUStPITnljUAhQc4oopDLMMURxuiU/XNZjSFHJAH3sYx7UUUIGTo5cZOKV2IQH3FFFV0EKsasgJHJpfKQ9R+tFFIaJEgjH8P6muj0ZFWyGAB85oornxHwnRQfvD9QcmIdivksCPUyLmsTTHZ7PUCzEk2wOScnq/+NFFQl7v3Fv4yPP8AoNxnn/SR1/3KEY+bpI7bF/8AZqKK3f8Amc3/AACawbLapgADyyMD/rk9RWLE2F8T1NwP/QDRRSe7KjsvQtW3zXCpkjNmBkHB5NakFrFDAiKv3QcMeWGTzg9e9FFYVGdNJFRpGilvJEwG3ov6f/XpiqJF3PlmJOSep59aKK6IfCc837xKgCDCALkdhUiuR7/jRRVPYgmzhc+tQEnNFFKI5CA07cRzmiiqJDcfU1NAcnmiiolsaQ3JXcg4FQOM5JJz9aKKUSpDAM0u0UUVZmX7dAISahm4bFFFZLcp7Eaj5hU4YhSfQUUU2JFc3MoPDD8qegBQseSTRRT6AtyzDGpxkZzUlxaxpGWUHNFFZN6l20KzoFxjNR96KK1RmTBABmoyaKKQ2GAV6c0yiihiCkoopiCloooGJRRRQB//2Q==') no-repeat center;
                    background-size: cover;
                    filter: blur(14px);
                }
                .${medalID}::after {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    z-index: -1;
                    background: var(--bg-primary);
                }
                .${medalID} a {
                    color: var(--color-a);
                }
                .${medalID} a:hover {
                    color: var(--color-a-hover);
                }
                .${medalID} .medal-header {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    justify-content: center;
                }
                .${medalID} .medal-title {
                    font-weight: 600;
                    display: flex;
                    align-items: flex-end;
                    padding-left: 4px;
                    line-height: 1;
                    font-size: 16px;
                    padding-bottom: 4px;
                }
                .${medalID} .medal-name {
                    margin: 0 12px 0 6px;
                }
                .${medalID} .medal-type {
                    background: var(--bg-type);
                    border-radius: 3px;
                    padding: 2px 8px;
                    font-size: 15px;
                }
                .${medalID} .level-img img {
                    vertical-align: middle;
                    object-fit: contain;
                    height: 43px;
                }
                .${medalID} .level-img {
                    height: 43px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }
                .${medalID} .level-img.none {
                    filter: grayscale(100%);
                }
                .${medalID} .medal-floats.total{
                    font-weight: 600;
                    color: var(--text-secondary);
                }
                .${medalID} .medal-replay {
                    color: var(--text-replay);
                }
                .${medalID} .medal-post {
                    color: var(--text-post);
                }
                .${medalID} .medal-upgrade {
                    color: var(--text-update);
                }
                .${medalID} .medal-list-container{
                    padding: 4px 0 4px 4px;
                    margin: 4px 0;
                    border-top: 1px solid var(--color-border);
                    border-bottom: 1px solid var(--color-border);
                }
                .${medalID} .medal-list {
                    display: grid;
                    grid-template-columns: max-content max-content max-content max-content max-content auto;
                    gap: 6px 4px;
                    align-items: center;
                    max-height: 370px;
                    overflow: auto;
                    padding-right: 8px;
                }
                .${medalID} .medal-list::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .${medalID} .medal-list::-webkit-scrollbar-thumb {
                    border-radius: 5px;
                    background: var(--bg-scrollbar-thumb);
                }
                .${medalID} .medal-list::-webkit-scrollbar-track {
                    border-radius: 5px;
                    background: var(--bg-scrollbar-track);
                }
                .${medalID} .medal-list::-webkit-scrollbar-corner {
                    background: var(--bg-scrollbar-track);
                }
                .${medalID} .medal-list::-webkit-scrollbar-thumb:hover {
                    background-color: var(--bg-scrollbar-thumb-hover);
                }
                @supports (scrollbar-width: thin) and (not selector(::-webkit-scrollbar-thumb)) {
                    .${medalID} .medal-list {
                        scrollbar-color: var(--bg-scrollbar-thumb) var(--bg-scrollbar-track); ;
                    }
                }
                .${medalID} .medal-floats svg{
                    width: 15px;
                    height: 15px;
                    vertical-align: text-bottom;
                    margin: 0 2px;
                    display: inline-block;
                }
                .${medalID} .medal-raw{
                    gap: 6px;
                    display: flex;
                    white-space: nowrap;
                }
                .${medalID} .medal-rate{
                    color: var(--text-rate);
                    padding: 0 2px;
                }
                .${medalID} .medal-cost-count{
                    color: var(--text-secondary);
                }
                .${medalID} .medal-level-name {
                    display: flex;
                    justify-content: space-between;
                    padding: 0 4px;
                }
                .medal-level-name span:first-child {
                    margin-left: -8px;
                }
                .medal-level-name span:last-child {
                    margin-right: -8px;
                }
            `;
            const style = document.createElement('style');
            style.id = `${medalID}-style`
            style.innerHTML = css;
            document.head.appendChild(style);
            document.body.appendChild(this.el);

            this.el.addEventListener('mouseenter', () => { clearTimeout(this._hideTimer); });
            this.el.addEventListener('mouseleave', () => {
                if (this._hideTimerLock) return
                this._hideTimer = setTimeout(() => {
                    this.hide();
                }, 250);
            });
        }

        generateTemplate(item) {
            const noText = item?.no ? `<span style="font-size:18px">No.</span><span class="medal-no">${item.no}</span >` : '';
            const typeText = item?.type ? `<span class="medal-type">${item.type}</span>` : '';
            const nameText = item?.name ? `<span class="medal-name">${item.name}</span>` : '';
            const backstoryText = item?.backstory ? `<span class="medal-backstory">【背景故事】${item.backstory}</span>` : ''
            const tidText = (item?.date && item?.url_tid)
                ? `<span class="medal-create">【创建时间】<a href="/thread-${item.url_tid}-1-1.html" target="_blank">${item.date}（前往博物馆）</a></span>`
                : (item?.date ? `<span class="medal-create">【创建时间】${item.date}</span>` : '');
            const buyLimitText = (item?.buy_limit && item?.buy_limit !== '无') ? `<span class="medal-buyLimit">【购买条件】${item.buy_limit}</span>` : '';
            const priceText = item?.price ? `<span class="medal-price">【商店售价】${item.price}</span>` : '';
            const durationText = item?.duration ? `<span class="medal-duration">【持续时间】${item.duration}</span>` : '';
            // 处理item.levels内容，加上img和回帖概率以小数显示
            const levelsALLHTML = this.convertFunc.AllToHTML(item?.levels, (this.showImg ? item?.levels_img_local : ''), item?.price)

            return `<div class="medal-header"><div class="medal-title">${noText}${nameText}<span style="flex-grow:1"></span>${typeText}</div>${tidText}${backstoryText}${buyLimitText}${priceText}${durationText}</div> ${levelsALLHTML}`;
        }

        // 后台下载图片，完成后缓存
        async _backgroundDownloadAndCache(src) {
            try {
                const saveResult = await this.localFile.saveFile(src);
                if (saveResult?.blobData) {
                    const newUrl = URL.createObjectURL(saveResult.blobData);
                    this.localFile.cache.add(saveResult.fileName, newUrl);
                }
            } catch (err) {
                if (err.name === 'NotAllowedError') console.error("写入本地权限丢失");
                if (err.name === 'NotFoundError') console.error("无法找到文件夹，请确认文件夹是否移动或者重命名！");
            }
        }
        // 获取本地图片，有返回blob，没有直接返回原src（开启后台下载图片）
        async getLocalImg(imgsObj) {
            if (!imgsObj) return {};
            if (!this.getShowImgStatus()) return {};

            // 如果未开启本地图片功能，直接返回原网络数据
            if (!this.getLocalImgStatus()) return imgsObj;

            // 校验授权，失败直接返回原图
            if (!(await this.localFile.verify())) {
                console.warn("未获得本地文件系统授权，跳过存储");
                return imgsObj;
            }

            const entries = Object.entries(imgsObj);
            const downloadLock = new Map(); // 用于多张图指向同一 src 时，防止重复触发后台下载

            const processedEntries = await Promise.all(
                entries.map(([key, [src, width]]) =>
                    limit(async () => {
                        if (!src) return [key, ["", width]];

                        try {
                            // 尝试读取本地缓存/本地文件
                            let localSrc = await this.localFile.getFile(src);
                            if (localSrc) {
                                // 本地有，直接返回 Blob URL
                                return [key, [localSrc, width]];
                            }
                        } catch (err) {
                            if (err.name === 'NotAllowedError') console.error("获取本地文件权限丢失");
                        }

                        // 本地没有缓存，不等待下载，直接准备返回原网络 src
                        // 为了防止并行的请求同时去下载同一个 src，用 lock 锁一下后台任务
                        if (!downloadLock.has(src)) {
                            // 触发后台下载
                            const bgTask = this._backgroundDownloadAndCache(src);
                            downloadLock.set(src, bgTask);
                        }

                        // 立刻返回原网络 src，混合加载，不阻塞渲染
                        return [key, [src, width]];
                    })
                )
            );

            downloadLock.clear();
            return Object.fromEntries(processedEntries);
        }
        /**
         * 显示放大镜面板
         * @param {*} targetEL 目标节点
         * @param {string} type 数据的类型，name 或者 item
         * @param {array} typeValue 数据，type=name进行this.medalData查询；type=item时候直接使用此数据
         * @param {boolean} position 定位方式，普通左侧/上下定位、排行榜定位、补货日志定位
         * @returns
         */
        async show(targetEL, type = "name", typeValue, position = "default") {
            this.showImg = this.getShowImgStatus() ?? false;
            if (!this.getMagnifierStatus()) return;
            if (position === "saltfish" && (!(await this.localFile.verify()) || !this.getLocalImgStatus())) this.showImg = false; // 跨域问题无法显示图片

            this.el.setAttribute('data-theme', this.getMagnifierTheme());

            let items
            if (type === "name") {
                items = this.medalData.filter(m => m.name === typeValue);
                if (items.length === 0) return;
            } else {
                items = typeValue
            }

            // 立即清理旧的副面板
            this.removeSubMedals();

            // 渲染并定位主勋章
            items[0].levels_img_local = await this.getLocalImg(items[0].levels_img);

            this.el.innerHTML = this.generateTemplate(items[0]);
            this.el.style.display = 'block';
            this.el.style.visibility = 'hidden';


            // 调用对应的定位方法
            switch (position) {
                case 'default':
                    this.getPositionMode() === 'left'
                        ? this.positionLeft(targetEL)
                        : this.positionTop(targetEL);
                    break;
                case 'rank':
                    this.positionRank(targetEL);
                    break;
                case 'saltfish':
                    this.positionSaltfish(targetEL);
                    break;
            }

            this.el.style.visibility = 'visible';
            this.el.style.opacity = '1';

            //  处理后续子勋章
            if (items.length > 1) {
                let lastRect = this.el.getBoundingClientRect();
                const spacing = 5;

                for (let i = 1; i < items.length; i++) {
                    const subEl = document.createElement('div');
                    subEl.className = this.el.className;
                    subEl.classList.add('medal-sub-panel-extra');
                    subEl.setAttribute('data-theme', this.getMagnifierTheme());
                    items[i].levels_img_local = await this.getLocalImg(items[i].levels_img);
                    subEl.innerHTML = this.generateTemplate(items[i]);

                    //  预渲染以获取高度
                    Object.assign(subEl.style, {
                        position: 'fixed',
                        left: '-9999px',
                        top: '0',
                        display: 'block',
                        visibility: 'hidden',
                        opacity: '0',
                    });

                    document.body.appendChild(subEl);

                    const subHeight = subEl.offsetHeight;
                    const windowHeight = window.innerHeight;

                    // 计算定位（默认下方）
                    let topPos = lastRect.bottom + spacing;

                    // 防溢出检测
                    if (topPos + subHeight > windowHeight) {
                        // 下方放不下，尝试往上放
                        topPos = lastRect.top - subHeight - spacing - 10;
                    }
                    let side = "left";
                    if (document.querySelector('#rank-info-window').getBoundingClientRect().left > windowHeight / 2) side = "right";
                    let left
                    if (side === "left") left = lastRect.left + 'px';
                    else { left = (lastRect.right - subEl.offsetWidth) + 'px'; }
                    // 最终应用正确位置
                    Object.assign(subEl.style, {
                        left: left,
                        top: topPos + 'px',
                        visibility: 'visible',
                        zIndex: '10000',
                        opacity: '1',
                    });

                    // 更新参考坐标
                    lastRect = subEl.getBoundingClientRect();

                    subEl.addEventListener('mouseenter', () => { clearTimeout(this._hideTimer); });
                    subEl.addEventListener('mouseleave', () => {
                        if (this._hideTimerLock) return
                        this._hideTimer = setTimeout(() => {
                            this.hide();
                        }, 250);
                    });
                }
            }
        }

        // 清理副面板方法
        removeSubMedals() {
            const extras = document.querySelectorAll('.medal-sub-panel-extra');
            extras.forEach(el => el.remove());
        }
        // 隐藏放大镜面板
        hide() {
            if (!this.el) return;
            this.el.style.opacity = '0';
            this.el.style.display = 'none';
            this.removeSubMedals();
        }
        // 定位放大镜，上下定位
        positionTop(target) {
            const rect = target.getBoundingClientRect(); // 获取目标相对于窗口的坐标
            const elWidth = this.el.offsetWidth;
            const elHeight = this.el.offsetHeight;
            const vWidth = window.innerWidth;   // 视口宽度
            const vHeight = window.innerHeight; // 视口高度

            let left = rect.left + (rect.width / 2) - (elWidth / 2);

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

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';

        }
        // 定位放大镜，左侧定位
        positionLeft(img) {
            const labels = document.querySelectorAll(".MyshowTip2");

            labels.forEach(label => {
                if (label.style.display !== 'none') {

                    this.el.style.width = '';
                    // 获取放大镜的高度、宽度
                    let h = this.el.offsetHeight;
                    const w = this.el.offsetWidth;

                    const labelRect = label.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;

                    let left = labelRect.left - w - 1;
                    if (left < 0) {
                        left = 2;
                        this.el.style.width = labelRect.left - 4 + "px";
                        // 重新获取放大镜的高度(包含滚动条)
                        h = this.el.offsetHeight
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
                    this.el.style.top = top + 'px';
                    this.el.style.left = left + 'px';
                }
            });
            this.medalListAddListener();

        }
        // 定位放大镜，排行榜定位
        positionRank(target) {
            const rect = target.getBoundingClientRect(); // 获取目标相对于窗口的坐标

            const w = document.querySelector('#rank-info-window').getBoundingClientRect().width; // 标题栏的宽度

            const elWidth = this.el.offsetWidth;
            const elHeight = this.el.offsetHeight;
            const vWidth = window.innerWidth;   // 视口宽度
            const vHeight = window.innerHeight; // 视口高度

            let side = "left";
            if (rect.left > vWidth / 2) side = "right";
            let left
            if (side === "left") left = rect.left + w + 8;
            else left = rect.left - elWidth - 8;

            let top = rect.top + rect.height - elHeight;

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

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';

        }
        // 定位放大镜，补货日志定位
        positionSaltfish(target) {
            const rect = target.getBoundingClientRect(); // 获取目标相对于窗口的坐标

            const w = rect.width; // 标题栏的宽度

            const elWidth = this.el.offsetWidth;
            const elHeight = this.el.offsetHeight;
            const vWidth = window.innerWidth;   // 视口宽度
            const vHeight = window.innerHeight; // 视口高度

            let side = "left";
            if (rect.left > vWidth / 2) side = "right";
            let left
            if (side === "left") left = rect.left + w + 12;
            else left = rect.left - elWidth - 8;

            let top = rect.top + rect.height - elHeight;

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

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';
        }
        /**
         * medalList添加横向滚动监听
         */
        medalListAddListener = () => {
            const medalList = document.querySelector('.medal-list');
            if (!medalList) return;
            this.handleWheel = (e) => {
                // 判断条件：X轴可滚动 且 Y轴不可滚动
                const canScrollX = medalList.scrollWidth > medalList.clientWidth;
                const canScrollY = medalList.scrollHeight > medalList.clientHeight;

                if (canScrollX && !canScrollY) {
                    // 只有当用户在垂直滚动(deltaY)时，才将其转为水平滚动
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                        e.preventDefault();
                        medalList.scrollLeft += e.deltaY * 0.8;
                    }
                }
            };
            medalList.removeEventListener('wheel', this.handleWheel);
            // 绑定
            medalList.addEventListener('wheel', this.handleWheel, { passive: false });
        }
        /**
         * 获取this.medalData this.medalDataNoTid的查询结果
         * @param {string} name - 当前需要查询匹配的关键字
         * @returns 返回数组或者null
         */
        getMatchedItem = (name) => {

            if (!name) return null;

            // 第一次运行或 Map 为空时，初始化索引
            if (!this.medalMap) {
                this.medalMap = new Map();
                for (const item of this.medalData) {
                    const n = this.utilFunc.name_cleansing(item.name)
                    // 如果 Map 中还没有这个名字，初始化一个空数组
                    if (!this.medalMap.has(n)) {
                        this.medalMap.set(n, []);
                    }
                    // 将具有相同名字的数据项推入数组
                    this.medalMap.get(n).push(item);
                }
                for (const item of this.medalDataNoTid) {
                    const n = this.utilFunc.name_cleansing(item.name)
                    // 如果 Map 中还没有这个名字，初始化一个空数组
                    if (!this.medalMap.has(n)) {
                        this.medalMap.set(n, []);
                    }
                    // 将具有相同名字的数据项推入数组
                    this.medalMap.get(n).push(item);
                }
            }

            // 获取查询关键字的变体
            const variants = this.utilFunc.name_variants(name);

            // 查询逻辑
            for (const v of variants) {
                if (this.medalMap.has(v)) return this.medalMap.get(v);
            }

            return null;
        };
        /**
         * 事件代理监听 通用方法
         */
        initAllBindListen() {
            // 配置驱动
            this.bindConfigs = [
                {
                    type: "default",
                    container: "#ct.wodexunzhang",
                    target: ".myimg img",
                    delay: 50,
                    touchDelay: 350,
                    getId: (el) => el.getAttribute('alt')
                },
                {
                    type: "rank",
                    container: "#rank-info-scroll.clusterize-scroll",
                    target: ".rank-info-row",
                    delay: 250,
                    getId: (el) => el.querySelector('.rank-info-name')?.textContent?.trim()
                },
                {
                    type: "saltfish",
                    container: ".el-table__body-wrapper",
                    target: "tr.el-table__row td:first-child",
                    delay: 250,
                    getId: (el) => el.querySelector('.cell div')?.title?.trim()
                }
            ];

            // 动态生成全局点击过滤的选择器串
            const allTargetsSelector = this.bindConfigs.map(c => c.target).join(', ');

            // 遍历配置并绑定逻辑
            this.bindConfigs.forEach(conf => {
                const tryBind = () => {
                    const container = document.querySelector(conf.container);
                    if (!container) return false;

                    let hoverTimer = null;

                    // pointerover 移入逻辑
                    container.addEventListener('pointerover', (event) => {

                        const targetEl = event.target.closest(conf.target);
                        if (!targetEl || (event.relatedTarget && targetEl.contains(event.relatedTarget))) return;

                        clearTimeout(hoverTimer);
                        clearTimeout(this._hideTimer);
                        this._hideTimerLock = true;

                        const delay = event.pointerType === 'touch' ? (conf.touchDelay ?? 350) : (conf.delay ?? 200);
                        hoverTimer = setTimeout(() => {
                            const txt = conf.getId(targetEl);
                            if (!txt) return;

                            const matchedItem = this.getMatchedItem(txt);
                            if (matchedItem) this.show(targetEl, "item", matchedItem, conf.type);
                            else { this.hide(); this._hideTimerLock = false; }
                        }, delay);
                    });

                    // pointerout 移出逻辑
                    container.addEventListener('pointerout', (event) => {
                        if (event.pointerType === 'touch') return;

                        const targetEl = event.target.closest(conf.target);
                        if (targetEl && (!event.relatedTarget || !targetEl.contains(event.relatedTarget))) {
                            clearTimeout(hoverTimer);
                            clearTimeout(this._hideTimer);
                            this._hideTimerLock = false;

                            this._hideTimer = setTimeout(() => {
                                // 确保鼠标既不在触发源上，也不在提示框上
                                const isHoveringTooltip = this.el && this.el.matches(':hover');
                                const isHoveringTarget = targetEl.matches(':hover');
                                if (!isHoveringTooltip && !isHoveringTarget) this.hide();
                            }, 400);
                        }
                    });

                    // 移动端点击页面关闭
                    if (!this._hasGlobalClick) {
                        document.addEventListener('click', (event) => {
                            if (event.pointerType !== 'touch') return;

                            const isClickTrigger = event.target.closest(allTargetsSelector);
                            const isClickTooltip = this.el && this.el.contains(event.target);

                            if (!isClickTrigger && !isClickTooltip) {
                                clearTimeout(hoverTimer);
                                this._hideTimerLock = false;
                                this.hide();
                            }
                        });
                        this._hasGlobalClick = true;
                    }
                    return true;
                };

                // 执行绑定，若失败则启动观察器
                if (!tryBind()) {
                    const observer = new MutationObserver((mutations, obs) => {
                        if (document.querySelector(conf.container)) {
                            if (tryBind()) obs.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            });
        }
        GM_registerMenu() {
            GM_registerMenuCommand("控制面板", () => {
                this.controlPanelObj.show();
            }, "h");
        }
    }


    const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
            obs.disconnect();

            const managerRef = { instance: null };
            // 工具函数
            const u = util(managerRef)
            // 解析函数
            const convertLEVELS = createConvertLEVELS(u);
            // 本地文件系统
            const localFileObj = new LocalFileSystem(u);

            // Toast提示组件
            const myToast = new ToastManager();
            //  控制面板组件
            const controlPanel = new ControlPanel({
                toastInstance: myToast,
                storageKey: 'ULTRA_CONFIG_V3',
                localFile: localFileObj,
            });

            managerRef.instance = controlPanel;

            // 放大镜
            const app = new MedalMagnifier(medalData, medalDataNoTid, u, convertLEVELS, localFileObj, controlPanel);
            console.log("控制面板已成功启动！")
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
