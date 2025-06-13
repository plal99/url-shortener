require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');
const Url = require('./models/urls');
const app = express();



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.get('/', async(req, res) => {
    const urls = await Url.find();
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    res.render('index', { urls, today, request: req });
});

app.post('/shorten', async(req, res) => {
    const longUrl = req.body.longUrl;
    const shortId = nanoid(7);

    await Url.create({ shortId, longUrl });
    res.redirect('/');
});

app.get('/:shortId', async(req, res) => {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (url) {
        res.redirect(url.longUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

app.post('/delete/:id', async (req, res) => {
  try {
    console.log(req.params);
    await Url.findByIdAndDelete(req.params.id);
    console.log(`Deleted URL with ID: ${req.params.id}`);
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting URL:', err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));