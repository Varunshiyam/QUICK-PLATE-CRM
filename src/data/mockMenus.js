import { menuAssets } from '../assets/images/menu-items/index.js';

export const mockMenus = {
  // Bakery
  'bakery & pastry': [
    {
      category: 'Starters',
      items: [
        { id: 'bks1', title: 'Warm Cinnamon Pecan Roll', desc: 'Fresh out the oven, coated in sweet cream cheese glaze and toasted pecans.', price: '$5.50', badge: 'Best Seller', img: menuAssets.bks1_cinnamon_roll },
        { id: 'bks2', title: 'Blueberry Scones', desc: 'Buttery, flakey, loaded with wild blueberries.', price: '$4.00', img: menuAssets.bks2_scones },
      ]
    },
    {
      category: 'Main Course',
      items: [
        { id: 'bkm1', title: 'Artisan Croissant Sandwich', desc: 'Turkey, melted gruyere, spinach, and dijonnaise housed in a golden croissant.', price: '$12.00', badge: 'Hot Seller', img: menuAssets.bkm1_croissant },
      ]
    },
    {
      category: 'Desserts',
      items: [
        { id: 'bkd1', title: 'Triple Chocolate Brownie', desc: 'Fudgy center packed with dark chocolate chunks.', price: '$6.50', img: menuAssets.bkd1_brownie },
        { id: 'bkd2', title: 'Fruit Tartlet', desc: 'Creamy vanilla custard topped with fresh berries.', price: '$7.00', img: menuAssets.bkd2_tartlet }
      ]
    },
    {
      category: 'Beverages',
      items: [
        { id: 'bkv1', title: 'Matcha Latte', desc: 'Hot, frothy milk blended with stone-ground Japanese matcha.', price: '$5.50', img: menuAssets.bkv1_matcha },
      ]
    }
  ],
  'desserts & cakes': [
    {
      category: 'Starters',
      items: [
        { id: 'dcs1', title: 'Macaron Tasting Box', desc: 'A selection of 6 vibrant, delicate French macarons in assorted flavors.', price: '$18.00', badge: 'Best Seller', img: menuAssets.dcs1_macaron }
      ]
    },
    {
      category: 'Main Course',
      items: [
        { id: 'dcm1', title: 'Red Velvet Supreme Cake', desc: 'A towering slice of rich ruby cake slathered in premium cream cheese frosting.', price: '$11.00', badge: 'Signature', img: menuAssets.dcm1_red_velvet },
        { id: 'dcm2', title: 'Dark Cacao Lava Cake', desc: 'Decadent chocolate cake with a molten truffle core, served warm.', price: '$14.00', img: menuAssets.dcm2_lava_cake },
      ]
    },
    {
      category: 'Desserts',
      items: [
        { id: 'dcd1', title: 'Vanilla Bean Gelato', desc: 'Locally churned authentic Italian style gelato.', price: '$6.00', img: menuAssets.dcd1_gelato }
      ]
    },
    {
      category: 'Beverages',
      items: [
        { id: 'dcb1', title: 'Salted Caramel Frappe', desc: 'Ice-blended coffee beverage topped with whipped cream and caramel drizzle.', price: '$8.50', img: menuAssets.dcb1_frappe }
      ]
    }
  ],

  // Pizza
  'pizza': [
    {
      category: 'Starters',
      items: [
        { id: 'pz1', title: 'Garlic Butter Knots', desc: 'Twisted pizza dough baked to perfection, drenched in rich garlic butter and parmesan.', price: '$6.50', badge: 'Fan Favorite', img: menuAssets.pz1_garlic_knots },
        { id: 'pz2', title: 'Caprese Salad Bites', desc: 'Cherry tomatoes, fresh burrata, and basil leaves drizzled with balsamic reduction.', price: '$11.00', img: menuAssets.pz2_caprese }
      ]
    },
    {
      category: 'Main Course',
      items: [
        { id: 'pm1', title: 'Margherita Woodfire', desc: 'Crushed San Marzano tomatoes, fresh mozzarella, and basil on a blistered crust.', price: '$16.50', badge: 'Classic', img: menuAssets.pm1_margherita },
        { id: 'pm2', title: 'Spicy Pepperoni Honey', desc: 'Cupped pepperoni layered with mozzarella and drizzled with hot honey.', price: '$19.00', img: menuAssets.pm2_pepperoni },
      ]
    },
    {
      category: 'Desserts',
      items: [
        { id: 'pd1', title: 'Nutella Pizza Slice', desc: 'Warm dough folded with rich hazelnut spread and dusted with powdered sugar.', price: '$8.00', img: menuAssets.pd1_nutella_pizza }
      ]
    },
    {
      category: 'Beverages',
      items: [
        { id: 'pb1', title: 'Draft IPA', desc: 'Locally sourced crisp pale ale.', price: '$7.50', img: menuAssets.pb1_beer }
      ]
    }
  ],
  'italian pizza': 'pizza',

  // Sushi
  'japanese': [
    {
      category: 'Starters',
      items: [
        { id: 'jp1', title: 'Edamame Sea Salt', desc: 'Steamed young soybeans seasoned with flaky sea salt.', price: '$5.50', img: menuAssets.jp1_edamame },
        { id: 'jp2', title: 'Spicy Tuna Crispy Rice', desc: 'Pan-fried sushi rice topped with spicy tuna and jalapeño.', price: '$14.00', badge: 'Signature', img: menuAssets.jp2_spicy_tuna },
      ]
    },
    {
      category: 'Main Course',
      items: [
        { id: 'jm1', title: 'Dragon Roll', desc: 'Eel and cucumber topped with sliced avocado and sweet unagi sauce.', price: '$16.00', badge: 'Best Seller', img: menuAssets.jm1_dragon_roll },
        { id: 'jm2', title: 'Omakase Platter', desc: 'Chef’s selection of 12 premium sashimi and nigiri pieces.', price: '$45.00', img: menuAssets.jm2_omakase },
      ]
    },
    {
      category: 'Desserts',
      items: [
        { id: 'jd1', title: 'Mochi Ice Cream Trio', desc: 'Mango, Green Tea, and Strawberry encased in sweet rice dough.', price: '$8.50', img: menuAssets.jd1_mochi }
      ]
    },
    {
      category: 'Beverages',
      items: [
        { id: 'jb1', title: 'Premium Hot Sake', desc: 'Warm carafe of smooth, aromatic rice wine.', price: '$12.00', img: menuAssets.jb1_sake }
      ]
    }
  ],
  'japanese sushi': 'japanese',

  // Burgers
  'american burgers': [
    {
      category: 'Starters',
      items: [
        { id: 'as1', title: 'Loaded Truffle Fries', desc: 'Crispy potato fries tossed in truffle oil, parmesan, and parsley.', price: '$8.50', badge: 'Best Seller', img: menuAssets.as1_truffle_fries },
        { id: 'as2', title: 'Onion Ring Tower', desc: 'Thick-cut beer-battered onion rings served with spicy ranch.', price: '$10.00', img: menuAssets.as2_onion_rings },
      ]
    },
    {
      category: 'Main Course',
      items: [
        { id: 'am1', title: 'The Smash Double stack', desc: 'Two deeply seared beef patties with melty american cheese, pickles, and smash sauce.', price: '$15.00', badge: 'Iconic', img: menuAssets.am1_smash_burger },
        { id: 'am2', title: 'Crispy Chicken Sandwich', desc: 'Buttermilk fried chicken breast, spicy slaw, and honey mustard on a brioche bun.', price: '$14.00', img: menuAssets.am2_chicken_sandwich },
      ]
    },
    {
      category: 'Desserts',
      items: [
        { id: 'ad1', title: 'Oreo Milkshake', desc: 'Thick vanilla bean ice cream spun with crushed oreos and topped with whipped cream.', price: '$7.50', img: menuAssets.ad1_oreo_shake }
      ]
    },
    {
      category: 'Beverages',
      items: [
        { id: 'ab1', title: 'Craft Cola', desc: 'Ice-cold artisanal soda made with real cane sugar.', price: '$3.50', img: menuAssets.ab1_coca_cola }
      ]
    }
  ],
  'modern american': 'american burgers',
  'american bbq': 'american burgers',
  'bbq & grill': 'american burgers',
};

// Generic fallback menu for anything else
export const fallbackMenu = [
  {
    category: 'Starters',
    items: [
      { id: 'f1', title: 'Truffle Arancini', desc: 'Crispy risotto balls with black truffle and creamy mozzarella center.', price: '$14.50', badge: 'Best Seller', img: menuAssets.home_arancini },
      { id: 'f2', title: 'Honey Glazed Burrata', desc: 'Fresh burrata cheese with roasted peaches and wildflower honey.', price: '$18.00', img: menuAssets.home_burrata },
    ]
  },
  {
    category: 'Main Course',
    items: [
      { id: 'f3', title: 'Pan-Seared Salmon', desc: 'Atlantic salmon with lemon-butter caper sauce, served over garlic potatoes.', price: '$28.50', img: menuAssets.home_salmon },
      { id: 'f4', title: 'Wild Mushroom Risotto', desc: 'Slow-cooked Arborio rice with porcini mushrooms, parmesan, and herb oil.', price: '$22.00', img: menuAssets.home_risotto },
    ]
  },
  {
    category: 'Desserts',
    items: [
      { id: 'f5', title: 'Classic Tiramisu', desc: 'Espresso-soaked ladyfingers layered with sweet mascarpone cream.', price: '$12.00', img: menuAssets.home_tiramisu }
    ]
  },
  {
    category: 'Beverages',
    items: [
      { id: 'f6', title: 'Midnight Mojito', desc: 'Signature dark rum blended with fresh mint and crushed blackberries.', price: '$11.00', img: menuAssets.home_mojito }
    ]
  }
];

export const getMenuForCuisine = (cuisineName) => {
  if (!cuisineName) return fallbackMenu;
  const key = cuisineName.toLowerCase();
  const found = mockMenus[key];
  if (!found) return fallbackMenu;
  if (typeof found === 'string') return mockMenus[found] || fallbackMenu;
  return found;
};

export const getRestaurantMenu = (restaurantData) => {
  return {
    menu: getMenuForCuisine(restaurantData?.cuisine),
    heroBg: restaurantData?.img || menuAssets.rest_bistro,
    restaurantBanners: []
  };
};
