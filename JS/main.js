/*global Calculator, Home, getRoomsFromTables */

function buildHome() {
  'use strict';
  var rooms = getRoomsFromTables(),
    home = new Home({
      rooms: rooms
    });
    //calculator = new Calculator(homes);
  home.getAttributesFromTable();
}

document.addEventListener('DOMContentLoaded', buildHome, false);