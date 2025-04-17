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
                    <th>Giá</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
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

    <div id="addOrderForm" class="form-container">
        <button id="closeOrderForm" class="close-btn">&times;</button>
        <h3>Thêm đơn hàng mới</h3>
        <input type="text" id="orderId" placeholder="Mã đơn hàng: ">

        <textarea id="orderDetail" placeholder="Nhập chi tiết đơn hàng..." rows="4"></textarea>
        <input type="date" id="date">

        <input type="text" id="supplier" placeholder="Nơi cung cấp:">

        <input type="number" id="price" placeholder="Giá:">

        <label for="status">Trạng thái:</label>
        <div class="radio-group">
            <input type="radio" id="provided" name="status" value="Đã nhận hàng">
            <label for="provided">Đã nhận hàng</label>

            <input type="radio" id="not_provided" name="status" value="Chưa nhận hàng">
            <label for="not_provided">Chưa nhận hàng</label>
        </div>

        <div class="form-buttons">
            <button type="submit" id="submitOrder">Thêm</button>
            <button type="reset" id="resetOrder">Reset</button>
        </div>
    </div>
</div>