const TOKEN_TYPE_NAME = 1;
const TOKEN_TYPE_COUNT = 2;
const TOKEN_TYPE_GROUP = 3;

/**
 * @param type number, 0: atom name; 1: atom count; 2: sub token list
 * @param value atom name, or atom count, or sub token list
 */
const createToken = (type, value) => ({ type, value })

/**
 * @param {string} formula
 * @return {string}
 */
var countOfAtoms = function(formula) {
    if (typeof formula !== 'string' || !formula) {
        return formula;
    }
    const atomCountMap = countFromTokens(parseToTokens(formula));
    return Object.keys(atomCountMap).sort().map((atomName) => {
        const count = atomCountMap[atomName];
        return count === 1 ? atomName : atomName + count;
    }).join('');
};

function countFromTokens(tokens) {
    const atomCountMap = {}
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const nextToken = tokens[i + 1];
        if (token.type === TOKEN_TYPE_NAME) {
            const atomName = token.value.join('');
            let atomCount = 1;
            if (nextToken && nextToken.type === TOKEN_TYPE_COUNT) {
                atomCount = parseFloat(nextToken.value.join(''));
            }
            if (atomCountMap[atomName]) {
                atomCount += atomCountMap[atomName];
            }
            atomCountMap[atomName] = atomCount;
        } else if (token.type === TOKEN_TYPE_GROUP) {
            const groupCountMap = countFromTokens(token.value);
            let multi = 1;
            if (nextToken && nextToken.type === TOKEN_TYPE_COUNT) {
                multi = parseFloat(nextToken.value.join(''));
            }
            Object.keys(groupCountMap).forEach((atomName) => {
                let atomCount = groupCountMap[atomName] * multi;
                if (atomCountMap[atomName]) {
                    atomCount += atomCountMap[atomName];
                }
                atomCountMap[atomName] = atomCount;
            });
        }
    }
    return atomCountMap;
}

function parseToTokens(formula) {
    const tokenList = [];
    let crtTokenType = 0;
    let crtTokenValue = [];
    for (let i = 0; i < formula.length; i++) {
        const char = formula[i];
        const charCode = char.charCodeAt(0);
        if (charCode >= 65 && charCode <= 90) {
            // A-Z
            if (crtTokenType) {
                tokenList.push(createToken(crtTokenType, crtTokenValue));
                crtTokenValue = [];
            }
            crtTokenType = TOKEN_TYPE_NAME;
            crtTokenValue.push(char);

        } else if (charCode >= 97 && charCode <= 122) {
            // a-z
            crtTokenValue.push(char)

        } else if (charCode >= 48 && charCode <= 57) {
            // 0-9
            if (crtTokenType !== TOKEN_TYPE_COUNT) {
                tokenList.push(createToken(crtTokenType, crtTokenValue));
                crtTokenValue = [];
            }
            crtTokenType = TOKEN_TYPE_COUNT
            crtTokenValue.push(char)

        } else if (charCode === 40) {
            // '('
            if (crtTokenType) {
                tokenList.push(createToken(crtTokenType, crtTokenValue));
                crtTokenValue = [];
            }
            const { str, endIndex } = readParentheses(formula, i);
            crtTokenType = TOKEN_TYPE_GROUP;
            crtTokenValue = parseToTokens(str)
            i = endIndex;
        }
    }
    tokenList.push(createToken(crtTokenType, crtTokenValue));
    return tokenList;
}

function readParentheses(formula, startIndex) {
    const strArr = [];
    let quoteCount = 1;
    let index = startIndex + 1;
    for (; index < formula.length; index++) {
        const char = formula[index];
        if (char === ')') {
            quoteCount--;
            if (quoteCount === 0) {
                break;
            }
        } else if (char === '(') {
            quoteCount++;
        }
        strArr.push(char);
    }
    return {
        endIndex: index,
        str: strArr.join(''),
    };
}
