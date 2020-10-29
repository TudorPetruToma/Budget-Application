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

    let data= {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        expensesContainer: '.expenses__list'
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, //Will be always inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },

        addListItem: function(obj, type){
            let html, newHtml, element;
            // Create HTML string with placeholder text
           if(type === 'inc'){
            element = DOMStrings.incomeContainer;
            html = ` <div class="item clearfix" id="income-%id%">
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
            html =   `<div class="item clearfix" id="expense-%id%">
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

    }

    

    let ctrlAddItem = function(){
        let input, newItem;
        
        // 1. get the field input data
            input = UICtrl.getInput();
        // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        // 3. add the item to the UI
            UICtrl.addListItem(newItem, input.type)
        // 4. Clear the fields
            UICtrl.clearFields()
        // 5. Calculta the budget
        // 6. Display the budget
        
    }

return{
    init: function(){
      console.log('The app has started')
      setupEventListeners();   
    }
}

})(budgetController, UIController)

controller.init();

//function where all our event listeners will be placed