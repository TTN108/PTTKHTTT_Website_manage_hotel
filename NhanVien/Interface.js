 // Lưu trữ room hiện hành khi thực hiện checkin hoặc checkout

 const hotelLink = document.getElementById('hotelLink');
 const orderLink = document.getElementById('orderLink');
 const hotelLayout = document.getElementById('hotelLayout');
 const orderContent = document.getElementById('orderContent');
 const statusBar = document.getElementById('status-bar');
 const chartLink = document.getElementById("chartLink");
const barchart = document.getElementById("chart");
    hideAllForms();
    barchart.style.display = 'none';
    // Hiển thị mặc định Sơ đồ khách sạn
    hotelLayout.style.display = 'block';
    statusBar.style.display = 'flex';
    orderContent.style.display = 'none';
 
 // Sự kiện chuyển đổi giao diện
 hotelLink.addEventListener('click', function(e) {
   e.preventDefault();
   hideAllForms();
   hotelLayout.style.display = 'block';
   statusBar.style.display = 'flex';
   orderContent.style.display = 'none';
   barchart.style.display = 'none';
   initHotelTab();
 });
 chartLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllForms();
    hotelLayout.style.display = 'none';
    statusBar.style.display = 'none';
    orderContent.style.display = 'none';
    barchart.style.display = 'block';
 });
 orderLink.addEventListener('click', function(e) {
   e.preventDefault();
   hideAllForms();
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
 function hideAllForms() {
  const forms = [
    'booking-list-modal',
    'form-checkin',
    'form-new-booking',
    'form-new-booking-step1',
    'form-new-booking-step2',
    'checkout-list',
    'form-checkout',
  ];

  forms.forEach(id => {
    const form = document.getElementById(id);
    if (form) {
      form.style.display = 'none';
    }
  });
}
function closeForms() {
   document.querySelector('.form-container-out').classList.remove('active');
 }
 
 // Sự kiện cho nút "Hủy" trong các form
 document.querySelectorAll('.cancel').forEach(button => {
   button.addEventListener('click', function(e) {
     closeForms();
     e.stopPropagation();
   });
 });
 
 // Khi click bên ngoài form thì đóng form
 document.addEventListener('click', function(e) {
   const checkoutForm = document.querySelector('.form-container-out');
   if (!checkoutForm.contains(e.target)) {
     closeForms();
   }
 });
 
 // Ngăn click bên trong form nổi lên
 document.querySelectorAll('.form-container-out').forEach(form => {
   form.addEventListener('click', function(e) {
     e.stopPropagation();
   });
 });