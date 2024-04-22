//untuk keperluan pemilihan index random pada array
function chooseRandom(min, max){
    return Math.floor(Math.random() * (max - min) + min)
}

function generatePrime(num){
    let composites = []
    let primes = []

    for (let i = 2; i <= num; ++i) {
        if (!composites[i]) {
            primes.push(i);
            for (let j = i * 2; j <= num; j += i) {
                composites[j] = true;
            }
        }
    }
    return primes
}

let primes = generatePrime(300)
let p = primes[chooseRandom(primes.length/2, primes.length)]
let q = primes[chooseRandom(primes.length*3/4, primes.length)]
let n = p*q

//totient function phi(n) = (p – 1)(q – 1)
function totient(p, q){
    return (p-1)*(q-1)
}

let totientN = totient(p, q)

function PBB(a, b){
    let big = Math.max(a, b)
    let small = Math.min(a, b)

    if(small === 0){
        return big;
    }
    return PBB(small, big % small)
}

//e salah satu bagian kunci publik
//menghasilkan random e yang koprima dengan n
function generatePublicKey(num){
    let coprime = chooseRandom(num/3, num)

    while(coprime < num && PBB(coprime, num) !== 1){
        coprime--
    }
    
    return coprime
}

let e = generatePublicKey(totientN)

//d = salah satu bagian kunci privat
//ed ekuivalen 1 mod phi(n) -> d = (1 + k*phi(n))/e
//k = 1, 2, 3, ... dimasukkan ke persamaan hingga didapat d yang bernilai bulat
function generatePrivateKey(e){
    let k = 1

    while(((1+k*totientN)/e)%1 !== 0){ //bilangan bulat bersisa 0 jika dibagi oleh 1
        k += 1
    } 
    return (1+k*totientN)/e
}

let d = generatePrivateKey(e)

//kunci publik: (e, n)
//kunci privat: (d, n)
function getKey(){
    return {private: d, public: e, n:n}
}

//encrypt: c = message^e mod n
function encrypt(message, e, n){
    let messageArr = message.split("")
    let cArr = []

    for(let idx = 0; idx < messageArr.length; idx++){
        let i = 1
        let c = 1
        while(i <= e){
            c *= messageArr[idx].charCodeAt(0)%n
            c = c%n
            i++
        }
        cArr.push(c)
    }

    return btoa(cArr.join(" "))
}

//decrypt: message = c^d mod n
function decrypt(c, d, n){
    let cArr = atob(c).split(" ")
    let messageArr = []

    for(let idx = 0; idx < cArr.length; idx++){
        let i = 1
        let message = 1
        while(i <= d){
            message *= cArr[idx]%n
            message = message%n
            i++
        }
        messageArr.push(String.fromCharCode(message))
    }

    return messageArr.join("")
}

export {getKey, encrypt, decrypt}