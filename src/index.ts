import * as t from 'io-ts';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

const LowerCaseString = <S extends string>(s: S) => {
  const isLowerCaseString = (word: unknown): word is S => typeof word === 'string' && word.toLowerCase() === s;
  return new t.Type<S, string, unknown>(
    'LowerCaseString',
    isLowerCaseString,
    (input, context) => (isLowerCaseString(input) ? t.success(input) : t.failure(input, context)),
    t.identity
  );
};

function main() {
  logger.info('--- START ---');

  const word = 'abcdef';
  const LowerCase = LowerCaseString(word);

  console.log(LowerCase.decode(word));
  console.log(LowerCase.decode(`${word}123456`));

  logger.info('---  END  ---');
}

main();
