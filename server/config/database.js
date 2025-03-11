const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function createDatabaseIfNotExists() {
  try {
    // Connexion sans spécifier de base de données
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('🔍 Vérification de la base de données...');
    
    // Créer la base de données si elle n'existe pas
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    
    console.log(`✅ Base de données '${process.env.DB_NAME}' prête`);
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur lors de la création de la base de données:', error);
    throw error;
  }
}

// Initialiser Sequelize avec la connexion à la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = { 
  sequelize,
  createDatabaseIfNotExists
};