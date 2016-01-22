define('demo',['react','react-dom','datetime-picker'],function(React,ReactDOM,DatetimePicker){
    var Demo = React.createClass({
        datetimepicker(){
            var defaultValue = {year:2016,month:9,date:10,hour:14,minute:5};
            //不指定defaultValue时，默认按系统当前时间
            this.refs['datetime-picker'].binding(this.refs['demodate'],defaultValue,function(v){
                //如有需要，v是返回值，这里可以做回调处理
            });
        },
        render(){
            return (
                <div>
                    <div  className="demo-datetime">
                        <h2>Datetime Picker</h2>
                        <p>只适合在手机上使用，点击下面的输入框后，用手指上下滑动选择时间</p>
                        <input type="text"  readOnly={true} ref="demodate" onClick={this.datetimepicker}/>
                    </div>
                    <DatetimePicker ref="datetime-picker"/>
                </div>
            )
        }
    })
    ReactDOM.render(<Demo/>,document.getElementById('demoPage'));
});
