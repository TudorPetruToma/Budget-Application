// BUDGET CONTROLLER
let budgetController = (function(){

        //some code
})();


//UI Controller
let UIController = (function(){

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn' 
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, //Will be always inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings : function(){
            return DOMStrings;
        }
    }
})()


// Global App Controller
let controller = (function(budgetCtrl, UICtrl){

    let DOM = UICtrl.getDOMStrings();

    let ctrlAddItem = function(){

        
        // 1. get the field input data
        let input = UICtrl.getInput();
        console.log(input)
        // 2. add the item to the budget controller
        // 3. add the item to the UI
        // 4. Calculta the budget
        // 5. Display the budget
        
    }

    document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
       if(event.code === 'Enter' || event.which === 13){
        ctrlAddItem();
       }


    })

})(budgetController, UIController)
