Ext.define('Admin.store.user.UserStore', {
    extend: 'Ext.data.Store',
    alias: 'store.userstore',
    requires: [
        'Admin.model.user.User',
        'Ext.data.proxy.Rest'
    ],
    model: 'Admin.model.user.User',



});