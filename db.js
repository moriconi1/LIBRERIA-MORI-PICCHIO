
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;

async function connectDB() {
    const uri = process.env.MONGODB_LINK;
    const client = new MongoClient(uri);

    await client.connect();
    return client.db('bibliotecadata');
}

async function getall(db, resource) {
    const dati = await db.collection(resource).find().toArray();
    return dati;
}

async function getAllUsers(db, resource) {
    const dati = await db.collection(resource).find().toArray();
    return dati;
}

async function getFilteredData(db, resource, filter) {
    const dati = await db.collection(resource).find(filter).toArray();
    return dati;
}

async function addlibro(db, libroData) {
    try {
        const result = await db.collection('libri').insertOne(libroData);
        console.log("book added successfully:", result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error("Error adding book:", error);
        throw error;
    }
}


async function updatelibro(db, libroId, newtitolo, newImage, newautore, newdescrizione) {
    try {
        const result = await db.collection('libri').updateOne(
            { _id: libroId },
            {
                $set: {
                    titolo: newtitolo,
                    immagine: newImage,
                    autore: newauthor,
                    descrizione: newDescription
                }
            }
        );
        console.log("book updated successfully:", result.modifiedCount);
        return result.modifiedCount;
    } catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
}


async function deletelibro(db,libroData) {
    try {
        const result = await db.collection('libri').deleteOne(libroData);
        console.log("book deleted successfully:", result.deletedCount);
        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
    }
}

export { connectDB, getFilteredData, getall, addlibro, deletelibro, getAllUsers, updatelibro };
