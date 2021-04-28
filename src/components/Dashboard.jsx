import React, {PureComponent} from 'react'
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import isEqual from 'lodash.isequal';

class Dashboard extends PureComponent {
    state = {
        temperature: [],
        humidity: [],
        flame: [],
        smoke: [],
        time_stamp: []
    }

    componentDidMount() {
        const AppConfig = {
            'Content-Type': 'application/json'
        }
        setInterval(() => {
            axios.get('https://kane99.pythonanywhere.com/api/data/', AppConfig)
                .then(res => {
                    if (res.data.length >= 10) {
                        var li = [];
                        li = res.data.slice(-10)
                        // li.push(res.data[res.data.length - 1]);
                        // li.push(res.data[res.data.length - 2]);
                        // li.push(res.data[res.data.length - 3]);
                        // li.push(res.data[res.data.length - 4]);
                        // li.push(res.data[res.data.length - 5]);

                        let temp = [], humi = [], flame = [], smoke = [], time = [];
                        li.forEach(element => {
                            if(!isNaN(element.temperature)){
                                temp.push(parseFloat(element.temperature))
                            }else{
                                temp.push(0)
                            }
                            
                        });
                        li.forEach(element => {
                            if(!isNaN(element.humidity)){
                                humi.push(parseFloat(element.humidity))
                            }else{
                                humi.push(0)
                            }
                        });
                        li.forEach(element => {
                            if(!isNaN(element.flame) && (parseFloat(element.flame)>700)){
                                flame.push(parseFloat(element.flame))
                            }else if(parseFloat(element.flame) <= 700){
                                flame.push(parseFloat(element.flame));
                                this.sendPushNotification();
                            }else{
                                flame.push(0)
                            }
                        });
                        li.forEach(element => {
                            if(!isNaN(element.smoke)){
                                smoke.push(parseFloat(element.smoke))
                            }else{
                                smoke.push(0)
                            }
                        });
                        li.forEach(element => {
                            time.push(new Date(element.time_stamp).getMinutes()  +  ":"  +  ('0' + new Date(element.time_stamp).getSeconds()) .slice(-2))
                        })
                        const newState = {
                            temperature: temp,
                            humidity: humi,
                            flame: flame,
                            smoke: smoke,
                            time_stamp: time
                        }
                        if (isEqual(this.state, newState)) {
                        } else {
                            this.setState(newState)
                        }
                    }

                })
                .catch(err => {
                    console.log('some Error has happened in API call', err)
                })
        }, 10000)
    }

    render() {
        let { temperature, humidity, flame, smoke, time_stamp } = this.state;
        const data = {
            labels: time_stamp.reverse(),
            datasets: [
              {
                label: 'Smoke',
                data: smoke.reverse(),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
              },
            ],
          };
          
          const options = {
            responsive: true, 
            maintainAspectRatio: true,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          };          
        const data2 = {
            labels: data['labels'],
            datasets: [
                {
                    label: 'Temperature',
                    data: temperature.reverse(),
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                },
              ],
        } 
        const data3 = {
            labels: data['labels'],
            datasets: [
                {
                    label: 'Humidity',
                    data: humidity.reverse(),
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgb(18, 170, 0, 0.4)',
                    borderColor: 'rgba(18, 170, 0,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(18, 170, 0,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(18, 170, 0,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                },
              ],
        } 
        const data4 = {
            labels: data['labels'],
            datasets: [
                {
                    label: 'Flame',
                    data: flame.reverse(),
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgb(225, 46, 36, 0.4)',
                    borderColor: 'rgba(225, 46, 36,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(225, 46, 36,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(225, 46, 36,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                },
              ],
        } 
        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-6">
                    <Line data={data} options={options} />
                    </div>
                    <div className="col-md-6">
                        <Line data={data2} options={options} />
                    </div>
                    <div className="col-md-6">
                        <Line data={data3} options={options} />
                    </div>
                    <div className="col-md-6">
                        <Line data={data4} options={options} />
                    </div>
                </div>
            </div>            
        )
    }
    
}

export default Dashboard
