const { sqllogin, tablePrefix } = require('./config');
const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool(sqllogin);
pool.query = util.promisify(pool.query);

const tableQuery = `
  CREATE TABLE IF NOT EXISTS Roll (
    ID int NOT NULL AUTO_INCREMENT,
    Nimetus varchar(20) NOT NULL,
    PRIMARY KEY (ID)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  CREATE TABLE IF NOT EXISTS Kasutaja (
    ID int NOT NULL AUTO_INCREMENT,
    Email varchar(50) NOT NULL,
    Password varchar(100) NOT NULL,
    RollID int NOT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT FK_Kasutaja_RollID FOREIGN KEY (RollID) REFERENCES Roll (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  CREATE TABLE IF NOT EXISTS Koht (
    ID int NOT NULL AUTO_INCREMENT,
    Nimi varchar(50) NOT NULL,
    PRIMARY KEY (ID)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  CREATE TABLE IF NOT EXISTS Kursus (
    ID int NOT NULL AUTO_INCREMENT,
    Nimi varchar(50) NOT NULL,
    Kood varchar(50) NOT NULL,
    Number int NOT NULL,
    PRIMARY KEY (ID)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  
  CREATE TABLE IF NOT EXISTS Õppejõud (
    ID int NOT NULL AUTO_INCREMENT,
    Nimi varchar(50) NOT NULL,
    PRIMARY KEY (ID)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  CREATE TABLE IF NOT EXISTS Õppeaine (
    ID int NOT NULL AUTO_INCREMENT,
    Nimi varchar(50) NOT NULL,
    Kood varchar(50) NOT NULL,
    Maht int DEFAULT NULL,
    ÕppejõudID int DEFAULT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT FK_Õppeaine_ÕppejõudID FOREIGN KEY (ÕppejõudID) REFERENCES Õppejõud (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  CREATE TABLE IF NOT EXISTS Loeng (
    ID int NOT NULL AUTO_INCREMENT,
    Kommentaar varchar(250) DEFAULT NULL,
    Kuupäev date NOT NULL,
    Algusaeg time NOT NULL,
    Lõppaeg time NOT NULL,
    ÕppeaineID int NOT NULL,
    KohtID int DEFAULT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT FK_Loeng_KohtID FOREIGN KEY (KohtID) REFERENCES Koht (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK_Loeng_ÕppeaineID FOREIGN KEY (ÕppeaineID) REFERENCES Õppeaine (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  CREATE TABLE IF NOT EXISTS Kursus_Õppeained (
    KursusID int NOT NULL,
    ÕppeaineID int NOT NULL,
    PRIMARY KEY (KursusID, ÕppeaineID),
    CONSTRAINT FK_Kursus_Õppeained_KursusID FOREIGN KEY (KursusID) REFERENCES Kursus (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK_Kursus_Õppeained_ÕppeaineID FOREIGN KEY (ÕppeaineID) REFERENCES Õppeaine (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`;

(async function attemptConnection() {
  try {
    await pool.query(tableQuery);

    const result = await pool.query(`SELECT id FROM Roll WHERE Nimetus = 'Admin'`);
    if (result[0].id !== 1) pool.query(`INSERT INTO Roll (id, Nimetus) VALUES (1, 'Admin'), (2, 'Tavakasutaja');`);
  }
  catch(error) {
    console.log(error);
    setTimeout(attemptConnection, 2000);
  }
})();

exports.SQLPool = pool;

exports.getTabeliNimi = function(tabeliNimi) {
  return tablePrefix + tabeliNimi;
}