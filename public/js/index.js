function addToWishlist(event) {
    const button = event.currentTarget

    axios.post(`/product/${button.id}/wishlist`)
        .then(res => {
        })
}

function deleteFromWishlist(event) {
    const button = event.currentTarget

    axios.post(`/product/${button.id}/wishlist/delete`)
        .then(res => {
            button.closest('.product-container').remove()
        })
}

function addToCart(event) {
    const button = event.currentTarget
    axios.post(`/product/${button.id}/cart`)
        .then(res => {
            let currentNumber = document.getElementById('cart-number')
            currentNumber.innerHTML =  Number(currentNumber.innerHTML) + 1
        })
}

function deleteFromCart(event) {
    const button = event.currentTarget

    axios.post(`/product/${button.id}/cart/delete`)
        .then(res => {
            button.closest('.cart-container').remove()
            let currentNumber = document.getElementById('cart-number')
            currentNumber.innerHTML =  Number(currentNumber.innerHTML) - 1
        })
}

$(window).on('load', function () {
    $('#myModal').modal('show');
});