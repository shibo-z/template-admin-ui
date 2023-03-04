/**
 * 用户管理
 */
Ext.define('Admin.view.user.UserWindow', {
    extend: 'Admin.ux.desktop.Module',

    requires: [
        'Ext.grid.Panel',
        'Admin.view.user.UserViewModel',
        'Admin.view.user.UserController',
        'Admin.store.user.UserTypeStore',
        'Ext.grid.plugin.CellEditing'
    ],

    id: 'user-grid',

    init: function () {
        this.launcher = {
            text: '用户管理',
            //iconCls: 'x-fa fa-user'
            iconCls: 'icon-usermgr'
        };
    },

    createWindow: function () {
        var desktop = this.app.getDesktop(),
            win = desktop.getWindow('user-grid');

        if (!win) {
            win = desktop.createWindow({
                id: 'user-grid',
                title: '用户管理',
                width: '70%',
                height: '70%',
                //iconCls: 'x-fa fa-user',
                iconCls: 'icon-usermgr',
                animCollapse: false,
                constrainHeader: true,
                controller: 'user',
                viewModel: 'user',

                layout: 'fit',
                items: [
                    {
                        xtype: 'grid',
                        reference: 'ref_user_grid',
                        border: false,
                        plugins: {
                            cellediting: {
                                clicksToEdit: 2
                            }
                        },
                        selModel: {
                            selType: 'checkboxmodel',
                            checkOnly: false,
                            mode: 'SINGLE',
                            allowDeselect: false,
                            toggleOnClick: true
                        },
                        tbar: [
                            {
                                text: '创建',
                                reference: 'ref_user_btn_add',
                                tooltip: '创建一个用户',
                                iconCls: 'x-fa fa-plus-circle',
                                handler: 'showAddWindow'
                            }, '-', {
                                text: '刷新',
                                tooltip: '刷新用户列表',
                                iconCls: 'x-fa fa-sync-alt',
                                handler: 'onRefresh'
                            },
                            '->', {
                                text: '保存',
                                tooltip: '保存修改',
                                iconCls: 'x-fa fa-save',
                                handler: 'onSave'
                            }
                        ],
                        bind: {
                            store: '{userStore}'
                        },
                        columns: [
                            {
                                text: "ID",
                                flex: 1,
                                sortable: true,
                                dataIndex: 'id'
                            },
                            {
                                text: "用户名",
                                flex: 1,
                                sortable: true,
                                dataIndex: 'username',
                                editor: {
                                    allowBlank: false,
                                    maxLength: 64
                                }
                            },
                            {
                                text: "管理员",
                                flex: 1,
                                sortable: true,
                                dataIndex: 'isAdmin',
                                renderer: function (value, metaData, record, rowIndex, colIndex) {
                                    if (value) {
                                        return '是';
                                    }
                                    return '否';
                                },
                                editor: {
                                    xtype: 'combo',
                                    selectOnFocus: false,
                                    store: {
                                        fields: [
                                            {name: 'name', type: 'string'},
                                            {name: 'value', type: 'int'}
                                        ],
                                        data: [
                                            {value: '0', name: '否'},
                                            {value: '1', name: '是'},
                                        ]
                                    },
                                    editable: false,
                                    displayField: 'name',
                                    valueField: 'value',
                                    queryMode:'local',
                                }
                            }, {
                                text: "用户类型",
                                flex: 1,
                                sortable: true,
                                dataIndex: 'userType',
                                renderer: function (value, metaData, record, rowIndex, colIndex) {
                                    if (value == 'SUPER') {
                                        return '超管用户';
                                    }
                                    if (value == 'SYS') {
                                        return '系统用户';
                                    }
                                    if (value == 'SEC') {
                                        return '安全保密用户';
                                    }
                                    if (value == 'AUDIT') {
                                        return '审计用户';
                                    }
                                    return '';
                                },
                                editor: {
                                    xtype: 'combo',
                                    selectOnFocus: false,
                                    store: {
                                        type: 'user.userType'
                                    },
                                    editable: false,
                                    displayField: 'name',
                                    valueField: 'value',
                                    queryMode:'local',
                                }
                            }, {
                                xtype: 'actioncolumn',

                                width: 30,
                                sortable: false,
                                menuDisabled: true,
                                items: [{
                                    iconCls: 'x-fa fa-trash',
                                    tooltip: '删除',
                                    handler: 'onRemove'
                                }]
                            }

                        ]
                    }
                ],
                bbar: {
                    xtype: 'pagingtoolbar',
                    bind: {
                        store: '{userStore}'
                    },
                    displayInfo: true,
                    prevText: '',
                    refreshText: '',
                    nextText: '',
                    lastText: '',
                    firstText: '',
                    displayMsg: '显示第{0}条到{1}条记录，一共{2}条',
                    emptyMsg: '没有记录'
                }
            });
        }

        return win;
    }
});

