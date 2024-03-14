// Module Import
const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const db = require("./db");
const app = express();

// Port Initiate
const port = 3000;

// Middleware & View Engine
app.set("view engine", "ejs");
app.use(expresslayouts);
app.use(express.static("Public"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
// app.use(express.json());0
app.use(express.urlencoded());

// Module & Routing
app.get("/", async (req, res) => {
  const importProducts = await db("products")
    .select("*")
    .orderBy("nama_produk", "asc")
    .limit(5);
  const productRaw = JSON.stringify(importProducts);
  const products = JSON.parse(productRaw);
  res.render("index", {
    title: "Best Home Furniture in Town",
    layout: "layouts/main-layout",
    products,
  });
});

app.get("/add-product",(req,res)=>{
  res.render('add-product',{
    layout : 'layouts/main-layout',
    title : 'Add New Product'
  })
})

app.post('/product-register',async(req,res)=>{
  const {nama_produk,harga,deskripsi,nama_file} = req.body;
  
  await db("products").insert({
    'nama_produk':nama_produk,
    'harga':harga,
    'deskripsi':deskripsi,
    'nama_file':nama_file
  })
  res.redirect('/product-register')
})


app.get("/products", async (req, res) => {
  const importProducts = await db("products")
    .select("*")
    .orderBy("nama_produk", "asc");
  const productRaw = JSON.stringify(importProducts);
  const products = JSON.parse(productRaw);
  res.render("products", {
    title: "Best Home Furniture in Town",
    layout: "layouts/main-layout",
    products,
  });
});

app.get("/product-register", async (req, res) => {
  const importProducts = await db("products")
    .select("*")
    .orderBy("id", "asc");
  const productRaw = JSON.stringify(importProducts);
  const products = JSON.parse(productRaw);
  res.render("product-register", {
    title: "Edit Produk",
    layout: "layouts/main-layout",
    products,
  });
});

// GET Detail product
app.get("/product-register=:id", async (req, res) => {
  const id = req.params.id;
  const importProducts = await db("products")
    .select("*")
    .where("id", id)
    .first();
  const productRaw = JSON.stringify(importProducts);
  const products = JSON.parse(productRaw);
  res.render("product-detail", {
    title: `${products.nama_produk}`,
    layout: "layouts/main-layout",
    products,
  });
});

// Delete product
app.get("/product-register/delete=:id", async (req, res) => {
  const id = req.params.id;
  await db("products").where("id", id).del();
  res.redirect('/product-register')
});

app.use("/", (req, res) => {
  res.render("404", {
    title: "Page Not Found",
    layout: "layouts/main-layout",
  });
});

// App Listener
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
