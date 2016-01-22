'use strict';

define('demo', ['react', 'react-dom', 'datetime-picker'], function (React, ReactDOM, DatetimePicker) {
    var Demo = React.createClass({
        displayName: 'Demo',
        datetimepicker: function datetimepicker() {
            var defaultValue = { year: 2016, month: 9, date: 10, hour: 14, minute: 5 };
            //不指定defaultValue时，默认按系统当前时间
            this.refs['datetime-picker'].binding(this.refs['demodate'], defaultValue, function (v) {
                //如有需要，v是返回值，这里可以做回调处理
            });
        },
        render: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'demo-datetime' },
                    React.createElement(
                        'h2',
                        null,
                        'Datetime Picker'
                    ),
                    React.createElement(
                        'p',
                        null,
                        '只适合在手机上使用，点击下面的输入框后，用手指上下滑动选择时间'
                    ),
                    React.createElement('input', { type: 'text', readOnly: true, ref: 'demodate', onClick: this.datetimepicker })
                ),
                React.createElement(DatetimePicker, { ref: 'datetime-picker' })
            );
        }
    });
    ReactDOM.render(React.createElement(Demo, null), document.getElementById('demoPage'));
});