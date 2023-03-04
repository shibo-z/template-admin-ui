/**
 * Extjs 集成 Echarts 所使用的的容器
 */


Ext.define('Admin.view.common.EchartsContainer', {
    extend: 'Ext.panel.Panel',
    xtype: 'echartsPanel',

    // initComponent: function () {
    //     console.log('join in initComponent()')
    //     let me = this;
    //     let dom = me.getEl().dom;
    //     dom.style.width = '100%';
    //     dom.style.height = '100%';
    //     me.echarts = echarts.init(dom)
    //     me.callParent();
    //     console.log('initComponent() is end')
    // },
    setOption: function (ecOption){
        this.echarts.setOption(ecOption)
    },
    listeners: {
        resize: function ( thi, width, height, oldWidth, oldHeight, eOpts){
            let me = this;
            if (me.echarts) {
                me.echarts.resize(width, height);
            }
        },
        afterrender: function () {
            let me = this;
            let dom = me.getEl().dom;
            dom.style.width = '100%';
            dom.style.height = '100%'
            me.echarts = echarts.init(dom);
            console.log('echartsPanel afterrender exec over')
        }
    }
});