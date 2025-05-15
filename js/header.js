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