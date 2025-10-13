// lib/mockdata.ts

export interface Product {
    id: number;
    image: string;
    name: string;
    price: number;
    description: string;
    keyFeatures: string[];
    estimatedDays: string;
    verifiedRatings: number;
    averageRating: number;
  }
  
  export interface Review {
    id: number;
    name: string;
    initials: string;
    rating: number;
    timeAgo: string;
    comment: string;
  }
  
  export interface RatingBreakdown {
    stars: number;
    count: number;
    percentage: number;
  }
  
  export const products: Product[] = [
    {
      id: 1,
      image: '/Rice.png',
      name: 'Jollof Rice with Chicken',
      price: 4500,
      description: 'Delight in the vibrant flavors of authentic Nigerian Jollof Rice, perfectly paired with succulent grilled chicken. This classic dish features aromatic rice cooked in a rich tomato-based sauce with a blend of traditional West African spices. The accompanying chicken is marinated and grilled to perfection, delivering tender, juicy meat with a smoky, flavorful finish.',
      keyFeatures: [
        'Authentic, rich, and smoky Nigerian Jollof rice',
        'Perfectly grilled chicken with traditional spices',
        'Serves 1-2 people',
        'Fresh ingredients daily'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 12,
      averageRating: 4.8
    },
    {
      id: 2,
      image: '/Rice.png',
      name: 'Fried Rice, Plantain & Chicken',
      price: 5600,
      description: 'Experience a delightful combination of savory fried rice loaded with fresh vegetables, sweet fried plantains, and crispy fried chicken. This complete meal brings together the perfect balance of flavors and textures that will satisfy your cravings.',
      keyFeatures: [
        'Vegetable-loaded fried rice',
        'Sweet caramelized fried plantains',
        'Crispy fried chicken',
        'Perfect portion for a hearty meal'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 18,
      averageRating: 4.6
    },
    {
      id: 3,
      image: '/Rice.png',
      name: 'Native Rice with Fish',
      price: 4200,
      description: 'Savor the authentic taste of Native Rice prepared with palm oil and traditional spices, served with fresh grilled fish. This traditional Nigerian delicacy offers a unique, earthy flavor profile that connects you to the roots of Nigerian cuisine.',
      keyFeatures: [
        'Traditional palm oil-based rice',
        'Fresh grilled fish',
        'Authentic Nigerian herbs and spices',
        'Rich, aromatic flavor'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 8,
      averageRating: 4.3
    },
    {
      id: 4,
      image: '/Rice.png',
      name: 'Coconut Rice & Beef',
      price: 5000,
      description: 'Indulge in the creamy, tropical flavors of Coconut Rice paired with tender, seasoned beef. The rice is cooked in coconut milk for a rich, smooth texture, while the beef is perfectly seasoned and cooked to perfection.',
      keyFeatures: [
        'Creamy coconut milk rice',
        'Tender seasoned beef',
        'Tropical flavor profile',
        'Perfectly balanced dish'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 15,
      averageRating: 4.7
    },
    {
      id: 5,
      image: '/Rice.png',
      name: 'White Rice & Stew with Turkey',
      price: 6000,
      description: 'Classic white rice served with rich, flavorful Nigerian stew and succulent turkey pieces. This timeless combination offers comfort and satisfaction in every bite, with the stew perfectly complementing the fluffy white rice.',
      keyFeatures: [
        'Fluffy white rice',
        'Rich Nigerian tomato stew',
        'Premium turkey pieces',
        'Generous portion size'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 20,
      averageRating: 4.9
    },
    {
      id: 6,
      image: '/Rice.png',
      name: 'Basmati Fried Rice Special',
      price: 6500,
      description: 'Premium Basmati rice stir-fried with an array of fresh vegetables, prawns, and chicken. This special edition offers a luxurious dining experience with aromatic long-grain rice and premium ingredients.',
      keyFeatures: [
        'Premium Basmati rice',
        'Mixed proteins (prawns & chicken)',
        'Fresh seasonal vegetables',
        'Restaurant-quality preparation'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 25,
      averageRating: 4.9
    },
    {
      id: 7,
      image: '/Rice.png',
      name: 'Ofada Rice & Ayamase Sauce',
      price: 5500,
      description: 'Authentic Ofada rice served with the legendary Ayamase (green pepper sauce). This traditional Yoruba delicacy features unpolished local rice with a unique aroma, paired with a spicy, flavorful green pepper sauce.',
      keyFeatures: [
        'Authentic unpolished Ofada rice',
        'Traditional Ayamase green pepper sauce',
        'Assorted meats',
        'True Nigerian heritage taste'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 14,
      averageRating: 4.5
    },
    {
      id: 8,
      image: '/Rice.png',
      name: 'Chicken Fried Rice Combo',
      price: 5800,
      description: 'A complete meal featuring expertly prepared fried rice with generous portions of chicken, mixed vegetables, and perfectly balanced seasonings. This combo is designed to satisfy your hunger and delight your taste buds.',
      keyFeatures: [
        'Generous chicken portions',
        'Mixed vegetables',
        'Perfectly seasoned rice',
        'Complete meal solution'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 22,
      averageRating: 4.7
    },
    {
      id: 9,
      image: '/Rice.png',
      name: 'Jollof Rice Party Pack',
      price: 7000,
      description: 'Our famous Jollof rice in a party-sized portion, perfect for sharing or meal prep. This generous pack ensures everyone gets to enjoy the authentic taste of Nigerian Jollof rice with all the traditional flavors you love.',
      keyFeatures: [
        'Party-sized portion (serves 3-4)',
        'Authentic Nigerian Jollof',
        'Perfect for gatherings',
        'Great value for money'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 30,
      averageRating: 4.8
    },
    {
      id: 10,
      image: '/Rice.png',
      name: 'Mixed Rice with Grilled Fish',
      price: 6200,
      description: 'A harmonious blend of Jollof and fried rice served with perfectly grilled fish. This unique combination offers the best of both worlds, allowing you to enjoy two favorite rice preparations in one meal.',
      keyFeatures: [
        'Half Jollof, half fried rice',
        'Fresh grilled fish',
        'Variety in one meal',
        'Perfectly balanced flavors'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 16,
      averageRating: 4.6
    },
    {
      id: 11,
      image: '/Rice.png',
      name: 'Vegetable Fried Rice',
      price: 4800,
      description: 'A colorful medley of fresh vegetables stir-fried with fluffy rice. This lighter option is packed with nutrients and flavor, perfect for those seeking a vegetarian meal without compromising on taste.',
      keyFeatures: [
        'Vegetarian-friendly',
        'Packed with fresh vegetables',
        'Light yet satisfying',
        'Healthy meal option'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 10,
      averageRating: 4.4
    },
    {
      id: 12,
      image: '/Rice.png',
      name: 'Shrimp Fried Rice Deluxe',
      price: 7500,
      description: 'Premium fried rice loaded with succulent shrimp, creating a luxurious seafood experience. This deluxe option features generous portions of fresh shrimp, mixed vegetables, and aromatic seasonings.',
      keyFeatures: [
        'Premium fresh shrimp',
        'Deluxe preparation',
        'Restaurant-quality taste',
        'Perfect for special occasions'
      ],
      estimatedDays: '2 - 3 days',
      verifiedRatings: 28,
      averageRating: 4.9
    }
  ];
  
  export const ratingBreakdown: RatingBreakdown[] = [
    { stars: 5, count: 8, percentage: 33.8 },
    { stars: 4, count: 20, percentage: 84.4 },
    { stars: 3, count: 56, percentage: 236.3 },
    { stars: 2, count: 17, percentage: 71.7 },
    { stars: 1, count: 3, percentage: 12.7 }
  ];
  
  export const customerReviews: Review[] = [
    {
      id: 1,
      name: 'Anita Raine',
      initials: 'AR',
      rating: 4.5,
      timeAgo: '31 mins ago',
      comment: 'I had a wonderful experience ordering from Cassie\'s Kitchen. The food was delicious and arrived hot. The Jollof rice had the perfect smoky flavor!'
    },
    {
      id: 2,
      name: 'Gracie James',
      initials: 'GJ',
      rating: 4.5,
      timeAgo: 'Aug 15',
      comment: 'This was truly a great experience. The portions were generous and the food quality exceeded my expectations. Will definitely order again!'
    },
    {
      id: 3,
      name: 'Stacie Flein Grace',
      initials: 'SG',
      rating: 3.5,
      timeAgo: 'Aug 18',
      comment: 'Good food overall, but delivery took a bit longer than expected. The taste made up for it though. The chicken was well seasoned.'
    },
    {
      id: 4,
      name: 'Johanna Layina Ohioana',
      initials: 'JO',
      rating: 4.5,
      timeAgo: 'Aug 15',
      comment: 'Amazing flavors! The rice was cooked perfectly and the proteins were fresh. Great value for money. Highly recommend!'
    }
  ];
  
  // Helper function to get a product by ID
  export const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };