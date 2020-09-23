/*  Created by 
    CS335 A5
    Reeshan Kishore
    AUID: 888813312
    14/09/20 
*/
loaderEnable(true);

const screenWidth = 500;
const screenHeight = 350;

const uri = "https://api.thevirustracker.com/free-api?countryTimeline=NZ";

const fetchPromise =
        fetch(uri,
        {
        headers : {
            "Accept" : "application/json",
        },
    });
const streamPromise =
        fetchPromise.then((response) => response.json());
        
streamPromise.then(function(dataArray) {
    let data = Object.entries(dataArray['timelineitems'][0]);
    getData(data);
});

function getData(arr) {
    
    let g = document.getElementById("graph");
    //adjust the display size to the number of nodes in the graph
    g.setAttribute("viewBox", "0 10 " + screenWidth + " " + screenHeight);

    let stats = document.getElementById("stats");
    stats.setAttribute("viewBox", "0 0 " + screenWidth + " " + 90);

    

    let todayDate = arr[arr.length-2][0];
    let currTtlCases = arr[arr.length-2][1].total_cases;
    let changeInCases = currTtlCases - arr[arr.length-3][1].total_cases;
    let currTtlDeaths = arr[arr.length-2][1].total_deaths;
    let changeInDeaths = currTtlDeaths - arr[arr.length-3][1].total_deaths;
    let currTtlRecoveries = arr[arr.length-2][1].total_recoveries;
    let changeInRecov = currTtlRecoveries - arr[arr.length-3][1].total_recoveries
    let currActiveCases = currTtlCases - currTtlDeaths - currTtlRecoveries;
    

    let date = document.getElementById("todayDate");
    //this could go into another function
    todayDate = new Date(todayDate);
    todayDate = todayDate.getDate() + "/" + (todayDate.getMonth()+1) + "/" + todayDate.getFullYear();
    date.innerHTML = "Updated as of " + todayDate;

    let pos = 5;
    let tc = document.getElementById("totalCases");
    tc.innerHTML = `<rect x="${pos}" y="5" width="150" height="70" fill="none" stroke-width=1 stroke="darkorange"></rect>
                    <text x="${pos + 75}" y="20" text-anchor="middle" font-size="0.7em" font-family="Helvetica, sans-serif">Total Cases</text>
                    <text x="${pos + 75}" y="50" text-anchor="middle" fill="darkorange" font-weight="bold" font-size="1.3em" font-family="Helvetica, sans-serif">&#9763;${currTtlCases}</text>
                    <text x="${pos + 75}" y="70" text-anchor="middle" fill="darkorange" font-weight="bold" font-size="0.6em" font-family="Helvetica, sans-serif">+${changeInCases + " in last 24hrs"}</text>
                    `;

    pos += screenWidth/3

    let tr = document.getElementById("totalRecoveries");
    tr.innerHTML = `<rect x="${pos}" y="5" width="150" height="70" fill="none" stroke-width=1 stroke="green"></rect>
                    <text x="${pos + 75}" y="20" text-anchor="middle" font-size="0.7em" font-family="Helvetica, sans-serif">Total Recovered</text>
                    <text x="${pos + 75}" y="50" text-anchor="middle" fill="green" font-weight="bold" font-size="1.3em" font-family="Helvetica, sans-serif">&#128154;${currTtlRecoveries}</text>
                    <text x="${pos + 75}" y="70" text-anchor="middle" fill="green" font-weight="bold" font-size="0.6em" font-family="Helvetica, sans-serif">+${changeInRecov + " in last 24hrs"}</text>
                    `;
    

    pos += screenWidth/3

    let dc = document.getElementById("totalDeaths");
    dc.innerHTML = `<rect x="${pos}" y="5" width="150" height="70" fill="none" stroke-width=1 stroke="red"></rect>
                    <text x="${pos + 75}" y="20" text-anchor="middle" font-size="0.7em" font-family="Helvetica, sans-serif">Total Deaths</text>
                    <circle cx="${pos + 55}" cy="37" r="3" stroke="red" fill="red"/>
                    <clipPath id="avatar">
                        <rect x="${pos + 45}" y="40" width="20" height="10"/>
                    </clipPath>
                    <circle clip-path="url(#avatar)" cx="${pos + 55}" cy="49" r="6" stroke="red" fill="red"/>
                    <text x="${pos + 80}" y="50" text-anchor="middle" fill="red" font-weight="bold" font-size="1.3em" font-family="Helvetica, sans-serif">${currTtlDeaths}</text>
                    <text x="${pos + 75}" y="70" text-anchor="middle" fill="red" font-weight="bold" font-size="0.6em" font-family="Helvetica, sans-serif">+${changeInDeaths + " in last 24hrs"}</text>`;

    drawGraphs(arr);

    loaderEnable(false);
}

function loaderEnable(inProgress) {
    if (inProgress === true){
            document.getElementById("loader").style.display = "block";
    }
    else {
        document.getElementById("loader").style.display = "none";
    }
};

function drawGraphs(arr) {
    let startPos = 290;
    let endPos = 275;
    let inc = 10;
    let rectStart = 32;
    let dd = document.getElementById("dailyDeaths");
    let dc = document.getElementById("dailyCases");
    let p = document.getElementById("pieGraph");
    let gf = document.getElementById("graphFrame");
    gf.innerHTML += `<rect x="5" y="15" width="483" height="320" fill="none" stroke-width=1 stroke="black"/>`;
    dc.innerHTML += `<rect x="5" y="15" width="483" height="320" fill="none" stroke-width=1 stroke="black"/>
                    <line x1="40" y1="${startPos}" x2="470" y2="${startPos}" style="stroke:red; stroke-width:0.5"/>
                    <text x="27" y="291" font-weight="bold" font-size="0.4em" font-family="Helvetica, sans-serif">0</text>
                    `;

    dc.innerHTML += `<text x="180" y="30" font-weight="bold"  font-size="0.7em" font-family="Helvetica, sans-serif">COVID-19 Cases per Day in NZ</text>
                    <text x="250" y="325" font-weight="bold"  font-size="0.5em" font-family="Helvetica, sans-serif">Dates</text>
                    <text x="-100" y="20" font-weight="bold"  font-size="0.5em" transform="rotate(270 50 50)" font-family="Helvetica, sans-serif">Number of Cases</text>
                    `;
    let barWidth = (430/(arr.length-1))-1;

    for (let n=0; n < arr.length-1; n++) {
        let date = arr[n][0];
        date = new Date(date);
        date = date.getDate() + "-" + (date.getMonth()+1) + "-" + (date.getYear()-100);
        newDayCases = arr[n][1].new_daily_cases;
        let height = Math.abs((150/100) * newDayCases);
        
        dc.innerHTML += `<rect x="${rectStart}" y="55" width="${barWidth}" height="${height}" fill="blue" transform="rotate(-180 ${rectStart+5} 172.5)"/>
                        `;

        if (n % 7 === 0) {
            dc.innerHTML += `<text x="295" y="${-rectStart}" font-size="6px" transform="rotate(90 3.5 3.5)" font-family="Helvetica, sans-serif">${date}</text>
                            `;
        } 
        rectStart += 430/arr.length;
    }
    
    for (let i=0; i < 17; i++) {
        dc.innerHTML += `<line x1="40" y1="${startPos}" x2="40" y2="${endPos}" style="stroke:red; stroke-width:0.5"/>
                        <line x1="40" y1="${endPos}" x2="35" y2="${endPos}" style="stroke:red; stroke-width:0.5"/>
                        <text x="23" y="${endPos+1}" font-weight="bold" font-size="0.4em" font-family="Helvetica, sans-serif">${inc}</text>
                        
                        `;
        endPos -= 15;
        startPos -= 15;
        inc += 10;
    }

    startPos = 290;
    endPos = 265;
    inc = 1;
    rectStart = 32;
    
    dd.innerHTML += `
                    <line x1="40" y1="${startPos}" x2="470" y2="${startPos}" style="stroke:red; stroke-width:0.5"/>
                    <text x="27" y="291" font-weight="bold" font-size="0.4em" font-family="Helvetica, sans-serif">0</text>
                    `;

    dd.innerHTML += `<text x="180" y="30" font-weight="bold"  font-size="0.7em" font-family="Helvetica, sans-serif">COVID-19 Deaths per Day in NZ</text>
                    <text x="250" y="325" font-weight="bold"  font-size="0.5em" font-family="Helvetica, sans-serif">Dates</text>
                    <text x="-100" y="20" font-weight="bold"  font-size="0.5em" transform="rotate(270 50 50)" font-family="Helvetica, sans-serif">Number of Deaths</text>
                    `;

    for (let n=0; n < arr.length-1; n++) {
        let date = arr[n][0];
        date = new Date(date);
        date = date.getDate() + "-" + (date.getMonth()+1) + "-" + (date.getYear()-100);
        newDayDeaths = arr[n][1].new_daily_deaths;
        let height = 25 * newDayDeaths;
        
        dd.innerHTML += `<rect x="${rectStart}" y="55" width="${barWidth}" height="${height}" fill="blue" transform="rotate(-180 ${rectStart+5} 172.5)"/>
                        `;

        if (n % 7 === 0) {
            dd.innerHTML += `<text x="295" y="${-rectStart}" font-size="6px" transform="rotate(90 3.5 3.5)" font-family="Helvetica, sans-serif">${date}</text>
                            `;
        } 
        rectStart += 430/arr.length;
    }

    for (let i=0; i < 10; i++) {
        dd.innerHTML += `<line x1="40" y1="${startPos}" x2="40" y2="${endPos}" style="stroke:red; stroke-width:0.5"/>
                        <line x1="40" y1="${endPos}" x2="35" y2="${endPos}" style="stroke:red; stroke-width:0.5"/>
                        <text x="25" y="${endPos+1}" font-weight="bold" font-size="0.4em" font-family="Helvetica, sans-serif">${inc}</text>
                        `;
        endPos -= 25;
        startPos -= 25;
        inc += 1
    }

    document.getElementById("dailyDeaths").style.display = "none";
    document.getElementById("dailyCases").style.display = "block";
    document.getElementById("pieGraph").style.display = "none";

    let TtlCases = arr[arr.length-2][1].total_cases;
    let TtlDeaths = arr[arr.length-2][1].total_deaths;
    let TtlRecoveries = arr[arr.length-2][1].total_recoveries;
    let ActiveCases = Math.round((TtlCases - TtlDeaths - TtlRecoveries) / TtlCases * 100);
    let Deaths = Math.round(TtlDeaths / TtlCases * 100);
    let Recov = Math.round(TtlRecoveries / TtlCases * 100);
    let rotate = Math.round(Deaths/100 * 360);
    let rad = 70;
    let circum = 2 * Math.PI * rad;
        
    p.innerHTML = `<circle cx="240" cy="190" r="${rad*2}"  fill="orange"/>
                    <circle cx="240" cy="190" r="${rad}"  fill="none" stroke="red" stroke-width="${rad*2}" stroke-dasharray="calc(${circum} * ${Deaths}/100), ${circum} " />
                    <circle cx="240" cy="190" r="${rad}"  fill="none" stroke="green" stroke-width="${rad*2}" stroke-dasharray="calc(${circum} * ${Recov}/100), ${circum} " transform="translate(12.5,-15) rotate(${rotate-0.4})"/>

                    <text x="120" y="30" font-weight="bold"  font-size="0.7em" font-family="Helvetica, sans-serif">Conditions of the Total COVID-19 Cases in NZ</text>
                    
                    <text x="385" y="197"  font-size="0.4em" font-family="Helvetica, sans-serif">${Deaths}%, Deceased</text>
                    <text x="50" y="190"  font-size="0.4em" font-family="Helvetica, sans-serif">${Recov}%, Recovered</text>
                    <text x="375" y="130"  font-size="0.4em" font-family="Helvetica, sans-serif">${ActiveCases}%, Active Cases</text>
                    `;

}

function getGraph(btn) {
    let death = document.getElementById("dailyDeaths");
    let cases = document.getElementById("dailyCases");
    let pie = document.getElementById("pieGraph");

    if (btn === "Daydeath") {
        death.style.display = "block";
        cases.style.display = "none";
        pie.style.display = "none"
    }
    
    else if (btn === "Daycases") {
        death.style.display = "none";
        cases.style.display = "block";
        pie.style.display = "none"
    }

    else if (btn === "Pie") {
        death.style.display = "none";
        cases.style.display = "none";
        pie.style.display = "block"
    }
}