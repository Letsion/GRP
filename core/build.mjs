import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import replace from '@rollup/plugin-replace';
import less from 'less';
import fs from 'fs';
import path from 'path';

function scanFiles(dir) {
    const files = [];
    fs.readdirSync(dir).forEach((f) => {
        const abs = path.join(dir, f);
        if (fs.statSync(abs).isDirectory()) files.push(...scanFiles(abs));
        else files.push(abs);
    });
    return files;
}

function scanFolders(dir) {
    const folders = [];
    fs.readdirSync(dir).forEach((f) => {
        const abs = path.join(dir, f);
        if (fs.statSync(abs).isDirectory()) {
            const deepFolders = scanFolders(abs);
            if (deepFolders.length === 0) folders.push(abs);
            else folders.push(...deepFolders);
        }
    });
    return folders;
}

function deleteEmptyFolders(dir) {
    fs.readdirSync(dir).forEach((f) => {
        const abs = path.join(dir, f);
        if (fs.statSync(abs).isDirectory()) deleteEmptyFolders(abs);
    });
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

(async () => {
    /* CLEAN */
    console.log('Cleaning ...');
    fs.rmSync('srv/resources/', { recursive: true, force: true });

    /* FOLDERS */
    console.log('Creating folder structure ...');
    scanFolders('src').forEach((folder) => fs.mkdirSync(folder.replace('src', 'srv'), { recursive: true }));

    /* STATIC FILES */
    console.log('Copying static files ...');
    const staticFiles = scanFiles('./src/').filter(
        (f) => !f.endsWith('.ts') && !f.endsWith('.less') && !f.endsWith('.vue')
    );
    fs.writeFileSync('srv/package.json', '{ "type": "module" }');
    staticFiles.forEach((file) => fs.copyFileSync(file, `${file.replace('src', 'srv')}`));

    /* LESS */
    console.log('Building resource css files ...');
    const lessFile = 'src/resources/core/html/css/index.less';
    const style = await less.render(fs.readFileSync(lessFile, { encoding: 'utf-8' }), {
        paths: ['src/resources/core/html/css/'],
    });
    fs.writeFileSync(lessFile.replace('src', 'srv').replace('.less', '.css'), style.css);

    /* BUILD */
    console.log('Building resource script files ...');
    await Promise.all(
        [
            'src/resources/core/client/index.ts',
            'src/resources/core/server/index.ts',
            'src/resources/core/html/index.ts',
        ].map(async (file) => {
            const bundle = await rollup({
                input: file,
                external: ['alt-client', 'alt-server', 'natives', 'http', 'mongodb', 'discord.js', 'typeorm', 'replaceall'],
                plugins: [
                    typescript(),
                    nodeResolve(),
                    vue(),
                    replace({
                        preventAssignment: true,
                        values: {
                            'process.env.NODE_ENV': JSON.stringify('development'),
                            'process.env.VUE_ENV': JSON.stringify('browser'),
                            __VUE_OPTIONS_API__: true,
                            __VUE_PROD_DEVTOOLS__: true,
                        },
                    }),
                    //terser(),
                ],
            });
            await bundle.write({
                file: file.replace('src', 'srv').replace('index.ts', 'index.js'),
                format: 'es',
                sourcemap: false,
            });
            await bundle.close();
        })
    );

    /* CLEANUP */
    console.log('Cleanup ...');
    deleteEmptyFolders('srv');

    /* DONE */
    console.log('Done!');
})();
