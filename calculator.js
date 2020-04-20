add = function(num1, num2){
    return num1 + num2;
}
subtract = function(num1, num2){
    return num1 - num2;
}
multiply = function(num1, num2){
    return num1 * num2;
}
divide = function(num1, num2){
    return num1 / num2;
}
operate = function(num1, oper, num2){
    switch(oper){
        case '+':
            console.log(add(num1, num2));
            break;
        case '-':
            console.log(subtract(num1, num2));
            break;
        case '*':
            console.log(multiply(num1, num2));
            break;
        case '/':
            console.log(divide(num1, num2));
            break;
        default:
            break;
    }
}
operate(1, "-", 2);