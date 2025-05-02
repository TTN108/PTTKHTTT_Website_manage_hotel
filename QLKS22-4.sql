-- ================================
-- TOÀN BỘ CẤU TRÚC
-- ================================
-- TẠO CÁC BẢNG
DROP DATABASE IF EXISTS hotel;
CREATE DATABASE hotel;
USE hotel;

CREATE TABLE Account (
    Username VARCHAR(50) PRIMARY KEY,
    Password NVARCHAR(50),
    Email NVARCHAR(100),
    Status NVARCHAR(50) 
);

CREATE TABLE KHACH_HANG (
    CCCD NVARCHAR(50) PRIMARY KEY, 
    Ten NVARCHAR(100),
    SDT NVARCHAR(20),
    Dia_chi NVARCHAR(255),
    Account VARCHAR(50),
    FOREIGN KEY (Account) REFERENCES Account(Username)
);

CREATE TABLE NHAN_VIEN (
    Ma_nhan_vien NVARCHAR(20) PRIMARY KEY,
    Ten NVARCHAR(100),
    SDT NVARCHAR(20),
    Dia_chi NVARCHAR(255),
    Account VARCHAR(50),
    Chuc_vu NVARCHAR(50),
    FOREIGN KEY (Account) REFERENCES Account(Username)
);

CREATE TABLE Loai_Phong (
    Ma_Loai_Phong NVARCHAR(20) PRIMARY KEY,
    Ten_loai NVARCHAR(50),
    View NVARCHAR(50),
    Mo_ta NVARCHAR(255),
    Dien_tich INT,
    Gia DECIMAL(18,2),
    max_nguoi INT,
    picture NVARCHAR(255)
);

CREATE TABLE PHONG (
    ID NVARCHAR(20) PRIMARY KEY,
    Ma_Loai_Phong NVARCHAR(20),
    Trang_thai NVARCHAR(50),
    FOREIGN KEY (Ma_Loai_Phong) REFERENCES Loai_Phong(Ma_Loai_Phong)
);

CREATE TABLE DO_DUNG (
    Ma_Do_Dung NVARCHAR(20) PRIMARY KEY,
    Ten NVARCHAR(100),
    Loai NVARCHAR(50),
    Gia DECIMAL(18,2),
    So_luong INT
);

CREATE TABLE Nha_cung_cap (
    Ma_nha_cung_cap NVARCHAR(20) PRIMARY KEY,
    Ten_nha_cung_cap NVARCHAR(100),
    Dia_chi NVARCHAR(255),
    Dien_thoai NVARCHAR(20)
);

CREATE TABLE NHAP_HANG (
    Ma_Nhap_Hang INT PRIMARY KEY AUTO_INCREMENT,
    Ngay_cung_cap DATE,
    Trang_thai NVARCHAR(50),
    Tong_tien_nhap DECIMAL(18,2),
    Ma_nha_cung_cap NVARCHAR(20),
    FOREIGN KEY (Ma_nha_cung_cap) REFERENCES Nha_cung_cap(Ma_nha_cung_cap)
);

CREATE TABLE Chi_tiet_phieu_nhap (
    Ma_Nhap_Hang INT,
    Ma_Do_Dung NVARCHAR(20),
    So_luong INT,
    Gia_nhap DECIMAL(18,2),
    PRIMARY KEY (Ma_Nhap_Hang, Ma_Do_Dung),
    FOREIGN KEY (Ma_Nhap_Hang) REFERENCES NHAP_HANG(Ma_Nhap_Hang),
    FOREIGN KEY (Ma_Do_Dung) REFERENCES DO_DUNG(Ma_Do_Dung)
);

CREATE TABLE don_dat_phong (
    Ma_don_dat_phong INT PRIMARY KEY AUTO_INCREMENT,
    Account VARCHAR(50),
    Ngay_nhan DATE,
    Ngay_tra DATE,
    So_luong_phong INT,
    So_luong_nguoi INT,
    Ma_Loai_Phong NVARCHAR(20),
    Ngay_dat DATETIME DEFAULT CURRENT_TIMESTAMP,
    Trang_thai varchar(20),
	FOREIGN KEY (Ma_Loai_Phong) REFERENCES Loai_Phong(Ma_Loai_Phong)
);

CREATE TABLE HOA_DON (
    Ma_Hoa_Don INT PRIMARY KEY AUTO_INCREMENT,
    Ma_don_dat_phong INT,
    Ma_nhan_vien NVARCHAR(20),
    Tong_tien DOUBLE(20,2),
    FOREIGN KEY (Ma_don_dat_phong) REFERENCES don_dat_phong(Ma_don_dat_phong),
    FOREIGN KEY (Ma_nhan_vien) REFERENCES NHAN_VIEN(Ma_nhan_vien)
);

CREATE TABLE Chi_tiet_hoa_don (
    Ma_Hoa_Don INT,
    Ma_phong NVARCHAR(20),
    PRIMARY KEY (Ma_Hoa_Don, Ma_phong),
    FOREIGN KEY (Ma_Hoa_Don) REFERENCES HOA_DON(Ma_Hoa_Don),
    FOREIGN KEY (Ma_phong) REFERENCES PHONG(ID)
);

CREATE TABLE Chi_tiet_phong_hoa_don (
    Ma_Hoa_Don INT,
    Ma_phong NVARCHAR(20),
    Ma_do_dung NVARCHAR(20),
    PRIMARY KEY (Ma_Hoa_Don, Ma_phong, Ma_do_dung),
    FOREIGN KEY (Ma_Hoa_Don) REFERENCES HOA_DON(Ma_Hoa_Don),
    FOREIGN KEY (Ma_phong) REFERENCES PHONG(ID),
    FOREIGN KEY (Ma_do_dung) REFERENCES DO_DUNG(Ma_Do_Dung)
);

CREATE TABLE Chi_tiet_phong (
    Ma_phong NVARCHAR(20),
    Ma_Do_dung NVARCHAR(20),
    PRIMARY KEY (Ma_phong, Ma_Do_dung),
    FOREIGN KEY (Ma_phong) REFERENCES PHONG(ID),
    FOREIGN KEY (Ma_Do_dung) REFERENCES DO_DUNG(Ma_Do_Dung)
);

-- ================================
-- DỮ LIỆU MẪU
-- ================================
-- (Các lệnh INSERT sẽ được giữ nguyên ở phần dưới)
-- Account
INSERT INTO Account VALUES
('user_khach1', 'pass123', 'khach1@example.com', N'Hoạt động'),
('user_nv1', 'nvpass', 'nv1@example.com', N'Hoạt động'),
('user_khach2', 'pass456', 'khach2@example.com', N'Hoạt động'),
('user_nv2', 'nvpass2', 'nv2@example.com', N'Hoạt động');

-- KHACH_HANG
INSERT INTO KHACH_HANG VALUES
('001234567891', N'Nguyễn Khách A', '0901123456', N'123 Trần Phú, Q5, TP.HCM', 'user_khach1'),
('001234567892', N'Lê Khách B', '0912345678', N'45 Nguyễn Huệ, Q1, TP.HCM', 'user_khach2');

-- NHAN_VIEN
INSERT INTO NHAN_VIEN VALUES
('NV001', N'Nguyễn Văn A', '0909090909', N'12 LTK, Q10, TP.HCM', 'user_nv1', N'Chủ doanh nghiệp'),
('NV002', N'Lê Thị B', '0919191919', N'34 NTMK, Q1, TP.HCM', 'user_nv2', N'Nhân viên');

-- Loai_Phong
INSERT INTO Loai_Phong VALUES
('LP001', N'Deluxe', N'Hướng biển', N'Phòng deluxe rộng rãi, tiện nghi cao cấp', 35, 850000, 3, N'deluxe.jpg'),
('LP002', N'Standard', N'Hướng vườn', N'Phòng standard cơ bản, đầy đủ tiện nghi', 25, 650000, 2, N'standard.jpg');

-- PHONG
INSERT INTO PHONG VALUES
('P01001', 'LP001', N'Trống'), ('P01002', 'LP001', N'Trống'), ('P01003', 'LP001', N'Trống'),
('P01004', 'LP001', N'Trống'), ('P01005', 'LP001', N'Trống'), ('P01006', 'LP001', N'Trống'),
('P01007', 'LP001', N'Trống'), ('P01008', 'LP001', N'Trống'), ('P01009', 'LP001', N'Trống'),
('P01010', 'LP001', N'Trống'), ('P02001', 'LP002', N'Trống'), ('P02002', 'LP002', N'Trống'),
('P02003', 'LP002', N'Trống'), ('P02004', 'LP002', N'Trống'), ('P02005', 'LP002', N'Trống'),
('P02006', 'LP002', N'Trống'), ('P02007', 'LP002', N'Trống'), ('P02008', 'LP002', N'Trống'),
('P02009', 'LP002', N'Trống'), ('P02010', 'LP002', N'Trống'), ('P03001', 'LP001', N'Trống'),
('P03002', 'LP001', N'Trống'), ('P03003', 'LP001', N'Trống'), ('P03004', 'LP001', N'Trống'),
('P03005', 'LP001', N'Trống'), ('P03006', 'LP002', N'Trống'), ('P03007', 'LP002', N'Trống'),
('P03008', 'LP002', N'Trống'), ('P03009', 'LP002', N'Trống'), ('P03010', 'LP002', N'Trống');

-- DO_DUNG
INSERT INTO DO_DUNG VALUES
('DD001', N'TV LG 65 inch', N'Tivi', 15000000, 30),
('DD002', N'TV Samsung 55 inch', N'Tivi', 12000000, 30),
('DD003', N'Bộ bàn ghế gỗ', N'Bàn ghế', 5000000, 30),
('DD004', N'Bộ sofa cao cấp', N'Bàn ghế', 8000000, 30),
('DD005', N'Máy sấy tóc', N'Máy sấy tóc', 500000, 30),
('DD006', N'Tủ lạnh Toshiba 90L', N'Tủ lạnh', 3000000, 30),
('DD007', N'Đèn bàn cao cấp', N'Đèn', 250000, 30),
('DD008', N'Bình đun siêu tốc', N'Đồ gia dụng', 400000, 30);

-- Nha_cung_cap
INSERT INTO Nha_cung_cap VALUES
('NCC001', N'Công ty ABC', N'123 Nguyễn Trãi, HN', '0901234567'),
('NCC002', N'Công ty XYZ', N'45 Lê Lợi, HCM', '0932345678'),
('NCC003', N'VPP Hòa Bình', N'678 Trần Hưng Đạo, ĐN', '0919876543'),
('NCC004', N'Hải Long', N'89 Lý Thường Kiệt, Huế', '0908765432');

-- NHAP_HANG
INSERT INTO NHAP_HANG (Ngay_cung_cap, Trang_thai, Tong_tien_nhap, Ma_nha_cung_cap) VALUES
('2024-01-01', N'Đã giao', 60000000, 'NCC001'),
('2024-02-01', N'Đang giao', 48000000, 'NCC002'),
('2024-03-01', N'Đã giao', 10000000, 'NCC003'),
('2024-04-01', N'Đã giao', 8000000, 'NCC004');

-- Chi_tiet_phieu_nhap
INSERT INTO Chi_tiet_phieu_nhap VALUES
(1, 'DD001', 4, 15000000),
(2, 'DD002', 4, 12000000),
(3, 'DD003', 2, 5000000),
(4, 'DD004', 1, 8000000);

-- don_dat_phong
INSERT INTO don_dat_phong (Account, Ngay_nhan, Ngay_tra, So_luong_phong, So_luong_nguoi, Ma_Loai_Phong, Trang_thai)
VALUES
('user_khach1', '2024-03-01', '2024-03-03', 1, 2, 'LP001', N'Chưa xác nhận'),
('user_khach2', '2024-03-05', '2024-03-08', 1, 2, 'LP002', N'Đã xác nhận'),
('user_khach2', '2024-03-10', '2024-03-11', 1, 1, 'LP001', N'Đã trả phòng'),
('user_khach1', '2024-03-15', '2024-03-17', 1, 3, 'LP002', N'Đã nhận phòng');

-- HOA_DON
INSERT INTO HOA_DON (Ma_don_dat_phong, Ma_nhan_vien, Tong_tien) VALUES
(3, 'NV001', 1300000);

-- Chi_tiet_hoa_don
INSERT INTO Chi_tiet_hoa_don VALUES
(1, 'P01002');

-- chi_tiet_phong_hoa_don
INSERT INTO chi_tiet_phong_hoa_don (Ma_hoa_don, Ma_phong, Ma_do_dung) VALUES
(1, 'P01002', 'DD001');

-- Chi_tiet_phong (cố định theo tầng)
-- Tầng 1: P01xx
INSERT INTO Chi_tiet_phong
SELECT p.ID, d.Ma_Do_Dung FROM PHONG p
JOIN (SELECT 'DD001' AS Ma_Do_Dung UNION ALL SELECT 'DD003' UNION ALL
      SELECT 'DD005' UNION ALL SELECT 'DD006' UNION ALL SELECT 'DD007' UNION ALL SELECT 'DD008') d
WHERE p.ID LIKE 'P01%';

-- Tầng 2: P02xx
INSERT INTO Chi_tiet_phong
SELECT p.ID, d.Ma_Do_Dung FROM PHONG p
JOIN (SELECT 'DD002' AS Ma_Do_Dung UNION ALL SELECT 'DD004' UNION ALL
      SELECT 'DD005' UNION ALL SELECT 'DD006' UNION ALL SELECT 'DD007' UNION ALL SELECT 'DD008') d
WHERE p.ID LIKE 'P02%';

-- Tầng 3: P03xx
INSERT INTO Chi_tiet_phong
SELECT p.ID, d.Ma_Do_Dung FROM PHONG p
JOIN (SELECT 'DD001' AS Ma_Do_Dung UNION ALL SELECT 'DD003' UNION ALL
      SELECT 'DD005' UNION ALL SELECT 'DD006' UNION ALL SELECT 'DD007' UNION ALL SELECT 'DD008') d
WHERE p.ID LIKE 'P03%';
