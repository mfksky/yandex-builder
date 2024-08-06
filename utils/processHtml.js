import chokidar from 'chokidar';
import fs from 'fs-extra';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

const watcher = chokidar.watch('projects/**/*.html', {
	persistent: true,
	ignored: '**/*-builded.html',
});

watcher.on('change', async (filePath) => {
	console.log(`File changed: ${filePath}`);
	const content = await fs.readFile(filePath, 'utf-8');
	const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);

	if (styleMatch) {
		const css = styleMatch[1];
		const result = await postcss([autoprefixer]).process(css, {
			from: undefined,
		});
		const prefixedCss = result.css;
		const newContent = `<style>${prefixedCss}</style>`;
		const newFilePath = filePath.replace('.html', '-builded.html');

		await fs.writeFile(newFilePath, newContent);
		console.log(`Processed file: ${newFilePath}`);
	}
});

console.log('Watching for file changes...');
