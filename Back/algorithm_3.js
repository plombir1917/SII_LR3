const fs = require('fs')
let input = JSON.parse(fs.readFileSync('inputMultiple.json', 'utf8'));
let {rules} = JSON.parse(fs.readFileSync('rulesMultiple.json', 'utf8'));


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

function B_stroke(alphas,B_n){
    let B_n_stroke=[]
    for (let i = 0; i < B_n.length; i++) {
        B_n_stroke.push([])
        for (let j = 0; j < B_n[i].length; j++) {
            B_n_stroke[i].push(Math.min(B_n[i][j],alphas[i]))
        }
    }
    return B_n_stroke
}

function calcBackground(A_n,A_n_stroke){
    function minSet(A,A_stroke){
        let min = []
        for (let i = 0; i < A.length; i++) {
            min.push( Math.min(A[i],A_stroke[i]))
        }
        return min
    }
    let alpha = []
    for (let i = 0; i < A_n[0].length; i++) { //альфа
        let max = []
        for (let j = 0; j < A_n.length; j++) { //max
            max.push(Math.max(...minSet(A_n[j][i],A_n_stroke[j])))
        }
        // console.log(max)
        alpha.push(Math.min(...max))
    }
    return(alpha)
}

function main() {
    let A_n = []
    // for (let key in input) {
    //     A_n.push([])
    //     for (let child in input[key].definitions) {
    //         A_n[A_n.length - 1].push(input[key].definitions[child].value)
    //     }
    // }
    for (let i = 0; i < Object.keys(rules[0].if).length; i++) {
        A_n.push([])
    }
    for (let i = 0; i < rules.length; i++) {
        let j = 0
        for (key in rules[i].if){
            let val=rules[i].if[key]
            A_n[j].push(input[key].definitions[val].value)
            j++
        }
    }

    let A_n_stroke = [
        [1, 0.8, 0.6, 0.4, 0.2, 0, 0],
        [0.9, 1, 0.7, 0.1, 0],
        [0, 0.2, 0.7, 0.9, 0.7]
    ]
    let B_n=[]

    for (let i = 0; i < rules.length; i++) {
        let j = 0
        for (key in rules[i].then){
            let val=rules[i].then[key]
            B_n.push(input[key].definitions[val].value)
            j++
        }
    }
    let alphas = calcBackground(A_n,A_n_stroke)
    let b_stroke = B_stroke(alphas,B_n)
    console.log(Aggregation(b_stroke))

}

main()
