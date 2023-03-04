Ext.define('Admin.util.Util', {
    alternateClassName: ['Admin.Util'],

    statics: {
        objToUri: function (objParam, isAddPre, isClean) {
            if (!objParam) {
                return ''
            }
            var uriParam = isAddPre ? '?' : '';
            let pAry = [];
            for (let key in objParam) {
                var val = objParam[key];
                if (isClean && this.isEmpty(val)) {
                    continue;
                }
                pAry.push(key + '=' + val);
            }
            return uriParam.concat(pAry.join('&'));
        },
        bytesToSize: function (bytes) {
            if (bytes === 0) return '0 B';
            let k = 1024,
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));

            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },

        isEmpty: function (obj) {
            if (typeof obj === 'undefined' || obj == null || obj === '') {
                return true;
            } else {
                return false;
            }
        }

    }
});
