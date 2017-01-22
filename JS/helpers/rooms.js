/*global console, getPropertyName, getText, parseItem */

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
          tdName = getPropertyName(tables[table].rows[tr].children[0].textContent);
          tdContent = getText(tables[table].rows[tr].children[1]);
          tdContent = parseItem(tdName, tdContent);
          rooms[roomId][tdName] = tdContent;
        }
      }
    }
  }
  console.log(rooms);
  return rooms;
}