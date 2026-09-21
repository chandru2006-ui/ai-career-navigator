// Career requirements reference skill names — resolved to IDs at seed time
const careers = [
  {
    title: 'Full Stack Developer',
    icon: '🖥️',
    description: 'Build complete web applications from frontend UI to backend APIs and databases.',
    avgSalary: '$90,000 - $140,000',
    jobDemand: 'very-high',
    requiredSkills: [
      { skillName: 'HTML',       requiredLevel: 70, priority: 'high',     category: 'Frontend' },
      { skillName: 'CSS',        requiredLevel: 70, priority: 'high',     category: 'Frontend' },
      { skillName: 'JavaScript', requiredLevel: 80, priority: 'critical', category: 'Language' },
      { skillName: 'React',      requiredLevel: 75, priority: 'high',     category: 'Frontend' },
      { skillName: 'Node.js',    requiredLevel: 70, priority: 'high',     category: 'Backend' },
      { skillName: 'Express.js', requiredLevel: 65, priority: 'medium',   category: 'Backend' },
      { skillName: 'MongoDB',    requiredLevel: 60, priority: 'medium',   category: 'Database' },
      { skillName: 'REST API',   requiredLevel: 70, priority: 'high',     category: 'Backend' },
      { skillName: 'Git',        requiredLevel: 60, priority: 'medium',   category: 'DevOps' }
    ]
  },
  {
    title: 'Frontend Developer',
    icon: '🎨',
    description: 'Craft beautiful, responsive user interfaces and interactive web experiences.',
    avgSalary: '$80,000 - $120,000',
    jobDemand: 'very-high',
    requiredSkills: [
      { skillName: 'HTML',        requiredLevel: 85, priority: 'critical', category: 'Frontend' },
      { skillName: 'CSS',         requiredLevel: 85, priority: 'critical', category: 'Frontend' },
      { skillName: 'JavaScript',  requiredLevel: 80, priority: 'critical', category: 'Language' },
      { skillName: 'React',       requiredLevel: 80, priority: 'critical', category: 'Frontend' },
      { skillName: 'TypeScript',  requiredLevel: 60, priority: 'high',     category: 'Language' },
      { skillName: 'Git',         requiredLevel: 60, priority: 'medium',   category: 'DevOps' },
      { skillName: 'REST API',    requiredLevel: 65, priority: 'high',     category: 'Backend' }
    ]
  },
  {
    title: 'Backend Developer',
    icon: '⚙️',
    description: 'Design and build server-side applications, APIs, and database architectures.',
    avgSalary: '$85,000 - $130,000',
    jobDemand: 'very-high',
    requiredSkills: [
      { skillName: 'Node.js',       requiredLevel: 80, priority: 'critical', category: 'Backend' },
      { skillName: 'Express.js',    requiredLevel: 75, priority: 'high',     category: 'Backend' },
      { skillName: 'JavaScript',    requiredLevel: 75, priority: 'high',     category: 'Language' },
      { skillName: 'MongoDB',       requiredLevel: 70, priority: 'high',     category: 'Database' },
      { skillName: 'SQL',           requiredLevel: 65, priority: 'high',     category: 'Database' },
      { skillName: 'REST API',      requiredLevel: 80, priority: 'critical', category: 'Backend' },
      { skillName: 'Git',           requiredLevel: 65, priority: 'medium',   category: 'DevOps' },
      { skillName: 'Data Structures',requiredLevel: 60, priority: 'medium',  category: 'Fundamentals' }
    ]
  },
  {
    title: 'Data Scientist',
    icon: '📊',
    description: 'Extract insights from large datasets using statistical analysis and ML models.',
    avgSalary: '$95,000 - $150,000',
    jobDemand: 'very-high',
    requiredSkills: [
      { skillName: 'Python',          requiredLevel: 85, priority: 'critical', category: 'Language' },
      { skillName: 'Machine Learning', requiredLevel: 80, priority: 'critical', category: 'AI/ML' },
      { skillName: 'Deep Learning',    requiredLevel: 65, priority: 'high',     category: 'AI/ML' },
      { skillName: 'Data Analysis',    requiredLevel: 85, priority: 'critical', category: 'AI/ML' },
      { skillName: 'SQL',              requiredLevel: 70, priority: 'high',     category: 'Database' },
      { skillName: 'Algorithms',       requiredLevel: 65, priority: 'medium',   category: 'Fundamentals' },
      { skillName: 'Data Structures',  requiredLevel: 60, priority: 'medium',   category: 'Fundamentals' }
    ]
  },
  {
    title: 'Data Analyst',
    icon: '📈',
    description: 'Analyze data to provide business insights and support decision-making.',
    avgSalary: '$65,000 - $100,000',
    jobDemand: 'high',
    requiredSkills: [
      { skillName: 'Python',       requiredLevel: 70, priority: 'high',     category: 'Language' },
      { skillName: 'SQL',          requiredLevel: 80, priority: 'critical', category: 'Database' },
      { skillName: 'Data Analysis',requiredLevel: 80, priority: 'critical', category: 'AI/ML' },
      { skillName: 'Data Structures',requiredLevel:50, priority: 'medium',  category: 'Fundamentals' },
      { skillName: 'Machine Learning',requiredLevel:55, priority: 'medium', category: 'AI/ML' }
    ]
  },
  {
    title: 'AI/ML Engineer',
    icon: '🤖',
    description: 'Design, build, and deploy machine learning models and AI systems.',
    avgSalary: '$110,000 - $170,000',
    jobDemand: 'very-high',
    requiredSkills: [
      { skillName: 'Python',          requiredLevel: 90, priority: 'critical', category: 'Language' },
      { skillName: 'Machine Learning', requiredLevel: 85, priority: 'critical', category: 'AI/ML' },
      { skillName: 'Deep Learning',    requiredLevel: 80, priority: 'critical', category: 'AI/ML' },
      { skillName: 'Data Analysis',    requiredLevel: 75, priority: 'high',     category: 'AI/ML' },
      { skillName: 'Algorithms',       requiredLevel: 75, priority: 'high',     category: 'Fundamentals' },
      { skillName: 'Data Structures',  requiredLevel: 70, priority: 'high',     category: 'Fundamentals' },
      { skillName: 'Cloud',            requiredLevel: 60, priority: 'medium',   category: 'Cloud' }
    ]
  },
  {
    title: 'Cybersecurity Analyst',
    icon: '🔒',
    description: 'Protect systems and networks from digital attacks and security breaches.',
    avgSalary: '$85,000 - $135,000',
    jobDemand: 'very-high',
    requiredSkills: [
      { skillName: 'Cybersecurity',  requiredLevel: 85, priority: 'critical', category: 'Security' },
      { skillName: 'Networking',     requiredLevel: 80, priority: 'critical', category: 'Security' },
      { skillName: 'Python',         requiredLevel: 65, priority: 'high',     category: 'Language' },
      { skillName: 'Linux (Shell)',   requiredLevel: 70, priority: 'high',     category: 'DevOps' },
      { skillName: 'SQL',            requiredLevel: 55, priority: 'medium',   category: 'Database' }
    ]
  },
  {
    title: 'Cloud Engineer',
    icon: '☁️',
    description: 'Build and manage cloud infrastructure and deployment pipelines.',
    avgSalary: '$100,000 - $155,000',
    jobDemand: 'very-high',
    requiredSkills: [
      { skillName: 'Cloud',           requiredLevel: 85, priority: 'critical', category: 'Cloud' },
      { skillName: 'Docker',          requiredLevel: 75, priority: 'high',     category: 'DevOps' },
      { skillName: 'Git',             requiredLevel: 70, priority: 'high',     category: 'DevOps' },
      { skillName: 'Python',          requiredLevel: 65, priority: 'high',     category: 'Language' },
      { skillName: 'Networking',      requiredLevel: 65, priority: 'high',     category: 'Security' },
      { skillName: 'Data Structures', requiredLevel: 50, priority: 'medium',   category: 'Fundamentals' }
    ]
  },
  {
    title: 'Software Developer',
    icon: '💻',
    description: 'Build robust software applications using modern programming languages.',
    avgSalary: '$75,000 - $120,000',
    jobDemand: 'very-high',
    requiredSkills: [
      { skillName: 'Java',           requiredLevel: 75, priority: 'critical', category: 'Language' },
      { skillName: 'Data Structures', requiredLevel: 80, priority: 'critical', category: 'Fundamentals' },
      { skillName: 'Algorithms',      requiredLevel: 75, priority: 'critical', category: 'Fundamentals' },
      { skillName: 'SQL',             requiredLevel: 65, priority: 'high',     category: 'Database' },
      { skillName: 'Git',             requiredLevel: 65, priority: 'high',     category: 'DevOps' },
      { skillName: 'Python',          requiredLevel: 60, priority: 'medium',   category: 'Language' }
    ]
  },
  {
    title: 'Blockchain Developer',
    icon: '⛓️',
    description: 'Build decentralized applications and smart contracts on blockchain platforms.',
    avgSalary: '$100,000 - $160,000',
    jobDemand: 'high',
    requiredSkills: [
      { skillName: 'Blockchain',  requiredLevel: 80, priority: 'critical', category: 'Blockchain' },
      { skillName: 'Solidity',    requiredLevel: 75, priority: 'critical', category: 'Blockchain' },
      { skillName: 'JavaScript',  requiredLevel: 70, priority: 'high',     category: 'Language' },
      { skillName: 'Node.js',     requiredLevel: 65, priority: 'high',     category: 'Backend' },
      { skillName: 'REST API',    requiredLevel: 60, priority: 'medium',   category: 'Backend' },
      { skillName: 'Data Structures',requiredLevel:65, priority: 'medium', category: 'Fundamentals' }
    ]
  }
];

module.exports = careers;
