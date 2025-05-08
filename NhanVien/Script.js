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
          filterOrders();
        });
    });
    updateCheckOutButton();
});

// Đoạn mã này sẽ được thực thi khi trang đã tải xong
function filterOrders() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const statusFilter = document.getElementById('filter-status').value;
  const tableRows = document.querySelectorAll('.order-table tbody tr');

  tableRows.forEach(row => {
    const invoiceId = row.cells[0].innerText.trim();
    const invoice = hoa_don.find(h => h.Ma_Hoa_Don === invoiceId);
    if (!invoice) return row.style.display = 'none';

    const booking = don_dat_phong.find(d => d.Ma_don_dat_phong === invoice.Ma_don_dat_phong);
    if (!booking) return row.style.display = 'none';

    const dates = ['Ngay_dat', 'Ngay_nhan', 'Ngay_tra']
      .map(field => new Date(booking[field]))
      .filter(d => !isNaN(d.getTime()));

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const isInRange = dates.some(date => (!start || date >= start) && (!end || date <= end));
    const matchStatus = !statusFilter || booking.Trang_thai === statusFilter;

    row.style.display = (isInRange && matchStatus) ? '' : 'none';
  });
}

function initOrderTab() {
  fetchAllDataOrder();  // Gọi lại API để tải dữ liệu
  bindOrderFilterEvents(); // Gắn lại sự kiện lọc (nếu chưa có)
}
  
  document.addEventListener('click', function(e) {
    const statusBar = document.getElementById('status-bar');
    // Kiểm tra nếu click nằm trong #status-bar nhưng KHÔNG phải vào <span>
    if (statusBar.contains(e.target) && e.target.tagName !== 'SPAN') {
      renderHotelLayout();
    }
  });
  document.addEventListener('click', function(e) {
    const order = document.getElementById('orderHeader');
    if (!order.contains(e.target)) {
      document.getElementById('filter-status').value = "";
      renderOrderTable();
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
  function bindOrderFilterEvents() {
    const select = document.getElementById('filter-status');
    if (!select.dataset.bound) {
      select.addEventListener("change", filterOrders);
      select.dataset.bound = "true"; // đánh dấu đã gắn rồi, không gắn lại lần nữa
    }
  
    const start = document.getElementById('start-date');
    const end = document.getElementById('end-date');
  
    if (!start.dataset.bound) {
      start.addEventListener("change", filterOrders);
      start.dataset.bound = "true";
    }
    if (!end.dataset.bound) {
      end.addEventListener("change", filterOrders);
      end.dataset.bound = "true";
    }
  }
  async function initHotelTab() {
    await fetchAllDataRoom();
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
  }
  