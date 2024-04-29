
import express from "express";
import cors from "cors";
import {
  connectDB,
  getall,
  getAllUsers,
  getFilteredData,
  addlibro,
  updatelibro,
  deletelibro,
} from "/db.js";

import { MongoClient, ObjectId } from "mongodb";


let db;

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.get("/api/libri", async (req, res) => {
  try {
    const db = await connectDB();
    const libri = await getall(db, "libri");
    res.json(libri);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


async function getUserCredentials(identifier) {
  try {
    const db = await connectDB();
    const loginData = await getAllUsers(db, "datiacc");
    const user = loginData.find((user) => user.identifier === identifier);
    return user;
  } catch (error) {
    throw new Error('Error fetching user: ${error}');
  }
}

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserCredentials(email); // Ottieni le credenziali dell'utente
    if (user && user.password === password) {
      res.status(200).send("AUTHORIZED");
    } else {
      res.status(401).send("UNAUTHORIZED");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/libri/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const result = await deletelibro(db, { _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).send("book not found");
    } else {
      res.status(200).send("book deleted successfully");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});


app.post('/api/libri', async (req, res) => {
  const libridata = req.body; // i dati della scarpa dovrebbero essere inviati nel body della richiesta
  try {
    const db = await connectDB();
    const newlibroId = await addShoe(db, libroData); // aggiunge la scarpa al database e ritorna l'id
    res.status(201).json({ message: "Shoe added successfully", id: newlibroId });
  } catch (error) {
    console.error("Failed to add shoe:", error);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});
