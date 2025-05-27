-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 28, 2025 at 12:01 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pcto_videogiochi`
--

-- --------------------------------------------------------

--
-- Table structure for table `giochi`
--

CREATE TABLE `giochi` (
  `id` int(11) NOT NULL,
  `titolo` varchar(255) NOT NULL,
  `piattaforma` varchar(100) NOT NULL,
  `genere` varchar(100) NOT NULL,
  `immagine` varchar(255) DEFAULT NULL,
  `data_inserimento` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `giochi`
--

INSERT INTO `giochi` (`id`, `titolo`, `piattaforma`, `genere`, `immagine`, `data_inserimento`) VALUES
(1, 'The Legend of Zelda: Breath of the Wild', 'Nintendo Switch', 'Avventura', 'zelda.jpg', '2025-05-23 14:25:11'),
(2, 'God of War', 'PlayStation 4', 'Azione', 'gow.jpg', '2025-05-23 14:25:11'),
(3, 'Minecraft', 'PC', 'Sandbox', 'minecraft.jpg', '2025-05-23 14:25:11');

-- --------------------------------------------------------

--
-- Table structure for table `recensioni`
--

CREATE TABLE `recensioni` (
  `id` int(11) NOT NULL,
  `id_utente` int(11) NOT NULL,
  `id_gioco` int(11) NOT NULL,
  `voto` tinyint(4) DEFAULT NULL CHECK (`voto` between 1 and 10),
  `commento` text DEFAULT NULL,
  `data_recensione` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recensioni`
--

INSERT INTO `recensioni` (`id`, `id_utente`, `id_gioco`, `voto`, `commento`, `data_recensione`) VALUES
(1, 2, 1, 9, 'Un capolavoro assoluto, libertà totale e atmosfera incredibile.', '2025-05-23 14:25:11'),
(2, 3, 2, 8, 'Grafica fantastica e combattimenti epici, ma un po’ ripetitivo.', '2025-05-23 14:25:11'),
(6, 4, 1, 5, 'hi my name is giorgio but my real name is giovanni giorgio', '2025-05-27 21:47:45');

-- --------------------------------------------------------

--
-- Table structure for table `utenti`
--

CREATE TABLE `utenti` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `ruolo` enum('user','admin') DEFAULT 'user',
  `data_registrazione` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utenti`
--

INSERT INTO `utenti` (`id`, `email`, `username`, `password_hash`, `ruolo`, `data_registrazione`) VALUES
(1, 'admin@example.com', 'admin', '$2y$10$hashfintoAdmin1234567890', 'admin', '2025-05-23 14:25:11'),
(2, 'utente1@example.com', 'utente1', '$2y$10$hashfintoUtente123456', 'user', '2025-05-23 14:25:11'),
(3, 'utente2@example.com', 'utente2', '$2y$10$hashfintoUtente234567', 'user', '2025-05-23 14:25:11'),
(4, 'acharig47@gmail.com', 'bye', '$2y$10$Omsfq9ZAJc/RH.p5AK6F1e36vjuv.a06u58b0zJPYrm53xzU5ZBt6', 'user', '2025-05-27 17:56:31'),
(5, 'giona@gmail.come', 'vaivia', '$2y$10$n6KK8eI9znQ0jidy/DrIyeB7Tog3wA1HMVZidlTbX.r1U8cC7E0re', 'user', '2025-05-27 21:53:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `giochi`
--
ALTER TABLE `giochi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recensioni`
--
ALTER TABLE `recensioni`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_utente` (`id_utente`),
  ADD KEY `id_gioco` (`id_gioco`);

--
-- Indexes for table `utenti`
--
ALTER TABLE `utenti`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `giochi`
--
ALTER TABLE `giochi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `recensioni`
--
ALTER TABLE `recensioni`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `utenti`
--
ALTER TABLE `utenti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `recensioni`
--
ALTER TABLE `recensioni`
  ADD CONSTRAINT `recensioni_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utenti` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recensioni_ibfk_2` FOREIGN KEY (`id_gioco`) REFERENCES `giochi` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
