-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: db_ipk
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_roles`
--

DROP TABLE IF EXISTS `admin_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_roles` (
  `admin_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`admin_id`,`role_id`),
  KEY `fk_ar_role` (`role_id`),
  CONSTRAINT `fk_ar_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ar_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_roles`
--

LOCK TABLES `admin_roles` WRITE;
/*!40000 ALTER TABLE `admin_roles` DISABLE KEYS */;
INSERT INTO `admin_roles` VALUES (1,1,'2026-11-05 19:53:55'),(2,2,'2026-11-05 19:53:55'),(3,4,'2026-11-07 06:00:08');
/*!40000 ALTER TABLE `admin_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('superadmin','admin','data_admin','data_verifikator','content_admin','service_admin') NOT NULL DEFAULT 'admin',
  `status` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  `remember_token` varchar(255) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Rayendra','ray','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','superadmin','aktif','','',''),(2,'Admin 2','Admin2','$2y$10$iYqHK3jUXiB34qYj396Yn.kjdSKyrRwGr/FUJb9uF1Vf6VVzJTZbe','admin','aktif','','',''),(3,'Bin Saleh','bsaleh','$2b$10$ITeOPxgBKstzdHWkDvKCLeo/w2x5eARMbblp8BsujGgcJYWrTGT5S','data_verifikator','aktif','','','suhebat@gmail.com');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `cegah_ganda_superadmin` BEFORE INSERT ON `admins` FOR EACH ROW BEGIN
    IF NEW.role = 'superadmin' THEN
        IF (SELECT COUNT(*) FROM admins WHERE role = 'superadmin') >= 1 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Gagal: Sistem hanya mengizinkan 1 Super Admin!';
        END IF;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `dasar_hukum`
--

DROP TABLE IF EXISTS `dasar_hukum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dasar_hukum` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nomor_urut` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Urutan tampilan (kecil = atas)',
  `badge` varchar(100) NOT NULL COMMENT 'Jenis: Peraturan Menteri / Keputusan Menteri',
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `file_url` varchar(500) NOT NULL COMMENT 'Path relatif di public/ atau URL penuh',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_dasar_hukum_active_urut` (`is_active`,`nomor_urut`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dasar_hukum`
--

LOCK TABLES `dasar_hukum` WRITE;
/*!40000 ALTER TABLE `dasar_hukum` DISABLE KEYS */;
INSERT INTO `dasar_hukum` VALUES (1,1,'Peraturan Menteri','Permendikbudristek No. 55 Tahun 2022','Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi tentang Indeks Pembangunan Kebudayaan','/docs/dasar-hukum/permendikbudristek_no_55_tahun_2022.pdf',1,'2026-11-05 01:57:42','2026-11-06 14:43:08'),(2,2,'Keputusan Menteri','Kepmendikbudristek No. 512 Tahun 2022','Hasil Indeks Pembangunan Kebudayaan Tahun 2021','/docs/dasar-hukum/kepmendikbudristek_no_512_m_2022_hasil_2021.pdf',1,'2026-11-05 01:57:42','2026-11-05 01:57:42'),(3,3,'Keputusan Menteri','Kepmendikbudristek No. 297 Tahun 2023','Hasil Indeks Pembangunan Kebudayaan Tahun 2022','/docs/dasar-hukum/kepmendikbudristek_no_297_m_2023_hasil_2022.pdf',1,'2026-11-05 01:57:42','2026-11-05 01:57:42'),(4,4,'Keputusan Menteri','Kepmendikbudristek No. 248 Tahun 2024','Hasil Indeks Pembangunan Kebudayaan Tahun 2023','/docs/dasar-hukum/kepmendikbudristek_no_248_m_2024_hasil_2023.pdf',1,'2026-11-05 01:57:42','2026-11-05 01:57:42'),(5,5,'Keputusan Menteri','Kepmenbud No. 215 Tahun 2025','Hasil Indeks Pembangunan Kebudayaan Tahun 2024','/docs/dasar-hukum/kepmen_ipk_tahun_2024_hasil_2024.pdf',1,'2026-11-05 01:57:42','2026-11-05 01:57:42');
/*!40000 ALTER TABLE `dasar_hukum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_pengajuan`
--

DROP TABLE IF EXISTS `data_pengajuan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_pengajuan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `jenis` enum('nasional','provinsi') NOT NULL,
  `tahun` int(11) NOT NULL,
  `kode_provinsi` varchar(5) DEFAULT NULL,
  `status` enum('draft','submitted','approved','rejected','published') NOT NULL DEFAULT 'draft',
  `catatan_verifikator` text DEFAULT NULL,
  `dibuat_oleh` int(11) DEFAULT NULL,
  `diverifikasi_oleh` int(11) DEFAULT NULL,
  `dipublish_oleh` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `submitted_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status_jenis` (`status`,`jenis`,`tahun`),
  KEY `idx_prov_tahun` (`kode_provinsi`,`tahun`)
) ENGINE=InnoDB AUTO_INCREMENT=2026 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_pengajuan`
--

LOCK TABLES `data_pengajuan` WRITE;
/*!40000 ALTER TABLE `data_pengajuan` DISABLE KEYS */;
INSERT INTO `data_pengajuan` VALUES (2025,'nasional',2025,NULL,'draft',NULL,1,NULL,NULL,'2026-11-07 09:27:34','2026-11-07 09:48:16',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `data_pengajuan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_pengajuan_log`
--

DROP TABLE IF EXISTS `data_pengajuan_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_pengajuan_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pengajuan_id` bigint(20) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `aksi` varchar(40) NOT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pengajuan` (`pengajuan_id`),
  CONSTRAINT `fk_dpl` FOREIGN KEY (`pengajuan_id`) REFERENCES `data_pengajuan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_pengajuan_log`
--

LOCK TABLES `data_pengajuan_log` WRITE;
/*!40000 ALTER TABLE `data_pengajuan_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_pengajuan_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_pengajuan_nasional`
--

DROP TABLE IF EXISTS `data_pengajuan_nasional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_pengajuan_nasional` (
  `pengajuan_id` bigint(20) NOT NULL,
  `skor_ipk` decimal(5,2) NOT NULL,
  `skor_dimensi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`skor_dimensi`)),
  PRIMARY KEY (`pengajuan_id`),
  CONSTRAINT `fk_dpn` FOREIGN KEY (`pengajuan_id`) REFERENCES `data_pengajuan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_pengajuan_nasional`
--

LOCK TABLES `data_pengajuan_nasional` WRITE;
/*!40000 ALTER TABLE `data_pengajuan_nasional` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_pengajuan_nasional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_pengajuan_provinsi`
--

DROP TABLE IF EXISTS `data_pengajuan_provinsi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_pengajuan_provinsi` (
  `pengajuan_id` bigint(20) NOT NULL,
  `skor_ipk` decimal(5,2) NOT NULL,
  `skor_dimensi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`skor_dimensi`)),
  PRIMARY KEY (`pengajuan_id`),
  CONSTRAINT `fk_dpp` FOREIGN KEY (`pengajuan_id`) REFERENCES `data_pengajuan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_pengajuan_provinsi`
--

LOCK TABLES `data_pengajuan_provinsi` WRITE;
/*!40000 ALTER TABLE `data_pengajuan_provinsi` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_pengajuan_provinsi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dimension_methodologies`
--

DROP TABLE IF EXISTS `dimension_methodologies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dimension_methodologies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dimension_id` int(11) NOT NULL,
  `year_start` year(4) NOT NULL,
  `year_end` year(4) DEFAULT NULL,
  `definisi_operasional` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_dimension_id` (`dimension_id`),
  CONSTRAINT `fk_dimension_methodologies_dimension` FOREIGN KEY (`dimension_id`) REFERENCES `dimensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dimension_methodologies`
--

LOCK TABLES `dimension_methodologies` WRITE;
/*!40000 ALTER TABLE `dimension_methodologies` DISABLE KEYS */;
INSERT INTO `dimension_methodologies` VALUES (1,1,2018,2023,'Aktivitas ekonomi yang tercipta sebagai hasil dari pemanfaatan Objek Pemajuan Kebudayaan.'),(2,2,2018,2023,'Usaha sadar dan terencana untuk mewujudkan suasana belajar dan proses pembelajaran yang inklusif agar peserta didik secara aktif mengembangkan potensi dirinya dalam bidang Seni, Budaya, dan Bahasa.'),(3,3,2018,2023,'Ketahanan Sosial Budaya dalam konteks penyusunan IPK didefinisikan sebagai kemampuan suatu kebudayaan dalam mempertahankan dan mengembangkan identitas, pengetahuan, serta praktik budayanya yang relevan yang didukung oleh kondisi sosial dalam masyarakat.'),(4,4,2018,2023,'Upaya yang dilakukan seluruh pihak (masyarakat dan pemerintah) terhadap pelestarian Objek Pemajuan Kebudayaan dan Cagar Budaya.'),(5,5,2018,2023,'Segala aktivitas yang dilakukan untuk mendukung proses penciptaan karya budaya yang dihasilkan masyarakat.'),(6,6,2018,2023,'Aktivitas serta sarana/prasarana pendukung dalam memperoleh, menguji kesahihan, dan menghasilkan informasi dan pengetahuan untuk pemberdayaan kecakapan masyarakat.'),(7,7,2018,2023,'Persamaan hak, tanggung jawab dan peluang yang setara antara perempuan dan laki-laki di ruang publik untuk berpartisipasi dalam kegiatan pembangunan.'),(8,1,2024,NULL,'Kontribusi aktivitas ekonomi kebudayaan terhadap perekonomian dan kesejahteraan yang berkelanjutan.'),(9,2,2024,NULL,'Kontribusi kebudayaan melalui bidang pendidikan untuk menciptakan pembangunan kebudayaan yang inklusif dalam keberagaman yang lestari.'),(10,3,2024,NULL,'Kontribusi kebudayaan terhadap pengembangan identitias social kebangsaan melalui kegiatan yang membangun rasa toleransi dan kohesi sosial.'),(11,4,2024,NULL,'Upaya pemajuan kebudayaan berkelanjutan melalui pelestarian objek benda dan takbenda.'),(12,5,2024,NULL,'Interaksi dinamis dan kondusif dalam masyarakat sebagai bentuk kebebasan berekspresi dan promosi budaya.'),(13,6,2024,NULL,'Kemampuan dan disiplin masyarakat dalam mencari, memperoleh dan memanfaatkan ilmu pengetahuan dalam mendukung pembangunan berkelanjutan.'),(14,7,2024,NULL,'Kesetaraan hak, kesempatan, dan tanggung jawab di antara masyarakat untuk berpartisipasi dalam pembangunan kebudayaan berkelanjutan.');
/*!40000 ALTER TABLE `dimension_methodologies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dimensions`
--

DROP TABLE IF EXISTS `dimensions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dimensions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dimensions`
--

LOCK TABLES `dimensions` WRITE;
/*!40000 ALTER TABLE `dimensions` DISABLE KEYS */;
INSERT INTO `dimensions` VALUES (1,'ekonomi','Ekonomi Budaya'),(2,'pendidikan','Pendidikan'),(3,'ketahanan','Ketahanan Sosial'),(4,'warisan','Warisan Budaya'),(5,'ekspresi','Ekspresi Budaya'),(6,'literasi','Budaya Literasi'),(7,'gender','Gender');
/*!40000 ALTER TABLE `dimensions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `download_survey`
--

DROP TABLE IF EXISTS `download_survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `download_survey` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `bidang_pekerjaan` varchar(100) NOT NULL,
  `tujuan_unduh` varchar(255) NOT NULL,
  `jenis_unduh` varchar(20) NOT NULL COMMENT 'pdf | excel',
  `halaman` varchar(40) NOT NULL COMMENT 'nasional | provinsi',
  `tahun` int(11) DEFAULT NULL,
  `provinsi` varchar(100) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_created` (`created_at`),
  KEY `idx_halaman` (`halaman`),
  KEY `idx_jenis` (`jenis_unduh`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `download_survey`
--

LOCK TABLES `download_survey` WRITE;
/*!40000 ALTER TABLE `download_survey` DISABLE KEYS */;
INSERT INTO `download_survey` VALUES (62,'suasua','suhebat@gmail.com','Swasta / Profesional','Tugas Kuliah / Akademik','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 07:18:25'),(63,'susaaas','suhebat@gmail.com','Media / Jurnalis','Publikasi / Liputan','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 07:39:57'),(64,'susaaas','suhebat@gmail.com','Media / Jurnalis','Publikasi / Liputan','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 07:49:08'),(65,'usasaua','suhebat@gmail.com','Swasta / Profesional','Tugas Kuliah / Akademik','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 08:55:36'),(66,'usasaua','suhebat@gmail.com','Swasta / Profesional','Tugas Kuliah / Akademik','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 08:58:47'),(67,'usasaua','suhebat@gmail.com','Swasta / Profesional','Tugas Kuliah / Akademik','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 09:29:18'),(68,'usasaua','suhebat@gmail.com','Swasta / Profesional','Tugas Kuliah / Akademik','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 09:31:24'),(69,'susu','suhebat@gmail.com','Swasta / Profesional','Perumusan Kebijakan','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 10:14:15'),(70,'susu','suhebat@gmail.com','Swasta / Profesional','Penelitian / Riset','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 10:23:24'),(71,'sasa','suhebat@gmail.com','Swasta / Profesional','Penelitian / Riset','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-02 10:36:07'),(87,'sawa','suhebat@gmail.com','Akademisi / Peneliti','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 07:38:37'),(88,'sawa','suhebat@gmail.com','Akademisi / Peneliti','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 07:39:05'),(89,'sute','suhebat@gmail.com','Swasta / Profesional','Publikasi / Liputan','pending','hasil-nasional',2024,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 07:48:40'),(90,'sute','suhebat@gmail.com','Swasta / Profesional','Publikasi / Liputan','pending','hasil-nasional',2024,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 07:49:28'),(91,'sute','suhebat@gmail.com','Swasta / Profesional','Publikasi / Liputan','pending','hasil-nasional',2024,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 07:49:50'),(92,'sute','suhebat@gmail.com','Swasta / Profesional','Publikasi / Liputan','pending','hasil-nasional',2023,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 07:50:49'),(93,'sute','suhebat@gmail.com','Swasta / Profesional','Publikasi / Liputan','pending','hasil-nasional',2023,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 07:53:44'),(94,'sdsd','suhebat@gmail.com','Swasta / Profesional','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:02:08'),(95,'uhu','suhebat@gmail.com','LSM / Organisasi Masyarakat','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:13:01'),(96,'uhu','suhebat@gmail.com','LSM / Organisasi Masyarakat','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:13:25'),(97,'uhu','suhebat@gmail.com','LSM / Organisasi Masyarakat','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:15:02'),(98,'sude','suhebat@gmail.com','Lainnya','Tugas Kuliah / Akademik','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:22:30'),(99,'sude','suhebat@gmail.com','Lainnya','Tugas Kuliah / Akademik','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:23:01'),(100,'sude','suhebat@gmail.com','Lainnya','Tugas Kuliah / Akademik','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:23:18'),(101,'sude','suhebat@gmail.com','Lainnya','Tugas Kuliah / Akademik','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:23:52'),(102,'dsds','suhebat@gmail.com','LSM / Organisasi Masyarakat','Tugas Kuliah / Akademik','pending','hasil-nasional',2024,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:26:03'),(103,'dsds','suhebat@gmail.com','LSM / Organisasi Masyarakat','Tugas Kuliah / Akademik','pending','hasil-nasional',2024,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:26:17'),(104,'fdfd','suhebat@gmail.com','Media / Jurnalis','Penelitian / Riset','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:26:55'),(105,'fdfd','suhebat@gmail.com','Media / Jurnalis','Penelitian / Riset','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:27:14'),(106,'dsd','suhebat@gmail.com','Media / Jurnalis','Perumusan Kebijakan','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:36:40'),(107,'dsd','suhebat@gmail.com','Media / Jurnalis','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:36:55'),(108,'dsd','suhebat@gmail.com','Media / Jurnalis','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:37:20'),(109,'dss','suhebat@gmail.com','LSM / Organisasi Masyarakat','Tugas Kuliah / Akademik','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:40:09'),(110,'dss','suhebat@gmail.com','LSM / Organisasi Masyarakat','Tugas Kuliah / Akademik','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 08:48:54'),(111,'sdsd','suhebat@gmail.com','Lainnya','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 09:02:40'),(112,'sdsd','suhebat@gmail.com','Lainnya','Penelitian / Riset','pending','hasil-provinsi',2024,'Dataset: provinsi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 09:03:02'),(113,'susu','suhebat@gmail.com','Pemerintah / BUMN','Penelitian / Riset','excel','dataset',NULL,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 11:41:23'),(114,'suge','suhebat@gmail.com','Lainnya','Penelitian / Riset','excel','dataset',NULL,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 11:52:51'),(115,'suge','suhebat@gmail.com','Lainnya','Penelitian / Riset','excel','dataset',2024,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-03 11:53:21'),(116,'jajal','suhebat@gmail.com','Swasta / Profesional','Penelitian / Riset','pending','hasil-nasional',2024,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:13:44'),(117,'jajala','suhebat@gmail.com','Media / Jurnalis','Penelitian / Riset','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:23:22'),(118,'jajala','suhebat@gmail.com','Media / Jurnalis','Penelitian / Riset','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:30:38'),(119,'jajala','suhebat@gmail.com','Media / Jurnalis','Penelitian / Riset','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:30:43'),(120,'jajala','suhebat@gmail.com','Media / Jurnalis','Penelitian / Riset','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:30:51'),(121,'jajala','suhebat@gmail.com','Media / Jurnalis','Penelitian / Riset','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:31:20'),(122,'sujajajl','suhebat@gmail.com','LSM / Organisasi Masyarakat','Perumusan Kebijakan','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:32:28'),(123,'sujajajl','suhebat@gmail.com','LSM / Organisasi Masyarakat','Perumusan Kebijakan','pending','metodologi',NULL,'Dataset: metodologi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:32:42'),(124,'jajal','suhebat@gmail.com','Media / Jurnalis','Publikasi / Liputan','pending','hasil-nasional',2024,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:33:10'),(125,'jajal','suhebat@gmail.com','Media / Jurnalis','Publikasi / Liputan','pending','hasil-nasional',2024,'Dataset: nasional','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-04 11:33:25');
/*!40000 ALTER TABLE `download_survey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faqs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kategori` varchar(50) NOT NULL,
  `pertanyaan` text NOT NULL,
  `jawaban` text NOT NULL,
  `urutan` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_faq_kategori` (`kategori`),
  KEY `idx_faq_active_urutan` (`is_active`,`urutan`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqs`
--

LOCK TABLES `faqs` WRITE;
/*!40000 ALTER TABLE `faqs` DISABLE KEYS */;
INSERT INTO `faqs` VALUES (1,'umum','Apa itu Indeks Pembangunan Kebudayaan?','Indeks Pembangunan Kebudayaan (IPK) merupakan instrumen yang digunakan untuk mengukur capaian pembangunan kebudayaan di Indonesia secara komprehensif melalui sejumlah dimensi dan indikator kebudayaan.',1,1,'2026-10-28 19:43:14','2026-10-28 19:43:14'),(2,'umum','Apa tujuan penyusunan IPK?','IPK disusun untuk memberikan gambaran mengenai kondisi pembangunan kebudayaan, menjadi dasar pemantauan capaian pembangunan kebudayaan, serta mendukung perencanaan kebijakan berbasis data.',2,1,'2026-10-28 19:43:14','2026-10-28 19:43:14'),(3,'umum','Siapa yang menggunakan data IPK?','Data IPK dapat digunakan oleh pemerintah pusat dan daerah, perencana pembangunan, akademisi, peneliti, pelaku kebudayaan, serta masyarakat untuk memahami kondisi pembangunan kebudayaan.',3,1,'2026-10-28 19:43:14','2026-10-28 19:43:14'),(4,'metodologi','Apa saja dimensi yang diukur dalam IPK?','IPK mengukur pembangunan kebudayaan melalui tujuh dimensi, yaitu Ekonomi Budaya, Pendidikan, Ketahanan Sosial Budaya, Warisan Budaya, Ekspresi Budaya, Budaya Literasi, dan Gender.',4,1,'2026-10-28 19:43:14','2026-10-28 19:43:14'),(5,'metodologi','Bagaimana nilai IPK dihitung?','Nilai IPK dihitung berdasarkan indikator yang membentuk masing-masing dimensi. Setiap indikator diolah dan diagregasikan sesuai metodologi yang telah ditetapkan untuk menghasilkan nilai indeks.',5,1,'2026-10-28 19:43:14','2026-10-28 19:43:14'),(6,'metodologi','Apa perbedaan dimensi dan indikator IPK?','Dimensi merupakan kelompok besar aspek pembangunan kebudayaan yang diukur, sedangkan indikator merupakan variabel yang digunakan untuk menggambarkan dan mengukur setiap dimensi tersebut.',6,1,'2026-10-28 19:43:14','2026-10-28 19:43:14'),(7,'data','Di mana saya dapat melihat data IPK?','Data IPK dapat dilihat melalui portal IPK pada bagian Data & Hasil. Pengguna dapat melihat profil IPK nasional, provinsi, serta berbagai visualisasi dan analisis yang tersedia.',7,1,'2026-10-28 19:43:14','2026-10-28 19:43:14'),(8,'data','Apakah data IPK tersedia untuk setiap provinsi?','Data IPK tersedia untuk tingkat nasional dan provinsi sesuai periode data yang telah dipublikasikan. Ketersediaan data dapat berbeda berdasarkan tahun dan tingkat wilayah.',8,1,'2026-10-28 19:43:14','2026-10-28 19:43:14'),(9,'Umum','Di mana saya dapat mengunduh publikasi IPK?','Publikasi IPK dapat diakses melalui menu Publikasi. Pada halaman tersebut tersedia koleksi buku digital, dataset IPK Nasional dan Provinsi, serta metadata dari tiap-tiap indikator.',9,1,'2026-10-28 19:43:14','2026-11-08 15:51:28'),(10,'Umum','Apakah publikasi IPK tersedia dalam format digital?','Ya. Publikasi yang tersedia pada portal dapat disediakan dalam format digital seperti PDF dan format data lainnya sesuai jenis publikasinya.',10,1,'2026-10-28 19:43:14','2026-11-08 15:38:27'),(11,'layanan','Bagaimana cara mengajukan permohonan data IPK?','Permohonan data dapat dilakukan melalui layanan Permohonan Data yang tersedia pada portal IPK. Pengguna dapat mengikuti prosedur dan melengkapi informasi yang diperlukan pada formulir permohonan.',11,1,'2026-10-28 19:43:14','2026-10-28 19:43:14'),(12,'layanan','Bagaimana jika saya memiliki pertanyaan lain?','Jika informasi yang dicari belum tersedia dalam FAQ, pengguna dapat menghubungi layanan kontak IPK untuk mendapatkan informasi lebih lanjut.',12,1,'2026-10-28 19:43:14','2026-10-28 19:43:14');
/*!40000 ALTER TABLE `faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ipk_nasional_tahunan`
--

DROP TABLE IF EXISTS `ipk_nasional_tahunan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ipk_nasional_tahunan` (
  `tahun` year(4) NOT NULL,
  `dimensi_1` decimal(5,2) DEFAULT NULL,
  `dimensi_2` decimal(5,2) DEFAULT NULL,
  `dimensi_3` decimal(5,2) DEFAULT NULL,
  `dimensi_4` decimal(5,2) DEFAULT NULL,
  `dimensi_5` decimal(5,2) DEFAULT NULL,
  `dimensi_6` decimal(5,2) DEFAULT NULL,
  `dimensi_7` decimal(5,2) DEFAULT NULL,
  `skor_ipk` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ipk_nasional_tahunan`
--

LOCK TABLES `ipk_nasional_tahunan` WRITE;
/*!40000 ALTER TABLE `ipk_nasional_tahunan` DISABLE KEYS */;
INSERT INTO `ipk_nasional_tahunan` VALUES (0000,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00),(2018,30.55,69.67,72.84,41.11,36.57,55.03,54.97,53.74),(2019,33.79,72.49,73.55,43.89,37.14,59.11,54.57,55.91),(2020,26.96,71.26,74.01,41.00,35.82,61.63,58.01,54.65),(2021,20.69,68.71,66.83,46.63,27.13,54.29,58.55,51.90),(2022,26.88,72.53,69.25,48.92,31.48,57.40,59.30,55.13),(2023,29.50,73.35,70.73,51.54,34.91,60.49,58.71,57.13),(2024,31.25,73.41,75.71,54.93,39.85,64.40,57.51,59.98);
/*!40000 ALTER TABLE `ipk_nasional_tahunan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_aktivitas`
--

DROP TABLE IF EXISTS `log_aktivitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_aktivitas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL,
  `aktivitas` varchar(255) NOT NULL,
  `nama_file` varchar(255) DEFAULT NULL,
  `kategori` varchar(100) DEFAULT 'Upload',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_log_admins` (`admin_id`),
  CONSTRAINT `fk_log_admins` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_aktivitas`
--

LOCK TABLES `log_aktivitas` WRITE;
/*!40000 ALTER TABLE `log_aktivitas` DISABLE KEYS */;
INSERT INTO `log_aktivitas` VALUES (12,1,'Login ke panel admin',NULL,'Auth','2026-11-03 11:56:32'),(13,1,'Login ke panel admin',NULL,'Auth','2026-11-05 10:59:42'),(14,2,'Login ke panel admin',NULL,'Auth','2026-11-05 12:06:07'),(15,1,'Login ke panel admin',NULL,'Auth','2026-11-05 12:14:37'),(16,2,'Login ke panel admin',NULL,'Auth','2026-11-05 13:12:03'),(17,1,'Login ke panel admin',NULL,'Auth','2026-11-05 13:13:50'),(18,1,'Login ke panel admin',NULL,'Auth','2026-11-05 21:11:01'),(19,3,'Login ke panel admin',NULL,'Auth','2026-11-05 22:25:53'),(20,3,'Login ke panel admin',NULL,'Auth','2026-11-06 06:05:40'),(21,1,'Login ke panel admin',NULL,'Auth','2026-11-06 06:22:21'),(22,3,'Login ke panel admin',NULL,'Auth','2026-11-06 06:22:59'),(23,3,'Login ke panel admin',NULL,'Auth','2026-11-06 06:26:12'),(24,3,'Login ke panel admin',NULL,'Auth','2026-11-06 06:31:50'),(25,3,'Login ke panel admin',NULL,'Auth','2026-11-06 06:50:39'),(26,1,'Login ke panel admin',NULL,'Auth','2026-11-06 06:50:59'),(27,3,'Login ke panel admin',NULL,'Auth','2026-11-06 06:51:39'),(28,1,'Login ke panel admin',NULL,'Auth','2026-11-06 07:30:33'),(29,3,'Login ke panel admin',NULL,'Auth','2026-11-06 07:41:12'),(30,2,'Login ke panel admin',NULL,'Auth','2026-11-06 07:44:12'),(31,3,'Login ke panel admin',NULL,'Auth','2026-11-06 07:49:49'),(32,1,'Login ke panel admin',NULL,'Auth','2026-11-06 07:51:07'),(33,3,'Login ke panel admin',NULL,'Auth','2026-11-06 07:55:16'),(34,1,'Login ke panel admin',NULL,'Auth','2026-11-06 07:57:25'),(35,3,'Login ke panel admin',NULL,'Auth','2026-11-06 07:57:49'),(36,3,'Login ke panel admin',NULL,'Auth','2026-11-06 11:08:43'),(37,1,'Login ke panel admin',NULL,'Auth','2026-11-06 11:10:57'),(38,3,'Login ke panel admin',NULL,'Auth','2026-11-06 11:13:58'),(39,1,'Login ke panel admin',NULL,'Auth','2026-11-07 04:46:25'),(40,3,'Login ke panel admin',NULL,'Auth','2026-11-07 06:00:29'),(41,1,'Login ke panel admin',NULL,'Auth','2026-11-07 08:53:31'),(42,1,'Login ke panel admin',NULL,'Auth','2026-11-07 09:29:56'),(43,1,'Login ke panel admin',NULL,'Auth','2026-11-08 06:57:44'),(44,1,'Login ke panel admin',NULL,'Auth','2026-11-08 10:01:08'),(45,1,'Login ke panel admin',NULL,'Auth','2026-11-09 08:09:15'),(46,1,'Login ke panel admin',NULL,'Auth','2026-11-09 10:54:22'),(47,1,'Login ke panel admin',NULL,'Auth','2026-11-09 21:57:23'),(48,1,'Login ke panel admin',NULL,'Auth','2026-11-10 06:26:14'),(49,1,'Login ke panel admin',NULL,'Auth','2026-11-12 10:23:20');
/*!40000 ALTER TABLE `log_aktivitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metadata_indikator`
--

DROP TABLE IF EXISTS `metadata_indikator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `metadata_indikator` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kode_indikator` varchar(50) DEFAULT NULL COMMENT 'Contoh: IPK-EKONOMI-01',
  `tahun` int(11) NOT NULL DEFAULT 2024,
  `dimensi` varchar(100) NOT NULL COMMENT 'Contoh: Ekonomi Budaya, Pendidikan, Warisan Budaya',
  `nama_indikator` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `konsep_definisi` text NOT NULL COMMENT 'Batasan, cakupan, dan definisi operasional',
  `interpretasi` text NOT NULL COMMENT 'Makna angka naik/turun',
  `contoh_interpretasi` text DEFAULT NULL COMMENT 'Contoh kontekstual capaian provinsi/wilayah',
  `rumus_perhitungan` text DEFAULT NULL COMMENT 'Teks atau formula rumus perhitungan',
  `rumus_pembilang` text DEFAULT NULL COMMENT 'Numerator (Variabel Pembangun 1)',
  `rumus_penyebut` text DEFAULT NULL COMMENT 'Denominator (Variabel Pembangun 2)',
  `variabel_pembangun` text DEFAULT NULL COMMENT 'Daftar variabel penyusun (bisa JSON / list teks)',
  `kegiatan_penghasil` varchar(255) NOT NULL COMMENT 'Contoh: Susenas Modul, Dapodik, Sakernas',
  `ukuran_satuan` varchar(50) DEFAULT 'Persen' COMMENT 'Contoh: Persen, Rasio, Indeks',
  `waktu_ketersediaan` varchar(50) DEFAULT 'Tahunan',
  `level_estimasi` varchar(100) DEFAULT 'Nasional, provinsi',
  `dapat_diakses_umum` enum('Ya','Tidak') DEFAULT 'Ya',
  `publikasi_terkait` varchar(255) DEFAULT 'Website IPK dan eBook IPK',
  `urutan` int(11) DEFAULT 0 COMMENT 'Urutan tampil di web',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_dimensi` (`dimensi`),
  KEY `idx_kegiatan` (`kegiatan_penghasil`),
  KEY `idx_tahun` (`tahun`),
  FULLTEXT KEY `idx_search` (`nama_indikator`,`konsep_definisi`,`interpretasi`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metadata_indikator`
--

LOCK TABLES `metadata_indikator` WRITE;
/*!40000 ALTER TABLE `metadata_indikator` DISABLE KEYS */;
INSERT INTO `metadata_indikator` VALUES (1,'IPK-EKO-01',2024,'Ekonomi Budaya','Persentase penduduk yang terlibat sebagai pelaku/pendukung pertunjukan seni yang menjadikan keterlibatannya itu sebagai sumber penghasilan','persentase-penduduk-terlibat-pelaku-pertunjukan-seni-berpenghasilan','Proporsi dari penduduk usia 15 tahun ke atas yang pernah terlibat sebagai pelaku/pendukung pertunjukan seni (seni musik, seni rupa, seni sastra, seni tari, film, seni media, seni teater) dan menjadikannya sebagai sumber penghasilan utama ataupun tambahan dalam satu tahun terakhir terhadap jumlah penduduk berusia 15 tahun keatas. Pelaku dan pendukung merupakan tenaga kebudayaan yang bergiat, bekerja, dan/atau berkarya dalam bidang yang berkaitan dengan Objek Pemajuan Kebudayaan. Tidak ada batasan jumlah pelaku/pendukung seni, asalkan dapat menghasilkan suatu karya, dilakukan di suatu tempat khusus, dan bisa dinikmati orang lain. Sumber penghasilan yang dimaksud disini adalah bahwa upah/imbalan dari keterlibatan dalam pertunjukan/pameran/produksi seni oleh responden dianggap sebagai salah satu sumber penghasilan rumah tangga.','Semakin tinggi nilai indikator ini maka semakin banyak penduduk yang mendapatkan manfaat berupa penghasilan dari aktifitasnya sebagai pelaku/pendukung pertunjukan seni. Nilai indikator yang tinggi menunjukkan bahwa aktifitas kebudayaan dapat memberikan kontribusi terhadap perekonomian dan kesejahteraan rumah tangga.','Sumatera Barat capaian indikator ini sebesar 0.25%. Artinya 1 dari 400 penduduk di Sumatera Barat mendapatkan penghasilan dari aktifitasnya sebagai pelaku/pendukung pertunjukan seni','(Jumlah penduduk usia 15+ yang pernah terlibat sebagai pelaku atau pendukung pertunjukan seni dan menjadikan keterlibatan sebagai sumber penghasilan / Jumlah penduduk usia 15+) * 100%','Jumlah penduduk usia 15+ yang pernah terlibat sebagai pelaku atau pendukung pertunjukan seni dan menjadikan keterlibatan sebagai sumber penghasilan','Jumlah penduduk usia 15+','1) Jumlah penduduk usia 15 tahun keatas yang pernah terlibat sebagai pelaku/pendukung pertunjukan seni dan menjadikan keterlibatan sebagai sumber penghasilan)\n2) Jumlah penduduk usia 15 tahun ke atas','Susenas Modul','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',1,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(2,'IPK-EKO-02',2024,'Ekonomi Budaya','Persentase pengeluaran konsumsi rumah tangga untuk kegiatan, barang dan jasa kebudayaan terhadap total pengeluaran konsumsi','persentase-pengeluaran-konsumsi-rumah-tangga-kegiatan-barang-jasa-kebudayaan','Proporsi dari pengeluaran konsumsi rumah tangga untuk kegiatan, barang dan jasa kebudayaan (pesta dan upacara/kenduri; hiburan; pengobatan/obat tradisional/jamu) terhadap total pengeluaran konsumsi bukan makanan. Yang termasuk dalam kegiatan, barang dan jasa kebudayaan adalah: 1. Hiburan (tidak termasuk transpor dan pembelian barang untuk rekreasi) -> seni pertunjukan. 2. Keperluan Pesta dan Upacara/Kenduri (Perkawinan, Khitanan, Perayaan hari raya agama, Upacara agama atau adat lainnya, Pemakaman)','Semakin tinggi nilai indikator ini maka semakin besar pengeluaran rumah tangga untuk kegiatan, barang, dan jasa kebudayaan yang terdiri dari pesta dan upacara/kenduri; hiburan; pengobatan/persalinan/obat tradisional/jamu. Nilai indikator yang tinggi menunjukkan bahwa semakin banyak rumah tangga yang mengeluarkan biaya untuk pelaksanaan kegiatan kebudayaan','Capaian indikator ini pada Provinsi Bali sebesar 8.08%. Artinya pengeluaran rumah tangga di Provinsi Bali, 8.08% diantaranya untuk pengeluaran pada kegiatan, barang dan jasa kebudayaan','(Jumlah pengeluaran konsumsi rumah tangga untuk kegiatan, barang dan jasa kebudayaan / Jumlah pengeluaran konsumsi bukan makanan) * 100%','Jumlah pengeluaran konsumsi rumah tangga untuk kegiatan, barang dan jasa kebudayaan','Jumlah pengeluaran konsumsi bukan makananan','1) Jumlah pengeluaran konsumsi rumah tangga untuk kegiatan,barang dan jasa kebudayaan\n2) Jumlah pengeluaran konsumsi bukan makananan','Susenas Konsumsi Pengeluaran','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',2,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(3,'IPK-PEN-01',2024,'Pendidikan','Persentase satuan pendidikan yang mempunyai guru yang mengajar muatan lokal bahasa daerah dan/atau ekskul kesenian','persentase-satuan-pendidikan-guru-muatan-lokal-bahasa-daerah-ekskul-kesenian','Proporsi dari jumlah sekolah (SD/sederajat,SMP/sederajat,SMA/sederajat) yang mempunyai guru yang mengajar muatan lokal berupa bahasa daerah atau budaya lokal setempat dan/atau ekstrakurikuler kesenian terhadap total jumlah sekolah (SD,SMP,SMA/sederajat)','Semakin tinggi nilai indikator ini maka semakin banyak sekolah yang menjalankan pengarusutamaan kebudayaan di dunia pendidikan melalui pembelajaran muatan lokal','capaian indikator ini untuk Provinsi Riau sebesar 76.63%. Artinya terdapat 76 dari 100 sekolah di Riau mempunyai guru muatan lokal bahasa daerah dan/atau ekskul kesenian','(Jumlah satuan pendidikan yang memiliki guru muatan lokal bahasa daerah dan atau ekskul kesenian / Total Jumlah satuan pendidikan) * 100%','Jumlah satuan pendidikan yang memiliki guru muatan lokal bahasa daerah dan/atau ekskul kesenian','Total Jumlah satuan pendidikan','1) Jumlah satuan pendidikan yang memiliki guru muatan lokal bahasa daerah dan/atau ekskul kesenian\n2) Total Jumlah satuan pendidikan','Data Pokok Pendidikan','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',3,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(4,'IPK-PEN-02',2024,'Pendidikan','Persentase guru yang mengajar bahasa dan budaya lokal terhadap total guru','persentase-guru-mengajar-bahasa-budaya-lokal-terhadap-total-guru','Proporsi dari jumlah guru (SD/sederajat,SMP/sederajat,SMA/sederajat) yang mengajar bahasa dan budaya lokal terhadap seluruh jumlah guru (SD/sederajat,SMP/sederajat,SMA/sederajat) yang tersedia. Menunjukkan kapasitas SDM pada sistem pendidikan formal dalam mentransmisikan budaya lokal, menjadi dasar kebijakan penguatan kurikulum berbasis kearifan lokal','Semakin tinggi nilai indikator ini maka semakin banyak tenaga pendidik yang menjalankan pengarusutamaan kebudayaan. Pendidikan formal mampu menjamin keberlanjutan muatan lokal melalui tenaga pendidik dan kurikulum yang responsif terhadap kearifan budaya.',NULL,'(Jumlah guru muatan lokal bahasa daerah dan budaya lokal / Total guru) * 100%','Jumlah guru yang mengajar bahasa daerah dan budaya lokal','Total Jumlah guru','1) Jumlah guru yang mengajar bahasa daerah dan budaya lokal\n2) Total Jumlah guru','Data Pokok Pendidikan; Data Guru yang diampu oleh Kementerian Agama','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',4,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(5,'IPK-PEN-03',2024,'Pendidikan','Persentase penduduk yang terlibat dalam kegiatan pelatihan dan/atau pembelajaran seni dan budaya yang bersifat nonformal dan informal','persentase-penduduk-terlibat-pelatihan-pembelajaran-seni-budaya-nonformal-informal','Menyediakan gambaran keterlibatan masyarakat dalam pembelajaran budaya secara informal; berguna untuk merancang program dukungan berbasis komunitas.','Keterlibatan masyarakat dalam pelatihan seni dan budaya memperkuat ruang belajar alternatif yang mendorong partisipasi aktif serta keberagaman ekspresi budaya. Dengan demikian, pengukuran indikator ini penting untuk memastikan bahwa pendidikan berfungsi tidak hanya sebagai sarana transfer ilmu, tetapi juga sebagai wahana pelestarian dan pengembangan kebudayaan secara berkelanjutan.',NULL,'(Jumlah penduduk usia 17+ yang terlibat dalam kegiatan pelatihan atau pembelajaran seni budaya yang bersifat nonformal dan informal / Jumlah penduduk usia 17+) * 100%','Jumlah penduduk usia 17+ yang terlibat dalam kegiatan pelatihan atau pembelajaran seni budaya yang bersifat nonformal dan informal','Jumlah penduduk usia 17+','1) Jumlah penduduk usia 17+ yang terlibat dalam kegiatan pelatihan atau pembelajaran seni budaya yang bersifat nonformal dan informal\n2) Jumlah penduduk usia 17+','Survei Persepsi Kebudayaan','Persen','Tahunan','Provinsi','Ya','Website IPK dan eBook IPK',5,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(6,'IPK-KSB-01',2024,'Ketahanan Sosial Budaya','Persentase rumah tangga yang setuju jika ada sekelompok orang dari suku lain yang melakukan kegiatan di lingkungan sekitar tempat tinggal','persentase-rumah-tangga-setuju-kegiatan-suku-lain','Proporsi rumah tangga yang setuju apabila salah satu anggota rumah tangga tidak keberatan jika ada orang dari suku lain melaksanakan kegiatan dilingkungan sekitar rumah tangga terhadap total rumah tangga','Semakin tinggi nilai indikator ini menunjukkan bahwa toleransi terhadap perbedaan suku semakin kuat','persentase Provinsi DKI Jakarta sebesar 93,13, artinya sebanyak 93 dari 100 rumah tangga yang ada di Provinsi DKI Jakarta setuju jika ada perbedaan suku di lingkungan sekitar tempat tinggal mereka yanng melaksanakan kegiatan','(Jumlah rumah tangga yang setuju jika ada suku lain yang berkegiatan / Jumlah rumah tangga) * 100%','Jumlah rumah tangga yang setuju perbedaan suku suku dalam melaksanakan kegiatan','Jumlah rumah tangga','1) Jumlah rumah tangga yang setuju perbedaan suku suku dalam melaksanakan kegiatan\n2) Jumlah rumah tangga','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',6,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(7,'IPK-KSB-02',2024,'Ketahanan Sosial Budaya','Persentase penduduk yang mengikuti kegiatan sosial kemasyarakatan di lingkungan sekitar','persentase-penduduk-mengikuti-kegiatan-sosial-kemasyarakatan','Proporsi pendudukan usia 10 tahun ke atas yang terlibat pada kegiatan sosial kemasyarakatan di lingkungannya dalam waktu 3 bulan terakhir terhadap jumlah penduduk usia 10 tahun ke atas. Kegiatan sosial kemasyarakatan adalah kegiatan bersama anggota masyarakat yang bersifat sosial (tidak mencari keuntungan ekonomi), dilakukan di lingkungan sekitar. Kegiatan sosial kemasyarakatan berkaitan dengan keagamaan/kepercayaan, keterampilan, olahraga, gotongroyong, arisan, kematian dan sosial lainnya','Semakin tinggi nilai indikator ini maka menunjukkan bahwa penduduk usia 10 ke atas memiliki kesadaran dan keterlibatan dalam kegiatan sosial kemasyarakatan. Ini dapat mengindikasikan bahwa budaya gotong royong yang masih dijunjung tinggi di masyarakat tersebut.','persentase provinsi Nusa Tenggara Barat sebesar 95,81 yang artinya sebanyak 95 dari 100 penduduk usia 10 tahun keatas yang mengikuti kegiatan sosial kemasyarakatan di lingkungan sekitar','(Jumlah penduduk usia 10+ yang terlibat pada kegiatan sosial kemasyarakatan di lingkungannya / jumlah penduduk usia 10+) * 100%','Pendudukan usia 10 keatas yang terlibat pada kegiatan sosial kemasyarakatan di lingkungannya','Penduduk usia 10 tahun ke atas','1) Pendudukan usia 10 keatas yang terlibat pada kegiatan sosial kemasyarakatan di lingkungannya\n2) Penduduk usia 10 tahun ke atas','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',7,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(8,'IPK-KSB-03',2024,'Ketahanan Sosial Budaya','Persentase rumah tangga yang merasa aman saat berjalan kaki sendirian pada malam hari di lingkungan sekitar rumah','persentase-rumah-tangga-merasa-aman-berjalan-malam-hari','Proporsi antara jumlah rumah tangga yang merasa aman saat berjalan kaki sendirian pada malam hari di lingkungan sekitar rumah terhadap jumlah rumah tangga dalam setahun terakhir, dinyatakan dalam satuan persen (%)','Semakin tinggi nilai indikator ini menunjukkan bahwa lingkungan sekitar tempat tinggal memberikan rasa aman terhadap warga disekitarnya','Presentase indikator ini di suatu wilayah 75,44 artinya sekitar 75% rumah tangga di wilayah tersebut merasa lingkungan sekitar rumahnya aman','(Jumlah rumah tangga yang merasa aman saat berjalan kaki sendirian di malam hari di lingkungan sekitar rumah / Jumlah rumah tangga) * 100%','Jumlah rumah tangga yang merasa aman saat berjalan kaki sendirian di malam hari di lingkungan sekitar rumah','Jumlah rumah tangga','1) Jumlah rumah tangga yang merasa aman saat berjalan kaki sendirian di malam hari di lingkungan sekitar rumah\n2) Jumlah rumah tangga','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',8,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(9,'IPK-WAR-01',2024,'Warisan Budaya','Persentase benda, bangunan, struktur, situs dan kawasan cagar budaya yang telah ditetapkan terhadap total pendaftaran','persentase-cagar-budaya-ditetapkan-terhadap-total-pendaftaran','Proporsi jumlah Cagar Budaya (meliputi benda, situs, bangunan, struktur dan kawasan) yang ditetapkan terhadap jumlah objek diduga cagar budaya (ODCB) yang sudah terverifikasi dan tervalidasi','Semakin besar nilai indikator ini menunjukkan semakin banyak Cagar Budaya yang dilindungi dan semakin aktif Tim Ahli Cagar Budaya dalam mengkaji Cagar Budaya tersebut','capaian indikator ini untuk Provinsi Kep. Bangka Belitung sebesar 25.00%. Artinya 1 dari 4 Objek yang diduga Cagar Budaya di Babel ditetapkan menjadi Cagar Budaya','(Jumlah cagar budaya (CB) yang ditetapkan / Jumlah objek diduga cagar budaya (ODCB terverval)) * 100%','Jumlah cagar budaya (CB) yang ditetapkan','Jumlah objek diduga cagar budaya (ODCB terverval)','1) Jumlah cagar budaya (CB) yang ditetapkan\n2) Jumlah objek diduga cagar budaya (ODCB terverval)','Data Pokok Kebudayaan','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',9,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(10,'IPK-WAR-02',2024,'Warisan Budaya','Persentase warisan budaya takbenda yang telah ditetapkan terhadap total pencatatan','persentase-warisan-budaya-takbenda-ditetapkan-terhadap-total-pencatatan','Proporsi persentase jumlah warisan budaya takbenda (WBTb) yang telah ditetapkan oleh pemerintah yang berwenang terhadap jumlah objek pemajuan kebudayaan (OPK) yang terverifikasi dan validasi','Semakin tinggi nilai indikator ini maka semakin banyak objek pemajuan kebudayaan yang ditetapkan menjadi warisan budaya takbenda',NULL,'(Jumlah warisan budaya takbenda (WBTb) yang ditetapkan / Jumlah objek pemajuan kebudayaan (OPK) terverval) * 100%','Jumlah warisan budaya takbenda (WBTb) yang ditetapkan','Jumlah objek pemajuan kebudayaan (OPK) terverval','1) Jumlah warisan budaya takbenda (WBTb) yang ditetapkan\n2) Jumlah objek pemajuan kebudayaan (OPK) terverval','Data Pokok Kebudayaan','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',10,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(11,'IPK-WAR-03',2024,'Warisan Budaya','Persentase penduduk yang menggunakan bahasa daerah di rumah atau dalam pergaulan sehari-hari','persentase-penduduk-menggunakan-bahasa-daerah','Perbandingan antara penduduk berusia 5 tahun ke atas yang sering menggunakan bahasa daerah di rumah atau dalam pergaulan sehari-hari terhadap penduduk usia 5 tahun ke atas. Dinyatakan dalam satuan persen (%). Bahasa daerah adalah suatu bahasa yang bersumber dari suatu wilayah/suku/etnis tertentu atau yang dituturkan oleh penduduk wilayah/suku/etnis tertentu. Misal bahasa sunda, jawa, madura, minangkabau, bugis, banjar, bali, betawi, dsb','Semakin tinggi nilai indikator ini maka semakin banyak penduduk yang masih menggunakan bahasa daerah, hal tersebut menunjukkan bahwa bahasa daerah masih lestari di masyarakat.','capaian indikator provinsi Lampung sebesar 70.70%. Artinya sebanyak 70 dari 100 penduduk usia 5 tahun ke atas yang masih menggunakan bahasa daerahnya dalam pergaulan sehari-hari.','(Jumlah penduduk usia 5+ yang menggunakan bahasa daerah / Jumlah penduduk usia 5+) * 100%','Jumlah penduduk usia 5 tahun keatas yang menggunakan bahasa daerah','Jumlah penduduk usia 5 tahun keatas','1) Jumlah penduduk usia 5 tahun keatas yang menggunakan bahasa daerah\n2) Jumlah penduduk usia 5 tahun keatas','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',11,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(12,'IPK-WAR-04',2024,'Warisan Budaya','Persentase penduduk yang menonton pertunjukkan seni','persentase-penduduk-menonton-pertunjukan-seni','Proporsi jumlah penduduk usia 10 tahun ke atas yang menonton pertunjukan seni (seni musik, seni rupa, seni sastra, seni tari, film, seni media, seni teater) secara langsung dan tidak langsung dalam 3 bulan terakhir terhadap jumlah penduduk usia 10 tahun ke atas. Dinyatakan dalam persen.','Semakin tinggi nilai indikator ini menunjukkan bahwa penduduk usia 10 tahun keatas memiliki ketertarikan untuk menonton pertunjukan seni','Capaian Indikator Provinsi Jawa Barat sebesar 75,69%. Artinya sekitar 3 dari 4 penduduk usia 10 tahun keatas di Jawa Barat memiliki ketertarikan untuk menonton pertunjukan seni','(Jumlah penduduk usia 10+ yang pernah menonton pertunjukan seni / Jumlah penduduk usia 10+) * 100%','Jumlah penduduk usia 10 keatas yang pernah menonton pertunjukan seni','Jumlah penduduk usia 10 keatas','1) Jumlah penduduk usia 10 keatas yang pernah menonton pertunjukan seni\n2) Jumlah penduduk usia 10 keatas','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',12,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(13,'IPK-WAR-05',2024,'Warisan Budaya','Persentase penduduk yang mengunjungi peninggalan sejarah/warisan dunia','persentase-penduduk-mengunjungi-peninggalan-sejarah-warisan-dunia','Proporsi penduduk usia 10 tahun ke atas yang pemah mengunjungi tempat/peninggalan sejarah/warisan budaya bersifat kebendaan di Indonesia dalam setahun terakhir terhadap total penduduk usia 10 tahun ke atas. Dinyatakan dalam persen','Semakin tinggi nilai indikator ini maka semakin banyak penduduk usia 10 tahun ke atas yang menunjukkan ketertarikan masyarakat terhadap sejarah. Ini bisa berarti masyarakat memiliki kesadaran akan pentingnya warisan budaya yang ada di Indonesia.','capaian indikator ini untuk Prov. Kalimantan Utara sebesar 15.95%. Artinya sebanyak 15 dari 100 penduduk usia 10 tahun keatas yang mengunjungi tempat peninggalan sejarah / warisan budaya di Kaltara','(Jumlah penduduk usia 10+ yang pernah mengunjungi tempat peninggalan sejarah atau warisan budaya bersifat kebendaan / Jumlah penduduk usia 10+) * 100%','Jumlah penduduk usia 10 tahun ke atas yang mengunjungi tempat/peninggalan sejarah/warisan budaya bersifat kebendaan','Jumlah penduduk usia 10 keatas','1) Jumlah penduduk usia 10 tahun ke atas yang mengunjungi tempat/peninggalan sejarah/warisan budaya bersifat kebendaan\n2) Jumlah penduduk usia 10 keatas','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',13,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(14,'IPK-WAR-06',2024,'Warisan Budaya','Persentase rumah tangga yang menggunakan produk tradisional','persentase-rumah-tangga-menggunakan-produk-tradisional','Persentase rumah tangga yang dalam 3 bulan terakhir terdapat anggota rumah tangga yang membeli atau menggunakan setidaknya satu produk tradisional sebagai berikut: kerajinan tradisional, busana daerah/tradisional, metode penyehatan tradisional, atau obat tradisional, terhadap total rumah tangga','Semakin tinggi nilai indikator ini maka semakin banyak penduduk yang masih menggunakan produk tradisional','capaian Indikator untuk Prov. Jambi sebesar 79.25%. Artinya 4 dari 5 rumah tangga di provinsi Jambi yang membeli dan / atau menggunakan produk tradisional seperti kerajinan tradisional, busana daerah/tradisional, metode penyehatan tradisional, atau obat tradisional','(Jumlah rumah tangga yang membeli atau menggunakan produk tradisional / Jumlah rumah tangga) * 100%','Jumlah rumah tangga yang membeli/menggunakan produk tradisional','Jumlah rumah tangga','1) Jumlah rumah tangga yang membeli/menggunakan produk tradisional\n2) Jumlah rumah tangga','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',14,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(15,'IPK-EKS-01',2024,'Ekspresi Budaya','Persentase penduduk yang pernah terlibat sebagai pelaku/pendukung pertunjukkan seni','persentase-penduduk-terlibat-pelaku-pendukung-pertunjukan-seni','Proporsi penduduk usia 10 tahun ke atas yang pernah terlibat dalam setidaknya satu pertunjukan/parneran satu seni sebagai pelaku / pendukung dalam kegiatan sebagai berikut: seni musik, seni rupa, seni sastra, seni tari, film, seni media, seni teater atau seni lainnya dalam satu tahun terakhir, terhadap total penduduk usia 10 tahun ke atas.','Semakin tinggi nilai indikator ini maka semakin banyak penduduk usia 10 tahun ke atas yang terlibat sebagai pelaku maupun pendukung pertunjukan seni dalam waktu satu tahun terakhir.','Capaian Indikator Prov. Kep. Riau sebesar 3.01%. Artinya sekitar 3 dari 100 penduduk usia 10 tahun keatas pernah terlibat sebagai pelaku dan/atau pendukung pertunjukan seni.','(Jumlah penduduk usia 10+ yang pernah terlibat sebagai pelaku / pendukung setidaknya satu pertunjukan seni / Jumlah penduduk usia 10+) * 100%','Jumlah penduduk usia 10 tahun ke atas yang pernah terlibat sebagai pelaku/pendukung pertunjukkan seni','Jumlah penduduk usia 10 tahun ke atas','1) Jumlah penduduk usia 10 tahun ke atas yang pernah terlibat sebagai pelaku/pendukung pertunjukkan seni\n2) Jumlah penduduk usia 10 tahun ke atas','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',15,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(16,'IPK-EKS-02',2024,'Ekspresi Budaya','Persentase rumah tangga yang menyelenggarakan upacara adat','persentase-rumah-tangga-menyelenggarakan-upacara-adat','Proporsi rumah tangga yang menyelenggarakan menghadiri upacara adat (seperti: kelahiran, sunatan, perkawinan, kematian, seremoni terkait keagamaan, panen dan lainnya) terhadap jumlah rumah tangga. Dinyatakan dalam jumlah persen','semakin tinggi indikator ini maka menunjukkan bahwa masih banyak rumah tangga yang memegang erat budayanya melalui pelaksanaan upacara adat.','Capaian Indikator Provinsi Sulawesi Tengah sebesar 20,19%. Artinya sekitar 1 dari 5 rumah tangga di Sulteng masih menyelenggarakan upacara adat','(Jumlah rumah tangga yang menyelenggarakan upacara adat / Jumlah rumah tangga) * 100%','Jumlah rumah tangga yang menyelenggarakan upacara adat','Jumlah rumah tangga','1) Jumlah rumah tangga yang menyelenggarakan upacara adat\n2) Jumlah rumah tangga','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',16,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(17,'IPK-EKS-03',2024,'Ekspresi Budaya','Persentase penduduk yang melakukan olahraga tradisional dan/atau permainan rakyat','persentase-penduduk-olahraga-tradisional-permainan-rakyat','Persentase penduduk usia 10 tahun ke atas yang dalam satu tahun terakhir pernah melakukan setidaknya satu olahraga tradisional dan/atau permainan rakyat terhadap total jumlah penduduk usia 10 tahun ke atas. Olahraga tradisional adalah berbagai aktivitas fisik dan/atau mental yang bertujuan untuk menyehatkan diri, peningkatan daya tahan tubuh, didasarkan pada nilai tertentu, dilakukan oleh kelompok masyarakat secara terus-menerus dan diwariskan pada generasi berikutnya, antara lain, bela diri, pasola, lompat batu, dan debus. (UU No 5 Tahun 2017). Olahraga yang dimaksud sebagai berikut Pencak silat, Sepak Takraw, Dayung, Balap Sapi, atau yang lainnya. Permainan rakyat adalah berbagai permainan yang didasarkan pada nilai tertentu dan dilakukan oleh kelompok masyarakat secara terus menerus dan diwariskan pada generasi berikutnya, yang bertujuan untuk menghibur diri, antara lain, permainan kelereng, congklak, gasing, dan gobak sodor..','Semakin tinggi nilai indikator ini maka semakin banyak penduduk 10 tahun ke atas yang masih melestarikan olahraga tradisional.','Capaian Indikator pada Prov. Bali sebesar 5,24%. Artinya sekitar 1 dari 20 penduduk usia 10 tahun ke atas dalam satu tahun terakhir di Bali pernah melakukan setidaknya satu olahraga tradisional dan/atau permainan rakyat','(Jumlah penduduk usia 10+ yang pernah melakukan olahraga tradisional dan/atau permainan rakyat / Jumlah penduduk usia 10+) * 100%','Jumlah penduduk usia 10 tahun ke atas yang pernah melakukan olahraga tradisional dan/atau permainan rakyat','Jumlah penduduk usia 10 tahun ke atas','1) Jumlah penduduk usia 10 tahun ke atas yang pernah melakukan olahraga tradisional dan/atau permainan rakyat\n2) Jumlah penduduk usia 10 tahun ke atas','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',17,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(18,'IPK-EKS-04',2024,'Ekspresi Budaya','Persentase penduduk yang merasa aman dan diterima saat menampilkan identitas budaya (mengekpresikan budaya) di ruang publik','persentase-penduduk-aman-diterima-menampilkan-identitas-budaya-ruang-publik','Mengukur sejauh mana ruang publik mendukung kebebasan berekspresi budaya tanpa rasa takut dan diskriminasi; mencerminkan tingkat inklusivitas sosial terhadap keberagaman ekspresi identitas budaya','Menekankan aspek rasa aman dan penerimaan sosial, yang menjadi prasyarat penting bagi kebebasan berekspresi budaya. Tanpa adanya rasa aman dan penerimaan, masyarakat cenderung enggan menampilkan identitas budayanya secara terbuka.',NULL,'(Jumlah penduduk usia 17+ yang merasa aman dan diterima saat menampilkan identitas budaya di ruang publik / Jumlah penduduk usia 17+) * 100%','Jumlah penduduk usia 17+ yang merasa aman dan diterima saat menampilkan identitas budaya di ruang publik','Jumlah penduduk usia 17+','1) Jumlah penduduk usia 17+ yang terlibat dalam kegiatan pelatihan atau pembelajaran seni budaya yang bersifat nonformal dan informal\n2) Jumlah penduduk usia 17+','Survei Persepsi Kebudayaan','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',18,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(19,'IPK-LIT-01',2024,'Budaya Literasi','Persentase penduduk yang membaca selain kitab suci baik cetak maupun elektronik','persentase-penduduk-membaca-selain-kitab-suci','Perbandingan antara jumlah penduduk usia 10 tahun ke atas yang pernah membaca selain kitab suci baik cetak maupun elektronik dalam satu minggu terakhir, terhadap total penduduk usia 10 tahun ke atas, dinyatakan dalam satuan persen (%). Membaca selain kitab suci baik cetak maupun elektronik yang dimaksud disini adalah membaca: koran/surat kabar, majalah/tabloid, buku cerita, buku pelajaran sekolah, buku pengetahuan, atau buku lainnya selain kitab suci (baik cetak maupun elektronik).','Semakin tinggi nilai indikator ini maka semakin banyak penduduk usia 10 tahun ke atas yang aktifitas','capaian indikator provinsi Papua Selatan sebesar 50,46%, artinya 1 dari 2 penduduk usia 10 tahun ke atas di Papua Selatan pernah membaca selain suci baik cetak maupun elektronik','(Jumlah penduduk usia 10+ yang membaca selain kitab suci baik cetak maupun elektronik / Jumlah Penduduk usia 10+) * 100%','Jumlah penduduk usia 10 tahun ke atas yang membaca selain kitab suci baik cetak maupun elektronik','Jumlah penduduk usia 10 tahun ke atas','1) Jumlah penduduk usia 10 tahun ke atas yang membaca selain kitab suci baik cetak maupun elektronik\n2) Jumlah penduduk usia 10 tahun ke atas','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',19,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(20,'IPK-LIT-02',2024,'Budaya Literasi','Persentase penduduk yang mengakses internet','persentase-penduduk-mengakses-internet','Persentase penduduk usia 10 tahun ke atas yang mengakses internet termasuk Facebook, Youtube, Instagram dll terhadap total jumlah penduduk usia 10 tahun ke atas dalam 3 bulan terakhir','Semakin tinggi nilai indikator ini maka semakin banyak penduduk yang sudah mudah untuk mendapatkan akses internet.','Capaian indikator pada Prov. DI Yogyakarta sebesar 80,58%. artinya 8 dari 10 penduduk usia 10 tahun ke atas di Yogyakarta yang mengakses internet dalam 3 bulan terakhir.','(Jumlah penduduk usia 10+ yang mengakses Internet / Jumlah penduduk usia 10+) * 100%','Jumlah penduduk usia 10 tahun ke atas yang mengakses internet','Jumlah penduduk usia 10 tahun ke atas','1) Jumlah penduduk usia 10 tahun ke atas yang mengakses internet\n2) Jumlah penduduk usia 10 tahun ke atas','SUSENAS KOR','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',20,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(21,'IPK-LIT-03',2024,'Budaya Literasi','Persentase penduduk yang mengunjungi perpustakaan/memanfaatkan taman bacaan masyarakat','persentase-penduduk-mengunjungi-perpustakaan-taman-bacaan','Persentase penduduk usia 10 tahun ke atas yang dalam 3 bulan terakhir pernah mengunjungi perpustakaan (baik fisik maupun digital) atau pernah memanfaatkan taman bacaan masyarakat, terhadap total penduduk usia 10 tahun ke atas.','Semakin tinggi nilai indikator ini maka semakin banyak penduduk usia 10 tahun ke atas yang pernah mengunjungi perpustakaan (baik fisik maupun digital) atau pernah memanfaatkan taman bacaan masyarakat','Capaian Indikator ini untuk Provinsi Kalimantan Timur sebesar 10.42%. artinya 1 dari 10 penduduk usia 10 tahun ke atas di Kaltim yang mengunjungi perpustakaan atau memanfaatkan taman bacaan masyarakat salam waktu 3 bulan terakhir.','(Jumlah penduduk usia 10+ yang pernah mengunjungi Perpustakaan/memanfaatkan taman bacaan masyarakat / Jumlah penduduk usia 10+) * 100%','Jumlah penduduk usia 10 tahun ke atas yang mengunjungi perpustakaan/memanfaatkan taman bacaan masyarakat','Jumlah penduduk usia 10 tahun ke atas','1) Jumlah penduduk usia 10 tahun ke atas yang mengunjungi perpustakaan/memanfaatkan taman bacaan masyarakat\n2) Jumlah penduduk usia 10 tahun ke atas','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',21,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(22,'IPK-GEN-01',2024,'Gender','Rasio tingkat partisipasi angkatan kerja perempuan terhadap laki-laki','rasio-tingkat-partisipasi-angkatan-kerja-perempuan-terhadap-laki-laki','Perbandingan persentase tingkat partisipasi angkatan kerja perempuan usia 15 tahun ke atas terhadap tingkat partisipasi angkatan kerja laki laki usia 15 tahun ke atas','Semakin tinggi nilai indikator ini (semakin mendekati 100) menunjukkan bahwa tidak ada kesenjangan tenaga kerja perempuan dan laki-laki untuk memproduksi barang dan jasa dalam suatu perekonomian.','Capaian Indikator pada Prov. Kepulauan Riau sebesar 60,83%. Artinya 3 dari 5 perempuan terhadap laki-laki di Kepri memiliki partisipasi angkatan kerja usia 15 tahun ke atas.','(TPAK Perempuan / TPAK Laki-Laki) * 100%','Jumlah tingkat partisipasi angkatan kerja usia 15 tahun ke atas jenis kelamin perempuan','Jumlah tingkat partisipasi angkatan kerja usia 15 tahun ke atas jenis kelamin laki-laki','1) Jumlah tingkat partisipasi angkatan kerja usia 15 tahun ke atas jenis kelamin perempuan\n2) Jumlah tingkat partisipasi angkatan kerja usia 15 tahun ke atas jenis kelamin laki-laki','SAKERNAS','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',22,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(23,'IPK-GEN-02',2024,'Gender','Rasio penduduk perempuan terhadap laki-laki yang memiliki ijazah minimal SMA/Sederajat','rasio-penduduk-perempuan-terhadap-laki-laki-ijazah-minimal-sma','Perbandingan persentase penduduk perempuan usia 25 tahun ke atas yang memiliki ijazah minimal SMA/ sederajat terhadap persentase penduduk laki-laki usia 25 tahun ke atas yang memiliki ijazah minimal SMA/sederajat.','semakin tinggi nilai indikator ini maka menunjukkan kesetaraan perempuan terhadap laki-laku dalam memperoleh akses pendidikan.','Capaian Indikator pada Prov. Sulawesi Barat sebesar 91,21%. artinya 9 dari 10 penduduk usia 25 tahun ke atas ber jenis kelamin perempuan terhadap laki-laki yang memiliki ijazah minimal SMA/sederajat','(Persentase perempuan usia 25+ yang memiliki ijazah minimal SMA/sederajat / Persentase laki-laki usia 25+ yang memiliki ijazah minimal SMA/sederajat) * 100%','Jumlah penduduk usia 25 tahun ke atas perempuan yang memiliki ijazah minimal SMA/Sederajat','Jumlah penduduk usia 25 tahun ke atas laki-laki yang memiliki ijazah minimal SMA/Sederajat','1) Jumlah penduduk usia 25 tahun ke atas perempuan yang memiliki ijazah minimal SMA/Sederajat\n2) Jumlah penduduk usia 25 tahun ke atas laki-laki yang memiliki ijazah minimal SMA/Sederajat','SUSENAS MODUL','Persen','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',23,1,'2026-09-28 09:26:22','2026-09-28 09:26:22'),(24,'IPK-GEN-03',2024,'Gender','Rasio anggota parlemen perempuan terhadap anggota parlemen laki-laki','rasio-anggota-parlemen-perempuan-terhadap-laki-laki','Perbandingan jumlah anggota parlemen perempuan terhadap jumlah anggota parlemen laki-laki (anggota DPRD Provinsi untuk level provinsi dan anggota DPR RI untuk level nasional)','semakin tinggi nilai indikator ini (semakin mendekati 1) maka menunjukkan kesetaraan perempuan terhadap laki-laki dalam memperoleh akses politik.',NULL,'(Jumlah anggota parlemen perempuan / Jumlah anggota parlemen laki-laki) * 100%','Jumlah anggota parlemen jenis kelamin perempuan','Jumlah anggota parlemen jenis kelamin laki-laki','1) Jumlah anggota parlemen jenis kelamin perempuan\n2) Jumlah anggota parlemen jenis kelamin laki-laki','BPS (Statistik dalam angka)','Rasio','Tahunan','Nasional, provinsi','Ya','Website IPK dan eBook IPK',24,1,'2026-09-28 09:26:22','2026-09-28 09:26:22');
/*!40000 ALTER TABLE `metadata_indikator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodologi_versi`
--

DROP TABLE IF EXISTS `metodologi_versi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `metodologi_versi` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) NOT NULL,
  `label` varchar(100) NOT NULL,
  `year_start` year(4) NOT NULL,
  `year_end` year(4) DEFAULT NULL COMMENT 'NULL = masih berlaku sampai diganti',
  `tabel_ref` varchar(64) NOT NULL COMMENT 'ref_indikator_*',
  `tabel_skor` varchar(64) NOT NULL COMMENT 'skor_indikator_provinsi_*',
  `tabel_sumber` varchar(64) NOT NULL COMMENT 'sumber_data_indikator_*',
  `tabel_dimensi` varchar(64) DEFAULT NULL COMMENT 'skor_dimensi_provinsi_*',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_metodologi_kode` (`kode`),
  KEY `idx_year_start` (`year_start`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodologi_versi`
--

LOCK TABLES `metodologi_versi` WRITE;
/*!40000 ALTER TABLE `metodologi_versi` DISABLE KEYS */;
INSERT INTO `metodologi_versi` VALUES (1,'m2018','Metodologi 2018 - 2023 (Lama)',2018,2023,'ref_indikator_2018','skor_indikator_provinsi_2018_2023','sumber_data_indikator_2018','skor_dimensi_provinsi_2018_2023',1,'2026-10-27 13:17:19','2026-10-27 13:17:19'),(2,'m2024','Metodologi 2024 (Baru)',2024,NULL,'ref_indikator_2024','skor_indikator_provinsi_2024','sumber_data_indikator_2024','skor_dimensi_provinsi_2024',1,'2026-10-27 13:17:19','2026-10-27 13:17:19');
/*!40000 ALTER TABLE `metodologi_versi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kode` varchar(60) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `grup` varchar(40) NOT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode` (`kode`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'menu.dashboard','Akses Dashboard','menu',NULL),(2,'menu.data_nasional','Akses Data Nasional','menu',NULL),(3,'menu.data_provinsi','Akses Data Provinsi','menu',NULL),(4,'menu.publikasi','Akses Publikasi','menu',NULL),(5,'menu.faq','Akses FAQ','menu',NULL),(6,'menu.tentang','Akses Tentang IPK','menu',NULL),(7,'menu.permohonan','Akses Permohonan Data','menu',NULL),(8,'menu.surat','Akses Surat Masuk','menu',NULL),(9,'menu.unduhan','Akses Unduhan Data','menu',NULL),(10,'menu.kelola_admin','Akses Kelola Admin','menu',NULL),(11,'menu.pengaturan_sistem','Akses Pengaturan Sistem','menu',NULL),(12,'data.input','Input Draft Data','data',NULL),(13,'data.submit','Submit Pengajuan Data','data',NULL),(14,'data.review','Review Pengajuan Data','data',NULL),(15,'data.approve','Approve Pengajuan Data','data',NULL),(16,'data.reject','Reject Pengajuan Data','data',NULL),(17,'data.publish','Publish Data ke Publik','data',NULL);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permohonan_data`
--

DROP TABLE IF EXISTS `permohonan_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permohonan_data` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nomor_permohonan` varchar(50) NOT NULL,
  `tanggal_permohonan` date NOT NULL,
  `nama_pemohon` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telepon` varchar(50) NOT NULL,
  `instansi` varchar(200) NOT NULL,
  `jabatan` varchar(100) DEFAULT NULL,
  `jenis_pemohon` enum('pemerintah','akademisi','mahasiswa','swasta','masyarakat','lainnya') NOT NULL,
  `jenis_data` varchar(100) NOT NULL,
  `wilayah` enum('nasional','provinsi','kab-kota') NOT NULL,
  `detail_wilayah` text DEFAULT NULL,
  `format_data` enum('xlsx','csv','pdf','lainnya') NOT NULL,
  `tahun_data` varchar(100) NOT NULL COMMENT 'Daftar tahun dipisah koma, contoh: 2022, 2023, 2024',
  `tujuan` varchar(100) NOT NULL,
  `detail_permintaan` text NOT NULL COMMENT 'Uraian kebutuhan data',
  `referensi` varchar(255) DEFAULT NULL,
  `lampiran` varchar(255) DEFAULT NULL COMMENT 'Path file upload pdf/doc/docx',
  `status` enum('baru','diproses','selesai','ditolak') NOT NULL DEFAULT 'baru',
  `catatan_admin` text DEFAULT NULL,
  `diproses_pada` datetime DEFAULT NULL,
  `selesai_pada` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_permohonan_nomor` (`nomor_permohonan`),
  KEY `idx_permohonan_status` (`status`),
  KEY `idx_permohonan_tanggal` (`tanggal_permohonan`),
  KEY `idx_permohonan_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permohonan_data`
--

LOCK TABLES `permohonan_data` WRITE;
/*!40000 ALTER TABLE `permohonan_data` DISABLE KEYS */;
INSERT INTO `permohonan_data` VALUES (1,'REQ-IPK-20260923-0742','2026-09-23','Syarif Hidayatullah','suhebat@gmail.com','081317500445','Pusdatin','','akademisi','IPK Nasional','nasional','','pdf','2019','penelitian','Untuk mencoba log admin','',NULL,'diproses','OK','2026-09-23 23:53:44',NULL,'2026-09-23 23:48:55','2026-09-23 23:53:44');
/*!40000 ALTER TABLE `permohonan_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provinces`
--

DROP TABLE IF EXISTS `provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `provinces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `available_before_2024` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provinces`
--

LOCK TABLES `provinces` WRITE;
/*!40000 ALTER TABLE `provinces` DISABLE KEYS */;
INSERT INTO `provinces` VALUES (1,'11','Aceh',1),(2,'12','Sumatera Utara',1),(3,'13','Sumatera Barat',1),(4,'14','Riau',1),(5,'15','Jambi',1),(6,'16','Sumatera Selatan',1),(7,'17','Bengkulu',1),(8,'18','Lampung',1),(9,'19','Kepulauan Bangka Belitung',1),(10,'21','Kepulauan Riau',1),(11,'31','DKI Jakarta',1),(12,'32','Jawa Barat',1),(13,'33','Jawa Tengah',1),(14,'34','Daerah Istimewa Yogyakarta',1),(15,'35','Jawa Timur',1),(16,'36','Banten',1),(17,'51','Bali',1),(18,'52','Nusa Tenggara Barat',1),(19,'53','Nusa Tenggara Timur',1),(20,'61','Kalimantan Barat',1),(21,'62','Kalimantan Tengah',1),(22,'63','Kalimantan Selatan',1),(23,'64','Kalimantan Timur',1),(24,'65','Kalimantan Utara',1),(25,'71','Sulawesi Utara',1),(26,'72','Sulawesi Tengah',1),(27,'73','Sulawesi Selatan',1),(28,'74','Sulawesi Tenggara',1),(29,'75','Gorontalo',1),(30,'76','Sulawesi Barat',1),(31,'81','Maluku',1),(32,'82','Maluku Utara',1),(33,'91','Papua',1),(34,'92','Papua Barat',1),(35,'93','Papua Selatan',1),(36,'94','Papua Tengah',1),(37,'95','Papua Pegunungan',1),(38,'96','Papua Barat Daya',1);
/*!40000 ALTER TABLE `provinces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publications`
--

DROP TABLE IF EXISTS `publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `publications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `seo_keywords` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `download_link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publications`
--

LOCK TABLES `publications` WRITE;
/*!40000 ALTER TABLE `publications` DISABLE KEYS */;
INSERT INTO `publications` VALUES (3,'Enam Tahun Pembangunan Kebudayaan: Perkembangan IPK Nasional dan Provinsi 2018-2023',2024,'statistik','Publikasi resmi yang menyajikan hasil penghitungan Indeks Pembangunan Kebudayaan tahun 2023 di tingkat nasional dan provinsi. Memuat skor IPK beserta rincian tujuh dimensi: Ekonomi Budaya, Pendidikan, Ketahanan Sosial Budaya, Warisan Budaya, Ekspresi Budaya, Budaya Literasi, dan Gender.','images/publications/1790349533_perkembangan-ipk-nas-prov-2018-2023.png','IPK 2023, indeks pembangunan kebudayaan, statistik kebudayaan, dimensi IPK, kebudayaan nasional','Hasil penghitungan Indeks Pembangunan Kebudayaan (IPK) tahun 2023 tingkat nasional dan provinsi beserta rincian tujuh dimensinya.','docs/publikasi/buku_ipk_2023.pdf'),(4,'IPK 2022 dan Analisis Komparatif atas IPK serta Enam Indeks Terkait',2024,'analisis','Publikasi yang menyajikan hasil IPK tahun 2022 sekaligus analisis komparatif dengan enam indeks terkait. Memberikan perspektif perbandingan untuk memahami posisi dan karakteristik pembangunan kebudayaan Indonesia dalam konteks pengukuran yang lebih luas.','images/publications/1790349117_analisis-komparatif-ipk.png','IPK 2022, analisis komparatif, indeks kebudayaan, perbandingan indeks, pembangunan kebudayaan','Hasil IPK 2022 dan analisis komparatif dengan enam indeks terkait untuk memahami posisi pembangunan kebudayaan Indonesia.','docs/publikasi/ipk_2022_dan_analisis_komparatif_ipk.pdf'),(5,'Indeks Pembangunan Kebudayaan Tahun 2021',2022,'statistik','E-book resmi hasil penghitungan Indeks Pembangunan Kebudayaan tahun 2021. Menyajikan capaian IPK nasional dan provinsi beserta perkembangan indikator pada tujuh dimensi pembangunan kebudayaan.','images/publications/1790348970_ipk-tahun-2021.png','IPK 2021, indeks pembangunan kebudayaan, e-book IPK, statistik kebudayaan 2021','E-book hasil penghitungan Indeks Pembangunan Kebudayaan (IPK) tahun 2021 tingkat nasional dan provinsi.','docs/publikasi/e_book_ipk_2021.pdf'),(6,'Indeks Pembangunan Kebudayaan Tahun 2020',2021,'statistik','E-book resmi hasil penghitungan Indeks Pembangunan Kebudayaan tahun 2020. Berisi gambaran capaian pembangunan kebudayaan nasional dan provinsi pada tujuh dimensi IPK.','images/publications/1790348870_ipk-tahun-2020.png','IPK 2020, e-book IPK, statistik kebudayaan','E-book hasil penghitungan IPK tahun 2020 tingkat nasional dan provinsi.','docs/publikasi/e_book_ipk_2020.pdf'),(7,'Indeks Pembangunan Kebudayaan 2018',2019,'statistik','Buku panduan yang menjelaskan konsep, metodologi, dimensi, indikator, serta tata cara penghitungan Indeks Pembangunan Kebudayaan. Menjadi acuan bagi pemangku kepentingan dalam memahami dan memanfaatkan IPK sebagai instrumen kebijakan kebudayaan.','images/publications/1790350119_ipk-tahun-2018.png','IPK 2018, metodologi IPK, panduan indeks kebudayaan, dimensi IPK, indikator kebudayaan','Panduan metodologi dan konsep Indeks Pembangunan Kebudayaan (IPK) sebagai instrumen kebijakan pembangunan kebudayaan.','docs/publikasi/handbook_ipk.pdf');
/*!40000 ALTER TABLE `publications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_indikator_2018`
--

DROP TABLE IF EXISTS `ref_indikator_2018`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_indikator_2018` (
  `kode` varchar(10) NOT NULL,
  `nama_indikator` text NOT NULL,
  `nilai_minimum` decimal(10,2) DEFAULT NULL,
  `nilai_maximum` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`kode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_indikator_2018`
--

LOCK TABLES `ref_indikator_2018` WRITE;
/*!40000 ALTER TABLE `ref_indikator_2018` DISABLE KEYS */;
INSERT INTO `ref_indikator_2018` VALUES ('kode','nama_indikator',NULL,NULL),('X1.1','Persentase penduduk 15 tahun ke atas yang pernah terlibat sebagai pelaku/pendukung pertunjukan seni yang menjadikan keterlibatannya itu sebagai sumber penghasilan',0.00,1.00),('X2.1','Rata-rata Lama Sekolah (MYS) penduduk usia 25 tahun ke atas',0.00,15.00),('X2.2','Harapan Lama Sekolah (HLS) penduduk usia 7 tahun ke atas',0.00,18.00),('X2.3','Angka Kesiapan Sekolah (AKS)',0.00,100.00),('X2.4','Persentase satuan pendidikan yang mempunyai guru yang mengajar muatan lokal bahasa daerah dan/atau ekskul kesenian',0.00,45.00),('X2.5','Persentase penduduk penyandang disabilitas usia 7-18 tahun yang bersekolah',0.00,100.00),('X2.6','Persentase penduduk usia 7-18 tahun dengan kategori kelompok pengeluaran 40 persen terbawah yang bersekolah',0.00,100.00),('X3.1','Persentase rumah tangga yang setuju jika ada sekelompok orang dari agama lain yang melakukan kegiatan di lingkungan sekitar tempat tinggal.',0.00,100.00),('X3.2','Persentase rumah tangga yang setuju jika ada sekelompok orang dari suku lain yang melakukan kegiatan di lingkungan sekitar tempat tinggal.',0.00,100.00),('X3.3','Persentase rumah tangga yang setuju jika salah satu anggota rumah tangga berteman dengan orang lain yang beda agama.',0.00,100.00),('X3.4','Persentase rumah tangga yang setuju jika salah satu anggota rumah tangga berteman dengan orang lain yang berbeda suku.',0.00,100.00),('X3.5','Persentase penduduk usia 10 tahun ke atas yang mengikuti kegiatan sosial kemasyarakatan di lingkungan sekitar dalam 3 bulan terakhir',0.00,100.00),('X3.6','Persentase penduduk usia 10 tahun ke atas yang mengikuti gotong royong',0.00,100.00),('X3.7','Persentase rumah tangga yang merasa khawatir dengan keamanan saat berjalan kaki sendirian di malam hari',0.00,50.00),('X3.8','Persentase rumah tangga yang merasa percaya menitipkan rumah kepada tetangga',0.00,100.00),('X4.1','Persentase benda, bangunan, struktur, situs dan kawasan cagar budaya yang telah ditetapkan terhadap total pendaftaran',0.00,50.00),('X4.2','Persentase warisan budaya takbenda yang telah ditetapkan terhadap total pencatatan',0.00,50.00),('X4.3','Persentase penduduk usia 5 tahun ke atas yang menggunakan bahasa daerah di rumah atau dalam pergaulan sehari-hari',0.00,100.00),('X4.4','Persentase penduduk usia 10 tahun ke atas yang menonton secara langsung pertunjukkan seni dalam 3 bulan terakhir\n*tahun 2021 ada perluasan definisioperasional (termasuk yang tidak langsung)',0.00,100.00),('X4.5','Persentase penduduk usia 10 tahun ke atas yang mengunjungi peninggalan sejarah/warisan dunia dalam setahun terakhir',0.00,30.00),('X4.6','Persentase rumah tangga yang menggunakan produk tradisional dalam 3 bulan terakhir',0.00,95.00),('X5.1','Persentase penduduk usia 10 tahun ke atas yang memberikan saran atau pendapat dalam kegiatan rapat selama setahun terakhir',0.00,30.00),('X5.2','Persentase penduduk usia 10 tahun ke atas yang aktif mengikuti kegiatan organisasi dalam setahun terakhir',0.00,20.00),('X5.3','Persentase penduduk usia 10 tahun ke atas yang pernah terlibat sebagai pelaku/pendukung pertunjukkan seni dalam 3 bulan terakhir',0.00,7.00),('X5.4','Persentase rumah tangga yang menyelenggarakan atau menghadiri upacara adat dalam setahun terakhir',0.00,45.00),('X6.1','Persentase penduduk usia 10 tahun ke atas yang membaca selain kitab suci baik cetak maupun elektronik dalam seminggu terakhir',0.00,70.00),('X6.2','Persentase penduduk usia 10 tahun ke atas yang mengakses internet dalam 3 bulan terakhir',0.00,85.00),('X6.3','Persentase penduduk usia 10 tahun ke atas yang mengunjungi perpustakaan/memanfaatkan taman bacaan masyarakat dalam 3 bulan terakhir',0.00,25.00),('X7.1','Rasio tingkat partisipasi angkatan kerja usia 15 tahun ke atas perempuan terhadap laki-laki',0.00,100.00),('X7.2','Rasio penduduk usia 25 tahun ke atas perempuan terhadap laki-laki yang memiliki ijazah minimal SMA/Sederajat',0.00,100.00),('X7.3','Rasio anggota parlemen perempuan terhadap anggota parlemen laki-laki',0.00,100.00);
/*!40000 ALTER TABLE `ref_indikator_2018` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_indikator_2024`
--

DROP TABLE IF EXISTS `ref_indikator_2024`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_indikator_2024` (
  `kode` varchar(10) NOT NULL,
  `nama_indikator` text NOT NULL,
  `nilai_minimum` decimal(10,2) DEFAULT NULL,
  `nilai_maximum` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`kode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_indikator_2024`
--

LOCK TABLES `ref_indikator_2024` WRITE;
/*!40000 ALTER TABLE `ref_indikator_2024` DISABLE KEYS */;
INSERT INTO `ref_indikator_2024` VALUES ('kode','nama_indikator',NULL,NULL),('X1.1','Persentase penduduk yang pernah terlibat sebagai pelaku/pendukung pertunjukan seni yang menjadikan keterlibatannya itu sebagai sumber penghasilan',0.00,1.00),('X1.2','Persentase pengeluaran konsumsi rumah tangga untuk kegiatan, barang dan jasa kebudayaan terhadap total pengeluaran konsumsi',0.00,13.00),('X2.1','Persentase satuan pendidikan yang mempunyai guru yang mengajar muatan lokal bahasa daerah dan/atau ekskul kesenian',0.00,96.00),('X2.2','Persentase guru yang mengajar bahasa dan budaya lokal terhadap total guru',0.00,55.00),('X2.3','Persentase penduduk yang terlibat dalam kegiatan pelatihan dan/atau pembelajaran seni dan budaya yang bersifat nonformal dan informal',0.00,90.00),('X3.1','Persentase rumah tangga yang setuju jika ada sekelompok orang dari suku lain yang melakukan kegiatan di lingkungan sekitar tempat tinggal',0.00,100.00),('X3.2','Persentase penduduk yang mengikuti kegiatan sosial kemasyarakatan di lingkungan sekitar',0.00,100.00),('X3.3','Persentase rumah tangga yang merasa aman saat berjalan kaki sendirian pada malam hari di lingkungan sekitar rumah',0.00,100.00),('X4.1','Persentase benda, bangunan, struktur, situs dan kawasan cagar budaya yang telah ditetapkan terhadap total pendaftaran',0.00,50.00),('X4.2','Persentase warisan budaya takbenda yang telah ditetapkan terhadap total pencatatan',0.00,50.00),('X4.3','Persentase penduduk yang menggunakan bahasa daerah di rumah atau dalam pergaulan sehari-hari',0.00,100.00),('X4.4','Persentase penduduk yang menonton secara langsung pertunjukkan seni',0.00,100.00),('X4.5','Persentase penduduk yang mengunjungi peninggalan sejarah/warisan dunia',0.00,35.00),('X4.6','Persentase rumah tangga yang menggunakan produk tradisional',0.00,100.00),('X5.1','Persentase penduduk yang pernah terlibat sebagai pelaku/pendukung pertunjukkan seni',0.00,20.00),('X5.2','Persentase rumah tangga yang menyelenggarakan upacara adat',0.00,60.00),('X5.3','Persentase penduduk yang melakukan olahraga tradisional dan/atau permainan rakyat',0.00,33.00),('X5.4','Persentase penduduk yang merasa aman dan diterima saat menampilkan identitas budaya (mengekspresikan budaya) di ruang publik',0.00,100.00),('X6.1','Persentase penduduk yang membaca selain kitab suci baik cetak maupun elektronik ',0.00,72.00),('X6.2','Persentase penduduk yang mengakses internet',0.00,98.00),('X6.3','Persentase penduduk yang mengunjungi perpustakaan/memanfaatkan taman bacaan masyarakat',0.00,25.00),('X7.1','Rasio tingkat partisipasi angkatan kerja perempuan terhadap laki-laki',0.00,100.00),('X7.2','Rasio penduduk perempuan terhadap laki-laki yang memiliki ijazah minimal SMA/Sederajat',0.00,100.00),('X7.3','Rasio anggota parlemen perempuan terhadap anggota parlemen laki-laki',0.00,100.00);
/*!40000 ALTER TABLE `ref_indikator_2024` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `fk_rp_perm` (`permission_id`),
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,12),(2,13),(2,14),(2,15),(2,16),(2,17),(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),(3,9),(3,12),(3,13),(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),(4,7),(4,8),(4,9),(4,14),(4,15),(4,16),(4,17),(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,8),(5,9),(6,1),(6,2),(6,3),(6,7),(6,8),(6,9);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kode` varchar(40) NOT NULL,
  `nama` varchar(80) NOT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `urutan` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode` (`kode`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'superadmin','Super Admin','Akses penuh termasuk kelola admin & sistem',1,'2026-11-05 19:53:54'),(2,'admin','Administrator','Akses operasional luas tanpa kelola admin',2,'2026-11-05 19:53:54'),(3,'data_admin','Pengelola Data','Input & revisi data IPK',3,'2026-11-05 19:53:54'),(4,'data_verifikator','Verifikator Data','Review, setujui, atau tolak data IPK',4,'2026-11-05 19:53:54'),(5,'content_admin','Pengelola Konten','Publikasi, FAQ, Tentang IPK',5,'2026-11-05 19:53:54'),(6,'service_admin','Pengelola Layanan','Permohonan, surat, unduhan',6,'2026-11-05 19:53:54');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skor_dimensi_provinsi_2018_2023`
--

DROP TABLE IF EXISTS `skor_dimensi_provinsi_2018_2023`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skor_dimensi_provinsi_2018_2023` (
  `tahun` year(4) NOT NULL,
  `kode_bps` varchar(10) NOT NULL,
  `nama_provinsi` varchar(100) NOT NULL,
  `dimensi_1` decimal(5,2) DEFAULT NULL,
  `dimensi_2` decimal(5,2) DEFAULT NULL,
  `dimensi_3` decimal(5,2) DEFAULT NULL,
  `dimensi_4` decimal(5,2) DEFAULT NULL,
  `dimensi_5` decimal(5,2) DEFAULT NULL,
  `dimensi_6` decimal(5,2) DEFAULT NULL,
  `dimensi_7` decimal(5,2) DEFAULT NULL,
  `ipk` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`tahun`,`kode_bps`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skor_dimensi_provinsi_2018_2023`
--

LOCK TABLES `skor_dimensi_provinsi_2018_2023` WRITE;
/*!40000 ALTER TABLE `skor_dimensi_provinsi_2018_2023` DISABLE KEYS */;
INSERT INTO `skor_dimensi_provinsi_2018_2023` VALUES (0000,'kode_bps','nama_provinsi',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00),(2018,'1100','Aceh',13.20,77.01,57.79,38.57,42.19,62.31,52.92,51.02),(2018,'1200','Sumatera Utara',17.82,73.46,70.71,33.08,34.89,53.54,60.01,50.73),(2018,'1300','Sumatera Barat',33.82,72.97,62.78,43.30,31.37,57.40,59.90,53.23),(2018,'1400','Riau',45.76,72.63,74.84,44.03,35.12,58.20,61.14,57.47),(2018,'1500','Jambi',36.24,66.84,71.25,45.53,29.07,49.25,54.36,53.18),(2018,'1600','Sumatera Selatan',25.69,65.76,70.78,43.67,24.76,47.31,57.17,50.86),(2018,'1700','Bengkulu',25.86,72.02,77.51,64.99,29.74,52.98,58.88,59.95),(2018,'1800','Lampung',30.42,72.43,77.47,44.99,27.13,46.57,53.79,54.33),(2018,'1900','Kepulauan Bangka Belitung',25.53,70.21,72.02,51.34,24.83,54.99,51.15,54.37),(2018,'2100','Kepulauan Riau',26.15,77.53,79.97,47.10,34.55,66.08,57.45,58.83),(2018,'3100','DKI Jakarta',22.26,73.40,74.16,41.52,25.92,71.20,56.80,54.67),(2018,'3200','Jawa Barat',33.17,67.76,66.39,38.35,29.54,58.95,52.51,51.21),(2018,'3300','Jawa Tengah',37.67,69.71,79.57,55.16,44.70,51.64,60.05,60.05),(2018,'3400','Daerah Istimewa Yogyakarta',74.29,78.94,85.24,66.37,63.84,76.27,58.54,73.79),(2018,'3500','Jawa Timur',36.78,69.60,74.93,45.91,46.35,53.13,52.97,56.66),(2018,'3600','Banten',11.10,68.38,64.35,44.07,29.00,54.93,52.44,49.69),(2018,'5100','Bali',52.91,77.94,80.39,49.07,70.19,63.79,55.37,65.39),(2018,'5200','Nusa Tenggara Barat',79.78,69.89,71.08,44.93,44.74,56.11,48.58,59.92),(2018,'5300','Nusa Tenggara Timur',3.96,68.36,73.98,35.70,39.53,46.29,55.23,49.13),(2018,'6100','Kalimantan Barat',14.54,61.18,77.61,34.37,29.79,44.94,51.70,47.86),(2018,'6200','Kalimantan Tengah',27.37,69.79,77.28,38.85,29.42,54.04,61.36,53.28),(2018,'6300','Kalimantan Selatan',22.24,69.80,74.59,43.06,32.16,60.28,53.53,53.79),(2018,'6400','Kalimantan Timur',26.60,73.85,76.82,29.96,33.86,66.13,49.99,52.78),(2018,'6500','Kalimantan Utara',0.00,72.10,76.56,30.63,40.29,57.71,56.30,50.00),(2018,'7100','Sulawesi Utara',33.67,72.41,81.12,33.06,51.00,49.94,71.77,56.02),(2018,'7200','Sulawesi Tengah',27.61,70.32,76.77,21.31,30.84,46.06,58.22,48.11),(2018,'7300','Sulawesi Selatan',11.62,70.34,73.18,36.37,25.35,54.75,57.03,49.82),(2018,'7400','Sulawesi Tenggara',11.86,71.58,75.05,26.88,21.41,53.17,58.51,47.62),(2018,'7500','Gorontalo',0.49,68.69,69.46,40.83,32.47,51.68,71.22,49.86),(2018,'7600','Sulawesi Barat',3.72,65.54,76.72,29.54,32.56,44.77,59.19,46.90),(2018,'8100','Maluku',11.11,67.85,74.87,36.33,31.23,47.91,65.26,49.91),(2018,'8200','Maluku Utara',0.00,65.90,75.35,30.61,37.11,46.82,54.47,47.02),(2018,'9100','Papua Barat',29.74,64.58,73.83,20.11,45.04,48.70,51.03,47.61),(2018,'9400','Papua',27.97,56.18,74.92,28.55,42.72,30.57,55.45,46.25),(2019,'1100','Aceh',17.39,82.59,58.64,41.10,42.57,65.43,52.24,53.67),(2019,'1200','Sumatera Utara',18.36,76.02,71.24,34.71,35.26,56.77,59.04,52.12),(2019,'1300','Sumatera Barat',33.24,75.75,63.43,46.57,32.22,60.76,57.72,54.99),(2019,'1400','Riau',48.32,77.23,75.41,45.91,36.13,61.90,60.24,59.65),(2019,'1500','Jambi',38.65,67.98,71.52,47.94,29.17,52.98,52.90,54.61),(2019,'1600','Sumatera Selatan',27.06,72.41,71.12,46.35,24.95,49.47,55.89,53.24),(2019,'1700','Bengkulu',28.02,76.26,78.00,63.98,29.66,56.40,57.50,61.13),(2019,'1800','Lampung',32.86,75.28,78.32,47.74,28.05,51.66,53.08,56.57),(2019,'1900','Kepulauan Bangka Belitung',32.86,72.75,72.95,52.60,26.13,59.76,49.18,56.62),(2019,'2100','Kepulauan Riau',27.06,82.24,80.15,47.84,34.24,72.13,62.40,60.90),(2019,'3100','DKI Jakarta',26.09,79.63,74.82,45.08,26.54,75.60,56.46,57.81),(2019,'3200','Jawa Barat',38.65,70.23,66.98,40.33,29.57,62.52,53.52,53.28),(2019,'3300','Jawa Tengah',44.45,71.46,80.30,51.95,45.45,56.67,58.95,60.94),(2019,'3400','Daerah Istimewa Yogyakarta',71.51,78.17,85.20,68.61,62.31,78.04,59.39,73.98),(2019,'3500','Jawa Timur',36.34,72.58,75.81,49.54,47.03,57.48,52.21,58.76),(2019,'3600','Banten',11.71,71.65,64.92,45.02,29.53,60.27,54.25,51.43),(2019,'5100','Bali',58.95,79.76,83.77,54.54,73.25,67.91,54.85,69.09),(2019,'5200','Nusa Tenggara Barat',82.81,72.54,72.37,47.22,46.57,63.74,49.18,62.56),(2019,'5300','Nusa Tenggara Timur',4.21,69.57,74.40,37.06,40.83,50.79,56.77,50.48),(2019,'6100','Kalimantan Barat',27.06,62.17,78.13,36.10,33.25,48.58,52.02,50.58),(2019,'6200','Kalimantan Tengah',33.82,73.26,77.84,40.58,29.98,58.90,62.48,55.76),(2019,'6300','Kalimantan Selatan',26.09,73.62,75.30,45.05,32.37,63.76,54.42,55.99),(2019,'6400','Kalimantan Timur',32.86,76.04,77.44,34.46,33.21,70.69,49.73,55.47),(2019,'6500','Kalimantan Utara',14.50,74.84,76.85,33.44,39.52,60.94,54.95,52.94),(2019,'7100','Sulawesi Utara',38.65,73.32,81.78,34.90,51.16,52.44,73.06,57.62),(2019,'7200','Sulawesi Tengah',30.92,71.33,77.35,22.60,32.27,49.17,57.32,49.49),(2019,'7300','Sulawesi Selatan',13.53,73.12,74.26,38.17,25.49,58.33,57.38,51.62),(2019,'7400','Sulawesi Tenggara',11.60,72.72,76.26,28.83,22.82,57.10,58.81,49.10),(2019,'7500','Gorontalo',0.97,66.49,70.93,42.42,33.21,54.79,71.70,50.57),(2019,'7600','Sulawesi Barat',4.83,66.72,78.28,31.49,34.13,47.71,57.46,48.41),(2019,'8100','Maluku',13.53,75.02,75.11,37.12,31.32,50.13,65.96,52.10),(2019,'8200','Maluku Utara',14.50,72.04,75.76,34.08,38.08,48.80,54.51,50.94),(2019,'9100','Papua Barat',32.86,71.42,74.09,21.43,43.10,53.58,52.41,50.03),(2019,'9400','Papua',27.44,58.96,75.07,29.71,44.80,33.17,54.36,47.49),(2020,'1100','Aceh',10.46,78.35,59.19,40.76,42.78,68.47,54.77,52.61),(2020,'1200','Sumatera Utara',11.54,71.38,71.46,33.51,33.83,59.39,58.14,50.33),(2020,'1300','Sumatera Barat',25.07,73.94,63.71,48.25,31.94,62.97,60.27,54.60),(2020,'1400','Riau',42.45,75.29,75.64,48.00,36.05,65.25,58.82,59.50),(2020,'1500','Jambi',29.42,67.47,71.56,44.19,28.01,55.69,53.82,52.86),(2020,'1600','Sumatera Selatan',20.56,67.82,71.27,44.66,24.29,52.72,58.86,51.68),(2020,'1700','Bengkulu',21.77,71.38,78.32,51.02,28.32,58.33,61.05,56.59),(2020,'1800','Lampung',26.24,73.74,78.74,44.53,27.88,54.94,56.91,55.38),(2020,'1900','Kepulauan Bangka Belitung',23.49,70.68,73.37,49.06,25.07,61.87,51.67,54.70),(2020,'2100','Kepulauan Riau',21.46,81.04,80.16,45.53,32.63,73.89,56.37,59.24),(2020,'3100','DKI Jakarta',19.16,82.27,75.34,42.32,25.27,77.35,57.00,57.13),(2020,'3200','Jawa Barat',30.70,70.70,67.41,37.34,28.34,64.82,54.05,52.04),(2020,'3300','Jawa Tengah',37.17,72.64,80.97,45.58,43.69,59.90,58.57,59.12),(2020,'3400','Daerah Istimewa Yogyakarta',64.79,79.99,85.04,61.11,57.15,80.34,64.53,71.74),(2020,'3500','Jawa Timur',31.21,72.62,76.30,46.71,44.68,60.19,56.23,57.88),(2020,'3600','Banten',1.01,69.79,65.26,40.60,29.19,61.30,52.84,48.95),(2020,'5100','Bali',42.50,79.83,85.68,50.91,61.94,71.26,60.03,66.40),(2020,'5200','Nusa Tenggara Barat',79.24,69.22,73.30,45.43,45.66,66.88,44.36,61.26),(2020,'5300','Nusa Tenggara Timur',1.01,63.76,74.59,35.32,40.08,53.77,58.84,48.93),(2020,'6100','Kalimantan Barat',23.83,59.02,78.40,34.24,34.53,51.03,54.62,49.72),(2020,'6200','Kalimantan Tengah',25.94,70.84,78.10,36.90,29.41,60.62,65.45,53.88),(2020,'6300','Kalimantan Selatan',16.45,73.52,75.78,41.40,31.25,65.75,57.20,54.41),(2020,'6400','Kalimantan Timur',25.11,72.04,77.70,30.45,31.89,73.64,52.55,53.25),(2020,'6500','Kalimantan Utara',5.99,71.11,76.92,29.54,38.21,63.58,53.86,50.46),(2020,'7100','Sulawesi Utara',32.20,69.41,82.03,32.06,49.26,54.61,63.60,55.09),(2020,'7200','Sulawesi Tengah',25.09,63.19,77.62,21.82,31.78,52.21,57.94,47.42),(2020,'7300','Sulawesi Selatan',9.13,71.83,74.92,36.79,24.89,61.12,60.82,51.10),(2020,'7400','Sulawesi Tenggara',6.36,74.40,76.85,27.71,22.50,59.78,57.31,48.91),(2020,'7500','Gorontalo',1.01,70.43,71.96,41.27,33.76,56.83,70.62,51.49),(2020,'7600','Sulawesi Barat',1.81,61.63,79.40,29.87,34.14,51.07,55.25,47.14),(2020,'8100','Maluku',6.84,70.68,75.15,35.48,30.32,52.53,64.61,50.23),(2020,'8200','Maluku Utara',7.50,67.99,75.94,37.35,37.93,51.73,58.10,50.74),(2020,'9100','Papua Barat',26.26,63.08,74.14,20.55,43.88,56.96,55.51,48.07),(2020,'9400','Papua',25.41,52.78,75.07,29.07,43.77,36.03,58.11,46.26),(2021,'1100','Aceh',11.59,76.93,54.28,42.19,32.86,59.40,54.33,49.89),(2021,'1200','Sumatera Utara',11.27,68.55,69.75,36.48,23.22,55.66,58.79,48.74),(2021,'1300','Sumatera Barat',18.97,72.70,58.13,52.31,24.50,61.17,60.10,52.71),(2021,'1400','Riau',26.35,74.27,70.07,47.47,22.31,56.39,59.20,54.20),(2021,'1500','Jambi',22.12,66.09,69.70,49.35,25.67,53.88,54.63,52.39),(2021,'1600','Sumatera Selatan',18.30,64.21,64.31,53.15,15.30,55.41,60.01,50.89),(2021,'1700','Bengkulu',25.35,71.22,73.15,50.85,21.94,53.22,58.39,54.56),(2021,'1800','Lampung',18.57,73.00,71.54,50.11,20.14,50.20,57.18,53.19),(2021,'1900','Kepulauan Bangka Belitung',18.06,64.91,69.48,50.14,14.68,55.75,51.75,50.85),(2021,'2100','Kepulauan Riau',14.64,73.61,73.53,37.81,22.74,66.78,56.53,52.12),(2021,'3100','DKI Jakarta',16.05,77.81,66.81,43.70,15.00,67.11,58.23,52.58),(2021,'3200','Jawa Barat',24.44,67.21,59.44,49.52,21.79,56.60,55.69,50.78),(2021,'3300','Jawa Tengah',25.96,71.21,72.37,50.12,34.79,50.00,58.28,55.24),(2021,'3400','Daerah Istimewa Yogyakarta',56.79,80.68,76.50,56.57,41.11,56.20,64.61,64.22),(2021,'3500','Jawa Timur',19.81,70.61,66.54,49.82,34.39,50.81,56.15,53.19),(2021,'3600','Banten',12.24,65.78,53.73,47.34,22.05,56.58,52.97,47.47),(2021,'5100','Bali',29.41,72.85,76.75,54.67,52.99,62.99,60.33,61.14),(2021,'5200','Nusa Tenggara Barat',47.97,71.61,64.36,47.08,31.43,54.22,48.18,54.73),(2021,'5300','Nusa Tenggara Timur',2.44,59.20,75.80,39.88,30.50,47.32,63.75,48.18),(2021,'6100','Kalimantan Barat',12.43,53.02,76.09,44.66,24.25,50.91,55.70,48.53),(2021,'6200','Kalimantan Tengah',20.40,68.50,75.69,53.49,24.56,52.19,65.64,55.21),(2021,'6300','Kalimantan Selatan',19.05,69.14,69.08,49.52,24.02,52.43,57.53,52.45),(2021,'6400','Kalimantan Timur',29.65,72.20,72.46,37.44,24.33,60.09,55.88,52.49),(2021,'6500','Kalimantan Utara',9.69,71.40,73.21,40.19,22.63,52.79,52.02,50.08),(2021,'7100','Sulawesi Utara',20.71,66.38,78.31,28.74,35.37,48.01,66.13,49.84),(2021,'7200','Sulawesi Tengah',13.74,64.12,70.37,34.69,28.24,51.09,62.78,48.02),(2021,'7300','Sulawesi Selatan',10.03,72.94,69.79,44.20,20.46,54.85,61.69,51.21),(2021,'7400','Sulawesi Tenggara',7.27,65.56,70.84,37.94,22.14,59.82,58.62,48.62),(2021,'7500','Gorontalo',0.46,62.91,62.99,40.11,24.63,61.21,66.05,47.14),(2021,'7600','Sulawesi Barat',7.03,61.22,71.52,35.84,21.88,47.61,53.97,45.86),(2021,'8100','Maluku',14.95,65.69,78.75,47.51,39.49,47.81,64.85,54.23),(2021,'8200','Maluku Utara',8.10,63.33,74.94,42.55,29.62,48.26,60.35,49.91),(2021,'9100','Papua Barat',18.95,63.71,74.72,25.07,33.52,47.42,56.94,46.79),(2021,'9400','Papua',19.38,45.21,71.36,30.86,33.93,27.36,55.53,41.87),(2022,'1100','Aceh',11.79,80.90,57.14,45.23,39.61,63.25,53.12,53.03),(2022,'1200','Sumatera Utara',15.50,74.57,72.10,40.14,25.21,59.88,60.88,52.47),(2022,'1300','Sumatera Barat',34.65,73.28,61.97,56.85,28.71,62.95,60.07,56.90),(2022,'1400','Riau',39.34,76.22,73.88,51.75,25.39,61.92,57.91,58.52),(2022,'1500','Jambi',25.78,65.61,73.12,51.91,25.45,58.54,53.63,54.38),(2022,'1600','Sumatera Selatan',15.23,68.49,66.59,55.67,16.47,59.51,60.70,53.09),(2022,'1700','Bengkulu',30.66,74.44,75.77,52.51,23.92,57.60,57.81,57.28),(2022,'1800','Lampung',18.61,77.60,73.33,51.37,25.41,53.98,57.61,55.71),(2022,'1900','Kepulauan Bangka Belitung',22.91,70.70,71.41,52.98,14.87,60.37,51.19,54.04),(2022,'2100','Kepulauan Riau',20.97,80.55,76.92,43.18,29.00,64.73,54.85,56.50),(2022,'3100','DKI Jakarta',12.14,80.75,70.79,46.00,19.18,68.64,58.24,54.72),(2022,'3200','Jawa Barat',28.22,71.43,62.48,52.12,23.38,58.28,57.43,53.67),(2022,'3300','Jawa Tengah',44.00,73.56,74.02,52.31,41.59,53.36,58.88,59.43),(2022,'3400','Daerah Istimewa Yogyakarta',67.32,80.88,77.90,58.20,45.06,57.72,64.05,66.52),(2022,'3500','Jawa Timur',30.07,73.78,68.61,52.59,41.21,54.70,58.42,57.15),(2022,'3600','Banten',18.83,70.20,56.92,51.77,25.25,59.01,54.73,51.41),(2022,'5100','Bali',43.15,78.04,77.53,60.92,59.58,63.74,61.02,66.04),(2022,'5200','Nusa Tenggara Barat',43.09,71.80,68.76,47.72,37.37,59.59,51.11,56.60),(2022,'5300','Nusa Tenggara Timur',4.65,65.51,79.61,38.99,32.36,49.25,66.08,50.70),(2022,'6100','Kalimantan Barat',9.29,61.12,77.89,50.57,31.14,55.84,57.62,52.95),(2022,'6200','Kalimantan Tengah',17.24,73.64,78.62,56.14,29.31,57.20,64.57,58.09),(2022,'6300','Kalimantan Selatan',49.49,73.41,72.17,51.73,29.71,56.03,57.54,58.45),(2022,'6400','Kalimantan Timur',14.75,76.55,74.40,43.86,28.51,64.95,56.65,54.81),(2022,'6500','Kalimantan Utara',19.29,73.39,77.30,47.42,31.13,57.00,53.19,55.40),(2022,'7100','Sulawesi Utara',46.65,73.16,79.89,30.48,39.34,49.60,63.64,54.97),(2022,'7200','Sulawesi Tengah',2.89,71.73,71.51,35.65,31.66,54.03,65.82,49.71),(2022,'7300','Sulawesi Selatan',7.08,72.75,72.09,45.95,25.37,58.05,63.46,52.68),(2022,'7400','Sulawesi Tenggara',11.15,73.25,74.22,40.12,30.27,62.84,60.57,52.98),(2022,'7500','Gorontalo',2.22,67.12,64.16,42.15,29.71,63.55,66.02,49.64),(2022,'7600','Sulawesi Barat',21.41,62.13,73.00,37.75,30.29,50.90,55.11,49.48),(2022,'8100','Maluku',3.81,71.77,80.70,48.52,45.09,51.88,63.39,55.87),(2022,'8200','Maluku Utara',10.55,67.55,75.88,41.71,40.71,55.20,62.22,52.87),(2022,'9100','Papua Barat',3.25,69.66,75.98,24.66,34.44,50.14,56.97,46.92),(2022,'9400','Papua',15.98,53.90,70.81,32.45,41.37,29.13,58.27,44.62),(2023,'1100','Aceh',14.36,82.13,59.58,48.43,38.79,68.17,55.02,55.33),(2023,'1200','Sumatera Utara',19.21,76.25,73.61,41.01,28.53,63.20,59.15,54.28),(2023,'1300','Sumatera Barat',25.28,75.12,63.27,64.73,29.80,69.45,60.44,59.34),(2023,'1400','Riau',30.73,78.03,75.30,53.02,26.54,63.46,60.03,58.99),(2023,'1500','Jambi',42.20,70.82,75.09,53.53,31.43,62.11,55.68,58.92),(2023,'1600','Sumatera Selatan',25.12,69.76,68.31,64.57,17.34,63.67,62.84,57.51),(2023,'1700','Bengkulu',49.73,79.35,76.90,53.41,27.69,61.91,58.21,61.45),(2023,'1800','Lampung',27.77,74.78,74.72,55.31,26.14,58.42,57.21,57.82),(2023,'1900','Kepulauan Bangka Belitung',33.65,72.77,72.98,57.95,18.26,64.99,53.31,57.99),(2023,'2100','Kepulauan Riau',20.39,82.46,78.28,51.91,28.94,68.95,56.98,59.80),(2023,'3100','DKI Jakarta',14.59,79.20,71.79,48.56,21.28,70.58,59.59,55.96),(2023,'3200','Jawa Barat',27.87,72.06,63.51,55.64,26.36,61.91,57.18,55.50),(2023,'3300','Jawa Tengah',45.11,73.50,75.61,53.13,46.35,56.63,59.61,60.89),(2023,'3400','Daerah Istimewa Yogyakarta',59.10,80.09,78.78,63.29,50.63,60.51,65.53,67.90),(2023,'3500','Jawa Timur',33.79,74.36,70.51,54.60,47.19,56.75,59.59,59.38),(2023,'3600','Banten',23.87,70.92,58.03,50.96,27.84,60.56,54.70,52.49),(2023,'5100','Bali',67.90,81.64,78.52,65.33,65.80,65.48,61.46,71.36),(2023,'5200','Nusa Tenggara Barat',41.92,72.91,68.97,48.37,39.74,61.20,52.25,57.37),(2023,'5300','Nusa Tenggara Timur',3.72,70.21,80.87,40.95,35.12,53.99,66.12,53.04),(2023,'6100','Kalimantan Barat',21.76,60.37,78.83,50.83,35.43,59.65,58.39,55.15),(2023,'6200','Kalimantan Tengah',13.28,74.04,80.95,64.23,32.01,61.86,62.35,60.89),(2023,'6300','Kalimantan Selatan',33.07,71.18,73.84,56.75,32.74,58.75,58.03,58.55),(2023,'6400','Kalimantan Timur',25.05,76.49,76.08,46.02,34.12,67.22,58.14,57.56),(2023,'6500','Kalimantan Utara',8.76,78.39,78.78,49.34,32.44,61.11,53.94,56.70),(2023,'7100','Sulawesi Utara',39.05,69.73,81.03,34.08,42.77,51.55,67.55,55.39),(2023,'7200','Sulawesi Tengah',2.08,73.31,73.72,38.44,34.11,55.65,64.47,51.42),(2023,'7300','Sulawesi Selatan',16.59,74.02,74.17,48.18,27.48,60.01,63.48,55.26),(2023,'7400','Sulawesi Tenggara',17.83,74.72,75.50,42.25,31.33,65.78,60.09,55.10),(2023,'7500','Gorontalo',9.42,65.73,65.55,48.06,33.02,65.96,67.36,52.48),(2023,'7600','Sulawesi Barat',10.12,64.56,74.54,40.57,32.01,55.61,54.68,50.47),(2023,'8100','Maluku',11.84,70.69,81.99,58.33,43.29,54.34,66.36,59.38),(2023,'8200','Maluku Utara',18.89,67.18,76.97,50.12,39.96,55.98,64.17,56.05),(2023,'9100','Papua Barat',10.72,70.87,76.40,24.99,32.83,51.02,57.69,48.04),(2023,'9400','Papua',25.78,54.47,71.02,43.49,38.91,31.73,58.09,48.52);
/*!40000 ALTER TABLE `skor_dimensi_provinsi_2018_2023` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skor_dimensi_provinsi_2024`
--

DROP TABLE IF EXISTS `skor_dimensi_provinsi_2024`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skor_dimensi_provinsi_2024` (
  `tahun` year(4) NOT NULL,
  `kode_bps` varchar(10) NOT NULL,
  `nama_provinsi` varchar(100) NOT NULL,
  `dimensi_1` decimal(5,2) DEFAULT NULL,
  `dimensi_2` decimal(5,2) DEFAULT NULL,
  `dimensi_3` decimal(5,2) DEFAULT NULL,
  `dimensi_4` decimal(5,2) DEFAULT NULL,
  `dimensi_5` decimal(5,2) DEFAULT NULL,
  `dimensi_6` decimal(5,2) DEFAULT NULL,
  `dimensi_7` decimal(5,2) DEFAULT NULL,
  `skor_ipk` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`tahun`,`kode_bps`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skor_dimensi_provinsi_2024`
--

LOCK TABLES `skor_dimensi_provinsi_2024` WRITE;
/*!40000 ALTER TABLE `skor_dimensi_provinsi_2024` DISABLE KEYS */;
INSERT INTO `skor_dimensi_provinsi_2024` VALUES (0000,'kode_bps','nama_provinsi',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00),(2024,'1100','Aceh',15.20,76.06,73.97,49.32,38.89,67.41,53.76,57.17),(2024,'1200','Sumatera Utara',17.95,71.85,77.45,43.26,32.40,63.37,61.27,55.11),(2024,'1300','Sumatera Barat',26.57,69.80,73.77,69.82,38.32,77.63,60.46,63.44),(2024,'1400','Riau',23.83,73.37,73.94,55.64,36.76,68.69,53.99,59.00),(2024,'1500','Jambi',25.49,62.60,78.24,57.02,35.08,62.01,52.74,57.32),(2024,'1600','Sumatera Selatan',23.87,69.51,77.94,66.53,35.98,65.94,61.65,61.78),(2024,'1700','Bengkulu',31.84,67.96,78.67,54.71,35.94,65.16,61.58,59.38),(2024,'1800','Lampung',30.12,69.41,82.26,59.03,36.24,63.25,58.40,60.97),(2024,'1900','Kepulauan Bangka Belitung',23.70,59.53,74.16,69.30,42.29,71.00,59.63,60.74),(2024,'2100','Kepulauan Riau',18.09,64.69,80.17,60.37,37.46,78.50,57.42,60.34),(2024,'3100','DKI Jakarta',15.80,71.77,76.16,54.69,33.41,80.76,60.66,59.29),(2024,'3200','Jawa Barat',28.37,75.68,69.98,55.98,37.53,65.52,58.72,59.21),(2024,'3300','Jawa Tengah',36.97,79.50,79.29,59.24,43.59,63.28,58.84,63.89),(2024,'3400','Daerah Istimewa Yogyakarta',37.06,86.00,80.85,74.45,44.64,77.08,63.57,71.04),(2024,'3500','Jawa Timur',34.79,82.71,76.71,58.01,51.44,60.34,58.67,63.98),(2024,'3600','Banten',23.90,65.61,67.29,57.33,42.91,64.94,52.15,56.70),(2024,'5100','Bali',62.79,90.63,78.82,64.23,41.40,72.29,61.21,70.66),(2024,'5200','Nusa Tenggara Barat',47.10,69.46,79.39,50.16,43.61,63.49,53.68,60.41),(2024,'5300','Nusa Tenggara Timur',15.15,65.36,81.09,44.69,39.96,54.96,68.40,54.89),(2024,'6100','Kalimantan Barat',17.41,58.64,77.69,55.48,38.09,60.13,58.90,55.64),(2024,'6200','Kalimantan Tengah',25.86,67.01,81.20,62.41,32.97,60.74,56.20,60.01),(2024,'6300','Kalimantan Selatan',29.52,61.96,79.92,59.22,33.95,67.88,57.59,59.19),(2024,'6400','Kalimantan Timur',25.72,67.54,77.23,39.10,33.39,73.42,54.94,54.73),(2024,'6500','Kalimantan Utara',23.87,57.80,75.62,40.83,33.43,63.71,56.31,51.81),(2024,'7100','Sulawesi Utara',18.16,60.71,83.34,46.03,35.40,54.09,82.68,55.22),(2024,'7200','Sulawesi Tengah',20.21,59.61,78.37,39.47,40.18,62.49,64.14,52.96),(2024,'7300','Sulawesi Selatan',31.43,72.36,73.72,48.82,35.48,64.71,63.00,57.73),(2024,'7400','Sulawesi Tenggara',20.70,67.85,75.69,50.29,33.32,63.63,66.65,56.38),(2024,'7500','Gorontalo',30.13,55.23,71.62,50.35,33.37,66.23,65.90,54.23),(2024,'7600','Sulawesi Barat',25.01,59.72,80.15,47.76,40.40,64.77,59.51,55.91),(2024,'8100','Maluku',22.22,59.01,81.21,59.05,36.33,55.15,61.77,57.27),(2024,'8200','Maluku Utara',11.03,53.91,75.32,57.79,31.16,54.37,64.78,53.19),(2024,'9100','Papua Barat',24.80,51.13,80.92,33.46,25.17,47.97,54.86,47.31),(2024,'9200','Papua Barat Daya',26.52,51.38,74.20,27.81,24.32,53.06,58.39,45.38),(2024,'9400','Papua',15.78,50.57,77.61,44.00,18.09,61.63,57.90,49.08),(2024,'9500','Papua Selatan',15.56,48.97,82.32,35.50,26.77,44.66,54.06,46.53),(2024,'9600','Papua Tengah',10.54,45.55,67.68,32.04,21.25,29.50,53.17,39.45),(2024,'9700','Papua Pegunungan',17.46,43.03,74.82,33.68,20.42,11.31,57.85,39.80);
/*!40000 ALTER TABLE `skor_dimensi_provinsi_2024` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skor_indikator_provinsi_2018_2023`
--

DROP TABLE IF EXISTS `skor_indikator_provinsi_2018_2023`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skor_indikator_provinsi_2018_2023` (
  `tahun` year(4) NOT NULL,
  `kode_bps` varchar(10) NOT NULL,
  `nama_provinsi` varchar(100) NOT NULL,
  `x1_1` decimal(5,2) DEFAULT NULL,
  `x2_1` decimal(5,2) DEFAULT NULL,
  `x2_2` decimal(5,2) DEFAULT NULL,
  `x2_3` decimal(5,2) DEFAULT NULL,
  `x2_4` decimal(5,2) DEFAULT NULL,
  `x2_5` decimal(5,2) DEFAULT NULL,
  `x2_6` decimal(5,2) DEFAULT NULL,
  `x3_1` decimal(5,2) DEFAULT NULL,
  `x3_2` decimal(5,2) DEFAULT NULL,
  `x3_3` decimal(5,2) DEFAULT NULL,
  `x3_4` decimal(5,2) DEFAULT NULL,
  `x3_5` decimal(5,2) DEFAULT NULL,
  `x3_6` decimal(5,2) DEFAULT NULL,
  `x3_7` decimal(5,2) DEFAULT NULL,
  `x3_8` decimal(5,2) DEFAULT NULL,
  `x4_1` decimal(5,2) DEFAULT NULL,
  `x4_2` decimal(5,2) DEFAULT NULL,
  `x4_3` decimal(5,2) DEFAULT NULL,
  `x4_4` decimal(5,2) DEFAULT NULL,
  `x4_5` decimal(5,2) DEFAULT NULL,
  `x4_6` decimal(5,2) DEFAULT NULL,
  `x5_1` decimal(5,2) DEFAULT NULL,
  `x5_2` decimal(5,2) DEFAULT NULL,
  `x5_3` decimal(5,2) DEFAULT NULL,
  `x5_4` decimal(5,2) DEFAULT NULL,
  `x6_1` decimal(5,2) DEFAULT NULL,
  `x6_2` decimal(5,2) DEFAULT NULL,
  `x6_3` decimal(5,2) DEFAULT NULL,
  `x7_1` decimal(5,2) DEFAULT NULL,
  `x7_2` decimal(5,2) DEFAULT NULL,
  `x7_3` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`tahun`,`kode_bps`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skor_indikator_provinsi_2018_2023`
--

LOCK TABLES `skor_indikator_provinsi_2018_2023` WRITE;
/*!40000 ALTER TABLE `skor_indikator_provinsi_2018_2023` DISABLE KEYS */;
INSERT INTO `skor_indikator_provinsi_2018_2023` VALUES (0000,'kode_bps','nama_provinsi',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00),(2018,'1100','Aceh',0.13,9.09,14.27,73.74,34.00,78.05,94.85,31.86,60.64,41.91,71.19,87.02,42.98,25.16,77.02,2.27,9.85,75.06,23.76,14.71,46.70,15.05,3.85,1.31,36.31,60.03,34.35,15.19,60.50,82.32,15.94),(2018,'1200','Sumatera Utara',0.18,9.34,13.14,65.08,32.38,75.73,92.73,75.02,84.12,85.44,91.30,79.58,24.94,27.09,79.41,4.52,6.57,39.48,38.66,9.39,47.74,9.48,8.94,2.48,12.55,52.28,38.17,10.25,71.41,90.98,17.65),(2018,'1300','Sumatera Barat',0.34,8.76,13.95,73.85,26.35,75.77,93.73,53.51,70.88,68.47,82.63,75.93,36.86,29.03,72.05,8.47,6.29,95.63,23.39,13.63,52.99,12.97,4.98,1.68,14.97,43.01,40.25,15.85,67.87,99.75,12.07),(2018,'1400','Riau',0.46,8.92,13.11,73.26,33.48,65.26,90.54,75.87,88.67,87.66,94.14,82.95,38.16,23.56,78.39,3.66,19.34,56.77,39.23,7.85,75.26,11.43,6.48,1.89,19.31,49.39,44.37,12.96,54.51,89.79,39.13),(2018,'1500','Jambi',0.36,8.23,12.90,69.64,22.29,64.90,90.45,61.85,76.33,76.91,88.44,86.77,45.03,22.34,79.36,1.59,22.56,84.83,36.76,10.80,48.94,11.04,5.65,1.65,12.46,45.99,38.89,9.08,61.65,81.87,19.57),(2018,'1600','Sumatera Selatan',0.26,8.00,12.36,62.79,27.03,59.36,90.35,70.17,78.56,78.17,84.19,85.00,32.30,23.34,84.52,0.75,12.50,97.43,48.48,4.95,49.74,8.51,4.85,1.19,13.26,41.32,36.69,9.93,64.21,85.62,21.67),(2018,'1700','Bengkulu',0.26,8.61,13.58,74.85,23.46,78.97,93.29,79.88,88.69,88.21,93.82,81.65,35.39,18.55,89.55,41.13,4.58,93.57,44.23,19.44,73.11,12.74,6.48,1.72,8.77,43.46,35.98,13.63,67.26,87.75,21.62),(2018,'1800','Lampung',0.30,7.82,12.61,83.15,33.07,64.47,91.28,82.73,85.74,90.14,94.44,86.80,34.67,21.40,88.01,1.77,19.88,70.74,52.27,4.18,63.94,8.73,5.80,1.61,12.35,37.53,35.55,11.07,59.21,84.10,18.06),(2018,'1900','Kepulauan Bangka Belitung',0.26,7.84,11.87,85.44,22.85,80.78,86.06,77.78,84.22,89.63,92.09,79.42,26.15,27.62,82.10,5.13,19.15,96.47,50.25,12.40,47.37,5.95,4.77,1.19,17.38,46.58,40.82,12.60,59.89,86.42,7.14),(2018,'2100','Kepulauan Riau',0.26,9.81,12.82,79.85,29.97,87.24,94.90,91.29,88.23,98.67,97.60,77.74,46.97,15.76,70.77,29.93,16.96,39.90,42.75,9.46,53.51,13.70,6.63,1.37,17.93,54.74,59.55,12.50,55.85,94.89,21.62),(2018,'3100','DKI Jakarta',0.22,11.05,12.95,81.57,21.61,71.45,93.72,84.43,86.31,91.20,95.02,77.88,39.77,24.92,68.52,0.45,40.82,3.74,28.38,20.79,50.36,11.35,4.82,1.35,10.07,53.23,71.13,13.47,60.91,86.22,23.26),(2018,'3200','Jawa Barat',0.33,8.15,12.45,72.54,23.20,71.22,87.73,54.04,70.07,67.68,81.19,83.32,41.30,24.48,82.48,3.76,6.66,72.33,29.49,10.60,56.53,10.34,4.94,1.60,16.23,49.91,49.37,11.87,50.99,78.33,28.21),(2018,'3300','Jawa Tengah',0.38,7.35,12.63,89.39,22.85,69.28,89.63,79.51,83.06,87.26,90.49,91.31,53.19,18.77,89.27,29.67,4.70,95.57,39.90,11.35,68.19,15.59,8.86,2.11,23.59,40.28,41.38,12.18,69.48,79.09,31.58),(2018,'3400','Daerah Istimewa Yogyakarta',0.74,9.32,15.56,99.54,15.43,95.18,96.04,89.48,90.12,94.52,95.17,92.85,71.10,17.38,83.42,16.03,18.46,89.52,56.12,24.10,75.25,25.65,11.47,4.38,22.47,57.53,58.46,19.46,77.91,83.13,14.58),(2018,'3500','Jawa Timur',0.37,7.39,13.10,89.15,19.32,73.33,90.14,74.48,80.16,82.60,88.04,88.76,45.80,21.30,82.17,2.64,5.82,93.91,40.75,10.62,67.48,11.77,6.08,2.28,37.42,43.28,41.38,12.22,66.02,74.60,18.29),(2018,'3600','Banten',0.11,8.62,12.85,65.07,24.77,73.29,88.02,57.75,68.37,69.77,76.51,79.38,38.12,28.49,81.84,2.07,20.22,55.91,23.82,18.75,64.01,8.65,3.71,0.95,24.79,40.03,52.45,11.47,55.20,75.25,26.87),(2018,'5100','Bali',0.53,8.65,13.23,82.16,39.69,72.97,93.18,82.73,82.13,96.12,95.88,83.33,45.84,13.06,83.17,0.75,13.96,87.65,40.72,9.92,81.82,10.56,17.10,5.69,35.43,52.66,49.73,14.41,84.70,71.42,10.00),(2018,'5200','Nusa Tenggara Barat',0.80,7.03,13.47,65.92,27.96,77.78,91.83,55.80,74.98,67.93,86.29,91.12,52.40,25.09,90.30,1.43,6.43,90.55,36.51,9.62,75.15,13.28,9.91,2.09,24.86,40.42,31.53,18.37,68.82,68.43,8.47),(2018,'5300','Nusa Tenggara Timur',0.04,7.30,13.10,52.99,32.85,71.41,91.29,83.36,86.80,90.15,92.79,80.36,47.27,32.84,76.76,0.46,8.48,68.53,13.68,6.98,80.69,17.02,5.39,1.87,21.45,44.25,24.00,11.86,73.94,79.67,12.07),(2018,'6100','Kalimantan Barat',0.15,7.12,12.55,35.93,28.02,63.03,88.69,90.98,92.07,95.65,96.33,75.34,30.86,20.97,81.59,4.68,6.67,74.27,26.21,5.94,49.40,9.57,4.03,1.13,22.91,40.67,34.04,9.16,63.36,79.66,12.07),(2018,'6200','Kalimantan Tengah',0.27,8.37,12.55,77.16,32.16,55.33,89.23,90.96,91.41,96.06,97.34,79.39,28.67,25.10,84.61,0.92,3.14,89.46,32.55,9.18,55.50,10.67,4.15,1.50,17.96,50.98,39.33,10.76,60.19,83.26,40.63),(2018,'6300','Kalimantan Selatan',0.22,8.00,12.50,87.61,26.10,62.27,88.12,71.22,85.06,81.56,91.41,80.46,36.01,15.29,81.56,3.91,10.24,95.99,29.23,8.62,60.40,8.47,4.04,2.27,21.50,53.09,44.69,13.10,65.56,78.01,17.02),(2018,'6400','Kalimantan Timur',0.27,9.48,13.67,82.78,22.05,78.11,94.06,89.14,92.32,94.74,95.80,75.81,36.14,21.97,74.51,0.51,5.33,31.73,37.00,13.18,37.61,11.46,4.94,2.22,18.35,52.86,54.88,14.57,54.98,82.76,12.24),(2018,'6500','Kalimantan Utara',0.00,8.87,12.82,76.50,28.24,73.59,89.39,93.23,97.69,98.25,99.27,71.27,34.08,27.91,74.51,0.00,22.54,25.14,30.79,9.89,34.79,10.84,6.33,2.88,23.49,45.60,51.25,11.92,60.58,83.32,25.00),(2018,'7100','Sulawesi Utara',0.34,9.24,12.68,80.10,25.25,76.23,89.96,91.93,91.33,95.97,96.59,88.89,53.94,24.89,80.10,2.92,3.69,80.24,20.51,10.15,39.66,14.55,12.76,2.58,24.67,45.38,43.96,8.32,56.52,98.08,60.71),(2018,'7200','Sulawesi Tengah',0.28,8.52,13.13,78.16,21.46,76.77,89.56,84.29,90.85,91.88,95.32,81.08,44.44,28.81,83.94,1.76,3.27,40.79,18.29,2.14,41.54,10.45,6.89,0.98,18.04,39.11,31.89,11.19,63.80,85.85,25.00),(2018,'7300','Sulawesi Selatan',0.12,8.02,13.34,68.24,32.52,64.85,89.09,77.31,83.82,83.63,90.43,79.20,33.73,25.45,88.19,2.42,17.20,67.01,26.46,6.75,49.06,6.77,3.24,1.09,21.18,45.14,40.64,12.99,58.88,85.34,26.87),(2018,'7400','Sulawesi Tenggara',0.12,8.69,13.53,77.74,30.27,60.00,91.36,85.98,94.16,87.24,95.96,71.91,30.08,24.55,84.18,2.45,7.74,41.73,23.35,7.19,39.79,7.96,2.44,1.26,13.05,42.66,37.56,13.59,66.90,82.90,25.71),(2018,'7500','Gorontalo',0.00,7.46,13.03,91.00,24.00,56.97,88.70,76.56,89.34,79.30,90.34,81.28,31.71,35.49,78.13,4.55,6.89,82.76,22.55,11.65,64.88,10.55,4.22,1.24,25.17,36.23,37.87,14.68,61.43,110.31,41.94),(2018,'7600','Sulawesi Barat',0.04,7.50,12.59,65.98,19.64,75.83,87.85,77.82,87.49,87.99,93.38,76.78,33.31,15.63,88.22,0.00,12.84,72.55,20.27,3.19,37.43,9.33,8.49,0.80,20.39,39.24,29.25,10.96,64.12,88.45,25.00),(2018,'8100','Maluku',0.11,9.58,13.92,51.59,28.56,57.17,93.66,84.36,87.97,93.00,95.33,75.48,51.27,30.49,72.56,16.33,18.33,71.17,14.11,6.57,33.65,8.02,9.30,1.14,15.96,39.92,33.67,11.77,65.13,90.04,40.63),(2018,'8200','Maluku Utara',0.00,8.72,13.62,47.83,22.18,73.20,91.30,79.75,81.33,80.53,86.18,78.27,59.94,21.38,79.56,5.26,8.55,57.18,14.35,9.33,44.93,13.84,7.51,0.64,25.03,48.04,29.11,9.40,62.21,79.59,21.62),(2018,'9100','Papua Barat',0.30,7.27,12.53,50.43,29.56,62.08,91.20,92.59,95.52,96.08,97.08,69.11,35.92,35.83,76.04,0.00,3.32,17.16,19.41,5.23,49.12,15.55,9.05,2.31,22.56,45.30,40.49,8.44,64.30,81.11,7.69),(2018,'9400','Papua',0.28,6.52,10.83,34.65,26.72,65.08,74.31,84.22,85.35,90.04,93.13,76.07,47.08,21.94,67.36,7.14,4.01,56.11,16.80,3.98,52.82,14.50,7.94,3.97,11.78,35.05,21.98,3.94,81.95,69.40,15.00),(2019,'1100','Aceh',0.17,9.18,14.30,73.85,43.06,90.69,94.67,34.97,61.57,44.37,72.35,86.92,42.27,25.19,77.07,2.15,10.37,74.85,26.64,17.87,46.65,14.80,4.04,1.48,35.81,59.78,39.67,16.05,56.83,81.51,18.38),(2019,'1200','Sumatera Utara',0.18,9.45,13.15,65.19,38.80,75.04,93.60,76.17,86.19,86.20,92.10,79.51,24.53,27.12,79.47,3.10,6.67,39.37,42.82,11.40,47.69,9.57,8.77,2.57,12.88,52.40,45.58,10.46,67.70,91.77,17.65),(2019,'1300','Sumatera Barat',0.33,8.92,14.01,74.24,30.52,80.63,94.49,53.69,71.58,72.52,83.58,75.88,36.25,29.07,72.10,8.49,10.06,95.33,26.41,16.06,52.93,13.39,5.22,1.72,15.10,43.16,44.94,16.94,66.38,94.70,12.07),(2019,'1400','Riau',0.48,9.03,13.14,73.37,41.34,73.10,91.86,76.61,90.08,90.03,93.94,83.86,37.52,23.59,78.45,3.29,20.30,56.52,42.87,9.41,75.18,11.31,6.79,1.97,20.08,50.49,49.44,13.86,54.28,87.32,39.13),(2019,'1500','Jambi',0.39,8.45,12.93,69.65,28.34,56.64,90.46,63.80,77.02,77.43,88.41,86.51,44.27,22.37,79.42,1.30,23.38,84.32,40.36,13.45,48.89,11.11,5.70,1.67,12.30,47.86,45.76,9.18,55.76,82.96,19.98),(2019,'1600','Sumatera Selatan',0.27,8.18,12.39,62.85,34.22,81.90,90.31,71.44,79.48,78.78,84.16,85.48,31.76,23.37,84.58,0.68,15.38,97.21,52.07,6.08,51.40,8.45,5.04,1.19,13.21,41.83,41.48,9.96,62.32,82.88,22.47),(2019,'1700','Bengkulu',0.28,8.73,13.59,75.16,30.67,87.36,93.16,81.75,89.26,90.15,93.39,82.18,34.78,18.57,89.61,28.71,6.29,93.64,47.23,22.78,73.03,12.61,6.46,1.74,8.76,43.85,43.67,13.80,65.58,85.30,21.62),(2019,'1800','Lampung',0.33,7.92,12.63,83.47,38.42,68.73,91.16,84.10,89.66,91.17,94.40,87.94,34.09,21.43,88.07,1.41,24.26,70.29,57.07,4.82,63.87,9.21,5.77,1.66,13.04,39.67,43.04,11.92,59.45,80.74,19.05),(2019,'1900','Kepulauan Bangka Belitung',0.33,7.98,11.94,85.80,30.12,75.31,88.93,80.01,87.23,91.20,92.06,80.54,25.71,27.65,82.16,5.10,17.22,95.89,53.73,14.54,47.32,6.29,4.55,1.22,19.50,46.14,49.49,13.79,56.51,83.59,7.44),(2019,'2100','Kepulauan Riau',0.27,9.99,12.83,80.09,37.60,96.48,95.47,91.93,89.11,99.25,97.07,78.40,46.16,15.78,70.82,26.29,15.56,39.79,47.03,12.04,53.45,13.55,6.33,1.43,17.86,55.64,70.32,13.55,53.46,94.61,39.13),(2019,'3100','DKI Jakarta',0.26,11.06,12.97,81.84,37.88,72.77,93.19,87.05,88.51,90.96,95.47,77.99,39.41,24.78,68.74,0.49,40.65,3.71,32.10,25.55,50.82,11.95,4.93,1.36,10.01,53.40,78.60,14.51,58.71,86.93,23.73),(2019,'3200','Jawa Barat',0.39,8.37,12.48,72.88,28.33,72.04,88.39,55.31,71.76,68.53,81.58,83.84,41.30,24.51,82.54,2.43,8.37,71.52,32.36,12.96,56.47,10.28,5.05,1.60,16.14,49.51,57.84,12.20,55.71,75.56,29.30),(2019,'3300','Jawa Tengah',0.44,7.53,12.68,89.58,26.16,69.80,90.60,81.55,86.02,88.35,90.22,91.68,52.81,18.79,89.33,11.54,6.24,96.58,43.12,13.87,68.12,16.09,8.75,2.09,24.51,41.24,50.18,13.02,67.12,77.38,32.36),(2019,'3400','Daerah Istimewa Yogyakarta',0.72,9.38,15.58,99.65,19.17,81.59,96.07,90.00,90.87,95.41,94.28,92.62,69.74,17.40,83.48,13.73,23.38,88.53,57.87,26.13,75.17,25.08,10.86,4.34,22.17,56.68,64.03,19.46,78.44,84.57,15.15),(2019,'3500','Jawa Timur',0.36,7.59,13.16,89.33,23.85,78.14,91.27,76.43,82.85,83.74,87.79,89.80,46.29,21.33,82.23,2.39,8.67,93.31,47.36,12.97,67.41,11.82,6.01,2.39,38.06,43.38,49.38,13.10,65.50,72.66,18.48),(2019,'3600','Banten',0.12,8.74,12.88,65.08,31.58,75.45,89.40,58.94,70.69,70.54,76.29,79.94,38.12,28.52,81.90,1.65,16.82,55.56,26.71,21.65,63.94,9.10,3.79,0.94,24.90,39.98,60.82,13.04,55.64,79.81,27.31),(2019,'5100','Bali',0.59,8.84,13.27,82.25,45.31,67.30,95.64,85.41,85.52,97.42,95.95,85.03,63.43,13.08,83.54,0.65,15.73,88.60,50.38,14.36,81.73,11.77,17.15,5.98,37.12,53.59,57.23,14.96,80.47,71.96,12.12),(2019,'5200','Nusa Tenggara Barat',0.83,7.27,13.48,66.11,34.98,74.58,93.43,58.79,77.87,69.66,86.87,91.30,51.85,24.27,91.14,1.04,6.21,92.03,40.12,11.87,75.88,13.30,10.34,2.26,26.04,42.46,41.99,20.29,68.78,69.62,9.16),(2019,'5300','Nusa Tenggara Timur',0.04,7.55,13.15,53.05,38.76,63.85,91.03,84.16,88.66,90.83,93.06,80.63,46.77,32.88,76.81,0.38,9.01,67.76,14.53,9.05,80.60,17.55,5.74,1.85,22.34,46.02,29.52,12.98,74.15,80.67,15.49),(2019,'6100','Kalimantan Barat',0.27,7.31,12.58,36.11,32.47,58.06,88.10,92.39,93.79,96.33,95.79,76.36,30.72,21.00,81.65,4.75,8.70,73.64,27.91,7.28,49.35,14.42,4.15,0.94,22.84,40.01,41.73,9.87,63.52,79.57,12.98),(2019,'6200','Kalimantan Tengah',0.34,8.51,12.57,77.20,35.57,67.32,89.45,92.19,94.65,96.37,96.79,79.75,28.54,25.13,84.67,0.81,3.30,89.26,35.02,11.29,55.44,10.83,4.39,1.51,18.13,50.21,49.99,11.54,60.11,83.44,43.90),(2019,'6300','Kalimantan Selatan',0.26,8.20,12.52,87.95,29.76,74.50,88.94,73.31,86.30,84.85,90.83,80.39,35.76,15.32,81.64,3.67,12.77,94.92,31.07,10.37,60.35,7.96,3.85,2.49,21.68,52.72,53.16,13.36,65.27,79.59,18.39),(2019,'6400','Kalimantan Timur',0.33,9.70,13.69,82.93,28.74,73.96,94.72,91.98,94.36,95.05,95.27,76.74,35.55,22.00,74.56,0.43,9.61,31.51,39.61,17.71,37.57,11.21,4.72,2.20,18.18,53.30,63.19,15.39,56.83,79.12,13.23),(2019,'6500','Kalimantan Utara',0.14,8.94,12.84,76.51,33.41,74.77,92.61,94.84,98.68,98.57,98.52,72.00,33.53,27.94,74.56,0.00,23.75,24.98,35.64,12.21,34.75,10.62,6.05,2.85,23.27,45.89,58.38,12.15,54.42,83.43,27.01),(2019,'7100','Sulawesi Utara',0.39,9.43,12.73,80.32,27.90,73.21,90.83,92.36,92.00,96.83,96.23,91.01,55.51,24.92,80.16,2.90,4.79,80.03,21.64,12.40,39.62,14.38,12.46,2.71,25.10,45.54,49.79,8.42,55.37,99.60,64.22),(2019,'7200','Sulawesi Tengah',0.31,8.75,13.14,78.23,27.33,68.35,89.37,85.32,93.01,92.58,94.96,80.90,45.75,28.84,84.00,1.10,5.56,41.11,20.18,2.59,41.50,10.80,6.60,1.03,20.45,39.04,38.51,11.61,59.75,85.36,26.85),(2019,'7300','Sulawesi Selatan',0.14,8.26,13.36,68.29,37.86,67.27,89.73,79.94,86.63,86.40,89.99,79.41,34.42,25.48,88.25,2.14,18.39,67.54,28.70,8.34,49.01,7.00,3.11,1.14,21.09,46.88,47.42,13.06,58.09,85.50,28.55),(2019,'7400','Sulawesi Tenggara',0.12,8.91,13.55,77.84,33.60,57.68,91.48,89.62,96.21,88.26,95.26,76.10,29.61,24.58,84.24,1.99,7.36,42.06,28.31,8.98,39.75,8.39,2.55,1.36,13.99,42.56,46.20,14.03,66.37,83.16,26.89),(2019,'7500','Gorontalo',0.01,7.69,13.06,91.19,23.95,42.67,88.04,79.72,91.87,82.03,91.66,83.85,31.22,35.53,78.19,0.39,8.70,83.41,25.67,14.40,64.81,10.42,4.05,1.55,25.07,36.32,45.11,14.85,59.13,110.84,45.14),(2019,'7600','Sulawesi Barat',0.05,7.73,12.62,66.37,26.04,64.95,89.51,80.08,90.26,89.87,92.71,77.35,32.80,13.13,89.41,0.00,15.32,73.12,23.01,3.89,37.39,9.81,8.76,0.85,21.54,40.72,34.89,10.98,61.23,84.06,27.10),(2019,'8100','Maluku',0.14,9.81,13.94,51.89,36.46,80.65,93.71,85.19,89.92,93.41,94.49,75.74,50.48,30.50,72.65,14.95,18.11,71.55,14.96,8.44,33.80,8.35,8.85,1.17,16.39,39.54,37.66,12.40,66.04,91.40,40.45),(2019,'8200','Maluku Utara',0.14,9.00,13.63,48.09,29.72,90.12,92.28,81.22,83.06,80.94,85.80,78.58,59.05,21.18,79.79,4.51,9.79,63.82,18.80,11.28,45.21,14.54,7.28,0.72,25.73,48.16,32.43,9.86,58.93,81.94,22.65),(2019,'9100','Papua Barat',0.33,7.44,12.72,50.44,33.27,91.14,92.75,93.93,96.03,96.54,96.63,69.41,35.84,35.87,76.09,0.00,4.23,17.04,22.55,5.76,49.07,16.31,8.60,1.69,22.92,47.13,47.41,9.41,65.39,83.54,8.29),(2019,'9400','Papua',0.27,6.65,11.05,34.79,31.93,68.99,73.31,84.91,85.83,90.48,92.61,76.40,46.84,21.97,67.41,7.07,4.17,55.72,19.53,4.98,52.76,14.66,7.91,4.49,11.96,38.31,23.95,4.16,77.56,69.50,16.02),(2020,'1100','Aceh',0.10,9.33,14.31,75.01,39.34,70.96,94.98,36.96,62.17,47.10,72.30,86.71,41.69,25.22,77.06,2.09,11.24,72.71,26.15,18.35,44.33,14.58,4.11,1.54,35.97,59.92,46.70,16.22,60.07,91.73,12.50),(2020,'1200','Sumatera Utara',0.12,9.54,13.23,66.00,32.33,59.35,94.00,77.16,87.04,87.19,91.66,79.33,24.19,27.15,79.45,3.10,6.72,38.24,44.05,10.21,43.90,9.55,8.38,2.29,12.98,52.48,51.79,10.57,68.97,90.51,14.94),(2020,'1300','Sumatera Barat',0.25,8.99,14.02,74.80,27.04,76.42,94.48,54.00,71.91,75.13,83.31,75.71,35.76,29.10,72.09,21.43,11.73,92.58,21.79,14.38,48.99,13.82,5.32,1.50,15.18,43.26,50.04,17.06,68.52,100.22,12.07),(2020,'1400','Riau',0.42,9.14,13.20,74.57,36.79,69.63,91.49,77.56,90.51,91.71,92.92,84.24,37.02,23.62,78.43,12.88,25.25,54.85,40.80,7.84,68.83,11.21,6.92,1.92,20.15,51.14,56.72,13.99,55.74,93.65,27.08),(2020,'1500','Jambi',0.29,8.55,12.98,69.99,22.34,64.67,91.43,65.25,77.29,77.98,87.53,86.20,43.66,22.39,79.40,1.30,22.69,81.94,34.81,11.32,45.40,11.20,5.42,1.42,12.27,48.92,51.00,9.29,58.90,85.54,17.02),(2020,'1600','Sumatera Selatan',0.21,8.24,12.45,63.56,28.02,65.88,91.11,72.49,79.95,79.39,83.33,85.91,31.32,23.40,84.56,0.80,16.11,94.47,49.12,5.29,49.28,8.34,4.88,1.09,13.26,42.13,49.01,10.08,65.59,85.99,25.00),(2020,'1700','Bengkulu',0.22,8.84,13.61,76.10,26.13,65.77,93.77,83.84,89.33,91.58,92.44,82.65,34.28,18.59,89.60,3.88,7.43,91.16,37.40,19.41,70.50,12.44,6.11,1.55,8.59,44.08,48.01,13.88,67.72,88.95,26.47),(2020,'1800','Lampung',0.26,8.05,12.65,83.98,34.54,67.34,90.40,85.24,91.55,92.43,93.46,88.45,33.62,21.45,88.06,1.41,25.24,68.28,49.93,3.97,57.97,9.75,5.45,1.58,13.15,40.89,49.56,12.02,63.38,84.15,23.19),(2020,'1900','Kepulauan Bangka Belitung',0.23,8.06,12.05,85.14,26.64,70.84,88.20,81.67,88.60,92.41,91.14,81.04,25.35,27.69,82.14,5.02,16.67,93.18,50.50,12.19,42.76,6.65,4.20,0.93,19.71,46.03,54.67,13.89,57.65,92.70,4.65),(2020,'2100','Kepulauan Riau',0.21,10.12,12.87,83.26,32.08,96.96,95.79,92.82,89.23,99.91,95.98,78.65,45.52,15.80,70.81,23.94,18.85,38.64,43.54,9.68,51.80,13.43,5.85,1.18,17.83,56.20,74.01,13.58,59.05,100.31,9.76),(2020,'3100','DKI Jakarta',0.19,11.13,12.98,82.91,34.42,93.93,94.00,89.91,90.21,90.93,94.81,78.04,39.24,24.65,68.89,0.46,41.29,3.59,35.30,20.57,45.43,12.52,4.87,0.90,9.98,54.07,82.00,14.58,58.98,84.30,27.71),(2020,'3200','Jawa Barat',0.31,8.55,12.50,73.64,26.07,77.25,88.91,56.73,73.07,69.56,81.01,84.30,41.14,24.54,82.52,3.25,10.06,69.13,28.80,10.09,50.88,10.24,4.84,1.34,16.17,49.44,63.51,12.27,57.13,80.01,25.00),(2020,'3300','Jawa Tengah',0.37,7.69,12.70,89.55,26.84,74.40,90.41,83.82,88.50,89.64,89.45,91.99,52.66,18.81,89.32,4.34,6.97,93.49,40.86,10.27,61.53,16.64,8.39,1.60,24.49,42.45,56.58,13.13,70.45,82.11,23.16),(2020,'3400','Daerah Istimewa Yogyakarta',0.65,9.55,15.59,99.03,18.25,93.74,96.36,90.68,90.92,96.23,92.87,92.31,68.69,17.42,83.46,15.72,26.94,85.59,45.75,17.46,68.61,24.57,9.99,3.34,22.08,56.21,70.12,19.55,82.26,89.10,22.22),(2020,'3500','Jawa Timur',0.31,7.78,13.19,89.79,21.79,81.36,91.01,77.90,84.07,84.67,87.04,90.24,46.94,21.35,82.21,3.29,9.44,90.64,42.96,10.12,65.58,11.88,5.76,1.80,38.09,43.75,55.48,13.20,66.80,80.67,21.21),(2020,'3600','Banten',0.01,8.89,12.89,62.80,26.71,76.49,89.20,60.34,71.77,71.49,75.63,80.13,37.96,28.56,81.88,3.54,18.10,53.96,23.32,15.67,57.79,9.55,3.75,0.75,24.96,40.20,62.96,13.10,57.06,80.02,21.43),(2020,'5100','Bali',0.43,8.95,13.33,81.32,41.82,76.10,94.90,87.35,87.14,98.50,95.05,86.66,73.10,13.09,83.82,0.61,17.44,87.51,46.25,12.40,70.72,12.98,16.30,2.82,37.19,54.84,63.83,15.09,84.04,76.48,19.57),(2020,'5200','Nusa Tenggara Barat',0.79,7.31,13.70,66.84,31.93,58.59,94.09,62.12,79.23,70.91,86.36,91.43,51.32,23.45,91.92,0.98,7.50,90.38,36.88,11.52,70.46,13.35,10.03,2.12,26.00,44.73,46.80,20.42,70.73,60.77,1.59),(2020,'5300','Nusa Tenggara Timur',0.01,7.63,13.18,53.98,31.32,43.49,91.41,85.18,89.36,91.74,92.31,80.86,46.29,32.92,76.80,0.39,9.26,65.50,11.91,9.26,75.30,18.08,5.62,1.53,22.55,47.02,35.31,13.15,77.34,74.18,25.00),(2020,'6100','Kalimantan Barat',0.24,7.37,12.60,36.81,24.53,55.39,88.30,93.60,94.39,97.04,94.56,77.34,30.69,21.02,81.63,4.43,8.38,71.30,26.12,7.03,45.40,17.17,4.01,0.72,22.77,39.62,48.05,9.99,64.62,83.18,16.07),(2020,'6200','Kalimantan Tengah',0.26,8.59,12.66,79.17,30.22,62.60,88.53,93.29,96.12,96.91,95.54,80.06,28.52,25.16,84.65,1.46,2.81,86.74,27.65,9.99,50.68,10.84,4.28,1.39,18.12,49.79,54.59,11.62,59.73,86.63,50.00),(2020,'6300','Kalimantan Selatan',0.16,8.29,12.68,89.45,25.50,79.42,89.85,75.65,87.06,87.07,89.62,80.21,35.66,15.35,81.64,3.82,12.13,91.77,26.36,8.35,56.28,7.62,3.57,2.35,21.68,52.69,57.95,13.45,66.94,82.45,22.22),(2020,'6400','Kalimantan Timur',0.25,9.77,13.72,80.93,24.20,60.84,95.32,94.06,95.13,95.58,94.03,77.15,35.13,22.02,74.55,0.37,9.16,30.59,32.32,15.01,35.01,11.00,4.38,1.98,18.31,54.07,69.42,15.50,58.83,76.61,22.22),(2020,'6500','Kalimantan Utara',0.06,9.00,12.93,75.59,25.99,69.94,91.54,96.18,98.84,99.12,97.15,72.30,33.13,27.98,74.55,0.00,21.62,24.25,31.65,9.18,32.27,10.41,5.62,2.62,23.68,46.06,64.57,12.24,57.44,87.46,16.67),(2020,'7100','Sulawesi Utara',0.32,9.49,12.85,80.57,20.46,65.36,90.42,93.02,91.99,97.65,95.08,92.08,56.19,24.95,80.14,3.27,5.03,78.03,18.02,10.02,36.67,14.23,11.66,2.48,25.17,45.63,54.81,8.54,56.73,97.72,36.36),(2020,'7200','Sulawesi Tengah',0.25,8.83,13.17,78.59,20.58,33.78,88.99,86.60,93.86,93.52,93.83,80.67,46.29,28.88,83.98,0.43,6.67,40.50,17.27,2.30,41.69,11.15,6.10,0.98,20.45,39.04,38.51,11.61,59.75,85.36,37.50),(2020,'7300','Sulawesi Selatan',0.09,8.38,13.45,67.68,34.71,65.72,89.83,82.80,87.93,88.33,88.87,79.56,34.68,25.51,88.24,2.25,18.75,66.53,25.25,7.83,47.56,7.23,2.88,0.99,21.10,47.88,52.91,13.18,60.46,87.07,34.92),(2020,'7400','Sulawesi Tenggara',0.06,9.04,13.65,78.01,29.64,73.87,92.54,92.13,96.98,89.13,93.92,78.40,29.22,24.61,84.22,1.98,7.74,41.42,25.71,8.48,38.38,8.80,2.49,1.19,14.07,42.51,52.67,14.16,66.85,81.55,23.53),(2020,'7500','Gorontalo',0.01,7.82,13.08,90.70,17.41,81.79,86.63,83.13,92.95,84.97,91.52,85.25,30.82,35.57,78.17,3.77,8.99,82.16,21.31,13.64,60.81,10.31,3.77,1.81,25.15,36.37,49.79,14.99,60.17,115.33,36.36),(2020,'7600','Sulawesi Barat',0.02,7.89,12.77,67.21,21.28,43.55,88.19,81.75,91.51,91.25,91.43,77.55,32.37,10.62,90.53,0.00,13.29,72.03,19.72,3.73,37.99,10.29,8.44,0.83,21.70,41.57,41.95,11.12,64.51,88.75,12.50),(2020,'8100','Maluku',0.07,9.93,13.96,53.17,28.28,70.91,93.38,86.04,90.68,93.95,93.10,75.95,49.83,30.50,72.68,14.99,17.83,69.83,13.05,7.93,30.73,8.46,8.16,1.13,16.24,39.43,43.42,12.55,69.97,93.57,30.30),(2020,'8200','Maluku Utara',0.07,9.04,13.67,49.41,21.58,82.71,91.64,82.45,83.72,81.44,84.78,78.83,58.31,20.97,79.95,4.58,18.42,65.82,18.97,11.34,45.01,14.81,6.77,0.75,25.98,48.23,39.22,10.03,57.28,80.67,36.36),(2020,'9100','Papua Barat',0.26,7.60,12.91,50.36,25.63,56.34,92.46,95.12,95.99,97.25,95.43,69.46,35.64,35.91,76.08,0.00,4.20,16.51,20.63,5.48,48.11,16.59,7.93,2.07,22.94,48.17,54.30,9.54,71.27,76.83,18.42),(2020,'9400','Papua',0.25,6.69,11.08,35.25,23.32,47.43,76.00,85.84,85.82,91.13,91.42,76.45,46.51,21.99,67.40,7.14,4.51,53.99,19.70,4.52,51.25,14.66,7.49,4.33,12.09,40.17,28.32,4.35,79.50,80.25,14.58),(2021,'1100','Aceh',0.12,9.37,14.36,74.38,33.51,75.69,94.81,16.56,53.91,38.73,72.40,86.28,46.30,21.87,63.81,2.35,10.64,76.94,63.95,10.89,47.48,18.97,2.03,0.84,20.73,57.04,52.68,8.68,60.91,89.58,12.50),(2021,'1200','Sumatera Utara',0.11,9.58,13.27,65.43,24.92,59.77,93.14,69.32,79.05,88.55,91.17,70.93,20.89,14.45,67.00,3.06,6.73,40.26,79.50,6.43,55.19,7.69,5.16,1.73,7.50,56.02,61.67,3.60,68.99,92.44,14.94),(2021,'1300','Sumatera Barat',0.19,9.07,14.09,73.99,25.57,72.25,94.41,28.44,58.00,60.47,84.01,77.04,33.16,22.12,68.15,20.17,13.61,96.19,73.79,7.48,48.83,10.90,4.23,1.09,11.24,53.76,60.91,8.76,68.23,102.80,12.07),(2021,'1400','Riau',0.26,9.19,13.28,74.01,31.43,74.25,92.45,60.36,77.32,84.19,91.18,75.54,32.90,13.75,66.54,8.83,26.05,53.25,79.31,5.90,59.69,11.33,2.96,1.12,9.31,55.96,65.63,3.00,57.38,92.77,27.45),(2021,'1500','Jambi',0.22,8.60,13.04,70.23,17.71,65.83,91.35,51.33,74.11,78.81,88.02,76.60,38.80,12.82,75.59,1.30,23.42,78.53,76.80,8.57,59.59,13.68,3.28,1.22,10.48,52.54,58.28,4.50,59.46,84.87,19.57),(2021,'1600','Sumatera Selatan',0.18,8.30,12.54,62.77,23.57,53.71,91.40,54.94,70.60,72.42,82.09,76.23,27.16,18.59,68.22,10.59,15.19,97.09,81.11,5.87,66.08,6.86,1.27,0.75,9.56,55.94,58.26,4.44,65.98,86.94,27.12),(2021,'1700','Bengkulu',0.25,8.87,13.67,76.55,19.51,78.86,93.47,60.21,80.62,83.94,91.03,73.98,29.86,8.60,82.75,4.27,8.72,91.41,76.07,11.05,71.05,10.57,3.63,1.14,8.12,48.74,56.76,5.81,66.38,89.89,18.92),(2021,'1800','Lampung',0.19,8.08,12.73,83.17,32.92,66.46,90.62,66.97,79.56,85.05,91.05,76.94,31.61,13.06,67.29,1.78,23.48,76.63,76.73,5.02,76.08,7.50,3.75,0.91,10.69,45.43,60.74,3.56,61.20,85.33,25.00),(2021,'1900','Kepulauan Bangka Belitung',0.18,8.08,12.17,84.45,20.73,48.12,89.35,64.00,74.86,86.55,89.08,66.44,11.83,11.00,85.04,6.46,22.73,94.60,63.01,6.28,60.75,4.85,2.85,0.76,7.86,49.64,61.97,5.85,56.00,89.49,9.76),(2021,'2100','Kepulauan Riau',0.15,10.18,12.98,83.42,24.62,68.05,95.47,90.31,86.91,96.16,96.84,54.24,26.56,18.47,74.20,20.10,23.46,26.60,58.85,3.75,39.68,8.17,7.84,0.68,6.70,57.32,84.16,4.86,61.86,97.96,9.76),(2021,'3100','DKI Jakarta',0.16,11.17,13.07,82.01,32.39,74.02,91.76,79.96,84.66,93.37,95.52,47.50,14.74,24.06,66.81,0.80,40.23,6.72,70.25,8.42,71.38,4.22,4.10,0.92,5.51,64.94,87.34,2.14,60.45,86.51,27.71),(2021,'3200','Jawa Barat',0.24,8.61,12.61,73.02,24.10,61.01,88.20,39.62,60.93,68.78,82.02,75.39,36.29,27.01,66.48,4.16,12.06,72.50,72.28,7.53,90.05,9.71,3.02,0.99,11.49,51.68,69.72,3.49,58.62,80.80,27.66),(2021,'3300','Jawa Tengah',0.26,7.75,12.77,89.11,26.94,65.26,90.41,59.02,61.97,81.02,83.24,80.28,42.16,8.04,87.36,4.67,13.22,96.43,68.21,5.11,79.09,10.47,7.33,1.32,21.92,45.27,62.58,2.93,70.27,83.14,21.43),(2021,'3400','Daerah Istimewa Yogyakarta',0.57,9.64,15.64,99.01,19.59,94.45,95.90,80.30,73.55,94.26,91.47,74.20,46.13,15.25,82.57,14.05,28.45,91.81,55.86,4.74,86.44,13.84,9.60,2.57,15.09,47.29,73.76,3.56,77.98,90.85,25.00),(2021,'3500','Jawa Timur',0.20,7.88,13.36,90.03,20.01,70.70,91.73,53.86,58.99,74.27,77.39,80.57,35.23,13.54,79.14,3.78,11.19,95.66,71.52,6.49,76.16,9.60,5.14,1.26,27.82,48.47,59.78,3.21,66.43,80.80,21.21),(2021,'3600','Banten',0.12,8.93,13.02,62.90,19.61,66.34,89.98,34.28,49.34,60.65,72.30,71.03,39.31,27.86,58.60,3.51,16.03,54.01,64.71,13.53,77.13,9.57,1.07,0.63,18.87,50.75,69.79,3.78,58.43,79.05,21.43),(2021,'5100','Bali',0.29,9.06,13.40,81.47,35.89,46.33,94.71,75.50,73.75,94.87,94.34,73.92,28.00,7.63,88.86,1.25,21.84,84.49,81.17,9.01,81.81,7.68,16.15,3.33,26.12,81.46,68.75,2.02,85.11,76.33,19.57),(2021,'5200','Nusa Tenggara Barat',0.48,7.38,13.90,67.06,28.62,79.08,93.51,32.48,58.52,65.37,78.88,87.42,52.42,19.17,78.10,1.07,5.88,92.33,77.94,5.81,75.01,14.96,5.73,1.28,13.04,45.04,54.00,8.70,71.66,71.29,1.59),(2021,'5300','Nusa Tenggara Timur',0.02,7.69,13.20,54.02,22.54,35.19,91.33,86.33,86.30,97.34,96.27,77.02,37.91,22.59,70.38,0.52,8.36,63.89,50.57,9.00,73.19,15.91,4.45,1.26,12.94,48.52,46.16,4.59,79.17,87.06,25.00),(2021,'6100','Kalimantan Barat',0.12,7.45,12.65,35.97,15.42,38.94,88.97,83.26,86.19,97.78,97.35,69.87,32.57,14.40,70.52,7.84,8.89,82.69,66.59,7.11,58.43,12.01,2.54,0.70,15.39,51.63,57.03,2.97,64.33,82.39,20.37),(2021,'6200','Kalimantan Tengah',0.20,8.64,12.74,78.67,22.84,62.60,90.59,86.78,89.85,95.52,96.83,73.62,25.87,17.92,72.91,30.63,2.60,87.70,68.58,9.05,64.60,9.53,4.05,1.30,12.47,46.80,62.17,4.14,60.35,86.55,50.00),(2021,'6300','Kalimantan Selatan',0.19,8.34,12.81,89.76,20.73,62.80,89.45,46.94,77.73,72.67,87.25,73.52,32.29,9.83,81.92,4.39,11.82,94.63,77.30,3.69,76.42,9.31,2.56,1.45,14.17,47.63,66.23,2.83,65.49,84.88,22.22),(2021,'6400','Kalimantan Timur',0.30,9.84,13.81,81.23,18.07,75.67,93.82,84.99,94.17,93.57,97.79,58.76,26.44,23.25,70.48,0.51,9.21,34.57,72.32,4.87,78.01,8.97,4.08,1.44,11.92,56.62,75.76,2.57,59.25,83.38,25.00),(2021,'6500','Kalimantan Utara',0.10,9.11,12.94,74.82,17.13,90.88,92.03,90.57,93.55,94.28,95.27,50.61,24.47,17.49,71.88,0.38,18.94,21.57,64.43,17.05,56.69,8.28,3.40,1.94,8.17,45.04,71.59,2.45,59.25,83.91,12.90),(2021,'7100','Sulawesi Utara',0.21,9.62,12.94,80.83,14.38,59.02,90.46,84.21,77.02,95.63,91.79,83.60,49.58,16.73,78.09,3.08,6.39,42.58,63.23,5.25,28.70,11.47,12.52,1.59,8.04,42.91,61.52,2.59,56.62,99.84,41.94),(2021,'7200','Sulawesi Tengah',0.14,8.89,13.23,78.80,15.12,50.59,88.98,71.46,74.99,90.12,91.50,73.02,41.78,22.48,65.04,2.00,9.83,45.83,65.82,6.11,49.80,12.30,6.92,0.62,12.84,53.37,52.87,3.71,61.54,89.32,37.50),(2021,'7300','Sulawesi Selatan',0.10,8.46,13.52,67.90,30.75,80.61,89.27,60.25,74.46,78.88,86.41,72.50,34.77,14.00,79.05,2.25,20.60,69.78,72.98,5.71,54.84,7.44,3.86,0.65,12.77,51.76,61.00,4.71,60.99,86.99,37.10),(2021,'7400','Sulawesi Tenggara',0.07,9.13,13.68,78.16,24.23,32.82,91.66,65.67,82.28,81.09,90.94,62.45,29.30,12.16,79.28,2.37,14.29,45.95,68.13,5.28,59.51,10.52,2.51,0.86,12.92,55.18,60.14,7.47,66.92,83.94,25.00),(2021,'7500','Gorontalo',0.00,7.90,13.11,89.95,11.20,50.19,86.95,51.26,58.62,68.05,71.40,84.47,37.63,20.90,74.31,4.76,11.59,33.41,72.68,10.30,64.12,12.24,3.50,0.74,13.31,63.27,56.90,6.57,61.78,110.88,36.36),(2021,'7600','Sulawesi Barat',0.07,7.96,12.86,67.55,16.45,48.69,90.02,63.25,79.58,83.61,88.89,71.55,28.17,11.01,79.12,1.03,12.18,72.56,59.35,3.46,42.96,9.86,4.99,0.79,8.28,48.28,51.19,3.41,63.16,86.26,12.50),(2021,'8100','Maluku',0.15,10.03,13.97,53.35,20.63,56.80,93.68,80.15,81.29,94.54,95.62,80.33,47.48,14.08,78.76,14.31,17.16,72.46,65.79,7.52,55.88,16.46,12.75,1.25,9.68,42.67,52.75,5.10,69.16,95.97,29.41),(2021,'8200','Maluku Utara',0.08,9.09,13.68,49.65,15.55,67.05,92.14,66.27,79.27,82.95,87.76,73.24,46.65,9.26,81.87,4.99,19.14,61.19,67.67,6.23,54.54,14.15,7.10,0.62,12.11,47.18,45.77,5.88,58.57,81.86,40.63),(2021,'9100','Papua Barat',0.19,7.69,13.13,49.97,15.61,80.97,92.40,87.55,88.10,98.04,96.93,66.67,36.41,22.95,70.00,0.00,4.17,30.65,48.37,5.58,42.26,15.08,7.25,1.79,9.90,42.39,57.65,3.47,72.99,81.16,16.67),(2021,'9400','Papua',0.19,6.76,11.11,35.65,14.29,23.89,73.14,72.01,70.08,88.55,82.51,76.71,50.98,23.18,76.41,7.22,4.62,64.35,31.20,3.13,52.75,19.40,2.26,3.48,4.50,30.61,28.47,1.21,79.97,72.04,14.58),(2022,'1100','Aceh',0.12,9.44,14.37,73.81,41.19,82.16,95.13,18.29,57.27,42.46,74.18,87.66,45.16,17.71,67.49,2.07,14.07,76.55,64.53,11.12,57.89,20.18,2.26,1.06,29.10,58.60,56.70,9.84,56.93,89.92,12.50),(2022,'1200','Sumatera Utara',0.16,9.71,13.31,63.51,36.05,72.15,92.97,71.92,81.22,89.75,91.85,70.89,21.66,9.31,68.13,4.67,6.84,40.65,80.58,9.14,62.83,8.76,5.72,1.84,7.53,58.85,68.30,3.81,66.00,91.65,25.00),(2022,'1300','Sumatera Barat',0.35,9.18,14.10,71.65,34.24,57.91,94.50,30.85,60.71,62.50,84.22,78.80,33.44,13.09,71.44,22.03,15.35,97.14,73.23,9.74,60.31,12.01,4.87,1.23,14.81,54.55,65.43,8.48,68.15,107.07,12.07),(2022,'1400','Riau',0.39,9.22,13.29,73.18,39.26,68.92,92.66,65.01,82.92,87.05,92.30,75.80,33.33,6.96,68.55,12.69,29.49,54.14,79.65,6.85,66.03,12.68,3.29,1.39,10.34,58.69,71.85,4.35,51.78,94.51,27.45),(2022,'1500','Jambi',0.26,8.68,13.05,70.50,28.03,39.31,91.22,55.30,80.04,81.51,89.98,77.18,39.36,6.76,75.11,1.28,25.45,78.36,77.39,9.50,67.07,13.71,3.80,1.32,8.17,56.20,66.11,4.39,56.83,87.05,17.02),(2022,'1600','Sumatera Selatan',0.15,8.37,12.55,62.70,33.09,58.31,90.88,57.67,73.45,73.43,84.69,76.74,27.24,13.53,66.55,10.76,15.33,97.58,80.49,7.87,73.70,7.94,1.37,0.52,11.30,59.02,63.89,4.76,62.77,92.20,27.12),(2022,'1700','Bengkulu',0.31,8.91,13.68,75.93,30.95,73.79,92.74,66.11,84.54,87.14,92.99,73.11,29.45,4.99,82.83,4.20,9.09,92.52,78.51,10.60,78.02,11.68,4.18,1.22,8.27,52.46,65.01,5.34,64.16,90.86,18.42),(2022,'1800','Lampung',0.19,8.18,12.74,82.68,39.44,78.21,91.76,67.89,80.88,85.24,91.46,77.72,31.06,7.93,68.22,1.58,24.03,75.30,76.70,6.19,80.11,8.47,4.28,0.87,17.83,47.79,66.10,3.97,62.37,87.28,23.19),(2022,'1900','Kepulauan Bangka Belitung',0.23,8.11,12.18,81.73,29.86,65.46,88.93,64.79,76.68,87.95,91.53,68.40,13.51,5.22,78.89,6.22,22.75,95.81,64.58,8.83,66.61,5.22,2.58,0.95,7.03,52.59,70.23,5.83,55.28,88.53,9.76),(2022,'2100','Kepulauan Riau',0.21,10.37,12.99,80.48,36.58,85.24,95.01,87.55,85.94,94.79,96.37,59.69,29.39,11.83,85.27,23.71,23.53,30.53,56.00,8.07,48.58,8.99,8.37,0.89,14.18,56.26,85.87,3.45,58.63,96.16,9.76),(2022,'3100','DKI Jakarta',0.12,11.31,13.08,83.68,36.15,81.18,91.24,80.93,85.50,93.33,95.82,51.58,16.78,14.72,71.79,0.87,41.48,7.15,68.97,10.66,75.69,4.86,5.85,1.13,6.82,67.32,87.61,2.44,58.26,88.76,27.71),(2022,'3200','Jawa Barat',0.28,8.78,12.62,72.57,27.97,76.45,88.73,40.53,62.39,71.51,82.65,76.61,37.04,18.07,65.30,6.15,14.71,73.28,72.97,8.14,92.74,11.80,3.07,0.83,12.16,52.13,73.02,3.61,57.20,85.74,29.35),(2022,'3300','Jawa Tengah',0.44,7.93,12.81,88.96,30.75,69.39,90.65,60.45,65.12,82.62,84.06,80.90,43.10,5.27,86.47,5.42,15.01,96.61,69.73,5.52,83.80,11.79,8.23,1.61,28.29,47.18,68.25,3.10,69.63,84.33,22.68),(2022,'3400','Daerah Istimewa Yogyakarta',0.67,9.75,15.65,99.81,21.90,88.40,96.46,80.98,76.87,94.20,90.75,73.68,46.71,11.59,83.19,16.09,30.88,91.77,54.57,4.78,88.38,16.23,10.13,1.91,21.70,46.90,75.32,4.39,77.09,90.05,25.00),(2022,'3500','Jawa Timur',0.30,8.03,13.37,91.38,24.20,79.20,90.52,55.53,61.98,76.10,78.66,80.54,35.50,8.53,77.62,6.05,12.41,95.14,74.11,7.23,81.02,11.75,6.00,1.71,32.02,51.30,65.05,3.57,66.79,84.77,23.71),(2022,'3600','Banten',0.19,9.13,13.05,63.92,27.30,74.03,89.20,36.48,53.67,67.18,76.36,71.48,37.85,23.64,59.58,9.53,18.80,55.40,64.58,14.17,81.21,12.10,1.19,0.66,20.36,53.04,73.56,3.68,57.74,84.72,21.74),(2022,'5100','Bali',0.43,9.39,13.48,81.28,45.27,54.35,95.16,72.61,74.50,92.92,92.99,76.08,30.13,5.36,91.72,1.14,22.38,87.61,80.13,19.09,82.72,8.76,17.92,3.42,31.80,82.74,71.71,1.72,82.82,80.68,19.57),(2022,'5200','Nusa Tenggara Barat',0.43,7.61,13.96,66.02,35.25,64.75,93.39,35.28,62.17,67.98,82.96,86.08,51.56,10.31,84.69,1.07,4.21,91.59,79.84,7.03,76.85,17.25,6.46,1.38,18.00,48.23,60.10,9.79,71.05,80.70,1.59),(2022,'5300','Nusa Tenggara Timur',0.05,7.70,13.21,53.22,35.71,44.70,91.07,87.44,88.23,97.48,95.86,77.70,38.48,14.34,80.33,0.52,7.24,64.56,52.18,7.33,73.39,17.91,4.82,0.86,15.04,50.71,50.20,4.06,81.92,91.33,25.00),(2022,'6100','Kalimantan Barat',0.09,7.59,12.66,37.31,32.16,48.08,88.94,80.78,89.09,98.27,97.89,70.33,34.03,11.00,74.76,17.84,9.80,83.00,69.35,9.08,62.24,15.24,2.70,0.83,21.76,54.54,64.43,3.45,61.77,88.46,22.64),(2022,'6200','Kalimantan Tengah',0.17,8.65,12.75,77.14,35.53,67.42,89.81,88.91,91.67,96.18,96.99,73.51,24.89,8.78,74.38,33.45,3.35,87.94,71.32,10.54,65.42,12.37,4.23,1.72,13.61,51.77,68.54,4.25,55.98,87.72,50.00),(2022,'6300','Kalimantan Selatan',0.49,8.46,12.82,88.13,30.33,67.10,90.20,49.98,81.96,72.57,88.97,74.38,32.11,5.34,88.08,4.39,12.96,94.70,77.97,7.22,74.98,10.08,2.67,2.25,17.92,51.19,71.42,2.73,62.55,84.49,25.58),(2022,'6400','Kalimantan Timur',0.15,9.92,13.84,77.54,30.45,76.94,94.14,86.71,93.86,95.82,98.01,59.38,24.33,19.21,75.52,1.27,11.44,35.27,73.96,13.10,80.63,11.89,3.76,1.47,15.60,61.02,82.38,2.69,54.59,90.37,25.00),(2022,'6500','Kalimantan Utara',0.19,9.27,13.06,73.83,32.58,68.35,91.42,94.56,96.98,94.79,94.58,53.71,24.05,9.01,77.76,0.57,21.01,20.07,64.81,29.12,56.46,9.13,2.60,3.25,15.57,48.90,79.49,1.91,58.92,87.76,12.90),(2022,'7100','Sulawesi Utara',0.47,9.68,12.95,79.80,24.91,77.07,90.25,84.33,79.02,95.70,92.86,85.29,49.94,10.07,72.15,3.06,6.59,43.25,63.29,6.32,34.13,12.69,12.06,1.76,13.34,43.53,63.94,2.85,55.45,101.23,35.48),(2022,'7200','Sulawesi Tengah',0.03,8.89,13.32,78.06,25.10,74.69,88.58,73.60,74.98,91.39,92.06,71.30,40.26,17.24,62.95,1.91,9.80,43.78,66.71,6.05,56.85,12.92,6.43,0.40,20.57,54.20,57.62,4.22,62.58,94.26,40.63),(2022,'7300','Sulawesi Selatan',0.07,8.63,13.53,67.52,37.99,62.72,89.11,61.83,77.50,83.71,88.60,71.60,34.11,9.00,77.39,2.52,21.12,68.43,74.44,5.89,62.64,8.39,4.14,0.95,17.65,54.44,66.13,4.65,60.86,92.43,37.10),(2022,'7400','Sulawesi Tenggara',0.11,9.25,13.69,78.05,36.58,50.24,92.19,68.74,86.80,85.95,92.75,63.05,30.00,7.81,82.08,3.41,16.07,45.58,68.90,5.34,66.04,12.91,2.41,1.44,20.43,55.87,65.28,7.98,66.26,90.46,25.00),(2022,'7500','Gorontalo',0.02,8.02,13.12,90.29,21.90,50.39,87.01,48.96,56.47,64.93,70.19,82.94,38.28,11.90,75.28,6.19,12.75,30.80,75.46,9.49,73.24,13.64,2.99,0.68,21.91,64.64,61.69,6.43,61.71,111.73,36.36),(2022,'7600','Sulawesi Barat',0.21,8.08,12.87,67.01,25.27,34.78,89.48,66.82,81.28,85.60,90.40,71.51,29.51,9.36,77.58,1.03,11.88,72.66,61.37,3.48,52.34,13.10,6.41,1.25,12.44,51.33,58.32,2.69,66.38,86.12,12.82),(2022,'8100','Maluku',0.04,10.19,14.00,54.57,31.15,68.08,93.03,80.02,80.01,94.10,95.94,80.42,53.01,8.80,79.69,14.61,19.40,74.10,66.24,5.95,59.78,19.15,12.65,1.81,12.36,45.32,58.38,5.55,66.99,94.60,28.57),(2022,'8200','Maluku Utara',0.11,9.24,13.73,50.15,23.41,73.14,92.12,67.24,76.52,81.81,89.27,75.22,46.55,6.85,84.08,3.86,18.04,56.23,71.48,5.10,58.63,17.29,9.00,1.88,15.00,52.03,53.30,7.15,56.96,89.07,40.63),(2022,'9100','Papua Barat',0.03,7.84,13.21,50.62,32.08,77.16,93.27,84.80,86.58,97.35,95.65,68.17,35.27,14.57,69.15,0.00,4.46,32.32,44.52,4.18,45.84,15.85,6.45,2.33,8.72,43.75,61.29,3.95,67.54,86.70,16.67),(2022,'9400','Papua',0.16,7.02,11.14,36.29,26.06,44.41,76.07,68.12,67.26,91.94,81.02,77.52,51.98,21.19,71.00,7.22,6.47,65.33,29.30,2.16,62.25,23.12,2.05,3.81,10.71,35.23,27.89,1.06,80.82,79.40,14.58),(2023,'1100','Aceh',0.14,9.55,14.38,76.08,43.10,83.15,94.21,21.42,60.90,45.23,78.37,87.59,46.28,15.01,66.87,4.30,16.79,74.83,68.21,11.80,62.72,20.31,2.31,1.05,27.39,62.75,62.30,10.39,60.88,91.69,12.50),(2023,'1200','Sumatera Utara',0.19,9.82,13.48,67.01,38.35,71.58,93.34,75.20,83.51,91.17,93.44,71.64,22.35,8.37,68.27,3.20,7.04,39.75,82.38,9.79,67.26,9.13,6.89,2.04,9.05,62.75,72.50,3.67,68.50,92.69,16.28),(2023,'1300','Sumatera Barat',0.25,9.28,14.11,76.59,36.78,57.19,94.93,33.57,64.09,65.71,86.87,78.34,34.94,14.13,70.92,37.19,19.71,96.78,76.95,10.59,62.27,13.50,5.04,1.26,13.94,58.21,70.78,10.48,69.26,106.49,12.07),(2023,'1400','Riau',0.31,9.32,13.30,75.79,42.02,69.24,93.72,69.41,86.01,88.82,93.68,75.61,32.45,6.93,70.24,11.51,30.41,53.68,82.35,7.07,70.97,12.84,3.63,1.30,11.96,62.44,75.46,3.10,52.85,94.59,32.65),(2023,'1500','Jambi',0.42,8.81,13.13,70.71,28.33,69.15,90.45,60.37,83.97,83.66,92.16,77.99,42.22,6.24,72.83,1.26,25.33,77.96,78.26,10.58,72.70,16.45,5.15,1.58,10.14,59.14,69.63,4.98,60.61,86.85,19.57),(2023,'1600','Sumatera Selatan',0.25,8.50,12.63,64.12,35.79,57.30,90.76,62.02,77.87,76.48,86.32,76.28,28.68,12.67,64.15,33.86,17.07,97.22,82.14,7.95,75.71,8.37,1.39,0.56,11.94,62.69,68.13,5.32,65.04,91.91,31.58),(2023,'1700','Bengkulu',0.50,9.03,13.74,77.72,35.22,90.54,93.02,69.13,87.08,87.39,94.22,75.02,32.05,4.75,79.82,4.77,8.77,92.32,79.10,11.23,80.30,13.51,5.45,1.15,9.95,54.82,67.83,6.90,66.15,90.05,18.42),(2023,'1800','Lampung',0.28,8.29,12.77,85.03,40.09,57.87,90.46,74.23,86.85,87.17,92.75,77.79,31.85,9.22,65.53,7.89,27.47,73.78,79.59,6.81,80.83,9.28,5.03,1.14,14.52,52.32,71.49,4.10,59.58,88.86,23.19),(2023,'1900','Kepulauan Bangka Belitung',0.34,8.25,12.31,85.45,33.72,62.76,90.11,67.48,80.38,89.56,93.27,70.29,12.55,5.03,80.34,15.61,24.64,95.31,66.83,8.88,71.68,6.31,3.21,1.09,9.15,56.07,72.92,7.27,58.92,91.24,9.76),(2023,'2100','Kepulauan Riau',0.20,10.41,13.05,82.57,39.48,86.64,95.93,87.73,85.91,93.90,95.28,60.61,30.68,7.56,87.26,46.13,25.00,29.18,56.03,8.55,52.70,10.71,9.35,0.90,9.23,57.29,88.74,6.26,61.18,103.71,9.76),(2023,'3100','DKI Jakarta',0.15,11.45,13.33,83.93,35.86,68.43,92.75,81.98,85.44,93.80,96.32,52.18,17.21,13.15,73.66,2.85,42.37,7.17,69.16,13.17,76.69,5.38,6.53,1.28,7.31,69.97,89.16,2.94,62.45,90.13,26.19),(2023,'3200','Jawa Barat',0.28,8.83,12.68,74.84,28.73,74.82,89.53,42.07,62.36,73.21,84.25,76.71,37.47,17.72,67.46,12.40,16.55,73.29,73.84,9.23,93.14,13.49,3.70,0.92,12.94,54.51,74.31,5.11,56.69,85.50,29.35),(2023,'3300','Jawa Tengah',0.45,8.01,12.85,90.08,29.91,68.28,91.37,66.35,67.29,85.62,87.40,80.50,43.35,6.19,86.72,6.03,15.76,96.61,70.63,6.13,83.15,13.61,9.42,1.78,30.41,50.71,70.43,3.65,69.71,83.85,25.26),(2023,'3400','Daerah Istimewa Yogyakarta',0.59,9.83,15.66,99.82,22.54,81.20,96.94,83.95,77.24,95.99,92.67,74.04,48.18,11.64,81.46,25.24,32.29,91.78,58.75,6.45,87.98,16.74,12.09,2.50,22.74,50.53,79.11,4.07,77.30,91.37,27.91),(2023,'3500','Jawa Timur',0.34,8.11,13.38,91.61,24.46,79.88,91.93,61.04,65.69,78.43,80.82,80.90,35.69,8.81,79.12,7.06,14.12,95.05,75.07,8.78,81.56,13.98,7.30,2.09,34.10,54.42,66.89,3.46,69.22,84.54,25.00),(2023,'3600','Banten',0.24,9.15,13.09,64.52,28.43,73.65,90.42,39.16,54.04,68.32,78.10,72.02,37.43,23.73,62.64,4.18,20.15,54.20,64.58,15.17,83.38,12.42,1.50,0.68,23.73,54.35,74.63,4.06,56.18,86.50,21.43),(2023,'5100','Bali',0.68,9.45,13.58,82.12,45.52,74.46,94.82,75.83,75.13,93.46,93.97,76.55,32.69,5.87,92.30,2.91,25.28,88.44,81.99,22.76,84.84,9.18,19.75,4.40,31.94,86.28,74.34,2.25,84.54,80.27,19.57),(2023,'5200','Nusa Tenggara Barat',0.42,7.74,13.97,67.88,38.31,62.16,93.10,35.62,60.62,71.26,84.17,87.09,51.99,12.15,85.30,1.78,5.06,90.73,80.76,8.03,74.37,15.83,7.66,1.47,21.11,51.79,63.28,8.79,74.29,80.83,1.61),(2023,'5300','Nusa Tenggara Timur',0.04,7.82,13.22,54.59,38.68,63.77,91.39,89.20,90.70,98.34,96.44,79.06,39.78,14.22,81.92,1.01,7.68,63.50,55.37,9.22,74.78,17.80,4.87,1.42,16.42,54.14,53.70,5.36,82.52,90.85,25.00),(2023,'6100','Kalimantan Barat',0.22,7.71,12.67,37.87,33.31,39.26,89.25,83.99,89.30,98.60,97.65,71.50,34.31,10.96,77.24,11.55,10.90,82.96,70.67,10.62,67.49,15.27,3.41,1.35,24.54,57.81,68.40,3.97,62.59,89.93,22.64),(2023,'6200','Kalimantan Tengah',0.13,8.73,12.76,80.79,36.73,62.60,90.13,92.43,94.68,97.12,97.74,75.16,25.64,7.55,79.97,85.37,3.72,87.63,73.66,12.41,71.50,12.06,5.21,1.84,15.96,53.85,73.33,5.60,56.72,89.70,40.63),(2023,'6300','Kalimantan Selatan',0.33,8.55,12.86,91.10,30.76,48.86,90.33,51.99,82.78,76.36,91.51,75.43,32.54,4.70,89.53,15.00,13.62,94.78,78.43,7.72,80.10,9.90,2.94,2.36,22.32,53.35,73.35,3.44,62.85,83.32,27.91),(2023,'6400','Kalimantan Timur',0.25,9.99,14.02,80.42,31.29,70.20,94.30,89.43,95.14,96.57,98.64,62.49,25.66,18.67,78.07,0.81,13.73,34.79,73.29,15.52,82.87,12.01,4.86,2.32,17.53,64.35,82.99,3.03,56.58,89.92,27.91),(2023,'6500','Kalimantan Utara',0.09,9.34,13.20,75.30,32.21,93.98,93.88,94.61,97.33,94.86,95.85,56.01,26.11,8.24,81.96,1.36,21.74,20.27,66.01,29.51,61.95,9.68,3.28,3.13,16.36,51.56,79.31,4.09,62.93,89.52,9.38),(2023,'7100','Sulawesi Utara',0.39,9.77,12.96,81.35,27.88,47.25,90.70,87.69,77.86,96.10,94.17,85.95,51.84,9.18,73.04,9.04,6.87,42.64,65.86,7.32,37.75,13.07,14.24,1.68,14.50,45.12,66.75,2.91,57.49,103.42,45.16),(2023,'7200','Sulawesi Tengah',0.02,8.96,13.33,78.93,27.54,76.58,89.36,80.22,79.44,92.59,92.59,74.22,41.50,16.45,62.10,5.15,11.37,44.14,67.55,6.38,61.38,12.48,7.83,0.37,22.71,56.35,60.48,3.82,62.51,94.53,36.36),(2023,'7300','Sulawesi Selatan',0.17,8.76,13.54,67.80,40.36,62.96,90.02,66.17,81.40,84.38,90.09,74.28,34.91,8.07,78.26,4.29,22.11,68.04,75.45,6.71,66.88,9.11,5.02,0.64,20.39,55.86,68.67,4.86,60.35,93.00,37.10),(2023,'7400','Sulawesi Tenggara',0.18,9.31,13.70,78.47,41.13,48.79,91.50,74.44,88.38,86.16,93.14,65.12,29.62,7.82,82.78,7.50,16.67,44.39,71.06,4.66,70.46,12.38,2.66,1.22,24.01,57.73,68.74,8.50,66.12,89.15,25.00),(2023,'7500','Gorontalo',0.09,8.10,13.16,91.17,23.04,37.60,87.31,51.98,57.07,66.34,71.79,84.84,39.36,10.68,74.35,16.67,14.20,30.58,75.87,11.54,77.64,15.16,3.29,0.74,24.56,66.59,64.44,6.73,65.70,106.94,36.36),(2023,'7600','Sulawesi Barat',0.10,8.13,12.88,68.51,28.64,38.97,90.45,71.41,81.46,87.86,91.64,74.11,30.29,9.47,78.47,4.17,13.75,72.13,64.15,3.57,56.45,12.30,7.26,1.34,14.23,52.41,62.08,4.73,64.21,87.33,12.50),(2023,'8100','Maluku',0.12,10.20,14.08,55.36,31.90,58.09,93.62,81.92,80.16,95.09,96.62,80.83,54.93,8.11,82.58,41.67,19.40,73.32,69.37,5.93,62.10,16.44,13.12,1.74,12.57,44.63,61.63,6.69,70.86,95.87,32.35),(2023,'8200','Maluku Utara',0.19,9.26,13.74,50.63,24.34,68.87,91.43,72.90,76.86,81.28,91.43,75.28,46.45,5.92,83.39,17.78,29.38,55.87,72.80,4.58,59.34,15.79,8.88,1.37,19.45,54.19,56.53,6.01,63.90,87.99,40.63),(2023,'9100','Papua Barat',0.11,7.93,13.34,50.72,34.06,79.26,92.58,86.16,85.61,97.69,97.03,69.58,36.05,15.34,69.76,0.00,5.36,31.19,46.07,3.38,48.12,14.52,6.43,2.09,9.41,44.29,64.16,3.57,67.95,88.45,16.67),(2023,'9400','Papua',0.26,7.15,11.15,36.42,27.61,43.59,75.85,72.25,70.15,92.27,81.86,78.57,51.10,23.30,68.52,41.18,6.47,63.91,33.22,2.77,56.34,20.35,2.89,3.48,10.66,36.36,31.53,1.54,76.49,83.20,14.58);
/*!40000 ALTER TABLE `skor_indikator_provinsi_2018_2023` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skor_indikator_provinsi_2024`
--

DROP TABLE IF EXISTS `skor_indikator_provinsi_2024`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skor_indikator_provinsi_2024` (
  `tahun` year(4) NOT NULL,
  `kode_bps` varchar(10) NOT NULL,
  `nama_provinsi` varchar(100) NOT NULL,
  `x1_1` decimal(5,2) DEFAULT NULL,
  `x1_2` decimal(5,2) DEFAULT NULL,
  `x2_1` decimal(5,2) DEFAULT NULL,
  `x2_2` decimal(5,2) DEFAULT NULL,
  `x2_3` decimal(5,2) DEFAULT NULL,
  `x3_1` decimal(5,2) DEFAULT NULL,
  `x3_2` decimal(5,2) DEFAULT NULL,
  `x3_3` decimal(5,2) DEFAULT NULL,
  `x4_1` decimal(5,2) DEFAULT NULL,
  `x4_2` decimal(5,2) DEFAULT NULL,
  `x4_3` decimal(5,2) DEFAULT NULL,
  `x4_4` decimal(5,2) DEFAULT NULL,
  `x4_5` decimal(5,2) DEFAULT NULL,
  `x4_6` decimal(5,2) DEFAULT NULL,
  `x5_1` decimal(5,2) DEFAULT NULL,
  `x5_2` decimal(5,2) DEFAULT NULL,
  `x5_3` decimal(5,2) DEFAULT NULL,
  `x5_4` decimal(5,2) DEFAULT NULL,
  `x6_1` decimal(5,2) DEFAULT NULL,
  `x6_2` decimal(5,2) DEFAULT NULL,
  `x6_3` decimal(5,2) DEFAULT NULL,
  `x7_1` decimal(5,2) DEFAULT NULL,
  `x7_2` decimal(5,2) DEFAULT NULL,
  `x7_3` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`tahun`,`kode_bps`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skor_indikator_provinsi_2024`
--

LOCK TABLES `skor_indikator_provinsi_2024` WRITE;
/*!40000 ALTER TABLE `skor_indikator_provinsi_2024` DISABLE KEYS */;
INSERT INTO `skor_indikator_provinsi_2024` VALUES (0000,'kode_bps','nama_provinsi',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00),(2024,'1100','Aceh',0.10,2.62,84.79,31.86,73.75,71.37,89.11,61.42,3.95,17.70,75.08,70.15,14.96,64.66,1.70,26.86,7.11,80.71,59.71,66.33,12.90,61.50,89.93,9.86),(2024,'1200','Sumatera Utara',0.15,2.72,59.75,39.90,72.70,88.20,83.94,60.21,3.69,8.88,44.44,77.46,14.16,72.03,3.46,8.75,8.45,72.10,56.75,76.47,8.31,69.48,93.34,20.99),(2024,'1300','Sumatera Barat',0.26,3.57,68.32,30.80,74.00,78.36,83.95,59.00,37.04,21.22,94.03,78.03,20.71,71.14,2.96,12.85,11.47,82.30,60.90,76.09,17.66,69.79,104.66,11.60),(2024,'1400','Riau',0.18,3.79,76.63,33.18,71.97,83.99,83.99,53.85,11.39,32.27,56.50,74.26,15.28,72.09,1.87,12.56,11.82,80.94,55.93,79.84,11.73,55.48,92.45,14.04),(2024,'1500','Jambi',0.22,3.75,59.15,29.68,64.99,83.45,89.66,61.60,1.43,27.08,90.67,80.35,12.19,79.25,1.65,10.69,9.51,85.40,51.68,72.89,9.97,59.47,84.18,14.58),(2024,'1600','Sumatera Selatan',0.21,3.41,65.06,32.25,73.90,85.57,82.63,65.60,33.60,16.67,96.86,82.40,11.72,85.91,2.35,13.80,10.99,75.90,59.08,71.92,10.59,64.52,88.86,31.58),(2024,'1700','Bengkulu',0.17,6.03,73.37,29.76,66.00,84.24,83.37,68.39,4.74,9.48,93.14,76.47,16.53,82.98,1.93,13.68,8.41,85.80,58.20,72.26,10.23,67.85,88.33,28.57),(2024,'1800','Lampung',0.25,4.64,71.66,32.17,67.60,89.78,87.02,69.99,8.40,29.08,70.70,88.70,10.50,89.82,1.76,12.72,11.34,80.60,52.67,74.21,10.22,63.75,86.44,25.00),(2024,'1900','Kepulauan Bangka Belitung',0.20,3.52,58.93,28.35,59.11,86.36,78.58,57.55,25.00,25.69,92.95,88.44,18.39,80.50,2.71,24.18,9.76,85.69,57.51,76.97,13.65,58.67,91.66,28.57),(2024,'2100','Kepulauan Riau',0.19,2.23,66.90,29.06,64.40,94.01,79.69,66.80,46.13,23.22,33.72,77.16,13.33,74.56,3.01,13.38,9.57,83.50,59.75,91.20,13.13,60.83,95.22,16.22),(2024,'3100','DKI Jakarta',0.17,1.84,64.72,30.42,83.33,93.13,78.78,56.57,2.84,40.10,5.89,74.02,26.40,86.94,1.98,8.66,7.60,86.27,65.20,90.57,12.93,62.84,86.65,32.50),(2024,'3200','Jawa Barat',0.26,4.01,55.80,41.03,84.89,75.69,85.29,48.95,9.95,17.87,72.88,75.69,15.73,86.75,2.98,14.57,7.97,86.77,51.12,78.11,11.47,59.86,82.57,33.71),(2024,'3300','Jawa Tengah',0.26,6.18,58.14,46.07,84.74,77.77,89.77,70.32,6.08,17.61,96.64,79.01,14.42,91.20,4.24,27.11,6.93,86.99,52.14,73.29,10.66,72.17,82.91,21.43),(2024,'3400','Daerah Istimewa Yogyakarta',0.47,3.56,61.82,54.33,85.35,83.22,91.39,67.93,30.65,36.11,90.53,78.11,18.88,90.58,6.33,19.09,8.54,89.20,58.85,80.58,16.82,79.97,91.19,19.57),(2024,'3500','Jawa Timur',0.31,4.99,55.85,54.68,81.49,71.21,89.28,69.63,6.71,14.07,94.83,78.59,15.95,87.54,5.36,40.74,8.29,85.97,48.74,70.10,10.45,70.09,80.93,25.00),(2024,'3600','Banten',0.19,3.70,51.17,33.99,73.55,71.71,85.58,44.59,4.77,21.92,50.41,75.19,27.31,86.98,2.80,26.82,9.84,83.06,51.28,77.81,11.05,58.95,81.23,16.28),(2024,'5100','Bali',0.55,9.18,74.59,54.32,85.90,81.00,85.16,70.28,3.28,27.46,86.75,73.46,25.23,91.61,3.54,26.67,5.24,87.60,69.52,78.89,9.95,84.15,79.91,19.57),(2024,'5200','Nusa Tenggara Barat',0.56,4.98,75.44,32.28,63.99,76.45,91.51,70.22,1.77,5.74,87.50,75.49,11.86,89.06,3.46,23.82,12.96,78.18,49.18,68.54,13.06,78.69,75.09,7.26),(2024,'5300','Nusa Tenggara Timur',0.06,3.21,68.26,30.59,62.41,92.32,88.33,62.62,0.81,8.01,61.73,60.99,15.85,82.51,3.90,19.79,9.35,78.99,49.26,57.63,9.41,83.12,92.08,30.00),(2024,'6100','Kalimantan Barat',0.16,2.45,52.19,28.87,62.15,91.40,82.05,59.63,12.13,11.81,82.76,76.92,16.36,78.60,1.58,20.67,9.67,80.70,51.06,73.25,8.68,62.70,86.56,27.45),(2024,'6200','Kalimantan Tengah',0.21,3.93,67.17,34.64,61.28,94.14,85.72,63.74,82.24,4.78,84.21,72.21,9.31,81.88,2.52,8.48,7.67,81.87,48.76,77.80,8.78,57.34,86.25,25.00),(2024,'6300','Kalimantan Selatan',0.23,4.68,64.70,28.33,60.27,88.27,83.96,67.52,20.08,14.33,95.02,72.07,11.14,87.59,1.57,15.12,6.66,82.54,58.28,75.84,11.32,65.54,82.22,25.00),(2024,'6400','Kalimantan Timur',0.19,4.16,57.17,34.81,71.80,92.46,77.12,62.10,0.77,14.77,27.53,65.77,9.59,82.82,1.81,11.59,8.15,80.50,56.57,86.33,10.42,58.59,89.20,17.02),(2024,'6500','Kalimantan Utara',0.24,3.10,58.64,27.68,55.80,94.14,79.54,53.18,1.36,22.14,23.21,57.20,15.95,71.97,2.57,10.05,11.28,69.90,46.75,80.27,11.08,60.27,87.98,20.69),(2024,'7100','Sulawesi Utara',0.11,3.28,50.27,29.60,68.36,91.35,91.31,67.34,9.55,7.75,95.86,62.95,11.01,51.32,1.44,20.66,6.00,81.80,43.29,70.38,7.59,60.54,105.48,87.50),(2024,'7200','Sulawesi Tengah',0.19,2.75,54.50,27.67,64.59,91.66,88.26,55.18,4.96,12.59,39.64,71.15,8.20,67.50,3.11,20.19,8.55,85.65,55.78,65.13,10.88,64.55,93.73,34.15),(2024,'7300','Sulawesi Selatan',0.17,6.02,69.72,33.62,75.00,83.66,77.20,60.30,5.98,22.88,69.96,65.39,9.10,73.85,1.48,19.05,6.76,82.30,51.63,71.94,12.25,63.84,92.34,32.81),(2024,'7400','Sulawesi Tenggara',0.07,4.50,75.35,27.87,66.95,90.69,79.90,56.47,22.34,21.26,41.58,76.61,9.25,69.89,2.85,12.84,6.51,77.89,56.67,73.41,9.32,70.92,88.40,40.63),(2024,'7500','Gorontalo',0.24,4.69,47.34,28.33,58.38,76.42,87.68,50.76,16.67,14.33,72.92,64.25,9.36,76.20,1.41,19.41,7.95,69.96,56.56,67.28,12.87,65.36,114.92,32.35),(2024,'7600','Sulawesi Barat',0.12,4.89,58.23,29.29,58.74,91.50,82.95,65.98,3.70,13.50,67.23,68.93,11.51,83.11,1.62,19.24,13.24,81.30,56.99,68.09,11.42,65.69,91.21,21.62),(2024,'8100','Maluku',0.32,1.65,53.12,29.90,60.60,89.24,87.25,67.14,40.77,20.59,67.08,58.68,9.30,79.27,3.03,15.36,12.69,66.10,45.88,63.73,9.17,73.41,96.52,15.38),(2024,'8200','Maluku Utara',0.02,2.66,45.32,29.27,55.17,84.44,84.10,57.42,14.55,31.03,83.59,55.93,14.67,74.15,2.40,11.48,8.90,66.55,46.46,62.19,8.78,66.72,86.98,40.63),(2024,'9100','Papua Barat',0.13,4.77,51.38,23.21,51.90,94.41,80.92,67.43,0.00,5.36,43.76,60.22,9.71,58.31,5.00,9.31,9.29,31.99,40.78,67.15,4.69,73.45,81.76,9.38),(2024,'9200','Papua Barat Daya',0.28,3.21,49.94,23.26,53.85,91.38,84.14,47.09,0.00,0.00,17.56,54.69,7.41,73.48,5.51,8.73,7.54,32.36,47.92,69.37,5.46,68.71,89.81,16.67),(2024,'9400','Papua',0.14,2.27,46.23,23.61,54.58,87.46,86.80,58.57,36.84,6.47,13.84,65.37,12.93,61.25,1.56,7.66,8.10,27.25,61.59,65.24,8.19,71.45,86.87,15.38),(2024,'9500','Papua Selatan',0.15,2.07,43.07,23.07,54.11,92.50,88.26,66.21,0.00,0.00,50.82,61.82,8.40,76.35,3.80,8.21,13.10,34.68,50.46,51.97,2.71,72.46,80.34,9.38),(2024,'9600','Papua Tengah',0.11,1.27,36.23,23.18,51.10,73.22,88.71,41.10,0.00,0.00,68.82,40.23,3.24,73.96,0.98,17.56,6.04,32.52,37.92,29.97,1.32,69.76,79.98,9.76),(2024,'9700','Papua Pegunungan',0.28,0.89,31.71,22.99,48.82,62.81,84.32,77.33,0.00,0.00,94.25,13.53,5.33,79.07,3.50,15.40,3.13,29.03,18.36,7.35,0.23,94.84,63.32,15.38);
/*!40000 ALTER TABLE `skor_indikator_provinsi_2024` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sumber_data_indikator_2018`
--

DROP TABLE IF EXISTS `sumber_data_indikator_2018`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sumber_data_indikator_2018` (
  `tahun` year(4) NOT NULL,
  `x1_1` varchar(100) DEFAULT NULL,
  `x2_1` varchar(100) DEFAULT NULL,
  `x2_2` varchar(100) DEFAULT NULL,
  `x2_3` varchar(100) DEFAULT NULL,
  `x2_4` varchar(100) DEFAULT NULL,
  `x2_5` varchar(100) DEFAULT NULL,
  `x2_6` varchar(100) DEFAULT NULL,
  `x3_1` varchar(100) DEFAULT NULL,
  `x3_2` varchar(100) DEFAULT NULL,
  `x3_3` varchar(100) DEFAULT NULL,
  `x3_4` varchar(100) DEFAULT NULL,
  `x3_5` varchar(100) DEFAULT NULL,
  `x3_6` varchar(100) DEFAULT NULL,
  `x3_7` varchar(100) DEFAULT NULL,
  `x3_8` varchar(100) DEFAULT NULL,
  `x4_1` varchar(100) DEFAULT NULL,
  `x4_2` varchar(100) DEFAULT NULL,
  `x4_3` varchar(100) DEFAULT NULL,
  `x4_4` varchar(100) DEFAULT NULL,
  `x4_5` varchar(100) DEFAULT NULL,
  `x4_6` varchar(100) DEFAULT NULL,
  `x5_1` varchar(100) DEFAULT NULL,
  `x5_2` varchar(100) DEFAULT NULL,
  `x5_3` varchar(100) DEFAULT NULL,
  `x5_4` varchar(100) DEFAULT NULL,
  `x6_1` varchar(100) DEFAULT NULL,
  `x6_2` varchar(100) DEFAULT NULL,
  `x6_3` varchar(100) DEFAULT NULL,
  `x7_1` varchar(100) DEFAULT NULL,
  `x7_2` varchar(100) DEFAULT NULL,
  `x7_3` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sumber_data_indikator_2018`
--

LOCK TABLES `sumber_data_indikator_2018` WRITE;
/*!40000 ALTER TABLE `sumber_data_indikator_2018` DISABLE KEYS */;
INSERT INTO `sumber_data_indikator_2018` VALUES (0000,'x1_1','x2_1','x2_2','x2_3','x2_4','x2_5','x2_6','x3_1','x3_2','x3_3','x3_4','x3_5','x3_6','x3_7','x3_8','x4_1','x4_2','x4_3','x4_4','x4_5','x4_6','x5_1','x5_2','x5_3','x5_4','x6_1','x6_2','x6_3','x7_1','x7_2','x7_3'),(2018,'Susenas MSBP','Susenas KOR','Susenas KOR','Susenas KOR','DAPODIK','Susenas KOR','Susenas KOR','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas Hansos','Susenas Hansos','Data Ditjenbud (Regnas CB)','Data Ditjenbud (WBTB)','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas KOR','Susenas KOR','Susenas MSBP','Sakernas','Susenas KOR','Data KPU, BPS'),(2019,'Susenas MSBP','Susenas KOR','Susenas KOR','Susenas KOR','DAPODIK','Susenas KOR','Susenas KOR','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas Hansos','Susenas Hansos','Data Ditjenbud (Regnas CB)','Data Ditjenbud (WBTB)','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas KOR','Susenas KOR','Susenas MSBP','Sakernas','Susenas KOR','Data KPU, BPS'),(2020,'Susenas MSBP','Susenas KOR','Susenas KOR','Susenas KOR','DAPODIK','Susenas KOR','Susenas KOR','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas Hansos','Susenas Hansos','Data Ditjenbud (Regnas CB)','Data Ditjenbud (WBTB)','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas KOR','Susenas KOR','Susenas MSBP','Sakernas','Susenas KOR','Data KPU, BPS'),(2021,'Susenas MSBP','Susenas KOR','Susenas KOR','Susenas KOR','DAPODIK','Susenas KOR','Susenas KOR','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','SPTK','SPTK','Data Ditjenbud (Regnas CB)','Data Ditjenbud (WBTB)','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas MSBP','Susenas KOR','Susenas KOR','Susenas MSBP','Sakernas','Susenas KOR','Data KPU, BPS'),(2022,'Pemodelan Statisik','Susenas KOR','Susenas KOR','Susenas KOR','DAPODIK','Susenas KOR','Susenas KOR','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','DAPOBUD','DAPOBUD','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Susenas KOR','Pemodelan Statistik','Sakernas','Susenas KOR','Data KPU, BPS'),(2023,'Pemodelan Statisik','Susenas KOR','Susenas KOR','Susenas KOR','DAPODIK','Susenas KOR','Susenas KOR','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','DAPOBUD','DAPOBUD','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Pemodelan Statistik','Susenas KOR','Pemodelan Statistik','Sakernas','Susenas KOR','Data KPU, BPS');
/*!40000 ALTER TABLE `sumber_data_indikator_2018` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sumber_data_indikator_2024`
--

DROP TABLE IF EXISTS `sumber_data_indikator_2024`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sumber_data_indikator_2024` (
  `tahun` year(4) NOT NULL,
  `x1_1` varchar(100) DEFAULT NULL,
  `x1_2` varchar(100) DEFAULT NULL,
  `x2_1` varchar(100) DEFAULT NULL,
  `x2_2` varchar(100) DEFAULT NULL,
  `x2_3` varchar(100) DEFAULT NULL,
  `x3_1` varchar(100) DEFAULT NULL,
  `x3_2` varchar(100) DEFAULT NULL,
  `x3_3` varchar(100) DEFAULT NULL,
  `x4_1` varchar(100) DEFAULT NULL,
  `x4_2` varchar(100) DEFAULT NULL,
  `x4_3` varchar(100) DEFAULT NULL,
  `x4_4` varchar(100) DEFAULT NULL,
  `x4_5` varchar(100) DEFAULT NULL,
  `x4_6` varchar(100) DEFAULT NULL,
  `x5_1` varchar(100) DEFAULT NULL,
  `x5_2` varchar(100) DEFAULT NULL,
  `x5_3` varchar(100) DEFAULT NULL,
  `x5_4` varchar(100) DEFAULT NULL,
  `x6_1` varchar(100) DEFAULT NULL,
  `x6_2` varchar(100) DEFAULT NULL,
  `x6_3` varchar(100) DEFAULT NULL,
  `x7_1` varchar(100) DEFAULT NULL,
  `x7_2` varchar(100) DEFAULT NULL,
  `x7_3` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sumber_data_indikator_2024`
--

LOCK TABLES `sumber_data_indikator_2024` WRITE;
/*!40000 ALTER TABLE `sumber_data_indikator_2024` DISABLE KEYS */;
INSERT INTO `sumber_data_indikator_2024` VALUES (0000,'x1_1','x1_2','x2_1','x2_2','x2_3','x3_1','x3_2','x3_3','x4_1','x4_2','x4_3','x4_4','x4_5','x4_6','x5_1','x5_2','x5_3','x5_4','x6_1','x6_2','x6_3','x7_1','x7_2','x7_3'),(2024,'MSBP','KP','DAPODIK','DAPODIK & KEMENAG','SURVEI MANDIRI','MSBP','MSBP','MSBP','DAPOBUD','DAPOBUD','MSBP','MSBP','MSBP','MSBP','MSBP','MSBP','MSBP','SURVEI MANDIRI','MSBP','Susenas KOR','MSBP','Sakernas','Susenas KOR','Data KPU, BPS');
/*!40000 ALTER TABLE `sumber_data_indikator_2024` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surat_masuk`
--

DROP TABLE IF EXISTS `surat_masuk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `surat_masuk` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nomor_tiket` varchar(50) DEFAULT NULL COMMENT 'Nomor referensi tiket online (misal: IPK-2026-000001)',
  `nomor_agenda` varchar(50) DEFAULT NULL COMMENT 'Diisi oleh admin arsip',
  `nomor_surat` varchar(150) DEFAULT NULL COMMENT 'Nomor surat fisik jika ada',
  `tanggal_surat` date DEFAULT NULL,
  `tanggal_diterima` date NOT NULL,
  `nama_pengirim` varchar(150) NOT NULL,
  `email_pengirim` varchar(150) NOT NULL,
  `telepon_pengirim` varchar(50) DEFAULT NULL,
  `asal_instansi` varchar(200) DEFAULT NULL,
  `kategori` enum('data','metodologi','publikasi','permohonan-data','website','lainnya') NOT NULL DEFAULT 'lainnya',
  `perihal` varchar(255) NOT NULL COMMENT 'Subjek pesan / perihal surat',
  `ringkasan` text NOT NULL COMMENT 'Isi pesan / uraian surat',
  `file_surat` varchar(255) DEFAULT NULL,
  `status` enum('baru','dibaca','didisposisikan','selesai') NOT NULL DEFAULT 'baru',
  `disposisi_kepada` varchar(200) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_surat_nomor_tiket` (`nomor_tiket`),
  KEY `idx_surat_nomor_agenda` (`nomor_agenda`),
  KEY `idx_surat_status` (`status`),
  KEY `idx_surat_tanggal` (`tanggal_diterima`),
  KEY `idx_surat_email` (`email_pengirim`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surat_masuk`
--

LOCK TABLES `surat_masuk` WRITE;
/*!40000 ALTER TABLE `surat_masuk` DISABLE KEYS */;
INSERT INTO `surat_masuk` VALUES (1,'IPK-2026-171276',NULL,NULL,NULL,'2026-09-23','Syarif Hidayatullah','suhebat@gmail.com','081317500445','Pusdatin','publikasi','Uji coba','Ini untuk uji coba kontak',NULL,'dibaca',NULL,NULL,'2026-09-24 00:09:12','2026-09-24 00:17:27'),(2,'IPK-2026-346597',NULL,NULL,NULL,'2026-09-23','Dayat Suhebat','suhebat@gmail.com',NULL,'Umum','permohonan-data','Uji coba ke 2','Ini untuk uji coba captcha',NULL,'didisposisikan',NULL,NULL,'2026-09-24 00:30:26','2026-11-08 22:28:25');
/*!40000 ALTER TABLE `surat_masuk` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-13 16:21:15
