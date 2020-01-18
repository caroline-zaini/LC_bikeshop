var express = require('express');
var router = express.Router();

 // var dataCardBike = [];
 // delete fake datas from the starter:
 // { id: 1, name:"BIKO45", url:"/images/bike-1.jpg", price:679, quantity:1},
 const stripe = require('stripe')('sk_test_pK698k2gm7NRp95PhDNEfvdY00YCTrd0Ab');

// Initialize data for bikes
var dataBike = [
  {name:"BIKO45" ,url:"/images/bike-1.jpg" ,price:679 },
  {name:"ZOOK07" ,url:"/images/bike-2.jpg" ,price:999 },
  {name:"TITANS" ,url:"/images/bike-3.jpg" ,price:799 },
  {name:"CEWO" ,url:"/images/bike-4.jpg" ,price:1300 },
  {name:"AMIG039" ,url:"/images/bike-5.jpg" ,price:479 },
  {name:"LIK099" ,url:"/images/bike-6.jpg" ,price:869 }
 ];


/* *
 GET home page 
 */
router.get('/', function(req, res, next) {
// Pour ne pas qu'il soit réinitialisé vide à chaque fois.
  if (req.session.dataCardBike == undefined) {
    req.session.dataCardBike = []
  }

  console.log("session :" + req.session.dataCardBike)
  res.render('index', {dataBike});
});
// get est la méthode HTTP



/* *
 GET shop page : add item
 */

router.get('/shop', async function(req, res, next) { // async permet d'appeler la méthode await.

  var product = req.query;
  var isDoublon = false;

  // loop for check the same product.
  for (var i=0; i < req.session.dataCardBike.length ; i++ ) {
   
    if (req.session.dataCardBike[i].name == product.name) {
      console.log("type of quantity " + typeof req.session.dataCardBike[i].quantity);
      // pourquoi cette ligne renvoie 11 car l'info est considérée comme une string
      // parseInt renvoie 11, si on convertit 11aaa et Number renvoie une erreur
      console.log("quantity " + req.session.dataCardBike[i].quantity + 1);
      req.session.dataCardBike[i].quantity = Number(req.session.dataCardBike[i].quantity + 1);
      isDoublon = true;
    }
  }
     if (isDoublon == false) {
      // push in the array.
      // créer des nouvelles propriétés avec les valeurs appelées par req.query
      req.session.dataCardBike.push({
        name: product.name,
        url: product.url,
        price: product.price,
        quantity: 1,
      }); 
      console.log("###### add")  
    }  

    var stripeCard = [];

    // tableau des produits que stripe attend.
    for(var i=0; i<req.session.dataCardBike.length; i++) {
      stripeCard.push ({
        name: req.session.dataCardBike[i].name,
        amount: req.session.dataCardBike[i].price * 100,
        currency: "eur",
        quantity: req.session.dataCardBike[i].quantity,
      })
    }

    console.log("stripeCard : " + stripeCard)

    // Créé une propriété vide
    var sessionStripeID;

    if(stripeCard.length > 0) {
      // Création de la session qui est asynchrone (on attend )
      var session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // line_items: [{
        //   name: 'Bike',
        //   amount: 20000,
        //   currency: 'eur',
        //   quantity: 1,
        // }],
        line_items: stripeCard,
        success_url: 'http://127.0.0.1:3000/success?session_sessionStripeID',
        cancel_url: 'http://127.0.0.1:3000/cancel',
    });

      sessionStripeID = session.id;
   
    }
   
    console.log("sessionStripeID : " + sessionStripeID)
    res.render('shop', {dataCardBike:req.session.dataCardBike, sessionStripeID});
});




/* *
 GET shop page : delete item
 */
router.get('/delete-shop', async function(req, res, next) {
  var product = req.query;
  // splice par rapport à une position, supprimer un élément
  req.session.dataCardBike.splice(product.position, 1);

  // For the Stripe payement
  var stripeCard = [];

  // tableau des produits que stripe attend.
  for(var i=0; i<req.session.dataCardBike.length; i++) {
    stripeCard.push ({
      name: req.session.dataCardBike[i].name,
      amount: req.session.dataCardBike[i].price * 100,
      currency: "eur",
      quantity: req.session.dataCardBike[i].quantity,
    })
  }

  console.log("stripeCard : " + stripeCard)

  // Créé une propriété vide
  var sessionStripeID;

  if(stripeCard.length > 0) {
    // Création de la session qui est asynchrone (on attend )
    var session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // line_items: [{
      //   name: 'Bike',
      //   amount: 20000,
      //   currency: 'eur',
      //   quantity: 1,
      // }],
      line_items: stripeCard,
      success_url: 'http://127.0.0.1:3000/success?session_sessionStripeID',
      cancel_url: 'http://127.0.0.1:3000/cancel',
  });

    sessionStripeID = session.id;
 
  }

  res.render('shop', {dataCardBike: req.session.dataCardBike});
});



/* *
 GET shop page : recupe bike's quantity
 */
router.post('/update-shop', async function(req, res, next) {
  // récupère la position.
  var position = req.body.position
  // récupère la quantité du formulaire.
  var reqQuantity = req.body.quantity 
  console.log("quantité de dataCardBike " + req.session.dataCardBike[position].quantity)
  // création d'une nouvelle propriété quantity dans l'objet dataCardBike.
  req.session.dataCardBike[position].quantity = reqQuantity

  // for the Stripe payement
  var stripeCard = [];

  // tableau des produits que stripe attend.
  for(var i=0; i<req.session.dataCardBike.length; i++) {
    stripeCard.push ({
      name: req.session.dataCardBike[i].name,
      amount: req.session.dataCardBike[i].price * 100,
      currency: "eur",
      quantity: req.session.dataCardBike[i].quantity,
    })
  }

  console.log("stripeCard : " + stripeCard)

  // Créé une propriété vide
  var sessionStripeID;

  if(stripeCard.length > 0) {
    // Création de la session qui est asynchrone (on attend )
    var session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // line_items: [{
      //   name: 'Bike',
      //   amount: 20000,
      //   currency: 'eur',
      //   quantity: 1,
      // }],
      line_items: stripeCard,
      success_url: 'http://127.0.0.1:3000/success?session_sessionStripeID',
      cancel_url: 'http://127.0.0.1:3000/cancel',
  });

    sessionStripeID = session.id;
 
  }

  res.render('shop', {dataCardBike: req.session.dataCardBike, sessionStripeID});
});



/* *
 GET shop page : from the basket icon
 */
router.get('/shop-main', function(req, res, next){
  res.render('shop', {dataCardBike: req.session.dataCardBike});
});




// Redirect to the payement page. En get car il appel l'URL
router.get('/success', function(req, res, next) {
 res.render('confirm');
});




module.exports = router;



