function moneyRound(number) {
  'use strict';
  return parseFloat(number).toFixed(2);
}

function stripNumber(numString) {
  'use strict';
  return numString.replace(/[^0-9\.]+/g, "");
}

function invertDict(dict) {
  'use strict';
  var newDict = {},
    newKey,
    newVal;
  for (newVal in dict) {
    if (dict.hasOwnProperty(newVal)) {
      newKey = dict[newVal];
      newDict[newKey] = newVal;
    }
  }
  return newDict;
}

var displayNames = {
  // House Attributes
  calculateAsSingles: 'Calculated as Singles',
  cheapestRoomMustBeSingle: 'Cheapest Room is Single',
  commonWeight: 'Common Weight',
  houseSize: 'House Size',
  rentSum: 'Rent Sum',
  roundDollar: 'Rounded to Dollar',
  peepsCount: '# Housemates',
  commonSpace: 'Common Area',
  commonCostPerSqft: 'Common Cost per SqFt',
  commonShareCost: 'Base share cost',
  privateCostPerSqft: 'Room Cost per SqFt',
  // Room attributes
  sqft: 'Area',
  hasWindow: 'Has Window',
  percentUsable: 'Usable Space',
  occupiedBy: 'Occupied By'
};

var propertyNames = invertDict(displayNames);
propertyNames.feeOrDeduct = 'feeOrDeduct';

var dataType = {
  // House attributes
  calculateAsSingles: {
    type: 'bool',
    displayName: displayNames.calculateAsSingles
  },
  cheapestRoomMustBeSingle: {
    type: 'bool',
    displayName: displayNames.cheapestRoomMustBeSingle
  },
  commonWeight: {
    type: 'percent',
    displayName: displayNames.commonWeight
  },
  houseSize: {
    type: 'sqft',
    displayName: displayNames.houseSize
  },
  rentSum: {
    type: 'dollar',
    displayName: displayNames.rentSum
  },
  roundDollar: {
    type: 'bool',
    displayName: displayNames.roundDollar
  },
  peepsCount: {
    type: 'number',
    displayName: displayNames.peepsCount
  },
  commonSpace: {
    type: 'sqft',
    displayName: displayNames.commonSpace
  },
  commonCostPerSqft: {
    type: 'dollar',
    displayName: displayNames.commonCostPerSqft
  },
  commonShareCost: {
    type: 'dollar',
    displayName: displayNames.commonShareCost
  },
  privateCostPerSqft: {
    type: 'dollar',
    displayName: displayNames.privateCostPerSqft
  },
  feeOrDeduct: {
    type: 'dollar'
  },
  // Room attributes
  sqft: {
    type: 'sqft',
    displayName: displayNames.sqft
  },
  hasWindow: {
    type: 'bool',
    displayName: displayNames.hasWindow
  },
  percentUsable: {
    type: 'percent',
    displayName: displayNames.percentUsable
  },
  occupiedBy: {
    type: 'list',
    displayName: displayNames.occupiedBy
  }
};

var toDataType = {
  bool: function (item) {
    'use strict';
    return item.toString();
  },
  percent: function (item) {
    'use strict';
    return (item * 100).toString() + '%';
  },
  sqft: function (item) {
    'use strict';
    return item.toLocaleString();
  },
  dollar: function (item) {
    'use strict';
    return '$' + moneyRound(item).toLocaleString();
  },
  number: function (item) {
    'use strict';
    return item.toLocaleString();
  },
  list: function (item) {
    'use strict';
    return item.join(',');
  }
};

var fromDataType = {
  bool: function (item) {
    'use strict';
    return (item === 'true');
  },
  percent: function (item) {
    'use strict';
    return parseFloat(stripNumber(item)) / 100;
  },
  sqft: function (item) {
    'use strict';
    return parseInt(stripNumber(item), 10);
  },
  dollar: function (item) {
    'use strict';
    return moneyRound(stripNumber(item));
  },
  number: function (item) {
    'use strict';
    return parseInt(stripNumber(item), 10);
  },
  list: function (item) {
    'use strict';
    return item.split(',');
  }
};

function isFeeOrDeduct(name) {
  'use strict';
  return (name.includes('Deduction') || name.includes('Fee'));
}

function parseItem(name, item) {
  'use strict';
  name = isFeeOrDeduct(name) ? propertyNames.feeOrDeduct : name;
  var type = dataType[name].type;
  return fromDataType[type](item);
}

function convertItem(name, item) {
  'use strict';
  name = isFeeOrDeduct(name) ? propertyNames.feeOrDeduct : name;
  var type = dataType[name].type;
  return toDataType[type](item);
}

function getText(item) {
  'use strict';
  if (item.firstChild.localName === 'input') {
    if (item.firstChild.type === 'checkbox') {
      return item.firstChild.checked.toString();
    }
    return item.firstChild.value;
  }
  return item.textContent;
}

function getDisplayName(name) {
  'use strict';
  if (displayNames.hasOwnProperty(name)) {
    return displayNames[name];
  }
  name = name.split(/(?=[A-Z])/).join(' ');
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return name;
}

function getPropertyName(name) {
  'use strict';
  if (propertyNames.hasOwnProperty(name)) {
    return propertyNames[name];
  }
  name = name.split(' ').join('');
  name = name.charAt(0).toLowerCase() + name.slice(1);
  return name;
}

