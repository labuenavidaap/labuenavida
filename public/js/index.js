axios.interceptors.request.use(function (config) {
    config.headers.isAjax = true
    return config
}, function (error) {
    return Promise.reject(error)
})


axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error.response?.status === 401) {
        location.assign('/login')
    } else {
        return Promise.reject(error)
    }
})

function addToWishlist(event) {
    const button = event.currentTarget

    axios.post(`/product/${button.id}/wishlist`, {}, { withCredentials: true })
        .then(res => {

        })
        .catch(e => { })
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
    axios.post(`/product/${button.id}/cart`, {}, { withCredentials: true })
        .then(res => {
            let currentNumber = document.getElementById('cart-number')
            currentNumber.innerHTML = Number(currentNumber.innerHTML) + 1
        })
}

function deleteFromCart(event) {
    const button = event.currentTarget

    axios.post(`/product/${button.id}/cart/delete`)
        .then(res => {
            button.closest('.cart-container').remove()
            let currentNumber = document.getElementById('cart-number')
            currentNumber.innerHTML = Number(currentNumber.innerHTML) - 1
        })
}

$(window).on('load', function () {
    $('#myModal').modal('show')
})
