const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
const algorithm1 = require('./algorithm_1')
const algorithm2 = require('./algorithm_2')
const algorithm3 = require('./algorithm_3')
const fs = require("fs");
app.use(cors());
app.use(bodyParser.json())
app.get('/',(req,res)=>{
    if(req.query.type==='one'){
        let input = JSON.parse(fs.readFileSync('input.json', 'utf8'));
        let {rules} = JSON.parse(fs.readFileSync('rules.json', 'utf8'));
        res.json({
            input:input,
            rules:rules,
        })
    }
    else if(req.query.type==='multiple') {
        let input = JSON.parse(fs.readFileSync('inputMultiple.json', 'utf8'));
        let {rules} = JSON.parse(fs.readFileSync('rulesMultiple.json', 'utf8'));
        let tmp_input =[]
        let names = []
        for(key in input.input){
            tmp_input.push([])
            names.push(input.input[key].name)
            for(child in input.input[key].definitions){
                tmp_input[tmp_input.length-1].push(input.input[key].definitions[child])
                tmp_input[tmp_input.length-1][tmp_input[tmp_input.length-1].length -1].en_name = child
                tmp_input[tmp_input.length-1][tmp_input[tmp_input.length-1].length -1].en_parent = key
            }
        }
        res.json({
            input:tmp_input,
            degree_satisfaction: input.degree_satisfaction,
            rules:rules,
            names:names
        })
    }
})
app.post('/',(req,res)=>{
    console.log("xcbsfdbsfdv")
    let params = {

    }
    if(req.body.type==='one'){
        let input = JSON.parse(fs.readFileSync('input.json', 'utf8'));
        let {rules} = JSON.parse(fs.readFileSync('rules.json', 'utf8'));
        params={
            type:req.body.type,
            input:input,
            rules:rules,
            fuzzy:req.body.fuzzy,
            definition:req.body.definition
        }
        if(req.body.algorithm==="individual"){
            res.json(algorithm1.Main(params));
        }
        else if(req.body.algorithm==="aggregation"){
            res.json(algorithm2.Main(params));
        }
        else if(req.body.algorithm==='background'){
            res.json(algorithm3.Main(params));
        }
    }
    else if(req.body.type==='multiple') {
        let input = JSON.parse(fs.readFileSync('inputMultiple.json', 'utf8'));
        let {rules} = JSON.parse(fs.readFileSync('rulesMultiple.json', 'utf8'));
        params={
            input:input,
            rules:rules,
            fuzzy:req.body.fuzzy,
            definition:req.body.definition
        }
        res.json(algorithm3.Main(params));
    }
})
app.post('/add-rules',(req,res)=>{
    if (req.body.type === 'one'){
        let {rules} = JSON.parse(fs.readFileSync('rules.json', 'utf8'));
        rules.push(req.body.json)
        fs.writeFileSync('rules.json', JSON.stringify({rules}))
    }
    if (req.body.type === 'multiple'){
        let {rules} = JSON.parse(fs.readFileSync('rulesMultiple.json', 'utf8'));
        rules.push(req.body.json)
        fs.writeFileSync('rulesMultiple.json', JSON.stringify({rules}))
    }
})
app.listen(3001, ()=>{
    console.log("Server is running on 3001")
});