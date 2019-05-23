var express = require('express');
var router = express.Router();

const upload = require('../config/multer');

/*
    파일 전송 시 content-type은 form-data로 지정합니다.
    form-data로 오는 모든 데이터는 string으로 들어오니 적절하게 형변환해서 사용하세요.
    파일 전송할 때 upload 모듈로 받지 않으면 body 값을 인식 못합니다! 빼먹지 말고 꼭 쓰셔야해요!!
*/

//이미지 관련해서는 꼭 upload.single이나 upload.filed 등등 이렇게 써줘야 한다.
//이 업로드는 컨피그 멀터에서 모듈로 땡겨온 것이다. 이걸 안써주면 바디값이 없다고 뜬다. 
router.post('/single', upload.single('img'), (req, res) => { //img가 받을 키명이다.
    /*
        파일이 하나만 전송할 때 single 메소드 쓰임
        file.location으로 전송된 파일 경로 접근
    */

    //console.log(req.file);이걸 확인해보면 여러가지 데이터들이 나오는데 그중에서 location만 쓴다는 것이다.
    const img = req.file.location;
    console.log(img);
});

router.post('/multi', upload.array('imgs'), (req, res) => {
    /*
        파일을 여러개 전송할 때 array 메소드 쓰임
        req.files에 전송된 파일들에 대한 정보가 들어있음
        files[i].location으로 전송된 파일 경로 접근
    */
    const imgs = req.files; 
    for (let i = 0; i < imgs.length; i++) { //배열로 받았기 때문에 for문으로 각각 imgs배열의 location을 출력
        console.log(imgs[i].location)
    }
});

router.post('/fields', upload.fields([{ name: 'img' }, { name: 'photos' }]), (req, res) => {
    /*
        파일을 여러개 전송할 때 fields 메소드 쓰임
        req.files에 전송된 키 값 이름으로 사진에 대한 정보 배열이 들어가있음
        files.키값[i].location으로 전송된 파일 경로 접근
    */
    console.log(req.files);
    console.log("------------------------------");
    console.log(req.files.img[0].location);
    console.log(req.files.photos[0].location);
    
})

module.exports = router;