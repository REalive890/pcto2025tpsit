
-- Creazione del database
CREATE DATABASE IF NOT EXISTS pcto_videogiochi DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE pcto_videogiochi;

-- Tabella utenti
CREATE TABLE utenti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    ruolo ENUM('user', 'admin') DEFAULT 'user',
    data_registrazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella giochi
CREATE TABLE giochi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titolo VARCHAR(255) NOT NULL,
    piattaforma VARCHAR(100) NOT NULL,
    genere VARCHAR(100) NOT NULL,
    immagine VARCHAR(255),
    data_inserimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella recensioni
CREATE TABLE recensioni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utente INT NOT NULL,
    id_gioco INT NOT NULL,
    voto TINYINT CHECK (voto BETWEEN 1 AND 10),
    commento TEXT,
    data_recensione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE,
    FOREIGN KEY (id_gioco) REFERENCES giochi(id) ON DELETE CASCADE
);

-- Inserimento utenti di esempio (password hash fittizi)
INSERT INTO utenti (email, username, password_hash, ruolo) VALUES
('admin@example.com', 'admin', '$2y$10$hashfintoAdmin1234567890', 'admin'),
('utente1@example.com', 'utente1', '$2y$10$hashfintoUtente123456', 'user'),
('utente2@example.com', 'utente2', '$2y$10$hashfintoUtente234567', 'user');

-- Inserimento giochi di esempio
INSERT INTO giochi (titolo, piattaforma, genere, immagine) VALUES
('The Legend of Zelda: Breath of the Wild', 'Nintendo Switch', 'Avventura', 'zelda.jpg'),
('God of War', 'PlayStation 4', 'Azione', 'gow.jpg'),
('Minecraft', 'PC', 'Sandbox', 'minecraft.jpg');

-- Inserimento recensioni di esempio
INSERT INTO recensioni (id_utente, id_gioco, voto, commento) VALUES
(2, 1, 9, 'Un capolavoro assoluto, libertà totale e atmosfera incredibile.'),
(3, 2, 8, 'Grafica fantastica e combattimenti epici, ma un po’ ripetitivo.');
