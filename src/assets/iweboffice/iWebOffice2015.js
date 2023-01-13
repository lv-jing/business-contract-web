var userAgent = navigator.userAgent,
				rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
				rFirefox = /(firefox)\/([\w.]+)/,
				rOpera = /(opera).+version\/([\w.]+)/,
				rChrome = /(chrome)\/([\w.]+)/,
				rSafari = /version\/([\w.]+).*(safari)/;
				var browser;
				var version;
				var ua = userAgent.toLowerCase();
				function uaMatch(ua) {
					var match = rMsie.exec(ua);
					if (match != null) {
						return { browser : "IE", version : match[2] || "0" };
					}
					var match = rFirefox.exec(ua);
					if (match != null) {
						return { browser : match[1] || "", version : match[2] || "0" };
					}
					var match = rOpera.exec(ua);
					if (match != null) {
						return { browser : match[1] || "", version : match[2] || "0" };
					}
					var match = rChrome.exec(ua);
					if (match != null) {
						return { browser : match[1] || "", version : match[2] || "0" };
					}
					var match = rSafari.exec(ua);
					if (match != null) {
						return { browser : match[2] || "", version : match[1] || "0" };
					}
					if (match != null) {
						return { browser : "", version : "0" };
					}
				}
				var browserMatch = uaMatch(userAgent.toLowerCase());
				if (browserMatch.browser) {
					browser = browserMatch.browser;
					version = browserMatch.version;
				}
var str = '';
//var copyright='金格科技iWebOffice2015智能文档中间件[演示版];V5.0S0xGAAEAAAAAAAAAEAAAAJkBAACgAQAALAAAAIyr4RJpeqLXTdr2x0s0ePu2SX7NWzW1ApokhflA7fBJf1rXwQ+QEhtUQ48LgKqeUp21xr4ORm+KqTEyh9QzxH4J3c3mY0+mSkPgLyVWqpbqd4MaakftOUoyABGnduKHIHlTY9f3DcOw6XpBDBySJh3xJ5meCQHvtXKWCEeifBaFqWhnscSrWFAaaNOAS2vBkC3siqB6xBDF69BUg4GeokvAwlPQ2WSnG3ou26L7O0kD0iZcvB0XLwN8X1XNXKRiPHlKqXPRyIMeb6La94qS97S3hPfEnazdkRRmBsKIumAyjd2Ovd103LCJZA8X52H7MMq/vj66v39yZ64MVl6rNqYCa2C8gBpqiL57djqBkOMYtJQof8NcioXWeSqxmdVCAZHSUO40NHyPbgJd1XBczAX5XUbsTA4UKkLXBXXsd5VbDjuplz/jUtDw3IUpFWwiNjXU7ipOBDYgivFazDrZmsUso+0jGGX9iTuw8yRwiYG126KsGyTKqklf/ocoCUaR8K9ytB/MKhVvGdCbqbB5ZB7TgmSzs/aAyE120e8FYrsCcxifcanWP82vljWwGKyw2Q==’;
var copyright='内蒙古伊利实业集团股份有限公司[专用];V5.0S0xGAAEAAAAAAAAAEAAAANMBAADgAQAALAAAANqJYLQGzakRKxirwiYqZlY5aj9nZXMzyUeJxp4TcvNL467JPfSh+TCuS30l9RGcG81HeielSUPTLgxOM+CjYz+yfhAjh6p2iPsBXXIxziB9rMoEVm9fk1W0Gq5pC3p0pc7EX2USyBTIXYdLKQqoXa7unSqz2+1i7sZG//ZigWcDC+Xs6x7BW8Sn7Yu6i6KF8A5f8LbfXnSK1h1dTNOR++MIpoYJ1jU8Oe5RqcY2Ah6lV8C4DGgbgDogAlBw+EABetgXLfHs7EmLCH4Kd+T04YkjVzLWuuYDTOBaWKpJzwywx9JKMoYG84weg66Mcec6jd+eYD+MXRw+ZFECYRgXshprZbmJ7qyecG9yAqXDnzZJOyHFCmrG2sMv4w814SLzk6sRcBbj3IbL4okdIlKkyNdrtf6WF4Sz09aGo3VfBkkI/q10CMpIl8ECpPB1CB7mD+p0eZDDzOdFDLwMDYZIaG/+GW9MZOHMye0ucv4924ZMg1JCKB3OVCnrYpLZqs9YLlAAqotNjPAh1FQYBLGh+uO81SFzFP0KHlkjHSMVpwBYvic7ASCOvOwHJmIzdgpNhHJ3Rckrf3yJZ6TD2mAi4SO3P9lhrMgRkA7hz/Wcg8BkQZ2Axi6DlVoQeM1GXHB+7VH2M/K5gqPi3EuXLg/aAGc=';
str += '<object id="WebOffice" class="viewOffice"';

str += ' width="75%"';//设置页面的样式
// str += ' height=""';//设置页面的样式
// str += "style:'width:80%;min-height:400px;'"

if ((window.ActiveXObject!=undefined) || (window.ActiveXObject!=null) ||"ActiveXObject" in window)
{
	if(window.navigator.platform == "Win32")
		str += ' CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"  codebase="iWebOffice2015.cab#version=0,0,0,0"';
	if (window.navigator.platform == "Win64")
		str += ' CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D024"  codebase="iWebOffice2015.cab#version=12,5,0,0"';
	str += '>';
	str += '<param name="Copyright" value="' + copyright + '">';
}
else if (browser == "chrome")
{

	str += ' clsid="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"';
	str += ' type="application/kg-plugin"';
	str += ' OnReady="OnReady"';
	str += ' OnCommand="OnCommand"';
	str += ' OnRightClickedWhenAnnotate="OnRightClickedWhenAnnotate"';
	str += ' OnSending="OnSending"';
	str += ' OnSendEnd="OnSendEnd"';
	str += ' OnRecvStart="OnRecvStart"';
	str += ' OnRecving="OnRecving"';
	str += ' OnRecvEnd="OnRecvEnd"';
	str += ' OnFullSizeBefore="OnFullSizeBefore"';
	str += ' OnFullSizeAfter="OnFullSizeAfter"';
	str += ' Copyright="' + copyright + '"';
	str += '>';
}
else if (browser == "firefox")
{
	str += ' clsid="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"';
	str += ' type="application/iWebPlugin"';
	str += ' OnCommand="OnCommand"';
	str += ' OnReady="OnReady"';
	str += ' OnOLECommand="OnOLECommand"';
	str += ' OnExecuteScripted="OnExecuteScripted"';
	str += ' OnQuit="OnQuit"';
	str += ' OnSendStart="OnSendStart"';
	str += ' OnSending="OnSending"';
	str += ' OnSendEnd="OnSendEnd"';
	str += ' OnRecvStart="OnRecvStart"';
	str += ' OnRecving="OnRecving"';
	str += ' OnRecvEnd="OnRecvEnd"';
	str += ' OnRightClickedWhenAnnotate="OnRightClickedWhenAnnotate"';
	str += ' OnFullSizeBefore="OnFullSizeBefore"';
	str += ' OnFullSizeAfter="OnFullSizeAfter"';
	str += ' Copyright="' + copyright + '"';
	str += '>';
}
str += '</object>';

var webOfficeTpl = str;
export default webOfficeTpl


