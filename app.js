import express from 'express';
    import { MongoClient } from "mongodb";
    import dotenv from 'dotenv';
    import cors from 'cors';

    const app = express();
    const port = 3001;

    app.use(cors());
    dotenv.config();
    app.use(express.json());

    // Connessione al database MongoDB
    async function connectDB() {
        const uri = process.env.MONGODB_URI;
        const client = new MongoClient(uri);
        try {
            await client.connect();
            console.log("Connessione al database effettuata con successo");
            return client.db('bibliotecadata');
        } catch (error) {
            console.error("Errore durante la connessione al database:", error);
            throw error;
        }
    }

    //funzione per la get di tutte le case per rendere il codice piu pulito 

    async function getData(db, resource, query) {
        const dati = await db.collection(resource).find(query).toArray();
        return dati;
    }

    //funzione per la get delle case per id per rendere il codice piu pulito 

    async function getPropertyById(db, id) {
        const result = await db.collection('libri').findOne({ "libri.id": id });
        return result ? result.immobili.find(property => property.id === id) : null;
    }

    /*per la funzione di inserimento dei dati ho pensato che il nuovo elemento aggiunto debba esser messo dentro 
    l'array immobili e gli deve essere assegnato il primo id disponibile  */

    //funzione per la post per rendere il codice piu pulito 

    async function insertData(db, resource, data) {
        const maxIdResult = await db.collection(resource).aggregate([
            { $unwind: "$libri" },
            { $group: { _id: null, maxId: { $max: "$libri.id" } } }
        ]).toArray();
        
        let maxId = 0;
        if (maxIdResult.length > 0 && maxIdResult[0].maxId !== null) {
            maxId = maxIdResult[0].maxId;
        }
        
        const newId = maxId + 1;
        data = { id: newId, ...data };

        const newData = {
            $push: {
                immobili: {
                    $each: [data],
                }
            }
        };

        const result = await db.collection(resource).updateMany(
            {},
            newData
        );
        return result;
    }

    //funzione per la delete per rendere il codice piu pulito 

    async function deleteData(db, resource, id) {
        const result = await db.collection(resource).updateOne(
            {},
            { $pull: { "libri": { "id": id } } }
        );
        return result;
    }

    //funzione per la put per rendere il codice piu pulito 

    async function updateLibro(id) {
        const client = new MongoClient(uri, options);
      
        try {
          await client.connect();
      
          const db = client.db(bibliotecadata);
          const collection = db.collection('libri');
      
          // ID del documento da modificare
          const documentId = 'id';
      
          // Nuovi valori da assegnare al documento
          const newValues = {
            $set: {
              nome: 'nuovo_valore1',
              descrizione: 'nuovo_valore2',
              autore: 'nuovo_valore2',
              // Aggiungi altri campi da modificare se necessario
            }
          };
      
          // Eseguire l'operazione di aggiornamento
          const result = await collection.updateOne(
            { _id: ObjectID(documentId) },
            newValues
          );
      
          console.log(`${result.matchedCount} documento/i trovato/i`);
          console.log(`${result.modifiedCount} documento/i modificato/i`);
        } catch (error) {
          console.error('Errore durante l\'aggiornamento del documento:', error);
        } finally {
          // Chiudi la connessione
          await client.close();
        }
      }
    app.get('/libri', async (req, res) => {
        try {
            const db = await connectDB();

            const caseData = await getData(db, 'libri');

            res.json(caseData);
        } catch (error) {
            console.error("Errore durante il recupero dei dati di tutte le case", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });


    app.get('/libri/:id', async (req, res) => {
        try {
            const db = await connectDB();
            const id = parseInt(req.params.id);

            const property = await getPropertyById(db, id);

            if (property) {
                res.json(property);
            } else {
                res.status(404).json({ error: "libro non trovato" });
            }
        } catch (error) {
            console.error("Errore durante il recupero del libro:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    

    app.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const db = await connectDB();
            const admin = await db.collection('Credenziali-di-accesso').findOne({ username });

            if (!admin || admin.password !== password) {
                return res.status(401).json({ error: 'Credenziali non valide' });
            }

            res.json({ message: 'Accesso amministratore riuscito' });
        } catch (error) {
            console.error("Errore durante l'autenticazione:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    async function authenticateAdmin(req, res, next) {
        try {
            
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Basic ')) {
                return res.status(401).json({ error: 'Credenziali non fornite' });
            }
    
            const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
            const [username, password] = credentials.split(':');
    
            const db = await connectDB();
            const admin = await db.collection('Credenziali-di-accesso').findOne({ username });
    
            if (!admin || admin.password !== password) {
                return res.status(401).json({ error: 'Credenziali non valide' });
            }
    
            next(); 
        } catch (error) {
            console.error("Errore durante l'autenticazione:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    


    app.post('/libri',  authenticateAdmin, async (req, res) => {
        try {
            const db = await connectDB();

            const newProperty = req.body; 

            const result = await insertData(db, 'libri', newProperty);

            res.json({ message: "libro aggiunto con successo", insertedId: result.insertedId });
        } catch (error) {
            console.error("Errore durante l'inserimento", error);
        }
    });

    app.delete('/libri/:id',  authenticateAdmin, async (req, res) => {
        try {
            const db = await connectDB();
            const id = parseInt(req.params.id);
            const result = await deleteData(db, 'libri', id);
            res.json({ message: "libro eliminato con successo", deletedCount: result.deletedCount });
        } catch (error) {
            console.error("Errore durante l'eliminazione del libro:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    app.put('/libri/:id',  authenticateAdmin, async (req, res) => {
        try {
            const db = await connectDB();
            const id = parseInt(req.params.id);
            const newData = req.body;

            newData.id = id;

            const result = await updateProperty(db, id, newData);

            if (result.modifiedCount === 1) {
                res.json({ message: "libro aggiornato con successo" });
            } else {
                res.status(404).json({ error: "libro non trovato" });
            }
        } catch (error) {
            console.error("Errore durante l'aggiornamento del libro:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    app.get('/immagini/:id', async (req, res) => {
        const idImmagine = req.params.id;
      
        const client = new MongoClient(uri, options);
      
        try {
          await client.connect();
      
          const db = client.db(bibliotecadata);
          const collezione = db.collection('libri');
      
          // Trova l'immagine nel database utilizzando l'ID fornito
          const immagine = await collezione.findOne({ _id: ObjectID(idImmagine) });
      
          if (!immagine) {
            // Se l'immagine non viene trovata, restituisci un errore 404
            res.status(404).send('Immagine non trovata');
            return;
          }
      
          // Imposta l'intestazione Content-Type come tipo di immagine appropriato (es. 'image/jpeg')
          res.set('Content-Type', immagine.contentType);
      
          // Invia i dati dell'immagine come corpo della risposta
          res.send(immagine.data);
        } catch (error) {
          console.error('Errore durante il recupero dell\'immagine:', error);
          // In caso di errore, restituisci un errore 500
          res.status(500).send('Errore interno del server');
        } finally {
          // Chiudi la connessione al database
          await client.close();
        }
      });
    
    

    app.listen(port, () => {
        console.log(Server in ascolto sulla porta ${port});
    });
