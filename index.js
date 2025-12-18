const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");

// firebase
const serviceAccount = require("./decoration-booking-system-5-firebase-adminsdk-fbsvc-7bd68140dc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// middlewares
app.use(cors());
app.use(express.json());

//verify firebase token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.decodedEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

// connect to mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.leame9e.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const db = client.db("style_decor_db");

    const usersCollection = db.collection("users");
    const servicesCollection = db.collection("services");
    const bookingsCollection = db.collection("bookings");
    const paymentsCollection = db.collection("payments");
    const decoratorsCollection = db.collection("decorators");

    // verify admin middleware
    const verifyAdmin = async (req, res, next) => {
      const email = req.decodedEmail;
      const user = await usersCollection.findOne({ email });
      if (!user || user.role !== "admin") {
        return res.status(403).send({ message: "Forbidden" });
      }
      next();
    };

    // verify decorator middleware
    const verifyDecorator = async (req, res, next) => {
      const email = req.decodedEmail;
      const user = await usersCollection.findOne({ email });
      if (!user || user.role !== "decorator") {
        return res.status(403).send({ message: "Forbidden" });
      }
      next();
    };

    // users api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const exists = await usersCollection.findOne({ email: user.email });
      if (exists) return res.send({ message: "User already exists" });

      user.role = "user";
      user.createdAt = new Date();
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users/:email/role", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send({ role: user?.role || "user" });
    });

    app.get("/users", verifyFirebaseToken, verifyAdmin, async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    // services apis
    app.get("/services", async (req, res) => {
      const { search, category, min, max, limit } = req.query;
      const query = {};

      if (search) {
        query.service_name = { $regex: search, $options: "i" };
      }
      if (category) {
        query.category = category;
      }
      if (min && max) {
        query.cost = { $gte: Number(min), $lte: Number(max) };
      }

      let cursor = servicesCollection.find(query);
      if (limit) cursor = cursor.limit(Number(limit));

      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const service = await servicesCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(service);
    });

    app.post(
      "/services",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        const service = req.body;
        service.createdByEmail = req.decodedEmail;
        service.createdAt = new Date();
        const result = await servicesCollection.insertOne(service);
        res.send(result);
      }
    );

    app.patch(
      "/services/:id",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        const result = await servicesCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body }
        );
        res.send(result);
      }
    );

    app.delete(
      "/services/:id",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        const result = await servicesCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        res.send(result);
      }
    );

    // bookings apis
    app.post("/bookings", verifyFirebaseToken, async (req, res) => {
      const booking = req.body;
      booking.userEmail = req.decodedEmail;
      booking.status = "Pending";
      booking.createdAt = new Date();
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
      console.log(result);
    });

    app.get("/bookings", verifyFirebaseToken, async (req, res) => {
      const email = req.query.email;
      const query = email ? { userEmail: email } : {};
      if (email && email !== req.decodedEmail) {
        return res.status(403).send({ message: "Forbidden" });
      }
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });

    app.patch(
      "/bookings/:id/status",
      verifyFirebaseToken,
      verifyDecorator,
      async (req, res) => {
        const { status } = req.body;
        const result = await bookingsCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { status } }
        );
        res.send(result);
      }
    );

    // created decorators api
    app.get("/decorators/top", async (req, res) => {
      const decorators = await decoratorsCollection
        .find({ approved: true })
        .sort({ rating: -1 })
        .limit(8)
        .toArray();
      res.send(decorators);
    });

    app.post(
      "/decorators",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        const decorator = req.body;
        decorator.approved = false;
        decorator.createdAt = new Date();
        const result = await decoratorsCollection.insertOne(decorator);
        res.send(result);
      }
    );

    app.patch(
      "/decorators/:id/approve",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const decorator = await decoratorsCollection.findOne({
          _id: new ObjectId(id),
        });

        await usersCollection.updateOne(
          { email: decorator.email },
          { $set: { role: "decorator" } }
        );

        const result = await decoratorsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { approved: true } }
        );
        res.send(result);
      }
    );

    // payment related apis
    app.post("/create-payment-intent", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: booking.serviceName,
              },
              unit_amount: booking.amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: booking.userEmail,

        metadata: {
          bookingId: booking.bookingId,
        },
        success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancel`,
      });

      res.send({ url: session.url });
    });

    app.patch("/payment-success", async (req, res) => {
      const session = await stripe.checkout.sessions.retrieve(
        req.query.session_id
      );

      if (session.payment_status !== "paid") {
        return res.send({ success: false });
      }
      console.log(session.metadata);
      const bookingId = session.metadata.bookingId;
      const transactionId = session.payment_intent;
      const existingPayment = await paymentsCollection.findOne({
        transactionId,
      });

      if (existingPayment) {
        return res.send({ success: true, message: "Payment already recorded" });
      }

      await bookingsCollection.updateOne(
        { _id: new ObjectId(bookingId) },
        {
          $set: {
            payment_status: "paid",
            paidAt: new Date(),
          },
        }
      );

      await paymentsCollection.insertOne({
        bookingId: bookingId,
        transactionId: session.payment_intent,
        amount: session.amount_total / 100,
        email: session.customer_email,
        paidAt: new Date(),
      });

      res.send({ success: true });
    });

    app.get("/payments", verifyFirebaseToken, async (req, res) => {
      const email = req.query.email;
    
      if (email !== req.decodedEmail) {
        return res.status(403).send({ message: "Forbidden" });
      }
    
      const payments = await paymentsCollection
        .find({ email })
        .sort({ paidAt: -1 })
        .toArray();
    
      res.send(payments);
    });
    

    // services categories
    app.get("/services-categories", async (req, res) => {
      const categories = await servicesCategoriesCollection.find().toArray();
      res.send(categories);
    });

    console.log("StyleDecor server connected");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("StyleDecor Server Running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
