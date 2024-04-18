
import 'mocha';
import { expect } from 'chai';
import { jsonCards } from '../src/jsonController.js';
import { magicCard, color, tipe, rare} from '../src/magiCard.js';
import fs from 'fs';
import chalk from 'chalk';

const directorioUsuario = `./src/usuarios/jose`;

describe('JsonController', () => {

  it('should create an instance', () => {
    expect(new jsonCards()).to.be.an.instanceOf(jsonCards);
  });

  it('should create a directory usuarios', () => {
    if (fs.existsSync('./src/usuarios')) {
      fs.rmdirSync('./src/usuarios', { recursive: true });  
    }
    new jsonCards();
    expect(fs.existsSync('./src/usuarios')).to.be.equal(true);
  });

  it('should add a card to the list', () => {
    let files;
    if (!fs.existsSync(directorioUsuario)){
      files = 0;
    } else {
      files = fs.readdirSync(directorioUsuario).length;
    }
    const preadd = files;
    const controller = new jsonCards();
    const cart = new magicCard('jose',0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);    
    if (fs.existsSync(`${directorioUsuario}/0.json`)){
      expect(fs.existsSync(`${directorioUsuario}/0.json`)).to.be.equal(true);
    } else {
    controller.add(cart);
    const postadd = fs.readdirSync(directorioUsuario).length;
    expect(postadd).to.be.equal(preadd + 1);
    }
  });

  it('should not add a card already exist', () => {
    const preadd = fs.readdirSync(directorioUsuario).length;
    const controller = new jsonCards();
    const cart = new magicCard('jose',0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    controller.add(cart);
    const postadd = fs.readdirSync(directorioUsuario).length;
    expect(postadd).to.be.equal(preadd);
  });

  it('should update a card', () => {
    const preadd = fs.readdirSync(directorioUsuario).length;
    const controller = new jsonCards();
    const newCart = new magicCard('jose',10000,'Jose', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    controller.update(newCart);
    const postadd = fs.readdirSync(directorioUsuario).length;
    expect(postadd).to.be.equal(preadd);
  });

  it('should update a card', () => {
    const controller = new jsonCards();
    const newCart = new magicCard('jose', 0, 'Jose', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(newCart);
    }
    controller.update(newCart);
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    let modified = true;
    if (card.name_ === newCart.name_){
      modified = false;
    }
    expect(modified).to.be.equal(true);
  });

  it('should show all cards', () => {
    const controller = new jsonCards();
    const cart = new magicCard('jose', 0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    const cart2 = new magicCard('jose', 2,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (
      !fs.existsSync(`${directorioUsuario}/0.json`)){
    controller.add(cart);
      }
    if ( !fs.existsSync(`${directorioUsuario}/2.json`)){
    controller.add(cart2);
    }
    controller.showAllCards('jose');
    const files = fs.readdirSync(directorioUsuario);
    expect(files.length).to.be.equal(2);
  });

  it('should delete a card', () => {
    const controller = new jsonCards();
    const preadd = fs.readdirSync(directorioUsuario).length;
    controller.delete('jose', 1000);
    const postadd = fs.readdirSync(directorioUsuario).length;
    expect(postadd).to.be.equal(preadd);
  });

  it('should delete a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard('jose',0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    const cart2 = new magicCard('jose',2,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    if ( !fs.existsSync(`${directorioUsuario}/2.json`)){
      controller.add(cart2);
    }
    controller.delete('jose', 0);
    let files
    if (fs.existsSync(`${directorioUsuario}/0.json`)){
      files = fs.readdirSync(`${directorioUsuario}/0.json`);
    } else {
      files = undefined;
    }
    expect(files).to.be.equal(undefined);
  });

  it('should delete a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard('jose', 0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    if (fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.delete('jose',0);
    }
    let files
    if (fs.existsSync(`${directorioUsuario}/0.json`)){
      files = fs.readdirSync(`${directorioUsuario}/0.json`);
    } else {
      files = undefined;
    }
    expect(files).to.be.equal(undefined);
  });

  it('should show a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard
    ('jose', 0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    controller.showCard('jose', 0);
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    expect(card.name_).to.be.equal(cart.name_);
  });

  it('should show a card', () => {
    const controller = new jsonCards();
    controller.showCard('jose', 1000);
    expect(!fs.existsSync(`${directorioUsuario}/1000.json`));
  });

  after(() => {
    if (fs.existsSync('./src/usuarios')) {
      fs.rmdirSync('./src/usuarios', { recursive: true });
    }
  });
});