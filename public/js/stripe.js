var stripe = Stripe('pk_test_51HO0RHCbVlpVVSMqknO9OGwNJemEptYsSH793Nw2f82Wzz4hX1JrCRhLTozAosgdqz9Ea4EQCdGxaEusZoj8zmEG00P1k5Y8qs');
var checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', function () {
  fetch('/create-checkout-session', {
    method: 'POST',
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id })
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error('Error:', error)
    })
})