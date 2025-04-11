document.addEventListener("DOMContentLoaded", function () {
    const inventory = document.getElementById("inventory");
    const import_contract = document.getElementById("import_contract");
    const ctn1 = document.getElementById("container1");
    const ctn2 = document.getElementById("container2");
    const addItemBtn = document.getElementById("addItemBtn");
    const addOrderBtn = document.getElementById("addOrderBtn");
    const addItemForm = document.getElementById("addItemForm");
    const addOrderForm = document.getElementById("addOrderForm");
    const editItemForm = document.getElementById("editItemForm");
    const resetBtn = document.getElementById("resetBtn");
    const submitBtn = document.getElementById("submitBtn");
    const imageInput = document.getElementById("image");
    const editImageInput = document.getElementById("editImage");
    const previewImage = document.getElementById("previewImage");
    const overlay = document.getElementById("overlay");

    // function showForm(form) {
    //     form.style.display = "block";
    //     overlay.style.display = "block";
    //     form.scrollIntoView({ behavior: "smooth", block: "center" });
    // }

    // function hideForm(form) {
    //     form.style.display = "none";
    //     overlay.style.display = "none";
    // }

    let currentEditingRow = null;
    let currentImageUrl = "default.png";

    inventory.addEventListener("click", function(){
        ctn1.style.display = "block";
        ctn2.style.display = "none";
        inventory.style.backgroundColor = "#e74c3c";
        import_contract.style.backgroundColor = "#2c3e50";
    });

    import_contract.addEventListener("click", function(){
        ctn1.style.display = "none";
        ctn2.style.display = "block";
        inventory.style.backgroundColor = "#2c3e50";
        import_contract.style.backgroundColor = "#e74c3c";
    });

    // Ẩn form khi tải trang
    addItemForm.style.display = "none";

     // Hiển thị form
    addItemBtn.addEventListener("click", function () {
        if (!document.body.classList.contains('editing')) {
            // showForm(addItemForm);
            addItemForm.style.display = "block";
            addItemForm.scrollIntoView({ behavior: "smooth", block: "center" });

            document.body.classList.add("disable-scroll");
        }
    });

    addOrderBtn.addEventListener("click", function () {
        if (!document.body.classList.contains("editing")) {
            // showForm(addOrderForm);
            addOrderForm.style.display = "block";
            addOrderForm.scrollIntoView({ behavior: "smooth", block: "center" });

            document.body.classList.add("disable-scroll");
        }
    });

    // Ẩn form khi nhấn nút đóng
    closeFormBtn1.addEventListener("click", function () {
        // hideForm(addItemForm);
        addItemForm.style.display = "none";

        document.body.classList.remove("disable-scroll");
    });

    closeOrderForm.addEventListener("click", function () {
        // hideForm(addOrderForm);
        addOrderForm.style.display = "none";

        document.body.classList.remove("disable-scroll");
    });

    // Ẩn overlay khi chỉnh sửa xong
    document.getElementById("saveEditBtn").addEventListener("click", function () {
        hideForm(editItemForm);
        document.body.classList.remove('editing');
    });

    closeEditFormBtn.addEventListener("click", function(){
        editItemForm.style.display = "none"
        document.body.classList.remove('editing');
    })

    // Reset form nhập liệu
    resetBtn.addEventListener("click", function () {
        document.getElementById("name").value = "";
        document.getElementById("id").value = "";
        document.getElementById("category").value = "";
        document.getElementById("quantity").value = "";
        imageInput.value = "";
    });

    resetOrder.addEventListener("click", function(){
        document.getElementById("orderId").value ="";
        document.getElementById("orderDetail").value = "";
        document.getElementById("date").value = "";
        document.getElementById("supplier").value = "";
        document.getElementById("price").value = "";

        const statusRadio = document.querySelectorAll('input[name="status"]');
        statusRadio.forEach(radio => radio.checked = false);  
    });

    // Thêm dữ liệu vào bảng khi nhấn nút "Thêm"
    submitBtn.addEventListener("click", function () {
        const name = document.getElementById("name").value.trim();
        const id = document.getElementById("id").value.trim();
        const category = document.getElementById("category").value.trim();
        const quantity = document.getElementById("quantity").value.trim();
        const file = imageInput.files[0];

        if (!name || !id || !category || !quantity) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        let imageUrl = "default.png";
        if (file) {
            imageUrl = URL.createObjectURL(file);
        }

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${id}</td>
            <td><img src="${imageUrl}" alt="Hình ảnh" class="item-img""></td>
            <td>${name}</td>
            <td>${category}</td>
            <td>${quantity}</td>
            <td>
                <button id="edit-btn" class="edit-btn">Chỉnh sửa</button>
                <button id="delete-btn" class="delete-btn">Xóa</button>
            </td>
        `;

        // Thêm sự kiện xóa cho nút "Xóa" mới
        newRow.querySelector(".delete-btn").addEventListener("click", function () {
            if(!document.body.classList.contains('editing')){
                newRow.remove();
            }
        });

         // Chỉnh sửa
         newRow.querySelector(".edit-btn").addEventListener("click", function () {
            if (!document.body.classList.contains('editing')) {
                // Sử dụng let để cho phép cập nhật giá trị
                let currentId = newRow.cells[0].innerText;
                let currentImage = newRow.cells[1].querySelector('img').src;
                let currentName = newRow.cells[2].innerText;
                let currentCategory = newRow.cells[3].innerText;
                let currentQuantity = newRow.cells[4].innerText;
        
                // Đưa dữ liệu mới nhất vào form chỉnh sửa
                document.getElementById("editID").value = currentId;
                document.getElementById("editName").value = currentName;
                document.getElementById("editCategory").value = currentCategory;
                document.getElementById("editQuantity").value = currentQuantity;
                previewImage.src = currentImage;
                currentImageUrl = currentImage;
        
                currentEditingRow = newRow;
                document.body.classList.add('editing');
                editItemForm.style.display = "block";
                editItemForm.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
        
        
        
        const tableBody1 = document.querySelector("#itemTable tbody");
        tableBody1.insertBefore(newRow, tableBody1.firstChild);
        
        addItemForm.style.display = "none";
        document.body.classList.remove("disable-scroll");
        resetBtn.click();
    });

    // Hiển thị ảnh xem trước khi chọn ảnh mới
    editImageInput.addEventListener("change", function () {
        const file = editImageInput.files[0];
        if (file) {
            previewImage.src = URL.createObjectURL(file);
        }
    });

    // Lưu chỉnh sửa
    document.getElementById("saveEditBtn").addEventListener("click", function () {
        const editedName = document.getElementById("editName").value.trim();
        const editedCategory = document.getElementById("editCategory").value.trim();
        const editedQuantity = document.getElementById("editQuantity").value.trim();
        const newFile = editImageInput.files[0];
        const newImageUrl = newFile ? URL.createObjectURL(newFile) : currentImageUrl;

        if (currentEditingRow) {
            currentEditingRow.cells[2].innerText = editedName;
            currentEditingRow.cells[3].innerText = editedCategory;
            currentEditingRow.cells[4].innerText = editedQuantity;
            currentEditingRow.cells[1].querySelector('img').src = newImageUrl;
        }

        editItemForm.style.display = "none";
        overlay.style.display = "none";
        document.body.classList.remove('editing');
    });

    // Hủy chỉnh sửa
    document.getElementById("cancelEditBtn").addEventListener("click", function () {
        editItemForm.style.display = "none";
        document.body.classList.remove('editing');
    });

    document.getElementById("submitOrder").addEventListener("click", function () {
        const orderId = document.getElementById("orderId").value.trim();
        const orderDetail = document.getElementById("orderDetail").value.trim();
        const date = document.getElementById("date").value.trim();
        const supplier = document.getElementById("supplier").value.trim();
        const price = document.getElementById("price").value.trim();
        const status = document.querySelector('input[name="status"]:checked');
    
        if (!orderId || !orderDetail || !date || !supplier || !price || !status) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
    
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
        <td>${orderId}</td>
        <td>${orderDetail.replace(/\n/g, "<br>")}</td>
        <td>${date}</td>
        <td>${supplier}</td>
        <td>${price}</td>
        <td>
            <input type="radio" name="status_${orderId}" value="Đã nhận hàng" ${status.value === "Đã nhận hàng" ? "checked" : ""}> Đã nhận hàng
            <input type="radio" name="status_${orderId}" value="Chưa nhận hàng" ${status.value === "Chưa nhận hàng" ? "checked" : ""}> Chưa nhận hàng
        </td>`;
    
        const tableBody2 = document.querySelector("#orderTable tbody");
        tableBody2.insertBefore(newRow, tableBody2.firstChild);

        // Gán sự kiện change cho radio button trong dòng vừa thêm
        const radios = newRow.querySelectorAll(`input[name="status_${orderId}"]`);
        radios.forEach(radio => {
            radio.addEventListener("change", function () {
                if (this.value === "Đã nhận hàng" && this.checked) {
                    // Khi chọn "Đã cung cấp", khóa luôn cả 2 radio
                    radios.forEach(r => r.disabled = true);
                }
            });
        });

        // Kiểm tra luôn sau khi thêm nếu "Đã nhận hàng" được tick sẵn
        const checkedRadio = newRow.querySelector(`input[name="status_${orderId}"][value="Đã nhận hàng"]`);
        if (checkedRadio && checkedRadio.checked) {
            radios.forEach(r => r.disabled = true);
        }
    
        document.getElementById("addOrderForm").style.display = "none";
        document.getElementById("resetOrder").click();

        document.body.classList.remove("disable-scroll");
    });
    

    // Xóa dòng khi nhấn nút "Xóa"
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            event.target.closest("tr").remove();
        }
    }); 
});

// Tìm kiếm đồ dùng theo tên hoặc id 
document.getElementById("searchBtn").addEventListener("click", function() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("itemTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) { // Bỏ qua dòng tiêu đề
        let name = tr[i].getElementsByTagName("td")[2]?.textContent.toLowerCase();
        let id = tr[i].getElementsByTagName("td")[0]?.textContent.toLowerCase();
        if (name.includes(keyword) || id.includes(keyword)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
});
