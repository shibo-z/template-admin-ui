Ext.define('Admin.utils.LocalStorageUtil', {
    alternateClassName: 'Admin.LSUtil',
    requires: [

    ],

    statics: {
        //key 用户
        LS_KEY_USER: '8cc1dd2b5314452db21c5e789670a6c3',
        //key oem
        LS_KEY_OEM: '51e1bd475e5d4e7582a96c63a976c9ec',
        //key 壁纸
        LS_KEY_BGIMG: 'ed0b1087a1d5413aa9104a373a4a25c5',
        //pwd length
        PWD_LENGTH: 'ae3a5a05178e4b6357cbc0afda7b7ce0',
        //oem 图标
        LS_MAIN_TITLE: '310dcbbf4cce62f762a2aaa148d556bd',
        //实例
        getItem: function (key) {
            return  window.localStorage.getItem(key);
        },
        setItem: function (key, value) {
            window.localStorage.setItem(key, value);
        },
        removeItem: function (key) {
            window.localStorage.removeItem(key);
        },
        clear: function () {
            window.localStorage.clear();
        }
    }
})