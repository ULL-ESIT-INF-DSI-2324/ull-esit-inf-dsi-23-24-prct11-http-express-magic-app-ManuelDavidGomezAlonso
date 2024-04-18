import { jsonCards } from "./jsonController.js";
import express from "express";
import chalk from "chalk";
import { magicCard,color, tipe, rare } from "./magiCard.js";

const app = express();

function jsonRev(str:string) {
  let json;
  try {
    json = JSON.parse(str);
  } catch (error) {
    return { error: 'Invalid JSON format' };
  }

  if (typeof json.user_ !== 'string') {
    return { error: 'User must be a string' };
  }
  if (isNaN(json.id_)) {
    return { error: 'ID must be a number' };
  }
  if (typeof json.name_ !== 'string') {
    return { error: 'Name must be a string' };
  }
  if (isNaN(json.manaCost_)) {
    return { error: 'Mana Cost must be a number' };
  }
  if (!Object.values(color).includes(json.color_)) {
    return { error: 'Color must be a valid color' };
  }
  if (!Object.values(tipe).includes(json.typo_)) {
    return { error: 'Type must be a valid type' };
  }
  if (!Object.values(rare).includes(json.rare_)) {
    return { error: 'Rare must be a valid rare' };
  }
  if (typeof json.rules_ !== 'string') {
    return { error: 'Rules must be a string' };
  }
  if (json.typo_ === Object.values(tipe)[5]) {
    if (!json.loyalty_) {
      return { error: 'Planeswalker type must have Loyalty' };
    }
  } else {
    if (json.loyalty_ !== undefined) {
      return { error: 'Loyalty is only for planeswalker type' };
    }
  }
  if (isNaN(json.value_)) {
    return { error: 'Value must be a number' };
  }
  if (json.strRes_ && isNaN(json.strRes_)) {
    return { error: 'Strength/Resistance must be a number' };
  }
  if (json.typo_ === Object.values(tipe)[0]) {
    if (!json.strRes_) {
      return { error: 'Creature type must have Strength/Resistance' };
    }
  } else {
    if (json.strRes_ !== undefined) {
      return { error: 'Strength/Resistance is only for Creature type' };
    }
  }
  return json;
}

app.get("", (_, res) => {
  res.send("<h1>My application</h1>");
});

app.get("/cards", (req, res) => {
  const user = new jsonCards();
  if (req.query.user && !req.query.cardID) {
    const collection = user.showAllCards(req.query.user.toString());
    if (collection) {
      let html = `<h1>Collection of ${req.query.user}</h1>`;
      collection.forEach((card) => {
        html += "<br>";
        html += `<h2>${card.id_}</h2>
        <p>${card.name_}</p>
        <p>${card.manaCost_}</p>
        <p>${card.color_}</p>
        <p>${card.typo_}</p>
        <p>${card.rare_}</p>
        <p>${card.rules_}</p>
        <p>${card.value_}</p>
        `;
        if (card.strRes_) {
          html += `<p>${card.strRes_}</p>`;
        }
        if (card.loyalty_) {
          html += `<p>${card.loyalty_}</p>`;
        }
      });
      res.send(html);
    } else {
      res.send("<h1>Error</h1>");
    }
  } else if (req.query.user && req.query.cardID) {
    const card = user.showCard(
      req.query.user.toString(),
      parseInt(req.query.cardID.toString()),
    );
    let html = `<h1>Card ${card.id_} of ${req.query.user}</h1>`;
    html += "<br>";
    html += `<h2>${card.id_}</h2>
        <p>${card.name_}</p>
        <p>${card.manaCost_}</p>
        <p>${card.color_}</p>
        <p>${card.typo_}</p>
        <p>${card.rare_}</p>
        <p>${card.rules_}</p>
        <p>${card.value_}</p>
        `;
    if (card.strRes_) {
      html += `<p>${card.strRes_}</p>`;
    }
    if (card.loyalty_) {
      html += `<p>${card.loyalty_}</p>`;
    }
    res.send(html);
  } else {
    res.send("<h1>Error</h1>");
  }
});

app.post("/cards", express.json(), (req, res) => {
  const user = new jsonCards();
  if (req.query.user) {
    if(!jsonRev(JSON.stringify(req.body)).error){
      const card:magicCard = new magicCard(req.query.user.toString(),req.body.id_,req.body.name_,req.body.manaCost_,req.body.color_,req.body.typo_,req.body.rare_,req.body.rules_,req.body.value_,req.body.strRes_,req.body.loyalty_);
      user.add(card);
      res.send("Card created");
    } else {
      res.send(jsonRev(JSON.stringify(req.body)));
    }

  } else {
  res.send("EL user must be in query string");
}
});

app.delete("/cards", (req, res) => {
  const action= new jsonCards();
  const card = req.query.cardID;
  const user = req.query.user?.toString();
  if(user && card){
    action.delete(user,parseInt(card.toString()));
    res.send("Card deleted");
  } else {
    res.send("Error user or ID not valid");
  }
}
);

app.patch("/cards", express.json(), (req, res) => {
  const action = new jsonCards();
  const card = req.query.cardID;
  const user = req.query.user?.toString();
  if(user && card){
    if (!jsonRev(JSON.stringify(req.body)).error) {
      const card = new magicCard(user,req.body.id_,req.body.name_,req.body.manaCost_,req.body.color_,req.body.typo_,req.body.rare_,req.body.rules_,req.body.value_,req.body.strRes_,req.body.loyalty_);
      action.update(card);
      res.send("Card updated");
    } else {
      res.send(jsonRev(JSON.stringify(req.body)));
    }
  } else {
    res.send("Error user or ID not valid");
  }
});

app.listen(3000, "0.0.0.0", () => {
  chalk.blue(console.log("Server is running on port 3000"));
});


