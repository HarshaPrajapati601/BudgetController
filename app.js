//BUDGET controller
var budgetController= (function(){
    //create function constructor
    var Expenseconstr= function(id,description,value){
        this.id=id;
        this.description= description;
        this.value= value;
        this.percentage = -1
    };
    Expenseconstr.prototype.calPercentage = function (totalIncome){
      if(totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100);
        console.log("this.p",this.percentage)
      }else{
          this.percentage = -1 ;
      }
    };
    Expenseconstr.prototype.getPercentage = function(){
        return this.percentage;
    };
    var Incomeconstr = function(id,description,value){
        this.id =id;
        this.description = description;
        this.value = value;
    };
  //data structure to store the expenses/incomes
    var Data={
        allItems:{
            exp:[],
            inc:[]
        },
        totalExpenses:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };
    var calculateTotal = function(type){
        let sum = 0;
        Data.allItems[type].forEach(function(e){
            sum = sum + e.value;
        });
        Data.totalExpenses[type] = sum;

    };
  return {
      addItem :function(type,des,val){
            var newItem,ID;
            console.log(Data.allItems[type])
            if(Data.allItems[type].length >0){
                ID = Data.allItems[type][Data.allItems[type].length - 1].id +1;
            }
            else{
                ID=0;
            }
            //create a new id [1,2,3,4]
            //create new item based on the income type
            if(type == 'inc'){
                newItem = new Incomeconstr(ID,des,val);
                console.log("new",newItem)
            }
            else if(type == 'exp'){
                newItem = new Expenseconstr(ID,des,val);
            }
            //push the new item into the data structure
            Data.allItems[type].push(newItem);
            //return the new item
            console.log(newItem);
            return newItem;
      },
      calculateBudget : function(){
            //1. calcualte total sum of exp n inc
            calculateTotal('inc');
            calculateTotal('exp');
            //2.Calculate the budget => Income - Expense
            Data.budget = Data.totalExpenses.inc - Data.totalExpenses.exp;
            //3. %expenses
            if(Data.totalExpenses.inc > 0){
                Data.percentage = Math.round((Data.totalExpenses.exp / Data.totalExpenses.inc)* 100);
            }else{
                Data.percentage = -1 ;
            }
           
        },
        getBudget : function(){
            return {
                totalInc : Data.totalExpenses.inc ,
                totalExp : Data.totalExpenses.exp,
                budget : Data.budget ,
                percentage :Data.percentage
            }
        },
        testing : function(){
                console.log("items",Data)
       },
       deleteItem : function(type ,id){
           //id= [2,4,6,8,12];
           let totalIds , index;
           totalIds = Data.allItems[type].map((current)=>{
               return current.id;
           })
           index = totalIds.indexOf(id);
           //incase the id is not matched
           if(index !== -1){
               //remove the item from the data structure
               Data.allItems[type].splice(index,1);
           }
        
       },
       calculatePercentages : function(){
           Data.allItems.exp.forEach((item)=>{
               item.calPercentage(Data.totalExpenses.inc);
           })
       },
       getFinalPercenatges : function(){
            let perct = Data.allItems.exp.map((current)=>{
                return current.getPercentage();
            });
           return perct;
       }
  };
//some code
})(); 

//UI controller
var UiController = (function(){
    var domStrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLable : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container:'.container',
        expensePrcntLabel : '.item__percentage'
    };
    return {
        getInput:function(){
            return{
                 type : document.querySelector(domStrings.inputType).value, //exp or income
                 description : document.querySelector(domStrings.inputDescription).value,
                 value :parseFloat(document.querySelector(domStrings.inputValue).value)          
            }
        },
        getDomStrings:function(){
            return domStrings;
        },
        addListItem: function(obj,type){
            let html , newHtml , element;
            //create a Html string with placeholder list
            console.log("obj and type",obj,type)
            if (type == 'inc'){
                element = domStrings.incomeContainer ; 
                html=`<div class="item clearfix" id="inc-%id%"> <div class="item__description">
                %description%</div><div class="right clearfix">
                <div class="item__value">%value%</div>
                <div class="item__delete"><button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i></button></div></div></div>`;
            }else if(type == 'exp'){
                element = domStrings.expenseContainer ;
                html= `<div class="item clearfix" id="exp-%id%">
                <div class="item__description">%description%</div><div class="right clearfix">
                <div class="item__value">%value%</div><div class="item__percentage">21%</div>
                <div class="item__delete"><button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i></button> </div></div></div>`;
            }
            //Replace the placeholder text with actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);
            //Insert the Html into DOM.
                document.querySelector(element).insertAdjacentHTML("beforeend",newHtml)
        },
        clearFields: function(){
            let fields ,fieldArray;
            fields = document.querySelectorAll(domStrings.inputDescription +', ' + domStrings.inputValue);
            fieldArray= Array.prototype.slice.call(fields);
            fieldArray.forEach((current,index, array) => {
                current.value = "";
            });
            fieldArray[0].focus();
        },
        displayBudget: function(obj){
            document.querySelector(domStrings.budgetLabel).textContent = obj.budget ;
            document.querySelector(domStrings.expenseLable).textContent = obj.totalExp ;
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc ;
            if(obj.percentage > 0){
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%' ;
            }else{
                document.querySelector(domStrings.percentageLabel).textContent = '---';
            }
           
        },
        deleteListUiItem : function(selectorId){
            let domId = document.getElementById(selectorId);
            //in js we cant directly remove the elements from ui so we first select the parent Node n then remove child
            domId.parentNode.removeChild(domId);      
        },
        displayPercentagesInner : function(percents){
            console.log("p",percents)
            let feilds = document.querySelectorAll(domStrings.expensePrcntLabel);
            console.log(feilds ,"vfg")
            let nodeListforEach = function(list , callback){
                for(i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            }
            nodeListforEach(feilds ,function(current , index){
                console.log("feilds", current ,index);
                if(percents[index] > 0){
                    current.textContent = percents[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
        }
    };
})();

//APP controller = passing the BUGGET n UI controller as parameters so it connects both of them.
var appController= (function(budgetCtrl,uiCtrl){
    var setEventListeners = function(){
        var DOM = uiCtrl.getDomStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', addItemCtrl);
        document.addEventListener('keypress',(event)=>{
            if(event.keyCode === 13 || event.which === 13){
               addItemCtrl();
            }
        });
        //event to delete an item
        document.querySelector(DOM.container).addEventListener('click',deleteItemCtrl);
    };
    var updateBudget = function(){
        let bugdetDetails;
        //1.calculate the budget
        budgetCtrl.calculateBudget();
        //2. Return the budget
       bugdetDetails = budgetCtrl.getBudget();
        //3. Display the budget on UI
        uiCtrl.displayBudget(bugdetDetails);
    };
    var addItemCtrl= function(){
        //1.take input from input fields
        var inputFields ,newItem;
        inputFields= uiCtrl.getInput();
        if(inputFields.description !== '' && !isNaN(inputFields.value) && inputFields.value > 0){
            //2.  add the item to the budget controller
            newItem= budgetCtrl.addItem(inputFields.type,inputFields.description,inputFields.value);
            //3. Add the item to ui
            uiCtrl.addListItem(newItem , inputFields.type);
            //4. clear the input fields
            uiCtrl.clearFields();
            //4. update and calcualte the budget
            updateBudget();
            //5. update percentages
            updatePercentages();
        }
    };
    var deleteItemCtrl = function(event){
        let itemId , ID ,type ,sliceId;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
            sliceId = itemId.split('-');
            type = sliceId[0];
            ID = parseInt(sliceId[1]);
        }
        console.log("item.id",itemId)
         //1.Delete the item from Data structure of budgt Ctrl
        budgetCtrl.deleteItem(type ,ID); 
        //2.Delete the item from UI
        uiCtrl.deleteListUiItem(itemId);
        //3. Reset the budget labels in UI
        updateBudget();
        //4. update percenatges
        updatePercentages();
    };
    var updatePercentages=  function(){
        //1.calculate the percentages
        budgetCtrl.calculatePercentages();
        //2. Return the percwntagrs from bdget ctrl
        let pcents = budgetCtrl.getFinalPercenatges();
        //3.display the % in Ui 
       uiCtrl.displayPercentagesInner(pcents);
    }
    return {
        init:function(){
            setEventListeners();
            uiCtrl.displayBudget({
                totalInc : 0 ,
              totalExp : 0,
              budget : 0,
              percentage :-1
            })
        }
    }
})(budgetController,UiController);

appController.init();
