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
   - [Cambios en el controlador del JSON](#Cambios-en-el-controlador-del-JSON)
   - [Implementacion del server](#Implementacion-del-server)
   - [Pruebas con express](#Pruebas-con-request)
   - [Modificacion](#Modificacion)
3. [Problemas](#alternativas)
4. [Referencias](#referencias)
5. [Anexos](#anexos)

## Resumen
Seguimos trabajando con la app de las cartas magic, las funcionalidades son las mismas pero hay cambios significativos. En este caso toda la gestion de ficheros se hará mediante el uso de la api asícrona de node.js, utilizando el patrón de diseño callback para que las pruebas sean más sencillas de realizar.

Además creaemos una API para la gestión de las cartas mediante un servidor express, utilizando peticiones htttp para realizar las diferentes acciones posibles sobre la coleccion de los usuarios.

> **[Volver al índice](#índice)**

## Apartados
- ### Cambios en el controlador JSON

Lo primero que hicimos fue empaparnos bien sobre los servidores express, la verdad es que en los apuntes de la asignatura se explica perfectamente su uso, además para realizar peticiones a nuestro server utilizaremos thunder-client, que es bastante intuitivo y facil de utilizar.

Para realizar las pruebas con mocha y chai vamos a usar request (Lo veremos posteriormente). Vamos a hablar rápidamente de los cambios que hemos introducido en el controlador del json.

### Api Asíncrona.

```typescript
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
```

Utilizaremos la función `delete` como ejemplo, podemos ver que se utiliza la api asíncrona para leer el fichero y el patron callback tendra uno de los dos campos posibles a undefined y otro con información ya sean los datos o los posibles errores.

  ### Devolución de JSON

La función `showCard` y `ShowAllCards` deberán devolver los correspondientes JSONs para servir correctamente a las consultas de tipo `get` que se puedan llegar a realizar.

```typescript
  showAllCards(user: string, callback: (err: string | undefined , data: string[] | undefined ) => void){
    const cardsArray: string[] = [];
    const dirPath = `${directorioUsuario}/${user}`;
    fs.readdir(dirPath, (err, files) => {
      if (err){
        callback('User not found', undefined);
      } else {
        files.forEach((file) => {
          fs.readFile(`${dirPath}/${file}`, (err, file) => {
            cardsArray.push(JSON.parse(file.toString()));
            if (cardsArray.length === files.length) {
              callback(undefined, cardsArray);
            }

          });
        });    
      }
    });
    
  }
```
Vemos que cuando el vector de los JSON sea del mismo tamaño que le fichero del usuario el patrón callback lo devolverá.

```typescript
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
```

En el caso de `ShowCard` devolverá el json del usuario con el id establecido, si existe en la colección obviamente.

> **[Volver al índice](#índice)**

- ### Implementacion del server.

A la hora de implementar el server se nos pide que utilicemos las peticiones http `get`, `post`, `patch` y `delete`, lo haremos de la siguiente manera:

- __Peticiones get__

```typescript
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
```

La ruta que utilizaremos sera `/cards`. Si en el link de la petición, en la query string especificamos un **id** de una carta se nos mostrará la misma en caso de que exista, si no hacemos esto, y solo ponemos el nombre del usuario se nos mostrarán todas las cartas de este.

-__Petición post__ 

Esta petición añadirá cartas a la colección del usuario. Deberemos pasarle en la query el nombre del usuario y el id de la carta.

```typescript
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
```

Tenemos que pasar en el cuerpo de la petición un json con la carta que desee añadir el usuario y la función `jsonRev` sirve para verificar si el lore de la carta es el correcto, si no nos devolverá un error.

- __Petición patch__

Esta petición es la más sencilla, básicamente hace lo mismo que una petición `post` pero el json a modificar debe existir anteriormente.

```typescript
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
```

- __Petición delete__

La petición `delete` se encargará de borrar las cartas no deseadas por el usuario, para ello le pasaremos en la query el id y le nombre del usuario.

```typescript
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
``` 

> **[Volver al índice](#índice)**

- ### Pruebas con request.

```typescript
  it('should add a card with bad lore', (done) => {
    request.post('http://localhost:3000/cards?user=jose', {
      json: {
        "user_": "jose",
        "id_": 0,
        "name_": "Cazador",
        "manaCost_": 16,
        "color_": "multicolor",
        "typo_": "creature",
        "rare_": "mythicRare",
        "rules_": "No puede atacar cuerpo a cuerpo",
        "value_": 150,
        "strRes_": 100,
        "loyalty_": 1000
      },
    }, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Loyalty is only for planeswalker type');
      done();
    });
  });
```

Para hacer las pruebas utilizaremos request que recibe como parámetros de una consulta, **el tipo de petición**, **la url base**, **la query string** y **El cuerpo**.
En `response` se almacenará la respuesta del server y es lo que utilizaremos para comprobar el correcto funcionamiento de este.


> **[Volver al índice](#índice)**

### Modificacion.

En cuanto a la modificación, básicamente fue implementar dos funciones de gestión de cartas magic con la api asícrona y el patrón callback, como hemos hecho en el resto de la practica.

```typescript
  add(card: magicCard, callback: (
    err: string | undefined ,data: string | undefined ) => void) {
        readFile(`${directorioUsuario}/${card.id_}.json`, (err) => {
          if (err){
            writeFile(`${directorioUsuario}/${card.id_}.json`, JSON.stringify(card),() => {
              callback(undefined, 'Card Added')
            });
          } else {
            callback('Card alredy exist', undefined);            
          }
        });
  }
```

Vemos como se devuelve **Card Added** si la carta se añade y **Card already exist** si ya existe la carta.

> **[Volver al índice](#índice)**
## Referencias

[SonarCloud](#https://sonarcloud.io/project/configuration/GitHubActions?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-ManuelDavidGomezAlonso)
[Enunciado de la práctica 11](https://ull-esit-inf-dsi-2324.github.io/prct11-http-express-magic-app/)
> **[Volver al índice](#índice)**
## Anexos
[Essential TypeScript](#https://learning-oreilly-com.accedys2.bbtk.ull.es/library/view/essential-typescript-from/9781484249796/html/481342_1_En_1_Chapter.xhtml)

> **[Volver al índice](#índice)**
