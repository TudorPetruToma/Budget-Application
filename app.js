// BUDGET CONTROLLER
let budgetController = (function(){

    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            percentage = -1;
        }
    }

    Expense.prototype.getPercentages = function(){
        return this.percentage;
    }
    
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

        deleteItem: function(type, id){
            let ids, index

            ids = data.allItems[type].map(function(current){
                return current.id
            })

            index = ids.indexOf(id)

            if(index !== -1){
                data.allItems[type].splice(index, 1)
            }
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

        calculatePercentages: function(){
            
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc)
            })
        },

        getPercentages: function(){
            let allPerc = data.allItems.exp.map(function(current){
                return current.getPercentages()
            })
            return allPerc;
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
        container: '.container',
        expensesPercLabel:  '.item__percentage', 
        dateLabel: '.budget__title--month'
    }

    let nodeListForEach = function(list, callback){
        for(let i = 0; i < list.length; i++){
            callback(list[i], i)
        }
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
            newHtml = newHtml.replace('%value%', this.formatNumber(obj.value, type));
            //Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },

        deleteListItem: function(selectorID){
            let element = document.getElementById(selectorID)

            element.parentNode.removeChild(element)
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
            let type;

            obj.budget > 0 ? type = 'inc' : type = 'exp'

            document.querySelector(DOMStrings.budgetLabel).textContent = this.formatNumber(obj.budget, type)
            document.querySelector(DOMStrings.incomeLabel).textContent = this.formatNumber(obj.totalIncome, 'inc')
            document.querySelector(DOMStrings.expensesLabel).textContent = this.formatNumber(obj.totalExpenses, 'exp')

            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '--'
            }
           
        },

        displayPercentages: function(percentages){
            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            })

        },

        formatNumber: function(num, type){
            var numSplit, int, dec;
            /*
            + or - before the number
            exactly 2 decimal points
            comma separating the thousands
            */ 

            num = Math.abs(num);
            num = num.toFixed(2);

            numSplit = num.split('.')

            int = numSplit[0]

            if(int.length > 3){
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3 , 3); //input 2310, output 2,310
            }

            dec = numSplit[1]

            

            return `${type === 'exp' ? '-' : '+'} ${int}.${dec}`;
        },

        displayDate: function() {
            let now, year, month, months

            now = new Date()

            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

            month = now.getMonth()

            year = now.getFullYear()

            document.querySelector(DOMStrings.dateLabel).textContent = `${months[month]}. ${year}`
        },

        changedType: function(){
            let fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' + 
                DOMStrings.inputValue
            );
                nodeListForEach(fields, function(current){
                    current.classList.toggle('red-focus')
                })
                document.querySelector(DOMStrings.addButton).classList.toggle('red')
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

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)

    }

    let updateBudget = function(){
        let budget;

        // 1. Calculate the budget
            budgetCtrl.calculateBudget()
        // 2. Return the budget
            budget = budgetCtrl.getBudget();
        // 3. Display the budget
            UICtrl.displayBudget(budget)
    }

    let updatePercentages = function(){
        let percentages;
            //1. Calculate percentages
            budgetCtrl.calculatePercentages();
            //2. Read percentages from the budget controller
            percentages = budgetCtrl.getPercentages();
            //3. Update the UI with the next percentages
           UICtrl.displayPercentages(percentages)
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
            //6. Calculate and update the percentages
                updatePercentages();
        }
            }
        
        let ctrlDeleteItem = function(event){
            let itemId, splitId, type, ID

            itemId = event.target.parentNode.parentNode.parentNode.parentNode.id

            if(itemId){
                //inc-1
                splitId = itemId.split('-');
                type = splitId[0]
                ID = parseInt(splitId[1])

                //1. Delete item from data structure
                budgetCtrl.deleteItem(type, ID)
                //2. Delete item from the UI
                UICtrl.deleteListItem(itemId)
                //3. Update and show the new budget
                updateBudget();
                //4. Calculate and update the percentages
                updatePercentages();

            }
        }

return{
    init: function(){
      console.log('The app has started')
      UICtrl.displayDate()
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