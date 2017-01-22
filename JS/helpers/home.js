/*global rooms, console, defaultRooms, dataType, getPropertyName, getDisplayName, moneyRound, convertItem */

var defaults = {
  attributeTableId: 'house-attribute-table',
  feesAndDeducts: {
    lighting: {
      deductionName: 'badLightingDeduction',
      feeName: 'goodLightingFee',
      deduction: 100,
      attr: 'hasWindow',
      hasAttr: false
    }
  },
  calculateAsSingles: false,
  cheapestRoomMustBeSingle: true,
  commonWeight: 0.60,
  houseSize: 6200,
  rentSum: 18000,
  rooms: defaultRooms,
  roundDollar: true
};

var EDITABLE_FIELDS = [
  'calculateAsSingles', 'cheapestRoomMustBeSingle', 'commonWeight',
  'rentSum', 'roundDollar'
];

function Home(options) {
  'use strict';
  this.rooms = {};
  this.cheapestRooms = [];
  
  options = options || {};
  this.attributeTableId = options.attributeTableId || defaults.attributeTableId;
  this.calculateAsSingles = options.calculateAsSingles || defaults.calculateAsSingles;
  this.cheapestRoomMustBeSingle = options.cheapestRoomMustBeSingle || defaults.cheapestRoomMustBeSingle;
  this.commonWeight = options.commonWeight || defaults.commonWeight;
  this.houseSize = options.houseSize || defaults.houseSize;
  this.rentSum = options.rentSum || defaults.rentSum;
  this.rooms = options.rooms || defaults.rooms;
  this.roundDollar = options.roundDollar || defaults.roundDollar;
  this.feesAndDeducts = options.feesAndDeducts || defaults.feesAndDeducts;
  
  this.fillHouse();
  if (this.rooms.length && this.calculateAsSingles) {
    this.changeToSingles();
  } else {
    this.countPeeps();
  }
  
  this.calculateCommonAttrs();
  this.calculateRoomSqftCosts();
  
  var feeDuct;
  for (feeDuct in this.feesAndDeducts) {
    if (this.feesAndDeducts.hasOwnProperty(feeDuct)) {
      this.setOpposingFeeOrDeduction(feeDuct, this.feesAndDeducts[feeDuct]);
    }
  }
  
  this.populateAttributeTable(this);
  this.populateAttributeTable(this.feesAndDeducts);
}

Home.prototype.setCheapestRoom = function (room) {
  'use strict';
  function getRoomPrice(room) {
    return room.price / room.deets.occupiedBy.length;
  }
  
  if (this.cheapestRoomMustBeSingle && room.deets.occupiedBy.length !== 1) {
    return;
  }
  
  if (!this.cheapestRooms.length) {
    this.cheapestRooms.push(room);
  } else {
    var r = getRoomPrice(room),
      cr = getRoomPrice(this.cheapestRooms[0]);
    if (cr > r) {
      this.cheapestRooms = [room];
    } else if (cr === r) {
      this.cheapestRooms.push(room);
    }
  }
};

Home.prototype.changeToSingles = function () {
  'use strict';
  var i, occupants;
  for (i = 0; i < this.rooms.length; i += 1) {
    occupants = this.rooms[i].occupiedBy.join('/');
    this.rooms[i].occupiedBy = occupants;
  }
  this.peepsCount = this.rooms.length;
};

Home.prototype.countPeeps = function () {
  'use strict';
  var room,
    peepsCount = 0;
  for (room in this.rooms) {
    if (this.rooms.hasOwnProperty(room)) {
      peepsCount += this.rooms[room].occupiedBy.length;
    }
  }
  this.peepsCount = peepsCount;
};

Home.prototype.calculateOpposingFeeOrDeduct = function (attr, cost, hasAttr) {
  'use strict';
  var peepsWithAttr = 0,
    room,
    oppCost;
  
  for (room in this.rooms) {
    if (this.rooms.hasOwnProperty(room)) {
      if (this.rooms[room][attr] === hasAttr) {
        peepsWithAttr += 1;
      }
    }
  }
  if (peepsWithAttr && (peepsWithAttr < this.peepsCount)) {
    if (hasAttr) {
      oppCost = (this.peepsCount - peepsWithAttr) * cost;
      oppCost /= peepsWithAttr * -1;
      return { cost: cost, oppCost: moneyRound(oppCost) };
    }
    oppCost = peepsWithAttr * cost;
    oppCost /= (this.peepsCount - peepsWithAttr) * -1;
    return { cost: cost, oppCost: moneyRound(oppCost) };
  }
  // If no one has one of the attributes, then there should be no fee / deduction
  return { cost: 0, oppCost: 0 };
};

Home.prototype.setOpposingFeeOrDeduction = function (name, feeDuct) {
  'use strict';
  var cost, calculation;
  cost = feeDuct.fee || feeDuct.deduction;
  calculation = this.calculateOpposingFeeOrDeduct(feeDuct.attr, cost, feeDuct.hasAttr);
  if (feeDuct.fee) {
    this[feeDuct.feeName] = calculation.cost;
    this[feeDuct.deductionName] = calculation.oppCost;
  } else {
    this[feeDuct.deductionName] = calculation.cost;
    this[feeDuct.feeName] = calculation.oppCost;
  }
};

Home.prototype.fillHouse = function () {
  'use strict';
  /* TODO: check/grab rooms from structured screen before falling back on defaults */
  if (this.rooms !== undefined) {
    this.rooms = defaultRooms;
  }
};

Home.prototype.calculateCommonAttrs = function () {
  'use strict';
  var room,
    privateSpace = 0,
    commonShare;
  for (room in this.rooms) {
    if (this.rooms.hasOwnProperty(room)) {
      privateSpace += this.rooms[room].sqft;
    }
  }
  this.commonSpace = this.houseSize - privateSpace;
  commonShare = this.commonSpace / this.peepsCount;
  this.commonCostPerSqft = moneyRound(this.rentSum / this.houseSize * this.commonWeight);
  this.commonShareCost = moneyRound(commonShare * this.commonCostPerSqft);
};

Home.prototype.calculateRoomSqftCosts = function () {
  'use strict';
  this.privateCostPerSqft = this.rentSum - (this.commonShareCost * this.peepsCount);
  this.privateCostPerSqft /= this.houseSize - this.commonSpace;
  this.privateCostPerSqft = moneyRound(this.privateCostPerSqft);
};

Home.prototype.populateAttributeTable = function (attributes) {
  'use strict';
  var attributeTable = document.getElementById(this.attributeTableId),
    dontPrint = ['attributeTableId'],
    row,
    cell,
    attribute,
    subAttribute,
    rowIndex = attributeTable.rows.length,
    cellIndex;
  function createValInput(item) {
    var input = document.createElement('INPUT');
    input.setAttribute('type', 'text');
    input.setAttribute('value', item);
    return input;
  }
  function createValCheckbox(item) {
    var input = document.createElement('INPUT');
    input.setAttribute('type', 'checkbox');
    input.checked = (item === 'true');
    return input;
  }
  function createValCell(row, attrName, attrValue) {
    var propertyName = attrName;
    attrName = getDisplayName(attrName);
    cell = row.insertCell(0);
    cell.innerHTML = attrName;
    cell = row.insertCell(1);
    
    attrValue = convertItem(propertyName, attrValue);
    if (EDITABLE_FIELDS.includes(propertyName)) {
      if (dataType[propertyName].type === 'bool') {
        attrValue = createValCheckbox(attrValue);
      } else {
        attrValue = createValInput(attrValue);
      }
      cell.appendChild(attrValue);
    } else {
      cell.innerHTML = attrValue;
    }
  }
  function insertRow(table, index, attrName, attrValue) {
    row = table.insertRow(index);
    createValCell(row, attrName, attrValue);
  }
  
  for (attribute in attributes) {
    if (attributes.hasOwnProperty(attribute)) {
      if (!dontPrint.includes(attribute) && (typeof attributes[attribute] !== 'object')) {
        insertRow(attributeTable, rowIndex, attribute, attributes[attribute]);
        rowIndex += 1;
      }
    }
  }
};

Home.prototype.getAttributesFromTable = function () {
  'use strict';
  var attributeTable = document.getElementById(this.attributeTableId),
    table,
    tr,
    tdName,
    tdContent;
  console.log(attributeTable);
  for (tr = 1; tr < attributeTable.rows.length; tr += 1) {
    if (attributeTable.rows.hasOwnProperty(tr)) {
      tdName = getPropertyName(attributeTable.rows[tr].children[0].textContent);
      tdContent = getText(attributeTable.rows[tr].children[1]);
      tdContent = parseItem(tdName, tdContent);
      this[tdName] = tdContent;
    }
  }
  console.log(this);
};
