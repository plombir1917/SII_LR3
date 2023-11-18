const fs = require('fs')

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


function calcRules(implication,input,rules) {
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


module.exports ={
    Main: function main(params) {
        R_n = []
        B_n_stroke = []
        let A_prime = params.input.financing.definitions[params.definition].value
        let B_value = params.input.degree_satisfaction.value
        calcRules(params.fuzzy,params.input,params.rules)
        for (let i = 0; i < R_n.length; i++) {
            B_n_stroke.push(B_Stroke(A_prime, R_n[i]))
        }
        let numerator=0
        let denominator = 0
        let agg  = Aggregation(B_n_stroke)
        for (let i = 0; i < agg.length; i++) {
            numerator +=B_value[i]*agg[i]
            denominator +=agg[i]
        }
        console.log(numerator/denominator)
        return numerator/denominator
        // return (Aggregation(B_n_stroke).map((b,index)=>B_value[index]+'/'+b+'+').join(''))
    }
}

