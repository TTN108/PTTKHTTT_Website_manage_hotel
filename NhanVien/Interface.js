 // Lưu trữ room hiện hành khi thực hiện checkin hoặc checkout

 const hotelLink = document.getElementById('hotelLink');
 const orderLink = document.getElementById('orderLink');
 const hotelLayout = document.getElementById('hotelLayout');
 const orderContent = document.getElementById('orderContent');
 const statusBar = document.getElementById('status-bar');
 const chartLink = document.getElementById("chartLink");
const barchart = document.getElementById("chart");
    barchart.style.display = 'none';
    // Hiển thị mặc định Sơ đồ khách sạn
    hotelLayout.style.display = 'block';
    statusBar.style.display = 'flex';
    orderContent.style.display = 'none';
 
 // Sự kiện chuyển đổi giao diện
 hotelLink.addEventListener('click', function(e) {
   e.preventDefault();
   hotelLayout.style.display = 'block';
   statusBar.style.display = 'flex';
   orderContent.style.display = 'none';
   barchart.style.display = 'none';
   initHotelTab();
 });
 chartLink.addEventListener('click', function(e) {
    e.preventDefault();
    hotelLayout.style.display = 'none';
    statusBar.style.display = 'none';
    orderContent.style.display = 'none';
    barchart.style.display = 'block';
 });
 orderLink.addEventListener('click', function(e) {
   e.preventDefault();
   hotelLayout.style.display = 'none';
   statusBar.style.display = 'none';
   orderContent.style.display = 'block';
   barchart.style.display = 'none';
   initOrderTab();
 });

 
 // Sự kiện cho nút "Hủy" trong các form
 document.querySelectorAll('.cancel').forEach(button => {
   button.addEventListener('click', function(e) {
     closeForms();
     e.stopPropagation();
   });
 });
    document.getElementById("back-to-booking-list").addEventListener("click", function () {
      document.getElementById("form-checkin").style.display = "none";
      document.getElementById("booking-list-modal").style.display = "block";
    });