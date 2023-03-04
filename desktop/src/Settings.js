/* !
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Admin.Settings', {
    extend: 'Ext.window.Window',

    uses: [
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Border',

        'Admin.ux.desktop.Wallpaper',

        'Admin.model.Wallpaper'
    ],

    layout: 'anchor',
    title: '壁纸',
    modal: true,
    width: 640,
    height: 480,
    border: false,

    initComponent: function() {
        var me = this;

        me.selected = me.desktop.getWallpaper();
        me.stretch = me.desktop.wallpaper.stretch;

        me.preview = Ext.create('widget.uxwallpaper');
        me.preview.setWallpaper(me.selected);
        me.tree = me.createTree();

        me.buttons = [
            { text: '保存', handler: me.onOK, scope: me },
            { text: '取消', handler: me.close, scope: me }
        ];

        me.items = [
            {
                anchor: '0 -30',
                border: false,
                layout: 'border',
                items: [
                    me.tree,
                    {
                        xtype: 'panel',
                        title: '预览',
                        region: 'center',
                        layout: 'fit',
                        items: [ me.preview ]
                    }
                ]
            },
            {
                xtype: 'checkbox',
                boxLabel: '拉伸',
                checked: me.stretch,
                listeners: {
                    change: function(comp) {
                        me.stretch = comp.checked;
                    }
                }
            }
        ];

        me.callParent();
    },

    createTree: function() {
        var me = this,
            tree;

        function child(img) {
            return { img: img, text: me.getTextOfWallpaper(img), iconCls: '', leaf: true };
        }

        tree = new Ext.tree.Panel({
            title: '壁纸列表',
            rootVisible: false,
            lines: false,
            scrollable: true,
            width: 150,
            region: 'west',
            split: true,
            minWidth: 100,
            listeners: {
                afterrender: { fn: this.setInitialSelection, delay: 100 },
                select: this.onSelect,
                scope: this
            },
            store: new Ext.data.TreeStore({
                model: 'Admin.model.Wallpaper',
                root: {
                    text: 'Wallpaper',
                    expanded: true,
                    children: [
                        { text: "无壁纸", iconCls: '', leaf: true },
                        child('蠢桃-01.jpg'),
                        child('蠢桃-02.jpg'),
                        child('蠢桃-03.jpg'),
                        child('蠢桃-04.jpg'),
                        child('蠢桃-05.jpg'),
                        child('蠢桃-06.jpg'),
                        child('蠢桃-07.jpg'),
                        child('蠢桃-08.jpg'),
                        child('蠢桃-09.jpg'),
                        child('蠢桃-10.jpg'),
                        child('蠢桃-11.jpg'),
                        child('蠢桃-12.jpg'),
                        child('蠢桃-13.jpg'),
                        child('蠢桃-14.jpg'),
                        child('蠢桃-15.jpg'),
                        child('蠢桃-16.jpg'),
                        child('蠢桃-17.jpg'),
                        child('蠢桃-18.jpg'),
                        child('蠢桃-19.jpg'),
                        child('蠢桃-20.jpg'),
                        child('蠢桃-21.jpg'),
                        child('蠢桃-22.jpg'),
                        child('蠢桃-23.jpg'),
                        child('蠢桃-24.jpg'),
                        child('蠢桃-25.jpg'),
                        child('蠢桃-26.jpg'),
                        child('蠢桃-27.jpg'),
                        child('蠢桃-28.jpg'),
                        child('蠢桃-29.jpg')

                    ]
                }
            })
        });

        return tree;
    },

    getTextOfWallpaper: function(path) {
        var text = path,
            slash = path.lastIndexOf('/'),
            dot;

        if (slash >= 0) {
            text = text.substring(slash + 1);
        }

        dot = text.lastIndexOf('.');

        text = Ext.String.capitalize(text.substring(0, dot));
        text = text.replace(/[-]/g, ' ');

        return text;
    },

    onOK: function() {
        var me = this;
        me.stretch = true;
        if (me.selected) {
            console.log(me.selected);
            me.desktop.setWallpaper(me.selected, me.stretch);
            Admin.LSUtil.setItem(Admin.LSUtil.LS_KEY_BGIMG, me.selected);
        }

        me.destroy();
    },

    onSelect: function(tree, record) {
        var me = this;

        if (record.data.img) {
            //me.selected = 'resources/images/wallpapers/' + record.data.img;
            me.selected = 'desktop/resources/images/wallpapers/' + record.data.img;
        }
        else {
            me.selected = Ext.BLANK_IMAGE_URL;
        }

        me.preview.setWallpaper(me.selected);
    },

    setInitialSelection: function() {
        var s = this.desktop.getWallpaper(),
            path;

        if (s) {
            path = '/Wallpaper/' + this.getTextOfWallpaper(s);

            this.tree.selectPath(path, 'text');
        }
    }
});
