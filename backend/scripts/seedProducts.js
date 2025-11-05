import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env file');
  process.exit(1);
}

const products = [
  {
    name: 'Handwoven Silk Saree',
    description: 'Beautiful handwoven silk saree with intricate zari work. Perfect for special occasions.',
    price: 2500,
    originalPrice: 3000,
    category: 'textiles',
    images: ['/test.jpg'],
    sellerName: 'Sunita Devi',
    location: 'Varanasi, UP',
    inStock: true,
    stockQuantity: 10,
    rating: 4.9,
    reviewCount: 127,
    verified: true,
    fastDelivery: true
  },
  {
    name: 'Terracotta Pottery Set',
    description: 'Set of 6 traditional terracotta pots perfect for cooking and serving.',
    price: 800,
    originalPrice: 1000,
    category: 'handicrafts',
    images: ['/test.jpg'],
    sellerName: 'Kavita Joshi',
    location: 'Khurja, UP',
    inStock: true,
    stockQuantity: 15,
    rating: 4.8,
    reviewCount: 89,
    verified: true,
    fastDelivery: false
  },
  {
    name: 'Handmade Silver Jewelry',
    description: 'Elegant silver necklace and earring set with traditional Rajasthani designs.',
    price: 1800,
    originalPrice: 2200,
    category: 'jewelry',
    images: ['/test.jpg'],
    sellerName: 'Meera Patel',
    location: 'Jaipur, Rajasthan',
    inStock: true,
    stockQuantity: 8,
    rating: 4.9,
    reviewCount: 156,
    verified: true,
    fastDelivery: true
  },
  {
    name: 'Organic Turmeric Powder',
    description: 'Pure organic turmeric powder sourced directly from Kerala farms.',
    price: 350,
    originalPrice: 400,
    category: 'food',
    images: ['/test.jpg'],
    sellerName: 'Priya Sharma',
    location: 'Kerala',
    inStock: true,
    stockQuantity: 50,
    rating: 4.7,
    reviewCount: 203,
    verified: true,
    fastDelivery: true
  },
  {
    name: 'Handmade Soap Collection',
    description: 'Set of 5 natural handmade soaps with different fragrances and benefits.',
    price: 450,
    originalPrice: 600,
    category: 'beauty',
    images: ['/test.jpg'],
    sellerName: 'Anjali Singh',
    location: 'Goa',
    inStock: true,
    stockQuantity: 20,
    rating: 4.8,
    reviewCount: 94,
    verified: true,
    fastDelivery: false
  },
  {
    name: 'Bamboo Basket Set',
    description: 'Set of 3 eco-friendly bamboo baskets in different sizes.',
    price: 650,
    originalPrice: 800,
    category: 'handicrafts',
    images: ['/test.jpg'],
    sellerName: 'Ritu Verma',
    location: 'Assam',
    inStock: true,
    stockQuantity: 12,
    rating: 4.6,
    reviewCount: 67,
    verified: true,
    fastDelivery: false
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create a seller user
    let seller = await User.findOne({ email: 'seller@example.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Sample Seller',
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller',
        location: 'Mumbai, Maharashtra'
      });
      console.log('✅ Created seller user');
    }

    // Clear existing products (optional - remove if you want to keep existing)
    // await Product.deleteMany({});

    // Create products
    for (const productData of products) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ 
        name: productData.name,
        sellerName: productData.sellerName
      });

      if (!existingProduct) {
        const product = await Product.create({
          ...productData,
          seller: seller._id
        });
        console.log(`✅ Created product: ${product.name}`);
      } else {
        console.log(`⏭️  Product already exists: ${productData.name}`);
      }
    }

    console.log('\n✅ Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

