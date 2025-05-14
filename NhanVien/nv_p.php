<?php
  session_start();
?>

<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <title>Sơ đồ khách sạn</title>
  <link rel="stylesheet" href="./nv.css">
  <link rel="stylesheet" href="./form.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
</head>

<body>
  <form class="login-container" onsubmit="return check_login()" method="get" action="handle/login.php">
    <div class="background-image">
      <div class="login-form">
        <h2>Login</h2>
        <input type="text" id="username" name="username" placeholder="Username">
        <input type="password" id="password" name="password" placeholder="Password">
        <button type="submit">Submit</button>
      </div>
    </div>
  </form>
  <!-- Sidebar -->
  <div class="sidebar">
    <a href="#" id="hotelLink" onclick="renderHotelLayout()">Sơ đồ khách sạn</a>
    <a href="#" id="orderLink" onclick="renderOrderTable()">Đơn hàng</a>
    <a href="#" id="chartLink" onclick="filterChart();">Thống kê</a>
  </div>
  <!-- Header -->
  <div class="header-bar">
    <div class="header">
      <div class="logo">VNSTT</div>
      <a href="handle/logout.php" class="logout">Logout</a>
    </div>

    <!-- Thanh trạng thái -->
    <div class="status-bar" id="status-bar">
      <div class="status-item status-free">0 <span>Trống</span></div>
      <div class="status-item status-occupied">0 <span>Đang ở</span></div>
      <div class="status-item status-cleaning">0 <span>Chưa dọn</span></div>
      <div class="status-item status-standard">0 Phòng <span>standard</span></div>
      <div class="status-item status-deluxe">0 Phòng <span>deluxe</span></div>
    </div>
  </div>
  <div class="chart" id="chart">
    <div class="order-header" id="chart-header">
      <label for="start-date">Ngày</label>
      <input type="date" id="start-date" />
      <span>đến</span>
      <label for="end-date"></label>
      <input type="date" id="end-date" />
      <button onclick="filterChart()">Lọc thống kê</button>
      <button onclick="resetFilter()">Reset</button>
    </div>
    <canvas id="myChart"></canvas>
  </div>
  <!-- Sơ đồ khách sạn -->
  <div class="hotel-layout" id="hotelLayout">
    <div style="display:flex">
      <button class="btn-checkin" id="nhanPhongBtn">Nhận phòng</button>
      <button id="checkOutBtn" disabled>Trả phòng</button>
    </div>
    <div id="hotel-wrapper">
      <?php
      include_once 'layout/Room.php';
      ?>
    </div>
  </div>
  <div class="order-content" id="orderContent">
    <!-- Thanh chọn ngày -->
    <div class="order-header" id="orderHeader">
      <label for="start-date">Ngày</label>
      <input type="date" id="start-date" />
      <span>đến</span>
      <label for="end-date"></label>
      <input type="date" id="end-date" />
      <select id="filter-status">
            <option value="">Tất cả</option>
            <option value="Chưa xác nhận">Chưa xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đã nhận phòng">Đã nhận phòng</option>
            <option value="Đã trả phòng">Đã trả phòng</option>
            <option value="Đã huỷ">Đã huỷ</options>
            <option value="Quá hạn">Quá hạn</options>
          </select>
    </div>

    <!-- Bảng đơn hàng -->
    <table class="order-table">
      <thead>
        <tr>
          <th>Mã đơn đặt phòng</th>
          <th>Mã khách hàng</th>
          <th>Mã loại phòng</th>
          <th>Trạng thái</th>
          <th>Tính năng</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
    <!-- Danh sách các phiếu đặt phòng chưa nhận phòng -->
<div id="booking-list-modal" style="display:none;">
  <h3>Chọn Phiếu Đặt Phòng</h3>
  <ul id="booking-list"></ul>
</div>

<div id="form-checkin" style="display:none;">
  <h3>Chọn Phòng Cho Phiếu: <span id="current-booking-id"></span></h3>
  <div id="available-rooms"></div>
  <button type="button" id="back-to-booking-list">Quay lại</button>
  <button id="confirm-assign-room">Xác nhận</button>
</div>
<!-- Form nhập dữ liệu đơn đặt phòng mới -->
<div id="form-new-booking-step1">
  <h3>Thêm đơn đặt phòng mới</h3>
  <form id="manual-booking-data">
    <label>CCCD:</label>
    <input type="text" name="CCCD" required><br>

    <label>Username:</label>
    <input type="text" name="username" required><br>

    <!-- Thông tin khách mới -->
    <div id="new-customer-fields" style="display:none;">
      <label>Họ tên khách:</label>
      <input type="text" name="Ten_khach"><br>

      <label>Password:</label>
      <input type="text" name="password"><br>

      <label>Email:</label>
      <input type="text" name="email"><br>

      <label>Số điện thoại:</label>
      <input type="text" name="phone"><br>

      <label>Địa chỉ:</label>
      <input type="text" name="address"><br>
    </div>

    <label>Số lượng phòng:</label>
    <input type="number" name="So_luong_phong" min="1" required><br>

    <label>Số lượng người:</label>
    <input type="number" name="So_luong_nguoi" min="1" required><br>

    <label>Ngày trả:</label>
    <input type="date" name="Ngay_tra" required><br>

    <label>Loại phòng:</label>
    <select name="Ma_loai_phong" id="select-room-type" required></select><br>

    <button type="button" id="to-step2">Tiếp theo</button>
  </form>
</div>
<!-- Form Trả phòng -->
    <div class="form-container-out" id="checkout-form">
        <h2>Hóa đơn phòng 401</h2>
        <p>Khách hàng: Trần Trọng Nghĩa</p>
        <p>Mã HD: HD001</p>
        <p>Vào lúc: 8:57 27/2/2025</p>
        <p>Trả lúc: 9:02 28/2/2025</p>
        <p>Loại phòng: Phòng standard</p>
        <p>Giá: 500,000</p>
        <hr>
        <p>Tiền phòng: 500,000</p>
        <p>1 ngày (8:57 27/2/2025 - 9:02 28/2/2025)</p>
        <p>Thanh toán: 500,000</p>
        <label>Trạng thái:</label>
        <select id="object-room" name="object-room">
            <option></option>
            <option></option>
        </select>
        <button class="confirm">Trả phòng</button>
    </div>
    <div class="form-empty-room" id="form-empty-room">
        <p>Danh sách phòng trống</p>
        <div class="empty">
          <div class="form-room">
            
          </div>
        </div>
    </div>
<!-- Bước 2: Chọn phòng và xác nhận -->
<div id="form-new-booking-step2">
  <h3>Chọn phòng phù hợp</h3>    
   Số lượng phòng:<span id="room-quantity-display"></span>
  <div id="available-rooms-manual"></div>
  <button type="button" id="back-to-step1">Quay lại</button>
  <button id="confirm-manual-booking">Xác nhận</button>
</div>

<div id="checkout-list" style="display:none;">
  <h3>Chọn Phiếu Đặt Phòng Cần Trả</h3>
  <ul id="checkout-booking-list"></ul>
</div>
<div id="form-checkout" style="display:none;">
  <h3>Trả phòng cho đơn: <span id="checkout-ma-dat"></span></h3>
  <div id="checkout-room-section">
    <!-- Danh sách phòng và đồ dùng tương ứng -->
  </div>

  <p id="total-display">Tổng tiền: 0 VNĐ</p>
  <button id="confirm-checkout">Xác nhận trả phòng</button>
</div>

  <script>
    const currentUsername = "<?php echo $_SESSION['user']; ?>";
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="./ConnectWithDatabase/RenderRoom.js"></script>
  <script src="./ConnectWithDatabase/RenderOrderTable.js"></script>
  <script src="./Interface.js"></script>
  <script src="Script.js"></script>
  <?php
  if (@$_SESSION['user']) {
    echo "<script>
    document.getElementsByClassName('login-container')[0].style.display = 'none';
    document.getElementsByClassName('header-bar')[0].style.display = 'block';
    document.getElementsByClassName('sidebar')[0].style.display = 'block';
    document.getElementsByClassName('hotel-layout')[0].style.display = 'block';
    document.getElementById('hotelLayout').style.display = 'block';
    </script>";
  } else {
    echo "<script>
    document.getElementsByClassName('login-container')[0].style.display = 'flex';
    document.getElementsByClassName('header-bar')[0].style.display = 'none';
    document.getElementsByClassName('sidebar')[0].style.display = 'none';
    document.getElementsByClassName('hotel-layout')[0].style.display = 'none';
    document.getElementById('hotelLayout').style.display = 'none';
    </script>";
  }
  $con = mysqli_connect("localhost", "root", "", "hotel");
  $acc = array();
  $pass = array();
  $job = array();
  $sql = "SELECT account.Username, account.Password, nhan_vien.Chuc_vu FROM account, nhan_vien WHERE account.Username = nhan_vien.Account";
  $res = mysqli_query($con, $sql);
  while ($row = mysqli_fetch_array($res)) {
    $acc[] = $row[0];
    $pass[] = $row[1];
    $job[] = $row[2];
  }
  mysqli_close($con);
  ?>
  <script>
    let chartInstance = null;

function renderChartBar(filteredData) {
  const ctx = document.getElementById('myChart').getContext('2d');
  const labels = filteredData.map(d => d.label);
  const deluxe = filteredData.map(d => d.Deluxe);
  const standard = filteredData.map(d => d.Standard);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Standard',
          data: standard,
          backgroundColor: '#4CAF50'
        },
        {
          label: 'Deluxe',
          data: deluxe,
          backgroundColor: '#FF9800'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Tổng tiền (VND)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Ngày trả phòng'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y.toLocaleString('vi-VN') + ' VND';
            }
          }
        }
      }
    }
  });
}

function resetFilter() {
  document.getElementById('start-date').value = '';
  document.getElementById('end-date').value = '';
  filterChart();
}

function filterChart() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  const results = {};

  hoa_don.forEach(hd => {
    const booking = don_dat_phong.find(d => d.Ma_don_dat_phong === hd.Ma_don_dat_phong);
    if (!booking || booking.Trang_thai !== 'Đã trả phòng') return;
    console.log(hd);
    const ngayTra = booking.Ngay_tra;

    // Lọc theo khoảng thời gian
    if ((!startDate || ngayTra >= startDate) && (!endDate || ngayTra <= endDate)) {
      if (!results[ngayTra]) {
        results[ngayTra] = { Standard: 0, Deluxe: 0 };
      }

      const danhSachPhong = chi_tiet_hoa_don.filter(p => p.Ma_Hoa_Don === hd.Ma_Hoa_Don);

      danhSachPhong.forEach(p => {
        const phongData = phong.find(ph => ph.ID === p.Ma_phong);
        const loai = phongData ? loai_phong.find(lp => lp.Ma_Loai_Phong === phongData.Ma_Loai_Phong) : null;
        const giaPhong = loai ? Number(loai.Gia) : 0;

        let tongGia = giaPhong;

        const doDungChiTiet = chi_tiet_phong_hoa_don.filter(item =>
          item.Ma_Hoa_Don === hd.Ma_Hoa_Don && item.Ma_phong === p.Ma_phong
        );

        doDungChiTiet.forEach(dd => {
          const doDung = do_dung.find(d => d.Ma_Do_Dung === dd.Ma_do_dung);
          const giaDung = doDung ? Number(doDung.Gia) : 0;
          tongGia += giaDung;
        });
        console.log(tongGia);
        if (loai) {
          const tenLoai = loai.Ten_loai.toLowerCase();
          if (tenLoai === 'standard') {
            results[ngayTra].Standard += tongGia;
          } else if (tenLoai === 'deluxe') {
            results[ngayTra].Deluxe += tongGia;
          }
        }
      });
    }
  });
  console.log(results);
  const chartData = Object.entries(results).map(([label, obj]) => ({
    label,
    Standard: obj.Standard,
    Deluxe: obj.Deluxe
  }));
  chartData.sort((a, b) => new Date(a.label) - new Date(b.label));
  renderChartBar(chartData);
}

window.addEventListener('DOMContentLoaded', () => {
  const checkReady = setInterval(() => {
    if (
      hoa_don?.length &&
      don_dat_phong?.length &&
      phong?.length &&
      loai_phong?.length &&
      chi_tiet_hoa_don?.length &&
      chi_tiet_phong_hoa_don?.length &&
      do_dung?.length
    ) {
      clearInterval(checkReady);
      filterChart();
    }
  }, 100);
});

    //const chart = new Chart(document.getElementById('myChart'), config);
  </script>
</body>

</html>