fetch("./census.json")
    .then((response) => response.json())
    .then((data) => {
        const POPULATION = data.population;

        //Get each county total number of population
        POPULATION.map((element) => {

            // console.log(element.county)

            // if (element.county) console.log(element.male + element.female)

        });

        var initialValue = 0;
        //Computing total female
        let total_female = POPULATION.reduce(function(accumulator, currentValue) {
                return accumulator + currentValue.female
            }, initialValue)
            //Print total  Female 
        document.getElementById("fem").insertAdjacentHTML("beforebegin", ` <b>${total_female}</b>`)

        //Computing total male
        let total_male = POPULATION.reduce(function(accumulator, currentValue) {
            return accumulator + currentValue.male
        }, initialValue)

        //Print total male 
        document.getElementById("mal").insertAdjacentHTML("beforebegin", `<b> ${total_male}</b>`)

        //Computing total population
        let total_population = total_male + total_female;

        // Print total population
        document.getElementById("popu").insertAdjacentHTML("afterbegin", `<b>${total_population}</b>`)

        /*get the array of counties without duplicate for the label on the chart
        let get_county_array = POPULATION.map(function(counties) {
            return counties.county;
        })
        let county = get_county_array.filter((county, index) => get_county_array.indexOf(county) === index)
        */
        let county = POPULATION.reduce(function(accumulator, currentValue) {
            if (accumulator.indexOf(currentValue.county) === -1) {
                accumulator.push(currentValue.county)
            }
            return accumulator
        }, [])

        // Total number of population per county
        let tots = POPULATION.reduce((a, c) => (a[c.county] = (a[c.county] || 0) + c.male + c.female, a), {})

        console.log(tots);
        // let countyPopTotal = POPULATION.reduce(function(accumulator, currentValue, index) {
        //     if (accumulator.indexOf(currentValue.county) === -1) {

        //         accumulator.push(currentValue.male + currentValue.female)
        //     }
        //     return accumulator
        // }, [])
        // console.log("Pop", countyPopTotal);


        var CountyTotal = []
        for (var i = 0; i < county.length; i++) {

            let maleTotal, femaleTotal;
            for (var j = i; j < POPULATION.length; j++) {
                if (county[i] === POPULATION[j].county) {
                    maleTotal = POPULATION[j].male
                    femaleTotal = POPULATION[j].female
                }
            }
            let total = maleTotal + femaleTotal
            CountyTotal.push(total)
        }
        // console.log(CountyTotal)


        // doughnutChart of total male and female
        new Chart(document.getElementById("doughnut-chart"), {
            type: 'doughnut',
            data: {
                labels: ["MALE", "FEMALE"],
                datasets: [{
                    label: "Population (millions)",
                    backgroundColor: ["#B1D2C2", "#F0F2EF"],
                    data: [total_male, total_female]
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                        borderRadius: 6,
                        labels: {
                            usePointStyle: true
                        }
                    }
                },
                aspectRatio: 1.5
            }
        });
        //Bar Chart  for Distribution of Population by county
        new Chart(document.getElementById("bar1-chart"), {
            type: 'bar',
            data: {
                labels: county,
                datasets: [{
                    label: county.forEach((c) => {
                        return c;
                    }),
                    backgroundColor: "#B1D2C2",
                    data: tots, //data for labels (1st label)
                    borderRadius: 5,
                    width: 1,
                    barThickness: 18
                }]
            },
            options: {
                scales: {
                    y: {
                        max: 1120000,
                        min: 0,
                        ticks: {
                            stepSize: 600000
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,

                    }
                }

            }
        });
        //Bar Chart for Distribution of Population by District
        new Chart(document.getElementById("bar-chart"), {
            type: 'bar',
            data: {
                labels: county,
                datasets: [{
                    label: county.forEach((c) => {
                        return c;
                    }),
                    backgroundColor: "#B1D2C2",
                    data: tots,
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
                        display: false,
                    }
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
                    data: tots,
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
                        display: false,

                    }
                }

            }
        });

    }).catch(error => console.log({ error }))