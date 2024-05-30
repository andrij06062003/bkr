const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Парсер тіла запиту
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json()); // Розбір JSON-даних


// Підключення до бази даних MongoDB
const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Підключено до бази даних MongoDB');
    } catch (err) {
        console.error('Помилка підключення до бази даних MongoDB:', err);
    }
}

connectToDatabase().catch(console.error);

// Обробка POST-запиту на реєстрацію

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = client.db('bkr');
        const usersCollection = db.collection('registration');

        // Перевірка чи користувач з таким email і паролем існує
        const user = await usersCollection.findOne({ email, password });
        if (user) {
            console.log('Вхід успішний для користувача з email:', email);
            res.sendStatus(200);
        } else {
            console.error('Невірний email або пароль');
            res.status(400).send('Невірний email або пароль');
        }
    } catch (err) {
        console.error('Помилка при вході користувача:', err);
        res.sendStatus(500);
    }
});

app.post('/add-tech-card', async (req, res) => {
    try {
        const { techCardName, techCardDescription, ingredient, pricePerKg, ingredientWeight, markup } = req.body;

        // Перевірка наявності всіх обов'язкових полів
        const requiredFields = ['techCardName', 'techCardDescription', 'ingredient', 'pricePerKg', 'ingredientWeight', 'markup'];
        const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));

        if (missingFields.length > 0) {
            console.error('Відсутні обов\'язкові поля:', missingFields);
            return res.status(400).send('Відсутні обов\'язкові поля: ' + missingFields.join(', '));
        }

        const db = client.db('bkr');
        const techCardsCollection = db.collection('tech_cards');
        
        // Збереження даних у базі даних
        const result = await techCardsCollection.insertOne({ 
            techCardName, 
            techCardDescription, 
            ingredient, 
            pricePerKg, 
            ingredientWeight, 
            markup 
        });

        if (result && result.insertedId) {
            console.log('Технічна картка додана, ID:', result.insertedId);
            res.status(200).send('Технічна картка успішно додана з ID: ' + result.insertedId);
        } else {
            console.error('Помилка при додаванні технічної картки: Не вдалося отримати інформацію про вставлений документ');
            res.sendStatus(500);
        }
    } catch (err) {
        console.error('Помилка при додаванні технічної картки у базу даних:', err);
        res.sendStatus(500);
    }
});

app.post('/add-product', async (req, res) => {
    try {
        const { name, cost, weight, price,  imageUrl } = req.body;

        // Перевірка наявності всіх обов'язкових полів
        const requiredFields = ['name', 'cost', 'weight', 'price', 'imageUrl'];
        const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));

        if (missingFields.length > 0) {
            console.error('Відсутні обов\'язкові поля:', missingFields);
            return res.status(400).send('Відсутні обов\'язкові поля: ' + missingFields.join(', '));
        }

        const db = client.db('bkr');
        const productsCollection = db.collection('products');
        
        // Збереження даних у базі даних
        const result = await productsCollection.insertOne({ 
            name, 
            cost, 
            weight, 
            price, 
            imageUrl 
        });

        if (result && result.insertedId) {
            console.log('Товар додано, ID:', result.insertedId);
            res.status(200).send('Товар успішно додано з ID: ' + result.insertedId);
        } else {
            console.error('Помилка при додаванні товару: Не вдалося отримати інформацію про вставлений документ');
            res.sendStatus(500);
        }
    } catch (err) {
        console.error('Помилка при додаванні товару у базу даних:', err);
        res.sendStatus(500);
    }
});

app.post('/add-supply', async (req, res) => {
    try {
        const { supplyDate, supplier, payment, comment, products } = req.body;

        // Перевірка наявності всіх обов'язкових полів
        const requiredFields = ['supplyDate', 'supplier', 'payment', 'comment', 'products'];
        const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));

        if (missingFields.length > 0) {
            console.error('Відсутні обов\'язкові поля:', missingFields);
            return res.status(400).send('Відсутні обов\'язкові поля: ' + missingFields.join(', '));
        }

        const db = client.db('bkr');
        const suppliesCollection = db.collection('supplies');
        
        // Збереження даних у базі даних
        const result = await suppliesCollection.insertOne({ 
            supplyDate, 
            supplier, 
            payment, 
            comment, 
            products 
        });

        if (result && result.insertedId) {
            console.log('Постачання додано, ID:', result.insertedId);
            res.status(200).send('Постачання успішно додано з ID: ' + result.insertedId);
        } else {
            console.error('Помилка при додаванні постачання: Не вдалося отримати інформацію про вставлений документ');
            res.sendStatus(500);
        }
    } catch (err) {
        console.error('Помилка при додаванні постачання у базу даних:', err);
        res.sendStatus(500);
    }
});
app.post('/add-salary', async (req, res) => {
    try {
        const { name, position, hours, salary } = req.body;

        // Check for all required fields
        const requiredFields = ['name', 'position', 'hours', 'salary'];
        const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            return res.status(400).send('Missing required fields: ' + missingFields.join(', '));
        }

        // Connect to the database
        const db = client.db('bkr');
        const salariesCollection = db.collection('salaries');
        
        // Save data to the database
        const result = await salariesCollection.insertOne({ 
            name, 
            position, 
            hours, 
            salary 
        });

        if (result && result.insertedId) {
            console.log('Salary added, ID:', result.insertedId);
            res.status(200).send('Salary successfully added with ID: ' + result.insertedId);
        } else {
            console.error('Error adding salary: Failed to get inserted document information');
            res.sendStatus(500);
        }
    } catch (err) {
        console.error('Error adding salary to the database:', err);
        res.sendStatus(500);
    }
});
// Передача клієнту файлу HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});
app.get('/add-tech-card.html', (req, res) => {
    res.sendFile(__dirname + '/add-tech-card.html');
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

// Маршрут для відображення списку всіх технічних карток
app.get('/tech-cards', async (req, res) => {
    try {
        const db = client.db('bkr');
        const techCardsCollection = db.collection('tech_cards');

        // Отримайте всі технічні картки з бази даних
        const techCards = await techCardsCollection.find({}).toArray();

        // Відправте список технічних карток на клієнт
        res.status(200).json(techCards);
    } catch (error) {
        console.error('Помилка при отриманні списку технічних карток:', error);
        res.status(500).json({ error: 'Помилка при отриманні списку технічних карток' });
    }
});

app.get('/supplies', async (req, res) => {
    try {
        const db = client.db('bkr');
        const suppliesCollection = db.collection('supplies');

        // Отримання всіх записів про постачання з бази даних
        const supplies = await suppliesCollection.find({}).toArray();

        // Відправлення списку постачань клієнту
        res.status(200).json(supplies);
    } catch (error) {
        console.error('Помилка отримання списку постачань:', error);
        res.status(500).json({ error: 'Помилка отримання списку постачань' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const db = client.db('bkr');
        const suppliesCollection = db.collection('products');

        // Отримання всіх записів про постачання з бази даних
        const supplies = await suppliesCollection.find({}).toArray();

        // Відправлення списку постачань клієнту
        res.status(200).json(supplies);
    } catch (error) {
        console.error('Помилка отримання списку продуктів:', error);
        res.status(500).json({ error: 'Помилка отримання списку продуктів' });
    }
});

app.get('/salaries', async (req, res) => {
    try {
        const db = client.db('bkr');
        const suppliesCollection = db.collection('salaries');

        // Отримання всіх записів про постачання з бази даних
        const supplies = await suppliesCollection.find({}).toArray();

        // Відправлення списку постачань клієнту
        res.status(200).json(supplies);
    } catch (error) {
        console.error('Помилка отримання списку продуктів:', error);
        res.status(500).json({ error: 'Помилка отримання списку продуктів' });
    }
});





app.get('/add-product.html', (req, res) => {
    res.sendFile(__dirname + '/add-product.html');
});

app.get('/products.html', (req, res) => {
    res.sendFile(__dirname + '/products.html');
});

app.get('/add-supply.html', (req, res) => {
    res.sendFile(__dirname + '/add-supply.html');
});

app.get('/supply.html', (req, res) => {
    res.sendFile(__dirname + '/supply.html');
});

app.get('/leftovers.html', (req, res) => {
    res.sendFile(__dirname + '/leftovers.html');
});

app.get('/rest.html', (req, res) => {
    res.sendFile(__dirname + '/rest.html');
});
app.get('/transaction.html', (req, res) => {
    res.sendFile(__dirname + '/transaction.html');
});
app.get('/salary.html', (req, res) => {
    res.sendFile(__dirname + '/salary.html');
});
app.get('/sales.html', (req, res) => {
    res.sendFile(__dirname + '/sales.html');
});
// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущено на порту ${port}`);
});