const express = require('express')
const env = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

// environment variable or you can say constants
const app = express()
env.config()
app.use(express.json())
// app.use(bodyParser())
app.use(cors())

// mongoose Databases connection string
mongoose.connect(
  // 'mongodb://localhost:27017/baazar', 
  'mongodb+srv://root:root@cluster0.a0xhf.mongodb.net/inBaazaar?retryWrites=true&w=majority',
  {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
  }
).then(() => {
  console.log('Databases Connected.')
})

// 
// app.get("/", (req, res) => {
//     res.status(200).json({ message: 'Welcome, server side.' })
// });

// routes
const authRoutes = require('./routes/auth')
const adminAuthRoutes = require('./routes/admin/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const initialDataRoutes = require('./routes/admin/initialData')
const pageRoutes = require('./routes/admin/page')
const addressRoutes = require("./routes/address")
const orderRoutes = require("./routes/order")
const adminOrderRoute = require("./routes/admin/order.routes")

// api
app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use('/api', authRoutes)
app.use('/api', adminAuthRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)
app.use('/api', initialDataRoutes)
app.use('/api', pageRoutes)
app.use("/api", addressRoutes)
app.use("/api", orderRoutes)
app.use("/api", adminOrderRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})