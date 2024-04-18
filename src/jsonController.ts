/**
 * @fileoverview jsonController.ts - Controla las acciones sobre los Json que representan las cartas de Magic
 */

import * as fs from "fs";
import { magicCard } from "./magiCard.js";
import chalk from "chalk";

const directorioUsuario = `./src/usuarios/`;
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
    if (!fs.existsSync(`${directorioUsuario}/${card.user_}`)) {
      fs.mkdirSync(`${directorioUsuario}/${card.user_}`);
    }
    if (fs.existsSync(`${directorioUsuario}/${card.user_}/${card.id_}.json`)) {
      chalk.red(console.log(`Card already exists in ${card.user_}`));
    } else {
      fs.writeFileSync(
        `${directorioUsuario}/${card.user_}/${card.id_}.json`,
        JSON.stringify(card),
      );
      console.log(chalk.green("Card added"));
    }
  }

  /**
   * @brief Elimina una carta del directorio del usuario.
   * @param cardID ID de la carta a eliminar.
   */
  delete(user: string, cardID: number) {
    if (fs.existsSync(`${directorioUsuario}/${user}/${cardID}.json`)) {
      fs.unlinkSync(`${directorioUsuario}/${user}/${cardID}.json`);
      console.log(chalk.green("Card deleted"));
    } else {
      chalk.red(console.log(`Card not found in ${user}`));
    }
  }

  /**
   * @brief Muestra una carta del directorio del usuario.
   * @param showIDCard ID de la carta a mostrar.
   */
  showCard(user: string, showIDCard: number) {
    const filePath = `${directorioUsuario}/${user}/${showIDCard}.json`;
    if (fs.existsSync(filePath)) {
      console.log(chalk.green("Showing card"));
      const cardData = fs.readFileSync(filePath, "utf-8");
      const card = JSON.parse(cardData);
      return card;
    } else {
      chalk.red(console.log(`Card not found in ${user}`));
      return undefined;
    }
  }

  /**
   * @brief Actualiza una carta del directorio del usuario, lo que quiere decir que la carta debe existir.
   * @param card Carta a actualizar.
   */
  update(card: magicCard) {
    if (fs.existsSync(`${directorioUsuario}/${card.user_}/${card.id_}.json`)) {
      fs.writeFileSync(
        `${directorioUsuario}/${card.id_}.json`,
        JSON.stringify(card),
      );
      console.log(chalk.green("Card updated"));
    } else {
      chalk.red(console.log(`Card not found in ${card.user_}`));
    }
  }

  /**
   * @brief Muestra todas las cartas del directorio del usuario.
   * Se leen todos los archivos del directorio del usuario y se muestran.
   */
  showAllCards(user: string) {
    const cards = fs.readdirSync(`${directorioUsuario}/${user}`);
    const cardsArray: magicCard[] = [];
    cards.forEach((card) => {
      cardsArray.push(
        JSON.parse(
          fs.readFileSync(`${directorioUsuario}/${user}/${card}`, "utf-8"),
        ),
      );
    });
    return cardsArray;
  }
}
