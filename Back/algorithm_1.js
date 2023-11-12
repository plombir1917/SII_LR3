const fs = require('fs')
let input = JSON.parse(fs.readFileSync('input.json', 'utf8'));
let {rules} = JSON.parse(fs.readFileSync('rules.json', 'utf8'));

let R_n = []
let B_n_stroke = []

function Mamdani(A, B) {
    let R = []
    for (let i = 0; i < A.length; i++) {
        R.push([])
    }
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B.length; j++) {
            R[i].push(Math.min(A[i], B[j]));
        }
    }
    return (R)
}

function Larsen(A, B) {
    let R = []
    for (let i = 0; i < A.length; i++) {
        R.push([])
    }
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B.length; j++) {
            R[i].push(Math.round(A[i] * B[j] * 10) / 10);
        }
    }
    return R
}


function calcRules(implication) {
    if (implication === 'Mamdani'){
        rules.forEach((rule, index) => {
            R_n.push(Mamdani(input.financing.definitions[rule.if.financing].value, input.degree_satisfaction.definitions[rule.then.degree_satisfaction].value))
        })
    }
    if (implication === 'Larsen'){
        rules.forEach((rule, index) => {
            R_n.push(Larsen(input.financing.definitions[rule.if.financing].value, input.degree_satisfaction.definitions[rule.then.degree_satisfaction].value))
        })
    }
}

function B_Stroke(A_prime, R) { //100% верно
    let B = []
    let tmpMAX = [];

    for (let j = 0; j < R[0].length; j++) {
        tmpMAX = [];

        for (let k = 0; k < R.length; k++) {
            tmpMAX.push(Math.min(A_prime[k], R[k][j]))
        }

        B.push(Math.max(...tmpMAX));
    }
    return B
}

function Aggregation(B_n_stroke) {
    let agg = []
    for (let i = 0; i < B_n_stroke[0].length; i++) {
        let tmp = []
        for (let j = 0; j < B_n_stroke.length; j++) {
            tmp.push(B_n_stroke[j][i])
        }
        agg.push(Math.max(...tmp))
    }
    return agg
}

function main() {
    let implications = 'Mamdani'
    let A_prime = input.financing.definitions.many.value
    calcRules(implications)
    for (let i = 0; i < R_n.length; i++) {
        B_n_stroke.push(B_Stroke(A_prime, R_n[i]))
    }
    console.log(Aggregation(B_n_stroke))
}

main()
