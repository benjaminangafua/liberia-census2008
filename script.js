let county_districts_selection = document.querySelector("#county-districts-selection")
let county_households_selection = document.querySelector("#county-houses-selection")
let raw_households_data = []
let raw_Population_data = []



fetch("./census.json")
    .then((response) => response.json())
    .then((data) => {

        const POPULATION = data.population;
        raw_Population_data.push(POPULATION);

        const HOUSEHOLD = data.households;
        raw_households_data.push(HOUSEHOLD);

        //Computing total female
        let female = CalculateTotalFemale(POPULATION);
        //Computing total male
        let male = CalculateTotalMale(POPULATION)
            //Computing total population
        ComputeTotalPopulation(male, female)

        // doughnutChart of total male and female
        GetMaleAndFemaleDoughnutChart(male, female)

        // Total number of population per county
        let population_per_county = PopulationPerCounty(POPULATION)

        //get the array of counties without duplicate for the label on the chart from population data
        let population_county = GetCountiesWithoutDuplicate(POPULATION);

        let househood_counties = GetCountiesWithoutDuplicate(HOUSEHOLD)
        console.log(househood_counties)
            //Bar Chart  for Distribution of Population by county
        DisplayCountyBarChart(population_county, population_per_county)
            //Counties in select tag
        GetDropdownOfCounties(population_county)

        population_county.forEach((c) => {
                county_households_selection.insertAdjacentHTML("beforeend", `<option>${c}</option>`)
            })
            //Bar Chart  for Distribution of Population by Number of Households
        new Chart(document.getElementById("houses-chart"), {
            type: 'bar',
            data: {
                labels: population_county,
                datasets: [{
                    label: "Population Per District",
                    backgroundColor: "#519872",
                    data: population_per_county,
                    borderRadius: 5,
                    width: 1,
                    barThickness: 18
                }]
            },
            options: {
                scales: {
                    y: {
                        max: 1200000,
                        min: 0,
                        ticks: {
                            stepSize: 400000
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,

                    }
                }

            }
        });
    })
    //Computing total female
function CalculateTotalFemale(populationData) {
    let total_female = populationData.reduce((acc, value) => (acc + value.female), 0)
        //Print total  Female 
    const FEMALE = new Intl.NumberFormat().format(total_female)
    document.getElementById("femaleData").insertAdjacentHTML("beforebegin", ` <b>${FEMALE}</b>`)
    return total_female
}
//Computing total male
function CalculateTotalMale(populationData) {
    let total_male = populationData.reduce((acc, value) => (acc + value.male), 0)
        //Print total  Female 
    const MALE = new Intl.NumberFormat().format(total_male)
    document.getElementById("mal").insertAdjacentHTML("beforebegin", ` <b>${MALE}</b>`);
    return total_male;

}
//Computing total population
function ComputeTotalPopulation(male, female) {
    const POPULATION_TOTAL = new Intl.NumberFormat().format(male + female)
    document.getElementById("popu").insertAdjacentHTML("afterbegin", `<b>${POPULATION_TOTAL}</b>`);
    return POPULATION_TOTAL
}

//Bar Chart  for Distribution of Population by county
function DisplayCountyBarChart(county, population_per_county) {
    new Chart(document.getElementById("county-chart"), {
        type: 'bar',
        data: {
            labels: county,
            datasets: [{
                label: "Population Per County",
                backgroundColor: "#519872",
                data: population_per_county, //data for labels (1st label)
                borderRadius: 5,
                width: 1,
                barThickness: 18
            }]
        },
        options: {
            scales: {
                y: {
                    max: 1120000,
                    min: 10000,
                    ticks: {
                        stepSize: 10000
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,

                }
            },
            aspectRatio: 2.5

        }
    });

}
// doughnutChart of total male and female
function GetMaleAndFemaleDoughnutChart(male, female) {
    new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
            labels: ['MALE', 'FEMALE'],
            datasets: [{
                label: "Gender",
                data: [male, female],
                backgroundColor: ["#B1D2C2", "#F0F2EF"],
            }],
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    borderRadius: 6,
                    labels: {
                        usePointStyle: true,
                        color: "#B1D2C2",
                    }
                }
            },
            aspectRatio: 1.5
        }
    });
}

//get the array of counties without duplicate for the label on the chart
function GetCountiesWithoutDuplicate(population) {
    let eachCounty = population.reduce((acc, value) => {
        if (acc.indexOf(value.county) === -1) {
            acc.push(value.county)
        }
        return acc
    }, [])
    return eachCounty
}
// Total number of population per county
function PopulationPerCounty(populationData) {
    let population_per_county = populationData.reduce((a, c) => (a[c.county] = (a[c.county] || 0) + c.male + c.female, a), {})
    return population_per_county;
}
//display bar chart for districts per selected county

const DisplayDistrictsPopulation = () => {

    let district = GetSelectedCounty()
        // let districtName = district[0]
        // let district_total_population = district[1]
    DisplayDistricts(district[0], district[1])
}

function GetSelectedCounty() {
    let county_districts_option = county_districts_selection.value;
    console.log(county_districts_option)

    let districts_name = [];
    let total_disticts_population = []
    raw_Population_data.forEach(ele => {
        ele.forEach(elem => {
            if (elem.county === county_districts_option) {
                let district = elem.district
                districts_name.push(district)
                let distict_population = elem.male + elem.female
                total_disticts_population.push(distict_population)
            }
        })
    })
    return [districts_name, total_disticts_population];
}
//Bar chart for districts
function DisplayDistricts(districts_name, total_disticts_population) {

    new Chart(document.getElementById("district"), {
        type: 'bar',
        data: {
            labels: districts_name,
            datasets: [{
                label: "Population Per District",
                backgroundColor: "#519872",
                data: total_disticts_population,
                borderRadius: 5,
                width: 1,
                barThickness: 18
            }]
        },
        options: {
            scales: {
                y: {
                    max: 100000,
                    min: 0,
                    ticks: {
                        stepSize: 1000
                    }
                }
            },
            legend: { display: false },
            title: {
                display: true,
                text: 'Predicted Liberia population (millions) in 2008'
            }
        }
    });
}

//display bar chart for houseHolds per selected county
const DisplayHousesPopulation = () => {

    let county_households_option = county_households_selection.value
    console.log(county_households_option)
    raw_households_data.forEach(ele => ele.forEach((elem) => {
            console.log(elem)

            if (elem.county == county_households_option) {
                console.log(elem)
            }
        }))
        // console.log(raw_Population_data);

}

//Display Counties from population data to select tag
function GetDropdownOfCounties(counties) {
    let county_selection = counties.forEach((county) => {
        county_districts_selection.insertAdjacentHTML("beforeend", `<option>${county}</option>`)
    })
    return county_selection;
}
// The five highest populated counties  
function FindHighestPopulationCounties() {
    "mostPopCoun"

}
FindHighestPopulationCounties()