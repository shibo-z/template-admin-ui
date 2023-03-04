/**
 * 日期+时间 组件，extjs都出到那么高版本了，依然不出这个组件，WTF?
 */
Ext.define('Admin.view.common.datetimefield.DatetimeField', {
    extend:'Ext.form.field.Date',
    xtype: 'datetimefield',
    requires: [
        'Admin.view.common.datetimefield.DatetimePicker'
    ],
    format : "Y-m-d H:i:s",
    altFormats : "Y-m-d H:i:s",

    createPicker: function() {
        let me = this,
            format = Ext.String.format;
        return Ext.create('Admin.view.common.datetimefield.DatetimePicker',{
            pickerField: me,
            floating: true,
            hidden: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            ariaDisabledDatesText: me.ariaDisabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            ariaDisabledDaysText: me.ariaDisabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            ariaMinText: format(me.ariaMinText, me.formatDate(me.minValue, me.ariaFormat)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            ariaMaxText: format(me.ariaMaxText, me.formatDate(me.maxValue, me.ariaFormat)),
            editable: true,
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.inputEl.focus();
                    me.collapse();
                }
            }
        });
    },
    onMouseDown: function(e) {
        //e.preventDefault();
    },
    onExpand: function() {
        let value = this.getValue();
        this.picker.setValue(Ext.isDate(value) ? value : new Date(), true);
    }
});