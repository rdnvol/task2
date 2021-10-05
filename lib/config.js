import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const roots = {
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../dist'),
};

console.log('Root are', roots);

function init() {
  return {
    theme: {
      src: {
        assets: path.resolve(roots.src, './assets'),
        config: path.resolve(roots.src, './config'),
        scripts: path.resolve(roots.src, './scripts'),
        styles: path.resolve(roots.src, './styles'),
        layout: path.resolve(roots.src, './layout'),
        locales: path.resolve(roots.src, './locales'),
        snippets: path.resolve(roots.src, './snippets'),
        templates: path.resolve(roots.src, './templates'),
        customers: path.resolve(roots.src, './templates/customers'),
        sections: path.resolve(roots.src, './sections'),
        yml: path.resolve(roots.src, './config.yml'),
      },
      dist: {
        assets: path.resolve(roots.dist, './assets'),
        config: path.resolve(roots.dist, './config'),
        scripts: path.resolve(roots.dist, './scripts'),
        styles: path.resolve(roots.dist, './styles'),
        layout: path.resolve(roots.dist, './layout'),
        locales: path.resolve(roots.dist, './locales'),
        snippets: path.resolve(roots.dist, './snippets'),
        templates: path.resolve(roots.dist, './templates'),
        customers: path.resolve(roots.dist, './templates/customers'),
        sections: path.resolve(roots.dist, './sections'),
        yml: path.resolve(roots.dist, './config.yml'),
      },
      roots,
    },
  };
}

export const settings = init();
