// ------------------------------------ Checkin/Checkout -----------------------------------------------
let checkinInput = document.getElementById("checkin");
let checkoutInput = document.getElementById("checkout");

let tmp = document.getElementById("mini-booking-form-container");
checkinInput.addEventListener("focus", ()=>{
    tmp.focus();
    checkinInput.showPicker();
});

checkoutInput.addEventListener("focus", ()=>{
    tmp.focus();
    checkoutInput.showPicker();
});

checkinInput.addEventListener("change", function (){
    let date=new Date(checkinInput.value);
    date.setDate(date.getDate()+1);
    let checkoutMinValue = date.toISOString().split('T')[0];
    checkoutInput.min = checkoutMinValue;
    let d1 = new Date(checkoutMinValue);
    let d2 = new Date(checkoutInput.value);
    if(d1>=d2)
    {
        checkoutInput.value = checkoutMinValue;
    }
    checkoutInput.focus();
});