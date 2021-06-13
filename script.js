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
        //Counties in select tag
        GetDropdownOfCounties(population_county, county_districts_selection)

        let househood_counties = GetCountiesWithoutDuplicate(HOUSEHOLD)
        console.log(househood_counties)
            //Bar Chart  for Distribution of Population by county
        DisplayCountyBarChart(population_county, population_per_county)

        //Put households counties in select tag
        PutHouseHoldsCountiesInSelect(househood_counties, county_households_selection)


        //Bar Chart  for Distribution of Population by Number of Households

    })
    //Computing total female
function CalculateTotalFemale(populationData) {
    let total_female = populationData.reduce((acc, value) => (acc + value.female), 0)
        //Print total  Female 
    const FEMALE = new Intl.NumberFormat().format(total_female)
    document.getElementById("femaleData").insertAdjacentHTML("beforebegin", ` <b>${FEMALE}</b>`)
    return total_female
}
//Computing total maleth
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

//Display Counties from population data to select tag
function GetDropdownOfCounties(counties, option) {
    let county_selected = counties.forEach((county) => {
        option.insertAdjacentHTML("beforeend", `<option>${county}</option>`)
    })
    return county_selected;
}

//Dropdown for counties for population data
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
//display bar chart for districts per selected county 
const DisplayDistrictsPopulation = () => {

        let district = GetSelectedCounty()
            // let districtName = district[0]
            // let district_total_population = district[1]
        DisplayDistricts(district[0], district[1])
    }
    //Bar chart for districts
function DisplayDistricts(districts_name, total_disticts_population) {
    var ctx = document.getElementById('district').getContext('2d')

    if (window.chart != undefined) {
        window.chart.destroy();
    }

    chart = new Chart(ctx, {
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
                    max: 970000,
                    min: 10,
                    ticks: {
                        stepSize: 5000
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
        let selected_household_county = GetSelectedCountyForHouseHolds();
        // console.log(raw_Population_data);
        DisplayHouseHolds(selected_household_county[0], selected_household_county[1])

    }
    //houseHolds bar chart
function DisplayHouseHolds(population_county, population_per_county) {
    var ctx = document.getElementById("houses-chart").getContext('2d')

    if (window.chart != undefined) {
        window.chart.destroy();
    }

    chart = new Chart(ctx, {
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
                    max: 240000,
                    min: 0,
                    ticks: {
                        stepSize: 20000
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
}
//Select county for household count
function GetSelectedCountyForHouseHolds() {
    let county_houses_option = county_households_selection.value;
    console.log(county_houses_option)

    let settlement_name = [];
    let total_households_population = []
    raw_households_data.forEach(ele => {
        ele.forEach(elem => {
            if (elem.county === county_houses_option) {
                let settlement = elem.settlement
                settlement_name.push(settlement)
                let households_population = elem.male + elem.female
                total_households_population.push(households_population)
            }
        })
    })
    return [settlement_name, total_households_population];
}
//Set house holds counties in select
function PutHouseHoldsCountiesInSelect(county_population, selected_county) {

    let households_data = county_population.forEach((c) => {
        selected_county.insertAdjacentHTML("beforeend", `<option>${c}</option>`)
    })
    return households_data
}
// The five highest populated counties  
function FindHighestPopulationCounties() {
    "mostPopCoun"

}
FindHighestPopulationCounties()