// // 1. Khai báo global arrays
async function fetchAllDataOrder() {
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
    document.getElementById('search-input').value = '';
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
        filterOrders();
        renderOrderTable();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }
}

function renderOrderTable() {
  const tbody = document.querySelector('.order-table tbody');
  tbody.innerHTML = '';

  don_dat_phong.forEach(booking => {
    const invoice = hoa_don.find(h => h.Ma_don_dat_phong === booking.Ma_don_dat_phong);
    const customer = khach_hang.find(k => k.Account === booking.Account);
    const trangThai = booking.Trang_thai;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${booking.Ma_don_dat_phong}</td>
      <td>${customer ? customer.Ten : 'Không rõ'}</td>
      <td>${booking.Ma_Loai_Phong}</td>
      <td>${trangThai}</td>
      <td>
        ${trangThai === 'Chưa xác nhận'
          ? `<a href="#" class="them-btn" data-invoice-id="${booking.Ma_don_dat_phong}">Xác nhận</a>` : ''}
        ${(trangThai === 'Chưa xác nhận' || trangThai === 'Đã xác nhận') 
          ? `<a href="#" class="delete-btn" data-invoice-id="${booking.Ma_don_dat_phong}">Xóa</a>` : ''}
        ${(trangThai === 'Đã trả phòng' || trangThai === 'Đã nhận phòng') 
          ? `<a href="#" class="detail-btn" data-invoice-id="${booking.Ma_don_dat_phong}">Chi tiết</a>` : ''}
        ${trangThai === 'Đã trả phòng' 
          ? `<a href="#" class="print-btn" data-invoice-id="${booking.Ma_don_dat_phong}">In</a>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Chi tiết
  tbody.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showOrderDetail(btn.dataset.invoiceId);
    });
  });

  // Xác nhận
  tbody.querySelectorAll('.them-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const bookingId = btn.dataset.invoiceId;
      const booking = don_dat_phong.find(d => d.Ma_don_dat_phong === bookingId);

      if (booking && booking.Trang_thai === 'Chưa xác nhận') {
        if (confirm("Xác nhận đơn đặt phòng này?")) {
          booking.Trang_thai = 'Đã xác nhận';
          renderOrderTable();

          // Gửi yêu cầu cập nhật database
          await fetch('ConnectWithDatabase/update_booking_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Ma_don_dat_phong: booking.Ma_don_dat_phong,
              Trang_thai: 'Đã xác nhận'
            })
          });
        }
      }
    });
  });

  // Xóa
  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const invoiceId = btn.dataset.invoiceId;
      const booking = don_dat_phong.find(d => d.Ma_don_dat_phong === invoiceId);
      if (booking && (booking.Trang_thai === 'Chưa xác nhận' || booking.Trang_thai === 'Đã xác nhận')) {
        if (confirm("Bạn có chắc muốn xóa hóa đơn đặt phòng này?")) {
          // Xóa trong mảng JS
          const idx = don_dat_phong.findIndex(h => h.Ma_don_dat_phong === invoiceId);
          if (idx > -1) don_dat_phong.splice(idx, 1);

          renderOrderTable();

          // Gửi yêu cầu xóa từ database
          await fetch('ConnectWithDatabase/delete_invoice_and_detail.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Ma_don_dat_phong: invoiceId
            })
          });
        }
      }
    });
  });
  tbody.querySelectorAll('.print-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    generatePDF(btn.dataset.invoiceId);
  });
});
}

// Đoạn mã này sẽ được thực thi khi trang đã tải xong
function filterOrders() {
  const searchValue = document.getElementById('search-input').value.trim().toLowerCase();
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
    const customer = khach_hang.find(k => k.Account === booking.Account);
    const customerName = customer?.Ten?.toLowerCase() || '';
    const matchSearch =
    !searchValue ||
    booking.Ma_don_dat_phong.toLowerCase().includes(searchValue) ||
    booking.Ma_Loai_Phong.toLowerCase().includes(searchValue) ||
    customerName.includes(searchValue);

    const matchStatus = !statusFilter || booking.Trang_thai === statusFilter;

    row.style.display = (isInRange && matchStatus && matchSearch) ? '' : 'none';
  });
}
document.getElementById('search-input').addEventListener('input', filterOrders);



function showOrderDetail(invoiceId) {
  console.log("showOrderDetail", invoiceId);
  const booking = don_dat_phong.find(d => d.Ma_don_dat_phong === invoiceId);
  const invoice = hoa_don.find(h => h.Ma_don_dat_phong === invoiceId);
  if (!invoice) return;
  console.log("Hoá đơn: " + invoice);
  if (!booking) return;
  console.log("Đơn đặt phòng: " + booking);
  const customer = khach_hang.find(k => k.Account === booking.Account);
  let Room = [];
  let count = 0;
  const invoiceDetail = chi_tiet_hoa_don.filter(ct => ct.Ma_Hoa_Don === invoice.Ma_Hoa_Don);
  invoiceDetail.forEach(e => {
    const room = phong.find(p => p.ID === e.Ma_phong);
    Room.push(room.ID);
    count++;
  });
  console.log("Phòng: " + Room);
  const roomType = booking ? loai_phong.find(lp => lp.Ma_Loai_Phong === booking.Ma_Loai_Phong) : null;

  // Màu header theo loại phòng
  let headerBg = '#ccc';
  if (roomType) {
    headerBg = roomType.Ma_Loai_Phong === 'LP001' ? '#ff6666'
             : roomType.Ma_Loai_Phong === 'LP002' ? '#ff9999'
             : '#ccc';
  }

  // Đồ dùng trong phòng từ bảng chi_tiet_phong_hoa_don
  const objectInRoom = chi_tiet_phong_hoa_don
    .filter(ct => ct.Ma_Hoa_Don === invoice.Ma_Hoa_Don)
    .map(ct => do_dung.find(o => o.Ma_Do_Dung === ct.Ma_do_dung))
    .filter(Boolean);

  // Tính tổng giá đồ dùng
  const objectPrice = objectInRoom.reduce((sum, obj) => Number(sum) + Number((obj.Gia || 0)), 0);
  const totalPrice = roomType ? (Number(roomType.Gia) * count  + Number(objectPrice)) : objectPrice;
  console.log(objectInRoom);
  const status = booking.Trang_thai;
  let RoomName = "";
  let i = 0;
  do {
    RoomName += Room[i] + '\t';
    i++;
  } while ((Room.length - 1) == i);
  console.log("Tên phòng:" + RoomName)
  const form = document.getElementById('checkout-form');
  form.innerHTML = `
    <h2 style="background-color: ${headerBg};">
      Chi tiết đơn của khách ${customer ? customer.Ten : 'Không rõ'}
    </h2>
    <p>Mã hoá đơn: ${invoiceId}</p> 
    <p>Phòng: ${RoomName}</p>
    <p>Khách hàng: ${customer ? customer.Ten : 'Không rõ'}</p>
    <p>Ngày nhận phòng: ${booking.Ngay_nhan}</p>
    <p>Ngày trả phòng: ${booking.Ngay_tra || 'Chưa cập nhật'}</p>
    <p>Loại phòng: ${roomType ? roomType.Ten_loai : ''}</p>
    <p>Giá: ${roomType ? roomType.Gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''}</p>
    <hr>
    <p>Tổng tiền: ${totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
    <p>Trạng thái: ${status}</p>
    <div id="object-room" name="object-room">
      ${objectInRoom.map(o => `
        <div style="display: flex; align-items: center;">
          <span>${o.Ten}</span>
        </div>
      `).join('')}
    </div>
    <button class="cancel">Đóng</button>
  `;

  document.querySelector('.form-container-out').style.display = 'block';
  form.querySelector('.cancel').onclick = () => {
    document.querySelector('.form-container-out').style.display = 'none';
  };
}



document.addEventListener('DOMContentLoaded', fetchAllDataOrder);
defaultStyle: {
  font: 'Roboto'
}
function generatePDF(invoiceId) {
  const booking = don_dat_phong.find(d => d.Ma_don_dat_phong === invoiceId);
  const invoice = hoa_don.find(h => h.Ma_don_dat_phong === invoiceId);
  if (!booking || !invoice) {
    alert("Không tìm thấy hóa đơn.");
    return;
  }

  const customer = khach_hang.find(k => k.Account === booking.Account);
  const invoiceDetail = chi_tiet_hoa_don.filter(ct => ct.Ma_Hoa_Don === invoice.Ma_Hoa_Don);
  const roomType = loai_phong.find(lp => lp.Ma_Loai_Phong === booking.Ma_Loai_Phong);
  const objectInRoom = chi_tiet_phong_hoa_don
    .filter(ct => ct.Ma_Hoa_Don === invoice.Ma_Hoa_Don)
    .map(ct => do_dung.find(o => o.Ma_Do_Dung === ct.Ma_do_dung))
    .filter(Boolean);

  const objectPrice = objectInRoom.reduce((sum, obj) => sum + Number(obj.Gia || 0), 0);
  const totalPrice = roomType ? (Number(roomType.Gia) * invoiceDetail.length + objectPrice) : objectPrice;
  const roomList = invoiceDetail.map(d => d.Ma_phong).join(', ');

  const docDefinition = {
    content: [
      { text: 'HÓA ĐƠN THANH TOÁN', style: 'header', alignment: 'center' },
      {
        table: {
          widths: ['auto', '*'],
          body: [
            ['Mã hóa đơn:', invoice.Ma_Hoa_Don],
            ['Khách hàng:', customer?.Ten || 'Không rõ'],
            ['Phòng:', roomList],
            ['Ngày nhận:', booking.Ngay_nhan],
            ['Ngày trả:', booking.Ngay_tra],
            ['Loại phòng:', roomType?.Ten_loai || ''],
            ['Giá phòng / đêm:', roomType ? `${roomType.Gia.toLocaleString('vi-VN')} VND` : '']
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 10]
      },
      { text: 'Đồ dùng sử dụng:', style: 'subheader' },
      objectInRoom.length > 0 ? {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            ['STT', 'Tên đồ dùng', 'Số lượng', 'Đơn giá', 'Thành tiền'],
            ...objectInRoom.map((obj, index) => [
              index + 1,
              obj.Ten,
              1,
              `${Number(obj.Gia).toLocaleString('vi-VN')} VND`,
              `${Number(obj.Gia).toLocaleString('vi-VN')} VND`
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 10]
      } : { text: 'Không sử dụng đồ dùng nào.' },
      {
        text: `Tổng tiền: ${totalPrice.toLocaleString('vi-VN')} VND`,
        style: 'total',
        margin: [0, 15, 0, 5]
      },
      {
        text: `Trạng thái: ${booking.Trang_thai}`,
        italics: true
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 4]
      },
      total: {
        fontSize: 13,
        bold: true
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  pdfMake.createPdf(docDefinition).download(`HoaDon_${invoice.Ma_Hoa_Don}.pdf`);
}