import express from 'express';
import cors from 'cors';
import db from './date/db.js';

const app = express();
app.use(cors());
app.use(express.json());

// =========================================================================
// 1. ROTAS ORIGINAIS (ALUNOS E LOGIN)
// =========================================================================

app.get('/alunos', (req, res) => {
    const sql = `
    SELECT 
        U.IDUSUARIO as id, 
        U.NOME as nome, 
        R.NOTAFINAL as nota,
        R.ACERTOS as acertos,
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

// =========================================================================
// 2. ROTAS DE TURMAS E ESTATÍSTICAS PEDAGÓGICAS
// =========================================================================

app.get('/turmas-professor/:idProfessor', (req, res) => {
    const { idProfessor } = req.params;
    const idNum = parseInt(idProfessor, 10);

    const sql = `
        SELECT 
            IDTURMA as id, 
            NOMETURMA as nome, 
            ANOELETIVO as anoEletivo, 
            SEMESTRE as semestre 
        FROM TURMAS 
        WHERE IDPROFESSOR_FK = CAST(? AS INTEGER)
    `;

    db.all(sql, [idNum], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.get('/turma-stats/:idTurma', (req, res) => {
    const { idTurma } = req.params;

    const sql = `
        SELECT 
            IFNULL(ROUND(AVG(R.NOTAFINAL), 1), 0) || '%' as mediaGeral,
            IFNULL((
                SELECT Q.TITULO 
                FROM resultados RE
                INNER JOIN QUIZ Q ON RE.IDQUIZ_FK = Q.IDQUIZ_PK
                INNER JOIN ALUNOS_TURMA AT ON RE.IDALUNO_FK = AT.IDALUNO_PK_FK
                WHERE AT.IDTURMA_PK_FK = ?
                GROUP BY RE.IDQUIZ_FK
                ORDER BY AVG(RE.NOTAFINAL) ASC
                LIMIT 1
            ), 'Nenhum') as quizMaisDificil,
            (
                SELECT COUNT(DISTINCT RE.IDALUNO_FK) 
                FROM resultados RE
                INNER JOIN ALUNOS_TURMA AT ON RE.IDALUNO_FK = AT.IDALUNO_PK_FK
                WHERE AT.IDTURMA_PK_FK = ?
            ) || '/' || (
                SELECT COUNT(*) 
                FROM ALUNOS_TURMA 
                WHERE IDTURMA_PK_FK = ?
            ) as alunosAtivos
        FROM ALUNOS_TURMA AT
        LEFT JOIN resultados R ON AT.IDALUNO_PK_FK = R.IDALUNO_FK
        WHERE AT.IDTURMA_PK_FK = ?
    `;

    db.get(sql, [idTurma, idTurma, idTurma, idTurma], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row || row.mediaGeral === '0%') {
            return res.json({ mediaGeral: "0%", quizMaisDificil: "---", alunosAtivos: "0/0" });
        }
        res.json(row);
    });
});

app.get('/turma-quizzes/:idTurma', (req, res) => {
    const { idTurma } = req.params;

    const sql = `
        SELECT 
            Q.IDQUIZ_PK as id,      
            Q.TITULO as titulo,     
            'Realizado' as dataConclusao, 
            ROUND(AVG(R.NOTAFINAL) * 10, 0) as mediaAcertos
        FROM resultados R
        INNER JOIN QUIZ Q ON R.IDQUIZ_FK = Q.IDQUIZ_PK
        INNER JOIN ALUNOS_TURMA AT ON R.IDALUNO_FK = AT.IDALUNO_PK_FK
        WHERE AT.IDTURMA_PK_FK = ?
        GROUP BY Q.IDQUIZ_PK, Q.TITULO
    `;

    db.all(sql, [idTurma], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.get('/turma-quiz-detalhes/:idTurma/:idQuiz', (req, res) => {
    const { idTurma, idQuiz } = req.params;

    // Correção nas subqueries para evitar produto cartesiano sem amarração de chaves
    const sqlGeral = `
        SELECT 
            (SELECT P.ENUNCIADO FROM PERGUNTA P 
             INNER JOIN QUIZ_PERGUNTA QP ON P.IDPERGUNTA_PK = QP.IDPERGUNTA_PK_FK
             INNER JOIN resultados R ON R.IDQUIZ_FK = QP.IDQUIZ_PK_FK
             INNER JOIN ALUNOS_TURMA AT ON R.IDALUNO_FK = AT.IDALUNO_PK_FK
             WHERE AT.IDTURMA_PK_FK = ? AND QP.IDQUIZ_PK_FK = ?
             GROUP BY P.IDPERGUNTA_PK ORDER BY AVG(R.NOTAFINAL) DESC LIMIT 1) as perguntaMaisFacil,

            (SELECT P.ENUNCIADO FROM PERGUNTA P 
             INNER JOIN QUIZ_PERGUNTA QP ON P.IDPERGUNTA_PK = QP.IDPERGUNTA_PK_FK
             INNER JOIN resultados R ON R.IDQUIZ_FK = QP.IDQUIZ_PK_FK
             INNER JOIN ALUNOS_TURMA AT ON R.IDALUNO_FK = AT.IDALUNO_PK_FK
             WHERE AT.IDTURMA_PK_FK = ? AND QP.IDQUIZ_PK_FK = ?
             GROUP BY P.IDPERGUNTA_PK ORDER BY AVG(R.NOTAFINAL) ASC LIMIT 1) as perguntaMaisDificil
    `;

    const sqlPerguntas = `
        SELECT 
            P.IDPERGUNTA_PK,
            P.ENUNCIADO as label,
            ROUND(AVG(R.NOTAFINAL) * 10, 0) as percentage
        FROM PERGUNTA P
        INNER JOIN QUIZ_PERGUNTA QP ON P.IDPERGUNTA_PK = QP.IDPERGUNTA_PK_FK
        INNER JOIN resultados R ON QP.IDQUIZ_PK_FK = R.IDQUIZ_FK
        INNER JOIN ALUNOS_TURMA AT ON R.IDALUNO_FK = AT.IDALUNO_PK_FK
        WHERE AT.IDTURMA_PK_FK = ? AND QP.IDQUIZ_PK_FK = ?
        GROUP BY P.IDPERGUNTA_PK
    `;

    db.get(sqlGeral, [idTurma, idQuiz, idTurma, idQuiz], (err, dadosGerais) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(sqlPerguntas, [idTurma, idQuiz], (err, perguntasRows) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                perguntaMaisFacil: dadosGerais?.perguntaMaisFacil || "Dados insuficientes",
                perguntaMaisDificil: dadosGerais?.perguntaMaisDificil || "Dados insuficientes",
                graficosPerguntas: perguntasRows
            });
        });
    });
});

app.post('/criar-quiz', (req, res) => {
    const { titulo, idProfessor, idTurma, perguntas } = req.body;
    const codigoPin = Math.random().toString(36).substring(2, 8).toUpperCase();

    const sqlQuiz = `
    INSERT INTO QUIZ (TITULO, IDCRIADOR_FK, IDTURMA_FK, CODIGO_PIN, ESTATUS) 
    VALUES (?, ?, ?, ?, 1)
    `;

    db.run(sqlQuiz, [titulo, idProfessor, idTurma, codigoPin], function (err) {
        if (err) {
            console.error("❌ ERRO NO QUIZ:", err.message);
            return res.status(500).json({ message: `Erro ao salvar cabeçalho: ${err.message}` });
        }

        const idQuizCriado = this.lastID;

        if (!perguntas || perguntas.length === 0) {
            return res.status(201).json({ message: "Quiz criado com sucesso!", pin: codigoPin });
        }

        let perguntasSalvas = 0;
        let houveErro = false;

        perguntas.forEach((p) => {
            if (houveErro) return;

            const sqlPergunta = `
            INSERT INTO PERGUNTA (IDPROFESSOR_FK, ENUNCIADO, DIFICULDADE) 
            VALUES (?, ?, ?)
            `;

            db.run(sqlPergunta, [idProfessor, p.enunciado, 'Média'], function (errPergunta) {
                if (errPergunta) {
                    houveErro = true;
                    return res.status(500).json({ message: `Erro ao salvar pergunta: ${errPergunta.message}` });
                }

                const idPerguntaCriada = this.lastID;

                const sqlVinculo = `
                INSERT INTO QUIZ_PERGUNTA (IDQUIZ_PK_FK, IDPERGUNTA_PK_FK) 
                VALUES (?, ?)
                `;

                db.run(sqlVinculo, [idQuizCriado, idPerguntaCriada], (errVinculo) => {
                    if (errVinculo) {
                        houveErro = true;
                        return res.status(500).json({ message: `Erro ao vincular: ${errVinculo.message}` });
                    }

                    let alternativasSalvas = 0;

                    p.alternativas.forEach((textoAlternativa, index) => {
                        if (houveErro) return;

                        const rotulos = ['A', 'B', 'C', 'D', 'E'];
                        const rotulo = rotulos[index] || 'X';
                        const ehCorreta = (p.correta === index || p.correta === textoAlternativa) ? 1 : 0;

                        const sqlAlternativa = `
                        INSERT INTO ALTERNATIVAS (IDPERGUNTA_FK, ALTERNATIVA, ROTULO, CORRETA) 
                        VALUES (?, ?, ?, ?)
                        `;

                        db.run(sqlAlternativa, [idPerguntaCriada, textoAlternativa, rotulo, ehCorreta], (errAlt) => {
                            if (errAlt) {
                                houveErro = true;
                                return res.status(500).json({ message: `Erro na alternativa: ${errAlt.message}` });
                            }

                            alternativasSalvas++;

                            if (alternativasSalvas === p.alternativas.length) {
                                perguntasSalvas++;

                                if (perguntasSalvas === perguntas.length && !houveErro) {
                                    return res.status(201).json({
                                        message: "Quiz, perguntas e alternativas gravados perfeitamente!",
                                        pin: codigoPin
                                    });
                                }
                            }
                        });
                    });
                });
            });
        });
    });
});

// =========================================================================
// 🟢 SEÇÃO: INTEGRAÇÃO DOS BANCOS DE GAVETA (CONTAINERS DE PERGUNTAS)
// =========================================================================

// A. BUSCAR TODOS OS CONTAINERS DE UM PROFESSOR (Padronizado 'id' minúsculo)
app.get('/containers/professor/:idProfessor', (req, res) => {
    const { idProfessor } = req.params;
    const sql = `SELECT IDCONTAINER as id, NOME as nome, DESCRICAO as descricao, IDPROFESSOR_FK as idProfessor FROM CONTAINER_PERGUNTAS WHERE IDPROFESSOR_FK = ?`;
    
    db.all(sql, [idProfessor], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

// B. CRIAR UM NOVO CONTAINER DE QUESTÕES
app.post('/containers', (req, res) => {
    const { nome, descricao, idProfessor } = req.body;
    const sql = `INSERT INTO CONTAINER_PERGUNTAS (NOME, DESCRICAO, IDPROFESSOR_FK) VALUES (?, ?, ?)`;
    
    db.run(sql, [nome, descricao, idProfessor], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, nome, descricao, idProfessor });
    });
});

// C. ATUALIZAR METADADOS DO CONTAINER (NOME E DESCRIÇÃO)
app.put('/containers/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const sql = `UPDATE CONTAINER_PERGUNTAS SET NOME = ?, DESCRICAO = ? WHERE IDCONTAINER = ?`;

    db.run(sql, [nome, descricao, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Container updated successfully." });
    });
});

// D. BUSCAR PERGUNTAS INTERNAS DE UM CONTAINER COM CHAVES PADRONIZADAS EM MINÚSCULO PARA O REACT
app.get('/containers/:idContainer/perguntas', (req, res) => {
    const { idContainer } = req.params;
    
    const sql = `
        SELECT p.IDPERGUNTA_PK, p.ENUNCIADO, p.DIFICULDADE, p.EXPLICACAO_PEDAGOGICA,
               a.IDALTERNATIVA_PK, a.ALTERNATIVA, a.ROTULO, a.CORRETA
        FROM PERGUNTA p
        LEFT JOIN ALTERNATIVAS a ON p.IDPERGUNTA_PK = a.IDPERGUNTA_FK
        WHERE p.IDCONTAINER_FK = ?
    `;

    db.all(sql, [idContainer], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const perguntasMap = {};
        rows.forEach(row => {
            if (!perguntasMap[row.IDPERGUNTA_PK]) {
                // Padronizado em minúsculo para evitar conflito de nomenclatura no frontend
                perguntasMap[row.IDPERGUNTA_PK] = {
                    id: row.IDPERGUNTA_PK,
                    enunciado: row.ENUNCIADO,
                    dificuldade: row.DIFICULDADE,
                    explicacao: row.EXPLICACAO_PEDAGOGICA,
                    alternativas: []
                };
            }
            if (row.IDALTERNATIVA_PK) {
                perguntasMap[row.IDPERGUNTA_PK].alternativas.push({
                    id: row.IDALTERNATIVA_PK,
                    texto: row.ALTERNATIVA,
                    rotulo: row.ROTULO,
                    correta: row.CORRETA
                });
            }
        });

        res.json(Object.values(perguntasMap));
    });
});

// E. CADASTRAR PERGUNTA DIRETAMENTE DENTRO DE UM CONTAINER (Tratamento seguro contra re-envio de headers)
app.post('/perguntas', (req, res) => {
    const { idProfessor, idContainer, enunciado, dificuldade, explicacao, alternativas, rotuloCorreto } = req.body;

    const sqlPergunta = `
        INSERT INTO PERGUNTA (IDPROFESSOR_FK, IDCONTAINER_FK, ENUNCIADO, DIFICULDADE, EXPLICACAO_PEDAGOGICA)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sqlPergunta, [idProfessor, idContainer, enunciado, dificuldade || 'Média', explicacao || null], function (err) {
        if (err) return res.status(500).json({ error: `Erro na tabela Pergunta: ${err.message}` });

        const idPerguntaGerada = this.lastID;
        const sqlAlternativa = `INSERT INTO ALTERNATIVAS (IDPERGUNTA_FK, ALTERNATIVA, ROTULO, CORRETA) VALUES (?, ?, ?, ?)`;
        
        let salvas = 0;
        let erroLote = false;

        if (!alternativas || alternativas.length === 0) {
            return res.status(201).json({ success: true, idPergunta: idPerguntaGerada, alternativas: [] });
        }

        alternativas.forEach((textoAlt, index) => {
            if (erroLote) return;

            const rotulos = ['A', 'B', 'C', 'D', 'E'];
            const rotuloAtual = rotulos[index] || 'X';
            const ehCorreta = (rotuloAtual === rotuloCorreto || textoAlt === rotuloCorreto) ? 1 : 0;

            db.run(sqlAlternativa, [idPerguntaGerada, textoAlt, rotuloAtual, ehCorreta], (errAlt) => {
                if (errAlt) {
                    if (!erroLote) {
                        erroLote = true;
                        return res.status(500).json({ error: `Erro na alternativa: ${errAlt.message}` });
                    }
                    return;
                }

                salvas++;
                if (salvas === alternativas.length && !erroLote) {
                    return res.status(201).json({ success: true, idPergunta: idPerguntaGerada });
                }
            });
        });
    });
});

// =========================================================================
// 🚀 INICIALIZAÇÃO DO SERVIDOR
// =========================================================================
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`
    🚀 Servidor Backend Rodando com Sucesso!
    🔗 Alunos: http://localhost:${PORT}/alunos
    📂 Banco Carregado via db.js
    `);
});