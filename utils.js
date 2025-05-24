const fs=require('fs');
function getLastNLinesFromEnd(filePath, n){
    return new Promise((resolve,reject)=>{
    fs.readFile(filePath,'utf8',(err,data)=>{
        if(err)return reject(err);
        const lines=data.trim().split('\n');
        resolve(lines.slice(-n));
    });
    });
}
module.exports={getLastNLinesFromEnd};