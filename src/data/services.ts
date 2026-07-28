import { Service } from "../types";

export const services: Service[] = [
  {
    id: "dry-massage",
    name: "Dry Massage",
    description: "A focused pressure massage performed over clothing. No oils, no creams, no shower needed. Perfect for a quick refresh during a busy day.",
    duration: "30 Minutes",
    price: "₹ 999/-",
    category: "Classic",
    benefits: [
      "Pure pressure technique",
      "No residue on skin or clothes",
      "Ideal for office breaks",
      "Instant relief, no cleanup",
      "No shower required post-session"
    ]
  },
  {
    id: "hnsb-massage",
    name: "Head, Neck, Shoulder & Back Massage",
    description: "A focused therapeutic session specifically designed to release tension in your most stressed areas. Using a blend of Swedish and deep tissue techniques, our expert therapists target neck stiffness, shoulder knots, and back strain to provide immediate relief and improved mobility.",
    duration: "45 Minutes",
    price: "₹ 1,400/-",
    category: "Classic",
    benefits: [
      "Perfect for office workers with desk-related pain",
      "Those carrying stress in their upper body",
      "Quick yet comprehensive relaxation",
      "Posture correction and muscle stiffness relief",
      "Experience renewed freedom of movement and lasting relief from chronic tension"
    ]
  },
  {
    id: "swedish-aroma-sports",
    name: "Swedish / Aroma / Sports Massage",
    description: "A full-body therapeutic experience tailored to your preference. Swedish offers long flowing strokes for deep relaxation; Aroma infuses essential oils to enhance mood; Sports targets muscle release for recovery.",
    category: "Classic",
    benefits: [
      "Improves circulation and flexibility",
      "Reduces muscle tension and fatigue",
      "Enhances overall well-being",
      "Expertly tailored pressure customized for athletes or relaxation seekers"
    ],
    options: [
      { name: "Swedish / Aroma / Sports + Scrub", duration: "90 Minutes", price: "₹ 2,200/-" },
      { name: "60 Minutes (Excl. Head)", duration: "60 Minutes", price: "₹ 1,500/-" },
      { name: "90 Minutes (Incl. Head)", duration: "90 Minutes", price: "₹ 2,000/-" }
    ]
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Massage",
    description: "A focused, firm-pressure therapy targeting the deepest layers of muscle and connective tissue. Using slow, deliberate strokes and deep finger pressure, this treatment breaks down chronic knots and realigns deep tissues.",
    category: "Classic",
    benefits: [
      "Releases chronic knots and adhesions",
      "Improves mobility and range of motion",
      "Targets specific problem areas like lower back, shoulders, and neck",
      "Helps recover from muscle strains and overuse",
      "Ideal for those with persistent pain or limited flexibility"
    ],
    options: [
      { name: "Deep Tissue + Scrub", duration: "90 Minutes", price: "₹ 2,500/-" },
      { name: "60-Min Session (Excl. Head)", duration: "60 Minutes", price: "₹ 1,799/-" },
      { name: "90-Min Session (Incl. Head)", duration: "90 Minutes", price: "₹ 2,300/-" }
    ]
  },
  {
    id: "ayurvedic-full-body",
    name: "Ayurvedic Full Body Oil Massage (Incl. Head)",
    description: "A traditional Kerala therapy using warm, medicated herbal oils to promote natural healing from within, complete with a soothing head massage.",
    duration: "60 Minutes (Incl. Head)",
    price: "₹ 1,800/-",
    category: "Ayurvedic",
    benefits: [
      "Includes rejuvenating scalp & head massage",
      "Detoxifies and rejuvenates the tissues",
      "Improves blood circulation & physical flexibility",
      "Reduces deep-seated stress & mental fatigue",
      "Restores natural mind-body element balance",
      "Excellent for holistic wellness seekers and chronic pain relief"
    ]
  },
  {
    id: "ayurvedic-combo-steam",
    name: "Head Massage + Full Body Ayurvedic Therapy",
    description: "A complete wellness experience combining traditional Ayurvedic therapies for total mind-body balance. Includes a soothing head massage and full body Ayurvedic oil therapy.",
    category: "Ayurvedic",
    benefits: [
      "Relieves stress, migraine tendencies & mental fatigue",
      "Improves circulation and promotes healthy skin glow",
      "Releases accumulated metabolic toxins from the body",
      "Promotes deep, restful sleep and rejuvenation"
    ],
    options: [
      { name: "60-Min Session (Excl. Head)", duration: "60 Minutes", price: "₹ 2,000/-" },
      { name: "90-Min Session (Incl. Head)", duration: "90 Minutes", price: "₹ 2,250/-" }
    ]
  },
  {
    id: "massage-scrub-combos",
    name: "Massage + Scrub Combos",
    description: "A revitalizing session to relax muscles and refresh skin. Excludes head massage.",
    category: "Combos",
    benefits: [
      "Revitalizes tired muscles and deeply exfoliates the skin",
      "Eliminates dead skin cells for a radiant glow",
      "Restores natural hydration and smooth texture",
      "Deeply relaxing combination of heat, massage, and natural herbs"
    ],
    options: [
      { name: "45-min Massage + 45-min Body Scrub", duration: "90 Minutes", price: "₹ 2,200/-" },
      { name: "45-min Massage + 45-min Scrub (2 Therapists)", duration: "90 Minutes", price: "₹ 2,500/-" },
      { name: "60-min Massage + 60-min Body Scrub", duration: "120 Minutes", price: "₹ 2,800/-" },
      { name: "60-min Massage + 60-min Scrub (2 Therapists)", duration: "120 Minutes", price: "₹ 3,000/-" }
    ]
  },
  {
    id: "hands-4-massage",
    name: "4 Hands Full Body Massage",
    description: "Two therapists work in perfect choreographical sync to release deep muscle tension and promote complete, deep-tissue relaxation.",
    category: "Four Hands",
    benefits: [
      "Synchronized dual-therapist massage movements",
      "Doubles the physical relaxation response",
      "Dramatically helps slow down overactive minds",
      "Deep muscle relief and total systemic recovery"
    ],
    options: [
      { name: "60-Min Session (Excl. Head)", duration: "60 Minutes", price: "₹ 3,000/-" },
      { name: "90-Min Session (Incl. Head)", duration: "90 Minutes", price: "₹ 4,000/-" }
    ]
  },
  {
    id: "hands-4-massage-scrub",
    name: "4 Hands Massage + Scrub",
    description: "The ultimate synchronized luxury experience combining harmonized body massage with full-body exfoliating scrubs.",
    category: "Four Hands",
    benefits: [
      "Two therapists working in complete physical harmony",
      "Full-body polish and cellular skin renewal",
      "Deep relaxation of muscles and active energy flow",
      "Maximum physical benefit and sensory luxury"
    ],
    options: [
      { name: "90-Min Session", duration: "90 Minutes", price: "₹ 4,250/-" },
      { name: "120-Min Session", duration: "120 Minutes", price: "₹ 5,000/-" }
    ]
  },
  {
    id: "add-on-head",
    name: "Head Massage (Add-On)",
    description: "A focused therapy to relieve tension headaches, stress, and mental fatigue.",
    duration: "15 Minutes",
    price: "₹ 300/-",
    category: "Add-Ons",
    benefits: [
      "Focused pressure on head and scalp",
      "Relieves chronic mental tension and headaches",
      "Enhances any main body treatment",
      "Quick, powerful, and deeply soothing"
    ]
  },
  {
    id: "sadhana-pass",
    name: "Membership: Silver Dew",
    description: "3 Sessions/Month Pass. Ideal for regular monthly recovery and physical balance.",
    duration: "Monthly Pass",
    price: "₹ 3,999/-",
    category: "Memberships",
    benefits: [
      "3 Sessions per Month",
      "Valid for 30 Days",
      "Choice of Swedish, Deep Tissue or Ayurvedic",
      "Priority Appointment Slot Booking"
    ]
  },
  {
    id: "prana-circle",
    name: "Membership: Golden Radiance",
    description: "6 Sessions/Month Pass. Our most popular comprehensive wellness pass.",
    duration: "Monthly Pass",
    price: "₹ 6,999/-",
    category: "Memberships",
    benefits: [
      "6 Sessions per Month",
      "Choice of Swedish, Deep Tissue or Ayurvedic",
      "Transferable to 1 Family/Friend Guest",
      "Discreet Priority Locker Suite"
    ]
  },
  {
    id: "samadhi-circle",
    name: "Membership: Diamond Bliss",
    description: "10 Sessions/Month Pass. Ultimate luxury care for high-stress executives.",
    duration: "Monthly Pass",
    price: "₹ 11,999/-",
    category: "Memberships",
    benefits: [
      "10 Sessions per Month",
      "Transferable to 1 Family/Friend Guest",
      "VIP Dedicated Male Therapist Assignment",
      "Priority Appointment Slot Booking"
    ]
  }
];
