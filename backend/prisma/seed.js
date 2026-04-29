"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const colleges = [
    {
        name: 'National Institute of Technology, Trichy',
        location: 'Tiruchirappalli, Tamil Nadu',
        fees: 180000,
        rating: 4.7,
        placementRate: 92,
        overview: 'A high-demand engineering campus with strong national placement reach.',
        courses: ['CSE', 'ECE', 'Mechanical Engineering', 'Civil Engineering'],
        placements: { averagePackage: '16.5 LPA', highestPackage: '52 LPA', recruiters: ['Google', 'Microsoft', 'Amazon'] },
        reviews: [
            { author: 'Aarav', rating: 5, comment: 'Excellent academics and placement support.' },
            { author: 'Meera', rating: 4.5, comment: 'Balanced campus life with strong peer group.' }
        ]
    },
    {
        name: 'Indian Institute of Technology, Indore',
        location: 'Indore, Madhya Pradesh',
        fees: 220000,
        rating: 4.8,
        placementRate: 95,
        overview: 'Research-focused engineering institute with strong industry tie-ups.',
        courses: ['CSE', 'Data Science', 'Electrical Engineering', 'Physics'],
        placements: { averagePackage: '18.2 LPA', highestPackage: '65 LPA', recruiters: ['Google', 'Deutsche Bank', 'Oracle'] },
        reviews: [
            { author: 'Riya', rating: 5, comment: 'Great labs and excellent internships.' },
            { author: 'Kabir', rating: 4.7, comment: 'Competitive environment but worth it.' }
        ]
    },
    {
        name: 'Vellore Institute of Technology',
        location: 'Vellore, Tamil Nadu',
        fees: 320000,
        rating: 4.4,
        placementRate: 84,
        overview: 'Large private university with broad course offerings and active placements.',
        courses: ['IT', 'CSE', 'AI & ML', 'Electronics'],
        placements: { averagePackage: '9.2 LPA', highestPackage: '52 LPA', recruiters: ['Amazon', 'Cisco', 'Capgemini'] },
        reviews: [
            { author: 'Nikhil', rating: 4.3, comment: 'Huge campus and many opportunities.' },
            { author: 'Sana', rating: 4.2, comment: 'Good exposure if you stay proactive.' }
        ]
    },
    {
        name: 'Delhi Technological University',
        location: 'New Delhi, Delhi',
        fees: 155000,
        rating: 4.5,
        placementRate: 88,
        overview: 'Well-known public university with strong engineering outcomes.',
        courses: ['CSE', 'EE', 'ME', 'SE'],
        placements: { averagePackage: '12.1 LPA', highestPackage: '50 LPA', recruiters: ['Adobe', 'Microsoft', 'ZS'] },
        reviews: [
            { author: 'Isha', rating: 4.6, comment: 'Strong peer network and location advantage.' },
            { author: 'Arjun', rating: 4.4, comment: 'Placements are consistently solid.' }
        ]
    },
    {
        name: 'Manipal Institute of Technology',
        location: 'Manipal, Karnataka',
        fees: 390000,
        rating: 4.3,
        placementRate: 81,
        overview: 'Private institute with a broad alumni base and strong brand recognition.',
        courses: ['CSE', 'ECE', 'Mechatronics', 'Biomedical Engineering'],
        placements: { averagePackage: '8.8 LPA', highestPackage: '44 LPA', recruiters: ['Accenture', 'Amazon', 'Infosys'] },
        reviews: [
            { author: 'Tanya', rating: 4.1, comment: 'Great campus life and decent placements.' },
            { author: 'Rahul', rating: 4.0, comment: 'Good if you make the most of the ecosystem.' }
        ]
    },
    {
        name: 'Jamia Millia Islamia',
        location: 'New Delhi, Delhi',
        fees: 90000,
        rating: 4.2,
        placementRate: 79,
        overview: 'Affordable and respected university with an urban campus advantage.',
        courses: ['IT', 'ECE', 'Architecture', 'Management'],
        placements: { averagePackage: '7.6 LPA', highestPackage: '28 LPA', recruiters: ['Deloitte', 'Wipro', 'TCS'] },
        reviews: [
            { author: 'Pooja', rating: 4.1, comment: 'Value for money with a strong location.' },
            { author: 'Farhan', rating: 4.0, comment: 'Solid academics and accessible fees.' }
        ]
    },
    {
        name: 'SRM Institute of Science and Technology',
        location: 'Chennai, Tamil Nadu',
        fees: 280000,
        rating: 4.1,
        placementRate: 82,
        overview: 'Popular private university with expansive intake and placement activity.',
        courses: ['CSE', 'AI & ML', 'ECE', 'Biotechnology'],
        placements: { averagePackage: '7.9 LPA', highestPackage: '40 LPA', recruiters: ['IBM', 'Amazon', 'Zoho'] },
        reviews: [
            { author: 'Karan', rating: 4.0, comment: 'Big campus with many options.' },
            { author: 'Ananya', rating: 4.1, comment: 'Good placement support for motivated students.' }
        ]
    },
    {
        name: 'University of Hyderabad',
        location: 'Hyderabad, Telangana',
        fees: 65000,
        rating: 4.6,
        placementRate: 86,
        overview: 'Affordable central university with strong research and academic outcomes.',
        courses: ['CSE', 'Mathematics', 'Physics', 'Economics'],
        placements: { averagePackage: '10.4 LPA', highestPackage: '34 LPA', recruiters: ['Microsoft', 'Amazon', 'TCS'] },
        reviews: [
            { author: 'Siddharth', rating: 4.7, comment: 'Strong academic culture and low fees.' },
            { author: 'Nisha', rating: 4.5, comment: 'Great value for students focused on learning.' }
        ]
    }
];
async function main() {
    await prisma.savedCollege.deleteMany();
    await prisma.savedComparison.deleteMany();
    await prisma.question.deleteMany();
    await prisma.user.deleteMany();
    await prisma.college.deleteMany();
    await prisma.college.createMany({ data: colleges });
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map