/*
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.desktop.ShortcutModel
 * @extends Ext.data.Model
 * This model defines the minimal set of fields for desktop shortcuts.
 */
Ext.define('Admin.ux.desktop.ShortcutModel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'name'
        // 注释掉下行以支持图标下文本中文
        //convert: Ext.String.createVarName
    }, {
        name: 'iconCls'
    }, {
        name: 'module'
    }]
});
