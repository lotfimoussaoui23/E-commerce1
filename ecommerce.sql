-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le : Sam 22 Août 2026 à 11:10
-- Version du serveur: 5.5.16
-- Version de PHP: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `ecommerce`
--

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wilaya` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresse` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code_postal` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=12 ;

--
-- Contenu de la table `clients`
--

INSERT INTO `clients` (`id`, `prenom`, `nom`, `telephone`, `wilaya`, `ville`, `adresse`, `email`, `code_postal`) VALUES
(1, 'lotfi', 'moussaoui', '0667438619', 'Annaba', 'annaba', 'magestic', 'lotfimoussaoui@yahoo.fr', '23000'),
(2, 'lotfi', 'moussaoui', '0667438619', 'Annaba', 'annaba', 'magestic', 'lotfimoussaoui@yahoo.fr', '23000'),
(3, 'sobhi', 'dekkar', '09999999', 'Adrar', 'adrar', 'adrar', '', '01000'),
(4, 'omar', 'belaid', '08888888', 'Alger', 'alger', 'ALGER', '', '16000'),
(5, 'lot', 'mouss', '09999999', 'Alger', 'alger', 'alger', '', '16000'),
(6, 'omar', 'belaid', '09999999', 'Batna', 'batna', 'batna', '', '05000'),
(7, 'fethi', 'kadour', '09999999', 'Béjaïa', 'bejaia', 'bejaia', '', '15000'),
(8, 'meriem', 'ferro', '099999999', 'Blida', 'blida', 'blida', '', '14000'),
(9, 'lo', 'lo', '0888888888', 'Adrar', 'adrar', 'adrar', '', ''),
(10, 'lof', 'mou', '08888888', 'Bordj Bou Arreridj', 'bourdj', 'bordj', '', ''),
(11, 'LOFTI', 'LOFTI', '09090909', 'Constantine', 'CONSTANTINE', 'CONST', '', '25000');

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

CREATE TABLE IF NOT EXISTS `commandes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `statut` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'Nouvelle',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `stock_deduit` tinyint(1) NOT NULL DEFAULT '0',
  `date_commande` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_validation` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=11 ;

--
-- Contenu de la table `commandes`
--

INSERT INTO `commandes` (`id`, `client_id`, `total`, `statut`, `notes`, `stock_deduit`, `date_commande`, `date_validation`) VALUES
(1, 2, '137300.00', 'Livrée', '', 1, '2026-08-17 12:20:00', NULL),
(2, 3, '40000.00', 'Livrée', '', 1, '2026-08-19 11:56:22', NULL),
(3, 4, '1800.00', 'Livrée', '', 1, '2026-08-19 11:56:22', NULL),
(4, 5, '5500.00', 'Livrée', '', 1, '2026-08-19 11:56:22', NULL),
(5, 6, '5500.00', 'Livrée', '', 1, '2026-08-19 12:20:00', NULL),
(6, 7, '3600.00', 'Livrée', '', 1, '2026-08-19 19:31:40', NULL),
(7, 8, '45000.00', 'Livrée', '', 1, '2026-08-19 19:36:08', '2026-08-19 20:36:08'),
(8, 9, '2500.00', 'Livrée', '', 1, '2026-08-19 20:02:50', '2026-08-19 21:02:50'),
(9, 10, '2500.00', 'Livrée', '', 1, '2026-08-19 20:08:02', '2026-08-19 21:08:02'),
(10, 11, '16500.00', 'Livrée', '', 1, '2026-08-20 09:34:30', '2026-08-20 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `commande_details`
--

CREATE TABLE IF NOT EXISTS `commande_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commande_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix_unitaire` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `commande_id` (`commande_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=15 ;

--
-- Contenu de la table `commande_details`
--

INSERT INTO `commande_details` (`id`, `commande_id`, `produit_id`, `quantite`, `prix_unitaire`) VALUES
(1, 1, 4, 1, '1800.00'),
(2, 1, 3, 1, '92000.00'),
(3, 1, 1, 1, '3500.00'),
(4, 1, 5, 1, '40000.00'),
(5, 2, 5, 1, '40000.00'),
(6, 3, 4, 1, '1800.00'),
(7, 4, 1, 1, '5500.00'),
(8, 5, 1, 1, '5500.00'),
(9, 6, 4, 2, '1800.00'),
(10, 7, 5, 1, '40000.00'),
(11, 7, 6, 2, '2500.00'),
(12, 8, 6, 1, '2500.00'),
(13, 9, 6, 1, '2500.00'),
(14, 10, 1, 3, '5500.00');

-- --------------------------------------------------------

--
-- Structure de la table `produits`
--

CREATE TABLE IF NOT EXISTS `produits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `prix` decimal(10,2) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int(11) DEFAULT '0',
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=7 ;

--
-- Contenu de la table `produits`
--

INSERT INTO `produits` (`id`, `nom`, `description`, `prix`, `image`, `stock`, `date_creation`) VALUES
(1, 'Clavier souris sans fil', 'Clavier et sans fil Havit KB221WB', '5500.00', 'images/clavier.png', 5, '2026-08-12 12:53:10'),
(2, 'PC HP', 'HP Spectre 13-v001nf\r\nRéférence : LS-13042\r\nUltraportable \r\nconstructeur - HP Spectre 13-v001nf Intel Core i7-6500U 2,5GHz 8Go 512Go SSD 13,3" Windows 10', '85000.00', 'images/pc-hp.png', 5, '2026-08-12 12:53:10'),
(3, 'PC Dell', 'Ordinateur portable Dell', '92000.00', 'images/pc-dell.png', 2, '2026-08-12 12:53:10'),
(4, 'Souris', 'Souris sans fil', '1800.00', 'images/souris.png', 18, '2026-08-12 12:53:10'),
(5, 'Imprimante Canon', 'IMPRIMANTE WIFI Multi fonctions CANON', '40000.00', '\\images\\canon.png', 4, '2026-08-12 16:52:51'),
(6, 'Fash disq', 'Flash Disque SanDisk 1000Gb (1Tb) Uv150 Usb 3.2 Auv150-128G-Rbk', '2500.00', 'images/flash1tb.png', 11, '2026-08-15 16:28:13');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `commandes_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`);

--
-- Contraintes pour la table `commande_details`
--
ALTER TABLE `commande_details`
  ADD CONSTRAINT `commande_details_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
