import { ConsoleLogWriter, DefaultLogger } from 'drizzle-orm';
import { prettify } from 'sql-log-prettifier';

const loggerSettings = {
  format: false,
  noColors: false,
  settings: {
    functions: {
      color: '#50fa7b',
      modifiers: ['bold'],
    },
    keywords: {
      color: '#EE8F9E',
      modifiers: ['bold'],
    },
    operators: {
      color: '#EE9F62',
      modifiers: ['bold'],
    },
    strings: {
      color: '#D4E1B8',
    },
    numbers: {
      color: '#257CA3',
    },
  },
};

// Custom Console Log Writer
class DbLogger extends ConsoleLogWriter {
  write(message: string): void {
    console.log(prettify(message, loggerSettings));
  }
}

// Ensure logger is exported as a named export
export const logger = new DefaultLogger({ writer: new DbLogger() });
