<?php
    echo `
        <div class="floor">
            <div class="room-row">
                <div class="floor-title"><p>Lầu 1</p></div>
                <div class="room-container">
                    <div class="room occupied">
                        <div class="room-title">101</div><br>
                        <div class="room-owner">Trần Trọng Nghĩa</div>
                        <div class="tooltip" id="room-event" value="Trả phòng">
                            Trả Phòng
                        </div>
                    </div>
                    <div class="room free">
                        <div class="room-title">102</div>
                        <div class="room-owner"></div>
                        <div class="tooltip" id="room-event" value="Nhận phòng">
                            Nhận Phòng
                        </div>
                    </div>
                    <div class="room free">102<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room cleaning">103</div>
                    <div class="room free">104<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room free">105<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room free">106<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room free">107<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room free">108<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room free">109<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room free">110<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room free">111<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room free">112<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                    <div class="room free">113<br>Nhận phòng<div class="tooltip">Nhận phòng</div></div>
                </div>
            </div>
        </div>
        <div class="floor">
            <div class="room-row">
                <div class="floor-title"><span>Lầu 2</span></div>
                <div class="room free">201</div>
                <div class="room occupied">202<br>Cao Cát Lượng</div>
                <div class="room cleaning">203</div>
            </div>
        </div>
        <div class="floor">
            <div class="room-row">
                <div class="floor-title">Lầu 3</div>
                <div class="room cleaning">301</div>
                <div class="room free">302</div>
                <div class="room occupied">303<br>Trương Thanh Tòng</div>
            </div>
        </div>

        <div class="floor">
            <div class="room-row">
                <div class="floor-title">Lầu 4</div>
                <div class="room occupied">401<br>Trần Trọng Nghĩa<div class="tooltip">Trả phòng</div></div>
                <div class="room free">402</div>
                <div class="room free">403</div>
            </div>
        </div>
    `;
?>