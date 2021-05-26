fetch("./census.json")
    .then((response) => response.json())
    .then((data) => {
        var popu = data.population;

        var population = 0;
        var totalMale = 0;
        var totalFemale = 0;
        for (var i = 0; i < popu.length; i++) {

            var ma = popu[i].male;
            var fe = popu[i].female;
            //Total Gender
            var gender = ma + fe;
            population = population + gender;

            //Total male
            totalMale = totalMale + ma;

            //Total female
            totalFemale = totalFemale + fe;
        }
        console.log(totalFemale)

        //Total Male and Female Print
        document.getElementById("popu").insertAdjacentHTML("afterbegin", ` 
            <b>${population}</b>      
        `)

        //Total Male Print
        document.getElementById("mal").insertAdjacentHTML("beforebegin", `
        <b> ${totalMale}</b>        
        `)

        //Total Female Print
        document.getElementById("fem").insertAdjacentHTML("beforebegin", ` <b>${totalFemale}</b>        
        `)



        //Doughnut chart
        new Chart(document.getElementById("doughnut-chart"), {
            type: 'doughnut',
            data: {
                labels: ["MALE", "FEMALE"],
                datasets: [{
                    label: "Population (millions)",
                    backgroundColor: ["#B1D2C2", "#F0F2EF"],
                    data: [totalMale, totalFemale]
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Predicted world population (millions) in 2050'
                }
            }
        });
        //Bar Chart 


        new Chart(document.getElementById("bar1-chart"), {
            type: 'bar',
            data: {
                labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
                datasets: [{
                    label: "Population (millions)",
                    backgroundColor: "#B1D2C2",
                    data: [2478, 5267, 734, 784, 433],
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
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Predicted world population (millions) in 2050'
                },
            }
        });
    })