//calcSt acts as the calculator's memory - it tracks all information necessary for the program.
//Possible TODO - make a main function, that is always running while the calculator is loaded into someone's web browser. This would allow me to have calcSt be nonglobal.
//  curValue (String): The current value being worked with.
//  prevValue (String): The value previously inputted, if any. Usually only exists after an operator is chosen.
//  prevAns (String): The most recent answer the calculator has recieved. Only exists after the user selects '='.
//  isError (String): An error tracker. Watches for calculations that would crash the calculator or lead to NaN answers, and provides output.
//  currentWindow (String): Tracks what should be displayed on the screen.
var calcSt = {
    curValue: "",
    curOper: "",
    prevValue:"",
    prevAns:  "",
    isError: "false",
    curWindow: ""
};

//add, subtract, multiply, and divide: simple operative functions that return the correct calculation between the two parameters. Could be handled within operate simply, but the code specs required they be individual functions.
//Parameters:
//  num1 (float) : the first number being operated on.
//  num2 (float) : the second number being operated on. In subtraction, it takes the role of the number being subtracted (from num1). In division, it is the denominator.
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

//operate: calls the correct operative function depending on what the passed operator is.
//          If the operator is division, checks for division by zero, and returns an error if it finds it.
//Parameters:
//  num1 (float): the first number being operated on.
//  oper (string): the inputted operator.
//  num2 (float) : the second number being operated on. In subtraction, it takes the role of the number being subtracted (from num1). In division, it is the denominator.
//  calcState (object) : the current value of calcSt, carrying info needed for error handling. Passed instead of utilized as a global, to make it easier to switch calcSt to a local at a later point.
operate = function(num1, oper, num2, calcState){
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
            if(num2 == 0){
                calcState.isError = "No div by 0";
                return 0;
            }else return(divide(num1, num2));
            break;
        default:
            break;
    }
}

//windowOutput: called when a button is pressed. Finds out what button was pressed, and takes action or calls a function based on the button and the current state of the calculator (calcState / calcSt).
//Parameters:
//  button (html element): The button that was pressed. Carries information like the class of the button (what kind of button was pressed - i.e., number button, operator button, etc.), and the button id (which button exactly was pressed)
//  calcState (object): The current state of the calculator, carrying information needed for calculation and error handling.
windowOutput = function(button, calcState){
    varNumWindow = document.getElementById("numWindow");
    switch(button.className){
        case 'numButton':
            //If the button was a number, adds it on to the end of the current value being input.
            calcState.curValue += button.id;
            break;
        case 'operButton':
            //If we don't have a current value and we hit operator, we try to use the previous answer
            if(calcState.curValue == ""){
                if(calcState.prevAns != ""){
                    calcState.curWindow += "Ans"
                    calcState.prevValue = calcState.prevAns;
                    calcState.curOper = button.id;
                    break;
                }
                else{
                    //If an operator button is hit, there is no previous answer or current value available, that means we are operating on nothing, i.e. "  + 4", which is an error.
                    calcState.isError = "Nothing to operate on!";
                    break;
                }
            }
            else{
                //If we already have two values and an operator, computes them. This minimizes number of variables needed for storage, but causes errors with PEMDAS. Kept in current version of the code to focus on other issues before hitting on this.
                calcState.prevValue = calcState.prevValue == ""? calcState.curValue : 
                                                                operate(parseFloat(calcState.prevValue), calcState.curOper, parseFloat(calcState.curValue), calcState);
                calcState.curValue = "";
                calcState.curOper = button.id;
                break;
            }
        case 'eqButton':
            //If we hit equals with no operator (i.e., 5 =), then our answer would be our current value (5, in the example). We check for this case, if there is an operator the answer is the previous value operated with the current value.
            calcState.curOper != ""?
                calcState.prevAns = operate(parseFloat(calcState.prevValue), calcState.curOper, parseFloat(calcState.curValue), calcState):
                calcState.prevAns = calcState.curValue;
                calcState.curValue = "";
                calcState.prevValue = "";
                calcState.curOper = "";
                break;
        case 'clearButton':
            //If we hit the clear button, flush the memory of the program. Just sets every value (Other than isError, as isError is only handled by our error handling) to be empty strings.
            calcState.curValue = "";
            calcState.prevValue = "";
            calcState.curOper = "";
            calcState.prevAns = "";
            calcState.curWindow = "";
            break;
        case 'ansButton':
            //Hitting the answer button sets the current value to the previous answer recieved by the calculator. If the current value already has something, we need to offload it to our previous value. If previous value aready exists, combines previous value and current value into previous value by operating.
            if(calcState.curValue != ""){
                calcState.prevValue = calcState.prevValue != "" ?
                    operate(parseFloat(calcState.prevValue), calcState.curOper, parseFloat(calcState.curValue), calcState) :
                    calcState.curValue;
            }
            //Inputing 'Ans' with no previous answer is an error.
            if(calcState.prevAns == ""){
                calcState.isError = "No ans";
                calcState.curValue == "";
            }
            else{
                calcState.curValue = calcState.prevAns;
            }
            break;
        case 'dotButton':
            //If we don't already have a period in our current value, we add it. Else, we error (5.5.1 is not a real number).
            calcState.curValue.includes(".") ?
                calcState.isError = "Multiple periods detected" :
                calcState.curValue += button.id;
            break;
        default: break;
    }

    //This if-else handles output to html. If there's an error, we output the error and flush the calculator's memory. If not, we want to output either curValue or prevAns, depending on if the user input '=' sign.
    if(calcState.isError != "false"){
        console.log("Got Here!");
        varNumWindow.innerHTML = calcState.isError;
        calcState.isError = "false";
        calcState.curValue = "";
        calcState.prevValue = "";
        calcState.curOper = "";
        calcState.prevAns = "";
        calcState.curWindow = "";
    }
    else{
        //If there is no currentValue or currentOperator, and we have a previousAnswer, then we know the user has just input the '=' sign. Therefore, we output the previous answer.
        if(calcState.curValue == "" && calcState.curOper == "" && calcState.prevAns != ""){
            varNumWindow.innerHTML = calcState.prevAns;
            calcState.curWindow = ""
        }
        else{
            calcState.curWindow += button.id;
            varNumWindow.innerHTML = calcState.curWindow;    
        }
    }
}

//Gives event listeners to all our buttons, telling them to alter the window somehow when they are pressed.
var buttons = document.getElementsByTagName("button");
for(button of buttons){
    button.addEventListener("click", function(thisButton){
        windowOutput(thisButton.target, calcSt);
      });
}