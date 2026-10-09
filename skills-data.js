/**
 * =============================================================================
 * SKILLS INTELLIGENCE, ROADMAP, TUTORIALS & YOUTUBE DATA ENGINE
 * Himanshu Kumar's Comprehensive Technical Mastery & Resource Portal
 * =============================================================================
 */

(function () {
    'use strict';

    // Comprehensive skills knowledge base
    const SKILLS_DATABASE = {
        python: {
            id: 'python',
            name: 'Python',
            category: 'Languages',
            categoryKey: 'languages',
            icon: 'fa-brands fa-python',
            color: '#38bdf8',
            tagline: 'High-Level Programming for Data Analytics, Machine Learning & Automation',
            proficiency: '90% - Advanced / Production Ready',
            overview: 'Python is a high-level, interpreted programming language known for its clean syntax and massive ecosystem. In modern tech, Python is the undisputed gold standard for Data Science, Machine Learning, Artificial Intelligence, and scalable backend automation. In my portfolio, Python powers predictive ML modeling, custom ETL data pipelines, and automation scripts.',
            roadmap: [
                {
                    phase: 'Phase 1: Foundations & Core Syntax',
                    duration: 'Weeks 1 - 2',
                    topics: ['Variables & Dynamic Typing', 'Conditionals, Loops & Comprehensions', 'Functions, *args & **kwargs', 'Scope (LEGB rule) & Built-in Modules'],
                    project: 'CLI Data Parser & Automated File Organizer'
                },
                {
                    phase: 'Phase 2: Data Structures & OOP',
                    duration: 'Weeks 3 - 4',
                    topics: ['Lists, Tuples, Dictionaries, Sets & Time Complexities', 'Object-Oriented Programming (Classes, Inheritance, Polymorphism)', 'Exception Handling, Custom Exceptions & Context Managers (`with`)', 'File I/O (CSV, JSON, Text)'],
                    project: 'Object-Oriented Bank Account / Inventory Engine'
                },
                {
                    phase: 'Phase 3: Advanced Python & Performance',
                    duration: 'Weeks 5 - 6',
                    topics: ['Decorators, Generators & Iterators', 'Functional Tools (lambda, map, filter, functools)', 'Multithreading vs Multiprocessing & Global Interpreter Lock (GIL)', 'Virtual Environments & Package Management (pip, venv)'],
                    project: 'Multi-Threaded Web Scraper with Rate Limiting'
                },
                {
                    phase: 'Phase 4: Data Engineering & Production APIs',
                    duration: 'Weeks 7 - 10',
                    topics: ['NumPy & Pandas Vectorized Operations', 'Data Visualization (Matplotlib, Seaborn)', 'Machine Learning with Scikit-Learn', 'RESTful API Development with FastAPI / Flask'],
                    project: 'End-to-End Machine Learning Prediction Microservice'
                }
            ],
            youtube: [
                {
                    title: 'Python for Beginners - Full Course (12 Hours)',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+python+for+beginners+full+course',
                    desc: 'The complete beginner-friendly masterclass covering all fundamental syntax, problem-solving, and practical exercises.'
                },
                {
                    title: 'Chai aur Python Series (Hindi)',
                    channel: 'Chai aur Code (Hitesh Choudhary)',
                    url: 'https://www.youtube.com/results?search_query=chai+aur+python+hitesh+choudhary',
                    desc: 'Deep conceptual explanations in Hindi exploring memory references, decorators, and modern Python best practices.'
                },
                {
                    title: 'Python Complete Course in Hindi',
                    channel: 'CodeWithHarry',
                    url: 'https://www.youtube.com/results?search_query=codewithharry+python+tutorial+for+beginners',
                    desc: 'Comprehensive step-by-step Hindi tutorial playlist with practice problems, 100 days of code, and real-world projects.'
                },
                {
                    title: 'Python Tutorial for Beginners (Full Course)',
                    channel: 'Programming with Mosh',
                    url: 'https://www.youtube.com/results?search_query=programming+with+mosh+python+tutorial',
                    desc: 'Clear, concise, professional introduction to Python syntax, functions, and standard libraries.'
                }
            ],
            tutorials: [
                {
                    title: 'Official Python Documentation & Tutorial',
                    url: 'https://docs.python.org/3/tutorial/',
                    type: 'Official Documentation',
                    desc: 'The authoritative reference manual by the Python Software Foundation covering the latest Python 3 features.'
                },
                {
                    title: 'Real Python In-Depth Learning Paths',
                    url: 'https://realpython.com/',
                    type: 'Interactive Guide',
                    desc: 'Practical, high-quality deep-dive articles for Python developers from intermediate to advanced levels.'
                },
                {
                    title: 'W3Schools Python Reference',
                    url: 'https://www.w3schools.com/python/',
                    type: 'Beginner Interactive',
                    desc: 'Hands-on interactive examples to practice syntax directly inside the web browser.'
                },
                {
                    title: 'Python Cheatsheet (Interactive Reference)',
                    url: 'https://www.pythoncheatsheet.org/',
                    type: 'Cheat Sheet',
                    desc: 'Quick reference for syntax, collections, regex, slicing, and common algorithmic patterns.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Dynamic Typing & Reference Counting Memory Management',
                    'List & Dictionary Comprehensions for Vectorized Speed',
                    'Decorators for Cross-Cutting Concerns (Logging, Auth, Timing)',
                    'Generators (`yield`) for Memory-Efficient Stream Processing',
                    'Global Interpreter Lock (GIL) and Asyncio Non-Blocking I/O'
                ],
                realWorldUse: 'Used by Google, Netflix, and NASA for backend APIs, data transformation pipelines, artificial intelligence model training, and automated DevOps scripting.',
                interviewTips: 'Be ready to explain the difference between shallow copy vs deep copy, mutable vs immutable objects, and how `*args` and `**kwargs` unpack parameters.',
                recommendedProjects: [
                    'Algorithmic Stock Market Predictor with Scikit-Learn',
                    'Automated Multi-Source Data Ingestion ETL Pipeline',
                    'High-Concurrency REST API built with FastAPI & Pydantic'
                ]
            }
        },

        cpp: {
            id: 'cpp',
            name: 'C++',
            category: 'Languages',
            categoryKey: 'languages',
            icon: 'fa-solid fa-code',
            color: '#60a5fa',
            tagline: 'High-Performance Systems Programming & Object-Oriented Logic',
            proficiency: '85% - Advanced Problem Solving',
            overview: 'C++ is a powerhouse compiled language providing direct memory manipulation, zero-cost abstractions, and blazing-fast execution speeds. It is the core language for game engines, operating systems, embedded hardware, and algorithmic competitive programming. In my development, C++ has honed my deep understanding of memory addresses, pointer arithmetic, and algorithmic complexity.',
            roadmap: [
                {
                    phase: 'Phase 1: Basic Syntax & Control Flow',
                    duration: 'Weeks 1 - 2',
                    topics: ['Data Types, Type Modifiers & Standard I/O', 'Control Flow (if-else, switch, loops)', 'Functions, Passing by Value vs Reference', 'Arrays & Strings'],
                    project: 'Scientific Calculator & Matrix Mathematics CLI'
                },
                {
                    phase: 'Phase 2: Pointers & Dynamic Memory',
                    duration: 'Weeks 3 - 4',
                    topics: ['Pointer Arithmetic, Dereferencing & Double Pointers', 'Dynamic Memory (`new` and `delete`)', 'Memory Leaks & Segmentation Faults', 'References vs Pointers'],
                    project: 'Custom Dynamic Array (Vector Clone) from Scratch'
                },
                {
                    phase: 'Phase 3: Object-Oriented Programming (OOP)',
                    duration: 'Weeks 5 - 6',
                    topics: ['Classes, Objects, Constructors & Destructors', 'Encapsulation & Access Specifiers (public, private, protected)', 'Inheritance & Diamond Problem Solution (Virtual Base Class)', 'Polymorphism (Function Overloading, Virtual Functions, VTable)'],
                    project: 'Banking Management System with Class Hierarchy'
                },
                {
                    phase: 'Phase 4: STL & Modern C++ (C++11/17/20)',
                    duration: 'Weeks 7 - 10',
                    topics: ['Standard Template Library (vector, map, set, unordered_map, priority_queue)', 'Iterators & STL Algorithms (`sort`, `binary_search`, `transform`)', 'Smart Pointers (`unique_ptr`, `shared_ptr`, `weak_ptr`)', 'Move Semantics, Rvalue References & Lambdas'],
                    project: 'High-Throughput In-Memory Key-Value Cache Engine'
                }
            ],
            youtube: [
                {
                    title: 'C++ Full Course for Beginners',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+c%2B%2B+full+course',
                    desc: 'Comprehensive 31-hour video covering beginner syntax through advanced object-oriented design.'
                },
                {
                    title: 'C++ Complete Placement Course (Hindi)',
                    channel: 'Apna College (Shradha Khapra)',
                    url: 'https://www.youtube.com/results?search_query=apna+college+c%2B%2B+placement+course',
                    desc: 'Structured Hindi course tailored for coding interviews, data structures, and foundational algorithms.'
                },
                {
                    title: 'The Cherno C++ Series',
                    channel: 'The Cherno',
                    url: 'https://www.youtube.com/results?search_query=the+cherno+c%2B%2B+playlist',
                    desc: 'Widely celebrated deep-dive series explaining how C++ interacts with hardware, memory, and compilers.'
                },
                {
                    title: 'C++ Tutorial in Hindi',
                    channel: 'CodeWithHarry',
                    url: 'https://www.youtube.com/results?search_query=codewithharry+c%2B%2B+playlist',
                    desc: 'Complete Hindi roadmap from basic programs to advanced STL and object-oriented architectures.'
                }
            ],
            tutorials: [
                {
                    title: 'LearnCpp.com (Top Industry Guide)',
                    url: 'https://www.learncpp.com/',
                    type: 'Comprehensive Guide',
                    desc: 'Widely considered the finest, most meticulously updated online C++ tutorial in the world.'
                },
                {
                    title: 'Cplusplus.com Reference',
                    url: 'https://cplusplus.com/doc/tutorial/',
                    type: 'Official Reference',
                    desc: 'Standard reference guide for language features, headers, and STL components.'
                },
                {
                    title: 'GeeksforGeeks C++ Programming',
                    url: 'https://www.geeksforgeeks.org/c-plus-plus/',
                    type: 'Interview & DSA',
                    desc: 'Detailed tutorials with hundreds of coding challenges, DSA implementations, and interview questions.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'RAII (Resource Acquisition Is Initialization) for Zero Leaks',
                    'Virtual Method Tables (VTables) and Dynamic Dispatch',
                    'Smart Pointers (`unique_ptr`, `shared_ptr`) for Automatic Lifetime Management',
                    'Template Metaprogramming for Generic & Zero-Cost Abstraction',
                    'Move Semantics (`std::move`) avoiding expensive deep copies'
                ],
                realWorldUse: 'Powers high-frequency trading (HFT) platforms, Unreal Engine, Adobe Creative Cloud, Chrome V8 engine, and autonomous driving software.',
                interviewTips: 'Expect questions on virtual destructors, why `std::unordered_map` is faster on average than `std::map`, and how to prevent memory leaks with smart pointers.',
                recommendedProjects: [
                    'Graph Pathfinding Visualizer (Dijkstra, A* Search)',
                    'Custom Huffman Encoding File Compressor / Decompressor',
                    'Real-Time Multithreaded Task Scheduler'
                ]
            }
        },

        java: {
            id: 'java',
            name: 'Java',
            category: 'Languages',
            categoryKey: 'languages',
            icon: 'fa-brands fa-java',
            color: '#f97316',
            tagline: 'Enterprise-Grade Object-Oriented Systems & Backend Architecture',
            proficiency: '82% - Solid Core & OOP',
            overview: 'Java is a robust, class-based, object-oriented language engineered around the "Write Once, Run Anywhere" (WORA) philosophy enabled by the Java Virtual Machine (JVM). It remains the dominant language for enterprise software, banking infrastructure, distributed microservices, and large-scale backend systems.',
            roadmap: [
                {
                    phase: 'Phase 1: JVM Architecture & Syntax',
                    duration: 'Weeks 1 - 2',
                    topics: ['JDK, JRE & JVM Internals (Bytecode, JIT Compiler)', 'Primitive Types, Wrapper Classes, Scopes', 'Control Flow Statements & Methods', 'Static Keyword & Class Loading'],
                    project: 'Student Grade & Attendance Management Console App'
                },
                {
                    phase: 'Phase 2: True Object-Oriented Design',
                    duration: 'Weeks 3 - 4',
                    topics: ['Classes, Objects, Constructors & `this` / `super` keywords', 'Encapsulation, Packages & Access Modifiers', 'Inheritance & Method Overriding (`@Override`)', 'Abstract Classes vs Interfaces & Multiple Inheritance via Interfaces'],
                    project: 'E-Commerce Billing & Discount Calculation System'
                },
                {
                    phase: 'Phase 3: Collections Framework & Generics',
                    duration: 'Weeks 5 - 6',
                    topics: ['List (ArrayList, LinkedList, Vector)', 'Set (HashSet, LinkedHashSet, TreeSet)', 'Map (HashMap, LinkedHashMap, TreeMap) & Hash Collisions', 'Comparable vs Comparator & Generics'],
                    project: 'Custom In-Memory Database with Key-Value Lookups'
                },
                {
                    phase: 'Phase 4: Advanced Java & Backend Services',
                    duration: 'Weeks 7 - 10',
                    topics: ['Exception Handling (Checked vs Unchecked)', 'Multithreading & Concurrency (Thread, Runnable, ExecutorService, Synchronization)', 'Java 8 Features (Lambdas, Stream API, Optional)', 'Introduction to Spring Boot & RESTful APIs'],
                    project: 'RESTful Banking Transaction API with Spring Boot'
                }
            ],
            youtube: [
                {
                    title: 'Java Tutorial for Beginners',
                    channel: 'Programming with Mosh',
                    url: 'https://www.youtube.com/results?search_query=programming+with+mosh+java+tutorial+for+beginners',
                    desc: 'Clear, elegant introduction to Java fundamentals and modern coding practices.'
                },
                {
                    title: 'Java Full Course in Hindi',
                    channel: 'Apna College (Shradha Khapra)',
                    url: 'https://www.youtube.com/results?search_query=apna+college+java+complete+placement+course',
                    desc: 'Comprehensive Hindi playlist focusing on Java OOP, Data Structures, and campus placement prep.'
                },
                {
                    title: 'Java & Spring Boot Tutorial',
                    channel: 'Telusko (Navin Reddy)',
                    url: 'https://www.youtube.com/results?search_query=telusko+java+full+course',
                    desc: 'Engaging, deeply detailed explanations of JVM, collections, and enterprise architecture.'
                },
                {
                    title: 'Java Full Course (9 Hours)',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+java+full+course',
                    desc: 'Complete crash course for beginners covering object-oriented concepts and coding problem sets.'
                }
            ],
            tutorials: [
                {
                    title: 'Official Oracle Java Documentation',
                    url: 'https://docs.oracle.com/en/java/',
                    type: 'Official Documentation',
                    desc: 'The official source of Java SE specifications, API class libraries, and JVM reference.'
                },
                {
                    title: 'Baeldung Java Guides',
                    url: 'https://www.baeldung.com/',
                    type: 'Enterprise Guide',
                    desc: 'World-renowned resource for in-depth Java and Spring Boot architecture tutorials.'
                },
                {
                    title: 'GeeksforGeeks Java Programming',
                    url: 'https://www.geeksforgeeks.org/java/',
                    type: 'DSA & Interview',
                    desc: 'Practical examples, interview puzzles, and collections framework deep dives.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'JVM Memory Architecture: Heap vs Stack, Metaspace & Garbage Collection',
                    'Internal Working of `HashMap` (Buckets, Linked List, Treeification in Java 8)',
                    'String Pool & Immutability for Security and Thread Safety',
                    'The Contract between `equals()` and `hashCode()`',
                    'Java 8 Functional Streams for Parallel and Declarative Processing'
                ],
                realWorldUse: 'Backbone of enterprise financial applications, Android operating systems, Apache Kafka, Apache Spark, and large-scale cloud microservices.',
                interviewTips: 'Be ready to explain how `HashMap` resolves collisions, the difference between checked vs unchecked exceptions, and how the Garbage Collector identifies unreachable objects.',
                recommendedProjects: [
                    'Multi-User Banking System with ACID Transaction Guarantees',
                    'Spring Boot Microservice with JWT Authentication',
                    'Concurrent Web Crawler using Thread Pools and Futures'
                ]
            }
        },

        javascript: {
            id: 'javascript',
            name: 'JavaScript',
            category: 'Languages',
            categoryKey: 'languages',
            icon: 'fa-brands fa-js',
            color: '#facc15',
            tagline: 'Asynchronous Event-Driven Web Logic & Dynamic Full-Stack Programming',
            proficiency: '88% - Advanced Client & Async Logic',
            overview: 'JavaScript is the dynamic, lightweight, multi-paradigm programming language that powers 98% of the modern web. From asynchronous DOM manipulation in the browser to server-side backends with Node.js, JavaScript enables interactive user experiences, API integrations, and real-time state synchronization.',
            roadmap: [
                {
                    phase: 'Phase 1: Core Syntax & Data Types',
                    duration: 'Weeks 1 - 2',
                    topics: ['Variables (`var`, `let`, `const`) & Hoisting', 'Data Types, Type Coercion (`==` vs `===`)', 'Functions, Arrow Functions, Default Parameters', 'Arrays & Objects (Destructuring, Spread/Rest Operators)'],
                    project: 'Interactive Expense Tracker with LocalStorage'
                },
                {
                    phase: 'Phase 2: DOM & Event Architecture',
                    duration: 'Weeks 3 - 4',
                    topics: ['DOM Selection (`querySelector`, `getElementById`)', 'DOM Mutation (`createElement`, `classList`, `setAttribute`)', 'Event Handling (Bubbling, Capturing, Event Delegation)', 'Forms & Client-Side Validation'],
                    project: 'Dynamic Drag-and-Drop Kanban Task Board'
                },
                {
                    phase: 'Phase 3: Asynchronous JavaScript & APIs',
                    duration: 'Weeks 5 - 6',
                    topics: ['Call Stack, Web APIs, Callback Queue & Event Loop', 'Promises (`.then()`, `.catch()`, `.finally()`)', 'Async / Await Syntax & Error Handling with `try/catch`', 'Fetch API, RESTful Endpoints & Handling JSON'],
                    project: 'Real-Time Weather & Air Quality Dashboard with Live API'
                },
                {
                    phase: 'Phase 4: Advanced Patterns & Modern ES6+',
                    duration: 'Weeks 7 - 10',
                    topics: ['Closures & Lexical Scoping', 'Prototype Chain & Prototypal Inheritance', '`this` Keyword Binding (`call`, `apply`, `bind`)', 'Debouncing & Throttling Optimization', 'ES6 Modules (`import` / `export`)'],
                    project: 'AI Chatbot Companion Widget with Streaming Text Effect'
                }
            ],
            youtube: [
                {
                    title: 'Namaste JavaScript (Best Conceptual Course in World)',
                    channel: 'Akshay Saini',
                    url: 'https://www.youtube.com/results?search_query=namaste+javascript+akshay+saini',
                    desc: 'The legendary deep-dive explaining the Event Loop, Execution Context, Closures, and JS engine internals.'
                },
                {
                    title: 'Chai aur JavaScript Series (Hindi)',
                    channel: 'Chai aur Code (Hitesh Choudhary)',
                    url: 'https://www.youtube.com/results?search_query=chai+aur+javascript+hitesh+choudhary',
                    desc: 'Comprehensive modern JavaScript course in Hindi built around hands-on code and real-world paradigms.'
                },
                {
                    title: 'JavaScript Full Course for Beginners',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+javascript+full+course',
                    desc: 'All-in-one comprehensive course covering fundamentals, algorithms, and projects.'
                },
                {
                    title: 'JavaScript Tutorial in Hindi',
                    channel: 'CodeWithHarry',
                    url: 'https://www.youtube.com/results?search_query=codewithharry+javascript+course',
                    desc: 'Complete Hindi playlist from scratch to DOM manipulation and async logic.'
                }
            ],
            tutorials: [
                {
                    title: 'MDN Web Docs - JavaScript Guide',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                    type: 'Official Documentation',
                    desc: 'The ultimate, standard documentation for all JavaScript APIs, syntax, and browser standards.'
                },
                {
                    title: 'JavaScript.info (The Modern JavaScript Tutorial)',
                    url: 'https://javascript.info/',
                    type: 'Comprehensive Guide',
                    desc: 'Exceptional, structured online book starting from scratch to advanced browser and Node.js concepts.'
                },
                {
                    title: 'W3Schools JavaScript Tutorial',
                    url: 'https://www.w3schools.com/js/',
                    type: 'Interactive Guide',
                    desc: 'Quick practice exercises and cheat sheets for everyday web development.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Execution Context, Call Stack & Microtask/Macrotask Queues',
                    'Closures: Retaining access to outer scope variables after return',
                    'Prototypal Inheritance vs Class Syntactic Sugar',
                    'Debouncing vs Throttling to limit high-frequency events',
                    'Asynchronous Non-Blocking Single-Threaded Concurrency'
                ],
                realWorldUse: 'Powers every interactive website, Node.js cloud backends, Electron desktop apps, React/Vue frontends, and browser extensions.',
                interviewTips: 'Be ready to diagram the Event Loop, explain how Closures enable private variables, and explain the difference between `null` vs `undefined`.',
                recommendedProjects: [
                    'Interactive Code Editor with Live Markdown Preview',
                    'Real-Time WebSocket Chat Application with Typing Indicators',
                    'Interactive Audio Synthesizer using Web Audio API'
                ]
            }
        },

        html5: {
            id: 'html5',
            name: 'HTML5',
            category: 'Web Tech',
            categoryKey: 'web',
            icon: 'fa-brands fa-html5',
            color: '#f97316',
            tagline: 'Semantic Markup, Accessibility (a11y) & SEO Architecture',
            proficiency: '94% - Expert Semantic Structuring',
            overview: 'HTML5 is the backbone of the World Wide Web, providing structured meaning, accessibility landmarks, and native multimedia capabilities to web applications. Writing clean, semantic HTML5 ensures top SEO rankings, high performance, and effortless assistive technology compatibility.',
            roadmap: [
                {
                    phase: 'Phase 1: Document Structure & Core Tags',
                    duration: 'Week 1',
                    topics: ['`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`', 'Meta Tags (Viewport, Charset, SEO Description)', 'Headings (`<h1>`-`<h6>`), Paragraphs, Lists & Anchors', 'Media Tags (`<img>`, `<picture>`, `<audio>`, `<video>)'],
                    project: 'Semantic Personal Biography & Portfolio Outline'
                },
                {
                    phase: 'Phase 2: Semantic HTML5 Elements',
                    duration: 'Week 2',
                    topics: ['`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`', 'Benefits for SEO and Screen Readers', '`<figure>` and `<figcaption>`', 'Semantic Grouping vs Generic `<div>` Bloat'],
                    project: 'SEO-Optimized Tech News Magazine Article Page'
                },
                {
                    phase: 'Phase 3: Advanced Forms & Validations',
                    duration: 'Week 3',
                    topics: ['Form Elements (`<form>`, `<input>`, `<textarea>`, `<select>`, `<button>`)', 'Input Types (email, tel, url, number, date, range)', 'HTML5 Validation Attributes (`required`, `pattern`, `minlength`)', 'Accessibility Form Labels (`<label for="...">`)'],
                    project: 'Multi-Step Job Application Form with Client Validation'
                },
                {
                    phase: 'Phase 4: Web APIs, Canvas & Accessibility',
                    duration: 'Week 4',
                    topics: ['ARIA Roles, States & Properties (`aria-label`, `aria-expanded`, `role`)', 'HTML5 `<canvas>` & SVG Embedding', 'Open Graph (og:image, og:title) & Twitter Cards for Social Previews', 'Web Storage & Geolocation APIs'],
                    project: 'Fully Accessible, 100% Lighthouse-Scored Corporate Landing Page'
                }
            ],
            youtube: [
                {
                    title: 'HTML Full Course - Build a Website Tutorial',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+html+full+course',
                    desc: 'Zero-to-hero HTML course covering all tags, attributes, and semantic layout best practices.'
                },
                {
                    title: 'HTML & Web Design in One Video (Hindi)',
                    channel: 'CodeWithHarry',
                    url: 'https://www.youtube.com/results?search_query=codewithharry+html+full+course',
                    desc: 'Clear, fun Hindi tutorial covering all HTML fundamentals and project building.'
                },
                {
                    title: 'HTML Crash Course for Absolute Beginners',
                    channel: 'Traversy Media',
                    url: 'https://www.youtube.com/results?search_query=traversy+media+html+crash+course',
                    desc: 'Fast-paced, modern guide to structuring HTML documents cleanly.'
                }
            ],
            tutorials: [
                {
                    title: 'MDN Web Docs - HTML Developer Guide',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                    type: 'Official Documentation',
                    desc: 'The authoritative reference for every HTML tag, attribute, and standard.'
                },
                {
                    title: 'W3Schools HTML5 Tutorial',
                    url: 'https://www.w3schools.com/html/',
                    type: 'Interactive Tutorial',
                    desc: 'Interactive try-it-yourself editor for learning HTML tags quickly.'
                },
                {
                    title: 'Web.dev - Learn HTML by Google',
                    url: 'https://web.dev/learn/html/',
                    type: 'Industry Standard',
                    desc: 'Google modern engineering guide to semantic, accessible, performant HTML.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Semantic Elements for SEO indexability and Screen Reader accessibility',
                    'DOCTYPE & Rendering Modes (Standards Mode vs Quirks Mode)',
                    'Responsive Images with `srcset` and `<picture>` tags',
                    'ARIA Landmarks for Screen Readers (`aria-expanded`, `aria-hidden`)',
                    'Open Graph and Schema.org Microdata for Rich Social Previews'
                ],
                realWorldUse: 'Essential foundation for every web page, email template, web app, and headless CMS frontend.',
                interviewTips: 'Explain why `<div>` soup harms accessibility and SEO, the purpose of the `alt` attribute on images, and the difference between `<article>` and `<section>`.',
                recommendedProjects: [
                    '100% Lighthouse SEO & Accessibility Validated Landing Page',
                    'Interactive Canvas 2D Particle Animation Engine',
                    'Semantic Documentation Portal with Multi-Level Table of Contents'
                ]
            }
        },

        css3: {
            id: 'css3',
            name: 'CSS3',
            category: 'Web Tech',
            categoryKey: 'web',
            icon: 'fa-brands fa-css3-alt',
            color: '#3b82f6',
            tagline: 'Modern Responsive Layouts, Animations, Flexbox & Cyber Glassmorphism',
            proficiency: '90% - Advanced UI & Fluid Design',
            overview: 'CSS3 transforms bare HTML into breathtaking, responsive, and animated user interfaces. Modern CSS includes native Flexbox, CSS Grid, custom properties (CSS variables), clamping functions, 3D transforms, glassmorphic backdrop filters, and hardware-accelerated animations.',
            roadmap: [
                {
                    phase: 'Phase 1: Box Model & Selectors',
                    duration: 'Weeks 1 - 2',
                    topics: ['Box Model (Margin, Border, Padding, Content, `box-sizing: border-box`)', 'Selectors, Specificity Hierarchy & Pseudo-Classes (`:hover`, `:focus`, `:nth-child`)', 'Typography, Web Fonts & Units (`rem`, `em`, `px`, `%`, `vh`, `vw`)', 'Colors (HEX, HSL, RGB, Alpha Transparency)'],
                    project: 'Clean Cyberpunk Blog Card Component with Hover Glow'
                },
                {
                    phase: 'Phase 2: Modern Layouts (Flexbox & Grid)',
                    duration: 'Weeks 3 - 4',
                    topics: ['Flexbox: `justify-content`, `align-items`, `flex-wrap`, `flex-grow`, `gap`', 'CSS Grid: `grid-template-columns`, `grid-template-rows`, `repeat()`, `minmax()`', 'Mobile-First Responsive Design & Media Queries', 'Fluid Typography with `clamp(min, preferred, max)`'],
                    project: 'Responsive Multi-Column E-Commerce Dashboard'
                },
                {
                    phase: 'Phase 3: Visual Polish & Cyber Glassmorphism',
                    duration: 'Weeks 5 - 6',
                    topics: ['CSS Custom Properties (Variables) & Theme Switching', 'Gradients (Linear, Radial, Conic) & Neon Box Shadows', '`backdrop-filter: blur()` & Glassmorphic Layering', 'Custom Scrollbars & Selection Highlights'],
                    project: 'Dark-Mode Cyberpunk HUD Portfolio Interface'
                },
                {
                    phase: 'Phase 4: Animations & High-Performance Transitions',
                    duration: 'Weeks 7 - 8',
                    topics: ['`transition` & Cubic-Bezier Easing Functions', '`@keyframes` Animations, Iterations & Direction', 'Hardware Acceleration with `transform: translate3d()` and `will-change`', '3D Transforms & Card Flip / Tilt Effects'],
                    project: '3D Interactive Holographic Product Showcase'
                }
            ],
            youtube: [
                {
                    title: 'CSS Full Course by Kevin Powell (The King of CSS)',
                    channel: 'Kevin Powell',
                    url: 'https://www.youtube.com/results?search_query=kevin+powell+css+full+course',
                    desc: 'The premier channel in the world for understanding how CSS actually works, layout tricks, and modern CSS.'
                },
                {
                    title: 'CSS Grid & Flexbox Crash Course',
                    channel: 'Traversy Media',
                    url: 'https://www.youtube.com/results?search_query=traversy+media+css+grid+and+flexbox',
                    desc: 'Clear, comprehensive practical guide to mastering modern responsive web layouts.'
                },
                {
                    title: 'CSS Tutorial in Hindi',
                    channel: 'CodeWithHarry',
                    url: 'https://www.youtube.com/results?search_query=codewithharry+css+full+course',
                    desc: 'Step-by-step Hindi tutorial from basic styling to advanced responsive layouts and projects.'
                }
            ],
            tutorials: [
                {
                    title: 'A Complete Guide to Flexbox (CSS-Tricks)',
                    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
                    type: 'Authoritative Cheat Sheet',
                    desc: 'The definitive, visual industry guide for everything Flexbox related.'
                },
                {
                    title: 'A Complete Guide to CSS Grid (CSS-Tricks)',
                    url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
                    type: 'Authoritative Cheat Sheet',
                    desc: 'Comprehensive visual reference for parent and child CSS Grid properties.'
                },
                {
                    title: 'MDN Web Docs - CSS Guide',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
                    type: 'Official Documentation',
                    desc: 'Complete specification, browser compatibility tables, and syntax guides.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'CSS Specificity Calculation (Inline > ID > Class/Attribute > Element)',
                    'Stacking Context & How `z-index` behaves within relative/absolute containers',
                    'GPU Hardware Acceleration: Transforming `transform` and `opacity` vs CPU reflows',
                    'CSS Variables for dynamic dark/light theme switching with zero recalculation',
                    'Subgrid and modern CSS nesting syntax'
                ],
                realWorldUse: 'Used across all enterprise and consumer websites to deliver memorable branding, accessibility, and high conversion interfaces.',
                interviewTips: 'Be ready to explain the CSS Box Model, how `position: fixed` differs from `position: absolute` and `sticky`, and how BEM prevents CSS namespace collisions.',
                recommendedProjects: [
                    'Cyberpunk Neon Theme System with Dynamic Color Switcher',
                    'Pure CSS 3D Cube Carousel with Mouse Tracking',
                    'Ultra-Responsive Fluid Dashboard using CSS Grid & Clamp'
                ]
            }
        },

        bootstrap: {
            id: 'bootstrap',
            name: 'Bootstrap',
            category: 'Web Tech',
            categoryKey: 'web',
            icon: 'fa-brands fa-bootstrap',
            color: '#a855f7',
            tagline: 'Rapid Component Prototyping & Responsive 12-Column Grid Framework',
            proficiency: '86% - Rapid UI Engineering',
            overview: 'Bootstrap is one of the most widely used front-end open-source toolkits in the world. Featuring a robust 12-column responsive flexbox grid, extensive pre-built UI components (navbars, cards, modals, dropdowns), and utility classes, it enables high-velocity frontend development.',
            roadmap: [
                {
                    phase: 'Phase 1: Setup & 12-Column Grid',
                    duration: 'Week 1',
                    topics: ['CDN vs npm Installation', 'Containers (`.container`, `.container-fluid`)', '12-Column Grid System (`.row`, `.col-*`)', 'Breakpoints (`sm`, `md`, `lg`, `xl`, `xxl`)'],
                    project: 'Responsive Multi-Device Pricing Table Layout'
                },
                {
                    phase: 'Phase 2: Core Components',
                    duration: 'Week 2',
                    topics: ['Navbars & Responsive Collapsible Menus', 'Cards, Badges, Buttons & Button Groups', 'Modals, Offcanvas Drawers & Tooltips', 'Accordions & Carousels'],
                    project: 'Corporate Business Portal with Interactive Modals'
                },
                {
                    phase: 'Phase 3: Utility Classes & Flexbox',
                    duration: 'Week 3',
                    topics: ['Spacing Utilities (`m-*`, `p-*`, `mx-auto`)', 'Flex Utilities (`d-flex`, `justify-content-*`, `align-items-*`)', 'Text & Color Utilities (`text-center`, `bg-dark`, `border`)', 'Display & Visibility Utilities'],
                    project: 'Admin Analytics Dashboard with KPI Cards'
                },
                {
                    phase: 'Phase 4: Customization & SASS Integration',
                    duration: 'Week 4',
                    topics: ['Overriding Bootstrap with Custom CSS', 'Customizing Theme Colors with Sass Variables (`_variables.scss`)', 'Creating Dark Mode Themes', 'Optimizing Bundle Size by Importing Only Needed Modules'],
                    project: 'Custom Branded SaaS Landing Page with Bootstrap 5'
                }
            ],
            youtube: [
                {
                    title: 'Bootstrap 5 Crash Course Tutorial',
                    channel: 'Traversy Media',
                    url: 'https://www.youtube.com/results?search_query=traversy+media+bootstrap+5+crash+course',
                    desc: 'Fast, practical walkthrough of Bootstrap 5 grid, components, and responsive utilities.'
                },
                {
                    title: 'Bootstrap 5 Full Course in Hindi',
                    channel: 'Thapa Technical',
                    url: 'https://www.youtube.com/results?search_query=thapa+technical+bootstrap+5+full+course',
                    desc: 'Complete Hindi masterclass with real-world website building projects.'
                },
                {
                    title: 'Bootstrap 5 Tutorial for Beginners',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+bootstrap+5+tutorial',
                    desc: 'In-depth introduction to modern Bootstrap 5 without jQuery dependency.'
                }
            ],
            tutorials: [
                {
                    title: 'Official Bootstrap 5 Documentation',
                    url: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/',
                    type: 'Official Documentation',
                    desc: 'The complete official docs for components, utilities, and customization.'
                },
                {
                    title: 'W3Schools Bootstrap 5 Tutorial',
                    url: 'https://www.w3schools.com/bootstrap5/',
                    type: 'Interactive Guide',
                    desc: 'Quick reference with live preview code examples.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Mobile-First 12-Column Flexbox Grid Architecture',
                    'Elimination of jQuery in Bootstrap 5 in favor of pure Vanilla JS',
                    'CSS Custom Properties in Bootstrap for dynamic theme modifications',
                    'Utility API for building lightweight atomic utility classes'
                ],
                realWorldUse: 'Rapid enterprise internal tools, MVP startups, fast turn-around web layouts, and admin dashboards.',
                interviewTips: 'Explain how the 12-column grid calculates column widths and how gutters (`g-*`) prevent unwanted horizontal scrolling.',
                recommendedProjects: [
                    'Multi-Page Company Intranet Portal',
                    'Hospital Management System UI Dashboard'
                ]
            }
        },

        tailwind: {
            id: 'tailwind',
            name: 'Tailwind CSS',
            category: 'Web Tech',
            categoryKey: 'web',
            icon: 'fa-solid fa-wind',
            color: '#06b6d4',
            tagline: 'Utility-First Modern CSS Framework & Design Systems',
            proficiency: '85% - Utility-First Styling',
            overview: 'Tailwind CSS is an industry-leading utility-first CSS framework packed with classes like `flex`, `pt-4`, `text-center`, and `rotate-90` that can be composed to build any design directly inside markup. With its Just-In-Time (JIT) compiler, Tailwind outputs tiny production bundles by only generating the CSS you actually use.',
            roadmap: [
                {
                    phase: 'Phase 1: Utility-First Mindset & Core Classes',
                    duration: 'Week 1',
                    topics: ['Installing Tailwind via CLI & PostCSS', 'Utility-First Philosophy vs Semantic Class Naming', 'Spacing, Sizing (`w-*`, `h-*`), Padding & Margins', 'Typography & Tailwind Default Color Palettes'],
                    project: 'Sleek Dark Mode Profile Card with Custom Shadows'
                },
                {
                    phase: 'Phase 2: Layouts & Responsive Modifiers',
                    duration: 'Week 2',
                    topics: ['Flexbox & Grid Utilities (`flex`, `grid`, `col-span-*`, `gap-*`)', 'Responsive Prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)', 'Positioning (`absolute`, `relative`, `inset-*`, `z-*`)', 'Hover, Focus & Active State Modifiers (`hover:`, `focus:ring`)'],
                    project: 'Responsive E-Commerce Product Listing with Filters'
                },
                {
                    phase: 'Phase 3: Dark Mode & Dynamic Arbitrary Values',
                    duration: 'Week 3',
                    topics: ['Dark Mode Configuration (`dark:` class or media query)', 'Arbitrary Value Syntax (e.g., `top-[117px]`, `bg-[#121212]`)', 'Transforms & Transition Utilities (`scale-*`, `rotate-*`, `duration-*`)', 'Custom `@layer` Directives (`@layer components`, `@layer utilities`)'],
                    project: 'Full Dark/Light Mode SaaS Dashboard with Interactive Charts'
                },
                {
                    phase: 'Phase 4: Configuration & Design Tokens',
                    duration: 'Week 4',
                    topics: ['Extending `tailwind.config.js` with Custom Fonts and Colors', 'Official Plugins (`@tailwindcss/forms`, `@tailwindcss/typography`)', 'Purging & Production Bundle Optimization with JIT Engine', 'Integrating Tailwind with Vite / React / Next.js'],
                    project: 'Modern AI SaaS Product Landing Page with Glassmorphism'
                }
            ],
            youtube: [
                {
                    title: 'Tailwind CSS Full Course for Beginners',
                    channel: 'Dave Gray',
                    url: 'https://www.youtube.com/results?search_query=dave+gray+tailwind+css+full+course',
                    desc: 'Clear, modern masterclass covering configuration, responsive design, and practical components.'
                },
                {
                    title: 'Chai aur Tailwind CSS (Hindi)',
                    channel: 'Chai aur Code (Hitesh Choudhary)',
                    url: 'https://www.youtube.com/results?search_query=chai+aur+tailwind+css+hitesh+choudhary',
                    desc: 'Hands-on Hindi guide explaining the power of utility-first styling and component design.'
                },
                {
                    title: 'Tailwind CSS Crash Course',
                    channel: 'Traversy Media',
                    url: 'https://www.youtube.com/results?search_query=traversy+media+tailwind+css+crash+course',
                    desc: 'Fast-paced, comprehensive overview of classes, configuration, and website building.'
                }
            ],
            tutorials: [
                {
                    title: 'Official Tailwind CSS Documentation',
                    url: 'https://tailwindcss.com/docs',
                    type: 'Official Documentation',
                    desc: 'The gold standard documentation with instant search and complete class references.'
                },
                {
                    title: 'Tailwind UI & HyperUI Component Catalogs',
                    url: 'https://www.hyperui.dev/',
                    type: 'Open-Source Components',
                    desc: 'Curated collection of free Tailwind CSS components for rapid interface development.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Just-in-Time (JIT) Engine: Generates exact CSS on-demand with zero runtime overhead',
                    'Zero CSS Specificity Wars: Every utility class is predictable',
                    'Production Bundle Purging: Delivers sub-15KB CSS bundles to end users',
                    'Design System Constancy: Consistent spacing, colors, and shadows enforced by theme'
                ],
                realWorldUse: 'Standard styling framework used by Vercel, OpenAI, GitHub, and thousands of top tech startups.',
                interviewTips: 'Explain how Tailwind differs from traditional CSS frameworks like Bootstrap, and how JIT compilation prevents massive stylesheet bloat.',
                recommendedProjects: [
                    'FinTech Banking Mobile-First Web Application',
                    'Developer Portfolio with Custom Cyber Color System'
                ]
            }
        },

        mysql: {
            id: 'mysql',
            name: 'MySQL',
            category: 'Databases & Query',
            categoryKey: 'database',
            icon: 'fa-solid fa-database',
            color: '#0284c7',
            tagline: 'Relational Database Management, Schema Normalization & ACID Transactions',
            proficiency: '86% - Relational Architecture & Joins',
            overview: 'MySQL is the most popular open-source Relational Database Management System (RDBMS) in the world. It organizes data into structured tables with primary/foreign key constraints and enforces strict ACID (Atomicity, Consistency, Isolation, Durability) transaction guarantees.',
            roadmap: [
                {
                    phase: 'Phase 1: Relational Foundations & DDL',
                    duration: 'Weeks 1 - 2',
                    topics: ['Relational Concepts (Entities, Attributes, Tables, Rows)', 'Data Types (INT, VARCHAR, TEXT, DATETIME, DECIMAL)', 'DDL Commands (`CREATE DATABASE`, `CREATE TABLE`, `ALTER`, `DROP`)', 'Constraints (`PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `DEFAULT`)'],
                    project: 'E-Commerce Database Schema Design from Scratch'
                },
                {
                    phase: 'Phase 2: DML & Data Querying',
                    duration: 'Weeks 3 - 4',
                    topics: ['DML Commands (`INSERT INTO`, `SELECT`, `UPDATE`, `DELETE`)', 'Filtering (`WHERE`, `AND`, `OR`, `IN`, `BETWEEN`, `LIKE`)', 'Sorting & Limiting (`ORDER BY`, `LIMIT`, `OFFSET`)', 'Aggregate Functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `HAVING`)'],
                    project: 'Sales Data Query & Revenue Reporting Engine'
                },
                {
                    phase: 'Phase 3: Relational Joins & Subqueries',
                    duration: 'Weeks 5 - 6',
                    topics: ['`INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `CROSS JOIN`', 'Self Joins & Multi-Table Relational Queries', 'Correlated and Non-Correlated Subqueries', 'Views & Temporary Tables for Simplified Analytics'],
                    project: 'Multi-Tenant Hospital Patient & Doctor Booking Query System'
                },
                {
                    phase: 'Phase 4: Optimization, Indexes & Transactions',
                    duration: 'Weeks 7 - 8',
                    topics: ['Database Normalization (1NF, 2NF, 3NF, BCNF) vs Denormalization', 'B-Tree Indexes (`CREATE INDEX`), Clustered vs Secondary Indexes', 'Query Execution Plan Analysis (`EXPLAIN`)', 'ACID Transactions (`START TRANSACTION`, `COMMIT`, `ROLLBACK`)'],
                    project: 'High-Volume Financial Ledger with ACID Guarantees'
                }
            ],
            youtube: [
                {
                    title: 'MySQL Full Course for Beginners',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+mysql+full+course',
                    desc: 'Complete database masterclass covering schema design, queries, joins, and normalization.'
                },
                {
                    title: 'MySQL Complete Course in Hindi',
                    channel: 'CodeWithHarry',
                    url: 'https://www.youtube.com/results?search_query=codewithharry+mysql+full+course',
                    desc: 'Clear, comprehensive Hindi tutorial on relational database management and practical SQL queries.'
                },
                {
                    title: 'MySQL Tutorial for Beginners',
                    channel: 'Programming with Mosh',
                    url: 'https://www.youtube.com/results?search_query=programming+with+mosh+mysql+tutorial',
                    desc: 'Concise, high-quality walkthrough of database queries and relational architecture.'
                }
            ],
            tutorials: [
                {
                    title: 'Official MySQL Reference Manual',
                    url: 'https://dev.mysql.com/doc/refman/8.0/en/',
                    type: 'Official Documentation',
                    desc: 'The authoritative reference manual by Oracle for MySQL 8.0.'
                },
                {
                    title: 'MySQLTutorial.org (In-Depth Practical Guide)',
                    url: 'https://www.mysqltutorial.org/',
                    type: 'Practical Guide',
                    desc: 'Step-by-step practical examples for beginners through database administrators.'
                },
                {
                    title: 'W3Schools MySQL Tutorial',
                    url: 'https://www.w3schools.com/mysql/',
                    type: 'Interactive Guide',
                    desc: 'Interactive database query examples with online editor.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'ACID Properties ensuring zero corruption during financial transfers',
                    'B-Tree Indexing: Fast O(log N) lookups vs O(N) full table scans',
                    'Normalization (3NF) to eliminate data redundancy and anomalies',
                    'InnoDB Storage Engine vs MyISAM: Row-level locking and foreign keys',
                    '`EXPLAIN` Keyword for profiling query bottlenecks'
                ],
                realWorldUse: 'Powers Facebook, Uber, Netflix, Shopify, and WordPress for transactional records, user auth, and financial ledgers.',
                interviewTips: 'Be ready to explain the difference between `WHERE` vs `HAVING`, write a query finding the 2nd highest salary, and explain clustered vs non-clustered indexes.',
                recommendedProjects: [
                    'Multi-Table E-Commerce Order Fulfillment Database',
                    'University Examination Grading & Ranking System',
                    'Inventory Tracking System with Stock Triggers'
                ]
            }
        },

        mongodb: {
            id: 'mongodb',
            name: 'MongoDB',
            category: 'Databases & Query',
            categoryKey: 'database',
            icon: 'fa-solid fa-leaf',
            color: '#10b981',
            tagline: 'NoSQL Document Store, BSON Data Modeling & Aggregation Pipelines',
            proficiency: '80% - NoSQL Document Storage',
            overview: 'MongoDB is a leading NoSQL document-oriented database designed for high availability, horizontal scalability, and rapid development. Storing data in flexible, JSON-like BSON documents, MongoDB eliminates rigid schema restrictions and excels at real-time analytics, user profiles, and event logging.',
            roadmap: [
                {
                    phase: 'Phase 1: NoSQL Concepts & Compass Setup',
                    duration: 'Weeks 1 - 2',
                    topics: ['Relational vs Non-Relational (NoSQL) Philosophy', 'Collections, Documents & BSON vs JSON Data Types', 'Installing MongoDB & MongoDB Compass GUI', 'Basic Shell Commands (`mongosh`)'],
                    project: 'User Profile & Preferences Store'
                },
                {
                    phase: 'Phase 2: CRUD Operations',
                    duration: 'Weeks 3 - 4',
                    topics: ['`insertOne()`, `insertMany()`', '`find()`, Projection, Query Operators (`$gt`, `$in`, `$regex`)', '`updateOne()`, `updateMany()`, `$set`, `$inc`, `$push`', '`deleteOne()`, `deleteMany()`'],
                    project: 'Content Management Blog Engine with Tagging'
                },
                {
                    phase: 'Phase 3: Aggregation Pipeline',
                    duration: 'Weeks 5 - 6',
                    topics: ['Pipeline Architecture Concept', 'Stages: `$match`, `$group`, `$project`, `$sort`, `$limit`', 'Array Operations: `$unwind`, `$push`, `$addToSet`', 'Multi-Collection Joins with `$lookup`'],
                    project: 'E-Commerce Analytics Pipeline for Monthly Sales Trends'
                },
                {
                    phase: 'Phase 4: Schema Design, Indexing & Scaling',
                    duration: 'Weeks 7 - 8',
                    topics: ['Embedded vs Referenced Data Modeling Patterns', 'Single-Field, Compound & Text Indexes', 'Replica Sets for High Availability & Sharding for Horizontal Scale', 'Mongoose ODM Integration with Node.js & Validation'],
                    project: 'Real-Time Social Media Activity Feed with Mongoose'
                }
            ],
            youtube: [
                {
                    title: 'MongoDB Crash Course Tutorial',
                    channel: 'Traversy Media',
                    url: 'https://www.youtube.com/results?search_query=traversy+media+mongodb+crash+course',
                    desc: 'Hands-on crash course covering queries, aggregation, and MongoDB Atlas cloud setup.'
                },
                {
                    title: 'Chai aur MongoDB Series (Hindi)',
                    channel: 'Chai aur Code (Hitesh Choudhary)',
                    url: 'https://www.youtube.com/results?search_query=chai+aur+mongodb+hitesh+choudhary',
                    desc: 'Deep Hindi walkthrough of document modeling, aggregation pipelines, and Mongoose.'
                },
                {
                    title: 'Complete MongoDB Course in Hindi',
                    channel: 'Thapa Technical',
                    url: 'https://www.youtube.com/results?search_query=thapa+technical+mongodb+full+course',
                    desc: 'Practical, project-based Hindi tutorial covering CRUD, aggregation, and Mongoose schema design.'
                }
            ],
            tutorials: [
                {
                    title: 'MongoDB University & Official Docs',
                    url: 'https://www.mongodb.com/docs/',
                    type: 'Official Documentation',
                    desc: 'The definitive documentation and free certifications from MongoDB University.'
                },
                {
                    title: 'Mongoose ODM Documentation',
                    url: 'https://mongoosejs.com/docs/',
                    type: 'Library Guide',
                    desc: 'Essential reference for schema validation and middleware in Node.js applications.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Document Embedding (1-to-few) vs Document Referencing (1-to-many/many-to-many)',
                    'Aggregation Pipelines for Complex Analytics without SQL',
                    'Compound Indexes and Index Intersection for high-speed queries',
                    'Replica Sets for Automatic Failover & Zero Downtime'
                ],
                realWorldUse: 'Powers real-time messaging apps, user session stores, IoT telemetry data streaming, and catalog management.',
                interviewTips: 'Explain when to embed documents vs reference them, how `$lookup` performs joins, and the difference between MongoDB and traditional RDBMS.',
                recommendedProjects: [
                    'Real-Time Chat Storage with Message History & Read Receipts',
                    'IoT Sensor Data Collector with Time-Series Collections',
                    'E-Commerce Catalog with Multi-Facet Filtering'
                ]
            }
        },

        sql: {
            id: 'sql',
            name: 'SQL',
            category: 'Databases & Query',
            categoryKey: 'database',
            icon: 'fa-solid fa-table',
            color: '#38bdf8',
            tagline: 'Structured Data Querying, Complex Aggregations & Analytical Window Functions',
            proficiency: '88% - Advanced Analytics & ETL Queries',
            overview: 'SQL (Structured Query Language) is the universal language of data. From relational databases to big data warehouses like BigQuery, Snowflake, and PostgreSQL, mastering SQL enables deep data exploration, business intelligence reporting, cohort analysis, and data engineering transformations.',
            roadmap: [
                {
                    phase: 'Phase 1: Basic Queries & Filtering',
                    duration: 'Weeks 1 - 2',
                    topics: ['`SELECT`, `FROM`, `WHERE`, `DISTINCT`, `LIMIT`', 'Logical Operators (`AND`, `OR`, `NOT`, `IN`, `BETWEEN`, `LIKE`)', 'Sorting with `ORDER BY` (ASC/DESC)', 'Handling NULLs (`IS NULL`, `COALESCE`)'],
                    project: 'Customer Filter & Segment Identification Queries'
                },
                {
                    phase: 'Phase 2: Aggregations & Grouping',
                    duration: 'Weeks 3 - 4',
                    topics: ['Aggregate Functions: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`', '`GROUP BY` Dimensions and Multi-Level Aggregations', '`HAVING` vs `WHERE` Clause Filter Boundaries', 'Scalar Functions (String manipulation, Date/Time truncation)'],
                    project: 'Monthly Sales Revenue & Product Profitability Report'
                },
                {
                    phase: 'Phase 3: Advanced Joins, Set Operators & CTEs',
                    duration: 'Weeks 5 - 6',
                    topics: ['Multi-Table Joins (`INNER`, `LEFT`, `RIGHT`, `FULL OUTER`)', 'Set Operators (`UNION`, `UNION ALL`, `INTERSECT`, `EXCEPT`)', 'Subqueries (Scalar, Multi-Row, Correlated)', 'Common Table Expressions (CTEs - `WITH ... AS`) for Readable Queries'],
                    project: 'Customer Lifetime Value (LTV) Multi-Table Analysis'
                },
                {
                    phase: 'Phase 4: Window Functions & Analytical Mastery',
                    duration: 'Weeks 7 - 8',
                    topics: ['Window Functions: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`', 'Value Functions: `LEAD()`, `LAG()`, `FIRST_VALUE()`, `LAST_VALUE()`', 'Running Totals & Moving Averages (`OVER (PARTITION BY ... ORDER BY ... ROWS BETWEEN ...)`', 'Query Optimization & Index-Aware SQL Writing'],
                    project: 'Year-over-Year (YoY) Growth & User Retention Cohort Analysis'
                }
            ],
            youtube: [
                {
                    title: 'SQL Tutorial - Full Database Course for Beginners',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+sql+full+course',
                    desc: 'The world-famous 4-hour comprehensive SQL tutorial covering all fundamentals.'
                },
                {
                    title: 'SQL for Data Analysis by Alex The Analyst',
                    channel: 'Alex The Analyst',
                    url: 'https://www.youtube.com/results?search_query=alex+the+analyst+sql+playlist',
                    desc: 'The best playlist for aspiring Data Analysts covering queries, CTEs, and window functions.'
                },
                {
                    title: 'SQL Full Course in One Video (Hindi)',
                    channel: 'CodeWithHarry',
                    url: 'https://www.youtube.com/results?search_query=codewithharry+sql+full+course',
                    desc: 'All essential SQL concepts explained with clarity and practical examples in Hindi.'
                }
            ],
            tutorials: [
                {
                    title: 'SQLBolt (Interactive Free Lessons)',
                    url: 'https://sqlbolt.com/',
                    type: 'Interactive Tutorial',
                    desc: 'Interactive browser-based tutorial where you write real queries to solve challenges.'
                },
                {
                    title: 'Mode Analytics SQL Guide',
                    url: 'https://mode.com/sql-tutorial/',
                    type: 'Data Analysis Guide',
                    desc: 'High-level tutorial focused strictly on analytical SQL and business intelligence.'
                },
                {
                    title: 'LeetCode Database Practice Problems',
                    url: 'https://leetcode.com/problemset/database/',
                    type: 'Interview Practice',
                    desc: 'Top interview SQL problems from Google, Amazon, and Meta.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Order of Query Execution: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT',
                    'Window Functions preserving row granularity unlike GROUP BY',
                    '`RANK()` vs `DENSE_RANK()` handling tied values',
                    'Recursive CTEs for Hierarchical and Tree Data',
                    'Correlated Subqueries vs Hash Joins performance implications'
                ],
                realWorldUse: 'Essential for every data analyst, data engineer, and backend developer across all relational databases, data lakes, and BI tools.',
                interviewTips: 'Always remember that `WHERE` filters rows before grouping, while `HAVING` filters aggregated values after grouping.',
                recommendedProjects: [
                    'E-Commerce Churn Analysis & RFM Customer Segmentation',
                    'Financial Fraud Outlier Detection Query Pipeline',
                    'Employee Salary Percentile & Departmental Ranking Report'
                ]
            }
        },

        ml: {
            id: 'ml',
            name: 'Machine Learning',
            category: 'Data & BI Tools',
            categoryKey: 'data',
            icon: 'fa-solid fa-brain',
            color: '#a855f7',
            tagline: 'Supervised & Unsupervised Modeling, Feature Engineering & Predictive Analytics',
            proficiency: '86% - Predictive Analytics & Model Tuning',
            overview: 'Machine Learning empowers computer systems to learn patterns directly from empirical data without being explicitly programmed. Spanning regression, classification, clustering, and feature engineering with Scikit-Learn and Python, ML powers predictive intelligence, recommendations, and automation across industries.',
            roadmap: [
                {
                    phase: 'Phase 1: Mathematical Foundations & Data Prep',
                    duration: 'Weeks 1 - 3',
                    topics: ['Linear Algebra (Vectors, Matrices, Dot Products)', 'Probability & Statistics (Mean, Median, Variance, Normal Distribution, Hypothesis Testing)', 'Data Preprocessing (Handling Nulls, One-Hot Encoding, Feature Scaling)', 'Train / Test Split & Data Leakage Prevention'],
                    project: 'Exploratory Housing Market Analysis & Feature Cleaning'
                },
                {
                    phase: 'Phase 2: Supervised Learning (Regression & Classification)',
                    duration: 'Weeks 4 - 6',
                    topics: ['Linear Regression & Cost Function (Mean Squared Error)', 'Gradient Descent Optimization Algorithm', 'Logistic Regression & Sigmoid Function', 'Decision Trees, Random Forests & Ensemble Learning (Bagging, Boosting)', 'Support Vector Machines (SVM) & K-Nearest Neighbors (KNN)'],
                    project: 'Customer Churn Prediction Model with 88%+ Accuracy'
                },
                {
                    phase: 'Phase 3: Model Evaluation & Hyperparameter Tuning',
                    duration: 'Weeks 7 - 8',
                    topics: ['Evaluation Metrics: Confusion Matrix, Precision, Recall, F1-Score, ROC-AUC', 'Bias-Variance Tradeoff, Overfitting & Regularization (L1 Lasso, L2 Ridge)', 'K-Fold Cross Validation', 'Hyperparameter Optimization (`GridSearchCV`, `RandomizedSearchCV`)'],
                    project: 'Credit Card Fraud Detection with Imbalanced Classes'
                },
                {
                    phase: 'Phase 4: Unsupervised Learning & Deployment',
                    duration: 'Weeks 9 - 12',
                    topics: ['Clustering: K-Means & Elbow Method for optimal K', 'Dimensionality Reduction: Principal Component Analysis (PCA)', 'Model Serialization with `joblib` / `pickle`', 'Deploying ML Models as REST APIs with FastAPI / Flask'],
                    project: 'End-to-End Customer Segmentation & Model Inference API'
                }
            ],
            youtube: [
                {
                    title: 'StatQuest with Josh Starmer (Best Visual ML Channel)',
                    channel: 'StatQuest with Josh Starmer',
                    url: 'https://www.youtube.com/results?search_query=statquest+machine+learning',
                    desc: 'Unmatched visual breakdowns of ML algorithms, math intuition, and core concepts.'
                },
                {
                    title: 'Machine Learning Complete Playlist in Hindi',
                    channel: 'Krish Naik',
                    url: 'https://www.youtube.com/results?search_query=krish+naik+complete+machine+learning+playlist',
                    desc: 'Industry-standard comprehensive Hindi playlist covering mathematics, code, and deployment.'
                },
                {
                    title: 'Machine Learning for Everybody - Full Course',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+machine+learning+for+everybody',
                    desc: 'Accessible, project-oriented masterclass on ML theory and Scikit-Learn implementation.'
                },
                {
                    title: 'Machine Learning Playlist in Hindi',
                    channel: 'CodeWithHarry',
                    url: 'https://www.youtube.com/results?search_query=codewithharry+machine+learning+playlist',
                    desc: 'Practical introduction to ML models, NumPy, Pandas, and Scikit-Learn in Hindi.'
                }
            ],
            tutorials: [
                {
                    title: 'Scikit-Learn Official User Guide',
                    url: 'https://scikit-learn.org/stable/user_guide.html',
                    type: 'Official Documentation',
                    desc: 'The authoritative reference documentation for all classical machine learning algorithms.'
                },
                {
                    title: 'Google Machine Learning Crash Course',
                    url: 'https://developers.google.com/machine-learning/crash-course',
                    type: 'Interactive Course',
                    desc: 'Free fast-paced course by Google researchers with interactive exercises.'
                },
                {
                    title: 'Kaggle Learn - Machine Learning Micro-Courses',
                    url: 'https://www.kaggle.com/learn',
                    type: 'Hands-on Practice',
                    desc: 'Hands-on Jupyter notebooks to build and submit your first predictive models.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Bias-Variance Tradeoff: Underfitting vs Overfitting balance',
                    'Precision vs Recall: Precision for spam filters, Recall for cancer detection',
                    'Ensemble Learning: Combining weak learners into high-accuracy Random Forests',
                    'Feature Scaling (StandardScaler vs MinMaxScaler) for distance-based algorithms',
                    'Cross-Validation to ensure generalizability on unseen data'
                ],
                realWorldUse: 'Powers Netflix recommendation algorithms, loan default risk scoring, autonomous vehicle perception, and predictive equipment maintenance.',
                interviewTips: 'Be ready to explain how Gradient Descent updates model weights, why L1 regularization produces sparse models, and how to handle imbalanced datasets with SMOTE.',
                recommendedProjects: [
                    'Customer Churn Classification Engine with Scikit-Learn',
                    'Real Estate House Valuation Multiple Regression Model',
                    'K-Means Clustering Customer Segmentation Dashboard'
                ]
            }
        },

        powerbi: {
            id: 'powerbi',
            name: 'Power BI',
            category: 'Data & BI Tools',
            categoryKey: 'data',
            icon: 'fa-solid fa-chart-column',
            color: '#eab308',
            tagline: 'Enterprise Business Intelligence, Interactive KPI Dashboards & DAX Analytics',
            proficiency: '85% - Interactive Dashboard Design',
            overview: 'Microsoft Power BI is an industry-leading business intelligence and data visualization platform. It connects disparate data sources, models relational data schemas, enables powerful calculations via DAX (Data Analysis Expressions), and delivers executive-ready interactive dashboards that drive data-informed decisions.',
            roadmap: [
                {
                    phase: 'Phase 1: Power BI Interface & Data Ingestion',
                    duration: 'Weeks 1 - 2',
                    topics: ['Power BI Desktop Architecture & Workflow', 'Connecting to Data Sources (Excel, CSV, SQL Server, Web)', 'Power Query ETL Editor (Cleaning, Renaming, Data Types)', 'Merging & Appending Queries'],
                    project: 'Clean Data Ingestion & Transformation for Retail Sales'
                },
                {
                    phase: 'Phase 2: Relational Data Modeling',
                    duration: 'Weeks 3 - 4',
                    topics: ['Star Schema vs Snowflake Schema Architecture', 'Fact Tables vs Dimension Tables', 'Configuring Relationships (1-to-many, Cross-filter direction)', 'Creating Date Tables for Time Intelligence'],
                    project: 'Robust E-Commerce Star Schema Data Model'
                },
                {
                    phase: 'Phase 3: DAX Calculations & Measures',
                    duration: 'Weeks 5 - 6',
                    topics: ['Calculated Columns vs Calculated Measures (When to use which)', 'Basic Aggregations: `SUM`, `AVERAGE`, `COUNTROWS`, `DISTINCTCOUNT`', 'The King of DAX: `CALCULATE()` and Filter Context Modification', 'Time Intelligence Functions: `TOTALYTD`, `SAMEPERIODLASTYEAR`, `DATEADD`'],
                    project: 'Year-over-Year (YoY) Sales Growth KPI Measure Suite'
                },
                {
                    phase: 'Phase 4: Dashboard Design & Publishing',
                    duration: 'Weeks 7 - 8',
                    topics: ['Visual Selection: Bar charts, Line charts, Treemaps, Donut charts, Cards, Matrix', 'Interactive Features: Slicers, Drill-Downs, Drill-Throughs & Tooltip Pages', 'Bookmarks & Selection Pane for Dynamic Toggles', 'Publishing to Power BI Service & Row-Level Security (RLS)'],
                    project: 'Executive C-Suite KPI Sales & Profitability Dashboard'
                }
            ],
            youtube: [
                {
                    title: 'Power BI Full Course by Alex The Analyst',
                    channel: 'Alex The Analyst',
                    url: 'https://www.youtube.com/results?search_query=alex+the+analyst+power+bi+full+course',
                    desc: 'The best beginner-to-analyst walkthrough covering data modeling, DAX, and portfolio dashboards.'
                },
                {
                    title: 'Power BI Tutorial for Beginners',
                    channel: 'Kevin Stratvert',
                    url: 'https://www.youtube.com/results?search_query=kevin+stratvert+power+bi+tutorial',
                    desc: 'Clear, concise step-by-step introduction to Power BI Desktop.'
                },
                {
                    title: 'Power BI Complete Masterclass (Hindi)',
                    channel: 'Chandoo',
                    url: 'https://www.youtube.com/results?search_query=chandoo+power+bi+tutorial',
                    desc: 'World-renowned expert Chandoo explains data modeling, DAX, and clean dashboard design.'
                }
            ],
            tutorials: [
                {
                    title: 'Microsoft Learn - Power BI Official Path',
                    url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi',
                    type: 'Official Documentation',
                    desc: 'Official Microsoft certification modules and free interactive training.'
                },
                {
                    title: 'SQLBI - The Definitive Guide to DAX',
                    url: 'https://www.sqlbi.com/guides/dax/',
                    type: 'Advanced DAX Guide',
                    desc: 'By Marco Russo & Alberto Ferrari, the world absolute authorities on DAX modeling.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Filter Context vs Row Context in DAX calculations',
                    '`CALCULATE()` as the primary engine for filter context transition',
                    'Star Schema as the proven standard for high-performance Power BI models',
                    'Row-Level Security (RLS) to restrict data access based on user role'
                ],
                realWorldUse: 'Used across Fortune 500 companies for executive KPIs, sales analytics, supply chain tracking, and financial forecasting.',
                interviewTips: 'Be ready to explain the difference between a calculated column (evaluated during refresh, consumes RAM) vs measure (evaluated on-the-fly, consumes CPU).',
                recommendedProjects: [
                    'Global Superstore Executive Sales & Profit Dashboard',
                    'HR Workforce Attrition & Diversity Intelligence Report',
                    'Supply Chain Delivery Performance & Delay Tracker'
                ]
            }
        },

        excel: {
            id: 'excel',
            name: 'Excel',
            category: 'Data & BI Tools',
            categoryKey: 'data',
            icon: 'fa-solid fa-file-excel',
            color: '#16a34a',
            tagline: 'Spreadsheet Modeling, Dynamic Formulas, XLOOKUP & Pivot Analytics',
            proficiency: '88% - Advanced Formulas & Pivot Tables',
            overview: 'Microsoft Excel remains the ubiquitous engine of global business and operational finance. Equipped with modern dynamic array formulas, XLOOKUP, Pivot Tables, Slicers, and Power Query, Excel enables rapid data cleaning, ad-hoc financial modeling, and executive summary reporting.',
            roadmap: [
                {
                    phase: 'Phase 1: Fundamentals & Essential Formulas',
                    duration: 'Week 1',
                    topics: ['Grid Navigation & Keyboard Shortcuts for 10x Speed', 'Cell Referencing: Relative (`A1`), Absolute (`$A$1`), Mixed (`$A1`, `A$1`)', 'Text Functions (`TRIM`, `CONCAT`, `LEFT`, `RIGHT`, `TEXTSPLIT`)', 'Date Functions (`TODAY`, `DATEDIF`, `EOMONTH`)'],
                    project: 'Automated Employee Timesheet & Wage Calculator'
                },
                {
                    phase: 'Phase 2: Lookup & Logical Mastery',
                    duration: 'Week 2',
                    topics: ['Modern Lookups: `XLOOKUP` & Two-Way Lookups', 'Classic Lookups: `VLOOKUP`, `INDEX-MATCH` & Why it is superior', 'Logical Formulas: `IF`, `IFS`, `AND`, `OR`, `SWITCH`', 'Conditional Math: `SUMIFS`, `COUNTIFS`, `AVERAGEIFS`'],
                    project: 'E-Commerce Product Pricing & Tax Rate Lookup Table'
                },
                {
                    phase: 'Phase 3: Pivot Tables & Interactive Reporting',
                    duration: 'Week 3',
                    topics: ['Creating Pivot Tables from Structured Tables', 'Grouping Dates, Numeric Bins & Calculated Fields', 'Pivot Table Slicers & Timelines for Multi-Table Filtering', 'Conditional Formatting with Data Bars and Color Scales'],
                    project: 'Sales Performance & Regional Revenue Pivot Dashboard'
                },
                {
                    phase: 'Phase 4: Power Query & Advanced Modeling',
                    duration: 'Week 4',
                    topics: ['Power Query in Excel for Automated Data Cleaning & Refresh', 'What-If Analysis, Data Tables & Goal Seek', 'Data Validation (Drop-down lists, Custom Rules)', 'Dynamic Array Formulas (`FILTER`, `UNIQUE`, `SORT`)'],
                    project: 'Automated Financial Cash Flow Model with Scenarios'
                }
            ],
            youtube: [
                {
                    title: 'Excel Tutorial for Beginners',
                    channel: 'Kevin Stratvert',
                    url: 'https://www.youtube.com/results?search_query=kevin+stratvert+excel+tutorial',
                    desc: 'Clear, step-by-step introduction to Excel spreadsheets and essential formulas.'
                },
                {
                    title: 'Excel for Data Analytics by Alex The Analyst',
                    channel: 'Alex The Analyst',
                    url: 'https://www.youtube.com/results?search_query=alex+the+analyst+excel+for+data+analytics',
                    desc: 'Tailored for data analysts covering cleaning, formulas, and Pivot Tables.'
                },
                {
                    title: 'Advanced Excel Full Course',
                    channel: 'Leila Gharani',
                    url: 'https://www.youtube.com/results?search_query=leila+gharani+excel+tutorial',
                    desc: 'World-renowned Excel MVP sharing high-efficiency tips, formulas, and dashboard design.'
                }
            ],
            tutorials: [
                {
                    title: 'Microsoft Excel Official Training Portal',
                    url: 'https://support.microsoft.com/en-us/excel',
                    type: 'Official Documentation',
                    desc: 'Free official templates, formulas guide, and troubleshooting documentation.'
                },
                {
                    title: 'Excel-Easy (Top Free Illustrated Guide)',
                    url: 'https://www.excel-easy.com/',
                    type: 'Practical Guide',
                    desc: '300+ illustrated examples covering basics, functions, data analysis, and VBA.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Dynamic Arrays: Single formulas spilling results automatically (`UNIQUE`, `FILTER`)',
                    'Absolute vs Relative References (`F4` shortcut)',
                    '`INDEX-MATCH` and `XLOOKUP` overcoming `VLOOKUP` left-to-right limitations',
                    'Power Query in Excel: One-click refresh for recurring monthly reports'
                ],
                realWorldUse: 'Used by every financial institution, accounting firm, and operations team for financial statements, budgeting, and ad-hoc analysis.',
                interviewTips: 'Explain why `INDEX-MATCH` is preferred over `VLOOKUP` for large datasets (speed and resilience against inserted columns), and demonstrate `SUMIFS`.',
                recommendedProjects: [
                    'Personal Finance & Investment Portfolio Tracker',
                    'Automated Inventory Stock Reorder Alert System',
                    'Executive Sales KPI Dashboard with Interactive Slicers'
                ]
            }
        },

        data_analysis: {
            id: 'data_analysis',
            name: 'Data Analysis & Viz',
            category: 'Data & BI Tools',
            categoryKey: 'data',
            icon: 'fa-solid fa-chart-line',
            color: '#38bdf8',
            tagline: 'Exploratory Data Analysis (EDA), Statistical Insights & Visual Storytelling',
            proficiency: '88% - Exploratory Insights & Data Storytelling',
            overview: 'Data Analysis and Visualization transforms raw, noisy datasets into actionable business narratives. By leveraging Python (Pandas, NumPy, Matplotlib, Seaborn) along with rigorous statistical hypothesis testing, data analysts uncover hidden trends, validate hypotheses, and guide strategic decisions.',
            roadmap: [
                {
                    phase: 'Phase 1: Data Wrangling & Cleaning with Pandas',
                    duration: 'Weeks 1 - 2',
                    topics: ['NumPy Arrays, Vectorization & Broadcasting', 'Pandas DataFrames, Series & Indexing (`loc`, `iloc`)', 'Handling Missing Values, Duplicates, and Inconsistent Formatting', 'Merging, Concatenating & Reshaping Data (`melt`, `pivot_table`)'],
                    project: 'E-Commerce Raw Transaction Data Cleaning Pipeline'
                },
                {
                    phase: 'Phase 2: Statistical Foundation & EDA',
                    duration: 'Weeks 3 - 4',
                    topics: ['Descriptive Statistics (Mean, Median, Mode, Variance, Standard Deviation)', 'Distribution Analysis (Skewness, Kurtosis, Outlier Detection via IQR)', 'Correlation Analysis (Pearson vs Spearman Correlation Matrix)', 'Hypothesis Testing (p-value, t-test, Chi-Square test)'],
                    project: 'Comprehensive Exploratory Analysis on Tech Salaries Dataset'
                },
                {
                    phase: 'Phase 3: Static & Statistical Visualization',
                    duration: 'Weeks 5 - 6',
                    topics: ['Matplotlib Architecture (Figure, Axes, Subplots, Custom Themes)', 'Seaborn Statistical Plots (Histograms, KDE, Box plots, Violin plots, Heatmaps)', 'Categorical Plots (`barplot`, `countplot`, `pairplot`)', 'Visual Design: Color palettes, contrast, and cognitive load management'],
                    project: 'Global Climate Change Multi-Variable Visual Report'
                },
                {
                    phase: 'Phase 4: Interactive Visuals & Storytelling',
                    duration: 'Weeks 7 - 8',
                    topics: ['Interactive Dashboards with Plotly & Dash', 'Narrative Storytelling: Leading with the "So What?"', 'Automated Insights Generation', 'Exporting and Presenting Reports to Non-Technical Stakeholders'],
                    project: 'Interactive COVID-19 / Healthcare Global Dashboard'
                }
            ],
            youtube: [
                {
                    title: 'Data Analyst Bootcamp by Alex The Analyst',
                    channel: 'Alex The Analyst',
                    url: 'https://www.youtube.com/results?search_query=alex+the+analyst+data+analyst+bootcamp',
                    desc: 'The most comprehensive free data analyst curriculum on YouTube.'
                },
                {
                    title: 'Python for Data Analysis - Full Course',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+python+for+data+analysis',
                    desc: 'Complete masterclass on NumPy, Pandas, Matplotlib, and real-world EDA.'
                },
                {
                    title: 'Data Analysis with Python by Keith Galli',
                    channel: 'Keith Galli',
                    url: 'https://www.youtube.com/results?search_query=keith+galli+data+analysis+with+python',
                    desc: 'Fun, project-based walkthrough analyzing millions of rows of real business data.'
                }
            ],
            tutorials: [
                {
                    title: 'Pandas Official Documentation',
                    url: 'https://pandas.pydata.org/docs/',
                    type: 'Official Documentation',
                    desc: 'Authoritative guide for all DataFrame operations and time-series analysis.'
                },
                {
                    title: 'Seaborn Tutorial & Gallery',
                    url: 'https://seaborn.pydata.org/tutorial.html',
                    type: 'Visual Gallery',
                    desc: 'Rich example gallery of statistical data charts with complete Python source code.'
                },
                {
                    title: 'Kaggle Notebooks & Competitions',
                    url: 'https://www.kaggle.com/code',
                    type: 'Community Notebooks',
                    desc: 'Explore thousands of real EDA notebooks submitted by top data scientists.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Vectorization: Performing computations across entire arrays in C speed without Python loops',
                    'IQR (Interquartile Range) Method for robust outlier detection',
                    'Correlation does NOT imply Causation: Lurking variables and confounders',
                    'Cognitive Load in Chart Design: Choosing the right chart type for the audience'
                ],
                realWorldUse: 'Essential across product analytics (A/B testing), digital marketing (conversion rate optimization), financial forecasting, and operational logistics.',
                interviewTips: 'Be ready to describe how you would approach an unfamiliar messy dataset, explain how to handle missing data without introducing bias, and interpret correlation heatmaps.',
                recommendedProjects: [
                    'Tech Industry Layoffs Trends & Correlation Analysis',
                    'Customer Sentiment & Review Rating Exploratory Engine',
                    'A/B Testing Landing Page Conversion Statistical Analysis'
                ]
            }
        },

        git: {
            id: 'git',
            name: 'GitHub & Git',
            category: 'Tools & Platforms',
            categoryKey: 'tools',
            icon: 'fa-brands fa-github',
            color: '#f43f5e',
            tagline: 'Distributed Version Control, Branching Strategy & Automated CI/CD Workflows',
            proficiency: '90% - Advanced Git Workflows & Actions',
            overview: 'Git is the world standard distributed version control system, tracking every line of code across time. Combined with GitHub, it enables global developer collaboration, pull request code reviews, issue tracking, and automated CI/CD deployment pipelines.',
            roadmap: [
                {
                    phase: 'Phase 1: Local Version Control Fundamentals',
                    duration: 'Week 1',
                    topics: ['`git init`, `.gitignore` configuration', 'The Three Trees: Working Directory, Staging Area, Commit History', '`git add`, `git commit -m "..."`, `git status`, `git log --oneline --graph`', 'Undoing changes: `git checkout -- file`, `git restore`'],
                    project: 'Local Multi-Feature Project Tracked with Clean Commits'
                },
                {
                    phase: 'Phase 2: Remote Repositories & Collaboration',
                    duration: 'Week 2',
                    topics: ['SSH Key Generation & GitHub Configuration', '`git remote add origin`, `git push -u origin main`', '`git clone`, `git pull`, `git fetch` vs `git pull`', 'README.md Crafting with Markdown and Badges'],
                    project: 'Open-Source Project Repository with Issue Templates'
                },
                {
                    phase: 'Phase 3: Branching & Merge Conflict Resolution',
                    duration: 'Week 3',
                    topics: ['Branching Workflows (`git branch`, `git checkout -b <branch>`, `git switch`)', 'Merging (`git merge`) and Resolving Merge Conflicts step-by-step', 'Stashing temporary work (`git stash`, `git stash pop`)', 'Pull Requests (PRs), Code Reviews & Branch Protection Rules'],
                    project: 'Simulated Team PR Workflow with Conflict Resolution'
                },
                {
                    phase: 'Phase 4: Advanced Git & GitHub Actions CI/CD',
                    duration: 'Week 4',
                    topics: ['Rebase vs Merge (`git rebase main`) and Interactive Rebase (`git rebase -i`)', 'Cherry-Picking Commits (`git cherry-pick`)', 'GitHub Actions Workflows (`.github/workflows/deploy.yml`)', 'Automated Testing and Continuous Deployment to GitHub Pages / Cloudflare'],
                    project: 'Automated CI/CD Pipeline Deploying Web App on Every Push'
                }
            ],
            youtube: [
                {
                    title: 'Git and GitHub for Beginners - Crash Course',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+git+and+github+crash+course',
                    desc: 'The best complete walkthrough of Git commands, GitHub, and collaboration.'
                },
                {
                    title: 'Chai aur Git & GitHub (Hindi)',
                    channel: 'Chai aur Code (Hitesh Choudhary)',
                    url: 'https://www.youtube.com/results?search_query=chai+aur+git+github+hitesh+choudhary',
                    desc: 'Crystal-clear Hindi series explaining Git internals, branches, and conflict resolution.'
                },
                {
                    title: 'Git & GitHub Tutorial in Hindi',
                    channel: 'Apna College (Shradha Khapra)',
                    url: 'https://www.youtube.com/results?search_query=apna+college+git+github+tutorial',
                    desc: 'Popular, practical Hindi tutorial for beginners and college students.'
                }
            ],
            tutorials: [
                {
                    title: 'Pro Git Book (Free Official Guide)',
                    url: 'https://git-scm.com/book/en/v2',
                    type: 'Official Documentation',
                    desc: 'Written by Scott Chacon & Ben Straub, the complete authoritative book on Git.'
                },
                {
                    title: 'Learn Git Branching (Interactive Visual Game)',
                    url: 'https://learngitbranching.js.org/',
                    type: 'Interactive Visual Game',
                    desc: 'The most visual, fun way to master branches, rebasing, and HEAD pointers.'
                },
                {
                    title: 'GitHub Docs & Quickstarts',
                    url: 'https://docs.github.com/en',
                    type: 'Official Reference',
                    desc: 'Complete documentation for pull requests, secrets, actions, and security.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Git Internals: Content-addressable storage with SHA-1 hashes (Blobs, Trees, Commits)',
                    'Fast-Forward vs Three-Way Merge',
                    '`git fetch` safely inspects remote changes without modifying local working branch',
                    '`git reset --soft` vs `--hard` when undoing mistakes',
                    'GitHub Actions syntax for automated linting, testing, and deployment'
                ],
                realWorldUse: 'Mandatory standard for all professional software engineering teams worldwide.',
                interviewTips: 'Be ready to explain the difference between `git rebase` vs `git merge`, how to recover lost commits using `git reflog`, and how pull requests work.',
                recommendedProjects: [
                    'Multi-Branch Feature Flow Repository with GitHub Action CI',
                    'Automated Daily Scheduled GitHub Action Sync Bot',
                    'Open Source Contribution to Popular Repository'
                ]
            }
        },

        vscode: {
            id: 'vscode',
            name: 'VS Code',
            category: 'Tools & Platforms',
            categoryKey: 'tools',
            icon: 'fa-solid fa-laptop-code',
            color: '#38bdf8',
            tagline: 'Modern Development Environment, Debugging, Extensions & Terminal Workflow',
            proficiency: '92% - Power User & Workspace Customization',
            overview: 'Visual Studio Code (VS Code) is Microsoft’s lightweight yet extraordinarily powerful source-code editor. With built-in Git integration, intelligent code completion (IntelliSense), integrated terminals, rich debugging protocols, and an endless ecosystem of extensions, it is the primary IDE for modern software engineers.',
            roadmap: [
                {
                    phase: 'Phase 1: Interface & Core Productivity Shortcuts',
                    duration: 'Week 1',
                    topics: ['Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)', 'File Navigation (`Ctrl+P`), Multi-Cursor Editing (`Alt+Click`, `Ctrl+D`)', 'Integrated Terminal (`Ctrl+\\`) & Split Terminals', 'Workspace Settings vs User Settings (`settings.json`)'],
                    project: 'High-Efficiency Custom Keyboard Shortcut Profile'
                },
                {
                    phase: 'Phase 2: Essential Extensions & Formatting',
                    duration: 'Week 2',
                    topics: ['Prettier (Automatic code formatting on save)', 'ESLint & Pylance for Real-Time Linting', 'Live Server for Instant Local Web Testing', 'GitLens for Line-by-Line Commit Blame & History'],
                    project: 'Automated Multi-Language Lint & Format Pipeline'
                },
                {
                    phase: 'Phase 3: Integrated Debugging Protocols',
                    duration: 'Week 3',
                    topics: ['Configuring `launch.json` for Python and JavaScript Debugging', 'Breakpoints, Conditional Breakpoints & Logpoints', 'Watch Expressions & Variable Scope Inspection', 'Call Stack Navigation'],
                    project: 'Debugging a Complex Recursive Algorithm Step-by-Step'
                },
                {
                    phase: 'Phase 4: Remote Development & AI Workflows',
                    duration: 'Week 4',
                    topics: ['Remote SSH for Developing on Cloud Servers', 'Dev Containers (Docker-based reproducible environments)', 'Live Share for Real-Time Remote Pair Programming', 'Integrating AI Coding Assistants & Task Automation (`tasks.json`)'],
                    project: 'Reproducible Dev Container Environment for Team Projects'
                }
            ],
            youtube: [
                {
                    title: 'VS Code Top Tips & Shortcuts by Kevin Powell',
                    channel: 'Kevin Powell',
                    url: 'https://www.youtube.com/results?search_query=kevin+powell+vs+code+tips+and+tricks',
                    desc: 'Brilliant productivity shortcuts and workflow improvements in VS Code.'
                },
                {
                    title: 'Visual Studio Code Tutorial for Beginners',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+vs+code+tutorial+for+beginners',
                    desc: 'Full course covering installation, extensions, debugging, and git integration.'
                },
                {
                    title: 'VS Code Setup for Web Development (Hindi)',
                    channel: 'CodeWithHarry',
                    url: 'https://www.youtube.com/results?search_query=codewithharry+vs+code+setup',
                    desc: 'Step-by-step Hindi guide to customizing VS Code for fast web development.'
                }
            ],
            tutorials: [
                {
                    title: 'Official Visual Studio Code Documentation',
                    url: 'https://code.visualstudio.com/docs',
                    type: 'Official Documentation',
                    desc: 'The official guides for debugging, extensions, remote dev, and keybindings.'
                },
                {
                    title: 'VS Code Tips and Tricks (Official)',
                    url: 'https://code.visualstudio.com/docs/getstarted/tips-and-tricks',
                    type: 'Productivity Guide',
                    desc: 'Curated official tips to dramatically speed up your coding workflow.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Language Server Protocol (LSP) enabling multi-language intelligence',
                    'Debug Adapter Protocol (DAP) for uniform debugging across runtimes',
                    'Workspace-level `.vscode/settings.json` for team standardization',
                    'Multi-root workspaces for monorepo development'
                ],
                realWorldUse: 'The standard IDE across Google, Microsoft, Meta, and the vast majority of software companies worldwide.',
                interviewTips: 'Highlight your proficiency with integrated debugging rather than relying solely on `console.log` or `print()` statements.',
                recommendedProjects: [
                    'Custom VS Code Extension or Code Snippet Pack',
                    'Team Workspace Configuration with Pre-Configured Debug Launchers'
                ]
            }
        },

        colab: {
            id: 'colab',
            name: 'Google Colab',
            category: 'Tools & Platforms',
            categoryKey: 'tools',
            icon: 'fa-solid fa-terminal',
            color: '#f59e0b',
            tagline: 'Cloud Jupyter Notebooks, GPU/TPU Acceleration & Collaborative Research',
            proficiency: '88% - Cloud ML Prototyping',
            overview: 'Google Colab (Colaboratory) is a cloud-hosted Jupyter Notebook service provided by Google. Requiring zero setup, it provides free access to computing resources including GPUs and TPUs, making it the premier platform for Machine Learning prototyping, data analysis experiments, and collaborative data science research.',
            roadmap: [
                {
                    phase: 'Phase 1: Colab Notebook Essentials',
                    duration: 'Week 1',
                    topics: ['Notebook Cells: Code vs Markdown', 'Keyboard Shortcuts (`Shift+Enter`, `Ctrl+M B`, etc.)', 'Running Shell Commands (`!pip install`, `!git clone`)', 'Magic Commands (`%timeit`, `%matplotlib inline`)'],
                    project: 'Interactive Data Science Analysis Notebook with Visualizations'
                },
                {
                    phase: 'Phase 2: Hardware Acceleration & GPU Runtimes',
                    duration: 'Week 2',
                    topics: ['Enabling T4 / V100 GPU and TPU Runtimes in Colab', 'Checking GPU Memory & Status with `!nvidia-smi`', 'Comparing CPU vs GPU Execution Speeds on Large Matrix Operations', 'Managing Session RAM and Disk Limits'],
                    project: 'GPU-Accelerated Matrix Benchmark Notebook'
                },
                {
                    phase: 'Phase 3: Storage & Google Drive Integration',
                    duration: 'Week 3',
                    topics: ['Mounting Google Drive (`from google.colab import drive`)', 'Reading and Writing Large Datasets Directly from Drive', 'Saving Trained Model Checkpoints (`.pkl`, `.h5`, `.pt`)', 'Handling File Uploads & Downloads Programmatically'],
                    project: 'Persistent Machine Learning Training Pipeline on Google Drive'
                },
                {
                    phase: 'Phase 4: Collaboration & GitHub Versioning',
                    duration: 'Week 4',
                    topics: ['Collaborating in Real-Time with Commenting and Co-Editing', 'Saving Notebooks Directly to GitHub Repositories', 'Adding "Open in Colab" Badges to GitHub Readmes', 'Exporting Notebooks to HTML, PDF & Python Scripts'],
                    project: 'Published Research-Grade ML Notebook on GitHub with Colab Badge'
                }
            ],
            youtube: [
                {
                    title: 'Google Colab Tutorial for Beginners',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+google+colab+tutorial',
                    desc: 'Complete walkthrough of Jupyter notebooks in the cloud with GPU setup.'
                },
                {
                    title: 'How to Use Google Colab with Free GPU (Hindi)',
                    channel: 'Krish Naik',
                    url: 'https://www.youtube.com/results?search_query=krish+naik+google+colab+tutorial',
                    desc: 'Practical Hindi guide for data science, deep learning, and mounting Google Drive.'
                }
            ],
            tutorials: [
                {
                    title: 'Google Colaboratory Official Overview',
                    url: 'https://colab.research.google.com/',
                    type: 'Official Documentation',
                    desc: 'The official interactive tutorial notebook explaining all Colab features.'
                },
                {
                    title: 'Google Colab FAQ & Guides',
                    url: 'https://research.google.com/colaboratory/faq.html',
                    type: 'Official FAQ',
                    desc: 'Comprehensive answers regarding GPU limits, runtimes, and sharing permissions.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Ephemeral VM Architecture: Runtimes reset after inactivity, requiring persistence strategies',
                    'CUDA GPU Acceleration for PyTorch, TensorFlow, and Scikit-Learn',
                    'Google Drive Virtual File System mounting (`/content/drive/MyDrive`)',
                    'Form Fields: Adding interactive slider and dropdown widgets to cells'
                ],
                realWorldUse: 'Used across academia, AI hackathons, Kaggle competitions, and rapid machine learning experiment prototyping.',
                interviewTips: 'Explain how you preserve trained models across ephemeral Colab session disconnects using Google Drive or Cloud Storage.',
                recommendedProjects: [
                    'GPU-Accelerated Computer Vision Classification Notebook',
                    'End-to-End Scikit-Learn Model Training & Export Workflow'
                ]
            }
        },

        dom: {
            id: 'dom',
            name: 'DOM Manipulation',
            category: 'Tools & Platforms',
            categoryKey: 'tools',
            icon: 'fa-solid fa-sitemap',
            color: '#38bdf8',
            tagline: 'Real-Time Dynamic UI State, Event Delegation & High-Performance Rendering',
            proficiency: '90% - Real-Time Dynamic UI Updates',
            overview: 'The Document Object Model (DOM) is the programming interface for web documents. It represents the page as a structured tree of nodes and objects. Mastering native DOM manipulation allows developers to build hyper-responsive, interactive interfaces, modal managers, filtering systems, and real-time state synchronizations without heavy framework dependencies.',
            roadmap: [
                {
                    phase: 'Phase 1: DOM Tree Navigation & Selection',
                    duration: 'Week 1',
                    topics: ['Window vs Document Object', 'Selecting Elements (`querySelector`, `querySelectorAll`, `getElementById`)', 'Traversing the DOM (`parentNode`, `children`, `nextElementSibling`)', 'NodeLists vs HTMLCollections'],
                    project: 'Interactive FAQ Accordion with Smooth Toggles'
                },
                {
                    phase: 'Phase 2: Mutating Elements & Styles',
                    duration: 'Week 2',
                    topics: ['`innerHTML` vs `textContent` (Security & XSS Prevention)', 'Manipulating Classes (`classList.add`, `remove`, `toggle`, `contains`)', 'Attributes (`setAttribute`, `getAttribute`, `dataset`)', 'Inline Styles vs CSS Variable Manipulation'],
                    project: 'Dynamic Theme Switcher & Accent Color Picker'
                },
                {
                    phase: 'Phase 3: Event Architecture & Delegation',
                    duration: 'Week 3',
                    topics: ['`addEventListener()`, Event Object (`e.target`, `e.currentTarget`)', 'Event Bubbling and Event Capturing Phases', 'Event Delegation for Dynamically Created Nodes', 'Preventing Defaults (`e.preventDefault()`, `e.stopPropagation()`)'],
                    project: 'Interactive Dynamic To-Do App with Event Delegation'
                },
                {
                    phase: 'Phase 4: High-Performance DOM Rendering',
                    duration: 'Week 4',
                    topics: ['Understanding Browser Reflow (Layout) vs Repaint', '`document.createDocumentFragment()` for Batch Appending', 'IntersectionObserver API for Lazy Loading & Scroll Reveal', 'MutationObserver API for Listening to DOM Tree Changes'],
                    project: 'Infinite Scrolling Feed with Virtualized DOM Nodes'
                }
            ],
            youtube: [
                {
                    title: 'JavaScript DOM Manipulation Tutorial',
                    channel: 'Traversy Media',
                    url: 'https://www.youtube.com/results?search_query=traversy+media+javascript+dom+crash+course',
                    desc: 'The gold-standard crash course covering selection, traversal, events, and dynamic creation.'
                },
                {
                    title: 'Chai aur JavaScript DOM Masterclass (Hindi)',
                    channel: 'Chai aur Code (Hitesh Choudhary)',
                    url: 'https://www.youtube.com/results?search_query=chai+aur+javascript+dom+manipulation',
                    desc: 'In-depth Hindi exploration of how the browser renders the DOM and event handling.'
                },
                {
                    title: 'JavaScript DOM Crash Course',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+javascript+dom+crash+course',
                    desc: 'Practical, project-focused guide to building interactive web applications.'
                }
            ],
            tutorials: [
                {
                    title: 'MDN Web Docs - Introduction to the DOM',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
                    type: 'Official Documentation',
                    desc: 'The official architectural overview of the Document Object Model.'
                },
                {
                    title: 'JavaScript.info - Document and Events',
                    url: 'https://javascript.info/document',
                    type: 'Comprehensive Guide',
                    desc: 'Meticulous deep-dive covering event delegation, scrolling, coordinates, and performance.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Event Delegation: Attaching one listener to a parent element to handle thousands of dynamic children',
                    'Minimizing Reflows: Modifying DOM in memory with `DocumentFragment` before painting',
                    'XSS Prevention: Avoiding `innerHTML` with unsanitized user inputs in favor of `textContent`',
                    '`dataset` attributes for storing state directly in markup'
                ],
                realWorldUse: 'Powers real-time user interfaces, single-page application routers, custom modals, and high-performance interactive games.',
                interviewTips: 'Be ready to explain how Event Delegation works, what causes expensive browser reflows, and the difference between `e.target` and `e.currentTarget`.',
                recommendedProjects: [
                    'Interactive Modal & Drawer System with Keyboard Escape & Focus Trapping',
                    'Real-Time Live Search Filter for Multi-Card Catalog',
                    'Custom Drag-and-Drop File Uploader with Visual Progress'
                ]
            }
        },

        analytical_thinking: {
            id: 'analytical_thinking',
            name: 'Analytical Thinking & Problem Solving',
            category: 'Soft Skills',
            categoryKey: 'soft',
            icon: 'fa-solid fa-lightbulb',
            color: '#fbbf24',
            tagline: 'Systematic Problem Decomposition, Algorithmic Logic & Debugging Mindset',
            proficiency: '94% - Algorithmic Breakdown & Root Cause Analysis',
            overview: 'Analytical Thinking is the ability to deconstruct complex, ambiguous problems into smaller, manageable components, identify root causes using first-principles reasoning, and engineer optimal, scalable solutions. In software and data engineering, it is the fundamental bridge between business ambiguity and technical execution.',
            roadmap: [
                {
                    phase: 'Phase 1: Problem Decomposition & First Principles',
                    duration: 'Ongoing',
                    topics: ['Breaking complex tasks into atomic sub-problems', 'Distinguishing assumptions from verified facts', 'Input/Output boundary condition mapping', 'Creating flowcharts and algorithmic pseudocode'],
                    project: 'Complex Business Requirement Specification & Logic Flow'
                },
                {
                    phase: 'Phase 2: Algorithmic Efficiency & Trade-Offs',
                    duration: 'Ongoing',
                    topics: ['Time and Space Complexity Analysis (Big-O Notation)', 'Identifying performance bottlenecks before writing code', 'Memory vs Speed trade-off evaluations', 'Designing fail-safe edge case handlers'],
                    project: 'Refactoring O(N^2) Nested Loops into O(N) Hash Lookups'
                },
                {
                    phase: 'Phase 3: Systematic Root-Cause Debugging',
                    duration: 'Ongoing',
                    topics: ['The "5 Whys" Methodology for Incident Investigation', 'Binary Search Debugging (isolating faulty code commits)', 'Formulating testable hypotheses rather than random trial-and-error', 'Writing reproducible minimal test cases'],
                    project: 'Comprehensive Post-Mortem RCA Document for a System Outage'
                },
                {
                    phase: 'Phase 4: Scalable Architecture Decision Making',
                    duration: 'Ongoing',
                    topics: ['Evaluating technology trade-offs (SQL vs NoSQL, Monolith vs Microservices)', 'Defensive programming and error resilience', 'Anticipating scale and concurrency bottlenecks'],
                    project: 'Architecture Decision Record (ADR) for Multi-Service System'
                }
            ],
            youtube: [
                {
                    title: 'How to Think Like a Programmer',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+how+to+think+like+a+programmer',
                    desc: 'Frameworks for decomposing problems and approaching programming challenges with confidence.'
                },
                {
                    title: 'Problem Solving Techniques in Coding',
                    channel: 'NeetCode',
                    url: 'https://www.youtube.com/results?search_query=neetcode+problem+solving+techniques',
                    desc: 'Systematic approaches to analyzing problems, recognizing patterns, and optimizing solutions.'
                }
            ],
            tutorials: [
                {
                    title: 'Harvard CS50: Introduction to Computer Science',
                    url: 'https://cs50.harvard.edu/x/',
                    type: 'World-Renowned Course',
                    desc: 'Legendary course taught by David J. Malan developing foundational computational thinking.'
                },
                {
                    title: 'Grokking Algorithms by Aditya Bhargava',
                    url: 'https://www.manning.com/books/grokking-algorithms',
                    type: 'Visual Book',
                    desc: 'An illustrated guide for programmers explaining problem decomposition visually.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'First-Principles Thinking: Questioning every premise down to fundamental truths',
                    'Occam’s Razor: The simplest solution with the fewest assumptions is usually the best',
                    'Defensive Programming: Expecting invalid inputs and network failures',
                    'Blameless Root Cause Analysis (RCA)'
                ],
                realWorldUse: 'Essential during architectural whiteboarding, diagnosing production crashes, designing data schemas, and optimizing algorithmic execution.',
                interviewTips: 'In technical and behavioral interviews, speak your reasoning out loud, clarify ambiguous requirements before jumping into code, and state edge cases explicitly.',
                recommendedProjects: [
                    'Root Cause Analysis (RCA) Diagnostic Simulation',
                    'Algorithm Visualizer Comparing Bubble Sort vs Quick Sort'
                ]
            }
        },

        collaboration: {
            id: 'collaboration',
            name: 'Collaboration & Communication',
            category: 'Soft Skills',
            categoryKey: 'soft',
            icon: 'fa-solid fa-people-group',
            color: '#10b981',
            tagline: 'Cross-Functional Teamwork, Empathetic Code Reviews & Technical Storytelling',
            proficiency: '90% - Team Alignment & Clear Communication',
            overview: 'Software engineering is fundamentally a team sport. High-impact engineers communicate complex technical ideas with crystal clarity, write clean documentation, conduct empathetic code reviews, align cross-functional stakeholders, and foster psychological safety within engineering squads.',
            roadmap: [
                {
                    phase: 'Phase 1: Clear Technical Writing',
                    duration: 'Ongoing',
                    topics: ['Writing clean, concise Git commit messages (Conventional Commits)', 'Crafting structured Pull Request descriptions with context & screenshots', 'Technical documentation and API guides', 'Writing reproducible bug tickets on Jira / GitHub Issues'],
                    project: 'Comprehensive Open-Source README & Contributing Guide'
                },
                {
                    phase: 'Phase 2: Empathetic Code Reviews',
                    duration: 'Ongoing',
                    topics: ['Focusing on code architecture rather than personal preferences', 'Offering constructive alternatives with code snippets', 'Praising elegant solutions in peer PRs', 'Distinguishing blocking issues from nitpicks'],
                    project: 'Constructive Simulated Code Review on a Pull Request'
                },
                {
                    phase: 'Phase 3: Cross-Functional Stakeholder Alignment',
                    duration: 'Ongoing',
                    topics: ['Translating technical constraints into business value and timelines', 'Active listening during requirements gathering', 'Demonstrating working software in sprint demos', 'Managing expectations and communicating blockers proactively'],
                    project: 'Technical Demo Presentation for Non-Technical Managers'
                },
                {
                    phase: 'Phase 4: Agile / Scrum Team Dynamics',
                    duration: 'Ongoing',
                    topics: ['Effective participation in daily standups (What I did, What I will do, Blockers)', 'Sprint Planning and Story Point Estimation', 'Sprint Retrospectives for continuous team improvement', 'Asynchronous communication best practices across time zones'],
                    project: 'Agile Sprint Board Simulation with Sized User Stories'
                }
            ],
            youtube: [
                {
                    title: 'Effective Technical Communication for Software Engineers',
                    channel: 'Google Tech Talks',
                    url: 'https://www.youtube.com/results?search_query=google+tech+talks+technical+communication',
                    desc: 'Insights from top engineering leaders on presenting ideas and writing documentation.'
                },
                {
                    title: 'How to Write Great Documentation & Pull Requests',
                    channel: 'freeCodeCamp.org',
                    url: 'https://www.youtube.com/results?search_query=freecodecamp+how+to+write+great+documentation',
                    desc: 'Practical guide to writing documentation that peers and recruiters love.'
                }
            ],
            tutorials: [
                {
                    title: 'Atlassian Agile Coach',
                    url: 'https://www.atlassian.com/agile',
                    type: 'Official Agile Guide',
                    desc: 'The definitive guide to Scrum, Kanban, sprints, and team velocity.'
                },
                {
                    title: 'Conventional Commits Specification',
                    url: 'https://www.conventionalcommits.org/',
                    type: 'Standard Specification',
                    desc: 'The industry-standard commit format (`feat:`, `fix:`, `chore:`, `docs:`).'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Active Listening: Listening to understand rather than simply waiting for your turn to speak',
                    'Asynchronous First: Writing thorough, self-contained messages that avoid unnecessary meetings',
                    'Psychological Safety: Encouraging team members to ask questions without fear of judgment',
                    'The STAR Method (Situation, Task, Action, Result) for structured communication'
                ],
                realWorldUse: 'Powers high-velocity distributed engineering teams across agile sprints, incident war-rooms, and multi-team product launches.',
                interviewTips: 'Use the STAR method to describe how you resolved a team disagreement or helped a teammate overcome a difficult technical blocker.',
                recommendedProjects: [
                    'Open Source Multi-Contributor Repository with PR Templates',
                    'Complete Architecture and API Specification Document'
                ]
            }
        },

        pressure_handling: {
            id: 'pressure_handling',
            name: 'Pressure Handling & Adaptability',
            category: 'Soft Skills',
            categoryKey: 'soft',
            icon: 'fa-solid fa-shield-halved',
            color: '#6366f1',
            tagline: 'Composure Under Tight Deadlines, Rapid Context Switching & Continuous Learning',
            proficiency: '92% - Resilient Execution in Fast-Paced Environments',
            overview: 'In the fast-moving landscape of software engineering and artificial intelligence, requirements evolve rapidly and unexpected production roadblocks occur. Pressure Handling and Adaptability represents the mental toughness, prioritization clarity, and continuous learning mindset to thrive amidst tight deadlines and fast-moving technological shifts.',
            roadmap: [
                {
                    phase: 'Phase 1: Prioritization Under Pressure',
                    duration: 'Ongoing',
                    topics: ['The Eisenhower Matrix (Urgent vs Important triage)', 'Scope negotiation: Delivering a robust Minimum Viable Product (MVP) on time', 'Timeboxing tasks to prevent perfectionist paralysis', 'Identifying and escalating true blockers early'],
                    project: 'Sprint Triage Plan for a High-Stakes Product Launch'
                },
                {
                    phase: 'Phase 2: Composure During Production Incidents',
                    duration: 'Ongoing',
                    topics: ['Calm Incident Management: Assess, Mitigate, Investigate, Resolve', 'Focusing on restoring service first, deep debugging second', 'Maintaining clear status communication to stakeholders during outages', 'Conducting blameless post-mortems after resolution'],
                    project: 'Incident Response Playbook for Web Application Outages'
                },
                {
                    phase: 'Phase 3: Fast Context Switching & Rapid Unblocking',
                    duration: 'Ongoing',
                    topics: ['Mental note-taking when switching between tasks', 'Resuming work efficiently without cognitive lag', 'Finding alternative paths when an API or dependency fails', 'Pair programming to unblock critical path roadblocks'],
                    project: 'Multi-Task Hackathon Sprint Execution Strategy'
                },
                {
                    phase: 'Phase 4: Continuous Learning & Technological Agility',
                    duration: 'Ongoing',
                    topics: ['Embracing new AI tooling and coding assistants without fear', 'Reading technical documentation rapidly to adopt new frameworks', 'Viewing feedback and constructive criticism as acceleration catalysts', 'Maintaining physical and mental well-being for long-term career stamina'],
                    project: 'Rapid Adoption of an Unfamiliar Framework in Under 48 Hours'
                }
            ],
            youtube: [
                {
                    title: 'How Top Engineers Handle High-Pressure Production Outages',
                    channel: 'Continuous Delivery (Dave Farley)',
                    url: 'https://www.youtube.com/results?search_query=dave+farley+continuous+delivery+incident+management',
                    desc: 'Expert guidance on designing resilient systems and handling high-pressure outages calmly.'
                },
                {
                    title: 'Handling Stress and Deadlines in Software Engineering',
                    channel: 'TechLead / freeCodeCamp',
                    url: 'https://www.youtube.com/results?search_query=handling+stress+deadlines+software+engineering',
                    desc: 'Realistic career advice on managing workload, expectations, and avoiding burnout.'
                }
            ],
            tutorials: [
                {
                    title: 'Google SRE Book (Site Reliability Engineering)',
                    url: 'https://sre.google/sre-book/table-of-contents/',
                    type: 'Authoritative Book',
                    desc: 'Google legendary book on incident management, blameless post-mortems, and reliability.'
                },
                {
                    title: 'Atomic Habits Frameworks for Focus & Resilience',
                    url: 'https://jamesclear.com/articles',
                    type: 'Productivity Framework',
                    desc: 'Actionable strategies for sustaining focus, managing energy, and daily continuous improvement.'
                }
            ],
            knowledge: {
                keyConcepts: [
                    'Blameless Culture: Focus on fixing systemic flaws rather than blaming individuals',
                    'Triage Prioritization: Solving the most critical bottleneck first',
                    'Growth Mindset: Viewing unexpected bugs not as failures, but as high-signal learning opportunities',
                    'Cognitive Resilience: Maintaining emotional calm under ambiguous or high-stakes conditions'
                ],
                realWorldUse: 'Critical during production bug releases, high-traffic product launches, hackathons, and dynamic startup environments.',
                interviewTips: 'Share an authentic, vivid story of a time when a project faced a sudden deadline shift or technical roadblock, and how you kept a calm head, restructured priorities, and successfully delivered.',
                recommendedProjects: [
                    'High-Pressure Hackathon Deliverable Built in 24 Hours',
                    'Automated Health Check & Self-Healing Service Watchdog'
                ]
            }
        }
    };

    // Mapping from card titles or data attributes to skill keys
    const SKILL_KEY_ALIASES = {
        'python': 'python',
        'c++': 'cpp',
        'cpp': 'cpp',
        'java': 'java',
        'javascript': 'javascript',
        'js': 'javascript',
        'html5': 'html5',
        'html': 'html5',
        'css3': 'css3',
        'css': 'css3',
        'bootstrap': 'bootstrap',
        'tailwind': 'tailwind',
        'tailwind css': 'tailwind',
        'mysql': 'mysql',
        'mongodb': 'mongodb',
        'sql': 'sql',
        'machine learning': 'ml',
        'ml': 'ml',
        'power bi': 'powerbi',
        'powerbi': 'powerbi',
        'excel': 'excel',
        'data analysis & viz': 'data_analysis',
        'data analysis': 'data_analysis',
        'github & git': 'git',
        'git': 'git',
        'github': 'git',
        'vs code': 'vscode',
        'vscode': 'vscode',
        'google colab': 'colab',
        'colab': 'colab',
        'dom manipulation': 'dom',
        'dom': 'dom',
        'analytical thinking & problem solving': 'analytical_thinking',
        'analytical thinking': 'analytical_thinking',
        'collaboration & communication': 'collaboration',
        'collaboration': 'collaboration',
        'pressure handling & adaptability': 'pressure_handling',
        'pressure handling': 'pressure_handling'
    };

    // Public accessor
    window.SkillsIntelligence = {
        getSkill: function (identifier) {
            if (!identifier) return null;
            const normalized = String(identifier).trim().toLowerCase();
            const key = SKILL_KEY_ALIASES[normalized] || normalized;
            return SKILLS_DATABASE[key] || null;
        },
        getAllSkills: function () {
            return SKILLS_DATABASE;
        }
    };

    // Initialize UI Modal controller when DOM is ready
    document.addEventListener('DOMContentLoaded', initSkillsModalController);

    function initSkillsModalController() {
        const modal = document.getElementById('skillDetailModal');
        if (!modal) return;

        const closeBtn = document.getElementById('closeSkillModalBtn');
        const closeFooterBtn = document.getElementById('closeSkillModalFooterBtn');
        const modalBackdrop = modal;

        // Interactive tab buttons inside modal
        const tabButtons = modal.querySelectorAll('.skill-modal-tab-btn');
        const tabPanes = modal.querySelectorAll('.skill-modal-tab-pane');

        // Setup tab switching
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                switchTab(targetTab);
            });
        });

        function switchTab(tabName) {
            tabButtons.forEach(b => {
                const isTarget = b.getAttribute('data-tab') === tabName;
                b.classList.toggle('active', isTarget);
                b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
            });
            tabPanes.forEach(pane => {
                const isTarget = pane.getAttribute('data-tab-content') === tabName;
                pane.classList.toggle('active', isTarget);
            });
            if (modal) modal.scrollTop = 0;
        }

        function openSkillModal(skillKey) {
            const skill = window.SkillsIntelligence.getSkill(skillKey);
            if (!skill) return;

            // Populate Modal Header
            const iconWrap = document.getElementById('skillModalIconWrap');
            const nameEl = document.getElementById('skillModalName');
            const catBadge = document.getElementById('skillModalCategoryBadge');
            const profBadge = document.getElementById('skillModalProficiencyBadge');
            const taglineEl = document.getElementById('skillModalTagline');
            const overviewEl = document.getElementById('skillModalOverview');
            const prachiAskBtn = document.getElementById('skillModalPrachiBtn');

            if (iconWrap) {
                iconWrap.innerHTML = `<i class="${skill.icon}" style="color: ${skill.color}"></i>`;
                iconWrap.style.boxShadow = `0 0 20px ${skill.color}35`;
                iconWrap.style.borderColor = `${skill.color}50`;
            }
            if (nameEl) nameEl.textContent = skill.name;
            if (catBadge) catBadge.textContent = skill.category;
            if (profBadge) profBadge.textContent = skill.proficiency;
            if (taglineEl) taglineEl.textContent = skill.tagline;
            if (overviewEl) overviewEl.textContent = skill.overview;

            // Configure Prachi AI Deep-Link
            if (prachiAskBtn) {
                const promptText = encodeURIComponent(`Hi Prachi, explain the core concepts, real-world industry use cases, and best learning path for ${skill.name}.`);
                prachiAskBtn.href = `prachi/?prompt=${promptText}`;
                prachiAskBtn.title = `Ask Prachi AI about ${skill.name}`;
            }

            // 1. Populate Roadmap Tab
            const roadmapContainer = document.getElementById('skillModalRoadmapTimeline');
            if (roadmapContainer) {
                roadmapContainer.innerHTML = skill.roadmap.map((step, idx) => `
                    <div class="roadmap-timeline-step">
                        <div class="roadmap-step-header">
                            <span class="roadmap-step-num" style="background: ${skill.color}25; color: ${skill.color}; border: 1px solid ${skill.color}60;">0${idx + 1}</span>
                            <div class="roadmap-step-title-wrap">
                                <h4 class="roadmap-step-title">${step.phase}</h4>
                                <span class="roadmap-step-duration"><i class="fa-regular fa-clock"></i> ${step.duration}</span>
                            </div>
                        </div>
                        <ul class="roadmap-topic-list">
                            ${step.topics.map(topic => `<li><i class="fa-solid fa-check" style="color: ${skill.color}"></i> <span>${topic}</span></li>`).join('')}
                        </ul>
                        <div class="roadmap-milestone-project">
                            <span class="roadmap-milestone-label"><i class="fa-solid fa-cube"></i> Milestone Project:</span>
                            <span class="roadmap-milestone-name">${step.project}</span>
                        </div>
                    </div>
                `).join('');
            }

            // 2. Populate YouTube Beginner Tutorials Tab
            const ytContainer = document.getElementById('skillModalYoutubeGrid');
            if (ytContainer) {
                ytContainer.innerHTML = skill.youtube.map(yt => `
                    <div class="yt-resource-card">
                        <div class="yt-card-header">
                            <div class="yt-play-badge"><i class="fa-brands fa-youtube"></i></div>
                            <span class="yt-channel-badge">${yt.channel}</span>
                        </div>
                        <h4 class="yt-card-title">${yt.title}</h4>
                        <p class="yt-card-desc">${yt.desc}</p>
                        <a href="${yt.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm yt-watch-btn" title="Watch on YouTube">
                            <i class="fa-solid fa-play"></i> Watch Tutorial
                        </a>
                    </div>
                `).join('');
            }

            // 3. Populate Tutorials & Documentation Tab
            const tutorialsContainer = document.getElementById('skillModalTutorialsGrid');
            if (tutorialsContainer) {
                tutorialsContainer.innerHTML = skill.tutorials.map(tut => `
                    <div class="tut-resource-card">
                        <div class="tut-card-type-badge">${tut.type}</div>
                        <h4 class="tut-card-title">${tut.title}</h4>
                        <p class="tut-card-desc">${tut.desc}</p>
                        <a href="${tut.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm tut-link-btn" title="Open Documentation">
                            <span>Open Guide</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                `).join('');
            }

            // 4. Populate Knowledgeable Information Tab
            const knowledgeContainer = document.getElementById('skillModalKnowledgeContent');
            if (knowledgeContainer) {
                knowledgeContainer.innerHTML = `
                    <div class="knowledge-block">
                        <h4 class="knowledge-block-title"><i class="fa-solid fa-microchip" style="color: ${skill.color}"></i> Core Architectural Concepts</h4>
                        <ul class="knowledge-concept-list">
                            ${skill.knowledge.keyConcepts.map(kc => `<li><i class="fa-solid fa-circle-dot" style="color: ${skill.color}"></i> <span>${kc}</span></li>`).join('')}
                        </ul>
                    </div>
                    <div class="knowledge-grid-split">
                        <div class="knowledge-block">
                            <h4 class="knowledge-block-title"><i class="fa-solid fa-building-columns" style="color: #10b981"></i> Real-World Industry Application</h4>
                            <p class="knowledge-text">${skill.knowledge.realWorldUse}</p>
                        </div>
                        <div class="knowledge-block">
                            <h4 class="knowledge-block-title"><i class="fa-solid fa-bullseye" style="color: #f59e0b"></i> Interview Focus & Pro Tips</h4>
                            <p class="knowledge-text">${skill.knowledge.interviewTips}</p>
                        </div>
                    </div>
                    <div class="knowledge-block">
                        <h4 class="knowledge-block-title"><i class="fa-solid fa-laptop-code" style="color: #ec4899"></i> High-Impact Portfolio Project Ideas</h4>
                        <div class="knowledge-project-pills">
                            ${skill.knowledge.recommendedProjects.map(proj => `
                                <div class="knowledge-project-pill">
                                    <i class="fa-solid fa-code-fork" style="color: ${skill.color}"></i>
                                    <span>${proj}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Reset to first tab (Roadmap)
            switchTab('roadmap');

            // Open Modal with smooth animation
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            modal.scrollTop = 0;
        }

        function closeSkillModal() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        const closeProjectsBtn = document.getElementById('closeSkillModalProjectsBtn');

        if (closeBtn) closeBtn.addEventListener('click', closeSkillModal);
        if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeSkillModal);
        if (closeProjectsBtn) closeProjectsBtn.addEventListener('click', closeSkillModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeSkillModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeSkillModal();
            }
        });

        // Attach click listeners to all skill cards in the Skills section
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            // Find skill name from card header
            const nameEl = card.querySelector('.skill-name');
            const skillName = nameEl ? nameEl.textContent.trim() : '';
            const skillKey = card.getAttribute('data-skill') || skillName;

            // Make card look and act like an interactive button
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('title', `Click to view Roadmap, YouTube Tutorials & Knowledge for ${skillName}`);
            card.classList.add('skill-card-clickable');

            // Append a sleek visual cue on the card if not present
            if (!card.querySelector('.skill-click-hint') && !card.querySelector('.skill-card-explore-pill')) {
                const hint = document.createElement('div');
                hint.className = 'skill-click-hint';
                hint.innerHTML = '<i class="fa-solid fa-compass"></i> <span>Explore Roadmap &amp; Resources</span>';
                card.appendChild(hint);
            }

            card.addEventListener('click', () => {
                openSkillModal(skillKey);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openSkillModal(skillKey);
                }
            });
        });
    }
})();
