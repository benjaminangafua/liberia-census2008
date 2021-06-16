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
        // FindHighestPopulationCounties(POPULATION)

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

        let househood_counties = GetCountiesForHouseHolds(HOUSEHOLD)
            // console.log(househood_counties)
            //Bar Chart  for Distribution of Population by county
        DisplayCountyBarChart(population_county, population_per_county)

        //Put households counties in select tag
        PutHouseHoldsCountiesInSelect(househood_counties, county_households_selection)
            //Bar Chart  for Households
        DisplayHousesPopulation()
            //Bar Chart  for districts
        DisplayDistrictsPopulation()
            // The Five highest populated counties  
        function FindHighestPopulationCounties() {
            // console.log(population_county);
            // let total_male = POPULATION.reduce((acc, value) => (acc + value.male), 0)
            let county_male = POPULATION.reduce((a, c) => (a[c.county] = (a[c.county] || 0) + c.male, a), {})
            let county_female = POPULATION.reduce((a, c) => (a[c.county] = (a[c.county] || 0) + c.female, a), {})
                // county_male.sort()
                // county_female.sort()

            for (const key in county_male, county_female) {
                let mvalue = county_male[key]
                let fvalue = county_female[key]

                console.log(mvalue);

                if (mvalue > 110000 && fvalue > 110000) {
                    document.querySelector("#populate").insertAdjacentHTML("afterend", `
                    <tr>
                        <th>${key}</th>
                        <th>${mvalue}</th> 
                        <th>${fvalue}</th>
                    <tr/>`)
                }
            }
            console.log(female);
        }
        FindHighestPopulationCounties()
    })

//First Layout
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


//Second Layout Right
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

//Second Layout Left
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

// Amount population per county
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
                barThickness: 25
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

function DisplayDistricts(districts_name, district_male, district_female) {
    var ctx = document.getElementById('district').getContext('2d')

    if (window.chart != undefined) {
        window.chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: districts_name,
            datasets: [{
                label: "Male",
                backgroundColor: "#D3D3D3",
                data: district_male,
                borderRadius: 5,
                barThickness: 18
            }, {
                label: "Female",
                backgroundColor: "#519872",
                data: district_female,
                borderRadius: 5,
                barPercentage: 0.5
                    // barThickness: 18
            }]
        },
        options: {
            // scales: {
            //     // y: {
            //     //     max: 970000,
            //     //     min: 10,
            //     //     ticks: {
            //     //         stepSize: 100
            //     //     }
            //     // }
            // },
            legend: { display: false },
            title: {
                display: true,
                text: 'Predicted Liberia population (millions) in 2008'
            }
        }
    });
}
//Dropdown for counties for population data
function GetSelectedCounty() {
    let county_districts_option = county_districts_selection.value;
    // console.log(county_districts_option)

    let districts_name = [];
    let district_male = []
    let district_female = []
    raw_Population_data.forEach(ele => {
        ele.forEach(elem => {
            if (elem.county === county_districts_option) {
                let district = elem.district
                districts_name.push(district)

                let male = elem.male
                district_male.push(male)

                let female = elem.female
                district_female.push(female)
            }
        })
    })
    return [districts_name, district_male, district_female];
}
//display bar chart for districts per selected county 

//Bar chart for districts
const DisplayDistrictsPopulation = () => {

    let district = GetSelectedCounty()
        // let districtName = district[0]
        // let district_total_population = district[1]
    DisplayDistricts(district[0], district[1], district[2])
}

//Get counties for households without duplicate
function GetCountiesForHouseHolds(population) {
    let eachCounty = population.reduce((acc, value) => {
        if (acc.indexOf(value.county) === -1) {
            acc.push(value.county)
        }
        return acc
    }, [])
    return eachCounty
}
//display bar chart for houseHolds per selected county
const DisplayHousesPopulation = () => {
        let househood = GetSelectedCountyForHouseHolds();
        // console.log(raw_Population_data);
        DisplayHouseHolds(househood[0], househood[1], househood[2], househood[3])

    }
    //houseHolds bar chart
function DisplayHouseHolds(county, male, female, house_holds) {
    var ctx = document.getElementById("houses-chart").getContext('2d')

    if (window.houses != undefined) {
        window.houses.destroy();
    }

    houses = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: county,
            datasets: [{
                    label: "Male",
                    backgroundColor: "#C0C0C0",
                    data: male,
                    borderRadius: 5,
                    barThickness: 30

                },
                {
                    label: "Female",
                    backgroundColor: "#519872",
                    data: female,
                    borderRadius: 5,
                    barThickness: 30
                },
                {
                    label: "Households Number",
                    backgroundColor: "#919179",
                    data: house_holds,
                    borderRadius: 5,
                    barThickness: 30
                }

            ]
        },
        options: {
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
    // console.log(county_houses_option)

    let settlement_name = [];
    let num_male = [];
    let house_holds = []
    let num_female = [];
    raw_households_data.forEach(ele => {
        ele.forEach(elem => {
            if (elem.county === county_houses_option) {
                let settlement = elem.settlement
                settlement_name.push(settlement)

                let male = elem.male
                num_male.push(male)
                house_holds.push(elem.household_number)
                let female = elem.female
                num_female.push(female)
            }
        })
    })
    return [settlement_name, num_male, num_female, house_holds];
}
//Set house holds counties in select
function PutHouseHoldsCountiesInSelect(county_population, selected_county) {

    let households_data = county_population.forEach((c) => {
        selected_county.insertAdjacentHTML("beforeend", `<option>${c}</option>`)
    })
    return households_data
}