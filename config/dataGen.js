// Dependences
var Product 	= require('../app/models/product.js');
var User    	= require('../app/models/user.js');
var jwt       = require('jwt-simple');
var secret 		= "1click2bechic";

// Macros
var decoration 	= "535a402c8b7fae0211000001";
var fashion			= "535d382581574b530a000001";
var jewelry			= "535d36bf73db3a4a0a000001";


// Create Users
User.remove({}, function(err) { 
	if (err){ 
		console.log("Error deleting users");
	} else {
		Product.remove({}, function(err) { 
			if (err){ 
				console.log("Error deleting products");
			} else {
				console.log("Delete all products!");

				createUser("user1", "Pbojeda", "pb@pb.com", "Test1234", "iComplementos", 40.4254039, -3.712675499999932, "@pbojeda"); 
				createUser("user2", "RobMarco", "robmarco@robmarco.com", "Test1234", "Diseños Marco", 40.530541, -3.638473999999974, "@robmarco");
				createUser("user3", "MorenoMiro", "morenomiro@morenomiro.com", "Test1234", "Soy Diferente!!", 40.5312564, -3.633631899999955, "@isamorenomiro");    
				createUser("user4", "BmJuan", "bmjuan@bmjuan.com", "Test1234", "En tus zapatos", 40.4166635, -3.7041686999999683, "@bmjuan");
				createUser("user5", "Bridita", "bridita@bridita.com", "Test1234", "Collarlandia", 40.5050578, -3.67052149999995, "@bridita");
				createUser("user6", "MA", "ma@ma.com", "Test1234", "Pum & Pez", 40.4207923, -3.701310299999932, "@lopezpumar");
			}
		});
	}
});



// Utils
//==================

function createUser(userselect, username, email, password, shopname, lat, lon, twitter) {
  var user = new User({ 
  	userName: username, 
  	role: "seller",
  	email: email,
  	password: password,
  	web: "www.clickchic.com",
  	shop: {
  		address: "Fuencarral, Madrid",
  		name: shopname,
  		lat: lat,
  		lon: lon
  	},
  	twitter: {
  		name: twitter
  	}
  });

  user.clickchick_count = 0;
  user.clickchics = [];
  user.products_count = 5;

  // create token
  var token = jwt.encode( { salt: user.salt, password: user.hashed_password }, secret);
  user.token = token;
  
  user.save(function(err, user) {
    if(err) return console.log(err);
    else { 
    	console.log("New user - username %s, shopname %s, latlong: %d:%d, twitter %s, id: %s, token: %s", 
    				user.userName, user.shop.name, user.shop.lat, user.shop.lon, user.twitter.name, user._id, user.token);
 			
 			if (userselect == "user1") {
    		// Products for user 1
				createProduct("Pantalón summer enjoy", 
											"Hecho a mano, súper cómodo, en multitud de colores y diseñado para triunfar", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											fashion, 
											49, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_moda1_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_moda1_2.png", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_moda1_3.png", 
											17, 
											"", "", "", 
											21);
				
				createProduct("Verderano", 
											"Vestido largo ideal para el verano hecho con material chiffon. Disponible en múltiples tallas. Unidades limitadas.", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											fashion, 
											44, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_moda2_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_moda2_2.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_moda2_3.jpg", 
											6, 
											"", "", "", 
											12);
				
				createProduct("AngelineShow", 
											"Pulsera reloj con insignia. Alegre, personalizado. Destaca sólo con mirarlo.", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											jewelry, 
											9, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_comp1_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_comp1_2.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_comp1_3.jpg", 
											6, 
											"", "", "", 
											12);
				
				createProduct("Con cariñitos", 
											"Si eres de esas personas detallistas, aquí tienes un producto ideal para regalar a una madre!", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											jewelry, 
											19, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_comp2_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_comp2_2.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_comp2_3.jpg", 
											2, 
											"", "", "", 
											43);
				
				createProduct("PrintableWindsone", 
											"No te conformes con un simple portaretratos. Ten tu propio pequeño muro del arte.", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											decoration, 
											8, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_deco1_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_deco1_2.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user1_deco1_3.jpg", 
											33, 
											"", "", "", 
											2);

    	};
    

    if (userselect == "user2") {
    	// Products for user 2
			createProduct("Pink chiffon skirt", 
										"Si te vas de vacaciones este verano, no dudes en disfrutar de un paseo por la playa con un vestido hecho a mano para destacar.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										fashion, 
										24, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_moda1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_moda1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_moda1_3.jpg", 
										10, 
										"", "", "", 
										6);
			
			createProduct("Premium colour style", 
										"Para aquellas mujeres atrevidas que quieran destacar con un vestido único!", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										fashion, 
										94, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_moda2_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_moda2_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_moda2_3.jpg", 
										14, 
										"", "", "", 
										56);
			
			createProduct("Hippie Chic Boemio", 
										"Esta preciosa diadema para mujeres y adolescentes es el complemento perfecto para tus conjuntos.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										jewelry, 
										44, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_comp1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_comp1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_comp1_3.jpg", 
										6, 
										"", "", "", 
										12);
			
			createProduct("SthNew ProBodas", 
										"Estás pensando en casarte? Simplemente te sientes especial? Luce esta perfecta diadema exclusiva para ti.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										jewelry, 
										83, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_comp2_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_comp2_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_comp2_3.jpg", 
										14, 
										"", "", "", 
										64);
			
			createProduct("Cestas multicolor vintage", 
										"Dale un aire diferente a tu casa, a tu oficina o a cualquier habitación en la que necesites almacenar cosas. Hecho con materiales de primerísima calidad.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										decoration, 
										44, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_deco1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_deco1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user2_deco1_3.jpg", 
										6, 
										"", "", "", 
										12);
    };

    if (userselect == "user3") {
    	// Products for user 3
			createProduct("Picaria", 
										"Si eres atrevida, no lo dudes, destaca con este exclusivo vestido.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										fashion, 
										57, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_model1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_model1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_model1_3.jpg", 
										12, 
										"", "", "", 
										32);
			
			createProduct("Azulandia", 
										"Azul cielo, azul mar, azul precioso azul de mi corazón, con el azul la vida te sonríe. Vístete de azul con este fabuloso vestido de seda.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										fashion, 
										52, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_model2_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_model2_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_model2_3.jpg", 
										14, 
										"", "", "", 
										12);
			
			createProduct("Vinyl Wallet", 
										"Pequeña, llamativa, exclusiva para mujer... no se a que estás esperando. Todo hecho a mano y con materiales de calidad.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										jewelry, 
										17, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_comp1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_comp1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_comp1_3.jpg", 
										12, 
										"", "", "", 
										6);
			
			createProduct("Summer is comming", 
										"Preciosa cartera de mujer hecha a mano con flores en tonos naranjas y amarillos.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										jewelry, 
										35, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_comp2_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_comp2_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_comp2_3.jpg", 
										9, 
										"", "", "", 
										21);
			
			createProduct("Cantale al caracol", 
										"Si eres fanáticos de los pequeños detalles y de las plantas, no podrás decir que no a este artículo.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										decoration, 
										2, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_deco1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_deco1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user3_deco1_3.jpg", 
										6, 
										"", "", "", 
										7);
    };

    if (userselect == "user4") {
    	// Products for user 4
			createProduct("Shrotage", 
										"Precioso pantalón vaquero corto estilo Vintage! Tal y como a ti te gusta!", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										fashion, 
										12, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_moda1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_moda1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_moda1_3.jpg", 
										9, 
										"", "", "", 
										10);
			
			createProduct("TUCSON", 
										"Nuevo short estilo TUCSON. Sólo para ocasiones especiales!", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										fashion, 
										40, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_moda2_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_moda2_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_moda2_3.jpg", 
										14, 
										"", "", "", 
										12);
			
			createProduct("Cuerlock 2014", 
										"Relos de pulsera de cuero para mujeres atrevidas y diferentes. Con un diámetro ideal de 3,5 cm.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										jewelry, 
										14, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_comp1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_comp1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_comp1_3.jpg", 
										12, 
										"", "", "", 
										24);
			
			createProduct("LTDIW Clock", 
										"Te has dado cuenta verdad? Lo has visto? Este reloj está hecho especialmente para ti. Claro, con fuerza y pasión.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										jewelry, 
										12, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_comp2_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_comp2_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_comp2_3.jpg", 
										6, 
										"", "", "", 
										10);
			
			createProduct("iWear Rack", 
										"Dale un toque chic a tu salón con este organizador de pared para gafas, cartera o lo que se te ocurra. Crea tendencia!", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										decoration, 
										26, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_deco1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_deco1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user4_deco1_3.jpg", 
										2, 
										"", "", "", 
										76);
    };

    if (userselect == "user5") {
    		// Products for user 5
				createProduct("WhiteDremas", 
											"Precioso camisón blanco de algodón con un detalle de encaje masivo. Para los mejores sueños!", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											fashion, 
											45, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_moda1_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_moda1_2.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_moda1_3.jpg", 
											10, 
											"", "", "", 
											22);
				
				createProduct("LuxiriusPink", 
											"Preciosa lencería en tonos rosa y champagne. Para esas noches de pasión!", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											fashion, 
											12, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_moda2_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_moda2_2.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_moda2_3.jpg", 
											14, 
											"", "", "", 
											12);
				
				createProduct("Turquise For Her", 
											"Precioso collar color turquesa con pinchos. Demuestra que eres atrevida en formas y colores.", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											jewelry, 
											51, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_comp1_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_comp1_2.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_comp1_3.jpg", 
											14, 
											"", "", "", 
											28);
				
				createProduct("One for domain all", 
											"Anillo tresillo con estilo original y único. Edición limitada. Marca tu propia tendencia.", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											jewelry, 
											67, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_comp2_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_comp2_2.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user5_comp2_3.jpg", 
											6, 
											"", "", "", 
											12);
				
				createProduct("Pallet/Skip coffee", 
											"Mesa estilo antiguo y moderno. Ideal para contrastar en cualquier habitación de la casa en la que quieras marcar la diferencia.", 
											user._id,
											user.userName,
											user.twitter.name,
											user.photo, 
											decoration, 
											44, 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user6_deco1_1.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user6_deco1_2.jpg", 
											"https://s3.amazonaws.com/api-clickchic-img/prod_user6_deco1_3.jpg", 
											6, 
											"", "", "", 
											12);
    };

    if (userselect == "user6") {
    	// Products for user 6
			createProduct("Soft Crystal", 
										"Sólo tienes que ver las fotos y sabrás que están hechas para ti.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										fashion, 
										10, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_moda1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_moda1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_moda1_3.jpg", 
										22, 
										"", "", "", 
										33);
			
			createProduct("Sandalias_Greek", 
										"Diseño único! Utiliza el distinguido calzado que se utilizaba en la antigua Grecia.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										fashion, 
										63, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_moda2_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_moda2_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_moda2_3.jpg", 
										3, 
										"", "", "", 
										19);
			
			createProduct("RoyalFan", 
										"Bandera americana correa para tus gafas. Siente el estilo alternativo de la gran manzana!", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										jewelry, 
										8, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_comp1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_comp1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_comp1_3.jpg", 
										9, 
										"", "", "", 
										31);
			
			createProduct("B&W Verano2014", 
										"Preciosa pajarita azul con constraste blanco. Es de doble cara y ha sido diseñada exclisivamente para el verano 2014. Marca tendencia.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										jewelry, 
										44, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_comp2_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_comp2_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user6_comp2_3.jpg", 
										6, 
										"", "", "", 
										12);
			
			createProduct("Sunshine Yellow", 
										"Para esos fanáticos del orden, del color amarillo y de la forma de destacar en los pequeños detalles. Marca la diferencia con estos organizadores de especias.", 
										user._id,
										user.userName,
										user.twitter.name,
										user.photo, 
										decoration, 
										96, 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user5_deco1_1.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user5_deco1_2.jpg", 
										"https://s3.amazonaws.com/api-clickchic-img/prod_user5_deco1_3.jpg", 
										6, 
										"", "", "", 
										12);
    };   	

    }	
  });
};

function createProduct(model, description, seller_id, seller_name, seller_twitter, seller_avatar, category_id, price, image1, image2, image3, units, colour, gender, size, views_count) {
  var product = new Product({ 
  	model: model, 
  	description: description,
  	seller_id: seller_id,
  	seller_name: seller_name,
  	seller_twitter: seller_twitter,
  	seller_avatar: "https://s3.amazonaws.com/api-clickchic-img/mini_avatar.png",
  	category_id: category_id,
  	price: price,
  	units: units
  });
  
  if (colour && colour != "") {
  	product.colour = colour;
  };
  if (gender && gender != "") {
  	product.gender = gender;
  };
  if (size && size != "") {
  	product.size = size;
  };
  if (views_count && views_count != "") {
  	product.views_count = views_count;
  };

  product.comments_count = 0;
  product.likes_count = 0;

  product.images.push(image1);
  product.images.push(image2);
  product.images.push(image3);
  
  product.save(function(err, user) {
      if(err) return console.log(err);
      else  {
      	console.log("\n New product - model %s, description %s, seller_id: %s, category_id %s, price: %d, units: %d, images: %s", 
      				product.model, product.description, product.seller_id, product.category_id, product.price, product.units, product.images);
      	return product;
      }
  });
}

// User.remove({}, function(err) {
//     var user = new User({ 
//     					userName: "PabloOjeda", 
//     					email: "pb@pb.com",
//     					password: "Test1234",
//     					shop: {
//     						name: "iComplementos",
//     						lat: 40.4254039,
//     						lon: -3.712675499999932
//     					},
//     					twitter: {
//     						name: "@pbojeda"
//     					}
//     				});
    
//     user.save(function(err, user) {
//         if(err) return console.log(err);
//         else console.log("New user - username %s, shopname %s, latlong: %d:%d, twitter %s, id: %s, token: %s", 
//         				user.userName, user.shop.name, user.shop.lat, user.shop.lon, user.twitter.name, user._id, user.token);
//     });

//     user = new User({ 
//     					userName: "RobMarco", 
//     					email: "robmarco@robmarco.com",
//     					password: "Test1234",
//     					shop: {
//     						name: "Diseños Marco",
//     						lat: 40.530541,
//     						lon: -3.638473999999974
//     					},
//     					twitter: {
//     						name: "@robmarco"
//     					}
//     				});
    
//     user.save(function(err, user) {
//         if(err) return console.log(err);
//         else console.log("New user - username %s, shopname %s, latlong: %d:%d, twitter %s, id: %s, token: %s", 
//         				user.userName, user.shop.name, user.shop.lat, user.shop.lon, user.twitter.name, user._id, user.token);
//     });

//     user = new User({ 
//     					userName: "MorenoMiro", 
//     					email: "morenomiro@morenomiro.com",
//     					password: "Test1234",
//     					shop: {
//     						name: "Soy Diferente!!",
//     						lat: 40.5312564,
//     						lon: -3.633631899999955
//     					},
//     					twitter: {
//     						name: "@isamorenomiro"
//     					}
//     				});
    
//     user.save(function(err, user) {
//         if(err) return console.log(err);
//         else console.log("New user - username %s, shopname %s, latlong: %d:%d, twitter %s, id: %s, token: %s", 
//         				user.userName, user.shop.name, user.shop.lat, user.shop.lon, user.twitter.name, user._id, user.token);
//     });

//     user = new User({ 
//     					userName: "BmJuan", 
//     					email: "bjjuan@bmjuan.com",
//     					password: "Test1234",
//     					shop: {
//     						name: "En tus zapatos",
//     						lat: 40.4166635,
//     						lon: -3.7041686999999683
//     					},
//     					twitter: {
//     						name: "@bmjuan"
//     					}
//     				});
    
//     user.save(function(err, user) {
//         if(err) return console.log(err);
//         else console.log("New user - username %s, shopname %s, latlong: %d:%d, twitter %s, id: %s, token: %s", 
//         				user.userName, user.shop.name, user.shop.lat, user.shop.lon, user.twitter.name, user._id, user.token);
//     });

//     user = new User({ 
//     					userName: "Bridita", 
//     					email: "bridita@bridita.com",
//     					password: "Test1234",
//     					shop: {
//     						name: "Collarlandia",
//     						lat: 40.5050578,
//     						lon: -3.67052149999995
//     					},
//     					twitter: {
//     						name: "@bridita"
//     					}
//     				});
    
//     user.save(function(err, user) {
//         if(err) return console.log(err);
//         else console.log("New user - username %s, shopname %s, latlong: %d:%d, twitter %s, id: %s, token: %s", 
//         				user.userName, user.shop.name, user.shop.lat, user.shop.lon, user.twitter.name, user._id, user.token);
//     });

//     user = new User({ 
//     					userName: "MA", 
//     					email: "ma@ma.com",
//     					password: "Test1234",
//     					shop: {
//     						name: "Pum & Pez",
//     						lat: 40.4207923,
//     						lon: -3.701310299999932
//     					},
//     					twitter: {
//     						name: "@lopezpumar"
//     					}
//     				});
    
//     user.save(function(err, user) {
//         if(err) return console.log(err);
//         else console.log("New user - username %s, shopname %s, latlong: %d:%d, twitter %s, id: %s, token: %s", 
//         				user.userName, user.shop.name, user.shop.lat, user.shop.lon, user.twitter.name, user._id, user.token);
//     });

// });
