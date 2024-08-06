import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import fs from 'fs-extra';
import path from 'path';

async function optimizeImages(projectName) {
	const imagesPath = path.join('projects', projectName, 'assets', 'images');
	const outputPath = path.join(imagesPath, 'opt');

	if (await fs.pathExists(outputPath)) {
		await fs.remove(outputPath);
	}

	await fs.ensureDir(outputPath);

	const files = await fs.readdir(imagesPath);
	const imageFiles = files.filter((file) =>
		/\.(jpg|jpeg|png|svg)$/i.test(file)
	);

	for (const file of imageFiles) {
		const filePath = path.join(imagesPath, file);
		const optimizedFileName = file.replace(/(\.[a-z]+)$/i, '_optimized$1');
		const optimizedFilePath = path.join(outputPath, optimizedFileName);

		const [optimizedImage] = await imagemin([filePath], {
			destination: outputPath,
			plugins: [
				imageminMozjpeg({ quality: 75 }),
				imageminPngquant({ quality: [0.6, 0.8] }),
				imageminSvgo(),
			],
		});

		await fs.rename(optimizedImage.destinationPath, optimizedFilePath);
	}

	console.log(`Optimized ${imageFiles.length} images in ${projectName}`);
}

const projectName = process.argv[2];
if (!projectName) {
	console.error(
		'Please specify a project name: npm run imageopt <project-name>'
	);
	process.exit(1);
}

optimizeImages(projectName).catch((err) => {
	console.error(err);
	process.exit(1);
});
