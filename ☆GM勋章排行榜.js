// ==UserScript==
// @name         GM-勋章排行榜
// @namespace    http://tampermonkey.net/
// @version      2.7.1
// @description  GM-勋章排行榜+收藏统计
// @author       Gemini+Codex+哈哈哈哈_
// @match        *://*.gamemale.com/*
// @exclude      *://*.gamemale.com/space-uid-*.html*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamemale.com
// @require      https://cdn.jsdmirror.cn/npm/clusterize.js@0.18.1/clusterize.min.js
// ==/UserScript==

// https://cdn.jsdelivr.net/npm/clusterize.js@0.18.1/clusterize.min.js
// https://cdn.jsdmirror.cn/npm/clusterize.js@0.18.1/clusterize.min.js

(function () {
    'use strict';
    const Config = Object.freeze({
        DEFAULT_WEIGHT_MAP: { '金币': 1, '血液': 1, '旅程': 30, '咒术': 5, '知识': 50, '灵魂': 1000, '堕落': 1 },
        DEFAULT_WEIGHT_MAP_1: { '金币': 1, '血液': 1, '旅程': 1, '咒术': 1, '知识': 1, '灵魂': 1, '堕落': 1 },
        LIMITS: {
            "游戏男从": 11, "真人男从": 8, "女从": 5, "装备": 12, "资产": 16, "宠物": 7, "场景&版块": 5, "天赋": 4, "储蓄": 1, "装饰": 6, "薪俸与其他": 1, "职业": 1,
        },
        TYPE_SORT_RULE_PRIMARY: ['游戏男从', '真人男从', '女从', '装备', '资产', '宠物', '场景&版块'],
        TYPE_SORT_RULE_SECONDARY: ['赠礼', '咒术', '天赋造诣', '天赋'],
        TYPE_SORT_RULE_TERTIARY: ['奖品', '剧情', '故事', '储蓄', '薪俸与其他', '职业', '装饰/特殊'],
        ICONS: {
            toolSVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21q-.425 0-.712-.288T2 20V10q0-.425.288-.712T3 9h3.5q.425 0 .713.288T7.5 10v10q0 .425-.288.713T6.5 21zm7.25 0q-.425 0-.712-.288T9.25 20V4q0-.425.288-.712T10.25 3h3.5q.425 0 .713.288T14.75 4v16q0 .425-.288.713T13.75 21zm7.25 0q-.425 0-.712-.288T16.5 20v-8q0-.425.288-.712T17.5 11H21q.425 0 .713.288T22 12v8q0 .425-.288.713T21 21z"/></svg>`,
            settingSVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></g></svg>`,
            loveUnChecked: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11.288 20.2q-.363-.125-.638-.4l-1.725-1.575q-2.65-2.425-4.787-4.812T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.325 0 2.5.562t2 1.538q.825-.975 2-1.537t2.5-.563q2.35 0 3.925 1.575T22 8.15q0 2.875-2.125 5.275T15.05 18.25l-1.7 1.55q-.275.275-.637.4t-.713.125t-.712-.125M11.05 6.75q-.725-1.025-1.55-1.562t-2-.538q-1.5 0-2.5 1t-1 2.5q0 1.3.925 2.763t2.213 2.837t2.65 2.575T12 18.3q.85-.775 2.213-1.975t2.65-2.575t2.212-2.837T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2 .538T12.95 6.75q-.175.25-.425.375T12 7.25t-.525-.125t-.425-.375m.95 4.725"/></svg>`,
            loveChecked: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11.288 20.2q-.363-.125-.638-.4l-1.725-1.575q-2.65-2.425-4.787-4.812T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.325 0 2.5.562t2 1.538q.825-.975 2-1.537t2.5-.563q2.35 0 3.925 1.575T22 8.15q0 2.875-2.125 5.275T15.05 18.25l-1.7 1.55q-.275.275-.637.4t-.713.125t-.712-.125"/></svg>`,
            '重置': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2v2a8 8 0 1 0 5.135 1.865L15 8V2h6l-2.447 2.447A9.98 9.98 0 0 1 22 12"/></svg>`,
            '筛选': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15 19.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0L9.29 16.7a.99.99 0 0 1-.29-.83v-5.12L4.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L15 10.75zM7.04 5L11 10.06v5.52l2 2v-7.53L16.96 5z"/></svg>`,
            '统计': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.187 4.14c-.964-.723-2.345-.07-2.398 1.134L9.712 7H12a1 1 0 1 1 0 2H9.623l-.393 8.85c-.13 2.931-3.593 4.41-5.801 2.479l-.087-.076a1 1 0 0 1 1.317-1.506l.087.076c.946.829 2.43.194 2.486-1.062L7.622 9H6a1 1 0 0 1 0-2h1.71l.08-1.815c.126-2.81 3.347-4.332 5.597-2.645l.213.16a1 1 0 1 1-1.2 1.6zm.895 8.906a.5.5 0 0 1 .693.225l.813 1.727l-3.295 3.295a1 1 0 0 0 1.414 1.414l2.786-2.786l.78 1.657a2.5 2.5 0 0 0 3.853.864l.51-.42a1 1 0 1 0-1.272-1.543l-.51.42a.5.5 0 0 1-.771-.172l-1.087-2.309l2.711-2.711a1 1 0 1 0-1.414-1.414l-2.202 2.202l-.506-1.075a2.5 2.5 0 0 0-3.467-1.126l-.6.33a1 1 0 0 0 .964 1.752z"/></svg>`,

        },
        GLOBAL_THEME: `
            :host {
                --primary-color: #306298;
                --primary-light: #ecf5ff;
                --text-main: #303133;
                --text-sub: #848587;
                --text-light: #ffffff;
                --bg-panel: #fff;
                --bg-primary: #d1d1d1;
                --bg-secondary: #969696;
                --color-success: #04d631;
                --color-warning: #ff4040;
            }
        `,
        DEFAULT_THEME_MODE: 'light',
        HOVER_DELAY: 220,
        SEARCH_INPUT_DEBOUNCE_MS: 200,
        MEDAL_DETAIL_SELECTOR: '#medal-container-detail',
        THEME_SET: new Set(['light', 'dark']),
        STORAGE_KEYS: {
            appState: 'RankBoardAppStateV2',
            favoriteState: 'Favorite',
            theme: 'Theme'
        },
        ATTRIBUTE_ITEMS: [
            { label: '金币', default: true },
            { label: '血液', default: true },
            { label: '咒术', default: true },
            { label: '旅程', default: true },
            { label: '知识', default: true },
            { label: '灵魂', default: true },
            { label: '堕落' }
        ],
        ATTRIBUTE_KEYS: ['金币', '血液', '咒术', '旅程', '知识', '灵魂', '堕落']
    });
    const Util = {
        isPlainObject(value) {
            return !!value && typeof value === 'object' && !Array.isArray(value);
        },
        /**
         * 转义 HTML
         * @param {string} str 对HTML文本中的特殊符号进行转义
         * @returns
         */
        escapeHTML(str) {
            return String(str ?? '').replace(/[&<>"']/g, (ch) => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[ch]));
        },
        /** 类别按照指定顺序排序 */
        sortTypesByRules(types = []) {
            const primaryMap = new Map(Config.TYPE_SORT_RULE_PRIMARY.map((type, index) => [type, index]));
            const secondaryMap = new Map(Config.TYPE_SORT_RULE_SECONDARY.map((type, index) => [type, index]));
            return [...types].sort((a, b) => {
                const aInPrimary = primaryMap.has(a);
                const bInPrimary = primaryMap.has(b);
                if (aInPrimary || bInPrimary) {
                    if (aInPrimary && bInPrimary) return primaryMap.get(a) - primaryMap.get(b);
                    return aInPrimary ? -1 : 1;
                }

                const aInSecondary = secondaryMap.has(a);
                const bInSecondary = secondaryMap.has(b);
                if (aInSecondary || bInSecondary) {
                    if (aInSecondary && bInSecondary) return secondaryMap.get(a) - secondaryMap.get(b);
                    return aInSecondary ? -1 : 1;
                }

                const tertiaryMap = new Map(Config.TYPE_SORT_RULE_TERTIARY.map((type, index) => [type, index]));
                const aInTertiary = tertiaryMap.has(a);
                const bInTertiary = tertiaryMap.has(b);
                if (aInTertiary || bInTertiary) {
                    if (aInTertiary && bInTertiary) return tertiaryMap.get(a) - tertiaryMap.get(b);
                    return aInTertiary ? -1 : 1;
                }

                return String(a).localeCompare(String(b), 'zh-Hans-CN');
            });
        },
        formatStatNumber(value) {
            const num = Number(value) || 0;
            if (Math.abs(num) < 0.000001) return '0';
            return num.toFixed(2).replace(/\.?0+$/, '');
        },
        formatLevelDisplayText(levelKey) {
            return levelKey === 'Max' ? 'Max' : `等级 ${levelKey}`;
        },
        createEmptyAttrTotals() {
            return Config.ATTRIBUTE_KEYS.reduce((acc, key) => {
                acc[key] = 0;
                return acc;
            }, {});
        }
    };
    const State = {
        normalizeFavoriteState(rawState) {
            const defaultLimit = { ...Config.LIMITS };
            const fallback = { limit: defaultLimit };
            if (!Util.isPlainObject(rawState)) return fallback;

            const nextState = { limit: defaultLimit };
            Object.entries(rawState).forEach(([type, typeState]) => {
                if (type === 'limit') {
                    if (Util.isPlainObject(typeState)) {
                        const normalizedLimit = Object.fromEntries(
                            Object.entries(typeState)
                                .map(([k, v]) => [k, Number(v)])
                                .filter(([, v]) => Number.isFinite(v))
                        );
                        nextState.limit = { ...defaultLimit, ...normalizedLimit };
                    }
                    return;
                }

                if (!Util.isPlainObject(typeState)) return;
                nextState[type] = {};
                Object.entries(typeState).forEach(([name, level]) => {
                    if (typeof level === 'string' && level) {
                        nextState[type][name] = level;
                    }
                });
            });
            return nextState;
        },
        loadFavoriteState() {
            return this.normalizeFavoriteState(rankLocal.get(Config.STORAGE_KEYS.favoriteState, null));
        },
    };
    const Service = {
        /**
        * @param {Array} rawData
        */
        DataToTag(rawData) {
            const stats = rawData.reduce((acc, item) => {
                const type = item?.type || '未知';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});
            const sortedTypes = Util.sortTypesByRules(Object.keys(stats));

            return sortedTypes.map(type => ({
                label: type,
                value: type,
                badge: stats[type],
                default: true
            }));
        },
    };
    const Components = {
        /** Tooltip 提示组件 */
        Tooltip: class Tooltip {
            static #instance = null;
            constructor(options = {}) {
                if (Tooltip.#instance) {
                    return Tooltip.#instance;
                }

                const id = '__tm_rank_tooltip_host__';

                let existingHost = document.getElementById(id);

                if (existingHost && existingHost.shadowRoot) {
                    this.host = existingHost;
                    this.shadowRoot = this.host.shadowRoot;
                    this.el = this.shadowRoot.querySelector('.tm-tooltip-el');
                    this.arrow = this.shadowRoot.querySelector('.tm-tooltip-arrow');
                } else {
                    const tmpHost = document.createElement('div');
                    tmpHost.id = id;
                    tmpHost.setAttribute('style', 'position:fixed; z-index:10009; top:0; left:0; pointer-events:none;');

                    this.host = tmpHost;
                    this.shadowRoot = this.host.attachShadow({ mode: 'open' });
                    this.el = null;
                    this.arrow = null;
                }

                // 初始化 Tooltip 内部元素，如果是新实例或结构丢失，则创建并挂载
                if (!this.el || !this.arrow) {
                    this.el = document.createElement('div');
                    this.el.className = 'tm-tooltip-el';
                    this.arrow = document.createElement('div');
                    this.arrow.className = 'tm-tooltip-arrow';

                    this.initStyle();
                    this.el.appendChild(this.arrow);

                    this.shadowRoot.innerHTML = '';
                    this.shadowRoot.appendChild(this.el);
                }

                this.delay = options.delay ?? 200;
                this.gap = options.gap ?? 20;

                this.visible = false;
                this._showTimer = null;
                this._hideTimer = null;

                // 执行挂载
                this.mounted();
                Tooltip.#instance = this;
            }
            mounted() {
                const tryAppend = () => {
                    if (document.body && !document.body.contains(this.host)) {
                        document.body.appendChild(this.host);
                    }
                };

                if (document.body) {
                    tryAppend();
                } else {
                    const observer = new MutationObserver(() => {
                        if (document.body) {
                            observer.disconnect();
                            tryAppend();
                        }
                    });
                    observer.observe(document.documentElement, { childList: true });
                }
            }
            initStyle() {
                if (!this.el || !this.arrow) return;

                if (!this.el.style || !this.arrow.style) return;

                Object.assign(this.el.style, {
                    position: 'fixed',
                    padding: '6px 10px',
                    background: 'rgba(0,0,0,0.85)',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '13px',
                    zIndex: '10005',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    display: 'none',
                    opacity: '0',
                    transform: 'translate(0, 4px)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                });

                Object.assign(this.arrow.style, {
                    position: 'absolute',
                    width: '0',
                    height: '0'
                });
            }

            show(text, targetEl, options = {}) {
                const {
                    preferred = 'top',
                    gap = this.gap,
                    delay = this.delay
                } = options;

                if (!targetEl) return;

                clearTimeout(this._hideTimer);

                this._showTimer = setTimeout(() => {
                    this.el.innerText = text;
                    this.el.style.whiteSpace = 'pre-line';
                    this.el.appendChild(this.arrow);
                    this.el.style.display = 'block';
                    this.el.style.opacity = '0';

                    const rect = targetEl.getBoundingClientRect();

                    const w = this.el.offsetWidth;
                    const h = this.el.offsetHeight;

                    const placement = this._resolvePlacement(preferred, rect, w, h, gap);
                    this._applyPlacement(placement, rect, w, h, gap);

                    // force reflow
                    this.el.offsetHeight;

                    this.el.style.opacity = '1';
                    this.el.style.transform = 'translate(0,0)';
                    this.visible = true;
                }, delay);
            }

            hide(hideDelay = this.delay) {
                clearTimeout(this._showTimer);
                if (!this.visible) return;

                this._hideTimer = setTimeout(() => {
                    this.el.style.opacity = '0';

                    this.el.style.display = 'none';
                    this.visible = false;
                }, hideDelay);
            }

            /* ---------- 智能方向 ---------- */

            _resolvePlacement(preferred, rect, w, h, g) {
                const gap = g;
                const vw = window.innerWidth;
                const vh = window.innerHeight;

                const canTop = rect.top >= h + gap;
                const canBottom = vh - rect.bottom >= h + gap;
                const canLeft = rect.left >= w + gap;
                const canRight = vw - rect.right >= w + gap;

                switch (preferred) {
                    case 'top':
                        return canTop ? 'top' : 'bottom';
                    case 'bottom':
                        return canBottom ? 'bottom' : 'top';
                    case 'left':
                        return canLeft ? 'left' : 'right';
                    case 'right':
                        return canRight ? 'right' : 'left';
                    default:
                        return 'bottom';
                }
            }

            /* ---------- 定位 + Arrow ---------- */

            _applyPlacement(pos, rect, w, h, g) {
                const gap = g;
                let left, top, tx = 0, ty = 0;

                // reset arrow
                this.arrow.style.border = '';
                this.arrow.style.top = '';
                this.arrow.style.left = '';

                if (pos === 'top') {
                    left = rect.left + rect.width / 2 - w / 2;
                    top = rect.top - h - gap;
                    ty = 4;

                    Object.assign(this.arrow.style, {
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid rgba(0,0,0,0.85)',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    });
                }

                if (pos === 'bottom') {
                    left = rect.left + rect.width / 2 - w / 2;
                    top = rect.bottom + gap;
                    ty = -4;

                    Object.assign(this.arrow.style, {
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderBottom: '6px solid rgba(0,0,0,0.85)',
                        top: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    });
                }

                if (pos === 'left') {
                    left = rect.left - w - gap;
                    top = rect.top + rect.height / 2 - h / 2;
                    tx = 4;

                    Object.assign(this.arrow.style, {
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                        borderLeft: '6px solid rgba(0,0,0,0.85)',
                        right: '-6px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    });
                }

                if (pos === 'right') {
                    left = rect.right + gap;
                    top = rect.top + rect.height / 2 - h / 2;
                    tx = -4;

                    Object.assign(this.arrow.style, {
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                        borderRight: '6px solid rgba(0,0,0,0.85)',
                        left: '-6px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    });
                }

                /* 防溢出兜底（极限情况） */
                left = Math.min(Math.max(4, left), window.innerWidth - w - 4);
                top = Math.min(Math.max(4, top), window.innerHeight - h - 4);

                this.el.style.left = `${left}px`;
                this.el.style.top = `${top}px`;
                this.el.style.transform = `translate(${tx}px, ${ty}px)`;
            }
        },
        /** 侧边工具+面板组件 */
        SideToolbar: class SideToolbar {

            constructor(config = {}) {
                // --- 核心标识与尺寸 ---
                this.id = config.id || 'fixed-radius-bar';
                this.baseWidth = config.width || 130;
                this.baseHeight = config.height || 32;
                this.dragWidth = config.dragWidth || 110;
                this.panelWidth = config.panelWidth || '650px';

                // 计算hover时的宽度
                this.hoverWidth = this.baseWidth + Math.trunc(this.baseWidth / 6);

                // --- 视觉配置 ---
                this.text = config.text || '设置中心'; // 工具条文字
                this.icon = config.icon || '🚀'; // 工具条图标
                this.themeColor = config.color || '#1e293b'; // 工具条颜色
                this.fontColor = config.fontColor || '#edededff'
                this.dragText = config.dragText || '移动中'; // 工具条长按后的文字
                this.dragColor = config.dragColor || '#3f5d8cff'; // 工具条长按后颜色
                this.panelContent = config.content || '<div style="padding:20px;">弹出面板默认内容</div>';

                // --- 行为配置 ---
                this.closeDelay = config.closeDelay !== undefined ? config.closeDelay : 1000; //弹出窗口延迟，单位ms

                // --- 状态机 ---
                this.state = rankLocal.get("SideToolbarState") || { top: config.defaultTop || 200, side: 'left' };
                this.isDragging = false;
                this.isWindowOpen = false;
                this.autoCloseTimer = null;
                this.ticking = false; // 拖拽节流阀

                this.init();
            }

            init() {
                if (window.self !== window.top) return; // 如果不是顶层窗口，直接拦截，防止在ifream 上创建
                this.createStyles();
                this.render();
                this.bindEvents();
                this.applyPosition();
            }

            createStyles() {
                const toolStyle = document.createElement('style');
                let themedCss = Config.GLOBAL_THEME.replace(':host', `.toolbar-${this.id}`);
                toolStyle.innerHTML = `
                ${themedCss}
                /* 工具条样式 */
                .toolbar-${this.id}.tool {
                    box-sizing: border-box !important;
                    position: fixed; z-index: 9998;
                    background: var(--primary-color);
                    color: var(--text-light);
                    height: ${this.baseHeight}px;
                    width: ${this.baseWidth}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
                    user-select: none !important;
                    white-space: nowrap;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: clamp(9px, 6px + 0.9vw, 14px);
                    letter-spacing: 2px ;
                    font-weight: 600;
                    backdrop-filter: blur(8px); /* 关键：背景模糊 */
                    -webkit-backdrop-filter: blur(10px);
                    filter: brightness(0.95) saturate(0.9);
                    transition: filter 0.3s ease, width 0.3s ease, opacity 0.3s, background 0.3s,
                                transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28),
                                left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                                right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                                top 0.3s ease,
                                padding 0.3s ease;
                    gap: 10px;
                    overflow: hidden;
                    outline: none;
                    line-height: 1 !important;
                    will-change: transform, opacity;
                    backface-visibility: hidden;
                    perspective: 100vh;
                }
                .toolbar-${this.id}.tool .normal-icon-span svg {
                    fill: var(--primary-light);
                    width: 22px;
                    height 22px;
                }
                .toolbar-${this.id}.tool * { box-sizing: border-box !important; }

                .toolbar-${this.id}.tool:hover:not(.is-dragging) {
                    filter: brightness(1.1) saturate(1.1);
                }

                /* --- 工具条贴边与悬停逻辑 --- */
                .toolbar-${this.id}.tool.side-left { left: 0; border-radius: 0 20px 20px 0; flex-direction: row; padding-right: 12px; }
                .toolbar-${this.id}.tool.side-left:hover:not(.is-dragging), .toolbar-${this.id}.side-left.is-active:not(.is-dragging) { width: ${this.hoverWidth}px; padding-left: 0; }

                .toolbar-${this.id}.tool.side-right { right: 0;  border-radius: 20px 0 0 20px; flex-direction: row-reverse; padding-left: 12px; }
                .toolbar-${this.id}.side-right:hover:not(.is-dragging), .toolbar-${this.id}.side-right.is-active:not(.is-dragging) { width: ${this.hoverWidth}px; padding-left: 0; }

                /* 图标CSS */
                .toolbar-${this.id}.tool .icon-container { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }

                /* 拖拽态布局锁定：确保内容在圆柱平行线内 */
                .toolbar-${this.id}.tool.is-dragging {
                    gap: 0;
                    padding:0;
                    width: ${this.dragWidth}px;
                    border-radius: 20px ;
                    background: var(--primary-light);
                    color: var(--primary-color);
                    cursor: move;
                    filter: brightness(0.8) saturate(1);
                    transition: none !important;
                }

                .toolbar-${this.id}.tool .drag-msg { display: none; }
                .toolbar-${this.id}.tool.is-dragging .drag-msg { display: inline-flex; }

                .toolbar-${this.id}.tool.is-dragging .normal-msg,
                .toolbar-${this.id}.tool.is-dragging .normal-icon-span { display: none; }

                /* --- 弹出面板逻辑 --- */
                .toolbar-${this.id}.panel {
                    position: fixed;
                    z-index: 9999;
                    width: min(${this.panelWidth}, 100dvw);
                    height: 100dvh;
                    box-shadow: 0 0 30px rgba(0,0,0,0.25);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    overscroll-behavior:contain;
                    background: rgba(233, 233, 233, 1);
                    box-sizing: border-box !important;
                }

                /* 弹出面板进场、离场动画 */
                @keyframes slideInL { from { transform: translateX(-100%); opacity: 0;pointer-events: none; } to { transform: translateX(0); opacity: 1;pointer-events: auto; } }
                @keyframes slideOutL { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } }
                @keyframes slideInR { from { transform: translateX(100%); opacity: 0;pointer-events: none; } to { transform: translateX(0); opacity: 1;pointer-events: auto; } }
                @keyframes slideOutR { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%);opacity: 0; } }
                /* left进场动画 */
                .p-show-left { display: flex; animation: slideInL 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
                /* right进场动画 */
                .p-show-right { display: flex; animation: slideInR 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
                /* left离场动画 */
                .p-hide-left { display: flex; animation: slideOutL 0.3s ease-in forwards; }
                /* right离场动画 */
                .p-hide-right { display: flex; animation: slideOutR 0.3s ease-in forwards; }
                /* lef边时，面板样式 */
                .toolbar-${this.id}.panel.p-side-left {
                    right: auto; left: 0 ; border-radius: 0 8px 8px 0; }
                /* right边时，面板样式 */
                .toolbar-${this.id}.panel.p-side-right { right: 0; left: auto; border-radius: 8px 0 0 8px; }

                /* 弹出层header */
                .toolbar-${this.id}.panel .p-header {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--primary-light);
                    background: var(--primary-color);
                    padding: 6px 0px;
                    margin-bottom: 6px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                /* 弹出层header 标题内容样式  */
                .toolbar-${this.id}.panel .p-header-content {
                    flex: 1;          /* 占据中间所有空间 */
                    display: flex;
                    align-items: center;
                    justify-content: center; /* 在这块剩余宽度中水平居中 */
                    letter-spacing: 20px ; /* 字符间间距 */
                    gap: 20px;
                }
                .toolbar-${this.id}.panel .p-header-content span {
                    user-select: none !important;
                    margin-right: -54px;  /* 修正letter-spacing最后一个字符后面的间距+close-btn宽度 */
                }
                .toolbar-${this.id}.panel .p-header-content svg {
                    fill: var(--primary-light);
                    width: 22px;
                    height 22px;
                }
                /* 弹出层header部分关闭按钮样式  */
                .toolbar-${this.id}.panel .p-close-btn {
                    cursor: pointer;
                    font-size: 24px;
                    line-height: 1;
                    margin-right: 24px;
                    align-items: center;
                    flex-shrink: 0;
                    user-select: none !important;
                }

                /* 弹出层body部分样式  */
                .toolbar-${this.id}.panel .p-body {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                    color: #333;
                    padding: 0 6px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .toolbar-${this.id}.panel .p-body::-webkit-scrollbar {
                    display: none; /* Chrome Safari */
                }
            `;
                document.head.appendChild(toolStyle);
            }

            render() {
                // 渲染工具条 this.el
                this.el = document.createElement('div');
                //this.el.id = `toolbar-${this.id}`;
                this.el.className = `toolbar-${this.id}`;
                this.el.classList.add('tool');
                this.el.innerHTML = `
                <span class="normal-msg">${this.text}</span>
                <span class="drag-msg">${this.dragText}</span>
                <div class="icon-container">
                    <span class="normal-icon-span">${this.icon}</span>
                </div>
            `;
                document.body.appendChild(this.el);

                // 渲染弹出面板 this.panel
                this.panel = document.createElement('div');
                this.panel.className = `toolbar-${this.id}`;
                this.panel.classList.add('panel');
                this.panel.innerHTML = `
                <div class="p-header">
                    <div class="p-header-content">
                        ${this.icon}<span>${this.text}</span>
                    </div>
                    <span class="p-close-btn">✕</span>
                </div>
                <div class="p-body" >${this.panelContent}</div>
            `;
                document.body.appendChild(this.panel);
            }

            /**
             * 开启弹出面板
             */
            openWindow() {
                if (this.isWindowOpen) return;
                this.clearTimer();
                this.isWindowOpen = true;

                const isLeft = this.state.side === 'left';
                this.el.classList.add('is-active');

                // 设置面板方位：决定了圆角、left值、right值
                this.panel.classList.remove('p-side-left', 'p-side-right');
                this.panel.classList.add(`p-side-${this.state.side}`);

                // 临时显示以获取高度
                this.panel.style.display = 'flex';
                this.panel.style.visibility = 'hidden';

                // 移除离场动画、进场动画
                this.panel.classList.remove('p-hide-left', 'p-hide-right', 'p-show-left', 'p-show-right');
                this.panel.style.top = '0px';
                this.panel.style.visibility = 'visible';

                void this.panel.offsetWidth; // 强制重绘，确保动画触发
                // 根据isLeft判断添加对应的进场动画
                this.panel.classList.add(isLeft ? 'p-show-left' : 'p-show-right');

            }

            /**
             * 关闭弹出面板
             */
            closeWindow() {
                if (!this.isWindowOpen) return;
                this.isWindowOpen = false;

                this.el.classList.remove('is-active');

                const isLeft = this.state.side === 'left';
                // 移除进场动画
                this.panel.classList.remove('p-show-left', 'p-show-right');
                // 添加离场动画
                this.panel.classList.add(isLeft ? 'p-hide-left' : 'p-hide-right');

                const onAnimEnd = () => {
                    if (!this.isWindowOpen) {
                        this.panel.style.display = 'none';
                        this.panel.classList.remove('p-hide-left', 'p-hide-right');
                    }
                    this.panel.removeEventListener('animationend', onAnimEnd);
                };
                this.panel.addEventListener('animationend', onAnimEnd); // 动画结束后修改DOM
            }

            // 吸附在屏幕侧边
            applyPosition() {

                this.el.classList.remove('is-dragging');

                const isLeft = this.state.side === 'left';

                this.el.classList.toggle('side-left', isLeft);
                this.el.classList.toggle('side-right', !isLeft);
                this.el.style.transform = 'scaleX(1)';


                // 使用 requestAnimationFrame 确保在下一帧渲染前执行，减少掉帧
                requestAnimationFrame(() => {
                    this.el.style.left = isLeft ? '0px' : 'auto';
                    this.el.style.right = !isLeft ? '0px' : 'auto';

                    this.el.style.top = this.state.top + 'px';

                    rankLocal.set("SideToolbarState", this.state)
                });
            }

            clearTimer() {
                if (this.autoCloseTimer) {
                    clearTimeout(this.autoCloseTimer);
                    this.autoCloseTimer = null;
                }
            }

            // 绑定事件
            bindEvents() {

                // 工具条进入移动模式
                const enterDragMode = (ev) => {
                    this.isDragging = true;
                    //this.closeWindow();
                    this.el.classList.add('is-dragging');
                    this.el.style.right = 'auto';
                    this.ticking = true;
                    requestAnimationFrame(() => {
                        moveAt(ev);
                        this.ticking = false;
                    });

                }
                // 工具条进入移动中计算
                const moveAt = (ev) => {
                    // 鼠标指针初始坐标 x y
                    let x = ev.clientX - Math.trunc(this.dragWidth / 2);
                    let y = ev.clientY - (this.baseHeight / 2);

                    x = Math.max(0, Math.min(x, window.innerWidth - this.dragWidth));
                    y = Math.max(0, Math.min(y, window.innerHeight - this.baseHeight));

                    this.el.style.left = x + 'px';
                    this.el.style.top = y + 'px';

                    const isLeft = ev.clientX < window.innerWidth / 2;
                    this.el.classList.toggle('side-left', isLeft);
                    this.el.classList.toggle('side-right', !isLeft);
                }

                // 工具条移动模式结束，applyPosition 吸附在屏幕侧边
                const finishDrag = (ev) => {
                    this.isDragging = false;

                    if (ev.clientX < window.innerWidth / 2) {
                        this.state.side = 'left';
                        this.el.style.flexDirection = 'row';
                    } else {
                        // 对于右侧吸附，特殊处理坐标转换
                        this.state.side = 'right';
                        this.el.style.flexDirection = 'row-reverse';
                        // 计算当前距离右侧的像素，手动设置起始 right 值，然后再设为 0
                        this.el.style.left = 'auto';
                        this.el.style.right = window.innerWidth - ev.clientX - (this.dragWidth / 2) + 'px';
                    }

                    const top = parseInt(this.el.style.top, 10);
                    this.state.top = Number.isFinite(top) ? top : 200;
                    rankLocal.set("SideToolbarState", this.state)
                    this.applyPosition();
                }

                let startX, startY, hasMoved = false;
                let pressTimer = null;

                // 工具条长鼠标事件，长按进入移动模式，添加移动中监听、松开鼠标监听
                const onMouseDown = (e) => {
                    e.preventDefault();
                    startX = e.clientX;
                    startY = e.clientY;
                    hasMoved = false;

                    this.el.style.flexDirection =
                        this.state.side === 'left' ? 'row' : 'row-reverse';
                    if (pressTimer) clearTimeout(pressTimer);
                    pressTimer = setTimeout(() => {
                        enterDragMode(e);
                    }, 550);

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                };

                // 工具条拖拽进入移动中事件
                const onMouseMove = (e) => {
                    if (
                        !this.isDragging &&
                        (Math.abs(e.clientX - startX) > 3 ||
                            Math.abs(e.clientY - startY) > 3)
                    ) {
                        clearTimeout(pressTimer);
                        enterDragMode(e);
                        hasMoved = true;
                    }

                    if (!this.isDragging) return;

                    hasMoved = true;
                    if (this.ticking) return;

                    this.ticking = true;
                    requestAnimationFrame(() => {
                        moveAt(e);
                        // 渲染完这一帧，释放开关
                        this.ticking = false;
                    });
                };

                // 工具条松开鼠标事件
                const onMouseUp = (e) => {
                    clearTimeout(pressTimer);
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);

                    if (this.isDragging) {
                        finishDrag(e);
                    } else if (!hasMoved) {
                        this.isWindowOpen ? this.closeWindow() : this.openWindow();
                    }
                };

                // 弹出面板延迟xx毫秒后自动关闭事件
                const startAutoClose = () => {
                    this.clearTimer();
                    if (!this.isWindowOpen) return;
                    if (Util.isToolbarAutoCloseLocked()) return;
                    if (this.panel.contains(document.activeElement)) return;
                    this.autoCloseTimer = setTimeout(() => {
                        if (!this.isWindowOpen) return;
                        if (Util.isToolbarAutoCloseLocked()) return;
                        if (this.panel.contains(document.activeElement)) return;
                        this.closeWindow();
                    }, this.closeDelay);
                };

                // 工具条按下鼠标监听
                this.el.addEventListener('mousedown', onMouseDown);

                // 弹出面板自动关闭事件监听
                [this.panel, this.el].forEach(dom => {
                    dom.addEventListener('mouseenter', () => this.clearTimer());
                    dom.addEventListener('mouseleave', startAutoClose);
                });

                // 弹出面板关闭按钮点击事件
                this.panel.querySelector('.p-close-btn').onclick = (e) => {
                    e.stopPropagation();
                    globalTooltip.hide(0);
                    this.closeWindow();
                };

                this.panel.querySelector('.p-close-btn').onmouseenter = () => globalTooltip.show("关闭窗口", this.panel.querySelector('.p-close-btn'), { preferred: 'bottom' });
                this.panel.querySelector('.p-close-btn').onmouseleave = () => globalTooltip.hide(150);
            }

            getCurrSide() {
                return this.state.side ?? "left";
            }
        },
        /** 多选组件 */
        TagGroupComponent: class TagGroupComponent {
            /**
             * @param {Array} groups
             * @param {Object} selectionState
             * @param {{ onChange?: Function, onAction?: Function }} handlers
             */
            constructor(groups, selectionState, handlers = {}) {
                this.groups = Array.isArray(groups) ? groups : [];
                this.selectionState = selectionState || {};
                this.onChange = typeof handlers.onChange === 'function' ? handlers.onChange : () => { };
                this.onAction = typeof handlers.onAction === 'function' ? handlers.onAction : () => { };
                this.element = document.createElement('div');
                this.element.className = 'rank-tag-group-container';
                this.initStyles();
                this.render();
            }

            initStyles() {
                if (document.getElementById('tag-group-style')) return;
                const style = document.createElement('style');
                style.id = 'tag-group-style';
                style.textContent = `
            .rank-tag-group-container { display: grid; align-items: start;padding: 8px 8px 8px 2px ; border-bottom: 1px solid #edf2f7; }
            .rank-tag-group-container .tag-group-header { padding: 4px 0; align-self: flex-start; }
            .rank-tag-group-container .tag-group-title { font-weight: 700; color: #6a6a6a; font-size: 13px; white-space: nowrap; }
            .rank-tag-group-container .tag-group-row-content {  display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 16px; }
            .tag-compact-section { display: inline-flex; align-items: center; gap: 8px; }
            .tag-compact-sep { color: #98a9bb; font-weight: 700; }
            .tag-inline-group-title { font-weight: 700; color: #4d6076; font-size: 12px; margin-right: 2px; }
            .tag-item { display:flex; align-items: center; justify-content: center; min-width: 110px; padding: 3px 8px; border: 1px solid #f7f8fa; border-radius: 4px; cursor: pointer; font-size: 13px; transition: background 0.3s; background: #f7f8fa; color: #56667a; }
            .tag-item:hover { border-color: #94bce4; color: #2f4f71; }
            .tag-item.active { background: #4a90e2; color: #fff; }
            .tag-item .badge { display: inline-flex; background-color: #ffffff00; color: #828282; text-align: center; white-space: nowrap; font-weight: 700; font-size: 10px; align-items: center; justify-content: flex-start; padding: 0 4px; }
            .tag-item.active .badge { background: rgba(255,255,255,0); color: #fff }
            .tag-item svg { width:11px;height:11px;}
            .rank-panel-root {padding: 0 6px;}
            .rank-panel-root.theme-dark .tag-item .badge { background: #ffffff00; }
            .select-btn { min-width: 110px; padding: 3px 10px; font-size: 13px; cursor: pointer; background: #f6f9fc; border: 1px solid #dbe4ee; border-radius: 4px; color: #4f6177; }
            .select-btn:hover { background: #eef4fa; border-color: #9db8d8; }
            .tag-setting-item { border-style: dashed; gap: 12px; }
            .rank-panel-root.theme-dark .rank-tag-group-container { border-bottom-color: #2d3742; }
            .rank-panel-root.theme-dark .tag-group-title { color: #d7deea; }
            .rank-panel-root.theme-dark .tag-inline-group-title { color: #d7deea; }
            .rank-panel-root.theme-dark .tag-compact-sep { color: #748496; }
            .rank-panel-root.theme-dark .tag-item { background: #1f2731; border-color: #3b4656; color: #d4deea; }
            .rank-panel-root.theme-dark .tag-item:hover { border-color: #6687ad; color: #f1f6ff; }
            .rank-panel-root.theme-dark .tag-item.active { background: #26568c; color: #fff; }
            .rank-panel-root.theme-dark .select-btn { background: #1f2731; border-color: #3b4656; color: #d4deea; }
            .rank-panel-root.theme-dark .select-btn:hover { background: #263140; border-color: #6687ad; }
            `;
                document.head.appendChild(style);
            }

            setGroups(nextGroups) {
                this.groups = Array.isArray(nextGroups) ? nextGroups : [];
                this.render();
            }

            setSelectionState(nextState) {
                this.selectionState = nextState || {};
                this.render();
            }

            getSelectedValue(groupKey) {
                return this.selectionState[groupKey];
            }

            static getItemValue(item) {
                return item?.value ?? item?.label;
            }

            isActive(group, itemValue) {
                const selected = this.getSelectedValue(group.key);
                if (group.isSingle) return selected === itemValue;
                return Array.isArray(selected) && selected.includes(itemValue);
            }

            buildTagNode(group, item) {
                const itemValue = TagGroupComponent.getItemValue(item);
                const tag = document.createElement('div');
                tag.className = `tag-item ${this.isActive(group, itemValue) ? 'active' : ''}`;
                tag.textContent = item.label;
                if (item.badge !== undefined && item.badge !== null) {
                    const badgeSpan = document.createElement('span');
                    badgeSpan.className = 'badge';
                    badgeSpan.textContent = " ・ " + String(item.badge);
                    tag.appendChild(badgeSpan);
                }
                tag.onclick = () => this.handleTagClick(group.key, itemValue);
                return tag;
            }

            appendActionButtons(group, contentArea) {
                if (group.isSingle || !Array.isArray(group.actionButtons)) return;
                group.actionButtons.forEach(btnConfig => {
                    const btn = document.createElement('button');
                    btn.className = 'select-btn';
                    btn.innerHTML = btnConfig.label || '操作';
                    btn.onclick = () => this.handleGroupActionButton(group.key, btnConfig);
                    contentArea.appendChild(btn);
                });
            }

            appendSuffixActionTags(group, contentArea) {
                if (!Array.isArray(group.suffixActionTags)) return;
                group.suffixActionTags.forEach(actionTag => {
                    const tag = document.createElement('div');
                    tag.className = `tag-item tag-setting-item ${actionTag.className || ''}`.trim();
                    tag.innerHTML = actionTag.label || '设置';
                    tag.onclick = () => this.onAction({
                        action: actionTag.action,
                        groupKey: group.key,
                        group
                    });
                    contentArea.appendChild(tag);
                });
            }

            renderGroupContent(group) {
                const contentArea = document.createElement('div');
                contentArea.className = 'tag-group-row-content';
                this.appendActionButtons(group, contentArea);
                group.items.forEach(item => {
                    contentArea.appendChild(this.buildTagNode(group, item));
                });
                this.appendSuffixActionTags(group, contentArea);
                return contentArea;
            }

            render() {
                this.element.innerHTML = '';
                const compactGroups = this.groups.filter(group => group.compactLine);
                const normalGroups = this.groups.filter(group => !group.compactLine);

                normalGroups.forEach(group => {
                    const headerArea = document.createElement('div');
                    headerArea.className = 'tag-group-header';
                    headerArea.innerHTML = `<span class="tag-group-title">${group.group}</span>`;
                    this.element.appendChild(headerArea);
                    this.element.appendChild(this.renderGroupContent(group));
                });

                if (!compactGroups.length) return;

                const compactHeader = document.createElement('div');
                compactHeader.className = 'tag-group-header';
                compactHeader.innerHTML = `<span class="tag-group-title">${compactGroups[0].group}</span>`;
                this.element.appendChild(compactHeader);

                const compactContent = document.createElement('div');
                compactContent.className = 'tag-group-row-content';

                compactGroups.forEach((group, index) => {
                    const section = document.createElement('div');
                    section.className = 'tag-compact-section';

                    if (!group.hideCompactTitle && index > 0) {
                        const title = document.createElement('span');
                        title.className = 'tag-inline-group-title';
                        title.textContent = group.group;
                        section.appendChild(title);
                    }

                    group.items.forEach(item => {
                        section.appendChild(this.buildTagNode(group, item));
                    });

                    compactContent.appendChild(section);
                    if (index < compactGroups.length - 1) {
                        const sep = document.createElement('span');
                        sep.className = 'tag-compact-sep';
                        sep.textContent = '|';
                        compactContent.appendChild(sep);
                    }
                });

                this.element.appendChild(compactContent);
            }

            handleTagClick(groupKey, itemValue) {
                const group = this.groups.find(g => g.key === groupKey);
                if (!group) return;

                if (group.isSingle) {
                    const currentValue = this.getSelectedValue(groupKey);
                    if (currentValue === itemValue) return;
                    this.onChange(groupKey, itemValue);
                    return;
                }

                const currentValues = Array.isArray(this.getSelectedValue(groupKey)) ? this.getSelectedValue(groupKey) : [];
                const nextSet = new Set(currentValues);
                if (nextSet.has(itemValue)) nextSet.delete(itemValue);
                else nextSet.add(itemValue);
                this.onChange(groupKey, Array.from(nextSet));
            }

            handleGroupActionButton(groupKey, btnConfig) {
                const group = this.groups.find(g => g.key === groupKey);
                if (!group || group.isSingle) return;
                const currentValues = Array.isArray(this.getSelectedValue(groupKey)) ? this.getSelectedValue(groupKey) : [];
                const currentSet = new Set(currentValues);
                let targetItems = group.items;
                if (btnConfig?.mode === 'all') {
                    targetItems = group.items;
                } else if (typeof btnConfig?.rule === 'function') {
                    targetItems = group.items.filter(btnConfig.rule);
                }
                const targetValues = targetItems.map(item => TagGroupComponent.getItemValue(item));
                const hasUnselected = targetValues.some(value => !currentSet.has(value));
                targetValues.forEach(value => {
                    if (hasUnselected) currentSet.add(value);
                    else currentSet.delete(value);
                });
                this.onChange(groupKey, Array.from(currentSet));
            }
        },
        /** 筛选组件 */
        FilterPanel: class FilterPanel {
            constructor(options = {}) {
                this.theme = State.normalizeTheme(options.theme || CURRENT_THEME);
                this.onVisibilityChange = typeof options.onVisibilityChange === 'function' ? options.onVisibilityChange : null;
                this.visible = false;
                this.element = document.createElement('section');
                this.element.className = 'rank-filter-floating-panel';
                this.element.innerHTML = `
                <div class="rank-filter-floating-header">
                    <div class="rank-filter-floating-title">筛选条件</div>
                    <button type="button" class="rank-filter-floating-close">关闭</button>
                </div>
                <div class="rank-filter-floating-body"></div>
            `;
                this.bodyEl = this.element.querySelector('.rank-filter-floating-body');
                this.closeBtn = this.element.querySelector('.rank-filter-floating-close');
                this.closeBtn.addEventListener('click', () => this.hide());
                this.element.addEventListener('mouseenter', () => Util.lockToolbarAutoClose('filter_floating_panel'));
                this.element.addEventListener('mouseleave', () => Util.unlockToolbarAutoClose('filter_floating_panel'));
                this.setTheme(this.theme);
            }

            mountContent(contentEl) {
                if (!contentEl || this.bodyEl.contains(contentEl)) return;
                this.bodyEl.appendChild(contentEl);
            }

            setTheme(theme) {
                this.theme = State.normalizeTheme(theme);
                Util.applyThemeClass(this.element, this.theme);
                this.element.setAttribute('data-theme', this.theme);
            }

            show() {
                if (this.visible) return;
                this.visible = true;
                this.element.classList.add('is-visible');
                if (this.onVisibilityChange) this.onVisibilityChange(true);
            }

            hide() {
                if (!this.visible) return;
                this.visible = false;
                this.element.classList.remove('is-visible');
                Util.unlockToolbarAutoClose('filter_floating_panel');
                if (this.onVisibilityChange) this.onVisibilityChange(false);
            }

            toggle() {
                if (this.visible) this.hide();
                else this.show();
            }
        },
        /** 收藏统计组件 */
        FavoriteStatsPanel: class FavoriteStatsPanel {
            constructor(options = {}) {
                // 1. 初始化底层的非响应式依赖与基础配置
                this.storageManager = options.storageManager || rankLocal;
                this.storageKey = options.storageKey || Config.STORAGE_KEYS.favoriteState;
                this.rawData = Array.isArray(options.rawData) ? options.rawData : [];
                this.weightMap = State.normalizeWeightMap(options.weightMap || Config.DEFAULT_WEIGHT_MAP);
                this.theme = State.normalizeTheme(options.theme || CURRENT_THEME);

                this.expandedTypes = new Set();
                this.visible = false;
                this.isAddInputComposing = false; // 专为中文输入法（IME）设立的标志位

                // 外部钩子函数
                this.onChange = typeof options.onChange === 'function' ? options.onChange : null;
                this.onVisibilityChange = typeof options.onVisibilityChange === 'function' ? options.onVisibilityChange : null;

                this.rawIndex = new Map();
                this._renderRequested = false; // 合并批量渲染（NextTick）的节流阀
                this.activeLevelPickerStyle = { top: 0, left: 0, width: 0 };
                // 2. 核心：封装【响应式状态机 (State)】
                const rawState = {
                    favoriteState: State.normalizeFavoriteState(options.favoriteState ?? this.storageManager.get(this.storageKey, null)),
                    mode: options.mode === 'post' || options.mode === 'total' ? options.mode : 'replay',
                    activeLevelPickerKey: '',
                    // activeLevelPickerStyle: { top: 0, left: 0, width: 0 },
                    activeAddType: '',
                    activeAddCategory: false,
                    addQueryByType: {}
                };

                // 3. 使用 Proxy 劫持状态，实现“数据变，UI自动联动”
                this.state = new Proxy(rawState, {
                    set: (target, property, value, receiver) => {
                        const oldValue = target[property];
                        const result = Reflect.set(target, property, value, receiver);

                        // 只有当值真正发生改变时，才驱动 UI 进行精确重绘
                        if (oldValue !== value) {
                            this.handleStateDispatch(property, value);
                        }
                        return result;
                    }
                });

                // 4. 初始化基础 DOM 骨架
                this.initDOM();
                this.rebuildRawIndex();
                this.setTheme(this.theme);

                // 初次加载，全量渲染骨架内部
                this.render();
            }

            // =========================================================================
            // 🛠️ 1. 响应式分发中心 (State Dispatcher)
            // =========================================================================
            handleStateDispatch(property, newValue) {
                switch (property) {
                    case 'mode':
                        this.updateModeButtonsUI(newValue); // 局部更新：只切换顶部 Mode 按钮高亮
                        this.requestRender(); // 数据模式切换，影响全局数值计算，触发合并重绘
                        break;
                    case 'activeLevelPickerKey':
                        if (!newValue) this.destroyPickerPortal(); // 销毁 Picker
                        this.requestRender(); // 触发合并重绘
                        break;
                    case 'activeAddType':
                        this.requestRender(); // 新增面板展开收起，触发重绘
                        if (newValue) this.focusAddInput(newValue); // 如果是展开，自动聚焦
                        break;
                    case 'activeAddCategory':
                        this.requestRender(); // 底部新增类别面板展开收起，重绘
                        if (newValue) this.scrollCategoryPanelIntoView(); // 如果是展开，自动滚入视野
                        break;
                    case 'addQueryByType':
                        // 模糊搜索输入时，绝对采用【局部 DOM 替换】，防止大 render 导致输入框失去焦点！
                        // 由 setAddQuery 精确调用，此处作为兜底
                        break;
                    case 'favoriteState':
                        this.persistFavoriteState(newValue); // 数据变动，持久化并通知外部
                        this.requestRender(); // 刷新全局视图
                        break;
                    default:
                        this.requestRender();
                }
            }

            // =========================================================================
            // 📦 2. 基础 DOM 构造与事件绑定
            // =========================================================================
            initDOM() {
                this.element = document.createElement('section');
                this.element.className = 'favorite-stats-panel';
                this.element.innerHTML = `
                    <div class="favorite-stats-header">
                        <div class="favorite-stats-title">收藏统计</div>
                        <div class="favorite-stats-toolbar">
                            <div class="favorite-stats-mode">
                                <button type="button" class="favorite-stats-mode-btn" data-mode="replay">回帖</button>
                                <button type="button" class="favorite-stats-mode-btn" data-mode="post">发帖</button>
                                <button type="button" class="favorite-stats-mode-btn" data-mode="total">总和</button>
                            </div>
                            <button type="button" class="favorite-stats-clear-btn" data-action="clear-favorites">清空</button>
                            <button type="button" class="favorite-stats-close-btn">关闭</button>
                        </div>
                    </div>
                    <div class="favorite-stats-body"></div>
                `;

                this.bodyEl = this.element.querySelector('.favorite-stats-body');

                // 创建独立的弹窗层 Portal
                this.pickerPortal = document.createElement('div');
                this.pickerPortal.className = 'favorite-stats-picker-portal';
                document.body.appendChild(this.pickerPortal);

                // 事件绑定与上下文锁死
                this.handleDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
                this.handleViewportChange = this.handleViewportChange.bind(this);

                this.element.addEventListener('click', (e) => this.handleClick(e));
                this.element.addEventListener('mouseenter', () => Util.lockToolbarAutoClose('favorite_stats_panel'));
                this.element.addEventListener('mouseleave', () => Util.unlockToolbarAutoClose('favorite_stats_panel'));
                this.pickerPortal.addEventListener('click', (e) => this.handleClick(e));
                // this.pickerPortal.addEventListener('click', (e) => this.handlePortalClick(e));
                this.pickerPortal.addEventListener('mouseenter', () => Util.lockToolbarAutoClose('favorite_stats_panel'));
                this.pickerPortal.addEventListener('mouseleave', () => Util.unlockToolbarAutoClose('favorite_stats_panel'));
            }

            // =========================================================================
            // 🚀 3. 性能优化核心：批量延迟合并渲染 (NextTick / Batch Updates)
            // =========================================================================
            requestRender() {
                if (this._renderRequested) return;
                this._renderRequested = true;

                // 利用浏览器的帧空闲，将一帧内频繁的数据改动合并为单次重绘
                requestAnimationFrame(() => {
                    this.render();
                    this._renderRequested = false;
                });
            }

            // =========================================================================
            // 🛠️ 4. 局部细粒度更新专职函数 (Micro DOM Manipulation)
            // =========================================================================
            updateModeButtonsUI(currentMode) {
                this.element.querySelectorAll('.favorite-stats-mode-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-mode') === currentMode);
                });
            }

            renderSuggestionsUI(type) {
                const panel = this.element.querySelector(`.favorite-stats-add-panel[data-type="${Util.escapeHTML(type)}"]`);
                if (!panel) return;
                const list = panel.querySelector('.favorite-stats-add-list');
                if (!list) return;

                const suggestions = this.getTypeSuggestions(type);
                list.innerHTML = suggestions.length
                    ? suggestions.map(item => `<button type="button" class="favorite-stats-add-suggestion" data-action="add-item" data-type="${Util.escapeHTML(type)}" data-name="${Util.escapeHTML(item.name)}">${Util.escapeHTML(item.name)}</button>`).join('')
                    : `<div class="favorite-stats-add-empty">没有可新增的数据</div>`;
            }

            focusAddInput(type) {
                requestAnimationFrame(() => {
                    const input = this.element.querySelector(`.favorite-stats-add-input[data-type="${Util.escapeHTML(type)}"]`);
                    if (input) input.focus();
                });
            }

            scrollCategoryPanelIntoView() {
                requestAnimationFrame(() => {
                    const panel = this.element.querySelector('.favorite-stats-body');

                    // 外层网页滚动到最底端
                    panel.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: 'smooth'
                    });
                });
            }

            destroyPickerPortal() {
                this.pickerPortal.innerHTML = '';
            }

            // =========================================================================
            // 🧠 5. 纯粹的数据逻辑与状态修改（彻底剥离 this.render()）
            // =========================================================================
            setData(options = {}) {
                if (options.favoriteState) {
                    this.state.favoriteState = State.normalizeFavoriteState(options.favoriteState);
                }
                if (Array.isArray(options.rawData)) {
                    this.rawData = options.rawData;
                    this.rebuildRawIndex();
                    this.requestRender();
                }
                if (options.weightMap) {
                    this.weightMap = State.normalizeWeightMap(options.weightMap);
                    this.requestRender();
                }
                if (options.theme) {
                    this.setTheme(options.theme);
                }
            }

            persistFavoriteState(normalizedState) {
                const oldState = this.storageManager.get(this.storageKey);
                if (JSON.stringify(oldState) === JSON.stringify(normalizedState)) {
                    return;
                }
                this.storageManager.set(this.storageKey, normalizedState);
                if (this.onChange) this.onChange(normalizedState);
            }

            removeFavoriteItem(type, name) {
                if (!type || !name) return;
                const nextState = State.normalizeFavoriteState(this.state.favoriteState);
                if (!nextState[type] || !nextState[type][name]) return;

                delete nextState[type][name];
                this.state.favoriteState = nextState; // 触发 Proxy 的 favoriteState 处理器
            }

            addFavoriteItem(type, name) {
                if (!type || !name) return;
                const favoriteCheck = State.canAddFavoriteItem(this.state.favoriteState, type, name);
                if (!favoriteCheck.allowed) {
                    window.alert(`${type}类型达到上限${favoriteCheck.limitValue}，请先取消再收藏`);
                    return;
                }

                const nextState = State.normalizeFavoriteState(this.state.favoriteState);
                if (!nextState[type]) nextState[type] = {};
                if (nextState[type][name]) return;

                nextState[type][name] = 'Max';
                this.state.addQueryByType[type] = ''; // 清空当前的搜索词
                this.state.activeAddType = '';        // 关闭新增面板
                this.state.favoriteState = nextState;  // 更新大状态
            }

            addFavoriteCategory(type) {
                if (!type) return;
                const nextState = State.normalizeFavoriteState(this.state.favoriteState);
                if (nextState[type]) return;

                nextState[type] = {};
                this.state.activeAddCategory = false;
                this.state.favoriteState = nextState;
            }

            removeFavoriteCategory(type) {
                if (!type) return;
                const nextState = State.normalizeFavoriteState(this.state.favoriteState);
                if (!nextState[type]) return;

                delete nextState[type];
                this.expandedTypes.delete(type);
                this.state.activeAddCategory = false;
                this.state.favoriteState = nextState;
            }

            clearFavoriteState() {
                this.expandedTypes.clear();
                this.state.addQueryByType = {};
                this.state.activeAddType = '';
                this.state.activeAddCategory = false;
                this.state.activeLevelPickerKey = '';
                // this.state.activeLevelPickerStyle = { top: 0, left: 0, width: 0 };
                this.activeLevelPickerStyle = { top: 0, left: 0, width: 0 };
                this.state.favoriteState = State.normalizeFavoriteState({ limit: this.state.favoriteState.limit || Config.LIMITS });
            }

            updateItemLevel(type, name, nextLevel) {
                const nextState = State.normalizeFavoriteState(this.state.favoriteState);
                if (!nextState[type]) nextState[type] = {};
                nextState[type][name] = nextLevel;
                this.state.favoriteState = nextState;
            }

            setAddQuery(type, value) {
                this.state.addQueryByType[type] = value;
                if (this.state.activeAddType === type) {
                    this.renderSuggestionsUI(type); // 👈 局部精准渲染搜索列表，绝对不触发大重绘
                }
            }

            toggleAddPanel(type) {
                this.state.activeAddType = this.state.activeAddType === type ? '' : type;
                this.state.activeAddCategory = false;
                if (this.state.activeAddType && !Object.prototype.hasOwnProperty.call(this.state.addQueryByType, type)) {
                    this.state.addQueryByType[type] = '';
                }
            }

            toggleAddCategoryPanel() {
                this.state.activeAddCategory = !this.state.activeAddCategory;
                this.state.activeAddType = '';
                this.state.activeLevelPickerKey = '';
            }

            toggleGroup(type) {
                if (this.expandedTypes.has(type)) {
                    this.expandedTypes.delete(type);
                } else {
                    this.expandedTypes.add(type);
                }
                this.requestRender();

                if (this.expandedTypes.has(type)) {
                    requestAnimationFrame(() => {
                        const target = Array.from(this.bodyEl.querySelectorAll('.favorite-stats-group-header'))
                            .find(node => node.getAttribute('data-type') === type);
                        if (target) {
                            target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                        }
                    });
                }
            }

            // =========================================================================
            // 👁️ 6. 核心显示控制 (Visibility)
            // =========================================================================
            show() {
                if (this.visible) return;
                this.visible = true;
                this.element.classList.add('is-visible');

                document.addEventListener('mousedown', this.handleDocumentPointerDown, true);
                window.addEventListener('resize', this.handleViewportChange, { passive: true });
                window.addEventListener('scroll', this.handleViewportChange, true);

                this.requestRender();
                if (this.onVisibilityChange) this.onVisibilityChange(true);
            }

            hide() {
                if (!this.visible) return;
                this.visible = false;
                this.element.classList.remove('is-visible');

                this.state.activeLevelPickerKey = '';
                // this.state.activeLevelPickerStyle = { top: 0, left: 0, width: 0 };
                this.activeLevelPickerStyle = { top: 0, left: 0, width: 0 };
                this.state.activeAddType = '';
                this.state.activeAddCategory = false;

                this.destroyPickerPortal();

                document.removeEventListener('mousedown', this.handleDocumentPointerDown, true);
                window.removeEventListener('resize', this.handleViewportChange, { passive: true });
                window.removeEventListener('scroll', this.handleViewportChange, true);

                Util.unlockToolbarAutoClose('favorite_stats_panel');
                if (this.onVisibilityChange) this.onVisibilityChange(false);
            }

            // =========================================================================
            // ⚡ 7. 事件派发代理 (Event Delegation)
            // =========================================================================
            handleClick(e) {
                // 【核心修正 1】优先处理等级选择（Picker），因为它独立于主面板
                const levelOption = e.target.closest('.favorite-stats-level-option');
                if (levelOption) {
                    const type = levelOption.getAttribute('data-type');
                    const name = levelOption.getAttribute('data-name');
                    const level = levelOption.getAttribute('data-level');
                    if (type && name && level) {
                        e.stopPropagation();
                        // 必须先修改数据，再关闭弹窗
                        this.updateItemLevel(type, name, level);
                        this.state.activeLevelPickerKey = '';
                    }
                    return;
                }

                // 打开等级选择下拉菜单（Picker）
                const levelBtn = e.target.closest('.favorite-stats-level-btn');
                if (levelBtn && this.element.contains(levelBtn)) {
                    e.stopPropagation();
                    const type = levelBtn.getAttribute('data-type');
                    const name = levelBtn.getAttribute('data-name');
                    if (type && name) {
                        const pickerKey = this.makePickerDomKey(type, name);
                        this.state.activeLevelPickerKey = this.state.activeLevelPickerKey === pickerKey ? '' : pickerKey;
                    }
                    return;
                }

                // 模式切换
                const modeBtn = e.target.closest('.favorite-stats-mode-btn');
                if (modeBtn && this.element.contains(modeBtn)) {
                    const nextMode = modeBtn.getAttribute('data-mode');
                    if (['replay', 'post', 'total'].includes(nextMode)) {
                        this.state.mode = nextMode;
                    }
                    return;
                }

                // 关闭面板
                const closeBtn = e.target.closest('.favorite-stats-close-btn');
                if (closeBtn && this.element.contains(closeBtn)) {
                    this.hide();
                    return;
                }

                // 清空收藏
                const clearBtn = e.target.closest('[data-action="clear-favorites"]');
                if (clearBtn && this.element.contains(clearBtn)) {
                    if (window.confirm('确定要清空所有收藏数据吗？')) {
                        this.clearFavoriteState();
                    }
                    return;
                }

                // 删除大类
                const groupRemove = e.target.closest('.favorite-stats-group-remove');
                if (groupRemove && this.element.contains(groupRemove)) {
                    e.stopPropagation();
                    const type = groupRemove.getAttribute('data-type');
                    if (type) this.removeFavoriteCategory(type);
                    return;
                }

                // 折叠/展开组
                const groupHeader = e.target.closest('.favorite-stats-group-header');
                if (groupHeader && this.element.contains(groupHeader)) {
                    const type = groupHeader.getAttribute('data-type');
                    if (type) this.toggleGroup(type);
                    return;
                }

                // 从收藏里删除某项
                const removeBtn = e.target.closest('.favorite-stats-item-remove');
                if (removeBtn && this.element.contains(removeBtn)) {
                    const type = removeBtn.getAttribute('data-type');
                    const name = removeBtn.getAttribute('data-name');
                    if (type && name) this.removeFavoriteItem(type, name);
                    return;
                }

                // 展开/收起 新增类别面板
                const toggleAddCategoryBtn = e.target.closest('[data-action="toggle-add-category"]');
                if (toggleAddCategoryBtn && this.element.contains(toggleAddCategoryBtn)) {
                    this.toggleAddCategoryPanel();
                    return;
                }

                // 点击具体的“新增类别”按钮
                const addCategoryBtn = e.target.closest('[data-action="add-category"]');
                if (addCategoryBtn && this.element.contains(addCategoryBtn)) {
                    const type = addCategoryBtn.getAttribute('data-type');
                    if (type) this.addFavoriteCategory(type);
                    return;
                }

                // 展开/收起 新增勋章输入框
                const toggleAddBtn = e.target.closest('[data-action="toggle-add"]');
                if (toggleAddBtn && this.element.contains(toggleAddBtn)) {
                    const type = toggleAddBtn.getAttribute('data-type');
                    if (type) this.toggleAddPanel(type);
                    return;
                }

                // 模糊搜索列表里点击具体项进行添加
                const addItemBtn = e.target.closest('[data-action="add-item"]');
                if (addItemBtn && this.element.contains(addItemBtn)) {
                    const type = addItemBtn.getAttribute('data-type');
                    const name = addItemBtn.getAttribute('data-name');
                    if (type && name) this.addFavoriteItem(type, name);
                    return;
                }

                const pickerWrap = e.target.closest('.favorite-stats-level-wrap');
                if (!pickerWrap && !this.pickerPortal.contains(e.target) && this.activeLevelPickerKey) {
                    this.activeLevelPickerKey = '';
                    this.render();
                }
            }

            // 空白点击判定，隔绝 mousedown 的提前误伤
            handleDocumentPointerDown(e) {
                if (!this.visible) {
                    this.state.activeLevelPickerKey = '';
                    this.destroyPickerPortal();
                    return;
                }

                // 如果点击发生在主面板内部，或者独立的 Portal 弹出层内部，不关闭任何东西
                if (this.element.contains(e.target) || this.pickerPortal.contains(e.target)) return;

                // 点击了容器【之外】的空白区域，清空状态
                if (this.state.activeLevelPickerKey || this.state.activeAddType || this.state.activeAddCategory) {
                    this.state.activeLevelPickerKey = '';
                    this.state.activeAddType = '';
                    this.state.activeAddCategory = false;
                }
            }

            handleViewportChange() {
                if (!this.visible || !this.state.activeLevelPickerKey) return;
                this.updateActiveLevelPickerPosition();
            }

            // =========================================================================
            // ⚙️ 8. 复用辅助函数群 (Utilities)
            // =========================================================================
            makeIndexKey(type, name) { return `${type}\u0000${name}`; }
            makePickerDomKey(type, name) { return `${encodeURIComponent(type)}::${encodeURIComponent(name)}`; }

            rebuildRawIndex() {
                this.rawIndex.clear();
                this.rawData.forEach(item => {
                    const type = item?.type || '未知';
                    const name = item?.name || '';
                    if (!name) return;
                    this.rawIndex.set(this.makeIndexKey(type, name), item);
                });
            }

            setTheme(theme) {
                this.theme = State.normalizeTheme(theme);
                Util.applyThemeClass(this.element, this.theme);
                this.element.setAttribute('data-theme', this.theme);
                this.pickerPortal.setAttribute('data-theme', this.theme);
            }

            getModeLabel() {
                if (this.state.mode === 'post') return '发帖';
                if (this.state.mode === 'total') return '总和';
                return '回帖';
            }

            getTypeSuggestions(type) {
                const query = String(this.state.addQueryByType[type] || '').trim().toLowerCase();
                const existingNames = new Set(Object.keys(this.state.favoriteState?.[type] || {}));
                return this.rawData
                    .filter(item => item?.type === type && item?.name && !existingNames.has(item.name))
                    .filter(item => {
                        if (!query) return true;
                        return String(item.name).toLowerCase().includes(query) || String(item.name_cleansing || '').toLowerCase().includes(query);
                    });
            }

            getMissingCategories() {
                const visibleTypes = new Set(Object.keys(this.state.favoriteState).filter(key => key !== 'limit'));
                return Array.from(new Set(this.rawData.map(item => item?.type).filter(Boolean)))
                    .filter(type => !visibleTypes.has(type));
            }

            getFavoriteItemSnapshot(type, name) {
                const rawItem = this.rawIndex.get(this.makeIndexKey(type, name));
                if (!rawItem) return null;
                const levelMap = Service.getLevelMap(rawItem.levels);
                const levelKeys = Service.getSortedLevelKeys(levelMap);
                if (!levelKeys.length) return null;
                const currentLevel = Service.resolveFavoriteLevelKey(levelMap, this.state.favoriteState?.[type]?.[name]);
                return { rawItem, levelMap, levelKeys, currentLevel };
            }

            findActivePickerItem(snapshot) {
                if (!this.state.activeLevelPickerKey || !snapshot?.groups?.length) return null;
                for (const group of snapshot.groups) {
                    for (const item of group.items) {
                        if (this.makePickerDomKey(item.type, item.name) === this.state.activeLevelPickerKey) {
                            return item;
                        }
                    }
                }
                return null;
            }

            getGroupEntries() {
                const groups = [];
                const totalReplayAttrs = Util.createEmptyAttrTotals();
                const totalPostAttrs = Util.createEmptyAttrTotals();
                const totalModeAttrs = Util.createEmptyAttrTotals();
                const sortedTypes = Util.sortTypesByRules(Object.keys(this.state.favoriteState || {}).filter(type => type !== 'limit'));

                sortedTypes.forEach(type => {
                    const typeState = this.state.favoriteState?.[type];
                    if (!Util.isPlainObject(typeState)) return;
                    const groupReplayAttrs = Util.createEmptyAttrTotals();
                    const groupPostAttrs = Util.createEmptyAttrTotals();
                    const groupModeAttrs = Util.createEmptyAttrTotals();
                    const items = [];

                    Object.entries(typeState).forEach(([name, storedLevel]) => {
                        const rawItem = this.rawIndex.get(this.makeIndexKey(type, name));
                        if (!rawItem) return;

                        const levelMap = Service.getLevelMap(rawItem.levels);
                        const levelKeys = Service.getSortedLevelKeys(levelMap);
                        if (!levelKeys.length) return;

                        const levelKey = Service.resolveFavoriteLevelKey(levelMap, storedLevel);
                        const levelObj = levelMap[levelKey];

                        const replayTotals = Service.getLevelAttrTotalsByMode(levelObj, 'replay', this.weightMap);
                        const postTotals = Service.getLevelAttrTotalsByMode(levelObj, 'post', this.weightMap);
                        const attrTotals = Service.getLevelAttrTotalsByMode(levelObj, this.state.mode, this.weightMap);

                        Util.mergeAttrTotals(groupReplayAttrs, replayTotals);
                        Util.mergeAttrTotals(groupPostAttrs, postTotals);
                        Util.mergeAttrTotals(groupModeAttrs, attrTotals);
                        Util.mergeAttrTotals(totalReplayAttrs, replayTotals);
                        Util.mergeAttrTotals(totalPostAttrs, postTotals);
                        Util.mergeAttrTotals(totalModeAttrs, attrTotals);

                        items.push({
                            type, name, levelKey, levelMap, levelKeys, levelObj, attrTotals,
                            rateText: `${Util.formatStatNumber((Number(levelObj?.rate) || 0) * 100)}%`,
                            metaParts: Util.buildLevelMetaTexts(levelObj, levelKey)
                        });
                    });

                    groups.push({
                        type, summary: groupModeAttrs, replaySummary: groupReplayAttrs, postSummary: groupPostAttrs, items
                    });
                });

                return { groups, totalModeAttrs, totalReplayAttrs, totalPostAttrs };
            }

            updateActiveLevelPickerPosition() {
                if (!this.state.activeLevelPickerKey) return;
                const btn = this.element.querySelector(`.favorite-stats-level-btn[data-picker-key="${this.state.activeLevelPickerKey}"]`);
                if (!btn) return;

                const rect = btn.getBoundingClientRect();
                const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
                const picker = this.pickerPortal.querySelector('.favorite-stats-level-picker');
                if (!picker) return;

                picker.style.width = 'max-content';
                picker.style.maxWidth = `${Math.max(240, viewportWidth - 24)}px`;
                picker.style.left = `12px`;
                picker.style.top = `${Math.max(12, rect.bottom + 8)}px`;

                const pickerWidth = Math.ceil(picker.getBoundingClientRect().width) || picker.scrollWidth || 280;
                const maxLeft = Math.max(12, viewportWidth - pickerWidth - 12);
                const left = Math.min(Math.max(12, rect.left), maxLeft);
                picker.style.left = `${left}px`;

                const pickerHeight = Math.ceil(picker.getBoundingClientRect().height) || picker.scrollHeight || 280;
                const belowTop = rect.bottom + 8;
                const aboveTop = rect.top - pickerHeight - 8;
                const fitsBelow = belowTop + pickerHeight <= viewportHeight - 12;
                const fitsAbove = aboveTop >= 12;

                let top = belowTop;
                if (!fitsBelow && fitsAbove) { top = aboveTop; }
                else if (!fitsBelow) { top = Math.max(12, viewportHeight - pickerHeight - 12); }

                // this.state.activeLevelPickerStyle = { top, left, width: pickerWidth };
                this.activeLevelPickerStyle = { top: 0, left: 0, width: 0 };
                picker.style.top = `${top}px`;
                picker.style.visibility = 'visible';
            }

            // =========================================================================
            // 🎨 9. 纯粹的视图字符串模板 (Templates)
            // =========================================================================
            renderSummaryGrid(rows) {
                return rows.map(row => `
                    <div class="${Util.escapeHTML(row.className)}">
                        ${row.values.map((value, index) => {
                    if (row.kind === 'head') {
                        return `<span class="favorite-stats-summary-head">${Util.escapeHTML(value)}</span>`;
                    }
                    const isZero = index > 0 && (Number(value) || 0) === 0;
                    return `<span class="favorite-stats-summary-value${isZero ? ' is-zero' : ''}">${Util.escapeHTML(value)}</span>`;
                }).join('')}
                    </div>
                `).join('');
            }

            renderGroupSummary(group) {
                return `
                    <div class="favorite-stats-group-summary">
                        ${Config.ATTRIBUTE_KEYS.map(key => {
                    const value = Number(group.summary?.[key]) || 0;
                    return `<span class="favorite-stats-summary-value${value === 0 ? ' is-zero' : ''}">${Util.escapeHTML(Util.formatStatNumber(value))}</span>`;
                }).join('')}
                    </div>
                `;
            }

            renderLevelPicker(item) {
                if (this.state.activeLevelPickerKey !== this.makePickerDomKey(item.type, item.name)) return '';
                const isPositioned = !!this.activeLevelPickerStyle?.top;
                const inlineStyle = [
                    `visibility: ${isPositioned ? 'visible' : 'hidden'}`,
                    this.activeLevelPickerStyle.top ? `top:${this.activeLevelPickerStyle.top}px` : '',
                    this.activeLevelPickerStyle.left ? `left:${this.activeLevelPickerStyle.left}px` : ''
                ].filter(Boolean).join(';');

                return `
                    <div class="favorite-stats-level-picker"${inlineStyle ? ` style="${inlineStyle}"` : ''}>
                        ${item.levelKeys.map(levelKey => {
                    const levelObj = item.levelMap[levelKey] || {};
                    const optionMeta = Util.buildLevelMetaTexts(levelObj, levelKey, { includeRate: true });
                    return `
                                <button type="button" class="favorite-stats-level-option${levelKey === item.levelKey ? ' active' : ''}" data-type="${Util.escapeHTML(item.type)}" data-name="${Util.escapeHTML(item.name)}" data-level="${Util.escapeHTML(levelKey)}">
                                    <div class="favorite-stats-level-option-line">
                                        <span class="favorite-stats-level-option-title">${Util.escapeHTML(Util.formatLevelDisplayText(levelKey))}</span>
                                        <span class="favorite-stats-level-option-desc">
                                            ${optionMeta.map(text => `<span>${Util.escapeHTML(text)}</span>`).join('')}
                                        </span>
                                    </div>
                                </button>
                            `;
                }).join('')}
                    </div>
                `;
            }

            renderAddPanel(type) {
                if (this.state.activeAddType !== type) {
                    return `<button type="button" class="favorite-stats-add-trigger" data-action="toggle-add" data-type="${Util.escapeHTML(type)}">新增勋章</button>`;
                }
                const suggestions = this.getTypeSuggestions(type);
                return `
                    <div class="favorite-stats-add-panel" data-type="${Util.escapeHTML(type)}">
                        <input class="favorite-stats-add-input" data-type="${Util.escapeHTML(type)}" type="text" value="${Util.escapeHTML(this.state.addQueryByType[type] || '')}" placeholder="输入名称进行模糊搜索...">
                        <div class="favorite-stats-add-list">
                            ${suggestions.length
                        ? suggestions.map(item => `<button type="button" class="favorite-stats-add-suggestion" data-action="add-item" data-type="${Util.escapeHTML(type)}" data-name="${Util.escapeHTML(item.name)}">${Util.escapeHTML(item.name)}</button>`).join('')
                        : `<div class="favorite-stats-add-empty">没有可新增的数据</div>`}
                        </div>
                    </div>
                `;
            }

            renderAddCategoryRow() {
                const missingCategories = Util.sortTypesByRules(this.getMissingCategories());
                if (!missingCategories.length) return '';
                return `
                <div class="favorite-stats-add-category-row">
                    <button type="button" class="favorite-stats-add-category-trigger" data-action="toggle-add-category">
                        ${this.state.activeAddCategory ? '收起' : '新增类别'}
                    </button>
                    ${this.state.activeAddCategory ? `
                        <div class="favorite-stats-add-category-panel">
                            ${missingCategories.map(type => `
                                <button type="button" class="favorite-stats-add-category-item" data-action="add-category" data-type="${Util.escapeHTML(type)}">${Util.escapeHTML(type)}</button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                `;
            }
            // =========================================================================
            // 🖨️ 10. 全量整合渲染 (The Core Render)
            // =========================================================================
            render() {
                const snapshot = this.getGroupEntries();

                // 1. 组装顶部的统计 Grid 核心区
                const totalHtml = `
                    <div class="favorite-stats-total">
                        <div class="favorite-stats-total-row">
                            <div class="favorite-stats-total-row-title">收益属性</div>
                            <div class="favorite-stats-summary-head-row">
                                ${Config.ATTRIBUTE_KEYS.map(key => `<span class="favorite-stats-summary-head">${Util.escapeHTML(key)}</span>`).join('')}
                            </div>
                        </div>
                        <div class="favorite-stats-total-row">
                            <div class="favorite-stats-total-row-title">${Util.escapeHTML(this.getModeLabel())}</div>
                            <div class="favorite-stats-summary-value-row">
                                ${Config.ATTRIBUTE_KEYS.map(key => {
                    const value = Number(snapshot.totalModeAttrs?.[key]) || 0;
                    return `<span class="favorite-stats-summary-value${value === 0 ? ' is-zero' : ''}">${Util.escapeHTML(Util.formatStatNumber(value))}</span>`;
                }).join('')}
                            </div>
                        </div>
                    </div>
                `;

                // 2. 组装中部大列表
                const groupsHtml = snapshot.groups.length ? snapshot.groups.map(group => {
                    const expanded = this.expandedTypes.has(group.type);
                    const itemsHtml = `
                        <div class="favorite-stats-item">
                            ${group.items.length ? group.items.map(item => `
                                <div class="favorite-stats-item-line">
                                    <div class="favorite-stats-item-name">${Util.escapeHTML(item.name)}</div>
                                    <div class="favorite-stats-level-wrap">
                                        <button type="button" class="favorite-stats-level-btn" data-type="${Util.escapeHTML(item.type)}" data-name="${Util.escapeHTML(item.name)}" data-picker-key="${this.makePickerDomKey(item.type, item.name)}">${Util.escapeHTML(Util.formatLevelDisplayText(item.levelKey))}</button>
                                    </div>
                                    <div class="favorite-stats-item-rate">${Util.escapeHTML(item.rateText)}</div>
                                    <div class="favorite-stats-item-info">${item.metaParts.map(text => `<span>${Util.escapeHTML(text)}</span>`).join('')}</div>
                                    <button type="button" class="favorite-stats-item-remove" data-type="${Util.escapeHTML(item.type)}" data-name="${Util.escapeHTML(item.name)}" aria-label="删除收藏">×</button>
                                </div>
                            `).join('') : `<div class="favorite-stats-group-empty">当前类别为空，请先用上面的新增按钮添加勋章数据</div>`}
                        </div>
                    `;

                    return `
                        <div class="favorite-stats-group${expanded ? ' is-expanded' : ''}">
                            <div class="favorite-stats-group-header" data-type="${Util.escapeHTML(group.type)}">
                                <div class="favorite-stats-group-title-wrap">
                                    <span class="favorite-stats-group-toggle-sign">${expanded ? '−' : '+'}</span>
                                    <div class="favorite-stats-group-title">${Util.escapeHTML(group.type.slice(0, 2))}<span style="font-size: 12px; font-weight: 500; color: #959595;">・${group.items.length}/${this.state.favoriteState?.limit?.[group.type] ?? '∞'}</span></div>
                                    <button type="button" class="favorite-stats-group-remove" data-type="${Util.escapeHTML(group.type)}" aria-label="删除类别">×</button>
                                </div>
                                ${this.renderGroupSummary(group)}
                            </div>
                            <div class="favorite-stats-group-body">
                                <div class="favorite-stats-add-row">${this.renderAddPanel(group.type)}</div>
                                ${itemsHtml}
                            </div>
                        </div>
                    `;
                }).join('') : `<div class="favorite-stats-empty">暂无收藏数据</div>`;

                // 3. 组装底部新增大类栏并渲染到主体中
                const addCategoryHtml = this.renderAddCategoryRow();
                this.bodyEl.innerHTML = totalHtml + groupsHtml + addCategoryHtml;

                // 4. 处理弹出浮层（Portal）的动态同步
                const activePickerItem = this.findActivePickerItem(snapshot);
                this.pickerPortal.innerHTML = activePickerItem ? this.renderLevelPicker(activePickerItem) : '';

                // 5. 局部输入框绑定事件（专门处理中文输入拼音合成问题）
                this.bodyEl.querySelectorAll('.favorite-stats-add-input').forEach(input => {
                    input.addEventListener('compositionstart', () => { this.isAddInputComposing = true; });
                    input.addEventListener('compositionend', (event) => {
                        this.isAddInputComposing = false;
                        const type = event.currentTarget.getAttribute('data-type');
                        if (type) this.setAddQuery(type, event.currentTarget.value);
                    });
                    input.addEventListener('input', (event) => {
                        if (this.isAddInputComposing) return;
                        const type = event.currentTarget.getAttribute('data-type');
                        if (type) this.setAddQuery(type, event.currentTarget.value);
                    });
                    input.addEventListener('blur', (event) => {
                        const type = event.currentTarget.getAttribute('data-type');
                        if (!type) return;
                        setTimeout(() => {
                            const activeEl = document.activeElement;
                            if (this.pickerPortal.contains(activeEl) || this.element.contains(activeEl && activeEl.closest?.('.favorite-stats-add-panel'))) return;
                            if (!String(this.state.addQueryByType[type] || '').trim()) {
                                this.state.activeAddType = '';
                            }
                        }, 0);
                    });
                });

                // 6. 输入聚焦与模式高亮修正
                const addCategoryBtn = this.element.querySelector('.favorite-stats-add-category-trigger');
                if (addCategoryBtn) {
                    addCategoryBtn.addEventListener('focus', () => Util.lockToolbarAutoClose('favorite_stats_panel'));
                    addCategoryBtn.addEventListener('blur', () => Util.unlockToolbarAutoClose('favorite_stats_panel'));
                }
                this.updateModeButtonsUI(this.state.mode);

                if (activePickerItem) {
                    requestAnimationFrame(() => this.updateActiveLevelPickerPosition());
                }
            }
        }
    };
    const App = {
        applyThemeClass(node, theme) {
            if (!node) return;
            node.classList.toggle('theme-light', theme === 'light');
            node.classList.toggle('theme-dark', theme === 'dark');
        },
        setBoardTheme(win, header, theme) {
            header.innerHTML = `<span style="margin-left:10px;">排名</span><span class="rank-info-header-type" style="margin-left: 12px;">类型</span><span class="rank-info-header-name">勋章名称</span><span style="margin-right: 20px;">总分</span>`;
            this.applyThemeClass(win, theme);
        },
        applyToolbarPanelTheme(panel, panelBody, theme) {
            if (!panel || !panelBody) return;
            const panelHeader = panel.querySelector('.p-header');

            if (theme === 'dark') {
                panel.style.background = '#151c24';
                panel.style.borderColor = '#2d3742';
                panel.style.boxShadow = '0 8px 26px rgba(0,0,0,0.38)';
                panelBody.style.background = '#151c24';
                panelBody.style.color = '#dce5f0';
                if (panelHeader) {
                    panelHeader.style.background = '#2a4464';
                }
            } else {
                panel.style.background = 'var(--bg-panel)';
                panel.style.borderColor = '#d5e3f1';
                panel.style.boxShadow = '0 8px 24px rgba(31, 59, 88, 0.16)';
                panelBody.style.background = 'var(--bg-panel)';
                panelBody.style.color = '#2b3d4d';
                if (panelHeader) panelHeader.style.background = '';
            }
        }
    };

    let clusterInstance = null;
    let hasBoundExternalAutoCloseLocks = false;
    const toolbarAutoCloseLocks = new Set();

    Util.lockToolbarAutoClose = function lockToolbarAutoClose(lockKey = 'default') {
        toolbarAutoCloseLocks.add(lockKey);
    }

    Util.unlockToolbarAutoClose = function unlockToolbarAutoClose(lockKey = 'default') {
        toolbarAutoCloseLocks.delete(lockKey);
    }

    Util.isToolbarAutoCloseLocked = function isToolbarAutoCloseLocked() {
        return toolbarAutoCloseLocks.size > 0;
    }

    Util.bindExternalAutoCloseLocks = function bindExternalAutoCloseLocks() {
        if (hasBoundExternalAutoCloseLocks) return;
        hasBoundExternalAutoCloseLocks = true;

        let isHoveringMedalDetail = false;
        const isElementInMedalDetail = (node) => node instanceof Element && !!node.closest(Config.MEDAL_DETAIL_SELECTOR);

        const lockMedalDetail = () => {
            if (isHoveringMedalDetail) return;
            isHoveringMedalDetail = true;
            Util.lockToolbarAutoClose('medal_container_hover');
        };

        const unlockMedalDetail = () => {
            if (!isHoveringMedalDetail) return;
            isHoveringMedalDetail = false;
            Util.unlockToolbarAutoClose('medal_container_hover');
        };

        document.addEventListener('mouseover', (e) => {
            if (isElementInMedalDetail(e.target)) lockMedalDetail();
        }, true);

        document.addEventListener('mouseout', (e) => {
            if (!isHoveringMedalDetail) return;
            if (!isElementInMedalDetail(e.target)) return;
            if (isElementInMedalDetail(e.relatedTarget)) return;
            unlockMedalDetail();
        }, true);

        window.addEventListener('blur', unlockMedalDetail);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) unlockMedalDetail();
        });
    }
    Service.LocalStorageManager = class LocalStorageManager {
        static #instances = new Map();

        constructor(id) {
            if (!id) {
                throw new Error('[LocalStorageManager] 缺少 storage id');
            }
            if (LocalStorageManager.#instances.has(id)) {
                return LocalStorageManager.#instances.get(id);
            }

            this.id = id;
            LocalStorageManager.#instances.set(id, this);
        }

        #read() {
            const raw = localStorage.getItem(this.id);
            if (!raw) return {};
            try {
                const parsed = JSON.parse(raw);
                return parsed && typeof parsed === 'object' ? parsed : {};
            } catch (error) {
                console.warn(`[LocalStorageManager] 读取 ${this.id} 失败，已回退为空对象`, error);
                return {};
            }
        }

        #write(data) {
            localStorage.setItem(this.id, JSON.stringify(data));
        }

        get(key, fallback = null) {
            const obj = this.#read();
            return obj[key] ?? fallback;
        }

        set(key, value) {
            const obj = this.#read();
            obj[key] = value;
            this.#write(obj);
            return value;
        }
    }
    Service.IdbStorageManager = class IdbStorageManager {
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
        #open = async () => {
            if (this.db) return this.db; // 单例模式，避免重复打开

            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName);
                request.onsuccess = () => {
                    this.db = request.result;
                    this.db.onversionchange = () => {
                        this.db.close();
                        this.db = null;
                        console.log("检测到数据库正在升级，释放连接");
                    };
                    resolve(this.db);
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

            // 硬检查：物理表是否存在
            if (!db.objectStoreNames.contains(storeName)) {
                const err = `[IdbError] 表 "${storeName}" 缺失，自动关闭，600ms后重连`;
                console.error(err);
                db.close();
                this.db = null;
                await new Promise(r => setTimeout(r, 1000));
                db = await this.#open();

                if (!db.objectStoreNames.contains(storeName)) {
                    const err = `[IdbError] 表 "${storeName}" 缺失。请确保数据库初始化。`;
                    console.error(err);
                    throw new Error(err);
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
                * 根据指定字段更新
                * @param {string} fieldName 索引字段名
                * @param {any} fieldValue 该字段对应的值
                * @param {object} newRecord 新的数据内容
                */
                updateByField: (fieldName, fieldValue, newRecord) => {
                    // 使用 #execute 统一管理事务和异常
                    return this.#execute(storeName, 'readwrite', (store) => {
                        return new Promise((resolve, reject) => {

                            const index = store.index(fieldName);
                            // 先通过索引获取主键 ID
                            const getReq = index.getKey(fieldValue);

                            getReq.onsuccess = () => {
                                const id = getReq.result;
                                if (id === undefined) {
                                    return reject(new Error(`未找到 ${fieldName} 为 ${fieldValue} 的记录`));
                                }

                                // 注入 ID 并更新
                                const recordWithId = { ...newRecord, id };
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
                                    KB: (size / 1024).toFixed(2),
                                    MB: (size / (1024 * 1024)).toFixed(2)
                                });
                            };
                            req.onerror = () => reject(req.error);
                        });
                    });
                },

            };
        }
    }
    const idbstorage = new Service.IdbStorageManager({
        dbName: "GmAwardDB",
        stores: [
            {
                name: 'award_info',
            },
            {
                name: 'sys',
            }
        ]
    });

    const rankLocal = new Service.LocalStorageManager("GM_Award_Rank");
    const globalTooltip = new Components.Tooltip();

    let CURRENT_THEME = rankLocal.get(Config.STORAGE_KEYS.theme, Config.DEFAULT_THEME_MODE);
    if (!Config.THEME_SET.has(CURRENT_THEME)) CURRENT_THEME = Config.DEFAULT_THEME_MODE;

    const myRankBar = new Components.SideToolbar({
        id: 'GM_Award_Rank',
        width: 136,
        height: 32,
        text: '勋章排行',
        icon: Config.ICONS.toolSVG,
        dragWidth: 105,
        panelHeight: 500,
        dragText: '移 ✥ 动',
        closeDelay: 900,
        content: ` `
    });

    GM_addStyle(`
        .clusterize-scroll { max-height: 100%; overflow: auto; outline: none; border-radius: 0 0 4px 4px; }
        .clusterize-scroll::-webkit-scrollbar {
            width: 14px;
            height: 14px;
        }
        .theme-dark .clusterize-scroll::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background: rgba(103, 119, 166, 0.95);
        }
        .theme-dark .clusterize-scroll::-webkit-scrollbar-track {
            background: #151c24;
            border-radius: 8px;
        }
        .theme-dark .clusterize-scroll::-webkit-scrollbar-thumb:hover {
            background-color: rgba(157, 157, 157, 0.87);
        }
        @supports (scrollbar-width: thin) and (not (-webkit-appearance: none)) {
            .theme-dark .clusterize-scroll {
                scrollbar-color: rgba(103, 119, 166, 0.95) #151c24 ;
            }
        }
        .theme-light .clusterize-scroll::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background: rgba(190, 190, 190, 0.95);
        }
        .theme-light .clusterize-scroll::-webkit-scrollbar-track {
            background: rgb(255, 255, 255);
            border-radius: 8px;
        }
        .theme-light .clusterize-scroll::-webkit-scrollbar-thumb:hover {
            background-color: rgba(136 , 136 , 136 ,0.95);
        }
        @supports (scrollbar-width: thin) and (not (-webkit-appearance: none)) {
            .theme-light .clusterize-scroll {
                scrollbar-color: rgba(190, 190, 190, 0.95) rgb(255, 255, 255);
            }
        }


        .rank-panel-root { position: relative; transition: background-color 0.25s , border-color 0.25s , color 0.25s ; }

        #rank-info-window {
            width: 100%; height: 360px;
            z-index: 10000;
            display: flex; flex-direction: column; font-family: sans-serif;
            border-bottom: 2px solid rgba(223, 223, 223, 0.65);
            border-radius: 4px;
            transition: background-color 0.25s , border-color 0.25s;
        }
        #rank-info-window.theme-dark { border-bottom: 2px solid #3c3c3c }
        .rank-control-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            border-bottom: 1px solid;
            padding: 2px 0 8px 0;
            margin-bottom: 8px;
            transition: color 0.25s, background-color 0.25s , border-color 0.25s;
        }
        .rank-control-bar svg { width: 16px; height: 16px; }
        .rank-control-bar button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
        }
        .rank-control-title {
            font-size: 12px;
            color: #4b5663;
            font-weight: 700;
            margin-right: 2px;
        }
        .rank-name-input-wrap {
            position: relative;
            flex: 1 1 180px;
            min-width: 180px;
            display: flex;
            align-items: center;
        }
        .rank-name-input {
            width: 100%;
            height: 28px;
            border: 1px solid #d6e0ea;
            border-radius: 6px;
            padding: 0 28px 0 10px;
            color: #2d3e50;
            font-size: 13px;
            font-weight: 600;
            outline: none;
        }
        .rank-name-clear-btn {
            position: absolute;
            right: 6px;
            width: 18px;
            height: 18px;
            border: none;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
            color: #7c8ea1;
            background: transparent;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease;
        }
        .rank-name-clear-btn.show {
            opacity: 1;
            pointer-events: auto;
        }
        .rank-name-clear-btn:hover {
            background: #edf3fa;
            color: #4f6176;
        }
        .rank-name-input:focus {
            border-color: #4a90e2;
            box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.14);
        }
        .rank-style-switch {
            display: inline-flex;
            border: 1px solid #d6e0ea;
            border-radius: 6px;
            overflow: hidden;
            background: #fff;
        }
        .rank-style-btn {
            border: 0;
            background: #f3f7fc;
            color: #4f6075;
            font-size: 12px;
            height: 28px;
            min-width: 64px;
            cursor: pointer;
            padding: 0 10px;
        }
        .rank-style-btn + .rank-style-btn {
            border-left: 1px solid #d6e0ea;
        }
        .rank-style-btn.active {
            border-color: #8aaed2;
            color: #2f4760;
            font-weight: 700;
        }
        .rank-style-btn.mode-light.active {
            background: #b9deff;
        }
        .rank-panel-root.theme-dark .rank-style-btn.mode-dark.active {
            background: #677990;
        }
        .rank-reset-btn {
            border: 1px solid #d6e0ea;
            background: #f8fbff;
            color: #4f6075;
            height: 28px;
            border-radius: 6px;
            padding: 0 10px;
            font-size: 12px;
            cursor: pointer;
        }
        .rank-reset-btn:hover {
            border-color: #9db8d8;
            background: #eef4fa;
        }
        .rank-filter-toggle-btn,
        .favorite-stats-toggle-btn {
            border: 1px solid #d6e0ea;
            background: #f8fbff;
            color: #4f6075;
            height: 28px;
            border-radius: 6px;
            padding: 0 10px;
            font-size: 12px;
            cursor: pointer;
        }
        .rank-filter-toggle-btn:hover,
        .favorite-stats-toggle-btn:hover {
            border-color: #9db8d8;
            background: #eef4fa;
        }
        .rank-filter-toggle-btn.active,
        .favorite-stats-toggle-btn.active {
            background: #b9deff;
            border-color: #8aaed2;
            color: #2f4760;
            font-weight: 700;
        }
        .rank-filter-floating-panel {
            display: none;
            position: absolute;
            left: 6px;
            right: 6px;
            top: 0;
            bottom: 0;
            z-index: 19;
            border: 1px solid var(--rank-filter-panel-border);
            border-radius: 8px;
            overflow: hidden;
            background: var(--rank-filter-panel-bg);
            box-shadow: var(--rank-filter-panel-shadow);
            backdrop-filter: blur(6px);
            flex-direction: column;
            min-height: 220px;
        }
        .rank-filter-floating-panel.is-visible {
            display: flex;
        }
        .rank-filter-floating-panel[data-theme="light"] {
            --rank-filter-panel-bg: rgba(255, 255, 255, 1);
            --rank-filter-panel-border: #d7e5f2;
            --rank-filter-panel-shadow: 0 4px 10px 4px rgb(0, 0, 0, 0.2);
            --rank-filter-panel-header-bg: linear-gradient(180deg, #fcfeff 0%, #edf5ff 100%);
            --rank-filter-panel-header-border: #e3ecf5;
            --rank-filter-panel-title: #334657;
            --rank-filter-panel-text: #4f6174;
        }
        .rank-filter-floating-panel[data-theme="dark"] {
            --rank-filter-panel-bg: rgba(20, 29, 38, 0.97);
            --rank-filter-panel-border: #334050;
            --rank-filter-panel-shadow: 0 18px 40px rgba(0, 0, 0, 0.38);
            --rank-filter-panel-header-bg: linear-gradient(180deg, rgba(44, 60, 80, 0.92) 0%, rgba(27, 38, 50, 0.96) 100%);
            --rank-filter-panel-header-border: #3a4858;
            --rank-filter-panel-title: #edf3fb;
            --rank-filter-panel-text: #dce5f0;
        }
        .rank-filter-floating-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 10px 12px;
            border-bottom: 1px solid var(--rank-filter-panel-header-border);
            background: var(--rank-filter-panel-header-bg);
        }
        .rank-filter-floating-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--rank-filter-panel-title);
        }
        .rank-filter-floating-close {
            border: 1px solid #d6e0ea;
            background: #f8fbff;
            color: #4f6075;
            height: 26px;
            border-radius: 6px;
            padding: 0 10px;
            font-size: 12px;
            cursor: pointer;
        }
        .theme-dark .rank-filter-floating-close {
            background: #2a3a4c;
            color: #edf3fb;
            border-color: #8d8d8d;
        }
        .rank-filter-floating-body {
            flex: 1;
            min-height: 0;
            overflow: auto;
            padding: 6px 10px;
            color: var(--rank-filter-panel-text);
        }
        .favorite-stats-panel {
            display: none;
            position: absolute;
            left: 6px;
            right: 6px;
            top: 0;
            bottom: 0;
            z-index: 20;
            border: 1px solid var(--favorite-stats-panel-border);
            border-radius: 8px;
            overflow: hidden;
            background: var(--favorite-stats-panel-bg);
            box-shadow: var(--favorite-stats-panel-shadow);
            backdrop-filter: blur(6px);
            flex-direction: column;
            min-height: 280px;
        }
        .favorite-stats-panel[data-theme="light"] {
            --favorite-stats-panel-bg: rgba(248, 252, 255, 0.96);
            --favorite-stats-panel-border: #d7e5f2;
            --favorite-stats-panel-shadow: 0 4px 10px 4px rgb(0, 0, 0, 0.2);;
            --favorite-stats-header-bg: linear-gradient(180deg, #fcfeff 0%, #edf5ff 100%);
            --favorite-stats-header-border: #e3ecf5;
            --favorite-stats-title: #334657;
            --favorite-stats-text: #4f6174;
            --favorite-stats-subtle: #7f8f9f;
            --favorite-stats-chip-bg: rgba(244, 249, 255, 0.92);
            --favorite-stats-chip-border: #d9e6f1;
            --favorite-stats-chip-name: #536678;
            --favorite-stats-chip-value: #294f73;
            --favorite-stats-card-bg: rgba(81, 159, 238, 0.09);
            --favorite-stats-card-border: #47a8ff;
            --favorite-stats-card-border1: #cdcdcd;
            --favorite-stats-group-header-bg: #fff;
            --favorite-stats-item-border: #e8eff6;
            --favorite-stats-meta-bg: #f4f8fc;
            --favorite-stats-meta-border: #e1e9f1;
            --favorite-stats-button-bg: #eef6ff;
            --favorite-stats-button-border: #a4a4a4;
            --favorite-stats-button-text: #30506e;
            --favorite-stats-button-active-bg: #dcecff;
            --favorite-stats-button-active-text: #2e4f73;
            --favorite-stats-picker-bg: rgba(255, 255, 255, 0.98);
            --favorite-stats-picker-border: #d7e4f0;
            --favorite-stats-picker-shadow: 0 14px 28px rgba(27, 50, 74, 0.2);
            --favorite-stats-picker-option-bg: #f8fbff;
            --favorite-stats-picker-option-active-bg: #e2f0ff;
            --favorite-stats-picker-option-border: #dce8f3;
            --favorite-stats-picker-option-active-border: #8db5db;
            --favorite-stats-picker-option-title: #32485e;
            --favorite-stats-picker-option-text: #617487;
        }
        .favorite-stats-panel[data-theme="dark"] {
            --favorite-stats-panel-bg: rgba(20, 29, 38, 0.97);
            --favorite-stats-panel-border: #334050;
            --favorite-stats-panel-shadow: 0 18px 40px rgba(0, 0, 0, 0.38);
            --favorite-stats-header-bg: linear-gradient(180deg, #223041 0%, #18212b 100%);
            --favorite-stats-header-border: #2d3742;
            --favorite-stats-title: #e7eef8;
            --favorite-stats-text: #d4deea;
            --favorite-stats-subtle: #aab8c7;
            --favorite-stats-chip-bg: rgba(32, 42, 53, 0.95);
            --favorite-stats-chip-border: #3b4656;
            --favorite-stats-chip-name: #b8c7d7;
            --favorite-stats-chip-value: #edf4fc;
            --favorite-stats-card-bg: #35485d;
            --favorite-stats-card-border: #334050;
            --favorite-stats-group-header-bg: rgba(35, 48, 61, 0.94);
            --favorite-stats-item-border: #2a3441;
            --favorite-stats-meta-bg: #202a35;
            --favorite-stats-meta-border: #334050;
            --favorite-stats-button-bg: #2a3a4c;
            --favorite-stats-button-border: #5f7b99;
            --favorite-stats-button-text: #f0f6ff;
            --favorite-stats-button-active-bg: #314255;
            --favorite-stats-button-active-text: #f0f6ff;
            --favorite-stats-picker-bg: rgba(24, 33, 43, 0.99);
            --favorite-stats-picker-border: #3b4656;
            --favorite-stats-picker-shadow: 0 16px 30px rgba(0, 0, 0, 0.45);
            --favorite-stats-picker-option-bg: #1f2731;
            --favorite-stats-picker-option-active-bg: #314255;
            --favorite-stats-picker-option-border: #334050;
            --favorite-stats-picker-option-active-border: #6687ad;
            --favorite-stats-picker-option-title: #edf3fb;
            --favorite-stats-picker-option-text: #aab8c7;
        }
        .favorite-stats-picker-portal[data-theme="light"] {
            --favorite-stats-picker-bg: rgba(255, 255, 255, 0.98);
            --favorite-stats-picker-border: #d7e4f0;
            --favorite-stats-picker-shadow: 0 14px 28px rgba(27, 50, 74, 0.2);
            --favorite-stats-picker-option-bg: #f8fbff;
            --favorite-stats-picker-option-active-bg: #e2f0ff;
            --favorite-stats-picker-option-border: #dce8f3;
            --favorite-stats-picker-option-active-border: #8db5db;
            --favorite-stats-picker-option-title: #32485e;
            --favorite-stats-picker-option-text: #617487;
        }
        .favorite-stats-picker-portal[data-theme="dark"] {
            --favorite-stats-picker-bg: rgba(24, 33, 43, 0.99);
            --favorite-stats-picker-border: #3b4656;
            --favorite-stats-picker-shadow: 0 16px 30px rgba(0, 0, 0, 0.45);
            --favorite-stats-picker-option-bg: #1f2731;
            --favorite-stats-picker-option-active-bg: #314255;
            --favorite-stats-picker-option-border: #334050;
            --favorite-stats-picker-option-active-border: #6687ad;
            --favorite-stats-picker-option-title: #edf3fb;
            --favorite-stats-picker-option-text: #aab8c7;
        }
        .favorite-stats-panel.is-visible {
            display: flex;
        }
        .favorite-stats-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 10px 12px;
            border-bottom: 1px solid var(--favorite-stats-header-border);
            background: var(--favorite-stats-header-bg);
        }
        .favorite-stats-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--favorite-stats-title);
        }
        .favorite-stats-toolbar {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .favorite-stats-mode {
            display: inline-flex;
            border: 1px solid var(--favorite-stats-button-border);
            border-radius: 6px;
            overflow: hidden;
            background: var(--favorite-stats-button-bg);
        }
        .favorite-stats-mode-btn {
            border: 0;
            background: var(--favorite-stats-button-bg);
            color: var(--favorite-stats-button-text);
            height: 26px;
            min-width: 50px;
            padding: 0 10px;
            font-size: 12px;
            cursor: pointer;
        }
        .favorite-stats-mode-btn + .favorite-stats-mode-btn {
            border-left: 1px solid var(--favorite-stats-button-border);
        }
        .favorite-stats-mode-btn.active {
            background: var(--favorite-stats-button-active-bg);
            color: var(--favorite-stats-button-active-text);
            font-weight: 700;
        }
        .favorite-stats-close-btn {
            border: 1px solid var(--favorite-stats-button-border);
            background: var(--favorite-stats-button-bg);
            color: var(--favorite-stats-button-text);
            height: 26px;
            border-radius: 6px;
            padding: 0 10px;
            font-size: 12px;
            cursor: pointer;
        }
        .favorite-stats-close-btn:hover {
            filter: brightness(0.98);
        }
        .favorite-stats-clear-btn {
            border: 1px solid var(--favorite-stats-button-border);
            background: var(--favorite-stats-button-bg);
            color: var(--favorite-stats-button-text);
            height: 26px;
            border-radius: 6px;
            padding: 0 10px;
            font-size: 12px;
            cursor: pointer;
        }
        .favorite-stats-clear-btn:hover {
            filter: brightness(0.98);
        }
        .favorite-stats-body {
            padding: 10px 12px 12px;
            display: grid;
            gap: 10px;
            overflow: auto;
            min-height: 0;
            scrollbar-gutter: stable;
        }
        .favorite-stats-total {
            box-shadow: 0 0 2px var(--favorite-stats-card-border);
            border-radius: 8px;
            padding: 10px 12px;
            background: var(--favorite-stats-card-bg);
        }
        .favorite-stats-total-row {
            display: grid;
            grid-template-columns: 110px minmax(0, 1fr);
            gap: 10px;
            align-items: center;
        }
        .favorite-stats-total-row + .favorite-stats-total-row {
            margin-top: 8px;
        }
        .favorite-stats-total-row-title {
            min-width: 0;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 12px;
            text-align: center;
            color: var(--favorite-stats-chip-name);
            font-weight: 700;
            white-space: nowrap;
        }
        .favorite-stats-summary-wrap {
            flex: 1;
            display: grid;
            gap: 6px;
            min-width: 0;
        }
        .favorite-stats-summary-head-row,
        .favorite-stats-summary-value-row,
        .favorite-stats-group-summary {
            display: grid;
            grid-template-columns: repeat(7, minmax(56px, 1fr));
            gap: 8px;
            align-items: center;
            min-width: 0;
        }
        .favorite-stats-summary-head, .favorite-stats-summary-value {
            min-width: 0;
            padding: 4px 8px;
            font-size: 12px;
            text-align: center;
        }
        .favorite-stats-summary-head {
            color: var(--favorite-stats-chip-name);
            font-weight: 700;
            white-space: nowrap;
        }
        .favorite-stats-summary-value {
            color: var(--favorite-stats-chip-value);
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
        }
        .favorite-stats-summary-value.is-zero { opacity: 0.2; }
        .favorite-stats-group {
            box-shadow: 0 0 2px var(--favorite-stats-card-border1);
            border-radius: 6px;
            background: var(--favorite-stats-card-bg);
        }
        .favorite-stats-group-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 10px 12px;
            cursor: pointer;
            background: var(--favorite-stats-group-header-bg);
            border-radius: 6px;
        }
        .favorite-stats-group-title-wrap {
            flex: 0 0 110px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            min-width: 110px;
        }
        .favorite-stats-group-toggle-sign {
            display: inline-flex;
            width: 16px;
            justify-content: center;
            color: var(--favorite-stats-subtle);
            font-weight: 700;
        }
        .favorite-stats-group-title {
            font-size: 13px;
            font-weight: 700;
            color: var(--favorite-stats-title);
            white-space: nowrap;
        }
        .favorite-stats-group-summary {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(7, minmax(56px, 1fr));
            gap: 8px;
            align-items: center;
        }
        .favorite-stats-group-body {
            padding: 0 12px 12px;
            display: none;
        }
        .favorite-stats-group.is-expanded .favorite-stats-group-body {
            display: block;
        }
        .favorite-stats-group.is-expanded .favorite-stats-group-header {
            border-radius: 6px 6px 0 0;
        }
        .favorite-stats-add-row {
            margin: 10px 0 8px;
        }
        .favorite-stats-add-category-row {
            margin-top: 10px;
            display: grid;
            gap: 8px;
        }
        .favorite-stats-add-trigger {
            border: 1.5px dashed var(--favorite-stats-button-border);
            background: transparent;
            color: var(--favorite-stats-button-text);
            width: 100%;
            border-radius: 8px;
            padding: 4px 12px;
            font-size: 12px;
            cursor: pointer;
        }
        .favorite-stats-add-category-trigger {
            width: 100%;
            border: 1.5px dashed var(--favorite-stats-button-border);
            background: var(--favorite-stats-panel-bg);
            color: var(--favorite-stats-button-text);
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 12px;
            cursor: pointer;
            text-align: center;
        }
        .favorite-stats-add-category-panel {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
            gap: 6px;
        }
        .favorite-stats-add-category-item {
            border: 1px solid var(--favorite-stats-picker-option-border);
            border-radius: 8px;
            background: var(--favorite-stats-picker-option-bg);
            color: var(--favorite-stats-text);
            padding: 6px 8px;
            cursor: pointer;
            font-size: 12px;
        }
        .favorite-stats-add-panel {
            position: relative;
            display: grid;
            gap: 6px;
        }
        .favorite-stats-add-input {
            width: 100%;
            height: 32px;
            border: 1px solid var(--favorite-stats-button-border);
            border-radius: 8px;
            background: var(--favorite-stats-panel-bg);
            color: var(--favorite-stats-text);
            padding: 0 10px;
            font-size: 13px;
            outline: none;
        }
        .favorite-stats-add-input:focus {
            border-color: var(--favorite-stats-picker-option-active-border);
        }
        .favorite-stats-add-list {
            display: grid;
            gap: 4px;
            max-height: 180px;
            overflow: auto;
            border-radius: 8px;
            clip-path: inset(0 round 8px);
            background: var(--favorite-stats-panel-bg);
            padding: 6px;
        }
        .favorite-stats-add-suggestion {
            border: 1px solid var(--favorite-stats-picker-option-border);
            border-radius: 8px;
            background: var(--favorite-stats-picker-option-bg);
            color: var(--favorite-stats-text);
            text-align: left;
            padding: 6px 8px;
            cursor: pointer;
            font-size: 12px;
        }
        .favorite-stats-add-empty {
            padding: 4px 2px;
            font-size: 12px;
            color: var(--favorite-stats-subtle);
        }



        .favorite-stats-summary-legend {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 8px;
        }
        .favorite-stats-item {
            display: grid;
            gap: 8px;
            padding: 8px 0;
            border-bottom: 1px solid var(--favorite-stats-item-border);
        }
        .favorite-stats-item:last-child {
            border-bottom: 0;
        }
        .favorite-stats-item-line {
            display: grid;
            grid-template-columns: minmax(120px, 1.5fr) 64px 32px minmax(0, 2.8fr) 22px;
            gap: 8px;
            align-items: center;
        }
        .favorite-stats-item-name {
            font-size: 13px;
            font-weight: 700;
            color: var(--favorite-stats-title);
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .favorite-stats-level-wrap {
            position: relative;
            display: inline-flex;
            place-self: center;
        }
        .favorite-stats-level-btn {
            border: 1px solid var(--favorite-stats-button-border);
            background: var(--favorite-stats-button-bg);
            color: var(--favorite-stats-button-text);
            border-radius: 3px;
            padding: 4px 2px;
            font-size: 12px;
            cursor: pointer;
            width: 65px;
        }
        .favorite-stats-item-rate {
            color: var(--favorite-stats-chip-value);
            font-weight: 700;
            font-size: 12px;
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
            place-self: center;
        }
        .favorite-stats-level-picker {
            position: fixed;
            top: 0;
            left: 0;
            max-height: 280px;
            max-width: calc(100vw - 24px);
            overflow: auto;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid var(--favorite-stats-picker-border);
            background: var(--favorite-stats-picker-bg);
            box-shadow: var(--favorite-stats-picker-shadow);
            z-index: 100005;
            display: grid;
            gap: 8px;
        }
        .favorite-stats-level-option {
            width: 100%;
            border: 1px solid var(--favorite-stats-picker-option-border);
            border-radius: 8px;
            background: var(--favorite-stats-picker-option-bg);
            padding: 8px 10px;
            cursor: pointer;
            text-align: left;
        }
        .favorite-stats-level-option.active {
            background: var(--favorite-stats-picker-option-active-bg);
            border-color: var(--favorite-stats-picker-option-active-border);
        }
        .favorite-stats-level-option-line {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
        }
        .favorite-stats-level-option-title {
            color: var(--favorite-stats-picker-option-title);
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
        }
        .favorite-stats-level-option-desc {
            color: var(--favorite-stats-picker-option-text);
            font-size: 12px;
            line-height: 1.45;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            flex-wrap: nowrap;
        }
        .favorite-stats-level-option-desc span {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
        }
        .favorite-stats-item-info {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            font-size: 12px;
            color: var(--favorite-stats-text);
            min-width: 0;
        }
        .favorite-stats-item-info span {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
        }
        .favorite-stats-item-remove , .favorite-stats-group-remove{
            isplay: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            line-height: 1;
            width: 16px;
            height: 16px;
            padding: 0;
            text-align: center;
            border: none;
            border-radius: 50%;
            background: transparent;
            color: var(--favorite-stats-subtle);
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease, color 0.15s ease, background-color 0.15s ease;
        }
        .favorite-stats-item-line:hover .favorite-stats-item-remove , .favorite-stats-group-header:hover .favorite-stats-group-remove  {
            opacity: 1;
            pointer-events: auto;
        }
        .favorite-stats-item-remove:hover , .favorite-stats-group-remove:hover {
            color: #fff;
            background: #d84b5a;
        }
        .favorite-stats-group-empty {
            padding: 10px 0 2px;
            font-size: 12px;
            text-align: center;
            color: var(--favorite-stats-subtle);
        }
        .favorite-stats-empty {
            padding: 16px;
            text-align: center;
            font-size: 13px;
            color: var(--favorite-stats-subtle);
        }
        .rank-info-empty {
            padding: 16px;
            text-align: center;
            font-size: 13px;
            color: #8997a5;
        }
        .rank-info-header { padding: 12px 15px; margin-bottom: 10px; display: flex; font-weight: 700; font-size: 14px; align-items:center;border-radius: 4px; }
        .rank-info-header-name { flex: 1; margin-left: 24px; }
        #rank-info-list { padding-right: 4px; }
        .rank-row { height: 58px;  }
        .rank-info-row { display: flex; align-items: center; height: 48px; position: relative; border: 1px solid; border-radius: 4px; box-sizing: border-box; }
        .rank-info-bg-bar { position: absolute; left: 0; top: 0; height: 100%; z-index: 1; pointer-events: none; }
        .rank-info-content { position: relative; z-index: 2; display: flex; width: 100%; align-items: center; padding: 0 15px; pointer-events: none; }
        .rank-info-level { width: 45px; font-size: 18px; font-weight: 700; text-align: center; }
        .rank-info-txt { flex: 1; margin-left: 12px; }
        .rank-info-type {font-size: 14px; margin:0 4px; }
        .rank-info-type span { padding: 2px 4px; border-radius: 2px; border: 1px solid #b84d45; color: #b84d45; font-size: 13px; }
        .rank-info-name { font-size: 14px; font-weight: 700; }
        .rank-info-add { pointer-events: auto; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; user-select: none; -webkit-user-select: none; }
        .rank-info-add svg { display: block; width: 15px; height: 15px; }
        .rank-info-add.is-active { color: #d84b5a; }
        .rank-info-desc { font-size: 11px; display: flex;gap: 6px; }
        .rank-info-score { font-size: 18px; font-weight: 700; }
        .theme-light .rank-info-header { background: #cfe6f8; color: #3d4b5a; }
        .theme-light .rank-info-row { border-color: #dbdbdb; background: #fff; }
        .theme-light .rank-info-bg-bar { background-color: #ebf5ff; }
        .theme-light .rank-info-level { color: #b84d45; }
        .theme-light .rank-info-name , .theme-light .rank-info-type { color: #334657; }
        .theme-light .rank-info-desc { color: #6686a4; }
        .theme-light .rank-info-score { color: #0076c8; }
        .theme-light .rank-info-row.js-hover, .theme-light .rank-info-row.js-hover .rank-info-bg-bar { background-color: #a0c5ec !important; }
        .theme-dark .rank-info-header { background: #202a36; color: #d7e1ee; border-bottom-color: #2f3b4a; }
        .theme-dark .rank-info-row { border-color: #575757; background: #18212b; }
        .theme-dark .rank-info-bg-bar { background-color: #2a4464; }
        .theme-dark .rank-info-level { color: #f4a980; }
        .theme-dark .rank-info-name, .theme-dark .rank-info-type { color: #e8eef7; }
        .theme-dark .rank-info-desc { color: #9eb0c2; }
        .theme-dark .rank-info-score { color: #7bb4ff; }
        .theme-dark .rank-info-row.js-hover, .theme-dark .rank-info-row.js-hover .rank-info-bg-bar { background-color: #55687e !important; }
        .rank-panel-root.theme-light .rank-control-bar { border-bottom-color: #b4b8bd; }
        .rank-panel-root.theme-dark .rank-control-bar { border-bottom-color: #7f8b99; }
        .rank-panel-root.theme-dark .rank-control-title { color: #d7deea; }
        .rank-panel-root.theme-dark .rank-name-input { background: #1f2731; border-color: #3b4656; color: #eaf1fb; }
        .rank-panel-root.theme-dark .rank-name-input:focus { border-color: #74a3d8; box-shadow: 0 0 0 2px rgba(116,163,216,0.2); }
        .rank-panel-root.theme-dark .rank-name-clear-btn { color: #9eb0c2; }
        .rank-panel-root.theme-dark .rank-name-clear-btn:hover { background: #324050; color: #e6eef8; }
        .rank-panel-root.theme-dark .rank-style-switch { border-color: #3b4656; background: #1f2731; }
        .rank-panel-root.theme-dark .rank-style-btn { background: #1f2731; color: #d4deea; }
        .rank-panel-root.theme-dark .rank-style-btn + .rank-style-btn { border-left-color: #3b4656; }
        .rank-panel-root.theme-dark .rank-style-btn.active { background: #2c3a4b; border-color: #6a88ac; color: #f2f6fb; }
        .rank-panel-root.theme-dark .rank-reset-btn { background: #1f2731; border-color: #3b4656; color: #d4deea; }
        .rank-panel-root.theme-dark .rank-reset-btn:hover { background: #263140; border-color: #6687ad; }
        .rank-panel-root.theme-dark .rank-filter-toggle-btn,
        .rank-panel-root.theme-dark .favorite-stats-toggle-btn { background: #1f2731; border-color: #3b4656; color: #d4deea; }
        .rank-panel-root.theme-dark .rank-filter-toggle-btn:hover,
        .rank-panel-root.theme-dark .favorite-stats-toggle-btn:hover { background: #263140; border-color: #6687ad; }
        .rank-panel-root.theme-dark .rank-filter-toggle-btn.active,
        .rank-panel-root.theme-dark .favorite-stats-toggle-btn.active { background: #2c3a4b; border-color: #6a88ac; color: #f2f6fb; }
        .theme-dark .rank-info-empty { color: #9baab8; }
        .rank-dialog-mask { position: fixed; inset: 0; background: rgba(7, 10, 14, 0.45); display: none; align-items: center; justify-content: center; z-index: 11000; }
        .rank-dialog-mask.show { display: flex; }
        .rank-dialog { width: min(460px, calc(100vw - 24px)); border-radius: 10px; border: 1px solid #d7e2ee; background: #fff; box-shadow: 0 18px 44px rgba(0,0,0,0.2); overflow: hidden; }
        .rank-dialog-header { padding: 12px 14px; font-size: 14px; font-weight: 700; color: #2f4358; border-bottom: 1px solid #e6edf5; }
        .rank-dialog-body { padding: 14px; max-height: 60vh; overflow: auto; display: grid; gap: 10px; }
        .rank-dialog-row { display: grid; grid-template-columns: 1fr 110px; gap: 8px; align-items: center; }
        .rank-dialog-key { color: #41566d; font-size: 13px; }
        .rank-dialog-input { width: 100%; height: 30px; border: 1px solid #d6e0ea; border-radius: 6px; padding: 0 8px; font-size: 13px; color: #2e4358; background: #fff; }
        .rank-dialog-input:focus { outline: none; border-color: #4a90e2; box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.14); }
        .rank-dialog-footer { border-top: 1px solid #e6edf5; padding: 10px 14px; display: flex; justify-content: flex-end; gap: 8px; }
        .rank-dialog-btn { height: 30px; padding: 0 12px; border-radius: 6px; border: 1px solid #d6e0ea; background: #f7fbff; color: #3d536b; cursor: pointer; font-size: 12px; }
        .rank-dialog-btn.primary { background: #2b7fd6; border-color: #2b7fd6; color: #fff; }
        .rank-dialog-btn:hover { border-color: #9db8d8; background: #edf4fb; }
        .rank-dialog-btn.primary:hover { background: #236db7; border-color: #236db7; }
        .rank-dialog.theme-dark { background: #1a232e; border-color: #354152; }
        .rank-dialog.theme-dark .rank-dialog-header { color: #e6edf7; border-bottom-color: #2d3742; }
        .rank-dialog.theme-dark .rank-dialog-key { color: #c9d5e3; }
        .rank-dialog.theme-dark .rank-dialog-input { background: #111821; border-color: #3b4656; color: #eaf1fb; }
        .rank-dialog.theme-dark .rank-dialog-input:focus { border-color: #74a3d8; box-shadow: 0 0 0 2px rgba(116,163,216,0.2); }
        .rank-dialog.theme-dark .rank-dialog-footer { border-top-color: #2d3742; }
        .rank-dialog.theme-dark .rank-dialog-btn { background: #24303d; border-color: #3b4656; color: #d4deea; }
        .rank-dialog.theme-dark .rank-dialog-btn.primary { background: #3f89dc; border-color: #3f89dc; color: #fff; }
        .rank-dialog.theme-dark .rank-dialog-btn:hover { background: #2a3745; border-color: #6a88ac; }
        .rank-dialog.theme-dark .rank-dialog-btn.primary:hover { background: #3273be; border-color: #3273be; }
    `);


    Util.getHeaderHtml = function getHeaderHtml() {
        return `<span style="margin-left:10px;">排名</span><span class="rank-info-header-type" style="margin-left: 12px;">类型</span><span class="rank-info-header-name">勋章名称</span><span style="margin-right: 20px;">总分</span>`;
    }

    Util.applyThemeClass = function applyThemeClass(node, theme) {
        if (!node) return;
        node.classList.toggle('theme-light', theme === 'light');
        node.classList.toggle('theme-dark', theme === 'dark');
    }

    Util.setBoardTheme = function setBoardTheme(win, header, theme) {
        header.innerHTML = Util.getHeaderHtml();
        Util.applyThemeClass(win, theme);
    }

    Util.applyToolbarPanelTheme = function applyToolbarPanelTheme(panel, panelBody, theme) {
        if (!panel || !panelBody) return;
        const panelHeader = panel.querySelector('.p-header');

        if (theme === 'dark') {
            panel.style.background = '#151c24';
            panel.style.borderColor = '#2d3742';
            panel.style.boxShadow = '0 8px 26px rgba(0,0,0,0.38)';
            panelBody.style.background = '#151c24';
            panelBody.style.color = '#dce5f0';
            if (panelHeader) {
                panelHeader.style.background = '#2a4464';
            }
        } else {
            panel.style.background = 'var(--bg-panel)';
            panel.style.borderColor = '#d5e3f1';
            panel.style.boxShadow = '0 8px 24px rgba(31, 59, 88, 0.16)';
            panelBody.style.background = 'var(--bg-panel)';
            panelBody.style.color = '#2b3d4d';
            if (panelHeader) panelHeader.style.background = '';
        }
    }

    Components.renderRow = function renderRow(d, favoriteState) {
        const favorite = State.isFavoriteItem(favoriteState, d.type, d.name);
        return `<div class="rank-row"><div class="rank-info-row"><div class="rank-info-content"><div class="rank-info-level">${d.rank}</div><div class="rank-info-type"><span>${Util.escapeHTML(d.type.slice(0, 2))}</span></div><div class="rank-info-txt"><div style="display:flex;align-items: center;gap: 10px;"><div class="rank-info-name">${Util.escapeHTML(d.name)}</div><div class="rank-info-add${favorite ? ' is-active' : ''}" data-type="${Util.escapeHTML(d.type)}" data-name="${Util.escapeHTML(d.name)}" data-level="Max" data-checked=>${favorite ? Config.ICONS.loveChecked : Config.ICONS.loveUnChecked}</div></div><div class="rank-info-desc"><span>${Util.formatLevelDisplayText(Util.escapeHTML(d.levelKey))}</span><span>${Util.escapeHTML(d.desc)}</span></div></div><div class="rank-info-score">${Number(d.score) ? Number(d.score).toFixed(2) : d.score}</div></div><div class="rank-info-bg-bar" style="width:${d.percent}%"></div></div></div>`;
    }
    /**
     * 更新每一行的bg长度
     * @param {Array} newData 数据
     */
    let favoriteState = State.loadFavoriteState();

    Components.updateRowBgLength = function updateRowBgLength(newData) {
        if (!clusterInstance) return;
        if (!Array.isArray(newData) || newData.length === 0) {
            clusterInstance.update([`<div class="rank-info-empty">暂无匹配数据</div>`]);
            return;
        }
        const maxVal = Math.max(...newData.map(item => Number(item.score) || 0), 0);
        const rows = newData.map(item => {
            const score = Number(item.score) || 0;
            return {
                ...item,
                percent: (maxVal > 0 && score > 0) ? Math.max(2, (score / maxVal) * 100) : 0
            };
        });
        clusterInstance.update(rows.map(row => Components.renderRow(row, favoriteState)));
        console.log("当前行数：", clusterInstance.getRowsAmount())
    }

    // window.updateRowBg = function (newData) {
    //     updateRowBgLength(Array.isArray(newData) ? newData : []);
    // };

    Components.bindEvents = function bindEvents(scrollArea, contentArea, handlers = {}) {
        if (!scrollArea || !contentArea) return;
        let hoverTimer = null;
        let lastTarget = null;
        const clear = () => {
            clearTimeout(hoverTimer);
            contentArea.querySelectorAll('.js-hover').forEach(el => el.classList.remove('js-hover'));
            lastTarget = null;
        };
        const handleEnter = (e) => {
            const row = e.target.closest('.rank-info-row');
            if (!row || row !== lastTarget) clear();
            if (row && row !== lastTarget) {
                lastTarget = row;
                hoverTimer = setTimeout(() => row.classList.add('js-hover'), Config.HOVER_DELAY);
            }
        };
        scrollArea.addEventListener('mouseover', handleEnter);
        scrollArea.addEventListener('mousemove', handleEnter);
        scrollArea.addEventListener('mouseleave', clear);
        scrollArea.addEventListener('scroll', clear, { passive: true });

        contentArea.addEventListener('click', (e) => {
            e.preventDefault();
            const btn = e.target.closest('.rank-info-add');
            if (!btn || !contentArea.contains(btn)) return;

            const type = btn.dataset.type;
            const name = btn.dataset.name;
            const checked = btn.classList.contains('is-active')
            if (!type || !name) return;

            if (!checked) {
                const favoriteCheck = State.canAddFavoriteItem(favoriteState, type, name);
                if (!favoriteCheck.allowed) {
                    window.alert(`${type}类型达到上限${favoriteCheck.limitValue}，请先取消再收藏`);
                    return;
                }
            }

            btn.classList.toggle('is-active', !checked);
            btn.innerHTML = !checked ? Config.ICONS.loveChecked : Config.ICONS.loveUnChecked;

            favoriteState = State.toggleFavoriteItem(favoriteState, type, name);
            State.saveFavoriteState(favoriteState);

            if (typeof handlers.onFavoriteStateChange === 'function') {
                handlers.onFavoriteStateChange(favoriteState);
            }
        });
    }

    State.getItemValue = function getItemValue(item) {
        return item?.value ?? item?.label;
    }

    State.getDefaultSingleValue = function getDefaultSingleValue(group) {
        const defaultItem = group.items.find(item => item.default);
        return State.getItemValue(defaultItem || group.items[0]);
    }

    State.getDefaultMultiValue = function getDefaultMultiValue(group) {
        const defaultItems = group.items.filter(item => item.default);
        const target = defaultItems.length ? defaultItems : group.items;
        return target.map(item => State.getItemValue(item));
    }

    State.buildDefaultSelections = function buildDefaultSelections(groups) {
        const selections = {};
        groups.forEach(group => {
            selections[group.key] = group.isSingle ? State.getDefaultSingleValue(group) : State.getDefaultMultiValue(group);
        });
        return selections;
    }

    State.normalizeTheme = function normalizeTheme(themeValue) {
        return Config.THEME_SET.has(themeValue) ? themeValue : Config.DEFAULT_THEME_MODE;
    }

    State.normalizeWeightMap = function normalizeWeightMap(weightCandidate) {
        const source = (weightCandidate && typeof weightCandidate === 'object') ? weightCandidate : {};
        const normalized = {};
        Object.keys(Config.DEFAULT_WEIGHT_MAP).forEach(key => {
            const value = Number(source[key]);
            normalized[key] = Number.isFinite(value) ? value : Config.DEFAULT_WEIGHT_MAP[key];
        });
        return normalized;
    }

    State.saveFavoriteState = function saveFavoriteState(state) {
        rankLocal.set(Config.STORAGE_KEYS.favoriteState, State.normalizeFavoriteState(state));
    }

    State.isFavoriteItem = function isFavoriteItem(favoriteState, type, name) {
        return !!favoriteState?.[type]?.[name];
    }

    State.getFavoriteTypeCount = function getFavoriteTypeCount(favoriteState, type) {
        if (!Util.isPlainObject(favoriteState?.[type])) return 0;
        return Object.keys(favoriteState[type]).length;
    }

    State.canAddFavoriteItem = function canAddFavoriteItem(favoriteState, type, name) {
        if (State.isFavoriteItem(favoriteState, type, name)) {
            return { allowed: true, limitValue: favoriteState?.limit?.[type] ?? null };
        }

        const limitValue = Number(favoriteState?.limit?.[type]);
        if (!Number.isFinite(limitValue) || limitValue <= 0) {
            return { allowed: true, limitValue: null };
        }

        const currentCount = State.getFavoriteTypeCount(favoriteState, type);
        if (currentCount >= limitValue) {
            return { allowed: false, limitValue };
        }

        return { allowed: true, limitValue };
    }

    State.toggleFavoriteItem = function toggleFavoriteItem(favoriteState, type, name) {
        const nextState = State.normalizeFavoriteState(favoriteState);
        if (!nextState[type]) nextState[type] = {};
        if (nextState[type][name]) {
            delete nextState[type][name];
            if (Object.keys(nextState[type]).length === 0) {
                delete nextState[type];
            }
        } else {
            nextState[type][name] = 'Max';
        }
        if (!nextState.limit) nextState.limit = {};
        return nextState;
    }

    Service.getLevelMap = function getLevelMap(levels) {
        const parsed = Util.isPlainObject(levels) ? levels : convertLEVELS.parse(levels);
        return Util.isPlainObject(parsed) ? parsed : {};
    }

    Service.compareLevelKey = function compareLevelKey(a, b) {
        if (a === 'Max') return 1;
        if (b === 'Max') return -1;
        const aNum = Number(a);
        const bNum = Number(b);
        const aIsNum = Number.isFinite(aNum) && String(a).trim() !== '';
        const bIsNum = Number.isFinite(bNum) && String(b).trim() !== '';
        if (aIsNum && bIsNum) return aNum - bNum;
        if (aIsNum) return -1;
        if (bIsNum) return 1;
        return String(a).localeCompare(String(b), 'zh-Hans-CN');
    }

    Service.getSortedLevelKeys = function getSortedLevelKeys(levelMap) {
        return Object.keys(levelMap).sort(Service.compareLevelKey);
    }

    Service.resolveFavoriteLevelKey = function resolveFavoriteLevelKey(levelMap, storedLevel) {
        if (storedLevel && Object.prototype.hasOwnProperty.call(levelMap, storedLevel)) {
            return storedLevel;
        }
        if (Object.prototype.hasOwnProperty.call(levelMap, 'Max')) {
            return 'Max';
        }
        const keys = getSortedLevelKeys(levelMap);
        return keys[keys.length - 1] || '';
    }

    Util.formatResourceText = function formatResourceText(resources = {}) {
        const entries = Object.entries(Util.isPlainObject(resources) ? resources : {}).filter(([, value]) => Number(value) !== 0);
        if (!entries.length) return '无';
        return entries
            .map(([key, value]) => {
                const num = Number(value) || 0;
                return num > 0 ? `${key}+${num}` : `${key}${num}`;
            })
            .join(' ');
    }

    Util.formatUpgradeText = function formatUpgradeText(upgrade) {
        if (!upgrade) return '已满级';
        if (typeof upgrade === 'string') return upgrade;
        if (!Util.isPlainObject(upgrade)) return '未知';
        if (upgrade.type === '条件') {
            const conditionText = [
                upgrade.stat ? String(upgrade.stat) : '',
                upgrade.operator ? String(upgrade.operator) : '',
                upgrade.value !== undefined && upgrade.value !== null && upgrade.value !== '' ? String(upgrade.value) : ''
            ].join('');
            return `${conditionText}${upgrade.other ? String(upgrade.other) : ''}` || '未知';
        }
        if (upgrade.type === '消耗') {
            const costText = [
                upgrade.type ? String(upgrade.type) : '',
                upgrade.cost !== undefined && upgrade.cost !== null && upgrade.cost !== '' ? String(upgrade.cost) : '',
                upgrade.item ? String(upgrade.item) : '',
                upgrade.other ? String(upgrade.other) : ''
            ].join('');
            return costText || '未知';
        }
        const parts = [];
        if (upgrade.type) parts.push(String(upgrade.type));
        if (upgrade.cost !== undefined && upgrade.cost !== null && upgrade.cost !== '') parts.push(String(upgrade.cost));
        if (upgrade.item) parts.push(String(upgrade.item));
        if (upgrade.stat) parts.push(String(upgrade.stat));
        if (upgrade.operator) parts.push(String(upgrade.operator));
        if (upgrade.value !== undefined && upgrade.value !== null && upgrade.value !== '') parts.push(String(upgrade.value));
        if (upgrade.condition) parts.push(String(upgrade.condition));
        if (upgrade.other) parts.push(String(upgrade.other));
        return parts.join('') || '未知';
    }

    Util.buildLevelMetaTexts = function buildLevelMetaTexts(levelObj, levelKey, options = {}) {
        const includeRate = options.includeRate === true;
        const parts = [];

        if (includeRate) {
            const rateText = `${Util.formatStatNumber((Number(levelObj?.rate) || 0) * 100)}%`;
            parts.push(`${rateText}`);
        }

        const replayText = Util.formatResourceText(levelObj?.replay);
        if (replayText && replayText !== '无') parts.push(`回帖${replayText}`);

        const postText = Util.formatResourceText(levelObj?.post);
        if (postText && postText !== '无') parts.push(`发帖${postText}`);

        const otherText = levelObj?.other;
        if (otherText) parts.push(`${otherText}`);

        if (levelKey !== 'Max' && levelObj?.upgrade) parts.push(`升级条件：${Util.formatUpgradeText(levelObj.upgrade)}`);

        return parts;
    }

    Util.mergeAttrTotals = function mergeAttrTotals(target, source) {
        Object.entries(source || {}).forEach(([key, value]) => {
            const nextValue = Number(value) || 0;
            if (!nextValue) return;
            target[key] = (target[key] || 0) + nextValue;
        });
        return target;
    }

    Service.getLevelAttrTotalsByMode = function getLevelAttrTotalsByMode(levelObj, mode, weightMap) {
        const safeWeightMap = State.normalizeWeightMap(weightMap);
        const safeRate = Number(levelObj?.rate) || 0;
        const totals = {};
        const modeKeys = mode === 'total' ? ['replay', 'post'] : [mode];

        modeKeys.forEach(modeKey => {
            const resources = Util.isPlainObject(levelObj?.[modeKey]) ? levelObj[modeKey] : {};
            Object.entries(resources).forEach(([attr, rawValue]) => {
                const attrValue = Number(rawValue) || 0;
                if (!attrValue) return;
                const weight = Number(safeWeightMap[attr]) || 0;
                const score = safeRate * attrValue * weight;
                if (!score) return;
                totals[attr] = (totals[attr] || 0) + score;
            });
        });

        return totals;
    }

    Service.buildAttributeItems = function buildAttributeItems(weightMap) {
        return Config.ATTRIBUTE_ITEMS.map(item => ({
            ...item,
            badge: Number(weightMap[item.label])
        }));
    }

    Service.buildFilterGroups = function buildFilterGroups(rawData, weightMap) {
        return [
            {
                key: 'types',
                group: '勋章类型',
                actionButtons: [
                    { label: '全选', mode: 'all' },
                    { label: '常用', mode: 'rule', rule: (item) => Config.TYPE_SORT_RULE_PRIMARY.includes(item.label) }
                ],
                items: Service.DataToTag(rawData)
            },
            {
                key: 'attrs',
                group: '收益属性',
                actionButtons: [
                    { label: '全选', mode: 'all' }
                ],
                suffixActionTags: [
                    { label: `设置${Config.ICONS.settingSVG}`, action: 'open_attr_weight_dialog' }
                ],
                items: Service.buildAttributeItems(weightMap)
            },
            {
                key: 'levelTarget',
                group: '统计方法',
                compactLine: false,
                hideCompactTitle: false,
                isSingle: true,
                items: [
                    { label: '最大收益', value: 'max_yield'},
                    { label: '最大收益 · 优', value: 'max_yield_1', default: true },
                    { label: '最高等级', value: 'max_level' },
                    { label: '售价', value: 'price' },
                    { label: '时间', value: 'date' },
                ]
            },
            {
                key: 'actionType',
                group: '收益状态',
                compactLine: false,
                isSingle: true,
                items: [
                    { label: '全部', value: 'total' },
                    { label: '发帖', value: 'post' },
                    { label: '回帖', value: 'replay', default: true }
                ]
            },
            {
                key: 'sortOrder',
                group: '排序方式',
                compactLine: false,
                hideCompactTitle: false,
                isSingle: true,
                items: [
                    { label: '升序', value: 'asc' },
                    { label: '降序', value: 'desc', default: true }
                ]
            }
        ];
    }

    State.createDefaultAppState = function createDefaultAppState(groups) {
        return {
            theme: State.normalizeTheme(CURRENT_THEME),
            nameQuery: '',
            selections: State.buildDefaultSelections(groups),
            weights: State.normalizeWeightMap(Config.DEFAULT_WEIGHT_MAP)
        };
    }

    State.normalizeAppState = function normalizeAppState(candidateState, groups) {
        const fallback = State.createDefaultAppState(groups);
        if (!candidateState || typeof candidateState !== 'object') return fallback;

        const next = {
            theme: State.normalizeTheme(candidateState.theme),
            nameQuery: typeof candidateState.nameQuery === 'string' ? candidateState.nameQuery : '',
            selections: {},
            weights: State.normalizeWeightMap(candidateState.weights)
        };

        const sourceSelections = candidateState.selections && typeof candidateState.selections === 'object'
            ? candidateState.selections
            : {};

        groups.forEach(group => {
            const allowedValues = new Set(group.items.map(item => State.getItemValue(item)));
            const hasSavedValue = Object.prototype.hasOwnProperty.call(sourceSelections, group.key);
            const savedValue = sourceSelections[group.key];

            if (group.isSingle) {
                next.selections[group.key] = (hasSavedValue && allowedValues.has(savedValue))
                    ? savedValue
                    : getDefaultSingleValue(group);
                return;
            }

            if (hasSavedValue && Array.isArray(savedValue)) {
                const filtered = Array.from(new Set(savedValue)).filter(v => allowedValues.has(v));
                if (filtered.length > 0 || savedValue.length === 0) {
                    next.selections[group.key] = filtered;
                } else {
                    next.selections[group.key] = State.getDefaultMultiValue(group);
                }
                return;
            }

            next.selections[group.key] = State.getDefaultMultiValue(group);
        });

        return next;
    }
    State.loadAppStateWithGroups = function loadAppStateWithGroups(savedState, groups) {

        const normalizedState = State.normalizeAppState(savedState, groups);

        if (!savedState || (!savedState.theme && !savedState.style)) {
            normalizedState.theme = State.normalizeTheme(
                rankLocal.get(Config.STORAGE_KEYS.theme)
            );
        }

        return normalizedState;
    }

    State.persistAppState = function persistAppState(state) {
        rankLocal.set(Config.STORAGE_KEYS.appState, state);
        rankLocal.set(Config.STORAGE_KEYS.theme, state.theme);
    }
    Service.createConvertLEVELS = () => {
        // ---  正则缓存 (避免重复编译正则) ---
        const RE_RATE = /(\d+)%/;
        const RE_REPLY = /回帖([\s\S]*?)(?=发帖|▕▏|$)/;
        const RE_POST = /发帖([\s\S]*?)(?=▕▏|$)/;
        const RE_BLOCK_ATTR = /([^\s+\-、]+)([+-]\d+)/g;
        const RE_LINE_HEAD = /【\s*(?:等级\s*)?(\d+|Max|初级)\s*】(.+)/i;
        const RE_UPGRADE_HEAD = /升级条件[:：]\s*(.+)$/;
        const RE_COST_1 = /消耗\s*([-－]?\d+)\s*([^\d\s-－]+)/;
        const RE_COST_2 = /消耗\s*([^\d\s-－]+)\s*([-－]?\d+)/;
        const RE_COND_1 = /^([≥>≤<＜=]{1,2})\s*(\d+)\s*([^\d\s≥>≤<=]+)/;
        const RE_COND_2 = /^([^\d\s≥>≤<=]+)\s*([≥>≤<＜=]{1,2})\s*(\d+)/;


        /* ---------------- 基础解析工具 (parse) ---------------- */
        const parse = {
            /**
             * 解析概率百分比
             */
            Rate: (s = '') => {
                const m = s.match(RE_RATE);
                return m ? Number(m[1]) / 100 : 0;
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
                        target[m[1]] = Number(m[2]);
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
                        cost: Number(cost.replace('－', '-')),
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
                        value: Number(isStatFirst ? m[3] : m[2])
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

        return {
            parse: parse.Levels,
        };
    };
    const convertLEVELS = Service.createConvertLEVELS();
    /**
     * 排序数据
     * @param {Array} data
     * @param {String} levelTarget - 'max_yield'(最大收益) 'max_yield_1'(最大收益)  'max_level'(最高等级) 'date'(创建时间) 'price'(商店售价)
     * @param {String} actionType - 'post'(发帖), 'replay'(回帖), 'total'(两者之和)
     * @param {String} sortOrder - 'asc' 或 'desc'
     * @param {Array} enabledAttrs - 参与计算的属性
     * @param {Object} weightMap - 属性权重映射
     */
    Service.sortDataByScore = function sortDataByScore(data, levelTarget = 'max_yield_1', actionType = 'replay', sortOrder = 'desc', enabledAttrs = Config.ATTRIBUTE_KEYS, weightMap = Config.DEFAULT_WEIGHT_MAP) {
        const safeWeightMap = State.normalizeWeightMap(weightMap);
        const enabledSet = new Set(Array.isArray(enabledAttrs) ? enabledAttrs : []);
        const actionTypes = (actionType === 'total' ? ['post', 'replay'] : [actionType]).flat();

        const calculateLevelScore = (levelObj = {}) => {
            const safeRate = Number.isFinite(Number(levelObj.rate)) ? Number(levelObj.rate) : 0;
            let score = 0;
            actionTypes.forEach(type => {
                const resources = levelObj[type] && typeof levelObj[type] === 'object' ? levelObj[type] : {};
                Object.entries(resources).forEach(([key, value]) => {
                    if (!enabledSet.has(key)) return;
                    score += (Number(value) || 0) * (safeWeightMap[key] || 0) * safeRate;
                });
            });
            return score;
        };
        const formatDescText = (obj = {}) => {
            return Object.entries(obj)
                .map(([key, val]) => {
                    const num = Number(val) || 0;
                    return num > 0 ? `${key}+${num}` : `${key}${num}`;
                })
                .join(' ');
        };
        const RE_Price = /(\d+)(\S+)/;
        const parseScalarMetric = (item, metricKey) => {
            const raw = item?.[metricKey];
            if (raw === null || raw === undefined || raw === '') return 0;
            if (metricKey === "price") {
                const r = raw.match(RE_Price)
                return r ? (Number(r[1]) || 0) * (Config.DEFAULT_WEIGHT_MAP[r[2]] || 0) : 0;
            }
            if (metricKey === "date") {
                return raw.split('-')
                    .map(part => part.padStart(2, '0'))
                    .join('-');
            }
            return raw
        };
        const upgradeCost = (levelsObj) => {
            let requirementStats = {};
            const result = {};
            const maxOps = [">", ">=", "≥"];

            for (const lvl of Object.keys(levelsObj)) {
                const { upgrade } = levelsObj[lvl];
                const range = {};

                // 复制当前的维持条件
                for (const [k, v] of Object.entries(requirementStats)) {
                    range[k] = { lower: v, upper: null };
                }

                // 处理当前等级的属性阈值
                if (upgrade?.stat && maxOps.includes(upgrade.operator)) {
                    range[upgrade.stat] ??= { lower: { op: "≥", val: 0 }, upper: null };
                    range[upgrade.stat].upper = {
                        op: upgrade.operator,
                        val: upgrade.value,
                    };
                }

                result[lvl] = range;

                if (!upgrade) continue;

                if (upgrade.type === "消耗") {
                    requirementStats = {}; // 消耗型升级通常重置之前的属性维持条件
                } else if (upgrade.stat && maxOps.includes(upgrade.operator)) {
                    const cur = requirementStats[upgrade.stat];
                    if (!cur || upgrade.value > cur.val) {
                        requirementStats[upgrade.stat] = {
                            op: upgrade.operator,
                            val: upgrade.value,
                        };
                    }
                }
            }
            return result;
        }
        const pickTargetLevel = (levels) => {
            const levelMap = levels && typeof levels === 'object' ? levels : convertLEVELS.parse(levels);
            const keys = Object.keys(levelMap);
            if (!keys.length) return { levelKey: '-', levelObj: null };

            if (levelTarget === 'max_level' || levelTarget === 'date' || levelTarget === 'price') {
                if (Object.prototype.hasOwnProperty.call(levelMap, 'Max')) {
                    return { levelKey: 'Max', levelObj: levelMap.Max };
                }
                const lastKey = keys[keys.length - 1];
                return { levelKey: lastKey, levelObj: levelMap[lastKey] };
            }
            let costData
            if (levelTarget === 'max_yield_1'){
                costData = upgradeCost(levelMap)
            }
            let bestKey = keys[keys.length - 1];
            let bestObj = levelMap[bestKey];
            let bestScore = calculateLevelScore(bestObj);

            keys.forEach(key => {
                const currentObj = levelMap[key];
                const currentScore = calculateLevelScore(currentObj);
                if (currentScore > bestScore) {
                    if (costData) {
                        const conds = costData[key] || {};
                        const isTooSmall = Object.values(conds).some(({ lower, upper }) => {
                            return upper && upper.val - lower.val <= 6;
                        });
                        if (isTooSmall) return
                    }
                    bestKey = key;
                    bestObj = currentObj;
                    bestScore = currentScore;
                }
            });

            return { levelKey: bestKey, levelObj: bestObj };
        };

        const processed = data.map(item => {

            const { levelKey, levelObj } = pickTargetLevel(item?.levels, item.name);

            let score
            if (levelTarget === 'date' || levelTarget === 'price') {
                score = parseScalarMetric(item, levelTarget);

            } else {
                score = levelObj ? calculateLevelScore(levelObj) : 0;
            }

            const descParts = [];


            if (actionTypes.includes('replay') && levelObj?.replay) {
                const text = formatDescText(levelObj.replay);
                if (text) descParts.push(`回帖${text}`);
            }

            if (actionTypes.includes('post') && levelObj?.post) {
                const text = formatDescText(levelObj.post);
                if (text) descParts.push(`发帖${text}`);
            }

            if (levelObj?.other) {
                const text = levelObj.other;
                if (text) descParts.push(`${text}`);
            }

            const ratePercent = levelObj ? Math.round((Number(levelObj.rate) || 0) * 100) : 0;
            const descText = levelObj
                ? `${ratePercent}% ${descParts.join('、') || '无属性'}`
                : '0% 无属性';

            return {
                ...item,
                score,
                levelKey,
                desc: descText
            };
        });
        if (levelTarget === 'date') {
            processed.sort((a, b) => sortOrder === 'asc' ? Date.parse(String(a.score)) - Date.parse(String(b.score)) : Date.parse(String(b.score)) - Date.parse(String(a.score)));

        } else if (levelTarget === 'price') {
            processed.sort((a, b) => sortOrder === 'asc' ? a.score - b.score : b.score - a.score);
        }
        else {
            processed.sort((a, b) => sortOrder === 'asc' ? a.score - b.score : b.score - a.score);

        }

        return processed.map((item, index) => ({ ...item, rank: index + 1 }));
    }

    Service.applyFilters = function applyFilters(rawData, state) {
        const selections = state?.selections || {};
        const typeValues = Array.isArray(selections.types) ? selections.types : [];
        const selectedTypes = new Set(typeValues);
        const keyword = String(state?.nameQuery || '').trim().toLowerCase();
        if (typeValues.length === 0) return [];

        // 每次都基于原始数据筛选，避免“在已过滤结果上叠加过滤”导致点击项被误伤
        const filtered = rawData.filter(item => {
            const itemType = item?.type || '未知';
            if (!selectedTypes.has(itemType)) return false;
            if (keyword) {
                const name = String(item.name).toLowerCase();
                if (!name.includes(keyword)) return false;
            }
            return true;
        });

        return Service.sortDataByScore(
            filtered,
            selections.levelTarget,
            selections.actionType,
            selections.sortOrder,
            selections.attrs,
            state?.weights
        );
    }

    /**
     * 权重设置Dialog弹出面板
     * @param {string} initialTheme - 主题
     * @param {Obj} handlers - 插入函数
     */
    Components.createAttributeWeightDialog = function createAttributeWeightDialog(initialTheme, handlers) {
        const mask = document.createElement('div');
        mask.className = 'rank-dialog-mask';
        const dialog = document.createElement('div');
        dialog.className = 'rank-dialog';
        dialog.innerHTML = `
            <div class="rank-dialog-header">属性权重设置</div>
            <div class="rank-dialog-body"></div>
            <div class="rank-dialog-footer">
                <button type="button" class="rank-dialog-btn js-reset">重置</button>
                <button type="button" class="rank-dialog-btn js-cancel">取消</button>
                <button type="button" class="rank-dialog-btn primary js-save">保存</button>
            </div>
        `;
        mask.appendChild(dialog);
        document.body.appendChild(mask);

        const body = dialog.querySelector('.rank-dialog-body');
        const resetBtn = dialog.querySelector('.js-reset');
        const cancelBtn = dialog.querySelector('.js-cancel');
        const saveBtn = dialog.querySelector('.js-save');
        let draftWeights = State.normalizeWeightMap(Config.DEFAULT_WEIGHT_MAP);

        const renderRows = () => {
            body.innerHTML = '';
            Config.ATTRIBUTE_KEYS.forEach(key => {
                const row = document.createElement('div');
                row.className = 'rank-dialog-row';
                row.innerHTML = `
                    <span class="rank-dialog-key">${Util.escapeHTML(key)}</span>
                    <input class="rank-dialog-input" data-key="${Util.escapeHTML(key)}" type="number" step="1" value="${draftWeights[key]}">
                `;
                body.appendChild(row);
            });
        };

        const setTheme = (theme) => {
            Util.applyThemeClass(dialog, theme);
        };

        const close = () => {
            Util.unlockToolbarAutoClose('attr_dialog');
            mask.classList.remove('show');
        };

        const open = (weights, theme) => {
            Util.lockToolbarAutoClose('attr_dialog');
            draftWeights = State.normalizeWeightMap(weights);
            renderRows();
            setTheme(theme || initialTheme);
            mask.classList.add('show');
        };

        mask.addEventListener('click', (e) => {
            if (e.target === mask) close();
        });

        cancelBtn.onclick = () => close();
        resetBtn.onclick = () => {
            draftWeights = State.normalizeWeightMap(Config.DEFAULT_WEIGHT_MAP);
            renderRows();
        };
        saveBtn.onclick = () => {
            const nextWeights = {};
            const inputs = body.querySelectorAll('.rank-dialog-input');
            inputs.forEach(input => {
                const key = input.getAttribute('data-key');
                const value = Number(input.value);
                nextWeights[key] = Number.isFinite(value) ? value : Config.DEFAULT_WEIGHT_MAP[key];
            });
            handlers.onSave(State.normalizeWeightMap(nextWeights));
            close();
        };

        return { open, close, setTheme };
    }

    Components.createControlBar = function createControlBar(initialState, handlers) {
        const element = document.createElement('div');
        element.className = 'rank-control-bar';

        const title = document.createElement('span');
        title.className = 'rank-control-title';
        title.textContent = '搜索';

        const inputWrap = document.createElement('div');
        inputWrap.className = 'rank-name-input-wrap';

        const input = document.createElement('input');
        input.className = 'rank-name-input';
        input.type = 'text';
        input.placeholder = '输入勋章名称进行搜索...';
        input.value = initialState.nameQuery || '';

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'rank-name-clear-btn';
        clearBtn.textContent = '×';
        clearBtn.setAttribute('aria-label', '清除搜索');

        let isComposing = false;
        let debounceTimer = null;
        let lastEmittedValue = input.value;

        const updateClearButton = () => {
            clearBtn.classList.toggle('show', input.value.length > 0);
        };

        const emitNameChange = (value) => {
            if (value === lastEmittedValue) return;
            lastEmittedValue = value;
            handlers.onNameChange(value);
        };

        const scheduleEmitNameChange = (immediate = false) => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
                debounceTimer = null;
            }
            if (immediate) {
                emitNameChange(input.value);
                return;
            }
            debounceTimer = setTimeout(() => {
                emitNameChange(input.value);
            }, Config.SEARCH_INPUT_DEBOUNCE_MS);
        };

        input.addEventListener('focus', () => Util.lockToolbarAutoClose('search_focus'));
        input.addEventListener('blur', () => Util.unlockToolbarAutoClose('search_focus'));
        input.addEventListener('compositionstart', () => {
            isComposing = true;
        });
        input.addEventListener('compositionend', () => {
            isComposing = false;
            updateClearButton();
            scheduleEmitNameChange(false);
        });
        input.addEventListener('input', () => {
            updateClearButton();
            if (isComposing) return;
            scheduleEmitNameChange(false);
        });

        clearBtn.addEventListener('mousedown', (e) => e.preventDefault());
        clearBtn.addEventListener('click', () => {
            if (!input.value) return;
            input.value = '';
            updateClearButton();
            scheduleEmitNameChange(true);
            input.focus();
        });

        inputWrap.appendChild(input);
        inputWrap.appendChild(clearBtn);
        updateClearButton();

        const styleSwitch = document.createElement('div');
        styleSwitch.className = 'rank-style-switch';

        const lightBtn = document.createElement('button');
        lightBtn.type = 'button';
        lightBtn.className = 'rank-style-btn mode-light';
        lightBtn.textContent = '浅色';
        lightBtn.onclick = () => handlers.onThemeChange('light');

        const darkBtn = document.createElement('button');
        darkBtn.type = 'button';
        darkBtn.className = 'rank-style-btn mode-dark';
        darkBtn.textContent = '深色';
        darkBtn.onclick = () => handlers.onThemeChange('dark');

        styleSwitch.appendChild(lightBtn);
        styleSwitch.appendChild(darkBtn);

        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'rank-reset-btn';
        resetBtn.innerHTML = (Config.ICONS?.重置 ?? '') + '重置';
        resetBtn.onclick = () => handlers.onReset();

        const filterToggleBtn = document.createElement('button');
        filterToggleBtn.type = 'button';
        filterToggleBtn.className = 'rank-filter-toggle-btn';
        filterToggleBtn.innerHTML = (Config.ICONS?.筛选 ?? '') + '筛选';
        filterToggleBtn.onclick = () => {
            if (typeof handlers.onFilterToggle === 'function') {
                handlers.onFilterToggle();
            }
        };

        const favoriteStatsBtn = document.createElement('button');
        favoriteStatsBtn.type = 'button';
        favoriteStatsBtn.className = 'favorite-stats-toggle-btn';
        favoriteStatsBtn.innerHTML = (Config.ICONS?.统计 ?? '') + '收藏';
        favoriteStatsBtn.onclick = () => {
            if (typeof handlers.onFavoriteStatsToggle === 'function') {
                handlers.onFavoriteStatsToggle();
            }
        };

        element.appendChild(title);
        element.appendChild(inputWrap);
        element.appendChild(styleSwitch);
        element.appendChild(favoriteStatsBtn);
        element.appendChild(filterToggleBtn);
        element.appendChild(resetBtn);

        const sync = (nextState, panelState = {}) => {
            if (input.value !== nextState.nameQuery) input.value = nextState.nameQuery || '';
            lastEmittedValue = input.value;
            updateClearButton();
            lightBtn.classList.toggle('active', nextState.theme === 'light');
            darkBtn.classList.toggle('active', nextState.theme === 'dark');
            filterToggleBtn.classList.toggle('active', !!panelState.filterVisible);
            favoriteStatsBtn.classList.toggle('active', !!panelState.favoriteVisible);
        };

        sync(initialState);
        return { element, sync };
    }

    App.getDynamicViewportHeight = function getDynamicViewportHeight() {
        if (window.visualViewport && Number.isFinite(window.visualViewport.height)) {
            return window.visualViewport.height;
        }
        return window.innerHeight;
    }

    App.isPanelVisible = function isPanelVisible(rankBar) {
        if (!rankBar?.panel || !rankBar.isWindowOpen) return false;
        return rankBar.panel.style.display !== 'none';
    }

    App.syncOverlayLayouts = function syncOverlayLayouts(controlBar, favoriteStatsPanel, filterPanel) {
        const controlHeight = Math.ceil(controlBar.element.getBoundingClientRect().height) || 0;
        const overlayTop = `${controlHeight + 4}px`;
        favoriteStatsPanel.element.style.top = overlayTop;
        if (filterPanel) filterPanel.element.style.top = overlayTop;
    }

    App.syncBoardWindowHeight = function syncBoardWindowHeight(context) {
        const panelVisible = App.isPanelVisible(context.rankBar);
        App.syncOverlayLayouts(context.controlBar, context.favoriteStatsPanel, context.filterPanel);
        const measuredFilterHeight = Math.ceil(context.controlBar.element.getBoundingClientRect().height);
        const measuredPanelHeaderHeight = context.panelHeader ? Math.ceil(context.panelHeader.getBoundingClientRect().height) : 0;

        if (measuredFilterHeight > 0) context.cachedFilterHeight = measuredFilterHeight;
        if (measuredPanelHeaderHeight > 0) context.cachedPanelHeaderHeight = measuredPanelHeaderHeight;

        const filterHeight = panelVisible ? (measuredFilterHeight || context.cachedFilterHeight) : context.cachedFilterHeight;
        const panelHeaderHeight = panelVisible ? (measuredPanelHeaderHeight || context.cachedPanelHeaderHeight) : context.cachedPanelHeaderHeight;
        const nextHeight = Math.max(180, Math.floor(App.getDynamicViewportHeight() - filterHeight - panelHeaderHeight) - 20);
        context.win.style.height = `${nextHeight}px`;
        if (clusterInstance) clusterInstance.refresh(true);
    }

    App.requestSyncBoardWindowHeight = function requestSyncBoardWindowHeight(context) {
        requestAnimationFrame(() => App.syncBoardWindowHeight(context));
    }

    App.requestSyncBoardWindowHeightBurst = function requestSyncBoardWindowHeightBurst(context) {
        App.requestSyncBoardWindowHeight(context);
        setTimeout(() => App.requestSyncBoardWindowHeight(context), 60);
        setTimeout(() => App.requestSyncBoardWindowHeight(context), 180);
    }

    App.renderByState = function renderByState(context) {
        context.currentThemeRef.value = State.normalizeTheme(context.appStateRef.value.theme);
        context.groupsRef.value = Service.buildFilterGroups(context.rawData, context.appStateRef.value.weights);
        context.tagComp.setGroups(context.groupsRef.value);
        Util.applyThemeClass(context.panelRoot, context.currentThemeRef.value);
        Util.setBoardTheme(context.win, context.headerEl, context.currentThemeRef.value);
        Util.applyToolbarPanelTheme(context.rankBar.panel, context.panelBody, context.currentThemeRef.value);
        context.attrDialog.setTheme(context.currentThemeRef.value);
        context.favoriteStatsPanel.setData({
            favoriteState: context.favoriteStateRef.value,
            theme: context.currentThemeRef.value
        });
        context.filterPanel.setTheme(context.currentThemeRef.value);
        App.syncOverlayLayouts(context.controlBar, context.favoriteStatsPanel, context.filterPanel);
        const rows = Service.applyFilters(context.rawData, context.appStateRef.value);

        context.tagComp.setSelectionState(context.appStateRef.value.selections);
        context.controlBar.sync(context.appStateRef.value, {
            filterVisible: !!context.filterPanel?.visible,
            favoriteVisible: !!context.favoriteStatsPanel?.visible
        });
        App.requestSyncBoardWindowHeight(context.layoutContext);
        Components.updateRowBgLength(rows);
    }

    App.setState = function setState(context, nextStateOrUpdater) {
        const nextState = typeof nextStateOrUpdater === 'function'
            ? nextStateOrUpdater(context.appStateRef.value)
            : nextStateOrUpdater;
        const nextGroups = Service.buildFilterGroups(context.rawData, State.normalizeWeightMap(nextState?.weights || context.appStateRef.value.weights));
        context.appStateRef.value = State.normalizeAppState(nextState, nextGroups);
        context.groupsRef.value = nextGroups;
        State.persistAppState(context.appStateRef.value);
        App.renderByState(context);
    }
    App.start = async function start() {
        const startTime = new Date().getTime();

        Util.bindExternalAutoCloseLocks();
        if (typeof Clusterize === 'undefined') return setTimeout(App.start, 100);

        const panelBody = myRankBar.panel.querySelector('.p-body');
        if (!panelBody) return;

        let raw;
        try {
            raw = await idbstorage.model('award_info').getAll();
        } catch {
            const response = await fetch('https://raw.githubusercontent.com/SaltFish-X/GM-Script/main/src/json/medal.json');
            raw = await response.json();
        }

        const rawData = Array.isArray(raw) ? raw : [];
        const savedRawState = rankLocal.get(Config.STORAGE_KEYS.appState, null);
        const finalWeights = savedRawState && savedRawState.weights
            ? State.normalizeWeightMap(savedRawState.weights)
            : State.normalizeWeightMap(Config.DEFAULT_WEIGHT_MAP);

        let groups = Service.buildFilterGroups(rawData, finalWeights);
        let appState = State.loadAppStateWithGroups(savedRawState, groups);
        CURRENT_THEME = State.normalizeTheme(appState.theme);

        let filterPanel = null;
        let favoriteStatsPanel = null;
        let layoutContext = null;

        const attrDialog = Components.createAttributeWeightDialog(CURRENT_THEME, {
            onSave: (nextWeights) => {
                setState((prev) => ({ ...prev, weights: nextWeights }));
            }
        });

        const controlBar = Components.createControlBar(appState, {
            onNameChange: (nameQuery) => {
                setState((prev) => ({ ...prev, nameQuery }));
            },
            onThemeChange: (theme) => {
                setState((prev) => ({ ...prev, theme: State.normalizeTheme(theme) }));
            },
            onFilterToggle: () => {
                if (!filterPanel) return;
                if (favoriteStatsPanel?.visible) favoriteStatsPanel.hide();
                filterPanel.toggle();
                App.requestSyncBoardWindowHeight(layoutContext);
            },
            onFavoriteStatsToggle: () => {
                if (!favoriteStatsPanel) return;
                if (favoriteStatsPanel.visible) {
                    favoriteStatsPanel.hide();
                } else {
                    filterPanel?.hide();
                    favoriteStatsPanel.setData({ favoriteState: appRefs.favoriteStateRef.value });
                    favoriteStatsPanel.show();
                    App.requestSyncBoardWindowHeight(layoutContext);
                }
            },
            onReset: () => {
                const resetState = State.createDefaultAppState(groups);
                resetState.theme = CURRENT_THEME;
                resetState.weights = { ...appState.weights };
                setState(resetState);
            }
        });

        const tagComp = new Components.TagGroupComponent(groups, appState.selections, {
            onChange: (groupKey, nextValue) => {
                setState((prev) => ({
                    ...prev,
                    selections: {
                        ...prev.selections,
                        [groupKey]: nextValue
                    }
                }));
            },
            onAction: ({ action }) => {
                if (action === 'open_attr_weight_dialog') {
                    attrDialog.open(appState.weights, appState.theme);
                }
            }
        });

        const panelRoot = document.createElement('div');
        panelRoot.className = 'rank-panel-root';

        favoriteStatsPanel = new Components.FavoriteStatsPanel({
            favoriteState,
            rawData,
            weightMap: Config.DEFAULT_WEIGHT_MAP_1,
            theme: appState.theme,
            storageManager: rankLocal,
            storageKey: Config.STORAGE_KEYS.favoriteState,
            onChange: (nextFavoriteState) => {
                favoriteState = State.normalizeFavoriteState(nextFavoriteState);
                if (appRefs) appRefs.favoriteStateRef.value = favoriteState;
                App.renderByState(appRefs);
            },
            onVisibilityChange: () => {
                controlBar.sync(appState, {
                    filterVisible: !!filterPanel?.visible,
                    favoriteVisible: !!favoriteStatsPanel?.visible
                });
                App.requestSyncBoardWindowHeight(layoutContext);
            }
        });

        const originalCloseWindow = myRankBar.closeWindow;
        myRankBar.closeWindow = function () {
            if (favoriteStatsPanel && favoriteStatsPanel.visible) {
                favoriteStatsPanel.destroyPickerPortal();
            }
            originalCloseWindow.apply(this, arguments);
        };

        const win = document.createElement('div');
        const headerId = 'rank-info-header';
        const scrollId = 'rank-info-scroll';
        const contentId = 'rank-info-list';
        win.id = 'rank-info-window';
        win.innerHTML = `<div id="${headerId}" class="rank-info-header"></div><div id="${scrollId}" class="clusterize-scroll"><div id="${contentId}" class="clusterize-content"></div></div>`;
        const headerEl = win.querySelector(`#${headerId}`);

        filterPanel = new Components.FilterPanel({
            theme: appState.theme,
            onVisibilityChange: () => {
                controlBar.sync(appState, {
                    filterVisible: !!filterPanel?.visible,
                    favoriteVisible: !!favoriteStatsPanel?.visible
                });
                App.requestSyncBoardWindowHeight(layoutContext);
            }
        });
        filterPanel.mountContent(tagComp.element);

        panelBody.innerHTML = '';
        panelRoot.appendChild(controlBar.element);
        panelRoot.appendChild(favoriteStatsPanel.element);
        panelRoot.appendChild(filterPanel.element);
        panelRoot.appendChild(win);
        panelBody.appendChild(panelRoot);

        clusterInstance = new Clusterize({
            rows: [],
            scrollId,
            contentId,
            tag: 'div',
            rows_in_block: 50,
            blocks_in_cluster: 3
        });

        Components.bindEvents(document.getElementById(scrollId), document.getElementById(contentId), {
            onFavoriteStateChange: (nextFavoriteState) => {
                favoriteState = State.normalizeFavoriteState(nextFavoriteState);
                if (appRefs) appRefs.favoriteStateRef.value = favoriteState;
            }
        });

        const appRefs = {
            rawData,
            panelRoot,
            panelBody,
            win,
            headerEl,
            rankBar: myRankBar,
            controlBar,
            tagComp,
            attrDialog,
            favoriteStatsPanel,
            filterPanel,
            currentThemeRef: { value: CURRENT_THEME },
            favoriteStateRef: { value: favoriteState },
            appStateRef: { value: appState },
            groupsRef: { value: groups }
        };

        layoutContext = {
            rankBar: myRankBar,
            controlBar,
            favoriteStatsPanel,
            filterPanel,
            panelHeader: myRankBar.panel.querySelector('.p-header'),
            win,
            cachedFilterHeight: 260,
            cachedPanelHeaderHeight: 54
        };
        appRefs.layoutContext = layoutContext;

        window.addEventListener('resize', () => App.requestSyncBoardWindowHeight(layoutContext), { passive: true });
        if (window.visualViewport) window.visualViewport.addEventListener('resize', () => App.requestSyncBoardWindowHeight(layoutContext), { passive: true });
        myRankBar.panel.addEventListener('animationend', () => App.requestSyncBoardWindowHeightBurst(layoutContext));

        const myRankPanelObserver = new MutationObserver(() => {
            if (App.isPanelVisible(myRankBar)) {
                App.requestSyncBoardWindowHeightBurst(layoutContext);
            }
        });
        myRankPanelObserver.observe(myRankBar.panel, { attributes: true, attributeFilter: ['style', 'class'] });

        const setState = (nextStateOrUpdater) => {
            App.setState(appRefs, nextStateOrUpdater);
            appState = appRefs.appStateRef.value;
            groups = appRefs.groupsRef.value;
            CURRENT_THEME = appRefs.currentThemeRef.value;
            favoriteState = appRefs.favoriteStateRef.value;
        };

        App.renderByState(appRefs);
        appState = appRefs.appStateRef.value;
        groups = appRefs.groupsRef.value;
        CURRENT_THEME = appRefs.currentThemeRef.value;
        favoriteState = appRefs.favoriteStateRef.value;

        const endTime = new Date().getTime();
        console.log('[RankBoard] 耗时：', `${endTime - startTime}ms`);
    };

    // const {
    //     Util.escapeHTML, getHeaderHtml, applyThemeClass, setBoardTheme, applyToolbarPanelTheme,
    //     formatResourceText, formatUpgradeText, formatStatNumber, formatLevelDisplayText,
    //     createEmptyAttrTotals, buildLevelMetaTexts, mergeAttrTotals,
    //     lockToolbarAutoClose, unlockToolbarAutoClose, isToolbarAutoCloseLocked,
    //     bindExternalAutoCloseLocks, Tooltip
    // } = Util;
    // const {
    //     normalizeTheme, normalizeWeightMap, isPlainObject, normalizeFavoriteState,
    //     loadFavoriteState, saveFavoriteState, isFavoriteItem, getFavoriteTypeCount,
    //     canAddFavoriteItem, toggleFavoriteItem, getItemValue, getDefaultSingleValue,
    //     getDefaultMultiValue, buildDefaultSelections, createDefaultAppState,
    //     normalizeAppState, loadAppStateWithGroups, persistAppState
    // } = State;
    // const {
    //     DataToTag, getLevelMap, compareLevelKey, getSortedLevelKeys, resolveFavoriteLevelKey,
    //     getLevelAttrTotalsByMode, sortTypesByRules, buildAttributeItems, buildFilterGroups,
    //     createConvertLEVELS, sortDataByScore, applyFilters, LocalStorageManager, IdbStorageManager
    // } = Service;
    // const {
    //     renderRow, updateRowBgLength, bindEvents, createAttributeWeightDialog,
    //     createControlBar, SideToolbar, FloatingFilterPanel, TagGroupComponent, FavoriteStatsPanel
    // } = Components;
    App.start().catch(error => {
        console.error('[RankBoard] 初始化失败', error);
    });
})();