//BUDGET controller
var budgetController= (function(){
    let x = 23;
    let add= function(a){
        return x+a;
    }
    return { 
        publicTest:function(b){
            console.log("myadd"+add(b));
            return add(b);
        }
    }

})(); //IIFY 
//line 8 -closure:-the inner function has acess to the outerfunctions mehtods even when the outer function has returned

//UI controller
var UiController = (function(){

    //some code
})();

//APP controller =passing the BUGGET n UI controller as parameters so it connects both of them.
var appController= (function(budgetCtrl,uiCtrl){
    let z =budgetCtrl.publicTest(30);
    return{
        anotherPublic:function(){
            console.log("my antotjer "+z)
        }
    }
})(budgetController,UiController);