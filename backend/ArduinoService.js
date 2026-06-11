import { SerialPort } from 'serialport';

let portaArduino = null;

let ultimaResposta = null;

export function conectarArduino() {

  try {

    portaArduino =
      new SerialPort({

        path: 'COM3',
        baudRate: 9600
      });

    portaArduino.on(
      'open',
      () => {

        console.log(
          'Arduino conectado'
        );
      }
    );

    portaArduino.on(
      'data',
      (dados) => {

        const texto =
          dados.toString().trim();

        if (!texto) return;

        ultimaResposta =
          texto;

        console.log(
          'Arduino respondeu:',
          ultimaResposta
        );
      }
    );

  } catch (err) {

    console.error(err);
  }
}

export function enviarParaArduino(
  texto
) {

  if (!portaArduino) {

    console.log(
      'Arduino não conectado'
    );

    return;
  }

  portaArduino.write(
    texto + '\n'
  );
}

export function enviarPerguntaParaArduino(
  pergunta
) {

  if (!portaArduino) {

    console.log(
      'Arduino não conectado'
    );

    return;
  }

  const mensagem =
    `QUIZ;` +
    `${pergunta.alternativas[0]};` +
    `${pergunta.alternativas[1]};` +
    `${pergunta.alternativas[2]};` +
    `${pergunta.alternativas[3]}`;

  portaArduino.write(
    mensagem + '\n'
  );
}

export function getUltimaResposta() {

  return ultimaResposta;
}