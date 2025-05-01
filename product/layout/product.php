<?php
    require("Database/product.php");
?>
<div id="container1" class="container1">
    <div class="header-container">
        <div class="header">
            <h2>Quản lý đồ dùng</h2>
            <button id="addItemBtn" class="add-btn">
                <i class="fas fa-plus-circle"></i>
            </button>
        </div>
    </div>

    <div id="find_Item" class="find_Item">
        <input type="text" id="searchInput" placeholder="Nhập tên hoặc mã sản phẩm để tìm...">
        <button id="searchBtn">
            <i class="fas fa-search"></i> Tìm kiếm
        </button>
    </div>


    <div class="content-container">
        <table id="itemTable" class="item-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Loại</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <?php
                $product = new product();
                $product->getAll();
                $product->close();
            ?>
            <tbody>
                <tr>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                </tr>
            </tbody>
            
        </table>
    </div>

    <form id="addItemForm" class="form-container" method="get" action="../../product/handle/handle_product.php" onsubmit="return check()">
        <button type="button" id="closeFormBtn1" class="close-btn">&times;</button>
        <h3>Thêm dụng cụ</h3>
        <input type="hidden" name="op" value="insert">
        <input type="text" name="name" id="name" placeholder="Tên sản phẩm">

        <input type="text" name="id" id="id" placeholder="Mã sản phẩm">

        <!-- <input type="file" id="image" placeholder="Hình ảnh"> -->
        
        <input type="text" name="category" id="category" placeholder="Loại">
        
        <input type="text" name="price" id="price" placeholder="Giá tiền">
        
        <input type="number" name="quantity" id="quantity" placeholder="Số lượng">
        
        <div class="form-buttons">
            <button type="submit" id="submitBtn">Thêm</button>
            <button type="reset" id="resetBtn">Reset</button>
        </div>
    </form>

    <div id="overlay" style="display: none;"></div>

    <form id="editItemForm" class="edit-form-container" method="get" action="../../product/handle/handle_product.php">
        <button type="button" id="closeEditFormBtn" class="close-btn">&times;</button>
        <h3>Chỉnh sửa sản phẩm</h3>
        <div class="edit-form-content">
            <div class="info-section">
                <input type="hidden" name="op" value="update">
                <label for="editID">ID:</label>
                <input type="text" id="editID" name="editID" value="" readonly>

                <label for="editName">Tên:</label>
                <input type="text" id="editName" name="editName" value="">

                <label for="editCategory">Loại:</label>
                <input type="text" id="editCategory" name="editCategory" value="">

                <label for="editPrice">Giá:</label>
                <input type="text" id="editPrice" name="editPrice" value="">

                <label for="editQuantity">Số lượng:</label>
                <input type="number" id="editQuantity" name="editQuantity" value="">
            </div>
            <!-- <div class="image-section">
                <img id="previewImage" src="" alt="Hình ảnh sản phẩm">
                <input type="file" id="editImage">
            </div> -->
        </div>
        <div class="form-buttons">
            <button type="submit" id="saveEditBtn">Lưu</button>
            <button type="button" id="cancelEditBtn">Hủy</button>
        </div>
    </form>
</div>

<?php
    $product = new product();
    $sql = "SELECT Ma_Do_Dung FROM `do_dung`";
    $res = mysqli_query($product->getConnect(), $sql);
    $id = array();
    while($row = mysqli_fetch_array($res)){
        $id[] = $row[0];
    }
    $product->close();
?>

<script>
    const editImageInput = document.getElementById("editImage");
    const previewImage = document.getElementById("previewImage");
    const imageInput = document.getElementById("image");
    // let currentEditingRow = null;
    let currentImageUrl = "default.png";
    // Ẩn form khi nhấn nút đóng
    closeFormBtn1.addEventListener("click", function() {
        // hideForm(addItemForm);
        addItemForm.style.display = "none";

        document.body.classList.remove("disable-scroll");
    });
    // submitBtn.addEventListener("click", function() {
    //     const name = document.getElementById("name").value.trim();
    //     const id = document.getElementById("id").value.trim();
    //     const category = document.getElementById("category").value.trim();
    //     const quantity = document.getElementById("quantity").value.trim();
    //     const file = imageInput.files[0];

    //     if (!name || !id || !category || !quantity) {
    //         alert("Vui lòng nhập đầy đủ thông tin!");
    //         return;
    //     }

    //     let imageUrl = "default.png";
    //     if (file) {
    //         imageUrl = URL.createObjectURL(file);
    //     }

    //     const newRow = document.createElement("tr");
    //     newRow.innerHTML = `
    //         <td>${id}</td>
    //         <td><img src="${imageUrl}" alt="Hình ảnh" class="item-img""></td>
    //         <td>${name}</td>
    //         <td>${category}</td>
    //         <td>${quantity}</td>
    //         <td>
    //             <button id="edit-btn" class="edit-btn">Chỉnh sửa</button>
    //             <button id="delete-btn" class="delete-btn">Xóa</button>
    //         </td>
    //     `;

    //     // Thêm sự kiện xóa cho nút "Xóa" mới
    //     newRow.querySelector(".delete-btn").addEventListener("click", function() {
    //         if (!document.body.classList.contains('editing')) {
    //             newRow.remove();
    //         }
    //     });

    //     // Chỉnh sửa
    //     newRow.querySelector(".edit-btn").addEventListener("click", function() {
    //         if (!document.body.classList.contains('editing')) {
    //             // Sử dụng let để cho phép cập nhật giá trị
    //             let currentId = newRow.cells[0].innerText;
    //             let currentImage = newRow.cells[1].querySelector('img').src;
    //             let currentName = newRow.cells[2].innerText;
    //             let currentCategory = newRow.cells[3].innerText;
    //             let currentQuantity = newRow.cells[4].innerText;

    //             // Đưa dữ liệu mới nhất vào form chỉnh sửa
    //             document.getElementById("editID").value = currentId;
    //             document.getElementById("editName").value = currentName;
    //             document.getElementById("editCategory").value = currentCategory;
    //             document.getElementById("editQuantity").value = currentQuantity;
    //             previewImage.src = currentImage;
    //             currentImageUrl = currentImage;

    //             currentEditingRow = newRow;
    //             document.body.classList.add('editing');
    //             editItemForm.style.display = "block";
    //             editItemForm.scrollIntoView({
    //                 behavior: "smooth",
    //                 block: "center"
    //             });
    //         }
    //     });



    //     const tableBody1 = document.querySelector("#itemTable tbody");
    //     tableBody1.insertBefore(newRow, tableBody1.firstChild);

    //     addItemForm.style.display = "none";
    //     document.body.classList.remove("disable-scroll");
    //     resetBtn.click();
    // });
    closeEditFormBtn.addEventListener("click", function() {
        editItemForm.style.display = "none"
        document.body.classList.remove('editing');
    })
    // document.getElementById("saveEditBtn").addEventListener("click", function() {
    //     const editedName = document.getElementById("editName").value.trim();
    //     const editedCategory = document.getElementById("editCategory").value.trim();
    //     const editedQuantity = document.getElementById("editQuantity").value.trim();
    //     const newFile = editImageInput.files[0];
    //     const newImageUrl = newFile ? URL.createObjectURL(newFile) : currentImageUrl;

    //     if (currentEditingRow) {
    //         currentEditingRow.cells[2].innerText = editedName;
    //         currentEditingRow.cells[3].innerText = editedCategory;
    //         currentEditingRow.cells[4].innerText = editedQuantity;
    //         currentEditingRow.cells[1].querySelector('img').src = newImageUrl;
    //     }

    //     editItemForm.style.display = "none";
    //     overlay.style.display = "none";
    //     document.body.classList.remove('editing');
    // });
    document.getElementById("cancelEditBtn").addEventListener("click", function() {
        editItemForm.style.display = "none";
        document.body.classList.remove('editing');
    });

    function update(element){
        editItemForm.style.display = "block";
        editItemForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        let tmp = element.parentNode.parentNode;
        let td = tmp.querySelectorAll('td');
        console.log(td[0].innerHTML);
        document.getElementById("editID").value = td[0].innerHTML;
        document.getElementById("editName").value = td[1].innerHTML;
        document.getElementById("editCategory").value = td[2].innerHTML;
        document.getElementById("editPrice").value = td[3].innerHTML;
        document.getElementById("editQuantity").value = td[4].innerHTML;
        // alert(element.parentNode.parentNode.id);
    }
    function check(){
        let name = document.getElementById("name");
        let id = document.getElementById("id");
        let category = document.getElementById("category");
        let price = document.getElementById("price");
        let quantity = document.getElementById("quantity");
        let ids = <?php echo json_encode($id)?>;

        if(!id.value || !name.value || !category.value || !price.value || !quantity.value){
            alert("Vui lòng điền đầy đủ thông tin");
            return false;
        }
        const regex = /^DD[0-9]{3}$/;
        if(!regex.test(id.value)){
            alert("Mã đồ dùng phải bắt đầu bằng DD và sau đó chỉ có 3 chữ số");
            id.focus();
            return false;
        }
        for(var i = 0; i < ids.length; i++){
            if(id.value == ids[i]){
                alert("Đã có mã đồ dùng rồi");
                id.focus();
                return false;
            }
        }
        return true;
    }
    addItemBtn.addEventListener("click", function () {
        if (!document.body.classList.contains('editing')) {
            // showForm(addItemForm);
            addItemForm.style.display = "block";
            addItemForm.scrollIntoView({ behavior: "smooth", block: "center" });

            document.body.classList.add("disable-scroll");
        }
    });
    document.getElementById("searchBtn").addEventListener("click", function() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("itemTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) { // Bỏ qua dòng tiêu đề
        let name = tr[i].getElementsByTagName("td")[1]?.textContent.toLowerCase();
        let id = tr[i].getElementsByTagName("td")[0]?.textContent.toLowerCase();
        if (name.includes(keyword) || id.includes(keyword)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
});
</script>