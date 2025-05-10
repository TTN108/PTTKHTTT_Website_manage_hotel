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
                    <th>Hành động</th>
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
                    <td>...</td>
                </tr>
            </tbody>
            </tbody>
        </table>
    </div>

    <form id="addOrderForm" class="form-container" onsubmit="return check1()" method="get" action="../../product/handle/handle_import.php">
        <button type="button" id="closeOrderForm" class="close-btn">&times;</button>
        <h3>Thêm đơn hàng mới</h3>
        <!-- <input type="text" id="orderId" name="orderID" placeholder="Mã đơn hàng: "> -->

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
while ($row = mysqli_fetch_array($res)) {
    $productIDs[] = $row[0];
}
$sql1 = "SELECT Ma_nha_cung_cap FROM `nha_cung_cap`";
$res1 = mysqli_query($product->getConnect(), $sql1);
while ($row1 = mysqli_fetch_array($res1)) {
    $providerIDs[] = $row1[0];
}
$sql2 = "SELECT Ma_Nhap_Hang FROM `nhap_hang`";
$res2 = mysqli_query($product->getConnect(), $sql2);
while ($row2 = mysqli_fetch_array($res2)) {
    $importIDs[] = $row2[0];
}
$product->close();
$provider->close();
$import->close();
?>

<script
    src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.js"></script>
<script
    src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.js"></script>
<script
    src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js"></script>
<script
    src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.6/jspdf.plugin.autotable.min.js"></script>

<script>
    addOrderBtn.addEventListener("click", function() {
        if (!document.body.classList.contains("editing")) {
            // showForm(addOrderForm);
            addOrderForm.style.display = "block";
            addOrderForm.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            document.body.classList.add("disable-scroll");
        }
    });
    closeOrderForm.addEventListener("click", function() {
        // hideForm(addOrderForm);
        addOrderForm.style.display = "none";

        document.body.classList.remove("disable-scroll");
    });

    function update(element) {
        let radio = document.getElementById("yes");
        let radio1 = document.getElementById("no");
        if (radio.checked == true) {
            radio.disabled = true;
            radio1.disabled = true;
        }
    }

    function check1() {
        let orderDetail = document.getElementById("orderDetail");
        let date = document.getElementById("date");
        let supplier = document.getElementById("supplier");
        let provided = document.getElementById("provided");
        let not_provided = document.getElementById("not_provided");
        let orderID = <?php echo json_encode($importIDs) ?>;
        let productID = <?php echo json_encode($productIDs) ?>;
        let providerID = <?php echo json_encode($providerIDs) ?>;
        if (!orderDetail.value || !date.value || !supplier.value || (provided.check == false && not_provided.check == false)) {
            alert("Vui lòng điền đầy đủ thông tin");
            return false;
        }
        let line = orderDetail.value.split(/\r?\n|\r|\n/g);
        for (var i = 0; i < line.length; i++) {
            let line1 = line[i].split(/-/g);
            const regex1 = /^DD[0-9]{3}$/;
            if (!regex1.test(line1[0].trim())) {
                alert("Mã đồ dùng phải bắt đầu bằng DD và sau đó chỉ có 3 chữ số");
                return false;
            }
            var check = false;
            var tmp;
            for (var i = 0; i < productID.length; i++) {
                tmp = line1[0].trim();
                if (line1[0].trim() == productID[i]) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                alert("Không có mã đồ dùng " + tmp + " này tồn tại");
                return false;
            }
            if (line1.length < 3) {
                alert("Phải có mã đồ dùng - số lượng - tiền nhập");
                return false;
            }
            // for(var j = 0; j < line1.length; j++){
            //     console.log(line1[j].trim());
            // }
        }
        const regex2 = /^NCC[0-9]{3}$/;
        if (!regex2.test(supplier.value)) {
            alert("Mã nhà cung cấp phải bắt đầu NCC và sau đó chỉ có 3 chữ số");
            return false;
        }
        var check = false;
        for (var i = 0; i < providerID.length; i++) {
            if (supplier.value == providerID[i]) {
                check = true;
                break;
            }
        }
        if (!check) {
            alert("Không có tồn tại mã nhà cung cấp này");
            supplier.focus();
            return false;
        }
        return true;
    }

    function print(element) {
        // console.log(element.parentNode.parentNode);
        var tmp = element.parentNode.parentNode;
        let td = tmp.querySelectorAll('td');
        // console.log(td[0].innerHTML);
        var id = td[0].innerHTML;
        var detail = td[1].innerHTML;
        // console.log(detail);
        var a = [];
        var arr = detail.trim().split(/\n/g);
        var total = 0;
        // console.log(arr);
        for (var i = 0; i < arr.length; i++) {
            var a1 = [];
            var arr1 = arr[i].trim().split(/ - /g);
            a1[0] = i + 1;
            // console.log(arr1);
            for (var j = 0; j < arr1.length; j++) {
                var arr2 = arr1[j].trim().split(/: /g);
                if(j > 0){
                    a1[j + 1] = parseInt(arr2[1]);
                }
                else{
                    a1[j + 1] = removeVietnameseTones(arr2[1]);
                }
                // console.log(arr2);
            }
            a1[4] = a1[2]*a1[3];
            total += a1[4];
            a[i] = a1;
        }
        console.log(a);
        var doc = new jsPDF('p', 'pt', 'a4');
        doc.setFont('times');
        doc.setFontSize(12);
        var y = 10;
        doc.setLineWidth(2);
        doc.text(240, y = y + 30, "Goods received note");
        doc.text(40, y = y + 30, "ID: " + id);
        doc.text(40, y = y + 30, "Place of provider: " + removeVietnameseTones(td[3].innerHTML));
        doc.text(40, y = y + 30, "Date: " + td[2].innerHTML);
        doc.autoTable({
            head:[["STT", "Product name", "Quantity", "Import price", "Total amount"]],
            headStyles :{lineWidth: 1,fillColor: [30, 212, 145],textColor: [255,255,255],
            },
            body: a,
            startY: 150,
            theme: 'grid',
            columnStyles: {
                0: {
                    cellWidth: 50,
                    tableWidth: 100,
                },
                1: {
                    cellWidth: 200,
                    tableWidth: 100,
                },
                2: {
                    cellWidth: 50,
                    tableWidth: 100,
                },
                3: {
                    cellWidth: 100,
                    tableWidth: 100,
                },
                4: {
                    cellWidth: 100,
                    tableWidth: 100,
                }
            },
        });
        doc.text(430, y = y + 300, "Total: " + td[4].innerHTML);
        // save the data to this file
        doc.save('import');
    }
    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g," ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return str;
    }
</script>