const express = require("express");
const config = require("../../../config").data
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const verifyJwtToken = require("../../../middleware/verifyJwtToken");
const verifyEmail = require("../../../middleware/verifyEmail");
require("dotenv").config();
const web = express();
const stripe = require("stripe")(process.env.Stripe_Secret_Key);
const { upload_customOrder_files, upload_profile } = require('../../../photosave')
const mailer = require('../../../mailer')
var paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.Pay_Pal_Client_ID,
    'client_secret': process.env.Pay_pal_Client_Secret,
});

async function run() {
    try {
        // Database
        const db = config.db.dbs
        /* ******* Collections **************** */
        const usersCollections = db.collection("users");
        const categoriesCollections = db.collection("categories");
        const productsCollection = db.collection("products");
        const reviewsCollection = db.collection("reviews");
        const invoicesCollection = db.collection("invoices");
        const offersCollection = db.collection("offers");
        const wishlistCollection = db.collection("wishlist");
        const customOrederCollection = db.collection("customOrder");
        const aboutusCollection = db.collection("aboutus");
        const advertbannerCollection = db.collection("advertBanner");
        const bannerCollection = db.collection("bannerImage");
        const catAdvertCollection = db.collection("categoryAdvert");
        const shippingCollection = db.collection("shippingtype");
        const slidersCollection = db.collection("sliders");
        const crystalCollection = db.collection("crystals");
        const crystsalOptionCollection = db.collection("crystalOption");
        /* ************** APIs ********************* */

        /*====================Utils========================= */
        const updateAverageRatings = async (data) => {
            /**
             * Get the product id
             * Fetch all reviews
             * Calculate total review
             * Averaage = total reviews/ number of reviews
             * Get the product from product collection
             * Update the review or upsert it with the avarage calculated
             */

            const targetProductReviews = await reviewsCollection
                .find({
                    productId: data.productId,
                })
                .toArray();

            let average = "0";

            if (targetProductReviews.length) {
                const totalRatings = targetProductReviews.reduce(
                    (prev, curr) => prev + parseFloat(curr.ratings),
                    0
                );

                // calculate avg
                average = (totalRatings / targetProductReviews.length).toFixed(2);
            }
            // Calculate total reviews

            // Update in the product

            productsCollection.updateOne(
                { _id: ObjectId(data.productId) },
                { $set: { ratings: average } },
                { upsert: true }
            );
        };

        const updatePurchase = (orderDetails) => {
            orderDetails.cart.map(async (item) => {
                const { purchases } = await productsCollection.findOne({
                    _id: ObjectId(item.productId),
                });

                const newPurchase = purchases
                    ? parseInt(purchases) + parseInt(item.quantity)
                    : 0 + parseInt(item.quantity);

                productsCollection.updateOne(
                    { _id: ObjectId(item.productId) },
                    {
                        $set: {
                            purchases: newPurchase,
                        },
                    },
                    {
                        upsert: true,
                    }
                );
            });
        };

        /* ================Crete User================== */
        // Create user
        web.post("/users", async (req, res) => {
            const user = req.body;
            user.date = new Date()
            const result = await usersCollections.insertOne(user);

            res.json(result);
        });
        // Create user end

        /* ===============Get JWt=================== */

        /***************
         * Get JWT token for user
         * Find the logged in user in Database in every login
         * Then provide JWT token
         ****************/

        web.get("/jwt", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };

            const user = await usersCollections.findOne(query);
            if (user) {
                const token = jwt.sign({ user }, process.env.JWT_token, {
                    expiresIn: "1d",
                });
                return res.json({ message: "success", token: token });
            }
            return res.status(403).json("Unauthorized Access");
        });

        /* ===============Categories=================== */
        /***********************************************
         *  Get All the Categories which is a public route
         * Should not very jwt token in public routes
         * ********************************************/

        web.get("/categories", async (req, res) => {
            const categories = await categoriesCollections.find().toArray();

            res.json(categories);
        });
        /* ==============Get Products from specic Category==================== */
        web.get("/category/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const categoryQuery = { _id: ObjectId(id) };
                const category = await categoriesCollections.findOne(categoryQuery);
                const { categoryName } = category;
                // Flter query

                const subCat = req.query.subcategory;
                const sort = req.query.sort;

                let query;
                if (subCat === "all") {
                    query = {
                        category: { $regex: "^" + categoryName + "$", $options: "i" },
                    };
                } else {
                    query = {
                        category: categoryName,
                        subCategory: {
                            $regex: "^" + req.query.subcategory + "$",
                            $options: "i",
                        },
                    };
                }
                let options = {};
                if (sort === "ascending") {
                    options = {
                        sort: { price: 1 },
                    };
                } else if (sort === "descending") {
                    options = {
                        sort: { price: -1 },
                    };
                }
                const data = await productsCollection.find(query, options).toArray();
                const dataCount = data.length;
                const result = await productsCollection
                    .find(query, options)
                    .skip(parseInt(req.query.page) * parseInt(req.query.size))
                    .limit(parseInt(req.query.size))
                    .toArray();

                res.json({ result, dataCount });
            } catch (err) {
                console.log(err);
                res.status(400).json("Server Error");
            }
        });

        /* ===============Get Search Results=================== */
        web.get("/search", async (req, res) => {
            const query = {
                // Regex in field to ignore case
                $or: [
                    { tags: { $regex: req.query.query, $options: "i" } },
                    { category: { $regex: "^" + req.query.query + "$", $options: "i" } },
                    { subCategory: { $regex: req.query.query, $options: "i" } },
                    { name: { $regex: req.query.query, $options: "i" } },
                ],
            };

            const sort = req.query.sort;
            let options = {};
            if (sort === "ascending") {
                options = {
                    sort: { price: 1 },
                };
            } else if (sort === "descending") {
                options = {
                    sort: { price: -1 },
                };
            }

            const data = await productsCollection.find(query, options).toArray();
            const dataCount = data.length;
            const result = await productsCollection
                .find(query, options)
                .skip(parseInt(req.query.page) * parseInt(req.query.size))
                .limit(parseInt(req.query.size))
                .toArray();

            res.json({ result, dataCount });
        });

        /* ===============Get A product=================== */
        web.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await productsCollection.findOne(query);

            res.json(result);
        });
        /*=================Get A crystal==================*/
        web.get("/crystal", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await crystalCollection.find().toArray();

            res.json(result);
        });
        web.get("/crystal/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await crystalCollection.findOne(query);

            res.json(result);
        });

        // async getAllcrystalList(req, res, next) {
        //     try {
        //       crystalsCollection.find()
        //         .sort({ date: -1 })
        //         .toArray()
        //         .then((crystal) => {
        //           res.status(200).json({ success: true, crystal });
        //         })
        //         .catch(function (err) {
        //           next(err);
        //         });
        //     } catch (err) {
        //       throw new RequestError("Error");
        //     }
        //   },

        /* ================Get A product review================== */
        web.get("/reviews/:productId", async (req, res) => {
            // Get the prouduct id
            try {
                const id = req.params.productId;
                const query = { productId: id };

                const result = await reviewsCollection.find(query).toArray();

                res.json(result);
            } catch (error) {
                res.status(400).json("Server Error");
            }
        });

        /* ================Create a review================== */
        web.post("/reviews", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const data = req.body;
                const result = await reviewsCollection.insertOne(data);
                // Update Average
                updateAverageRatings(data);
                res.json(result);
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });

        /* ================Edit a review================== */
        /**
         * Find the review
         * If review exist set the updated data
         * Verify review email with request email also for extra safety
         */
        web.patch(
            "/reviews/:reviewId",
            verifyJwtToken,
            verifyEmail,
            async (req, res) => {
                try {
                    const data = req.body;
                    const reviewId = req.params.reviewId;
                    // to find the target review
                    const filter = {
                        _id: ObjectId(reviewId),
                        userEmail: req.query.email,
                    };

                    // Updated data
                    const updateData = {
                        $set: {
                            review: data.review,
                            ratings: data.ratings,
                        },
                    };
                    // update
                    const result = await reviewsCollection.updateOne(filter, updateData);

                    // Update average
                    // Fetch the review
                    const review = await reviewsCollection.findOne({
                        _id: ObjectId(reviewId),
                    });
                    // Send that review as data
                    updateAverageRatings(review);

                    res.json(result);
                } catch (err) {
                    res.status(400).json("Server Error");
                }
            }
        );

        /* ===============Delete a Review=================== */
        web.delete(
            "/reviews/:reviewId",
            verifyJwtToken,
            verifyEmail,
            async (req, res) => {
                try {
                    const query = {
                        _id: ObjectId(req.params.reviewId),
                        userEmail: req.query.email,
                    };
                    /**
                     * Fetch review
                     * Then delete
                     * Then update
                     * */

                    const review = await reviewsCollection.findOne({
                        _id: ObjectId(req.params.reviewId),
                    });

                    const result = await reviewsCollection.deleteOne(query);

                    // Update average
                    updateAverageRatings(review);

                    res.json(result);
                } catch (error) {
                    res.status(400).json("Server Error");
                }
            }
        );

        /* ===============Get shopping cart items=================== */
        /**
         * Get the cart id's from body
         * Find the proudcts that mathces up those ids
         * return the result array
         * */

        web.post("/shopping-cart", async (req, res) => {
            try {
                const cartItems = req.body;
                const cart = [];
                for (const id in cartItems) {
                    const query = { _id: ObjectId(id) };

                    const item = await productsCollection.findOne(query);
                    if (item) {
                        cart.push(item);
                    }
                }

                res.json(cart);
            } catch (err) {
                console.log(err);
                res.status(400).json("Server Error");
            }
        });

        web.post("/crystal-cart", async (req, res) => {
            try {
                const crystalItems = req.body;
                const crystal = [];
                for (const id in crystalItems) {
                    const query = { _id: ObjectId(id) };

                    const item = await crystalCollection.findOne(query);
                    if (item) {
                        crystal.push(item);
                    }
                }

                res.json(crystal);
            } catch (err) {
                console.log(err);
                res.status(400).json("Server Error");
            }
        });

        web.post("/wishlist-cart", async (req, res) => {
            try {
                const wishlistItems = req.body;
                const wishlist = [];
                for (const id in wishlistItems) {
                    const query = { _id: ObjectId(id) };

                    const item = await productsCollection.findOne(query);
                    wishlist.push(item);
                }
                res.json(wishlist);
            } catch (err) {
                console.log(err);
                res.status(400).json("Server Error");
            }
        });

        /*======================wishlist=====================*/

        web.post("/wishlist-cart", async (req, res) => {
            try {
                const wishlistItems = req.body;
                const wishlist = [];
                for (const id in wishlistItems) {
                    const query = { _id: ObjectId(id) };

                    const item = await productsCollection.findOne(query);
                    wishlist.push(item);
                }
                res.json(wishlist);
            } catch (err) {
                console.log(err);
                res.status(400).json("Server Error");
            }
        });

        web.post("/getWishlist", async (req, res) => {
            try {
                const data = req.body;
                const result = await wishlistCollection.findOne({ user: data.user });
                res.json(result);
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        web.post("/addWishlist", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const data = req.body;
                const find = await wishlistCollection.findOne({ user: data.user })
                if (find) {
                    const result = await wishlistCollection.updateOne(
                        { user: data.user },
                        { $set: { wishlistCart: data.wishlistCart } },
                        { upsert: true });
                    res.json(result);
                }
                else {
                    const result = await wishlistCollection.insertOne(data);
                    res.json(result);
                }
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        web.post("/removeWishlist", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const data = req.body;
                const find = await wishlistCollection.findOne({ user: data.user })
                if (find && Object.keys(data.wishlistCart).length) {
                    const result = await wishlistCollection.updateOne(
                        { user: data.user },
                        { $set: { wishlistCart: data.wishlistCart } },
                        { upsert: true });
                    res.json(result);
                }
                else {
                    const result = await wishlistCollection.deleteOne({ user: data.user });

                    res.json(result);
                }
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });

        /* ================Create Payment================== */
        web.post(
            "/create-payment-intent",
            verifyJwtToken,
            verifyEmail,
            async (req, res) => {
                try {
                    const { grandTotal } = req.body;
                    const amount = grandTotal * 100;

                    // Create a PaymentIntent with the order amount and currency
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: amount,
                        currency: "usd",
                        automatic_payment_methods: {
                            enabled: true,
                        },
                    });
                    res.json({
                        clientSecret: paymentIntent.client_secret,
                    });
                } catch (error) {
                    res.status(400).json("Server Error");
                }
            }
        );
        web.post(
            "/create-payment-intent-paypal",
            verifyJwtToken,
            verifyEmail,
            async (req, res) => {
                try {
                    var payment = {
                        'intent': 'sale',
                        'payer': {
                            'payment_method': 'paypal'
                        },
                        'redirect_urls': {
                            'return_url': 'http://localhost:3000/success',
                            'cancel_url': 'http://localhost:3000/cancel'
                        },
                        'transactions': [{
                            'amount': {
                                'total': '10.00',
                                'currency': 'USD'
                            },
                            'description': 'This is the payment description.'
                        }]
                    };

                    paypal.payment.create(payment, function (error, payment) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(payment);
                            // Redirect the user to PayPal to complete the payment
                            var redirectUrl;
                            for (var i = 0; i < payment.links.length; i++) {
                                var link = payment.links[i];
                                if (link.method === 'REDIRECT') {
                                    redirectUrl = link.href;
                                }
                            }
                            res.redirect(redirectUrl);
                        }
                    });

                } catch (error) {
                    res.status(400).json("Server Error");
                }
            }
        );
        web.post("/excute-payment-intent-paypal",
            verifyJwtToken,
            verifyEmail, async (req, res) => {
                const payerId = req.query.PayerID;
                const paymentId = req.query.paymentId;

                const execute_payment_json = {
                    payer_id: payerId,
                    transactions: [
                        {
                            amount: {
                                currency: "USD",
                                total: "10.00",
                            },
                        },
                    ],
                };

                paypal.payment.execute(paymentId, execute_payment_json, function (
                    error,
                    payment
                ) {
                    if (error) {
                        console.log(error.response);
                        throw error;
                    } else {
                        console.log(JSON.stringify(payment));
                        res.redirect("/success");
                    }
                });
            })

        web.get("/cancle-payment-intent-paypal", verifyJwtToken, verifyEmail, (req, res) => {
            res.redirect("/cancel");
        })

        /* ================ Place Payment Details/order ================== */
        web.post("/invoices", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const { orderDetails } = req.body;

                const result = await invoicesCollection.insertOne(orderDetails);

                // Update purchase
                updatePurchase(orderDetails);

                res.json(result);
            } catch (err) {
                res.status(400).json("Server Error");
            }
        });
        web.post("/customOrder", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                console.log(req.body)
                console.log(req.files)
                const {
                    firstname, lastname, email, phone, address, city, country, zip,
                    paymentMethod, shippingOption, size, rush, LED, line, text, font,
                    keychane, cleaningKit, background, invoiceId, shippingCost, crystal,
                    status, invoice, transactionId
                } = req.body;
                customOrederCollection.insertOne({
                    invoiceId: invoiceId,
                    address: address,
                    city: city,
                    status: status,
                    country: country,
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                    phone: phone,
                    zip: zip,
                    paymentMethod: paymentMethod,
                    shippingOption: shippingOption,
                    shippingCost: shippingCost,
                    invoice: invoice,
                    transactionId: transactionId,
                    crystal: JSON.parse(crystal),
                    custom: {
                        size: size,
                        rush: rush,
                        LED: LED,
                        line: line,
                        text: text,
                        font: font,
                        keychane: keychane,
                        cleaningKit: cleaningKit,
                        background: background
                    },
                    date: new Date(),
                    image: req.files
                        ?
                        req.files.file.name
                        : "no image",
                })
                    .then((customOrder) => {
                        if (req.files) {
                            upload_customOrder_files(req, function (err, result) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    //send email to the owner
                                    // mailer.sendCustomOrderFromCustomer({ email: email, description: description, orderId: orderId })
                                    res.status(200).json(customOrder);
                                }
                            });
                        } else {
                            //use mailer hear to send email to the owner
                            res.status(200).json(customOrder);
                        }
                    })
                    .catch(function (err) {
                        next(err);
                    });
            } catch (err) {
                throw new RequestError("Error");
            }
        });
        web.get("/customOrders", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const result = await customOrederCollection
                    .find({ email: req.query.email })
                    .skip(parseInt(req.query.page) * parseInt(req.query.size))
                    .limit(parseInt(req.query.size))
                    .toArray();

                res.json(result);
            } catch (err) {
                res.status(400).json("Server Error");
            }
        });

        web.get("/customOrders/:uid", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const query = { orderId: req.params.uid };

                const result = await customOrederCollection.findOne(query);

                res.json(result);
            } catch (error) {
                res.status(400).json("Server Error");
            }
        });
        web.post("/profileupdate", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                if (req.files) {
                    upload_profile(req, function (err, result) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.status(200).json(result);
                        }
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        msg: "File not found",
                    });
                }

            } catch (err) {
                throw new RequestError("Error");
            }
        });

        // web.post("/invoices/v2", verifyJwtToken, verifyEmail, async (req, res) => {
        //   try {
        //     const { orderDetails } = req.body;
        //     // const result = await invoicesCollection.insertOne(orderDetails);

        //     // Update purchase
        //     orderDetails.cart.map(async (item) => {
        //       const { purchases } = await productsCollection.findOne({
        //         _id: ObjectId(item.productId),
        //       });

        //       const newPurchase = purchases
        //         ? parseInt(purchases) + parseInt(item.quantity)
        //         : 0 + parseInt(item.quantity);

        //       productsCollection.updateOne(
        //         { _id: ObjectId(item.productId) },
        //         {
        //           $set: {
        //             purchases: newPurchase,
        //           },
        //         },
        //         {
        //           upsert: true,
        //         }
        //       );
        //     });

        //     // res.json(result);
        //   } catch (err) {
        //     res.status(400).json("Server Error");
        //   }
        // });

        /* =================Get A invoice=================== */
        web.get("/invoices/:uid", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const query = { invoiceId: req.params.uid };

                const result = await invoicesCollection.findOne(query);

                res.json(result);
            } catch (error) {
                res.status(400).json("Server Error");
            }
        });

        /* ================Get All the invoices of a user================== */
        web.get("/invoices", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const result = await invoicesCollection
                    .find({ email: req.query.email })
                    .skip(parseInt(req.query.page) * parseInt(req.query.size))
                    .limit(parseInt(req.query.size))
                    .toArray();

                res.json(result);
            } catch (err) {
                res.status(400).json("Server Error");
            }
        });

        /* =============== Get All the offers=================== */
        web.get("/offers", async (req, res) => {
            try {
                const size = req.query.size;

                const result = await offersCollection.find()
                    .sort({ date: -1 })
                    .limit(parseInt(size))
                    .toArray();
                res.json(result);
            } catch (error) {
                res.status(400).json("Server Error");
            }
        });
        /* =============== Get latest Discounted products================= */
        web.get("/discounts", async (req, res) => {
            try {
                const result = await productsCollection
                    .find({
                        discount: { $exists: true },
                    })
                    .limit(12)
                    .toArray();

                res.json(result);
            } catch (err) {
                res.status(400).json("Server Error");
            }
        });

        /* ============== Check Coupon Velidity==================== */
        web.post("/offers", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const query = { coupon: req.body.coupon };
                const coupon = await offersCollection.findOne(query);

                if (coupon) {
                    /**
                     * Chekck if coupon code is expired or not
                     */
                    if (new Date(coupon.expiresIn).getTime() > new Date().getTime()) {
                        return res.json({
                            message: "Valid",
                            discount: coupon.discount,
                            leastAmount: coupon.leastAmount,
                        });
                    } else {
                        return res.json({ message: "Expired" });
                    }
                } else {
                    return res.json({ message: "Invalid" });
                }
            } catch (err) {
                res.status(400).json("Server Error");
            }
        });

        /* ===============Get Popular products =================== */
        web.get("/products/popular", async (req, res) => {
            try {
                const result = await productsCollection
                    .find({ purchases: { $exists: true } }, { sort: { purchases: -1 } })
                    .limit(12)
                    .toArray();

                res.json(result);
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        web.post("/feedback", async (req, res) => {
            try {
                const emailData = req.body
                //write code here that send email to the client 
                console.log("================================")
                console.log(emailData)
                console.log("================================")
                mailer.sendFeedback(emailData);
                res.status(200).json({ 'success': true, msg: "Successfully Sent Email" });
            }
            catch (err) {
                res.status(500).json({ 'errors': "" + err });
            }
        });
        web.post("/customEmail", verifyJwtToken, verifyEmail, async (req, res) => {
            try {
                const emailData = req.body
                //write code here that send email to the client 
                console.log("================================")
                console.log(emailData)
                console.log("================================")
                mailer.sendCustomOrderFromCustomer(emailData);
                res.status(200).json({ 'success': true, msg: "Successfully Sent Email" });
            }
            catch (err) {
                res.status(500).json({ 'errors': "" + err });
            }
        });
        /* ================Setting Api================== */
        web.get("/setting/aboutus", async (req, res) => {
            try {
                aboutusCollection.findOne()
                    .then((aboutus) => {
                        res.status(200).json(aboutus);
                    })
                    .catch(function (err) {
                        next(err);
                    });
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        web.get("/setting/advertbanner", async (req, res) => {
            try {
                advertbannerCollection.findOne()
                    .then((advertbanner) => {
                        res.status(200).json(advertbanner);
                    })
                    .catch(function (err) {
                        next(err);
                    });
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        web.get("/setting/banner", async (req, res) => {
            try {
                bannerCollection.findOne()
                    .then((banner) => {
                        res.status(200).json(banner);
                    })
                    .catch(function (err) {
                        next(err);
                    });
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        web.get("/setting/category", async (req, res) => {
            try {
                catAdvertCollection.findOne()
                    .then((category) => {
                        res.status(200).json(category);
                    })
                    .catch(function (err) {
                        next(err);
                    });
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        web.get("/setting/shipping", async (req, res) => {
            try {
                shippingCollection.findOne()
                    .then((shipping) => {
                        res.status(200).json(shipping);
                    })
                    .catch(function (err) {
                        next(err);
                    });
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        web.get("/setting/slider", async (req, res) => {
            try {
                slidersCollection.findOne()
                    .then((slider) => {
                        res.status(200).json(slider);
                    })
                    .catch(function (err) {
                        next(err);
                    });
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        web.get("/setting/crystalOption", async (req, res) => {
            try {
                crystsalOptionCollection.findOne()
                    .then((crystalOption) => {
                        res.status(200).json(crystalOption);
                    })
                    .catch(function (err) {
                        next(err);
                    });
            } catch (error) {
                console.log(error);
                res.status(400).json("Server Error");
            }
        });
        /* ================================== */
        /* ================================== */
        /* ================================== */
        /* ================================== */

        /* ================================== */
        /* ************** APIs ********************* */
    } finally {
    }
}
run().catch(console.dir);

module.exports = { web }