const http=require("http");
const fs=require("fs");

const logRequests="yes";
const logRequestor="yes";

// FUNCTION: TIME STAMP
function timeStamp(){
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	return "["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"]"
}

// CONSOLE WHEN LAUNCHED
console.info(timeStamp()+" -- [localhost] WebServer is now READY --");

// VARIABLES AND ARRAYS
var requestor=""
var availableTypes=["css","js","ico","jpg","png","gif","ttf","woff","html"];
var availableContentTypes=["text/css","text/javascript","image/x-icon","image/jpeg","image/jpeg","image/gif","application/x-font-ttf","application/font-woff","text/html"];

const MSG_NOTFOUND="<br /><br /><center><h1>[<span style='color:#F00'>404</span>] PAGE/FILE <span style='color:#F00'>NOT</span> FOUND</h4></center>";

// CREATE HTTP SERVER
http.createServer(function (requested, response) {
	if(requested.url==="/"){
		console.info(timeStamp()+" Attempting to access file:  index.html")
		requested.url="/index.html"
	}
	let extension=requested.url.split("."); extension=extension[1];
	
	if(requested.headers){
		if(requested.headers['user-agent']!==requestor){
			requestor=requested.headers['user-agent'];
			if(logRequestor==="yes"){
				console.info(timeStamp()+" Incoming Request from: "+requestor)
			}
		}
	}
	if(availableTypes.includes(extension)){
		let fileType=availableContentTypes[availableTypes.indexOf(extension)];
		fs.readFile(requested.url.slice(1), function(err, data) {
			if (err) {
				response.writeHead(404, {'Content-Type': 'text/html'});
				if(logRequests==="yes"){
					console.info(timeStamp()+" File Requested: "+requested.url.slice(1)+"   <- - -   NOT FOUND!")
				}
				return response.end(MSG_NOTFOUND);
			}
			if(logRequests==="yes"){
				console.info(timeStamp()+" File Requested: "+requested.url.slice(1))
			}
			response.writeHead(200, {'Content-Type': fileType});
			response.write(data);
			response.end();
		})
	}
	else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		console.info(timeStamp()+" File Requested: "+requested.url.slice(1)+"   <- - -   NOT FOUND!")
		console.info(timeStamp()+" [ERROR] INVALID FILE - FILETYPE NOT ACCEPTED!");
		return response.end(MSG_NOTFOUND);
	}
}).listen(80);
