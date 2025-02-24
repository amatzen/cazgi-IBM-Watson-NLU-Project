import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';
import axios from 'axios';

class App extends React.Component {
    state = {
        innercomp: <textarea rows="4" cols="50" id="textinput" />,
        mode: "text",
        sentimentOutput: [],
        sentiment: true
    }

    renderTextArea = () => {
        document.getElementById("textinput").value = "";
        if (this.state.mode === "url") {
            this.setState({
                innercomp: <textarea rows="4" cols="50" id="textinput" />,
                mode: "text",
                sentimentOutput: [],
                sentiment: true
            })
        }
    }

    renderTextBox = () => {
        document.getElementById("textinput").value = "";
        if (this.state.mode === "text") {
            this.setState({
                innercomp: <textarea rows="1" cols="50" id="textinput" />,
                mode: "url",
                sentimentOutput: [],
                sentiment: true
            })
        }
    }

    sendForSentimentAnalysis = () => {
        this.setState({ sentiment: true });
        let ret = "";
        let url = "https://alexander128-8080.theiadocker-25.proxy.cognitiveclass.ai/";

        url = url + `/${this.state.mode === 'url' ? 'url' : 'text'}/sentiment?${this.state.mode === 'url' ? 'url' : 'text'}=` + document.getElementById("textinput").value;
        
        ret = axios.get(url);
        ret.then((response) => {
            //Include code here to check the sentiment and fomrat the data accordingly

            this.setState({ sentimentOutput: response.data.label });
            let output = response.data.label;

            let color;
            switch (response.data.label) {
                case "positive": {
                    color = "green";
                    break;
                }
                case "negative": {
                    color = "red";
                    break;
                }
                default: {
                    color = "yellow";
                    break;
                }
            }
            
            output = (<div style={{ color, fontSize: 20 }}>{response.data.label} ({response.data.score})</div>)
            this.setState({ sentimentOutput: output });
        });
    }

    sendForEmotionAnalysis = () => {
        this.setState({ sentiment: false });
        let ret = "";
        let url = "https://alexander128-8080.theiadocker-25.proxy.cognitiveclass.ai/";
        url = url + `/${this.state.mode === 'url' ? 'url' : 'text'}/emotion?${this.state.mode === 'url' ? 'url' : 'text'}=` + document.getElementById("textinput").value;
        ret = axios.get(url);

        ret.then((response) => {
            this.setState({ sentimentOutput: <EmotionTable emotions={response.data} /> });
        });
    }


    render() {
        return (
            <div className="App">
                <button className="btn btn-info" onClick={this.renderTextArea}>Text</button>
                <button className="btn btn-dark" onClick={this.renderTextBox}>URL</button>
                <br /><br />
                {this.state.innercomp}
                <br />
                <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
                <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
                <br />
                {this.state.sentimentOutput}
            </div>
        );
    }
}

export default App;
