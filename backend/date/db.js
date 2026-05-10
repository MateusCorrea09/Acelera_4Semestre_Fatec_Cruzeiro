import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dbPath = path.resolve(__dirname, 'data01.db'); 

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar no banco:", err.message);
    } else {
        console.log("Banco de dados data01.db conectado com sucesso.");
    }
});

export default db;