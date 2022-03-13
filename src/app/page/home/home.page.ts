import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild("hrBarCanvas") hrBarCanvas: ElementRef;
  @ViewChild("pamtBarCanvas") payoutAmtbarCanvas: ElementRef;
  @ViewChild("bpaiCanvas") bpaiCanvas: ElementRef;
  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("ipcMixedCanvas") ipcMixedCanvas: ElementRef;
  @ViewChild("grpMixedCanvas") grpMixedCanvas: ElementRef;

  private hrBarChart: Chart;
  private pamtBarChart: Chart;
  private bpaiChart: Chart;
  private ipcMixedChart: Chart;
  private barChart: Chart;
  private grpMixedChart: Chart;
  public descriptionShow=false;
  public cardList=[{name:'Total Business Partner Managed',value:'123',expand:false},{name:'Total Business Partner Managed',value:'12',expand:true}]

  constructor(private alert: AlertController) { }
  ngAfterViewInit() {


    this.ipcMixedChart = new Chart(this.ipcMixedCanvas.nativeElement, {
      type: 'bar',       // set the default type
      data: {
        labels: ["Mar 21", "Jan 21"],
        datasets: [{
          label: 'Number Penetration',
          data: [50],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)"
          ],
          borderColor: [
            "rgba(255,99,132,1)"
          ],
          yAxisID: 'left-y-axis',
        }, {

          label: 'Value Penetration',
          data: [0.030, 0],
          type: 'line',
          fill: false,
          borderColor: ['rgb(255, 119, 15)'],
          yAxisID: 'right-y-axis',
        }]
      },
      options: {
        scales: {
          yAxes: [
            {
              id: 'left-y-axis',
              type: 'linear',
              position: 'left'
            }, {
              id: 'right-y-axis',
              type: 'linear',
              position: 'right'
            }]
        }
      }
    });



    this.grpMixedChart = new Chart(this.grpMixedCanvas.nativeElement, {
      type: 'bar',       // set the default type
      data: {
        labels: ["Mar 21", "Jan 21"],
        datasets: [{
          label: 'Vol',
          data: [1.8],
          backgroundColor: [
            "rgba(255, 72, 5, 1)"
          ],
          yAxisID: 'left-y-axis'
        },
        {
          label: 'PF%',
          data: [1.0],
          backgroundColor: [
            "rgba(255, 184, 5, 1)"
          ],
          yAxisID: 'left-y-axis',
        },
        {
          label: 'Brokerage%',
          data: [0.7],
          backgroundColor: [
            "rgba(13, 5, 255, 1)"
          ],
          yAxisID: 'left-y-axis',
        },
        {

          label: 'COA',
          data: [1.5, 0],
          type: 'line',
          fill: false,
          borderColor: ['rgb(255, 20, 126)'],
          yAxisID: 'right-y-axis'
        }]
      },
      options: {
        scales: {
          yAxes: [
            {
              id: 'left-y-axis',
              type: 'linear',
              position: 'left'
            }, {
              id: 'right-y-axis',
              type: 'linear',
              position: 'right'
            }]
        }
      }
    });


    this.hrBarChart = new Chart(this.hrBarCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: ['RM_REVIEW', 'BIU_REVIEW', 'PH_REVIEW',
          'BH_REVIEW', 'GH_REVIEW', 'DH_REVIEW',
          'OPS_REVIEW', 'DSA_REVIEW'],
        datasets: [{
          label: 'Workflow Pending Tasks',
          data: [1.0, 0, 0, 0, 0, 0, 0, 0],
          backgroundColor: ['rgba(255, 159, 5, 1)',
           'rgba(255, 205, 5, 1)', 
           'rgba(76, 192, 53, 1)', 
           'rgba(255, 161, 191, 1)', 
           'rgba(75, 161, 255, 1)', 
           'rgba(96, 161, 191, 1)', 
           'rgba(82, 255, 15, 1)', 
           'rgba(150, 255, 191, 1)'],
          borderColor: ['rgba(255, 159, 5, 1)', 
          'rgba(255, 205, 5, 1)', 
          'rgba(76, 192, 53, 1)', 
          'rgba(255, 161, 191, 1)', 
          'rgba(75, 161, 255, 1)', 
          'rgba(96, 161, 191, 1)', 
          'rgba(82, 255, 15, 1)', 
          'rgba(150, 255, 191, 1)'],
          borderWidth: 1
        }]
      }
    });


    this.pamtBarChart = new Chart(this.payoutAmtbarCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Mar 21", "Jan 21"],
        datasets: [
          {
            label: "Payout Amount",
            data: [0.03, 0],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(200, 199, 132, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(200,199,132,1)"
            ],
            borderWidth: 1
          }
        ]
      }
    });


    this.bpaiChart = new Chart(this.bpaiCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Mar 21", "Jan 21"],
        datasets: [
          {
            label: ["Business Partner Active %"],
            data: [100, 0],
            backgroundColor: [
              "rgb(87, 20, 255)",
              "rgb(255, 159, 64)"
            ],
            borderColor: [
              "rgb(87, 20, 255)",
              "rgba(200,199,132,1)"
            ],
            borderWidth: 1
          },
          {
            label: "Business Partner Inactive %",
            data: [0, 100],
            backgroundColor: [
              "rgb(87, 20, 255)",
              "rgb(255, 159, 64)"
            ],
            borderColor: [
              "rgb(87, 20, 255)",
              "rgba(200,199,132,1)"
            ],
            borderWidth: 1
          }
        ]
      }
    });
  }
  ngOnInit() {

  }


  openAlert(){
    this.alert.create({
      header: 'Business Partner Details',
      message: 'No. of Business Partner Active- 1',
      buttons: [{
        text: 'Okay'
      }]
    }).then(res => {

      res.present();

    });

  }


  openDes(){
    if(!this.descriptionShow){
      this.descriptionShow=true;
    }
    else this.descriptionShow=false;
    
  }


}
