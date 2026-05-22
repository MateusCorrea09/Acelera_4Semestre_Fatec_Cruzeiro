import express from 'express';
import cors from 'cors';
import db from './date/db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// CONSTANTES
// ============================================================================

const PERFIS = {
    PROFESSOR: 1,
    ALUNO: 2
};

// ============================================================================
// MIDDLEWARE PROFESSOR
// ============================================================================

const somenteProfessor = (req, res, next) => {

    const idProfessorRaw =
        req.params.idProfessor ||
        req.headers['x-professor-id'] ||
        req.body?.idProfessor;

    const idProfessor = parseInt(idProfessorRaw, 10);

    if (!idProfessor || isNaN(idProfessor)) {
        return res.status(400).json({
            success: false,
            error: "ID do professor inválido"
        });
    }

    const sql = `
        SELECT TIPOUSUARIO
        FROM USUARIO
        WHERE IDUSUARIO = ?
    `;

    db.get(sql, [idProfessor], (err, user) => {

        if (err) {

            console.error("❌ Middleware professor:", err.message);

            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Professor não encontrado"
            });
        }

        if (parseInt(user.TIPOUSUARIO) !== PERFIS.PROFESSOR) {
            return res.status(403).json({
                success: false,
                error: "Usuário não é professor"
            });
        }

        next();
    });
};

// ============================================================================
// LOGIN
// ============================================================================

app.post('/login', (req, res) => {

    const { email } = req.body;

    const sql = `
        SELECT
            IDUSUARIO,
            NOME,
            TIPOUSUARIO
        FROM USUARIO
        WHERE EMAIL = ?
    `;

    db.get(sql, [email], (err, user) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        res.json({
            success: true,
            id: user.IDUSUARIO,
            nome: user.NOME,
            tipo: parseInt(user.TIPOUSUARIO)
        });
    });
});

// ============================================================================
// TURMAS PROFESSOR
// ============================================================================

app.get(
    '/turmas-professor/:idProfessor',
    somenteProfessor,
    (req, res) => {

        const idProfessor = parseInt(req.params.idProfessor);

        const sql = `
            SELECT
                T.IDTURMA AS id,
                T.NOMETURMA AS nome,
                T.ANOELETIVO AS anoEletivo,
                T.SEMESTRE AS semestre
            FROM TURMAS T
            WHERE T.IDPROFESSOR_FK = ?
            ORDER BY T.NOMETURMA
        `;

        db.all(sql, [idProfessor], (err, rows) => {

            if (err) {

                console.error("❌ Erro turmas:", err.message);

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json(rows || []);
        });
    }
);

// ============================================================================
// LISTAR CONTAINERS
// ============================================================================

app.get(
    '/containers/professor/:idProfessor',
    somenteProfessor,
    (req, res) => {

        const idProfessor = parseInt(req.params.idProfessor);

        const sql = `
            SELECT
                IDCONTAINER as id,
                NOME as nome,
                DESCRICAO as descricao
            FROM CONTAINER_PERGUNTAS
            WHERE IDPROFESSOR_FK = ?
            ORDER BY IDCONTAINER DESC
        `;

        db.all(sql, [idProfessor], (err, rows) => {

            if (err) {

                console.error("❌ Containers:", err.message);

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json(rows || []);
        });
    }
);

// ============================================================================
// CRIAR CONTAINER
// ============================================================================

app.post(
    '/containers',
    somenteProfessor,
    (req, res) => {

        const {
            nome,
            descricao,
            idProfessor
        } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({
                success: false,
                error: "Nome do container obrigatório"
            });
        }

        const sql = `
            INSERT INTO CONTAINER_PERGUNTAS (
                NOME,
                DESCRICAO,
                IDPROFESSOR_FK
            )
            VALUES (?, ?, ?)
        `;

        db.run(
            sql,
            [
                nome.trim(),
                descricao || '',
                idProfessor
            ],
            function (err) {

                if (err) {

                    console.error("❌ Criar container:", err.message);

                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                res.status(201).json({
                    success: true,
                    idContainer: this.lastID
                });
            }
        );
    }
);

// ============================================================================
// ATUALIZAR CONTAINER
// ============================================================================

app.put(
    '/containers/:idContainer',
    somenteProfessor,
    (req, res) => {

        const idContainer = parseInt(req.params.idContainer);

        const {
            nome,
            descricao
        } = req.body;

        const sql = `
            UPDATE CONTAINER_PERGUNTAS
            SET
                NOME = ?,
                DESCRICAO = ?
            WHERE IDCONTAINER = ?
        `;

        db.run(
            sql,
            [
                nome,
                descricao,
                idContainer
            ],
            function (err) {

                if (err) {

                    console.error("❌ Atualizar container:", err.message);

                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                res.json({
                    success: true,
                    rowsAffected: this.changes
                });
            }
        );
    }
);

// ============================================================================
// LISTAR PERGUNTAS DO CONTAINER
// ============================================================================

app.get(
    '/containers/:idContainer/perguntas',
    (req, res) => {

        const idContainer = parseInt(req.params.idContainer);

        const sql = `
            SELECT

                P.IDPERGUNTA_PK AS id,

                P.ENUNCIADO AS enunciado,

                MAX(CASE WHEN A.ROTULO = 'A'
                    THEN A.ALTERNATIVA END) AS A,

                MAX(CASE WHEN A.ROTULO = 'B'
                    THEN A.ALTERNATIVA END) AS B,

                MAX(CASE WHEN A.ROTULO = 'C'
                    THEN A.ALTERNATIVA END) AS C,

                MAX(CASE WHEN A.ROTULO = 'D'
                    THEN A.ALTERNATIVA END) AS D,

                MAX(
                    CASE
                        WHEN A.CORRETA = 1
                        THEN A.ROTULO
                    END
                ) AS correta

            FROM PERGUNTA P

            LEFT JOIN ALTERNATIVAS A
                ON A.IDPERGUNTA_FK = P.IDPERGUNTA_PK

            WHERE P.IDCONTAINER_FK = ?

            GROUP BY
                P.IDPERGUNTA_PK,
                P.ENUNCIADO

            ORDER BY P.IDPERGUNTA_PK DESC
        `;

        db.all(sql, [idContainer], (err, rows) => {

            if (err) {

                console.error(
                    "❌ Erro perguntas:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json(rows || []);
        });
    }
);
// ============================================================================
// CRIAR QUIZ
// ============================================================================

app.post(
    '/criar-quiz',
    somenteProfessor,
    (req, res) => {

        const {
            titulo,
            idProfessor,
            idTurma,
            perguntas,
            containers,
            typeCriacao,
            quantidadePerguntasAuto
        } = req.body;

        // =========================
        // VALIDAÇÕES
        // =========================

        if (!titulo || !titulo.trim()) {

            return res.status(400).json({
                success: false,
                error: "Título obrigatório"
            });
        }

        if (!idProfessor) {

            return res.status(400).json({
                success: false,
                error: "Professor inválido"
            });
        }

        // =========================
        // GERAR PIN
        // =========================

        const pin = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // =========================
        // CRIAR QUIZ
        // =========================

        const sqlQuiz = `
            INSERT INTO QUIZ (
                IDCRIADOR_FK,
                TITULO,
                CODIGO_PIN,
                IDTURMA_FK
            )
            VALUES (?, ?, ?, ?)
        `;

        db.run(
            sqlQuiz,
            [
                idProfessor,
                titulo,
                pin,
                idTurma
            ],
            function (err) {

                if (err) {

                    console.error(
                        "❌ Erro criar quiz:",
                        err.message
                    );

                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                const idQuiz = this.lastID;

                console.log(
                    "✅ Quiz criado:",
                    idQuiz
                );

                // ====================================================
                // QUIZ MANUAL
                // ====================================================

                if (
                    typeCriacao === 'manual' &&
                    perguntas &&
                    perguntas.length > 0
                ) {

                    perguntas.forEach((p) => {

                        // =====================================
                        // CRIA PERGUNTA
                        // =====================================

                        const sqlPergunta = `
                            INSERT INTO PERGUNTA (
                                IDPROFESSOR_FK,
                                ENUNCIADO
                            )
                            VALUES (?, ?)
                        `;

                        db.run(
                            sqlPergunta,
                            [
                                idProfessor,
                                p.enunciado
                            ],
                            function (err) {

                                if (err) {

                                    console.error(
                                        "❌ Pergunta:",
                                        err.message
                                    );

                                    return;
                                }

                                const idPergunta =
                                    this.lastID;

                                // =====================================
                                // RELACIONA QUIZ ↔ PERGUNTA
                                // =====================================

                                db.run(
                                    `
                                    INSERT INTO QUIZ_PERGUNTA (
                                        IDQUIZ_PK_FK,
                                        IDPERGUNTA_PK_FK
                                    )
                                    VALUES (?, ?)
                                    `,
                                    [
                                        idQuiz,
                                        idPergunta
                                    ],
                                    (err) => {

                                        if (err) {
                                            console.error(
                                                "❌ Vincular pergunta:",
                                                err.message
                                            );
                                        }
                                    }
                                );

                                // =====================================
                                // ALTERNATIVAS
                                // =====================================

                                if (
                                    p.alternativas &&
                                    p.alternativas.length > 0
                                ) {

                                    p.alternativas.forEach(
                                        (
                                            alternativa,
                                            index
                                        ) => {

                                            const rotulo =
                                                String.fromCharCode(
                                                    65 + index
                                                );

                                            db.run(
                                                `
                                                INSERT INTO ALTERNATIVAS (
                                                    IDPERGUNTA_FK,
                                                    ALTERNATIVA,
                                                    ROTULO,
                                                    CORRETA
                                                )
                                                VALUES (?, ?, ?, ?)
                                                `,
                                                [
                                                    idPergunta,
                                                    alternativa,
                                                    rotulo,
                                                    index === p.correta
                                                        ? 1
                                                        : 0
                                                ],
                                                (err) => {

                                                    if (err) {
                                                        console.error(
                                                            "❌ Alternativa:",
                                                            err.message
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    );
                                }
                            }
                        );
                    });
                }

                // ====================================================
                // QUIZ AUTOMÁTICO
                // ====================================================

                if (
                    typeCriacao === 'auto' &&
                    containers &&
                    containers.length > 0
                ) {

                    const placeholders =
                        containers
                            .map(() => '?')
                            .join(',');

                    const sqlBuscarPerguntas = `
                        SELECT IDPERGUNTA_PK
                        FROM PERGUNTA
                        WHERE IDCONTAINER_FK IN (${placeholders})
                        ORDER BY RANDOM()
                        LIMIT ?
                    `;

                    db.all(
                        sqlBuscarPerguntas,
                        [
                            ...containers,
                            quantidadePerguntasAuto
                        ],
                        (err, rows) => {

                            if (err) {

                                console.error(
                                    "❌ Buscar perguntas:",
                                    err.message
                                );

                                return;
                            }

                            rows.forEach((row) => {

                                db.run(
                                    `
                                    INSERT INTO QUIZ_PERGUNTA (
                                        IDQUIZ_PK_FK,
                                        IDPERGUNTA_PK_FK
                                    )
                                    VALUES (?, ?)
                                    `,
                                    [
                                        idQuiz,
                                        row.IDPERGUNTA_PK
                                    ],
                                    (err) => {

                                        if (err) {

                                            console.error(
                                                "❌ Relacionar pergunta:",
                                                err.message
                                            );
                                        }
                                    }
                                );
                            });
                        }
                    );
                }

                // ====================================================
                // SUCESSO
                // ====================================================

                res.status(201).json({
                    success: true,
                    idQuiz,
                    pin
                });
            }
        );
    }
);
// ============================================================================
// CRIAR PERGUNTA
// ============================================================================

app.post(
    '/perguntas',
    somenteProfessor,
    (req, res) => {

        const {
            idContainer,
            enunciado,
            alternativas,
            rotuloCorreto,
            idProfessor
        } = req.body;

        const sqlPergunta = `
            INSERT INTO PERGUNTA (
                IDPROFESSOR_FK,
                IDCONTAINER_FK,
                ENUNCIADO
            )
            VALUES (?, ?, ?)
        `;

        db.run(
            sqlPergunta,
            [
                idProfessor,
                idContainer,
                enunciado
            ],
            function (err) {

                if (err) {

                    console.error("❌ Criar pergunta:", err.message);

                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                const idPergunta = this.lastID;

                const alternativasInsert = [
                    {
                        texto: alternativas?.[0] || '',
                        rotulo: 'A'
                    },
                    {
                        texto: alternativas?.[1] || '',
                        rotulo: 'B'
                    },
                    {
                        texto: alternativas?.[2] || '',
                        rotulo: 'C'
                    },
                    {
                        texto: alternativas?.[3] || '',
                        rotulo: 'D'
                    }
                ];

                const sqlAlternativa = `
                    INSERT INTO ALTERNATIVAS (
                        IDPERGUNTA_FK,
                        ALTERNATIVA,
                        ROTULO,
                        CORRETA
                    )
                    VALUES (?, ?, ?, ?)
                `;

                alternativasInsert.forEach((alt) => {

                    db.run(
                        sqlAlternativa,
                        [
                            idPergunta,
                            alt.texto,
                            alt.rotulo,
                            alt.rotulo === rotuloCorreto ? 1 : 0
                        ]
                    );
                });

                res.status(201).json({
                    success: true,
                    idPergunta
                });
            }
        );
    }
);

// ============================================================================
// QUIZZES DA TURMA
// ============================================================================

app.get(
    '/turma-quizzes/:idTurma',
    (req, res) => {

        const idTurma = parseInt(req.params.idTurma);

        const sql = `
            SELECT

                Q.IDQUIZ_PK AS id,

                Q.TITULO AS titulo,

                Q.CODIGO_PIN AS pin,

                ROUND(
                    COALESCE(AVG(R.NOTAFINAL) * 10, 0),
                    1
                ) AS mediaAcertos

            FROM QUIZ Q

            LEFT JOIN RESULTADOS R
                ON R.IDQUIZ_FK = Q.IDQUIZ_PK

            WHERE Q.IDTURMA_FK = ?

            GROUP BY
                Q.IDQUIZ_PK,
                Q.TITULO,
                Q.CODIGO_PIN

            ORDER BY Q.IDQUIZ_PK DESC
        `;

        db.all(sql, [idTurma], (err, rows) => {

            if (err) {

                console.error(
                    "❌ Erro quizzes:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json(rows || []);
        });
    }
);

// ============================================================================
// DETALHES QUIZ
// ============================================================================

app.get(
    '/turma-quiz-detalhes/:idTurma/:idQuiz',
    (req, res) => {

        const idQuiz =
            parseInt(req.params.idQuiz);

        const sql = `
            SELECT

                Q.IDQUIZ_PK AS idQuiz,
                Q.TITULO AS titulo,
                Q.CODIGO_PIN AS pin,

                COUNT(R.IDRESULTADO)
                    AS totalRespostas,

                ROUND(
                    AVG(R.NOTAFINAL) * 10,
                    1
                ) AS mediaTurma

            FROM QUIZ Q

            LEFT JOIN RESULTADOS R
                ON R.IDQUIZ_FK = Q.IDQUIZ_PK

            WHERE Q.IDQUIZ_PK = ?

            GROUP BY
                Q.IDQUIZ_PK,
                Q.TITULO,
                Q.CODIGO_PIN
        `;

        db.get(sql, [idQuiz], (err, row) => {

            if (err) {

                console.error(
                    "❌ Erro detalhes quiz:",
                    err.message
                );

                return res.status(500).json({

                    success: false,
                    error: err.message
                });
            }

            if (!row) {

                return res.status(404).json({

                    success: false,
                    error: "Quiz não encontrado"
                });
            }

            res.json({

                success: true,

                perguntaMaisFacil:
                    "Análise indisponível",

                perguntaMaisDificil:
                    "Análise indisponível",

                graficosPerguntas: [],

                mediaTurma:
                    Number(row.mediaTurma || 0),

                totalRespostas:
                    Number(row.totalRespostas || 0),

                statusAnalise:
                    "Modo simplificado ativo"
            });
        });
    }
);

// ============================================================================
// ALUNOS DA TURMA
// ============================================================================

app.get(
    '/alunos/turma/:idTurma',
    (req, res) => {

        const idTurma = parseInt(req.params.idTurma);

        const sql = `
            SELECT

                U.IDUSUARIO AS id,

                U.NOME AS nome,

                T.NOMETURMA AS sala,

                AT.STATUS AS status,

                CASE
                    WHEN COUNT(R.IDRESULTADO) = 0
                    THEN NULL
                    ELSE ROUND(AVG(R.NOTAFINAL) * 10, 1)
                END AS nota

            FROM ALUNOS_TURMA AT

            INNER JOIN ALUNO A
                ON A.IDUSUARIO = AT.IDALUNO_PK_FK

            INNER JOIN USUARIO U
                ON U.IDUSUARIO = A.IDUSUARIO

            INNER JOIN TURMAS T
                ON T.IDTURMA = AT.IDTURMA_PK_FK

            LEFT JOIN QUIZ Q
                ON Q.IDTURMA_FK = T.IDTURMA

            LEFT JOIN RESULTADOS R
                ON R.IDALUNO_FK = U.IDUSUARIO
                AND R.IDQUIZ_FK = Q.IDQUIZ_PK

            WHERE
                T.IDTURMA = ?
                AND AT.STATUS = 'MATRICULADO'

            GROUP BY
                U.IDUSUARIO,
                U.NOME,
                T.NOMETURMA,
                AT.STATUS
        `;

        db.all(sql, [idTurma], (err, rows) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            const alunos = (rows || []).map(aluno => ({

                ...aluno,

                acertos:
                    aluno.nota >= 70 ? 8 :
                    aluno.nota >= 50 ? 5 :
                    aluno.nota === null ? 0 :
                    2,

                desempenho:
                    aluno.nota === null
                        ? "Não respondeu"
                        : aluno.nota >= 70
                            ? "Excelente"
                            : aluno.nota >= 50
                                ? "Bom"
                                : "Precisa melhorar"
            }));

            res.json(alunos);
        });
    }
);

// ============================================================================
// ESTATÍSTICAS DA TURMA
// ============================================================================

app.get(
    '/turma-stats/:idTurma',
    (req, res) => {

        const idTurma = parseInt(req.params.idTurma);

        const sql = `
            SELECT

                COUNT(DISTINCT AT.IDALUNO_PK_FK)
                    AS totalAlunos,

                COUNT(DISTINCT Q.IDQUIZ_PK)
                    AS totalQuizzes,

                COUNT(DISTINCT R.IDALUNO_FK)
                    AS alunosResponderam,

                ROUND(
                    COALESCE(AVG(R.NOTAFINAL) * 10, 0),
                    1
                ) AS mediaGeral

            FROM TURMAS T

            LEFT JOIN ALUNOS_TURMA AT
                ON AT.IDTURMA_PK_FK = T.IDTURMA

            LEFT JOIN QUIZ Q
                ON Q.IDTURMA_FK = T.IDTURMA

            LEFT JOIN RESULTADOS R
                ON R.IDQUIZ_FK = Q.IDQUIZ_PK

            WHERE T.IDTURMA = ?
        `;

        db.get(sql, [idTurma], (err, row) => {

            if (err) {

                console.error(
                    "❌ Erro stats:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            const totalAlunos =
                Number(row?.totalAlunos || 0);

            const alunosResponderam =
                Number(row?.alunosResponderam || 0);

            const percentualParticipacao =
                totalAlunos > 0
                    ? Math.round(
                        (alunosResponderam / totalAlunos) * 100
                    )
                    : 0;

            res.json({

                totalAlunos,

                totalQuizzes:
                    Number(row?.totalQuizzes || 0),

                mediaGeral:
                    Number(row?.mediaGeral || 0),

                quizMaisDificil:
                    "Em análise",

                alunosAtivos:
                    `${alunosResponderam}/${totalAlunos}`,

                percentualParticipacao
            });
        });
    }
);

// ============================================================================
// LISTAR TODAS AS TURMAS
// ============================================================================

app.get('/turmas', (req, res) => {

    const sql = `
        SELECT
            IDTURMA AS id,
            NOMETURMA AS nome
        FROM TURMAS
        ORDER BY NOMETURMA
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {

            console.error(
                "❌ Erro listar turmas:",
                err.message
            );

            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json(rows || []);
    });
});
// ============================================================================
// CADASTRO USUÁRIO
// ============================================================================

app.post('/registro', (req, res) => {

    const {
        nome,
        email,
        senha,
        tipoUsuario,
        ra,
        idTurma
    } = req.body;

    // =====================================================
    // VALIDAÇÕES
    // =====================================================

    if (!nome || !email || !senha) {

        return res.status(400).json({
            success: false,
            error: "Campos obrigatórios"
        });
    }

    // =====================================================
    // CRIAR USUÁRIO
    // =====================================================

    const sqlUsuario = `
        INSERT INTO USUARIO (
            NOME,
            EMAIL,
            TIPOUSUARIO,
            SENHA
        )
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sqlUsuario,
        [
            nome,
            email,
            tipoUsuario,
            senha
        ],
        function (err) {

            if (err) {

                console.error(
                    "❌ Erro usuário:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            const idUsuario = this.lastID;

            // =====================================================
            // ALUNO
            // =====================================================

            if (Number(tipoUsuario) === 2) {

                const sqlAluno = `
                    INSERT INTO ALUNO (
                        IDUSUARIO,
                        RA
                    )
                    VALUES (?, ?)
                `;

                db.run(
                    sqlAluno,
                    [
                        idUsuario,
                        ra
                    ],
                    (err) => {

                        if (err) {

                            console.error(
                                "❌ Erro aluno:",
                                err.message
                            );

                            return res.status(500).json({
                                success: false,
                                error: err.message
                            });
                        }

                        // =====================================================
                        // VINCULAR TURMA
                        // =====================================================

                        const sqlTurma = `
                            INSERT INTO ALUNOS_TURMA (
                                IDTURMA_PK_FK,
                                IDALUNO_PK_FK,
                                STATUS
                            )
                            VALUES (?, ?, ?)
                        `;

                        db.run(
                            sqlTurma,
                            [
                                idTurma,
                                idUsuario,
                                'NAO_MATRICULADO'
                            ],
                            (err) => {

                                if (err) {

                                    console.error(
                                        "❌ Erro vínculo turma:",
                                        err.message
                                    );

                                    return res.status(500).json({
                                        success: false,
                                        error: err.message
                                    });
                                }

                                return res.status(201).json({
                                    success: true,
                                    idUsuario
                                });
                            }
                        );
                    }
                );

            } else {

                return res.status(201).json({
                    success: true,
                    idUsuario
                });
            }
        }
    );
});

// ============================================================================
// NOTIFICAÇÕES PENDENTES
// ============================================================================

app.get(
    '/professor/:idProfessor/notificacoes-pendentes',
    (req, res) => {

        const idProfessor =
            parseInt(req.params.idProfessor);

        const sql = `
            SELECT

                AT.IDALUNO_PK_FK AS idAluno,

                AT.IDTURMA_PK_FK AS idTurma,

                U.NOME AS nomeAluno,

                T.NOMETURMA AS nomeTurma,

                AT.STATUS AS status

            FROM ALUNOS_TURMA AT

            INNER JOIN USUARIO U
                ON U.IDUSUARIO =
                AT.IDALUNO_PK_FK

            INNER JOIN TURMAS T
                ON T.IDTURMA =
                AT.IDTURMA_PK_FK

            WHERE
                T.IDPROFESSOR_FK = ?
                AND AT.STATUS = 'NAO_MATRICULADO'

            ORDER BY U.NOME
        `;

        db.all(
            sql,
            [idProfessor],
            (err, rows) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                const notificacoes =
                    (rows || []).map((n) => ({

                        ...n,

                        mensagem:
                            `${n.nomeAluno} está aguardando matrícula na turma ${n.nomeTurma}`
                    }));

                res.json(notificacoes);
            }
        );
    }
);

// ============================================================================
// DECIDIR SOLICITAÇÃO
// ============================================================================

app.put(
    '/turmas/decidir-solicitacao',
    (req, res) => {

        const {
            idTurma,
            idAluno,
            acao
        } = req.body;

        let novoStatus = '';

        if (acao === 'APROVAR') {

            novoStatus = 'MATRICULADO';

        } else {

            novoStatus = 'NAO_ACEITO';
        }

        const sql = `
            UPDATE ALUNOS_TURMA
            SET STATUS = ?
            WHERE
                IDTURMA_PK_FK = ?
                AND IDALUNO_PK_FK = ?
        `;

        db.run(
            sql,
            [
                novoStatus,
                idTurma,
                idAluno
            ],
            function (err) {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                res.json({
                    success: true,
                    novoStatus
                });
            }
        );
    }
);

// ============================================================================
// ROOT
// ============================================================================

app.get('/', (req, res) => {

    res.json({
        success: true,
        message: "Servidor funcionando!"
    });
});

// ============================================================================
// TESTE
// ============================================================================

app.get('/teste', (req, res) => {
    res.send("Servidor OK");
});

// ============================================================================
// START
// ============================================================================

const PORT = 3001;

app.listen(PORT, () => {

    console.log(`
========================================
🚀 BACKEND RODANDO
🔗 http://localhost:${PORT}
========================================
`);
});