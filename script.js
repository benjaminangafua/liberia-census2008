fetch("./census.json")
    .then((response) => response.json())
    .then((data) => {
        const POPULATION = data.population;

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

        /*get the array of counties without duplicate for the label on the chart*/
        let index
        let get_county_array = POPULATION.map(function(counties) {
            return counties.county;
        })
        let county = get_county_array.filter((county, index) => get_county_array.indexOf(county) === index)


        // Doughnut chart
        var DOUGHNUT = new Chart(document.getElementById("doughnut-chart"), {
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
                        borderRadius: 6
                    }
                }
            }
        });


        //Bar Chart  
        var BAR = new Chart(document.getElementById("bar1-chart"), {
            type: 'bar',
            data: {
                labels: county,
                datasets: [{
                    label: county.forEach((c) => {
                        return c;
                    }),
                    backgroundColor: "#B1D2C2",
                    data: [250, 270, 290, 310, 330, 350, 370, 390, 410, 430, 450, 470, 490, 510, 530], //data for labels (1st label)
                    borderRadius: 20,
                    width: 1,
                }]
            },
            options: {
                scales: {
                    y: {
                        max: 1000,
                        min: 0,
                        ticks: {
                            stepSize: 250
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


        //Bar Chart  
        var BAR = new Chart(document.getElementById("bar-chart"), {
            type: 'bar',
            data: {
                labels: county,
                datasets: [{
                    label: county.forEach((c) => {
                        return c;
                    }),
                    backgroundColor: "#B1D2C2",
                    data: [250, 270, 290, 310, 330, 350, 370, 390, 410, 430, 450, 470, 490, 510, 530], //data for labels (1st label)
                    borderRadius: 20,
                    width: 1,
                }]
            },
            options: {
                scales: {
                    y: {
                        max: 1000,
                        min: 0,
                        ticks: {
                            stepSize: 250
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


    })