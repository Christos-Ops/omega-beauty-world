import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Gift, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function Home() {
  const bestsellers = products.filter((p) => p.badge === 'Bestseller').slice(0, 4);
  const newArrivals = products.filter((p) => p.badge === 'New').concat(products.slice(0, 2)).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(212,168,47,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(212,168,47,0.15) 0%, transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold-400">Luxury Beauty, Curated</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-royal-50 md:text-6xl">
              Where Radiance <br /> Meets <span className="text-gold-400">Elegance</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-royal-200">
              Discover a world of premium skincare, makeup, and fragrance — hand-picked from
              the most coveted ateliers. Beauty, elevated.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/catalog" className="btn-gold">
                Shop the Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/catalog?category=Fragrance"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/40 px-7 py-3 text-sm font-medium uppercase tracking-wider text-gold-300 transition-all hover:bg-gold-400/10"
              >
                Explore Fragrances
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-royal-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-3">
          {[
            { icon: Truck, title: 'Free Shipping', text: 'On all orders over $75' },
            { icon: ShieldCheck, title: 'Authentic Guarantee', text: '100% genuine products' },
            { icon: Gift, title: 'Luxury Samples', text: 'With every purchase' },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-royal-50">
                <f.icon className="h-6 w-6 text-gold-500" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-royal-900">{f.title}</h3>
                <p className="text-sm text-royal-500">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Most Loved</p>
            <h2 className="section-title mt-2">Bestsellers</h2>
          </div>
          <Link
            to="/catalog"
            className="hidden items-center gap-1 text-sm font-medium text-royal-700 hover:text-gold-600 sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Category showcase */}
      <section className="bg-royal-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <p className="eyebrow text-gold-400">Shop by Category</p>
            <h2 className="section-title mt-2 text-royal-50">Explore the Edit</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Skincare', img: 'https://images.pexels.com/photos/6963132/pexels-photo-6963132.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
              { name: 'Makeup', img: 'https://images.pexels.com/photos/12955613/pexels-photo-12955613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
              { name: 'Fragrance', img: 'https://images.pexels.com/photos/264819/pexels-photo-264819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
              { name: 'Haircare', img: 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/catalog?category=${cat.name}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-950/90 via-royal-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-serif text-2xl font-semibold text-royal-50">{cat.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gold-300 opacity-0 transition-opacity group-hover:opacity-100">
                    Shop now <ArrowRight className="h-4 w-4" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Just Dropped</p>
            <h2 className="section-title mt-2">New Arrivals</h2>
          </div>
          <Link
            to="/catalog"
            className="hidden items-center gap-1 text-sm font-medium text-royal-700 hover:text-gold-600 sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal-900 to-royal-950 px-8 py-14 text-center md:px-16">
          <Sparkles className="mx-auto h-10 w-10 text-gold-400" strokeWidth={1.5} />
          <h2 className="mt-4 font-serif text-3xl font-semibold text-royal-50 md:text-4xl">
            Join the Beauty Circle
          </h2>
          <p className="mx-auto mt-3 max-w-md text-royal-200">
            Subscribe for early access to new launches, exclusive offers, and beauty tips
            from our experts.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-royal-700 bg-royal-800 px-5 py-3 text-royal-50 placeholder-royal-400 focus:border-gold-400 focus:outline-none"
            />
            <button type="submit" className="btn-gold">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
