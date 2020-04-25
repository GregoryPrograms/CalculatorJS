//calcSt acts as the calculator's memory - it tracks all information necessary for the program.
//  prevAns (String): The most recent answer the calculator has recieved. Only exists after the user selects '='.
//  isError (String): An error tracker. Watches for calculations that would crash the calculator or lead to NaN answers, and provides output.
//  currentWindow (String): Tracks what should be displayed on the screen.
//  curWindowIsAns (Bool): Tracks whether the screen is currenty displaying an answer to a previous problem.
var calcSt = {
    prevAns: "",
    isError: "false",
    curWindow: "",
    curWindowisAns: false
};




//O(N), with a real complexity of O(4N)  where N is the number of elements input into the calculator. As the number of elements that can be input into the calculator is minimal (will have a cap, based on the size of the calculator window), complexity and runtime should not be a problem with this program.
pemdas = function(calcState){
    pemdasArray = calcState.curWindow.split(" ");
    pemdasArray = pemdasReduce(pemdasArray, calcState, "*", "/");
    pemdasArray = pemdasReduce(pemdasArray, calcState, "+", "-");
    return pemdasArray.length == 1?
        pemdasArray[0]:
        calcState.isError = "Problem with inputs"
}

pemdasReduce = function(pemdasArray, calcState, oper1, oper2){
    var pemIndex = 0;
        while(pemIndex < pemdasArray.length){
            if(pemdasArray[pemIndex] == oper1 || pemdasArray[pemIndex] == oper2){
                var num1 = pemdasArray[pemIndex - 1];
                var num2 = pemdasArray[pemIndex + 1];
                if(num1 =="" || num2 == ""){
                    return calcState.isError="Invalid input received";
                }
                num1 = num1 == "Ans"? calcState.prevAns : num1;
                num2 = num2 == "Ans"? calcState.prevAns : num2;
                var operVal = operate(parseFloat(num1), pemdasArray[pemIndex], parseFloat(num2), calcState);
                pemdasArray.splice(pemIndex - 1, 3, operVal);
            }
            else pemIndex++;
        }
    return pemdasArray;
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
            return(num1 + num2);
            break;
        case '-':
            return(num1 - num2);
            break;
        case '*':
            return(num1 * num2);
            break;
        case '/':
            if(num2 == 0){
                return calcState.isError = "No div by 0";
            }else return(num1 / num2);
            break;
        default:
            break;
    }
}




clear = function(calcState){
    calcState.prevAns= "";
    calcState.isError= "false";
    calcState.curWindow= "";
    calcState.curWindowisAns= false;
}

//windowOutput: called when a button is pressed. Finds out what button was pressed, and takes action or calls a function based on the button and the current state of the calculator (calcState / calcSt).
//Parameters:
//  button (html element): The button that was pressed. Carries information like the class of the button (what kind of button was pressed - i.e., number button, operator button, etc.), and the button id (which button exactly was pressed)
//  calcState (object): The current state of the calculator, carrying information needed for calculation and error handling.
windowOutput = function(button, calcState){
    if(calcState.isError != "false"){
        clear(calcState);
    }
    varNumWindow = document.getElementById("numWindow");
    switch(button.className){
        case "eqButton":
            varNumWindow.innerHTML = pemdas(calcState);
            calcState.curWindow = varNumWindow.innerHTML;
            calcState.prevAns = calcState.curWindow;
            calcState.curWindowisAns = true;
            break;
        case "clearButton":
            clear(calcState);
            varNumWindow.innerHTML = "";
            break;
        case "ansButton":
            if(calcState.prevAns==""){
                calcState.isError = "No previous Answer available";
                varNumWindow.innerHTML = calcState.isError;
            }
            else{
                calcState.curWindow += "Ans";
                varNumWindow.innerHTML = calcState.curWindow;
            }
            break;
        default:
            if(calcState.curWindowisAns == false){
                calcState.curWindow += button.className == "operButton" ?
                " " + button.id + " " :
                button.id;
                varNumWindow.innerHTML = calcState.curWindow;
                break;
            }
            else{
                calcState.curWindowisAns = false;
                calcState.curWindow = button.className == "operButton" ?
                calcState.curWindow += " " + button.id + " " :
                button.id;
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
