import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const dbPath =
    path.resolve(
        __dirname,
        'data01.db'
    );

const db = new sqlite3.Database(
    dbPath,
    (err) => {

        if (err) {

            console.error(
                'Erro ao conectar:',
                err.message
            );

            return;
        }

        console.log(
            'Banco conectado'
        );

        db.configure(
            'busyTimeout',
            10000
        );

        db.serialize(() => {

            db.run(
                'PRAGMA journal_mode=WAL'
            );

            db.run(
                'PRAGMA synchronous=NORMAL'
            );

            db.run(
                'PRAGMA foreign_keys=ON'
            );
        });
    }
);

export default db;