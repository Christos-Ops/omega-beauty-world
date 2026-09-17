import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('omega_admin_session') === 'true';
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const stats = [
    { label: 'Orders', value: '184' },
    { label: 'Revenue', value: '$24.5K' },
    { label: 'Customers', value: '2,430' },
    { label: 'Low stock', value: '12' },
  ];

  const orders = [
    { id: '#1024', customer: 'Amara A.', total: '$142.00', status: 'Paid' },
    { id: '#1025', customer: 'Sarah K.', total: '$89.00', status: 'Packed' },
    { id: '#1026', customer: 'Mila O.', total: '$260.00', status: 'Shipped' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold-600">Control center</p>
          <h1 className="mt-2 font-serif text-4xl text-royal-900">Omega Beauty Admin</h1>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('omega_admin_session');
            navigate('/admin/login');
          }}
          className="rounded-full border border-royal-200 px-4 py-2 text-sm font-medium text-royal-700 hover:border-royal-300"
        >
          Log out
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-royal-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-royal-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-royal-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-royal-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-royal-900">Recent Orders</h2>
            <button className="text-sm font-medium text-gold-600">View all</button>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-2xl border border-royal-100 bg-royal-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-royal-900">{order.customer}</p>
                  <p className="text-sm text-royal-500">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-royal-900">{order.total}</p>
                  <p className="text-xs uppercase tracking-wide text-gold-600">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-royal-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-royal-900">Quick Actions</h2>
          <div className="mt-4 space-y-3">
            <button className="w-full rounded-xl bg-royal-900 px-4 py-3 text-left text-sm font-medium text-white">
              Add new product
            </button>
            <button className="w-full rounded-xl border border-royal-200 px-4 py-3 text-left text-sm font-medium text-royal-700">
              Manage inventory
            </button>
            <button className="w-full rounded-xl border border-royal-200 px-4 py-3 text-left text-sm font-medium text-royal-700">
              Review customer messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
