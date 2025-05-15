let currentRoom = null; // Biến toàn cục để lưu thông tin phòng hiện tại
let phong = [];
let loai_phong = [];
let hoa_don = [];
let khach_hang = [];
let do_dung = [];
let account = [];
let chi_tiet_phong = [];
let chi_tiet_hoa_don = [];
let chi_tiet_phong_hoa_don = [];
let don_dat_phong = [];
let selectedRooms = [];
let nhan_vien = [];
let booking = {};
async function fetchAllDataRoom() {
    phong = [];
    loai_phong = [];
    hoa_don = [];
    khach_hang = [];
    do_dung = [];
    account = [];
    chi_tiet_hoa_don = [];
    chi_tiet_phong_hoa_don = [];
    don_dat_phong = [];
    chi_tiet_phong = [];
    selectedRooms = [];
    nhan_vien = [];
    booking = {};
    try {
        const [roomsRes, roomTypesRes, customersRes, invoicesRes, objectsRes, accountsRes, orderDetailRes, roomDetailsRes, applyFormRes, detailsRes, staffsRes] = await Promise.all([
            fetch('ConnectWithDatabase/get_rooms.php'),
            fetch('ConnectWithDatabase/get_roomType.php'),
            fetch('ConnectWithDatabase/get_customers.php'),
            fetch('ConnectWithDatabase/get_invoices.php'),
            fetch('ConnectWithDatabase/get_objects.php'),
            fetch('ConnectWithDatabase/get_account.php'),
            fetch('ConnectWithDatabase/get_orderDetails.php'),
            fetch('ConnectWithDatabase/get_roomDetails.php'),
            fetch('ConnectWithDatabase/get_ApplyForm.php'),
            fetch('ConnectWithDatabase/get_Details.php'),
            fetch('ConnectWithDatabase/get_staff.php')
        ]);

        if (!roomsRes.ok || !roomTypesRes.ok || !customersRes.ok || !invoicesRes.ok || !objectsRes.ok || !accountsRes.ok || !orderDetailRes || !roomDetailsRes.ok || !applyFormRes.ok || !detailsRes.ok || !staffsRes.ok) {
            throw new Error("Có lỗi khi fetch một trong các file PHP");
        }

        const [roomsData, roomTypesData, customersData, invoicesData, objectsData, accountsData, orderDetailData, roomDetailsData, applyFormData, detailData, staffData] = await Promise.all([
            roomsRes.json(),
            roomTypesRes.json(),
            customersRes.json(),
            invoicesRes.json(),
            objectsRes.json(),
            accountsRes.json(),
            orderDetailRes.json(),
            roomDetailsRes.json(),
            applyFormRes.json(),
            detailsRes.json(),
            staffsRes.json()
        ]);

        // Lưu vào biến toàn cục hoặc dùng tiếp
        phong = roomsData;
        console.log(phong);
        loai_phong = roomTypesData;
        console.log(loai_phong);
        khach_hang = customersData;
        console.log(khach_hang);
        hoa_don = invoicesData;
        console.log(hoa_don);
        do_dung = objectsData;
        console.log(do_dung);
        account = accountsData;
        console.log(account);
        chi_tiet_hoa_don = orderDetailData;
        console.log(chi_tiet_hoa_don);
        chi_tiet_phong = roomDetailsData;
        console.log(chi_tiet_phong);
        don_dat_phong = applyFormData;
        console.log(don_dat_phong);
        chi_tiet_phong_hoa_don = detailData;
        console.log(chi_tiet_phong_hoa_don);
        nhan_vien = staffData;
        console.log(nhan_vien);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}
async function renderRoom () {
  await fetchAllDataRoom();
  renderHotelLayout();
}

function filterHotelLayout(filterType){
  let filteredRooms = phong.filter(room => {
    console.log(filterType);
    if (filterType === 'Trống' || filterType === 'Có người ở' || filterType === 'Đang dọn dẹp') {
      return room.Trang_thai === filterType;
    } else if (filterType === 'Standard' || filterType === 'Deluxe') {
      let roomType = loai_phong.find(rt => rt.Ma_Loai_Phong === room.Ma_Loai_Phong);
      console.log(roomType);
      return (roomType && roomType.Ten_loai === filterType);
    }
    return true;
  });
  console.log(filterType);
  console.log(filteredRooms);
  const floors = {};
  filteredRooms.forEach(room => {
    console.log(room.ID);
    const floorNum = String(room.ID)[2];
    if (!floors[floorNum]) {
      floors[floorNum] = [];
    }
    floors[floorNum].push(room);
  });
  console.log(floors);
  let thotelLayout = document.getElementById('hotel-wrapper');
  thotelLayout.innerHTML = '';
  Object.keys(floors).sort().forEach(floorNum => {
    const floorDiv = document.createElement('div');
    floorDiv.classList.add('floor');

    const roomRow = document.createElement('div');
    roomRow.classList.add('room-row');

    const floorTitle = document.createElement('div');
    floorTitle.classList.add('floor-title');
    floorTitle.innerHTML = `<p>Floor ${floorNum}</p>`;
    roomRow.appendChild(floorTitle);

    const roomContainer = document.createElement('div');
    roomContainer.classList.add('room-container');

    floors[floorNum].forEach(room => {
      const roomDiv = document.createElement('div');
      let statusClass = room.Trang_thai === 'Trống' ? 'free' : (room.Trang_thai === 'Có người ở' ? 'occupied' : (room.Trang_thai === 'Đang dọn dẹp' ? 'cleaning' : ''));
      roomDiv.classList.add('room', statusClass);
      console.log(room.ID);
      roomDiv.innerHTML = `<div class="room-title">${room.ID}</div>`;
      if (room.Trang_thai === 'Có người ở') {
          console.log(room);
          let ownerName = '';
          const roomI = chi_tiet_hoa_don.find(r => r.Ma_phong === room.ID);
          let detail = null;
          if (roomI) {
            detail = hoa_don.find(d => d.Ma_Hoa_Don === roomI.Ma_Hoa_Don);
          }
          console.log(detail);
          console.log(detail.Ma_don_dat_phong);
          const l = don_dat_phong.filter(inv => (
            inv && inv.Trang_thai === "Đã nhận phòng"
          ));
          console.log(l);
          console.log(l.Ma_don_dat_phong);
          let invoice = don_dat_phong.find(inv => (
              inv && (inv.Trang_thai === "Đã nhận phòng") && (inv.Ma_don_dat_phong === detail.Ma_don_dat_phong)
            ));
            console.log(invoice);
            console.log(invoice.Account);
          let Account = account.find(acc => acc.Username === invoice.Account);
              console.log(Account);
          let customer = khach_hang.find(cust => cust.Account === Account.Username);
              if (customer) ownerName = customer.Ten;
              console.log(customer);
              console.log(ownerName);
          roomDiv.innerHTML += `<div class="room-owner">${ownerName}</div>`;
      } 
      roomContainer.appendChild(roomDiv);
    });
    roomRow.appendChild(roomContainer);
    floorDiv.appendChild(roomRow);
    thotelLayout.appendChild(floorDiv);
  });
}
function renderHotelLayout() {
  const hotelLayout = document.getElementById('hotel-wrapper');
  hotelLayout.innerHTML = '';
  const floors = {};

  phong.forEach(room => {
    const idMatch = room.ID.match(/\d+/);
    const floorNum = idMatch ? idMatch[0][1] : '0';
    if (!floors[floorNum]) {
      floors[floorNum] = [];
    }
    floors[floorNum].push(room);
  });

  Object.keys(floors).sort().forEach(floorNum => {
    const floorDiv = document.createElement('div');
    floorDiv.classList.add('floor');

    const roomRow = document.createElement('div');
    roomRow.classList.add('room-row');

    const floorTitle = document.createElement('div');
    floorTitle.classList.add('floor-title');
    floorTitle.innerHTML = `<p>Floor ${floorNum}</p>`;
    roomRow.appendChild(floorTitle);

    const roomContainer = document.createElement('div');
    roomContainer.classList.add('room-container');

    floors[floorNum].forEach(room => {
      const roomDiv = document.createElement('div');
      let statusClass = room.Trang_thai === 'Trống' ? 'free'
        : room.Trang_thai === 'Có người ở' ? 'occupied'
        : room.Trang_thai === 'Đang dọn dẹp' ? 'cleaning'
        : '';
      roomDiv.classList.add('room', statusClass);
      roomDiv.innerHTML = `<div class="room-title">${room.ID}</div>`;

      if (room.Trang_thai === 'Có người ở') {
        let ownerName = '';
        const roomDetails = chi_tiet_hoa_don.filter(r => r.Ma_phong === room.ID);

        for (const detail of roomDetails) {
          const hoaDonDetail = hoa_don.find(d => d.Ma_Hoa_Don === detail.Ma_Hoa_Don);
          if (!hoaDonDetail || !hoaDonDetail.Ma_don_dat_phong) continue;

          const invoice = don_dat_phong.find(inv =>
            inv && inv.Ma_don_dat_phong === hoaDonDetail.Ma_don_dat_phong &&
            inv.Trang_thai === "Đã nhận phòng"
          );
          if (!invoice || !invoice.Account) continue;

          const accountInfo = account.find(acc => acc.Username === invoice.Account);
          if (!accountInfo) continue;

          const customer = khach_hang.find(cust => cust.Account === accountInfo.Username);
          if (customer && customer.Ten) {
            ownerName = customer.Ten;
            break; // tìm thấy phù hợp → dừng
          }
        }

        if (!ownerName) {
          console.warn(`⚠️ Không tìm thấy khách cho phòng ${room.ID}`);
        }

        roomDiv.innerHTML += `<div class="room-owner">${ownerName}</div>`;
      }

      roomContainer.appendChild(roomDiv);
    });

    roomRow.appendChild(roomContainer);
    floorDiv.appendChild(roomRow);
    hotelLayout.appendChild(floorDiv);
  });

  updateStatusBar(phong, loai_phong);
  bindStatusBarFilters();
}
function updateStatusBar(rooms, roomTypes) {
    if (!rooms || !roomTypes) {
        console.warn("Không có dữ liệu phòng hoặc loại phòng để cập nhật status bar.");
        return;
    }
    // Đếm trạng thái phòng
    let freeCount = 0, occupiedCount = 0, cleaningCount = 0;
    rooms.forEach(room => {
        if (room.Trang_thai === 'Trống') freeCount++;
        if (room.Trang_thai === 'Có người ở') occupiedCount++;
        if (room.Trang_thai === 'Đang dọn dẹp') cleaningCount++;
    });

    // Đếm theo loại phòng
    let standardCount = rooms.filter(room => {
        const roomType = roomTypes.find(rt => rt.Ma_Loai_Phong === room.Ma_Loai_Phong);
        return (roomType && roomType.Ten_loai === 'Standard');
    }).length;
    let deluxeCount = rooms.filter(room => {
        const roomType = roomTypes.find(rt => rt.Ma_Loai_Phong === room.Ma_Loai_Phong);
        return (roomType && roomType.Ten_loai === 'Deluxe');
    }).length;

    // Cập nhật innerHTML cho status-bar
    const statusBar = document.getElementById('status-bar'); // Giả sử bạn có một phần tử với id là statusBar
    if (!statusBar) {
        console.warn("Không tìm thấy phần tử #statusBar trong DOM.");
        return;
    }
    statusBar.innerHTML = `
        <div class="status-item status-free">${freeCount} <span>Trống</span></div>
        <div class="status-item status-occupied">${occupiedCount} <span>Đang ở</span></div>
        <div class="status-item status-cleaning">${cleaningCount} <span>Chưa dọn</span></div>
        <div class="status-item status-standard">${standardCount} Phòng <span>standard</span></div>
        <div class="status-item status-deluxe">${deluxeCount} Phòng <span>deluxe</span></div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const btnCheckIn = document.getElementById('nhanPhongBtn');
    if (btnCheckIn) {
      btnCheckIn.addEventListener('click', function () {
        const bookedWithoutInvoice = don_dat_phong.filter(don =>
          !hoa_don.some(hd => hd.Ma_don_dat_phong === don.Ma_don_dat_phong) && don.Trang_thai === 'Đã xác nhận'
        );
  
        if (bookedWithoutInvoice.length > 0) {
          showBookedList(bookedWithoutInvoice);
        } else {
          showNewBookingForm();
        }
      });
    }
  });
  
  function showBookedList(bookedList) {
    const container = document.querySelector('#booking-list-modal');
    const list = document.querySelector('#booking-list');
    list.innerHTML = '';
  
    bookedList.forEach(don => {
      const li = document.createElement('li');
      li.textContent = `Đơn ${don.Ma_don_dat_phong} - ${don.Account}`;
      li.addEventListener('click', () => {
        document.getElementById('booking-list-modal').style.display = 'none';
        booking = don;
        selectRoomsForBooking(don);
      });
      list.appendChild(li);
    });
    showFormWithDelay('booking-list-modal');
    container.style.display = 'block';
  }
  
  function selectRoomsForBooking(booking) {
    document.getElementById("back-to-booking-list").addEventListener("click", function () {
      document.getElementById("form-checkin").style.display = "none";
      document.getElementById("booking-list-modal").style.display = "block";
    });
    const availableRooms = phong.filter(p =>
      p.Trang_thai === 'Trống' && p.Ma_Loai_Phong === booking.Ma_Loai_Phong
    );
    console.log(availableRooms);
    const container = document.querySelector('#available-rooms');
    const form = document.querySelector('#form-checkin');
    const bookingIdSpan = document.getElementById('current-booking-id');
  
    container.innerHTML = '';
    bookingIdSpan.textContent = booking.Ma_don_dat_phong + ' Số lượng phòng: ' + booking.So_luong_phong;
  
    availableRooms.forEach(room => {
      const btn = document.createElement('button');
      btn.textContent = `Phòng ${room.ID}`;
      btn.classList.add('room-button'); // để styling nếu cần
  
      btn.addEventListener('click', () => {
        const index = selectedRooms.indexOf(room.ID);
  
        if (index !== -1) {
          // Đã chọn rồi → bỏ chọn
          selectedRooms.splice(index, 1);
          btn.classList.remove('selected');
        } else {
          // Chưa chọn → chọn mới
          if (selectedRooms.length >= booking.So_luong_phong) {
            alert('Lỗi: Không thể chọn nhiều hơn số phòng trong đơn đặt phòng!');
            return;
          }
          selectedRooms.push(room.ID);
          btn.classList.add('selected');
          
        }
        console.log(selectedRooms);
      });
  
      container.appendChild(btn);
    });
  
    showFormWithDelay('form-checkin');
    form.style.display = 'block';
  }
  document.getElementById('confirm-assign-room').addEventListener('click',() => { 
    confirmBooking(booking, selectedRooms)
  });

  
  async function confirmBooking(booking, selectedRoomIds) {
    console.log(booking);
    console.log(selectedRoomIds);
    // const Ma_Hoa_Don = generateId('HD');
    let totalAmount = 0;
    const roomType = loai_phong.find(lp => lp.Ma_Loai_Phong === booking.Ma_Loai_Phong);
    if (roomType) {
        totalAmount = roomType.Gia * booking.So_luong_phong;
    }  
    const nv = nhan_vien.find(nv => nv.Account === currentUsername);
    if (!nv) {
      alert("Không tìm thấy nhân viên tương ứng!");
      return;
    }
    idNV = nv.Ma_nhan_vien;
    console.log(idNV);
    try {
      const res = await fetch('ConnectWithDatabase/ConfirmBooking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Ma_don_dat_phong: booking.Ma_don_dat_phong,
          Tong_tien: totalAmount,
          phong: selectedRoomIds,
          Ma_nhan_vien: idNV
        })
      });
      
      const rawText = await res.text();
      console.log('⛔ RAW RESPONSE:', rawText);
      try {
        const result = JSON.parse(rawText);
        if (result.success) {
          // Cập nhật trạng thái phòng trong JS
          selectedRoomIds.forEach(roomId => {
            const room = phong.find(p => p.ID === roomId);
            if (room) {
              room.Trang_thai = 'Có người ở';
            }
          });
          alert('✅ Đã nhận phòng thành công');
          document.getElementById("form-checkin").style.display = "none";

          //await fetchAllDataRoom();
          renderRoom();
          //await refreshCheckOutStatus();
          const remaining = don_dat_phong.filter(don =>
            !hoa_don.some(hd => hd.Ma_don_dat_phong === don.Ma_don_dat_phong)
          );
          if (remaining.length > 0) {
            showBookedList(remaining);
          }
        } else {
          alert("❌ Lỗi lưu dữ liệu: " + result.message);
        }
      } catch (e) {
        console.error("❌ Lỗi JSON:", e.message, "\nRESPONSE:", rawText);
        alert("Lỗi phản hồi từ server: không phải JSON hợp lệ.");
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi kết nối server.');
    }
  }
  
async function showNewBookingForm() {
  const step1 = document.getElementById("form-new-booking-step1");
  const step2 = document.getElementById("form-new-booking-step2");
  const roomTypeSelect = step1.querySelector('#select-room-type');
  const form = step1.querySelector("#manual-booking-data");
  const newCustomerFields = form.querySelector("#new-customer-fields");
  const inputCCCD = form.querySelector('input[name="CCCD"]');
  const inputUsername = form.querySelector('input[name="username"]');
  let selectedRooms = [];

  showFormWithDelay('form-new-booking-step1');
  step1.style.display = "block";
  step2.style.display = "none";

  // Load loại phòng vào select
  roomTypeSelect.innerHTML = '';
  loai_phong.forEach((lp, index) => {
    const opt = document.createElement("option");
    opt.value = lp.Ma_Loai_Phong;
    opt.textContent = lp.Ten_loai;
    if (index === 0) opt.selected = true;
    roomTypeSelect.appendChild(opt);
  });

  form.querySelector('input[name="So_luong_phong"]').addEventListener("input", () => {
  const cccd = inputCCCD.value.trim();
  const username = inputUsername.value.trim();

  const kh = khach_hang.find(kh => kh.CCCD === cccd);
  const acc = account.find(acc => acc.Username === username);
  const isStaff = nhan_vien.some(nv => nv.Account === username);
  if (isStaff) {
    alert("⚠️ Tài khoản này là của nhân viên, không được phép đặt phòng!");
    inputUsername.value = '';
    form.querySelector('input[name="So_luong_phong"]').value = '';    inputUsername.focus();
    return;
  }
  // Nếu thiếu CCCD hoặc Username thì chưa kiểm tra
  if (!cccd || !username) {
    newCustomerFields.style.display = 'none';
    return;
  }

  // Nếu cả hai không tồn tại => cho phép nhập mới
  if (!kh && !acc) {
    newCustomerFields.style.display = 'block';
    return;
  }

  // Nếu trùng hợp hợp lệ
  if (kh && acc && kh.Account === acc.Username) {
    newCustomerFields.style.display = 'none';
    return;
  }

  // ❌ Trường hợp sai – xóa input, focus vào chỗ sai
  newCustomerFields.style.display = 'none';
  alert("⚠️ CCCD và Username không thuộc cùng một người!");

  // Xác định chỗ sai để focus
  if (!kh) {
    inputCCCD.value = '';
    form.querySelector('input[name="So_luong_phong"]').value = '';
    inputCCCD.focus();
  } else {
    inputUsername.value = '';
    form.querySelector('input[name="So_luong_phong"]').value = '';
    inputUsername.focus();
  }

  // Xoá lại input số lượng phòng để không cho đi tiếp
  form.querySelector('input[name="So_luong_phong"]').value = '';
});


  // Nút chuyển sang bước 2
  document.getElementById("to-step2").onclick = () => {
    const quantityInput = form.querySelector('input[name="So_luong_phong"]');
    const peopleInput = form.querySelector('input[name="So_luong_nguoi"]');
    const ngayTraInput = form.querySelector('input[name="Ngay_tra"]');
    selectedRooms = [];
    const cccd = inputCCCD.value.trim();
    const username = inputUsername.value.trim();
    const soLuongPhong = parseInt(quantityInput.value);
    const soLuongNguoi = parseInt(peopleInput.value);
    const ngayTra = ngayTraInput.value;

    const isCCCDExist = khach_hang.some(kh => kh.CCCD === cccd);
    const isUsernameExist = account.some(acc => acc.Username === username);

    const ten = form.querySelector('input[name="Ten_khach"]').value.trim();
    const pass = form.querySelector('input[name="password"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();
    const address = form.querySelector('input[name="address"]').value.trim();

    // Kiểm tra hợp lệ
    if (!/^\d{9}$|^\d{12}$/.test(cccd)) {
      alert("CCCD phải gồm 9 hoặc 12 chữ số!");
      inputCCCD.focus();
      return;
    }

    if (username.length < 4) {
      alert("Username phải dài tối thiểu 4 ký tự!");
      inputUsername.focus();
      return;
    }

    if (!isCCCDExist && !isUsernameExist) {
      if (!ten) {
        alert("Vui lòng nhập Họ tên khách!");
        form.querySelector('input[name="Ten_khach"]').focus();
        return;
      }
      if (!pass) {
        alert("Vui lòng nhập Password!");
        form.querySelector('input[name="password"]').focus();
        return;
      }
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert("Email không hợp lệ!");
        form.querySelector('input[name="email"]').focus();
        return;
      }
      if (!phone || !/^\d{10,11}$/.test(phone)) {
        alert("Số điện thoại phải có 10-11 chữ số!");
        form.querySelector('input[name="phone"]').focus();
        return;
      }
      if (!address) {
        alert("Vui lòng nhập Địa chỉ!");
        form.querySelector('input[name="address"]').focus();
        return;
      }
    }

    if (isNaN(soLuongPhong) || soLuongPhong <= 0) {
      alert("Số lượng phòng phải lớn hơn 0!");
      quantityInput.focus();
      return;
    }

    if (isNaN(soLuongNguoi) || soLuongNguoi <= 0) {
      alert("Số lượng người phải lớn hơn 0!");
      peopleInput.focus();
      return;
    }

    if (!ngayTra) {
      alert("Vui lòng chọn Ngày trả!");
      ngayTraInput.focus();
      return;
    }

    const dateNgayTra = new Date(ngayTra);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateNgayTra.setHours(0, 0, 0, 0);
    if (dateNgayTra < today) {
      alert("Ngày trả không thể trước hôm nay!");
      ngayTraInput.focus();
      return;
    }

    // ✅ Gán giá trị vào span
    const displaySpan = document.getElementById("room-quantity-display");
    if (displaySpan) {
      displaySpan.textContent = soLuongPhong;
    }

    // Tiếp tục nếu hợp lệ
    showFormWithDelay('form-new-booking-step2');
    const selectedType = roomTypeSelect.value;
    const availableRooms = phong.filter(p => p.Trang_thai === 'Trống' && p.Ma_Loai_Phong === selectedType);

    if (availableRooms.length === 0) {
      alert("Không còn phòng phù hợp!");
      return;
    }

    const roomContainer = document.getElementById("available-rooms-manual");
    roomContainer.innerHTML = '';
    selectedRooms = [];

    availableRooms.forEach(room => {
      const btn = document.createElement("button");
      btn.textContent = `Phòng ${room.ID}`;
      btn.classList.add("room-button");
      btn.type = "button";

      btn.addEventListener("click", () => {
        const index = selectedRooms.indexOf(room.ID);
        if (index !== -1) {
          selectedRooms.splice(index, 1);
          btn.classList.remove("selected");
        } else {
          if (selectedRooms.length >= soLuongPhong) {
            alert("Không thể chọn nhiều hơn số lượng phòng đã nhập!");
            return;
          }
          selectedRooms.push(room.ID);
          btn.classList.add("selected");
        }
      });

      roomContainer.appendChild(btn);
    });

    step1.style.display = "none";
    step2.style.display = "block";
  };

  // Quay lại bước 1
  document.getElementById("back-to-step1").onclick = () => {
    step1.style.display = "block";
    step2.style.display = "none";
  };

   // Xác nhận đặt phòng
  document.getElementById("confirm-manual-booking").addEventListener("click", async () => {
    const data = new FormData(form);
    const cccd = data.get("CCCD");
    const username = data.get("username");
    const isCCCDExist = khach_hang.some(kh => kh.CCCD === cccd);
    const isUsernameExist = account.some(acc => acc.Username === username);

    const customerName = data.get("Ten_khach");
    const password = data.get("password");
    const email = data.get("email");
    const phone = data.get("phone");
    const address = data.get("address");
    const quantity = parseInt(data.get("So_luong_phong"));
    const people = parseInt(data.get("So_luong_nguoi"));
    const ngayTra = data.get("Ngay_tra");
    const maLoaiPhong = data.get("Ma_loai_phong");

    if (!cccd || !username || !ngayTra || !maLoaiPhong) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    if (!isCCCDExist && !isUsernameExist) {
      if (!customerName || !password || !email || !phone || !address) {
        alert("Vui lòng nhập đầy đủ thông tin khách hàng!");
        return;
      }
      if (!/^\d{9}$|^\d{12}$/.test(cccd)) {
        alert("CCCD phải gồm 9 hoặc 12 chữ số!");
        return;
      }
      if (!/^\d{10,11}$/.test(phone)) {
        alert("Số điện thoại phải có 10-11 chữ số!");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert("Email không hợp lệ!");
        return;
      }
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dateNgayTra = new Date(ngayTra);
    dateNgayTra.setHours(0, 0, 0, 0);
    if (dateNgayTra < now) {
      alert("Ngày trả không thể trước hôm nay!");
      return;
    }

    if (selectedRooms.length !== quantity) {
      alert("Số lượng phòng chưa khớp với lựa chọn!");
      return;
    }

    const ngayDat = new Date().toISOString().slice(0, 19).replace("T", " ");
    const ngayNhan = ngayDat;

    let Account = { Username: username };
    let khachHang = { CCCD: cccd };
    if (!isUsernameExist && !isCCCDExist) {
      Account = {
        Username: username,
        Password: password,
        Email: email,
        Status: "Hoạt động",
      };
      account.push(Account);
      khachHang = {
        CCCD: cccd,
        Ten: customerName,
        SDT: phone,
        Dia_chi: address,
        Account: Account.Username,
      };
      khach_hang.push(khachHang);
    }

    const donDat = {
      Account: Account.Username,
      Ngay_nhan: ngayNhan,
      Ngay_tra: ngayTra,
      So_luong_phong: quantity,
      So_luong_nguoi: people,
      Ma_Loai_Phong: maLoaiPhong,
      Ngay_dat: ngayDat,
      Trang_thai: "Đã nhận phòng",
    };
    don_dat_phong.push(donDat);

    let total = 0.0;
    selectedRooms.forEach(roomID => {
      const room = phong.find(p => p.ID === roomID);
      const roomType = loai_phong.find(rt => rt.Ma_Loai_Phong === room.Ma_Loai_Phong);
      total += roomType.Gia;
    });

    const nv = nhan_vien.find(nv => nv.Account === currentUsername);
    const idNV = nv.Ma_nhan_vien;
    console.log(idNV);
    try {
      const res = await fetch("ConnectWithDatabase/insert_checkin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: isUsernameExist ? null : Account,
          customer: isCCCDExist ? null : khachHang,
          booking: donDat,
          phong: selectedRooms,
          Gia: total,
          Ma_nhan_vien: idNV,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("✅ Đặt phòng thành công.");
        step1.style.display = "none";
        step2.style.display = "none";
        // Reset danh sách phòng đã chọn
        selectedRooms = [];
        const form = document.querySelector('#manual-booking-data');
        if (form) {
          form.reset(); // reset mặc định tất cả input/select
          // Ẩn phần new-customer nếu nó đang hiện
          const newCustomerFields = document.getElementById('new-customer-fields');
          if (newCustomerFields) newCustomerFields.style.display = 'none';
        }

        renderRoom();
        await updateCheckOutButton();
      } else {
        alert("❌ Lỗi khi lưu: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi kết nối đến server.");
    }
  });
}

  
  async function delayBooking(bookedList) {
    // Tìm hóa đơn tương ứng
    const invoice = hoa_don.find(p => p.Ma_don_dat_phong === bookedList.Ma_don_dat_phong);
    if (!invoice) return;  // không có hóa đơn thì dừng
  
    // Lấy chi tiết hóa đơn
    const details = chi_tiet_hoa_don.filter(p => p.Ma_Hoa_Don === invoice.Ma_Hoa_Don);
    if (details.length === 0) return;
  
    // Gửi yêu cầu lên server
    let result;
    try {
      const res = await fetch('ConnectWithDatabase/insert_checkoutAuto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Ma_don_dat_phong: bookedList.Ma_don_dat_phong,
          phong: details
        })
      });
      result = await res.json();            // dùng res.json() để parse tự động
    } catch (err) {
      console.error('Lỗi kết nối hoặc JSON không hợp lệ', err);
      alert('❌ Lỗi kết nối hoặc phản hồi không phải JSON.');
      return;
    }
  
    // Xử lý kết quả
    if (result.success) {
      alert('✅ Trả phòng thành công.');
      const form = document.getElementById('checkout-list');
      if (form) form.style.display = 'none';
  
      // Đổi trạng thái phòng
      const roomsToUpdate = details
        .map(d => phong.find(p => p.ID === d.Ma_phong))
        .filter(r => r);
  
      roomsToUpdate.forEach(room => {
        room.Trang_thai = 'Đang dọn dẹp';
        setTimeout(() => {
          room.Trang_thai = 'Trống';
          updateStatusBar(roomsToUpdate, loai_phong);
          bindStatusBarFilters();
        }, 12000);
      });
  
      renderRoom();
      //fetchAllDataRoom(); // load lại dữ liệu phòng
    } else {
      alert('❌ Lỗi khi lưu trả phòng: ' + result.message);
    }
  }
  
async function checkForCheckOut() {
  await renderRoom();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Các đơn đến hạn trả hôm nay
  const availableBookings = don_dat_phong.filter(p => {
    if (p.Trang_thai !== 'Đã nhận phòng') return false;
    const due = new Date(p.Ngay_tra);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime() &&
      hoa_don.some(h => h.Ma_don_dat_phong === p.Ma_don_dat_phong);
  });
  window.availableBookingsToday = availableBookings; // phải có dòng này mỗi lần lọc

  // Các đơn quá hạn
  const delayBookings = don_dat_phong.filter(p => {
    if (p.Trang_thai !== 'Đã nhận phòng') return false;
    const due = new Date(p.Ngay_tra);
    due.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime() &&
      hoa_don.some(h => h.Ma_don_dat_phong === p.Ma_don_dat_phong);
  });

  // Tự động xử lý đơn trễ
  for (const b of delayBookings) {
    await delayBooking(b);
  }

  // Gán danh sách đơn trả hôm nay vào biến toàn cục
  window.availableBookingsToday = availableBookings;

  // Bật hoặc tắt nút Trả phòng
  const checkOutBtn = document.getElementById('checkOutBtn');
  if (checkOutBtn && availableBookings.length > 0) {
    checkOutBtn.disabled = false;
  }
  if(availableBookings.length === 0) {
    checkOutBtn.disabled = true;
    document.getElementById("checkout-list").style.display = "none";
    return;
  }
  showCheckOutList(availableBookings);
  document.getElementById("checkout-list").style.display = "block";
}
document.addEventListener('DOMContentLoaded', () => {

  if (checkOutBtn) {
    checkOutBtn.addEventListener('click', async () => {
      // ✅ Luôn cập nhật dữ liệu mới nhất mỗi lần click
      await checkForCheckOut();
    });
  }

  checkForCheckOut();
});



async function delayBooking(bookedList) {
  // Tìm hóa đơn tương ứng
  const invoice = hoa_don.find(p => p.Ma_don_dat_phong === bookedList.Ma_don_dat_phong);
  if (!invoice) return;  // không có hóa đơn thì dừng

  // Lấy chi tiết hóa đơn
  const details = chi_tiet_hoa_don.filter(p => p.Ma_Hoa_Don === invoice.Ma_Hoa_Don);
  if (details.length === 0) return;

  // Kiểm tra ngày trả phòng
  const dueDate = new Date(bookedList.Ngay_tra);
  const today = new Date();
  if (dueDate.toDateString() === today.toDateString()) {
      return; // Không thực hiện trả phòng tự động nếu ngày trả là hôm nay
  }

  // Gửi yêu cầu lên server
  let result;
  try {
      const res = await fetch('ConnectWithDatabase/insert_checkoutAuto.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              Ma_don_dat_phong: bookedList.Ma_don_dat_phong,
              phong: details
          })
      });
      result = await res.json(); // dùng res.json() để parse tự động
  } catch (err) {
      console.error('Lỗi kết nối hoặc JSON không hợp lệ', err);
      alert('❌ Lỗi kết nối hoặc phản hồi không phải JSON.');
      return;
  }

  // Xử lý kết quả
  if (result.success) {
      alert('✅ Trả phòng thành công.');
      const form = document.getElementById('checkout-list');
      if (form) form.style.display = 'none';

      // Đổi trạng thái phòng
      const roomsToUpdate = details
          .map(d => phong.find(p => p.ID === d.Ma_phong))
          .filter(r => r);

      roomsToUpdate.forEach(room => {
          room.Trang_thai = 'Đang dọn dẹp';
          setTimeout(() => {
              room.Trang_thai = 'Trống';
              updateStatusBar(roomsToUpdate, loai_phong);
              bindStatusBarFilters();
          }, 12000);
      });

      //fetchAllDataRoom(); // load lại dữ liệu phòng
      renderRoom();
  } else {
      alert('❌ Lỗi khi lưu trả phòng: ' + result.message);
  }
}

  function showCheckOutList(bookings) {
    const list = document.querySelector("#checkout-booking-list");
    const container = document.getElementById("checkout-list");
    list.innerHTML = '';
    
    bookings.forEach(b => {
      const li = document.createElement("li");
      li.textContent = `Phiếu ${b.Ma_don_dat_phong} - ${b.Account}`;
      li.addEventListener("click", () => {
        container.style.display = 'none';
        showCheckOutForm(b,bookings);
      });
      list.appendChild(li);
    });
  }
  async function showCheckOutForm(booking,bookings) {
    const form = document.getElementById("form-checkout");
    const roomSection = document.getElementById("checkout-room-section");
    const maDatSpan = document.getElementById("checkout-ma-dat");
    const totalDisplay = document.getElementById("total-display");

    // Cập nhật mã đơn đặt phòng
    maDatSpan.textContent = booking.Ma_don_dat_phong;
    roomSection.innerHTML = ''; // Xóa nội dung cũ
    totalDisplay.textContent = 'Tổng tiền: 0 VNĐ'; // Đặt lại tổng tiền

    // Lấy danh sách phòng từ chi tiết hóa đơn
    const rooms = chi_tiet_hoa_don
        .filter(c => hoa_don.find(h => h.Ma_Hoa_Don === c.Ma_Hoa_Don && h.Ma_don_dat_phong === booking.Ma_don_dat_phong))
        .map(c => phong.find(p => p.ID === c.Ma_phong));

    let total = 0; // Khởi tạo tổng tiền

    // Duyệt qua từng phòng để hiển thị thông tin
    rooms.forEach(room => {
        const roomType = loai_phong.find(l => l.Ma_Loai_Phong === room.Ma_Loai_Phong);
        const roomDiv = document.createElement("div");
        roomDiv.className = "room-checkout";

        const roomInfo = document.createElement("p");
        roomInfo.textContent = `Phòng ${room.ID} - Giá: ${roomType.Gia.toLocaleString()} VNĐ`;
        total += parseFloat(roomType.Gia); // Cộng dồn giá phòng

        // Tạo danh sách đồ dùng
        const itemListDiv = document.createElement("div");
        do_dung.forEach(item => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = false;
            checkbox.dataset.gia = item.Gia;
            checkbox.dataset.id = item.Ma_Do_Dung;
            checkbox.dataset.roomId = room.ID;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${item.Ten} (${item.Gia.toLocaleString()} VNĐ)`));
            itemListDiv.appendChild(label);
            itemListDiv.appendChild(document.createElement("br"));
        });

        roomDiv.appendChild(roomInfo);
        roomDiv.appendChild(itemListDiv);
        roomSection.appendChild(roomDiv);
    });

    // Cập nhật tổng tiền khi chọn/bỏ checkbox
    form.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", () => {
            let newTotal = total; // Bắt đầu từ tổng tiền phòng
            form.querySelectorAll("input[type='checkbox']:checked").forEach(cb => {
                newTotal += parseFloat(cb.dataset.gia); // Cộng thêm giá đồ dùng
            });

            totalDisplay.textContent = `Tổng tiền: ${newTotal.toLocaleString()} VNĐ`; // Cập nhật tổng tiền
        });
    });

    totalDisplay.textContent = `Tổng tiền: ${total.toLocaleString()} VNĐ`; // Hiển thị tổng tiền ban đầu
    form.style.display = 'block'; // Hiển thị form
    showFormWithDelay('form-checkout'); // Gọi hàm hiển thị form với độ trễ

    // Xử lý sự kiện xác nhận trả phòng
    document.getElementById("confirm-checkout").onclick = async () => {
        const selectedItems = Array.from(
            form.querySelectorAll("input[type='checkbox']:checked")
        ).map(cb => ({
            Ma_Do_Dung: cb.dataset.id,
            Ma_phong: cb.dataset.roomId
        }));

        const giaTong = parseFloat(
            totalDisplay.textContent.replace(/[^\d]/g, '')
        );
        const hoaDon = hoa_don.find(hd => hd.Ma_don_dat_phong === booking.Ma_don_dat_phong);
        if (!hoaDon) {
          alert("❌ Không tìm thấy hóa đơn cho đơn đặt phòng này!");
          return;
        }
        const phongHoaDon = chi_tiet_hoa_don.filter(ct => ct.Ma_Hoa_Don === hoaDon.Ma_Hoa_Don);
        console.log("Dữ liệu gửi đi:", {
          Ma_don_dat_phong: booking.Ma_don_dat_phong,
          items: selectedItems,
          Tong_tien: giaTong,
          idhd: hoaDon.Ma_Hoa_Don,
          phong: phongHoaDon 
        });
        try {
            const res = await fetch('./ConnectWithDatabase/insert_checkout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Ma_don_dat_phong: booking.Ma_don_dat_phong,
                    items: selectedItems,
                    Tong_tien: giaTong,
                    idhd: hoaDon.Ma_Hoa_Don,
                    phong: phongHoaDon.map(p => p.Ma_phong)
                })
            });
            const result = await res.json(); // Phân tích JSON từ phản hồi

            if (result.success) {
                alert("✅ Trả phòng thành công.");
                form.style.display = 'none'; // Ẩn form
                // Fetch lại dữ liệu phòng từ DB
                //await fetchAllDataRoom();
                renderRoom();
                await refreshCheckOutStatus();
                updateStatusBar(phong, loai_phong);
                bindStatusBarFilters();
                const index = bookings.findIndex(b => b.Ma_don_dat_phong === booking.Ma_don_dat_phong);
                if (index !== -1) bookings.splice(index, 1); // Xóa đơn vừa xử lý

                // ➕ Nếu vẫn còn đơn, hiển thị lại danh sách
                await refreshCheckOutStatus();
                  const updatedBookings = window.availableBookingsToday || [];

                  if (updatedBookings.length > 0) {
                    document.getElementById("checkout-list").style.display = "block";
                    showCheckOutList(updatedBookings);
                  }

                setTimeout(() => {
                  fetch('./ConnectWithDatabase/update_room_status.php', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          phong: phongHoaDon.map(p => p.Ma_phong)
                      })
                  })
                  .then(res => res.json())
                  .then(async data => {
                      if (data.success) {
                          console.log("✔️ Đã cập nhật phòng về trạng thái 'Trống'");
                          //await fetchAllDataRoom(); // Refresh lại danh sách phòng
                          renderRoom();
                          //await refreshCheckOutStatus();
                          const updatedBookings = window.availableBookingsToday || [];

                          if (updatedBookings.length > 0) {
                            document.getElementById("checkout-list").style.display = "block";
                            showCheckOutList(updatedBookings);
                          }

                        } else {
                          console.error("❌ Không thể cập nhật trạng thái phòng:", data.message);
                      }
                  })
                  .catch(err => {
                      console.error("❌ Lỗi khi gửi yêu cầu cập nhật trạng thái phòng:", err);
                  });
              }, 5000); // 10 giây
              
            } else {
                alert("❌ Lỗi khi lưu trả phòng: " + result.message);
            }
            
        } catch (err) {
            console.error("Lỗi fetch hoặc parse JSON:", err);
            alert("❌ Lỗi xử lý phản hồi từ server.");
        }
    };
}

function formatDate(dateStrOrObj) {
  const d = new Date(dateStrOrObj);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

let pendingCheckOuts = [];

async function updateCheckOutButton() {
  renderRoom(); // nếu bạn vẫn muốn render lại phòng ở đây

  const oldBtn = document.getElementById("checkOutBtn");
  if (!oldBtn) return;

  // Thay thế nút cũ bằng nút mới (xoá mọi sự kiện cũ)
  const newBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(newBtn, oldBtn);

  const todayStr = formatDate(new Date());

  // Cập nhật danh sách đơn cần trả hôm nay
  pendingCheckOuts = don_dat_phong.filter(d => {
    if (d.Trang_thai !== "Đã nhận phòng") return false;
    const ngayTraStr = formatDate(d.Ngay_tra);
    return (
      ngayTraStr === todayStr &&
      hoa_don.some(h => h.Ma_don_dat_phong === d.Ma_don_dat_phong)
    );
  });

  console.log("📌 Đơn cần trả hôm nay:", pendingCheckOuts.map(d => d.Ma_don_dat_phong));

  // Bật hoặc tắt nút
  newBtn.disabled = pendingCheckOuts.length === 0;
  await renderRoom();
}



  
  // Đặt cờ để biết form mới vừa mở
let justOpenedForm = false;

// Sau mỗi khi hiển thị form:
function showFormWithDelay(id) {
  const form = document.getElementById(id);
  if (form) {
    form.style.display = 'block';
    justOpenedForm = true;
    setTimeout(() => { justOpenedForm = false; }, 0); // cho phép đóng sau 100ms
  }
}
  document.addEventListener('click', function (event) {
    const target = event.target;
    if (justOpenedForm) return;
    // Danh sách các form cần kiểm tra
    const forms = [
      document.getElementById('booking-list-modal'),
      document.getElementById('form-checkin'),
      document.getElementById('form-new-booking'),
      document.getElementById('form-new-booking-step1'),
      document.getElementById('form-new-booking-step2'),
      document.getElementById('checkout-list'),
      document.getElementById('form-checkout'),
    ];
  
    // Nếu click vào chính form hoặc phần tử bên trong form thì không làm gì
    const clickedInsideForm = forms.some(form => form && form.contains(target));
    if (clickedInsideForm) return;
  
    // Nếu click ra ngoài tất cả form, ẩn tất cả form
    forms.forEach(form => {
      if (form) form.style.display = 'none';
    });
  });
  async function refreshCheckOutStatus() {
  await updateCheckOutButton();
  await checkForCheckOut().then(() => {
    console.log('Check out cập nhật lại hoàn tất');
  });
}