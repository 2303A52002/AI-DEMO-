import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';
import * as bcrypt from 'bcryptjs';

// Neon WebSocket uses WSS on port 443 (not 5432), bypasses firewall
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log('Seeding database...');

  // 1. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const users = [
    { name: 'Admin User', email: 'admin@campusiq.com', password: passwordHash },
    { name: 'Kowshik', email: 'kowshik@gmail.com', password: passwordHash },
    { name: 'Priya Patel', email: 'priya@gmail.com', password: passwordHash },
    { name: 'Amit Verma', email: 'amit@gmail.com', password: passwordHash },
    { name: 'Sneha Reddy', email: 'sneha@gmail.com', password: passwordHash },
  ];

  const dbUsers = [];
  for (const user of users) {
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    dbUsers.push(dbUser);
  }
  console.log(`Created/found ${dbUsers.length} users.`);

  // 2. Clear Existing Data (excluding Users to avoid foreign key issues)
  await prisma.savedCollege.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});

  // 3. Define the 50 Indian Colleges
  const collegesData = [
    // --- IITs (15) ---
    {
      name: 'Indian Institute of Technology Bombay',
      slug: 'iit-bombay',
      location: 'Mumbai',
      state: 'Maharashtra',
      fees: 220000,
      rating: 4.9,
      established: 1958,
      accreditation: 'NAAC A++',
      campusSize: 550,
      website: 'https://www.iitb.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600',
      description: 'IIT Bombay is a leading public technical and research university located in Powai, Mumbai. It is globally recognized for its state-of-the-art research facilities, elite faculty, and excellent student start-up ecosystem.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 120, fees: 220000 },
        { name: 'B.Tech Electrical Engineering', duration: 4, seats: 100, fees: 220000 },
        { name: 'B.Tech Mechanical Engineering', duration: 4, seats: 110, fees: 220000 },
        { name: 'M.Tech Microelectronics', duration: 2, seats: 40, fees: 80000 }
      ],
      placement: {
        avgSalary: 23.5,
        highestSalary: 168.0,
        placementPercent: 97.2,
        topRecruiters: ['Google', 'Microsoft', 'Apple', 'Rubrik', 'Uber', 'Qualcomm']
      }
    },
    {
      name: 'Indian Institute of Technology Delhi',
      slug: 'iit-delhi',
      location: 'New Delhi',
      state: 'Delhi',
      fees: 225000,
      rating: 4.8,
      established: 1961,
      accreditation: 'NAAC A++',
      campusSize: 325,
      website: 'https://home.iitd.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=600',
      description: 'IIT Delhi is a premier technology institute located in Hauz Khas, New Delhi. Known for its strong industry links, high quality academic structure, and vibrant entrepreneurship cell that has spawned multiple unicorns.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 99, fees: 225000 },
        { name: 'B.Tech Mathematics and Computing', duration: 4, seats: 60, fees: 225000 },
        { name: 'B.Tech Engineering Physics', duration: 4, seats: 50, fees: 225000 },
        { name: 'M.Tech Computer Science', duration: 2, seats: 35, fees: 85000 }
      ],
      placement: {
        avgSalary: 22.8,
        highestSalary: 150.0,
        placementPercent: 96.5,
        topRecruiters: ['Microsoft', 'Goldman Sachs', 'Jane Street', 'Samsung', 'Intel']
      }
    },
    {
      name: 'Indian Institute of Technology Madras',
      slug: 'iit-madras',
      location: 'Chennai',
      state: 'Tamil Nadu',
      fees: 215000,
      rating: 4.9,
      established: 1959,
      accreditation: 'NIRF Rank 1',
      campusSize: 617,
      website: 'https://www.iitm.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600',
      description: 'IIT Madras has consistently been ranked as the top engineering institution in India by NIRF. Spanning over a lush green campus home to wild deer, it is home to India\'s top university research park.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 85, fees: 215000 },
        { name: 'B.Tech Aerospace Engineering', duration: 4, seats: 55, fees: 215000 },
        { name: 'B.Tech Civil Engineering', duration: 4, seats: 110, fees: 215000 },
        { name: 'M.S. Computer Science & Engineering', duration: 3, seats: 30, fees: 75000 }
      ],
      placement: {
        avgSalary: 21.4,
        highestSalary: 131.0,
        placementPercent: 95.8,
        topRecruiters: ['Google', 'Texas Instruments', 'Amazon', 'ITC', 'Honeywell']
      }
    },
    {
      name: 'Indian Institute of Technology Kanpur',
      slug: 'iit-kanpur',
      location: 'Kanpur',
      state: 'Uttar Pradesh',
      fees: 212000,
      rating: 4.7,
      established: 1959,
      accreditation: 'NAAC A++',
      campusSize: 1055,
      website: 'https://www.iitk.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1606761568289-44f24e6a8837?auto=format&fit=crop&q=80&w=600',
      description: 'IIT Kanpur was the first institute in India to offer Computer Science education. Possessing a massive residential campus with its own airstrip, it is known for rigorous research-oriented education and high academic freedom.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 105, fees: 212000 },
        { name: 'B.Tech Electrical Engineering', duration: 4, seats: 130, fees: 212000 },
        { name: 'B.Tech Materials Science & Engineering', duration: 4, seats: 80, fees: 212000 },
        { name: 'M.Tech Cybersecurity', duration: 2, seats: 25, fees: 70000 }
      ],
      placement: {
        avgSalary: 20.9,
        highestSalary: 120.0,
        placementPercent: 94.2,
        topRecruiters: ['Nvidia', 'Barclays', 'HSBC', 'Intel', 'Microsoft', 'Citi']
      }
    },
    {
      name: 'Indian Institute of Technology Kharagpur',
      slug: 'iit-kharagpur',
      location: 'Kharagpur',
      state: 'West Bengal',
      fees: 222000,
      rating: 4.7,
      established: 1951,
      accreditation: 'NAAC A++',
      campusSize: 2100,
      website: 'https://www.iitkgp.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
      description: 'The oldest and largest of all IITs, IIT Kharagpur is rich in heritage and features a huge student community. It has a stellar track record of producing global executives, including Sundar Pichai.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 95, fees: 222000 },
        { name: 'B.Tech Electronics & EC Engineering', duration: 4, seats: 100, fees: 222000 },
        { name: 'Dual Degree (B.Tech + M.Tech) CS', duration: 5, seats: 60, fees: 222000 },
        { name: 'B.Tech Ocean Engineering', duration: 4, seats: 40, fees: 222000 }
      ],
      placement: {
        avgSalary: 19.8,
        highestSalary: 112.0,
        placementPercent: 92.5,
        topRecruiters: ['Microsoft', 'J.P. Morgan', 'DE Shaw', 'Amazon', 'Cisco']
      }
    },
    {
      name: 'Indian Institute of Technology Roorkee',
      slug: 'iit-roorkee',
      location: 'Roorkee',
      state: 'Uttarakhand',
      fees: 218000,
      rating: 4.6,
      established: 1847,
      accreditation: 'NAAC A+',
      campusSize: 365,
      website: 'https://www.iitr.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=600',
      description: 'Founded as the Thomason College of Civil Engineering, IIT Roorkee is the oldest technical institution in Asia. It combines historic architecture with modern research facilities and excellent startup resources.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 100, fees: 218000 },
        { name: 'B.Tech Civil Engineering', duration: 4, seats: 140, fees: 218000 },
        { name: 'B.Tech Chemical Engineering', duration: 4, seats: 95, fees: 218000 },
        { name: 'M.Tech Water Resource Management', duration: 2, seats: 20, fees: 60000 }
      ],
      placement: {
        avgSalary: 18.9,
        highestSalary: 105.0,
        placementPercent: 91.0,
        topRecruiters: ['Adobe', 'Reliance', 'Tata Steel', 'Schlumberger', 'Qualcomm']
      }
    },
    {
      name: 'Indian Institute of Technology Guwahati',
      slug: 'iit-guwahati',
      location: 'Guwahati',
      state: 'Assam',
      fees: 210000,
      rating: 4.6,
      established: 1994,
      accreditation: 'NAAC A++',
      campusSize: 700,
      website: 'https://www.iitg.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600',
      description: 'Situated on the banks of the majestic Brahmaputra River, IIT Guwahati offers one of the most scenic campuses in India. It is highly ranked for technical research and design education.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 110, fees: 210000 },
        { name: 'B.Tech Electronics & Electrical', duration: 4, seats: 90, fees: 210000 },
        { name: 'B.Des (Bachelor of Design)', duration: 4, seats: 50, fees: 230000 }
      ],
      placement: {
        avgSalary: 18.2,
        highestSalary: 95.0,
        placementPercent: 90.5,
        topRecruiters: ['Microsoft', 'Texas Instruments', 'Oracle', 'Uber', 'Axis Bank']
      }
    },
    {
      name: 'Indian Institute of Technology Hyderabad',
      slug: 'iit-hyderabad',
      location: 'Hyderabad',
      state: 'Telangana',
      fees: 230000,
      rating: 4.5,
      established: 2008,
      accreditation: 'NAAC A++',
      campusSize: 576,
      website: 'https://www.iith.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
      description: 'IIT Hyderabad is a second-generation IIT famous for its strong collaboration with Japanese universities, high-quality research output, and state-of-the-art campus architecture designed by Japanese architects.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 75, fees: 230000 },
        { name: 'B.Tech Artificial Intelligence', duration: 4, seats: 40, fees: 240000 },
        { name: 'B.Tech Biomedical Engineering', duration: 4, seats: 30, fees: 230000 }
      ],
      placement: {
        avgSalary: 20.1,
        highestSalary: 96.0,
        placementPercent: 93.0,
        topRecruiters: ['Microsoft', 'Sony', 'Goldman Sachs', 'Qualcomm', 'TSMC']
      }
    },
    {
      name: 'Indian Institute of Technology BHU Varanasi',
      slug: 'iit-bhu-varanasi',
      location: 'Varanasi',
      state: 'Uttar Pradesh',
      fees: 220000,
      rating: 4.5,
      established: 1919,
      accreditation: 'NAAC A++',
      campusSize: 400,
      website: 'https://www.iitbhu.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&q=80&w=600',
      description: 'Founded as Banaras Engineering College, IIT BHU was integrated as an IIT in 2012. It carries a rich century-long tradition of engineering education inside the legendary Banaras Hindu University campus.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 95, fees: 220000 },
        { name: 'B.Tech Metallurgical Engineering', duration: 4, seats: 80, fees: 220000 },
        { name: 'B.Tech Mining Engineering', duration: 4, seats: 75, fees: 220000 }
      ],
      placement: {
        avgSalary: 17.5,
        highestSalary: 88.0,
        placementPercent: 88.5,
        topRecruiters: ['Google', 'Goldman Sachs', 'Tata Motors', 'Coal India', 'Cisco']
      }
    },
    {
      name: 'Indian Institute of Technology Indore',
      slug: 'iit-indore',
      location: 'Indore',
      state: 'Madhya Pradesh',
      fees: 224000,
      rating: 4.4,
      established: 2009,
      accreditation: 'NAAC A++',
      campusSize: 501,
      website: 'https://www.iiti.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
      description: 'IIT Indore has distinguished itself by achieving high scores in international research citations. It features advanced laboratories in biotechnology and space sciences.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 80, fees: 224000 },
        { name: 'B.Tech Electrical Engineering', duration: 4, seats: 80, fees: 224000 },
        { name: 'M.Tech Space Engineering', duration: 2, seats: 20, fees: 75000 }
      ],
      placement: {
        avgSalary: 18.5,
        highestSalary: 82.0,
        placementPercent: 91.2,
        topRecruiters: ['Intel', 'Microsoft', 'ISRO', 'L&T', 'Standard Chartered']
      }
    },
    {
      name: 'Indian Institute of Technology Ropar',
      slug: 'iit-ropar',
      location: 'Rupnagar',
      state: 'Punjab',
      fees: 220000,
      rating: 4.3,
      established: 2008,
      accreditation: 'NAAC A+',
      campusSize: 500,
      website: 'https://www.iitrpr.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=600',
      description: 'IIT Ropar is committed to state-of-the-art research in agricultural technology, water resource conservation, and manufacturing processes.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 80, fees: 220000 },
        { name: 'B.Tech Mechanical Engineering', duration: 4, seats: 70, fees: 220000 }
      ],
      placement: {
        avgSalary: 16.8,
        highestSalary: 65.0,
        placementPercent: 86.4,
        topRecruiters: ['Amazon', 'Flipkart', 'Cognizant', 'L&T Technology Services']
      }
    },
    {
      name: 'Indian Institute of Technology Mandi',
      slug: 'iit-mandi',
      location: 'Mandi',
      state: 'Himachal Pradesh',
      fees: 215000,
      rating: 4.3,
      established: 2009,
      accreditation: 'NAAC A+',
      campusSize: 538,
      website: 'https://www.iitmandi.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&q=80&w=600',
      description: 'Located in the Kamand Valley, IIT Mandi offers a unique mountain campus experience. It specializes in Himalayan biotechnology and mountain-specific disaster management technology.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 70, fees: 215000 },
        { name: 'B.Tech Data Science & Engineering', duration: 4, seats: 45, fees: 215000 }
      ],
      placement: {
        avgSalary: 16.2,
        highestSalary: 60.0,
        placementPercent: 87.0,
        topRecruiters: ['Microsoft', 'Adobe', 'Capgemini', 'TCS', 'Mahindra']
      }
    },
    {
      name: 'Indian Institute of Technology Gandhinagar',
      slug: 'iit-gandhinagar',
      location: 'Gandhinagar',
      state: 'Gujarat',
      fees: 225000,
      rating: 4.4,
      established: 2008,
      accreditation: 'NAAC A++',
      campusSize: 400,
      website: 'https://iitgn.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600',
      description: 'IIT Gandhinagar is known for its highly liberal curriculum, promoting interdisciplinary project work and study abroad programs for all undergrads.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 60, fees: 225000 },
        { name: 'B.Tech Chemical Engineering', duration: 4, seats: 60, fees: 225000 }
      ],
      placement: {
        avgSalary: 17.1,
        highestSalary: 72.0,
        placementPercent: 89.5,
        topRecruiters: ['Adani', 'Reliance Industries', 'ICICI Bank', 'Oracle', 'HSBC']
      }
    },
    {
      name: 'Indian Institute of Technology Patna',
      slug: 'iit-patna',
      location: 'Patna',
      state: 'Bihar',
      fees: 218000,
      rating: 4.3,
      established: 2008,
      accreditation: 'NAAC A',
      campusSize: 501,
      website: 'https://www.iitp.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1541829019-259276a7f013?auto=format&fit=crop&q=80&w=600',
      description: 'IIT Patna has developed modern laboratories focusing on signal processing, manufacturing, and advanced computing technologies.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 80, fees: 218000 },
        { name: 'B.Tech Electrical & Electronics', duration: 4, seats: 75, fees: 218000 }
      ],
      placement: {
        avgSalary: 16.5,
        highestSalary: 61.0,
        placementPercent: 88.0,
        topRecruiters: ['Samsung Research', 'DE Shaw', 'Intel', 'Infosys']
      }
    },
    {
      name: 'Indian Institute of Technology Bhubaneswar',
      slug: 'iit-bhubaneswar',
      location: 'Bhubaneswar',
      state: 'Odisha',
      fees: 216000,
      rating: 4.3,
      established: 2008,
      accreditation: 'NAAC A',
      campusSize: 936,
      website: 'https://www.iitbbs.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600',
      description: 'With a large green campus at Argul, IIT Bhubaneswar hosts excellent marine science research and infrastructure engineering centers.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 60, fees: 216000 },
        { name: 'B.Tech Mechanical Engineering', duration: 4, seats: 70, fees: 216000 }
      ],
      placement: {
        avgSalary: 15.9,
        highestSalary: 56.0,
        placementPercent: 85.0,
        topRecruiters: ['TCS Research', 'Wipro', 'L&T', 'Amazon India']
      }
    },

    // --- NITs (10) ---
    {
      name: 'National Institute of Technology Tiruchirappalli',
      slug: 'nit-trichy',
      location: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      fees: 145000,
      rating: 4.6,
      established: 1964,
      accreditation: 'NIRF Rank 9 (Engineering)',
      campusSize: 800,
      website: 'https://www.nitt.edu',
      imageUrl: 'https://images.unsplash.com/photo-1622397333309-3056849bc70b?auto=format&fit=crop&q=80&w=600',
      description: 'NIT Trichy is globally recognized as the top-ranking NIT in India. It is known for outstanding academic curriculum, premium student placements, and strong research output.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 119, fees: 145000 },
        { name: 'B.Tech Electronics & Comm Engineering', duration: 4, seats: 100, fees: 145000 },
        { name: 'B.Tech Chemical Engineering', duration: 4, seats: 80, fees: 145000 }
      ],
      placement: {
        avgSalary: 15.4,
        highestSalary: 52.8,
        placementPercent: 94.0,
        topRecruiters: ['Microsoft', 'Amazon', 'Qualcomm', 'Intel', 'Paytm', 'Oracle']
      }
    },
    {
      name: 'National Institute of Technology Karnataka Surathkal',
      slug: 'nit-surathkal',
      location: 'Surathkal',
      state: 'Karnataka',
      fees: 142000,
      rating: 4.5,
      established: 1960,
      accreditation: 'NAAC A+',
      campusSize: 295,
      website: 'https://www.nitk.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1141?auto=format&fit=crop&q=80&w=600',
      description: 'Located right next to the Arabian Sea coastline, NITK Surathkal has a private beach and boasts top placement scores alongside premium research publications.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 110, fees: 142000 },
        { name: 'B.Tech Information Technology', duration: 4, seats: 95, fees: 142000 },
        { name: 'B.Tech Mechanical Engineering', duration: 4, seats: 115, fees: 142000 }
      ],
      placement: {
        avgSalary: 14.8,
        highestSalary: 54.0,
        placementPercent: 93.5,
        topRecruiters: ['Microsoft', 'Google India', 'Uber', 'Goldman Sachs', 'Texas Instruments']
      }
    },
    {
      name: 'National Institute of Technology Warangal',
      slug: 'nit-warangal',
      location: 'Warangal',
      state: 'Telangana',
      fees: 140000,
      rating: 4.5,
      established: 1959,
      accreditation: 'NAAC A+',
      campusSize: 256,
      website: 'https://www.nitw.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600',
      description: 'The first Regional Engineering College established in India. NIT Warangal is well-respected for highly competitive student intakes and massive industrial linkage.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 120, fees: 140000 },
        { name: 'B.Tech Electrical & Electronics', duration: 4, seats: 120, fees: 140000 },
        { name: 'M.C.A (Master of Computer Apps)', duration: 3, seats: 60, fees: 80000 }
      ],
      placement: {
        avgSalary: 14.2,
        highestSalary: 47.0,
        placementPercent: 91.8,
        topRecruiters: ['Adobe', 'Citigroup', 'Salesforce', 'Nvidia', 'Siemens']
      }
    },
    {
      name: 'Motilal Nehru National Institute of Technology Allahabad',
      slug: 'mnnit-allahabad',
      location: 'Prayagraj',
      state: 'Uttar Pradesh',
      fees: 148000,
      rating: 4.4,
      established: 1961,
      accreditation: 'NAAC A+',
      campusSize: 222,
      website: 'http://www.mnnit.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600',
      description: 'MNNIT Allahabad boasts one of the best coding cultures in North India and consistently matches second-tier IIT placements for Computer Science.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 120, fees: 148000 },
        { name: 'B.Tech Information Technology', duration: 4, seats: 90, fees: 148000 }
      ],
      placement: {
        avgSalary: 13.5,
        highestSalary: 51.0,
        placementPercent: 90.0,
        topRecruiters: ['Microsoft', 'Amazon', 'DE Shaw', 'Flipkart', 'Cisco']
      }
    },
    {
      name: 'Visvesvaraya National Institute of Technology Nagpur',
      slug: 'vnit-nagpur',
      location: 'Nagpur',
      state: 'Maharashtra',
      fees: 138000,
      rating: 4.3,
      established: 1960,
      accreditation: 'NAAC A',
      campusSize: 215,
      website: 'https://www.vnit.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
      description: 'Located in the heart of Nagpur city, VNIT is famous for its research publications in material science, structural engineering, and power electronics.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 90, fees: 138000 },
        { name: 'B.Tech Electronics & Comm', duration: 4, seats: 90, fees: 138000 }
      ],
      placement: {
        avgSalary: 11.2,
        highestSalary: 42.0,
        placementPercent: 88.2,
        topRecruiters: ['Schneider Electric', 'Maruti Suzuki', 'Siemens', 'Tata Power']
      }
    },
    {
      name: 'National Institute of Technology Calicut',
      slug: 'nit-calicut',
      location: 'Kozhikode',
      state: 'Kerala',
      fees: 143000,
      rating: 4.3,
      established: 1961,
      accreditation: 'NAAC A',
      campusSize: 296,
      website: 'https://www.nitc.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600',
      description: 'NIT Calicut resides in a serene campus near the foothills of the Western Ghats. It hosts premium laboratory infrastructures in renewable energy and nanotechnology.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 100, fees: 143000 },
        { name: 'B.Tech Electrical & Electronics', duration: 4, seats: 90, fees: 143000 }
      ],
      placement: {
        avgSalary: 12.1,
        highestSalary: 45.0,
        placementPercent: 89.5,
        topRecruiters: ['Intel', 'Oracle', 'Goldman Sachs', 'Schneider', 'Wipro']
      }
    },
    {
      name: 'National Institute of Technology Kurukshetra',
      slug: 'nit-kurukshetra',
      location: 'Kurukshetra',
      state: 'Haryana',
      fees: 137000,
      rating: 4.2,
      established: 1963,
      accreditation: 'NAAC A',
      campusSize: 300,
      website: 'https://www.nitkkr.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600',
      description: 'Located in the historic land of Kurukshetra, this institute offers premium training in control systems, VLSI design, and energy policy research.',
      courses: [
        { name: 'B.Tech Computer Engineering', duration: 4, seats: 90, fees: 137000 },
        { name: 'B.Tech Mechanical Engineering', duration: 4, seats: 90, fees: 137000 }
      ],
      placement: {
        avgSalary: 11.5,
        highestSalary: 43.5,
        placementPercent: 87.0,
        topRecruiters: ['L&T', 'Hero MotoCorp', 'NTPC', 'Amdocs', 'Infosys']
      }
    },
    {
      name: 'National Institute of Technology Rourkela',
      slug: 'nit-rourkela',
      location: 'Rourkela',
      state: 'Odisha',
      fees: 139000,
      rating: 4.4,
      established: 1961,
      accreditation: 'NAAC A+',
      campusSize: 647,
      website: 'https://www.nitrkl.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      description: 'One of the largest campuses among NITs. NIT Rourkela offers highly rated programs in biotechnology, metallurgical science, and software engineering.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 90, fees: 139000 },
        { name: 'B.Tech Ceramic Engineering', duration: 4, seats: 45, fees: 139000 }
      ],
      placement: {
        avgSalary: 12.8,
        highestSalary: 48.0,
        placementPercent: 91.0,
        topRecruiters: ['Tata Steel', 'Microsoft', 'Hindalco', 'Wipro', 'Qualcomm']
      }
    },
    {
      name: 'National Institute of Technology Silchar',
      slug: 'nit-silchar',
      location: 'Silchar',
      state: 'Assam',
      fees: 135000,
      rating: 4.1,
      established: 1967,
      accreditation: 'NAAC A',
      campusSize: 625,
      website: 'http://www.nits.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
      description: 'Set amidst tea gardens and lakes, NIT Silchar is recognized for its supercomputing facilities and regional center for renewable energy.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 80, fees: 135000 },
        { name: 'B.Tech Civil Engineering', duration: 4, seats: 90, fees: 135000 }
      ],
      placement: {
        avgSalary: 10.5,
        highestSalary: 38.0,
        placementPercent: 85.0,
        topRecruiters: ['TCS', 'L&T Construction', 'HCL', 'Capgemini', 'IBM']
      }
    },
    {
      name: 'National Institute of Technology Durgapur',
      slug: 'nit-durgapur',
      location: 'Durgapur',
      state: 'West Bengal',
      fees: 136000,
      rating: 4.2,
      established: 1960,
      accreditation: 'NAAC A',
      campusSize: 187,
      website: 'https://nitdgp.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=600',
      description: 'NIT Durgapur has pioneered research in nanotechnology and structural engineering, maintaining stellar recruitment with core sectors.',
      courses: [
        { name: 'B.Tech Computer Science', duration: 4, seats: 85, fees: 136000 },
        { name: 'B.Tech Chemical Engineering', duration: 4, seats: 70, fees: 136000 }
      ],
      placement: {
        avgSalary: 11.0,
        highestSalary: 40.0,
        placementPercent: 86.8,
        topRecruiters: ['PwC', 'Tata Power', 'Cognizant', 'Ericsson', 'L&T']
      }
    },

    // --- Private & Other Engineering (5) ---
    {
      name: 'Birla Institute of Technology and Science Pilani',
      slug: 'bits-pilani',
      location: 'Pilani',
      state: 'Rajasthan',
      fees: 480000,
      rating: 4.7,
      established: 1964,
      accreditation: 'NAAC A++',
      campusSize: 328,
      website: 'https://www.bits-pilani.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=600',
      description: 'BITS Pilani is India\'s top private technology institute, famous for its strict "No Reservation" policy, zero attendance requirements, and the legendary Practice School (internship) program.',
      courses: [
        { name: 'B.E. Computer Science', duration: 4, seats: 120, fees: 480000 },
        { name: 'B.E. Electrical & Electronics', duration: 4, seats: 100, fees: 480000 },
        { name: 'M.Sc. Economics (Dual Degree)', duration: 5, seats: 80, fees: 480000 }
      ],
      placement: {
        avgSalary: 19.5,
        highestSalary: 60.7,
        placementPercent: 95.0,
        topRecruiters: ['Apple', 'Uber', 'Goldman Sachs', 'De Shaw', 'Boston Consulting Group']
      }
    },
    {
      name: 'BITS Pilani K K Birla Goa Campus',
      slug: 'bits-goa',
      location: 'Zuarinagar',
      state: 'Goa',
      fees: 485000,
      rating: 4.5,
      established: 2004,
      accreditation: 'NAAC A++',
      campusSize: 180,
      website: 'https://www.bits-pilani.ac.in/goa',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
      description: 'Nestled in the scenic landscape of Goa, BITS Goa matches Pilani\'s curriculum, offering world-class infrastructure and premium research facilities on the banks of Zuari river.',
      courses: [
        { name: 'B.E. Computer Science', duration: 4, seats: 100, fees: 485000 },
        { name: 'B.E. Electronics & Instrumentation', duration: 4, seats: 80, fees: 485000 }
      ],
      placement: {
        avgSalary: 18.2,
        highestSalary: 55.0,
        placementPercent: 93.4,
        topRecruiters: ['J.P. Morgan', 'Microsoft', 'Nvidia', 'Amazon India', 'Credit Suisse']
      }
    },
    {
      name: 'BITS Pilani Hyderabad Campus',
      slug: 'bits-hyderabad',
      location: 'Hyderabad',
      state: 'Telangana',
      fees: 485000,
      rating: 4.5,
      established: 2008,
      accreditation: 'NAAC A++',
      campusSize: 200,
      website: 'https://www.bits-pilani.ac.in/hyderabad',
      imageUrl: 'https://images.unsplash.com/photo-1590012314607-cda9d9b6a9a9?auto=format&fit=crop&q=80&w=600',
      description: 'Equipped with advanced semiconductor fabrication labs and robotics centers, BITS Hyderabad is a hub for industrial research in the technology capital.',
      courses: [
        { name: 'B.E. Computer Science', duration: 4, seats: 100, fees: 485000 },
        { name: 'B.E. Mechanical Engineering', duration: 4, seats: 90, fees: 485000 }
      ],
      placement: {
        avgSalary: 17.9,
        highestSalary: 52.0,
        placementPercent: 92.5,
        topRecruiters: ['Qualcomm', 'Intel', 'Salesforce', 'Micron', 'Oracle']
      }
    },
    {
      name: 'Delhi Technological University',
      slug: 'dtu-delhi',
      location: 'New Delhi',
      state: 'Delhi',
      fees: 219000,
      rating: 4.4,
      established: 1941,
      accreditation: 'NAAC A',
      campusSize: 164,
      website: 'http://www.dtu.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600',
      description: 'Formerly Delhi College of Engineering, DTU is a premier state university producing some of the best engineering minds and software developers in India.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 150, fees: 219000 },
        { name: 'B.Tech Software Engineering', duration: 4, seats: 120, fees: 219000 }
      ],
      placement: {
        avgSalary: 16.2,
        highestSalary: 85.0,
        placementPercent: 91.0,
        topRecruiters: ['Amazon', 'Microsoft', 'Adobe', 'Paytm', 'Goldman Sachs']
      }
    },
    {
      name: 'International Institute of Information Technology Hyderabad',
      slug: 'iiit-hyderabad',
      location: 'Hyderabad',
      state: 'Telangana',
      fees: 360000,
      rating: 4.7,
      established: 1998,
      accreditation: 'NAAC A++',
      campusSize: 66,
      website: 'https://www.iiit.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      description: 'IIIT Hyderabad is an elite autonomous university focusing exclusively on Information Technology. Its coding culture and research output in AI, Computer Vision, and Natural Language Processing are unmatched.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: 4, seats: 100, fees: 360000 },
        { name: 'B.Tech Electronics & Comm Engineering', duration: 4, seats: 60, fees: 360000 },
        { name: 'Dual Degree (B.Tech + MS) CS', duration: 5, seats: 30, fees: 360000 }
      ],
      placement: {
        avgSalary: 30.5,
        highestSalary: 102.0,
        placementPercent: 100.0,
        topRecruiters: ['Google', 'Facebook', 'Microsoft', 'Bloomberg', 'Uber', 'De Shaw']
      }
    },

    // --- IIMs & Business Schools (10) ---
    {
      name: 'Indian Institute of Management Ahmedabad',
      slug: 'iim-ahmedabad',
      location: 'Ahmedabad',
      state: 'Gujarat',
      fees: 1250000,
      rating: 4.9,
      established: 1961,
      accreditation: 'EQUIS Accredited',
      campusSize: 106,
      website: 'https://www.iima.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
      description: 'IIM Ahmedabad is widely considered the top business school in India and the Asia-Pacific region. Famous for its rigorous Case-Study pedagogy and historical red-brick campus designed by Louis Kahn.',
      courses: [
        { name: 'PGP (Post Graduate Programme in Management)', duration: 2, seats: 380, fees: 1250000 },
        { name: 'PGP-FABM (Food & Agri-Business Management)', duration: 2, seats: 50, fees: 1100000 }
      ],
      placement: {
        avgSalary: 32.8,
        highestSalary: 115.0,
        placementPercent: 100.0,
        topRecruiters: ['McKinsey & Co', 'Boston Consulting Group', 'Bain & Company', 'Goldman Sachs', 'Hindustan Unilever']
      }
    },
    {
      name: 'Indian Institute of Management Bangalore',
      slug: 'iim-bangalore',
      location: 'Bengaluru',
      state: 'Karnataka',
      fees: 1220000,
      rating: 4.8,
      established: 1973,
      accreditation: 'EQUIS Accredited',
      campusSize: 100,
      website: 'https://www.iimb.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1552581230-264079a29871?auto=format&fit=crop&q=80&w=600',
      description: 'IIM Bangalore is a premier MBA destination located in the silicon valley of India. Spanning over an iconic stone-walled campus, it is a leading center for start-up entrepreneurship.',
      courses: [
        { name: 'PGP (Post Graduate Programme)', duration: 2, seats: 410, fees: 1220000 },
        { name: 'PGPM (Enterprise Management)', duration: 2, seats: 80, fees: 1000000 }
      ],
      placement: {
        avgSalary: 31.5,
        highestSalary: 105.0,
        placementPercent: 100.0,
        topRecruiters: ['Boston Consulting Group', 'Kearney', 'Accenture Strategy', 'Microsoft', 'J.P. Morgan']
      }
    },
    {
      name: 'Indian Institute of Management Calcutta',
      slug: 'iim-calcutta',
      location: 'Kolkata',
      state: 'West Bengal',
      fees: 1200000,
      rating: 4.8,
      established: 1961,
      accreditation: 'Triple Crown (AACSB, AMBA, EQUIS)',
      campusSize: 135,
      website: 'https://www.iimcal.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
      description: 'The first IIM to be established. IIM Calcutta is known as the "Finance Campus" of India, producing top quantitative finance minds and investment bankers globally.',
      courses: [
        { name: 'PGP (Post Graduate Programme)', duration: 2, seats: 460, fees: 1200000 }
      ],
      placement: {
        avgSalary: 31.0,
        highestSalary: 110.0,
        placementPercent: 100.0,
        topRecruiters: ['Avendus Capital', 'Barclays', 'Morgan Stanley', 'Citigroup', 'Bain & Co']
      }
    },
    {
      name: 'Indian Institute of Management Lucknow',
      slug: 'iim-lucknow',
      location: 'Lucknow',
      state: 'Uttar Pradesh',
      fees: 995000,
      rating: 4.6,
      established: 1984,
      accreditation: 'AACSB, AMBA',
      campusSize: 200,
      website: 'https://www.iiml.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
      description: 'Known for its extremely rigorous academic standards and beautiful campus on Prabandh Nagar hill, IIM Lucknow is a preferred hub for marketing and general management recruitment.',
      courses: [
        { name: 'PGP (Post Graduate Programme)', duration: 2, seats: 450, fees: 995000 }
      ],
      placement: {
        avgSalary: 28.0,
        highestSalary: 90.0,
        placementPercent: 100.0,
        topRecruiters: ['Amazon', 'P&G', 'Consulting Firm', 'ITC Limited', 'Aditya Birla Group']
      }
    },
    {
      name: 'Indian Institute of Management Kozhikode',
      slug: 'iim-kozhikode',
      location: 'Kozhikode',
      state: 'Kerala',
      fees: 975000,
      rating: 4.5,
      established: 1996,
      accreditation: 'AMBA, EQUIS',
      campusSize: 112,
      website: 'https://www.iimk.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
      description: 'Set on twin scenic hillocks, IIM Kozhikode has pioneered initiatives in diversity, maintaining high ratios of female students and offering specialized liberal arts MBA courses.',
      courses: [
        { name: 'PGP (Post Graduate Programme)', duration: 2, seats: 420, fees: 975000 }
      ],
      placement: {
        avgSalary: 26.5,
        highestSalary: 80.0,
        placementPercent: 100.0,
        topRecruiters: ['Deloitte', 'Cognizant Strategy', 'Microsoft', 'Capgemini', 'Deutsche Bank']
      }
    },
    {
      name: 'Indian Institute of Management Indore',
      slug: 'iim-indore',
      location: 'Indore',
      state: 'Madhya Pradesh',
      fees: 980000,
      rating: 4.5,
      established: 1996,
      accreditation: 'Triple Crown (AACSB, AMBA, EQUIS)',
      campusSize: 193,
      website: 'https://www.iimidr.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
      description: 'IIM Indore offers the unique Integrated Program in Management (IPM), a 5-year course directly taking in students post 12th standard.',
      courses: [
        { name: 'PGP (Post Graduate Programme)', duration: 2, seats: 450, fees: 980000 },
        { name: 'IPM (Integrated Programme in Management)', duration: 5, seats: 150, fees: 800000 }
      ],
      placement: {
        avgSalary: 25.4,
        highestSalary: 74.0,
        placementPercent: 100.0,
        topRecruiters: ['PwC', 'EY', 'GE', 'Optum', 'HDFC Bank', 'ICICI Bank']
      }
    },
    {
      name: 'Indian Institute of Management Shillong',
      slug: 'iim-shillong',
      location: 'Shillong',
      state: 'Meghalaya',
      fees: 920000,
      rating: 4.3,
      established: 2007,
      accreditation: 'AACSB',
      campusSize: 120,
      website: 'https://www.iimshillong.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=600',
      description: 'Located in the pine-covered hills of Meghalaya, IIM Shillong focuses heavily on sustainable development, ethics, and green business concepts.',
      courses: [
        { name: 'PGP (Post Graduate Programme)', duration: 2, seats: 250, fees: 920000 }
      ],
      placement: {
        avgSalary: 22.1,
        highestSalary: 62.0,
        placementPercent: 100.0,
        topRecruiters: ['Nomura', 'J.P. Morgan', 'D.E. Shaw', 'Infosys Consulting']
      }
    },
    {
      name: 'XLRI Xavier School of Management',
      slug: 'xlri-jamshedpur',
      location: 'Jamshedpur',
      state: 'Jharkhand',
      fees: 1150000,
      rating: 4.7,
      established: 1949,
      accreditation: 'AACSB, AMBA',
      campusSize: 40,
      website: 'https://www.xlri.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      description: 'XLRI is India\'s oldest business school and is universally acknowledged as the finest institution in Asia for Human Resource Management (HRM) training.',
      courses: [
        { name: 'PGDM Business Management (BM)', duration: 2, seats: 180, fees: 1150000 },
        { name: 'PGDM Human Resource Management (HRM)', duration: 2, seats: 180, fees: 1150000 }
      ],
      placement: {
        avgSalary: 29.4,
        highestSalary: 98.0,
        placementPercent: 100.0,
        topRecruiters: ['TAS', 'Aditya Birla Group', 'P&G', 'Hindustan Unilever', 'Mercer']
      }
    },
    {
      name: 'Faculty of Management Studies Delhi',
      slug: 'fms-delhi',
      location: 'New Delhi',
      state: 'Delhi',
      fees: 50000,
      rating: 4.7,
      established: 1954,
      accreditation: 'University of Delhi',
      campusSize: 10,
      website: 'http://www.fms.edu',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600',
      description: 'FMS Delhi is famous as the "highest ROI B-school in India". With fees under ₹50,000 per year and placement averages matching top IIMs, it is incredibly competitive.',
      courses: [
        { name: 'MBA Full Time', duration: 2, seats: 287, fees: 50000 }
      ],
      placement: {
        avgSalary: 30.2,
        highestSalary: 95.0,
        placementPercent: 100.0,
        topRecruiters: ['Morgan Stanley', 'HUL', 'ITC', 'Accenture Strategy', 'McKinsey & Co']
      }
    },
    {
      name: 'S.P. Jain Institute of Management and Research',
      slug: 'spjimr-mumbai',
      location: 'Mumbai',
      state: 'Maharashtra',
      fees: 1050000,
      rating: 4.6,
      established: 1981,
      accreditation: 'AACSB, AMBA',
      campusSize: 45,
      website: 'https://www.spjimr.org',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600',
      description: 'Located in Andheri, SPJIMR stands out for its values-based leadership courses and its unique Autumn Internship program, leading to high PPO conversion rates.',
      courses: [
        { name: 'PGDM (Post Graduate Diploma in Management)', duration: 2, seats: 240, fees: 1050000 }
      ],
      placement: {
        avgSalary: 27.8,
        highestSalary: 78.0,
        placementPercent: 100.0,
        topRecruiters: ['Amazon', 'Boston Consulting Group', 'P&G', 'Nestle', 'Citibank']
      }
    },

    // --- Medical Colleges (10) ---
    {
      name: 'All India Institute of Medical Sciences New Delhi',
      slug: 'aiims-delhi',
      location: 'New Delhi',
      state: 'Delhi',
      fees: 50000,
      rating: 4.9,
      established: 1956,
      accreditation: 'NIRF Rank 1 (Medical)',
      campusSize: 115,
      website: 'https://www.aiims.edu',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
      description: 'AIIMS New Delhi is the ultimate medical destination in India. Operating massive referral clinics and state-of-the-art research centers, it provides virtually free medical education to selected merit students.',
      courses: [
        { name: 'MBBS (Bachelor of Medicine, Bachelor of Surgery)', duration: 5, seats: 125, fees: 50000 },
        { name: 'B.Sc. Nursing', duration: 4, seats: 50, fees: 15000 },
        { name: 'MD General Medicine', duration: 3, seats: 30, fees: 20000 }
      ],
      placement: {
        avgSalary: 18.0,
        highestSalary: 45.0,
        placementPercent: 100.0,
        topRecruiters: ['Apollo Hospitals', 'Max Healthcare', 'Fortis Healthcare', 'AIIMS Residency', 'Medanta']
      }
    },
    {
      name: 'Post Graduate Institute of Medical Education and Research',
      slug: 'pgimer-chandigarh',
      location: 'Chandigarh',
      state: 'Chandigarh',
      fees: 60000,
      rating: 4.8,
      established: 1962,
      accreditation: 'NIRF Rank 2 (Medical)',
      campusSize: 277,
      website: 'https://pgimer.edu.in',
      imageUrl: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=600',
      description: 'PGIMER Chandigarh is an elite postgraduate medical education center, known for high clinical caseloads and advanced specialty medical research.',
      courses: [
        { name: 'MD Pediatrics', duration: 3, seats: 15, fees: 25000 },
        { name: 'MS General Surgery', duration: 3, seats: 15, fees: 25000 }
      ],
      placement: {
        avgSalary: 20.5,
        highestSalary: 48.0,
        placementPercent: 100.0,
        topRecruiters: ['Medanta', 'Max Hospitals', 'WHO India', 'Manipal Health']
      }
    },
    {
      name: 'Christian Medical College Vellore',
      slug: 'cmc-vellore',
      location: 'Veller',
      state: 'Tamil Nadu',
      fees: 110000,
      rating: 4.8,
      established: 1900,
      accreditation: 'NAAC A',
      campusSize: 200,
      website: 'https://www.cmch-vellore.edu',
      imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
      description: 'CMC Vellore is a historic medical institute known for pioneering breakthroughs, including performing India\'s first successful kidney transplant.',
      courses: [
        { name: 'MBBS', duration: 5, seats: 100, fees: 110000 },
        { name: 'B.Sc. Physiotherapy', duration: 3, seats: 30, fees: 60000 }
      ],
      placement: {
        avgSalary: 12.0,
        highestSalary: 28.0,
        placementPercent: 98.0,
        topRecruiters: ['CMC Hospital', 'Aravind Eye Care', 'Apollo Group', 'St. John\'s Residency']
      }
    },
    {
      name: 'Jawaharlal Institute of Postgraduate Medical Education & Research',
      slug: 'jipmer-puducherry',
      location: 'Puducherry',
      state: 'Puducherry',
      fees: 55000,
      rating: 4.7,
      established: 1823,
      accreditation: 'Institute of National Importance',
      campusSize: 195,
      website: 'https://www.jipmer.edu.in',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
      description: 'Dating back to the French administration in Puducherry, JIPMER provides top-class clinical residency programs and free healthcare services to lakhs of patients.',
      courses: [
        { name: 'MBBS', duration: 5, seats: 150, fees: 55000 },
        { name: 'MD Radiology', duration: 3, seats: 10, fees: 22000 }
      ],
      placement: {
        avgSalary: 14.5,
        highestSalary: 32.0,
        placementPercent: 100.0,
        topRecruiters: ['JIPMER Residency', 'Fortis Health', 'Artemis Solutions', 'Aster DM']
      }
    },
    {
      name: 'King George\'s Medical University',
      slug: 'kgmu-lucknow',
      location: 'Lucknow',
      state: 'Uttar Pradesh',
      fees: 95000,
      rating: 4.6,
      established: 1911,
      accreditation: 'NAAC A+',
      campusSize: 100,
      website: 'http://www.kgmu.org',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
      description: 'KGMU is a premier state medical university in Uttar Pradesh, renowned for its massive trauma center and historic architectural building.',
      courses: [
        { name: 'MBBS', duration: 5, seats: 250, fees: 95000 },
        { name: 'BDS (Bachelor of Dental Surgery)', duration: 4, seats: 70, fees: 75000 }
      ],
      placement: {
        avgSalary: 11.8,
        highestSalary: 25.0,
        placementPercent: 96.5,
        topRecruiters: ['KGMU Trauma Center', 'Medanta Lucknow', 'Apollo Clinics', 'U.P. Govt Services']
      }
    },
    {
      name: 'Banaras Hindu University Institute of Medical Sciences',
      slug: 'ims-bhu-varanasi',
      location: 'Varanasi',
      state: 'Uttar Pradesh',
      fees: 62000,
      rating: 4.6,
      established: 1960,
      accreditation: 'NAAC A++',
      campusSize: 150,
      website: 'https://www.bhu.ac.in/ims',
      imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
      description: 'IMS-BHU offers courses combining modern clinical medicine with traditional Ayurvedic healing science, supported by a massive hospital structure.',
      courses: [
        { name: 'MBBS', duration: 5, seats: 100, fees: 62000 },
        { name: 'BAMS (Ayurveda)', duration: 5, seats: 60, fees: 30000 }
      ],
      placement: {
        avgSalary: 11.2,
        highestSalary: 24.0,
        placementPercent: 97.0,
        topRecruiters: ['IMS Medical Hospital', 'Sir Sunderlal Hospital', 'Govt Health Centers']
      }
    },
    {
      name: 'Kasturba Medical College Manipal',
      slug: 'kmc-manipal',
      location: 'Manipal',
      state: 'Karnataka',
      fees: 1780000,
      rating: 4.6,
      established: 1953,
      accreditation: 'NAAC A++',
      campusSize: 150,
      website: 'https://manipal.edu/kmc-manipal.html',
      imageUrl: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&q=80&w=600',
      description: 'KMC Manipal was the first private medical college in India. It features world-class simulation labs and high international academic collaborations.',
      courses: [
        { name: 'MBBS', duration: 5, seats: 250, fees: 1780000 }
      ],
      placement: {
        avgSalary: 13.8,
        highestSalary: 30.0,
        placementPercent: 98.5,
        topRecruiters: ['Manipal Hospitals Group', 'Apollo Hospitals', 'Max Healthcare', 'Aster']
      }
    },
    {
      name: 'St. John\'s Medical College',
      slug: 'st-johns-medical',
      location: 'Bengaluru',
      state: 'Karnataka',
      fees: 850000,
      rating: 4.5,
      established: 1963,
      accreditation: 'NAAC A++',
      campusSize: 140,
      website: 'https://www.stjohns.in',
      imageUrl: 'https://images.unsplash.com/photo-1538108149393-fdfd81d1793b?auto=format&fit=crop&q=80&w=600',
      description: 'St. John\'s is recognized for high ethical standards and its mandatory rural service program, ensuring all graduating students practice in rural clinics.',
      courses: [
        { name: 'MBBS', duration: 5, seats: 150, fees: 850000 }
      ],
      placement: {
        avgSalary: 10.8,
        highestSalary: 22.0,
        placementPercent: 99.0,
        topRecruiters: ['St. John\'s Hospital Network', 'Narayana Health', 'Columbia Asia']
      }
    },
    {
      name: 'Madras Medical College',
      slug: 'madras-medical-college',
      location: 'Chennai',
      state: 'Tamil Nadu',
      fees: 48000,
      rating: 4.6,
      established: 1835,
      accreditation: 'NAAC A',
      campusSize: 50,
      website: 'http://www.mmc.ac.in',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
      description: 'The third oldest medical college in India. MMC Chennai is a highly respected state-run tertiary referral center boasting massive outpatient counts.',
      courses: [
        { name: 'MBBS', duration: 5, seats: 250, fees: 48000 }
      ],
      placement: {
        avgSalary: 9.8,
        highestSalary: 20.0,
        placementPercent: 98.0,
        topRecruiters: ['Government General Hospital Chennai', 'Apollo', 'MIOT Hospitals']
      }
    },
    {
      name: 'Grant Medical College and Sir J.J. Group of Hospitals',
      slug: 'grant-medical-mumbai',
      location: 'Mumbai',
      state: 'Maharashtra',
      fees: 52000,
      rating: 4.5,
      established: 1845,
      accreditation: 'NAAC A',
      campusSize: 44,
      website: 'http://gmcjjh.org',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
      description: 'Grant Medical College J.J. Hospital is a landmark institution in South Mumbai. It provides vast clinical exposure across thousands of patient beds.',
      courses: [
        { name: 'MBBS', duration: 5, seats: 250, fees: 52000 }
      ],
      placement: {
        avgSalary: 10.2,
        highestSalary: 22.0,
        placementPercent: 96.0,
        topRecruiters: ['J.J. Hospital Group', 'Hinduja Hospital', 'Lilavati Hospital', 'Apex Health']
      }
    }
  ];

  // 4. Seed Colleges, Courses, and Placements
  let reviewSeedCount = 0;
  for (const col of collegesData) {
    const { courses, placement, ...collegeFields } = col;

    const dbCollege = await prisma.college.create({
      data: collegeFields,
    });

    // Seed Courses
    for (const course of courses) {
      await prisma.course.create({
        data: {
          ...course,
          collegeId: dbCollege.id,
        },
      });
    }

    // Seed Placement
    await prisma.placement.create({
      data: {
        ...placement,
        collegeId: dbCollege.id,
      },
    });

    // Seed 2 to 3 reviews per college
    const reviews = [
      {
        title: 'Outstanding Academics & Placement Support',
        body: `Highly academic environment at ${col.name}. The faculty is knowledgeable, and placement statistics are real. The infrastructure is top notch, although academic schedule is extremely rigorous.`,
        rating: 4.5,
      },
      {
        title: 'Superb Campus Life and Connections',
        body: `Loved my years here. The peer group is extremely brilliant, and the startup/cultural clubs are active. Placements are great and recruiters value the brand name. Highly recommend.`,
        rating: 5.0,
      },
      {
        title: 'Rigorous Curriculum but Great Outcomes',
        body: `The course load is heavy and assignments are hard. But the overall career options are worth the pressure. Hostels could be updated, but basic utilities are well covered.`,
        rating: 4.0,
      }
    ];

    // Pick 2 random reviews out of 3, or write all 3
    const numReviews = Math.floor(Math.random() * 2) + 2; // 2 or 3 reviews
    for (let i = 0; i < numReviews; i++) {
      const reviewUser = dbUsers[reviewSeedCount % dbUsers.length];
      reviewSeedCount++;
      await prisma.review.create({
        data: {
          title: reviews[i].title,
          body: reviews[i].body,
          rating: reviews[i].rating,
          collegeId: dbCollege.id,
          userId: reviewUser.id,
        },
      });
    }
  }

  console.log(`Seeded ${collegesData.length} colleges, associated courses, placements, and reviews.`);

  // 5. Create PostgreSQL Full-Text Search GIN Index using raw SQL
  console.log('Creating full-text search indexes...');
  try {
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS college_search_idx ON "College" 
      USING gin(to_tsvector('english', name || ' ' || location || ' ' || state || ' ' || description));
    `);
    console.log('Full-text search index created successfully!');
  } catch (error) {
    console.error('Error creating search index:', error);
  }

  console.log('Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
