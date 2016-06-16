import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'top-bar',
  templateUrl: 'imports/components/top/top.html',
  directives: [ROUTER_DIRECTIVES]
})

export class TopBar {
  @Input() pageTitle = "No Title";

  constructor () {
    console.info("Page Title " + this.pageTitle);
  }


}
