var API_ADDRESS = 'http://202.120.117.54:8080/gzjkyApi/'; //定义了常量
/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/

	owner.login = function(loginInfo, callback) {

		//错误信息返回函数
		callback = callback || $.noop;
		//用户信息
		loginInfo = loginInfo || {};
		//用户名
		loginInfo.account = loginInfo.account || '';
		//用户密码
		loginInfo.password = loginInfo.password || '';

		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		} else {
			//获取设备				
			mui.ajax(API_ADDRESS + 'person/login.do', {
				//mui.ajax('http://192.168.1.161:8080/gzjky/login/login.do', {
				data: {
					username: loginInfo.account,
					password: loginInfo.password,
					deviceid: loginInfo.deviceid,
					autoLoginFlag: loginInfo.autoLoginFlag
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 5000, //超时时间设置为10秒；
				success: function(data) {
					//服务器返回响应，根据响应结果，分析是否登录成功；
					var result = data.result;
					console.log("返回信息" + JSON.stringify(result));

					if (result.message=="") {
						
						//store中存储全局信息
						//最近登录时间
						localStorage.setItem('online', result.online);
						//患者list
						localStorage.setItem('patientList', JSON.stringify(result.patientList));
						//当前用户信息
						localStorage.setItem('patient', JSON.stringify(result.patient));
						//当前patientid
						localStorage.setItem('patientID', result.patientID);
						//用户名
						localStorage.setItem('user', result.user);
						
						console.log("登录成功");
						return owner.createState(loginInfo.account, callback);
					} else {
						console.log("登录失败"); 
						return callback(result.message);
					}

				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log("failure");
					console.log(type);
					return callback('服务器连接失败');

				}
			});

		}

	};
	//自动登录
	owner.autologin = function(username,deviceid, callback) {
			//获取设备				
			mui.ajax(API_ADDRESS + 'person/autologin.do', {
				//mui.ajax('http://192.168.1.161:8080/gzjky/login/login.do', {
				data: {
					username: username,
					deviceid: deviceid
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 5000, //超时时间设置为10秒；
				success: function(data) {
					//服务器返回响应，根据响应结果，分析是否登录成功；
					var result = data.result;
					console.log("自动登录返回信息：" + result.message);
					console.log("自动登录返回信息类型：" + typeof(result.message));
					console.log("自动登录返回信息：" + result.message);
					if (result.message =="") {
						console.log("自动登录登录成功");
						return callback();
						
					} else {
						return callback(result.message);
					}

				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log("failure");
					console.log(type);
					return callback('服务器连接失败');

				}
			});

	

	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		//设备唯一标识clientid
		state.token = plus.push.getClientInfo().clientid;
		console.log("用户当前设备标识" + state.token);
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
}(mui, window.user = {}));