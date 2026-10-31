export default {
    version: '0.2',
    language: 'en,en-GB',
    languageId: 'javascript,typescript,css,scss,html,json,md,xml,yaml',
    dictionaryDefinitions: [
        {
            name: 'cspell.words',
            path: './cspell.words.txt',
            addWords: true,
        },
    ],
    dictionaries: ['cspell.words'],
    ignorePaths: ['node_modules', '/cspell.words.txt', '/cspell.config.mjs', '/.agents/skills/architecture/**'],
    overrides: [
        {
            filename: 'libs/platform-openapi/assets/swagger.css',
            // Preserve the selector spelling used by upstream Swagger UI.
            words: ['parаmeter'],
        },
        {
            filename: '**/*.spec.ts',
            words: [
                'AAAQEAYE',
                'DPEHPK',
                'foob',
                'fooba',
                'JBSWY',
                'johndoe',
                'MZXQ',
                'MZXW',
                'nobodys',
                'testpassword',
                'testuser',
                'vbmx',
                'verylongprefixname',
                'YTBOI',
                'äöüß',
                'тест',
                'السلام',
                'عليكم',
            ],
        },
    ],
};
