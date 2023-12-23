export function checkInputs() {
    /*
    Applies to: <input type="text"  or <input type="number"

    Checks if input contains a text or a valid real number
    */
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; ++i) {
        let elem = inputs[i];
        if (elem.type === "text" || elem.type === "number") {
            if (elem.value === "" || isNaN(Number(elem.value))) {
                let infoDiv = document.querySelector("#info");
                if (infoDiv != null) {
                    infoDiv.style.display = "inline";
                    infoDiv.innerHTML = "Value is missing or not a number.";
                }
                elem.focus();
                return false;
            }
        }
    }
    return true;
}
export function addInputListener(node, spanId, htmlText) {
    node.addEventListener("input", (evt) => {
        let v = evt.target.value;
        document.getElementById(spanId).innerHTML = v === "" ? htmlText : v;
    });
}
