/*
  MR FOODIE — EMAIL SETUP
  1) Replace ORDER_EMAIL below with the Gmail address that should receive orders.
  2) The first real order triggers a confirmation email from FormSubmit. Open that email
     and click its activation link. Later orders will be delivered to that inbox.
  3) GitHub Pages is static hosting; this uses FormSubmit so no private API key/backend is needed.
*/
const ORDER_EMAIL = "faizanshy7@gmail.com";

const products = [
  {id:1,name:"Classic Smash Burger",category:"Burgers",price:650,emoji:"🍔",desc:"Juicy smashed patty, cheese and our signature sauce."},
  {id:2,name:"Double Cheese Burger",category:"Burgers",price:850,emoji:"🍔",desc:"Double patty, double cheese, double happiness."},
  {id:3,name:"Loaded Pepperoni Pizza",category:"Pizza",price:1250,emoji:"🍕",desc:"Cheesy, saucy and topped with pepperoni."},
  {id:4,name:"Creamy Fajita Pizza",category:"Pizza",price:1350,emoji:"🍕",desc:"Creamy sauce, chicken fajita and golden cheese."},
  {id:5,name:"Crispy Chicken Wings",category:"Sides",price:550,emoji:"🍗",desc:"Crispy outside, tender inside, full of flavour."},
  {id:6,name:"Golden French Fries",category:"Sides",price:300,emoji:"🍟",desc:"Hot, crunchy fries with a little extra love."},
  {id:7,name:"Chilled Cola",category:"Drinks",price:180,emoji:"🥤",desc:"A cold, fizzy classic to complete your meal."},
  {id:8,name:"Chocolate Shake",category:"Drinks",price:420,emoji:"🥤",desc:"Thick, creamy and seriously chocolatey."}
];
let cart = {};
let activeCategory = "All";
const $ = s => document.querySelector(s);
const money = n => "Rs. " + Number(n).toLocaleString("en-PK");
const count = () => Object.values(cart).reduce((a,b)=>a+b,0);
const total = () => Object.entries(cart).reduce((sum,[id,qty])=>sum+products.find(p=>p.id===Number(id)).price*qty,0);

function renderProducts(){
  const list = activeCategory==="All" ? products : products.filter(p=>p.category===activeCategory);
  $("#productGrid").innerHTML = list.map(p=>`<article class="product-card">
    <div class="product-visual">${p.emoji}</div><div class="product-category">${p.category.toUpperCase()}</div>
    <h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span>
    <button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button></div></article>`).join("");
}
function renderCart(){
  $("#cartCount").textContent=count();$("#cartTotal").textContent=money(total());$("#checkoutTotal").textContent=money(total());
  const entries=Object.entries(cart);
  $("#cartItems").innerHTML=entries.length?entries.map(([id,qty])=>{const p=products.find(x=>x.id===Number(id));return `<div class="cart-row">
    <div class="cart-emoji">${p.emoji}</div><div><strong>${p.name}</strong><small>${money(p.price)} each</small>
    <div class="qty"><button data-change="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-change="${id}" data-delta="1" aria-label="Increase quantity">+</button></div></div>
    <span class="line-price">${money(p.price*qty)}</span></div>`}).join(""):`<div class="empty-cart">Your cart is looking hungry.<span>🍔</span><small>Add something delicious from the menu.</small></div>`;
}
function openCart(){ $("#cartDrawer").classList.add("open");$("#overlay").classList.add("show"); }
function closeCart(){ $("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show"); }
$("#productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=b.dataset.add;cart[id]=(cart[id]||0)+1;renderCart();b.textContent="✓";setTimeout(()=>b.textContent="+",650);});
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("#cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-change]");if(!b)return;const id=b.dataset.change;cart[id]=(cart[id]||0)+Number(b.dataset.delta);if(cart[id]<=0)delete cart[id];renderCart();});
$("#openCart").onclick=openCart;$("#closeCart").onclick=closeCart;$("#overlay").onclick=closeCart;
$("#checkoutBtn").onclick=()=>{if(!count()){alert("Your cart is empty. Add something delicious first!");return;}closeCart();$("#checkoutModal").classList.add("show");$("#formMessage").textContent="";};
$("#closeCheckout").onclick=()=>$("#checkoutModal").classList.remove("show");
$("#checkoutModal").addEventListener("click",e=>{if(e.target===$("#checkoutModal"))$("#checkoutModal").classList.remove("show");});
$("#orderForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const msg=$("#formMessage"),btn=$("#submitOrder");
  if(!count())return;
  if(ORDER_EMAIL==="YOUR_GMAIL_ADDRESS@gmail.com"||!ORDER_EMAIL.includes("@")){msg.className="form-message error";msg.textContent="Setup needed: add your Gmail address in script.js (ORDER_EMAIL), then upload again.";return;}
  const data=new FormData(e.currentTarget);
  const orderLines=Object.entries(cart).map(([id,qty])=>{const p=products.find(x=>x.id===Number(id));return `${p.name} x ${qty} — ${money(p.price*qty)}`;}).join("\n");
  const payload={
    _subject:`New Mr Foodie Order — ${data.get("customer_name")}`,
    _template:"table",
    "Customer name":data.get("customer_name"),
    "Phone":data.get("phone"),
    "Delivery address":data.get("address"),
    "City":data.get("city"),
    "Payment method":data.get("payment"),
    "Order items":orderLines,
    "Total":money(total()),
    "Notes":data.get("notes")||"None"
  };
  btn.disabled=true;btn.textContent="Sending your order…";msg.className="form-message";msg.textContent="Please wait while we send your order.";
  try{
    const response=await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(ORDER_EMAIL)}`,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(payload)});
    const result=await response.json();
    if (!response.ok || String(result.success) !== "true") {throw new Error(result.message || "Email service rejected the order.");}throw new Error(result.message||"Order could not be sent.");
    msg.className="form-message success";msg.textContent="Order submitted! Thank you — Mr Foodie will contact you to confirm.";
    cart={};renderCart();e.currentTarget.reset();btn.textContent="Order sent ✓";
    setTimeout(()=>{$("#checkoutModal").classList.remove("show");btn.disabled=false;btn.innerHTML='Done — place my order <span>✓</span>';},2400);
  }catch(err) {msg.className = "form-message error";msg.textContent = "Error: " + err.message;btn.disabled = false;btn.innerHTML = 'Done — place my order <span>✓</span>';
}
renderProducts();renderCart();
