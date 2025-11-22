export interface CategoryHierarchy {
  value: string
  label: string
  emoji: string
  subcategories: {
    value: string
    label: string
  }[]
}

export const categoryHierarchy: CategoryHierarchy[] = [
  {
    value: 'digital-software',
    label: 'Digital Software',
    emoji: '💻',
    subcategories: [
      { value: 'operating-system', label: 'Operating System' },
      { value: 'productivity-app', label: 'Productivity App' },
      { value: 'web-browser', label: 'Web Browser' },
      { value: 'email-client', label: 'Email Client' },
      { value: 'cloud-storage', label: 'Cloud Storage' },
      { value: 'collaboration-tool', label: 'Collaboration Tool' },
      { value: 'design-software', label: 'Design Software' },
      { value: 'development-tool', label: 'Development Tool' },
      { value: 'security-software', label: 'Security Software' },
      { value: 'backup-software', label: 'Backup Software' },
    ],
  },
  {
    value: 'hardware-devices',
    label: 'Hardware & Devices',
    emoji: '🔧',
    subcategories: [
      { value: 'computer', label: 'Computer/Laptop' },
      { value: 'printer-scanner', label: 'Printer/Scanner' },
      { value: 'external-storage', label: 'External Storage' },
      { value: 'monitor-display', label: 'Monitor/Display' },
      { value: 'keyboard-mouse', label: 'Keyboard/Mouse' },
      { value: 'webcam', label: 'Webcam' },
      { value: 'audio-equipment', label: 'Audio Equipment' },
      { value: 'video-equipment', label: 'Video Equipment' },
      { value: 'networking-device', label: 'Networking Device' },
      { value: 'usb-accessory', label: 'USB/Accessory' },
    ],
  },
  {
    value: 'transportation-auto',
    label: 'Transportation & Automotive',
    emoji: '🚗',
    subcategories: [
      { value: 'car-infotainment', label: 'Car Infotainment System' },
      { value: 'ev-charging', label: 'EV/Charging' },
      { value: 'gps-navigation', label: 'GPS/Navigation' },
      { value: 'parking-system', label: 'Parking System' },
      { value: 'traffic-infrastructure', label: 'Traffic Infrastructure' },
      { value: 'public-transit', label: 'Public Transit' },
      { value: 'rideshare-taxi', label: 'Rideshare/Taxi App' },
      { value: 'airline-system', label: 'Airline System' },
      { value: 'car-rental', label: 'Car Rental' },
      { value: 'toll-payment', label: 'Toll/Payment System' },
    ],
  },
  {
    value: 'home-living',
    label: 'Home & Living',
    emoji: '🏠',
    subcategories: [
      { value: 'smart-home-hub', label: 'Smart Home Hub' },
      { value: 'smart-speaker', label: 'Smart Speaker' },
      { value: 'smart-light', label: 'Smart Lighting' },
      { value: 'smart-thermostat', label: 'Smart Thermostat' },
      { value: 'smart-lock', label: 'Smart Lock/Security' },
      { value: 'appliance', label: 'Appliance' },
      { value: 'hvac', label: 'HVAC System' },
      { value: 'home-construction', label: 'Home Construction/Repair' },
      { value: 'furniture-tech', label: 'Furniture Tech' },
      { value: 'robot-vacuum', label: 'Robot Vacuum' },
    ],
  },
  {
    value: 'enterprise-business',
    label: 'Enterprise & Business',
    emoji: '🏢',
    subcategories: [
      { value: 'crm', label: 'CRM Software' },
      { value: 'erp', label: 'ERP System' },
      { value: 'hr-software', label: 'HR Software' },
      { value: 'accounting-software', label: 'Accounting Software' },
      { value: 'project-management', label: 'Project Management' },
      { value: 'video-conferencing', label: 'Video Conferencing' },
      { value: 'enterprise-communication', label: 'Enterprise Communication' },
      { value: 'document-management', label: 'Document Management' },
      { value: 'business-intelligence', label: 'Business Intelligence' },
      { value: 'it-management', label: 'IT Management Tool' },
    ],
  },
  {
    value: 'entertainment-media',
    label: 'Entertainment & Media',
    emoji: '🎮',
    subcategories: [
      { value: 'streaming-video', label: 'Video Streaming' },
      { value: 'streaming-music', label: 'Music Streaming' },
      { value: 'gaming-console', label: 'Gaming Console' },
      { value: 'gaming-pc', label: 'PC Gaming' },
      { value: 'gaming-mobile', label: 'Mobile Gaming' },
      { value: 'social-media', label: 'Social Media Platform' },
      { value: 'content-platform', label: 'Content Platform' },
      { value: 'tv-settop', label: 'TV/Set-top Box' },
      { value: 'podcasting', label: 'Podcasting Platform' },
      { value: 'ebook-reader', label: 'E-book Reader' },
    ],
  },
  {
    value: 'healthcare-wellness',
    label: 'Healthcare & Wellness',
    emoji: '🏥',
    subcategories: [
      { value: 'patient-portal', label: 'Patient Portal' },
      { value: 'telemedicine', label: 'Telemedicine' },
      { value: 'health-tracker', label: 'Health Tracker' },
      { value: 'fitness-app', label: 'Fitness App' },
      { value: 'medical-device', label: 'Medical Device' },
      { value: 'pharmacy-system', label: 'Pharmacy System' },
      { value: 'insurance-portal', label: 'Insurance Portal' },
      { value: 'mental-health-app', label: 'Mental Health App' },
      { value: 'nutrition-app', label: 'Nutrition App' },
      { value: 'hospital-system', label: 'Hospital System' },
    ],
  },
  {
    value: 'education-learning',
    label: 'Education & Learning',
    emoji: '🎓',
    subcategories: [
      { value: 'lms', label: 'Learning Management System' },
      { value: 'online-course', label: 'Online Course Platform' },
      { value: 'student-portal', label: 'Student Portal' },
      { value: 'educational-app', label: 'Educational App' },
      { value: 'testing-platform', label: 'Testing Platform' },
      { value: 'library-system', label: 'Library System' },
      { value: 'research-tool', label: 'Research Tool' },
      { value: 'language-learning', label: 'Language Learning' },
      { value: 'tutoring-platform', label: 'Tutoring Platform' },
      { value: 'campus-system', label: 'Campus System' },
    ],
  },
  {
    value: 'government-public',
    label: 'Government & Public Services',
    emoji: '🏛️',
    subcategories: [
      { value: 'dmv-system', label: 'DMV/Motor Vehicle' },
      { value: 'tax-system', label: 'Tax System' },
      { value: 'voting-system', label: 'Voting System' },
      { value: 'court-system', label: 'Court System' },
      { value: 'permit-system', label: 'Permit/Licensing' },
      { value: 'public-records', label: 'Public Records' },
      { value: 'unemployment-system', label: 'Unemployment System' },
      { value: 'benefits-portal', label: 'Benefits Portal' },
      { value: 'postal-service', label: 'Postal Service' },
      { value: 'emergency-services', label: 'Emergency Services' },
    ],
  },
  {
    value: 'finance-commerce',
    label: 'Finance & Commerce',
    emoji: '💳',
    subcategories: [
      { value: 'banking-app', label: 'Banking App' },
      { value: 'payment-processor', label: 'Payment Processor' },
      { value: 'crypto-exchange', label: 'Crypto Exchange' },
      { value: 'investment-platform', label: 'Investment Platform' },
      { value: 'ecommerce-site', label: 'E-commerce Site' },
      { value: 'point-of-sale', label: 'Point of Sale' },
      { value: 'accounting-tool', label: 'Accounting Tool' },
      { value: 'invoicing-software', label: 'Invoicing Software' },
      { value: 'budgeting-app', label: 'Budgeting App' },
      { value: 'atm', label: 'ATM' },
    ],
  },
  {
    value: 'infrastructure-utilities',
    label: 'Infrastructure & Utilities',
    emoji: '🌐',
    subcategories: [
      { value: 'isp', label: 'Internet Service Provider' },
      { value: 'telecom', label: 'Telecom/Phone Service' },
      { value: 'cable-tv', label: 'Cable TV' },
      { value: 'electric-utility', label: 'Electric Utility' },
      { value: 'gas-utility', label: 'Gas Utility' },
      { value: 'water-utility', label: 'Water Utility' },
      { value: 'waste-management', label: 'Waste Management' },
      { value: 'dns-service', label: 'DNS Service' },
      { value: 'cdn', label: 'CDN' },
      { value: 'hosting-service', label: 'Hosting Service' },
    ],
  },
  {
    value: 'mobile-wearables',
    label: 'Mobile & Wearables',
    emoji: '📱',
    subcategories: [
      { value: 'smartphone', label: 'Smartphone' },
      { value: 'tablet', label: 'Tablet' },
      { value: 'smartwatch', label: 'Smartwatch' },
      { value: 'fitness-tracker', label: 'Fitness Tracker' },
      { value: 'mobile-app', label: 'Mobile App' },
      { value: 'ar-vr-headset', label: 'AR/VR Headset' },
      { value: 'earbuds', label: 'Wireless Earbuds' },
      { value: 'mobile-carrier', label: 'Mobile Carrier' },
      { value: 'mobile-os', label: 'Mobile OS' },
      { value: 'app-store', label: 'App Store' },
    ],
  },
  {
    value: 'other',
    label: 'Other',
    emoji: '🤝',
    subcategories: [
      { value: 'uncategorized', label: 'Uncategorized' },
      { value: 'multiple-categories', label: 'Multiple Categories' },
    ],
  },
]

export const tagLabels: Record<string, string> = {
  'privacy-violation': '🔒 Privacy Violation',
  'data-loss': '💾 Data Loss',
  'accessibility-fail': '♿ Accessibility Fail',
  'performance-issue': '🐌 Performance Issue',
  'security-flaw': '🔐 Security Flaw',
  'money-wasted': '💸 Money Wasted',
  'ux-nightmare': '🎨 UX Nightmare',
  'no-support': '📞 No Support',
  'forced-update': '🔄 Forced Update',
  'known-bug-ignored': '🪲 Known Bug Ignored',
  'incompatibility': '🔌 Incompatibility',
  'offline-broken': '📵 Offline Broken',
  'dark-pattern': '🎯 Dark Pattern',
  'notification-spam': '🔊 Notification Spam',
  'safety-issue': '⚠️ Safety Issue',
  'regional-lock': '🌍 Regional Lock',
  'hidden-cost': '💰 Hidden Cost',
  'vendor-lockin': '🔒 Vendor Lock-in',
}

export function getPrimaryCategoryLabel(value: string): string {
  const category = categoryHierarchy.find(c => c.value === value)
  return category ? `${category.emoji} ${category.label}` : value
}

export function getSubcategoryLabel(primaryCategory: string, subcategoryValue: string): string {
  const category = categoryHierarchy.find(c => c.value === primaryCategory)
  const subcategory = category?.subcategories.find(s => s.value === subcategoryValue)
  return subcategory?.label || subcategoryValue
}

export function getSubcategoriesForPrimary(primaryCategory: string) {
  return categoryHierarchy.find(c => c.value === primaryCategory)?.subcategories || []
}
