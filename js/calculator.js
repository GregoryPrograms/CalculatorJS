var calcSt = {
    curValue: "",
    curOper: "",
    prevValue:"",
    prevAns:  ""
}
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
            return(add(num1, num2));
            break;
        case '-':
            return(subtract(num1, num2));
            break;
        case '*':
            return(multiply(num1, num2));
            break;
        case '/':
            return(divide(num1, num2));
            break;
        default:
            break;
    }
}

//Analyzes button pressed and takes action based on the selection.
windowOutput = function(button, calcState){
    varNumWindow = document.getElementById("numWindow");
    varOpWindow = document.getElementById("operWindow");
    switch(button.className){
        case 'numButton':
            calcState.curValue += button.id;
            break;
        case 'operButton':
            //If we don't have a current value and we hit operator, we try to use the previous answer
            if(calcState.curValue == ""){
                if(calcState.prevAns != ""){
                    calcState.prevValue = calcState.prevAns;
                    calcState.curOper = button.id;
                    break;
                }
                else{
                    //Error handling for if we enter an operator sign with nothing to operate on.
                    break;
                }
            }
            else{
                //If we already have two values and an operator, computes them :- minimizes number of variables needed for storage.
                calcState.prevValue = calcState.prevValue == ""? calcState.curValue : 
                                                                operate(parseFloat(calcState.prevValue), calcState.curOper, parseFloat(calcState.curValue));
                calcState.curValue = "";
                calcState.curOper = button.id;
                break;
            }
        case 'eqButton':
            calcState.curOper != ""?
                calcState.prevAns = operate(parseFloat(calcState.prevValue), calcState.curOper, parseFloat(calcState.curValue)):
                calcState.prevAns = calcState.curValue;
                calcState.curValue = "";
                calcState.prevValue = "";
                calcState.curOper = "";
                break;
        case 'clearButton':
            calcState.curValue = "";
            calcState.prevValue = "";
            calcState.curOper = "";
            calcState.prevAns = "";
        default: break;
    }
    (calcState.curValue == "" && calcState.curOper == "" && calcState.prevAns != "")?
        varNumWindow.innerHTML = calcState.prevAns:
        varNumWindow.innerHTML = calcState.curValue;
    varOpWindow.innerHTML = calcState.curOper;
}

//Gives event listeners to all our buttons, telling them to alter the window somehow when they are pressed.
var buttons = document.getElementsByTagName("button");
for(button of buttons){
    button.addEventListener("click", function(thisButton){
        windowOutput(thisButton.target, calcSt);
      });
}
