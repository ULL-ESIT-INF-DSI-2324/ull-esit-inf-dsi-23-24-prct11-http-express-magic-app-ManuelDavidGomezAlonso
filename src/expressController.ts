import { jsonCards } from "./jsonController.js";
import express from "express";
import chalk from "chalk";
import { magicCard, color, tipe, rare } from "./magiCard.js";

export const app = express();

/**
 * @brief Función que comprueba si un json es correcto respecto a una carta magic.
 * @param str Cadena con el json a revisar.
 * @returns Un json con el error o el json correcto.
 */
function jsonRev(str: string) {
  const json = JSON.parse(str);
  if (typeof json.user_ !== "string") {
    return { error: "User must be a string" };
  }
  if (isNaN(json.id_)) {
    return { error: "ID must be a number" };
  }
  if (typeof json.name_ !== "string") {
    return { error: "Name must be a string" };
  }
  if (isNaN(json.manaCost_)) {
    return { error: "Mana Cost must be a number" };
  }
  if (!Object.values(color).includes(json.color_)) {
    return { error: "Color must be a valid color" };
  }
  if (!Object.values(tipe).includes(json.typo_)) {
    return { error: "Type must be a valid type" };
  }
  if (!Object.values(rare).includes(json.rare_)) {
    return { error: "Rare must be a valid rare" };
  }
  if (typeof json.rules_ !== "string") {
    return { error: "Rules must be a string" };
  }
  if (json.typo_ === Object.values(tipe)[5]) {
    if (!json.loyalty_) {
      return { error: "Planeswalker type must have Loyalty" };
    }
  } else {
    if (json.loyalty_ !== undefined) {
      return { error: "Loyalty is only for planeswalker type" };
    }
  }
  if (isNaN(json.value_)) {
    return { error: "Value must be a number" };
  }
  if (json.strRes_ && isNaN(json.strRes_)) {
    return { error: "Strength/Resistance must be a number" };
  }
  if (json.typo_ === Object.values(tipe)[0]) {
    if (!json.strRes_) {
      return { error: "Creature type must have Strength/Resistance" };
    }
  } else {
    if (json.strRes_ !== undefined) {
      return { error: "Strength/Resistance is only for Creature type" };
    }
  }
  return json;
}

/**
 * @brief Petición get sobre la api. Mostrará una carta si se pasa el id en la query string o toda la colección si solmanete se pasa el usuario.
 * __Ejemplo de petición:__
 * ```url
 * http://localhost:3000/cards?user=jose&cardID=0
 * ```
 * __Ejemplo de petición:__
 * ```url
 * http://localhost:3000/cards?user=jose
 * ```
 */
app.get("/cards", (req, res) => {
  const user = new jsonCards();
  if (req.query.user && !req.query.cardID) {
    user.showAllCards(req.query.user.toString(),(error,data)=>{
      if (error) {
          console.log(chalk.red(error));
          res.send(error);
      } else if (data){
        console.log(chalk.green('Showing cards'));
        res.send(data);
      }
    });
  } else if (req.query.user && req.query.cardID) {
    user.showCard(
      req.query.user.toString(),
      parseInt(req.query.cardID.toString()),(error,data)=>{
        if (error) {
          console.log(chalk.red(error));
          res.send(error);
        } else {
          console.log(chalk.green('Showing card'));
          res.send(data);
        }
      });
    } else {
      res.send(`"error": "Error user not valid"`);
    }
  });

/**
 * @brief Petición post sobre la api. Creará una carta si se pasa el usuario en la query string, y los datos correctos de la carta, mediante un json en el cuerpo de la petición.
 * __Ejemplo de petición:__
 * ```json
 {
 "user_":"jose",
 "id_": 0,
 "name_": "Cazador",
 "manaCost_": 16,
 "color_": "multicolor",
 "typo_": "creature",
 "rare_": "mythicRare",
 "rules_": "No puede atacar cuerpo a cuerpo",
 "value_": 150,
 "strRes_": 100
 }
 * ```
 */
app.post("/cards", express.json(), (req, res) => {
  const user = new jsonCards();
  if (req.query.user) {
    if (!jsonRev(JSON.stringify(req.body)).error) {
      const card: magicCard = new magicCard(
        req.query.user.toString(),
        req.body.id_,
        req.body.name_,
        req.body.manaCost_,
        req.body.color_,
        req.body.typo_,
        req.body.rare_,
        req.body.rules_,
        req.body.value_,
        req.body.strRes_,
        req.body.loyalty_,
      );
      user.add(card, (err, data) => {
        if (err) {
          console.log(chalk.red(err));
          res.send(err);
        } else {
          console.log(chalk.green(data));
          res.send(data);
        }
      }
    );
    } else {
      res.send((jsonRev(JSON.stringify(req.body)).error));
    }
  } else {
    res.send("User must be in query string");
  }
});

/**
 * @brief Petición delete sobre la api. Eliminará una carta si se pasa el usuario y el id de la carta en la query string.
 * __Ejemplo de petición:__
 * ```url
 * http://localhost:3000/cards?user=jose&cardID=0
 * ```
 */
app.delete("/cards", (req, res) => {
  const action = new jsonCards();
  const card = req.query.cardID;
  const user = req.query.user?.toString();
  if (user && card) {
    action.delete(user, parseInt(card.toString()),(err,data)=>{
      if (err) {
        console.log(chalk.red(err));
        res.send(err);
      } else {
        console.log(chalk.green(data));
        res.send(data);
      }
    });
  } else {
    res.send("Error user or ID not valid");
  }
});

/**
 * @brief Petición patch sobre la api. Actualizará una carta si se pasa el usuario y el id de la carta en la query string, y los datos correctos de la carta, mediante un json en el cuerpo de la petición.
 * __Ejemplo de petición:__
 * ```url
 * http://localhost:3000/cards?user=jose&cardID=0
 * ```
 * ```json
 {
 "user_":"jose",
 "id_": 0,
 "name_": "Cazador",
 "manaCost_": 16,
 "color_": "multicolor",
 "typo_": "creature",
 "rare_": "mythicRare",
 "rules_": "No puede atacar cuerpo a cuerpo",
 "value_": 150,
 "strRes_": 100
 }
 * ```
 */
app.patch("/cards", express.json(), (req, res) => {
  const action = new jsonCards();
  const card = req.query.cardID;
  const user = req.query.user?.toString();
  if (user && card) {
    if (!jsonRev(JSON.stringify(req.body)).error) {
      const card = new magicCard(
        user,
        req.body.id_,
        req.body.name_,
        req.body.manaCost_,
        req.body.color_,
        req.body.typo_,
        req.body.rare_,
        req.body.rules_,
        req.body.value_,
        req.body.strRes_,
        req.body.loyalty_,
      );
      action.update(card, (err, data) => {
        if (err) {
          console.log(chalk.red(err));
          res.send(err);
        } else {
          console.log(chalk.green(data));
          res.send(data);
        }
    });
    } else {
      res.send(jsonRev(JSON.stringify(req.body)));
    }
  } else {
    res.send("Error user or ID not valid");
  }
});

/**
 * @brief Petición put sobre la api. Escuchamos sobre el puerto 3000.
 */
app.listen(3000, "0.0.0.0", () => {
  chalk.blue(console.log("Server is running on port 3000"));
});
