import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create default user
  const defaultUserId = process.env.DEFAULT_USER_ID || "user-demo-123"

  const user = await prisma.user.upsert({
    where: { id: defaultUserId },
    update: {},
    create: {
      id: defaultUserId,
      email: "demo@aitools.com",
      name: "Demo User",
    },
  })

  console.log(`Created user: ${user.name} (${user.id})`)

  // Seed Writing Toolkit data
  await prisma.textProcessingHistory.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: user.id,
        originalText: "The quick brown fox jumps over the lazy dog.",
        processedText: "A swift auburn fox leaps over the inactive canine.",
        operation: "PARAPHRASE",
        wordCountOriginal: 9,
        wordCountProcessed: 9,
      },
      {
        userId: user.id,
        originalText:
          "Artificial intelligence is transforming industries across the globe, from healthcare to finance, transportation to entertainment. The rapid advancement of machine learning algorithms, coupled with increasing computational power and vast amounts of data, has enabled AI systems to perform tasks that once required human intelligence.",
        processedText:
          "AI is revolutionizing global industries including healthcare, finance, transportation, and entertainment. Advanced machine learning algorithms, increased computing power, and big data have enabled AI to perform traditionally human tasks.",
        operation: "SUMMARIZE",
        wordCountOriginal: 45,
        wordCountProcessed: 25,
      },
    ],
  })

  // Seed Resume Builder data
  await prisma.resume.create({
    data: {
      id: "resume-demo-1",
      userId: user.id,
      title: "Software Developer Resume",
      jobTitle: "Full Stack Developer",
      industry: "Technology",
      experience:
        "5 years of experience in web development, specializing in React and Node.js. Led a team of 3 developers to deliver a customer portal that increased user engagement by 40%.",
      skills: "JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, MongoDB, AWS, Docker",
      education: "Bachelor of Science in Computer Science, University of Technology, 2018",
      generatedResume:
        "# John Doe\n\n## Full Stack Developer\n\n### Professional Summary\nDedicated Full Stack Developer with 5 years of experience building responsive and scalable web applications. Proficient in React, Node.js, and cloud technologies with a strong focus on code quality and user experience.\n\n### Core Skills\n- Frontend: React, TypeScript, HTML5, CSS3, Redux\n- Backend: Node.js, Express, RESTful APIs, GraphQL\n- Databases: PostgreSQL, MongoDB\n- DevOps: AWS, Docker, CI/CD pipelines\n- Methodologies: Agile, Scrum, TDD\n\n### Professional Experience\n**Senior Developer, Tech Solutions Inc.**  \n*2020 - Present*\n- Led a team of 3 developers to deliver a customer portal that increased user engagement by 40%\n- Implemented responsive design principles, improving mobile user retention by 25%\n- Optimized database queries, reducing load times by 30%\n- Mentored junior developers and conducted code reviews\n\n**Web Developer, Digital Innovations**  \n*2018 - 2020*\n- Developed and maintained multiple client websites using React and Node.js\n- Integrated third-party APIs for payment processing and data analytics\n- Collaborated with designers to implement UI/UX improvements\n\n### Education\nBachelor of Science in Computer Science  \nUniversity of Technology, 2018\n\n### Additional Certifications\n- AWS Certified Developer Associate\n- MongoDB Certified Developer\n- Certified Scrum Master",
    },
  })

  // Seed Report Generator data
  await prisma.report.create({
    data: {
      id: "report-demo-1",
      userId: user.id,
      title: "Q2 Project Progress Report",
      reportType: "PROJECT_UPDATE",
      bulletPoints:
        "- Completed user authentication module\n- Integrated payment gateway\n- Fixed 15 critical bugs\n- Deployed to staging environment\n- Started user acceptance testing",
      generatedReport:
        "# Q2 Project Progress Report\n\n## Executive Summary\nThe project has made significant progress during Q2, with the completion of key modules and successful deployment to the staging environment. User acceptance testing has begun, with initial feedback being positive. The team has successfully addressed all critical bugs and is on track to meet the Q3 release deadline.\n\n## Key Accomplishments\n\n### User Authentication Module\nThe team has completed the development and testing of the user authentication module, which includes:\n- Single sign-on integration with corporate directory\n- Multi-factor authentication\n- Password recovery workflow\n- Session management and security features\n\n### Payment Gateway Integration\nThe payment processing system has been successfully integrated with the following features:\n- Support for multiple payment methods (credit cards, PayPal, bank transfers)\n- Automated receipt generation\n- Transaction history and reporting\n- PCI-DSS compliant data handling\n\n### Bug Fixes and Quality Improvements\n- Resolved 15 critical bugs identified during internal testing\n- Improved application performance by optimizing database queries\n- Enhanced error handling and user notifications\n- Implemented comprehensive logging for troubleshooting\n\n### Deployment and Infrastructure\n- Successfully deployed to the staging environment\n- Configured auto-scaling based on anticipated user load\n- Implemented monitoring and alerting systems\n- Documented deployment procedures for production release\n\n## Current Status\nUser acceptance testing has begun with a select group of stakeholders. Initial feedback has been positive, with minor usability suggestions that are being addressed in real-time. The team is maintaining daily communication with testers to quickly resolve any issues.\n\n## Next Steps\n1. Complete user acceptance testing by July 15\n2. Address feedback and make necessary adjustments\n3. Conduct final performance testing under load\n4. Prepare production deployment plan\n5. Schedule training sessions for end users\n\n## Risks and Mitigations\n| Risk | Impact | Mitigation |\n|------|--------|------------|\n| Integration with legacy systems | Medium | Additional testing scheduled with IT operations team |\n| User adoption | High | Developing comprehensive training materials and support documentation |\n| Performance under peak load | Medium | Conducting stress tests and optimizing critical paths |\n\n## Conclusion\nThe project is on track for successful completion according to the established timeline. The team has demonstrated strong problem-solving skills and collaboration throughout this quarter. With continued focus on user feedback and quality, we anticipate a successful production release in Q3.",
      tone: "Professional",
      audience: "Project Stakeholders",
    },
  })

  // Seed SQL Generator data
  await prisma.sqlQuery.create({
    data: {
      id: "sql-demo-1",
      userId: user.id,
      naturalLanguage: "Find all customers who made purchases over $1000 in the last month",
      generatedSql:
        "SELECT c.customer_id, c.first_name, c.last_name, c.email, SUM(o.total_amount) as total_spent\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')\nAND o.order_date < DATE_TRUNC('month', CURRENT_DATE)\nAND o.total_amount > 1000\nGROUP BY c.customer_id, c.first_name, c.last_name, c.email\nORDER BY total_spent DESC;",
      queryType: "SELECT",
      database: "PostgreSQL",
      explanation:
        "This query joins the customers and orders tables to find customers who made purchases exceeding $1000 in the previous month. It calculates the total amount spent by each customer and sorts the results by total spent in descending order.",
      isValid: true,
    },
  })

  // Seed Chatbot data
  const conversation = await prisma.conversation.create({
    data: {
      id: "conv-demo-1",
      userId: user.id,
      title: "Help with project setup",
    },
  })

  await prisma.message.createMany({
    data: [
      {
        id: "msg-user-1",
        conversationId: conversation.id,
        role: "USER",
        content: "How do I set up a React project with TypeScript?",
      },
      {
        id: "msg-assistant-1",
        conversationId: conversation.id,
        role: "ASSISTANT",
        content:
          "To set up a React project with TypeScript, you can use Create React App with the TypeScript template. Here's how:\n\n1. Open your terminal\n2. Run the following command:\n   ```bash\n   npx create-react-app my-app --template typescript\n   ```\n3. Navigate to your project:\n   ```bash\n   cd my-app\n   ```\n4. Start the development server:\n   ```bash\n   npm start\n   ```\n\nThis will create a new React project with TypeScript configuration already set up, including:\n- tsconfig.json with recommended settings\n- TypeScript type definitions for React and related packages\n- Example components written in TypeScript\n\nWould you like me to explain how to create components in TypeScript or how to define props types?",
      },
    ],
  })

  // Seed Knowledge Base data
  await prisma.knowledgeBase.create({
    data: {
      id: "kb-demo-1",
      userId: user.id,
      title: "React Hooks Overview",
      content:
        "React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8.\n\nCommon hooks include:\n\n1. useState: For managing state in functional components\n2. useEffect: For handling side effects like data fetching, subscriptions, or DOM manipulation\n3. useContext: For consuming context in functional components\n4. useReducer: An alternative to useState for complex state logic\n5. useCallback: For memoizing functions to prevent unnecessary re-renders\n6. useMemo: For memoizing values to optimize performance\n7. useRef: For persisting values across renders without causing re-renders\n\nHooks must be called at the top level of your components and cannot be called inside loops, conditions, or nested functions.",
      category: "React",
      tags: ["react", "hooks", "javascript", "frontend"],
      isActive: true,
    },
  })

  console.log("Database seeding completed!")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
