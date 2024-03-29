import React, { Component } from "react";
import Highlighter from "react-highlight-words";
import { fuzzifyPashto } from "fuzzify-pashto";
import "./Demo.css";

const apiOptions = [
    { name: "allowSpacesInWords", label: "Allow spaces in words", type: "boolean", default: false },
    { name: "matchWholeWordOnly", label: "Match whole word only", type: "boolean", default: false },
    { name: "returnWholeWord", label: "Return whole word", type: "boolean", default: false },
    { name: "ignoreDiacritics", label: "Ignore Diacritics", type: "boolean", default: false },
    { name: "es2018", label: "Use ECMA2018", type: "boolean", default: false },
    { name: "matchStart", label: "Start matches at", type: "string", default: "word", enum: [
        { value: "word", optionText: "Beginning of word" },
        { value: "string", optionText: "Beginning of string" },
        { value: "anywhere", optionText: "Anywhere" },
    ]},
];

const startingSearchWord = "سخه";
const startingText = "پښتو ژبه د لرغونو آريایي ژبو څخه يوه خپلواکه ژبه ده چې له پخوا څخه په څو نومونو ياده شوې چې يو لړ نومونه ېې پښتو، پختو، پوختو، په هندي (پټاني)، په پاړسي او نړېوالې کچه د افغاني ژبې په نوم شهرت لري";


export default class Demo extends Component {
    constructor (props) {
        super(props);

        const options = apiOptions.reduce((opts, o) => {
            opts[o.name] = o.default;
            return opts;
        }, {});

        this.state = {
            searchText: startingSearchWord,
            textToHighlight: startingText,
            regex: fuzzifyPashto(startingSearchWord, options),
            es2018Supported: false,
            adjustedOptions: new Set(),
            ...options,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
    } 

    componentDidMount() {
        // Check to see if browser has es2018 lookbehind support
        // If so enable it by default
        let es2018Works = true;
        try {
           const r = new RegExp("(?<=a)b"); 
        } catch (error) {
            es2018Works = false;
        }
        if (es2018Works) {
            this.setState({ 
                es2018Supported: true, 
                es2018: true,
                regex: fuzzifyPashto(this.state.searchText, { es2018: true }), 
            });
            this.setState(({ adjustedOptions }) => ({
                adjustedOptions: new Set(adjustedOptions).add("es2018")
            }));
        }
    }

    // Creates the part of the code that gets passed as the options in the code example
    apiOptionsCode() {
        const firstLine = ", {\n"; 
        const ending = "}";
        return apiOptions.reduce((code, option) => {
            // Only show code for the options that have been touched
            if (!this.state.adjustedOptions.has(option.name)) {
                return code;
            }
            let val;
            if (option.type === "string") {
                val = `"${this.state[option.name]}"`;
            } else {
                val = this.state[option.name];
            }
            return code.concat(`\t${option.name}: ${val},\n`); 
        }, firstLine) + ending;
  }

  handleClear() {
      this.setState({ textToHighlight: "" });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "es2018" && !this.state.es2018Supported) {
        alert("Your browser does not support lookbehind assertions in regex as per ECMA2018");
        return;
    }

    if (apiOptions.find((o) => o.name === name)) {
        this.setState(({ adjustedOptions }) => ({
            adjustedOptions: new Set(adjustedOptions).add(name)
        }));
    }

    if ((name === "matchWholeWordOnly") && (value === true) && (this.state.matchStart === "anywhere")) {
        this.setState({ matchStart: "word" });
    } else if ((name === "matchStart") && (value === "anywhere") && (this.state.matchWholeWordOnly === true)) {
        this.setState({ matchWholeWordOnly: false });
    } 

    const fuzzifyOptions = apiOptions.reduce((acc, option) => {
        acc[option.name] = name === option.name ? value : this.state[option.name];
        return acc;
    }, {});
    const regex = fuzzifyPashto(name === "searchText" ? value : this.state.searchText, fuzzifyOptions);
    this.setState({
        [name]: value,
        regex: this.state.searchText ? regex : "",
    });
  }

  render () {
      
    const { 
        searchText, 
        textToHighlight, 
        regex, 
        adjustedOptions,
    } = this.state;

    return (
        <div className="row">
            <div className="col-lg-6">
                <div className="card" style={{ maxWidth: "600px", background: "#ECEFF1"}}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-6">
                                <h5>
                                    Search String:
                                </h5>
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        dir="rtl"
                                        className="form-control"
                                        name="searchText" 
                                        value={searchText}
                                        onChange={this.handleInputChange}  
                                    />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <h6>Options</h6>
                                {apiOptions.map((option) => {
                                    if (option.type === "boolean") {
                                        return (
                                            <div key={option.name} className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox"
                                                    name={option.name} 
                                                    checked={this.state[option.name]}
                                                    onChange={this.handleInputChange} 
                                                />
                                                <label className="form-check-label">
                                                    {option.label}
                                                </label>
                                            </div>
                                        );
                                    } else if (option.type === "string") {
                                        return (
                                            <div key={option.name}>                                            
                                                <label>{option.label}</label>
                                                <select 
                                                    name={option.name}
                                                    value={this.state[option.name]} 
                                                    onChange={this.handleInputChange} 
                                                    className="form-control form-control-sm"
                                                >
                                                    {option.enum.map((v) => (
                                                        <option key={v.value} value={v.value}>{v.optionText}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                        <h5 className="mt-2 mb-0">Text to Search:</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                            <small className="text-muted">
                                Edit or paste text here
                            </small>
                            <small className="text-muted clickable" onClick={this.handleClear}>
                                Clear
                            </small>
                        </div>
                        <div className="input-group">
                            <textarea 
                                className="form-control"
                                name="textToHighlight"
                                value={textToHighlight}
                                dir="rtl"
                                rows="3"
                                onChange={this.handleInputChange}
                            >    
                            </textarea>
                        </div>
                        <h5 className="mt-2">Matches:</h5>
                        <Highlighter
                            searchWords={[searchText ? regex : ""]}
                            textToHighlight={textToHighlight}
                        />
                    </div>
                </div>
            </div>
            <div className="col-lg-6">
                <h5>Code:</h5>
                <pre><code>
                    {`import { fuzzifyPashto } from "fuzzify-pashto";  

const fuzzyRegex = fuzzifyPashto("${searchText}"${adjustedOptions.size ? this.apiOptionsCode() : ""});`
}
</code></pre>
                {this.state.es2018Supported && <div className="mb-2">
                    Note: Your browser supports <a href="https://v8.dev/blog/regexp-lookbehind-assertions">ES2018 lookbehind assertions</a> in regex. This allows for cleaner matching at the beginning of words, but it"s <a href="https://caniuse.com/#feat=js-regexp-lookbehind">not supported in all environments</a>.
                </div>}
                {regex && 
                    <>
                        <h5>Generated Regex:</h5>
                        <samp>{regex ? regex.toString() : " "}</samp>
                        <p className="small mt-3">Note: Regex may appear out of order due to browser display issues with RTL-LTR text</p>
                    </>
                }
            </div>
        </div>
    );
  }
}
