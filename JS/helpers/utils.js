function moneyRound(number) {
  'use strict';
  return parseFloat(number.toFixed(2));
}

function stripNumber(numString) {
  'use strict';
  return numString.replace(/[^0-9\.]+/g, "");
}

var dataType = {
  // House attributes
  calculateAsSingles: 'bool',
  cheapestRoomMustBeSingle: 'bool',
  commonWeight: 'percent',
  houseSize: 'sqft',
  rentSum: 'dollar',
  roundDollar: 'bool',
  peepsCount: 'number',
  commonSpace: 'sqft',
  commonCostPerSqft: 'dollar',
  commonShareCost: 'dollar',
  privateCostPerSqft: 'dollar',
  feeOrDeduct: 'dollar',
  // Room attributes
  sqft: 'sqft',
  hasWindow: 'bool',
  percentUsable: 'percent',
  occupiedBy: 'list'
},
  toDataType = {
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
  },
  fromDataType = {
    bool: function (item) {
      'use strict';
      return Boolean(item);
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

function parseItem(name, item) {
  'use strict';
  var type = dataType[name];
  return fromDataType[type](item);
}

function convertItem(name, item) {
  'use strict';
  name = (name.includes('Deduction') || name.includes('Fee')) ? 'feeOrDeduct' : name;
  var type = dataType[name];
  return toDataType[type](item);
}
