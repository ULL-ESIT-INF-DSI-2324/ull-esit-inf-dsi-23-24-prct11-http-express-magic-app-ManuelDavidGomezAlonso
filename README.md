[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/sNC2m9MU)

[![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-ManuelDavidGomezAlonso/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-ManuelDavidGomezAlonso/actions/workflows/coveralls.yml)

[![Sonar-Cloud](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-ManuelDavidGomezAlonso/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-ManuelDavidGomezAlonso/actions/workflows/sonarcloud.yml)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-ManuelDavidGomezAlonso/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-ManuelDavidGomezAlonso/actions/workflows/node.js.yml)


# PRÁCTICA 11 : Aplicación Express para coleccionistas de cartas magic.

*Nombre y apellidos: [Manuel David Gómez Alonso](https://github.com/ManuelDavidGomezAlonso?tab=repositories, "Enlace Github")*

*Asignatura: Desarrollo de Sistemas Informáticos (DSI)*

[Enunciado de la práctica 11](https://ull-esit-inf-dsi-2324.github.io/prct11-http-express-magic-app/)

## Índice
1. [Resumen](#resumen)
2. [Apartados](#apartados)
   - [Implementacion del server](#Implementacion-del-server)
   - [Implementacion de las pruebas](#Implementacion-de-las-pruebas)
   - [Cambios en el controlador del JSON](#Cambios-en-el-controlador-del-JSON)
3. [Problemas](#alternativas)
4. [Referencias](#referencias)
5. [Anexos](#anexos)

## Resumen
En esta práctica, se nos ha pedido un programa en **TypeScript** destinado a la coleccion de cartas Magic, básicamente crear una especie de albúm de estas. 

Algunas de las tareas previas requeridas fueron:

- **Acepte la asignación** de GitHub Classroom asociada a esta práctica.
- Aprenda a utilizar los paquetes **yargs y chalk**, aunque más abajo se ilustran ejemplos de uso.
- Familiarícese con el **API síncrona proporcionada por Node.js para trabajar con el sistema de ficheros.**

Los requisitos de la "app" que se nos exigían fueron:

- Las cartas magic deben de tener una forma similiar a la descrita en el guión, con los atributos:

  - ID.
  - Nombre.
  - Coste de maná.
  - Color.
  - Linea de tipo.
  - Rareza.
  - Texto de reglas.
  - Fuerza/Resistencia.
  - Marcas de lealtad.
  - Valor de mercado.

- Acciones que los usuarios podrán ejecutar sobre su colección de cartas:

  - Añadir.
  - Modificar.
  - Eliminar.
  - Listar.
  - Mostrar.
  - Modificar por campo (Añadida).

- Guardaremos mediante un sistema de ficheros JSON las cartas magic del usuario hacinendo la aplicación persistente.

> **[Volver al índice](#índice)**

## Apartados
- ### Planteamiento del trabajo

El plateamiento inicial sin conocer el API síncrono para el trabajo con un sistema de ficheros, fue como en prácticas anteriores, una clase que implemente las caracteríticas de las cartas magic y otra clase que posee un array de estos objetos, con las diferentes funciones que se podrán hacer sobre él.

Una vez comprendida la API, nos damos cuenta de que el array podrá ser la misma carpeta donde se guardan los ficheros JSON de cada magicCard. Para conseguir esto haremos un clase que implemente los métodos que cubren las funcionalidades que debe de tener el usuario, y gestionaremos los objetos mediante los diferentes archivos JSON.

```typescript
/**
 * @fileoverview jsonController.ts - Controla las acciones sobre los Json que representan las cartas de Magic.
 */

import * as fs from "fs";
import { magicCard } from "./magiCard.js";
import chalk from "chalk";

const directorioUsuario = `./src/usuarios/${process.env.USER}`;

/**
 * Clase jsonCards, implementa los métodos para añadir, eliminar, mostrar, modificar y mostrar todas las cartas de un usuario.
 */
export class jsonCards {
  /**
   * @brief Constructor de la clase jsonCards.
   * Se verifica si existe el directorio del usuario, si no existe se crea.
   */
  constructor() {
    if (!fs.existsSync(directorioUsuario)) {
      fs.mkdirSync(directorioUsuario);
    }
  }

  /**
   * @brief Añade una carta al directorio del usuario.
   * @param card Carta a añadir.
   */
  add(card: magicCard) {
    if (fs.existsSync(`${directorioUsuario}/${card.id_}.json`)) {
      throw chalk.red(new Error(`Card already exists in ${process.env.USER}`));
    }
    fs.writeFileSync(
      `${directorioUsuario}/${card.id_}.json`,
      JSON.stringify(card),
    );
    console.log(chalk.green("Card added"));
  }

  /**
   * @brief Elimina una carta del directorio del usuario.
   * @param cardID ID de la carta a eliminar.
   */
  delete(cardID: number) {
    if (fs.existsSync(`${directorioUsuario}/${cardID}.json`)) {
      fs.unlinkSync(`${directorioUsuario}/${cardID}.json`);
      console.log(chalk.green("Card deleted"));
    }
  }

  /**
   * @brief Muestra una carta del directorio del usuario.
   * @param showIDCard ID de la carta a mostrar.
   */
  showCard(showIDCard: number) {
    const filePath = `${directorioUsuario}/${showIDCard}.json`;
    if (fs.existsSync(filePath)) {
      console.log(chalk.green("Showing card"));
      const cardData = fs.readFileSync(filePath, "utf-8");
      const card = JSON.parse(cardData);
      console.log(chalk.blue(`ID: ${showIDCard}`));
      console.log(chalk.blue(`Name: ${card.name_}`));
      console.log(chalk.blue(`Mana Cost: ${card.manaCost_}`));
      console.log(chalk.blue(`Color: ${card.color_}`));
      console.log(chalk.blue(`Type: ${card.type_}`));
      console.log(chalk.blue(`Rare: ${card.rare_}`));
      console.log(chalk.blue(`Rules: ${card.rules_}`));
      console.log(chalk.blue(`Loyalty: ${card.loyalty_}`));
      console.log(chalk.blue(`Value: ${card.value_}`));
      if (card.strRes_) {
        console.log(chalk.blue(`Strength/Resistance: ${card.strRes_}`));
      }
    } else {
      throw new Error(chalk.red(`Card not found with ID ${showIDCard}`));
    }
  }

  /**
   * @brief Actualiza una carta del directorio del usuario, lo que quiere decir que la carta debe existir.
   * @param card Carta a actualizar.
   */
  update(card: magicCard) {
    if (fs.existsSync(`${directorioUsuario}/${card.id_}.json`)) {
      fs.writeFileSync(
        `${directorioUsuario}/${card.id_}.json`,
        JSON.stringify(card),
      );
      console.log(chalk.green("Card updated"));
    } else {
      throw chalk.red(new Error(`Card not found in ${process.env.USER}`));
    }
  }

  /**
   * @breif Modifica una propiedad de una carta existente.
   * @param cardID Id de la carta a modificar.
   * @param valueToChange Campo a modificar.
   * @param newValue Nuevo valor del campo.
   * Se verifica que la carta exista y que el campo a modificar exista en la carta.
   */
  modify(cardID: number, valueToChange: string, newValue: string | number) {
    if (fs.existsSync(`${directorioUsuario}/${cardID}.json`)) {
      const card = fs.readFileSync(
        `${directorioUsuario}/${cardID}.json`,
        "utf-8",
      );
      const cardObj = JSON.parse(card);
      if (cardObj[valueToChange] !== undefined) {
        cardObj[valueToChange] = newValue;
        fs.writeFileSync(
          `${directorioUsuario}/${cardID}.json`,
          JSON.stringify(cardObj),
        );
        console.log(chalk.green("Card modified"));
      } else {
        throw chalk.red(new Error("Property not found in object magicCard"));
      }
    } else {
      throw chalk.red(new Error(`Card not found in ${process.env.USER}`));
    }
  }

  /**
   * @brief Muestra todas las cartas del directorio del usuario.
   * Se leen todos los archivos del directorio del usuario y se muestran.
   */
  showAllCards() {
    const cards = fs.readdirSync(directorioUsuario);
    const cardsArray: magicCard[] = [];
    cards.forEach((card) => {
      cardsArray.push(
        JSON.parse(fs.readFileSync(`${directorioUsuario}/${card}`, "utf-8")),
      );
    });
    console.log(chalk.green("Showing cards"));
    cardsArray.forEach((card) => {
      console.log(
        chalk.blue(
          "-----------------------------------------------------------------------------------------------------------------",
        ),
      );
      console.log(chalk.blue(`ID: ${card.id_}`));
      console.log(chalk.blue(`Name: ${card.name_}`));
      console.log(chalk.blue(`Mana Cost: ${card.manaCost_}`));
      console.log(chalk.blue(`Color: ${card.color_}`));
      console.log(chalk.blue(`Type: ${card.typo_}`));
      console.log(chalk.blue(`Rare: ${card.rare_}`));
      console.log(chalk.blue(`Rules: ${card.rules_}`));
      console.log(chalk.blue(`Loyalty: ${card.loyalty_}`));
      console.log(chalk.blue(`Value: ${card.value_}`));
      if (card.strRes_) {
        console.log(chalk.blue(`Strength/Resistance: ${card.strRes_}`));
      }
    });
  }
}

```
_El uso de **fs** y **chalk** lo explicaremos en apartados posteriores._

> **[Volver al índice](#índice)**

- ### Uso de chalk

Usamos chalk para dar formato a la salida de errores y por consola en nuestro caso, el uso es simple.

```typescript

console.log(chalk.blue(`ID: ${card.id_}`));

```

> **[Volver al índice](#índice)**

- ### Uso de fs

Buscabamos tener una "aplicación" persistente, lo hemos conseguido mediante el uso de esta API.

```typescript

  constructor() {
    if (!fs.existsSync(directorioUsuario)) {
      fs.mkdirSync(directorioUsuario);
    }
  }

```
Vemos como en el constructor de la clase compobamos si el usuario tiene o no un directorio para almacenar sus cartas.

 - __fs.existsSync__ nos indicará si existe o no con un boleano.
 - __fs.mkdirSync__ crea los directorios necesarios.

 - En el guión se nos pide poner el nombre de usuario por comandos mediante yargs (Hablaremos sobre esto posteriormete), sin embargo he decidido implementar la creación de la siguiente manera:

 ```typescript
 const directorioUsuario = `./src/usuarios/${process.env.USER}`;
 ```

 Donde obtendremos el nombre del usuario que ejecuta el programa automáticamente.

 Siguiendo con los conceptos de fs, vamos a echar un vistazo a la función add.

 ```typescript
   add(card: magicCard) {
    if (fs.existsSync(`${directorioUsuario}/${card.id_}.json`)) {
      throw chalk.red(new Error(`Card already exists in ${process.env.USER}`));
    }
    fs.writeFileSync(
      `${directorioUsuario}/${card.id_}.json`,
      JSON.stringify(card),
    );
    console.log(chalk.green("Card added"));
  }
 ```

 - __fs.writeFileSync__ nos sirve para escribir en un archivo, deberemos pasar su ruta y lo que queremos escribir en el.
 - __JSON.stringfy(card)__ Coge un objeto y lo convierte en una cadena json.

 En la función delete, se utiliza `fs.unlinkSync(`${directorioUsuario}/${cardID}.json`);` para borrar el archivo seleccionado por el usuario.

 Por último, finalizando con este apartado veo necesario analizar la función propia modify.

 ```typescript
   modify(cardID: number, valueToChange: string, newValue: string | number) {
    if (fs.existsSync(`${directorioUsuario}/${cardID}.json`)) {
      const card = fs.readFileSync(
        `${directorioUsuario}/${cardID}.json`,
        "utf-8",
      );
      const cardObj = JSON.parse(card);
      if (cardObj[valueToChange] !== undefined) {
        cardObj[valueToChange] = newValue;
        fs.writeFileSync(
          `${directorioUsuario}/${cardID}.json`,
          JSON.stringify(cardObj),
        );
        console.log(chalk.green("Card modified"));
      } else {
        throw chalk.red(new Error("Property not found in object magicCard"));
      }
    } else {
      throw chalk.red(new Error(`Card not found in ${process.env.USER}`));
    }
  }
 ```

 - __fs.readFileSync__ Devuleve el contenido de un fichero.
 - __JSON.parse__ Función opuesta a stringfy, convierte una cadena en un objeto.

 Esta función la he añadido para probar el código y porque el usuario no siempre querrá editar la carta completa, entonces esta función te da la opción de hacerlo por campos.


> **[Volver al índice](#índice)**

- ### Uso de yargs

El uso de esta biblioteca, nos permitirá pasar parámetros a funciones mediante la línea de comandos.

```typescript
.command(
    "add",
    "Adds a card to the collection",
    {
      id: {
        description: "Card ID",
        type: "number",
        demandOption: true,
      },
      name: {
        description: "card name",
        type: "string",
        demandOption: true,
      },
      manaCost: {
        description: "Mana cost",
        type: "number",
        demandOption: true,
      },
      color: {
        description: "Color",
        choices: Object.values(color),
        demandOption: true,
      },
      type: {
        description: "Type",
        choices: Object.values(tipe),
        demandOption: true,
      },
      rare: {
        description: "Rare",
        choices: Object.values(rare),
        demandOption: true,
      },
      rules: {
        description: "Rules",
        type: "string",
        demandOption: true,
      },
      loyalty: {
        description: "Loyalty",
        type: "number",
        demandOption: true,
      },
      value: {
        description: "Value",
        type: "number",
        demandOption: true,
      },
      strRes: {
        description: "Strength/Resistance",
        type: "number",
      },
    },
    (argv) => {
      if (isNaN(argv.id)) {
        throw chalk.red(new Error("ID must be a number"));
      }

      if (typeof argv.name !== "string") {
        throw chalk.red(new Error("Name must be a string"));
      }

      if (isNaN(argv.manaCost)) {
        throw chalk.red(new Error("Mana Cost must be a number"));
      }

      if (!Object.values(color).includes(argv.color)) {
        throw chalk.red(new Error("Color must be a valid color"));
      }

      if (!Object.values(tipe).includes(argv.type)) {
        throw chalk.red(new Error("Type must be a valid type"));
      }

      if (!Object.values(rare).includes(argv.rare)) {
        throw chalk.red(new Error("Rare must be a valid rare"));
      }

      if (typeof argv.rules !== "string") {
        throw chalk.red(new Error("Rules must be a string"));
      }

      if (isNaN(argv.loyalty) && argv.type !== tipe.planeswalker) {
        throw chalk.red(new Error("Loyalty must be a number"));
      }
      
      if (isNaN(argv.value)) {
        throw chalk.red(new Error("Value must be a number"));
      }

      if (argv.strRes && isNaN(argv.strRes)) {
        throw chalk.red(new Error("Strength/Resistance must be a number"));
      }

      if (argv.strRes && argv.type !== tipe.creature) {
        throw chalk.red(
          new Error("Strength/Resistance is only for Creature type"),
        );
      }

      if (argv.type === tipe.creature && !argv.strRes) {
        throw chalk.red(
          new Error("Creature type must have Strength/Resistance"),
        );
      }

      const card = new magicCard(
        argv.id,
        argv.name,
        argv.manaCost,
        argv.color as color,
        argv.type as tipe,
        argv.rare as rare,
        argv.rules,
        argv.loyalty,
        argv.value,
        argv.strRes,
      );
      const json = new jsonCards();
      json.add(card);
    },
  )

```
Aquí vemos la implementación del comando add, con los diferentes parámetros necesarios para crear una carta, sus correspondientes condiciones, como que una carta **solo puede tener resitencia/fuerza si es de tipo 'creature' o que solo puede tener lealtad si es de tipo 'planeswalker'**.

> **[Volver al índice](#índice)**
## Problemas
__Nos surgen algunos problemas por la poca experiencia en el entorno y con las nombradas librerías, pese a la clara documentación de estas:__

- __chalk__ Debemos de usar ESM en vez de commonJS, esto nos hizo tener problemas con la acción de coveralls, ya que intentabamos realizar las pruebas con nyc, como ya sabemos este moodulo no trabaja con ESM, hay que utilizar c8.

-__yargs__ El problema surge con las variables de tipo enum.

```typescript
      type: {
        description: "Type",
        choices: Object.values(tipe),
        demandOption: true,
      },
```

  Hay que establecer un campo choices, en vez de type ya que el tipo del dato es una eleccion de un enum.

- __fs__ Pese a lo clara que es la documentación y lo facil que es de usar nos surgen algunos problemas con respecto a los objetos y la leectura de json, una vez comprendido el funcionamiento de `JSON.stringfy` y de `JSON.parse` fue bastante sencillo trabajar con la API.


> **[Volver al índice](#índice)**
## Referencias

[Yargs](https://www.npmjs.com/package/yargs)
[chalk](https://www.npmjs.com/package/chalk)
[fs](https://nodejs.org/api/fs.html)
[SonarCloud](#https://github.com/marketplace/actions/sonarcloud-scan)
[Enunciado de la práctica 11](https://ull-esit-inf-dsi-2324.github.io/prct11-http-express-magic-app/)
> **[Volver al índice](#índice)**
## Anexos
[Essential TypeScript](#https://learning-oreilly-com.accedys2.bbtk.ull.es/library/view/essential-typescript-from/9781484249796/html/481342_1_En_1_Chapter.xhtml)

> **[Volver al índice](#índice)**
