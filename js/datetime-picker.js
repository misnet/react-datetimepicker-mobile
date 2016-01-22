'use strict';

define('datetime-picker', ['react', 'jquery'], function (React, $) {
    var SwiperWheel = function SwiperWheel() {
        this.selectedIndex = 0;
        this.config = {
            element: '',
            itemWidth: 40,
            itemHeight: 40,
            height: 0,
            selected: function selected() {}
        };
        this._data = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            maxMarginLeft: 0,
            currentDelta: 0,
            currentValue: ''
        };
        this.init = function (option) {
            $.extend(this.config, option || {});
            var $this = this;
            var indicator = $(this.config.element).next('.selected-indicator');
            //每一个子项的高定好
            $(this.config.element).children('li').each(function (i, e) {
                $(e).height($this.config.itemHeight);
                $(e).css('line-height', $this.config.itemHeight + 'px');
                $(e).css('height', $this.config.itemHeight + 'px');
            });
            var wheelVisibleHeight = this.config.height ? this.config.height : $(this.config.element).height();
            //this._data['wheelActualWidth']   = $(this.config.element).children().length * this.config.itemWidth;
            this._data['wheelActualHeight'] = $(this.config.element).children().length * this.config.itemHeight;
            //指示器的宽与左边定好

            this._data['maxMarginTop'] = (parseFloat(wheelVisibleHeight) - parseFloat(this.config.itemHeight)) / 2;
            //indicator.css('width',this.config.itemWidth);
            indicator.css('height', this.config.itemHeight);
            indicator.css('line-height', this.config.itemHeight);
            indicator.css('top', this._data['maxMarginTop']);
            this._data['maxMarginBottom'] = this._data['wheelActualHeight'] - this._data['maxMarginTop'] - this.config.itemHeight;

            $(this.config.element).height(this._data['wheelActualHeight']);
            this.config.element.addEventListener('touchstart', function (e) {
                e.preventDefault();
                $this.touchStart(e, $this);
            }, false);
            this.config.element.addEventListener('touchmove', function (e) {
                e.preventDefault();
                $this.touchMove(e, $this);
            }, false);
            this.config.element.addEventListener('touchend', function (e) {
                e.preventDefault();
                $this.touchEnd(e, $this);
            }, false);
            //this.alignIndicator(0);
        };
        this.alignIndicator = function (top) {
            if (this._data['wheelActualHeight'] > this._data['maxMarginTop']) {
                if (top > 0) {
                    var dist;
                    dist = (this._data['maxMarginTop'] - top) % this.config.itemHeight;
                } else {
                    var dist = (Math.abs(top) + this._data['maxMarginTop']) % this.config.itemHeight;
                }
                dist = Math.abs(dist) > this.config.itemHeight / 2 ? top - (this.config.itemHeight - Math.abs(dist)) : top + Math.abs(dist);
                this.translate(this.config.element, dist, '0.5s');
            }
            this.caculateIndex(dist);
        }, this.translate = function (ele, dist, duration) {
            var e = ele;
            if (typeof duration == 'undefined') duration = '0s';
            $(ele).css('-webkit-transition-duration', duration);
            if (!!ele) {
                ele = ele.style;
            }
            ele.webkitTransform = 'translate(0,' + dist + 'px)' + 'translateZ(0)';
            ele.msTransform = ele.MozTransform = ele.OTransform = 'translateY(' + dist + 'px)';
            this._data['currentDelta'] = dist;
        };
        this.touchStart = function (e, swheel) {
            swheel._data['startY'] = e.touches[0]['pageY'] - this._data['currentDelta'];
            swheel._data['startX'] = e.touches[0]['pageX'];
        };
        this.touchMove = function (e, swheel) {
            var deltaY = e.changedTouches[0]['pageY'] - this._data['startY'];
            //this.config.selected(1,e.touches[0]['pageX']);
            if (deltaY && deltaY <= swheel._data['maxMarginTop'] && deltaY >= -this._data['maxMarginBottom']) {
                this._data['endX'] = e.touches[0]['pageX'];
                this._data['endY'] = e.touches[0]['pageY'];
                this.translate(this.config.element, deltaY);
            }
        };
        this.touchEnd = function (e, swheel) {
            //滚动结束后，数字要刚好在正中间
            if (!swheel._data['endY']) return;
            var deltaY = swheel._data['endY'] - swheel._data['startY'];
            if (!deltaY) return;
            if (deltaY > swheel._data['maxMarginTop'] || deltaY < -swheel._data['maxMarginBottom']) {
                return;
            }
            this.alignIndicator(deltaY);
        };
        //设定选中第几个
        this.setSelected = function (index) {
            var dist = this._data['maxMarginTop'] - index * this.config.itemHeight;
            this.translate(this.config.element, dist);
            this.alignIndicator(dist);
        };
        //计算当前选中的是第几个
        this.caculateIndex = function (dist) {
            var d = this._data['maxMarginTop'] - dist;
            this.selectedIndex = parseInt(d / this.config.itemHeight);
            if (typeof this.config.selected == 'function') {
                this.config.selected(this.selectedIndex);
            }
        };
    };
    //--------滚轮组件----------------
    var SwiperWheelComponent = React.createClass({
        displayName: 'SwiperWheelComponent',
        getDefaultProps: function getDefaultProps() {
            return {
                min: 0,
                max: 0,
                name: '',
                unit: '',
                ckey: '',
                value: '',
                height: 200,
                onSelected: function onSelected() {}
            };
        },

        sw: null,
        initWheel: function initWheel() {
            this.sw = new SwiperWheel();
            var $this = this;
            this.sw.init({
                height: $this.props.height,
                element: document.getElementById(this.props.ckey + 'Wheel'),
                selected: function selected(sindex, s) {
                    if (typeof $this.props.onSelected == 'function') {
                        $this.props.onSelected($this.props.ckey, parseInt($this.props.min) + parseInt(sindex), s);
                    }
                }
            });
            if ($this.props.value !== '' && $this.props.value >= $this.props.min && $this.props.value <= $this.props.max) {
                this.sw.setSelected($this.props.value - $this.props.min);
            } else if ($this.props.value !== '' && $this.props.value > $this.props.max) {
                //$this.props.value = $this.props.max;
                this.sw.setSelected($this.props.max - $this.props.min);
            }
        },
        componentDidMount: function componentDidMount() {
            this.initWheel();
        },
        componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
            if (this.props.value != prevProps.value) {
                this.sw.setSelected(this.props.value - this.props.min);
            }
            if (this.props.max != prevProps.max) {
                this.initWheel();
            }
        },
        render: function render() {
            var h = [];
            for (var i = this.props.min; i <= this.props.max; i++) {
                h.push(React.createElement(
                    'li',
                    { key: this.props.ckey + '-' + i },
                    i + this.props.unit
                ));
            }
            return React.createElement(
                'div',
                { className: 'dt-swiper-container', style: { 'height': this.props.height + 'px' } },
                React.createElement(
                    'div',
                    { className: 'dt-swiper', style: { 'height': this.props.height + 'px' } },
                    React.createElement(
                        'ul',
                        { id: this.props.ckey + 'Wheel' },
                        h
                    ),
                    React.createElement('div', { className: 'selected-indicator' })
                )
            );
        }
    });
    //------------------------------------------------------------------
    var nowDate = new Date();
    return React.createClass({
        getDefaultProps: function getDefaultProps() {
            return {
                timeEnable: true,
                dateFormat: 'yyyy-mm-dd HH:ii',
                yearRange: [nowDate.getFullYear() - 2, nowDate.getFullYear() + 2]
            };
        },
        getInitialState: function getInitialState() {
            return {
                month: [1, 12],
                date: [1, 31],
                selected: {
                    year: nowDate.getFullYear(),
                    month: parseInt(nowDate.getMonth()) + 1,
                    date: nowDate.getDate(),
                    hour: nowDate.getHours(),
                    minute: nowDate.getMinutes()
                },
                completedCallback: function completedCallback(v) {}
            };
        },

        //datetime:{},
        bindFor: null,
        //绑定输入框
        /**
         * 绑定输入框
         * inputNode 输入框
         * defaultDate {year:'',month:'',date:'',hour:'',minute:''}
         *
         */
        binding: function binding(inputNode, defaultDate, cb) {
            this.bindFor = inputNode;
            var defaultSelected = $.extend({}, this.state.selected, defaultDate);
            this.setState({ 'selected': defaultSelected });
            if (typeof cb == 'function') {
                this.setState({ 'completedCallback': cb });
            }
            this.showPicker();
        },
        selectItem: function selectItem(name, v, s) {
            var t = {};
            t[name] = v;
            this.setState({ 'selected': $.extend({}, this.state.selected, t) });
            //要判断时间合法性，比如能不能有31日
            var tmpDate = new Date(this.state['selected']['year'], this.state['selected']['month'], 0);
            if ((name == 'month' || name == 'year') && this.refs['date']) {
                this.setState({ 'date': [1, tmpDate.getDate()] });
            }
        },
        dateFormat: function dateFormat(dateObj, format) {
            var o = {
                "m+": dateObj.getMonth() + 1,
                "d+": dateObj.getDate(),
                "H+": dateObj.getHours(),
                "i+": dateObj.getMinutes()
            };
            if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }return format;
        },

        //保存
        save: function save() {
            var selectedDateJson = this.state['selected'];
            if (selectedDateJson['year'] !== undefined && selectedDateJson['month'] !== undefined && selectedDateJson['date'] !== undefined && selectedDateJson['hour'] !== undefined && selectedDateJson['minute'] !== undefined) {
                var m = 0,
                    h = 0;
                if (this.props.timeEnable) {
                    h = selectedDateJson['hour'];
                    m = selectedDateJson['minute'];
                }
                var selectedDate = new Date(selectedDateJson['year'], parseInt(selectedDateJson['month']) - 1, selectedDateJson['date'], h, m, 0);
                var returnValue = this.dateFormat(selectedDate, this.props.dateFormat);
                if (typeof this.state.completedCallback == 'function') {
                    this.state.completedCallback(returnValue);
                }
                this.bindFor.value = returnValue;
                this.closePicker();
            }
        },

        //Show this picker
        showPicker: function showPicker() {
            this.refs['datetime-picker'].classList.remove('datetime-hide');
        },

        //Close this picker
        closePicker: function closePicker() {
            this.refs['datetime-picker'].classList.add('datetime-hide');
        },
        render: function render() {
            return React.createElement(
                'div',
                { className: 'rdp-datetime-picker animated-fast datetime-hide', ref: 'datetime-picker' },
                React.createElement(
                    'div',
                    { className: 'btns' },
                    React.createElement(
                        'button',
                        { className: 'btn', onClick: this.save },
                        '确定'
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn', onClick: this.closePicker },
                        '取消'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'datetime-panel clearfix' },
                    React.createElement(
                        'div',
                        { className: 'panel-item year-panel' },
                        React.createElement(SwiperWheelComponent, { onSelected: this.selectItem, ckey: 'year', unit: '年', ref: 'year', min: this.props.yearRange[0], max: this.props.yearRange[1], value: this.state.selected['year'] })
                    ),
                    React.createElement(
                        'div',
                        { className: 'panel-item month-panel' },
                        React.createElement(SwiperWheelComponent, { onSelected: this.selectItem, ckey: 'month', unit: '月', ref: 'month', min: this.state.month[0], max: this.state.month[1], value: this.state.selected['month'] })
                    ),
                    React.createElement(
                        'div',
                        { className: 'panel-item date-panel' },
                        React.createElement(SwiperWheelComponent, { onSelected: this.selectItem, ckey: 'date', unit: '日', ref: 'date', min: this.state.date[0], max: this.state.date[1], value: this.state.selected['date'] })
                    ),
                    React.createElement(
                        'div',
                        { className: this.props.timeEnable ? "panel-item hour-panel" : 'datetime-hide' },
                        React.createElement(SwiperWheelComponent, { onSelected: this.selectItem, ckey: 'hour', ref: 'hour', min: '0', max: '23', value: this.state.selected['hour'] })
                    ),
                    React.createElement(
                        'div',
                        { className: this.props.timeEnable ? "panel-item minute-panel" : 'datetime-hide' },
                        React.createElement(SwiperWheelComponent, { onSelected: this.selectItem, ckey: 'minute', ref: 'minute', min: '0', max: '59', value: this.state.selected['minute'] })
                    )
                )
            );
        }
    });
});