const reactNodeQuestions = [
  // ── React Easy ─────────────────────────────────────────────────────────────
  {
    skillName: 'React', difficulty: 'easy',
    question: 'What is React?',
    options: [
      'A back-end framework for Node.js',
      'A JavaScript library for building user interfaces',
      'A CSS framework like Bootstrap',
      'A database management tool'
    ],
    correctAnswer: 1,
    explanation: 'React is a JavaScript library created by Meta for building reusable UI components and single-page applications.',
    points: 1
  },
  {
    skillName: 'React', difficulty: 'easy',
    question: 'What is JSX in React?',
    options: [
      'A new programming language',
      'JavaScript XML — syntax extension allowing HTML-like code in JavaScript',
      'A type of JSON for React',
      'A CSS preprocessor for React'
    ],
    correctAnswer: 1,
    explanation: 'JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. Babel compiles it to React.createElement() calls.',
    points: 1
  },
  {
    skillName: 'React', difficulty: 'easy',
    question: 'What are props in React?',
    options: [
      'Internal state variables of a component',
      'Read-only data passed from parent to child component',
      'CSS properties applied to components',
      'Functions defined inside a component'
    ],
    correctAnswer: 1,
    explanation: 'Props (properties) are read-only data passed from a parent component to a child. They enable component reusability.',
    points: 1
  },
  {
    skillName: 'React', difficulty: 'easy',
    question: 'What hook is used to manage local state in a functional React component?',
    options: ['useEffect', 'useContext', 'useState', 'useReducer'],
    correctAnswer: 2,
    explanation: 'useState is the most basic React hook. It returns a state variable and a setter function: const [count, setCount] = useState(0)',
    points: 1
  },

  // ── React Medium ───────────────────────────────────────────────────────────
  {
    skillName: 'React', difficulty: 'medium',
    question: 'What is the purpose of useEffect in React?',
    options: [
      'To declare state variables in functional components',
      'To perform side effects (data fetching, subscriptions, DOM mutations) after render',
      'To memoize expensive computations',
      'To create reusable custom hooks'
    ],
    correctAnswer: 1,
    explanation: 'useEffect lets you synchronize a component with an external system. It runs after every render by default, or only when specified dependencies change.',
    points: 1
  },
  {
    skillName: 'React', difficulty: 'medium',
    question: 'What is the Virtual DOM in React?',
    options: [
      'A fake browser for testing',
      'A lightweight in-memory representation of the real DOM that React uses to calculate efficient updates',
      'A DOM method specific to React',
      'An alternative browser DOM API'
    ],
    correctAnswer: 1,
    explanation: 'The Virtual DOM is an in-memory JS representation of the real DOM. React compares (diffs) old vs new virtual DOM and applies only the minimal real DOM updates.',
    points: 1
  },
  {
    skillName: 'React', difficulty: 'medium',
    question: 'When should you use useCallback in React?',
    options: [
      'To make async functions in React',
      'To memoize a function so it is not re-created on every render, useful when passing callbacks to optimized child components',
      'To call API endpoints in React',
      'To replace useState for complex state'
    ],
    correctAnswer: 1,
    explanation: 'useCallback returns a memoized version of a callback that only changes when its dependencies change. Useful with React.memo children.',
    points: 1
  },
  {
    skillName: 'React', difficulty: 'medium',
    question: 'What is React Context used for?',
    options: [
      'To connect React to a database directly',
      'To share state globally across the component tree without prop drilling',
      'To define CSS-in-JS styles',
      'To create custom HTML elements'
    ],
    correctAnswer: 1,
    explanation: 'React Context provides a way to share values (like theme, user, language) between components without explicitly passing props through every level.',
    points: 1
  },
  {
    skillName: 'React', difficulty: 'medium',
    question: 'Why should React list items have a "key" prop?',
    options: [
      'It is decorative and optional',
      'Keys help React identify which items changed, added, or removed — enabling efficient list reconciliation',
      'It sets the ID attribute of the DOM element',
      'It is required for CSS styling of list items'
    ],
    correctAnswer: 1,
    explanation: 'Keys give React a way to identify list elements. Stable, unique keys let React re-order/remove list items efficiently without re-rendering everything.',
    points: 1
  },

  // ── React Hard ─────────────────────────────────────────────────────────────
  {
    skillName: 'React', difficulty: 'hard',
    question: 'What is React.memo and when would you use it?',
    options: [
      'A hook for managing complex state',
      'A higher-order component that memoizes a component, preventing re-renders if props have not changed',
      'A method for caching API responses in React',
      'A way to add TypeScript types to React components'
    ],
    correctAnswer: 1,
    explanation: 'React.memo wraps a component so it only re-renders when its props change. Use it for pure components that render the same output for the same props.',
    points: 1
  },
  {
    skillName: 'React', difficulty: 'hard',
    question: 'What is the difference between controlled and uncontrolled components in React?',
    options: [
      'Controlled components use refs; uncontrolled use state',
      'Controlled components have their form data managed by React state; uncontrolled components manage their own data via the DOM',
      'Controlled components are class-based; uncontrolled are functional',
      'There is no real difference between them'
    ],
    correctAnswer: 1,
    explanation: 'Controlled components: React state is the single source of truth for input values. Uncontrolled: the DOM element holds its own state, accessed via refs.',
    points: 1
  },
  {
    skillName: 'React', difficulty: 'hard',
    question: 'What does the dependency array in useEffect control?',
    options: [
      'The order in which multiple effects run',
      'When the effect runs: empty [] = only on mount; [val] = when val changes; no array = every render',
      'Which components the effect applies to',
      'The priority of the effect compared to other effects'
    ],
    correctAnswer: 1,
    explanation: 'The dependency array controls when useEffect re-runs. [] = only on mount/unmount. [dep] = when dep changes. Omitted = runs after every render.',
    points: 1
  },

  // ── Node.js Easy ───────────────────────────────────────────────────────────
  {
    skillName: 'Node.js', difficulty: 'easy',
    question: 'What is Node.js?',
    options: [
      'A front-end framework like React',
      'A JavaScript runtime environment for executing JS on the server side',
      'A CSS preprocessor',
      'A database management system'
    ],
    correctAnswer: 1,
    explanation: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine that enables running JavaScript outside the browser, on the server side.',
    points: 1
  },
  {
    skillName: 'Node.js', difficulty: 'easy',
    question: 'What is npm in the context of Node.js?',
    options: [
      'Node Package Manager — used to install and manage JavaScript packages',
      'Node Programming Module',
      'A testing framework for Node.js',
      'A database driver for Node.js'
    ],
    correctAnswer: 0,
    explanation: 'npm (Node Package Manager) is the default package manager for Node.js, hosting hundreds of thousands of reusable packages.',
    points: 1
  },
  {
    skillName: 'Node.js', difficulty: 'easy',
    question: 'Which of the following is a built-in Node.js module?',
    options: ['express', 'lodash', 'fs', 'axios'],
    correctAnswer: 2,
    explanation: 'fs (File System) is a built-in Node.js module for reading and writing files. express, lodash, and axios are third-party packages.',
    points: 1
  },

  // ── Node.js Medium ─────────────────────────────────────────────────────────
  {
    skillName: 'Node.js', difficulty: 'medium',
    question: 'What is the Event Loop in Node.js?',
    options: [
      'A method for creating loops in JavaScript',
      'A mechanism that allows Node.js to perform non-blocking I/O by offloading operations and processing callbacks',
      'A tool for detecting infinite loops',
      'A built-in module for managing events'
    ],
    correctAnswer: 1,
    explanation: 'The Event Loop is what makes Node.js non-blocking. It monitors the call stack and callback queues, executing callbacks when the stack is empty.',
    points: 1
  },
  {
    skillName: 'Node.js', difficulty: 'medium',
    question: 'What is middleware in Express.js?',
    options: [
      'Software connecting different databases',
      'Functions with access to (req, res, next) that execute in the request-response cycle',
      'A database query builder',
      'A testing framework for Express'
    ],
    correctAnswer: 1,
    explanation: 'Middleware functions have access to req, res, and the next() function. They can modify the request/response, end the cycle, or pass control to the next middleware.',
    points: 1
  },
  {
    skillName: 'Node.js', difficulty: 'medium',
    question: 'What does process.env in Node.js allow you to do?',
    options: [
      'Control the Node.js process priority',
      'Access environment variables defined in the operating system or .env file',
      'Monitor CPU and memory usage',
      'Create child processes'
    ],
    correctAnswer: 1,
    explanation: 'process.env gives access to environment variables — used for secrets, API keys, database URLs, and configuration that changes between environments.',
    points: 1
  },
  {
    skillName: 'Node.js', difficulty: 'medium',
    question: 'What is the purpose of package.json in a Node.js project?',
    options: [
      'Stores data for the application\'s database',
      'Holds project metadata, dependencies, scripts, and configuration',
      'Configures the web server settings',
      'Defines CSS styles for the project'
    ],
    correctAnswer: 1,
    explanation: 'package.json is the manifest file for a Node.js project. It lists dependencies, scripts, version, and other project metadata.',
    points: 1
  },

  // ── Node.js Hard ───────────────────────────────────────────────────────────
  {
    skillName: 'Node.js', difficulty: 'hard',
    question: 'What is the difference between require() and import in Node.js?',
    options: [
      'They are identical with different syntax',
      'require() is CommonJS (synchronous, dynamic); import is ES Modules (async, static, supports tree-shaking)',
      'import only works in browsers; require() only in Node.js',
      'require() is deprecated in all modern Node.js versions'
    ],
    correctAnswer: 1,
    explanation: 'require() is Node\'s CommonJS module system (synchronous). import/export is the ES Module standard (static analysis, tree-shaking, top-level await support).',
    points: 1
  },
  {
    skillName: 'Node.js', difficulty: 'hard',
    question: 'What are Node.js Streams and why are they useful?',
    options: [
      'A method for creating live video streams',
      'Objects that let you read/write data piece by piece, enabling processing of large data without loading it all into memory',
      'A way to create real-time database connections',
      'A tool for creating WebSocket connections'
    ],
    correctAnswer: 1,
    explanation: 'Streams process data in chunks instead of loading it all at once. Types: Readable, Writable, Duplex, Transform. Ideal for large file processing and HTTP.',
    points: 1
  },

  // ── Express.js Easy ────────────────────────────────────────────────────────
  {
    skillName: 'Express.js', difficulty: 'easy',
    question: 'What is Express.js?',
    options: [
      'A front-end JavaScript framework',
      'A minimal, flexible Node.js web application framework',
      'A database ORM for Node.js',
      'A testing library for JavaScript'
    ],
    correctAnswer: 1,
    explanation: 'Express.js is a minimal and flexible Node.js framework that provides routing, middleware, and HTTP utilities.',
    points: 1
  },
  {
    skillName: 'Express.js', difficulty: 'easy',
    question: 'How do you define a GET route in Express.js?',
    options: [
      'app.route("GET", "/path", handler)',
      'app.get("/path", handler)',
      'app.listen("/path", "GET", handler)',
      'router.define("GET", "/path", handler)'
    ],
    correctAnswer: 1,
    explanation: 'app.get(path, callback) defines a GET route. The callback receives (req, res) objects.',
    points: 1
  },
  {
    skillName: 'Express.js', difficulty: 'medium',
    question: 'What is the purpose of express.Router()?',
    options: [
      'To redirect requests to different servers',
      'To create modular route handlers that can be mounted as middleware in the main app',
      'To manage the session state of users',
      'To handle WebSocket connections in Express'
    ],
    correctAnswer: 1,
    explanation: 'express.Router() creates a mini application with its own routes and middleware, allowing you to organize routes into separate files.',
    points: 1
  },
  {
    skillName: 'Express.js', difficulty: 'medium',
    question: 'How do you access URL parameters (e.g., /user/:id) in Express?',
    options: ['req.query.id', 'req.params.id', 'req.body.id', 'req.url.id'],
    correctAnswer: 1,
    explanation: 'Route parameters defined with :name are accessed via req.params.name. Query strings (?key=val) use req.query. POST body uses req.body.',
    points: 1
  },
  {
    skillName: 'Express.js', difficulty: 'hard',
    question: 'What is the purpose of the "next" parameter in Express middleware?',
    options: [
      'It sends the response to the next browser request',
      'Calling next() passes control to the next middleware in the stack; calling next(err) jumps to the error handler',
      'It queues the request for batch processing',
      'It loads the next route file'
    ],
    correctAnswer: 1,
    explanation: 'next() moves to the next matching middleware or route. next(err) skips to the error-handling middleware (with 4 parameters: err, req, res, next).',
    points: 1
  },

  // ── MongoDB Easy ───────────────────────────────────────────────────────────
  {
    skillName: 'MongoDB', difficulty: 'easy',
    question: 'What type of database is MongoDB?',
    options: ['Relational (SQL)', 'NoSQL document database', 'Graph database', 'In-memory key-value store'],
    correctAnswer: 1,
    explanation: 'MongoDB is a NoSQL document-oriented database that stores data in flexible, JSON-like BSON documents.',
    points: 1
  },
  {
    skillName: 'MongoDB', difficulty: 'easy',
    question: 'What is a collection in MongoDB?',
    options: [
      'A row in a table',
      'A group of MongoDB documents, analogous to a table in relational databases',
      'A single field inside a document',
      'A connection string to the database'
    ],
    correctAnswer: 1,
    explanation: 'A collection is a group of documents in MongoDB. It is the equivalent of a table in SQL databases, but without a fixed schema.',
    points: 1
  },
  {
    skillName: 'MongoDB', difficulty: 'easy',
    question: 'What is the default field MongoDB adds to every document?',
    options: ['uuid', 'id', '_id', 'docId'],
    correctAnswer: 2,
    explanation: 'MongoDB automatically adds an _id field to every document as a unique identifier. By default it is an ObjectId.',
    points: 1
  },

  // ── MongoDB Medium ─────────────────────────────────────────────────────────
  {
    skillName: 'MongoDB', difficulty: 'medium',
    question: 'In Mongoose, what does a Schema define?',
    options: [
      'The database connection settings',
      'The structure, field types, default values, and validation rules for a MongoDB document',
      'The server routes for a Node.js API',
      'The frontend component structure'
    ],
    correctAnswer: 1,
    explanation: 'A Mongoose Schema defines the shape of a document: field names, types, defaults, validators, and more. A Model is compiled from a Schema.',
    points: 1
  },
  {
    skillName: 'MongoDB', difficulty: 'medium',
    question: 'What is the purpose of MongoDB indexes?',
    options: [
      'To encrypt sensitive fields in documents',
      'To improve query performance by creating a data structure that makes lookups faster',
      'To define relationships between collections',
      'To compress document storage'
    ],
    correctAnswer: 1,
    explanation: 'Indexes maintain a separate data structure that makes querying much faster. Without indexes, MongoDB does a full collection scan (O(n)).',
    points: 1
  },
  {
    skillName: 'MongoDB', difficulty: 'medium',
    question: 'What does the MongoDB aggregation pipeline do?',
    options: [
      'Connects to multiple databases simultaneously',
      'Processes documents through a series of stages (match, group, project, sort) to produce computed results',
      'Automatically backs up data',
      'Validates documents against a JSON schema'
    ],
    correctAnswer: 1,
    explanation: 'The aggregation pipeline is a framework for data transformation. Documents pass through stages: $match filters, $group aggregates, $project reshapes output.',
    points: 1
  },
  {
    skillName: 'MongoDB', difficulty: 'hard',
    question: 'What is the difference between MongoDB\'s findOne() and find() methods?',
    options: [
      'findOne() is deprecated; find() replaces it',
      'find() returns a cursor for all matching documents; findOne() returns the first matching document directly (or null)',
      'findOne() can only match by _id; find() can use any query',
      'find() is synchronous; findOne() is asynchronous'
    ],
    correctAnswer: 1,
    explanation: 'find() returns a cursor that iterates over all matching documents. findOne() returns the first matching document (or null) directly — it\'s a convenience wrapper.',
    points: 1
  },

  // ── REST API Easy ──────────────────────────────────────────────────────────
  {
    skillName: 'REST API', difficulty: 'easy',
    question: 'What does REST stand for?',
    options: [
      'Remote Execution of Software Tasks',
      'Representational State Transfer',
      'Real-time Event Streaming Technology',
      'Responsive and Efficient Server Technology'
    ],
    correctAnswer: 1,
    explanation: 'REST (Representational State Transfer) is an architectural style for distributed systems, commonly used for web APIs.',
    points: 1
  },
  {
    skillName: 'REST API', difficulty: 'easy',
    question: 'Which HTTP method is used to retrieve data in a RESTful API?',
    options: ['POST', 'PUT', 'GET', 'DELETE'],
    correctAnswer: 2,
    explanation: 'GET requests retrieve data. POST creates. PUT/PATCH updates. DELETE removes. These follow HTTP semantics in REST design.',
    points: 1
  },
  {
    skillName: 'REST API', difficulty: 'easy',
    question: 'What HTTP status code indicates a successful resource creation?',
    options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
    correctAnswer: 1,
    explanation: '201 Created is the correct status for a successful POST request that creates a new resource.',
    points: 1
  },

  // ── REST API Medium ────────────────────────────────────────────────────────
  {
    skillName: 'REST API', difficulty: 'medium',
    question: 'What is the purpose of HTTP status code 401 vs 403?',
    options: [
      '401 = Not Found; 403 = Server Error',
      '401 = Unauthenticated (not logged in); 403 = Unauthorized (logged in but insufficient permissions)',
      '401 = Bad Request; 403 = Request Timeout',
      'They mean the same thing'
    ],
    correctAnswer: 1,
    explanation: '401 Unauthorized means authentication is required or failed. 403 Forbidden means authenticated but not permitted. These are distinct security concepts.',
    points: 1
  },
  {
    skillName: 'REST API', difficulty: 'medium',
    question: 'What is JSON Web Token (JWT) used for in REST APIs?',
    options: [
      'Encrypting JSON data in the database',
      'Stateless authentication — encoding user identity in a signed token sent with each request',
      'Converting JSON to XML format',
      'Validating JSON schema of request bodies'
    ],
    correctAnswer: 1,
    explanation: 'JWT is a compact, URL-safe token encoding user claims. The server signs it with a secret; clients include it in Authorization headers for stateless auth.',
    points: 1
  },
  {
    skillName: 'REST API', difficulty: 'medium',
    question: 'What does CORS stand for and why is it important?',
    options: [
      'Content Order Routing System — manages how requests are processed',
      'Cross-Origin Resource Sharing — a browser security mechanism controlling which domains can access your API',
      'Client-Oriented REST Standard — defines REST best practices',
      'Cached Object Request Service — speeds up API responses'
    ],
    correctAnswer: 1,
    explanation: 'CORS is a browser security feature. When a web app on domain A requests API on domain B, the browser checks if B allows A via CORS headers.',
    points: 1
  },
  {
    skillName: 'REST API', difficulty: 'hard',
    question: 'What is the difference between PUT and PATCH in HTTP?',
    options: [
      'PUT is for creating; PATCH is for reading',
      'PUT replaces the entire resource; PATCH applies partial modifications to a resource',
      'PUT is idempotent; PATCH is not allowed in REST',
      'There is no difference — they can be used interchangeably'
    ],
    correctAnswer: 1,
    explanation: 'PUT replaces the entire resource (idempotent). PATCH applies partial updates. If you PUT with missing fields, they are removed. PATCH only updates provided fields.',
    points: 1
  },

  // ── Git Easy ───────────────────────────────────────────────────────────────
  {
    skillName: 'Git', difficulty: 'easy',
    question: 'What command initializes a new Git repository?',
    options: ['git start', 'git init', 'git new', 'git create'],
    correctAnswer: 1,
    explanation: 'git init creates a new empty Git repository in the current directory, adding a .git folder.',
    points: 1
  },
  {
    skillName: 'Git', difficulty: 'easy',
    question: 'Which command stages all changes in the current directory for the next commit?',
    options: ['git commit -a', 'git add .', 'git stage all', 'git track .'],
    correctAnswer: 1,
    explanation: 'git add . stages all modified and new files in the current directory. git add -A also includes deleted files.',
    points: 1
  },
  {
    skillName: 'Git', difficulty: 'easy',
    question: 'What is a Git commit?',
    options: [
      'A temporary save that can be lost if the computer shuts down',
      'A permanent snapshot of staged changes saved to the repository history',
      'A request to merge code into the main branch',
      'A connection to a remote repository'
    ],
    correctAnswer: 1,
    explanation: 'A commit is a snapshot of your staged changes permanently recorded in the Git history with a unique SHA hash, author, and message.',
    points: 1
  },

  // ── Git Medium ─────────────────────────────────────────────────────────────
  {
    skillName: 'Git', difficulty: 'medium',
    question: 'What is the purpose of a Git branch?',
    options: [
      'To create a backup copy of the entire repository',
      'To create an isolated line of development, allowing work on features without affecting the main codebase',
      'To connect to a different remote repository',
      'To restore deleted files'
    ],
    correctAnswer: 1,
    explanation: 'Branches allow parallel development. You can work on feature/bugfix branches without touching main, then merge when ready.',
    points: 1
  },
  {
    skillName: 'Git', difficulty: 'medium',
    question: 'What is the difference between git merge and git rebase?',
    options: [
      'merge combines histories creating a merge commit; rebase replays commits on top of the target branch for a linear history',
      'merge is for local branches; rebase is only for remote branches',
      'They are identical in outcome',
      'merge deletes the source branch; rebase keeps it'
    ],
    correctAnswer: 0,
    explanation: 'merge creates a merge commit preserving history. rebase replays your commits on the tip of the target branch, creating a cleaner linear history but rewriting commit hashes.',
    points: 1
  },
  {
    skillName: 'Git', difficulty: 'hard',
    question: 'What does git stash do?',
    options: [
      'Permanently deletes uncommitted changes',
      'Temporarily saves uncommitted changes to a stack so you can switch branches with a clean working directory',
      'Creates a new branch from current changes',
      'Sends local commits to the remote repository'
    ],
    correctAnswer: 1,
    explanation: 'git stash saves your working directory and index state to a stack. Use git stash pop to restore them. Useful when switching branches with uncommitted work.',
    points: 1
  }
];

module.exports = reactNodeQuestions;
