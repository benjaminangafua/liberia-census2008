let district_option = document.querySelector("#disOptn")
let newPopulation = []
fetch("./census.json")
    .then((response) => response.json())
    .then((data) => {
        let real_data = data.population
        newPopulation.push(real_data);
        let POPULATION = data.population

        //Computing total female
        let total_female = POPULATION.reduce((acc, value) => (acc + value.female), 0)
            //Print total  Female 
        const FEMALE = new Intl.NumberFormat().format(total_female)
        document.getElementById("femaleData").insertAdjacentHTML("beforebegin", ` <b>${FEMALE}</b>`)

        //Computing total male
        let total_male = POPULATION.reduce((acc, value) => (acc + value.male), 0)
        const MALE = new Intl.NumberFormat().format(total_male)

        document.getElementById("mal").insertAdjacentHTML("beforebegin", `<b> ${MALE}</b>`)

        //Computing total population
        let total_population = total_male + total_female;
        const POPULATION_TOTAL = new Intl.NumberFormat().format(total_population)

        document.getElementById("popu").insertAdjacentHTML("afterbegin", `<b>${POPULATION_TOTAL}</b>`)

        //get the array of counties without duplicate for the label on the chart
        let county = POPULATION.reduce((acc, value) => {
            if (acc.indexOf(value.county) === -1) {
                acc.push(value.county)
            }
            return acc
        }, [])



        district_option.addEventListener("change", (ele) => {

        })
        county.forEach((c) => {
            district_option.insertAdjacentHTML("beforeend", `<option>${c}</option>
        `)
        })

        let houses_option = document.querySelector("#housesOptn")
            // district_option.addEventListener("change", (ele) => {

        // })
        county.forEach((c) => {
            houses_option.insertAdjacentHTML("beforeend", `<option>${c}</option>
        `)
        })


        // Total number of population per county
        let total_population_per_county = POPULATION.reduce((a, c) => (a[c.county] = (a[c.county] || 0) + c.male + c.female, a), {})

        // doughnutChart of total male and female
        new Chart(document.getElementById("doughnut-chart"), {
            type: 'doughnut',
            data: {
                labels: ['MALE', 'FEMALE'],
                datasets: [{
                    label: "Gender",
                    data: [total_male, total_female],
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
        //Bar Chart  for Distribution of Population by county
        new Chart(document.getElementById("county-chart"), {
            type: 'bar',
            data: {
                labels: county,
                datasets: [{
                    label: "Population Per County",
                    backgroundColor: "#519872",
                    data: total_population_per_county, //data for labels (1st label)
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
        //Bar Chart for Distribution of Population by District
        /**
         * new Chart(document.getElementById("district"), {
            type: 'bar',
            data: {
                labels: county,
                datasets: [{
                    label: "Population Per District",
                    backgroundColor: "#B1D2C2",
                    data: total_population_per_county,
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
            },
            aspectRatio: 2.5
        });
        **/

        //Bar Chart  for Distribution of Population by Number of Households
        new Chart(document.getElementById("houses-chart"), {
            type: 'bar',
            data: {
                labels: county,
                datasets: [{
                    label: "Population Per District",
                    backgroundColor: "#519872",
                    data: total_population_per_county,
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
    // .catch(error => console.log({ error }))
console.log(newPopulation);

function GetDistrict() {
    let selected_county = district_option.value
    console.log(selected_county)

    let districts = [];
    let disticts_population = []
    newPopulation.forEach(ele => {
        ele.forEach(elem => {
            console.log("", elem.county);
            if (elem.county == selected_county) {
                let district = elem.district
                districts.push(district)

                let distict_population = elem.male + elem.female
                disticts_population.push(distict_population)

            }
        })
    })
    console.log(districts)
    new Chart(document.getElementById("district"), {
        type: 'bar',
        data: {
            labels: districts,
            datasets: [{
                label: "Population Per District",
                backgroundColor: "#519872",
                data: disticts_population,
                borderRadius: 5,
                width: 1,
                barThickness: 18
            }]
        },
        options: {
            scales: {
                y: {
                    max: 50000,
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

// The five highest populated counties
function FindHighestPopulationCounties() {
    "mostPopCoun"

    // fetch('/census.json').then(res => res.json())
    //     .then(data => {
    //         const POPULATION_DATA = data.population
    //         let most_district = POPULATION_DATA.reduce((acc, value) => {
    //             const county = value.county;

    //             if (!acc[county]) {
    //                 acc[county] = {};
    //             }
    //             const distr = acc[county].district;
    //             acc[county] = { district: distr };

    //             // if()

    //             return acc;
    //         }, {})
    //         console.log(most_district)
    //     })
    // fetch('/census.json').then(res => res.json())
    //     .then(data => {
    //         const POPULATION_DATA = data.population
    //         let most_populat = POPULATION_DATA.reduce((acc, value) => {
    //             const county = value.county;

    //             if (!acc[county]) {
    //                 acc[county] = {};
    //             }
    //             const countyMales = acc[county].male || 0;
    //             const countyFemales = acc[county].female || 0;
    //             const updatedMales = countyMales + value.male;
    //             const updatedFemales = countyFemales + value.female;
    //             acc[county] = { male: updatedMales, female: updatedFemales, total: updatedMales + updatedFemales };

    //             // if()

    //             return acc;
    //         }, {})
    //         console.log(most_populat)
    //     })
}
FindHighestPopulationCounties()