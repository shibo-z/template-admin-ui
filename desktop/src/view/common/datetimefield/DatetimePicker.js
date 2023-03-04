/**
 * 日期+时间 面板
 */
Ext.define('Admin.view.common.datetimefield.DatetimePicker', {
    extend: 'Ext.picker.Date',
    xtype: 'datetimepicker',
    okText: '确定',
    todayText: '今天',
    focusable: true,
    editable: true,

    renderTpl: [
        '<div id="{id}-innerEl" data-ref="outnerEl" role="presentation">',
        '<div class="{baseCls}-header">',
        '<div id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" role="presentation" title="{prevText}"></div>',
        '<div id="{id}-middleBtnEl" data-ref="middleBtnEl" class="{baseCls}-month" role="heading">{%this.renderMonthBtn(values, out)%}</div>',
        '<div id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" role="presentation" title="{nextText}"></div>',
        '</div>',
        '<table role="grid" id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" cellspacing="0" tabindex="0">',
        '<thead>',
        '<tr role="row">',
        '<tpl for="dayNames">',
        '<th role="columnheader" class="{parent.baseCls}-column-header" aria-label="{.}">',
        '<div role="presentation" class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
        '</th>',
        '</tpl>',
        '</tr>',
        '</thead>',
        '<tbody>',
        '<tr role="row">',
        '<tpl for="days">',
        '{#:this.isEndOfWeek}',
        '<td role="gridcell">',
        '<div hidefocus="on" class="{parent.baseCls}-date"></div>',
        '</td>',
        '</tpl>',
        '</tr>',
        '</tbody>',
        '</table>',

        '<center>',
        '<table id="{id}-timeEl" data-ref="timeEl" style="width: auto; margin: 4px 15px;" class="x-datepicker-inner sys-timepicker-inner" cellspacing="0">',
        '<tbody>',
        '<tr>',
        '<td>{%this.renderHourBtn(values,out)%}</td>',
        '<td style="width: 16px; text-align: center; font-weight: bold;">:</td>',
        '<td>{%this.renderMinuteBtn(values,out)%}</td>',
        '<td style="width: 16px; text-align: center; font-weight: bold;">:</td>',
        '<td>{%this.renderSecondBtn(values,out)%}</td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</center>',

        '<tpl if="showToday">',
        '<div id="{id}-footerEl" data-ref="footerEl" role="presentation" class="{baseCls}-footer">{%this.renderOkBtn(values, out)%}{%this.renderTodayBtn(values, out)%}</div>',
        '</tpl>',
        '<div id="{id}-todayText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{todayText}.</div>',
        '<div id="{id}-ariaMinText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaMinText}.</div>',
        '<div id="{id}-ariaMaxText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaMaxText}.</div>',
        '<div id="{id}-ariaDisabledDaysText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaDisabledDaysText}.</div>',
        '<div id="{id}-ariaDisabledDatesText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaDisabledDatesText}.</div>',
        '</div>',
        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },

            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },

            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },

            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            },

            renderHourBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.hourBtn.getRenderTree(), out);
            },

            renderMinuteBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.minuteBtn.getRenderTree(), out);
            },

            renderSecondBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.secondBtn.getRenderTree(), out);
            },

            renderOkBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.okBtn.getRenderTree(), out);
            }
        }
    ],

    beforeRender: function() {
        let me = this,
            _$Number = Ext.form.field.Number,
            today = Ext.Date.format(new Date(), me.format),
            ownerLayout = me.getComponentLayout();

        me.hourBtn = new _$Number({
            ownerCt: me,
            ownerLayout: ownerLayout,
            minValue: 0 ,
            maxValue: 23,
            step: 1,
            width: 75,
            enableKeyEvents: true,
            editable : true,
            listeners: {
                keyup: function(field, e){
                    if (field.getValue() > 59){
                        e.stopEvent();
                        field.setValue(59);
                    }
                }
            }
        });

        me.minuteBtn = new _$Number({
            ownerCt: me,
            ownerLayout: ownerLayout,
            minValue: 0,
            maxValue: 59,
            step: 1,
            width: 75
        });

        me.secondBtn = new _$Number({
            ownerCt: me,
            ownerLayout: ownerLayout,
            minValue: 0,
            maxValue: 59,
            step: 1,
            width: 75
        });

        me.okBtn = new Ext.button.Button({
            ui: me.footerButtonUI,
            ownerCt: me,
            ownerLayout: ownerLayout,
            text: me.okText,
            tooltipType: 'title',
            tabIndex: -1,
            ariaRole: 'presentation',
            handler: me.okHandler,
            scope: me
        });
        me.callParent();
    },

    privates : {
        finishRenderChildren: function() {
            let me = this;
            me.callParent();
            me.hourBtn.finishRender();
            me.minuteBtn.finishRender();
            me.secondBtn.finishRender();
            me.okBtn.finishRender();
        }
    },

    okHandler: function() {
        let me = this,
            btn = me.okBtn;
        if(btn && !btn.disabled) {
            me.setValue(this.getValue());
            me.fireEvent('select', me, me.value);
            me.onSelect();
        }
        return me;
    },

    selectedUpdate: function(date) {
        this.callParent([Ext.Date.clearTime(date, true)]);
    },

    update: function(date, forceRefresh) {
        let me = this;
        me.hourBtn.setValue(date.getHours());
        me.minuteBtn.setValue(date.getMinutes());
        me.secondBtn.setValue(date.getSeconds());
        return this.callParent(arguments);
    },

    setValue: function(date, isFixed) {
        let me = this;
        if(isFixed !== true) {
            date.setHours(me.hourBtn.getValue());
            date.setMinutes(me.minuteBtn.getValue());
            date.setSeconds(me.secondBtn.getValue());
        }
        me.value = date;
        me.update(me.value);
        return me;
    },

    beforeDestroy: function() {
        let me = this;
        if(me.rendered) {
            Ext.destroy(
                me.hourBtn,
                me.minuteBtn,
                me.secondBtn,
                me.okBtn
            );
        }
        me.callParent();
    },

    handleDateClick: function(e, t) {
        let me = this,
            handler = me.handler;
        e.stopEvent();
        if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)){
            me.doCancelFocus = me.focusOnSelect === false;
            me.setValue(new Date(t.dateValue));
            delete me.doCancelFocus;
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
    }
});