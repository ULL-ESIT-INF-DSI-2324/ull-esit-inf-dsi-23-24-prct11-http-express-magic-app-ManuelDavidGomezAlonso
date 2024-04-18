/**
 * @fileoverview magicCard class - Representa una carta de Magic.
 */

/**
 * @brief Enumerado color - Representa los colores de las cartas de Magic.
 */
export enum color {
  white,
  blue,
  black,
  red,
  green,
  colorless,
  multicolor,
}

/**
 * @brief Enumerado rare - Representa la rareza de las cartas de Magic.
 */
export enum rare {
  common,
  uncommon,
  rare,
  mythicRare,
}

/**
 * @brief Enumerado tipe - Representa el tipo de carta de Magic.
 */
export enum tipe {
  creature,
  enchantment,
  artifact,
  instant,
  sorcery,
  planeswalker,
  land,
}

/**
 * @brief Clase magicCard - Representa una carta de Magic.
 */
export class magicCard {
  constructor(
    public user_: string,
    public id_: number,
    public name_: string,
    public manaCost_: number,
    public color_: color,
    public typo_: tipe,
    public rare_: rare,
    public rules_: string,
    public value_: number,
    public strRes_?: number,
    public loyalty_?: number,
  ) {}
}
