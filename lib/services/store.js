import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import Stock from '@/lib/models/Stock';

export async function getStoreCatalog() {
  await dbConnect();
  
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  const products = await Product.find({ isActive: true, status: 'active' }).sort({ sortOrder: 1 }).lean();
  
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
    products: populatedProducts.filter(p => p.category === c._id.toString())
  }));

  return catalog;
}

export async function getStoreProductBySlug(slug) {
  await dbConnect();
  
  const product = await Product.findOne({ slug, isActive: true, status: 'active' }).populate('category').lean();
  if (!product) return null;
  
  const stock = await Stock.findOne({ product: product._id }).lean();
  
  return {
    ...product,
    _id: product._id.toString(),
    category: product.category ? { ...product.category, _id: product.category._id.toString() } : null,
    stock: stock ? { quantity: stock.quantity, alertThreshold: stock.alertThreshold } : { quantity: 0, alertThreshold: 5 }
  };
}
