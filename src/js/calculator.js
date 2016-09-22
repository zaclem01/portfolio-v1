var Button = {
  
  // Initialize the button with class, label, and an
  // onclick function
  init: function(label, className, clickEvent) {
    this.button = document.createElement('button');
    
    this.button.setAttribute('class', className + ' s-btn');
    this.button.innerHTML = label;
    this.button.onclick = clickEvent;
  },
  
  // Insert the button into the DOM
  insert: function(where) {
    where.appendChild(this.button);
  }
};

var Calculator = {
  _expression: '',
  _lastEntered: '',
  _err: false,
  _operators: ['/', '*', '-', '+'],
  
  // Handles all of the button creation
  create: function() {
    var topRow = document.getElementById('topBtns');
    var numRow = document.getElementById('numBtns');
    var opsRow = document.getElementById('opBtns');
    
    var clrBtn = Object.create(Button);
    clrBtn.init('C', 'topBtnContainer_clrBtn', function() {
      this.clearDisplay();
    }.bind(this));
    clrBtn.insert(topRow);
    
    var delBtn = Object.create(Button);
    delBtn.init('Del', 'topBtnContainer_delBtn', function() {
      this.deleteLast();
    }.bind(this));
    delBtn.insert(topRow);
    
    var leftPrnBtn = Object.create(Button);
    delBtn.init('(', 'topBtnContainer_lprnBtn', function() {
      this.insertOperation('(');
    }.bind(this));
    delBtn.insert(topRow);
    
    var leftPrnBtn = Object.create(Button);
    delBtn.init(')', 'topBtnContainer_rprnBtn', function() {
      this.insertOperation(')');
    }.bind(this));
    delBtn.insert(topRow);
    
    for(let number=9; number >= 0; number--) {
      var numBtn = Object.create(Button);
      
      // Must bind to 'this' to retain context when
      // passing the 'insertNumber' function
      numBtn.init(number, 'numBtnContainer_numBtn', function() {
        this.insertOperation(number);
      }.bind(this));
      numBtn.insert(numRow);
    }
    
    for(let operator=0; operator < this._operators.length; operator++) {
      var opBtn = Object.create(Button);
      opBtn.init(this._operators[operator], 'opBtnContainer_opBtn', function() {
        this.insertOperation(this._operators[operator]);
      }.bind(this));
      opBtn.insert(opsRow);
    }
    
    var decBtn = Object.create(Button);
    decBtn.init('.', 'numBtnContainer_numBtn', function() {
      this.insertOperation('.');
    }.bind(this));
    decBtn.insert(numRow);
    
    var eqBtn = Object.create(Button);
    eqBtn.init('=', 'numBtnContainer_numBtn', function() {
      this.evaluateExpression();
    }.bind(this));
    eqBtn.insert(numRow);
  },
  
  insertOperation: function(op) {
    if (this._lastEntered === '=' && this._operators.indexOf(op) === -1) {
      this._expression = '';
    }
    this._expression += op;
    this._lastEntered = op;
    this._updateDisplay();
  },
  
  evaluateExpression: function() {
    this._lastEntered = '=';
    var evaluator = Object.create(Evaluator);
    this._expression = evaluator.parse(this._expression).toString();
    this._updateDisplay();
  },
  
  clearDisplay: function() {
    this._expression = '';
    this._updateDisplay();
  },
  
  deleteLast: function() {
    console.log('deleting last')
    this._expression = this._expression.slice(0, -1);
    this._updateDisplay();
  },
  
  _updateDisplay: function() {
    var display = document.getElementById('display');
    display.innerHTML = this._expression;
  }
};

var calc = Object.create(Calculator);
calc.create();

// Recursive Descent Math Expression Parser
// Modeled on and borrows heavily from
// http://stackoverflow.com/questions/3422673/evaluating-a-math-expression-given-in-string-form
var Evaluator = {
  position: -1,
  char: '',
  string: '',
  
  parse: function(stringExpression) {
    this.string = stringExpression;
    console.log(this.string)
    this.nextChar();
    var result = this.parseExpression();
    
    // If returned before reaching the end of the string,
    // unexpected character encountered
    if (this.position < this.string.length) {
      throw "Unexpected character: " + this.char;
    }
    return result;
  },
  
  // Top-level, checks for + & - operators
  parseExpression: function() {
    var expression = this.parseTerm();
    
    // Loop to catch multiple +/- operators
    while(true) {
      if (this.isCharMatch('+')) { expression += this.parseTerm(); }
      else if (this.isCharMatch('-')) { expression -= this.parseTerm(); }
      else { return expression; }
    }
  },
  
  // Middle-level, checks for * & / operators
  parseTerm: function() {
    var terms = this.parseFactor();
    while(true) {
      if (this.isCharMatch('*')) { terms *= this.parseFactor(); }
      else if (this.isCharMatch('/')) { terms /= this.parseFactor(); }
      else { return terms; }
    }
  },
  
  // Bottom-level, checks for (), numbers, and other high
  // priority orders (according to PEMDAS);
  parseFactor: function() {

    // Unary + & - operators
    if (this.isCharMatch('-')) { -this.parseFactor(); }
    else if (this.isCharMatch('+')) { +this.parseFactor; }
    
    var startPosition = this.position;
    var result;
    
    // First check for parentheses, and if found complete entire
    // expression as separate, moving on when completed
    
    // Otherwise, check for number
    
    // If nothing valid found, throw error, as this is the bottom level
    if (this.isCharMatch('(')) {
      result = this.parseExpression();
      this.isCharMatch(')');
    } else if (this.char.search(/[0-9\.]/gi) !== -1) {
      while (this.char.search(/[0-9\.]/gi) !== -1) {
        this.nextChar();
        result = parseFloat(this.string.substring(startPosition, this.position));
      }
    } else {
      // Handles any unaccounted for characters
      throw "Unexpected character: " + this.char;
    }
    
    return result;
  },
  
  nextChar: function() {
    this.char = ++this.position < this.string.length ? this.string.charAt(this.position) : '';
  },
  
  // Matches the character and returns true or false
  // Skips any spaces
  // Moves to next character if a match
  isCharMatch: function(char) {
    while(this.char === ' ') { this.nextChar(); }
    if (this.char === char) {
      this.nextChar();
      return true;
    }
    return false;
  }
}