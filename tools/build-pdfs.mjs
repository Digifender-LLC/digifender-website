import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const bundled = path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3');
const python = process.env.DIGIFENDER_PYTHON || (existsSync(bundled) ? bundled : 'python3');
const result = spawnSync(python, [fileURLToPath(new URL('./build-pdfs.py',import.meta.url))], {stdio:'inherit'});
if (result.error) throw result.error;
if (result.status !== 0) throw Error('PDF build failed. Install the Python packages listed in tools/pdf-requirements.txt or set DIGIFENDER_PYTHON.');
