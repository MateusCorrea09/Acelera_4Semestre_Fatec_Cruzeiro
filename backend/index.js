import express from 'express';
import cors from 'cors';
import db from './date/db.js';

const app = express();
app.use(cors());
app.use(express.json());


app.get('/alunos', (req, res) => {
  
    const sql = `
    SELECT 
        U.IDUSUARIO as id, 
        U.NOME as nome, 
        R.NOTAFINAL as nota,
        R.ACERTOS as acertos, -- AGORA ESSA COLUNA EXISTE NO BANCO!
        Q.TITULO as nome_quiz,
        '101' as sala 
    FROM USUARIO U
    INNER JOIN resultados R ON U.IDUSUARIO = R.IDALUNO_FK
    INNER JOIN QUIZ Q ON R.IDQUIZ_FK = Q.IDQUIZ_PK
    WHERE Q.IDQUIZ_PK = 1 
    ORDER BY U.NOME ASC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Erro no SQL:", err.message);
            return res.status(500).json({ error: err.message });
        }

        const dataParaReact = rows.map(aluno => ({
            ...aluno,
            nota: aluno.nota,
            acertos: aluno.acertos || 0,
            desempenho: aluno.nota >= 8 ? "Excelente" : aluno.nota >= 6 ? "Bom" : "Pendente"
        }));

        res.json(dataParaReact);
    });
});

app.post('/login', (req, res) => {
    const { email } = req.body;

    const sql = `
        SELECT IDUSUARIO, NOME, TIPOUSUARIO 
        FROM USUARIO 
        WHERE EMAIL = ?`;

    db.get(sql, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        if (user) {
            res.json({
                success: true,
                id: user.IDUSUARIO,
                nome: user.NOME,
                tipo: user.TIPOUSUARIO
            });
        } else {
            res.status(401).json({ success: false, message: "Usuário não encontrado" });
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`
    🚀 Servidor Backend rodando!
    🔗 Alunos: http://localhost:${PORT}/alunos
    📂 Banco: data01.db
    `);
});