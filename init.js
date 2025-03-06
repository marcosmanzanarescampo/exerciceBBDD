// utils/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

/**
 * Ouvre une connexion à la base de données SQLite.
 * @returns {Promise<import('sqlite').Database>} Instance de la base de données.
*/
async function initDb() {
    try {
        
        // 1. Open base de données
        const db = await open({
            filename: "./bibliotheque.db",
            driver: sqlite3.Database,
        });
        
        await db.exec("PRAGMA foreign_keys = ON;");

        // 2. Creation of tables
        await createTables(db);

        // 3. Polulation of tables
        await populeTables(db);  

        return db;
    } catch (error) {
        throw new Error("Failed to open database");
    }
 };


 async function ManageDb(db) {
    try {

        // A faire...

    } catch (error) {
        throw new Error("Failed to open database");
    }
 };

 async function closeDB(db){
    db.close((err) => {
        if (err) {
            console.error("Erreur lors de la fermeture de la base de données : ", err.message);
        } else {
            console.log("Base de données fermée avec succès.");
        }
    });
 }

/**
 * Initialise la structure de la base de données.
 * @param {import('sqlite').Database} db - Instance de la base de données.
 */
async function createTables(db) {
    try {
        console.log('1. Creating tables...');
        
        // création de la table LIVRE
        await db.run(`CREATE TABLE IF NOT EXISTS livre (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre VARCHAR(100) NOT NULL,
            ISBN VARCHAR(17) UNIQUE NOT NULL,
            annee_Publication INTEGER,
            nb_Pages INTEGER,
            editeur INTEGER NOT NULL,
            FOREIGN KEY (editeur) REFERENCES editeur(id))`);
        console.log('table  livre created.'); 
        // création de la table AUTEUR
        await db.run(`
            CREATE TABLE IF NOT EXISTS auteur (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom varchar(100) NOT NULL,
            prenom varchar(17) NOT NULL,
            date_naissance DATE,
            nationalite INTEGER NOT NULL,
            FOREIGN KEY (nationalite) REFERENCES nationalite(id)
            )
        `);
        console.log('table  auteur created.');    
        // création de la table LIVRE-AUTEUR
        await db.run(`
            CREATE TABLE IF NOT EXISTS livre_auteur (
            livre INTEGER,
            auteur INTEGER,
            PRIMARY KEY (livre, auteur),
            FOREIGN KEY (livre) REFERENCES livre(id),
            FOREIGN KEY (auteur) REFERENCES auteur(id)            
            )
        `);
        console.log('table  livre_auteur created.');   
        // création de la table EDITEUR
        await db.run(`
            CREATE TABLE IF NOT EXISTS editeur (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            editeur varchar(100) UNIQUE NOT NULL
            )
        `);
        console.log('table  editeur created.');    
        // création de la table CATEGORIE
        await db.run(`
            CREATE TABLE IF NOT EXISTS categorie (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            categorie varchar(100) NOT NULL
            )
        `);
        console.log('table categorie created.');  
        // création de la table livre-categorie
        await db.run(`
            CREATE TABLE IF NOT EXISTS livre_categorie (
            livre INTEGER,
            categorie INTEGER,
            PRIMARY KEY (livre, categorie),
            FOREIGN KEY (livre) REFERENCES livre(id),
            FOREIGN KEY (categorie) REFERENCES categorie(id)
            )
        `);
        console.log('table  livre-categorie created.');  
      // création de la table nationalite        
        await db.run(`
            CREATE TABLE IF NOT EXISTS nationalite (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pays varchar(100) NOT NULL
            )
        `);
        console.log('table  nationalite created.'); 

        // création de la table etat
        await db.run(`
            CREATE TABLE IF NOT EXISTS etat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                etat varchar(50)
              )
        `);
        console.log('table  exemplaire created.');      
        // création de la table exemplaire        
        await db.run(`
            CREATE TABLE IF NOT EXISTS exemplaire (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                livre INTEGER NOT NULL,
                etat INTEGER,
                FOREIGN KEY (livre) REFERENCES livre(id),
                FOREIGN KEY (etat) REFERENCES etat(id),
              )
        `);
        console.log('table  exemplaire created.'); 
        // création de la table membre        
        await db.run(`
            CREATE TABLE IF NOT EXISTS membre (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom varchar(50),
            prenom varchar(50),
            mail varchar(100) UNIQUE,
            telephone varchar(10),
            date_inscription DATE NOT NULL DEFAULT (now())
            )
        `);
        console.log('table  membre created.');
        await db.run(`
            CREATE TABLE IF NOT EXISTS emprunt (
                date_emprunt DATE NOT NULL DEFAULT (now()),
                exemplaire INTEGER,
                membre INTEGER,
                date_retour_prevue DATE NOT NULL,
                date_retour_effective DATE,
                PRIMARY KEY (date_emprunt, exemplaire, membre),
                FOREIGN KEY (exemplaire) REFERENCES exemplaire(id),
                FOREIGN KEY (membre) REFERENCES membre(id)
              )
        `);
        console.log('table  emprunt created.');
 
    } catch (error) {
        throw new Error("Failed to initialize database");
    }
};

export async function populeTables(db) {
    try {
        console.log('2. Populating tables...');

        // population de la table editeur
        // supprimer les données et réinitialiser l'id 
        await db.run("DELETE FROM editeur");
        await db.run(`DELETE FROM sqlite_sequence WHERE name='editeur'`);
        await db.run(`INSERT INTO editeur (editeur) VALUES
            ('Grasset'),
            ('Gallimard'),
            ('Flammarion'),
            ('Albin Michel'),
            ('Robert Laffont'),
            ('Livre de Poche'),
            ('Denoël'),
            ('Actes Sud'),
            ('Pocket'),
            ('Hachette'),
            ('Anaya')          
        `);
        console.log('table editeur populated.'); 

        // population de la table nationalite
        await db.run("DELETE FROM nationalite");
        await db.run(`DELETE FROM sqlite_sequence WHERE name='nationalite'`);
        await db.run(`INSERT INTO nationalite (pays) VALUES
        ('France'),
        ('Royaume-Uni'),
        ('États-Unis')`
        );
        console.log('table nationalite populated.');

        // population de la table categorie
        await db.run("DELETE FROM categorie");
        await db.run(`DELETE FROM sqlite_sequence WHERE name='categorie'`);
        await db.run(`INSERT INTO categorie (categorie) VALUES
        ('Science Fiction'),
        ('Fantasy'),
        ('Romance'),
        ('Policier'),
        ('Historique'),
        ('Biographie'),
        ('Aventure'),
        ('Essais'),
        ('Thriller'),
        ('Horreur'),
        ('Philosophie'),
        ('Littérature classique'),
        ('Poésie'),
        ('Jeunesse'),
        ('Comédie')`
        );
        console.log('table categorie populated.');

        // population de la table membre
        await db.run("DELETE FROM membre");
        await db.run(`DELETE FROM sqlite_sequence WHERE name='membre'`);
        await db.run(`INSERT INTO membre (nom, prenom, mail, telephone, date_inscription) VALUES
        ('Dupont', 'Pierre', 'pierre.dupont@example.com', '0601020304', '2025-03-06'),
        ('Martin', 'Sophie', 'sophie.martin@example.com', '0612345678', '2025-03-01'),
        ('Lemoine', 'Julien', 'julien.lemoine@example.com', '0623456789', '2025-02-15'),
        ('Benoit', 'Claire', 'claire.benoit@example.com', '0634567890', '2025-01-20'),
        ('Robert', 'Lucas', 'lucas.robert@example.com', '0645678901', '2025-03-05'),
        ('Leclerc', 'Amélie', 'amelie.leclerc@example.com', '0656789012', '2025-02-10'),
        ('Giraud', 'Nathalie', 'nathalie.giraud@example.com', '0667890123', '2025-01-30'),
        ('Lambert', 'Marc', 'marc.lambert@example.com', '0678901234', '2025-03-03'),
        ('Petit', 'Charlotte', 'charlotte.petit@example.com', '0689012345', '2025-02-25'),
        ('Blanc', 'Antoine', 'antoine.blanc@example.com', '0690123456', '2025-01-10')`
        );
        console.log('table membre populated.');

        // population de la table livre_auteur
        await db.run("DELETE FROM livre_auteur");
        await db.run(`DELETE FROM sqlite_sequence WHERE name='livre_auteur'`);
        await db.run(`INSERT INTO livre_auteur (livre, auteur) VALUES
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
        (6, 6),
        (7, 7),
        (8, 8),
        (9, 9),
        (10, 10)`
        );
        console.log('table livre_auteur populated.');

        // population de la table livre_auteur
        await db.run("DELETE FROM livre_categorie");
        await db.run(`DELETE FROM sqlite_sequence WHERE name='livre_categorie'`);
        await db.run(`INSERT INTO livre_categorie (livre, categorie) VALUES
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
        (6, 6),
        (7, 7),
        (8, 8),
        (9, 9),
        (10, 10)`
        );
        console.log('table livre_categorie populated.');


        // population de la table etat
        await db.run("DELETE FROM etat");
        await db.run(`DELETE FROM sqlite_sequence WHERE name='etat'`);
        await db.run(`INSERT INTO exemplaire (livre, etat) VALUES
        (1, 'Bon état'),
        (2, 'Usé'),         
        (3, 'Très bon état'),
        (3, 'Moyen'),      
        (5, 'Neuf'),       
        (6, 'Bon état'),    
        (1, 'Très usé'),   
        (8, 'Bon état'),    
        (9, 'Usé'),         
        (10, 'Très bon état'); 
        );
        console.log('table livre_auteur populated.');


        // population de la table livre_auteur
        await db.run("DELETE FROM exemplaire");
        await db.run(`DELETE FROM sqlite_sequence WHERE name='exemplaire'`);
        await db.run(`INSERT INTO exemplaire (livre, etat) VALUES
        (1, 'Bon état'),    -- Exemplaire du livre avec id=1 ("1984") en bon état
        (2, 'Usé'),         -- Exemplaire du livre avec id=2 ("Les Misérables") usé
        (3, 'Très bon état'), -- Exemplaire du livre avec id=3 ("Le Seigneur des Anneaux") en très bon état
        (4, 'Moyen'),       -- Exemplaire du livre avec id=4 ("Voyage au centre de la Terre") en état moyen
        (5, 'Neuf'),        -- Exemplaire du livre avec id=5 ("Orgueil et Préjugés") neuf
        (6, 'Bon état'),    -- Exemplaire du livre avec id=6 ("L'Attrape-cœurs") en bon état
        (7, 'Très usé'),    -- Exemplaire du livre avec id=7 ("La Peste") très usé
        (8, 'Bon état'),    -- Exemplaire du livre avec id=8 ("Le Grand Gatsby") en bon état
        (9, 'Usé'),         -- Exemplaire du livre avec id=9 ("Sherlock Holmes") usé
        (10, 'Très bon état'); -- Exemplaire du livre avec id=10 ("Ernest Hemingway") en très bon état`
        );
        console.log('table livre_auteur populated.');

        


        // population de la table livre
        // await db.run(`DELETE FROM sqlite_sequence WHERE name='livre'`);
        // await db.run(`INSERT INTO livre (titre, ISBN, annee_Publication, nb_Pages, editeur) VALUES
            // ('1984', '9780451524935', 1949, 328, 2),
            // ('Le Petit Prince', '9782070612758', 1943, 96, 3),
            // ('Harry Potter à l\'école des sorciers', '9782070584628', 1997, 320, 4),
            // ('La Nuit des temps', '9782253006329', 1968, 438, 5),
            // ('Les Misérables', '9782080700921', 1862, 1488, 6),
            // ('Fondation', '9782070360533', 1951, 432, 7),
            // ('L\'Étranger', '9782070360021', 1942, 184, 8),
            // ('Da Vinci Code', '9780307474278', 2003, 689, 9),
            // ('Le Seigneur des Anneaux', '9782266121021', 1954, 1137, 10)`
            //);
        // console.log('table livre populated.');

    } catch (error) {
        throw new Error("Failed to open database");
    }
}

initDb();
// manageDB(db);
// closeDB(db);