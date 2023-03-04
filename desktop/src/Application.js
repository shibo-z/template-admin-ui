/* !
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Admin.Application', {
    extend: 'Admin.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',
        'Admin.*'
    ],

    init: function () {
        this.callParent();
        // now ready...

    },

    //所有窗体实例化
    getModules: function () {
        return [

            //用户管理
            new Admin.view.user.UserWindow()
        ];
    },

    getDesktopConfig: function () {
        var me = this,
            ret = me.callParent();
        let bgimg = Admin.LSUtil.getItem(Admin.LSUtil.LS_KEY_BGIMG);
        console.log(bgimg)
        return Ext.apply(ret, {
            // cls: 'ux-desktop-black',

            // 右键菜单
            contextMenuItems: [
                {text: '壁纸', handler: me.onSettings, scope: me},
                {text: '流行风格', handler: me.onToFashionStyle, scope: me}
            ],

            // 图标 todo 应从数据库获取
            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Admin.ux.desktop.ShortcutModel',
                data: [
                    //用户管理
                    {name: '用户管理', iconCls: 'shortcut-usermgr', module: 'user-grid'},

                ]
            }),

            // 默认壁纸
            wallpaper: bgimg ? bgimg : 'resources/images/wallpapers/蠢桃-01.jpg',
            // 壁纸是否拉伸
            wallpaperStretch: false
        });
    },

    // 开始菜单的右边
    getStartConfig: function () {
        let me = this,
            ret = me.callParent();

        return Ext.apply(ret, {
            height: 500,
            toolConfig: {
                width: 240,
                defaults: {
                    ui: 'ui-startpanel-right',
                    shadow: true,
                    shadowOffset: 4
                },
                items: [
                    {
                        xtype: 'form',
                        height: 120,
                        margin: '16 16 0 16',
                        layout: {
                            type: 'form'
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                name: 'userinfo',
                                reference: 'ref_currentUser',
                                fieldLabel: '当前用户',
                                // value: '{用户名} {管理员}'
                            },

                        ],
                        dockedItems: [{
                            xtype: 'toolbar',
                            dock: 'bottom',
                            ui: 'ux-start-menu-body',
                            defaults: {
                                ui: 'ui-startpanel-right-btn',
                                margin: 8
                            },
                            items: [
                                '->',
                                {
                                    text: '改密',
                                    iconCls: 'x-fa fa-key',
                                    handler: 'onModifyPasswd',
                                    scope: me
                                }, {
                                    text: '登出',
                                    iconCls: 'x-fa fa-sign-out-alt',
                                    handler: 'onLogout',
                                    scope: me
                                }
                            ]
                        }]
                    }, {
                        xtype: 'form',
                        flex: 1,
                        margin: 16,
                        layout: {
                            type: 'form'
                        },
                        defaultType: 'displayfield',
                        items: [
                            {
                                name: 'softWareName',
                                hideLabel: true,
                                value: '{产品名称}'
                            }, {
                                name: 'softWareModel',
                                fieldLabel: '软件版本',
                                value: '{软件版本}'
                            }, {
                                name: 'uptime',
                                fieldLabel: '运行时间',
                                value: '{运行时间}'
                            }
                        ]
                    }

                ]
            }
        });
    },

    //任务栏
    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            height: 50,
            // //左侧快速开始
            // quickStart: [
            //     { name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win' },
            //     { name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win' }
            // ],
            // 右侧小时钟
            trayItems: [
                {xtype: 'uxtrayclock', flex: 1}
            ]
        });
    },

    onModifyPasswd: function () {
        console.log(" 修改密码 ")
    },
    onLogout: function () {
        console.log(" 退出登录 ")
    },

    onSettings: function () {
        let dlg = new Admin.Settings({
            desktop: this.desktop
        });
        dlg.show();
    },

    onToFashionStyle: function () {
        let s = window.location.search;

        // Strip "?classic" or "&classic" with optionally more "&foo" tokens
        // following and ensure we don't start with "?".
        s = s.replace(/(^\?|&)desktop($|&)/, '').replace(/^\?/, '');

        // Add "?modern&" before the remaining tokens and strip & if there are
        // none.
        window.location.search = ('?fashion&' + s).replace(/&$/, '');
    },
});
