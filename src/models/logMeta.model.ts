export interface LogMeta {
    function: string;
    file: string;
    line: string;
    column: string;
    error?: string;
    stack?: string;
  }