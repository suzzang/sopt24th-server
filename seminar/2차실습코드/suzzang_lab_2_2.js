// const http = require('http');
// const request = require('request');
// const fs= require('fs');
// const json2csv= require('json2csv');

// const server = http.createServer((request,response)=>{
//     const option = {
//         uri : "http://15.164.75.18:3000/homework/2nd",
//         method: "GET"
//     };
//     request(option,(err,res,body)=>{
//         console.log(body);
//         const data = JSON.parse(body).data;
//         console.log(data);

//         const resultCsv = json2scv.parse({
//             data: data,
//             fields:["time"]
//         });
//         fs.writeFile('info.csv',resultCsv,(err)=>{
//             if(err){
//                 console.log(err);
//             }else{
//                 response.write("완료");
//                 response.end();
//             }
//         });
//     });
// }).listen(3000,()=>{
//     console.log("3000번 포트로 서버가 켜졌습니다!");
// });

const http = require('http');
const request = require('request');
const fs = require('fs');
const json2csv = require('json2csv');

const server=http.createServer((req,res)=>{
    const option = {
        url:"http://15.164.75.18:3000/homework/2nd",
        method:"GET"
    };

    request(option,(err,response,body)=>{
        console.log(body);
        const data = JSON.parse(body).data;
        console.log(data);


        const resultCsv = json2csv.parse({
            data:data,
            fields:["time"]
        })
        fs.writeFile('info.csv',resultCsv,(err)=>{
            if(err){
                console.log(err);
            }else{
                res.write("파일 저장 완료");
                res.end();
            }
        })
    });
}).listen(3000,()=>{
    console.log('3000');
});


//회원가입할때는 랜덤 값으로 솔트를 만들고 로그인 할때는 저장되어있던 솔트값으로 비교후 로그인 성공 실패 여부 가린다.

//2.응답로그 다 찍어서 에러 처리 해야함 
//signin signup info 3개의 url

//과제랑 실습코드 같이 보내라!