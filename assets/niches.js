/* Night Shift Revenue: demo niches.
   Every business, person, phone number and time below is a sample for the
   in-person demo. Use "Personalize" on any demo to swap in the prospect's details. */
window.NSR = window.NSR || {};

NSR.contact = {
  name: "Connor Fleming",
  phoneDisplay: "404-276-6462",
  phoneE164: "+14042766462"
};

NSR.niches = [
  {
    id: "medspa",
    label: "Med spas",
    owner: "med spa",
    pain: "Consults who asked about Botox, then went quiet.",
    headline: "10–15 past clients back in your treatment chairs.",
    sub: "We text the people who already asked about treatments and book them onto your schedule. You pay per booked consult. If nobody books, you pay nothing.",
    biz: "Glow Aesthetics",
    service: "Botox",
    serviceShort: "Botox",
    lead: "Jessica",
    advisor: "Nina, our nurse injector",
    advisorShort: "Nina",
    phone: "(555) 014-2290",
    apptType: "Free Botox consult",
    apptLength: "20 min",
    defaults: { leads: 3000, value: 1200, close: 60 },
    valueLabel: "Average first-year value of a client",
    closeLabel: "Consults that become clients",
    q1: {
      ai: "great. was it mainly forehead lines, crow's feet, or something else you wanted to soften?",
      chips: ["Forehead lines", "Crow's feet", "Not sure, I want advice"],
      field: "Area"
    },
    q2: {
      ai: "got it. have you had botox before, or would this be your first time?",
      chips: ["Had it before", "First time"],
      field: "History"
    },
    price: {
      ask: "How much is it?",
      ai: "it depends on how many units you need, so nina confirms the exact price at your consult. the consult is free and takes about 20 minutes."
    },
    slots: ["Thu 4:30 pm", "Sat 10:00 am"]
  },
  {
    id: "dental",
    label: "Dentists",
    owner: "dental practice",
    pain: "Invisalign and implant inquiries that never sat in the chair.",
    headline: "Fill 10–15 open chairs with patients who already asked.",
    sub: "We text past Invisalign and implant inquiries, answer their questions and book the scan. You pay per booked appointment. If nobody books, you pay nothing.",
    biz: "Brightside Dental",
    service: "Invisalign",
    serviceShort: "Invisalign",
    lead: "Marcus",
    advisor: "Dr. Patel",
    advisorShort: "Dr. Patel",
    phone: "(555) 014-3318",
    apptType: "Free Invisalign scan",
    apptLength: "30 min",
    defaults: { leads: 2500, value: 4500, close: 45 },
    valueLabel: "Average case value",
    closeLabel: "Scans that start treatment",
    q1: {
      ai: "great. is it mainly crowding, gaps, or your bite that you'd like to fix?",
      chips: ["Crowding", "Gaps", "My bite"],
      field: "Concern"
    },
    q2: {
      ai: "makes sense. is there a date you're working toward, like a wedding or an event?",
      chips: ["Yes, within 6 months", "No rush"],
      field: "Timing"
    },
    price: {
      ask: "What does it cost?",
      ai: "every smile is different, so dr. patel gives you an exact price at the free 3d scan. there are monthly payment options too."
    },
    slots: ["Tue 8:00 am", "Wed 5:15 pm"]
  },
  {
    id: "hvac",
    label: "HVAC",
    owner: "HVAC company",
    pain: "Replacement estimates from last season that never got a yes.",
    headline: "Turn last season's unsold estimates into installs.",
    sub: "We text homeowners who asked about a new system and book them back in with your comfort advisor. You pay per booked visit. If nobody books, you pay nothing.",
    biz: "Comfort Pro Heating & Air",
    service: "a new AC system",
    serviceShort: "a new system",
    lead: "David",
    advisor: "Ray, our comfort advisor",
    advisorShort: "Ray",
    phone: "(555) 014-7742",
    apptType: "In-home system estimate",
    apptLength: "45 min",
    defaults: { leads: 4000, value: 11500, close: 45 },
    source: "Starting numbers are 2026 industry averages: about $11,500 for a full system replacement and about 45% of residential install appointments closing. Change them to yours.",
    valueLabel: "Average install ticket",
    closeLabel: "Estimates that close",
    q1: {
      ai: "good to hear. is the current system still running, or has it been giving you trouble?",
      chips: ["Running, but old", "Acting up", "It's dead"],
      field: "System"
    },
    q2: {
      ai: "got it. roughly how old is it?",
      chips: ["10+ years", "Under 10 years", "No idea"],
      field: "Age"
    },
    price: {
      ask: "How much is a new one?",
      ai: "it depends on the home and the system size, so ray gives you exact options at the visit, usually with financing. there's no charge for the visit."
    },
    slots: ["Tomorrow 9:00 am", "Fri 2:30 pm"]
  },
  {
    id: "roofing",
    label: "Roofing",
    owner: "roofing company",
    pain: "Roof estimates and storm leads that went quiet.",
    headline: "Wake up the roof estimates that went quiet.",
    sub: "We text homeowners who asked about a roof, find out who's ready and book the inspection. You pay per booked inspection. If nobody books, you pay nothing.",
    biz: "Ridgeline Roofing",
    service: "a roof replacement",
    serviceShort: "your roof",
    lead: "Karen",
    advisor: "Mike, our project manager",
    advisorShort: "Mike",
    phone: "(555) 014-5561",
    apptType: "Free roof inspection",
    apptLength: "30 min",
    defaults: { leads: 2000, value: 11000, close: 30 },
    source: "Starting numbers are 2026 industry averages: about $9,600 to $11,500 for an asphalt roof replacement and about 25% to 35% of appointments signing. Change them to yours.",
    valueLabel: "Average roof job",
    closeLabel: "Inspections that sign",
    q1: {
      ai: "glad i caught you. is it a leak, storm damage, or just an older roof you want looked at?",
      chips: ["A leak", "Storm damage", "Older roof"],
      field: "Issue"
    },
    q2: {
      ai: "okay. are you planning to go through insurance, or pay directly?",
      chips: ["Insurance", "Pay directly", "Not sure yet"],
      field: "Payment"
    },
    price: {
      ask: "How much does a roof cost?",
      ai: "it depends on size and materials, so mike measures and gives you exact numbers at the free inspection. it takes about 30 minutes."
    },
    slots: ["Thu 10:00 am", "Sat 9:30 am"]
  },
  {
    id: "mortgage",
    label: "Mortgages",
    owner: "mortgage company",
    pain: "Rate shoppers who filled out a form and never picked up.",
    headline: "Turn old rate shoppers into booked calls.",
    sub: "We text past applicants and inquiries, find who's back in the market and book them with your loan officers. You pay per booked call. If nobody books, you pay nothing.",
    biz: "Bolt Mortgages",
    service: "refinancing",
    serviceShort: "refinancing",
    lead: "Chris",
    advisor: "Andrea, our loan officer",
    advisorShort: "Andrea",
    phone: "(555) 014-9020",
    apptType: "Rate review call",
    apptLength: "15 min",
    defaults: { leads: 5000, value: 4000, close: 30 },
    source: "Starting numbers: about 1% (100 basis points) on an average loan of roughly $400,000, and an estimated 30% of booked calls funding. Change them to yours.",
    valueLabel: "Average revenue per closed loan",
    closeLabel: "Calls that become loans",
    q1: {
      ai: "great. are you mainly looking to lower your rate, take cash out, or buy a new home?",
      chips: ["Lower my rate", "Take cash out", "Buy a new home"],
      field: "Goal"
    },
    q2: {
      ai: "makes sense. roughly what's the loan amount, under or over $300k?",
      chips: ["Under $300k", "Over $300k"],
      field: "Loan size"
    },
    price: {
      ask: "What's your rate?",
      ai: "rates move every day and depend on your situation, so i can't quote one by text. andrea can run real numbers with you on a quick 15-minute call."
    },
    slots: ["Tomorrow 12:15 pm", "Thu 6:00 pm"]
  },
  {
    id: "realestate",
    label: "Real estate",
    owner: "real estate team",
    pain: "Home-value and buyer leads that stopped answering.",
    headline: "Your old home-value leads are still thinking about it.",
    sub: "We text past buyer and seller leads, find out who's moving this year and book them with your agents. You pay per booked appointment. If nobody books, you pay nothing.",
    biz: "Keystone Realty",
    service: "selling your home",
    serviceShort: "selling",
    lead: "Laura",
    advisor: "Tom, one of our listing agents",
    advisorShort: "Tom",
    phone: "(555) 014-6604",
    apptType: "Home value walkthrough",
    apptLength: "30 min",
    defaults: { leads: 6000, value: 12000, close: 35 },
    source: "Starting numbers are 2026 averages: about 2.8% commission per side on the $434,100 national median home, before your brokerage split, and about 35% of appointments signing. Change them to yours.",
    valueLabel: "Average commission per side",
    closeLabel: "Appointments that list or buy",
    q1: {
      ai: "good to hear. are you thinking about selling in the next 12 months, or just keeping an eye on value?",
      chips: ["Selling this year", "Just watching value"],
      field: "Timing"
    },
    q2: {
      ai: "got it. would you also be buying after you sell?",
      chips: ["Yes, buying too", "No, just selling"],
      field: "Next move"
    },
    price: {
      ask: "What's my home worth?",
      ai: "i'd rather not guess by text. tom can pull recent sales on your street and walk you through a real number in about 30 minutes."
    },
    slots: ["Wed 5:30 pm", "Sat 11:00 am"]
  },
  {
    id: "plumbing",
    label: "Plumbing",
    owner: "plumbing company",
    pain: "Water heater and repipe quotes that never got scheduled.",
    headline: "Bring back the quotes that never got a yes.",
    sub: "We text past water heater, repipe and drain quotes and book the visit. You pay per booked job visit. If nobody books, you pay nothing.",
    biz: "Blue Line Plumbing",
    service: "a water heater replacement",
    serviceShort: "the water heater",
    lead: "Tony",
    advisor: "Luis, our lead tech",
    advisorShort: "Luis",
    phone: "(555) 014-8873",
    apptType: "On-site quote visit",
    apptLength: "30 min",
    defaults: { leads: 3500, value: 1800, close: 45 },
    source: "Starting numbers are 2026 averages: about $1,350 for a tank water heater and $1,400 to $3,900 for tankless, installed, with 35% to 55% of replacement quotes closing. Change them to yours.",
    valueLabel: "Average job ticket",
    closeLabel: "Visits that become jobs",
    q1: {
      ai: "glad i caught you. is the water heater still working, or are you getting cold showers?",
      chips: ["Still working", "Running out fast", "No hot water"],
      field: "Status"
    },
    q2: {
      ai: "okay. is it a tank or a tankless unit?",
      chips: ["Tank", "Tankless", "Not sure"],
      field: "Unit"
    },
    price: {
      ask: "How much to replace it?",
      ai: "it depends on size and type, so luis gives you an exact price on site before any work starts. the visit itself is free."
    },
    slots: ["Tomorrow 8:30 am", "Fri 1:00 pm"]
  }
];

NSR.byId = function (id) {
  return NSR.niches.find(function (n) { return n.id === id; }) || NSR.niches[0];
};

/* Prospect details: URL params win, then saved values, then the niche sample. */
NSR.fields = ["biz", "ai", "lead", "service", "advisorShort", "phone"];
NSR.personal = function (niche) {
  var out = {
    biz: niche.biz, ai: "Sarah", lead: niche.lead, service: niche.service,
    advisorShort: niche.advisorShort, phone: niche.phone
  };
  try {
    var saved = JSON.parse(localStorage.getItem("nsr-p-" + niche.id) || "{}");
    Object.keys(saved).forEach(function (k) { if (saved[k]) out[k] = saved[k]; });
  } catch (e) {}
  var q = new URLSearchParams(location.search);
  NSR.fields.forEach(function (k) { if (q.get(k)) out[k] = q.get(k); });
  out.custom = out.biz !== niche.biz;
  return out;
};
NSR.savePersonal = function (niche, values) {
  try { localStorage.setItem("nsr-p-" + niche.id, JSON.stringify(values)); } catch (e) {}
};

NSR.money = function (n) {
  return "$" + Math.round(n).toLocaleString("en-US");
};
