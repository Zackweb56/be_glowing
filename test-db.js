import dbConnect from './lib/mongodb.js';
import Product from './lib/models/Product.js';

async function check() {
  await dbConnect();
  const products = await Product.find({});
  console.log('Total products:', products.length);
  console.log(products.map(p => ({ name: p.name, isActive: p.isActive, status: p.status })));
  process.exit(0);
}
check();
