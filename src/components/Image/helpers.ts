export const imageExists = (url: string, callback: (exists: boolean) => void) => {
	const img = new Image();
	img.onload = () => callback(true);
	img.onerror = () => callback(false);
	img.src = url;
};
