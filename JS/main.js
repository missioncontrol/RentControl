/*global Calculator, Home, getRoomsFromTables */

function buildHome() {
  'use strict';
  var rooms = getRoomsFromTables(),
    homes = new Home({
      rooms: rooms
    });
    //calculator = new Calculator(homes);
  getRoomsFromTables();
}

document.addEventListener('DOMContentLoaded', buildHome, false);