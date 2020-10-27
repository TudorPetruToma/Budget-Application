let budgetController = (function(){

        let x = 10;

        let add = function(a){
            return x + a;
        }

        return{
            publicTest: function(b){
                return add(b)
            }
        }
})();

let UIController = (function(){
    // Some code
})()

let controller = (function(budgetCtrl, UICtrl){

    let z = budgetCtrl.publicTest(50)

    return{
        anotherPublic: function(){
            console.log(z)
        }
    }

})(budgetController, UIController)
