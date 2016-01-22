# React Datetime Picker for Mobile
日期与时间选择控件

## Setup 安装
- 引入必要的css文件
<link rel="stylesheet" type="text/css" href="css/datetime-picker.css"/>

- 引入requirejs 并配置好相关js的路径，需要react以及jquery

```javascript
<script type="text/javascript" src="js/lib/require.js"></script>
<script type="text/javascript">
	require.config({
		"baseUrl":"js/",
		"paths":{
			"react":"lib/react-with-addons.min",
			"react-dom":"lib/react-dom.min",
			"jquery":"lib/jquery-2.2.0.min",
            "datetime-picker":"datetime-picker"
		}
	});
```
# How to use
如何使用

- 在你的js页面中加入以下行：
```
<DateTimePicker  ref="datetime-picker"/>
```

- 在要填写日期的input控件上添加ref属性与事件，例：
```
<input type="text"  readOnly={true} ref="demodate" onClick={this.datetimepicker}/>
```

- 在页面添加方法datetimepicker，实现单击输入框时，系统自动弹出日期控件
```
datetimepicker:function(){
	//回调函数，需要的可以定义
	var cb = function(v){
		//v表示选中的日期字串
	};
	//defaultValue指的是弹出的日期控件默认值，不指定时，默认当前时间
	var defaultValue = {year:2016,month:1,date:1,hour:12,minute:0};
    this.refs['datetime-picker'].binding(this.refs['demodate'],defaultValue,cb);
}
```
# 说明
控件<DateTimePicker />目前的属性有：
- 1. yearRange 值为数组，表示起始与结束年份，不填写时，自动以当前年份上下2年为范围，示例：
```
<DateTimePicker yearRange={[2011,2018]}/>
```
- 2. timeEnable 是否启用小时与分钟选择，默认启用，如果要禁用，请设为false，示例
```
<DateTimePicker yearRange={[2011,2018]} timeEnable={false}/>
```
- 3. dateFormat 返回的日期格式，y表示年份,m表示月份，d表示天,H表示小时,i表示分钟，示例
```
<DateTimePicker dateFormat='yyyy-mm-dd HH:ii'/>
```
