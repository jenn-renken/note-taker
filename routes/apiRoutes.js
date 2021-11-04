// const router = require('express').Router();
const fs = require('fs');
const express = require('express');
const app = express();

    app.get('/notes', (req, res) => {
        fs.readFile('./db/db.json', (err, data) => {
            if (err) throw err;
            dbData = JSON.parse(data);
            res.send(dbData);
        });
    });

    app.post('/notes', (req, res) => {
        const input = req.body;

        fs.readFile('./db/db.json', (err, data) => {
            if (err) throw err;
            dbData = JSON.parse(data);
            let maxId = 0;
            dbData.forEach((note, index) => {
                maxId = Math.max(maxId, note.id);
            });
            input.id = maxId + 1;
            dbData.push(input);
            stringData = JSON.stringify(dbData);
            
            fs.writeFile('./db/db.json', stringData, (err, data) => {
                if (err) throw err;
            });
            res.send('Note entered successfully');
        });
    });

    app.delete('/notes/:id', (req, res) => {
        fs.readFile('./db/db.json', (err, data) => {
            if (err) throw err;
            dbData = JSON.parse(data);
            let index = -1;
            const id = +req.params.id;
            for(let i = 0; i < dbData.length && index == -1; i++) {
                let note = dbData[i];
                if (note.id == id) {
                    index = i
                }
            }
            if (index == -1) {
                res.status(400).json({ error: 'could not find note' });
                return;
            }
            dbData.splice(index, 1);

            stringData = JSON.stringify(dbData);
            
            fs.writeFile('./db/db.json', stringData, (err, data) => {
                if (err) throw err;
            });
            res.send('Deleted successfully');
        });
    });

module.exports = app;
