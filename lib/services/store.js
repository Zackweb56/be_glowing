import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import Stock from '@/lib/models/Stock';
import StoreSettings from '@/lib/models/StoreSettings';
import Testimonial from '@/lib/models/Testimonial';
import FAQ from '@/lib/models/FAQ';

export async function getStoreCatalog() {
  await dbConnect();
  
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  const products = await Product.find({ status: 'active' }).sort({ sortOrder: 1 }).lean();
  
  const productIds = products.map(p => p._id);
  const stocks = await Stock.find({ product: { $in: productIds } }).lean();
  
  const stockMap = stocks.reduce((acc, stock) => {
    acc[stock.product.toString()] = { quantity: stock.quantity, alertThreshold: stock.alertThreshold };
    return acc;
  }, {});

  const populatedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString(),
    category: p.category ? p.category.toString() : null,
    stock: stockMap[p._id.toString()] || { quantity: 0, alertThreshold: 5 }
  }));

  const catalog = categories.map(c => ({
    ...c,
    _id: c._id.toString(),
    products: populatedProducts
      .filter(p => p.category === c._id.toString())
      .map(p => ({ ...p, categoryName: c.name }))
  }));

  return catalog;
}

export async function getStoreProductBySlug(slug) {
  await dbConnect();
  
  const product = await Product.findOne({ slug, status: 'active' }).populate('category').lean();
  if (!product) return null;
  
  const stock = await Stock.findOne({ product: product._id }).lean();
  
  return {
    ...product,
    _id: product._id.toString(),
    category: product.category ? { ...product.category, _id: product.category._id.toString() } : null,
    stock: stock ? { quantity: stock.quantity, alertThreshold: stock.alertThreshold } : { quantity: 0, alertThreshold: 5 }
  };
}

export async function getStoreSettings() {
  await dbConnect();
  const settings = await StoreSettings.findOne().lean();
  
  const defaults = {
    storeName: "Be Glowing",
    contactEmail: "contact@beglowing.com",
    contactPhone: "",
    address: "Morocco",
    currency: "MAD",
    whatsapp: "+212",
    shippingPolicy: "",
    privacyPolicy: "",
    returnPolicy: "",
    instagram: "",
    facebook: "",
    tiktok: ""
  };

  if (!settings) {
    return defaults;
  }

  // Map settings with default fallbacks
  return {
    ...defaults,
    ...settings,
    _id: settings._id ? settings._id.toString() : null,
  };
}

export async function getTestimonials() {
  await dbConnect();
  const docs = await Testimonial.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return docs.map(d => ({
    ...d,
    _id: d._id.toString(),
  }));
}

export async function getFAQs() {
  await dbConnect();
  const docs = await FAQ.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return docs.map(d => ({
    ...d,
    _id: d._id.toString(),
  }));
}
