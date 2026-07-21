const fs = require('fs');
const path = require('path');

const iconMap = {
  AlertCircle: 'MdErrorOutline',
  AlertTriangle: 'MdWarningAmber',
  ArrowLeft: 'MdArrowBack',
  ArrowRight: 'MdArrowForward',
  ArrowUpDown: 'MdSwapVert',
  Bell: 'MdNotifications',
  Calendar: 'MdCalendarToday',
  CheckCheck: 'MdDoneAll',
  CheckCircle: 'MdCheckCircle',
  CheckCircle2: 'MdCheckCircleOutline',
  CheckIcon: 'MdCheck',
  ChevronDown: 'MdExpandMore',
  ChevronLeft: 'MdChevronLeft',
  ChevronRight: 'MdChevronRight',
  ChevronRightIcon: 'MdChevronRight',
  Clock: 'MdAccessTime',
  CreditCard: 'MdCreditCard',
  Database: 'MdStorage',
  Eye: 'MdVisibility',
  EyeOff: 'MdVisibilityOff',
  FileText: 'MdDescription',
  Grid3X3: 'MdGridView',
  Headphones: 'MdHeadset',
  Heart: 'MdFavoriteBorder',
  Home: 'MdHome',
  Info: 'MdInfoOutline',
  Loader2: 'MdLoop',
  LogOut: 'MdLogout',
  Mail: 'MdMailOutline',
  MapPin: 'MdLocationOn',
  Menu: 'MdMenu',
  MessageCircle: 'MdOutlineChat',
  MessageSquareQuote: 'MdFormatQuote',
  Minus: 'MdRemove',
  Package: 'MdInventory2',
  PanelLeft: 'MdViewSidebar',
  PanelLeftIcon: 'MdViewSidebar',
  Phone: 'MdPhone',
  Plus: 'MdAdd',
  RefreshCw: 'MdAutorenew',
  Search: 'MdSearch',
  Send: 'MdSend',
  Server: 'MdDns',
  Settings: 'MdSettings',
  Shield: 'MdSecurity',
  ShieldCheck: 'MdVerifiedUser',
  ShoppingBag: 'MdShoppingBag',
  ShoppingCart: 'MdShoppingCart',
  SlidersHorizontal: 'MdTune',
  Sparkles: 'MdAutoAwesome',
  Star: 'MdStar',
  Store: 'MdStore',
  Trash2: 'MdDeleteOutline',
  Truck: 'MdLocalShipping',
  User: 'MdPersonOutline',
  X: 'MdClose',
  XCircle: 'MdCancel',
  XIcon: 'MdClose',
  Zap: 'MdBolt',
  LayoutDashboard: 'MdDashboard',
  Layers: 'MdLayers',
  LayoutGrid: 'MdGridOn',
  LayoutList: 'MdFormatListBulleted',
  Edit2: 'MdEdit',
  GripVertical: 'MdDragIndicator',
  ToggleLeft: 'MdToggleOff',
  ToggleRight: 'MdToggleOn',
  ChevronUp: 'MdExpandLess',
  Image: 'MdImage',
  Check: 'MdCheck',
  FolderOpen: 'MdFolderOpen',
  Pencil: 'MdEdit',
  Save: 'MdSave',
  HelpCircle: 'MdHelpOutline',
  LayoutTemplate: 'MdViewQuilt',
  TrendingUp: 'MdTrendingUp',
  Share2: 'MdShare',
  KeyRound: 'MdVpnKey',
  Megaphone: 'MdCampaign',
  Upload: 'MdUpload',
  Globe: 'MdPublic',
  Palette: 'MdPalette',
  PackageX: 'MdRemoveShoppingCart'
};

const dirs = ['components', 'app'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];?/g;
  
  let modified = false;
  content = content.replace(importRegex, (match, imports) => {
    modified = true;
    const icons = imports.split(',').map(i => i.trim()).filter(Boolean);
    const newImports = icons.map(icon => {
      // Handle "import { Something as SomethingElse }" if it exists
      const parts = icon.split(/\s+as\s+/);
      const original = parts[0];
      const alias = parts[1] || original;
      
      const mapped = iconMap[original];
      if (!mapped) {
        console.warn(`WARNING: No mapping found for ${original} in ${filePath}`);
        return icon; // Fallback (will cause error if lucide-react is uninstalled)
      }
      return `${mapped} as ${alias}`;
    });
    
    return `import { ${newImports.join(', ')} } from 'react-icons/md';`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

dirs.forEach(walk);
console.log('Done!');
