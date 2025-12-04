const body = document.body,
header = body.querySelector('header'),
cart = header.querySelector('.cart'),
cartItemsDisplay = cart.querySelector('.nbItem'),
cartContainer = body.querySelector('section.cart'),
close_cart_content = cartContainer.querySelector('.close_cart_content'),
cartContent = cartContainer.querySelector('.cartContent'),
cartProducts = []



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
        else cartProducts.unshift( {...item,qty:1} )
    cartUI()
}

function deleteFromCart(){
    
}

function manageQty(){
    
}

/**
 * Affiche visuellement le panier à l'utilisateur en se basant sur le panier "machine"
 */
function cartUI(){
    displayCartContent()
    displayItemsInCart()
}

function displayItemsInCart(){
    cartItemsDisplay.innerText = cartProducts.length
}

function displayCartContent(){
    const itemTemplate = document.querySelector('template#item-cart'),
    fragment = document.createDocumentFragment()

    cartContent.innerHTML = ''
    cartProducts.forEach(product =>{
        let template = itemTemplate.content.cloneNode(true)
        template.querySelector('.item_img img').src = product.img
        template.querySelector('.item_title').innerText = product.name
        template.querySelector('.item_price').innerText = product.price+'€'
        template.querySelector('.item_qty_value').innerText = product.qty

        fragment.append(template)
    })

    cartContent.append(fragment)
}


setProducts()




