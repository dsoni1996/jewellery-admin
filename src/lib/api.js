const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function req(path, opts = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
    credentials: "include",
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export const api = {
  auth: {
    login:  (body) => req("/auth/login", { method: "POST", body }),
    me:     ()     => req("/auth/me"),
    logout: ()     => req("/auth/logout", { method: "POST" }),
  },
  products: {
    getAll:  (p = {}) => req(`/products?${new URLSearchParams(p)}`),
    getOne:  (slug)   => req(`/products/${slug}`),
    create:  (body)   => req("/products",     { method: "POST",   body }),
    update:  (id, b)  => req(`/products/${id}`, { method: "PUT",  body: b }),
    remove:  (id)     => req(`/products/${id}`, { method: "DELETE" }),
  },
  orders: {
    getAll:       (p = {}) => req(`/orders/admin/all?${new URLSearchParams(p)}`),
    getOne:       (num)    => req(`/orders/${num}`),
    updateStatus: (id, b)  => req(`/orders/admin/${id}/status`, { method: "PUT", body: b }),
  },
  users: {
    // using auth/me pattern — in real app add GET /api/users admin route
    getAll: (p = {}) => req(`/auth/admin/users?${new URLSearchParams(p)}`),
  },
  stats: {
    getSummary:    ()      => req("/admin/stats"),
    getMonthly:    ()      => req("/admin/stats/monthly"),
    getCategories: ()      => req("/admin/stats/categories"),
  },
  admin: {
    getUsers:       (p={}) => req(`/admin/users?${new URLSearchParams(p)}`),
    toggleUser:     (id)   => req(`/admin/users/${id}/status`, { method: "PATCH" }),
  },
};
