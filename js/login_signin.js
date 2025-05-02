// ------------------------------------ Login/Signin -----------------------------------------------
let loginButton = document.getElementById("login-button");
let signinButton = document.getElementById("signin-button");
let accountCtn = document.getElementById("account-ctn");
let account = document.getElementById("account");
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
        switch(backArrow.dataset.value)
        {
            case 'login-form':
                loginForm.classList.remove("active");
                loginFormContainer.classList.remove("active");
                break;
            case 'signin-form':
                loginForm.classList.add("active");
                signinForm.classList.remove("active");
                break;
            case 'forgot-password-form':
                loginForm.classList.add("active");
                forgotPasswordForm.classList.remove("active");
                break;
        }
    });
});

let passwordSubmitButton = document.getElementById("form-password-button");
passwordSubmitButton.addEventListener("click",(ev)=>{
    ev.preventDefault();

    let formData=new FormData(document.getElementById("forgot-password-form"));
    fetch("includes/handles/forgotPassword.php",{
        method:'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(responseData => {
        try
        {
            let data=JSON.parse(responseData);
            showMessageDialog(data.message);
            if(data.status==="success")
            {
                alert("Mật khẩu là: "+data.password);
            }
        }
        catch(error)
        {
            console.error(error);
            console.error(responseData);
        }
    })
    .catch(error => {
        console.error(error);
    });
})
// ----------------------------------------Xu Li Submit---------------------------------------------
loginForm.addEventListener("submit",(ev)=>{
    ev.preventDefault();

    let password=document.getElementById('login-form-login-password');

    const formData = new FormData(loginForm);

    fetch("includes/handles/login.php",{
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(responseData => {
        try
        {
            let data=JSON.parse(responseData);
            showMessageDialog(data.message);
            if (data.status==="success")
            {
                loginButton.classList.add('hidden');
                signinButton.classList.add('hidden');
                accountCtn.classList.remove('hidden');
                account.innerHTML=data.html;
                loginFormContainer.classList.remove('active');
            }
            else
            {
                password.focus();
                password.select();
            }
        }
        catch(error)
        {
            console.error("Có lỗi xảy ra:",error);
            console.error(responseData);
            alert("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.")
        }
    });
});

signinForm.addEventListener("submit",(ev)=>{
    ev.preventDefault();

    const formData = new FormData(signinForm);

    if(formData.get('signin-password')!=formData.get('signin-confirm-password'))
    {
        showMessageDialog('<p><i class="fa-regular fa-circle-xmark red icon"></i>Xác nhận mật khẩu không khớp</p>');
        return;
    }
    else
    {
        const phoneRegex = /^[0-9]{8,15}$/;
        if(!phoneRegex.test(formData.get('signin-phone')))
        {
            showMessageDialog('<p><i class="fa-regular fa-circle-xmark red icon"></i>Số điện thoại phải từ 8-15 số</p>');
            return;
        }
    }

    fetch('includes/handles/signin.php',{
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(responseData => {
        try
        {
            let data=JSON.parse(responseData);
            showMessageDialog(data.message);
            
            if(data.status==="success")
            {
                loginForm.classList.add("active");
                signinForm.classList.remove("active");
            }
            else
            {
                if(data.status==="passwordError")
                {
                    document.getElementById("login-form-signin-confirm-password").select();
                }
            }
        }
        catch(error)
        {
            console.error('Có lỗi xảy ra: ',error);
            console.error(responseData);
        }
    });

});

async function getUserInfo() {
    let response = await fetch('includes/handles/getUserInfo.php');
    let responseData = await response.text();
    try {
        let data = JSON.parse(responseData);

        if (data.status === "success") {
            return data.userInfo;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Có lỗi xảy ra: ", error);
        console.error(responseData);
        return null;
    }
}

let accountInfoCtn=document.getElementById("account-info-ctn");
let username = document.getElementById('account-info-username');
let password = document.getElementById('account-info-password');
let fullname = document.getElementById('account-info-fullname');
let idCard = document.getElementById('account-info-id-card');
let email = document.getElementById('account-info-email');
let phone = document.getElementById('account-info-phone');
let address = document.getElementById('account-info-address');

document.getElementById("account-info-btn").addEventListener("click",async ()=>{
    accountInfoCtn.classList.add("active");
    let userInfo = await getUserInfo();

    if(userInfo!=null)
    {
        username.value = userInfo.Username;
        password.value = userInfo.Password;
        fullname.value = userInfo.Ten;
        idCard.value = userInfo.CCCD;
        email.value = userInfo.Email;
        phone.value = userInfo.SDT;
        address.value = userInfo.Dia_chi;
        username.disabled = true;
        password.disabled = true;
        fullname.disabled = true;
        idCard.disabled = true;
        email.disabled = true;
        phone.disabled = true;
        address.disabled = true;
        accountInfoEditBtn.value="Change";
    }
    else
    {
        showMessageDialog('<p><i class="fa-regular fa-circle-xmark red icon"></i>Có lỗi xảy ra vui lòng thử lại!</p>');
    }
});

document.getElementById("account-info-x").addEventListener("click",()=>{
    accountInfoCtn.classList.remove("active");
});

let accountInfoEditBtn=document.getElementById('account-info-edit-button');
accountInfoEditBtn.addEventListener("click",()=>{
    if(accountInfoEditBtn.value=="Change")
    {
        password.disabled = false;
        fullname.disabled = false;
        email.disabled = false;
        phone.disabled = false;
        address.disabled = false;
        accountInfoEditBtn.value="Save";
    }
    else
    {
        username.disabled = false;
        idCard.disabled = false;
        fetch('includes/handles/updateUserInfo.php',{
            method: 'POST',
            body: new FormData(document.getElementById('account-info-ctn')),
        })
        .then(response => response.text())
        .then(responseData => {
            try
            {
                username.disabled = true;
                idCard.disabled = true;
                let data = JSON.parse(responseData);
                showMessageDialog(data.message);
                if(data.status==="success")
                {
                    password.disabled = true;
                    fullname.disabled = true;
                    email.disabled = true;
                    phone.disabled = true;
                    address.disabled = true;
                    accountInfoEditBtn.value="Change";
                }
            }
            catch(error)
            {
                console.error("Có lỗi xảy ra: ", error);
                console.error(responseData);
            }
        })
        .catch(error => {
            console.error("Có lỗi xảy ra (fecth error): ", error);
        });
    }
});