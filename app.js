// BUDGET CONTROLLER
let budgetController = (function(){

    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function(type){
         let sum = 0;
         data.allItems[type].forEach(function(current){
             sum += current.value;
         })
         data.totals[type] = sum;
    }

    let data= {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, desc, val){
            let newItem, ID;
            //ID = last ID + 1

            //Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            

            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, desc, val)
            } else if(type === 'inc'){
                newItem = new Income(ID, desc, val)
            }

            //Push it into our data structure and return thre new Item
            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget: function(){

            // calculate total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')
            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp

            //calculate percentage of expenses of total budget
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100)
            }else{
                data.percentage = -1
            }
            
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data)
        }
    }

})();


//UI Controller
let UIController = (function(){

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, //Will be always inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value) 
            }
        },

        addListItem: function(obj, type){
            let html, newHtml, element;
            // Create HTML string with placeholder text
           if(type === 'inc'){
            element = DOMStrings.incomeContainer;
            html = ` <div class="item clearfix" id="inc-%id%">
                        <div class="item__description">%description%</div>
                            <div class="right clearfix">
                                <div class="item__value">%value%</div>
                                    <div class="item__delete">
                                        <button class="item__delete--btn">
                                        <i class="ion-ios-close-outline"></i>
                                        </button>
                                    </div>
                            </div>
                    </div> `;
           }else{
            element = DOMStrings.expensesContainer;
            html =   `<div class="item clearfix" id="exp-%id%">
                            <div class="item__description">%description%</div>
                                <div class="right clearfix">
                                    <div class="item__value">%value%</div>
                                    <div class="item__percentage">21%</div>
                                    <div class="item__delete">
                                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                    </div>
                                </div>
                      </div>`
           }     
           
            //Replace placeholder with data received from the object(new Item)
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)
            //Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },

        clearFields : function(){
            let fields, fieldsArr

            fields =  document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue)

            fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach(function(current, index, array){
                current.value = '';
            })

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){

            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExpenses;

            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '--'
            }
           
        },

        getDOMStrings : function(){
            return DOMStrings;
        }
    }
})()


// Global App Controller
let controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = function(){
        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.code === 'Enter' || event.which === 13){
            ctrlAddItem();
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

    }

    let updateBudget = function(){
        let budget;

        // 1. Calculta the budget
            budgetCtrl.calculateBudget()
        // 2. Return the budget
            budget = budgetCtrl.getBudget();
        // 3. Display the budget
        UICtrl.displayBudget(budget)
    }

    let ctrlAddItem = function(){
        let input, newItem;
        
        // 1. get the field input data
            input = UICtrl.getInput();

            if(input.description !== '' && !isNaN(input.value) && input.value > 0){
                // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            // 3. add the item to the UI
                UICtrl.addListItem(newItem, input.type)
            // 4. Clear the fields
                UICtrl.clearFields()
            //5. Calculate and update budget
                updateBudget();
        }
            }
        
        let ctrlDeleteItem = function(event){
            let itemId, splitId, type, ID

            itemId = event.target.parentNode.parentNode.parentNode.parentNode.id

            if(itemId){
                //inc-1
                splitId = itemId.split('-');
                type = splitId[0]
                ID = splitId[1]

                //1. Delete item from data structure
                //2. Delete item from the UI
                //3. Update and show the new budget


            }
        }

return{
    init: function(){
      console.log('The app has started')
      UICtrl.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpenses:0,
        percentage: -1
    })
      setupEventListeners();   
    }
}

})(budgetController, UIController)

controller.init();

//function where all our event listeners will be placed