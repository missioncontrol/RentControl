function Rent(price, room_id, home) {
  'use strict';
  this.price = price;
  this.room_id = room_id;
  this.home = home;
}

Rent.prototype.getRoomDeets = function () {
  'use strict';
  return this.home.rooms[this.room_id];
};