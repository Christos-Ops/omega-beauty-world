-- Omega Beauty World PostgreSQL schema
-- Step 1: foundational database structure for a real e-commerce app

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled'
);

CREATE TYPE product_category AS ENUM (
  'Skincare',
  'Makeup',
  'Fragrance',
  'Haircare'
);

CREATE TYPE product_badge AS ENUM (
  'Bestseller',
  'New',
  'Limited'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id VARCHAR(120) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(150) NOT NULL,
  category product_category NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0 CHECK (reviews >= 0),
  image_url TEXT NOT NULL,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  badge product_badge,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id VARCHAR(120) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, product_id)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping NUMERIC(10,2) NOT NULL CHECK (shipping >= 0),
  tax NUMERIC(10,2) NOT NULL CHECK (tax >= 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(120) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL,
  product_brand VARCHAR(150) NOT NULL,
  product_price NUMERIC(10,2) NOT NULL CHECK (product_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  zip VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_carts_updated_at
BEFORE UPDATE ON carts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Seed product catalog based on the current storefront product list.
INSERT INTO products (
  id,
  name,
  brand,
  category,
  price,
  rating,
  reviews,
  image_url,
  gallery,
  description,
  ingredients,
  badge
) VALUES
  (
    'lumiere-elixir',
    'Lumière Radiance Elixir',
    'Maison Aurelia',
    'Skincare',
    128.00,
    4.8,
    342,
    'https://images.pexels.com/photos/16233812/pexels-photo-16233812.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/16233812/pexels-photo-16233812.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/6800936/pexels-photo-6800936.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4857813/pexels-photo-4857813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'A potent serum infused with 24K gold peptides and botanical extracts that visibly brightens, firms, and restores your skin’s natural luminosity.',
    '24K Gold Peptides, Hyaluronic Acid, Vitamin C, Rosehip Oil, Niacinamide',
    'Bestseller'
  ),
  (
    'velvet-noir-lip',
    'Velvet Noir Lip Lacquer',
    'Chromatic Beauty',
    'Makeup',
    42.00,
    4.6,
    518,
    'https://images.pexels.com/photos/1213558/pexels-photo-1213558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/1213558/pexels-photo-1213558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/34321279/pexels-photo-34321279.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/7290092/pexels-photo-7290092.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'Ultra-matte, long-wearing lip lacquer with a plush velvet finish. Enriched with argan oil for comfortable, all-day wear without drying.',
    'Argan Oil, Vitamin E, Mica, Castor Seed Oil',
    'New'
  ),
  (
    'celeste-parfum',
    'Céleste Eau de Parfum',
    'Maison Aurelia',
    'Fragrance',
    165.00,
    4.9,
    276,
    'https://images.pexels.com/photos/264819/pexels-photo-264819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/264819/pexels-photo-264819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/15097440/pexels-photo-15097440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/965990/pexels-photo-965990.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'An intoxicating floral-amber composition with notes of jasmine sambac, warm amber, and golden vanilla. A signature scent that lingers beautifully.',
    'Jasmine Sambac, Amber, Vanilla, Bergamot, Sandalwood',
    'Bestseller'
  ),
  (
    'soie-creme',
    'Soie Silk Recovery Crème',
    'Botanica Lab',
    'Skincare',
    96.00,
    4.7,
    189,
    'https://images.pexels.com/photos/15930068/pexels-photo-15930068.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/15930068/pexels-photo-15930068.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/13095698/pexels-photo-13095698.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/6963132/pexels-photo-6963132.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'A rich overnight recovery cream with silk proteins and peptides that deeply nourishes, plumps, and restores skin barrier while you sleep.',
    'Silk Proteins, Peptides, Shea Butter, Ceramides, Squalane',
    NULL
  ),
  (
    'aurora-palette',
    'Aurora Luminous Eye Palette',
    'Chromatic Beauty',
    'Makeup',
    74.00,
    4.5,
    431,
    'https://images.pexels.com/photos/12955613/pexels-photo-12955613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/12955613/pexels-photo-12955613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/17156387/pexels-photo-17156387.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/7290627/pexels-photo-7290627.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'Twelve buttery-soft shades from champagne to deep plum. Highly pigmented, blendable formula for effortless day-to-night looks.',
    'Mica, Talc, Magnesium Stearate, Vitamin E',
    'Limited'
  ),
  (
    'nuit-noir-parfum',
    'Nuit Noir Eau de Parfum',
    'Atelier Noir',
    'Fragrance',
    198.00,
    4.9,
    154,
    'https://images.pexels.com/photos/21008941/pexels-photo-21008941.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/21008941/pexels-photo-21008941.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/7703038/pexels-photo-7703038.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/32817141/pexels-photo-32817141.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'A bold, mysterious fragrance with smoky oud, dark rose, and leather. For the one who commands the room without saying a word.',
    'Oud, Dark Rose, Leather, Patchouli, Tonka Bean',
    'New'
  ),
  (
    'mane-ritual-shampoo',
    'Mane Ritual Repair Shampoo',
    'Botanica Lab',
    'Haircare',
    38.00,
    4.4,
    298,
    'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/7440062/pexels-photo-7440062.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/7440053/pexels-photo-7440053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'Sulfate-free repair shampoo with keratin and argan oil that gently cleanses while rebuilding damaged, color-treated hair.',
    'Keratin, Argan Oil, Aloe Vera, Coconut Water, Biotin',
    NULL
  ),
  (
    'mane-ritual-conditioner',
    'Mane Ritual Silk Conditioner',
    'Botanica Lab',
    'Haircare',
    38.00,
    4.5,
    212,
    'https://images.pexels.com/photos/7440053/pexels-photo-7440053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/7440053/pexels-photo-7440053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/30696654/pexels-photo-30696654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'A weightless conditioner with silk amino acids that detangles, smooths frizz, and leaves hair mirror-shiny and touchably soft.',
    'Silk Amino Acids, Shea Butter, Green Tea Extract, Panthenol',
    NULL
  ),
  (
    'or-rose-toner',
    'Or Rose Petal Mist',
    'Maison Aurelia',
    'Skincare',
    54.00,
    4.6,
    167,
    'https://images.pexels.com/photos/4857813/pexels-photo-4857813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/4857813/pexels-photo-4857813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/6801176/pexels-photo-6801176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/7797102/pexels-photo-7797102.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'A refreshing facial mist with pure rose distillate and gold flecks that hydrates, balances, and gives skin an instant dewy glow.',
    'Rose Distillate, Glycerin, Gold Flecks, Aloe Vera',
    NULL
  ),
  (
    'chromatic-blush',
    'Chromatic Glow Blush Duo',
    'Chromatic Beauty',
    'Makeup',
    36.00,
    4.3,
    389,
    'https://images.pexels.com/photos/7290627/pexels-photo-7290627.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/7290627/pexels-photo-7290627.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/7670759/pexels-photo-7670759.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/7256152/pexels-photo-7256152.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'A duo of finely milled powder blushes in warm rose and soft peach. Buildable color for a natural, lit-from-within flush.',
    'Mica, Talc, Zinc Stearate, Vitamin E',
    NULL
  ),
  (
    'atelier-candle',
    'Atelier Amber Candle',
    'Atelier Noir',
    'Fragrance',
    48.00,
    4.7,
    121,
    'https://images.pexels.com/photos/33429143/pexels-photo-33429143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/33429143/pexels-photo-33429143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/33429141/pexels-photo-33429141.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/5128315/pexels-photo-5128315.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'A hand-poured soy candle with warm amber, sandalwood, and a whisper of vanilla. Burns for 50 hours of ambient luxury.',
    'Soy Wax, Amber, Sandalwood, Vanilla',
    'Limited'
  ),
  (
    'botanica-hair-oil',
    'Botanica Nourishing Hair Oil',
    'Botanica Lab',
    'Haircare',
    44.00,
    4.5,
    203,
    'https://images.pexels.com/photos/30696654/pexels-photo-30696654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    '["https://images.pexels.com/photos/30696654/pexels-photo-30696654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/8467957/pexels-photo-8467957.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/8467970/pexels-photo-8467970.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    'A lightweight, fast-absorbing oil blend with marula and camellia that tames frizz, adds shine, and protects against heat styling.',
    'Marula Oil, Camellia Oil, Jojoba, Vitamin E',
    NULL
  );
