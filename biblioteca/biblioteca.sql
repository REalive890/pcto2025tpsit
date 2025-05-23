
DROP DATABASE IF EXISTS biblioteca;
CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE studenti (
  idStudente INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  cognome VARCHAR(100),
  classe VARCHAR(20)
);

CREATE TABLE prestiti (
  idPrestito INT AUTO_INCREMENT PRIMARY KEY,
  idStudente INT,
  titoloLibro VARCHAR(255),
  dataPrestito DATE,
  dataRestituzione DATE,
  restituito BOOLEAN,
  FOREIGN KEY (idStudente) REFERENCES studenti(idStudente)
);

INSERT INTO studenti (nome, cognome, classe) VALUES
('Giulia', 'Rossi', '3A'),
('Luca', 'Bianchi', '4B'),
('Elena', 'Verdi', '5C');

INSERT INTO prestiti (idStudente, titoloLibro, dataPrestito, dataRestituzione, restituito) VALUES
(1, 'Il Piccolo Principe', '2024-03-01', '2024-03-15', 1),
(1, '1984', '2024-04-01', NULL, 0),
(2, 'Harry Potter e la Pietra Filosofale', '2024-03-10', '2024-03-30', 1),
(3, 'Il Nome della Rosa', '2024-04-05', NULL, 0),
(3, 'La Divina Commedia', '2024-04-07', NULL, 0);
