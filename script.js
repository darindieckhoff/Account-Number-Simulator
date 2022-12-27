
const button = document.getElementById("button");
const reset = document.getElementById("reset");
button.addEventListener('click', checkClick);
reset.addEventListener('click', resetOptions);

let typecode  = [];
let lengthval = [];
let err = '';

function checkClick () {
    cleanup('result1');
    cleanup('result2');
    let combined = document.getElementById('pcombined');
    combined.innerHTML = '';
    getparms();
    if (!err) {
        writeResults(typecode, 'result1');
        writeResults(lengthval, 'result2');
        let combinedacct = lengthval.join('');
        let modType = document.getElementById('modSelect').value;
        if (modType && !combinedacct.includes("X")) {
            let modulusAccount = modulus(modType,combinedacct);
            let seqLength = parseInt(document.getElementById("length6").value);
            combined.innerHTML = modulusAccount;
            document.getElementById("result2").lastChild.innerHTML = modulusAccount.substring(modulusAccount.length-(seqLength), modulusAccount.length);
        } else {
            combined.innerHTML = combinedacct;
        }
    } else {
        combined.innerHTML = err;
    }
}

function resetOptions () {
    resetValues();
    cleanup('result1');
    cleanup('result2');
    document.getElementById('pcombined').innerHTML = '';
}

function getparms () {
    let i = 1;
    typecode = [];
    lengthval = [];
    typeVal = [];
    err = '';
    while (i <= 6) {
        let inputType = document.getElementById("Order"+ i).value
        let typeLength = document.getElementById("length"+ i).value;
        let valNum = document.getElementById("value"+i).value;
        let typeLenNum = parseInt(typeLength);
        if (i == 6 && typeLenNum == 0) {
            return err = "Must have sequence length!";
        }
        if (typeLenNum > 0 && inputType.length > 0) {
            if (dupTypes(inputType)) {
                return err = "Duplicate Types!";
            } else if (valNum.length != typeLenNum && parseInt(valNum) > 0) {
                return err = inputType + " value doesn't match length!"  
            } else {
                typecode.push(inputType);
                if (i == 1 && parseInt(valNum) > 0) {
                    lengthval.push(parseInt(valNum));
                } else if (parseInt(valNum) > 0) {
                    lengthval.push(valNum);
                } else {
                    lengthval.push(res1(typeLength));
                }
            }
        }
        i++;
    }
    if (tooLong()) {
        return err = "Length > 16 digits!";
    }
}

const tooLong = () => {return lengthval.join('').length > 16?true:false};

const dupTypes = (x) => {return typecode.includes(x)?true:false};

function res1 (x) {
    let output = '';
    let i = 0
    do {
        i=i+1;
        output = output + 'X';
    } while (i < parseInt(x))
    return output;
}

function cleanup (div) {
    const resdiv = document.getElementById(div)
    while(resdiv.firstChild){
        resdiv.removeChild(resdiv.firstChild);
    }
}

function writeResults (arr,element) {
    let i = 0;
    while (i < arr.length) {
        const result = document.createElement("p");
        result.innerHTML = arr[i];
        document.getElementById(element).appendChild(result);
        i++;
    }
}

function resetValues () {
    let i = 1;
    while (i <= 6) {
        if (i < 6) {
            document.getElementById("Order"+ i).value = '';
        } 
        document.getElementById("length"+ i).value = '0';
        document.getElementById("value"+i).value = '0';
        i++;
    }
}

const modulus = (modNum,acctNum) => {return !validModNum(modNum,acctNum)?acctNum:generateNum(modNum,acctNum)}

function validModNum (modNum,acctNum) {
    let numSplit = acctNum.split("");
    if (modNum == '11') {
        numSplit.forEach(modWeight11);
        return Boolean(rem11(numSplit));
    } else {
        numSplit.forEach(modWeight10);
        return Boolean(rem10(numSplit));
    }
}

const modWeight11 = (item, index, arr) => arr[index] = parseInt(item)*(arr.length-index)

function modWeight10 (item, index, arr) {
    arr[index] = parseInt(item);
    if (!(arr[index] % 2)) {
        arr[index] = item * 2;
        if (arr[index] > 10) {
            let splitNum = arr[index].toString().split("");
            arr[index] = sumUp(splitNum);
        }
    }
}

const rem11 = (x) => (x.reduce((partialSum, a) => partialSum + a, 0)) % 11

const rem10 = (x) => (x.reduce((partialSum, a) => partialSum + a, 0)) % 10

const sumUp = (x) => (x.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0))

function generateNum (modNum,acctNum) {
    do {
        acctNum = parseInt(acctNum) + 1;
        acctNum = acctNum.toString();
        if (!validModNum(modNum,acctNum)) {
            return acctNum;
        } else {
            isGood = false;
        }
    } while (!isGood);
}

