import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const empty: FormData = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  zip: '',
  country: '',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [placed, setPlaced] = useState(false);

  const shipping = subtotal > 75 ? 0 : 8;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const update = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.zip.trim()) e.zip = 'Required';
    if (!form.country.trim()) e.country = 'Required';
    if (!form.cardName.trim()) e.cardName = 'Required';
    if (form.cardNumber.replace(/\s/g, '').length < 15) e.cardNumber = 'Enter a valid card number';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = 'MM/YY';
    if (form.cvc.length < 3) e.cvc = '3 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="animate-scale-in">
          <CheckCircle className="mx-auto h-20 w-20 text-gold-400" strokeWidth={1} />
          <h1 className="mt-6 font-serif text-4xl font-semibold text-royal-900">
            Order Confirmed!
          </h1>
          <p className="mt-4 text-lg text-royal-500">
            Thank you for your purchase. A confirmation email has been sent to{' '}
            <span className="font-medium text-royal-700">{form.email}</span>.
          </p>
          <div className="mt-8 rounded-2xl border border-royal-100 bg-white p-6 text-left">
            <p className="text-sm text-royal-400">Order Number</p>
            <p className="font-serif text-2xl font-semibold text-royal-900">
              #OBW-{Math.floor(Math.random() * 900000 + 100000)}
            </p>
          </div>
          <Link to="/catalog" className="btn-gold mt-8">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-serif text-3xl text-royal-900">Your cart is empty</h1>
        <p className="mt-2 text-royal-500">Add items before checking out.</p>
        <Link to="/catalog" className="btn-gold mt-6">
          Browse Products
        </Link>
      </div>
    );
  }

  const inputClass = (field: keyof FormData) =>
    `input-field ${errors[field] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' : ''}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="eyebrow">Almost There</p>
      <h1 className="section-title mt-2">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* Form fields */}
        <div className="space-y-8 lg:col-span-2">
          {/* Contact */}
          <section className="rounded-2xl border border-royal-100 bg-white p-6">
            <h2 className="font-serif text-xl font-semibold text-royal-900">Contact</h2>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-royal-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
                className={inputClass('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-royal-100 bg-white p-6">
            <h2 className="font-serif text-xl font-semibold text-royal-900">Shipping Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-royal-700">First Name</label>
                <input
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  className={inputClass('firstName')}
                />
                {errors.firstName && <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-royal-700">Last Name</label>
                <input
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  className={inputClass('lastName')}
                />
                {errors.lastName && <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-royal-700">Street Address</label>
                <input
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  className={inputClass('address')}
                />
                {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-royal-700">City</label>
                <input
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className={inputClass('city')}
                />
                {errors.city && <p className="mt-1 text-xs text-rose-500">{errors.city}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-royal-700">ZIP / Postal</label>
                <input
                  value={form.zip}
                  onChange={(e) => update('zip', e.target.value)}
                  className={inputClass('zip')}
                />
                {errors.zip && <p className="mt-1 text-xs text-rose-500">{errors.zip}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-royal-700">Country</label>
                <input
                  value={form.country}
                  onChange={(e) => update('country', e.target.value)}
                  placeholder="United States"
                  className={inputClass('country')}
                />
                {errors.country && <p className="mt-1 text-xs text-rose-500">{errors.country}</p>}
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-royal-100 bg-white p-6">
            <h2 className="font-serif text-xl font-semibold text-royal-900">Payment</h2>
            <p className="mt-1 text-xs text-royal-400">
              This is a demo — no real payment will be processed.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-royal-700">Name on Card</label>
                <input
                  value={form.cardName}
                  onChange={(e) => update('cardName', e.target.value)}
                  className={inputClass('cardName')}
                />
                {errors.cardName && <p className="mt-1 text-xs text-rose-500">{errors.cardName}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-royal-700">Card Number</label>
                <input
                  value={form.cardNumber}
                  onChange={(e) => update('cardNumber', e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className={inputClass('cardNumber')}
                />
                {errors.cardNumber && <p className="mt-1 text-xs text-rose-500">{errors.cardNumber}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-royal-700">Expiry</label>
                <input
                  value={form.expiry}
                  onChange={(e) => update('expiry', e.target.value)}
                  placeholder="MM/YY"
                  className={inputClass('expiry')}
                />
                {errors.expiry && <p className="mt-1 text-xs text-rose-500">{errors.expiry}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-royal-700">CVC</label>
                <input
                  value={form.cvc}
                  onChange={(e) => update('cvc', e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  className={inputClass('cvc')}
                />
                {errors.cvc && <p className="mt-1 text-xs text-rose-500">{errors.cvc}</p>}
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-royal-100 bg-white p-6">
            <h2 className="font-serif text-xl font-semibold text-royal-900">Your Order</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-royal-900">{item.product.name}</p>
                    <p className="text-xs text-royal-400">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-royal-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-royal-100 pt-4 text-sm">
              <div className="flex justify-between text-royal-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-royal-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-royal-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-royal-100 pt-2">
                <span className="font-serif text-lg font-semibold text-royal-900">Total</span>
                <span className="font-serif text-lg font-semibold text-royal-900">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-gold mt-6 w-full">
              Place Order <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
