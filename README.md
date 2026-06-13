# Acelera 4º Semestre – Plataforma Educacional Interativa Canguru

## Sobre o Projeto

O **Canguru** é uma plataforma educacional desenvolvida para auxiliar professores na criação de atividades avaliativas e apoiar a identificação de dificuldades de aprendizagem dos alunos por meio da coleta e análise de resultados em quizzes educacionais.

A solução integra uma aplicação web desenvolvida com tecnologias modernas e dispositivos físicos baseados em Arduino, proporcionando uma experiência interativa para aplicação de avaliações em ambientes educacionais.

O sistema permite que estudantes realizem atividades através da plataforma web e também por meio de uma interface física utilizando Arduino e display touchscreen, promovendo maior interação durante o processo de aprendizagem.

---

## Funcionalidades

### Área do Aluno

* Login de usuário
* Visualização de atividades
* Realização de quizzes
* Histórico de resultados
* Acompanhamento de desempenho
* Visualização de notas e estatísticas

### Área Administrativa

* Cadastro de quizzes
* Cadastro de perguntas
* Gerenciamento de alunos
* Consulta de resultados
* Controle de atividades
* Acompanhamento de desempenho dos estudantes

### Integração com Arduino

* Exibição das alternativas do quiz em display TFT 2.4"
* Comunicação Serial entre aplicação e Arduino
* Leitura de respostas via touchscreen
* Envio automático das respostas para o sistema web
* Exibição de mensagens de início e finalização de atividades
* Integração em tempo real entre hardware e software

---

## Tecnologias Utilizadas

### Frontend

* React
* Vite
* React Router DOM
* Styled Components

### Backend

* Node.js
* Express
* SerialPort

### Banco de Dados

* SQLite

### Hardware

* Arduino Uno
* Display TFT ILI9341 240x320
* Touchscreen Resistivo
* Comunicação Serial USB

---

## Arquitetura do Sistema

```text
Frontend React
      │
      ▼
Backend Node.js
      │
      ├── SQLite
      │
      └── Arduino Uno
                │
                ▼
      Display TFT Touchscreen
```

---

## Fluxo de Funcionamento do Quiz

1. O aluno inicia um quiz na aplicação.
2. O backend envia as alternativas para o Arduino.
3. O display TFT apresenta as opções disponíveis.
4. O aluno seleciona uma resposta pelo touchscreen.
5. O Arduino envia a resposta ao backend.
6. O frontend avança automaticamente para a próxima questão.
7. Ao final da atividade, o sistema calcula a pontuação.
8. O resultado é armazenado no banco de dados.
9. O aluno pode consultar seu histórico de desempenho.

---

## Como Executar

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
npm install
node index.js
```

### Banco de Dados

Configurar o banco SQLite conforme os arquivos presentes no diretório backend.

### Arduino

1. Abrir o código na IDE Arduino.
2. Instalar as bibliotecas necessárias.
3. Selecionar a porta correta da placa.
4. Fazer upload do código.
5. Conectar o sistema ao backend através da porta serial.

---

## Bibliotecas Arduino

* Adafruit_GFX
* MCUFRIEND_kbv
* TouchScreen

---

## Status do Projeto

🚧 Em desenvolvimento

Atualmente estão sendo implementadas melhorias na integração do touchscreen para permitir respostas diretamente pelo display TFT conectado ao Arduino, além de refinamentos na experiência do usuário e na comunicação em tempo real entre hardware e software.

---

# Projeto de Curricularização da Extensão

## Dados do Projeto

**Título do Projeto:**
Canguru – Criando atividades e identificando dificuldades dos alunos

**Período de Realização:**
Março de 2026 a Junho de 2026

**Disciplinas Envolvidas:**

* Sistemas Operacionais II (SOII)
* Programação para Dispositivos Móveis (PDM)
* Programação Web

---

## Professores Orientadores

* Prof. Carlos Henrique Loureiro Feichas
* Prof. Eduardo Compasso Arbex

---

## Equipe de Desenvolvimento

* Mateus de Jesus Corrêa
* Vitor Augusto Jardim Paulino
* Fabiano José de Oliveira Neto
* Matheus Augusto de Souza Florentino

---

## Instituição de Ensino

Projeto desenvolvido no curso de **Análise e desenvolvimento de sistemas(ADS)** da **FATEC Cruzeiro – Prof. Waldomiro May**.

---

## Instituição Parceira

Este projeto contou com a colaboração da **ETEC José Sant'Ana de Castro**, localizada em Cruzeiro/SP, representada pelo **Professor Fabiano Sinhorelli Damasceno**, contribuindo para a validação dos requisitos e feedbacks na solução tecnológica para um ambiente educacional.

---

## Objetivo da Extensão

O projeto busca aproximar a comunidade acadêmica das necessidades reais do ambiente escolar, oferecendo uma ferramenta tecnológica capaz de auxiliar professores na criação de atividades educacionais e no acompanhamento do desempenho dos alunos.

Através da análise dos resultados obtidos nos quizzes, a plataforma permite identificar dificuldades de aprendizagem, apoiar intervenções pedagógicas e contribuir para a melhoria do processo de ensino-aprendizagem.

```
```
