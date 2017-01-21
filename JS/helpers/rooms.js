/*global console, parseItem */

function createRoomsFromDefaults() {
  'use strict';
}

function getRoomsFromTables() {
  'use strict';
  var tables = document.getElementsByClassName('room'),
    table,
    tr,
    tdName,
    tdContent,
    rooms = {},
    roomId;
  for (table in tables) {
    if (tables.hasOwnProperty(table)) {
      roomId = tables[table].rows[0].textContent;
      rooms[roomId] = {};
      for (tr = 1; tr < tables[table].rows.length; tr += 1) {
        if (tables[table].rows.hasOwnProperty(tr)) {
          tdName = tables[table].rows[tr].children[0].textContent;
          tdContent = parseItem(tdName, tables[table].rows[tr].children[1].textContent);
          rooms[roomId][tdName] = tdContent;
        }
      }
    }
  }
  console.log(rooms);
  return rooms;
}