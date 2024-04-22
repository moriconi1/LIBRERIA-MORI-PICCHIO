import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

let db;
async function connectDB() {
    const url = process.env.MONGODB_URL;
    const client = new MongoClient(url);//creazione classe 
    try {
        await client.connect();//connessione al claster
        return client.db('bibliotecadata');//connessione allo specifico database 'biblioteca'
    } catch (error) {
        console.error(error)
    }
}
async function getallDati(db, resource) {
    const dati = await db.collection(resource).find().toArray();
    return dati;
}
try {
    db = await connectDB();
    console.log("connessione effettuata");
} catch (error) {
    console.error(error);
}
const data = await getallDati(db,'libri');
console.log(data);
data[0].macchine.forEach(element => {
    console.log(element.modello);
});

async function getFilterData (db, resource, filter){
    const dati = await db.collection(resource).find(filter).toArray();
    return dati;
}
try {
    db = await connectDB();
    console.log("connessione effettuata");
} catch (error) {
    console.error(error);
}
const Filterdata = await getFilterData(db,'libri',{titolo : "In nome della libertà. La forza delle idee di Silvio Berlusconi"});
console.log(Filterdata);


//come visualizzare tutti i modellli di macchine