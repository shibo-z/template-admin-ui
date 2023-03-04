Ext.define('Admin.view.user.UserEditWindow', {
    extend: 'Ext.window.Window',
    xtype: 'user-edit',
    requires: [
        'Admin.store.user.UserTypeStore',
        'Admin.model.user.User',
        'Ext.window.Toast'
    ],
    modal: true,
    plain: true,
    title: '添加用户',
    constrain: true,
    resizable: false,
    autoDestroy: true,
    maximizable: false,
    closeToolText: "关闭",
    closeAction: 'destroy',
    width: 800,
    height: 600,
    layout: 'fit',
    items: {
        xtype: 'form',
        reference: 'ref_user_edit',
        bodyPadding: 25,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        scrollable: 'y',
        defaultType: 'textfield',
        defaults: {
            allowBlank: false,
            anchor: '100%'
        },
        items: [
            {
                name: 'id',
                fieldLabel: 'ID',
                allowBlank: true,
                hidden: true
            }, {
                name: 'username',
                fieldLabel: '用户名称',
                emptyText: '请输入用户名',
                maxLength: 64
            }, {
                xtype:'combo',
                fieldLabel:'用户类型',
                name:'userType',
                store: {
                    type: 'user.userType'
                },
                editable: false,
                displayField: 'name',
                valueField: 'value',
                queryMode:'local',
                emptyText: '请选择'
            }, {
                xtype: 'passwordfield',
                name: 'passwd',
                itemId: 'passwd',
                fieldLabel: '用户密码',
                emptyText: '请输入密码',
                maxLength: 64,
                validator: function (val) {
                    var res = null;
                    Admin.Util.getPwdConf(function (pwdConf) {
                        let reg = new RegExp('^[a-zA-Z0-9_]{'+pwdConf.minLength + ',' +pwdConf.maxLength + '}$')
                        let errMsg = '密码由数字字母下划线组成，长度应位于'+pwdConf.minLength+'~'+pwdConf.maxLength+'之间(含)';
                        res = reg.test(val) ? true : errMsg ;
                    })
                    return res;
                }
            }, {
                xtype: 'passwordfield',
                name: 'rePasswd',
                itemId: 'rePasswd',
                fieldLabel: '确认密码',
                emptyText: '请再次输入密码',
                maxLength: 64

            }
        ]
    },
    buttonAlign: 'right',
    buttons: [{
        text: '保存',
        handler: 'onSave'
    }, {
        text: '取消',
        handler: 'onCancel'
    }],
    controller: {
        onSave: function () {
            let me = this,
                refs = me.getReferences(),
                formPanel = refs.ref_user_edit,
                form = formPanel.getForm();

            if (!form.isValid()) {
                Ext.Msg.alert('提示','表单验证未通过，请检查');
                return;
            }

            let values = form.getValues();

            if (values.passwd !== values.rePasswd) {
                formPanel.down('#passwd').setValue('');
                formPanel.down('#rePasswd').setValue('');
                Ext.Msg.alert('提示','两次密码输入不一致，请重新输入')
                return;
            }
            delete values.rePasswd;
            values.passwd = CryptoJS.SHA256(values.passwd).toString(CryptoJS.enc.Hex)



            Ext.Ajax.request({

                url: '/api/user',
                headers:{
                    'Accept':'application/json, text/plain, */*',
                    'Content-Type':'application/json'
                },
                async: false,
                method: 'POST',
                scope: me,
                jsonData: values,
                success: function(response) {
                    let obj = Ext.decode(response.responseText);
                    Ext.getCmp('user-grid').lookup('ref_user_grid').getStore().load();
                    Ext.Msg.alert("提示", obj.msg);
                },
                failure: function(response) {
                    console.log('保存失败');
                    let obj = Ext.decode(response.responseText);
                    Ext.Msg.alert("提示", obj.msg);
                }
            });
            me.onCancel()
        },

        onCancel: function() {
            this.getView().close();
        }
    },
})
