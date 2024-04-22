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

let primes = generatePrime(10000)
let p = primes[chooseRandom(primes.length/2, primes.length)]
let q = primes[chooseRandom(primes.length*3/4, primes.length)]

console.log(p, q)

//totient function phi(n) = (p – 1)(q – 1)
function totient(p, q){
    return (p-1)*(q-1)
}

let n = p*q
let totientN = totient(p, q)
console.log(n)
console.log(totientN)


function PBB(a, b){
    let big = Math.max(a, b)
    let small = Math.min(a, b)

    if(small === 0){
        return big;
    }
    return PBB(small, big % small)
}

//e = salah satu bagian kunci publik, e koprima dengan n
function generatePublicKey(num){
    let coprime = chooseRandom(num/3, num)

    while(coprime < num && PBB(coprime, num) !== 1){
        coprime--
    }
    
    return coprime
}

let e = generatePublicKey(totientN)
console.log(e)

//d = salah satu bagian kunci privat, dihitung dengan algoritma euclidean
//ed ekuivalen 1 mod phi(n) -> d = (1 + k*phi(n))/e
//k = 1, 2, 3, ... dimasukkan ke persamaan hingga didapat d yang bernilai bulat
function generatePrivateKey(e){
    let k = 1

    while(((1+k*totientN)/e)%1 !== 0){
        k += 1
    } 
    return (1+k*totientN)/e
}

let d = generatePrivateKey(e)
console.log(d)

function encryptModulo(message, e, n){
    let i = 1
    let result = 1

    while(i <= e){
        result *= message%n
        result = result%n
        i++
    }

    return result
    
}

//encrypt: c = message^e mod n
function encrypt(message, e, n){
    let i = 1
    let c = 1

    while(i <= e){
        c *= message%n
        c = c%n
        i++
    }

    return c
}

let c = encrypt(1924, e, n)
console.log(c)
//decrypt: message = c^d mod n
function decrypt(c, d, n){
    let i = 1
    let message = 1

    while(i <= d){
        message *= c%n
        message = message%n
        i++
    }

    return message
}
console.log(decrypt(c, d, n))

//kunci publik: (e, n)
//kunci privat: (d, n)
