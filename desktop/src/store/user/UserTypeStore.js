Ext.define('Admin.store.user.UserTypeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.user.userType',
    requires: [

    ],
    fields: [
        {name: 'name', type: 'string'},
        {name: 'value', type: 'string'}
    ],
    data: [
        {value: 'SYS', name: '系统用户'},
        {value: 'SEC', name: '安全保密用户'},
        {value: 'AUDIT', name: '审计用户'},
    ]
});
