const fs = require('fs')
let input
let rules


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

function B_stroke(alphas, B_n) {
    let B_n_stroke = []
    for (let i = 0; i < B_n.length; i++) {
        B_n_stroke.push([])
        for (let j = 0; j < B_n[i].length; j++) {
            B_n_stroke[i].push(Math.min(B_n[i][j], alphas[i]))
        }
    }
    return B_n_stroke
}

function calcBackground(A_n, A_n_stroke,fuzzy) {
    function minSet(A, A_stroke) {
        let min = []
        for (let i = 0; i < A.length; i++) {
            min.push(Math.min(A[i], A_stroke[i]))
        }
        return min
    }

    let alpha = []
    for (let i = 0; i < A_n[0].length; i++) { //альфа
        let max = []
        for (let j = 0; j < A_n.length; j++) { //max
            max.push(Math.max(...minSet(A_n[j][i], A_n_stroke[j])))
        }
        // console.log(max)
        if(fuzzy === "Mamdani"){
            alpha.push(Math.min(...max))
        }
        else{
            alpha.push(max.reduce((acc, rec) => acc * rec))
        }
    }
    return (alpha)
}

module.exports = {
    Main: function main(params) {
        let A_n = []
        rules = params.rules
        input = params.input
        for (let i = 0; i < Object.keys(rules[0].if).length; i++) {
            A_n.push([])
        }
        for (let i = 0; i < rules.length; i++) {
            let j = 0
            for (key in rules[i].if) {
                let val = rules[i].if[key]
                if (params.type !=='one'){
                    A_n[j].push(input.input[key].definitions[val].value)
                }
                else{
                    A_n[j].push(input[key].definitions[val].value)
                }
                j++
            }
        }
        let A_n_stroke
        if (params.type==='one'){
            A_n_stroke = [params.input.financing.definitions[params.definition].value]
        }
        else{
            A_n_stroke = params.definition
        }
        let B_n = []

        for (let i = 0; i < rules.length; i++) {
            let j = 0
            for (key in rules[i].then) {
                let val = rules[i].then[key]
                B_n.push(input[key].definitions[val].value)
                j++
            }
        }
        let alphas = calcBackground(A_n, A_n_stroke,params.fuzzy)
        let b_stroke = B_stroke(alphas, B_n)
        let result =Aggregation(b_stroke)
        let numerator=0
        let denominator = 0
        for (let i = 0; i < result.length; i++) {
            numerator += input.degree_satisfaction.value[i]*result[i]
            denominator +=result[i]
        }
        console.log(numerator/denominator)

        return numerator/denominator

    }
}
