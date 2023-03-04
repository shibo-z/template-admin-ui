Ext.define("Admin.model.user.User", {
    extend: "Ext.data.Model",
    requires: [
        'Ext.data.proxy.Rest'
    ],
    fields: [
        { name: 'id', type: 'int'},
        { name: 'username', type: 'string' },
        { name: 'passwd', type: 'string' },
        { name: 'isAdmin', type: 'int' },
        { name: 'userType', type: 'string' }
    ],
    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: '/api/user',
        reader: {
            type: 'json',
            rootProperty: 'data.records',
            totalProperty: 'data.total',
            successProperty: 'success',
            messageProperty: 'msg'
        }
    }
})