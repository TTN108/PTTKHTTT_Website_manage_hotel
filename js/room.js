let dataLoaiPhong;
fetch('includes/handles/getRoomType.php')
.then(response => response.text()) 
.then(responseData => {
    try
    {
        dataLoaiPhong=JSON.parse(responseData);
        if (dataLoaiPhong.status === 'success') {
            dataLoaiPhong.data.forEach(loaiPhong => {
                document.getElementById('home-'+loaiPhong['Ten_loai'].toLowerCase()).src=loaiPhong['picture'];
                document.getElementById('room-block-'+loaiPhong['Ten_loai'].toLowerCase()).src=loaiPhong['picture'];
                document.getElementById(loaiPhong['Ten_loai'].toLowerCase()+'-info').innerHTML=`
                <p>Diện tích: ${loaiPhong['Dien_tich']} m²</p>
                <p>Giường: giường đôi hoặc 2 giường đơn</p>
                <p>Tối đa: ${loaiPhong['max_nguoi']} người</p>
                <p>Hướng nhìn: ${loaiPhong['View']}</p>
                <p>Giá: ${loaiPhong['Gia']} vnđ</p>
                `;
            });
        } else {
            console.error(data.message);
        }
    }
    catch(error)
    {
        console.error('Có lỗi khi tải dữ liệu:', error);
        console.log(responseData);
    }
})
.catch(error => {
    console.error('Có lỗi khi tải dữ liệu:', error);
});

function showDetailRoom(type)
{
    let detailCtn=document.querySelector("#detail-room-ctn");
    let loaiPhong;
    for(const loai of dataLoaiPhong.data)
    {
        if(loai.Ten_loai.toLowerCase()==type)
        {
            loaiPhong=loai;
            break;
        }
    };
    if(loaiPhong==null)
    {
        console.error("Loại phòng không tồn tại");
        return;
    }
    document.querySelector("#detail-room-ctn div").innerHTML=`
            <div id="detail-x" class="x-ctn"><i class='fa-regular fa-circle-xmark x'></i></div>
            <div id="detail">
                <img src="${loaiPhong['picture']}" id="detail-room-img">
                <h1>${loaiPhong['Ten_loai']} Room</h1>
                <p>Diện tích: ${loaiPhong['Dien_tich']} m²</p>
                <p>Giường: giường đôi hoặc 2 giường đơn</p>
                <p>Tối đa: ${loaiPhong['max_nguoi']} người</p>
                <p>Hướng nhìn: ${loaiPhong['View']}</p>
                <p>Giá: ${loaiPhong['Gia']} vnđ</p>
                <p>${loaiPhong['Mo_ta']}</p>
                <h2>Các tiện ích</h2>
                <p>Wifi free và kết nối internet</p>
                <p>Có điều hòa</p>
                <p>Tivi kết nối truyền hình cáp</p>
                <p>Có ban công hoặc cửa sổ</p> 
                ${loaiPhong['Ten_loai']=="Deluxe" ? `
                <p>Phục vụ bữa sáng tại phòng miễn phí</p>
                <p>Có bàn làm việc cá nhân</p>
                <p>Có tủ lạnh nhỏ</p>` : ``}
            </div>
            `;
            document.querySelector("#room-book-now").value=loaiPhong['Ten_loai'];
    detailCtn.classList.add("active");

    document.getElementById("detail-x").addEventListener("click",()=>{
        detailCtn.classList.remove("active");
    });
}

let detailBtns=document.querySelectorAll('.room-detail-button');
detailBtns.forEach(btn => {
    btn.addEventListener("click", ()=>{
        showContent(document.getElementById('room'));
        showDetailRoom(btn.dataset.type);
    });
});