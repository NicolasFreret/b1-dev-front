const body = document.body,
header = body.querySelector('header'),
cart = header.querySelector('.cart'),
cartItemsDisplay = cart.querySelector('.nbItem'),
cartContainer = body.querySelector('section.cart'),
close_cart_content = cartContainer.querySelector('.close_cart_content'),
cart_total = cartContainer.querySelector('.cart_total'),
cartContent = cartContainer.querySelector('.cartContent'),
cartProducts = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []



cart.addEventListener('click', e =>  toggleCart(e))
close_cart_content.addEventListener('click', e =>  toggleCart(e))

function toggleCart(e){
    e.preventDefault()
    let isOpen = body.classList.toggle('open')
    cartContainer.ariaExpanded = isOpen
}


/**
 * Va chercher les produits dans une base données
 * 
 * @returns {JSON} liste des produits
 * 
 */
async function fetchProducts(){
    let res = await fetch('http://127.0.0.1:5500/assets/js/products.js')
    let products = await res.json()
    return products
}

/**
 * Affiche les chaises dans la page web
 */
function setProducts(){
    const articleTemplate = document.querySelector('template#articleTemplate'),
    productsContainer = document.querySelector('.productsContainer')

    fetchProducts().then( products =>{
        products.forEach( product => {
            let template = articleTemplate.content.cloneNode(true),
            btnAdd = template.querySelector('.addToCart')
            template.querySelector('img').src = 'assets/'+product.image
            template.querySelector('h1').innerText = product.name
            template.querySelector('.price').innerText = product.price+'€' 
            btnAdd.dataset.id = product.id
            btnAdd.dataset.price = product.price
            btnAdd.dataset.name = product.name
            btnAdd.dataset.img = 'assets/'+product.image
            btnAdd.addEventListener('click', function(e){
                addToCart(e)
            })
            productsContainer.append(template)
        })
    })
}


/**
 * Ajoute un article au panier "machine"
 * @param {clickEvent} e 
 */
function addToCart(e){
    e.preventDefault()
    const item = e.target.dataset
    const isInCart = cartProducts.find( p=> p.id === item.id )
    if(isInCart) isInCart.qty += 1
        else cartProducts.unshift( {...item,qty:1,price: Number(item.price)} )
    cartUI()
}

/**
 * Suprrime l'article du panier après une confirmation
 * 
 * @param {clickEvent} e 
 */
function deleteFromCart(e){
    const index = Number(e.currentTarget.parentElement.dataset.index)
    confirm("Supprimer l'article ?") ? cartProducts.splice(index,1) : ''
    cartUI()
}

function manageQty(e){
    e.preventDefault()
    const btn = e.currentTarget,
    index = Number(btn.parentElement.parentElement.dataset.index),
    isAdd = btn.classList.contains('add')

    if(isAdd) cartProducts[index].qty += 1
        else if( cartProducts[index].qty > 1 ) cartProducts[index].qty -= 1
            else deleteFromCart(e)
    cartUI()
}

/**
 * Affiche visuellement le panier à l'utilisateur en se basant sur le panier "machine"
 */
function cartUI(){
    displayCartContent()
    displayItemsInCart()
    displayCartTotal()
    saveCart()
}

/**
 * Sauvegarder le panier dans la navigateur
 */
function saveCart(){
    localStorage.setItem('cart', JSON.stringify(cartProducts))
}

/**
 * Remet à jour le nombre d'article dans le panier dans l'icone du header
 */
function displayItemsInCart(){
    cartItemsDisplay.innerText = cartProducts.reduce( (acc, item) => item.qty + acc, 0 )
}

/**
 * Calcul et affiche le montant du total du panier
 */
function displayCartTotal(){
    cart_total.innerText = cartProducts.reduce(function(acc, item){
        return (item.qty * item.price) + acc
    },0)
}


/**
 * Remet à jour le panier visible sur la page
 */
function displayCartContent(){
    const itemTemplate = document.querySelector('template#item-cart'),
    fragment = document.createDocumentFragment()

    cartContent.innerHTML = ''
    cartProducts.forEach((product,i) =>{
        let template = itemTemplate.content.cloneNode(true),
        trshBtn = template.querySelector('.item_trash'),
        qtyBtns = template.querySelectorAll('.item_qty_button')
    
        template.querySelector('.item_img img').src = product.img
        trshBtn.parentElement.dataset.index = i
        qtyBtns[0].addEventListener('click', e=> manageQty(e))
        qtyBtns[1].addEventListener('click', e=> manageQty(e))
        trshBtn.addEventListener('click',e => deleteFromCart(e))
        template.querySelector('.item_title').innerText = product.name
        template.querySelector('.item_price').innerText = product.price+'€'
        template.querySelector('.item_qty_value').innerText = product.qty

        fragment.append(template)
    })

    cartContent.append(fragment)
}


setProducts()
cartUI()




