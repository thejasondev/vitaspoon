# Astro Starter Kit: Basics

```sh
pnpm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Configuración de variables de entorno

Para usar las APIs, sigue estos pasos:

1. Crea un archivo `.env` en la raíz del proyecto (si no existe)
2. Añade las claves de API que desees utilizar:

```
# API de Spoonacular (opcional)
SPOONACULAR_API_KEY=tu_api_key_aquí

# API de OpenAI (GPT-3.5 - opcional)
OPENAI_API_KEY=tu_api_key_aquí

# API de Google Gemini (opcional)
GEMINI_API_KEY=tu_api_key_aquí
```

3. Puedes obtener las API keys gratuitas en:
   - Spoonacular: [https://spoonacular.com/food-api/console#Dashboard](https://spoonacular.com/food-api/console#Dashboard)
   - OpenAI: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Google Gemini: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

**Importante**: No compartas tus API keys, el archivo `.env` ya está incluido en `.gitignore`

**Nota**: No es necesario configurar todas las APIs, la aplicación utilizará automáticamente las que estén disponibles. Si no hay ninguna configurada, usará recetas generadas localmente.
