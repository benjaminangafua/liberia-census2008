fetch("./census.json")
    .then((response) => response.json())
    .then((data) => {
        const POPULATION = data.population;

        //Computing total female
        let total_female = POPULATION.reduce((acc, value) => (acc + value.female), 0)
            //Print total  Female 
        document.getElementById("femaleData").insertAdjacentHTML("beforebegin", ` <b>${total_female}</b>`)

        //Computing total male
        let total_male = POPULATION.reduce((acc, value) => (acc + value.male), 0)
        document.getElementById("mal").insertAdjacentHTML("beforebegin", `<b> ${total_male}</b>`)

        //Computing total population
        let total_population = total_male + total_female;
        document.getElementById("popu").insertAdjacentHTML("afterbegin", `<b>${total_population}</b>`)

        //get the array of counties without duplicate for the label on the chart
        let county = POPULATION.reduce((acc, value) => {
            if (acc.indexOf(value.county) === -1) {
                acc.push(value.county)
            }
            return acc
        }, [])



        // let district_option = document.querySelector("#disOptn")
        // district_option.addEventListener("change", (ele) => {

        // })
        // county.forEach((c) => {
        //     district_option.insertAdjacentHTML("beforeend", `<option>${c}</option>
        // `)
        // })

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
                    backgroundColor: "#B1D2C2",
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
        /*new Chart(document.getElementById("district"), {
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
*/
        new Chart(document.getElementById("district"), {
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
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Predicted world population (millions) in 2050'
                }
            }
        });
        //Bar Chart  for Distribution of Population by Number of Households
        new Chart(document.getElementById("houses-chart"), {
            type: 'bar',
            data: {
                labels: county,
                datasets: [{
                    label: county.forEach((c) => {
                        return c;
                    }),
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

            }
        });
    })
    // .catch(error => console.log({ error }))