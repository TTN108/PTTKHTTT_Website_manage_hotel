document.addEventListener('DOMContentLoaded', async function() {
    // Gọi hàm fetchAllDataRoom khi trang đã tải xong
    await fetchAllDataRoom(); // Gọi hàm fetchAllData khi trang đã tải xong
    document.getElementById('start-date').addEventListener('change',filterOrders);
    document.getElementById('end-date').addEventListener('change',filterOrders);
    filterOrders();
    console.log("Đã tải xong trang và gọi hàm fetchAllDataRoom()");
    console.log(khach_hang);
    console.log(hoa_don);
    console.log(phong);
    console.log(loai_phong);
    console.log(do_dung);
    console.log(chi_tiet_phong);
    checkForCheckOut();
    document.querySelectorAll('#status-bar .status-item').forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          let filterType = '';
          if (this.classList.contains('status-free')) {
            filterType = 'Trống';
          } else if (this.classList.contains('status-occupied')) {
            filterType = 'Có người ở';
          } else if (this.classList.contains('status-cleaning')) {
            filterType = 'Đang dọn dẹp';
          } else if (this.classList.contains('status-standard')) {
            filterType = 'Standard';
          } else if (this.classList.contains('status-deluxe')) {
            filterType = 'Deluxe';
          }
          filterHotelLayout(filterType);
        });
    });
});

// Đoạn mã này sẽ được thực thi khi trang đã tải xong
function filterOrders() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const tableRows = document.querySelectorAll('.order-table tbody tr');

  tableRows.forEach(row => {
    const invoiceId = row.cells[0].innerText.trim();
    const invoice = hoa_don.find(h => h.Ma_Hoa_Don === invoiceId);

    if (!invoice) {
      row.style.display = 'none';
      return;
    }

    const booking = don_dat_phong.find(d => d.Ma_don_dat_phong === invoice.Ma_don_dat_phong);
    if (!booking) {
      row.style.display = 'none';
      return;
    }

    const dates = ['Ngay_dat', 'Ngay_nhan', 'Ngay_tra']
      .map(field => new Date(booking[field]))
      .filter(d => !isNaN(d.getTime())); // Loại bỏ giá trị không hợp lệ

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const isInRange = dates.some(date => {
      return (!start || date >= start) && (!end || date <= end);
    });

    row.style.display = isInRange ? '' : 'none';
  });
}

  
  document.addEventListener('click', function(e) {
    const statusBar = document.getElementById('status-bar');
  
    // Kiểm tra nếu click nằm trong #status-bar nhưng KHÔNG phải vào <span>
    if (statusBar.contains(e.target) && e.target.tagName !== 'SPAN') {
      renderHotelLayout();
    }
  });
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
  // function handleCheckInConfirm() {
  //   // Lấy dữ liệu từ các input trong form
  //   const name = document.getElementById('customer-name').value;
  //   const idCard = document.getElementById('customer-idcard').value;
  //   const email = document.getElementById('customer-email').value;
  //   const phone = document.getElementById('customer-phone').value;
  //   const nationality = document.getElementById('customer-address').value;
  
  //   // Ví dụ: tạo mới đối tượng khách hàng và thêm vào mảng customers trong data.js
  //   const newCustomer = {
  //     idCard: idCard,
  //     name: name,
  //     phone: phone,
  //     email: email,
  //     address: '', // có thể cập nhật thêm nếu cần
  //     accountId: 'ACC' + (customers.length + 1).toString().padStart(3, '0')
  //   };
  //   customers.push(newCustomer);
    
  //   // Giả sử đặt phòng: cập nhật trạng thái của phòng được chọn (currentRoom) thành 'occupied'
  //   if (currentRoom) {
  //     currentRoom.status = 'occupied';
  //     // Tạo một hóa đơn mới (có thể tính toán check-in date, amount, ...)
  //     const newInvoice = {
  //       invoiceId: 'HD' + (invoices.length + 1).toString().padStart(3, '0'),
  //       roomId: currentRoom.roomId,
  //       idCard: idCard,
  //       checkInDate: new Date().toLocaleString(),
  //       checkOutDate: '', // sẽ cập nhật sau khi trả phòng
  //       amount: currentRoom.price
  //     };
  //     invoices.push(newInvoice);
  //   }
  
  //   // Đóng form và cập nhật lại giao diện
  //   closeForms();
  //   renderHotelLayout();
  // }
  