const express=require('express');
const http =require('http');
const WebSocket=require('ws');
const path =require('path');
const{getLastNLines,watchLogFile}=require('./logtailer');
//const { getLastNLinesFromEnd} = require('./utils');
const LOG_FILE=path.join(__dirname,'log.txt');
const app=express();
const server=http.createServer(app);
const wss=new WebSocket.Server({server});
app.use(express.static(path.join(__dirname,'public')));
app.get('/log',(req,res)=>{
res.sendFile(path.join(__dirname,'public','index.html'));
});
wss.on('connection',async(ws)=>{

const lastLines=await getLastNLines(LOG_FILE,10);
ws.send(lastLines.join('\n'));
const handler =(line)=>{
    if(ws.readyState===WebSocket.OPEN){
        ws.send(line);
    }
};
watchLogFile(handler);

});
const PORT = 8080;

server.listen(PORT,()=>{
   console.log(`Server is running at http://localhost:${PORT}/log`);
});