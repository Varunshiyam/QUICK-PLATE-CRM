import burgerImg from '../assets/images/burger_item_1771950423045.png';
import bbqImg from '../assets/images/bbq_dish_1771950630791.png';
import medImg from '../assets/images/mediterranean_dish_1771950819956.png';
import bakeryImg from '../assets/images/bakery_dish_1771951017962.png';
import pizzaImg from '../assets/images/pizza_dish_1771951189743.png';

// Fallbacks for cuisines that didn't have generated images
import sushiImg from '../assets/images/sushi-platter.png';
const indianImg = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2571&auto=format&fit=crop';
const dessertImg = 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2574&auto=format&fit=crop';

// Common Unsplash links used for starters, drinks, and desserts
const drinksMap = {
  general: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop', // Mojito
  coffee: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2574&auto=format&fit=crop',
  soda: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2670&auto=format&fit=crop',
  tea: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=2670&auto=format&fit=crop'
};

const defaultDessert = 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=2574&auto=format&fit=crop';

export const getRestaurantMenu = (restaurant) => {
  const cuisine = restaurant.cuisine.toLowerCase();

  let heroBg = restaurant.img; // use the restaurant image as hero background
  let bannerOffer = restaurant.offer; 
  let starDish = '';

  let menu = [];

  if (cuisine.includes('burger') || cuisine.includes('modern american')) {
    starDish = burgerImg;
    menu = [
      {
        category: 'Starters',
        items: [{ id: 'b_s1', title: 'Crispy Onion Rings', desc: 'Golden beer-battered onion rings with spicy ranch.', price: '$6.50', img: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=2574&auto=format&fit=crop' }]
      },
      {
        category: 'Main Course',
        items: [{ id: 'b_m1', title: 'Artisan Smash Burger', desc: 'Double smash patty, melted cheese, secret sauce on toasted brioche.', price: '$14.00', badge: 'Signature', img: burgerImg }]
      },
      {
        category: 'Desserts',
        items: [{ id: 'b_d1', title: 'Vanilla Bean Shake', desc: 'Thick hand-spun milkshake topped with whipped cream.', price: '$5.50', img: defaultDessert }]
      },
      {
        category: 'Beverages',
        items: [{ id: 'b_b1', title: 'Craft Cola', desc: 'Refreshing fountain cola with real cane sugar.', price: '$3.00', img: drinksMap.soda }]
      }
    ];
  } else if (cuisine.includes('pizza') || cuisine.includes('italian')) {
    starDish = pizzaImg;
    menu = [
      {
        category: 'Starters',
        items: [{ id: 'p_s1', title: 'Garlic Knots', desc: 'Oven-baked knots tossed in garlic butter and parmesan.', price: '$5.00', img: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=2670&auto=format&fit=crop' }]
      },
      {
        category: 'Main Course',
        items: [{ id: 'p_m1', title: 'Rustic Woodfired Margherita', desc: 'Fresh basil, melted mozzarella, signature tomato sauce.', price: '$18.00', badge: 'Best Seller', img: pizzaImg }]
      },
      {
        category: 'Desserts',
        items: [{ id: 'p_d1', title: 'Classic Tiramisu', desc: 'Espresso-soaked ladyfingers layered with sweet mascarpone.', price: '$8.00', img: defaultDessert }]
      },
      {
        category: 'Beverages',
        items: [{ id: 'p_b1', title: 'Italian Sparkling Water', desc: 'Crisp and refreshing mineral water.', price: '$4.00', img: drinksMap.soda }]
      }
    ];
  } else if (cuisine.includes('sushi') || cuisine.includes('japanese')) {
    starDish = sushiImg;
    menu = [
      {
        category: 'Starters',
        items: [{ id: 's_s1', title: 'Edamame', desc: 'Steamed soybeans sprinkled with coarse sea salt.', price: '$4.50', img: 'https://images.unsplash.com/photo-1590054359853-df93fb3efb21?q=80&w=2574&auto=format&fit=crop' }]
      },
      {
        category: 'Main Course',
        items: [{ id: 's_m1', title: 'Premium Omakase Platter', desc: 'Chef’s selection of supreme nigiri and rolls.', price: '$35.00', badge: 'Chef\'s Choice', img: sushiImg }]
      },
      {
        category: 'Desserts',
        items: [{ id: 's_d1', title: 'Mochi Ice Cream', desc: 'Soft and chewy mochi filled with green tea ice cream.', price: '$6.00', img: defaultDessert }]
      },
      {
        category: 'Beverages',
        items: [{ id: 's_b1', title: 'Matcha Green Tea', desc: 'Traditional warm matcha imported from Kyoto.', price: '$3.50', img: drinksMap.tea }]
      }
    ];
  } else if (cuisine.includes('bbq') || cuisine.includes('grill')) {
    starDish = bbqImg;
    menu = [
      {
        category: 'Starters',
        items: [{ id: 'q_s1', title: 'Smoked Jalapeno Poppers', desc: 'Bacon-wrapped poppers stuffed with cream cheese.', price: '$8.00', img: 'https://images.unsplash.com/photo-1627308595229-7830f5c9c66e?q=80&w=2574&auto=format&fit=crop' }]
      },
      {
        category: 'Main Course',
        items: [{ id: 'q_m1', title: 'Smoked BBQ Pork Ribs', desc: 'Slow-smoked baby back ribs with a sticky glaze.', price: '$24.00', badge: 'Signature', img: bbqImg }]
      },
      {
        category: 'Desserts',
        items: [{ id: 'q_d1', title: 'Pecan Pie', desc: 'Warm slice of homemade southern pecan pie.', price: '$7.00', img: defaultDessert }]
      },
      {
        category: 'Beverages',
        items: [{ id: 'q_b1', title: 'Sweet Iced Tea', desc: 'Classic southern sweet tea brewed fresh daily.', price: '$3.00', img: drinksMap.tea }]
      }
    ];
  } else if (cuisine.includes('mediterranean')) {
    starDish = medImg;
    menu = [
      {
        category: 'Starters',
        items: [{ id: 'm_s1', title: 'Classic Hummus & Pita', desc: 'Creamy homemade hummus served with warm pita.', price: '$6.50', img: 'https://images.unsplash.com/photo-1585238341210-9430c6819eb7?q=80&w=2670&auto=format&fit=crop' }]
      },
      {
        category: 'Main Course',
        items: [{ id: 'm_m1', title: 'Fresh Grain Salad', desc: 'Quinoa, falafel, cherry tomatoes, and tahini dressing.', price: '$15.00', badge: 'Healthy', img: medImg }]
      },
      {
        category: 'Desserts',
        items: [{ id: 'm_d1', title: 'Baklava', desc: 'Layers of phyllo pastry filled with chopped nuts and honey.', price: '$5.50', img: defaultDessert }]
      },
      {
        category: 'Beverages',
        items: [{ id: 'm_b1', title: 'Mint Lemonade', desc: 'Refreshing crushed lemonade with fresh mint leaves.', price: '$4.50', img: drinksMap.general }]
      }
    ];
  } else if (cuisine.includes('bakery') || cuisine.includes('dessert')) {
    starDish = bakeryImg;
    menu = [
      {
        category: 'Starters',
        items: [{ id: 'bk_s1', title: 'Cheese Danish', desc: 'Flaky pastry filled with sweet cream cheese.', price: '$4.50', img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=2630&auto=format&fit=crop' }]
      },
      {
        category: 'Main Course',
        items: [{ id: 'bk_m1', title: 'Chocolate Croissant', desc: 'Buttery, flaky croissant loaded with rich dark chocolate.', price: '$5.50', badge: 'Fresh Baked', img: bakeryImg }]
      },
      {
        category: 'Desserts',
        items: [{ id: 'bk_d1', title: 'Macaron Box', desc: 'Assortment of 6 delicately flavored French macarons.', price: '$12.00', img: dessertImg }]
      },
      {
        category: 'Beverages',
        items: [{ id: 'bk_b1', title: 'Artisan Latte', desc: 'Smooth espresso cut with perfectly steamed milk.', price: '$4.50', img: drinksMap.coffee }]
      }
    ];
  } else if (cuisine.includes('indian')) {
    starDish = indianImg;
    menu = [
      {
        category: 'Starters',
        items: [{ id: 'i_s1', title: 'Vegetable Samosas', desc: 'Crispy pastry shells stuffed with spiced potatoes and peas.', price: '$5.00', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2671&auto=format&fit=crop' }]
      },
      {
        category: 'Main Course',
        items: [{ id: 'i_m1', title: 'Butter Chicken Masala', desc: 'Rich, creamy curry with tender chicken pieces, served with Naan.', price: '$16.50', badge: 'Spicy', img: indianImg }]
      },
      {
        category: 'Desserts',
        items: [{ id: 'i_d1', title: 'Gulab Jamun', desc: 'Sweet milk dumplings soaked in rose-cardamom syrup.', price: '$4.50', img: defaultDessert }]
      },
      {
        category: 'Beverages',
        items: [{ id: 'i_b1', title: 'Mango Lassi', desc: 'Creamy yogurt-based drink blended with ripe mangoes.', price: '$4.00', img: drinksMap.general }]
      }
    ];
  } else {
    // Default fallback
    menu = [
      {
        category: 'Starters',
        items: [{ id: 'df_s1', title: 'House Salad', desc: 'Fresh greens with a light vinaigrette.', price: '$7.00', img: medImg }]
      },
      {
        category: 'Main Course',
        items: [{ id: 'df_m1', title: 'Chef Special', desc: 'The signature main event crafted by our head chef.', price: '$22.00', badge: 'Popular', img: restaurant.img }]
      },
      {
        category: 'Desserts',
        items: [{ id: 'df_d1', title: 'Seasonal Tart', desc: 'Fresh fruit on a buttery short crust base.', price: '$8.50', img: dessertImg }]
      },
      {
        category: 'Beverages',
        items: [{ id: 'df_b1', title: 'Signature Cocktail', desc: 'A complex, refreshing blend of premium spirits.', price: '$11.00', img: drinksMap.general }]
      }
    ];
  }

  // Generate banners based on restaurant data
  const restaurantBanners = [
    {
      id: 1,
      supertitle: 'Exclusive Offer',
      title: bannerOffer || '10% OFF',
      subtitle: 'For a limited time',
      buttonText: 'Claim Now',
      theme: restaurant.offerColor || 'dark',
      img: starDish || restaurant.img
    }
  ];

  return { menu, heroBg, restaurantBanners };
};
