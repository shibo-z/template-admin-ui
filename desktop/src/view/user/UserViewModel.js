Ext.define('Admin.view.user.UserViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.user',

    requires: [
        'Admin.store.user.UserStore'
    ],

    stores: {
        userStore: {
            type: 'userstore',
            pageSize: 20,
            autoLoad: true
        }
    },

    data: {

    }
})
