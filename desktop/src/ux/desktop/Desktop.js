/**
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 *
 * @class Ext.ux.desktop.Desktop
 * @extends Ext.panel.Panel
 * <p>This class manages the wallpaper, shortcuts and taskbar.</p>
 */
Ext.define('Admin.ux.desktop.Desktop', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.uxdesktop',

    uses: [
        'Ext.util.MixedCollection',
        'Ext.menu.Menu',
        'Ext.view.View', // dataview
        'Ext.window.Window',

        'Admin.ux.desktop.TaskBar',
        'Admin.ux.desktop.Wallpaper'
    ],

    activeWindowCls: 'ux-desktop-active-win',
    inactiveWindowCls: 'ux-desktop-inactive-win',
    lastActiveWindow: null,

    border: false,
    html: '&#160;',
    layout: 'fit',

    xTickSize: 1,
    yTickSize: 1,

    app: null,

    /**
     * @cfg {Array/Ext.data.Store} shortcuts
     * The items to add to the DataView. This can be a {@link Ext.data.Store Store} or a
     * simple array. Items should minimally provide the fields in the
     * {@link Ext.ux.desktop.ShortcutModel Shortcut}.
     */
    shortcuts: null,

    /**
     * @cfg {String} shortcutItemSelector
     * This property is passed to the DataView for the desktop to select shortcut items.
     * If the {@link #shortcutTpl} is modified, this will probably need to be modified as
     * well.
     */
    shortcutItemSelector: 'div.ux-desktop-shortcut',

    /**
     * @cfg {String} shortcutTpl
     * This XTemplate is used to render items in the DataView. If this is changed, the
     * {@link #shortcutItemSelector} will probably also need to changed.
     */
    /* eslint-disable indent */
    shortcutTpl: [
        '<tpl for=".">',
            '<div class="ux-desktop-shortcut" id="{name}-shortcut">',
                '<div class="ux-desktop-shortcut-icon {iconCls}">',
                    '<img src="', Ext.BLANK_IMAGE_URL, '" title="{name}">',
                '</div>',
                '<span class="ux-desktop-shortcut-text">{name}</span>',
            '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
    ],
    /* eslint-enable indent */

    /**
     * @cfg {Object} taskbarConfig
     * The config object for the TaskBar.
     */
    taskbarConfig: null,

    windowMenu: null,

    // initComponent: function() {
    //     var me = this,
    //         wallpaper;
    //
    //     me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());
    //
    //     me.bbar = me.taskbar = new Ext.ux.desktop.TaskBar(me.taskbarConfig);
    //     me.taskbar.windowMenu = me.windowMenu;
    //
    //     me.windows = new Ext.util.MixedCollection();
    //
    //     me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());
    //
    //     me.items = [
    //         { xtype: 'wallpaper', id: me.id + '_wallpaper' },
    //         me.createDataView()
    //     ];
    //
    //     me.callParent();
    //
    //     me.shortcutsView = me.items.getAt(1);
    //     me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);
    //
    //     wallpaper = me.wallpaper;
    //
    //     me.wallpaper = me.items.getAt(0);
    //
    //     if (wallpaper) {
    //         me.setWallpaper(wallpaper, me.wallpaperStretch);
    //     }
    // },
    /**
     * 1. TaskBar换成自己的
     */
    initComponent: function() {
        var me = this,
            wallpaper;

        me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());

        me.bbar = me.taskbar = new Admin.ux.desktop.TaskBar(me.taskbarConfig);
        me.taskbar.windowMenu = me.windowMenu;

        me.windows = new Ext.util.MixedCollection();

        me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());

        me.items = [
            { xtype: 'uxwallpaper', id: me.id + '_wallpaper' },
            me.createDataView()
        ];

        me.callParent();

        me.shortcutsView = me.items.getAt(1);
        me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);

        wallpaper = me.wallpaper;

        me.wallpaper = me.items.getAt(0);

        if (wallpaper) {
            me.setWallpaper(wallpaper, me.wallpaperStretch);
        }
    },

    /**
     * 桌面图标布局
     */
    initShortcut : function() {
        var btnHeight = 64;
        var btnWidth = 64;
        var btnPadding = 30;
        var col = {index : 1,x : btnPadding};
        var row = {index : 1,y : btnPadding};
        var bottom;
        var numberOfItems = 0;
        var taskBarHeight = Ext.query(".ux-taskbar")[0].clientHeight + 40;
        var bodyHeight = Ext.getBody().getHeight() - taskBarHeight;
        var items = Ext.query(".ux-desktop-shortcut");

        for (var i = 0, len = items.length; i < len; i++) {
            numberOfItems += 1;
            bottom = row.y + btnHeight;
            if (((bodyHeight < bottom) ? true : false) && bottom > (btnHeight + btnPadding)) {
                numberOfItems = 0;
                col = {index : col.index++,x : col.x + btnWidth + btnPadding};
                row = {index : 1,y : btnPadding};
            }
            Ext.fly(items[i]).setXY([col.x, row.y]);
            row.index++;
            row.y = row.y + btnHeight + btnPadding;
        }
    },

    /**
     * 渲染后调整桌面图标
     */
    afterRender: function() {
        var me = this;

        me.callParent();
        me.el.on('contextmenu', me.onDesktopMenu, me);

        Ext.Function.defer(me.initShortcut,1);
    },

    //------------------------------------------------------
    // Overrideable configuration creation methods

    /**
     * 桌面改变大小时，桌面图标调整
     * @returns {{trackOver: boolean, tpl, xtype: string, listeners: {resize: Ext.ux.desktop.Admin.initShortcut}, overItemCls: string, x: number, itemSelector: (string|*), y: number, style: {position: string}, store: (null|*)}}
     */
    createDataView: function() {
        var me = this;

        return {
            xtype: 'dataview',
            overItemCls: 'x-view-over',
            trackOver: true,
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
            style: {
                position: 'absolute'
            },
            x: 0,
            y: 0,
            tpl: new Ext.XTemplate(me.shortcutTpl),
            //
            listeners:{
                resize:me.initShortcut
            }
        };
    },

    /**
     * 桌面右键菜单
     * @returns {{items: ([{handler: *, scope: *, text: string}]|[{handler: *, scope: *, text: string}]|*|*[])}}
     */
    createDesktopMenu: function() {
        var me = this,
            ret = {
                items: me.contextMenuItems || []
            };

        if (ret.items.length) {
            ret.items.push('-');
        }

        ret.items.push(
            { text: '平铺', handler: me.tileWindows, scope: me, minWindows: 1 },
            { text: '错位', handler: me.cascadeWindows, scope: me, minWindows: 1 },
        );

        return ret;
    },

    /**
     * 窗体右上角按钮
     * @returns {{listeners: {hide: (Ext.ux.desktop.Admin.onWindowMenuHide|*), scope: Ext.ux.desktop.Desktop, beforeshow: (Ext.ux.desktop.Admin.onWindowMenuBeforeShow|*)}, defaultAlign: string, items: [{handler: (Ext.ux.desktop.Admin.onWindowMenuRestore|*), scope: Ext.ux.desktop.Desktop, text: string},{handler: (Ext.ux.desktop.Admin.onWindowMenuMinimize|*), scope: Ext.ux.desktop.Desktop, text: string},{handler: (Ext.ux.desktop.Admin.onWindowMenuMaximize|*), scope: Ext.ux.desktop.Desktop, text: string},string,{handler: (Ext.ux.desktop.Admin.onWindowMenuClose|*), scope: Ext.ux.desktop.Desktop, text: string}]}}
     */
    createWindowMenu: function() {
        var me = this;

        return {
            defaultAlign: 'br-tr',
            items: [
                { text: '显示', handler: me.onWindowMenuRestore, scope: me },
                { text: '最小化', handler: me.onWindowMenuMinimize, scope: me },
                { text: '最大化', handler: me.onWindowMenuMaximize, scope: me },
                '-',
                { text: '关闭', handler: me.onWindowMenuClose, scope: me }
            ],
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    },

    //------------------------------------------------------
    // Event handler methods

    onDesktopMenu: function(e) {
        var me = this,
            menu = me.contextMenu;

        e.stopEvent();

        if (!menu.rendered) {
            menu.on('beforeshow', me.onDesktopMenuBeforeShow, me);
        }

        menu.showAt(e.getXY());
        menu.doConstrain();
    },

    onDesktopMenuBeforeShow: function(menu) {
        var me = this,
            count = me.windows.getCount();

        menu.items.each(function(item) {
            var min = item.minWindows || 0;

            item.setDisabled(count < min);
        });
    },

    onShortcutItemClick: function(dataView, record) {
        var me = this,
            module = me.app.getModule(record.data.module),
            win = module && module.createWindow();

        if (win) {
            me.restoreWindow(win);
        }
    },

    onWindowClose: function(win) {
        var me = this;

        me.windows.remove(win);
        me.taskbar.removeTaskButton(win.taskButton);
        me.updateActiveWindow();
    },

    //------------------------------------------------------
    // Window context menu handlers

    onWindowMenuBeforeShow: function(menu) {
        var items = menu.items.items,
            win = menu.theWin;

        items[0].setDisabled(win.maximized !== true && win.hidden !== true); // Restore
        items[1].setDisabled(win.minimized === true); // Minimize
        items[2].setDisabled(win.maximized === true || win.hidden === true); // Maximize
    },

    onWindowMenuClose: function() {
        var me = this,
            win = me.windowMenu.theWin;

        win.close();
    },

    onWindowMenuHide: function(menu) {
        Ext.defer(function() {
            menu.theWin = null;
        }, 1);
    },

    onWindowMenuMaximize: function() {
        var me = this,
            win = me.windowMenu.theWin;

        win.maximize();
        win.toFront();
    },

    onWindowMenuMinimize: function() {
        var me = this,
            win = me.windowMenu.theWin;

        win.minimize();
    },

    onWindowMenuRestore: function() {
        var me = this,
            win = me.windowMenu.theWin;

        me.restoreWindow(win);
    },

    //------------------------------------------------------
    // Dynamic (re)configuration methods

    getWallpaper: function() {
        return this.wallpaper.wallpaper;
    },

    setTickSize: function(xTickSize, yTickSize) {
        var me = this,
            xt = me.xTickSize = xTickSize,
            yt = me.yTickSize = (arguments.length > 1) ? yTickSize : xt;

        me.windows.each(function(win) {
            var dd = win.dd,
                resizer = win.resizer;

            dd.xTickSize = xt;
            dd.yTickSize = yt;
            resizer.widthIncrement = xt;
            resizer.heightIncrement = yt;
        });
    },

    setWallpaper: function(wallpaper, stretch) {
        this.wallpaper.setWallpaper(wallpaper, stretch);

        return this;
    },

    //------------------------------------------------------
    // Window management methods

    cascadeWindows: function() {
        var x = 0,
            y = 0,
            zmgr = this.getDesktopZIndexManager();

        zmgr.eachBottomUp(function(win) {
            if (win.isWindow && win.isVisible() && !win.maximized) {
                win.setPosition(x, y);
                x += 20;
                y += 20;
            }
        });
    },

    createWindow: function(config, cls) {
        var me = this,
            win,
            cfg = Ext.applyIf(config || {}, {
                stateful: false,
                isWindow: true,
                constrainHeader: true,
                minimizable: true,
                maximizable: true
            });

        cls = cls || Ext.window.Window;
        win = me.add(new cls(cfg));

        me.windows.add(win);

        win.taskButton = me.taskbar.addTaskButton(win);
        win.animateTarget = win.taskButton.el;

        win.on({
            activate: me.updateActiveWindow,
            beforeshow: me.updateActiveWindow,
            deactivate: me.updateActiveWindow,
            minimize: me.minimizeWindow,
            destroy: me.onWindowClose,
            scope: me
        });

        win.on({
            boxready: function() {
                win.dd.xTickSize = me.xTickSize;
                win.dd.yTickSize = me.yTickSize;

                if (win.resizer) {
                    win.resizer.widthIncrement = me.xTickSize;
                    win.resizer.heightIncrement = me.yTickSize;
                }
            },
            single: true
        });

        // replace normal window close w/fadeOut animation:
        win.doClose = function() {
            win.doClose = Ext.emptyFn; // dblclick can call again...
            win.el.disableShadow();
            win.el.fadeOut({
                listeners: {
                    afteranimate: function() {
                        win.destroy();
                    }
                }
            });
        };

        return win;
    },

    getActiveWindow: function() {
        var win = null,
            zmgr = this.getDesktopZIndexManager();

        if (zmgr) {
            // We cannot rely on activate/deactive because that fires against non-Window
            // components in the stack.

            zmgr.eachTopDown(function(comp) {
                if (comp.isWindow && !comp.hidden) {
                    win = comp;

                    return false;
                }

                return true;
            });
        }

        return win;
    },

    getDesktopZIndexManager: function() {
        var windows = this.windows;

        // TODO - there has to be a better way to get this...
        return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
    },

    getWindow: function(id) {
        return this.windows.get(id);
    },

    minimizeWindow: function(win) {
        win.minimized = true;
        win.hide();
    },

    restoreWindow: function(win) {
        if (win.isVisible()) {
            win.restore();
            win.toFront();
        }
        else {
            win.show();
        }

        return win;
    },

    tileWindows: function() {
        var me = this,
            availWidth = me.body.getWidth(true),
            x = me.xTickSize,
            y = me.yTickSize,
            nextY = y;

        me.windows.each(function(win) {
            var w;

            if (win.isVisible() && !win.maximized) {
                w = win.el.getWidth();

                // Wrap to next row if we are not at the line start and this Window will
                // go off the end
                if (x > me.xTickSize && x + w > availWidth) {
                    x = me.xTickSize;
                    y = nextY;
                }

                win.setPosition(x, y);
                x += w + me.xTickSize;
                nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);
            }
        });
    },

    updateActiveWindow: function() {
        var me = this,
            activeWindow = me.getActiveWindow(),
            last = me.lastActiveWindow;

        if (last && last.destroyed) {
            me.lastActiveWindow = null;

            return;
        }

        if (activeWindow === last) {
            return;
        }

        if (last) {
            if (last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }

            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }

        me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
    },

});
