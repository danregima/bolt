// @flow
import * as options from '../utils/options';
import * as logger from '../utils/logger';
import { BoltError } from '../utils/errors';

export type WebOptions = {|
  cwd?: string,
  port?: number
|};

export function toWebOptions(
  args: options.Args,
  flags: options.Flags
): WebOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    port: options.number(flags.port, 'port') || 3000
  };
}

export async function web(opts: WebOptions) {
  let cwd = opts.cwd || process.cwd();
  let port = opts.port || 3000;

  try {
    logger.info(`Starting Bolt.new web interface...`);
    logger.info(`Server will be available at http://localhost:${port}`);
    
    // Import the web server dynamically to avoid loading it unless needed
    const webModule = await import('../web/server.js');
    await webModule.startWebServer(cwd, port);
  } catch (err) {
    throw new BoltError(`Unable to start web server: ${err.message}`);
  }
}