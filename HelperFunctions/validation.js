function validateUserInput(args) {
    //
    let missingArgs = [];
    let missingArgsString = 'Missing following arguments: ';
    for (let [key, value] of args) {
        if (value == undefined) {
            missingArgs.push(key);
        }
    }
    missingArgs.forEach((missingArg, index) => {
        if (index == missingArgs.length - 1) return (missingArgsString += `${missingArg}.`);
        missingArgsString += `${missingArg}, `;
    });
    if (missingArgs.length == 0) return { status: 200, args };
    return { status: 400, message: missingArgsString };
}

module.exports.validateUserInput = validateUserInput;
