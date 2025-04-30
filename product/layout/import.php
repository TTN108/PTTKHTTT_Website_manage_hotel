<?php
    require("Database/import.php");
    require("Database/product.php");
    require("Database/provider.php");
?>
<div id="container2" class="container2">
    <div class="header">
        <h2>Thông tin đơn hàng</h2>
        <button id="addOrderBtn" class="add-btn">
            <i class="fas fa-plus-circle"></i>
        </button>
    </div>

    <div class="content-container">
        <table id="orderTable" class="item-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Chi tiết đơn hàng</th>
                    <th>Ngày cung cấp</th>
                    <th>Nơi cung cấp</th>
                    <th>Tổng tiền nhập</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <?php
                $import = new import();
                $import->getAll();
                $import->close();
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
            </tbody>
        </table>
    </div>

    <form id="addOrderForm" class="form-container" onsubmit="return check()" method="get" action="../../product/handle/handle_import.php">
        <button type="button" id="closeOrderForm" class="close-btn">&times;</button>
        <h3>Thêm đơn hàng mới</h3>
        <input type="text" id="orderId" name="orderID" placeholder="Mã đơn hàng: ">

        <textarea id="orderDetail" name="orderDetail" placeholder="Nhập theo cú pháp mã đồ dùng - số lượng - đơn giá" rows="4"></textarea>
        <input type="date" id="date" name="date">

        <input type="text" id="supplier" name="providerID" placeholder="Mã nhà cung cấp:">

        <!-- <input type="number" id="price" placeholder="Giá:"> -->

        <label for="status">Trạng thái:</label>
        <div class="radio-group">
            <input type="radio" id="provided" name="status" value="Đã giao">
            <label for="provided">Đã nhận hàng</label>

            <input type="radio" id="not_provided" name="status" value="Chưa giao">
            <label for="not_provided">Chưa nhận hàng</label>
        </div>

        <div class="form-buttons">
            <button type="submit" id="submitOrder">Thêm</button>
            <button type="reset" id="resetOrder">Reset</button>
        </div>
    </form>
</div>

<?php
    $product = new product();
    $provider = new provider();
    $import = new import();
    $productIDs = array();
    $providerIDs = array();
    $importIDs = array();
    $sql = "SELECT Ma_Do_Dung FROM `do_dung`";
    $res = mysqli_query($product->getConnect(), $sql);
    while($row = mysqli_fetch_array($res)){
        $productIDs[] = $row[0];
    }
    $sql1 = "SELECT Ma_nha_cung_cap FROM `nha_cung_cap`";
    $res1 = mysqli_query($product->getConnect(), $sql1);
    while($row1 = mysqli_fetch_array($res1)){
        $providerIDs[] = $row1[0];
    }
    $sql2 = "SELECT Ma_Nhap_Hang FROM `nhap_hang`";
    $res2 = mysqli_query($product->getConnect(), $sql2);
    while($row2 = mysqli_fetch_array($res2)){
        $importIDs[] = $row2[0];
    }
    $product->close();
    $provider->close();
    $import->close();
?>

<script>
    addOrderBtn.addEventListener("click", function () {
        if (!document.body.classList.contains("editing")) {
            // showForm(addOrderForm);
            addOrderForm.style.display = "block";
            addOrderForm.scrollIntoView({ behavior: "smooth", block: "center" });

            document.body.classList.add("disable-scroll");
        }
    });
    closeOrderForm.addEventListener("click", function () {
        // hideForm(addOrderForm);
        addOrderForm.style.display = "none";

        document.body.classList.remove("disable-scroll");
    });
    function update(element){
        let radio = document.getElementById("yes");
        let radio1 = document.getElementById("no");
        if(radio.checked == true){
            radio.disabled = true;
            radio1.disabled = true;
        }
    }
    function check(){
        let order = document.getElementById("orderId");
        let orderDetail = document.getElementById("orderDetail");
        let date = document.getElementById("date");
        let supplier = document.getElementById("supplier");
        let provided = document.getElementById("provided");
        let not_provided = document.getElementById("not_provided");
        let orderID = <?php echo json_encode($importIDs)?>;
        let productID = <?php echo json_encode($productIDs)?>;
        let providerID = <?php echo json_encode($providerIDs)?>;
        if(!order.value || !orderDetail.value || !date.value || !supplier.value || (provided.checked == false && not_provided.checked == false)){
            alert("Vui lòng điền đầy đủ thông tin");
            return false;
        }
        const regex = /^NH[0-9]{3}$/;
        if(!regex.test(order.value)){
            alert("Mã phiếu nhập bắt đầu là NH và đằng sau là 3 chữ số");
            return false;
        }
        let line = orderDetail.value.split(/\r?\n|\r|\n/g);
        for(var i = 0; i < line.length; i++){
            let line1 = line[i].split(/-/g);
            const regex1 = /^DD[0-9]{3}$/;
            if(!regex1.test(line1[0].trim())){
                alert("Mã đồ dùng phải bắt đầu bằng DD và sau đó chỉ có 3 chữ số");
                return false;
            }
            var check = false;
            for(var i = 0; i < productID.length; i++){
                if(line1[0].trim() == productID[i]){
                    check = true;
                    break;
                }
            }
            if(!check){
                alert("Không có mã đồ dùng này tồn tại");
                return false;
            }
            if(line1.length < 3){
                alert("Phải có mã đồ dùng - số lượng - tiền nhập");
                return false;
            }
            // for(var j = 0; j < line1.length; j++){
            //     console.log(line1[j].trim());
            // }
        }
        const regex2 = /^NCC[0-9]{3}$/;
        if(!regex2.test(supplier.value)){
            alert("Mã nhà cung cấp phải bắt đầu NCC và sau đó chỉ có 3 chữ số");
            return false;
        }
        for(var i = 0; i < orderID.length; i++){
            if(orderID[0] == order.value){
                alert("Đã có mã nhập hàng rồi");
                order.focus();
                return false;
            }
        }
        var check = false;
        for(var i = 0; i < providerID.length; i++){
            if(supplier.value == providerID[i]){
                check = true;
                break;
            }
        }
        if(!check){
            alert("Không có tồn tại mã nhà cung cấp này");
            supplier.focus();
            return false;
        }
        return true;
    }
</script>