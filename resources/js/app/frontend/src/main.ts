import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { importProvidersFrom } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app/app";
import { routes } from "./app/app.routes";
import { CredentialsInterceptor } from "./app/interceptors/credentials-interceptor";
import { ErrorInterceptor } from "./app/interceptors/error-interceptor";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    { provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
}).catch((err:any) => console.error(err));
'@ | Set-Content -Path .\src\main.ts -Encoding utf8'