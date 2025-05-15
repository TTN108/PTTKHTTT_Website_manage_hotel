function logout()
{
    fetch("includes/handles/logout.php")
    .then(response => response.text())
    .then(responseData => {
        try
        {
            data=JSON.parse(responseData);
            showMessageDialog(data.message);
            document.querySelector('#account').innerHTML=data.html;
            document.querySelector('#account-ctn').classList.add('hidden');
            document.querySelector('#login-button').classList.remove('hidden');
            document.querySelector('#signin-button').classList.remove('hidden');
        }
        catch(error)
        {
            console.error('Có lỗi xảy ra: ',error);
            console.error(responseData);
        }
    });
}
document.getElementById("logout-button").addEventListener("click", logout)