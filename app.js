import express from 'express';
import cors from 'cors';
import {connectDB, getall , getFilteredData} from './db.js';

let db;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/libreria', async (req, res) => {
    try {
        const db = await connectDB();
        const shoes = await getall(db, 'libri');
        res.json(libri);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port ",$,{PORT});
});

/*(async () => {
    try {

        db = await connectDB();

        // delete shoes
        let filterDeleteShoe = { model: 'Nike Air Force 1 Low White 07' }
        const removeShoe = await deleteShoe(db, filterDeleteShoe);

    } catch (error) {
        console.error("Error:", error);
    }
})();*/
