import { Opportunity, StudentProfile, Roadmap } from '../types';

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-reliance',
    title: 'Reliance Foundation Undergraduate Scholarship',
    organization: 'Reliance Foundation',
    type: 'scholarship',
    description: 'Merit-cum-means scholarship supporting up to 5,000 meritorious undergraduate students across India to continue their higher education without financial burden.',
    eligibility_text: '1st year full-time undergraduate students from any stream. Annual household income less than ₹15 Lakhs (priority given to < ₹2.5 Lakhs). Minimum 60% in Class 12th.',
    eligible_years: ['1st Year'],
    eligible_branches: ['All'],
    stipend_or_amount: 'Up to ₹2,00,000 over degree duration',
    deadline: '2026-10-31',
    link: 'https://www.scholarships.reliancefoundation.org',
    tags: ['scholarship', 'financial-aid', '1st-year', 'merit-cum-means'],
    is_featured: true,
    apply_steps: [
      'Online application portal par registration karein.',
      '12th marksheet, income certificate aur college bonafide upload karein.',
      'Aptitude test link email par aayega (Basic Mental Ability + English).',
      'Final selection list announce hoti hai.'
    ]
  },
  {
    id: 'opp-amazon-ml',
    title: 'Amazon ML Summer School 2026',
    organization: 'Amazon India',
    type: 'campus_program',
    description: 'An intensive virtual training program covering key machine learning topics from Amazon scientists, preparing students for careers in cutting-edge AI and Machine Learning.',
    eligibility_text: 'Pre-final and 2nd year engineering students (B.Tech/M.Tech). Basic knowledge of Python and Linear Algebra.',
    eligible_years: ['2nd Year', '3rd Year'],
    eligible_branches: ['CSE', 'IT', 'EEE', 'ECE', 'AI/DS'],
    stipend_or_amount: 'Free Certified Mentorship by Amazon Scientists',
    deadline: '2026-06-20',
    link: 'https://amazonmlsummerschoolindia.splashthat.com',
    tags: ['machine-learning', 'python', 'amazon', 'ai'],
    is_featured: false,
    apply_steps: [
      'Amazon campus events portal par form fill karein.',
      'Online assessment test de (Python programming + Math/Stats questions).',
      'Shortlisted students attend 8 weekend masterclasses with Amazon Scientists.',
      'Completion certificate aur potential interview opportunities milti hain.'
    ]
  },
  {
    id: 'opp-sih',
    title: 'Smart India Hackathon (SIH) 2026 - Software Edition',
    organization: 'Ministry of Education, Govt. of India',
    type: 'hackathon',
    description: 'India\'s largest nationwide hackathon where students solve real-world problem statements posed by various government ministries and leading private industries.',
    eligibility_text: 'Team of 6 regular college students with at least 1 female teammate. College SPOC nomination required.',
    eligible_years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    eligible_branches: ['All'],
    stipend_or_amount: '₹1,00,000 Cash Prize per Problem Statement',
    deadline: '2026-08-30',
    link: 'https://sih.gov.in',
    tags: ['hackathon', 'government', 'innovation', 'national'],
    is_featured: false,
    apply_steps: [
      'Apne college me 6 students ki team banayein (1 female member compulsory).',
      'SIH portal se Ministry ke problem statement select karein.',
      'College internal hackathon me PPT present karein aur SPOC se nomination lein.',
      'National round ke liye Grand Finale me 36-hour code sprint participate karein.'
    ]
  },
  {
    id: 'opp-microsoft-mlsa',
    title: 'Microsoft Learn Student Ambassador (MLSA)',
    organization: 'Microsoft',
    type: 'campus_program',
    description: 'A global community of student leaders who want to lead technical workshops, build local developer communities, and master Azure cloud and modern tech.',
    eligibility_text: 'Enrolled students of any college year or branch with passion for technology and community building.',
    eligible_years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    eligible_branches: ['All'],
    stipend_or_amount: '$150/mo Azure Credits + Free LinkedIn Learning + Swag',
    deadline: '2026-11-30',
    link: 'https://studentambassadors.microsoft.com',
    tags: ['leadership', 'microsoft', 'community', 'cloud', 'azure'],
    is_featured: false,
    apply_steps: [
      'Student Ambassadors website par application form open karein.',
      '2-minute YouTube unlisted video banayein: "Aap technology kaise teach karenge?".',
      'Review complete hone par Welcome email aayega aur Alpha ambassador badge milega.',
      'Campus workshops host karein aur Beta/Gold tier upgrade karein.'
    ]
  },
  {
    id: 'opp-adobe-wit',
    title: 'Adobe India Women-in-Technology Scholarship',
    organization: 'Adobe',
    type: 'scholarship',
    description: 'Recognizing outstanding female undergraduate and master students in tech with tuition grants, direct internship opportunities, and mentorship from senior Adobe leaders.',
    eligibility_text: 'Female students in 3rd or 4th year B.Tech/B.E in computer science or related branches with consistent academic record.',
    eligible_years: ['3rd Year', '4th Year'],
    eligible_branches: ['CSE', 'IT', 'ECE'],
    stipend_or_amount: 'Full Tuition Fee Grant + Summer Internship',
    deadline: '2026-09-15',
    link: 'https://www.adobe.com/in/careers/university.html',
    tags: ['women-in-tech', 'scholarship', 'internship', 'adobe'],
    is_featured: false,
    apply_steps: [
      'Resume aur college academic transcripts arrange karein.',
      'Statement of Purpose (SOP) aur essay answers likhein.',
      'Technical project GitHub links aur recommendations submit karein.',
      'Interview round ke baad final scholarship award hoti hai.'
    ]
  },
  {
    id: 'opp-flipkart-grid',
    title: 'Flipkart GRiD 7.0 Software Development Track',
    organization: 'Flipkart',
    type: 'hackathon',
    description: 'Flipkart\'s flagship campus challenge designed to test your coding prowess, problem solving, and system design with direct PPI (Pre-Placement Interview) opportunities.',
    eligibility_text: '2nd, 3rd, and 4th year B.Tech/Dual degree students from any recognized Indian college.',
    eligible_years: ['2nd Year', '3rd Year', '4th Year'],
    eligible_branches: ['All'],
    stipend_or_amount: '₹5,00,000 Prize Pool + SDE PPI Offers (₹32 LPA+)',
    deadline: '2026-07-15',
    link: 'https://unstop.com/competitions/flipkart-grid',
    tags: ['dsa', 'hackathon', 'flipkart', 'ppi', 'placements'],
    is_featured: false,
    apply_steps: [
      'Unstop par 2-3 members ki team register karein.',
      'Round 1: E-Commerce & CS fundamentals online quiz qualify karein.',
      'Round 2: Algorithmic coding sprint solve karein.',
      'Round 3: Detailed prototype submission aur Flipkart leadership ko presentation.'
    ]
  },
  {
    id: 'opp-cisco-aicte',
    title: 'Cisco Virtual Internship Program 2026',
    organization: 'Cisco Networking Academy & AICTE',
    type: 'internship',
    description: 'Official national internship program powered by Cisco and AICTE offering students foundational hands-on training in Networking, Cybersecurity, and Python.',
    eligibility_text: '2nd and 3rd year engineering students. Free enrollment through AICTE Internship Portal.',
    eligible_years: ['2nd Year', '3rd Year'],
    eligible_branches: ['CSE', 'IT', 'ECE', 'EEE'],
    stipend_or_amount: 'AICTE-recognized Virtual Internship Certificate',
    deadline: '2026-05-30',
    link: 'https://internship.aicte-india.org',
    tags: ['networking', 'cybersecurity', 'aicte', 'cisco'],
    is_featured: false,
    apply_steps: [
      'AICTE Internship portal par student account banayein.',
      'Cisco NetAcad course enroll karke modules complete karein.',
      'Packet Tracer lab simulation submission karein.',
      'Final assessment clear karke official certificate download karein.'
    ]
  },
  {
    id: 'opp-isro-internship',
    title: 'ISRO Student Internship & Project Scheme',
    organization: 'Indian Space Research Organisation',
    type: 'internship',
    description: 'Opportunity for core engineering students to undertake live technical projects and research work at ISRO centers like VSSC, URSC, and SAC under senior space scientists.',
    eligibility_text: 'Minimum 60% aggregate in 3rd or 4th year B.Tech. Formal recommendation and NoC from College Head of Department required.',
    eligible_years: ['3rd Year', '4th Year'],
    eligible_branches: ['ECE', 'EEE', 'MECH', 'CSE', 'Civil'],
    stipend_or_amount: 'Premier Govt. Research Experience + Lab Access',
    deadline: '2026-04-30',
    link: 'https://www.isro.gov.in/Careers.html',
    tags: ['research', 'space', 'core-engineering', 'government'],
    is_featured: false,
    apply_steps: [
      'College HoD se formal Bonafide aur NoC letter sign karwayein.',
      'ISRO portal par branch-relevant center select karke application bhejein.',
      'Faculty guide aur project topic approval ka wait karein.',
      'Onsite center reporting karke research work start karein.'
    ]
  },
  {
    id: 'opp-github-campus',
    title: 'GitHub Campus Expert Program',
    organization: 'GitHub Education',
    type: 'campus_program',
    description: 'Training program for student leaders to build inclusive tech communities, learn public speaking, organize hackathons, and master Git/GitHub collaboration tools.',
    eligibility_text: 'Enrolled university student with an active GitHub profile and passion for mentoring fellow college students.',
    eligible_years: ['1st Year', '2nd Year', '3rd Year'],
    eligible_branches: ['All'],
    stipend_or_amount: 'Hackathon Swag Boxes + Event Funding Grants',
    deadline: '2026-08-15',
    link: 'https://education.github.com/experts',
    tags: ['git', 'github', 'community', 'leadership'],
    is_featured: false,
    apply_steps: [
      'GitHub Student Developer Pack activate karein.',
      'Campus Expert application form me community analysis answers likhein.',
      'Selection hone par 6-week online training modules complete karein.',
      'Campus workshops host karein with official GitHub sponsorship.'
    ]
  },
  {
    id: 'opp-nsp-postmatric',
    title: 'National Scholarship Portal (NSP) Post-Matric Scheme',
    organization: 'Ministry of Social Justice & Empowerment, Govt. of India',
    type: 'scholarship',
    description: 'Government of India central financial assistance scheme for students pursuing undergraduate professional and technical degrees in recognized universities.',
    eligibility_text: 'Enrolled in recognized degree college. Annual family income below ₹2.5 Lakhs. Minimum 50% in previous qualifying exam.',
    eligible_years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    eligible_branches: ['All'],
    stipend_or_amount: '₹30,000 - ₹50,000/year (Course fee + maintenance)',
    deadline: '2026-12-31',
    link: 'https://scholarships.gov.in',
    tags: ['government', 'nsp', 'financial-aid', 'scholarship'],
    is_featured: false,
    apply_steps: [
      'scholarships.gov.in par Aadhaar-linked OTR registration karein.',
      'Income Certificate, Caste Certificate (if applicable), aur Fee receipt upload karein.',
      'College Nodal Officer se application verify karwayein.',
      'Amount direct bank account (DBT) me transfer hoti hai.'
    ]
  },
  {
    id: 'opp-google-generation',
    title: 'Google Generation Scholarship (APAC Region)',
    organization: 'Google',
    type: 'scholarship',
    description: 'Awarded to women students in computer science who demonstrate strong academic performance, technical passion, and commitment to diversity and community inclusion.',
    eligibility_text: 'Female students enrolled in 1st or 2nd year undergraduate degree in Computer Science, Computer Engineering, or related technical field.',
    eligible_years: ['1st Year', '2nd Year'],
    eligible_branches: ['CSE', 'IT', 'ECE'],
    stipend_or_amount: '$2,500 USD (~₹2,10,000) Direct Tuition Grant',
    deadline: '2026-05-10',
    link: 'https://buildyourfuture.withgoogle.com/scholarships',
    tags: ['women-in-tech', 'google', 'scholarship', 'merit'],
    is_featured: false,
    apply_steps: [
      'Resume aur latest academic transcripts tayyar karein.',
      '3 reflective essay questions likhein (Diversity impact & leadership).',
      'Technical coding portfolio ya project links attach karein.',
      'Shortlist hone par Google team ke sath virtual interview.'
    ]
  },
  {
    id: 'opp-tata-fellowship',
    title: 'Tata Building India Leadership & Essay Fellowship',
    organization: 'Tata Group',
    type: 'fellowship',
    description: 'National level initiative encouraging young minds from colleges across India to express their thoughts on nation building, sustainable tech, and ethical leadership.',
    eligibility_text: 'Undergraduate students of all branches and years enrolled in regular colleges across India.',
    eligible_years: ['All'],
    eligible_branches: ['All'],
    stipend_or_amount: '₹50,000 Cash Prize + Rashtrapati Bhavan Visit',
    deadline: '2026-11-15',
    link: 'https://tatabuildingindia.com',
    tags: ['leadership', 'essay', 'fellowship', 'tata'],
    is_featured: false,
    apply_steps: [
      'College level competition me participate karein.',
      'Selected topic par 800 words essay submit karein in English or Hindi.',
      'City round and National round evaluation pass karein.',
      'Grand felicitation with Tata leaders in New Delhi.'
    ]
  },
  {
    id: 'opp-iitb-internship',
    title: 'IIT Bombay Summer Research Fellowship (SURF)',
    organization: 'IIT Bombay',
    type: 'internship',
    description: 'Prestigious 8-week summer internship where undergraduate students collaborate closely with IIT Bombay professors and PhD scholars on cutting-edge research labs.',
    eligibility_text: '2nd and 3rd year engineering students with strong academic record (typically top 10% of batch).',
    eligible_years: ['2nd Year', '3rd Year'],
    eligible_branches: ['CSE', 'MECH', 'EEE', 'Civil', 'ECE'],
    stipend_or_amount: '₹15,000/month Stipend + IIT Campus Accommodation',
    deadline: '2026-03-30',
    link: 'https://www.iitb.ac.in',
    tags: ['research', 'iit', 'internship', 'summer'],
    is_featured: false,
    apply_steps: [
      'IIT Bombay department faculty profiles research areas dekhein.',
      'Statement of Purpose (SOP) aur 2 recommendation letters submit karein.',
      'Faculty selection review ke baad official invitation letter aayega.',
      'May se July onsite lab project work execute karein.'
    ]
  },
  {
    id: 'opp-hackon-amazon',
    title: 'HackOn with Amazon 4.0 Hackathon',
    organization: 'Amazon',
    type: 'hackathon',
    description: 'Nationwide engineering challenge empowering students to build customer-obsessed scalable solutions using Cloud, AI, and distributed systems.',
    eligibility_text: '3rd and 4th year B.Tech, M.Tech, and MCA students across all Indian engineering colleges.',
    eligible_years: ['3rd Year', '4th Year'],
    eligible_branches: ['All'],
    stipend_or_amount: '₹3,50,000 Cash + Direct Amazon Interview Calls',
    deadline: '2026-07-30',
    link: 'https://unstop.com',
    tags: ['hackathon', 'amazon', 'cloud', 'placements'],
    is_featured: false,
    apply_steps: [
      'Unstop par 2-4 members ki team register karein.',
      'MCQ Technical Round pass karein.',
      'Idea Prototype submission round clear karein.',
      'Grand Finale me Amazon leaders ke samne demo karein.'
    ]
  }
];

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  id: 'student-demo',
  name: 'Amit Sharma',
  year: '2nd Year',
  branch: 'EEE',
  college: 'Ajay Kumar Garg Engineering College (AKGEC)',
  city: 'Ghaziabad',
  skills: ['C++', 'Basics of DSA', 'Circuit Simulation'],
  interests: ['Software Placements', 'Internships', 'Open Source'],
  preferredLanguage: 'hinglish',
  targetGoal: 'DSA for Campus Placements'
};

export const SAMPLE_ROADMAPS: Record<string, Roadmap> = {
  'dsa-placements': {
    id: 'rm-dsa',
    title: 'DSA Foundation Blueprint (6 Weeks)',
    targetGoal: 'Campus Placement Readiness for Tier-2/3 Colleges',
    totalWeeks: 6,
    completedTasks: ['1-0', '1-1'],
    weeks: [
      {
        week_number: 1,
        theme: 'Language Syntax, STL / Collections & Big-O Notation',
        topics: ['C++ STL Vectors/Maps or Java Collections', 'Time & Space Complexity Basics', 'Array Traversal & In-Place Reversal'],
        tasks: [
          'Solve "Two Sum" and "Find Maximum Subarray" on LeetCode.',
          'Implement Big-O analysis for nested loops and recursive calls.',
          'Practice STL map and unordered_set operations.'
        ],
        resources: [
          { title: "Striver's A2Z Sheet - Step 1", url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2' },
          { title: "Love Babbar Time Complexity Lecture", url: 'https://youtube.com' }
        ]
      },
      {
        week_number: 2,
        theme: 'Two Pointers, Sliding Window & Prefix Sums',
        topics: ['Container With Most Water', 'Trapping Rain Water', 'Longest Substring Without Repeating Characters'],
        tasks: [
          'Solve 5 medium sliding window questions on GeeksforGeeks.',
          'Implement cumulative frequency array technique for sub-queries.',
          'Review edge cases: empty strings, all negatives.'
        ],
        resources: [
          { title: "NeetCode Sliding Window Patterns", url: 'https://neetcode.io' },
          { title: "GFG Two Pointer Practice", url: 'https://geeksforgeeks.org' }
        ]
      },
      {
        week_number: 3,
        theme: 'Recursion, Backtracking & Divide & Conquer',
        topics: ['Subsets generation', 'Permutations of an Array', 'N-Queens and Sudoku Solver concepts'],
        tasks: [
          'Draw recursive tree on paper for 3 problems before coding.',
          'Solve "Generate Parentheses" and "Letter Combinations of a Phone Number".',
          'Learn how recursion stack depth causes memory limit issues.'
        ],
        resources: [
          { title: "Kunal Kushwaha Recursion Playlist", url: 'https://youtube.com' }
        ]
      },
      {
        week_number: 4,
        theme: 'Linked Lists, Stacks & Queues',
        topics: ['Reverse Linked List (Iterative + Recursive)', 'Detect Cycle (Floyd’s algorithm)', 'Next Greater Element using Monotonic Stack'],
        tasks: [
          'Implement custom Singly Linked List class with head and tail pointers.',
          'Solve "LRU Cache" - standard tier-1/tier-2 interview question.',
          'Practice Min Stack problem.'
        ],
        resources: [
          { title: "Striver Linked List Masterclass", url: 'https://takeuforward.org' }
        ]
      },
      {
        week_number: 5,
        theme: 'Binary Trees & Binary Search Trees (BST)',
        topics: ['Preorder, Inorder, Postorder (DFS)', 'Level Order Traversal (BFS using Queue)', 'Lowest Common Ancestor (LCA)'],
        tasks: [
          'Solve "Maximum Depth of Binary Tree" and "Invert Binary Tree".',
          'Understand BST validation rule (Left < Root < Right).',
          'Implement Diameter of Binary Tree.'
        ],
        resources: [
          { title: "GFG Binary Tree Essentials", url: 'https://geeksforgeeks.org' }
        ]
      },
      {
        week_number: 6,
        theme: 'Mock Interviews & Core CS Fundamentals (DBMS, OOPs)',
        topics: ['SQL Queries (Joins, Group By, Having)', '4 Pillars of OOPs with real-world examples', '1-hour timed mock test on HackerRank'],
        tasks: [
          'Solve Top 25 SQL interview questions on LeetCode.',
          'Write clean polymorphic code demonstrating abstract classes.',
          'Publish your GitHub repository documenting your 6-week streak!'
        ],
        resources: [
          { title: "Love Babbar DBMS Top 50 Notes", url: 'https://youtube.com' },
          { title: "InterviewBit Core CS Cheatsheet", url: 'https://interviewbit.com' }
        ]
      }
    ]
  },
  'webdev-freelance': {
    id: 'rm-webdev',
    title: 'Full-Stack Web Dev for Freelance & Startups (6 Weeks)',
    targetGoal: 'Build & Deploy Real-world Web Products',
    totalWeeks: 6,
    completedTasks: [],
    weeks: [
      {
        week_number: 1,
        theme: 'Modern React & Tailwind CSS Foundations',
        topics: ['React Components, Props, State with useState & useEffect', 'Responsive Tailwind layouts with Flexbox & Grid', 'Lucide icons and clean design tokens'],
        tasks: [
          'Build a portfolio card showcase with light/dark accents.',
          'Deploy your first website on Vercel with custom domain or .vercel.app link.'
        ],
        resources: [
          { title: "Chai aur Code React Series", url: 'https://youtube.com' }
        ]
      },
      {
        week_number: 2,
        theme: 'Database Integration with Supabase / PostgreSQL',
        topics: ['Database tables & foreign keys', 'Row Level Security (RLS)', 'CRUD operations with Supabase JS client'],
        tasks: [
          'Build a student notes repository where users can post & like study resources.',
          'Implement search and filter by engineering branch.'
        ],
        resources: [
          { title: "Supabase Crash Course", url: 'https://supabase.com' }
        ]
      }
    ]
  }
};
