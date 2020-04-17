//  http 请求配置项
export default {
    //	开发者服务器接口地址
	// wxRequest.defaults.baseURL = "https://funnyduck.raysler.com/rentbird_test"; //测试地址
	// wxRequest.defaults.baseURL = "http://192.168.10.120:8889";
    // url: "http://192.168.10.120:8891",
	url: "https://funnyduck.raysler.com/rbInterme_test",
    //	请求的参数	
    data: {},
    //	设置请求的 header，header 中不能设置 Referer。
    header: {},
    //	（需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT	
    method: "POST",
    //	json	如果设为json，会尝试对返回的数据做一次 JSON.parse	
    dataType: "json",
    //	text	设置响应的数据类型。合法值：text、arraybuffer	1.7.0
    responseType: "text",
    //	收到开发者服务成功返回的回调函数	
    success() {},
    //	接口调用失败的回调函数	
    fail() {},
    //	接口调用结束的回调函数（调用成功、失败都会执行）
    complete() {},
}