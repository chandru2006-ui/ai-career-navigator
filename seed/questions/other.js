const otherQuestions = [
  // ── Python Easy ────────────────────────────────────────────────────────────
  {
    skillName: 'Python', difficulty: 'easy',
    question: 'How do you print "Hello, World!" in Python?',
    options: ['console.log("Hello, World!")', 'echo "Hello, World!"', 'print("Hello, World!")', 'System.out.println("Hello, World!")'],
    correctAnswer: 2,
    explanation: 'Python uses the built-in print() function to output text.',
    points: 1
  },
  {
    skillName: 'Python', difficulty: 'easy',
    question: 'Which of the following is a Python list?',
    options: ['{"a": 1, "b": 2}', '(1, 2, 3)', '[1, 2, 3]', '{1, 2, 3}'],
    correctAnswer: 2,
    explanation: 'Square brackets [] define a list in Python. {} is a dict or set, () is a tuple.',
    points: 1
  },
  {
    skillName: 'Python', difficulty: 'easy',
    question: 'What is the correct way to define a function in Python?',
    options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'],
    correctAnswer: 1,
    explanation: 'Python uses the def keyword to define functions, followed by the function name and parameters.',
    points: 1
  },
  {
    skillName: 'Python', difficulty: 'medium',
    question: 'What is a Python decorator?',
    options: [
      'A way to add CSS styles to Python output',
      'A function that wraps another function to add behavior without modifying the original function',
      'A special method for class inheritance',
      'A Python module for UI design'
    ],
    correctAnswer: 1,
    explanation: 'A decorator is a function that takes another function as input and returns a modified version. Used with the @ syntax to add logging, authentication, caching, etc.',
    points: 1
  },
  {
    skillName: 'Python', difficulty: 'medium',
    question: 'What is a Python list comprehension?',
    options: [
      'A way to document Python lists',
      'A concise syntax to create lists: [expression for item in iterable if condition]',
      'A method to sort lists in Python',
      'A way to merge multiple lists'
    ],
    correctAnswer: 1,
    explanation: 'List comprehensions provide a concise way to create lists. Example: squares = [x**2 for x in range(10) if x % 2 == 0]',
    points: 1
  },
  {
    skillName: 'Python', difficulty: 'medium',
    question: 'What is the difference between Python\'s append() and extend() list methods?',
    options: [
      'They are the same method with different names',
      'append() adds a single element; extend() adds all elements of an iterable to the list',
      'append() adds at the end; extend() adds at the beginning',
      'extend() works only for strings; append() for all types'
    ],
    correctAnswer: 1,
    explanation: '[1,2].append([3,4]) → [1,2,[3,4]] (adds as single element). [1,2].extend([3,4]) → [1,2,3,4] (flattens and adds each element).',
    points: 1
  },
  {
    skillName: 'Python', difficulty: 'hard',
    question: 'What are Python generators and why are they memory-efficient?',
    options: [
      'Functions that generate random numbers efficiently',
      'Functions using "yield" that produce values lazily one at a time, never storing the full sequence in memory',
      'A built-in Python tool for code generation',
      'Specialized classes that auto-generate __init__ methods'
    ],
    correctAnswer: 1,
    explanation: 'Generators use yield to produce values one at a time only when requested. They maintain state between calls. Perfect for large datasets that would be expensive to store all at once.',
    points: 1
  },
  {
    skillName: 'Python', difficulty: 'hard',
    question: 'What is the difference between @staticmethod and @classmethod in Python?',
    options: [
      'staticmethod takes no special first arg; classmethod takes "cls" (the class) as first arg',
      'staticmethod works on instances; classmethod works on the class',
      'They are identical — just different naming conventions',
      'classmethod can only be called from outside the class; staticmethod only from inside'
    ],
    correctAnswer: 0,
    explanation: '@staticmethod: no access to class or instance (just a function in class namespace). @classmethod: receives cls as first argument, can access class-level attributes and create instances.',
    points: 1
  },

  // ── Data Structures Medium ─────────────────────────────────────────────────
  {
    skillName: 'Data Structures', difficulty: 'easy',
    question: 'What is a Stack data structure?',
    options: [
      'A data structure that allows access to any element randomly',
      'A Last-In-First-Out (LIFO) data structure where the last element added is the first removed',
      'A First-In-First-Out (FIFO) data structure',
      'A tree-based data structure with parent-child relationships'
    ],
    correctAnswer: 1,
    explanation: 'A stack follows LIFO order. Think of a stack of plates — you add and remove from the top. Key operations: push (add) and pop (remove from top).',
    points: 1
  },
  {
    skillName: 'Data Structures', difficulty: 'easy',
    question: 'What is a Queue data structure?',
    options: [
      'A Last-In-First-Out (LIFO) structure',
      'A First-In-First-Out (FIFO) structure where elements are added at the rear and removed from the front',
      'A sorted collection of elements',
      'A tree with only two children per node'
    ],
    correctAnswer: 1,
    explanation: 'A queue follows FIFO order — like a line at a store. Elements are enqueued at the back and dequeued from the front.',
    points: 1
  },
  {
    skillName: 'Data Structures', difficulty: 'medium',
    question: 'What is the time complexity of searching for an element in a Hash Table (average case)?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctAnswer: 2,
    explanation: 'Hash tables use a hash function to directly compute the index of the element, giving O(1) average-case lookup. Worst case (many collisions) is O(n).',
    points: 1
  },
  {
    skillName: 'Data Structures', difficulty: 'medium',
    question: 'What is a Binary Search Tree (BST)?',
    options: [
      'A tree where every node has exactly two children',
      'A tree where left child < parent < right child, enabling O(log n) search in balanced trees',
      'A tree structure used exclusively for file systems',
      'A balanced tree guaranteed to have O(log n) operations always'
    ],
    correctAnswer: 1,
    explanation: 'In a BST, for every node: all left subtree values are smaller, all right subtree values are larger. This ordering enables binary search with O(log n) average complexity.',
    points: 1
  },
  {
    skillName: 'Data Structures', difficulty: 'hard',
    question: 'What is the difference between an Array and a Linked List in terms of time complexity?',
    options: [
      'Arrays are always faster than linked lists for all operations',
      'Arrays: O(1) random access, O(n) insert/delete at arbitrary position; Linked Lists: O(n) access, O(1) insert/delete with pointer',
      'Linked Lists have O(1) access time if you cache node positions',
      'They have identical time complexities for all operations'
    ],
    correctAnswer: 1,
    explanation: 'Arrays store elements contiguously (O(1) index access, O(n) insert/delete due to shifting). Linked Lists have O(1) insert/delete at a known node but O(n) to find elements.',
    points: 1
  },

  // ── Algorithms Medium ──────────────────────────────────────────────────────
  {
    skillName: 'Algorithms', difficulty: 'easy',
    question: 'What is Big O notation used for?',
    options: [
      'Measuring the exact runtime of a program in milliseconds',
      'Describing the upper bound of time or space complexity as input size grows',
      'Counting the number of lines of code in a function',
      'Ranking algorithms by their code readability'
    ],
    correctAnswer: 1,
    explanation: 'Big O notation describes the worst-case growth rate of time or space as n (input size) increases. It helps compare algorithms at scale.',
    points: 1
  },
  {
    skillName: 'Algorithms', difficulty: 'medium',
    question: 'What is the time complexity of Binary Search?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correctAnswer: 2,
    explanation: 'Binary Search halves the search space at each step. Starting with n elements: n → n/2 → n/4 → ... → 1. This gives log₂(n) steps = O(log n).',
    points: 1
  },
  {
    skillName: 'Algorithms', difficulty: 'medium',
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort — O(n²)', 'Selection Sort — O(n²)', 'Quick Sort / Merge Sort — O(n log n)', 'Insertion Sort — O(n²)'],
    correctAnswer: 2,
    explanation: 'Quick Sort (avg O(n log n)) and Merge Sort (always O(n log n)) are the most efficient general-purpose sorting algorithms.',
    points: 1
  },
  {
    skillName: 'Algorithms', difficulty: 'hard',
    question: 'What is dynamic programming and when should it be applied?',
    options: [
      'A programming paradigm using dynamic typing languages',
      'An optimization technique for problems with overlapping subproblems and optimal substructure — saves previously computed results to avoid recomputation',
      'Writing code that can dynamically change its behavior at runtime',
      'An algorithm for dynamically sorting data as it arrives'
    ],
    correctAnswer: 1,
    explanation: 'DP solves problems by breaking them into subproblems and caching results (memoization/tabulation). Applied when: (1) overlapping subproblems, (2) optimal substructure. E.g., Fibonacci, knapsack, longest common subsequence.',
    points: 1
  },

  // ── SQL Easy ───────────────────────────────────────────────────────────────
  {
    skillName: 'SQL', difficulty: 'easy',
    question: 'Which SQL command is used to retrieve data from a database?',
    options: ['GET', 'FETCH', 'SELECT', 'READ'],
    correctAnswer: 2,
    explanation: 'SELECT is the SQL command for querying data. Basic form: SELECT column FROM table WHERE condition',
    points: 1
  },
  {
    skillName: 'SQL', difficulty: 'easy',
    question: 'Which SQL clause filters rows in a query?',
    options: ['HAVING', 'WHERE', 'GROUP BY', 'ORDER BY'],
    correctAnswer: 1,
    explanation: 'WHERE filters individual rows before grouping. HAVING filters groups after GROUP BY.',
    points: 1
  },
  {
    skillName: 'SQL', difficulty: 'medium',
    question: 'What is the difference between INNER JOIN and LEFT JOIN?',
    options: [
      'INNER JOIN returns all rows; LEFT JOIN returns only matching rows',
      'INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all left table rows plus matches from right',
      'They are identical with different names',
      'LEFT JOIN only works with two tables; INNER JOIN works with many'
    ],
    correctAnswer: 1,
    explanation: 'INNER JOIN: only rows where the join condition matches in BOTH tables. LEFT JOIN: ALL rows from the left table, with NULL for unmatched right table columns.',
    points: 1
  },
  {
    skillName: 'SQL', difficulty: 'medium',
    question: 'What is a SQL INDEX and why is it used?',
    options: [
      'A sequential number added to each row',
      'A database structure that speeds up data retrieval by reducing full table scans',
      'A constraint that ensures unique values in a column',
      'A backup copy of the database'
    ],
    correctAnswer: 1,
    explanation: 'An index is a data structure (commonly B-tree) that allows the database to find rows quickly without scanning the entire table, similar to a book\'s index.',
    points: 1
  },
  {
    skillName: 'SQL', difficulty: 'hard',
    question: 'What is the difference between HAVING and WHERE in SQL?',
    options: [
      'HAVING is used before GROUP BY; WHERE is used after',
      'WHERE filters rows before grouping/aggregation; HAVING filters groups after GROUP BY',
      'They are interchangeable in all SQL contexts',
      'HAVING only works with COUNT(); WHERE works with all functions'
    ],
    correctAnswer: 1,
    explanation: 'WHERE filters individual rows (executes before GROUP BY). HAVING filters groups (executes after GROUP BY). Use HAVING when filtering on aggregate functions like COUNT, SUM, AVG.',
    points: 1
  },

  // ── Machine Learning Medium ────────────────────────────────────────────────
  {
    skillName: 'Machine Learning', difficulty: 'easy',
    question: 'What is supervised learning?',
    options: [
      'Learning that requires human supervision at all times',
      'Training a model on labeled data (input-output pairs) to make predictions on new data',
      'A model that learns without any data',
      'Training using reinforcement rewards only'
    ],
    correctAnswer: 1,
    explanation: 'Supervised learning trains on labeled examples (X → Y). The model learns to map inputs to outputs. Examples: classification (spam/not spam), regression (house prices).',
    points: 1
  },
  {
    skillName: 'Machine Learning', difficulty: 'medium',
    question: 'What is overfitting in machine learning?',
    options: [
      'A model that is too simple to capture patterns',
      'A model that learns training data too well (including noise), performing poorly on new unseen data',
      'Using too much training data',
      'A model that trains too slowly'
    ],
    correctAnswer: 1,
    explanation: 'Overfitting occurs when a model memorizes training data (including noise) rather than learning general patterns. Signs: high training accuracy, low test accuracy.',
    points: 1
  },
  {
    skillName: 'Machine Learning', difficulty: 'medium',
    question: 'What is the purpose of train/test split in machine learning?',
    options: [
      'To reduce the amount of data needed for training',
      'To evaluate model performance on data it has never seen, simulating real-world prediction',
      'To speed up model training',
      'To balance positive and negative classes'
    ],
    correctAnswer: 1,
    explanation: 'Splitting data keeps a held-out test set the model never sees during training. This gives an honest estimate of how the model will perform on new data.',
    points: 1
  },
  {
    skillName: 'Machine Learning', difficulty: 'hard',
    question: 'What is gradient descent in the context of machine learning?',
    options: [
      'A method to visualize high-dimensional data',
      'An optimization algorithm that iteratively adjusts model parameters in the direction that minimizes the loss function',
      'A technique to reduce the number of features',
      'A method to handle missing data'
    ],
    correctAnswer: 1,
    explanation: 'Gradient descent minimizes a loss function by computing gradients (partial derivatives) and stepping parameters in the opposite direction. Learning rate controls step size.',
    points: 1
  },

  // ── Cybersecurity Medium ───────────────────────────────────────────────────
  {
    skillName: 'Cybersecurity', difficulty: 'easy',
    question: 'What is a firewall?',
    options: [
      'A physical barrier against natural disasters in data centers',
      'A network security system that monitors and controls incoming and outgoing network traffic based on rules',
      'Software that speeds up internet connections',
      'A type of antivirus for mobile devices'
    ],
    correctAnswer: 1,
    explanation: 'A firewall monitors and filters network traffic based on configured security rules, acting as a barrier between trusted and untrusted networks.',
    points: 1
  },
  {
    skillName: 'Cybersecurity', difficulty: 'medium',
    question: 'What is SQL Injection?',
    options: [
      'A method to speed up SQL queries',
      'An attack that inserts malicious SQL code into input fields to manipulate or access the database',
      'A way to import SQL databases',
      'A technique for optimizing database indexes'
    ],
    correctAnswer: 1,
    explanation: 'SQL injection inserts malicious SQL into user input to manipulate database queries. Prevention: parameterized queries, prepared statements, input validation.',
    points: 1
  },
  {
    skillName: 'Cybersecurity', difficulty: 'medium',
    question: 'What is the principle of least privilege?',
    options: [
      'All users should have equal access rights',
      'Users and systems should have only the minimum permissions necessary to perform their required tasks',
      'Admin accounts should have no restrictions',
      'Security systems should prioritize performance over access control'
    ],
    correctAnswer: 1,
    explanation: 'Least privilege limits access rights to only what is needed for legitimate purposes, minimizing the attack surface and limiting damage from breaches or compromised accounts.',
    points: 1
  },
  {
    skillName: 'Cybersecurity', difficulty: 'hard',
    question: 'What is the difference between symmetric and asymmetric encryption?',
    options: [
      'Symmetric is stronger; asymmetric is weaker',
      'Symmetric uses one shared key for both encryption and decryption; asymmetric uses a public key for encryption and a private key for decryption',
      'Symmetric only works for text; asymmetric works for all data types',
      'Symmetric is used for HTTPS; asymmetric is used for Wi-Fi'
    ],
    correctAnswer: 1,
    explanation: 'Symmetric (AES): one secret key shared between parties — fast but key distribution is a challenge. Asymmetric (RSA): public key encrypts, private key decrypts — solves key distribution but slower.',
    points: 1
  },

  // ── Cloud Easy ─────────────────────────────────────────────────────────────
  {
    skillName: 'Cloud', difficulty: 'easy',
    question: 'What is cloud computing?',
    options: [
      'Computing using weather prediction algorithms',
      'Delivery of computing services (servers, storage, databases, networking) over the internet on demand',
      'A new type of computer hardware',
      'Software that visualizes cloud formations'
    ],
    correctAnswer: 1,
    explanation: 'Cloud computing delivers IT resources over the internet with pay-as-you-go pricing, eliminating the need to own and maintain physical data centers.',
    points: 1
  },
  {
    skillName: 'Cloud', difficulty: 'medium',
    question: 'What is the difference between IaaS, PaaS, and SaaS?',
    options: [
      'They are three names for the same cloud service type',
      'IaaS provides infrastructure (VMs, storage); PaaS provides platform (runtime, DB); SaaS provides complete applications to end users',
      'IaaS is for enterprises; PaaS for startups; SaaS for individuals',
      'IaaS uses AWS; PaaS uses Google; SaaS uses Azure'
    ],
    correctAnswer: 1,
    explanation: 'IaaS (AWS EC2): raw compute/storage. PaaS (Heroku, Google App Engine): managed platform — deploy code without managing servers. SaaS (Gmail, Salesforce): complete software delivered over the web.',
    points: 1
  },
  {
    skillName: 'Cloud', difficulty: 'hard',
    question: 'What is serverless computing?',
    options: [
      'Computing without any servers at all',
      'A cloud execution model where the provider manages server provisioning; developers deploy code as functions triggered by events and pay only for actual execution time',
      'Removing the need for a backend entirely',
      'Using edge computing to eliminate centralized servers'
    ],
    correctAnswer: 1,
    explanation: 'Serverless (AWS Lambda, Cloud Functions) lets you run code without provisioning servers. The provider auto-scales, and you pay per invocation. Ideal for event-driven, unpredictable workloads.',
    points: 1
  },

  // ── Blockchain Easy ────────────────────────────────────────────────────────
  {
    skillName: 'Blockchain', difficulty: 'easy',
    question: 'What is a blockchain?',
    options: [
      'A type of cryptocurrency',
      'A distributed, immutable ledger of transactions stored in linked blocks across a decentralized network',
      'A new type of database owned by one company',
      'A programming language for financial applications'
    ],
    correctAnswer: 1,
    explanation: 'A blockchain is a distributed ledger where data is organized in blocks, each cryptographically linked to the previous one, making it tamper-evident.',
    points: 1
  },
  {
    skillName: 'Blockchain', difficulty: 'medium',
    question: 'What is a smart contract?',
    options: [
      'A legal document digitally signed by two parties',
      'Self-executing code stored on a blockchain that automatically enforces the terms of an agreement when conditions are met',
      'An AI system that negotiates contracts',
      'A method to encrypt traditional contracts'
    ],
    correctAnswer: 1,
    explanation: 'Smart contracts are programs stored on a blockchain that run when predetermined conditions are met. They automate agreements without intermediaries.',
    points: 1
  },
  {
    skillName: 'Blockchain', difficulty: 'hard',
    question: 'What is the Byzantine Generals Problem and how does blockchain solve it?',
    options: [
      'A problem about encrypting military communications, solved by HTTPS',
      'The challenge of reaching consensus among distributed nodes where some may be malicious, solved by blockchain\'s consensus mechanisms (PoW, PoS)',
      'A networking problem about routing in distributed systems, solved by blockchain\'s P2P protocol',
      'The challenge of scaling databases across data centers, solved by blockchain\'s sharding'
    ],
    correctAnswer: 1,
    explanation: 'The Byzantine Generals Problem asks how distributed nodes can agree when some nodes may lie/fail. Blockchain solves it via consensus mechanisms: Proof of Work (compute-expensive) or Proof of Stake (stake-based voting).',
    points: 1
  },

  // ── Solidity Medium ────────────────────────────────────────────────────────
  {
    skillName: 'Solidity', difficulty: 'easy',
    question: 'What is Solidity used for?',
    options: [
      'Building mobile applications',
      'Writing smart contracts on the Ethereum blockchain',
      'Creating server-side web applications',
      'Data science and machine learning'
    ],
    correctAnswer: 1,
    explanation: 'Solidity is a statically-typed programming language designed for writing smart contracts on Ethereum and compatible blockchains.',
    points: 1
  },
  {
    skillName: 'Solidity', difficulty: 'medium',
    question: 'What is gas in Ethereum?',
    options: [
      'A cryptocurrency used to pay miners',
      'A unit measuring the computational effort required to execute operations on Ethereum, paid in ETH',
      'A method to compress blockchain data',
      'The speed at which transactions are processed'
    ],
    correctAnswer: 1,
    explanation: 'Gas measures computational work in Ethereum. Every operation costs gas. Gas price (in Gwei) determines how much ETH you pay. Higher gas price = faster inclusion by miners.',
    points: 1
  },

  // ── Data Analysis Medium ────────────────────────────────────────────────────
  {
    skillName: 'Data Analysis', difficulty: 'easy',
    question: 'What is the mean of the dataset: [2, 4, 6, 8, 10]?',
    options: ['5', '6', '4', '8'],
    correctAnswer: 1,
    explanation: 'Mean = sum / count = (2+4+6+8+10) / 5 = 30/5 = 6',
    points: 1
  },
  {
    skillName: 'Data Analysis', difficulty: 'medium',
    question: 'What is the difference between correlation and causation?',
    options: [
      'They are the same concept in statistics',
      'Correlation shows a statistical relationship between variables; causation means one variable directly causes changes in another',
      'Correlation means one variable causes another; causation is just a statistical pattern',
      'Correlation is used for numeric data; causation for categorical data'
    ],
    correctAnswer: 1,
    explanation: 'Correlation measures how variables move together (r from -1 to 1). Causation requires evidence that one variable directly influences another. "Correlation does not imply causation."',
    points: 1
  },
  {
    skillName: 'Data Analysis', difficulty: 'hard',
    question: 'What is A/B testing and when is it used?',
    options: [
      'Testing code using A and B test suites',
      'A controlled experiment comparing two versions (A=control, B=variant) to measure which performs better on a metric',
      'A debugging technique that alternates between two code versions',
      'A method to backup data across two systems'
    ],
    correctAnswer: 1,
    explanation: 'A/B testing randomly splits users into control (A) and variant (B) groups to measure the causal impact of a change. Statistical significance determines if results are real or random chance.',
    points: 1
  },

  // ── TypeScript Medium ──────────────────────────────────────────────────────
  {
    skillName: 'TypeScript', difficulty: 'easy',
    question: 'What is TypeScript?',
    options: [
      'A completely separate language from JavaScript',
      'A strongly typed superset of JavaScript that compiles to plain JavaScript',
      'A JavaScript testing framework',
      'A JavaScript runtime like Node.js'
    ],
    correctAnswer: 1,
    explanation: 'TypeScript adds optional static types to JavaScript. TypeScript code compiles (transpiles) to plain JavaScript that runs in any browser or Node.js environment.',
    points: 1
  },
  {
    skillName: 'TypeScript', difficulty: 'medium',
    question: 'What is the benefit of using interfaces in TypeScript?',
    options: [
      'They make code run faster at runtime',
      'They define the shape of objects, enabling type checking and better IDE autocomplete without runtime overhead',
      'They replace JavaScript classes entirely',
      'They automatically generate API documentation'
    ],
    correctAnswer: 1,
    explanation: 'TypeScript interfaces define contracts for object shapes. They exist only at compile-time (erased in compiled JS), providing type safety and IDE support with zero runtime cost.',
    points: 1
  }
];

module.exports = otherQuestions;
