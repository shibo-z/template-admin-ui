Ext.define('Admin.view.user.UserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.user',

    requires: [
        'Admin.view.user.UserEditWindow'
    ],

    init: function() {

    },

    showAddWindow: function() {
        let window = Ext.create('Admin.view.user.UserEditWindow', {

        });
        window.show();
    },

    // 修改保存
    onSave: function () {
        this.lookup('ref_user_grid').store.sync({
            success: function (batch, options) {
                Ext.Msg.alert('提示', '您共修改'+ batch.getTotal() + '条数据，全部保存成功')
            },
            failure : function (batch, options) {
                try {
                    let errOpts = batch.getExceptions();
                    var errIdAry = [];
                    let errMsg = '';
                    Ext.Array.each(errOpts, function (item) {
                        let response = item.getError().response;
                        let res = response.responseJson;
                        let recordId = item.getRequest().getJsonData().id;
                        errIdAry.push(recordId);
                        errMsg += ('失败数据ID：' + recordId + ', 错误提示：' + res.msg + '<br/>')
                    });
                    let alertMsg = '共修改' + batch.getTotal() + '条数据, 其中' + errOpts.length + '条失败<br/>'
                    Ext.Msg.alert('提示', alertMsg + errMsg)
                } catch (e) {
                    Ext.Msg.alert('提示', '操作失败')
                }
            },

        });
    },

    // 删除
    onRemove: function(view, recIndex, cellIndex, item, e, record) {
        let me = this;
        Ext.MessageBox.confirm('提示', '是否确认删除?', function (btn) {
            if (btn === 'yes') {
                Ext.Ajax.request({
                    url: '/api/user/' + record.id,
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    async: false,
                    method: 'DELETE',
                    scope: me,
                    success: function (response, opts) {
                        let obj = Ext.decode(response.responseText);
                        if (obj.success === true) {
                            me.onRefresh();
                        }
                        Ext.Msg.alert("提示", obj.msg);
                    },
                    failure: function (response, opts) {
                        let obj = Ext.decode(response.responseText);
                        Ext.Msg.alert("提示", obj.msg);
                    }
                });
            }
        })
        //        record.drop();
        //         view.store.sync();
    },

    // 刷新
    onRefresh: function() {
        let view = this.lookup('ref_user_grid');
        view.store.load();
    }

});
