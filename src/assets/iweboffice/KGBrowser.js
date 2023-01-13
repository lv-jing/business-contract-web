//////////////////////////////////////////////////////////////////////////////KGBrowser
function basePath() {
    //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8080
    var localhostPath = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/ems
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    //获取项目的basePath   http://localhost:8080/ems/
    var basePath = localhostPath + projectName + "/";
    console.log(basePath);
    return '';
};

/*
* url: 相对地址  : /sampes/OpenAndSave/word.jsp
* param: 跟随在url后面的get形式的参数： ?key1=value1&key2=value2&key3=value3
* onlyONE: true:如果有已经打开的弹出窗口就返回提示信息，并终止本次弹窗; false:
*/
function KGBrowser()
{
    var kgbrowser = this;
    this.uuid = "";

    this.getUUID = function()
    {
    	if(this.uuid=="")
    		this.uuid = this.kg_uuid(16,32);
    	return this.uuid;
    }

    this.openWindowSPE = function(url, param, onlyONE) {   // speed up 不做安装检测 , 好像效果不明显

        if (onlyONE == undefined)
            onlyONE = true;

	    //var strParam = '$parent_uuid=' + kgbrowser.kg_uuid;
	    //strParam += param;

        var link = "KGBrowser://$link:" + basePath() + url + param;
        //	alert("link: " + link);
        location.href = link;
        this.LongConnect();

    }

    this.openWindow = function(url, param, onlyONE)
    {
	    if(onlyONE == undefined)
		    onlyONE = true;

	    //var strParam = '$parent_uuid=' + kgbrowser.kg_uuid;
	    //strParam += param;

        // 检测KGBrowser是否安
        // http://10.141.31.15/
	    $.ajax({
		    type: "get",
		    async: false,
		    url: "http://127.0.0.1:9588/QueryOpen", //此代码ip固定，端口号与Edit页面该方法一致，其他固定。
		    jsonp: "hookback",
		    dataType: "jsonp",
		    success: function (data) {
			    var jsonobj = eval(data);
			    if (jsonobj.ret == "none" || onlyONE == false)
			    {
                    var  link = "KGBrowser://$link:" + url + param;
                    console.log(link,'realUrl')
				    window.location.href = link;
				    kgbrowser.LongConnect();
			    }
			    else
			    {
				    alert("有已打开的金格浏览器!");
			    }
		    },
		    error: function(){
		    	var answer = confirm("未安装支持多浏览器应用程序是否点击安装\n提示：安装的时候360全部点击允许程序所有操作");
                if (answer) {//判断是否点击确定
                	//  var curPath = window.document.location.href;
                    //  var pathName = window.document.location.pathname;
                    //  var pos = curPath.indexOf(pathName);
                    //  var localhostPath = curPath.substring(0, pos);
                    //  var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
                    //  var webPath = localhostPath + projectName;
                    //  window.location.href = webPath + "/KGBrowserSetup.exe"; //安装KGBrower
                    let url = window.location.href;
                    if (url.indexOf("localhost:") >= 0) {
                        this.$message({
                        type: "error",
                        message: "你个傻逼，本地启动还想下载插件",
                        });
                    } else {
                        let url1 = url.substring(0, url.indexOf("index.html"));
                        url1 = url1+'KGBSofetWare.zip'
                        window.open(url1)
                    }
                }
		    }
	    });
	    // ie 8+, chrome and some other browsers
	    var head = document.head || $('head')[0] || document.documentElement;// code from jquery
	    var script = $(head).find('script')[0];
	    script.onerror = function(evt)
	    {
	    	var answer = confirm("未安装支持多浏览器应用程序是否点击安装\n提示：安装的时候360全部点击允许程序所有操作");
            if (answer) {//判断是否点击确定
                // var curPath = window.document.location.href;
                // var pathName = window.document.location.pathname;
                // var pos = curPath.indexOf(pathName);
                // var localhostPath = curPath.substring(0, pos);
                // var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
                // var webPath = localhostPath + projectName;
                // window.location.href = webPath + "/KGBrowserSetup.exe"; //安装KGBrower
                let url = window.location.href;
                if (url.indexOf("localhost:") >= 0) {
                    this.$message({
                    type: "error",
                    message: "你个傻逼，本地启动还想下载插件",
                    });
                } else {
                    let url1 = url.substring(0, url.indexOf("index.html"));
                    url1 = url1+'KGBSofetWare.zip'
                    window.open(url1)
                }
            }
		    // do some clean
		    // delete script node
		    if (script.parentNode)
		    {
			    script.parentNode.removeChild(script);
		    }
		    // delete jsonCallback global function
		    var src = script.src || '';
		    var idx = src.indexOf('hookback=');
		    if (idx != -1)
		    {
			    var idx2 = src.indexOf('&');
			    if (idx2 == -1)
			    {
				    idx2 = src.length;
			    }
			    var hookback = src.substring(idx + 13, idx2);
			    delete window[hookback];
		    }
	    };
    }


    this.LongConnect = function () {
    	var strUrl = "http://127.0.0.1:9588/LongListen?id=" + kgbrowser.uuid;
        $.ajax({
            type: "get",
            async: false,
            url: strUrl, //此代码ip固定，端口号与Edit页面该方法一致，其他固定。
            jsonp: "hookback",
            dataType: "jsonp",
            success: function (data) {
                var jsonobj = eval(data);
                console.log(jsonobj.ret);
                if (jsonobj.ret == "save") { //此判断处理Edit页面Msg传过来的值，判断之后下面做响应处理即可
                    //alert("save");
                    setTimeout("location.reload();", 100);
                }
                else if (jsonobj.ret == "returnlist") { //此判断处理Edit页面Msg传过来的值，判断之后下面做响应处理即可
                    alert("returnlist");
                    setTimeout("location.reload();", 100);
                }
                else if (jsonobj.ret == "none" || jsonobj.ret == "unload") {
                    kgbrowser.LongConnect();    //这里一定要调用，不可删除
                }
                else {
                    //console.log(data);
                    console.log(jsonobj.ret);
                    //var jsonobj2 = eval('(' + jsonobj.ret + ')');
                    var jsonobj2 = eval(jsonobj.ret);
                    console.log(jsonobj2.action);
                    console.log(jsonobj2.func);
                    if (jsonobj2.action == "save") {
                        setTimeout("location.reload();", 100);
                    }
                    else if (jsonobj2.action == "CallParentFunc") {
                        // alert(jsonobj2.action);
                        // alert(jsonobj2.func);
                        eval(jsonobj2.func);
                        kgbrowser.LongConnect();
                    }
                    else if(jsonobj2.action == "ReturnList"){
                        alert(jsonobj2.action);
                    	setTimeout("location.reload();", 100);
                    }
                }
            },
            error: function (a, b, c) {
            }
        });

    }

    this.kg_uuid = function (len, radix) {
    	  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    	  var uuid = [], i;
    	  radix = radix || chars.length;

    	  if (len) {
    	   // Compact form
    	   for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    	  } else {
    	   // rfc4122, version 4 form
    	   var r;

    	   // rfc4122 requires these characters
    	   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    	   uuid[14] = '4';

    	   // Fill in random data. At i==19 set the high bits of clock sequence as
    	   // per rfc4122, sec. 4.1.5
    	   for (i = 0; i < 36; i++) {
    	    if (!uuid[i]) {
    	     r = 0 | Math.random()*16;
    	     uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
    	    }
    	   }
    	  }

    	  return uuid.join('');
    	}
}

export default KGBrowser
