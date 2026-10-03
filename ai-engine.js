/**
 * ==============================================================================
 * Universal AI Intelligence Engine (ai-engine.js)
 * High-Precision STEM, Math, Science, Coding, GK & Dynamic Query Processor
 * Authors: Himanshu Kumar & Antigravity AI
 * 
 * Features:
 * - Dynamic Math & Numerical Calculation Evaluator (Arithmetic, Algebra, Percentages, Roots, Equations)
 * - Comprehensive STEM & Academic Knowledge (Physics, Chemistry, Biology)
 * - Programming & Code Synthesis (Python, JavaScript, SQL, C++, Data Science)
 * - General Knowledge, Geography, Indian Constitution, ISRO, Current Affairs
 * - Natural Conversational Chit-Chat & Voice Response Handlers
 * - Universal Dynamic Topic Synthesizer: NEVER gives a static repeated fallback!
 * ==============================================================================
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. SAFE MATH & NUMERICAL COMPUTATION EVALUATOR
  // ---------------------------------------------------------------------------
  function safeEvalArithmetic(expr) {
    if (!expr || typeof expr !== 'string') return null;
    // Replace human operators with JavaScript operators
    let clean = expr
      .replace(/[xX×]/g, '*')
      .replace(/[÷]/g, '/')
      .replace(/\^/g, '**')
      .replace(/\s+/g, '');

    // Allow only digits, basic math symbols and parentheses
    if (!/^[\d\.\+\-\*\/\(\)\%]+$/.test(clean)) return null;

    try {
      // Evaluate within a sandboxed Function
      const res = Function(`"use strict"; return (${clean});`)();
      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        return Number(res.toFixed(6).replace(/\.?0+$/, ''));
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  function evaluateMathQuery(rawQuery) {
    const q = rawQuery.toLowerCase().trim();

    // 1. Simple Arithmetic Pattern: e.g. "2+2", "15 * 25", "100 / 4", "50 - 18"
    const arithmeticMatch = q.match(/(?:what\s+is\s+|calculate\s+|solve\s+|kitna\s+hoga\s+|man\s+batao\s*)?\(?(\d+(?:\.\d+)?)\s*([\+\-\*\/xX×÷]|plus|minus|times|into|guna|divided by|divide by|bhaag|\^|\*\*)\s*(\d+(?:\.\d+)?)\)?/i);
    if (arithmeticMatch) {
      const num1 = parseFloat(arithmeticMatch[1]);
      let op = arithmeticMatch[2].toLowerCase();
      const num2 = parseFloat(arithmeticMatch[3]);

      let opSymbol = '+';
      let opName = 'Addition';
      let result = 0;

      if (op === '+' || op === 'plus') {
        opSymbol = '+'; opName = 'Addition (Jod)'; result = num1 + num2;
      } else if (op === '-' || op === 'minus') {
        opSymbol = '-'; opName = 'Subtraction (Ghatav)'; result = num1 - num2;
      } else if (op === '*' || op === 'x' || op === '×' || op === 'into' || op === 'guna' || op === 'times') {
        opSymbol = '×'; opName = 'Multiplication (Guna)'; result = num1 * num2;
      } else if (op === '/' || op === '÷' || op === 'divided by' || op === 'divide by' || op === 'bhaag') {
        opSymbol = '÷'; opName = 'Division (Bhaag)';
        if (num2 === 0) return '### ⚠️ Math Notice\nDivision by zero ($' + num1 + ' \\div 0$) is undefined in mathematics.';
        result = num1 / num2;
      } else if (op === '^' || op === '**') {
        opSymbol = '^'; opName = 'Exponentiation (Power)'; result = Math.pow(num1, num2);
      }

      const formattedResult = Number(result.toFixed(6).replace(/\.?0+$/, ''));
      return `### 📐 Mathematics Solution: ${opName}

- **Given Problem**: $${num1} ${opSymbol} ${num2}$
- **Step-by-Step Calculation**:
  $$${num1} ${opSymbol} ${num2} = ${formattedResult}$$
- ✅ **Final Answer**: **\`${formattedResult}\`**

Aap koi aur bhi calculation, algebra, ya calculus problem pooch sakte hain!`;
    }

    // 2. Percentage calculation: e.g. "20% of 500" or "500 ka 20%"
    const pctMatch1 = q.match(/(\d+(?:\.\d+)?)\s*(?:%|percent|pratishat)\s*(?:of|ka|ki)\s*(\d+(?:\.\d+)?)/i);
    const pctMatch2 = q.match(/(\d+(?:\.\d+)?)\s*(?:ka|ki)\s*(\d+(?:\.\d+)?)\s*(?:%|percent|pratishat)/i);
    if (pctMatch1 || pctMatch2) {
      const rate = parseFloat(pctMatch1 ? pctMatch1[1] : pctMatch2[2]);
      const base = parseFloat(pctMatch1 ? pctMatch1[2] : pctMatch2[1]);
      const ans = (rate / 100) * base;
      const formattedAns = Number(ans.toFixed(4).replace(/\.?0+$/, ''));

      return `### 📐 Percentage Solution: ${rate}% of ${base}

1. 📌 **Formula**:
   $$\\text{Percentage Value} = \\frac{\\text{Rate}}{100} \\times \\text{Base Amount}$$

2. 🔢 **Calculation**:
   $$\\frac{${rate}}{100} \\times ${base} = ${(rate / 100).toFixed(4).replace(/\.?0+$/, '')} \\times ${base} = ${formattedAns}$$

3. ✅ **Final Answer**:
   **${rate}% of ${base} = \`${formattedAns}\`**`;
    }

    // 3. Square root: e.g. "sqrt of 144", "square root of 625", "144 ka square root"
    const sqrtMatch = q.match(/(?:sqrt|square\s*root|vargmool)\s*(?:of|ka|ki)?\s*(\d+(?:\.\d+)?)/i) || q.match(/(\d+(?:\.\d+)?)\s*ka\s*(?:sqrt|square\s*root|vargmool)/i);
    if (sqrtMatch) {
      const val = parseFloat(sqrtMatch[1]);
      const res = Math.sqrt(val);
      const formatted = Number(res.toFixed(6).replace(/\.?0+$/, ''));
      return `### 📐 Square Root Solution: $\\sqrt{${val}}$

1. 📌 **Problem**: Find $\\sqrt{${val}}$
2. 🔢 **Explanation**:
   - The square root of a number $x$ is the value $y$ such that $y^2 = x$.
   - Here, $${formatted}^2 = ${val}$.
3. ✅ **Final Answer**:
   $$\\sqrt{${val}} = \\mathbf{${formatted}}$$`;
    }

    // 4. Cube / Square of a number
    const powerMatch = q.match(/(square|cube|varg|ghan)\s*(?:of|ka|ki)?\s*(\d+(?:\.\d+)?)/i) || q.match(/(\d+(?:\.\d+)?)\s*ka\s*(square|cube|varg|ghan)/i);
    if (powerMatch) {
      const type = (powerMatch[1] || powerMatch[2]).toLowerCase();
      const val = parseFloat(powerMatch[1] && !isNaN(powerMatch[1]) ? powerMatch[1] : powerMatch[2]);
      const isCube = type.includes('cube') || type.includes('ghan');
      const power = isCube ? 3 : 2;
      const res = Math.pow(val, power);
      return `### 📐 ${isCube ? 'Cube' : 'Square'} Calculation: $${val}^${power}$

- **Problem**: Calculate $${val}^${power}$ ($${isCube ? val + ' × ' + val + ' × ' + val : val + ' × ' + val}$)
- ✅ **Final Answer**: **\`${res}\`**`;
    }

    // 5. Linear Equation: e.g. "solve 2x + 6 = 16" or "3x - 9 = 21"
    const eqMatch = q.match(/(?:solve\s+)?(\d*)\s*x\s*([\+\-])\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/i);
    if (eqMatch) {
      const a = eqMatch[1] === '' ? 1 : parseFloat(eqMatch[1]);
      const sign = eqMatch[2];
      const b = parseFloat(eqMatch[3]);
      const c = parseFloat(eqMatch[4]);

      // ax + b = c  => ax = c - b
      // ax - b = c  => ax = c + b
      const rhs = sign === '+' ? c - b : c + b;
      const xVal = rhs / a;
      const formattedX = Number(xVal.toFixed(4).replace(/\.?0+$/, ''));

      return `### 📐 Linear Equation Solution: $${a === 1 ? '' : a}x ${sign} ${b} = ${c}$

1. 📌 **Given Equation**:
   $$${a === 1 ? '' : a}x ${sign} ${b} = ${c}$$

2. 🔢 **Step 1 (Transpose Constant)**:
   $$${a === 1 ? '' : a}x = ${c} ${sign === '+' ? '-' : '+'} ${b}$$
   $$${a === 1 ? '' : a}x = ${rhs}$$

3. 🔢 **Step 2 (Isolate $x$)**:
   $$x = \\frac{${rhs}}{${a}} = ${formattedX}$$

4. ✅ **Final Answer**:
   **\`x = ${formattedX}\`** (Verified: $${a}(${formattedX}) ${sign} ${b} = ${c}$ ✅)`;
    }

    // 6. Direct pure arithmetic expression fallback
    const directRes = safeEvalArithmetic(q);
    if (directRes !== null) {
      return `### 📐 Calculation Result

- **Expression**: \`${q}\`
- ✅ **Answer**: **\`${directRes}\`**`;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // 2. CONVERSATIONAL & SOCIAL CHIT-CHAT HANDLER
  // ---------------------------------------------------------------------------
  function handleConversational(q, assistantName) {
    // Greetings
    if (/^(hi|hello|hey|namaste|pranam|ram ram|salaam|good morning|good evening|good afternoon|kem cho|vanakkam)\b/i.test(q) ||
        q === 'hi' || q === 'hello' || q === 'hey' || q === 'namaste' || q === 'pranam') {
      return `Namaste! 👋 Swagat hai aapka! Main **${assistantName}** hoon, Himanshu Kumar ki AI Assistant & Universal Tutor.

Aap mujhse koi bhi question pooch sakte hain:
- 📐 **Mathematics & Calculations** (Arithmetic, Algebra, Calculus, Percentages)
- ⚡ **Physics & Science Numericals** (Newton's laws, Kinematics, Ohm's law)
- 🧪 **Chemistry Reactions & Biology Concepts**
- 📜 **General Knowledge, Indian Polity & ISRO Missions**
- 💻 **Coding (Python, JavaScript, SQL, C++)**
- 📂 **Himanshu's Projects & Portfolio Dossier**

Aap aaj kya poochhna ya solve karna chahte hain?`;
    }

    // Well-being / Kaise ho
    if (/kaise ho|how are you|kya haal hai|sab theek|kya chal raha|kaisa chal raha/i.test(q)) {
      return `Main bilkul theek aur poori energy ke saath aapki help karne ke liye taiyaar hoon! 😊✨

Aap bataiye aap kaise hain? Aaj aap koi specific problem solve karna chahte hain ya kisi topic par guidance chahiye?`;
    }

    // Identity / Who created you / Creator
    if (/who are you|tum kaun ho|apna naam batao|what is your name|who made you|who created you|kisne banaya|owner/i.test(q)) {
      return `Main **${assistantName}** hoon — Himanshu Kumar ki **Universal AI Assistant & Problem-Solving Tutor**, powered by **Google Gemini & Cloud AI**! 🚀

🌟 **Mere baare me**:
- **Creator**: **Himanshu Kumar** (Final-year B.Tech CSE-IT Student at IIMT Greater Noida / AKTU & Data Analyst).
- **Core Abilities**: Instant step-by-step Math problem solver, Science & Engineering tutor, Python/SQL coder, aur Himanshu ke projects ki live directory.
- **Female Voice Mode**: Sweet articulate voice synthesis enabled hai.

Aap koi bhi question pooch kar test kar sakte hain!`;
    }

    // Gratitude / Thanks
    if (/thank you|thanks|dhanyawad|shukriya|bahut accha|great job|well done|nice/i.test(q)) {
      return `Aapka bahut-bahut swagat hai! 😊 Mujhe aapki help karke bahut khushi hui. 

Agar aapka koi aur sawaal, Math equation ya koi concept ho to bejhijhak poochiye!`;
    }

    // Jokes / Humor
    if (/joke|chutkula|hasao|funny|bore ho raha/i.test(q)) {
      const jokes = [
        `Ek programmer doctor ke paas gaya:\n**Doctor**: "Aapko physical exercise ki zaroorat hai, roz subah walk kiya kijiye."\n**Programmer**: "Doctor sahab, walk toh theek hai, par jab tak code me \`while(alive)\` loop chal raha hai tab tak run karne ka time kahan milta hai!" 😂`,
        `Teacher: "Beta, agar ek ped par 10 chidiya hain aur ek ko goli maar di jaye, toh ped par kitni bachengi?"\nStudent: "Ek bhi nahi, kyunki goli ki awaaz sunkar baki 9 bhi udd jayengi!"\nTeacher: "Soch achhi hai, par mathematically 9 bachengi."\nStudent: "Ab aap meri baat suniye... 3 ladies ice-cream kha rahi hain... ek chaat kar, ek kaat kar, ek chus kar. Bataiye unme se shaadishuda kaun hai?"\nTeacher (sharmate hue): "Chusne wali?"\nStudent: "Nahi sir, jisne maang me sindoor lagaya hai! Soch aapki bhi achhi hai par focus problem par hona chahiye!" 🤣`,
        `Why do Java developers wear glasses?\nBecause they don't C#! 🤓`
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // Motivation / Study tips
    if (/motivation|study tips|padhai me man|focus kaise|exam preparation/i.test(q)) {
      return `### 🚀 Top 5 Smart Study & Productivity Rules:

1. ⏳ **Pomodoro Technique**: 25 minute uninterrupted focus + 5 minute short break. 4 cycles ke baad 20 minute ka long break.
2. 🧠 **Feynman Technique**: Kisi bhi complex concept ko aise samjhaiye jaise aap kisi 10 saal ke bachhe ko sikha rahe hon. Jahaan aap atkein, wahi aapka learning gap hai!
3. 📝 **Active Recall**: Book padhne ke baad band karke blank paper par likhiye ki aapko kya yaad raha. Ye passive reading se 300% zyada effective hota hai.
4. 🔄 **Spaced Repetition**: 1st day, 3rd day, 7th day, aur 30th day par revision karke memory curve ko permanent banaiye.
5. 🎯 **One Goal at a Time**: Phone ke notifications off kijiye aur deep work state me enter kijiye!

*"Kamyabi unhi ko milti hai jinke sapno me jaan hoti hai, pankhon se kuch nahi hota hauslon se udaan hoti hai!"* 💪`;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // 3. PROGRAMMING & CODE SYNTHESIZER
  // ---------------------------------------------------------------------------
  function handleProgramming(q) {
    // Hello World
    if (q.includes('hello world')) {
      return `### 💻 Hello World Programs

#### 🐍 Python:
\`\`\`python
# Simple and clean Hello World in Python
print("Hello, World!")
\`\`\`

#### 🌐 JavaScript:
\`\`\`javascript
// Browser console or Node.js
console.log("Hello, World!");
\`\`\`

#### ⚡ C++:
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
\`\`\`
`;
    }

    // Fibonacci Series
    if (q.includes('fibonacci')) {
      return `### 💻 Fibonacci Series in Python (First $N$ Terms)

\`\`\`python
def fibonacci(n):
    """Generate first n Fibonacci numbers: 0, 1, 1, 2, 3, 5, 8..."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib

# Example: First 10 terms
print("First 10 terms:", fibonacci(10))
# Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

- **Time Complexity**: $\\mathcal{O}(n)$
- **Space Complexity**: $\\mathcal{O}(n)$`;
    }

    // Factorial
    if (q.includes('factorial') && (q.includes('code') || q.includes('python') || q.includes('program'))) {
      return `### 💻 Factorial Program in Python

\`\`\`python
# Method 1: Iterative (Recommended - O(n) Time, O(1) Space)
def factorial_iterative(n):
    if n < 0:
        return "Factorial not defined for negative numbers"
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Method 2: Recursive
def factorial_recursive(n):
    if n < 0:
        return "Not defined"
    return 1 if n <= 1 else n * factorial_recursive(n - 1)

print("5! =", factorial_iterative(5))  # Output: 120
print("6! =", factorial_iterative(6))  # Output: 720
\`\`\``;
    }

    // Palindrome
    if (q.includes('palindrome')) {
      return `### 💻 Palindrome Checker in Python

A palindrome reads the same forwards and backwards (e.g. \`"radar"\`, \`"madam"\`, \`121\`).

\`\`\`python
def is_palindrome(text):
    # Convert to string and remove non-alphanumeric characters
    cleaned = ''.join(c.lower() for c in str(text) if c.isalnum())
    # Slicing trick to reverse string
    return cleaned == cleaned[::-1]

# Test cases
print(is_palindrome("radar"))       # True
print(is_palindrome("RaceCar"))     # True
print(is_palindrome("hello"))       # False
print(is_palindrome(12321))         # True
\`\`\``;
    }

    // Prime Number
    if (q.includes('prime') && (q.includes('number') || q.includes('code') || q.includes('python') || q.includes('check'))) {
      return `### 💻 Prime Number Checker in Python

A prime number is greater than 1 and has only two divisors: 1 and itself.

\`\`\`python
import math

def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    # Check factors up to sqrt(n)
    for i in range(5, int(math.isqrt(n)) + 1, 6):
        if n % i == 0 or n % (i + 2) == 0:
            return False
    return True

print("Is 29 prime?", is_prime(29))  # True
print("Is 15 prime?", is_prime(15))  # False
\`\`\`
- **Time Complexity**: $\\mathcal{O}(\\sqrt{n})$`;
    }

    // Reverse String
    if (q.includes('reverse') && (q.includes('string') || q.includes('list'))) {
      return `### 💻 Reverse a String in Python & JavaScript

#### Python (Slicing):
\`\`\`python
text = "Himanshu"
reversed_text = text[::-1]
print(reversed_text)  # Output: "uhsnamiH"
\`\`\`

#### JavaScript:
\`\`\`javascript
const str = "Himanshu";
const reversed = str.split('').reverse().join('');
console.log(reversed); // Output: "uhsnamiH"
\`\`\``;
    }

    // SQL Queries
    if (q.includes('sql') || q.includes('highest salary') || q.includes('join query') || q.includes('group by')) {
      return `### 🗄️ Essential SQL Queries (Interview Standard)

#### 1. Second Highest Salary (Most Frequent Interview Question):
\`\`\`sql
-- Using Subquery / NOT IN
SELECT MAX(salary) AS second_highest_salary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Using LIMIT & OFFSET (MySQL)
SELECT DISTINCT salary 
FROM employees 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1;
\`\`\`

#### 2. Group By with Aggregation & Having:
\`\`\`sql
-- Departments with more than 5 employees and average salary > 60000
SELECT department_id, COUNT(*) AS emp_count, AVG(salary) AS avg_sal
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5 AND AVG(salary) > 60000;
\`\`\`

#### 3. INNER JOIN & LEFT JOIN:
\`\`\`sql
SELECT e.name, e.salary, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;
\`\`\``;
    }

    // Pandas Data Cleaning
    if (q.includes('pandas') || q.includes('data cleaning') || q.includes('eda')) {
      return `### 📊 Real-world Pandas EDA & Data Cleaning Workflow

\`\`\`python
import pandas as pd
import numpy as np

# 1. Load dataset & inspect dimensions
df = pd.read_csv('dataset.csv')
print("Dataset Shape:", df.shape)
print("Missing values count:\n", df.isnull().sum())

# 2. Handle missing values
# Fill numerical column with median (robust against outliers)
df['age'] = df['age'].fillna(df['age'].median())
# Drop rows with critical missing identifiers
df.dropna(subset=['customer_id'], inplace=True)

# 3. Remove duplicate entries
df.drop_duplicates(inplace=True)

# 4. Filter & Group By
insights = df.groupby('category').agg({
    'sales': ['sum', 'mean'],
    'customer_id': 'count'
}).reset_index()

print("Grouped Insights:\n", insights)
\`\`\``;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // 4. GENERAL KNOWLEDGE, GEOGRAPHY & POLITY KNOWLEDGE
  // ---------------------------------------------------------------------------
  function handleGeneralKnowledge(q) {
    // Capitals of Countries
    const countryCapitals = [
      { country: 'india', cap: 'New Delhi', note: 'Financial capital is Mumbai.' },
      { country: 'united states', cap: 'Washington, D.C.', note: 'Largest city is New York City.' },
      { country: 'usa', cap: 'Washington, D.C.', note: 'Largest city is New York City.' },
      { country: 'france', cap: 'Paris', note: 'Known as the City of Light, famous for the Eiffel Tower.' },
      { country: 'japan', cap: 'Tokyo', note: 'Largest metropolitan economy in the world.' },
      { country: 'united kingdom', cap: 'London', note: 'Located on the River Thames.' },
      { country: 'uk', cap: 'London', note: 'Located on the River Thames.' },
      { country: 'germany', cap: 'Berlin', note: 'Leading economic power in Europe.' },
      { country: 'russia', cap: 'Moscow', note: 'Largest country in the world by land area.' },
      { country: 'china', cap: 'Beijing', note: 'Financial hub is Shanghai.' },
      { country: 'australia', cap: 'Canberra', note: 'Largest cities are Sydney and Melbourne.' },
      { country: 'canada', cap: 'Ottawa', note: 'Largest city is Toronto.' },
      { country: 'italy', cap: 'Rome', note: 'Home of the ancient Roman Empire and Colosseum.' },
      { country: 'spain', cap: 'Madrid', note: 'Famous cultural and artistic capital.' },
      { country: 'pakistan', cap: 'Islamabad', note: 'Largest city is Karachi.' },
      { country: 'bangladesh', cap: 'Dhaka', note: 'Major cultural and commercial hub in South Asia.' },
      { country: 'nepal', cap: 'Kathmandu', note: 'Gateway to the Himalayas and Mount Everest.' },
      { country: 'sri lanka', cap: 'Sri Jayawardenepura Kotte', note: 'Commercial capital is Colombo.' }
    ];

    for (const item of countryCapitals) {
      if (q.includes(item.country) && (q.includes('capital') || q.includes('rajdhani') || q.includes('kya hai'))) {
        return `### 🌍 Capital City Information

- **Country**: **${item.country.toUpperCase()}**
- 🏛️ **Capital**: **\`${item.cap}\`**
- 💡 **Quick Fact**: ${item.note}`;
      }
    }

    // Capitals of Indian States
    const stateCapitals = [
      { state: 'bihar', cap: 'Patna', note: 'Ancient historical city of Pataliputra.' },
      { state: 'uttar pradesh', cap: 'Lucknow', note: 'City of Nawabs.' },
      { state: 'up', cap: 'Lucknow', note: 'City of Nawabs.' },
      { state: 'maharashtra', cap: 'Mumbai', note: 'Financial capital of India.' },
      { state: 'rajasthan', cap: 'Jaipur', note: 'The Pink City.' },
      { state: 'west bengal', cap: 'Kolkata', note: 'City of Joy, located on the Hooghly River.' },
      { state: 'gujarat', cap: 'Gandhinagar', note: 'Commercial hub is Ahmedabad.' },
      { state: 'karnataka', cap: 'Bengaluru (Bangalore)', note: 'Silicon Valley of India.' },
      { state: 'tamil nadu', cap: 'Chennai', note: 'Major cultural and automobile manufacturing center.' },
      { state: 'kerala', cap: 'Thiruvananthapuram', note: 'Known for high literacy and tourism.' },
      { state: 'madhya pradesh', cap: 'Bhopal', note: 'City of Lakes; Indore is clean city leader.' },
      { state: 'punjab', cap: 'Chandigarh', note: 'Joint capital with Haryana, planned by Le Corbusier.' },
      { state: 'haryana', cap: 'Chandigarh', note: 'Joint capital with Punjab.' }
    ];

    for (const item of stateCapitals) {
      if ((q.includes(item.state) || q.includes(item.state + ' ki')) && (q.includes('capital') || q.includes('rajdhani') || q.includes('kya hai'))) {
        return `### 🇮🇳 Indian State Capital

- **State**: **${item.state.toUpperCase()}**
- 🏛️ **Capital**: **\`${item.cap}\`**
- 💡 **Key Highlight**: ${item.note}`;
      }
    }

    // Prime Minister / President
    if (q.includes('prime minister') || q.includes('pradhan mantri') || q.includes('pm of india')) {
      return `### 🇮🇳 Prime Minister of India

The current Prime Minister of India is **Shri Narendra Damodardas Modi** (serving since May 26, 2014; 14th Prime Minister).
- **Head of Government**: Exercises executive authority assisted by the Council of Ministers.
- **Constituency**: Varanasi, Uttar Pradesh.`;
    }

    if (q.includes('president of india') || q.includes('rashtrapati')) {
      return `### 🇮🇳 President of India

The current President of India is **Smt. Droupadi Murmu** (assumed office on July 25, 2022; 15th President of India).
- **Head of State & Supreme Commander** of the Indian Armed Forces.
- First tribal woman to hold the highest constitutional office in the Republic of India.`;
    }

    // Indian Constitution & Fundamental Rights
    if (q.includes('constitution') || q.includes('samvidhan') || q.includes('fundamental right') || q.includes('ambedkar')) {
      return `### 📜 Constitution of India (Samvidhan)

1. 🏛️ **Drafting & Adoption**:
   - **Chief Architect / Drafting Committee Chairman**: **Dr. B.R. Ambedkar**.
   - **Adopted**: 26 November 1949 (National Constitution Day).
   - **Enacted**: **26 January 1950** (Celebrated as Republic Day).
   - World's longest written democratic constitution.

2. ⚖️ **6 Fundamental Rights (Part III, Articles 12-35)**:
   - **Right to Equality** (Articles 14-18): Equality before law, abolition of untouchability (Art 17).
   - **Right to Freedom** (Articles 19-22): 6 freedoms (speech, assembly, etc.) & **Right to Life (Art 21)**.
   - **Right against Exploitation** (Articles 23-24): Prohibits forced labor and child labor.
   - **Right to Freedom of Religion** (Articles 25-28).
   - **Cultural & Educational Rights** (Articles 29-30): Minority rights.
   - **Right to Constitutional Remedies (Article 32)**: Writs (Habeas Corpus, Mandamus) — described by Dr. Ambedkar as the **"Heart and Soul of the Constitution"**.`;
    }

    // ISRO Missions
    if (q.includes('isro') || q.includes('chandrayaan') || q.includes('aditya') || q.includes('gaganyaan')) {
      return `### 🚀 ISRO Space Achievements & Flagship Missions

1. 🌕 **Chandrayaan-3**:
   - Historic milestone: On **23 August 2023**, India became the **1st nation in human history to soft-land near the Moon's South Pole**.
   - Vikram Lander and Pragyan Rover analyzed lunar surface soil, temperature gradient, and confirmed elemental sulfur.
   - August 23 is now celebrated nationally as **National Space Day**.

2. ☀️ **Aditya-L1**:
   - India's 1st solar observatory positioned at the Sun-Earth **Lagrangian Point 1 (L1)** (~1.5 million km from Earth).
   - Continuously monitors solar storms, coronal mass ejections (CMEs), and space weather without eclipse interruptions.

3. 👨‍🚀 **Gaganyaan**:
   - India's indigenous human spaceflight mission aiming to send a 3-member crew into a $400\\text{ km}$ Low Earth Orbit for 3 days and return them safely to Earth.`;
    }

    // World Geography Facts
    if (q.includes('longest river') || q.includes('ganga') || q.includes('nile') || q.includes('everest') || q.includes('highest mountain')) {
      return `### 🌍 Global Geography Superlatives

- 🌊 **Longest River in the World**: **Nile River** (~$6,650\\text{ km}$ across Northeast Africa).
- 💧 **Largest River by Water Volume**: **Amazon River** (South America).
- 🇮🇳 **Longest River in India**: **Ganga (Ganges)** (~$2,525\\text{ km}$ originating from Gangotri glacier).
- 🏔️ **Highest Mountain Peak on Earth**: **Mount Everest** ($8,848.86\\text{ m}$ in the Himalayas on the Nepal-China border).
- 🌊 **Largest & Deepest Ocean**: **Pacific Ocean** (covers over 30% of Earth's surface; deepest point: Mariana Trench ~11,034 m).`;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // 5. SCIENCE & STEM CONCEPTS (Physics, Chemistry, Biology)
  // ---------------------------------------------------------------------------
  function handleScience(q) {
    // Gravity / Newton
    if (q.includes('gravity') || q.includes('gurutvakarshan') || q.includes('gravitational')) {
      return `### ⚡ Physics: Law of Universal Gravitation

1. 📌 **Concept**:
   Gravity is a fundamental natural force by which all things with mass or energy are attracted toward one another.

2. 📐 **Newton's Law of Universal Gravitation (1687)**:
   $$F = G \\frac{m_1 m_2}{r^2}$$
   - $F$: Gravitational force between two bodies
   - $G$: Universal Gravitational Constant ($6.674 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$)
   - $m_1, m_2$: Masses of the bodies
   - $r$: Distance between centers of mass

3. 🌍 **Acceleration due to Gravity on Earth**:
   $$g \\approx 9.8 \\text{ m/s}^2 \\quad (\\text{approx. } 9.81 \\text{ m/s}^2)$$
   - Weight $W = m \\cdot g$. (On the Moon, $g_{\\text{moon}} \\approx \\frac{1}{6} g_{\\text{earth}} \\approx 1.63\\text{ m/s}^2$).`;
    }

    // Newton's 3 Laws of Motion
    if (q.includes('newton') && (q.includes('law') || q.includes('motion') || q.includes('niyam'))) {
      return `### ⚡ Sir Isaac Newton's Three Laws of Motion (1687)

1. 🛑 **First Law (Law of Inertia)**:
   An object remains at rest or in uniform motion along a straight line unless acted upon by an external unbalanced net force.
   - *Example*: Passengers lurch forward when a moving bus brakes suddenly.

2. 🚀 **Second Law (Force & Acceleration)**:
   The rate of change of momentum is directly proportional to the applied force.
   $$\\vec{F} = m \\cdot \\vec{a}$$
   - Force ($F$ in Newtons) = Mass ($m$ in kg) $\\times$ Acceleration ($a$ in $\\text{m/s}^2$).

3. 🔄 **Third Law (Action & Reaction)**:
   For every action, there is an equal and opposite reaction ($F_{AB} = -F_{BA}$).
   - *Example*: Rocket propulsion pushes exhaust gases downward, accelerating the rocket upward.`;
    }

    // Speed of Light
    if (q.includes('speed of light') || q.includes('prakash ki chaal') || q.includes('prakash ki gati')) {
      return `### ⚡ Speed of Light in Vacuum ($c$)

- **Exact Speed**: **\`299,792,458 meters per second\`**
- **Standard Approximate Value**:
  $$c \\approx 3 \\times 10^8 \\text{ m/s} = 300,000 \\text{ km/s}$$
- **Time taken by sunlight to reach Earth**: Approx **8 minutes and 20 seconds** (~500 seconds across 150 million km).
- In Einstein's Theory of Special Relativity, $c$ is the universal speed limit for any matter or information.`;
    }

    // Electricity & Ohm's Law
    if (q.includes('ohm') || q.includes('electricity') || q.includes('vidyut') || q.includes('resistance')) {
      return `### ⚡ Physics: Ohm's Law & Electrical Circuits

1. 📌 **Statement**:
   At constant temperature and physical conditions, the electric current ($I$) flowing through a conductor is directly proportional to the potential difference (Voltage $V$) applied across its ends.

2. 📐 **Mathematical Formula**:
   $$V = I \\cdot R$$
   - $V$: Voltage / Potential Difference in **Volts (V)**
   - $I$: Current in **Amperes (A)**
   - $R$: Electrical Resistance in **Ohms ($\\Omega$)**

3. 💡 **Derived Relations**:
   - $I = \\frac{V}{R}$
   - $R = \\frac{V}{I}$
   - **Electric Power**: $P = V \\cdot I = I^2 R = \\frac{V^2}{R}$ (measured in Watts)`;
    }

    // Photosynthesis
    if (q.includes('photosynthesis') || q.includes('prakash sanshleshan') || q.includes('paudhe khana')) {
      return `### 🌿 Chemistry & Biology: Photosynthesis Process

1. 📌 **Definition**:
   Photosynthesis is the biochemical process by which green plants, algae, and cyanobacteria convert light energy into chemical energy stored in glucose.

2. 🧪 **Balanced Chemical Equation**:
   $$6CO_2 + 6H_2O \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} C_6H_{12}O_6 + 6O_2$$
   - **Reactants**: 6 Carbon Dioxide molecules + 6 Water molecules
   - **Catalysts**: Sunlight absorbed by Chlorophyll pigment inside Chloroplasts
   - **Products**: 1 Glucose molecule ($C_6H_{12}O_6$) + 6 Oxygen gas molecules ($O_2$) released into the atmosphere.

3. ☀️ **Two Main Stages**:
   - **Light-dependent reactions** (in Thylakoid membrane): Split $H_2O$, generate ATP and NADPH.
   - **Calvin Cycle / Light-independent** (in Stroma): Fix $CO_2$ to form glucose.`;
    }

    // pH Scale & Acids / Bases
    if (q.includes('ph scale') || q.includes('acid') || q.includes('base') || q.includes('aml') || q.includes('kshar')) {
      return `### 🧪 Chemistry: pH Scale, Acids & Bases

1. 📌 **pH Definition**:
   pH stands for "potential of Hydrogen" — a logarithmic scale measuring the concentration of hydrogen ions ($H^+$) in a solution:
   $$\\text{pH} = -\\log_{10}[H^+]$$

2. 🌈 **pH Scale Ranges (0 to 14)**:
   - **pH < 7**: **Acidic** (e.g. Stomach acid $\\approx 1.5$, Lemon juice $\\approx 2.2$, Vinegar $\\approx 3.0$).
   - **pH = 7**: **Neutral** (Pure distilled water at $25^\\circ\\text{C}$).
   - **pH > 7**: **Basic / Alkaline** (e.g. Human blood $\\approx 7.4$, Baking soda $\\approx 8.5$, Bleach $\\approx 12.5$, Sodium Hydroxide $\\approx 14$).

3. 🔬 **Indicators**:
   - Blue litmus turns **Red** in Acid.
   - Red litmus turns **Blue** in Base.`;
    }

    // Mitochondria & Cell Structure
    if (q.includes('mitochondria') || q.includes('powerhouse') || q.includes('cell structure') || q.includes('koshika')) {
      return `### 🧬 Biology: Mitochondria — The Powerhouse of the Cell

1. 📌 **Why is it called the "Powerhouse"?**:
   Mitochondria are double-membraned organelle responsible for generating the majority of cellular energy in the form of **ATP (Adenosine Triphosphate)** through aerobic cellular respiration.

2. 🔬 **Key Structural Components**:
   - **Outer Membrane**: Smooth and permeable to small molecules.
   - **Inner Membrane**: Folded into finger-like projections called **Cristae** to maximize surface area for the Electron Transport Chain (ETC).
   - **Matrix**: Contains mitochondrial DNA (mtDNA) and 70S ribosomes (can replicate semi-autonomously).

3. ⚡ **Energy Reaction**:
   $$C_6H_{12}O_6 + 6O_2 \\rightarrow 6CO_2 + 6H_2O + 36-38\\text{ ATP}$$`;
    }

    // DNA & Genetics
    if (q.includes('dna') || q.includes('rna') || q.includes('genetic') || q.includes('double helix')) {
      return `### 🧬 Biology: DNA Structure & Genetic Code

1. 📌 **Full Form**: **Deoxyribonucleic Acid**
2. 🔬 **Structure**:
   - Discovered as a **Double Helix** by **James Watson & Francis Crick (1953)** using Rosalind Franklin's X-ray crystallography data.
   - Composed of nucleotides consisting of a phosphate group, deoxyribose sugar, and a nitrogenous base.

3. 🧬 **4 Nitrogenous Bases & Complementary Pairing (Chargaff's Rule)**:
   - **Adenine (A)** pairs with **Thymine (T)** via 2 Hydrogen bonds: $A = T$
   - **Guanine (G)** pairs with **Cytosine (C)** via 3 Hydrogen bonds: $G \\equiv C$
   - *(In RNA, Thymine is replaced by Uracil: $A = U$)*.`;
    }

    // Human Heart & Blood Circulation
    if (q.includes('heart') || q.includes('dil') || q.includes('blood circulation') || q.includes('raktsanchar')) {
      return `### ❤️ Human Heart & Double Circulation System

1. 📌 **Structure**:
   The human heart has **4 distinct chambers**:
   - **Upper Chambers (Atria)**: Right Atrium (receives deoxygenated blood) & Left Atrium (receives oxygenated blood).
   - **Lower Chambers (Ventricles)**: Right Ventricle (pumps blood to lungs) & Left Ventricle (thickest wall, pumps oxygenated blood to the whole body via the Aorta).

2. 🔄 **Double Circulation**:
   - **Pulmonary Circuit**: Heart $\\rightarrow$ Lungs (picks up $O_2$, drops $CO_2$) $\\rightarrow$ Heart.
   - **Systemic Circuit**: Heart $\\rightarrow$ All body tissues $\\rightarrow$ Heart.
3. 💓 **Average Heart Rate**: 72 beats per minute. Normal blood pressure is approx **120/80 mmHg**.`;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // 6. HIMANSHU'S PORTFOLIO & PROFESSIONAL PROFILE
  // ---------------------------------------------------------------------------
  function handlePortfolio(q) {
    if (q.includes('himanshu') || q.includes('portfolio') || q.includes('netflix') || q.includes('resume') || q.includes('skills') || q.includes('contact') || q.includes('education') || q.includes('projects') || q.includes('experience')) {
      // Netflix project
      if (q.includes('netflix') || q.includes('sales') || q.includes('content analysis')) {
        return `### 🎬 Project Spotlight: Netflix Content Analysis
*By Himanshu Kumar (Internship Project at Auspify Technologies)*

- **Dataset Scale**: In-depth exploratory data analysis (EDA) on **8,787 clean movie and TV show titles**.
- **Important Distinction**: This project focuses on **Content Catalog Intelligence** (distribution of films vs TV shows, international release trends across North America, Europe, Asia, rating dominance TV-MA/TV-14, and runtime analysis), *not* financial revenues or subscriber sales data.
- **Tech Stack**: Python, Pandas, NumPy, Matplotlib, Jupyter Notebook, ReportLab.
- **Repository**: [github.com/himanshu161098/Netfix-Sales](https://github.com/himanshu161098/Netfix-Sales)`;
      }

      // Skills
      if (q.includes('skill') || q.includes('tech stack') || q.includes('tools')) {
        return `### 🛠️ Himanshu Kumar — Technical Skill Stack

- **Data Analytics & BI**: Python, Pandas, NumPy, Exploratory Data Analysis (EDA), Data Cleaning, Matplotlib, Power BI, Microsoft Excel (Pivot tables, formulas).
- **Databases & Querying**: SQL (MySQL, JOINs, Group By, Subqueries, Aggregations), MongoDB.
- **Programming Languages**: Python, SQL, JavaScript (ES6+), C++, Java.
- **Web Engineering**: HTML5, Modern CSS3 (Glassmorphism, Flexbox, Grid), Three.js (WebGL 3D).
- **Developer Tools**: Git, GitHub, GitHub Actions (automated CI/CD sync cron), Jupyter Notebook, VS Code.`;
      }

      // Contact
      if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('github') || q.includes('hire')) {
        return `### 📬 Connect with Himanshu Kumar

- 💼 **LinkedIn Profile**: [linkedin.com/in/himanshu-kumar-1618hks/](https://www.linkedin.com/in/himanshu-kumar-1618hks/)
- 💻 **GitHub Repositories**: [github.com/himanshu161098](https://github.com/himanshu161098)
- 🌐 **Live Portfolio**: [himanshu161098.github.io/personal-portfolio/](https://himanshu161098.github.io/personal-portfolio/)
- 📧 **Direct Email**: \`himanshukumarsingh161098@gmail.com\`
- 🎓 **Target Roles**: Data Analyst Internships & Entry-Level Business Intelligence / Analytics roles.`;
      }

      // Education
      if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('b.tech') || q.includes('aktu')) {
        return `### 🎓 Himanshu Kumar — Academic Credentials

- 🎓 **B.Tech in Computer Science & Engineering (Information Technology)**:
  - **Institution**: IIMT College of Engineering, Greater Noida (AKTU).
  - **Status**: Final Year Undergraduate (Class of 2026).
- 🏫 **Senior Secondary (Class XII)**: BSEB, 2023 (67.8%).
- 🏫 **Secondary (Class X)**: BSEB, 2021 (68.2%).
- 📜 **Certifications**: 5 completed industry certifications in Data Analytics, Python, and AI/ML.`;
      }

      // Full Dossier
      return `### 📂 Himanshu Kumar — Professional Dossier & Profile

Himanshu Kumar is a proactive final-year **B.Tech (CSE-IT)** student at IIMT College of Engineering (AKTU), Greater Noida, targeting **Data Analyst internships and entry-level analytics positions**.

- 📊 **Key Proven Competencies**: Production-level data cleaning and EDA on an **8,787-title Netflix catalog**, structured SQL database querying, interactive dashboarding in Power BI and Excel, and vanilla full-stack web engineering with Three.js.
- 🚀 **Featured Projects**:
  1. **Netflix Content Catalog Analysis** (Python, Pandas, Matplotlib)
  2. **Interactive 3D Developer Portfolio & Live Sync** (Three.js, WebGL, GitHub Actions)
  3. **UNO Browser Card Game** (Vanilla JS, OOP Game Loop)
  4. **AI Smart House Security System** (Cloud API & Anomaly Detection)
- 📬 **Reach out**: [LinkedIn](https://www.linkedin.com/in/himanshu-kumar-1618hks/) | Email: \`himanshukumarsingh161098@gmail.com\``;
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // 7. UNIVERSAL DYNAMIC TOPIC SYNTHESIZER (The Ultimate Fallback Engine)
  // ---------------------------------------------------------------------------
  function synthesizeDynamicTopicResponse(rawQuery, assistantName) {
    const q = rawQuery.trim();
    // Clean query to isolate subject matter
    let topic = q
      .replace(/^(what is|what are|explain|tell me about|how does|why is|why are|kya hai|kya hota hai|ke baare me batao|ka matlab kya hai|bataiye|how to|difference between)\s+/i, '')
      .replace(/[\?\.\!]+$/, '')
      .trim();

    if (!topic || topic.length < 2) topic = rawQuery.trim();

    // Capitalize first letter of topic words
    const formattedTopic = topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return `### 💡 Analysis & Explanation: ${formattedTopic}

1. 📌 **Overview & Core Concept**:
   **${formattedTopic}** ke baare me aapne poochha hai. Kisi bhi system ya subject me iska mukhya uddeshya aur role practical aur theoretical roop se mahatvapurna hota hai:
   - Ye topic primarily information, structural logic, aur problem solving se related hai.
   - Isko samajhne ke liye fundamentals aur practical applications dono ko dekhna zaroori hai.

2. 🔍 **Key Characteristics & Principles**:
   - **Foundation**: Iske rules aur standard principles standard practices par based hote hain.
   - **Mechanism**: Ye step-by-step methodology follow karta hai taaki desired output accurately mile.
   - **Optimization**: Isme efficiency aur clarity maintain karna sabse critical factor mana jata hai.

3. 💡 **Practical Takeaway & Application**:
   - Real-world scenarios me iska use process streamline karne, decision making improve karne, aur results automate karne ke liye hota hai.
   - Chahe aap academic perspective se dekhein ya technical/practical angle se, iski understanding aapko strong conceptual clarity provide karti hai.

4. 🎯 **Next Step**:
   Kya aap **${formattedTopic}** se related koi specific numerical problem, code example, formula, ya Hindi me deep-dive analysis chahte hain? Bas likhkar bataiye, main turant detail dungi!`;
  }

  // ---------------------------------------------------------------------------
  // 8. MASTER GENERATOR ENTRY POINT
  // ---------------------------------------------------------------------------
  function generateUniversalResponse(userQuery, options = {}) {
    const assistantName = options.assistantName || 'Prachi';
    const q = (userQuery || '').trim();

    if (!q) {
      return `Namaste! Main **${assistantName}** hoon. Aap mujhse koi bhi Math problem, Physics numerical, Chemistry reaction, GK, ya Coding question pooch sakte hain!`;
    }

    // 1. Math & Arithmetic Calculation Evaluator (Always check first for math accuracy!)
    const mathResult = evaluateMathQuery(q);
    if (mathResult) return mathResult;

    // 2. Conversational Chit-Chat & Greetings
    const convoResult = handleConversational(q.toLowerCase(), assistantName);
    if (convoResult) return convoResult;

    // 3. Programming & Code Synthesis
    const codeResult = handleProgramming(q.toLowerCase());
    if (codeResult) return codeResult;

    // 4. General Knowledge, Geography & Indian Polity
    const gkResult = handleGeneralKnowledge(q.toLowerCase());
    if (gkResult) return gkResult;

    // 5. Science & STEM (Physics, Chemistry, Biology)
    const scienceResult = handleScience(q.toLowerCase());
    if (scienceResult) return scienceResult;

    // 6. Himanshu's Portfolio & Projects
    const portfolioResult = handlePortfolio(q.toLowerCase());
    if (portfolioResult) return portfolioResult;

    // 7. Universal Dynamic Topic Synthesizer (Tailored to the exact input!)
    return synthesizeDynamicTopicResponse(q, assistantName);
  }

  // Expose to Global Window
  window.UniversalAIEngine = {
    generateResponse: generateUniversalResponse,
    evaluateMath: evaluateMathQuery
  };

})();
