// Questions for HTML, CSS, JavaScript
const htmlCssJsQuestions = [
  // ── HTML Easy ──────────────────────────────────────────────────────────────
  {
    skillName: 'HTML', difficulty: 'easy',
    question: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Text Markup Language', 'Hyper Transfer Markup Language', 'Hyperlink and Text Markup Language'],
    correctAnswer: 0,
    explanation: 'HTML stands for HyperText Markup Language, the standard language for creating web pages.',
    points: 1
  },
  {
    skillName: 'HTML', difficulty: 'easy',
    question: 'Which HTML tag is used to create a hyperlink?',
    options: ['<link>', '<a>', '<href>', '<url>'],
    correctAnswer: 1,
    explanation: 'The <a> (anchor) tag is used to create hyperlinks in HTML.',
    points: 1
  },
  {
    skillName: 'HTML', difficulty: 'easy',
    question: 'Which tag is the correct way to insert a line break in HTML?',
    options: ['<br>', '<lb>', '<break>', '<newline>'],
    correctAnswer: 0,
    explanation: '<br> is the self-closing tag used to insert a line break.',
    points: 1
  },
  {
    skillName: 'HTML', difficulty: 'easy',
    question: 'What is the correct HTML element for the largest heading?',
    options: ['<h6>', '<heading>', '<h1>', '<head>'],
    correctAnswer: 2,
    explanation: '<h1> defines the largest/most important heading. Headings go from <h1> to <h6>.',
    points: 1
  },
  {
    skillName: 'HTML', difficulty: 'easy',
    question: 'Which HTML attribute specifies an alternate text for an image if it cannot be displayed?',
    options: ['title', 'src', 'alt', 'caption'],
    correctAnswer: 2,
    explanation: 'The alt attribute provides alternative text for an image when it cannot be rendered.',
    points: 1
  },

  // ── HTML Medium ────────────────────────────────────────────────────────────
  {
    skillName: 'HTML', difficulty: 'medium',
    question: 'What is the purpose of the HTML <meta charset="UTF-8"> tag?',
    options: ['Sets the page title', 'Defines the character encoding for the document', 'Links an external stylesheet', 'Defines keywords for search engines'],
    correctAnswer: 1,
    explanation: 'charset="UTF-8" tells the browser the character encoding of the document, allowing it to display special characters correctly.',
    points: 1
  },
  {
    skillName: 'HTML', difficulty: 'medium',
    question: 'Which HTML5 element is used to define navigation links?',
    options: ['<navigate>', '<nav>', '<navigation>', '<menu>'],
    correctAnswer: 1,
    explanation: 'The <nav> element defines a set of navigation links. It is a semantic HTML5 element.',
    points: 1
  },
  {
    skillName: 'HTML', difficulty: 'medium',
    question: 'What is the difference between <div> and <span> in HTML?',
    options: [
      '<div> is inline; <span> is block-level',
      '<div> is block-level; <span> is inline',
      'Both are block-level elements',
      'Both are inline elements'
    ],
    correctAnswer: 1,
    explanation: '<div> is a block-level element that starts on a new line. <span> is an inline element used to style parts of text.',
    points: 1
  },
  {
    skillName: 'HTML', difficulty: 'medium',
    question: 'Which input type is used for a date picker in HTML5?',
    options: ['<input type="calendar">', '<input type="date">', '<input type="datetime">', '<input type="pick">'],
    correctAnswer: 1,
    explanation: 'The input type="date" allows users to select a date from a date picker.',
    points: 1
  },

  // ── HTML Hard ─────────────────────────────────────────────────────────────
  {
    skillName: 'HTML', difficulty: 'hard',
    question: 'What is the purpose of the "defer" attribute on a <script> tag?',
    options: [
      'Loads the script asynchronously without blocking HTML parsing',
      'Defers script execution until the HTML is fully parsed',
      'Prevents the script from running at all',
      'Loads the script from a CDN'
    ],
    correctAnswer: 1,
    explanation: 'The defer attribute causes the script to execute after the HTML document is fully parsed, but the script is downloaded in parallel without blocking.',
    points: 1
  },
  {
    skillName: 'HTML', difficulty: 'hard',
    question: 'Which attribute makes a form field required in HTML5?',
    options: ['validate', 'required', 'mandatory', 'notempty'],
    correctAnswer: 1,
    explanation: 'The required attribute prevents form submission if the field is empty.',
    points: 1
  },
  {
    skillName: 'HTML', difficulty: 'hard',
    question: 'What is the correct way to open a link in a new tab in HTML?',
    options: ['<a href="url" new>', '<a href="url" target="new">', '<a href="url" target="_blank">', '<a href="url" open="tab">'],
    correctAnswer: 2,
    explanation: 'target="_blank" opens the link in a new browser tab. Consider adding rel="noopener noreferrer" for security.',
    points: 1
  },

  // ── CSS Easy ───────────────────────────────────────────────────────────────
  {
    skillName: 'CSS', difficulty: 'easy',
    question: 'Which CSS property is used to change the text color of an element?',
    options: ['text-color', 'font-color', 'color', 'foreground-color'],
    correctAnswer: 2,
    explanation: 'The color property sets the color of text content.',
    points: 1
  },
  {
    skillName: 'CSS', difficulty: 'easy',
    question: 'How do you select an element with id="header" in CSS?',
    options: ['.header', '*header', '#header', 'header'],
    correctAnswer: 2,
    explanation: 'The # symbol is used to select elements by ID in CSS.',
    points: 1
  },
  {
    skillName: 'CSS', difficulty: 'easy',
    question: 'Which property is used to change the background color of an element?',
    options: ['bgcolor', 'background-color', 'color', 'bg-color'],
    correctAnswer: 1,
    explanation: 'background-color sets the background color of an element.',
    points: 1
  },
  {
    skillName: 'CSS', difficulty: 'easy',
    question: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
    correctAnswer: 1,
    explanation: 'CSS stands for Cascading Style Sheets — it describes how HTML elements should be displayed.',
    points: 1
  },

  // ── CSS Medium ─────────────────────────────────────────────────────────────
  {
    skillName: 'CSS', difficulty: 'medium',
    question: 'What is the CSS Box Model?',
    options: [
      'A method for creating 3D boxes with CSS',
      'Content, padding, border, and margin that wrap every element',
      'A CSS framework for grid layout',
      'A model for animating elements'
    ],
    correctAnswer: 1,
    explanation: 'The CSS Box Model describes the rectangular boxes generated for elements: content, padding, border, and margin from inside to outside.',
    points: 1
  },
  {
    skillName: 'CSS', difficulty: 'medium',
    question: 'Which CSS property is used to make a flex container?',
    options: ['display: flex', 'flex: true', 'position: flex', 'layout: flex'],
    correctAnswer: 0,
    explanation: 'display: flex turns an element into a flex container, enabling flexbox layout for its children.',
    points: 1
  },
  {
    skillName: 'CSS', difficulty: 'medium',
    question: 'What does "position: absolute" do in CSS?',
    options: [
      'Positions the element relative to the browser window always',
      'Positions the element relative to its nearest positioned ancestor',
      'Removes the element from the DOM',
      'Fixes the element at the top of the page'
    ],
    correctAnswer: 1,
    explanation: 'position: absolute removes the element from the normal flow and positions it relative to its nearest positioned (non-static) ancestor.',
    points: 1
  },
  {
    skillName: 'CSS', difficulty: 'medium',
    question: 'What is the purpose of CSS media queries?',
    options: [
      'To query a database from CSS',
      'To apply different styles based on device characteristics like screen width',
      'To load external media files',
      'To create animations'
    ],
    correctAnswer: 1,
    explanation: 'Media queries allow you to apply CSS rules based on device properties (like viewport width), enabling responsive design.',
    points: 1
  },

  // ── CSS Hard ───────────────────────────────────────────────────────────────
  {
    skillName: 'CSS', difficulty: 'hard',
    question: 'What is CSS specificity and how is it calculated?',
    options: [
      'The order in which CSS rules are loaded — last rule wins',
      'A weight assigned to selectors: inline(1000) > ID(100) > class(10) > element(1)',
      'The number of CSS files loaded on a page',
      'The pixel size of fonts in a stylesheet'
    ],
    correctAnswer: 1,
    explanation: 'Specificity is a weight (calculated as inline:1000, ID:100, class/pseudo:10, element:1). Higher specificity wins when rules conflict.',
    points: 1
  },
  {
    skillName: 'CSS', difficulty: 'hard',
    question: 'In CSS Grid, what does "grid-template-columns: repeat(3, 1fr)" mean?',
    options: [
      'Creates 3 rows of equal height',
      'Creates 3 equal-width columns each taking 1 fraction of available space',
      'Repeats the grid 3 times on the page',
      'Creates 3 columns each 1px wide'
    ],
    correctAnswer: 1,
    explanation: '1fr means 1 fraction of the remaining space. repeat(3, 1fr) creates 3 equal columns that share available space equally.',
    points: 1
  },

  // ── JavaScript Easy ────────────────────────────────────────────────────────
  {
    skillName: 'JavaScript', difficulty: 'easy',
    question: 'Which of the following is the correct way to declare a variable in modern JavaScript?',
    options: ['var x = 5', 'let x = 5', 'const x = 5', 'All of the above are valid'],
    correctAnswer: 3,
    explanation: 'var, let, and const are all valid JavaScript variable declarations. let and const are preferred in modern JS (ES6+).',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'easy',
    question: 'What is the output of: console.log(typeof null)?',
    options: ['"null"', '"undefined"', '"object"', '"string"'],
    correctAnswer: 2,
    explanation: 'typeof null returns "object" — this is a well-known JavaScript bug that has been kept for backward compatibility.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'easy',
    question: 'How do you write a comment in JavaScript?',
    options: ['/* This is a comment */', '// This is a comment', '<!-- This is a comment -->', 'Both A and B'],
    correctAnswer: 3,
    explanation: 'JavaScript supports both single-line (//) and multi-line (/* */) comments.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'easy',
    question: 'Which method is used to add an element to the end of an array?',
    options: ['append()', 'push()', 'add()', 'insert()'],
    correctAnswer: 1,
    explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'easy',
    question: 'What does === mean in JavaScript?',
    options: [
      'Assignment operator',
      'Equal value only (type coercion allowed)',
      'Strict equality: equal value AND equal type',
      'Approximately equal'
    ],
    correctAnswer: 2,
    explanation: '=== is the strict equality operator. It checks both value and type without type coercion, unlike == which allows type coercion.',
    points: 1
  },

  // ── JavaScript Medium ──────────────────────────────────────────────────────
  {
    skillName: 'JavaScript', difficulty: 'medium',
    question: 'What is a Promise in JavaScript?',
    options: [
      'A way to declare variables that cannot change',
      'An object representing the eventual completion or failure of an asynchronous operation',
      'A special type of function that runs synchronously',
      'A method for making HTTP requests'
    ],
    correctAnswer: 1,
    explanation: 'A Promise is an object representing the eventual result of an async operation. It can be pending, fulfilled, or rejected.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'medium',
    question: 'What is the difference between "let" and "var" in JavaScript?',
    options: [
      'There is no difference; they work the same',
      'var is function-scoped and hoisted; let is block-scoped and not hoisted to its value',
      'let allows re-assignment; var does not',
      'var is for strings; let is for numbers'
    ],
    correctAnswer: 1,
    explanation: 'var is function-scoped and gets hoisted to the top of its function. let is block-scoped ({}) and is in a temporal dead zone before declaration.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'medium',
    question: 'What is a closure in JavaScript?',
    options: [
      'A way to close the browser window with JS',
      'A function that has access to its outer scope even after the outer function returns',
      'A method to end a loop early',
      'A property used to close a database connection'
    ],
    correctAnswer: 1,
    explanation: 'A closure is a function bundled with references to its surrounding lexical environment. Inner functions "close over" variables from their outer scope.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'medium',
    question: 'What is the purpose of the "async" keyword in JavaScript?',
    options: [
      'Makes a function run faster',
      'Marks a function to always return a Promise',
      'Runs a function in a separate thread',
      'Prevents a function from returning a value'
    ],
    correctAnswer: 1,
    explanation: 'The async keyword makes a function always return a Promise. It also enables the use of await inside the function.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'medium',
    question: 'Which method is used to make an HTTP request in modern JavaScript?',
    options: ['XMLHttpRequest()', 'fetch()', 'http.get()', 'ajax()'],
    correctAnswer: 1,
    explanation: 'The Fetch API (fetch()) is the modern, Promise-based way to make HTTP requests in browsers.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'medium',
    question: 'What does the spread operator (...) do in JavaScript?',
    options: [
      'Multiplies an array by 3',
      'Expands an iterable (array/object) into individual elements',
      'Declares a rest parameter in function arguments',
      'Deletes elements from an array'
    ],
    correctAnswer: 1,
    explanation: 'The spread operator expands iterables. [...arr1, ...arr2] merges arrays; {...obj1, ...obj2} merges objects.',
    points: 1
  },

  // ── JavaScript Hard ────────────────────────────────────────────────────────
  {
    skillName: 'JavaScript', difficulty: 'hard',
    question: 'What will the following code output?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
    options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'],
    correctAnswer: 1,
    explanation: 'Sync code runs first (1, 4). Microtasks (Promise) run before macrotasks (setTimeout). So: 1, 4, 3, 2.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'hard',
    question: 'What is event delegation in JavaScript?',
    options: [
      'Assigning multiple event listeners to the same element',
      'Using a parent element\'s event listener to handle events from child elements via bubbling',
      'Removing event listeners to prevent memory leaks',
      'Blocking events from propagating with stopPropagation()'
    ],
    correctAnswer: 1,
    explanation: 'Event delegation attaches a single listener to a parent element and uses event.target to identify which child triggered the event, improving performance.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'hard',
    question: 'What is the difference between call(), apply(), and bind() in JavaScript?',
    options: [
      'They are all the same method with different names',
      'call() passes args individually; apply() passes as array; bind() returns a new function with bound this',
      'call() is synchronous; apply() is asynchronous; bind() is both',
      'bind() immediately invokes; call() and apply() do not'
    ],
    correctAnswer: 1,
    explanation: 'call(this, arg1, arg2) invokes immediately with individual args. apply(this, [args]) invokes with array. bind(this) returns a new function without invoking.',
    points: 1
  },
  {
    skillName: 'JavaScript', difficulty: 'hard',
    question: 'What is the purpose of the "this" keyword in JavaScript arrow functions?',
    options: [
      'Arrow functions have their own "this" like regular functions',
      'Arrow functions do not have their own "this"; they inherit it from the surrounding lexical scope',
      'Arrow functions cannot use "this" at all',
      '"this" refers to the arrow function itself'
    ],
    correctAnswer: 1,
    explanation: 'Arrow functions do not bind their own "this". They inherit "this" from the enclosing lexical context, solving many binding issues in callbacks.',
    points: 1
  }
];

module.exports = htmlCssJsQuestions;
