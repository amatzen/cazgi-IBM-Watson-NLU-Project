const express = require('express');
require('dotenv').config();
const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());
app.use(express.json())

const getNLUInstance = () => {
    const api_key = process.env.API_KEY;
    const api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const nlu = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url,
    });

    return nlu;
}

app.get("/",(req,res)=>{
    res.render('index.html');
});

app.get("/url/emotion", async (req,res) => {
    const nluInstance = getNLUInstance();

    let analyzeParams = {
        "url": req.query.url,
        "features": {
            "emotion": {
                "document": true
            }
        }
    };

    try {
        const response = await nluInstance.analyze(analyzeParams);
        return res.send(response.result.emotion.document.emotion);
    } catch (e) {
        return res.status(500).send(e);
    }
});

app.get("/url/sentiment", async (req,res) => {
    const nluInstance = getNLUInstance();

    let analyzeParams = {
        "url": req.query.url,
        "features": {
            "sentiment": {
                "document": true
            }
        }
    };

    try {
        const response = await nluInstance.analyze(analyzeParams);
        return res.send(response.result.sentiment.document);
    } catch (e) {
        return res.status(500).send(e);
    }
});

app.get("/text/emotion", async (req,res) => {
    const nluInstance = getNLUInstance();

    let analyzeParams = {
        "text": req.query.text,
        "features": {
            "emotion": {
                "document": true
            }
        }
    };

    try {
        const response = await nluInstance.analyze(analyzeParams);
        return res.send(response.result.emotion.document.emotion);
    } catch (e) {
        return res.status(500).send(e);
    }

});

app.get("/text/sentiment", async (req,res) => {
    const nluInstance = getNLUInstance();

    let analyzeParams = {
        "text": req.query.text,
        "features": {
            "sentiment": {
                "document": true
            }
        }
    };

    try {
        const response = await nluInstance.analyze(analyzeParams);
        return res.send(response.result.sentiment.document);
    } catch (e) {
        return res.status(500).send(e);
    }
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

