/*  Created by 
    CS335 A5
    Reeshan Kishore
    AUID: 888813312
    14/09/20 
    Revised with new API disease.sh July 2021 by Reeshan Kishore
*/




const screenWidth = 500;
const screenHeight = 260;

const uri = "https://disease.sh/v3/covid-19/historical/New%20Zealand?lastdays=all";

//Old API of Covid Statistics
//const uri = "https://api.thevirustracker.com/free-api?countryTimeline=NZ";

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
    

    let cases = Object.entries(dataArray['timeline']['cases']);
    let deaths = Object.entries(dataArray['timeline']['deaths']);
    let recovered = Object.entries(dataArray['timeline']['recovered']);  
    

    getData(cases, deaths, recovered);
    drawGraphs(cases, deaths, recovered);
});



function getData(cases, deaths, recovered) {
    
    let g = document.getElementById("graph");
    //adjust the display size to the number of nodes in the graph
    g.setAttribute("viewBox", "0 10 " + screenWidth + " " + screenHeight);

    let stats = document.getElementById("stats");
    stats.setAttribute("viewBox", "0 0 " + screenWidth + " " + 90);

    

    let caseInfo = getLatestData(cases)
    let currentTotalCases = caseInfo[1]
    let changeInCases = currentTotalCases - caseInfo[2];

    let deathInfo = getLatestData(deaths)
    let currentTotalDeaths = deathInfo[1];
    let changeInDeaths = currentTotalDeaths - deathInfo[2];

    let recoveredInfo = getLatestData(recovered)
    //Error in API, these values are set to the latest available data as of 4/8/21 
    let currentTotalRecovered = 2824;
    let changeInRecovered = 0;
    //currentTotalRecovered - recoveredInfo[2]

    
    
    //let ActiveCases = currentTotalCases - currentTotalDeaths - currentTotalRecovered;
    

    let date = document.getElementById("todayDate");
    dataDate = caseInfo[0]
    date.innerHTML = "Updated as of " + dataDate;

    let pos = 5;
    let tc = document.getElementById("totalCases");
    tc.innerHTML = `<rect x="${pos}" y="5" width="150" height="70" fill="none" stroke-width=1 stroke="darkorange"></rect>
                    <text x="${pos + 75}" y="20" text-anchor="middle" font-size="0.7em" font-family="Helvetica, sans-serif">Total Cases</text>
                    <text x="${pos + 75}" y="50" text-anchor="middle" fill="darkorange" font-weight="bold" font-size="1.3em" font-family="Helvetica, sans-serif">&#9763;${currentTotalCases}</text>
                    <text x="${pos + 75}" y="70" text-anchor="middle" fill="darkorange" font-weight="bold" font-size="0.6em" font-family="Helvetica, sans-serif">+${changeInCases + " in last 24hrs"}</text>
                    `;

    pos += screenWidth/3

    let tr = document.getElementById("totalRecoveries");
    tr.innerHTML = `<rect x="${pos}" y="5" width="150" height="70" fill="none" stroke-width=1 stroke="green"></rect>
                    <text x="${pos + 75}" y="20" text-anchor="middle" font-size="0.7em" font-family="Helvetica, sans-serif">Total Recovered</text>
                    <text x="${pos + 75}" y="50" text-anchor="middle" fill="green" font-weight="bold" font-size="1.3em" font-family="Helvetica, sans-serif">&#128154;${currentTotalRecovered}</text>
                    <text x="${pos + 75}" y="70" text-anchor="middle" fill="green" font-weight="bold" font-size="0.6em" font-family="Helvetica, sans-serif">+${changeInRecovered + " in last 24hrs"}</text>
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
                    <text x="${pos + 80}" y="50" text-anchor="middle" fill="red" font-weight="bold" font-size="1.3em" font-family="Helvetica, sans-serif">${currentTotalDeaths}</text>
                    <text x="${pos + 75}" y="70" text-anchor="middle" fill="red" font-weight="bold" font-size="0.6em" font-family="Helvetica, sans-serif">+${changeInDeaths + " in last 24hrs"}</text>`;

    

    loaderEnable(false);
}

function getLatestData(array) {
    let latestData = array[array.length - 1]
    let priorData = array[array.length - 2]
    let priorTotal = priorData[1]
    let recentDate = latestData[0]
    let latestTotal = latestData[1]
    
    
    return [formatDate(recentDate), latestTotal, priorTotal]
}

function formatDate(date) {
    let inputDate = new Date(date)
    let formattedDate = inputDate.getDate() + '/' + (inputDate.getMonth()+1) + '/' + inputDate.getFullYear()

    return formattedDate
}



function loaderEnable(inProgress) {
    if (inProgress === true){
            document.getElementById("loader").style.display = "block";
    }
    else {
        document.getElementById("loader").style.display = "none";
    }
};

function drawGraphs(cases, deaths, recovered) {
    let startPos = 200;
    let endPos = 185;
    let inc = 10;
    let rectStart = 32;
    let dd = document.getElementById("dailyDeaths");
    let dc = document.getElementById("dailyCases");
    let p = document.getElementById("pieGraph");
    let gf = document.getElementById("graphFrame");
    gf.innerHTML += `<rect x="5" y="15" width="483" height="240" fill="none" stroke-width=1 stroke="black"/>`;
    dc.innerHTML += `<line x1="40" y1="${startPos}" x2="470" y2="${startPos}" style="stroke:black; stroke-width:0.5"/>
                    <text x="27" y="201" font-weight="bold" font-size="0.4em" font-family="Helvetica, sans-serif">0</text>
                    `;

    dc.innerHTML += `<text x="180" y="30" font-weight="bold"  font-size="0.7em" font-family="Helvetica, sans-serif">COVID-19 Cases per Day in NZ</text>
                    <text x="250" y="250" font-weight="bold"  font-size="0.5em" font-family="Helvetica, sans-serif">Dates</text>
                    <text x="-50" y="15" font-weight="bold"  font-size="0.5em" transform="rotate(270 50 50)" font-family="Helvetica, sans-serif">Number of Cases</text>
                    `;
    let barWidth = (430/(cases.length-1));

    for (let n=0; n < cases.length-1; n++) {
        let date = formatDate(cases[n][0]);
        let newDayCases = cases[n+1][1] - cases[n][1];
        let height = Math.abs((150/100) * newDayCases);
        
        dc.innerHTML += `<rect x="${rectStart}" y="145" width="${barWidth}" height="${height}" fill="orange" transform="rotate(-180 ${rectStart+5} 172.5)">
                            <title>${date} \n ${newDayCases} case/s</title> 
                        </rect>
                        `;

        if (n % 31 === 0) {
            dc.innerHTML += `<text x="205" y="${-rectStart}" font-size="6px" transform="rotate(90 3.5 3.5)" font-family="Helvetica, sans-serif">${date}</text>
                            `;
        } 
        rectStart += 430/cases.length;
    }
    
    for (let i=0; i < 10; i++) {
        dc.innerHTML += `<line x1="40" y1="${startPos}" x2="40" y2="${endPos}" style="stroke:black; stroke-width:0.5"/>
                        <line x1="40" y1="${endPos}" x2="35" y2="${endPos}" style="stroke:black; stroke-width:0.5"/>
                        <text x="23" y="${endPos+1}" font-weight="bold" font-size="0.4em" font-family="Helvetica, sans-serif">${inc}</text>
                        
                        `;
        endPos -= 15;
        startPos -= 15;
        inc += 10;
    }

    startPos    = 200;
    endPos      = 185;
    inc         = 1;
    rectStart   = 32;
    
    dd.innerHTML += `
                    <line x1="40" y1="${startPos}" x2="470" y2="${startPos}" style="stroke:black; stroke-width:0.5"/>
                    <text x="27" y="201" font-weight="bold" font-size="0.4em" font-family="Helvetica, sans-serif">0</text>
                    `;

    dd.innerHTML += `<text x="180" y="30" font-weight="bold"  font-size="0.7em" font-family="Helvetica, sans-serif">COVID-19 Deaths per Day in NZ</text>
                    <text x="250" y="250" font-weight="bold"  font-size="0.5em" font-family="Helvetica, sans-serif">Dates</text>
                    <text x="-50" y="15" font-weight="bold"  font-size="0.5em" transform="rotate(270 50 50)" font-family="Helvetica, sans-serif">Number of Deaths</text>
                    `;

    for (let n=0; n < deaths.length-1; n++) {
        let date = formatDate(deaths[n][0]);
        let newDayDeaths = deaths[n+1][1] - deaths[n][1];
        let height = 15 * newDayDeaths;
        
        dd.innerHTML += `<rect x="${rectStart}" y="145" width="${barWidth}" height="${height}" fill="red" transform="rotate(-180 ${rectStart+5} 172.5)">
                            <title>${date} \n ${newDayDeaths} death/s</title>
                        </rect>
                        `;

        if (n % 31 === 0) {
            dd.innerHTML += `<text x="205" y="${-rectStart}" font-size="6px" transform="rotate(90 3.5 3.5)" font-family="Helvetica, sans-serif">${date}</text>
                            `;
        } 
        rectStart += 430/deaths.length;
    }

    for (let i=0; i < 10; i++) {
        dd.innerHTML += `<line x1="40" y1="${startPos}" x2="40" y2="${endPos}" style="stroke:black; stroke-width:0.5"/>
                        <line x1="40" y1="${endPos}" x2="35" y2="${endPos}" style="stroke:black; stroke-width:0.5"/>
                        <text x="25" y="${endPos+1}" font-weight="bold" font-size="0.4em" font-family="Helvetica, sans-serif">${inc}</text>
                        `;
        endPos -= 15;
        startPos -= 15;
        inc += 1
    }

    document.getElementById("dailyDeaths").style.display = "none";
    document.getElementById("dailyCases").style.display = "block";
    document.getElementById("pieGraph").style.display = "none";

    let totalCases          = cases[cases.length-2][1];
    let totalDeaths         = deaths[deaths.length-2][1];
    //let totalRecoveries     = recovered[recovered.length-2][1];
    //CurrentTotalRecoveries is being used instead
    let currentTotalRecovered = 2824;
    let activeCases         = totalCases - totalDeaths - currentTotalRecovered
    let activeCaseSector    = Math.round((totalCases - totalDeaths - currentTotalRecovered) / totalCases * 100);
    let deathSector         = Math.round(totalDeaths / totalCases * 100);
    let recoveriesSector    = Math.round(currentTotalRecovered / totalCases * 100);
    let rotate              = Math.round(deathSector/100 * 360);
    let radius              = 45;
    let circum              = 2 * Math.PI * radius;
        
    p.innerHTML = ` <rect x="10" y="50" width="10" height="10" fill="green" />
                    <rect x="10" y="70" width="10" height="10" fill="orange"/>
                    <rect x="10" y="90" width="10" height="10" fill="red"/>

                    
                    <text x="25" y="57"  font-size="0.4em" font-family="Helvetica, sans-serif">Recovered | ${recoveriesSector}% | ${currentTotalRecovered} </text>
                    <text x="25" y="77"  font-size="0.4em" font-family="Helvetica, sans-serif">Active Cases | ${activeCaseSector}% | ${activeCases}  </text>
                    <text x="25" y="97"  font-size="0.4em" font-family="Helvetica, sans-serif">Deceased | ${deathSector}% | ${totalDeaths} </text>
    
                    <circle cx="240" cy="140" r="${radius*2}"  fill="orange"/>
                    <circle cx="240" cy="140" r="${radius}"  fill="none" stroke="red" stroke-width="${radius*2}" stroke-dasharray="calc(${circum} * ${deathSector}/100), ${circum} " />
                    <circle cx="237" cy="140.5" r="${radius}"  fill="none" stroke="green" stroke-width="${radius*2}" stroke-dasharray="calc(${circum} * ${recoveriesSector}/100), ${circum} " transform="translate(12.5,-15) rotate(${rotate-0.4})"/>

                    <text x="120" y="30" font-weight="bold"  font-size="0.7em" font-family="Helvetica, sans-serif">Conditions of the Total COVID-19 Cases in NZ</text>
                                                       
                    `;

}

function getGraph(btn) {
    let death = document.getElementById("dailyDeaths");
    let cases = document.getElementById("dailyCases");
    let pie = document.getElementById("pieGraph");

    if (btn === "Daydeath") {
        death.style.display = "block";
        cases.style.display = "none";
        pie.style.display   = "none"
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