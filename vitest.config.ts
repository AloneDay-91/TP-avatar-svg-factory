import { getViteConfig } from 'astro/config';

export default getViteConfig({
    test: {
        // Permet d'utiliser les variables globales comme 'describe', 'it', 'expect' sans les importer
        globals: true,
        // Simule un environnement de navigateur
        environment: 'jsdom',
    },
});