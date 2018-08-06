import { Injectable, NgZone } from '@angular/core';
import { Geolocation , Geoposition } from '@ionic-native/geolocation'
import { BackgroundGeolocation , BackgroundGeolocationConfig , BackgroundGeolocationResponse  } from '@ionic-native/background-geolocation';
import 'rxjs/add/operator/filter'

@Injectable()
export class LocationTrackerProvider {
  public watch : any ;
  public lat : number =  0 ;
  public lng : number = 0 ;

  constructor(
    public zone : NgZone ,
    public backgroundGeolocation : BackgroundGeolocation,
    public geolocation : Geolocation 
  ) {
    // console.log('Hello LocationTrackerProvider Provider');
  }

  startTracking(){  //开始追踪
    this.backgroundGeolocation.start()
    let config : BackgroundGeolocationConfig = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      stopOnTerminate: false, 
      interval: 2000
    }

    this.backgroundGeolocation.configure(config).subscribe((location : BackgroundGeolocationResponse ) => {
      console.log(location)
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      // alert('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
    }, (err) => {
      console.error(err);  
    });

    // 打开定位系统
    this.backgroundGeolocation.start();
 
 
    // 前台跟踪定位
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };
 
    this.watch = this.geolocation.watchPosition(options)
      .filter((p: any) => 
        p.code === undefined
      )
      .subscribe((position: Geoposition) => {
        console.log(position);
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log('定位:  ' + this.lat + ',' + this.lng);
          // alert('定位:  ' + this.lat + ',' + this.lng);
        })
      })

  }

  stopTracking(){ //停止追踪
    // this.backgroundGeolocation.stop();
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

}
