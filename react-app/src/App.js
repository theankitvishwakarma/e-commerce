import React, { useEffect, useState } from "react";

const initialProducts = [
  { id: 1, name: "Wireless Headphones", price: 99.99, category: "electronics", image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSg7-sA3gh9AlcSzhjHjO0X8S_OLIUqH3D7DdZeOjXLFNg2oq0_WhKAv1BCPcakFcJFp_jMHYmjeEDT8ffv-53X9qeP3gD0pVforL8zGL80W2DLxOfpGxCX" },
  { id: 2, name: "Smart Watch", price: 199.99, category: "electronics", image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSg7-sA3gh9AlcSzhjHjO0X8S_OLIUqH3D7DdZeOjXLFNg2oq0_WhKAv1BCPcakFcJFp_jMHYmjeEDT8ffv-53X9qeP3gD0pVforL8zGL80W2DLxOfpGxCX" },
  { id: 3, name: "Cotton T-Shirt", price: 24.99, category: "clothing", image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQJyfaMdk-cRw4sSs_NYZb110s3Yq5vnnMXVQtWpynoQASVErNwjwumnTAgPTr-KXkX1BUCjGw2PF8U0mOkStBn9nTtxycEhslKewzRwAR0z_s7iAxIsdme" },
  { id: 4, name: "Jeans", price: 59.99, category: "clothing", image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQn4ASTDd_6Mmdc8wW4ACgfUgFd4x7-01LoG6pXn0wLDmMCXl7rcU-4w7NCD3-3vX1-K98BiwlmNLck8ZRs0456Q_KiIxwcjFCChqt-kULQ" },
  { id: 5, name: "Programming Book", price: 39.99, category: "books", image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTV759zT0QQE5HmOjh4n5OFSR2J9UBmRl0yQmyGMkGJ5Dydo-3XM72P6oE94bdEGObMhLFncOFKcn2Ai2fpefjwJu77CBQ5acs5-1GbgqEHwdIsqWKGD_veEg" },
  { id: 6, name: "Coffee Maker", price: 79.99, category: "home", image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRpW6XULL4Ltbv0SeF2V4TvUrjb8IfZu2jGU3R3spwj_kFAb7UjJXesL_geqLqwZGz08g21JVQOJak_7SogtsfF995eQYaXedGx6OumGq4X0BFu-L4GNMmV" },
  { id: 7, name: "Bluetooth Speaker", price: 49.99, category: "electronics", image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSKmzzh737mTPdFGTWZAqp2CQTl6mzb4XIJ3XD-Pq-Ssbdsu8ULdY1r6I9bUhvW4-nqP_TjFdh8YauviTl98fbq2EExUdmHtvfb_Rw69y2sh0Zj6pTMgtY_K2dq" },
  { id: 8, name: "Desk Lamp", price: 29.99, category: "home", image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT4saMXxuwWm59UyOFG0u_cOtsnSFFptKkHk2AKiN9yqBS5IK6fhipUFKfGM5oipjtWyCTPCYEwR1m01PvUb-NCIeTWMA4EV4SZmZgv6ScztlSHqPwQITzfPg" }
];

export default function App() {
  const [section, setSection] = useState("products");
  const [products] = useState(initialProducts);
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || {});
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")));
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) localStorage.setItem("currentUser", JSON.stringify(currentUser));
    else localStorage.removeItem("currentUser");
  }, [currentUser]);

  // ---------------- AUTH WITH BACKEND ----------------
  async function registerUser(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        setSignupForm({ name: "", email: "", password: "" });
        setSection("login");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Server error");
    }
  }

  async function loginUser(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setLoginForm({ email: "", password: "" });
        alert("Login successful!");
        setSection("products");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Server error");
    }
  }

  function logout() {
    setCurrentUser(null);
    setSection("products");
  }

  // ---------------- CART HELPERS ----------------
  function filteredProducts() {
    let filtered = products.filter(
      (p) =>
        (category === "" || p.category === category) &&
        p.price <= maxPrice &&
        (p.name.toLowerCase().includes(searchText.toLowerCase()) ||
          p.category.toLowerCase().includes(searchText.toLowerCase()))
    );
    if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }

  function addToCart(productId) {
    setCart((prev) => {
      const copy = { ...prev };
      const product = products.find((p) => p.id === productId);
      if (copy[productId]) copy[productId].quantity += 1;
      else copy[productId] = { product, quantity: 1 };
      alert(`${product.name} added to cart!`);
      return copy;
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const copy = { ...prev };
      if (copy[productId]) copy[productId].quantity = newQuantity;
      return copy;
    });
  }

  // ---------------- TOTALS ----------------
  const subtotal = Object.values(cart).reduce((s, item) => s + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax + (subtotal > 0 ? 10 : 0);

  // ---------------- UI ----------------
  return (
    <div>
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo"><i className="fas fa-shopping-bag" />E commerce</div>
            <nav>
              <ul>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); setSection("products");}}>Products</a></li>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); setSection("cart");}}>Cart</a></li>
              </ul>
            </nav>
            <div className="auth-buttons" style={{display: currentUser ? "none" : "flex"}}>
              <button className="btn btn-outline" onClick={()=>setSection("login")}>Login</button>
              <button className="btn btn-primary" onClick={()=>setSection("signup")}>Sign Up</button>
            </div>
            <div id="userInfo" style={{display: currentUser ? "block" : "none"}}>
              <span id="username" style={{marginRight:15}}>{currentUser ? currentUser.name : ""}</span>
              <button className="btn btn-outline" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* LOGIN */}
        {section === "login" && (
          <section id="login" className="page-section active-section">
            <div className="auth-container">
              <h2>Login to Your Account</h2>
              <form onSubmit={loginUser}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" required value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" required value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})}/>
                </div>
                <button type="submit" className="btn btn-block">Login</button>
              </form>
              <div className="form-footer">Don't have an account? <a href="#" onClick={(e)=>{e.preventDefault(); setSection("signup");}}>Sign Up</a></div>
            </div>
          </section>
        )}

        {/* SIGNUP */}
        {section === "signup" && (
          <section id="signup" className="page-section active-section">
            <div className="auth-container">
              <h2>Create New Account</h2>
              <form onSubmit={registerUser}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-control" required value={signupForm.name} onChange={e=>setSignupForm({...signupForm,name:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" required value={signupForm.email} onChange={e=>setSignupForm({...signupForm,email:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" required value={signupForm.password} onChange={e=>setSignupForm({...signupForm,password:e.target.value})}/>
                </div>
                <button type="submit" className="btn btn-block">Sign Up</button>
              </form>
              <div className="form-footer">Already have an account? <a href="#" onClick={(e)=>{e.preventDefault(); setSection("login");}}>Login</a></div>
            </div>
          </section>
        )}

        {/* PRODUCTS */}
        {section === "products" && (
          <section id="products" className="page-section active-section">
            <h2>Our Products</h2>
            <div className="filters">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Category</label>
                  <select className="form-control" value={category} onChange={e=>setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home & Kitchen</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Max Price</label>
                  <input type="range" className="form-control" min="0" max="1000" step="50" value={maxPrice} onChange={e=>setMaxPrice(parseInt(e.target.value))}/>
                  <span id="priceValue">${maxPrice}</span>
                </div>
              </div>
              <div className="filter-row">
                <div className="filter-group">
                  <label>Search</label>
                  <input type="text" className="form-control" placeholder="Search products..." value={searchText} onChange={e=>setSearchText(e.target.value)}/>
                </div>
                <div className="filter-group">
                  <label>Sort By</label>
                  <select className="form-control" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="products-grid" id="productsGrid">
              {filteredProducts().map(product => (
                <div className="product-card" key={product.id}>
                  <div className="product-image"><img src={product.image} alt={product.name}/></div>
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-category">{product.category}</div>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <div className="product-actions">
                      <button className="btn btn-primary" onClick={()=>addToCart(product.id)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CART */}
        {section === "cart" && (
          <section id="cart" className="page-section active-section">
            <h2>Your Shopping Cart</h2>
            <div className="cart-container">
              <div className="cart-items" id="cartItems">
                {Object.values(cart).length === 0 ? (
                  <div className="empty-cart-message" style={{textAlign:"center", padding:40}}>
                    <i className="fas fa-shopping-cart" style={{fontSize:60, color:"#ccc", marginBottom:15}}></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to your cart to see them here</p>
                    <button className="btn btn-primary" style={{marginTop:15}} onClick={()=>setSection("products")}>Continue Shopping</button>
                  </div>
                ) : (
                  Object.values(cart).map(item => (
                    <div className="cart-item" key={item.product.id}>
                      <div className="cart-item-image"><img src={item.product.image} alt={item.product.name}/></div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">{item.product.name}</h3>
                        <div className="cart-item-price">${item.product.price.toFixed(2)}</div>
                        <div className="cart-item-actions">
                          <div className="quantity-control">
                            <button className="quantity-btn" onClick={()=>updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                            <input type="text" className="quantity-input" value={item.quantity} readOnly/>
                            <button className="quantity-btn" onClick={()=>updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                          </div>
                          <button className="remove-btn" onClick={()=>removeFromCart(item.product.id)}><i className="fas fa-trash"></i> Remove</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="cart-summary">
                <h3 className="summary-title">Order Summary</h3>
                <div className="summary-item"><span>Subtotal</span><span id="subtotal">${subtotal.toFixed(2)}</span></div>
                <div className="summary-item"><span>Shipping</span><span>$10.00</span></div>
                <div className="summary-item"><span>Tax</span><span id="tax">${tax.toFixed(2)}</span></div>
                <div className="summary-total"><span>Total</span><span id="total">${total.toFixed(2)}</span></div>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </div>
          </section>
        )}
      </div>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>E commerce</h3>
              <p>Your one-stop shop for all your needs. Quality products at affordable prices.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: support@ecommercey.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2023 E commerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
