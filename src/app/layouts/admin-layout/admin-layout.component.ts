import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
  PopStateEvent,
} from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import Utils from 'app/helpers/Utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor(
    public location: Location,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    //console.log(this.router);
    if (!Utils.userLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.getUserData();

    const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

    if (isWindows) {
      // if we are on windows OS we activate the perfectScrollbar function

      document
        .getElementsByTagName('body')[0]
        .classList.add('perfect-scrollbar-on');
    } else {
      document
        .getElementsByTagName('body')[0]
        .classList.remove('perfect-scrollbar-off');
    }
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    const elemSidebar = <HTMLElement>(
      document.querySelector('.sidebar .sidebar-wrapper')
    );

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });
    this._router = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        elemMainPanel.scrollTop = 0;
        elemSidebar.scrollTop = 0;
      });
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
    }
  }
  ngAfterViewInit() {
    this.runOnRouteChange();
  }
  isMap(path) {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (path == titlee) {
      return false;
    } else {
      return true;
    }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
      navigator.platform.toUpperCase().indexOf('IPAD') >= 0
    ) {
      bool = true;
    }
    return bool;
  }

  getUserData() {
    this.http
      .get(Utils.BASE_URL + 'users/get/' + localStorage.getItem('userId'))
      .subscribe(
        (data) => {
          Utils.saveUserData('assignedWarehouse', data['assignedWarehouse']);
          Utils.saveUserData('userId', data['id']);
          Utils.saveUserData('email', data['email']);
          Utils.saveUserData('firstName', data['firstName']);
          Utils.saveUserData('lastName', data['lastName']);

          //if assignedRole is not the same as existing role in local storage then update then logout
          try {
            if (
              data['assignedRole'].toString().toUpperCase() !=
              localStorage.getItem('role').toString().toUpperCase()
            ) {
              localStorage.clear();
            }
          } catch (error) {}

          //if assignedWarehouse is not the same as existing warehouse in local storage then update then logout
          if (
            data['assignedWarehouse'] !=
            localStorage.getItem('assignedWarehouse')
          ) {
            localStorage.clear();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
