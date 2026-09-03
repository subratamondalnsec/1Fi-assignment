import js from '@eslint/js';
import globals from 'globals';
export default [{ ignores: ['node_modules'] }, { files: ['src/**/*.js'], languageOptions: { ecmaVersion: 2022, globals: globals.node }, rules: js.configs.recommended.rules }];
