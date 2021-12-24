async function getDatat() {
    const url = 'api.frankfurter.app';
    const response = await fetch(`https://${url}/latest`);
    const data = await response.json();

    const from = document.getElementById("fromCurrency");
    const to = document.getElementById("toCurrency");

    function addOption(id) {
        for (const key of Object.entries(data.rates)) {
            let options = document.createElement("option")
            options.innerText = key[0];
            id.appendChild(options);
        }
    }
    addOption(from);
    addOption(to);

    // calculate
    
    let typingTime = null;
    const input = document.querySelector('input');

    input.addEventListener('keyup', function(e) {
        clearTimeout(typingTime);
        typingTime = setTimeout(() => {
            let firstValue = input.value;
            let firstCurrency = from.value;
            let secondCurrency = to.value;

            async function fetchCurrency() {
                let res = await fetch(`https://${ url }/latest?from=${ firstCurrency }`);
                let dataRes = await res.json();

                for (const [key, value] of Object.entries(dataRes.rates)) {
                    if (secondCurrency === key) {
                        document.querySelector(".value").innerText = value;
                        document.querySelector("#result").innerText = (firstValue * value).toFixed(2);
                        document.querySelector("#resultCurrency").innerText = secondCurrency;
                    } 
                }
              
            }
            fetchCurrency();
        }, 1000)

    })

    const ctx = document.getElementById("graph").getContext("2d");
    const currencyChart = new Chart(ctx, {
        type: "line",
            data: {
                labels: "",
                datasets: []
            }
    })

    document.querySelectorAll('select').forEach(item => {
        item.addEventListener('change', event => {
            const fromCHis = from.value;
            const toCHis = to.value;


            async function fetchHistory() {
                let resHistory = await fetch(`https://${ url }/2020-01-04..?from=${fromCHis}&to=${toCHis}`);
                let dataResHistory = await resHistory.json();
                const xlabels = [];
                const ylabels = [];
                for (const [key, value] of Object.entries(dataResHistory.rates)) {
                    xlabels.push(key);
                    ylabels.push(value);
                }

                const yScale = [];
                ylabels.forEach(y => {
                    yScale.push(y[`${toCHis}`]);
                })


                currencyChart.data = {
                    labels: xlabels,
                    datasets: [{
                        label: 'Exchange rate',
                        data: yScale,
                        borderColor: '#0000ff',
                    }]
                }
                currencyChart.update();
            }


            fetchHistory();

        })
    })


}

getDatat();

