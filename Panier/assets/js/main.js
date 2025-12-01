const header = document.querySelector('header'),
cart = header.querySelector('.cart')

cart.addEventListener('click', function(e){
    e.preventDefault()
    document.body.classList.toggle('open')
})


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




