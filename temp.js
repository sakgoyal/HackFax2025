let globalCSV = "State,School,School Name,Course Number,Course Name,Credits,Course Number,Course Name,Credits\n";
const states = [
    'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL',
    'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA',
    'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH',
    'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'
]

for (const state of states) {
    const f = await fetch(`https://transfermatrix.admissions.gmu.edu/?state=${state}&school&course`);
    const response = await f.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(response, 'text/html')
    // get the #school select element
    const select = doc.querySelector("#school").children
    for (let i = 1; i < select.length; i++) {
        const fullURL = `https://transfermatrix.admissions.gmu.edu/?state=${state}&school=${select[i].value}&course=View%20All`
        const f2 = await fetch(fullURL)
        const response2 = await f2.text()
        const parser2 = new DOMParser()
        const doc2 = parser2.parseFromString(response2, 'text/html')
        const tr = doc2.querySelectorAll("#post-9 > div.post-inner > div > div.entry-content > table > tbody > tr")
        convertTableToCSV(tr, state, select[i].value, select[i].textContent)
    }
}

function convertTableToCSV(tr, state, school, schoolName) {
    // Course Number, Course Name, Credits, Course Number, Course Name, Credits
    const rows = Array.from(tr);
    let csv = "";

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.textContent?.trim().replace(/,/g, " ")).join(",");
        csv += state + "," + school + "," + schoolName + "," + rowData + "\n";
    });
    console.log(schoolName)
    globalCSV += csv
}

const csvFile = new Blob([globalCSV], {
    type: "text/csv"
});
const downloadLink = document.createElement("a");

downloadLink.download = "formatted.csv";
downloadLink.href = window.URL.createObjectURL(csvFile);
downloadLink.style.display = "none";

document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
