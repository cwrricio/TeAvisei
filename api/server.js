const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuração do Multer para o upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Configuração do Multer para os diferentes campos de imagem
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5 MB
}).fields([
    { name: 'imagem-basico', maxCount: 1 },
    { name: 'imagem-recomendado', maxCount: 3 },
    { name: 'imagem-completo', maxCount: 5 }
]);

// Endpoint para gerar contadores
app.post('/api/contadores', (req, res) => {
    upload(req, res, async function (err) {
        console.log('Campos recebidos:', req.body); // Log dos campos de texto
        console.log('Arquivos recebidos:', req.files); // Log dos arquivos recebidos
        
        if (err instanceof multer.MulterError) {
            console.error('Erro de upload (Multer):', err.message);
            return res.status(400).json({ erro: `Erro de upload: ${err.message}` });
        } else if (err) {
            console.error('Erro inesperado no upload:', err.message);
            return res.status(500).json({ erro: `Erro inesperado: ${err.message}` });
        }

        // Resto do código para processar os dados do formulário...
        const { nome, email, dataHora, mensagem, plano } = req.body;
        let arquivosAnexos = [];

        // Captura os arquivos de imagem enviados conforme o plano
        if (plano === 'basico' && req.files['imagem-basico']) {
            arquivosAnexos.push(req.files['imagem-basico'][0]);
        } else if (plano === 'recomendado' && req.files['imagem-recomendado']) {
            arquivosAnexos = arquivosAnexos.concat(req.files['imagem-recomendado']);
        } else if (plano === 'completo' && req.files['imagem-completo']) {
            arquivosAnexos = arquivosAnexos.concat(req.files['imagem-completo']);
        }

        // Geração de URL para a página personalizada
        const pageURL = `http://localhost:${PORT}/pagina/${encodeURIComponent(nome)}`;
        console.log(`URL da página personalizada: ${pageURL}`);

        try {
            const qrCodeDir = path.resolve(__dirname, 'qr_codes');
            if (!fs.existsSync(qrCodeDir)) {
                fs.mkdirSync(qrCodeDir, { recursive: true });
            }

            const qrCodePath = path.join(qrCodeDir, `${nome}.png`);
            await QRCode.toFile(qrCodePath, pageURL);
            console.log(`QR Code salvo em: ${qrCodePath}`);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'teaviseifaleconosco@gmail.com',
                    pass: 'sua-senha-ou-app-password'
                }
            });

            const attachments = [
                { filename: `${nome}.png`, path: qrCodePath }
            ];

            // Adiciona os arquivos de imagem aos anexos do e-mail
            arquivosAnexos.forEach(arquivo => {
                console.log(`Anexando arquivo: ${arquivo.path}`);
                attachments.push({ filename: arquivo.originalname, path: arquivo.path });
            });

            const mailOptions = {
                from: 'teaviseifaleconosco@gmail.com',
                to: email,
                subject: 'Acesso à sua página personalizada',
                text: `Olá ${nome},\n\nAqui está o acesso à sua página personalizada: ${pageURL}\n\nMensagem: ${mensagem}\nData e Hora: ${dataHora}`,
                attachments: attachments
            };

            await transporter.sendMail(mailOptions);
            res.json({ mensagem: 'Página criada e e-mail enviado com sucesso!' });
        } catch (error) {
            console.error('Erro ao gerar QR Code ou enviar o e-mail:', error);
            res.status(500).json({ erro: 'Erro ao gerar QR Code ou enviar o e-mail' });
        }
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
