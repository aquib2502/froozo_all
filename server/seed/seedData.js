const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/froozo_pos';

// ─── REAL FROOZO MENU (extracted from actual menu images) ───────────────────

const categories = [
  { name: 'Beverages',           icon: '☕', sortOrder: 1  },
  { name: 'Mocktails',           icon: '🍹', sortOrder: 2  },
  { name: 'Shakes & Ice Cream',  icon: '🍦', sortOrder: 3  },
  { name: 'Waffles & Pancakes',  icon: '🧇', sortOrder: 4  },
  { name: 'Desserts',            icon: '🍮', sortOrder: 5  },
  { name: 'Pizza',               icon: '🍕', sortOrder: 6  },
  { name: 'Sandwich',            icon: '🥪', sortOrder: 7  },
  { name: 'Burger',              icon: '🍔', sortOrder: 8  },
  { name: 'Wraps',               icon: '🌯', sortOrder: 9  },
  { name: 'Pasta',               icon: '🍝', sortOrder: 10 },
  { name: 'Fries',               icon: '🍟', sortOrder: 11 },
  { name: 'Nachos',              icon: '🧀', sortOrder: 12 },
  { name: 'Maggi',               icon: '🍜', sortOrder: 13 },
  { name: 'Momos',               icon: '🥟', sortOrder: 14 },
  { name: 'Starters',            icon: '🍱', sortOrder: 15 },
  { name: 'Bread & Buns',        icon: '🍞', sortOrder: 16 },
  { name: 'Stuffed Nanza',       icon: '🫓', sortOrder: 17 },
];

const productsByCat = {

  // ── BEVERAGES ────────────────────────────────────────────────────────────
  Beverages: [
    { name: 'Green Tea',          price: 50,  description: 'Light and refreshing hot green tea' },
    { name: 'Masala Chai',        price: 50,  description: 'Spiced Indian chai, served hot' },
    { name: 'Black Coffee',       price: 60,  description: 'Simple and strong black coffee' },
    { name: 'Coffee',             price: 60,  description: 'Classic hot coffee' },
    { name: 'Hazelnut Coffee',    price: 70,  description: 'Coffee with hazelnut flavour' },
    { name: 'Espresso',           price: 70,  description: 'Pure bold espresso shot' },
    { name: 'Rich Aroma Coffee',  price: 100, description: 'Full-bodied aromatic coffee blend' },
    { name: 'Hot Chocolate',      price: 100, description: 'Creamy rich hot chocolate' },
    { name: 'Arabic Qahwa',       price: 150, description: 'Traditional Arabic coffee served with dates' },
  ],

  // ── MOCKTAILS ────────────────────────────────────────────────────────────
  Mocktails: [
    { name: 'Mix Berry Mojito',    price: 100, description: 'Mixed berry blend with mint and soda' },
    { name: 'Mint Mojito',         price: 100, description: 'Fresh mint, lime, soda — the classic' },
    { name: 'Mama Mojito',         price: 100, description: 'Froozo\'s signature mama mocktail' },
    { name: 'Watermelon Mojito',   price: 100, description: 'Juicy watermelon with fizzy mint freshness' },
    { name: 'Guava Merry',         price: 100, description: 'Guava mocktail with a merry twist' },
    { name: 'Mango Mojito',        price: 100, description: 'Fresh mango with mint and lime soda' },
    { name: 'Orange Mojito',       price: 100, description: 'Zesty orange with mint and soda' },
    { name: 'Kiwi Mojito',         price: 100, description: 'Tangy kiwi with mint fizz' },
    { name: 'Strawberry Mojito',   price: 100, description: 'Fresh strawberry with lime and soda' },
    { name: 'Cool Blue',           price: 100, description: 'Cool blue curacao mocktail' },
    { name: 'Lemon Ice Tea',       price: 100, description: 'Chilled lemon iced tea' },
    { name: 'Masala Lemonade',     price: 100, description: 'Tangy lemonade with Indian masala' },
    { name: 'Jeera Soda',          price: 100, description: 'Refreshing cumin soda drink' },
    { name: 'Party Jar (Mocktail)',price: 550, description: 'Any one mocktail in a large party jar — serves 4' },
  ],

  // ── SHAKES & ICE CREAM ROLLS ──────────────────────────────────────────────
  'Shakes & Ice Cream': [
    { name: 'Classic Cold Coffee (Roll)',   price: 150, description: 'Ice cream roll — classic cold coffee flavour' },
    { name: 'Classic Cold Coffee (Shake)',  price: 130, description: 'Thick shake — cold coffee flavour' },
    { name: 'Coffee Mocha (Roll)',          price: 170, description: 'Ice cream roll — coffee mocha' },
    { name: 'Coffee Mocha (Shake)',         price: 150, description: 'Thick shake — coffee mocha' },
    { name: 'KitKat Break (Roll)',          price: 180, description: 'Ice cream roll — KitKat crunch' },
    { name: 'KitKat Break (Shake)',         price: 160, description: 'Thick shake — KitKat' },
    { name: 'Nutella Nudge (Roll)',         price: 180, description: 'Ice cream roll — Nutella indulgence' },
    { name: 'Nutella Nudge (Shake)',        price: 160, description: 'Thick shake — Nutella' },
    { name: 'Dark Belgian (Roll)',          price: 180, description: 'Ice cream roll — dark Belgian chocolate' },
    { name: 'Dark Belgian (Shake)',         price: 160, description: 'Thick shake — dark Belgian chocolate' },
    { name: 'Nut-Kit-Oreo (Roll)',          price: 190, description: 'Ice cream roll — Nutella, KitKat & Oreo combo' },
    { name: 'Nut-Kit-Oreo (Shake)',         price: 170, description: 'Thick shake — Nutella, KitKat & Oreo' },
    { name: 'Oreo Chunk (Roll)',            price: 190, description: 'Ice cream roll — loaded Oreo chunks' },
    { name: 'Oreo Chunk (Shake)',           price: 170, description: 'Thick shake — Oreo chunks' },
    { name: 'Brownie Affair (Roll)',        price: 190, description: 'Ice cream roll — brownie affair' },
    { name: 'Brownie Affair (Shake)',       price: 170, description: 'Thick shake — brownie' },
    { name: 'Berry Blast (Roll)',           price: 190, description: 'Ice cream roll — mixed berry blast' },
    { name: 'Berry Blast (Shake)',          price: 170, description: 'Thick shake — berry blast' },
    { name: 'Cookies & Cream (Roll)',       price: 190, description: 'Ice cream roll — cookies & cream' },
    { name: 'Cookies & Cream (Shake)',      price: 170, description: 'Thick shake — cookies & cream' },
    { name: 'Strawberry (Roll)',            price: 190, description: 'Ice cream roll — fresh strawberry' },
    { name: 'Strawberry (Shake)',           price: 170, description: 'Thick shake — strawberry' },
    { name: 'Hazel Nut Coffee (Roll)',      price: 190, description: 'Ice cream roll — hazelnut coffee' },
    { name: 'Hazel Nut Coffee (Shake)',     price: 170, description: 'Thick shake — hazelnut coffee' },
    { name: 'Mango (Roll)',                 price: 190, description: 'Ice cream roll — fresh mango' },
    { name: 'Mango (Shake)',                price: 170, description: 'Thick shake — mango' },
    { name: 'Watermelon (Roll)',            price: 190, description: 'Ice cream roll — watermelon' },
    { name: 'Watermelon (Shake)',           price: 170, description: 'Thick shake — watermelon' },
    { name: 'Guava (Roll)',                 price: 190, description: 'Ice cream roll — guava' },
    { name: 'Guava (Shake)',                price: 170, description: 'Thick shake — guava' },
    { name: 'Orange (Roll)',                price: 190, description: 'Ice cream roll — orange' },
    { name: 'Orange (Shake)',               price: 170, description: 'Thick shake — orange' },
    { name: 'Kiwi (Roll)',                  price: 190, description: 'Ice cream roll — kiwi' },
    { name: 'Kiwi (Shake)',                 price: 170, description: 'Thick shake — kiwi' },
    { name: 'Lotus Biscoff Shake',          price: 250, description: 'Signature Lotus Biscoff ice cream roll' },
    { name: 'Lotus Biscoff (Thick Shake)',  price: 200, description: 'Lotus Biscoff thick shake' },
    { name: 'Froozo Dates Shake',           price: 220, description: 'Special Froozo dates thick shake' },
  ],

  // ── WAFFLES & PANCAKES ────────────────────────────────────────────────────
  'Waffles & Pancakes': [
    { name: 'Chocolate Loaded',      price: 150, description: 'Waffle/pancake loaded with chocolate' },
    { name: 'Choco Oreo',            price: 160, description: 'Chocolate and Oreo waffle' },
    { name: 'Choco KitKat',          price: 160, description: 'Chocolate and KitKat waffle' },
    { name: 'Berrylicious',          price: 180, description: 'Berry-loaded waffle delight' },
    { name: 'Choco Nutella',         price: 180, description: 'Waffle with Nutella spread' },
    { name: 'Cookie & Cream',        price: 180, description: 'Cookies and cream waffle' },
    { name: 'Brownie Dust',          price: 180, description: 'Waffle with brownie dust topping' },
    { name: 'Butter Crunch',         price: 180, description: 'Crispy butter crunch waffle' },
    { name: 'Lotus Biscoff Smooth',  price: 220, description: 'Waffle with smooth Lotus Biscoff spread' },
    { name: 'Lotus Biscoff Crunchy', price: 220, description: 'Waffle with crunchy Lotus Biscoff' },
  ],

  // ── DESSERTS ─────────────────────────────────────────────────────────────
  Desserts: [
    { name: 'Shahi Gulab Jamun (2 pcs)', price: 200, description: 'Royal gulab jamun served warm, 2 pieces' },
    { name: 'Maramari Mango',            price: 100, description: 'Froozo special mango dessert' },
    { name: 'Maramari Rose',             price: 100, description: 'Froozo special rose-flavoured dessert' },
  ],

  // ── PIZZA ─────────────────────────────────────────────────────────────────
  Pizza: [
    { name: 'Margherita (7")',             price: 130, description: 'Classic tomato and mozzarella — 7 inch' },
    { name: 'Margherita (10")',            price: 210, description: 'Classic tomato and mozzarella — 10 inch' },
    { name: 'Margherita Di Bufalo (7")',   price: 160, description: 'Buffalo mozzarella margherita — 7 inch' },
    { name: 'Margherita Di Bufalo (10")', price: 260, description: 'Buffalo mozzarella margherita — 10 inch' },
    { name: 'Classic Veg (7")',            price: 150, description: 'Classic loaded veg pizza — 7 inch' },
    { name: 'Classic Veg (10")',           price: 260, description: 'Classic loaded veg pizza — 10 inch' },
    { name: 'Farm House (7")',             price: 150, description: 'Farm house veg pizza — 7 inch' },
    { name: 'Farm House (10")',            price: 260, description: 'Farm house veg pizza — 10 inch' },
    { name: 'Garden Fresh (7")',           price: 170, description: 'Garden fresh veg pizza — 7 inch' },
    { name: 'Garden Fresh (10")',          price: 270, description: 'Garden fresh veg pizza — 10 inch' },
    { name: 'Spicy Supreme (7")',          price: 180, description: 'Spicy supreme pizza — 7 inch' },
    { name: 'Spicy Supreme (10")',         price: 280, description: 'Spicy supreme pizza — 10 inch' },
    { name: 'Too Much Hot (7")',           price: 180, description: 'Extra spicy pizza — 7 inch' },
    { name: 'Too Much Hot (10")',          price: 280, description: 'Extra spicy pizza — 10 inch' },
    { name: 'Paneer Makhani (7")',         price: 250, description: 'Rich paneer makhani pizza — 7 inch' },
    { name: 'Paneer Makhani (10")',        price: 350, description: 'Rich paneer makhani pizza — 10 inch' },
    { name: 'Paneer Chilly (7")',          price: 250, description: 'Spicy paneer chilly pizza — 7 inch' },
    { name: 'Paneer Chilly (10")',         price: 350, description: 'Spicy paneer chilly pizza — 10 inch' },
    { name: 'Tandoori Paneer (7")',        price: 250, description: 'Tandoori paneer pizza — 7 inch' },
    { name: 'Tandoori Paneer (10")',       price: 350, description: 'Tandoori paneer pizza — 10 inch' },
    { name: 'Mix Veg Pizza (15")',         price: 450, description: 'Large 15 inch loaded mix veg pizza' },
    // Kulhad Pizza
    { name: 'Kulhad — Veg Classic',       price: 130, description: 'Pizza served in a kulhad — veg classic' },
    { name: 'Kulhad — Spicy Corn',        price: 150, description: 'Pizza in kulhad — spicy corn' },
    { name: 'Kulhad — Fresh Veggie',      price: 130, description: 'Pizza in kulhad — fresh veggie' },
    { name: 'Kulhad — Paneer Makhanwal',  price: 170, description: 'Pizza in kulhad — paneer makhani' },
    { name: 'Kulhad — Balle Balle',       price: 170, description: 'Pizza in kulhad — balle balle' },
    { name: 'Kulhad — Yum Dum',           price: 170, description: 'Pizza in kulhad — yum dum' },
    { name: 'Matka Pizza (Small)',         price: 300, description: 'Pizza served in a matka — small' },
    { name: 'Matka Pizza (Big)',           price: 450, description: 'Pizza served in a matka — big' },
  ],

  // ── SANDWICH ──────────────────────────────────────────────────────────────
  Sandwich: [
    // Veg
    { name: 'Veg Cheese Grill',       price: 120, description: 'Grilled veg sandwich with cheese' },
    { name: 'Veg Mayo Grill',         price: 120, description: 'Grilled veg sandwich with mayo' },
    { name: 'Chipotle Cheese Grill',  price: 130, description: 'Chipotle spiced cheese grill sandwich' },
    { name: 'Pizza Cheese Grill',     price: 130, description: 'Pizza-style cheese grill sandwich' },
    { name: 'Melted Cheese Grill',    price: 150, description: 'Extra melted cheese grill sandwich' },
    { name: 'Makhani Paneer Grill',   price: 150, description: 'Paneer makhani grilled sandwich' },
    // Chicken
    { name: 'Chicken Mayo Grill',     price: 170, description: 'Grilled chicken sandwich with mayo' },
    { name: 'Chicken Cheese Grill',   price: 180, description: 'Grilled chicken sandwich with cheese' },
    { name: 'Chicken Makhani Grill',  price: 200, description: 'Chicken makhani grilled sandwich' },
    { name: 'Chicken Tandoori Grill', price: 200, description: 'Tandoori chicken grilled sandwich' },
  ],

  // ── BURGER ────────────────────────────────────────────────────────────────
  Burger: [
    // Veg
    { name: 'Veg Tikki',               price: 110, description: 'Classic veg tikki burger' },
    { name: 'Cheesy Veg',              price: 130, description: 'Veg burger loaded with cheese' },
    { name: 'Chipotle Cheese (Veg)',   price: 140, description: 'Veg burger with chipotle cheese sauce' },
    { name: 'Makhani Special (Veg)',   price: 150, description: 'Veg makhani special burger' },
    { name: 'Tandoori Special (Veg)',  price: 150, description: 'Veg tandoori special burger' },
    { name: 'Double Decker (Veg)',     price: 200, description: 'Double-patty veg burger' },
    { name: 'Paneer Double Decker',    price: 250, description: 'Double paneer patty loaded burger' },
    // Chicken / Egg / Fish
    { name: 'Egg Burger',              price: 150, description: 'Classic egg burger' },
    { name: 'Spicy Tandoori Chicken',  price: 160, description: 'Spicy tandoori chicken burger' },
    { name: 'Chicken Paradise',        price: 160, description: 'Juicy chicken paradise burger' },
    { name: 'BBQ Chicken',             price: 160, description: 'BBQ sauced chicken burger' },
    { name: 'Chicken Grill',           price: 170, description: 'Grilled chicken burger' },
    { name: 'Double Cheese Chicken',   price: 180, description: 'Chicken burger with double cheese' },
    { name: 'Chicken Egg Mayo',        price: 200, description: 'Chicken and egg with mayo burger' },
    { name: 'Chicken Egg Cheese',      price: 200, description: 'Chicken, egg and cheese burger' },
    { name: 'Chicken Egg Spicy',       price: 200, description: 'Spicy chicken and egg burger' },
    { name: 'Fish Burger',             price: 250, description: 'Crispy fish fillet burger' },
    { name: 'Mutton Mayo',             price: 280, description: 'Mutton burger with mayo' },
    { name: 'Mutton Cheese',           price: 290, description: 'Mutton burger with cheese' },
  ],

  // ── WRAPS ─────────────────────────────────────────────────────────────────
  Wraps: [
    // Veg
    { name: 'Cheesy Veg Wrap',         price: 150, description: 'Cheesy veg filling in a soft wrap' },
    { name: 'Mexican Cheesy Wrap',     price: 160, description: 'Mexican-style cheesy veg wrap' },
    { name: 'Paneer Chipotle Wrap',    price: 170, description: 'Paneer with chipotle sauce wrap' },
    { name: 'Paneer Makhani Wrap',     price: 170, description: 'Paneer makhani wrapped to go' },
    { name: 'Paneer Tandoori Wrap',    price: 170, description: 'Tandoori paneer in a soft wrap' },
    // Chicken
    { name: 'BBQ Chicken Wrap',        price: 180, description: 'BBQ chicken wrapped with slaw' },
    { name: 'Tandoori Chicken Wrap',   price: 200, description: 'Tandoori chicken wrap' },
    { name: 'Peri Peri Chicken Wrap',  price: 200, description: 'Peri peri spiced chicken wrap' },
    { name: 'Spicy Mexican Chicken',   price: 200, description: 'Spicy Mexican chicken wrap' },
    { name: 'Cheesy Chicken Wrap',     price: 220, description: 'Chicken wrap with extra cheese' },
    { name: 'Chicken Keema Wrap',      price: 230, description: 'Chicken keema in a soft wrap' },
    { name: 'Chicken Seekh Kebab Wrap',price: 230, description: 'Chicken seekh kebab wrap' },
  ],

  // ── PASTA ─────────────────────────────────────────────────────────────────
  Pasta: [
    // Veg
    { name: 'Arrabiata (Veg)',          price: 190, description: 'Spicy tomato arrabiata pasta' },
    { name: 'Alfredo (Veg)',            price: 200, description: 'Creamy white sauce Alfredo pasta' },
    { name: 'Mac and Cheese (Veg)',     price: 210, description: 'Classic mac and cheese' },
    { name: 'Rose Sauce (Veg)',         price: 230, description: 'Pasta in a creamy rose sauce' },
    { name: 'Aglio Olio (Veg)',         price: 250, description: 'Garlic and olive oil pasta' },
    { name: 'Pesto Veg',               price: 270, description: 'Pasta with basil pesto sauce' },
    { name: 'Spaghetti Pesto (Veg)',    price: 330, description: 'Spaghetti with basil pesto' },
    // Chicken
    { name: 'Chicken Arrabiata',        price: 230, description: 'Spicy arrabiata pasta with chicken' },
    { name: 'Chicken Alfredo',          price: 250, description: 'Creamy Alfredo pasta with chicken' },
    { name: 'Chicken Mac and Cheese',   price: 260, description: 'Mac and cheese with chicken' },
    { name: 'Chicken Rose Sauce',       price: 250, description: 'Rose sauce pasta with chicken' },
    { name: 'Chicken Aglio Olio',       price: 270, description: 'Aglio olio with grilled chicken' },
    { name: 'Chicken Pesto',            price: 280, description: 'Pesto pasta with chicken' },
    { name: 'Spaghetti Aglio Olio',     price: 370, description: 'Spaghetti aglio olio with chicken' },
    { name: 'Spaghetti Pesto (Chicken)',price: 380, description: 'Spaghetti pesto with chicken' },
  ],

  // ── FRIES ─────────────────────────────────────────────────────────────────
  Fries: [
    { name: 'Regular Fries',           price: 150, description: 'Crispy golden regular fries' },
    { name: 'Peri Peri Fries',         price: 170, description: 'Fries with peri peri seasoning' },
    { name: 'Chipotle Fries',          price: 180, description: 'Fries with chipotle seasoning' },
    { name: 'Cheesy Fries',            price: 180, description: 'Fries topped with melted cheese sauce' },
    { name: 'PP Chipotle Cheese Fries',price: 200, description: 'Peri peri and chipotle cheese loaded fries' },
  ],

  // ── NACHOS ────────────────────────────────────────────────────────────────
  Nachos: [
    { name: 'Cheesy Nachos',          price: 170, description: 'Crunchy nachos with cheese dip' },
    { name: 'Mexican Loaded Nachos',  price: 190, description: 'Nachos fully loaded with Mexican toppings' },
  ],

  // ── MAGGI ─────────────────────────────────────────────────────────────────
  Maggi: [
    { name: 'Desi Maggi',         price: 90,  description: 'Classic desi-style Maggi noodles' },
    { name: 'Videsi Maggi',       price: 110, description: 'International-style Maggi' },
    { name: 'Schezwan Maggi',     price: 110, description: 'Maggi with spicy schezwan sauce' },
    { name: 'Cheesy Maggi',       price: 130, description: 'Maggi loaded with melted cheese' },
    { name: 'Pink Maggi',         price: 150, description: 'Froozo signature pink sauce Maggi' },
    { name: 'Froozo Special Maggi', price: 170, description: 'Chef\'s special loaded Maggi — the house favourite' },
  ],

  // ── MOMOS ─────────────────────────────────────────────────────────────────
  Momos: [
    // Veg
    { name: 'Veg Momo',              price: 100, description: 'Steamed veg momos (6 pcs)' },
    { name: 'Peri Peri Momo (Veg)',  price: 110, description: 'Veg momos with peri peri seasoning' },
    { name: 'Cheese Corn Momo',      price: 120, description: 'Cheese and corn stuffed momos' },
    { name: 'Paneer Momo',           price: 140, description: 'Paneer-stuffed steamed momos' },
    // Chicken
    { name: 'Chicken Momo',          price: 150, description: 'Steamed chicken momos (6 pcs)' },
    { name: 'Peri Peri Chicken Momo',price: 170, description: 'Chicken momos with peri peri' },
    { name: 'Chicken Cheese Momo',   price: 180, description: 'Chicken and cheese stuffed momos' },
  ],

  // ── STARTERS ──────────────────────────────────────────────────────────────
  Starters: [
    // Veg — Half / Full (using Full price as default)
    { name: 'Onion Rings (Half)',          price: 130, description: 'Crispy battered onion rings — half portion' },
    { name: 'Onion Rings (Full)',          price: 160, description: 'Crispy battered onion rings — full portion' },
    { name: 'Veg Smilies (Half)',          price: 140, description: 'Smiley-face potato bites — half' },
    { name: 'Veg Smilies (Full)',          price: 180, description: 'Smiley-face potato bites — full' },
    { name: 'Veg Nuggets (Half)',          price: 140, description: 'Crispy veg nuggets — half' },
    { name: 'Veg Nuggets (Full)',          price: 180, description: 'Crispy veg nuggets — full' },
    { name: 'Crispy Pizza Fingers (Half)', price: 150, description: 'Pizza-flavoured finger snacks — half' },
    { name: 'Crispy Pizza Fingers (Full)', price: 200, description: 'Pizza-flavoured finger snacks — full' },
    { name: 'Cheese Shots (Half)',         price: 150, description: 'Fried cheese shots — half' },
    { name: 'Cheese Shots (Full)',         price: 200, description: 'Fried cheese shots — full' },
    { name: 'Hara Bhara Kebab (Half)',     price: 180, description: 'Spinach and pea kebab — half' },
    { name: 'Hara Bhara Kebab (Full)',     price: 220, description: 'Spinach and pea kebab — full' },
    { name: 'Lebanese Falafel Kebab (Half)',price: 180, description: 'Lebanese falafel kebab — half' },
    { name: 'Lebanese Falafel Kebab (Full)',price: 220, description: 'Lebanese falafel kebab — full' },
    // Non Veg
    { name: 'Chicken Popcorn (Half)',      price: 150, description: 'Crispy chicken popcorn — half' },
    { name: 'Chicken Popcorn (Full)',      price: 210, description: 'Crispy chicken popcorn — full' },
    { name: 'Chicken Nuggets (Half)',      price: 160, description: 'Chicken nuggets — half' },
    { name: 'Chicken Nuggets (Full)',      price: 220, description: 'Chicken nuggets — full' },
    { name: 'Chicken Cheese Ball (Half)',  price: 170, description: 'Chicken cheese balls — half' },
    { name: 'Chicken Cheese Ball (Full)',  price: 230, description: 'Chicken cheese balls — full' },
    { name: 'Chicken Wings (Half)',        price: 180, description: 'Crispy chicken wings — half' },
    { name: 'Chicken Wings (Full)',        price: 210, description: 'Crispy chicken wings — full' },
    { name: 'Chicken Seekh Kebab (Half)',  price: 250, description: 'Chicken seekh kebab — half' },
    { name: 'Chicken Seekh Kebab (Full)',  price: 370, description: 'Chicken seekh kebab — full' },
    { name: 'Chicken Tender Crispy',       price: 250, description: 'Crispy chicken tender strips' },
    { name: 'Chicken Drum Stick',          price: 280, description: 'Juicy chicken drumstick' },
    { name: 'Fish Popcorn',               price: 230, description: 'Crispy fish popcorn bites' },
    { name: 'Fish Fingers',               price: 240, description: 'Crumbed fish finger strips' },
    { name: 'Crab Stick',                 price: 250, description: 'Crispy crab stick' },
    { name: 'Lobster Bites',              price: 300, description: 'Tender lobster bites' },
    { name: 'Prawns Popcorn',             price: 320, description: 'Crispy prawn popcorn' },
  ],

  // ── BREAD & BUNS ──────────────────────────────────────────────────────────
  'Bread & Buns': [
    // Veg
    { name: 'Garlic Bread',                   price: 130, description: 'Toasted garlic bread' },
    { name: 'Cheese Garlic Bread',            price: 150, description: 'Garlic bread loaded with cheese' },
    { name: 'Veg Burgerizza',                 price: 170, description: 'Froozo\'s veg burger-pizza fusion bread' },
    { name: 'Paneer Burgerizza',              price: 190, description: 'Paneer burger-pizza fusion bread' },
    // Chicken
    { name: 'Chicken Keema Garlic Bread',     price: 180, description: 'Garlic bread with chicken keema topping' },
    { name: 'Chicken Keema Cheese Garlic Bread', price: 210, description: 'Garlic bread with chicken keema and cheese' },
    { name: 'Chicken Pepperoni Bread',        price: 230, description: 'Bread topped with chicken pepperoni' },
  ],

  // ── STUFFED NANZA ────────────────────────────────────────────────────────
  'Stuffed Nanza': [
    // Veg
    { name: 'Smoked Tandoori Nanza (Veg)',    price: 170, description: 'Nanza stuffed with smoked tandoori veg' },
    { name: 'Spiced Supreme Nanza (Veg)',     price: 170, description: 'Nanza with spiced supreme veg filling' },
    { name: 'Exotic Cheesy Nanza (Veg)',      price: 200, description: 'Nanza stuffed with exotic cheesy veg' },
    { name: 'Paneer Makhanwala Nanza',        price: 200, description: 'Nanza stuffed with paneer makhani' },
    // Chicken
    { name: 'Smoked Chicken Nanza',           price: 230, description: 'Nanza stuffed with smoked chicken' },
    { name: 'Spicy Chicken Supreme Nanza',    price: 230, description: 'Nanza with spicy chicken supreme filling' },
    { name: 'Chicken Tikka Makhanwala Nanza', price: 250, description: 'Nanza with chicken tikka makhani' },
    { name: 'Double Cheesy Chicken Nanza',    price: 260, description: 'Nanza with double cheese chicken filling' },
  ],
};

// ─── DEMO ORDERS (realistic for today's dashboard) ──────────────────────────
const demoOrders = [
  {
    tableNumber: 'Table 2',
    items: [
      { name: 'Cappuccino',     quantity: 2, price: 180 }, // Note: not in new menu - kept for demo
      { name: 'Veg Cheese Grill', quantity: 1, price: 120 },
    ],
    orderStatus: 'Completed', paymentStatus: 'Paid', paymentMethod: 'UPI', totalAmount: 480,
  },
  {
    tableNumber: 'Table 4',
    items: [
      { name: 'Mint Mojito',          quantity: 2, price: 100 },
      { name: 'Cheesy Nachos',        quantity: 1, price: 170 },
      { name: 'Veg Tikki',            quantity: 1, price: 110 },
    ],
    orderStatus: 'Completed', paymentStatus: 'Paid', paymentMethod: 'Cash', totalAmount: 480,
  },
  {
    tableNumber: 'Takeaway',
    items: [
      { name: 'Classic Cold Coffee (Shake)', quantity: 1, price: 130 },
      { name: 'Choco Oreo',                  quantity: 1, price: 160 },
    ],
    orderStatus: 'Completed', paymentStatus: 'Paid', paymentMethod: 'UPI', totalAmount: 290,
  },
  {
    tableNumber: 'Table 1',
    items: [
      { name: 'Hazelnut Coffee',   quantity: 2, price: 70  },
      { name: 'Cheesy Maggi',      quantity: 1, price: 130 },
      { name: 'Regular Fries',     quantity: 2, price: 150 },
    ],
    orderStatus: 'Completed', paymentStatus: 'Paid', paymentMethod: 'Cash', totalAmount: 570,
  },
  {
    tableNumber: 'Table 3',
    items: [
      { name: 'Hot Chocolate',               quantity: 2, price: 100 },
      { name: 'Cool Blue',                   quantity: 1, price: 100 },
      { name: 'Lotus Biscoff Smooth',        quantity: 1, price: 220 },
    ],
    orderStatus: 'Completed', paymentStatus: 'Paid', paymentMethod: 'UPI', totalAmount: 520,
  },
  {
    tableNumber: 'Table 5',
    items: [
      { name: 'Espresso',             quantity: 2, price: 70  },
      { name: 'Margherita (7")',       quantity: 1, price: 130 },
      { name: 'Peri Peri Fries',      quantity: 1, price: 170 },
    ],
    orderStatus: 'Completed', paymentStatus: 'Paid', paymentMethod: 'Cash', totalAmount: 440,
  },
  {
    tableNumber: 'Takeaway',
    items: [
      { name: 'Oreo Chunk (Shake)',   quantity: 2, price: 170 },
      { name: 'Choco KitKat',         quantity: 1, price: 160 },
    ],
    orderStatus: 'Completed', paymentStatus: 'Paid', paymentMethod: 'UPI', totalAmount: 500,
  },
  {
    tableNumber: 'Table 2',
    items: [
      { name: 'Mango (Shake)',         quantity: 2, price: 170 },
      { name: 'Froozo Special Maggi',  quantity: 1, price: 170 },
    ],
    orderStatus: 'Completed', paymentStatus: 'Paid', paymentMethod: 'Cash', totalAmount: 510,
  },
  {
    tableNumber: 'Table 1',
    items: [
      { name: 'Strawberry Mojito',     quantity: 2, price: 100 },
      { name: 'Chicken Cheese Grill',  quantity: 1, price: 180 },
      { name: 'Cheesy Fries',          quantity: 1, price: 180 },
    ],
    orderStatus: 'Ready', paymentStatus: 'Pending', paymentMethod: null, totalAmount: 560,
  },
  {
    tableNumber: 'Table 3',
    items: [
      { name: 'Rich Aroma Coffee',     quantity: 2, price: 100 },
      { name: 'Paneer Makhani (7")',   quantity: 1, price: 250 },
    ],
    orderStatus: 'Preparing', paymentStatus: 'Pending', paymentMethod: null, totalAmount: 450,
  },
  {
    tableNumber: 'Table 4',
    items: [
      { name: 'Lotus Biscoff (Thick Shake)', quantity: 1, price: 200 },
      { name: 'Mexican Loaded Nachos',       quantity: 1, price: 190 },
      { name: 'Veg Momo',                    quantity: 1, price: 100 },
    ],
    orderStatus: 'Pending', paymentStatus: 'Pending', paymentMethod: null, totalAmount: 490,
  },
];

// ─── SEED FUNCTION ───────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const savedCats = await Category.insertMany(categories);
    console.log(`✅ Seeded ${savedCats.length} categories`);

    const catMap = {};
    savedCats.forEach((c) => (catMap[c.name] = c._id));

    const allProducts = [];
    for (const [catName, items] of Object.entries(productsByCat)) {
      for (const item of items) {
        allProducts.push({ ...item, categoryId: catMap[catName] });
      }
    }
    const savedProducts = await Product.insertMany(allProducts);
    console.log(`✅ Seeded ${savedProducts.length} products across ${savedCats.length} categories`);

    const productMap = {};
    savedProducts.forEach((p) => (productMap[p.name] = p._id));

    for (let i = 0; i < demoOrders.length; i++) {
      const o = demoOrders[i];
      const itemsWithId = o.items.map((item) => ({
        ...item,
        productId: productMap[item.name] || savedProducts[0]._id,
      }));
      const order = new Order({
        ...o,
        items: itemsWithId,
        orderNumber: 1001 + i,
        createdAt: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000),
      });
      await order.save();
    }
    console.log(`✅ Seeded ${demoOrders.length} demo orders`);
    console.log('🎉 Froozo POS — real menu seeded successfully!');

    if (require.main === module) process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    if (require.main === module) process.exit(1);
  }
}

if (require.main === module) {
  seed();
} else {
  seed();
}
