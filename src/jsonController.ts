/**
 * @fileoverview jsonController.ts - Controla las acciones sobre los Json que representan las cartas de Magic
 */

import * as fs from "fs";
import { readFile, writeFile } from "fs";
import { magicCard } from "./magiCard.js";

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
  add(card: magicCard, callback: (
    err: string | undefined ,data: string | undefined ) => void) {
    if (!fs.existsSync(`${directorioUsuario}/${card.user_}`)) {
      fs.mkdirSync(`${directorioUsuario}/${card.user_}`);
    }
    readFile(`${directorioUsuario}/${card.user_}/${card.id_}.json`, (err) => {
      if (err){
        writeFile(`${directorioUsuario}/${card.user_}/${card.id_}.json`, JSON.stringify(card),() => {
          callback(undefined, 'Card Added');
        });
      } else {
        callback('Card already exists', undefined);            
      }
    });
      
  }

  /**
   * @brief Elimina una carta del directorio del usuario.
   * @param cardID ID de la carta a eliminar.
   */
  delete(user: string, cardID: number, callback: (err: string | undefined , data: string | undefined) => void ){
    const filePath = `${directorioUsuario}/${user}/${cardID}.json`;
    readFile(filePath, (err) => {
      if (err){
        callback('Card or user not found', undefined);
      } else {
        // eliminanndo directorio asincornamente
        fs.unlink(filePath, () => {
          callback(undefined, 'Card deleted');
        });
      }
    });
  }

  /**
   * @brief Muestra una carta del directorio del usuario.
   * @param showIDCard ID de la carta a mostrar.
   */
  showCard(user:string, showIDCard: number, callback: (
    err: string | undefined , data: string | undefined ) => void) {
    const filePath = `${directorioUsuario}/${user}/${showIDCard}.json`;
    readFile(filePath, (err, data) =>{
      if (err){
        callback('Card or user not found', undefined);
      } else if (data){
        callback(undefined, data.toString());
      }
    });
  }

  /**
   * @brief Actualiza una carta del directorio del usuario, lo que quiere decir que la carta debe existir.
   * @param card Carta a actualizar.
   */
  update(card: magicCard, callback: ( err: string | undefined , data: string | undefined ) => void ){
    const filePath = `${directorioUsuario}/${card.user_}/${card.id_}.json`;
    readFile(filePath, (err) => {
      if (err){
        callback('Card not found', undefined);
      } else {
        writeFile(filePath, JSON.stringify(card), () => {
          callback(undefined, 'Card Updated');
        });
      }
    }); 
  }

  /**
   * @brief Muestra todas las cartas del directorio del usuario.
   * Se leen todos los archivos del directorio del usuario y se muestran.
   */
  showAllCards(user: string, callback: (err: string | undefined , data: string[] | undefined ) => void){
    const cardsArray: string[] = [];
    const dirPath = `${directorioUsuario}/${user}`;
    fs.readdir(dirPath, (err, files) => {
      if (err){
        callback('User not found', undefined);
      } else {
        files.forEach((file) => {
          cardsArray.push(JSON.stringify(file));
        });    
        callback(undefined, cardsArray);
      }
    });
    
  }
}
