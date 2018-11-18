/*global console, Rent */

function Calculator(home) {
  'use strict';
  this.home = home;
  this.calculateRents();
  
  console.log(this.home.rooms);
}

Calculator.prototype.calculateRents = function () {
  'use strict';
  var room_id;
  for (room_id in this.home.rooms) {
    if (this.home.rooms.hasOwnProperty(room_id)) {
      this.calculateRent(room_id);
    }
  }
};

Calculator.prototype.calculateRent = function (room_id) {
  'use strict';
  var room = this.home.rooms[room_id],
    occupants = room.occupiedBy.length,
    baseCost = this.home.commonShareCost * occupants,
    roomCost = room.sqft * this.home.privateCostPerSqft * room.percentUsable,
    price = baseCost + roomCost;
  
  room.rent = new Rent(price, room_id, this.home);
  
  this.applyFeesAndDiscounts(room);
  if (this.home.roundDollar) {
    room.rent.price += parseInt(room.rent.price, 10);
  }
};

Calculator.prototype.applyFeesAndDiscounts = function (room) {
  'use strict';
  room.rent = (
    room.hasWindow ?
        parseFloat(this.home.goodLightingFee) : parseFloat(this.home.badLightingDeduction)
  );
};