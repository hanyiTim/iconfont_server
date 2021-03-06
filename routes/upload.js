var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var util = require('../util/utils.js');
var child_process = require('child_process');
var config = require('../config/index.js');

router.post('/', (req, res)=>{
    let isSuccess = false,
        {file} = req,
        {name} = req.body,
        data;
    let p = new Promise((resolve)=>{
        let originalname = file.originalname,
            distPath = path.join(util.getRootPath(),`/public/zip/${name}.zip`);
        if(!fs.renameSync(file.path,distPath)){
            try{
                child_process.execSync(`gulp append --fontName ${name}`);
            }catch(err){
                if(err.error){
                    resolve(false);
                }
            }
            resolve({status:true,originalname,name});
        }else{
            resolve({status:false});
        }
    })
    p.then(({status,originalname,name})=>{
        isSuccess = status;
        data = {
            zip:`${config.HOST}/zip/${name}.zip`,
            config:`${config.HOST}/config/${name}/config.json`,
            source:`${config.HOST}/source/${name}.zip`,
            designConfig:`${config.HOST}/unzip/${name}/selection.json`,
            css:`${config.HOST}/dist/${name}/iconfont.css`,
        }
        res.send({
            rcode: isSuccess ? 0 : -1,
            data
        });
    }).catch((e)=>{
        res.send({
            rcode: -1,
            error:e
        });
    })
});

module.exports = router;
