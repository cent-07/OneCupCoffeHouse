// ================= FIXED & WORKING CODE =================
let store = {
    currentUser: null, adminUser: null, cart: [], selectedPayment: null,
    products: [
        { id: 1, name: "Espresso", category: "coffee", price: 1500, stock: 50, description: "Strong coffee", status: "available", image: "pic/Instant Espresso Recipes.jfif" },
        { id: 2, name: "Cappuccino", category: "coffee", price: 2000, stock: 45, description: "With foam", status: "available", image: "pic/Cappuccino.jfif" },
        { id: 3, name: "Latte", category: "coffee", price: 2200, stock: 40, description: "Smooth latte", status: "available", image: "pic/Virtuoso Latte.jfif" },
        { id: 4, name: "Green Tea", category: "tea", price: 1200, stock: 30, description: "Organic green tea", status: "available", image: "pic/A warm cup of green tea symbolizes balance, focus….jfif" },
        { id: 5, name: "Black Tea", category: "tea", price: 1000, stock: 35, description: "Classic black tea", status: "available", image: "pic/black.jfif" },
        { id: 6, name: "Croissant", category: "snacks", price: 1200, stock: 20, description: "Buttery pastry", status: "available", image: "pic/download (2).jfif" },
        { id: 7, name: "Muffin", category: "snacks", price: 1000, stock: 25, description: "Fresh muffin", status: "available", image: "pic/Fluffy Chocolate Chip Muffins - BluntCook.jfif" },
        { id: 8, name: "Sandwich", category: "snacks", price: 2500, stock: 15, description: "Ham & cheese", status: "available", image: "pic/sandwich (2).jfif" },
    ],
    users: [
        { email: "admin@onecup.rw", password: "1234", name: "Admin", role: "manager", isStaff: true },
        { email: "barista@onecup.rw", password: "5678", name: "Jean", role: "barista", isStaff: true }
    ],
    sales: [], activity: []
};

function showToast(msg){
    let t=document.getElementById('toast');
    t.textContent=msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),5000);
}

function updateCartCount(){
    document.getElementById('cartCount').textContent = store.cart.reduce((s,i)=>s+i.quantity,0);
}

function showSection(sectionId){
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    let target=document.getElementById(sectionId);
    if(target) target.classList.add('active');
    if(sectionId==='menu') renderMenu('all');
    if(sectionId==='cart') renderCart();
    if(sectionId==='payment'){
        store.selectedPayment = null;
        document.querySelectorAll('.payment-method').forEach(el=>el.classList.remove('selected'));
        document.getElementById('paymentDetails').classList.add('hidden');
        document.getElementById('momoDetails').classList.remove('hidden');
        document.getElementById('cardDetails').classList.add('hidden');
        let momoInput = document.getElementById('momoPhone');
        if(momoInput) momoInput.value = '';
        let momoPinInput = document.getElementById('momoPin');
        if(momoPinInput) momoPinInput.value = '';
        let summaryDiv = document.getElementById('paymentSummary');
        if(summaryDiv && store.cart.length > 0){
            let total = store.cart.reduce((sum,item)=>sum + (item.price * item.quantity),0);
            let itemsHtml = store.cart.map(item => `<div>${item.name} x${item.quantity} = RWF ${(item.price * item.quantity).toLocaleString()}</div>`).join('');
            summaryDiv.innerHTML = `<div style="margin-bottom:1rem;"><strong>Items:</strong></div>${itemsHtml}<div style="margin-top:1rem; padding-top:0.5rem; border-top:1px solid var(--grey);"><strong>Total: RWF ${total.toLocaleString()}</strong></div>`;
        } else if(summaryDiv){
            summaryDiv.innerHTML = '<p>No items in cart</p>';
        }
    }
    if(sectionId==='login'){
        if(store.currentUser){
            showToast(`You are already logged in as ${store.currentUser.name}`);
            showSection('home');
        }
    }
}

function renderMenu(filter='all'){
    let grid=document.getElementById('menuGrid');
    if(!grid) return;
    grid.innerHTML='';
    let filtered = filter==='all' ? store.products : store.products.filter(p=>p.category===filter);
    filtered.forEach(p=>{
        let card=document.createElement('div');
        card.className='product-card';
        card.innerHTML=`
        <div style="height:200px;background:#2a2a2a;">
            <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='pic/default.jpg'">
        </div>
        <div class="product-info">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p class="product-price">RWF ${p.price.toLocaleString()}</p>
            <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>`;
        grid.appendChild(card);
    });
}
window.filterMenu = function(category) { renderMenu(category); };

function addToCart(id){
    let p=store.products.find(p=>p.id===id);
    if(!p) return;
    let existing=store.cart.find(i=>i.id===id);
    if(existing) existing.quantity++;
    else store.cart.push({...p, quantity:1});
    updateCartCount();
    showToast(p.name+" added to cart!");
}

function renderCart(){
    let container=document.getElementById('cartItems');
    let footer=document.getElementById('cartFooter');
    if(store.cart.length===0){
        container.innerHTML='<p class="text-center" style="color: var(--light-grey); padding: 3rem;">Your cart is empty</p>';
        footer.classList.add('hidden');
        return;
    }
    container.innerHTML='';
    let total=0;
    store.cart.forEach((item,idx)=>{
        let itemTotal=item.price*item.quantity;
        total+=itemTotal;
        container.innerHTML+=`
        <div class="cart-item">
            <div><strong>${item.name}</strong><br>${item.quantity} x RWF ${item.price}</div>
            <div><strong>RWF ${itemTotal}</strong></div>
            <button class="btn btn-secondary" style="width:auto;" onclick="removeFromCart(${idx})">Remove</button>
        </div>`;
    });
    document.getElementById('cartTotal').innerText = `RWF ${total}`;
    footer.classList.remove('hidden');
}

function removeFromCart(index){
    store.cart.splice(index,1);
    renderCart();
    updateCartCount();
}

function selectPayment(method){
    store.selectedPayment = method;
    document.querySelectorAll('.payment-method').forEach(el=>el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.getElementById('paymentDetails').classList.remove('hidden');
    
    if(method === 'momo'){
        document.getElementById('momoDetails').classList.remove('hidden');
        document.getElementById('cardDetails').classList.add('hidden');
    } else if(method === 'card'){
        document.getElementById('momoDetails').classList.add('hidden');
        document.getElementById('cardDetails').classList.remove('hidden');
    } else {
        document.getElementById('momoDetails').classList.add('hidden');
        document.getElementById('cardDetails').classList.add('hidden');
    }
}

function validatePhoneNumber(phone) {
    let cleaned = phone.replace(/[\s\-+]/g, '');
    if(cleaned.length === 10 && /^[0-9]+$/.test(cleaned)){
        if(cleaned.startsWith('07') || cleaned.startsWith('78')){
            return true;
        }
    }
    if(cleaned.length === 12 && cleaned.startsWith('250') && /^[0-9]+$/.test(cleaned)){
        let withoutCode = cleaned.substring(3);
        if(withoutCode.length === 9 && (withoutCode.startsWith('7') || withoutCode.startsWith('78'))){
            return true;
        }
    }
    return false;
}

function getCartTotal() {
    return store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function processPayment(){
    if(!store.selectedPayment){ 
        showToast("Please select a payment method"); 
        return; 
    }
    if(store.cart.length===0){ 
        showToast("Cart is empty"); 
        return; 
    }
    
    let customerName = store.currentUser ? store.currentUser.name : "Guest";
    let cartTotal = getCartTotal();
    
    if(store.selectedPayment === 'momo'){
        let phoneInput = document.getElementById('momoPhone');
        let phoneNumber = phoneInput ? phoneInput.value : '';
        let pinInput = document.getElementById('momoPin');
        let pin = pinInput ? pinInput.value : '';
        
        if(!phoneNumber){
            showToast("Please enter your mobile money phone number");
            return;
        }
        if(!validatePhoneNumber(phoneNumber)){
            showToast("Please enter a valid 10-digit phone number (e.g., 078XXXXXXX)");
            return;
        }
        if(!pin){
            showToast("Please enter your Mobile Money PIN");
            return;
        }
        if(!/^\d{4}$/.test(pin)){
            showToast("PIN must be 4 digits");
            return;
        }
        
        let validatedNumber = phoneNumber.replace(/[\s\-+]/g, '');
        if(validatedNumber.length === 12 && validatedNumber.startsWith('250')){
            validatedNumber = '0' + validatedNumber.substring(3);
        }
        showToast(`📱 MoMo payment of RWF ${cartTotal} approved for ${validatedNumber}`);
    }
    else if(store.selectedPayment === 'card'){
        let cardInput = document.getElementById('cardNumber');
        let cardNumber = cardInput ? cardInput.value : '';
        let cardPinInput = document.getElementById('cardPin');
        let cardPin = cardPinInput ? cardPinInput.value : '';
        
        if(!cardNumber){
            showToast("Please enter your card number");
            return;
        }
        let cleanCard = cardNumber.replace(/\s/g, '');
        if(!/^\d{13,16}$/.test(cleanCard)){
            showToast("Please enter a valid card number (13-16 digits)");
            return;
        }
        if(!cardPin){
            showToast("Please enter your card PIN");
            return;
        }
        if(!/^\d{4,6}$/.test(cardPin)){
            showToast("Card PIN must be 4-6 digits");
            return;
        }
        showToast(`💳 Card payment of RWF ${cartTotal} approved for card ending in ${cleanCard.slice(-4)}`);
    }
    else if(store.selectedPayment === 'cash'){
        showToast(`💵 Cash payment of RWF ${cartTotal} selected. Please pay at the counter.`);
    }
    
    // Record each sale with customer name
    let orderItems = [];
    store.cart.forEach(item=>{
        let itemTotal = item.price * item.quantity;
        orderItems.push(`${item.name} x${item.quantity} = RWF ${itemTotal}`);
        store.sales.push({
            date: new Date().toLocaleString(),
            product: item.name,
            qty: item.quantity,
            amount: itemTotal,
            payment: store.selectedPayment,
            staff: store.adminUser ? store.adminUser.name : "Customer",
            customer: customerName
        });
        let prod = store.products.find(p=>p.id===item.id);
        if(prod) prod.stock -= item.quantity;
    });
    
    // Show detailed receipt message
    let receiptMsg = `✅ PAYMENT RECEIPT\n\n`;
    receiptMsg += `Customer: ${customerName}\n`;
    receiptMsg += `Payment Method: ${store.selectedPayment.toUpperCase()}\n`;
    receiptMsg += `Date: ${new Date().toLocaleString()}\n`;
    receiptMsg += `\nItems:\n${orderItems.join('\n')}\n`;
    receiptMsg += `\nTOTAL: RWF ${cartTotal}\n`;
    receiptMsg += `\nThank you for shopping at One Cup Coffeehouse! ☕`;
    
    showToast(receiptMsg);
    
    store.cart = [];
    updateCartCount();
    renderCart();
    showSection('home');
    if(store.adminUser) updateAdminDashboard();
}

function openAdminLogin(){ document.getElementById('adminLoginModal').style.display = 'flex'; }
function closeAdminLogin(){ document.getElementById('adminLoginModal').style.display = 'none'; }

function handleAdminLogin(event){
    event.preventDefault();
    let email = document.getElementById('adminLoginEmail').value;
    let pin = document.getElementById('adminLoginPassword').value;
    let validStaff = store.users.find(u => u.email === email && u.password === pin && u.isStaff === true);
    if(validStaff){
        store.adminUser = validStaff;
        document.getElementById('adminName').innerText = validStaff.name;
        document.getElementById('adminRole').innerText = validStaff.role;
        closeAdminLogin();
        showSection('admin');
        updateAdminDashboard();
        renderAdminProducts();
        renderInventoryTable();
        renderStaffListAdmin();
        renderSalesTableAdmin();
        showToast(`Welcome ${validStaff.name}`);
    } else {
        document.getElementById('adminLoginAlert').innerHTML = '<p style="color:red;">Invalid credentials or not staff</p>';
    }
}

function logoutAdmin(){ store.adminUser = null; showSection('home'); showToast("Admin logged out"); }

function updateAdminDashboard(){
    let today = new Date().toLocaleDateString();
    let todaySales = store.sales.filter(s => s.date.includes(today)).reduce((sum,s)=>sum+s.amount,0);
    let todayItems = store.sales.filter(s => s.date.includes(today)).reduce((sum,s)=>sum+s.qty,0);
    document.getElementById('statSales').innerText = `RWF ${todaySales}`;
    document.getElementById('statItems').innerText = todayItems;
    document.getElementById('statProducts').innerText = store.products.length;
    document.getElementById('statStaff').innerText = store.users.filter(u=>u.isStaff).length;
}

function showAdminTab(tabName){
    document.querySelectorAll('.admin-tab').forEach(t=>t.classList.add('hidden'));
    document.getElementById(`admin${tabName.charAt(0).toUpperCase()+tabName.slice(1)}`).classList.remove('hidden');
    if(tabName === 'dashboard') updateAdminDashboard();
    if(tabName === 'inventory') renderInventoryTable();
    if(tabName === 'products') renderAdminProducts();
    if(tabName === 'staff') renderStaffListAdmin();
    if(tabName === 'sales') renderSalesTableAdmin();
}

function renderInventoryTable(){
    let tbody = document.getElementById('inventoryTable');
    if(!tbody) return;
    tbody.innerHTML = store.products.map(p=>`<tr><td>${p.name}</td><td>${p.stock}</td><td>RWF ${p.price}</td><td>${p.stock>0?'In Stock':'Low'}</td><td><button class="btn btn-secondary" style="width:auto;" onclick="alert('Edit stock not implemented')">Edit</button></td></tr>`).join('');
}

function renderAdminProducts(){
    let grid = document.getElementById('adminProductGrid');
    if(!grid) return;
    grid.innerHTML = store.products.map(p=>`
        <div class="product-card">
            <div style="height:150px;"><img src="${p.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='pic/default.jpg'"></div>
            <div class="product-info"><h3>${p.name}</h3><p>RWF ${p.price} | Stock: ${p.stock}</p><button class="btn btn-secondary" onclick="deleteProduct(${p.id})">Delete</button></div>
        </div>`).join('');
}

function deleteProduct(id){ if(confirm("Delete product?")){ store.products = store.products.filter(p=>p.id!==id); renderAdminProducts(); renderMenu('all'); showToast("Product deleted"); } }

function addProduct(){
    let name=document.getElementById('newProductName').value, cat=document.getElementById('newProductCategory').value, price=parseInt(document.getElementById('newProductPrice').value), stock=parseInt(document.getElementById('newProductStock').value)||0;
    if(!name||!price){ showToast("Name & Price required"); return; }
    let newId=Date.now();
    store.products.push({ id:newId, name, category:cat, price, stock, description:name, status:"available", image:"pic/default.jpg" });
    showToast("Product added");
    renderAdminProducts();
    renderMenu('all');
    document.getElementById('addProductForm').classList.add('hidden');
}

function showAddProductForm(){ document.getElementById('addProductForm').classList.remove('hidden'); }

function renderStaffListAdmin(){
    let container=document.getElementById('staffList');
    if(container) container.innerHTML = store.users.filter(u=>u.isStaff).map(s=>`<div class="staff-card"><span><strong>${s.name}</strong> (${s.role})<br><small>${s.email}</small></span><span class="staff-role">${s.role}</span></div>`).join('');
}

function renderSalesTableAdmin(){
    let tbody=document.getElementById('salesTable');
    if(tbody) tbody.innerHTML = store.sales.slice().reverse().map(s=>`<tr><td>${s.date}</td><td>${s.product}</td><td>${s.qty}</td><td>RWF ${s.amount}</td><td>${s.payment}</td><td>${s.customer || 'Guest'}</td><td>${s.staff || 'Customer'}</td></tr>`).join('');
}

function handleLogin(e){ 
    e.preventDefault(); 
    let email=document.getElementById('loginEmail').value; 
    let pin=document.getElementById('loginPassword').value; 
    let user=store.users.find(u=>u.email===email && u.password===pin && !u.isStaff); 
    if(user){ 
        store.currentUser=user; 
        // Update login/logout buttons visibility
        document.getElementById('loginNav').classList.add('hidden');
        document.getElementById('logoutNav').classList.remove('hidden');
        showToast(`✅ Welcome back ${user.name}! You are now logged in.`); 
        showSection('home'); 
    } else { 
        showToast("Invalid email or PIN. Please try again."); 
    } 
}

function handleSignup(e){ 
    e.preventDefault(); 
    let name=document.getElementById('signupName').value; 
    let email=document.getElementById('signupEmail').value; 
    let pwd=document.getElementById('signupPassword').value; 
    let confirm=document.getElementById('signupConfirm').value; 
    if(pwd!==confirm){ 
        showToast("PINs don't match"); 
        return; 
    } 
    if(store.users.find(u=>u.email===email)){ 
        showToast("Email already exists. Please login."); 
        return; 
    } 
    store.users.push({email, password:pwd, name, isStaff:false}); 
    showToast(`✅ Account created successfully! Welcome ${name}! Please login.`); 
    showSection('login'); 
}

function handleForgot(e){ 
    e.preventDefault(); 
    let email = document.getElementById('forgotEmail').value;
    let user = store.users.find(u=>u.email===email);
    if(user){
        showToast(`📧 Password reset link sent to ${email}. Your PIN is: ${user.password} (demo)`);
    } else {
        showToast("Email not found. Please sign up first.");
    }
}

function logout(){ 
    let userName = store.currentUser ? store.currentUser.name : "";
    store.currentUser = null; 
    document.getElementById('loginNav').classList.remove('hidden');
    document.getElementById('logoutNav').classList.add('hidden');
    showToast(`👋 Goodbye ${userName}! You have been logged out.`); 
    showSection('home'); 
}

function addStock(){ showToast("Stock feature demo"); }
function showAddStockForm(){ showToast("Record purchase demo"); }
function addStaff(){ showToast("Staff add demo"); }
function showAddStaffForm(){ showToast("Add staff demo"); }

// Check login status on page load
function checkLoginStatus(){
    if(store.currentUser){
        document.getElementById('loginNav').classList.add('hidden');
        document.getElementById('logoutNav').classList.remove('hidden');
    } else {
        document.getElementById('loginNav').classList.remove('hidden');
        document.getElementById('logoutNav').classList.add('hidden');
    }
}

// Initial load
document.addEventListener('DOMContentLoaded',()=>{
    renderMenu('all');
    updateCartCount();
    checkLoginStatus();
});