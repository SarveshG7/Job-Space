//const express = require('express')
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoute = require("./routes/userRoutes.js");
const companyRoute = require("./routes/companyRoutes.js");
const jobRoute = require("./routes/jobRoutes.js");
const applicationRoute = require("./routes/applicationRoutes.js");
const path = require("path");



const app = express();

//connecting to database
connectDB();

const _dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'https://job-space-39zi.onrender.com/', // this is for vite
    credentials:true
}
app.use(cors(corsOptions));

dotenv.config();

const port = process.env.PORT || 3000;

//api's 
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

//app.get('/', (req, res) => {
//  res.send('Hello World!')
//})

app.use(express.static(path.join(_dirname, "/FrontEnd/dist")))
app.get('*', (_,res) => {
  res.sendFile(path.resolve(__dirname,"FrontEnd","dist", "index.html"));
})

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})
