const express = require("express");
const cors = require("cors");
const kuromoji = require("kuromoji");
const werScorer = require("word-error-rate");
const bleuScorer = require("bleu-score");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 静的ファイル配信
app.use(express.static(path.join(__dirname)));

let tokenizer;

// kuromojiを事前に読み込み
kuromoji.builder({ dicPath: "node_modules/kuromoji/dict/" })
    .build((err, builtTokenizer) => {
        if (err) throw err;
        tokenizer = builtTokenizer;
        console.log("Tokenizer ready");
    });

app.post("/analyze", (req, res) => {
    const { text1, text2 } = req.body;

    if (!tokenizer) return res.status(500).json({ error: "Tokenizer not ready" });

    const tokens1 = tokenizer.tokenize(text1);
    const tokens2 = tokenizer.tokenize(text2);

    const cer_text1 = text1.split('').join(' ');
    const cer_text2 = text2.split('').join(' ');

    const words1 = tokens1.filter(t => t.pos !== "記号").map(t => t.surface_form);
    const words2 = tokens2.filter(t => t.pos !== "記号").map(t => t.surface_form);

    const sep_text1 = words1.join(" ");
    const sep_text2 = words2.join(" ");

    const cerScore = werScorer.wordErrorRate(cer_text1, cer_text2);
    const werScore = werScorer.wordErrorRate(sep_text1, sep_text2);
    const bleuScore = bleuScorer.bleu(sep_text1, sep_text2, 4);

    res.json({
        cer: 1 - cerScore,
        wer: 1 - werScore,
        bleu: bleuScore
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});