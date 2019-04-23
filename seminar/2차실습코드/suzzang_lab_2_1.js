
const http = require('http');
const url =  require('url');
const querystring = require('querystring');
const crypto = require('crypto');

const server = http.createServer((request,response)=>{
    const urlParser = url.parse(request.url);
    //console.log(urlParser);
    const queryParse = querystring.parse(urlParser.query);
    console.log(queryParse);


    const str = queryParse.str;
    console.log(str);

    crypto.randomBytes(32,(err,buf)=>{
        if(err){
            console.log(err);
        }else{
            const salt = buf.toString('base64');
            console.log(`salt : ${salt}`);
            crypto.pbkdf2(str,salt,10,32,'SHA512',(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    const hashedStr = result.toString('base64');
                    console.log(`hasedStr : ${hashedStr}`);

                    
                    response.writeHead(200,{'Content-Type' : 'application/json'})
                    response.write(hashedStr);
                    response.end();
                }
               
            });
        }
    })

    
}).listen(3000,()=>{
    console.log("3000번 포트로 서버가 켜졌습니다!")
});