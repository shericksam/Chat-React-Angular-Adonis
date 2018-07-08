import {NgModule, Optional, SkipSelf} from '@angular/core';
import {MockBackend} from "@angular/http/testing";
import {BaseRequestOptions} from "@angular/http";
import { StorageService } from '../servicios/storage/storage.service';
import { AuthorizatedGuard } from '../servicios/guard/authorizated.guard';
import { fakeBackendProvider } from '../servicios/server/fake-backend';

@NgModule({
  declarations: [  ],
  imports: [],
  providers: [
    StorageService,
    AuthorizatedGuard,
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: []
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}