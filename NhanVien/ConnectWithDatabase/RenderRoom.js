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
        // Gọi render hoặc xử lý logic tiếp
        renderHotelLayout();

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
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
// function renderHotelLayout() {
//     console.log(hoa_don);
//     const hotelLayout = document.getElementById('hotel-wrapper');
//     hotelLayout.innerHTML = ''; // Xóa nội dung cũ

//     // Nhóm phòng theo tầng (dựa vào chữ số đầu tiên trong ID sau chữ cái, ví dụ: P101 -> tầng 1)
//     const floors = {};
//     phong.forEach(room => {
//         const idMatch = room.ID.match(/\d+/); // lấy số trong ID
//         const floorNum = idMatch ? idMatch[0][1] : '0'; // lấy chữ số đầu tiên
//         if (!floors[floorNum]) {
//             floors[floorNum] = [];
//         }
//         floors[floorNum].push(room);
//     });

//     Object.keys(floors).sort().forEach(floorNum => {
//         const floorDiv = document.createElement('div');
//         floorDiv.classList.add('floor');

//         const roomRow = document.createElement('div');
//         roomRow.classList.add('room-row');

//         const floorTitle = document.createElement('div');
//         floorTitle.classList.add('floor-title');
//         floorTitle.innerHTML = `<p>Floor ${floorNum}</p>`;
//         roomRow.appendChild(floorTitle);

//         const roomContainer = document.createElement('div');
//         roomContainer.classList.add('room-container');

//         floors[floorNum].forEach(room => {
//             const roomDiv = document.createElement('div');
//             let statusClass = room.Trang_thai === 'Trống' ? 'free'
//                 : room.Trang_thai === 'Có người ở' ? 'occupied'
//                 : room.Trang_thai === 'Đang dọn dẹp' ? 'cleaning'
//                 : '';
//             roomDiv.classList.add('room', statusClass);
//             roomDiv.innerHTML = `<div class="room-title">${room.ID}</div>`;

//             if (room.Trang_thai === 'Có người ở') {
//                 let ownerName = '';
//                 const roomDetail = chi_tiet_hoa_don.find(r => r.Ma_phong === room.ID);
//                 let hoaDonDetail = null;

//                 if (roomDetail) {
//                     hoaDonDetail = hoa_don.find(d => d.Ma_Hoa_Don === roomDetail.Ma_Hoa_Don);
//                 }

//                 if (hoaDonDetail && hoaDonDetail.Ma_don_dat_phong) {
//                     const invoice = don_dat_phong.find(inv =>
//                         inv && inv.Trang_thai === "Đã nhận phòng" &&
//                         inv.Ma_don_dat_phong === hoaDonDetail.Ma_don_dat_phong
//                     );

//                     if (invoice && invoice.Account) {
//                         const accountInfo = account.find(acc => acc.Username === invoice.Account);
//                         if (accountInfo) {
//                             const customer = khach_hang.find(cust => cust.Account === accountInfo.Username);
//                             if (customer) {
//                                 ownerName = customer.Ten;
//                             }
//                         }
//                     }
//                 }

//                 roomDiv.innerHTML += `<div class="room-owner">${ownerName}</div>`;
//             }

//             roomContainer.appendChild(roomDiv);
//         });

//         roomRow.appendChild(roomContainer);
//         floorDiv.appendChild(roomRow);
//         hotelLayout.appendChild(floorDiv);
//     });

//     updateStatusBar(phong, loai_phong); // Gọi hàm cập nhật thanh trạng thái
// }

function renderHotelLayout() {
  console.log(hoa_don);
  const hotelLayout = document.getElementById('hotel-wrapper');
  hotelLayout.innerHTML = ''; // Xóa nội dung cũ

  // Nhóm phòng theo tầng (dựa vào chữ số đầu tiên trong ID sau chữ cái, ví dụ: P101 -> tầng 1)
  const floors = {};
  phong.forEach(room => {
      const idMatch = room.ID.match(/\d+/); // lấy số trong ID
      const floorNum = idMatch ? idMatch[0][1] : '0'; // lấy chữ số đầu tiên
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

              // 🔁 Tìm tất cả chi tiết hóa đơn theo mã phòng
              const roomDetails = chi_tiet_hoa_don.filter(r => r.Ma_phong === room.ID);
              let hoaDonDetail = null;

              // 🔁 Tìm hóa đơn đầu tiên tương ứng
              for (let detail of roomDetails) {
                  const hoaDon = hoa_don.find(d => d.Ma_Hoa_Don === detail.Ma_Hoa_Don);
                  if (hoaDon) {
                      hoaDonDetail = hoaDon;
                      break;
                  }
              }

              // 🔁 Truy ngược ra tên khách hàng
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
    const roomType = loai_phong.find(lp => lp.Ma_Loai_Phong === booking.Ma_loai_phong);
    if (roomType) {
        totalAmount = roomType.Gia * booking.So_luong_phong;
    }  
    const nv = nhan_vien.find(nv => nv.Account === currentUsername);
    idNV = nv.Ma_nhan_vien;
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
          document.querySelector('#form-checkin').style.display = 'none';
          document.querySelector('#form-new-booking').style.display = 'none';
          await fetchAllDataRoom();
          updateCheckOutButton();
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
    const form = document.querySelector('#form-new-booking');
    const roomTypeSelect = form.querySelector('#select-room-type');
    const newCustomerFields = form.querySelector('#new-customer-fields');
    const inputCCCD = form.querySelector('input[name="CCCD"]');
    const inputUsername = form.querySelector('input[name="username"]');
    let selectedRooms = [];

    // Reset
    roomTypeSelect.innerHTML = '';
    loai_phong.forEach((lp, index) => {
      const opt = document.createElement('option');
      opt.value = lp.Ma_Loai_Phong;
      opt.textContent = lp.Ten_loai;
      if (index === 0) opt.selected = true;
      roomTypeSelect.appendChild(opt);
    });

    showFormWithDelay('form-new-booking');
    form.style.display = 'block';
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
            const quantity = parseInt(form.querySelector('input[name="So_luong_phong"]').value);
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

    // ✅ Kiểm tra xem CCCD và username có tồn tại không
    function checkExistingUser() {
        const cccd = inputCCCD.value.trim();
        const username = inputUsername.value.trim();
        const kh = khach_hang.find(kh => kh.CCCD === cccd);
        const acc = account.find(acc => acc.Username === username);
      
        if (!cccd || !username) {
          newCustomerFields.style.display = 'none';
          return;
        }
      
        if (kh && acc) {
          if (kh.Account === acc.Username) {
            // CCCD và Username thuộc cùng người => ẩn form nhập thông tin mới
            newCustomerFields.style.display = 'none';
          } else {
            // Trùng nhưng không cùng người
            alert("⚠️ CCCD và Username không thuộc cùng một người!");
            newCustomerFields.style.display = 'none';
          }
        } else if (!kh && !acc) {
          // Cả hai đều mới => hiển thị form nhập thông tin khách
          newCustomerFields.style.display = 'block';
        } else {
          // Một trong hai đã tồn tại => không được nhập thêm thông tin mới
          newCustomerFields.style.display = 'none';
        }
    }

    // ✅ Gắn sự kiện kiểm tra mỗi khi thay đổi CCCD hoặc username
    inputCCCD.addEventListener('input', checkExistingUser);
    inputUsername.addEventListener('input', checkExistingUser);

  
    form.querySelector('#confirm-manual-booking').addEventListener('click', async () => {
      const data = new FormData(form.querySelector('form'));
  
      const cccd = data.get('CCCD');
      const username = data.get('username');
      const isCCCDExist = khach_hang.some(kh => kh.CCCD === cccd);
      const isUsernameExist = account.some(acc => acc.Username === username);
  
      const customerName = data.get('Ten_khach');
      const password = data.get('password');
      const email = data.get('email');
      const phone = data.get('phone');
      const address = data.get('address');
      const quantity = parseInt(data.get('So_luong_phong'));
      const people = parseInt(data.get('So_luong_nguoi'));
      const ngayTra = data.get('Ngay_tra');
      const maLoaiPhong = data.get('Ma_loai_phong');
  
      if (!cccd || !username || !ngayTra || !maLoaiPhong) {
        alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
        return;
      }
  
      if (!isCCCDExist && !isUsernameExist) {
        if (!customerName || !password || !email || !phone || !address) {
          alert('Vui lòng nhập đầy đủ thông tin khách hàng!');
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
      }
  
      const now = new Date();
      now.setHours(0, 0, 0, 0);  // Đặt giờ về 00:00:00

      const dateNgayTra = new Date(ngayTra);
      dateNgayTra.setHours(0, 0, 0, 0);

      if (dateNgayTra < now) {
        alert('Ngày trả không thể trước hôm nay!');
        return;
      }
  
      if (selectedRooms.length !== quantity) {
        alert('Số lượng phòng chưa đủ');
        return;
      }
  
      const ngayDat = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const ngayNhan = ngayDat;
  
      let Account = { Username: username };
      let khachHang = { CCCD: cccd };
      if (!isUsernameExist && !isCCCDExist) {
        Account = {
          Username: username,
          Password: password,
          Email: email,
          Status: 'Hoạt động'
        };
        account.push(Account);
  
        khachHang = {
          CCCD: cccd,
          Ten: customerName,
          SDT: phone,
          Dia_chi: address,
          Account: Account.Username
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
        Trang_thai: 'Đã nhận phòng'
      };
      don_dat_phong.push(donDat);
  
      let total = 0.0;
      selectedRooms.forEach(roomID => {
        const room = phong.find(p => p.ID === roomID);
        const roomType = loai_phong.find(rt => rt.Ma_Loai_Phong === room.Ma_Loai_Phong);
        total += roomType.Gia;
      });
      const nv = nhan_vien.find(nv => nv.Account === currentUsername);
      idNV = nv.Ma_nhan_vien;
      try {
        const res = await fetch('ConnectWithDatabase/insert_checkin.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            account: isUsernameExist ? null : Account,
            customer: isCCCDExist ? null : khachHang,
            booking: donDat,
            phong: selectedRooms,
            Gia: total,
            Ma_nhan_vien: idNV
          })
        });
        const result = await res.json();
        if (result.success) {
          alert("✅ Đã nhận phòng thành công.");
          form.querySelectorAll('input, select').forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = false;
            } else {
              input.value = '';
            }
          });
          
          // Ẩn vùng nhập thông tin khách hàng mới
          newCustomerFields.style.display = 'none';
          
          // Xoá vùng chọn phòng (nếu có)
          const manualRoomContainer = form.querySelector('#available-rooms-manual');
          if (manualRoomContainer) manualRoomContainer.innerHTML = '';
          
          // Xoá các nút phòng đã chọn
          form.querySelectorAll('.room-button.selected').forEach(btn => btn.classList.remove('selected'));
          selectedRooms = [];
          form.style.display = 'none';
          await fetchAllDataRoom();
          updateCheckOutButton();
        } else {
          alert("❌ Có lỗi khi lưu: " + result.message);
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
        return due < today && hoa_don.some(h => h.Ma_don_dat_phong === p.Ma_don_dat_phong);
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
          }, 12000);
      });

      fetchAllDataRoom(); // load lại dữ liệu phòng
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
                await fetchAllDataRoom();
                updateCheckOutButton()
                updateStatusBar(phong, loai_phong);
                const index = bookings.findIndex(b => b.Ma_don_dat_phong === booking.Ma_don_dat_phong);
                if (index !== -1) bookings.splice(index, 1); // Xóa đơn vừa xử lý

                // ➕ Nếu vẫn còn đơn, hiển thị lại danh sách
                if (bookings.length > 0) {
                  document.getElementById("checkout-list").style.display = "block";
                  showCheckOutList(bookings);
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
                          await fetchAllDataRoom(); // Refresh lại danh sách phòng
                          updateCheckOutButton()
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

function updateCheckOutButton() {
  const today = new Date();
  const btn = document.getElementById("checkOutBtn");

  const validBookings = don_dat_phong.filter(d => {
    if (d.Trang_thai !== "Đã nhận phòng") return false;
    const ngayTra = new Date(d.Ngay_tra);
    return (
      ngayTra.getFullYear() === today.getFullYear() &&
      ngayTra.getMonth() === today.getMonth() &&
      ngayTra.getDate() === today.getDate() &&
      hoa_don.some(h => h.Ma_don_dat_phong === d.Ma_don_dat_phong)
    );
  });
  console.log('Đơn cần trả: ' + validBookings);
  if (btn)
    btn.disabled = validBookings.length === 0;
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