// BUDGET CONTROLLER
let budgetController = (function(){

        //some code
})();


//UI Controller
let UIController = (function(){
    // Some code
})()


// Global App Controller
let controller = (function(budgetCtrl, UICtrl){

    let ctrlAddItem = function(){
        // 1. get the field input data
        // 2. add the item to the budget controller
        // 3. add the item to the UI
        // 4. Calculta the budget
        // 5. Display the budget
        
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
       if(event.code === 'Enter' || event.which === 13){
        ctrlAddItem();
       }
    })

})(budgetController, UIController)
