-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2022 at 06:36 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clontagram`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--

/*INSERT INTO `comments` (`id`, `content`, `createdAt`, `updatedAt`, `userId`, `imageId`) VALUES
(1, 'Guau que hermosa foto', '2022-04-21 15:14:00', '0000-00-00 00:00:00', 2, 1),
(2, 'verdad que si.', '2022-04-21 15:14:00', '0000-00-00 00:00:00', 1, 1),
(4, 'que bien', '2022-04-22 10:26:18', '0000-00-00 00:00:00', 1, 4),
(7, 'test de desarrollo', '2022-04-26 10:55:07', '2022-04-26 10:55:07', 1, 11),
(8, 'wip.', '2022-04-26 10:57:19', '2022-04-26 10:57:19', 2, 13),
(9, 'que lindo pinguino', '2022-04-26 11:42:36', '2022-04-26 11:42:36', 1, 14),
(10, 'guau', '2022-04-28 08:46:50', '2022-04-28 08:46:50', 1, 5);*/

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `images`
--

/*INSERT INTO `images` (`id`, `imagePath`, `description`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, 'http://[::1]:3000/uploads/images/image_path-1650571062128-978585088.jpeg', 'mi primera sesion de fotografia de paisajes', '2022-04-21 15:14:00', '0000-00-00 00:00:00', 1),
(3, 'http://[::1]:3000/uploads/images/image_path-1650578088792-273106544.jpeg', 'Vacaciones en Alaska con los abuelos', '2022-04-21 15:14:00', '0000-00-00 00:00:00', 1),
(4, 'http://[::1]:3000/uploads/images/image_path-1650637270378-430937362.png', 'aprendiendo golang', '2022-04-22 10:21:10', '0000-00-00 00:00:00', 1),
(5, 'http://[::1]:3000/uploads/images/image_path-1651150199727-71735701.jpeg', 'foto de un colibri en mi jardin', '2022-04-24 17:06:35', '2022-04-28 08:59:00', 1),
(7, 'http://[::1]:3000/uploads/images/image_path-1650834915140-49965024.png', 'logo de perfil', '2022-04-24 17:15:15', '0000-00-00 00:00:00', 1),
(8, 'http://[::1]:3000/uploads/images/image_path-1650940957700-99533861.png', 'desarrollo productos app', '2022-04-25 22:42:37', '0000-00-00 00:00:00', 2),
(13, 'http://[::1]:3000/uploads/images/image_path-1650985019738-111044795.png', 'Trabajando en mi proximo proyecto', '2022-04-26 10:56:59', '2022-04-28 08:53:00', 2);*/

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `likes`
--

/*INSERT INTO `likes` (`id`, `createdAt`, `updatedAt`, `userId`, `imageId`) VALUES
(28, '2022-04-23 15:19:47', '0000-00-00 00:00:00', 2, 1),
(30, '2022-04-23 18:45:56', '0000-00-00 00:00:00', 1, 1),
(45, '2022-04-24 09:15:14', '0000-00-00 00:00:00', 1, 3),
(46, '2022-04-24 09:16:33', '0000-00-00 00:00:00', 2, 4),
(48, '2022-04-24 17:07:53', '0000-00-00 00:00:00', 2, 5),
(49, '2022-04-24 17:15:31', '0000-00-00 00:00:00', 1, 7),
(50, '2022-04-24 17:15:44', '0000-00-00 00:00:00', 2, 7),
(53, '2022-04-25 22:42:45', '0000-00-00 00:00:00', 2, 8),
(54, '2022-04-25 22:42:58', '0000-00-00 00:00:00', 1, 8),
(58, '2022-04-26 10:57:10', '2022-04-26 10:57:10', 2, 13),
(59, '2022-04-26 10:58:12', '2022-04-26 10:58:12', 1, 13),
(61, '2022-04-28 08:50:09', '2022-04-28 08:50:09', 1, 5);
*/
-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `name` varchar(100) NOT NULL,
  `surname` varchar(200) NOT NULL,
  `nick` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `rememberToken` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

/*INSERT INTO `users` (`id`, `role`, `name`, `surname`, `nick`, `email`, `password`, `image`, `createdAt`, `updatedAt`, `rememberToken`) VALUES
(1, 'user', 'Gabriel', 'Martinez', 'gabmart1995', 'gabmart1995@gmail.com', '$2a$04$L2o/Wk7aTgXJL7xAfmnp0OytRrKpgr3BNYsC179NnDJ2yIgDehxxW', 'http://[::1]:3000/uploads/users/image_path-1650571036820-338207819.png', '2022-04-21 15:14:00', '2022-04-28 10:02:00', ''),
(2, 'user', 'Alfonso', 'Martinez', 'martalf1987', 'martalf1987@gmail.com', '$2a$04$Gi/SO5TFsZE6fBXgsbV0x.A0XsPygPfvWYDT1XkOlhxf0TO5cmjve', 'http://[::1]:3000/uploads/users/image_path-1650577163177-454061274.jpeg', '2022-04-21 15:14:00', '2022-04-21 17:19:00', ''),
(3, 'user', 'Pedro', 'Sanchez', 'p_sanchez17', 'pedro_sanchez17@gmail.com', '$2a$04$4y0MsX/sHU3naP8LeZ/hmu4f69ALsohdHRMpnF1nwC1zh7yqpiCrC', '', '2022-04-28 11:01:24', '2022-04-28 11:01:24', '');*/

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_cfd8e81fac09d7339a32e57d904` (`userId`),
  ADD KEY `FK_d2361de1b2474386782a4031731` (`imageId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick-unique` (`nick`),
  ADD UNIQUE KEY `email-unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
/*ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
*/
--
-- Constraints for dumped tables
--

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `FK_cfd8e81fac09d7339a32e57d904` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d2361de1b2474386782a4031731` FOREIGN KEY (`imageId`) REFERENCES `images` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
