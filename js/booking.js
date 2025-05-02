async function showHideBookingForm()
{
    let bookingForm=document.getElementById("booking-form");
    if(bookingForm.classList.contains("hidden"))
    {
        bookingForm.classList.remove("hidden");
        let miniCheckinInput = document.getElementById("checkin");
        let miniCheckoutInput = document.getElementById("checkout");
        let miniRoomInput = document.getElementById("rooms");
        let miniGuestInput = document.getElementById("guests");

        let bookingFormCheckinInput = document.getElementById("booking-form-checkin");
        let bookingFormCheckoutInput = document.getElementById("booking-form-checkout");
        let bookingFormRoomInput = document.getElementById("booking-form-rooms");
        let bookingFormGuestInput = document.getElementById("booking-form-guests");
        
        bookingFormCheckinInput.value=miniCheckinInput.value;
        bookingFormCheckinInput.min=miniCheckinInput.min;
        bookingFormCheckoutInput.value=miniCheckoutInput.value;
        bookingFormCheckoutInput.min=miniCheckoutInput.min;
        bookingFormRoomInput.value=miniRoomInput.value;
        bookingFormGuestInput.value=miniGuestInput.value;

        tmp = document.getElementById("mini-booking-form-container");
        bookingFormCheckinInput.addEventListener("focus", ()=>{
            tmp.focus();
            bookingFormCheckinInput.showPicker();
        });

        bookingFormCheckoutInput.addEventListener("focus", ()=>{
            tmp.focus();
            bookingFormCheckoutInput.showPicker();
        });
        
        bookingFormCheckinInput.addEventListener("change", function (){
            let date=new Date(bookingFormCheckinInput.value);
            date.setDate(date.getDate()+1);
            let bookingFormCheckoutMinValue = date.toISOString().split('T')[0];
            bookingFormCheckoutInput.min = bookingFormCheckoutMinValue;
            let d1 = new Date(bookingFormCheckoutMinValue);
            let d2 = new Date(bookingFormCheckoutInput.value);
            if(d1>=d2)
            {
                bookingFormCheckoutInput.value = bookingFormCheckoutMinValue;
            }
            bookingFormCheckoutInput.focus();
        });

        let bookingFormName = document.getElementById("booking-form-name");
        let bookingFormIdCard = document.getElementById("booking-form-id-card");
        let bookingFormAddress = document.getElementById("booking-form-address");
        let bookingFormEmail = document.getElementById("booking-form-email");
        let bookingFormPhone = document.getElementById("booking-form-phone");

        let userInfo = await getUserInfo();

        if(userInfo!=null)
        {
            bookingFormName.value = userInfo.Ten;
            bookingFormIdCard.value = userInfo.CCCD;
            bookingFormEmail.value = userInfo.Email;
            bookingFormPhone.value = userInfo.SDT;
            bookingFormAddress.value = userInfo.Dia_chi;
        }
        else
        {
            showMessageDialog('<p><i class="fa-regular fa-circle-xmark red icon"></i>Có lỗi xảy ra vui lòng thử lại!</p>');
            bookingForm.classList.add("hidden");
        }
    }
    else
    {
        bookingForm.classList.add("hidden");
    }
}

document.querySelector("#booking-form-x").addEventListener("click",showHideBookingForm);

let authRequire=document.querySelector("#auth-required-message");
document.querySelector("#auth-required-message div").addEventListener("click",()=>{
    authRequire.classList.add("hidden");
});

let authRequireBtn=document.querySelector("#auth-required-message input");
authRequireBtn.addEventListener("click",()=>{
    loginFormContainer.classList.add("active");
    signinForm.classList.remove("active");
    forgotPasswordForm.classList.remove("active");
    loginForm.classList.add("active");
    authRequire.classList.add("hidden");
});

function checkLogin()
{
    return fetch("includes/handles/check_login.php")
    .then(response => response.text())
    .then(responseData => {
        try
        {
            let data=JSON.parse(responseData);
            if(data.status==="success")
            {
                return true;
            }
            else
            {
                if(data.message)
                {
                    showMessageDialog(data.message);
                }
                return false;
            }
        }
        catch(error)
        {
            console.error("Có lỗi xảy ra: ",error);
            console.error(responseData);
            return false;
        }
    })
    .catch(error => {
        console.error("Có lỗi xảy ra: ", error);
    });
}

document.querySelector("#book-button").addEventListener("click",async ()=>{
    if(await checkLogin())
    {
        showHideBookingForm();
    }
    else
    {
        authRequire.classList.remove("hidden");
    }
});

document.querySelector("#room-book-now").addEventListener("click",async ()=>{
    if(await checkLogin())
    {
        showHideBookingForm();
        if(document.querySelector("#room-book-now").value=="Deluxe")
        {
            document.querySelector(`input[name="roomtype"][value="Deluxe"]`).checked = true;
        }
        else
        {
            document.querySelector(`input[name="roomtype"][value="Standard"]`).checked = true;
        }
    }
    else
    {
        authRequire.classList.remove("hidden");
    }
});
document.querySelector("#booking-form-submit-button").addEventListener("click",()=>{
    fetch("includes/handles/booking.php",{
        method: 'POST',
        body: new FormData(document.getElementById("booking-form")),
    })
    .then(response => response.text())
    .then(responseData => {
        try
        {
            let data = JSON.parse(responseData);
            showMessageDialog(data.message);
            if(data.status==="success")
            {
                document.getElementById("booking-form").classList.add("hidden");
            }
        }
        catch(error)
        {
            console.error("Có lỗi xảy ra: ", error);
            console.error(responseData);
        }
    })
    .catch(error => {
        console.error("Có lỗi xảy ra: ", error);
    }); 
});

document.getElementById("account-history-x").addEventListener("click",()=>{
    document.getElementById("histories-ctn").classList.add("hidden");
});

document.getElementById("account-history-btn").addEventListener("click",()=>{
    fetch("includes/handles/history.php")
    .then(response => response.text())
    .then(responseData => {
        try
        {
            let data=JSON.parse(responseData);
            let tbody = document.querySelector("#histories-table tbody");
            tbody.innerHTML='';
            data.forEach(row => {
                let tr = document.createElement("tr");
                let op = row.Trang_thai==="Chưa xác nhận" ? "Hủy" :"Chi tiết";
                let btn = row.Trang_thai==="Chưa xác nhận" || row.Trang_thai==="Đã trả phòng" ? `<button class="history-button" value="${op}" data-id="${row.Ma_don_dat_phong}">${op}</button>`:'';
                tr.innerHTML = `
                    <td>${row.Ma_don_dat_phong}</td>
                    <td>${row.Ngay_nhan}</td>
                    <td>${row.Ngay_tra}</td>
                    <td>${row.So_luong_phong}</td>
                    <td>${row.So_luong_nguoi}</td>
                    <td>${row.Ten_loai}</td>
                    <td>${row.Ngay_dat}</td>
                    <td>${row.Trang_thai}</td>
                    <td>${btn}</td>
                `;
                tbody.appendChild(tr);
            });

            document.querySelectorAll(".history-button").forEach(button=>{
                button.addEventListener("click",()=>{
                    if(button.value==="Hủy")
                    {
                        if(confirm("Xác nhận hủy đơn đặt phòng?"))
                        {
                            const formData = new FormData();
                            formData.append("id", button.dataset['id']);
                            fetch("includes/handles/cancelBooking.php",{
                                method:'POST',
                                body: formData,
                            })
                            .then(response => response.text())
                            .then(responseData => {
                                try
                                {
                                    let data=JSON.parse(responseData);
                                    showMessageDialog(data.message);
                                    document.getElementById("account-history-btn").click();
                                }
                                catch(error)
                                {
                                    console.error(error);
                                }
                            })
                            .catch(error => {
                                console.error(error);
                            });
                        }
                    }
                    else
                    {
                        if(button.value==="Chi tiết")
                        {
                            const formData = new FormData();
                            formData.append("id", button.dataset['id']);
                            fetch("includes/handles/getInvoiceDetails.php",{
                                method:'POST',
                                body: formData,
                            })
                            .then(response => response.text())
                            .then(responseData => {
                                try {
                                    let data = JSON.parse(responseData);
                                    // data.hoa_don, data.phong, data.do_dung_hu
                                    let container = document.getElementById("invoice-details");
                            
                                    // Hiển thị thông tin hóa đơn
                                    let hoaDon = data.hoa_don;
                                    let hoaDonHtml = `
                                        <div id="invoice-x" class="x-ctn"><i class='fa-regular fa-circle-xmark x'></i></div>
                                        <h3>Thông tin Hóa đơn</h3><br>
                                        <p><strong>Mã hóa đơn:</strong> ${hoaDon.Ma_Hoa_Don}</p><br>
                                        <p><strong>Mã đơn đặt phòng:</strong> ${hoaDon.Ma_don_dat_phong}</p><br>
                                        <p><strong>Ngày đặt:</strong> ${hoaDon.Ngay_dat}</p><br>
                                        <p><strong>Ngày nhận:</strong> ${hoaDon.Ngay_nhan}</p><br>
                                        <p><strong>Ngày trả:</strong> ${hoaDon.Ngay_tra}</p><br>
                                        <p><strong>Số lượng phòng:</strong> ${hoaDon.So_luong_phong}</p><br>
                                        <p><strong>Số lượng người:</strong> ${hoaDon.So_luong_nguoi}</p><br>
                                        <p><strong>Nhân viên thanh toán:</strong> ${hoaDon.Ma_nhan_vien}</p><br>
                                        <br><h3><strong>Tổng tiền:</strong> ${hoaDon.Tong_tien} VND</h3><br><br>
                                        <h3>Chi tiết:</p></h3>
                                    `;
                            
                                    // Danh sách phòng
                                    let phongHtml = `<h3>Phòng đã thuê</h3><ul>`;
                                    data.phong.forEach(p => {
                                        phongHtml += `<li>Phòng số: ${p.Ma_phong}</li>`;
                                    });
                                    phongHtml += `</ul>`;
                            
                                    // Danh sách đồ dùng hư
                                    let huHtml = `<br><h3>Đồ dùng hư hỏng</h3>`;
                                    if (data.do_dung_hu.length === 0) {
                                        huHtml += `<p>Không có đồ dùng nào bị hư hỏng.</p>`;
                                    } else {
                                        huHtml += `<ul>`;
                                        data.do_dung_hu.forEach(item => {
                                            huHtml += `<li>Phòng ${item.Ma_phong} - ${item.Ten_do_dung} (${item.Gia} VND)</li>`;
                                        });
                                        huHtml += `</ul>`;
                                    }
                                
                                    container.innerHTML = hoaDonHtml + phongHtml + huHtml;
                                    document.getElementById("invoice-x").addEventListener("click",()=>{
                                        container.classList.add("hidden");
                                    });
                                    container.classList.remove("hidden");
                            
                                    // Scroll hoặc focus
                                    container.scrollIntoView({ behavior: "smooth" });
                            
                                } catch (error) {
                                    console.error(error);
                                    console.error(responseData);
                                }
                            });                            
                        }
                    }
                });
            });
            document.getElementById("histories-ctn").classList.remove("hidden");
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
});