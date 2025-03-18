// ------------------------------------ Head Menu -----------------------------------------------
let headMenuItems=document.querySelectorAll(".head-menu-item");
headMenuItems.forEach(item => 
{
    item.addEventListener("click", ()=> showContent(item));
});

function showContent(item)
{
    if (!item.classList.contains("active"))
    {
        headMenuItems.forEach(i => 
        {
            i.classList.remove("active");
        });
        item.classList.add("active");

        let blocks=document.querySelectorAll(".block");
        blocks.forEach(block =>{
            block.classList.remove("active");
        });

        document.querySelector("#"+item.id+"-block").classList.add("active");

        document.querySelector(".block.active").scrollIntoView({behavior:"smooth"});
    }
}
// ------------------------------------ Checkin/Checkout -----------------------------------------------
let checkinInput = document.getElementById("checkin");
checkinInput.addEventListener("change", function (){
    let checkoutInput = document.getElementById("checkout");
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
});
// ------------------------------------ Login/Signin -----------------------------------------------
let loginButton = document.getElementById("login-button");
let signinButtons = document.querySelectorAll(".signin-button");
let forgotPasswordButton = document.getElementById("login-form-forgot-password");
let loginFormContainer = document.getElementById("login-form-container");
let loginForm = document.getElementById("login-form");
let signinForm = document.getElementById("signin-form");
let forgotPasswordForm = document.getElementById("forgot-password-form");

loginButton.addEventListener("click",()=>{
    loginFormContainer.classList.add("active");
    signinForm.classList.remove("active");
    forgotPasswordForm.classList.remove("active");
    loginForm.classList.add("active");
});

signinButtons.forEach(signinButton => {
    signinButton.addEventListener("click",()=>{
    loginFormContainer.classList.add("active");
    loginForm.classList.remove("active");
    forgotPasswordForm.classList.remove("active");
    signinForm.classList.add("active");
    });
})

forgotPasswordButton.addEventListener("click",()=>{
    loginForm.classList.remove("active");
    signinForm.classList.remove("active");
    forgotPasswordForm.classList.add("active");
})

let backArrows = document.querySelectorAll(".back-arrow");
backArrows.forEach(backArrow =>{
    backArrow.addEventListener("click", ()=>{
        loginFormContainer.classList.remove("active");
        loginForm.classList.remove("active");
        signinForm.classList.remove("active");
        forgotPasswordForm.classList.remove("active");
    });
});

let passwordSubmitButton = document.getElementById("form-password-button");
passwordSubmitButton.addEventListener("click",()=>{
    alert("Bạn quên password hả :D?");
})