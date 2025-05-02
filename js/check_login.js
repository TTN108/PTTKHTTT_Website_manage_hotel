fetch('includes/handles/check_login.php')
.then(response => response.text())
.then(responseData => {
    try
    {
        data=JSON.parse(responseData);
        showMessageDialog(data.message);
        if(data.status==="success")
        {
            document.getElementById('login-button').classList.add('hidden');
            document.getElementById('signin-button').classList.add('hidden');
            document.getElementById('account').innerHTML=data.html;
            document.getElementById('account-ctn').classList.remove('hidden');
        }
    }
    catch(error)
    {
        console.error(error);
        console.error(responseData);
    }
})
.catch(error => {
    console.error('Có lỗi xảy ra:', error);
    alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
});

