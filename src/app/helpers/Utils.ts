import { HttpHeaders } from '@angular/common/http';

export default class Utils {
  //declare BASE_URL
  static BASE_URL = 'http://localhost:8080/api/';

  static getHeaders() {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    return headers;
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  static formatAmount(amount) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'KES',
    });
  }

  static formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
  }

  static formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/^0/, '');
  }

  static saveUserData(phoneNumber) {
    localStorage.clear();
    localStorage.setItem('phoneNumber', phoneNumber);
  }

  static checkUserData(phoneNumber) {
    if (localStorage.getItem('phoneNumber') === phoneNumber) {
      return true;
    } else {
      localStorage.clear();
      return false;
    }
  }

  static userLoggedIn() {
    if (localStorage.length === 0) {
      return false;
    } else {
      return true;
    }
  }
}
