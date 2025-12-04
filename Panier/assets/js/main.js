const body = document.body,
header = body.querySelector('header'),
cart = header.querySelector('.cart'),
cartContainer = body.querySelector('section.cart'),
close_cart_content = cartContainer.querySelector('.close_cart_content')



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


function setProducts(){
    const articleTemplate = document.querySelector('template#articleTemplate'),
    productsContainer = document.querySelector('.productsContainer')

    fetchProducts().then( products =>{
        products.forEach( product => {
            let template = articleTemplate.content.cloneNode(true)
            template.querySelector('img').src = 'assets/'+product.image
            template.querySelector('h1').innerText = product.name
            template.querySelector('.price').innerText = product.price+'€'       
            productsContainer.append(template)
        })
    })
}


setProducts()




