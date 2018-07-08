import { Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import { Events, Tabs , Platform } from 'ionic-angular'

import { BackbuttonProvider } from '../../providers/backbutton/backbutton';
import { CartPage } from '../cart/cart';
import { HomePage } from '../home/home';
import { MePage } from '../me/me';
import { ChatPage } from '../chat/chat'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  mb: any;

  tab1Root = HomePage;
  tab2Root = ChatPage;
  tab3Root = CartPage;
  tab4Root = MePage;

  constructor(
    private elementRef: ElementRef, 
    private renderer: Renderer, 
    private event: Events , 
    private platform : Platform,
    public backbutton : BackbuttonProvider
  ){
    this.platform.ready().then(() => {
      this.backbutton.registerBackButtonAction(this.tabRef);
    });
  }
  
  ionViewDidLoad() {
    let tabs = this.queryElement(this.elementRef.nativeElement, '.tabbar');
    this.event.subscribe('hideTabs', () => {
      this.renderer.setElementStyle(tabs, 'display', 'none');
      let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
      let content = this.queryElement(SelectTab, '.scroll-content');
      this.mb = content.style['margin-bottom'];
      this.renderer.setElementStyle(content, 'margin-bottom', '0')
    });
    this.event.subscribe('showTabs', () => {
      this.renderer.setElementStyle(tabs, 'display', '');
      let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
      let content = this.queryElement(SelectTab, '.scroll-content');
      this.renderer.setElementStyle(content, 'margin-bottom', this.mb)
    })
  }
  queryElement(elem: HTMLElement, q: string): HTMLElement {
    return <HTMLElement>elem.querySelector(q);
  }
}