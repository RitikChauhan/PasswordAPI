(async () => {
    const express = require('express');
    const bodyParser = require('body-parser');

    const { connectDB, sequelize, User, Site } = require('./dbConnection');

    const app = express();

    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

    connectDB();

    await sequelize.sync({ force: true });

    let isLoggedIn = false;

    // Signup route
    app.post('/app/user', async (req, res) => {
        const { username, password } = req.body;

        // Create user account
        const user = await User.create({ username, password });

        res.send({status: 'Account Created!', userId: user.userId});
    });

    // Login route
    app.post('/app/user/auth', async (req, res) => {
        const { username, password } = req.body;

        // Check user credentials
        const user = await User.findOne({ username });
        if(user) {
            if(user.password === password) {
                isLoggedIn = true;
                res.send('Logged In');
            }
            res.statusCode = 404;
            res.send('Not Authorised!');
        }

    });

    app.get('/app/sites/list/:user', async (req, res) => {
        if(!isLoggedIn) {
            res.statusCode = 404;
            res.send('Not Authorised!');
        }

        // Fetch details from database
        const { userId } = req.params;
        const sites = await Site.findAll({ userId });
        if(sites) {
            res.send({sites});
        }

    });

    app.post('/app/sites/:user', async (req, res) => {
        if(!isLoggedIn) {
            res.statusCode = 404;
            res.send('Not Authorised!');
        }
        const { userId } = req.params;
        const { website, username, password } = req.body;

        // Add details to the database
        const site = await Site.create({ username, website, userId, password });
        if(site) {
            res.send('Added successfully');
        }
    });

    app.listen(3000, () => {
        console.log('Server running on port 3000');
    })
})();
