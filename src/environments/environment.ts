// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // production: false,
  oidc_redirect_path:
    "https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20email&access_type=online&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=https://holiday-request.herokuapp.com/requester&response_type=code&client_id=859455735473-bgmqqco3q588kgaog0g2k0fmnur5qvf9.apps.googleusercontent.com&hd=turntabl.io&prompt=consent"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
