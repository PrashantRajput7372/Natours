const Review = require("../modals/reviewModal");
const catchAsync = require("../utils/catchAysnc");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const tour = require("../modals/tourModal");
const AppError = require("../utils/appError");

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  //get the currently booked tour
  const pa = req.params;
  console.log(req.user.email, "user");
  console.log(pa, "param");
  const tours = await tour.findById(req.params.tourId);
  console.log(tours.imageCover, "tours");

  // 2. create checkout session
    const imageUrl = `https://natoure-frontend.vercel.app/img/tours/${tours.imageCover.split(".")[0]}.webp`;
    console.log(imageUrl, "imageUrl");
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "crypto", "amazon_pay"],
    mode: "payment",
    success_url: `https://natoure-frontend.vercel.app/tours/payment-success?tourId=${req.params.tourId}&email=${req.user.email}&amount=${tours.price}&tourName=${tours.name}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tours.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tours.name} Tour`,
            description: `${tours.summary}`,
            images: [
              imageUrl,
              // "https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?cs=srgb&dl=pexels-hsapir-1054655.jpg&fm=jpg"
              // "https://natoure-frontend.vercel.app/img/tours/tour-9-cover.webp",
            ],
          },
          unit_amount: tours.price * 100, // in cents, $50
        },
        quantity: 1,
      },
    ],
  });
  // 3. send session as response

  res.status(200).json({
    status: "success",
    session,
    message: "session created",
  });
});
