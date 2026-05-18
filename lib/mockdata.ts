// lib/mock-data/food-items.ts

export interface AddOnOption {
  id: number;
  uid: string;
  addOnGroupUid: string;
  name: string;
  price: number;
}

export interface AddOnGroup {
  id: number;
  uid: string;
  productUid: string;
  name: string;
  selection: "single" | "multiple";
  maxSelection: number;
  isRequired: boolean;
  addOnOptions: AddOnOption[];
}

export interface Portion {
  id: number;
  uid: string;
  productUid: string;
  name: string;
  price: number;
  startPrepTime: number;
  endPrepTime: number;
  servingType: string;
  servingPerServingType: number;
}

export interface BundleConfig {
  id: number;
  uid: string;
  productUid: string;
  name: string;
  price: number;
  category: string;
  maxCount: number;
}

export interface FoodItem {
  id: number;
  uid: string;
  storeId: string;
  name: string;
  description: string;
  product_images: string[];
  type: "Simple" | "Customizable" | "Bundle";
  status: "Available Today" | "Out of Stock" | "Seasonal";
  availability: "Breakfast" | "Lunch" | "Dinner" | "All Day" | "Custom";
  servingType: string[];
  category: string[];
  labels: string[];
  createdAt: string;
  updatedAt: string;
  addOnGroup: AddOnGroup[];
  portion: Portion[];
  bundleConfig: BundleConfig[];
}

export interface FoodApiResponse {
  status: string;
  message: string;
  data: FoodItem[];
}

export const mockFoodItems: FoodApiResponse = {
  status: "success",
  message: "OK",
  data: [
    // ─── Item 1: Jollof Rice (Customizable) ──────────────────────────────
    {
      id: 1,
      uid: "73fa62ee-068f-47d3-9da6-3719fa14187c",
      storeId: "b0a09b33-42cf-4946-9db6-d5721781744b",
      name: "Jollof Rice",
      description: "Classic Nigerian jollof rice cooked with tomatoes, peppers, and spices. Served with your choice of protein.",
      product_images: [
        "https://res.cloudinary.com/domlrkatw/image/upload/v1778470444/products/eo9jwcf4uac4nzzggexl.jpg"
      ],
      type: "Customizable",
      status: "Available Today",
      availability: "Lunch",
      servingType: ["plate"],
      category: ["Rice"],
      labels: ["Spicy", "Halal"],
      createdAt: "2026-05-11T03:34:04.819Z",
      updatedAt: "2026-05-11T03:34:04.819Z",
      addOnGroup: [
        {
          id: 1,
          uid: "cb8f3a55-e250-44a5-827a-a6bf447bdd53",
          productUid: "73fa62ee-068f-47d3-9da6-3719fa14187c",
          name: "Protein Choice",
          selection: "single",
          maxSelection: 1,
          isRequired: true,
          addOnOptions: [
            {
              id: 1,
              uid: "21a4788d-5d4f-4155-b5fa-9f4c1c71ed51",
              addOnGroupUid: "cb8f3a55-e250-44a5-827a-a6bf447bdd53",
              name: "Grilled Chicken",
              price: 1500,
            },
            {
              id: 2,
              uid: "cbbd98eb-45cd-4003-8427-405305a5aa5a",
              addOnGroupUid: "cb8f3a55-e250-44a5-827a-a6bf447bdd53",
              name: "Fried Fish",
              price: 1200,
            },
            {
              id: 3,
              uid: "872b3c8e-cf48-4a27-8f26-a8ddc3dda380",
              addOnGroupUid: "cb8f3a55-e250-44a5-827a-a6bf447bdd53",
              name: "Beef Steak",
              price: 1800,
            },
          ],
        },
      ],
      portion: [],
      bundleConfig: [],
    },

    // ─── Item 2: Fried Rice (Customizable) ──────────────────────────────
    {
      id: 2,
      uid: "fbd3e2d7-ea8b-4795-8a0c-9ad9427ed54a",
      storeId: "b0a09b33-42cf-4946-9db6-d5721781744b",
      name: "Fried Rice",
      description: "Flavorful fried rice with mixed vegetables and your choice of protein.",
      product_images: [
        "https://res.cloudinary.com/domlrkatw/image/upload/v1778490152/products/rbisiteo0syobmxwmni2.png"
      ],
      type: "Customizable",
      status: "Available Today",
      availability: "Lunch",
      servingType: ["plate"],
      category: ["Rice"],
      labels: ["Dairy-Free"],
      createdAt: "2026-05-11T09:02:33.289Z",
      updatedAt: "2026-05-11T09:02:33.289Z",
      addOnGroup: [
        {
          id: 2,
          uid: "5e51395c-4eac-4f73-a0bf-9e6b57b7ed48",
          productUid: "fbd3e2d7-ea8b-4795-8a0c-9ad9427ed54a",
          name: "Protein Choice",
          selection: "single",
          maxSelection: 1,
          isRequired: true,
          addOnOptions: [
            {
              id: 4,
              uid: "b398912d-1b75-4e14-810f-f15d8096bde3",
              addOnGroupUid: "5e51395c-4eac-4f73-a0bf-9e6b57b7ed48",
              name: "Grilled Chicken",
              price: 1500,
            },
            {
              id: 5,
              uid: "8a8a5f3a-b70a-44ef-85b8-cdebefc18e3e",
              addOnGroupUid: "5e51395c-4eac-4f73-a0bf-9e6b57b7ed48",
              name: "Fried Fish",
              price: 1200,
            },
            {
              id: 6,
              uid: "b3f062d3-9092-4373-846c-a171d1c47bcf",
              addOnGroupUid: "5e51395c-4eac-4f73-a0bf-9e6b57b7ed48",
              name: "Beef Steak",
              price: 1800,
            },
          ],
        },
      ],
      portion: [],
      bundleConfig: [],
    },

    // ─── Item 3: Coconut Rice (Customizable) ──────────────────────────────
    {
      id: 3,
      uid: "b68401e0-9ad6-4a32-bc43-14226ab15fec",
      storeId: "b0a09b33-42cf-4946-9db6-d5721781744b",
      name: "Coconut Rice",
      description: "Aromatic coconut rice cooked with fresh coconut milk and spices.",
      product_images: [
        "https://res.cloudinary.com/domlrkatw/image/upload/v1778491138/products/mtgscpm7z443svujv82e.png"
      ],
      type: "Customizable",
      status: "Available Today",
      availability: "Lunch",
      servingType: ["plate"],
      category: ["Rice"],
      labels: ["Vegetarian", "Gluten-Free"],
      createdAt: "2026-05-11T09:18:59.086Z",
      updatedAt: "2026-05-11T09:18:59.086Z",
      addOnGroup: [
        {
          id: 3,
          uid: "bf199fdc-b19b-4035-a588-ab955e411dc0",
          productUid: "b68401e0-9ad6-4a32-bc43-14226ab15fec",
          name: "Protein Choice",
          selection: "single",
          maxSelection: 1,
          isRequired: true,
          addOnOptions: [
            {
              id: 7,
              uid: "003fb765-8e22-4eec-bf70-9eb7928c41cb",
              addOnGroupUid: "bf199fdc-b19b-4035-a588-ab955e411dc0",
              name: "Grilled Chicken",
              price: 1500,
            },
            {
              id: 8,
              uid: "616dce69-3d71-4b1e-b1b5-cad99c05da14",
              addOnGroupUid: "bf199fdc-b19b-4035-a588-ab955e411dc0",
              name: "Fried Fish",
              price: 1200,
            },
            {
              id: 9,
              uid: "2dbe0725-fcf4-4b86-9355-1415203973d0",
              addOnGroupUid: "bf199fdc-b19b-4035-a588-ab955e411dc0",
              name: "Beef Steak",
              price: 1800,
            },
          ],
        },
      ],
      portion: [],
      bundleConfig: [],
    },

    // ─── Item 4: Ofada Rice (Customizable with Extra Images) ──────────────
    {
      id: 4,
      uid: "0a887806-c326-4a69-bb33-afa3c17cd230",
      storeId: "b0a09b33-42cf-4946-9db6-d5721781744b",
      name: "Ofada Rice",
      description: "Traditional ofada rice served with spicy ayamase sauce and assorted meats.",
      product_images: [
        "https://res.cloudinary.com/domlrkatw/image/upload/v1778491417/products/nrzl8ksv0go2wgsgkb3g.png",
        "https://res.cloudinary.com/domlrkatw/image/upload/v1778491417/products/jjfgwdv7zihpzmr88b43.png"
      ],
      type: "Customizable",
      status: "Available Today",
      availability: "Lunch",
      servingType: ["plate"],
      category: ["Rice"],
      labels: ["Spicy", "Contains Nuts"],
      createdAt: "2026-05-11T09:23:37.643Z",
      updatedAt: "2026-05-11T09:23:37.643Z",
      addOnGroup: [
        {
          id: 4,
          uid: "60281374-8dbe-45b9-9b81-08206f26b844",
          productUid: "0a887806-c326-4a69-bb33-afa3c17cd230",
          name: "Protein Choice",
          selection: "single",
          maxSelection: 1,
          isRequired: true,
          addOnOptions: [
            {
              id: 10,
              uid: "a9d01698-3a16-4095-aa63-267a7c93dd67",
              addOnGroupUid: "60281374-8dbe-45b9-9b81-08206f26b844",
              name: "Grilled Chicken",
              price: 1500,
            },
            {
              id: 11,
              uid: "800082fd-3798-4c67-a35f-f8dcd0cf8b32",
              addOnGroupUid: "60281374-8dbe-45b9-9b81-08206f26b844",
              name: "Fried Fish",
              price: 1200,
            },
            {
              id: 12,
              uid: "32cc235e-e381-495b-b042-fb9845c7f27f",
              addOnGroupUid: "60281374-8dbe-45b9-9b81-08206f26b844",
              name: "Beef Steak",
              price: 1800,
            },
          ],
        },
      ],
      portion: [],
      bundleConfig: [],
    },

    // ─── Item 5: White Rice & Stew (Customizable) ─────────────────────────
    {
      id: 5,
      uid: "038c23e6-f8c9-4aff-866e-daf9d3c60c03",
      storeId: "b0a09b33-42cf-4946-9db6-d5721781744b",
      name: "White Rice & Stew",
      description: "Plain white rice served with rich tomato stew and your choice of protein.",
      product_images: [
        "https://res.cloudinary.com/domlrkatw/image/upload/v1778491487/products/pcud4ovptnatiwiik6bo.jpg"
      ],
      type: "Customizable",
      status: "Available Today",
      availability: "Lunch",
      servingType: ["plate"],
      category: ["Rice"],
      labels: ["Halal"],
      createdAt: "2026-05-11T09:24:47.742Z",
      updatedAt: "2026-05-11T09:24:47.742Z",
      addOnGroup: [
        {
          id: 5,
          uid: "11c8df30-3cfb-424a-be68-a9f4939470f4",
          productUid: "038c23e6-f8c9-4aff-866e-daf9d3c60c03",
          name: "Protein Choice",
          selection: "single",
          maxSelection: 1,
          isRequired: true,
          addOnOptions: [
            {
              id: 13,
              uid: "bf77f0d7-1d93-41c1-a1b2-f87fd623dded",
              addOnGroupUid: "11c8df30-3cfb-424a-be68-a9f4939470f4",
              name: "Grilled Chicken",
              price: 1500,
            },
            {
              id: 14,
              uid: "671d42ab-7283-4cf2-a1f2-5f3b66eb40e8",
              addOnGroupUid: "11c8df30-3cfb-424a-be68-a9f4939470f4",
              name: "Fried Fish",
              price: 1200,
            },
            {
              id: 15,
              uid: "68515815-ef58-427e-a131-7ad431e543db",
              addOnGroupUid: "11c8df30-3cfb-424a-be68-a9f4939470f4",
              name: "Beef Steak",
              price: 1800,
            },
          ],
        },
      ],
      portion: [],
      bundleConfig: [],
    },

    // ─── Item 6: Rice & Beans (Customizable) ──────────────────────────────
    {
      id: 6,
      uid: "21d8fe08-b078-49c6-b352-c271b4af62c4",
      storeId: "b0a09b33-42cf-4946-9db6-d5721781744b",
      name: "Rice & Beans",
      description: "Classic combination of rice and beans, served with stew and protein.",
      product_images: [
        "https://res.cloudinary.com/domlrkatw/image/upload/v1778491641/products/b5ztlrzqlegptgwqlyex.jpg"
      ],
      type: "Customizable",
      status: "Available Today",
      availability: "Lunch",
      servingType: ["plate"],
      category: ["Rice"],
      labels: ["Vegetarian"],
      createdAt: "2026-05-11T09:27:21.759Z",
      updatedAt: "2026-05-11T09:27:21.759Z",
      addOnGroup: [
        {
          id: 6,
          uid: "0816c63a-f276-48d7-9bfc-aa7b7a614c8c",
          productUid: "21d8fe08-b078-49c6-b352-c271b4af62c4",
          name: "Protein Choice",
          selection: "single",
          maxSelection: 1,
          isRequired: true,
          addOnOptions: [
            {
              id: 16,
              uid: "14ca0e46-15bf-42e4-8be2-1d88b01910b8",
              addOnGroupUid: "0816c63a-f276-48d7-9bfc-aa7b7a614c8c",
              name: "Grilled Chicken",
              price: 1500,
            },
            {
              id: 17,
              uid: "ecf55bbd-1b0f-4d1b-b677-63a22f57af05",
              addOnGroupUid: "0816c63a-f276-48d7-9bfc-aa7b7a614c8c",
              name: "Fried Fish",
              price: 1200,
            },
            {
              id: 18,
              uid: "b41910aa-a0ae-4297-a010-da9d91123d6e",
              addOnGroupUid: "0816c63a-f276-48d7-9bfc-aa7b7a614c8c",
              name: "Beef Steak",
              price: 1800,
            },
          ],
        },
      ],
      portion: [],
      bundleConfig: [],
    },

    // ─── Item 7: Jollof Rice - Simple (with Portions) ────────────────────
    {
      id: 7,
      uid: "984075a6-9e29-4be5-9e96-a7b01db8b912",
      storeId: "b0a09b33-42cf-4946-9db6-d5721781744b",
      name: "Jollof Rice (Simple)",
      description: "Our signature jollof rice - simple, classic, and delicious. No customization needed.",
      product_images: [
        "https://res.cloudinary.com/domlrkatw/image/upload/v1778494803/products/nim2hyeupyckt1stggit.png"
      ],
      type: "Simple",
      status: "Available Today",
      availability: "Lunch",
      servingType: ["plate"],
      category: ["Rice"],
      labels: ["Spicy", "Halal"],
      createdAt: "2026-05-11T10:20:04.028Z",
      updatedAt: "2026-05-11T10:20:04.028Z",
      addOnGroup: [],
      portion: [
        {
          id: 1,
          uid: "726acb60-8560-4499-95ad-ff5098b7ba5d",
          productUid: "984075a6-9e29-4be5-9e96-a7b01db8b912",
          name: "Small Portion",
          price: 2500,
          startPrepTime: 10,
          endPrepTime: 15,
          servingType: "Plate",
          servingPerServingType: 1,
        },
        {
          id: 2,
          uid: "726acb60-8560-4499-95ad-ff5098b7ba5e",
          productUid: "984075a6-9e29-4be5-9e96-a7b01db8b912",
          name: "Medium Portion",
          price: 3500,
          startPrepTime: 10,
          endPrepTime: 20,
          servingType: "Plate",
          servingPerServingType: 1,
        },
        {
          id: 3,
          uid: "726acb60-8560-4499-95ad-ff5098b7ba5f",
          productUid: "984075a6-9e29-4be5-9e96-a7b01db8b912",
          name: "Large Portion",
          price: 4500,
          startPrepTime: 15,
          endPrepTime: 25,
          servingType: "Plate",
          servingPerServingType: 1,
        },
      ],
      bundleConfig: [],
    },

    // ─── Item 8: Chicken Kebab (Simple with Portions) ────────────────────
    {
      id: 12,
      uid: "f9e26f70-e01b-438d-9709-01cb22932e54",
      storeId: "b0a09b33-42cf-4946-9db6-d5721781744b",
      name: "Chicken Kebab",
      description: "Succulent grilled chicken kebabs marinated in special herbs and spices. Served with veggies.",
      product_images: [
        "https://swiftree-foodvendorpull.b-cdn.net/A0Q61CAyXcRl.jpg"
      ],
      type: "Simple",
      status: "Available Today",
      availability: "All Day",
      servingType: ["plate"],
      category: ["Desserts"],
      labels: ["Spicy", "Halal", "Gluten-Free"],
      createdAt: "2026-05-14T17:41:27.152Z",
      updatedAt: "2026-05-14T17:41:27.152Z",
      addOnGroup: [],
      portion: [
        {
          id: 5,
          uid: "b914456f-210a-4e2c-92ea-db156b801049",
          productUid: "f9e26f70-e01b-438d-9709-01cb22932e54",
          name: "Regular (2 sticks)",
          price: 1200,
          startPrepTime: 10,
          endPrepTime: 20,
          servingType: "plate",
          servingPerServingType: 1,
        },
        {
          id: 6,
          uid: "b914456f-210a-4e2c-92ea-db156b801050",
          productUid: "f9e26f70-e01b-438d-9709-01cb22932e54",
          name: "Large (4 sticks)",
          price: 2000,
          startPrepTime: 15,
          endPrepTime: 30,
          servingType: "plate",
          servingPerServingType: 1,
        },
        {
          id: 7,
          uid: "b914456f-210a-4e2c-92ea-db156b801051",
          productUid: "f9e26f70-e01b-438d-9709-01cb22932e54",
          name: "Family Pack (8 sticks)",
          price: 3500,
          startPrepTime: 20,
          endPrepTime: 45,
          servingType: "plate",
          servingPerServingType: 3,
        },
      ],
      bundleConfig: [],
    },
  ],
};

// ─── Helper to get food items by type ────────────────────────────────────
export const getFoodItemsByType = (type: FoodItem["type"]) =>
  mockFoodItems.data.filter((item) => item.type === type);

// ─── Helper to get food items by category ─────────────────────────────────
export const getFoodItemsByCategory = (category: string) =>
  mockFoodItems.data.filter((item) => item.category.includes(category));

// ─── Helper to get available items only ───────────────────────────────────
export const getAvailableFoodItems = () =>
  mockFoodItems.data.filter((item) => item.status === "Available Today");

// ─── Helper to get food item by UID ──────────────────────────────────────
export const getFoodItemByUid = (uid: string) =>
  mockFoodItems.data.find((item) => item.uid === uid);
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