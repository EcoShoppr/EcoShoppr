# EcoShoppr

By Roman Rosales, Mason Brown, Quan Doan

EcoShoppr is a platform which is designed to help consumers save money and optimize their grocery budgets.

The platform uses grocery store website price information and user collected data, to actively compile a online record of grocery store prices in your local area. This information is useful to the consumer as they can compare prices of individual items between different stores and shop in a more "Eco" manner.

We also try to work with small businesses to create an online presence in which they can showcase their products and prices.

## Running the Project with Docker

1: Install Docker 2: docker pull masonsbrown/ecoshoppr:latest 3: docker run -d -p 3000:3000 masonsbrown/eccoshoppr visit your browser!

(To stop container:) 1: docker ps 2: docker stop

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

=======
(To stop container:) 1: docker ps 2: docker stop

> > > > > > > c7122083a5023643de600e6fe462c4bfb8133a79

wrangler login
