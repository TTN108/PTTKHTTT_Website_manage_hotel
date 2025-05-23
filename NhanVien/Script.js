window.addEventListener("DOMContentLoaded", () => {
    fetch('ConnectWithDatabase/capnhat_trangthai_quahan.php')
        .then(res => res.json())
        .then(data => {
            console.log("Cập nhật trạng thái quá hạn:", data.message);
        })
        .catch(err => {
            console.error("Lỗi khi cập nhật trạng thái:", err);
        });
});
document.addEventListener('DOMContentLoaded', async function() {
    // Gọi hàm fetchAllDataRoom khi trang đã tải xong
    await renderRoom(); // Gọi hàm fetchAllData khi trang đã tải xong
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
    console.log(nhan_vien);
    bindStatusBarFilters();
});
setInterval(updateCheckOutButton, 21000);
function bindStatusBarFilters() {
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
}
// Đoạn mã này sẽ được thực thi khi trang đã tải xong
function filterOrders() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const statusFilter = document.getElementById('filter-status').value;
  const tableRows = document.querySelectorAll('.order-table tbody tr');

  function normalize(date) {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const start = startDate ? normalize(new Date(startDate)) : null;
  const end = endDate ? normalize(new Date(endDate)) : null;

  tableRows.forEach(row => {
    const bookingId = row.cells[0].innerText.trim(); // dùng bookingId vì đây là mã đơn
    const booking = don_dat_phong.find(d => d.Ma_don_dat_phong === bookingId);
    if (!booking) return row.style.display = 'none';

    const invoice = hoa_don.find(h => h.Ma_don_dat_phong === booking.Ma_don_dat_phong);

    const dates = ['Ngay_dat', 'Ngay_nhan', 'Ngay_tra']
      .map(field => normalize(new Date(booking[field])))
      .filter(d => !isNaN(d.getTime()));

    const isInRange = dates.some(date =>
      (!start || date >= start) && (!end || date <= end)
    );

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