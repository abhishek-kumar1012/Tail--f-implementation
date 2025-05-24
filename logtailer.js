const fs=require('fs');
const {getLastNLinesFromEnd}=require('./utils');
let filePosition=0;
const listners=[];
function watchLogFile(onNewLine){
    if(!listners.includes(onNewLine))listners.push(onNewLine);

}
setInterval(()=>{
    const filePath=require('path').join(__dirname,'log.txt');
    fs.stat(filePath,(err,stats)=>{
        if(err)return ;
        if(stats.size<filePosition){
            filePosition=stats.size;
            return ;
        }
        if(stats.size>filePosition){
            const stream=fs.createReadStream(filePath,{
                start:filePosition,
                end:stats.size,
                encoding:'utf8',
            });
            let buffer='';
            stream.on('data',chunk=>buffer+=chunk);
            stream.on('end',()=>{
                filePosition=stats.size;
                const lines=buffer.split('\n').filter(line=>line.trim().length>0);
                lines.forEach(line=>{
                    listners.forEach(fn=>fn(line));
                });

            });
        }

    })
},500);
async function getLastNLines(filePath,n){
    return getLastNLinesFromEnd(filePath,n);
}
module.exports={watchLogFile,getLastNLines};
    

