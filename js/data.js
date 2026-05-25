// VendorHub — App Data & State
const STATE = {
  role: 'buyer', cart: [], wishlist: [], currentPage: 'home', selectedEmoji: '📱', editingProduct: null,
  orders: [
    { id:'#VH2401', product:'Sony WH-1000XM5',    emoji:'🎧', vendor:'AudioZone',    amount:24999, status:'Delivered', date:'12 May 2026' },
    { id:'#VH2389', product:'Nike Air Max 270',    emoji:'👟', vendor:'SneakerHub',   amount:8999,  status:'Shipped',   date:'15 May 2026' },
    { id:'#VH2376', product:'iPhone 15 Case',      emoji:'📱', vendor:'TechZone',     amount:699,   status:'Confirmed', date:'17 May 2026' },
    { id:'#VH2365', product:'Kindle Paperwhite',   emoji:'📚', vendor:'BookNest',     amount:14999, status:'Placed',    date:'18 May 2026' },
  ],
  products: [
    { id:1,  emoji:'🎧', name:'Sony WH-1000XM5',        vendor:'AudioZone',    price:24999, original:29999, rating:4.8, reviews:1243, category:'Electronics',   stock:15,  badge:'hot',  desc:'Industry-leading noise cancellation with 30-hr battery life.' },
    { id:2,  emoji:'👟', name:'Nike Air Max 270',        vendor:'SneakerHub',   price:8999,  original:10999, rating:4.6, reviews:892,  category:'Fashion',       stock:42,  badge:'sale', desc:'Maximum cushioning meets street style.' },
    { id:3,  emoji:'💻', name:'MacBook Pro Case 14"',    vendor:'TechZone',     price:1299,  original:null,  rating:4.4, reviews:234,  category:'Electronics',   stock:78,  badge:'new',  desc:'Slim-fit hardshell case for MacBook Pro 14-inch.' },
    { id:4,  emoji:'📷', name:'DJI Mini 3 Pro',          vendor:'DroneWorld',   price:64999, original:69999, rating:4.9, reviews:567,  category:'Electronics',   stock:8,   badge:'hot',  desc:'Lightweight drone with 4K HDR video.' },
    { id:5,  emoji:'⌚', name:'Samsung Galaxy Watch 6',  vendor:'GadgetBay',    price:18999, original:22999, rating:4.5, reviews:445,  category:'Electronics',   stock:23,  badge:'sale', desc:'Advanced health monitoring & AMOLED display.' },
    { id:6,  emoji:'📚', name:'Clean Code (Book)',        vendor:'BookNest',     price:599,   original:799,   rating:4.9, reviews:2103, category:'Books',         stock:150, badge:'hot',  desc:'A handbook of agile software craftsmanship by Robert C. Martin.' },
    { id:7,  emoji:'👗', name:'Zara Floral Dress',        vendor:'FashionFirst', price:3499,  original:4999,  rating:4.2, reviews:312,  category:'Fashion',       stock:33,  badge:'sale', desc:'Breathable summer floral print midi dress.' },
    { id:8,  emoji:'🏠', name:'IKEA Poäng Chair',         vendor:'HomeVibes',    price:7499,  original:null,  rating:4.7, reviews:678,  category:'Home & Living', stock:12,  badge:'new',  desc:'Classic armchair with birch veneer and cushion.' },
    { id:9,  emoji:'⚽', name:'Nike Premier League Ball', vendor:'SportsCentral',price:2499,  original:2999,  rating:4.6, reviews:189,  category:'Sports',        stock:55,  badge:null,   desc:'FIFA-quality match ball, official Premier League.' },
    { id:10, emoji:'🎮', name:'PS5 DualSense Controller', vendor:'GamingZone',   price:6499,  original:7499,  rating:4.8, reviews:1456, category:'Electronics',   stock:19,  badge:'hot',  desc:'Adaptive triggers and haptic feedback.' },
    { id:11, emoji:'☕', name:'Nespresso Vertuo Pop',     vendor:'CafeCorner',   price:8999,  original:10999, rating:4.5, reviews:342,  category:'Home & Living', stock:27,  badge:'sale', desc:'5-size coffee brewing at the touch of a button.' },
    { id:12, emoji:'🎵', name:'JBL Charge 5 Speaker',    vendor:'AudioZone',    price:14999, original:16999, rating:4.7, reviews:891,  category:'Electronics',   stock:31,  badge:null,   desc:'Waterproof Bluetooth speaker with 20-hr playtime.' },
 




],
  vendorProducts: [
    { id:101, emoji:'📱', name:'iPhone 15 Pro Case',      price:999,  stock:45, orders:128, revenue:127872, category:'Electronics', badge:'hot'  },
    { id:102, emoji:'💻', name:'Laptop Stand Aluminium',  price:2499, stock:3,  orders:67,  revenue:167433, category:'Electronics', badge:'new'  },
    { id:103, emoji:'🔌', name:'USB-C Hub 7-in-1',        price:1799, stock:89, orders:203, revenue:364797, category:'Electronics', badge:null   },
    { id:104, emoji:'🎧', name:'Wireless Earbuds Pro',    price:3999, stock:22, orders:154, revenue:615846, category:'Electronics', badge:'hot'  },
    { id:105, emoji:'⌨️', name:'Mechanical Keyboard RGB', price:4499, stock:15, orders:89,  revenue:400411, category:'Electronics', badge:null   },
  ],
  vendorOrders: [
    { id:'#VH2401', product:'iPhone 15 Pro Case',  buyer:'Rahul S.',  amount:999,  status:'Delivered', date:'12 May' },
    { id:'#VH2389', product:'Laptop Stand',         buyer:'Priya M.',  amount:2499, status:'Shipped',   date:'14 May' },
    { id:'#VH2376', product:'USB-C Hub',            buyer:'Amit K.',   amount:1799, status:'Confirmed', date:'16 May' },
    { id:'#VH2365', product:'Wireless Earbuds Pro', buyer:'Sneha R.',  amount:3999, status:'Placed',    date:'18 May' },
    { id:'#VH2354', product:'Mechanical Keyboard',  buyer:'Vikram T.', amount:4499, status:'Placed',    date:'18 May' },
  ],
  pendingVendors: [
    { id:'V001', name:'Spice Garden',   owner:'Meena Patel',  category:'Food',        location:'Ahmedabad', applied:'15 May', products:23, emoji:'🌶️' },
    { id:'V002', name:'StyleBox',       owner:'Anjali Verma', category:'Fashion',     location:'Jaipur',    applied:'16 May', products:47, emoji:'👔' },
    { id:'V003', name:'TechRepair Pro', owner:'Suresh Nair',  category:'Electronics', location:'Bangalore', applied:'17 May', products:12, emoji:'🔧' },
  ],
  refunds: [
    { id:'R001', order:'#VH2301', product:'Broken Charger',  buyer:'Kapil D.', amount:499,  reason:'Defective product',    status:'Pending'  },
    { id:'R002', order:'#VH2298', product:'Wrong Size Shoes', buyer:'Pooja S.', amount:3499, reason:'Wrong size delivered', status:'Pending'  },
    { id:'R003', order:'#VH2289', product:'Old Edition Book', buyer:'Arjun R.', amount:599,  reason:'Wrong edition',        status:'Approved' },
  ],
  categories: [
    { id:1, name:'Electronics',   icon:'📱', sub:['Mobiles','Laptops','Audio','Wearables','Gaming'],    products:4521 },
    { id:2, name:'Fashion',       icon:'👗', sub:['Men','Women','Kids','Accessories','Footwear'],       products:8932 },
    { id:3, name:'Home & Living', icon:'🏠', sub:['Furniture','Decor','Kitchen','Bedding','Lighting'],  products:3241 },
    { id:4, name:'Sports',        icon:'⚽', sub:['Cricket','Football','Gym','Yoga','Outdoor'],         products:1876 },
    { id:5, name:'Books',         icon:'📚', sub:['Fiction','Tech','Self-Help','Comics','Academic'],    products:6540 },
    { id:6, name:'Food',          icon:'☕', sub:['Snacks','Beverages','Organic','Spices','Sweets'],    products:2109 },
  ],
  searchResults: null,
};

const NAVS = {
  buyer: [
    { id:'home',     icon:'🏠', label:'Home' },
    { id:'browse',   icon:'🔍', label:'Browse Products' },
    { id:'orders',   icon:'📦', label:'My Orders' },
    { id:'tracking', icon:'🚚', label:'Order Tracking' },
    { id:'reviews',  icon:'⭐', label:'Reviews' },
    { id:'ai-recs',  icon:'✨', label:'AI Picks', badge:'New' },
  ],
  seller: [
    { id:'seller-home',     icon:'📊', label:'Dashboard' },
    { id:'my-products',     icon:'📦', label:'My Products' },
    { id:'seller-orders',   icon:'🛒', label:'Orders' },
    { id:'earnings',        icon:'💰', label:'Earnings' },
    { id:'seller-register', icon:'✅', label:'Registration' },
  ],
  admin: [
    { id:'admin-home',      icon:'📊', label:'Analytics' },
    { id:'vendor-approval', icon:'✅', label:'Vendor Approvals', badge:'3' },
    { id:'categories',      icon:'🏷️', label:'Categories' },
    { id:'refunds',         icon:'↩️', label:'Refund Requests',  badge:'2' },
    { id:'commission',      icon:'💸', label:'Commission Settings' },
  ],
};

const ROLE_META = {
  buyer:  { name:'Rahul Sharma',   role:'Buyer Account',  avatar:'RS', color:'#FF4F00' },
  seller: { name:'TechZone Store', role:'Seller Account', avatar:'TZ', color:'#0047FF' },
  admin:  { name:'Admin User',     role:'Platform Admin', avatar:'AD', color:'#6B21A8' },
};