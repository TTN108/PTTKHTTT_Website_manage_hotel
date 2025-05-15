CREATE DATABASE  IF NOT EXISTS `hotel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hotel`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `Username` varchar(50) NOT NULL,
  `Password` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('user_khach1','pass123','khach1@example.com','Hoạt động'),('user_khach2','pass456','khach2@example.com','Hoạt động'),('user_nv1','nvpass','nv1@example.com','Hoạt động'),('user_nv2','nvpass2','nv2@example.com','Hoạt động'),('userkhach1','11','1111@1.1111','Hoạt động');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_hoa_don`
--

DROP TABLE IF EXISTS `chi_tiet_hoa_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_hoa_don` (
  `Ma_Hoa_Don` int NOT NULL,
  `Ma_phong` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`Ma_Hoa_Don`,`Ma_phong`),
  KEY `Ma_phong` (`Ma_phong`),
  CONSTRAINT `chi_tiet_hoa_don_ibfk_1` FOREIGN KEY (`Ma_Hoa_Don`) REFERENCES `hoa_don` (`Ma_Hoa_Don`),
  CONSTRAINT `chi_tiet_hoa_don_ibfk_2` FOREIGN KEY (`Ma_phong`) REFERENCES `phong` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_hoa_don`
--

LOCK TABLES `chi_tiet_hoa_don` WRITE;
/*!40000 ALTER TABLE `chi_tiet_hoa_don` DISABLE KEYS */;
INSERT INTO `chi_tiet_hoa_don` VALUES (1,'P01002'),(1,'P01003'),(1,'P01005');
/*!40000 ALTER TABLE `chi_tiet_hoa_don` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_phieu_nhap`
--

DROP TABLE IF EXISTS `chi_tiet_phieu_nhap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_phieu_nhap` (
  `Ma_Nhap_Hang` int NOT NULL,
  `Ma_Do_Dung` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `So_luong` int DEFAULT NULL,
  `Gia_nhap` decimal(18,2) DEFAULT NULL,
  PRIMARY KEY (`Ma_Nhap_Hang`,`Ma_Do_Dung`),
  KEY `Ma_Do_Dung` (`Ma_Do_Dung`),
  CONSTRAINT `chi_tiet_phieu_nhap_ibfk_1` FOREIGN KEY (`Ma_Nhap_Hang`) REFERENCES `nhap_hang` (`Ma_Nhap_Hang`),
  CONSTRAINT `chi_tiet_phieu_nhap_ibfk_2` FOREIGN KEY (`Ma_Do_Dung`) REFERENCES `do_dung` (`Ma_Do_Dung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_phieu_nhap`
--

LOCK TABLES `chi_tiet_phieu_nhap` WRITE;
/*!40000 ALTER TABLE `chi_tiet_phieu_nhap` DISABLE KEYS */;
INSERT INTO `chi_tiet_phieu_nhap` VALUES (1,'DD001',4,15000000.00),(2,'DD002',4,12000000.00),(3,'DD003',2,5000000.00),(4,'DD004',1,8000000.00);
/*!40000 ALTER TABLE `chi_tiet_phieu_nhap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_phong`
--

DROP TABLE IF EXISTS `chi_tiet_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_phong` (
  `Ma_phong` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Ma_Do_dung` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`Ma_phong`,`Ma_Do_dung`),
  KEY `Ma_Do_dung` (`Ma_Do_dung`),
  CONSTRAINT `chi_tiet_phong_ibfk_1` FOREIGN KEY (`Ma_phong`) REFERENCES `phong` (`ID`),
  CONSTRAINT `chi_tiet_phong_ibfk_2` FOREIGN KEY (`Ma_Do_dung`) REFERENCES `do_dung` (`Ma_Do_Dung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_phong`
--

LOCK TABLES `chi_tiet_phong` WRITE;
/*!40000 ALTER TABLE `chi_tiet_phong` DISABLE KEYS */;
INSERT INTO `chi_tiet_phong` VALUES ('P01001','DD001'),('P01002','DD001'),('P01003','DD001'),('P01004','DD001'),('P01005','DD001'),('P01006','DD001'),('P01007','DD001'),('P01008','DD001'),('P01009','DD001'),('P01010','DD001'),('P03001','DD001'),('P03002','DD001'),('P03003','DD001'),('P03004','DD001'),('P03005','DD001'),('P03006','DD001'),('P03007','DD001'),('P03008','DD001'),('P03009','DD001'),('P03010','DD001'),('P02001','DD002'),('P02002','DD002'),('P02003','DD002'),('P02004','DD002'),('P02005','DD002'),('P02006','DD002'),('P02007','DD002'),('P02008','DD002'),('P02009','DD002'),('P02010','DD002'),('P01001','DD003'),('P01002','DD003'),('P01003','DD003'),('P01004','DD003'),('P01005','DD003'),('P01006','DD003'),('P01007','DD003'),('P01008','DD003'),('P01009','DD003'),('P01010','DD003'),('P03001','DD003'),('P03002','DD003'),('P03003','DD003'),('P03004','DD003'),('P03005','DD003'),('P03006','DD003'),('P03007','DD003'),('P03008','DD003'),('P03009','DD003'),('P03010','DD003'),('P02001','DD004'),('P02002','DD004'),('P02003','DD004'),('P02004','DD004'),('P02005','DD004'),('P02006','DD004'),('P02007','DD004'),('P02008','DD004'),('P02009','DD004'),('P02010','DD004'),('P01001','DD005'),('P01002','DD005'),('P01003','DD005'),('P01004','DD005'),('P01005','DD005'),('P01006','DD005'),('P01007','DD005'),('P01008','DD005'),('P01009','DD005'),('P01010','DD005'),('P02001','DD005'),('P02002','DD005'),('P02003','DD005'),('P02004','DD005'),('P02005','DD005'),('P02006','DD005'),('P02007','DD005'),('P02008','DD005'),('P02009','DD005'),('P02010','DD005'),('P03001','DD005'),('P03002','DD005'),('P03003','DD005'),('P03004','DD005'),('P03005','DD005'),('P03006','DD005'),('P03007','DD005'),('P03008','DD005'),('P03009','DD005'),('P03010','DD005'),('P01001','DD006'),('P01002','DD006'),('P01003','DD006'),('P01004','DD006'),('P01005','DD006'),('P01006','DD006'),('P01007','DD006'),('P01008','DD006'),('P01009','DD006'),('P01010','DD006'),('P02001','DD006'),('P02002','DD006'),('P02003','DD006'),('P02004','DD006'),('P02005','DD006'),('P02006','DD006'),('P02007','DD006'),('P02008','DD006'),('P02009','DD006'),('P02010','DD006'),('P03001','DD006'),('P03002','DD006'),('P03003','DD006'),('P03004','DD006'),('P03005','DD006'),('P03006','DD006'),('P03007','DD006'),('P03008','DD006'),('P03009','DD006'),('P03010','DD006'),('P01001','DD007'),('P01002','DD007'),('P01003','DD007'),('P01004','DD007'),('P01005','DD007'),('P01006','DD007'),('P01007','DD007'),('P01008','DD007'),('P01009','DD007'),('P01010','DD007'),('P02001','DD007'),('P02002','DD007'),('P02003','DD007'),('P02004','DD007'),('P02005','DD007'),('P02006','DD007'),('P02007','DD007'),('P02008','DD007'),('P02009','DD007'),('P02010','DD007'),('P03001','DD007'),('P03002','DD007'),('P03003','DD007'),('P03004','DD007'),('P03005','DD007'),('P03006','DD007'),('P03007','DD007'),('P03008','DD007'),('P03009','DD007'),('P03010','DD007'),('P01001','DD008'),('P01002','DD008'),('P01003','DD008'),('P01004','DD008'),('P01005','DD008'),('P01006','DD008'),('P01007','DD008'),('P01008','DD008'),('P01009','DD008'),('P01010','DD008'),('P02001','DD008'),('P02002','DD008'),('P02003','DD008'),('P02004','DD008'),('P02005','DD008'),('P02006','DD008'),('P02007','DD008'),('P02008','DD008'),('P02009','DD008'),('P02010','DD008'),('P03001','DD008'),('P03002','DD008'),('P03003','DD008'),('P03004','DD008'),('P03005','DD008'),('P03006','DD008'),('P03007','DD008'),('P03008','DD008'),('P03009','DD008'),('P03010','DD008');
/*!40000 ALTER TABLE `chi_tiet_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_phong_hoa_don`
--

DROP TABLE IF EXISTS `chi_tiet_phong_hoa_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_phong_hoa_don` (
  `Ma_Hoa_Don` int NOT NULL,
  `Ma_phong` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Ma_do_dung` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`Ma_Hoa_Don`,`Ma_phong`,`Ma_do_dung`),
  KEY `Ma_phong` (`Ma_phong`),
  KEY `Ma_do_dung` (`Ma_do_dung`),
  CONSTRAINT `chi_tiet_phong_hoa_don_ibfk_1` FOREIGN KEY (`Ma_Hoa_Don`) REFERENCES `hoa_don` (`Ma_Hoa_Don`),
  CONSTRAINT `chi_tiet_phong_hoa_don_ibfk_2` FOREIGN KEY (`Ma_phong`) REFERENCES `phong` (`ID`),
  CONSTRAINT `chi_tiet_phong_hoa_don_ibfk_3` FOREIGN KEY (`Ma_do_dung`) REFERENCES `do_dung` (`Ma_Do_Dung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_phong_hoa_don`
--

LOCK TABLES `chi_tiet_phong_hoa_don` WRITE;
/*!40000 ALTER TABLE `chi_tiet_phong_hoa_don` DISABLE KEYS */;
INSERT INTO `chi_tiet_phong_hoa_don` VALUES (1,'P01002','DD001'),(1,'P01003','DD003');
/*!40000 ALTER TABLE `chi_tiet_phong_hoa_don` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `do_dung`
--

DROP TABLE IF EXISTS `do_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `do_dung` (
  `Ma_Do_Dung` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Ten` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Loai` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Gia` decimal(18,2) DEFAULT NULL,
  `So_luong` int DEFAULT NULL,
  PRIMARY KEY (`Ma_Do_Dung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `do_dung`
--

LOCK TABLES `do_dung` WRITE;
/*!40000 ALTER TABLE `do_dung` DISABLE KEYS */;
INSERT INTO `do_dung` VALUES ('DD001','TV LG 65 inch','Tivi',15000000.00,30),('DD002','TV Samsung 55 inch','Tivi',12000000.00,30),('DD003','Bộ bàn ghế gỗ','Bàn ghế',5000000.00,30),('DD004','Bộ sofa cao cấp','Bàn ghế',8000000.00,30),('DD005','Máy sấy tóc','Máy sấy tóc',500000.00,30),('DD006','Tủ lạnh Toshiba 90L','Tủ lạnh',3000000.00,30),('DD007','Đèn bàn cao cấp','Đèn',250000.00,30),('DD008','Bình đun siêu tốc','Đồ gia dụng',400000.00,30);
/*!40000 ALTER TABLE `do_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_dat_phong`
--

DROP TABLE IF EXISTS `don_dat_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_dat_phong` (
  `Ma_don_dat_phong` int NOT NULL AUTO_INCREMENT,
  `Account` varchar(50) DEFAULT NULL,
  `Ngay_nhan` date DEFAULT NULL,
  `Ngay_tra` date DEFAULT NULL,
  `So_luong_phong` int DEFAULT NULL,
  `So_luong_nguoi` int DEFAULT NULL,
  `Ma_Loai_Phong` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Ngay_dat` datetime DEFAULT CURRENT_TIMESTAMP,
  `Trang_thai` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Ma_don_dat_phong`),
  KEY `Ma_Loai_Phong` (`Ma_Loai_Phong`),
  CONSTRAINT `don_dat_phong_ibfk_1` FOREIGN KEY (`Ma_Loai_Phong`) REFERENCES `loai_phong` (`Ma_Loai_Phong`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_dat_phong`
--

LOCK TABLES `don_dat_phong` WRITE;
/*!40000 ALTER TABLE `don_dat_phong` DISABLE KEYS */;
INSERT INTO `don_dat_phong` VALUES (1,'user_khach1','2024-03-01','2024-03-03',2,2,'LP001','2025-04-22 13:52:31','Chưa xác nhận'),(2,'user_khach2','2024-03-05','2024-03-08',1,2,'LP002','2025-04-22 13:52:31','Đã xác nhận'),(3,'userkhach1','2024-03-10','2024-03-11',2,1,'LP001','2025-04-22 13:52:31','Đã trả phòng'),(4,'user_khach1','2024-03-15','2024-03-17',1,3,'LP002','2025-04-22 13:52:31','Đã nhận phòng'),(5,'userkhach1','2025-05-01','2025-05-02',1,1,'LP002','2025-05-01 21:26:15','Đã hủy'),(15,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 14:32:53','Đã xác nhận'),(16,'userkhach1','2025-05-02','2025-05-03',1,1,'LP002','2025-05-02 14:32:59','Đã hủy'),(17,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 14:33:04','Đã hủy'),(18,'userkhach1','2025-05-02','2025-05-21',6,18,'LP001','2025-05-02 14:33:15','Đã hủy'),(19,'userkhach1','2025-05-22','2025-06-04',3,20,'LP002','2025-05-02 14:33:30','Đã hủy'),(20,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 15:20:58','Đã hủy'),(21,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 15:23:33','Đã xác nhận'),(22,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 15:24:40','Đã xác nhận'),(23,'userkhach1','2025-05-02','2025-05-03',1,1,'LP002','2025-05-02 15:25:44','Đã hủy'),(24,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 15:28:15','Đã hủy'),(25,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 15:28:17','Đã hủy'),(26,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 15:28:18','Đã hủy'),(27,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 15:28:19','Đã hủy'),(28,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 15:28:19','Đã hủy'),(29,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 15:28:20','Đã hủy'),(30,'userkhach1','2025-05-02','2025-05-03',1,1,'LP001','2025-05-02 17:27:58','Đã hủy');
/*!40000 ALTER TABLE `don_dat_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don`
--

DROP TABLE IF EXISTS `hoa_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoa_don` (
  `Ma_Hoa_Don` int NOT NULL AUTO_INCREMENT,
  `Ma_don_dat_phong` int DEFAULT NULL,
  `Ma_nhan_vien` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Tong_tien` double(20,2) DEFAULT NULL,
  PRIMARY KEY (`Ma_Hoa_Don`),
  KEY `Ma_don_dat_phong` (`Ma_don_dat_phong`),
  KEY `Ma_nhan_vien` (`Ma_nhan_vien`),
  CONSTRAINT `hoa_don_ibfk_1` FOREIGN KEY (`Ma_don_dat_phong`) REFERENCES `don_dat_phong` (`Ma_don_dat_phong`),
  CONSTRAINT `hoa_don_ibfk_2` FOREIGN KEY (`Ma_nhan_vien`) REFERENCES `nhan_vien` (`Ma_nhan_vien`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don`
--

LOCK TABLES `hoa_don` WRITE;
/*!40000 ALTER TABLE `hoa_don` DISABLE KEYS */;
INSERT INTO `hoa_don` VALUES (1,3,'NV001',1300000.00);
/*!40000 ALTER TABLE `hoa_don` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_hang` (
  `CCCD` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Ten` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `SDT` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Dia_chi` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Account` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`CCCD`),
  KEY `Account` (`Account`),
  CONSTRAINT `khach_hang_ibfk_1` FOREIGN KEY (`Account`) REFERENCES `account` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
INSERT INTO `khach_hang` VALUES ('001234567891','Nguyễn Khách A','0901123456','123 Trần Phú, Q5, TP.HCM','user_khach1'),('001234567892','Lê Khách B','0912345678','45 Nguyễn Huệ, Q1, TP.HCM','user_khach2'),('001234567899999999','Cao Cát Lượng','0123456789','Thủ Đức, Việt Nam','userkhach1');
/*!40000 ALTER TABLE `khach_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loai_phong`
--

DROP TABLE IF EXISTS `loai_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_phong` (
  `Ma_Loai_Phong` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Ten_loai` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `View` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Mo_ta` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Dien_tich` int DEFAULT NULL,
  `Gia` decimal(18,2) DEFAULT NULL,
  `max_nguoi` int DEFAULT NULL,
  `picture` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`Ma_Loai_Phong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_phong`
--

LOCK TABLES `loai_phong` WRITE;
/*!40000 ALTER TABLE `loai_phong` DISABLE KEYS */;
INSERT INTO `loai_phong` VALUES ('LP001','Deluxe','Hướng biển','Phòng deluxe rộng rãi, tiện nghi cao cấp',35,850000.00,3,'imgs/deluxe.jpg'),('LP002','Standard','Hướng vườn','Phòng standard cơ bản, đầy đủ tiện nghi',25,650000.00,2,'imgs/standard.jpg');
/*!40000 ALTER TABLE `loai_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nha_cung_cap`
--

DROP TABLE IF EXISTS `nha_cung_cap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nha_cung_cap` (
  `Ma_nha_cung_cap` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Ten_nha_cung_cap` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Dia_chi` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Dien_thoai` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`Ma_nha_cung_cap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nha_cung_cap`
--

LOCK TABLES `nha_cung_cap` WRITE;
/*!40000 ALTER TABLE `nha_cung_cap` DISABLE KEYS */;
INSERT INTO `nha_cung_cap` VALUES ('NCC001','Công ty ABC','123 Nguyễn Trãi, HN','0901234567'),('NCC002','Công ty XYZ','45 Lê Lợi, HCM','0932345678'),('NCC003','VPP Hòa Bình','678 Trần Hưng Đạo, ĐN','0919876543'),('NCC004','Hải Long','89 Lý Thường Kiệt, Huế','0908765432');
/*!40000 ALTER TABLE `nha_cung_cap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_vien` (
  `Ma_nhan_vien` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Ten` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `SDT` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Dia_chi` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Account` varchar(50) DEFAULT NULL,
  `Chuc_vu` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`Ma_nhan_vien`),
  KEY `Account` (`Account`),
  CONSTRAINT `nhan_vien_ibfk_1` FOREIGN KEY (`Account`) REFERENCES `account` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien`
--

LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */;
INSERT INTO `nhan_vien` VALUES ('NV001','Nguyễn Văn A','0909090909','12 LTK, Q10, TP.HCM','user_nv1','Chủ doanh nghiệp'),('NV002','Lê Thị B','0919191919','34 NTMK, Q1, TP.HCM','user_nv2','Nhân viên');
/*!40000 ALTER TABLE `nhan_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhap_hang`
--

DROP TABLE IF EXISTS `nhap_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhap_hang` (
  `Ma_Nhap_Hang` int NOT NULL AUTO_INCREMENT,
  `Ngay_cung_cap` date DEFAULT NULL,
  `Trang_thai` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Tong_tien_nhap` decimal(18,2) DEFAULT NULL,
  `Ma_nha_cung_cap` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`Ma_Nhap_Hang`),
  KEY `Ma_nha_cung_cap` (`Ma_nha_cung_cap`),
  CONSTRAINT `nhap_hang_ibfk_1` FOREIGN KEY (`Ma_nha_cung_cap`) REFERENCES `nha_cung_cap` (`Ma_nha_cung_cap`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhap_hang`
--

LOCK TABLES `nhap_hang` WRITE;
/*!40000 ALTER TABLE `nhap_hang` DISABLE KEYS */;
INSERT INTO `nhap_hang` VALUES (1,'2024-01-01','Đã giao',60000000.00,'NCC001'),(2,'2024-02-01','Đang giao',48000000.00,'NCC002'),(3,'2024-03-01','Đã giao',10000000.00,'NCC003'),(4,'2024-04-01','Đã giao',8000000.00,'NCC004');
/*!40000 ALTER TABLE `nhap_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phong`
--

DROP TABLE IF EXISTS `phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phong` (
  `ID` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Ma_Loai_Phong` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Trang_thai` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `Ma_Loai_Phong` (`Ma_Loai_Phong`),
  CONSTRAINT `phong_ibfk_1` FOREIGN KEY (`Ma_Loai_Phong`) REFERENCES `loai_phong` (`Ma_Loai_Phong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phong`
--

LOCK TABLES `phong` WRITE;
/*!40000 ALTER TABLE `phong` DISABLE KEYS */;
INSERT INTO `phong` VALUES ('P01001','LP001','Trống'),('P01002','LP001','Trống'),('P01003','LP001','Trống'),('P01004','LP001','Trống'),('P01005','LP001','Trống'),('P01006','LP001','Trống'),('P01007','LP001','Trống'),('P01008','LP001','Trống'),('P01009','LP001','Trống'),('P01010','LP001','Trống'),('P02001','LP002','Trống'),('P02002','LP002','Trống'),('P02003','LP002','Trống'),('P02004','LP002','Trống'),('P02005','LP002','Trống'),('P02006','LP002','Trống'),('P02007','LP002','Trống'),('P02008','LP002','Trống'),('P02009','LP002','Trống'),('P02010','LP002','Trống'),('P03001','LP001','Trống'),('P03002','LP001','Trống'),('P03003','LP001','Trống'),('P03004','LP001','Trống'),('P03005','LP001','Trống'),('P03006','LP002','Trống'),('P03007','LP002','Trống'),('P03008','LP002','Trống'),('P03009','LP002','Trống'),('P03010','LP002','Trống');
/*!40000 ALTER TABLE `phong` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-05 13:20:57
