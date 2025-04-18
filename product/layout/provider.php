<?php
    require("Database/provider.php");
?>
<div id="container3" class="container3">
    <div class="header">
        <h2>Nhà cung cấp</h2>
        <button id="addProviderBtn" class="add-btn">
            <i class="fas fa-plus-circle"></i>
        </button>
    </div>

    <div class="content-container">
        <table id="orderTable" class="item-table">
            <thead>
                <tr>
                    <th>Mã nhà cung cấp</th>
                    <th>Tên nhà cung cấp</th>
                    <th>Địa chỉ</th>
                    <th>Điện thoại</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <?php
                $provider = new provider();
                $provider->getAll();
                $provider->close();
            ?>
            <tbody>
                <tr>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                </tr>
            </tbody>
        </table>
    </div>

    <form id="addProviderForm" class="form-container" onsubmit="return check()" method="get" action="../../product/handle/handle_provider.php">
        <button type="button" id="closeFormBtn1" class="close-btn">&times;</button>
        <h3>Thêm nhà cung cấp</h3>
        <input type="hidden" name="op" value="insert">
        <input type="text" name="id" id="id" placeholder="Mã nhà cung cấp">
        
        <input type="text" name="name" id="name" placeholder="Tên nhà cung cấp">
        
        <input type="text" name="address" id="address" placeholder="Địa chỉ">

        <input type="text" name="phone" id="phone" placeholder="Điện thoại">

        <div class="form-buttons">
            <button type="submit" id="submitBtn">Thêm</button>
            <button type="reset" id="resetBtn">Reset</button>
        </div>
    </form>

    <form id="editProviderForm" class="edit-form-container" method="get" action="../../product/handle/handle_provider.php">
        <button type="button" id="closeProviderFormBtn" class="close-btn">&times;</button>
        <h3>Chỉnh sửa sản phẩm</h3>
        <div class="edit-form-content">
            <div class="info-section">
                <input type="hidden" name="op" value="update">
                <label for="editID">ID:</label>
                <input type="text" id="editID" name="editID" value="" readonly>

                <label for="editName">Tên:</label>
                <input type="text" id="editName" name="editName" value="">

                <label for="editAddress">Địa chỉ:</label>
                <input type="text" id="editAddress" name="editAddress" value="">

                <label for="editPhone">Điện thoại:</label>
                <input type="text" id="editPhone" name="editPhone" value="">
            </div>
        </div>
        <div class="form-buttons">
            <button type="submit" id="saveEditBtn">Lưu</button>
            <button type="button" id="cancelEditBtn">Hủy</button>
        </div>
    </form>
</div>

<?php
    $provider = new provider();
    $sql = "SELECT Ma_nha_cung_cap FROM nha_cung_cap";
    $res = mysqli_query($provider->getConnect(), $sql);
    $id = array();
    while($row = mysqli_fetch_array($res)){
        $id[] = $row[0];
    }
?>

<script>
    addProviderForm.style.display = "none";
    addProviderBtn.addEventListener("click", function () {
        if (!document.body.classList.contains('editing')) {
            // showForm(addItemForm);
            addProviderForm.style.display = "block";
            addProviderForm.scrollIntoView({ behavior: "smooth", block: "center" });

            // document.body.classList.add("disable-scroll");
        }
    });
    closeFormBtn1.addEventListener("click", function() {
        // hideForm(addItemForm);
        addProviderForm.style.display = "none";

        // document.body.classList.remove("disable-scroll");
    });
    closeProviderFormBtn.addEventListener("click", function() {
        editProviderForm.style.display = "none"
        document.body.classList.remove('editing');
    });
    document.getElementById("cancelEditBtn").addEventListener("click", function() {
        editProviderForm.style.display = "none";
        document.body.classList.remove('editing');
    });
    function update(element){
        editProviderForm.style.display = "block";
        editProviderForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        let tmp = element.parentNode.parentNode;
        let td = tmp.querySelectorAll('td');
        console.log(td[0].innerHTML);
        document.getElementById("editID").value = td[0].innerHTML;
        document.getElementById("editName").value = td[1].innerHTML;
        document.getElementById("editAddress").value = td[2].innerHTML;
        document.getElementById("editPhone").value = td[3].innerHTML;
    }
    function check(){
        let name = document.getElementById("name");
        let id = document.getElementById("id");
        let address = document.getElementById("address");
        let phone = document.getElementById("phone");
        let ids = <?php echo json_encode($id)?>;

        if(!id.value || !name.value || !address.value || !phone.value){
            alert("Vui lòng điền đầy đủ thông tin");
            return false;
        }
        const regex = /^NCC[0-9]{3}$/;
        if(!regex.test(id.value)){
            alert("Mã đồ dùng phải bắt đầu bằng NCC và sau đó chỉ có 3 chữ số");
            id.focus();
            return false;
        }
        for(var i = 0; i < ids.length; i++){
            if(id.value == ids[i]){
                alert("Đã có mã nhà cung cấp rồi");
                id.focus();
                return false;
            }
        }
        const regex1 = /^(0[3|5|7|8|9])[0-9]{8}$/;
        if(!regex1.test(phone.value)){
            alert("SDT bắt đầu bằng 03/05/07/08/09 và đằng sau đủ 8 so");
            phone.focus();
            return false;
        }
        return true;
    }
</script>