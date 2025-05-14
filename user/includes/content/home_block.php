<!-- ---------------------- Home Block -------------------------------------- -->
<div id="home-block" class="block active">
    <!-- ------------------- Mini Booking Form ----------------------------------- -->
    <div id="mini-booking-form-container" tabindex="-1">
        <form action="" id="mini-booking-form">
            <div id="label-group">
                <div class="mini-container">
                    <label for="checkin" id="checkin-label">Check-in</label>
                </div>
                <div class="mini-container">
                    <label for="checkout" id="checkout-label">Check-out</label>
                </div>
                <div class="mini-container">
                    <label for="rooms" id="rooms-label">Rooms</label>
                </div>
                <div class="mini-container">
                    <label for="guests" id="guests-label">Guests</label>
                </div>
            </div>
            <div id="input-group">
                <div class="mini-container">
                    <input type="date" id="checkin" class="mini-form-input" value="<?php echo date('Y-m-d'); ?>" min="<?php echo date('Y-m-d'); ?>">
                </div>
                <div class="mini-container">
                    <input type="date" id="checkout" class="mini-form-input" <?php $checkoutMinValue = date('Y-m-d', strtotime(date('Y-m-d') . '+1 day'));
                                                                                echo "value=\"$checkoutMinValue\" min=\"$checkoutMinValue\"" ?>>
                </div>
                <div class="mini-container">
                    <select id="rooms" class="mini-form-input">
                        <?php
                        for ($i = 1; $i <= 7; $i++) {
                            echo "<option value='$i'>$i</option>";
                        }
                        ?>
                    </select>
                </div>
                <div class="mini-container">
                    <select id="guests" class="mini-form-input">
                        <?php
                        for ($i = 1; $i <= 20; $i++) {
                            echo "<option value='$i'>$i</option>";
                        }
                        ?>
                    </select>
                </div>
                <div class="mini-container">
                    <button id="book-button" class="mini-form-input" type="button" value="book-now">
                        Book now
                    </button>
                </div>
            </div>
        </form>
    </div>
    <!-- ------------------------- Hero Section ------------------------------- -->
    <div id="hero-section-container">
        <h1>Sunset Hotel - Ấm áp và thân thiện</h1>
        <br>
        <p>Tọa lạc ở thành phố Hồ Chí Minh. Sunset Hotel sẽ</p>
        <p>đưa bạn đến trải nghiệm tuyệt vời với phòng ốc</p>
        <p>sang trọng và nhân viên thân thiện.</p>
    </div>
    <!-- ------------------------ Room Selection ------------------------------ -->
    <div id="room-selection-container">
        <div class="room-card">
            <img class="room-image" id="home-standard">
            <p>Standard Room</p>
            <button class="room-detail-button" type="button" data-type="standard">Detail</button>
        </div>
        <div class="room-card">
            <img class="room-image" id="home-deluxe">
            <p>Deluxe Room</p>
            <button class="room-detail-button" type="button" data-type="deluxe">Detail</button>
        </div>
    </div>
</div>