import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const colleges = [
  {
    name: 'Indian Institute of Technology Delhi',
    location: 'Delhi',
    fees: 2000000,
    rating: 4.9,
    courses: ['B.Tech Computer Science', 'B.Tech Electrical Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Civil Engineering'],
    placementRate: 98,
    overview:
      'IIT Delhi is one of the premier engineering institutions in India, known for its exceptional faculty, research opportunities, and strong industry connections. The campus provides state-of-the-art infrastructure and fosters innovation.',
    placements: {
      averageSalary: 24,
      highestSalary: 85,
      topRecruiters: ['Google', 'Microsoft', 'McKinsey', 'Goldman Sachs', 'Meta', 'Amazon'],
      placementRate: 98
    },
    reviews: [
      { author: 'Raj Kumar', rating: 5, comment: 'Excellent education and amazing placements. Life-changing experience.', date: '2024-03-15' },
      { author: 'Priya Sharma', rating: 5, comment: 'Top-notch faculty and industry exposure. Highly recommend!', date: '2024-02-10' },
      { author: 'Amit Patel', rating: 4, comment: 'Great college, but hostel facilities could be better.', date: '2024-01-20' }
    ]
  },
  {
    name: 'Indian Institute of Technology Bombay',
    location: 'Mumbai',
    fees: 2000000,
    rating: 4.9,
    courses: ['B.Tech Computer Science', 'B.Tech Electrical Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Chemical Engineering'],
    placementRate: 97,
    overview:
      'IIT Bombay is among the top engineering colleges globally, offering world-class education and research. Located in Mumbai, it provides excellent internship and job opportunities with leading companies.',
    placements: {
      averageSalary: 25,
      highestSalary: 90,
      topRecruiters: ['Google', 'Microsoft', 'JPMorgan', 'Goldman Sachs', 'Bloomberg', 'McKinsey'],
      placementRate: 97
    },
    reviews: [
      { author: 'Vikram Singh', rating: 5, comment: 'World-class campus and incredible peer group. Highly recommended!', date: '2024-03-10' },
      { author: 'Neha Gupta', rating: 5, comment: 'Best college experience ever. Great clubs and activities too.', date: '2024-02-05' },
      { author: 'Rohan Desai', rating: 4, comment: 'Outstanding placements but very competitive environment.', date: '2024-01-15' }
    ]
  },
  {
    name: 'Indian Institute of Technology Madras',
    location: 'Chennai',
    fees: 2000000,
    rating: 4.8,
    courses: ['B.Tech Computer Science', 'B.Tech Electrical Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Aerospace Engineering'],
    placementRate: 96,
    overview:
      'IIT Madras is known for its strong academics, cutting-edge research, and excellent placements. The college provides a nurturing environment for innovation and entrepreneurship.',
    placements: {
      averageSalary: 23,
      highestSalary: 80,
      topRecruiters: ['Google', 'Microsoft', 'Adobe', 'Cisco', 'Amazon', 'Apple'],
      placementRate: 96
    },
    reviews: [
      { author: 'Sanjay Kumar', rating: 5, comment: 'Excellent faculty and research opportunities. Loved my time here.', date: '2024-03-05' },
      { author: 'Anjali Reddy', rating: 4, comment: 'Good placements and great infrastructure. A bit crowded though.', date: '2024-02-01' },
      { author: 'Arjun Menon', rating: 5, comment: 'Strong technical foundation. Perfect for tech careers.', date: '2024-01-10' }
    ]
  },
  {
    name: 'Indian Institute of Technology Kanpur',
    location: 'Kanpur',
    fees: 2000000,
    rating: 4.8,
    courses: ['B.Tech Computer Science', 'B.Tech Electrical Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Production Engineering'],
    placementRate: 95,
    overview:
      'IIT Kanpur is a leading engineering institute with strong industry partnerships and excellent academic programs. Known for producing skilled engineers with strong problem-solving abilities.',
    placements: {
      averageSalary: 22,
      highestSalary: 78,
      topRecruiters: ['Microsoft', 'Google', 'Amazon', 'Flipkart', 'Goldman Sachs', 'Morgan Stanley'],
      placementRate: 95
    },
    reviews: [
      { author: 'Vivek Sharma', rating: 4, comment: 'Strong technical curriculum. Great preparation for industry.', date: '2024-03-01' },
      { author: 'Meera Singh', rating: 4, comment: 'Good college with dedicated faculty and good placements.', date: '2024-02-15' },
      { author: 'Nikhil Verma', rating: 4, comment: 'Located in Kanpur, which is a plus for focused studies.', date: '2024-01-05' }
    ]
  },
  {
    name: 'National Institute of Technology Delhi',
    location: 'Delhi',
    fees: 600000,
    rating: 4.2,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Civil Engineering'],
    placementRate: 88,
    overview:
      'NIT Delhi offers affordable quality engineering education with good placements. Strong faculty and active student community make it an excellent choice for engineering aspirants.',
    placements: {
      averageSalary: 12,
      highestSalary: 45,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'HCL', 'IBM', 'Accenture'],
      placementRate: 88
    },
    reviews: [
      { author: 'Rahul Gupta', rating: 4, comment: 'Good value for money. Solid placements and infrastructure.', date: '2024-03-12' },
      { author: 'Sakshi Jain', rating: 4, comment: 'Friendly environment and supportive faculty. Worth joining!', date: '2024-02-20' },
      { author: 'Deepak Rao', rating: 3, comment: 'Decent college but infrastructure could be better.', date: '2024-01-25' }
    ]
  },
  {
    name: 'National Institute of Technology Bangalore',
    location: 'Bangalore',
    fees: 600000,
    rating: 4.3,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Chemical Engineering'],
    placementRate: 90,
    overview:
      'NIT Bangalore is one of the premier NITs located in the tech capital of India. It offers excellent academic programs with strong industry connections and good placement records.',
    placements: {
      averageSalary: 13,
      highestSalary: 50,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'IBM', 'Google'],
      placementRate: 90
    },
    reviews: [
      { author: 'Gaurav Negi', rating: 4, comment: 'Excellent location and good academics. Great college experience!', date: '2024-03-08' },
      { author: 'Divya Malik', rating: 4, comment: 'Strong technical training and good placement support.', date: '2024-02-18' },
      { author: 'Pradeep Kumar', rating: 4, comment: 'Bangalore location is perfect for tech jobs. Highly satisfied.', date: '2024-01-30' }
    ]
  },
  {
    name: 'National Institute of Technology Trichy',
    location: 'Trichy',
    fees: 600000,
    rating: 4.1,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Production Engineering'],
    placementRate: 87,
    overview:
      'NIT Trichy is a well-established engineering institute with a strong alumni network. The college focuses on both academics and overall personality development of students.',
    placements: {
      averageSalary: 11,
      highestSalary: 42,
      topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'Wipro', 'HCL', 'Tech Mahindra'],
      placementRate: 87
    },
    reviews: [
      { author: 'Karthik Reddy', rating: 4, comment: 'Strong alumni network. Good support for placements.', date: '2024-03-15' },
      { author: 'Sneha Kumar', rating: 3, comment: 'Good college but location could be better.', date: '2024-02-22' },
      { author: 'Arun Singh', rating: 4, comment: 'Decent infrastructure and supportive faculty.', date: '2024-01-28' }
    ]
  },
  {
    name: 'Birla Institute of Technology and Science Pilani',
    location: 'Pilani',
    fees: 1500000,
    rating: 4.5,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Chemical Engineering'],
    placementRate: 94,
    overview:
      'BITS Pilani is one of the top private engineering colleges in India. Known for its flexible curriculum, active placement cell, and strong academic standards.',
    placements: {
      averageSalary: 18,
      highestSalary: 65,
      topRecruiters: ['Microsoft', 'Google', 'Amazon', 'Goldman Sachs', 'Adobe', 'Flipkart'],
      placementRate: 94
    },
    reviews: [
      { author: 'Aditya Jain', rating: 5, comment: 'Flexible curriculum and excellent placements. Highly recommended!', date: '2024-03-10' },
      { author: 'Ananya Verma', rating: 4, comment: 'Great peer group and good placement opportunities.', date: '2024-02-12' },
      { author: 'Bhavesh Patel', rating: 5, comment: 'One of the best engineering colleges in India. Worth the fees.', date: '2024-01-20' }
    ]
  },
  {
    name: 'Manipal Institute of Technology',
    location: 'Manipal',
    fees: 1200000,
    rating: 4.2,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Aerospace Engineering'],
    placementRate: 88,
    overview:
      'MIT Manipal is known for its quality education and global exposure. The institute has tie-ups with leading companies and provides excellent internship opportunities.',
    placements: {
      averageSalary: 14,
      highestSalary: 55,
      topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'Wipro', 'Google', 'Microsoft'],
      placementRate: 88
    },
    reviews: [
      { author: 'Rishabh Sharma', rating: 4, comment: 'Good infrastructure and international exposure. Great college!', date: '2024-03-05' },
      { author: 'Shreya Singh', rating: 4, comment: 'Beautiful campus and supportive faculty. Enjoyed my stay.', date: '2024-02-10' },
      { author: 'Varun Chopra', rating: 3, comment: 'Good college but expensive. Consider fees before joining.', date: '2024-01-18' }
    ]
  },
  {
    name: 'VIT University',
    location: 'Vellore',
    fees: 1100000,
    rating: 4.0,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Biomedical Engineering'],
    placementRate: 85,
    overview:
      'VIT University is one of the largest engineering colleges in India with strong academics and good placements. Known for producing skilled engineers across various domains.',
    placements: {
      averageSalary: 12,
      highestSalary: 48,
      topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'IBM', 'Tech Mahindra', 'Accenture'],
      placementRate: 85
    },
    reviews: [
      { author: 'Ashok Kumar', rating: 4, comment: 'Large campus with good infrastructure. Decent placements.', date: '2024-03-02' },
      { author: 'Priya Nair', rating: 3, comment: 'Good technical education but very crowded classrooms.', date: '2024-02-08' },
      { author: 'Rajesh Singh', rating: 4, comment: 'Good value for money. Recommended for engineering aspirants.', date: '2024-01-15' }
    ]
  },
  {
    name: 'Delhi Technological University',
    location: 'Delhi',
    fees: 500000,
    rating: 3.8,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Production Engineering'],
    placementRate: 82,
    overview:
      'DTU is a premier government engineering college in Delhi offering quality education at affordable fees. Strong focus on academics and industry-ready skills.',
    placements: {
      averageSalary: 10,
      highestSalary: 38,
      topRecruiters: ['TCS', 'Wipro', 'Infosys', 'HCL', 'Cognizant', 'Tech Mahindra'],
      placementRate: 82
    },
    reviews: [
      { author: 'Mohan Singh', rating: 4, comment: 'Affordable government college with good academics.', date: '2024-03-08' },
      { author: 'Neha Dutta', rating: 3, comment: 'Good academics but infrastructure needs improvement.', date: '2024-02-14' },
      { author: 'Saurav Ghosh', rating: 3, comment: 'Decent college. Placements are okay, not exceptional.', date: '2024-01-22' }
    ]
  },
  {
    name: 'Shiv Nadar University',
    location: 'Chennai',
    fees: 1300000,
    rating: 4.3,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Biomedical Engineering'],
    placementRate: 89,
    overview:
      'Shiv Nadar University is known for its innovative curriculum, industry collaborations, and holistic education approach. The university focuses on developing entrepreneurial mindset.',
    placements: {
      averageSalary: 15,
      highestSalary: 58,
      topRecruiters: ['Microsoft', 'Google', 'Amazon', 'TCS', 'Infosys', 'Accenture'],
      placementRate: 89
    },
    reviews: [
      { author: 'Arjun Das', rating: 4, comment: 'Innovative curriculum and great placement opportunities!', date: '2024-03-12' },
      { author: 'Veena Sharma', rating: 4, comment: 'Beautiful campus and supportive environment. Highly satisfied.', date: '2024-02-18' },
      { author: 'Karim Khan', rating: 4, comment: 'Good industry exposure and entrepreneurship support.', date: '2024-01-25' }
    ]
  },
  {
    name: 'Pune Institute of Computer Technology',
    location: 'Pune',
    fees: 450000,
    rating: 3.9,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Information Technology'],
    placementRate: 83,
    overview:
      'PICT is a well-established engineering college in Pune with a strong focus on computer science and IT. Known for producing software engineers with strong technical skills.',
    placements: {
      averageSalary: 11,
      highestSalary: 44,
      topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'Accenture', 'Wipro', 'Google'],
      placementRate: 83
    },
    reviews: [
      { author: 'Nitin Prabhu', rating: 4, comment: 'Great for CS students. Pune location is bonus for IT jobs.', date: '2024-03-10' },
      { author: 'Tara Nair', rating: 3, comment: 'Good academics but hostel facilities are basic.', date: '2024-02-16' },
      { author: 'Siddharth Jain', rating: 4, comment: 'Solid college with decent placements and good faculty.', date: '2024-01-28' }
    ]
  },
  {
    name: 'College of Engineering Pune',
    location: 'Pune',
    fees: 380000,
    rating: 3.7,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Chemical Engineering'],
    placementRate: 80,
    overview:
      'Established in 1854, College of Engineering Pune is one of the oldest engineering colleges in Asia. Known for its heritage, strong alumni network, and quality education.',
    placements: {
      averageSalary: 10,
      highestSalary: 40,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Tech Mahindra', 'HCL', 'Cognizant'],
      placementRate: 80
    },
    reviews: [
      { author: 'Rahul Jadhav', rating: 3, comment: 'Historic college but infrastructure is outdated.', date: '2024-03-05' },
      { author: 'Sneha Mehta', rating: 4, comment: 'Good academics and strong alumni network.', date: '2024-02-12' },
      { author: 'Amol Singh', rating: 3, comment: 'Decent college for engineering education.', date: '2024-01-20' }
    ]
  },
  {
    name: 'Anna University (Regional Campus) Coimbatore',
    location: 'Coimbatore',
    fees: 300000,
    rating: 3.5,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Civil Engineering'],
    placementRate: 75,
    overview:
      'Anna University Coimbatore provides quality engineering education at affordable costs. The college focuses on developing technical skills and industry readiness.',
    placements: {
      averageSalary: 9,
      highestSalary: 35,
      topRecruiters: ['TCS', 'Infosys', 'Tech Mahindra', 'Cognizant', 'HCL', 'Accenture'],
      placementRate: 75
    },
    reviews: [
      { author: 'Gopal Reddy', rating: 3, comment: 'Government college with decent academics and low fees.', date: '2024-03-15' },
      { author: 'Lakshmi Devi', rating: 3, comment: 'Okay for engineering education. Placements are average.', date: '2024-02-20' },
      { author: 'Sathish Kumar', rating: 3, comment: 'Good place to study if looking for affordable education.', date: '2024-01-25' }
    ]
  },
  {
    name: 'Vellore Institute of Technology',
    location: 'Vellore',
    fees: 1000000,
    rating: 3.9,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Civil Engineering'],
    placementRate: 82,
    overview:
      'VIT Vellore is a leading engineering institution known for its research initiatives and industry partnerships. The college provides excellent infrastructure and faculty support.',
    placements: {
      averageSalary: 11,
      highestSalary: 46,
      topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'IBM', 'Accenture', 'Wipro'],
      placementRate: 82
    },
    reviews: [
      { author: 'Ramesh Babu', rating: 4, comment: 'Good infrastructure and solid academics. Recommended!', date: '2024-03-08' },
      { author: 'Kavya Iyer', rating: 3, comment: 'Decent college but fees are a bit high.', date: '2024-02-14' },
      { author: 'Harish Kumar', rating: 4, comment: 'Great campus and supportive environment.', date: '2024-01-22' }
    ]
  },
  {
    name: 'PSG College of Technology',
    location: 'Coimbatore',
    fees: 850000,
    rating: 4.1,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Production Engineering'],
    placementRate: 86,
    overview:
      'PSG College of Technology is a prestigious private engineering college known for its exceptional faculty and strong industry connections. The college promotes innovation and entrepreneurship.',
    placements: {
      averageSalary: 13,
      highestSalary: 52,
      topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'Accenture', 'IBM', 'Google'],
      placementRate: 86
    },
    reviews: [
      { author: 'Sridhar Nayak', rating: 4, comment: 'Excellent faculty and good placement opportunities.', date: '2024-03-10' },
      { author: 'Pooja Mishra', rating: 4, comment: 'Great college with strong academics and industry exposure.', date: '2024-02-18' },
      { author: 'Vinod Kumar', rating: 4, comment: 'Worth joining for quality education in Tamil Nadu.', date: '2024-01-28' }
    ]
  },
  {
    name: 'Shanthi Giri Institute of Science and Technology',
    location: 'Hyderabad',
    fees: 700000,
    rating: 3.6,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Information Technology'],
    placementRate: 78,
    overview:
      'SGSITS provides affordable engineering education with focus on practical skills and industry readiness. The college has tie-ups with many multinational companies.',
    placements: {
      averageSalary: 10,
      highestSalary: 40,
      topRecruiters: ['TCS', 'Infosys', 'Tech Mahindra', 'Cognizant', 'Wipro', 'HCL'],
      placementRate: 78
    },
    reviews: [
      { author: 'Raghu Varma', rating: 3, comment: 'Good value for money. Decent placements and infrastructure.', date: '2024-03-12' },
      { author: 'Divya Reddy', rating: 3, comment: 'Okay college for engineering aspirants in Hyderabad.', date: '2024-02-20' },
      { author: 'Aryan Gupta', rating: 4, comment: 'Strong technical curriculum. Good preparation for jobs.', date: '2024-01-28' }
    ]
  },
  {
    name: 'Lovely Professional University',
    location: 'Jalandhar',
    fees: 950000,
    rating: 3.7,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Civil Engineering'],
    placementRate: 79,
    overview:
      'LPU is one of India\'s largest private engineering colleges with state-of-the-art infrastructure. Known for fostering entrepreneurship and providing diverse learning opportunities.',
    placements: {
      averageSalary: 11,
      highestSalary: 42,
      topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'Accenture', 'Tech Mahindra', 'HCL'],
      placementRate: 79
    },
    reviews: [
      { author: 'Jaswant Singh', rating: 3, comment: 'Large campus with decent infrastructure and placements.', date: '2024-03-08' },
      { author: 'Harpreet Kaur', rating: 3, comment: 'Good college for engineering but very crowded.', date: '2024-02-16' },
      { author: 'Naveen Kumar', rating: 3, comment: 'Okay placements but expected better from an engineering college.', date: '2024-01-24' }
    ]
  },
  {
    name: 'Christ University',
    location: 'Bangalore',
    fees: 1100000,
    rating: 3.8,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Information Technology'],
    placementRate: 81,
    overview:
      'Christ University is a faith-based educational institution known for holistic education and strong values. The college provides quality academics with emphasis on character development.',
    placements: {
      averageSalary: 11,
      highestSalary: 44,
      topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'Wipro', 'Tech Mahindra', 'Accenture'],
      placementRate: 81
    },
    reviews: [
      { author: 'Michael Fernandes', rating: 3, comment: 'Good overall education experience with focus on values.', date: '2024-03-05' },
      { author: 'Priyanka Nair', rating: 4, comment: 'Beautiful campus and supportive community.', date: '2024-02-12' },
      { author: 'Deepak Malhotra', rating: 3, comment: 'Decent placements but fees are on the higher side.', date: '2024-01-20' }
    ]
  },
  {
    name: 'Amrita School of Engineering',
    location: 'Coimbatore',
    fees: 1050000,
    rating: 4.0,
    courses: ['B.Tech Computer Science', 'B.Tech Electronics Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Biomedical Engineering'],
    placementRate: 84,
    overview:
      'Amrita School of Engineering is known for its research focus and industry collaborations. The college emphasizes experiential learning and provides excellent infrastructure.',
    placements: {
      averageSalary: 12,
      highestSalary: 48,
      topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'IBM', 'Accenture', 'Microsoft'],
      placementRate: 84
    },
    reviews: [
      { author: 'Sundar Krishnan', rating: 4, comment: 'Excellent research opportunities and good placements.', date: '2024-03-10' },
      { author: 'Ritu Sharma', rating: 4, comment: 'Great faculty and strong industry connections.', date: '2024-02-18' },
      { author: 'Varun Pillai', rating: 3, comment: 'Good college but location in Coimbatore is a bit isolated.', date: '2024-01-28' }
    ]
  }
];

async function main() {
  console.log('Seeding database with colleges...');

  await prisma.college.deleteMany();

  const createdColleges = await prisma.college.createMany({
    data: colleges,
    skipDuplicates: true
  });

  console.log(`Successfully seeded ${createdColleges.count} colleges!`);
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
