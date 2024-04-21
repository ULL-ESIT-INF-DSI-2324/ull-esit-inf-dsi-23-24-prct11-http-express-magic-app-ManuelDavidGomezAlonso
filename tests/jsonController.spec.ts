
import 'mocha';
import { expect, use } from 'chai';
import { jsonCards } from '../src/jsonController.js';
import { magicCard, color, tipe, rare} from '../src/magiCard.js';
import fs from 'fs';

const directorioUsuario = `./src/usuarios/jose`;

describe('JsonController pruebas', () => {

  it('should add a card', (done) => {
    const card = new magicCard("jose", 0, "Cazador", 16, color.multicolor, tipe.creature, rare.mythicRare, "No puede atacar cuerpo a cuerpo", 150, 100);
    const user = new jsonCards();
    user.add(card, (err, data) => {
      expect(err).to.equal(undefined);
      expect(data).to.equal('Card Added');
      done();
    });
  });

  it('should add a card that already exists', (done) => {
    const card = new magicCard("jose", 0, "Cazador", 16, color.multicolor, tipe.creature, rare.mythicRare, "No puede atacar cuerpo a cuerpo", 150, 100);
    const user = new jsonCards();
    user.add(card, (err, data) => {
      expect(err).to.equal('Card already exists');
      expect(data).to.equal(undefined);
      done();
    });
  });

  it('should delete a card', (done) => {
    const user = new jsonCards();
    user.delete("jose", 0, (err, data) => {
      expect(err).to.equal(undefined);
      expect(data).to.equal('Card deleted');
      done();
    });
  });

  it('should delete a card that does not exist', (done) => {
    const user = new jsonCards();
    user.delete("jose", 0, (err, data) => {
      expect(err).to.equal('Card or user not found');
      expect(data).to.equal(undefined);
      done();
    });
  });

it('should update a card', (done) => {
    const card = new magicCard("jose", 2, "Cazador", 16, color.multicolor, tipe.creature, rare.mythicRare, "No puede atacar cuerpo a cuerpo", 150, 100);
    const user = new jsonCards();
    user.update(card, (err, data) => {
      expect(err).to.equal(undefined);
      expect(data).to.equal('Card Updated');
      done();
    });
  });


  it('should update a card that does not exist', (done) => {  
    const card = new magicCard("jose", 0, "Cazador", 16, color.multicolor, tipe.creature, rare.mythicRare, "No puede atacar cuerpo a cuerpo", 150, 100);
    const user = new jsonCards();
    user.update(card, (err, data) => {
      expect(err).to.equal('Card not found');
      expect(data).to.equal(undefined);
      done();
    });
  });

  it('should show a card', (done) => {
    const user = new jsonCards();
    user.showCard("jose", 1, (err, data) => {
      expect(err).to.equal(undefined);
      expect(data).to.equal('{"user_":"jose","id_":1,"name_":"Cazador","manaCost_":16,"color_":"multicolor","typo_":"creature","rare_":"mythicRare","rules_":"No puede atacar cuerpo a cuerpo","value_":150,"strRes_":100}');
      done();
    });
  });

  it('should show a card that does not exist', (done) => {
    const user = new jsonCards();
    user.showCard("jose", 10, (err, data) => {
      expect(err).to.equal('Card or user not found');
      expect(data).to.equal(undefined);
      done();
    });
  });

  it('should show all cards of user', (done) => {
    const user = new jsonCards();
    user.showAllCards("jose", (err, data) => {
      expect(err).to.equal(undefined);
      const size = data?.length
      expect(size).to.equal(2);
      done();
    });
  });

  it ('should show all cards of user that does not exist', (done) => {
    const user = new jsonCards();
    user.showAllCards("rafael", (err, data) => {
      expect(err).to.equal('User not found');
      expect(data).to.equal(undefined);
      done();
    });
  });

  it('Should create a folder for the user using add function', (done) => {
    const card = new magicCard("luis", 0, "Cazador", 16, color.multicolor, tipe.creature, rare.mythicRare, "No puede atacar cuerpo a cuerpo", 150, 100);
    const user = new jsonCards();
    user.add(card, (err, data) => {
      expect(fs.existsSync('./src/usuarios/luis')).to.equal(true);
      done();
    });
  });

  it('should create a user directory', (done) => {
    
    if(fs.existsSync('./src/usuarios')){
      fs.rmSync('./src/usuarios', { recursive: true });
    }
    const user = new jsonCards();
    expect(fs.existsSync('./src/usuarios')).to.equal(true);
    done();
  });

  after(() => {
    if(fs.existsSync('./src/usuarios/jose')) {
      fs.rmdirSync(directorioUsuario, { recursive: true });
    }
    
  });
});