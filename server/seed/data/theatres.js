// Demo cinemas across India. Chains are fictional; locations are real neighbourhoods so
// "near me" and the city picker behave like they would in production.
const ROWS = (n) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, n).split("");

// Row A is closest to the screen, so the cheap rows come first
function layout({ rows, cols, aisles = [], tiers, accessible = ["A1", "A2"] }, factor) {
    const letters = ROWS(rows);
    let at = 0;
    const categories = tiers.map(([key, label, count, price]) => {
        const slice = letters.slice(at, at + count);
        at += count;
        return { key, label, rows: slice, price: Math.round((price * factor) / 10) * 10 };
    });
    return { rows: letters, cols, aisles, categories, accessible };
}

const SCREEN_TYPES = {
    standard: (name) => ({
        name, sound: "Dolby 7.1", projection: "2K Digital",
        spec: { rows: 12, cols: 18, aisles: [4, 14], tiers: [["REGULAR", "Regular", 4, 180], ["PRIME", "Prime", 6, 250], ["RECLINER", "Recliner", 2, 450]] },
    }),
    atmos: (name) => ({
        name, sound: "Dolby Atmos", projection: "4K Laser",
        spec: { rows: 14, cols: 20, aisles: [5, 15], tiers: [["REGULAR", "Regular", 4, 220], ["PRIME", "Prime", 7, 300], ["RECLINER", "Recliner", 3, 520]] },
    }),
    imax: (name = "IMAX Hall") => ({
        name, sound: "IMAX 12-channel", projection: "IMAX with Laser",
        spec: { rows: 16, cols: 24, aisles: [6, 18], tiers: [["REGULAR", "Regular", 5, 380], ["PREMIUM", "Premium", 8, 480], ["RECLINER", "Recliner", 3, 750]] },
    }),
    fourdx: (name = "4DX Hall") => ({
        name, sound: "Dolby 7.1", projection: "4K Laser · 4DX motion seats",
        spec: { rows: 8, cols: 14, aisles: [7], tiers: [["MOTION", "4DX Motion", 8, 650]], accessible: [] },
    }),
    luxe: (name) => ({
        name, sound: "Dolby Atmos", projection: "4K Laser",
        spec: { rows: 6, cols: 12, aisles: [6], tiers: [["LUXE", "Luxe Recliner", 6, 700]] },
    }),
};

export function buildScreens(types, factor) {
    let audi = 0, luxe = 0;
    return types.map((t) => {
        const make = SCREEN_TYPES[t];
        const s = t === "imax" || t === "fourdx" ? make() : make(t === "luxe" ? `Luxe ${++luxe}` : `Audi ${++audi}`);
        return { name: s.name, sound: s.sound, projection: s.projection, layout: layout(s.spec, factor) };
    });
}

const MENU = [
    ["Salted Popcorn (Large)", "Popcorn", 320, true, "Freshly popped, butter-tossed"],
    ["Caramel Popcorn (Large)", "Popcorn", 380, true, "Crunchy caramel glaze"],
    ["Cheese Popcorn (Regular)", "Popcorn", 290, true, ""],
    ["Couple Combo", "Combos", 690, true, "2 large popcorn + 2 Pepsi (500ml)"],
    ["Family Combo", "Combos", 1090, true, "2 large popcorn, 2 nachos, 4 Pepsi"],
    ["Solo Combo", "Combos", 420, true, "Regular popcorn + Pepsi (500ml)"],
    ["Cheese Nachos", "Snacks", 280, true, "With salsa and jalapeños"],
    ["Peri Peri Fries", "Snacks", 230, true, ""],
    ["Chicken Burger", "Snacks", 310, false, "Crispy chicken, lettuce, mayo"],
    ["Veg Club Sandwich", "Snacks", 260, true, ""],
    ["Samosa (2 pcs)", "Snacks", 140, true, "With mint chutney"],
    ["Chicken Hot Dog", "Snacks", 270, false, ""],
    ["Pepsi (500ml)", "Beverages", 180, true, ""],
    ["Cold Coffee", "Beverages", 220, true, ""],
    ["Mineral Water", "Beverages", 60, true, ""],
    ["Masala Chai", "Beverages", 90, true, ""],
    ["Chocolate Brownie", "Desserts", 190, true, "Warm, with chocolate sauce"],
    ["Ice Cream Tub", "Desserts", 160, true, "Vanilla / chocolate"],
];

export const buildMenu = (factor) => MENU.map(([name, category, price, veg, description]) => ({
    name, category, veg, description, available: true, price: Math.round((price * factor) / 10) * 10,
}));

// region → which regional titles a cinema programmes (see seed/index.js)
// factor  → ticket & F&B price scale for the city
export const THEATRES = [
    {
        name: "Cineverse Luxe Select Citywalk", city: "Delhi", state: "Delhi", pincode: 110017,
        address: "Select Citywalk Mall, A-3 District Centre, Saket", location: { lat: 28.5286, lng: 77.2190 },
        phone: "+91 11 4055 2100", openingHours: "9:00 AM – 1:30 AM", factor: 1.15, region: "north", chain: "luxe",
        screens: ["imax", "luxe", "atmos", "standard", "standard"],
        amenities: ["Recliner Seats", "Lounge", "In-seat Dining", "Food Court", "Valet Parking", "Wheelchair Access", "Elevator", "IMAX Screen", "Dolby Atmos", "M-Ticket", "Restrooms"],
        pricingRules: { weekendPct: 15, morningPct: -15, primeTimePct: 10, openingDayPct: 10 },
        description: "Flagship Cineverse Luxe with an IMAX laser hall, a 72-seat recliner lounge and chef-made food served to your seat.",
    },
    {
        name: "Starlight Cinemas Connaught Place", city: "Delhi", state: "Delhi", pincode: 110001,
        address: "Block F, Inner Circle, Connaught Place", location: { lat: 28.6330, lng: 77.2195 },
        phone: "+91 11 2341 7788", openingHours: "9:30 AM – 12:30 AM", factor: 1.0, region: "north", chain: "starlight",
        screens: ["atmos", "standard", "standard"],
        amenities: ["Food Court", "Wheelchair Access", "Air Conditioning", "M-Ticket", "Dolby Atmos", "Restrooms", "ATM"],
        pricingRules: { weekendPct: 10, morningPct: -20 },
        description: "A heritage single-screen turned three-screen multiplex in the heart of CP.",
    },
    {
        name: "Galaxy Multiplex Ambience Mall", city: "Gurugram", state: "Haryana", pincode: 122002,
        address: "Ambience Mall, NH-48, DLF Phase 3", location: { lat: 28.5050, lng: 77.0966 },
        phone: "+91 124 466 5500", openingHours: "9:00 AM – 1:00 AM", factor: 1.1, region: "north", chain: "galaxy",
        screens: ["fourdx", "atmos", "standard", "standard", "standard", "luxe"],
        amenities: ["4DX Hall", "Recliner Seats", "Food Court", "Parking", "Kids Zone", "Wheelchair Access", "Charging Points", "Dolby Atmos", "Restrooms"],
        pricingRules: { weekendPct: 12, morningPct: -15, primeTimePct: 8 },
        description: "Six screens including Gurugram's busiest 4DX hall.",
    },
    {
        name: "Regal Screens DLF Mall of India", city: "Noida", state: "Uttar Pradesh", pincode: 201301,
        address: "DLF Mall of India, Sector 18", location: { lat: 28.5672, lng: 77.3210 },
        phone: "+91 120 671 9000", openingHours: "9:00 AM – 1:00 AM", factor: 1.0, region: "north", chain: "regal",
        screens: ["imax", "atmos", "standard", "standard"],
        amenities: ["IMAX Screen", "Dolby Atmos", "Food Court", "Parking", "Baby Changing", "Wheelchair Access", "Elevator", "3D Glasses"],
        pricingRules: { weekendPct: 10, morningPct: -15 },
        description: "Noida's only IMAX with Laser, inside India's largest mall.",
    },
    {
        name: "Cineverse Luxe Phoenix Palladium", city: "Mumbai", state: "Maharashtra", pincode: 400013,
        address: "Phoenix Palladium, 462 Senapati Bapat Marg, Lower Parel", location: { lat: 18.9948, lng: 72.8258 },
        phone: "+91 22 6180 3300", openingHours: "9:00 AM – 2:00 AM", factor: 1.2, region: "west", chain: "luxe",
        screens: ["luxe", "luxe", "atmos", "imax"],
        amenities: ["Recliner Seats", "Lounge", "In-seat Dining", "Valet Parking", "IMAX Screen", "Dolby Atmos", "Wheelchair Access", "M-Ticket"],
        pricingRules: { weekendPct: 15, primeTimePct: 10, openingDayPct: 15 },
        description: "Plush recliners, a cocktail-free lounge and the city's sharpest laser projection.",
    },
    {
        name: "Starlight Cinemas Andheri West", city: "Mumbai", state: "Maharashtra", pincode: 400053,
        address: "Infiniti Mall, New Link Road, Andheri West", location: { lat: 19.1410, lng: 72.8321 },
        phone: "+91 22 4024 1166", openingHours: "8:30 AM – 1:00 AM", factor: 1.05, region: "west", chain: "starlight",
        screens: ["atmos", "standard", "standard", "standard", "fourdx"],
        amenities: ["4DX Hall", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Restrooms", "ATM"],
        pricingRules: { weekendPct: 10, morningPct: -20, primeTimePct: 5 },
        description: "Neighbourhood favourite for first-day-first-show crowds.",
    },
    {
        name: "Galaxy Multiplex Viviana", city: "Thane", state: "Maharashtra", pincode: 400606,
        address: "Viviana Mall, Eastern Express Highway", location: { lat: 19.2087, lng: 72.9716 },
        phone: "+91 22 2580 4400", openingHours: "9:00 AM – 12:30 AM", factor: 0.95, region: "west", chain: "galaxy",
        screens: ["atmos", "standard", "standard", "standard"],
        amenities: ["Food Court", "Parking", "Kids Zone", "Wheelchair Access", "Dolby Atmos", "Elevator"],
        pricingRules: { weekendPct: 10, morningPct: -15 },
        description: "Four screens, family pricing and the biggest food court in Thane.",
    },
    {
        name: "Regal Screens Phoenix Marketcity", city: "Pune", state: "Maharashtra", pincode: 411014,
        address: "Phoenix Marketcity, Viman Nagar", location: { lat: 18.5622, lng: 73.9167 },
        phone: "+91 20 6730 2200", openingHours: "9:00 AM – 1:00 AM", factor: 0.95, region: "west", chain: "regal",
        screens: ["imax", "atmos", "standard", "standard", "luxe"],
        amenities: ["IMAX Screen", "Recliner Seats", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Charging Points"],
        pricingRules: { weekendPct: 10, morningPct: -15, openingDayPct: 10 },
        description: "Pune's go-to IMAX, minutes from the airport.",
    },
    {
        name: "Cineverse Orion Mall", city: "Bengaluru", state: "Karnataka", pincode: 560055,
        address: "Brigade Gateway, Dr Rajkumar Road, Rajajinagar", location: { lat: 13.0111, lng: 77.5550 },
        phone: "+91 80 4120 5500", openingHours: "8:30 AM – 1:00 AM", factor: 1.05, region: "karnataka", chain: "luxe",
        screens: ["imax", "atmos", "standard", "standard", "luxe"],
        amenities: ["IMAX Screen", "Recliner Seats", "Lounge", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "M-Ticket"],
        pricingRules: { weekendPct: 12, morningPct: -15, primeTimePct: 8 },
        description: "Lakeside multiplex with an IMAX hall and Kannada, Hindi and English premieres every week.",
    },
    {
        name: "Starlight Cinemas Koramangala", city: "Bengaluru", state: "Karnataka", pincode: 560095,
        address: "Forum Mall, Hosur Road, Koramangala", location: { lat: 12.9345, lng: 77.6112 },
        phone: "+91 80 2206 7700", openingHours: "9:00 AM – 12:30 AM", factor: 1.0, region: "karnataka", chain: "starlight",
        screens: ["atmos", "standard", "standard", "fourdx"],
        amenities: ["4DX Hall", "Dolby Atmos", "Cafe", "Wheelchair Access", "Parking", "Restrooms"],
        pricingRules: { weekendPct: 10, morningPct: -20 },
        description: "Compact, always-buzzing multiplex in Koramangala.",
    },
    {
        name: "Galaxy Multiplex Inorbit", city: "Hyderabad", state: "Telangana", pincode: 500081,
        address: "Inorbit Mall, Mindspace, HITEC City", location: { lat: 17.4344, lng: 78.3866 },
        phone: "+91 40 4033 6600", openingHours: "8:00 AM – 1:30 AM", factor: 1.0, region: "telugu", chain: "galaxy",
        screens: ["imax", "atmos", "standard", "standard", "standard", "fourdx"],
        amenities: ["IMAX Screen", "4DX Hall", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Kids Zone", "Charging Points"],
        pricingRules: { weekendPct: 10, morningPct: -10, openingDayPct: 20 },
        description: "Benefit shows at 8 AM on release day — Hyderabad style.",
    },
    {
        name: "Regal Screens Banjara Hills", city: "Hyderabad", state: "Telangana", pincode: 500034,
        address: "GVK One Mall, Road No. 1, Banjara Hills", location: { lat: 17.4192, lng: 78.4487 },
        phone: "+91 40 6646 0099", openingHours: "9:00 AM – 1:00 AM", factor: 1.05, region: "telugu", chain: "regal",
        screens: ["luxe", "atmos", "standard"],
        amenities: ["Recliner Seats", "Lounge", "In-seat Dining", "Valet Parking", "Dolby Atmos", "Wheelchair Access"],
        pricingRules: { weekendPct: 15, primeTimePct: 10 },
        description: "Boutique three-screen cinema with butler service in the Luxe hall.",
    },
    {
        name: "Cineverse Express Avenue", city: "Chennai", state: "Tamil Nadu", pincode: 600002,
        address: "Express Avenue Mall, Whites Road, Royapettah", location: { lat: 13.0588, lng: 80.2641 },
        phone: "+91 44 4222 8800", openingHours: "8:30 AM – 1:00 AM", factor: 0.95, region: "tamil", chain: "luxe",
        screens: ["imax", "atmos", "standard", "standard", "standard"],
        amenities: ["IMAX Screen", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Elevator", "M-Ticket"],
        pricingRules: { weekendPct: 10, morningPct: -10, openingDayPct: 15 },
        description: "Five screens on Whites Road with FDFS celebrations for every big Tamil release.",
    },
    {
        name: "Starlight Cinemas Velachery", city: "Chennai", state: "Tamil Nadu", pincode: 600042,
        address: "Phoenix Marketcity, Velachery Main Road", location: { lat: 12.9915, lng: 80.2167 },
        phone: "+91 44 6650 1122", openingHours: "9:00 AM – 12:30 AM", factor: 0.9, region: "tamil", chain: "starlight",
        screens: ["atmos", "standard", "standard", "luxe"],
        amenities: ["Recliner Seats", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Kids Zone"],
        pricingRules: { weekendPct: 10, morningPct: -15 },
        description: "South Chennai's family multiplex.",
    },
    {
        name: "Galaxy Multiplex Lulu Mall", city: "Kochi", state: "Kerala", pincode: 682024,
        address: "Lulu Mall, NH-66, Edappally", location: { lat: 10.0271, lng: 76.3083 },
        phone: "+91 484 272 9900", openingHours: "9:00 AM – 12:30 AM", factor: 0.85, region: "malayalam", chain: "galaxy",
        screens: ["imax", "atmos", "standard", "standard"],
        amenities: ["IMAX Screen", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Baby Changing"],
        pricingRules: { weekendPct: 10, morningPct: -15 },
        description: "Kerala's biggest screen, inside Lulu Mall.",
    },
    {
        name: "Regal Screens South City", city: "Kolkata", state: "West Bengal", pincode: 700068,
        address: "South City Mall, 375 Prince Anwar Shah Road", location: { lat: 22.5016, lng: 88.3617 },
        phone: "+91 33 4060 3300", openingHours: "9:30 AM – 12:30 AM", factor: 0.85, region: "east", chain: "regal",
        screens: ["atmos", "standard", "standard", "standard"],
        amenities: ["Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Cafe", "Restrooms"],
        pricingRules: { weekendPct: 10, morningPct: -20 },
        description: "Four screens in South Kolkata's favourite mall.",
    },
    {
        name: "Cineverse Alpha One", city: "Ahmedabad", state: "Gujarat", pincode: 380052,
        address: "Alpha One Mall, Vastrapur", location: { lat: 23.0395, lng: 72.5311 },
        phone: "+91 79 4890 1100", openingHours: "9:00 AM – 12:30 AM", factor: 0.85, region: "west", chain: "luxe",
        screens: ["atmos", "standard", "standard", "luxe"],
        amenities: ["Recliner Seats", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Kids Zone"],
        pricingRules: { weekendPct: 10, morningPct: -15 },
        description: "Vastrapur's four-screen multiplex with an all-recliner Luxe hall.",
    },
    {
        name: "Starlight Cinemas World Trade Park", city: "Jaipur", state: "Rajasthan", pincode: 302017,
        address: "World Trade Park, JLN Marg, Malviya Nagar", location: { lat: 26.8535, lng: 75.8047 },
        phone: "+91 141 271 5500", openingHours: "9:30 AM – 12:00 AM", factor: 0.8, region: "north", chain: "starlight",
        screens: ["atmos", "standard", "standard"],
        amenities: ["Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Air Conditioning"],
        pricingRules: { weekendPct: 10, morningPct: -20 },
        description: "Three screens at Jaipur's landmark WTP.",
    },
    {
        name: "Galaxy Multiplex Elante", city: "Chandigarh", state: "Chandigarh", pincode: 160002,
        address: "Elante Mall, Industrial Area Phase I", location: { lat: 30.7056, lng: 76.8013 },
        phone: "+91 172 466 7700", openingHours: "9:00 AM – 12:30 AM", factor: 0.9, region: "north", chain: "galaxy",
        screens: ["imax", "atmos", "standard", "standard"],
        amenities: ["IMAX Screen", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Charging Points"],
        pricingRules: { weekendPct: 12, morningPct: -15 },
        description: "The Tricity's only IMAX.",
    },
    {
        name: "Regal Screens Phoenix Palassio", city: "Lucknow", state: "Uttar Pradesh", pincode: 226002,
        address: "Phoenix Palassio, Shaheed Path, Gomti Nagar Ext.", location: { lat: 26.8044, lng: 81.0055 },
        phone: "+91 522 671 2200", openingHours: "9:30 AM – 12:30 AM", factor: 0.8, region: "north", chain: "regal",
        screens: ["atmos", "standard", "standard", "luxe"],
        amenities: ["Recliner Seats", "Dolby Atmos", "Food Court", "Parking", "Wheelchair Access", "Kids Zone"],
        pricingRules: { weekendPct: 10, morningPct: -20 },
        description: "Lucknow's newest multiplex with a recliner-only Luxe hall.",
    },
];

// Fictional chain operators — each owns the cinemas of its chain
export const OWNERS = [
    { chain: "luxe",      name: "Cineverse Exhibition Pvt Ltd", email: "ops.luxe@example.com" },
    { chain: "starlight", name: "Starlight Cinemas Pvt Ltd",    email: "ops.starlight@example.com" },
    { chain: "galaxy",    name: "Galaxy Multiplex Ltd",         email: "ops.galaxy@example.com" },
    { chain: "regal",     name: "Regal Screens India",          email: "ops.regal@example.com" },
];
