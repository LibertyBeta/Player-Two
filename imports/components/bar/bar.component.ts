import { Component, Input } from '@angular/core';

@Component({
  selector: 'hp-bar',
  templateUrl: 'imports/components/bar/bar.html'
})

export class HpBar {
  @Input() maxHealth:number = 0;
  @Input() currentHealth:number = 0;
  @Input() maxTemp:number = 0;
  @Input() currentTemp:number = 0;


  constructor () {
    // console.info("Page Title " + this.pageTitle);
  }

  barColor() {
    let current = 0;
    let max = 1;
    if(this.currentTemp > 0){
      current = this.currentTemp;
      max = this.maxTemp;
    } else {
      current = this.currentHealth;
      max = this.maxHealth;
    }
    if(current < (max/3)){
			return "bar danger";
		} else if (current < (max/2)) {
			return "bar warning";
		} else{
			return "bar good";
		}
  }

  hitWidth() {
    let width  = 1 - (this.currentHealth /  this.maxHealth);
    return width * 100 + "%"
  }

  tempWidth() {
    let width  = 1 - (this.currentTemp /  this.maxTemp);
    return width * 100 + "%"
  }

}
