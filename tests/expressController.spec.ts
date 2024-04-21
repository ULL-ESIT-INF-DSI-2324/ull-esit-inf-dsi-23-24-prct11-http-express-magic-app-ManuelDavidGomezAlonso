import 'mocha';
import { expect } from 'chai';
import request from 'request';

// Constante de una url para realizar una petición a la api de tipo get
const url = 'http://localhost:3000/cards?user=jose&cardID=0';

// Realiza una petición get a la api y comprueba que se devuelva el error al traterase de una prueba con expectr
describe('Server funcionalities', () => {
  it('should return a 200 response', (done) => {
    request(url, {method: 'GET'}, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card or user not found');
      done();
    });
  });

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

  it('should add a card', (done) => {
    request.delete('http://localhost:3000/cards?user=jose&cardID=0');
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
      },
    }, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card Added');
      done();
    });
  });

  it('should add a card that already exists', (done) => {
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
      },
    }, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card already exists');
      done();
    });
  });

  //Actualizando una carta existente

  it('should update a card', (done) => {
    request.patch('http://localhost:3000/cards?user=jose&cardID=1', {
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
      },
    }, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card Updated');
      done();
    });
  });

  // Actualizando una carta que no existe

  it('should update a card that does not exist', (done) => {
    request.patch('http://localhost:3000/cards?user=jose&cardID=2', {
      json: {
        "user_": "jose",
        "id_": 1,
        "name_": "Cazador",
        "manaCost_": 16,
        "color_": "multicolor",
        "typo_": "creature",
        "rare_": "mythicRare",
        "rules_": "No puede atacar cuerpo a cuerpo",
        "value_": 150,
        "strRes_": 100,
      },
    }, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card not found');
      done();
    });
  });
  
  // Mostrando una carta que existe

  it('should show a card', (done) => {
    request.get('http://localhost:3000/cards?user=jose&cardID=0', (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('{"user_":"jose","id_":0,"name_":"Cazador","manaCost_":16,"color_":"multicolor","typo_":"creature","rare_":"mythicRare","rules_":"No puede atacar cuerpo a cuerpo","value_":150,"strRes_":100}');
      done();
    });
  });

  // Mostrando una carta que no existe

  it('should show a card that does not exist', (done) => {
    request.get('http://localhost:3000/cards?user=jose&cardID=1', (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card or user not found');
      done();
    });
  });

  // Mostrando todas las cartas del usuario.

  it('should show all cards', (done) => {
    request.get('http://localhost:3000/cards?user=jose', (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      //pone la barra invertida para que no se muestre como un string
      expect(body).to.equal('[{"user_":"jose","id_":0,"name_":"Cazador","manaCost_":16,"color_":"multicolor","typo_":"creature","rare_":"mythicRare","rules_":"No puede atacar cuerpo a cuerpo","value_":150,"strRes_":100}]');
      done();
    });
  });

  // Mostrando carta de un usuario que no existe.

  it('should show all cards of a user that does not exist', (done) => {
    request.post('http://localhost:3000/cards?user=jose', {
      json: {
        "user_": "jose",
        "id_": 1,
        "name_": "Cazador",
        "manaCost_": 16,
        "color_": "multicolor",
        "typo_": "creature",
        "rare_": "mythicRare",
        "rules_": "No puede atacar cuerpo a cuerpo",
        "value_": 150,
        "strRes_": 100,
      },
    }, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card Added');
    });
    request.get('http://localhost:3000/cards?user=juan', (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('User not found');
      done();
    });
  });

  // Eliminando una carta que existe

  it('should delete a card', (done) => {
    request.delete('http://localhost:3000/cards?user=jose&cardID=0', (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card deleted');
      done();
    });
  });

  // Eliminando carta que no existe

  it('should delete a card that does not exist', (done) => {
    request.delete('http://localhost:3000/cards?user=jose&cardID=0', (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card or user not found');
      done();
    });
  });

  // Eliminando carta de un usuario que no existe

  it('should delete a card of a user that does not exist', (done) => {
    request.delete('http://localhost:3000/cards?user=juan&cardID=0', (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('Card or user not found');
      done();
    });
  });

    // mostando mas de una cata
    it('should show all cards', (done) => {
      request.post('http://localhost:3000/cards?user=jose', {
        json: {
          "user_": "jose",
          "id_": 1,
          "name_": "Cazador",
          "manaCost_": 16,
          "color_": "multicolor",
          "typo_": "creature",
          "rare_": "mythicRare",
          "rules_": "No puede atacar cuerpo a cuerpo",
          "value_": 150,
          "strRes_": 100,
        }
      });
      request.post('http://localhost:3000/cards?user=jose', {
        json: {
          "user_": "jose",
          "id_": 2,
          "name_": "Cazador",
          "manaCost_": 16,
          "color_": "multicolor",
          "typo_": "creature",
          "rare_": "mythicRare",
          "rules_": "No puede atacar cuerpo a cuerpo",
          "value_": 150,
          "strRes_": 100,
        },
      });
      
      request.get('http://localhost:3000/cards?user=jose', (error, response, body) => {
        expect(response.statusCode).to.equal(200);
        expect(body).to.equal(`[{"user_":"jose","id_":1,"name_":"Cazador","manaCost_":16,"color_":"multicolor","typo_":"creature","rare_":"mythicRare","rules_":"No puede atacar cuerpo a cuerpo","value_":150,"strRes_":100},{"user_":"jose","id_":2,"name_":"Cazador","manaCost_":16,"color_":"multicolor","typo_":"creature","rare_":"mythicRare","rules_":"No puede atacar cuerpo a cuerpo","value_":150,"strRes_":100}]`);
        done();
      });
    });
});
