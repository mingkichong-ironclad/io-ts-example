import { pipe } from 'fp-ts/lib/pipeable'
import { fold } from 'fp-ts/lib/Either'
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

const lowerCaseString = <S extends string>(s: S) => {
  const isLowerCaseString = (word: unknown): word is S => typeof word === 'string' && word.toLowerCase() === s.toLowerCase();
  return new t.Type<S, string, unknown>(
    'LowerCaseString',
    isLowerCaseString,
    (input, context) => (isLowerCaseString(input) ? t.success(input.toLowerCase() as S) : t.failure(input, context)),
    t.identity
  );
};

const onLeft = (errors: t.Errors) => {
  logger.error(JSON.stringify(errors, null, 2));
};

const onRight = (s: string) => {
  logger.info(JSON.stringify(s))
}

function main() {
  logger.debug('--- START ---');

  const word = 'Abcdef';
  const decode = (s: string) => pipe(lowerCaseString(word).decode(s), fold(onLeft, onRight));

  decode(word);
  decode(word.toUpperCase());
  decode('AbCdEf');
  decode(`${word}123456`);

  logger.debug('---  END  ---');
}

main();
