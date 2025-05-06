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
    booking = {};
    try {
        const [roomsRes, roomTypesRes, customersRes, invoicesRes, objectsRes, accountsRes, orderDetailRes, roomDetailsRes, applyFormRes, detailsRes] = await Promise.all([
            fetch('ConnectWithDatabase/get_rooms.php'),
            fetch('ConnectWithDatabase/get_roomType.php'),
            fetch('ConnectWithDatabase/get_customers.php'),
            fetch('ConnectWithDatabase/get_invoices.php'),
            fetch('ConnectWithDatabase/get_objects.php'),
            fetch('ConnectWithDatabase/get_account.php'),
            fetch('ConnectWithDatabase/get_orderDetails.php'),
            fetch('ConnectWithDatabase/get_roomDetails.php'),
            fetch('ConnectWithDatabase/get_ApplyForm.php'),
            fetch('ConnectWithDatabase/get_Details.php')
        ]);

        if (!roomsRes.ok || !roomTypesRes.ok || !customersRes.ok || !invoicesRes.ok || !objectsRes.ok || !accountsRes.ok || !orderDetailRes || !roomDetailsRes.ok || !applyFormRes.ok || !detailsRes.ok) {
            throw new Error("Có lỗi khi fetch một trong các file PHP");
        }

        const [roomsData, roomTypesData, customersData, invoicesData, objectsData, accountsData, orderDetailData, roomDetailsData, applyFormData, detailData] = await Promise.all([
            roomsRes.json(),
            roomTypesRes.json(),
            customersRes.json(),
            invoicesRes.json(),
            objectsRes.json(),
            accountsRes.json(),
            orderDetailRes.json(),
            roomDetailsRes.json(),
            applyFormRes.json(),
            detailsRes.json()
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
        // Gọi render hoặc xử lý logic tiếp
        renderHotelLayout();
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

function renderHotelLayout() {
    console.log(hoa_don);
    const hotelLayout = document.getElementById('hotel-wrapper');
    hotelLayout.innerHTML = ''; // Xóa nội dung cũ

    // Nhóm phòng theo tầng (dựa vào chữ số đầu tiên trong ID sau chữ cái, ví dụ: P101 -> tầng 1)
    const floors = {};
    phong.forEach(room => {
        const idMatch = room.ID.match(/\d+/); // lấy số trong ID
        const floorNum = idMatch ? idMatch[0][0] : '0'; // lấy chữ số đầu tiên
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
                const roomDetail = chi_tiet_hoa_don.find(r => r.Ma_phong === room.ID);
                let hoaDonDetail = null;

                if (roomDetail) {
                    hoaDonDetail = hoa_don.find(d => d.Ma_Hoa_Don === roomDetail.Ma_Hoa_Don);
                }

                if (hoaDonDetail && hoaDonDetail.Ma_don_dat_phong) {
                    const invoice = don_dat_phong.find(inv =>
                        inv && inv.Trang_thai === "Đã nhận phòng" &&
                        inv.Ma_don_dat_phong === hoaDonDetail.Ma_don_dat_phong
                    );

                    if (invoice && invoice.Account) {
                        const accountInfo = account.find(acc => acc.Username === invoice.Account);
                        if (accountInfo) {
                            const customer = khach_hang.find(cust => cust.Account === accountInfo.Username);
                            if (customer) {
                                ownerName = customer.Ten;
                            }
                        }
                    }
                }

                roomDiv.innerHTML += `<div class="room-owner">${ownerName}</div>`;
            }

            roomContainer.appendChild(roomDiv);
        });

        roomRow.appendChild(roomContainer);
        floorDiv.appendChild(roomRow);
        hotelLayout.appendChild(floorDiv);
    });

    updateStatusBar(phong, loai_phong); // Gọi hàm cập nhật thanh trạng thái
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
  
    checkForCheckOut();
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
    const availableRooms = phong.filter(p =>
      p.Trang_thai === 'Trống' && p.Ma_Loai_Phong === booking.Ma_Loai_Phong
    );
    console.log(availableRooms);
    const container = document.querySelector('#available-rooms');
    const form = document.querySelector('#form-checkin');
    const bookingIdSpan = document.getElementById('current-booking-id');
  
    container.innerHTML = '';
    bookingIdSpan.textContent = booking.Ma_don_dat_phong;
  
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
    const roomType = loai_phong.find(lp => lp.Ma_Loai_Phong === booking.Ma_loai_phong);
    if (roomType) {
        totalAmount = roomType.Gia * booking.So_luong_phong;
    }  
    try {
      const res = await fetch('ConnectWithDatabase/ConfirmBooking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Ma_don_dat_phong: booking.Ma_don_dat_phong,
          Tong_tien: totalAmount,
          phong: selectedRoomIds
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
          document.querySelector('#form-checkin').style.display = 'none';
          document.querySelector('#form-new-booking').style.display = 'none';
          fetchAllDataRoom();
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
  
  function showNewBookingForm() {
    const form = document.querySelector('#form-new-booking');
    const roomTypeSelect = form.querySelector('#select-room-type');
    let selectedRooms = []; // ✅ Khai báo ở ngoài

    roomTypeSelect.innerHTML = '';
    loai_phong.forEach((lp, index) => {
      const opt = document.createElement('option');
      opt.value = lp.Ma_Loai_Phong;
      opt.textContent = lp.Ten_loai;

      // ✅ Gán selected cho option đầu tiên
      if (index === 0) opt.selected = true;

      roomTypeSelect.appendChild(opt);
    });
    showFormWithDelay('form-new-booking');
    form.style.display = 'block';
    // ✅ Gọi sau khi option đã đầy đủ và có selected value
    renderRooms();
    roomTypeSelect.addEventListener('change', renderRooms);

  function renderRooms() {
    const selectedType = roomTypeSelect.value;
    const availableRooms = phong.filter(p =>
      p.Trang_thai === 'Trống' && p.Ma_Loai_Phong === selectedType
    );
    const roomContainer = form.querySelector('#available-rooms-manual');
    selectedRooms = [];
    roomContainer.innerHTML = '';

      availableRooms.forEach(room => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.value = room.ID;
        btn.textContent = `Phòng ${room.ID}`;
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          const index = selectedRooms.indexOf(room.ID);
          if (index !== -1) {
            selectedRooms.splice(index, 1);
            btn.classList.remove('selected');
          } else {
            const quantity = parseInt(document.querySelector('input[name="So_luong_phong"]').value);
            if (selectedRooms.length >= quantity) {
              alert('Không thể chọn nhiều hơn số lượng phòng đã nhập!');
              return;
            }
            selectedRooms.push(room.ID);
            btn.classList.add('selected');
          }
        });
        roomContainer.appendChild(btn);
      });
    }
    form.querySelector('#confirm-manual-booking').addEventListener('click', async () => {
      const data = new FormData(form.querySelector('form'));
  
      // Các giá trị form
      const customerName = data.get('Ten_khach');
      const cccd = data.get('CCCD');
      const username = data.get('username');
      const password = data.get('password');
      const email = data.get('email');
      const phone = data.get('phone');
      const address = data.get('address');
      const quantity = parseInt(data.get('So_luong_phong'));
      const people = parseInt(data.get('So_luong_nguoi'));
      const ngayTra = data.get('Ngay_tra');
      const maLoaiPhong = data.get('Ma_loai_phong');
      // Kiểm tra ràng buộc dữ liệu
      if (!customerName || !cccd || !username || !password || !email || !phone || !address || !ngayTra || !maLoaiPhong) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      if (!/^\d{9}$|^\d{12}$/.test(cccd)) {
        alert('CCCD phải gồm 9 hoặc 12 chữ số!');
        return;
      }

      if (!/^\d{10,11}$/.test(phone)) {
        alert('Số điện thoại phải có 10-11 chữ số!');
        return;
      } 

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Email không hợp lệ!');
        return;
      }

      const now = new Date();
      const dateNgayTra = new Date(ngayTra);
      if (dateNgayTra < now) {
        alert('Ngày trả phải sau ngày hiện tại!');
        return;
      }
      if (selectedRooms.length !== quantity) {
        alert('Số lượng phòng chưa đủ');
        return;
      }
  
      const ngayDat = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const ngayNhan = ngayDat;
  
      const Account = {
        Username: username,
        Password: password,
        Email: email,
        Status: 'Hoạt động'
      };
      account.push(Account);
  
      const khachHang = {
        CCCD: cccd,
        Ten: customerName,
        SDT: phone,
        Dia_chi: address,
        Account: Account.Username
      };
      khach_hang.push(khachHang);
  
      const donDat = {
        Account: Account.Username,
        Ngay_nhan: ngayNhan,
        Ngay_tra: ngayTra,
        So_luong_phong: quantity,
        So_luong_nguoi: people,
        Ma_Loai_Phong: maLoaiPhong,
        Ngay_dat: ngayDat,
        Trang_thai: 'Đã nhận phòng'
      };
      don_dat_phong.push(donDat);
  
      console.log(selectedRooms);
  
      let total = 0.0;
      selectedRooms.forEach(roomID => {
        const room = phong.find(p => p.ID === roomID);
        const roomType = loai_phong.find(rt => rt.Ma_Loai_Phong === room.Ma_Loai_Phong);
        total += roomType.Gia;
      });
      console.log(selectedRooms);
      try {
        const res = await fetch('ConnectWithDatabase/insert_checkin.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            account: Account,
            customer: khachHang,
            booking: donDat,
            phong: selectedRooms,
            Gia: total
          })
        });
        const result = await res.json();
        if (result.success) {
          alert("✅ Đã thêm khách hàng và nhận phòng thành công.");
          form.style.display = 'none';
          fetchAllDataRoom();
        } else {
          alert("❌ Có lỗi khi lưu vào cơ sở dữ liệu: " + result.message);
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
        }, 12000);
      });
  
      fetchAllDataRoom(); // load lại dữ liệu phòng
    } else {
      alert('❌ Lỗi khi lưu trả phòng: ' + result.message);
    }
  }
  
  function checkForCheckOut() {
    const today = new Date();
    const checkOutBtn = document.getElementById('checkOutBtn');
  
    // Lọc những booking đến hạn trả phòng hôm nay
    const availableBookings = don_dat_phong.filter(p => {
      if (p.Trang_thai !== 'Đã nhận phòng') return false;
      const due = new Date(p.Ngay_tra);
      return due.toDateString() === today.toDateString() &&
        hoa_don.some(h => h.Ma_don_dat_phong === p.Ma_don_dat_phong);
    });
  
    // Lọc những booking quá hạn
    const delayBookings = don_dat_phong.filter(p => {
      if (p.Trang_thai !== 'Đã nhận phòng') return false;
      const due = new Date(p.Ngay_tra);
      return due < today &&
        hoa_don.some(h => h.Ma_don_dat_phong === p.Ma_don_dat_phong);
    });
  
    // Cập nhật trạng thái nút
    checkOutBtn.disabled = availableBookings.length === 0;
  
    // Thiết lập sự kiện click một lần
    if (availableBookings.length > 0 && !checkOutBtn._listenerAdded) {
      checkOutBtn.addEventListener('click', () => {
        showCheckOutList(availableBookings);
        document.getElementById('checkout-list').style.display = 'block';
        showFormWithDelay('checkout-list');
      });
      checkOutBtn._listenerAdded = true;
    }
  
    // Xử lý tự động trả phòng trễ
    delayBookings.forEach(b => delayBooking(b));
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
        showCheckOutForm(b);
      });
      list.appendChild(li);
    });
  }
  function showCheckOutForm(booking) {
    const form = document.getElementById("form-checkout");
    const roomSection = document.getElementById("checkout-room-section");
    const maDatSpan = document.getElementById("checkout-ma-dat");
    const totalDisplay = document.getElementById("total-display");
  
    maDatSpan.textContent = booking.Ma_don_dat_phong;
    roomSection.innerHTML = '';
    totalDisplay.textContent = 'Tổng tiền: 0 VNĐ';
  
    const rooms = chi_tiet_hoa_don
      .filter(c => hoa_don.find(h => h.Ma_Hoa_Don === c.Ma_Hoa_Don && h.Ma_don_dat_phong === booking.Ma_don_dat_phong))
      .map(c => phong.find(p => p.ID === c.Ma_phong));
  
    let total = 0;
  
    rooms.forEach(room => {
      const roomType = loai_phong.find(l => l.Ma_Loai_Phong === room.Ma_Loai_Phong);
      const roomDiv = document.createElement("div");
      roomDiv.className = "room-checkout";
  
      const roomInfo = document.createElement("p");
      roomInfo.textContent = `Phòng ${room.ID} - Giá: ${roomType.Gia} VNĐ`;
      total += parseFloat(roomType.Gia);
  
      // ✅ Thay vì lấy từ chi_tiet_phong_hoa_don, lấy toàn bộ đồ dùng từ bảng do_dung
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
        label.appendChild(document.createTextNode(` ${item.Ten} (${item.Gia} VNĐ)`));
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
        let newTotal = 0;
        rooms.forEach(room => {
          const roomType = loai_phong.find(l => l.Ma_Loai_Phong === room.Ma_Loai_Phong);
          newTotal += parseFloat(roomType.Gia);
        });
  
        form.querySelectorAll("input[type='checkbox']:checked").forEach(cb => {
          newTotal += parseFloat(cb.dataset.gia);
        });
  
        totalDisplay.textContent = `Tổng tiền: ${newTotal.toLocaleString()} VNĐ`;
      });
    });
  
    totalDisplay.textContent = `Tổng tiền: ${total.toLocaleString()} VNĐ`;
    form.style.display = 'block';
    showFormWithDelay('form-checkout');
  
    document.getElementById("confirm-checkout").onclick = async () => {
      const selectedItems = Array.from(
        form.querySelectorAll("input[type='checkbox']:checked")
      ).map(cb => ({
        Ma_Do_Dung: cb.dataset.id,
        Ma_phong:    cb.dataset.roomId
      }));
    
      const giaTong = parseFloat(
        totalDisplay.textContent.replace(/[^\d]/g, '')
      );
    
      try {
        const res = await fetch('./ConnectWithDatabase/insert_checkout.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Ma_don_dat_phong: booking.Ma_don_dat_phong,
            items: selectedItems,
            Tong_tien: giaTong
          })
        });
        const result = await res.json();            // trực tiếp .json()
        if (result.success) {
          alert("✅ Trả phòng thành công.");
          form.style.display = 'none';
    
          // chỉ fetch lại từ DB, không tự setTimeout trạng thái local
          fetchAllDataRoom();
        }
        else {
          alert("❌ Lỗi khi lưu trả phòng: " + result.message);
        }
      } catch (err) {
        console.error("Lỗi fetch hoặc parse JSON:", err);
        alert("❌ Lỗi xử lý phản hồi từ server.");
      }
    };
  }
  
  
  // Đặt cờ để biết form mới vừa mở
let justOpenedForm = false;

// Sau mỗi khi hiển thị form:
function showFormWithDelay(id) {
  const form = document.getElementById(id);
  if (form) {
    form.style.display = 'block';
    justOpenedForm = true;
    setTimeout(() => { justOpenedForm = false; }, 100); // cho phép đóng sau 100ms
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