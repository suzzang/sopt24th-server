const http = require('http');
const url =  require('url');

const querystring = require('querystring');
const crypto = require('crypto');
const fs = require('fs');
const json2csv = require('json2csv');
const csvtojson = require('csvtojson');

/**
 * request 시 받아온 body의 data 무조건 살피기(parse 로 제이슨 객체 만들어주기)
 * 그리고나서 .키이름 을통해 value 에 접근가능
 * scope 신경쓰기
 */




const server = http.createServer((request,response)=>{
    const urlParser = url.parse(request.url);
    const queryParse = querystring.parse(urlParser.query);
  //  console.log(urlParser);

    if (request.url == '/favicon.ico') { //파비콘 에러 처리 
        return;
    }else if(urlParser.pathname == '/signin'){ //signin
        const id = queryParse.id;
        const pw = queryParse.pw;
        crypto.randomBytes(32,(err,buf)=>{
            if(err){
                console.log(err);
            }else{
                const salt = buf.toString('base64');
                crypto.pbkdf2(pw,salt,10,32,'SHA512',(err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        const hashedPw = result.toString('base64');
                        const resultCsv = json2csv.parse({
                            id : id,
                            pw : hashedPw,
                            salt : salt
                        })
                        fs.writeFile('signin.csv',resultCsv,(err)=>{
                            if(err){
                                console.log(err);
                            }else{
                                response.write("signin successed");
                                response.end();
                            }
                        })
    
                    }
    
                });

                return ;
    
    
            }
        })
    }else if(urlParser.pathname == '/signup'){ //signup

        const id = queryParse.id;
        const pw = queryParse.pw;  

        const filePath = '/Users/suzzang/Desktop/Suuzzangs/Develope/Sopt/Server_Node_24th/signin.csv';

        csvtojson().fromFile(filePath).then((jsonObj)=>{ //csv 파일을 json 객체 배열로 바꿔줌(왜 배열로 줄까...ㅎ)
        
            const saved_hspw = jsonObj[0].pw;
            const saved_salt = jsonObj[0].salt;
   
            crypto.pbkdf2(pw,saved_salt,10,32,'SHA512',(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    if(result.toString('base64') == saved_hspw){
                        response.write('login successed');
                    }else{
                        response.write('differnt password, login fail');
                    }
                    response.end();
    
                }
            });
        });


    }else if(urlParser.pathname == '/info'){ //info
        const request = require('request');

        const data = {
            name:"최수정",
            phone:"010-3959-6320"
        };

        const option = {
            url:"http://15.164.75.18:3000/homework/2nd",
            method:"POST",
            form: data
        };

        request(option,(err,res,body)=>{
            if(err){
                console.log(err);
            }else{
                const status = JSON.parse(body).status;
                const message = JSON.parse(body).message;
            
              // console.log(body);

                if(status==200&&message == "회원 정보 확인"){ //res.statusCode 는 무조건 200으로 들어오니까 주의
                    response.write("Member info verification is completed\n=======================================\n");
                    const name =JSON.parse(body).data.name;
                    const phone =JSON.parse(body).data.phone;
                    const colleage =JSON.parse(body).data.colleage;
                    const major = JSON.parse(body).data.major;
                    const email = JSON.parse(body).data.email;


                    crypto.randomBytes(32,(err,buf)=>{
                        if(err){
                            console.log(err);
                        }else{
                            const salt = buf.toString('base64');
                            
                            crypto.pbkdf2(phone,salt,10,32,'SHA512',(err,result)=>{
                                if(err){
                                    console.log(err);
                                }else{
                                     const hashedPhone = result.toString('base64');
                                     const resultInfo = json2csv.parse({
                                        name:name,
                                        phone:hashedPhone,
                                        colleage:colleage,
                                        major:major,
                                        email:email
                                    });
                                    fs.writeFile('soptInfo.csv',resultInfo,(err)=>{
                                        if(err){
                                            console.log(err);
                                        }else{
                                            response.write('save successed');
                                            response.end();
                                        }
                                    });
                    
                                }
                            })
                        }
                    });

                }else if(status == 400){
                    if(message == "해당하는 회원 없음"){
                        response.write('There is no such information');
                    }else if(message == "이름 혹은 전화번호 값이 없음"){
                        response.write('There is no name or phone');
                    }
                    response.end();
                  
                }
             
            }
          
        });
    }
}).listen(3000,()=>{
    console.log('포트열렸습니당');
});


