let messageDialog=document.querySelector('#messageDialog');
function showMessageDialog(message)
{
    if(message!=='')
    {
        messageDialog.innerHTML=message;
        messageDialog.style.animation='none';
        messageDialog.offsetHeight;
        messageDialog.style.animation='showMessageDialog 5s ease forwards';
    }
}

messageDialog.addEventListener("click", ()=>{
    messageDialog.style.animation='none';
    messageDialog.style.transform="translateX(100%)";
    messageDialog.style.opacity="0";
});
