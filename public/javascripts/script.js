// clé publique 
var stripe = Stripe('pk_test_goEG0QZF2z3rjycCA0pR8j8w000ns3dODE');


// Écoute sur le bouton checkout
document.getElementById('checkout').addEventListener("click", function() {
    // Récupéré de la doc de stripe.
    stripe.redirectToCheckout({
    sessionId: sessionStripeID
    }).then(function (result) {

    });
})