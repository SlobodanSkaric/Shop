/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `aplikacija`;
CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `aplikacija`;

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL DEFAULT '0',
  `password_hash` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

DELETE FROM `administrator`;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`) VALUES
	(1, 'Slobodan', '41113A4A78B350A0293BFD8012B4EB1D8ED781C8BE8E1ADD195A1EFAAD4A0ED3DE7677B74AD559FBDB4DA203C2F0C5CA53A7D705DFEB324918DFF83E6C109FF7'),
	(2, 'Slo', '123'),
	(3, 'Scahra', '7E93DCF4FA168150053BF5447049ABA2203853ACF0A0F15D85FE15B8F207A87855424AE4A2DA3589064BD272359F75E9B5FBD25DD26B9723233BA86ED9C049C1'),
	(6, 'Slobodan81', 'FEDF9124CC898452994E3551D50F9D83A393A7D36A375E0C3BB3EFA068BCFDAE3E6F331D24FDA9E0E886EBF203C65D0AB0296BE272FEB6AE7DE3A59E05018DC8'),
	(10, 'ska', '53336DE15A55240D227F42E457E0DE26AAEEA5B1F894FEBFDEE06C59393D6CF7D2B20BEA7941756DE7121C01B126DB30E306DC08686A0A96841C30D5B88F0281'),
	(11, 'ska1', '369E1D5C75627460C0B86A6F1E0CA49C923D096199CD5036F7A01D56AB11AA7AB4CD1B1A1DFEE899EA425F4B1BBB3BF79B1D5C55DB66ABDD9CC7515CB07817D8'),
	(13, 'Slobodan8187', 'FEDF9124CC898452994E3551D50F9D83A393A7D36A375E0C3BB3EFA068BCFDAE3E6F331D24FDA9E0E886EBF203C65D0AB0296BE272FEB6AE7DE3A59E05018DC8'),
	(14, 'Slobodan17', '0D916C4A7F310F0310B80D396D82A761297192560C1459C66FB96051A3A0C47369A242F17281CF5C46FEC2A4306FFCC693889213E9D2C3B8CAC6B572FAD821E5'),
	(16, 'Slobodan18', '0D916C4A7F310F0310B80D396D82A761297192560C1459C66FB96051A3A0C47369A242F17281CF5C46FEC2A4306FFCC693889213E9D2C3B8CAC6B572FAD821E5'),
	(20, 'Slobodan71', '0D916C4A7F310F0310B80D396D82A761297192560C1459C66FB96051A3A0C47369A242F17281CF5C46FEC2A4306FFCC693889213E9D2C3B8CAC6B572FAD821E5');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

DROP TABLE IF EXISTS `articel_feature`;
CREATE TABLE IF NOT EXISTS `articel_feature` (
  `articel_feature_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL DEFAULT 0,
  `feature_id` int(10) unsigned NOT NULL DEFAULT 0,
  `value` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`articel_feature_id`),
  UNIQUE KEY `uq_articel_feature_article_id_feature_id` (`article_id`,`feature_id`),
  KEY `fk_atricle_feature_feature_id` (`feature_id`),
  CONSTRAINT `fk_atricle_feature_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_atricle_feature_feature_id` FOREIGN KEY (`feature_id`) REFERENCES `feature` (`feature_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

DELETE FROM `articel_feature`;
/*!40000 ALTER TABLE `articel_feature` DISABLE KEYS */;
INSERT INTO `articel_feature` (`articel_feature_id`, `article_id`, `feature_id`, `value`) VALUES
	(4, 2, 3, 'SATA'),
	(5, 2, 2, 'SSD'),
	(6, 3, 3, 'SATA'),
	(7, 3, 2, 'SSD'),
	(8, 1, 1, '1024TB'),
	(9, 1, 3, 'SATA 3.0'),
	(10, 4, 1, '512'),
	(11, 4, 2, '100W'),
	(12, 4, 3, 'SSD'),
	(13, 5, 1, '512'),
	(14, 5, 2, '100W'),
	(15, 5, 3, 'SSD');
/*!40000 ALTER TABLE `articel_feature` ENABLE KEYS */;

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `article_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL DEFAULT '0',
  `category_id` int(10) unsigned NOT NULL DEFAULT 0,
  `excerpt` varchar(255) NOT NULL DEFAULT '0',
  `description` text NOT NULL,
  `status` enum('available','visible','hidden') NOT NULL DEFAULT 'available',
  `is_promoted` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`article_id`),
  KEY `fk_article_category_id` (`category_id`),
  CONSTRAINT `fk_article_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

DELETE FROM `article`;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` (`article_id`, `name`, `category_id`, `excerpt`, `description`, `status`, `is_promoted`, `created_at`) VALUES
	(1, 'ACME HDD SSD 512GB  SSS', 6, 'Short description on this new article edit', 'This is ssd is new very good edit', 'visible', 1, '2022-04-30 23:29:02'),
	(2, 'ACME HDD1 1TB', 5, 'Short description', 'This is acme hdd is ok', 'available', 0, '2022-05-05 21:13:04'),
	(3, 'ACME HDD1 1TB', 5, 'Short description', 'This is acme hdd is ok', 'available', 0, '2022-05-06 21:40:11'),
	(4, 'This seample article', 6, 'This is some excerpt', 'This is semple description', 'available', 0, '2022-11-05 01:25:18'),
	(5, 'This seample article1', 6, 'This is some excerpt1', 'This is semple description1', 'available', 0, '2022-11-05 01:26:39');
/*!40000 ALTER TABLE `article` ENABLE KEYS */;

DROP TABLE IF EXISTS `article_price`;
CREATE TABLE IF NOT EXISTS `article_price` (
  `article_price_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL DEFAULT 0,
  `price` decimal(10,2) unsigned NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`article_price_id`),
  KEY `fk_articel_price_article_id` (`article_id`),
  CONSTRAINT `fk_articel_price_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

DELETE FROM `article_price`;
/*!40000 ALTER TABLE `article_price` DISABLE KEYS */;
INSERT INTO `article_price` (`article_price_id`, `article_id`, `price`, `created_at`) VALUES
	(1, 1, 45.00, '2022-05-01 19:00:37'),
	(2, 1, 43.50, '2022-05-01 19:00:54'),
	(3, 2, 100.00, '2022-05-05 21:13:04'),
	(4, 3, 100.00, '2022-05-06 21:40:11'),
	(5, 1, 60.00, '2022-05-14 20:40:48'),
	(6, 1, 100.00, '2022-05-14 20:43:36'),
	(7, 4, 100.00, '2022-11-05 01:25:18'),
	(8, 5, 1000.00, '2022-11-05 01:26:39'),
	(9, 1, 170.00, '2022-12-04 18:52:46');
/*!40000 ALTER TABLE `article_price` ENABLE KEYS */;

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT 0,
  `created_et` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`cart_id`),
  KEY `fk:_cart_user_id` (`user_id`),
  CONSTRAINT `fk:_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

DELETE FROM `cart`;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` (`cart_id`, `user_id`, `created_et`) VALUES
	(1, 3, '2022-06-04 08:04:32'),
	(2, 3, '2022-06-04 09:57:23'),
	(3, 3, '2022-06-04 22:53:34'),
	(4, 3, '2022-06-04 23:01:33'),
	(5, 3, '2022-06-04 23:07:51'),
	(6, 3, '2022-06-06 00:26:01'),
	(7, 3, '2022-06-06 01:51:49'),
	(8, 3, '2022-06-06 01:53:33'),
	(9, 3, '2022-06-06 01:56:31'),
	(10, 3, '2022-06-06 02:07:29'),
	(11, 3, '2022-06-06 02:16:18'),
	(12, 3, '2022-06-06 09:31:15'),
	(13, 3, '2022-06-06 09:45:05'),
	(14, 3, '2022-06-06 09:47:04');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;

DROP TABLE IF EXISTS `cart_articel`;
CREATE TABLE IF NOT EXISTS `cart_articel` (
  `cart_articel_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int(10) unsigned NOT NULL DEFAULT 0,
  `articel_id` int(10) unsigned NOT NULL DEFAULT 0,
  `quantiry` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`cart_articel_id`),
  UNIQUE KEY `uq_cart_article_cart_id_articel_id` (`cart_id`,`articel_id`),
  KEY `fk_cart_article_article_id` (`articel_id`),
  CONSTRAINT `fk_cart_article_article_id` FOREIGN KEY (`articel_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_article_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

DELETE FROM `cart_articel`;
/*!40000 ALTER TABLE `cart_articel` DISABLE KEYS */;
INSERT INTO `cart_articel` (`cart_articel_id`, `cart_id`, `articel_id`, `quantiry`) VALUES
	(1, 1, 1, 2),
	(2, 1, 2, 3),
	(3, 2, 1, 6),
	(4, 4, 1, 1),
	(5, 5, 3, 1),
	(6, 6, 3, 3),
	(7, 6, 2, 1),
	(8, 6, 1, 1),
	(9, 7, 1, 1),
	(10, 7, 2, 1),
	(11, 7, 3, 3),
	(12, 8, 3, 3),
	(13, 8, 2, 1),
	(14, 8, 1, 1),
	(15, 9, 1, 1),
	(16, 9, 2, 1),
	(17, 9, 3, 3),
	(18, 10, 3, 3),
	(19, 10, 2, 3),
	(20, 11, 2, 3),
	(21, 11, 3, 3),
	(22, 12, 3, 3),
	(23, 13, 3, 3),
	(24, 14, 1, 1),
	(25, 14, 2, 1),
	(26, 14, 3, 3);
/*!40000 ALTER TABLE `cart_articel` ENABLE KEYS */;

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '0',
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  `parent_category_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`),
  UNIQUE KEY `uq_category_image_path` (`image_path`),
  KEY `fk_category_parent_category_id` (`parent_category_id`),
  CONSTRAINT `fk_category_parent_category_id` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

DELETE FROM `category`;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`, `image_path`, `parent_category_id`) VALUES
	(1, 'Racunarske komponente', 'assets/pc.jpg', NULL),
	(3, 'Kucna elektronika', 'assets/home.jpg', NULL),
	(4, 'Laptop racunari', 'assets/pc/laptop.jpg', 1),
	(5, 'Memorijski mediji', 'assets/pc/memo.jpg', 1),
	(6, 'Hard diskovi', 'assets/pc/memo/harddisk.jpg', 5);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

DROP TABLE IF EXISTS `feature`;
CREATE TABLE IF NOT EXISTS `feature` (
  `feature_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '0',
  `category_id` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`feature_id`),
  UNIQUE KEY `uq_feature_name_category_id` (`name`,`category_id`),
  KEY `fk_feature_category_id` (`category_id`),
  CONSTRAINT `fk_feature_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

DELETE FROM `feature`;
/*!40000 ALTER TABLE `feature` DISABLE KEYS */;
INSERT INTO `feature` (`feature_id`, `name`, `category_id`) VALUES
	(1, 'Kapacitet', 5),
	(5, 'Potrosnja/Snaga', 5),
	(6, 'Proizvodjac', 1),
	(3, 'Tehnologija', 5),
	(2, 'Tip', 5);
/*!40000 ALTER TABLE `feature` ENABLE KEYS */;

DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cart_id` int(10) unsigned NOT NULL DEFAULT 0,
  `status` enum('rejected','acceptred','shipped','pending') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uq_order_cart_id` (`cart_id`),
  CONSTRAINT `fk_order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

DELETE FROM `order`;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` (`order_id`, `created_at`, `cart_id`, `status`) VALUES
	(1, '2022-06-04 09:57:11', 1, 'shipped'),
	(4, '2022-06-04 23:04:29', 4, 'pending'),
	(5, '2022-06-04 23:08:22', 5, 'pending'),
	(6, '2022-06-06 01:49:36', 6, 'shipped'),
	(7, '2022-06-06 01:52:25', 7, 'pending'),
	(8, '2022-06-06 01:54:13', 8, 'pending'),
	(9, '2022-06-06 01:56:58', 9, 'pending'),
	(10, '2022-06-06 02:07:54', 10, 'pending'),
	(11, '2022-06-06 09:27:25', 11, 'pending'),
	(12, '2022-06-06 09:31:25', 12, 'pending'),
	(13, '2022-06-06 09:45:12', 13, 'pending'),
	(14, '2022-06-06 09:47:46', 14, 'pending');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;

DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `articel_id` int(10) unsigned NOT NULL DEFAULT 0,
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_image_path` (`image_path`),
  KEY `fk_photo_articel_id` (`articel_id`),
  CONSTRAINT `fk_photo_articel_id` FOREIGN KEY (`articel_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4;

DELETE FROM `photo`;
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `articel_id`, `image_path`) VALUES
	(1, 1, 'asset/img/mediaSsd512Acme1.jpg '),
	(5, 1, 'asset/img/mediaSsd512Acme2.jpg '),
	(6, 1, '202259-6151244341-9283A.jpg'),
	(7, 1, '202259-5608533427-9283A.jpg'),
	(8, 1, '202259-9523235433-9283A.jpg'),
	(9, 1, '202259-5372636473-9283A.jpg'),
	(10, 1, '202259-6418889058-9283A.jpg'),
	(11, 1, '202259-6861117453-9283A.jpg'),
	(12, 1, '2022510-7260842118-ssd01.jpg'),
	(13, 1, '2022510-1318721896-ssd01.jpg'),
	(14, 1, '2022510-4054460825-9283A.jpg'),
	(15, 1, '2022511-1224998987-ssd01.jpg'),
	(17, 1, '2022512-7875081434-9283A.jpg'),
	(18, 1, '2022512-4468243422-ssd01.jpg'),
	(21, 1, '2022111-7858691263-hdd.jpg'),
	(22, 1, '2022113-3612817122-hdd.jpg'),
	(23, 1, '2022113-6893921295-hdd.jpg'),
	(24, 1, '2022113-75813100577-hdd.jpg'),
	(25, 1, '2022115-2941643469-hdd.jpg'),
	(26, 1, '2022115-33236831078-hdd1.png'),
	(27, 1, '2022115-8399796895-hdd.jpg'),
	(28, 1, '2022115-10186101091079-hdd.jpg'),
	(29, 1, '2022115-1972818567-hdd.jpg'),
	(30, 1, '2022115-6967875554-hdd.jpg'),
	(31, 1, '2022115-9476719298-hdd.jpg'),
	(32, 1, '2022114-58610174459-hdd.jpg');
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `size` int(11) NOT NULL DEFAULT 0,
  `is_available` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `product`;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
/*!40000 ALTER TABLE `product` ENABLE KEYS */;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL DEFAULT '0',
  `password_hash` varchar(128) NOT NULL DEFAULT '0',
  `forname` varchar(64) NOT NULL DEFAULT '0',
  `surname` varchar(64) NOT NULL DEFAULT '0',
  `phone_number` varchar(24) NOT NULL DEFAULT '0',
  `postal_address` text NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `email`, `password_hash`, `forname`, `surname`, `phone_number`, `postal_address`) VALUES
	(1, 'slobodan.skaric81@gmail.com', 'E13EFC991A9BF44BBB4DA87CDBB725240184585CCAF270523170E008CF2A3B85F45F86C3DA647F69780FB9E971CAF5437B3D06D418355A68C9760C70A31D05C7', 'Skaric', 'Slobodan', '0605444756', 'Some addr'),
	(3, 'slobodan.skaric@gmail.com', 'E13EFC991A9BF44BBB4DA87CDBB725240184585CCAF270523170E008CF2A3B85F45F86C3DA647F69780FB9E971CAF5437B3D06D418355A68C9760C70A31D05C7', 'Skaric1', 'Slobodan1', '060544475617', 'Some addr'),
	(5, 'slobodan17.skaric17@gmail.com', 'E13EFC991A9BF44BBB4DA87CDBB725240184585CCAF270523170E008CF2A3B85F45F86C3DA647F69780FB9E971CAF5437B3D06D418355A68C9760C70A31D05C7', 'Skaric17', 'Slobodan17', '0605444756177', 'Some addr'),
	(6, 'slobodan.skaric18@gmail.com', 'BA3253876AED6BC22D4A6FF53D8406C6AD864195ED144AB5C87621B6C233B548BAEAE6956DF346EC8C17F5EA10F35EE3CBC514797ED7DDD3145464E2A0BAB413', 'Slobodan', 'Skaric', '123456', 'Some addres Valjevo'),
	(7, 'slobodan18.skaric81@gmail.com', '159C65F4493B3B92816223399CBF4FEE9AABFDE412A49231833D4D77887CFB06AB91621F32CBC1286D0AF8F5D7F1317B122CE2487E7802E70CA7EC3593A5BB1D', 'Slobodan1', 'Skaric1', '1234567891', 'Valjevo'),
	(9, 'slobodan17.skaric17@gamil.com', 'BA3253876AED6BC22D4A6FF53D8406C6AD864195ED144AB5C87621B6C233B548BAEAE6956DF346EC8C17F5EA10F35EE3CBC514797ED7DDD3145464E2A0BAB413', 'Slobodan', 'Skaric', '1234567991243456', 'Valjevo');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

DROP TABLE IF EXISTS `user_token`;
CREATE TABLE IF NOT EXISTS `user_token` (
  `user_token_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token` text NOT NULL,
  `expiries_at` datetime NOT NULL,
  `is_valid` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_token_id`),
  KEY `user_token_user_id_fk` (`user_id`),
  CONSTRAINT `user_token_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

DELETE FROM `user_token`;
/*!40000 ALTER TABLE `user_token` DISABLE KEYS */;
INSERT INTO `user_token` (`user_token_id`, `user_id`, `created_at`, `token`, `expiries_at`, `is_valid`) VALUES
	(1, 1, '2022-06-08 15:51:06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjoxLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpYzgxQGdtYWlsLmNvbSIsImV4cHBwaXJlcyI6MTY1NzM3NDY2Ni4wNCwiaXAiOiI6OjEiLCJ1YSI6IlBvc3RtYW5SdW50aW1lLzcuMjkuMCIsImlhdCI6MTY1NDY5NjI2Nn0.dOZ1UFrKioU6Q1oMe4-GtAgJDVkFca6Tucx5Qdl03gs', '2022-07-09 13:51:06', 1),
	(2, 1, '2022-06-16 17:51:54', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjoxLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpYzgxQGdtYWlsLmNvbSIsImV4cHBwaXJlcyI6MTY1ODA3MzExNC41NTMsImlwIjoiOjoxIiwidWEiOiJQb3N0bWFuUnVudGltZS83LjI5LjAiLCJpYXQiOjE2NTUzOTQ3MTR9.AF_nL0esTkrQynDyH0lIKr0ltymLfekzkzEOY9hyot8', '2022-07-17 15:51:54', 1),
	(3, 1, '2022-06-16 17:57:58', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjoxLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpYzgxQGdtYWlsLmNvbSIsImV4cHBwaXJlcyI6MTY1ODA3MzQ3OC4yMTcsImlwIjoiOjoxIiwidWEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTAyLjAuNTAwNS4xMjUgU2FmYXJpLzUzNy4zNiIsImlhdCI6MTY1NTM5NTA3OH0.PSSLr-pycchDqTmzTfBnLIfO0IQmfOjYCAhBW-a1SnU', '2022-07-17 15:57:58', 1),
	(4, 3, '2022-06-16 17:58:24', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjozLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpY0BnbWFpbC5jb20iLCJleHBwcGlyZXMiOjE2NTgwNzM1MDQuNzU1LCJpcCI6Ijo6MSIsInVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMi4wLjUwMDUuMTI1IFNhZmFyaS81MzcuMzYiLCJpYXQiOjE2NTUzOTUxMDR9.1lqpD3FbZpKxcqSQnHTn-GtiqT9ZXyh7rfOSCTM53K8', '2022-07-17 15:58:24', 1),
	(5, 3, '2022-06-16 18:14:02', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjozLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpY0BnbWFpbC5jb20iLCJleHBwcGlyZXMiOjE2NTgwNzQ0NDIuMjUsImlwIjoiOjoxIiwidWEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTAyLjAuNTAwNS4xMjUgU2FmYXJpLzUzNy4zNiIsImlhdCI6MTY1NTM5NjA0Mn0.6dVSETSvOwtMVEzR4PUYcxkupuMOmSnycThnaYiChUM', '2022-07-17 16:14:02', 1),
	(6, 3, '2022-06-16 18:18:02', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjozLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpY0BnbWFpbC5jb20iLCJleHBwcGlyZXMiOjE2NTgwNzQ2ODIuNjQsImlwIjoiOjoxIiwidWEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTAyLjAuNTAwNS4xMjUgU2FmYXJpLzUzNy4zNiIsImlhdCI6MTY1NTM5NjI4Mn0.O7uMbVbL7Wjf3BVDf632HoesPHaENlTMvPmfz9CBSWM', '2022-07-17 16:18:02', 1),
	(7, 3, '2022-06-16 18:18:45', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjozLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpY0BnbWFpbC5jb20iLCJleHBwcGlyZXMiOjE2NTgwNzQ3MjUuNzgxLCJpcCI6Ijo6MSIsInVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMi4wLjUwMDUuMTI1IFNhZmFyaS81MzcuMzYiLCJpYXQiOjE2NTUzOTYzMjV9.3eXafVFY7Qu9cMjY-IYWFtRKEabaWLgrRk6RXrGx960', '2022-07-17 16:18:45', 1),
	(8, 3, '2022-06-16 19:50:53', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjozLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpY0BnbWFpbC5jb20iLCJleHBwcGlyZXMiOjE2NTgwODAyNTMuMTQ2LCJpcCI6Ijo6MSIsInVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMi4wLjUwMDUuMTI1IFNhZmFyaS81MzcuMzYiLCJpYXQiOjE2NTU0MDE4NTN9.QXehBMuVkAeV81V6nDWXno1-1geA4U8eP_A7sIVzaE0', '2022-07-17 17:50:53', 1),
	(9, 1, '2022-06-16 20:48:06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjoxLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpYzgxQGdtYWlsLmNvbSIsImV4cHBwaXJlcyI6MTY1ODA4MzY4Ni4zMDUsImlwIjoiOjoxIiwidWEiOiJQb3N0bWFuUnVudGltZS83LjI5LjAiLCJpYXQiOjE2NTU0MDUyODZ9.U5K7m2piWADuPdyj3sGspyesXTX53WqcpvnAk6OG27g', '2022-07-17 18:48:06', 1),
	(10, 3, '2022-06-16 20:48:46', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjozLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpY0BnbWFpbC5jb20iLCJleHBwcGlyZXMiOjE2NTgwODM3MjYuMzM1LCJpcCI6Ijo6MSIsInVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMi4wLjUwMDUuMTI1IFNhZmFyaS81MzcuMzYiLCJpYXQiOjE2NTU0MDUzMjZ9.fgtscMRVA3vv2JrGZY2mesXAekMZyffT9iNzE4DHJTo', '2022-07-17 18:48:46', 1),
	(11, 3, '2022-06-16 20:51:06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjozLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpY0BnbWFpbC5jb20iLCJleHBwcGlyZXMiOjE2NTgwODM4NjYuMzI2LCJpcCI6Ijo6MSIsInVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMi4wLjUwMDUuMTI1IFNhZmFyaS81MzcuMzYiLCJpYXQiOjE2NTU0MDU0NjZ9.V_yS4uj1rV0aHmnuq4xjdxtsYQGDgmThwswl9A4v4Cc', '2022-07-17 18:51:06', 1),
	(12, 3, '2022-06-16 21:36:25', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjozLCJ1c2VybmFtZSI6InNsb2JvZGFuLnNrYXJpY0BnbWFpbC5jb20iLCJleHBwcGlyZXMiOjE2NTgwODY1ODUuMTM4LCJpcCI6Ijo6MSIsInVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMi4wLjUwMDUuMTI1IFNhZmFyaS81MzcuMzYiLCJpYXQiOjE2NTU0MDgxODV9.V5tPeQhtrHfS2SM6RPDRyYrOzN_fozV1RUebK5EXEE4', '2022-07-17 19:36:25', 1);
/*!40000 ALTER TABLE `user_token` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
