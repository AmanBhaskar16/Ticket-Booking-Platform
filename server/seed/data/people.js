// Demo audience accounts. They write the seeded reviews; they cannot sign in
// (each gets a random password) and use reserved example.com addresses.
export const PEOPLE = [
    "Aarav Sharma", "Ananya Iyer", "Rohan Mehta", "Priya Nair", "Vikram Singh", "Sneha Kulkarni",
    "Arjun Reddy", "Kavya Menon", "Aditya Verma", "Ishita Banerjee", "Karan Malhotra", "Meera Pillai",
    "Siddharth Rao", "Pooja Deshmukh", "Rahul Gupta", "Neha Chauhan", "Varun Krishnan", "Riya Sen",
    "Manish Tiwari", "Divya Hegde", "Nikhil Joshi", "Tanvi Shah", "Harsh Agarwal", "Shreya Ghosh",
    "Abhishek Yadav", "Nandini Murthy", "Kunal Kapoor", "Aishwarya Raman", "Saurabh Pandey", "Lakshmi Narayanan",
    "Yash Patil", "Fatima Sheikh", "Gaurav Bhatia", "Sanya Arora", "Pranav Subramanian", "Ritika Saxena",
    "Deepak Choudhary", "Anjali Das", "Mohit Bansal", "Swati Mishra", "Akash Nambiar", "Bhavna Jain",
    "Rajat Khanna", "Keerthi Suresh", "Imran Qureshi", "Payal Thakur", "Sameer Kulkarni", "Aditi Rao",
    "Harini Venkatesh", "Tushar Goyal", "Zoya Ahmed", "Chirag Parmar", "Madhavi Reddy", "Arnav Bose",
    "Shalini Pillai", "Vivek Raghavan", "Kriti Sinha", "Aniket Sawant", "Sahana Gowda", "Dev Malhotra",
];

export const emailFor = (name) => `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;
