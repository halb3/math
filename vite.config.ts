
import { resolve } from 'path';
import git from 'git-rev-sync';

import { defineConfig, UserConfigExport } from 'vite';
// import { visualizer } from 'rollup-plugin-visualizer';

const root = resolve(__dirname, 'source');
const outDir = resolve(__dirname, 'dist');


export default defineConfig(({ mode }) => {

    const config: UserConfigExport = {
        root,
        build: {
            outDir,
            lib: {
                entry: resolve(root, 'index.ts'),
                name: 'haeley-math',
                formats: ['cjs', 'umd', 'es'],
            },
            sourcemap: 'hidden',
            rollupOptions: {
                external: ['haeley-auxiliaries'],
                output: {
                    globals: {
                        'haeley-auxiliaries': 'haeley.auxiliaries'
                    }
                }
            }
        },
        define: {
            __GIT_COMMIT__: JSON.stringify(git.short(__dirname)),
            __GIT_BRANCH__: JSON.stringify(git.branch(__dirname)),
            __LIB_NAME__: JSON.stringify(process.env.npm_package_name),
            __LIB_VERSION__: JSON.stringify(process.env.npm_package_version),
        },
        // plugins: [visualizer()]
    };

    switch (mode) {

        case 'development':
            config.build.outDir = outDir;
            break;

        case 'production':
        default:
            config.build.emptyOutDir = true;
            config.define.__DISABLE_ASSERTIONS__ = JSON.stringify(true);
            config.define.__LOG_VERBOSITY_THRESHOLD__ = JSON.stringify(2);
            break;
    }

    console.log(config);
    return config;
});
