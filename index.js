const express = require('express');
const app = express();
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
//doctors-portal-firebase-admin-sdk.json



const serviceAccount = {
    "type": "service_account",
    "project_id": "doctors-portal-3b8db",
    "private_key_id": "f8746ef027c4813a3ff185ce4bc9328141ecd1d0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBsmW/Rewg5/l4\n4DpAfD31ylcz1wAzW1gsE4sp4qu5WG4fZCpzfNLEtMTG1I/G5sPwz8/bWq+WLQH+\nxptB7j2Tnw65g9yXLjhGAFdwFJlXKma8s/uIIEfNFhsXnU9bEEiPf615Hf8aJM+D\naO8M8Cu/HEcPQMUGV57iGi9TFOGnz3TwD9314CtILRpIpYLhIshPOgsXwnMXXE+w\nFHxl5EmH6HKq/hpjobenv2aFBts/sAR/7CEfmo2ocxfFG8H0G7SQAix3RIr844mG\nSRUQg++S3ZeW94YA9Rt5Foiy9HBy+DV7qVc2+rYPSckv6bozv6h5ALNPO53scEBk\nqt5XgPWhAgMBAAECggEACtpkP1gLg6n/1V0qAmo7vgmPAot32kjSW1Diha+q29Un\nwXhHNSafuDAhTPtEzZopTTVVshamG0HtGFGYSjTPTDXXuT8ZVXq8Yja7b38l+ud4\nL3ddvwpA/62vCa8RrtpuGGVI6u4KeNRqcLRo3ZaY+um6lREV4RW4hDZ/o5X6UWDS\nVakEnrKFnBRawi3qLQs1UDZEImXzhe1H4ncKaml7fnVIyL8thJyauFkhjLi+qJRl\npVjf+zhz6YCN8twskR6h2/9bsPWo+wFAUWsu2ppncfwYeENh4hjoFqouHJHLZRyX\n4Ns0sScttLkptyFoQLBDjsj6vbeUPNXED/eFq7U92QKBgQDnH7prBtMaA94nUBaR\nUvCgIo+7+IGybXDYWy3HfpLgTJFGxw+0dPye3ancgH8cPa34qI65rzCV/awrcBi7\nEA6SRO3dpPHY9bDFZukfHYk4PCNMUQGi5ep0kDziHqu8skCWA6Icsi5nTx2sxyoI\ncZL2toS5DsacTbg2Wg5wfKn4iQKBgQDWi2wzLHWkz29IH+0clu1QsVxwqSIi0kfZ\n0ipvDZS1neWz/PYb+tqUWk62SbOGwrQUw96YyBNfd11wo3eB4aQX3uKExpqcKUFL\n5Z3LvAs59NrERcDBKjOjyyjGU1EUPnud8EwRdUT+Oon34DRg1uwT/hrdEkH2C3Ay\nbLpqBZ2eWQKBgQDOlQt5MmZp8F8W4HzrdCjj2UCEEQFMTIn6uLTYhYgeuBF6I98j\nuxU5ooN7NddnlLH1eiPoUHCrAExtnwpb2WRM1ROPcylAdYqFRxDD4RCPlSEvy5Ac\n3EiN24avzh5O0TztWV4DLDhR2uN5VaN6XJmxrz4+criPaOBopGIXpTX/kQKBgQCm\nmiYvpvrEPQEhdQlgBiPLYa9zHSQQ/lIlZ/rjuhwc3LyfhHRpTeenBGnTTHBI2bGV\n3nRhGB1TKRI6gfYvudT/ZGlqyf8N/UtjcK+UojXlj6rCd5gzaF4pd332ZIS1v7+m\n6g9oDzTAZxz0i/qgqMUy0URzH9ZxBnjd72jjI/E+IQKBgF+MLGV50BXv/fcQ0shv\n98sp8EAGl9Xkyvluvng026YiCPeRAztvoHlWIgsjgIA4waD2D51U6CWr9do/N+ZW\nPeDVZEYXp5Qv6P0qdgL3HZLmlWhq7drK2Z4hH7SH3iDG8XxT33y65g+zsckRMN4L\nI/ojU/gCiQ2R36HPq+0Vi/dF\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-9pgyg@doctors-portal-3b8db.iam.gserviceaccount.com",
    "client_id": "107082843995497605942",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9pgyg%40doctors-portal-3b8db.iam.gserviceaccount.com"
};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


app.use(cors());
app.use(express.json());

async function verifyToken(req, res, next) {
    if (req.headers.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }
    }
    next();
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.da9dr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('DB Connected');
        const database = client.db('doctors_portal');
        const appointmentsCollection = database.collection('appointments');
        const usersCollection = database.collection('users');

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            console.log(appointment);
            res.json(result);
        });
        app.get('/appointments', async (req, res) => {
            const email = req.query.email;
            const date = new Date(req.query.date).toLocaleDateString();
            console.log(date);
            const query = { email: email, date: date };
            const cursor = appointmentsCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments);
        });
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(user);
            res.json(result);
        });
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester })
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'You do not have permission' });
            }

        });
    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send("Hello Doctors Portal");
});

app.listen(port, () => {
    console.log('Listening doctors portal from : ', port);
})