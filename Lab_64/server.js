const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/api', (req, res) => {
    const data = {
        nome: "Servidor Node.js com Express",
        linguagem: "JavaScript",
        uso: "Desenvolvimento Web"
    };
    res.status(200).json(data); // Envia a resposta JSON
});

app.post('/upload', (req, res) => {
    let fileData = '';
    req.on('data', chunk => {
        fileData += chunk.toString();
    });
    req.on('end', () => {
        res.status(200).send('Upload simulado com sucesso!');
    });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'erro404.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});