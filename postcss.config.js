export default {
	plugins: [
		require('autoprefixer')({
			overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'],
			grid: true,
		}),
	],
};
